import FeedParser = require('feedparser');
import request = require('request');
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

const URL = ''; //TBD

interface Article {
  title: string;
  link: string;
  date: Date | null;
}

new Promise((resolve/*, reject*/) => {
  const req = request(URL);
  const feedparser = new FeedParser({});
  const articles: Article[] = [];

  feedparser.on('error', (error: Error) => {
    console.log(error);
  });
  feedparser.on('readable', function(this: FeedParser){
    const stream: FeedParser = this;
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

  req.on('response', function(this: FeedParser, res) {
      if (res.statusCode === 200) {
        this.pipe(feedparser, {});
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
