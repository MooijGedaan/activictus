"use client";

import React from "react";
import { AppProvider } from "./AppContext";
import WeekNavigation from "@/components/WeekNavigation";
import ActivitiesList from "@/components/ActivitiesList";

export default function Home() {
  return (
    <AppProvider>
      <div className="font-wotfard">
        <WeekNavigation />
        <ActivitiesList />
      </div>
    </AppProvider>
  );
}
