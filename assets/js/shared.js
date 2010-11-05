/*
	shared.js
	Shared functionality for presentation and presenter
*/


jQuery(function($){


var doc = $(document)
doc.keydown(function(evt){
	var code = evt.keyCode
	if(code == 39 || code == 34){
		doc.trigger('slidenext')
	}
	else if(code == 37 || code == 33){
		doc.trigger('slideback')
	}
	else if(code == 116 || code == 190 || code == 27){
		doc.trigger('overlay')
		evt.preventDefault()
	}
})


})
