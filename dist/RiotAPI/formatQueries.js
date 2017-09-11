'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (queries) {
	return _lodash2.default.reduce(queries, function (acc, val, key) {
		return _lodash2.default.isArray(val) ? acc + _lodash2.default.reduce(val, function (str, tag) {
			return str + key + '=' + tag + '&';
		}, '') : acc + key + '=' + val + '&';
	}, '');
};