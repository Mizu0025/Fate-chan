// getCurrentModels.test.ts
import { getCurrentModels, doesModelExist } from '../helpers/getComfyModels';

jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue(['model1.safetensors', 'model2.safetensors']),
}));
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

describe('getCurrentModels', () => {
  it('should return an array of models', () => {
    const models = getCurrentModels();
    expect(models).toEqual(['model1.safetensors', 'model2.safetensors']);
  });
});

describe('doesModelExist', () => {
  it('should return true if the model exists', () => {
    expect(doesModelExist('model1.safetensors')).toBe(true);
  });

  it('should return false if the model does not exist', () => {
    expect(doesModelExist('nonexistent_model.safetensors')).toBe(false);
  });
});
