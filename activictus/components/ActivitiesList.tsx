import React from "react";
import DayActivities from "./DayActivities";

interface ActivitiesListProps {
  daysOfWeek: {
    dayOfWeek: string;
    dayOfMonth: number;
    month: string;
    iso: string;
  }[];
  activiteiten: any[];
  addAanwezigheid: (id: string) => void;
  handleSetIsModalOpen: (isOpen: boolean, date?: string) => void;
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({
  daysOfWeek,
  activiteiten,
  addAanwezigheid,
  handleSetIsModalOpen,
}) => {
  return (
    <div className="space-y-1 w-full">
      {daysOfWeek.map((day, index) => (
        <DayActivities
          key={index}
          day={day}
          activiteiten={activiteiten}
          addAanwezigheid={addAanwezigheid}
          handleSetIsModalOpen={handleSetIsModalOpen}
        />
      ))}
    </div>
  );
};

export default ActivitiesList;
