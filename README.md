Color Picker
===========

Written by Peter O. in 2012. http://upokecenter.dreamhosters.com/

A color picker in JavaScript.  Supports adapters for integrating other popular color pickers, and can use native color selection controls.  In the public domain.

## Donate to me

If you like this, consider donating to me to help pay my loans and other costs:

http://upokecenter.dreamhosters.com/d

## How to use:

In general, include the scripts "cbox.js" and "objlib.js" to your HTML.  When the page is ready, it will convert certain textboxes into color pickers:

* Textboxes with IDs starting with "color_" will be converted into normal color pickers.
* Textboxes with IDs starting with "acolor_" will be converted into alpha color pickers.

For more advanced features, use the following functions.

## Available Functions

setColorPicker(_input_, _usealpha_, _info_) - sets up a color picker for the given textbox. The parameters are:

1. input - the HTML element for the input text box.
2. usealpha - whether this color picker should use the alpha channel or not
3. info - the color model used.  If null, the default color model is used.

getDefaultColorModel() - gets the default color model used by the color picker.
The model is a JavaScript object with the following keys:

* fromrgbcolor - a function that takes an RGB color as an input and returns a converted form
   of the color as output.  The RGB color is a three-element array consisting of the red (0-255), green (0-255), and blue (0-255) components.
* torgbcolor - a function that takes a converted form of the color and returns an RGB color.
* maxes - an array containing maximum values for each component of the converted color.
* reversed - an array containing boolean values for each component of the converted color. Each value indicates whether the value goes down to up in the display rather than up to down.
* indexes - an array that determines which axes of the display correspond to which color component. 0 refers to the X-axis, 1 to the Y-axis, and 2 to the sidebar.

Two color models are included: HueLumSat and HueSatVal.

setDefaultColorModel() - sets the default color model used by the color picker.

getColorChangeEvent().add( _handler_ ) - adds a function to call when a color picker's color changes. The function takes two parameters: a four-element array representing the color (red/green/blue/alpha) and the HTML element whose value changed.

getColorChangeEvent().remove( _handler_ ) - removes an event handler for a color change event.

getColorPreviewEvent().add( _handler_ ) - adds a function to call when a color picker's color is being previewed.  The function takes the same parameters as for color change events.

getColorPreviewEvent().remove( _handler_ ) - removes an event handler for a color preview event.

addColorPickerHandler( _handler_ ) - adds a function to call when setting up a color picker.  This is used mainly to support third-party JavaScript color pickers; the function should include code that links the text box with the third-party color picker.  If this function returns true, the code was linked to the third-party color picker successfully.  The function takes three parameters:

1. input - the HTML element for the input text box.
2. usealpha - whether this color picker should use the alpha channel or not
3. info - the color model used.

createColorPickerButton( _input_, _usealpha_ ) - adds a color picker button next to the color text box.  This is a helper function used within functions called via `addColorPickerHandler()`. _input_ and _usealpha_ have the same meaning as in ` setColorPicker()`.


