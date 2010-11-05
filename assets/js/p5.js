var slides, presenter, slideTo, slideNext, slideBack, toggleHidePresentation


$(document).ready(function(){


var origin = '*'
  , current = 0
  , frame = $('#frame')
  , framecontainer = $('#framecontainer')
  , inPresenter = /presenter\.html(#([0-9]+))*$/.test(parent.location + '')


// Add "End of presentation" slide
framecontainer.append('<div id="end" class="slide"><p>End of presentation.</p></div>')
slides = $('.slide')


// Setup font
var frameratio = (frame.height() + frame.width()) / 1000
$('body').css('font-size', frameratio + 'em')


// Setup frame and slides
frame.css('overflow', 'hidden')
framecontainer.css('width', 100 * slides.length + '%')
var slidesize = framecontainer.width() / slides.length
slides.css('width', slidesize + 'px')


// The overlay element used to hide the presentation
var overlay = $('<div></div>').hide().css({
	position: 'absolute',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	'z-index': 1337,
	background:'#000'
}).appendTo(frame)


// The function used to hide the presentation
toggleHidePresentation = function(){
	overlay.toggle(200)
	if(presenter && !inPresenter){
		presenter.postMessage('toggleHidePresentation', origin)
	}
}

/*
// Slide to the slide index
slideTo = function(index){
	index = parseInt(index);
	if(slides[index]){
		framecontainer.tween('left', index * slidesize * -1);
		if(!inPresenter){
			slides[current].fireEvent('hide');
			slides[index].fireEvent('show');
			window.fireEvent('slidechange', index);
		}
		if(presenter && !inPresenter){
			presenter.postMessage(index, origin);
		}
		current = index;
	}
};


// Go to the next slide
slideNext = function(){
	slideTo(current + 1)
}


// Go to the previous slide
slideBack = function(){
	slideTo(current - 1)
}


// Change slides or hide presentation on keypress. Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	window.addEvents({
		'slidenext': function(){
			slideNext();
		},
		'slideback': function(){
			slideBack();
		},
		'hide': function(){
			toggleHidePresentation();
		}
	});
}


// Change slides using links .Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	var slidenext = $('slidenext');
	if(slidenext !== null){
		slidenext.addEvent('click', function(e){
			e.stop();
			window.fireEvent('slidenext');
		});
	}
	var slideback = $('slideback');
	if(slideback !== null){
		slideback.addEvent('click', function(e){
			e.stop();
			window.fireEvent('slideback');
		});
	}
}


// Setup the slide select element
var slideselect = $('slideselect');
if(slideselect !== null){
	// Insert the option elements
	var slideselecthtml = '';
	slides.each(function(slide, index){
		// Exclude the end slide
		if(slide.get('id') != 'end'){
			// Get the slide title from headlines
			var headlines = slide.getElements('h1, h2, h3, h4, h5, h6');
			if(headlines[0]){
				var optiontitle = index + 1 + ': ' + headlines[0].get('text');
			}
			else{
				var optiontitle = index;
			}
			slideselecthtml += '<option value="' + index + '">' + optiontitle + '</option>';
		}
	});
	slideselect.set('html', slideselecthtml);
	// Go to the selected slide using the slide selector. Do nothing if the page is embedded in presenter.html
	if(!inPresenter){
		slideselect.addEvent('change', function(){
			slideTo(slideselect.value, true);
		});
	}
	// Keep the slide select up to date
	var options = slideselect.getElements('option');
	window.addEvent('slidechange', function(index){
		options.each(function(option){
			if(option.value == index){
				slideselect.value = index;
			}
		});
	});
}


// Launch the presenter view. Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	var startpresenter = $('startpresenter');
	if(startpresenter){
		startpresenter.addEvent('click', function(e){
			e.stop();
			presenter = window.open('presenter.html#' + current, 'presenter');
		});
	}
}*/


})
