import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  getWeekNumber,
  getStartOfWeek,
  formatDate,
  getMonthName,
} from "@/utils/dateUtils";

interface AppContextProps {
  activiteiten: any[];
  currentDate: Date;
  isModalOpen: boolean;
  newActivity: any;
  selectedDate: string | undefined;
  weekNumber: number;
  monthName: string;
  year: number;
  daysOfWeek: any[];
  handleSetIsModalOpen: (isOpen: boolean, date?: string) => void;
  handleFormClose: () => void;
  setNewActivity: (activity: any) => void;
  nextWeek: () => void;
  prevWeek: () => void;
  setToCurrentWeek: () => void;
  handleInputChange: (e: any) => void;
  handleInputChangeDate: (e: Date) => void;
  handleFormSubmit: (e: any) => void;
  addAanwezigheid: (id: string, remove?: boolean) => void;
  isEditModalOpen: boolean;
  editActivity: any;
  handleSetIsEditModalOpen: (isOpen: boolean, activity?: any) => void;
  handleEditInputChange: (e: any) => void;
  handleEditFormSubmit: (e: any) => void;
  handleEditFormClose: () => void;
  handleDeleteActivity: (id: string) => void;
  isShareModalOpen: boolean;
  handleSetIsShareModalOpen: (isOpen: boolean, message?: string) => void;
  shareID: string;
  setShareID: (id: string) => void;
  setEditActivity: (activity: any) => void;
  setSelectedDate: (date: string | undefined) => void;
  handleEditInputChangeDate: (e: Date) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activiteiten, setActiviteiten] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    Datum: "",
    Tijd: "",
    Naam: "",
    Omschrijving: "",
  });
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState({
    Datum: "",
    Tijd: "",
    Naam: "",
    Omschrijving: "",
    id: "",
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareID, setShareID] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSetIsShareModalOpen = (isOpen: boolean, message?: string) => {
    setIsShareModalOpen(isOpen);
  };

  const handleSetIsModalOpen = (isOpen: boolean, date?: string) => {
    setIsModalOpen(isOpen);
    if (date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleFormClose = () => {
    setIsModalOpen(false);
    setNewActivity({
      Datum: "",
      Tijd: "",
      Naam: "",
      Omschrijving: "",
    });
  };

  const handleEditFormClose = () => {
    setIsEditModalOpen(false);
    setEditActivity({
      Datum: "",
      Tijd: "",
      Naam: "",
      Omschrijving: "",
      id: "",
    });
  };

  const handleSetIsEditModalOpen = (isOpen: boolean, activity?: any) => {
    setIsEditModalOpen(isOpen);
    if (activity) {
      setEditActivity(activity);
    }
  };

  const handleEditInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditActivity((prevEditActivity: any) => ({
      ...prevEditActivity,
      [name]: value,
    }));
  };

  const handleEditInputChangeDate = (e: Date) => {
    setEditActivity((prevEditActivity: any) => ({
      ...prevEditActivity,
      Datum: formatDate(e),
    }));
  };

  const handleEditFormSubmit = async (e: any) => {
    e.preventDefault();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("activiteiten")
      .update({
        Datum: editActivity.Datum + "T" + editActivity.Tijd,
        Naam: editActivity.Naam,
        Omschrijving: editActivity.Omschrijving,
      })
      .eq("id", editActivity.id)
      .select();

    if (!error) {
      let { data: inschrijvingenData, error: inschrijvingenError } =
        await supabase.from("inschrijvingen").select("activiteit_id, naam_lid");
      if (inschrijvingenError) {
        console.error("Error fetching registrations:", inschrijvingenError);
        return;
      }
      const attendees = inschrijvingenData
        ? inschrijvingenData
            .filter(
              (inschrijving) => inschrijving.activiteit_id === editActivity.id
            )
            .map((inschrijving) => inschrijving.naam_lid)
        : [];

      const updatedActivity = data[0];
      const parsedActivity = {
        ...updatedActivity,
        Datum: updatedActivity.Datum.split("T")[0],
        Tijd: updatedActivity.Datum.split("T")[1],
        attendees: attendees,
      };

      setActiviteiten((prevActiviteiten) =>
        prevActiviteiten.map((act) =>
          act.id === editActivity.id ? parsedActivity : act
        )
      );
      setIsEditModalOpen(false);
    } else {
      alert(error);
      console.log(error);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    const supabase = createClient();

    const { error } = await supabase.from("activiteiten").delete().eq("id", id);

    if (!error) {
      setActiviteiten((prevActiviteiten) =>
        prevActiviteiten.filter((act) => act.id !== id)
      );
      setIsEditModalOpen(false);
    } else {
      alert(error);
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        let { data: activiteitenData, error: activiteitenError } =
          await supabase
            .from("activiteiten")
            .select("id, Naam, Datum, Omschrijving");
        if (activiteitenError) {
          throw new Error(
            "Error fetching activities: " + activiteitenError.message
          );
        }

        let { data: inschrijvingenData, error: inschrijvingenError } =
          await supabase
            .from("inschrijvingen")
            .select("activiteit_id, naam_lid");
        if (inschrijvingenError) {
          throw new Error(
            "Error fetching registrations: " + inschrijvingenError.message
          );
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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && activiteiten) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const share = urlParams.get("share");

      if (id && share == "true") {
        addAanwezigheid(id, false);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("id");
        newUrl.searchParams.delete("share");
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
  }, [activiteiten, loading]);

  const weekNumber = getWeekNumber(currentDate);
  const monthName = getMonthName(currentDate);
  const year = currentDate.getFullYear();

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

  const setToCurrentWeek = () => {
    const newDate = new Date();
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
    const dayOfWeek = day.toLocaleString("nl-NL", { weekday: "long" });
    const dayOfWeekAbbreviation = dayOfWeek.slice(0, 2).toUpperCase();
    return {
      dayOfWeek: dayOfWeekAbbreviation,
      dayOfMonth: day.getDate(),
      month: day.toLocaleString("nl-NL", { month: "long" }),
      iso: formatDate(day),
    };
  });

  const addAanwezigheid = async (id: string, remove?: boolean) => {
    const supabase = createClient();

    const getNameFromCookies = () => {
      const cookies = document.cookie.split(";");
      const nameCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("name=")
      );
      return nameCookie ? nameCookie.split("=")[1] : null;
    };

    let person = getNameFromCookies();

    if (remove) {
      const { error } = await supabase
        .from("inschrijvingen")
        .delete()
        .eq("activiteit_id", id)
        .eq("naam_lid", person);

      if (!error) {
        setActiviteiten((prevActiviteiten: any[]) =>
          prevActiviteiten.map((act: any) =>
            act.id === id
              ? {
                  ...act,
                  attendees: act.attendees.filter(
                    (attendee: string) => attendee !== person
                  ),
                }
              : act
          )
        );
      } else {
        console.error("Error deleting registration:", error);
      }
    } else {
      while (!person || person === "null") {
        nameInput();
        person = getNameFromCookies();
      }

      if (!person) {
        alert("Er is een probleem opgetreden bij het verkrijgen van de naam.");
        return;
      }

      const activiteit = activiteiten.find(
        (act) => String(act.id) === String(id)
      );

      if (activiteit && activiteit.attendees.includes(person)) {
        alert("Je bent al geregistreerd voor deze activiteit.");
        return;
      }

      if (!activiteit) {
        console.log("Activiteit niet gevonden.");
        return;
      }

      const { data, error } = await supabase
        .from("inschrijvingen")
        .insert([{ activiteit_id: id, naam_lid: person }])
        .select();

      if (!error) {
        setActiviteiten((prevActiviteiten) =>
          prevActiviteiten.map((act) =>
            String(act.id) === String(id)
              ? { ...act, attendees: [...act.attendees, person] }
              : act
          )
        );
      }
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewActivity((prevNewActivity: any) => ({
      ...prevNewActivity,
      [name]: value,
    }));
  };

  const handleInputChangeDate = (e: Date) => {
    console.log(formatDate(e));
    setNewActivity((prevNewActivity: any) => ({
      ...prevNewActivity,
      Datum: formatDate(e),
    }));
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("activiteiten")
      .insert([
        {
          Datum: newActivity.Datum + "T" + newActivity.Tijd + ":00",
          Naam: newActivity.Naam,
          Omschrijving: newActivity.Omschrijving,
        },
      ])
      .select();

    if (!error) {
      const newActivityData = data[0];
      const parsedActivity = {
        ...newActivityData,
        Datum: newActivityData.Datum.split("T")[0],
        Tijd: newActivityData.Datum.split("T")[1],
        attendees: [],
      };

      setActiviteiten((prevActiviteiten) => [
        ...prevActiviteiten,
        parsedActivity,
      ]);
      setIsModalOpen(false);
    } else {
      alert(error);
      console.log(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activiteiten,
        currentDate,
        isModalOpen,
        newActivity,
        selectedDate,
        setSelectedDate,
        weekNumber,
        monthName,
        year,
        daysOfWeek,
        handleSetIsModalOpen,
        handleFormClose,
        setNewActivity,
        nextWeek,
        prevWeek,
        setToCurrentWeek,
        handleInputChange,
        handleFormSubmit,
        addAanwezigheid,
        isEditModalOpen,
        editActivity,
        handleSetIsEditModalOpen,
        handleEditInputChange,
        handleEditFormSubmit,
        handleEditFormClose,
        handleDeleteActivity,
        isShareModalOpen,
        handleSetIsShareModalOpen,
        shareID,
        setEditActivity,
        setShareID,
        handleInputChangeDate,
        handleEditInputChangeDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
