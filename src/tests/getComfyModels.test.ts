// getCurrentModels.test.ts
import { getCurrentModels, doesModelExist } from '../helpers/getComfyModels';

jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue(['model1.safetensors', 'model2.safetensors']),
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
