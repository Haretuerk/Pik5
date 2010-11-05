var slides, presenter, slideTo, slideNext, slideBack, toggleOverlay


jQuery(function($){


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
toggleOverlay = function(){
	overlay.toggle()
	if(presenter && !inPresenter){
		presenter.postMessage('toggleOverlay', origin)
	}
}


// Slide to the slide index
slideTo = function(index){
	index = parseInt(index)
	if(slides[index]){
		framecontainer.css('left', index * slidesize * -1)
		if(!inPresenter){
			$(slides[current]).trigger('hide')
			$(slides[index]).trigger('show')
			$(document).trigger('slidechange', index)
		}
		if(presenter && !inPresenter){
			presenter.postMessage(index, origin)
		}
		current = index
	}
}


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
	$(document).bind({
		'slidenext': function(){
			slideNext()
		},
		'slideback': function(){
			slideBack()
		},
		'overlay': function(){
			toggleOverlay()
		}
	})
}


// Change slides using links .Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	var slidenext = $('#slidenext')
	if(slidenext){
		slidenext.click(function(evt){
			$(document).trigger('slidenext')
			evt.preventDefault()
		})
	}
	var slideback = $('#slideback')
	if(slideback){
		slideback.click(function(){
			$(document).trigger('slideback')
		})
	}
}


// Setup the slide select element
var slideselect = $('#slideselect')
if(slideselect){
	var slideselecthtml = ''
	slides.each(function(index, slide){
		slide = $(slide)
		if(slide.attr('id') !== 'end'){
			var headlines = slide.find('h1, h2, h3, h4, h5, h6')
			var optiontitle = (headlines[0]) ? index + 1 + ': ' + $(headlines[0]).text() : index
			slideselecthtml += '<option value="' + index + '">' + optiontitle + '</option>'
		}
	})
	slideselect.html(slideselecthtml)
	// Go to the selected slide using the slide selector. Do nothing if the page is embedded in presenter.html
	if(!inPresenter){
		slideselect.change(function(){
			slideTo(slideselect.val(), true)
		})
	}
	// Keep the slide select up to date
	var options = slideselect.find('option')
	$(document).bind('slidechange', function(evt, index){
		options.each(function(i, option){
			if(option.value == index){
				console.log(option.value)
				slideselect.val(index)
			}
		})
	})
}


// Launch the presenter view. Do nothing if the page is embedded in presenter.html
if(!inPresenter){
	var startpresenter = $('#startpresenter')
	if(startpresenter){
		startpresenter.click(function(evt){
			presenter = window.open('presenter.html#' + current, 'presenter')
			evt.preventDefault()
		})
	}
}


})
