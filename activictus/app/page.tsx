"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import WeekNavigation from "@/components/WeekNavigation";
import ActivitiesList from "@/components/ActivitiesList";
import { getWeekNumber, getStartOfWeek, formatDate } from "@/utils/dateUtils";

export default function Home() {
  const [activiteiten, setActiviteiten] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      let { data: activiteitenData, error: activiteitenError } = await supabase
        .from("activiteiten")
        .select("id, Naam, Datum, Omschrijving");
      if (activiteitenError) {
        console.error("Error fetching activities:", activiteitenError);
        return;
      }

      let { data: inschrijvingenData, error: inschrijvingenError } =
        await supabase.from("inschrijvingen").select("activiteit_id, naam_lid");
      if (inschrijvingenError) {
        console.error("Error fetching registrations:", inschrijvingenError);
        return;
      }

      if (activiteitenData && inschrijvingenData) {
        const cleanedData = activiteitenData.map((activiteit) => {
          const attendees = inschrijvingenData
            .filter(
              (inschrijving) => inschrijving.activiteit_id === activiteit.id
            )
            .map((inschrijving) => inschrijving.naam_lid);

          return {
            ...activiteit,
            Datum: activiteit.Datum.split("T")[0],
            Tijd: activiteit.Datum.split("T")[1],
            attendees,
          };
        });
        setActiviteiten(cleanedData);
      }
    };

    fetchData();
  }, []);

  const weekNumber = getWeekNumber(currentDate);

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const startOfWeek = getStartOfWeek(currentDate);

  const nameInput = () => {
    let person = prompt("Wat is je naam?", "");
    const d = new Date();
    d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365);
    let expires = "expires=" + d.toUTCString();
    document.cookie = "name=" + person + ";" + expires + ";path=/";
  };

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return {
      formatted: day.toLocaleString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      iso: formatDate(day),
    };
  });

  const addAanwezigheid = async (id: string) => {
    const supabase = createClient();

    const getNameFromCookies = () => {
      const cookies = document.cookie.split(";");
      const nameCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("name=")
      );
      return nameCookie ? nameCookie.split("=")[1] : null;
    };

    let person = getNameFromCookies();

    while (!person || person === "null") {
      nameInput();
      person = getNameFromCookies();
    }

    if (!person) {
      alert("Er is een probleem opgetreden bij het verkrijgen van de naam.");
      return;
    }

    const activiteit = activiteiten.find((act) => act.id === id);
    if (activiteit && activiteit.attendees.includes(person)) {
      alert("Je bent al geregistreerd voor deze activiteit.");
      return;
    }

    const { data, error } = await supabase
      .from("inschrijvingen")
      .insert([{ activiteit_id: id, naam_lid: person }])
      .select();

    if (!error) {
      setActiviteiten((prevActiviteiten) =>
        prevActiviteiten.map((act) =>
          act.id === id
            ? { ...act, attendees: [...act.attendees, person] }
            : act
        )
      );
    }
  };

  return (
    <div className="max-w-lg">
      <WeekNavigation
        weekNumber={weekNumber}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />
      <ActivitiesList
        daysOfWeek={daysOfWeek}
        activiteiten={activiteiten}
        addAanwezigheid={addAanwezigheid}
      />
    </div>
  );
}
