import axios from 'axios';
import fs from 'fs';
import { generate_txt2img } from '../generateImage';
import { ImageGenerationError } from '../errors/imageGenerationError';
import { mockWorkflowData } from '../constants/mockWorkflow';
import { comfyUrl } from '../constants/imageGeneration';

jest.mock('axios');
jest.mock('fs');
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    colorize: jest.fn(),
    simple: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

describe('generate_txt2img', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate image successfully', async () => {
    // Setup
    const mockParsedPrompt = {
      checkpoint: 'checkpoint_name',
      width: 256,
      height: 256,
      image_count: 1,
      positive_prompt: 'positive',
      negative_prompt: 'negative',
    };

    const mockWorkflowJson = JSON.stringify(mockWorkflowData);
    const workflowJsonPath = 'workflows/txt2img.json';
    const workflowEncode = 'utf-8';
    const workflowHeaderInfo = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Act
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockWorkflowJson);
    jest.spyOn(axios, 'post').mockResolvedValue({ data: 'success' });

    // Assert
    await expect(generate_txt2img(mockParsedPrompt)).resolves.toBeUndefined();
    expect(fs.readFileSync).toHaveBeenCalledWith(workflowJsonPath, workflowEncode);
    expect(axios.post).toHaveBeenCalledWith(
      `${comfyUrl}/prompt`,
      expect.any(String),
      workflowHeaderInfo,
    );
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
    const workflowJsonPath = 'workflows/txt2img.json';
    const workflowEncode = 'utf-8';
    const workflowHeaderInfo = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Act
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockWorkflowJson);
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('Server returned 400'));

    // Assert
    await expect(generate_txt2img(mockParsedPrompt)).rejects.toThrow(ImageGenerationError);
    expect(fs.readFileSync).toHaveBeenCalledWith(workflowJsonPath, workflowEncode);
    expect(axios.post).toHaveBeenCalledWith(
      `${comfyUrl}/prompt`,
      expect.any(String),
      workflowHeaderInfo,
    );
  });
});
