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

// Element.closest() polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
// needed to support IE9
(function () {
  if (!Element.prototype.matches)
      Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                  Element.prototype.webkitMatchesSelector;

  if (!Element.prototype.closest)
      Element.prototype.closest = function(s) {
          var el = this;
          if (!document.documentElement.contains(el)) return null;
          do {
              if (el.matches(s)) return el;
              el = el.parentElement || el.parentNode;
          } while (el !== null && el.nodeType === 1); 
          return null;
      };
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

var ANIMATION_PREFIX = 'animation__';
var ANIMATION_DURATION = {
  default: 300,
  'show-modal': 1300,
}
var ANIMATION_BUFFER = 160;
var ENTER = 'enter';
var EXIT = 'exit';

function positionVideo(player, container) {
  return Promise.all([
      player.getVideoWidth(),
      player.getVideoHeight()
    ])
    .then(function(dimensions) {
      var video_width = dimensions[0];
      var video_height = dimensions[1];
      var video_aspect = video_height / video_width;
      var window_aspect = window.innerHeight / window.innerWidth;
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

function containVideo(node_to_resize, node_to_measure) {
  // assume 16:9
  var video_width = 480;
  var video_height = 270;
  var video_aspect = video_height / video_width;

  var window_width = node_to_measure === window ? window.innerWidth : node_to_measure.offsetWidth;
  var window_height = node_to_measure === window ? window.innerHeight : node_to_measure.offsetHeight;
  var window_aspect = window_height / window_width;

  var scaled_width = 0;
  var scaled_height = 0;

  if (window_aspect > video_aspect) {
    scaled_width = window_width;
    scaled_height = Math.ceil((video_height * window_width) / video_width);
    node_to_resize.style.top = Math.ceil((window_height - scaled_height) / 2) + 'px';
    node_to_resize.style.left = '0px';
  } else {
    scaled_width = Math.ceil((video_width * window_height) / video_height);
    scaled_height = window_height;
    node_to_resize.style.top = '0px';
    node_to_resize.style.left = Math.ceil((window_width - scaled_width) / 2) + 'px';
  }

  node_to_resize.style.height = scaled_height + 'px';
  node_to_resize.style.width = scaled_width + 'px';

  return new Promise(function(resolve){
    window.requestAnimationFrame(resolve);
  });
}

function animationClass(animation_name, enter_exit, is_active) {
  return ANIMATION_PREFIX + animation_name + '__' + enter_exit + (is_active ? '-active' : '');
}

function removeAnimation(node, animation_name, enter_exit) {
  return new Promise(function(resolve) {
    node.classList.remove(
      animationClass(animation_name, enter_exit),
      animationClass(animation_name, enter_exit, true)
    );
    window.requestAnimationFrame(resolve);
  });
}

function runAnimation(node, animation_name, enter_exit) {
  return new Promise(function (resolve) {
    var start_time = Date.now();
    var duration = ANIMATION_DURATION[animation_name] || ANIMATION_DURATION.default;

    function tick() {
      var now = Date.now();
      if (now > start_time + duration + ANIMATION_BUFFER) {
        removeAnimation(node, animation_name, enter_exit);
        resolve(now - start_time);
      } else {
        window.requestAnimationFrame(tick);
      }
    }

    node.classList.add(animationClass(animation_name, enter_exit, true));
    window.requestAnimationFrame(tick);
  });
}

function prepAnimation(node, animation_name, enter_exit) {
  return new Promise(function(resolve){
    node.classList.add(animationClass(animation_name, enter_exit));
    window.requestAnimationFrame(resolve);
  });
}

function classListPromise(node, method, className) {
  return new Promise(function(resolve) {
    node.classList[method](className);
    window.requestAnimationFrame(resolve);
  });
}

function initDemoModal(bg_player) {
  var modal = document.querySelector('[data-js="modal"]');
  var modal_open_btn = document.querySelector('[data-modal="open-btn"]');
  var modal_close_btn = modal.querySelector('[data-modal="close-btn"]');
  var node_to_measure = modal.querySelector('[data-modal="node-to-measure"]');
  var node_to_resize = modal.querySelector('[data-modal="node-to-resize"]');
  var video_id = parseInt(modal_open_btn.getAttribute('data-demo-video-id'), 10);
  var target = modal.querySelector('[data-demo-video-target]');
  var player = null;

  function resizeVideo() {
    return containVideo(node_to_resize, node_to_measure);
  }

  function showModal(e) {
    e.preventDefault();
    bg_player.pause();

    prepAnimation(modal, 'show-modal', ENTER)
      .then(function() {
        return classListPromise(modal, 'add', 'is-open');
      })
      .then(function(){
        return resizeVideo();
      })
      .then(function(){
        return runAnimation(modal, 'show-modal', ENTER);
      })
      .then(function(){
        player = new Vimeo.Player(
          target,
          {
            id: video_id,
            autoplay: false,
            autopause: true,
            background: false,
            loop: false,
            playsinline: false,
          }
        );
      });

    window.addEventListener('throttledResize', resizeVideo, false);
  }

  function hideModal(e) {
    e.preventDefault();

    prepAnimation(modal, 'show-modal', EXIT)
      .then(function(){
        return runAnimation(modal, 'show-modal', EXIT);
      })
      .then(function() {
        return classListPromise(modal, 'remove', 'is-open');
      })
      .then(function(){
        player.destroy();
        bg_player.play();
      });
  }

  modal_open_btn.addEventListener('click', showModal);
  modal_close_btn.addEventListener('click', hideModal);
}

function initBgVideo() {
  if (!window.Vimeo) {
    console.warn('Vimeo player.js not loaded!');
    return;
  }

  var bg_video_container = document.querySelector('[data-js="bg-video"');
  var player_container = bg_video_container.querySelector('[data-bg-video-player-target]');
  var video_player = new Vimeo.Player(
    player_container,
    {
      id: bg_video_container.getAttribute('data-bg-video-id'),
      autoplay: true,
      autopause: true,
      background: true,
      loop: true,
      playsinline: true,
    }
  );

  // There is a black pseudo-element covering the video before it loads
  // adding .loaded hides this screen, creating a fade-in effect
  video_player.on('bufferend', function(e){
    bg_video_container.classList.add('js-loaded');
  });

  function positionBgVideo() {
    return positionVideo(video_player, player_container);
  }

  window.addEventListener('throttledResize', positionBgVideo, false);
  positionBgVideo();

  return video_player;
}

document.addEventListener('DOMContentLoaded', function(event) {
  var bg_video_player = initBgVideo();
  initDemoModal(bg_video_player);
}, false);
