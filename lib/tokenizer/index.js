'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

var _keyevent = require('../keyevent');

var _keyevent2 = _interopRequireDefault(_keyevent);

var _typeahead = require('../typeahead');

var _typeahead2 = _interopRequireDefault(_typeahead);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */

var Tokenizer = function (_Component) {
  _inherits(Tokenizer, _Component);

  function Tokenizer() {
    var _Object$getPrototypeO;

    _classCallCheck(this, Tokenizer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Tokenizer)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.state = {
      selected: _this.props.defaultSelected,
      category: '',
      operator: ''
    };

    _this._addTokenForValue = _this._addTokenForValue.bind(_this);
    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._getOptionsForTypeahead = _this._getOptionsForTypeahead.bind(_this);
    _this._removeTokenForValue = _this._removeTokenForValue.bind(_this);
    return _this;
  }

  _createClass(Tokenizer, [{
    key: '_renderTokens',


    // TODO: Support initialized tokens
    //
    value: function _renderTokens() {
      var _this2 = this;

      var tokenClasses = {};
      tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
      var classList = (0, _classnames2.default)(tokenClasses);
      var result = this.state.selected.map(function (selected) {
        var mykey = selected.category + selected.operator + selected.value;

        return _react2.default.createElement(
          _token2.default,
          {
            key: mykey,
            className: classList,
            onRemove: _this2._removeTokenForValue
          },
          selected
        );
      }, this);
      return result;
    }
  }, {
    key: '_getOptionsForTypeahead',
    value: function _getOptionsForTypeahead() {
      var categoryType = void 0;

      if (this.state.category === '') {
        var categories = [];
        for (var i = 0; i < this.props.options.length; i++) {
          categories.push(this.props.options[i].category);
        }
        return categories;
      } else if (this.state.operator === '') {
        categoryType = this._getCategoryType();

        if (categoryType === 'text') {
          return ['==', '!=', 'contains', '!contains'];
        } else if (categoryType === 'textoptions') {
          return ['==', '!='];
        } else if (categoryType === 'number' || categoryType === 'date') {
          return ['==', '!=', '<', '<=', '>', '>='];
        }

        /* eslint-disable no-console */
        console.warn('WARNING: Unknown category type in tokenizer: "' + categoryType + '"');
        /* eslint-enable no-console */

        return [];
      }
      var options = this._getCategoryOptions();
      if (options === null || options === undefined) return [];
      return options();
    }
  }, {
    key: '_getHeader',
    value: function _getHeader() {
      if (this.state.category === '') {
        return 'Category';
      } else if (this.state.operator === '') {
        return 'Operator';
      }

      return 'Value';
    }
  }, {
    key: '_getCategoryType',
    value: function _getCategoryType() {
      var categoryType = void 0;

      for (var i = 0; i < this.props.options.length; i++) {
        if (this.props.options[i].category === this.state.category) {
          categoryType = this.props.options[i].type;
          return categoryType;
        }
      }
    }
  }, {
    key: '_getCategoryOptions',
    value: function _getCategoryOptions() {
      for (var i = 0; i < this.props.options.length; i++) {
        if (this.props.options[i].category === this.state.category) {
          return this.props.options[i].options;
        }
      }
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      // We only care about intercepting backspaces
      if (event.keyCode !== _keyevent2.default.DOM_VK_BACK_SPACE) {
        return;
      }

      // Remove token ONLY when bksp pressed at beginning of line
      // without a selection
      var entry = _reactDom2.default.findDOMNode(this.refs.typeahead.refs.inner.inputRef());
      if (entry.selectionStart === entry.selectionEnd && entry.selectionStart === 0) {
        if (this.state.operator !== '') {
          this.setState({ operator: '' });
        } else if (this.state.category !== '') {
          this.setState({ category: '' });
        } else {
          // No tokens
          if (!this.state.selected.length) {
            return;
          }
          this._removeTokenForValue(this.state.selected[this.state.selected.length - 1]);
        }
        event.preventDefault();
      }
    }
  }, {
    key: '_removeTokenForValue',
    value: function _removeTokenForValue(value) {
      var index = this.state.selected.indexOf(value);
      if (index === -1) {
        return;
      }

      this.state.selected.splice(index, 1);
      this.setState({ selected: this.state.selected });
      this.props.onTokenRemove(this.state.selected);

      return;
    }
  }, {
    key: '_addTokenForValue',
    value: function _addTokenForValue(value) {
      if (this.state.category === '') {
        this.setState({ category: value });
        this.refs.typeahead.refs.inner.setEntryText('');
        return;
      }

      if (this.state.operator === '') {
        this.setState({ operator: value });
        this.refs.typeahead.refs.inner.setEntryText('');
        return;
      }

      var newValue = {
        category: this.state.category,
        operator: this.state.operator,
        value: value
      };

      this.state.selected.push(newValue);
      this.setState({ selected: this.state.selected });
      this.refs.typeahead.refs.inner.setEntryText('');
      this.props.onTokenAdd(this.state.selected);

      this.setState({
        category: '',
        operator: ''
      });

      return;
    }

    /*
     * Returns the data type the input should use ("date" or "text")
     */

  }, {
    key: '_getInputType',
    value: function _getInputType() {
      if (this.state.category !== '' && this.state.operator !== '') {
        return this._getCategoryType();
      }

      return 'text';
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = {};
      classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
      var classList = (0, _classnames2.default)(classes);
      return _react2.default.createElement(
        'div',
        { className: 'filter-tokenizer' },
        _react2.default.createElement(
          'div',
          { className: 'token-collection' },
          this._renderTokens(),
          _react2.default.createElement(
            'div',
            { className: 'filter-input-group' },
            _react2.default.createElement(
              'div',
              { className: 'filter-category' },
              this.state.category,
              ' '
            ),
            _react2.default.createElement(
              'div',
              { className: 'filter-operator' },
              this.state.operator,
              ' '
            ),
            _react2.default.createElement(_typeahead2.default, { ref: 'typeahead',
              className: classList,
              placeholder: this.props.placeholder,
              customClasses: this.props.customClasses,
              options: this._getOptionsForTypeahead(),
              header: this._getHeader(),
              datatype: this._getInputType(),
              defaultValue: this.props.defaultValue,
              onOptionSelected: this._addTokenForValue,
              onKeyDown: this._onKeyDown
            })
          )
        )
      );
    }
  }]);

  return Tokenizer;
}(_react.Component);

Tokenizer.propTypes = {
  options: _react.PropTypes.array,
  customClasses: _react.PropTypes.object,
  defaultSelected: _react.PropTypes.array,
  defaultValue: _react.PropTypes.string,
  placeholder: _react.PropTypes.string,
  onTokenRemove: _react.PropTypes.func,
  onTokenAdd: _react.PropTypes.func
};
Tokenizer.defaultProps = {
  options: [],
  defaultSelected: [],
  customClasses: {},
  defaultValue: '',
  placeholder: '',
  onTokenAdd: function onTokenAdd() {},
  onTokenRemove: function onTokenRemove() {}
};
exports.default = Tokenizer;