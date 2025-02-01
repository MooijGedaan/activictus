import React from "react";
import "./DayActivities.css";

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

  return (
    <div className=" rounded-lg">
      <p className="text-lg mb-2 text-gray-600">{`${day.dayOfWeek}`}</p>
      <div className="border-t-4 border-black pt-1">
        <p className="text-4xl font-semibold my-2">{`${day.dayOfMonth < 10 ? "0" + day.dayOfMonth : day.dayOfMonth}`}</p>
        {activiteitenOpDag.length > 0 && (
          <>
            <ul className="mt-4 space-y-4">
              {activiteitenOpDag.map((act, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center dark:bg-neutral-800 border-l-4 border-black pl-2"
                >
                  <div className="mr-4">
                    <p className="font-semibold text-lg">{act.Naam}</p>
                    <p className="text-gray-700">{act.Omschrijving}</p>
                    <p className="text-sm text-gray-500">
                      {act.attendees.join(", ")}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => addAanwezigheid(act.id)}
                      className="bg-black text-white px-4 py-2 hover:bg-blue-600 transition"
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
        <p className="hover-text">Voeg activiteit toe</p>
      </div>
    </div>
  );
};

export default DayActivities;
