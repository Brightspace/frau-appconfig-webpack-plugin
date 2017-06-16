# frau-appconfig-webpack-plugin
Webpack plugin that builds app config using frau-appconfig-builder

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][dependencies-image]][dependencies-url]

## Installation

Install from npm:

```shell
npm install frau-appconfig-webpack-plugin 

                or
                
yarn install frau-appconfig-webpack-plugin
```

## Usage

```js
import FrauAppConfigPlugin from 'frau-appconfig-webpack-plugin';

//Webpack config
const config =  {
  ...,
  plugins: [
      
      new FrauAppConfigPlugin(options)
    
  ]
```

__Options__

There are two ways to specifiy options:

1. Pass in an object with the follow properties defined. appId, description, version, appClass and appFile __must__ be defined

```js
{
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
        devTagVar: 'TRAVIS_COMMIT', or devTag: 'Custom dev Tag'
        versionVar: 'TRAVIS_TAG' or version: 'SEMVAR VERSION: Ex. 1.0.0'
    }
}
```

2. Pass in path to `package.json` and define the options in the file. Example shown below.

```js
{
  packageFile: 'PATH_TO_PACKAGE_JSON'
}
```
```json
{
    "name": "sample-package-json",
    "appId": "urn:d2l:fra:id:one-drive-picker",
    "version": "0.0.1",
    "description": "Sample package json",
    "config": {
        "frauAppConfigBuilder": {
            "appFile": "index.html",
            "dist": "./dist",
            "envVar": "TRAVIS",
            "loader": "iframe"
        },
        "frauLocalAppResolver": {
            "appClass": "urn:d2l:fra:class:one-drive-picker"
        },
        "frauPublisher": {
            "files": "./dist/**",
            "moduleType": "app",
            "targetDirectory": "one-drive-picker",
            "creds": {
                "key": "AKIAIHAOLXU3VOEGR6HA",
                "secret": "S3_SECRET"
            },
            "devTag": "TRAVIS_COMMIT",
            "version": "TRAVIS_TAG"
        }
    }
}
```
## Contributing

1. **Fork** the repository. Committing directly against this repository is
   highly discouraged.

   2. Make your modifications in a branch, updating and writing new unit tests
      as necessary in the `spec` directory.

      3. Ensure that all tests pass with `yarn test`

      4. Submit a pull request to this repository. Wait for tests to run and someone
         to chime in.

### Code Style

This repository is configured with [EditorConfig][EditorConfig] rules.


[npm-url]: https://www.npmjs.org/package/frau-appconfig-webpack-plugin
[npm-image]: https://img.shields.io/npm/v/frau-appconfig-webpack-plugin.svg
[ci-url]: https://travis-ci.org/Brightspace/frau-appconfig-webpack-plugin
[ci-image]: https://img.shields.io/travis-ci/Brightspace/frau-appconfig-webpack-plugin.svg
[coverage-url]: https://coveralls.io/r/Brightspace/frau-appconfig-webpack-plugin?branch=master
[coverage-image]: https://img.shields.io/coveralls/Brightspace/frau-appconfig-webpack-plugin.svg
[dependencies-url]: https://david-dm.org/brightspace/frau-appconfig-webpack-plugin
[dependencies-image]: https://img.shields.io/david/Brightspace/frau-appconfig-webpack-plugin.svg
[EditorConfig]: http://editorconfig.org/
