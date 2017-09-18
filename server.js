import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import fs from 'fs';
import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

import RiotAPI from './RiotAPI';
import RiotError from './errors/RiotError';
import riotFetch from './RiotAPI/RiotFetch';
import formatQueries from './RiotAPI/formatQueries';
import HandleExceptions from './errors/HandleExceptions';

import path from 'path';
var appDir = path.dirname(require.main.filename);

//HandleExceptions();

//-------------------------Setup Server-----------------------------
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var port = 8080;
var url = 'http://localhost:' + port + '/';
promise.polyfill();


server.listen(port, function(error) {
    if (error) {
      console.error("Unable to listen on port", port, error);
      listen(port + 1);
    } else{
      console.log("Express server listening on port " + port);
      console.log(url);
    }
    return;
});

//-----------------------Cache LOL-STATIC-DATA------------------//

/*-------------------------Champion Data-----------------------*/
var championDataPath = './cache/lol_static_data_v3/championData.json';
//open file 
var ChampionDataFD = fs.openSync(championDataPath, 'w');

var championDataQuery = {
  tags: ['image', 'skins', 'lore', 'tags', 'info', 'spells', 'passive', 'keys'],
  dataById: false,
}

//crate url to riot api
var championDataUrl = RiotAPI.baseUrl + RiotAPI.apis.staticDatav3.getAllChampions.fetchUrl
              + '?' + formatQueries(championDataQuery) + 'api_key=' + RiotAPI.key;

//fetch the data
riotFetch(championDataUrl, (data) => {
  //write the data to cache
  const content = JSON.stringify(data);

  fs.writeFile(championDataPath, content, 'utf8', (err) => {
    if(err) {
      return console.log(err);
    }

    console.log('All champion Data cached!');
    fs.closeSync(ChampionDataFD);
    console.log('Open champion Data for readOnly');
    fs.openSync(championDataPath, 'r');
  });
});

/*-------------------------Realm Data-----------------------*/
var realmDataPath = './cache/lol_static_data_v3/realmData.json';
//open file 
var realmDataFD = fs.openSync(realmDataPath, 'w');

//crate url to riot api
var realmDataUrl = RiotAPI.baseUrl + RiotAPI.apis.staticDatav3.realms.fetchUrl
              + '?' + 'api_key=' + RiotAPI.key;

riotFetch(realmDataUrl, (data) => {
  //write the data to cache
  const content = JSON.stringify(data);

  fs.writeFile(realmDataPath, content, 'utf8', (err) => {
    if(err) {
      return console.log(err);
    }

    console.log('All realm Data cached!');
    fs.closeSync(realmDataFD);
    console.log('Open realm Data for readOnly');
    fs.openSync(realmDataPath, 'r');
  });
});

//----------------------client requests-------------------------//

app.get('/', (req, res) => {
    res.json({
      greeting: 'Welcome to SoloQuePro!'
    });
});

/*------------------Summoner Data------------------*/

app.get(RiotAPI.apis.summonerv3.getBySummonerName.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getBySummonerName.fetchUrl 
              + req.params.summonerName + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

app.get(RiotAPI.apis.summonerv3.getByAccountId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getByAccountId.fetchUrl 
              + req.params.accountId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

app.get(RiotAPI.apis.summonerv3.getBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getBySummonerId.fetchUrl 
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

/*------------------Champion Data------------------*/
app.get(RiotAPI.apis.championv3.getAllChampions.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championv3.getAllChampions.fetchUrl
              + '?' + formatQueries(req.query) + 'api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

app.get(RiotAPI.apis.championv3.getChampionById.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championv3.getChampionById.fetchUrl
              + req.params.championId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

/*-----------------Champion-Mastery-----------------*/

app.get(RiotAPI.apis.championMasteryv3.getBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getBySummonerId.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

app.get(RiotAPI.apis.championMasteryv3.getBySummonerChampionId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[0]
              + req.params.summonerId + RiotAPI.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[1] 
              + req.params.championId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

app.get(RiotAPI.apis.championMasteryv3.getTotalMasteryScore.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getTotalMasteryScore.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

/*-----------------Summoner Leagues-----------------*/

app.get(RiotAPI.apis.leaguev3.getLeaguesBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.leaguev3.getLeaguesBySummonerId.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});

app.get(RiotAPI.apis.leaguev3.getPositionsBySummonerId.url, (req, res) => {
     var url = RiotAPI.baseUrl + RiotAPI.apis.leaguev3.getPositionsBySummonerId.fetchUrl
              + req.params.summonerId + '?api_key=' + RiotAPI.key;
    riotFetch(url, (data) => res.json(data));
});


/*----------------Static Data-----------------------*/
app.get(RiotAPI.apis.staticDatav3.getAllChampions.url, (req, res) => {
    fs.readFile(championDataPath, 'utf8', function (err, data) {
      if (err){
        res.status(500).json(RiotError(500));
        return;
      }

      var championData = JSON.parse(data);
      res.json(championData);

    });
});

app.get(RiotAPI.apis.staticDatav3.realms.url, (req, res) => {
    fs.readFile(realmDataPath, 'utf8', function (err, data) {
      if (err){
        res.status(500).json(RiotError(500));
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