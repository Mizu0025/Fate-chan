import { checkpointConfig } from '../constants/checkpointConfig';
import {
  changeCheckpointTrigger,
  heightTrigger,
  imageCountTrigger,
  negativePromptTrigger,
  optionTrigger,
  widthTrigger,
} from '../constants/triggerWords';
import { doesCheckpointExist } from '../helpers/doesCheckpointExist';
import { getCurrentCheckpoints } from '../helpers/getCurrentCheckpoints';
import { parseImagePrompt } from '../helpers/parsePrompt';

jest.mock('../helpers/getCurrentCheckpoints', () => ({
  getCurrentCheckpoints: jest.fn(),
}));

jest.mock('../helpers/doesCheckpointExist', () => ({
  doesCheckpointExist: jest.fn(),
}));

const message: string = '1girl, brown hair, green eyes, chibi';

function CreateMockCheckpoints(props: Partial<checkpointConfig> = {}): checkpointConfig[] {
  const defaultConfig: checkpointConfig[] = [
    {
      name: 'mockName',
      description: 'mockDescription',
      positivePrompt: 'mockPositivePrompt',
      negativePrompt: 'mockNegativePrompt',
      width: 1024,
      height: 1024,
      cfg_scale: 1,
      guidance: 2,
      steps: 20,
      ksampler: 'mockKSampler',
      clip_skip: 2,
    },
  ];

  return { ...defaultConfig, ...props };
}

describe('parseImagePrompt', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses prompt with custom positive prompt', () => {
    // Arrange
    const mockCheckpoints = CreateMockCheckpoints();
    const expected = `${mockCheckpoints[0].positivePrompt}, ${message}`;

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockCheckpoints);
    const response = parseImagePrompt(message);

    // Assert
    expect(response.positive_prompt).toEqual(expected);
  });

  it('parses prompt with custom negative prompt', () => {
    // Arrange
    const modifier = 'banana';
    const mockCheckpoints = CreateMockCheckpoints({ negativePrompt: modifier });
    const expected = `${mockCheckpoints[0].negativePrompt}, ${modifier}`;

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockCheckpoints);
    const response = parseImagePrompt(
      message + `${optionTrigger}${negativePromptTrigger}=${modifier}`,
    );

    // Assert
    expect(response.negative_prompt).toEqual(expected);
  });

  it('parses prompt with custom width', () => {
    // Arrange
    const modifier = 512;
    const mockCheckpoints = CreateMockCheckpoints({ width: modifier });

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockCheckpoints);
    const response = parseImagePrompt(message + `${optionTrigger}${widthTrigger}=${modifier}`);

    // Assert
    expect(response.width).toEqual(modifier);
  });

  it('parses prompt with custom height', () => {
    // Arrange
    const modifier = 745;
    const mockCheckpoints = CreateMockCheckpoints({ height: modifier });

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockCheckpoints);
    const response = parseImagePrompt(message + `${optionTrigger}${heightTrigger}=${modifier}`);

    // Assert
    expect(response.height).toEqual(modifier);
  });

  it('parses prompt with custom image count', () => {
    // Arrange
    const modifier = 4;
    const mockCheckpoints = CreateMockCheckpoints();

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockCheckpoints);
    const response = parseImagePrompt(message + `${optionTrigger}${imageCountTrigger}=${modifier}`);

    // Assert
    expect(response.image_count).toEqual(modifier);
  });

  it('parses prompt with custom checkpoint', () => {
    // Arrange
    const modifier = 'apple';
    const mockCheckpoints = CreateMockCheckpoints({ name: modifier });

    // Act
    (getCurrentCheckpoints as jest.Mock).mockReturnValue(mockCheckpoints);
    (doesCheckpointExist as jest.Mock).mockReturnValue(true);
    const response = parseImagePrompt(
      message + `${optionTrigger}${changeCheckpointTrigger}=${modifier}`,
    );

    // Assert
    expect(response.checkpoint).toEqual(modifier);
  });
});
