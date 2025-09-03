express = require('express');
require('dotenv/config');
require('discord-interactions');
instanceManager = require('./instanceManager.js');
utils = require('./utils.js')
const { verifyKeyMiddleware, InteractionType, InteractionResponseType } = require('discord-interactions');

const app = express();
const port = 3000;
app.listen(port, () => {
    console.log('Listening on port', port);
});

const instanceCommand = {
    name: 'status',
    description: 'Status command',
    type: 1,
};

const startCommmand = {
    name: 'start',
    description: 'Start command',
    type: 1,
};

const stopCommand = {
    name: 'stop',
    description: 'Stop command',
    type: 1,
};

const rebootCommand = {
    name: 'reboot',
    description: 'Reboot command',
    type: 1,
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

utils.InstallGlobalCommands(process.env.APP_ID, [instanceCommand, startCommmand, stopCommand, rebootCommand]);

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
    const { type, data } = req.body;
    console.log("Interaction reçue");

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        if (name === 'status') {
            try {
                const content = await instanceManager.status();
                if(content == "ACTIVE") {
                    return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: '```json\n' + JSON.stringify(content + " 🟢", null, 2) + '\n```'
                    }
                });
                }
                else {
                    return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: '```json\n' + JSON.stringify(content + " 🔴", null, 2) + '\n```'
                    }
                });
                }
            } catch (err) {
                console.error(err);
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: "Erreur lors de la récupération de l'instance."
                    }
                });
            }
        }
        if (name === 'start') {
            await instanceManager.start();

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Le serveur est ouvert!"
                }
            });
        }
        if (name === 'stop') {
            await instanceManager.stop();

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Fermeture du serveur..."
                }
            });
        }
        if (name === 'reboot') {
            await instanceManager.reboot();
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Relance du serveur..."
                }
            });
        }

        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }

    console.error('unknown interaction type', type);
    return res.status(400).json({ error: 'unknown interaction type' });
});

app.get('/test', async function (req, res) {
    try {
        const status = await instanceManager.status();
        res.send(status);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la récupération du status");
    }
});