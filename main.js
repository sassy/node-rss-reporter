'use strict';

const FeedParser = require('feedparser'),
  request = require('request'),
  ejs = require('ejs'),
  fs = require('fs'),
  nodemailer = require('nodemailer');

const URL = ''; //TBD


new Promise((resolve/*, reject*/) => {
  const req = request(URL);
  const feedparser = new FeedParser();
  const articles = [];

  feedparser.on('error', function(error) {
    console.log(error);
  });
  feedparser.on('readable', function(){
    const stream = this;
    let item;

    while ((item = stream.read()) !== null) {
      articles.push({
        title: item.title,
        link: item.link,
        date: item.date
      });
    }
    resolve(articles);
  });
  feedparser.on('end', function() {
    resolve(articles);
  });

  req.on('response', function(res) {
      if (res.statusCode === 200) {
        this.pipe(feedparser);
      }
  });

}).then((articles) => {
    const template = fs.readFileSync('template.ejs', 'utf-8');
    const text = ejs.render(template, {
      items: articles
    });
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: "", // TBD
          pass: "" // TBD
      }
    });
    const mailOptions = {
      from: 'notify@test.com',
      to: '', //TBD
      subject: 'RSS Report',
      html: text
    };
    transporter.sendMail(mailOptions, (error, info) =>  {
      if (error) {
        console.log(error);
        return;
      }
      console.log(info.respose);
    });
});
