'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	key: 'RGAPI-21e46587-3ad3-4ea4-9c9d-4ff3061c1aed',
	baseUrl: 'https://na1.api.riotgames.com',
	apis: {
		summonerv3: {
			getBySummonerName: {
				url: '/lol/summoner/v3/summoners/by-name/:summonerName',
				fetchUrl: ['/lol/summoner/v3/summoners/by-name/']
			},
			getByAccountId: {
				url: '/lol/summoner/v3/summoners/by-account/:accountId',
				fetchUrl: ['/lol/summoner/v3/summoners/by-account/']
			},
			getBySummonerId: {
				url: '/lol/summoner/v3/summoners/:summonerId',
				fetchUrl: ['/lol/summoner/v3/summoners/']
			}
		},
		championv3: {
			getAllChampions: {
				url: '/lol/platform/v3/champions/',
				fetchUrl: ['/lol/platform/v3/champions']
			},
			getChampionById: {
				url: '/lol/platform/v3/champions/:championId',
				fetchUrl: ['/lol/platform/v3/champions/']
			}
		},
		championMasteryv3: {
			getBySummonerId: {
				url: '/lol/champion-mastery/v3/champion-masteries/by-summoner/:summonerId',
				fetchUrl: ['/lol/champion-mastery/v3/champion-masteries/by-summoner/']
			},
			getBySummonerChampionId: {
				url: '/lol/champion-mastery/v3/champion-masteries/by-summoner/:summonerId/by-champion/:championId',
				fetchUrl: ['/lol/champion-mastery/v3/champion-masteries/by-summoner/', '/by-champion/']
			},
			getTotalMasteryScore: {
				url: '/lol/champion-mastery/v3/scores/by-summoner/:summonerId',
				fetchUrl: ['/lol/champion-mastery/v3/scores/by-summoner/']
			}
		},
		leaguev3: {
			getLeaguesBySummonerId: {
				url: '/lol/league/v3/leagues/by-summoner/:summonerId',
				fetchUrl: ['/lol/league/v3/leagues/by-summoner/']
			},
			getPositionsBySummonerId: {
				url: '/lol/league/v3/positions/by-summoner/:summonerId',
				fetchUrl: ['/lol/league/v3/positions/by-summoner/']
			}
		},
		staticDatav3: {
			getAllChampions: {
				url: '/lol/static-data/champions',
				fetchUrl: ['/lol/static-data/v3/champions/']
			},
			getChampionById: {
				url: '/lol/static-data/champions/:championId',
				fetchUrl: ['/lol/static-data/v3/champions/']
			},
			realms: {
				url: '/lol/static-data/v3/realms',
				fetchUrl: ['/lol/static-data/v3/realms']
			},
			getAllItems: {
				url: '/lol/static-data/items'
			},
			getItemById: {
				url: '/lol/static-data/items/:itemId'
			},
			getAllMaps: {
				url: '/lol/static-data/maps'
			},
			getMapById: {
				url: '/lol/static-data/maps/:mapId'
			}
		}
	}
};