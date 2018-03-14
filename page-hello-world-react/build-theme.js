const fs = require('fs');
const cheerio = require('cheerio');
let index = process.argv[2];
let theme= process.argv[3];

if(!index){
  index = './build/index.html';
}
if(!theme){
  theme = '../theme/theme.css';
}

const $ = cheerio.load(fs.readFileSync(index));

$('head').append('<link rel="stylesheet" href='+ theme +'>');
fs.writeFileSync(index,$.html(), {'encoding': 'utf-8'});