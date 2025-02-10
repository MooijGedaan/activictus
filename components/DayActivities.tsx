import React, { useEffect, useState } from "react";
import "./DayActivities.css";
import { useAppContext } from "@/app/AppContext";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import ShareModal from "./ShareModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditActivityForm from "./EditActivityForm";

interface DayActivitiesProps {
  day: { dayOfWeek: string; dayOfMonth: number; month: string; iso: string };
}

const DayActivities: React.FC<DayActivitiesProps> = ({ day }) => {
  const {
    isShareModalOpen,
    activiteiten,
    addAanwezigheid,
    handleSetIsModalOpen,
    handleSetIsEditModalOpen,
    handleSetIsShareModalOpen,
    setEditActivity,
    isEditModalOpen,
  } = useAppContext();

  const activiteitenOpDag = activiteiten
    .filter((a) => a.Datum === day.iso)
    .sort((a, b) => a.Tijd.localeCompare(b.Tijd));

  const [currentPerson, setCurrentPerson] = useState("");
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  const [isDialogShareOpen, setIsDialogShareOpen] = useState(false);

  useEffect(() => {
    const name = document.cookie
      .split("; ")
      .find((row) => row.startsWith("name="))
      ?.split("=")[1];
    setCurrentPerson(name || "");
  }, []);

  return (
    <div className=" dark:text-white">
      {isEditModalOpen && <EditActivityForm />}
      <p className="md:text-lg text-md mb-2 text-gray-600">{`${day.dayOfWeek}`}</p>
      <div className="border-t-4 border-black dark:border-white pt-1">
        <p className="md:text-4xl text-3xl font-semibold my-2">{`${day.dayOfMonth < 10 ? "0" + day.dayOfMonth : day.dayOfMonth}`}</p>
        {activiteitenOpDag.length > 0 && (
          <>
            <ul className="md:mt-4 mt-2 md:space-y-4 space-y-6">
              {activiteitenOpDag.map((act, i) => (
                <li
                  key={i}
                  className="flex md:flex-row flex-col justify-between md:items-center dark:border-white border-l-4 border-black pl-2"
                >
                  <div className="mr-4">
                    <p className="font-semibold md:text-xl text-md ">
                      {act.Naam}
                    </p>
                    <p className="text-gray-700 text-sm md:text-md dark:text-white">
                      {act.Omschrijving}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-white">
                      {act.attendees.length > 0 && act.attendees.length + " - "}
                      {act.attendees.join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-row md:w-auto w-full md:mt-0 mt-2">
                    <div className="flex md:flex-col flex-row space-y-0 w-full md:w-auto">
                      <button
                        onClick={() =>
                          addAanwezigheid(
                            act.id,
                            act.attendees.includes(currentPerson)
                          )
                        }
                        className="bg-black text-white dark:bg-white dark:text-black md:w-28 w-full md:h-10 h-8 hover:bg-yellow-400 transition"
                      >
                        {act.attendees.includes(currentPerson)
                          ? "Afwezig"
                          : "Aanwezig"}
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="border-black border-2 md:border-t-0 md:border-l-2 border-l-0 md:w-28 w-full md:h-10 h-8 flex items-center justify-center cursor-pointer hover:border-yellow-400 hover:text-yellow-300 dark:border-white">
                          Acties
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              handleSetIsEditModalOpen(true);
                              setEditActivity(act);
                            }}
                          >
                            Activiteit aanpassen
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setIsDialogShareOpen(true)}
                          >
                            Delen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Dialog
                        open={isDialogShareOpen}
                        onOpenChange={setIsDialogShareOpen}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Activiteit delen</DialogTitle>
                            <DialogDescription>
                              Door deze url te delen, schrijft de ontvanger zich
                              direct in voor de activiteit.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="link" className="sr-only">
                                Link
                              </Label>
                              <Input
                                id="link"
                                defaultValue={
                                  window.location.origin +
                                  "/?id=" +
                                  act.id +
                                  "&share=true"
                                }
                                readOnly
                                className="border-2 border-gray-100 py-1 px-2 rounded-md w-full"
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="px-3"
                              onClick={() => {
                                const linkInput = document.getElementById(
                                  "link"
                                ) as HTMLInputElement;
                                if (linkInput) {
                                  linkInput.select();
                                  document.execCommand("copy");
                                }
                              }}
                            >
                              <span className="sr-only">Copy</span>
                              <Copy />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {isShareModalOpen && (
                      <ShareModal
                        onClose={() => handleSetIsShareModalOpen(false)}
                      />
                    )}

                    {isDialogEditOpen && <EditActivityForm />}
                    {/* <div
                      onClick={() => {
                        setShareID(String(act.id));
                        handleSetIsShareModalOpen(true);
                      }}
                      className="flex flex-col items-center justify-center border-2 border-black border-l-0 p-2 cursor-pointer hover:border-yellow-400 hover:text-yellow-300 w-1/3 md:w-auto h-8 md:h-auto dark:border-white"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      <a className="">Delen</a>
                    </div> */}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div
        onClick={() => {
          handleSetIsModalOpen(true, day.iso);
        }}
        className="hover-box hover:cursor-pointer"
      >
        <p className="hover-text dark:text-white">Voeg activiteit toe</p>
      </div>
    </div>
  );
};

export default DayActivities;
