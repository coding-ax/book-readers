"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var _default = new _vueRouter["default"]({
  routes: [{
    path: '/',
    name: 'landing-page',
    component: require('@/components/LandingPage')["default"]
  }, {
    path: '/books',
    name: 'books-page',
    component: require('@/components/BooksPage')["default"]
  }, {
    path: '/bookDetail',
    name: 'book-detail',
    component: require('@/components/BookDetail')["default"]
  }, {
    path: '*',
    redirect: '/'
  }]
});

exports["default"] = _default;