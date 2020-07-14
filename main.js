"use strict";
exports.__esModule = true;
var FeedParser = require("feedparser");
var request = require("request");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var fs = require("fs");
var URL = ''; //TBD
new Promise(function (resolve /*, reject*/) {
    var req = request(URL);
    var feedparser = new FeedParser({});
    var articles = [];
    feedparser.on('error', function (error) {
        console.log(error);
    });
    feedparser.on('readable', function () {
        var stream = this;
        var item;
        while ((item = stream.read()) !== null) {
            articles.push({
                title: item.title,
                link: item.link,
                date: item.date
            });
        }
        resolve(articles);
    });
    feedparser.on('end', function () {
        resolve(articles);
    });
    req.on('response', function (res) {
        if (res.statusCode === 200) {
            this.pipe(feedparser, {});
        }
    });
}).then(function (articles) {
    var template = fs.readFileSync('template.ejs', 'utf-8');
    var text = ejs.render(template, {
        items: articles
    });
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "",
            pass: "" // TBD
        }
    });
    var mailOptions = {
        from: 'notify@test.com',
        to: '',
        subject: 'RSS Report',
        html: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return;
        }
        console.log(info.respose);
    });
});
