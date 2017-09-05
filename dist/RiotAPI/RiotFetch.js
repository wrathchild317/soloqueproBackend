'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (url, res) {
    fetch(url).then(function (response) {
        var status = response.status;
        if (status >= 400) {
            var error = {
                status: status,
                url: url
            };

            console.log('Error - Riot API:');
            console.log(error);
        }

        return response.json();
    }).then(function (data) {
        res.json(data);
    });
};