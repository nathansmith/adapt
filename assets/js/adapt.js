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
  // <link rel="stylesheet" id="ADAPT_CSS" />
  var css = d.createElement('link');
  css.rel = 'stylesheet';
  css.id = 'ADAPT_CSS';

  // Empty vars to use later.
  var tag, url, url_old, timer;

  // Adapt to width.
  function adapt() {
    // Parse browser width.
    var x = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth || 0;

    // How many ranges?
    var i = range_len;

    // While loop vars.
    var arr, arr_0, val_1, val_2, is_range, file;

    while (i--) {
      arr = range[i].split('=');
      arr_0 = arr[0];
      is_range = !!arr_0.match('to');
      val_1 = is_range ? parseInt(arr_0.split('to')[0], 10) : parseInt(arr_0, 10);
      val_2 = is_range ? parseInt(arr_0.split('to')[1], 10) : undefined;
      file = arr[1].replace(/\s/g, '');

      if (i === range_len - 1 && x > val_1) {
        url = path + file;
        break;
      }
      else if (i === 0 && x <= val_1) {
        url = path + file;
        break;
      }
      else if (x > val_1 && x <= val_2) {
        url = path + file;
        break;
      }
    }

    // Was it created yet?
    if (!!tag && url_old !== url) {
      // If so, just set the URL.
      tag.href = url;
      url_old = url;
    }
    else {
      // If not, set URL and append to DOM.
      css.href = url;
      url_old = url;
      head.appendChild(css);
      tag = d.getElementById('ADAPT_CSS');
    }
  }

  // Fire off once.
  adapt();

  // Slight delay.
  function react() {
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

// Pass in window, document.
})(this, this.document, ADAPT_CONFIG);