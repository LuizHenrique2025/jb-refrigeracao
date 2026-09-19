import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { PartName } from './model-config';

type V3 = [number,number,number];
/** A dimensional product model: curved mouldings, open mesh, bent copper and radial blades.
 * All dimensions share the same metre-like design space and assembled datum. */
export function createStudioAC(): THREE.Group {
  const root = new THREE.Group(); root.name = 'AC_ROOT';
  const plastic = new THREE.MeshPhysicalMaterial({color:'#f1f2f0',roughness:.24,metalness:0,clearcoat:.48,clearcoatRoughness:.25});
  const inside = new THREE.MeshStandardMaterial({color:'#b9b9b2',roughness:.49});
  const black = new THREE.MeshStandardMaterial({color:'#171e22',roughness:.36,metalness:.12});
  const rubber = new THREE.MeshStandardMaterial({color:'#1e2425',roughness:.78});
  const steel = new THREE.MeshStandardMaterial({color:'#a6b0b7',roughness:.25,metalness:.9});
  const copper = new THREE.MeshStandardMaterial({color:'#b56835',roughness:.26,metalness:.86});
  const fin = new THREE.MeshStandardMaterial({color:'#7198a9',roughness:.38,metalness:.77});
  const frame = new THREE.MeshStandardMaterial({color:'#b7c4c7',roughness:.43,metalness:.12});
  const meshMat = new THREE.MeshStandardMaterial({color:'#6f7a79',roughness:.65,metalness:.18});
  const board = new THREE.MeshStandardMaterial({color:'#145748',roughness:.44,metalness:.13});
  const gold = new THREE.MeshStandardMaterial({color:'#c8a458',roughness:.42,metalness:.74});
  const white = new THREE.MeshStandardMaterial({color:'#ddd9cb',roughness:.6});
  const group=(name:PartName,pos:V3=[0,0,0])=>{const g=new THREE.Group();g.name=name;g.position.set(...pos);root.add(g);return g;};
  const mesh=(g:THREE.Object3D,geometry:THREE.BufferGeometry,material:THREE.Material,pos:V3=[0,0,0],rotation:V3=[0,0,0])=>{const m=new THREE.Mesh(geometry,material);m.position.set(...pos);m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;};
  const box=(g:THREE.Object3D,s:V3,p:V3,mat:THREE.Material=plastic,r=.025)=>mesh(g,new RoundedBoxGeometry(...s,3,Math.min(r,...s.map(x=>x/2))),mat,p);
  const cylinder=(g:THREE.Object3D,r:number,len:number,p:V3,mat:THREE.Material=steel,axis='x')=>mesh(g,new THREE.CylinderGeometry(r,r,len,32),mat,p,axis==='x'?[0,0,Math.PI/2]:axis==='z'?[Math.PI/2,0,0]:[0,0,0]);
  const instances=(g:THREE.Object3D,geometry:THREE.BufferGeometry,mat:THREE.Material,transforms:{p:V3;r?:V3;s?:V3}[])=>{const inst=new THREE.InstancedMesh(geometry,mat,transforms.length);const dummy=new THREE.Object3D();transforms.forEach((t,i)=>{dummy.position.set(...t.p);dummy.rotation.set(...(t.r??[0,0,0]));dummy.scale.set(...(t.s??[1,1,1]));dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere();inst.castShadow=true;inst.receiveShadow=true;g.add(inst);return inst;};
  const curve=(g:THREE.Object3D,points:V3[],radius:number,mat:THREE.Material)=>mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,radius,8,false),mat);
  const screw=(g:THREE.Object3D,p:V3)=>{cylinder(g,.037,.025,p,steel,'z');mesh(g,new THREE.BoxGeometry(.046,.007,.005),black,[p[0],p[1],p[2]+.014]);};
  // Extruding a smooth Y/Z section along X makes a continuous casing, not stacked blocks.
  const extruded=(shape:THREE.Shape,width:number,bevel=.025)=>{const geometry=new THREE.ExtrudeGeometry(shape,{depth:width,steps:1,bevelEnabled:true,bevelSegments:4,bevelSize:bevel,bevelThickness:bevel,curveSegments:24});geometry.rotateY(Math.PI/2);geometry.translate(-width/2,0,0);return geometry;};
  const panelShape=new THREE.Shape();panelShape.moveTo(-.9,.94);panelShape.bezierCurveTo(-1.20,.9,-1.35,-.25,-1.07,-.65);panelShape.lineTo(-.96,-.65);panelShape.bezierCurveTo(-1.23,-.23,-1.09,.82,-.87,.85);panelShape.closePath();
  const panel=group('Panel_Front');mesh(panel,extruded(panelShape,6.96,.04),plastic);
  // Reinforcement on the unseen reverse; exposed naturally during the explosion.
  for(const x of [-2.6,-1.3,0,1.3,2.6])box(panel,[.035,1.12,.08],[x,.06,1.0],inside,.012);
  const displayCanvas=document.createElement('canvas');displayCanvas.width=128;displayCanvas.height=80;
  const ctx=displayCanvas.getContext('2d')!;ctx.clearRect(0,0,128,80);ctx.fillStyle='#72878d';ctx.font='300 54px monospace';ctx.textAlign='center';ctx.fillText('24',64,61);
  const displayTexture=new THREE.CanvasTexture(displayCanvas);displayTexture.colorSpace=THREE.SRGBColorSpace;
  mesh(panel,new THREE.PlaneGeometry(.31,.19),new THREE.MeshBasicMaterial({map:displayTexture,transparent:true,opacity:.7,depthWrite:false}),[2.55,-.05,1.236]);
  const sideShape=new THREE.Shape();sideShape.moveTo(.57,1.0);sideShape.lineTo(-.82,1.0);sideShape.bezierCurveTo(-1.17,.98,-1.39,-.38,-.96,-.86);sideShape.quadraticCurveTo(-.5,-1.03,.43,-.94);sideShape.quadraticCurveTo(.62,-.86,.61,-.65);sideShape.lineTo(.61,.84);sideShape.quadraticCurveTo(.61,1,.57,1);sideShape.closePath();
  for(const [name,x] of [['Side_Left',-3.57],['Side_Right',3.57]] as const){const side=group(name,[x,0,0]);mesh(side,extruded(sideShape,.15,.045),plastic);for(const y of [-.7,.75]){cylinder(side,.075,.06,[0,y,-.29],inside);cylinder(side,.035,.08,[0,y,-.29],steel);}}
  const chassis=group('Main_Chassis',[0,0,-.48]);box(chassis,[6.93,1.9,.105],[0,0,0],inside,.075);box(chassis,[6.75,.14,1.16],[0,-.92,.52],inside,.035);
  const ribTransforms=Array.from({length:15},(_,i)=>({p:[-3.2+i*.45,-.05,.10] as V3}));instances(chassis,new THREE.BoxGeometry(.026,1.6,.13),inside,ribTransforms);
  for(const y of [-.5,.2,.72])box(chassis,[6.6,.025,.08],[0,y,.08],inside,.01);
  // Curved air duct, with visible louvers and a dark outlet rather than a closed cube.
  mesh(chassis,new THREE.CylinderGeometry(.5,.5,6.1,40,1,true,Math.PI/2,Math.PI),inside,[-.2,-.32,.64],[0,0,Math.PI/2]);
  box(chassis,[6.37,.21,.07],[-.13,-.65,1.1],black,.03);
  instances(chassis,new THREE.BoxGeometry(.034,.31,.28),inside,Array.from({length:16},(_,i)=>({p:[-3.03+i*.39,-.67,.93] as V3,r:[0,-.2,0] as V3})));
  for(const x of [-3.12,0,3.12])for(const y of [-.78,.73])screw(chassis,[x,y,.12]);
  const grid=group('Air_Grid',[0,.97,-.03]);for(const z of [-.5,0,.5])box(grid,[6.9,.06,.042],[0,0,z],plastic,.02);
  instances(grid,new RoundedBoxGeometry(.038,.053,1.04,2,.015),plastic,Array.from({length:58},(_,i)=>({p:[-3.34+i*.117,0,0] as V3})));
  for(const x of [-3.43,3.43])box(grid,[.068,.07,1.07],[x,0,0],plastic,.023);
  // Washable mesh is genuinely open, with fine woven wires and curved reinforcing ribs.
  for(const [name,x] of [['Filter_Left',-1.73],['Filter_Right',1.39]] as const){const filter=group(name,[x,.41,.69]);
    const surface=(y:number)=>.11*(1-Math.pow(y/.57,2));
    instances(filter,new THREE.BoxGeometry(.008,1.04,.008),meshMat,Array.from({length:85},(_,i)=>({p:[-1.43+i*.034,.0,.075] as V3})));
    instances(filter,new THREE.BoxGeometry(2.87,.008,.008),meshMat,Array.from({length:34},(_,i)=>({p:[0,-.5+i*.03,surface(-.5+i*.03)] as V3})));
    for(const y of [-.54,.0,.54])box(filter,[2.98,.036,.056],[0,y,surface(y)],frame,.016);
    for(const xx of [-1.47,-.73,0,.73,1.47])curve(filter,[[xx,-.55,0],[xx,0,.12],[xx,.55,0]],.02,frame);
    box(filter,[.18,.1,.055],[0,-.59,0],frame,.018);
  }
  const coil=group('Evaporator_Coil',[-.23,.27,.12]);
  const finShape=new THREE.Shape();finShape.moveTo(-.32,-.56);finShape.lineTo(-.32,.32);finShape.lineTo(.12,.65);finShape.lineTo(.30,.43);finShape.lineTo(.14,.23);finShape.lineTo(.14,-.56);finShape.closePath();
  const finGeometry=extruded(finShape,.009,.001);
  instances(coil,finGeometry,fin,Array.from({length:164},(_,i)=>({p:[-2.86+i*.035,0,0] as V3})));
  for(const y of [-.43,-.18,.08,.33]){cylinder(coil,.047,5.86,[0,y,.1],copper);cylinder(coil,.047,5.86,[0,y,-.1],copper);curve(coil,[[2.94,y,.1],[3.13,y,.1],[3.18,y,-.10],[2.94,y,-.1]],.047,copper);}
  for(const x of [-2.94,2.94]){box(coil,[.045,1.15,.46],[x,0,.06],steel,.012);for(const y of [-.44,.42])screw(coil,[x,y,.315]);}
  // Tangential impeller: open radial blades, dark injection-moulded rings and steel shaft.
  const blower=group('Blower_Fan',[-.21,-.4,.13]);cylinder(blower,.034,6.21,[0,0,0],steel);
  const bladeShape=new THREE.Shape();bladeShape.moveTo(.28,0);bladeShape.quadraticCurveTo(.38,.05,.32,.14);bladeShape.lineTo(.302,.137);bladeShape.quadraticCurveTo(.352,.053,.273,.016);bladeShape.closePath();
  const bladeGeometry=extruded(bladeShape,5.84,.002);
  instances(blower,bladeGeometry,black,Array.from({length:42},(_,i)=>({p:[0,0,0] as V3,r:[i*Math.PI*2/42,0,0] as V3})));
  for(const x of [-2.96,-1.98,-.99,0,.99,1.98,2.96])cylinder(blower,.365,.034,[x,0,0],black);
  for(const x of [-2.99,2.99])cylinder(blower,.105,.065,[x,0,0],rubber);
  const motor=group('Fan_Motor',[3.0,-.4,.13]);cylinder(motor,.305,.34,[0,0,0],steel);cylinder(motor,.27,.11,[.21,0,0],inside);cylinder(motor,.11,.14,[.30,0,0],black);cylinder(motor,.034,.82,[0,0,0],steel);
  for(const a of [0,Math.PI*.66,Math.PI*1.33]){const y=Math.cos(a)*.3,z=Math.sin(a)*.3;box(motor,[.14,.16,.12],[0,y,z],steel,.025);cylinder(motor,.028,.2,[0,y,z],black);}
  curve(motor,[[.18,-.16,-.14],[.32,-.35,-.15],[.45,-.37,-.09]],.018,rubber);
  const pcb=group('PCB',[3.12,.40,.16]);box(pcb,[.58,1.02,.037],[0,0,0],board,.014);
  for(const x of [-.12,.11])for(const y of [-.3,-.08,.15,.36]){box(pcb,[.12,.09,.012],[x,y,.032],gold,.003);box(pcb,[.074,.047,.04],[x,y,.054],black,.004);}
  for(const [x,y,r,h] of [[-.16,.30,.066,.13],[.13,-.20,.058,.12],[.12,.3,.047,.12],[-.16,-.3,.04,.09]]){cylinder(pcb,r,h,[x,y,.07],black,'z');cylinder(pcb,r*.8,.01,[x,y,.07+h/2],steel,'z');}
  box(pcb,[.19,.22,.10],[.03,.04,.078],black,.006);box(pcb,[.23,.09,.09],[0,-.43,.065],white,.01);
  instances(pcb,new THREE.BoxGeometry(.007,.027,.013),gold,Array.from({length:7},(_,i)=>({p:[-.087+i*.029,-.43,.115] as V3})));
  for(const x of [-.24,.24])for(const y of [-.45,.45])screw(pcb,[x,y,.029]);
  const flap=group('Horizontal_Flap',[0,-.82,.65]);const flapShape=new THREE.Shape();flapShape.moveTo(-.48,.1);flapShape.quadraticCurveTo(-.2,-.12,.14,-.08);flapShape.lineTo(.14,-.035);flapShape.quadraticCurveTo(-.2,-.07,-.46,.14);flapShape.closePath();mesh(flap,extruded(flapShape,6.63,.015),plastic);
  for(const x of [-2.75,-1.4,0,1.4,2.75])box(flap,[.03,.08,.18],[x,.065,.07],inside,.012);
  const flapMotor=group('Flap_Motor',[3.4,-.78,.58]);cylinder(flapMotor,.14,.17,[0,0,0],steel);box(flapMotor,[.15,.21,.17],[.13,-.03,0],black,.025);cylinder(flapMotor,.036,.35,[0,0,0],steel);
  return root;
}

export function disposeStudioAC(root:THREE.Object3D){const geometries=new Set<THREE.BufferGeometry>();const materials=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(m instanceof THREE.MeshBasicMaterial)m.map?.dispose();m.dispose();});}
