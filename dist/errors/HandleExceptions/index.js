'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
  });
};