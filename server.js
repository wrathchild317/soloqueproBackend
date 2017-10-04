import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

import RiotAPI from './RiotAPI';
import RiotError from './errors/RiotError';
import riotFetch from './RiotAPI/RiotFetch';
import formatQueries from './RiotAPI/formatQueries';

import _ from 'lodash';
import striptags from 'striptags';
import configs from './configs';



//SET TRUE FOR TESTING
var testing = false;

//-------------------------Setup Server-----------------------------
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);
var port = process.env.PORT || 3000;
var testPort = 8081;
var url = 'http://localhost:' + port + '/';
promise.polyfill();




var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://heroku_vxl19zxq:ea20n6rfisqse45k3nqf7hpu56@ds157624.mlab.com:57624/heroku_vxl19zxq";
var testUrl = "mongodb://localhost:27017/soloqueproTestDB";

if (testing) {
    port = testPort;
    mongoUrl = testUrl;
}


MongoClient.connect(mongoUrl, (err, db) => {
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

    app.get('/', (req, res) => {
        res.json({
          greeting: 'Welcome to SoloQuePro!'
        });
    });


    app.get(RiotAPI.apis.staticDatav3.getChampionById.url, (req, res) => {
        const { fields } = req.query;

        var championFields = (fields) ? fields.split(',') : {};

        championFields = _.reduce(championFields, (acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

        var championId = parseInt(req.params.championId);

        db.collection('champions').findOne({champion_id: championId,}, championFields, (err, champion) => {
            if (err) throw err;
            (champion) ? res.json(champion) :  res.status(500).send('Champion Not Found');
        });

    });

    app.get(RiotAPI.apis.staticDatav3.getAllChampions.url, (req, res) => {
        const { fields, in_rotation, sort } = req.query;


        var query = (in_rotation) ? {in_rotation: in_rotation === 'true'} : {};
        var championFields = (fields) ? fields.split(',') : [];
        var sortFields = (sort) ? sort.split(',') : [];

        championFields = _.reduce(championFields, (acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

        sortFields = _.reduce(sortFields, (acc, field) => {
            if(field.charAt(0) == '-') {
                field = field.substr(1);
                acc[field] = -1;
            } else {
                acc[field] = 1;
            }
            return acc;
        }, {});

        db.collection('champions').find(query, championFields). sort(sortFields)
            .toArray((err, champions) => {
                if (err) throw err;
                (champions) ? res.json(champions) :  res.status(500).send('Internal Server Error');
            });

    });

    app.get(RiotAPI.apis.staticDatav3.getAllItems.url, (req, res) => {
        const { fields, sort, map } = req.query;

        var itemFields = (fields) ? fields.split(',') : [];
        var sortFields = (sort) ? sort.split(',') : [];
        var mapQuery = {};

        (map) ? mapQuery['maps.' + map] = true : null;

        itemFields = _.reduce(itemFields, (acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

        sortFields = _.reduce(sortFields, (acc, field) => {
            if(field.charAt(0) == '-') {
                field = field.substr(1);
                acc[field] = -1;
            } else {
                acc[field] = 1;
            }
            return acc;
        }, {});

        db.collection('items').find(mapQuery, itemFields).sort(sortFields)
            .toArray((err, items) => {
                if (err) throw err;
                (items) ? res.json(items) :  res.status(500).send('Internal Server Error');
            });

    });

    app.get(RiotAPI.apis.staticDatav3.getItemById.url, (req, res) => {
        const { fields } = req.query;

        var itemFields = (fields) ? fields.split(',') : [];

        itemFields = _.reduce(itemFields, (acc, field) => {
            acc[field] = true;
            return acc;
        }, {});


        var itemId = parseInt(req.params.itemId);
        db.collection('items').findOne({item_id: itemId,}, itemFields, (err, item) => {
            if (err) throw err;
            (item) ? res.json(item) :  res.status(500).send('Item Not Found');
        });

    });

    app.get(RiotAPI.apis.staticDatav3.getAllMaps.url, (req, res) => {
        const { fields, sort, map } = req.query;

        var mapFields = (fields) ? fields.split(',') : [];
        var sortFields = (sort) ? sort.split(',') : [];

        mapFields = _.reduce(mapFields, (acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

        sortFields = _.reduce(sortFields, (acc, field) => {
            if(field.charAt(0) == '-') {
                field = field.substr(1);
                acc[field] = -1;
            } else {
                acc[field] = 1;
            }
            return acc;
        }, {});

        db.collection('maps').find({}, mapFields).sort(sortFields)
            .toArray((err, maps) => {
                if (err) throw err;
                (maps) ? res.json(maps) :  res.status(500).send('Internal Server Error');
            });

    });

    app.get(RiotAPI.apis.staticDatav3.getMapById.url, (req, res) => {
        const { fields } = req.query;

        var mapFields = (fields) ? fields.split(',') : [];

        mapFields = _.reduce(mapFields, (acc, field) => {
            acc[field] = true;
            return acc;
        }, {});


        var mapId = req.params.mapId;
        db.collection('maps').findOne({MapId: mapId,}, mapFields, (err, map) => {
            if (err) throw err;
            (map) ? res.json(map) :  res.status(500).send('Map Not Found');
        });

    });
});


MongoClient.connect(mongoUrl, (err, db) => {

    if (err) throw err;
    var realmsDB = db.collection('realms');
    var championsDB = db.collection('champions');
    var itemsDB = db.collection('items');
    var mapsDB = db.collection('maps');

    riotFetch('https://ddragon.leagueoflegends.com/realms/na.json')
        .then((data) => {
            realmsDB.insertOne(data, (err, res) => {
                if (err) throw err;
                console.log("Realms data initialized");
            });

            return data;
        })
        .then((realmData) => {
            //get champion info
            const { n, cdn, v } = realmData
            const mapUrl = cdn + '/' + n.map + '/data/en_US/map.json'; 
            riotFetch('http://loldata.services.zam.com/v1/champion')
                .then((champions) => {
                    _.forEach(champions, (championData) => {
                        const { spells, skins, passive, blurb, lore } = championData;

                        var championKey = (championData.key == 'Fiddlesticks') ? 'FiddleSticks' : championData.key;

                        riotFetch(cdn + '/' + v + '/data/en_US/champion/' + championKey + '.json')
                            .then((riotData) => {
                                //create champion square url 
                                var championSquareUrl = cdn + '/' + n.champion + '/img/champion/' 
                                    + championData.key + '.png';

                                //create tag image url
                                var tagImageUrl = 'http://universe.leagueoflegends.com/images/role_icon_' 
                                    + championData.tags[0].toLowerCase() + '.png'; 

                                //create spells url
                                var newSpells = _.map(spells, (spell) => {
                                    var spellUrl = cdn + '/' + n.champion + '/img/spell/'
                                        + spell.key + '.png';

                                    return {...spell, spell_url: spellUrl }
                                });

                                //filter out skins that are just color variations
                                var newSkins = _.filter(skins, (skin) => {
                                    return skin.media;
                                });

                                //now create new urls
                                newSkins = _.map(newSkins, (skin) => {
                                    var media = {
                                        splash_url: cdn + '/img/champion/splash/' 
                                            + championData.key + '_' + skin.num  + '.jpg',
                                        loading_url: cdn + '/img/champion/loading/' 
                                            + championData.key + '_' + skin.num  + '.jpg'
                                    }

                                    return {...skin, media: media}
                                });



                                //input passive url
                                var passive = riotData.data[championData.key].passive;
                                var newPassive = {
                                    name: passive.name,
                                    description: passive.description,
                                    url: cdn + '/' + n.champion + '/img/passive/' + passive.image.full,
                                }

                                //sanatize blurb and lore 

                                var sanitizedLore = striptags(lore, [], '\n').replace(/['"]+/g, '');
                                var sanitizedBlurb = striptags(blurb, [], '\n').replace(/['"]+/g, '');

                                var champion = {
                                    ...championData,
                                    passive: newPassive,
                                    skins: newSkins,
                                    spells: newSpells,
                                    champion_square_url: championSquareUrl,
                                    lore: sanitizedLore,
                                    blurb: sanitizedBlurb,
                                    tag_image_url: tagImageUrl,
                                }

                                championsDB.find({champion_id: champion.champion_id})
                                    .toArray((err, championExists) => {
                                        if (err) throw err;
                                        if(championExists.length > 0){
                                            //champion is already in database so update
                                            championsDB.update({champion_id: champion.champion_id}, {...champion});
                                            console.log('champion ' + champion.key + ' updated');

                                        } else {
                                            championsDB.insertOne(champion, (err, res) => {
                                                if (err) throw err;
                                                console.log('champion ' + champion.key + ' added to db');
                                            });
                                        }
                                    });
                            });

                    });
                });
                riotFetch('http://loldata.services.zam.com/v1/item')
                .then((items) => {
                    _.forEach(items, (itemData) => {
                        var itemSquareUrl = cdn + '/' + n.item + '/img/item/' 
                                + itemData.item_id + '.png';
                        
                        var item = {
                            ...itemData,
                            item_square_url: itemSquareUrl,
                        };

                        itemsDB.find({item_id: item.item_id}).toArray((err, itemExists) => {
                                if (err) throw err;

                                if(itemExists.length > 0){
                                //champion is already in database so update
                                    itemsDB.update({item_id: item.item_id}, {...item});
                                    console.log('Item ' + item.name + ' updated');
                                } else {
                                    if(item.name) {
                                        itemsDB.insertOne(item, (err, res) => {
                                            if (err) throw err;
                                            console.log('Item ' + item.name + ' added to db');
                                        });
                                    }
                                }
                        });
                    });
                });
                riotFetch(mapUrl)
                    .then(({data: maps}) => {
                        _.forEach(maps, (mapData) => {
                            const { MapId } = mapData;

                            var imgUrl = configs.map_media[MapId];

                            var map = {
                                ...mapData,
                                img_url: imgUrl,
                            }

                            mapsDB.find({MapId: MapId}).toArray((err, mapExists) => {
                                if (err) throw err;

                                if(mapExists.length > 0){
                                //champion is already in database so update
                                    mapsDB.update({MapId: MapId}, {...map});
                                    console.log('Map ' + map.MapName + ' updated');
                                } else {
                                    mapsDB.insertOne(map, (err, res) => {
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