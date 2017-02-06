var mediaQuery = require('css-mediaquery');

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

const defaultCoefs = {
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


function inspectLength(length, coefs) {
    var num;
    var unit;
    length = new RegExp(`(-?\\d*\\.?\\d+)(${Object.keys(coefs).join('|')})`).exec(length);

    if (!length) {
        return Number.MAX_VALUE;
    }

    num = length[1];
    unit = length[2];

    if (unit in coefs) {
        num = parseFloat(num) * coefs[unit];
    }

    return num;
}

function compare(a, b, options = {}) {
    const weights = Object.assign({}, defaultWeights, 'weights' in options ? option.weights : {});
    const coefs = Object.assign({}, defaultCoefs, 'units' in options ? options.units : {});

    let mqA = mediaQuery.parse(a)[0];
    let mqB = mediaQuery.parse(b)[0];

    let expressionA = mqA.expressions[0];
    let expressionB = mqB.expressions[0];

    let sortA = {
        type: mqA.type,
        modifier: null,
        feature: null,
        value: 0
    }

    let sortB = {
        type: mqB.type,
        modifier: null,
        feature: null,
        value: 0
    }

    if (expressionA) {
        expressionA.value = inspectLength(expressionA.value, coefs);
        Object.assign(sortA, expressionA);
    }

    if (expressionB) {
        expressionB.value = inspectLength(expressionB.value, coefs);
        Object.assign(sortB, expressionB);
    }

    // calculate weights
    const weightA = getWeight(sortA, weights);
    const weightB = getWeight(sortB, weights);

    if (weightA === weightB) {
        if (sortA.modifier === 'max') {
            return sortB.value - sortA.value;
        } else {
            return sortA.value - sortB.value;
        }
    }

    return weightA - weightB;
}

module.exports = compare;