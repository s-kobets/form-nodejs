/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _methodsValidate = __webpack_require__(1);

var _methodsValidate2 = _interopRequireDefault(_methodsValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MyForm = {
    validate: function validate() {
        return {
            isValid: 'Boolean',
            errorFields: 'String'
        };
    },

    submit: function submit() {
        return undefined;
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var elementsName = ['fio', 'phone', 'email'];
    var elements = document.forms["myForm"].elements;
    var submit = document.getElementById('submitButton');
    var form = document.getElementById('myForm');
    var result = document.getElementById('resultContainer');

    MyForm.getData = getData;
    MyForm.setData = setData;
    MyForm.validate = validate;

    function getData(elements) {
        var elementForm = {};
        for (var i = 0; i < elements.length; i += 1) {
            if (elements[i].name) {
                elementForm[elements[i].name] = elements[i].value;
            }
        }
        return elementForm;
    }

    function setData(elementForm) {
        var errorFields = elementForm.errorFields;

        for (var i = 0; i < elements.length; i += 1) {
            elements[i].classList.remove('error');
        }
        errorFields.forEach(function (field) {
            if (elementsName.includes(field)) {
                elements[field].classList.add('error');
            }
        });
        return;
    }

    function validate() {
        var data = MyForm.getData(elements);
        var validateFio = _methodsValidate2.default.validateFio,
            validateEmail = _methodsValidate2.default.validateEmail,
            validatePhone = _methodsValidate2.default.validatePhone;

        var isValid = true;
        var errorFields = [];
        function error(key) {
            isValid = false;
            errorFields.push(key);
        }

        for (var key in data) {
            if (key === 'fio' && !validateFio(data[key])) {
                error(key);
            }
            if (key === 'email' && !validateEmail(data[key])) {
                error(key);
            }
            if (key === 'phone' && !validatePhone(data[key])) {
                error(key);
            }
        }
        return {
            isValid: isValid,
            errorFields: errorFields
        };
    }

    function request(xhr, body, target) {
        var url = form.getAttribute('action');
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(body.substr(1));
        target.setAttribute('disabled', true);
    }

    submit.addEventListener('click', function (e) {
        e.preventDefault();
        var target = e.target;
        var validate = MyForm.validate();
        var isValid = validate.isValid;


        setData(validate);
        if (isValid) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        target.removeAttribute('disabled');
                        var xnrResult = JSON.parse(xhr.responseText);
                        if (xnrResult.status.includes('error')) {
                            result.classList.add('error');
                            result.innerHTML = xnrResult.reason;
                        } else if (xnrResult.status.includes('progress')) {
                            result.classList.add('progress');
                            setTimeout(request(xhr, bodyRequest, target), xnrResult.timeout);
                        } else {
                            result.classList.add('success');
                            result.innerHTML = 'Success';
                            form.reset();
                        }
                    } else {
                        target.removeAttribute('disabled');
                        console.log(xhr.status + ': ' + xhr.statusText);
                    }
                }
            };
            var elementForm = MyForm.getData(elements);
            var bodyRequest = '';
            for (var key in elementForm) {
                bodyRequest += '&' + key + '=' + elementForm[key];
            }
            request(xhr, bodyRequest, target);
        }
    });
}, false);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var validateFio = function validateFio(value) {
    var valueFio = value.split(' ');
    for (var i = 0; i < valueFio.length; i += 1) {
        if (valueFio[i].length === 0) {
            return false;
        }
        if (i === 2) {
            return true;
        }
    }
    return false;
};

var validateEmail = function validateEmail(value) {
    var reg = /^([A-Za-z0-9_\-\.])+\@+(?:ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/;
    return reg.test(value);
};

var validatePhone = function validatePhone(value) {
    var reg = /^\+?\d.\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?[-.\s]?\d{2}[-.\s]?[-.\s]?\d{2}?$/;
    var valueArray = value.match(/[0-9]/gi);
    var total = 0;
    valueArray.forEach(function (element) {
        return total += Number(element);
    });
    return total <= 30 && reg.test(value);
};

exports.default = {
    validateFio: validateFio,
    validateEmail: validateEmail,
    validatePhone: validatePhone
};

/***/ })
/******/ ]);