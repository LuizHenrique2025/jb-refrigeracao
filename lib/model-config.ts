// Set this to '/models/split-ac.glb' after adding a validated, optimized asset.
// A missing model never triggers an unnecessary network request.
export const MODEL_URL: string | null = null;
export const PART_NAMES = [
  "Panel_Front",
  "Air_Grid",
  "Filter_Left",
  "Filter_Right",
  "Evaporator_Coil",
  "Blower_Fan",
  "Fan_Motor",
  "Main_Chassis",
  "PCB",
  "Horizontal_Flap",
  "Flap_Motor",
  "Side_Left",
  "Side_Right",
] as const;
export type PartName = (typeof PART_NAMES)[number];
export const OFFSETS: Record<PartName, [number, number, number]> = {
  Panel_Front: [0, -2.4, 2.7],
  Air_Grid: [0, 2.6, 0.35],
  Filter_Left: [-0.1, 1.5, 1.05],
  Filter_Right: [0.1, 1.5, 1.05],
  Evaporator_Coil: [0, 0.65, -0.65],
  Blower_Fan: [0, -0.7, 1.1],
  Fan_Motor: [1.35, -0.7, 1.1],
  Main_Chassis: [0, 0, -1.25],
  PCB: [1.75, 0.15, 0.65],
  Horizontal_Flap: [0, -1.5, 1.95],
  Flap_Motor: [1.5, -1.5, 1.95],
  Side_Left: [-1.55, 0.15, 0.1],
  Side_Right: [1.55, 0.15, 0.1],
};
