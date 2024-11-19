"use client";

import { BeatLoader } from "react-spinners";
import { useExitModal } from "@/hooks/use-exit-modal";

export const ExitModal = () => {
  const { isOpen } = useExitModal();

  if (isOpen)
    return (
      <div className="fixed flex justify-center items-center h-full inset-0 z-50 bg-black/80">
        <BeatLoader color="#FFFFFF" />
      </div>
    );
};
