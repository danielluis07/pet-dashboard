"use client";

import { useEffect, useState } from "react";
import { NewCategorySheet } from "@/app/dashboard/categories/_components/sheets/new-category-sheet";
import { EditCategorySheet } from "@/app/dashboard/categories/_components/sheets/edit-category-sheet";

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewCategorySheet />
      <EditCategorySheet />
    </>
  );
};
