# PopupEngine <!-- omit from toc -->
Simple js libary that adds a PopupEngine class that can be used to create simple unstyled popups. Intended for use with my own projects.

- [Initialization](#initialization)
- [Modal](#modal)
	- [Text](#text)
	- [Heading](#heading)
	- [Buttons](#buttons)
	- [Inputs](#inputs)
	- [Returned promise](#returned-promise)
	- [Example](#example)
- [Inline](#inline)
	- [Create via JS](#create-via-js)
	- [Example](#example-1)
- [Customization](#customization)


## Initialization

Download the engine and inport it in your html's head `<script src='PopupEngine.js'></script>`.

Use `PopupEngine.init()` to create the html that the engine uses. The init function also accepts a optional config object whith the following settings:
- **doLogs**: controlls wheter or not the engine will output errors and information to the console.
- **preferedInlinePopupPosition**: the prefered position for the inline popup to appear. Either at the "bottom" or "top" of the hovered element or the mouse. Defaults to "top"
- **defaultPopupDelay**: the time it takes for a inline popup to appear (how long the element has to be hovered). Defaults to 0.

You can test the success of the init by calling `PopupEngine.test()` in the console which will create a modal and check for simple errors with the generated html and log possible errors.

---

## Modal

The whole modal is a fixed element with z-index 1000 that will overlay the whole page.

Create a new modal using `PopupEngine.createModal(settings)`. This function expects a single parameter which is a JSON object that has multiple optional values that allow you to customize the modal.
\
This function should only be called after initialization and after the DOM is loaded (defer in script tag or window.load listener).

### Text
The actual text of the modal, this is one of the two essential settings which is why it defaults to "*no text specified*" when left blank. `text: "This is a popup text"`

CSS class: `popupEngineModalText`

### Heading
Ads a heading to the modal, this is a optional parameter. `heading: "My modal"`

CSS class: `popupEngineModalHeading`

### Buttons
This is the second essential setting, if left blank or not specified it will default to a "ok" button that will close the modal.
\
Expects a array of button objects which have the following possible settings:
- **text**: the text of the button
- **action**: a anonymous function which is called when the button is clicked. It can be left empty and the button will do nothing but close the modal.
\
The function will be called with a data parameter that will contain things like the values of the inputs in a `inputValues` array or the modal's `text`.
- **closePopup**: optional value that controlls wheter or not the button should close the modal when clicked. Defaults to true.

The div containing the buttons has the `popupEngineModalButtons` class and every individual button has the `popupEngineModalButton` class.

```JS
buttons: [
	{
		text: "confirm",
		action: (data) = {
			console.log("confirmed: " + data.text);
		},
		closePopup: true
	},
	{
		text: "cancel"
	}
]
```

### Inputs

Expects a array of input objects which have the following possible settings:
- **type**: the type of the input, accepts all regular html types. **gotta be changed** Defaults to `"text"`
- **placeholder**: the html placeholder propperty of the input.
- **label**: creates a label for the input in the line above.

The values of these inputs will be part of the data paramter of the button actions. The values will be in an array in the same order as they are created.

CSS classname of the div containing all inputs: `popupEngineModalInputs`. Each input has the `popupEngineModalInput` class and every label has the `popupEngineModalInputLabel` class.

```JS
inputs: [
	{
		type: "text",
		placeholder: "yanik",
		label: "name"
	},
	{
		type: "number",
	},
	{} //will default to type "text"
]
```

### Returned promise
The `PopupEngine.createModal()` function returns a promise which is resolved with a data object after the modal closes. This data object contains.
- the modal's `text`
- the modal's `heading`
- the modal's `buttons` and `inputs`
- the index of the button that was clicked `buttonIndex`
- when present, the values of the inputs `inputValues`

This can be used to only run further code when the modal is closed, add more functionality to the buttons, or work better with the entered data.

### Example
This example contains all currently available features of modals
```JS
PopupEngine.init({doLogs: true})

PopupEngine.createModal({
	heading: "my popup",
	text: "please enter your name and age",
	inputs: [
		{
			type: "text",
			placeholder: "name",
		},
		{
			label: "age",
			type: "number", 
		}
	],
	buttons: [
		{
			text: "confirm",
			action: (data) => {console.log(data.inputValues[0], data.inputValues[1])},
			closePopup: true
		},
		{
			text: "cancel",
		},
	]
}).then((data)=>{
	console.log("continuing with data name:", data.inputValues[0], "age: ", data.inputValues[1])
})
```

---

## Inline

The Inline popup is a small box that appears on hover over specified elems. The div is absolutely positioned and has a z-index of 999. The popup will appear over of the text per default but pop down if obstructed or changed in the [Initialization](#initialization) config. 
\
It will also add a `popupVisible` class to whichever element is currently hovered so that you can style it if needed. 

The intended way to create these popups is by adding `data-popup-text` to any html element. The engine will read this attribute and add a hover event that creates a popup. In adition to the text you can also specify:
- `data-popup-heading` the heading .-.
- `data-popup-delay` a delay after which the popup will appear aka the time the elem has to be hovered until the popup appears. Defaults to the `defaultPopupDelay` value specified in the [Initialization](#initialization) config or 0 if not set.
- `data-create-popup` wheter or not the engine should create a popup for this tag. This way you could add your own ways to open this popup while still using the same data names or disable the popup. Should either be "true" or "false".

**disclaimer**
The engine will overwrite the onmouseenter property of all the elements.

### Create via JS

You can also create a inline popup by calling `PopupEngine.createInlinePopup(settings)`. This will create a inline just like if a elemnt was hovered but you can specifie all settings just like with the modals. The settings param is a JSON object that expects:
- a `position` this is either a element or the mouse event that you get from a event listener. The created popup will be alligned to it.
- the `text` of the popup. Defaults to "no text specified".
- optionally a `heading` for the popup.
- optionally a `element` to which the `popupVisible` class will be added.

To close this popup again just call `PopupEngine.closeInlinePopup()`

*register popup maybe?*

### Example
Create Popups via HTML
```HTML
<p data-popup-heading="hello world" data-popup-text="hey whats poppin" style="width: fit-content;" data-popup-delay="300">hover me</p>
<p data-popup-text="Is a cool guy" data-create-popup="false" id="userName">click me</p>
```
Create Popups via JS
```JS
let userNameElem = document.querySelector('#userName')
let closeTimeout

userNameElem.addEventListener("click", (event)=>{
	PopupEngine.createInlinePopup({position: event, element: userNameElem, text: userNameElem.dataset.popupText , heading: "Stevan"})
	
	clearTimeout(closeTimeout)
	closeTimeout = setTimeout(function(){
		PopupEngine.closeInlinePopup()
	},1000)
})
```

---

## Customization
For general configuration see the [Initialization](#initialization).

Every element created by the Engine has a css class assigned to it and uses css variables defined in the `:root{}` section.
The engine creates its own css file and uses a `:where()` selector that should give everything a specificity of 0 and therefore allow it to be overwritten. I have tested this in all major browsers, if you still run into problems just add `body .popupEngineSelector{}`.

The css classes are listed in the usage section above.
The following variables are available: 
- `--popupEngine-background-color`
- `--popupEngine-color`