interface serverConfig {
  channels: string[];
  server: string;
  port: number;
  userName: string;
  realName: string;
}

// Define IRC server configuration
export const serverOptions: serverConfig = {
  channels: ['#nanobot'], // Replace 'your-channel' with the channel you want to join
  server: '192.168.50.5', // Replace 'irc.freenode.net' with your IRC server
  port: 6667, // Replace with your IRC server's port if necessary
  userName: 'FateBot', // Replace 'YourBotName' with your bot's desired username
  realName: 'Fate-Chan the IRC Bot', // Replace 'YourBotRealName' with your bot's real name
};

export const triggerWord: string = '!fate';

export const defaultPrompt = {
  negative_prompt: 'nsfw, nude',
  width: 512,
  height: 512,
  image_count: 1,
  checkpoint: "darkjunglemix_V2InkFix.safetensors"
};
