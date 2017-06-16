import Builder from 'frau-appconfig-builder';
import FrauPublisher from 'frau-publisher';
import FrauLocalResolver from 'frau-local-appresolver';

import Errors from './errors';

function FrauAppConfigPlugin(options) {

    if ( options.packageFile ) {

        const pjson = require(options.packageFile);

        this.config = {
            options: {
                id: pjson.appId,
                description: pjson.description,
                version: pjson.version
            },
            frauLocalAppResolver: pjson.config.frauLocalAppResolver ,
            frauAppConfigBuilder: pjson.config.frauAppConfigBuilder,
            frauPublisher: pjson.config.frauPublisher
        };

        return;
    }

    this.config = {
        options: {
            id: options.appId,
            description: options.description,
            version: options.version
        },
        frauLocalAppResolver: options.frauLocalAppResolver ,
        frauAppConfigBuilder: options.frauAppConfigBuilder,
        frauPublisher: options.frauPublisher
    };
}

FrauAppConfigPlugin.prototype.apply = function(compiler) {

    let errors = [];

    const { frauLocalAppResolver, frauAppConfigBuilder, frauPublisher, options } = this.config;

    const appClass = frauLocalAppResolver ? frauLocalAppResolver.appClass : null;
    const appFile = frauAppConfigBuilder ? frauAppConfigBuilder.appFile : null;
    const envVar = frauAppConfigBuilder ? frauAppConfigBuilder.envVar : null;
    const loader = frauAppConfigBuilder ? frauAppConfigBuilder.loader : null;

    if (!options.id || !options.version || !options.description) {
        errors.push(Errors.missingIdorVersionOrDescription);
    }

    if (!appFile) {
        errors.push(Errors.missingAppFile);
    }

    if (!appClass) {
        errors.push(Errors.missingAppClass);
    }

    let _builder = Builder.umd;

    if (loader === 'iframe') {
        _builder = Builder.iframe
    } else if (loader === 'html') {
        _builder = Builder.html
    }

    compiler.plugin('emit', function(compilation, cb) {

        if ( errors.length > 0 ) {
            errors.forEach( err => {
                compilation.errors.push(err);
            });
            cb();
            return;
        }

        let target;

        if ( envVar && process.env[envVar] ) {

            const publisherOptions = {
                ...frauPublisher,
                key: frauPublisher.creds.key,
                secret: frauPublisher.creds.secret || process.env[frauPublisher.creds.secretVar],
                version: frauPublisher.version || process.env[frauPublisher.versionVar],
                devTag: frauPublisher.devTag || process.env[frauPublisher.devTagVar]
            };

            target = FrauPublisher
                .app(publisherOptions)
                .getLocation() + appFile;
        } else {

            const localOptions = FrauLocalResolver.optionsProvider.getOptions(frauAppConfigBuilder)

            target = FrauLocalResolver
                .resolver(appClass, localOptions)
                .getUrl() + appFile;
        }

        const appConfig = _builder.build(target, options);
        const appConfigString = JSON.stringify(appConfig);

        compilation.assets['appconfig.json'] = {
            source: () => appConfigString,
            size: () => appConfigString.length
        };

        cb();
    });
}

module.exports = FrauAppConfigPlugin;
