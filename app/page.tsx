import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="space-x-3">
        <Button>
          <Link href="/auth/sign-in">Entrar</Link>
        </Button>
        <Button>
          <Link href="/auth/sign-up">Cadastrar</Link>
        </Button>
      </div>
    </div>
  );
}
