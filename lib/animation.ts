import gsap from 'gsap';

import * as THREE from 'three';
import {OFFSETS,PART_NAMES} from './model-config';
export type AnimationOptions={root:THREE.Group;camera:THREE.PerspectiveCamera;section:HTMLElement;invalidate:()=>void;width:number;height:number;light:THREE.DirectionalLight|null};
/** The scroll sequence ONLY assembles/disassembles. Materials and component selection are independent. */
export function createACAnimation({root,camera,section,invalidate,width,height}:AnimationOptions){
 const mobile=width<640;
 const distance=Math.max(16,12.3/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*(width/height)));
 const parts=PART_NAMES.map(name=>{const object=root.getObjectByName(name);return object?{name,object,position:object.position.clone(),rotation:object.rotation.clone()}:null;}).filter(p=>p!==null);
 camera.position.set(0,2,distance);camera.lookAt(0,0,0);root.rotation.set(.03,-.36,0);
 const stage=section.querySelector<HTMLElement>('[data-stage]')!;const state={p:0,radius:camera.position.length()};
 const update=()=>{section.dataset.progress=state.p.toFixed(3);stage.textContent=state.p<.16?'01 / DESIGN INTEGRADO':state.p<.85?'02 / CADA PEÇA, SEU LUGAR':'03 / ENGENHARIA REVELADA';
 // Change distance, preserving the visitor's orbit direction. Never overwrite their yaw/pitch.
 camera.position.multiplyScalar(state.radius/camera.position.length());invalidate();};
 const reset=()=>{camera.position.set(0,2,distance).normalize().multiplyScalar(state.radius);camera.lookAt(0,0,0);invalidate();};section.addEventListener('ac-reset-view',reset);
 // The stage is held in place by CSS (position: sticky), not by a GSAP pin: no spacer is injected and the
 // page height never changes. The scroll distance is whatever the section has beyond one stage (see globals.css).
 const stickyStage=section.querySelector<HTMLElement>('.experience-stage')??section;
 const timeline=gsap.timeline({paused:true,defaults:{ease:'none'},onUpdate:update});
 timeline.to(state,{p:1,duration:1},0).to(state,{radius:distance*.94,duration:.15},0);
 const stagger:Record<string,number>={Panel_Front:.15,Side_Left:.22,Side_Right:.22,Air_Grid:.25,Filter_Left:.31,Filter_Right:.31,Evaporator_Coil:.39,Blower_Fan:.47,Fan_Motor:.51,PCB:.56,Horizontal_Flap:.46,Flap_Motor:.53,Main_Chassis:.37};
 for(const p of parts){const offset=OFFSETS[p.name];const spread=mobile?.72:1;timeline.to(p.object.position,{x:p.position.x+offset[0]*spread,y:p.position.y+offset[1]*spread,z:p.position.z+offset[2]*spread,duration:.28},stagger[p.name]);}
 timeline.to(root.rotation,{y:-.15,x:.06,duration:.60},.15).to(state,{radius:distance*1.08,duration:.55},.25);
 // Lift the panel into a natural inspection angle; reverse scroll restores the exact moulded fit.
 const front=parts.find(p=>p.name==='Panel_Front');if(front)timeline.to(front.object.rotation,{x:-.12,duration:.28},.15);
 const syncScroll=()=>{const span=Math.max(1,section.offsetHeight-stickyStage.offsetHeight);const value=THREE.MathUtils.clamp(-section.getBoundingClientRect().top/span,0,1);timeline.progress(value);section.toggleAttribute('data-scroll-complete',value>=.999);};
 window.addEventListener('scroll',syncScroll,{passive:true});window.addEventListener('resize',syncScroll);syncScroll();return()=>{window.removeEventListener('scroll',syncScroll);window.removeEventListener('resize',syncScroll);section.removeEventListener('ac-reset-view',reset);timeline.scrollTrigger?.kill();timeline.kill();for(const p of parts){p.object.position.copy(p.position);p.object.rotation.copy(p.rotation);}};
}







