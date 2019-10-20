const inquirer = require('inquirer');

const askForString = async ({ message, type = 'input' }) => {
    const name = 'input';

    const answers = await inquirer.prompt([
        {
            type,
            message,
            name,
        },
    ]);

    return answers[name];
};

module.exports = { askForString };
