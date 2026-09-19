"use client";
import { Html, useProgress } from "@react-three/drei";
export default function ACLoading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="ac-loading" role="status">
        <span className="loading-orbit" />
        <p>Carregando experiência 3D…</p>
        <progress
          value={progress}
          max={100}
          aria-label="Carregamento do modelo"
        />
      </div>
    </Html>
  );
}
