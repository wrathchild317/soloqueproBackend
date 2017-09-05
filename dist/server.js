'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

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

var _HandleExceptions = require('./errors/HandleExceptions');

var _HandleExceptions2 = _interopRequireDefault(_HandleExceptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//HandleExceptions();

//-------------------------Setup Server-----------------------------
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = _socket2.default.listen(server);
var port = 8080;
var url = 'http://localhost:' + port + '/';
_es6Promise2.default.polyfill();

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
    res.json({
        greeting: 'Welcome to SoloQuePro!'
    });
});

/*------------------Summoner Data------------------*/

app.get(_RiotAPI2.default.apis.summonerv3.getBySummonerName.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.summonerv3.getBySummonerName.fetchUrl + req.params.summonerName + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

app.get(_RiotAPI2.default.apis.summonerv3.getByAccountId.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.summonerv3.getByAccountId.fetchUrl + req.params.accountId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

app.get(_RiotAPI2.default.apis.summonerv3.getBySummonerId.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.summonerv3.getBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

/*------------------Champion Data------------------*/
app.get(_RiotAPI2.default.apis.championv3.getAllChampions.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championv3.getAllChampions.fetchUrl + '?freeToPlay=' + req.query.freeToPlay + '&api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

app.get(_RiotAPI2.default.apis.championv3.getChampionById.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championv3.getChampionById.fetchUrl + req.params.championId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

/*-----------------Champion-Mastery-----------------*/

app.get(_RiotAPI2.default.apis.championMasteryv3.getBySummonerId.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championMasteryv3.getBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

app.get(_RiotAPI2.default.apis.championMasteryv3.getBySummonerChampionId.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[0] + req.params.summonerId + _RiotAPI2.default.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[1] + req.params.championId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

app.get(_RiotAPI2.default.apis.championMasteryv3.getTotalMasteryScore.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.championMasteryv3.getTotalMasteryScore.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

/*-----------------Summoner Leagues-----------------*/

app.get(_RiotAPI2.default.apis.leaguev3.getLeaguesBySummonerId.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.leaguev3.getLeaguesBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
});

app.get(_RiotAPI2.default.apis.leaguev3.getPositionsBySummonerId.url, function (req, res) {
    var url = _RiotAPI2.default.baseUrl + _RiotAPI2.default.apis.leaguev3.getPositionsBySummonerId.fetchUrl + req.params.summonerId + '?api_key=' + _RiotAPI2.default.key;
    (0, _RiotFetch2.default)(url, res);
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