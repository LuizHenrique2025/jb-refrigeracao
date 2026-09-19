"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_URL, PART_NAMES } from "@/lib/model-config";
// No textures: compact procedural geometry with instanced fins and grille bars.
function Box({
  size,
  position = [0, 0, 0],
  color = "#e4e8eb",
  metalness = 0.15,
  radius = 0.06,
}: {
  size: [number, number, number];
  position?: [number, number, number];
  color?: string;
  metalness?: number;
  radius?: number;
}) {
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={2}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={0.36}
      />
    </RoundedBox>
  );
}
function Bars({
  count,
  size,
  step,
  position,
  color,
  rotation,
}: {
  count: number;
  size: [number, number, number];
  step: [number, number, number];
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(i * step[0], i * step[1], i * step[2]);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [count, step]);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      position={position}
      rotation={rotation}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={0.25} roughness={0.45} />
    </instancedMesh>
  );
}
function Cylinder({
  radius,
  length,
  position,
  color,
  rotation = [0, 0, Math.PI / 2],
}: {
  radius: number;
  length: number;
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <cylinderGeometry args={[radius, radius, length, 32]} />
      <meshStandardMaterial color={color} metalness={0.45} roughness={0.33} />
    </mesh>
  );
}
function Filter({ x, name }: { x: number; name: string }) {
  return (
    <group name={name} position={[x, 0.48, 0.57]}>
      <Box size={[2.98, 0.94, 0.065]} color="#7d8c95" radius={0.02} />
      <Bars
        count={28}
        size={[0.016, 0.86, 0.022]}
        position={[-1.39, 0, 0.05]}
        step={[0.103, 0, 0]}
        color="#d8e1e3"
      />
      <Bars
        count={8}
        size={[2.84, 0.018, 0.023]}
        position={[0, -0.39, 0.052]}
        step={[0, 0.11, 0]}
        color="#d8e1e3"
      />
      <Box size={[3.05, 0.07, 0.1]} position={[0, 0.49, 0]} />
      <Box size={[3.05, 0.07, 0.1]} position={[0, -0.49, 0]} />
      <Box size={[0.07, 0.98, 0.1]} position={[-1.49, 0, 0]} />
      <Box size={[0.07, 0.98, 0.1]} position={[1.49, 0, 0]} />
    </group>
  );
}
export function MockACModel() {
  return (
    <group name="AC_ROOT">
      <group name="Main_Chassis" position={[0, 0, -0.53]}>
        <Box size={[6.9, 1.98, 0.2]} color="#c6cdd3" />
        <Box size={[6.8, 0.17, 1.13]} position={[0, -0.92, 0.5]} />
        <Box size={[6.8, 0.16, 0.7]} position={[0, 0.88, 0.29]} />
        <Bars
          count={9}
          size={[0.075, 1.6, 0.14]}
          position={[-3, 0.0, 0.16]}
          step={[0.75, 0, 0]}
          color="#b6c0c7"
        />
      </group>
      <group name="Evaporator_Coil" position={[-0.21, 0.35, 0.13]}>
        <Box
          size={[5.86, 0.99, 0.42]}
          color="#345f78"
          metalness={0.5}
          radius={0.02}
        />
        <Bars
          count={66}
          size={[0.027, 1, 0.44]}
          position={[-2.87, 0, 0]}
          step={[0.087, 0, 0]}
          color="#70a5bc"
        />
        <Bars
          count={7}
          size={[5.82, 0.023, 0.04]}
          position={[0, -0.43, 0.237]}
          step={[0, 0.14, 0]}
          color="#a3c8d8"
        />
        {[-0.35, 0, 0.35].map((y) => (
          <mesh key={y} position={[3.0, y, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <torusGeometry args={[0.15, 0.038, 8, 16, Math.PI]} />
            <meshStandardMaterial
              color="#c47d45"
              metalness={0.8}
              roughness={0.26}
            />
          </mesh>
        ))}
      </group>
      <group name="Blower_Fan" position={[-0.2, -0.45, 0.15]}>
        <Cylinder
          radius={0.3}
          length={5.85}
          position={[0, 0, 0]}
          color="#25333b"
        />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI) / 12;
          return (
            <mesh
              key={i}
              position={[0, Math.cos(a) * 0.29, Math.sin(a) * 0.29]}
              rotation={[a, 0, 0]}
            >
              <boxGeometry args={[5.85, 0.036, 0.035]} />
              <meshStandardMaterial color="#46525b" />
            </mesh>
          );
        })}
        {[-2.9, -1.95, -0.98, 0, 0.98, 1.95, 2.9].map((x) => (
          <Cylinder
            key={x}
            radius={0.32}
            length={0.035}
            position={[x, 0, 0]}
            color="#8a949b"
          />
        ))}
      </group>
      <group name="Fan_Motor" position={[3.0, -0.45, 0.15]}>
        <Cylinder
          radius={0.28}
          length={0.45}
          position={[0, 0, 0]}
          color="#9da9b0"
        />
        <Cylinder
          radius={0.075}
          length={0.75}
          position={[0, 0, 0]}
          color="#697987"
        />
      </group>
      <group name="PCB" position={[3.05, 0.36, 0.23]}>
        <Box size={[0.46, 0.99, 0.055]} color="#216b59" radius={0.012} />
        {[-0.29, 0, 0.29].map((y) => (
          <Box
            key={y}
            size={[0.19, 0.16, 0.07]}
            position={[-0.055, y, 0.07]}
            color="#202e37"
            radius={0.01}
          />
        ))}
        <Box
          size={[0.1, 0.3, 0.09]}
          position={[0.13, 0.2, 0.085]}
          color="#d3b969"
          radius={0.01}
        />
      </group>
      <Filter name="Filter_Left" x={-1.72} />
      <Filter name="Filter_Right" x={1.42} />
      <group name="Air_Grid" position={[0, 1.03, -0.03]}>
        <Box size={[6.86, 0.065, 0.06]} position={[0, 0, 0.55]} />
        <Box size={[6.86, 0.065, 0.06]} position={[0, 0, -0.55]} />
        <Bars
          count={38}
          size={[0.046, 0.055, 1.1]}
          position={[-3.32, 0, 0]}
          step={[0.18, 0, 0]}
          color="#e5eaed"
        />
        <Box size={[6.86, 0.065, 0.05]} />
      </group>
      <group name="Horizontal_Flap" position={[0, -0.81, 0.72]}>
        <Box size={[6.53, 0.19, 0.32]} color="#e5e9ed" />
      </group>
      <group name="Flap_Motor" position={[3.34, -0.8, 0.53]}>
        <Box size={[0.26, 0.24, 0.22]} color="#303e48" radius={0.03} />
      </group>
      <group name="Side_Left" position={[-3.53, 0, 0]}>
        <Box size={[0.19, 2.04, 1.5]} radius={0.09} />
      </group>
      <group name="Side_Right" position={[3.53, 0, 0]}>
        <Box size={[0.19, 2.04, 1.5]} radius={0.09} />
      </group>
      <group name="Panel_Front" position={[0, 0.05, 0.87]}>
        <Box size={[6.96, 1.73, 0.24]} color="#f6f8fa" radius={0.115} />
        <Box
          size={[6.65, 0.018, 0.01]}
          position={[0, -0.66, 0.125]}
          color="#b3c0cb"
          radius={0.002}
        />
        <Box
          size={[0.035, 0.035, 0.009]}
          position={[2.88, -0.5, 0.129]}
          color="#248be4"
          radius={0.003}
        />
      </group>
    </group>
  );
}
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    for (const name of PART_NAMES) {
      if (!clone.getObjectByName(name))
        throw new Error(`Missing GLB node: ${name}`);
    }
    clone.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => m.clone())
          : o.material.clone();
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  return <primitive object={model} />;
}
export function preloadACModel() {
  if (MODEL_URL) useGLTF.preload(MODEL_URL);
}
export default function ACModel() {
  return MODEL_URL ? <GLBModel url={MODEL_URL} /> : <MockACModel />;
}
