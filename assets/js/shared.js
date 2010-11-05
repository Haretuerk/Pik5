/*
	shared.js
	Shared functionality for presentation and presenter
*/

$(document).keydown(function(evt){
	var code = evt.code
	if(code == 39 || code == 34){
		window.trigger('slidenext');
	}
	else if(code == 37 || code == 33){
		window.trigger('slideback');
	}
	else if(code == 116 || code == 190 || code == 27){
		window.trigger('hide')
		evt.preventDefault()
	}
})
