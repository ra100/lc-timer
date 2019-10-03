const assert = require('assert')

const util = require('../src/util')

describe('util', function() {
  describe('_exec', function() {
    it('is a function', function() {
      assert.equal(typeof util._exec, 'function')
    })

    xit('is not really testable as is', function () {
      // TODO
    })
  })

  describe('nextIndex', function() {
    it('is a function', function() {
      assert.equal(typeof util.nextIndex, 'function')
    })

    xit('needs more tests', function () {
      // TODO
    })
  })

  describe('shuffleArray', function () {
    it('is a function', function() {
      assert.equal(typeof util.shuffleArray, 'function')
    })

    xit('needs more tests', function () {
      // TODO
    })
  })
})
