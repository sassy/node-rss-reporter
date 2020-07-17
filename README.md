# node-rss-reporter

![Node.js CI](https://github.com/sassy/node-rss-reporter/workflows/Node.js%20CI/badge.svg)

RSS/ATOM report used e-mail.

## example usage

```shell
node-rss-reporter --url http://blog.example.com/atom.xml --to user@example.com --host smtp.gmail.com --user user@gmail.com --pass password
```

## options
- `url`  feed(RSS/ATOM) URL.
- `to`   email address for sending.
- `host`  smtp server host name.
- `port`  _optional_ smtp server port. default is 465.
- `from`  _optional_ from email address.
- `user`  _optional_ user name for SMTP Authenticatio
- `pass`  _optional_ password for SMTP Authenticatio