"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Error) {
  _inherits(RiotError, _Error);

  function RiotError(message, status) {
    _classCallCheck(this, RiotError);

    // Capturing stack trace, excluding constructor call from it.
    var _this = _possibleConstructorReturn(this, (RiotError.__proto__ || Object.getPrototypeOf(RiotError)).call(this, message));

    // Calling parent constructor of base Error class.


    Error.captureStackTrace(_this, _this.constructor);

    // Saving class name in the property of our custom error as a shortcut.
    _this.name = _this.constructor.name;

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    _this.status = status || 500;

    return _this;
  }

  return RiotError;
}(Error);