const prompt = require('prompt');

prompt.start();

prompt.get(['userSelection'], function (err, result) {
    let userSelection = result.userSelection.toUpperCase();

});
