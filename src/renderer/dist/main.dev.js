"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _axios = _interopRequireDefault(require("axios"));

var _App = _interopRequireDefault(require("./App"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

require("ant-design-vue/dist/antd.css");

var _antDesignVue = _interopRequireDefault(require("ant-design-vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//导入antd
_vue["default"].use(_antDesignVue["default"]);

if (!process.env.IS_WEB) _vue["default"].use(require('vue-electron'));
_vue["default"].http = _vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;
/* eslint-disable no-new */

new _vue["default"]({
  components: {
    App: _App["default"]
  },
  router: _router["default"],
  store: _store["default"],
  template: '<App/>'
}).$mount('#app');