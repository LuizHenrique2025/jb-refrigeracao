'use client';
import {useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
function installEnvironment(gl:THREE.WebGLRenderer,scene:THREE.Scene){const room=new RoomEnvironment();const generator=new THREE.PMREMGenerator(gl);const target=generator.fromScene(room,.045);const previous=scene.environment;const intensity=scene.environmentIntensity;scene.environment=target.texture;scene.environmentIntensity=.7;return()=>{scene.environment=previous;scene.environmentIntensity=intensity;target.dispose();generator.dispose();room.dispose();};}
export default function StudioLighting(){const {gl,scene,invalidate}=useThree();useEffect(()=>{const cleanup=installEnvironment(gl,scene);invalidate();return cleanup;},[gl,scene,invalidate]);return <><ambientLight intensity={.25}/><hemisphereLight args={['#e8f1ff','#78828b',.65]}/><directionalLight position={[-4,7,5]} intensity={2.5}/><directionalLight position={[5,1,-4]} intensity={1.2} color="#d6e8ff"/></>;}
