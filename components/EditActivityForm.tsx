import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/AppContext";
import { Calendar as CalendarIcon } from "lucide-react";
import { nl } from "date-fns/locale";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const EditActivityForm: React.FC = () => {
  const {
    handleEditInputChange,
    handleDeleteActivity,
    handleEditFormSubmit,
    handleEditFormClose,
    editActivity,
    isEditModalOpen,
    selectedDate,
    handleEditInputChangeDate,
  } = useAppContext();

  useEffect(() => {
    if (selectedDate && selectedDate !== editActivity.Datum) {
      handleEditInputChange({
        target: { name: "Datum", value: selectedDate },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [selectedDate]);

  const [date, setDate] = useState<Date>();

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleEditFormClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bewerk Activiteit</DialogTitle>
        </DialogHeader>
        <form className="space-y-10" onSubmit={handleEditFormSubmit}>
          <div className="mb-4">
            <Label className="block text-gray-700">Datum</Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full border-b-2 border-black border-l-0 mt-1 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-full" />
                  {date ? (
                    format(date, "PPP", { locale: nl })
                  ) : (
                    <span>Kies een datum</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  locale={nl}
                  mode="single"
                  selected={date}
                  onSelect={(e) => {
                    setDate(e);
                    if (e) {
                      handleEditInputChangeDate(e);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
