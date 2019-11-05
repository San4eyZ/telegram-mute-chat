const { Client } = require('tdl');

const muteChat = async (client, chat_id) => {
    if (!(client instanceof Client)) {
        throw new Error('Invalid client');
    }

    const result = await client.invoke({
        _: 'setChatNotificationSettings',
        chat_id,
        notification_settings: {
            use_default_mute_for: false,
            mute_for: 60 * 60 * 24 * 365, // for one year
        },
    });

    return result._ === 'ok';
};

const unmuteChat = async (client, chat_id) => {
    if (!(client instanceof Client)) {
        throw new Error('Invalid client');
    }

    const result = await client.invoke({
        _: 'setChatNotificationSettings',
        chat_id,
        notification_settings: {
            use_default_mute_for: true,
            mute_for: 0,
        },
    });

    return result._ === 'ok';
};

module.exports = { muteChat, unmuteChat };
