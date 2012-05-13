/*
 * Util version 1.0.22
 * @date						13th Dec 2011
 * -----------------------------------------------------------------------------------------------------
 * Set Location 				setLocation and redirect				18th Jan 2011
 * Get Url						get URL as string						25th Dec 2011
 * Random number				get a random number to and from			15th Dec 2011
 * Random element				get a random element from elements		15th Dec 2011
 * Reflow fix for IE7			attempts to fix the relow issue in IE7	13th Dec 2011
 * Get URL Param				url_param								23th Nov 2011
 * Copy Paste					copy_paste								22th Nov 2011
 * Validate Form				validate form							17th Nov 2011
 * Time delay					delay exec of function					17th Nov 2011
 * Preload images				-----------------------------------------------------
 * Serialize images				serialize imgages					
 * Carousel						carousel only if count is reached		17th Nov 2011
 * Print Page					print the page							16th Nov 2011
 * Reset form					reset form								16th Nov 2011
 * Hide empty elements			hides empty elements					16th Nov 2011
 * Show none empty elements		show none empty elements				16th Nov 2011
 * Active Links					mark active links with a given class	15th Nov 2011
 * Slug it 						creates a slug from a given string		11th Nov 2011
 * Get Selected Options 		returns array of selected options		11th Nov 2011
 * Get Selected Checkbox's 		returns array of selected options		11th Nov 2011
 * JQ Escape					escapes selector names					11th Nov 2011
 * Array to spans				converts array to spans					11th Nov 2011
 * Array to class				converts array to class					16th Nov 2011
 * Array to ul					converts array to ul					17th Nov 2011
 */
var util = util || {};
util.cache = [];

(function($) {
	
	/**
	 * Set location
	 * @param	string	url of the href you would like to go to
	 */
	function setLocation(url){
		window.location.href = url;
	} 
	
	/*
	 * Get Url without params
	 */
	util.get_url = function(with_query_string) {
		return with_query_string ? document.URL : document.URL.split('?')[0];
	};
	
	/**
	 * Random Number
	 * ---------------------------------------------------------------------------------------
	 * @param	to		integer from
	 * @param	from		the element that has the cursor attached on hover
	 */	
	util.random_number = function(from,to) {	
       return Math.floor(Math.random() * (to - from + 1) + from);
	};
	
	/**
	 * Fetch random element from a set of elements
	 * ---------------------------------------------------------------------------------------
	 * @param	to		integer from
	 * @param	from		the element that has the cursor attached on hover
	 */
	util.random_element = function(elements) {
		var random_index = util.random_number(0, elements.length) -1;
		return elements.eq(random_index);
	};
	
	/*
	 * Relow fix for IE7
	 */
	util.reflow_timer = function() {
		
		var timeoutReflow = 0;
		
		var doit = function(obj) {
			//console.log( 'doit' );
			timeoutReflow = setTimeout(function() {
				$(".fixie7reflow").toggleClass('running');
				doit();
			}, 50);
			
		};
		
		var clear = function(timeoutSeconds) {
			setTimeout(function() {
				clearTimeout(timeoutReflow);	
			}, timeoutSeconds);
		};
		
		return {
			doit:doit, 
			clear:clear
		};
		
	}();
		
	/*
	 * Get request variable from the url
	 * ----------------------------------------------------------------
	 * @param   string			name of url parameter	
	 * @return	string | bool	return false | or return url parameter
	 */
	util.url_param = function(name) {
		
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if($.isArray(results)) {
			return results[1];
		} else {
			false;
		}
		
	};
	
	/*
	 * Copy and paste block of HTML
	 * ----------------------------------------------------------------
	 * @param   settings    	object 
	 * @return	settings.copy	object of copy element(s) passed
	 * @usage   util.copy_paste({ $('img') });
	 */
	util.copy_paste = function(settings) {
		
		var options = {
			copy : $("#copy"),
			paste : $("#paste"),
			onBefore : function() {},
			onAfter : function() {}
		};
		
		$.extend(options, settings);
	
		function init(settings) {
			
			if(settings.copy.length && settings.paste.length) {
				
				options.onBefore.call(options);
				
				var copy = settings.copy.html();
				if(settings.copy.length) {
					
					settings.paste.html(copy);
					options.onAfter.call(options);
					
				}
			};
			
			return options.copy;
			
		};
	
	};
	
	/*
	 * Validate form
	 * ----------------------------------------------------------------
	 */
	util.validateForm = function($form) {
	
		var isValid 	= true;
		var theResponse = "";
		var $fields 	= $form.find('.req');
		
		$fields.each(function(){
			$this = $(this);
			if( $this.hasClass('email') ){
				var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				if(reg.test($this.val()) == false) {
					isValid = false;
					theResponse = theResponse + "<li>" + $this.attr('data-error') + "</li>";
				}
			} else {
				if( $this.val() == '' || $this.val() == $this.attr('placeholder') ){
					isValid = false;
					theResponse = theResponse + "<li>" + $this.attr('data-error') + "</li>";
				}
			}
		});
		
		return {
				  valid : isValid, 
			theResponse : theResponse
		};
	
	};
	
	/*
	 * Time delay, delays function call
	 * ----------------------------------------------------------------
	 */
	util.time_delay = {
		interval : 1000,
		lastAJAXcall : null,
		theFunction : function(){},
		call : function() {
			this.lastCall = new Date().getTime();
			var that = this;
			setTimeout(function() {
				var currentTime = new Date().getTime();
				if(currentTime - that.lastCall > that.interval) {
					that.sendRequest();
				}
			},
			that.interval + 100);
		},
		sendRequest : function() {
			this.theFunction.call();
		}
	}; 
	
	/*
	 * Preload array of images
	 * ----------------------------------------------------------------
	 * @param   images      array of images
	 * @param   callback    function after images have been preloaded
	 * ----------------------------------------------------------------
	 * @usage   util.preload_images( $('img') );
	 */
	util.preload_images = function(images, callback) {
   
	    var gotime = images.length;
	   
	    $.each(images,function(e) {
	           
	        var $this = $(this);
	        var src = $this.prop('src');
	       
	        $(new Image()).load(function() {
	           
	            util.cache.push( src );
	           
	            if (--gotime < 1) {
	                if(typeof callback == 'function') {
	                    callback.call(images); 
	                };                     
	            };
	           
	        }).attr('src', src);
	       
	    });
	   
	};
	
	/*
	 * Serialize images into an array
	 * ----------------------------------------------------------------
	 * @param   images      jquery objects of images
	 * @param   callback    function after images have been preloaded
	 * ----------------------------------------------------------------
	 * @usage   util.serialize_imgs( $('img') );
	 */
	util.serialize_imgs = function(images) {
	   
	    var a = [];
	   
	    images.each(function() {
	        a.push( $(this).attr("src") );
	    });
	   
	    return a;
	   
	};
	
	/**
	 * Carousel only if the number of items has been reached
	 * -------------------------------------------------------
	 * @param	object		selector + carousel options
	 * @return	object
	 * @usage : 
	 * carousel({
	 * 		element : $( "#twitter_carousel" ), 
	 * 		options : {
	 * 			visible: 2,	
	 * 			btnNext: "#twitter .next",
	 * 			btnPrev: "#twitter .prev",
	 * 			easing: 'easeOutSine',
	 * 			mouseWheel: true,
	 * 			vertical: "true",
	 * 			speed: 300, 
	 * 			circular: false
	 * 		}
	 * });
	 * 
	 */
	util.carousel_lite = function(settings) {
		if(settings.element.find('li').length > settings.options.visible) {
			return settings.element.jCarouselLite(settings.options);
		}
	};

	/*
	 * Print page
	 * -------------------------------------------------------------------------------------------------------------
	 * @date				16th nov 2011
	 * @type				Util
	 * @usage				Print the page return false on click
	 * -------------------------------------------------------------------------------------------------------------
	 * @obj					jQuery element object		The element you want to attach the click event to
	 */
	util.print = function(obj) {
		obj.click(function() {
			window.print();
			return false;
		});
	}
	
	/*
	 * Reset form
	 * -----------------------------------------------------------------------------------
	 * @date				16th nov 2011
	 * @type				Util
	 * @usage				Reset form elements
	 * -----------------------------------------------------------------------------------
	 * @form				jQuery form object		The form you would like to reset
	 */
	util.reset_form = function(form) {
		
		// Use a whitelist of fields to minimize unintended side effects.
		form.find(':text, :password, :file, SELECT').val('');  
		
		// De-select any checkboxes, radios and drop-down menus
		form.find(':input').removeAttr('checked').removeAttr('selected');

	};
	
	/*
	 * Hide empty elements
	 * -----------------------------------------------------------------------------------
	 * @date				16th nov 2011
	 * @type				Util
	 * @usage				Hide empty elements
	 * -----------------------------------------------------------------------------------
	 * @elements			jQuery object	The selector that you want to loop through
	 * @hide_or_distroy		string			if hide then hide element else distroy
	 */
	util.hide_empty = function(elements, hide_or_distroy) {
		elements.each(function(i,k) {
			var $this = $(this);
			if($this.html() == "") {
				hide_or_distroy == "hide" ? $this.hide() : $this.remove(); 
			} 
		});
	};
	
	/*
	 * Toggle fade none empty elements
	 * -----------------------------------------------------------------------------------
	 * @date				16th nov 2011
	 * @type				Util
	 * @usage				Show none empty elements
	 * -----------------------------------------------------------------------------------
	 * @elements			jQuery object	The selector that you want to loop through
	 */
	util.show_none_empty = function(elements) {
		elements.each(function(i,k) {
			var $this = $(this);
			$this.html();
			$this.html() == "" ? $(this).hide() : $(this).show(); 
		});
	};
	
	/*
	 * Show none empty elements
	 * -----------------------------------------------------------------------------------
	 * @date				16th nov 2011
	 * @type				Util
	 * @usage				Show none empty elements
	 * -----------------------------------------------------------------------------------
	 * @elements			jQuery object	The selector that you want to loop through
	 */
	util.show_none_empty = function(elements) {
		elements.each(function(i,k) {
			var $this = $(this);
			$this.html();
			$this.html() == "" ? $(this).hide() : $(this).show(); 
		});
	};
	
	/*
	 * Add class to active links
	 * -----------------------------------------------------------------------------------
	 * @date		15th nov 2011
	 * @type		Util
	 * @usage		Sets a class to the active link, this is determined by the href the 
	 * 				link points to
	 * @example	1
	 * util.active_links({
	 * 	  onAfter : function() {
	 * 		 $(this).parents('li').find('> a').addClass('active')	
	 * 	  }
	 * });
	 * 
	 * @example	2
	 * util.active_links({
	 * 		exact : true,
	 * 		onBefore : function(url, currentUrl) {
	 * 			$('.breadcrumbs li a').each(function(i){
	 * 				if(i !== 0) {
	 * 					util.active_links({
	 *						url : $(this).attr('href'),
	 * 						exact : true
	 * 					});
	 * 				}
	 *			});
	 * 		}
	 * });
	 * 
	 * -----------------------------------------------------------------------------------
	 * @settings	object
	 * @settings 		-> function		onBefore		function passed on before set active link
	 * @settings 		-> function		onAfter			function passed on after set active link
	 * @settings 		-> string		className		class name given to active link
	 *
	 */
	util.active_links = function(settings) {
		
		var options = {
			url : null,
			selector : $("body"),
			onBefore : function() {},
			onAfter : function() {},
			className : 'active', 
			exact : false
		};
		
		$.extend(options, settings);
		
		var url = options.url ? options.url : util.get_url();
		var currentURL = url.toString().split("/");
		
		if(options.exact) {
			
			options.selector.find('a[href="' + url + '"]').each(function() {
				var $this = $(this);
				options.onBefore.call($(this), url, currentURL);
				$this.addClass(options.className);
				options.onAfter.call($(this), url, currentURL);
			});
			
		} else {

			var lastSeg = currentURL[currentURL.length-1];
			switch(lastSeg) {
				case "": 
				case "/":
					var $home_link = options.selector.find('a[href="/"]'); 
					options.onBefore.call($home_link, url, currentURL);
					$home_link.addClass(options.active);
					options.onAfter.call($home_link, url, currentURL);
				break;
				default: 			
					options.selector.find('a[href$="' + lastSeg + '"]').each(function() {
						var $this = $(this);
						options.onBefore.call($(this), url, currentURL);
						$this.addClass(options.className);
						options.onAfter.call($(this), url, currentURL);
					});
				break;
			}
			
		}
	
	};

	/*
	 * Slug it
	 * -----------------------------------------------------------------------------------
	 * @date		11th nov 2011
	 * @type		Util
	 * @usage		Removes more than 2 spaces from the given @sSlug replaces with 
	 * 				default '-' or by the given @sReplace. If the @sSlug contains '_' then 
	 * 				these will be replaced with '-' then all non alpha/numberic or '-' are
	 * 				removed. 
	 * -----------------------------------------------------------------------------------
	 * @sSlug		string	The string
	 * @sReplace	string	Replace the non alpha/numeric value with this string
	 */
	util.slug_it = function(sSlug, sReplace) {
		
		if(sReplace == "" || sReplace == undefined) {
			sReplace = "-";
		}
		
		sSlug = sSlug.toLowerCase();
		sSlug = sSlug.replace(/_/g,'-');
		sSlug = sSlug.replace(/^\s+|\s+$/g,'');
		sSlug = sSlug.replace(/[^a-z0-9-]+/g, sReplace);
		
		return sSlug;
		
	};
	
	/*
	 * Get the selected options from a passed @input
	 * -----------------------------------------------------------------------------------
	 * @date		11th nov 2011
	 * @type		Util
	 * @usage		returns selected options as an array 
	 * -----------------------------------------------------------------------------------
	 * @input		object	Dom input
	 * @aSelected	array	array of selected options
	 */
	util.get_selected_options = function($input) {
		
		var selected_opts = [];
		$input.find('option:selected').each(function(i, k) {
			selected_opts.push( $(this).text() );
		});
		
		return selected_opts;
	};
	
	/*
	 * Get the selected checkbox's from a passed @input
	 * -----------------------------------------------------------------------------------
	 * @date		11th nov 2011
	 * @type		Util
	 * @usage		returns selected checkbox's as an array 
	 * -----------------------------------------------------------------------------------
	 * @input		object	Dom input
	 * @aChecked	array	array of selected checkbox's
	 */
	util.get_selected_checkboxes = function($input, fCallbackLabal) {
		
		var aChecked = [];
		$('input:checkbox[name=' + util.jqescape($input.attr('name')) + ']:checked').each(function(i, k) {
			aChecked.push(fCallbackLabal.call($input));
		});
		
		return aChecked;
	};
	
	/*
	 * Escape brackets within a jquery selector
	 * -----------------------------------------------------------------------------------
	 * @date		11th nov 2011
	 * @type		Util
	 * @usage		returns name of selector escaping the "need to escape" characters
	 * -----------------------------------------------------------------------------------
	 * @str			string	name without escape
	 * @return		string	name with escape
	 */
	util.jqescape = function(str) {
		return str.replace(/[#;&,\.\+\*~':"!\^\$\[\]\(\)=>|\/\\]/g, '\\$&'); 
	};
	
	/*
	 * Array to spans
	 * -----------------------------------------------------------------------------------
	 * @date		11th nov 2011
	 * @type		Util
	 * @usage		returns array into spans
	 * -----------------------------------------------------------------------------------
	 * @array		array 	array to put into spans
	 * @sResponse	string	list of spans
	 */
	util.array_to_spans = function(array) {
		
		var sResponse = "";
		$.each(array, function(i,k) {
			if(k !== undefined) {
				sResponse += '<span>' + k + '</span>';
			}
		}); 
		
		return sResponse;
				
	};
	
	/*
	 * Array to class
	 * -----------------------------------------------------------------------------------
	 * @date		16th nov 2011
	 * @type		Util
	 * @usage		returns array into spans
	 * -----------------------------------------------------------------------------------
	 * @array		array 	array to put into spans
	 * @sResponse	string	list of spans
	 */
	util.array_to_classes = function(array, class_name) {
		
		var sResponse = "";
		$.each(array, function(i,k) {
			if(k !== undefined) {
				sResponse += '<div class="' + class_name + '">' + k + '</div>';
			}
		}); 
		
		return sResponse;
				
	};
	
	/*
	 * Object to ul
	 * -----------------------------------------------------------------------------------
	 * @date		17th nov 2011
	 * @type		Util
	 * @usage		returns array into ul
	 * -----------------------------------------------------------------------------------
	 * @array		array 	array to put into ul
	 * @sResponse	string	ul html
	 */
	util.array_to_ul = function(obj) {
	
		var sResponse = "";
	
		if(obj) {
		
			sResponse = '<ul>';
			$.each(obj, function(key, val) {
				sResponse += '<li>' + val + '</li>';
			});
			sResponse += '</ul>'
			
		};
		
		return sResponse;
	
	};

})(jQuery);




// Populate form - http://www.keyframesandcode.com/code/development/javascript/jquery-populate-plugin/
(function($){$.populate=function(f,g){$.each(f,function(b,c){var d=typeof c,element=$(g+' [name='+b+'],'+g+' [name='+b+'\\[\\]]'),check=element.is(':radio,:checkbox');if(d==='boolean'&&check)element.attr({checked:c?'checked':null});else if(d==='object'&&!$.isArray(c))for(var e in c)arguments.callee(b+'\\['+e+'\\]',c[e]);else element.val(check?$.makeArray(c).map(function(a){return a.toString()}):c)})};$.fn.extend({populate:function(b,c){if(!b)return this.reset();var d=this.selector;if(typeof b==='string')$.getJSON(b,c,function(a){$.populate(a,d)});else if(typeof b==='object')$.populate(b,d);return this},reset:function(){return this.filter('form').each(function(){this.reset()}).end()}})})(jQuery);

// Form Preview version 1.0
(function($){$.fn.form_preview=function(e){var f=jQuery.extend({placeholder:null,input:null,html:null,type:null,prefix:'field_',target:$("#js-chosen-options"),defaults:null,onChangeBefore:function(){},onChangeAfter:function(){},onComplete:function(){},checkboxLabel:function(){return this.parent().find('label').html()},radioLabel:function(a){return this.parent().find('label').html()}},e);var g=function(a){if(a.attr('name')==undefined){return false}var b=util.slug_it(f.prefix+a.attr('name'));if($("."+b).length==0){return $('<div class="'+b+'"></div>').appendTo(f.target)}else{return $("."+b)}};var h=$(this).find(':input:not([type=hidden])').not('.js-no-preview');var j=h.length-1;h.each(function(i){var b=$(this);var c=g(b);f.input=b;f.placeholder=c;if(f.input.attr('type')!==undefined){f.type=f.input.attr('type')}else if(f.input[0].tagName.toLowerCase()){f.type=f.input.attr('multiple')=="multiple"?'multiple':'select'}switch(f.type){case"checkbox":f.input.change(function(){var a=util.get_selected_checkboxes(b,f.checkboxLabel);f.html=util.array_to_spans(a);f.onChangeBefore.call(f);util.show_none_empty(c.hide().html(f.html));f.onChangeAfter.call(f)});b.change();break;case"select":case"multiple":f.input.change(function(){var a=util.get_selected_options(b);f.html=util.array_to_spans(a);f.onChangeBefore.call(f);util.show_none_empty(c.hide().html(f.html));f.onChangeAfter.call(f)});b.change();break;case"radio":f.input.change(function(){f.html=f.radioLabel.call(b);f.onChangeBefore.call(f);util.show_none_empty(c.hide().html(f.html));f.onChangeAfter.call(f)});var d=util.jqescape(b.attr('name'));$("[name='"+d+"']:checked").change();break}if(i==j){f.defaults=f.target.html();f.onComplete.call(f)}});return f}})(jQuery);


/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
/**
* jQuery Cookie plugin
*
* Copyright (c) 2010 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

(function($) {
	
	jQuery.usedColours = function() {
		
		// my colors array
		
		var colors = new Array();
		
		//get all elements
	    jQuery('*').each(function() {
	        
	        if($(this).attr('background-color') && $(this).css('background-color') != 'transparent') {
	        	colors.push($(this).css('background-color')); 
	        }
	        
	        if($(this).css('color')) {
	        	colors.push($(this).css('color'));
	        }
	        
	        if($(this).css('border-color')) {
	        	colors.push($(this).css('border-color'));
	        }
	        
	    });
	   
	    // remove dupes and sort
	    colors.sort();
	    
	    var $wrapper = $("<div />")
	    	.attr('íd', 'usedColours')
	    	.css({
	    		position:'fixed',
	    		bottom: '0px',
	    		left: '0px',
	    		width: '100%',
	    		display: 'block',
	    		zIndex: '1000'
	    	});
	    	
	    var blockCss = {
	    	display:'block',
	    	height:'30px',
	    	width: '30px',
	    	float:'left'
	    };
	    
	    var coloursDone = [];
	   
	    //create a color block for all of them
	    $.each(colors,function(it,value) {
	       
	        //if(!$('div[rel=\'' + value + '\']').length) {
	        if(jQuery.inArray(value, coloursDone) == -1) {
	       
	            // inject the wrapper
	            var wrapper_id = 'w' + it;
	            $wrapper.append('<div class="dwrapper" id="' + wrapper_id + '" rel="' + value + '"></div>');	
	           
	            // inject the color div
	            $wrapper.append('<div class="dcolor" style="display:block;width:100px;height:50px;background-color:' + value + '">' + value + '</div>');
	           
	            //inject text div	
	            //$wrapper.append('<div class="text" style="background-color:' + value + '">Color: ' + value + '</div>');

	         	coloursDone.push(value);   
	        }

		});
		
		// Append the whole thing to the body of the page
		$wrapper.appendTo('body');
		$('.dcolor').css(blockCss);

	}

})(jQuery);