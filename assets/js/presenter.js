jQuery(document).ready(function($){

var current       = 0,
    currentWindow,
    nextWindow,
    currentFrame  = $('#current'),
    nextFrame     = $('#next')
    timerRunning  = true;


// Extract the title from a slide
var getTitle = function(slide){
	if(!slide.find){
		slide = $(slide);
	}
	var slides = Array.prototype.slice.call(pik5.slides);
	var index = slides.indexOf(slide[0]);
	var headlines = slide.find('h1, h2, h3, h4, h5, h6');
	var title = (headlines[0]) ? index + 1 + ': ' + $(headlines[0]).text() : index;
	title = (title + '').replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
	return title;
};

// Timer
var h = 0,
    m = 0,
    s = 0;
(function(){
	var time = $('#time'),
	    now = $('#now');
	setInterval(function(){
		s++;
		var t = new Date();
		if(s == 60){
			s = 0; m++;
		}
		if(m == 60){
			m = 0; h++;
		}
		h = h + '';
		if(h.length == 1) { h = '0' + h }
		m = m + '';
		if(m.length == 1) { m = '0' + m }
		s = s + '';
		if(s.length == 1) { s = '0' + s }
		now.html(t.toLocaleTimeString());
		if(timerRunning){
			time.html(h + ':' + m + ':' + s);
		}
	}, 1000);
})();


// Timer controls
$('#stoptimer').click(function(){
	if(timerRunning){
		timerRunning = false;
		this.value = "Resume";
	}
	else {
		timerRunning = true;
		this.value = "Stop";
	}
});
$('#resettimer').click(function(){
	if(confirm('Reset the timer? This cannot be undone!')){
		h = m = s = 0;
		$('#time').html('00:00:00');
	}
});


// Create select options
var setupSelect = function(){
	var slideselect = $('#slideselect');
	var slideselecthtml = '';
	pik5.slides.each(function(index, slide){
		slide = $(slide);
		if(slide.attr('id') !== 'end'){
			slideselecthtml += '<option value="' + index + '">' + getTitle(slide) + '</option>';
		}
	});
	slideselect.html(slideselecthtml);
	slideselect.val(current);
};

// Setup control buttons and select
var setupControls = function(){
	$('#slidenext').click(function(evt){
		pik5.slideNext(true);
	});
	$('#slideback').click(function(evt){
		pik5.slideBack(true);
	});
	$('#slideselect').change(function(){
		if(this.value){
			pik5.slideTo(this.value, true);
		}
	})
};

// Create the progress bar
var setupProgress = function(current){
	var progress = $('#progress').html('');
	var slidewidth = Math.floor(928/pik5.slides.length) - 2;
	pik5.slides.each(function(index, slide){
		var title = getTitle(slide);
		var segment = $('<div title="' + title + '" style="width:' + slidewidth + 'px">' + (index + 1) + '</div>');
		segment.click(function(){
			pik5.slideTo(index, true);
		});
		progress.append(segment);
	});
	updateProgress();
};

// Update the progress bar
var updateProgress = function(){
	var segments = $('#progress div');
	segments.each(function(index, segment){
		if(index < current){
			$(segment).addClass('past').removeClass('future').removeClass('current');
		}
		else if(index > current){
			$(segment).addClass('future').removeClass('past').removeClass('current');
		}
		else {
			$(segment).addClass('current').removeClass('past').removeClass('future');
		}
	});
}

// (Re-) Initialize the UI
var presenterUiInit = function(){
	$('#numslides').text(pik5.slides.length);
	setupSelect();
	setupControls();
	setupProgress();
};

// Setup current slide view
currentFrame.bind('load', function(){
	currentWindow = this.contentWindow;
	currentWindow.slideTo(null, current);
	pik5.slides = currentWindow.jQuery('.pik5-slide');
	presenterUiInit();
});

// Setup next slide view
nextFrame.bind('load', function(){
	nextWindow = this.contentWindow;
	nextWindow.slideTo(null, current + 1);
});

// Execute show/hide change
$(window).bind({
	'slideTo': function(evt, index){
		current = (typeof index == 'undefined') ? 0 : index;
		$('#slideselect').val(current);
		$('#currentindex').html(current + 1);
		updateProgress();
		try {
			currentWindow.slideTo(null, current);
			nextWindow.slideTo(null, current + 1);
		} catch(e){}
	},
	'show': function(){
		try {
			currentWindow.show();
			nextWindow.show();
		} catch(e){}
	},
	'hide': function(){
		try {
			currentWindow.hide();
			nextWindow.hide();
		} catch(e){}
	},
	'location': function(evt, url){
		if(currentFrame.attr('src') != url){
			currentFrame.attr('src', url);
		}
		if(nextFrame.attr('src') != url){
			nextFrame.attr('src', url);
		}
	}
});

});
