(function() {
  var ApplicationSaleStock, Button, Col, FormControl, FormGroup, Row, getAlasanRetur, getOrders;

  Button = ReactBootstrap.Button, FormGroup = ReactBootstrap.FormGroup, FormControl = ReactBootstrap.FormControl, Col = ReactBootstrap.Col, Row = ReactBootstrap.Row;

  getOrders = function() {
    return [
      {
        id: 888,
        items: [
          {
            id: 32,
            alasan: '',
            name: 'Kiraniar Plain Casual Cardigan 1',
            sku: 'BMW-ANC',
            price: 85000,
            foto: {}
          }, {
            id: 33,
            name: 'Kiraniar Plain Casual Cardigan 2',
            sku: 'BMW-ANC',
            price: 43000,
            foto: {}
          }
        ]
      }, {
        id: 777,
        items: [
          {
            id: 32,
            alasan: '',
            name: 'Kiraniar Plain Casual Cardigan 1',
            sku: 'BMW-ANC',
            price: 85000,
            foto: {}
          }, {
            id: 33,
            name: 'Kiraniar Plain Casual Cardigan 2',
            sku: 'BMW-ANC',
            price: 43000,
            foto: {}
          }
        ]
      }, {
        id: 555,
        items: [
          {
            id: 32,
            alasan: '',
            name: 'Kiraniar Plain Casual Cardigan 1',
            sku: 'BMW-ANC',
            price: 85000,
            foto: {}
          }, {
            id: 33,
            name: 'Kiraniar Plain Casual Cardigan 2',
            sku: 'BMW-ANC',
            price: 43000,
            foto: {}
          }
        ]
      }
    ];
  };

  getAlasanRetur = function() {
    return [
      {
        id: 1,
        value: 'Bolong'
      }, {
        id: 2,
        value: 'Jahitan Tidak Rapi'
      }, {
        id: 3,
        value: 'Kebesaran'
      }, {
        id: 4,
        value: 'Kekecilan'
      }
    ];
  };

  ApplicationSaleStock = React.createClass({displayName: "ApplicationSaleStock",
    getInitialState: function() {
      return {
        form: SaleStockStore.form,
        activeForm: SaleStockStore.activeForm
      };
    },
    componentDidMount: function() {
      return this.listener = SaleStockStore.addChangeListener(this._onChange);
    },
    componentWillUnMount: function() {
      return this.listener.remove();
    },
    _onChange: function() {
      return this.setState({
        form: SaleStockStore.form,
        activeForm: SaleStockStore.activeForm
      });
    },
    _dispatchChange: function(attributes) {
      return dispatcher.dispatch({
        actionType: 'sale-stock-form-attributes-setter',
        attributes: attributes
      });
    },
    _dispatchChangeActiveForm: function(attributes) {
      return dispatcher.dispatch({
        actionType: 'sale-stock-activeForm-attributes-setter',
        attributes: attributes
      });
    },
    onNameChanged: function(event) {
      return this._dispatchChange({
        name: {
          value: event.target.value,
          isRequired: false
        }
      });
    },
    onBuktiFotoOngkirChanged: function(event) {
      return this._dispatchChange({
        buktiFotoOngkir: event.target.value
      });
    },
    onEmailChanged: function(event) {
      return this._dispatchChange({
        email: {
          value: event.target.value,
          isRequired: false
        }
      });
    },
    onHandphoneChanged: function(event) {
      return this._dispatchChange({
        handphone: {
          value: event.target.value,
          isRequired: false
        }
      });
    },
    onOrderNumberChanged: function(event) {
      return this._dispatchChange({
        orderNumber: {
          value: event.target.value,
          isRequired: false
        }
      });
    },
    onBiayarKirimBalikChanged: function(event) {
      return this._dispatchChange({
        biayaKirimBalik: {
          value: event.target.value,
          isRequired: false
        }
      });
    },
    onKeteranganChanged: function(event) {
      return this._dispatchChange({
        keterangan: {
          value: event.target.value,
          isRequired: false
        }
      });
    },
    onValidateForm: function() {
      var activeForm, arrBlock, form, r, requiredField, _i, _len, _ref, _ref1, _ref2;
      _ref = this.state, activeForm = _ref.activeForm, form = _ref.form;
      if (activeForm.current === 'data-sista') {
        requiredField = [
          {
            id: 'name',
            message: "Name can't be blank"
          }, {
            id: 'email',
            message: "Email can't be blank"
          }
        ];
      } else if (activeForm.current === 'data-order') {
        requiredField = [
          {
            id: 'orderNumber',
            message: "Order Number can't be blank"
          }
        ];
      }
      arrBlock = [];
      for (_i = 0, _len = requiredField.length; _i < _len; _i++) {
        r = requiredField[_i];
        if (form[r.id] === void 0 || ((_ref1 = form[r.id]) != null ? _ref1.value : void 0) === null || ((_ref2 = form[r.id]) != null ? _ref2.value : void 0) === '') {
          arrBlock.push(r.message);
          form[r.id] = {
            value: null,
            isRequired: true
          };
          this._dispatchChange(form);
        }
      }
      return arrBlock;
    },
    onNextClick: function() {
      var activeForm, arrValidate, backForm, current, nextForm;
      activeForm = this.state.activeForm;
      arrValidate = this.onValidateForm();
      if (arrValidate.length > 0) {
        alert(arrValidate.join(", "));
        return false;
      } else {
        backForm = null;
        if (activeForm.current === 'data-sista') {
          nextForm = 'data-order';
          current = 'data-order';
          backForm = 'data-sista';
        } else if (activeForm.current === 'data-order') {
          nextForm = null;
          current = 'data-order';
          backForm = 'data-sista';
        }
        return this._dispatchChangeActiveForm({
          current: current,
          next: nextForm,
          back: backForm
        });
      }
    },
    onBackClick: function() {
      var activeForm, backForm, current, nextForm;
      activeForm = this.state.activeForm;
      backForm = null;
      if (activeForm.current === 'data-order') {
        nextForm = 'submitting-form';
        current = 'data-sista';
        backForm = 'data-sista';
      } else if (activeForm.current === 'submitting-form') {
        nextForm = null;
        current = 'data-order';
        backForm = 'data-order';
      }
      return this._dispatchChangeActiveForm({
        current: current,
        next: nextForm,
        back: backForm
      });
    },
    onResetOrder: function() {
      return this._dispatchChange({
        orderNumber: {
          value: null,
          isRequired: true,
          items: []
        }
      });
    },
    onFindOrder: function() {
      var form, items, _this;
      form = this.state.form;
      _this = this;
      items = _.find(getOrders(), function(e) {
        return e.id === Number(form.orderNumber.value);
      });
      return setTimeout((function(_this) {
        return function() {
          if (items) {
            return _this._dispatchChange({
              orderNumber: {
                value: form.orderNumber.value,
                isRequired: false,
                items: items.items
              }
            });
          } else {
            alert('No data found!');
            return _this._dispatchChange({
              orderNumber: {
                value: null,
                isRequired: true,
                items: []
              }
            });
          }
        };
      })(this), 1000);
    },
    onSubmitForm: function() {
      var activeForm, arrValidate;
      activeForm = this.state.activeForm;
      arrValidate = this.onValidateForm();
      if (arrValidate.length > 0) {
        alert(arrValidate.join(", "));
        return false;
      } else {
        alert('your request has been sent');
        dispatcher.dispatch({
          actionType: 'sale-stock-global-attributes-setter',
          attributes: {
            contentType: 'home',
            form: {}
          }
        });
        return this._dispatchChangeActiveForm({
          current: 'data-sista',
          next: 'data-order',
          back: null
        });
      }
    },
    render: function() {
      var activeForm, biayaKirimBalik, buktiFotoOngkir, email, form, handphone, keterangan, name, orderNumber, tableItemOrderRow, _ref;
      _ref = this.state, form = _ref.form, activeForm = _ref.activeForm;
      name = form.name, email = form.email, handphone = form.handphone, orderNumber = form.orderNumber, biayaKirimBalik = form.biayaKirimBalik, keterangan = form.keterangan, buktiFotoOngkir = form.buktiFotoOngkir;
      tableItemOrderRow = function(data) {
        var setOptionRow, _ref1;
        setOptionRow = function(data) {
          return React.createElement("option", {
            "key": data.id,
            "value": "" + data.value
          }, data.value);
        };
        return React.createElement("table", {
          "className": "table",
          "style": {
            borderLeft: "1px solid #dddddd",
            borderRight: "1px solid #dddddd"
          }
        }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", {
          "colSpan": 3.
        }, React.createElement("div", {
          "style": {
            fontWeight: 'bold',
            fontSize: '12px'
          }
        }, data.name), React.createElement("div", {
          "style": {
            color: '#808080',
            fontSize: '0.8em',
            fontStyle: 'italic'
          }
        }, "Nama Item"))), React.createElement("tr", null, React.createElement("td", null, React.createElement("select", {
          "value": data.alasan,
          "onChange": this.onBlurSelect,
          "className": "form-control",
          "placeholder": "select",
          "style": {
            paddingLeft: '3px'
          }
        }, getAlasanRetur().map(setOptionRow)), React.createElement("div", {
          "style": {
            color: '#808080',
            fontStyle: 'italic',
            fontSize: '0.8em'
          }
        }, "Alasan Retur")), React.createElement("td", null, data.sku, React.createElement("div", {
          "style": {
            color: '#808080',
            fontStyle: 'italic',
            fontSize: '0.8em'
          }
        }, "SKU")), React.createElement("td", null, data.price, React.createElement("div", {
          "style": {
            color: '#808080',
            fontStyle: 'italic',
            fontSize: '0.8em'
          }
        }, "Harga Satuan"))), React.createElement("tr", null, React.createElement("td", {
          "colSpan": 3.
        }, React.createElement("input", {
          "type": "file",
          "value": ((_ref1 = data.foto) != null ? _ref1.value : void 0),
          "onChange": this.onChangeFile,
          "className": "form-control",
          "style": {
            padding: '0'
          }
        }), React.createElement("div", {
          "style": {
            color: '#808080',
            fontSize: '0.8em',
            fontStyle: 'italic'
          }
        }, "Bukti Foto")))));
      };
      return React.createElement("div", {
        "className": "container"
      }, (activeForm.current === 'data-sista' ? React.createElement("div", {
        "className": "jumbotron",
        "style": {
          paddingTop: '10px'
        }
      }, React.createElement("legend", null, "Data Sista"), React.createElement("div", {
        "className": "bs-example"
      }, React.createElement(FormGroup, {
        "className": "" + ((name != null ? name.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Nama Sista*"), React.createElement(FormControl, {
        "value": (name != null ? name.value : void 0),
        "placeholder": "Nama sista",
        "onChange": this.onNameChanged
      })), React.createElement(FormGroup, {
        "className": "" + ((email != null ? email.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Email Sista*"), React.createElement(FormControl, {
        "value": (email != null ? email.value : void 0),
        "placeholder": "Email sista",
        "onChange": this.onEmailChanged
      })), React.createElement(FormGroup, {
        "className": "" + ((handphone != null ? handphone.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Handphone Sista"), React.createElement(FormControl, {
        "value": (handphone != null ? handphone.value : void 0),
        "placeholder": "Handphone sista",
        "onChange": this.onHandphoneChanged
      })))) : void 0), (activeForm.current === 'data-order' ? React.createElement("div", {
        "className": "jumbotron",
        "style": {
          paddingTop: '10px'
        }
      }, React.createElement("legend", null, "Data Order"), React.createElement("div", {
        "className": "bs-example"
      }, React.createElement(FormGroup, {
        "className": "" + ((orderNumber != null ? orderNumber.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Nomor Order"), React.createElement(FormControl, {
        "id": "order_number",
        "value": (orderNumber != null ? orderNumber.value : void 0),
        "placeholder": "Nomor Order",
        "onChange": this.onOrderNumberChanged
      }), React.createElement(Button, {
        "className": "btn btn-primary",
        "style": {
          marginTop: '4px'
        },
        "onClick": this.onFindOrder
      }, "Load"), React.createElement(Button, {
        "className": "btn btn-danger",
        "style": {
          marginTop: '4px',
          marginLeft: '5px'
        },
        "onClick": this.onResetOrder
      }, "Reset")), ((orderNumber != null ? orderNumber.items : void 0) && (orderNumber != null ? orderNumber.items.length : void 0) > 0 ? React.createElement(FormGroup, null, orderNumber != null ? orderNumber.items.map(tableItemOrderRow) : void 0) : void 0), React.createElement(FormGroup, {
        "className": "" + ((biayaKirimBalik != null ? biayaKirimBalik.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Biaya Kirim Balik"), React.createElement(FormControl, {
        "value": (biayaKirimBalik != null ? biayaKirimBalik.value : void 0),
        "placeholder": "Biaya Kirim Balik",
        "onChange": this.onBiayarKirimBalikChanged
      })), React.createElement(FormGroup, {
        "className": "" + ((keterangan != null ? keterangan.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Keterangan"), React.createElement("textarea", {
        "value": (keterangan != null ? keterangan.value : void 0),
        "placeholder": "Keterangan",
        "className": "form-control",
        "onChange": this.onKeteranganChanged
      })), React.createElement(FormGroup, {
        "className": "" + ((buktiFotoOngkir != null ? buktiFotoOngkir.isRequired : void 0) ? 'has-error' : '')
      }, React.createElement("label", {
        "className": "control-label"
      }, "Bukti Foto Ongkir"), React.createElement("input", {
        "type": "file",
        "value": (buktiFotoOngkir != null ? buktiFotoOngkir.value : void 0),
        "className": "form-control",
        "style": {
          padding: '0'
        },
        "onChange": this.onBuktiFotoOngkirChanged
      })))) : void 0), React.createElement("div", {
        "className": "navbar navbar-default navbar-fixed-bottom"
      }, React.createElement("div", {
        "className": "container",
        "style": {
          paddingTop: '8px'
        }
      }, ($.inArray(activeForm.current, ["data-order"]) >= 0 ? React.createElement(Button, {
        "className": "btn btn-primary pull-left",
        "onClick": this.onBackClick
      }, "Â« Back") : void 0), (activeForm.current === 'data-order' ? React.createElement(Button, {
        "className": "btn btn-success pull-right",
        "onClick": this.onSubmitForm
      }, "Submit") : React.createElement(Button, {
        "className": "btn btn-success pull-right",
        "onClick": this.onNextClick
      }, "Next Â»")))));
    }
  });

  window.ApplicationSaleStock = ApplicationSaleStock;

}).call(this);
(function() {
  var ContentSaleStock;

  ContentSaleStock = React.createClass({displayName: "ContentSaleStock",
    PropTypes: {
      onShowForm: React.PropTypes.func
    },
    onApplicationClick: function() {
      return this.props.onShowForm('application');
    },
    onAboutMeClick: function() {
      return this.props.onShowForm('about me');
    },
    render: function() {
      return React.createElement("div", {
        "className": "container"
      }, React.createElement("div", {
        "className": "jumbotron"
      }, React.createElement("h1", null, "Retur Form"), React.createElement("p", null, "Input your retur request to us with fill this form below."), React.createElement("p", null, React.createElement("a", {
        "onClick": this.onApplicationClick,
        "role": "button",
        "href": "javascript:void(0)",
        "className": "btn btn-lg btn-primary"
      }, "Application Form Â»"))));
    }
  });

  window.ContentSaleStock = ContentSaleStock;

}).call(this);

(function() {
  var HeaderSaleStock;

  HeaderSaleStock = React.createClass({displayName: "HeaderSaleStock",
    PropTypes: {
      onShowForm: React.PropTypes.func
    },
    onToggleNavbar: function() {
      if ($(ReactDOM.findDOMNode(this)).find('.navbar-toggle').is(':visible')) {
        return $(ReactDOM.findDOMNode(this)).find('.navbar-toggle').trigger('click');
      }
    },
    onApplicationClick: function() {
      this.props.onShowForm('application');
      return this.onToggleNavbar();
    },
    onHomeClick: function() {
      this.props.onShowForm('home');
      return this.onToggleNavbar();
    },
    render: function() {
      return React.createElement("header", {
        "className": "navbar navbar-default navbar-fixed-top"
      }, React.createElement("div", {
        "className": "container"
      }, React.createElement("div", {
        "className": "navbar-header"
      }, React.createElement("button", {
        "className": "navbar-toggle collapsed",
        "aria-controls": "navbar",
        "aria-expanded": "false",
        "data-target": "#navbar",
        "data-toggle": "collapse",
        "type": "button"
      }, React.createElement("span", {
        "className": "sr-only"
      }, "Toggle navigation"), React.createElement("span", {
        "className": "icon-bar"
      }), React.createElement("span", {
        "className": "icon-bar"
      }), React.createElement("span", {
        "className": "icon-bar"
      })), React.createElement("a", {
        "className": "navbar-brand",
        "href": "javascript:void(0)"
      }, "UX DEVELOPER")), React.createElement("div", {
        "id": "navbar",
        "className": "navbar-collapse collapse",
        "style": {
          height: '1px'
        }
      }, React.createElement("ul", {
        "className": "nav navbar-nav navbar-right"
      }, React.createElement("li", null, React.createElement("a", {
        "onClick": this.onHomeClick,
        "href": "javascript:void(0)"
      }, "HOME")), React.createElement("li", null, React.createElement("a", {
        "onClick": this.onApplicationClick,
        "href": "javascript:void(0)"
      }, "APPLICATION"))))));
    }
  });

  window.HeaderSaleStock = HeaderSaleStock;

}).call(this);



(function() {
  var CHANGE_EVENT, EventEmitter, ITEM_CHANGE_EVENT;

  EventEmitter = fbemitter.EventEmitter;

  CHANGE_EVENT = 'change';

  ITEM_CHANGE_EVENT = 'change:item';

  window.SaleStockStore = _.assign(new EventEmitter(), {
    contentType: 'home',
    form: {},
    activeForm: {
      current: 'data-sista',
      next: 'data-order',
      back: null
    },
    requesting: {
      type: null,
      status: false
    },
    emitChange: function() {
      return this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
      return this.addListener(CHANGE_EVENT, callback);
    },
    emitItemChange: function() {
      return this.emit(ITEM_CHANGE_EVENT);
    },
    addItemChangeListener: function(callback) {
      return this.addListener(ITEM_CHANGE_EVENT, callback);
    }
  });

  dispatcher.register(function(payload) {
    var form;
    switch (payload.actionType) {
      case 'sale-stock-global-attributes-setter':
        _.assign(SaleStockStore, payload.attributes);
        return SaleStockStore.emitChange();
      case 'sale-stock-form-attributes-setter':
        form = SaleStockStore.form;
        _.assign(form, payload.attributes);
        SaleStockStore.emitItemChange(form);
        return SaleStockStore.emitChange();
      case 'sale-stock-activeForm-attributes-setter':
        form = SaleStockStore.activeForm;
        _.assign(form, payload.attributes);
        SaleStockStore.emitItemChange(form);
        return SaleStockStore.emitChange();
    }
  });

}).call(this);

(function() {
  var WrapperSaleStock;

  WrapperSaleStock = React.createClass({displayName: "WrapperSaleStock",
    getInitialState: function() {
      return {
        contentType: SaleStockStore.contentType
      };
    },
    componentDidMount: function() {
      return this.listener = SaleStockStore.addChangeListener(this._onChange);
    },
    _onChange: function() {
      return this.setState({
        contentType: SaleStockStore.contentType
      });
    },
    componentWillUnMount: function() {
      return this.listener.remove();
    },
    _onAttributesChanged: function(attributes) {
      return dispatcher.dispatch({
        actionType: 'sale-stock-global-attributes-setter',
        attributes: attributes
      });
    },
    onClickForm: function(type) {
      return this._onAttributesChanged({
        contentType: type
      });
    },
    render: function() {
      var contentType;
      contentType = this.state.contentType;
      return React.createElement("div", null, React.createElement(HeaderSaleStock, {
        "onShowForm": this.onClickForm
      }), (contentType === 'application' ? React.createElement(ApplicationSaleStock, null) : React.createElement(ContentSaleStock, {
        "onShowForm": this.onClickForm
      })));
    }
  });

  window.WrapperSaleStock = WrapperSaleStock;

}).call(this);
