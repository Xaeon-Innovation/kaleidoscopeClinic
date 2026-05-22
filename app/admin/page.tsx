"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

type StatCard = {
  label: string;
  value: string | number;
  sub?: string;
  href: string;
  color: string;
};

type CalendarStatus = {
  connected: boolean;
  connectedEmail: string | null;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    leads: 0,
    leadsThisWeek: 0,
    bookings: 0,
    bookingsThisMonth: 0,
    testimonials: 0,
    services: 0,
  });
  const [calendar, setCalendar] = useState<CalendarStatus>({
    connected: false,
    connectedEmail: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const db = getFirebaseDb();
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [leadsSnap, bookingsSnap, testimonialsSnap, servicesSnap, calRes] =
          await Promise.all([
            getDocs(collection(db, "leads")),
            getDocs(collection(db, "appointments")),
            getDocs(
              query(
                collection(db, "testimonials"),
                where("published", "==", true)
              )
            ),
            getDocs(collection(db, "services")),
            fetch("/api/admin/google/status"),
          ]);

        const leadsThisWeek = leadsSnap.docs.filter((d) => {
          const data = d.data();
          const created = data.createdAt;
          if (!created) return false;
          const ts =
            created instanceof Timestamp ? created.toDate() : new Date(created);
          return ts >= weekAgo;
        }).length;

        const bookingsThisMonth = bookingsSnap.docs.filter((d) => {
          const data = d.data();
          const created = data.createdAt;
          if (!created) return false;
          const ts =
            created instanceof Timestamp ? created.toDate() : new Date(created);
          return ts >= monthAgo;
        }).length;

        setStats({
          leads: leadsSnap.size,
          leadsThisWeek,
          bookings: bookingsSnap.size,
          bookingsThisMonth,
          testimonials: testimonialsSnap.size,
          services: servicesSnap.size,
        });

        if (calRes.ok) {
          const cal = (await calRes.json()) as CalendarStatus;
          setCalendar(cal);
        }
      } catch {
        // Silently fail if Firebase not yet configured
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards: StatCard[] = [
    {
      label: "New Leads",
      value: loading ? "—" : stats.leadsThisWeek,
      sub: `${stats.leads} total`,
      href: "/admin/leads",
      color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    {
      label: "Bookings (30 days)",
      value: loading ? "—" : stats.bookingsThisMonth,
      sub: `${stats.bookings} total`,
      href: "/admin/bookings",
      color: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      label: "Published Testimonials",
      value: loading ? "—" : stats.testimonials,
      href: "/admin/testimonials",
      color: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    {
      label: "Google Calendar",
      value: loading ? "—" : calendar.connected ? "Connected" : "Not connected",
      sub: calendar.connectedEmail ?? "Required for online booking",
      href: "/admin/settings",
      color: calendar.connected
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-purple-50 text-purple-700 ring-purple-200",
    },
  ];

  const quickLinks = [
    { href: "/admin/leads", label: "View all leads →" },
    { href: "/admin/settings", label: "Connect Google Calendar →" },
    { href: "/admin/before-after", label: "Upload before & after →" },
    { href: "/admin/testimonials", label: "Add testimonial →" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-black/55">
          Manage your clinic website content and patient enquiries.
        </p>
      </div>

      {!loading && !calendar.connected && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-medium">Google Calendar not connected</p>
          <p className="mt-1">
            Patients cannot book online until you connect your calendar in{" "}
            <Link href="/admin/settings" className="font-semibold underline">
              Settings
            </Link>
            .
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm transition hover:shadow-md hover:ring-black/10"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-black/45">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--brand-dark)]">
              {c.value}
            </p>
            {c.sub && (
              <p className="mt-1 text-xs text-black/40">{c.sub}</p>
            )}
            <span
              className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${c.color}`}
            >
              View →
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-black/45">
          Quick actions
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 rounded-xl border border-black/8 px-4 py-3 text-sm font-medium text-[var(--brand-dark)] transition hover:border-[var(--gold)] hover:bg-[var(--surface-warm)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
