export const WHATSAPP_NUMBER = "919903478785";
export const WHATSAPP_GREEN = "#25D366";

export function whatsappHref(number = WHATSAPP_NUMBER, message) {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
