(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = function () {
    function Events(parent) {
        _classCallCheck(this, Events);

        this.parent = parent || this;
        this.map = {};
        this.mapOnce = {};
        this.mapAlias = {};
    }
    /**
     * Добавить callback на событие event, срабатывает каждый раз
     * @param event string Имя события
     * @param callback function Фунция обработчик
     * @param alias string Внутреннее имя для управления обработчиками
     */


    _createClass(Events, [{
        key: 'bind',
        value: function bind(event, callback, alias) {
            if (typeof callback !== 'function') return;
            this.map[event] ? this.map[event].push(callback) : this.map[event] = [callback];
            alias ? this.mapAlias[alias] = callback : null;
        }
        /**
         * Добавить callback на событие event, срабатывает только один раз
         * @param event string Имя события
         * @param callback function Фунция обработчик
         * @param alias string Внутреннее имя для управления обработчиками
         */

    }, {
        key: 'bindOnce',
        value: function bindOnce(event, callback, alias) {
            if (typeof callback !== 'function') return;
            this.mapOnce[event] ? this.mapOnce[event].push(callback) : this.mapOnce[event] = [callback];
            alias ? this.mapAlias[alias] = callback : null;
        }
        /**
         * Удалить все обработчики события
         * @param event
         */

    }, {
        key: 'clear',
        value: function clear(event) {
            this.map[event] = this.mapOnce[event] = [];
        }
        /**
         * Удалить конкретный обработчик события, возможно импользовать имя
         * если оно было задано при установке обработчика или передать ссыллку на сам
         * обработчик
         * @param event
         * @param callback
         */

    }, {
        key: 'removeHandler',
        value: function removeHandler(event, callback) {
            var remCb = typeof callback == 'function' ? callback : this.mapAlias[callback];
            this.map[event] && remCb ? this.map[event] = this.map[event].filter(function (cb) {
                return cb != remCb;
            }) : null;
            this.mapOnce[event] && remCb ? this.mapOnce[event] = this.mapOnce[event].filter(function (cb) {
                return cb != remCb;
            }) : null;
        }
        /**
         * Запустить событие
         * @param event string Имя события
         * @param data mixed Данные для передачи обработчикам
         * @returns {Promise} Возвращает Promise который сработает после всех обработчиков
         */

    }, {
        key: 'fire',
        value: function fire(event, data) {
            var events = this;
            return new Promise(function (resolv, reject) {
                var ev = events.map[event] || [],
                    evOnce = events.mapOnce[event] || [],
                    result = [];
                for (var i = 0, len = ev.length; i < len; i++) {
                    result.push(events.call(ev[i], data));
                }
                while (evOnce.length > 0) {
                    result.push(events.call(evOnce.shift(), data));
                }resolv(result);
            });
        }
        /**
         * Внутренний метод для запуска обработчиков
         * @param callback
         * @param data
         */

    }, {
        key: 'call',
        value: function call(callback, data) {
            try {
                return callback.call(this.parent, data ? data : null);
            } catch (err) {
                console.error(err);
            }
        }
        /**
         * Назначить родителя обработчикам
         * @param parent
         */

    }, {
        key: 'setParent',
        value: function setParent(parent) {
            this.parent = parent;
        }
    }]);

    return Events;
}();

exports.default = Events;

/***/ })
/******/ ])));