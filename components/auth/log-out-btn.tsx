"use client";

import { logOut } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useExitModal } from "@/hooks/use-exit-modal"; // Assuming this is the path to your Zustand store

export const LogOutBtn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { onOpen, onClose } = useExitModal();

  const onLogOut = () => {
    onOpen();
    startTransition(() => {
      logOut()
        .then(() => {
          router.push("/");
          onClose();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to log out.");
        });
    });
  };

  return (
    <Button
      variant="link"
      onClick={onLogOut}
      className="hover:text-default-orange">
      <LogOut />
      Sair
    </Button>
  );
};
