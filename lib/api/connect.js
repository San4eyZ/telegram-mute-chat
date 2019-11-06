/// @ts-check
const { askForString } = require('../utils/inquirer');
const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-ffi');
const path = require('path');

const client = new Client(new TDLib(), {
    apiId: Number(process.env.API_ID),
    apiHash: process.env.API_HASH,
    databaseDirectory: path.join(__dirname, '../../_td_database'),
    filesDirectory: path.join(__dirname, '../../_td_files'),
});

const connect = async () => {
    await client.connectAndLogin(() => ({
        type: 'user',
        getPhoneNumber: async (retry) => {
            return await askForString({ message: 'Phone number: ' });
        },
        getAuthCode: async (retry) => {
            return await askForString({ message: 'Auth code: ' });
        },
        getPassword: async (hint, retry) => {
            return await askForString({ message: `Password (${hint}): `, type: 'password' });
        },
    }));

    client.on('error', console.error);

    return client;
};

module.exports = { connect };
