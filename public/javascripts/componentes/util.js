Object.defineProperty(String.prototype, 'capitalizeFirst', {
	value: function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false
});

//interface get option value
function getSelectedOption(elementId) {
	var element = document.getElementById(elementId);
	return element.options[element.selectedIndex].value;
}

//inerface get input value
function getInput(elementId) {
	var element = document.getElementById(elementId);
	return element.value;
}