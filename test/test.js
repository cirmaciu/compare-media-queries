var assert = require('assert')
var compare = require('../index');

describe('Media Query Sort', function() {
    describe('Type', function() {
        const typeScreen = 'screen';
        const typeEmpty = '';
        const typeAll = 'all';
        const typePrint = 'print';

        it('empty = all', function() {
            assert.equal(0, compare(typeEmpty, typeAll));
        });
        it('all < screen', function() {
            assert.equal(true, compare(typeAll, typeScreen) < 0);
        });
        it('screen < print', function() {
            assert.equal(true, compare(typeScreen, typePrint) < 0);
        });
        it('all < print', function() {
            assert.equal(true, compare(typeAll, typePrint) < 0);
        });
    });
    
    describe('Modifier', function() {
        const minWidth = '(min-width: 30em)';
        const maxWidth = '(max-width: 30em)';
        const orientation = '(orientation: landscape)';

        it('min < max', function() {
            assert.equal(true, compare(minWidth, maxWidth) < 0);
        });

        it('undefined modifier > min', function() {
            assert.equal(true, compare(orientation, minWidth) > 0);
        });

        it('undefined modifier > max', function() {
            assert.equal(true, compare(orientation, maxWidth) > 0);
        });
    });

    describe('Feature', function() {
        const minWidth = '(min-width: 30em)';
        const maxWidth = '(max-width: 30em)';
        const minHeight = '(min-height: 30em)';
        const maxHeight = '(max-height: 30em)';[]

        it('min-width < min-height', function() {
            assert.equal(true, compare(minWidth, minHeight) < 0);
        });

        it('min-width < max-height', function() {
            assert.equal(true, compare(minWidth, maxHeight) < 0);
        });

        it('min-height < max-width', function() {
            assert.equal(true, compare(minHeight, maxWidth) < 0);
        });

        it('max-width < max-height', function() {
            assert.equal(true, compare(maxWidth, maxHeight) < 0);
        });
    });

    describe('Values', function() {
        const em20 = '(min-width: 20em)';
        const em30 = '(min-width: 30em)';
        const rem30 = '(min-width: 30em)';

        it('20em < 30em', function() {
            assert.equal(true, compare(em20, em30) < 0);
        });

        it('30em = 30rem', function() {
            assert.equal(0, compare(em30, rem30));
        })
    });

    describe('Combined features', function() {
        const first = 'screen and (min-width: 20em)';
        const second = 'screen and (max-height: 30em)';
        const third = 'print and (min-width: 20px)';
        const fourth = 'screen and (min-width: 20px)';
        const fifth = 'screen';
        const sixth = '(orientation: landscape)';
        const retina = '(min-resolution: 1.3dppx)';
        const firstBare = '(min-width: 20em)';
        const miDeviceWidth = '(min-device-width: 42mm)';

        it(`${first} < ${second}`, function() {
            assert.equal(true, compare(first, second) < 0);
        });

        it(`${fourth} < ${first}`, function() {
            assert.equal(true, compare(fourth, first) < 0);
        });

        it(`${second} < ${third}`, function() {
            assert.equal(true, compare(second, third) < 0);
        });

        it(`${fifth} < ${first}`, function() {
            assert.equal(true, compare(fifth, first) < 0);
        });

        it(`${sixth} < ${fifth}`, function() {
            assert.equal(true, compare(sixth, fifth) < 0);
        });

        it(`${retina} < ${first}`, function() {
            assert.equal(true, compare(retina, first) < 0);
        });

        it(`${firstBare} < ${retina}`, function() {
            assert.equal(true, compare(firstBare, retina) < 0);
        });

        it(`${firstBare} < ${miDeviceWidth}`, function() {
            assert.equal(true, compare(firstBare, miDeviceWidth) < 0);
        });
    });
});