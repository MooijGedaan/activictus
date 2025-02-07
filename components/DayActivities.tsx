import React from "react";
import "./DayActivities.css";
import { useEffect } from "react";

interface DayActivitiesProps {
  day: { dayOfWeek: string; dayOfMonth: number; month: string; iso: string };
  activiteiten: any[];
  addAanwezigheid: (id: string) => void;
  handleSetIsModalOpen: (isOpen: boolean, date?: string) => void;
}

const DayActivities: React.FC<DayActivitiesProps> = ({
  day,
  activiteiten,
  addAanwezigheid,
  handleSetIsModalOpen,
}) => {
  const activiteitenOpDag = activiteiten
    .filter((a) => a.Datum === day.iso)
    .sort((a, b) => a.Tijd.localeCompare(b.Tijd));

  useEffect(() => {
    console.log("Updated activiteiten:", activiteiten);
  }, [activiteiten]);

  return (
    <div className=" dark:text-white">
      <p className="md:text-lg text-md mb-2 text-gray-600">{`${day.dayOfWeek}`}</p>
      <div className="border-t-4 border-black dark:border-white pt-1">
        <p className="md:text-4xl text-3xl font-semibold my-2">{`${day.dayOfMonth < 10 ? "0" + day.dayOfMonth : day.dayOfMonth}`}</p>
        {activiteitenOpDag.length > 0 && (
          <>
            <ul className="md:mt-4 mt-2 md:space-y-4 space-y-2">
              {activiteitenOpDag.map((act, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center dark:border-white border-l-4 border-black pl-2"
                >
                  <div className="mr-4">
                    <p className="font-semibold md:text-xl text-md ">
                      {act.Naam}
                    </p>
                    <p className="text-gray-700 text-sm md:text-md dark:text-white">
                      {act.Omschrijving}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-white">
                      {act.attendees.length > 0 &&
                        act.attendees.length + " - " + act.attendees.join(", ")}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => addAanwezigheid(act.id)}
                      className="bg-black text-white dark:bg-white dark:text-black md:px-4 md:py-2 px-2 py-1 hover:bg-yellow-400 transition"
                    >
                      Aanwezig
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div
        onClick={() => {
          handleSetIsModalOpen(true, day.iso);
        }}
        className="hover-box hover:cursor-pointer"
      >
        <p className="hover-text  dark:text-white">Voeg activiteit toe</p>
      </div>
    </div>
  );
};

export default DayActivities;
