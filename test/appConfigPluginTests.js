const path = require('path');
const test = require('ava');
const webpack = require('webpack');
const fs = require('fs');
const FrauAppConfigPlugin = require('../lib/index');

const TEST_PLUGIN_1 = new FrauAppConfigPlugin({
    packageFile: path.join( __dirname, 'mockPackage.json' )
});

const TEST_PLUGIN_2 = new FrauAppConfigPlugin({
    appId: 'urn:d2l:fra:id:test-app',
    description: 'test-config',
    version: '1.0.0',
    frauAppConfigBuilder: {
        appFile: 'index.html',
        dist: './test',
        envVar: 'TRAVIS',
        loader: 'iframe'
    } ,
    frauLocalAppResolver: {
         appClass: 'urn:d2l:fra:class:test-app'
    },
    frauPublisher: {
        files: './dist/**',
        moduleType: 'app',
        targetDirectory: 'plugin-tester',
        creds: {
            key: 'key',
            secret: 'secret'
        },
        devTag: 'TRAVIS_COMMIT',
        version: 'TRAVIS_TAG'
    }
});

const ENTRY = './test/mockEntry.js';

const OUTPUT = {
    path: path.resolve( __dirname, 'temp' )
}

function assertAppConfigCreatedCorrectly( tester, err, stats ) {

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

    tester.end();
}

function assertAppConfigMissing( tester, err, stats ) {
    if (err) {
        return tester.end(err);
    } else if (stats.hasErrors()) {
        return tester.end(stats.toString());
    }

    const files = stats.toJson().assets.map( x => x.name );

    tester.true( files.indexOf('appconfig.json') === -1 );
}

test.cb('Build appconfig using simulated package.json', t => {

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_1
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
    });
});

test.cb('Build appconfig using plugin options', t => {

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_2
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
    });
});
