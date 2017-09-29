'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appDir = _path2.default.dirname(require.main.filename);

//HandleExceptions();

//SET TRUE FOR TESTING
var testing = false;

//-------------------------Setup Server-----------------------------
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = _socket2.default.listen(server);
var port = 8080;
var testPort = 8081;
var url = 'http://localhost:' + port + '/';
_es6Promise2.default.polyfill();

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/soloqueproDB";
var testUrl = "mongodb://localhost:27017/soloqueproTestDB";

if (testing) {
    port = testPort;
    mongoUrl = testUrl;
}

MongoClient.connect(mongoUrl, function (err, db) {
    db.collection('realms').drop();
    db.collection('champions').drop();

    if (err) throw err;
    var realmsDB = db.collection('realms');
    var championsDB = db.collection('champions');
    (0, _RiotFetch2.default)('https://ddragon.leagueoflegends.com/realms/na.json').then(function (data) {
        realmsDB.insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("Realms data initialized");
        });

        return data;
    }).then(function (realmData) {
        //get champion info
        (0, _RiotFetch2.default)('http://loldata.services.zam.com/v1/champion').then(function (champions) {
            _lodash2.default.forEach(champions, function (championData) {
                var spells = championData.spells,
                    skins = championData.skins,
                    passive = championData.passive,
                    blurb = championData.blurb,
                    lore = championData.lore;
                var n = realmData.n,
                    cdn = realmData.cdn,
                    v = realmData.v;


                var championKey = championData.key == 'Fiddlesticks' ? 'FiddleSticks' : championData.key;

                (0, _RiotFetch2.default)(cdn + '/' + v + '/data/en_US/champion/' + championKey + '.json').then(function (riotData) {
                    //create champion square url 
                    var championSquareUrl = cdn + '/' + n.champion + '/img/champion/' + championData.key + '.png';

                    //create tag image url
                    var tagImageUrl = 'http://universe.leagueoflegends.com/images/role_icon_' + championData.tags[0].toLowerCase() + '.png';

                    //create spells url
                    var newSpells = _lodash2.default.map(spells, function (spell) {
                        var spellUrl = cdn + '/' + n.champion + '/img/spell/' + spell.key + '.png';

                        return _extends({}, spell, { spell_url: spellUrl });
                    });

                    //filter out skins that are just color variations
                    var newSkins = _lodash2.default.filter(skins, function (skin) {
                        return skin.media;
                    });

                    //now create new urls
                    newSkins = _lodash2.default.map(newSkins, function (skin) {
                        var media = {
                            splash_url: cdn + '/img/champion/splash/' + championData.key + '_' + skin.num + '.jpg',
                            loading_url: cdn + '/img/champion/loading/' + championData.key + '_' + skin.num + '.jpg'
                        };

                        return _extends({}, skin, { media: media });
                    });

                    //input passive url
                    var passive = riotData.data[championData.key].passive;
                    var newPassive = {
                        name: passive.name,
                        description: passive.description,
                        url: cdn + '/' + n.champion + '/img/passive/' + passive.image.full

                        //sanatize blurb and lore 

                    };var sanitizedLore = (0, _striptags2.default)(lore, [], '\n').replace(/['"]+/g, '');
                    var sanitizedBlurb = (0, _striptags2.default)(blurb, [], '\n').replace(/['"]+/g, '');

                    var champion = _extends({}, championData, {
                        passive: newPassive,
                        skins: newSkins,
                        spells: newSpells,
                        champion_square_url: championSquareUrl,
                        lore: sanitizedLore,
                        blurb: sanitizedBlurb,
                        tag_image_url: tagImageUrl
                    });

                    championsDB.insertOne(champion, function (err, res) {
                        if (err) throw err;
                        console.log('champion ' + champion.key + ' added to db');
                    });
                });
            });
        });
    });

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

    app.get('/', function (req, res) {
        res.json({
            greeting: 'Welcome to SoloQuePro!'
        });
    });

    app.get(_RiotAPI2.default.apis.staticDatav3.getChampionById.url, function (req, res) {
        var fields = req.query.fields;


        var championFields = fields ? fields.split(',') : {};

        championFields = _lodash2.default.reduce(championFields, function (acc, field) {
            acc[field] = true;
            return acc;
        }, {});

        var championId = parseInt(req.params.championId);
        db.collection('champions').findOne({ champion_id: championId }, championFields, function (err, champion) {
            champion ? res.json(champion) : res.status(500).send('Champion Not Found');
        });
    });

    app.get(_RiotAPI2.default.apis.staticDatav3.getAllChampions.url, function (req, res) {
        var _req$query = req.query,
            fields = _req$query.fields,
            in_rotation = _req$query.in_rotation,
            sort = _req$query.sort;


        var query = in_rotation ? { in_rotation: in_rotation === 'true' } : {};
        var championFields = fields ? fields.split(',') : [];
        var sortFields = sort ? sort.split(',') : [];

        championFields = _lodash2.default.reduce(championFields, function (acc, field) {
            acc[field] = true;
            return acc;
        }, {});

        sortFields = _lodash2.default.reduce(sortFields, function (acc, field) {
            if (field.charAt(0) == '-') {
                field = field.substr(1);
                acc[field] = -1;
            } else {
                acc[field] = 1;
            }
            return acc;
        }, {});

        db.collection('champions').find(query, championFields).sort(sortFields).toArray(function (err, champions) {
            champions ? res.json(champions) : res.status(500).send('Internal Server Error');
        });
    });
});

// //-----------------------Cache LOL-STATIC-DATA------------------//

// /*-------------------------Champion Data-----------------------*/
// var championDataPath = './cache/lol_static_data_v3/championData.json';
// //open file 
// var ChampionDataFD = fs.openSync(championDataPath, 'w');

// var championDataQuery = {
//   tags: ['image', 'skins', 'lore', 'tags', 'info', 'spells', 'passive', 'keys'],
//   dataById: false,
// }

// //crate url to riot api
// var championDataUrl = RiotAPI.baseUrl + RiotAPI.apis.staticDatav3.getAllChampions.fetchUrl
//               + '?' + formatQueries(championDataQuery) + 'api_key=' + RiotAPI.key;

// //fetch the data
// riotFetch(championDataUrl, (data) => {
//   //write the data to cache
//   const content = JSON.stringify(data);

//   fs.writeFile(championDataPath, content, 'utf8', (err) => {
//     if(err) {
//       return console.log(err);
//     }

//     console.log('All champion Data cached!');
//     fs.closeSync(ChampionDataFD);
//     console.log('Open champion Data for readOnly');
//     fs.openSync(championDataPath, 'r');
//   });
// });

// /*-------------------------Realm Data-----------------------*/
// var realmDataPath = './cache/lol_static_data_v3/realmData.json';
// //open file 
// var realmDataFD = fs.openSync(realmDataPath, 'w');

// //crate url to riot api
// var realmDataUrl = RiotAPI.baseUrl + RiotAPI.apis.staticDatav3.realms.fetchUrl
//               + '?' + 'api_key=' + RiotAPI.key;

// riotFetch(realmDataUrl, (data) => {
//   //write the data to cache
//   const content = JSON.stringify(data);

//   fs.writeFile(realmDataPath, content, 'utf8', (err) => {
//     if(err) {
//       return console.log(err);
//     }

//     console.log('All realm Data cached!');
//     fs.closeSync(realmDataFD);
//     console.log('Open realm Data for readOnly');
//     fs.openSync(realmDataPath, 'r');
//   });
// });

// //----------------------client requests-------------------------//

// app.get('/', (req, res) => {
//     res.json({
//       greeting: 'Welcome to SoloQuePro!'
//     });
// });

// /*------------------Summoner Data------------------*/

// app.get(RiotAPI.apis.summonerv3.getBySummonerName.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getBySummonerName.fetchUrl 
//               + req.params.summonerName + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// app.get(RiotAPI.apis.summonerv3.getByAccountId.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getByAccountId.fetchUrl 
//               + req.params.accountId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// app.get(RiotAPI.apis.summonerv3.getBySummonerId.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.summonerv3.getBySummonerId.fetchUrl 
//               + req.params.summonerId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// /*------------------Champion Data------------------*/
// app.get(RiotAPI.apis.championv3.getAllChampions.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.championv3.getAllChampions.fetchUrl
//               + '?' + formatQueries(req.query) + 'api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// app.get(RiotAPI.apis.championv3.getChampionById.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.championv3.getChampionById.fetchUrl
//               + req.params.championId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// /*-----------------Champion-Mastery-----------------*/

// app.get(RiotAPI.apis.championMasteryv3.getBySummonerId.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getBySummonerId.fetchUrl
//               + req.params.summonerId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// app.get(RiotAPI.apis.championMasteryv3.getBySummonerChampionId.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[0]
//               + req.params.summonerId + RiotAPI.apis.championMasteryv3.getBySummonerChampionId.fetchUrl[1] 
//               + req.params.championId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// app.get(RiotAPI.apis.championMasteryv3.getTotalMasteryScore.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.championMasteryv3.getTotalMasteryScore.fetchUrl
//               + req.params.summonerId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// /*-----------------Summoner Leagues-----------------*/

// app.get(RiotAPI.apis.leaguev3.getLeaguesBySummonerId.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.leaguev3.getLeaguesBySummonerId.fetchUrl
//               + req.params.summonerId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });

// app.get(RiotAPI.apis.leaguev3.getPositionsBySummonerId.url, (req, res) => {
//      var url = RiotAPI.baseUrl + RiotAPI.apis.leaguev3.getPositionsBySummonerId.fetchUrl
//               + req.params.summonerId + '?api_key=' + RiotAPI.key;
//     riotFetch(url, (data) => res.json(data));
// });


// /*----------------Static Data-----------------------*/
// app.get(RiotAPI.apis.staticDatav3.getAllChampions.url, (req, res) => {
//     fs.readFile(championDataPath, 'utf8', function (err, data) {
//       if (err){
//         res.status(500).json(RiotError(500));
//         return;
//       }

//       var championData = JSON.parse(data);
//       res.json(championData);

//     });
// });

// app.get(RiotAPI.apis.staticDatav3.realms.url, (req, res) => {
//     fs.readFile(realmDataPath, 'utf8', function (err, data) {
//       if (err){
//         res.status(500).json(RiotError(500));
//         return;
//       }

//       var realmData = JSON.parse(data);
//       res.json(realmData);

//     });
// });


// //Socket.io emits this event when a connection is made.
// io.sockets.on('connection', (socket) => {

//   // Emit a message to send it to the client.
//   socket.emit('ping', { msg: 'Hello. I know socket.io.' });

//   // Print messages from the client.
//   socket.on('pong', (data) => {
//     console.log(data.msg);
//   });

// });