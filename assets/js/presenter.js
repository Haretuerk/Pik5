window.onload = function(){


// Get the iframes
var current = $('#current')[0].contentWindow
  , next = $('#next')[0].contentWindow


// Disable forms inside the iframes
var disableForms = function(win){
	win.jQuery('input, textarea, select, button').attr('disabled', 'disabled')
}
disableForms(current)
disableForms(next)


// Get the number of slides
$('#numslides').text(current.jQuery('.slide').length)


// Start from where the presenter was launched
var fragment = parseInt(/#([0-9]+)$/.exec(window.location)[1])
if(!fragment){
	fragment = 0
}
current.slideTo(fragment)
next.slideTo(++fragment)
$('#currentindex').html(fragment)


// Setup the timer
var time = $('#time')
  , now = $('#now')
  , h = 0
  , m = 0
  , s = 0
  , timer = setInterval(function(){
	s++
	var t = new Date()
	if(s == 60){
		s = 0; m++
	}
	if(m == 60){
		m = 0; h++
	}
	h = h + ''
	if(h.length == 1) { h = '0' + h }
	m = m + ''
	if(m.length == 1) { m = '0' + m }
	s = s + ''
	if(s.length == 1) { s = '0' + s }
	time.html(h + ':' + m + ':' + s)
	now.html(t.toLocaleTimeString())
}, 1000)


// Recieve messages from the presentation
window.addEventListener('message', function(event){
	if(event.data == 'toggleOverlay'){
		current.toggleOverlay();
	}
	else {
		var currentslide = parseInt(event.data)
		var nextslide = parseInt(event.data) + 1
		current.slideTo(currentslide)
		next.slideTo(nextslide)
		$('#currentindex').text(nextslide)
		updateSelect(currentslide);
	}
}, false)


// Report an error if window.opener goes missing
var windowError = function(){
	alert("Error: can't find presentation window. Was the presentation window closed or refreshed?");
}


// Delegeate control events
$(document).bind({
	'slidenext': function(){
		if(window.opener){
			window.opener.slideNext()
		}
		else{
			windowError();
		}
	},
	'slideback': function(){
		if(window.opener){
			window.opener.slideBack()
		}
		else{
			windowError();
		}
	},
	'overlay': function(){
		if(window.opener){
			window.opener.toggleOverlay()
		}
		else{
			windowError();
		}
	}
})


// Setup control links
$('#slidenext').click(function(evt){
	if(window.opener){
		window.opener.slideNext()
	}
	else{
		windowError();
	}
})
$('#slideback').click(function(evt){
	if(window.opener){
		window.opener.slideBack()
	}
	else{
		windowError();
	}
})


// Setup control menu
var slideselect = $('#slideselect')
var slideselecthtml = ''
if(window.opener){
	window.opener.slides.each(function(index, slide){
		slide = $(slide)
		if(slide.attr('id') !== 'end'){
			var headlines = slide.find('h1, h2, h3, h4, h5, h6')
			var optiontitle = (headlines[0]) ? index + 1 + ': ' + $(headlines[0]).text() : index
			slideselecthtml += '<option value="' + index + '">' + optiontitle + '</option>'
		}
	})
}
slideselect.html(slideselecthtml)
slideselect.change(function(){
	if(window.opener){
		window.opener.slideTo(slideselect.val(), true)
	}
	else{
		windowError();
	}
})


// Keep the slide select up to date
var options = slideselect.find('option')
var updateSelect = function(index){
	options.each(function(i, option){
		if(option.value == index){
			slideselect.val(index)
		}
	})
}


}
