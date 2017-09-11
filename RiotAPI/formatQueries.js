import _ from 'lodash';

export default (queries) => {
	return  _.reduce(queries, (acc, val, key) => {
				return (_.isArray(val)) ? 
					acc + _.reduce(val, (str, tag) => {
						return str + key + '=' + tag + '&';
					}, '') : 
					acc + key + '=' + val + '&';
			}, '');
}