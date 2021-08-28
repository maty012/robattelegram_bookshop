/*
user : 
    firstname + lastname ;
    password
    chatid 
    username : ctx.chat.username
    address 
    phone 
    state : 'start' , 'getname' , 'getphone' , 'getaddress' , buyfood

*/
const { Telegraf } = require('Telegraf');
const bot = new Telegraf('1844941451:AAGTriIIuv5tmHr38s2s1f1D3V4g1TnI7yc')
let user_database = [];
let state = {

    start: { text: 'شما در مرحله شروع هستید' },

    getphone: { text: `  شما در مرحله وارد کردن تلفن هستید` },

    getaddress: { text: 'شما در مرحل وارد کردن ادرس هستید' }
}


class Book {
    constructor(name, writer, price, barcode) {
        this.name = name
        this.writer = writer
        this.price = price
        this.barcode = barcode
    }

}
let harypater1 = new Book('harypater1', 'j.k.roling', 300, '7711');
let harypater2 = new Book('harypater2', 'j.k.roling', 600, '7712');
let killbill1 = new Book('killbill1', 'kento', 400, '7713');
let killbill2 = new Book('killbill2', 'kento', 800, '7714');

class Buylist {
    constructor(id, user) {
        this.id = id;
        this.user = user;
        this.books = []
        this.totalprice = 0
        this.discount = 0
        this.isPayed = false
    }
    addBook(book) {
        console.log('book added' + book)
        this.books.push(book)
        this.totalprice += book.price;
    }
    checkout() {
        if (this.isPayed == false) {
            var bool = this.user.minusfrom_wallet(this.totalprice);
            console.log('your mony', this.user.wallet)
            if (bool == true) {
                this.isPayed = true;
                return true
            } else {
                console.log(' your checkuot not sucssefull')
                return false
            }

        }
    }
    maketrue() {
        this.isPayed = true
    }

}

class User {
    wallet = 100;
    constructor(name, chatid = 0, address = '', phone = '') {
        this.name = name
        this.chatid = chatid
        this.address = address
        this.phone = phone
    }
    add2wallet(price) {
        this.wallet += price;
    }
    minusfrom_wallet(price, buylist) {
        console.log('book price', price)
        if (this.wallet > price) {

            this.wallet -= price;
            return true
        } else {
            console.log(' your mony is not enough')
            return false
        }
    }
    print(something) {
        console.log(something)
    }
}
var book = new Book('haripater', 'alireza', 5, '123123213123');
var user1 = new User('alireza');
var user2 = new User('mohamad');
var buylist1 = new Buylist(1, user1);
var buylist2 = new Buylist(2, user2);
//user1.print(buylist1) ; 
buylist1.addBook(book)
buylist2.addBook(book)



try {
    if (buylist1.checkout()) {
        console.log('your checkout done')
    } else {
        console.log('your check out not done')
    }

} catch (err) {
    console.log(err)
    buylist1.user.add2wallet(buylist1.totalprice);

    console.log(' your check out not done  your mony is ', buylist1.user.wallet)
}







//node book.js
bot.use((ctx, next) => {
    for (let i = 0; i < user_database.length; i++) {
        console.log("user database .........", user_database[i]);
        if (ctx.update.message.chat.id == user_database[i].chatid) {
            ctx.indexuser = i;
            ctx.usersingup = true;
        } else {
            ctx.usersingup = false;
        }
    }
    next();
})
bot.start((ctx) => {

    if (!ctx.usersingup) {
        ctx.reply(`
        سلام به رباط سفارش کتاب خوش امدی
        لطفااسمتون رو وارد کنید
        `)
        user_database.push(
            {
                chatid: ctx.update.message.chat.id,
                username: ctx.update.message.chat.username,
                state: 'getname'
            }) - 1;

    }
    else {
        try {
            ctx.reply(`  ${user_database[ctx.indexuser].name}  عزیز ` + state[user_database[ctx.indexuser].state].text)
        }
        catch (err) {
            ctx.reply(`
        سلام به رباط سفارش کتاب خوش امدی
        لطفااسمتون رو وارد کنید
        `)

        }
    }
})
bot.help((ctx) => ctx.reply('hi'))
bot.on('text', (ctx) => {
    if (user_database[ctx.indexuser].state == 'getname') {
        user_database[ctx.indexuser].name = ctx.update.message.text
        user_database[ctx.indexuser].state = 'getphone'
        ctx.reply('enter your phone')
    }
    else if (user_database[ctx.indexuser].state == 'getphone') {

        if (validation_phone(ctx.update.message.text)) {
            user_database[ctx.indexuser].phone = ctx.update.message.text
            ctx.reply("شماره شما ذخیره شد")
            user_database[ctx.indexuser].state = 'getaddress'
            ctx.reply('لطفا address خود را وارد کنید')
        }
        else {
            ctx.reply('شماره شما شتباه است لطفا دوبراه وارد کنید')
        }
    }
    else if (user_database[ctx.indexuser].state == 'getaddress') {
        user_database[ctx.indexuser].address = ctx.update.message.text
        ctx.reply("ادرس شما ذخیر شد ")
        user_database[ctx.indexuser].state = 'getpassword'
        ctx.reply(`لطفا یک پسورد برای خود انتخاب کنید که شمال:
            حد اقل 8 رقم 
            از جمله عدید و حروف بزرگ و کوچک باشد`);

    }

    else if (user_database[indexuser].state == 'getpassword') {

        if (validation_password(ctx.update.message.text)) {
            user_database[indexuser].password = ctx.update.message.text
            ctx.reply("پسورد شما ذخیر شد")
            user_database[indexuser].state = 'buybook'
        }
        else {
            ctx.reply(`پسورد${ctx.update.message.text} اشتباه است لطفا پارامتر های ذکر شده را رعایت کنید`)
        }
    }
    else if (user_database[indexuser].state == 'buybook') {
        watashiwa = "جانر مورد نظر را انتخاب کنید";
        bot.telegram.sendMessage(ctx.chat.id, watashiwa, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "action book",
                        callback_data: 'actionbook'
                    },
                    {
                        text: "thriller book",
                        callback_data: 'thrillerbook'
                    }
                    ],

                ]
            }
        })
        bot.action('actionbook', ctx => {
            bot.telegram.sendMessage(ctx.chat.id, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "harypater1",
                                callback_data: harypater1.name
                            }, {
                                text: "harypater2",
                                callback_data: 'harypater2'
                            }

                        ]
                    ]
                }
            })
        })

        bot.action(harypater1.name, ctx => {
            ctx.reply("اضافه شد به سبد خرید")
            bot.telegram.sendPhoto(ctx.chat.id, {

                source: "/book/download (1).jfif"

            }

            )



        })
        bot.action(harypater2.name, ctx => {
            ctx.reply("اضافه شد به سبد خرید")

            bot.telegram.sendPhoto(ctx.chat.id, {

                source: "/book/download (2).jfif"

            }

            )



        })
        bot.action('thrillerbook', ctx => {
            bot.telegram.sendMessage(ctx.chat.id, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "kill bill 1",
                                callback_data: 'killbill1'
                            }, {

                                text: "kill bill 2",
                                callback_data: 'killbill2'

                            }

                        ]
                    ]
                }




            })
            bot.action(killbill1.name, ctx => {
                ctx.reply("اضافه شد به سبد خرید")
                bot.telegram.sendPhoto(ctx.chat.id, {

                    source: "/book/download (3).jfif"
                 }
                )
            })
            bot.action(killbill2.name, ctx => {
                ctx.reply("اضافه شد به سبد خرید")
                bot.telegram.sendPhoto(ctx.chat.id, {
                    source: "/book/images (1).jfif"
                }
                )
            })
        })

    }
    else {
        ctx.reply('شما هنوز /start را نزده اید');
    }
})
bot.hears('ho', (ctx) => ctx.reply(`https://elements.ppt.ir/product/%d9%82%d8%a7%d9%84%d8%a8-%d9%be%d8%b2%d8%b4%da%a9%db%8c-%d9%88-%d8%b3%d9%84%d8%a7%d9%85%d8%aa-medicalguide/`))
function validation_phone(phone) {
    if (phone.length == 11) {
        return true
    } else {
        return false
    }
}
function validation_password(password) {
    if (password.length >= 8 && !(password == password.Tolowerscase && password == password.Touppercase)) { return true }
    else {
        return false
    }
}
bot.launch()
//node book.js
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))