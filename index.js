const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
    path: path.join(__dirname, '.env'),
});

const { connect } = require('./lib/api/connect');
const { muteChat, unmuteChat } = require('./lib/api/mute');
const { chatIdsTomute, allowedCommands } = require('./config');

const command = process.argv[2];

if (!command) {
    console.error(`Empty command, specify one of this: ${allowedCommands}`);
    process.exit(1);
}

if (!allowedCommands.includes(command)) {
    console.error(`Allowed commands: ${allowedCommands}`);
    process.exit(1);
}

switch (command) {
    case 'mute':
        connect()
            .then(async (client) => Promise.all(chatIdsTomute.map((id) => muteChat(client, id))))
            .catch(console.error)
            .finally(() => {
                process.exit(0);
            });

        break;
    case 'unmute':
        connect()
            .then(async (client) => Promise.all(chatIdsTomute.map((id) => unmuteChat(client, id))))
            .catch(console.error)
            .finally(() => {
                process.exit(0);
            });

        break;
}
