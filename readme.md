# enhance-image

This is an initial pass at [the proposed Enhance image component](https://github.com/enhance-dev/enhance.dev/pull/115). This first version uses a simpler API than the one specified in the linked proposal, in order to get this component functional for internal projects. We’ll reexamine the desired API for end users in the new year.

## Usage

### Attributes

| - | - |
| src | The path of your image, relative to the `public` directory |
| alt | The alternative text for the image |
| defaultwidth | The default width for your generated image |
| variant<N> | The media query to render the variant for, and the desired width in pixels for the generated image |

Variants will be rendered as `<source>` elements in the order they are declared on the custom element. The first `source` element with a matching media query is the one that the browser will use, so be careful to enumerate your variants in the correct order.

### Example

```html
<enhance-image
  src='kitten.jpg'
  alt='Who doesn’t love a kitten?'
  defaultwidth='400'
  variant1='(min-width: 90em) 1200'
  variant2='(min-width: 40em) 600'
></enhance-image>
```
