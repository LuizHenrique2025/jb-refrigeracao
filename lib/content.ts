// Single source of truth for the contact number. Confirm with the client before publishing (see docs/DEVELOPMENT.md).
export const WHATSAPP_NUMBER = "554598539211";

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const whatsapp = whatsappUrl(
  "Olá, João! Vim pelo site da JB Refrigeração e gostaria de solicitar um orçamento.",
);

export const FORM_LIMITS = { name: 80, type: 60, message: 600 } as const;

type ContactFields = {
  name: string;
  service: string;
  type: string;
  message: string;
};

/** Builds the WhatsApp text, leaving out whatever the visitor did not fill in. */
export function contactMessage({ name, service, type, message }: ContactFields): string {
  const clean = (value: string, max: number) => value.trim().slice(0, max);
  const who = clean(name, FORM_LIMITS.name);
  const kind = clean(type, FORM_LIMITS.type);
  const details = clean(message, FORM_LIMITS.message);
  return [
    who ? `Olá, João! Meu nome é ${who}.` : "Olá, João!",
    kind
      ? `Preciso de ${service} para um ambiente ${kind}.`
      : `Preciso de ${service}.`,
    details,
  ]
    .filter(Boolean)
    .join(" ");
}
export const components = [
  {
    name: "Filter_Left",
    title: "Filtros",
    description:
      "Retêm partículas presentes no ar. A limpeza periódica ajuda a preservar o fluxo de ar e o desempenho do sistema.",
    number: "01",
  },
  {
    name: "Evaporator_Coil",
    title: "Serpentina evaporadora",
    description:
      "É onde acontece a troca térmica: o ar do ambiente transfere calor para o fluido refrigerante.",
    number: "02",
  },
  {
    name: "Blower_Fan",
    title: "Turbina do ventilador",
    description:
      "Movimenta o ar através da serpentina e distribui o ar climatizado pelo ambiente.",
    number: "03",
  },
  {
    name: "Fan_Motor",
    title: "Motor do ventilador",
    description:
      "Aciona a turbina para manter a circulação de ar. Seu funcionamento influencia o conforto e o nível de ruído.",
    number: "04",
  },
  {
    name: "PCB",
    title: "Placa eletrônica",
    description:
      "Coordena sensores, comandos e funções do equipamento para controlar a climatização.",
    number: "05",
  },
];
