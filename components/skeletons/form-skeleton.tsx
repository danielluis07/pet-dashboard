"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const FormSkeleton = () => {
  return (
    <div className="space-y-3 w-full lg:w-1/2">
      <Skeleton className="size-56" />
      <div className="mt-8 space-y-5">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  );
};
