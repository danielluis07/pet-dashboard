import { auth } from "@/auth";
import { AdminSidebar } from "@/app/dashboard/_components/admin-sidebar";
import { Navbar } from "@/app/dashboard/_components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ExitModal } from "@/components/exit-modal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-col w-full h-full py-7 px-9">
        <Navbar user={session.user} />
        {children}
        <ExitModal />
      </main>
    </SidebarProvider>
  );
}
