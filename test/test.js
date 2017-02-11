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
            assert(compare(typeAll, typeScreen) < 0);
        });
        it('screen < print', function() {
            assert(compare(typeScreen, typePrint) < 0);
        });
        it('all < print', function() {
            assert(compare(typeAll, typePrint) < 0);
        });
    });
    
    describe('Modifier', function() {
        const minWidth = '(min-width: 30em)';
        const maxWidth = '(max-width: 30em)';
        const orientation = '(orientation: landscape)';

        it('min < max', function() {
            assert(compare(minWidth, maxWidth) < 0);
        });

        it('undefined modifier > min', function() {
            assert(compare(orientation, minWidth) > 0);
        });

        it('undefined modifier > max', function() {
            assert(compare(orientation, maxWidth) > 0);
        });
    });

    describe('Feature', function() {
        const minWidth = '(min-width: 30em)';
        const maxWidth = '(max-width: 30em)';
        const minHeight = '(min-height: 30em)';
        const maxHeight = '(max-height: 30em)';[]

        it('min-width < min-height', function() {
            assert(compare(minWidth, minHeight) < 0);
        });

        it('min-width < max-height', function() {
            assert(compare(minWidth, maxHeight) < 0);
        });

        it('min-height < max-width', function() {
            assert(compare(minHeight, maxWidth) < 0);
        });

        it('max-width < max-height', function() {
            assert(compare(maxWidth, maxHeight) < 0);
        });
    });

    describe('Values', function() {
        const em20 = '(min-width: 20em)';
        const em30 = '(min-width: 30em)';
        const rem30 = '(min-width: 30em)';

        it('20em < 30em', function() {
            assert(compare(em20, em30) < 0);
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
            assert(compare(first, second) < 0);
        });

        it(`${fourth} < ${first}`, function() {
            assert(compare(fourth, first) < 0);
        });

        it(`${second} < ${third}`, function() {
            assert(compare(second, third) < 0);
        });

        it(`${fifth} < ${first}`, function() {
            assert(compare(fifth, first) < 0);
        });

        it(`${sixth} < ${fifth}`, function() {
            assert(compare(sixth, fifth) < 0);
        });

        it(`${retina} < ${first}`, function() {
            assert(compare(retina, first) < 0);
        });

        it(`${firstBare} < ${retina}`, function() {
            assert(compare(firstBare, retina) < 0);
        });

        it(`${firstBare} < ${miDeviceWidth}`, function() {
            assert(compare(firstBare, miDeviceWidth) < 0);
        });
    });

    // describe('Multiple conditions', function() {
    //     const maxWidth40 = 'screen and (min-width: 20em) and (max-width: 40em)';
    //     const maxWidth30 = 'screen and (min-width: 20em) and (max-width: 30em)';
    //     const maxHeight40 = 'screen and (min-width: 20em) and (max-height: 40em)';
    //     const maxHeight30 = 'screen and (min-width: 20em) and (max-height: 30em)';
    //     const minHeight20 = 'screen and (min-width: 20em) and (min-height: 20em)';
    //     const minHeight30 = 'screen and (min-width: 20em) and (min-height: 30em)';

    //     it(`${maxWidth40} < ${maxWidth30}`, function() {
    //         assert(compare(maxWidth40, maxWidth30) < 0);
    //     })
    // });
});