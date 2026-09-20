import {
  ArrowUpRight,
  ArrowDown,
  Snowflake,
  Wind,
  Wrench,
  Factory,
  MapPin,
  Check,
  Mail,
} from "lucide-react";
import { whatsapp } from "@/lib/content";
import ACExperience from "@/components/ACExperience";
import ContactForm from "@/components/ContactForm";
import NetworkBackdrop from "@/components/NetworkBackdrop";
export default function Page() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="header">
        <a
          className="brand"
          href="#inicio"
          aria-label="JB Refrigeração, início"
        >
          <Snowflake aria-hidden="true" />
          <span>
            <b>JB</b>
            <span>REFRIGERAÇÃO</span>
          </span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#servicos">Serviços</a>
          <a href="#tecnologia">Tecnologia</a>
          <a href="#sobre">Sobre a JB</a>
        </nav>
        <a
          className="header-cta"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          Fale com o João <ArrowUpRight size={17} />
        </a>
      </header>
      <main id="conteudo">
        <section className="hero wrap" id="inicio"><NetworkBackdrop />
          <div className="hero-meta">
            <span>
              <MapPin size={14} /> FOZ DO IGUAÇU E REGIÃO
            </span>
            <span>RESIDENCIAL · COMERCIAL · INDUSTRIAL</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">PRECISÃO TÉCNICA. CONFORTO DE VERDADE.</p>
            <h1 className="hero-title" aria-label="O clima ideal começa com quem entende.">
              <span className="title-line"><span style={{"--delay":"0ms"} as React.CSSProperties}>O</span> <span style={{"--delay":"70ms"} as React.CSSProperties}>clima</span> <span style={{"--delay":"140ms"} as React.CSSProperties}>ideal</span> <span style={{"--delay":"210ms"} as React.CSSProperties}>começa</span></span>
              <span className="title-line"><span style={{"--delay":"300ms"} as React.CSSProperties}>com</span> <em><span style={{"--delay":"370ms"} as React.CSSProperties}>quem</span> <span style={{"--delay":"440ms"} as React.CSSProperties}>entende.</span></em></span>
            </h1>
            <div className="hero-bottom">
              <p>
                Instalação e manutenção de ar-condicionado.{" "}
                <br />
                Cuidado em cada detalhe, do diagnóstico ao último ajuste.
              </p>
              <a
                className="button"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar orçamento <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
          <a className="explore-link" href="#tecnologia">
            <span>CONHEÇA POR DENTRO</span>
            <ArrowDown size={17} />
          </a>
        </section>
        <ACExperience />
        <section className="services wrap" id="servicos">
          <div className="section-heading">
            <p className="eyebrow">01 / O QUE FAZEMOS</p>
            <h2>
              A solução certa.
              <br />
              <span>Para o seu ambiente.</span>
            </h2>
            <p>
              Atendimento técnico para cuidar do seu sistema de climatização em
              todas as etapas.
            </p>
          </div>
          <div className="service-list">
            {[
              {
                icon: Wind,
                title: "Instalação de ar-condicionado",
                text: "Instalação com atenção ao dimensionamento, posicionamento e funcionamento do equipamento.",
                tag: "CONFORTO DESDE O PRIMEIRO DIA",
              },
              {
                icon: Wrench,
                title: "Manutenção e cuidado",
                text: "Limpeza, diagnóstico e manutenção para preservar o desempenho do seu ar-condicionado.",
                tag: "PREVENIR. CORRIGIR. CONSERVAR.",
              },
              {
                icon: Factory,
                title: "Sistemas centrais",
                text: "Manutenção de sistemas centrais de resfriamento para ambientes comerciais e industriais.",
                tag: "CONHECIMENTO QUE VAI ALÉM",
              },
            ].map((s, i) => (
              <article className="service" key={s.title}>
                <span className="service-index">0{i + 1}</span>
                <s.icon strokeWidth={1.3} size={31} />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="micro">{s.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="about" id="sobre">
          <div className="wrap about-grid">
            <div>
              <p className="eyebrow">02 / QUEM CUIDA DO SEU CONFORTO</p>
              <h2>
                Conhecimento técnico.
                <br />
                Atendimento próximo.
              </h2>
            </div>
            <div>
              <p className="about-lead">
                À frente da JB Refrigeração está{" "}
                <strong>João Victor Brizolla da Rosa</strong>, técnico
                eletrotécnico e refrigerista.
              </p>
              <p>
                Um trabalho feito com atenção, clareza e responsabilidade. Da
                primeira conversa à conclusão do serviço, você fala com quem
                entende do seu equipamento.
              </p>
              <ul className="values">
                <li>
                  <Check size={17} /> Orçamento justo e acessível
                </li>
                <li>
                  <Check size={17} /> Cuidado com o seu espaço
                </li>
                <li>
                  <Check size={17} /> Atendimento em Foz do Iguaçu e região
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="contact wrap" id="contato">
          <div className="contact-copy"><p className="eyebrow">VAMOS CONVERSAR?</p><h2>Seu ambiente merece<br/><em>um clima melhor.</em></h2><p>Conte ao João o que você precisa.<br/>O próximo passo começa com uma conversa.</p><a className="email" href="mailto:jbrarclimatizacao@gmail.com"><Mail size={16}/> jbrarclimatizacao@gmail.com</a></div><ContactForm />
        </section>
      </main>
      <footer className="wrap footer">
        <a className="brand" href="#inicio">
          <Snowflake />
          <span>
            <b>JB</b>
            <span>REFRIGERAÇÃO</span>
          </span>
        </a>
        <span>Foz do Iguaçu · Paraná</span>
        <span>© {new Date().getFullYear()} JB Refrigeração</span>
      </footer>
    </>
  );
}
