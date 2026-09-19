'use client';
import {useMemo,useEffect} from 'react';
import {useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {MODEL_URL,PART_NAMES} from '@/lib/model-config';
import {createStudioAC,disposeStudioAC} from '@/lib/ac-geometry';
export function MockACModel(){const model=useMemo(()=>createStudioAC(),[]);useEffect(()=>()=>disposeStudioAC(model),[model]);return <primitive object={model}/>;}
function GLBModel({url}:{url:string}){const {scene}=useGLTF(url);const model=useMemo(()=>{const clone=scene.clone(true);for(const name of PART_NAMES){if(!clone.getObjectByName(name))throw new Error(`Missing GLB node: ${name}`);}clone.traverse(o=>{if(o instanceof THREE.Mesh){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();o.castShadow=true;o.receiveShadow=true;}});return clone;},[scene]);return <primitive object={model}/>;}
export function preloadACModel(){if(MODEL_URL)useGLTF.preload(MODEL_URL);}
export default function ACModel(){return MODEL_URL?<GLBModel url={MODEL_URL}/>:<MockACModel/>;}
