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
            .then((client) => Promise.all(chatIdsTomute.map((id) => muteChat(client, id))))
            .catch(console.error)
            .finally(() => {
                process.exit(0);
            });

        break;
    case 'unmute':
        connect()
            .then((client) => Promise.all(chatIdsTomute.map((id) => unmuteChat(client, id))))
            .catch(console.error)
            .finally(() => {
                process.exit(0);
            });

        break;
    case 'list':
        connect()
            .then(async (client) => {
                const { chat_ids } = await client.invoke({
                    _: 'getChats',
                    limit: 100,
                    offset_order: '9223372036854775807',
                    offset_chat_id: 0,
                });

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
