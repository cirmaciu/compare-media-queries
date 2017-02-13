# compare-media-queries
Opinionated sorting function. Originaly made to be used in mqpacker sort function.

*This function evaluates only first media query.* It can't compare additional queries separated by comma.

**Warning:** You have to take into account that sorting media queries in CSS can produce unintended results.

## Usage
```javascript
import compare from 'compare-media-queries';

compare(a, b, options);
```
Returns numbers as required by `Array.prototype.sort()`.

### Parameters
| Parameter  | Type    | Description                              |
| ---------- | ------- | ---------------------------------------- |
| `a`        | string  | *required* First media query             |
| `b`        | string  | *required* Second media query            |
| `options`  | object  | Options                                  |

### Options
Function uses two objects to evaluate weight of media query.

#### `weights`
Object containing weights for different parts of media query. You can efectively change sorting rules by providing different weights.

Defaults:
```javascript
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
```

`unknown` is used for every unknown rule

#### `units`
`units` are used for value conversion. For example `10px` will became `10`, `10em` will became `160` etc.

You can provide rules for unknown units.

Defaults:
```javascript
const defaultUnits = {
    ch: 8.8984375,
    em: 16, 
    rem: 16,
    ex: 8.296875,
    px: 1,
    dppx: 1,
    dpi: 1
}
```

## Rules
Default weights are for mobile-first sorting and are calculated based on following order
- Media types: `all` | `unspecified`, `screen`, `print`, other types
- Modifiers: `min`, `max`
- Features: `width`, `height`, `resolution`, other
- Values: ascending order

If specifity is same for both queries, values are compared. If modifier `max` is used, values are sorted in descending order.