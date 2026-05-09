export const CLINIC = {
  name: "Kaleidoscope Dental Specialists",
  phoneDisplay: "07745 325295",
  phoneHref: "tel:+447745325295",
  email: "Hello@kaleidoscopedentalspecialists@gmail.com",
  addressLines: ["1 Orchard St", "London W1H 6HJ"],
  whatsappNumberE164NoPlus: "447745325295",
};

export function getWhatsAppHref(message?: string) {
  const base = `https://wa.me/${CLINIC.whatsappNumberE164NoPlus}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

