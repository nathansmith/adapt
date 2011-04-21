/*
  Adapt.js licensed under GPL and MIT.

  Read more here: http://adapt.960.gs
*/

// Closure.
(function(config, w, d, undefined) {
  // If no config, exit.
  if (!config) {
    return;
  }

  // Empty vars to use later.
  var url, url_old, timer;

  // Alias config values.
  var range = config.range;
  var range_len = range.length;

  // Create empty link tag:
  // <link rel="stylesheet" />
  var css = d.createElement('link');
  css.rel = 'stylesheet';

  // Adapt to width.
  function adapt() {
    // This clearInterval is for IE.
    // Really it belongs in react(),
    // but doesn't do any harm here.
    clearInterval(timer);

    // Parse browser width.
    var x = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth || 0;

    // While loop vars.
    var arr, arr_0, val_1, val_2, is_range, file;

    // How many ranges?
    var i = range_len;

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

      // Check if it's max, min, range.
      if ((i === range_len - 1 && x > val_1) || (i === 0 && x <= val_1) || (x > val_1 && x <= val_2)) {
        // Built full URL to CSS file.
        url = config.path + file;
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
      // Use faster document.head if possible.
      (d.head || d.getElementsByTagName('head')[0]).appendChild(css);
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
    w.addEventListener ? w.addEventListener('resize', react, false) : w.attachEvent('onresize', react);
  }

// config, window, document, etc.
})(ADAPT_CONFIG, this, this.document);