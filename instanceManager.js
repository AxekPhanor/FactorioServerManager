var ovh = require('@ovhcloud/node-ovh')({
    endpoint: 'ovh-eu',
    appKey: 'f0ef7d770e596fa4',
    appSecret: '8a8b877f2bf049eb4fcfca038f29eaf7',
    consumerKey: '5c128bc81f0d51e38ae0eaeaee0a1c5b'
});

async function instance() {
    return new Promise((resolve, reject) => {
        ovh.request('GET', '/cloud/project/8b5103a48edb4a28998cff632f9b9f12/instance', (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

async function status() {
    return new Promise((resolve, reject) => {
        ovh.request('GET', '/cloud/project/8b5103a48edb4a28998cff632f9b9f12/instance', (err, result) => {
            if (err) return reject(err);
            resolve(result[0].status);
        });
    });
}

async function start() {
    await ovh.request('POST', '/cloud/project/8b5103a48edb4a28998cff632f9b9f12/instance/bcdd4963-14ec-43cf-b08c-e9c2759303ee/unshelve', function (err, result ) {
        if(err) {
            console.error(err);
        }
        else {
            console.log("Démarrage du serveur...");
            console.log(result);
        }
    });
}

async function stop() {
    await ovh.request('POST', '/cloud/project/8b5103a48edb4a28998cff632f9b9f12/instance/bcdd4963-14ec-43cf-b08c-e9c2759303ee/shelve', function (err, result ) {
        if(err) {
            console.error(err);
        }
        else {
            console.log("Fermeture du serveur...");
            console.log(result);
        }
    });
}

async function reboot() {
    await ovh.request('POST', '/cloud/project/8b5103a48edb4a28998cff632f9b9f12/instancebcdd4963-14ec-43cf-b08c-e9c2759303ee/reboot', function (err, result ) {
        if(err) {
            console.error(err);
        }
        else {
            console.log("Relance du serveur...");
            console.log(result);
        }
    });
}

module.exports = { instance, status, start, stop, reboot };