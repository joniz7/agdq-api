const cheerio = require('cheerio');
const https = require('https');

const html = '<html><body><ul><li>hest</li><li>ko</li><li>tjur</li></ul></body></html>';


exports.getGames = function(callback) {
  https.get('https://gamesdonequick.com/schedule', function (resp) {
    if(resp.statusCode === 200) {
      var data = "";
      resp.on('data', function(d) {
        data += d;
      });
      resp.on('end', function () {
        callback(createGameList(data));
      });
    }
  });

  function createGameList(html) {
    const $ = cheerio.load(html);

    var allListItems = $('#runTable tbody tr');

    var timeNameRunner = allListItems.first();
    var durationType = timeNameRunner.next();

    var gameList = [createGame(timeNameRunner, durationType)];

    for(var i=0; i<allListItems.length - 2; i += 2) {
      timeNameRunner = durationType.next();
      durationType = timeNameRunner.next();
      gameList.push(createGame(timeNameRunner, durationType));
    }

    return gameList;
  }

  function createGame(first, second) {
    startTime = first.find('td').first();
    title = startTime.next();
    runners = title.next();
    setupTime = runners.next();

    duration = second.find('td').first();
    info = duration.next();

    return {
      title: title.text(),
      startTime: new Date(startTime.text()),
      runners: runners.text(),
      setupTime: timeStringToSeconds(setupTime.text()),
      durationTime: timeStringToSeconds(duration.text().trim()),
      info: info.text()
    };
  }
};

exports.currentIndexAndGames = function (callback, optionalDate) {
  var currentDate = optionalDate || new Date();

  const gameList = this.getGames(function(gameList) {
    var i=0;
    while (gameList[i].startTime < currentDate) {
      i++;
    }
    callback(i-1, gameListe);
  });
};

function timeStringToSeconds(timeString) {
  if(timeString === "") return null;
  var hoursMinutesSeconds = timeString.split(":");

  return parseInt(hoursMinutesSeconds[0]) * 60 * 60 +
          parseInt(hoursMinutesSeconds[1]) * 60 +
          parseInt(hoursMinutesSeconds[2]);
}