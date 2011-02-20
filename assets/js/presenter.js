/*
	presenter.js
	Script for the presenter
*/


_PIK5.currentWindow = null;
_PIK5.nextWindow    = null;
_PIK5.location      = null;


jQuery(document).ready(function($){
	_PIK5.setupWorker();
	_PIK5.setupNavigation();
	_PIK5.startTimer();
	$('#current').bind('load', function(){
		_PIK5.currentWindow = this.contentWindow;
		_PIK5.presenterSlideTo(_PIK5.currentWindow, _PIK5.current);
		_PIK5.location = _PIK5.currentWindow.location.href;
		_PIK5.slides = _PIK5.currentWindow.jQuery('.pik5-slide');
		_PIK5.presenterUiInit();
	});
	$('#next').bind('load', function(){
		_PIK5.nextWindow = this.contentWindow;
		_PIK5.presenterSlideTo(_PIK5.nextWindow, _PIK5.current + 1);
	});
});


_PIK5.setupWorker = function(){
	if(_PIK5.hasWorker){
		_PIK5.port.addEventListener('message', function(evt){
			var data = evt.data;
			// Active slides change
			if(data && typeof data.slidenum != 'undefined'){
				_PIK5.current = parseInt(data.slidenum);
				_PIK5.presenterSlideTo(_PIK5.currentWindow, _PIK5.current);
				_PIK5.presenterSlideTo(_PIK5.nextWindow, _PIK5.current + 1);
				$('#currentindex').html(_PIK5.current + 1);
				_PIK5.updateProgress();
				$('#slideselect').val(data.slidenum);
			}
			// Hidden state changes
			if(data && typeof data.hidden != 'undefined'){
				_PIK5.hidden = parseInt(data.hidden);
				_PIK5.presenterSetHidden(_PIK5.currentWindow, _PIK5.hidden);
				_PIK5.presenterSetHidden(_PIK5.nextWindow, _PIK5.hidden);
			}
			// Active presentation changes
			if(data && typeof data.location != 'undefined'){
				if(data.location !== null && data.location != _PIK5.location){
					_PIK5.location = data.location;
					$('#current').attr('src', _PIK5.location);
					$('#next').attr('src', _PIK5.location);
				}
			}
		});
		_PIK5.port.start();
		_PIK5.port.postMessage(null); // Initial sync request
	}
}


_PIK5.setupNavigation = function(){
	$(document).bind({
		'slidenext': function(){
			_PIK5.port.postMessage({
				'slidenum': _PIK5.current + 1
			});
		},
		'slideback': function(){
			_PIK5.port.postMessage({
				'slidenum': _PIK5.current - 1
			});
		},
		'hide': function(){
			_PIK5.hidden = (_PIK5.hidden === 1) ? 0 : 1;
			_PIK5.port.postMessage({
				hidden: _PIK5.hidden
			});
		}
	});
	$('#slidenext').click(function(evt){
		$(document).trigger('slidenext');
	});
	$('#slideback').click(function(evt){
		$(document).trigger('slideback');
	});
	$('#slideselect').change(function(){
		if(this.value){
			_PIK5.port.postMessage({
				'slidenum': this.value
			});
		}
	})
};


_PIK5.presenterUiInit = function(){
	$('#numslides').text(_PIK5.slides.length);
	_PIK5.setupProgress();
	_PIK5.setupSelect();
};


_PIK5.presenterSlideTo = function(win, index){
	if(win && typeof win._PIK5.slideTo == 'function'){
		win._PIK5.slideTo(index, false);
	}
};


_PIK5.presenterSetHidden = function(win, state){
	if(win && typeof win._PIK5.setHidden == 'function'){
		win._PIK5.setHidden(state, false);
	}
};


_PIK5.setupSelect = function(){
	var slideselect = $('#slideselect');
	var slideselecthtml = '';
	_PIK5.slides.each(function(index, slide){
		slide = $(slide);
		if(slide.attr('id') !== 'end'){
			var headlines = slide.find('h1, h2, h3, h4, h5, h6');
			var optiontitle = (headlines[0]) ? index + 1 + ': ' + $(headlines[0]).text() : index;
			slideselecthtml += '<option value="' + index + '">' + optiontitle + '</option>';
		}
	});
	slideselect.html(slideselecthtml);
	slideselect.val(_PIK5.current);
};


_PIK5.setupProgress = function(current){
	var progress = $('#progress').html('');
	var slidewidth = Math.floor(928/_PIK5.slides.length) - 2;
	_PIK5.slides.each(function(index){
		var segment = $('<div style="width:' + slidewidth + 'px">' + (index + 1) + '</div>');
		segment.click(function(){
			if(_PIK5.hasWorker){
				_PIK5.port.postMessage({
					'slidenum': index
				});
			}
		});
		progress.append(segment);
	});
	_PIK5.updateProgress();
};


_PIK5.updateProgress = function(){
	var segments = $('#progress div');
	segments.each(function(index, segment){
		if(index < _PIK5.current){
			$(segment).addClass('past').removeClass('future').removeClass('current');
		}
		else if(index > _PIK5.current){
			$(segment).addClass('future').removeClass('past').removeClass('current');
		}
		else {
			$(segment).addClass('current').removeClass('past').removeClass('future');
		}
	});
};


_PIK5.startTimer = function(){
	var time = $('#time')
	  , now = $('#now')
	  , h = 0
	  , m = 0
	  , s = 0;
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
		time.html(h + ':' + m + ':' + s);
		now.html(t.toLocaleTimeString());
	}, 1000);
};
