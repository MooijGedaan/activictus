import React, { useEffect } from "react";

interface ActivityFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  activity: {
    Datum: string;
    Tijd: string;
    Naam: string;
    Omschrijving: string;
  };
  selectedDate?: string; // Add the date prop
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  onClose,
  onChange,
  activity,
  selectedDate,
}) => {
  useEffect(() => {
    if (selectedDate && selectedDate !== activity.Datum) {
      onChange({
        target: { name: "Datum", value: selectedDate },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [selectedDate]);

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
              name="Datum"
              value={activity.Datum}
              onChange={onChange}
              required
              className="mt-1 block w-full border-b-2  border-black focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Begin tijd</label>
            <input
              type="time"
              name="Tijd"
              value={activity.Tijd}
              onChange={onChange}
              required
              className="mt-1 block w-full border-b-2  border-black focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Activiteit naam</label>
            <input
              type="text"
              name="Naam"
              value={activity.Naam}
              onChange={onChange}
              required
              className="mt-1 block w-full  border-black border-b-2 shadow-sm focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Omschrijving</label>
            <textarea
              name="Omschrijving"
              value={activity.Omschrijving}
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