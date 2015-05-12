Color Picker
===========

**Download source code: [ZIP file](https://github.com/peteroupc/colorpicker/archive/master.zip)**

If you like this software, consider donating to me at this link: [http://upokecenter.dreamhosters.com/articles/donate-now-2/](http://upokecenter.dreamhosters.com/articles/donate-now-2/)

----

A color picker in JavaScript. Supports adapters for integrating other popular color pickers, and can use native color selection controls. In the public domain under CC0.

## Demo

See: [http://peteroupc.github.io/colorpicker/demo.html](http://peteroupc.github.io/colorpicker/demo.html)

The homepage is: [http://peteroupc.github.io/colorpicker](http://peteroupc.github.io/colorpicker)

## How to use:

In general, include the scripts "cbox.js" and "objlib.js" to your HTML:

    <script type="text/javascript" src="objlib.js"></script>
    <script type="text/javascript" src="cbox.js"></script>

When the page is ready, it will convert certain textboxes into color pickers:

* Textboxes with IDs or class names starting with "color_". and input elements with type "color", will be converted into normal color pickers.
* Textboxes with IDs or class names starting with "rgbahex_" will be converted into alpha color pickers that use the color format RRGGBBAA, with no "#" character, and with hexadecimal components.
* Textboxes with IDs or class names starting with "argbhex_" will be converted into alpha color pickers that use the color format AARRGGBB, with no "#" character, and with hexadecimal components.
* Textboxes with IDs or class names starting with "acolor_" will be converted into alpha color pickers.

For more advanced features, use the following functions.

## Available Functions

PDColorPicker.setColorPicker( _input_, _extra_) - sets up a color picker for the given textbox. The
_input_ parameter is the HTML element for the input text box. The _extra_ parameter takes the following keys:

1. usealpha - whether this color picker should use the alpha channel or not.
2. info - the color model used. If null, the default color model is used, which is initially `PDColorPicker.HueSatVal`.
3. flat - if true, shows the color selection control in-line rather than in the form of a text box and button. Default is false.

4. rgbahex - if true, the color format used is RRGGBBAA, with hexadecimal components.
5. argbhex - if true, the color format used is AARRGGBB, with hexadecimal components.
PDColorPicker.getDefaultColorModel() - gets the default color model used by the color picker.
The model is a JavaScript object with the following keys:

* fromrgbcolor - a function that takes an RGB color as an input and returns a converted form
of the color as output. The RGB color is a three-element array consisting of the red (0-255), green (0-255), and blue (0-255) components.
* torgbcolor - a function that takes a converted form of the color and returns an RGB color.
* maxes - an array containing maximum values for each component of the converted color.
* reversed - an array containing boolean values for each component of the converted color. Each value indicates whether the value goes down to up in the display rather than up to down.
* indexes - an array that determines which axes of the display correspond to which color component. 0 refers to the X-axis, 1 to the Y-axis, and 2 to the sidebar.

Two color models are included: `PDColorPicker.HueLumSat` and `PDColorPicker.HueSatVal`.

PDColorPicker.setDefaultColorModel() - sets the default color model used by the color picker.

PDColorPicker.getColorChangeEvent().add( _handler_ ) - adds a function to call when a color picker's color changes. The function takes two parameters: a four-element array representing the color
(red/green/blue/alpha, each 0-255) and the HTML element (the text box) whose value changed.

PDColorPicker.getColorChangeEvent().remove( _handler_ ) - removes an event handler for a color change event.

PDColorPicker.getColorPreviewEvent().add( _handler_ ) - adds a function to call when a color picker's color is being previewed. The function takes the same parameters as for color change events.

PDColorPicker.getColorPreviewEvent().remove( _handler_ ) - removes an event handler for a color preview event.

PDColorPicker.addColorPickerAdapter( _handler_, _extra_ ) - adds a function to call when setting up a color picker. This is used mainly to support third-party JavaScript color pickers; the
function should include code that links the text box with the third-party color picker. If this function returns true, the code was linked to the third-party color picker
successfully. The _input_ parameter is the HTML element for the input text box. The _extra_ parameter takes the following keys:

1. usealpha - whether this color picker should use the alpha channel or not.
2. info - the color model used.
3. flat - if true, shows the color selection control in-line rather than in the form of a text box and button.
4. rgbahex - if true, the color format used is RRGGBBAA, with hexadecimal components.
5. argbhex - if true, the color format used is AARRGGBB, with hexadecimal components.

**The following methods are generally only useful when making color picker adapters:**

PDColorPicker.createColorPickerButton( _input_, _extra_ ) - adds a color picker button next to the color text box. This is a helper function used within functions called via `addColorPickerHandler()`.
_input_ and _extra_ have the same meaning as in ` addColorPickerAdapter()`. Returns the HTML element for the button just added.

PDColorPicker.doColorChange( _input_, _extra_, _button_) - triggers the color change event, using the current value of the color text box.
_input_ and _extra_ have the same meaning as in ` addColorPickerAdapter()`. `button` should be the button returned from `createColorPickerButton`.

PDColorPicker.doColorPreview( _input_, _extra_, _button_ ) - triggers the color preview event, using the current value of the color text box.
_input_ and _extra_ have the same meaning as in ` addColorPickerAdapter()`. `button` should be the button returned from `createColorPickerButton`.

## History

Version 1.0

- First CodeProject release

## Server-Side Processing

Every form sent to the server should be validated on the server side. The color boxes accept a wide variety of values for
colors, which need to be validated and converted to a common format. Use the server-side scripts in another of my projects:

[https://github.com/peteroupc/colorvalidator](https://github.com/peteroupc/colorvalidator)

That project contains scripts for five popular server-side languages: PHP, Python, Ruby, C#, and Java. These scripts are
also released to the public domain.

About
-----------

Written in 2012-2015 by Peter O.

Any copyright is dedicated to the Public Domain.
[http://creativecommons.org/publicdomain/zero/1.0/](http://creativecommons.org/publicdomain/zero/1.0/)

If you like this, you should donate to Peter O.
at: [http://upokecenter.dreamhosters.com/articles/donate-now-2/](http://upokecenter.dreamhosters.com/articles/donate-now-2/)
