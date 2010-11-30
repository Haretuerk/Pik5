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


// Get the presentation's title
$('title').text(current.jQuery('title').text())


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
  , h = 0
  , m = 0
  , s = 0
  , timer = setInterval(function(){
	s++
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
	}
}, false)


// Delegeate control events
if(window.opener){
	$(document).bind({
		'slidenext': function(){
			window.opener.slideNext()
		},
		'slideback': function(){
			window.opener.slideBack()
		},
		'overlay': function(){
			window.opener.toggleOverlay()
		}
	})
}


}
