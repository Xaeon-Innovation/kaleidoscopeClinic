export const CLINIC = {
  name: "Kaleidoscope Dental Specialists",
  phoneDisplay: "07745 325295",
  phoneHref: "tel:+447745325295",
  email: "Hello@kaleidoscopedentalspecialists@gmail.com",
  addressLines: ["1 Orchard St", "London W1H 6HJ"],
  whatsappNumberE164NoPlus: "447745325295",
};

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps?q=1+Orchard+St,+London+W1H+6HJ";

export function whatsappHrefFromNumber(
  whatsappDigits: string,
  message?: string
) {
  const digits = whatsappDigits.replace(/\D/g, "");
  if (!digits) return "";
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppHref(message?: string) {
  return whatsappHrefFromNumber(CLINIC.whatsappNumberE164NoPlus, message);
}

