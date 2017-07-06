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
    fireStub.initializeApp = function (){};
    fireStub.credential = {
      cert: function(){}
    };
    fireStub.database = function() {
      return {
        ref: function() {
          return {
            set: function(data) {
              return data;
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
            firebaseAppName: 'foo'
          },
          build: {outputPath: './dist'},
        }
      };
      plugin.beforeHook(context);
      plugin.configure(context);
      return plugin.upload(context).then((result) => {
        return result.should.be.equal('foobarbaz\n');
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
