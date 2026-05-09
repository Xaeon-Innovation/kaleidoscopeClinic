import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin",
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

