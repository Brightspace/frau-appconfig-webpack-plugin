const path = require('path');

module.exports.assertAppConfigCreatedCorrectly = function(tester, err, stats) {

    if (err) {
        return tester.end(err);
    } else if (stats.hasErrors()) {
        return tester.end(stats.toString());
    }

    const files = stats.toJson().assets.map( x => x.name );

    const appConfigIndex = files.indexOf('appconfig.json');

    tester.true(appConfigIndex !== -1);

    const appConfig = require(path.join( __dirname, 'temp', 'appconfig.json'));

    tester.true(appConfig.metadata.version === '1.0.0');
    tester.true(appConfig.metadata.id === 'urn:d2l:fra:id:test-app');
    tester.true(appConfig.metadata.description === 'test-config');
}

module.exports.assertAppConfigMissing = function(tester, err, stats, expectedError) {

    if (err) {
        return tester.end(err);
    }

    tester.true( stats.hasErrors() === true );

    const errors = stats.toJson().errors;
    tester.true( errors[0] === expectedError )
    return;
}
