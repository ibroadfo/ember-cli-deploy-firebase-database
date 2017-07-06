/*eslint-env node*/
'use strict';

var path = require('path');
var fs = require('fs');

var denodeify = require('rsvp').denodeify;
var readFile  = denodeify(fs.readFile);
var admin = require("firebase-admin");

const DeployPluginBase = require('ember-cli-deploy-plugin');

module.exports = {
  name: 'ember-cli-deploy-firebase-database',

  createDeployPlugin: function(options) {
    let DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      defaultConfig: {
        filePattern: 'index.html',
        distDir: function(context) {
          return context.distDir || './dist';
        },
      },
      requiredConfig: ['serviceAccountKeyPath', 'firebaseAppName'],

      upload(/*context*/) {
        var distDir               = this.readConfig('distDir');
        var filePattern           = this.readConfig('filePattern');
        var filePath              = path.join(distDir, filePattern);
        var serviceAccountKeyPath = this.readConfig('serviceAccountKeyPath');
        var firebaseAppName       = this.readConfig('firebaseAppName');
        var databaseURL           = "https://" + firebaseAppName + ".firebaseio.com";

        this.log('Uploading `' + filePath + '` to `' + databaseURL + '`', { verbose: true });

        return this._readFileContents(serviceAccountKeyPath).then((serviceAccount)=>{
          this.log("read serviceAccount", { verbose: true })
          serviceAccount = JSON.parse(serviceAccount)

          this.log("setting up firebase", { verbose: true })
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseURL,
            databaseAuthVariableOverride: {uid:'index_writer'}
          });

          return this._readFileContents(filePath).then((data) => {
            this.log("setting index", { verbose: true })
            return admin.database().ref("index_html").set(data);
          });

        });
      },

      _readFileContents: function(path) {
        this.log("reading file " + path, { verbose: true })
        return readFile(path)
          .then(function(buffer) {
            return buffer.toString();
          });
      },
    });

    return new DeployPlugin();
  }
};
