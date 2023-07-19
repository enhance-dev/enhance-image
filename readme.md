# enhance-image

Enhance Image is a Single File Component (SFC) for [Enhance](https://enhance.dev) that makes authoring responsive images easy, by providing a simple component API backed by a powerful image transformation and delivery service.

## Background

Responsive images are a critical aspect of responsive web design and development. They offer critical performance improvements by delivering appropriately sized images to a range of device resolutions and viewport sizes so that, for example, a mobile phone doesn't waste time and bandwidth downloading an image sized for a widescreen monitor.

Implementing responsive images, however, can be challenging. Preparing multiple variants of images can be tedious and time consuming, and the web platform APIs for using responsive images in the browser can be tough to wrap your head around. This is where Enhance Image comes in. By combining a simple custom element interface with a powerful on-demand image transformer, it saves time on image preparation and reduces the overhead of implementing responsive images correctly.

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

This will ensure that Enhance Image's image transformation service will be used in combination with the Enhance Image component.

### Configuration

The image transformation service works by taking a source image from your project and applying transformations based on size, image format, and image quality (for lossless formats). You can customize these parameters by adding an `@enhance-image` pragma to your project’s `.arc` file. For example:

```.arc
@enhance-image
widths
  2400
  1200
  800
format webp
quality 80
```

The above configuration will tell the image transformation service that, for every source image passed to the Enhance Image component, it should generate three variants: one at 2400px wide, one at 1200px wide, and one at 800px wide (while preserving your images' intrinsic aspect ratios). Each of those variants will be generated in the webp format, at a quality setting of 80%. (Coincidentally, the above configuration is the default for the image transformation service, and may be omitted if this works well enough for you.)

In more detail:

#### `widths` (optional)

The `widths` option takes an array of unitless integers (one per new line, indented by two spaces). A variant of your source image will be generated for every width specified, with a height corresponding to the source image's intrinsic aspect ratio. The image transformation service will *not* enlarge images, so a source image that is smaller than a specified width will be returned at its maximum instinsic width. The default widths are 2400, 1200, and 800.

#### `format` (optional)

The format option takes one of the following formats: `webp`, `avif`, `jpeg`, `png`, or `gif`. Generated images will be returned in the given format. `webp` is recommended for compatibility and performance, and is the default option. [Read more about image formats on the web here.](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)

#### `quality` (optional)

The quality setting takes a number between 0–100. Generated images will be returned with at the quality level specified. It's best to choose a quality level that results in the smallest possible file size without significant degradation in image quality — this can vary based on the content of the images being processed, and you may need to experiment a bit to find the best setting based on your content. The quality option defaults to 80.

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
<enhance-image src='/_public/dog.jpg' alt='My favorite dog'></enhance-image>
```

The SFC accepts a number of attributes, which are:

#### `src` TODO: FORCE IMAGE TO BE IN SPECIFIC DIR FOR PREWARMING, OR JUST FLAG DIR IN .ARC CONFIG?

The path to the source image in your project. As static assets in Enhance projects are stored in [the public directory](https://enhance.dev/docs/learn/starter-project/public), this path will likely start with `/_public/` (but this is not presumed, so don't forget to include it).

#### `alt`

A description of the image. For images that are purely decorative, this can be an empty string.

#### `sizes` (optional)

Comma separated list of source size descriptors, plus a fallback value. Each source size descriptor contains a media condition followed by a space and a source size value. The fallback value should not contain a media condition. For example, the value `(min-width: 40em) 1200px, 800px` will inform the browser that for viewports of at least `40em` wide, an image with a width of `1200px` is preferred; for all other viewports, an image with a width of `800px` is preferred. The browser will use this attribute to determine which of your generated images to use for the current media condition.

Note that the width given as a source size value cannot be specified as a %. They can, however, be specified as font relative units (`rem`, `em`, etc.) absolute units (`px`), or the `vw` unit. For further reading, see [MDN’s documentation on the `sizes` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes), or their [documentation of the `img` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).

#### `width` and `height` (optional)

Each of these attributes takes a unitless length which should describe the intrinsic (not the rendered) width and height of your source image. The browser will use this to compute the aspect ratio of your image, which will help to avoid [Cumulative Layout Shift](https://web.dev/cls/). While these attributes are optional, we highly recommend filling them in, as this will improve performance and user experience for end users.

## Examples

To follow
