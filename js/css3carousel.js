$.fn.extend({
	
	slide: function(options){
		var options = $.extend({
			ratio: 550 / 1000,
			interval: 3000
		}, options);
		var wrapper = $(this);
		var slides = $('.slides > li', wrapper);
		var ctrl = $('.ctrl', wrapper);
		var indicator = $('.indicator', wrapper);
		var ratio = options.ratio;
		var current = 0;
		var timer;
		
		var getPrevNext = function(num){
			var _prev = num - 1;
			var _next = num + 1;
			if(num<=0){
				_prev = slides.length - 1;
			} else if(num>=slides.length - 1){
				_next = 0;
			}
			return { p: _prev, n: _next};
		}
		
		var resize = function(){
			wrapper.css({
				height: wrapper.width() * ratio
			});
		}
			
		var transition = function(index){
			var target = slides.eq(index);
			var prev = slides.eq(getPrevNext(index).p);
			var next = slides.eq(getPrevNext(index).n);
			$('a', ctrl).off('ctrlClick');
			target.on('transitionend oTransitionEnd webkitTransitionEnd msTransitionEnd', function(){
				target.off();
				target.removeClass().addClass('current');
				slides.not(target).not(prev).not(next).removeClass();
				current = target.index();
				complete();
			});
			target.removeClass().addClass('animated');
			next.removeClass().addClass('next');
			prev.removeClass().addClass('prev');
		}
		
		var complete = function(){
			$('li', indicator).removeClass().eq(current).addClass('active');
			$('a[href="#prev"]', ctrl).on('ctrlClick', function(){
				transition(getPrevNext(current).p);
			});
			$('a[href="#next"]', ctrl).on('ctrlClick', function(){
				transition(getPrevNext(current).n);
			});
			autoReal();
		}
		
		var autoReal = function(){
			clearTimeout(timer);
			timer = setTimeout(function(){
				$('a[href="#next"]', ctrl).trigger('click');
			}, options.interval);
		}
		
		slides.each(function(){
			indicator.append($('<li>.</li>'));
		});
		
		$('a', ctrl).on('click', function(){
			clearTimeout(timer);
			$(this).trigger('ctrlClick');
			return false;
		});
		
		slides.eq(getPrevNext(current).p).addClass('prev');
		slides.eq(getPrevNext(current).n).addClass('next');
		complete();
		
		$(window).on('resize', resize);
		resize();
	}
	
});