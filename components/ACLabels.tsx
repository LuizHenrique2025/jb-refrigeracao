"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import * as THREE from "three";
export default function ACLabels({
  root,
  section,
}: {
  root: RefObject<THREE.Group | null>;
  section: HTMLElement;
}) {
  const { camera, size } = useThree();
  const point = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const name = section.dataset.activePart;
    const label = section.querySelector<HTMLElement>(".ac-label");
    const node = name && root.current?.getObjectByName(name);
    if (!node || !label) return;
    node.getWorldPosition(point);
    point.project(camera);
    const x = THREE.MathUtils.clamp(
      (point.x * 0.5 + 0.5) * size.width,
      30,
      size.width - 165,
    );
    const y = THREE.MathUtils.clamp(
      (-point.y * 0.5 + 0.5) * size.height,
      120,
      size.height - 160,
    );
    label.style.transform = `translate3d(${x}px,${y}px,0)`;
  });
  return null;
}
