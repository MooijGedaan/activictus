import React, { useEffect } from "react";
import { useAppContext } from "@/app/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ActivityForm: React.FC = () => {
  const {
    handleInputChange,
    handleFormSubmit,
    handleFormClose,
    newActivity,
    isModalOpen,
    selectedDate,
  } = useAppContext();

  useEffect(() => {
    if (selectedDate && selectedDate !== newActivity.Datum) {
      handleInputChange({
        target: { name: "Datum", value: selectedDate },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [selectedDate]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleFormClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Voeg activiteit toe</DialogTitle>
        </DialogHeader>
        <form className="space-y-10 mt-5" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <Label className="block text-gray-700">Datum</Label>
            <Input
              type="date"
              name="Datum"
              value={newActivity.Datum}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-b-2 border-black focus:ring-black text-black"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700">Begin tijd</Label>
            <Input
              type="time"
              name="Tijd"
              value={newActivity.Tijd}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-b-2 border-black focus:ring-black text-black"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700">Activiteit naam</Label>
            <Input
              type="text"
              name="Naam"
              value={newActivity.Naam}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-black border-b-2 shadow-sm focus:ring-black text-black"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700">Omschrijving</Label>
            <Textarea
              name="Omschrijving"
              value={newActivity.Omschrijving}
              onChange={handleInputChange}
              required
              className="border-b-2 border-black text-black mt-2"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-black text-white px-4 py-2">
              Voeg toe
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
