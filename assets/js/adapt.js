/*
  Adapt.js licensed under GPL and MIT.

  Read more here: http://adapt.960.gs
*/

// Closure.
(function(w, d, config, undefined) {
  // If no config, exit.
  if (!config) {
    return;
  }

  // Empty vars to use later.
  var url, url_old, timer, class_name, class_name_old;

  // Alias config values.
  var path = config.path;
  var range = config.range;
  var range_len = range.length;

  // Create empty link tag:
  // <link rel="stylesheet" />
  var css = d.createElement('link');
  css.rel = 'stylesheet';
  
  
  //Cache html-tag
  var docElement = document.documentElement;

  // Adapt to width.
  function adapt() {
    // This clearInterval is for IE.
    // Really it belongs in react(),
    // but doesn't do any harm here.
    clearInterval(timer);

    // Parse browser width.
    var width = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth || 0;

    // While loop vars.
    var arr, arr_0, val_1, val_2, is_range, file, fileClass;

    // How many ranges?
    var i = range_len;
    var last = range_len - 1;

    while (i--) {
      // Turn string into array.
      arr = range[i].split('=');

      // Width is to the left of "=".
      arr_0 = arr[0];

      // File name is to the right of "=".
      // Presuppoes a file with no spaces.
      file = arr[1].replace(/\s/g, '');
      
      // Check for pipes (||) and get ClassName for range
      if(file.('\\|\\|')){
      	fileClass =  file.split('||');
      	file = fileClass[0];
      	class = fileClass[1];
      }

      // Assume min/max if "to" isn't present.
      is_range = arr_0.match('to');

      // If it's a range, split left/right sides of "to",
      // and then convert each one into numerical values.
      // If it's not a range, turn maximum into a number.
      val_1 = is_range ? parseInt(arr_0.split('to')[0], 10) : parseInt(arr_0, 10);
      val_2 = is_range ? parseInt(arr_0.split('to')[1], 10) : undefined;

      // Check for maxiumum or range and url
      if ((!val_2 && i === last && width > val_1) || (width > val_1 && width <= val_2)) {
        // Built full URL to CSS file.
        if(file){
			url = path + file;
		}
		if(class){
        	class_name = class;
        }
        break;
      }
      else {
        // Blank if no conditions met.
        url = '';
        class_name = '';
        
      }
    }

    // Was it created yet?
    if (!url_old && url) {
      // If not, set URL and append to DOM.
      css.href = url;
      url_old = url;
      // Use faster document.head if possible.
      (d.head || d.getElementsByTagName('head')[0]).appendChild(css);
    }
    else if ((url_old !== url)) {
      // If so, just set the URL.
      css.href = url;
      url_old = url;
    }
    
    
    // Was it addes yet?
    if (!class_name_old && class_name) {
      // If not, set ClassName and add to HTML-Tag.
      class_name_old = class_name;
      // Add Classname
      docElement.className += ' ' + class_name + ' ';
    }
    else if ((class_name_old !== class_name)) {
      // replace Classname
      var class_regexp = new RegExp(class_name_old);
	  docElement.className = docElement.className.replace(class_regexp, class_name);
      class_name_old = class_name;
    }
    
    
  }

  // Fire off once.
  adapt();

  // Slight delay.
  function react() {
    // Clear interval as window resize fires,
    // so that it only calls adapt() when the
    // user has finished resizing the window.
    clearInterval(timer);
    timer = setInterval(adapt, 100);
  }

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

// Pass in window, document, config, undefined.
})(this, this.document, ADAPT_CONFIG);