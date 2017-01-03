const agdq_scraper = require('./agdq-scraper.js');

// console.log(new Date("2017-01-10T16:30:00.000Z").toString());



agdq_scraper.nextGame(function (nextGame) {
  console.log(nextGame);
}, new Date("2017-01-10T16:30:00.000Z"));