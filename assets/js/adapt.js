/*
  Adapt.js licensed under GPL and MIT.

  Read more here: http://adapt.960.gs/
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
  var ranges = config.range;

  // Use faster document.head if possible.
  var head = d.head || d.getElementsByTagName('head')[0];

  // Create empty link tag:
  // <link rel="stylesheet" id="ADAPT_CSS" />
  var css = d.createElement('link');
  css.rel = 'stylesheet';
  css.id = 'ADAPT_CSS';

  // Empty vars to use later.
  var tag, url, timer, tag, tag_href;

  // Adapt to width.
  function adapt() {
    // This clearInterval is for IE.
    // Really it belongs in react(),
    // but doesn't do any harm here.
    clearInterval(timer);

    // Parse browser width.
    var x = w.innerWidth || d.documentElement.clientWidth || d.body.clientWidth || 0;

    // loop vars:
    var rules, val_lt, val_gt;

    for (var file in ranges) if (Object.prototype.hasOwnProperty.call(ranges, file)) {
      val_lt = undefined;
      val_gt = 0;
      rules = ranges[file];

      if (typeof rules === 'string') {
        val_lt = parseInt(rules, 10);
      } else if (typeof rules === 'number') {
        val_lt = rules;
      } else {
        // must be an object
        if (rules.gt) {
          val_gt = typeof rules.gt === 'string' ? parseInt(rules.gt, 10) : rules.gt;
        }

        if (rules.lt) {
          val_lt = typeof rules.lt === 'string' ? parseInt(rules.lt, 10) : rules.lt;
        }
      }

      if (val_lt !== undefined && (x > val_gt && x <= val_lt)) {
        url = path + file;
        break;
      } else if (val_lt === undefined && (x >= val_gt)) {
        url = path + file;
        break;
      } // else continue
    }

    if (tag) {
      tag_href = tag.href;

      if (tag_href.substr(tag_href.length - url.length) === url) {
        // Don't change urls
        return;
      } else {
        // If so, just set the URL.
        tag.href = url;
      }
    } else {
      // If not, set URL and append to DOM.
      css.href = url;
      head.appendChild(css);
      tag = d.getElementById('ADAPT_CSS');
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

// Pass in window, document.
})(this, this.document, ADAPT_CONFIG);