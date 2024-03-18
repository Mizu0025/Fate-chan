import axios from 'axios';
import fs from 'fs';
import { generate_txt2img } from '../generateImage';
import { ImageGenerationError } from '../errors/imageGenerationError';
import { mockWorkflowData } from '../constants/mockWorkflow';
import { comfyUrl } from '../constants/imageGeneration';

jest.mock('axios');
jest.mock('fs');

describe('generate_txt2img', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate image successfully', async () => {
    const mockParsedPrompt = {
      checkpoint: 'checkpoint_name',
      width: 256,
      height: 256,
      image_count: 1,
      positive_prompt: 'positive',
      negative_prompt: 'negative',
    };

    const mockWorkflowJson = JSON.stringify(mockWorkflowData);

    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockWorkflowJson);
    jest.spyOn(axios, 'post').mockResolvedValue({ data: 'success' });

    await expect(generate_txt2img(mockParsedPrompt)).resolves.toBeUndefined();

    expect(fs.readFileSync).toHaveBeenCalledWith('workflows/txt2img.json', 'utf-8');

    expect(axios.post).toHaveBeenCalledWith(`${comfyUrl}/prompt`, expect.any(String), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should throw error if generation fails', async () => {
    const mockParsedPrompt = {
      checkpoint: 'checkpoint_name',
      width: 256,
      height: 256,
      image_count: 1,
      positive_prompt: 'positive',
      negative_prompt: 'negative',
    };

    const mockWorkflowJson = JSON.stringify(mockWorkflowData);

    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockWorkflowJson);
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('Server returned 400'));

    await expect(generate_txt2img(mockParsedPrompt)).rejects.toThrow(ImageGenerationError);

    expect(fs.readFileSync).toHaveBeenCalledWith('workflows/txt2img.json', 'utf-8');

    expect(axios.post).toHaveBeenCalledWith(`${comfyUrl}/prompt`, expect.any(String), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});
