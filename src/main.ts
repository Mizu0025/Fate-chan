import irc from 'irc'

interface serverConfig {
  channels: string[]
  server: string
  port: number
  userName: string
  realName: string
}

// Define IRC server configuration
const serverOptions: serverConfig = {
  channels: ['#nanobot'], // Replace 'your-channel' with the channel you want to join
  server: '192.168.50.5', // Replace 'irc.freenode.net' with your IRC server
  port: 6667, // Replace with your IRC server's port if necessary
  userName: 'FateBot', // Replace 'YourBotName' with your bot's desired username
  realName: 'Fate-Chan the IRC Bot', // Replace 'YourBotRealName' with your bot's real name
}

// Create a new IRC client
const client = new irc.Client(serverOptions.server, serverOptions.userName, serverOptions)

// Event listener for successful connection
client.addListener('registered', () => {
  console.log(`Connected to IRC server as ${serverOptions.userName}`)
})

// Event listener for errors
client.addListener('error', (message) => {
  console.error('Error: ', message)
})

// Event listener for messages in channels
client.addListener('message', (from, to, message) => {
  console.log(`Message from ${from} to ${to}: ${message}`)
})

// Event listener for joining channels
client.addListener('join', (channel, nick, message) => {
  console.log(`${nick} joined ${channel}`)
})
