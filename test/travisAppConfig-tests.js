const path = require('path');
const test = require('ava');
const webpack = require('webpack');
const FrauAppConfigPlugin = require('../lib/index');
const assertAppConfigCreatedCorrectly = require('./appConfigAsserter').assertAppConfigCreatedCorrectly;

function simulateTravisEnvironment( tagVersion ) {
    process.env['TRAVIS'] = true;
    process.env['TRAVIS_TAG'] = tagVersion;
    process.env['TRAVIS_COMMIT'] = 'd41d8cd98f00b204e9800998ecf8427e'
}

function resetEnvironment() {
    delete process.env['TRAVIS'];
    delete process.env['TRAVIS_TAG'];
    delete process.env['TRAVIS_COMMIT'];
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
        devTagVar: 'TRAVIS_COMMIT',
        versionVar: 'TRAVIS_TAG'
    }
});

const TEST_PLUGIN_3 = new FrauAppConfigPlugin({
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
        devTag: 'commitHash',
        version: '14.0.0'
    }
});

const ENTRY = './test/mocks/mockEntry.js';

const OUTPUT = {
    path: path.resolve( __dirname, 'temp' )
}


test.cb('Build appconfig using simulated package.json', t => {

    simulateTravisEnvironment( '' );

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_1
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
        resetEnvironment();
        t.end();
    });

});

test.cb('Build appconfig using plugin options', t => {

    simulateTravisEnvironment( '1.0.0' );

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_2
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
        resetEnvironment();
        t.end();
    });

});

test.cb('Build appconfig using explicity dev tag and version', t => {

    simulateTravisEnvironment( '2.0.0' );

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            TEST_PLUGIN_3
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigCreatedCorrectly(t, err, stats);
        resetEnvironment();
        t.end();
    });

});
