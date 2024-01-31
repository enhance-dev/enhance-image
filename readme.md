# enhance-image

Enhance Image is a Single File Component (SFC) for [Enhance](https://enhance.dev) that makes authoring responsive images easy, by providing a simple component API backed by an on-demand image transformation service.

- [Background](#background)
- [Usage](#usage)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Single File Component](#single-file-component)
- [Examples](#examples)
- [Usage notes](#usage-notes)
  - [`sizes` attribute](#sizes-attribute)
  - [Performance](#performance)
- [Roadmap](#roadmap)

## Background

Responsive images are an important aspect of responsive web design and development. They offer major performance improvements by delivering appropriately sized images to a range of device resolutions and viewport sizes so that, for example, a mobile phone doesn't waste time and bandwidth downloading an image sized for a widescreen monitor.

Implementing responsive images, however, can be challenging. Preparing multiple variants of images can be tedious and time consuming, and the web platform APIs for using responsive images in the browser can be tough to wrap your head around. This is where Enhance Image comes in. By combining a simple custom element interface with an on-demand image transformer, it saves time on image preparation and reduces the overhead of implementing responsive images correctly.

## Usage

### Installation

Install Enhance Image by running the following command in your Enhance project:
```shell
npm install @enhance/image
```

Then, add `enhance/arc-image-plugin` to your project’s `.arc` file, under the `@plugins` pragma:

```.arc
@plugins
enhance/arc-image-plugin
```

This enables Enhance Image’s image transformation service (which is used by the component).

### Configuration

The image transformation service works by taking a source image from your project and generating new variants of it by applying transformations based on size, image format, and image quality.

These configuration options can be specified in [your project's Preflight file](https://enhance.dev/docs/conventions/preflight), under the `plugins` key. For example:

```javascript
// app/preflight.mjs
export default async function Preflight ({ req }) {
  return {
    plugins: {
      '@enhance/image': {
        transform: {
          widths: [2400, 1200, 800],
          format: 'webp',
          quality: 80,
        },
      }
    }
  }
}
```

The above configuration will tell the image transformation service that, for every source image passed to the Enhance Image component, it should generate three variants: one at 2400px wide, one at 1200px wide, and one at 800px wide (while preserving your images' intrinsic aspect ratios). Each of those variants will be generated in the webp format, at a quality setting of 80%.

(Coincidentally, the above configuration is the default for the image transformation service, and may be omitted from your Preflight file if this works well enough for you.)

In more detail:

#### `widths` (optional)

The `widths` option takes an array of pixel widths, specified as unitless integers. A variant of your source image will be generated for every width specified, with a height corresponding to the source image's intrinsic aspect ratio. The default widths are 2400, 1200, and 800.

#### `format` (optional)

The format option takes one of the following format strings: `webp`, `avif`, `jpeg`, `png`, or `gif`. Generated images will be returned in the given format. `webp` is recommended for compatibility and performance, and is the default option. [Read more about image formats on the web here.](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)

#### `quality` (optional)

The quality setting takes a number between 0–100. Generated images will be returned at the quality level specified. It's best to choose a quality level that results in the smallest possible file size without significant degradation in image quality — this can vary based on the content of the images being processed, and you may need to experiment a bit to find the best setting based on your content. The quality option defaults to 80.

### Single File Component

To use the SFC, first import it from the package, and then re-export it to make it available to your app:

```js
// app/elements/enhance-image.mjs
import EnhanceImage from '@enhance/image'
export default EnhanceImage
```

You can then use the SFC in your pages and other elements, for example:

```html
<h1>My Favourite Dog</h1>
<enhance-image src="/_public/images/dog.jpg" alt="My favourite dog"></enhance-image>
```

The SFC accepts the following attributes:

#### `src`

The path to the source image in your project.

#### `alt`

A description of the image. For images that are purely decorative, this can be an empty string.

#### `sizes` (optional)

A comma separated list of source size descriptors, plus a fallback value.

Each source size descriptor contains:

- a media condition (e.g. `(min-width: 48em)`) followed by a space, and
- a source size value (a length describing *the width the image should occupy in the page*).

The fallback value should not contain a media condition.

The browser uses the `sizes` attribute to determine which of your generated images to use for the current media condition.

For example, the value `(min-width: 40em) 50vw, 100vw` will propose that for viewports of at least 40em wide, an image with a width suitable for occupying 50% of the viewport width is preferred; for all other viewports, an image with a width suitable to occupy the full viewport width should be used.

There are a few important caveats to keep in mind when using the `sizes` attribute — see the [usage notes](#usage-notes).

The `sizes` attribute has a default value of `100vw`.

#### `width` and `height` (optional)

Each of these attributes takes a unitless length which should describe the intrinsic (not the rendered) width and height of your source image. The browser will use this to compute the aspect ratio of your image, which will help to avoid [Cumulative Layout Shift](https://web.dev/cls/). While these attributes are optional, we highly recommend filling them in, as this will improve performance and user experience.

## Examples

### Basic usage

```html
<enhance-image
  src="/_public/images/dog.jpg"
  alt="My favourite dog"
></enhance-image>
```

Using only the required attributes, and presuming no custom configuration has been specified in your `.arc` file, this will result in the following:

- Transformations of your source image will be generated at 2400px, 1200px, and 800px wide
- Each generated image will be formatted as webp, with an 80% quality setting
- The browser will use whichever of these 3 generated images most closely fits the full width of the current viewport

### Providing `sizes`
```html
<enhance-image
  src="/_public/images/dog.jpg"
  alt="My favourite dog"
  sizes="(min-width: 48em) 50vw, 100vw"
></enhance-image>
```

Again presuming the default configuration is being used in this example, the browser will select the generated image closest to the given width `50vw` when the viewport is 48em or wider. At viewports narrower than 48em, the image closest to the full width of the current viewport will be used.

### Custom configuration

```javascript
// app/preflight.mjs
export default async function Preflight ({ req }) {
  return {
    plugins: {
      '@enhance/image': {
        transform: {
          widths: [1280, 1024, 720, 480, 375],
          quality: 75,
        }
      }
    }
  }
}
```

- Generated images will be available in widths of 1200px, 1024px, 720px, 480px, and 375px
- Each generated image will be formatted at 75% quality; as no `format` option has been specified, the default format (webp) will be used

```html
<enhance-image
  src="/_public/images/post-assets/dog.jpg"
  alt="My favourite dog"
  sizes="(min-width: 96em) 25vw, (min-width: 48em) 50vw, 100vw"
></enhance-image>
```

- At viewports at least 96em wide, the generated image closest to `25vw` in width will be used; at viewports between 48–95.9em wide, the generated image closest to `50vw` in width will be used; at viewports narrower than 48em, the image closest to the width of the current viewport will be used

## Usage notes

### `sizes` attribute

The `sizes` attribute used by Enhance Image is simply a proxy for [`HTMLImageElement.sizes`]. This `sizes` attribute, as specified by [the HTML living standard](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-sizes), can be tough to wrap your head around in certain cases. 

Below are several considerations to keep in mind when using `sizes`.

#### Order of media conditions

When multiple media conditions are listed, the first media condition that matches the viewport will be used, and all others will be ignored. Therefore, if using `min-width` media queries, these should be written in descending order, e.g. `(min-width: 72em) 25vw, (min-width: 48em) 50vw`. Conversely, `max-width` media queries should be written in ascending order.

#### Using pixel lengths

The viewport’s pixel density also factors into the browser’s image selection process. For high density displays, the browser may select a larger image than specified in the `sizes` array if the specified size would not be of a sufficient size to display in high quality for a given viewport and display.

- The widths given for source size values cannot be specified as a percent. They can, however, be specified as font relative units (`rem`, `em`, etc.), absolute units (`px`), or the `vw` unit.

For further details, see [MDN’s documentation on the `sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes), or their [documentation of the `img` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

The default value for the `sizes` attribute is `100vw`, which will propose that the browser choose an image size that will best fit the full width of the current viewport.

### Performance

You may notice a delay in loading a transformed image the first time it’s requested by your browser. This delay should only occur with the first request; subsequent requests should be cached and thus load much faster. We’re actively working on improving performance for image loading — see the roadmap below.

## Roadmap

The following updates are either planned or currently in active development:

- Update the image transformation service to pregenerate image transformations ahead of runtime to improve performance
- Private S3 bucket support

