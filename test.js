PopupEngine.init({doLogs: true})

PopupEngine.createPopup({
	heading: "my popup",
	text: "please enter your name and age",
	inputs: [
		{
			type: "text",
			placeholder: "yanik",
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