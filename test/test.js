var assert = require('assert')
var mqsort = require('../index');

describe('Media Query Sort', function() {
    describe('Type', function() {
        const typeScreen = 'screen';
        const typeEmpty = '';
        const typeAll = 'all';
        const typePrint = 'print';

        it('empty equal to all', function() {
            assert.equal(0, mqsort(typeEmpty, typeAll));
        });
        it('all before screen', function() {
            assert.equal(true, mqsort(typeAll, typeScreen) < 0);
        });
        it('screen before print', function() {
            assert.equal(true, mqsort(typeScreen, typePrint) < 0);
        });
        it('all before print', function() {
            assert.equal(true, mqsort(typeAll, typePrint) < 0);
        });
    });
});