# ember-cli-deploy-firebase-database

> An Ember CLI Deploy plugin to upload index.html to a firebase database

This plugin uploads a file, presumably index.html, to a specified Firebase Realtime Database.

More often than not this plugin will be used in conjunction with <https://github.com/ibroadfo/ember-cli-deploy-firebase> where the ember application assets will be served from Firebase Hosting and the index.html file will be served from a Cloud Function which pulls from a Firebase Database (more explanation to follow!). However, it can be used to upload any file to a firebase db.

## What is an Ember CLI Deploy plugin?

A plugin is an addon that can be executed as a part of the Ember CLI Deploy pipeline. A plugin will implement one or more of the Ember CLI Deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][1].

## Quick Start

To get up and running quickly, do the following:

-   [Sign up for a Firebase account](https://www.firebase.com/signup/)

-   Install the ember-cli-deploy tool

```bash
$ ember install ember-cli-deploy
```
-   Install the ember-cli-deploy-build plugin

```bash
$ ember install ember-cli-deploy-build
```

-   Install this plugin

```bash
$ ember install ember-cli-deploy-firebase-database
```

-   Download a firebase service account key as per <https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app> into your project directory; do *NOT* store this in git!

-   Place the following configuration into `config/deploy.js`

```javascript
ENV["firebase-database"] = {
  serviceAccountKeyPath: "./<your-service-account-key-filename>",
  firebaseAppName: '<your-firebase-app-name>',
}
```

-   Run the pipeline

```bash
$ ember deploy production
```

## Installation
Run the following command in your terminal:

```bash
ember install ember-cli-deploy-firebase-database
```

## Ember CLI Deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

-   `upload`

## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][1].

### filePattern

A file matching this pattern will be uploaded to Firebase Database.

*Default:* `'index.html'`

### indexKey

The node key at which to store the uploaded file.

*Default:* `'index_html'`

### parentPath

The parent path to prepend to the `indexKey` path.

*Default:* `''` i.e. the indexKey is stored directly under the root

### firebaseDatabaseUID

The uid to be used to limit access to the database. Should be configured in your database rules e.g. `"index_html": {".write": "auth.uid === 'index_writer'"}`

*Default:* `'index_writer'`

### serviceAccountKeyPath

The local path to the service account key downloaded from firebase, usually stored in the project directory.

### firebaseAppName

The name of the firebase app you wish to upload to.

## Prerequisites

The following properties are expected to be present on the deployment context object:

-   `distDir` (provided by [ember-cli-deploy-build][2])

## Tests

*   yarn test

## Why `ember test` doesn't work

Since this is a node-only Ember CLI addon, we use mocha for testing and this package does not include many files and devDependencies which are part of Ember CLI's typical `ember test` processes.

[1]: http://ember-cli-deploy.com/plugins/ "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
