// Global variables
var slides, presenter, slideTo, slideNext, slideBack;


window.addEvent('domready', function(){


var origin = '*';                         // Placeholder for what will be the presentation's HTML orgin
var current = 0;                          // Currently visible slide
var frame = $('frame');                   // Wrapper element
var framecontainer = $('framecontainer'); // The moving slide container
slides = $$('.slide');                    // All the slides

var inPresenter = /presenter\.html(#([0-9]+))*$/.test(parent.location + ''); // Presentation or presenter view?


// Add "End of presentation" slide
slides.push(new Element('div', {
	id: 'end',
	'class': 'slide',
	html: '<p>End of presentation.</p>'
}).inject(framecontainer, 'bottom'));


// Setup font
var framesize = frame.getSize();
var frameratio = (framesize.x + framesize.y) / 1000;
$$('body').setStyle('font-size', frameratio + 'em');


// Setup frame and slides
frame.setStyle('overflow', 'hidden');
framecontainer.setStyle('width', 100 * slides.length + '%');
var framecontainersize = framecontainer.getSize();
var slidesize = framecontainersize.x / slides.length;
slides.setStyle('width', slidesize + 'px');


// Set the slide effect. To use no transistion at all, set duration to 0
framecontainer.set('tween', {
	duration: 400,
	unit: 'px'
});


// Slide to the slide index
slideTo = function(index, sendToRemote){
	index = parseInt(index);
	if(slides[index]){
		framecontainer.tween('left', index * slidesize * -1);
		if(!inPresenter){
			slides[current].fireEvent('hide');
			slides[index].fireEvent('show');
			window.fireEvent('slidechange', index);
		}
		if(sendToRemote && presenter){
			presenter.postMessage(index, origin);
		}
		current = index;
	}
};


// Go to the next slide
slideNext = function(sendToRemote){
	slideTo(current + 1, sendToRemote);
};


// Go to the previous slide
slideBack = function(sendToRemote){
	slideTo(current - 1, sendToRemote);
};


// Change slides on keypress
if(!inPresenter){      // Do nothing if the page is embedded in presenter.html
	window.addEvents({
		'slidenext': function(){
			slideNext(true);
		},
		'slideback': function(){
			slideBack(true);
		}
	});
}


// Change slides using links
if(!inPresenter){      // Do nothing if the page is embedded in presenter.html
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
	// Go to the selected slide using the slide selector
	if(!inPresenter){      // Do nothing if the page is embedded in presenter.html
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


// Launch the presenter view
if(!inPresenter){      // Do nothing if the page is embedded in presenter.html
	var startpresenter = $('startpresenter');
	if(startpresenter){
		startpresenter.addEvent('click', function(e){
			e.stop();
			presenter = window.open('presenter.html#' + current, 'presenter');
		});
	}
}


});
