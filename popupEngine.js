class PopupEngine{
	static popup = document.createElement("div")
	static popupContent = document.createElement("div")
	static initialized = false
	static doLogs = true

	static endMainPopup 

	static end

	static init(config){
		if(this.initialized == true){
			if(this.doLogs)
			console.log("PopupEngine is already initialized, will ignore this call.")
			return
		}

		//configure the engine
		if(config){
			if(config.doLogs != undefined)
			this.doLogs = config.doLogs

		}

		//create needed html
		this.popup.classList.add("popupEngineContainer")
		this.popup.style.cssText = `
			position: fixed;
			inset: 0;
			background-color: var(--popupEngine-blur-color);
			z-index: 1000;
			display: none;
			place-content: center;
			font-family: sans-serif;
			color: var(--popupEngine-color);
			transition: opacity .3s;
			opacity:0;

			--popupEngine-blur-color: rgba(0, 0, 0, 0.5);
			--popupEngine-background-color: white;
			--popupEngine-color: black;
			`

		this.popupContent.classList.add("popupEngineContent")
		this.popupContent.style.cssText = `
			background-color: var(--popupEngine-background-color);
			padding: 2vw 5vw;
			max-width: 90vw;
			min-width: 25vw;
			overflow: hidden;
			word-wrap: break-word;
			transition: scale .3s;
			transition-timing-function: cubic-bezier(.13,.68,.46,1.33);
			scale: 0;`

		this.popup.appendChild(this.popupContent)

		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			document.body.appendChild(document.createComment('Code generated by popupEngine'))
			document.body.appendChild(this.popup)
			this.initialized = true
		} 
		else {
			console.log("onload")
			
			window.addEventListener('load', ()=>{
				document.body.appendChild(document.createComment('Code generated by popupEngine'))
				document.body.appendChild(this.popup)
				this.initialized = true
			});
		}
	}

	static createPopup(settings = {}){
		return new Promise((resolve, reject) => {
			this.endMainPopup = resolve
	
			//#region checks
			
			if (document.readyState === 'loading') {
				if(this.doLogs)
				console.error("PopupEngine cant be run before DOM content has finished loading. Try adding a window.load() event arround this call.")
				return
			} 
	
			if(!this.initialized){
				if(this.doLogs)
				console.error("PopupEngine has not yet been initialized: PopupEngine.init(). \n if this error keeps occuring try running PopupEngine.test()")
				return
			}
	
			if(this.popup.style.display != "none"){
				if(this.doLogs)
				console.log('overwriting old popup: "' + this.popupContent.querySelector(".popupEngineText").innerHTML + '"')
			}

			//#endregion
			
			//#region generate content

			this.popupContent.innerHTML = ""

			//create heading
			if(settings.heading){
				let heading = document.createElement("p")
				heading.style.cssText = `
					text-align: center;
					font-size: 1.5rem`
				heading.innerHTML = settings.heading
				heading.classList.add("popupEngineHeading")

				this.popupContent.appendChild(heading)
			}

			//generate text
			let popupText = document.createElement("p")
			popupText.classList.add("popupEngineText")
			popupText.style.cssText = `
				text-align: center;
				margin-bottom: 1rem;`
			popupText.innerHTML = settings.text || "no text specified"
	
			this.popupContent.appendChild(popupText)

			//create input
			if(!settings.inputs || settings.inputs.length == 0){
				settings.inputs = []
			}

			let popupInputs = document.createElement("div")
			popupInputs.classList.add("popupEngineInputs")
			popupInputs.style.cssText = `
				display: flex;
				flex-direction: column;
				justify-content: center;`

			for (let i = 0; i < settings.inputs.length; i++) {
				let input = document.createElement("input")

				if(settings.inputs[i].label){
					input.name = i

					let label = document.createElement("label")
					label.classList.add("popupEngineInputLabel")
					label.style.cssText = `
					font-size: .9rem;`
					label.innerText = settings.inputs[i].label

					popupInputs.appendChild(label)
				}

				input.style.cssText = `
					padding: .5rem;
					border: 1px solid gray;
					margin: .2rem 0 .5rem 0;
					color: var(--popupEngine-color);`
				input.type = settings.inputs[i].type || "text"
				input.placeholder = settings.inputs[i].placeholder || ""
				input.classList.add("popupEngineInput")
	
				popupInputs.appendChild(input)
			}
	
			this.popupContent.appendChild(popupInputs)
			
			//create buttons
			if(!settings.buttons || settings.buttons.length == 0){
				settings.buttons = [{text: "okay"}]
			}
	
			let popupButtons = document.createElement("div")
			popupButtons.classList.add("popupEngineButtons")
			popupButtons.style.cssText = `
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
				justify-content: center;`

			for (let i = 0; i < settings.buttons.length; i++) {
				let button = document.createElement("button")
				button.style.cssText = `
					cursor: pointer;
					border: 1px solid gray;
					padding: .5rem;
					color: var(--popupEngine-color);`
				button.innerText = settings.buttons[i].text
				button.onclick = function () { 
					PopupEngine.closePopup(
						settings.buttons[i].closePopup, 
						settings.buttons[i].action, 
						{
							text: settings.text,
							heading: settings.heading,
							buttons: settings.buttons,
							inputs: settings.inputs,
							buttonIndex: i,
						}
				)}
				button.classList.add("popupEngineButton")
	
				popupButtons.appendChild(button)
			}
	
			this.popupContent.appendChild(popupButtons)
	
			//#endregion
	
			//show popup
			this.popup.style.display = "grid"
			setTimeout(function(){
				document.querySelector('.popupEngineContainer').style.opacity = 1
				document.querySelector('.popupEngineContent').style.scale = 1
			},0)
		})
	}

	static closePopup(closePopup = true, closeAction, data){
		//get values of inputs
		if(this.popupContent.querySelector(".popupEngineInputs")){
			let inputValues = []
			document.querySelectorAll('.popupEngineInputs .popupEngineInput').forEach(item => {
				inputValues.push(item.value)
			})
			data.inputValues = inputValues
		}

		if(closeAction){
			closeAction(data)
		}

		if(closePopup){
			this.popup.style.display = "none"
			this.popup.style.opacity = 0
			this.popupContent.style.scale = 0

			this.endMainPopup(data)
		}
	}

	/**
	 * test method, creates one popup and outputs errors
	 */
	static test(){
		if(!this.initialized){
			console.error("TEST: PopupEngine has not yet been initialized: PopupEngine.init()")
			return
		}
		if(!document.querySelector('.popupEngineContainer')){
			console.error("TEST: Could not find DOM elements needed to run PopupEngine. This is probably because the Engine has not yet been initialized: PopupEngine.init()")
			return
		}
		if(!document.querySelector('.popupEngineContent')){
			console.error("TEST: Could not find DOM elements needed to run PopupEngine. This might be a problem with the initialization but is probably because another script has changed the engines elements or because your version of the engine is faulty.")
			return
		}
		console.log("TEST: all DOOM elements seem fine");
		console.log(
		`TEST: Generating popup from following code:
		PopupEngine.createPopup({
			text: "test",
			buttons: [
				{
					text: "okay",
					action: () => {console.log("okay")}
				}
			]
		}`);
		PopupEngine.createPopup({
			text: "test",
			buttons: [
				{
					text: "okay",
					action: () => {console.log("okay")}
				}
			]
		})
	}
}