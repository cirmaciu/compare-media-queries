# compare-media-queries
Opinionated sorting function. Originaly made to be used in mqpacker sort function.

This function evaluates only first rule of first media query. It can't compare queries with several conditions or multiple queries separated by comma yet.

## Syntax
`compare(a, b, options);`

### Parameters
| Parameter  | Type    | Description                              |
| ---------- | ------- | ---------------------------------------- |
| `a`        | string  | First media query                        |
| `b`        | string  | Second media query                       |
| `options`  | object  | Options                                  |

### Options
Function uses two objects to evaluate weight of media query.

#### `weights`
Object containing weights for different parts of media query. You can efectively change sorting rules by providing different weights.

Defaults:
```
{
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
`units` are used for value evaluation. For example `10px` will became `10`, `10em` will became `160` etc.

You can provide rules for unknown units.

Defaults:
```
{
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
Function calculates specifity for media query using predefined weights.
- Media types (in this order): `all`, `screen`, `print`, other types
- Modifiers: `min`, `max`
- Features: `width`, `height`, `resolution`, other

If specifity is same for both queries, values are compared.

## Future
- evaluate multiple conditions in query