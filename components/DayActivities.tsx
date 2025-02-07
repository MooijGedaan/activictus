import React from "react";
import "./DayActivities.css";
import { useEffect } from "react";
import { useAppContext } from "@/app/AppContext";


interface DayActivitiesProps {
  day: { dayOfWeek: string; dayOfMonth: number; month: string; iso: string };
}

const DayActivities: React.FC<DayActivitiesProps> = ({
  day,
}) => {
  const { daysOfWeek, activiteiten, addAanwezigheid, handleSetIsModalOpen, handleSetIsEditModalOpen } = useAppContext();

  const activiteitenOpDag = activiteiten
    .filter((a) => a.Datum === day.iso)
    .sort((a, b) => a.Tijd.localeCompare(b.Tijd));


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
                  className="flex md:flex-row flex-col justify-between md:items-center dark:border-white border-l-4 border-black pl-2"
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
                  <div className="flex md:flex-col flex-row space-y-0 md:mt-0 mt-2">
                    <button
                      onClick={() => addAanwezigheid(act.id)}
                      className="bg-black text-white dark:bg-white dark:text-black md:w-28 w-full h-10 hover:bg-yellow-400 transition"
                    >
                      Aanwezig
                    </button>
                    <a onClick={() => handleSetIsEditModalOpen(true, act)} className="border-black border-2 md:border-t-0 border-l-0 md:w-28 w-full h-10 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:text-yellow-300">Wijzig</a>
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
        <p className="hover-text dark:text-white">Voeg activiteit toe</p>
      </div>
    </div >
  );
};

export default DayActivities;
