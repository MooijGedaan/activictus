import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ActivityForm from "./ActivityForm";
import { useAppContext } from "@/app/AppContext";

import { getMonthName } from "@/utils/dateUtils";
import EditActivityForm from "./EditActivityForm";

const WeekNavigation: React.FC = () => {
  const {
    weekNumber,
    prevWeek,
    nextWeek,
    setToCurrentWeek,
    handleSetIsModalOpen,
    isModalOpen,
    monthName,
    isEditModalOpen,
  } = useAppContext();

  return (
    <div className="md:flex justify-between mb-12">
      {isModalOpen && <ActivityForm />}
      <div className="mb-5 md:mb-0 flex flex-row md:flex-col justify-between">
        <h2 className="md:text-4xl text-2xl font-medium">
          [{monthName}] Week {weekNumber}
        </h2>
        <button
          onClick={() => {
            handleSetIsModalOpen(true);
          }}
          className=" text-sm bg-black dark:bg-white dark:text-black text-white md:px-4 md:py-2 px-3 py-2 hover:bg-yellow-400 md:mt-4"
        >
          Voeg activiteit toe
        </button>
      </div>

      <div className="flex items-stretch cursor-pointer">
        <div
          onClick={prevWeek}
          className="flex-1 border-2 dark:border-white border-black border-r-0 md:px-7 md:py-3 px-5 py-2 flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-6 h-6 " />
        </div>
        <a
          onClick={setToCurrentWeek}
          className="flex-1 text-sm cursor-pointer border-2 dark:border-white border-black md:px-7 md:py-3 px-5 py-2 flex items-center justify-center"
        >
          vandaag
        </a>
        <div
          onClick={nextWeek}
          className="flex-1 border-2 dark:border-white border-black border-l-0 md:px-7 md:py-3 px-5 py-2 flex items-center justify-center"
        >
          <ChevronRightIcon className="w-6 h-6 " />
        </div>
      </div>
    </div>
  );
};

export default WeekNavigation;
