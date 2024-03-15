import { parseTriggerMessage } from '../helpers/parsePrompt';
import { defaultPrompt } from '../constants/serverOptions';

describe('parseTriggerMessage', () => {
  test('parses message with all options', () => {
    // Setup
    const message =
      '!fate 1girl, blue hair --height=123 --width=456 --count=2 --no=skirt, freckles';
    const expected = {
      positive_prompt: '1girl, blue hair',
      negative_prompt: 'skirt, freckles',
      height: 123,
      width: 456,
      image_count: 2,
    };

    // Act
    const actual = parseTriggerMessage(message);

    // Assert
    expect(actual).toEqual(expected);
  });

  test('parses message with only positive prompt', () => {
    // Setup
    const message = '!fate 1girl, blue hair';
    const expected = {
      positive_prompt: '1girl, blue hair',
      negative_prompt: defaultPrompt.negative_prompt,
      height: defaultPrompt.height,
      width: defaultPrompt.width,
      image_count: defaultPrompt.image_count,
    };

    // Act
    const actual = parseTriggerMessage(message);

    // Assert
    expect(actual).toEqual(expected);
  });
});
