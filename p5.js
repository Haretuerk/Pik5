var slides, presenter, slideTo, slideNext, slideBack;


window.addEvent('domready', function(){


var origin = '*';
var P5 = $$('body')[0];
var current = 0;
var frame = $('frame');
var framecontainer = $('framecontainer');
slides = $$('.slide');
var slideselect = $('slideselect');
var slidenext = $('slidenext');
var slideback = $('slideback');
var startpresenter = $('startpresenter');


// Add "End of presentation" slide
slides.push(new Element('div', {
	id: 'end',
	'class': 'slide',
	html: '<p>End of presentation.</p>'
}).inject(slides[slides.length-1], 'after'));


// Basic layout setup
var framesize = frame.getSize();
var frameratio = (framesize.x + framesize.y) / 1000;
P5.setStyle('font-size', frameratio + 'em');
frame.setStyle('overflow', 'hidden');
framecontainer.setStyle('width', 100 * slides.length + '%');
slides.setStyle('width', 100 / slides.length + '%');


// Slide methods
framecontainer.set('tween', {
	duration: 400,
	unit: '%'
});
slideTo = function(index, sendToRemote){
	if(slides[index]){
		framecontainer.tween('left', index * 100 * -1);
		slides[current].fireEvent('hide');
		slides[index].fireEvent('show');
		P5.fireEvent('change', [index]);
		if(sendToRemote && presenter){
			presenter.postMessage(index, origin);
		}
		current = index;
	}
};
slideNext = function(sendToRemote){
	slideTo(current + 1, sendToRemote);
};
slideBack = function(sendToRemote){
	slideTo(current - 1, sendToRemote);
};


// Key event setup
window.addEvent('keyup', function(evt){
	var code = evt.code;
	if(code == 37 && !/presenter\.html(#([0-9]+))*$/.test(parent.location + '')){     // Do nothing if the page is embedded in presenter.html
		slideBack(true);
	}
	else if(code == 39 && !/presenter\.html(#([0-9]+))*$/.test(parent.location + '')){ // Do nothing if the page is embedded in presenter.html
		slideNext(true);
	}
});


// Jump to slides
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
if(!/presenter\.html(#([0-9]+))*$/.test(parent.location + '')){
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
	if(!/presenter\.html(#([0-9]+))*$/.test(parent.location + '')){
		slideNext(true);
	}
});
slideback.addEvent('click', function(e){
	e.stop();
	if(!/presenter\.html(#([0-9]+))*$/.test(parent.location + '')){
		slideBack(true);
	}
});


// Launch the presenter view
startpresenter.addEvent('click', function(e){
	e.stop();
	presenter = window.open('presenter.html#' + current, 'presenter');
});


});
