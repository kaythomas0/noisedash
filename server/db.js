const sqlite3 = require('sqlite3')
const fs = require('fs')
const path = require('path')

if (!fs.existsSync(path.join(__dirname, '../db'))) {
  fs.mkdirSync(path.join(__dirname, '../db'))
}
module.exports = new sqlite3.Database('db/db.sqlite3')
