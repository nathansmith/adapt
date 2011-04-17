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

  // Alias config values.
  var path = config.path;
  var dynamic = config.dynamic;
  var range = config.range;
  var range_len = range.length;

  // Use faster document.head if possible.
  var head = d.head || d.getElementsByTagName('head')[0];

  // Create empty link tag:
  // <link rel="stylesheet" />
  var css = d.createElement('link');
  css.rel = 'stylesheet';

  // Empty vars to use later.
  var url, url_old, timer;

  // Adapt to width.
  function adapt() {
    // This clearInterval is for IE.
    // Really it belongs in react(),
    // but doesn't do any harm here.
    clearInterval(timer);

    // Parse browser width.
    var x = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth || 0;

    // How many ranges?
    var i = range_len;

    // While loop vars.
    var arr, arr_0, val_1, val_2, is_range, file;

    while (i--) {
      // Turn string into array.
      arr = range[i].split('=');

      // Width is to the left of "=".
      arr_0 = arr[0];

      // File name is to the right of "=".
      // Presuppoes a file with no spaces.
      file = arr[1].replace(/\s/g, '');

      // Assume min/max if "to" isn't present.
      is_range = arr_0.match('to');

      // If it's a range, split left/right sides of "to",
      // and then convert each one into numerical values.
      // If it's not a range, turn min/max into a number.
      val_1 = is_range ? parseInt(arr_0.split('to')[0], 10) : parseInt(arr_0, 10);
      val_2 = is_range ? parseInt(arr_0.split('to')[1], 10) : undefined;

      // Built full URL to CSS file.
      url = path + file;

      if (i === range_len - 1 && x > val_1) {
        break;
      }
      else if (i === 0 && x <= val_1) {
        break;
      }
      else if (x > val_1 && x <= val_2) {
        break;
      }
    }

    // Was it created yet?
    if (url_old && url_old !== url) {
      // If so, just set the URL.
      css.href = url;
      url_old = url;
    }
    else {
      // If not, set URL and append to DOM.
      css.href = url;
      url_old = url;
      head.appendChild(css);
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
  if (dynamic) {
    // Event listeners for window
    // resize and phone rotation.
    if (w.addEventListener) {
      // Good browsers.
      w.addEventListener('resize', react, false);
      w.addEventListener('orientationchange', react, false);
    }
    else if (w.attachEvent) {
      // Legacy IE versions.
      w.attachEvent('onresize', react);
      w.attachEvent('onorientationchange', react);
    }
    else {
      // Old-school fallback.
      w.onresize = react;
      w.onorientationchange = react;
    }
  }

// Pass in window, document, config.
})(this, this.document, ADAPT_CONFIG);