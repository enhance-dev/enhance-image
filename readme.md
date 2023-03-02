# enhance-image

**This is a pre-release version of the Enhance image component and is not intended for production usage.**

An initial pass at [the proposed Enhance image component](https://github.com/enhance-dev/enhance.dev/pull/115). This first version uses a simpler API than the one specified in the linked proposal, in order to get this component functional for internal projects. We’ll reexamine the desired API for end users at a later date.

## Usage

### Attributes
| Name | Value |
|---|---|
| `src` | The path of your source image; should like start with `/_public/…` |
| `alt` | The alternative text for the image |
| `defaultwidth` | The default width for your generated image |
| `variant<N>` | The media query to render the variant for, and the desired width/height in pixels for the generated image |
| `loading` | Optional loading strategy for the image; either `'lazy'` or `'eager'` (the default option) |
| `focalpoint` | Optional focal point for the image (default 50% x, 50% y) |
| `mark` | Optional adds a crosshair to the image so you can visually see your focal point |

Variants will be rendered as `<source>` elements in the order they are declared on the custom element. The first `source` element with a matching media query is the one that the browser will use, so be careful to enumerate your variants in the correct order.

### Example

```html
<enhance-image
  src='kitten.jpg'
  alt='A picture of a cuddly li’l kitten'
  defaultwidth='400'
  variant1='(min-width: 90em) 1200'
  variant2='(min-width: 40em) 600'
  loading='lazy'
></enhance-image>
```

### Example with cropping

```html
<enhance-image
  src='kitten.jpg'
  alt='A picture of a cuddly li’l kitten'
  defaultwidth='400'
  variant1='(min-width: 90em) 2500 400'
  variant2='(min-width: 40em) 1440 700'
  focalpoint='25,60'
  mark
  loading='lazy'
></enhance-image>
```

## Temporary Installation Instructions


Install plugin and dependencies:

```bash
npm i @enhance/image
```

Update your `.arc` file to include the image plugin:

```
@plugins
enhance/arc-image-plugin
```

Create `app/elements/enhance-image.mjs` file with the following contents:

```javascript
import EnhanceImage from '@enhance/image'
export default EnhanceImage
```

Profit 💰
