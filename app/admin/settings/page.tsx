import { Suspense } from "react";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
            Settings
          </h1>
          <p className="text-sm text-black/50">Loading…</p>
        </div>
      }
    >
      <AdminSettingsClient />
    </Suspense>
  );
}
