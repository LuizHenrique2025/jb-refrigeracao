"use client";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import * as THREE from "three";
import ACModel, { MockACModel, preloadACModel } from "./ACModel";
import StudioLighting from './StudioLighting';
import ACLoading from "./ACLoading";
import { createACAnimation } from "@/lib/animation";
import { PART_NAMES } from "@/lib/model-config";
class ModelBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <MockACModel /> : this.props.children;
  }
}
function SceneContents({ section, touchRotation }: { section: HTMLElement; touchRotation: boolean }) {
  const root = useRef<THREE.Group>(null);
  const light = useRef<THREE.DirectionalLight>(null);
  const { camera, size, invalidate, gl } = useThree();
  const orbit = useRef<ComponentRef<typeof OrbitControls>>(null);
  const rotationEnabled =
    touchRotation || !window.matchMedia("(pointer: coarse)").matches;
  // OrbitControls forces `touch-action: none` on the element it attaches to (R3F's wrapper div, not the
  // <canvas>), which stops the page from scrolling under a swipe. Only take over touch when rotation is on.
  useEffect(() => {
    const target = orbit.current?.domElement as HTMLElement | undefined;
    if (target) target.style.touchAction = rotationEnabled ? "none" : "pan-y";
  }, [rotationEnabled]);
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let frame = 0;
    const init = () => {
      if (
        root.current &&
        PART_NAMES.every((n) => root.current!.getObjectByName(n))
      ) {
        cleanup = createACAnimation({
          root: root.current,
          camera: camera as THREE.PerspectiveCamera,
          section,
          invalidate,
          width: size.width,
          height: size.height,
          light: light.current,
        });
      } else frame = requestAnimationFrame(init);
    };
    init();
    return () => {
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, [camera, size.width, size.height, section, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      section.dispatchEvent(new CustomEvent("ac-context-lost"));
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, section]);
  return (
    <>
      <StudioLighting />
      <directionalLight
        ref={light}
        position={[-5, 8, 7]}
        intensity={.7}
        castShadow={size.width > 640}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
        shadow-radius={5}
      />
      <group ref={root}>
        <ModelBoundary>
          <Suspense fallback={<ACLoading />}>
            <ACModel />
          </Suspense>
        </ModelBoundary>
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -4.0, 0]}
        receiveShadow
      >
        <planeGeometry args={[70, 70]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <OrbitControls ref={orbit} makeDefault enablePan={false} enableZoom={false} enableDamping={false} rotateSpeed={.65} minPolarAngle={.15} maxPolarAngle={Math.PI-.15} enabled={rotationEnabled} onChange={()=>{section.setAttribute('data-orbit',camera.position.toArray().map(n=>n.toFixed(2)).join(','));invalidate();}} />
    </>
  );
}
export default function ACScene({ section, touchRotation=false }: { section: HTMLElement; touchRotation?:boolean }) {
  useEffect(() => preloadACModel(), []);
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      shadows
      camera={{ fov: 36, position: [0, 1.7, 18], near: 0.1, far: 150 }}
      gl={{ alpha: true, antialias: true, powerPreference: "default" }}
      aria-label="Modelo 3D de ar-condicionado com peças que se separam conforme a rolagem"
      onCreated={({ gl }) => {
        gl.setClearColor("#f0f4f8", 0);
      }}
    >
      <SceneContents section={section} touchRotation={touchRotation} />
    </Canvas>
  );
}

