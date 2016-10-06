(function() {
  var AboutMeSaleStock;

  AboutMeSaleStock = React.createClass({displayName: "AboutMeSaleStock",
    render: function() {
      return React.createElement("div", {
        "className": "container"
      }, React.createElement("div", {
        "className": "jumbotron"
      }, React.createElement("h1", null, "About me"), React.createElement("p", null, "To see the difference between static and fixed top navbars, just scroll."), React.createElement("p", null, React.createElement("a", {
        "role": "button",
        "href": "javascript:void(0)",
        "className": "btn btn-lg btn-primary"
      }, "About Me Â»"))));
    }
  });

  window.AboutMeSaleStock = AboutMeSaleStock;

}).call(this);
