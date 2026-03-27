export class BromptonConfigDto {
  frameRate: 60 | 120 | 240;
  bitDepth: 8 | 10 | 12;
  ull: boolean; // Ultra-Low Latency
  failover: boolean;
  redundant: boolean;
  switches: boolean;
  interpolated: boolean;
}
