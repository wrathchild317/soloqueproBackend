'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _RiotAPI = require('./RiotAPI');

var _RiotAPI2 = _interopRequireDefault(_RiotAPI);

var _RiotError = require('./errors/RiotError');

var _RiotError2 = _interopRequireDefault(_RiotError);

var _RiotFetch = require('./RiotAPI/RiotFetch');

var _RiotFetch2 = _interopRequireDefault(_RiotFetch);

var _formatQueries = require('./RiotAPI/formatQueries');

var _formatQueries2 = _interopRequireDefault(_formatQueries);

var _HandleExceptions = require('./errors/HandleExceptions');

var _HandleExceptions2 = _interopRequireDefault(_HandleExceptions);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appDir = _path2.default.dirname(require.main.filename);

//HandleExceptions();

//-------------------------Setup Server-----------------------------
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = _socket2.default.listen(server);
var port = 8080;
var url = 'http://localhost:' + port + '/';
_es6Promise2.default.polyfill();

server.listen(port, function (error) {
  if (error) {
    console.error("Unable to listen on port", port, error);
    listen(port + 1);
  } else {
    console.log("Express server listening on port " + port);
    console.log(url);
  }
  return;
});

//-----------------------Cache LOL-STATIC-DATA------------------//

/*-------------------------Champion Data-----------------------*/
var championDataPath = './cache/lol_static_data_v3/championData.json';
//open file 
var ChampionDataFD = _fs2.default.openSync(championDataPath, 'w');

var championDataQuery = {
  tags: ['image', 'skins', 'lore', 'tags', 'info', 'spells', 'passive', 'keys'],
  dataById: false

  //crate url to riot api
};var championDataUrl = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.staticDatav3.getAllChampions.fetchUrl + '?' + (0, _formatQueries2.default)(championDataQuery) + 'api_key=' + _RiotAPI2.default.key;

//fetch the data
(0, _RiotFetch2.default)(championDataUrl, function (data) {
  //write the data to cache
  var content = JSON.stringify(data);

  _fs2.default.writeFile(championDataPath, content, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log('All champion Data cached!');
    _fs2.default.closeSync(ChampionDataFD);
    console.log('Open champion Data for readOnly');
    _fs2.default.openSync(championDataPath, 'r');
  });
});

/*-------------------------Realm Data-----------------------*/
var realmDataPath = './cache/lol_static_data_v3/realmData.json';
//open file 
var realmDataFD = _fs2.default.openSync(realmDataPath, 'w');

//crate url to riot api
var realmDataUrl = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.staticDatav3.realms.fetchUrl + '?' + 'api_key=' + _RiotAPI2.default.key;

(0, _RiotFetch2.default)(realmDataUrl, function (data) {
  //write the data to cache
  var content = JSON.stringify(data);

  _fs2.default.writeFile(realmDataPath, content, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log('All realm Data cached!');
    _fs2.default.closeSync(realmDataFD);
    console.log('Open realm Data for readOnly');
    _fs2.default.openSync(realmDataPath, 'r');
  });
});

//----------------------client requests-------------------------//

app.get('/', function (req, res) {
  res.json({
    greeting: 'Welcome to SoloQuePro!'
  });
});

/*------------------Summoner Data------------------*/

app.get(_RiotAPI2.default.apis.summonerv3.getBySummonerName.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.summonerv3.getBySummonerName.fetchUrl + req.params.summonerName + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

app.get(_RiotAPI2.default.apis.summonerv3.getByAccountId.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.summonerv3.getByAccountId.fetchUrl + req.params.accountId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

app.get(_RiotAPI2.default.apis.summonerv3.getBySummonerId.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.summonerv3.getBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

/*------------------Champion Data------------------*/
app.get(_RiotAPI2.default.apis.championv3.getAllChampions.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championv3.getAllChampions.fetchUrl + '?' + (0, _formatQueries2.default)(req.query) + 'api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

app.get(_RiotAPI2.default.apis.championv3.getChampionById.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championv3.getChampionById.fetchUrl + req.params.championId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

/*-----------------Champion-Mastery-----------------*/

app.get(_RiotAPI2.default.apis.championMasteryv3.getBySummonerId.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championMasteryv3.getBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

app.get(_RiotAPI2.default.apis.championMasteryv3.getBySummonerChampionId.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[0] + req.params.summonerId + _RiotAPI2.default.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[1] + req.params.championId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

app.get(_RiotAPI2.default.apis.championMasteryv3.getTotalMasteryScore.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championMasteryv3.getTotalMasteryScore.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

/*-----------------Summoner Leagues-----------------*/

app.get(_RiotAPI2.default.apis.leaguev3.getLeaguesBySummonerId.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.leaguev3.getLeaguesBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

app.get(_RiotAPI2.default.apis.leaguev3.getPositionsBySummonerId.url, function (req, res) {
  var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.leaguev3.getPositionsBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
  (0, _RiotFetch2.default)(url, function (data) {
    return res.json(data);
  });
});

/*----------------Static Data-----------------------*/
app.get(_RiotAPI2.default.apis.staticDatav3.getAllChampions.url, function (req, res) {
  _fs2.default.readFile(championDataPath, 'utf8', function (err, data) {
    if (err) {
      res.status(500).json((0, _RiotError2.default)(500));
      return;
    }

    var championData = JSON.parse(data);
    res.json(championData);
  });
});

app.get(_RiotAPI2.default.apis.staticDatav3.realms.url, function (req, res) {
  _fs2.default.readFile(realmDataPath, 'utf8', function (err, data) {
    if (err) {
      res.status(500).json((0, _RiotError2.default)(500));
      return;
    }

    var realmData = JSON.parse(data);
    res.json(realmData);
  });
});

// //Socket.io emits this event when a connection is made.
// io.sockets.on('connection', (socket) => {

//   // Emit a message to send it to the client.
//   socket.emit('ping', { msg: 'Hello. I know socket.io.' });

//   // Print messages from the client.
//   socket.on('pong', (data) => {
//     console.log(data.msg);
//   });

// });