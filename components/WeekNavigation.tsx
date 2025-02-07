import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ActivityForm from "./ActivityForm";
import { getMonthName } from "@/utils/dateUtils";

interface HandleInputChangeEvent
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}
interface FormSubmitEvent extends React.FormEvent<HTMLFormElement> {}

interface WeekNavigationProps {
  weekNumber: number;
  prevWeek: () => void;
  nextWeek: () => void;
  setToCurrentWeek: () => void;
  handleInputChange: (e: HandleInputChangeEvent) => void;
  handleFormSubmit: (e: FormSubmitEvent) => void;
  handleSetIsModalOpen: (isOpen: boolean, date?: string) => void;
  isModalOpen: boolean;
  selectedDate?: string; // Add the date prop: string;
  monthName: string;
  year: string;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  weekNumber,
  prevWeek,
  nextWeek,
  setToCurrentWeek,
  handleInputChange,
  handleFormSubmit,
  handleSetIsModalOpen,
  isModalOpen,
  selectedDate,
  monthName,
  year,
}) => {
  const [newActivity, setNewActivity] = useState({
    date: "",
    time: "",
    name: "",
    description: "",
  });

  const handleFormClose = () => {
    handleSetIsModalOpen(false);
    setNewActivity({
      date: "",
      time: "",
      name: "",
      description: "",
    });
  };

  return (
    <div className="md:flex justify-between mb-12">
      {isModalOpen && (
        <ActivityForm
          onSubmit={(e) => {
            handleFormSubmit(e);
            handleFormClose();
          }}
          onClose={handleFormClose}
          onChange={(e) => {
            handleInputChange(e);
            setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
          }}
          activity={newActivity}
          selectedDate={selectedDate}
        />
      )}
      <div className="mb-5 md:mb-0 flex flex-row md:flex-col justify-between">
        <h2 className="md:text-4xl text-4xl font-medium">
          [{monthName}] Week {weekNumber}
        </h2>
        <button
          onClick={() => {
            handleSetIsModalOpen(true);
          }}
          className="text-sm bg-black dark:bg-white dark:text-black text-white md:px-4 md:py-2 px-3 py-2 hover:bg-yellow-400 md:mt-4"
        >
          Voeg activiteit toe
        </button>
      </div>

      <div className="flex items-stretch cursor-pointer">
        <div
          onClick={prevWeek}
          className="flex-1 border-2 dark:border-white border-black border-r-0 px-7 py-3 flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </div>
        <a
          onClick={setToCurrentWeek}
          className="flex-1 text-sm cursor-pointer border-2 dark:border-white border-black px-7 py-3 flex items-center justify-center"
        >
          vandaag
        </a>
        <div
          onClick={nextWeek}
          className="flex-1 border-2 dark:border-white border-black border-l-0 px-7 py-3 flex items-center justify-center"
        >
          <ChevronRightIcon className="w-6 h-6 " />
        </div>
      </div>
    </div>
  );
};

export default WeekNavigation;
