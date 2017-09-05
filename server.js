import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

import RiotAPI from './RiotAPI';
import RiotError from './errors/RiotError';
import riotFetch from './RiotAPI/RiotFetch';
import HandleExceptions from './errors/HandleExceptions';

//HandleExceptions();

//-------------------------Setup Server-----------------------------
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var port = 8080;
var url = 'http://localhost:' + port + '/';
promise.polyfill();

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', (req, res) => {
    res.json({
      greeting: 'Welcome to SoloQuePro!'
    });
});

/*------------------Summoner Data------------------*/

app.get(RiotAPI.apis.summonerv3.getBySummonerName.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getBySummonerName.fetchUrl 
              + req.params.summonerName + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

app.get(RiotAPI.apis.summonerv3.getByAccountId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getByAccountId.fetchUrl 
              + req.params.accountId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

app.get(RiotAPI.apis.summonerv3.getBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getBySummonerId.fetchUrl 
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

/*------------------Champion Data------------------*/
app.get(RiotAPI.apis.championv3.getAllChampions.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championv3.getAllChampions.fetchUrl
              + '?freeToPlay=' + req.query.freeToPlay + '&api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

app.get(RiotAPI.apis.championv3.getChampionById.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championv3.getChampionById.fetchUrl
              + req.params.championId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

/*-----------------Champion-Mastery-----------------*/

app.get(RiotAPI.apis.championMasteryv3.getBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getBySummonerId.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

app.get(RiotAPI.apis.championMasteryv3.getBySummonerChampionId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[0]
              + req.params.summonerId + RiotAPI.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[1] 
              + req.params.championId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

app.get(RiotAPI.apis.championMasteryv3.getTotalMasteryScore.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getTotalMasteryScore.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

/*-----------------Summoner Leagues-----------------*/

app.get(RiotAPI.apis.leaguev3.getLeaguesBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.leaguev3.getLeaguesBySummonerId.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
});

app.get(RiotAPI.apis.leaguev3.getPositionsBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.leaguev3.getPositionsBySummonerId.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, res);
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