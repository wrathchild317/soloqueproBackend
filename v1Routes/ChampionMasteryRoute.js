import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

import _ from 'lodash';
import striptags from 'striptags';

import paths from '../paths';

var MongoClient = require('mongodb').MongoClient;

var ChampionMasteryRouter = express.Router();


export default ChampionMasteryRouter