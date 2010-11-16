/*
	shared.js
	Shared functionality for presentation and presenter
*/


jQuery(function($){


$(document).keydown(function(evt){
	var code = evt.keyCode
	if(code == 39 || code == 34){
		$(this).trigger('slidenext')
	}
	else if(code == 37 || code == 33){
		$(this).trigger('slideback')
	}
	else if(code == 116 || code == 190 || code == 27){
		$(this).trigger('overlay')
		evt.preventDefault()
	}
})


})
