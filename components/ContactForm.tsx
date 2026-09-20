"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { FORM_LIMITS, contactMessage, whatsappUrl } from "@/lib/content";

const SERVICES = [
  "Instalação de ar-condicionado",
  "Manutenção e limpeza",
  "Diagnóstico de problema",
  "Sistema central de resfriamento",
];

const field = (data: FormData, key: string) => String(data.get(key) ?? "");

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = contactMessage({
      name: field(data, "name"),
      service: field(data, "service"),
      type: field(data, "type"),
      message: field(data, "message"),
    });
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-heading">
        <p className="eyebrow">FALE SOBRE O SEU AMBIENTE</p>
        <h3>Como podemos ajudar?</h3>
        <p>Um pouco de contexto ajuda o João a entender o melhor caminho.</p>
      </div>
      <div className="form-row">
        <label>
          Seu nome
          <input
            required
            name="name"
            autoComplete="name"
            maxLength={FORM_LIMITS.name}
            placeholder="Como você se chama?"
          />
        </label>
        <label>
          Atendimento
          <input
            name="type"
            maxLength={FORM_LIMITS.type}
            placeholder="Residencial, comercial..."
          />
        </label>
      </div>
      <label>
        O que você precisa
        <select required name="service" defaultValue="">
          <option value="" disabled>
            Selecione uma opção
          </option>
          {SERVICES.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </label>
      <label>
        Conte um pouco sobre o serviço
        <textarea
          name="message"
          rows={4}
          maxLength={FORM_LIMITS.message}
          placeholder="Pode incluir o ambiente, equipamento e o que está acontecendo."
        />
      </label>
      <button className="form-submit" type="submit">
        <MessageCircle size={17} />
        {sent ? "Mensagem pronta no WhatsApp" : "Continuar no WhatsApp"}
        <ArrowUpRight size={17} />
      </button>
      <small>Você poderá revisar a mensagem antes de enviar.</small>
    </form>
  );
}
