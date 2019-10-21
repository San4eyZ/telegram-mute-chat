const chatsToMute = require('./chats');

module.exports = {
    chatIdsTomute: chatsToMute.map(({ id }) => id),
    allowedCommands: ['mute', 'unmute'],
};
