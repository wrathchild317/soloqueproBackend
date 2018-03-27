'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _StaticDataRoute = require('./StaticDataRoute');

var _StaticDataRoute2 = _interopRequireDefault(_StaticDataRoute);

var _paths = require('../paths');

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*make main router for v1 api*/


/*import all routes that will be used here*/
// import summonerv3Router from './SummonerRoute';
// import championv3Router from './ChampionRoute';
// import championMasteryv3Router from './ChampionMasteryRoute';
// import leaguev3Router from './LeagueRoute';
var soloquepro_V1_Router = _express2.default.Router();

var welcomeMessage = { message: 'Welcome to SoloQuePro' };

soloquepro_V1_Router.get('/', function (req, res, next) {
	res.json(welcomeMessage);
});

/* ---------- THESE PATHS ARE SET UP...JUST NEED GET REQS TO BE IMPLEMENTED ---------*/

// soloquepro_V1_Router.use(paths.base_summoners, summonerv3Router);
// soloquepro_V1_Router.use(paths.base_champions, championv3Router);
// soloquepro_V1_Router.use(paths.base_champion_masteries, championMasteryv3Router);
// soloquepro_V1_Router.use(paths.base_leagues, leaguev3Router);

/* ---------- THESE PATHS ARE SET UP...JUST NEED GET REQS TO BE IMPLEMENTED ---------*/

soloquepro_V1_Router.use(_paths2.default.base_staticData, _StaticDataRoute2.default);

exports.default = soloquepro_V1_Router;