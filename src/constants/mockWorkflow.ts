export const mockWorkflowData = {
  '3': {
    inputs: {
      seed: 987654321,
      steps: 20,
      cfg: 8,
      sampler_name: 'mock_sampler',
      scheduler: 'mock_scheduler',
      denoise: 1,
      model: ['4', 0],
      positive: ['6', 0],
      negative: ['7', 0],
      latent_image: ['5', 0],
    },
    class_type: 'KSampler',
  },
  '4': {
    inputs: {
      ckpt_name: 'mock_checkpoint',
    },
    class_type: 'CheckpointLoaderSimple',
  },
  '5': {
    inputs: {
      width: 256,
      height: 256,
      batch_size: 4,
    },
    class_type: 'EmptyLatentImage',
  },
  '6': {
    inputs: {
      text: 'mock_text_1',
      clip: ['4', 1],
    },
    class_type: 'CLIPTextEncode',
  },
  '7': {
    inputs: {
      text: 'mock_text_2',
      clip: ['4', 1],
    },
    class_type: 'CLIPTextEncode',
  },
  '8': {
    inputs: {
      samples: ['3', 0],
      vae: ['4', 2],
    },
    class_type: 'VAEDecode',
  },
  '9': {
    inputs: {
      filename_prefix: 'mock_filename_prefix',
      images: ['8', 0],
    },
    class_type: 'SaveImage',
  },
};
