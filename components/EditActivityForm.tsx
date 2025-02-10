import React, { useEffect, useState } from "react";
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

const EditActivityForm: React.FC = () => {
  const {
    handleEditInputChange,
    handleDeleteActivity,
    handleEditFormSubmit,
    handleEditFormClose,
    editActivity,
    isEditModalOpen,
  } = useAppContext();

  useEffect(() => {
    if (editActivity.Datum) {
      handleEditInputChange({
        target: { name: "Datum", value: editActivity.Datum },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [editActivity.Datum]);

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleEditFormClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bewerk Activiteit</DialogTitle>
        </DialogHeader>
        <form className="space-y-10" onSubmit={handleEditFormSubmit}>
          <div className="mb-4">
            <Label className="block text-gray-700">Datum</Label>
            <Input
              type="date"
              name="Datum"
              value={editActivity.Datum}
              onChange={handleEditInputChange}
              required
              className="mt-1 block w-full border-b-2 border-black focus:ring-black text-black"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700">Begin tijd</Label>
            <Input
              type="time"
              name="Tijd"
              value={editActivity.Tijd}
              onChange={handleEditInputChange}
              required
              className="mt-1 block w-full border-b-2 border-black focus:ring-black text-black"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700">Activiteit naam</Label>
            <Input
              type="text"
              name="Naam"
              value={editActivity.Naam}
              onChange={handleEditInputChange}
              required
              className="mt-1 block w-full border-black border-b-2 shadow-sm focus:ring-black text-black"
            />
          </div>
          <div className="mb-4">
            <Label className="block text-gray-700">Omschrijving</Label>
            <Textarea
              name="Omschrijving"
              value={editActivity.Omschrijving}
              onChange={handleEditInputChange}
              required
              className="border-b-2 border-black text-black mt-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                handleDeleteActivity(editActivity.id);
              }}
              className="bg-red-600 text-white px-4 py-2"
            >
              Verwijder
            </button>
            <Button type="submit" className="bg-black text-white px-4 py-2">
              Bewerk
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityForm;
