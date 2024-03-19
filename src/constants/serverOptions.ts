interface serverConfig {
  channels: string[];
  server: string;
  port: number;
  userName: string;
  realName: string;
}

const testServer: string = '192.168.50.5';
const liveServer: string = 'irc.rizon.net';
const isLiveEnvironment: boolean = process.env.NODE_ENV === 'live';

// Define IRC server configuration
export const serverOptions: serverConfig = {
  channels: ['#nanobot'],
  server: isLiveEnvironment ? liveServer : testServer,
  port: 6667,
  userName: 'FateBot',
  realName: 'Fate-Chan the IRC Bot',
};

export const triggerWord: string = '!fate';

export const defaultPrompt = {
  positive_prompt: '1girl, red hair, green eyes, hoodie, jeans, city streets, raining, night',
  negative_prompt: 'nsfw, nude',
  width: 512,
  height: 512,
  image_count: 1,
  checkpoint: 'darkjunglemix_V2InkFix.safetensors',
};
