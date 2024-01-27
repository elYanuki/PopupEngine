# **PopupEngine** <!-- omit from toc -->
Simple js libary that adds a PopupEngine class that can be used to create simple unstyled popups. Intended for use with my own projects.

Styles can easily be added to the popups by using the css classes that are automatically assigned to all the elements.

A typescript version of this tool is now available. It has the same functionality but is not yet propperly typed everywhere.

- [Initialization](#initialization)
- [Modal](#modal)
	- [Settings](#settings)
		- [Text](#text)
		- [Heading](#heading)
		- [Buttons](#buttons)
		- [Inputs](#inputs)
	- [Returned promise](#returned-promise)
	- [Example](#example)
- [Inline](#inline)
	- [Create via JS](#create-via-js)
	- [Example](#example-1)
- [Notification](#notification)
	- [Settings](#settings-1)
		- [Text](#text-1)
		- [Heading](#heading-1)
		- [Position](#position)
		- [Life Time](#life-time)
		- [CSSClass](#cssclass)
	- [createNotification return value](#createnotification-return-value)
	- [Example](#example-2)
- [Customization](#customization)


# Initialization

Download the engine and inport it in your html's head `<script src='PopupEngine.js'></script>`.
\
If you are using typescript download the ts version and `import` it.

Use `PopupEngine.init()` to create the html that the engine uses. The init function also accepts a optional config object with the following settings:

- `doLogs` controlls wheter or not the engine will output errors and information to the console.
- `preferedInlinePopupPosition` the prefered position for the inline popup to appear. Either at the "bottom" or "top" of the hovered element or the mouse. Defaults to "top"
- `defaultInlinePopupDelay` the time it takes for a inline popup to appear (how long the element has to be hovered). Defaults to 0.
- `textColor` font color of all text
- `backgroundColor` background color of the popups
- `elemBackground` backgroundcolor of elements like buttons and inputs
- `notificationOffset` the offset of all the notifications from the sides. Expects a JSON objects that defaults to: `{top: "1vw", bottom: "1vw", left: "1vw", right: "1vw"}`
- `notificationOffsetPhone` the top and bottom offsets of the notifications on mobile mode, default to: `{top: "1vh", bottom: "1vh"}`
- `defaultNotificationLifetime` the time in milliseconds after which a notfication will disappear, defaults to 5000
- `phoneBreakpoint` if the screens width gets smaller than this, the engine will create all new notifications for mobile

You can test the success of the init by calling `PopupEngine.test()` in the console which will create a modal and check for simple errors with the generated html and log possible errors.

# Modal

The whole modal is a fixed element with z-index 1000 that will overlay the whole page.
\
It uses the css class `popupEngineModalContainer` for the fullscreen background container and `popupEngineModalContent` for only the modal box itself.

**Create a new modal** using `PopupEngine.createModal(settings)`. This function expects a single parameter which is a JSON object that has multiple optional values that allow you to customize the modal.
\
This function should only be called after initialization and after the DOM is loaded (defer in script tag or window.load listener).

## Settings
The create function accepts the following settings:

### Text
The actual text of the modal, this is one of the two essential settings which is why it defaults to "*no text specified*" when left blank. `text: "This is a popup text"`

CSS class: `popupEngineModalText`

### Heading
Adss a heading to the modal, this is a optional parameter. `heading: "My modal"`

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

## Returned promise
The `PopupEngine.createModal()` function returns a promise which is resolved with a data object after the modal closes. This data object contains.
- the modal's `text`
- the modal's `heading`
- the modal's `buttons` and `inputs`
- the index of the button that was clicked `buttonIndex`
- when present, the values of the inputs `inputValues`

This can be used to only run further code when the modal is closed, add more functionality to the buttons, or work better with the entered data.

## Example
This example contains all currently available features of modals
```JS
PopupEngine.init()

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

# Inline

The Inline popup is a small box that appears on hover over specified elems. The div is absolutely positioned and has a z-index of 999. The popup will appear over of the text per default but pop down if obstructed or changed in the [Initialization](#initialization) config. 
\
It will also add a `popupVisible` class to whichever element is currently hovered so that you can style it if needed. 

The intended way to create these popups is by adding `data-popup-text` to any html element. The engine will read this attribute and add a hover event that creates a popup. In adition to the text you can also specify:
- `data-popup-heading` the heading .-.
- `data-popup-delay` a delay after which the popup will appear aka the time the elem has to be hovered until the popup appears. Defaults to the `defaultPopupDelay` value specified in the [Initialization](#initialization) config or 0 if not set.
- `data-create-popup` wheter or not the engine should create a popup for this tag. This way you could add your own ways to open this popup while still using the same data names or disable the popup. Should either be "true" or "false".

**disclaimer**
The engine will overwrite the onmouseenter property of all the elements.

## Create via JS

You can also create a inline popup by calling `PopupEngine.createInlinePopup(settings)`. This will create a inline just like if a elemnt was hovered but you can specifie all settings just like with the modals. The settings param is a JSON object that expects:
- a `position` this is either a element or the mouse event that you get from a event listener. The created popup will be alligned to it.
- the `text` of the popup. Defaults to "no text specified".
- optionally a `heading` for the popup.
- optionally a `element` to which the `popupVisible` class will be added.

To close this popup again just call `PopupEngine.closeInlinePopup()`

*register popup maybe?*

## Example
HTML
```HTML
<p data-popup-heading="hello world" data-popup-text="hey whats poppin" data-popup-delay="300" style="width: fit-content;">hover me</p>
<p data-popup-text="Is a cool guy" data-create-popup="false" id="userName">click me</p>
```
JavaScript
```JS
PopupEngine.init()

//only neccessary if you want to create a popup yourself like here.
let userNameElem = document.querySelector('#userName')
let closeTimeout

userNameElem.addEventListener("click", (event)=>{
	PopupEngine.createInlinePopup({
		position: event, 
		element: userNameElem, 
		text: userNameElem.dataset.popupText, 
		heading: "Stevan"
	})
	
	clearTimeout(closeTimeout)
	closeTimeout = setTimeout(function(){
		PopupEngine.closeInlinePopup()
	},1000)
})
```

# Notification

The Notification is a small text only box that appears in a corner to notify the user of something. The divs have position fixed and a z-index of 999. The position of these notifications can be controlled when creating them, if there is mutliple in the same spot they will stack on bellow each other. Notifications will disappear after a specified time or by using the "x" button.
\
Every created Notification will have the CSS class: `popupEngineNotification`

If the screens width is below a specified breakpoint the notifications will adopt a mobile mode. here the xAxis will be igonored and all new Notifications will either be placed at the top of the screen or the bottom.

The Notifications are not designed to adapt to spontaneous screen size changes so old Notifications will stay in their respective corners and look bad on the new mobile mode.. (if anyone actually needs this open a issue and I will implement this behaviour).

For changing the exact offsets of the preconfigured positions, what screen sizes count as mobile and the default lifetime check the [Initialization](#initialization).

**Create a notification** using `PopupEngine.createNotification(settings)`. This function expects a single parameter which is a JSON object that has multiple optional values that allow you to customize the modal.
\
This function should only be called after initialization and after the DOM is loaded (defer in script tag or window.load listener).

## Settings

The create function accepts the following settings:

### Text
The actual text of the notification it defaults to "*no text specified*" when left blank. `text: "This is a notification"`

CSS class: `popupEngineNotificationText`

### Heading
Adds a heading to the modal, this is a optional parameter. `heading: "My notification"`

CSS class: `popupEngineNotificationHeading`

### Position
This setting controlls where the notification will appear, it expects a array that has a xAxis value (left, center or right) and a yAxis value(top or bottom). The order of these is not important, if its not specified the position will default to top left. `position: ["top", "right"]`

### Life Time
Controlls after how many milliseconds the notification will disappear. Set this to -1 and the notification will never disappear. When not specified this setting will default to the `defaultNotificationLifetime` config. `lifetime: 10_000`

### CSSClass
Either a string or array of strings of CSS classes that will be added to the notification in adition to the `popupEngineNotification` class. This can be used to style specific notifications differently like errors, warnings and infos. `CSSClass: ["info", "important"]`

## createNotification return value

The create function will return a reference to the created popup in case you want to change the notification´s content or style. This reference can also be passed to the `PopupEngine.closeNotification(notification)` function and the Notification will be removed.

## Example

```JS
PopupEngine.init()

function create(){
	PopupEngine.createNotification({
		text: "im notifying you of something",
	})
	PopupEngine.createNotification({
		text: "hey i will exist forever",
		position: ["bottom", "left"], 
		lifetime: -1,
		CSSClass: "test"
	})
	let noti = PopupEngine.createNotification({
		text: "i would exist for 10 sec but disappear after 3",
		lifetime: 10_000,
		position: ["top", "center"],
		CSSClass: ["hello", "world"]
	})
	setTimeout(function(){
		PopupEngine.closeNotification(noti)
	},3000)
}
```

# Customization
For general configuration see the [Initialization](#initialization).

Every element created by the Engine has a css class assigned to it and uses css variables defined in the `:root{}` section, to edit these variables change the following options in the config when [initializing](#initialization).
- `textColor`
- `backgroundColor` background color of the popups
- `elemBackground` backgroundcolor of elements like buttons and inputs

The engine creates its own css file and uses a `:where()` selector that should give everything a specificity of 0 and therefore allow it to be overwritten. I have tested this in all major browsers, if you still run into problems just add `body ` or anything that increases specificity before your selector.

The css classes are listed in each of their sections above.
