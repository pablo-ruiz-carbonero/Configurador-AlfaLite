export interface Product {
  id?: number;
  name: string;
  location: string[];
  application: string[];
  horizontal: number;
  vertical: number;
  pixelPitch: number;
  width: number;
  height: number;
  depth: number;
  consumption: number;
  weight: number;
  brightness: number;
  refreshRate?: number;
  contrast?: string;
  visionAngle?: string;
  redundancy?: string;
  curvedVersion?: string;
  opticalMultilayerInjection?: string;
  image?: string;
}
