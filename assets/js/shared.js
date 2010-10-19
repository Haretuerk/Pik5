/*
	shared.js
	Shared functionality for presentation and presenter
*/

// Register key events
window.addEvent('keydown', function(evt){
	var code = evt.code;
	// Next slide
	if(code == 39 || code == 34){
		window.fireEvent('slidenext');
	}
	// Previous slide
	else if(code == 37 || code == 33){
		window.fireEvent('slideback');
	}
	// Use and ESC and F5 key for hiding slides
	else if(code == 116 || code == 190 || code == 27){
		window.fireEvent('hide');
		evt.stop();
	}
});
