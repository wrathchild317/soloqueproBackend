'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _paths = require('../paths');

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoClient = require('mongodb').MongoClient;

var StaticDataRouter = _express2.default.Router();

MongoClient.connect(_paths2.default.mongoUrl, function (err, db) {

    StaticDataRouter.route(_paths2.default.championId).get(function (req, res) {
        var fields = req.query.fields;


        var championFields = fields ? fields.split(',') : {};

        championFields = _lodash2.default.reduce(championFields, function (acc, field) {
            acc[field] = true;
            return acc;
        }, {});

        var championId = parseInt(req.params.championId);

        db.collection('champions').findOne({ champion_id: championId }, championFields, function (err, champion) {
            if (err) throw err;
            champion ? res.json(champion) : res.status(500).send('Champion Not Found');
        });
    });

    StaticDataRouter.route(_paths2.default.champions).get(function (req, res) {
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
            if (err) throw err;
            champions ? res.json(champions) : res.status(500).send('Internal Server Error');
        });
    });

    StaticDataRouter.route(_paths2.default.items).get(function (req, res) {
        var _req$query2 = req.query,
            fields = _req$query2.fields,
            sort = _req$query2.sort,
            map = _req$query2.map;


        var itemFields = fields ? fields.split(',') : [];
        var sortFields = sort ? sort.split(',') : [];
        var mapQuery = {};

        map ? mapQuery['maps.' + map] = true : null;

        itemFields = _lodash2.default.reduce(itemFields, function (acc, field) {
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

        db.collection('items').find(mapQuery, itemFields).sort(sortFields).toArray(function (err, items) {
            if (err) throw err;
            items ? res.json(items) : res.status(500).send('Internal Server Error');
        });
    });

    StaticDataRouter.route(_paths2.default.itemsId).get(function (req, res) {
        var fields = req.query.fields;


        var itemFields = fields ? fields.split(',') : [];

        itemFields = _lodash2.default.reduce(itemFields, function (acc, field) {
            acc[field] = true;
            return acc;
        }, {});

        var itemId = parseInt(req.params.itemId);
        db.collection('items').findOne({ item_id: itemId }, itemFields, function (err, item) {
            if (err) throw err;
            item ? res.json(item) : res.status(500).send('Item Not Found');
        });
    });

    StaticDataRouter.route(_paths2.default.maps).get(function (req, res) {
        var _req$query3 = req.query,
            fields = _req$query3.fields,
            sort = _req$query3.sort,
            map = _req$query3.map;


        var mapFields = fields ? fields.split(',') : [];
        var sortFields = sort ? sort.split(',') : [];

        mapFields = _lodash2.default.reduce(mapFields, function (acc, field) {
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

        db.collection('maps').find({}, mapFields).sort(sortFields).toArray(function (err, maps) {
            if (err) throw err;
            maps ? res.json(maps) : res.status(500).send('Internal Server Error');
        });
    });

    StaticDataRouter.route(_paths2.default.mapsId).get(function (req, res) {
        var fields = req.query.fields;


        var mapFields = fields ? fields.split(',') : [];

        mapFields = _lodash2.default.reduce(mapFields, function (acc, field) {
            acc[field] = true;
            return acc;
        }, {});

        var mapId = req.params.mapId;
        db.collection('maps').findOne({ MapId: mapId }, mapFields, function (err, map) {
            if (err) throw err;
            map ? res.json(map) : res.status(500).send('Map Not Found');
        });
    });
});

exports.default = StaticDataRouter;