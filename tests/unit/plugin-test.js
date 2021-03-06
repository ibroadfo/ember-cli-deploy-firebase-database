/* eslint-env node, mocha, es6 */
'use strict';
var chai = require("chai");
// var expect    = chai.expect;
var proxyquire =  require('proxyquire').noCallThru();
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);

var subject;
const assert  = require('../helpers/assert');

describe('Firebase Database plugin', function() {
  var mockUi;
  var fireStub = {};

  beforeEach(function() {
    subject = proxyquire('../../index', { 'firebase-admin': fireStub });
    mockUi = {
      verbose: true,
      messages: [],
      write: function() { },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  describe('calls set', function() {

    var plugin;
    var context;
    var initialOptions;
    fireStub.initializeApp = function (options){
      initialOptions = options;
    };
    fireStub.credential = {
      cert: function(){}
    };
    fireStub.database = function() {
      return {
        ref: function(fullPath) {
          return {
            set: function(data) {
              return {
                fullPath: fullPath,
                data: data,
                initialOptions: initialOptions
              };
            }
          }
        }
      }
    }

    it('uploads the index', function() {
      plugin = subject.createDeployPlugin({name:'firebase-database' });
      context = {
        ui: mockUi,
        // project: stubProject,
        config: {
          "firebase-database": {
            distDir: 'tests/dummy',
            filePattern: 'index.html',
            serviceAccountKeyPath: 'tests/dummy/bar',
            firebaseAppName: 'foo',
          },
          build: {outputPath: './dist'},
        }
      };
      plugin.beforeHook(context);
      plugin.configure(context);
      return plugin.upload(context).then((result) => {
        result.fullPath.should.be.equal('index_html')
        return result.data.should.be.equal('foobarbaz\n');
      });
    });

    it('stores the index at the specified path', function() {
      plugin = subject.createDeployPlugin({name:'firebase-database' });
      context = {
        ui: mockUi,
        // project: stubProject,
        config: {
          "firebase-database": {
            distDir: 'tests/dummy',
            filePattern: 'index.html',
            serviceAccountKeyPath: 'tests/dummy/bar',
            firebaseAppName: 'foo',
            parentPath: 'parent/',
            indexKey: 'index'
          },
          build: {outputPath: './dist'},
        }
      };
      plugin.beforeHook(context);
      plugin.configure(context);
      return plugin.upload(context).then((result) => {
        result.fullPath.should.be.equal('parent/index')
        return result.data.should.be.equal('foobarbaz\n');
      });
    });

    it('uses the specified uid', function() {
      plugin = subject.createDeployPlugin({name:'firebase-database' });
      context = {
        ui: mockUi,
        // project: stubProject,
        config: {
          "firebase-database": {
            distDir: 'tests/dummy',
            filePattern: 'index.html',
            serviceAccountKeyPath: 'tests/dummy/bar',
            firebaseAppName: 'foo',
            parentPath: 'parent/',
            indexKey: 'index',
            firebaseDatabaseUID: 'username'
          },
          build: {outputPath: './dist'},
        }
      };
      plugin.beforeHook(context);
      plugin.configure(context);
      return plugin.upload(context).then((result) => {
        result.initialOptions.databaseAuthVariableOverride.uid.should.be.equal('username')
        return result.data.should.be.equal('foobarbaz\n');
      });
    });
  });

  it('has a name', function() {
    let instance = subject.createDeployPlugin({
      name: 'firebase-database'
    });

    assert.equal(instance.name, 'firebase-database');
  });

  it('implements the correct hooks', function() {
    let plugin = subject.createDeployPlugin({
      name: 'firebase-database'
    });

    assert.isDefined(plugin.upload);
    assert.isFunction(plugin.upload);
  });
});
