import express from 'express';

/* import all routes that will be used here */
// import summonerv3Router from './SummonerRoute';
// import championv3Router from './ChampionRoute';
// import championMasteryv3Router from './ChampionMasteryRoute';
// import leaguev3Router from './LeagueRoute';
import staticDatav3Router from './StaticDataRoute';
import paths from '../paths';

/*make main router for v1 api*/
var soloquepro_V1_Router = express.Router();

var welcomeMessage = { message: 'Welcome to SoloQuePro' };

soloquepro_V1_Router.get('/', function(req, res, next){
	res.json(welcomeMessage);
});

/* ---------- THESE PATHS ARE SET UP...JUST NEED GET REQS TO BE IMPLEMENTED ---------*/

// soloquepro_V1_Router.use(paths.base_summoners, summonerv3Router);
// soloquepro_V1_Router.use(paths.base_champions, championv3Router);
// soloquepro_V1_Router.use(paths.base_champion_masteries, championMasteryv3Router);
// soloquepro_V1_Router.use(paths.base_leagues, leaguev3Router);

/* ---------- THESE PATHS ARE SET UP...JUST NEED GET REQS TO BE IMPLEMENTED ---------*/

soloquepro_V1_Router.use(paths.base_staticData, staticDatav3Router);
	
export default soloquepro_V1_Router