import FeedParser = require('feedparser');
import request = require('request');
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import { exit } from 'process';
import SMTPTransport = require('nodemailer/lib/smtp-transport');


interface Article {
  title: string;
  link: string;
  date: Date | null;
}

const argv = require('minimist')(process.argv.slice(2));
if (argv.url === undefined) {
  console.log('must --url option.');
  exit();
}
if (argv.to === undefined) {
  console.log('must --to option.');
  exit();
}
if (argv.host === undefined) {
  console.log('must --host option.');
  exit();
}
const URL = argv.url;
const to = argv.to;
const host = argv.host;

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
    const transporterOptions: SMTPTransport.Options = {
      host: host,
      port: argv.port || 465,
      secure: true,
    };
    if (argv.user && argv.pass) {
      transporterOptions.auth = {
        user: argv.user,
        pass: argv.pass
      }
    };
    const transporter = nodemailer.createTransport(transporterOptions);
    const mailOptions = {
      from: 'noreply@test.com',
      to: to,
      subject: 'RSS Report',
      html: text
    };
    transporter.sendMail(mailOptions, (error, info) =>  {
      if (error) {
        console.log(error);
        return;
      }
      console.log(info);
    });
});
