const path = require('path');
const test = require('ava');
const webpack = require('webpack');
const FrauAppConfigPlugin = require('../lib/index');
const assertAppConfigCreatedCorrectly = require('./appConfigAsserter').assertAppConfigCreatedCorrectly;

function forceLocalBehaviour() {
    delete process.env['TRAVIS'];
}

const TEST_PLUGIN_1 = new FrauAppConfigPlugin({
    packageFile: path.join( __dirname, 'mocks', 'mockPackage.json' )
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

const ENTRY = './test/mocks/mockEntry.js';

const OUTPUT = {
    path: path.resolve( __dirname, 'temp' )
}

test.cb('Build appconfig using simulated package.json', t => {

    forceLocalBehaviour();

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_1
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
        t.end();
    });


});

test.cb('Build appconfig using plugin options', t => {

    forceLocalBehaviour();

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_2
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
        t.end();
    });

});
