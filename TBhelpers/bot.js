'use strict';

var https = require('https');
var secret = require('../config');


function generateCode (){
    var code = [];

    var index = Math.floor(Math.random() * (9 - 8) + 8);
    console.log(index);
    for(var i = 0; i < index; ++i){
        var number = Math.floor(Math.random() * (9000 - 1000) + 1000);
        code[i] = number;
        //console.log(code[i] = number);
    }

    return code;
}

// it or int(intern) year(Ex. 15 16 17)
function generateId(options){
    var department = ['IT', 'MM', 'INT'];
    var year = ['14', '15', '16'];
    var currentYear = new Date();
    var counter = Math.floor(Math.random() * (100 - 9) + 100);






    // for (var i = 0; i < )
    //  var it =  options.department === department[0]
    //  if(){
    //
    //  }
}

function time() {
    var date = new Date();
    console.log(date.getFullYear());
    console.log(date.toLocaleDateString());
}
//time();


function stringSeparator(sep, string) {
    var strData = string.split(sep);
    return strData[0];
   // console.log(strData[0]);
}
var Employees = require('../models/employees');

function generateId(count){
    var date = new Date();
    var year = date.getFullYear().toString().substr(2);
    var dep = 'IT';
    var newId = year + dep + count;

    console.log("dsds");
}


function getEmployyesCount (callback){
    var count = 0;

    Employees.findOne({})
        .select({ number:1 })
        .exec(function (err, employee) {
            if(err) {console.log(err); return}
            count = employee.number;
            callback(count);
        });
}

//getEmployyesCount(generateId);

var date = new Date();

// console.log(date.getDate());
// console.log(date.getHours());
// console.log(date.getDay());
// console.log(date.getFullYear());




// var time1 = date.getTime();
// console.log(time1);
//
// var time2 = date.getUTCHours();
// console.log(time2 + 6)
//
// var time3 = date.toLocaleString();
// console.log(time3);

setTimeout(function () {
    var date2 = new Date();
    // console.log(date);
    // console.log(date2);
    date2.setFullYear(2016, 12, 22);
    if(date < date2){
        console.log('date > date2');
    } else  {
        //console.log('date2 > date');
        // console.log(date2.getDate());
        // console.log(date2.getDay());
        console.log(date.getMonth());

    }
    // var interval = date2 - date;
    // console.log(date);

}, 2000);


//// testing null variable
// var a = null;
// var b = null;
// if(!(a && b)){
//     console.log('NOT NULL')
// } else {
//     console.log(a)
// }



//console.log(generateCode());
//generateCode();

// /*
//     customizable request to api.telegram
//
//     config = {token: <token>, method: <method>}
//
// */
//
// var requestHelper = (config, callback) => {
//     var data = '';
//     var config = config;
//     //var data = '';
//
//     var options = {
//         host:'www.api.telegram.org',
//         hostname: 'api.telegram.org',
//         port:443,
//         path:'/bot' + config.token + '/' + config.method,
//         method: config.methodType,
//         headers: {
//                     'Content-Type':'application/x-www-form-urlencoded',
//                     'Transfer-Encoding' : 'chunked'
//                     /*'Content-Length': Buffer.byteLength(data)*/
//         }
//     };
//
//     var req = https.request(options, (res) => {
//         res.on('data', (d) => {
//             data += d;
//         })
//
//         res.on('end', () => {
//             //console.log('adasdasd');
//             callback(data);
//             //return 'data';
//         })
//     });
//
//     req.on('error', (e) => {
//         console.error(e);
//     });
//
//     if(config.data != null || config.data != 'undefined'){
//         req.write(config.data, function(err){
//             if(err){
//                 console.log('ERROR accured when streaming data to send ' + err);
//             }
//         });
//     }
//
//     req.end();
//
// }
//
//
// var obj = {};
//
//
// function getUpdates(config, callback){
//    requestHelper(config, callback);
// }
//
// /*function sendPhoto(){
//
// }*/
//
// function sendMessage(config, callback){
//     requestHelper(config, callback);
// }
//
//
//
//
// var config  = {
//     token: secret.token,
//     method: 'getUpdates',
//     methodType:"GET"
// }
//
// var configMessage  = {
//     token: secret.token,
//     method: 'sendmessage',
//     methodType:"POST",
//     data: {
//
//     }
// }
//
//
// var addUser = function(config, callback){
//     requestHelper(confug, callback);
// }
//
// getUpdates(config, function(data){
//         obj = JSON.parse(data);
//         for (var i = 0, len = obj.result.length; i < len; i++) {
//             // console.log(date.toDateString(obj.result[i].message.date));
//             // console.log(date.toLocaleDateString(obj.result[i].message.date));
//             // console.log(date.toGMTString(obj.result[i].message.date));
//             //console.log(date.toGMTString());
//             //console.log((obj.result[i].message.date).toString());
//              // console.log(date.toUTCString(obj.result[i].message.date));
//
//              // //CURRENT LOCAL TIME ZONE
//
//              // console.log(date.toLocaleDateString();
//              // console.log(date.toLocaleTimeString(obj.result[i].message.date));
//              // console.log(date.toLocaleString(obj.result[i].message.date));
//
//              //converts to LOCAL DATE
//              //console.log(date.toString());
//         }
// });
//
//
//
//
// module.exports = {};