/*globals React, Turbolinks*/

// Unobtrusive scripting adapter for React
;(function(document, window) {
  // jQuery is optional. Use it to support legacy browsers.
  var $ = (typeof window.jQuery !== 'undefined') && window.jQuery;

  // create the  namespace
  window.ReactRailsUJS = {
    CLASS_NAME_ATTR: 'data-react-class',
    PROPS_ATTR: 'data-react-props',
    RAILS_ENV_DEVELOPMENT: true,
    // helper method for the mount and unmount methods to find the
    // `data-react-class` DOM elements
    findDOMNodes: function(searchSelector) {
      // we will use fully qualified paths as we do not bind the callbacks
      var selector, parent;

      switch (typeof searchSelector) {
        case 'undefined':
          selector = '[' + window.ReactRailsUJS.CLASS_NAME_ATTR + ']';
          parent = document;
          break;
        case 'object':
          selector = '[' + window.ReactRailsUJS.CLASS_NAME_ATTR + ']';
          parent = searchSelector;
          break;
        case 'string':
          selector = searchSelector + ' [' + window.ReactRailsUJS.CLASS_NAME_ATTR + ']';
          parent = document;
          break
        default:
          break;
      }

      if ($) {
        return $(selector, parent);
      } else {
        return parent.querySelectorAll(selector);
      }
    },

    mountComponents: function(searchSelector) {
      var nodes = window.ReactRailsUJS.findDOMNodes(searchSelector);

      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        var className = node.getAttribute(window.ReactRailsUJS.CLASS_NAME_ATTR);

        // Assume className is simple and can be found at top-level (window).
        // Fallback to eval to handle cases like 'My.React.ComponentName'.
        var constructor = window[className] || eval.call(window, className);
        var propsJson = node.getAttribute(window.ReactRailsUJS.PROPS_ATTR);
        var props = propsJson && JSON.parse(propsJson);

        // Enable function in props, eval any string that is a function
        // definition.
        for (var key in props) {
          var val = props[key];
          var funcRe = /^\(function.*\(.*\)\s*\{.+\}\s*\)$/
          if (typeof val === 'string' && val.trim().match(funcRe)) {
            props[key] = eval(val.trim());
          }
        }

        var component = React.render(React.createElement(constructor, props), node);
        if ($) {
          $(node).data('component', component);
        }

        // Prefer ReactDOM if defined (introduced in 0.14)
        var renderer = (typeof ReactDOM == "object") ? ReactDOM : React;
        renderer.render(React.createElement(constructor, props), node);
      }
    },

    unmountComponents: function(searchSelector) {
      var nodes = window.ReactRailsUJS.findDOMNodes(searchSelector);

      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];

        // Prefer ReactDOM if defined (introduced in 0.14)
        var renderer = (typeof ReactDOM == "object") ? ReactDOM : React;
        renderer.unmountComponentAtNode(node);
      }
    }
  };

  // functions not exposed publicly
  function handleTurbolinksEvents () {
    var handleEvent;
    var unmountEvent;

    if ($) {
      handleEvent = function(eventName, callback) {
        $(document).on(eventName, callback);
      };

    } else {
      handleEvent = function(eventName, callback) {
        document.addEventListener(eventName, callback);
      };
    }

    if (Turbolinks.EVENTS) {
      unmountEvent = Turbolinks.EVENTS.BEFORE_UNLOAD;
    } else {
      unmountEvent = 'page:receive';
      Turbolinks.pagesCached(0);

      if (window.ReactRailsUJS.RAILS_ENV_DEVELOPMENT) {
        console.warn('The Turbolinks cache has been disabled (Turbolinks >= 2.4.0 is recommended). See https://github.com/reactjs/react-rails/issues/87 for more information.');
      }
    }
    handleEvent('page:change', function() {window.ReactRailsUJS.mountComponents()});
    handleEvent(unmountEvent, function() {window.ReactRailsUJS.unmountComponents()});
  }

  function handleNativeEvents() {
    if ($) {
      $(function() {window.ReactRailsUJS.mountComponents()});
    } else {
      document.addEventListener('DOMContentLoaded', function() {window.ReactRailsUJS.mountComponents()});
    }
  }

  if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
    handleTurbolinksEvents();
  } else {
    handleNativeEvents();
  }
})(document, window);
