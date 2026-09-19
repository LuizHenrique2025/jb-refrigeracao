"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { components } from "@/lib/content";
const ACScene = dynamic(() => import("./ACScene"), {
  ssr: false,
  loading: () => (
    <div className="scene-loading" role="status">
      <span className="loading-orbit" />
      Carregando experiência 3D…
    </div>
  ),
});
function subscribeReduced(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function getReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function StaticView() {
  return (
    <div className="static-experience">
      <Image
        src="/references/unidade-interna.png"
        width={1659}
        height={948}
        alt="Unidade interna em vista explodida: filtros acima da serpentina, turbina, chassi, aleta e painel frontal abaixo."
      />
      <div className="static-parts">
        {components.map((c) => (
          <article key={c.name}>
            <span>{c.number}</span>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function ACExperience() {
  const [section, setSection] = useState<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    () => false,
  );
  useEffect(() => {
    const element = section;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("webgl2");
          setSupported(!!context);
          context?.getExtension("WEBGL_lose_context")?.loseContext();
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "650px" },
    );
    observer.observe(element);
    const lost = () => setSupported(false);
    element.addEventListener("ac-context-lost", lost);
    return () => {
      observer.disconnect();
      element.removeEventListener("ac-context-lost", lost);
    };
  }, [section]);
  const simplified = reduced || !supported;
  return (
    <section
      ref={setSection}
      id="tecnologia"
      className={`experience ${simplified ? "is-static" : "is-interactive"}`}
      aria-label="Tecnologia por dentro"
    >
      <div className="experience-heading">
        <p className="eyebrow">UM NOVO OLHAR SOBRE O SEU CONFORTO</p>
        <h2 data-experience-title>Tecnologia por dentro</h2>
        <p data-experience-subtitle>Explore os componentes do sistema</p>
      </div>
      {simplified ? (
        <StaticView />
      ) : (
        <>
          <div className="ac-canvas">
            {ready && section ? (
              <SceneBoundary onFailure={() => setSupported(false)}>
                <ACScene section={section} />
              </SceneBoundary>
            ) : (
              <div className="scene-loading" role="status">
                Preparando experiência 3D…
              </div>
            )}
          </div>
          <div className="ac-label" aria-hidden="true">
            <i />
            <b />
            <span />
          </div>
          <div className="ac-detail" aria-hidden="true">
            <span className="micro" data-step>
              01 / 05
            </span>
            <h3 data-part-title>Filtros</h3>
            <p data-part-copy>{components[0].description}</p>
          </div>
          <div className="ac-scroll-hint" aria-hidden="true">
            <span>ROLE PARA EXPLORAR</span>
            <ArrowDown size={16} />
          </div>
          <div className="ac-bottom">
            <span data-stage>01 — VISÃO DO CONJUNTO</span>
            <span>MODELO ILUSTRATIVO · SPLIT</span>
          </div>
          <div className="ac-progress" aria-hidden="true">
            <div className="ac-progress-fill" />
          </div>
          <div className="sr-only">
            <h3>Componentes do ar-condicionado</h3>
            {components.map((c) => (
              <p key={c.name}>
                {c.title}: {c.description}
              </p>
            ))}
          </div>
        </>
      )}
      <a className="skip-experience" href="#servicos">
        Ir para os serviços <ArrowUpRight size={14} />
      </a>
      <noscript>
        <p>
          Explore os serviços da JB Refrigeração na próxima seção. A experiência
          3D requer JavaScript.
        </p>
      </noscript>
    </section>
  );
}
