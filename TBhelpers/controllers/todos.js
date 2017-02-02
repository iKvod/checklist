'use strict';

const Telegram = require('telegram-node-bot');

class TodoController extends Telegram.TelegramBaseController {
    addHandler($) {
        let todo = $.message.text.split(' ').slice(1).join(' ');

        if (!todo) return $.sendMessage('Sorry, please pass a todo item.');

        $.getUserSession('todos')
            .then(todos => {
                if (!Array.isArray(todos)) $.setUserSession('todos', [todo]);
                else $.setUserSession('todos', todos.concat([todo]));
                $.sendMessage('Added new todo!');
            });
    }

    getHandler($) {
        $.getUserSession('todos').then(todos => {
            $.sendMessage(this._serializeList(todos), { parse_mode: 'Markdown' });
        });
    }

    checkHandler($) {
        let index = parseInt($.message.text.split(' ').slice(1)[0]);
        if (isNaN(index)) return $.sendMessage('Попробуйте ввести еще раз. Не правильный индекс!');

        $.getUserSession('todos')
            .then(todos => {
                if (index >= todos.length) return $.sendMessage('Попробуйте еще раз');
                todos.splice(index, 1);
                $.setUserSession('todos', todos);
                $.sendMessage('Checked todo!');
            });
    }

    // bookAddHandler($) {
    //     $getUserSession('todos')
    //         .then();
    // }
    //
    // goLunchHandler($){
    //
    // }
    //
    // doneLunchHandler($){
    //
    // }
    //




    get routes() {
        return {
            'addCommand': 'addHandler',
            'getCommand': 'getHandler',
            'checkCommand': 'checkHandler',
            'bookAddCommand': 'bookAddHandler',
            'goLunch':'goLunchHandler',
            'doneLunch':'doneLunchHandler'


        };
    }

    _serializeList(todoList) {
        let serialized = '*Ваши книги:*\n\n';
        todoList.forEach((t, i) => {
            serialized += `*${i}* - ${t}\n`;
        });
        return serialized;
    }
}

module.exports = TodoController;