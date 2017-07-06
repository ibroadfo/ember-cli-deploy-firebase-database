/*eslint-env node*/
'use strict';

const subject = require('../../index');
const assert  = require('../helpers/assert');

describe('Firebase Database | configure hook', function() {
  let mockUi;

  beforeEach(function() {
    mockUi = {
      verbose: true,
      messages: [],
      write: function() { },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  describe('required config', function() {
    it('warns about missing config props', function() {
      let instance = subject.createDeployPlugin({
        name: 'firebase-database'
      });

      let context = {
        ui: mockUi,
        config: {
          'firebase-database': {}
        }
      };

      instance.beforeHook(context);

      assert.throws(function(){
        instance.configure(context);
      });

      let s = 'Missing required config: \`serviceAccountKeyPath\`';
      assert.match(mockUi.messages.pop(), new RegExp(s));
    });
  });
});
