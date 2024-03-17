import { imagePrompt, parseImagePrompt } from '../helpers/parsePrompt';
import { defaultPrompt } from '../constants/serverOptions';
import { MissingModelError } from '../errors/missingModelError';

jest.mock('../helpers/getComfyModels', () => {
  return {
    doesModelExist: jest.fn(),
  };
});

describe('parseImagePrompt', () => {
  type TestCase = [
    testDescripton: string,
    positive_prompt: string,
    prompt: imagePrompt,
    modelExists: boolean,
  ];

  const cases: TestCase[] = [
    [
      'parses message with only positive prompt',
      '!fate 1girl, blue hair',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: defaultPrompt.negative_prompt,
        height: defaultPrompt.height,
        width: defaultPrompt.width,
        image_count: defaultPrompt.image_count,
        checkpoint: defaultPrompt.checkpoint,
      },
      true,
    ],
    [
      'parses message with custom negative prompt',
      '!fate 1girl, blue hair --no=banana',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: 'banana',
        height: defaultPrompt.height,
        width: defaultPrompt.width,
        image_count: defaultPrompt.image_count,
        checkpoint: defaultPrompt.checkpoint,
      },
      true,
    ],
    [
      'parses message with custom height',
      '!fate 1girl, blue hair --height=123',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: defaultPrompt.negative_prompt,
        height: 123,
        width: defaultPrompt.width,
        image_count: defaultPrompt.image_count,
        checkpoint: defaultPrompt.checkpoint,
      },
      true,
    ],
    [
      'parses message with custom width',
      '!fate 1girl, blue hair --width=456',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: defaultPrompt.negative_prompt,
        height: defaultPrompt.height,
        width: 456,
        image_count: defaultPrompt.image_count,
        checkpoint: defaultPrompt.checkpoint,
      },
      true,
    ],
    [
      'parses message with custom image count',
      '!fate 1girl, blue hair --count=2',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: defaultPrompt.negative_prompt,
        height: defaultPrompt.height,
        width: defaultPrompt.width,
        image_count: 2,
        checkpoint: defaultPrompt.checkpoint,
      },
      true,
    ],
    [
      'parses message with existing checkpoint',
      '!fate 1girl, blue hair --model=applesMix',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: defaultPrompt.negative_prompt,
        height: defaultPrompt.height,
        width: defaultPrompt.width,
        image_count: defaultPrompt.image_count,
        checkpoint: 'applesMix.safetensors',
      },
      true,
    ],
    [
      'parses message with nonexistent checkpoint',
      '!fate 1girl, blue hair --model=orangesMix',
      {
        positive_prompt: '1girl, blue hair',
        negative_prompt: defaultPrompt.negative_prompt,
        height: defaultPrompt.height,
        width: defaultPrompt.width,
        image_count: defaultPrompt.image_count,
        checkpoint: 'orangesMix.safetensors',
      },
      false,
    ],
  ];

  it.each(cases)('%s', (_desc, message, expected, modelExists) => {
    // Act
    jest.spyOn(require('../helpers/getComfyModels'), 'doesModelExist').mockImplementation(() => {
      return modelExists;
    });

    // Act && Assert
    if (!modelExists) {
      expect(() => parseImagePrompt(message)).toThrow(MissingModelError);
    } else {
      const actual = parseImagePrompt(message);
      expect(actual).toEqual(expected);
    }
  });
});
