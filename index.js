const mediaQuery = require('css-mediaquery');

const defaultWeights = {
    types: {
        all: 1000,
        screen: 2000,
        print: 3000,
        unknown: 9000
    },
    modifiers: {
        min: 100,
        max: 200,
        unknown: 900
    },
    features: {
        blank: 10,
        width: 20,
        height: 30,
        resolution: 40,
        unknown: 90
    }
}

const defaultUnits = {
    ch: 8.8984375,
    em: 16, 
    rem: 16,
    ex: 8.296875,
    px: 1,
    dppx: 1,
    dpi: 1
}

function getWeight(data, weights) {
    let weight = 0;
    const { type, feature, modifier } = data;
    const { types, features, modifiers } = weights;

    weight += types[type] || types.unknown;
    if (modifier || feature) {
        weight += modifiers[modifier] || modifiers.unknown;
        weight += features[feature || 'blank'] || features.unknown;
    }

    return weight;
}


function convertValue(length, units) {
    var num;
    var unit;
    length = new RegExp(`(-?\\d*\\.?\\d+)(${Object.keys(units).join('|')})`).exec(length);

    if (!length) {
        return Number.MAX_SAFE_INTEGER;
    }

    num = length[1];
    unit = length[2];

    if (unit in units) {
        num = parseFloat(num) * units[unit];
    }

    return num;
}

function compare(a, b, options = {}) {
    const weights = Object.assign({}, defaultWeights, 'weights' in options ? option.weights : {});
    const units = Object.assign({}, defaultUnits, 'units' in options ? options.units : {});

    let mqA = mediaQuery.parse(a)[0];
    let mqB = mediaQuery.parse(b)[0];

    // just type defined
    if (mqA.expressions.length === 0) {
        mqA.expressions.push({
            type: mqA.type,
            modifier: null,
            feature: null,
            value: 0
        });
    }

    if (mqB.expressions.length === 0) {
        mqB.expressions.push({
            type: mqB.type,
            modifier: null,
            feature: null,
            value: 0
        });
    }

    mqA.expressions.forEach(expression => {
        expression.type = mqA.type;
        expression.value = convertValue(expression.value, units);
        expression.weight = getWeight(expression, weights);
    });

    mqB.expressions.forEach(expression => {
        expression.type = mqB.type;
        expression.value = convertValue(expression.value, units);
        expression.weight = getWeight(expression, weights);
    });

    let i = 0;
    const last = Math.max(mqA.expressions.length, mqB.expressions.length) - 1;

    while (i <= last) {
        const expA = mqA.expressions[i] || null;
        const expB = mqB.expressions[i] || null;

        // different lengths
        if (!expA || !expB) {
            return mqA.expressions.length - mqB.expressions.length;
        }
        
        // different weights, terminate immediatly
        if (expA.weight !== expB.weight) {
            return expA.weight - expB.weight;
        }

        // not last index, same conditions different values
        // move to next index if values are equal
        if (i !== last && expA.weight === expB.weight && expA.value !== expB.value) {
            if (expA.modifier === 'max') {
                return expB.value - expA.value;
            } else {
                return expA.value - expB.value;
            }
        }

        // last index, value evaluation
        if (i === last && expA.weight === expB.weight) {
            if (expA.modifier === 'max') {
                return expB.value  - expA.value;
            } else {
                return expA.value - expB.value;
            }
        }

        i++;
    }
}

module.exports = compare;