const path = require('path');
const test = require('ava');
const webpack = require('webpack');
const FrauAppConfigPlugin = require('../lib/index');
const Errors = require('../lib/errors').default;
const assertAppConfigMissing = require('./appConfigAsserter').assertAppConfigMissing;

const TEST_PLUGIN_1 = new FrauAppConfigPlugin({
    packageFile: path.join( __dirname, 'mocks', 'mockPackage.json' )
});

const ENTRY = './test/mocks/mockEntry.js';

const OUTPUT = {
    path: path.resolve( __dirname, 'temp' )
}

test.cb('Missing appId, description, or version, should not generate app config', t => {

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            new FrauAppConfigPlugin({
                frauAppConfigBuilder: {
                    appFile: 'test'
                },
                frauLocalAppResolver: {
                    appClass: "test-app"
                }
            })
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigMissing(t, err, stats, Errors.missingIdorVersionOrDescription );
        t.end();
    });

});

test.cb('Missing appFile, should not generate app config', t => {

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            new FrauAppConfigPlugin({
                appId: 'test',
                description: 'test',
                version: '1.0.0',
                frauLocalAppResolver: {
                    appClass: "test-app"
                }
            })
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigMissing(t, err, stats, Errors.missingAppFile );
        t.end();
    });

});

test.cb('Missing app class, should not generate app config', t => {

    const testConfig = {
        entry: ENTRY,
        output: OUTPUT,
        plugins: [
            new FrauAppConfigPlugin({
                appId: 'test',
                description: 'test',
                version: '1.0.0',
                frauAppConfigBuilder: {
                    appFile: 'test'
                }
            })
        ]
    }

    webpack(testConfig, function(err, stats) {
        assertAppConfigMissing(t, err, stats, Errors.missingAppClass);
        t.end();
    });

});
