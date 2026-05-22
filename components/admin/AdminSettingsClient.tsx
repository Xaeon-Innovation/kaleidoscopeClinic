"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookingScheduleForm } from "@/components/admin/BookingScheduleForm";

type CalendarStatus = {
  oauthConfigured: boolean;
  oauthConfigError: string | null;
  connected: boolean;
  connectedEmail: string | null;
  calendarId: string | null;
  connectedAt: string | null;
  scopesOk?: boolean;
  needsReconnect?: boolean;
};

export function AdminSettingsClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/google/status");
      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Please sign in again.");
        } else {
          setError("Could not load calendar status.");
        }
        return;
      }
      setStatus((await res.json()) as CalendarStatus);
    } catch {
      setError("Could not load calendar status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const cal = searchParams.get("calendar");
    if (cal === "connected") {
      setBanner("Google Calendar connected successfully.");
      void loadStatus();
    } else if (cal === "denied") {
      setBanner("Google Calendar connection was cancelled.");
    } else if (cal === "error") {
      setBanner("Could not connect Google Calendar. Please try again.");
    } else if (cal === "scopes") {
      setBanner(
        "Calendar connected without read access. Add scopes in Google Cloud (see below), disconnect, then connect again."
      );
    }
  }, [searchParams, loadStatus]);

  async function disconnect() {
    if (
      !confirm(
        "Disconnect Google Calendar? Online booking will stop until reconnected."
      )
    ) {
      return;
    }
    setDisconnecting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/google/disconnect", {
        method: "POST",
      });
      if (!res.ok) throw new Error("disconnect failed");
      setBanner("Google Calendar disconnected.");
      await loadStatus();
    } catch {
      setError("Failed to disconnect calendar.");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-black/55">
          Google Calendar connection and online booking hours.
        </p>
      </div>

      {banner && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {banner}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-black/45">
          Google Calendar
        </h2>

        {loading ? (
          <p className="mt-4 text-sm text-black/50">Loading…</p>
        ) : status ? (
          <div className="mt-4 space-y-4">
            {!status.oauthConfigured && (
              <p className="text-sm text-amber-800">
                OAuth is not configured on the server. Set{" "}
                <code className="rounded bg-black/5 px-1">
                  GOOGLE_OAUTH_CLIENT_ID
                </code>{" "}
                and{" "}
                <code className="rounded bg-black/5 px-1">
                  GOOGLE_OAUTH_CLIENT_SECRET
                </code>
                .
                {status.oauthConfigError
                  ? ` (${status.oauthConfigError})`
                  : null}
              </p>
            )}

            {status.connected && status.needsReconnect && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                <p className="font-medium">Reconnect required</p>
                <p className="mt-1">
                  The calendar is connected but missing <strong>read</strong>{" "}
                  permission (needed to show available slots). In Google Cloud →
                  OAuth consent screen, add scope{" "}
                  <code className="rounded bg-black/5 px-1">
                    .../auth/calendar.readonly
                  </code>{" "}
                  or{" "}
                  <code className="rounded bg-black/5 px-1">
                    .../auth/calendar
                  </code>
                  , then disconnect and connect again below.
                </p>
              </div>
            )}

            {status.connected ? (
              <>
                <div
                  className={
                    status.needsReconnect
                      ? "rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200"
                      : "rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200"
                  }
                >
                  <p className="font-medium">
                    {status.needsReconnect ? "Connected (limited)" : "Connected"}
                  </p>
                  <p className="mt-1">
                    {status.connectedEmail} · calendar:{" "}
                    {status.calendarId ?? "primary"}
                  </p>
                  {status.connectedAt && (
                    <p className="mt-1 text-xs text-emerald-800/80">
                      Since{" "}
                      {new Date(status.connectedAt).toLocaleString("en-GB")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={disconnect}
                  disabled={disconnecting}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {disconnecting ? "Disconnecting…" : "Disconnect calendar"}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-black/65">
                  Connect your personal Google Calendar so website bookings
                  appear on your schedule and busy times are hidden from
                  patients.
                </p>
                <a
                  href="/api/admin/google/connect"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--ink-on-gold)] hover:bg-[var(--gold-2)]"
                >
                  Connect Google Calendar
                </a>
              </>
            )}

            <div className="border-t border-black/8 pt-4 text-sm text-black/60">
              <p className="font-medium text-[var(--brand-dark)]">
                Managing availability
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Block time in Google Calendar (meetings, leave) — those slots
                  won&apos;t be offered online.
                </li>
                <li>
                  Set per-day hours below (e.g. Mon–Fri 9am–6pm, some days
                  until 9pm).
                </li>
                <li>
                  Cancelling a booking in Bookings removes the Google Calendar
                  event.
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      <BookingScheduleForm />
    </div>
  );
}
