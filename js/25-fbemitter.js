/**
 * fbemitter v1.0.0
 */

(function(e){if("function"==typeof bootstrap)bootstrap("fbemitter",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeFbemitter=e}else"undefined"!=typeof window?window.fbemitter=e():global.fbemitter=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule fbemitter
 */

var EventEmitter = require("./EventEmitter");
var EventEmitterWithHolding = require("./EventEmitterWithHolding");
var EventHolder = require("./EventHolder");
var EventValidator = require("./EventValidator");

var mixInEventEmitter = require("./mixInEventEmitter");

var fbemitter = {
  EventEmitter: EventEmitter,
  EventEmitterWithHolding: EventEmitterWithHolding,
  EventHolder: EventHolder,
  EventValidator: EventValidator,
  mixInEventEmitter: mixInEventEmitter
};

module.exports = fbemitter;

},{"./EventEmitterWithHolding":2,"./EventHolder":3,"./EventEmitter":4,"./EventValidator":5,"./mixInEventEmitter":6}],2:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventEmitterWithHolding
 * @typechecks
 */
'use strict';

/**
 * @class EventEmitterWithHolding
 * @description
 * An EventEmitterWithHolding decorates an event emitter and enables one to
 * "hold" or cache events and then have a handler register later to actually
 * handle them.
 *
 * This is separated into its own decorator so that only those who want to use
 * the holding functionality have to and others can just use an emitter. Since
 * it implements the emitter interface it can also be combined with anything
 * that uses an emitter.
 */

/**
 * @constructor
 * @param {object} emitter - The object responsible for emitting the actual
 *   events.
 * @param {object} holder - The event holder that is responsible for holding
 *   and then emitting held events.
 */
function EventEmitterWithHolding(emitter, holder) {
  this.$EventEmitterWithHolding_emitter = emitter;
  this.$EventEmitterWithHolding_eventHolder = holder;
  this.$EventEmitterWithHolding_currentEventToken = null;
  this.$EventEmitterWithHolding_emittingHeldEvents = false;
}


/**
 * @see EventEmitter#addListener
 */
EventEmitterWithHolding.prototype.addListener = function(eventType, listener, context) {
  return this.$EventEmitterWithHolding_emitter.addListener(eventType, listener, context);
};

/**
 * @see EventEmitter#once
 */
EventEmitterWithHolding.prototype.once = function(eventType, listener, context) {
  return this.$EventEmitterWithHolding_emitter.once(eventType, listener, context);
};

/**
 * Adds a listener to be invoked when events of the specified type are
 * emitted. An optional calling context may be provided. The data arguments
 * emitted will be passed to the listener function. In addition to subscribing
 * to all subsequent events, this method will also handle any events that have
 * already been emitted, held, and not released.
 *
 * @param {string} eventType - Name of the event to listen to
 * @param {function} listener - Function to invoke when the specified event is
 *   emitted
 * @param {*} context - Optional context object to use when invoking the
 *   listener
 *
 * @example
 *   emitter.emitAndHold('someEvent', 'abc');
 *
 *   emitter.addRetroactiveListener('someEvent', function(message) {
 *     console.log(message);
 *   }); // logs 'abc'
 */
EventEmitterWithHolding.prototype.addRetroactiveListener = function(eventType, listener, context) {
  var subscription = this.$EventEmitterWithHolding_emitter.addListener(eventType, listener, context);

  this.$EventEmitterWithHolding_emittingHeldEvents = true;
  this.$EventEmitterWithHolding_eventHolder.emitToListener(eventType, listener, context);
  this.$EventEmitterWithHolding_emittingHeldEvents = false;

  return subscription;
};

/**
 * @see EventEmitter#removeAllListeners
 */
EventEmitterWithHolding.prototype.removeAllListeners = function(eventType) {
  this.$EventEmitterWithHolding_emitter.removeAllListeners(eventType);
};

/**
 * @see EventEmitter#removeCurrentListener
 */
EventEmitterWithHolding.prototype.removeCurrentListener = function() {
  this.$EventEmitterWithHolding_emitter.removeCurrentListener();
};

/**
 * @see EventEmitter#removeSubscription
 */
EventEmitterWithHolding.prototype.removeSubscription = function(subscription) {
  this.$EventEmitterWithHolding_emitter.removeSubscription(subscription);
};

/**
 * @see EventEmitter#listeners
 */
EventEmitterWithHolding.prototype.listeners = function(eventType) {
  return this.$EventEmitterWithHolding_emitter.listeners(eventType);
};

/**
 * @see EventEmitter#emit
 */
EventEmitterWithHolding.prototype.emit = function(eventType, a, b, c, d, e, _) {
  this.$EventEmitterWithHolding_emitter.emit(eventType, a, b, c, d, e, _);
};

/**
 * Emits an event of the given type with the given data, and holds that event
 * in order to be able to dispatch it to a later subscriber when they say they
 * want to handle held events.
 *
 * @param {string} eventType - Name of the event to emit
 * @param {...*} Arbitrary arguments to be passed to each registered listener
 *
 * @example
 *   emitter.emitAndHold('someEvent', 'abc');
 *
 *   emitter.addRetroactiveListener('someEvent', function(message) {
 *     console.log(message);
 *   }); // logs 'abc'
 */
EventEmitterWithHolding.prototype.emitAndHold = function(eventType, a, b, c, d, e, _) {
  this.$EventEmitterWithHolding_currentEventToken = this.$EventEmitterWithHolding_eventHolder.holdEvent(
    eventType,
    a, b, c, d, e, _
  );
  this.$EventEmitterWithHolding_emitter.emit(eventType, a, b, c, d, e, _);
  this.$EventEmitterWithHolding_currentEventToken = null;
};

/**
 * @see EventHolder#releaseCurrentEvent
 */
EventEmitterWithHolding.prototype.releaseCurrentEvent = function() {
  if (this.$EventEmitterWithHolding_currentEventToken !== null) {
    this.$EventEmitterWithHolding_eventHolder.releaseEvent(this.$EventEmitterWithHolding_currentEventToken);
  } else if (this.$EventEmitterWithHolding_emittingHeldEvents) {
    this.$EventEmitterWithHolding_eventHolder.releaseCurrentEvent();
  }
};


module.exports = EventEmitterWithHolding;

},{}],3:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventHolder
 * @typechecks
 */
'use strict';

var invariant = require("./invariant");


function EventHolder() {
  this.$EventHolder_heldEvents = [];
  this.$EventHolder_eventsToRemove = [];
  this.$EventHolder_currentEventKey = null;
}


/**
 * Holds a given event for processing later.
 *
 * @param {string} eventType - Name of the event to hold and later emit
 * @param {...*} Arbitrary arguments to be passed to each registered listener
 * @return {*} Token that can be used to release the held event
 *
 * @example
 *
 *   holder.holdEvent({someEvent: 'abc'});
 *
 *   holder.emitToHandler({
 *     someEvent: function(data, event) {
 *       console.log(data);
 *     }
 *   }); //logs 'abc'
 *
 */
EventHolder.prototype.holdEvent = function(eventType, a, b, c, d, e, _) {
  var key = this.$EventHolder_heldEvents.length;
  var event = [eventType, a, b, c, d, e, _];
  this.$EventHolder_heldEvents.push(event);
  return key;
};

/**
 * Emits the held events of the specified type to the given listener.
 *
 * NOTE: It might be necessary in the future to store the held events
 * according to type so that we do not need to loop over all possible events
 * when we know that a handler can not handle this. However this would only be
 * an optimization when there were a large number of events, and it seems that
 * most cases where you would want to "hold" an event there would be a small
 * amount of them. If this is proved to be otherwise we should trade space for
 * time. This is also harder to implement if the order of events matters.
 *
 * @param {?string} eventType - Optional name of the events to replay
 * @param {function} listener - The listener to which to dispatch the event
 * @param {?object} context - Optional context object to use when invoking
 *   the listener
 */
EventHolder.prototype.emitToListener = function(eventType, listener, context) {
  this.forEachHeldEvent(function(type, a, b, c, d, e, _) {
    if (type === eventType) {
      listener.call(context, a, b, c, d, e, _);
    }
  });
};

/**
 * Synchronously iterates over all of the events held by this holder,
 * optionally filtering by an event type.
 *
 * @param {function} callback - The callback to which to dispatch the event.
 *   It should accept the event type as the first argument and arbitrary
 *   event data as the remaining arguments.
 * @param {?object} context - Optional context object to use when invoking
 *   the listener
 */
EventHolder.prototype.forEachHeldEvent = function(callback, context) {
  this.$EventHolder_heldEvents.forEach(function(event, key) {
    this.$EventHolder_currentEventKey = key;
    callback.apply(context, event);
  }, this);
  this.$EventHolder_currentEventKey = null;
};

/**
 * Provides an API that can be called during an eventing cycle to release
 * the last event that was invoked, so that it is no longer "held".
 *
 * If it is called when not inside of an emitting cycle it will throw.
 *
 * @throws {Error} When called not during an eventing cycle
 */
EventHolder.prototype.releaseCurrentEvent = function() {
  invariant(
    this.$EventHolder_currentEventKey !== null,
    'Not in an emitting cycle; there is no current event'
  );
  delete this.$EventHolder_heldEvents[this.$EventHolder_currentEventKey];
};

/**
 * Releases the event corresponding to the handle that was returned when the
 * event was first held.
 *
 * @param {*} token - The token returned from holdEvent
 */
EventHolder.prototype.releaseEvent = function(token) {
  delete this.$EventHolder_heldEvents[token];
};


module.exports = EventHolder;

},{"./invariant":7}],4:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventEmitter
 * @typechecks
 */
'use strict';

var emptyFunction = require("./emptyFunction");
var invariant = require("./invariant");

/**
 * @class EventEmitter
 * @description
 * An EventEmitter is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. In addition to the
 * data for the given event it also sends a event control object which allows
 * the listeners/handlers to prevent the default behavior of the given event.
 *
 * The emitter is designed to be generic enough to support all the different
 * contexts in which one might want to emit events. It is a simple multicast
 * mechanism on top of which extra functionality can be composed. For example, a
 * more advanced emitter may use an EventHolder and EventFactory.
 */

/**
 * @constructor
 */
function EventEmitter() {
  this.$EventEmitter_listenersByType = {};
  this.$EventEmitter_listenerContextsByType = {};
  this.$EventEmitter_currentSubscription = {};
}


/**
 * Adds a listener to be invoked when events of the specified type are
 * emitted. An optional calling context may be provided. The data arguments
 * emitted will be passed to the listener function.
 *
 * @param {string} eventType - Name of the event to listen to
 * @param {function} listener - Function to invoke when the specified event is
 *   emitted
 * @param {*} context - Optional context object to use when invoking the
 *   listener
 */
EventEmitter.prototype.addListener = function(eventType, listener, context) {
  if (!this.$EventEmitter_listenersByType[eventType]) {
    this.$EventEmitter_listenersByType[eventType] = [];
  }
  var key = this.$EventEmitter_listenersByType[eventType].length;
  this.$EventEmitter_listenersByType[eventType].push(listener);

  if (context !== undefined) {
    if (!this.$EventEmitter_listenerContextsByType[eventType]) {
      this.$EventEmitter_listenerContextsByType[eventType] = [];
    }
    this.$EventEmitter_listenerContextsByType[eventType][key] = context;
  }

  return new ListenerSubscription(this, eventType, key);
};

/**
 * Similar to addListener, except that the listener is removed after it is
 * invoked once.
 *
 * @param {string} eventType - Name of the event to listen to
 * @param {function} listener - Function to invoke only once when the
 *   specified event is emitted
 * @param {*} context - Optional context object to use when invoking the
 *   listener
 */
EventEmitter.prototype.once = function(eventType, listener, context) {
  var emitter = this;
  return this.addListener(eventType, function() {
    emitter.removeCurrentListener();
    listener.apply(context, arguments);
  });
};

/**
 * Removes all of the registered listeners, including those registered as
 * listener maps.
 *
 * @param {?string} eventType - Optional name of the event whose registered
 *   listeners to remove
 */
EventEmitter.prototype.removeAllListeners = function(eventType) {
  if (eventType === undefined) {
    this.$EventEmitter_listenersByType = {};
    this.$EventEmitter_listenerContextsByType = {};
  } else {
    delete this.$EventEmitter_listenersByType[eventType];
    delete this.$EventEmitter_listenerContextsByType[eventType];
  }
};

/**
 * Provides an API that can be called during an eventing cycle to remove the
 * last listener that was invoked. This allows a developer to provide an event
 * object that can remove the listener (or listener map) during the
 * invocation.
 *
 * If it is called when not inside of an emitting cycle it will throw.
 *
 * @throws {Error} When called not during an eventing cycle
 *
 * @example
 *   var subscription = emitter.addListenerMap({
 *     someEvent: function(data, event) {
 *       console.log(data);
 *       emitter.removeCurrentListener();
 *     }
 *   });
 *
 *   emitter.emit('someEvent', 'abc'); // logs 'abc'
 *   emitter.emit('someEvent', 'def'); // does not log anything
 */
EventEmitter.prototype.removeCurrentListener = function() {
  invariant(
    this.$EventEmitter_currentSubscription.key !== undefined,
    'Not in an emitting cycle; there is no current listener'
  );
  this.removeSubscription(this.$EventEmitter_currentSubscription);
};

/**
 * Removes a specific subscription. Instead of calling this function, call
 * `subscription.remove()` directly.
 *
 * @param {object} subscription - A subscription returned from one of this
 *   emitter's listener registration methods
 */
EventEmitter.prototype.removeSubscription = function(subscription) {
  var eventType = subscription.eventType;
  var key = subscription.key;

  var listenersOfType = this.$EventEmitter_listenersByType[eventType];
  if (listenersOfType) {
    delete listenersOfType[key];
  }

  var listenerContextsOfType = this.$EventEmitter_listenerContextsByType[eventType];
  if (listenerContextsOfType) {
    delete listenerContextsOfType[key];
  }
};

/**
 * Returns an array of listeners that are currently registered for the given
 * event.
 *
 * @param {string} eventType - Name of the event to query
 * @returns {array}
 */
EventEmitter.prototype.listeners = function(eventType) {
  var listenersOfType = this.$EventEmitter_listenersByType[eventType];
  return listenersOfType
    ? listenersOfType.filter(emptyFunction.thatReturnsTrue)
    : [];
};

/**
 * Emits an event of the given type with the given data. All handlers of that
 * particular type will be notified.
 *
 * @param {string} eventType - Name of the event to emit
 * @param {...*} Arbitrary arguments to be passed to each registered listener
 *
 * @example
 *   emitter.addListener('someEvent', function(message) {
 *     console.log(message);
 *   });
 *
 *   emitter.emit('someEvent', 'abc'); // logs 'abc'
 */
EventEmitter.prototype.emit = function(eventType, a, b, c, d, e, _) {
  invariant(
    _ === undefined,
    'EventEmitter.emit currently accepts only up to five listener arguments.'
  );

  var listeners = this.$EventEmitter_listenersByType[eventType];
  if (listeners) {
    var contexts = this.$EventEmitter_listenerContextsByType[eventType];
    this.$EventEmitter_currentSubscription.eventType = eventType;

    var keys = Object.keys(listeners);
    for (var ii = 0; ii < keys.length; ii++) {
      var key = keys[ii];
      var listener = listeners[key];

      // The listener may have been removed during this event loop.
      if (listener) {
        var context = contexts ? contexts[key] : undefined;
        this.$EventEmitter_currentSubscription.key = key;
        if (context === undefined) {
          listener(a, b, c, d, e);
        } else {
          listener.call(context, a, b, c, d, e);
        }
      }
    }

    this.$EventEmitter_currentSubscription.eventType = undefined;
    this.$EventEmitter_currentSubscription.key = undefined;
  }
};



function ListenerSubscription(emitter, eventType, key) {
  this.$ListenerSubscription_emitter = emitter;
  this.eventType = eventType;
  this.key = key;
}


ListenerSubscription.prototype.remove = function() {
  this.$ListenerSubscription_emitter.removeSubscription(this);
};


module.exports = EventEmitter;

},{"./emptyFunction":8,"./invariant":7}],5:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventValidator
 */
'use strict';

var copyProperties = require("./copyProperties");

/**
 * EventValidator is designed to validate event types to make it easier to catch
 * common mistakes. It accepts a map of all of the different types of events
 * that the emitter can emit. Then, if a user attempts to emit an event that is
 * not one of those specified types the emitter will throw an error. Also, it
 * provides a relatively simple matcher so that if it thinks that you likely
 * mistyped the event name it will suggest what you might have meant to type in
 * the error message.
 */
var EventValidator = {
  /**
   * @param {Object} emitter - The object responsible for emitting the actual
   *                             events
   * @param {Object} types - The collection of valid types that will be used to
   *                         check for errors
   * @return {Object} A new emitter with event type validation
   * @example
   *   var types = {someEvent: true, anotherEvent: true};
   *   var emitter = EventValidator.addValidation(emitter, types);
   */
  addValidation: function(emitter, types) {
    var eventTypes = Object.keys(types);
    var emitterWithValidation = Object.create(emitter);

    copyProperties(emitterWithValidation, {
      emit: function emit(type, a, b, c, d, e, _) {
        assertAllowsEventType(type, eventTypes);
        return emitter.emit.call(this, type, a, b, c, d, e, _);
      }
    });

    return emitterWithValidation;
  }
};

function assertAllowsEventType(type, allowedTypes) {
  if (allowedTypes.indexOf(type) === -1) {
    throw new TypeError(errorMessageFor(type, allowedTypes));
  }
}

function errorMessageFor(type, allowedTypes) {
  var message = 'Unknown event type "' + type + '". ';
  if (true) {
    message += recommendationFor(type, allowedTypes);
  }
  message += 'Known event types: ' + allowedTypes.join(', ') + '.';
  return message;
}

// Allow for good error messages
if (true) {
  var recommendationFor = function (type, allowedTypes) {
    var closestTypeRecommendation = closestTypeFor(type, allowedTypes);
    if (isCloseEnough(closestTypeRecommendation, type)) {
      return 'Did you mean "' + closestTypeRecommendation.type + '"? ';
    } else {
      return '';
    }
  };

  var closestTypeFor = function (type, allowedTypes) {
    var typeRecommendations = allowedTypes.map(
      typeRecommendationFor.bind(this, type)
    );
    return typeRecommendations.sort(recommendationSort)[0];
  };

  var typeRecommendationFor = function (type, recomendedType) {
    return {
      type: recomendedType,
      distance: damerauLevenshteinDistance(type, recomendedType)
    };
  };

  var recommendationSort = function (recommendationA, recommendationB) {
    if (recommendationA.distance < recommendationB.distance) {
      return -1;
    } else if (recommendationA.distance > recommendationB.distance) {
      return 1;
    } else {
      return 0;
    }
  };

  var isCloseEnough = function (closestType, actualType) {
    return (closestType.distance / actualType.length) < 0.334;
  };

  var damerauLevenshteinDistance = function (a, b) {
    var i, j;
    var d = [];

    for (i = 0; i <= a.length; i++) {
      d[i] = [i];
    }

    for (j = 1; j <= b.length; j++) {
      d[0][j] = j;
    }

    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;

        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
        );

        if (i > 1 && j > 1 &&
            a.charAt(i - 1) == b.charAt(j - 2) &&
            a.charAt(i - 2) == b.charAt(j - 1)) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
        }
      }
    }

    return d[a.length][b.length];
  };
}

module.exports = EventValidator;

},{"./copyProperties":9}],6:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mixInEventEmitter
 */

var EventEmitter = require("./EventEmitter");
var EventEmitterWithHolding = require("./EventEmitterWithHolding");
var EventHolder = require("./EventHolder");
var EventValidator = require("./EventValidator");

var copyProperties = require("./copyProperties");
var invariant = require("./invariant");
var keyOf = require("./keyOf");

var TYPES_KEY = keyOf({__types: true});

/**
 * API to setup an object or constructor to be able to emit data events.
 *
 * @example
 * function Dog() { ...dog stuff... }
 * mixInEventEmitter(Dog, {bark: true});
 *
 * var puppy = new Dog();
 * puppy.addListener('bark', function (volume) {
 *   console.log('Puppy', this, 'barked at volume:', volume);
 * });
 * puppy.emit('bark', 'quiet');
 * // Puppy <puppy> barked at volume: quiet
 *
 *
 * // A "singleton" object may also be commissioned:
 *
 * var Singleton = {};
 * mixInEventEmitter(Singleton, {lonely: true});
 * Singleton.emit('lonely', true);
 */
function mixInEventEmitter(klass, types) {
  invariant(types, 'Must supply set of valid event types');
  invariant(!this.__eventEmitter, 'An active emitter is already mixed in');

  // If this is a constructor, write to the prototype, otherwise write to the
  // singleton object.
  var target = klass.prototype || klass;

  var ctor = klass.constructor;
  if (ctor) {
    invariant(
      ctor === Object || ctor === Function,
      'Mix EventEmitter into a class, not an instance'
    );
  }

  // Keep track of the provided types, union the types if they already exist,
  // which allows for prototype subclasses to provide more types.
  if (target.hasOwnProperty(TYPES_KEY)) {
    copyProperties(target.__types, types);
  } else if (target.__types) {
    target.__types = copyProperties({}, target.__types, types);
  } else {
    target.__types = types;
  }
  copyProperties(target, EventEmitterMixin);
}

var EventEmitterMixin = {
  emit: function(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emit(eventType, a, b, c, d, e, _);
  },

  emitAndHold: function(eventType, a, b, c, d, e, _) {
    return this.__getEventEmitter().emitAndHold(eventType, a, b, c, d, e, _);
  },

  addListener: function(eventType, listener, context) {
    return this.__getEventEmitter().addListener(eventType, listener, context);
  },

  once: function(eventType, listener, context) {
    return this.__getEventEmitter().once(eventType, listener, context);
  },

  addRetroactiveListener: function(eventType, listener, context) {
    return this.__getEventEmitter().addRetroactiveListener(
      eventType,
      listener,
      context
    );
  },

  addListenerMap: function(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },

  addRetroactiveListenerMap: function(listenerMap, context) {
    return this.__getEventEmitter().addListenerMap(listenerMap, context);
  },

  removeAllListeners: function() {
    this.__getEventEmitter().removeAllListeners();
  },

  removeCurrentListener: function() {
    this.__getEventEmitter().removeCurrentListener();
  },

  removeSubscription: function(subscription) {
    this.__getEventEmitter().removeSubscription(subscription);
  },

  __getEventEmitter: function() {
    if (!this.__eventEmitter) {
      var emitter = new EventEmitter();
      emitter = EventValidator.addValidation(emitter, this.__types);

      var holder = new EventHolder();
      this.__eventEmitter = new EventEmitterWithHolding(emitter, holder);
    }
    return this.__eventEmitter;
  }
};

module.exports = mixInEventEmitter;

},{"./EventEmitter":4,"./EventEmitterWithHolding":2,"./EventHolder":3,"./EventValidator":5,"./copyProperties":9,"./invariant":7,"./keyOf":10}],7:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf style format and arguments to provide information about
 * what broke and what you were expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

function invariant(condition) {
  if (!condition) {
    throw new Error('Invariant Violation');
  }
}

module.exports = invariant;

if (true) {
  var invariantDev = function(condition, format, a, b, c, d, e, f) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }

    if (!condition) {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      throw new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }
  };

  module.exports = invariantDev;
}

},{}],9:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if (true) {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

},{}],10:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],8:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyFunction
 */

var copyProperties = require("./copyProperties");

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

copyProperties(emptyFunction, {
  thatReturns: makeEmptyFunction,
  thatReturnsFalse: makeEmptyFunction(false),
  thatReturnsTrue: makeEmptyFunction(true),
  thatReturnsNull: makeEmptyFunction(null),
  thatReturnsThis: function() { return this; },
  thatReturnsArgument: function(arg) { return arg; }
});

module.exports = emptyFunction;

},{"./copyProperties":9}]},{},[1])(1)
});
;
