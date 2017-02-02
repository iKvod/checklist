$(document).ready(function(){

});
var password = makeid();
$("#idinput").submit(function(event) {
    event.preventDefault();

    var url = "https://script.google.com/macros/s/AKfycbxQREGFuszEPn8PRMW-001Z0-6uz2-jYfFdryuqy6SZmGVJbCrL/exec?username="+ $('#id').val() +"&password="+password;
    var posting = $.get( url );

    posting.done(function( data ) {
        $("#idinput").attr("style", "display: none;");
        $("#passinput").attr("style", "display: block;");
        $("#userid").attr("value", data.userid);
        $("#telid").attr("value", data.telid);
        $("#name").attr("value", data.name);
        $("#job").attr("value", data.job);
        $("#time").attr("value", data.time);
        $("#manage").attr("value", data.manage);
        $("#welcome").text("Добро пожаловать, "+data.name);
        $("#idjob").text(data.userid+" | "+data.job);
        console.log(data);
    });
});

$("#passinput").submit(function(event) {
    event.preventDefault();
    if($('#pass').val()==password) {
        $("#passinput").attr("style", "display: none;");
        $("#photoinput").attr("style", "display: block;");
    };
});
$("#insideinput").submit(function(event) {
    event.preventDefault();
    $("#insideinput").attr("style", "display: none;");
    $("#workinput").attr("style", "display: block;");
});

$("#workinput").submit(function(event) {
    event.preventDefault();
    $("#workbtn").attr('disabled','disabled');
    var date = new Date();
    var filename = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + '-' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.jpg';
    $("#workinput").attr("style", "display: none;");
    $("#thanks").attr("style", "display: block;");
    var url3 = "post.php";
    $.post( url3, { mydata: $('#mydata').val(), filename: filename, telid : $('#telid').val(),username : $('#userid').val(), action : $('#time').val(), whatsup : 'У меня все хорошо', inside : '', name : $('#name').val(), job : $('#job').val(), photo : 'https://checklist.automato.me/'+$('#userid').val()+'/'+filename } );
    var urltel = "https://api.telegram.org/bot299510952:AAGw-XK8XOuRfxqu3Gy4LlnMs-vqvRfEYA8/sendmessage?chat_id="+$('#telid').val()+"&text=Спасибо. Вы успешно отметились в системе.";
    $.get(urltel);
    var urlAiganym = "https://api.telegram.org/bot299510952:AAGw-XK8XOuRfxqu3Gy4LlnMs-vqvRfEYA8/sendmessage?chat_id=228106138&text="+$('#name').val()+" написал: "+$('#work').val();
    $.get(urlAiganym);
    var url = "https://script.google.com/macros/s/AKfycbxQREGFuszEPn8PRMW-001Z0-6uz2-jYfFdryuqy6SZmGVJbCrL/exec";
    $.post( url, {username : $('#userid').val(), telid : $('#telid').val(), action : $('#time').val(), whatsup : 'У меня все хорошо', inside : '', name : $('#name').val(), job : $('#job').val(), photo : 'https://checklist.automato.me/'+$('#userid').val()+'/'+filename } );
});

function makeid()
{
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}




// var Telegram = require('../models/Telegram');
//
// var bot = new TelegramBot(token, {
//     polling: {
//         interval: 2000,
//         timeout: 10
//     }
// });
//
// bot.onText(/\/start/, function (msg) {
//     var telegram = new Telegram({
//         telegramId: msg.from.id
//     });
//     telegram.save(function (err, id) {
//         if (err) return err;
//         console.log(id);
//     });
// });
//
// bot.onText(/\/answer (.+): (.+)/, function (msg, match) {
//     console.log(msg);
//     var id = match[1];
//     var resp = match[2];
//     console.log(id, resp);
//
//     Question.findOne({'new_id': id}, function (err, found) {
//         if (err) return err;
//         console.log('found:', found);
//     })
//         .populate('user')
//         .exec(function (err, question) {
//             if (err) return err;
//             console.log(question.user);
//             var answer = new Answer({
//                 text: resp,
//                 question: question._id
//             });
//             answer.save(function (err, answer) {
//                 if (err) return err;
//                 console.log(answer);
//             });
//             var transport = nodemailer.createTransport(sesTransport({
//                 accessKeyId: 'AKIAJY2JK23F4UYWFXBQ',
//                 secretAccessKey: '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',
//                 region: 'us-west-2'
//             }));
//             var bodyEmail = "<h4>Добрый день, " + question.user.name + "</h4>" +
//                 "<p>" + answer.text + "</p>" +
//                 "<p>&#45;&#45;&#45;</p>" +
//                 "<p>С уважением, Automato</p>";
//             transport.sendMail({
//                 from: 'Automato CRM <say@automato.me>',
//                 to: question.user.email,
//                 subject: question.title,
//                 html: bodyEmail
//             }, function (err, info) {
//                 console.log(err, 'error');
//                 console.log(info, 'success');
//             });
//         })
// });