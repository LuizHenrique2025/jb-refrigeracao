import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { OFFSETS, PART_NAMES } from "./model-config";
import { components } from "./content";
export type AnimationOptions = {
  root: THREE.Group;
  camera: THREE.PerspectiveCamera;
  section: HTMLElement;
  invalidate: () => void;
  width: number;
  height: number;
  light: THREE.DirectionalLight | null;
};
// Named-node lookup; all starting transforms are restored on resize/unmount.
export function createACAnimation({
  root,
  camera,
  section,
  invalidate,
  width,
  height,
  light,
}: AnimationOptions) {
  gsap.registerPlugin(ScrollTrigger);
  const mobile = width < 640;
  const distance = Math.max(
    mobile ? 20 : 16,
    12.3 /
      (2 *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        (width / height)),
  );
  const parts = PART_NAMES.map((name) => {
    const object = root.getObjectByName(name);
    return object
      ? {
          name,
          object,
          position: object.position.clone(),
          rotation: object.rotation.clone(),
        }
      : null;
  }).filter((p) => p !== null);
  const mats: {
    material: THREE.MeshStandardMaterial;
    color: THREE.Color;
    opacity: number;
    transparent: boolean;
    part: string;
  }[] = [];
  for (const part of parts)
    part.object.traverse((o) => {
      if (o instanceof THREE.Mesh)
        for (const m of Array.isArray(o.material) ? o.material : [o.material])
          if (m instanceof THREE.MeshStandardMaterial)
            mats.push({
              material: m,
              color: m.color.clone(),
              opacity: m.opacity,
              transparent: m.transparent,
              part: part.name,
            });
    });
  camera.position.set(0, 1.7, distance);
  camera.lookAt(0, 0, 0);
  root.rotation.set(0.06, -0.12, 0);
  const label = section.querySelector<HTMLElement>(".ac-label")!;
  const headline = section.querySelector<HTMLElement>(
    "[data-experience-title]",
  )!;
  const description = section.querySelector<HTMLElement>(
    "[data-experience-subtitle]",
  )!;
  const step = section.querySelector<HTMLElement>("[data-step]")!;
  const title = section.querySelector<HTMLElement>("[data-part-title]")!;
  const copy = section.querySelector<HTMLElement>("[data-part-copy]")!;
  const detail = section.querySelector<HTMLElement>(".ac-detail")!;
  const progress = section.querySelector<HTMLElement>(".ac-progress-fill")!;
  const stage = section.querySelector<HTMLElement>("[data-stage]")!;
  const state = { p: 0 };
  let previous = -99;
  const update = () => {
    const p = state.p;
    const index =
      p >= 0.34 && p < 0.88 ? Math.min(4, Math.floor((p - 0.34) / 0.108)) : -1;
    progress.style.transform = `scaleX(${p})`;
    section.dataset.progress = p.toFixed(3);
    if (index !== previous) {
      previous = index;
      section.dataset.activePart = index >= 0 ? components[index].name : "";
      detail.style.opacity = index >= 0 ? "1" : "0";
      label.style.opacity = index >= 0 ? "1" : "0";
      if (index >= 0) {
        const c = components[index];
        step.textContent = c.number + " / 05";
        title.textContent = c.title;
        copy.textContent = c.description;
        label.querySelector("span")!.textContent = c.title;
      }
      for (const m of mats) {
        const active =
          index < 0 ||
          m.part === components[index].name ||
          (index === 0 && m.part === "Filter_Right");
        m.material.color
          .copy(m.color)
          .lerp(new THREE.Color("#a2aeb9"), active ? 0 : 0.28);
        m.material.opacity = active ? m.opacity : 0.32;
        m.material.transparent = !active || m.transparent;
        m.material.depthWrite = active;
      }
    }
    const final = p >= 0.9;
    headline.textContent = final
      ? "Engenharia em cada detalhe"
      : "Tecnologia por dentro";
    description.textContent = final
      ? "Cada componente tem um papel. Cada cuidado faz a diferença."
      : "Explore os componentes do sistema";
    stage.textContent =
      p < 0.16
        ? "01 — VISÃO DO CONJUNTO"
        : p < 0.34
          ? "02 — POR DENTRO DO SISTEMA"
          : p < 0.88
            ? "03 — CONHEÇA OS COMPONENTES"
            : "04 — ENGENHARIA EM CADA DETALHE";
    invalidate();
  };
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${mobile ? 3600 : 5000}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
    onUpdate: update,
  });
  timeline
    .to(state, { p: 1, duration: 1 }, 0)
    .to(root.rotation, { y: 0.14, x: 0.12, duration: 0.16 }, 0)
    .to(camera.position, { z: distance * 0.92, duration: 0.16 }, 0);
  for (const p of parts) {
    const offset = OFFSETS[p.name];
    const spread = mobile ? 0.66 : 1;
    timeline.to(
      p.object.position,
      {
        x: p.position.x + offset[0] * spread,
        y: p.position.y + offset[1] * spread,
        z: p.position.z + offset[2] * spread,
        duration: 0.23,
      },
      0.14,
    );
  }
  timeline
    .to(
      root.rotation,
      { y: mobile ? 0.05 : 0.24, x: 0.09, duration: 0.16 },
      0.16,
    )
    .to(
      camera.position,
      { z: distance * (mobile ? 1.02 : 1.03), duration: 0.2 },
      0.17,
    );
  timeline
    .to(
      root.rotation,
      { y: mobile ? -0.09 : -0.16, x: 0.13, duration: 0.12 },
      0.88,
    )
    .to(camera.position, { z: distance * 1.07, duration: 0.12 }, 0.88);
  if (light) timeline.to(light, { intensity: 4.1, duration: 0.18 }, 0.18);
  update();
  ScrollTrigger.refresh();
  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    for (const p of parts) {
      p.object.position.copy(p.position);
      p.object.rotation.copy(p.rotation);
    }
    for (const m of mats) {
      m.material.color.copy(m.color);
      m.material.opacity = m.opacity;
      m.material.transparent = m.transparent;
      m.material.depthWrite = true;
    }
  };
}
