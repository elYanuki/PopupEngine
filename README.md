# PopupEngine
Simple js libary that adds a PopupEngine class that can be used to create simple unstyled popups. Intended for use with my own projects.

**disclaimer: this libary is still a early beta and doesn't offer more than the most basic features**

## Initialization

Import the engine in your html's head `<script src='PopupEngine.js'></script>`.

Use `PopupEngine.init()` to create the html that the engine uses. The init function also accepts a optional config object whith the following settings:
- **doLogs**: controlls wheter or not the engine will output errors and information to the console.

You can test the success of the init by calling `PopupEngine.test()` in the console which will create a popup and check for simple errors with the generated html and log possible errors.

---

## Usage

Create a new popup using `PopupEngine.createPopup(settings)`. This function expects a single parameter which is a JSON object that has multiple optional values that allow you to customize the popup.
\
This function should only be called after initialization and after the DOM is loaded (defer in script tag or window.load listener).

### **text**
The actual text of the popup, this is one of the two essential settings which is why it defaults to "*no text specified*" when left blank. `text: "This is a popup text"`

### **heading**
Ads a heading to the popup, this is a optional parameter. `heading: "My popup"`

### **buttons**
This is the second essential setting, if left blank or not specified it will default to a "ok" button that will close the popup.
\
Expects a array of button objects which have the following possible settings:
- **text**: the text of the button
- **action**: a anonymous function which is called when the button is clicked. It can be left empty and the button will do nothing but close the popup.
\
The function will be called with a data parameter that will contain things like the values of the inputs in a `inputValues` array or the popups `text`.
- **closePopup**: optional value that controlls wheter or not the button should close the popup when clicked. Defaults to true.

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

### **inputs**

Expects a array of input objects which have the following possible settings:
- **type**: the type of the input, accepts all regular html types. **gotta be changed** Defaults to `"text"`
- **placeholder**: the html placeholder propperty of the input.
- **label**: creates a label for the input in the line above.

The values of these inputs will be part of the data paramter of the button actions. The values will be in an array in the same order as they are created.

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

### **returned Promise**
The `PopupEngine.createPopup()` function returns a promise which is resolved with a data object after the popup closes. This data object contains.
- the popup's `text`
- the popup's `heading`
- the popup's `buttons` and `inputs`
- the index of the button that was clicked `buttonIndex`
- when present, the values of the inputs `inputValues`

This can be used to only run further code when the popup is closed, add more functionality to the buttons, or work better with the entered data.

### **Example**
This example contains all currently available features of the engine
```JS
PopupEngine.init({doLogs: true})

PopupEngine.createPopup({
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

## Customization

For now you are supposed to config the libary by using the css classes
- **popupEngineContainer**: the container covering the whole screen and creating a backdrop using its background color
- **popupEngineContent**: the actual box that contains text and buttons
- **popupEngineButton**: the buttons, :nth-cild(1) beeing confrm and 2 beeing cancel
