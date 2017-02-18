'use strict';

var config = {
    token: '324830524:AAF_QWatxxdsHbxrC2cB82jxKj8tZmd6wWE', // production token for telegram bot api
    //  token: '308572160:AAG4WW0OA9qdLK1bakj7-edMxS-P1vriedY', //test token for telegram bot
    botName: 'automatoChecklist_bot',
    mongoUrl: 'mongodb://127.0.0.1:27017/checklist',
    opt: {
        user: 'rafa',
        pass: 'Automatodev',
        auth: { authdb: "checklist"}
    },
    ceoBotID : 78923920,
    managerBotID : 228106138,
    // ceoBotID:207925830,     //for testing
    // managerBotID:207925830 // for testing
    pip:"10.15.0.9"
};

module.exports =  config;
