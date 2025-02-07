import React, { useEffect } from "react";

interface ActivityFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  activity: {
    date: string;
    time: string;
    name: string;
    description: string;
  };
  selectedDate?: string; // Add the date prop
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  onClose,
  onChange,
  activity,
  selectedDate, // Destructure the date prop
}) => {
  useEffect(() => {
    if (selectedDate && selectedDate !== activity.date) {
      onChange({
        target: { name: "date", value: selectedDate },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [selectedDate, activity.date, onChange]);

  return (
    <div className="fixed inset-0 p-5 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg p-6 w-full max-w-xl">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form className=" space-y-10" onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Datum</label>
            <input
              type="date"
              name="date"
              value={activity.date}
              onChange={onChange}
              required
              className="mt-1 block w-full border-b-2  border-black focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Begin tijd</label>
            <input
              type="time"
              name="time"
              value={activity.time}
              onChange={onChange}
              required
              className="mt-1 block w-full border-b-2  border-black focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Activiteit naam</label>
            <input
              type="text"
              name="name"
              value={activity.name}
              onChange={onChange}
              required
              className="mt-1 block w-full  border-black border-b-2 shadow-sm focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Omschrijving</label>
            <textarea
              name="description"
              value={activity.description}
              onChange={onChange}
              required
              className="mt-1 block w-full border-b-2  border-black focus:ring-black"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-black text-white px-4 py-2 ">
              Voeg toe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;
