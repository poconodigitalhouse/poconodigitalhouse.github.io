// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// https://gist.github.com/paulirish/1579671
// MIT license
// needed to support IE9
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// classList polyfill by Remy Sharp
// https://github.com/remy/polyfills/blob/master/classList.js
// BSD License
// needed to support IE9
(function () {
  if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

  var prototype = Array.prototype,
      push = prototype.push,
      splice = prototype.splice,
      join = prototype.join;

  function DOMTokenList(el) {
    this.el = el;
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  };

  DOMTokenList.prototype = {
    add: function(token) {
      if(this.contains(token)) return;
      push.call(this, token);
      this.el.className = this.toString();
    },
    contains: function(token) {
      return this.el.className.indexOf(token) != -1;
    },
    item: function(index) {
      return this[index] || null;
    },
    remove: function(token) {
      if (!this.contains(token)) return;
      for (var i = 0; i < this.length; i++) {
        if (this[i] == token) break;
      }
      splice.call(this, i, 1);
      this.el.className = this.toString();
    },
    toString: function() {
      return join.call(this, ' ');
    },
    toggle: function(token) {
      if (!this.contains(token)) {
        this.add(token);
      } else {
        this.remove(token);
      }

      return this.contains(token);
    }
  };

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter (obj, prop, getter) {
      if (Object.defineProperty) {
          Object.defineProperty(obj, prop,{
              get : getter
          });
      } else {
          obj.__defineGetter__(prop, getter);
      }
  }

  defineElementGetter(Element.prototype, 'classList', function () {
    return new DOMTokenList(this);
  });
})();

// customEvent polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
// needed to support IE9
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

// throttledResize customEvent
// https://developer.mozilla.org/en-US/docs/Web/Events/resize
(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    throttle("resize", "throttledResize");
})();

/* ---------------------------------------- */
/* ---------------------------------------- */
/* ---------------------------------------- */

function initBgVideo() {
  if (!window.Vimeo) {
    console.warn('Vimeo player.js not loaded!');
    return;
  }

  var video_iframe = document.querySelector('#home-page-video');
  var bg_player = new Vimeo.Player(video_iframe);

  function positionBgVideo() {
    Promise.all([
        bg_player.getVideoWidth(),
        bg_player.getVideoHeight()
      ])
      .then(function(dimensions) {
        var video_width = dimensions[0];
        var video_height = dimensions[1];
        var video_aspect = video_height / video_width;
        var window_aspect = window.innerHeight / window.innerWidth;
        var container = video_iframe.parentNode;
        var scaled_width = 0;
        var scaled_height = 0;

        if (window_aspect > video_aspect) {
          scaled_width = Math.ceil((video_width * window.innerHeight) / video_height);
          scaled_height = window.innerHeight;
          container.style.top = '0px';
          container.style.left = Math.ceil((window.innerWidth - scaled_width) / 2) + 'px';
        } else {
          scaled_width = window.innerWidth;
          scaled_height = Math.ceil((video_height * window.innerWidth) / video_width);
          container.style.top = Math.ceil((window.innerHeight - scaled_height) / 2) + 'px';
          container.style.left = '0px';
        }

        container.style.height = scaled_height + 'px';
        container.style.width = scaled_width + 'px';
      });
  }

  window.addEventListener('throttledResize', positionBgVideo, false);
  positionBgVideo();

  // var testId = 76979871;
  // var node = document.getElementById('bg-play-pause');
  // node.addEventListener('click', function(e) {
  //   e.preventDefault();
  //   bg_player
  //     .getPaused()
  //     .then(function(paused) {
  //       if (paused) {
  //         bg_player.play();
  //       } else {
  //         bg_player.pause();
  //       }
  //     })
  // });
}

// (function ( document, window ) {
//   'use strict';
// })(document, window);

document.addEventListener('DOMContentLoaded', function(event) {
  initBgVideo();
}, false);


