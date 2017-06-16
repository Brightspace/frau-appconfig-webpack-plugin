import Builder from 'frau-appconfig-builder';
import FrauPublisher from 'gulp-frau-publisher';
import FrauLocalResolver from 'frau-local-appresolver';

function getVersion( version ) {
    const _version = process.env[frauPublisher.version];

    if ( !_version && !version ) {
        return null;
    }

    return _version || version;
}

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

    const { frauLocalAppResolver, frauAppConfigBuilder, frauPublisher, options } = this.config;

    const appClass = frauLocalAppResolver ? frauLocalAppResolver.appClass : null;
    const appFile = frauAppConfigBuilder ? frauAppConfigBuilder.appFile : null;
    const envVar = frauAppConfigBuilder ? frauAppConfigBuilder.envVar : null;
    const loader = frauAppConfigBuilder ? frauAppConfigBuilder.loader : null;

    if (!appClass) {
        console.error( 'appClass must defined in frauLocalAppResolver' );
        return;
    }

    if (!appFile) {
        console.error( 'appFile must defined in frauAppConfigBuilder' );
        return;
    }

    if (!options.id || !options.version || !options.description) {
        console.error( 'id, version, or description not specified' );
        return;
    }

    let _builder = Builder.umd;

    if (loader === 'iframe') {
        _builder = Builder.iframe
    } else if (loader === 'html') {
        _builder = Builder.html
    }

    compiler.plugin('emit', function(compilation, cb) {

        let target;

        if ( envVar && process.env[envVar] ) {

            const publisherOptions = {
                ...frauPublisher,
                version: getVersion(frauPublisher.version),
                devTag: process.env[frauPublisher.devTag] || frauPublisher.devTag
            };

            target = FrauPublisher
                .app(frauPublisher)
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
