/*
	shared.js
	Shared functionality for presentation and presenter
*/

// Register key events
window.addEvent('keyup', function(evt){
	var code = evt.code;
	if(code == 37 || code == 33){
		window.fireEvent('slideback');
	}
	else if(code == 39 || code == 34){
		window.fireEvent('slidenext');
	}
});
