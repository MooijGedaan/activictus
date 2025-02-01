import React from "react";
import DayActivities from "./DayActivities";

interface ActivitiesListProps {
  daysOfWeek: { formatted: string; iso: string }[];
  activiteiten: any[];
  addAanwezigheid: (id: string) => void;
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({
  daysOfWeek,
  activiteiten,
  addAanwezigheid,
}) => {
  return (
    <div className="space-y-8 w-full">
      {daysOfWeek.map((day, index) => (
        <DayActivities
          key={index}
          day={day}
          activiteiten={activiteiten}
          addAanwezigheid={addAanwezigheid}
        />
      ))}
    </div>
  );
};

export default ActivitiesList;
