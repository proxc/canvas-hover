// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../.nvm/versions/node/v14.9.0/lib/node_modules/parcel/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"tween.js/dist/tween.umd.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TWEEN = {}));
})(this, function (exports) {
  'use strict';
  /**
   * The Ease class provides a collection of easing functions for use with tween.js.
   */

  var Easing = {
    Linear: {
      None: function None(amount) {
        return amount;
      }
    },
    Quadratic: {
      In: function In(amount) {
        return amount * amount;
      },
      Out: function Out(amount) {
        return amount * (2 - amount);
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount;
        }

        return -0.5 * (--amount * (amount - 2) - 1);
      }
    },
    Cubic: {
      In: function In(amount) {
        return amount * amount * amount;
      },
      Out: function Out(amount) {
        return --amount * amount * amount + 1;
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount * amount;
        }

        return 0.5 * ((amount -= 2) * amount * amount + 2);
      }
    },
    Quartic: {
      In: function In(amount) {
        return amount * amount * amount * amount;
      },
      Out: function Out(amount) {
        return 1 - --amount * amount * amount * amount;
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount * amount * amount;
        }

        return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
      }
    },
    Quintic: {
      In: function In(amount) {
        return amount * amount * amount * amount * amount;
      },
      Out: function Out(amount) {
        return --amount * amount * amount * amount * amount + 1;
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount * amount * amount * amount;
        }

        return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
      }
    },
    Sinusoidal: {
      In: function In(amount) {
        return 1 - Math.cos(amount * Math.PI / 2);
      },
      Out: function Out(amount) {
        return Math.sin(amount * Math.PI / 2);
      },
      InOut: function InOut(amount) {
        return 0.5 * (1 - Math.cos(Math.PI * amount));
      }
    },
    Exponential: {
      In: function In(amount) {
        return amount === 0 ? 0 : Math.pow(1024, amount - 1);
      },
      Out: function Out(amount) {
        return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
      },
      InOut: function InOut(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        if ((amount *= 2) < 1) {
          return 0.5 * Math.pow(1024, amount - 1);
        }

        return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
      }
    },
    Circular: {
      In: function In(amount) {
        return 1 - Math.sqrt(1 - amount * amount);
      },
      Out: function Out(amount) {
        return Math.sqrt(1 - --amount * amount);
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
        }

        return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
      }
    },
    Elastic: {
      In: function In(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
      },
      Out: function Out(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
      },
      InOut: function InOut(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        amount *= 2;

        if (amount < 1) {
          return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
        }

        return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
      }
    },
    Back: {
      In: function In(amount) {
        var s = 1.70158;
        return amount * amount * ((s + 1) * amount - s);
      },
      Out: function Out(amount) {
        var s = 1.70158;
        return --amount * amount * ((s + 1) * amount + s) + 1;
      },
      InOut: function InOut(amount) {
        var s = 1.70158 * 1.525;

        if ((amount *= 2) < 1) {
          return 0.5 * (amount * amount * ((s + 1) * amount - s));
        }

        return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
      }
    },
    Bounce: {
      In: function In(amount) {
        return 1 - Easing.Bounce.Out(1 - amount);
      },
      Out: function Out(amount) {
        if (amount < 1 / 2.75) {
          return 7.5625 * amount * amount;
        } else if (amount < 2 / 2.75) {
          return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
        } else if (amount < 2.5 / 2.75) {
          return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
        } else {
          return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
        }
      },
      InOut: function InOut(amount) {
        if (amount < 0.5) {
          return Easing.Bounce.In(amount * 2) * 0.5;
        }

        return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
      }
    }
  };
  var now; // Include a performance.now polyfill.
  // In node.js, use process.hrtime.
  // eslint-disable-next-line
  // @ts-ignore

  if (typeof self === 'undefined' && typeof process !== 'undefined' && process.hrtime) {
    now = function now() {
      // eslint-disable-next-line
      // @ts-ignore
      var time = process.hrtime(); // Convert [seconds, nanoseconds] to milliseconds.

      return time[0] * 1000 + time[1] / 1000000;
    };
  } // In a browser, use self.performance.now if it is available.
  else if (typeof self !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
      // This must be bound, because directly assigning this function
      // leads to an invocation exception in Chrome.
      now = self.performance.now.bind(self.performance);
    } // Use Date.now if it is available.
    else if (Date.now !== undefined) {
        now = Date.now;
      } // Otherwise, use 'new Date().getTime()'.
      else {
          now = function now() {
            return new Date().getTime();
          };
        }

  var now$1 = now;
  /**
   * Controlling groups of tweens
   *
   * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
   * In these cases, you may want to create your own smaller groups of tween
   */

  var Group =
  /** @class */
  function () {
    function Group() {
      this._tweens = {};
      this._tweensAddedDuringUpdate = {};
    }

    Group.prototype.getAll = function () {
      var _this = this;

      return Object.keys(this._tweens).map(function (tweenId) {
        return _this._tweens[tweenId];
      });
    };

    Group.prototype.removeAll = function () {
      this._tweens = {};
    };

    Group.prototype.add = function (tween) {
      this._tweens[tween.getId()] = tween;
      this._tweensAddedDuringUpdate[tween.getId()] = tween;
    };

    Group.prototype.remove = function (tween) {
      delete this._tweens[tween.getId()];
      delete this._tweensAddedDuringUpdate[tween.getId()];
    };

    Group.prototype.update = function (time, preserve) {
      if (time === void 0) {
        time = now$1();
      }

      if (preserve === void 0) {
        preserve = false;
      }

      var tweenIds = Object.keys(this._tweens);

      if (tweenIds.length === 0) {
        return false;
      } // Tweens are updated in "batches". If you add a new tween during an
      // update, then the new tween will be updated in the next batch.
      // If you remove a tween during an update, it may or may not be updated.
      // However, if the removed tween was added during the current batch,
      // then it will not be updated.


      while (tweenIds.length > 0) {
        this._tweensAddedDuringUpdate = {};

        for (var i = 0; i < tweenIds.length; i++) {
          var tween = this._tweens[tweenIds[i]];
          var autoStart = !preserve;

          if (tween && tween.update(time, autoStart) === false && !preserve) {
            delete this._tweens[tweenIds[i]];
          }
        }

        tweenIds = Object.keys(this._tweensAddedDuringUpdate);
      }

      return true;
    };

    return Group;
  }();
  /**
   *
   */


  var Interpolation = {
    Linear: function Linear(v, k) {
      var m = v.length - 1;
      var f = m * k;
      var i = Math.floor(f);
      var fn = Interpolation.Utils.Linear;

      if (k < 0) {
        return fn(v[0], v[1], f);
      }

      if (k > 1) {
        return fn(v[m], v[m - 1], m - f);
      }

      return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },
    Bezier: function Bezier(v, k) {
      var b = 0;
      var n = v.length - 1;
      var pw = Math.pow;
      var bn = Interpolation.Utils.Bernstein;

      for (var i = 0; i <= n; i++) {
        b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
      }

      return b;
    },
    CatmullRom: function CatmullRom(v, k) {
      var m = v.length - 1;
      var f = m * k;
      var i = Math.floor(f);
      var fn = Interpolation.Utils.CatmullRom;

      if (v[0] === v[m]) {
        if (k < 0) {
          i = Math.floor(f = m * (1 + k));
        }

        return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
      } else {
        if (k < 0) {
          return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
        }

        if (k > 1) {
          return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
        }

        return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
      }
    },
    Utils: {
      Linear: function Linear(p0, p1, t) {
        return (p1 - p0) * t + p0;
      },
      Bernstein: function Bernstein(n, i) {
        var fc = Interpolation.Utils.Factorial;
        return fc(n) / fc(i) / fc(n - i);
      },
      Factorial: function () {
        var a = [1];
        return function (n) {
          var s = 1;

          if (a[n]) {
            return a[n];
          }

          for (var i = n; i > 1; i--) {
            s *= i;
          }

          a[n] = s;
          return s;
        };
      }(),
      CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {
        var v0 = (p2 - p0) * 0.5;
        var v1 = (p3 - p1) * 0.5;
        var t2 = t * t;
        var t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
      }
    }
  };
  /**
   * Utils
   */

  var Sequence =
  /** @class */
  function () {
    function Sequence() {}

    Sequence.nextId = function () {
      return Sequence._nextId++;
    };

    Sequence._nextId = 0;
    return Sequence;
  }();

  var mainGroup = new Group();
  /**
   * Tween.js - Licensed under the MIT license
   * https://github.com/tweenjs/tween.js
   * ----------------------------------------------
   *
   * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
   * Thank you all, you're awesome!
   */

  var Tween =
  /** @class */
  function () {
    function Tween(_object, _group) {
      if (_group === void 0) {
        _group = mainGroup;
      }

      this._object = _object;
      this._group = _group;
      this._isPaused = false;
      this._pauseStart = 0;
      this._valuesStart = {};
      this._valuesEnd = {};
      this._valuesStartRepeat = {};
      this._duration = 1000;
      this._initialRepeat = 0;
      this._repeat = 0;
      this._yoyo = false;
      this._isPlaying = false;
      this._reversed = false;
      this._delayTime = 0;
      this._startTime = 0;
      this._easingFunction = Easing.Linear.None;
      this._interpolationFunction = Interpolation.Linear; // eslint-disable-next-line

      this._chainedTweens = [];
      this._onStartCallbackFired = false;
      this._id = Sequence.nextId();
      this._isChainStopped = false;
      this._goToEnd = false;
    }

    Tween.prototype.getId = function () {
      return this._id;
    };

    Tween.prototype.isPlaying = function () {
      return this._isPlaying;
    };

    Tween.prototype.isPaused = function () {
      return this._isPaused;
    };

    Tween.prototype.to = function (properties, duration) {
      // TODO? restore this, then update the 07_dynamic_to example to set fox
      // tween's to on each update. That way the behavior is opt-in (there's
      // currently no opt-out).
      // for (const prop in properties) this._valuesEnd[prop] = properties[prop]
      this._valuesEnd = Object.create(properties);

      if (duration !== undefined) {
        this._duration = duration;
      }

      return this;
    };

    Tween.prototype.duration = function (d) {
      if (d === void 0) {
        d = 1000;
      }

      this._duration = d;
      return this;
    };

    Tween.prototype.start = function (time) {
      if (this._isPlaying) {
        return this;
      } // eslint-disable-next-line


      this._group && this._group.add(this);
      this._repeat = this._initialRepeat;

      if (this._reversed) {
        // If we were reversed (f.e. using the yoyo feature) then we need to
        // flip the tween direction back to forward.
        this._reversed = false;

        for (var property in this._valuesStartRepeat) {
          this._swapEndStartRepeatValues(property);

          this._valuesStart[property] = this._valuesStartRepeat[property];
        }
      }

      this._isPlaying = true;
      this._isPaused = false;
      this._onStartCallbackFired = false;
      this._isChainStopped = false;
      this._startTime = time !== undefined ? typeof time === 'string' ? now$1() + parseFloat(time) : time : now$1();
      this._startTime += this._delayTime;

      this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat);

      return this;
    };

    Tween.prototype._setupProperties = function (_object, _valuesStart, _valuesEnd, _valuesStartRepeat) {
      for (var property in _valuesEnd) {
        var startValue = _object[property];
        var startValueIsArray = Array.isArray(startValue);
        var propType = startValueIsArray ? 'array' : _typeof(startValue);
        var isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]); // If `to()` specifies a property that doesn't exist in the source object,
        // we should not set that property in the object

        if (propType === 'undefined' || propType === 'function') {
          continue;
        } // Check if an Array was provided as property value


        if (isInterpolationList) {
          var endValues = _valuesEnd[property];

          if (endValues.length === 0) {
            continue;
          } // handle an array of relative values


          endValues = endValues.map(this._handleRelativeValue.bind(this, startValue)); // Create a local copy of the Array with the start value at the front

          _valuesEnd[property] = [startValue].concat(endValues);
        } // handle the deepness of the values


        if ((propType === 'object' || startValueIsArray) && startValue && !isInterpolationList) {
          _valuesStart[property] = startValueIsArray ? [] : {}; // eslint-disable-next-line

          for (var prop in startValue) {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _valuesStart[property][prop] = startValue[prop];
          }

          _valuesStartRepeat[property] = startValueIsArray ? [] : {}; // TODO? repeat nested values? And yoyo? And array values?
          // eslint-disable-next-line
          // @ts-ignore FIXME?

          this._setupProperties(startValue, _valuesStart[property], _valuesEnd[property], _valuesStartRepeat[property]);
        } else {
          // Save the starting value, but only once.
          if (typeof _valuesStart[property] === 'undefined') {
            _valuesStart[property] = startValue;
          }

          if (!startValueIsArray) {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
          }

          if (isInterpolationList) {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
          } else {
            _valuesStartRepeat[property] = _valuesStart[property] || 0;
          }
        }
      }
    };

    Tween.prototype.stop = function () {
      if (!this._isChainStopped) {
        this._isChainStopped = true;
        this.stopChainedTweens();
      }

      if (!this._isPlaying) {
        return this;
      } // eslint-disable-next-line


      this._group && this._group.remove(this);
      this._isPlaying = false;
      this._isPaused = false;

      if (this._onStopCallback) {
        this._onStopCallback(this._object);
      }

      return this;
    };

    Tween.prototype.end = function () {
      this._goToEnd = true;
      this.update(Infinity);
      return this;
    };

    Tween.prototype.pause = function (time) {
      if (time === void 0) {
        time = now$1();
      }

      if (this._isPaused || !this._isPlaying) {
        return this;
      }

      this._isPaused = true;
      this._pauseStart = time; // eslint-disable-next-line

      this._group && this._group.remove(this);
      return this;
    };

    Tween.prototype.resume = function (time) {
      if (time === void 0) {
        time = now$1();
      }

      if (!this._isPaused || !this._isPlaying) {
        return this;
      }

      this._isPaused = false;
      this._startTime += time - this._pauseStart;
      this._pauseStart = 0; // eslint-disable-next-line

      this._group && this._group.add(this);
      return this;
    };

    Tween.prototype.stopChainedTweens = function () {
      for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
        this._chainedTweens[i].stop();
      }

      return this;
    };

    Tween.prototype.group = function (group) {
      if (group === void 0) {
        group = mainGroup;
      }

      this._group = group;
      return this;
    };

    Tween.prototype.delay = function (amount) {
      if (amount === void 0) {
        amount = 0;
      }

      this._delayTime = amount;
      return this;
    };

    Tween.prototype.repeat = function (times) {
      if (times === void 0) {
        times = 0;
      }

      this._initialRepeat = times;
      this._repeat = times;
      return this;
    };

    Tween.prototype.repeatDelay = function (amount) {
      this._repeatDelayTime = amount;
      return this;
    };

    Tween.prototype.yoyo = function (yoyo) {
      if (yoyo === void 0) {
        yoyo = false;
      }

      this._yoyo = yoyo;
      return this;
    };

    Tween.prototype.easing = function (easingFunction) {
      if (easingFunction === void 0) {
        easingFunction = Easing.Linear.None;
      }

      this._easingFunction = easingFunction;
      return this;
    };

    Tween.prototype.interpolation = function (interpolationFunction) {
      if (interpolationFunction === void 0) {
        interpolationFunction = Interpolation.Linear;
      }

      this._interpolationFunction = interpolationFunction;
      return this;
    }; // eslint-disable-next-line


    Tween.prototype.chain = function () {
      var tweens = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        tweens[_i] = arguments[_i];
      }

      this._chainedTweens = tweens;
      return this;
    };

    Tween.prototype.onStart = function (callback) {
      this._onStartCallback = callback;
      return this;
    };

    Tween.prototype.onUpdate = function (callback) {
      this._onUpdateCallback = callback;
      return this;
    };

    Tween.prototype.onRepeat = function (callback) {
      this._onRepeatCallback = callback;
      return this;
    };

    Tween.prototype.onComplete = function (callback) {
      this._onCompleteCallback = callback;
      return this;
    };

    Tween.prototype.onStop = function (callback) {
      this._onStopCallback = callback;
      return this;
    };
    /**
     * @returns true if the tween is still playing after the update, false
     * otherwise (calling update on a paused tween still returns true because
     * it is still playing, just paused).
     */


    Tween.prototype.update = function (time, autoStart) {
      if (time === void 0) {
        time = now$1();
      }

      if (autoStart === void 0) {
        autoStart = true;
      }

      if (this._isPaused) return true;
      var property;
      var elapsed;
      var endTime = this._startTime + this._duration;

      if (!this._goToEnd && !this._isPlaying) {
        if (time > endTime) return false;
        if (autoStart) this.start(time);
      }

      this._goToEnd = false;

      if (time < this._startTime) {
        return true;
      }

      if (this._onStartCallbackFired === false) {
        if (this._onStartCallback) {
          this._onStartCallback(this._object);
        }

        this._onStartCallbackFired = true;
      }

      elapsed = (time - this._startTime) / this._duration;
      elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;

      var value = this._easingFunction(elapsed); // properties transformations


      this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);

      if (this._onUpdateCallback) {
        this._onUpdateCallback(this._object, elapsed);
      }

      if (elapsed === 1) {
        if (this._repeat > 0) {
          if (isFinite(this._repeat)) {
            this._repeat--;
          } // Reassign starting values, restart by making startTime = now


          for (property in this._valuesStartRepeat) {
            if (!this._yoyo && typeof this._valuesEnd[property] === 'string') {
              this._valuesStartRepeat[property] = // eslint-disable-next-line
              // @ts-ignore FIXME?
              this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
            }

            if (this._yoyo) {
              this._swapEndStartRepeatValues(property);
            }

            this._valuesStart[property] = this._valuesStartRepeat[property];
          }

          if (this._yoyo) {
            this._reversed = !this._reversed;
          }

          if (this._repeatDelayTime !== undefined) {
            this._startTime = time + this._repeatDelayTime;
          } else {
            this._startTime = time + this._delayTime;
          }

          if (this._onRepeatCallback) {
            this._onRepeatCallback(this._object);
          }

          return true;
        } else {
          if (this._onCompleteCallback) {
            this._onCompleteCallback(this._object);
          }

          for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            // Make the chained tweens start exactly at the time they should,
            // even if the `update()` method was called way past the duration of the tween
            this._chainedTweens[i].start(this._startTime + this._duration);
          }

          this._isPlaying = false;
          return false;
        }
      }

      return true;
    };

    Tween.prototype._updateProperties = function (_object, _valuesStart, _valuesEnd, value) {
      for (var property in _valuesEnd) {
        // Don't update properties that do not exist in the source object
        if (_valuesStart[property] === undefined) {
          continue;
        }

        var start = _valuesStart[property] || 0;
        var end = _valuesEnd[property];
        var startIsArray = Array.isArray(_object[property]);
        var endIsArray = Array.isArray(end);
        var isInterpolationList = !startIsArray && endIsArray;

        if (isInterpolationList) {
          _object[property] = this._interpolationFunction(end, value);
        } else if (_typeof(end) === 'object' && end) {
          // eslint-disable-next-line
          // @ts-ignore FIXME?
          this._updateProperties(_object[property], start, end, value);
        } else {
          // Parses relative end values with start as base (e.g.: +10, -3)
          end = this._handleRelativeValue(start, end); // Protect against non numeric properties.

          if (typeof end === 'number') {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _object[property] = start + (end - start) * value;
          }
        }
      }
    };

    Tween.prototype._handleRelativeValue = function (start, end) {
      if (typeof end !== 'string') {
        return end;
      }

      if (end.charAt(0) === '+' || end.charAt(0) === '-') {
        return start + parseFloat(end);
      } else {
        return parseFloat(end);
      }
    };

    Tween.prototype._swapEndStartRepeatValues = function (property) {
      var tmp = this._valuesStartRepeat[property];
      var endValue = this._valuesEnd[property];

      if (typeof endValue === 'string') {
        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue);
      } else {
        this._valuesStartRepeat[property] = this._valuesEnd[property];
      }

      this._valuesEnd[property] = tmp;
    };

    return Tween;
  }();

  var VERSION = '18.6.4';
  /**
   * Tween.js - Licensed under the MIT license
   * https://github.com/tweenjs/tween.js
   * ----------------------------------------------
   *
   * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
   * Thank you all, you're awesome!
   */

  var nextId = Sequence.nextId;
  /**
   * Controlling groups of tweens
   *
   * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
   * In these cases, you may want to create your own smaller groups of tweens.
   */

  var TWEEN = mainGroup; // This is the best way to export things in a way that's compatible with both ES
  // Modules and CommonJS, without build hacks, and so as not to break the
  // existing API.
  // https://github.com/rollup/rollup/issues/1961#issuecomment-423037881

  var getAll = TWEEN.getAll.bind(TWEEN);
  var removeAll = TWEEN.removeAll.bind(TWEEN);
  var add = TWEEN.add.bind(TWEEN);
  var remove = TWEEN.remove.bind(TWEEN);
  var update = TWEEN.update.bind(TWEEN);
  var exports$1 = {
    Easing: Easing,
    Group: Group,
    Interpolation: Interpolation,
    now: now$1,
    Sequence: Sequence,
    nextId: nextId,
    Tween: Tween,
    VERSION: VERSION,
    getAll: getAll,
    removeAll: removeAll,
    add: add,
    remove: remove,
    update: update
  };
  exports.Easing = Easing;
  exports.Group = Group;
  exports.Interpolation = Interpolation;
  exports.Sequence = Sequence;
  exports.Tween = Tween;
  exports.VERSION = VERSION;
  exports.add = add;
  exports.default = exports$1;
  exports.getAll = getAll;
  exports.nextId = nextId;
  exports.now = now$1;
  exports.remove = remove;
  exports.removeAll = removeAll;
  exports.update = update;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
},{"process":"../../.nvm/versions/node/v14.9.0/lib/node_modules/parcel/node_modules/process/browser.js"}],"js/tween.umd.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TWEEN = {}));
})(this, function (exports) {
  'use strict';
  /**
   * The Ease class provides a collection of easing functions for use with tween.js.
   */

  var Easing = {
    Linear: {
      None: function None(amount) {
        return amount;
      }
    },
    Quadratic: {
      In: function In(amount) {
        return amount * amount;
      },
      Out: function Out(amount) {
        return amount * (2 - amount);
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount;
        }

        return -0.5 * (--amount * (amount - 2) - 1);
      }
    },
    Cubic: {
      In: function In(amount) {
        return amount * amount * amount;
      },
      Out: function Out(amount) {
        return --amount * amount * amount + 1;
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount * amount;
        }

        return 0.5 * ((amount -= 2) * amount * amount + 2);
      }
    },
    Quartic: {
      In: function In(amount) {
        return amount * amount * amount * amount;
      },
      Out: function Out(amount) {
        return 1 - --amount * amount * amount * amount;
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount * amount * amount;
        }

        return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
      }
    },
    Quintic: {
      In: function In(amount) {
        return amount * amount * amount * amount * amount;
      },
      Out: function Out(amount) {
        return --amount * amount * amount * amount * amount + 1;
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return 0.5 * amount * amount * amount * amount * amount;
        }

        return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
      }
    },
    Sinusoidal: {
      In: function In(amount) {
        return 1 - Math.cos(amount * Math.PI / 2);
      },
      Out: function Out(amount) {
        return Math.sin(amount * Math.PI / 2);
      },
      InOut: function InOut(amount) {
        return 0.5 * (1 - Math.cos(Math.PI * amount));
      }
    },
    Exponential: {
      In: function In(amount) {
        return amount === 0 ? 0 : Math.pow(1024, amount - 1);
      },
      Out: function Out(amount) {
        return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
      },
      InOut: function InOut(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        if ((amount *= 2) < 1) {
          return 0.5 * Math.pow(1024, amount - 1);
        }

        return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
      }
    },
    Circular: {
      In: function In(amount) {
        return 1 - Math.sqrt(1 - amount * amount);
      },
      Out: function Out(amount) {
        return Math.sqrt(1 - --amount * amount);
      },
      InOut: function InOut(amount) {
        if ((amount *= 2) < 1) {
          return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
        }

        return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
      }
    },
    Elastic: {
      In: function In(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
      },
      Out: function Out(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
      },
      InOut: function InOut(amount) {
        if (amount === 0) {
          return 0;
        }

        if (amount === 1) {
          return 1;
        }

        amount *= 2;

        if (amount < 1) {
          return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
        }

        return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
      }
    },
    Back: {
      In: function In(amount) {
        var s = 1.70158;
        return amount * amount * ((s + 1) * amount - s);
      },
      Out: function Out(amount) {
        var s = 1.70158;
        return --amount * amount * ((s + 1) * amount + s) + 1;
      },
      InOut: function InOut(amount) {
        var s = 1.70158 * 1.525;

        if ((amount *= 2) < 1) {
          return 0.5 * (amount * amount * ((s + 1) * amount - s));
        }

        return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
      }
    },
    Bounce: {
      In: function In(amount) {
        return 1 - Easing.Bounce.Out(1 - amount);
      },
      Out: function Out(amount) {
        if (amount < 1 / 2.75) {
          return 7.5625 * amount * amount;
        } else if (amount < 2 / 2.75) {
          return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
        } else if (amount < 2.5 / 2.75) {
          return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
        } else {
          return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
        }
      },
      InOut: function InOut(amount) {
        if (amount < 0.5) {
          return Easing.Bounce.In(amount * 2) * 0.5;
        }

        return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
      }
    }
  };
  var now; // Include a performance.now polyfill.
  // In node.js, use process.hrtime.
  // eslint-disable-next-line
  // @ts-ignore

  if (typeof self === 'undefined' && typeof process !== 'undefined' && process.hrtime) {
    now = function now() {
      // eslint-disable-next-line
      // @ts-ignore
      var time = process.hrtime(); // Convert [seconds, nanoseconds] to milliseconds.

      return time[0] * 1000 + time[1] / 1000000;
    };
  } // In a browser, use self.performance.now if it is available.
  else if (typeof self !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
      // This must be bound, because directly assigning this function
      // leads to an invocation exception in Chrome.
      now = self.performance.now.bind(self.performance);
    } // Use Date.now if it is available.
    else if (Date.now !== undefined) {
        now = Date.now;
      } // Otherwise, use 'new Date().getTime()'.
      else {
          now = function now() {
            return new Date().getTime();
          };
        }

  var now$1 = now;
  /**
   * Controlling groups of tweens
   *
   * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
   * In these cases, you may want to create your own smaller groups of tween
   */

  var Group =
  /** @class */
  function () {
    function Group() {
      this._tweens = {};
      this._tweensAddedDuringUpdate = {};
    }

    Group.prototype.getAll = function () {
      var _this = this;

      return Object.keys(this._tweens).map(function (tweenId) {
        return _this._tweens[tweenId];
      });
    };

    Group.prototype.removeAll = function () {
      this._tweens = {};
    };

    Group.prototype.add = function (tween) {
      this._tweens[tween.getId()] = tween;
      this._tweensAddedDuringUpdate[tween.getId()] = tween;
    };

    Group.prototype.remove = function (tween) {
      delete this._tweens[tween.getId()];
      delete this._tweensAddedDuringUpdate[tween.getId()];
    };

    Group.prototype.update = function (time, preserve) {
      if (time === void 0) {
        time = now$1();
      }

      if (preserve === void 0) {
        preserve = false;
      }

      var tweenIds = Object.keys(this._tweens);

      if (tweenIds.length === 0) {
        return false;
      } // Tweens are updated in "batches". If you add a new tween during an
      // update, then the new tween will be updated in the next batch.
      // If you remove a tween during an update, it may or may not be updated.
      // However, if the removed tween was added during the current batch,
      // then it will not be updated.


      while (tweenIds.length > 0) {
        this._tweensAddedDuringUpdate = {};

        for (var i = 0; i < tweenIds.length; i++) {
          var tween = this._tweens[tweenIds[i]];
          var autoStart = !preserve;

          if (tween && tween.update(time, autoStart) === false && !preserve) {
            delete this._tweens[tweenIds[i]];
          }
        }

        tweenIds = Object.keys(this._tweensAddedDuringUpdate);
      }

      return true;
    };

    return Group;
  }();
  /**
   *
   */


  var Interpolation = {
    Linear: function Linear(v, k) {
      var m = v.length - 1;
      var f = m * k;
      var i = Math.floor(f);
      var fn = Interpolation.Utils.Linear;

      if (k < 0) {
        return fn(v[0], v[1], f);
      }

      if (k > 1) {
        return fn(v[m], v[m - 1], m - f);
      }

      return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },
    Bezier: function Bezier(v, k) {
      var b = 0;
      var n = v.length - 1;
      var pw = Math.pow;
      var bn = Interpolation.Utils.Bernstein;

      for (var i = 0; i <= n; i++) {
        b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
      }

      return b;
    },
    CatmullRom: function CatmullRom(v, k) {
      var m = v.length - 1;
      var f = m * k;
      var i = Math.floor(f);
      var fn = Interpolation.Utils.CatmullRom;

      if (v[0] === v[m]) {
        if (k < 0) {
          i = Math.floor(f = m * (1 + k));
        }

        return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
      } else {
        if (k < 0) {
          return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
        }

        if (k > 1) {
          return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
        }

        return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
      }
    },
    Utils: {
      Linear: function Linear(p0, p1, t) {
        return (p1 - p0) * t + p0;
      },
      Bernstein: function Bernstein(n, i) {
        var fc = Interpolation.Utils.Factorial;
        return fc(n) / fc(i) / fc(n - i);
      },
      Factorial: function () {
        var a = [1];
        return function (n) {
          var s = 1;

          if (a[n]) {
            return a[n];
          }

          for (var i = n; i > 1; i--) {
            s *= i;
          }

          a[n] = s;
          return s;
        };
      }(),
      CatmullRom: function CatmullRom(p0, p1, p2, p3, t) {
        var v0 = (p2 - p0) * 0.5;
        var v1 = (p3 - p1) * 0.5;
        var t2 = t * t;
        var t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
      }
    }
  };
  /**
   * Utils
   */

  var Sequence =
  /** @class */
  function () {
    function Sequence() {}

    Sequence.nextId = function () {
      return Sequence._nextId++;
    };

    Sequence._nextId = 0;
    return Sequence;
  }();

  var mainGroup = new Group();
  /**
   * Tween.js - Licensed under the MIT license
   * https://github.com/tweenjs/tween.js
   * ----------------------------------------------
   *
   * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
   * Thank you all, you're awesome!
   */

  var Tween =
  /** @class */
  function () {
    function Tween(_object, _group) {
      if (_group === void 0) {
        _group = mainGroup;
      }

      this._object = _object;
      this._group = _group;
      this._isPaused = false;
      this._pauseStart = 0;
      this._valuesStart = {};
      this._valuesEnd = {};
      this._valuesStartRepeat = {};
      this._duration = 1000;
      this._initialRepeat = 0;
      this._repeat = 0;
      this._yoyo = false;
      this._isPlaying = false;
      this._reversed = false;
      this._delayTime = 0;
      this._startTime = 0;
      this._easingFunction = Easing.Linear.None;
      this._interpolationFunction = Interpolation.Linear; // eslint-disable-next-line

      this._chainedTweens = [];
      this._onStartCallbackFired = false;
      this._id = Sequence.nextId();
      this._isChainStopped = false;
      this._goToEnd = false;
    }

    Tween.prototype.getId = function () {
      return this._id;
    };

    Tween.prototype.isPlaying = function () {
      return this._isPlaying;
    };

    Tween.prototype.isPaused = function () {
      return this._isPaused;
    };

    Tween.prototype.to = function (properties, duration) {
      // TODO? restore this, then update the 07_dynamic_to example to set fox
      // tween's to on each update. That way the behavior is opt-in (there's
      // currently no opt-out).
      // for (const prop in properties) this._valuesEnd[prop] = properties[prop]
      this._valuesEnd = Object.create(properties);

      if (duration !== undefined) {
        this._duration = duration;
      }

      return this;
    };

    Tween.prototype.duration = function (d) {
      if (d === void 0) {
        d = 1000;
      }

      this._duration = d;
      return this;
    };

    Tween.prototype.start = function (time) {
      if (this._isPlaying) {
        return this;
      } // eslint-disable-next-line


      this._group && this._group.add(this);
      this._repeat = this._initialRepeat;

      if (this._reversed) {
        // If we were reversed (f.e. using the yoyo feature) then we need to
        // flip the tween direction back to forward.
        this._reversed = false;

        for (var property in this._valuesStartRepeat) {
          this._swapEndStartRepeatValues(property);

          this._valuesStart[property] = this._valuesStartRepeat[property];
        }
      }

      this._isPlaying = true;
      this._isPaused = false;
      this._onStartCallbackFired = false;
      this._isChainStopped = false;
      this._startTime = time !== undefined ? typeof time === 'string' ? now$1() + parseFloat(time) : time : now$1();
      this._startTime += this._delayTime;

      this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat);

      return this;
    };

    Tween.prototype._setupProperties = function (_object, _valuesStart, _valuesEnd, _valuesStartRepeat) {
      for (var property in _valuesEnd) {
        var startValue = _object[property];
        var startValueIsArray = Array.isArray(startValue);
        var propType = startValueIsArray ? 'array' : _typeof(startValue);
        var isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]); // If `to()` specifies a property that doesn't exist in the source object,
        // we should not set that property in the object

        if (propType === 'undefined' || propType === 'function') {
          continue;
        } // Check if an Array was provided as property value


        if (isInterpolationList) {
          var endValues = _valuesEnd[property];

          if (endValues.length === 0) {
            continue;
          } // handle an array of relative values


          endValues = endValues.map(this._handleRelativeValue.bind(this, startValue)); // Create a local copy of the Array with the start value at the front

          _valuesEnd[property] = [startValue].concat(endValues);
        } // handle the deepness of the values


        if ((propType === 'object' || startValueIsArray) && startValue && !isInterpolationList) {
          _valuesStart[property] = startValueIsArray ? [] : {}; // eslint-disable-next-line

          for (var prop in startValue) {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _valuesStart[property][prop] = startValue[prop];
          }

          _valuesStartRepeat[property] = startValueIsArray ? [] : {}; // TODO? repeat nested values? And yoyo? And array values?
          // eslint-disable-next-line
          // @ts-ignore FIXME?

          this._setupProperties(startValue, _valuesStart[property], _valuesEnd[property], _valuesStartRepeat[property]);
        } else {
          // Save the starting value, but only once.
          if (typeof _valuesStart[property] === 'undefined') {
            _valuesStart[property] = startValue;
          }

          if (!startValueIsArray) {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
          }

          if (isInterpolationList) {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
          } else {
            _valuesStartRepeat[property] = _valuesStart[property] || 0;
          }
        }
      }
    };

    Tween.prototype.stop = function () {
      if (!this._isChainStopped) {
        this._isChainStopped = true;
        this.stopChainedTweens();
      }

      if (!this._isPlaying) {
        return this;
      } // eslint-disable-next-line


      this._group && this._group.remove(this);
      this._isPlaying = false;
      this._isPaused = false;

      if (this._onStopCallback) {
        this._onStopCallback(this._object);
      }

      return this;
    };

    Tween.prototype.end = function () {
      this._goToEnd = true;
      this.update(Infinity);
      return this;
    };

    Tween.prototype.pause = function (time) {
      if (time === void 0) {
        time = now$1();
      }

      if (this._isPaused || !this._isPlaying) {
        return this;
      }

      this._isPaused = true;
      this._pauseStart = time; // eslint-disable-next-line

      this._group && this._group.remove(this);
      return this;
    };

    Tween.prototype.resume = function (time) {
      if (time === void 0) {
        time = now$1();
      }

      if (!this._isPaused || !this._isPlaying) {
        return this;
      }

      this._isPaused = false;
      this._startTime += time - this._pauseStart;
      this._pauseStart = 0; // eslint-disable-next-line

      this._group && this._group.add(this);
      return this;
    };

    Tween.prototype.stopChainedTweens = function () {
      for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
        this._chainedTweens[i].stop();
      }

      return this;
    };

    Tween.prototype.group = function (group) {
      if (group === void 0) {
        group = mainGroup;
      }

      this._group = group;
      return this;
    };

    Tween.prototype.delay = function (amount) {
      if (amount === void 0) {
        amount = 0;
      }

      this._delayTime = amount;
      return this;
    };

    Tween.prototype.repeat = function (times) {
      if (times === void 0) {
        times = 0;
      }

      this._initialRepeat = times;
      this._repeat = times;
      return this;
    };

    Tween.prototype.repeatDelay = function (amount) {
      this._repeatDelayTime = amount;
      return this;
    };

    Tween.prototype.yoyo = function (yoyo) {
      if (yoyo === void 0) {
        yoyo = false;
      }

      this._yoyo = yoyo;
      return this;
    };

    Tween.prototype.easing = function (easingFunction) {
      if (easingFunction === void 0) {
        easingFunction = Easing.Linear.None;
      }

      this._easingFunction = easingFunction;
      return this;
    };

    Tween.prototype.interpolation = function (interpolationFunction) {
      if (interpolationFunction === void 0) {
        interpolationFunction = Interpolation.Linear;
      }

      this._interpolationFunction = interpolationFunction;
      return this;
    }; // eslint-disable-next-line


    Tween.prototype.chain = function () {
      var tweens = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        tweens[_i] = arguments[_i];
      }

      this._chainedTweens = tweens;
      return this;
    };

    Tween.prototype.onStart = function (callback) {
      this._onStartCallback = callback;
      return this;
    };

    Tween.prototype.onUpdate = function (callback) {
      this._onUpdateCallback = callback;
      return this;
    };

    Tween.prototype.onRepeat = function (callback) {
      this._onRepeatCallback = callback;
      return this;
    };

    Tween.prototype.onComplete = function (callback) {
      this._onCompleteCallback = callback;
      return this;
    };

    Tween.prototype.onStop = function (callback) {
      this._onStopCallback = callback;
      return this;
    };
    /**
     * @returns true if the tween is still playing after the update, false
     * otherwise (calling update on a paused tween still returns true because
     * it is still playing, just paused).
     */


    Tween.prototype.update = function (time, autoStart) {
      if (time === void 0) {
        time = now$1();
      }

      if (autoStart === void 0) {
        autoStart = true;
      }

      if (this._isPaused) return true;
      var property;
      var elapsed;
      var endTime = this._startTime + this._duration;

      if (!this._goToEnd && !this._isPlaying) {
        if (time > endTime) return false;
        if (autoStart) this.start(time);
      }

      this._goToEnd = false;

      if (time < this._startTime) {
        return true;
      }

      if (this._onStartCallbackFired === false) {
        if (this._onStartCallback) {
          this._onStartCallback(this._object);
        }

        this._onStartCallbackFired = true;
      }

      elapsed = (time - this._startTime) / this._duration;
      elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;

      var value = this._easingFunction(elapsed); // properties transformations


      this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);

      if (this._onUpdateCallback) {
        this._onUpdateCallback(this._object, elapsed);
      }

      if (elapsed === 1) {
        if (this._repeat > 0) {
          if (isFinite(this._repeat)) {
            this._repeat--;
          } // Reassign starting values, restart by making startTime = now


          for (property in this._valuesStartRepeat) {
            if (!this._yoyo && typeof this._valuesEnd[property] === 'string') {
              this._valuesStartRepeat[property] = // eslint-disable-next-line
              // @ts-ignore FIXME?
              this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
            }

            if (this._yoyo) {
              this._swapEndStartRepeatValues(property);
            }

            this._valuesStart[property] = this._valuesStartRepeat[property];
          }

          if (this._yoyo) {
            this._reversed = !this._reversed;
          }

          if (this._repeatDelayTime !== undefined) {
            this._startTime = time + this._repeatDelayTime;
          } else {
            this._startTime = time + this._delayTime;
          }

          if (this._onRepeatCallback) {
            this._onRepeatCallback(this._object);
          }

          return true;
        } else {
          if (this._onCompleteCallback) {
            this._onCompleteCallback(this._object);
          }

          for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            // Make the chained tweens start exactly at the time they should,
            // even if the `update()` method was called way past the duration of the tween
            this._chainedTweens[i].start(this._startTime + this._duration);
          }

          this._isPlaying = false;
          return false;
        }
      }

      return true;
    };

    Tween.prototype._updateProperties = function (_object, _valuesStart, _valuesEnd, value) {
      for (var property in _valuesEnd) {
        // Don't update properties that do not exist in the source object
        if (_valuesStart[property] === undefined) {
          continue;
        }

        var start = _valuesStart[property] || 0;
        var end = _valuesEnd[property];
        var startIsArray = Array.isArray(_object[property]);
        var endIsArray = Array.isArray(end);
        var isInterpolationList = !startIsArray && endIsArray;

        if (isInterpolationList) {
          _object[property] = this._interpolationFunction(end, value);
        } else if (_typeof(end) === 'object' && end) {
          // eslint-disable-next-line
          // @ts-ignore FIXME?
          this._updateProperties(_object[property], start, end, value);
        } else {
          // Parses relative end values with start as base (e.g.: +10, -3)
          end = this._handleRelativeValue(start, end); // Protect against non numeric properties.

          if (typeof end === 'number') {
            // eslint-disable-next-line
            // @ts-ignore FIXME?
            _object[property] = start + (end - start) * value;
          }
        }
      }
    };

    Tween.prototype._handleRelativeValue = function (start, end) {
      if (typeof end !== 'string') {
        return end;
      }

      if (end.charAt(0) === '+' || end.charAt(0) === '-') {
        return start + parseFloat(end);
      } else {
        return parseFloat(end);
      }
    };

    Tween.prototype._swapEndStartRepeatValues = function (property) {
      var tmp = this._valuesStartRepeat[property];
      var endValue = this._valuesEnd[property];

      if (typeof endValue === 'string') {
        this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue);
      } else {
        this._valuesStartRepeat[property] = this._valuesEnd[property];
      }

      this._valuesEnd[property] = tmp;
    };

    return Tween;
  }();

  var VERSION = '18.6.4';
  /**
   * Tween.js - Licensed under the MIT license
   * https://github.com/tweenjs/tween.js
   * ----------------------------------------------
   *
   * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
   * Thank you all, you're awesome!
   */

  var nextId = Sequence.nextId;
  /**
   * Controlling groups of tweens
   *
   * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
   * In these cases, you may want to create your own smaller groups of tweens.
   */

  var TWEEN = mainGroup; // This is the best way to export things in a way that's compatible with both ES
  // Modules and CommonJS, without build hacks, and so as not to break the
  // existing API.
  // https://github.com/rollup/rollup/issues/1961#issuecomment-423037881

  var getAll = TWEEN.getAll.bind(TWEEN);
  var removeAll = TWEEN.removeAll.bind(TWEEN);
  var add = TWEEN.add.bind(TWEEN);
  var remove = TWEEN.remove.bind(TWEEN);
  var update = TWEEN.update.bind(TWEEN);
  var exports$1 = {
    Easing: Easing,
    Group: Group,
    Interpolation: Interpolation,
    now: now$1,
    Sequence: Sequence,
    nextId: nextId,
    Tween: Tween,
    VERSION: VERSION,
    getAll: getAll,
    removeAll: removeAll,
    add: add,
    remove: remove,
    update: update
  };
  exports.Easing = Easing;
  exports.Group = Group;
  exports.Interpolation = Interpolation;
  exports.Sequence = Sequence;
  exports.Tween = Tween;
  exports.VERSION = VERSION;
  exports.add = add;
  exports.default = exports$1;
  exports.getAll = getAll;
  exports.nextId = nextId;
  exports.now = now$1;
  exports.remove = remove;
  exports.removeAll = removeAll;
  exports.update = update;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
},{"process":"../../.nvm/versions/node/v14.9.0/lib/node_modules/parcel/node_modules/process/browser.js"}],"js/hover-canvas.js":[function(require,module,exports) {
var _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../tween.js/dist/tween.umd"),
    Tween = _require.Tween;

window.TWEEN = require("/js/tween.umd.js");

var PathHelper = /*#__PURE__*/function () {
  function PathHelper(pathString) {
    _classCallCheck(this, PathHelper);

    _defineProperty(this, "points", []);

    _defineProperty(this, "path", "");

    _defineProperty(this, "commands", []);

    if (pathString) {
      this.path = pathString;
      this.processPath();
    }
  }

  _createClass(PathHelper, [{
    key: "processPath",
    value: function processPath() {
      var _this = this;

      var pattern = /[a-z]|[A-Z]/g;
      var parts = this.path.split(pattern);

      if (parts && parts[0] == "") {
        parts.shift();
      }

      this.commands = this.path.match(pattern);

      if (parts.length == this.commands.length) {
        parts = this.partNormalize(parts);
        this.commands.forEach(function (element, index) {
          _this.points.push({
            command: element,
            pos: parts[index]
          });
        });
      } else {
        console.log("somethings not right");
      }
    }
  }, {
    key: "partNormalize",
    value: function partNormalize(parts) {
      var _this2 = this;

      var cleanParts = [];
      parts.forEach(function (element, index) {
        var elemntTrim = element.trim();
        var tempPart = elemntTrim.replaceAll(",", " ");
        tempPart = tempPart.split(" ");
        var tempArr = [];

        for (var i = 0; i < tempPart.length;) {
          if (tempPart[i] != "") {
            tempArr.push(_this2.addPoint(parseInt(tempPart[i]), parseInt(tempPart[i + 1])));
          }

          i = i + 2;
        }

        cleanParts[index] = tempArr;
      });
      return cleanParts;
    }
  }, {
    key: "addPoint",
    value: function addPoint(xpos, ypos) {
      return {
        x: xpos,
        y: ypos
      };
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return this.path;
    }
  }, {
    key: "buildPath",
    value: function buildPath() {
      var newPath = "";
      this.points.forEach(function (instruction) {
        newPath += instruction.command;
        instruction.pos.forEach(function (position) {
          newPath += position.x + " " + position.y + " ";
        });
      });
      this.path = newPath;
    }
  }, {
    key: "getRawNumbers",
    value: function getRawNumbers() {
      var numberArray = [];
      this.points.forEach(function (instruction) {
        instruction.pos.forEach(function (position) {
          numberArray.push(position.x);
          numberArray.push(position.y);
        });
      });
      return numberArray;
    }
  }, {
    key: "getXYPairs",
    value: function getXYPairs() {
      var numbers = this.getRawNumbers();
      var pairs = [];

      for (var i = 0; i < numbers.length;) {
        pairs.push({
          x: numbers[i],
          y: numbers[i + 1]
        });
        i = i + 2;
      }

      return pairs;
    }
  }, {
    key: "resetPoints",
    value: function resetPoints(pointArray) {
      var tempPoints = [];
      var currentIndex = 0;
      this.commands.forEach(function (instruction) {
        var step = {
          command: instruction,
          pos: []
        };

        if (instruction === "c" || instruction === "C") {
          step.pos.push({
            x: pointArray[currentIndex],
            y: pointArray[currentIndex + 1]
          });
          currentIndex += 2;
          step.pos.push({
            x: pointArray[currentIndex],
            y: pointArray[currentIndex + 1]
          });
          currentIndex += 2;
          step.pos.push({
            x: pointArray[currentIndex],
            y: pointArray[currentIndex + 1]
          });
          currentIndex += 2;
        } else {
          if (currentIndex < pointArray.length) {
            step.pos.push({
              x: pointArray[currentIndex],
              y: pointArray[currentIndex + 1]
            });
            currentIndex += 2;
          }
        }

        tempPoints.push(step);
      });
      this.points = tempPoints;
      this.buildPath();
    }
  }, {
    key: "getPoints",
    value: function getPoints() {
      return this.points;
    }
  }]);

  return PathHelper;
}();

HoverCanvas = (_temp = /*#__PURE__*/function () {
  function HoverCanvas(element) {
    var _this3 = this;

    _classCallCheck(this, HoverCanvas);

    _defineProperty(this, "topElement", null);

    _defineProperty(this, "imgElement", null);

    _defineProperty(this, "canvasElement", null);

    _defineProperty(this, "aspect", null);

    _defineProperty(this, "ctx", null);

    _defineProperty(this, "width", null);

    _defineProperty(this, "height", null);

    _defineProperty(this, "startPath", null);

    _defineProperty(this, "endPath", null);

    _defineProperty(this, "currentPath", null);

    _defineProperty(this, "currentPathBuilder", null);

    _defineProperty(this, "loop", true);

    _defineProperty(this, "durration", 300);

    _defineProperty(this, "tweens", {});

    if (element) {
      this.topElement = element;
      this.imgElement = element.querySelector("img");
      this.canvasElement = this.buildCanvas();
      this.addPath();
      this.canvasElement.addEventListener("mouseover", function () {
        _this3.loop = true; //TWEEN.removeAll();

        var startPoints = _this3.currentPathBuilder.getRawNumbers();

        var endPoints = _this3.endPath.getRawNumbers();

        _this3.setupTween(startPoints, endPoints);

        _this3.forwarAnimate();
      });
      this.canvasElement.addEventListener("mouseleave", function () {
        _this3.loop = true; //TWEEN.removeAll();

        var startPoints = _this3.currentPathBuilder.getRawNumbers();

        var endPoints = _this3.startPath.getRawNumbers();

        _this3.setupTween(startPoints, endPoints);

        _this3.reverseAnimate();

        setTimeout(function () {
          _this3.loop = false;
        }, _this3.durration * 1.5);
      });
      this.start();
    } else {
      return null;
    }
  }

  _createClass(HoverCanvas, [{
    key: "buildCanvas",
    value: function buildCanvas() {
      var canvasElement = document.createElement("canvas");
      var parent = this.imgElement.parentElement;
      this.width = parent.getBoundingClientRect().width;
      this.height = parent.getBoundingClientRect().height;
      this.aspect = this.height / this.width;
      canvasElement.classList.add("hover-canvas");
      canvasElement.setAttribute("width", this.width);
      canvasElement.setAttribute("height", this.height);
      canvasElement.style = "width: 100%;  height: 100%; display: block;";
      this.imgElement.style = "display: none";
      this.imgElement.parentElement.appendChild(canvasElement);
      this.ctx = canvasElement.getContext("2d");
      return canvasElement;
    }
  }, {
    key: "testDraw",
    value: function testDraw() {
      this.ctx.strokeStyle = "#f00";
      this.ctx.lineWidth = 5;
      this.ctx.fillStyle = "#f00";
      this.ctx.drawImage(this.imgElement, 0, 0, this.width, this.height);
      var newPath = new Path2D("M 0,0 C 0,0 340,0 340,0 C 340,0 340,240 340,240 C 340,240 0,240 0,240 C 0,240 0,0 0,0 Z");
      this.ctx.stroke(newPath);
    }
  }, {
    key: "getRandomInt",
    value: function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
  }, {
    key: "addPath",
    value: function addPath() {
      this.startPath = new PathHelper("M 0,0 c 0,0 340,0 340,0 c 0,0 0,0 0,240 c 0,0 0,0 -340,0 c 0,0 0,0 0,-240 Z");

      if (this.getRandomInt(2) > 0) {
        this.endPath = new PathHelper("M20 20 c20 20 280 -20 300 0 c-20 20 20 180 0 200 c-20 -20 -280 20 -300 0 c20 -20 -20 -180 0 -200 Z");
      } else {
        //normal
        this.endPath = new PathHelper("M20 20 c20 -20 280 -20 300 0 c20 20 20 180 0 200 c-20 20 -280 20 -300 0 c-20 -20 -20 -180 0 -200 Z");
      }

      this.currentPathBuilder = new PathHelper(this.startPath.getPath());
      this.currentPath = new Path2D(this.currentPathBuilder.getPath());
    }
  }, {
    key: "getImageSrc",
    value: function getImageSrc() {}
  }, {
    key: "draw",
    value: function draw() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.clip(this.currentPath);
      this.ctx.drawImage(this.imgElement, 0, 0, this.width, this.height);
      this.ctx.restore();
    }
  }, {
    key: "animate",
    value: function animate(time) {
      if (this.loop) {
        requestAnimationFrame(this.animate.bind(this));
      }

      TWEEN.update(time);
      this.draw();
    }
  }, {
    key: "start",
    value: function start() {
      var _this4 = this;

      this.ctx.strokeStyle = "#f00";
      this.ctx.lineWidth = 5;
      this.ctx.fillStyle = "#f00";
      this.ctx.globalCompositeOperation = "copy";
      setTimeout(function () {
        _this4.draw();
      }, 500); //this.draw();
    }
  }, {
    key: "forwarAnimate",
    value: function forwarAnimate() {
      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: "reverseAnimate",
    value: function reverseAnimate() {
      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: "setupTween",
    value: function setupTween(start, end) {
      var _this5 = this;

      if (start.length === end.length) {
        this.tweens = new TWEEN.Tween(start).to(end, this.durration).start();
        this.tweens.onUpdate(function (tweenObject) {
          _this5.currentPathBuilder.resetPoints(tweenObject);

          var path = _this5.currentPathBuilder.getPath();

          _this5.currentPath = new Path2D(path);
        });
        this.tweens.onComplete(function (tweenObject) {//this.loop = false;
        });
        this.tweens.easing(TWEEN.Easing.Quadratic.InOut);
      }
    }
  }]);

  return HoverCanvas;
}(), _temp);
window.HoverBuilder = {
  hoverElements: [],
  hoverCanvasItems: [],
  init: function init() {
    var _this6 = this;

    this.hoverElements = document.querySelectorAll(".js-hover-canvas");
    this.hoverElements.forEach(function (element) {
      _this6.hoverCanvasItems.push(new HoverCanvas(element));
    });
  }
};

(function () {
  HoverBuilder.init();
})();
},{"../tween.js/dist/tween.umd":"tween.js/dist/tween.umd.js","/js/tween.umd.js":"js/tween.umd.js"}],"../../.nvm/versions/node/v14.9.0/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "36165" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.nvm/versions/node/v14.9.0/lib/node_modules/parcel/src/builtins/hmr-runtime.js","js/hover-canvas.js"], null)
//# sourceMappingURL=/hover-canvas.bc77db2c.js.map