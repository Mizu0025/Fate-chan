interface serverConfig {
  channels: string[];
  server: string;
  port: number;
  userName: string;
  realName: string;
}

const testServer: string = '192.168.50.5';
const liveServer: string = 'irc.rizon.net';
const isLiveEnvironment: boolean = process.env.ENVIRONMENT === 'live';

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
  positive_prompt: 'masterpiece, best quality',
  negative_prompt: 'lowres, worst quality, low quality',
  width: 1024,
  height: 1024,
  image_count: 1,
  checkpoint: 'animagineXLV3_v30.safetensors',
};
