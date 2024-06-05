export interface checkpointConfig {
  name: string;
  description: string;
  positivePrompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  cfg_scale: number;
  guidance: number;
  steps: number;
  ksampler: string;
  clip_skip: number;
}

export interface checkpointConfigList {
  models: Partial<checkpointConfig>[];
}
