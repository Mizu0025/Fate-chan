import irc from 'irc';
import { triggerWord } from '../constants/serverOptions';
import { parseImagePrompt } from './parsePrompt';
import { requestImageGeneration } from './requestImageGen';
import { currently_loaded_model } from '../generateImage';
import { getCurrentModels } from './getComfyModels';

async function generateImageRequest(client: irc.Client, from: string, to: string, message: string) {
  try {
    const parsedPrompt = parseImagePrompt(message);
    if (parsedPrompt.checkpoint != currently_loaded_model) {
      client.say(to, `The model is now ${parsedPrompt.checkpoint}`);
    }

    const imagesUrlPaths = await requestImageGeneration(parsedPrompt);

    imagesUrlPaths.forEach((imageUrlPath: String) => {
      client.say(to, `${from}: ${imageUrlPath}`);
    });
  } catch (error) {
    console.error(error);
    client.say(to, `${error}`);
  }
}

function getCurrenModels(client: irc.Client, to: string) {
  const currentModels = getCurrentModels();

  client.say(to, `${currentModels}`);
}

function explainFunctions(client: irc.Client, to: string) {
  const introduction = "Hello! Here's a list of my current functions:";
  const generateImages = ` - To generate images, use "${triggerWord} prompt". I accept modifiers too!`;
  const generateModifiers = `--width, --height and --no control image dimensions and anything you don't want in the image. --count influences the number I'll make (default 1), and --model lets you swap out what checkpoint model I'm using; that influences artstyle.`;
  const getModels = `If you want a list of current models, use "${triggerWord} --currentModels"`;

  client.say(to, `${introduction}`);
  client.say(to, `${generateImages}`);
  client.say(to, `${generateModifiers}`);
  client.say(to, `${getModels}`);
}

export async function handleTriggerMessage(
  client: irc.Client,
  from: string,
  to: string,
  message: string,
) {
  if (message.toLowerCase().includes(triggerWord)) {
    switch (message) {
      case `${triggerWord} --help`:
        explainFunctions(client, to);
        break;

      case `${triggerWord} --currentModels`:
        getCurrenModels(client, to);
        break;

      default:
        generateImageRequest(client, from, to, message);
        break;
    }
  }
}
