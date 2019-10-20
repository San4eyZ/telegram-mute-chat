const chatsToMute = require('./chats.json');

module.exports = {
    chatIdsTomute: chatsToMute.map(({ id }) => id),
    allowedCommands: ['mute', 'unmute'],
};
