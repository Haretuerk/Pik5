// Get the iframes
var current = document.getElementById('current');
var next = document.getElementById('next');
window.addEventListener('load', function(event){
	// Get the number of slides
	document.getElementById('numslides').innerHTML = current.contentWindow.document.getElementsByClassName('slide').length;
	// Get the presentation's title
	document.getElementById('title').innerHTML = current.contentWindow.document.getElementsByTagName('title')[0].innerHTML;
	// Hide the control elements in the iframe
	current.contentWindow.document.getElementById('controls').innerHTML = '';
	next.contentWindow.document.getElementById('controls').innerHTML = '';
	// Start from where the presenter was launched
	var fragment = /#([0-9]+)$/.exec(window.location)[1];
	if(fragment){
		current.contentWindow.slideTo(fragment);
		next.contentWindow.slideTo(++fragment);
	}
	// Setup the timer
	var time = document.getElementById('time');
	var h = m = s = 0;
	var timer = setInterval(function(){
		s++;
		if(s == 60){
			s = 0;
			m++;
		}
		if(m == 60){
			m = 0;
			h++;
		}
		h = h + '';
		if(h.length == 1) { h = '0' + h; }
		m = m + '';
		if(m.length == 1) { m = '0' + m; }
		s = s + '';
		if(s.length == 1) { s = '0' + s; }
		time.innerHTML = h + ':' + m + ':' + s;
	}, 1000);
}, false);
// On message, advance the iframes
window.addEventListener('message', function(event){
	var currentslide = parseInt(event.data);
	var nextslide = parseInt(event.data) + 1;
	current.contentWindow.slideTo(currentslide);
	next.contentWindow.slideTo(nextslide);
	document.getElementById('currentindex').innerHTML = nextslide;
}, false);
// On keypress, advance the slides in the presentation

