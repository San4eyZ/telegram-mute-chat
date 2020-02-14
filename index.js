const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
    path: path.join(__dirname, '.env'),
});

const { connect } = require('./lib/api/connect');
const { muteChat, unmuteChat } = require('./lib/api/mute');
const { chatsToMute, allowedCommands } = require('./config');

const command = process.argv[2];

if (!command) {
    console.error(`Empty command, specify one of this: ${allowedCommands}`);
    process.exit(1);
}

if (!allowedCommands.includes(command)) {
    console.error(`Allowed commands: ${allowedCommands}`);
    process.exit(1);
}

const connectionPromise = connect();

switch (command) {
    case 'mute':
        connectionPromise
            .then(async (client) => {
                for (const { id, title } of chatsToMute) {
                    await muteChat(client, id);
                    console.log('muted: ', title);
                }
            })
            .catch(console.error)
            .finally(() => {
                process.exit(0);
            });

        break;
    case 'unmute':
        connectionPromise
            .then(async (client) => {
                for (const { id, title } of chatsToMute) {
                    await unmuteChat(client, id);
                    console.log('unmuted: ', title);
                }
            })
            .catch(console.error)
            .finally(() => {
                process.exit(0);
            });

        break;
    case 'list':
        connectionPromise
            .then(async (client) => {
                const { chat_ids } = await client.invoke({
                    _: 'getChats',
                    limit: 100,
                    offset_order: '9223372036854775807',
                    offset_chat_id: 0,
                });

                await client.in;

                return Promise.all(
                    chat_ids
                        .filter((id) => id < 0)
                        .map(async (id) => {
                            const chat = await client.invoke({
                                _: 'getChat',
                                chat_id: id,
                            });

                            return { id: chat.id, title: chat.title };
                        }),
                );
            })
            .then(console.log)
            .catch(console.error)
            .finally(() => process.exit(0));
}
