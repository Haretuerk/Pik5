var slides, presenter, slideTo, slideNext, slideBack;


window.addEvent('domready', function(){


var origin = '*';                                                            // Placeholder for what will once be the presentation's HTML orgin
var P5 = $$('body')[0];                                                      // Body element
var current = 0;                                                             // Currently visible slide
var frame = $('frame');                                                      // Wrapper element
var framecontainer = $('framecontainer');                                    // The moving slide container
slides = $$('.slide');                                                       // All the slides
var slideselect = $('slideselect');                                          // Slide select element
var slidenext = $('slidenext');                                              // Link to go to the next slide
var slideback = $('slideback');                                              // Link to go to the previous slide
var startpresenter = $('startpresenter');                                    // Link to launch the presenter view
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
P5.setStyle('font-size', frameratio + 'em');


// Setup frame
frame.setStyle('overflow', 'hidden');
framecontainer.setStyle('width', 100 * slides.length + '%');
var framecontainersize = framecontainer.getSize();


// Setup slides
var slidesize = framecontainersize.x / slides.length;
alert(slidesize);
slides.setStyle('width', slidesize + 'px');


// Set the slide effect. To use no transistion at all, set duration to 0
framecontainer.set('tween', {
	duration: 400,
	unit: 'px'
});


// Slide to the slide index
slideTo = function(index, sendToRemote){
	if(slides[index]){
		framecontainer.tween('left', index * slidesize * -1);
		if(!inPresenter){
			slides[current].fireEvent('hide');
			slides[index].fireEvent('show');
			P5.fireEvent('change', [index]);
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


// Key event setup
window.addEvent('keyup', function(evt){
	var code = evt.code;
	if(code == 37 && !inPresenter){     // Do nothing if the page is embedded in presenter.html
		slideBack(true);
	}
	else if(code == 39 && !inPresenter){ // Do nothing if the page is embedded in presenter.html
		slideNext(true);
	}
});


// Slide select element
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


// Go to the selected slide
if(!inPresenter){
	slideselect.addEvent('change', function(){
		slideTo(slideselect.value, true);
	});
}


// Keep the slide select up to date
var options = slideselect.getElements('option');
P5.addEvent('change', function(index){
	options.each(function(option){
		if(option.value == index){
			option.set('selected', 'selected');
		}
		else{
			option.erase('selected');
		}
	});
});


// Slide back and forth
slidenext.addEvent('click', function(e){
	e.stop();
	if(!inPresenter){
		slideNext(true);
	}
});
slideback.addEvent('click', function(e){
	e.stop();
	if(!inPresenter){
		slideBack(true);
	}
});


// Launch the presenter view
startpresenter.addEvent('click', function(e){
	e.stop();
	presenter = window.open('presenter.html#' + current, 'presenter');
});


});
