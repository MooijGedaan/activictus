import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ActivityForm from "./ActivityForm";

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
    <div className="md:flex justify-between mb-12 items-center">
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
      <div className="flex md:items-center justify-between mb-5 md:mb-0">
        <h2 className="md:text-4xl text-4xl font-medium">Week {weekNumber}</h2>

        <button
          onClick={() => {
            handleSetIsModalOpen(true);
          }}
          className="text-sm bg-black text-white md:px-4 px-2 md:py-2 py-1 md:ml-5"
        >
          Voeg activiteit toe
        </button>
      </div>

      <div className="flex items-stretch">
        <div
          onClick={prevWeek}
          className="flex-1 border-2 border-black border-r-0 px-5 py-3 flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-6 h-6 cursor-pointer" />
        </div>
        <a
          onClick={setToCurrentWeek}
          className="flex-1 text-sm cursor-pointer border-2 border-black px-5 py-3 flex items-center justify-center"
        >
          vandaag
        </a>
        <div
          onClick={nextWeek}
          className="flex-1 border-2 border-black border-l-0 px-5 py-3 flex items-center justify-center"
        >
          <ChevronRightIcon className="w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default WeekNavigation;
