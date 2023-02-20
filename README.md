# PopupEngine
Simple js libary that adds a PopupEngine class that can be used to create simple unstyled popups. Intended for use with my own projects.

**disclaimer: this libary is still a early beta and doesnt offfer more than the most basic features**

##Initialization
Use `PopupEngine.init()` to create the html that the engine uses. You can test the succes of this init by calling `PopupEngine.test()` in the console which will create a popup and check for simple errors with the html and log possible errors.

##Usage
Create a new popup by calling `PopupEngine.createPopup(text, confirm, cancel)` this function expects 3 arguments: 
-text: the text that will be displayed by the popup
-confirm: a anonymous funtion that will be called when the user presses the confirm button
-cancel: a anonymous funtion that will be called when the user presses the cancel button
