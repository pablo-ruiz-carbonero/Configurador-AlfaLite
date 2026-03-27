export class NovaStarConfigDto {
  outputResolution: string; // '1080p', '4K', etc
  colorDepth: 8 | 10 | 12;
  refreshRate: 50 | 60;
  syncMode: 'free-run' | 'sync-to-input' | 'locked';
}
