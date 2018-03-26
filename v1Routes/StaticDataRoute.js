import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

import _ from 'lodash';
import striptags from 'striptags';

import paths from '../paths';

var MongoClient = require('mongodb').MongoClient;

var StaticDataRouter = express.Router();

MongoClient.connect(paths.mongoUrl, (err, db) => {

StaticDataRouter.route(paths.championId)
    .get((req, res) => {
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

StaticDataRouter.route(paths.champions)
    .get((req, res) => {
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

StaticDataRouter.route(paths.items)
    .get((req, res) => {
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

StaticDataRouter.route(paths.itemsId)
    .get((req, res) => {
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

StaticDataRouter.route(paths.maps)
    .get((req, res) => {
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

StaticDataRouter.route(paths.mapsId)
    .get((req, res) => {
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

export default StaticDataRouter