'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _configs = require('./configs');

var _configs2 = _interopRequireDefault(_configs);

var _v1Routes = require('./v1Routes');

var _v1Routes2 = _interopRequireDefault(_v1Routes);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//SET TRUE FOR TESTING
var testing = false;

//-------------------------Setup Server-----------------------------
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var io = _socket2.default.listen(server);
var port = process.env.PORT || 3000;
var chosenPort = 8080;
// var testPort = 8081;
var url = 'http://localhost:' + port + '/';
_es6Promise2.default.polyfill();

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = _paths2.default.mongoUrl;
// var testUrl = "mongodb://localhost:27017/soloqueproTestDB";

if (testing) {
    port = testPort;
    mongoUrl = testUrl;
}

app.use(_bodyParser2.default.urlencoded({
    extended: true
}));

app.use(_bodyParser2.default.json());

app.use('/soloquepro/v1', _v1Routes2.default);

app.listen(chosenPort, function () {
    console.log('Server listening on port ' + chosenPort + '!');
});

/* --------------------- HAS BEEN MOVED TO STATICDATAROUTE ----------------- */

// MongoClient.connect(mongoUrl, (err, db) => {

//     app.get(RiotAPI.apis.staticDatav3.getChampionById.url, (req, res) => {
//         const { fields } = req.query;

//         var championFields = (fields) ? fields.split(',') : {};

//         championFields = _.reduce(championFields, (acc, field) => {
//             acc[field] = true;
//             return acc;
//         }, {});

//         var championId = parseInt(req.params.championId);

//         db.collection('champions').findOne({champion_id: championId,}, championFields, (err, champion) => {
//             if (err) throw err;
//             (champion) ? res.json(champion) :  res.status(500).send('Champion Not Found');
//         });

//     });

//     app.get(RiotAPI.apis.staticDatav3.getAllChampions.url, (req, res) => {
//         const { fields, in_rotation, sort } = req.query;


//         var query = (in_rotation) ? {in_rotation: in_rotation === 'true'} : {};
//         var championFields = (fields) ? fields.split(',') : [];
//         var sortFields = (sort) ? sort.split(',') : [];

//         championFields = _.reduce(championFields, (acc, field) => {
//             acc[field] = true;
//             return acc;
//         }, {});

//         sortFields = _.reduce(sortFields, (acc, field) => {
//             if(field.charAt(0) == '-') {
//                 field = field.substr(1);
//                 acc[field] = -1;
//             } else {
//                 acc[field] = 1;
//             }
//             return acc;
//         }, {});

//         db.collection('champions').find(query, championFields). sort(sortFields)
//             .toArray((err, champions) => {
//                 if (err) throw err;
//                 (champions) ? res.json(champions) :  res.status(500).send('Internal Server Error');
//             });

//     });

//     app.get(RiotAPI.apis.staticDatav3.getAllItems.url, (req, res) => {
//         const { fields, sort, map } = req.query;

//         var itemFields = (fields) ? fields.split(',') : [];
//         var sortFields = (sort) ? sort.split(',') : [];
//         var mapQuery = {};

//         (map) ? mapQuery['maps.' + map] = true : null;

//         itemFields = _.reduce(itemFields, (acc, field) => {
//             acc[field] = true;
//             return acc;
//         }, {});

//         sortFields = _.reduce(sortFields, (acc, field) => {
//             if(field.charAt(0) == '-') {
//                 field = field.substr(1);
//                 acc[field] = -1;
//             } else {
//                 acc[field] = 1;
//             }
//             return acc;
//         }, {});

//         db.collection('items').find(mapQuery, itemFields).sort(sortFields)
//             .toArray((err, items) => {
//                 if (err) throw err;
//                 (items) ? res.json(items) :  res.status(500).send('Internal Server Error');
//             });

//     });

//     app.get(RiotAPI.apis.staticDatav3.getItemById.url, (req, res) => {
//         const { fields } = req.query;

//         var itemFields = (fields) ? fields.split(',') : [];

//         itemFields = _.reduce(itemFields, (acc, field) => {
//             acc[field] = true;
//             return acc;
//         }, {});


//         var itemId = parseInt(req.params.itemId);
//         db.collection('items').findOne({item_id: itemId,}, itemFields, (err, item) => {
//             if (err) throw err;
//             (item) ? res.json(item) :  res.status(500).send('Item Not Found');
//         });

//     });

//     app.get(RiotAPI.apis.staticDatav3.getAllMaps.url, (req, res) => {
//         const { fields, sort, map } = req.query;

//         var mapFields = (fields) ? fields.split(',') : [];
//         var sortFields = (sort) ? sort.split(',') : [];

//         mapFields = _.reduce(mapFields, (acc, field) => {
//             acc[field] = true;
//             return acc;
//         }, {});

//         sortFields = _.reduce(sortFields, (acc, field) => {
//             if(field.charAt(0) == '-') {
//                 field = field.substr(1);
//                 acc[field] = -1;
//             } else {
//                 acc[field] = 1;
//             }
//             return acc;
//         }, {});

//         db.collection('maps').find({}, mapFields).sort(sortFields)
//             .toArray((err, maps) => {
//                 if (err) throw err;
//                 (maps) ? res.json(maps) :  res.status(500).send('Internal Server Error');
//             });

//     });

//     app.get(RiotAPI.apis.staticDatav3.getMapById.url, (req, res) => {
//         const { fields } = req.query;

//         var mapFields = (fields) ? fields.split(',') : [];

//         mapFields = _.reduce(mapFields, (acc, field) => {
//             acc[field] = true;
//             return acc;
//         }, {});


//         var mapId = req.params.mapId;
//         db.collection('maps').findOne({MapId: mapId,}, mapFields, (err, map) => {
//             if (err) throw err;
//             (map) ? res.json(map) :  res.status(500).send('Map Not Found');
//         });

//     });
// });

/* --------------------- HAS BEEN MOVED TO STATICDATAROUTE ----------------- */

MongoClient.connect(mongoUrl, function (err, db) {

    if (err) throw err;
    var realmsDB = db.collection('realms');
    realmsDB.drop();
    var championsDB = db.collection('champions');
    var itemsDB = db.collection('items');
    var mapsDB = db.collection('maps');

    (0, _RiotFetch2.default)('https://ddragon.leagueoflegends.com/realms/na.json').then(function (data) {
        return data;
    }).then(function (realmData) {
        //get champion info
        var n = realmData.n,
            cdn = realmData.cdn,
            v = realmData.v;

        var mapUrl = cdn + '/' + n.map + '/data/en_US/map.json';
        (0, _RiotFetch2.default)('http://loldata.services.zam.com/v1/champion').then(function (champions) {
            _lodash2.default.forEach(champions, function (championData) {
                var spells = championData.spells,
                    skins = championData.skins,
                    passive = championData.passive,
                    blurb = championData.blurb,
                    lore = championData.lore;


                var championKey = championData.key == 'Fiddlesticks' ? 'FiddleSticks' : championData.key;
                (0, _RiotFetch2.default)('https://universe-meeps.leagueoflegends.com/v1/en_us/champions/' + championKey.toLowerCase() + '/index.json').then(function (universeData) {
                    var _universeData$champio = universeData.champion,
                        release_date = _universeData$champio['release-date'],
                        video = _universeData$champio.video;

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
                            tag_image_url: tagImageUrl,
                            release_date: release_date,
                            video: video
                        });

                        championsDB.find({ champion_id: champion.champion_id }).toArray(function (err, championExists) {
                            if (err) throw err;
                            if (championExists.length > 0) {
                                //champion is already in database so update
                                championsDB.update({ champion_id: champion.champion_id }, _extends({}, champion));
                                console.log('champion ' + champion.key + ' updated');
                            } else {
                                championsDB.insertOne(champion, function (err, res) {
                                    if (err) throw err;
                                    console.log('champion ' + champion.key + ' added to db');
                                });
                            }
                        });
                    });
                });
            });
        });
        (0, _RiotFetch2.default)('http://ddragon.leagueoflegends.com/cdn/' + n.item + '/data/en_US/item.json').then(function (itemsList) {
            var trueItems = itemsList.data;


            (0, _RiotFetch2.default)('http://loldata.services.zam.com/v1/item').then(function (items) {
                _lodash2.default.forEach(items, function (itemData) {
                    var itemSquareUrl = cdn + '/' + n.item + '/img/item/' + itemData.item_id + '.png';

                    var item = _extends({}, itemData, {
                        item_square_url: itemSquareUrl
                    });

                    itemsDB.find({ item_id: item.item_id }).toArray(function (err, itemExists) {
                        if (err) throw err;

                        if (itemExists.length > 0) {
                            //champion is already in database so update
                            if (_lodash2.default.has(trueItems, item.item_id)) {
                                itemsDB.update({ item_id: item.item_id }, _extends({}, item));
                                console.log('Item ' + item.name + ' updated');
                            } else {
                                itemsDB.deleteOne({ item_id: item.item_id });
                                console.log('Item ' + item.name + ' deleted');
                            }
                        } else {
                            if (item.name && _lodash2.default.has(trueItems, item.item_id)) {
                                itemsDB.insertOne(item, function (err, res) {
                                    if (err) throw err;
                                    console.log('Item ' + item.name + ' added to db');
                                });
                            }
                        }
                    });
                });
            });
        });

        (0, _RiotFetch2.default)(mapUrl).then(function (_ref) {
            var maps = _ref.data;

            _lodash2.default.forEach(maps, function (mapData) {
                var MapId = mapData.MapId;


                var imgUrl = _configs2.default.map_media[MapId];

                var map = _extends({}, mapData, {
                    img_url: imgUrl
                });

                mapsDB.find({ MapId: MapId }).toArray(function (err, mapExists) {
                    if (err) throw err;

                    if (mapExists.length > 0) {
                        //champion is already in database so update
                        mapsDB.update({ MapId: MapId }, _extends({}, map));
                        console.log('Map ' + map.MapName + ' updated');
                    } else {
                        mapsDB.insertOne(map, function (err, res) {
                            if (err) throw err;
                            console.log('Map ' + map.MapName + ' added to db');
                        });
                    }
                });
            });
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