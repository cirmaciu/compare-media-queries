var mediaQuery = require('css-mediaquery');

const weights = {
    types: {
        all: 1000,
        screen: 2000,
        print: 3000,
        undef: 9000
    },
    features: {
        blank: 100,
        width: 200,
        height: 300,
        undef: 900
    },
    modifiers: {
        min: 10,
        max: 20,
        undef: 90
    }
}

function getWeight(data) {
    let weight = 0;
    const { type, feature = 'blank', modifier } = data;
    const { types, features, modifiers } = weights;

    weight += types[type] || types.undef;
    weight += features[feature] || features.undef;
    weight += modifiers[modifier] || modifiers.undef;

    return weight;
}


function inspectLength(length) {
    var num;
    var unit;
    length = /(-?\d*\.?\d+)(ch|em|ex|px|rem)/.exec(length);

    if (!length) {
        return Number.MAX_VALUE;
    }

    num = length[1];
    unit = length[2];

    switch (unit) {
        case "ch":
            num = parseFloat(num) * 8.8984375;
        break;

        case "em":
        case "rem":
            num = parseFloat(num) * 16;
        break;

        case "ex":
            num = parseFloat(num) * 8.296875;
        break;

        case "px":
            num = parseFloat(num);
        break;
    }

    return num;
}

function mqpackerSort(a, b) {
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
        expressionA.value = inspectLength(expressionA.value);
        Object.assign(sortA, expressionA);
    }

    if (expressionB) {
        expressionB.value = inspectLength(expressionB.value);
        Object.assign(sortB, expressionB);
    }

    // calculate weights
    const weightA = getWeight(sortA);
    const weightB = getWeight(sortB);

    if (weightA === weightB) {
        if (sortA.modifier === 'max') {
            return sortB.value - sortA.value;
        } else {
            return sortA.value - sortB.value;
        }
    }

    return weightA - weightB;
}

module.exports = mqpackerSort;