import React from "react";

interface DayActivitiesProps {
  day: { formatted: string; iso: string };
  activiteiten: any[];
  addAanwezigheid: (id: string) => void;
}

const DayActivities: React.FC<DayActivitiesProps> = ({
  day,
  activiteiten,
  addAanwezigheid,
}) => {
  const activiteitenOpDag = activiteiten
    .filter((a) => a.Datum === day.iso)
    .sort((a, b) => a.Tijd.localeCompare(b.Tijd));

  return (
    <div>
      <p className="text-md">{day.formatted}</p>
      {activiteitenOpDag.length > 0 ? (
        <>
          <ul className="mt-4 rounded space-y-4">
            {activiteitenOpDag.map((act, i) => (
              <li
                key={i}
                className="flex dark:bg-neutral-900 p-2 bg-gray-100 justify-between items-center"
              >
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
          <p className="mt-2 text-gray-500">Voeg activiteit toe</p>
        </>
      ) : (
        <p className="text-gray-500">
          Geen activiteiten, <a>voeg activiteit toe</a>
        </p>
      )}
    </div>
  );
};

export default DayActivities;
