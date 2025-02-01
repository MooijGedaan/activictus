import React from "react";

interface WeekNavigationProps {
  weekNumber: number;
  prevWeek: () => void;
  nextWeek: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  weekNumber,
  prevWeek,
  nextWeek,
}) => {
  return (
    <div className="flex justify-between space-x-20 mb-12">
      <h2 className="text-2xl bold">Week {weekNumber}</h2>
      <button onClick={prevWeek}>Vorige Week</button>
      <button onClick={nextWeek}>Volgende Week</button>
    </div>
  );
};

export default WeekNavigation;
