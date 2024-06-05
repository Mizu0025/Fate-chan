interface PromptInputs {
  seed: number;
  steps: number;
  cfg: number;
  sampler_name: string;
  scheduler: string;
  denoise: number;
  model: [string, number];
  positive: [string, number];
  negative: [string, number];
  latent_image: [string, number];
}

interface Prompt {
  inputs: PromptInputs;
  class_type: string;
}

interface LoaderInputs {
  ckpt_name: string;
}

interface Loader {
  inputs: LoaderInputs;
  class_type: string;
}

interface EmptyLatentImageInputs {
  width: number;
  height: number;
  batch_size: number;
}

interface EmptyLatentImage {
  inputs: EmptyLatentImageInputs;
  class_type: string;
}

interface CLIPTextEncodeInputs {
  text: string;
  clip: [string, number];
}

interface CLIPTextEncode {
  inputs: CLIPTextEncodeInputs;
  class_type: string;
}

interface VAEDecodeInputs {
  samples: [string, number];
  vae: [string, number];
}

interface VAEDecode {
  inputs: VAEDecodeInputs;
  class_type: string;
}

interface SaveImageInputs {
  filename_prefix: string;
  images: [string, number];
}

interface SaveImage {
  inputs: SaveImageInputs;
  class_type: string;
}

export interface RequestObject {
  3: Prompt;
  4: Loader;
  5: EmptyLatentImage;
  6: CLIPTextEncode;
  7: CLIPTextEncode;
  8: VAEDecode;
  9: SaveImage;
}

export interface JSONStructure {
  prompt: RequestObject;
}
