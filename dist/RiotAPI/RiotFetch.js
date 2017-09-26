'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (url) {
    return fetch(url).then(function (response) {
        var status = response.status;
        if (status >= 400) {
            var error = {
                status: status,
                url: url
            };

            console.log('Fetch Error:');
            console.log(error);
        }

        return response.json();
    }).catch(function (err) {
        console.log(err);
    });
};