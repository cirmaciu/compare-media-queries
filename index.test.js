var compare = require('./index');

describe('Media Query Sort', function() {
    describe('Type', function() {
        const typeScreen = 'screen';
        const typeEmpty = '';
        const typeAll = 'all';
        const typePrint = 'print';

        it('empty = all', function() {
            expect(compare(typeEmpty, typeAll)).toBe(0);
        });
        it('all < screen', function() {
            expect(compare(typeAll, typeScreen)).toBeLessThan(0);
        });
        it('screen < print', function() {
            expect(compare(typeScreen, typePrint)).toBeLessThan(0);
        });
        it('all < print', function() {
            expect(compare(typeAll, typePrint)).toBeLessThan(0);
        });
    });
    
    describe('Modifier', function() {
        const minWidth = '(min-width: 30em)';
        const maxWidth = '(max-width: 30em)';
        const orientation = '(orientation: landscape)';

        it('min < max', function() {
            expect(compare(minWidth, maxWidth)).toBeLessThan(0);
        });

        it('undefined modifier > min', function() {
            expect(compare(orientation, minWidth)).toBeGreaterThan(0);
        });

        it('undefined modifier > max', function() {
            expect(compare(orientation, maxWidth)).toBeGreaterThan(0);
        });
    });

    describe('Feature', function() {
        const minWidth = '(min-width: 30em)';
        const maxWidth = '(max-width: 30em)';
        const minHeight = '(min-height: 30em)';
        const maxHeight = '(max-height: 30em)';[]

        it('min-width < min-height', function() {
            expect(compare(minWidth, minHeight)).toBeLessThan(0);
        });

        it('min-width < max-height', function() {
            expect(compare(minWidth, maxHeight)).toBeLessThan(0);
        });

        it('min-height < max-width', function() {
            expect(compare(minHeight, maxWidth)).toBeLessThan(0);
        });

        it('max-width < max-height', function() {
            expect(compare(maxWidth, maxHeight)).toBeLessThan(0);
        });
    });

    describe('Values', function() {
        const em20 = '(min-width: 20em)';
        const em30 = '(min-width: 30em)';
        const rem30 = '(min-width: 30em)';

        it('20em < 30em', function() {
            expect(compare(em20, em30)).toBeLessThan(0);
        });

        it('30em = 30rem', function() {
            expect(compare(em30, rem30)).toBe(0);
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
            expect(compare(first, second)).toBeLessThan(0);
        });

        it(`${fourth} < ${first}`, function() {
            expect(compare(fourth, first)).toBeLessThan(0);
        });

        it(`${second} < ${third}`, function() {
            expect(compare(second, third)).toBeLessThan(0);
        });

        it(`${fifth} < ${first}`, function() {
            expect(compare(fifth, first)).toBeLessThan(0);
        });

        it(`${sixth} < ${fifth}`, function() {
            expect(compare(sixth, fifth)).toBeLessThan(0);
        });

        it(`${retina} < ${first}`, function() {
            expect(compare(retina, first)).toBeLessThan(0);
        });

        it(`${firstBare} < ${retina}`, function() {
            expect(compare(firstBare, retina)).toBeLessThan(0);
        });

        it(`${firstBare} < ${miDeviceWidth}`, function() {
            expect(compare(firstBare, miDeviceWidth)).toBeLessThan(0);
        });
    });

    describe('Multiple conditions', function() {
        const maxWidth40 = 'screen and (min-width: 20em) and (max-width: 40em)';
        const maxWidth30 = 'screen and (min-width: 20em) and (max-width: 30em)';
        const maxHeight40 = 'screen and (min-width: 20em) and (max-height: 40em)';
        const maxHeight30 = 'screen and (min-width: 20em) and (max-height: 30em)';
        const minHeight20 = 'screen and (min-width: 20em) and (min-height: 20em)';
        const minHeight30 = 'screen and (min-width: 20em) and (min-height: 30em)';

        it(`${maxWidth40} < ${maxWidth30}`, function() {
            expect(compare(maxWidth40, maxWidth30)).toBeLessThan(0);
        })
    });
});