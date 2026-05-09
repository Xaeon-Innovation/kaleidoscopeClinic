"use client";

import { useMemo, useState, type ReactNode } from "react";
import { submitReferral } from "@/lib/leads/submitReferral";
import { uploadReferralFiles } from "@/lib/referral/uploadReferralFiles";

const IMPLANT_OPTIONS = [
  { id: "implant_consultation", label: "Dental implant consultation" },
  { id: "single_implant", label: "Single dental implant" },
  { id: "allon4", label: "All-on-4" },
  { id: "allon6", label: "All-on-6" },
  { id: "same_day", label: "Same-day dental implants" },
  { id: "bone_graft", label: "Bone grafting / jaw reconstruction" },
  { id: "sinus_lift", label: "Sinus lift" },
  { id: "socket_preservation", label: "Socket preservation" },
  { id: "soft_tissue", label: "Soft tissue grafting" },
] as const;

const RADIO_TYPES = [
  { id: "opg", label: "OPG / DPT" },
  { id: "periapical", label: "Periapical" },
  { id: "cbct", label: "CBCT" },
] as const;

const inputClass =
  "min-h-11 w-full rounded-xl border border-[var(--brand-dark)]/15 bg-white px-3 py-2 text-sm text-[var(--brand-dark)] shadow-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20";

const textareaClass =
  "min-h-28 w-full rounded-xl border border-[var(--brand-dark)]/15 bg-white px-3 py-2 text-sm text-[var(--brand-dark)] shadow-sm outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20";

function getUtm() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return out;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-[var(--brand-dark)]">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

export function ReferralForm() {
  const submissionId = useMemo(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
      return crypto.randomUUID();
    return `ref_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }, []);

  const [dName, setDName] = useState("");
  const [dPractice, setDPractice] = useState("");
  const [dAddress, setDAddress] = useState("");
  const [dPostcode, setDPostcode] = useState("");
  const [dContact, setDContact] = useState("");
  const [dEmail, setDEmail] = useState("");

  const [pName, setPName] = useState("");
  const [pDob, setPDob] = useState("");
  const [pAddress, setPAddress] = useState("");
  const [pPostcode, setPPostcode] = useState("");
  const [pContact, setPContact] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pGp, setPGp] = useState("");

  const [implants, setImplants] = useState<string[]>([]);
  const [clinicalHistory, setClinicalHistory] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  const [radioTypes, setRadioTypes] = useState<string[]>([]);
  const [radioOther, setRadioOther] = useState("");
  const [imagingNotes, setImagingNotes] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [signature, setSignature] = useState("");
  const [signedDate, setSignedDate] = useState("");

  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error" | "upload_failed"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleImplant(id: string) {
    setImplants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleRadioType(id: string) {
    setRadioTypes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const canSend = useMemo(() => {
    return (
      dName.trim().length > 1 &&
      dPractice.trim().length > 1 &&
      dAddress.trim().length > 3 &&
      dPostcode.trim().length > 2 &&
      dContact.trim().length >= 6 &&
      dEmail.includes("@") &&
      pName.trim().length > 1 &&
      pDob.length > 0 &&
      pAddress.trim().length > 3 &&
      pPostcode.trim().length > 2 &&
      pContact.trim().length >= 6 &&
      pEmail.includes("@") &&
      implants.length > 0 &&
      clinicalHistory.trim().length >= 15 &&
      medicalHistory.trim().length >= 10 &&
      signature.trim().length > 2 &&
      signedDate.length > 0
    );
  }, [
    dName,
    dPractice,
    dAddress,
    dPostcode,
    dContact,
    dEmail,
    pName,
    pDob,
    pAddress,
    pPostcode,
    pContact,
    pEmail,
    implants.length,
    clinicalHistory,
    medicalHistory,
    signature,
    signedDate,
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (company) return;
    if (!canSend) return;

    setStatus("sending");
    setErrorMessage("");

    let attachmentUrls: string[] = [];
    if (files.length > 0) {
      try {
        attachmentUrls = await uploadReferralFiles(submissionId, files);
      } catch (err) {
        setStatus("upload_failed");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Could not upload files. Try smaller PDFs or images, or submit without attachments and email them separately."
        );
        return;
      }
    }

    try {
      await submitReferral({
        referringDentist: {
          name: dName,
          practice: dPractice,
          address: dAddress,
          postcode: dPostcode,
          contact: dContact,
          email: dEmail,
        },
        patient: {
          name: pName,
          dateOfBirth: pDob,
          address: pAddress,
          postcode: pPostcode,
          contact: pContact,
          email: pEmail,
          gpAddress: pGp,
        },
        implantInterests: implants,
        clinicalHistory,
        medicalHistory,
        radiographSelections: radioTypes,
        radiographOther: radioOther,
        imagingNotes,
        attachmentUrls,
        signature,
        signedDate,
        sourcePage: "/referral",
        utm: getUtm(),
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submit failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)] sm:text-2xl">
          Referring dentist
        </h2>
        <p className="mt-2 text-sm text-[var(--brand-dark)]/70">
          Fields marked with <span className="text-red-600">*</span> are
          required.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Full name" required>
            <input
              className={inputClass}
              autoComplete="name"
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              required
            />
          </Field>
          <Field label="Practice name" required>
            <input
              className={inputClass}
              value={dPractice}
              onChange={(e) => setDPractice(e.target.value)}
              required
            />
          </Field>
          <Field label="Practice address" required>
            <input
              className={inputClass}
              autoComplete="street-address"
              value={dAddress}
              onChange={(e) => setDAddress(e.target.value)}
              required
            />
          </Field>
          <Field label="Postcode" required>
            <input
              className={inputClass}
              autoComplete="postal-code"
              value={dPostcode}
              onChange={(e) => setDPostcode(e.target.value)}
              required
            />
          </Field>
          <Field label="Contact number" required>
            <input
              className={inputClass}
              type="tel"
              autoComplete="tel"
              value={dContact}
              onChange={(e) => setDContact(e.target.value)}
              required
            />
          </Field>
          <Field label="Email" required>
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              value={dEmail}
              onChange={(e) => setDEmail(e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)] sm:text-2xl">
          Patient
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Full name" required>
            <input
              className={inputClass}
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              required
            />
          </Field>
          <Field label="Date of birth" required>
            <input
              className={inputClass}
              type="date"
              value={pDob}
              onChange={(e) => setPDob(e.target.value)}
              required
            />
          </Field>
          <Field label="Address" required>
            <input
              className={inputClass}
              value={pAddress}
              onChange={(e) => setPAddress(e.target.value)}
              required
            />
          </Field>
          <Field label="Postcode" required>
            <input
              className={inputClass}
              value={pPostcode}
              onChange={(e) => setPPostcode(e.target.value)}
              required
            />
          </Field>
          <Field label="Contact number" required>
            <input
              className={inputClass}
              type="tel"
              value={pContact}
              onChange={(e) => setPContact(e.target.value)}
              required
            />
          </Field>
          <Field label="Email" required>
            <input
              className={inputClass}
              type="email"
              value={pEmail}
              onChange={(e) => setPEmail(e.target.value)}
              required
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="GP practice address (if known)">
              <input
                className={inputClass}
                value={pGp}
                onChange={(e) => setPGp(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)] sm:text-2xl">
          Referral &amp; clinical details
        </h2>
        <p className="mt-2 text-sm text-[var(--brand-dark)]/70">
          Tick all treatment areas that apply. Add concise history below.
        </p>

        <fieldset className="mt-5">
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
            Implant &amp; related care
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {IMPLANT_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-[var(--brand-dark)]/10 px-3 py-2 text-sm text-[var(--brand-dark)] hover:bg-[var(--surface-warm)]"
              >
                <input
                  type="checkbox"
                  checked={implants.includes(opt.id)}
                  onChange={() => toggleImplant(opt.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--brand-dark)]/30 text-[var(--gold)] focus:ring-[var(--gold)]"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 md:grid-cols-1">
          <Field label="Brief history & relevant clinical details" required>
            <textarea
              className={textareaClass}
              value={clinicalHistory}
              onChange={(e) => setClinicalHistory(e.target.value)}
              required
              placeholder="Reason for referral, relevant examination findings, tooth numbers / sites, periodontal status…"
            />
          </Field>
          <Field label="Medical & drug history" required>
            <textarea
              className={textareaClass}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              required
              placeholder="Allergies, anticoagulants, bisphosphonates, diabetes, bone disorders, smoking, etc."
            />
          </Field>
        </div>

        <fieldset className="mt-8">
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
            Imaging (tick what is available or enclosed)
          </legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {RADIO_TYPES.map((r) => (
              <label
                key={r.id}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--brand-dark)]/15 px-3 py-1.5 text-sm text-[var(--brand-dark)]"
              >
                <input
                  type="checkbox"
                  checked={radioTypes.includes(r.id)}
                  onChange={() => toggleRadioType(r.id)}
                  className="h-4 w-4 rounded border-[var(--brand-dark)]/30 text-[var(--gold)] focus:ring-[var(--gold)]"
                />
                {r.label}
              </label>
            ))}
          </div>
          <div className="mt-4">
            <Field label="Other imaging (type / date)">
              <input
                className={inputClass}
                value={radioOther}
                onChange={(e) => setRadioOther(e.target.value)}
                placeholder="e.g. FMX March 2025"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Additional imaging notes">
              <textarea
                className={`${textareaClass} min-h-20`}
                value={imagingNotes}
                onChange={(e) => setImagingNotes(e.target.value)}
                placeholder="Optional: what will follow separately, or key findings."
              />
            </Field>
          </div>
        </fieldset>
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <h2 className="font-[var(--font-serif)] text-xl text-[var(--brand-dark)] sm:text-2xl">
          Documents & declaration
        </h2>
        <p className="mt-2 text-sm text-[var(--brand-dark)]/70">
          You may attach PDFs or images (max 10MB per file). If upload fails,
          submit the form and email radiographs to the clinic address separately.
        </p>

        <div className="mt-4">
          <Field label="Attachments (radiographs, referrals, charts)">
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp,image/jpg"
              multiple
              className="text-sm text-[var(--brand-dark)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--gold)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--ink-on-gold)]"
              onChange={(e) =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
          </Field>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Dentist signature (type full name to sign)" required>
            <input
              className={inputClass}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Type your name as your digital signature"
              required
              autoComplete="off"
            />
          </Field>
          <Field label="Date" required>
            <input
              className={inputClass}
              type="date"
              value={signedDate}
              onChange={(e) => setSignedDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </Field>
        </div>

        <label className="hidden">
          <span>Company</span>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </section>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={!canSend || status === "sending" || status === "sent"}
          className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[var(--gold)] px-8 text-sm font-semibold text-[var(--ink-on-gold)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--gold-2)] disabled:opacity-50"
        >
          {status === "sending"
            ? "Sending…"
            : status === "sent"
              ? "Referral sent"
              : "Send referral"}
        </button>
        {status === "sent" ? (
          <p className="max-w-md text-sm text-[var(--brand-dark)]/75">
            Thank you — we have received your referral and will contact the
            patient and your practice as appropriate.
          </p>
        ) : status === "error" || status === "upload_failed" ? (
          <p className="max-w-md text-sm text-red-700">{errorMessage}</p>
        ) : (
          <p className="max-w-md text-xs text-[var(--brand-dark)]/60">
            For urgent clinical queries, phone the clinic after sending this
            form.
          </p>
        )}
      </div>
    </form>
  );
}
