'use strict';

/*
* user: admin pwd: Automatodev for root (can allowed droping db)
* user: rafa for admin Not allowed droping db
* user: rafa for checklist
* */

/*
* conf to a server
* Droplet Name: Automato-inside
* Automatodev
* root
* 188.166.182.2
* */

/*
* Info for bot
* id: 324830524,
* first_name: 'checklist',
* username: 'automatoChecklist_bot' },
* */


var config = {
    token: '324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE',
    botName: 'automatoChecklist_bot',
    mongoUrl: 'mongodb://localhost:27017/checklist',
    opt: {
        user: 'rafa',
        pass: 'Automatodev',
        auth: { authdb: "checklist"}
    }
};

module.exports =  config;