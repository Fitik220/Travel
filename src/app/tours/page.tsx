"use client";

import { Suspense } from "react";
import { TourBuilder } from "@/components/TourBuilder";

export default function ToursPage() {
  return (
    <Suspense fallback={null}>
      <TourBuilder />
    </Suspense>
  );
}
