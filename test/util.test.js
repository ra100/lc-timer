const assert = require('assert')

const util = require('../src/util')

describe('util', function() {
  describe('_exec', function() {
    it('is a function', function() {
      assert.equal(typeof util._exec, 'function')
    })

    xit('is not really testable as is', function() {
      // TODO
    })
  })

  describe('nextIndex', function() {
    it('is a function', function() {
      assert.equal(typeof util.nextIndex, 'function')
    })

    it('returns the next item in a given array', function() {
      const array = ['item0', 'item1', 'item2']
      const initialIndex = 0

      const result = util.nextIndex(array, initialIndex)

      assert.equal(result, initialIndex + 1)

      const result2 = util.nextIndex(array, initialIndex + 1)

      assert.equal(result2, initialIndex + 2)
    })

    it('returns 0 if the given index is the last item in the array', function() {
      const array = ['item0', 'item1', 'item2']
      const initialIndex = array.length - 1

      const result = util.nextIndex(array, initialIndex)

      assert.equal(result, 0)
    })

    it('returns 0 if the given index is out of bounds', function() {
      const array = ['item0', 'item1', 'item2']
      const initialIndex = array.length + 42

      const result = util.nextIndex(array, initialIndex)

      assert.equal(result, 0)
    })

    xit('needs more tests', function() {
      // TODO
    })
  })

  describe('shuffleArray', function() {
    it('is a function', function() {
      assert.equal(typeof util.shuffleArray, 'function')
    })

    xit('needs more tests', function() {
      // TODO
    })
  })
})
