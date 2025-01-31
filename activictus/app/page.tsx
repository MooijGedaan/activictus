"use client";

import { createClient } from "@/utils/supabase/client"; // Use client version
import React, { useState, useEffect } from "react";

export default function Home() {
  const [activiteiten, setActiviteiten] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Fetch activities on mount
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
            attendees,
          };
        });

        console.log(cleanedData);
        setActiviteiten(cleanedData);
      }
    };

    fetchData();
  }, []);

  const getWeekNumber = (date: Date): number => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

  const getStartOfWeek = (date: Date): Date => {
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

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

  const formatDate = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD for comparison
  };

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

    const cookies = document.cookie.split(";");
    let nameCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("name=")
    );

    let person;
    if (nameCookie) {
      person = nameCookie.split("=")[1];
    } else {
      nameInput();
      const newCookies = document.cookie.split(";");
      nameCookie = newCookies.find((cookie) =>
        cookie.trim().startsWith("name=")
      );
      person = nameCookie ? nameCookie.split("=")[1] : null;
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
    <div className="">
      <div className="flex justify-between space-x-20 mb-12">
        <h2 className="text-2xl bold">Week {weekNumber}</h2>
        <button className="" onClick={prevWeek}>
          Vorige Week
        </button>
        <button onClick={nextWeek}>Volgende Week</button>
      </div>
      <div className="space-y-8">
        {daysOfWeek.map((day, index) => {
          const activiteitenOpDag = activiteiten.filter(
            (a) => a.Datum === day.iso
          );
          return (
            <div key={index}>
              <p className="text-md">{day.formatted}</p>
              {activiteitenOpDag.length > 0 ? (
                <>
                  <ul className=" bg-gray-100 mt-4 dark:bg-neutral-900 rounded p-2">
                    {activiteitenOpDag.map((act, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <div className="mr-4">
                          <p className="font-bold">{act.Naam}</p>
                          <p>{act.Omschrijving}</p>
                          <p>Aanwezig: {act.attendees.join(", ")}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => addAanwezigheid(act.id)}
                            className="bg-blue-500 text-white rounded p-2"
                          >
                            Aanwezig
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className=" mt-2 text-gray-500">Voeg activiteit toe</p>
                </>
              ) : (
                <p className=" text-gray-500">
                  Geen activiteiten, <a>voeg activiteit toe</a>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
