window.addEvent('load', function(event){


	// Get the iframes
	var current = $('current');
	var next = $('next');


	// Disable forms inside the iframes
	var disableForms = function(win){
		win.$$('input, textarea, select, button').set('disabled', 'disabled');
	}
	disableForms(current.contentWindow);
	disableForms(next.contentWindow);


	// Get the number of slides
	$('numslides').set('html', current.contentWindow.$$('.slide').length);


	// Get the presentation's title
	$('title').set('html', current.contentWindow.$$('title')[0].get('html'));


	// Start from where the presenter was launched
	var fragment = parseInt(/#([0-9]+)$/.exec(window.location)[1]);
	if(!fragment){
		fragment = 0;
	}
	current.contentWindow.slideTo(fragment);
	next.contentWindow.slideTo(++fragment);
	$('currentindex').set('html', fragment);


	// Setup the timer
	var time = $('time');
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


	// On message, advance the iframes
	window.addEventListener('message', function(event){
		var currentslide = parseInt(event.data);
		var nextslide = parseInt(event.data) + 1;
		current.contentWindow.slideTo(currentslide);
		next.contentWindow.slideTo(nextslide);
		$('currentindex').set('html', nextslide);
	}, false);


	// On keypress, advance the slides in the presentation
	if(window.opener){
		window.addEvents({
			'slidenext': function(){
				window.opener.slideNext(true);
			},
			'slideback': function(){
				window.opener.slideBack(true);
			}
		});
	}


});

