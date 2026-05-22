import { redirect } from "next/navigation";

/** Manual Firestore slots are retired — availability uses Google Calendar. */
export default function AdminSlotsPage() {
  redirect("/admin/settings");
}
