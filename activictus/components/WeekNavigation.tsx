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
    <div className="flex justify-between mb-12 items-center">
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
      <h2 className="text-4xl font-medium">Week {weekNumber}</h2>

      <div className="flex items-center space-x-9">
        <ChevronLeftIcon
          onClick={prevWeek}
          className="cursor-pointer h-5 w-5"
        />
        <a onClick={setToCurrentWeek} className="text-sm cursor-pointer">
          vandaag
        </a>
        <ChevronRightIcon
          onClick={nextWeek}
          className="cursor-pointer h-5 w-5"
        />
      </div>
      <button
        onClick={() => {
          handleSetIsModalOpen(true);
        }}
        className="text-sm bg-black text-white px-4 py-2"
      >
        Voeg activiteit toe
      </button>
    </div>
  );
};

export default WeekNavigation;
