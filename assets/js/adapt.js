// JSLint settings:
/*global
  ADAPT_CONFIG,
  clearTimeout,
  setTimeout
*/

/*
  Adapt.js licensed under GPL and MIT.

  Read more here: http://adapt.960.gs
*/

// Closure.
(function (w, d, config, undefined) {
	// If no config, exit.
	if (!config) {
		return;
	}

	// Empty vars to use later.
	var docHead, docBody, bodyClass, url, url_old, timer, css, css_old;

	// Alias config values.
	var callback = config.callback || function () { },
		path = config.path ? config.path : '',
		range = config.range,
		range_len = range.length;

	function setupAdapt() {
		d.removeEventListener( "DOMContentLoaded", setupAdapt );

		// Cache <head> and <body> element reference
		// Use faster document.head and document.body if possible.
		docHead = (d.head || d.getElementsByTagName('head')[0]);
		docBody = (d.body || d.getElementsByTagName('body')[0]);
		bodyClass = '';

		// Get existing link tag if cssId was provided
		if (config.cssId)
			css = d.getElementById(config.cssId);

		// Fire off once.
		adapt();

		// Do we want to watch for
		// resize and device tilt?
		if (config.dynamic) {
			// Event listener for window resize,
			// also triggered by phone rotation.
			if (w.addEventListener) {
				// Good browsers.
				w.addEventListener('resize', react, false);
			}
			else if (w.attachEvent) {
				// Legacy IE support.
				w.attachEvent('onresize', react);
			}
			else {
				// Old-school fallback.
				w.onresize = react;
			}
		}
	}

	// Called from within adapt().
	function change(i, width, linkElement) {
		// Set the URL.
		linkElement.href = url;
		url_old = url;

		linkElement.onload = function () {
			// Remove old css
			if(css_old) {
				docHead.removeChild(css_old);
				css_old = undefined;
			}
			// Fire callback.
			callback(i, width);
		};
	}

	// Adapt to width.
	function adapt() {
		// This clearTimeout is for IE.
		// Really it belongs in react(),
		// but doesn't do any harm here.
		clearTimeout(timer);
		
		// Remove old css
		if(css_old) {
			docHead.removeChild(css_old);
			css_old = undefined;
		}

		// Parse viewport width.
		var width = d.documentElement ? d.documentElement.clientWidth : 0;

		// While loop vars.
		var arr, arr_0, val_1, val_2, is_range, file;

		// How many ranges?
		var i = range_len;
		var last = range_len - 1;

		// Start with blank URL.
		url = undefined;

		while (i--) {

			// Find first occurance of "=".
			equalPos = range[i].indexOf('=');

			// Width is to the left of "=".
			arr_0 = range[i].substr(0, equalPos);

			// File name is to the right of "=".
			// Presuppoes a file with no spaces.
			// If no file specified, make empty.
			file = range[i].substr(equalPos+1);
			file = file ? file.replace(/\s/g, '') : undefined;

			// Assume max if "to" isn't present.
			is_range = arr_0.match('to');

			// If it's a range, split left/right sides of "to",
			// and then convert each one into numerical values.
			// If it's not a range, turn maximum into a number.
			val_1 = is_range ? parseInt(arr_0.split('to')[0], 10) : parseInt(arr_0, 10);
			val_2 = is_range ? parseInt(arr_0.split('to')[1], 10) : undefined;

			// Check for maxiumum or range.
			if ((!val_2 && i === last && width > val_1) || (width > val_1 && width <= val_2)) {
				// Build full URL to CSS file.
				file && (url = path + file);

				// Exit the while loop. No need to continue
				// if we've already found a matching range.
				break;
			}
		}
		
		// Update css link tag, only if css url has changed
		if (url && (!url_old || url_old !== url)) {
			if (css) {
				if(css.href !== url) {
					// Create empty link tag:
					// <link rel="stylesheet" />
					var newCss = d.createElement('link');
					newCss.rel = 'stylesheet';
					newCss.media = css.media;
					newCss.id = css.id;
					// Apply changes.
					change(i, width, newCss);
					
					// Prevent overflowing flash of content
					css_old = css;
					css_old.id += '_old'; //Prevent duplicate IDs
					
					// Preserve css load order with graceful content stepping
					if(css.nextSibling)
						docHead.insertBefore(newCss, css.nextSibling);
					else
						docHead.appendChild(newCss);
					css = newCss;
				} else {
					// Fire callback even if css link element wasn't changed.
					url_old = url;
					callback(i, width);
				}
			} else {
				// Create empty link tag:
				// <link rel="stylesheet" />
				css = d.createElement('link');
				css.rel = 'stylesheet';
				css.media = 'screen';
				// Apply changes.
				change(i, width, css);

				// Append css to end of head
				docHead.appendChild(css);
			}

			// Update css body class
			// Remove bodyClass
			if (bodyClass.length && docBody.classList.contains(bodyClass))
				docBody.classList.remove(bodyClass);

			bodyClass = '_' + css.href.split('/').pop().split('.')[0];
				
			// Add bodyClass
			docBody.classList.add(bodyClass);
		}
	}

	// Slight delay.
	function react() {
		// Clear the timer as window resize fires,
		// so that it only calls adapt() when the
		// user has finished resizing the window.
		clearTimeout(timer);

		// Start the timer countdown.
		timer = setTimeout(adapt, 20);
		// -----------------------^^
		// Note: 20 milliseconds is lowest "safe"
		// duration for setTimeout and setInterval.
	}
	
	// Setup adapt after DOM is loaded
	if ( d.readyState === "complete" ||
		( d.readyState !== "loading" && !d.documentElement.doScroll ) ) {
		setupAdapt();
	} else {
		d.addEventListener( "DOMContentLoaded", setupAdapt );
	}

	// Pass in window, document, config, undefined.
})(this, this.document, ADAPT_CONFIG);
