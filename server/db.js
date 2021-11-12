const sqlite3 = require('sqlite3')
const fs = require('fs')

if (!fs.existsSync('db')) {
  fs.mkdirSync('db')
}
module.exports = new sqlite3.Database('db/db.sqlite3')
