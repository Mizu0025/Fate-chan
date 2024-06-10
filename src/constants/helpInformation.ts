import { defaultPrompt } from './serverOptions';
import {
  triggerWord,
  optionTrigger,
  widthTrigger,
  heightTrigger,
  negativePromptTrigger,
  imageCountTrigger,
  changeCheckpointTrigger,
  currentCheckpointsTrigger,
} from './triggerWords';

export const helpInformation: string[] = [
  "Hello! Here's a list of my current functions:",
  `To generate images, use "${triggerWord} prompt". I accept modifiers too!`,
  `Modifiers are structured like so: ${triggerWord} ${optionTrigger}option.`,
  `The ${widthTrigger}, "${heightTrigger}" and "${negativePromptTrigger}" control image dimensions and anything you don't want in the image. "${imageCountTrigger}" influences the number I'll make (default ${defaultPrompt.image_count}), and "${changeCheckpointTrigger}" lets you swap out what checkpoint model I'm using; that influences artstyle.`,
  `If you want a list of current models, use "${currentCheckpointsTrigger}"`,
];
