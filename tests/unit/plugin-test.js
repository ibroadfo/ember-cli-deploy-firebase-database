/*eslint-env node*/
'use strict';

const subject = require('../../index');
const assert  = require('../helpers/assert');

describe('Firebase Database plugin', function() {
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

    assert.isDefined(plugin.configure);
    assert.isFunction(plugin.configure);
  });
});
