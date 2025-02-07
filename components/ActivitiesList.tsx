import React from "react";
import DayActivities from "./DayActivities";
import { useAppContext } from "@/app/AppContext";


const ActivitiesList: React.FC = () => {

  const { daysOfWeek } = useAppContext();

  return (
    <div className="space-y-1 w-full">
      {daysOfWeek.map((day, index) => (
        <DayActivities
          key={index}
          day={day}
        />
      ))}
    </div>
  );
};

export default ActivitiesList;
