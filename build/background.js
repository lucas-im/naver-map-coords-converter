/* -------------------------------------------------- */

/*  Start of Webpack Chrome Hot Extension Middleware  */

/* ================================================== */

/*  This will be converted into a lodash templ., any  */

/*  external argument must be provided using it       */

/* -------------------------------------------------- */
(function (chrome, window) {
  var signals = JSON.parse('{"SIGN_CHANGE":"SIGN_CHANGE","SIGN_RELOAD":"SIGN_RELOAD","SIGN_RELOADED":"SIGN_RELOADED","SIGN_LOG":"SIGN_LOG","SIGN_CONNECT":"SIGN_CONNECT"}');
  var config = JSON.parse('{"RECONNECT_INTERVAL":2000,"SOCKET_ERR_CODE_REF":"https://tools.ietf.org/html/rfc6455#section-7.4.1"}');
  var reloadPage = "true" === "true";
  var wsHost = "ws://localhost:9090";
  var SIGN_CHANGE = signals.SIGN_CHANGE,
      SIGN_RELOAD = signals.SIGN_RELOAD,
      SIGN_RELOADED = signals.SIGN_RELOADED,
      SIGN_LOG = signals.SIGN_LOG,
      SIGN_CONNECT = signals.SIGN_CONNECT;
  var RECONNECT_INTERVAL = config.RECONNECT_INTERVAL,
      SOCKET_ERR_CODE_REF = config.SOCKET_ERR_CODE_REF;
  var runtime = chrome.runtime,
      tabs = chrome.tabs;
  var manifest = runtime.getManifest(); // =============================== Helper functions ======================================= //

  var formatter = function formatter(msg) {
    return "[ WCER: ".concat(msg, " ]");
  };

  var logger = function logger(msg) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "info";
    return console[level](formatter(msg));
  };

  var timeFormatter = function timeFormatter(date) {
    return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
  }; // ========================== Called only on content scripts ============================== //


  function contentScriptWorker() {
    runtime.sendMessage({
      type: SIGN_CONNECT
    }, function (msg) {
      return console.info(msg);
    });
    runtime.onMessage.addListener(function (_ref) {
      var type = _ref.type,
          payload = _ref.payload;

      switch (type) {
        case SIGN_RELOAD:
          logger("Detected Changes. Reloading ...");
          reloadPage && window.location.reload();
          break;

        case SIGN_LOG:
          console.info(payload);
          break;
      }
    });
  } // ======================== Called only on background scripts ============================= //


  function backgroundWorker(socket) {
    runtime.onMessage.addListener(function (action, sender, sendResponse) {
      if (action.type === SIGN_CONNECT) {
        sendResponse(formatter("Connected to Chrome Extension Hot Reloader"));
      }
    });
    socket.addEventListener("message", function (_ref2) {
      var data = _ref2.data;

      var _JSON$parse = JSON.parse(data),
          type = _JSON$parse.type,
          payload = _JSON$parse.payload;

      if (type === SIGN_CHANGE) {
        tabs.query({
          status: "complete"
        }, function (loadedTabs) {
          loadedTabs.forEach(function (tab) {
            return tab.id && tabs.sendMessage(tab.id, {
              type: SIGN_RELOAD
            });
          });
          socket.send(JSON.stringify({
            type: SIGN_RELOADED,
            payload: formatter("".concat(timeFormatter(new Date()), " - ").concat(manifest.name, " successfully reloaded"))
          }));
          runtime.reload();
        });
      } else {
        runtime.sendMessage({
          type: type,
          payload: payload
        });
      }
    });
    socket.addEventListener("close", function (_ref3) {
      var code = _ref3.code;
      logger("Socket connection closed. Code ".concat(code, ". See more in ").concat(SOCKET_ERR_CODE_REF), "warn");
      var intId = setInterval(function () {
        logger("Attempting to reconnect (tip: Check if Webpack is running)");
        var ws = new WebSocket(wsHost);
        ws.addEventListener("open", function () {
          clearInterval(intId);
          logger("Reconnected. Reloading plugin");
          runtime.reload();
        });
      }, RECONNECT_INTERVAL);
    });
  } // ======================= Bootstraps the middleware =========================== //


  runtime.reload ? backgroundWorker(new WebSocket(wsHost)) : contentScriptWorker();
})(chrome, window);
/* ----------------------------------------------- */

/* End of Webpack Chrome Hot Extension Middleware  */

/* ----------------------------------------------- *//******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./background.js":
/*!***********************!*\
  !*** ./background.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_jquery_3_6_0_min__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/jquery-3.6.0.min */ "./lib/jquery-3.6.0.min.js");
/* harmony import */ var _lib_jquery_3_6_0_min__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_jquery_3_6_0_min__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var proj4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! proj4 */ "./node_modules/proj4/lib/index.js");



const convertCoors = (oriCoords) => {
    const wgs84Projection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
    const naverMap3857Projion = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs'
    try { return Object(proj4__WEBPACK_IMPORTED_MODULE_1__["default"])(naverMap3857Projion, wgs84Projection, oriCoords) }
    catch (e) {
        alert(`주소 변환 실패!{e}`)
    }
}
const buttonClicked = (coords, newText) => {
    const tempElem = document.createElement('input')
    tempElem.value = coords
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);
    const temp = newText.innerHTML;
    newText.innerHTML = '좌표 복사 완료!'
    newText.style.backgroundColor = '#bbe6b3'
    setTimeout(() => {
        newText.innerHTML = temp
        newText.style.backgroundColor = '#FFCCCB'
    }, 1000)
}
if (window.sessionStorage !== 'undefined') {
    const target = document.documentElement || document.body
    const observer = new MutationObserver(mutation => {
        mutation.forEach((e) => {
            if (e.target.className === 'entry_wrap loaded') {
                const substr1 = document.URL.split('/')
                const substr2 = substr1[substr1.length - 1].split(',')
                const oriCoords = [parseFloat(substr2[0]), parseFloat(substr2[1])]
                const newCoords = convertCoors(oriCoords)
                const temp = newCoords[0]
                newCoords[0] = newCoords[1]
                newCoords[1] = temp
                const placeHolder = _lib_jquery_3_6_0_min__WEBPACK_IMPORTED_MODULE_0___default()('.end_box')
                console.log(placeHolder.children[0])
                //setTimeout(placeHolder[0].children[0].click(), 2000)
                const newText = document.createElement('a')
                newText.innerHTML = newCoords[0] + ', ' + newCoords[1]
                console.log(newText)
                placeHolder.append(newText)
                newText.addEventListener('click', () => buttonClicked(newCoords, newText))
                newText.style.backgroundColor = '#FFCCCB'
                return
            }
        })
    })

    const config = {
        childList: true,
        subtree: true
    };
    observer.observe(target, config);
}

/***/ }),

/***/ "./lib/jquery-3.6.0.min.js":
/*!*********************************!*\
  !*** ./lib/jquery-3.6.0.min.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict"; true&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.6.0",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),j=function(e,t){return e===t&&(l=!0),0},D={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},j=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&D.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(j),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(j).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var D,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||D,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,D=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^([^.]*)(?:\.(.+)|)/;function we(){return!0}function Te(){return!1}function Ce(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function Ee(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Ee(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Te;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Se(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n&&n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,we)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=be.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=be.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click",we),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?we:Te,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Te,isPropagationStopped:Te,isImmediatePropagationStopped:Te,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=we,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=we,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=we,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Se(this,e,Ce),!1},trigger:function(){return Se(this,e),!0},_default:function(){return!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return Ee(this,e,t,n,r)},one:function(e,t,n,r){return Ee(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Te),this.each(function(){S.event.remove(this,e,n,t)})}});var ke=/<script|<style|<link/i,Ae=/checked\s*(?:[^=]|=\s*.checked.)/i,Ne=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function je(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function De(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function qe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Le(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function He(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&Ae.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),He(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),De)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,qe),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(Ne,""),u,l))}return n}function Oe(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Le(o[r],a[r]);else Le(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Oe(this,e,!0)},remove:function(e){return Oe(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return He(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||je(this,e).appendChild(e)})},prepend:function(){return He(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=je(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!ke.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return He(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Pe=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Re=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},Me=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Ie=new RegExp(ne.join("|"),"i");function We(e,t,n){var r,i,o,a,s=e.style;return(n=n||Re(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Pe.test(a)&&Ie.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function Fe(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="border:1px solid",t.style.height="1px",n.style.height="9px",n.style.display="block",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=parseInt(r.height,10)+parseInt(r.borderTopWidth,10)+parseInt(r.borderBottomWidth,10)===t.offsetHeight,re.removeChild(e)),a}}))}();var Be=["Webkit","Moz","ms"],$e=E.createElement("div").style,_e={};function ze(e){var t=S.cssProps[e]||_e[e];return t||(e in $e?e:_e[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=Be.length;while(n--)if((e=Be[n]+t)in $e)return e}(e)||e)}var Ue=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ve={position:"absolute",visibility:"hidden",display:"block"},Ge={letterSpacing:"0",fontWeight:"400"};function Ye(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Qe(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Je(e,t,n){var r=Re(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=We(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Pe.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Qe(e,t,n||(i?"border":"content"),o,r,a)+"px"}function Ke(e,t,n,r,i){return new Ke.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=We(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Xe.test(t),l=e.style;if(u||(t=ze(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Xe.test(t)||(t=ze(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=We(e,t,r)),"normal"===i&&t in Ge&&(i=Ge[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ue.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Je(e,u,n):Me(e,Ve,function(){return Je(e,u,n)})},set:function(e,t,n){var r,i=Re(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Qe(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Qe(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Ye(0,t,s)}}}),S.cssHooks.marginLeft=Fe(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(We(e,"marginLeft"))||e.getBoundingClientRect().left-Me(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Ye)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Re(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=Ke).prototype={constructor:Ke,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=Ke.propHooks[this.prop];return e&&e.get?e.get(this):Ke.propHooks._default.get(this)},run:function(e){var t,n=Ke.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ke.propHooks._default.set(this),this}}).init.prototype=Ke.prototype,(Ke.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[ze(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=Ke.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=Ke.prototype.init,S.fx.step={};var Ze,et,tt,nt,rt=/^(?:toggle|show|hide)$/,it=/queueHooks$/;function ot(){et&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(ot):C.setTimeout(ot,S.fx.interval),S.fx.tick())}function at(){return C.setTimeout(function(){Ze=void 0}),Ze=Date.now()}function st(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ut(e,t,n){for(var r,i=(lt.tweeners[t]||[]).concat(lt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function lt(o,e,t){var n,a,r=0,i=lt.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=Ze||at(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:Ze||at(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=lt.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ut,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(lt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],lt.tweeners[n]=lt.tweeners[n]||[],lt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],rt.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ut(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?lt.prefilters.unshift(e):lt.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=lt(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&it.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(st(r,!0),e,t,n)}}),S.each({slideDown:st("show"),slideUp:st("hide"),slideToggle:st("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(Ze=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),Ze=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){et||(et=!0,ot())},S.fx.stop=function(){et=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},tt=E.createElement("input"),nt=E.createElement("select").appendChild(E.createElement("option")),tt.type="checkbox",y.checkOn=""!==tt.value,y.optSelected=nt.selected,(tt=E.createElement("input")).value="t",tt.type="radio",y.radioValue="t"===tt.value;var ct,ft=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?ct:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),ct={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=ft[t]||S.find.attr;ft[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=ft[o],ft[o]=r,r=null!=a(e,t,n)?o:null,ft[o]=i),r}});var pt=/^(?:input|select|textarea|button)$/i,dt=/^(?:a|area)$/i;function ht(e){return(e.match(P)||[]).join(" ")}function gt(e){return e.getAttribute&&e.getAttribute("class")||""}function vt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):pt.test(e.nodeName)||dt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,gt(this)))});if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,gt(this)))});if(!arguments.length)return this.attr("class","");if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,gt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=vt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=gt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+ht(gt(n))+" ").indexOf(t))return!0;return!1}});var yt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(yt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:ht(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var mt=/^(?:focusinfocus|focusoutblur)$/,xt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!mt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,mt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,xt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,xt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var bt=C.location,wt={guid:Date.now()},Tt=/\?/;S.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){}return n=t&&t.getElementsByTagName("parsererror")[0],t&&!n||S.error("Invalid XML: "+(n?S.map(n.childNodes,function(e){return e.textContent}).join("\n"):e)),t};var Ct=/\[\]$/,Et=/\r?\n/g,St=/^(?:submit|button|image|reset|file)$/i,kt=/^(?:input|select|textarea|keygen)/i;function At(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||Ct.test(n)?i(n,t):At(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)At(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)At(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&kt.test(this.nodeName)&&!St.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(Et,"\r\n")}}):{name:t.name,value:n.replace(Et,"\r\n")}}).get()}});var Nt=/%20/g,jt=/#.*$/,Dt=/([?&])_=[^&]*/,qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Lt=/^(?:GET|HEAD)$/,Ht=/^\/\//,Ot={},Pt={},Rt="*/".concat("*"),Mt=E.createElement("a");function It(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Wt(t,i,o,a){var s={},u=t===Pt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function Ft(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Mt.href=bt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:bt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Rt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Ft(Ft(e,S.ajaxSettings),t):Ft(S.ajaxSettings,e)},ajaxPrefilter:It(Ot),ajaxTransport:It(Pt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=qt.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||bt.href)+"").replace(Ht,bt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Mt.protocol+"//"+Mt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Wt(Ot,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Lt.test(v.type),f=v.url.replace(jt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(Nt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Tt.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Dt,"$1"),o=(Tt.test(f)?"&":"?")+"_="+wt.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+Rt+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Wt(Pt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&S.inArray("json",v.dataTypes)<0&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var Bt={0:200,1223:204},$t=S.ajaxSettings.xhr();y.cors=!!$t&&"withCredentials"in $t,y.ajax=$t=!!$t,S.ajaxTransport(function(i){var o,a;if(y.cors||$t&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(Bt[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var _t,zt=[],Ut=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=zt.pop()||S.expando+"_"+wt.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Ut.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ut.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Ut,"$1"+r):!1!==e.jsonp&&(e.url+=(Tt.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,zt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((_t=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===_t.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=ht(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):c.css(f)}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=Fe(y.pixelPosition,function(e,t){if(t)return t=We(e,n),Pe.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Xt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Xt,"")}, true&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return S}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));var Vt=C.jQuery,Gt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Gt),e&&C.jQuery===S&&(C.jQuery=Vt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});

/***/ }),

/***/ "./node_modules/mgrs/mgrs.js":
/*!***********************************!*\
  !*** ./node_modules/mgrs/mgrs.js ***!
  \***********************************/
/*! exports provided: default, forward, inverse, toPoint */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toPoint", function() { return toPoint; });



/**
 * UTM zones are grouped, and assigned to one of a group of 6
 * sets.
 *
 * {int} @private
 */
var NUM_100K_SETS = 6;

/**
 * The column letters (for easting) of the lower left value, per
 * set.
 *
 * {string} @private
 */
var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

/**
 * The row letters (for northing) of the lower left value, per
 * set.
 *
 * {string} @private
 */
var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

var A = 65; // A
var I = 73; // I
var O = 79; // O
var V = 86; // V
var Z = 90; // Z
/* harmony default export */ __webpack_exports__["default"] = ({
  forward: forward,
  inverse: inverse,
  toPoint: toPoint
});
/**
 * Conversion of lat/lon to MGRS.
 *
 * @param {object} ll Object literal with lat and lon properties on a
 *     WGS84 ellipsoid.
 * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
 *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
 * @return {string} the MGRS string for the given location and accuracy.
 */
function forward(ll, accuracy) {
  accuracy = accuracy || 5; // default accuracy 1m
  return encode(LLtoUTM({
    lat: ll[1],
    lon: ll[0]
  }), accuracy);
};

/**
 * Conversion of MGRS to lat/lon.
 *
 * @param {string} mgrs MGRS string.
 * @return {array} An array with left (longitude), bottom (latitude), right
 *     (longitude) and top (latitude) values in WGS84, representing the
 *     bounding box for the provided MGRS reference.
 */
function inverse(mgrs) {
  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
  if (bbox.lat && bbox.lon) {
    return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
  }
  return [bbox.left, bbox.bottom, bbox.right, bbox.top];
};

function toPoint(mgrs) {
  var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
  if (bbox.lat && bbox.lon) {
    return [bbox.lon, bbox.lat];
  }
  return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
};
/**
 * Conversion from degrees to radians.
 *
 * @private
 * @param {number} deg the angle in degrees.
 * @return {number} the angle in radians.
 */
function degToRad(deg) {
  return (deg * (Math.PI / 180.0));
}

/**
 * Conversion from radians to degrees.
 *
 * @private
 * @param {number} rad the angle in radians.
 * @return {number} the angle in degrees.
 */
function radToDeg(rad) {
  return (180.0 * (rad / Math.PI));
}

/**
 * Converts a set of Longitude and Latitude co-ordinates to UTM
 * using the WGS84 ellipsoid.
 *
 * @private
 * @param {object} ll Object literal with lat and lon properties
 *     representing the WGS84 coordinate to be converted.
 * @return {object} Object literal containing the UTM value with easting,
 *     northing, zoneNumber and zoneLetter properties, and an optional
 *     accuracy property in digits. Returns null if the conversion failed.
 */
function LLtoUTM(ll) {
  var Lat = ll.lat;
  var Long = ll.lon;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var k0 = 0.9996;
  var LongOrigin;
  var eccPrimeSquared;
  var N, T, C, A, M;
  var LatRad = degToRad(Lat);
  var LongRad = degToRad(Long);
  var LongOriginRad;
  var ZoneNumber;
  // (int)
  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

  //Make sure the longitude 180.00 is in Zone 60
  if (Long === 180) {
    ZoneNumber = 60;
  }

  // Special zone for Norway
  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
    ZoneNumber = 32;
  }

  // Special zones for Svalbard
  if (Lat >= 72.0 && Lat < 84.0) {
    if (Long >= 0.0 && Long < 9.0) {
      ZoneNumber = 31;
    }
    else if (Long >= 9.0 && Long < 21.0) {
      ZoneNumber = 33;
    }
    else if (Long >= 21.0 && Long < 33.0) {
      ZoneNumber = 35;
    }
    else if (Long >= 33.0 && Long < 42.0) {
      ZoneNumber = 37;
    }
  }

  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
  // in middle of
  // zone
  LongOriginRad = degToRad(LongOrigin);

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
  T = Math.tan(LatRad) * Math.tan(LatRad);
  C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
  A = Math.cos(LatRad) * (LongRad - LongOriginRad);

  M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

  var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

  var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
  if (Lat < 0.0) {
    UTMNorthing += 10000000.0; //10000000 meter offset for
    // southern hemisphere
  }

  return {
    northing: Math.round(UTMNorthing),
    easting: Math.round(UTMEasting),
    zoneNumber: ZoneNumber,
    zoneLetter: getLetterDesignator(Lat)
  };
}

/**
 * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
 * class where the Zone can be specified as a single string eg."60N" which
 * is then broken down into the ZoneNumber and ZoneLetter.
 *
 * @private
 * @param {object} utm An object literal with northing, easting, zoneNumber
 *     and zoneLetter properties. If an optional accuracy property is
 *     provided (in meters), a bounding box will be returned instead of
 *     latitude and longitude.
 * @return {object} An object literal containing either lat and lon values
 *     (if no accuracy was provided), or top, right, bottom and left values
 *     for the bounding box calculated according to the provided accuracy.
 *     Returns null if the conversion failed.
 */
function UTMtoLL(utm) {

  var UTMNorthing = utm.northing;
  var UTMEasting = utm.easting;
  var zoneLetter = utm.zoneLetter;
  var zoneNumber = utm.zoneNumber;
  // check the ZoneNummber is valid
  if (zoneNumber < 0 || zoneNumber > 60) {
    return null;
  }

  var k0 = 0.9996;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var eccPrimeSquared;
  var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
  var N1, T1, C1, R1, D, M;
  var LongOrigin;
  var mu, phi1Rad;

  // remove 500,000 meter offset for longitude
  var x = UTMEasting - 500000.0;
  var y = UTMNorthing;

  // We must know somehow if we are in the Northern or Southern
  // hemisphere, this is the only time we use the letter So even
  // if the Zone letter isn't exactly correct it should indicate
  // the hemisphere correctly
  if (zoneLetter < 'N') {
    y -= 10000000.0; // remove 10,000,000 meter offset used
    // for southern hemisphere
  }

  // There are 60 zones with zone 1 being at West -180 to -174
  LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
  // in middle of
  // zone

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  M = y / k0;
  mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

  phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
  // double phi1 = ProjMath.radToDeg(phi1Rad);

  N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  D = x / (N1 * k0);

  var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  lat = radToDeg(lat);

  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
  lon = LongOrigin + radToDeg(lon);

  var result;
  if (utm.accuracy) {
    var topRight = UTMtoLL({
      northing: utm.northing + utm.accuracy,
      easting: utm.easting + utm.accuracy,
      zoneLetter: utm.zoneLetter,
      zoneNumber: utm.zoneNumber
    });
    result = {
      top: topRight.lat,
      right: topRight.lon,
      bottom: lat,
      left: lon
    };
  }
  else {
    result = {
      lat: lat,
      lon: lon
    };
  }
  return result;
}

/**
 * Calculates the MGRS letter designator for the given latitude.
 *
 * @private
 * @param {number} lat The latitude in WGS84 to get the letter designator
 *     for.
 * @return {char} The letter designator.
 */
function getLetterDesignator(lat) {
  //This is here as an error flag to show that the Latitude is
  //outside MGRS limits
  var LetterDesignator = 'Z';

  if ((84 >= lat) && (lat >= 72)) {
    LetterDesignator = 'X';
  }
  else if ((72 > lat) && (lat >= 64)) {
    LetterDesignator = 'W';
  }
  else if ((64 > lat) && (lat >= 56)) {
    LetterDesignator = 'V';
  }
  else if ((56 > lat) && (lat >= 48)) {
    LetterDesignator = 'U';
  }
  else if ((48 > lat) && (lat >= 40)) {
    LetterDesignator = 'T';
  }
  else if ((40 > lat) && (lat >= 32)) {
    LetterDesignator = 'S';
  }
  else if ((32 > lat) && (lat >= 24)) {
    LetterDesignator = 'R';
  }
  else if ((24 > lat) && (lat >= 16)) {
    LetterDesignator = 'Q';
  }
  else if ((16 > lat) && (lat >= 8)) {
    LetterDesignator = 'P';
  }
  else if ((8 > lat) && (lat >= 0)) {
    LetterDesignator = 'N';
  }
  else if ((0 > lat) && (lat >= -8)) {
    LetterDesignator = 'M';
  }
  else if ((-8 > lat) && (lat >= -16)) {
    LetterDesignator = 'L';
  }
  else if ((-16 > lat) && (lat >= -24)) {
    LetterDesignator = 'K';
  }
  else if ((-24 > lat) && (lat >= -32)) {
    LetterDesignator = 'J';
  }
  else if ((-32 > lat) && (lat >= -40)) {
    LetterDesignator = 'H';
  }
  else if ((-40 > lat) && (lat >= -48)) {
    LetterDesignator = 'G';
  }
  else if ((-48 > lat) && (lat >= -56)) {
    LetterDesignator = 'F';
  }
  else if ((-56 > lat) && (lat >= -64)) {
    LetterDesignator = 'E';
  }
  else if ((-64 > lat) && (lat >= -72)) {
    LetterDesignator = 'D';
  }
  else if ((-72 > lat) && (lat >= -80)) {
    LetterDesignator = 'C';
  }
  return LetterDesignator;
}

/**
 * Encodes a UTM location as MGRS string.
 *
 * @private
 * @param {object} utm An object literal with easting, northing,
 *     zoneLetter, zoneNumber
 * @param {number} accuracy Accuracy in digits (1-5).
 * @return {string} MGRS string for the given UTM location.
 */
function encode(utm, accuracy) {
  // prepend with leading zeroes
  var seasting = "00000" + utm.easting,
    snorthing = "00000" + utm.northing;

  return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
}

/**
 * Get the two letter 100k designator for a given UTM easting,
 * northing and zone number value.
 *
 * @private
 * @param {number} easting
 * @param {number} northing
 * @param {number} zoneNumber
 * @return the two letter 100k designator for the given UTM location.
 */
function get100kID(easting, northing, zoneNumber) {
  var setParm = get100kSetForZone(zoneNumber);
  var setColumn = Math.floor(easting / 100000);
  var setRow = Math.floor(northing / 100000) % 20;
  return getLetter100kID(setColumn, setRow, setParm);
}

/**
 * Given a UTM zone number, figure out the MGRS 100K set it is in.
 *
 * @private
 * @param {number} i An UTM zone number.
 * @return {number} the 100k set the UTM zone is in.
 */
function get100kSetForZone(i) {
  var setParm = i % NUM_100K_SETS;
  if (setParm === 0) {
    setParm = NUM_100K_SETS;
  }

  return setParm;
}

/**
 * Get the two-letter MGRS 100k designator given information
 * translated from the UTM northing, easting and zone number.
 *
 * @private
 * @param {number} column the column index as it relates to the MGRS
 *        100k set spreadsheet, created from the UTM easting.
 *        Values are 1-8.
 * @param {number} row the row index as it relates to the MGRS 100k set
 *        spreadsheet, created from the UTM northing value. Values
 *        are from 0-19.
 * @param {number} parm the set block, as it relates to the MGRS 100k set
 *        spreadsheet, created from the UTM zone. Values are from
 *        1-60.
 * @return two letter MGRS 100k code.
 */
function getLetter100kID(column, row, parm) {
  // colOrigin and rowOrigin are the letters at the origin of the set
  var index = parm - 1;
  var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
  var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

  // colInt and rowInt are the letters to build to return
  var colInt = colOrigin + column - 1;
  var rowInt = rowOrigin + row;
  var rollover = false;

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
    rollover = true;
  }

  if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
    colInt++;
  }

  if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
    colInt++;

    if (colInt === I) {
      colInt++;
    }
  }

  if (colInt > Z) {
    colInt = colInt - Z + A - 1;
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
    rollover = true;
  }
  else {
    rollover = false;
  }

  if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
    rowInt++;
  }

  if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
    rowInt++;

    if (rowInt === I) {
      rowInt++;
    }
  }

  if (rowInt > V) {
    rowInt = rowInt - V + A - 1;
  }

  var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
  return twoLetter;
}

/**
 * Decode the UTM parameters from a MGRS string.
 *
 * @private
 * @param {string} mgrsString an UPPERCASE coordinate string is expected.
 * @return {object} An object literal with easting, northing, zoneLetter,
 *     zoneNumber and accuracy (in meters) properties.
 */
function decode(mgrsString) {

  if (mgrsString && mgrsString.length === 0) {
    throw ("MGRSPoint coverting from nothing");
  }

  var length = mgrsString.length;

  var hunK = null;
  var sb = "";
  var testChar;
  var i = 0;

  // get Zone number
  while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
    if (i >= 2) {
      throw ("MGRSPoint bad conversion from: " + mgrsString);
    }
    sb += testChar;
    i++;
  }

  var zoneNumber = parseInt(sb, 10);

  if (i === 0 || i + 3 > length) {
    // A good MGRS string has to be 4-5 digits long,
    // ##AAA/#AAA at least.
    throw ("MGRSPoint bad conversion from: " + mgrsString);
  }

  var zoneLetter = mgrsString.charAt(i++);

  // Should we check the zone letter here? Why not.
  if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
    throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
  }

  hunK = mgrsString.substring(i, i += 2);

  var set = get100kSetForZone(zoneNumber);

  var east100k = getEastingFromChar(hunK.charAt(0), set);
  var north100k = getNorthingFromChar(hunK.charAt(1), set);

  // We have a bug where the northing may be 2000000 too low.
  // How
  // do we know when to roll over?

  while (north100k < getMinNorthing(zoneLetter)) {
    north100k += 2000000;
  }

  // calculate the char index for easting/northing separator
  var remainder = length - i;

  if (remainder % 2 !== 0) {
    throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
  }

  var sep = remainder / 2;

  var sepEasting = 0.0;
  var sepNorthing = 0.0;
  var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
  if (sep > 0) {
    accuracyBonus = 100000.0 / Math.pow(10, sep);
    sepEastingString = mgrsString.substring(i, i + sep);
    sepEasting = parseFloat(sepEastingString) * accuracyBonus;
    sepNorthingString = mgrsString.substring(i + sep);
    sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
  }

  easting = sepEasting + east100k;
  northing = sepNorthing + north100k;

  return {
    easting: easting,
    northing: northing,
    zoneLetter: zoneLetter,
    zoneNumber: zoneNumber,
    accuracy: accuracyBonus
  };
}

/**
 * Given the first letter from a two-letter MGRS 100k zone, and given the
 * MGRS table set for the zone number, figure out the easting value that
 * should be added to the other, secondary easting value.
 *
 * @private
 * @param {char} e The first letter from a two-letter MGRS 100´k zone.
 * @param {number} set The MGRS table set for the zone number.
 * @return {number} The easting value for the given letter and set.
 */
function getEastingFromChar(e, set) {
  // colOrigin is the letter at the origin of the set for the
  // column
  var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
  var eastingValue = 100000.0;
  var rewindMarker = false;

  while (curCol !== e.charCodeAt(0)) {
    curCol++;
    if (curCol === I) {
      curCol++;
    }
    if (curCol === O) {
      curCol++;
    }
    if (curCol > Z) {
      if (rewindMarker) {
        throw ("Bad character: " + e);
      }
      curCol = A;
      rewindMarker = true;
    }
    eastingValue += 100000.0;
  }

  return eastingValue;
}

/**
 * Given the second letter from a two-letter MGRS 100k zone, and given the
 * MGRS table set for the zone number, figure out the northing value that
 * should be added to the other, secondary northing value. You have to
 * remember that Northings are determined from the equator, and the vertical
 * cycle of letters mean a 2000000 additional northing meters. This happens
 * approx. every 18 degrees of latitude. This method does *NOT* count any
 * additional northings. You have to figure out how many 2000000 meters need
 * to be added for the zone letter of the MGRS coordinate.
 *
 * @private
 * @param {char} n Second letter of the MGRS 100k zone
 * @param {number} set The MGRS table set number, which is dependent on the
 *     UTM zone number.
 * @return {number} The northing value for the given letter and set.
 */
function getNorthingFromChar(n, set) {

  if (n > 'V') {
    throw ("MGRSPoint given invalid Northing " + n);
  }

  // rowOrigin is the letter at the origin of the set for the
  // column
  var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
  var northingValue = 0.0;
  var rewindMarker = false;

  while (curRow !== n.charCodeAt(0)) {
    curRow++;
    if (curRow === I) {
      curRow++;
    }
    if (curRow === O) {
      curRow++;
    }
    // fixing a bug making whole application hang in this loop
    // when 'n' is a wrong character
    if (curRow > V) {
      if (rewindMarker) { // making sure that this loop ends
        throw ("Bad character: " + n);
      }
      curRow = A;
      rewindMarker = true;
    }
    northingValue += 100000.0;
  }

  return northingValue;
}

/**
 * The function getMinNorthing returns the minimum northing value of a MGRS
 * zone.
 *
 * Ported from Geotrans' c Lattitude_Band_Value structure table.
 *
 * @private
 * @param {char} zoneLetter The MGRS zone to get the min northing for.
 * @return {number}
 */
function getMinNorthing(zoneLetter) {
  var northing;
  switch (zoneLetter) {
  case 'C':
    northing = 1100000.0;
    break;
  case 'D':
    northing = 2000000.0;
    break;
  case 'E':
    northing = 2800000.0;
    break;
  case 'F':
    northing = 3700000.0;
    break;
  case 'G':
    northing = 4600000.0;
    break;
  case 'H':
    northing = 5500000.0;
    break;
  case 'J':
    northing = 6400000.0;
    break;
  case 'K':
    northing = 7300000.0;
    break;
  case 'L':
    northing = 8200000.0;
    break;
  case 'M':
    northing = 9100000.0;
    break;
  case 'N':
    northing = 0.0;
    break;
  case 'P':
    northing = 800000.0;
    break;
  case 'Q':
    northing = 1700000.0;
    break;
  case 'R':
    northing = 2600000.0;
    break;
  case 'S':
    northing = 3500000.0;
    break;
  case 'T':
    northing = 4400000.0;
    break;
  case 'U':
    northing = 5300000.0;
    break;
  case 'V':
    northing = 6200000.0;
    break;
  case 'W':
    northing = 7000000.0;
    break;
  case 'X':
    northing = 7900000.0;
    break;
  default:
    northing = -1.0;
  }
  if (northing >= 0.0) {
    return northing;
  }
  else {
    throw ("Invalid zone letter: " + zoneLetter);
  }

}


/***/ }),

/***/ "./node_modules/proj4/lib/Point.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/Point.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mgrs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mgrs */ "./node_modules/mgrs/mgrs.js");


function Point(x, y, z) {
  if (!(this instanceof Point)) {
    return new Point(x, y, z);
  }
  if (Array.isArray(x)) {
    this.x = x[0];
    this.y = x[1];
    this.z = x[2] || 0.0;
  } else if(typeof x === 'object') {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z || 0.0;
  } else if (typeof x === 'string' && typeof y === 'undefined') {
    var coords = x.split(',');
    this.x = parseFloat(coords[0], 10);
    this.y = parseFloat(coords[1], 10);
    this.z = parseFloat(coords[2], 10) || 0.0;
  } else {
    this.x = x;
    this.y = y;
    this.z = z || 0.0;
  }
  console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
}

Point.fromMGRS = function(mgrsStr) {
  return new Point(Object(mgrs__WEBPACK_IMPORTED_MODULE_0__["toPoint"])(mgrsStr));
};
Point.prototype.toMGRS = function(accuracy) {
  return Object(mgrs__WEBPACK_IMPORTED_MODULE_0__["forward"])([this.x, this.y], accuracy);
};
/* harmony default export */ __webpack_exports__["default"] = (Point);


/***/ }),

/***/ "./node_modules/proj4/lib/Proj.js":
/*!****************************************!*\
  !*** ./node_modules/proj4/lib/Proj.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parseCode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseCode */ "./node_modules/proj4/lib/parseCode.js");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extend */ "./node_modules/proj4/lib/extend.js");
/* harmony import */ var _projections__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projections */ "./node_modules/proj4/lib/projections.js");
/* harmony import */ var _deriveConstants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deriveConstants */ "./node_modules/proj4/lib/deriveConstants.js");
/* harmony import */ var _constants_Datum__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/Datum */ "./node_modules/proj4/lib/constants/Datum.js");
/* harmony import */ var _datum__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./datum */ "./node_modules/proj4/lib/datum.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");
/* harmony import */ var _nadgrid__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./nadgrid */ "./node_modules/proj4/lib/nadgrid.js");









function Projection(srsCode,callback) {
  if (!(this instanceof Projection)) {
    return new Projection(srsCode);
  }
  callback = callback || function(error){
    if(error){
      throw error;
    }
  };
  var json = Object(_parseCode__WEBPACK_IMPORTED_MODULE_0__["default"])(srsCode);
  if(typeof json !== 'object'){
    callback(srsCode);
    return;
  }
  var ourProj = Projection.projections.get(json.projName);
  if(!ourProj){
    callback(srsCode);
    return;
  }
  if (json.datumCode && json.datumCode !== 'none') {
    var datumDef = Object(_match__WEBPACK_IMPORTED_MODULE_6__["default"])(_constants_Datum__WEBPACK_IMPORTED_MODULE_4__["default"], json.datumCode);
    if (datumDef) {
      json.datum_params = json.datum_params || (datumDef.towgs84 ? datumDef.towgs84.split(',') : null);
      json.ellps = datumDef.ellipse;
      json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
    }
  }
  json.k0 = json.k0 || 1.0;
  json.axis = json.axis || 'enu';
  json.ellps = json.ellps || 'wgs84';
  json.lat1 = json.lat1 || json.lat0; // Lambert_Conformal_Conic_1SP, for example, needs this

  var sphere_ = Object(_deriveConstants__WEBPACK_IMPORTED_MODULE_3__["sphere"])(json.a, json.b, json.rf, json.ellps, json.sphere);
  var ecc = Object(_deriveConstants__WEBPACK_IMPORTED_MODULE_3__["eccentricity"])(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
  var nadgrids = Object(_nadgrid__WEBPACK_IMPORTED_MODULE_7__["getNadgrids"])(json.nadgrids);
  var datumObj = json.datum || Object(_datum__WEBPACK_IMPORTED_MODULE_5__["default"])(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2,
    nadgrids);

  Object(_extend__WEBPACK_IMPORTED_MODULE_1__["default"])(this, json); // transfer everything over from the projection because we don't know what we'll need
  Object(_extend__WEBPACK_IMPORTED_MODULE_1__["default"])(this, ourProj); // transfer all the methods from the projection

  // copy the 4 things over we calulated in deriveConstants.sphere
  this.a = sphere_.a;
  this.b = sphere_.b;
  this.rf = sphere_.rf;
  this.sphere = sphere_.sphere;

  // copy the 3 things we calculated in deriveConstants.eccentricity
  this.es = ecc.es;
  this.e = ecc.e;
  this.ep2 = ecc.ep2;

  // add in the datum object
  this.datum = datumObj;

  // init the projection
  this.init();

  // legecy callback from back in the day when it went to spatialreference.org
  callback(null, this);

}
Projection.projections = _projections__WEBPACK_IMPORTED_MODULE_2__["default"];
Projection.projections.start();
/* harmony default export */ __webpack_exports__["default"] = (Projection);


/***/ }),

/***/ "./node_modules/proj4/lib/adjust_axis.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/adjust_axis.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(crs, denorm, point) {
  var xin = point.x,
    yin = point.y,
    zin = point.z || 0.0;
  var v, t, i;
  var out = {};
  for (i = 0; i < 3; i++) {
    if (denorm && i === 2 && point.z === undefined) {
      continue;
    }
    if (i === 0) {
      v = xin;
      if ("ew".indexOf(crs.axis[i]) !== -1) {
        t = 'x';
      } else {
        t = 'y';
      }

    }
    else if (i === 1) {
      v = yin;
      if ("ns".indexOf(crs.axis[i]) !== -1) {
        t = 'y';
      } else {
        t = 'x';
      }
    }
    else {
      v = zin;
      t = 'z';
    }
    switch (crs.axis[i]) {
    case 'e':
      out[t] = v;
      break;
    case 'w':
      out[t] = -v;
      break;
    case 'n':
      out[t] = v;
      break;
    case 's':
      out[t] = -v;
      break;
    case 'u':
      if (point[t] !== undefined) {
        out.z = v;
      }
      break;
    case 'd':
      if (point[t] !== undefined) {
        out.z = -v;
      }
      break;
    default:
      //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
      return null;
    }
  }
  return out;
});


/***/ }),

/***/ "./node_modules/proj4/lib/checkSanity.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/checkSanity.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (point) {
  checkCoord(point.x);
  checkCoord(point.y);
});
function checkCoord(num) {
  if (typeof Number.isFinite === 'function') {
    if (Number.isFinite(num)) {
      return;
    }
    throw new TypeError('coordinates must be finite numbers');
  }
  if (typeof num !== 'number' || num !== num || !isFinite(num)) {
    throw new TypeError('coordinates must be finite numbers');
  }
}


/***/ }),

/***/ "./node_modules/proj4/lib/common/adjust_lat.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/common/adjust_lat.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _sign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sign */ "./node_modules/proj4/lib/common/sign.js");



/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return (Math.abs(x) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]) ? x : (x - (Object(_sign__WEBPACK_IMPORTED_MODULE_1__["default"])(x) * Math.PI));
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/adjust_lon.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/common/adjust_lon.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _sign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sign */ "./node_modules/proj4/lib/common/sign.js");




/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return (Math.abs(x) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]) ? x : (x - (Object(_sign__WEBPACK_IMPORTED_MODULE_1__["default"])(x) * _constants_values__WEBPACK_IMPORTED_MODULE_0__["TWO_PI"]));
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/adjust_zone.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/common/adjust_zone.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");


/* harmony default export */ __webpack_exports__["default"] = (function(zone, lon) {
  if (zone === undefined) {
    zone = Math.floor((Object(_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon) + Math.PI) * 30 / Math.PI) + 1;

    if (zone < 0) {
      return 0;
    } else if (zone > 60) {
      return 60;
    }
  }
  return zone;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/asinhy.js":
/*!*************************************************!*\
  !*** ./node_modules/proj4/lib/common/asinhy.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hypot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hypot */ "./node_modules/proj4/lib/common/hypot.js");
/* harmony import */ var _log1py__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log1py */ "./node_modules/proj4/lib/common/log1py.js");



/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  var y = Math.abs(x);
  y = Object(_log1py__WEBPACK_IMPORTED_MODULE_1__["default"])(y * (1 + y / (Object(_hypot__WEBPACK_IMPORTED_MODULE_0__["default"])(1, y) + 1)));

  return x < 0 ? -y : y;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/asinz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/asinz.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  if (Math.abs(x) > 1) {
    x = (x > 1) ? 1 : -1;
  }
  return Math.asin(x);
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/clens.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/clens.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(pp, arg_r) {
  var r = 2 * Math.cos(arg_r);
  var i = pp.length - 1;
  var hr1 = pp[i];
  var hr2 = 0;
  var hr;

  while (--i >= 0) {
    hr = -hr2 + r * hr1 + pp[i];
    hr2 = hr1;
    hr1 = hr;
  }

  return Math.sin(arg_r) * hr;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/clens_cmplx.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/common/clens_cmplx.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sinh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sinh */ "./node_modules/proj4/lib/common/sinh.js");
/* harmony import */ var _cosh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cosh */ "./node_modules/proj4/lib/common/cosh.js");



/* harmony default export */ __webpack_exports__["default"] = (function(pp, arg_r, arg_i) {
  var sin_arg_r = Math.sin(arg_r);
  var cos_arg_r = Math.cos(arg_r);
  var sinh_arg_i = Object(_sinh__WEBPACK_IMPORTED_MODULE_0__["default"])(arg_i);
  var cosh_arg_i = Object(_cosh__WEBPACK_IMPORTED_MODULE_1__["default"])(arg_i);
  var r = 2 * cos_arg_r * cosh_arg_i;
  var i = -2 * sin_arg_r * sinh_arg_i;
  var j = pp.length - 1;
  var hr = pp[j];
  var hi1 = 0;
  var hr1 = 0;
  var hi = 0;
  var hr2;
  var hi2;

  while (--j >= 0) {
    hr2 = hr1;
    hi2 = hi1;
    hr1 = hr;
    hi1 = hi;
    hr = -hr2 + r * hr1 - i * hi1 + pp[j];
    hi = -hi2 + i * hr1 + r * hi1;
  }

  r = sin_arg_r * cosh_arg_i;
  i = cos_arg_r * sinh_arg_i;

  return [r * hr - i * hi, r * hi + i * hr];
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/cosh.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/cosh.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  var r = Math.exp(x);
  r = (r + 1 / r) / 2;
  return r;
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/e0fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e0fn.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/e1fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e1fn.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/e2fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e2fn.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return (0.05859375 * x * x * (1 + 0.75 * x));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/e3fn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/e3fn.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return (x * x * x * (35 / 3072));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/gN.js":
/*!*********************************************!*\
  !*** ./node_modules/proj4/lib/common/gN.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(a, e, sinphi) {
  var temp = e * sinphi;
  return a / Math.sqrt(1 - temp * temp);
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/gatg.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/gatg.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(pp, B) {
  var cos_2B = 2 * Math.cos(2 * B);
  var i = pp.length - 1;
  var h1 = pp[i];
  var h2 = 0;
  var h;

  while (--i >= 0) {
    h = -h2 + cos_2B * h1 + pp[i];
    h2 = h1;
    h1 = h;
  }

  return (B + h * Math.sin(2 * B));
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/hypot.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/hypot.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  var a = Math.max(x, y);
  var b = Math.min(x, y) / (a ? a : 1);

  return a * Math.sqrt(1 + Math.pow(b, 2));
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/imlfn.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/imlfn.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(ml, e0, e1, e2, e3) {
  var phi;
  var dphi;

  phi = ml / e0;
  for (var i = 0; i < 15; i++) {
    dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }

  //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
  return NaN;
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/iqsfnz.js":
/*!*************************************************!*\
  !*** ./node_modules/proj4/lib/common/iqsfnz.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/* harmony default export */ __webpack_exports__["default"] = (function(eccent, q) {
  var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
  if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
    if (q < 0) {
      return (-1 * _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]);
    }
    else {
      return _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    }
  }
  //var phi = 0.5* q/(1-eccent*eccent);
  var phi = Math.asin(0.5 * q);
  var dphi;
  var sin_phi;
  var cos_phi;
  var con;
  for (var i = 0; i < 30; i++) {
    sin_phi = Math.sin(phi);
    cos_phi = Math.cos(phi);
    con = eccent * sin_phi;
    dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }

  //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
  return NaN;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/log1py.js":
/*!*************************************************!*\
  !*** ./node_modules/proj4/lib/common/log1py.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  var y = 1 + x;
  var z = y - 1;

  return z === 0 ? x : x * Math.log(y) / z;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/mlfn.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/mlfn.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(e0, e1, e2, e3, phi) {
  return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/msfnz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/msfnz.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(eccent, sinphi, cosphi) {
  var con = eccent * sinphi;
  return cosphi / (Math.sqrt(1 - con * con));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/phi2z.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/phi2z.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/* harmony default export */ __webpack_exports__["default"] = (function(eccent, ts) {
  var eccnth = 0.5 * eccent;
  var con, dphi;
  var phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - 2 * Math.atan(ts);
  for (var i = 0; i <= 15; i++) {
    con = eccent * Math.sin(phi);
    dphi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
    phi += dphi;
    if (Math.abs(dphi) <= 0.0000000001) {
      return phi;
    }
  }
  //console.log("phi2z has NoConvergence");
  return -9999;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/pj_enfn.js":
/*!**************************************************!*\
  !*** ./node_modules/proj4/lib/common/pj_enfn.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var C00 = 1;
var C02 = 0.25;
var C04 = 0.046875;
var C06 = 0.01953125;
var C08 = 0.01068115234375;
var C22 = 0.75;
var C44 = 0.46875;
var C46 = 0.01302083333333333333;
var C48 = 0.00712076822916666666;
var C66 = 0.36458333333333333333;
var C68 = 0.00569661458333333333;
var C88 = 0.3076171875;

/* harmony default export */ __webpack_exports__["default"] = (function(es) {
  var en = [];
  en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
  en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
  var t = es * es;
  en[2] = t * (C44 - es * (C46 + es * C48));
  t *= es;
  en[3] = t * (C66 - es * C68);
  en[4] = t * es * C88;
  return en;
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/pj_inv_mlfn.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/common/pj_inv_mlfn.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pj_mlfn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");



var MAX_ITER = 20;

/* harmony default export */ __webpack_exports__["default"] = (function(arg, es, en) {
  var k = 1 / (1 - es);
  var phi = arg;
  for (var i = MAX_ITER; i; --i) { /* rarely goes over 2 iterations */
    var s = Math.sin(phi);
    var t = 1 - es * s * s;
    //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
    //phi -= t * (t * Math.sqrt(t)) * k;
    t = (Object(_pj_mlfn__WEBPACK_IMPORTED_MODULE_0__["default"])(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
    phi -= t;
    if (Math.abs(t) < _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      return phi;
    }
  }
  //..reportError("cass:pj_inv_mlfn: Convergence error");
  return phi;
});


/***/ }),

/***/ "./node_modules/proj4/lib/common/pj_mlfn.js":
/*!**************************************************!*\
  !*** ./node_modules/proj4/lib/common/pj_mlfn.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(phi, sphi, cphi, en) {
  cphi *= sphi;
  sphi *= sphi;
  return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/qsfnz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/qsfnz.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(eccent, sinphi) {
  var con;
  if (eccent > 1.0e-7) {
    con = eccent * sinphi;
    return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
  }
  else {
    return (2 * sinphi);
  }
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/sign.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/sign.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  return x<0 ? -1 : 1;
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/sinh.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/sinh.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(x) {
  var r = Math.exp(x);
  r = (r - 1 / r) / 2;
  return r;
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/srat.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/common/srat.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(esinp, exp) {
  return (Math.pow((1 - esinp) / (1 + esinp), exp));
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/toPoint.js":
/*!**************************************************!*\
  !*** ./node_modules/proj4/lib/common/toPoint.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (array){
  var out = {
    x: array[0],
    y: array[1]
  };
  if (array.length>2) {
    out.z = array[2];
  }
  if (array.length>3) {
    out.m = array[3];
  }
  return out;
});

/***/ }),

/***/ "./node_modules/proj4/lib/common/tsfnz.js":
/*!************************************************!*\
  !*** ./node_modules/proj4/lib/common/tsfnz.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/* harmony default export */ __webpack_exports__["default"] = (function(eccent, phi, sinphi) {
  var con = eccent * sinphi;
  var com = 0.5 * eccent;
  con = Math.pow(((1 - con) / (1 + con)), com);
  return (Math.tan(0.5 * (_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - phi)) / con);
});


/***/ }),

/***/ "./node_modules/proj4/lib/constants/Datum.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/constants/Datum.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return exports; });
var exports = {};

exports.wgs84 = {
  towgs84: "0,0,0",
  ellipse: "WGS84",
  datumName: "WGS84"
};

exports.ch1903 = {
  towgs84: "674.374,15.056,405.346",
  ellipse: "bessel",
  datumName: "swiss"
};

exports.ggrs87 = {
  towgs84: "-199.87,74.79,246.62",
  ellipse: "GRS80",
  datumName: "Greek_Geodetic_Reference_System_1987"
};

exports.nad83 = {
  towgs84: "0,0,0",
  ellipse: "GRS80",
  datumName: "North_American_Datum_1983"
};

exports.nad27 = {
  nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
  ellipse: "clrk66",
  datumName: "North_American_Datum_1927"
};

exports.potsdam = {
  towgs84: "598.1,73.7,418.2,0.202,0.045,-2.455,6.7",
  ellipse: "bessel",
  datumName: "Potsdam Rauenberg 1950 DHDN"
};

exports.carthage = {
  towgs84: "-263.0,6.0,431.0",
  ellipse: "clark80",
  datumName: "Carthage 1934 Tunisia"
};

exports.hermannskogel = {
  towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
  ellipse: "bessel",
  datumName: "Hermannskogel"
};

exports.osni52 = {
  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
  ellipse: "airy",
  datumName: "Irish National"
};

exports.ire65 = {
  towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
  ellipse: "mod_airy",
  datumName: "Ireland 1965"
};

exports.rassadiran = {
  towgs84: "-133.63,-157.5,-158.62",
  ellipse: "intl",
  datumName: "Rassadiran"
};

exports.nzgd49 = {
  towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
  ellipse: "intl",
  datumName: "New Zealand Geodetic Datum 1949"
};

exports.osgb36 = {
  towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
  ellipse: "airy",
  datumName: "Airy 1830"
};

exports.s_jtsk = {
  towgs84: "589,76,480",
  ellipse: 'bessel',
  datumName: 'S-JTSK (Ferro)'
};

exports.beduaram = {
  towgs84: '-106,-87,188',
  ellipse: 'clrk80',
  datumName: 'Beduaram'
};

exports.gunung_segara = {
  towgs84: '-403,684,41',
  ellipse: 'bessel',
  datumName: 'Gunung Segara Jakarta'
};

exports.rnb72 = {
  towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
  ellipse: "intl",
  datumName: "Reseau National Belge 1972"
};


/***/ }),

/***/ "./node_modules/proj4/lib/constants/Ellipsoid.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/constants/Ellipsoid.js ***!
  \*******************************************************/
/*! exports provided: default, WGS84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return exports; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WGS84", function() { return WGS84; });
var exports = {};

exports.MERIT = {
  a: 6378137.0,
  rf: 298.257,
  ellipseName: "MERIT 1983"
};

exports.SGS85 = {
  a: 6378136.0,
  rf: 298.257,
  ellipseName: "Soviet Geodetic System 85"
};

exports.GRS80 = {
  a: 6378137.0,
  rf: 298.257222101,
  ellipseName: "GRS 1980(IUGG, 1980)"
};

exports.IAU76 = {
  a: 6378140.0,
  rf: 298.257,
  ellipseName: "IAU 1976"
};

exports.airy = {
  a: 6377563.396,
  b: 6356256.910,
  ellipseName: "Airy 1830"
};

exports.APL4 = {
  a: 6378137,
  rf: 298.25,
  ellipseName: "Appl. Physics. 1965"
};

exports.NWL9D = {
  a: 6378145.0,
  rf: 298.25,
  ellipseName: "Naval Weapons Lab., 1965"
};

exports.mod_airy = {
  a: 6377340.189,
  b: 6356034.446,
  ellipseName: "Modified Airy"
};

exports.andrae = {
  a: 6377104.43,
  rf: 300.0,
  ellipseName: "Andrae 1876 (Den., Iclnd.)"
};

exports.aust_SA = {
  a: 6378160.0,
  rf: 298.25,
  ellipseName: "Australian Natl & S. Amer. 1969"
};

exports.GRS67 = {
  a: 6378160.0,
  rf: 298.2471674270,
  ellipseName: "GRS 67(IUGG 1967)"
};

exports.bessel = {
  a: 6377397.155,
  rf: 299.1528128,
  ellipseName: "Bessel 1841"
};

exports.bess_nam = {
  a: 6377483.865,
  rf: 299.1528128,
  ellipseName: "Bessel 1841 (Namibia)"
};

exports.clrk66 = {
  a: 6378206.4,
  b: 6356583.8,
  ellipseName: "Clarke 1866"
};

exports.clrk80 = {
  a: 6378249.145,
  rf: 293.4663,
  ellipseName: "Clarke 1880 mod."
};

exports.clrk58 = {
  a: 6378293.645208759,
  rf: 294.2606763692654,
  ellipseName: "Clarke 1858"
};

exports.CPM = {
  a: 6375738.7,
  rf: 334.29,
  ellipseName: "Comm. des Poids et Mesures 1799"
};

exports.delmbr = {
  a: 6376428.0,
  rf: 311.5,
  ellipseName: "Delambre 1810 (Belgium)"
};

exports.engelis = {
  a: 6378136.05,
  rf: 298.2566,
  ellipseName: "Engelis 1985"
};

exports.evrst30 = {
  a: 6377276.345,
  rf: 300.8017,
  ellipseName: "Everest 1830"
};

exports.evrst48 = {
  a: 6377304.063,
  rf: 300.8017,
  ellipseName: "Everest 1948"
};

exports.evrst56 = {
  a: 6377301.243,
  rf: 300.8017,
  ellipseName: "Everest 1956"
};

exports.evrst69 = {
  a: 6377295.664,
  rf: 300.8017,
  ellipseName: "Everest 1969"
};

exports.evrstSS = {
  a: 6377298.556,
  rf: 300.8017,
  ellipseName: "Everest (Sabah & Sarawak)"
};

exports.fschr60 = {
  a: 6378166.0,
  rf: 298.3,
  ellipseName: "Fischer (Mercury Datum) 1960"
};

exports.fschr60m = {
  a: 6378155.0,
  rf: 298.3,
  ellipseName: "Fischer 1960"
};

exports.fschr68 = {
  a: 6378150.0,
  rf: 298.3,
  ellipseName: "Fischer 1968"
};

exports.helmert = {
  a: 6378200.0,
  rf: 298.3,
  ellipseName: "Helmert 1906"
};

exports.hough = {
  a: 6378270.0,
  rf: 297.0,
  ellipseName: "Hough"
};

exports.intl = {
  a: 6378388.0,
  rf: 297.0,
  ellipseName: "International 1909 (Hayford)"
};

exports.kaula = {
  a: 6378163.0,
  rf: 298.24,
  ellipseName: "Kaula 1961"
};

exports.lerch = {
  a: 6378139.0,
  rf: 298.257,
  ellipseName: "Lerch 1979"
};

exports.mprts = {
  a: 6397300.0,
  rf: 191.0,
  ellipseName: "Maupertius 1738"
};

exports.new_intl = {
  a: 6378157.5,
  b: 6356772.2,
  ellipseName: "New International 1967"
};

exports.plessis = {
  a: 6376523.0,
  rf: 6355863.0,
  ellipseName: "Plessis 1817 (France)"
};

exports.krass = {
  a: 6378245.0,
  rf: 298.3,
  ellipseName: "Krassovsky, 1942"
};

exports.SEasia = {
  a: 6378155.0,
  b: 6356773.3205,
  ellipseName: "Southeast Asia"
};

exports.walbeck = {
  a: 6376896.0,
  b: 6355834.8467,
  ellipseName: "Walbeck"
};

exports.WGS60 = {
  a: 6378165.0,
  rf: 298.3,
  ellipseName: "WGS 60"
};

exports.WGS66 = {
  a: 6378145.0,
  rf: 298.25,
  ellipseName: "WGS 66"
};

exports.WGS7 = {
  a: 6378135.0,
  rf: 298.26,
  ellipseName: "WGS 72"
};

var WGS84 = exports.WGS84 = {
  a: 6378137.0,
  rf: 298.257223563,
  ellipseName: "WGS 84"
};

exports.sphere = {
  a: 6370997.0,
  b: 6370997.0,
  ellipseName: "Normal Sphere (r=6370997)"
};


/***/ }),

/***/ "./node_modules/proj4/lib/constants/PrimeMeridian.js":
/*!***********************************************************!*\
  !*** ./node_modules/proj4/lib/constants/PrimeMeridian.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return exports; });
var exports = {};


exports.greenwich = 0.0; //"0dE",
exports.lisbon = -9.131906111111; //"9d07'54.862\"W",
exports.paris = 2.337229166667; //"2d20'14.025\"E",
exports.bogota = -74.080916666667; //"74d04'51.3\"W",
exports.madrid = -3.687938888889; //"3d41'16.58\"W",
exports.rome = 12.452333333333; //"12d27'8.4\"E",
exports.bern = 7.439583333333; //"7d26'22.5\"E",
exports.jakarta = 106.807719444444; //"106d48'27.79\"E",
exports.ferro = -17.666666666667; //"17d40'W",
exports.brussels = 4.367975; //"4d22'4.71\"E",
exports.stockholm = 18.058277777778; //"18d3'29.8\"E",
exports.athens = 23.7163375; //"23d42'58.815\"E",
exports.oslo = 10.722916666667; //"10d43'22.5\"E"


/***/ }),

/***/ "./node_modules/proj4/lib/constants/units.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/constants/units.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  ft: {to_meter: 0.3048},
  'us-ft': {to_meter: 1200 / 3937}
});


/***/ }),

/***/ "./node_modules/proj4/lib/constants/values.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/constants/values.js ***!
  \****************************************************/
/*! exports provided: PJD_3PARAM, PJD_7PARAM, PJD_GRIDSHIFT, PJD_WGS84, PJD_NODATUM, SRS_WGS84_SEMIMAJOR, SRS_WGS84_SEMIMINOR, SRS_WGS84_ESQUARED, SEC_TO_RAD, HALF_PI, SIXTH, RA4, RA6, EPSLN, D2R, R2D, FORTPI, TWO_PI, SPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PJD_3PARAM", function() { return PJD_3PARAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PJD_7PARAM", function() { return PJD_7PARAM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PJD_GRIDSHIFT", function() { return PJD_GRIDSHIFT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PJD_WGS84", function() { return PJD_WGS84; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PJD_NODATUM", function() { return PJD_NODATUM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SRS_WGS84_SEMIMAJOR", function() { return SRS_WGS84_SEMIMAJOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SRS_WGS84_SEMIMINOR", function() { return SRS_WGS84_SEMIMINOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SRS_WGS84_ESQUARED", function() { return SRS_WGS84_ESQUARED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SEC_TO_RAD", function() { return SEC_TO_RAD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HALF_PI", function() { return HALF_PI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SIXTH", function() { return SIXTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RA4", function() { return RA4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RA6", function() { return RA6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EPSLN", function() { return EPSLN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D2R", function() { return D2R; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "R2D", function() { return R2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FORTPI", function() { return FORTPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TWO_PI", function() { return TWO_PI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPI", function() { return SPI; });
var PJD_3PARAM = 1;
var PJD_7PARAM = 2;
var PJD_GRIDSHIFT = 3;
var PJD_WGS84 = 4; // WGS84 or equivalent
var PJD_NODATUM = 5; // WGS84 or equivalent
var SRS_WGS84_SEMIMAJOR = 6378137.0;  // only used in grid shift transforms
var SRS_WGS84_SEMIMINOR = 6356752.314;  // only used in grid shift transforms
var SRS_WGS84_ESQUARED = 0.0066943799901413165; // only used in grid shift transforms
var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
var HALF_PI = Math.PI/2;
// ellipoid pj_set_ell.c
var SIXTH = 0.1666666666666666667;
/* 1/6 */
var RA4 = 0.04722222222222222222;
/* 17/360 */
var RA6 = 0.02215608465608465608;
var EPSLN = 1.0e-10;
// you'd think you could use Number.EPSILON above but that makes
// Mollweide get into an infinate loop.

var D2R = 0.01745329251994329577;
var R2D = 57.29577951308232088;
var FORTPI = Math.PI/4;
var TWO_PI = Math.PI * 2;
// SPI is slightly greater than Math.PI, so values that exceed the -180..180
// degree range by a tiny amount don't get wrapped. This prevents points that
// have drifted from their original location along the 180th meridian (due to
// floating point error) from changing their sign.
var SPI = 3.14159265359;


/***/ }),

/***/ "./node_modules/proj4/lib/core.js":
/*!****************************************!*\
  !*** ./node_modules/proj4/lib/core.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transform */ "./node_modules/proj4/lib/transform.js");


var wgs84 = Object(_Proj__WEBPACK_IMPORTED_MODULE_0__["default"])('WGS84');

function transformer(from, to, coords, enforceAxis) {
  var transformedArray, out, keys;
  if (Array.isArray(coords)) {
    transformedArray = Object(_transform__WEBPACK_IMPORTED_MODULE_1__["default"])(from, to, coords, enforceAxis) || {x: NaN, y: NaN};
    if (coords.length > 2) {
      if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
        if (typeof transformedArray.z === 'number') {
          return [transformedArray.x, transformedArray.y, transformedArray.z].concat(coords.splice(3));
        } else {
          return [transformedArray.x, transformedArray.y, coords[2]].concat(coords.splice(3));
        }
      } else {
        return [transformedArray.x, transformedArray.y].concat(coords.splice(2));
      }
    } else {
      return [transformedArray.x, transformedArray.y];
    }
  } else {
    out = Object(_transform__WEBPACK_IMPORTED_MODULE_1__["default"])(from, to, coords, enforceAxis);
    keys = Object.keys(coords);
    if (keys.length === 2) {
      return out;
    }
    keys.forEach(function (key) {
      if ((typeof from.name !== 'undefined' && from.name === 'geocent') || (typeof to.name !== 'undefined' && to.name === 'geocent')) {
        if (key === 'x' || key === 'y' || key === 'z') {
          return;
        }
      } else {
        if (key === 'x' || key === 'y') {
          return;
        }
      }
      out[key] = coords[key];
    });
    return out;
  }
}

function checkProj(item) {
  if (item instanceof _Proj__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    return item;
  }
  if (item.oProj) {
    return item.oProj;
  }
  return Object(_Proj__WEBPACK_IMPORTED_MODULE_0__["default"])(item);
}

function proj4(fromProj, toProj, coord) {
  fromProj = checkProj(fromProj);
  var single = false;
  var obj;
  if (typeof toProj === 'undefined') {
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  } else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
    coord = toProj;
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  }
  toProj = checkProj(toProj);
  if (coord) {
    return transformer(fromProj, toProj, coord);
  } else {
    obj = {
      forward: function (coords, enforceAxis) {
        return transformer(fromProj, toProj, coords, enforceAxis);
      },
      inverse: function (coords, enforceAxis) {
        return transformer(toProj, fromProj, coords, enforceAxis);
      }
    };
    if (single) {
      obj.oProj = toProj;
    }
    return obj;
  }
}
/* harmony default export */ __webpack_exports__["default"] = (proj4);

/***/ }),

/***/ "./node_modules/proj4/lib/datum.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/datum.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");


function datum(datumCode, datum_params, a, b, es, ep2, nadgrids) {
  var out = {};

  if (datumCode === undefined || datumCode === 'none') {
    out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_NODATUM"];
  } else {
    out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_WGS84"];
  }

  if (datum_params) {
    out.datum_params = datum_params.map(parseFloat);
    if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
      out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"];
    }
    if (out.datum_params.length > 3) {
      if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
        out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"];
        out.datum_params[3] *= _constants_values__WEBPACK_IMPORTED_MODULE_0__["SEC_TO_RAD"];
        out.datum_params[4] *= _constants_values__WEBPACK_IMPORTED_MODULE_0__["SEC_TO_RAD"];
        out.datum_params[5] *= _constants_values__WEBPACK_IMPORTED_MODULE_0__["SEC_TO_RAD"];
        out.datum_params[6] = (out.datum_params[6] / 1000000.0) + 1.0;
      }
    }
  }

  if (nadgrids) {
    out.datum_type = _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_GRIDSHIFT"];
    out.grids = nadgrids;
  }
  out.a = a; //datum object also uses these values
  out.b = b;
  out.es = es;
  out.ep2 = ep2;
  return out;
}

/* harmony default export */ __webpack_exports__["default"] = (datum);


/***/ }),

/***/ "./node_modules/proj4/lib/datumUtils.js":
/*!**********************************************!*\
  !*** ./node_modules/proj4/lib/datumUtils.js ***!
  \**********************************************/
/*! exports provided: compareDatums, geodeticToGeocentric, geocentricToGeodetic, geocentricToWgs84, geocentricFromWgs84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compareDatums", function() { return compareDatums; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geodeticToGeocentric", function() { return geodeticToGeocentric; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geocentricToGeodetic", function() { return geocentricToGeodetic; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geocentricToWgs84", function() { return geocentricToWgs84; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geocentricFromWgs84", function() { return geocentricFromWgs84; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");


function compareDatums(source, dest) {
  if (source.datum_type !== dest.datum_type) {
    return false; // false, datums are not equal
  } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
    // the tolerance for es is to ensure that GRS80 and WGS84
    // are considered identical
    return false;
  } else if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"]) {
    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2]);
  } else if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"]) {
    return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6]);
  } else {
    return true; // datums are equal
  }
} // cs_compare_datums()

/*
 * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
 * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
 * according to the current ellipsoid parameters.
 *
 *    Latitude  : Geodetic latitude in radians                     (input)
 *    Longitude : Geodetic longitude in radians                    (input)
 *    Height    : Geodetic height, in meters                       (input)
 *    X         : Calculated Geocentric X coordinate, in meters    (output)
 *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
 *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
 *
 */
function geodeticToGeocentric(p, es, a) {
  var Longitude = p.x;
  var Latitude = p.y;
  var Height = p.z ? p.z : 0; //Z value not always supplied

  var Rn; /*  Earth radius at location  */
  var Sin_Lat; /*  Math.sin(Latitude)  */
  var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
  var Cos_Lat; /*  Math.cos(Latitude)  */

  /*
   ** Don't blow up if Latitude is just a little out of the value
   ** range as it may just be a rounding issue.  Also removed longitude
   ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
   */
  if (Latitude < -_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] && Latitude > -1.001 * _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]) {
    Latitude = -_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
  } else if (Latitude > _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] && Latitude < 1.001 * _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]) {
    Latitude = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
  } else if (Latitude < -_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]) {
    /* Latitude out of range */
    //..reportError('geocent:lat out of range:' + Latitude);
    return { x: -Infinity, y: -Infinity, z: p.z };
  } else if (Latitude > _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]) {
    /* Latitude out of range */
    return { x: Infinity, y: Infinity, z: p.z };
  }

  if (Longitude > Math.PI) {
    Longitude -= (2 * Math.PI);
  }
  Sin_Lat = Math.sin(Latitude);
  Cos_Lat = Math.cos(Latitude);
  Sin2_Lat = Sin_Lat * Sin_Lat;
  Rn = a / (Math.sqrt(1.0e0 - es * Sin2_Lat));
  return {
    x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
    y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
    z: ((Rn * (1 - es)) + Height) * Sin_Lat
  };
} // cs_geodetic_to_geocentric()

function geocentricToGeodetic(p, es, a, b) {
  /* local defintions and variables */
  /* end-criterium of loop, accuracy of sin(Latitude) */
  var genau = 1e-12;
  var genau2 = (genau * genau);
  var maxiter = 30;

  var P; /* distance between semi-minor axis and location */
  var RR; /* distance between center and location */
  var CT; /* sin of geocentric latitude */
  var ST; /* cos of geocentric latitude */
  var RX;
  var RK;
  var RN; /* Earth radius at location */
  var CPHI0; /* cos of start or old geodetic latitude in iterations */
  var SPHI0; /* sin of start or old geodetic latitude in iterations */
  var CPHI; /* cos of searched geodetic latitude */
  var SPHI; /* sin of searched geodetic latitude */
  var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
  var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

  var X = p.x;
  var Y = p.y;
  var Z = p.z ? p.z : 0.0; //Z value not always supplied
  var Longitude;
  var Latitude;
  var Height;

  P = Math.sqrt(X * X + Y * Y);
  RR = Math.sqrt(X * X + Y * Y + Z * Z);

  /*      special cases for latitude and longitude */
  if (P / a < genau) {

    /*  special case, if P=0. (X=0., Y=0.) */
    Longitude = 0.0;

    /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
     *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
    if (RR / a < genau) {
      Latitude = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
      Height = -b;
      return {
        x: p.x,
        y: p.y,
        z: p.z
      };
    }
  } else {
    /*  ellipsoidal (geodetic) longitude
     *  interval: -PI < Longitude <= +PI */
    Longitude = Math.atan2(Y, X);
  }

  /* --------------------------------------------------------------
   * Following iterative algorithm was developped by
   * "Institut for Erdmessung", University of Hannover, July 1988.
   * Internet: www.ife.uni-hannover.de
   * Iterative computation of CPHI,SPHI and Height.
   * Iteration of CPHI and SPHI to 10**-12 radian resp.
   * 2*10**-7 arcsec.
   * --------------------------------------------------------------
   */
  CT = Z / RR;
  ST = P / RR;
  RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
  CPHI0 = ST * (1.0 - es) * RX;
  SPHI0 = CT * RX;
  iter = 0;

  /* loop to find sin(Latitude) resp. Latitude
   * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
  do {
    iter++;
    RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);

    /*  ellipsoidal (geodetic) height */
    Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);

    RK = es * RN / (RN + Height);
    RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
    CPHI = ST * (1.0 - RK) * RX;
    SPHI = CT * RX;
    SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
    CPHI0 = CPHI;
    SPHI0 = SPHI;
  }
  while (SDPHI * SDPHI > genau2 && iter < maxiter);

  /*      ellipsoidal (geodetic) latitude */
  Latitude = Math.atan(SPHI / Math.abs(CPHI));
  return {
    x: Longitude,
    y: Latitude,
    z: Height
  };
} // cs_geocentric_to_geodetic()

/****************************************************************/
// pj_geocentic_to_wgs84( p )
//  p = point to transform in geocentric coordinates (x,y,z)


/** point object, nothing fancy, just allows values to be
    passed back and forth by reference rather than by value.
    Other point classes may be used as long as they have
    x and y properties, which will get modified in the transform method.
*/
function geocentricToWgs84(p, datum_type, datum_params) {

  if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"]) {
    // if( x[io] === HUGE_VAL )
    //    continue;
    return {
      x: p.x + datum_params[0],
      y: p.y + datum_params[1],
      z: p.z + datum_params[2],
    };
  } else if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"]) {
    var Dx_BF = datum_params[0];
    var Dy_BF = datum_params[1];
    var Dz_BF = datum_params[2];
    var Rx_BF = datum_params[3];
    var Ry_BF = datum_params[4];
    var Rz_BF = datum_params[5];
    var M_BF = datum_params[6];
    // if( x[io] === HUGE_VAL )
    //    continue;
    return {
      x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
      y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
      z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
    };
  }
} // cs_geocentric_to_wgs84

/****************************************************************/
// pj_geocentic_from_wgs84()
//  coordinate system definition,
//  point to transform in geocentric coordinates (x,y,z)
function geocentricFromWgs84(p, datum_type, datum_params) {

  if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"]) {
    //if( x[io] === HUGE_VAL )
    //    continue;
    return {
      x: p.x - datum_params[0],
      y: p.y - datum_params[1],
      z: p.z - datum_params[2],
    };

  } else if (datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"]) {
    var Dx_BF = datum_params[0];
    var Dy_BF = datum_params[1];
    var Dz_BF = datum_params[2];
    var Rx_BF = datum_params[3];
    var Ry_BF = datum_params[4];
    var Rz_BF = datum_params[5];
    var M_BF = datum_params[6];
    var x_tmp = (p.x - Dx_BF) / M_BF;
    var y_tmp = (p.y - Dy_BF) / M_BF;
    var z_tmp = (p.z - Dz_BF) / M_BF;
    //if( x[io] === HUGE_VAL )
    //    continue;

    return {
      x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
      y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
      z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
    };
  } //cs_geocentric_from_wgs84()
}


/***/ }),

/***/ "./node_modules/proj4/lib/datum_transform.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/datum_transform.js ***!
  \***************************************************/
/*! exports provided: default, applyGridShift */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyGridShift", function() { return applyGridShift; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _datumUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./datumUtils */ "./node_modules/proj4/lib/datumUtils.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");




function checkParams(type) {
  return (type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"] || type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"]);
}

/* harmony default export */ __webpack_exports__["default"] = (function(source, dest, point) {
  // Short cut if the datums are identical.
  if (Object(_datumUtils__WEBPACK_IMPORTED_MODULE_1__["compareDatums"])(source, dest)) {
    return point; // in this case, zero is sucess,
    // whereas cs_compare_datums returns 1 to indicate TRUE
    // confusing, should fix this
  }

  // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
  if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_NODATUM"] || dest.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_NODATUM"]) {
    return point;
  }

  // If this datum requires grid shifts, then apply it to geodetic coordinates.
  var source_a = source.a;
  var source_es = source.es;
  if (source.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_GRIDSHIFT"]) {
    var gridShiftCode = applyGridShift(source, false, point);
    if (gridShiftCode !== 0) {
      return undefined;
    }
    source_a = _constants_values__WEBPACK_IMPORTED_MODULE_0__["SRS_WGS84_SEMIMAJOR"];
    source_es = _constants_values__WEBPACK_IMPORTED_MODULE_0__["SRS_WGS84_ESQUARED"];
  }

  var dest_a = dest.a;
  var dest_b = dest.b;
  var dest_es = dest.es;
  if (dest.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_GRIDSHIFT"]) {
    dest_a = _constants_values__WEBPACK_IMPORTED_MODULE_0__["SRS_WGS84_SEMIMAJOR"];
    dest_b = _constants_values__WEBPACK_IMPORTED_MODULE_0__["SRS_WGS84_SEMIMINOR"];
    dest_es = _constants_values__WEBPACK_IMPORTED_MODULE_0__["SRS_WGS84_ESQUARED"];
  }

  // Do we need to go through geocentric coordinates?
  if (source_es === dest_es && source_a === dest_a && !checkParams(source.datum_type) &&  !checkParams(dest.datum_type)) {
    return point;
  }

  // Convert to geocentric coordinates.
  point = Object(_datumUtils__WEBPACK_IMPORTED_MODULE_1__["geodeticToGeocentric"])(point, source_es, source_a);
  // Convert between datums
  if (checkParams(source.datum_type)) {
    point = Object(_datumUtils__WEBPACK_IMPORTED_MODULE_1__["geocentricToWgs84"])(point, source.datum_type, source.datum_params);
  }
  if (checkParams(dest.datum_type)) {
    point = Object(_datumUtils__WEBPACK_IMPORTED_MODULE_1__["geocentricFromWgs84"])(point, dest.datum_type, dest.datum_params);
  }
  point = Object(_datumUtils__WEBPACK_IMPORTED_MODULE_1__["geocentricToGeodetic"])(point, dest_es, dest_a, dest_b);

  if (dest.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_GRIDSHIFT"]) {
    var destGridShiftResult = applyGridShift(dest, true, point);
    if (destGridShiftResult !== 0) {
      return undefined;
    }
  }

  return point;
});

function applyGridShift(source, inverse, point) {
  if (source.grids === null || source.grids.length === 0) {
    console.log('Grid shift grids not found');
    return -1;
  }
  var input = {x: -point.x, y: point.y};
  var output = {x: Number.NaN, y: Number.NaN};
  var onlyMandatoryGrids = false;
  var attemptedGrids = [];
  for (var i = 0; i < source.grids.length; i++) {
    var grid = source.grids[i];
    attemptedGrids.push(grid.name);
    if (grid.isNull) {
      output = input;
      break;
    }
    onlyMandatoryGrids = grid.mandatory;
    if (grid.grid === null) {
      if (grid.mandatory) {
        console.log("Unable to find mandatory grid '" + grid.name + "'");
        return -1;
      }
      continue;
    }
    var subgrid = grid.grid.subgrids[0];
    // skip tables that don't match our point at all
    var epsilon = (Math.abs(subgrid.del[1]) + Math.abs(subgrid.del[0])) / 10000.0;
    var minX = subgrid.ll[0] - epsilon;
    var minY = subgrid.ll[1] - epsilon;
    var maxX = subgrid.ll[0] + (subgrid.lim[0] - 1) * subgrid.del[0] + epsilon;
    var maxY = subgrid.ll[1] + (subgrid.lim[1] - 1) * subgrid.del[1] + epsilon;
    if (minY > input.y || minX > input.x || maxY < input.y || maxX < input.x ) {
      continue;
    }
    output = applySubgridShift(input, inverse, subgrid);
    if (!isNaN(output.x)) {
      break;
    }
  }
  if (isNaN(output.x)) {
    console.log("Failed to find a grid shift table for location '"+
      -input.x * _constants_values__WEBPACK_IMPORTED_MODULE_0__["R2D"] + " " + input.y * _constants_values__WEBPACK_IMPORTED_MODULE_0__["R2D"] + " tried: '" + attemptedGrids + "'");
    return -1;
  }
  point.x = -output.x;
  point.y = output.y;
  return 0;
}

function applySubgridShift(pin, inverse, ct) {
  var val = {x: Number.NaN, y: Number.NaN};
  if (isNaN(pin.x)) { return val; }
  var tb = {x: pin.x, y: pin.y};
  tb.x -= ct.ll[0];
  tb.y -= ct.ll[1];
  tb.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(tb.x - Math.PI) + Math.PI;
  var t = nadInterpolate(tb, ct);
  if (inverse) {
    if (isNaN(t.x)) {
      return val;
    }
    t.x = tb.x - t.x;
    t.y = tb.y - t.y;
    var i = 9, tol = 1e-12;
    var dif, del;
    do {
      del = nadInterpolate(t, ct);
      if (isNaN(del.x)) {
        console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
        break;
      }
      dif = {x: tb.x - (del.x + t.x), y: tb.y - (del.y + t.y)};
      t.x += dif.x;
      t.y += dif.y;
    } while (i-- && Math.abs(dif.x) > tol && Math.abs(dif.y) > tol);
    if (i < 0) {
      console.log("Inverse grid shift iterator failed to converge.");
      return val;
    }
    val.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(t.x + ct.ll[0]);
    val.y = t.y + ct.ll[1];
  } else {
    if (!isNaN(t.x)) {
      val.x = pin.x + t.x;
      val.y = pin.y + t.y;
    }
  }
  return val;
}

function nadInterpolate(pin, ct) {
  var t = {x: pin.x / ct.del[0], y: pin.y / ct.del[1]};
  var indx = {x: Math.floor(t.x), y: Math.floor(t.y)};
  var frct = {x: t.x - 1.0 * indx.x, y: t.y - 1.0 * indx.y};
  var val= {x: Number.NaN, y: Number.NaN};
  var inx;
  if (indx.x < 0 || indx.x >= ct.lim[0]) {
    return val;
  }
  if (indx.y < 0 || indx.y >= ct.lim[1]) {
    return val;
  }
  inx = (indx.y * ct.lim[0]) + indx.x;
  var f00 = {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
  inx++;
  var f10= {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
  inx += ct.lim[0];
  var f11 = {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
  inx--;
  var f01 = {x: ct.cvs[inx][0], y: ct.cvs[inx][1]};
  var m11 = frct.x * frct.y, m10 = frct.x * (1.0 - frct.y),
    m00 = (1.0 - frct.x) * (1.0 - frct.y), m01 = (1.0 - frct.x) * frct.y;
  val.x = (m00 * f00.x + m10 * f10.x + m01 * f01.x + m11 * f11.x);
  val.y = (m00 * f00.y + m10 * f10.y + m01 * f01.y + m11 * f11.y);
  return val;
}


/***/ }),

/***/ "./node_modules/proj4/lib/defs.js":
/*!****************************************!*\
  !*** ./node_modules/proj4/lib/defs.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./node_modules/proj4/lib/global.js");
/* harmony import */ var _projString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projString */ "./node_modules/proj4/lib/projString.js");
/* harmony import */ var wkt_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wkt-parser */ "./node_modules/wkt-parser/index.js");




function defs(name) {
  /*global console*/
  var that = this;
  if (arguments.length === 2) {
    var def = arguments[1];
    if (typeof def === 'string') {
      if (def.charAt(0) === '+') {
        defs[name] = Object(_projString__WEBPACK_IMPORTED_MODULE_1__["default"])(arguments[1]);
      }
      else {
        defs[name] = Object(wkt_parser__WEBPACK_IMPORTED_MODULE_2__["default"])(arguments[1]);
      }
    } else {
      defs[name] = def;
    }
  }
  else if (arguments.length === 1) {
    if (Array.isArray(name)) {
      return name.map(function(v) {
        if (Array.isArray(v)) {
          defs.apply(that, v);
        }
        else {
          defs(v);
        }
      });
    }
    else if (typeof name === 'string') {
      if (name in defs) {
        return defs[name];
      }
    }
    else if ('EPSG' in name) {
      defs['EPSG:' + name.EPSG] = name;
    }
    else if ('ESRI' in name) {
      defs['ESRI:' + name.ESRI] = name;
    }
    else if ('IAU2000' in name) {
      defs['IAU2000:' + name.IAU2000] = name;
    }
    else {
      console.log(name);
    }
    return;
  }


}
Object(_global__WEBPACK_IMPORTED_MODULE_0__["default"])(defs);
/* harmony default export */ __webpack_exports__["default"] = (defs);


/***/ }),

/***/ "./node_modules/proj4/lib/deriveConstants.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/deriveConstants.js ***!
  \***************************************************/
/*! exports provided: eccentricity, sphere */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eccentricity", function() { return eccentricity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sphere", function() { return sphere; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _constants_Ellipsoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/Ellipsoid */ "./node_modules/proj4/lib/constants/Ellipsoid.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");




function eccentricity(a, b, rf, R_A) {
  var a2 = a * a; // used in geocentric
  var b2 = b * b; // used in geocentric
  var es = (a2 - b2) / a2; // e ^ 2
  var e = 0;
  if (R_A) {
    a *= 1 - es * (_constants_values__WEBPACK_IMPORTED_MODULE_0__["SIXTH"] + es * (_constants_values__WEBPACK_IMPORTED_MODULE_0__["RA4"] + es * _constants_values__WEBPACK_IMPORTED_MODULE_0__["RA6"]));
    a2 = a * a;
    es = 0;
  } else {
    e = Math.sqrt(es); // eccentricity
  }
  var ep2 = (a2 - b2) / b2; // used in geocentric
  return {
    es: es,
    e: e,
    ep2: ep2
  };
}
function sphere(a, b, rf, ellps, sphere) {
  if (!a) { // do we have an ellipsoid?
    var ellipse = Object(_match__WEBPACK_IMPORTED_MODULE_2__["default"])(_constants_Ellipsoid__WEBPACK_IMPORTED_MODULE_1__["default"], ellps);
    if (!ellipse) {
      ellipse = _constants_Ellipsoid__WEBPACK_IMPORTED_MODULE_1__["WGS84"];
    }
    a = ellipse.a;
    b = ellipse.b;
    rf = ellipse.rf;
  }

  if (rf && !b) {
    b = (1.0 - 1.0 / rf) * a;
  }
  if (rf === 0 || Math.abs(a - b) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    sphere = true;
    b = a;
  }
  return {
    a: a,
    b: b,
    rf: rf,
    sphere: sphere
  };
}


/***/ }),

/***/ "./node_modules/proj4/lib/extend.js":
/*!******************************************!*\
  !*** ./node_modules/proj4/lib/extend.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(destination, source) {
  destination = destination || {};
  var value, property;
  if (!source) {
    return destination;
  }
  for (property in source) {
    value = source[property];
    if (value !== undefined) {
      destination[property] = value;
    }
  }
  return destination;
});


/***/ }),

/***/ "./node_modules/proj4/lib/global.js":
/*!******************************************!*\
  !*** ./node_modules/proj4/lib/global.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(defs) {
  defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
  defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
  defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");

  defs.WGS84 = defs['EPSG:4326'];
  defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
  defs.GOOGLE = defs['EPSG:3857'];
  defs['EPSG:900913'] = defs['EPSG:3857'];
  defs['EPSG:102113'] = defs['EPSG:3857'];
});


/***/ }),

/***/ "./node_modules/proj4/lib/index.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/index.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./node_modules/proj4/lib/core.js");
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Point */ "./node_modules/proj4/lib/Point.js");
/* harmony import */ var _common_toPoint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/toPoint */ "./node_modules/proj4/lib/common/toPoint.js");
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defs */ "./node_modules/proj4/lib/defs.js");
/* harmony import */ var _nadgrid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nadgrid */ "./node_modules/proj4/lib/nadgrid.js");
/* harmony import */ var _transform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transform */ "./node_modules/proj4/lib/transform.js");
/* harmony import */ var mgrs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! mgrs */ "./node_modules/mgrs/mgrs.js");
/* harmony import */ var _projs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../projs */ "./node_modules/proj4/projs.js");










_core__WEBPACK_IMPORTED_MODULE_0__["default"].defaultDatum = 'WGS84'; //default datum
_core__WEBPACK_IMPORTED_MODULE_0__["default"].Proj = _Proj__WEBPACK_IMPORTED_MODULE_1__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].WGS84 = new _core__WEBPACK_IMPORTED_MODULE_0__["default"].Proj('WGS84');
_core__WEBPACK_IMPORTED_MODULE_0__["default"].Point = _Point__WEBPACK_IMPORTED_MODULE_2__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].toPoint = _common_toPoint__WEBPACK_IMPORTED_MODULE_3__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].defs = _defs__WEBPACK_IMPORTED_MODULE_4__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].nadgrid = _nadgrid__WEBPACK_IMPORTED_MODULE_5__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].transform = _transform__WEBPACK_IMPORTED_MODULE_6__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].mgrs = mgrs__WEBPACK_IMPORTED_MODULE_7__["default"];
_core__WEBPACK_IMPORTED_MODULE_0__["default"].version = '__VERSION__';
Object(_projs__WEBPACK_IMPORTED_MODULE_8__["default"])(_core__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (_core__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/proj4/lib/match.js":
/*!*****************************************!*\
  !*** ./node_modules/proj4/lib/match.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return match; });
var ignoredChar = /[\s_\-\/\(\)]/g;
function match(obj, key) {
  if (obj[key]) {
    return obj[key];
  }
  var keys = Object.keys(obj);
  var lkey = key.toLowerCase().replace(ignoredChar, '');
  var i = -1;
  var testkey, processedKey;
  while (++i < keys.length) {
    testkey = keys[i];
    processedKey = testkey.toLowerCase().replace(ignoredChar, '');
    if (processedKey === lkey) {
      return obj[testkey];
    }
  }
}


/***/ }),

/***/ "./node_modules/proj4/lib/nadgrid.js":
/*!*******************************************!*\
  !*** ./node_modules/proj4/lib/nadgrid.js ***!
  \*******************************************/
/*! exports provided: default, getNadgrids */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return nadgrid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNadgrids", function() { return getNadgrids; });
/**
 * Resources for details of NTv2 file formats:
 * - https://web.archive.org/web/20140127204822if_/http://www.mgs.gov.on.ca:80/stdprodconsume/groups/content/@mgs/@iandit/documents/resourcelist/stel02_047447.pdf
 * - http://mimaka.com/help/gs/html/004_NTV2%20Data%20Format.htm
 */

var loadedNadgrids = {};

/**
 * Load a binary NTv2 file (.gsb) to a key that can be used in a proj string like +nadgrids=<key>. Pass the NTv2 file
 * as an ArrayBuffer.
 */
function nadgrid(key, data) {
  var view = new DataView(data);
  var isLittleEndian = detectLittleEndian(view);
  var header = readHeader(view, isLittleEndian);
  if (header.nSubgrids > 1) {
    console.log('Only single NTv2 subgrids are currently supported, subsequent sub grids are ignored');
  }
  var subgrids = readSubgrids(view, header, isLittleEndian);
  var nadgrid = {header: header, subgrids: subgrids};
  loadedNadgrids[key] = nadgrid;
  return nadgrid;
}

/**
 * Given a proj4 value for nadgrids, return an array of loaded grids
 */
function getNadgrids(nadgrids) {
  // Format details: http://proj.maptools.org/gen_parms.html
  if (nadgrids === undefined) { return null; }
  var grids = nadgrids.split(',');
  return grids.map(parseNadgridString);
}

function parseNadgridString(value) {
  if (value.length === 0) {
    return null;
  }
  var optional = value[0] === '@';
  if (optional) {
    value = value.slice(1);
  }
  if (value === 'null') {
    return {name: 'null', mandatory: !optional, grid: null, isNull: true};
  }
  return {
    name: value,
    mandatory: !optional,
    grid: loadedNadgrids[value] || null,
    isNull: false
  };
}

function secondsToRadians(seconds) {
  return (seconds / 3600) * Math.PI / 180;
}

function detectLittleEndian(view) {
  var nFields = view.getInt32(8, false);
  if (nFields === 11) {
    return false;
  }
  nFields = view.getInt32(8, true);
  if (nFields !== 11) {
    console.warn('Failed to detect nadgrid endian-ness, defaulting to little-endian');
  }
  return true;
}

function readHeader(view, isLittleEndian) {
  return {
    nFields: view.getInt32(8, isLittleEndian),
    nSubgridFields: view.getInt32(24, isLittleEndian),
    nSubgrids: view.getInt32(40, isLittleEndian),
    shiftType: decodeString(view, 56, 56 + 8).trim(),
    fromSemiMajorAxis: view.getFloat64(120, isLittleEndian),
    fromSemiMinorAxis: view.getFloat64(136, isLittleEndian),
    toSemiMajorAxis: view.getFloat64(152, isLittleEndian),
    toSemiMinorAxis: view.getFloat64(168, isLittleEndian),
  };
}

function decodeString(view, start, end) {
  return String.fromCharCode.apply(null, new Uint8Array(view.buffer.slice(start, end)));
}

function readSubgrids(view, header, isLittleEndian) {
  var gridOffset = 176;
  var grids = [];
  for (var i = 0; i < header.nSubgrids; i++) {
    var subHeader = readGridHeader(view, gridOffset, isLittleEndian);
    var nodes = readGridNodes(view, gridOffset, subHeader, isLittleEndian);
    var lngColumnCount = Math.round(
      1 + (subHeader.upperLongitude - subHeader.lowerLongitude) / subHeader.longitudeInterval);
    var latColumnCount = Math.round(
      1 + (subHeader.upperLatitude - subHeader.lowerLatitude) / subHeader.latitudeInterval);
    // Proj4 operates on radians whereas the coordinates are in seconds in the grid
    grids.push({
      ll: [secondsToRadians(subHeader.lowerLongitude), secondsToRadians(subHeader.lowerLatitude)],
      del: [secondsToRadians(subHeader.longitudeInterval), secondsToRadians(subHeader.latitudeInterval)],
      lim: [lngColumnCount, latColumnCount],
      count: subHeader.gridNodeCount,
      cvs: mapNodes(nodes)
    });
  }
  return grids;
}

function mapNodes(nodes) {
  return nodes.map(function (r) {return [secondsToRadians(r.longitudeShift), secondsToRadians(r.latitudeShift)];});
}

function readGridHeader(view, offset, isLittleEndian) {
  return {
    name: decodeString(view, offset + 8, offset + 16).trim(),
    parent: decodeString(view, offset + 24, offset + 24 + 8).trim(),
    lowerLatitude: view.getFloat64(offset + 72, isLittleEndian),
    upperLatitude: view.getFloat64(offset + 88, isLittleEndian),
    lowerLongitude: view.getFloat64(offset + 104, isLittleEndian),
    upperLongitude: view.getFloat64(offset + 120, isLittleEndian),
    latitudeInterval: view.getFloat64(offset + 136, isLittleEndian),
    longitudeInterval: view.getFloat64(offset + 152, isLittleEndian),
    gridNodeCount: view.getInt32(offset + 168, isLittleEndian)
  };
}

function readGridNodes(view, offset, gridHeader, isLittleEndian) {
  var nodesOffset = offset + 176;
  var gridRecordLength = 16;
  var gridShiftRecords = [];
  for (var i = 0; i < gridHeader.gridNodeCount; i++) {
    var record = {
      latitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength, isLittleEndian),
      longitudeShift: view.getFloat32(nodesOffset + i * gridRecordLength + 4, isLittleEndian),
      latitudeAccuracy: view.getFloat32(nodesOffset + i * gridRecordLength + 8, isLittleEndian),
      longitudeAccuracy: view.getFloat32(nodesOffset + i * gridRecordLength + 12, isLittleEndian),
    };
    gridShiftRecords.push(record);
  }
  return gridShiftRecords;
}


/***/ }),

/***/ "./node_modules/proj4/lib/parseCode.js":
/*!*********************************************!*\
  !*** ./node_modules/proj4/lib/parseCode.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _defs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defs */ "./node_modules/proj4/lib/defs.js");
/* harmony import */ var wkt_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wkt-parser */ "./node_modules/wkt-parser/index.js");
/* harmony import */ var _projString__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projString */ "./node_modules/proj4/lib/projString.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");




function testObj(code){
  return typeof code === 'string';
}
function testDef(code){
  return code in _defs__WEBPACK_IMPORTED_MODULE_0__["default"];
}
var codeWords = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS','GEOCCS','PROJCS','LOCAL_CS', 'GEODCRS', 'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];
function testWKT(code){
  return codeWords.some(function (word) {
    return code.indexOf(word) > -1;
  });
}
var codes = ['3857', '900913', '3785', '102113'];
function checkMercator(item) {
  var auth = Object(_match__WEBPACK_IMPORTED_MODULE_3__["default"])(item, 'authority');
  if (!auth) {
    return;
  }
  var code = Object(_match__WEBPACK_IMPORTED_MODULE_3__["default"])(auth, 'epsg');
  return code && codes.indexOf(code) > -1;
}
function checkProjStr(item) {
  var ext = Object(_match__WEBPACK_IMPORTED_MODULE_3__["default"])(item, 'extension');
  if (!ext) {
    return;
  }
  return Object(_match__WEBPACK_IMPORTED_MODULE_3__["default"])(ext, 'proj4');
}
function testProj(code){
  return code[0] === '+';
}
function parse(code){
  if (testObj(code)) {
    //check to see if this is a WKT string
    if (testDef(code)) {
      return _defs__WEBPACK_IMPORTED_MODULE_0__["default"][code];
    }
    if (testWKT(code)) {
      var out = Object(wkt_parser__WEBPACK_IMPORTED_MODULE_1__["default"])(code);
      // test of spetial case, due to this being a very common and often malformed
      if (checkMercator(out)) {
        return _defs__WEBPACK_IMPORTED_MODULE_0__["default"]['EPSG:3857'];
      }
      var maybeProjStr = checkProjStr(out);
      if (maybeProjStr) {
        return Object(_projString__WEBPACK_IMPORTED_MODULE_2__["default"])(maybeProjStr);
      }
      return out;
    }
    if (testProj(code)) {
      return Object(_projString__WEBPACK_IMPORTED_MODULE_2__["default"])(code);
    }
  }else{
    return code;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (parse);


/***/ }),

/***/ "./node_modules/proj4/lib/projString.js":
/*!**********************************************!*\
  !*** ./node_modules/proj4/lib/projString.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _constants_PrimeMeridian__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/PrimeMeridian */ "./node_modules/proj4/lib/constants/PrimeMeridian.js");
/* harmony import */ var _constants_units__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/units */ "./node_modules/proj4/lib/constants/units.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./match */ "./node_modules/proj4/lib/match.js");





/* harmony default export */ __webpack_exports__["default"] = (function(defData) {
  var self = {};
  var paramObj = defData.split('+').map(function(v) {
    return v.trim();
  }).filter(function(a) {
    return a;
  }).reduce(function(p, a) {
    var split = a.split('=');
    split.push(true);
    p[split[0].toLowerCase()] = split[1];
    return p;
  }, {});
  var paramName, paramVal, paramOutname;
  var params = {
    proj: 'projName',
    datum: 'datumCode',
    rf: function(v) {
      self.rf = parseFloat(v);
    },
    lat_0: function(v) {
      self.lat0 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    lat_1: function(v) {
      self.lat1 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    lat_2: function(v) {
      self.lat2 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    lat_ts: function(v) {
      self.lat_ts = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    lon_0: function(v) {
      self.long0 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    lon_1: function(v) {
      self.long1 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    lon_2: function(v) {
      self.long2 = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    alpha: function(v) {
      self.alpha = parseFloat(v) * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    gamma: function(v) {
      self.rectified_grid_angle = parseFloat(v);
    },
    lonc: function(v) {
      self.longc = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    x_0: function(v) {
      self.x0 = parseFloat(v);
    },
    y_0: function(v) {
      self.y0 = parseFloat(v);
    },
    k_0: function(v) {
      self.k0 = parseFloat(v);
    },
    k: function(v) {
      self.k0 = parseFloat(v);
    },
    a: function(v) {
      self.a = parseFloat(v);
    },
    b: function(v) {
      self.b = parseFloat(v);
    },
    r_a: function() {
      self.R_A = true;
    },
    zone: function(v) {
      self.zone = parseInt(v, 10);
    },
    south: function() {
      self.utmSouth = true;
    },
    towgs84: function(v) {
      self.datum_params = v.split(",").map(function(a) {
        return parseFloat(a);
      });
    },
    to_meter: function(v) {
      self.to_meter = parseFloat(v);
    },
    units: function(v) {
      self.units = v;
      var unit = Object(_match__WEBPACK_IMPORTED_MODULE_3__["default"])(_constants_units__WEBPACK_IMPORTED_MODULE_2__["default"], v);
      if (unit) {
        self.to_meter = unit.to_meter;
      }
    },
    from_greenwich: function(v) {
      self.from_greenwich = v * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    pm: function(v) {
      var pm = Object(_match__WEBPACK_IMPORTED_MODULE_3__["default"])(_constants_PrimeMeridian__WEBPACK_IMPORTED_MODULE_1__["default"], v);
      self.from_greenwich = (pm ? pm : parseFloat(v)) * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    },
    nadgrids: function(v) {
      if (v === '@null') {
        self.datumCode = 'none';
      }
      else {
        self.nadgrids = v;
      }
    },
    axis: function(v) {
      var legalAxis = "ewnsud";
      if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
        self.axis = v;
      }
    },
    approx: function() {
      self.approx = true;
    }
  };
  for (paramName in paramObj) {
    paramVal = paramObj[paramName];
    if (paramName in params) {
      paramOutname = params[paramName];
      if (typeof paramOutname === 'function') {
        paramOutname(paramVal);
      }
      else {
        self[paramOutname] = paramVal;
      }
    }
    else {
      self[paramName] = paramVal;
    }
  }
  if(typeof self.datumCode === 'string' && self.datumCode !== "WGS84"){
    self.datumCode = self.datumCode.toLowerCase();
  }
  return self;
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections.js":
/*!***********************************************!*\
  !*** ./node_modules/proj4/lib/projections.js ***!
  \***********************************************/
/*! exports provided: add, get, start, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "start", function() { return start; });
/* harmony import */ var _projections_merc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./projections/merc */ "./node_modules/proj4/lib/projections/merc.js");
/* harmony import */ var _projections_longlat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projections/longlat */ "./node_modules/proj4/lib/projections/longlat.js");


var projs = [_projections_merc__WEBPACK_IMPORTED_MODULE_0__["default"], _projections_longlat__WEBPACK_IMPORTED_MODULE_1__["default"]];
var names = {};
var projStore = [];

function add(proj, i) {
  var len = projStore.length;
  if (!proj.names) {
    console.log(i);
    return true;
  }
  projStore[len] = proj;
  proj.names.forEach(function(n) {
    names[n.toLowerCase()] = len;
  });
  return this;
}



function get(name) {
  if (!name) {
    return false;
  }
  var n = name.toLowerCase();
  if (typeof names[n] !== 'undefined' && projStore[names[n]]) {
    return projStore[names[n]];
  }
}

function start() {
  projs.forEach(add);
}
/* harmony default export */ __webpack_exports__["default"] = ({
  start: start,
  add: add,
  get: get
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/aea.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/aea.js ***!
  \***************************************************/
/*! exports provided: init, forward, inverse, phi1z, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "phi1z", function() { return phi1z; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_qsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/qsfnz */ "./node_modules/proj4/lib/common/qsfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");






function init() {

  if (Math.abs(this.lat1 + this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"]) {
    return;
  }
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2);
  this.e3 = Math.sqrt(this.es);

  this.sin_po = Math.sin(this.lat1);
  this.cos_po = Math.cos(this.lat1);
  this.t1 = this.sin_po;
  this.con = this.sin_po;
  this.ms1 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e3, this.sin_po, this.cos_po);
  this.qs1 = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_po, this.cos_po);

  this.sin_po = Math.sin(this.lat2);
  this.cos_po = Math.cos(this.lat2);
  this.t2 = this.sin_po;
  this.ms2 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e3, this.sin_po, this.cos_po);
  this.qs2 = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_po, this.cos_po);

  this.sin_po = Math.sin(this.lat0);
  this.cos_po = Math.cos(this.lat0);
  this.t3 = this.sin_po;
  this.qs0 = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_po, this.cos_po);

  if (Math.abs(this.lat1 - this.lat2) > _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"]) {
    this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
  }
  else {
    this.ns0 = this.con;
  }
  this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
  this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
}

/* Albers Conical Equal Area forward equations--mapping lat,long to x,y
  -------------------------------------------------------------------*/
function forward(p) {

  var lon = p.x;
  var lat = p.y;

  this.sin_phi = Math.sin(lat);
  this.cos_phi = Math.cos(lat);

  var qs = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e3, this.sin_phi, this.cos_phi);
  var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
  var theta = this.ns0 * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(lon - this.long0);
  var x = rh1 * Math.sin(theta) + this.x0;
  var y = this.rh - rh1 * Math.cos(theta) + this.y0;

  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var rh1, qs, con, theta, lon, lat;

  p.x -= this.x0;
  p.y = this.rh - p.y + this.y0;
  if (this.ns0 >= 0) {
    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
    con = 1;
  }
  else {
    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
    con = -1;
  }
  theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2(con * p.x, con * p.y);
  }
  con = rh1 * this.ns0 / this.a;
  if (this.sphere) {
    lat = Math.asin((this.c - con * con) / (2 * this.ns0));
  }
  else {
    qs = (this.c - con * con) / this.ns0;
    lat = this.phi1z(this.e3, qs);
  }

  lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(theta / this.ns0 + this.long0);
  p.x = lon;
  p.y = lat;
  return p;
}

/* Function to compute phi1, the latitude for the inverse of the
   Albers Conical Equal-Area projection.
-------------------------------------------*/
function phi1z(eccent, qs) {
  var sinphi, cosphi, con, com, dphi;
  var phi = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_3__["default"])(0.5 * qs);
  if (eccent < _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"]) {
    return phi;
  }

  var eccnts = eccent * eccent;
  for (var i = 1; i <= 25; i++) {
    sinphi = Math.sin(phi);
    cosphi = Math.cos(phi);
    con = eccent * sinphi;
    com = 1 - con * con;
    dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
    phi = phi + dphi;
    if (Math.abs(dphi) <= 1e-7) {
      return phi;
    }
  }
  return null;
}

var names = ["Albers_Conic_Equal_Area", "Albers", "aea"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names,
  phi1z: phi1z
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/aeqd.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/aeqd.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_gN__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/gN */ "./node_modules/proj4/lib/common/gN.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _common_imlfn__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/imlfn */ "./node_modules/proj4/lib/common/imlfn.js");














function init() {
  this.sin_p12 = Math.sin(this.lat0);
  this.cos_p12 = Math.cos(this.lat0);
}

function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var sinphi = Math.sin(p.y);
  var cosphi = Math.cos(p.y);
  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;
  if (this.sphere) {
    if (Math.abs(this.sin_p12 - 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      //North Pole case
      p.x = this.x0 + this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"] - lat) * Math.sin(dlon);
      p.y = this.y0 - this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"] - lat) * Math.cos(dlon);
      return p;
    }
    else if (Math.abs(this.sin_p12 + 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      //South Pole case
      p.x = this.x0 + this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"] + lat) * Math.sin(dlon);
      p.y = this.y0 + this.a * (_constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"] + lat) * Math.cos(dlon);
      return p;
    }
    else {
      //default case
      cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
      c = Math.acos(cos_c);
      kp = c ? c / Math.sin(c) : 1;
      p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
      p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
      return p;
    }
  }
  else {
    e0 = Object(_common_e0fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    e1 = Object(_common_e1fn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.es);
    e2 = Object(_common_e2fn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.es);
    e3 = Object(_common_e3fn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.es);
    if (Math.abs(this.sin_p12 - 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      //North Pole case
      Mlp = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"]);
      Ml = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, lat);
      p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
      p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
      return p;
    }
    else if (Math.abs(this.sin_p12 + 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      //South Pole case
      Mlp = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"]);
      Ml = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, lat);
      p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
      p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
      return p;
    }
    else {
      //Default case
      tanphi = sinphi / cosphi;
      Nl1 = Object(_common_gN__WEBPACK_IMPORTED_MODULE_7__["default"])(this.a, this.e, this.sin_p12);
      Nl = Object(_common_gN__WEBPACK_IMPORTED_MODULE_7__["default"])(this.a, this.e, sinphi);
      psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
      Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));
      if (Az === 0) {
        s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
      }
      else if (Math.abs(Math.abs(Az) - Math.PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
        s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
      }
      else {
        s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
      }
      G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
      H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
      GH = G * H;
      Hs = H * H;
      s2 = s * s;
      s3 = s2 * s;
      s4 = s3 * s;
      s5 = s4 * s;
      c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
      p.x = this.x0 + c * Math.sin(Az);
      p.y = this.y0 + c * Math.cos(Az);
      return p;
    }
  }


}

function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F, sinpsi;
  if (this.sphere) {
    rh = Math.sqrt(p.x * p.x + p.y * p.y);
    if (rh > (2 * _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"] * this.a)) {
      return;
    }
    z = rh / this.a;

    sinz = Math.sin(z);
    cosz = Math.cos(z);

    lon = this.long0;
    if (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      lat = this.lat0;
    }
    else {
      lat = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_8__["default"])(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
      con = Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"];
      if (Math.abs(con) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
        if (this.lat0 >= 0) {
          lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, - p.y));
        }
        else {
          lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 - Math.atan2(-p.x, p.y));
        }
      }
      else {
        /*con = cosz - this.sin_p12 * Math.sin(lat);
        if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
          //no-op, just keep the lon value as is
        } else {
          var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
          lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
        }*/
        lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
      }
    }

    p.x = lon;
    p.y = lat;
    return p;
  }
  else {
    e0 = Object(_common_e0fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    e1 = Object(_common_e1fn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.es);
    e2 = Object(_common_e2fn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.es);
    e3 = Object(_common_e3fn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.es);
    if (Math.abs(this.sin_p12 - 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      //North pole case
      Mlp = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"]);
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      M = Mlp - rh;
      lat = Object(_common_imlfn__WEBPACK_IMPORTED_MODULE_9__["default"])(M / this.a, e0, e1, e2, e3);
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, - 1 * p.y));
      p.x = lon;
      p.y = lat;
      return p;
    }
    else if (Math.abs(this.sin_p12 + 1) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      //South pole case
      Mlp = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(e0, e1, e2, e3, _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"]);
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      M = rh - Mlp;

      lat = Object(_common_imlfn__WEBPACK_IMPORTED_MODULE_9__["default"])(M / this.a, e0, e1, e2, e3);
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, p.y));
      p.x = lon;
      p.y = lat;
      return p;
    }
    else {
      //default case
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      Az = Math.atan2(p.x, p.y);
      N1 = Object(_common_gN__WEBPACK_IMPORTED_MODULE_7__["default"])(this.a, this.e, this.sin_p12);
      cosAz = Math.cos(Az);
      tmp = this.e * this.cos_p12 * cosAz;
      A = -tmp * tmp / (1 - this.es);
      B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
      D = rh / N1;
      Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
      F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
      psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
      sinpsi = Math.sin(psi);
      lat = Math.atan2((sinpsi - this.es * F * this.sin_p12) * Math.tan(psi), sinpsi * (1 - this.es));
      p.x = lon;
      p.y = lat;
      return p;
    }
  }

}

var names = ["Azimuthal_Equidistant", "aeqd"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/cass.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/cass.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_gN__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/gN */ "./node_modules/proj4/lib/common/gN.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_imlfn__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/imlfn */ "./node_modules/proj4/lib/common/imlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");











function init() {
  if (!this.sphere) {
    this.e0 = Object(_common_e0fn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.es);
    this.e1 = Object(_common_e1fn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
    this.e2 = Object(_common_e2fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
    this.e3 = Object(_common_e3fn__WEBPACK_IMPORTED_MODULE_4__["default"])(this.es);
    this.ml0 = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat0);
  }
}

/* Cassini forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
function forward(p) {

  /* Forward equations
      -----------------*/
  var x, y;
  var lam = p.x;
  var phi = p.y;
  lam = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(lam - this.long0);

  if (this.sphere) {
    x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
    y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
  }
  else {
    //ellipsoid
    var sinphi = Math.sin(phi);
    var cosphi = Math.cos(phi);
    var nl = Object(_common_gN__WEBPACK_IMPORTED_MODULE_5__["default"])(this.a, this.e, sinphi);
    var tl = Math.tan(phi) * Math.tan(phi);
    var al = lam * Math.cos(phi);
    var asq = al * al;
    var cl = this.es * cosphi * cosphi / (1 - this.es);
    var ml = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e0, this.e1, this.e2, this.e3, phi);

    x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
    y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);


  }

  p.x = x + this.x0;
  p.y = y + this.y0;
  return p;
}

/* Inverse equations
  -----------------*/
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var x = p.x / this.a;
  var y = p.y / this.a;
  var phi, lam;

  if (this.sphere) {
    var dd = y + this.lat0;
    phi = Math.asin(Math.sin(dd) * Math.cos(x));
    lam = Math.atan2(Math.tan(x), Math.cos(dd));
  }
  else {
    /* ellipsoid */
    var ml1 = this.ml0 / this.a + y;
    var phi1 = Object(_common_imlfn__WEBPACK_IMPORTED_MODULE_8__["default"])(ml1, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(phi1) - _constants_values__WEBPACK_IMPORTED_MODULE_9__["HALF_PI"]) <= _constants_values__WEBPACK_IMPORTED_MODULE_9__["EPSLN"]) {
      p.x = this.long0;
      p.y = _constants_values__WEBPACK_IMPORTED_MODULE_9__["HALF_PI"];
      if (y < 0) {
        p.y *= -1;
      }
      return p;
    }
    var nl1 = Object(_common_gN__WEBPACK_IMPORTED_MODULE_5__["default"])(this.a, this.e, Math.sin(phi1));

    var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
    var tl1 = Math.pow(Math.tan(phi1), 2);
    var dl = x * this.a / nl1;
    var dsq = dl * dl;
    phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
    lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);

  }

  p.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(lam + this.long0);
  p.y = Object(_common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__["default"])(phi);
  return p;

}

var names = ["Cassini", "Cassini_Soldner", "cass"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/cea.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/cea.js ***!
  \***************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_qsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/qsfnz */ "./node_modules/proj4/lib/common/qsfnz.js");
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_iqsfnz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/iqsfnz */ "./node_modules/proj4/lib/common/iqsfnz.js");





/*
  reference:
    "Cartographic Projection Procedures for the UNIX Environment-
    A User's Manual" by Gerald I. Evenden,
    USGS Open File Report 90-284and Release 4 Interim Reports (2003)
*/
function init() {
  //no-op
  if (!this.sphere) {
    this.k0 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
  }
}

/* Cylindrical Equal Area forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var x, y;
  /* Forward equations
      -----------------*/
  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  if (this.sphere) {
    x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
    y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
  }
  else {
    var qs = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, Math.sin(lat));
    x = this.x0 + this.a * this.k0 * dlon;
    y = this.y0 + this.a * qs * 0.5 / this.k0;
  }

  p.x = x;
  p.y = y;
  return p;
}

/* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var lon, lat;

  if (this.sphere) {
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
    lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
  }
  else {
    lat = Object(_common_iqsfnz__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, 2 * p.y * this.k0 / this.a);
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + p.x / (this.a * this.k0));
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["cea"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/eqc.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/eqc.js ***!
  \***************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");



function init() {

  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.lat0 = this.lat0 || 0;
  this.long0 = this.long0 || 0;
  this.lat_ts = this.lat_ts || 0;
  this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

  this.rc = Math.cos(this.lat_ts);
}

// forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function forward(p) {

  var lon = p.x;
  var lat = p.y;

  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  var dlat = Object(_common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__["default"])(lat - this.lat0);
  p.x = this.x0 + (this.a * dlon * this.rc);
  p.y = this.y0 + (this.a * dlat);
  return p;
}

// inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function inverse(p) {

  var x = p.x;
  var y = p.y;

  p.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + ((x - this.x0) / (this.a * this.rc)));
  p.y = Object(_common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__["default"])(this.lat0 + ((y - this.y0) / (this.a)));
  return p;
}

var names = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/eqdc.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/eqdc.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_imlfn__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/imlfn */ "./node_modules/proj4/lib/common/imlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");











function init() {

  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  // Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(this.lat1 + this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_9__["EPSLN"]) {
    return;
  }
  this.lat2 = this.lat2 || this.lat1;
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2);
  this.e = Math.sqrt(this.es);
  this.e0 = Object(_common_e0fn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.es);
  this.e1 = Object(_common_e1fn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.es);
  this.e2 = Object(_common_e2fn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
  this.e3 = Object(_common_e3fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);

  this.sinphi = Math.sin(this.lat1);
  this.cosphi = Math.cos(this.lat1);

  this.ms1 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, this.sinphi, this.cosphi);
  this.ml1 = Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat1);

  if (Math.abs(this.lat1 - this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_9__["EPSLN"]) {
    this.ns = this.sinphi;
  }
  else {
    this.sinphi = Math.sin(this.lat2);
    this.cosphi = Math.cos(this.lat2);
    this.ms2 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, this.sinphi, this.cosphi);
    this.ml2 = Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat2);
    this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
  }
  this.g = this.ml1 + this.ms1 / this.ns;
  this.ml0 = Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat0);
  this.rh = this.a * (this.g - this.ml0);
}

/* Equidistant Conic forward equations--mapping lat,long to x,y
  -----------------------------------------------------------*/
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var rh1;

  /* Forward equations
      -----------------*/
  if (this.sphere) {
    rh1 = this.a * (this.g - lat);
  }
  else {
    var ml = Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_5__["default"])(this.e0, this.e1, this.e2, this.e3, lat);
    rh1 = this.a * (this.g - ml);
  }
  var theta = this.ns * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(lon - this.long0);
  var x = this.x0 + rh1 * Math.sin(theta);
  var y = this.y0 + this.rh - rh1 * Math.cos(theta);
  p.x = x;
  p.y = y;
  return p;
}

/* Inverse equations
  -----------------*/
function inverse(p) {
  p.x -= this.x0;
  p.y = this.rh - p.y + this.y0;
  var con, rh1, lat, lon;
  if (this.ns >= 0) {
    rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
    con = 1;
  }
  else {
    rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
    con = -1;
  }
  var theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2(con * p.x, con * p.y);
  }

  if (this.sphere) {
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(this.long0 + theta / this.ns);
    lat = Object(_common_adjust_lat__WEBPACK_IMPORTED_MODULE_7__["default"])(this.g - rh1 / this.a);
    p.x = lon;
    p.y = lat;
    return p;
  }
  else {
    var ml = this.g - rh1 / this.a;
    lat = Object(_common_imlfn__WEBPACK_IMPORTED_MODULE_8__["default"])(ml, this.e0, this.e1, this.e2, this.e3);
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_6__["default"])(this.long0 + theta / this.ns);
    p.x = lon;
    p.y = lat;
    return p;
  }

}

var names = ["Equidistant_Conic", "eqdc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/etmerc.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/etmerc.js ***!
  \******************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projections/tmerc */ "./node_modules/proj4/lib/projections/tmerc.js");
/* harmony import */ var _common_sinh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/sinh */ "./node_modules/proj4/lib/common/sinh.js");
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");
/* harmony import */ var _common_asinhy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/asinhy */ "./node_modules/proj4/lib/common/asinhy.js");
/* harmony import */ var _common_gatg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/gatg */ "./node_modules/proj4/lib/common/gatg.js");
/* harmony import */ var _common_clens__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/clens */ "./node_modules/proj4/lib/common/clens.js");
/* harmony import */ var _common_clens_cmplx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/clens_cmplx */ "./node_modules/proj4/lib/common/clens_cmplx.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
// Heavily based on this etmerc projection implementation
// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/etmerc.js










function init() {
  if (!this.approx && (isNaN(this.es) || this.es <= 0)) {
    throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
  }
  if (this.approx) {
    // When '+approx' is set, use tmerc instead
    _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"].init.apply(this);
    this.forward = _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"].forward;
    this.inverse = _projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"].inverse;
  }

  this.x0 = this.x0 !== undefined ? this.x0 : 0;
  this.y0 = this.y0 !== undefined ? this.y0 : 0;
  this.long0 = this.long0 !== undefined ? this.long0 : 0;
  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

  this.cgb = [];
  this.cbg = [];
  this.utg = [];
  this.gtu = [];

  var f = this.es / (1 + Math.sqrt(1 - this.es));
  var n = f / (2 - f);
  var np = n;

  this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675 ))))));
  this.cbg[0] = n * (-2 + n * ( 2 / 3 + n * ( 4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

  np = np * n;
  this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
  this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * ( -13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

  np = np * n;
  this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
  this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

  np = np * n;
  this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
  this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * ( -24832 / 14175)));

  np = np * n;
  this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
  this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

  np = np * n;
  this.cgb[5] = np * (601676 / 22275);
  this.cbg[5] = np * (444337 / 155925);

  np = Math.pow(n, 2);
  this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

  this.utg[0] = n * (-0.5 + n * ( 2 / 3 + n * (-37 / 96 + n * ( 1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
  this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

  this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
  this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

  np = np * n;
  this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720 ))));
  this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

  np = np * n;
  this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
  this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

  np = np * n;
  this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
  this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

  np = np * n;
  this.utg[5] = np * (-20648693 / 638668800);
  this.gtu[5] = np * (212378941 / 319334400);

  var Z = Object(_common_gatg__WEBPACK_IMPORTED_MODULE_4__["default"])(this.cbg, this.lat0);
  this.Zb = -this.Qn * (Z + Object(_common_clens__WEBPACK_IMPORTED_MODULE_5__["default"])(this.gtu, 2 * Z));
}

function forward(p) {
  var Ce = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_7__["default"])(p.x - this.long0);
  var Cn = p.y;

  Cn = Object(_common_gatg__WEBPACK_IMPORTED_MODULE_4__["default"])(this.cbg, Cn);
  var sin_Cn = Math.sin(Cn);
  var cos_Cn = Math.cos(Cn);
  var sin_Ce = Math.sin(Ce);
  var cos_Ce = Math.cos(Ce);

  Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
  Ce = Math.atan2(sin_Ce * cos_Cn, Object(_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(sin_Cn, cos_Cn * cos_Ce));
  Ce = Object(_common_asinhy__WEBPACK_IMPORTED_MODULE_3__["default"])(Math.tan(Ce));

  var tmp = Object(_common_clens_cmplx__WEBPACK_IMPORTED_MODULE_6__["default"])(this.gtu, 2 * Cn, 2 * Ce);

  Cn = Cn + tmp[0];
  Ce = Ce + tmp[1];

  var x;
  var y;

  if (Math.abs(Ce) <= 2.623395162778) {
    x = this.a * (this.Qn * Ce) + this.x0;
    y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
  }
  else {
    x = Infinity;
    y = Infinity;
  }

  p.x = x;
  p.y = y;

  return p;
}

function inverse(p) {
  var Ce = (p.x - this.x0) * (1 / this.a);
  var Cn = (p.y - this.y0) * (1 / this.a);

  Cn = (Cn - this.Zb) / this.Qn;
  Ce = Ce / this.Qn;

  var lon;
  var lat;

  if (Math.abs(Ce) <= 2.623395162778) {
    var tmp = Object(_common_clens_cmplx__WEBPACK_IMPORTED_MODULE_6__["default"])(this.utg, 2 * Cn, 2 * Ce);

    Cn = Cn + tmp[0];
    Ce = Ce + tmp[1];
    Ce = Math.atan(Object(_common_sinh__WEBPACK_IMPORTED_MODULE_1__["default"])(Ce));

    var sin_Cn = Math.sin(Cn);
    var cos_Cn = Math.cos(Cn);
    var sin_Ce = Math.sin(Ce);
    var cos_Ce = Math.cos(Ce);

    Cn = Math.atan2(sin_Cn * cos_Ce, Object(_common_hypot__WEBPACK_IMPORTED_MODULE_2__["default"])(sin_Ce, cos_Ce * cos_Cn));
    Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_7__["default"])(Ce + this.long0);
    lat = Object(_common_gatg__WEBPACK_IMPORTED_MODULE_4__["default"])(this.cgb, Cn);
  }
  else {
    lon = Infinity;
    lat = Infinity;
  }

  p.x = lon;
  p.y = lat;

  return p;
}

var names = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "tmerc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/gauss.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/gauss.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_srat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/srat */ "./node_modules/proj4/lib/common/srat.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");

var MAX_ITER = 20;


function init() {
  var sphi = Math.sin(this.lat0);
  var cphi = Math.cos(this.lat0);
  cphi *= cphi;
  this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
  this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
  this.phic0 = Math.asin(sphi / this.C);
  this.ratexp = 0.5 * this.C * this.e;
  this.K = Math.tan(0.5 * this.phic0 + _constants_values__WEBPACK_IMPORTED_MODULE_1__["FORTPI"]) / (Math.pow(Math.tan(0.5 * this.lat0 + _constants_values__WEBPACK_IMPORTED_MODULE_1__["FORTPI"]), this.C) * Object(_common_srat__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e * sphi, this.ratexp));
}

function forward(p) {
  var lon = p.x;
  var lat = p.y;

  p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + _constants_values__WEBPACK_IMPORTED_MODULE_1__["FORTPI"]), this.C) * Object(_common_srat__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e * Math.sin(lat), this.ratexp)) - _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"];
  p.x = this.C * lon;
  return p;
}

function inverse(p) {
  var DEL_TOL = 1e-14;
  var lon = p.x / this.C;
  var lat = p.y;
  var num = Math.pow(Math.tan(0.5 * lat + _constants_values__WEBPACK_IMPORTED_MODULE_1__["FORTPI"]) / this.K, 1 / this.C);
  for (var i = MAX_ITER; i > 0; --i) {
    lat = 2 * Math.atan(num * Object(_common_srat__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e * Math.sin(p.y), - 0.5 * this.e)) - _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"];
    if (Math.abs(lat - p.y) < DEL_TOL) {
      break;
    }
    p.y = lat;
  }
  /* convergence failed */
  if (!i) {
    return null;
  }
  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["gauss"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/geocent.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/geocent.js ***!
  \*******************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _datumUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../datumUtils */ "./node_modules/proj4/lib/datumUtils.js");


function init() {
    this.name = 'geocent';

}

function forward(p) {
    var point = Object(_datumUtils__WEBPACK_IMPORTED_MODULE_0__["geodeticToGeocentric"])(p, this.es, this.a);
    return point;
}

function inverse(p) {
    var point = Object(_datumUtils__WEBPACK_IMPORTED_MODULE_0__["geocentricToGeodetic"])(p, this.es, this.a, this.b);
    return point;
}

var names = ["Geocentric", 'geocentric', "geocent", "Geocent"];
/* harmony default export */ __webpack_exports__["default"] = ({
    init: init,
    forward: forward,
    inverse: inverse,
    names: names
});

/***/ }),

/***/ "./node_modules/proj4/lib/projections/gnom.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/gnom.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");




/*
  reference:
    Wolfram Mathworld "Gnomonic Projection"
    http://mathworld.wolfram.com/GnomonicProjection.html
    Accessed: 12th November 2009
  */
function init() {

  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  this.sin_p14 = Math.sin(this.lat0);
  this.cos_p14 = Math.cos(this.lat0);
  // Approximation for projecting points to the horizon (infinity)
  this.infinity_dist = 1000 * this.a;
  this.rc = 1;
}

/* Gnomonic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
function forward(p) {
  var sinphi, cosphi; /* sin and cos value        */
  var dlon; /* delta longitude value      */
  var coslon; /* cos of longitude        */
  var ksp; /* scale factor          */
  var g;
  var x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      -----------------*/
  dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);

  sinphi = Math.sin(lat);
  cosphi = Math.cos(lat);

  coslon = Math.cos(dlon);
  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
  ksp = 1;
  if ((g > 0) || (Math.abs(g) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__["EPSLN"])) {
    x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
  }
  else {

    // Point is in the opposing hemisphere and is unprojectable
    // We still need to return a reasonable point, so we project
    // to infinity, on a bearing
    // equivalent to the northern hemisphere equivalent
    // This is a reasonable approximation for short shapes and lines that
    // straddle the horizon.

    x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
    y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

  }
  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var rh; /* Rho */
  var sinc, cosc;
  var c;
  var lon, lat;

  /* Inverse equations
      -----------------*/
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  p.x /= this.k0;
  p.y /= this.k0;

  if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
    c = Math.atan2(rh, this.rc);
    sinc = Math.sin(c);
    cosc = Math.cos(c);

    lat = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_1__["default"])(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
    lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + lon);
  }
  else {
    lat = this.phic0;
    lon = 0;
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["gnom"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/krovak.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/krovak.js ***!
  \******************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");


function init() {
  this.a = 6377397.155;
  this.es = 0.006674372230614;
  this.e = Math.sqrt(this.es);
  if (!this.lat0) {
    this.lat0 = 0.863937979737193;
  }
  if (!this.long0) {
    this.long0 = 0.7417649320975901 - 0.308341501185665;
  }
  /* if scale not set default to 0.9999 */
  if (!this.k0) {
    this.k0 = 0.9999;
  }
  this.s45 = 0.785398163397448; /* 45 */
  this.s90 = 2 * this.s45;
  this.fi0 = this.lat0;
  this.e2 = this.es;
  this.e = Math.sqrt(this.e2);
  this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
  this.uq = 1.04216856380474;
  this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
  this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
  this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
  this.k1 = this.k0;
  this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
  this.s0 = 1.37008346281555;
  this.n = Math.sin(this.s0);
  this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
  this.ad = this.s90 - this.uq;
}

/* ellipsoid */
/* calculate xy from lat/lon */
/* Constants, identical to inverse transform function */
function forward(p) {
  var gfi, u, deltav, s, d, eps, ro;
  var lon = p.x;
  var lat = p.y;
  var delta_lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  /* Transformation */
  gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
  u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
  deltav = -delta_lon * this.alfa;
  s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
  d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
  eps = this.n * d;
  ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
  p.y = ro * Math.cos(eps) / 1;
  p.x = ro * Math.sin(eps) / 1;

  if (!this.czech) {
    p.y *= -1;
    p.x *= -1;
  }
  return (p);
}

/* calculate lat/lon from xy */
function inverse(p) {
  var u, deltav, s, d, eps, ro, fi1;
  var ok;

  /* Transformation */
  /* revert y, x*/
  var tmp = p.x;
  p.x = p.y;
  p.y = tmp;
  if (!this.czech) {
    p.y *= -1;
    p.x *= -1;
  }
  ro = Math.sqrt(p.x * p.x + p.y * p.y);
  eps = Math.atan2(p.y, p.x);
  d = eps / Math.sin(this.s0);
  s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
  u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
  deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
  p.x = this.long0 - deltav / this.alfa;
  fi1 = u;
  ok = 0;
  var iter = 0;
  do {
    p.y = 2 * (Math.atan(Math.pow(this.k, - 1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
    if (Math.abs(fi1 - p.y) < 0.0000000001) {
      ok = 1;
    }
    fi1 = p.y;
    iter += 1;
  } while (ok === 0 && iter < 15);
  if (iter >= 15) {
    return null;
  }

  return (p);
}

var names = ["Krovak", "krovak"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/laea.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/laea.js ***!
  \****************************************************/
/*! exports provided: S_POLE, N_POLE, EQUIT, OBLIQ, init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "S_POLE", function() { return S_POLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "N_POLE", function() { return N_POLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EQUIT", function() { return EQUIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OBLIQ", function() { return OBLIQ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_qsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/qsfnz */ "./node_modules/proj4/lib/common/qsfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");






/*
  reference
    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
  */

var S_POLE = 1;

var N_POLE = 2;
var EQUIT = 3;
var OBLIQ = 4;

/* Initialize the Lambert Azimuthal Equal Area projection
  ------------------------------------------------------*/
function init() {
  var t = Math.abs(this.lat0);
  if (Math.abs(t - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
  }
  else if (Math.abs(t) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    this.mode = this.EQUIT;
  }
  else {
    this.mode = this.OBLIQ;
  }
  if (this.es > 0) {
    var sinphi;

    this.qp = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, 1);
    this.mmf = 0.5 / (1 - this.es);
    this.apa = authset(this.es);
    switch (this.mode) {
    case this.N_POLE:
      this.dd = 1;
      break;
    case this.S_POLE:
      this.dd = 1;
      break;
    case this.EQUIT:
      this.rq = Math.sqrt(0.5 * this.qp);
      this.dd = 1 / this.rq;
      this.xmf = 1;
      this.ymf = 0.5 * this.qp;
      break;
    case this.OBLIQ:
      this.rq = Math.sqrt(0.5 * this.qp);
      sinphi = Math.sin(this.lat0);
      this.sinb1 = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, sinphi) / this.qp;
      this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
      this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
      this.ymf = (this.xmf = this.rq) / this.dd;
      this.xmf *= this.dd;
      break;
    }
  }
  else {
    if (this.mode === this.OBLIQ) {
      this.sinph0 = Math.sin(this.lat0);
      this.cosph0 = Math.cos(this.lat0);
    }
  }
}

/* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
  -----------------------------------------------------------------------*/
function forward(p) {

  /* Forward equations
      -----------------*/
  var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
  var lam = p.x;
  var phi = p.y;

  lam = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(lam - this.long0);
  if (this.sphere) {
    sinphi = Math.sin(phi);
    cosphi = Math.cos(phi);
    coslam = Math.cos(lam);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
      if (y <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
        return null;
      }
      y = Math.sqrt(2 / y);
      x = y * cosphi * Math.sin(lam);
      y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
    }
    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE) {
        coslam = -coslam;
      }
      if (Math.abs(phi + this.lat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
        return null;
      }
      y = _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] - phi * 0.5;
      y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
      x = y * Math.sin(lam);
      y *= coslam;
    }
  }
  else {
    sinb = 0;
    cosb = 0;
    b = 0;
    coslam = Math.cos(lam);
    sinlam = Math.sin(lam);
    sinphi = Math.sin(phi);
    q = Object(_common_qsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, sinphi);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      sinb = q / this.qp;
      cosb = Math.sqrt(1 - sinb * sinb);
    }
    switch (this.mode) {
    case this.OBLIQ:
      b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
      break;
    case this.EQUIT:
      b = 1 + cosb * coslam;
      break;
    case this.N_POLE:
      b = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + phi;
      q = this.qp - q;
      break;
    case this.S_POLE:
      b = phi - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
      q = this.qp + q;
      break;
    }
    if (Math.abs(b) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      return null;
    }
    switch (this.mode) {
    case this.OBLIQ:
    case this.EQUIT:
      b = Math.sqrt(2 / b);
      if (this.mode === this.OBLIQ) {
        y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
      }
      else {
        y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
      }
      x = this.xmf * b * cosb * sinlam;
      break;
    case this.N_POLE:
    case this.S_POLE:
      if (q >= 0) {
        x = (b = Math.sqrt(q)) * sinlam;
        y = coslam * ((this.mode === this.S_POLE) ? b : -b);
      }
      else {
        x = y = 0;
      }
      break;
    }
  }

  p.x = this.a * x + this.x0;
  p.y = this.a * y + this.y0;
  return p;
}

/* Inverse equations
  -----------------*/
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var x = p.x / this.a;
  var y = p.y / this.a;
  var lam, phi, cCe, sCe, q, rho, ab;
  if (this.sphere) {
    var cosz = 0,
      rh, sinz = 0;

    rh = Math.sqrt(x * x + y * y);
    phi = rh * 0.5;
    if (phi > 1) {
      return null;
    }
    phi = 2 * Math.asin(phi);
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      sinz = Math.sin(phi);
      cosz = Math.cos(phi);
    }
    switch (this.mode) {
    case this.EQUIT:
      phi = (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) ? 0 : Math.asin(y * sinz / rh);
      x *= sinz;
      y = cosz * rh;
      break;
    case this.OBLIQ:
      phi = (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) ? this.lat0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
      x *= sinz * this.cosph0;
      y = (cosz - Math.sin(phi) * this.sinph0) * rh;
      break;
    case this.N_POLE:
      y = -y;
      phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - phi;
      break;
    case this.S_POLE:
      phi -= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
      break;
    }
    lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
  }
  else {
    ab = 0;
    if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      x /= this.dd;
      y *= this.dd;
      rho = Math.sqrt(x * x + y * y);
      if (rho < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
        p.x = this.long0;
        p.y = this.lat0;
        return p;
      }
      sCe = 2 * Math.asin(0.5 * rho / this.rq);
      cCe = Math.cos(sCe);
      x *= (sCe = Math.sin(sCe));
      if (this.mode === this.OBLIQ) {
        ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
        q = this.qp * ab;
        y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
      }
      else {
        ab = y * sCe / rho;
        q = this.qp * ab;
        y = rho * cCe;
      }
    }
    else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE) {
        y = -y;
      }
      q = (x * x + y * y);
      if (!q) {
        p.x = this.long0;
        p.y = this.lat0;
        return p;
      }
      ab = 1 - q / this.qp;
      if (this.mode === this.S_POLE) {
        ab = -ab;
      }
    }
    lam = Math.atan2(x, y);
    phi = authlat(Math.asin(ab), this.apa);
  }

  p.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_2__["default"])(this.long0 + lam);
  p.y = phi;
  return p;
}

/* determine latitude from authalic latitude */
var P00 = 0.33333333333333333333;

var P01 = 0.17222222222222222222;
var P02 = 0.10257936507936507936;
var P10 = 0.06388888888888888888;
var P11 = 0.06640211640211640211;
var P20 = 0.01641501294219154443;

function authset(es) {
  var t;
  var APA = [];
  APA[0] = es * P00;
  t = es * es;
  APA[0] += t * P01;
  APA[1] = t * P10;
  t *= es;
  APA[0] += t * P02;
  APA[1] += t * P11;
  APA[2] = t * P20;
  return APA;
}

function authlat(beta, APA) {
  var t = beta + beta;
  return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
}

var names = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names,
  S_POLE: S_POLE,
  N_POLE: N_POLE,
  EQUIT: EQUIT,
  OBLIQ: OBLIQ
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/lcc.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/lcc.js ***!
  \***************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_sign__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/sign */ "./node_modules/proj4/lib/common/sign.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");






function init() {
  
  //double lat0;                    /* the reference latitude               */
  //double long0;                   /* the reference longitude              */
  //double lat1;                    /* first standard parallel              */
  //double lat2;                    /* second standard parallel             */
  //double r_maj;                   /* major axis                           */
  //double r_min;                   /* minor axis                           */
  //double false_east;              /* x offset in meters                   */
  //double false_north;             /* y offset in meters                   */
  
  //the above value can be set with proj4.defs
  //example: proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

  if (!this.lat2) {
    this.lat2 = this.lat1;
  } //if lat2 is not defined
  if (!this.k0) {
    this.k0 = 1;
  }
  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  // Standard Parallels cannot be equal and on opposite sides of the equator
  if (Math.abs(this.lat1 + this.lat2) < _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]) {
    return;
  }

  var temp = this.b / this.a;
  this.e = Math.sqrt(1 - temp * temp);

  var sin1 = Math.sin(this.lat1);
  var cos1 = Math.cos(this.lat1);
  var ms1 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, sin1, cos1);
  var ts1 = Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, this.lat1, sin1);

  var sin2 = Math.sin(this.lat2);
  var cos2 = Math.cos(this.lat2);
  var ms2 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, sin2, cos2);
  var ts2 = Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, this.lat2, sin2);

  var ts0 = Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, this.lat0, Math.sin(this.lat0));

  if (Math.abs(this.lat1 - this.lat2) > _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]) {
    this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
  }
  else {
    this.ns = sin1;
  }
  if (isNaN(this.ns)) {
    this.ns = sin1;
  }
  this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
  this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
  if (!this.title) {
    this.title = "Lambert Conformal Conic";
  }
}

// Lambert Conformal conic forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function forward(p) {

  var lon = p.x;
  var lat = p.y;

  // singular cases :
  if (Math.abs(2 * Math.abs(lat) - Math.PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]) {
    lat = Object(_common_sign__WEBPACK_IMPORTED_MODULE_2__["default"])(lat) * (_constants_values__WEBPACK_IMPORTED_MODULE_5__["HALF_PI"] - 2 * _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]);
  }

  var con = Math.abs(Math.abs(lat) - _constants_values__WEBPACK_IMPORTED_MODULE_5__["HALF_PI"]);
  var ts, rh1;
  if (con > _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]) {
    ts = Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_1__["default"])(this.e, lat, Math.sin(lat));
    rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
  }
  else {
    con = lat * this.ns;
    if (con <= 0) {
      return null;
    }
    rh1 = 0;
  }
  var theta = this.ns * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(lon - this.long0);
  p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
  p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

  return p;
}

// Lambert Conformal Conic inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function inverse(p) {

  var rh1, con, ts;
  var lat, lon;
  var x = (p.x - this.x0) / this.k0;
  var y = (this.rh - (p.y - this.y0) / this.k0);
  if (this.ns > 0) {
    rh1 = Math.sqrt(x * x + y * y);
    con = 1;
  }
  else {
    rh1 = -Math.sqrt(x * x + y * y);
    con = -1;
  }
  var theta = 0;
  if (rh1 !== 0) {
    theta = Math.atan2((con * x), (con * y));
  }
  if ((rh1 !== 0) || (this.ns > 0)) {
    con = 1 / this.ns;
    ts = Math.pow((rh1 / (this.a * this.f0)), con);
    lat = Object(_common_phi2z__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, ts);
    if (lat === -9999) {
      return null;
    }
  }
  else {
    lat = -_constants_values__WEBPACK_IMPORTED_MODULE_5__["HALF_PI"];
  }
  lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(theta / this.ns + this.long0);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = [
  "Lambert Tangential Conformal Conic Projection",
  "Lambert_Conformal_Conic",
  "Lambert_Conformal_Conic_1SP",
  "Lambert_Conformal_Conic_2SP",
  "lcc"
];

/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/longlat.js":
/*!*******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/longlat.js ***!
  \*******************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
function init() {
  //no-op for longlat
}

function identity(pt) {
  return pt;
}


var names = ["longlat", "identity"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: identity,
  inverse: identity,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/merc.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/merc.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");






function init() {
  var con = this.b / this.a;
  this.es = 1 - con * con;
  if(!('x0' in this)){
    this.x0 = 0;
  }
  if(!('y0' in this)){
    this.y0 = 0;
  }
  this.e = Math.sqrt(this.es);
  if (this.lat_ts) {
    if (this.sphere) {
      this.k0 = Math.cos(this.lat_ts);
    }
    else {
      this.k0 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
    }
  }
  else {
    if (!this.k0) {
      if (this.k) {
        this.k0 = this.k;
      }
      else {
        this.k0 = 1;
      }
    }
  }
}

/* Mercator forward equations--mapping lat,long to x,y
  --------------------------------------------------*/

function forward(p) {
  var lon = p.x;
  var lat = p.y;
  // convert to radians
  if (lat * _constants_values__WEBPACK_IMPORTED_MODULE_4__["R2D"] > 90 && lat * _constants_values__WEBPACK_IMPORTED_MODULE_4__["R2D"] < -90 && lon * _constants_values__WEBPACK_IMPORTED_MODULE_4__["R2D"] > 180 && lon * _constants_values__WEBPACK_IMPORTED_MODULE_4__["R2D"] < -180) {
    return null;
  }

  var x, y;
  if (Math.abs(Math.abs(lat) - _constants_values__WEBPACK_IMPORTED_MODULE_4__["HALF_PI"]) <= _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"]) {
    return null;
  }
  else {
    if (this.sphere) {
      x = this.x0 + this.a * this.k0 * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lon - this.long0);
      y = this.y0 + this.a * this.k0 * Math.log(Math.tan(_constants_values__WEBPACK_IMPORTED_MODULE_4__["FORTPI"] + 0.5 * lat));
    }
    else {
      var sinphi = Math.sin(lat);
      var ts = Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, lat, sinphi);
      x = this.x0 + this.a * this.k0 * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lon - this.long0);
      y = this.y0 - this.a * this.k0 * Math.log(ts);
    }
    p.x = x;
    p.y = y;
    return p;
  }
}

/* Mercator inverse equations--mapping x,y to lat/long
  --------------------------------------------------*/
function inverse(p) {

  var x = p.x - this.x0;
  var y = p.y - this.y0;
  var lon, lat;

  if (this.sphere) {
    lat = _constants_values__WEBPACK_IMPORTED_MODULE_4__["HALF_PI"] - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
  }
  else {
    var ts = Math.exp(-y / (this.a * this.k0));
    lat = Object(_common_phi2z__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, ts);
    if (lat === -9999) {
      return null;
    }
  }
  lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(this.long0 + x / (this.a * this.k0));

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/mill.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/mill.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");


/*
  reference
    "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
    The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
  */


/* Initialize the Miller Cylindrical projection
  -------------------------------------------*/
function init() {
  //no-op
}

/* Miller Cylindrical forward equations--mapping lat,long to x,y
    ------------------------------------------------------------*/
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      -----------------*/
  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  var x = this.x0 + this.a * dlon;
  var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

  p.x = x;
  p.y = y;
  return p;
}

/* Miller Cylindrical inverse equations--mapping x,y to lat/long
    ------------------------------------------------------------*/
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;

  var lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + p.x / this.a);
  var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["Miller_Cylindrical", "mill"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/moll.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/moll.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");

function init() {}

/* Mollweide forward equations--mapping lat,long to x,y
    ----------------------------------------------------*/
function forward(p) {

  /* Forward equations
      -----------------*/
  var lon = p.x;
  var lat = p.y;

  var delta_lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  var theta = lat;
  var con = Math.PI * Math.sin(lat);

  /* Iterate using the Newton-Raphson method to find theta
      -----------------------------------------------------*/
  while (true) {
    var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
    theta += delta_theta;
    if (Math.abs(delta_theta) < _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
      break;
    }
  }
  theta /= 2;

  /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
       this is done here because of precision problems with "cos(theta)"
       --------------------------------------------------------------------------*/
  if (Math.PI / 2 - Math.abs(lat) < _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
    delta_lon = 0;
  }
  var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
  var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var theta;
  var arg;

  /* Inverse equations
      -----------------*/
  p.x -= this.x0;
  p.y -= this.y0;
  arg = p.y / (1.4142135623731 * this.a);

  /* Because of division by zero problems, 'arg' can not be 1.  Therefore
       a number very close to one is used instead.
       -------------------------------------------------------------------*/
  if (Math.abs(arg) > 0.999999999999) {
    arg = 0.999999999999;
  }
  theta = Math.asin(arg);
  var lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
  if (lon < (-Math.PI)) {
    lon = -Math.PI;
  }
  if (lon > Math.PI) {
    lon = Math.PI;
  }
  arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
  if (Math.abs(arg) > 1) {
    arg = 1;
  }
  var lat = Math.asin(arg);

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["Mollweide", "moll"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/nzmg.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/nzmg.js ***!
  \****************************************************/
/*! exports provided: iterations, init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iterations", function() { return iterations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


/*
  reference
    Department of Land and Survey Technical Circular 1973/32
      http://www.linz.govt.nz/docs/miscellaneous/nz-map-definition.pdf
    OSG Technical Report 4.1
      http://www.linz.govt.nz/docs/miscellaneous/nzmg.pdf
  */

/**
 * iterations: Number of iterations to refine inverse transform.
 *     0 -> km accuracy
 *     1 -> m accuracy -- suitable for most mapping applications
 *     2 -> mm accuracy
 */
var iterations = 1;

function init() {
  this.A = [];
  this.A[1] = 0.6399175073;
  this.A[2] = -0.1358797613;
  this.A[3] = 0.063294409;
  this.A[4] = -0.02526853;
  this.A[5] = 0.0117879;
  this.A[6] = -0.0055161;
  this.A[7] = 0.0026906;
  this.A[8] = -0.001333;
  this.A[9] = 0.00067;
  this.A[10] = -0.00034;

  this.B_re = [];
  this.B_im = [];
  this.B_re[1] = 0.7557853228;
  this.B_im[1] = 0;
  this.B_re[2] = 0.249204646;
  this.B_im[2] = 0.003371507;
  this.B_re[3] = -0.001541739;
  this.B_im[3] = 0.041058560;
  this.B_re[4] = -0.10162907;
  this.B_im[4] = 0.01727609;
  this.B_re[5] = -0.26623489;
  this.B_im[5] = -0.36249218;
  this.B_re[6] = -0.6870983;
  this.B_im[6] = -1.1651967;

  this.C_re = [];
  this.C_im = [];
  this.C_re[1] = 1.3231270439;
  this.C_im[1] = 0;
  this.C_re[2] = -0.577245789;
  this.C_im[2] = -0.007809598;
  this.C_re[3] = 0.508307513;
  this.C_im[3] = -0.112208952;
  this.C_re[4] = -0.15094762;
  this.C_im[4] = 0.18200602;
  this.C_re[5] = 1.01418179;
  this.C_im[5] = 1.64497696;
  this.C_re[6] = 1.9660549;
  this.C_im[6] = 2.5127645;

  this.D = [];
  this.D[1] = 1.5627014243;
  this.D[2] = 0.5185406398;
  this.D[3] = -0.03333098;
  this.D[4] = -0.1052906;
  this.D[5] = -0.0368594;
  this.D[6] = 0.007317;
  this.D[7] = 0.01220;
  this.D[8] = 0.00394;
  this.D[9] = -0.0013;
}

/**
    New Zealand Map Grid Forward  - long/lat to x/y
    long/lat in radians
  */
function forward(p) {
  var n;
  var lon = p.x;
  var lat = p.y;

  var delta_lat = lat - this.lat0;
  var delta_lon = lon - this.long0;

  // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
  // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
  var d_phi = delta_lat / _constants_values__WEBPACK_IMPORTED_MODULE_0__["SEC_TO_RAD"] * 1E-5;
  var d_lambda = delta_lon;
  var d_phi_n = 1; // d_phi^0

  var d_psi = 0;
  for (n = 1; n <= 10; n++) {
    d_phi_n = d_phi_n * d_phi;
    d_psi = d_psi + this.A[n] * d_phi_n;
  }

  // 2. Calculate theta
  var th_re = d_psi;
  var th_im = d_lambda;

  // 3. Calculate z
  var th_n_re = 1;
  var th_n_im = 0; // theta^0
  var th_n_re1;
  var th_n_im1;

  var z_re = 0;
  var z_im = 0;
  for (n = 1; n <= 6; n++) {
    th_n_re1 = th_n_re * th_re - th_n_im * th_im;
    th_n_im1 = th_n_im * th_re + th_n_re * th_im;
    th_n_re = th_n_re1;
    th_n_im = th_n_im1;
    z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
    z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
  }

  // 4. Calculate easting and northing
  p.x = (z_im * this.a) + this.x0;
  p.y = (z_re * this.a) + this.y0;

  return p;
}

/**
    New Zealand Map Grid Inverse  -  x/y to long/lat
  */
function inverse(p) {
  var n;
  var x = p.x;
  var y = p.y;

  var delta_x = x - this.x0;
  var delta_y = y - this.y0;

  // 1. Calculate z
  var z_re = delta_y / this.a;
  var z_im = delta_x / this.a;

  // 2a. Calculate theta - first approximation gives km accuracy
  var z_n_re = 1;
  var z_n_im = 0; // z^0
  var z_n_re1;
  var z_n_im1;

  var th_re = 0;
  var th_im = 0;
  for (n = 1; n <= 6; n++) {
    z_n_re1 = z_n_re * z_re - z_n_im * z_im;
    z_n_im1 = z_n_im * z_re + z_n_re * z_im;
    z_n_re = z_n_re1;
    z_n_im = z_n_im1;
    th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
    th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
  }

  // 2b. Iterate to refine the accuracy of the calculation
  //        0 iterations gives km accuracy
  //        1 iteration gives m accuracy -- good enough for most mapping applications
  //        2 iterations bives mm accuracy
  for (var i = 0; i < this.iterations; i++) {
    var th_n_re = th_re;
    var th_n_im = th_im;
    var th_n_re1;
    var th_n_im1;

    var num_re = z_re;
    var num_im = z_im;
    for (n = 2; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
      num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
    }

    th_n_re = 1;
    th_n_im = 0;
    var den_re = this.B_re[1];
    var den_im = this.B_im[1];
    for (n = 2; n <= 6; n++) {
      th_n_re1 = th_n_re * th_re - th_n_im * th_im;
      th_n_im1 = th_n_im * th_re + th_n_re * th_im;
      th_n_re = th_n_re1;
      th_n_im = th_n_im1;
      den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
      den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
    }

    // Complex division
    var den2 = den_re * den_re + den_im * den_im;
    th_re = (num_re * den_re + num_im * den_im) / den2;
    th_im = (num_im * den_re - num_re * den_im) / den2;
  }

  // 3. Calculate d_phi              ...                                    // and d_lambda
  var d_psi = th_re;
  var d_lambda = th_im;
  var d_psi_n = 1; // d_psi^0

  var d_phi = 0;
  for (n = 1; n <= 9; n++) {
    d_psi_n = d_psi_n * d_psi;
    d_phi = d_phi + this.D[n] * d_psi_n;
  }

  // 4. Calculate latitude and longitude
  // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
  var lat = this.lat0 + (d_phi * _constants_values__WEBPACK_IMPORTED_MODULE_0__["SEC_TO_RAD"] * 1E5);
  var lon = this.long0 + d_lambda;

  p.x = lon;
  p.y = lat;

  return p;
}

var names = ["New_Zealand_Map_Grid", "nzmg"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/omerc.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/omerc.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");





var TOL = 1e-7;

function isTypeA(P) {
  var typeAProjections = ['Hotine_Oblique_Mercator','Hotine_Oblique_Mercator_Azimuth_Natural_Origin'];
  var projectionName = typeof P.PROJECTION === "object" ? Object.keys(P.PROJECTION)[0] : P.PROJECTION;
  
  return 'no_uoff' in P || 'no_off' in P || typeAProjections.indexOf(projectionName) !== -1;
}


/* Initialize the Oblique Mercator  projection
    ------------------------------------------*/
function init() {  
  var con, com, cosph0, D, F, H, L, sinph0, p, J, gamma = 0,
    gamma0, lamc = 0, lam1 = 0, lam2 = 0, phi1 = 0, phi2 = 0, alpha_c = 0, AB;
  
  // only Type A uses the no_off or no_uoff property
  // https://github.com/OSGeo/proj.4/issues/104
  this.no_off = isTypeA(this);
  this.no_rot = 'no_rot' in this;
  
  var alp = false;
  if ("alpha" in this) {
    alp = true;
  }

  var gam = false;
  if ("rectified_grid_angle" in this) {
    gam = true;
  }

  if (alp) {
    alpha_c = this.alpha;
  }
  
  if (gam) {
    gamma = (this.rectified_grid_angle * _constants_values__WEBPACK_IMPORTED_MODULE_3__["D2R"]);
  }
  
  if (alp || gam) {
    lamc = this.longc;
  } else {
    lam1 = this.long1;
    phi1 = this.lat1;
    lam2 = this.long2;
    phi2 = this.lat2;
    
    if (Math.abs(phi1 - phi2) <= TOL || (con = Math.abs(phi1)) <= TOL ||
        Math.abs(con - _constants_values__WEBPACK_IMPORTED_MODULE_3__["HALF_PI"]) <= TOL || Math.abs(Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_3__["HALF_PI"]) <= TOL ||
        Math.abs(Math.abs(phi2) - _constants_values__WEBPACK_IMPORTED_MODULE_3__["HALF_PI"]) <= TOL) {
      throw new Error();
    }
  }
  
  var one_es = 1.0 - this.es;
  com = Math.sqrt(one_es);
  
  if (Math.abs(this.lat0) > _constants_values__WEBPACK_IMPORTED_MODULE_3__["EPSLN"]) {
    sinph0 = Math.sin(this.lat0);
    cosph0 = Math.cos(this.lat0);
    con = 1 - this.es * sinph0 * sinph0;
    this.B = cosph0 * cosph0;
    this.B = Math.sqrt(1 + this.es * this.B * this.B / one_es);
    this.A = this.B * this.k0 * com / con;
    D = this.B * com / (cosph0 * Math.sqrt(con));
    F = D * D -1;
    
    if (F <= 0) {
      F = 0;
    } else {
      F = Math.sqrt(F);
      if (this.lat0 < 0) {
        F = -F;
      }
    }
    
    this.E = F += D;
    this.E *= Math.pow(Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, this.lat0, sinph0), this.B);
  } else {
    this.B = 1 / com;
    this.A = this.k0;
    this.E = D = F = 1;
  }
  
  if (alp || gam) {
    if (alp) {
      gamma0 = Math.asin(Math.sin(alpha_c) / D);
      if (!gam) {
        gamma = alpha_c;
      }
    } else {
      gamma0 = gamma;
      alpha_c = Math.asin(D * Math.sin(gamma0));
    }
    this.lam0 = lamc - Math.asin(0.5 * (F - 1 / F) * Math.tan(gamma0)) / this.B;
  } else {
    H = Math.pow(Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, phi1, Math.sin(phi1)), this.B);
    L = Math.pow(Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, phi2, Math.sin(phi2)), this.B);
    F = this.E / H;
    p = (L - H) / (L + H);
    J = this.E * this.E;
    J = (J - L * H) / (J + L * H);
    con = lam1 - lam2;
    
    if (con < -Math.pi) {
      lam2 -=_constants_values__WEBPACK_IMPORTED_MODULE_3__["TWO_PI"];
    } else if (con > Math.pi) {
      lam2 += _constants_values__WEBPACK_IMPORTED_MODULE_3__["TWO_PI"];
    }
    
    this.lam0 = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(0.5 * (lam1 + lam2) - Math.atan(J * Math.tan(0.5 * this.B * (lam1 - lam2)) / p) / this.B);
    gamma0 = Math.atan(2 * Math.sin(this.B * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(lam1 - this.lam0)) / (F - 1 / F));
    gamma = alpha_c = Math.asin(D * Math.sin(gamma0));
  }
  
  this.singam = Math.sin(gamma0);
  this.cosgam = Math.cos(gamma0);
  this.sinrot = Math.sin(gamma);
  this.cosrot = Math.cos(gamma);
  
  this.rB = 1 / this.B;
  this.ArB = this.A * this.rB;
  this.BrA = 1 / this.ArB;
  AB = this.A * this.B;
  
  if (this.no_off) {
    this.u_0 = 0;
  } else {
    this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(D * D - 1) / Math.cos(alpha_c)));
    
    if (this.lat0 < 0) {
      this.u_0 = - this.u_0;
    }  
  }
    
  F = 0.5 * gamma0;
  this.v_pole_n = this.ArB * Math.log(Math.tan(_constants_values__WEBPACK_IMPORTED_MODULE_3__["FORTPI"] - F));
  this.v_pole_s = this.ArB * Math.log(Math.tan(_constants_values__WEBPACK_IMPORTED_MODULE_3__["FORTPI"] + F));
}


/* Oblique Mercator forward equations--mapping lat,long to x,y
    ----------------------------------------------------------*/
function forward(p) {
  var coords = {};
  var S, T, U, V, W, temp, u, v;
  p.x = p.x - this.lam0;
  
  if (Math.abs(Math.abs(p.y) - _constants_values__WEBPACK_IMPORTED_MODULE_3__["HALF_PI"]) > _constants_values__WEBPACK_IMPORTED_MODULE_3__["EPSLN"]) {
    W = this.E / Math.pow(Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_0__["default"])(this.e, p.y, Math.sin(p.y)), this.B);
    
    temp = 1 / W;
    S = 0.5 * (W - temp);
    T = 0.5 * (W + temp);
    V = Math.sin(this.B * p.x);
    U = (S * this.singam - V * this.cosgam) / T;
        
    if (Math.abs(Math.abs(U) - 1.0) < _constants_values__WEBPACK_IMPORTED_MODULE_3__["EPSLN"]) {
      throw new Error();
    }
    
    v = 0.5 * this.ArB * Math.log((1 - U)/(1 + U));
    temp = Math.cos(this.B * p.x);
    
    if (Math.abs(temp) < TOL) {
      u = this.A * p.x;
    } else {
      u = this.ArB * Math.atan2((S * this.cosgam + V * this.singam), temp);
    }    
  } else {
    v = p.y > 0 ? this.v_pole_n : this.v_pole_s;
    u = this.ArB * p.y;
  }
     
  if (this.no_rot) {
    coords.x = u;
    coords.y = v;
  } else {
    u -= this.u_0;
    coords.x = v * this.cosrot + u * this.sinrot;
    coords.y = u * this.cosrot - v * this.sinrot;
  }
  
  coords.x = (this.a * coords.x + this.x0);
  coords.y = (this.a * coords.y + this.y0);
  
  return coords;
}

function inverse(p) {
  var u, v, Qp, Sp, Tp, Vp, Up;
  var coords = {};
  
  p.x = (p.x - this.x0) * (1.0 / this.a);
  p.y = (p.y - this.y0) * (1.0 / this.a);

  if (this.no_rot) {
    v = p.y;
    u = p.x;
  } else {
    v = p.x * this.cosrot - p.y * this.sinrot;
    u = p.y * this.cosrot + p.x * this.sinrot + this.u_0;
  }
  
  Qp = Math.exp(-this.BrA * v);
  Sp = 0.5 * (Qp - 1 / Qp);
  Tp = 0.5 * (Qp + 1 / Qp);
  Vp = Math.sin(this.BrA * u);
  Up = (Vp * this.cosgam + Sp * this.singam) / Tp;
  
  if (Math.abs(Math.abs(Up) - 1) < _constants_values__WEBPACK_IMPORTED_MODULE_3__["EPSLN"]) {
    coords.x = 0;
    coords.y = Up < 0 ? -_constants_values__WEBPACK_IMPORTED_MODULE_3__["HALF_PI"] : _constants_values__WEBPACK_IMPORTED_MODULE_3__["HALF_PI"];
  } else {
    coords.y = this.E / Math.sqrt((1 + Up) / (1 - Up));
    coords.y = Object(_common_phi2z__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, Math.pow(coords.y, 1 / this.B));
    
    if (coords.y === Infinity) {
      throw new Error();
    }
        
    coords.x = -this.rB * Math.atan2((Sp * this.cosgam - Vp * this.singam), Math.cos(this.BrA * u));
  }
  
  coords.x += this.lam0;
  
  return coords;
}

var names = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/ortho.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/ortho.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");




function init() {
  //double temp;      /* temporary variable    */

  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  this.sin_p14 = Math.sin(this.lat0);
  this.cos_p14 = Math.cos(this.lat0);
}

/* Orthographic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
function forward(p) {
  var sinphi, cosphi; /* sin and cos value        */
  var dlon; /* delta longitude value      */
  var coslon; /* cos of longitude        */
  var ksp; /* scale factor          */
  var g, x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
      -----------------*/
  dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);

  sinphi = Math.sin(lat);
  cosphi = Math.cos(lat);

  coslon = Math.cos(dlon);
  g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
  ksp = 1;
  if ((g > 0) || (Math.abs(g) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__["EPSLN"])) {
    x = this.a * ksp * cosphi * Math.sin(dlon);
    y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
  }
  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var rh; /* height above ellipsoid      */
  var z; /* angle          */
  var sinz, cosz; /* sin of z and cos of z      */
  var con;
  var lon, lat;
  /* Inverse equations
      -----------------*/
  p.x -= this.x0;
  p.y -= this.y0;
  rh = Math.sqrt(p.x * p.x + p.y * p.y);
  z = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_1__["default"])(rh / this.a);

  sinz = Math.sin(z);
  cosz = Math.cos(z);

  lon = this.long0;
  if (Math.abs(rh) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__["EPSLN"]) {
    lat = this.lat0;
    p.x = lon;
    p.y = lat;
    return p;
  }
  lat = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_1__["default"])(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
  con = Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_2__["HALF_PI"];
  if (Math.abs(con) <= _constants_values__WEBPACK_IMPORTED_MODULE_2__["EPSLN"]) {
    if (this.lat0 >= 0) {
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2(p.x, - p.y));
    }
    else {
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 - Math.atan2(-p.x, p.y));
    }
    p.x = lon;
    p.y = lat;
    return p;
  }
  lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.atan2((p.x * sinz), rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz));
  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["ortho"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/poly.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/poly.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_e0fn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/e0fn */ "./node_modules/proj4/lib/common/e0fn.js");
/* harmony import */ var _common_e1fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/e1fn */ "./node_modules/proj4/lib/common/e1fn.js");
/* harmony import */ var _common_e2fn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/e2fn */ "./node_modules/proj4/lib/common/e2fn.js");
/* harmony import */ var _common_e3fn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/e3fn */ "./node_modules/proj4/lib/common/e3fn.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_mlfn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/mlfn */ "./node_modules/proj4/lib/common/mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_gN__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/gN */ "./node_modules/proj4/lib/common/gN.js");










var MAX_ITER = 20;

function init() {
  /* Place parameters in static storage for common use
      -------------------------------------------------*/
  this.temp = this.b / this.a;
  this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
  this.e = Math.sqrt(this.es);
  this.e0 = Object(_common_e0fn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.es);
  this.e1 = Object(_common_e1fn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.es);
  this.e2 = Object(_common_e2fn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
  this.e3 = Object(_common_e3fn__WEBPACK_IMPORTED_MODULE_3__["default"])(this.es);
  this.ml0 = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
}

/* Polyconic forward equations--mapping lat,long to x,y
    ---------------------------------------------------*/
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var x, y, el;
  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(lon - this.long0);
  el = dlon * Math.sin(lat);
  if (this.sphere) {
    if (Math.abs(lat) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__["EPSLN"]) {
      x = this.a * dlon;
      y = -1 * this.a * this.lat0;
    }
    else {
      x = this.a * Math.sin(el) / Math.tan(lat);
      y = this.a * (Object(_common_adjust_lat__WEBPACK_IMPORTED_MODULE_5__["default"])(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
    }
  }
  else {
    if (Math.abs(lat) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__["EPSLN"]) {
      x = this.a * dlon;
      y = -1 * this.ml0;
    }
    else {
      var nl = Object(_common_gN__WEBPACK_IMPORTED_MODULE_8__["default"])(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
      x = nl * Math.sin(el);
      y = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
    }

  }
  p.x = x + this.x0;
  p.y = y + this.y0;
  return p;
}

/* Inverse equations
  -----------------*/
function inverse(p) {
  var lon, lat, x, y, i;
  var al, bl;
  var phi, dphi;
  x = p.x - this.x0;
  y = p.y - this.y0;

  if (this.sphere) {
    if (Math.abs(y + this.a * this.lat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__["EPSLN"]) {
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(x / this.a + this.long0);
      lat = 0;
    }
    else {
      al = this.lat0 + y / this.a;
      bl = x * x / this.a / this.a + al * al;
      phi = al;
      var tanphi;
      for (i = MAX_ITER; i; --i) {
        tanphi = Math.tan(phi);
        dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
        phi += dphi;
        if (Math.abs(dphi) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__["EPSLN"]) {
          lat = phi;
          break;
        }
      }
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
    }
  }
  else {
    if (Math.abs(y + this.ml0) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__["EPSLN"]) {
      lat = 0;
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(this.long0 + x / this.a);
    }
    else {

      al = (this.ml0 + y) / this.a;
      bl = x * x / this.a / this.a + al * al;
      phi = al;
      var cl, mln, mlnp, ma;
      var con;
      for (i = MAX_ITER; i; --i) {
        con = this.e * Math.sin(phi);
        cl = Math.sqrt(1 - con * con) * Math.tan(phi);
        mln = this.a * Object(_common_mlfn__WEBPACK_IMPORTED_MODULE_6__["default"])(this.e0, this.e1, this.e2, this.e3, phi);
        mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
        ma = mln / this.a;
        dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
        phi -= dphi;
        if (Math.abs(dphi) <= _constants_values__WEBPACK_IMPORTED_MODULE_7__["EPSLN"]) {
          lat = phi;
          break;
        }
      }

      //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
      cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_4__["default"])(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
    }
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["Polyconic", "poly"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/qsc.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/qsc.js ***!
  \***************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
// QSC projection rewritten from the original PROJ4
// https://github.com/OSGeo/proj.4/blob/master/src/PJ_qsc.c



/* constants */
var FACE_ENUM = {
    FRONT: 1,
    RIGHT: 2,
    BACK: 3,
    LEFT: 4,
    TOP: 5,
    BOTTOM: 6
};

var AREA_ENUM = {
    AREA_0: 1,
    AREA_1: 2,
    AREA_2: 3,
    AREA_3: 4
};

function init() {

  this.x0 = this.x0 || 0;
  this.y0 = this.y0 || 0;
  this.lat0 = this.lat0 || 0;
  this.long0 = this.long0 || 0;
  this.lat_ts = this.lat_ts || 0;
  this.title = this.title || "Quadrilateralized Spherical Cube";

  /* Determine the cube face from the center of projection. */
  if (this.lat0 >= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] / 2.0) {
    this.face = FACE_ENUM.TOP;
  } else if (this.lat0 <= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] / 2.0)) {
    this.face = FACE_ENUM.BOTTOM;
  } else if (Math.abs(this.long0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
    this.face = FACE_ENUM.FRONT;
  } else if (Math.abs(this.long0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
    this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
  } else {
    this.face = FACE_ENUM.BACK;
  }

  /* Fill in useful values for the ellipsoid <-> sphere shift
   * described in [LK12]. */
  if (this.es !== 0) {
    this.one_minus_f = 1 - (this.a - this.b) / this.a;
    this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
  }
}

// QSC forward equations--mapping lat,long to x,y
// -----------------------------------------------------------------
function forward(p) {
  var xy = {x: 0, y: 0};
  var lat, lon;
  var theta, phi;
  var t, mu;
  /* nu; */
  var area = {value: 0};

  // move lon according to projection's lon
  p.x -= this.long0;

  /* Convert the geodetic latitude to a geocentric latitude.
   * This corresponds to the shift from the ellipsoid to the sphere
   * described in [LK12]. */
  if (this.es !== 0) {//if (P->es != 0) {
    lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
  } else {
    lat = p.y;
  }

  /* Convert the input lat, lon into theta, phi as used by QSC.
   * This depends on the cube face and the area on it.
   * For the top and bottom face, we can compute theta and phi
   * directly from phi, lam. For the other faces, we must use
   * unit sphere cartesian coordinates as an intermediate step. */
  lon = p.x; //lon = lp.lam;
  if (this.face === FACE_ENUM.TOP) {
    phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - lat;
    if (lon >= _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] && lon <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
      area.value = AREA_ENUM.AREA_0;
      theta = lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else if (lon > _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] || lon <= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"])) {
      area.value = AREA_ENUM.AREA_1;
      theta = (lon > 0.0 ? lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] : lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    } else if (lon > -(_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) && lon <= -_constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
      area.value = AREA_ENUM.AREA_2;
      theta = lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else {
      area.value = AREA_ENUM.AREA_3;
      theta = lon;
    }
  } else if (this.face === FACE_ENUM.BOTTOM) {
    phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + lat;
    if (lon >= _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] && lon <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
      area.value = AREA_ENUM.AREA_0;
      theta = -lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else if (lon < _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] && lon >= -_constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
      area.value = AREA_ENUM.AREA_1;
      theta = -lon;
    } else if (lon < -_constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] && lon >= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"])) {
      area.value = AREA_ENUM.AREA_2;
      theta = -lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else {
      area.value = AREA_ENUM.AREA_3;
      theta = (lon > 0.0 ? -lon + _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] : -lon - _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    }
  } else {
    var q, r, s;
    var sinlat, coslat;
    var sinlon, coslon;

    if (this.face === FACE_ENUM.RIGHT) {
      lon = qsc_shift_lon_origin(lon, +_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]);
    } else if (this.face === FACE_ENUM.BACK) {
      lon = qsc_shift_lon_origin(lon, +_constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    } else if (this.face === FACE_ENUM.LEFT) {
      lon = qsc_shift_lon_origin(lon, -_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]);
    }
    sinlat = Math.sin(lat);
    coslat = Math.cos(lat);
    sinlon = Math.sin(lon);
    coslon = Math.cos(lon);
    q = coslat * coslon;
    r = coslat * sinlon;
    s = sinlat;

    if (this.face === FACE_ENUM.FRONT) {
      phi = Math.acos(q);
      theta = qsc_fwd_equat_face_theta(phi, s, r, area);
    } else if (this.face === FACE_ENUM.RIGHT) {
      phi = Math.acos(r);
      theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
    } else if (this.face === FACE_ENUM.BACK) {
      phi = Math.acos(-q);
      theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
    } else if (this.face === FACE_ENUM.LEFT) {
      phi = Math.acos(-r);
      theta = qsc_fwd_equat_face_theta(phi, s, q, area);
    } else {
      /* Impossible */
      phi = theta = 0;
      area.value = AREA_ENUM.AREA_0;
    }
  }

  /* Compute mu and nu for the area of definition.
   * For mu, see Eq. (3-21) in [OL76], but note the typos:
   * compare with Eq. (3-14). For nu, see Eq. (3-38). */
  mu = Math.atan((12 / _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]) * (theta + Math.acos(Math.sin(theta) * Math.cos(_constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"])) - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]));
  t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));

  /* Apply the result to the real area. */
  if (area.value === AREA_ENUM.AREA_1) {
    mu += _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
  } else if (area.value === AREA_ENUM.AREA_2) {
    mu += _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"];
  } else if (area.value === AREA_ENUM.AREA_3) {
    mu += 1.5 * _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"];
  }

  /* Now compute x, y from mu and nu */
  xy.x = t * Math.cos(mu);
  xy.y = t * Math.sin(mu);
  xy.x = xy.x * this.a + this.x0;
  xy.y = xy.y * this.a + this.y0;

  p.x = xy.x;
  p.y = xy.y;
  return p;
}

// QSC inverse equations--mapping x,y to lat/long
// -----------------------------------------------------------------
function inverse(p) {
  var lp = {lam: 0, phi: 0};
  var mu, nu, cosmu, tannu;
  var tantheta, theta, cosphi, phi;
  var t;
  var area = {value: 0};

  /* de-offset */
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  /* Convert the input x, y to the mu and nu angles as used by QSC.
   * This depends on the area of the cube face. */
  nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
  mu = Math.atan2(p.y, p.x);
  if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
    area.value = AREA_ENUM.AREA_0;
  } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
    area.value = AREA_ENUM.AREA_1;
    mu -= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
  } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
    area.value = AREA_ENUM.AREA_2;
    mu = (mu < 0.0 ? mu + _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] : mu - _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
  } else {
    area.value = AREA_ENUM.AREA_3;
    mu += _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
  }

  /* Compute phi and theta for the area of definition.
   * The inverse projection is not described in the original paper, but some
   * good hints can be found here (as of 2011-12-14):
   * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
   * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */
  t = (_constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] / 12) * Math.tan(mu);
  tantheta = Math.sin(t) / (Math.cos(t) - (1 / Math.sqrt(2)));
  theta = Math.atan(tantheta);
  cosmu = Math.cos(mu);
  tannu = Math.tan(nu);
  cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));
  if (cosphi < -1) {
    cosphi = -1;
  } else if (cosphi > +1) {
    cosphi = +1;
  }

  /* Apply the result to the real area on the cube face.
   * For the top and bottom face, we can compute phi and lam directly.
   * For the other faces, we must use unit sphere cartesian coordinates
   * as an intermediate step. */
  if (this.face === FACE_ENUM.TOP) {
    phi = Math.acos(cosphi);
    lp.phi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] - phi;
    if (area.value === AREA_ENUM.AREA_0) {
      lp.lam = theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else if (area.value === AREA_ENUM.AREA_1) {
      lp.lam = (theta < 0.0 ? theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] : theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    } else if (area.value === AREA_ENUM.AREA_2) {
      lp.lam = theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else /* area.value == AREA_ENUM.AREA_3 */ {
      lp.lam = theta;
    }
  } else if (this.face === FACE_ENUM.BOTTOM) {
    phi = Math.acos(cosphi);
    lp.phi = phi - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    if (area.value === AREA_ENUM.AREA_0) {
      lp.lam = -theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else if (area.value === AREA_ENUM.AREA_1) {
      lp.lam = -theta;
    } else if (area.value === AREA_ENUM.AREA_2) {
      lp.lam = -theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else /* area.value == AREA_ENUM.AREA_3 */ {
      lp.lam = (theta < 0.0 ? -theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] : -theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    }
  } else {
    /* Compute phi and lam via cartesian unit sphere coordinates. */
    var q, r, s;
    q = cosphi;
    t = q * q;
    if (t >= 1) {
      s = 0;
    } else {
      s = Math.sqrt(1 - t) * Math.sin(theta);
    }
    t += s * s;
    if (t >= 1) {
      r = 0;
    } else {
      r = Math.sqrt(1 - t);
    }
    /* Rotate q,r,s into the correct area. */
    if (area.value === AREA_ENUM.AREA_1) {
      t = r;
      r = -s;
      s = t;
    } else if (area.value === AREA_ENUM.AREA_2) {
      r = -r;
      s = -s;
    } else if (area.value === AREA_ENUM.AREA_3) {
      t = r;
      r = s;
      s = -t;
    }
    /* Rotate q,r,s into the correct cube face. */
    if (this.face === FACE_ENUM.RIGHT) {
      t = q;
      q = -r;
      r = t;
    } else if (this.face === FACE_ENUM.BACK) {
      q = -q;
      r = -r;
    } else if (this.face === FACE_ENUM.LEFT) {
      t = q;
      q = r;
      r = -t;
    }
    /* Now compute phi and lam from the unit sphere coordinates. */
    lp.phi = Math.acos(-s) - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    lp.lam = Math.atan2(r, q);
    if (this.face === FACE_ENUM.RIGHT) {
      lp.lam = qsc_shift_lon_origin(lp.lam, -_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]);
    } else if (this.face === FACE_ENUM.BACK) {
      lp.lam = qsc_shift_lon_origin(lp.lam, -_constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    } else if (this.face === FACE_ENUM.LEFT) {
      lp.lam = qsc_shift_lon_origin(lp.lam, +_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"]);
    }
  }

  /* Apply the shift from the sphere to the ellipsoid as described
   * in [LK12]. */
  if (this.es !== 0) {
    var invert_sign;
    var tanphi, xa;
    invert_sign = (lp.phi < 0 ? 1 : 0);
    tanphi = Math.tan(lp.phi);
    xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
    lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));
    if (invert_sign) {
      lp.phi = -lp.phi;
    }
  }

  lp.lam += this.long0;
  p.x = lp.lam;
  p.y = lp.phi;
  return p;
}

/* Helper function for forward projection: compute the theta angle
 * and determine the area number. */
function qsc_fwd_equat_face_theta(phi, y, x, area) {
  var theta;
  if (phi < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    area.value = AREA_ENUM.AREA_0;
    theta = 0.0;
  } else {
    theta = Math.atan2(y, x);
    if (Math.abs(theta) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
      area.value = AREA_ENUM.AREA_0;
    } else if (theta > _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] && theta <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"]) {
      area.value = AREA_ENUM.AREA_1;
      theta -= _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else if (theta > _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"] || theta <= -(_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + _constants_values__WEBPACK_IMPORTED_MODULE_0__["FORTPI"])) {
      area.value = AREA_ENUM.AREA_2;
      theta = (theta >= 0.0 ? theta - _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"] : theta + _constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]);
    } else {
      area.value = AREA_ENUM.AREA_3;
      theta += _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    }
  }
  return theta;
}

/* Helper function: shift the longitude. */
function qsc_shift_lon_origin(lon, offset) {
  var slon = lon + offset;
  if (slon < -_constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]) {
    slon += _constants_values__WEBPACK_IMPORTED_MODULE_0__["TWO_PI"];
  } else if (slon > +_constants_values__WEBPACK_IMPORTED_MODULE_0__["SPI"]) {
    slon -= _constants_values__WEBPACK_IMPORTED_MODULE_0__["TWO_PI"];
  }
  return slon;
}

var names = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});



/***/ }),

/***/ "./node_modules/proj4/lib/projections/robin.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/robin.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
// Robinson projection
// Based on https://github.com/OSGeo/proj.4/blob/master/src/PJ_robin.c
// Polynomial coeficients from http://article.gmane.org/gmane.comp.gis.proj-4.devel/6039




var COEFS_X = [
    [1.0000, 2.2199e-17, -7.15515e-05, 3.1103e-06],
    [0.9986, -0.000482243, -2.4897e-05, -1.3309e-06],
    [0.9954, -0.00083103, -4.48605e-05, -9.86701e-07],
    [0.9900, -0.00135364, -5.9661e-05, 3.6777e-06],
    [0.9822, -0.00167442, -4.49547e-06, -5.72411e-06],
    [0.9730, -0.00214868, -9.03571e-05, 1.8736e-08],
    [0.9600, -0.00305085, -9.00761e-05, 1.64917e-06],
    [0.9427, -0.00382792, -6.53386e-05, -2.6154e-06],
    [0.9216, -0.00467746, -0.00010457, 4.81243e-06],
    [0.8962, -0.00536223, -3.23831e-05, -5.43432e-06],
    [0.8679, -0.00609363, -0.000113898, 3.32484e-06],
    [0.8350, -0.00698325, -6.40253e-05, 9.34959e-07],
    [0.7986, -0.00755338, -5.00009e-05, 9.35324e-07],
    [0.7597, -0.00798324, -3.5971e-05, -2.27626e-06],
    [0.7186, -0.00851367, -7.01149e-05, -8.6303e-06],
    [0.6732, -0.00986209, -0.000199569, 1.91974e-05],
    [0.6213, -0.010418, 8.83923e-05, 6.24051e-06],
    [0.5722, -0.00906601, 0.000182, 6.24051e-06],
    [0.5322, -0.00677797, 0.000275608, 6.24051e-06]
];

var COEFS_Y = [
    [-5.20417e-18, 0.0124, 1.21431e-18, -8.45284e-11],
    [0.0620, 0.0124, -1.26793e-09, 4.22642e-10],
    [0.1240, 0.0124, 5.07171e-09, -1.60604e-09],
    [0.1860, 0.0123999, -1.90189e-08, 6.00152e-09],
    [0.2480, 0.0124002, 7.10039e-08, -2.24e-08],
    [0.3100, 0.0123992, -2.64997e-07, 8.35986e-08],
    [0.3720, 0.0124029, 9.88983e-07, -3.11994e-07],
    [0.4340, 0.0123893, -3.69093e-06, -4.35621e-07],
    [0.4958, 0.0123198, -1.02252e-05, -3.45523e-07],
    [0.5571, 0.0121916, -1.54081e-05, -5.82288e-07],
    [0.6176, 0.0119938, -2.41424e-05, -5.25327e-07],
    [0.6769, 0.011713, -3.20223e-05, -5.16405e-07],
    [0.7346, 0.0113541, -3.97684e-05, -6.09052e-07],
    [0.7903, 0.0109107, -4.89042e-05, -1.04739e-06],
    [0.8435, 0.0103431, -6.4615e-05, -1.40374e-09],
    [0.8936, 0.00969686, -6.4636e-05, -8.547e-06],
    [0.9394, 0.00840947, -0.000192841, -4.2106e-06],
    [0.9761, 0.00616527, -0.000256, -4.2106e-06],
    [1.0000, 0.00328947, -0.000319159, -4.2106e-06]
];

var FXC = 0.8487;
var FYC = 1.3523;
var C1 = _constants_values__WEBPACK_IMPORTED_MODULE_0__["R2D"]/5; // rad to 5-degree interval
var RC1 = 1/C1;
var NODES = 18;

var poly3_val = function(coefs, x) {
    return coefs[0] + x * (coefs[1] + x * (coefs[2] + x * coefs[3]));
};

var poly3_der = function(coefs, x) {
    return coefs[1] + x * (2 * coefs[2] + x * 3 * coefs[3]);
};

function newton_rapshon(f_df, start, max_err, iters) {
    var x = start;
    for (; iters; --iters) {
        var upd = f_df(x);
        x -= upd;
        if (Math.abs(upd) < max_err) {
            break;
        }
    }
    return x;
}

function init() {
    this.x0 = this.x0 || 0;
    this.y0 = this.y0 || 0;
    this.long0 = this.long0 || 0;
    this.es = 0;
    this.title = this.title || "Robinson";
}

function forward(ll) {
    var lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(ll.x - this.long0);

    var dphi = Math.abs(ll.y);
    var i = Math.floor(dphi * C1);
    if (i < 0) {
        i = 0;
    } else if (i >= NODES) {
        i = NODES - 1;
    }
    dphi = _constants_values__WEBPACK_IMPORTED_MODULE_0__["R2D"] * (dphi - RC1 * i);
    var xy = {
        x: poly3_val(COEFS_X[i], dphi) * lon,
        y: poly3_val(COEFS_Y[i], dphi)
    };
    if (ll.y < 0) {
        xy.y = -xy.y;
    }

    xy.x = xy.x * this.a * FXC + this.x0;
    xy.y = xy.y * this.a * FYC + this.y0;
    return xy;
}

function inverse(xy) {
    var ll = {
        x: (xy.x - this.x0) / (this.a * FXC),
        y: Math.abs(xy.y - this.y0) / (this.a * FYC)
    };

    if (ll.y >= 1) { // pathologic case
        ll.x /= COEFS_X[NODES][0];
        ll.y = xy.y < 0 ? -_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] : _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    } else {
        // find table interval
        var i = Math.floor(ll.y * NODES);
        if (i < 0) {
            i = 0;
        } else if (i >= NODES) {
            i = NODES - 1;
        }
        for (;;) {
            if (COEFS_Y[i][0] > ll.y) {
                --i;
            } else if (COEFS_Y[i+1][0] <= ll.y) {
                ++i;
            } else {
                break;
            }
        }
        // linear interpolation in 5 degree interval
        var coefs = COEFS_Y[i];
        var t = 5 * (ll.y - coefs[0]) / (COEFS_Y[i+1][0] - coefs[0]);
        // find t so that poly3_val(coefs, t) = ll.y
        t = newton_rapshon(function(x) {
            return (poly3_val(coefs, x) - ll.y) / poly3_der(coefs, x);
        }, t, _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"], 100);

        ll.x /= poly3_val(COEFS_X[i], t);
        ll.y = (5 * i + t) * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
        if (xy.y < 0) {
            ll.y = -ll.y;
        }
    }

    ll.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(ll.x + this.long0);
    return ll;
}

var names = ["Robinson", "robin"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/sinu.js":
/*!****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/sinu.js ***!
  \****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lat */ "./node_modules/proj4/lib/common/adjust_lat.js");
/* harmony import */ var _common_pj_enfn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/pj_enfn */ "./node_modules/proj4/lib/common/pj_enfn.js");
/* harmony import */ var _common_pj_mlfn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/pj_inv_mlfn */ "./node_modules/proj4/lib/common/pj_inv_mlfn.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");



var MAX_ITER = 20;







function init() {
  /* Place parameters in static storage for common use
    -------------------------------------------------*/


  if (!this.sphere) {
    this.en = Object(_common_pj_enfn__WEBPACK_IMPORTED_MODULE_2__["default"])(this.es);
  }
  else {
    this.n = 1;
    this.m = 0;
    this.es = 0;
    this.C_y = Math.sqrt((this.m + 1) / this.n);
    this.C_x = this.C_y / (this.m + 1);
  }

}

/* Sinusoidal forward equations--mapping lat,long to x,y
  -----------------------------------------------------*/
function forward(p) {
  var x, y;
  var lon = p.x;
  var lat = p.y;
  /* Forward equations
    -----------------*/
  lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);

  if (this.sphere) {
    if (!this.m) {
      lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
    }
    else {
      var k = this.n * Math.sin(lat);
      for (var i = MAX_ITER; i; --i) {
        var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
        lat -= V;
        if (Math.abs(V) < _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]) {
          break;
        }
      }
    }
    x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
    y = this.a * this.C_y * lat;

  }
  else {

    var s = Math.sin(lat);
    var c = Math.cos(lat);
    y = this.a * Object(_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_3__["default"])(lat, s, c, this.en);
    x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
  }

  p.x = x;
  p.y = y;
  return p;
}

function inverse(p) {
  var lat, temp, lon, s;

  p.x -= this.x0;
  lon = p.x / this.a;
  p.y -= this.y0;
  lat = p.y / this.a;

  if (this.sphere) {
    lat /= this.C_y;
    lon = lon / (this.C_x * (this.m + Math.cos(lat)));
    if (this.m) {
      lat = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_6__["default"])((this.m * lat + Math.sin(lat)) / this.n);
    }
    else if (this.n !== 1) {
      lat = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_6__["default"])(Math.sin(lat) / this.n);
    }
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon + this.long0);
    lat = Object(_common_adjust_lat__WEBPACK_IMPORTED_MODULE_1__["default"])(lat);
  }
  else {
    lat = Object(_common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_4__["default"])(p.y / this.a, this.es, this.en);
    s = Math.abs(lat);
    if (s < _constants_values__WEBPACK_IMPORTED_MODULE_5__["HALF_PI"]) {
      s = Math.sin(lat);
      temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
      //temp = this.long0 + p.x / (this.a * Math.cos(lat));
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(temp);
    }
    else if ((s - _constants_values__WEBPACK_IMPORTED_MODULE_5__["EPSLN"]) < _constants_values__WEBPACK_IMPORTED_MODULE_5__["HALF_PI"]) {
      lon = this.long0;
    }
  }
  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["Sinusoidal", "sinu"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/somerc.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/somerc.js ***!
  \******************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/*
  references:
    Formules et constantes pour le Calcul pour la
    projection cylindrique conforme à axe oblique et pour la transformation entre
    des systèmes de référence.
    http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
  */

function init() {
  var phy0 = this.lat0;
  this.lambda0 = this.long0;
  var sinPhy0 = Math.sin(phy0);
  var semiMajorAxis = this.a;
  var invF = this.rf;
  var flattening = 1 / invF;
  var e2 = 2 * flattening - Math.pow(flattening, 2);
  var e = this.e = Math.sqrt(e2);
  this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
  this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
  this.b0 = Math.asin(sinPhy0 / this.alpha);
  var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
  var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
  var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
  this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
}

function forward(p) {
  var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
  var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
  var S = -this.alpha * (Sa1 + Sa2) + this.K;

  // spheric latitude
  var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

  // spheric longitude
  var I = this.alpha * (p.x - this.lambda0);

  // psoeudo equatorial rotation
  var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

  var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

  p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
  p.x = this.R * rotI + this.x0;
  return p;
}

function inverse(p) {
  var Y = p.x - this.x0;
  var X = p.y - this.y0;

  var rotI = Y / this.R;
  var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

  var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
  var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

  var lambda = this.lambda0 + I / this.alpha;

  var S = 0;
  var phy = b;
  var prevPhy = -1000;
  var iteration = 0;
  while (Math.abs(phy - prevPhy) > 0.0000001) {
    if (++iteration > 20) {
      //...reportError("omercFwdInfinity");
      return;
    }
    //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
    S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
    prevPhy = phy;
    phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
  }

  p.x = lambda;
  p.y = phy;
  return p;
}

var names = ["somerc"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/stere.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/stere.js ***!
  \*****************************************************/
/*! exports provided: ssfn_, init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ssfn_", function() { return ssfn_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_sign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/sign */ "./node_modules/proj4/lib/common/sign.js");
/* harmony import */ var _common_msfnz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/msfnz */ "./node_modules/proj4/lib/common/msfnz.js");
/* harmony import */ var _common_tsfnz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/tsfnz */ "./node_modules/proj4/lib/common/tsfnz.js");
/* harmony import */ var _common_phi2z__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/phi2z */ "./node_modules/proj4/lib/common/phi2z.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");








function ssfn_(phit, sinphi, eccen) {
  sinphi *= eccen;
  return (Math.tan(0.5 * (_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
}

function init() {
  this.coslat0 = Math.cos(this.lat0);
  this.sinlat0 = Math.sin(this.lat0);
  if (this.sphere) {
    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      this.k0 = 0.5 * (1 + Object(_common_sign__WEBPACK_IMPORTED_MODULE_1__["default"])(this.lat0) * Math.sin(this.lat_ts));
    }
  }
  else {
    if (Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      if (this.lat0 > 0) {
        //North pole
        //trace('stere:north pole');
        this.con = 1;
      }
      else {
        //South pole
        //trace('stere:south pole');
        this.con = -1;
      }
    }
    this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
    if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      this.k0 = 0.5 * this.cons * Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
    }
    this.ms1 = Object(_common_msfnz__WEBPACK_IMPORTED_MODULE_2__["default"])(this.e, this.sinlat0, this.coslat0);
    this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    this.cosX0 = Math.cos(this.X0);
    this.sinX0 = Math.sin(this.X0);
  }
}

// Stereographic forward equations--mapping lat,long to x,y
function forward(p) {
  var lon = p.x;
  var lat = p.y;
  var sinlat = Math.sin(lat);
  var coslat = Math.cos(lat);
  var A, X, sinX, cosX, ts, rh;
  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(lon - this.long0);

  if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"] && Math.abs(lat + this.lat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    //case of the origine point
    //trace('stere:this is the origin point');
    p.x = NaN;
    p.y = NaN;
    return p;
  }
  if (this.sphere) {
    //trace('stere:sphere case');
    A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
    p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
    p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
    return p;
  }
  else {
    X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"];
    cosX = Math.cos(X);
    sinX = Math.sin(X);
    if (Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      ts = Object(_common_tsfnz__WEBPACK_IMPORTED_MODULE_3__["default"])(this.e, lat * this.con, this.con * sinlat);
      rh = 2 * this.a * this.k0 * ts / this.cons;
      p.x = this.x0 + rh * Math.sin(lon - this.long0);
      p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
      //trace(p.toString());
      return p;
    }
    else if (Math.abs(this.sinlat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      //Eq
      //trace('stere:equateur');
      A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
      p.y = A * sinX;
    }
    else {
      //other case
      //trace('stere:normal case');
      A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
      p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
    }
    p.x = A * cosX * Math.sin(dlon) + this.x0;
  }
  //trace(p.toString());
  return p;
}

//* Stereographic inverse equations--mapping x,y to lat/long
function inverse(p) {
  p.x -= this.x0;
  p.y -= this.y0;
  var lon, lat, ts, ce, Chi;
  var rh = Math.sqrt(p.x * p.x + p.y * p.y);
  if (this.sphere) {
    var c = 2 * Math.atan(rh / (2 * this.a * this.k0));
    lon = this.long0;
    lat = this.lat0;
    if (rh <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      p.x = lon;
      p.y = lat;
      return p;
    }
    lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
    if (Math.abs(this.coslat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      if (this.lat0 > 0) {
        lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x, - 1 * p.y));
      }
      else {
        lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x, p.y));
      }
    }
    else {
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
    }
    p.x = lon;
    p.y = lat;
    return p;
  }
  else {
    if (Math.abs(this.coslat0) <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
      if (rh <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
        lat = this.lat0;
        lon = this.long0;
        p.x = lon;
        p.y = lat;
        //trace(p.toString());
        return p;
      }
      p.x *= this.con;
      p.y *= this.con;
      ts = rh * this.cons / (2 * this.a * this.k0);
      lat = this.con * Object(_common_phi2z__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, ts);
      lon = this.con * Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.con * this.long0 + Math.atan2(p.x, - 1 * p.y));
    }
    else {
      ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
      lon = this.long0;
      if (rh <= _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
        Chi = this.X0;
      }
      else {
        Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
        lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_5__["default"])(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
      }
      lat = -1 * Object(_common_phi2z__WEBPACK_IMPORTED_MODULE_4__["default"])(this.e, Math.tan(0.5 * (_constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"] + Chi)));
    }
  }
  p.x = lon;
  p.y = lat;

  //trace(p.toString());
  return p;

}

var names = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names,
  ssfn_: ssfn_
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/sterea.js":
/*!******************************************************!*\
  !*** ./node_modules/proj4/lib/projections/sterea.js ***!
  \******************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _gauss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gauss */ "./node_modules/proj4/lib/projections/gauss.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");



function init() {
  _gauss__WEBPACK_IMPORTED_MODULE_0__["default"].init.apply(this);
  if (!this.rc) {
    return;
  }
  this.sinc0 = Math.sin(this.phic0);
  this.cosc0 = Math.cos(this.phic0);
  this.R2 = 2 * this.rc;
  if (!this.title) {
    this.title = "Oblique Stereographic Alternative";
  }
}

function forward(p) {
  var sinc, cosc, cosl, k;
  p.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x - this.long0);
  _gauss__WEBPACK_IMPORTED_MODULE_0__["default"].forward.apply(this, [p]);
  sinc = Math.sin(p.y);
  cosc = Math.cos(p.y);
  cosl = Math.cos(p.x);
  k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
  p.x = k * cosc * Math.sin(p.x);
  p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
  p.x = this.a * p.x + this.x0;
  p.y = this.a * p.y + this.y0;
  return p;
}

function inverse(p) {
  var sinc, cosc, lon, lat, rho;
  p.x = (p.x - this.x0) / this.a;
  p.y = (p.y - this.y0) / this.a;

  p.x /= this.k0;
  p.y /= this.k0;
  if ((rho = Math.sqrt(p.x * p.x + p.y * p.y))) {
    var c = 2 * Math.atan2(rho, this.R2);
    sinc = Math.sin(c);
    cosc = Math.cos(c);
    lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
    lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
  }
  else {
    lat = this.phic0;
    lon = 0;
  }

  p.x = lon;
  p.y = lat;
  _gauss__WEBPACK_IMPORTED_MODULE_0__["default"].inverse.apply(this, [p]);
  p.x = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x + this.long0);
  return p;
}

var names = ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea","Oblique Stereographic Alternative","Double_Stereographic"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/tmerc.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/tmerc.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_pj_enfn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pj_enfn */ "./node_modules/proj4/lib/common/pj_enfn.js");
/* harmony import */ var _common_pj_mlfn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/pj_mlfn */ "./node_modules/proj4/lib/common/pj_mlfn.js");
/* harmony import */ var _common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/pj_inv_mlfn */ "./node_modules/proj4/lib/common/pj_inv_mlfn.js");
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_sign__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/sign */ "./node_modules/proj4/lib/common/sign.js");
// Heavily based on this tmerc projection implementation
// https://github.com/mbloch/mapshaper-proj/blob/master/src/projections/tmerc.js









function init() {
  this.x0 = this.x0 !== undefined ? this.x0 : 0;
  this.y0 = this.y0 !== undefined ? this.y0 : 0;
  this.long0 = this.long0 !== undefined ? this.long0 : 0;
  this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

  if (this.es) {
    this.en = Object(_common_pj_enfn__WEBPACK_IMPORTED_MODULE_0__["default"])(this.es);
    this.ml0 = Object(_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_1__["default"])(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
  }
}

/**
    Transverse Mercator Forward  - long/lat to x/y
    long/lat in radians
  */
function forward(p) {
  var lon = p.x;
  var lat = p.y;

  var delta_lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(lon - this.long0);
  var con;
  var x, y;
  var sin_phi = Math.sin(lat);
  var cos_phi = Math.cos(lat);

  if (!this.es) {
    var b = cos_phi * Math.sin(delta_lon);

    if ((Math.abs(Math.abs(b) - 1)) < _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"]) {
      return (93);
    }
    else {
      x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
      y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
      b = Math.abs(y);

      if (b >= 1) {
        if ((b - 1) > _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"]) {
          return (93);
        }
        else {
          y = 0;
        }
      }
      else {
        y = Math.acos(y);
      }

      if (lat < 0) {
        y = -y;
      }

      y = this.a * this.k0 * (y - this.lat0) + this.y0;
    }
  }
  else {
    var al = cos_phi * delta_lon;
    var als = Math.pow(al, 2);
    var c = this.ep2 * Math.pow(cos_phi, 2);
    var cs = Math.pow(c, 2);
    var tq = Math.abs(cos_phi) > _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"] ? Math.tan(lat) : 0;
    var t = Math.pow(tq, 2);
    var ts = Math.pow(t, 2);
    con = 1 - this.es * Math.pow(sin_phi, 2);
    al = al / Math.sqrt(con);
    var ml = Object(_common_pj_mlfn__WEBPACK_IMPORTED_MODULE_1__["default"])(lat, sin_phi, cos_phi, this.en);

    x = this.a * (this.k0 * al * (1 +
      als / 6 * (1 - t + c +
      als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c +
      als / 42 * (61 + 179 * ts - ts * t - 479 * t))))) +
      this.x0;

    y = this.a * (this.k0 * (ml - this.ml0 +
      sin_phi * delta_lon * al / 2 * (1 +
      als / 12 * (5 - t + 9 * c + 4 * cs +
      als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c +
      als / 56 * (1385 + 543 * ts - ts * t - 3111 * t)))))) +
      this.y0;
  }

  p.x = x;
  p.y = y;

  return p;
}

/**
    Transverse Mercator Inverse  -  x/y to long/lat
  */
function inverse(p) {
  var con, phi;
  var lat, lon;
  var x = (p.x - this.x0) * (1 / this.a);
  var y = (p.y - this.y0) * (1 / this.a);

  if (!this.es) {
    var f = Math.exp(x / this.k0);
    var g = 0.5 * (f - 1 / f);
    var temp = this.lat0 + y / this.k0;
    var h = Math.cos(temp);
    con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
    lat = Math.asin(con);

    if (y < 0) {
      lat = -lat;
    }

    if ((g === 0) && (h === 0)) {
      lon = 0;
    }
    else {
      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(Math.atan2(g, h) + this.long0);
    }
  }
  else { // ellipsoidal form
    con = this.ml0 + y / this.k0;
    phi = Object(_common_pj_inv_mlfn__WEBPACK_IMPORTED_MODULE_2__["default"])(con, this.es, this.en);

    if (Math.abs(phi) < _constants_values__WEBPACK_IMPORTED_MODULE_4__["HALF_PI"]) {
      var sin_phi = Math.sin(phi);
      var cos_phi = Math.cos(phi);
      var tan_phi = Math.abs(cos_phi) > _constants_values__WEBPACK_IMPORTED_MODULE_4__["EPSLN"] ? Math.tan(phi) : 0;
      var c = this.ep2 * Math.pow(cos_phi, 2);
      var cs = Math.pow(c, 2);
      var t = Math.pow(tan_phi, 2);
      var ts = Math.pow(t, 2);
      con = 1 - this.es * Math.pow(sin_phi, 2);
      var d = x * Math.sqrt(con) / this.k0;
      var ds = Math.pow(d, 2);
      con = con * tan_phi;

      lat = phi - (con * ds / (1 - this.es)) * 0.5 * (1 -
        ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs -
        ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c -
        ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));

      lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_3__["default"])(this.long0 + (d * (1 -
        ds / 6 * (1 + 2 * t + c -
        ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c -
        ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi));
    }
    else {
      lat = _constants_values__WEBPACK_IMPORTED_MODULE_4__["HALF_PI"] * Object(_common_sign__WEBPACK_IMPORTED_MODULE_5__["default"])(y);
      lon = 0;
    }
  }

  p.x = lon;
  p.y = lat;

  return p;
}

var names = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/tpers.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/tpers.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_hypot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/hypot */ "./node_modules/proj4/lib/common/hypot.js");

var mode = {
  N_POLE: 0,
  S_POLE: 1,
  EQUIT: 2,
  OBLIQ: 3
};




var params = {
  h:     { def: 100000, num: true },           // default is Karman line, no default in PROJ.7
  azi:   { def: 0, num: true, degrees: true }, // default is North
  tilt:  { def: 0, num: true, degrees: true }, // default is Nadir
  long0: { def: 0, num: true },                // default is Greenwich, conversion to rad is automatic
  lat0:  { def: 0, num: true }                 // default is Equator, conversion to rad is automatic
};

function init() {
  Object.keys(params).forEach(function (p) {
    if (typeof this[p] === "undefined") {
      this[p] = params[p].def;
    } else if (params[p].num && isNaN(this[p])) {
      throw new Error("Invalid parameter value, must be numeric " + p + " = " + this[p]);
    } else if (params[p].num) {
      this[p] = parseFloat(this[p]);
    }
    if (params[p].degrees) {
      this[p] = this[p] * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"];
    }
  }.bind(this));

  if (Math.abs((Math.abs(this.lat0) - _constants_values__WEBPACK_IMPORTED_MODULE_0__["HALF_PI"])) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    this.mode = this.lat0 < 0 ? mode.S_POLE : mode.N_POLE;
  } else if (Math.abs(this.lat0) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    this.mode = mode.EQUIT;
  } else {
    this.mode = mode.OBLIQ;
    this.sinph0 = Math.sin(this.lat0);
    this.cosph0 = Math.cos(this.lat0);
  }

  this.pn1 = this.h / this.a;  // Normalize relative to the Earth's radius

  if (this.pn1 <= 0 || this.pn1 > 1e10) {
    throw new Error("Invalid height");
  }
  
  this.p = 1 + this.pn1;
  this.rp = 1 / this.p;
  this.h1 = 1 / this.pn1;
  this.pfact = (this.p + 1) * this.h1;
  this.es = 0;

  var omega = this.tilt;
  var gamma = this.azi;
  this.cg = Math.cos(gamma);
  this.sg = Math.sin(gamma);
  this.cw = Math.cos(omega);
  this.sw = Math.sin(omega);
}

function forward(p) {
  p.x -= this.long0;
  var sinphi = Math.sin(p.y);
  var cosphi = Math.cos(p.y);
  var coslam = Math.cos(p.x);
  var x, y;
  switch (this.mode) {
    case mode.OBLIQ:
      y = this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
      break;
    case mode.EQUIT:
      y = cosphi * coslam;
      break;
    case mode.S_POLE:
      y = -sinphi;
      break;
    case mode.N_POLE:
      y = sinphi;
      break;
  }
  y = this.pn1 / (this.p - y);
  x = y * cosphi * Math.sin(p.x);

  switch (this.mode) {
    case mode.OBLIQ:
      y *= this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
      break;
    case mode.EQUIT:
      y *= sinphi;
      break;
    case mode.N_POLE:
      y *= -(cosphi * coslam);
      break;
    case mode.S_POLE:
      y *= cosphi * coslam;
      break;
  }

  // Tilt 
  var yt, ba;
  yt = y * this.cg + x * this.sg;
  ba = 1 / (yt * this.sw * this.h1 + this.cw);
  x = (x * this.cg - y * this.sg) * this.cw * ba;
  y = yt * ba;

  p.x = x * this.a;
  p.y = y * this.a;
  return p;
}

function inverse(p) {
  p.x /= this.a;
  p.y /= this.a;
  var r = { x: p.x, y: p.y };

  // Un-Tilt
  var bm, bq, yt;
  yt = 1 / (this.pn1 - p.y * this.sw);
  bm = this.pn1 * p.x * yt;
  bq = this.pn1 * p.y * this.cw * yt;
  p.x = bm * this.cg + bq * this.sg;
  p.y = bq * this.cg - bm * this.sg;

  var rh = Object(_common_hypot__WEBPACK_IMPORTED_MODULE_1__["default"])(p.x, p.y);
  if (Math.abs(rh) < _constants_values__WEBPACK_IMPORTED_MODULE_0__["EPSLN"]) {
    r.x = 0;
    r.y = p.y;
  } else {
    var cosz, sinz;
    sinz = 1 - rh * rh * this.pfact;
    sinz = (this.p - Math.sqrt(sinz)) / (this.pn1 / rh + rh / this.pn1);
    cosz = Math.sqrt(1 - sinz * sinz);
    switch (this.mode) {
      case mode.OBLIQ:
        r.y = Math.asin(cosz * this.sinph0 + p.y * sinz * this.cosph0 / rh);
        p.y = (cosz - this.sinph0 * Math.sin(r.y)) * rh;
        p.x *= sinz * this.cosph0;
        break;
      case mode.EQUIT:
        r.y = Math.asin(p.y * sinz / rh);
        p.y = cosz * rh;
        p.x *= sinz;
        break;
      case mode.N_POLE:
        r.y = Math.asin(cosz);
        p.y = -p.y;
        break;
      case mode.S_POLE:
        r.y = -Math.asin(cosz);
        break;
    }
    r.x = Math.atan2(p.x, p.y);
  }

  p.x = r.x + this.long0;
  p.y = r.y;
  return p;
}

var names = ["Tilted_Perspective", "tpers"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/utm.js":
/*!***************************************************!*\
  !*** ./node_modules/proj4/lib/projections/utm.js ***!
  \***************************************************/
/*! exports provided: dependsOn, init, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dependsOn", function() { return dependsOn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_zone */ "./node_modules/proj4/lib/common/adjust_zone.js");
/* harmony import */ var _etmerc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./etmerc */ "./node_modules/proj4/lib/projections/etmerc.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");


var dependsOn = 'etmerc';



function init() {
  var zone = Object(_common_adjust_zone__WEBPACK_IMPORTED_MODULE_0__["default"])(this.zone, this.long0);
  if (zone === undefined) {
    throw new Error('unknown utm zone');
  }
  this.lat0 = 0;
  this.long0 =  ((6 * Math.abs(zone)) - 183) * _constants_values__WEBPACK_IMPORTED_MODULE_2__["D2R"];
  this.x0 = 500000;
  this.y0 = this.utmSouth ? 10000000 : 0;
  this.k0 = 0.9996;

  _etmerc__WEBPACK_IMPORTED_MODULE_1__["default"].init.apply(this);
  this.forward = _etmerc__WEBPACK_IMPORTED_MODULE_1__["default"].forward;
  this.inverse = _etmerc__WEBPACK_IMPORTED_MODULE_1__["default"].inverse;
}

var names = ["Universal Transverse Mercator System", "utm"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  names: names,
  dependsOn: dependsOn
});


/***/ }),

/***/ "./node_modules/proj4/lib/projections/vandg.js":
/*!*****************************************************!*\
  !*** ./node_modules/proj4/lib/projections/vandg.js ***!
  \*****************************************************/
/*! exports provided: init, forward, inverse, names, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forward", function() { return forward; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inverse", function() { return inverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "names", function() { return names; });
/* harmony import */ var _common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/adjust_lon */ "./node_modules/proj4/lib/common/adjust_lon.js");
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _common_asinz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/asinz */ "./node_modules/proj4/lib/common/asinz.js");






/* Initialize the Van Der Grinten projection
  ----------------------------------------*/
function init() {
  //this.R = 6370997; //Radius of earth
  this.R = this.a;
}

function forward(p) {

  var lon = p.x;
  var lat = p.y;

  /* Forward equations
    -----------------*/
  var dlon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(lon - this.long0);
  var x, y;

  if (Math.abs(lat) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
    x = this.x0 + this.R * dlon;
    y = this.y0;
  }
  var theta = Object(_common_asinz__WEBPACK_IMPORTED_MODULE_2__["default"])(2 * Math.abs(lat / Math.PI));
  if ((Math.abs(dlon) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) || (Math.abs(Math.abs(lat) - _constants_values__WEBPACK_IMPORTED_MODULE_1__["HALF_PI"]) <= _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"])) {
    x = this.x0;
    if (lat >= 0) {
      y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
    }
    else {
      y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
    }
    //  return(OK);
  }
  var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
  var asq = al * al;
  var sinth = Math.sin(theta);
  var costh = Math.cos(theta);

  var g = costh / (sinth + costh - 1);
  var gsq = g * g;
  var m = g * (2 / sinth - 1);
  var msq = m * m;
  var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
  if (dlon < 0) {
    con = -con;
  }
  x = this.x0 + con;
  //con = Math.abs(con / (Math.PI * this.R));
  var q = asq + g;
  con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
  if (lat >= 0) {
    //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
    y = this.y0 + con;
  }
  else {
    //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
    y = this.y0 - con;
  }
  p.x = x;
  p.y = y;
  return p;
}

/* Van Der Grinten inverse equations--mapping x,y to lat/long
  ---------------------------------------------------------*/
function inverse(p) {
  var lon, lat;
  var xx, yy, xys, c1, c2, c3;
  var a1;
  var m1;
  var con;
  var th1;
  var d;

  /* inverse equations
    -----------------*/
  p.x -= this.x0;
  p.y -= this.y0;
  con = Math.PI * this.R;
  xx = p.x / con;
  yy = p.y / con;
  xys = xx * xx + yy * yy;
  c1 = -Math.abs(yy) * (1 + xys);
  c2 = c1 - 2 * yy * yy + xx * xx;
  c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
  d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
  a1 = (c1 - c2 * c2 / 3 / c3) / c3;
  m1 = 2 * Math.sqrt(-a1 / 3);
  con = ((3 * d) / a1) / m1;
  if (Math.abs(con) > 1) {
    if (con >= 0) {
      con = 1;
    }
    else {
      con = -1;
    }
  }
  th1 = Math.acos(con) / 3;
  if (p.y >= 0) {
    lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
  }
  else {
    lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
  }

  if (Math.abs(xx) < _constants_values__WEBPACK_IMPORTED_MODULE_1__["EPSLN"]) {
    lon = this.long0;
  }
  else {
    lon = Object(_common_adjust_lon__WEBPACK_IMPORTED_MODULE_0__["default"])(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
  }

  p.x = lon;
  p.y = lat;
  return p;
}

var names = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
/* harmony default export */ __webpack_exports__["default"] = ({
  init: init,
  forward: forward,
  inverse: inverse,
  names: names
});


/***/ }),

/***/ "./node_modules/proj4/lib/transform.js":
/*!*********************************************!*\
  !*** ./node_modules/proj4/lib/transform.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return transform; });
/* harmony import */ var _constants_values__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/values */ "./node_modules/proj4/lib/constants/values.js");
/* harmony import */ var _datum_transform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./datum_transform */ "./node_modules/proj4/lib/datum_transform.js");
/* harmony import */ var _adjust_axis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./adjust_axis */ "./node_modules/proj4/lib/adjust_axis.js");
/* harmony import */ var _Proj__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Proj */ "./node_modules/proj4/lib/Proj.js");
/* harmony import */ var _common_toPoint__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/toPoint */ "./node_modules/proj4/lib/common/toPoint.js");
/* harmony import */ var _checkSanity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./checkSanity */ "./node_modules/proj4/lib/checkSanity.js");







function checkNotWGS(source, dest) {
  return ((source.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"] || source.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"]) && dest.datumCode !== 'WGS84') || ((dest.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_3PARAM"] || dest.datum.datum_type === _constants_values__WEBPACK_IMPORTED_MODULE_0__["PJD_7PARAM"]) && source.datumCode !== 'WGS84');
}

function transform(source, dest, point, enforceAxis) {
  var wgs84;
  if (Array.isArray(point)) {
    point = Object(_common_toPoint__WEBPACK_IMPORTED_MODULE_4__["default"])(point);
  }
  Object(_checkSanity__WEBPACK_IMPORTED_MODULE_5__["default"])(point);
  // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
  if (source.datum && dest.datum && checkNotWGS(source, dest)) {
    wgs84 = new _Proj__WEBPACK_IMPORTED_MODULE_3__["default"]('WGS84');
    point = transform(source, wgs84, point, enforceAxis);
    source = wgs84;
  }
  // DGR, 2010/11/12
  if (enforceAxis && source.axis !== 'enu') {
    point = Object(_adjust_axis__WEBPACK_IMPORTED_MODULE_2__["default"])(source, false, point);
  }
  // Transform source points to long/lat, if they aren't already.
  if (source.projName === 'longlat') {
    point = {
      x: point.x * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"],
      y: point.y * _constants_values__WEBPACK_IMPORTED_MODULE_0__["D2R"],
      z: point.z || 0
    };
  } else {
    if (source.to_meter) {
      point = {
        x: point.x * source.to_meter,
        y: point.y * source.to_meter,
        z: point.z || 0
      };
    }
    point = source.inverse(point); // Convert Cartesian to longlat
    if (!point) {
      return;
    }
  }
  // Adjust for the prime meridian if necessary
  if (source.from_greenwich) {
    point.x += source.from_greenwich;
  }

  // Convert datums if needed, and if possible.
  point = Object(_datum_transform__WEBPACK_IMPORTED_MODULE_1__["default"])(source.datum, dest.datum, point);
  if (!point) {
    return;
  }

  // Adjust for the prime meridian if necessary
  if (dest.from_greenwich) {
    point = {
      x: point.x - dest.from_greenwich,
      y: point.y,
      z: point.z || 0
    };
  }

  if (dest.projName === 'longlat') {
    // convert radians to decimal degrees
    point = {
      x: point.x * _constants_values__WEBPACK_IMPORTED_MODULE_0__["R2D"],
      y: point.y * _constants_values__WEBPACK_IMPORTED_MODULE_0__["R2D"],
      z: point.z || 0
    };
  } else { // else project
    point = dest.forward(point);
    if (dest.to_meter) {
      point = {
        x: point.x / dest.to_meter,
        y: point.y / dest.to_meter,
        z: point.z || 0
      };
    }
  }

  // DGR, 2010/11/12
  if (enforceAxis && dest.axis !== 'enu') {
    return Object(_adjust_axis__WEBPACK_IMPORTED_MODULE_2__["default"])(dest, true, point);
  }

  return point;
}


/***/ }),

/***/ "./node_modules/proj4/projs.js":
/*!*************************************!*\
  !*** ./node_modules/proj4/projs.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_projections_tmerc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/projections/tmerc */ "./node_modules/proj4/lib/projections/tmerc.js");
/* harmony import */ var _lib_projections_etmerc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/projections/etmerc */ "./node_modules/proj4/lib/projections/etmerc.js");
/* harmony import */ var _lib_projections_utm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/projections/utm */ "./node_modules/proj4/lib/projections/utm.js");
/* harmony import */ var _lib_projections_sterea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/projections/sterea */ "./node_modules/proj4/lib/projections/sterea.js");
/* harmony import */ var _lib_projections_stere__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/projections/stere */ "./node_modules/proj4/lib/projections/stere.js");
/* harmony import */ var _lib_projections_somerc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/projections/somerc */ "./node_modules/proj4/lib/projections/somerc.js");
/* harmony import */ var _lib_projections_omerc__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/projections/omerc */ "./node_modules/proj4/lib/projections/omerc.js");
/* harmony import */ var _lib_projections_lcc__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/projections/lcc */ "./node_modules/proj4/lib/projections/lcc.js");
/* harmony import */ var _lib_projections_krovak__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/projections/krovak */ "./node_modules/proj4/lib/projections/krovak.js");
/* harmony import */ var _lib_projections_cass__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lib/projections/cass */ "./node_modules/proj4/lib/projections/cass.js");
/* harmony import */ var _lib_projections_laea__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./lib/projections/laea */ "./node_modules/proj4/lib/projections/laea.js");
/* harmony import */ var _lib_projections_aea__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./lib/projections/aea */ "./node_modules/proj4/lib/projections/aea.js");
/* harmony import */ var _lib_projections_gnom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./lib/projections/gnom */ "./node_modules/proj4/lib/projections/gnom.js");
/* harmony import */ var _lib_projections_cea__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./lib/projections/cea */ "./node_modules/proj4/lib/projections/cea.js");
/* harmony import */ var _lib_projections_eqc__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./lib/projections/eqc */ "./node_modules/proj4/lib/projections/eqc.js");
/* harmony import */ var _lib_projections_poly__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./lib/projections/poly */ "./node_modules/proj4/lib/projections/poly.js");
/* harmony import */ var _lib_projections_nzmg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./lib/projections/nzmg */ "./node_modules/proj4/lib/projections/nzmg.js");
/* harmony import */ var _lib_projections_mill__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./lib/projections/mill */ "./node_modules/proj4/lib/projections/mill.js");
/* harmony import */ var _lib_projections_sinu__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./lib/projections/sinu */ "./node_modules/proj4/lib/projections/sinu.js");
/* harmony import */ var _lib_projections_moll__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./lib/projections/moll */ "./node_modules/proj4/lib/projections/moll.js");
/* harmony import */ var _lib_projections_eqdc__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./lib/projections/eqdc */ "./node_modules/proj4/lib/projections/eqdc.js");
/* harmony import */ var _lib_projections_vandg__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./lib/projections/vandg */ "./node_modules/proj4/lib/projections/vandg.js");
/* harmony import */ var _lib_projections_aeqd__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./lib/projections/aeqd */ "./node_modules/proj4/lib/projections/aeqd.js");
/* harmony import */ var _lib_projections_ortho__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./lib/projections/ortho */ "./node_modules/proj4/lib/projections/ortho.js");
/* harmony import */ var _lib_projections_qsc__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./lib/projections/qsc */ "./node_modules/proj4/lib/projections/qsc.js");
/* harmony import */ var _lib_projections_robin__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./lib/projections/robin */ "./node_modules/proj4/lib/projections/robin.js");
/* harmony import */ var _lib_projections_geocent__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./lib/projections/geocent */ "./node_modules/proj4/lib/projections/geocent.js");
/* harmony import */ var _lib_projections_tpers__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./lib/projections/tpers */ "./node_modules/proj4/lib/projections/tpers.js");




























/* harmony default export */ __webpack_exports__["default"] = (function(proj4){
  proj4.Proj.projections.add(_lib_projections_tmerc__WEBPACK_IMPORTED_MODULE_0__["default"]);
  proj4.Proj.projections.add(_lib_projections_etmerc__WEBPACK_IMPORTED_MODULE_1__["default"]);
  proj4.Proj.projections.add(_lib_projections_utm__WEBPACK_IMPORTED_MODULE_2__["default"]);
  proj4.Proj.projections.add(_lib_projections_sterea__WEBPACK_IMPORTED_MODULE_3__["default"]);
  proj4.Proj.projections.add(_lib_projections_stere__WEBPACK_IMPORTED_MODULE_4__["default"]);
  proj4.Proj.projections.add(_lib_projections_somerc__WEBPACK_IMPORTED_MODULE_5__["default"]);
  proj4.Proj.projections.add(_lib_projections_omerc__WEBPACK_IMPORTED_MODULE_6__["default"]);
  proj4.Proj.projections.add(_lib_projections_lcc__WEBPACK_IMPORTED_MODULE_7__["default"]);
  proj4.Proj.projections.add(_lib_projections_krovak__WEBPACK_IMPORTED_MODULE_8__["default"]);
  proj4.Proj.projections.add(_lib_projections_cass__WEBPACK_IMPORTED_MODULE_9__["default"]);
  proj4.Proj.projections.add(_lib_projections_laea__WEBPACK_IMPORTED_MODULE_10__["default"]);
  proj4.Proj.projections.add(_lib_projections_aea__WEBPACK_IMPORTED_MODULE_11__["default"]);
  proj4.Proj.projections.add(_lib_projections_gnom__WEBPACK_IMPORTED_MODULE_12__["default"]);
  proj4.Proj.projections.add(_lib_projections_cea__WEBPACK_IMPORTED_MODULE_13__["default"]);
  proj4.Proj.projections.add(_lib_projections_eqc__WEBPACK_IMPORTED_MODULE_14__["default"]);
  proj4.Proj.projections.add(_lib_projections_poly__WEBPACK_IMPORTED_MODULE_15__["default"]);
  proj4.Proj.projections.add(_lib_projections_nzmg__WEBPACK_IMPORTED_MODULE_16__["default"]);
  proj4.Proj.projections.add(_lib_projections_mill__WEBPACK_IMPORTED_MODULE_17__["default"]);
  proj4.Proj.projections.add(_lib_projections_sinu__WEBPACK_IMPORTED_MODULE_18__["default"]);
  proj4.Proj.projections.add(_lib_projections_moll__WEBPACK_IMPORTED_MODULE_19__["default"]);
  proj4.Proj.projections.add(_lib_projections_eqdc__WEBPACK_IMPORTED_MODULE_20__["default"]);
  proj4.Proj.projections.add(_lib_projections_vandg__WEBPACK_IMPORTED_MODULE_21__["default"]);
  proj4.Proj.projections.add(_lib_projections_aeqd__WEBPACK_IMPORTED_MODULE_22__["default"]);
  proj4.Proj.projections.add(_lib_projections_ortho__WEBPACK_IMPORTED_MODULE_23__["default"]);
  proj4.Proj.projections.add(_lib_projections_qsc__WEBPACK_IMPORTED_MODULE_24__["default"]);
  proj4.Proj.projections.add(_lib_projections_robin__WEBPACK_IMPORTED_MODULE_25__["default"]);
  proj4.Proj.projections.add(_lib_projections_geocent__WEBPACK_IMPORTED_MODULE_26__["default"]);
  proj4.Proj.projections.add(_lib_projections_tpers__WEBPACK_IMPORTED_MODULE_27__["default"]);
});

/***/ }),

/***/ "./node_modules/wkt-parser/index.js":
/*!******************************************!*\
  !*** ./node_modules/wkt-parser/index.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser */ "./node_modules/wkt-parser/parser.js");
/* harmony import */ var _process__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./process */ "./node_modules/wkt-parser/process.js");
var D2R = 0.01745329251994329577;





function rename(obj, params) {
  var outName = params[0];
  var inName = params[1];
  if (!(outName in obj) && (inName in obj)) {
    obj[outName] = obj[inName];
    if (params.length === 3) {
      obj[outName] = params[2](obj[outName]);
    }
  }
}

function d2r(input) {
  return input * D2R;
}

function cleanWKT(wkt) {
  if (wkt.type === 'GEOGCS') {
    wkt.projName = 'longlat';
  } else if (wkt.type === 'LOCAL_CS') {
    wkt.projName = 'identity';
    wkt.local = true;
  } else {
    if (typeof wkt.PROJECTION === 'object') {
      wkt.projName = Object.keys(wkt.PROJECTION)[0];
    } else {
      wkt.projName = wkt.PROJECTION;
    }
  }
  if (wkt.AXIS) {
    var axisOrder = '';
    for (var i = 0, ii = wkt.AXIS.length; i < ii; ++i) {
      var axis = [wkt.AXIS[i][0].toLowerCase(), wkt.AXIS[i][1].toLowerCase()];
      if (axis[0].indexOf('north') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'north')) {
        axisOrder += 'n';
      } else if (axis[0].indexOf('south') !== -1 || ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'south')) {
        axisOrder += 's';
      } else if (axis[0].indexOf('east') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'east')) {
        axisOrder += 'e';
      } else if (axis[0].indexOf('west') !== -1 || ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'west')) {
        axisOrder += 'w';
      }
    }
    if (axisOrder.length === 2) {
      axisOrder += 'u';
    }
    if (axisOrder.length === 3) {
      wkt.axis = axisOrder;
    }
  }
  if (wkt.UNIT) {
    wkt.units = wkt.UNIT.name.toLowerCase();
    if (wkt.units === 'metre') {
      wkt.units = 'meter';
    }
    if (wkt.UNIT.convert) {
      if (wkt.type === 'GEOGCS') {
        if (wkt.DATUM && wkt.DATUM.SPHEROID) {
          wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
        }
      } else {
        wkt.to_meter = wkt.UNIT.convert;
      }
    }
  }
  var geogcs = wkt.GEOGCS;
  if (wkt.type === 'GEOGCS') {
    geogcs = wkt;
  }
  if (geogcs) {
    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
    //}
    if (geogcs.DATUM) {
      wkt.datumCode = geogcs.DATUM.name.toLowerCase();
    } else {
      wkt.datumCode = geogcs.name.toLowerCase();
    }
    if (wkt.datumCode.slice(0, 2) === 'd_') {
      wkt.datumCode = wkt.datumCode.slice(2);
    }
    if (wkt.datumCode === 'new_zealand_geodetic_datum_1949' || wkt.datumCode === 'new_zealand_1949') {
      wkt.datumCode = 'nzgd49';
    }
    if (wkt.datumCode === 'wgs_1984' || wkt.datumCode === 'world_geodetic_system_1984') {
      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
        wkt.sphere = true;
      }
      wkt.datumCode = 'wgs84';
    }
    if (wkt.datumCode.slice(-6) === '_ferro') {
      wkt.datumCode = wkt.datumCode.slice(0, - 6);
    }
    if (wkt.datumCode.slice(-8) === '_jakarta') {
      wkt.datumCode = wkt.datumCode.slice(0, - 8);
    }
    if (~wkt.datumCode.indexOf('belge')) {
      wkt.datumCode = 'rnb72';
    }
    if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
      wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
      if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
        wkt.ellps = 'intl';
      }

      wkt.a = geogcs.DATUM.SPHEROID.a;
      wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
    }

    if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
      wkt.datum_params = geogcs.DATUM.TOWGS84;
    }
    if (~wkt.datumCode.indexOf('osgb_1936')) {
      wkt.datumCode = 'osgb36';
    }
    if (~wkt.datumCode.indexOf('osni_1952')) {
      wkt.datumCode = 'osni52';
    }
    if (~wkt.datumCode.indexOf('tm65')
      || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
      wkt.datumCode = 'ire65';
    }
    if (wkt.datumCode === 'ch1903+') {
      wkt.datumCode = 'ch1903';
    }
    if (~wkt.datumCode.indexOf('israel')) {
      wkt.datumCode = 'isr93';
    }
  }
  if (wkt.b && !isFinite(wkt.b)) {
    wkt.b = wkt.a;
  }

  function toMeter(input) {
    var ratio = wkt.to_meter || 1;
    return input * ratio;
  }
  var renamer = function(a) {
    return rename(wkt, a);
  };
  var list = [
    ['standard_parallel_1', 'Standard_Parallel_1'],
    ['standard_parallel_1', 'Latitude of 1st standard parallel'],
    ['standard_parallel_2', 'Standard_Parallel_2'],
    ['standard_parallel_2', 'Latitude of 2nd standard parallel'],
    ['false_easting', 'False_Easting'],
    ['false_easting', 'False easting'],
    ['false-easting', 'Easting at false origin'],
    ['false_northing', 'False_Northing'],
    ['false_northing', 'False northing'],
    ['false_northing', 'Northing at false origin'],
    ['central_meridian', 'Central_Meridian'],
    ['central_meridian', 'Longitude of natural origin'],
    ['central_meridian', 'Longitude of false origin'],
    ['latitude_of_origin', 'Latitude_Of_Origin'],
    ['latitude_of_origin', 'Central_Parallel'],
    ['latitude_of_origin', 'Latitude of natural origin'],
    ['latitude_of_origin', 'Latitude of false origin'],
    ['scale_factor', 'Scale_Factor'],
    ['k0', 'scale_factor'],
    ['latitude_of_center', 'Latitude_Of_Center'],
    ['latitude_of_center', 'Latitude_of_center'],
    ['lat0', 'latitude_of_center', d2r],
    ['longitude_of_center', 'Longitude_Of_Center'],
    ['longitude_of_center', 'Longitude_of_center'],
    ['longc', 'longitude_of_center', d2r],
    ['x0', 'false_easting', toMeter],
    ['y0', 'false_northing', toMeter],
    ['long0', 'central_meridian', d2r],
    ['lat0', 'latitude_of_origin', d2r],
    ['lat0', 'standard_parallel_1', d2r],
    ['lat1', 'standard_parallel_1', d2r],
    ['lat2', 'standard_parallel_2', d2r],
    ['azimuth', 'Azimuth'],
    ['alpha', 'azimuth', d2r],
    ['srsCode', 'name']
  ];
  list.forEach(renamer);
  if (!wkt.long0 && wkt.longc && (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === 'Lambert_Azimuthal_Equal_Area')) {
    wkt.long0 = wkt.longc;
  }
  if (!wkt.lat_ts && wkt.lat1 && (wkt.projName === 'Stereographic_South_Pole' || wkt.projName === 'Polar Stereographic (variant B)')) {
    wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
    wkt.lat_ts = wkt.lat1;
  }
}
/* harmony default export */ __webpack_exports__["default"] = (function(wkt) {
  var lisp = Object(_parser__WEBPACK_IMPORTED_MODULE_0__["default"])(wkt);
  var type = lisp.shift();
  var name = lisp.shift();
  lisp.unshift(['name', name]);
  lisp.unshift(['type', type]);
  var obj = {};
  Object(_process__WEBPACK_IMPORTED_MODULE_1__["sExpr"])(lisp, obj);
  cleanWKT(obj);
  return obj;
});


/***/ }),

/***/ "./node_modules/wkt-parser/parser.js":
/*!*******************************************!*\
  !*** ./node_modules/wkt-parser/parser.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (parseString);

var NEUTRAL = 1;
var KEYWORD = 2;
var NUMBER = 3;
var QUOTED = 4;
var AFTERQUOTE = 5;
var ENDED = -1;
var whitespace = /\s/;
var latin = /[A-Za-z]/;
var keyword = /[A-Za-z84]/;
var endThings = /[,\]]/;
var digets = /[\d\.E\-\+]/;
// const ignoredChar = /[\s_\-\/\(\)]/g;
function Parser(text) {
  if (typeof text !== 'string') {
    throw new Error('not a string');
  }
  this.text = text.trim();
  this.level = 0;
  this.place = 0;
  this.root = null;
  this.stack = [];
  this.currentObject = null;
  this.state = NEUTRAL;
}
Parser.prototype.readCharicter = function() {
  var char = this.text[this.place++];
  if (this.state !== QUOTED) {
    while (whitespace.test(char)) {
      if (this.place >= this.text.length) {
        return;
      }
      char = this.text[this.place++];
    }
  }
  switch (this.state) {
    case NEUTRAL:
      return this.neutral(char);
    case KEYWORD:
      return this.keyword(char)
    case QUOTED:
      return this.quoted(char);
    case AFTERQUOTE:
      return this.afterquote(char);
    case NUMBER:
      return this.number(char);
    case ENDED:
      return;
  }
};
Parser.prototype.afterquote = function(char) {
  if (char === '"') {
    this.word += '"';
    this.state = QUOTED;
    return;
  }
  if (endThings.test(char)) {
    this.word = this.word.trim();
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
};
Parser.prototype.afterItem = function(char) {
  if (char === ',') {
    if (this.word !== null) {
      this.currentObject.push(this.word);
    }
    this.word = null;
    this.state = NEUTRAL;
    return;
  }
  if (char === ']') {
    this.level--;
    if (this.word !== null) {
      this.currentObject.push(this.word);
      this.word = null;
    }
    this.state = NEUTRAL;
    this.currentObject = this.stack.pop();
    if (!this.currentObject) {
      this.state = ENDED;
    }

    return;
  }
};
Parser.prototype.number = function(char) {
  if (digets.test(char)) {
    this.word += char;
    return;
  }
  if (endThings.test(char)) {
    this.word = parseFloat(this.word);
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
};
Parser.prototype.quoted = function(char) {
  if (char === '"') {
    this.state = AFTERQUOTE;
    return;
  }
  this.word += char;
  return;
};
Parser.prototype.keyword = function(char) {
  if (keyword.test(char)) {
    this.word += char;
    return;
  }
  if (char === '[') {
    var newObjects = [];
    newObjects.push(this.word);
    this.level++;
    if (this.root === null) {
      this.root = newObjects;
    } else {
      this.currentObject.push(newObjects);
    }
    this.stack.push(this.currentObject);
    this.currentObject = newObjects;
    this.state = NEUTRAL;
    return;
  }
  if (endThings.test(char)) {
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
};
Parser.prototype.neutral = function(char) {
  if (latin.test(char)) {
    this.word = char;
    this.state = KEYWORD;
    return;
  }
  if (char === '"') {
    this.word = '';
    this.state = QUOTED;
    return;
  }
  if (digets.test(char)) {
    this.word = char;
    this.state = NUMBER;
    return;
  }
  if (endThings.test(char)) {
    this.afterItem(char);
    return;
  }
  throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
};
Parser.prototype.output = function() {
  while (this.place < this.text.length) {
    this.readCharicter();
  }
  if (this.state === ENDED) {
    return this.root;
  }
  throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
};

function parseString(txt) {
  var parser = new Parser(txt);
  return parser.output();
}


/***/ }),

/***/ "./node_modules/wkt-parser/process.js":
/*!********************************************!*\
  !*** ./node_modules/wkt-parser/process.js ***!
  \********************************************/
/*! exports provided: sExpr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sExpr", function() { return sExpr; });


function mapit(obj, key, value) {
  if (Array.isArray(key)) {
    value.unshift(key);
    key = null;
  }
  var thing = key ? {} : obj;

  var out = value.reduce(function(newObj, item) {
    sExpr(item, newObj);
    return newObj
  }, thing);
  if (key) {
    obj[key] = out;
  }
}

function sExpr(v, obj) {
  if (!Array.isArray(v)) {
    obj[v] = true;
    return;
  }
  var key = v.shift();
  if (key === 'PARAMETER') {
    key = v.shift();
  }
  if (v.length === 1) {
    if (Array.isArray(v[0])) {
      obj[key] = {};
      sExpr(v[0], obj[key]);
      return;
    }
    obj[key] = v[0];
    return;
  }
  if (!v.length) {
    obj[key] = true;
    return;
  }
  if (key === 'TOWGS84') {
    obj[key] = v;
    return;
  }
  if (key === 'AXIS') {
    if (!(key in obj)) {
      obj[key] = [];
    }
    obj[key].push(v);
    return;
  }
  if (!Array.isArray(key)) {
    obj[key] = {};
  }

  var i;
  switch (key) {
    case 'UNIT':
    case 'PRIMEM':
    case 'VERT_DATUM':
      obj[key] = {
        name: v[0].toLowerCase(),
        convert: v[1]
      };
      if (v.length === 3) {
        sExpr(v[2], obj[key]);
      }
      return;
    case 'SPHEROID':
    case 'ELLIPSOID':
      obj[key] = {
        name: v[0],
        a: v[1],
        rf: v[2]
      };
      if (v.length === 4) {
        sExpr(v[3], obj[key]);
      }
      return;
    case 'PROJECTEDCRS':
    case 'PROJCRS':
    case 'GEOGCS':
    case 'GEOCCS':
    case 'PROJCS':
    case 'LOCAL_CS':
    case 'GEODCRS':
    case 'GEODETICCRS':
    case 'GEODETICDATUM':
    case 'EDATUM':
    case 'ENGINEERINGDATUM':
    case 'VERT_CS':
    case 'VERTCRS':
    case 'VERTICALCRS':
    case 'COMPD_CS':
    case 'COMPOUNDCRS':
    case 'ENGINEERINGCRS':
    case 'ENGCRS':
    case 'FITTED_CS':
    case 'LOCAL_DATUM':
    case 'DATUM':
      v[0] = ['name', v[0]];
      mapit(obj, key, v);
      return;
    default:
      i = -1;
      while (++i < v.length) {
        if (!Array.isArray(v[i])) {
          return sExpr(v, obj[key]);
        }
      }
      return mapit(obj, key, v);
  }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvanF1ZXJ5LTMuNi4wLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWdycy9tZ3JzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9Qcm9qLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvYWRqdXN0X2F4aXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jaGVja1Nhbml0eS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9hZGp1c3RfbGF0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FkanVzdF9sb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYWRqdXN0X3pvbmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vYXNpbmh5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2FzaW56LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2NsZW5zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2NsZW5zX2NtcGx4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2Nvc2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZTBmbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9lMWZuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2UyZm4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vZTNmbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9nTi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9nYXRnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2h5cG90LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2ltbGZuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL2lxc2Zuei5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9sb2cxcHkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vbWxmbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9tc2Zuei5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9waGkyei5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9wal9lbmZuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3BqX2ludl9tbGZuLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3BqX21sZm4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vcXNmbnouanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vc2lnbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi9zaW5oLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvY29tbW9uL3NyYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb21tb24vdG9Qb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbW1vbi90c2Zuei5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy9EYXR1bS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy9FbGxpcHNvaWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb25zdGFudHMvUHJpbWVNZXJpZGlhbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy91bml0cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2NvbnN0YW50cy92YWx1ZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9jb3JlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGF0dW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9kYXR1bVV0aWxzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGF0dW1fdHJhbnNmb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvZGVmcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2Rlcml2ZUNvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvbWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9uYWRncmlkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcGFyc2VDb2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvalN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvYWVhLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvYWVxZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2Nhc3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9jZWEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9lcWMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9lcWRjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZXRtZXJjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZ2F1c3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9nZW9jZW50LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvZ25vbS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2tyb3Zhay5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL2xhZWEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9sY2MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9sb25nbGF0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbWVyYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL21pbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9tb2xsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvbnptZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL29tZXJjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvb3J0aG8uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9wb2x5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvcXNjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvcm9iaW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9zaW51LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvc29tZXJjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvc3RlcmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy9zdGVyZWEuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi9wcm9qZWN0aW9ucy90bWVyYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcHJvajQvbGliL3Byb2plY3Rpb25zL3RwZXJzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvdXRtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9qNC9saWIvcHJvamVjdGlvbnMvdmFuZGcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L2xpYi90cmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2o0L3Byb2pzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93a3QtcGFyc2VyL3BhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2t0LXBhcnNlci9wcm9jZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7QUFBQTtBQUFzQztBQUNkOztBQUV4QjtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEscURBQUk7QUFDckI7QUFDQSx5QkFBeUIsRUFBRTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsNERBQUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUN6REE7QUFDQSxlQUFlLGFBQWEsS0FBdUIsZ0ZBQWdGLDJFQUEyRSxZQUFZLE1BQU0sc0RBQXNELGFBQWEsZ0VBQWdFLHNCQUFzQixhQUFhLDRCQUE0QiwwQkFBMEIsbUVBQW1FLGVBQWUsbUZBQW1GLGVBQWUsNkJBQTZCLGlCQUFpQixxQ0FBcUMsa0JBQWtCLDJDQUEyQywwRkFBMEYsZ0RBQWdELGNBQWMsNkZBQTZGLDhCQUE4QiwyQkFBMkIsY0FBYyx5Q0FBeUMsNEVBQTRFLGtCQUFrQixtREFBbUQsb0JBQW9CLGlCQUFpQiw0REFBNEQsdUJBQXVCLG9DQUFvQywyQkFBMkIsa0JBQWtCLHNCQUFzQixpQkFBaUIsK0NBQStDLHFCQUFxQixHQUFHLGtCQUFrQiwrQ0FBK0Msa0JBQWtCLGtCQUFrQixpQkFBaUIsbUJBQW1CLGlCQUFpQixnREFBZ0QsY0FBYyxHQUFHLGdCQUFnQixnREFBZ0QsV0FBVyxHQUFHLGdCQUFnQixpQ0FBaUMsOENBQThDLGdCQUFnQiwyQ0FBMkMsb0NBQW9DLGlDQUFpQyxrQ0FBa0MsNkJBQTZCLGdEQUFnRCxxQ0FBcUMsc0JBQXNCLElBQUksc0xBQXNMLGtEQUFrRCxTQUFTLFdBQVcsa0ZBQWtGLG1CQUFtQixrQkFBa0IsMkJBQTJCLFFBQVEscUlBQXFJLDJCQUEyQixNQUFNLG9CQUFvQixTQUFTLDRCQUE0QixLQUFLLGlCQUFpQixJQUFJLG9CQUFvQixVQUFVLFNBQVMsZUFBZSxJQUFJLHNDQUFzQyxrREFBa0QsU0FBUyx5QkFBeUIsWUFBWSxpRkFBaUYseUJBQXlCLGdDQUFnQyxxQkFBcUIsbUNBQW1DLElBQUksZ0JBQWdCLG9CQUFvQixzQkFBc0IsaUNBQWlDLElBQUksaUNBQWlDLFNBQVMscUJBQXFCLGlCQUFpQix1QkFBdUIsSUFBSSxxQ0FBcUMsaURBQWlELFlBQVksa0JBQWtCLCtLQUErSyxvQ0FBb0MsRUFBRSxrQkFBa0IsaUlBQWlJLHVCQUF1QixLQUFLLHlFQUF5RSx1QkFBdUIsSUFBSSx5QkFBeUIsU0FBUyw4S0FBOEssSUFBSSx3ZkFBd2YsdWNBQXVjLHNFQUFzRSxJQUFJLDhGQUE4RixJQUFJLGlEQUFpRCw0QkFBNEIsMkZBQTJGLDJFQUEyRSwrRkFBK0YsZUFBZSxJQUFJLG1CQUFtQiw2REFBNkQsRUFBRSwrQkFBK0IsRUFBRSxJQUFJLDZFQUE2RSxTQUFTLEdBQUcsNkJBQTZCLHFCQUFxQixlQUFlLG1CQUFtQixxQkFBcUIsZUFBZSxxQkFBcUIsd0RBQXdELGlFQUFpRSx3QkFBd0Isb0NBQW9DLFVBQVUscUNBQXFDLCtCQUErQix3RUFBd0UsS0FBSyxzREFBc0QsZ0hBQWdILHFGQUFxRiwwQ0FBMEMsMklBQTJJLCtDQUErQyxjQUFjLElBQUksMENBQTBDLFNBQVMsUUFBUSxRQUFRLGlDQUFpQyxrQ0FBa0MsY0FBYyxTQUFTLHVCQUF1QixvRUFBb0UsZUFBZSxpQkFBaUIsZUFBZSxrQ0FBa0MsSUFBSSxhQUFhLFNBQVMsU0FBUyxRQUFRLGtEQUFrRCxpQkFBaUIsOEJBQThCLCtCQUErQixpQkFBaUIsNEVBQTRFLGNBQWMsNkNBQTZDLGNBQWMsZUFBZSxtQkFBbUIsc0RBQXNELGVBQWUsbUJBQW1CLCtCQUErQiwrQ0FBK0MsZUFBZSxtQkFBbUIsc05BQXNOLGVBQWUsc0JBQXNCLDZCQUE2QixvQ0FBb0MseUNBQXlDLEVBQUUsRUFBRSxlQUFlLHdEQUF3RCx3QkFBd0Isd0JBQXdCLGtFQUFrRSx3Q0FBd0MsOEJBQThCLGlDQUFpQyxnUEFBZ1Asc0pBQXNKLDhCQUE4QixvREFBb0Qsd0NBQXdDLDhFQUE4RSxxRkFBcUYsa0ZBQWtGLHFDQUFxQyx1QkFBdUIsbUJBQW1CLGlDQUFpQyx5QkFBeUIsNENBQTRDLDBCQUEwQixpQkFBaUIsMkJBQTJCLHVCQUF1QixtQkFBbUIsdUVBQXVFLHVCQUF1Qix5QkFBeUIsNENBQTRDLGdDQUFnQyxNQUFNLHVEQUF1RCw2QkFBNkIsc0VBQXNFLFVBQVUsa0RBQWtELDhHQUE4RyxlQUFlLDJDQUEyQyxZQUFZLHlDQUF5QyxTQUFTLFNBQVMsc0RBQXNELHNGQUFzRiwrREFBK0QsTUFBTSw2cEJBQTZwQixpQkFBaUIsZ0dBQWdHLCtCQUErQiw0V0FBNFcsbUpBQW1KLHVFQUF1RSxvSkFBb0osMkRBQTJELDRIQUE0SCxlQUFlLDRDQUE0QyxTQUFTLG1CQUFtQix1QkFBdUIsNERBQTRELGlQQUFpUCxlQUFlLHVCQUF1QixvREFBb0QsMkRBQTJELHdCQUF3QixJQUFJLGtDQUFrQyxJQUFJLGtDQUFrQyxzQkFBc0IsOENBQThDLElBQUksMEJBQTBCLHlCQUF5QixrQ0FBa0MsZ0ZBQWdGLGtCQUFrQix5RUFBeUUsU0FBUyxRQUFRLGlDQUFpQywyQkFBMkIsMkNBQTJDLHVCQUF1Qiw4QkFBOEIsK0ZBQStGLDJHQUEyRyx1QkFBdUIsNEJBQTRCLHNCQUFzQiw2REFBNkQsMkJBQTJCLG1CQUFtQixrRUFBa0UsdUNBQXVDLDJCQUEyQixnQkFBZ0IsMEJBQTBCLDRCQUE0QixNQUFNLHlCQUF5Qix1REFBdUQsbUJBQW1CLEVBQUUsd0JBQXdCLHdDQUF3Qyw0QkFBNEIsU0FBUyxrQkFBa0Isb0RBQW9ELFFBQVEsV0FBVyxLQUFLLDBCQUEwQixNQUFNLGlCQUFpQixNQUFNLCtCQUErQixNQUFNLHVCQUF1QixZQUFZLGlCQUFpQix5SEFBeUgsbUJBQW1CLGlNQUFpTSxvQkFBb0Isb0JBQW9CLG9MQUFvTCxTQUFTLGdCQUFnQixxQ0FBcUMseUJBQXlCLFNBQVMsYUFBYSxpREFBaUQsbUJBQW1CLGVBQWUscUVBQXFFLDBIQUEwSCxFQUFFLHNCQUFzQixtQkFBbUIsbUJBQW1CLGlRQUFpUSwyQkFBMkIsa0VBQWtFLGdDQUFnQyxxQkFBcUIsaUJBQWlCLG1IQUFtSCxNQUFNLE1BQU0sU0FBUyxJQUFJLHVFQUF1RSxrQ0FBa0MsU0FBUyx3Q0FBd0MsZ0NBQWdDLGlDQUFpQyxvREFBb0Qsc0VBQXNFLGFBQWEsT0FBTywyQ0FBMkMsaUNBQWlDLHlKQUF5SixpQ0FBaUMsMEJBQTBCLG1DQUFtQyxzQkFBc0Isd0ZBQXdGLHdHQUF3RywwQkFBMEIsc0NBQXNDLGNBQWMsZ0JBQWdCLEtBQUssVUFBVSxtQkFBbUIscUNBQXFDLGlDQUFpQyxrQ0FBa0MscUNBQXFDLGtCQUFrQixnREFBZ0QscUJBQXFCLG1CQUFtQix5QkFBeUIsMEJBQTBCLHNDQUFzQywyQ0FBMkMsc0JBQXNCLG9HQUFvRyxNQUFNLEdBQUcscUhBQXFILHdDQUF3QyxVQUFVLHFCQUFxQixrQ0FBa0MsNEJBQTRCLGtCQUFrQixhQUFhLG1CQUFtQix5RkFBeUYsb0RBQW9ELCtCQUErQiwyREFBMkQsc0JBQXNCLGdFQUFnRSxtQkFBbUIsbUJBQW1CLEVBQUUseUNBQXlDLFNBQVMsb0JBQW9CLDBCQUEwQixvQkFBb0IsMEJBQTBCLG1CQUFtQiwwQkFBMEIsb0JBQW9CLCtCQUErQixtREFBbUQsa0JBQWtCLE1BQU0sd0hBQXdILHFCQUFxQixVQUFVLHdCQUF3QixZQUFZLHdCQUF3QixrQkFBa0Isd0JBQXdCLFlBQVksSUFBSSxlQUFlLFNBQVMsdUJBQXVCLFlBQVksSUFBSSxlQUFlLFNBQVMsd0JBQXdCLDBCQUEwQixPQUFPLFdBQVcsU0FBUyx3QkFBd0Isb0JBQW9CLE1BQU0sV0FBVyxTQUFTLEdBQUcsNEJBQTRCLGtEQUFrRCxvQkFBb0IsU0FBUyxtQkFBbUIsb0JBQW9CLGVBQWUsZUFBZSw0QkFBNEIsSUFBSSxrQkFBa0IsU0FBUyxtQkFBbUIsd0RBQXdELCtCQUErQixrREFBa0QsU0FBUyxpQkFBaUIsa0JBQWtCLE1BQU0sdURBQXVELDZEQUE2RCxpQ0FBaUMsNENBQTRDLEtBQUssaURBQWlELGlDQUFpQyxVQUFVLGVBQWUsa0NBQWtDLGVBQWUsbUNBQW1DLFNBQVMsTUFBTSx1QkFBdUIsd0NBQXdDLElBQUksdURBQXVELFNBQVMseUJBQXlCLHNFQUFzRSxvREFBb0QsdUJBQXVCLElBQUksaUJBQWlCLFNBQVMsa0ZBQWtGLG9CQUFvQixpQ0FBaUMsMkNBQTJDLE1BQU0sU0FBUyxNQUFNLGdCQUFnQixtQ0FBbUMsaUJBQWlCLFdBQVcsNERBQTRELHFFQUFxRSxFQUFFLGVBQWUsK0ZBQStGLGFBQWEsd0JBQXdCLGdCQUFnQiwwQkFBMEIseURBQXlELGdCQUFnQixFQUFFLElBQUksK0NBQStDLEtBQUssd0RBQXdELFVBQVUsSUFBSSxtQ0FBbUMsb0RBQW9ELCtCQUErQiw2RUFBNkUsVUFBVSxhQUFhLHdGQUF3Riw2QkFBNkIsMkJBQTJCLHVCQUF1QixTQUFTLG1IQUFtSCxpQ0FBaUMsNEZBQTRGLHlCQUF5Qix1QkFBdUIsWUFBWSxnREFBZ0QsNEJBQTRCLHFDQUFxQyxPQUFPLHVCQUF1Qiw4Q0FBOEMsZ0VBQWdFLDJHQUEyRyxzQkFBc0Isc0JBQXNCLEtBQUssU0FBUyx1Q0FBdUMsK0JBQStCLFVBQVUsTUFBTSxTQUFTLGlDQUFpQyxrQkFBa0IsSUFBSSwwQkFBMEIsTUFBTSw4Q0FBOEMsUUFBUSwrREFBK0Qsc0JBQXNCLHlCQUF5QixTQUFTLCtCQUErQixpRUFBaUUseUJBQXlCLG9HQUFvRyxtRUFBbUUsc0RBQXNELG9DQUFvQyxXQUFXLHFDQUFxQyw4RkFBOEYsNERBQTRELFFBQVEsa0VBQWtFLHdHQUF3RyxnRUFBZ0UsaUJBQWlCLDhFQUE4RSwrQ0FBK0MsNERBQTRELCtCQUErQiw0R0FBNEcsOEJBQThCLGdFQUFnRSxpQkFBaUIsd0NBQXdDLHdCQUF3QixNQUFNLDBGQUEwRixLQUFLLElBQUksOEtBQThLLHNCQUFzQixzQkFBc0Isa0RBQWtELHVCQUF1QixVQUFVLFNBQVMsaUJBQWlCLGFBQWEsRUFBRSxpREFBaUQsU0FBUyw2QkFBNkIsZ0JBQWdCLDhEQUE4RCx3RUFBd0Usa0JBQWtCLG1DQUFtQywwQkFBMEIsa0NBQWtDLGlCQUFpQiwwQ0FBMEMseUJBQXlCLGtCQUFrQix5QkFBeUIsV0FBVyxrSUFBa0ksc0JBQXNCLEdBQUcsY0FBYyxpQkFBaUIsNkJBQTZCLG1FQUFtRSxRQUFRLElBQUksc0NBQXNDLEdBQUcsNkJBQTZCLElBQUkscUJBQXFCLDZCQUE2QixvQkFBb0Isd0NBQXdDLGlCQUFpQix3Q0FBd0MsZ0JBQWdCLG9FQUFvRSxFQUFFLDhDQUE4QywyQkFBMkIsUUFBUSxrQkFBa0IsOEJBQThCLHFKQUFxSixTQUFTLHdMQUF3TCxZQUFZLGlFQUFpRSwyR0FBMkcsd0JBQXdCLDBDQUEwQyx5Q0FBeUMsZ0JBQWdCLGdDQUFnQyxTQUFTLGFBQWEsZ0JBQWdCLDJCQUEyQiw4QkFBOEIsWUFBWSxJQUFJLHNDQUFzQyxFQUFFLHVCQUF1Qix3REFBd0QsbUJBQW1CLElBQUksa0JBQWtCLFNBQVMsZ0dBQWdHLFVBQVUsTUFBTSxvREFBb0QsbUJBQW1CLDJJQUEySSxtQkFBbUIsZ0VBQWdFLHFCQUFxQixvRUFBb0UsVUFBVSxtQkFBbUIsbUJBQW1CLGlDQUFpQyxxQkFBcUIseUJBQXlCLDhCQUE4QiwyQkFBMkIsa0JBQWtCLDBCQUEwQixrQkFBa0IsOEJBQThCLHFCQUFxQiwwQkFBMEIscUJBQXFCLDhCQUE4QiwyQkFBMkIsNEJBQTRCLDJCQUEyQixnQ0FBZ0Msc0JBQXNCLDBCQUEwQixnQkFBZ0Isc0JBQXNCLHVCQUF1QixzQkFBc0IscUlBQXFJLGVBQWUsc0JBQXNCLHNCQUFzQiw2SkFBNkosRUFBRSwwQkFBMEIsY0FBYyxTQUFTLGNBQWMsUUFBUSxvQkFBb0IsTUFBTSxJQUFJLHNHQUFzRyxTQUFTLHFCQUFxQix3QkFBd0IsUUFBUSw4QkFBOEIscUNBQXFDLFFBQVEsZ0JBQWdCLElBQUksd0NBQXdDLHVCQUF1QixTQUFTLE1BQU0sWUFBWSxnRkFBZ0YscUNBQXFDLElBQUksZUFBZSx5REFBeUQsdUJBQXVCLHNFQUFzRSxFQUFFLDZCQUE2QixtQkFBbUIsc0NBQXNDLE1BQU0sc0RBQXNELE9BQU8saUJBQWlCLHNDQUFzQyxrQkFBa0Isc0JBQXNCLG9CQUFvQiwwQkFBMEIscUJBQXFCLFNBQVMsaUJBQWlCLGtDQUFrQyxtQkFBbUIsVUFBVSx3QkFBd0Isb0VBQW9FLGlCQUFpQix1Q0FBdUMsa0JBQWtCLFlBQVksU0FBUyxXQUFXLHFCQUFxQixzUUFBc1EsaUJBQWlCLFNBQVMsbUJBQW1CLDhDQUE4QyxxQkFBcUIsc0JBQXNCLGlCQUFpQixnQkFBZ0IsOEJBQThCLHVCQUF1QiwwQkFBMEIsbUJBQW1CLGlDQUFpQyxtSEFBbUgsRUFBRSxTQUFTLFlBQVksc0JBQXNCLFFBQVEsb0JBQW9CLGtCQUFrQixvQ0FBb0MsUUFBUSxXQUFXLGtGQUFrRiw4TUFBOE0sa0JBQWtCLElBQUksSUFBSSxTQUFTLHlIQUF5SCwyRkFBMkYsOEJBQThCLG9HQUFvRyxZQUFZLHFCQUFxQixnQ0FBZ0MsTUFBTSw4QkFBOEIsa0JBQWtCLGtDQUFrQyxJQUFJLG9HQUFvRywyREFBMkQsMkJBQTJCLGdDQUFnQyxrQkFBa0IsdUZBQXVGLG1CQUFtQixnRkFBZ0YsMkdBQTJHLGdDQUFnQyxvQkFBb0IsRUFBRSwrREFBK0QsdUNBQXVDLGdIQUFnSCw4QkFBOEIsd0JBQXdCLFFBQVEsR0FBRyxtQkFBbUIsYUFBYSxzRkFBc0YsdUJBQXVCLHNDQUFzQyxvQkFBb0IsT0FBTyxXQUFXLHlDQUF5Qyw2RkFBNkYscU1BQXFNLDhCQUE4Qiw2QkFBNkIsd0RBQXdELHlGQUF5RixzQkFBc0IsV0FBVyxJQUFJLDJDQUEyQyxxQ0FBcUMseUJBQXlCLGdCQUFnQix1QkFBdUIsY0FBYyx1Q0FBdUMsa0JBQWtCLHFEQUFxRCxhQUFhLCtCQUErQixxQkFBcUIsa0JBQWtCLHNCQUFzQixlQUFlLDJFQUEyRSx3QkFBd0IsTUFBTSxxQkFBcUIsc0JBQXNCLGdDQUFnQyw2QkFBNkIsU0FBUyxtQkFBbUIsdUVBQXVFLHdCQUF3QixvR0FBb0csc0JBQXNCLHdCQUF3QixlQUFlLGVBQWUsdUVBQXVFLHlCQUF5Qiw4RkFBOEYscUJBQXFCLHNCQUFzQix5Q0FBeUMsNkJBQTZCLFNBQVMsMkJBQTJCLGtCQUFrQixRQUFRLG1IQUFtSCxJQUFJLHdGQUF3RixVQUFVLGFBQWEsY0FBYyxTQUFTLFVBQVUsb0JBQW9CLGtDQUFrQyxzQkFBc0IsdUJBQXVCLDBCQUEwQixjQUFjLHVCQUF1Qix1QkFBdUIsMkJBQTJCLGVBQWUsZUFBZSxtQkFBbUIsc0NBQXNDLGVBQWUsdUVBQXVFLFdBQVcsa0ZBQWtGLDJCQUEyQixTQUFTLDhDQUE4QyxjQUFjLHFCQUFxQixNQUFNLCtFQUErRSxxQkFBcUIsZ0JBQWdCLEVBQUUsb0NBQW9DLHdCQUF3Qiw0QkFBNEIsaUJBQWlCLEdBQUcsWUFBWSxzQkFBc0IsTUFBTSxzSEFBc0gsdUJBQXVCLFVBQVUsK0RBQStELDRHQUE0RyxlQUFlLDJCQUEyQiwyQkFBMkIscUJBQXFCLGlDQUFpQyxnREFBZ0QsMEJBQTBCLEVBQUUsR0FBRyxlQUFlLG9CQUFvQixRQUFRLHNIQUFzSCx3QkFBd0IsdUVBQXVFLEVBQUUscUJBQXFCLDRCQUE0QixrQkFBa0IsRUFBRSx3QkFBd0IsOEJBQThCLHVCQUF1QiwyREFBMkQsMkJBQTJCLDZDQUE2Qyx3RUFBd0UseUJBQXlCLEVBQUUsZ0xBQWdMLHFDQUFxQyxLQUFLLGFBQWEsZ0NBQWdDLDBFQUEwRSxFQUFFLHFCQUFxQixpR0FBaUcscUJBQXFCLDRCQUE0QixlQUFlLFlBQVkscUJBQXFCLDZHQUE2RyxnQkFBZ0IsdUJBQXVCLGtFQUFrRSw4QkFBOEIsdUZBQXVGLFVBQVUsaUJBQWlCLDBDQUEwQyxJQUFJLCtYQUErWCxRQUFRLElBQUksMENBQTBDLFNBQVMsYUFBYSxnQkFBZ0IsbUJBQW1CLGlCQUFpQixnQkFBZ0Isb0JBQW9CLHlFQUF5RSx1Q0FBdUMsR0FBRyxFQUFFLGlIQUFpSCx5YUFBeWEsUUFBUSxvTUFBb00saUJBQWlCLE1BQU0sK0xBQStMLGlCQUFpQix1QkFBdUIsSUFBSSwwREFBMEQsK0lBQStJLGlCQUFpQixFQUFFLHVCQUF1QixxRUFBcUUsSUFBSSxzRUFBc0Usb0JBQW9CLHlKQUF5Six3QkFBd0Isd0RBQXdELGlDQUFpQyxxQkFBcUIsb0RBQW9ELDREQUE0RCxJQUFJLDhDQUE4QyxTQUFTLDZCQUE2QixjQUFjLFNBQVMsY0FBYyxTQUFTLGlCQUFpQixzQkFBc0IsSUFBSSx1QkFBdUIsV0FBVyxrQkFBa0IseUJBQXlCLFFBQVEsdUJBQXVCLG1FQUFtRSxTQUFTLGlIQUFpSCxvQkFBb0Isa0NBQWtDLDBDQUEwQyxvREFBb0QsMEJBQTBCLEVBQUUsbUJBQW1CLGtDQUFrQyxpQ0FBaUMsd0JBQXdCLDJCQUEyQixtQ0FBbUMsb0NBQW9DLGdIQUFnSCx5RUFBeUUsOEJBQThCLHdFQUF3RSxpQ0FBaUMsNENBQTRDLFNBQVMsU0FBUyx5QkFBeUIscUNBQXFDLFNBQVMseUxBQXlMLG1HQUFtRyxzQ0FBc0Msa0dBQWtHLDREQUE0RCxhQUFhLGtJQUFrSSxpUUFBaVEsNEJBQTRCLG1EQUFtRCxvQkFBb0Isb0NBQW9DLDRFQUE0RSx3QkFBd0IsMEhBQTBILHlNQUF5TSx3R0FBd0csZ0RBQWdELGlEQUFpRCxzQkFBc0IsdUpBQXVKLGVBQWUsbUJBQW1CLHNCQUFzQiwwRUFBMEUsc0NBQXNDLDZDQUE2QywyQkFBMkIseU1BQXlNLG9HQUFvRyw2REFBNkQsd0JBQXdCLGdEQUFnRCx3REFBd0QsU0FBUyw2RUFBNkUsYUFBYSxLQUFLLElBQUksb0lBQW9JLGtCQUFrQixrQkFBa0IsRUFBRSxrQ0FBa0MsMkJBQTJCLElBQUksdUJBQXVCLDJDQUEyQyxrREFBa0QsbURBQW1ELFlBQVksbURBQW1ELGlCQUFpQiw4QkFBOEIsa0RBQWtELEdBQUcsRUFBRSxpQkFBaUIscUNBQXFDLFVBQVUsTUFBTSxZQUFZLFFBQVEsa0JBQWtCLGNBQWMsbUVBQW1FLHFCQUFxQixjQUFjLGdFQUFnRSxzQkFBc0IsZUFBZSwyRUFBMkUsZUFBZSx5QkFBeUIsOEVBQThFLCtCQUErQixrREFBa0QsdUJBQXVCLHNEQUFzRCxnWUFBZ1ksb0JBQW9CLDRJQUE0SSx5QkFBeUIsb0VBQW9FLDRCQUE0Qix5QkFBeUIsdUVBQXVFLHFDQUFxQyx5QkFBeUIsaUhBQWlILFNBQVMsOFZBQThWLDBCQUEwQixnQ0FBZ0MsZUFBZSxvQkFBb0IsaUJBQWlCLHdCQUF3QixvQkFBb0IscUJBQXFCLHFCQUFxQixTQUFTLGlCQUFpQixVQUFVLGtHQUFrRyxlQUFlLG9CQUFvQiw2Q0FBNkMsc0NBQXNDLDZHQUE2RyxlQUFlLHFCQUFxQix3QkFBd0IsdUJBQXVCLDBCQUEwQixxQkFBcUIsUUFBUSw4SkFBOEosdUJBQXVCLDhCQUE4QixZQUFZLHVGQUF1RiwyQkFBMkIsR0FBRyxFQUFFLG9IQUFvSCxpQkFBaUIsMEZBQTBGLGVBQWUsMkRBQTJELGVBQWUsMkZBQTJGLGlCQUFpQixnQkFBZ0IsbUJBQW1CLGtHQUFrRyxJQUFJLDZCQUE2QiwwQ0FBMEMsaUJBQWlCLHFCQUFxQixPQUFPLG1EQUFtRCxtRkFBbUYsY0FBYyw4Q0FBOEMsRUFBRSw4RkFBOEYsMENBQTBDLElBQUksa0ZBQWtGLHVEQUF1RCxJQUFJLHFLQUFxSyx1Q0FBdUMseUNBQXlDLFNBQVMsbUJBQW1CLGtDQUFrQyxlQUFlLG1IQUFtSCxTQUFTLFVBQVUsMEJBQTBCLFNBQVMsdUJBQXVCLDRDQUE0QywwR0FBMEcsSUFBSSxrS0FBa0ssbURBQW1ELElBQUksa0JBQWtCLGFBQWEsK0RBQStELHVCQUF1QixvQ0FBb0Msa0JBQWtCLGFBQWEsbUJBQW1CLG1GQUFtRixvQkFBb0Isc0NBQXNDLGVBQWUsbUJBQW1CLHFCQUFxQixvQkFBb0Isa0JBQWtCLGtCQUFrQiwwQkFBMEIsNERBQTRELCtFQUErRSxFQUFFLDBCQUEwQixtQkFBbUIscUNBQXFDLG9GQUFvRixFQUFFLG9CQUFvQixxQ0FBcUMsNkRBQTZELGlCQUFpQixnQ0FBZ0MsRUFBRSxtQkFBbUIscUNBQXFDLHNEQUFzRCxFQUFFLGtCQUFrQixxQ0FBcUMsa0VBQWtFLEVBQUUsa0JBQWtCLGNBQWMsa0JBQWtCLDZEQUE2RCxZQUFZLHFCQUFxQixzREFBc0QseUJBQXlCLEVBQUUsa0JBQWtCLDBCQUEwQixpQkFBaUIsbUJBQW1CLGlEQUFpRCxpRkFBaUYscUJBQXFCLElBQUksS0FBSyxJQUFJLHNCQUFzQixrREFBa0QsSUFBSSxXQUFXLDBCQUEwQiwwQkFBMEIsd0JBQXdCLFNBQVMscUNBQXFDLHNCQUFzQix1RUFBdUUsS0FBSyxVQUFVLHlHQUF5RyxlQUFlLG9CQUFvQix1Q0FBdUMsS0FBSyxpRUFBaUUsMEJBQTBCLEVBQUUsZ0VBQWdFLGtDQUFrQyxnREFBZ0Qsb0JBQW9CLGFBQWEsMkNBQTJDLHVDQUF1QyxTQUFTLGlDQUFpQyxtQkFBbUIsc0JBQXNCLHVRQUF1USxpQkFBaUIsT0FBTyxlQUFlLGlEQUFpRCxrQkFBa0IsWUFBWSxhQUFhLE1BQU0sbUNBQW1DLGNBQWMsV0FBVyxlQUFlLFVBQVUsNkNBQTZDLGNBQWMsc0JBQXNCLGdCQUFnQixZQUFZLFdBQVcsWUFBWSxVQUFVLHlDQUF5Qyw0QkFBNEIsOEtBQThLLGNBQWMsaUNBQWlDLGtFQUFrRSw0SkFBNEosNkJBQTZCLGFBQWEsMkJBQTJCLGFBQWEsMEJBQTBCLGFBQWEsK0JBQStCLGFBQWEsMEJBQTBCLGFBQWEsaUNBQWlDLFlBQVksZ0lBQWdJLGNBQWMscVVBQXFVLEdBQUcsR0FBRyxtRUFBbUUsZUFBZSwyQkFBMkIsdUNBQXVDLGdEQUFnRCx1Q0FBdUMsUUFBUSxnREFBZ0Qsd0RBQXdELEtBQUssb0NBQW9DLG1CQUFtQixpQkFBaUIsZ0RBQWdELHlCQUF5Qiw4QkFBOEIsdUNBQXVDLEtBQUssSUFBSSw2UkFBNlIsb0dBQW9HLG1CQUFtQiw2SUFBNkksZUFBZSxlQUFlLFNBQVMsd1NBQXdTLHVCQUF1Qix3Q0FBd0MsVUFBVSxVQUFVLFNBQVMsa0JBQWtCLE1BQU0sc0JBQXNCLHNCQUFzQixZQUFZLGlSQUFpUixZQUFZLHlCQUF5QiwrQ0FBK0Msd0NBQXdDLGlIQUFpSCxrU0FBa1MsdUJBQXVCLGlCQUFpQixpTkFBaU4sMENBQTBDLGVBQWUsb0JBQW9CLGlJQUFpSSxpQkFBaUIsRUFBRSxxQkFBcUIsbUlBQW1JLGlNQUFpTSw4REFBOEQsaUZBQWlGLGFBQWEsWUFBWSxzQ0FBc0MsUUFBUSxVQUFVLG9DQUFvQyxlQUFlLGlCQUFpQixtQkFBbUIsZ0JBQWdCLHVDQUF1QyxJQUFJLG9DQUFvQyxVQUFVLHdDQUF3QyxlQUFlLGtCQUFrQiw4QkFBOEIsWUFBWSxLQUFLLHFCQUFxQix1QkFBdUIsSUFBSSwrQkFBK0IsU0FBUyw0Q0FBNEMsMEJBQTBCLDJCQUEyQiwwQ0FBMEMsd0pBQXdKLGdCQUFnQiw4QkFBOEIsNERBQTRELGlCQUFpQixnQ0FBZ0MsMFNBQTBTLDZDQUE2QyxVQUFVLGdCQUFnQixNQUFNLHdJQUF3SSxpQkFBaUIsMktBQTJLLHFDQUFxQyxnQkFBZ0IsNERBQTRELFdBQVcsbUJBQW1CLFNBQVMsbUJBQW1CLCtCQUErQixrQkFBa0IscUNBQXFDLDZEQUE2RCxjQUFjLG9IQUFvSCxjQUFjLCtCQUErQixVQUFVLGdCQUFnQixpQkFBaUIsYUFBYSxVQUFVLFlBQVksSUFBSSw4Q0FBOEMsa0NBQWtDLG1CQUFtQix5RUFBeUUsSUFBSSxtQ0FBbUMsbUJBQW1CLG9FQUFvRSxjQUFjLGVBQWUsY0FBYyxzR0FBc0csSUFBSSx1QkFBdUIsNkZBQTZGLGNBQWMsd0JBQXdCLHNCQUFzQixnQkFBZ0IsMEJBQTBCLHNIQUFzSCxtRUFBbUUsMEJBQTBCLGtCQUFrQiw4QkFBOEIsaUJBQWlCLFNBQVMsSUFBSSx1QkFBdUIsc0ZBQXNGLFlBQVksbUJBQW1CLGNBQWMsb01BQW9NLFlBQVkseUJBQXlCLElBQUksMEhBQTBILDBMQUEwTCxpQ0FBaUMsS0FBSyx5QkFBeUIsVUFBVSxtQkFBbUIsNEJBQTRCLG1DQUFtQyxFQUFFLHVCQUF1QixnQ0FBZ0MseUJBQXlCLElBQUksdUVBQXVFLDZCQUE2QiwyREFBMkQsbURBQW1ELGtIQUFrSCxnQkFBZ0IsbUNBQW1DLG9CQUFvQixvREFBb0QsRUFBRSwyQkFBMkIsd0RBQXdELDBDQUEwQyxLQUFLLDJCQUEyQixtWEFBbVgsWUFBWSw0SEFBNEgsNkVBQTZFLGtFQUFrRSxVQUFVLG1EQUFtRCw2REFBNkQsMEVBQTBFLDBCQUEwQixrREFBa0QsMEJBQTBCLHVDQUF1QyxLQUFLLGdFQUFnRSw0T0FBNE8sNERBQTRELEdBQUcsY0FBYyx5QkFBeUIsOERBQThELFVBQVUsUUFBUSwyQkFBMkIsdURBQXVELHlCQUF5QixPQUFPLHVDQUF1QyxxRUFBcUUsc0JBQXNCLGtCQUFrQixhQUFhLG9CQUFvQiw0RkFBNEYsNERBQTRELDhCQUE4QixxREFBcUQsZUFBZSxJQUFJLG1GQUFtRix5QkFBeUIsRUFBRSxvQkFBb0IsK0NBQStDLGlGQUFpRiw4RUFBOEUsSUFBSSxzRUFBc0UsUUFBUSxJQUFJLDhDQUE4QyxnQkFBZ0IsR0FBRyxnREFBZ0QsY0FBYyx3QkFBd0IsMEZBQTBGLFVBQVUseUVBQXlFLGVBQWUsVUFBVSxlQUFlLGFBQWEsa0JBQWtCLGVBQWUsd0JBQXdCLDhCQUE4QixtQ0FBbUMscUJBQXFCLGtCQUFrQixXQUFXLDBDQUEwQyxnQ0FBZ0Msd0JBQXdCLDhCQUE4Qix3Q0FBd0MsaUJBQWlCLHNCQUFzQixRQUFRLGNBQWMsK0JBQStCLDBCQUEwQixzRUFBc0Usd0JBQXdCLGtCQUFrQixtQkFBbUIsRUFBRSwwUEFBMFAsNEJBQTRCLGFBQWEsbUJBQW1CLDZDQUE2Qyx3QkFBd0IsNEJBQTRCLHFCQUFxQixHQUFHLFlBQVkscUJBQXFCLHFCQUFxQix3V0FBd1csWUFBWSxNQUFNLGtCQUFrQiw2Q0FBNkMsY0FBYyxvREFBb0QsMEJBQTBCLDBCQUEwQiwwREFBMEQsTUFBTSxvQkFBb0Isc0RBQXNELDZEQUE2RCx5QkFBeUIsc0JBQXNCLDBCQUEwQiwrREFBK0QsRUFBRSxnRUFBZ0UsZUFBZSxpQ0FBaUMsZUFBZSxtREFBbUQsZUFBZSw2REFBNkQsYUFBYSxtQkFBbUIsNkNBQTZDLHdCQUF3Qiw0QkFBNEIsNkJBQTZCLEdBQUcsWUFBWSxxQkFBcUIscUJBQXFCLGdNQUFnTSxZQUFZLFVBQVUsZ0JBQWdCLGdDQUFnQyxnRkFBZ0YsVUFBVSxxQ0FBcUMsd0NBQXdDLGdCQUFnQixtQkFBbUIsd0RBQXdELGlCQUFpQixtQkFBbUIsK0RBQStELGlKQUFpSixtQ0FBbUMsZUFBZSxxQkFBcUIsc0JBQXNCLHFDQUFxQywwQ0FBMEMsRUFBRSxrRkFBa0YsSUFBSSxrREFBa0QseUNBQXlDLFlBQVkseUJBQXlCLHNCQUFzQixxQ0FBcUMsNkNBQTZDLEVBQUUsa0RBQWtELGtGQUFrRixJQUFJLHdFQUF3RSx5Q0FBeUMsWUFBWSwyQkFBMkIsZ0RBQWdELCtGQUErRixpREFBaUQsdUJBQXVCLFlBQVksTUFBTSxzQkFBc0IsNERBQTRELHlLQUF5SyxFQUFFLHNCQUFzQixZQUFZLFlBQVksZ0ZBQWdGLFVBQVUsRUFBRSxhQUFhLGFBQWEsZ0JBQWdCLG9CQUFvQixzREFBc0QsTUFBTSxzSUFBc0ksdUJBQXVCLGtJQUFrSSxnTEFBZ0wsWUFBWSxVQUFVLFFBQVEsZ0JBQWdCLDZCQUE2QixnQ0FBZ0MsU0FBUyxnQkFBZ0IsNkZBQTZGLGtCQUFrQixJQUFJLHVHQUF1RywyQkFBMkIsVUFBVSxTQUFTLG1CQUFtQixnREFBZ0QsK0VBQStFLG9DQUFvQyx5Q0FBeUMsa0JBQWtCLGtCQUFrQixpRUFBaUUsOENBQThDLG1EQUFtRCxFQUFFLDRCQUE0Qix3REFBd0QscUJBQXFCLGtCQUFrQiwwQkFBMEIsMkdBQTJHLDBiQUEwYiw0Q0FBNEMsMkJBQTJCLHVEQUF1RCxFQUFFLDZCQUE2QixtRUFBbUUsSUFBSSx1UEFBdVAsOFRBQThULDBCQUEwQiw4QkFBOEIsc0JBQXNCLEVBQUUsMkJBQTJCLGVBQWUsc0JBQXNCLDRCQUE0QiwwQkFBMEIsRUFBRSw4QkFBOEIsY0FBYyx1Q0FBdUMscUJBQXFCLGdDQUFnQyxlQUFlLGtCQUFrQiw2Q0FBNkMsb0JBQW9CLGlCQUFpQiw4REFBOEQscURBQXFELHFCQUFxQixnRUFBZ0Usa0VBQWtFLEVBQUUsc0JBQXNCLGdCQUFnQixTQUFTLHVCQUF1QixRQUFRLHNDQUFzQyxJQUFJLGtEQUFrRCxVQUFVLHNIQUFzSCxxQkFBcUIsb0JBQW9CLDhHQUE4RyxxQkFBcUIsTUFBTSwyQ0FBMkMsNEVBQTRFLEVBQUUsa0NBQWtDLHlDQUF5QyxzQkFBc0IsMkJBQTJCLGlCQUFpQix3RUFBd0Usb0JBQW9CLHVFQUF1RSx3QkFBd0IsRUFBRSwrQkFBK0IsbUJBQW1CLGNBQWMscUJBQXFCLHNDQUFzQywyQkFBMkIsMkJBQTJCLDhCQUE4Qiw2QkFBNkIsb0JBQW9CLGdCQUFnQiw2R0FBNkcsb0JBQW9CLG9CQUFvQix5REFBeUQsT0FBTyx3Q0FBd0MsR0FBRyx3Q0FBd0MsU0FBUyxFQUFFLCtHQUErRyxNQUFNLDZDQUE2QyxlQUFlLHFCQUFxQixnQ0FBZ0MseUNBQXlDLDBHQUEwRyxxQkFBcUIsUUFBUSxVQUFVLGNBQWMsTUFBTSw2Q0FBNkMsZUFBZSxtRkFBbUYsSUFBSSwwQ0FBMEMsaUJBQWlCLHlDQUF5QywyQ0FBMkMsWUFBWSw2QkFBNkIsMEJBQTBCLHdCQUF3QixRQUFRLGVBQWUsOExBQThMLHlCQUF5QixtSEFBbUgsV0FBVyw0Q0FBNEMsaUJBQWlCLDBEQUEwRCxhQUFhLDRFQUE0RSxjQUFjLG1CQUFtQix5QkFBeUIseURBQXlELDhEQUE4RCwyQ0FBMkMsd0NBQXdDLGtJQUFrSSxLQUFLLEtBQUssaUJBQWlCLDJDQUEyQyxNQUFNLE1BQU0sT0FBTyxLQUFLLDBGQUEwRix5QkFBeUIsaUNBQWlDLGtDQUFrQyxnQkFBZ0IsZ0NBQWdDLHlFQUF5RSw4QkFBOEIsb0NBQW9DLHdCQUF3QixNQUFNLGdDQUFnQyxpQ0FBaUMsWUFBWSxtQkFBbUIsV0FBVyxtQ0FBbUMsc01BQXNNLHVCQUF1QixJQUFJLDBGQUEwRixTQUFTLGtCQUFrQixrSEFBa0gsMDNCQUEwM0IsMEVBQTBFLHFFQUFxRSxpRkFBaUYsNERBQTRELGlEQUFpRCxtQkFBbUIsYUFBYSxJQUFJLGlCQUFpQixTQUFTLGFBQWEsU0FBUywwQkFBMEIsb0JBQW9CLGtCQUFrQixtSEFBbUgsdUNBQXVDLDJGQUEyRix1Q0FBdUMsYUFBYSxNQUFNLG1CQUFtQixLQUFLLFlBQVksb0NBQW9DLElBQUksTUFBTSxTQUFTLE9BQU8sd0NBQXdDLDJIQUEySCxzQkFBc0Isa0JBQWtCLHVCQUF1QixpRUFBaUUsWUFBWSw4SUFBOEksd0JBQXdCLHNHQUFzRyxrREFBa0QsTUFBTSxtQ0FBbUMsU0FBUyxPQUFPLFNBQVMsT0FBTyxpRUFBaUUsT0FBTyx3QkFBd0IsMGhCQUEwaEIsU0FBUyx5QkFBeUIsMkJBQTJCLHlCQUF5QixtQ0FBbUMsc0NBQXNDLHVCQUF1QixvREFBb0QseUNBQXlDLDBCQUEwQiw4QkFBOEIsTUFBTSxzRkFBc0YsNkJBQTZCLGVBQWUsMkVBQTJFLDJCQUEyQix3QkFBd0IscUJBQXFCLEVBQUUsY0FBYyxvQkFBb0IsTUFBTSxxSkFBcUosV0FBVyxnREFBZ0QsU0FBUyxxQkFBcUIsdUJBQXVCLGtDQUFrQyxrQ0FBa0MsdUJBQXVCLDZCQUE2QixrQ0FBa0MsRUFBRSxrQkFBa0IsV0FBVyw2QkFBNkIsb0NBQW9DLEVBQUUsb0JBQW9CLGtEQUFrRCxxQ0FBcUMsUUFBUSxvQ0FBb0MsaUNBQWlDLG9DQUFvQyxtRUFBbUUsK0JBQStCLElBQUksNEJBQTRCLFlBQVksUUFBUSxlQUFlLHlCQUF5QiwrRUFBK0UsUUFBUSxxQ0FBcUMsbUJBQW1CLGdCQUFnQiwyR0FBMkcsb0xBQW9MLGNBQWMsa0JBQWtCLHVSQUF1UixrQkFBa0IsRUFBRSxvQkFBb0IsOEJBQThCLGdIQUFnSCwwQ0FBMEMsT0FBTyxFQUFFLGNBQWMsSUFBSSxtQ0FBbUMsU0FBUyxjQUFjLGtCQUFrQixTQUFTLDhCQUE4QixzQ0FBc0MsZUFBZSxTQUFTLG1HQUFtRyxXQUFXLGlDQUFpQyxhQUFhLDBCQUEwQiwyQkFBMkIsdUNBQXVDLDZEQUE2RCx1Q0FBdUMsUUFBUSx1Q0FBdUMsbUJBQW1CLHNDQUFzQyxRQUFRLGtDQUFrQyxnQ0FBZ0Msd0RBQXdELDJCQUEyQixrQkFBa0IsU0FBUyxFQUFFLG9DQUFvQyxhQUFhLDBDQUEwQyx3Q0FBd0MscUJBQXFCLCtDQUErQyx3S0FBd0ssaVBBQWlQLDRDQUE0Qyw4Q0FBOEMsWUFBWSxxQkFBcUIsb0hBQW9ILFdBQVcsdUtBQXVLLGtVQUFrVSxVQUFVLDJCQUEyQixrQ0FBa0Msd0hBQXdILDJDQUEyQyxtQkFBbUIsa0VBQWtFLDBCQUEwQixrQkFBa0Isc0NBQXNDLEVBQUUsT0FBTyxxQ0FBcUMsbUNBQW1DLGtCQUFrQixTQUFTLFdBQVcsMEJBQTBCLGtEQUFrRCw2UEFBNlAsd0hBQXdILGNBQWMsbUJBQW1CLGlFQUFpRSw2QkFBNkIsRUFBRSxrQkFBa0IsK0ZBQStGLGtEQUFrRCxHQUFHLGFBQWEsUUFBUSxxQkFBcUIsWUFBWSx1QkFBdUIsY0FBYyw2REFBNkQsS0FBSyxzRUFBc0UsNEZBQTRGLHNIQUFzSCxPQUFPLHNGQUFzRix5QkFBeUIsMkJBQTJCLHdCQUF3Qix5REFBeUQsYUFBYSxHQUFHLFVBQVUsaURBQWlELGVBQWUsd0JBQXdCLG9CQUFvQiw4QkFBOEIsTUFBTSw0RUFBNEUseURBQXlELHdCQUF3QixzQ0FBc0MsK0NBQStDLDJEQUEyRCxFQUFFLFVBQVUsOEJBQThCLGVBQWUsUUFBUSx5Q0FBeUMsZUFBZSxzQkFBc0IseUZBQXlGLDhCQUE4QixNQUFNLCtQQUErUCxrQkFBa0IsRUFBRSxvR0FBb0csb0JBQW9CLHFCQUFxQixlQUFlLHFCQUFxQiwyQkFBMkIsc0JBQXNCLDBCQUEwQiw0QkFBNEIsd0JBQXdCLDRCQUE0QixtRUFBbUUscUJBQXFCLDRDQUE0QywwTkFBME4sc0JBQXNCLCtEQUErRCxFQUFFLDRDQUE0QyxzQkFBc0IsVUFBVSx3RkFBd0Ysb0RBQW9ELGlDQUFpQyx5QkFBeUIsNEJBQTRCLHVKQUF1SixnQkFBZ0IsNERBQTRELG9CQUFvQix3Q0FBd0MsQ0FBQyxLQUFxQyxFQUFFLGlDQUFnQixFQUFFLG1DQUFDLFdBQVcsU0FBUztBQUFBLG9HQUFDLENBQUMsdUJBQXVCLGdDQUFnQywwREFBMEQsMkNBQTJDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNFajB1RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPO0FBQ1g7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsV0FBVztBQUNYLFdBQVc7QUFDWCxXQUFXO0FBQ1gsV0FBVztBQUNJO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0EsV0FBVyxJQUFJO0FBQ2Y7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDTztBQUNQLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEIsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQjtBQUNwQiw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBLFlBQVksS0FBSztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQixXQUFXLE9BQU87QUFDbEIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCLFdBQVcsT0FBTztBQUNsQjtBQUNBLFlBQVksT0FBTztBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdEdBO0FBQUE7QUFBQTtBQUFBO0FBQzRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxRQUFRO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlO0FBQ2YsYUFBYSx1REFBTTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxzREFBSztBQUNQO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDek1EO0FBQWUsMEVBQVcsRUFBQzs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9iYWNrZ3JvdW5kLmpzXCIpO1xuIiwiaW1wb3J0ICQgZnJvbSAnLi9saWIvanF1ZXJ5LTMuNi4wLm1pbidcclxuaW1wb3J0IFByb2ogZnJvbSAncHJvajQnXHJcblxyXG5jb25zdCBjb252ZXJ0Q29vcnMgPSAob3JpQ29vcmRzKSA9PiB7XHJcbiAgICBjb25zdCB3Z3M4NFByb2plY3Rpb24gPSAnK3Byb2o9bG9uZ2xhdCArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICtub19kZWZzJ1xyXG4gICAgY29uc3QgbmF2ZXJNYXAzODU3UHJvamlvbiA9ICcrcHJvaj1tZXJjICthPTYzNzgxMzcgK2I9NjM3ODEzNyArbGF0X3RzPTAuMCArbG9uXzA9MC4wICt4XzA9MC4wICt5XzA9MCAraz0xLjAgK3VuaXRzPW0gK25hZGdyaWRzPUBudWxsICtub19kZWZzJ1xyXG4gICAgdHJ5IHsgcmV0dXJuIFByb2oobmF2ZXJNYXAzODU3UHJvamlvbiwgd2dzODRQcm9qZWN0aW9uLCBvcmlDb29yZHMpIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgYWxlcnQoYOyjvOyGjCDrs4DtmZgg7Iuk7YyoIXtlfWApXHJcbiAgICB9XHJcbn1cclxuY29uc3QgYnV0dG9uQ2xpY2tlZCA9IChjb29yZHMsIG5ld1RleHQpID0+IHtcclxuICAgIGNvbnN0IHRlbXBFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKVxyXG4gICAgdGVtcEVsZW0udmFsdWUgPSBjb29yZHNcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcEVsZW0pO1xyXG4gICAgdGVtcEVsZW0uc2VsZWN0KCk7XHJcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcImNvcHlcIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlbXBFbGVtKTtcclxuICAgIGNvbnN0IHRlbXAgPSBuZXdUZXh0LmlubmVySFRNTDtcclxuICAgIG5ld1RleHQuaW5uZXJIVE1MID0gJ+yijO2RnCDrs7Xsgqwg7JmE66OMISdcclxuICAgIG5ld1RleHQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNiYmU2YjMnXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBuZXdUZXh0LmlubmVySFRNTCA9IHRlbXBcclxuICAgICAgICBuZXdUZXh0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjRkZDQ0NCJ1xyXG4gICAgfSwgMTAwMClcclxufVxyXG5pZiAod2luZG93LnNlc3Npb25TdG9yYWdlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHlcclxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb24gPT4ge1xyXG4gICAgICAgIG11dGF0aW9uLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2VudHJ5X3dyYXAgbG9hZGVkJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Vic3RyMSA9IGRvY3VtZW50LlVSTC5zcGxpdCgnLycpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzdHIyID0gc3Vic3RyMVtzdWJzdHIxLmxlbmd0aCAtIDFdLnNwbGl0KCcsJylcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaUNvb3JkcyA9IFtwYXJzZUZsb2F0KHN1YnN0cjJbMF0pLCBwYXJzZUZsb2F0KHN1YnN0cjJbMV0pXVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3Q29vcmRzID0gY29udmVydENvb3JzKG9yaUNvb3JkcylcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBuZXdDb29yZHNbMF1cclxuICAgICAgICAgICAgICAgIG5ld0Nvb3Jkc1swXSA9IG5ld0Nvb3Jkc1sxXVxyXG4gICAgICAgICAgICAgICAgbmV3Q29vcmRzWzFdID0gdGVtcFxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGxhY2VIb2xkZXIgPSAkKCcuZW5kX2JveCcpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGFjZUhvbGRlci5jaGlsZHJlblswXSlcclxuICAgICAgICAgICAgICAgIC8vc2V0VGltZW91dChwbGFjZUhvbGRlclswXS5jaGlsZHJlblswXS5jbGljaygpLCAyMDAwKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxyXG4gICAgICAgICAgICAgICAgbmV3VGV4dC5pbm5lckhUTUwgPSBuZXdDb29yZHNbMF0gKyAnLCAnICsgbmV3Q29vcmRzWzFdXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdUZXh0KVxyXG4gICAgICAgICAgICAgICAgcGxhY2VIb2xkZXIuYXBwZW5kKG5ld1RleHQpXHJcbiAgICAgICAgICAgICAgICBuZXdUZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gYnV0dG9uQ2xpY2tlZChuZXdDb29yZHMsIG5ld1RleHQpKVxyXG4gICAgICAgICAgICAgICAgbmV3VGV4dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI0ZGQ0NDQidcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICB9O1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIGNvbmZpZyk7XHJcbn0iLCIvKiEgalF1ZXJ5IHYzLjYuMCB8IChjKSBPcGVuSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIHwganF1ZXJ5Lm9yZy9saWNlbnNlICovXHJcbiFmdW5jdGlvbihlLHQpe1widXNlIHN0cmljdFwiO1wib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGUuZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1lLmRvY3VtZW50P3QoZSwhMCk6ZnVuY3Rpb24oZSl7aWYoIWUuZG9jdW1lbnQpdGhyb3cgbmV3IEVycm9yKFwialF1ZXJ5IHJlcXVpcmVzIGEgd2luZG93IHdpdGggYSBkb2N1bWVudFwiKTtyZXR1cm4gdChlKX06dChlKX0oXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6dGhpcyxmdW5jdGlvbihDLGUpe1widXNlIHN0cmljdFwiO3ZhciB0PVtdLHI9T2JqZWN0LmdldFByb3RvdHlwZU9mLHM9dC5zbGljZSxnPXQuZmxhdD9mdW5jdGlvbihlKXtyZXR1cm4gdC5mbGF0LmNhbGwoZSl9OmZ1bmN0aW9uKGUpe3JldHVybiB0LmNvbmNhdC5hcHBseShbXSxlKX0sdT10LnB1c2gsaT10LmluZGV4T2Ysbj17fSxvPW4udG9TdHJpbmcsdj1uLmhhc093blByb3BlcnR5LGE9di50b1N0cmluZyxsPWEuY2FsbChPYmplY3QpLHk9e30sbT1mdW5jdGlvbihlKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZcIm51bWJlclwiIT10eXBlb2YgZS5ub2RlVHlwZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZS5pdGVtfSx4PWZ1bmN0aW9uKGUpe3JldHVybiBudWxsIT1lJiZlPT09ZS53aW5kb3d9LEU9Qy5kb2N1bWVudCxjPXt0eXBlOiEwLHNyYzohMCxub25jZTohMCxub01vZHVsZTohMH07ZnVuY3Rpb24gYihlLHQsbil7dmFyIHIsaSxvPShuPW58fEUpLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7aWYoby50ZXh0PWUsdClmb3IociBpbiBjKShpPXRbcl18fHQuZ2V0QXR0cmlidXRlJiZ0LmdldEF0dHJpYnV0ZShyKSkmJm8uc2V0QXR0cmlidXRlKHIsaSk7bi5oZWFkLmFwcGVuZENoaWxkKG8pLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobyl9ZnVuY3Rpb24gdyhlKXtyZXR1cm4gbnVsbD09ZT9lK1wiXCI6XCJvYmplY3RcIj09dHlwZW9mIGV8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGU/bltvLmNhbGwoZSldfHxcIm9iamVjdFwiOnR5cGVvZiBlfXZhciBmPVwiMy42LjBcIixTPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIG5ldyBTLmZuLmluaXQoZSx0KX07ZnVuY3Rpb24gcChlKXt2YXIgdD0hIWUmJlwibGVuZ3RoXCJpbiBlJiZlLmxlbmd0aCxuPXcoZSk7cmV0dXJuIW0oZSkmJiF4KGUpJiYoXCJhcnJheVwiPT09bnx8MD09PXR8fFwibnVtYmVyXCI9PXR5cGVvZiB0JiYwPHQmJnQtMSBpbiBlKX1TLmZuPVMucHJvdG90eXBlPXtqcXVlcnk6Zixjb25zdHJ1Y3RvcjpTLGxlbmd0aDowLHRvQXJyYXk6ZnVuY3Rpb24oKXtyZXR1cm4gcy5jYWxsKHRoaXMpfSxnZXQ6ZnVuY3Rpb24oZSl7cmV0dXJuIG51bGw9PWU/cy5jYWxsKHRoaXMpOmU8MD90aGlzW2UrdGhpcy5sZW5ndGhdOnRoaXNbZV19LHB1c2hTdGFjazpmdW5jdGlvbihlKXt2YXIgdD1TLm1lcmdlKHRoaXMuY29uc3RydWN0b3IoKSxlKTtyZXR1cm4gdC5wcmV2T2JqZWN0PXRoaXMsdH0sZWFjaDpmdW5jdGlvbihlKXtyZXR1cm4gUy5lYWNoKHRoaXMsZSl9LG1hcDpmdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2soUy5tYXAodGhpcyxmdW5jdGlvbihlLHQpe3JldHVybiBuLmNhbGwoZSx0LGUpfSkpfSxzbGljZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnB1c2hTdGFjayhzLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9LGZpcnN0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXEoMCl9LGxhc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcSgtMSl9LGV2ZW46ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2soUy5ncmVwKHRoaXMsZnVuY3Rpb24oZSx0KXtyZXR1cm4odCsxKSUyfSkpfSxvZGQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2soUy5ncmVwKHRoaXMsZnVuY3Rpb24oZSx0KXtyZXR1cm4gdCUyfSkpfSxlcTpmdW5jdGlvbihlKXt2YXIgdD10aGlzLmxlbmd0aCxuPStlKyhlPDA/dDowKTtyZXR1cm4gdGhpcy5wdXNoU3RhY2soMDw9biYmbjx0P1t0aGlzW25dXTpbXSl9LGVuZDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnByZXZPYmplY3R8fHRoaXMuY29uc3RydWN0b3IoKX0scHVzaDp1LHNvcnQ6dC5zb3J0LHNwbGljZTp0LnNwbGljZX0sUy5leHRlbmQ9Uy5mbi5leHRlbmQ9ZnVuY3Rpb24oKXt2YXIgZSx0LG4scixpLG8sYT1hcmd1bWVudHNbMF18fHt9LHM9MSx1PWFyZ3VtZW50cy5sZW5ndGgsbD0hMTtmb3IoXCJib29sZWFuXCI9PXR5cGVvZiBhJiYobD1hLGE9YXJndW1lbnRzW3NdfHx7fSxzKyspLFwib2JqZWN0XCI9PXR5cGVvZiBhfHxtKGEpfHwoYT17fSkscz09PXUmJihhPXRoaXMscy0tKTtzPHU7cysrKWlmKG51bGwhPShlPWFyZ3VtZW50c1tzXSkpZm9yKHQgaW4gZSlyPWVbdF0sXCJfX3Byb3RvX19cIiE9PXQmJmEhPT1yJiYobCYmciYmKFMuaXNQbGFpbk9iamVjdChyKXx8KGk9QXJyYXkuaXNBcnJheShyKSkpPyhuPWFbdF0sbz1pJiYhQXJyYXkuaXNBcnJheShuKT9bXTppfHxTLmlzUGxhaW5PYmplY3Qobik/bjp7fSxpPSExLGFbdF09Uy5leHRlbmQobCxvLHIpKTp2b2lkIDAhPT1yJiYoYVt0XT1yKSk7cmV0dXJuIGF9LFMuZXh0ZW5kKHtleHBhbmRvOlwialF1ZXJ5XCIrKGYrTWF0aC5yYW5kb20oKSkucmVwbGFjZSgvXFxEL2csXCJcIiksaXNSZWFkeTohMCxlcnJvcjpmdW5jdGlvbihlKXt0aHJvdyBuZXcgRXJyb3IoZSl9LG5vb3A6ZnVuY3Rpb24oKXt9LGlzUGxhaW5PYmplY3Q6ZnVuY3Rpb24oZSl7dmFyIHQsbjtyZXR1cm4hKCFlfHxcIltvYmplY3QgT2JqZWN0XVwiIT09by5jYWxsKGUpKSYmKCEodD1yKGUpKXx8XCJmdW5jdGlvblwiPT10eXBlb2Yobj12LmNhbGwodCxcImNvbnN0cnVjdG9yXCIpJiZ0LmNvbnN0cnVjdG9yKSYmYS5jYWxsKG4pPT09bCl9LGlzRW1wdHlPYmplY3Q6ZnVuY3Rpb24oZSl7dmFyIHQ7Zm9yKHQgaW4gZSlyZXR1cm4hMTtyZXR1cm4hMH0sZ2xvYmFsRXZhbDpmdW5jdGlvbihlLHQsbil7YihlLHtub25jZTp0JiZ0Lm5vbmNlfSxuKX0sZWFjaDpmdW5jdGlvbihlLHQpe3ZhciBuLHI9MDtpZihwKGUpKXtmb3Iobj1lLmxlbmd0aDtyPG47cisrKWlmKCExPT09dC5jYWxsKGVbcl0scixlW3JdKSlicmVha31lbHNlIGZvcihyIGluIGUpaWYoITE9PT10LmNhbGwoZVtyXSxyLGVbcl0pKWJyZWFrO3JldHVybiBlfSxtYWtlQXJyYXk6ZnVuY3Rpb24oZSx0KXt2YXIgbj10fHxbXTtyZXR1cm4gbnVsbCE9ZSYmKHAoT2JqZWN0KGUpKT9TLm1lcmdlKG4sXCJzdHJpbmdcIj09dHlwZW9mIGU/W2VdOmUpOnUuY2FsbChuLGUpKSxufSxpbkFycmF5OmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gbnVsbD09dD8tMTppLmNhbGwodCxlLG4pfSxtZXJnZTpmdW5jdGlvbihlLHQpe2Zvcih2YXIgbj0rdC5sZW5ndGgscj0wLGk9ZS5sZW5ndGg7cjxuO3IrKyllW2krK109dFtyXTtyZXR1cm4gZS5sZW5ndGg9aSxlfSxncmVwOmZ1bmN0aW9uKGUsdCxuKXtmb3IodmFyIHI9W10saT0wLG89ZS5sZW5ndGgsYT0hbjtpPG87aSsrKSF0KGVbaV0saSkhPT1hJiZyLnB1c2goZVtpXSk7cmV0dXJuIHJ9LG1hcDpmdW5jdGlvbihlLHQsbil7dmFyIHIsaSxvPTAsYT1bXTtpZihwKGUpKWZvcihyPWUubGVuZ3RoO288cjtvKyspbnVsbCE9KGk9dChlW29dLG8sbikpJiZhLnB1c2goaSk7ZWxzZSBmb3IobyBpbiBlKW51bGwhPShpPXQoZVtvXSxvLG4pKSYmYS5wdXNoKGkpO3JldHVybiBnKGEpfSxndWlkOjEsc3VwcG9ydDp5fSksXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiYoUy5mbltTeW1ib2wuaXRlcmF0b3JdPXRbU3ltYm9sLml0ZXJhdG9yXSksUy5lYWNoKFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvciBTeW1ib2xcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oZSx0KXtuW1wiW29iamVjdCBcIit0K1wiXVwiXT10LnRvTG93ZXJDYXNlKCl9KTt2YXIgZD1mdW5jdGlvbihuKXt2YXIgZSxkLGIsbyxpLGgsZixnLHcsdSxsLFQsQyxhLEUsdixzLGMseSxTPVwic2l6emxlXCIrMSpuZXcgRGF0ZSxwPW4uZG9jdW1lbnQsaz0wLHI9MCxtPXVlKCkseD11ZSgpLEE9dWUoKSxOPXVlKCksaj1mdW5jdGlvbihlLHQpe3JldHVybiBlPT09dCYmKGw9ITApLDB9LEQ9e30uaGFzT3duUHJvcGVydHksdD1bXSxxPXQucG9wLEw9dC5wdXNoLEg9dC5wdXNoLE89dC5zbGljZSxQPWZ1bmN0aW9uKGUsdCl7Zm9yKHZhciBuPTAscj1lLmxlbmd0aDtuPHI7bisrKWlmKGVbbl09PT10KXJldHVybiBuO3JldHVybi0xfSxSPVwiY2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufGlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWRcIixNPVwiW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZl1cIixJPVwiKD86XFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIitNK1wiP3xcXFxcXFxcXFteXFxcXHJcXFxcblxcXFxmXXxbXFxcXHctXXxbXlxcMC1cXFxceDdmXSkrXCIsVz1cIlxcXFxbXCIrTStcIiooXCIrSStcIikoPzpcIitNK1wiKihbKl4kfCF+XT89KVwiK00rXCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIitJK1wiKSl8KVwiK00rXCIqXFxcXF1cIixGPVwiOihcIitJK1wiKSg/OlxcXFwoKCgnKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCIpfCgoPzpcXFxcXFxcXC58W15cXFxcXFxcXCgpW1xcXFxdXXxcIitXK1wiKSopfC4qKVxcXFwpfClcIixCPW5ldyBSZWdFeHAoTStcIitcIixcImdcIiksJD1uZXcgUmVnRXhwKFwiXlwiK00rXCIrfCgoPzpefFteXFxcXFxcXFxdKSg/OlxcXFxcXFxcLikqKVwiK00rXCIrJFwiLFwiZ1wiKSxfPW5ldyBSZWdFeHAoXCJeXCIrTStcIiosXCIrTStcIipcIiksej1uZXcgUmVnRXhwKFwiXlwiK00rXCIqKFs+K35dfFwiK00rXCIpXCIrTStcIipcIiksVT1uZXcgUmVnRXhwKE0rXCJ8PlwiKSxYPW5ldyBSZWdFeHAoRiksVj1uZXcgUmVnRXhwKFwiXlwiK0krXCIkXCIpLEc9e0lEOm5ldyBSZWdFeHAoXCJeIyhcIitJK1wiKVwiKSxDTEFTUzpuZXcgUmVnRXhwKFwiXlxcXFwuKFwiK0krXCIpXCIpLFRBRzpuZXcgUmVnRXhwKFwiXihcIitJK1wifFsqXSlcIiksQVRUUjpuZXcgUmVnRXhwKFwiXlwiK1cpLFBTRVVETzpuZXcgUmVnRXhwKFwiXlwiK0YpLENISUxEOm5ldyBSZWdFeHAoXCJeOihvbmx5fGZpcnN0fGxhc3R8bnRofG50aC1sYXN0KS0oY2hpbGR8b2YtdHlwZSkoPzpcXFxcKFwiK00rXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIitNK1wiKig/OihbKy1dfClcIitNK1wiKihcXFxcZCspfCkpXCIrTStcIipcXFxcKXwpXCIsXCJpXCIpLGJvb2w6bmV3IFJlZ0V4cChcIl4oPzpcIitSK1wiKSRcIixcImlcIiksbmVlZHNDb250ZXh0Om5ldyBSZWdFeHAoXCJeXCIrTStcIipbPit+XXw6KGV2ZW58b2RkfGVxfGd0fGx0fG50aHxmaXJzdHxsYXN0KSg/OlxcXFwoXCIrTStcIiooKD86LVxcXFxkKT9cXFxcZCopXCIrTStcIipcXFxcKXwpKD89W14tXXwkKVwiLFwiaVwiKX0sWT0vSFRNTCQvaSxRPS9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksSj0vXmhcXGQkL2ksSz0vXltee10rXFx7XFxzKlxcW25hdGl2ZSBcXHcvLFo9L14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sZWU9L1srfl0vLHRlPW5ldyBSZWdFeHAoXCJcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiK00rXCI/fFxcXFxcXFxcKFteXFxcXHJcXFxcblxcXFxmXSlcIixcImdcIiksbmU9ZnVuY3Rpb24oZSx0KXt2YXIgbj1cIjB4XCIrZS5zbGljZSgxKS02NTUzNjtyZXR1cm4gdHx8KG48MD9TdHJpbmcuZnJvbUNoYXJDb2RlKG4rNjU1MzYpOlN0cmluZy5mcm9tQ2hhckNvZGUobj4+MTB8NTUyOTYsMTAyMyZufDU2MzIwKSl9LHJlPS8oW1xcMC1cXHgxZlxceDdmXXxeLT9cXGQpfF4tJHxbXlxcMC1cXHgxZlxceDdmLVxcdUZGRkZcXHctXS9nLGllPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQ/XCJcXDBcIj09PWU/XCJcXHVmZmZkXCI6ZS5zbGljZSgwLC0xKStcIlxcXFxcIitlLmNoYXJDb2RlQXQoZS5sZW5ndGgtMSkudG9TdHJpbmcoMTYpK1wiIFwiOlwiXFxcXFwiK2V9LG9lPWZ1bmN0aW9uKCl7VCgpfSxhZT1iZShmdW5jdGlvbihlKXtyZXR1cm4hMD09PWUuZGlzYWJsZWQmJlwiZmllbGRzZXRcIj09PWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKX0se2RpcjpcInBhcmVudE5vZGVcIixuZXh0OlwibGVnZW5kXCJ9KTt0cnl7SC5hcHBseSh0PU8uY2FsbChwLmNoaWxkTm9kZXMpLHAuY2hpbGROb2RlcyksdFtwLmNoaWxkTm9kZXMubGVuZ3RoXS5ub2RlVHlwZX1jYXRjaChlKXtIPXthcHBseTp0Lmxlbmd0aD9mdW5jdGlvbihlLHQpe0wuYXBwbHkoZSxPLmNhbGwodCkpfTpmdW5jdGlvbihlLHQpe3ZhciBuPWUubGVuZ3RoLHI9MDt3aGlsZShlW24rK109dFtyKytdKTtlLmxlbmd0aD1uLTF9fX1mdW5jdGlvbiBzZSh0LGUsbixyKXt2YXIgaSxvLGEscyx1LGwsYyxmPWUmJmUub3duZXJEb2N1bWVudCxwPWU/ZS5ub2RlVHlwZTo5O2lmKG49bnx8W10sXCJzdHJpbmdcIiE9dHlwZW9mIHR8fCF0fHwxIT09cCYmOSE9PXAmJjExIT09cClyZXR1cm4gbjtpZighciYmKFQoZSksZT1lfHxDLEUpKXtpZigxMSE9PXAmJih1PVouZXhlYyh0KSkpaWYoaT11WzFdKXtpZig5PT09cCl7aWYoIShhPWUuZ2V0RWxlbWVudEJ5SWQoaSkpKXJldHVybiBuO2lmKGEuaWQ9PT1pKXJldHVybiBuLnB1c2goYSksbn1lbHNlIGlmKGYmJihhPWYuZ2V0RWxlbWVudEJ5SWQoaSkpJiZ5KGUsYSkmJmEuaWQ9PT1pKXJldHVybiBuLnB1c2goYSksbn1lbHNle2lmKHVbMl0pcmV0dXJuIEguYXBwbHkobixlLmdldEVsZW1lbnRzQnlUYWdOYW1lKHQpKSxuO2lmKChpPXVbM10pJiZkLmdldEVsZW1lbnRzQnlDbGFzc05hbWUmJmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSlyZXR1cm4gSC5hcHBseShuLGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShpKSksbn1pZihkLnFzYSYmIU5bdCtcIiBcIl0mJighdnx8IXYudGVzdCh0KSkmJigxIT09cHx8XCJvYmplY3RcIiE9PWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkpe2lmKGM9dCxmPWUsMT09PXAmJihVLnRlc3QodCl8fHoudGVzdCh0KSkpeyhmPWVlLnRlc3QodCkmJnllKGUucGFyZW50Tm9kZSl8fGUpPT09ZSYmZC5zY29wZXx8KChzPWUuZ2V0QXR0cmlidXRlKFwiaWRcIikpP3M9cy5yZXBsYWNlKHJlLGllKTplLnNldEF0dHJpYnV0ZShcImlkXCIscz1TKSksbz0obD1oKHQpKS5sZW5ndGg7d2hpbGUoby0tKWxbb109KHM/XCIjXCIrczpcIjpzY29wZVwiKStcIiBcIit4ZShsW29dKTtjPWwuam9pbihcIixcIil9dHJ5e3JldHVybiBILmFwcGx5KG4sZi5xdWVyeVNlbGVjdG9yQWxsKGMpKSxufWNhdGNoKGUpe04odCwhMCl9ZmluYWxseXtzPT09UyYmZS5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKX19fXJldHVybiBnKHQucmVwbGFjZSgkLFwiJDFcIiksZSxuLHIpfWZ1bmN0aW9uIHVlKCl7dmFyIHI9W107cmV0dXJuIGZ1bmN0aW9uIGUodCxuKXtyZXR1cm4gci5wdXNoKHQrXCIgXCIpPmIuY2FjaGVMZW5ndGgmJmRlbGV0ZSBlW3Iuc2hpZnQoKV0sZVt0K1wiIFwiXT1ufX1mdW5jdGlvbiBsZShlKXtyZXR1cm4gZVtTXT0hMCxlfWZ1bmN0aW9uIGNlKGUpe3ZhciB0PUMuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO3RyeXtyZXR1cm4hIWUodCl9Y2F0Y2goZSl7cmV0dXJuITF9ZmluYWxseXt0LnBhcmVudE5vZGUmJnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0KSx0PW51bGx9fWZ1bmN0aW9uIGZlKGUsdCl7dmFyIG49ZS5zcGxpdChcInxcIikscj1uLmxlbmd0aDt3aGlsZShyLS0pYi5hdHRySGFuZGxlW25bcl1dPXR9ZnVuY3Rpb24gcGUoZSx0KXt2YXIgbj10JiZlLHI9biYmMT09PWUubm9kZVR5cGUmJjE9PT10Lm5vZGVUeXBlJiZlLnNvdXJjZUluZGV4LXQuc291cmNlSW5kZXg7aWYocilyZXR1cm4gcjtpZihuKXdoaWxlKG49bi5uZXh0U2libGluZylpZihuPT09dClyZXR1cm4tMTtyZXR1cm4gZT8xOi0xfWZ1bmN0aW9uIGRlKHQpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm5cImlucHV0XCI9PT1lLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJmUudHlwZT09PXR9fWZ1bmN0aW9uIGhlKG4pe3JldHVybiBmdW5jdGlvbihlKXt2YXIgdD1lLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuKFwiaW5wdXRcIj09PXR8fFwiYnV0dG9uXCI9PT10KSYmZS50eXBlPT09bn19ZnVuY3Rpb24gZ2UodCl7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVyblwiZm9ybVwiaW4gZT9lLnBhcmVudE5vZGUmJiExPT09ZS5kaXNhYmxlZD9cImxhYmVsXCJpbiBlP1wibGFiZWxcImluIGUucGFyZW50Tm9kZT9lLnBhcmVudE5vZGUuZGlzYWJsZWQ9PT10OmUuZGlzYWJsZWQ9PT10OmUuaXNEaXNhYmxlZD09PXR8fGUuaXNEaXNhYmxlZCE9PSF0JiZhZShlKT09PXQ6ZS5kaXNhYmxlZD09PXQ6XCJsYWJlbFwiaW4gZSYmZS5kaXNhYmxlZD09PXR9fWZ1bmN0aW9uIHZlKGEpe3JldHVybiBsZShmdW5jdGlvbihvKXtyZXR1cm4gbz0rbyxsZShmdW5jdGlvbihlLHQpe3ZhciBuLHI9YShbXSxlLmxlbmd0aCxvKSxpPXIubGVuZ3RoO3doaWxlKGktLSllW249cltpXV0mJihlW25dPSEodFtuXT1lW25dKSl9KX0pfWZ1bmN0aW9uIHllKGUpe3JldHVybiBlJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgZS5nZXRFbGVtZW50c0J5VGFnTmFtZSYmZX1mb3IoZSBpbiBkPXNlLnN1cHBvcnQ9e30saT1zZS5pc1hNTD1mdW5jdGlvbihlKXt2YXIgdD1lJiZlLm5hbWVzcGFjZVVSSSxuPWUmJihlLm93bmVyRG9jdW1lbnR8fGUpLmRvY3VtZW50RWxlbWVudDtyZXR1cm4hWS50ZXN0KHR8fG4mJm4ubm9kZU5hbWV8fFwiSFRNTFwiKX0sVD1zZS5zZXREb2N1bWVudD1mdW5jdGlvbihlKXt2YXIgdCxuLHI9ZT9lLm93bmVyRG9jdW1lbnR8fGU6cDtyZXR1cm4gciE9QyYmOT09PXIubm9kZVR5cGUmJnIuZG9jdW1lbnRFbGVtZW50JiYoYT0oQz1yKS5kb2N1bWVudEVsZW1lbnQsRT0haShDKSxwIT1DJiYobj1DLmRlZmF1bHRWaWV3KSYmbi50b3AhPT1uJiYobi5hZGRFdmVudExpc3RlbmVyP24uYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLG9lLCExKTpuLmF0dGFjaEV2ZW50JiZuLmF0dGFjaEV2ZW50KFwib251bmxvYWRcIixvZSkpLGQuc2NvcGU9Y2UoZnVuY3Rpb24oZSl7cmV0dXJuIGEuYXBwZW5kQ2hpbGQoZSkuYXBwZW5kQ2hpbGQoQy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgZS5xdWVyeVNlbGVjdG9yQWxsJiYhZS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlIGZpZWxkc2V0IGRpdlwiKS5sZW5ndGh9KSxkLmF0dHJpYnV0ZXM9Y2UoZnVuY3Rpb24oZSl7cmV0dXJuIGUuY2xhc3NOYW1lPVwiaVwiLCFlLmdldEF0dHJpYnV0ZShcImNsYXNzTmFtZVwiKX0pLGQuZ2V0RWxlbWVudHNCeVRhZ05hbWU9Y2UoZnVuY3Rpb24oZSl7cmV0dXJuIGUuYXBwZW5kQ2hpbGQoQy5jcmVhdGVDb21tZW50KFwiXCIpKSwhZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikubGVuZ3RofSksZC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lPUsudGVzdChDLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpLGQuZ2V0QnlJZD1jZShmdW5jdGlvbihlKXtyZXR1cm4gYS5hcHBlbmRDaGlsZChlKS5pZD1TLCFDLmdldEVsZW1lbnRzQnlOYW1lfHwhQy5nZXRFbGVtZW50c0J5TmFtZShTKS5sZW5ndGh9KSxkLmdldEJ5SWQ/KGIuZmlsdGVyLklEPWZ1bmN0aW9uKGUpe3ZhciB0PWUucmVwbGFjZSh0ZSxuZSk7cmV0dXJuIGZ1bmN0aW9uKGUpe3JldHVybiBlLmdldEF0dHJpYnV0ZShcImlkXCIpPT09dH19LGIuZmluZC5JRD1mdW5jdGlvbihlLHQpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB0LmdldEVsZW1lbnRCeUlkJiZFKXt2YXIgbj10LmdldEVsZW1lbnRCeUlkKGUpO3JldHVybiBuP1tuXTpbXX19KTooYi5maWx0ZXIuSUQ9ZnVuY3Rpb24oZSl7dmFyIG49ZS5yZXBsYWNlKHRlLG5lKTtyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIHQ9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGUuZ2V0QXR0cmlidXRlTm9kZSYmZS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7cmV0dXJuIHQmJnQudmFsdWU9PT1ufX0sYi5maW5kLklEPWZ1bmN0aW9uKGUsdCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHQuZ2V0RWxlbWVudEJ5SWQmJkUpe3ZhciBuLHIsaSxvPXQuZ2V0RWxlbWVudEJ5SWQoZSk7aWYobyl7aWYoKG49by5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIikpJiZuLnZhbHVlPT09ZSlyZXR1cm5bb107aT10LmdldEVsZW1lbnRzQnlOYW1lKGUpLHI9MDt3aGlsZShvPWlbcisrXSlpZigobj1vLmdldEF0dHJpYnV0ZU5vZGUoXCJpZFwiKSkmJm4udmFsdWU9PT1lKXJldHVybltvXX1yZXR1cm5bXX19KSxiLmZpbmQuVEFHPWQuZ2V0RWxlbWVudHNCeVRhZ05hbWU/ZnVuY3Rpb24oZSx0KXtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgdC5nZXRFbGVtZW50c0J5VGFnTmFtZT90LmdldEVsZW1lbnRzQnlUYWdOYW1lKGUpOmQucXNhP3QucXVlcnlTZWxlY3RvckFsbChlKTp2b2lkIDB9OmZ1bmN0aW9uKGUsdCl7dmFyIG4scj1bXSxpPTAsbz10LmdldEVsZW1lbnRzQnlUYWdOYW1lKGUpO2lmKFwiKlwiPT09ZSl7d2hpbGUobj1vW2krK10pMT09PW4ubm9kZVR5cGUmJnIucHVzaChuKTtyZXR1cm4gcn1yZXR1cm4gb30sYi5maW5kLkNMQVNTPWQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSYmZnVuY3Rpb24oZSx0KXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgdC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lJiZFKXJldHVybiB0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoZSl9LHM9W10sdj1bXSwoZC5xc2E9Sy50ZXN0KEMucXVlcnlTZWxlY3RvckFsbCkpJiYoY2UoZnVuY3Rpb24oZSl7dmFyIHQ7YS5hcHBlbmRDaGlsZChlKS5pbm5lckhUTUw9XCI8YSBpZD0nXCIrUytcIic+PC9hPjxzZWxlY3QgaWQ9J1wiK1MrXCItXFxyXFxcXCcgbXNhbGxvd2NhcHR1cmU9Jyc+PG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIixlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiKS5sZW5ndGgmJnYucHVzaChcIlsqXiRdPVwiK00rXCIqKD86Jyd8XFxcIlxcXCIpXCIpLGUucXVlcnlTZWxlY3RvckFsbChcIltzZWxlY3RlZF1cIikubGVuZ3RofHx2LnB1c2goXCJcXFxcW1wiK00rXCIqKD86dmFsdWV8XCIrUitcIilcIiksZS5xdWVyeVNlbGVjdG9yQWxsKFwiW2lkfj1cIitTK1wiLV1cIikubGVuZ3RofHx2LnB1c2goXCJ+PVwiKSwodD1DLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSkuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwiXCIpLGUuYXBwZW5kQ2hpbGQodCksZS5xdWVyeVNlbGVjdG9yQWxsKFwiW25hbWU9JyddXCIpLmxlbmd0aHx8di5wdXNoKFwiXFxcXFtcIitNK1wiKm5hbWVcIitNK1wiKj1cIitNK1wiKig/OicnfFxcXCJcXFwiKVwiKSxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGh8fHYucHVzaChcIjpjaGVja2VkXCIpLGUucXVlcnlTZWxlY3RvckFsbChcImEjXCIrUytcIisqXCIpLmxlbmd0aHx8di5wdXNoKFwiLiMuK1srfl1cIiksZS5xdWVyeVNlbGVjdG9yQWxsKFwiXFxcXFxcZlwiKSx2LnB1c2goXCJbXFxcXHJcXFxcblxcXFxmXVwiKX0pLGNlKGZ1bmN0aW9uKGUpe2UuaW5uZXJIVE1MPVwiPGEgaHJlZj0nJyBkaXNhYmxlZD0nZGlzYWJsZWQnPjwvYT48c2VsZWN0IGRpc2FibGVkPSdkaXNhYmxlZCc+PG9wdGlvbi8+PC9zZWxlY3Q+XCI7dmFyIHQ9Qy5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJoaWRkZW5cIiksZS5hcHBlbmRDaGlsZCh0KS5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJEXCIpLGUucXVlcnlTZWxlY3RvckFsbChcIltuYW1lPWRdXCIpLmxlbmd0aCYmdi5wdXNoKFwibmFtZVwiK00rXCIqWypeJHwhfl0/PVwiKSwyIT09ZS5xdWVyeVNlbGVjdG9yQWxsKFwiOmVuYWJsZWRcIikubGVuZ3RoJiZ2LnB1c2goXCI6ZW5hYmxlZFwiLFwiOmRpc2FibGVkXCIpLGEuYXBwZW5kQ2hpbGQoZSkuZGlzYWJsZWQ9ITAsMiE9PWUucXVlcnlTZWxlY3RvckFsbChcIjpkaXNhYmxlZFwiKS5sZW5ndGgmJnYucHVzaChcIjplbmFibGVkXCIsXCI6ZGlzYWJsZWRcIiksZS5xdWVyeVNlbGVjdG9yQWxsKFwiKiw6eFwiKSx2LnB1c2goXCIsLio6XCIpfSkpLChkLm1hdGNoZXNTZWxlY3Rvcj1LLnRlc3QoYz1hLm1hdGNoZXN8fGEud2Via2l0TWF0Y2hlc1NlbGVjdG9yfHxhLm1vek1hdGNoZXNTZWxlY3Rvcnx8YS5vTWF0Y2hlc1NlbGVjdG9yfHxhLm1zTWF0Y2hlc1NlbGVjdG9yKSkmJmNlKGZ1bmN0aW9uKGUpe2QuZGlzY29ubmVjdGVkTWF0Y2g9Yy5jYWxsKGUsXCIqXCIpLGMuY2FsbChlLFwiW3MhPScnXTp4XCIpLHMucHVzaChcIiE9XCIsRil9KSx2PXYubGVuZ3RoJiZuZXcgUmVnRXhwKHYuam9pbihcInxcIikpLHM9cy5sZW5ndGgmJm5ldyBSZWdFeHAocy5qb2luKFwifFwiKSksdD1LLnRlc3QoYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbikseT10fHxLLnRlc3QoYS5jb250YWlucyk/ZnVuY3Rpb24oZSx0KXt2YXIgbj05PT09ZS5ub2RlVHlwZT9lLmRvY3VtZW50RWxlbWVudDplLHI9dCYmdC5wYXJlbnROb2RlO3JldHVybiBlPT09cnx8ISghcnx8MSE9PXIubm9kZVR5cGV8fCEobi5jb250YWlucz9uLmNvbnRhaW5zKHIpOmUuY29tcGFyZURvY3VtZW50UG9zaXRpb24mJjE2JmUuY29tcGFyZURvY3VtZW50UG9zaXRpb24ocikpKX06ZnVuY3Rpb24oZSx0KXtpZih0KXdoaWxlKHQ9dC5wYXJlbnROb2RlKWlmKHQ9PT1lKXJldHVybiEwO3JldHVybiExfSxqPXQ/ZnVuY3Rpb24oZSx0KXtpZihlPT09dClyZXR1cm4gbD0hMCwwO3ZhciBuPSFlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uLSF0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uO3JldHVybiBufHwoMSYobj0oZS5vd25lckRvY3VtZW50fHxlKT09KHQub3duZXJEb2N1bWVudHx8dCk/ZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbih0KToxKXx8IWQuc29ydERldGFjaGVkJiZ0LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGUpPT09bj9lPT1DfHxlLm93bmVyRG9jdW1lbnQ9PXAmJnkocCxlKT8tMTp0PT1DfHx0Lm93bmVyRG9jdW1lbnQ9PXAmJnkocCx0KT8xOnU/UCh1LGUpLVAodSx0KTowOjQmbj8tMToxKX06ZnVuY3Rpb24oZSx0KXtpZihlPT09dClyZXR1cm4gbD0hMCwwO3ZhciBuLHI9MCxpPWUucGFyZW50Tm9kZSxvPXQucGFyZW50Tm9kZSxhPVtlXSxzPVt0XTtpZighaXx8IW8pcmV0dXJuIGU9PUM/LTE6dD09Qz8xOmk/LTE6bz8xOnU/UCh1LGUpLVAodSx0KTowO2lmKGk9PT1vKXJldHVybiBwZShlLHQpO249ZTt3aGlsZShuPW4ucGFyZW50Tm9kZSlhLnVuc2hpZnQobik7bj10O3doaWxlKG49bi5wYXJlbnROb2RlKXMudW5zaGlmdChuKTt3aGlsZShhW3JdPT09c1tyXSlyKys7cmV0dXJuIHI/cGUoYVtyXSxzW3JdKTphW3JdPT1wPy0xOnNbcl09PXA/MTowfSksQ30sc2UubWF0Y2hlcz1mdW5jdGlvbihlLHQpe3JldHVybiBzZShlLG51bGwsbnVsbCx0KX0sc2UubWF0Y2hlc1NlbGVjdG9yPWZ1bmN0aW9uKGUsdCl7aWYoVChlKSxkLm1hdGNoZXNTZWxlY3RvciYmRSYmIU5bdCtcIiBcIl0mJighc3x8IXMudGVzdCh0KSkmJighdnx8IXYudGVzdCh0KSkpdHJ5e3ZhciBuPWMuY2FsbChlLHQpO2lmKG58fGQuZGlzY29ubmVjdGVkTWF0Y2h8fGUuZG9jdW1lbnQmJjExIT09ZS5kb2N1bWVudC5ub2RlVHlwZSlyZXR1cm4gbn1jYXRjaChlKXtOKHQsITApfXJldHVybiAwPHNlKHQsQyxudWxsLFtlXSkubGVuZ3RofSxzZS5jb250YWlucz1mdW5jdGlvbihlLHQpe3JldHVybihlLm93bmVyRG9jdW1lbnR8fGUpIT1DJiZUKGUpLHkoZSx0KX0sc2UuYXR0cj1mdW5jdGlvbihlLHQpeyhlLm93bmVyRG9jdW1lbnR8fGUpIT1DJiZUKGUpO3ZhciBuPWIuYXR0ckhhbmRsZVt0LnRvTG93ZXJDYXNlKCldLHI9biYmRC5jYWxsKGIuYXR0ckhhbmRsZSx0LnRvTG93ZXJDYXNlKCkpP24oZSx0LCFFKTp2b2lkIDA7cmV0dXJuIHZvaWQgMCE9PXI/cjpkLmF0dHJpYnV0ZXN8fCFFP2UuZ2V0QXR0cmlidXRlKHQpOihyPWUuZ2V0QXR0cmlidXRlTm9kZSh0KSkmJnIuc3BlY2lmaWVkP3IudmFsdWU6bnVsbH0sc2UuZXNjYXBlPWZ1bmN0aW9uKGUpe3JldHVybihlK1wiXCIpLnJlcGxhY2UocmUsaWUpfSxzZS5lcnJvcj1mdW5jdGlvbihlKXt0aHJvdyBuZXcgRXJyb3IoXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIitlKX0sc2UudW5pcXVlU29ydD1mdW5jdGlvbihlKXt2YXIgdCxuPVtdLHI9MCxpPTA7aWYobD0hZC5kZXRlY3REdXBsaWNhdGVzLHU9IWQuc29ydFN0YWJsZSYmZS5zbGljZSgwKSxlLnNvcnQoaiksbCl7d2hpbGUodD1lW2krK10pdD09PWVbaV0mJihyPW4ucHVzaChpKSk7d2hpbGUoci0tKWUuc3BsaWNlKG5bcl0sMSl9cmV0dXJuIHU9bnVsbCxlfSxvPXNlLmdldFRleHQ9ZnVuY3Rpb24oZSl7dmFyIHQsbj1cIlwiLHI9MCxpPWUubm9kZVR5cGU7aWYoaSl7aWYoMT09PWl8fDk9PT1pfHwxMT09PWkpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlLnRleHRDb250ZW50KXJldHVybiBlLnRleHRDb250ZW50O2ZvcihlPWUuZmlyc3RDaGlsZDtlO2U9ZS5uZXh0U2libGluZyluKz1vKGUpfWVsc2UgaWYoMz09PWl8fDQ9PT1pKXJldHVybiBlLm5vZGVWYWx1ZX1lbHNlIHdoaWxlKHQ9ZVtyKytdKW4rPW8odCk7cmV0dXJuIG59LChiPXNlLnNlbGVjdG9ycz17Y2FjaGVMZW5ndGg6NTAsY3JlYXRlUHNldWRvOmxlLG1hdGNoOkcsYXR0ckhhbmRsZTp7fSxmaW5kOnt9LHJlbGF0aXZlOntcIj5cIjp7ZGlyOlwicGFyZW50Tm9kZVwiLGZpcnN0OiEwfSxcIiBcIjp7ZGlyOlwicGFyZW50Tm9kZVwifSxcIitcIjp7ZGlyOlwicHJldmlvdXNTaWJsaW5nXCIsZmlyc3Q6ITB9LFwiflwiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIn19LHByZUZpbHRlcjp7QVRUUjpmdW5jdGlvbihlKXtyZXR1cm4gZVsxXT1lWzFdLnJlcGxhY2UodGUsbmUpLGVbM109KGVbM118fGVbNF18fGVbNV18fFwiXCIpLnJlcGxhY2UodGUsbmUpLFwifj1cIj09PWVbMl0mJihlWzNdPVwiIFwiK2VbM10rXCIgXCIpLGUuc2xpY2UoMCw0KX0sQ0hJTEQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGVbMV09ZVsxXS50b0xvd2VyQ2FzZSgpLFwibnRoXCI9PT1lWzFdLnNsaWNlKDAsMyk/KGVbM118fHNlLmVycm9yKGVbMF0pLGVbNF09KyhlWzRdP2VbNV0rKGVbNl18fDEpOjIqKFwiZXZlblwiPT09ZVszXXx8XCJvZGRcIj09PWVbM10pKSxlWzVdPSsoZVs3XStlWzhdfHxcIm9kZFwiPT09ZVszXSkpOmVbM10mJnNlLmVycm9yKGVbMF0pLGV9LFBTRVVETzpmdW5jdGlvbihlKXt2YXIgdCxuPSFlWzZdJiZlWzJdO3JldHVybiBHLkNISUxELnRlc3QoZVswXSk/bnVsbDooZVszXT9lWzJdPWVbNF18fGVbNV18fFwiXCI6biYmWC50ZXN0KG4pJiYodD1oKG4sITApKSYmKHQ9bi5pbmRleE9mKFwiKVwiLG4ubGVuZ3RoLXQpLW4ubGVuZ3RoKSYmKGVbMF09ZVswXS5zbGljZSgwLHQpLGVbMl09bi5zbGljZSgwLHQpKSxlLnNsaWNlKDAsMykpfX0sZmlsdGVyOntUQUc6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5yZXBsYWNlKHRlLG5lKS50b0xvd2VyQ2FzZSgpO3JldHVyblwiKlwiPT09ZT9mdW5jdGlvbigpe3JldHVybiEwfTpmdW5jdGlvbihlKXtyZXR1cm4gZS5ub2RlTmFtZSYmZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09dH19LENMQVNTOmZ1bmN0aW9uKGUpe3ZhciB0PW1bZStcIiBcIl07cmV0dXJuIHR8fCh0PW5ldyBSZWdFeHAoXCIoXnxcIitNK1wiKVwiK2UrXCIoXCIrTStcInwkKVwiKSkmJm0oZSxmdW5jdGlvbihlKXtyZXR1cm4gdC50ZXN0KFwic3RyaW5nXCI9PXR5cGVvZiBlLmNsYXNzTmFtZSYmZS5jbGFzc05hbWV8fFwidW5kZWZpbmVkXCIhPXR5cGVvZiBlLmdldEF0dHJpYnV0ZSYmZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIil9KX0sQVRUUjpmdW5jdGlvbihuLHIsaSl7cmV0dXJuIGZ1bmN0aW9uKGUpe3ZhciB0PXNlLmF0dHIoZSxuKTtyZXR1cm4gbnVsbD09dD9cIiE9XCI9PT1yOiFyfHwodCs9XCJcIixcIj1cIj09PXI/dD09PWk6XCIhPVwiPT09cj90IT09aTpcIl49XCI9PT1yP2kmJjA9PT10LmluZGV4T2YoaSk6XCIqPVwiPT09cj9pJiYtMTx0LmluZGV4T2YoaSk6XCIkPVwiPT09cj9pJiZ0LnNsaWNlKC1pLmxlbmd0aCk9PT1pOlwifj1cIj09PXI/LTE8KFwiIFwiK3QucmVwbGFjZShCLFwiIFwiKStcIiBcIikuaW5kZXhPZihpKTpcInw9XCI9PT1yJiYodD09PWl8fHQuc2xpY2UoMCxpLmxlbmd0aCsxKT09PWkrXCItXCIpKX19LENISUxEOmZ1bmN0aW9uKGgsZSx0LGcsdil7dmFyIHk9XCJudGhcIiE9PWguc2xpY2UoMCwzKSxtPVwibGFzdFwiIT09aC5zbGljZSgtNCkseD1cIm9mLXR5cGVcIj09PWU7cmV0dXJuIDE9PT1nJiYwPT09dj9mdW5jdGlvbihlKXtyZXR1cm4hIWUucGFyZW50Tm9kZX06ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGksbyxhLHMsdSxsPXkhPT1tP1wibmV4dFNpYmxpbmdcIjpcInByZXZpb3VzU2libGluZ1wiLGM9ZS5wYXJlbnROb2RlLGY9eCYmZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLHA9IW4mJiF4LGQ9ITE7aWYoYyl7aWYoeSl7d2hpbGUobCl7YT1lO3doaWxlKGE9YVtsXSlpZih4P2Eubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PWY6MT09PWEubm9kZVR5cGUpcmV0dXJuITE7dT1sPVwib25seVwiPT09aCYmIXUmJlwibmV4dFNpYmxpbmdcIn1yZXR1cm4hMH1pZih1PVttP2MuZmlyc3RDaGlsZDpjLmxhc3RDaGlsZF0sbSYmcCl7ZD0ocz0ocj0oaT0obz0oYT1jKVtTXXx8KGFbU109e30pKVthLnVuaXF1ZUlEXXx8KG9bYS51bmlxdWVJRF09e30pKVtoXXx8W10pWzBdPT09ayYmclsxXSkmJnJbMl0sYT1zJiZjLmNoaWxkTm9kZXNbc107d2hpbGUoYT0rK3MmJmEmJmFbbF18fChkPXM9MCl8fHUucG9wKCkpaWYoMT09PWEubm9kZVR5cGUmJisrZCYmYT09PWUpe2lbaF09W2sscyxkXTticmVha319ZWxzZSBpZihwJiYoZD1zPShyPShpPShvPShhPWUpW1NdfHwoYVtTXT17fSkpW2EudW5pcXVlSURdfHwob1thLnVuaXF1ZUlEXT17fSkpW2hdfHxbXSlbMF09PT1rJiZyWzFdKSwhMT09PWQpd2hpbGUoYT0rK3MmJmEmJmFbbF18fChkPXM9MCl8fHUucG9wKCkpaWYoKHg/YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09ZjoxPT09YS5ub2RlVHlwZSkmJisrZCYmKHAmJigoaT0obz1hW1NdfHwoYVtTXT17fSkpW2EudW5pcXVlSURdfHwob1thLnVuaXF1ZUlEXT17fSkpW2hdPVtrLGRdKSxhPT09ZSkpYnJlYWs7cmV0dXJuKGQtPXYpPT09Z3x8ZCVnPT0wJiYwPD1kL2d9fX0sUFNFVURPOmZ1bmN0aW9uKGUsbyl7dmFyIHQsYT1iLnBzZXVkb3NbZV18fGIuc2V0RmlsdGVyc1tlLnRvTG93ZXJDYXNlKCldfHxzZS5lcnJvcihcInVuc3VwcG9ydGVkIHBzZXVkbzogXCIrZSk7cmV0dXJuIGFbU10/YShvKToxPGEubGVuZ3RoPyh0PVtlLGUsXCJcIixvXSxiLnNldEZpbHRlcnMuaGFzT3duUHJvcGVydHkoZS50b0xvd2VyQ2FzZSgpKT9sZShmdW5jdGlvbihlLHQpe3ZhciBuLHI9YShlLG8pLGk9ci5sZW5ndGg7d2hpbGUoaS0tKWVbbj1QKGUscltpXSldPSEodFtuXT1yW2ldKX0pOmZ1bmN0aW9uKGUpe3JldHVybiBhKGUsMCx0KX0pOmF9fSxwc2V1ZG9zOntub3Q6bGUoZnVuY3Rpb24oZSl7dmFyIHI9W10saT1bXSxzPWYoZS5yZXBsYWNlKCQsXCIkMVwiKSk7cmV0dXJuIHNbU10/bGUoZnVuY3Rpb24oZSx0LG4scil7dmFyIGksbz1zKGUsbnVsbCxyLFtdKSxhPWUubGVuZ3RoO3doaWxlKGEtLSkoaT1vW2FdKSYmKGVbYV09ISh0W2FdPWkpKX0pOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gclswXT1lLHMocixudWxsLG4saSksclswXT1udWxsLCFpLnBvcCgpfX0pLGhhczpsZShmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIDA8c2UodCxlKS5sZW5ndGh9fSksY29udGFpbnM6bGUoZnVuY3Rpb24odCl7cmV0dXJuIHQ9dC5yZXBsYWNlKHRlLG5lKSxmdW5jdGlvbihlKXtyZXR1cm4tMTwoZS50ZXh0Q29udGVudHx8byhlKSkuaW5kZXhPZih0KX19KSxsYW5nOmxlKGZ1bmN0aW9uKG4pe3JldHVybiBWLnRlc3Qobnx8XCJcIil8fHNlLmVycm9yKFwidW5zdXBwb3J0ZWQgbGFuZzogXCIrbiksbj1uLnJlcGxhY2UodGUsbmUpLnRvTG93ZXJDYXNlKCksZnVuY3Rpb24oZSl7dmFyIHQ7ZG97aWYodD1FP2UubGFuZzplLmdldEF0dHJpYnV0ZShcInhtbDpsYW5nXCIpfHxlLmdldEF0dHJpYnV0ZShcImxhbmdcIikpcmV0dXJuKHQ9dC50b0xvd2VyQ2FzZSgpKT09PW58fDA9PT10LmluZGV4T2YobitcIi1cIil9d2hpbGUoKGU9ZS5wYXJlbnROb2RlKSYmMT09PWUubm9kZVR5cGUpO3JldHVybiExfX0pLHRhcmdldDpmdW5jdGlvbihlKXt2YXIgdD1uLmxvY2F0aW9uJiZuLmxvY2F0aW9uLmhhc2g7cmV0dXJuIHQmJnQuc2xpY2UoMSk9PT1lLmlkfSxyb290OmZ1bmN0aW9uKGUpe3JldHVybiBlPT09YX0sZm9jdXM6ZnVuY3Rpb24oZSl7cmV0dXJuIGU9PT1DLmFjdGl2ZUVsZW1lbnQmJighQy5oYXNGb2N1c3x8Qy5oYXNGb2N1cygpKSYmISEoZS50eXBlfHxlLmhyZWZ8fH5lLnRhYkluZGV4KX0sZW5hYmxlZDpnZSghMSksZGlzYWJsZWQ6Z2UoITApLGNoZWNrZWQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PXQmJiEhZS5jaGVja2VkfHxcIm9wdGlvblwiPT09dCYmISFlLnNlbGVjdGVkfSxzZWxlY3RlZDpmdW5jdGlvbihlKXtyZXR1cm4gZS5wYXJlbnROb2RlJiZlLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCwhMD09PWUuc2VsZWN0ZWR9LGVtcHR5OmZ1bmN0aW9uKGUpe2ZvcihlPWUuZmlyc3RDaGlsZDtlO2U9ZS5uZXh0U2libGluZylpZihlLm5vZGVUeXBlPDYpcmV0dXJuITE7cmV0dXJuITB9LHBhcmVudDpmdW5jdGlvbihlKXtyZXR1cm4hYi5wc2V1ZG9zLmVtcHR5KGUpfSxoZWFkZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIEoudGVzdChlLm5vZGVOYW1lKX0saW5wdXQ6ZnVuY3Rpb24oZSl7cmV0dXJuIFEudGVzdChlLm5vZGVOYW1lKX0sYnV0dG9uOmZ1bmN0aW9uKGUpe3ZhciB0PWUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT10JiZcImJ1dHRvblwiPT09ZS50eXBlfHxcImJ1dHRvblwiPT09dH0sdGV4dDpmdW5jdGlvbihlKXt2YXIgdDtyZXR1cm5cImlucHV0XCI9PT1lLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJlwidGV4dFwiPT09ZS50eXBlJiYobnVsbD09KHQ9ZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKXx8XCJ0ZXh0XCI9PT10LnRvTG93ZXJDYXNlKCkpfSxmaXJzdDp2ZShmdW5jdGlvbigpe3JldHVyblswXX0pLGxhc3Q6dmUoZnVuY3Rpb24oZSx0KXtyZXR1cm5bdC0xXX0pLGVxOnZlKGZ1bmN0aW9uKGUsdCxuKXtyZXR1cm5bbjwwP24rdDpuXX0pLGV2ZW46dmUoZnVuY3Rpb24oZSx0KXtmb3IodmFyIG49MDtuPHQ7bis9MillLnB1c2gobik7cmV0dXJuIGV9KSxvZGQ6dmUoZnVuY3Rpb24oZSx0KXtmb3IodmFyIG49MTtuPHQ7bis9MillLnB1c2gobik7cmV0dXJuIGV9KSxsdDp2ZShmdW5jdGlvbihlLHQsbil7Zm9yKHZhciByPW48MD9uK3Q6dDxuP3Q6bjswPD0tLXI7KWUucHVzaChyKTtyZXR1cm4gZX0pLGd0OnZlKGZ1bmN0aW9uKGUsdCxuKXtmb3IodmFyIHI9bjwwP24rdDpuOysrcjx0OyllLnB1c2gocik7cmV0dXJuIGV9KX19KS5wc2V1ZG9zLm50aD1iLnBzZXVkb3MuZXEse3JhZGlvOiEwLGNoZWNrYm94OiEwLGZpbGU6ITAscGFzc3dvcmQ6ITAsaW1hZ2U6ITB9KWIucHNldWRvc1tlXT1kZShlKTtmb3IoZSBpbntzdWJtaXQ6ITAscmVzZXQ6ITB9KWIucHNldWRvc1tlXT1oZShlKTtmdW5jdGlvbiBtZSgpe31mdW5jdGlvbiB4ZShlKXtmb3IodmFyIHQ9MCxuPWUubGVuZ3RoLHI9XCJcIjt0PG47dCsrKXIrPWVbdF0udmFsdWU7cmV0dXJuIHJ9ZnVuY3Rpb24gYmUocyxlLHQpe3ZhciB1PWUuZGlyLGw9ZS5uZXh0LGM9bHx8dSxmPXQmJlwicGFyZW50Tm9kZVwiPT09YyxwPXIrKztyZXR1cm4gZS5maXJzdD9mdW5jdGlvbihlLHQsbil7d2hpbGUoZT1lW3VdKWlmKDE9PT1lLm5vZGVUeXBlfHxmKXJldHVybiBzKGUsdCxuKTtyZXR1cm4hMX06ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGksbyxhPVtrLHBdO2lmKG4pe3doaWxlKGU9ZVt1XSlpZigoMT09PWUubm9kZVR5cGV8fGYpJiZzKGUsdCxuKSlyZXR1cm4hMH1lbHNlIHdoaWxlKGU9ZVt1XSlpZigxPT09ZS5ub2RlVHlwZXx8ZilpZihpPShvPWVbU118fChlW1NdPXt9KSlbZS51bmlxdWVJRF18fChvW2UudW5pcXVlSURdPXt9KSxsJiZsPT09ZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKWU9ZVt1XXx8ZTtlbHNle2lmKChyPWlbY10pJiZyWzBdPT09ayYmclsxXT09PXApcmV0dXJuIGFbMl09clsyXTtpZigoaVtjXT1hKVsyXT1zKGUsdCxuKSlyZXR1cm4hMH1yZXR1cm4hMX19ZnVuY3Rpb24gd2UoaSl7cmV0dXJuIDE8aS5sZW5ndGg/ZnVuY3Rpb24oZSx0LG4pe3ZhciByPWkubGVuZ3RoO3doaWxlKHItLSlpZighaVtyXShlLHQsbikpcmV0dXJuITE7cmV0dXJuITB9OmlbMF19ZnVuY3Rpb24gVGUoZSx0LG4scixpKXtmb3IodmFyIG8sYT1bXSxzPTAsdT1lLmxlbmd0aCxsPW51bGwhPXQ7czx1O3MrKykobz1lW3NdKSYmKG4mJiFuKG8scixpKXx8KGEucHVzaChvKSxsJiZ0LnB1c2gocykpKTtyZXR1cm4gYX1mdW5jdGlvbiBDZShkLGgsZyx2LHksZSl7cmV0dXJuIHYmJiF2W1NdJiYodj1DZSh2KSkseSYmIXlbU10mJih5PUNlKHksZSkpLGxlKGZ1bmN0aW9uKGUsdCxuLHIpe3ZhciBpLG8sYSxzPVtdLHU9W10sbD10Lmxlbmd0aCxjPWV8fGZ1bmN0aW9uKGUsdCxuKXtmb3IodmFyIHI9MCxpPXQubGVuZ3RoO3I8aTtyKyspc2UoZSx0W3JdLG4pO3JldHVybiBufShofHxcIipcIixuLm5vZGVUeXBlP1tuXTpuLFtdKSxmPSFkfHwhZSYmaD9jOlRlKGMscyxkLG4scikscD1nP3l8fChlP2Q6bHx8dik/W106dDpmO2lmKGcmJmcoZixwLG4sciksdil7aT1UZShwLHUpLHYoaSxbXSxuLHIpLG89aS5sZW5ndGg7d2hpbGUoby0tKShhPWlbb10pJiYocFt1W29dXT0hKGZbdVtvXV09YSkpfWlmKGUpe2lmKHl8fGQpe2lmKHkpe2k9W10sbz1wLmxlbmd0aDt3aGlsZShvLS0pKGE9cFtvXSkmJmkucHVzaChmW29dPWEpO3kobnVsbCxwPVtdLGkscil9bz1wLmxlbmd0aDt3aGlsZShvLS0pKGE9cFtvXSkmJi0xPChpPXk/UChlLGEpOnNbb10pJiYoZVtpXT0hKHRbaV09YSkpfX1lbHNlIHA9VGUocD09PXQ/cC5zcGxpY2UobCxwLmxlbmd0aCk6cCkseT95KG51bGwsdCxwLHIpOkguYXBwbHkodCxwKX0pfWZ1bmN0aW9uIEVlKGUpe2Zvcih2YXIgaSx0LG4scj1lLmxlbmd0aCxvPWIucmVsYXRpdmVbZVswXS50eXBlXSxhPW98fGIucmVsYXRpdmVbXCIgXCJdLHM9bz8xOjAsdT1iZShmdW5jdGlvbihlKXtyZXR1cm4gZT09PWl9LGEsITApLGw9YmUoZnVuY3Rpb24oZSl7cmV0dXJuLTE8UChpLGUpfSxhLCEwKSxjPVtmdW5jdGlvbihlLHQsbil7dmFyIHI9IW8mJihufHx0IT09dyl8fCgoaT10KS5ub2RlVHlwZT91KGUsdCxuKTpsKGUsdCxuKSk7cmV0dXJuIGk9bnVsbCxyfV07czxyO3MrKylpZih0PWIucmVsYXRpdmVbZVtzXS50eXBlXSljPVtiZSh3ZShjKSx0KV07ZWxzZXtpZigodD1iLmZpbHRlcltlW3NdLnR5cGVdLmFwcGx5KG51bGwsZVtzXS5tYXRjaGVzKSlbU10pe2ZvcihuPSsrcztuPHI7bisrKWlmKGIucmVsYXRpdmVbZVtuXS50eXBlXSlicmVhaztyZXR1cm4gQ2UoMTxzJiZ3ZShjKSwxPHMmJnhlKGUuc2xpY2UoMCxzLTEpLmNvbmNhdCh7dmFsdWU6XCIgXCI9PT1lW3MtMl0udHlwZT9cIipcIjpcIlwifSkpLnJlcGxhY2UoJCxcIiQxXCIpLHQsczxuJiZFZShlLnNsaWNlKHMsbikpLG48ciYmRWUoZT1lLnNsaWNlKG4pKSxuPHImJnhlKGUpKX1jLnB1c2godCl9cmV0dXJuIHdlKGMpfXJldHVybiBtZS5wcm90b3R5cGU9Yi5maWx0ZXJzPWIucHNldWRvcyxiLnNldEZpbHRlcnM9bmV3IG1lLGg9c2UudG9rZW5pemU9ZnVuY3Rpb24oZSx0KXt2YXIgbixyLGksbyxhLHMsdSxsPXhbZStcIiBcIl07aWYobClyZXR1cm4gdD8wOmwuc2xpY2UoMCk7YT1lLHM9W10sdT1iLnByZUZpbHRlcjt3aGlsZShhKXtmb3IobyBpbiBuJiYhKHI9Xy5leGVjKGEpKXx8KHImJihhPWEuc2xpY2UoclswXS5sZW5ndGgpfHxhKSxzLnB1c2goaT1bXSkpLG49ITEsKHI9ei5leGVjKGEpKSYmKG49ci5zaGlmdCgpLGkucHVzaCh7dmFsdWU6bix0eXBlOnJbMF0ucmVwbGFjZSgkLFwiIFwiKX0pLGE9YS5zbGljZShuLmxlbmd0aCkpLGIuZmlsdGVyKSEocj1HW29dLmV4ZWMoYSkpfHx1W29dJiYhKHI9dVtvXShyKSl8fChuPXIuc2hpZnQoKSxpLnB1c2goe3ZhbHVlOm4sdHlwZTpvLG1hdGNoZXM6cn0pLGE9YS5zbGljZShuLmxlbmd0aCkpO2lmKCFuKWJyZWFrfXJldHVybiB0P2EubGVuZ3RoOmE/c2UuZXJyb3IoZSk6eChlLHMpLnNsaWNlKDApfSxmPXNlLmNvbXBpbGU9ZnVuY3Rpb24oZSx0KXt2YXIgbix2LHksbSx4LHIsaT1bXSxvPVtdLGE9QVtlK1wiIFwiXTtpZighYSl7dHx8KHQ9aChlKSksbj10Lmxlbmd0aDt3aGlsZShuLS0pKGE9RWUodFtuXSkpW1NdP2kucHVzaChhKTpvLnB1c2goYSk7KGE9QShlLCh2PW8sbT0wPCh5PWkpLmxlbmd0aCx4PTA8di5sZW5ndGgscj1mdW5jdGlvbihlLHQsbixyLGkpe3ZhciBvLGEscyx1PTAsbD1cIjBcIixjPWUmJltdLGY9W10scD13LGQ9ZXx8eCYmYi5maW5kLlRBRyhcIipcIixpKSxoPWsrPW51bGw9PXA/MTpNYXRoLnJhbmRvbSgpfHwuMSxnPWQubGVuZ3RoO2ZvcihpJiYodz10PT1DfHx0fHxpKTtsIT09ZyYmbnVsbCE9KG89ZFtsXSk7bCsrKXtpZih4JiZvKXthPTAsdHx8by5vd25lckRvY3VtZW50PT1DfHwoVChvKSxuPSFFKTt3aGlsZShzPXZbYSsrXSlpZihzKG8sdHx8QyxuKSl7ci5wdXNoKG8pO2JyZWFrfWkmJihrPWgpfW0mJigobz0hcyYmbykmJnUtLSxlJiZjLnB1c2gobykpfWlmKHUrPWwsbSYmbCE9PXUpe2E9MDt3aGlsZShzPXlbYSsrXSlzKGMsZix0LG4pO2lmKGUpe2lmKDA8dSl3aGlsZShsLS0pY1tsXXx8ZltsXXx8KGZbbF09cS5jYWxsKHIpKTtmPVRlKGYpfUguYXBwbHkocixmKSxpJiYhZSYmMDxmLmxlbmd0aCYmMTx1K3kubGVuZ3RoJiZzZS51bmlxdWVTb3J0KHIpfXJldHVybiBpJiYoaz1oLHc9cCksY30sbT9sZShyKTpyKSkpLnNlbGVjdG9yPWV9cmV0dXJuIGF9LGc9c2Uuc2VsZWN0PWZ1bmN0aW9uKGUsdCxuLHIpe3ZhciBpLG8sYSxzLHUsbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiZlLGM9IXImJmgoZT1sLnNlbGVjdG9yfHxlKTtpZihuPW58fFtdLDE9PT1jLmxlbmd0aCl7aWYoMjwobz1jWzBdPWNbMF0uc2xpY2UoMCkpLmxlbmd0aCYmXCJJRFwiPT09KGE9b1swXSkudHlwZSYmOT09PXQubm9kZVR5cGUmJkUmJmIucmVsYXRpdmVbb1sxXS50eXBlXSl7aWYoISh0PShiLmZpbmQuSUQoYS5tYXRjaGVzWzBdLnJlcGxhY2UodGUsbmUpLHQpfHxbXSlbMF0pKXJldHVybiBuO2wmJih0PXQucGFyZW50Tm9kZSksZT1lLnNsaWNlKG8uc2hpZnQoKS52YWx1ZS5sZW5ndGgpfWk9Ry5uZWVkc0NvbnRleHQudGVzdChlKT8wOm8ubGVuZ3RoO3doaWxlKGktLSl7aWYoYT1vW2ldLGIucmVsYXRpdmVbcz1hLnR5cGVdKWJyZWFrO2lmKCh1PWIuZmluZFtzXSkmJihyPXUoYS5tYXRjaGVzWzBdLnJlcGxhY2UodGUsbmUpLGVlLnRlc3Qob1swXS50eXBlKSYmeWUodC5wYXJlbnROb2RlKXx8dCkpKXtpZihvLnNwbGljZShpLDEpLCEoZT1yLmxlbmd0aCYmeGUobykpKXJldHVybiBILmFwcGx5KG4sciksbjticmVha319fXJldHVybihsfHxmKGUsYykpKHIsdCwhRSxuLCF0fHxlZS50ZXN0KGUpJiZ5ZSh0LnBhcmVudE5vZGUpfHx0KSxufSxkLnNvcnRTdGFibGU9Uy5zcGxpdChcIlwiKS5zb3J0KGopLmpvaW4oXCJcIik9PT1TLGQuZGV0ZWN0RHVwbGljYXRlcz0hIWwsVCgpLGQuc29ydERldGFjaGVkPWNlKGZ1bmN0aW9uKGUpe3JldHVybiAxJmUuY29tcGFyZURvY3VtZW50UG9zaXRpb24oQy5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIikpfSksY2UoZnVuY3Rpb24oZSl7cmV0dXJuIGUuaW5uZXJIVE1MPVwiPGEgaHJlZj0nIyc+PC9hPlwiLFwiI1wiPT09ZS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImhyZWZcIil9KXx8ZmUoXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsZnVuY3Rpb24oZSx0LG4pe2lmKCFuKXJldHVybiBlLmdldEF0dHJpYnV0ZSh0LFwidHlwZVwiPT09dC50b0xvd2VyQ2FzZSgpPzE6Mil9KSxkLmF0dHJpYnV0ZXMmJmNlKGZ1bmN0aW9uKGUpe3JldHVybiBlLmlubmVySFRNTD1cIjxpbnB1dC8+XCIsZS5maXJzdENoaWxkLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsXCJcIiksXCJcIj09PWUuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKX0pfHxmZShcInZhbHVlXCIsZnVuY3Rpb24oZSx0LG4pe2lmKCFuJiZcImlucHV0XCI9PT1lLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpcmV0dXJuIGUuZGVmYXVsdFZhbHVlfSksY2UoZnVuY3Rpb24oZSl7cmV0dXJuIG51bGw9PWUuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIil9KXx8ZmUoUixmdW5jdGlvbihlLHQsbil7dmFyIHI7aWYoIW4pcmV0dXJuITA9PT1lW3RdP3QudG9Mb3dlckNhc2UoKToocj1lLmdldEF0dHJpYnV0ZU5vZGUodCkpJiZyLnNwZWNpZmllZD9yLnZhbHVlOm51bGx9KSxzZX0oQyk7Uy5maW5kPWQsUy5leHByPWQuc2VsZWN0b3JzLFMuZXhwcltcIjpcIl09Uy5leHByLnBzZXVkb3MsUy51bmlxdWVTb3J0PVMudW5pcXVlPWQudW5pcXVlU29ydCxTLnRleHQ9ZC5nZXRUZXh0LFMuaXNYTUxEb2M9ZC5pc1hNTCxTLmNvbnRhaW5zPWQuY29udGFpbnMsUy5lc2NhcGVTZWxlY3Rvcj1kLmVzY2FwZTt2YXIgaD1mdW5jdGlvbihlLHQsbil7dmFyIHI9W10saT12b2lkIDAhPT1uO3doaWxlKChlPWVbdF0pJiY5IT09ZS5ub2RlVHlwZSlpZigxPT09ZS5ub2RlVHlwZSl7aWYoaSYmUyhlKS5pcyhuKSlicmVhaztyLnB1c2goZSl9cmV0dXJuIHJ9LFQ9ZnVuY3Rpb24oZSx0KXtmb3IodmFyIG49W107ZTtlPWUubmV4dFNpYmxpbmcpMT09PWUubm9kZVR5cGUmJmUhPT10JiZuLnB1c2goZSk7cmV0dXJuIG59LGs9Uy5leHByLm1hdGNoLm5lZWRzQ29udGV4dDtmdW5jdGlvbiBBKGUsdCl7cmV0dXJuIGUubm9kZU5hbWUmJmUubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PXQudG9Mb3dlckNhc2UoKX12YXIgTj0vXjwoW2Etel1bXlxcL1xcMD46XFx4MjBcXHRcXHJcXG5cXGZdKilbXFx4MjBcXHRcXHJcXG5cXGZdKlxcLz8+KD86PFxcL1xcMT58KSQvaTtmdW5jdGlvbiBqKGUsbixyKXtyZXR1cm4gbShuKT9TLmdyZXAoZSxmdW5jdGlvbihlLHQpe3JldHVybiEhbi5jYWxsKGUsdCxlKSE9PXJ9KTpuLm5vZGVUeXBlP1MuZ3JlcChlLGZ1bmN0aW9uKGUpe3JldHVybiBlPT09biE9PXJ9KTpcInN0cmluZ1wiIT10eXBlb2Ygbj9TLmdyZXAoZSxmdW5jdGlvbihlKXtyZXR1cm4tMTxpLmNhbGwobixlKSE9PXJ9KTpTLmZpbHRlcihuLGUscil9Uy5maWx0ZXI9ZnVuY3Rpb24oZSx0LG4pe3ZhciByPXRbMF07cmV0dXJuIG4mJihlPVwiOm5vdChcIitlK1wiKVwiKSwxPT09dC5sZW5ndGgmJjE9PT1yLm5vZGVUeXBlP1MuZmluZC5tYXRjaGVzU2VsZWN0b3IocixlKT9bcl06W106Uy5maW5kLm1hdGNoZXMoZSxTLmdyZXAodCxmdW5jdGlvbihlKXtyZXR1cm4gMT09PWUubm9kZVR5cGV9KSl9LFMuZm4uZXh0ZW5kKHtmaW5kOmZ1bmN0aW9uKGUpe3ZhciB0LG4scj10aGlzLmxlbmd0aCxpPXRoaXM7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGUpcmV0dXJuIHRoaXMucHVzaFN0YWNrKFMoZSkuZmlsdGVyKGZ1bmN0aW9uKCl7Zm9yKHQ9MDt0PHI7dCsrKWlmKFMuY29udGFpbnMoaVt0XSx0aGlzKSlyZXR1cm4hMH0pKTtmb3Iobj10aGlzLnB1c2hTdGFjayhbXSksdD0wO3Q8cjt0KyspUy5maW5kKGUsaVt0XSxuKTtyZXR1cm4gMTxyP1MudW5pcXVlU29ydChuKTpufSxmaWx0ZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGoodGhpcyxlfHxbXSwhMSkpfSxub3Q6ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGoodGhpcyxlfHxbXSwhMCkpfSxpczpmdW5jdGlvbihlKXtyZXR1cm4hIWoodGhpcyxcInN0cmluZ1wiPT10eXBlb2YgZSYmay50ZXN0KGUpP1MoZSk6ZXx8W10sITEpLmxlbmd0aH19KTt2YXIgRCxxPS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSspKSQvOyhTLmZuLmluaXQ9ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGk7aWYoIWUpcmV0dXJuIHRoaXM7aWYobj1ufHxELFwic3RyaW5nXCI9PXR5cGVvZiBlKXtpZighKHI9XCI8XCI9PT1lWzBdJiZcIj5cIj09PWVbZS5sZW5ndGgtMV0mJjM8PWUubGVuZ3RoP1tudWxsLGUsbnVsbF06cS5leGVjKGUpKXx8IXJbMV0mJnQpcmV0dXJuIXR8fHQuanF1ZXJ5Pyh0fHxuKS5maW5kKGUpOnRoaXMuY29uc3RydWN0b3IodCkuZmluZChlKTtpZihyWzFdKXtpZih0PXQgaW5zdGFuY2VvZiBTP3RbMF06dCxTLm1lcmdlKHRoaXMsUy5wYXJzZUhUTUwoclsxXSx0JiZ0Lm5vZGVUeXBlP3Qub3duZXJEb2N1bWVudHx8dDpFLCEwKSksTi50ZXN0KHJbMV0pJiZTLmlzUGxhaW5PYmplY3QodCkpZm9yKHIgaW4gdCltKHRoaXNbcl0pP3RoaXNbcl0odFtyXSk6dGhpcy5hdHRyKHIsdFtyXSk7cmV0dXJuIHRoaXN9cmV0dXJuKGk9RS5nZXRFbGVtZW50QnlJZChyWzJdKSkmJih0aGlzWzBdPWksdGhpcy5sZW5ndGg9MSksdGhpc31yZXR1cm4gZS5ub2RlVHlwZT8odGhpc1swXT1lLHRoaXMubGVuZ3RoPTEsdGhpcyk6bShlKT92b2lkIDAhPT1uLnJlYWR5P24ucmVhZHkoZSk6ZShTKTpTLm1ha2VBcnJheShlLHRoaXMpfSkucHJvdG90eXBlPVMuZm4sRD1TKEUpO3ZhciBMPS9eKD86cGFyZW50c3xwcmV2KD86VW50aWx8QWxsKSkvLEg9e2NoaWxkcmVuOiEwLGNvbnRlbnRzOiEwLG5leHQ6ITAscHJldjohMH07ZnVuY3Rpb24gTyhlLHQpe3doaWxlKChlPWVbdF0pJiYxIT09ZS5ub2RlVHlwZSk7cmV0dXJuIGV9Uy5mbi5leHRlbmQoe2hhczpmdW5jdGlvbihlKXt2YXIgdD1TKGUsdGhpcyksbj10Lmxlbmd0aDtyZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24oKXtmb3IodmFyIGU9MDtlPG47ZSsrKWlmKFMuY29udGFpbnModGhpcyx0W2VdKSlyZXR1cm4hMH0pfSxjbG9zZXN0OmZ1bmN0aW9uKGUsdCl7dmFyIG4scj0wLGk9dGhpcy5sZW5ndGgsbz1bXSxhPVwic3RyaW5nXCIhPXR5cGVvZiBlJiZTKGUpO2lmKCFrLnRlc3QoZSkpZm9yKDtyPGk7cisrKWZvcihuPXRoaXNbcl07biYmbiE9PXQ7bj1uLnBhcmVudE5vZGUpaWYobi5ub2RlVHlwZTwxMSYmKGE/LTE8YS5pbmRleChuKToxPT09bi5ub2RlVHlwZSYmUy5maW5kLm1hdGNoZXNTZWxlY3RvcihuLGUpKSl7by5wdXNoKG4pO2JyZWFrfXJldHVybiB0aGlzLnB1c2hTdGFjaygxPG8ubGVuZ3RoP1MudW5pcXVlU29ydChvKTpvKX0saW5kZXg6ZnVuY3Rpb24oZSl7cmV0dXJuIGU/XCJzdHJpbmdcIj09dHlwZW9mIGU/aS5jYWxsKFMoZSksdGhpc1swXSk6aS5jYWxsKHRoaXMsZS5qcXVlcnk/ZVswXTplKTp0aGlzWzBdJiZ0aGlzWzBdLnBhcmVudE5vZGU/dGhpcy5maXJzdCgpLnByZXZBbGwoKS5sZW5ndGg6LTF9LGFkZDpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLnB1c2hTdGFjayhTLnVuaXF1ZVNvcnQoUy5tZXJnZSh0aGlzLmdldCgpLFMoZSx0KSkpKX0sYWRkQmFjazpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5hZGQobnVsbD09ZT90aGlzLnByZXZPYmplY3Q6dGhpcy5wcmV2T2JqZWN0LmZpbHRlcihlKSl9fSksUy5lYWNoKHtwYXJlbnQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5wYXJlbnROb2RlO3JldHVybiB0JiYxMSE9PXQubm9kZVR5cGU/dDpudWxsfSxwYXJlbnRzOmZ1bmN0aW9uKGUpe3JldHVybiBoKGUsXCJwYXJlbnROb2RlXCIpfSxwYXJlbnRzVW50aWw6ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBoKGUsXCJwYXJlbnROb2RlXCIsbil9LG5leHQ6ZnVuY3Rpb24oZSl7cmV0dXJuIE8oZSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2OmZ1bmN0aW9uKGUpe3JldHVybiBPKGUsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRBbGw6ZnVuY3Rpb24oZSl7cmV0dXJuIGgoZSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2QWxsOmZ1bmN0aW9uKGUpe3JldHVybiBoKGUsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRVbnRpbDpmdW5jdGlvbihlLHQsbil7cmV0dXJuIGgoZSxcIm5leHRTaWJsaW5nXCIsbil9LHByZXZVbnRpbDpmdW5jdGlvbihlLHQsbil7cmV0dXJuIGgoZSxcInByZXZpb3VzU2libGluZ1wiLG4pfSxzaWJsaW5nczpmdW5jdGlvbihlKXtyZXR1cm4gVCgoZS5wYXJlbnROb2RlfHx7fSkuZmlyc3RDaGlsZCxlKX0sY2hpbGRyZW46ZnVuY3Rpb24oZSl7cmV0dXJuIFQoZS5maXJzdENoaWxkKX0sY29udGVudHM6ZnVuY3Rpb24oZSl7cmV0dXJuIG51bGwhPWUuY29udGVudERvY3VtZW50JiZyKGUuY29udGVudERvY3VtZW50KT9lLmNvbnRlbnREb2N1bWVudDooQShlLFwidGVtcGxhdGVcIikmJihlPWUuY29udGVudHx8ZSksUy5tZXJnZShbXSxlLmNoaWxkTm9kZXMpKX19LGZ1bmN0aW9uKHIsaSl7Uy5mbltyXT1mdW5jdGlvbihlLHQpe3ZhciBuPVMubWFwKHRoaXMsaSxlKTtyZXR1cm5cIlVudGlsXCIhPT1yLnNsaWNlKC01KSYmKHQ9ZSksdCYmXCJzdHJpbmdcIj09dHlwZW9mIHQmJihuPVMuZmlsdGVyKHQsbikpLDE8dGhpcy5sZW5ndGgmJihIW3JdfHxTLnVuaXF1ZVNvcnQobiksTC50ZXN0KHIpJiZuLnJldmVyc2UoKSksdGhpcy5wdXNoU3RhY2sobil9fSk7dmFyIFA9L1teXFx4MjBcXHRcXHJcXG5cXGZdKy9nO2Z1bmN0aW9uIFIoZSl7cmV0dXJuIGV9ZnVuY3Rpb24gTShlKXt0aHJvdyBlfWZ1bmN0aW9uIEkoZSx0LG4scil7dmFyIGk7dHJ5e2UmJm0oaT1lLnByb21pc2UpP2kuY2FsbChlKS5kb25lKHQpLmZhaWwobik6ZSYmbShpPWUudGhlbik/aS5jYWxsKGUsdCxuKTp0LmFwcGx5KHZvaWQgMCxbZV0uc2xpY2UocikpfWNhdGNoKGUpe24uYXBwbHkodm9pZCAwLFtlXSl9fVMuQ2FsbGJhY2tzPWZ1bmN0aW9uKHIpe3ZhciBlLG47cj1cInN0cmluZ1wiPT10eXBlb2Ygcj8oZT1yLG49e30sUy5lYWNoKGUubWF0Y2goUCl8fFtdLGZ1bmN0aW9uKGUsdCl7blt0XT0hMH0pLG4pOlMuZXh0ZW5kKHt9LHIpO3ZhciBpLHQsbyxhLHM9W10sdT1bXSxsPS0xLGM9ZnVuY3Rpb24oKXtmb3IoYT1hfHxyLm9uY2Usbz1pPSEwO3UubGVuZ3RoO2w9LTEpe3Q9dS5zaGlmdCgpO3doaWxlKCsrbDxzLmxlbmd0aCkhMT09PXNbbF0uYXBwbHkodFswXSx0WzFdKSYmci5zdG9wT25GYWxzZSYmKGw9cy5sZW5ndGgsdD0hMSl9ci5tZW1vcnl8fCh0PSExKSxpPSExLGEmJihzPXQ/W106XCJcIil9LGY9e2FkZDpmdW5jdGlvbigpe3JldHVybiBzJiYodCYmIWkmJihsPXMubGVuZ3RoLTEsdS5wdXNoKHQpKSxmdW5jdGlvbiBuKGUpe1MuZWFjaChlLGZ1bmN0aW9uKGUsdCl7bSh0KT9yLnVuaXF1ZSYmZi5oYXModCl8fHMucHVzaCh0KTp0JiZ0Lmxlbmd0aCYmXCJzdHJpbmdcIiE9PXcodCkmJm4odCl9KX0oYXJndW1lbnRzKSx0JiYhaSYmYygpKSx0aGlzfSxyZW1vdmU6ZnVuY3Rpb24oKXtyZXR1cm4gUy5lYWNoKGFyZ3VtZW50cyxmdW5jdGlvbihlLHQpe3ZhciBuO3doaWxlKC0xPChuPVMuaW5BcnJheSh0LHMsbikpKXMuc3BsaWNlKG4sMSksbjw9bCYmbC0tfSksdGhpc30saGFzOmZ1bmN0aW9uKGUpe3JldHVybiBlPy0xPFMuaW5BcnJheShlLHMpOjA8cy5sZW5ndGh9LGVtcHR5OmZ1bmN0aW9uKCl7cmV0dXJuIHMmJihzPVtdKSx0aGlzfSxkaXNhYmxlOmZ1bmN0aW9uKCl7cmV0dXJuIGE9dT1bXSxzPXQ9XCJcIix0aGlzfSxkaXNhYmxlZDpmdW5jdGlvbigpe3JldHVybiFzfSxsb2NrOmZ1bmN0aW9uKCl7cmV0dXJuIGE9dT1bXSx0fHxpfHwocz10PVwiXCIpLHRoaXN9LGxvY2tlZDpmdW5jdGlvbigpe3JldHVybiEhYX0sZmlyZVdpdGg6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gYXx8KHQ9W2UsKHQ9dHx8W10pLnNsaWNlP3Quc2xpY2UoKTp0XSx1LnB1c2godCksaXx8YygpKSx0aGlzfSxmaXJlOmZ1bmN0aW9uKCl7cmV0dXJuIGYuZmlyZVdpdGgodGhpcyxhcmd1bWVudHMpLHRoaXN9LGZpcmVkOmZ1bmN0aW9uKCl7cmV0dXJuISFvfX07cmV0dXJuIGZ9LFMuZXh0ZW5kKHtEZWZlcnJlZDpmdW5jdGlvbihlKXt2YXIgbz1bW1wibm90aWZ5XCIsXCJwcm9ncmVzc1wiLFMuQ2FsbGJhY2tzKFwibWVtb3J5XCIpLFMuQ2FsbGJhY2tzKFwibWVtb3J5XCIpLDJdLFtcInJlc29sdmVcIixcImRvbmVcIixTLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLFMuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksMCxcInJlc29sdmVkXCJdLFtcInJlamVjdFwiLFwiZmFpbFwiLFMuQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksUy5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSwxLFwicmVqZWN0ZWRcIl1dLGk9XCJwZW5kaW5nXCIsYT17c3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gaX0sYWx3YXlzOmZ1bmN0aW9uKCl7cmV0dXJuIHMuZG9uZShhcmd1bWVudHMpLmZhaWwoYXJndW1lbnRzKSx0aGlzfSxcImNhdGNoXCI6ZnVuY3Rpb24oZSl7cmV0dXJuIGEudGhlbihudWxsLGUpfSxwaXBlOmZ1bmN0aW9uKCl7dmFyIGk9YXJndW1lbnRzO3JldHVybiBTLkRlZmVycmVkKGZ1bmN0aW9uKHIpe1MuZWFjaChvLGZ1bmN0aW9uKGUsdCl7dmFyIG49bShpW3RbNF1dKSYmaVt0WzRdXTtzW3RbMV1dKGZ1bmN0aW9uKCl7dmFyIGU9biYmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7ZSYmbShlLnByb21pc2UpP2UucHJvbWlzZSgpLnByb2dyZXNzKHIubm90aWZ5KS5kb25lKHIucmVzb2x2ZSkuZmFpbChyLnJlamVjdCk6clt0WzBdK1wiV2l0aFwiXSh0aGlzLG4/W2VdOmFyZ3VtZW50cyl9KX0pLGk9bnVsbH0pLnByb21pc2UoKX0sdGhlbjpmdW5jdGlvbih0LG4scil7dmFyIHU9MDtmdW5jdGlvbiBsKGksbyxhLHMpe3JldHVybiBmdW5jdGlvbigpe3ZhciBuPXRoaXMscj1hcmd1bWVudHMsZT1mdW5jdGlvbigpe3ZhciBlLHQ7aWYoIShpPHUpKXtpZigoZT1hLmFwcGx5KG4scikpPT09by5wcm9taXNlKCkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZW5hYmxlIHNlbGYtcmVzb2x1dGlvblwiKTt0PWUmJihcIm9iamVjdFwiPT10eXBlb2YgZXx8XCJmdW5jdGlvblwiPT10eXBlb2YgZSkmJmUudGhlbixtKHQpP3M/dC5jYWxsKGUsbCh1LG8sUixzKSxsKHUsbyxNLHMpKToodSsrLHQuY2FsbChlLGwodSxvLFIscyksbCh1LG8sTSxzKSxsKHUsbyxSLG8ubm90aWZ5V2l0aCkpKTooYSE9PVImJihuPXZvaWQgMCxyPVtlXSksKHN8fG8ucmVzb2x2ZVdpdGgpKG4scikpfX0sdD1zP2U6ZnVuY3Rpb24oKXt0cnl7ZSgpfWNhdGNoKGUpe1MuRGVmZXJyZWQuZXhjZXB0aW9uSG9vayYmUy5EZWZlcnJlZC5leGNlcHRpb25Ib29rKGUsdC5zdGFja1RyYWNlKSx1PD1pKzEmJihhIT09TSYmKG49dm9pZCAwLHI9W2VdKSxvLnJlamVjdFdpdGgobixyKSl9fTtpP3QoKTooUy5EZWZlcnJlZC5nZXRTdGFja0hvb2smJih0LnN0YWNrVHJhY2U9Uy5EZWZlcnJlZC5nZXRTdGFja0hvb2soKSksQy5zZXRUaW1lb3V0KHQpKX19cmV0dXJuIFMuRGVmZXJyZWQoZnVuY3Rpb24oZSl7b1swXVszXS5hZGQobCgwLGUsbShyKT9yOlIsZS5ub3RpZnlXaXRoKSksb1sxXVszXS5hZGQobCgwLGUsbSh0KT90OlIpKSxvWzJdWzNdLmFkZChsKDAsZSxtKG4pP246TSkpfSkucHJvbWlzZSgpfSxwcm9taXNlOmZ1bmN0aW9uKGUpe3JldHVybiBudWxsIT1lP1MuZXh0ZW5kKGUsYSk6YX19LHM9e307cmV0dXJuIFMuZWFjaChvLGZ1bmN0aW9uKGUsdCl7dmFyIG49dFsyXSxyPXRbNV07YVt0WzFdXT1uLmFkZCxyJiZuLmFkZChmdW5jdGlvbigpe2k9cn0sb1szLWVdWzJdLmRpc2FibGUsb1szLWVdWzNdLmRpc2FibGUsb1swXVsyXS5sb2NrLG9bMF1bM10ubG9jayksbi5hZGQodFszXS5maXJlKSxzW3RbMF1dPWZ1bmN0aW9uKCl7cmV0dXJuIHNbdFswXStcIldpdGhcIl0odGhpcz09PXM/dm9pZCAwOnRoaXMsYXJndW1lbnRzKSx0aGlzfSxzW3RbMF0rXCJXaXRoXCJdPW4uZmlyZVdpdGh9KSxhLnByb21pc2UocyksZSYmZS5jYWxsKHMscyksc30sd2hlbjpmdW5jdGlvbihlKXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoLHQ9bixyPUFycmF5KHQpLGk9cy5jYWxsKGFyZ3VtZW50cyksbz1TLkRlZmVycmVkKCksYT1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7clt0XT10aGlzLGlbdF09MTxhcmd1bWVudHMubGVuZ3RoP3MuY2FsbChhcmd1bWVudHMpOmUsLS1ufHxvLnJlc29sdmVXaXRoKHIsaSl9fTtpZihuPD0xJiYoSShlLG8uZG9uZShhKHQpKS5yZXNvbHZlLG8ucmVqZWN0LCFuKSxcInBlbmRpbmdcIj09PW8uc3RhdGUoKXx8bShpW3RdJiZpW3RdLnRoZW4pKSlyZXR1cm4gby50aGVuKCk7d2hpbGUodC0tKUkoaVt0XSxhKHQpLG8ucmVqZWN0KTtyZXR1cm4gby5wcm9taXNlKCl9fSk7dmFyIFc9L14oRXZhbHxJbnRlcm5hbHxSYW5nZXxSZWZlcmVuY2V8U3ludGF4fFR5cGV8VVJJKUVycm9yJC87Uy5EZWZlcnJlZC5leGNlcHRpb25Ib29rPWZ1bmN0aW9uKGUsdCl7Qy5jb25zb2xlJiZDLmNvbnNvbGUud2FybiYmZSYmVy50ZXN0KGUubmFtZSkmJkMuY29uc29sZS53YXJuKFwialF1ZXJ5LkRlZmVycmVkIGV4Y2VwdGlvbjogXCIrZS5tZXNzYWdlLGUuc3RhY2ssdCl9LFMucmVhZHlFeGNlcHRpb249ZnVuY3Rpb24oZSl7Qy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhyb3cgZX0pfTt2YXIgRj1TLkRlZmVycmVkKCk7ZnVuY3Rpb24gQigpe0UucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixCKSxDLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsQiksUy5yZWFkeSgpfVMuZm4ucmVhZHk9ZnVuY3Rpb24oZSl7cmV0dXJuIEYudGhlbihlKVtcImNhdGNoXCJdKGZ1bmN0aW9uKGUpe1MucmVhZHlFeGNlcHRpb24oZSl9KSx0aGlzfSxTLmV4dGVuZCh7aXNSZWFkeTohMSxyZWFkeVdhaXQ6MSxyZWFkeTpmdW5jdGlvbihlKXsoITA9PT1lPy0tUy5yZWFkeVdhaXQ6Uy5pc1JlYWR5KXx8KFMuaXNSZWFkeT0hMCkhPT1lJiYwPC0tUy5yZWFkeVdhaXR8fEYucmVzb2x2ZVdpdGgoRSxbU10pfX0pLFMucmVhZHkudGhlbj1GLnRoZW4sXCJjb21wbGV0ZVwiPT09RS5yZWFkeVN0YXRlfHxcImxvYWRpbmdcIiE9PUUucmVhZHlTdGF0ZSYmIUUuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsP0Muc2V0VGltZW91dChTLnJlYWR5KTooRS5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLEIpLEMuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixCKSk7dmFyICQ9ZnVuY3Rpb24oZSx0LG4scixpLG8sYSl7dmFyIHM9MCx1PWUubGVuZ3RoLGw9bnVsbD09bjtpZihcIm9iamVjdFwiPT09dyhuKSlmb3IocyBpbiBpPSEwLG4pJChlLHQscyxuW3NdLCEwLG8sYSk7ZWxzZSBpZih2b2lkIDAhPT1yJiYoaT0hMCxtKHIpfHwoYT0hMCksbCYmKGE/KHQuY2FsbChlLHIpLHQ9bnVsbCk6KGw9dCx0PWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gbC5jYWxsKFMoZSksbil9KSksdCkpZm9yKDtzPHU7cysrKXQoZVtzXSxuLGE/cjpyLmNhbGwoZVtzXSxzLHQoZVtzXSxuKSkpO3JldHVybiBpP2U6bD90LmNhbGwoZSk6dT90KGVbMF0sbik6b30sXz0vXi1tcy0vLHo9Ly0oW2Etel0pL2c7ZnVuY3Rpb24gVShlLHQpe3JldHVybiB0LnRvVXBwZXJDYXNlKCl9ZnVuY3Rpb24gWChlKXtyZXR1cm4gZS5yZXBsYWNlKF8sXCJtcy1cIikucmVwbGFjZSh6LFUpfXZhciBWPWZ1bmN0aW9uKGUpe3JldHVybiAxPT09ZS5ub2RlVHlwZXx8OT09PWUubm9kZVR5cGV8fCErZS5ub2RlVHlwZX07ZnVuY3Rpb24gRygpe3RoaXMuZXhwYW5kbz1TLmV4cGFuZG8rRy51aWQrK31HLnVpZD0xLEcucHJvdG90eXBlPXtjYWNoZTpmdW5jdGlvbihlKXt2YXIgdD1lW3RoaXMuZXhwYW5kb107cmV0dXJuIHR8fCh0PXt9LFYoZSkmJihlLm5vZGVUeXBlP2VbdGhpcy5leHBhbmRvXT10Ok9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHRoaXMuZXhwYW5kbyx7dmFsdWU6dCxjb25maWd1cmFibGU6ITB9KSkpLHR9LHNldDpmdW5jdGlvbihlLHQsbil7dmFyIHIsaT10aGlzLmNhY2hlKGUpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0KWlbWCh0KV09bjtlbHNlIGZvcihyIGluIHQpaVtYKHIpXT10W3JdO3JldHVybiBpfSxnZXQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdm9pZCAwPT09dD90aGlzLmNhY2hlKGUpOmVbdGhpcy5leHBhbmRvXSYmZVt0aGlzLmV4cGFuZG9dW1godCldfSxhY2Nlc3M6ZnVuY3Rpb24oZSx0LG4pe3JldHVybiB2b2lkIDA9PT10fHx0JiZcInN0cmluZ1wiPT10eXBlb2YgdCYmdm9pZCAwPT09bj90aGlzLmdldChlLHQpOih0aGlzLnNldChlLHQsbiksdm9pZCAwIT09bj9uOnQpfSxyZW1vdmU6ZnVuY3Rpb24oZSx0KXt2YXIgbixyPWVbdGhpcy5leHBhbmRvXTtpZih2b2lkIDAhPT1yKXtpZih2b2lkIDAhPT10KXtuPSh0PUFycmF5LmlzQXJyYXkodCk/dC5tYXAoWCk6KHQ9WCh0KSlpbiByP1t0XTp0Lm1hdGNoKFApfHxbXSkubGVuZ3RoO3doaWxlKG4tLSlkZWxldGUgclt0W25dXX0odm9pZCAwPT09dHx8Uy5pc0VtcHR5T2JqZWN0KHIpKSYmKGUubm9kZVR5cGU/ZVt0aGlzLmV4cGFuZG9dPXZvaWQgMDpkZWxldGUgZVt0aGlzLmV4cGFuZG9dKX19LGhhc0RhdGE6ZnVuY3Rpb24oZSl7dmFyIHQ9ZVt0aGlzLmV4cGFuZG9dO3JldHVybiB2b2lkIDAhPT10JiYhUy5pc0VtcHR5T2JqZWN0KHQpfX07dmFyIFk9bmV3IEcsUT1uZXcgRyxKPS9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLyxLPS9bQS1aXS9nO2Z1bmN0aW9uIFooZSx0LG4pe3ZhciByLGk7aWYodm9pZCAwPT09biYmMT09PWUubm9kZVR5cGUpaWYocj1cImRhdGEtXCIrdC5yZXBsYWNlKEssXCItJCZcIikudG9Mb3dlckNhc2UoKSxcInN0cmluZ1wiPT10eXBlb2Yobj1lLmdldEF0dHJpYnV0ZShyKSkpe3RyeXtuPVwidHJ1ZVwiPT09KGk9bil8fFwiZmFsc2VcIiE9PWkmJihcIm51bGxcIj09PWk/bnVsbDppPT09K2krXCJcIj8raTpKLnRlc3QoaSk/SlNPTi5wYXJzZShpKTppKX1jYXRjaChlKXt9US5zZXQoZSx0LG4pfWVsc2Ugbj12b2lkIDA7cmV0dXJuIG59Uy5leHRlbmQoe2hhc0RhdGE6ZnVuY3Rpb24oZSl7cmV0dXJuIFEuaGFzRGF0YShlKXx8WS5oYXNEYXRhKGUpfSxkYXRhOmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gUS5hY2Nlc3MoZSx0LG4pfSxyZW1vdmVEYXRhOmZ1bmN0aW9uKGUsdCl7US5yZW1vdmUoZSx0KX0sX2RhdGE6ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBZLmFjY2VzcyhlLHQsbil9LF9yZW1vdmVEYXRhOmZ1bmN0aW9uKGUsdCl7WS5yZW1vdmUoZSx0KX19KSxTLmZuLmV4dGVuZCh7ZGF0YTpmdW5jdGlvbihuLGUpe3ZhciB0LHIsaSxvPXRoaXNbMF0sYT1vJiZvLmF0dHJpYnV0ZXM7aWYodm9pZCAwPT09bil7aWYodGhpcy5sZW5ndGgmJihpPVEuZ2V0KG8pLDE9PT1vLm5vZGVUeXBlJiYhWS5nZXQobyxcImhhc0RhdGFBdHRyc1wiKSkpe3Q9YS5sZW5ndGg7d2hpbGUodC0tKWFbdF0mJjA9PT0ocj1hW3RdLm5hbWUpLmluZGV4T2YoXCJkYXRhLVwiKSYmKHI9WChyLnNsaWNlKDUpKSxaKG8scixpW3JdKSk7WS5zZXQobyxcImhhc0RhdGFBdHRyc1wiLCEwKX1yZXR1cm4gaX1yZXR1cm5cIm9iamVjdFwiPT10eXBlb2Ygbj90aGlzLmVhY2goZnVuY3Rpb24oKXtRLnNldCh0aGlzLG4pfSk6JCh0aGlzLGZ1bmN0aW9uKGUpe3ZhciB0O2lmKG8mJnZvaWQgMD09PWUpcmV0dXJuIHZvaWQgMCE9PSh0PVEuZ2V0KG8sbikpP3Q6dm9pZCAwIT09KHQ9WihvLG4pKT90OnZvaWQgMDt0aGlzLmVhY2goZnVuY3Rpb24oKXtRLnNldCh0aGlzLG4sZSl9KX0sbnVsbCxlLDE8YXJndW1lbnRzLmxlbmd0aCxudWxsLCEwKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7US5yZW1vdmUodGhpcyxlKX0pfX0pLFMuZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbihlLHQsbil7dmFyIHI7aWYoZSlyZXR1cm4gdD0odHx8XCJmeFwiKStcInF1ZXVlXCIscj1ZLmdldChlLHQpLG4mJighcnx8QXJyYXkuaXNBcnJheShuKT9yPVkuYWNjZXNzKGUsdCxTLm1ha2VBcnJheShuKSk6ci5wdXNoKG4pKSxyfHxbXX0sZGVxdWV1ZTpmdW5jdGlvbihlLHQpe3Q9dHx8XCJmeFwiO3ZhciBuPVMucXVldWUoZSx0KSxyPW4ubGVuZ3RoLGk9bi5zaGlmdCgpLG89Uy5fcXVldWVIb29rcyhlLHQpO1wiaW5wcm9ncmVzc1wiPT09aSYmKGk9bi5zaGlmdCgpLHItLSksaSYmKFwiZnhcIj09PXQmJm4udW5zaGlmdChcImlucHJvZ3Jlc3NcIiksZGVsZXRlIG8uc3RvcCxpLmNhbGwoZSxmdW5jdGlvbigpe1MuZGVxdWV1ZShlLHQpfSxvKSksIXImJm8mJm8uZW1wdHkuZmlyZSgpfSxfcXVldWVIb29rczpmdW5jdGlvbihlLHQpe3ZhciBuPXQrXCJxdWV1ZUhvb2tzXCI7cmV0dXJuIFkuZ2V0KGUsbil8fFkuYWNjZXNzKGUsbix7ZW1wdHk6Uy5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKS5hZGQoZnVuY3Rpb24oKXtZLnJlbW92ZShlLFt0K1wicXVldWVcIixuXSl9KX0pfX0pLFMuZm4uZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbih0LG4pe3ZhciBlPTI7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIHQmJihuPXQsdD1cImZ4XCIsZS0tKSxhcmd1bWVudHMubGVuZ3RoPGU/Uy5xdWV1ZSh0aGlzWzBdLHQpOnZvaWQgMD09PW4/dGhpczp0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT1TLnF1ZXVlKHRoaXMsdCxuKTtTLl9xdWV1ZUhvb2tzKHRoaXMsdCksXCJmeFwiPT09dCYmXCJpbnByb2dyZXNzXCIhPT1lWzBdJiZTLmRlcXVldWUodGhpcyx0KX0pfSxkZXF1ZXVlOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtTLmRlcXVldWUodGhpcyxlKX0pfSxjbGVhclF1ZXVlOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnF1ZXVlKGV8fFwiZnhcIixbXSl9LHByb21pc2U6ZnVuY3Rpb24oZSx0KXt2YXIgbixyPTEsaT1TLkRlZmVycmVkKCksbz10aGlzLGE9dGhpcy5sZW5ndGgscz1mdW5jdGlvbigpey0tcnx8aS5yZXNvbHZlV2l0aChvLFtvXSl9O1wic3RyaW5nXCIhPXR5cGVvZiBlJiYodD1lLGU9dm9pZCAwKSxlPWV8fFwiZnhcIjt3aGlsZShhLS0pKG49WS5nZXQob1thXSxlK1wicXVldWVIb29rc1wiKSkmJm4uZW1wdHkmJihyKyssbi5lbXB0eS5hZGQocykpO3JldHVybiBzKCksaS5wcm9taXNlKHQpfX0pO3ZhciBlZT0vWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpLy5zb3VyY2UsdGU9bmV3IFJlZ0V4cChcIl4oPzooWystXSk9fCkoXCIrZWUrXCIpKFthLXolXSopJFwiLFwiaVwiKSxuZT1bXCJUb3BcIixcIlJpZ2h0XCIsXCJCb3R0b21cIixcIkxlZnRcIl0scmU9RS5kb2N1bWVudEVsZW1lbnQsaWU9ZnVuY3Rpb24oZSl7cmV0dXJuIFMuY29udGFpbnMoZS5vd25lckRvY3VtZW50LGUpfSxvZT17Y29tcG9zZWQ6ITB9O3JlLmdldFJvb3ROb2RlJiYoaWU9ZnVuY3Rpb24oZSl7cmV0dXJuIFMuY29udGFpbnMoZS5vd25lckRvY3VtZW50LGUpfHxlLmdldFJvb3ROb2RlKG9lKT09PWUub3duZXJEb2N1bWVudH0pO3ZhciBhZT1mdW5jdGlvbihlLHQpe3JldHVyblwibm9uZVwiPT09KGU9dHx8ZSkuc3R5bGUuZGlzcGxheXx8XCJcIj09PWUuc3R5bGUuZGlzcGxheSYmaWUoZSkmJlwibm9uZVwiPT09Uy5jc3MoZSxcImRpc3BsYXlcIil9O2Z1bmN0aW9uIHNlKGUsdCxuLHIpe3ZhciBpLG8sYT0yMCxzPXI/ZnVuY3Rpb24oKXtyZXR1cm4gci5jdXIoKX06ZnVuY3Rpb24oKXtyZXR1cm4gUy5jc3MoZSx0LFwiXCIpfSx1PXMoKSxsPW4mJm5bM118fChTLmNzc051bWJlclt0XT9cIlwiOlwicHhcIiksYz1lLm5vZGVUeXBlJiYoUy5jc3NOdW1iZXJbdF18fFwicHhcIiE9PWwmJit1KSYmdGUuZXhlYyhTLmNzcyhlLHQpKTtpZihjJiZjWzNdIT09bCl7dS89MixsPWx8fGNbM10sYz0rdXx8MTt3aGlsZShhLS0pUy5zdHlsZShlLHQsYytsKSwoMS1vKSooMS0obz1zKCkvdXx8LjUpKTw9MCYmKGE9MCksYy89bztjKj0yLFMuc3R5bGUoZSx0LGMrbCksbj1ufHxbXX1yZXR1cm4gbiYmKGM9K2N8fCt1fHwwLGk9blsxXT9jKyhuWzFdKzEpKm5bMl06K25bMl0sciYmKHIudW5pdD1sLHIuc3RhcnQ9YyxyLmVuZD1pKSksaX12YXIgdWU9e307ZnVuY3Rpb24gbGUoZSx0KXtmb3IodmFyIG4scixpLG8sYSxzLHUsbD1bXSxjPTAsZj1lLmxlbmd0aDtjPGY7YysrKShyPWVbY10pLnN0eWxlJiYobj1yLnN0eWxlLmRpc3BsYXksdD8oXCJub25lXCI9PT1uJiYobFtjXT1ZLmdldChyLFwiZGlzcGxheVwiKXx8bnVsbCxsW2NdfHwoci5zdHlsZS5kaXNwbGF5PVwiXCIpKSxcIlwiPT09ci5zdHlsZS5kaXNwbGF5JiZhZShyKSYmKGxbY109KHU9YT1vPXZvaWQgMCxhPShpPXIpLm93bmVyRG9jdW1lbnQscz1pLm5vZGVOYW1lLCh1PXVlW3NdKXx8KG89YS5ib2R5LmFwcGVuZENoaWxkKGEuY3JlYXRlRWxlbWVudChzKSksdT1TLmNzcyhvLFwiZGlzcGxheVwiKSxvLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobyksXCJub25lXCI9PT11JiYodT1cImJsb2NrXCIpLHVlW3NdPXUpKSkpOlwibm9uZVwiIT09biYmKGxbY109XCJub25lXCIsWS5zZXQocixcImRpc3BsYXlcIixuKSkpO2ZvcihjPTA7YzxmO2MrKyludWxsIT1sW2NdJiYoZVtjXS5zdHlsZS5kaXNwbGF5PWxbY10pO3JldHVybiBlfVMuZm4uZXh0ZW5kKHtzaG93OmZ1bmN0aW9uKCl7cmV0dXJuIGxlKHRoaXMsITApfSxoaWRlOmZ1bmN0aW9uKCl7cmV0dXJuIGxlKHRoaXMpfSx0b2dnbGU6ZnVuY3Rpb24oZSl7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBlP2U/dGhpcy5zaG93KCk6dGhpcy5oaWRlKCk6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7YWUodGhpcyk/Uyh0aGlzKS5zaG93KCk6Uyh0aGlzKS5oaWRlKCl9KX19KTt2YXIgY2UsZmUscGU9L14oPzpjaGVja2JveHxyYWRpbykkL2ksZGU9LzwoW2Etel1bXlxcL1xcMD5cXHgyMFxcdFxcclxcblxcZl0qKS9pLGhlPS9eJHxebW9kdWxlJHxcXC8oPzpqYXZhfGVjbWEpc2NyaXB0L2k7Y2U9RS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkuYXBwZW5kQ2hpbGQoRS5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSwoZmU9RS5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpLnNldEF0dHJpYnV0ZShcInR5cGVcIixcInJhZGlvXCIpLGZlLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIixcImNoZWNrZWRcIiksZmUuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwidFwiKSxjZS5hcHBlbmRDaGlsZChmZSkseS5jaGVja0Nsb25lPWNlLmNsb25lTm9kZSghMCkuY2xvbmVOb2RlKCEwKS5sYXN0Q2hpbGQuY2hlY2tlZCxjZS5pbm5lckhUTUw9XCI8dGV4dGFyZWE+eDwvdGV4dGFyZWE+XCIseS5ub0Nsb25lQ2hlY2tlZD0hIWNlLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmRlZmF1bHRWYWx1ZSxjZS5pbm5lckhUTUw9XCI8b3B0aW9uPjwvb3B0aW9uPlwiLHkub3B0aW9uPSEhY2UubGFzdENoaWxkO3ZhciBnZT17dGhlYWQ6WzEsXCI8dGFibGU+XCIsXCI8L3RhYmxlPlwiXSxjb2w6WzIsXCI8dGFibGU+PGNvbGdyb3VwPlwiLFwiPC9jb2xncm91cD48L3RhYmxlPlwiXSx0cjpbMixcIjx0YWJsZT48dGJvZHk+XCIsXCI8L3Rib2R5PjwvdGFibGU+XCJdLHRkOlszLFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0sX2RlZmF1bHQ6WzAsXCJcIixcIlwiXX07ZnVuY3Rpb24gdmUoZSx0KXt2YXIgbjtyZXR1cm4gbj1cInVuZGVmaW5lZFwiIT10eXBlb2YgZS5nZXRFbGVtZW50c0J5VGFnTmFtZT9lLmdldEVsZW1lbnRzQnlUYWdOYW1lKHR8fFwiKlwiKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgZS5xdWVyeVNlbGVjdG9yQWxsP2UucXVlcnlTZWxlY3RvckFsbCh0fHxcIipcIik6W10sdm9pZCAwPT09dHx8dCYmQShlLHQpP1MubWVyZ2UoW2VdLG4pOm59ZnVuY3Rpb24geWUoZSx0KXtmb3IodmFyIG49MCxyPWUubGVuZ3RoO248cjtuKyspWS5zZXQoZVtuXSxcImdsb2JhbEV2YWxcIiwhdHx8WS5nZXQodFtuXSxcImdsb2JhbEV2YWxcIikpfWdlLnRib2R5PWdlLnRmb290PWdlLmNvbGdyb3VwPWdlLmNhcHRpb249Z2UudGhlYWQsZ2UudGg9Z2UudGQseS5vcHRpb258fChnZS5vcHRncm91cD1nZS5vcHRpb249WzEsXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsXCI8L3NlbGVjdD5cIl0pO3ZhciBtZT0vPHwmIz9cXHcrOy87ZnVuY3Rpb24geGUoZSx0LG4scixpKXtmb3IodmFyIG8sYSxzLHUsbCxjLGY9dC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkscD1bXSxkPTAsaD1lLmxlbmd0aDtkPGg7ZCsrKWlmKChvPWVbZF0pfHwwPT09bylpZihcIm9iamVjdFwiPT09dyhvKSlTLm1lcmdlKHAsby5ub2RlVHlwZT9bb106byk7ZWxzZSBpZihtZS50ZXN0KG8pKXthPWF8fGYuYXBwZW5kQ2hpbGQodC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxzPShkZS5leGVjKG8pfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKSx1PWdlW3NdfHxnZS5fZGVmYXVsdCxhLmlubmVySFRNTD11WzFdK1MuaHRtbFByZWZpbHRlcihvKSt1WzJdLGM9dVswXTt3aGlsZShjLS0pYT1hLmxhc3RDaGlsZDtTLm1lcmdlKHAsYS5jaGlsZE5vZGVzKSwoYT1mLmZpcnN0Q2hpbGQpLnRleHRDb250ZW50PVwiXCJ9ZWxzZSBwLnB1c2godC5jcmVhdGVUZXh0Tm9kZShvKSk7Zi50ZXh0Q29udGVudD1cIlwiLGQ9MDt3aGlsZShvPXBbZCsrXSlpZihyJiYtMTxTLmluQXJyYXkobyxyKSlpJiZpLnB1c2gobyk7ZWxzZSBpZihsPWllKG8pLGE9dmUoZi5hcHBlbmRDaGlsZChvKSxcInNjcmlwdFwiKSxsJiZ5ZShhKSxuKXtjPTA7d2hpbGUobz1hW2MrK10paGUudGVzdChvLnR5cGV8fFwiXCIpJiZuLnB1c2gobyl9cmV0dXJuIGZ9dmFyIGJlPS9eKFteLl0qKSg/OlxcLiguKyl8KS87ZnVuY3Rpb24gd2UoKXtyZXR1cm4hMH1mdW5jdGlvbiBUZSgpe3JldHVybiExfWZ1bmN0aW9uIENlKGUsdCl7cmV0dXJuIGU9PT1mdW5jdGlvbigpe3RyeXtyZXR1cm4gRS5hY3RpdmVFbGVtZW50fWNhdGNoKGUpe319KCk9PShcImZvY3VzXCI9PT10KX1mdW5jdGlvbiBFZShlLHQsbixyLGksbyl7dmFyIGEscztpZihcIm9iamVjdFwiPT10eXBlb2YgdCl7Zm9yKHMgaW5cInN0cmluZ1wiIT10eXBlb2YgbiYmKHI9cnx8bixuPXZvaWQgMCksdClFZShlLHMsbixyLHRbc10sbyk7cmV0dXJuIGV9aWYobnVsbD09ciYmbnVsbD09aT8oaT1uLHI9bj12b2lkIDApOm51bGw9PWkmJihcInN0cmluZ1wiPT10eXBlb2Ygbj8oaT1yLHI9dm9pZCAwKTooaT1yLHI9bixuPXZvaWQgMCkpLCExPT09aSlpPVRlO2Vsc2UgaWYoIWkpcmV0dXJuIGU7cmV0dXJuIDE9PT1vJiYoYT1pLChpPWZ1bmN0aW9uKGUpe3JldHVybiBTKCkub2ZmKGUpLGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfSkuZ3VpZD1hLmd1aWR8fChhLmd1aWQ9Uy5ndWlkKyspKSxlLmVhY2goZnVuY3Rpb24oKXtTLmV2ZW50LmFkZCh0aGlzLHQsaSxyLG4pfSl9ZnVuY3Rpb24gU2UoZSxpLG8pe28/KFkuc2V0KGUsaSwhMSksUy5ldmVudC5hZGQoZSxpLHtuYW1lc3BhY2U6ITEsaGFuZGxlcjpmdW5jdGlvbihlKXt2YXIgdCxuLHI9WS5nZXQodGhpcyxpKTtpZigxJmUuaXNUcmlnZ2VyJiZ0aGlzW2ldKXtpZihyLmxlbmd0aCkoUy5ldmVudC5zcGVjaWFsW2ldfHx7fSkuZGVsZWdhdGVUeXBlJiZlLnN0b3BQcm9wYWdhdGlvbigpO2Vsc2UgaWYocj1zLmNhbGwoYXJndW1lbnRzKSxZLnNldCh0aGlzLGksciksdD1vKHRoaXMsaSksdGhpc1tpXSgpLHIhPT0obj1ZLmdldCh0aGlzLGkpKXx8dD9ZLnNldCh0aGlzLGksITEpOm49e30sciE9PW4pcmV0dXJuIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksZS5wcmV2ZW50RGVmYXVsdCgpLG4mJm4udmFsdWV9ZWxzZSByLmxlbmd0aCYmKFkuc2V0KHRoaXMsaSx7dmFsdWU6Uy5ldmVudC50cmlnZ2VyKFMuZXh0ZW5kKHJbMF0sUy5FdmVudC5wcm90b3R5cGUpLHIuc2xpY2UoMSksdGhpcyl9KSxlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpKX19KSk6dm9pZCAwPT09WS5nZXQoZSxpKSYmUy5ldmVudC5hZGQoZSxpLHdlKX1TLmV2ZW50PXtnbG9iYWw6e30sYWRkOmZ1bmN0aW9uKHQsZSxuLHIsaSl7dmFyIG8sYSxzLHUsbCxjLGYscCxkLGgsZyx2PVkuZ2V0KHQpO2lmKFYodCkpe24uaGFuZGxlciYmKG49KG89bikuaGFuZGxlcixpPW8uc2VsZWN0b3IpLGkmJlMuZmluZC5tYXRjaGVzU2VsZWN0b3IocmUsaSksbi5ndWlkfHwobi5ndWlkPVMuZ3VpZCsrKSwodT12LmV2ZW50cyl8fCh1PXYuZXZlbnRzPU9iamVjdC5jcmVhdGUobnVsbCkpLChhPXYuaGFuZGxlKXx8KGE9di5oYW5kbGU9ZnVuY3Rpb24oZSl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFMmJlMuZXZlbnQudHJpZ2dlcmVkIT09ZS50eXBlP1MuZXZlbnQuZGlzcGF0Y2guYXBwbHkodCxhcmd1bWVudHMpOnZvaWQgMH0pLGw9KGU9KGV8fFwiXCIpLm1hdGNoKFApfHxbXCJcIl0pLmxlbmd0aDt3aGlsZShsLS0pZD1nPShzPWJlLmV4ZWMoZVtsXSl8fFtdKVsxXSxoPShzWzJdfHxcIlwiKS5zcGxpdChcIi5cIikuc29ydCgpLGQmJihmPVMuZXZlbnQuc3BlY2lhbFtkXXx8e30sZD0oaT9mLmRlbGVnYXRlVHlwZTpmLmJpbmRUeXBlKXx8ZCxmPVMuZXZlbnQuc3BlY2lhbFtkXXx8e30sYz1TLmV4dGVuZCh7dHlwZTpkLG9yaWdUeXBlOmcsZGF0YTpyLGhhbmRsZXI6bixndWlkOm4uZ3VpZCxzZWxlY3RvcjppLG5lZWRzQ29udGV4dDppJiZTLmV4cHIubWF0Y2gubmVlZHNDb250ZXh0LnRlc3QoaSksbmFtZXNwYWNlOmguam9pbihcIi5cIil9LG8pLChwPXVbZF0pfHwoKHA9dVtkXT1bXSkuZGVsZWdhdGVDb3VudD0wLGYuc2V0dXAmJiExIT09Zi5zZXR1cC5jYWxsKHQscixoLGEpfHx0LmFkZEV2ZW50TGlzdGVuZXImJnQuYWRkRXZlbnRMaXN0ZW5lcihkLGEpKSxmLmFkZCYmKGYuYWRkLmNhbGwodCxjKSxjLmhhbmRsZXIuZ3VpZHx8KGMuaGFuZGxlci5ndWlkPW4uZ3VpZCkpLGk/cC5zcGxpY2UocC5kZWxlZ2F0ZUNvdW50KyssMCxjKTpwLnB1c2goYyksUy5ldmVudC5nbG9iYWxbZF09ITApfX0scmVtb3ZlOmZ1bmN0aW9uKGUsdCxuLHIsaSl7dmFyIG8sYSxzLHUsbCxjLGYscCxkLGgsZyx2PVkuaGFzRGF0YShlKSYmWS5nZXQoZSk7aWYodiYmKHU9di5ldmVudHMpKXtsPSh0PSh0fHxcIlwiKS5tYXRjaChQKXx8W1wiXCJdKS5sZW5ndGg7d2hpbGUobC0tKWlmKGQ9Zz0ocz1iZS5leGVjKHRbbF0pfHxbXSlbMV0saD0oc1syXXx8XCJcIikuc3BsaXQoXCIuXCIpLnNvcnQoKSxkKXtmPVMuZXZlbnQuc3BlY2lhbFtkXXx8e30scD11W2Q9KHI/Zi5kZWxlZ2F0ZVR5cGU6Zi5iaW5kVHlwZSl8fGRdfHxbXSxzPXNbMl0mJm5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIitoLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKStcIihcXFxcLnwkKVwiKSxhPW89cC5sZW5ndGg7d2hpbGUoby0tKWM9cFtvXSwhaSYmZyE9PWMub3JpZ1R5cGV8fG4mJm4uZ3VpZCE9PWMuZ3VpZHx8cyYmIXMudGVzdChjLm5hbWVzcGFjZSl8fHImJnIhPT1jLnNlbGVjdG9yJiYoXCIqKlwiIT09cnx8IWMuc2VsZWN0b3IpfHwocC5zcGxpY2UobywxKSxjLnNlbGVjdG9yJiZwLmRlbGVnYXRlQ291bnQtLSxmLnJlbW92ZSYmZi5yZW1vdmUuY2FsbChlLGMpKTthJiYhcC5sZW5ndGgmJihmLnRlYXJkb3duJiYhMSE9PWYudGVhcmRvd24uY2FsbChlLGgsdi5oYW5kbGUpfHxTLnJlbW92ZUV2ZW50KGUsZCx2LmhhbmRsZSksZGVsZXRlIHVbZF0pfWVsc2UgZm9yKGQgaW4gdSlTLmV2ZW50LnJlbW92ZShlLGQrdFtsXSxuLHIsITApO1MuaXNFbXB0eU9iamVjdCh1KSYmWS5yZW1vdmUoZSxcImhhbmRsZSBldmVudHNcIil9fSxkaXNwYXRjaDpmdW5jdGlvbihlKXt2YXIgdCxuLHIsaSxvLGEscz1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCksdT1TLmV2ZW50LmZpeChlKSxsPShZLmdldCh0aGlzLFwiZXZlbnRzXCIpfHxPYmplY3QuY3JlYXRlKG51bGwpKVt1LnR5cGVdfHxbXSxjPVMuZXZlbnQuc3BlY2lhbFt1LnR5cGVdfHx7fTtmb3Ioc1swXT11LHQ9MTt0PGFyZ3VtZW50cy5sZW5ndGg7dCsrKXNbdF09YXJndW1lbnRzW3RdO2lmKHUuZGVsZWdhdGVUYXJnZXQ9dGhpcywhYy5wcmVEaXNwYXRjaHx8ITEhPT1jLnByZURpc3BhdGNoLmNhbGwodGhpcyx1KSl7YT1TLmV2ZW50LmhhbmRsZXJzLmNhbGwodGhpcyx1LGwpLHQ9MDt3aGlsZSgoaT1hW3QrK10pJiYhdS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKXt1LmN1cnJlbnRUYXJnZXQ9aS5lbGVtLG49MDt3aGlsZSgobz1pLmhhbmRsZXJzW24rK10pJiYhdS5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpKXUucm5hbWVzcGFjZSYmITEhPT1vLm5hbWVzcGFjZSYmIXUucm5hbWVzcGFjZS50ZXN0KG8ubmFtZXNwYWNlKXx8KHUuaGFuZGxlT2JqPW8sdS5kYXRhPW8uZGF0YSx2b2lkIDAhPT0ocj0oKFMuZXZlbnQuc3BlY2lhbFtvLm9yaWdUeXBlXXx8e30pLmhhbmRsZXx8by5oYW5kbGVyKS5hcHBseShpLmVsZW0scykpJiYhMT09PSh1LnJlc3VsdD1yKSYmKHUucHJldmVudERlZmF1bHQoKSx1LnN0b3BQcm9wYWdhdGlvbigpKSl9cmV0dXJuIGMucG9zdERpc3BhdGNoJiZjLnBvc3REaXNwYXRjaC5jYWxsKHRoaXMsdSksdS5yZXN1bHR9fSxoYW5kbGVyczpmdW5jdGlvbihlLHQpe3ZhciBuLHIsaSxvLGEscz1bXSx1PXQuZGVsZWdhdGVDb3VudCxsPWUudGFyZ2V0O2lmKHUmJmwubm9kZVR5cGUmJiEoXCJjbGlja1wiPT09ZS50eXBlJiYxPD1lLmJ1dHRvbikpZm9yKDtsIT09dGhpcztsPWwucGFyZW50Tm9kZXx8dGhpcylpZigxPT09bC5ub2RlVHlwZSYmKFwiY2xpY2tcIiE9PWUudHlwZXx8ITAhPT1sLmRpc2FibGVkKSl7Zm9yKG89W10sYT17fSxuPTA7bjx1O24rKyl2b2lkIDA9PT1hW2k9KHI9dFtuXSkuc2VsZWN0b3IrXCIgXCJdJiYoYVtpXT1yLm5lZWRzQ29udGV4dD8tMTxTKGksdGhpcykuaW5kZXgobCk6Uy5maW5kKGksdGhpcyxudWxsLFtsXSkubGVuZ3RoKSxhW2ldJiZvLnB1c2gocik7by5sZW5ndGgmJnMucHVzaCh7ZWxlbTpsLGhhbmRsZXJzOm99KX1yZXR1cm4gbD10aGlzLHU8dC5sZW5ndGgmJnMucHVzaCh7ZWxlbTpsLGhhbmRsZXJzOnQuc2xpY2UodSl9KSxzfSxhZGRQcm9wOmZ1bmN0aW9uKHQsZSl7T2JqZWN0LmRlZmluZVByb3BlcnR5KFMuRXZlbnQucHJvdG90eXBlLHQse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLGdldDptKGUpP2Z1bmN0aW9uKCl7aWYodGhpcy5vcmlnaW5hbEV2ZW50KXJldHVybiBlKHRoaXMub3JpZ2luYWxFdmVudCl9OmZ1bmN0aW9uKCl7aWYodGhpcy5vcmlnaW5hbEV2ZW50KXJldHVybiB0aGlzLm9yaWdpbmFsRXZlbnRbdF19LHNldDpmdW5jdGlvbihlKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyx0LHtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMCx2YWx1ZTplfSl9fSl9LGZpeDpmdW5jdGlvbihlKXtyZXR1cm4gZVtTLmV4cGFuZG9dP2U6bmV3IFMuRXZlbnQoZSl9LHNwZWNpYWw6e2xvYWQ6e25vQnViYmxlOiEwfSxjbGljazp7c2V0dXA6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpc3x8ZTtyZXR1cm4gcGUudGVzdCh0LnR5cGUpJiZ0LmNsaWNrJiZBKHQsXCJpbnB1dFwiKSYmU2UodCxcImNsaWNrXCIsd2UpLCExfSx0cmlnZ2VyOmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXN8fGU7cmV0dXJuIHBlLnRlc3QodC50eXBlKSYmdC5jbGljayYmQSh0LFwiaW5wdXRcIikmJlNlKHQsXCJjbGlja1wiKSwhMH0sX2RlZmF1bHQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS50YXJnZXQ7cmV0dXJuIHBlLnRlc3QodC50eXBlKSYmdC5jbGljayYmQSh0LFwiaW5wdXRcIikmJlkuZ2V0KHQsXCJjbGlja1wiKXx8QSh0LFwiYVwiKX19LGJlZm9yZXVubG9hZDp7cG9zdERpc3BhdGNoOmZ1bmN0aW9uKGUpe3ZvaWQgMCE9PWUucmVzdWx0JiZlLm9yaWdpbmFsRXZlbnQmJihlLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWU9ZS5yZXN1bHQpfX19fSxTLnJlbW92ZUV2ZW50PWZ1bmN0aW9uKGUsdCxuKXtlLnJlbW92ZUV2ZW50TGlzdGVuZXImJmUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4pfSxTLkV2ZW50PWZ1bmN0aW9uKGUsdCl7aWYoISh0aGlzIGluc3RhbmNlb2YgUy5FdmVudCkpcmV0dXJuIG5ldyBTLkV2ZW50KGUsdCk7ZSYmZS50eXBlPyh0aGlzLm9yaWdpbmFsRXZlbnQ9ZSx0aGlzLnR5cGU9ZS50eXBlLHRoaXMuaXNEZWZhdWx0UHJldmVudGVkPWUuZGVmYXVsdFByZXZlbnRlZHx8dm9pZCAwPT09ZS5kZWZhdWx0UHJldmVudGVkJiYhMT09PWUucmV0dXJuVmFsdWU/d2U6VGUsdGhpcy50YXJnZXQ9ZS50YXJnZXQmJjM9PT1lLnRhcmdldC5ub2RlVHlwZT9lLnRhcmdldC5wYXJlbnROb2RlOmUudGFyZ2V0LHRoaXMuY3VycmVudFRhcmdldD1lLmN1cnJlbnRUYXJnZXQsdGhpcy5yZWxhdGVkVGFyZ2V0PWUucmVsYXRlZFRhcmdldCk6dGhpcy50eXBlPWUsdCYmUy5leHRlbmQodGhpcyx0KSx0aGlzLnRpbWVTdGFtcD1lJiZlLnRpbWVTdGFtcHx8RGF0ZS5ub3coKSx0aGlzW1MuZXhwYW5kb109ITB9LFMuRXZlbnQucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpTLkV2ZW50LGlzRGVmYXVsdFByZXZlbnRlZDpUZSxpc1Byb3BhZ2F0aW9uU3RvcHBlZDpUZSxpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDpUZSxpc1NpbXVsYXRlZDohMSxwcmV2ZW50RGVmYXVsdDpmdW5jdGlvbigpe3ZhciBlPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD13ZSxlJiYhdGhpcy5pc1NpbXVsYXRlZCYmZS5wcmV2ZW50RGVmYXVsdCgpfSxzdG9wUHJvcGFnYXRpb246ZnVuY3Rpb24oKXt2YXIgZT10aGlzLm9yaWdpbmFsRXZlbnQ7dGhpcy5pc1Byb3BhZ2F0aW9uU3RvcHBlZD13ZSxlJiYhdGhpcy5pc1NpbXVsYXRlZCYmZS5zdG9wUHJvcGFnYXRpb24oKX0sc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ9d2UsZSYmIXRoaXMuaXNTaW11bGF0ZWQmJmUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksdGhpcy5zdG9wUHJvcGFnYXRpb24oKX19LFMuZWFjaCh7YWx0S2V5OiEwLGJ1YmJsZXM6ITAsY2FuY2VsYWJsZTohMCxjaGFuZ2VkVG91Y2hlczohMCxjdHJsS2V5OiEwLGRldGFpbDohMCxldmVudFBoYXNlOiEwLG1ldGFLZXk6ITAscGFnZVg6ITAscGFnZVk6ITAsc2hpZnRLZXk6ITAsdmlldzohMCxcImNoYXJcIjohMCxjb2RlOiEwLGNoYXJDb2RlOiEwLGtleTohMCxrZXlDb2RlOiEwLGJ1dHRvbjohMCxidXR0b25zOiEwLGNsaWVudFg6ITAsY2xpZW50WTohMCxvZmZzZXRYOiEwLG9mZnNldFk6ITAscG9pbnRlcklkOiEwLHBvaW50ZXJUeXBlOiEwLHNjcmVlblg6ITAsc2NyZWVuWTohMCx0YXJnZXRUb3VjaGVzOiEwLHRvRWxlbWVudDohMCx0b3VjaGVzOiEwLHdoaWNoOiEwfSxTLmV2ZW50LmFkZFByb3ApLFMuZWFjaCh7Zm9jdXM6XCJmb2N1c2luXCIsYmx1cjpcImZvY3Vzb3V0XCJ9LGZ1bmN0aW9uKGUsdCl7Uy5ldmVudC5zcGVjaWFsW2VdPXtzZXR1cDpmdW5jdGlvbigpe3JldHVybiBTZSh0aGlzLGUsQ2UpLCExfSx0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuIFNlKHRoaXMsZSksITB9LF9kZWZhdWx0OmZ1bmN0aW9uKCl7cmV0dXJuITB9LGRlbGVnYXRlVHlwZTp0fX0pLFMuZWFjaCh7bW91c2VlbnRlcjpcIm1vdXNlb3ZlclwiLG1vdXNlbGVhdmU6XCJtb3VzZW91dFwiLHBvaW50ZXJlbnRlcjpcInBvaW50ZXJvdmVyXCIscG9pbnRlcmxlYXZlOlwicG9pbnRlcm91dFwifSxmdW5jdGlvbihlLGkpe1MuZXZlbnQuc3BlY2lhbFtlXT17ZGVsZWdhdGVUeXBlOmksYmluZFR5cGU6aSxoYW5kbGU6ZnVuY3Rpb24oZSl7dmFyIHQsbj1lLnJlbGF0ZWRUYXJnZXQscj1lLmhhbmRsZU9iajtyZXR1cm4gbiYmKG49PT10aGlzfHxTLmNvbnRhaW5zKHRoaXMsbikpfHwoZS50eXBlPXIub3JpZ1R5cGUsdD1yLmhhbmRsZXIuYXBwbHkodGhpcyxhcmd1bWVudHMpLGUudHlwZT1pKSx0fX19KSxTLmZuLmV4dGVuZCh7b246ZnVuY3Rpb24oZSx0LG4scil7cmV0dXJuIEVlKHRoaXMsZSx0LG4scil9LG9uZTpmdW5jdGlvbihlLHQsbixyKXtyZXR1cm4gRWUodGhpcyxlLHQsbixyLDEpfSxvZmY6ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGk7aWYoZSYmZS5wcmV2ZW50RGVmYXVsdCYmZS5oYW5kbGVPYmopcmV0dXJuIHI9ZS5oYW5kbGVPYmosUyhlLmRlbGVnYXRlVGFyZ2V0KS5vZmYoci5uYW1lc3BhY2U/ci5vcmlnVHlwZStcIi5cIityLm5hbWVzcGFjZTpyLm9yaWdUeXBlLHIuc2VsZWN0b3Isci5oYW5kbGVyKSx0aGlzO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBlKXtmb3IoaSBpbiBlKXRoaXMub2ZmKGksdCxlW2ldKTtyZXR1cm4gdGhpc31yZXR1cm4hMSE9PXQmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHR8fChuPXQsdD12b2lkIDApLCExPT09biYmKG49VGUpLHRoaXMuZWFjaChmdW5jdGlvbigpe1MuZXZlbnQucmVtb3ZlKHRoaXMsZSxuLHQpfSl9fSk7dmFyIGtlPS88c2NyaXB0fDxzdHlsZXw8bGluay9pLEFlPS9jaGVja2VkXFxzKig/OltePV18PVxccyouY2hlY2tlZC4pL2ksTmU9L15cXHMqPCEoPzpcXFtDREFUQVxcW3wtLSl8KD86XFxdXFxdfC0tKT5cXHMqJC9nO2Z1bmN0aW9uIGplKGUsdCl7cmV0dXJuIEEoZSxcInRhYmxlXCIpJiZBKDExIT09dC5ub2RlVHlwZT90OnQuZmlyc3RDaGlsZCxcInRyXCIpJiZTKGUpLmNoaWxkcmVuKFwidGJvZHlcIilbMF18fGV9ZnVuY3Rpb24gRGUoZSl7cmV0dXJuIGUudHlwZT0obnVsbCE9PWUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSkrXCIvXCIrZS50eXBlLGV9ZnVuY3Rpb24gcWUoZSl7cmV0dXJuXCJ0cnVlL1wiPT09KGUudHlwZXx8XCJcIikuc2xpY2UoMCw1KT9lLnR5cGU9ZS50eXBlLnNsaWNlKDUpOmUucmVtb3ZlQXR0cmlidXRlKFwidHlwZVwiKSxlfWZ1bmN0aW9uIExlKGUsdCl7dmFyIG4scixpLG8sYSxzO2lmKDE9PT10Lm5vZGVUeXBlKXtpZihZLmhhc0RhdGEoZSkmJihzPVkuZ2V0KGUpLmV2ZW50cykpZm9yKGkgaW4gWS5yZW1vdmUodCxcImhhbmRsZSBldmVudHNcIikscylmb3Iobj0wLHI9c1tpXS5sZW5ndGg7bjxyO24rKylTLmV2ZW50LmFkZCh0LGksc1tpXVtuXSk7US5oYXNEYXRhKGUpJiYobz1RLmFjY2VzcyhlKSxhPVMuZXh0ZW5kKHt9LG8pLFEuc2V0KHQsYSkpfX1mdW5jdGlvbiBIZShuLHIsaSxvKXtyPWcocik7dmFyIGUsdCxhLHMsdSxsLGM9MCxmPW4ubGVuZ3RoLHA9Zi0xLGQ9clswXSxoPW0oZCk7aWYoaHx8MTxmJiZcInN0cmluZ1wiPT10eXBlb2YgZCYmIXkuY2hlY2tDbG9uZSYmQWUudGVzdChkKSlyZXR1cm4gbi5lYWNoKGZ1bmN0aW9uKGUpe3ZhciB0PW4uZXEoZSk7aCYmKHJbMF09ZC5jYWxsKHRoaXMsZSx0Lmh0bWwoKSkpLEhlKHQscixpLG8pfSk7aWYoZiYmKHQ9KGU9eGUocixuWzBdLm93bmVyRG9jdW1lbnQsITEsbixvKSkuZmlyc3RDaGlsZCwxPT09ZS5jaGlsZE5vZGVzLmxlbmd0aCYmKGU9dCksdHx8bykpe2ZvcihzPShhPVMubWFwKHZlKGUsXCJzY3JpcHRcIiksRGUpKS5sZW5ndGg7YzxmO2MrKyl1PWUsYyE9PXAmJih1PVMuY2xvbmUodSwhMCwhMCkscyYmUy5tZXJnZShhLHZlKHUsXCJzY3JpcHRcIikpKSxpLmNhbGwobltjXSx1LGMpO2lmKHMpZm9yKGw9YVthLmxlbmd0aC0xXS5vd25lckRvY3VtZW50LFMubWFwKGEscWUpLGM9MDtjPHM7YysrKXU9YVtjXSxoZS50ZXN0KHUudHlwZXx8XCJcIikmJiFZLmFjY2Vzcyh1LFwiZ2xvYmFsRXZhbFwiKSYmUy5jb250YWlucyhsLHUpJiYodS5zcmMmJlwibW9kdWxlXCIhPT0odS50eXBlfHxcIlwiKS50b0xvd2VyQ2FzZSgpP1MuX2V2YWxVcmwmJiF1Lm5vTW9kdWxlJiZTLl9ldmFsVXJsKHUuc3JjLHtub25jZTp1Lm5vbmNlfHx1LmdldEF0dHJpYnV0ZShcIm5vbmNlXCIpfSxsKTpiKHUudGV4dENvbnRlbnQucmVwbGFjZShOZSxcIlwiKSx1LGwpKX1yZXR1cm4gbn1mdW5jdGlvbiBPZShlLHQsbil7Zm9yKHZhciByLGk9dD9TLmZpbHRlcih0LGUpOmUsbz0wO251bGwhPShyPWlbb10pO28rKylufHwxIT09ci5ub2RlVHlwZXx8Uy5jbGVhbkRhdGEodmUocikpLHIucGFyZW50Tm9kZSYmKG4mJmllKHIpJiZ5ZSh2ZShyLFwic2NyaXB0XCIpKSxyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocikpO3JldHVybiBlfVMuZXh0ZW5kKHtodG1sUHJlZmlsdGVyOmZ1bmN0aW9uKGUpe3JldHVybiBlfSxjbG9uZTpmdW5jdGlvbihlLHQsbil7dmFyIHIsaSxvLGEscyx1LGwsYz1lLmNsb25lTm9kZSghMCksZj1pZShlKTtpZighKHkubm9DbG9uZUNoZWNrZWR8fDEhPT1lLm5vZGVUeXBlJiYxMSE9PWUubm9kZVR5cGV8fFMuaXNYTUxEb2MoZSkpKWZvcihhPXZlKGMpLHI9MCxpPShvPXZlKGUpKS5sZW5ndGg7cjxpO3IrKylzPW9bcl0sdT1hW3JdLHZvaWQgMCxcImlucHV0XCI9PT0obD11Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpJiZwZS50ZXN0KHMudHlwZSk/dS5jaGVja2VkPXMuY2hlY2tlZDpcImlucHV0XCIhPT1sJiZcInRleHRhcmVhXCIhPT1sfHwodS5kZWZhdWx0VmFsdWU9cy5kZWZhdWx0VmFsdWUpO2lmKHQpaWYobilmb3Iobz1vfHx2ZShlKSxhPWF8fHZlKGMpLHI9MCxpPW8ubGVuZ3RoO3I8aTtyKyspTGUob1tyXSxhW3JdKTtlbHNlIExlKGUsYyk7cmV0dXJuIDA8KGE9dmUoYyxcInNjcmlwdFwiKSkubGVuZ3RoJiZ5ZShhLCFmJiZ2ZShlLFwic2NyaXB0XCIpKSxjfSxjbGVhbkRhdGE6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0LG4scixpPVMuZXZlbnQuc3BlY2lhbCxvPTA7dm9pZCAwIT09KG49ZVtvXSk7bysrKWlmKFYobikpe2lmKHQ9bltZLmV4cGFuZG9dKXtpZih0LmV2ZW50cylmb3IociBpbiB0LmV2ZW50cylpW3JdP1MuZXZlbnQucmVtb3ZlKG4scik6Uy5yZW1vdmVFdmVudChuLHIsdC5oYW5kbGUpO25bWS5leHBhbmRvXT12b2lkIDB9bltRLmV4cGFuZG9dJiYobltRLmV4cGFuZG9dPXZvaWQgMCl9fX0pLFMuZm4uZXh0ZW5kKHtkZXRhY2g6ZnVuY3Rpb24oZSl7cmV0dXJuIE9lKHRoaXMsZSwhMCl9LHJlbW92ZTpmdW5jdGlvbihlKXtyZXR1cm4gT2UodGhpcyxlKX0sdGV4dDpmdW5jdGlvbihlKXtyZXR1cm4gJCh0aGlzLGZ1bmN0aW9uKGUpe3JldHVybiB2b2lkIDA9PT1lP1MudGV4dCh0aGlzKTp0aGlzLmVtcHR5KCkuZWFjaChmdW5jdGlvbigpezEhPT10aGlzLm5vZGVUeXBlJiYxMSE9PXRoaXMubm9kZVR5cGUmJjkhPT10aGlzLm5vZGVUeXBlfHwodGhpcy50ZXh0Q29udGVudD1lKX0pfSxudWxsLGUsYXJndW1lbnRzLmxlbmd0aCl9LGFwcGVuZDpmdW5jdGlvbigpe3JldHVybiBIZSh0aGlzLGFyZ3VtZW50cyxmdW5jdGlvbihlKXsxIT09dGhpcy5ub2RlVHlwZSYmMTEhPT10aGlzLm5vZGVUeXBlJiY5IT09dGhpcy5ub2RlVHlwZXx8amUodGhpcyxlKS5hcHBlbmRDaGlsZChlKX0pfSxwcmVwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIEhlKHRoaXMsYXJndW1lbnRzLGZ1bmN0aW9uKGUpe2lmKDE9PT10aGlzLm5vZGVUeXBlfHwxMT09PXRoaXMubm9kZVR5cGV8fDk9PT10aGlzLm5vZGVUeXBlKXt2YXIgdD1qZSh0aGlzLGUpO3QuaW5zZXJ0QmVmb3JlKGUsdC5maXJzdENoaWxkKX19KX0sYmVmb3JlOmZ1bmN0aW9uKCl7cmV0dXJuIEhlKHRoaXMsYXJndW1lbnRzLGZ1bmN0aW9uKGUpe3RoaXMucGFyZW50Tm9kZSYmdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLHRoaXMpfSl9LGFmdGVyOmZ1bmN0aW9uKCl7cmV0dXJuIEhlKHRoaXMsYXJndW1lbnRzLGZ1bmN0aW9uKGUpe3RoaXMucGFyZW50Tm9kZSYmdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLHRoaXMubmV4dFNpYmxpbmcpfSl9LGVtcHR5OmZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9MDtudWxsIT0oZT10aGlzW3RdKTt0KyspMT09PWUubm9kZVR5cGUmJihTLmNsZWFuRGF0YSh2ZShlLCExKSksZS50ZXh0Q29udGVudD1cIlwiKTtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZT1udWxsIT1lJiZlLHQ9bnVsbD09dD9lOnQsdGhpcy5tYXAoZnVuY3Rpb24oKXtyZXR1cm4gUy5jbG9uZSh0aGlzLGUsdCl9KX0saHRtbDpmdW5jdGlvbihlKXtyZXR1cm4gJCh0aGlzLGZ1bmN0aW9uKGUpe3ZhciB0PXRoaXNbMF18fHt9LG49MCxyPXRoaXMubGVuZ3RoO2lmKHZvaWQgMD09PWUmJjE9PT10Lm5vZGVUeXBlKXJldHVybiB0LmlubmVySFRNTDtpZihcInN0cmluZ1wiPT10eXBlb2YgZSYmIWtlLnRlc3QoZSkmJiFnZVsoZGUuZXhlYyhlKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCldKXtlPVMuaHRtbFByZWZpbHRlcihlKTt0cnl7Zm9yKDtuPHI7bisrKTE9PT0odD10aGlzW25dfHx7fSkubm9kZVR5cGUmJihTLmNsZWFuRGF0YSh2ZSh0LCExKSksdC5pbm5lckhUTUw9ZSk7dD0wfWNhdGNoKGUpe319dCYmdGhpcy5lbXB0eSgpLmFwcGVuZChlKX0sbnVsbCxlLGFyZ3VtZW50cy5sZW5ndGgpfSxyZXBsYWNlV2l0aDpmdW5jdGlvbigpe3ZhciBuPVtdO3JldHVybiBIZSh0aGlzLGFyZ3VtZW50cyxmdW5jdGlvbihlKXt2YXIgdD10aGlzLnBhcmVudE5vZGU7Uy5pbkFycmF5KHRoaXMsbik8MCYmKFMuY2xlYW5EYXRhKHZlKHRoaXMpKSx0JiZ0LnJlcGxhY2VDaGlsZChlLHRoaXMpKX0sbil9fSksUy5lYWNoKHthcHBlbmRUbzpcImFwcGVuZFwiLHByZXBlbmRUbzpcInByZXBlbmRcIixpbnNlcnRCZWZvcmU6XCJiZWZvcmVcIixpbnNlcnRBZnRlcjpcImFmdGVyXCIscmVwbGFjZUFsbDpcInJlcGxhY2VXaXRoXCJ9LGZ1bmN0aW9uKGUsYSl7Uy5mbltlXT1mdW5jdGlvbihlKXtmb3IodmFyIHQsbj1bXSxyPVMoZSksaT1yLmxlbmd0aC0xLG89MDtvPD1pO28rKyl0PW89PT1pP3RoaXM6dGhpcy5jbG9uZSghMCksUyhyW29dKVthXSh0KSx1LmFwcGx5KG4sdC5nZXQoKSk7cmV0dXJuIHRoaXMucHVzaFN0YWNrKG4pfX0pO3ZhciBQZT1uZXcgUmVnRXhwKFwiXihcIitlZStcIikoPyFweClbYS16JV0rJFwiLFwiaVwiKSxSZT1mdW5jdGlvbihlKXt2YXIgdD1lLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXc7cmV0dXJuIHQmJnQub3BlbmVyfHwodD1DKSx0LmdldENvbXB1dGVkU3R5bGUoZSl9LE1lPWZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpLG89e307Zm9yKGkgaW4gdClvW2ldPWUuc3R5bGVbaV0sZS5zdHlsZVtpXT10W2ldO2ZvcihpIGluIHI9bi5jYWxsKGUpLHQpZS5zdHlsZVtpXT1vW2ldO3JldHVybiByfSxJZT1uZXcgUmVnRXhwKG5lLmpvaW4oXCJ8XCIpLFwiaVwiKTtmdW5jdGlvbiBXZShlLHQsbil7dmFyIHIsaSxvLGEscz1lLnN0eWxlO3JldHVybihuPW58fFJlKGUpKSYmKFwiXCIhPT0oYT1uLmdldFByb3BlcnR5VmFsdWUodCl8fG5bdF0pfHxpZShlKXx8KGE9Uy5zdHlsZShlLHQpKSwheS5waXhlbEJveFN0eWxlcygpJiZQZS50ZXN0KGEpJiZJZS50ZXN0KHQpJiYocj1zLndpZHRoLGk9cy5taW5XaWR0aCxvPXMubWF4V2lkdGgscy5taW5XaWR0aD1zLm1heFdpZHRoPXMud2lkdGg9YSxhPW4ud2lkdGgscy53aWR0aD1yLHMubWluV2lkdGg9aSxzLm1heFdpZHRoPW8pKSx2b2lkIDAhPT1hP2ErXCJcIjphfWZ1bmN0aW9uIEZlKGUsdCl7cmV0dXJue2dldDpmdW5jdGlvbigpe2lmKCFlKCkpcmV0dXJuKHRoaXMuZ2V0PXQpLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtkZWxldGUgdGhpcy5nZXR9fX0hZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7aWYobCl7dS5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246YWJzb2x1dGU7bGVmdDotMTExMTFweDt3aWR0aDo2MHB4O21hcmdpbi10b3A6MXB4O3BhZGRpbmc6MDtib3JkZXI6MFwiLGwuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO2Rpc3BsYXk6YmxvY2s7Ym94LXNpemluZzpib3JkZXItYm94O292ZXJmbG93OnNjcm9sbDttYXJnaW46YXV0bztib3JkZXI6MXB4O3BhZGRpbmc6MXB4O3dpZHRoOjYwJTt0b3A6MSVcIixyZS5hcHBlbmRDaGlsZCh1KS5hcHBlbmRDaGlsZChsKTt2YXIgZT1DLmdldENvbXB1dGVkU3R5bGUobCk7bj1cIjElXCIhPT1lLnRvcCxzPTEyPT09dChlLm1hcmdpbkxlZnQpLGwuc3R5bGUucmlnaHQ9XCI2MCVcIixvPTM2PT09dChlLnJpZ2h0KSxyPTM2PT09dChlLndpZHRoKSxsLnN0eWxlLnBvc2l0aW9uPVwiYWJzb2x1dGVcIixpPTEyPT09dChsLm9mZnNldFdpZHRoLzMpLHJlLnJlbW92ZUNoaWxkKHUpLGw9bnVsbH19ZnVuY3Rpb24gdChlKXtyZXR1cm4gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGUpKX12YXIgbixyLGksbyxhLHMsdT1FLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksbD1FLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7bC5zdHlsZSYmKGwuc3R5bGUuYmFja2dyb3VuZENsaXA9XCJjb250ZW50LWJveFwiLGwuY2xvbmVOb2RlKCEwKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcD1cIlwiLHkuY2xlYXJDbG9uZVN0eWxlPVwiY29udGVudC1ib3hcIj09PWwuc3R5bGUuYmFja2dyb3VuZENsaXAsUy5leHRlbmQoeSx7Ym94U2l6aW5nUmVsaWFibGU6ZnVuY3Rpb24oKXtyZXR1cm4gZSgpLHJ9LHBpeGVsQm94U3R5bGVzOmZ1bmN0aW9uKCl7cmV0dXJuIGUoKSxvfSxwaXhlbFBvc2l0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuIGUoKSxufSxyZWxpYWJsZU1hcmdpbkxlZnQ6ZnVuY3Rpb24oKXtyZXR1cm4gZSgpLHN9LHNjcm9sbGJveFNpemU6ZnVuY3Rpb24oKXtyZXR1cm4gZSgpLGl9LHJlbGlhYmxlVHJEaW1lbnNpb25zOmZ1bmN0aW9uKCl7dmFyIGUsdCxuLHI7cmV0dXJuIG51bGw9PWEmJihlPUUuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpLHQ9RS5jcmVhdGVFbGVtZW50KFwidHJcIiksbj1FLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksZS5zdHlsZS5jc3NUZXh0PVwicG9zaXRpb246YWJzb2x1dGU7bGVmdDotMTExMTFweDtib3JkZXItY29sbGFwc2U6c2VwYXJhdGVcIix0LnN0eWxlLmNzc1RleHQ9XCJib3JkZXI6MXB4IHNvbGlkXCIsdC5zdHlsZS5oZWlnaHQ9XCIxcHhcIixuLnN0eWxlLmhlaWdodD1cIjlweFwiLG4uc3R5bGUuZGlzcGxheT1cImJsb2NrXCIscmUuYXBwZW5kQ2hpbGQoZSkuYXBwZW5kQ2hpbGQodCkuYXBwZW5kQ2hpbGQobikscj1DLmdldENvbXB1dGVkU3R5bGUodCksYT1wYXJzZUludChyLmhlaWdodCwxMCkrcGFyc2VJbnQoci5ib3JkZXJUb3BXaWR0aCwxMCkrcGFyc2VJbnQoci5ib3JkZXJCb3R0b21XaWR0aCwxMCk9PT10Lm9mZnNldEhlaWdodCxyZS5yZW1vdmVDaGlsZChlKSksYX19KSl9KCk7dmFyIEJlPVtcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiXSwkZT1FLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikuc3R5bGUsX2U9e307ZnVuY3Rpb24gemUoZSl7dmFyIHQ9Uy5jc3NQcm9wc1tlXXx8X2VbZV07cmV0dXJuIHR8fChlIGluICRlP2U6X2VbZV09ZnVuY3Rpb24oZSl7dmFyIHQ9ZVswXS50b1VwcGVyQ2FzZSgpK2Uuc2xpY2UoMSksbj1CZS5sZW5ndGg7d2hpbGUobi0tKWlmKChlPUJlW25dK3QpaW4gJGUpcmV0dXJuIGV9KGUpfHxlKX12YXIgVWU9L14obm9uZXx0YWJsZSg/IS1jW2VhXSkuKykvLFhlPS9eLS0vLFZlPXtwb3NpdGlvbjpcImFic29sdXRlXCIsdmlzaWJpbGl0eTpcImhpZGRlblwiLGRpc3BsYXk6XCJibG9ja1wifSxHZT17bGV0dGVyU3BhY2luZzpcIjBcIixmb250V2VpZ2h0OlwiNDAwXCJ9O2Z1bmN0aW9uIFllKGUsdCxuKXt2YXIgcj10ZS5leGVjKHQpO3JldHVybiByP01hdGgubWF4KDAsclsyXS0obnx8MCkpKyhyWzNdfHxcInB4XCIpOnR9ZnVuY3Rpb24gUWUoZSx0LG4scixpLG8pe3ZhciBhPVwid2lkdGhcIj09PXQ/MTowLHM9MCx1PTA7aWYobj09PShyP1wiYm9yZGVyXCI6XCJjb250ZW50XCIpKXJldHVybiAwO2Zvcig7YTw0O2ErPTIpXCJtYXJnaW5cIj09PW4mJih1Kz1TLmNzcyhlLG4rbmVbYV0sITAsaSkpLHI/KFwiY29udGVudFwiPT09biYmKHUtPVMuY3NzKGUsXCJwYWRkaW5nXCIrbmVbYV0sITAsaSkpLFwibWFyZ2luXCIhPT1uJiYodS09Uy5jc3MoZSxcImJvcmRlclwiK25lW2FdK1wiV2lkdGhcIiwhMCxpKSkpOih1Kz1TLmNzcyhlLFwicGFkZGluZ1wiK25lW2FdLCEwLGkpLFwicGFkZGluZ1wiIT09bj91Kz1TLmNzcyhlLFwiYm9yZGVyXCIrbmVbYV0rXCJXaWR0aFwiLCEwLGkpOnMrPVMuY3NzKGUsXCJib3JkZXJcIituZVthXStcIldpZHRoXCIsITAsaSkpO3JldHVybiFyJiYwPD1vJiYodSs9TWF0aC5tYXgoMCxNYXRoLmNlaWwoZVtcIm9mZnNldFwiK3RbMF0udG9VcHBlckNhc2UoKSt0LnNsaWNlKDEpXS1vLXUtcy0uNSkpfHwwKSx1fWZ1bmN0aW9uIEplKGUsdCxuKXt2YXIgcj1SZShlKSxpPSgheS5ib3hTaXppbmdSZWxpYWJsZSgpfHxuKSYmXCJib3JkZXItYm94XCI9PT1TLmNzcyhlLFwiYm94U2l6aW5nXCIsITEsciksbz1pLGE9V2UoZSx0LHIpLHM9XCJvZmZzZXRcIit0WzBdLnRvVXBwZXJDYXNlKCkrdC5zbGljZSgxKTtpZihQZS50ZXN0KGEpKXtpZighbilyZXR1cm4gYTthPVwiYXV0b1wifXJldHVybigheS5ib3hTaXppbmdSZWxpYWJsZSgpJiZpfHwheS5yZWxpYWJsZVRyRGltZW5zaW9ucygpJiZBKGUsXCJ0clwiKXx8XCJhdXRvXCI9PT1hfHwhcGFyc2VGbG9hdChhKSYmXCJpbmxpbmVcIj09PVMuY3NzKGUsXCJkaXNwbGF5XCIsITEscikpJiZlLmdldENsaWVudFJlY3RzKCkubGVuZ3RoJiYoaT1cImJvcmRlci1ib3hcIj09PVMuY3NzKGUsXCJib3hTaXppbmdcIiwhMSxyKSwobz1zIGluIGUpJiYoYT1lW3NdKSksKGE9cGFyc2VGbG9hdChhKXx8MCkrUWUoZSx0LG58fChpP1wiYm9yZGVyXCI6XCJjb250ZW50XCIpLG8scixhKStcInB4XCJ9ZnVuY3Rpb24gS2UoZSx0LG4scixpKXtyZXR1cm4gbmV3IEtlLnByb3RvdHlwZS5pbml0KGUsdCxuLHIsaSl9Uy5leHRlbmQoe2Nzc0hvb2tzOntvcGFjaXR5OntnZXQ6ZnVuY3Rpb24oZSx0KXtpZih0KXt2YXIgbj1XZShlLFwib3BhY2l0eVwiKTtyZXR1cm5cIlwiPT09bj9cIjFcIjpufX19fSxjc3NOdW1iZXI6e2FuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiEwLGNvbHVtbkNvdW50OiEwLGZpbGxPcGFjaXR5OiEwLGZsZXhHcm93OiEwLGZsZXhTaHJpbms6ITAsZm9udFdlaWdodDohMCxncmlkQXJlYTohMCxncmlkQ29sdW1uOiEwLGdyaWRDb2x1bW5FbmQ6ITAsZ3JpZENvbHVtblN0YXJ0OiEwLGdyaWRSb3c6ITAsZ3JpZFJvd0VuZDohMCxncmlkUm93U3RhcnQ6ITAsbGluZUhlaWdodDohMCxvcGFjaXR5OiEwLG9yZGVyOiEwLG9ycGhhbnM6ITAsd2lkb3dzOiEwLHpJbmRleDohMCx6b29tOiEwfSxjc3NQcm9wczp7fSxzdHlsZTpmdW5jdGlvbihlLHQsbixyKXtpZihlJiYzIT09ZS5ub2RlVHlwZSYmOCE9PWUubm9kZVR5cGUmJmUuc3R5bGUpe3ZhciBpLG8sYSxzPVgodCksdT1YZS50ZXN0KHQpLGw9ZS5zdHlsZTtpZih1fHwodD16ZShzKSksYT1TLmNzc0hvb2tzW3RdfHxTLmNzc0hvb2tzW3NdLHZvaWQgMD09PW4pcmV0dXJuIGEmJlwiZ2V0XCJpbiBhJiZ2b2lkIDAhPT0oaT1hLmdldChlLCExLHIpKT9pOmxbdF07XCJzdHJpbmdcIj09PShvPXR5cGVvZiBuKSYmKGk9dGUuZXhlYyhuKSkmJmlbMV0mJihuPXNlKGUsdCxpKSxvPVwibnVtYmVyXCIpLG51bGwhPW4mJm49PW4mJihcIm51bWJlclwiIT09b3x8dXx8KG4rPWkmJmlbM118fChTLmNzc051bWJlcltzXT9cIlwiOlwicHhcIikpLHkuY2xlYXJDbG9uZVN0eWxlfHxcIlwiIT09bnx8MCE9PXQuaW5kZXhPZihcImJhY2tncm91bmRcIil8fChsW3RdPVwiaW5oZXJpdFwiKSxhJiZcInNldFwiaW4gYSYmdm9pZCAwPT09KG49YS5zZXQoZSxuLHIpKXx8KHU/bC5zZXRQcm9wZXJ0eSh0LG4pOmxbdF09bikpfX0sY3NzOmZ1bmN0aW9uKGUsdCxuLHIpe3ZhciBpLG8sYSxzPVgodCk7cmV0dXJuIFhlLnRlc3QodCl8fCh0PXplKHMpKSwoYT1TLmNzc0hvb2tzW3RdfHxTLmNzc0hvb2tzW3NdKSYmXCJnZXRcImluIGEmJihpPWEuZ2V0KGUsITAsbikpLHZvaWQgMD09PWkmJihpPVdlKGUsdCxyKSksXCJub3JtYWxcIj09PWkmJnQgaW4gR2UmJihpPUdlW3RdKSxcIlwiPT09bnx8bj8obz1wYXJzZUZsb2F0KGkpLCEwPT09bnx8aXNGaW5pdGUobyk/b3x8MDppKTppfX0pLFMuZWFjaChbXCJoZWlnaHRcIixcIndpZHRoXCJdLGZ1bmN0aW9uKGUsdSl7Uy5jc3NIb29rc1t1XT17Z2V0OmZ1bmN0aW9uKGUsdCxuKXtpZih0KXJldHVybiFVZS50ZXN0KFMuY3NzKGUsXCJkaXNwbGF5XCIpKXx8ZS5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCYmZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aD9KZShlLHUsbik6TWUoZSxWZSxmdW5jdGlvbigpe3JldHVybiBKZShlLHUsbil9KX0sc2V0OmZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpPVJlKGUpLG89IXkuc2Nyb2xsYm94U2l6ZSgpJiZcImFic29sdXRlXCI9PT1pLnBvc2l0aW9uLGE9KG98fG4pJiZcImJvcmRlci1ib3hcIj09PVMuY3NzKGUsXCJib3hTaXppbmdcIiwhMSxpKSxzPW4/UWUoZSx1LG4sYSxpKTowO3JldHVybiBhJiZvJiYocy09TWF0aC5jZWlsKGVbXCJvZmZzZXRcIit1WzBdLnRvVXBwZXJDYXNlKCkrdS5zbGljZSgxKV0tcGFyc2VGbG9hdChpW3VdKS1RZShlLHUsXCJib3JkZXJcIiwhMSxpKS0uNSkpLHMmJihyPXRlLmV4ZWModCkpJiZcInB4XCIhPT0oclszXXx8XCJweFwiKSYmKGUuc3R5bGVbdV09dCx0PVMuY3NzKGUsdSkpLFllKDAsdCxzKX19fSksUy5jc3NIb29rcy5tYXJnaW5MZWZ0PUZlKHkucmVsaWFibGVNYXJnaW5MZWZ0LGZ1bmN0aW9uKGUsdCl7aWYodClyZXR1cm4ocGFyc2VGbG9hdChXZShlLFwibWFyZ2luTGVmdFwiKSl8fGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdC1NZShlLHttYXJnaW5MZWZ0OjB9LGZ1bmN0aW9uKCl7cmV0dXJuIGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdH0pKStcInB4XCJ9KSxTLmVhY2goe21hcmdpbjpcIlwiLHBhZGRpbmc6XCJcIixib3JkZXI6XCJXaWR0aFwifSxmdW5jdGlvbihpLG8pe1MuY3NzSG9va3NbaStvXT17ZXhwYW5kOmZ1bmN0aW9uKGUpe2Zvcih2YXIgdD0wLG49e30scj1cInN0cmluZ1wiPT10eXBlb2YgZT9lLnNwbGl0KFwiIFwiKTpbZV07dDw0O3QrKyluW2krbmVbdF0rb109clt0XXx8clt0LTJdfHxyWzBdO3JldHVybiBufX0sXCJtYXJnaW5cIiE9PWkmJihTLmNzc0hvb2tzW2krb10uc2V0PVllKX0pLFMuZm4uZXh0ZW5kKHtjc3M6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gJCh0aGlzLGZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpLG89e30sYT0wO2lmKEFycmF5LmlzQXJyYXkodCkpe2ZvcihyPVJlKGUpLGk9dC5sZW5ndGg7YTxpO2ErKylvW3RbYV1dPVMuY3NzKGUsdFthXSwhMSxyKTtyZXR1cm4gb31yZXR1cm4gdm9pZCAwIT09bj9TLnN0eWxlKGUsdCxuKTpTLmNzcyhlLHQpfSxlLHQsMTxhcmd1bWVudHMubGVuZ3RoKX19KSwoKFMuVHdlZW49S2UpLnByb3RvdHlwZT17Y29uc3RydWN0b3I6S2UsaW5pdDpmdW5jdGlvbihlLHQsbixyLGksbyl7dGhpcy5lbGVtPWUsdGhpcy5wcm9wPW4sdGhpcy5lYXNpbmc9aXx8Uy5lYXNpbmcuX2RlZmF1bHQsdGhpcy5vcHRpb25zPXQsdGhpcy5zdGFydD10aGlzLm5vdz10aGlzLmN1cigpLHRoaXMuZW5kPXIsdGhpcy51bml0PW98fChTLmNzc051bWJlcltuXT9cIlwiOlwicHhcIil9LGN1cjpmdW5jdGlvbigpe3ZhciBlPUtlLnByb3BIb29rc1t0aGlzLnByb3BdO3JldHVybiBlJiZlLmdldD9lLmdldCh0aGlzKTpLZS5wcm9wSG9va3MuX2RlZmF1bHQuZ2V0KHRoaXMpfSxydW46ZnVuY3Rpb24oZSl7dmFyIHQsbj1LZS5wcm9wSG9va3NbdGhpcy5wcm9wXTtyZXR1cm4gdGhpcy5vcHRpb25zLmR1cmF0aW9uP3RoaXMucG9zPXQ9Uy5lYXNpbmdbdGhpcy5lYXNpbmddKGUsdGhpcy5vcHRpb25zLmR1cmF0aW9uKmUsMCwxLHRoaXMub3B0aW9ucy5kdXJhdGlvbik6dGhpcy5wb3M9dD1lLHRoaXMubm93PSh0aGlzLmVuZC10aGlzLnN0YXJ0KSp0K3RoaXMuc3RhcnQsdGhpcy5vcHRpb25zLnN0ZXAmJnRoaXMub3B0aW9ucy5zdGVwLmNhbGwodGhpcy5lbGVtLHRoaXMubm93LHRoaXMpLG4mJm4uc2V0P24uc2V0KHRoaXMpOktlLnByb3BIb29rcy5fZGVmYXVsdC5zZXQodGhpcyksdGhpc319KS5pbml0LnByb3RvdHlwZT1LZS5wcm90b3R5cGUsKEtlLnByb3BIb29rcz17X2RlZmF1bHQ6e2dldDpmdW5jdGlvbihlKXt2YXIgdDtyZXR1cm4gMSE9PWUuZWxlbS5ub2RlVHlwZXx8bnVsbCE9ZS5lbGVtW2UucHJvcF0mJm51bGw9PWUuZWxlbS5zdHlsZVtlLnByb3BdP2UuZWxlbVtlLnByb3BdOih0PVMuY3NzKGUuZWxlbSxlLnByb3AsXCJcIikpJiZcImF1dG9cIiE9PXQ/dDowfSxzZXQ6ZnVuY3Rpb24oZSl7Uy5meC5zdGVwW2UucHJvcF0/Uy5meC5zdGVwW2UucHJvcF0oZSk6MSE9PWUuZWxlbS5ub2RlVHlwZXx8IVMuY3NzSG9va3NbZS5wcm9wXSYmbnVsbD09ZS5lbGVtLnN0eWxlW3plKGUucHJvcCldP2UuZWxlbVtlLnByb3BdPWUubm93OlMuc3R5bGUoZS5lbGVtLGUucHJvcCxlLm5vdytlLnVuaXQpfX19KS5zY3JvbGxUb3A9S2UucHJvcEhvb2tzLnNjcm9sbExlZnQ9e3NldDpmdW5jdGlvbihlKXtlLmVsZW0ubm9kZVR5cGUmJmUuZWxlbS5wYXJlbnROb2RlJiYoZS5lbGVtW2UucHJvcF09ZS5ub3cpfX0sUy5lYXNpbmc9e2xpbmVhcjpmdW5jdGlvbihlKXtyZXR1cm4gZX0sc3dpbmc6ZnVuY3Rpb24oZSl7cmV0dXJuLjUtTWF0aC5jb3MoZSpNYXRoLlBJKS8yfSxfZGVmYXVsdDpcInN3aW5nXCJ9LFMuZng9S2UucHJvdG90eXBlLmluaXQsUy5meC5zdGVwPXt9O3ZhciBaZSxldCx0dCxudCxydD0vXig/OnRvZ2dsZXxzaG93fGhpZGUpJC8saXQ9L3F1ZXVlSG9va3MkLztmdW5jdGlvbiBvdCgpe2V0JiYoITE9PT1FLmhpZGRlbiYmQy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU/Qy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUob3QpOkMuc2V0VGltZW91dChvdCxTLmZ4LmludGVydmFsKSxTLmZ4LnRpY2soKSl9ZnVuY3Rpb24gYXQoKXtyZXR1cm4gQy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7WmU9dm9pZCAwfSksWmU9RGF0ZS5ub3coKX1mdW5jdGlvbiBzdChlLHQpe3ZhciBuLHI9MCxpPXtoZWlnaHQ6ZX07Zm9yKHQ9dD8xOjA7cjw0O3IrPTItdClpW1wibWFyZ2luXCIrKG49bmVbcl0pXT1pW1wicGFkZGluZ1wiK25dPWU7cmV0dXJuIHQmJihpLm9wYWNpdHk9aS53aWR0aD1lKSxpfWZ1bmN0aW9uIHV0KGUsdCxuKXtmb3IodmFyIHIsaT0obHQudHdlZW5lcnNbdF18fFtdKS5jb25jYXQobHQudHdlZW5lcnNbXCIqXCJdKSxvPTAsYT1pLmxlbmd0aDtvPGE7bysrKWlmKHI9aVtvXS5jYWxsKG4sdCxlKSlyZXR1cm4gcn1mdW5jdGlvbiBsdChvLGUsdCl7dmFyIG4sYSxyPTAsaT1sdC5wcmVmaWx0ZXJzLmxlbmd0aCxzPVMuRGVmZXJyZWQoKS5hbHdheXMoZnVuY3Rpb24oKXtkZWxldGUgdS5lbGVtfSksdT1mdW5jdGlvbigpe2lmKGEpcmV0dXJuITE7Zm9yKHZhciBlPVplfHxhdCgpLHQ9TWF0aC5tYXgoMCxsLnN0YXJ0VGltZStsLmR1cmF0aW9uLWUpLG49MS0odC9sLmR1cmF0aW9ufHwwKSxyPTAsaT1sLnR3ZWVucy5sZW5ndGg7cjxpO3IrKylsLnR3ZWVuc1tyXS5ydW4obik7cmV0dXJuIHMubm90aWZ5V2l0aChvLFtsLG4sdF0pLG48MSYmaT90OihpfHxzLm5vdGlmeVdpdGgobyxbbCwxLDBdKSxzLnJlc29sdmVXaXRoKG8sW2xdKSwhMSl9LGw9cy5wcm9taXNlKHtlbGVtOm8scHJvcHM6Uy5leHRlbmQoe30sZSksb3B0czpTLmV4dGVuZCghMCx7c3BlY2lhbEVhc2luZzp7fSxlYXNpbmc6Uy5lYXNpbmcuX2RlZmF1bHR9LHQpLG9yaWdpbmFsUHJvcGVydGllczplLG9yaWdpbmFsT3B0aW9uczp0LHN0YXJ0VGltZTpaZXx8YXQoKSxkdXJhdGlvbjp0LmR1cmF0aW9uLHR3ZWVuczpbXSxjcmVhdGVUd2VlbjpmdW5jdGlvbihlLHQpe3ZhciBuPVMuVHdlZW4obyxsLm9wdHMsZSx0LGwub3B0cy5zcGVjaWFsRWFzaW5nW2VdfHxsLm9wdHMuZWFzaW5nKTtyZXR1cm4gbC50d2VlbnMucHVzaChuKSxufSxzdG9wOmZ1bmN0aW9uKGUpe3ZhciB0PTAsbj1lP2wudHdlZW5zLmxlbmd0aDowO2lmKGEpcmV0dXJuIHRoaXM7Zm9yKGE9ITA7dDxuO3QrKylsLnR3ZWVuc1t0XS5ydW4oMSk7cmV0dXJuIGU/KHMubm90aWZ5V2l0aChvLFtsLDEsMF0pLHMucmVzb2x2ZVdpdGgobyxbbCxlXSkpOnMucmVqZWN0V2l0aChvLFtsLGVdKSx0aGlzfX0pLGM9bC5wcm9wcztmb3IoIWZ1bmN0aW9uKGUsdCl7dmFyIG4scixpLG8sYTtmb3IobiBpbiBlKWlmKGk9dFtyPVgobildLG89ZVtuXSxBcnJheS5pc0FycmF5KG8pJiYoaT1vWzFdLG89ZVtuXT1vWzBdKSxuIT09ciYmKGVbcl09byxkZWxldGUgZVtuXSksKGE9Uy5jc3NIb29rc1tyXSkmJlwiZXhwYW5kXCJpbiBhKWZvcihuIGluIG89YS5leHBhbmQobyksZGVsZXRlIGVbcl0sbyluIGluIGV8fChlW25dPW9bbl0sdFtuXT1pKTtlbHNlIHRbcl09aX0oYyxsLm9wdHMuc3BlY2lhbEVhc2luZyk7cjxpO3IrKylpZihuPWx0LnByZWZpbHRlcnNbcl0uY2FsbChsLG8sYyxsLm9wdHMpKXJldHVybiBtKG4uc3RvcCkmJihTLl9xdWV1ZUhvb2tzKGwuZWxlbSxsLm9wdHMucXVldWUpLnN0b3A9bi5zdG9wLmJpbmQobikpLG47cmV0dXJuIFMubWFwKGMsdXQsbCksbShsLm9wdHMuc3RhcnQpJiZsLm9wdHMuc3RhcnQuY2FsbChvLGwpLGwucHJvZ3Jlc3MobC5vcHRzLnByb2dyZXNzKS5kb25lKGwub3B0cy5kb25lLGwub3B0cy5jb21wbGV0ZSkuZmFpbChsLm9wdHMuZmFpbCkuYWx3YXlzKGwub3B0cy5hbHdheXMpLFMuZngudGltZXIoUy5leHRlbmQodSx7ZWxlbTpvLGFuaW06bCxxdWV1ZTpsLm9wdHMucXVldWV9KSksbH1TLkFuaW1hdGlvbj1TLmV4dGVuZChsdCx7dHdlZW5lcnM6e1wiKlwiOltmdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuY3JlYXRlVHdlZW4oZSx0KTtyZXR1cm4gc2Uobi5lbGVtLGUsdGUuZXhlYyh0KSxuKSxufV19LHR3ZWVuZXI6ZnVuY3Rpb24oZSx0KXttKGUpPyh0PWUsZT1bXCIqXCJdKTplPWUubWF0Y2goUCk7Zm9yKHZhciBuLHI9MCxpPWUubGVuZ3RoO3I8aTtyKyspbj1lW3JdLGx0LnR3ZWVuZXJzW25dPWx0LnR3ZWVuZXJzW25dfHxbXSxsdC50d2VlbmVyc1tuXS51bnNoaWZ0KHQpfSxwcmVmaWx0ZXJzOltmdW5jdGlvbihlLHQsbil7dmFyIHIsaSxvLGEscyx1LGwsYyxmPVwid2lkdGhcImluIHR8fFwiaGVpZ2h0XCJpbiB0LHA9dGhpcyxkPXt9LGg9ZS5zdHlsZSxnPWUubm9kZVR5cGUmJmFlKGUpLHY9WS5nZXQoZSxcImZ4c2hvd1wiKTtmb3IociBpbiBuLnF1ZXVlfHwobnVsbD09KGE9Uy5fcXVldWVIb29rcyhlLFwiZnhcIikpLnVucXVldWVkJiYoYS51bnF1ZXVlZD0wLHM9YS5lbXB0eS5maXJlLGEuZW1wdHkuZmlyZT1mdW5jdGlvbigpe2EudW5xdWV1ZWR8fHMoKX0pLGEudW5xdWV1ZWQrKyxwLmFsd2F5cyhmdW5jdGlvbigpe3AuYWx3YXlzKGZ1bmN0aW9uKCl7YS51bnF1ZXVlZC0tLFMucXVldWUoZSxcImZ4XCIpLmxlbmd0aHx8YS5lbXB0eS5maXJlKCl9KX0pKSx0KWlmKGk9dFtyXSxydC50ZXN0KGkpKXtpZihkZWxldGUgdFtyXSxvPW98fFwidG9nZ2xlXCI9PT1pLGk9PT0oZz9cImhpZGVcIjpcInNob3dcIikpe2lmKFwic2hvd1wiIT09aXx8IXZ8fHZvaWQgMD09PXZbcl0pY29udGludWU7Zz0hMH1kW3JdPXYmJnZbcl18fFMuc3R5bGUoZSxyKX1pZigodT0hUy5pc0VtcHR5T2JqZWN0KHQpKXx8IVMuaXNFbXB0eU9iamVjdChkKSlmb3IociBpbiBmJiYxPT09ZS5ub2RlVHlwZSYmKG4ub3ZlcmZsb3c9W2gub3ZlcmZsb3csaC5vdmVyZmxvd1gsaC5vdmVyZmxvd1ldLG51bGw9PShsPXYmJnYuZGlzcGxheSkmJihsPVkuZ2V0KGUsXCJkaXNwbGF5XCIpKSxcIm5vbmVcIj09PShjPVMuY3NzKGUsXCJkaXNwbGF5XCIpKSYmKGw/Yz1sOihsZShbZV0sITApLGw9ZS5zdHlsZS5kaXNwbGF5fHxsLGM9Uy5jc3MoZSxcImRpc3BsYXlcIiksbGUoW2VdKSkpLChcImlubGluZVwiPT09Y3x8XCJpbmxpbmUtYmxvY2tcIj09PWMmJm51bGwhPWwpJiZcIm5vbmVcIj09PVMuY3NzKGUsXCJmbG9hdFwiKSYmKHV8fChwLmRvbmUoZnVuY3Rpb24oKXtoLmRpc3BsYXk9bH0pLG51bGw9PWwmJihjPWguZGlzcGxheSxsPVwibm9uZVwiPT09Yz9cIlwiOmMpKSxoLmRpc3BsYXk9XCJpbmxpbmUtYmxvY2tcIikpLG4ub3ZlcmZsb3cmJihoLm92ZXJmbG93PVwiaGlkZGVuXCIscC5hbHdheXMoZnVuY3Rpb24oKXtoLm92ZXJmbG93PW4ub3ZlcmZsb3dbMF0saC5vdmVyZmxvd1g9bi5vdmVyZmxvd1sxXSxoLm92ZXJmbG93WT1uLm92ZXJmbG93WzJdfSkpLHU9ITEsZCl1fHwodj9cImhpZGRlblwiaW4gdiYmKGc9di5oaWRkZW4pOnY9WS5hY2Nlc3MoZSxcImZ4c2hvd1wiLHtkaXNwbGF5Omx9KSxvJiYodi5oaWRkZW49IWcpLGcmJmxlKFtlXSwhMCkscC5kb25lKGZ1bmN0aW9uKCl7Zm9yKHIgaW4gZ3x8bGUoW2VdKSxZLnJlbW92ZShlLFwiZnhzaG93XCIpLGQpUy5zdHlsZShlLHIsZFtyXSl9KSksdT11dChnP3Zbcl06MCxyLHApLHIgaW4gdnx8KHZbcl09dS5zdGFydCxnJiYodS5lbmQ9dS5zdGFydCx1LnN0YXJ0PTApKX1dLHByZWZpbHRlcjpmdW5jdGlvbihlLHQpe3Q/bHQucHJlZmlsdGVycy51bnNoaWZ0KGUpOmx0LnByZWZpbHRlcnMucHVzaChlKX19KSxTLnNwZWVkPWZ1bmN0aW9uKGUsdCxuKXt2YXIgcj1lJiZcIm9iamVjdFwiPT10eXBlb2YgZT9TLmV4dGVuZCh7fSxlKTp7Y29tcGxldGU6bnx8IW4mJnR8fG0oZSkmJmUsZHVyYXRpb246ZSxlYXNpbmc6biYmdHx8dCYmIW0odCkmJnR9O3JldHVybiBTLmZ4Lm9mZj9yLmR1cmF0aW9uPTA6XCJudW1iZXJcIiE9dHlwZW9mIHIuZHVyYXRpb24mJihyLmR1cmF0aW9uIGluIFMuZnguc3BlZWRzP3IuZHVyYXRpb249Uy5meC5zcGVlZHNbci5kdXJhdGlvbl06ci5kdXJhdGlvbj1TLmZ4LnNwZWVkcy5fZGVmYXVsdCksbnVsbCE9ci5xdWV1ZSYmITAhPT1yLnF1ZXVlfHwoci5xdWV1ZT1cImZ4XCIpLHIub2xkPXIuY29tcGxldGUsci5jb21wbGV0ZT1mdW5jdGlvbigpe20oci5vbGQpJiZyLm9sZC5jYWxsKHRoaXMpLHIucXVldWUmJlMuZGVxdWV1ZSh0aGlzLHIucXVldWUpfSxyfSxTLmZuLmV4dGVuZCh7ZmFkZVRvOmZ1bmN0aW9uKGUsdCxuLHIpe3JldHVybiB0aGlzLmZpbHRlcihhZSkuY3NzKFwib3BhY2l0eVwiLDApLnNob3coKS5lbmQoKS5hbmltYXRlKHtvcGFjaXR5OnR9LGUsbixyKX0sYW5pbWF0ZTpmdW5jdGlvbih0LGUsbixyKXt2YXIgaT1TLmlzRW1wdHlPYmplY3QodCksbz1TLnNwZWVkKGUsbixyKSxhPWZ1bmN0aW9uKCl7dmFyIGU9bHQodGhpcyxTLmV4dGVuZCh7fSx0KSxvKTsoaXx8WS5nZXQodGhpcyxcImZpbmlzaFwiKSkmJmUuc3RvcCghMCl9O3JldHVybiBhLmZpbmlzaD1hLGl8fCExPT09by5xdWV1ZT90aGlzLmVhY2goYSk6dGhpcy5xdWV1ZShvLnF1ZXVlLGEpfSxzdG9wOmZ1bmN0aW9uKGksZSxvKXt2YXIgYT1mdW5jdGlvbihlKXt2YXIgdD1lLnN0b3A7ZGVsZXRlIGUuc3RvcCx0KG8pfTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgaSYmKG89ZSxlPWksaT12b2lkIDApLGUmJnRoaXMucXVldWUoaXx8XCJmeFwiLFtdKSx0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZT0hMCx0PW51bGwhPWkmJmkrXCJxdWV1ZUhvb2tzXCIsbj1TLnRpbWVycyxyPVkuZ2V0KHRoaXMpO2lmKHQpclt0XSYmclt0XS5zdG9wJiZhKHJbdF0pO2Vsc2UgZm9yKHQgaW4gcilyW3RdJiZyW3RdLnN0b3AmJml0LnRlc3QodCkmJmEoclt0XSk7Zm9yKHQ9bi5sZW5ndGg7dC0tOyluW3RdLmVsZW0hPT10aGlzfHxudWxsIT1pJiZuW3RdLnF1ZXVlIT09aXx8KG5bdF0uYW5pbS5zdG9wKG8pLGU9ITEsbi5zcGxpY2UodCwxKSk7IWUmJm98fFMuZGVxdWV1ZSh0aGlzLGkpfSl9LGZpbmlzaDpmdW5jdGlvbihhKXtyZXR1cm4hMSE9PWEmJihhPWF8fFwiZnhcIiksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGUsdD1ZLmdldCh0aGlzKSxuPXRbYStcInF1ZXVlXCJdLHI9dFthK1wicXVldWVIb29rc1wiXSxpPVMudGltZXJzLG89bj9uLmxlbmd0aDowO2Zvcih0LmZpbmlzaD0hMCxTLnF1ZXVlKHRoaXMsYSxbXSksciYmci5zdG9wJiZyLnN0b3AuY2FsbCh0aGlzLCEwKSxlPWkubGVuZ3RoO2UtLTspaVtlXS5lbGVtPT09dGhpcyYmaVtlXS5xdWV1ZT09PWEmJihpW2VdLmFuaW0uc3RvcCghMCksaS5zcGxpY2UoZSwxKSk7Zm9yKGU9MDtlPG87ZSsrKW5bZV0mJm5bZV0uZmluaXNoJiZuW2VdLmZpbmlzaC5jYWxsKHRoaXMpO2RlbGV0ZSB0LmZpbmlzaH0pfX0pLFMuZWFjaChbXCJ0b2dnbGVcIixcInNob3dcIixcImhpZGVcIl0sZnVuY3Rpb24oZSxyKXt2YXIgaT1TLmZuW3JdO1MuZm5bcl09ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBudWxsPT1lfHxcImJvb2xlYW5cIj09dHlwZW9mIGU/aS5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dGhpcy5hbmltYXRlKHN0KHIsITApLGUsdCxuKX19KSxTLmVhY2goe3NsaWRlRG93bjpzdChcInNob3dcIiksc2xpZGVVcDpzdChcImhpZGVcIiksc2xpZGVUb2dnbGU6c3QoXCJ0b2dnbGVcIiksZmFkZUluOntvcGFjaXR5Olwic2hvd1wifSxmYWRlT3V0OntvcGFjaXR5OlwiaGlkZVwifSxmYWRlVG9nZ2xlOntvcGFjaXR5OlwidG9nZ2xlXCJ9fSxmdW5jdGlvbihlLHIpe1MuZm5bZV09ZnVuY3Rpb24oZSx0LG4pe3JldHVybiB0aGlzLmFuaW1hdGUocixlLHQsbil9fSksUy50aW1lcnM9W10sUy5meC50aWNrPWZ1bmN0aW9uKCl7dmFyIGUsdD0wLG49Uy50aW1lcnM7Zm9yKFplPURhdGUubm93KCk7dDxuLmxlbmd0aDt0KyspKGU9blt0XSkoKXx8blt0XSE9PWV8fG4uc3BsaWNlKHQtLSwxKTtuLmxlbmd0aHx8Uy5meC5zdG9wKCksWmU9dm9pZCAwfSxTLmZ4LnRpbWVyPWZ1bmN0aW9uKGUpe1MudGltZXJzLnB1c2goZSksUy5meC5zdGFydCgpfSxTLmZ4LmludGVydmFsPTEzLFMuZnguc3RhcnQ9ZnVuY3Rpb24oKXtldHx8KGV0PSEwLG90KCkpfSxTLmZ4LnN0b3A9ZnVuY3Rpb24oKXtldD1udWxsfSxTLmZ4LnNwZWVkcz17c2xvdzo2MDAsZmFzdDoyMDAsX2RlZmF1bHQ6NDAwfSxTLmZuLmRlbGF5PWZ1bmN0aW9uKHIsZSl7cmV0dXJuIHI9Uy5meCYmUy5meC5zcGVlZHNbcl18fHIsZT1lfHxcImZ4XCIsdGhpcy5xdWV1ZShlLGZ1bmN0aW9uKGUsdCl7dmFyIG49Qy5zZXRUaW1lb3V0KGUscik7dC5zdG9wPWZ1bmN0aW9uKCl7Qy5jbGVhclRpbWVvdXQobil9fSl9LHR0PUUuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLG50PUUuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKS5hcHBlbmRDaGlsZChFLmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikpLHR0LnR5cGU9XCJjaGVja2JveFwiLHkuY2hlY2tPbj1cIlwiIT09dHQudmFsdWUseS5vcHRTZWxlY3RlZD1udC5zZWxlY3RlZCwodHQ9RS5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIikpLnZhbHVlPVwidFwiLHR0LnR5cGU9XCJyYWRpb1wiLHkucmFkaW9WYWx1ZT1cInRcIj09PXR0LnZhbHVlO3ZhciBjdCxmdD1TLmV4cHIuYXR0ckhhbmRsZTtTLmZuLmV4dGVuZCh7YXR0cjpmdW5jdGlvbihlLHQpe3JldHVybiAkKHRoaXMsUy5hdHRyLGUsdCwxPGFyZ3VtZW50cy5sZW5ndGgpfSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtTLnJlbW92ZUF0dHIodGhpcyxlKX0pfX0pLFMuZXh0ZW5kKHthdHRyOmZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpLG89ZS5ub2RlVHlwZTtpZigzIT09byYmOCE9PW8mJjIhPT1vKXJldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBlLmdldEF0dHJpYnV0ZT9TLnByb3AoZSx0LG4pOigxPT09byYmUy5pc1hNTERvYyhlKXx8KGk9Uy5hdHRySG9va3NbdC50b0xvd2VyQ2FzZSgpXXx8KFMuZXhwci5tYXRjaC5ib29sLnRlc3QodCk/Y3Q6dm9pZCAwKSksdm9pZCAwIT09bj9udWxsPT09bj92b2lkIFMucmVtb3ZlQXR0cihlLHQpOmkmJlwic2V0XCJpbiBpJiZ2b2lkIDAhPT0ocj1pLnNldChlLG4sdCkpP3I6KGUuc2V0QXR0cmlidXRlKHQsbitcIlwiKSxuKTppJiZcImdldFwiaW4gaSYmbnVsbCE9PShyPWkuZ2V0KGUsdCkpP3I6bnVsbD09KHI9Uy5maW5kLmF0dHIoZSx0KSk/dm9pZCAwOnIpfSxhdHRySG9va3M6e3R5cGU6e3NldDpmdW5jdGlvbihlLHQpe2lmKCF5LnJhZGlvVmFsdWUmJlwicmFkaW9cIj09PXQmJkEoZSxcImlucHV0XCIpKXt2YXIgbj1lLnZhbHVlO3JldHVybiBlLnNldEF0dHJpYnV0ZShcInR5cGVcIix0KSxuJiYoZS52YWx1ZT1uKSx0fX19fSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGUsdCl7dmFyIG4scj0wLGk9dCYmdC5tYXRjaChQKTtpZihpJiYxPT09ZS5ub2RlVHlwZSl3aGlsZShuPWlbcisrXSllLnJlbW92ZUF0dHJpYnV0ZShuKX19KSxjdD17c2V0OmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4hMT09PXQ/Uy5yZW1vdmVBdHRyKGUsbik6ZS5zZXRBdHRyaWJ1dGUobixuKSxufX0sUy5lYWNoKFMuZXhwci5tYXRjaC5ib29sLnNvdXJjZS5tYXRjaCgvXFx3Ky9nKSxmdW5jdGlvbihlLHQpe3ZhciBhPWZ0W3RdfHxTLmZpbmQuYXR0cjtmdFt0XT1mdW5jdGlvbihlLHQsbil7dmFyIHIsaSxvPXQudG9Mb3dlckNhc2UoKTtyZXR1cm4gbnx8KGk9ZnRbb10sZnRbb109cixyPW51bGwhPWEoZSx0LG4pP286bnVsbCxmdFtvXT1pKSxyfX0pO3ZhciBwdD0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLGR0PS9eKD86YXxhcmVhKSQvaTtmdW5jdGlvbiBodChlKXtyZXR1cm4oZS5tYXRjaChQKXx8W10pLmpvaW4oXCIgXCIpfWZ1bmN0aW9uIGd0KGUpe3JldHVybiBlLmdldEF0dHJpYnV0ZSYmZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIn1mdW5jdGlvbiB2dChlKXtyZXR1cm4gQXJyYXkuaXNBcnJheShlKT9lOlwic3RyaW5nXCI9PXR5cGVvZiBlJiZlLm1hdGNoKFApfHxbXX1TLmZuLmV4dGVuZCh7cHJvcDpmdW5jdGlvbihlLHQpe3JldHVybiAkKHRoaXMsUy5wcm9wLGUsdCwxPGFyZ3VtZW50cy5sZW5ndGgpfSxyZW1vdmVQcm9wOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtkZWxldGUgdGhpc1tTLnByb3BGaXhbZV18fGVdfSl9fSksUy5leHRlbmQoe3Byb3A6ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGksbz1lLm5vZGVUeXBlO2lmKDMhPT1vJiY4IT09byYmMiE9PW8pcmV0dXJuIDE9PT1vJiZTLmlzWE1MRG9jKGUpfHwodD1TLnByb3BGaXhbdF18fHQsaT1TLnByb3BIb29rc1t0XSksdm9pZCAwIT09bj9pJiZcInNldFwiaW4gaSYmdm9pZCAwIT09KHI9aS5zZXQoZSxuLHQpKT9yOmVbdF09bjppJiZcImdldFwiaW4gaSYmbnVsbCE9PShyPWkuZ2V0KGUsdCkpP3I6ZVt0XX0scHJvcEhvb2tzOnt0YWJJbmRleDp7Z2V0OmZ1bmN0aW9uKGUpe3ZhciB0PVMuZmluZC5hdHRyKGUsXCJ0YWJpbmRleFwiKTtyZXR1cm4gdD9wYXJzZUludCh0LDEwKTpwdC50ZXN0KGUubm9kZU5hbWUpfHxkdC50ZXN0KGUubm9kZU5hbWUpJiZlLmhyZWY/MDotMX19fSxwcm9wRml4OntcImZvclwiOlwiaHRtbEZvclwiLFwiY2xhc3NcIjpcImNsYXNzTmFtZVwifX0pLHkub3B0U2VsZWN0ZWR8fChTLnByb3BIb29rcy5zZWxlY3RlZD17Z2V0OmZ1bmN0aW9uKGUpe3ZhciB0PWUucGFyZW50Tm9kZTtyZXR1cm4gdCYmdC5wYXJlbnROb2RlJiZ0LnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCxudWxsfSxzZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5wYXJlbnROb2RlO3QmJih0LnNlbGVjdGVkSW5kZXgsdC5wYXJlbnROb2RlJiZ0LnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCl9fSksUy5lYWNoKFtcInRhYkluZGV4XCIsXCJyZWFkT25seVwiLFwibWF4TGVuZ3RoXCIsXCJjZWxsU3BhY2luZ1wiLFwiY2VsbFBhZGRpbmdcIixcInJvd1NwYW5cIixcImNvbFNwYW5cIixcInVzZU1hcFwiLFwiZnJhbWVCb3JkZXJcIixcImNvbnRlbnRFZGl0YWJsZVwiXSxmdW5jdGlvbigpe1MucHJvcEZpeFt0aGlzLnRvTG93ZXJDYXNlKCldPXRoaXN9KSxTLmZuLmV4dGVuZCh7YWRkQ2xhc3M6ZnVuY3Rpb24odCl7dmFyIGUsbixyLGksbyxhLHMsdT0wO2lmKG0odCkpcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihlKXtTKHRoaXMpLmFkZENsYXNzKHQuY2FsbCh0aGlzLGUsZ3QodGhpcykpKX0pO2lmKChlPXZ0KHQpKS5sZW5ndGgpd2hpbGUobj10aGlzW3UrK10paWYoaT1ndChuKSxyPTE9PT1uLm5vZGVUeXBlJiZcIiBcIitodChpKStcIiBcIil7YT0wO3doaWxlKG89ZVthKytdKXIuaW5kZXhPZihcIiBcIitvK1wiIFwiKTwwJiYocis9bytcIiBcIik7aSE9PShzPWh0KHIpKSYmbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLHMpfXJldHVybiB0aGlzfSxyZW1vdmVDbGFzczpmdW5jdGlvbih0KXt2YXIgZSxuLHIsaSxvLGEscyx1PTA7aWYobSh0KSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGUpe1ModGhpcykucmVtb3ZlQ2xhc3ModC5jYWxsKHRoaXMsZSxndCh0aGlzKSkpfSk7aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuYXR0cihcImNsYXNzXCIsXCJcIik7aWYoKGU9dnQodCkpLmxlbmd0aCl3aGlsZShuPXRoaXNbdSsrXSlpZihpPWd0KG4pLHI9MT09PW4ubm9kZVR5cGUmJlwiIFwiK2h0KGkpK1wiIFwiKXthPTA7d2hpbGUobz1lW2ErK10pd2hpbGUoLTE8ci5pbmRleE9mKFwiIFwiK28rXCIgXCIpKXI9ci5yZXBsYWNlKFwiIFwiK28rXCIgXCIsXCIgXCIpO2khPT0ocz1odChyKSkmJm4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixzKX1yZXR1cm4gdGhpc30sdG9nZ2xlQ2xhc3M6ZnVuY3Rpb24oaSx0KXt2YXIgbz10eXBlb2YgaSxhPVwic3RyaW5nXCI9PT1vfHxBcnJheS5pc0FycmF5KGkpO3JldHVyblwiYm9vbGVhblwiPT10eXBlb2YgdCYmYT90P3RoaXMuYWRkQ2xhc3MoaSk6dGhpcy5yZW1vdmVDbGFzcyhpKTptKGkpP3RoaXMuZWFjaChmdW5jdGlvbihlKXtTKHRoaXMpLnRvZ2dsZUNsYXNzKGkuY2FsbCh0aGlzLGUsZ3QodGhpcyksdCksdCl9KTp0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgZSx0LG4scjtpZihhKXt0PTAsbj1TKHRoaXMpLHI9dnQoaSk7d2hpbGUoZT1yW3QrK10pbi5oYXNDbGFzcyhlKT9uLnJlbW92ZUNsYXNzKGUpOm4uYWRkQ2xhc3MoZSl9ZWxzZSB2b2lkIDAhPT1pJiZcImJvb2xlYW5cIiE9PW98fCgoZT1ndCh0aGlzKSkmJlkuc2V0KHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIsZSksdGhpcy5zZXRBdHRyaWJ1dGUmJnRoaXMuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixlfHwhMT09PWk/XCJcIjpZLmdldCh0aGlzLFwiX19jbGFzc05hbWVfX1wiKXx8XCJcIikpfSl9LGhhc0NsYXNzOmZ1bmN0aW9uKGUpe3ZhciB0LG4scj0wO3Q9XCIgXCIrZStcIiBcIjt3aGlsZShuPXRoaXNbcisrXSlpZigxPT09bi5ub2RlVHlwZSYmLTE8KFwiIFwiK2h0KGd0KG4pKStcIiBcIikuaW5kZXhPZih0KSlyZXR1cm4hMDtyZXR1cm4hMX19KTt2YXIgeXQ9L1xcci9nO1MuZm4uZXh0ZW5kKHt2YWw6ZnVuY3Rpb24obil7dmFyIHIsZSxpLHQ9dGhpc1swXTtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8oaT1tKG4pLHRoaXMuZWFjaChmdW5jdGlvbihlKXt2YXIgdDsxPT09dGhpcy5ub2RlVHlwZSYmKG51bGw9PSh0PWk/bi5jYWxsKHRoaXMsZSxTKHRoaXMpLnZhbCgpKTpuKT90PVwiXCI6XCJudW1iZXJcIj09dHlwZW9mIHQ/dCs9XCJcIjpBcnJheS5pc0FycmF5KHQpJiYodD1TLm1hcCh0LGZ1bmN0aW9uKGUpe3JldHVybiBudWxsPT1lP1wiXCI6ZStcIlwifSkpLChyPVMudmFsSG9va3NbdGhpcy50eXBlXXx8Uy52YWxIb29rc1t0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldKSYmXCJzZXRcImluIHImJnZvaWQgMCE9PXIuc2V0KHRoaXMsdCxcInZhbHVlXCIpfHwodGhpcy52YWx1ZT10KSl9KSk6dD8ocj1TLnZhbEhvb2tzW3QudHlwZV18fFMudmFsSG9va3NbdC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSkmJlwiZ2V0XCJpbiByJiZ2b2lkIDAhPT0oZT1yLmdldCh0LFwidmFsdWVcIikpP2U6XCJzdHJpbmdcIj09dHlwZW9mKGU9dC52YWx1ZSk/ZS5yZXBsYWNlKHl0LFwiXCIpOm51bGw9PWU/XCJcIjplOnZvaWQgMH19KSxTLmV4dGVuZCh7dmFsSG9va3M6e29wdGlvbjp7Z2V0OmZ1bmN0aW9uKGUpe3ZhciB0PVMuZmluZC5hdHRyKGUsXCJ2YWx1ZVwiKTtyZXR1cm4gbnVsbCE9dD90Omh0KFMudGV4dChlKSl9fSxzZWxlY3Q6e2dldDpmdW5jdGlvbihlKXt2YXIgdCxuLHIsaT1lLm9wdGlvbnMsbz1lLnNlbGVjdGVkSW5kZXgsYT1cInNlbGVjdC1vbmVcIj09PWUudHlwZSxzPWE/bnVsbDpbXSx1PWE/bysxOmkubGVuZ3RoO2ZvcihyPW88MD91OmE/bzowO3I8dTtyKyspaWYoKChuPWlbcl0pLnNlbGVjdGVkfHxyPT09bykmJiFuLmRpc2FibGVkJiYoIW4ucGFyZW50Tm9kZS5kaXNhYmxlZHx8IUEobi5wYXJlbnROb2RlLFwib3B0Z3JvdXBcIikpKXtpZih0PVMobikudmFsKCksYSlyZXR1cm4gdDtzLnB1c2godCl9cmV0dXJuIHN9LHNldDpmdW5jdGlvbihlLHQpe3ZhciBuLHIsaT1lLm9wdGlvbnMsbz1TLm1ha2VBcnJheSh0KSxhPWkubGVuZ3RoO3doaWxlKGEtLSkoKHI9aVthXSkuc2VsZWN0ZWQ9LTE8Uy5pbkFycmF5KFMudmFsSG9va3Mub3B0aW9uLmdldChyKSxvKSkmJihuPSEwKTtyZXR1cm4gbnx8KGUuc2VsZWN0ZWRJbmRleD0tMSksb319fX0pLFMuZWFjaChbXCJyYWRpb1wiLFwiY2hlY2tib3hcIl0sZnVuY3Rpb24oKXtTLnZhbEhvb2tzW3RoaXNdPXtzZXQ6ZnVuY3Rpb24oZSx0KXtpZihBcnJheS5pc0FycmF5KHQpKXJldHVybiBlLmNoZWNrZWQ9LTE8Uy5pbkFycmF5KFMoZSkudmFsKCksdCl9fSx5LmNoZWNrT258fChTLnZhbEhvb2tzW3RoaXNdLmdldD1mdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09PWUuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik/XCJvblwiOmUudmFsdWV9KX0pLHkuZm9jdXNpbj1cIm9uZm9jdXNpblwiaW4gQzt2YXIgbXQ9L14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvLHh0PWZ1bmN0aW9uKGUpe2Uuc3RvcFByb3BhZ2F0aW9uKCl9O1MuZXh0ZW5kKFMuZXZlbnQse3RyaWdnZXI6ZnVuY3Rpb24oZSx0LG4scil7dmFyIGksbyxhLHMsdSxsLGMsZixwPVtufHxFXSxkPXYuY2FsbChlLFwidHlwZVwiKT9lLnR5cGU6ZSxoPXYuY2FsbChlLFwibmFtZXNwYWNlXCIpP2UubmFtZXNwYWNlLnNwbGl0KFwiLlwiKTpbXTtpZihvPWY9YT1uPW58fEUsMyE9PW4ubm9kZVR5cGUmJjghPT1uLm5vZGVUeXBlJiYhbXQudGVzdChkK1MuZXZlbnQudHJpZ2dlcmVkKSYmKC0xPGQuaW5kZXhPZihcIi5cIikmJihkPShoPWQuc3BsaXQoXCIuXCIpKS5zaGlmdCgpLGguc29ydCgpKSx1PWQuaW5kZXhPZihcIjpcIik8MCYmXCJvblwiK2QsKGU9ZVtTLmV4cGFuZG9dP2U6bmV3IFMuRXZlbnQoZCxcIm9iamVjdFwiPT10eXBlb2YgZSYmZSkpLmlzVHJpZ2dlcj1yPzI6MyxlLm5hbWVzcGFjZT1oLmpvaW4oXCIuXCIpLGUucm5hbWVzcGFjZT1lLm5hbWVzcGFjZT9uZXcgUmVnRXhwKFwiKF58XFxcXC4pXCIraC5qb2luKFwiXFxcXC4oPzouKlxcXFwufClcIikrXCIoXFxcXC58JClcIik6bnVsbCxlLnJlc3VsdD12b2lkIDAsZS50YXJnZXR8fChlLnRhcmdldD1uKSx0PW51bGw9PXQ/W2VdOlMubWFrZUFycmF5KHQsW2VdKSxjPVMuZXZlbnQuc3BlY2lhbFtkXXx8e30scnx8IWMudHJpZ2dlcnx8ITEhPT1jLnRyaWdnZXIuYXBwbHkobix0KSkpe2lmKCFyJiYhYy5ub0J1YmJsZSYmIXgobikpe2ZvcihzPWMuZGVsZWdhdGVUeXBlfHxkLG10LnRlc3QocytkKXx8KG89by5wYXJlbnROb2RlKTtvO289by5wYXJlbnROb2RlKXAucHVzaChvKSxhPW87YT09PShuLm93bmVyRG9jdW1lbnR8fEUpJiZwLnB1c2goYS5kZWZhdWx0Vmlld3x8YS5wYXJlbnRXaW5kb3d8fEMpfWk9MDt3aGlsZSgobz1wW2krK10pJiYhZS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKWY9byxlLnR5cGU9MTxpP3M6Yy5iaW5kVHlwZXx8ZCwobD0oWS5nZXQobyxcImV2ZW50c1wiKXx8T2JqZWN0LmNyZWF0ZShudWxsKSlbZS50eXBlXSYmWS5nZXQobyxcImhhbmRsZVwiKSkmJmwuYXBwbHkobyx0KSwobD11JiZvW3VdKSYmbC5hcHBseSYmVihvKSYmKGUucmVzdWx0PWwuYXBwbHkobyx0KSwhMT09PWUucmVzdWx0JiZlLnByZXZlbnREZWZhdWx0KCkpO3JldHVybiBlLnR5cGU9ZCxyfHxlLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxjLl9kZWZhdWx0JiYhMSE9PWMuX2RlZmF1bHQuYXBwbHkocC5wb3AoKSx0KXx8IVYobil8fHUmJm0obltkXSkmJiF4KG4pJiYoKGE9blt1XSkmJihuW3VdPW51bGwpLFMuZXZlbnQudHJpZ2dlcmVkPWQsZS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpJiZmLmFkZEV2ZW50TGlzdGVuZXIoZCx4dCksbltkXSgpLGUuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSYmZi5yZW1vdmVFdmVudExpc3RlbmVyKGQseHQpLFMuZXZlbnQudHJpZ2dlcmVkPXZvaWQgMCxhJiYoblt1XT1hKSksZS5yZXN1bHR9fSxzaW11bGF0ZTpmdW5jdGlvbihlLHQsbil7dmFyIHI9Uy5leHRlbmQobmV3IFMuRXZlbnQsbix7dHlwZTplLGlzU2ltdWxhdGVkOiEwfSk7Uy5ldmVudC50cmlnZ2VyKHIsbnVsbCx0KX19KSxTLmZuLmV4dGVuZCh7dHJpZ2dlcjpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtTLmV2ZW50LnRyaWdnZXIoZSx0LHRoaXMpfSl9LHRyaWdnZXJIYW5kbGVyOmZ1bmN0aW9uKGUsdCl7dmFyIG49dGhpc1swXTtpZihuKXJldHVybiBTLmV2ZW50LnRyaWdnZXIoZSx0LG4sITApfX0pLHkuZm9jdXNpbnx8Uy5lYWNoKHtmb2N1czpcImZvY3VzaW5cIixibHVyOlwiZm9jdXNvdXRcIn0sZnVuY3Rpb24obixyKXt2YXIgaT1mdW5jdGlvbihlKXtTLmV2ZW50LnNpbXVsYXRlKHIsZS50YXJnZXQsUy5ldmVudC5maXgoZSkpfTtTLmV2ZW50LnNwZWNpYWxbcl09e3NldHVwOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5vd25lckRvY3VtZW50fHx0aGlzLmRvY3VtZW50fHx0aGlzLHQ9WS5hY2Nlc3MoZSxyKTt0fHxlLmFkZEV2ZW50TGlzdGVuZXIobixpLCEwKSxZLmFjY2VzcyhlLHIsKHR8fDApKzEpfSx0ZWFyZG93bjpmdW5jdGlvbigpe3ZhciBlPXRoaXMub3duZXJEb2N1bWVudHx8dGhpcy5kb2N1bWVudHx8dGhpcyx0PVkuYWNjZXNzKGUsciktMTt0P1kuYWNjZXNzKGUscix0KTooZS5yZW1vdmVFdmVudExpc3RlbmVyKG4saSwhMCksWS5yZW1vdmUoZSxyKSl9fX0pO3ZhciBidD1DLmxvY2F0aW9uLHd0PXtndWlkOkRhdGUubm93KCl9LFR0PS9cXD8vO1MucGFyc2VYTUw9ZnVuY3Rpb24oZSl7dmFyIHQsbjtpZighZXx8XCJzdHJpbmdcIiE9dHlwZW9mIGUpcmV0dXJuIG51bGw7dHJ5e3Q9KG5ldyBDLkRPTVBhcnNlcikucGFyc2VGcm9tU3RyaW5nKGUsXCJ0ZXh0L3htbFwiKX1jYXRjaChlKXt9cmV0dXJuIG49dCYmdC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhcnNlcmVycm9yXCIpWzBdLHQmJiFufHxTLmVycm9yKFwiSW52YWxpZCBYTUw6IFwiKyhuP1MubWFwKG4uY2hpbGROb2RlcyxmdW5jdGlvbihlKXtyZXR1cm4gZS50ZXh0Q29udGVudH0pLmpvaW4oXCJcXG5cIik6ZSkpLHR9O3ZhciBDdD0vXFxbXFxdJC8sRXQ9L1xccj9cXG4vZyxTdD0vXig/OnN1Ym1pdHxidXR0b258aW1hZ2V8cmVzZXR8ZmlsZSkkL2ksa3Q9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8a2V5Z2VuKS9pO2Z1bmN0aW9uIEF0KG4sZSxyLGkpe3ZhciB0O2lmKEFycmF5LmlzQXJyYXkoZSkpUy5lYWNoKGUsZnVuY3Rpb24oZSx0KXtyfHxDdC50ZXN0KG4pP2kobix0KTpBdChuK1wiW1wiKyhcIm9iamVjdFwiPT10eXBlb2YgdCYmbnVsbCE9dD9lOlwiXCIpK1wiXVwiLHQscixpKX0pO2Vsc2UgaWYocnx8XCJvYmplY3RcIiE9PXcoZSkpaShuLGUpO2Vsc2UgZm9yKHQgaW4gZSlBdChuK1wiW1wiK3QrXCJdXCIsZVt0XSxyLGkpfVMucGFyYW09ZnVuY3Rpb24oZSx0KXt2YXIgbixyPVtdLGk9ZnVuY3Rpb24oZSx0KXt2YXIgbj1tKHQpP3QoKTp0O3Jbci5sZW5ndGhdPWVuY29kZVVSSUNvbXBvbmVudChlKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQobnVsbD09bj9cIlwiOm4pfTtpZihudWxsPT1lKXJldHVyblwiXCI7aWYoQXJyYXkuaXNBcnJheShlKXx8ZS5qcXVlcnkmJiFTLmlzUGxhaW5PYmplY3QoZSkpUy5lYWNoKGUsZnVuY3Rpb24oKXtpKHRoaXMubmFtZSx0aGlzLnZhbHVlKX0pO2Vsc2UgZm9yKG4gaW4gZSlBdChuLGVbbl0sdCxpKTtyZXR1cm4gci5qb2luKFwiJlwiKX0sUy5mbi5leHRlbmQoe3NlcmlhbGl6ZTpmdW5jdGlvbigpe3JldHVybiBTLnBhcmFtKHRoaXMuc2VyaWFsaXplQXJyYXkoKSl9LHNlcmlhbGl6ZUFycmF5OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7dmFyIGU9Uy5wcm9wKHRoaXMsXCJlbGVtZW50c1wiKTtyZXR1cm4gZT9TLm1ha2VBcnJheShlKTp0aGlzfSkuZmlsdGVyKGZ1bmN0aW9uKCl7dmFyIGU9dGhpcy50eXBlO3JldHVybiB0aGlzLm5hbWUmJiFTKHRoaXMpLmlzKFwiOmRpc2FibGVkXCIpJiZrdC50ZXN0KHRoaXMubm9kZU5hbWUpJiYhU3QudGVzdChlKSYmKHRoaXMuY2hlY2tlZHx8IXBlLnRlc3QoZSkpfSkubWFwKGZ1bmN0aW9uKGUsdCl7dmFyIG49Uyh0aGlzKS52YWwoKTtyZXR1cm4gbnVsbD09bj9udWxsOkFycmF5LmlzQXJyYXkobik/Uy5tYXAobixmdW5jdGlvbihlKXtyZXR1cm57bmFtZTp0Lm5hbWUsdmFsdWU6ZS5yZXBsYWNlKEV0LFwiXFxyXFxuXCIpfX0pOntuYW1lOnQubmFtZSx2YWx1ZTpuLnJlcGxhY2UoRXQsXCJcXHJcXG5cIil9fSkuZ2V0KCl9fSk7dmFyIE50PS8lMjAvZyxqdD0vIy4qJC8sRHQ9LyhbPyZdKV89W14mXSovLHF0PS9eKC4qPyk6WyBcXHRdKihbXlxcclxcbl0qKSQvZ20sTHQ9L14oPzpHRVR8SEVBRCkkLyxIdD0vXlxcL1xcLy8sT3Q9e30sUHQ9e30sUnQ9XCIqL1wiLmNvbmNhdChcIipcIiksTXQ9RS5jcmVhdGVFbGVtZW50KFwiYVwiKTtmdW5jdGlvbiBJdChvKXtyZXR1cm4gZnVuY3Rpb24oZSx0KXtcInN0cmluZ1wiIT10eXBlb2YgZSYmKHQ9ZSxlPVwiKlwiKTt2YXIgbixyPTAsaT1lLnRvTG93ZXJDYXNlKCkubWF0Y2goUCl8fFtdO2lmKG0odCkpd2hpbGUobj1pW3IrK10pXCIrXCI9PT1uWzBdPyhuPW4uc2xpY2UoMSl8fFwiKlwiLChvW25dPW9bbl18fFtdKS51bnNoaWZ0KHQpKToob1tuXT1vW25dfHxbXSkucHVzaCh0KX19ZnVuY3Rpb24gV3QodCxpLG8sYSl7dmFyIHM9e30sdT10PT09UHQ7ZnVuY3Rpb24gbChlKXt2YXIgcjtyZXR1cm4gc1tlXT0hMCxTLmVhY2godFtlXXx8W10sZnVuY3Rpb24oZSx0KXt2YXIgbj10KGksbyxhKTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2Ygbnx8dXx8c1tuXT91PyEocj1uKTp2b2lkIDA6KGkuZGF0YVR5cGVzLnVuc2hpZnQobiksbChuKSwhMSl9KSxyfXJldHVybiBsKGkuZGF0YVR5cGVzWzBdKXx8IXNbXCIqXCJdJiZsKFwiKlwiKX1mdW5jdGlvbiBGdChlLHQpe3ZhciBuLHIsaT1TLmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9uc3x8e307Zm9yKG4gaW4gdCl2b2lkIDAhPT10W25dJiYoKGlbbl0/ZTpyfHwocj17fSkpW25dPXRbbl0pO3JldHVybiByJiZTLmV4dGVuZCghMCxlLHIpLGV9TXQuaHJlZj1idC5ocmVmLFMuZXh0ZW5kKHthY3RpdmU6MCxsYXN0TW9kaWZpZWQ6e30sZXRhZzp7fSxhamF4U2V0dGluZ3M6e3VybDpidC5ocmVmLHR5cGU6XCJHRVRcIixpc0xvY2FsOi9eKD86YWJvdXR8YXBwfGFwcC1zdG9yYWdlfC4rLWV4dGVuc2lvbnxmaWxlfHJlc3x3aWRnZXQpOiQvLnRlc3QoYnQucHJvdG9jb2wpLGdsb2JhbDohMCxwcm9jZXNzRGF0YTohMCxhc3luYzohMCxjb250ZW50VHlwZTpcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLGFjY2VwdHM6e1wiKlwiOlJ0LHRleHQ6XCJ0ZXh0L3BsYWluXCIsaHRtbDpcInRleHQvaHRtbFwiLHhtbDpcImFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWxcIixqc29uOlwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0XCJ9LGNvbnRlbnRzOnt4bWw6L1xcYnhtbFxcYi8saHRtbDovXFxiaHRtbC8sanNvbjovXFxianNvblxcYi99LHJlc3BvbnNlRmllbGRzOnt4bWw6XCJyZXNwb25zZVhNTFwiLHRleHQ6XCJyZXNwb25zZVRleHRcIixqc29uOlwicmVzcG9uc2VKU09OXCJ9LGNvbnZlcnRlcnM6e1wiKiB0ZXh0XCI6U3RyaW5nLFwidGV4dCBodG1sXCI6ITAsXCJ0ZXh0IGpzb25cIjpKU09OLnBhcnNlLFwidGV4dCB4bWxcIjpTLnBhcnNlWE1MfSxmbGF0T3B0aW9uczp7dXJsOiEwLGNvbnRleHQ6ITB9fSxhamF4U2V0dXA6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdD9GdChGdChlLFMuYWpheFNldHRpbmdzKSx0KTpGdChTLmFqYXhTZXR0aW5ncyxlKX0sYWpheFByZWZpbHRlcjpJdChPdCksYWpheFRyYW5zcG9ydDpJdChQdCksYWpheDpmdW5jdGlvbihlLHQpe1wib2JqZWN0XCI9PXR5cGVvZiBlJiYodD1lLGU9dm9pZCAwKSx0PXR8fHt9O3ZhciBjLGYscCxuLGQscixoLGcsaSxvLHY9Uy5hamF4U2V0dXAoe30sdCkseT12LmNvbnRleHR8fHYsbT12LmNvbnRleHQmJih5Lm5vZGVUeXBlfHx5LmpxdWVyeSk/Uyh5KTpTLmV2ZW50LHg9Uy5EZWZlcnJlZCgpLGI9Uy5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSx3PXYuc3RhdHVzQ29kZXx8e30sYT17fSxzPXt9LHU9XCJjYW5jZWxlZFwiLFQ9e3JlYWR5U3RhdGU6MCxnZXRSZXNwb25zZUhlYWRlcjpmdW5jdGlvbihlKXt2YXIgdDtpZihoKXtpZighbil7bj17fTt3aGlsZSh0PXF0LmV4ZWMocCkpblt0WzFdLnRvTG93ZXJDYXNlKCkrXCIgXCJdPShuW3RbMV0udG9Mb3dlckNhc2UoKStcIiBcIl18fFtdKS5jb25jYXQodFsyXSl9dD1uW2UudG9Mb3dlckNhc2UoKStcIiBcIl19cmV0dXJuIG51bGw9PXQ/bnVsbDp0LmpvaW4oXCIsIFwiKX0sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIGg/cDpudWxsfSxzZXRSZXF1ZXN0SGVhZGVyOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIG51bGw9PWgmJihlPXNbZS50b0xvd2VyQ2FzZSgpXT1zW2UudG9Mb3dlckNhc2UoKV18fGUsYVtlXT10KSx0aGlzfSxvdmVycmlkZU1pbWVUeXBlOmZ1bmN0aW9uKGUpe3JldHVybiBudWxsPT1oJiYodi5taW1lVHlwZT1lKSx0aGlzfSxzdGF0dXNDb2RlOmZ1bmN0aW9uKGUpe3ZhciB0O2lmKGUpaWYoaClULmFsd2F5cyhlW1Quc3RhdHVzXSk7ZWxzZSBmb3IodCBpbiBlKXdbdF09W3dbdF0sZVt0XV07cmV0dXJuIHRoaXN9LGFib3J0OmZ1bmN0aW9uKGUpe3ZhciB0PWV8fHU7cmV0dXJuIGMmJmMuYWJvcnQodCksbCgwLHQpLHRoaXN9fTtpZih4LnByb21pc2UoVCksdi51cmw9KChlfHx2LnVybHx8YnQuaHJlZikrXCJcIikucmVwbGFjZShIdCxidC5wcm90b2NvbCtcIi8vXCIpLHYudHlwZT10Lm1ldGhvZHx8dC50eXBlfHx2Lm1ldGhvZHx8di50eXBlLHYuZGF0YVR5cGVzPSh2LmRhdGFUeXBlfHxcIipcIikudG9Mb3dlckNhc2UoKS5tYXRjaChQKXx8W1wiXCJdLG51bGw9PXYuY3Jvc3NEb21haW4pe3I9RS5jcmVhdGVFbGVtZW50KFwiYVwiKTt0cnl7ci5ocmVmPXYudXJsLHIuaHJlZj1yLmhyZWYsdi5jcm9zc0RvbWFpbj1NdC5wcm90b2NvbCtcIi8vXCIrTXQuaG9zdCE9ci5wcm90b2NvbCtcIi8vXCIrci5ob3N0fWNhdGNoKGUpe3YuY3Jvc3NEb21haW49ITB9fWlmKHYuZGF0YSYmdi5wcm9jZXNzRGF0YSYmXCJzdHJpbmdcIiE9dHlwZW9mIHYuZGF0YSYmKHYuZGF0YT1TLnBhcmFtKHYuZGF0YSx2LnRyYWRpdGlvbmFsKSksV3QoT3Qsdix0LFQpLGgpcmV0dXJuIFQ7Zm9yKGkgaW4oZz1TLmV2ZW50JiZ2Lmdsb2JhbCkmJjA9PVMuYWN0aXZlKysmJlMuZXZlbnQudHJpZ2dlcihcImFqYXhTdGFydFwiKSx2LnR5cGU9di50eXBlLnRvVXBwZXJDYXNlKCksdi5oYXNDb250ZW50PSFMdC50ZXN0KHYudHlwZSksZj12LnVybC5yZXBsYWNlKGp0LFwiXCIpLHYuaGFzQ29udGVudD92LmRhdGEmJnYucHJvY2Vzc0RhdGEmJjA9PT0odi5jb250ZW50VHlwZXx8XCJcIikuaW5kZXhPZihcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKSYmKHYuZGF0YT12LmRhdGEucmVwbGFjZShOdCxcIitcIikpOihvPXYudXJsLnNsaWNlKGYubGVuZ3RoKSx2LmRhdGEmJih2LnByb2Nlc3NEYXRhfHxcInN0cmluZ1wiPT10eXBlb2Ygdi5kYXRhKSYmKGYrPShUdC50ZXN0KGYpP1wiJlwiOlwiP1wiKSt2LmRhdGEsZGVsZXRlIHYuZGF0YSksITE9PT12LmNhY2hlJiYoZj1mLnJlcGxhY2UoRHQsXCIkMVwiKSxvPShUdC50ZXN0KGYpP1wiJlwiOlwiP1wiKStcIl89XCIrd3QuZ3VpZCsrK28pLHYudXJsPWYrbyksdi5pZk1vZGlmaWVkJiYoUy5sYXN0TW9kaWZpZWRbZl0mJlQuc2V0UmVxdWVzdEhlYWRlcihcIklmLU1vZGlmaWVkLVNpbmNlXCIsUy5sYXN0TW9kaWZpZWRbZl0pLFMuZXRhZ1tmXSYmVC5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTm9uZS1NYXRjaFwiLFMuZXRhZ1tmXSkpLCh2LmRhdGEmJnYuaGFzQ29udGVudCYmITEhPT12LmNvbnRlbnRUeXBlfHx0LmNvbnRlbnRUeXBlKSYmVC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsdi5jb250ZW50VHlwZSksVC5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsdi5kYXRhVHlwZXNbMF0mJnYuYWNjZXB0c1t2LmRhdGFUeXBlc1swXV0/di5hY2NlcHRzW3YuZGF0YVR5cGVzWzBdXSsoXCIqXCIhPT12LmRhdGFUeXBlc1swXT9cIiwgXCIrUnQrXCI7IHE9MC4wMVwiOlwiXCIpOnYuYWNjZXB0c1tcIipcIl0pLHYuaGVhZGVycylULnNldFJlcXVlc3RIZWFkZXIoaSx2LmhlYWRlcnNbaV0pO2lmKHYuYmVmb3JlU2VuZCYmKCExPT09di5iZWZvcmVTZW5kLmNhbGwoeSxULHYpfHxoKSlyZXR1cm4gVC5hYm9ydCgpO2lmKHU9XCJhYm9ydFwiLGIuYWRkKHYuY29tcGxldGUpLFQuZG9uZSh2LnN1Y2Nlc3MpLFQuZmFpbCh2LmVycm9yKSxjPVd0KFB0LHYsdCxUKSl7aWYoVC5yZWFkeVN0YXRlPTEsZyYmbS50cmlnZ2VyKFwiYWpheFNlbmRcIixbVCx2XSksaClyZXR1cm4gVDt2LmFzeW5jJiYwPHYudGltZW91dCYmKGQ9Qy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7VC5hYm9ydChcInRpbWVvdXRcIil9LHYudGltZW91dCkpO3RyeXtoPSExLGMuc2VuZChhLGwpfWNhdGNoKGUpe2lmKGgpdGhyb3cgZTtsKC0xLGUpfX1lbHNlIGwoLTEsXCJObyBUcmFuc3BvcnRcIik7ZnVuY3Rpb24gbChlLHQsbixyKXt2YXIgaSxvLGEscyx1LGw9dDtofHwoaD0hMCxkJiZDLmNsZWFyVGltZW91dChkKSxjPXZvaWQgMCxwPXJ8fFwiXCIsVC5yZWFkeVN0YXRlPTA8ZT80OjAsaT0yMDA8PWUmJmU8MzAwfHwzMDQ9PT1lLG4mJihzPWZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpLG8sYSxzPWUuY29udGVudHMsdT1lLmRhdGFUeXBlczt3aGlsZShcIipcIj09PXVbMF0pdS5zaGlmdCgpLHZvaWQgMD09PXImJihyPWUubWltZVR5cGV8fHQuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO2lmKHIpZm9yKGkgaW4gcylpZihzW2ldJiZzW2ldLnRlc3Qocikpe3UudW5zaGlmdChpKTticmVha31pZih1WzBdaW4gbilvPXVbMF07ZWxzZXtmb3IoaSBpbiBuKXtpZighdVswXXx8ZS5jb252ZXJ0ZXJzW2krXCIgXCIrdVswXV0pe289aTticmVha31hfHwoYT1pKX1vPW98fGF9aWYobylyZXR1cm4gbyE9PXVbMF0mJnUudW5zaGlmdChvKSxuW29dfSh2LFQsbikpLCFpJiYtMTxTLmluQXJyYXkoXCJzY3JpcHRcIix2LmRhdGFUeXBlcykmJlMuaW5BcnJheShcImpzb25cIix2LmRhdGFUeXBlcyk8MCYmKHYuY29udmVydGVyc1tcInRleHQgc2NyaXB0XCJdPWZ1bmN0aW9uKCl7fSkscz1mdW5jdGlvbihlLHQsbixyKXt2YXIgaSxvLGEscyx1LGw9e30sYz1lLmRhdGFUeXBlcy5zbGljZSgpO2lmKGNbMV0pZm9yKGEgaW4gZS5jb252ZXJ0ZXJzKWxbYS50b0xvd2VyQ2FzZSgpXT1lLmNvbnZlcnRlcnNbYV07bz1jLnNoaWZ0KCk7d2hpbGUobylpZihlLnJlc3BvbnNlRmllbGRzW29dJiYobltlLnJlc3BvbnNlRmllbGRzW29dXT10KSwhdSYmciYmZS5kYXRhRmlsdGVyJiYodD1lLmRhdGFGaWx0ZXIodCxlLmRhdGFUeXBlKSksdT1vLG89Yy5zaGlmdCgpKWlmKFwiKlwiPT09bylvPXU7ZWxzZSBpZihcIipcIiE9PXUmJnUhPT1vKXtpZighKGE9bFt1K1wiIFwiK29dfHxsW1wiKiBcIitvXSkpZm9yKGkgaW4gbClpZigocz1pLnNwbGl0KFwiIFwiKSlbMV09PT1vJiYoYT1sW3UrXCIgXCIrc1swXV18fGxbXCIqIFwiK3NbMF1dKSl7ITA9PT1hP2E9bFtpXTohMCE9PWxbaV0mJihvPXNbMF0sYy51bnNoaWZ0KHNbMV0pKTticmVha31pZighMCE9PWEpaWYoYSYmZVtcInRocm93c1wiXSl0PWEodCk7ZWxzZSB0cnl7dD1hKHQpfWNhdGNoKGUpe3JldHVybntzdGF0ZTpcInBhcnNlcmVycm9yXCIsZXJyb3I6YT9lOlwiTm8gY29udmVyc2lvbiBmcm9tIFwiK3UrXCIgdG8gXCIrb319fXJldHVybntzdGF0ZTpcInN1Y2Nlc3NcIixkYXRhOnR9fSh2LHMsVCxpKSxpPyh2LmlmTW9kaWZpZWQmJigodT1ULmdldFJlc3BvbnNlSGVhZGVyKFwiTGFzdC1Nb2RpZmllZFwiKSkmJihTLmxhc3RNb2RpZmllZFtmXT11KSwodT1ULmdldFJlc3BvbnNlSGVhZGVyKFwiZXRhZ1wiKSkmJihTLmV0YWdbZl09dSkpLDIwND09PWV8fFwiSEVBRFwiPT09di50eXBlP2w9XCJub2NvbnRlbnRcIjozMDQ9PT1lP2w9XCJub3Rtb2RpZmllZFwiOihsPXMuc3RhdGUsbz1zLmRhdGEsaT0hKGE9cy5lcnJvcikpKTooYT1sLCFlJiZsfHwobD1cImVycm9yXCIsZTwwJiYoZT0wKSkpLFQuc3RhdHVzPWUsVC5zdGF0dXNUZXh0PSh0fHxsKStcIlwiLGk/eC5yZXNvbHZlV2l0aCh5LFtvLGwsVF0pOngucmVqZWN0V2l0aCh5LFtULGwsYV0pLFQuc3RhdHVzQ29kZSh3KSx3PXZvaWQgMCxnJiZtLnRyaWdnZXIoaT9cImFqYXhTdWNjZXNzXCI6XCJhamF4RXJyb3JcIixbVCx2LGk/bzphXSksYi5maXJlV2l0aCh5LFtULGxdKSxnJiYobS50cmlnZ2VyKFwiYWpheENvbXBsZXRlXCIsW1Qsdl0pLC0tUy5hY3RpdmV8fFMuZXZlbnQudHJpZ2dlcihcImFqYXhTdG9wXCIpKSl9cmV0dXJuIFR9LGdldEpTT046ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBTLmdldChlLHQsbixcImpzb25cIil9LGdldFNjcmlwdDpmdW5jdGlvbihlLHQpe3JldHVybiBTLmdldChlLHZvaWQgMCx0LFwic2NyaXB0XCIpfX0pLFMuZWFjaChbXCJnZXRcIixcInBvc3RcIl0sZnVuY3Rpb24oZSxpKXtTW2ldPWZ1bmN0aW9uKGUsdCxuLHIpe3JldHVybiBtKHQpJiYocj1yfHxuLG49dCx0PXZvaWQgMCksUy5hamF4KFMuZXh0ZW5kKHt1cmw6ZSx0eXBlOmksZGF0YVR5cGU6cixkYXRhOnQsc3VjY2VzczpufSxTLmlzUGxhaW5PYmplY3QoZSkmJmUpKX19KSxTLmFqYXhQcmVmaWx0ZXIoZnVuY3Rpb24oZSl7dmFyIHQ7Zm9yKHQgaW4gZS5oZWFkZXJzKVwiY29udGVudC10eXBlXCI9PT10LnRvTG93ZXJDYXNlKCkmJihlLmNvbnRlbnRUeXBlPWUuaGVhZGVyc1t0XXx8XCJcIil9KSxTLl9ldmFsVXJsPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gUy5hamF4KHt1cmw6ZSx0eXBlOlwiR0VUXCIsZGF0YVR5cGU6XCJzY3JpcHRcIixjYWNoZTohMCxhc3luYzohMSxnbG9iYWw6ITEsY29udmVydGVyczp7XCJ0ZXh0IHNjcmlwdFwiOmZ1bmN0aW9uKCl7fX0sZGF0YUZpbHRlcjpmdW5jdGlvbihlKXtTLmdsb2JhbEV2YWwoZSx0LG4pfX0pfSxTLmZuLmV4dGVuZCh7d3JhcEFsbDpmdW5jdGlvbihlKXt2YXIgdDtyZXR1cm4gdGhpc1swXSYmKG0oZSkmJihlPWUuY2FsbCh0aGlzWzBdKSksdD1TKGUsdGhpc1swXS5vd25lckRvY3VtZW50KS5lcSgwKS5jbG9uZSghMCksdGhpc1swXS5wYXJlbnROb2RlJiZ0Lmluc2VydEJlZm9yZSh0aGlzWzBdKSx0Lm1hcChmdW5jdGlvbigpe3ZhciBlPXRoaXM7d2hpbGUoZS5maXJzdEVsZW1lbnRDaGlsZCllPWUuZmlyc3RFbGVtZW50Q2hpbGQ7cmV0dXJuIGV9KS5hcHBlbmQodGhpcykpLHRoaXN9LHdyYXBJbm5lcjpmdW5jdGlvbihuKXtyZXR1cm4gbShuKT90aGlzLmVhY2goZnVuY3Rpb24oZSl7Uyh0aGlzKS53cmFwSW5uZXIobi5jYWxsKHRoaXMsZSkpfSk6dGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGU9Uyh0aGlzKSx0PWUuY29udGVudHMoKTt0Lmxlbmd0aD90LndyYXBBbGwobik6ZS5hcHBlbmQobil9KX0sd3JhcDpmdW5jdGlvbih0KXt2YXIgbj1tKHQpO3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oZSl7Uyh0aGlzKS53cmFwQWxsKG4/dC5jYWxsKHRoaXMsZSk6dCl9KX0sdW53cmFwOmZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnBhcmVudChlKS5ub3QoXCJib2R5XCIpLmVhY2goZnVuY3Rpb24oKXtTKHRoaXMpLnJlcGxhY2VXaXRoKHRoaXMuY2hpbGROb2Rlcyl9KSx0aGlzfX0pLFMuZXhwci5wc2V1ZG9zLmhpZGRlbj1mdW5jdGlvbihlKXtyZXR1cm4hUy5leHByLnBzZXVkb3MudmlzaWJsZShlKX0sUy5leHByLnBzZXVkb3MudmlzaWJsZT1mdW5jdGlvbihlKXtyZXR1cm4hIShlLm9mZnNldFdpZHRofHxlLm9mZnNldEhlaWdodHx8ZS5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCl9LFMuYWpheFNldHRpbmdzLnhocj1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbmV3IEMuWE1MSHR0cFJlcXVlc3R9Y2F0Y2goZSl7fX07dmFyIEJ0PXswOjIwMCwxMjIzOjIwNH0sJHQ9Uy5hamF4U2V0dGluZ3MueGhyKCk7eS5jb3JzPSEhJHQmJlwid2l0aENyZWRlbnRpYWxzXCJpbiAkdCx5LmFqYXg9JHQ9ISEkdCxTLmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24oaSl7dmFyIG8sYTtpZih5LmNvcnN8fCR0JiYhaS5jcm9zc0RvbWFpbilyZXR1cm57c2VuZDpmdW5jdGlvbihlLHQpe3ZhciBuLHI9aS54aHIoKTtpZihyLm9wZW4oaS50eXBlLGkudXJsLGkuYXN5bmMsaS51c2VybmFtZSxpLnBhc3N3b3JkKSxpLnhockZpZWxkcylmb3IobiBpbiBpLnhockZpZWxkcylyW25dPWkueGhyRmllbGRzW25dO2ZvcihuIGluIGkubWltZVR5cGUmJnIub3ZlcnJpZGVNaW1lVHlwZSYmci5vdmVycmlkZU1pbWVUeXBlKGkubWltZVR5cGUpLGkuY3Jvc3NEb21haW58fGVbXCJYLVJlcXVlc3RlZC1XaXRoXCJdfHwoZVtcIlgtUmVxdWVzdGVkLVdpdGhcIl09XCJYTUxIdHRwUmVxdWVzdFwiKSxlKXIuc2V0UmVxdWVzdEhlYWRlcihuLGVbbl0pO289ZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKCl7byYmKG89YT1yLm9ubG9hZD1yLm9uZXJyb3I9ci5vbmFib3J0PXIub250aW1lb3V0PXIub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsXCJhYm9ydFwiPT09ZT9yLmFib3J0KCk6XCJlcnJvclwiPT09ZT9cIm51bWJlclwiIT10eXBlb2Ygci5zdGF0dXM/dCgwLFwiZXJyb3JcIik6dChyLnN0YXR1cyxyLnN0YXR1c1RleHQpOnQoQnRbci5zdGF0dXNdfHxyLnN0YXR1cyxyLnN0YXR1c1RleHQsXCJ0ZXh0XCIhPT0oci5yZXNwb25zZVR5cGV8fFwidGV4dFwiKXx8XCJzdHJpbmdcIiE9dHlwZW9mIHIucmVzcG9uc2VUZXh0P3tiaW5hcnk6ci5yZXNwb25zZX06e3RleHQ6ci5yZXNwb25zZVRleHR9LHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpKX19LHIub25sb2FkPW8oKSxhPXIub25lcnJvcj1yLm9udGltZW91dD1vKFwiZXJyb3JcIiksdm9pZCAwIT09ci5vbmFib3J0P3Iub25hYm9ydD1hOnIub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7ND09PXIucmVhZHlTdGF0ZSYmQy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7byYmYSgpfSl9LG89byhcImFib3J0XCIpO3RyeXtyLnNlbmQoaS5oYXNDb250ZW50JiZpLmRhdGF8fG51bGwpfWNhdGNoKGUpe2lmKG8pdGhyb3cgZX19LGFib3J0OmZ1bmN0aW9uKCl7byYmbygpfX19KSxTLmFqYXhQcmVmaWx0ZXIoZnVuY3Rpb24oZSl7ZS5jcm9zc0RvbWFpbiYmKGUuY29udGVudHMuc2NyaXB0PSExKX0pLFMuYWpheFNldHVwKHthY2NlcHRzOntzY3JpcHQ6XCJ0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2VjbWFzY3JpcHQsIGFwcGxpY2F0aW9uL3gtZWNtYXNjcmlwdFwifSxjb250ZW50czp7c2NyaXB0Oi9cXGIoPzpqYXZhfGVjbWEpc2NyaXB0XFxiL30sY29udmVydGVyczp7XCJ0ZXh0IHNjcmlwdFwiOmZ1bmN0aW9uKGUpe3JldHVybiBTLmdsb2JhbEV2YWwoZSksZX19fSksUy5hamF4UHJlZmlsdGVyKFwic2NyaXB0XCIsZnVuY3Rpb24oZSl7dm9pZCAwPT09ZS5jYWNoZSYmKGUuY2FjaGU9ITEpLGUuY3Jvc3NEb21haW4mJihlLnR5cGU9XCJHRVRcIil9KSxTLmFqYXhUcmFuc3BvcnQoXCJzY3JpcHRcIixmdW5jdGlvbihuKXt2YXIgcixpO2lmKG4uY3Jvc3NEb21haW58fG4uc2NyaXB0QXR0cnMpcmV0dXJue3NlbmQ6ZnVuY3Rpb24oZSx0KXtyPVMoXCI8c2NyaXB0PlwiKS5hdHRyKG4uc2NyaXB0QXR0cnN8fHt9KS5wcm9wKHtjaGFyc2V0Om4uc2NyaXB0Q2hhcnNldCxzcmM6bi51cmx9KS5vbihcImxvYWQgZXJyb3JcIixpPWZ1bmN0aW9uKGUpe3IucmVtb3ZlKCksaT1udWxsLGUmJnQoXCJlcnJvclwiPT09ZS50eXBlPzQwNDoyMDAsZS50eXBlKX0pLEUuaGVhZC5hcHBlbmRDaGlsZChyWzBdKX0sYWJvcnQ6ZnVuY3Rpb24oKXtpJiZpKCl9fX0pO3ZhciBfdCx6dD1bXSxVdD0vKD0pXFw/KD89JnwkKXxcXD9cXD8vO1MuYWpheFNldHVwKHtqc29ucDpcImNhbGxiYWNrXCIsanNvbnBDYWxsYmFjazpmdW5jdGlvbigpe3ZhciBlPXp0LnBvcCgpfHxTLmV4cGFuZG8rXCJfXCIrd3QuZ3VpZCsrO3JldHVybiB0aGlzW2VdPSEwLGV9fSksUy5hamF4UHJlZmlsdGVyKFwianNvbiBqc29ucFwiLGZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpLG8sYT0hMSE9PWUuanNvbnAmJihVdC50ZXN0KGUudXJsKT9cInVybFwiOlwic3RyaW5nXCI9PXR5cGVvZiBlLmRhdGEmJjA9PT0oZS5jb250ZW50VHlwZXx8XCJcIikuaW5kZXhPZihcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKSYmVXQudGVzdChlLmRhdGEpJiZcImRhdGFcIik7aWYoYXx8XCJqc29ucFwiPT09ZS5kYXRhVHlwZXNbMF0pcmV0dXJuIHI9ZS5qc29ucENhbGxiYWNrPW0oZS5qc29ucENhbGxiYWNrKT9lLmpzb25wQ2FsbGJhY2soKTplLmpzb25wQ2FsbGJhY2ssYT9lW2FdPWVbYV0ucmVwbGFjZShVdCxcIiQxXCIrcik6ITEhPT1lLmpzb25wJiYoZS51cmwrPShUdC50ZXN0KGUudXJsKT9cIiZcIjpcIj9cIikrZS5qc29ucCtcIj1cIityKSxlLmNvbnZlcnRlcnNbXCJzY3JpcHQganNvblwiXT1mdW5jdGlvbigpe3JldHVybiBvfHxTLmVycm9yKHIrXCIgd2FzIG5vdCBjYWxsZWRcIiksb1swXX0sZS5kYXRhVHlwZXNbMF09XCJqc29uXCIsaT1DW3JdLENbcl09ZnVuY3Rpb24oKXtvPWFyZ3VtZW50c30sbi5hbHdheXMoZnVuY3Rpb24oKXt2b2lkIDA9PT1pP1MoQykucmVtb3ZlUHJvcChyKTpDW3JdPWksZVtyXSYmKGUuanNvbnBDYWxsYmFjaz10Lmpzb25wQ2FsbGJhY2ssenQucHVzaChyKSksbyYmbShpKSYmaShvWzBdKSxvPWk9dm9pZCAwfSksXCJzY3JpcHRcIn0pLHkuY3JlYXRlSFRNTERvY3VtZW50PSgoX3Q9RS5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoXCJcIikuYm9keSkuaW5uZXJIVE1MPVwiPGZvcm0+PC9mb3JtPjxmb3JtPjwvZm9ybT5cIiwyPT09X3QuY2hpbGROb2Rlcy5sZW5ndGgpLFMucGFyc2VIVE1MPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgZT9bXTooXCJib29sZWFuXCI9PXR5cGVvZiB0JiYobj10LHQ9ITEpLHR8fCh5LmNyZWF0ZUhUTUxEb2N1bWVudD8oKHI9KHQ9RS5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoXCJcIikpLmNyZWF0ZUVsZW1lbnQoXCJiYXNlXCIpKS5ocmVmPUUubG9jYXRpb24uaHJlZix0LmhlYWQuYXBwZW5kQ2hpbGQocikpOnQ9RSksbz0hbiYmW10sKGk9Ti5leGVjKGUpKT9bdC5jcmVhdGVFbGVtZW50KGlbMV0pXTooaT14ZShbZV0sdCxvKSxvJiZvLmxlbmd0aCYmUyhvKS5yZW1vdmUoKSxTLm1lcmdlKFtdLGkuY2hpbGROb2RlcykpKTt2YXIgcixpLG99LFMuZm4ubG9hZD1mdW5jdGlvbihlLHQsbil7dmFyIHIsaSxvLGE9dGhpcyxzPWUuaW5kZXhPZihcIiBcIik7cmV0dXJuLTE8cyYmKHI9aHQoZS5zbGljZShzKSksZT1lLnNsaWNlKDAscykpLG0odCk/KG49dCx0PXZvaWQgMCk6dCYmXCJvYmplY3RcIj09dHlwZW9mIHQmJihpPVwiUE9TVFwiKSwwPGEubGVuZ3RoJiZTLmFqYXgoe3VybDplLHR5cGU6aXx8XCJHRVRcIixkYXRhVHlwZTpcImh0bWxcIixkYXRhOnR9KS5kb25lKGZ1bmN0aW9uKGUpe289YXJndW1lbnRzLGEuaHRtbChyP1MoXCI8ZGl2PlwiKS5hcHBlbmQoUy5wYXJzZUhUTUwoZSkpLmZpbmQocik6ZSl9KS5hbHdheXMobiYmZnVuY3Rpb24oZSx0KXthLmVhY2goZnVuY3Rpb24oKXtuLmFwcGx5KHRoaXMsb3x8W2UucmVzcG9uc2VUZXh0LHQsZV0pfSl9KSx0aGlzfSxTLmV4cHIucHNldWRvcy5hbmltYXRlZD1mdW5jdGlvbih0KXtyZXR1cm4gUy5ncmVwKFMudGltZXJzLGZ1bmN0aW9uKGUpe3JldHVybiB0PT09ZS5lbGVtfSkubGVuZ3RofSxTLm9mZnNldD17c2V0T2Zmc2V0OmZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpLG8sYSxzLHUsbD1TLmNzcyhlLFwicG9zaXRpb25cIiksYz1TKGUpLGY9e307XCJzdGF0aWNcIj09PWwmJihlLnN0eWxlLnBvc2l0aW9uPVwicmVsYXRpdmVcIikscz1jLm9mZnNldCgpLG89Uy5jc3MoZSxcInRvcFwiKSx1PVMuY3NzKGUsXCJsZWZ0XCIpLChcImFic29sdXRlXCI9PT1sfHxcImZpeGVkXCI9PT1sKSYmLTE8KG8rdSkuaW5kZXhPZihcImF1dG9cIik/KGE9KHI9Yy5wb3NpdGlvbigpKS50b3AsaT1yLmxlZnQpOihhPXBhcnNlRmxvYXQobyl8fDAsaT1wYXJzZUZsb2F0KHUpfHwwKSxtKHQpJiYodD10LmNhbGwoZSxuLFMuZXh0ZW5kKHt9LHMpKSksbnVsbCE9dC50b3AmJihmLnRvcD10LnRvcC1zLnRvcCthKSxudWxsIT10LmxlZnQmJihmLmxlZnQ9dC5sZWZ0LXMubGVmdCtpKSxcInVzaW5nXCJpbiB0P3QudXNpbmcuY2FsbChlLGYpOmMuY3NzKGYpfX0sUy5mbi5leHRlbmQoe29mZnNldDpmdW5jdGlvbih0KXtpZihhcmd1bWVudHMubGVuZ3RoKXJldHVybiB2b2lkIDA9PT10P3RoaXM6dGhpcy5lYWNoKGZ1bmN0aW9uKGUpe1Mub2Zmc2V0LnNldE9mZnNldCh0aGlzLHQsZSl9KTt2YXIgZSxuLHI9dGhpc1swXTtyZXR1cm4gcj9yLmdldENsaWVudFJlY3RzKCkubGVuZ3RoPyhlPXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksbj1yLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcse3RvcDplLnRvcCtuLnBhZ2VZT2Zmc2V0LGxlZnQ6ZS5sZWZ0K24ucGFnZVhPZmZzZXR9KTp7dG9wOjAsbGVmdDowfTp2b2lkIDB9LHBvc2l0aW9uOmZ1bmN0aW9uKCl7aWYodGhpc1swXSl7dmFyIGUsdCxuLHI9dGhpc1swXSxpPXt0b3A6MCxsZWZ0OjB9O2lmKFwiZml4ZWRcIj09PVMuY3NzKHIsXCJwb3NpdGlvblwiKSl0PXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7ZWxzZXt0PXRoaXMub2Zmc2V0KCksbj1yLm93bmVyRG9jdW1lbnQsZT1yLm9mZnNldFBhcmVudHx8bi5kb2N1bWVudEVsZW1lbnQ7d2hpbGUoZSYmKGU9PT1uLmJvZHl8fGU9PT1uLmRvY3VtZW50RWxlbWVudCkmJlwic3RhdGljXCI9PT1TLmNzcyhlLFwicG9zaXRpb25cIikpZT1lLnBhcmVudE5vZGU7ZSYmZSE9PXImJjE9PT1lLm5vZGVUeXBlJiYoKGk9UyhlKS5vZmZzZXQoKSkudG9wKz1TLmNzcyhlLFwiYm9yZGVyVG9wV2lkdGhcIiwhMCksaS5sZWZ0Kz1TLmNzcyhlLFwiYm9yZGVyTGVmdFdpZHRoXCIsITApKX1yZXR1cm57dG9wOnQudG9wLWkudG9wLVMuY3NzKHIsXCJtYXJnaW5Ub3BcIiwhMCksbGVmdDp0LmxlZnQtaS5sZWZ0LVMuY3NzKHIsXCJtYXJnaW5MZWZ0XCIsITApfX19LG9mZnNldFBhcmVudDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hcChmdW5jdGlvbigpe3ZhciBlPXRoaXMub2Zmc2V0UGFyZW50O3doaWxlKGUmJlwic3RhdGljXCI9PT1TLmNzcyhlLFwicG9zaXRpb25cIikpZT1lLm9mZnNldFBhcmVudDtyZXR1cm4gZXx8cmV9KX19KSxTLmVhY2goe3Njcm9sbExlZnQ6XCJwYWdlWE9mZnNldFwiLHNjcm9sbFRvcDpcInBhZ2VZT2Zmc2V0XCJ9LGZ1bmN0aW9uKHQsaSl7dmFyIG89XCJwYWdlWU9mZnNldFwiPT09aTtTLmZuW3RdPWZ1bmN0aW9uKGUpe3JldHVybiAkKHRoaXMsZnVuY3Rpb24oZSx0LG4pe3ZhciByO2lmKHgoZSk/cj1lOjk9PT1lLm5vZGVUeXBlJiYocj1lLmRlZmF1bHRWaWV3KSx2b2lkIDA9PT1uKXJldHVybiByP3JbaV06ZVt0XTtyP3Iuc2Nyb2xsVG8obz9yLnBhZ2VYT2Zmc2V0Om4sbz9uOnIucGFnZVlPZmZzZXQpOmVbdF09bn0sdCxlLGFyZ3VtZW50cy5sZW5ndGgpfX0pLFMuZWFjaChbXCJ0b3BcIixcImxlZnRcIl0sZnVuY3Rpb24oZSxuKXtTLmNzc0hvb2tzW25dPUZlKHkucGl4ZWxQb3NpdGlvbixmdW5jdGlvbihlLHQpe2lmKHQpcmV0dXJuIHQ9V2UoZSxuKSxQZS50ZXN0KHQpP1MoZSkucG9zaXRpb24oKVtuXStcInB4XCI6dH0pfSksUy5lYWNoKHtIZWlnaHQ6XCJoZWlnaHRcIixXaWR0aDpcIndpZHRoXCJ9LGZ1bmN0aW9uKGEscyl7Uy5lYWNoKHtwYWRkaW5nOlwiaW5uZXJcIithLGNvbnRlbnQ6cyxcIlwiOlwib3V0ZXJcIithfSxmdW5jdGlvbihyLG8pe1MuZm5bb109ZnVuY3Rpb24oZSx0KXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoJiYocnx8XCJib29sZWFuXCIhPXR5cGVvZiBlKSxpPXJ8fCghMD09PWV8fCEwPT09dD9cIm1hcmdpblwiOlwiYm9yZGVyXCIpO3JldHVybiAkKHRoaXMsZnVuY3Rpb24oZSx0LG4pe3ZhciByO3JldHVybiB4KGUpPzA9PT1vLmluZGV4T2YoXCJvdXRlclwiKT9lW1wiaW5uZXJcIithXTplLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtcImNsaWVudFwiK2FdOjk9PT1lLm5vZGVUeXBlPyhyPWUuZG9jdW1lbnRFbGVtZW50LE1hdGgubWF4KGUuYm9keVtcInNjcm9sbFwiK2FdLHJbXCJzY3JvbGxcIithXSxlLmJvZHlbXCJvZmZzZXRcIithXSxyW1wib2Zmc2V0XCIrYV0scltcImNsaWVudFwiK2FdKSk6dm9pZCAwPT09bj9TLmNzcyhlLHQsaSk6Uy5zdHlsZShlLHQsbixpKX0scyxuP2U6dm9pZCAwLG4pfX0pfSksUy5lYWNoKFtcImFqYXhTdGFydFwiLFwiYWpheFN0b3BcIixcImFqYXhDb21wbGV0ZVwiLFwiYWpheEVycm9yXCIsXCJhamF4U3VjY2Vzc1wiLFwiYWpheFNlbmRcIl0sZnVuY3Rpb24oZSx0KXtTLmZuW3RdPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLm9uKHQsZSl9fSksUy5mbi5leHRlbmQoe2JpbmQ6ZnVuY3Rpb24oZSx0LG4pe3JldHVybiB0aGlzLm9uKGUsbnVsbCx0LG4pfSx1bmJpbmQ6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5vZmYoZSxudWxsLHQpfSxkZWxlZ2F0ZTpmdW5jdGlvbihlLHQsbixyKXtyZXR1cm4gdGhpcy5vbih0LGUsbixyKX0sdW5kZWxlZ2F0ZTpmdW5jdGlvbihlLHQsbil7cmV0dXJuIDE9PT1hcmd1bWVudHMubGVuZ3RoP3RoaXMub2ZmKGUsXCIqKlwiKTp0aGlzLm9mZih0LGV8fFwiKipcIixuKX0saG92ZXI6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5tb3VzZWVudGVyKGUpLm1vdXNlbGVhdmUodHx8ZSl9fSksUy5lYWNoKFwiYmx1ciBmb2N1cyBmb2N1c2luIGZvY3Vzb3V0IHJlc2l6ZSBzY3JvbGwgY2xpY2sgZGJsY2xpY2sgbW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgY2hhbmdlIHNlbGVjdCBzdWJtaXQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBjb250ZXh0bWVudVwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihlLG4pe1MuZm5bbl09ZnVuY3Rpb24oZSx0KXtyZXR1cm4gMDxhcmd1bWVudHMubGVuZ3RoP3RoaXMub24obixudWxsLGUsdCk6dGhpcy50cmlnZ2VyKG4pfX0pO3ZhciBYdD0vXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2c7Uy5wcm94eT1mdW5jdGlvbihlLHQpe3ZhciBuLHIsaTtpZihcInN0cmluZ1wiPT10eXBlb2YgdCYmKG49ZVt0XSx0PWUsZT1uKSxtKGUpKXJldHVybiByPXMuY2FsbChhcmd1bWVudHMsMiksKGk9ZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0fHx0aGlzLHIuY29uY2F0KHMuY2FsbChhcmd1bWVudHMpKSl9KS5ndWlkPWUuZ3VpZD1lLmd1aWR8fFMuZ3VpZCsrLGl9LFMuaG9sZFJlYWR5PWZ1bmN0aW9uKGUpe2U/Uy5yZWFkeVdhaXQrKzpTLnJlYWR5KCEwKX0sUy5pc0FycmF5PUFycmF5LmlzQXJyYXksUy5wYXJzZUpTT049SlNPTi5wYXJzZSxTLm5vZGVOYW1lPUEsUy5pc0Z1bmN0aW9uPW0sUy5pc1dpbmRvdz14LFMuY2FtZWxDYXNlPVgsUy50eXBlPXcsUy5ub3c9RGF0ZS5ub3csUy5pc051bWVyaWM9ZnVuY3Rpb24oZSl7dmFyIHQ9Uy50eXBlKGUpO3JldHVybihcIm51bWJlclwiPT09dHx8XCJzdHJpbmdcIj09PXQpJiYhaXNOYU4oZS1wYXJzZUZsb2F0KGUpKX0sUy50cmltPWZ1bmN0aW9uKGUpe3JldHVybiBudWxsPT1lP1wiXCI6KGUrXCJcIikucmVwbGFjZShYdCxcIlwiKX0sXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kJiZkZWZpbmUoXCJqcXVlcnlcIixbXSxmdW5jdGlvbigpe3JldHVybiBTfSk7dmFyIFZ0PUMualF1ZXJ5LEd0PUMuJDtyZXR1cm4gUy5ub0NvbmZsaWN0PWZ1bmN0aW9uKGUpe3JldHVybiBDLiQ9PT1TJiYoQy4kPUd0KSxlJiZDLmpRdWVyeT09PVMmJihDLmpRdWVyeT1WdCksU30sXCJ1bmRlZmluZWRcIj09dHlwZW9mIGUmJihDLmpRdWVyeT1DLiQ9UyksU30pOyIsIlxuXG5cbi8qKlxuICogVVRNIHpvbmVzIGFyZSBncm91cGVkLCBhbmQgYXNzaWduZWQgdG8gb25lIG9mIGEgZ3JvdXAgb2YgNlxuICogc2V0cy5cbiAqXG4gKiB7aW50fSBAcHJpdmF0ZVxuICovXG52YXIgTlVNXzEwMEtfU0VUUyA9IDY7XG5cbi8qKlxuICogVGhlIGNvbHVtbiBsZXR0ZXJzIChmb3IgZWFzdGluZykgb2YgdGhlIGxvd2VyIGxlZnQgdmFsdWUsIHBlclxuICogc2V0LlxuICpcbiAqIHtzdHJpbmd9IEBwcml2YXRlXG4gKi9cbnZhciBTRVRfT1JJR0lOX0NPTFVNTl9MRVRURVJTID0gJ0FKU0FKUyc7XG5cbi8qKlxuICogVGhlIHJvdyBsZXR0ZXJzIChmb3Igbm9ydGhpbmcpIG9mIHRoZSBsb3dlciBsZWZ0IHZhbHVlLCBwZXJcbiAqIHNldC5cbiAqXG4gKiB7c3RyaW5nfSBAcHJpdmF0ZVxuICovXG52YXIgU0VUX09SSUdJTl9ST1dfTEVUVEVSUyA9ICdBRkFGQUYnO1xuXG52YXIgQSA9IDY1OyAvLyBBXG52YXIgSSA9IDczOyAvLyBJXG52YXIgTyA9IDc5OyAvLyBPXG52YXIgViA9IDg2OyAvLyBWXG52YXIgWiA9IDkwOyAvLyBaXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIHRvUG9pbnQ6IHRvUG9pbnRcbn07XG4vKipcbiAqIENvbnZlcnNpb24gb2YgbGF0L2xvbiB0byBNR1JTLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBsbCBPYmplY3QgbGl0ZXJhbCB3aXRoIGxhdCBhbmQgbG9uIHByb3BlcnRpZXMgb24gYVxuICogICAgIFdHUzg0IGVsbGlwc29pZC5cbiAqIEBwYXJhbSB7aW50fSBhY2N1cmFjeSBBY2N1cmFjeSBpbiBkaWdpdHMgKDUgZm9yIDEgbSwgNCBmb3IgMTAgbSwgMyBmb3JcbiAqICAgICAgMTAwIG0sIDIgZm9yIDEwMDAgbSBvciAxIGZvciAxMDAwMCBtKS4gT3B0aW9uYWwsIGRlZmF1bHQgaXMgNS5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIE1HUlMgc3RyaW5nIGZvciB0aGUgZ2l2ZW4gbG9jYXRpb24gYW5kIGFjY3VyYWN5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChsbCwgYWNjdXJhY3kpIHtcbiAgYWNjdXJhY3kgPSBhY2N1cmFjeSB8fCA1OyAvLyBkZWZhdWx0IGFjY3VyYWN5IDFtXG4gIHJldHVybiBlbmNvZGUoTEx0b1VUTSh7XG4gICAgbGF0OiBsbFsxXSxcbiAgICBsb246IGxsWzBdXG4gIH0pLCBhY2N1cmFjeSk7XG59O1xuXG4vKipcbiAqIENvbnZlcnNpb24gb2YgTUdSUyB0byBsYXQvbG9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZ3JzIE1HUlMgc3RyaW5nLlxuICogQHJldHVybiB7YXJyYXl9IEFuIGFycmF5IHdpdGggbGVmdCAobG9uZ2l0dWRlKSwgYm90dG9tIChsYXRpdHVkZSksIHJpZ2h0XG4gKiAgICAgKGxvbmdpdHVkZSkgYW5kIHRvcCAobGF0aXR1ZGUpIHZhbHVlcyBpbiBXR1M4NCwgcmVwcmVzZW50aW5nIHRoZVxuICogICAgIGJvdW5kaW5nIGJveCBmb3IgdGhlIHByb3ZpZGVkIE1HUlMgcmVmZXJlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShtZ3JzKSB7XG4gIHZhciBiYm94ID0gVVRNdG9MTChkZWNvZGUobWdycy50b1VwcGVyQ2FzZSgpKSk7XG4gIGlmIChiYm94LmxhdCAmJiBiYm94Lmxvbikge1xuICAgIHJldHVybiBbYmJveC5sb24sIGJib3gubGF0LCBiYm94LmxvbiwgYmJveC5sYXRdO1xuICB9XG4gIHJldHVybiBbYmJveC5sZWZ0LCBiYm94LmJvdHRvbSwgYmJveC5yaWdodCwgYmJveC50b3BdO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvUG9pbnQobWdycykge1xuICB2YXIgYmJveCA9IFVUTXRvTEwoZGVjb2RlKG1ncnMudG9VcHBlckNhc2UoKSkpO1xuICBpZiAoYmJveC5sYXQgJiYgYmJveC5sb24pIHtcbiAgICByZXR1cm4gW2Jib3gubG9uLCBiYm94LmxhdF07XG4gIH1cbiAgcmV0dXJuIFsoYmJveC5sZWZ0ICsgYmJveC5yaWdodCkgLyAyLCAoYmJveC50b3AgKyBiYm94LmJvdHRvbSkgLyAyXTtcbn07XG4vKipcbiAqIENvbnZlcnNpb24gZnJvbSBkZWdyZWVzIHRvIHJhZGlhbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWcgdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBhbmdsZSBpbiByYWRpYW5zLlxuICovXG5mdW5jdGlvbiBkZWdUb1JhZChkZWcpIHtcbiAgcmV0dXJuIChkZWcgKiAoTWF0aC5QSSAvIDE4MC4wKSk7XG59XG5cbi8qKlxuICogQ29udmVyc2lvbiBmcm9tIHJhZGlhbnMgdG8gZGVncmVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAqIEByZXR1cm4ge251bWJlcn0gdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gKi9cbmZ1bmN0aW9uIHJhZFRvRGVnKHJhZCkge1xuICByZXR1cm4gKDE4MC4wICogKHJhZCAvIE1hdGguUEkpKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhIHNldCBvZiBMb25naXR1ZGUgYW5kIExhdGl0dWRlIGNvLW9yZGluYXRlcyB0byBVVE1cbiAqIHVzaW5nIHRoZSBXR1M4NCBlbGxpcHNvaWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBsbCBPYmplY3QgbGl0ZXJhbCB3aXRoIGxhdCBhbmQgbG9uIHByb3BlcnRpZXNcbiAqICAgICByZXByZXNlbnRpbmcgdGhlIFdHUzg0IGNvb3JkaW5hdGUgdG8gYmUgY29udmVydGVkLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgbGl0ZXJhbCBjb250YWluaW5nIHRoZSBVVE0gdmFsdWUgd2l0aCBlYXN0aW5nLFxuICogICAgIG5vcnRoaW5nLCB6b25lTnVtYmVyIGFuZCB6b25lTGV0dGVyIHByb3BlcnRpZXMsIGFuZCBhbiBvcHRpb25hbFxuICogICAgIGFjY3VyYWN5IHByb3BlcnR5IGluIGRpZ2l0cy4gUmV0dXJucyBudWxsIGlmIHRoZSBjb252ZXJzaW9uIGZhaWxlZC5cbiAqL1xuZnVuY3Rpb24gTEx0b1VUTShsbCkge1xuICB2YXIgTGF0ID0gbGwubGF0O1xuICB2YXIgTG9uZyA9IGxsLmxvbjtcbiAgdmFyIGEgPSA2Mzc4MTM3LjA7IC8vZWxsaXAucmFkaXVzO1xuICB2YXIgZWNjU3F1YXJlZCA9IDAuMDA2Njk0Mzg7IC8vZWxsaXAuZWNjc3E7XG4gIHZhciBrMCA9IDAuOTk5NjtcbiAgdmFyIExvbmdPcmlnaW47XG4gIHZhciBlY2NQcmltZVNxdWFyZWQ7XG4gIHZhciBOLCBULCBDLCBBLCBNO1xuICB2YXIgTGF0UmFkID0gZGVnVG9SYWQoTGF0KTtcbiAgdmFyIExvbmdSYWQgPSBkZWdUb1JhZChMb25nKTtcbiAgdmFyIExvbmdPcmlnaW5SYWQ7XG4gIHZhciBab25lTnVtYmVyO1xuICAvLyAoaW50KVxuICBab25lTnVtYmVyID0gTWF0aC5mbG9vcigoTG9uZyArIDE4MCkgLyA2KSArIDE7XG5cbiAgLy9NYWtlIHN1cmUgdGhlIGxvbmdpdHVkZSAxODAuMDAgaXMgaW4gWm9uZSA2MFxuICBpZiAoTG9uZyA9PT0gMTgwKSB7XG4gICAgWm9uZU51bWJlciA9IDYwO1xuICB9XG5cbiAgLy8gU3BlY2lhbCB6b25lIGZvciBOb3J3YXlcbiAgaWYgKExhdCA+PSA1Ni4wICYmIExhdCA8IDY0LjAgJiYgTG9uZyA+PSAzLjAgJiYgTG9uZyA8IDEyLjApIHtcbiAgICBab25lTnVtYmVyID0gMzI7XG4gIH1cblxuICAvLyBTcGVjaWFsIHpvbmVzIGZvciBTdmFsYmFyZFxuICBpZiAoTGF0ID49IDcyLjAgJiYgTGF0IDwgODQuMCkge1xuICAgIGlmIChMb25nID49IDAuMCAmJiBMb25nIDwgOS4wKSB7XG4gICAgICBab25lTnVtYmVyID0gMzE7XG4gICAgfVxuICAgIGVsc2UgaWYgKExvbmcgPj0gOS4wICYmIExvbmcgPCAyMS4wKSB7XG4gICAgICBab25lTnVtYmVyID0gMzM7XG4gICAgfVxuICAgIGVsc2UgaWYgKExvbmcgPj0gMjEuMCAmJiBMb25nIDwgMzMuMCkge1xuICAgICAgWm9uZU51bWJlciA9IDM1O1xuICAgIH1cbiAgICBlbHNlIGlmIChMb25nID49IDMzLjAgJiYgTG9uZyA8IDQyLjApIHtcbiAgICAgIFpvbmVOdW1iZXIgPSAzNztcbiAgICB9XG4gIH1cblxuICBMb25nT3JpZ2luID0gKFpvbmVOdW1iZXIgLSAxKSAqIDYgLSAxODAgKyAzOyAvLyszIHB1dHMgb3JpZ2luXG4gIC8vIGluIG1pZGRsZSBvZlxuICAvLyB6b25lXG4gIExvbmdPcmlnaW5SYWQgPSBkZWdUb1JhZChMb25nT3JpZ2luKTtcblxuICBlY2NQcmltZVNxdWFyZWQgPSAoZWNjU3F1YXJlZCkgLyAoMSAtIGVjY1NxdWFyZWQpO1xuXG4gIE4gPSBhIC8gTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkICogTWF0aC5zaW4oTGF0UmFkKSAqIE1hdGguc2luKExhdFJhZCkpO1xuICBUID0gTWF0aC50YW4oTGF0UmFkKSAqIE1hdGgudGFuKExhdFJhZCk7XG4gIEMgPSBlY2NQcmltZVNxdWFyZWQgKiBNYXRoLmNvcyhMYXRSYWQpICogTWF0aC5jb3MoTGF0UmFkKTtcbiAgQSA9IE1hdGguY29zKExhdFJhZCkgKiAoTG9uZ1JhZCAtIExvbmdPcmlnaW5SYWQpO1xuXG4gIE0gPSBhICogKCgxIC0gZWNjU3F1YXJlZCAvIDQgLSAzICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyA2NCAtIDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAyNTYpICogTGF0UmFkIC0gKDMgKiBlY2NTcXVhcmVkIC8gOCArIDMgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDMyICsgNDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAxMDI0KSAqIE1hdGguc2luKDIgKiBMYXRSYWQpICsgKDE1ICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAyNTYgKyA0NSAqIGVjY1NxdWFyZWQgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAvIDEwMjQpICogTWF0aC5zaW4oNCAqIExhdFJhZCkgLSAoMzUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAzMDcyKSAqIE1hdGguc2luKDYgKiBMYXRSYWQpKTtcblxuICB2YXIgVVRNRWFzdGluZyA9IChrMCAqIE4gKiAoQSArICgxIC0gVCArIEMpICogQSAqIEEgKiBBIC8gNi4wICsgKDUgLSAxOCAqIFQgKyBUICogVCArIDcyICogQyAtIDU4ICogZWNjUHJpbWVTcXVhcmVkKSAqIEEgKiBBICogQSAqIEEgKiBBIC8gMTIwLjApICsgNTAwMDAwLjApO1xuXG4gIHZhciBVVE1Ob3J0aGluZyA9IChrMCAqIChNICsgTiAqIE1hdGgudGFuKExhdFJhZCkgKiAoQSAqIEEgLyAyICsgKDUgLSBUICsgOSAqIEMgKyA0ICogQyAqIEMpICogQSAqIEEgKiBBICogQSAvIDI0LjAgKyAoNjEgLSA1OCAqIFQgKyBUICogVCArIDYwMCAqIEMgLSAzMzAgKiBlY2NQcmltZVNxdWFyZWQpICogQSAqIEEgKiBBICogQSAqIEEgKiBBIC8gNzIwLjApKSk7XG4gIGlmIChMYXQgPCAwLjApIHtcbiAgICBVVE1Ob3J0aGluZyArPSAxMDAwMDAwMC4wOyAvLzEwMDAwMDAwIG1ldGVyIG9mZnNldCBmb3JcbiAgICAvLyBzb3V0aGVybiBoZW1pc3BoZXJlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5vcnRoaW5nOiBNYXRoLnJvdW5kKFVUTU5vcnRoaW5nKSxcbiAgICBlYXN0aW5nOiBNYXRoLnJvdW5kKFVUTUVhc3RpbmcpLFxuICAgIHpvbmVOdW1iZXI6IFpvbmVOdW1iZXIsXG4gICAgem9uZUxldHRlcjogZ2V0TGV0dGVyRGVzaWduYXRvcihMYXQpXG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgVVRNIGNvb3JkcyB0byBsYXQvbG9uZywgdXNpbmcgdGhlIFdHUzg0IGVsbGlwc29pZC4gVGhpcyBpcyBhIGNvbnZlbmllbmNlXG4gKiBjbGFzcyB3aGVyZSB0aGUgWm9uZSBjYW4gYmUgc3BlY2lmaWVkIGFzIGEgc2luZ2xlIHN0cmluZyBlZy5cIjYwTlwiIHdoaWNoXG4gKiBpcyB0aGVuIGJyb2tlbiBkb3duIGludG8gdGhlIFpvbmVOdW1iZXIgYW5kIFpvbmVMZXR0ZXIuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7b2JqZWN0fSB1dG0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBub3J0aGluZywgZWFzdGluZywgem9uZU51bWJlclxuICogICAgIGFuZCB6b25lTGV0dGVyIHByb3BlcnRpZXMuIElmIGFuIG9wdGlvbmFsIGFjY3VyYWN5IHByb3BlcnR5IGlzXG4gKiAgICAgcHJvdmlkZWQgKGluIG1ldGVycyksIGEgYm91bmRpbmcgYm94IHdpbGwgYmUgcmV0dXJuZWQgaW5zdGVhZCBvZlxuICogICAgIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUuXG4gKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBsaXRlcmFsIGNvbnRhaW5pbmcgZWl0aGVyIGxhdCBhbmQgbG9uIHZhbHVlc1xuICogICAgIChpZiBubyBhY2N1cmFjeSB3YXMgcHJvdmlkZWQpLCBvciB0b3AsIHJpZ2h0LCBib3R0b20gYW5kIGxlZnQgdmFsdWVzXG4gKiAgICAgZm9yIHRoZSBib3VuZGluZyBib3ggY2FsY3VsYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFjY3VyYWN5LlxuICogICAgIFJldHVybnMgbnVsbCBpZiB0aGUgY29udmVyc2lvbiBmYWlsZWQuXG4gKi9cbmZ1bmN0aW9uIFVUTXRvTEwodXRtKSB7XG5cbiAgdmFyIFVUTU5vcnRoaW5nID0gdXRtLm5vcnRoaW5nO1xuICB2YXIgVVRNRWFzdGluZyA9IHV0bS5lYXN0aW5nO1xuICB2YXIgem9uZUxldHRlciA9IHV0bS56b25lTGV0dGVyO1xuICB2YXIgem9uZU51bWJlciA9IHV0bS56b25lTnVtYmVyO1xuICAvLyBjaGVjayB0aGUgWm9uZU51bW1iZXIgaXMgdmFsaWRcbiAgaWYgKHpvbmVOdW1iZXIgPCAwIHx8IHpvbmVOdW1iZXIgPiA2MCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGswID0gMC45OTk2O1xuICB2YXIgYSA9IDYzNzgxMzcuMDsgLy9lbGxpcC5yYWRpdXM7XG4gIHZhciBlY2NTcXVhcmVkID0gMC4wMDY2OTQzODsgLy9lbGxpcC5lY2NzcTtcbiAgdmFyIGVjY1ByaW1lU3F1YXJlZDtcbiAgdmFyIGUxID0gKDEgLSBNYXRoLnNxcnQoMSAtIGVjY1NxdWFyZWQpKSAvICgxICsgTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkKSk7XG4gIHZhciBOMSwgVDEsIEMxLCBSMSwgRCwgTTtcbiAgdmFyIExvbmdPcmlnaW47XG4gIHZhciBtdSwgcGhpMVJhZDtcblxuICAvLyByZW1vdmUgNTAwLDAwMCBtZXRlciBvZmZzZXQgZm9yIGxvbmdpdHVkZVxuICB2YXIgeCA9IFVUTUVhc3RpbmcgLSA1MDAwMDAuMDtcbiAgdmFyIHkgPSBVVE1Ob3J0aGluZztcblxuICAvLyBXZSBtdXN0IGtub3cgc29tZWhvdyBpZiB3ZSBhcmUgaW4gdGhlIE5vcnRoZXJuIG9yIFNvdXRoZXJuXG4gIC8vIGhlbWlzcGhlcmUsIHRoaXMgaXMgdGhlIG9ubHkgdGltZSB3ZSB1c2UgdGhlIGxldHRlciBTbyBldmVuXG4gIC8vIGlmIHRoZSBab25lIGxldHRlciBpc24ndCBleGFjdGx5IGNvcnJlY3QgaXQgc2hvdWxkIGluZGljYXRlXG4gIC8vIHRoZSBoZW1pc3BoZXJlIGNvcnJlY3RseVxuICBpZiAoem9uZUxldHRlciA8ICdOJykge1xuICAgIHkgLT0gMTAwMDAwMDAuMDsgLy8gcmVtb3ZlIDEwLDAwMCwwMDAgbWV0ZXIgb2Zmc2V0IHVzZWRcbiAgICAvLyBmb3Igc291dGhlcm4gaGVtaXNwaGVyZVxuICB9XG5cbiAgLy8gVGhlcmUgYXJlIDYwIHpvbmVzIHdpdGggem9uZSAxIGJlaW5nIGF0IFdlc3QgLTE4MCB0byAtMTc0XG4gIExvbmdPcmlnaW4gPSAoem9uZU51bWJlciAtIDEpICogNiAtIDE4MCArIDM7IC8vICszIHB1dHMgb3JpZ2luXG4gIC8vIGluIG1pZGRsZSBvZlxuICAvLyB6b25lXG5cbiAgZWNjUHJpbWVTcXVhcmVkID0gKGVjY1NxdWFyZWQpIC8gKDEgLSBlY2NTcXVhcmVkKTtcblxuICBNID0geSAvIGswO1xuICBtdSA9IE0gLyAoYSAqICgxIC0gZWNjU3F1YXJlZCAvIDQgLSAzICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyA2NCAtIDUgKiBlY2NTcXVhcmVkICogZWNjU3F1YXJlZCAqIGVjY1NxdWFyZWQgLyAyNTYpKTtcblxuICBwaGkxUmFkID0gbXUgKyAoMyAqIGUxIC8gMiAtIDI3ICogZTEgKiBlMSAqIGUxIC8gMzIpICogTWF0aC5zaW4oMiAqIG11KSArICgyMSAqIGUxICogZTEgLyAxNiAtIDU1ICogZTEgKiBlMSAqIGUxICogZTEgLyAzMikgKiBNYXRoLnNpbig0ICogbXUpICsgKDE1MSAqIGUxICogZTEgKiBlMSAvIDk2KSAqIE1hdGguc2luKDYgKiBtdSk7XG4gIC8vIGRvdWJsZSBwaGkxID0gUHJvak1hdGgucmFkVG9EZWcocGhpMVJhZCk7XG5cbiAgTjEgPSBhIC8gTWF0aC5zcXJ0KDEgLSBlY2NTcXVhcmVkICogTWF0aC5zaW4ocGhpMVJhZCkgKiBNYXRoLnNpbihwaGkxUmFkKSk7XG4gIFQxID0gTWF0aC50YW4ocGhpMVJhZCkgKiBNYXRoLnRhbihwaGkxUmFkKTtcbiAgQzEgPSBlY2NQcmltZVNxdWFyZWQgKiBNYXRoLmNvcyhwaGkxUmFkKSAqIE1hdGguY29zKHBoaTFSYWQpO1xuICBSMSA9IGEgKiAoMSAtIGVjY1NxdWFyZWQpIC8gTWF0aC5wb3coMSAtIGVjY1NxdWFyZWQgKiBNYXRoLnNpbihwaGkxUmFkKSAqIE1hdGguc2luKHBoaTFSYWQpLCAxLjUpO1xuICBEID0geCAvIChOMSAqIGswKTtcblxuICB2YXIgbGF0ID0gcGhpMVJhZCAtIChOMSAqIE1hdGgudGFuKHBoaTFSYWQpIC8gUjEpICogKEQgKiBEIC8gMiAtICg1ICsgMyAqIFQxICsgMTAgKiBDMSAtIDQgKiBDMSAqIEMxIC0gOSAqIGVjY1ByaW1lU3F1YXJlZCkgKiBEICogRCAqIEQgKiBEIC8gMjQgKyAoNjEgKyA5MCAqIFQxICsgMjk4ICogQzEgKyA0NSAqIFQxICogVDEgLSAyNTIgKiBlY2NQcmltZVNxdWFyZWQgLSAzICogQzEgKiBDMSkgKiBEICogRCAqIEQgKiBEICogRCAqIEQgLyA3MjApO1xuICBsYXQgPSByYWRUb0RlZyhsYXQpO1xuXG4gIHZhciBsb24gPSAoRCAtICgxICsgMiAqIFQxICsgQzEpICogRCAqIEQgKiBEIC8gNiArICg1IC0gMiAqIEMxICsgMjggKiBUMSAtIDMgKiBDMSAqIEMxICsgOCAqIGVjY1ByaW1lU3F1YXJlZCArIDI0ICogVDEgKiBUMSkgKiBEICogRCAqIEQgKiBEICogRCAvIDEyMCkgLyBNYXRoLmNvcyhwaGkxUmFkKTtcbiAgbG9uID0gTG9uZ09yaWdpbiArIHJhZFRvRGVnKGxvbik7XG5cbiAgdmFyIHJlc3VsdDtcbiAgaWYgKHV0bS5hY2N1cmFjeSkge1xuICAgIHZhciB0b3BSaWdodCA9IFVUTXRvTEwoe1xuICAgICAgbm9ydGhpbmc6IHV0bS5ub3J0aGluZyArIHV0bS5hY2N1cmFjeSxcbiAgICAgIGVhc3Rpbmc6IHV0bS5lYXN0aW5nICsgdXRtLmFjY3VyYWN5LFxuICAgICAgem9uZUxldHRlcjogdXRtLnpvbmVMZXR0ZXIsXG4gICAgICB6b25lTnVtYmVyOiB1dG0uem9uZU51bWJlclxuICAgIH0pO1xuICAgIHJlc3VsdCA9IHtcbiAgICAgIHRvcDogdG9wUmlnaHQubGF0LFxuICAgICAgcmlnaHQ6IHRvcFJpZ2h0LmxvbixcbiAgICAgIGJvdHRvbTogbGF0LFxuICAgICAgbGVmdDogbG9uXG4gICAgfTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXN1bHQgPSB7XG4gICAgICBsYXQ6IGxhdCxcbiAgICAgIGxvbjogbG9uXG4gICAgfTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIE1HUlMgbGV0dGVyIGRlc2lnbmF0b3IgZm9yIHRoZSBnaXZlbiBsYXRpdHVkZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGxhdCBUaGUgbGF0aXR1ZGUgaW4gV0dTODQgdG8gZ2V0IHRoZSBsZXR0ZXIgZGVzaWduYXRvclxuICogICAgIGZvci5cbiAqIEByZXR1cm4ge2NoYXJ9IFRoZSBsZXR0ZXIgZGVzaWduYXRvci5cbiAqL1xuZnVuY3Rpb24gZ2V0TGV0dGVyRGVzaWduYXRvcihsYXQpIHtcbiAgLy9UaGlzIGlzIGhlcmUgYXMgYW4gZXJyb3IgZmxhZyB0byBzaG93IHRoYXQgdGhlIExhdGl0dWRlIGlzXG4gIC8vb3V0c2lkZSBNR1JTIGxpbWl0c1xuICB2YXIgTGV0dGVyRGVzaWduYXRvciA9ICdaJztcblxuICBpZiAoKDg0ID49IGxhdCkgJiYgKGxhdCA+PSA3MikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1gnO1xuICB9XG4gIGVsc2UgaWYgKCg3MiA+IGxhdCkgJiYgKGxhdCA+PSA2NCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1cnO1xuICB9XG4gIGVsc2UgaWYgKCg2NCA+IGxhdCkgJiYgKGxhdCA+PSA1NikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1YnO1xuICB9XG4gIGVsc2UgaWYgKCg1NiA+IGxhdCkgJiYgKGxhdCA+PSA0OCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1UnO1xuICB9XG4gIGVsc2UgaWYgKCg0OCA+IGxhdCkgJiYgKGxhdCA+PSA0MCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1QnO1xuICB9XG4gIGVsc2UgaWYgKCg0MCA+IGxhdCkgJiYgKGxhdCA+PSAzMikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1MnO1xuICB9XG4gIGVsc2UgaWYgKCgzMiA+IGxhdCkgJiYgKGxhdCA+PSAyNCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1InO1xuICB9XG4gIGVsc2UgaWYgKCgyNCA+IGxhdCkgJiYgKGxhdCA+PSAxNikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ1EnO1xuICB9XG4gIGVsc2UgaWYgKCgxNiA+IGxhdCkgJiYgKGxhdCA+PSA4KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnUCc7XG4gIH1cbiAgZWxzZSBpZiAoKDggPiBsYXQpICYmIChsYXQgPj0gMCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ04nO1xuICB9XG4gIGVsc2UgaWYgKCgwID4gbGF0KSAmJiAobGF0ID49IC04KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnTSc7XG4gIH1cbiAgZWxzZSBpZiAoKC04ID4gbGF0KSAmJiAobGF0ID49IC0xNikpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0wnO1xuICB9XG4gIGVsc2UgaWYgKCgtMTYgPiBsYXQpICYmIChsYXQgPj0gLTI0KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnSyc7XG4gIH1cbiAgZWxzZSBpZiAoKC0yNCA+IGxhdCkgJiYgKGxhdCA+PSAtMzIpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdKJztcbiAgfVxuICBlbHNlIGlmICgoLTMyID4gbGF0KSAmJiAobGF0ID49IC00MCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0gnO1xuICB9XG4gIGVsc2UgaWYgKCgtNDAgPiBsYXQpICYmIChsYXQgPj0gLTQ4KSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnRyc7XG4gIH1cbiAgZWxzZSBpZiAoKC00OCA+IGxhdCkgJiYgKGxhdCA+PSAtNTYpKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdGJztcbiAgfVxuICBlbHNlIGlmICgoLTU2ID4gbGF0KSAmJiAobGF0ID49IC02NCkpIHtcbiAgICBMZXR0ZXJEZXNpZ25hdG9yID0gJ0UnO1xuICB9XG4gIGVsc2UgaWYgKCgtNjQgPiBsYXQpICYmIChsYXQgPj0gLTcyKSkge1xuICAgIExldHRlckRlc2lnbmF0b3IgPSAnRCc7XG4gIH1cbiAgZWxzZSBpZiAoKC03MiA+IGxhdCkgJiYgKGxhdCA+PSAtODApKSB7XG4gICAgTGV0dGVyRGVzaWduYXRvciA9ICdDJztcbiAgfVxuICByZXR1cm4gTGV0dGVyRGVzaWduYXRvcjtcbn1cblxuLyoqXG4gKiBFbmNvZGVzIGEgVVRNIGxvY2F0aW9uIGFzIE1HUlMgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gdXRtIEFuIG9iamVjdCBsaXRlcmFsIHdpdGggZWFzdGluZywgbm9ydGhpbmcsXG4gKiAgICAgem9uZUxldHRlciwgem9uZU51bWJlclxuICogQHBhcmFtIHtudW1iZXJ9IGFjY3VyYWN5IEFjY3VyYWN5IGluIGRpZ2l0cyAoMS01KS5cbiAqIEByZXR1cm4ge3N0cmluZ30gTUdSUyBzdHJpbmcgZm9yIHRoZSBnaXZlbiBVVE0gbG9jYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGVuY29kZSh1dG0sIGFjY3VyYWN5KSB7XG4gIC8vIHByZXBlbmQgd2l0aCBsZWFkaW5nIHplcm9lc1xuICB2YXIgc2Vhc3RpbmcgPSBcIjAwMDAwXCIgKyB1dG0uZWFzdGluZyxcbiAgICBzbm9ydGhpbmcgPSBcIjAwMDAwXCIgKyB1dG0ubm9ydGhpbmc7XG5cbiAgcmV0dXJuIHV0bS56b25lTnVtYmVyICsgdXRtLnpvbmVMZXR0ZXIgKyBnZXQxMDBrSUQodXRtLmVhc3RpbmcsIHV0bS5ub3J0aGluZywgdXRtLnpvbmVOdW1iZXIpICsgc2Vhc3Rpbmcuc3Vic3RyKHNlYXN0aW5nLmxlbmd0aCAtIDUsIGFjY3VyYWN5KSArIHNub3J0aGluZy5zdWJzdHIoc25vcnRoaW5nLmxlbmd0aCAtIDUsIGFjY3VyYWN5KTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHR3byBsZXR0ZXIgMTAwayBkZXNpZ25hdG9yIGZvciBhIGdpdmVuIFVUTSBlYXN0aW5nLFxuICogbm9ydGhpbmcgYW5kIHpvbmUgbnVtYmVyIHZhbHVlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gZWFzdGluZ1xuICogQHBhcmFtIHtudW1iZXJ9IG5vcnRoaW5nXG4gKiBAcGFyYW0ge251bWJlcn0gem9uZU51bWJlclxuICogQHJldHVybiB0aGUgdHdvIGxldHRlciAxMDBrIGRlc2lnbmF0b3IgZm9yIHRoZSBnaXZlbiBVVE0gbG9jYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGdldDEwMGtJRChlYXN0aW5nLCBub3J0aGluZywgem9uZU51bWJlcikge1xuICB2YXIgc2V0UGFybSA9IGdldDEwMGtTZXRGb3Jab25lKHpvbmVOdW1iZXIpO1xuICB2YXIgc2V0Q29sdW1uID0gTWF0aC5mbG9vcihlYXN0aW5nIC8gMTAwMDAwKTtcbiAgdmFyIHNldFJvdyA9IE1hdGguZmxvb3Iobm9ydGhpbmcgLyAxMDAwMDApICUgMjA7XG4gIHJldHVybiBnZXRMZXR0ZXIxMDBrSUQoc2V0Q29sdW1uLCBzZXRSb3csIHNldFBhcm0pO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgVVRNIHpvbmUgbnVtYmVyLCBmaWd1cmUgb3V0IHRoZSBNR1JTIDEwMEsgc2V0IGl0IGlzIGluLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gaSBBbiBVVE0gem9uZSBudW1iZXIuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSAxMDBrIHNldCB0aGUgVVRNIHpvbmUgaXMgaW4uXG4gKi9cbmZ1bmN0aW9uIGdldDEwMGtTZXRGb3Jab25lKGkpIHtcbiAgdmFyIHNldFBhcm0gPSBpICUgTlVNXzEwMEtfU0VUUztcbiAgaWYgKHNldFBhcm0gPT09IDApIHtcbiAgICBzZXRQYXJtID0gTlVNXzEwMEtfU0VUUztcbiAgfVxuXG4gIHJldHVybiBzZXRQYXJtO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdHdvLWxldHRlciBNR1JTIDEwMGsgZGVzaWduYXRvciBnaXZlbiBpbmZvcm1hdGlvblxuICogdHJhbnNsYXRlZCBmcm9tIHRoZSBVVE0gbm9ydGhpbmcsIGVhc3RpbmcgYW5kIHpvbmUgbnVtYmVyLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIHRoZSBjb2x1bW4gaW5kZXggYXMgaXQgcmVsYXRlcyB0byB0aGUgTUdSU1xuICogICAgICAgIDEwMGsgc2V0IHNwcmVhZHNoZWV0LCBjcmVhdGVkIGZyb20gdGhlIFVUTSBlYXN0aW5nLlxuICogICAgICAgIFZhbHVlcyBhcmUgMS04LlxuICogQHBhcmFtIHtudW1iZXJ9IHJvdyB0aGUgcm93IGluZGV4IGFzIGl0IHJlbGF0ZXMgdG8gdGhlIE1HUlMgMTAwayBzZXRcbiAqICAgICAgICBzcHJlYWRzaGVldCwgY3JlYXRlZCBmcm9tIHRoZSBVVE0gbm9ydGhpbmcgdmFsdWUuIFZhbHVlc1xuICogICAgICAgIGFyZSBmcm9tIDAtMTkuXG4gKiBAcGFyYW0ge251bWJlcn0gcGFybSB0aGUgc2V0IGJsb2NrLCBhcyBpdCByZWxhdGVzIHRvIHRoZSBNR1JTIDEwMGsgc2V0XG4gKiAgICAgICAgc3ByZWFkc2hlZXQsIGNyZWF0ZWQgZnJvbSB0aGUgVVRNIHpvbmUuIFZhbHVlcyBhcmUgZnJvbVxuICogICAgICAgIDEtNjAuXG4gKiBAcmV0dXJuIHR3byBsZXR0ZXIgTUdSUyAxMDBrIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIGdldExldHRlcjEwMGtJRChjb2x1bW4sIHJvdywgcGFybSkge1xuICAvLyBjb2xPcmlnaW4gYW5kIHJvd09yaWdpbiBhcmUgdGhlIGxldHRlcnMgYXQgdGhlIG9yaWdpbiBvZiB0aGUgc2V0XG4gIHZhciBpbmRleCA9IHBhcm0gLSAxO1xuICB2YXIgY29sT3JpZ2luID0gU0VUX09SSUdJTl9DT0xVTU5fTEVUVEVSUy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgdmFyIHJvd09yaWdpbiA9IFNFVF9PUklHSU5fUk9XX0xFVFRFUlMuY2hhckNvZGVBdChpbmRleCk7XG5cbiAgLy8gY29sSW50IGFuZCByb3dJbnQgYXJlIHRoZSBsZXR0ZXJzIHRvIGJ1aWxkIHRvIHJldHVyblxuICB2YXIgY29sSW50ID0gY29sT3JpZ2luICsgY29sdW1uIC0gMTtcbiAgdmFyIHJvd0ludCA9IHJvd09yaWdpbiArIHJvdztcbiAgdmFyIHJvbGxvdmVyID0gZmFsc2U7XG5cbiAgaWYgKGNvbEludCA+IFopIHtcbiAgICBjb2xJbnQgPSBjb2xJbnQgLSBaICsgQSAtIDE7XG4gICAgcm9sbG92ZXIgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbEludCA9PT0gSSB8fCAoY29sT3JpZ2luIDwgSSAmJiBjb2xJbnQgPiBJKSB8fCAoKGNvbEludCA+IEkgfHwgY29sT3JpZ2luIDwgSSkgJiYgcm9sbG92ZXIpKSB7XG4gICAgY29sSW50Kys7XG4gIH1cblxuICBpZiAoY29sSW50ID09PSBPIHx8IChjb2xPcmlnaW4gPCBPICYmIGNvbEludCA+IE8pIHx8ICgoY29sSW50ID4gTyB8fCBjb2xPcmlnaW4gPCBPKSAmJiByb2xsb3ZlcikpIHtcbiAgICBjb2xJbnQrKztcblxuICAgIGlmIChjb2xJbnQgPT09IEkpIHtcbiAgICAgIGNvbEludCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb2xJbnQgPiBaKSB7XG4gICAgY29sSW50ID0gY29sSW50IC0gWiArIEEgLSAxO1xuICB9XG5cbiAgaWYgKHJvd0ludCA+IFYpIHtcbiAgICByb3dJbnQgPSByb3dJbnQgLSBWICsgQSAtIDE7XG4gICAgcm9sbG92ZXIgPSB0cnVlO1xuICB9XG4gIGVsc2Uge1xuICAgIHJvbGxvdmVyID0gZmFsc2U7XG4gIH1cblxuICBpZiAoKChyb3dJbnQgPT09IEkpIHx8ICgocm93T3JpZ2luIDwgSSkgJiYgKHJvd0ludCA+IEkpKSkgfHwgKCgocm93SW50ID4gSSkgfHwgKHJvd09yaWdpbiA8IEkpKSAmJiByb2xsb3ZlcikpIHtcbiAgICByb3dJbnQrKztcbiAgfVxuXG4gIGlmICgoKHJvd0ludCA9PT0gTykgfHwgKChyb3dPcmlnaW4gPCBPKSAmJiAocm93SW50ID4gTykpKSB8fCAoKChyb3dJbnQgPiBPKSB8fCAocm93T3JpZ2luIDwgTykpICYmIHJvbGxvdmVyKSkge1xuICAgIHJvd0ludCsrO1xuXG4gICAgaWYgKHJvd0ludCA9PT0gSSkge1xuICAgICAgcm93SW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJvd0ludCA+IFYpIHtcbiAgICByb3dJbnQgPSByb3dJbnQgLSBWICsgQSAtIDE7XG4gIH1cblxuICB2YXIgdHdvTGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2xJbnQpICsgU3RyaW5nLmZyb21DaGFyQ29kZShyb3dJbnQpO1xuICByZXR1cm4gdHdvTGV0dGVyO1xufVxuXG4vKipcbiAqIERlY29kZSB0aGUgVVRNIHBhcmFtZXRlcnMgZnJvbSBhIE1HUlMgc3RyaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gbWdyc1N0cmluZyBhbiBVUFBFUkNBU0UgY29vcmRpbmF0ZSBzdHJpbmcgaXMgZXhwZWN0ZWQuXG4gKiBAcmV0dXJuIHtvYmplY3R9IEFuIG9iamVjdCBsaXRlcmFsIHdpdGggZWFzdGluZywgbm9ydGhpbmcsIHpvbmVMZXR0ZXIsXG4gKiAgICAgem9uZU51bWJlciBhbmQgYWNjdXJhY3kgKGluIG1ldGVycykgcHJvcGVydGllcy5cbiAqL1xuZnVuY3Rpb24gZGVjb2RlKG1ncnNTdHJpbmcpIHtcblxuICBpZiAobWdyc1N0cmluZyAmJiBtZ3JzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IChcIk1HUlNQb2ludCBjb3ZlcnRpbmcgZnJvbSBub3RoaW5nXCIpO1xuICB9XG5cbiAgdmFyIGxlbmd0aCA9IG1ncnNTdHJpbmcubGVuZ3RoO1xuXG4gIHZhciBodW5LID0gbnVsbDtcbiAgdmFyIHNiID0gXCJcIjtcbiAgdmFyIHRlc3RDaGFyO1xuICB2YXIgaSA9IDA7XG5cbiAgLy8gZ2V0IFpvbmUgbnVtYmVyXG4gIHdoaWxlICghKC9bQS1aXS8pLnRlc3QodGVzdENoYXIgPSBtZ3JzU3RyaW5nLmNoYXJBdChpKSkpIHtcbiAgICBpZiAoaSA+PSAyKSB7XG4gICAgICB0aHJvdyAoXCJNR1JTUG9pbnQgYmFkIGNvbnZlcnNpb24gZnJvbTogXCIgKyBtZ3JzU3RyaW5nKTtcbiAgICB9XG4gICAgc2IgKz0gdGVzdENoYXI7XG4gICAgaSsrO1xuICB9XG5cbiAgdmFyIHpvbmVOdW1iZXIgPSBwYXJzZUludChzYiwgMTApO1xuXG4gIGlmIChpID09PSAwIHx8IGkgKyAzID4gbGVuZ3RoKSB7XG4gICAgLy8gQSBnb29kIE1HUlMgc3RyaW5nIGhhcyB0byBiZSA0LTUgZGlnaXRzIGxvbmcsXG4gICAgLy8gIyNBQUEvI0FBQSBhdCBsZWFzdC5cbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgYmFkIGNvbnZlcnNpb24gZnJvbTogXCIgKyBtZ3JzU3RyaW5nKTtcbiAgfVxuXG4gIHZhciB6b25lTGV0dGVyID0gbWdyc1N0cmluZy5jaGFyQXQoaSsrKTtcblxuICAvLyBTaG91bGQgd2UgY2hlY2sgdGhlIHpvbmUgbGV0dGVyIGhlcmU/IFdoeSBub3QuXG4gIGlmICh6b25lTGV0dGVyIDw9ICdBJyB8fCB6b25lTGV0dGVyID09PSAnQicgfHwgem9uZUxldHRlciA9PT0gJ1knIHx8IHpvbmVMZXR0ZXIgPj0gJ1onIHx8IHpvbmVMZXR0ZXIgPT09ICdJJyB8fCB6b25lTGV0dGVyID09PSAnTycpIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgem9uZSBsZXR0ZXIgXCIgKyB6b25lTGV0dGVyICsgXCIgbm90IGhhbmRsZWQ6IFwiICsgbWdyc1N0cmluZyk7XG4gIH1cblxuICBodW5LID0gbWdyc1N0cmluZy5zdWJzdHJpbmcoaSwgaSArPSAyKTtcblxuICB2YXIgc2V0ID0gZ2V0MTAwa1NldEZvclpvbmUoem9uZU51bWJlcik7XG5cbiAgdmFyIGVhc3QxMDBrID0gZ2V0RWFzdGluZ0Zyb21DaGFyKGh1bksuY2hhckF0KDApLCBzZXQpO1xuICB2YXIgbm9ydGgxMDBrID0gZ2V0Tm9ydGhpbmdGcm9tQ2hhcihodW5LLmNoYXJBdCgxKSwgc2V0KTtcblxuICAvLyBXZSBoYXZlIGEgYnVnIHdoZXJlIHRoZSBub3J0aGluZyBtYXkgYmUgMjAwMDAwMCB0b28gbG93LlxuICAvLyBIb3dcbiAgLy8gZG8gd2Uga25vdyB3aGVuIHRvIHJvbGwgb3Zlcj9cblxuICB3aGlsZSAobm9ydGgxMDBrIDwgZ2V0TWluTm9ydGhpbmcoem9uZUxldHRlcikpIHtcbiAgICBub3J0aDEwMGsgKz0gMjAwMDAwMDtcbiAgfVxuXG4gIC8vIGNhbGN1bGF0ZSB0aGUgY2hhciBpbmRleCBmb3IgZWFzdGluZy9ub3J0aGluZyBzZXBhcmF0b3JcbiAgdmFyIHJlbWFpbmRlciA9IGxlbmd0aCAtIGk7XG5cbiAgaWYgKHJlbWFpbmRlciAlIDIgIT09IDApIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgaGFzIHRvIGhhdmUgYW4gZXZlbiBudW1iZXIgXFxub2YgZGlnaXRzIGFmdGVyIHRoZSB6b25lIGxldHRlciBhbmQgdHdvIDEwMGttIGxldHRlcnMgLSBmcm9udCBcXG5oYWxmIGZvciBlYXN0aW5nIG1ldGVycywgc2Vjb25kIGhhbGYgZm9yIFxcbm5vcnRoaW5nIG1ldGVyc1wiICsgbWdyc1N0cmluZyk7XG4gIH1cblxuICB2YXIgc2VwID0gcmVtYWluZGVyIC8gMjtcblxuICB2YXIgc2VwRWFzdGluZyA9IDAuMDtcbiAgdmFyIHNlcE5vcnRoaW5nID0gMC4wO1xuICB2YXIgYWNjdXJhY3lCb251cywgc2VwRWFzdGluZ1N0cmluZywgc2VwTm9ydGhpbmdTdHJpbmcsIGVhc3RpbmcsIG5vcnRoaW5nO1xuICBpZiAoc2VwID4gMCkge1xuICAgIGFjY3VyYWN5Qm9udXMgPSAxMDAwMDAuMCAvIE1hdGgucG93KDEwLCBzZXApO1xuICAgIHNlcEVhc3RpbmdTdHJpbmcgPSBtZ3JzU3RyaW5nLnN1YnN0cmluZyhpLCBpICsgc2VwKTtcbiAgICBzZXBFYXN0aW5nID0gcGFyc2VGbG9hdChzZXBFYXN0aW5nU3RyaW5nKSAqIGFjY3VyYWN5Qm9udXM7XG4gICAgc2VwTm9ydGhpbmdTdHJpbmcgPSBtZ3JzU3RyaW5nLnN1YnN0cmluZyhpICsgc2VwKTtcbiAgICBzZXBOb3J0aGluZyA9IHBhcnNlRmxvYXQoc2VwTm9ydGhpbmdTdHJpbmcpICogYWNjdXJhY3lCb251cztcbiAgfVxuXG4gIGVhc3RpbmcgPSBzZXBFYXN0aW5nICsgZWFzdDEwMGs7XG4gIG5vcnRoaW5nID0gc2VwTm9ydGhpbmcgKyBub3J0aDEwMGs7XG5cbiAgcmV0dXJuIHtcbiAgICBlYXN0aW5nOiBlYXN0aW5nLFxuICAgIG5vcnRoaW5nOiBub3J0aGluZyxcbiAgICB6b25lTGV0dGVyOiB6b25lTGV0dGVyLFxuICAgIHpvbmVOdW1iZXI6IHpvbmVOdW1iZXIsXG4gICAgYWNjdXJhY3k6IGFjY3VyYWN5Qm9udXNcbiAgfTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZmlyc3QgbGV0dGVyIGZyb20gYSB0d28tbGV0dGVyIE1HUlMgMTAwayB6b25lLCBhbmQgZ2l2ZW4gdGhlXG4gKiBNR1JTIHRhYmxlIHNldCBmb3IgdGhlIHpvbmUgbnVtYmVyLCBmaWd1cmUgb3V0IHRoZSBlYXN0aW5nIHZhbHVlIHRoYXRcbiAqIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgb3RoZXIsIHNlY29uZGFyeSBlYXN0aW5nIHZhbHVlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2NoYXJ9IGUgVGhlIGZpcnN0IGxldHRlciBmcm9tIGEgdHdvLWxldHRlciBNR1JTIDEwMMK0ayB6b25lLlxuICogQHBhcmFtIHtudW1iZXJ9IHNldCBUaGUgTUdSUyB0YWJsZSBzZXQgZm9yIHRoZSB6b25lIG51bWJlci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGVhc3RpbmcgdmFsdWUgZm9yIHRoZSBnaXZlbiBsZXR0ZXIgYW5kIHNldC5cbiAqL1xuZnVuY3Rpb24gZ2V0RWFzdGluZ0Zyb21DaGFyKGUsIHNldCkge1xuICAvLyBjb2xPcmlnaW4gaXMgdGhlIGxldHRlciBhdCB0aGUgb3JpZ2luIG9mIHRoZSBzZXQgZm9yIHRoZVxuICAvLyBjb2x1bW5cbiAgdmFyIGN1ckNvbCA9IFNFVF9PUklHSU5fQ09MVU1OX0xFVFRFUlMuY2hhckNvZGVBdChzZXQgLSAxKTtcbiAgdmFyIGVhc3RpbmdWYWx1ZSA9IDEwMDAwMC4wO1xuICB2YXIgcmV3aW5kTWFya2VyID0gZmFsc2U7XG5cbiAgd2hpbGUgKGN1ckNvbCAhPT0gZS5jaGFyQ29kZUF0KDApKSB7XG4gICAgY3VyQ29sKys7XG4gICAgaWYgKGN1ckNvbCA9PT0gSSkge1xuICAgICAgY3VyQ29sKys7XG4gICAgfVxuICAgIGlmIChjdXJDb2wgPT09IE8pIHtcbiAgICAgIGN1ckNvbCsrO1xuICAgIH1cbiAgICBpZiAoY3VyQ29sID4gWikge1xuICAgICAgaWYgKHJld2luZE1hcmtlcikge1xuICAgICAgICB0aHJvdyAoXCJCYWQgY2hhcmFjdGVyOiBcIiArIGUpO1xuICAgICAgfVxuICAgICAgY3VyQ29sID0gQTtcbiAgICAgIHJld2luZE1hcmtlciA9IHRydWU7XG4gICAgfVxuICAgIGVhc3RpbmdWYWx1ZSArPSAxMDAwMDAuMDtcbiAgfVxuXG4gIHJldHVybiBlYXN0aW5nVmFsdWU7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIHNlY29uZCBsZXR0ZXIgZnJvbSBhIHR3by1sZXR0ZXIgTUdSUyAxMDBrIHpvbmUsIGFuZCBnaXZlbiB0aGVcbiAqIE1HUlMgdGFibGUgc2V0IGZvciB0aGUgem9uZSBudW1iZXIsIGZpZ3VyZSBvdXQgdGhlIG5vcnRoaW5nIHZhbHVlIHRoYXRcbiAqIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgb3RoZXIsIHNlY29uZGFyeSBub3J0aGluZyB2YWx1ZS4gWW91IGhhdmUgdG9cbiAqIHJlbWVtYmVyIHRoYXQgTm9ydGhpbmdzIGFyZSBkZXRlcm1pbmVkIGZyb20gdGhlIGVxdWF0b3IsIGFuZCB0aGUgdmVydGljYWxcbiAqIGN5Y2xlIG9mIGxldHRlcnMgbWVhbiBhIDIwMDAwMDAgYWRkaXRpb25hbCBub3J0aGluZyBtZXRlcnMuIFRoaXMgaGFwcGVuc1xuICogYXBwcm94LiBldmVyeSAxOCBkZWdyZWVzIG9mIGxhdGl0dWRlLiBUaGlzIG1ldGhvZCBkb2VzICpOT1QqIGNvdW50IGFueVxuICogYWRkaXRpb25hbCBub3J0aGluZ3MuIFlvdSBoYXZlIHRvIGZpZ3VyZSBvdXQgaG93IG1hbnkgMjAwMDAwMCBtZXRlcnMgbmVlZFxuICogdG8gYmUgYWRkZWQgZm9yIHRoZSB6b25lIGxldHRlciBvZiB0aGUgTUdSUyBjb29yZGluYXRlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2NoYXJ9IG4gU2Vjb25kIGxldHRlciBvZiB0aGUgTUdSUyAxMDBrIHpvbmVcbiAqIEBwYXJhbSB7bnVtYmVyfSBzZXQgVGhlIE1HUlMgdGFibGUgc2V0IG51bWJlciwgd2hpY2ggaXMgZGVwZW5kZW50IG9uIHRoZVxuICogICAgIFVUTSB6b25lIG51bWJlci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG5vcnRoaW5nIHZhbHVlIGZvciB0aGUgZ2l2ZW4gbGV0dGVyIGFuZCBzZXQuXG4gKi9cbmZ1bmN0aW9uIGdldE5vcnRoaW5nRnJvbUNoYXIobiwgc2V0KSB7XG5cbiAgaWYgKG4gPiAnVicpIHtcbiAgICB0aHJvdyAoXCJNR1JTUG9pbnQgZ2l2ZW4gaW52YWxpZCBOb3J0aGluZyBcIiArIG4pO1xuICB9XG5cbiAgLy8gcm93T3JpZ2luIGlzIHRoZSBsZXR0ZXIgYXQgdGhlIG9yaWdpbiBvZiB0aGUgc2V0IGZvciB0aGVcbiAgLy8gY29sdW1uXG4gIHZhciBjdXJSb3cgPSBTRVRfT1JJR0lOX1JPV19MRVRURVJTLmNoYXJDb2RlQXQoc2V0IC0gMSk7XG4gIHZhciBub3J0aGluZ1ZhbHVlID0gMC4wO1xuICB2YXIgcmV3aW5kTWFya2VyID0gZmFsc2U7XG5cbiAgd2hpbGUgKGN1clJvdyAhPT0gbi5jaGFyQ29kZUF0KDApKSB7XG4gICAgY3VyUm93Kys7XG4gICAgaWYgKGN1clJvdyA9PT0gSSkge1xuICAgICAgY3VyUm93Kys7XG4gICAgfVxuICAgIGlmIChjdXJSb3cgPT09IE8pIHtcbiAgICAgIGN1clJvdysrO1xuICAgIH1cbiAgICAvLyBmaXhpbmcgYSBidWcgbWFraW5nIHdob2xlIGFwcGxpY2F0aW9uIGhhbmcgaW4gdGhpcyBsb29wXG4gICAgLy8gd2hlbiAnbicgaXMgYSB3cm9uZyBjaGFyYWN0ZXJcbiAgICBpZiAoY3VyUm93ID4gVikge1xuICAgICAgaWYgKHJld2luZE1hcmtlcikgeyAvLyBtYWtpbmcgc3VyZSB0aGF0IHRoaXMgbG9vcCBlbmRzXG4gICAgICAgIHRocm93IChcIkJhZCBjaGFyYWN0ZXI6IFwiICsgbik7XG4gICAgICB9XG4gICAgICBjdXJSb3cgPSBBO1xuICAgICAgcmV3aW5kTWFya2VyID0gdHJ1ZTtcbiAgICB9XG4gICAgbm9ydGhpbmdWYWx1ZSArPSAxMDAwMDAuMDtcbiAgfVxuXG4gIHJldHVybiBub3J0aGluZ1ZhbHVlO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBnZXRNaW5Ob3J0aGluZyByZXR1cm5zIHRoZSBtaW5pbXVtIG5vcnRoaW5nIHZhbHVlIG9mIGEgTUdSU1xuICogem9uZS5cbiAqXG4gKiBQb3J0ZWQgZnJvbSBHZW90cmFucycgYyBMYXR0aXR1ZGVfQmFuZF9WYWx1ZSBzdHJ1Y3R1cmUgdGFibGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Y2hhcn0gem9uZUxldHRlciBUaGUgTUdSUyB6b25lIHRvIGdldCB0aGUgbWluIG5vcnRoaW5nIGZvci5cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0TWluTm9ydGhpbmcoem9uZUxldHRlcikge1xuICB2YXIgbm9ydGhpbmc7XG4gIHN3aXRjaCAoem9uZUxldHRlcikge1xuICBjYXNlICdDJzpcbiAgICBub3J0aGluZyA9IDExMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnRCc6XG4gICAgbm9ydGhpbmcgPSAyMDAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0UnOlxuICAgIG5vcnRoaW5nID0gMjgwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdGJzpcbiAgICBub3J0aGluZyA9IDM3MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnRyc6XG4gICAgbm9ydGhpbmcgPSA0NjAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0gnOlxuICAgIG5vcnRoaW5nID0gNTUwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdKJzpcbiAgICBub3J0aGluZyA9IDY0MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnSyc6XG4gICAgbm9ydGhpbmcgPSA3MzAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ0wnOlxuICAgIG5vcnRoaW5nID0gODIwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdNJzpcbiAgICBub3J0aGluZyA9IDkxMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnTic6XG4gICAgbm9ydGhpbmcgPSAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1AnOlxuICAgIG5vcnRoaW5nID0gODAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1EnOlxuICAgIG5vcnRoaW5nID0gMTcwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdSJzpcbiAgICBub3J0aGluZyA9IDI2MDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnUyc6XG4gICAgbm9ydGhpbmcgPSAzNTAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1QnOlxuICAgIG5vcnRoaW5nID0gNDQwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdVJzpcbiAgICBub3J0aGluZyA9IDUzMDAwMDAuMDtcbiAgICBicmVhaztcbiAgY2FzZSAnVic6XG4gICAgbm9ydGhpbmcgPSA2MjAwMDAwLjA7XG4gICAgYnJlYWs7XG4gIGNhc2UgJ1cnOlxuICAgIG5vcnRoaW5nID0gNzAwMDAwMC4wO1xuICAgIGJyZWFrO1xuICBjYXNlICdYJzpcbiAgICBub3J0aGluZyA9IDc5MDAwMDAuMDtcbiAgICBicmVhaztcbiAgZGVmYXVsdDpcbiAgICBub3J0aGluZyA9IC0xLjA7XG4gIH1cbiAgaWYgKG5vcnRoaW5nID49IDAuMCkge1xuICAgIHJldHVybiBub3J0aGluZztcbiAgfVxuICBlbHNlIHtcbiAgICB0aHJvdyAoXCJJbnZhbGlkIHpvbmUgbGV0dGVyOiBcIiArIHpvbmVMZXR0ZXIpO1xuICB9XG5cbn1cbiIsImltcG9ydCB7dG9Qb2ludCwgZm9yd2FyZH0gZnJvbSAnbWdycyc7XG5cbmZ1bmN0aW9uIFBvaW50KHgsIHksIHopIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBvaW50KSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoeCwgeSwgeik7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICB0aGlzLnggPSB4WzBdO1xuICAgIHRoaXMueSA9IHhbMV07XG4gICAgdGhpcy56ID0geFsyXSB8fCAwLjA7XG4gIH0gZWxzZSBpZih0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcbiAgICB0aGlzLnggPSB4Lng7XG4gICAgdGhpcy55ID0geC55O1xuICAgIHRoaXMueiA9IHgueiB8fCAwLjA7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnICYmIHR5cGVvZiB5ID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBjb29yZHMgPSB4LnNwbGl0KCcsJyk7XG4gICAgdGhpcy54ID0gcGFyc2VGbG9hdChjb29yZHNbMF0sIDEwKTtcbiAgICB0aGlzLnkgPSBwYXJzZUZsb2F0KGNvb3Jkc1sxXSwgMTApO1xuICAgIHRoaXMueiA9IHBhcnNlRmxvYXQoY29vcmRzWzJdLCAxMCkgfHwgMC4wO1xuICB9IGVsc2Uge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnogPSB6IHx8IDAuMDtcbiAgfVxuICBjb25zb2xlLndhcm4oJ3Byb2o0LlBvaW50IHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDMsIHVzZSBwcm9qNC50b1BvaW50Jyk7XG59XG5cblBvaW50LmZyb21NR1JTID0gZnVuY3Rpb24obWdyc1N0cikge1xuICByZXR1cm4gbmV3IFBvaW50KHRvUG9pbnQobWdyc1N0cikpO1xufTtcblBvaW50LnByb3RvdHlwZS50b01HUlMgPSBmdW5jdGlvbihhY2N1cmFjeSkge1xuICByZXR1cm4gZm9yd2FyZChbdGhpcy54LCB0aGlzLnldLCBhY2N1cmFjeSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgUG9pbnQ7XG4iLCJpbXBvcnQgcGFyc2VDb2RlIGZyb20gJy4vcGFyc2VDb2RlJztcbmltcG9ydCBleHRlbmQgZnJvbSAnLi9leHRlbmQnO1xuaW1wb3J0IHByb2plY3Rpb25zIGZyb20gJy4vcHJvamVjdGlvbnMnO1xuaW1wb3J0IHtzcGhlcmUgYXMgZGNfc3BoZXJlLCBlY2NlbnRyaWNpdHkgYXMgZGNfZWNjZW50cmljaXR5fSBmcm9tICcuL2Rlcml2ZUNvbnN0YW50cyc7XG5pbXBvcnQgRGF0dW0gZnJvbSAnLi9jb25zdGFudHMvRGF0dW0nO1xuaW1wb3J0IGRhdHVtIGZyb20gJy4vZGF0dW0nO1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnO1xuaW1wb3J0IHtnZXROYWRncmlkc30gZnJvbSBcIi4vbmFkZ3JpZFwiO1xuXG5mdW5jdGlvbiBQcm9qZWN0aW9uKHNyc0NvZGUsY2FsbGJhY2spIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb2plY3Rpb24pKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9qZWN0aW9uKHNyc0NvZGUpO1xuICB9XG4gIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgIGlmKGVycm9yKXtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcbiAgdmFyIGpzb24gPSBwYXJzZUNvZGUoc3JzQ29kZSk7XG4gIGlmKHR5cGVvZiBqc29uICE9PSAnb2JqZWN0Jyl7XG4gICAgY2FsbGJhY2soc3JzQ29kZSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBvdXJQcm9qID0gUHJvamVjdGlvbi5wcm9qZWN0aW9ucy5nZXQoanNvbi5wcm9qTmFtZSk7XG4gIGlmKCFvdXJQcm9qKXtcbiAgICBjYWxsYmFjayhzcnNDb2RlKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGpzb24uZGF0dW1Db2RlICYmIGpzb24uZGF0dW1Db2RlICE9PSAnbm9uZScpIHtcbiAgICB2YXIgZGF0dW1EZWYgPSBtYXRjaChEYXR1bSwganNvbi5kYXR1bUNvZGUpO1xuICAgIGlmIChkYXR1bURlZikge1xuICAgICAganNvbi5kYXR1bV9wYXJhbXMgPSBqc29uLmRhdHVtX3BhcmFtcyB8fCAoZGF0dW1EZWYudG93Z3M4NCA/IGRhdHVtRGVmLnRvd2dzODQuc3BsaXQoJywnKSA6IG51bGwpO1xuICAgICAganNvbi5lbGxwcyA9IGRhdHVtRGVmLmVsbGlwc2U7XG4gICAgICBqc29uLmRhdHVtTmFtZSA9IGRhdHVtRGVmLmRhdHVtTmFtZSA/IGRhdHVtRGVmLmRhdHVtTmFtZSA6IGpzb24uZGF0dW1Db2RlO1xuICAgIH1cbiAgfVxuICBqc29uLmswID0ganNvbi5rMCB8fCAxLjA7XG4gIGpzb24uYXhpcyA9IGpzb24uYXhpcyB8fCAnZW51JztcbiAganNvbi5lbGxwcyA9IGpzb24uZWxscHMgfHwgJ3dnczg0JztcbiAganNvbi5sYXQxID0ganNvbi5sYXQxIHx8IGpzb24ubGF0MDsgLy8gTGFtYmVydF9Db25mb3JtYWxfQ29uaWNfMVNQLCBmb3IgZXhhbXBsZSwgbmVlZHMgdGhpc1xuXG4gIHZhciBzcGhlcmVfID0gZGNfc3BoZXJlKGpzb24uYSwganNvbi5iLCBqc29uLnJmLCBqc29uLmVsbHBzLCBqc29uLnNwaGVyZSk7XG4gIHZhciBlY2MgPSBkY19lY2NlbnRyaWNpdHkoc3BoZXJlXy5hLCBzcGhlcmVfLmIsIHNwaGVyZV8ucmYsIGpzb24uUl9BKTtcbiAgdmFyIG5hZGdyaWRzID0gZ2V0TmFkZ3JpZHMoanNvbi5uYWRncmlkcyk7XG4gIHZhciBkYXR1bU9iaiA9IGpzb24uZGF0dW0gfHwgZGF0dW0oanNvbi5kYXR1bUNvZGUsIGpzb24uZGF0dW1fcGFyYW1zLCBzcGhlcmVfLmEsIHNwaGVyZV8uYiwgZWNjLmVzLCBlY2MuZXAyLFxuICAgIG5hZGdyaWRzKTtcblxuICBleHRlbmQodGhpcywganNvbik7IC8vIHRyYW5zZmVyIGV2ZXJ5dGhpbmcgb3ZlciBmcm9tIHRoZSBwcm9qZWN0aW9uIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IHdlJ2xsIG5lZWRcbiAgZXh0ZW5kKHRoaXMsIG91clByb2opOyAvLyB0cmFuc2ZlciBhbGwgdGhlIG1ldGhvZHMgZnJvbSB0aGUgcHJvamVjdGlvblxuXG4gIC8vIGNvcHkgdGhlIDQgdGhpbmdzIG92ZXIgd2UgY2FsdWxhdGVkIGluIGRlcml2ZUNvbnN0YW50cy5zcGhlcmVcbiAgdGhpcy5hID0gc3BoZXJlXy5hO1xuICB0aGlzLmIgPSBzcGhlcmVfLmI7XG4gIHRoaXMucmYgPSBzcGhlcmVfLnJmO1xuICB0aGlzLnNwaGVyZSA9IHNwaGVyZV8uc3BoZXJlO1xuXG4gIC8vIGNvcHkgdGhlIDMgdGhpbmdzIHdlIGNhbGN1bGF0ZWQgaW4gZGVyaXZlQ29uc3RhbnRzLmVjY2VudHJpY2l0eVxuICB0aGlzLmVzID0gZWNjLmVzO1xuICB0aGlzLmUgPSBlY2MuZTtcbiAgdGhpcy5lcDIgPSBlY2MuZXAyO1xuXG4gIC8vIGFkZCBpbiB0aGUgZGF0dW0gb2JqZWN0XG4gIHRoaXMuZGF0dW0gPSBkYXR1bU9iajtcblxuICAvLyBpbml0IHRoZSBwcm9qZWN0aW9uXG4gIHRoaXMuaW5pdCgpO1xuXG4gIC8vIGxlZ2VjeSBjYWxsYmFjayBmcm9tIGJhY2sgaW4gdGhlIGRheSB3aGVuIGl0IHdlbnQgdG8gc3BhdGlhbHJlZmVyZW5jZS5vcmdcbiAgY2FsbGJhY2sobnVsbCwgdGhpcyk7XG5cbn1cblByb2plY3Rpb24ucHJvamVjdGlvbnMgPSBwcm9qZWN0aW9ucztcblByb2plY3Rpb24ucHJvamVjdGlvbnMuc3RhcnQoKTtcbmV4cG9ydCBkZWZhdWx0IFByb2plY3Rpb247XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjcnMsIGRlbm9ybSwgcG9pbnQpIHtcbiAgdmFyIHhpbiA9IHBvaW50LngsXG4gICAgeWluID0gcG9pbnQueSxcbiAgICB6aW4gPSBwb2ludC56IHx8IDAuMDtcbiAgdmFyIHYsIHQsIGk7XG4gIHZhciBvdXQgPSB7fTtcbiAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGlmIChkZW5vcm0gJiYgaSA9PT0gMiAmJiBwb2ludC56ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgdiA9IHhpbjtcbiAgICAgIGlmIChcImV3XCIuaW5kZXhPZihjcnMuYXhpc1tpXSkgIT09IC0xKSB7XG4gICAgICAgIHQgPSAneCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ID0gJ3knO1xuICAgICAgfVxuXG4gICAgfVxuICAgIGVsc2UgaWYgKGkgPT09IDEpIHtcbiAgICAgIHYgPSB5aW47XG4gICAgICBpZiAoXCJuc1wiLmluZGV4T2YoY3JzLmF4aXNbaV0pICE9PSAtMSkge1xuICAgICAgICB0ID0gJ3knO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdCA9ICd4JztcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2ID0gemluO1xuICAgICAgdCA9ICd6JztcbiAgICB9XG4gICAgc3dpdGNoIChjcnMuYXhpc1tpXSkge1xuICAgIGNhc2UgJ2UnOlxuICAgICAgb3V0W3RdID0gdjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3cnOlxuICAgICAgb3V0W3RdID0gLXY7XG4gICAgICBicmVhaztcbiAgICBjYXNlICduJzpcbiAgICAgIG91dFt0XSA9IHY7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzJzpcbiAgICAgIG91dFt0XSA9IC12O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAndSc6XG4gICAgICBpZiAocG9pbnRbdF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvdXQueiA9IHY7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkJzpcbiAgICAgIGlmIChwb2ludFt0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG91dC56ID0gLXY7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy9jb25zb2xlLmxvZyhcIkVSUk9SOiB1bmtub3cgYXhpcyAoXCIrY3JzLmF4aXNbaV0rXCIpIC0gY2hlY2sgZGVmaW5pdGlvbiBvZiBcIitjcnMucHJvak5hbWUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocG9pbnQpIHtcbiAgY2hlY2tDb29yZChwb2ludC54KTtcbiAgY2hlY2tDb29yZChwb2ludC55KTtcbn1cbmZ1bmN0aW9uIGNoZWNrQ29vcmQobnVtKSB7XG4gIGlmICh0eXBlb2YgTnVtYmVyLmlzRmluaXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKE51bWJlci5pc0Zpbml0ZShudW0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nvb3JkaW5hdGVzIG11c3QgYmUgZmluaXRlIG51bWJlcnMnKTtcbiAgfVxuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicgfHwgbnVtICE9PSBudW0gfHwgIWlzRmluaXRlKG51bSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb29yZGluYXRlcyBtdXN0IGJlIGZpbml0ZSBudW1iZXJzJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7SEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgc2lnbiBmcm9tICcuL3NpZ24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoTWF0aC5hYnMoeCkgPCBIQUxGX1BJKSA/IHggOiAoeCAtIChzaWduKHgpICogTWF0aC5QSSkpO1xufVxuIiwiXG5pbXBvcnQge1RXT19QSSwgU1BJfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBzaWduIGZyb20gJy4vc2lnbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIChNYXRoLmFicyh4KSA8PSBTUEkpID8geCA6ICh4IC0gKHNpZ24oeCkgKiBUV09fUEkpKTtcbn1cbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4vYWRqdXN0X2xvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHpvbmUsIGxvbikge1xuICBpZiAoem9uZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgem9uZSA9IE1hdGguZmxvb3IoKGFkanVzdF9sb24obG9uKSArIE1hdGguUEkpICogMzAgLyBNYXRoLlBJKSArIDE7XG5cbiAgICBpZiAoem9uZSA8IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAoem9uZSA+IDYwKSB7XG4gICAgICByZXR1cm4gNjA7XG4gICAgfVxuICB9XG4gIHJldHVybiB6b25lO1xufVxuIiwiaW1wb3J0IGh5cG90IGZyb20gJy4vaHlwb3QnO1xuaW1wb3J0IGxvZzFweSBmcm9tICcuL2xvZzFweSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHkgPSBNYXRoLmFicyh4KTtcbiAgeSA9IGxvZzFweSh5ICogKDEgKyB5IC8gKGh5cG90KDEsIHkpICsgMSkpKTtcblxuICByZXR1cm4geCA8IDAgPyAteSA6IHk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIGlmIChNYXRoLmFicyh4KSA+IDEpIHtcbiAgICB4ID0gKHggPiAxKSA/IDEgOiAtMTtcbiAgfVxuICByZXR1cm4gTWF0aC5hc2luKHgpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBwLCBhcmdfcikge1xuICB2YXIgciA9IDIgKiBNYXRoLmNvcyhhcmdfcik7XG4gIHZhciBpID0gcHAubGVuZ3RoIC0gMTtcbiAgdmFyIGhyMSA9IHBwW2ldO1xuICB2YXIgaHIyID0gMDtcbiAgdmFyIGhyO1xuXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIGhyID0gLWhyMiArIHIgKiBocjEgKyBwcFtpXTtcbiAgICBocjIgPSBocjE7XG4gICAgaHIxID0gaHI7XG4gIH1cblxuICByZXR1cm4gTWF0aC5zaW4oYXJnX3IpICogaHI7XG59XG4iLCJpbXBvcnQgc2luaCBmcm9tICcuL3NpbmgnO1xuaW1wb3J0IGNvc2ggZnJvbSAnLi9jb3NoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHAsIGFyZ19yLCBhcmdfaSkge1xuICB2YXIgc2luX2FyZ19yID0gTWF0aC5zaW4oYXJnX3IpO1xuICB2YXIgY29zX2FyZ19yID0gTWF0aC5jb3MoYXJnX3IpO1xuICB2YXIgc2luaF9hcmdfaSA9IHNpbmgoYXJnX2kpO1xuICB2YXIgY29zaF9hcmdfaSA9IGNvc2goYXJnX2kpO1xuICB2YXIgciA9IDIgKiBjb3NfYXJnX3IgKiBjb3NoX2FyZ19pO1xuICB2YXIgaSA9IC0yICogc2luX2FyZ19yICogc2luaF9hcmdfaTtcbiAgdmFyIGogPSBwcC5sZW5ndGggLSAxO1xuICB2YXIgaHIgPSBwcFtqXTtcbiAgdmFyIGhpMSA9IDA7XG4gIHZhciBocjEgPSAwO1xuICB2YXIgaGkgPSAwO1xuICB2YXIgaHIyO1xuICB2YXIgaGkyO1xuXG4gIHdoaWxlICgtLWogPj0gMCkge1xuICAgIGhyMiA9IGhyMTtcbiAgICBoaTIgPSBoaTE7XG4gICAgaHIxID0gaHI7XG4gICAgaGkxID0gaGk7XG4gICAgaHIgPSAtaHIyICsgciAqIGhyMSAtIGkgKiBoaTEgKyBwcFtqXTtcbiAgICBoaSA9IC1oaTIgKyBpICogaHIxICsgciAqIGhpMTtcbiAgfVxuXG4gIHIgPSBzaW5fYXJnX3IgKiBjb3NoX2FyZ19pO1xuICBpID0gY29zX2FyZ19yICogc2luaF9hcmdfaTtcblxuICByZXR1cm4gW3IgKiBociAtIGkgKiBoaSwgciAqIGhpICsgaSAqIGhyXTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHIgPSBNYXRoLmV4cCh4KTtcbiAgciA9IChyICsgMSAvIHIpIC8gMjtcbiAgcmV0dXJuIHI7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKDEgLSAwLjI1ICogeCAqICgxICsgeCAvIDE2ICogKDMgKyAxLjI1ICogeCkpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoMC4zNzUgKiB4ICogKDEgKyAwLjI1ICogeCAqICgxICsgMC40Njg3NSAqIHgpKSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gKDAuMDU4NTkzNzUgKiB4ICogeCAqICgxICsgMC43NSAqIHgpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiAoeCAqIHggKiB4ICogKDM1IC8gMzA3MikpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGUsIHNpbnBoaSkge1xuICB2YXIgdGVtcCA9IGUgKiBzaW5waGk7XG4gIHJldHVybiBhIC8gTWF0aC5zcXJ0KDEgLSB0ZW1wICogdGVtcCk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHAsIEIpIHtcbiAgdmFyIGNvc18yQiA9IDIgKiBNYXRoLmNvcygyICogQik7XG4gIHZhciBpID0gcHAubGVuZ3RoIC0gMTtcbiAgdmFyIGgxID0gcHBbaV07XG4gIHZhciBoMiA9IDA7XG4gIHZhciBoO1xuXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIGggPSAtaDIgKyBjb3NfMkIgKiBoMSArIHBwW2ldO1xuICAgIGgyID0gaDE7XG4gICAgaDEgPSBoO1xuICB9XG5cbiAgcmV0dXJuIChCICsgaCAqIE1hdGguc2luKDIgKiBCKSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCB5KSB7XG4gIHggPSBNYXRoLmFicyh4KTtcbiAgeSA9IE1hdGguYWJzKHkpO1xuICB2YXIgYSA9IE1hdGgubWF4KHgsIHkpO1xuICB2YXIgYiA9IE1hdGgubWluKHgsIHkpIC8gKGEgPyBhIDogMSk7XG5cbiAgcmV0dXJuIGEgKiBNYXRoLnNxcnQoMSArIE1hdGgucG93KGIsIDIpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1sLCBlMCwgZTEsIGUyLCBlMykge1xuICB2YXIgcGhpO1xuICB2YXIgZHBoaTtcblxuICBwaGkgPSBtbCAvIGUwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDE1OyBpKyspIHtcbiAgICBkcGhpID0gKG1sIC0gKGUwICogcGhpIC0gZTEgKiBNYXRoLnNpbigyICogcGhpKSArIGUyICogTWF0aC5zaW4oNCAqIHBoaSkgLSBlMyAqIE1hdGguc2luKDYgKiBwaGkpKSkgLyAoZTAgLSAyICogZTEgKiBNYXRoLmNvcygyICogcGhpKSArIDQgKiBlMiAqIE1hdGguY29zKDQgKiBwaGkpIC0gNiAqIGUzICogTWF0aC5jb3MoNiAqIHBoaSkpO1xuICAgIHBoaSArPSBkcGhpO1xuICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSAwLjAwMDAwMDAwMDEpIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG5cbiAgLy8uLnJlcG9ydEVycm9yKFwiSU1MRk4tQ09OVjpMYXRpdHVkZSBmYWlsZWQgdG8gY29udmVyZ2UgYWZ0ZXIgMTUgaXRlcmF0aW9uc1wiKTtcbiAgcmV0dXJuIE5hTjtcbn0iLCJpbXBvcnQge0hBTEZfUEl9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlY2NlbnQsIHEpIHtcbiAgdmFyIHRlbXAgPSAxIC0gKDEgLSBlY2NlbnQgKiBlY2NlbnQpIC8gKDIgKiBlY2NlbnQpICogTWF0aC5sb2coKDEgLSBlY2NlbnQpIC8gKDEgKyBlY2NlbnQpKTtcbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKHEpIC0gdGVtcCkgPCAxLjBFLTYpIHtcbiAgICBpZiAocSA8IDApIHtcbiAgICAgIHJldHVybiAoLTEgKiBIQUxGX1BJKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gSEFMRl9QSTtcbiAgICB9XG4gIH1cbiAgLy92YXIgcGhpID0gMC41KiBxLygxLWVjY2VudCplY2NlbnQpO1xuICB2YXIgcGhpID0gTWF0aC5hc2luKDAuNSAqIHEpO1xuICB2YXIgZHBoaTtcbiAgdmFyIHNpbl9waGk7XG4gIHZhciBjb3NfcGhpO1xuICB2YXIgY29uO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDMwOyBpKyspIHtcbiAgICBzaW5fcGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICBjb3NfcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBjb24gPSBlY2NlbnQgKiBzaW5fcGhpO1xuICAgIGRwaGkgPSBNYXRoLnBvdygxIC0gY29uICogY29uLCAyKSAvICgyICogY29zX3BoaSkgKiAocSAvICgxIC0gZWNjZW50ICogZWNjZW50KSAtIHNpbl9waGkgLyAoMSAtIGNvbiAqIGNvbikgKyAwLjUgLyBlY2NlbnQgKiBNYXRoLmxvZygoMSAtIGNvbikgLyAoMSArIGNvbikpKTtcbiAgICBwaGkgKz0gZHBoaTtcbiAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gMC4wMDAwMDAwMDAxKSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuXG4gIC8vY29uc29sZS5sb2coXCJJUVNGTi1DT05WOkxhdGl0dWRlIGZhaWxlZCB0byBjb252ZXJnZSBhZnRlciAzMCBpdGVyYXRpb25zXCIpO1xuICByZXR1cm4gTmFOO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICB2YXIgeSA9IDEgKyB4O1xuICB2YXIgeiA9IHkgLSAxO1xuXG4gIHJldHVybiB6ID09PSAwID8geCA6IHggKiBNYXRoLmxvZyh5KSAvIHo7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihlMCwgZTEsIGUyLCBlMywgcGhpKSB7XG4gIHJldHVybiAoZTAgKiBwaGkgLSBlMSAqIE1hdGguc2luKDIgKiBwaGkpICsgZTIgKiBNYXRoLnNpbig0ICogcGhpKSAtIGUzICogTWF0aC5zaW4oNiAqIHBoaSkpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVjY2VudCwgc2lucGhpLCBjb3NwaGkpIHtcbiAgdmFyIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcbiAgcmV0dXJuIGNvc3BoaSAvIChNYXRoLnNxcnQoMSAtIGNvbiAqIGNvbikpO1xufSIsImltcG9ydCB7SEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVjY2VudCwgdHMpIHtcbiAgdmFyIGVjY250aCA9IDAuNSAqIGVjY2VudDtcbiAgdmFyIGNvbiwgZHBoaTtcbiAgdmFyIHBoaSA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKHRzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPD0gMTU7IGkrKykge1xuICAgIGNvbiA9IGVjY2VudCAqIE1hdGguc2luKHBoaSk7XG4gICAgZHBoaSA9IEhBTEZfUEkgLSAyICogTWF0aC5hdGFuKHRzICogKE1hdGgucG93KCgoMSAtIGNvbikgLyAoMSArIGNvbikpLCBlY2NudGgpKSkgLSBwaGk7XG4gICAgcGhpICs9IGRwaGk7XG4gICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IDAuMDAwMDAwMDAwMSkge1xuICAgICAgcmV0dXJuIHBoaTtcbiAgICB9XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhcInBoaTJ6IGhhcyBOb0NvbnZlcmdlbmNlXCIpO1xuICByZXR1cm4gLTk5OTk7XG59XG4iLCJ2YXIgQzAwID0gMTtcbnZhciBDMDIgPSAwLjI1O1xudmFyIEMwNCA9IDAuMDQ2ODc1O1xudmFyIEMwNiA9IDAuMDE5NTMxMjU7XG52YXIgQzA4ID0gMC4wMTA2ODExNTIzNDM3NTtcbnZhciBDMjIgPSAwLjc1O1xudmFyIEM0NCA9IDAuNDY4NzU7XG52YXIgQzQ2ID0gMC4wMTMwMjA4MzMzMzMzMzMzMzMzMztcbnZhciBDNDggPSAwLjAwNzEyMDc2ODIyOTE2NjY2NjY2O1xudmFyIEM2NiA9IDAuMzY0NTgzMzMzMzMzMzMzMzMzMzM7XG52YXIgQzY4ID0gMC4wMDU2OTY2MTQ1ODMzMzMzMzMzMztcbnZhciBDODggPSAwLjMwNzYxNzE4NzU7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVzKSB7XG4gIHZhciBlbiA9IFtdO1xuICBlblswXSA9IEMwMCAtIGVzICogKEMwMiArIGVzICogKEMwNCArIGVzICogKEMwNiArIGVzICogQzA4KSkpO1xuICBlblsxXSA9IGVzICogKEMyMiAtIGVzICogKEMwNCArIGVzICogKEMwNiArIGVzICogQzA4KSkpO1xuICB2YXIgdCA9IGVzICogZXM7XG4gIGVuWzJdID0gdCAqIChDNDQgLSBlcyAqIChDNDYgKyBlcyAqIEM0OCkpO1xuICB0ICo9IGVzO1xuICBlblszXSA9IHQgKiAoQzY2IC0gZXMgKiBDNjgpO1xuICBlbls0XSA9IHQgKiBlcyAqIEM4ODtcbiAgcmV0dXJuIGVuO1xufSIsImltcG9ydCBwal9tbGZuIGZyb20gXCIuL3BqX21sZm5cIjtcbmltcG9ydCB7RVBTTE59IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG52YXIgTUFYX0lURVIgPSAyMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYXJnLCBlcywgZW4pIHtcbiAgdmFyIGsgPSAxIC8gKDEgLSBlcyk7XG4gIHZhciBwaGkgPSBhcmc7XG4gIGZvciAodmFyIGkgPSBNQVhfSVRFUjsgaTsgLS1pKSB7IC8qIHJhcmVseSBnb2VzIG92ZXIgMiBpdGVyYXRpb25zICovXG4gICAgdmFyIHMgPSBNYXRoLnNpbihwaGkpO1xuICAgIHZhciB0ID0gMSAtIGVzICogcyAqIHM7XG4gICAgLy90ID0gdGhpcy5wal9tbGZuKHBoaSwgcywgTWF0aC5jb3MocGhpKSwgZW4pIC0gYXJnO1xuICAgIC8vcGhpIC09IHQgKiAodCAqIE1hdGguc3FydCh0KSkgKiBrO1xuICAgIHQgPSAocGpfbWxmbihwaGksIHMsIE1hdGguY29zKHBoaSksIGVuKSAtIGFyZykgKiAodCAqIE1hdGguc3FydCh0KSkgKiBrO1xuICAgIHBoaSAtPSB0O1xuICAgIGlmIChNYXRoLmFicyh0KSA8IEVQU0xOKSB7XG4gICAgICByZXR1cm4gcGhpO1xuICAgIH1cbiAgfVxuICAvLy4ucmVwb3J0RXJyb3IoXCJjYXNzOnBqX2ludl9tbGZuOiBDb252ZXJnZW5jZSBlcnJvclwiKTtcbiAgcmV0dXJuIHBoaTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBoaSwgc3BoaSwgY3BoaSwgZW4pIHtcbiAgY3BoaSAqPSBzcGhpO1xuICBzcGhpICo9IHNwaGk7XG4gIHJldHVybiAoZW5bMF0gKiBwaGkgLSBjcGhpICogKGVuWzFdICsgc3BoaSAqIChlblsyXSArIHNwaGkgKiAoZW5bM10gKyBzcGhpICogZW5bNF0pKSkpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVjY2VudCwgc2lucGhpKSB7XG4gIHZhciBjb247XG4gIGlmIChlY2NlbnQgPiAxLjBlLTcpIHtcbiAgICBjb24gPSBlY2NlbnQgKiBzaW5waGk7XG4gICAgcmV0dXJuICgoMSAtIGVjY2VudCAqIGVjY2VudCkgKiAoc2lucGhpIC8gKDEgLSBjb24gKiBjb24pIC0gKDAuNSAvIGVjY2VudCkgKiBNYXRoLmxvZygoMSAtIGNvbikgLyAoMSArIGNvbikpKSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuICgyICogc2lucGhpKTtcbiAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHg8MCA/IC0xIDogMTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHZhciByID0gTWF0aC5leHAoeCk7XG4gIHIgPSAociAtIDEgLyByKSAvIDI7XG4gIHJldHVybiByO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVzaW5wLCBleHApIHtcbiAgcmV0dXJuIChNYXRoLnBvdygoMSAtIGVzaW5wKSAvICgxICsgZXNpbnApLCBleHApKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYXJyYXkpe1xuICB2YXIgb3V0ID0ge1xuICAgIHg6IGFycmF5WzBdLFxuICAgIHk6IGFycmF5WzFdXG4gIH07XG4gIGlmIChhcnJheS5sZW5ndGg+Mikge1xuICAgIG91dC56ID0gYXJyYXlbMl07XG4gIH1cbiAgaWYgKGFycmF5Lmxlbmd0aD4zKSB7XG4gICAgb3V0Lm0gPSBhcnJheVszXTtcbiAgfVxuICByZXR1cm4gb3V0O1xufSIsImltcG9ydCB7SEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGVjY2VudCwgcGhpLCBzaW5waGkpIHtcbiAgdmFyIGNvbiA9IGVjY2VudCAqIHNpbnBoaTtcbiAgdmFyIGNvbSA9IDAuNSAqIGVjY2VudDtcbiAgY29uID0gTWF0aC5wb3coKCgxIC0gY29uKSAvICgxICsgY29uKSksIGNvbSk7XG4gIHJldHVybiAoTWF0aC50YW4oMC41ICogKEhBTEZfUEkgLSBwaGkpKSAvIGNvbik7XG59XG4iLCJ2YXIgZXhwb3J0cyA9IHt9O1xuZXhwb3J0IHtleHBvcnRzIGFzIGRlZmF1bHR9O1xuZXhwb3J0cy53Z3M4NCA9IHtcbiAgdG93Z3M4NDogXCIwLDAsMFwiLFxuICBlbGxpcHNlOiBcIldHUzg0XCIsXG4gIGRhdHVtTmFtZTogXCJXR1M4NFwiXG59O1xuXG5leHBvcnRzLmNoMTkwMyA9IHtcbiAgdG93Z3M4NDogXCI2NzQuMzc0LDE1LjA1Niw0MDUuMzQ2XCIsXG4gIGVsbGlwc2U6IFwiYmVzc2VsXCIsXG4gIGRhdHVtTmFtZTogXCJzd2lzc1wiXG59O1xuXG5leHBvcnRzLmdncnM4NyA9IHtcbiAgdG93Z3M4NDogXCItMTk5Ljg3LDc0Ljc5LDI0Ni42MlwiLFxuICBlbGxpcHNlOiBcIkdSUzgwXCIsXG4gIGRhdHVtTmFtZTogXCJHcmVla19HZW9kZXRpY19SZWZlcmVuY2VfU3lzdGVtXzE5ODdcIlxufTtcblxuZXhwb3J0cy5uYWQ4MyA9IHtcbiAgdG93Z3M4NDogXCIwLDAsMFwiLFxuICBlbGxpcHNlOiBcIkdSUzgwXCIsXG4gIGRhdHVtTmFtZTogXCJOb3J0aF9BbWVyaWNhbl9EYXR1bV8xOTgzXCJcbn07XG5cbmV4cG9ydHMubmFkMjcgPSB7XG4gIG5hZGdyaWRzOiBcIkBjb251cyxAYWxhc2thLEBudHYyXzAuZ3NiLEBudHYxX2Nhbi5kYXRcIixcbiAgZWxsaXBzZTogXCJjbHJrNjZcIixcbiAgZGF0dW1OYW1lOiBcIk5vcnRoX0FtZXJpY2FuX0RhdHVtXzE5MjdcIlxufTtcblxuZXhwb3J0cy5wb3RzZGFtID0ge1xuICB0b3dnczg0OiBcIjU5OC4xLDczLjcsNDE4LjIsMC4yMDIsMC4wNDUsLTIuNDU1LDYuN1wiLFxuICBlbGxpcHNlOiBcImJlc3NlbFwiLFxuICBkYXR1bU5hbWU6IFwiUG90c2RhbSBSYXVlbmJlcmcgMTk1MCBESEROXCJcbn07XG5cbmV4cG9ydHMuY2FydGhhZ2UgPSB7XG4gIHRvd2dzODQ6IFwiLTI2My4wLDYuMCw0MzEuMFwiLFxuICBlbGxpcHNlOiBcImNsYXJrODBcIixcbiAgZGF0dW1OYW1lOiBcIkNhcnRoYWdlIDE5MzQgVHVuaXNpYVwiXG59O1xuXG5leHBvcnRzLmhlcm1hbm5za29nZWwgPSB7XG4gIHRvd2dzODQ6IFwiNTc3LjMyNiw5MC4xMjksNDYzLjkxOSw1LjEzNywxLjQ3NCw1LjI5NywyLjQyMzJcIixcbiAgZWxsaXBzZTogXCJiZXNzZWxcIixcbiAgZGF0dW1OYW1lOiBcIkhlcm1hbm5za29nZWxcIlxufTtcblxuZXhwb3J0cy5vc25pNTIgPSB7XG4gIHRvd2dzODQ6IFwiNDgyLjUzMCwtMTMwLjU5Niw1NjQuNTU3LC0xLjA0MiwtMC4yMTQsLTAuNjMxLDguMTVcIixcbiAgZWxsaXBzZTogXCJhaXJ5XCIsXG4gIGRhdHVtTmFtZTogXCJJcmlzaCBOYXRpb25hbFwiXG59O1xuXG5leHBvcnRzLmlyZTY1ID0ge1xuICB0b3dnczg0OiBcIjQ4Mi41MzAsLTEzMC41OTYsNTY0LjU1NywtMS4wNDIsLTAuMjE0LC0wLjYzMSw4LjE1XCIsXG4gIGVsbGlwc2U6IFwibW9kX2FpcnlcIixcbiAgZGF0dW1OYW1lOiBcIklyZWxhbmQgMTk2NVwiXG59O1xuXG5leHBvcnRzLnJhc3NhZGlyYW4gPSB7XG4gIHRvd2dzODQ6IFwiLTEzMy42MywtMTU3LjUsLTE1OC42MlwiLFxuICBlbGxpcHNlOiBcImludGxcIixcbiAgZGF0dW1OYW1lOiBcIlJhc3NhZGlyYW5cIlxufTtcblxuZXhwb3J0cy5uemdkNDkgPSB7XG4gIHRvd2dzODQ6IFwiNTkuNDcsLTUuMDQsMTg3LjQ0LDAuNDcsLTAuMSwxLjAyNCwtNC41OTkzXCIsXG4gIGVsbGlwc2U6IFwiaW50bFwiLFxuICBkYXR1bU5hbWU6IFwiTmV3IFplYWxhbmQgR2VvZGV0aWMgRGF0dW0gMTk0OVwiXG59O1xuXG5leHBvcnRzLm9zZ2IzNiA9IHtcbiAgdG93Z3M4NDogXCI0NDYuNDQ4LC0xMjUuMTU3LDU0Mi4wNjAsMC4xNTAyLDAuMjQ3MCwwLjg0MjEsLTIwLjQ4OTRcIixcbiAgZWxsaXBzZTogXCJhaXJ5XCIsXG4gIGRhdHVtTmFtZTogXCJBaXJ5IDE4MzBcIlxufTtcblxuZXhwb3J0cy5zX2p0c2sgPSB7XG4gIHRvd2dzODQ6IFwiNTg5LDc2LDQ4MFwiLFxuICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgZGF0dW1OYW1lOiAnUy1KVFNLIChGZXJybyknXG59O1xuXG5leHBvcnRzLmJlZHVhcmFtID0ge1xuICB0b3dnczg0OiAnLTEwNiwtODcsMTg4JyxcbiAgZWxsaXBzZTogJ2Nscms4MCcsXG4gIGRhdHVtTmFtZTogJ0JlZHVhcmFtJ1xufTtcblxuZXhwb3J0cy5ndW51bmdfc2VnYXJhID0ge1xuICB0b3dnczg0OiAnLTQwMyw2ODQsNDEnLFxuICBlbGxpcHNlOiAnYmVzc2VsJyxcbiAgZGF0dW1OYW1lOiAnR3VudW5nIFNlZ2FyYSBKYWthcnRhJ1xufTtcblxuZXhwb3J0cy5ybmI3MiA9IHtcbiAgdG93Z3M4NDogXCIxMDYuODY5LC01Mi4yOTc4LDEwMy43MjQsLTAuMzM2NTcsMC40NTY5NTUsLTEuODQyMTgsMVwiLFxuICBlbGxpcHNlOiBcImludGxcIixcbiAgZGF0dW1OYW1lOiBcIlJlc2VhdSBOYXRpb25hbCBCZWxnZSAxOTcyXCJcbn07XG4iLCJ2YXIgZXhwb3J0cyA9IHt9O1xuZXhwb3J0IHtleHBvcnRzIGFzIGRlZmF1bHR9O1xuZXhwb3J0cy5NRVJJVCA9IHtcbiAgYTogNjM3ODEzNy4wLFxuICByZjogMjk4LjI1NyxcbiAgZWxsaXBzZU5hbWU6IFwiTUVSSVQgMTk4M1wiXG59O1xuXG5leHBvcnRzLlNHUzg1ID0ge1xuICBhOiA2Mzc4MTM2LjAsXG4gIHJmOiAyOTguMjU3LFxuICBlbGxpcHNlTmFtZTogXCJTb3ZpZXQgR2VvZGV0aWMgU3lzdGVtIDg1XCJcbn07XG5cbmV4cG9ydHMuR1JTODAgPSB7XG4gIGE6IDYzNzgxMzcuMCxcbiAgcmY6IDI5OC4yNTcyMjIxMDEsXG4gIGVsbGlwc2VOYW1lOiBcIkdSUyAxOTgwKElVR0csIDE5ODApXCJcbn07XG5cbmV4cG9ydHMuSUFVNzYgPSB7XG4gIGE6IDYzNzgxNDAuMCxcbiAgcmY6IDI5OC4yNTcsXG4gIGVsbGlwc2VOYW1lOiBcIklBVSAxOTc2XCJcbn07XG5cbmV4cG9ydHMuYWlyeSA9IHtcbiAgYTogNjM3NzU2My4zOTYsXG4gIGI6IDYzNTYyNTYuOTEwLFxuICBlbGxpcHNlTmFtZTogXCJBaXJ5IDE4MzBcIlxufTtcblxuZXhwb3J0cy5BUEw0ID0ge1xuICBhOiA2Mzc4MTM3LFxuICByZjogMjk4LjI1LFxuICBlbGxpcHNlTmFtZTogXCJBcHBsLiBQaHlzaWNzLiAxOTY1XCJcbn07XG5cbmV4cG9ydHMuTldMOUQgPSB7XG4gIGE6IDYzNzgxNDUuMCxcbiAgcmY6IDI5OC4yNSxcbiAgZWxsaXBzZU5hbWU6IFwiTmF2YWwgV2VhcG9ucyBMYWIuLCAxOTY1XCJcbn07XG5cbmV4cG9ydHMubW9kX2FpcnkgPSB7XG4gIGE6IDYzNzczNDAuMTg5LFxuICBiOiA2MzU2MDM0LjQ0NixcbiAgZWxsaXBzZU5hbWU6IFwiTW9kaWZpZWQgQWlyeVwiXG59O1xuXG5leHBvcnRzLmFuZHJhZSA9IHtcbiAgYTogNjM3NzEwNC40MyxcbiAgcmY6IDMwMC4wLFxuICBlbGxpcHNlTmFtZTogXCJBbmRyYWUgMTg3NiAoRGVuLiwgSWNsbmQuKVwiXG59O1xuXG5leHBvcnRzLmF1c3RfU0EgPSB7XG4gIGE6IDYzNzgxNjAuMCxcbiAgcmY6IDI5OC4yNSxcbiAgZWxsaXBzZU5hbWU6IFwiQXVzdHJhbGlhbiBOYXRsICYgUy4gQW1lci4gMTk2OVwiXG59O1xuXG5leHBvcnRzLkdSUzY3ID0ge1xuICBhOiA2Mzc4MTYwLjAsXG4gIHJmOiAyOTguMjQ3MTY3NDI3MCxcbiAgZWxsaXBzZU5hbWU6IFwiR1JTIDY3KElVR0cgMTk2NylcIlxufTtcblxuZXhwb3J0cy5iZXNzZWwgPSB7XG4gIGE6IDYzNzczOTcuMTU1LFxuICByZjogMjk5LjE1MjgxMjgsXG4gIGVsbGlwc2VOYW1lOiBcIkJlc3NlbCAxODQxXCJcbn07XG5cbmV4cG9ydHMuYmVzc19uYW0gPSB7XG4gIGE6IDYzNzc0ODMuODY1LFxuICByZjogMjk5LjE1MjgxMjgsXG4gIGVsbGlwc2VOYW1lOiBcIkJlc3NlbCAxODQxIChOYW1pYmlhKVwiXG59O1xuXG5leHBvcnRzLmNscms2NiA9IHtcbiAgYTogNjM3ODIwNi40LFxuICBiOiA2MzU2NTgzLjgsXG4gIGVsbGlwc2VOYW1lOiBcIkNsYXJrZSAxODY2XCJcbn07XG5cbmV4cG9ydHMuY2xyazgwID0ge1xuICBhOiA2Mzc4MjQ5LjE0NSxcbiAgcmY6IDI5My40NjYzLFxuICBlbGxpcHNlTmFtZTogXCJDbGFya2UgMTg4MCBtb2QuXCJcbn07XG5cbmV4cG9ydHMuY2xyazU4ID0ge1xuICBhOiA2Mzc4MjkzLjY0NTIwODc1OSxcbiAgcmY6IDI5NC4yNjA2NzYzNjkyNjU0LFxuICBlbGxpcHNlTmFtZTogXCJDbGFya2UgMTg1OFwiXG59O1xuXG5leHBvcnRzLkNQTSA9IHtcbiAgYTogNjM3NTczOC43LFxuICByZjogMzM0LjI5LFxuICBlbGxpcHNlTmFtZTogXCJDb21tLiBkZXMgUG9pZHMgZXQgTWVzdXJlcyAxNzk5XCJcbn07XG5cbmV4cG9ydHMuZGVsbWJyID0ge1xuICBhOiA2Mzc2NDI4LjAsXG4gIHJmOiAzMTEuNSxcbiAgZWxsaXBzZU5hbWU6IFwiRGVsYW1icmUgMTgxMCAoQmVsZ2l1bSlcIlxufTtcblxuZXhwb3J0cy5lbmdlbGlzID0ge1xuICBhOiA2Mzc4MTM2LjA1LFxuICByZjogMjk4LjI1NjYsXG4gIGVsbGlwc2VOYW1lOiBcIkVuZ2VsaXMgMTk4NVwiXG59O1xuXG5leHBvcnRzLmV2cnN0MzAgPSB7XG4gIGE6IDYzNzcyNzYuMzQ1LFxuICByZjogMzAwLjgwMTcsXG4gIGVsbGlwc2VOYW1lOiBcIkV2ZXJlc3QgMTgzMFwiXG59O1xuXG5leHBvcnRzLmV2cnN0NDggPSB7XG4gIGE6IDYzNzczMDQuMDYzLFxuICByZjogMzAwLjgwMTcsXG4gIGVsbGlwc2VOYW1lOiBcIkV2ZXJlc3QgMTk0OFwiXG59O1xuXG5leHBvcnRzLmV2cnN0NTYgPSB7XG4gIGE6IDYzNzczMDEuMjQzLFxuICByZjogMzAwLjgwMTcsXG4gIGVsbGlwc2VOYW1lOiBcIkV2ZXJlc3QgMTk1NlwiXG59O1xuXG5leHBvcnRzLmV2cnN0NjkgPSB7XG4gIGE6IDYzNzcyOTUuNjY0LFxuICByZjogMzAwLjgwMTcsXG4gIGVsbGlwc2VOYW1lOiBcIkV2ZXJlc3QgMTk2OVwiXG59O1xuXG5leHBvcnRzLmV2cnN0U1MgPSB7XG4gIGE6IDYzNzcyOTguNTU2LFxuICByZjogMzAwLjgwMTcsXG4gIGVsbGlwc2VOYW1lOiBcIkV2ZXJlc3QgKFNhYmFoICYgU2FyYXdhaylcIlxufTtcblxuZXhwb3J0cy5mc2NocjYwID0ge1xuICBhOiA2Mzc4MTY2LjAsXG4gIHJmOiAyOTguMyxcbiAgZWxsaXBzZU5hbWU6IFwiRmlzY2hlciAoTWVyY3VyeSBEYXR1bSkgMTk2MFwiXG59O1xuXG5leHBvcnRzLmZzY2hyNjBtID0ge1xuICBhOiA2Mzc4MTU1LjAsXG4gIHJmOiAyOTguMyxcbiAgZWxsaXBzZU5hbWU6IFwiRmlzY2hlciAxOTYwXCJcbn07XG5cbmV4cG9ydHMuZnNjaHI2OCA9IHtcbiAgYTogNjM3ODE1MC4wLFxuICByZjogMjk4LjMsXG4gIGVsbGlwc2VOYW1lOiBcIkZpc2NoZXIgMTk2OFwiXG59O1xuXG5leHBvcnRzLmhlbG1lcnQgPSB7XG4gIGE6IDYzNzgyMDAuMCxcbiAgcmY6IDI5OC4zLFxuICBlbGxpcHNlTmFtZTogXCJIZWxtZXJ0IDE5MDZcIlxufTtcblxuZXhwb3J0cy5ob3VnaCA9IHtcbiAgYTogNjM3ODI3MC4wLFxuICByZjogMjk3LjAsXG4gIGVsbGlwc2VOYW1lOiBcIkhvdWdoXCJcbn07XG5cbmV4cG9ydHMuaW50bCA9IHtcbiAgYTogNjM3ODM4OC4wLFxuICByZjogMjk3LjAsXG4gIGVsbGlwc2VOYW1lOiBcIkludGVybmF0aW9uYWwgMTkwOSAoSGF5Zm9yZClcIlxufTtcblxuZXhwb3J0cy5rYXVsYSA9IHtcbiAgYTogNjM3ODE2My4wLFxuICByZjogMjk4LjI0LFxuICBlbGxpcHNlTmFtZTogXCJLYXVsYSAxOTYxXCJcbn07XG5cbmV4cG9ydHMubGVyY2ggPSB7XG4gIGE6IDYzNzgxMzkuMCxcbiAgcmY6IDI5OC4yNTcsXG4gIGVsbGlwc2VOYW1lOiBcIkxlcmNoIDE5NzlcIlxufTtcblxuZXhwb3J0cy5tcHJ0cyA9IHtcbiAgYTogNjM5NzMwMC4wLFxuICByZjogMTkxLjAsXG4gIGVsbGlwc2VOYW1lOiBcIk1hdXBlcnRpdXMgMTczOFwiXG59O1xuXG5leHBvcnRzLm5ld19pbnRsID0ge1xuICBhOiA2Mzc4MTU3LjUsXG4gIGI6IDYzNTY3NzIuMixcbiAgZWxsaXBzZU5hbWU6IFwiTmV3IEludGVybmF0aW9uYWwgMTk2N1wiXG59O1xuXG5leHBvcnRzLnBsZXNzaXMgPSB7XG4gIGE6IDYzNzY1MjMuMCxcbiAgcmY6IDYzNTU4NjMuMCxcbiAgZWxsaXBzZU5hbWU6IFwiUGxlc3NpcyAxODE3IChGcmFuY2UpXCJcbn07XG5cbmV4cG9ydHMua3Jhc3MgPSB7XG4gIGE6IDYzNzgyNDUuMCxcbiAgcmY6IDI5OC4zLFxuICBlbGxpcHNlTmFtZTogXCJLcmFzc292c2t5LCAxOTQyXCJcbn07XG5cbmV4cG9ydHMuU0Vhc2lhID0ge1xuICBhOiA2Mzc4MTU1LjAsXG4gIGI6IDYzNTY3NzMuMzIwNSxcbiAgZWxsaXBzZU5hbWU6IFwiU291dGhlYXN0IEFzaWFcIlxufTtcblxuZXhwb3J0cy53YWxiZWNrID0ge1xuICBhOiA2Mzc2ODk2LjAsXG4gIGI6IDYzNTU4MzQuODQ2NyxcbiAgZWxsaXBzZU5hbWU6IFwiV2FsYmVja1wiXG59O1xuXG5leHBvcnRzLldHUzYwID0ge1xuICBhOiA2Mzc4MTY1LjAsXG4gIHJmOiAyOTguMyxcbiAgZWxsaXBzZU5hbWU6IFwiV0dTIDYwXCJcbn07XG5cbmV4cG9ydHMuV0dTNjYgPSB7XG4gIGE6IDYzNzgxNDUuMCxcbiAgcmY6IDI5OC4yNSxcbiAgZWxsaXBzZU5hbWU6IFwiV0dTIDY2XCJcbn07XG5cbmV4cG9ydHMuV0dTNyA9IHtcbiAgYTogNjM3ODEzNS4wLFxuICByZjogMjk4LjI2LFxuICBlbGxpcHNlTmFtZTogXCJXR1MgNzJcIlxufTtcblxuZXhwb3J0IHZhciBXR1M4NCA9IGV4cG9ydHMuV0dTODQgPSB7XG4gIGE6IDYzNzgxMzcuMCxcbiAgcmY6IDI5OC4yNTcyMjM1NjMsXG4gIGVsbGlwc2VOYW1lOiBcIldHUyA4NFwiXG59O1xuXG5leHBvcnRzLnNwaGVyZSA9IHtcbiAgYTogNjM3MDk5Ny4wLFxuICBiOiA2MzcwOTk3LjAsXG4gIGVsbGlwc2VOYW1lOiBcIk5vcm1hbCBTcGhlcmUgKHI9NjM3MDk5NylcIlxufTtcbiIsInZhciBleHBvcnRzID0ge307XG5leHBvcnQge2V4cG9ydHMgYXMgZGVmYXVsdH07XG5cbmV4cG9ydHMuZ3JlZW53aWNoID0gMC4wOyAvL1wiMGRFXCIsXG5leHBvcnRzLmxpc2JvbiA9IC05LjEzMTkwNjExMTExMTsgLy9cIjlkMDcnNTQuODYyXFxcIldcIixcbmV4cG9ydHMucGFyaXMgPSAyLjMzNzIyOTE2NjY2NzsgLy9cIjJkMjAnMTQuMDI1XFxcIkVcIixcbmV4cG9ydHMuYm9nb3RhID0gLTc0LjA4MDkxNjY2NjY2NzsgLy9cIjc0ZDA0JzUxLjNcXFwiV1wiLFxuZXhwb3J0cy5tYWRyaWQgPSAtMy42ODc5Mzg4ODg4ODk7IC8vXCIzZDQxJzE2LjU4XFxcIldcIixcbmV4cG9ydHMucm9tZSA9IDEyLjQ1MjMzMzMzMzMzMzsgLy9cIjEyZDI3JzguNFxcXCJFXCIsXG5leHBvcnRzLmJlcm4gPSA3LjQzOTU4MzMzMzMzMzsgLy9cIjdkMjYnMjIuNVxcXCJFXCIsXG5leHBvcnRzLmpha2FydGEgPSAxMDYuODA3NzE5NDQ0NDQ0OyAvL1wiMTA2ZDQ4JzI3Ljc5XFxcIkVcIixcbmV4cG9ydHMuZmVycm8gPSAtMTcuNjY2NjY2NjY2NjY3OyAvL1wiMTdkNDAnV1wiLFxuZXhwb3J0cy5icnVzc2VscyA9IDQuMzY3OTc1OyAvL1wiNGQyMic0LjcxXFxcIkVcIixcbmV4cG9ydHMuc3RvY2tob2xtID0gMTguMDU4Mjc3Nzc3Nzc4OyAvL1wiMThkMycyOS44XFxcIkVcIixcbmV4cG9ydHMuYXRoZW5zID0gMjMuNzE2MzM3NTsgLy9cIjIzZDQyJzU4LjgxNVxcXCJFXCIsXG5leHBvcnRzLm9zbG8gPSAxMC43MjI5MTY2NjY2Njc7IC8vXCIxMGQ0MycyMi41XFxcIkVcIlxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBmdDoge3RvX21ldGVyOiAwLjMwNDh9LFxuICAndXMtZnQnOiB7dG9fbWV0ZXI6IDEyMDAgLyAzOTM3fVxufTtcbiIsImV4cG9ydCB2YXIgUEpEXzNQQVJBTSA9IDE7XG5leHBvcnQgdmFyIFBKRF83UEFSQU0gPSAyO1xuZXhwb3J0IHZhciBQSkRfR1JJRFNISUZUID0gMztcbmV4cG9ydCB2YXIgUEpEX1dHUzg0ID0gNDsgLy8gV0dTODQgb3IgZXF1aXZhbGVudFxuZXhwb3J0IHZhciBQSkRfTk9EQVRVTSA9IDU7IC8vIFdHUzg0IG9yIGVxdWl2YWxlbnRcbmV4cG9ydCB2YXIgU1JTX1dHUzg0X1NFTUlNQUpPUiA9IDYzNzgxMzcuMDsgIC8vIG9ubHkgdXNlZCBpbiBncmlkIHNoaWZ0IHRyYW5zZm9ybXNcbmV4cG9ydCB2YXIgU1JTX1dHUzg0X1NFTUlNSU5PUiA9IDYzNTY3NTIuMzE0OyAgLy8gb25seSB1c2VkIGluIGdyaWQgc2hpZnQgdHJhbnNmb3Jtc1xuZXhwb3J0IHZhciBTUlNfV0dTODRfRVNRVUFSRUQgPSAwLjAwNjY5NDM3OTk5MDE0MTMxNjU7IC8vIG9ubHkgdXNlZCBpbiBncmlkIHNoaWZ0IHRyYW5zZm9ybXNcbmV4cG9ydCB2YXIgU0VDX1RPX1JBRCA9IDQuODQ4MTM2ODExMDk1MzU5OTM1ODk5MTQxMDIzNTdlLTY7XG5leHBvcnQgdmFyIEhBTEZfUEkgPSBNYXRoLlBJLzI7XG4vLyBlbGxpcG9pZCBwal9zZXRfZWxsLmNcbmV4cG9ydCB2YXIgU0lYVEggPSAwLjE2NjY2NjY2NjY2NjY2NjY2Njc7XG4vKiAxLzYgKi9cbmV4cG9ydCB2YXIgUkE0ID0gMC4wNDcyMjIyMjIyMjIyMjIyMjIyMjtcbi8qIDE3LzM2MCAqL1xuZXhwb3J0IHZhciBSQTYgPSAwLjAyMjE1NjA4NDY1NjA4NDY1NjA4O1xuZXhwb3J0IHZhciBFUFNMTiA9IDEuMGUtMTA7XG4vLyB5b3UnZCB0aGluayB5b3UgY291bGQgdXNlIE51bWJlci5FUFNJTE9OIGFib3ZlIGJ1dCB0aGF0IG1ha2VzXG4vLyBNb2xsd2VpZGUgZ2V0IGludG8gYW4gaW5maW5hdGUgbG9vcC5cblxuZXhwb3J0IHZhciBEMlIgPSAwLjAxNzQ1MzI5MjUxOTk0MzI5NTc3O1xuZXhwb3J0IHZhciBSMkQgPSA1Ny4yOTU3Nzk1MTMwODIzMjA4ODtcbmV4cG9ydCB2YXIgRk9SVFBJID0gTWF0aC5QSS80O1xuZXhwb3J0IHZhciBUV09fUEkgPSBNYXRoLlBJICogMjtcbi8vIFNQSSBpcyBzbGlnaHRseSBncmVhdGVyIHRoYW4gTWF0aC5QSSwgc28gdmFsdWVzIHRoYXQgZXhjZWVkIHRoZSAtMTgwLi4xODBcbi8vIGRlZ3JlZSByYW5nZSBieSBhIHRpbnkgYW1vdW50IGRvbid0IGdldCB3cmFwcGVkLiBUaGlzIHByZXZlbnRzIHBvaW50cyB0aGF0XG4vLyBoYXZlIGRyaWZ0ZWQgZnJvbSB0aGVpciBvcmlnaW5hbCBsb2NhdGlvbiBhbG9uZyB0aGUgMTgwdGggbWVyaWRpYW4gKGR1ZSB0b1xuLy8gZmxvYXRpbmcgcG9pbnQgZXJyb3IpIGZyb20gY2hhbmdpbmcgdGhlaXIgc2lnbi5cbmV4cG9ydCB2YXIgU1BJID0gMy4xNDE1OTI2NTM1OTtcbiIsImltcG9ydCBwcm9qIGZyb20gJy4vUHJvaic7XG5pbXBvcnQgdHJhbnNmb3JtIGZyb20gJy4vdHJhbnNmb3JtJztcbnZhciB3Z3M4NCA9IHByb2ooJ1dHUzg0Jyk7XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybWVyKGZyb20sIHRvLCBjb29yZHMsIGVuZm9yY2VBeGlzKSB7XG4gIHZhciB0cmFuc2Zvcm1lZEFycmF5LCBvdXQsIGtleXM7XG4gIGlmIChBcnJheS5pc0FycmF5KGNvb3JkcykpIHtcbiAgICB0cmFuc2Zvcm1lZEFycmF5ID0gdHJhbnNmb3JtKGZyb20sIHRvLCBjb29yZHMsIGVuZm9yY2VBeGlzKSB8fCB7eDogTmFOLCB5OiBOYU59O1xuICAgIGlmIChjb29yZHMubGVuZ3RoID4gMikge1xuICAgICAgaWYgKCh0eXBlb2YgZnJvbS5uYW1lICE9PSAndW5kZWZpbmVkJyAmJiBmcm9tLm5hbWUgPT09ICdnZW9jZW50JykgfHwgKHR5cGVvZiB0by5uYW1lICE9PSAndW5kZWZpbmVkJyAmJiB0by5uYW1lID09PSAnZ2VvY2VudCcpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtZWRBcnJheS56ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiBbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnksIHRyYW5zZm9ybWVkQXJyYXkuel0uY29uY2F0KGNvb3Jkcy5zcGxpY2UoMykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnksIGNvb3Jkc1syXV0uY29uY2F0KGNvb3Jkcy5zcGxpY2UoMykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW3RyYW5zZm9ybWVkQXJyYXkueCwgdHJhbnNmb3JtZWRBcnJheS55XS5jb25jYXQoY29vcmRzLnNwbGljZSgyKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbdHJhbnNmb3JtZWRBcnJheS54LCB0cmFuc2Zvcm1lZEFycmF5LnldO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXQgPSB0cmFuc2Zvcm0oZnJvbSwgdG8sIGNvb3JkcywgZW5mb3JjZUF4aXMpO1xuICAgIGtleXMgPSBPYmplY3Qua2V5cyhjb29yZHMpO1xuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmICgodHlwZW9mIGZyb20ubmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZnJvbS5uYW1lID09PSAnZ2VvY2VudCcpIHx8ICh0eXBlb2YgdG8ubmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdG8ubmFtZSA9PT0gJ2dlb2NlbnQnKSkge1xuICAgICAgICBpZiAoa2V5ID09PSAneCcgfHwga2V5ID09PSAneScgfHwga2V5ID09PSAneicpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChrZXkgPT09ICd4JyB8fCBrZXkgPT09ICd5Jykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3V0W2tleV0gPSBjb29yZHNba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3V0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrUHJvaihpdGVtKSB7XG4gIGlmIChpdGVtIGluc3RhbmNlb2YgcHJvaikge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG4gIGlmIChpdGVtLm9Qcm9qKSB7XG4gICAgcmV0dXJuIGl0ZW0ub1Byb2o7XG4gIH1cbiAgcmV0dXJuIHByb2ooaXRlbSk7XG59XG5cbmZ1bmN0aW9uIHByb2o0KGZyb21Qcm9qLCB0b1Byb2osIGNvb3JkKSB7XG4gIGZyb21Qcm9qID0gY2hlY2tQcm9qKGZyb21Qcm9qKTtcbiAgdmFyIHNpbmdsZSA9IGZhbHNlO1xuICB2YXIgb2JqO1xuICBpZiAodHlwZW9mIHRvUHJvaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0b1Byb2ogPSBmcm9tUHJvajtcbiAgICBmcm9tUHJvaiA9IHdnczg0O1xuICAgIHNpbmdsZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHRvUHJvai54ICE9PSAndW5kZWZpbmVkJyB8fCBBcnJheS5pc0FycmF5KHRvUHJvaikpIHtcbiAgICBjb29yZCA9IHRvUHJvajtcbiAgICB0b1Byb2ogPSBmcm9tUHJvajtcbiAgICBmcm9tUHJvaiA9IHdnczg0O1xuICAgIHNpbmdsZSA9IHRydWU7XG4gIH1cbiAgdG9Qcm9qID0gY2hlY2tQcm9qKHRvUHJvaik7XG4gIGlmIChjb29yZCkge1xuICAgIHJldHVybiB0cmFuc2Zvcm1lcihmcm9tUHJvaiwgdG9Qcm9qLCBjb29yZCk7XG4gIH0gZWxzZSB7XG4gICAgb2JqID0ge1xuICAgICAgZm9yd2FyZDogZnVuY3Rpb24gKGNvb3JkcywgZW5mb3JjZUF4aXMpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKGZyb21Qcm9qLCB0b1Byb2osIGNvb3JkcywgZW5mb3JjZUF4aXMpO1xuICAgICAgfSxcbiAgICAgIGludmVyc2U6IGZ1bmN0aW9uIChjb29yZHMsIGVuZm9yY2VBeGlzKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcih0b1Byb2osIGZyb21Qcm9qLCBjb29yZHMsIGVuZm9yY2VBeGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzaW5nbGUpIHtcbiAgICAgIG9iai5vUHJvaiA9IHRvUHJvajtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgcHJvajQ7IiwiaW1wb3J0IHtQSkRfM1BBUkFNLCBQSkRfN1BBUkFNLCBQSkRfR1JJRFNISUZULCBQSkRfV0dTODQsIFBKRF9OT0RBVFVNLCBTRUNfVE9fUkFEfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5mdW5jdGlvbiBkYXR1bShkYXR1bUNvZGUsIGRhdHVtX3BhcmFtcywgYSwgYiwgZXMsIGVwMiwgbmFkZ3JpZHMpIHtcbiAgdmFyIG91dCA9IHt9O1xuXG4gIGlmIChkYXR1bUNvZGUgPT09IHVuZGVmaW5lZCB8fCBkYXR1bUNvZGUgPT09ICdub25lJykge1xuICAgIG91dC5kYXR1bV90eXBlID0gUEpEX05PREFUVU07XG4gIH0gZWxzZSB7XG4gICAgb3V0LmRhdHVtX3R5cGUgPSBQSkRfV0dTODQ7XG4gIH1cblxuICBpZiAoZGF0dW1fcGFyYW1zKSB7XG4gICAgb3V0LmRhdHVtX3BhcmFtcyA9IGRhdHVtX3BhcmFtcy5tYXAocGFyc2VGbG9hdCk7XG4gICAgaWYgKG91dC5kYXR1bV9wYXJhbXNbMF0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1sxXSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzJdICE9PSAwKSB7XG4gICAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF8zUEFSQU07XG4gICAgfVxuICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmIChvdXQuZGF0dW1fcGFyYW1zWzNdICE9PSAwIHx8IG91dC5kYXR1bV9wYXJhbXNbNF0gIT09IDAgfHwgb3V0LmRhdHVtX3BhcmFtc1s1XSAhPT0gMCB8fCBvdXQuZGF0dW1fcGFyYW1zWzZdICE9PSAwKSB7XG4gICAgICAgIG91dC5kYXR1bV90eXBlID0gUEpEXzdQQVJBTTtcbiAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1szXSAqPSBTRUNfVE9fUkFEO1xuICAgICAgICBvdXQuZGF0dW1fcGFyYW1zWzRdICo9IFNFQ19UT19SQUQ7XG4gICAgICAgIG91dC5kYXR1bV9wYXJhbXNbNV0gKj0gU0VDX1RPX1JBRDtcbiAgICAgICAgb3V0LmRhdHVtX3BhcmFtc1s2XSA9IChvdXQuZGF0dW1fcGFyYW1zWzZdIC8gMTAwMDAwMC4wKSArIDEuMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAobmFkZ3JpZHMpIHtcbiAgICBvdXQuZGF0dW1fdHlwZSA9IFBKRF9HUklEU0hJRlQ7XG4gICAgb3V0LmdyaWRzID0gbmFkZ3JpZHM7XG4gIH1cbiAgb3V0LmEgPSBhOyAvL2RhdHVtIG9iamVjdCBhbHNvIHVzZXMgdGhlc2UgdmFsdWVzXG4gIG91dC5iID0gYjtcbiAgb3V0LmVzID0gZXM7XG4gIG91dC5lcDIgPSBlcDI7XG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdHVtO1xuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHtQSkRfM1BBUkFNLCBQSkRfN1BBUkFNLCBIQUxGX1BJfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBhcmVEYXR1bXMoc291cmNlLCBkZXN0KSB7XG4gIGlmIChzb3VyY2UuZGF0dW1fdHlwZSAhPT0gZGVzdC5kYXR1bV90eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlOyAvLyBmYWxzZSwgZGF0dW1zIGFyZSBub3QgZXF1YWxcbiAgfSBlbHNlIGlmIChzb3VyY2UuYSAhPT0gZGVzdC5hIHx8IE1hdGguYWJzKHNvdXJjZS5lcyAtIGRlc3QuZXMpID4gMC4wMDAwMDAwMDAwNTApIHtcbiAgICAvLyB0aGUgdG9sZXJhbmNlIGZvciBlcyBpcyB0byBlbnN1cmUgdGhhdCBHUlM4MCBhbmQgV0dTODRcbiAgICAvLyBhcmUgY29uc2lkZXJlZCBpZGVudGljYWxcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAoc291cmNlLmRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0pIHtcbiAgICByZXR1cm4gKHNvdXJjZS5kYXR1bV9wYXJhbXNbMF0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzBdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMV0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzFdICYmIHNvdXJjZS5kYXR1bV9wYXJhbXNbMl0gPT09IGRlc3QuZGF0dW1fcGFyYW1zWzJdKTtcbiAgfSBlbHNlIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEXzdQQVJBTSkge1xuICAgIHJldHVybiAoc291cmNlLmRhdHVtX3BhcmFtc1swXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMF0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1sxXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMV0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1syXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbMl0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1szXSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbM10gJiYgc291cmNlLmRhdHVtX3BhcmFtc1s0XSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbNF0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1s1XSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbNV0gJiYgc291cmNlLmRhdHVtX3BhcmFtc1s2XSA9PT0gZGVzdC5kYXR1bV9wYXJhbXNbNl0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlOyAvLyBkYXR1bXMgYXJlIGVxdWFsXG4gIH1cbn0gLy8gY3NfY29tcGFyZV9kYXR1bXMoKVxuXG4vKlxuICogVGhlIGZ1bmN0aW9uIENvbnZlcnRfR2VvZGV0aWNfVG9fR2VvY2VudHJpYyBjb252ZXJ0cyBnZW9kZXRpYyBjb29yZGluYXRlc1xuICogKGxhdGl0dWRlLCBsb25naXR1ZGUsIGFuZCBoZWlnaHQpIHRvIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKFgsIFksIFopLFxuICogYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IGVsbGlwc29pZCBwYXJhbWV0ZXJzLlxuICpcbiAqICAgIExhdGl0dWRlICA6IEdlb2RldGljIGxhdGl0dWRlIGluIHJhZGlhbnMgICAgICAgICAgICAgICAgICAgICAoaW5wdXQpXG4gKiAgICBMb25naXR1ZGUgOiBHZW9kZXRpYyBsb25naXR1ZGUgaW4gcmFkaWFucyAgICAgICAgICAgICAgICAgICAgKGlucHV0KVxuICogICAgSGVpZ2h0ICAgIDogR2VvZGV0aWMgaGVpZ2h0LCBpbiBtZXRlcnMgICAgICAgICAgICAgICAgICAgICAgIChpbnB1dClcbiAqICAgIFggICAgICAgICA6IENhbGN1bGF0ZWQgR2VvY2VudHJpYyBYIGNvb3JkaW5hdGUsIGluIG1ldGVycyAgICAob3V0cHV0KVxuICogICAgWSAgICAgICAgIDogQ2FsY3VsYXRlZCBHZW9jZW50cmljIFkgY29vcmRpbmF0ZSwgaW4gbWV0ZXJzICAgIChvdXRwdXQpXG4gKiAgICBaICAgICAgICAgOiBDYWxjdWxhdGVkIEdlb2NlbnRyaWMgWiBjb29yZGluYXRlLCBpbiBtZXRlcnMgICAgKG91dHB1dClcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW9kZXRpY1RvR2VvY2VudHJpYyhwLCBlcywgYSkge1xuICB2YXIgTG9uZ2l0dWRlID0gcC54O1xuICB2YXIgTGF0aXR1ZGUgPSBwLnk7XG4gIHZhciBIZWlnaHQgPSBwLnogPyBwLnogOiAwOyAvL1ogdmFsdWUgbm90IGFsd2F5cyBzdXBwbGllZFxuXG4gIHZhciBSbjsgLyogIEVhcnRoIHJhZGl1cyBhdCBsb2NhdGlvbiAgKi9cbiAgdmFyIFNpbl9MYXQ7IC8qICBNYXRoLnNpbihMYXRpdHVkZSkgICovXG4gIHZhciBTaW4yX0xhdDsgLyogIFNxdWFyZSBvZiBNYXRoLnNpbihMYXRpdHVkZSkgICovXG4gIHZhciBDb3NfTGF0OyAvKiAgTWF0aC5jb3MoTGF0aXR1ZGUpICAqL1xuXG4gIC8qXG4gICAqKiBEb24ndCBibG93IHVwIGlmIExhdGl0dWRlIGlzIGp1c3QgYSBsaXR0bGUgb3V0IG9mIHRoZSB2YWx1ZVxuICAgKiogcmFuZ2UgYXMgaXQgbWF5IGp1c3QgYmUgYSByb3VuZGluZyBpc3N1ZS4gIEFsc28gcmVtb3ZlZCBsb25naXR1ZGVcbiAgICoqIHRlc3QsIGl0IHNob3VsZCBiZSB3cmFwcGVkIGJ5IE1hdGguY29zKCkgYW5kIE1hdGguc2luKCkuICBORlcgZm9yIFBST0ouNCwgU2VwLzIwMDEuXG4gICAqL1xuICBpZiAoTGF0aXR1ZGUgPCAtSEFMRl9QSSAmJiBMYXRpdHVkZSA+IC0xLjAwMSAqIEhBTEZfUEkpIHtcbiAgICBMYXRpdHVkZSA9IC1IQUxGX1BJO1xuICB9IGVsc2UgaWYgKExhdGl0dWRlID4gSEFMRl9QSSAmJiBMYXRpdHVkZSA8IDEuMDAxICogSEFMRl9QSSkge1xuICAgIExhdGl0dWRlID0gSEFMRl9QSTtcbiAgfSBlbHNlIGlmIChMYXRpdHVkZSA8IC1IQUxGX1BJKSB7XG4gICAgLyogTGF0aXR1ZGUgb3V0IG9mIHJhbmdlICovXG4gICAgLy8uLnJlcG9ydEVycm9yKCdnZW9jZW50OmxhdCBvdXQgb2YgcmFuZ2U6JyArIExhdGl0dWRlKTtcbiAgICByZXR1cm4geyB4OiAtSW5maW5pdHksIHk6IC1JbmZpbml0eSwgejogcC56IH07XG4gIH0gZWxzZSBpZiAoTGF0aXR1ZGUgPiBIQUxGX1BJKSB7XG4gICAgLyogTGF0aXR1ZGUgb3V0IG9mIHJhbmdlICovXG4gICAgcmV0dXJuIHsgeDogSW5maW5pdHksIHk6IEluZmluaXR5LCB6OiBwLnogfTtcbiAgfVxuXG4gIGlmIChMb25naXR1ZGUgPiBNYXRoLlBJKSB7XG4gICAgTG9uZ2l0dWRlIC09ICgyICogTWF0aC5QSSk7XG4gIH1cbiAgU2luX0xhdCA9IE1hdGguc2luKExhdGl0dWRlKTtcbiAgQ29zX0xhdCA9IE1hdGguY29zKExhdGl0dWRlKTtcbiAgU2luMl9MYXQgPSBTaW5fTGF0ICogU2luX0xhdDtcbiAgUm4gPSBhIC8gKE1hdGguc3FydCgxLjBlMCAtIGVzICogU2luMl9MYXQpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiAoUm4gKyBIZWlnaHQpICogQ29zX0xhdCAqIE1hdGguY29zKExvbmdpdHVkZSksXG4gICAgeTogKFJuICsgSGVpZ2h0KSAqIENvc19MYXQgKiBNYXRoLnNpbihMb25naXR1ZGUpLFxuICAgIHo6ICgoUm4gKiAoMSAtIGVzKSkgKyBIZWlnaHQpICogU2luX0xhdFxuICB9O1xufSAvLyBjc19nZW9kZXRpY190b19nZW9jZW50cmljKClcblxuZXhwb3J0IGZ1bmN0aW9uIGdlb2NlbnRyaWNUb0dlb2RldGljKHAsIGVzLCBhLCBiKSB7XG4gIC8qIGxvY2FsIGRlZmludGlvbnMgYW5kIHZhcmlhYmxlcyAqL1xuICAvKiBlbmQtY3JpdGVyaXVtIG9mIGxvb3AsIGFjY3VyYWN5IG9mIHNpbihMYXRpdHVkZSkgKi9cbiAgdmFyIGdlbmF1ID0gMWUtMTI7XG4gIHZhciBnZW5hdTIgPSAoZ2VuYXUgKiBnZW5hdSk7XG4gIHZhciBtYXhpdGVyID0gMzA7XG5cbiAgdmFyIFA7IC8qIGRpc3RhbmNlIGJldHdlZW4gc2VtaS1taW5vciBheGlzIGFuZCBsb2NhdGlvbiAqL1xuICB2YXIgUlI7IC8qIGRpc3RhbmNlIGJldHdlZW4gY2VudGVyIGFuZCBsb2NhdGlvbiAqL1xuICB2YXIgQ1Q7IC8qIHNpbiBvZiBnZW9jZW50cmljIGxhdGl0dWRlICovXG4gIHZhciBTVDsgLyogY29zIG9mIGdlb2NlbnRyaWMgbGF0aXR1ZGUgKi9cbiAgdmFyIFJYO1xuICB2YXIgUks7XG4gIHZhciBSTjsgLyogRWFydGggcmFkaXVzIGF0IGxvY2F0aW9uICovXG4gIHZhciBDUEhJMDsgLyogY29zIG9mIHN0YXJ0IG9yIG9sZCBnZW9kZXRpYyBsYXRpdHVkZSBpbiBpdGVyYXRpb25zICovXG4gIHZhciBTUEhJMDsgLyogc2luIG9mIHN0YXJ0IG9yIG9sZCBnZW9kZXRpYyBsYXRpdHVkZSBpbiBpdGVyYXRpb25zICovXG4gIHZhciBDUEhJOyAvKiBjb3Mgb2Ygc2VhcmNoZWQgZ2VvZGV0aWMgbGF0aXR1ZGUgKi9cbiAgdmFyIFNQSEk7IC8qIHNpbiBvZiBzZWFyY2hlZCBnZW9kZXRpYyBsYXRpdHVkZSAqL1xuICB2YXIgU0RQSEk7IC8qIGVuZC1jcml0ZXJpdW06IGFkZGl0aW9uLXRoZW9yZW0gb2Ygc2luKExhdGl0dWRlKGl0ZXIpLUxhdGl0dWRlKGl0ZXItMSkpICovXG4gIHZhciBpdGVyOyAvKiAjIG9mIGNvbnRpbm91cyBpdGVyYXRpb24sIG1heC4gMzAgaXMgYWx3YXlzIGVub3VnaCAocy5hLikgKi9cblxuICB2YXIgWCA9IHAueDtcbiAgdmFyIFkgPSBwLnk7XG4gIHZhciBaID0gcC56ID8gcC56IDogMC4wOyAvL1ogdmFsdWUgbm90IGFsd2F5cyBzdXBwbGllZFxuICB2YXIgTG9uZ2l0dWRlO1xuICB2YXIgTGF0aXR1ZGU7XG4gIHZhciBIZWlnaHQ7XG5cbiAgUCA9IE1hdGguc3FydChYICogWCArIFkgKiBZKTtcbiAgUlIgPSBNYXRoLnNxcnQoWCAqIFggKyBZICogWSArIFogKiBaKTtcblxuICAvKiAgICAgIHNwZWNpYWwgY2FzZXMgZm9yIGxhdGl0dWRlIGFuZCBsb25naXR1ZGUgKi9cbiAgaWYgKFAgLyBhIDwgZ2VuYXUpIHtcblxuICAgIC8qICBzcGVjaWFsIGNhc2UsIGlmIFA9MC4gKFg9MC4sIFk9MC4pICovXG4gICAgTG9uZ2l0dWRlID0gMC4wO1xuXG4gICAgLyogIGlmIChYLFksWik9KDAuLDAuLDAuKSB0aGVuIEhlaWdodCBiZWNvbWVzIHNlbWktbWlub3IgYXhpc1xuICAgICAqICBvZiBlbGxpcHNvaWQgKD1jZW50ZXIgb2YgbWFzcyksIExhdGl0dWRlIGJlY29tZXMgUEkvMiAqL1xuICAgIGlmIChSUiAvIGEgPCBnZW5hdSkge1xuICAgICAgTGF0aXR1ZGUgPSBIQUxGX1BJO1xuICAgICAgSGVpZ2h0ID0gLWI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBwLngsXG4gICAgICAgIHk6IHAueSxcbiAgICAgICAgejogcC56XG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvKiAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBsb25naXR1ZGVcbiAgICAgKiAgaW50ZXJ2YWw6IC1QSSA8IExvbmdpdHVkZSA8PSArUEkgKi9cbiAgICBMb25naXR1ZGUgPSBNYXRoLmF0YW4yKFksIFgpO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRm9sbG93aW5nIGl0ZXJhdGl2ZSBhbGdvcml0aG0gd2FzIGRldmVsb3BwZWQgYnlcbiAgICogXCJJbnN0aXR1dCBmb3IgRXJkbWVzc3VuZ1wiLCBVbml2ZXJzaXR5IG9mIEhhbm5vdmVyLCBKdWx5IDE5ODguXG4gICAqIEludGVybmV0OiB3d3cuaWZlLnVuaS1oYW5ub3Zlci5kZVxuICAgKiBJdGVyYXRpdmUgY29tcHV0YXRpb24gb2YgQ1BISSxTUEhJIGFuZCBIZWlnaHQuXG4gICAqIEl0ZXJhdGlvbiBvZiBDUEhJIGFuZCBTUEhJIHRvIDEwKiotMTIgcmFkaWFuIHJlc3AuXG4gICAqIDIqMTAqKi03IGFyY3NlYy5cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG4gIENUID0gWiAvIFJSO1xuICBTVCA9IFAgLyBSUjtcbiAgUlggPSAxLjAgLyBNYXRoLnNxcnQoMS4wIC0gZXMgKiAoMi4wIC0gZXMpICogU1QgKiBTVCk7XG4gIENQSEkwID0gU1QgKiAoMS4wIC0gZXMpICogUlg7XG4gIFNQSEkwID0gQ1QgKiBSWDtcbiAgaXRlciA9IDA7XG5cbiAgLyogbG9vcCB0byBmaW5kIHNpbihMYXRpdHVkZSkgcmVzcC4gTGF0aXR1ZGVcbiAgICogdW50aWwgfHNpbihMYXRpdHVkZShpdGVyKS1MYXRpdHVkZShpdGVyLTEpKXwgPCBnZW5hdSAqL1xuICBkbyB7XG4gICAgaXRlcisrO1xuICAgIFJOID0gYSAvIE1hdGguc3FydCgxLjAgLSBlcyAqIFNQSEkwICogU1BISTApO1xuXG4gICAgLyogIGVsbGlwc29pZGFsIChnZW9kZXRpYykgaGVpZ2h0ICovXG4gICAgSGVpZ2h0ID0gUCAqIENQSEkwICsgWiAqIFNQSEkwIC0gUk4gKiAoMS4wIC0gZXMgKiBTUEhJMCAqIFNQSEkwKTtcblxuICAgIFJLID0gZXMgKiBSTiAvIChSTiArIEhlaWdodCk7XG4gICAgUlggPSAxLjAgLyBNYXRoLnNxcnQoMS4wIC0gUksgKiAoMi4wIC0gUkspICogU1QgKiBTVCk7XG4gICAgQ1BISSA9IFNUICogKDEuMCAtIFJLKSAqIFJYO1xuICAgIFNQSEkgPSBDVCAqIFJYO1xuICAgIFNEUEhJID0gU1BISSAqIENQSEkwIC0gQ1BISSAqIFNQSEkwO1xuICAgIENQSEkwID0gQ1BISTtcbiAgICBTUEhJMCA9IFNQSEk7XG4gIH1cbiAgd2hpbGUgKFNEUEhJICogU0RQSEkgPiBnZW5hdTIgJiYgaXRlciA8IG1heGl0ZXIpO1xuXG4gIC8qICAgICAgZWxsaXBzb2lkYWwgKGdlb2RldGljKSBsYXRpdHVkZSAqL1xuICBMYXRpdHVkZSA9IE1hdGguYXRhbihTUEhJIC8gTWF0aC5hYnMoQ1BISSkpO1xuICByZXR1cm4ge1xuICAgIHg6IExvbmdpdHVkZSxcbiAgICB5OiBMYXRpdHVkZSxcbiAgICB6OiBIZWlnaHRcbiAgfTtcbn0gLy8gY3NfZ2VvY2VudHJpY190b19nZW9kZXRpYygpXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLy8gcGpfZ2VvY2VudGljX3RvX3dnczg0KCBwIClcbi8vICBwID0gcG9pbnQgdG8gdHJhbnNmb3JtIGluIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXMgKHgseSx6KVxuXG5cbi8qKiBwb2ludCBvYmplY3QsIG5vdGhpbmcgZmFuY3ksIGp1c3QgYWxsb3dzIHZhbHVlcyB0byBiZVxuICAgIHBhc3NlZCBiYWNrIGFuZCBmb3J0aCBieSByZWZlcmVuY2UgcmF0aGVyIHRoYW4gYnkgdmFsdWUuXG4gICAgT3RoZXIgcG9pbnQgY2xhc3NlcyBtYXkgYmUgdXNlZCBhcyBsb25nIGFzIHRoZXkgaGF2ZVxuICAgIHggYW5kIHkgcHJvcGVydGllcywgd2hpY2ggd2lsbCBnZXQgbW9kaWZpZWQgaW4gdGhlIHRyYW5zZm9ybSBtZXRob2QuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGdlb2NlbnRyaWNUb1dnczg0KHAsIGRhdHVtX3R5cGUsIGRhdHVtX3BhcmFtcykge1xuXG4gIGlmIChkYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG4gICAgLy8gaWYoIHhbaW9dID09PSBIVUdFX1ZBTCApXG4gICAgLy8gICAgY29udGludWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHAueCArIGRhdHVtX3BhcmFtc1swXSxcbiAgICAgIHk6IHAueSArIGRhdHVtX3BhcmFtc1sxXSxcbiAgICAgIHo6IHAueiArIGRhdHVtX3BhcmFtc1syXSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKGRhdHVtX3R5cGUgPT09IFBKRF83UEFSQU0pIHtcbiAgICB2YXIgRHhfQkYgPSBkYXR1bV9wYXJhbXNbMF07XG4gICAgdmFyIER5X0JGID0gZGF0dW1fcGFyYW1zWzFdO1xuICAgIHZhciBEel9CRiA9IGRhdHVtX3BhcmFtc1syXTtcbiAgICB2YXIgUnhfQkYgPSBkYXR1bV9wYXJhbXNbM107XG4gICAgdmFyIFJ5X0JGID0gZGF0dW1fcGFyYW1zWzRdO1xuICAgIHZhciBSel9CRiA9IGRhdHVtX3BhcmFtc1s1XTtcbiAgICB2YXIgTV9CRiA9IGRhdHVtX3BhcmFtc1s2XTtcbiAgICAvLyBpZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogTV9CRiAqIChwLnggLSBSel9CRiAqIHAueSArIFJ5X0JGICogcC56KSArIER4X0JGLFxuICAgICAgeTogTV9CRiAqIChSel9CRiAqIHAueCArIHAueSAtIFJ4X0JGICogcC56KSArIER5X0JGLFxuICAgICAgejogTV9CRiAqICgtUnlfQkYgKiBwLnggKyBSeF9CRiAqIHAueSArIHAueikgKyBEel9CRlxuICAgIH07XG4gIH1cbn0gLy8gY3NfZ2VvY2VudHJpY190b193Z3M4NFxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8vIHBqX2dlb2NlbnRpY19mcm9tX3dnczg0KClcbi8vICBjb29yZGluYXRlIHN5c3RlbSBkZWZpbml0aW9uLFxuLy8gIHBvaW50IHRvIHRyYW5zZm9ybSBpbiBnZW9jZW50cmljIGNvb3JkaW5hdGVzICh4LHkseilcbmV4cG9ydCBmdW5jdGlvbiBnZW9jZW50cmljRnJvbVdnczg0KHAsIGRhdHVtX3R5cGUsIGRhdHVtX3BhcmFtcykge1xuXG4gIGlmIChkYXR1bV90eXBlID09PSBQSkRfM1BBUkFNKSB7XG4gICAgLy9pZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcC54IC0gZGF0dW1fcGFyYW1zWzBdLFxuICAgICAgeTogcC55IC0gZGF0dW1fcGFyYW1zWzFdLFxuICAgICAgejogcC56IC0gZGF0dW1fcGFyYW1zWzJdLFxuICAgIH07XG5cbiAgfSBlbHNlIGlmIChkYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSB7XG4gICAgdmFyIER4X0JGID0gZGF0dW1fcGFyYW1zWzBdO1xuICAgIHZhciBEeV9CRiA9IGRhdHVtX3BhcmFtc1sxXTtcbiAgICB2YXIgRHpfQkYgPSBkYXR1bV9wYXJhbXNbMl07XG4gICAgdmFyIFJ4X0JGID0gZGF0dW1fcGFyYW1zWzNdO1xuICAgIHZhciBSeV9CRiA9IGRhdHVtX3BhcmFtc1s0XTtcbiAgICB2YXIgUnpfQkYgPSBkYXR1bV9wYXJhbXNbNV07XG4gICAgdmFyIE1fQkYgPSBkYXR1bV9wYXJhbXNbNl07XG4gICAgdmFyIHhfdG1wID0gKHAueCAtIER4X0JGKSAvIE1fQkY7XG4gICAgdmFyIHlfdG1wID0gKHAueSAtIER5X0JGKSAvIE1fQkY7XG4gICAgdmFyIHpfdG1wID0gKHAueiAtIER6X0JGKSAvIE1fQkY7XG4gICAgLy9pZiggeFtpb10gPT09IEhVR0VfVkFMIClcbiAgICAvLyAgICBjb250aW51ZTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiB4X3RtcCArIFJ6X0JGICogeV90bXAgLSBSeV9CRiAqIHpfdG1wLFxuICAgICAgeTogLVJ6X0JGICogeF90bXAgKyB5X3RtcCArIFJ4X0JGICogel90bXAsXG4gICAgICB6OiBSeV9CRiAqIHhfdG1wIC0gUnhfQkYgKiB5X3RtcCArIHpfdG1wXG4gICAgfTtcbiAgfSAvL2NzX2dlb2NlbnRyaWNfZnJvbV93Z3M4NCgpXG59XG4iLCJpbXBvcnQge1xuICBQSkRfM1BBUkFNLFxuICBQSkRfN1BBUkFNLFxuICBQSkRfR1JJRFNISUZULFxuICBQSkRfTk9EQVRVTSxcbiAgUjJELFxuICBTUlNfV0dTODRfRVNRVUFSRUQsXG4gIFNSU19XR1M4NF9TRU1JTUFKT1IsIFNSU19XR1M4NF9TRU1JTUlOT1Jcbn0gZnJvbSAnLi9jb25zdGFudHMvdmFsdWVzJztcblxuaW1wb3J0IHtnZW9kZXRpY1RvR2VvY2VudHJpYywgZ2VvY2VudHJpY1RvR2VvZGV0aWMsIGdlb2NlbnRyaWNUb1dnczg0LCBnZW9jZW50cmljRnJvbVdnczg0LCBjb21wYXJlRGF0dW1zfSBmcm9tICcuL2RhdHVtVXRpbHMnO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSBcIi4vY29tbW9uL2FkanVzdF9sb25cIjtcbmZ1bmN0aW9uIGNoZWNrUGFyYW1zKHR5cGUpIHtcbiAgcmV0dXJuICh0eXBlID09PSBQSkRfM1BBUkFNIHx8IHR5cGUgPT09IFBKRF83UEFSQU0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzb3VyY2UsIGRlc3QsIHBvaW50KSB7XG4gIC8vIFNob3J0IGN1dCBpZiB0aGUgZGF0dW1zIGFyZSBpZGVudGljYWwuXG4gIGlmIChjb21wYXJlRGF0dW1zKHNvdXJjZSwgZGVzdCkpIHtcbiAgICByZXR1cm4gcG9pbnQ7IC8vIGluIHRoaXMgY2FzZSwgemVybyBpcyBzdWNlc3MsXG4gICAgLy8gd2hlcmVhcyBjc19jb21wYXJlX2RhdHVtcyByZXR1cm5zIDEgdG8gaW5kaWNhdGUgVFJVRVxuICAgIC8vIGNvbmZ1c2luZywgc2hvdWxkIGZpeCB0aGlzXG4gIH1cblxuICAvLyBFeHBsaWNpdGx5IHNraXAgZGF0dW0gdHJhbnNmb3JtIGJ5IHNldHRpbmcgJ2RhdHVtPW5vbmUnIGFzIHBhcmFtZXRlciBmb3IgZWl0aGVyIHNvdXJjZSBvciBkZXN0XG4gIGlmIChzb3VyY2UuZGF0dW1fdHlwZSA9PT0gUEpEX05PREFUVU0gfHwgZGVzdC5kYXR1bV90eXBlID09PSBQSkRfTk9EQVRVTSkge1xuICAgIHJldHVybiBwb2ludDtcbiAgfVxuXG4gIC8vIElmIHRoaXMgZGF0dW0gcmVxdWlyZXMgZ3JpZCBzaGlmdHMsIHRoZW4gYXBwbHkgaXQgdG8gZ2VvZGV0aWMgY29vcmRpbmF0ZXMuXG4gIHZhciBzb3VyY2VfYSA9IHNvdXJjZS5hO1xuICB2YXIgc291cmNlX2VzID0gc291cmNlLmVzO1xuICBpZiAoc291cmNlLmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpIHtcbiAgICB2YXIgZ3JpZFNoaWZ0Q29kZSA9IGFwcGx5R3JpZFNoaWZ0KHNvdXJjZSwgZmFsc2UsIHBvaW50KTtcbiAgICBpZiAoZ3JpZFNoaWZ0Q29kZSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc291cmNlX2EgPSBTUlNfV0dTODRfU0VNSU1BSk9SO1xuICAgIHNvdXJjZV9lcyA9IFNSU19XR1M4NF9FU1FVQVJFRDtcbiAgfVxuXG4gIHZhciBkZXN0X2EgPSBkZXN0LmE7XG4gIHZhciBkZXN0X2IgPSBkZXN0LmI7XG4gIHZhciBkZXN0X2VzID0gZGVzdC5lcztcbiAgaWYgKGRlc3QuZGF0dW1fdHlwZSA9PT0gUEpEX0dSSURTSElGVCkge1xuICAgIGRlc3RfYSA9IFNSU19XR1M4NF9TRU1JTUFKT1I7XG4gICAgZGVzdF9iID0gU1JTX1dHUzg0X1NFTUlNSU5PUjtcbiAgICBkZXN0X2VzID0gU1JTX1dHUzg0X0VTUVVBUkVEO1xuICB9XG5cbiAgLy8gRG8gd2UgbmVlZCB0byBnbyB0aHJvdWdoIGdlb2NlbnRyaWMgY29vcmRpbmF0ZXM/XG4gIGlmIChzb3VyY2VfZXMgPT09IGRlc3RfZXMgJiYgc291cmNlX2EgPT09IGRlc3RfYSAmJiAhY2hlY2tQYXJhbXMoc291cmNlLmRhdHVtX3R5cGUpICYmICAhY2hlY2tQYXJhbXMoZGVzdC5kYXR1bV90eXBlKSkge1xuICAgIHJldHVybiBwb2ludDtcbiAgfVxuXG4gIC8vIENvbnZlcnQgdG8gZ2VvY2VudHJpYyBjb29yZGluYXRlcy5cbiAgcG9pbnQgPSBnZW9kZXRpY1RvR2VvY2VudHJpYyhwb2ludCwgc291cmNlX2VzLCBzb3VyY2VfYSk7XG4gIC8vIENvbnZlcnQgYmV0d2VlbiBkYXR1bXNcbiAgaWYgKGNoZWNrUGFyYW1zKHNvdXJjZS5kYXR1bV90eXBlKSkge1xuICAgIHBvaW50ID0gZ2VvY2VudHJpY1RvV2dzODQocG9pbnQsIHNvdXJjZS5kYXR1bV90eXBlLCBzb3VyY2UuZGF0dW1fcGFyYW1zKTtcbiAgfVxuICBpZiAoY2hlY2tQYXJhbXMoZGVzdC5kYXR1bV90eXBlKSkge1xuICAgIHBvaW50ID0gZ2VvY2VudHJpY0Zyb21XZ3M4NChwb2ludCwgZGVzdC5kYXR1bV90eXBlLCBkZXN0LmRhdHVtX3BhcmFtcyk7XG4gIH1cbiAgcG9pbnQgPSBnZW9jZW50cmljVG9HZW9kZXRpYyhwb2ludCwgZGVzdF9lcywgZGVzdF9hLCBkZXN0X2IpO1xuXG4gIGlmIChkZXN0LmRhdHVtX3R5cGUgPT09IFBKRF9HUklEU0hJRlQpIHtcbiAgICB2YXIgZGVzdEdyaWRTaGlmdFJlc3VsdCA9IGFwcGx5R3JpZFNoaWZ0KGRlc3QsIHRydWUsIHBvaW50KTtcbiAgICBpZiAoZGVzdEdyaWRTaGlmdFJlc3VsdCAhPT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcG9pbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUdyaWRTaGlmdChzb3VyY2UsIGludmVyc2UsIHBvaW50KSB7XG4gIGlmIChzb3VyY2UuZ3JpZHMgPT09IG51bGwgfHwgc291cmNlLmdyaWRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnNvbGUubG9nKCdHcmlkIHNoaWZ0IGdyaWRzIG5vdCBmb3VuZCcpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICB2YXIgaW5wdXQgPSB7eDogLXBvaW50LngsIHk6IHBvaW50Lnl9O1xuICB2YXIgb3V0cHV0ID0ge3g6IE51bWJlci5OYU4sIHk6IE51bWJlci5OYU59O1xuICB2YXIgb25seU1hbmRhdG9yeUdyaWRzID0gZmFsc2U7XG4gIHZhciBhdHRlbXB0ZWRHcmlkcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5ncmlkcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBncmlkID0gc291cmNlLmdyaWRzW2ldO1xuICAgIGF0dGVtcHRlZEdyaWRzLnB1c2goZ3JpZC5uYW1lKTtcbiAgICBpZiAoZ3JpZC5pc051bGwpIHtcbiAgICAgIG91dHB1dCA9IGlucHV0O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIG9ubHlNYW5kYXRvcnlHcmlkcyA9IGdyaWQubWFuZGF0b3J5O1xuICAgIGlmIChncmlkLmdyaWQgPT09IG51bGwpIHtcbiAgICAgIGlmIChncmlkLm1hbmRhdG9yeSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBmaW5kIG1hbmRhdG9yeSBncmlkICdcIiArIGdyaWQubmFtZSArIFwiJ1wiKTtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHZhciBzdWJncmlkID0gZ3JpZC5ncmlkLnN1YmdyaWRzWzBdO1xuICAgIC8vIHNraXAgdGFibGVzIHRoYXQgZG9uJ3QgbWF0Y2ggb3VyIHBvaW50IGF0IGFsbFxuICAgIHZhciBlcHNpbG9uID0gKE1hdGguYWJzKHN1YmdyaWQuZGVsWzFdKSArIE1hdGguYWJzKHN1YmdyaWQuZGVsWzBdKSkgLyAxMDAwMC4wO1xuICAgIHZhciBtaW5YID0gc3ViZ3JpZC5sbFswXSAtIGVwc2lsb247XG4gICAgdmFyIG1pblkgPSBzdWJncmlkLmxsWzFdIC0gZXBzaWxvbjtcbiAgICB2YXIgbWF4WCA9IHN1YmdyaWQubGxbMF0gKyAoc3ViZ3JpZC5saW1bMF0gLSAxKSAqIHN1YmdyaWQuZGVsWzBdICsgZXBzaWxvbjtcbiAgICB2YXIgbWF4WSA9IHN1YmdyaWQubGxbMV0gKyAoc3ViZ3JpZC5saW1bMV0gLSAxKSAqIHN1YmdyaWQuZGVsWzFdICsgZXBzaWxvbjtcbiAgICBpZiAobWluWSA+IGlucHV0LnkgfHwgbWluWCA+IGlucHV0LnggfHwgbWF4WSA8IGlucHV0LnkgfHwgbWF4WCA8IGlucHV0LnggKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgb3V0cHV0ID0gYXBwbHlTdWJncmlkU2hpZnQoaW5wdXQsIGludmVyc2UsIHN1YmdyaWQpO1xuICAgIGlmICghaXNOYU4ob3V0cHV0LngpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGlzTmFOKG91dHB1dC54KSkge1xuICAgIGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIGZpbmQgYSBncmlkIHNoaWZ0IHRhYmxlIGZvciBsb2NhdGlvbiAnXCIrXG4gICAgICAtaW5wdXQueCAqIFIyRCArIFwiIFwiICsgaW5wdXQueSAqIFIyRCArIFwiIHRyaWVkOiAnXCIgKyBhdHRlbXB0ZWRHcmlkcyArIFwiJ1wiKTtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgcG9pbnQueCA9IC1vdXRwdXQueDtcbiAgcG9pbnQueSA9IG91dHB1dC55O1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gYXBwbHlTdWJncmlkU2hpZnQocGluLCBpbnZlcnNlLCBjdCkge1xuICB2YXIgdmFsID0ge3g6IE51bWJlci5OYU4sIHk6IE51bWJlci5OYU59O1xuICBpZiAoaXNOYU4ocGluLngpKSB7IHJldHVybiB2YWw7IH1cbiAgdmFyIHRiID0ge3g6IHBpbi54LCB5OiBwaW4ueX07XG4gIHRiLnggLT0gY3QubGxbMF07XG4gIHRiLnkgLT0gY3QubGxbMV07XG4gIHRiLnggPSBhZGp1c3RfbG9uKHRiLnggLSBNYXRoLlBJKSArIE1hdGguUEk7XG4gIHZhciB0ID0gbmFkSW50ZXJwb2xhdGUodGIsIGN0KTtcbiAgaWYgKGludmVyc2UpIHtcbiAgICBpZiAoaXNOYU4odC54KSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdC54ID0gdGIueCAtIHQueDtcbiAgICB0LnkgPSB0Yi55IC0gdC55O1xuICAgIHZhciBpID0gOSwgdG9sID0gMWUtMTI7XG4gICAgdmFyIGRpZiwgZGVsO1xuICAgIGRvIHtcbiAgICAgIGRlbCA9IG5hZEludGVycG9sYXRlKHQsIGN0KTtcbiAgICAgIGlmIChpc05hTihkZWwueCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJbnZlcnNlIGdyaWQgc2hpZnQgaXRlcmF0aW9uIGZhaWxlZCwgcHJlc3VtYWJseSBhdCBncmlkIGVkZ2UuICBVc2luZyBmaXJzdCBhcHByb3hpbWF0aW9uLlwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkaWYgPSB7eDogdGIueCAtIChkZWwueCArIHQueCksIHk6IHRiLnkgLSAoZGVsLnkgKyB0LnkpfTtcbiAgICAgIHQueCArPSBkaWYueDtcbiAgICAgIHQueSArPSBkaWYueTtcbiAgICB9IHdoaWxlIChpLS0gJiYgTWF0aC5hYnMoZGlmLngpID4gdG9sICYmIE1hdGguYWJzKGRpZi55KSA+IHRvbCk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkludmVyc2UgZ3JpZCBzaGlmdCBpdGVyYXRvciBmYWlsZWQgdG8gY29udmVyZ2UuXCIpO1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgdmFsLnggPSBhZGp1c3RfbG9uKHQueCArIGN0LmxsWzBdKTtcbiAgICB2YWwueSA9IHQueSArIGN0LmxsWzFdO1xuICB9IGVsc2Uge1xuICAgIGlmICghaXNOYU4odC54KSkge1xuICAgICAgdmFsLnggPSBwaW4ueCArIHQueDtcbiAgICAgIHZhbC55ID0gcGluLnkgKyB0Lnk7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIG5hZEludGVycG9sYXRlKHBpbiwgY3QpIHtcbiAgdmFyIHQgPSB7eDogcGluLnggLyBjdC5kZWxbMF0sIHk6IHBpbi55IC8gY3QuZGVsWzFdfTtcbiAgdmFyIGluZHggPSB7eDogTWF0aC5mbG9vcih0LngpLCB5OiBNYXRoLmZsb29yKHQueSl9O1xuICB2YXIgZnJjdCA9IHt4OiB0LnggLSAxLjAgKiBpbmR4LngsIHk6IHQueSAtIDEuMCAqIGluZHgueX07XG4gIHZhciB2YWw9IHt4OiBOdW1iZXIuTmFOLCB5OiBOdW1iZXIuTmFOfTtcbiAgdmFyIGlueDtcbiAgaWYgKGluZHgueCA8IDAgfHwgaW5keC54ID49IGN0LmxpbVswXSkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaWYgKGluZHgueSA8IDAgfHwgaW5keC55ID49IGN0LmxpbVsxXSkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaW54ID0gKGluZHgueSAqIGN0LmxpbVswXSkgKyBpbmR4Lng7XG4gIHZhciBmMDAgPSB7eDogY3QuY3ZzW2lueF1bMF0sIHk6IGN0LmN2c1tpbnhdWzFdfTtcbiAgaW54Kys7XG4gIHZhciBmMTA9IHt4OiBjdC5jdnNbaW54XVswXSwgeTogY3QuY3ZzW2lueF1bMV19O1xuICBpbnggKz0gY3QubGltWzBdO1xuICB2YXIgZjExID0ge3g6IGN0LmN2c1tpbnhdWzBdLCB5OiBjdC5jdnNbaW54XVsxXX07XG4gIGlueC0tO1xuICB2YXIgZjAxID0ge3g6IGN0LmN2c1tpbnhdWzBdLCB5OiBjdC5jdnNbaW54XVsxXX07XG4gIHZhciBtMTEgPSBmcmN0LnggKiBmcmN0LnksIG0xMCA9IGZyY3QueCAqICgxLjAgLSBmcmN0LnkpLFxuICAgIG0wMCA9ICgxLjAgLSBmcmN0LngpICogKDEuMCAtIGZyY3QueSksIG0wMSA9ICgxLjAgLSBmcmN0LngpICogZnJjdC55O1xuICB2YWwueCA9IChtMDAgKiBmMDAueCArIG0xMCAqIGYxMC54ICsgbTAxICogZjAxLnggKyBtMTEgKiBmMTEueCk7XG4gIHZhbC55ID0gKG0wMCAqIGYwMC55ICsgbTEwICogZjEwLnkgKyBtMDEgKiBmMDEueSArIG0xMSAqIGYxMS55KTtcbiAgcmV0dXJuIHZhbDtcbn1cbiIsImltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFsJztcbmltcG9ydCBwYXJzZVByb2ogZnJvbSAnLi9wcm9qU3RyaW5nJztcbmltcG9ydCB3a3QgZnJvbSAnd2t0LXBhcnNlcic7XG5cbmZ1bmN0aW9uIGRlZnMobmFtZSkge1xuICAvKmdsb2JhbCBjb25zb2xlKi9cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHZhciBkZWYgPSBhcmd1bWVudHNbMV07XG4gICAgaWYgKHR5cGVvZiBkZWYgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZGVmLmNoYXJBdCgwKSA9PT0gJysnKSB7XG4gICAgICAgIGRlZnNbbmFtZV0gPSBwYXJzZVByb2ooYXJndW1lbnRzWzFdKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWZzW25hbWVdID0gd2t0KGFyZ3VtZW50c1sxXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZnNbbmFtZV0gPSBkZWY7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUubWFwKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICBkZWZzLmFwcGx5KHRoYXQsIHYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlZnModik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChuYW1lIGluIGRlZnMpIHtcbiAgICAgICAgcmV0dXJuIGRlZnNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKCdFUFNHJyBpbiBuYW1lKSB7XG4gICAgICBkZWZzWydFUFNHOicgKyBuYW1lLkVQU0ddID0gbmFtZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJ0VTUkknIGluIG5hbWUpIHtcbiAgICAgIGRlZnNbJ0VTUkk6JyArIG5hbWUuRVNSSV0gPSBuYW1lO1xuICAgIH1cbiAgICBlbHNlIGlmICgnSUFVMjAwMCcgaW4gbmFtZSkge1xuICAgICAgZGVmc1snSUFVMjAwMDonICsgbmFtZS5JQVUyMDAwXSA9IG5hbWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc29sZS5sb2cobmFtZSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG5cbn1cbmdsb2JhbHMoZGVmcyk7XG5leHBvcnQgZGVmYXVsdCBkZWZzO1xuIiwiaW1wb3J0IHtTSVhUSCwgUkE0LCBSQTYsIEVQU0xOfSBmcm9tICcuL2NvbnN0YW50cy92YWx1ZXMnO1xuaW1wb3J0IHtkZWZhdWx0IGFzIEVsbGlwc29pZCwgV0dTODR9IGZyb20gJy4vY29uc3RhbnRzL0VsbGlwc29pZCc7XG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBlY2NlbnRyaWNpdHkoYSwgYiwgcmYsIFJfQSkge1xuICB2YXIgYTIgPSBhICogYTsgLy8gdXNlZCBpbiBnZW9jZW50cmljXG4gIHZhciBiMiA9IGIgKiBiOyAvLyB1c2VkIGluIGdlb2NlbnRyaWNcbiAgdmFyIGVzID0gKGEyIC0gYjIpIC8gYTI7IC8vIGUgXiAyXG4gIHZhciBlID0gMDtcbiAgaWYgKFJfQSkge1xuICAgIGEgKj0gMSAtIGVzICogKFNJWFRIICsgZXMgKiAoUkE0ICsgZXMgKiBSQTYpKTtcbiAgICBhMiA9IGEgKiBhO1xuICAgIGVzID0gMDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5zcXJ0KGVzKTsgLy8gZWNjZW50cmljaXR5XG4gIH1cbiAgdmFyIGVwMiA9IChhMiAtIGIyKSAvIGIyOyAvLyB1c2VkIGluIGdlb2NlbnRyaWNcbiAgcmV0dXJuIHtcbiAgICBlczogZXMsXG4gICAgZTogZSxcbiAgICBlcDI6IGVwMlxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNwaGVyZShhLCBiLCByZiwgZWxscHMsIHNwaGVyZSkge1xuICBpZiAoIWEpIHsgLy8gZG8gd2UgaGF2ZSBhbiBlbGxpcHNvaWQ/XG4gICAgdmFyIGVsbGlwc2UgPSBtYXRjaChFbGxpcHNvaWQsIGVsbHBzKTtcbiAgICBpZiAoIWVsbGlwc2UpIHtcbiAgICAgIGVsbGlwc2UgPSBXR1M4NDtcbiAgICB9XG4gICAgYSA9IGVsbGlwc2UuYTtcbiAgICBiID0gZWxsaXBzZS5iO1xuICAgIHJmID0gZWxsaXBzZS5yZjtcbiAgfVxuXG4gIGlmIChyZiAmJiAhYikge1xuICAgIGIgPSAoMS4wIC0gMS4wIC8gcmYpICogYTtcbiAgfVxuICBpZiAocmYgPT09IDAgfHwgTWF0aC5hYnMoYSAtIGIpIDwgRVBTTE4pIHtcbiAgICBzcGhlcmUgPSB0cnVlO1xuICAgIGIgPSBhO1xuICB9XG4gIHJldHVybiB7XG4gICAgYTogYSxcbiAgICBiOiBiLFxuICAgIHJmOiByZixcbiAgICBzcGhlcmU6IHNwaGVyZVxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICBkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uIHx8IHt9O1xuICB2YXIgdmFsdWUsIHByb3BlcnR5O1xuICBpZiAoIXNvdXJjZSkge1xuICAgIHJldHVybiBkZXN0aW5hdGlvbjtcbiAgfVxuICBmb3IgKHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgIHZhbHVlID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlZnMpIHtcbiAgZGVmcygnRVBTRzo0MzI2JywgXCIrdGl0bGU9V0dTIDg0IChsb25nL2xhdCkgK3Byb2o9bG9uZ2xhdCArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICt1bml0cz1kZWdyZWVzXCIpO1xuICBkZWZzKCdFUFNHOjQyNjknLCBcIit0aXRsZT1OQUQ4MyAobG9uZy9sYXQpICtwcm9qPWxvbmdsYXQgK2E9NjM3ODEzNy4wICtiPTYzNTY3NTIuMzE0MTQwMzYgK2VsbHBzPUdSUzgwICtkYXR1bT1OQUQ4MyArdW5pdHM9ZGVncmVlc1wiKTtcbiAgZGVmcygnRVBTRzozODU3JywgXCIrdGl0bGU9V0dTIDg0IC8gUHNldWRvLU1lcmNhdG9yICtwcm9qPW1lcmMgK2E9NjM3ODEzNyArYj02Mzc4MTM3ICtsYXRfdHM9MC4wICtsb25fMD0wLjAgK3hfMD0wLjAgK3lfMD0wICtrPTEuMCArdW5pdHM9bSArbmFkZ3JpZHM9QG51bGwgK25vX2RlZnNcIik7XG5cbiAgZGVmcy5XR1M4NCA9IGRlZnNbJ0VQU0c6NDMyNiddO1xuICBkZWZzWydFUFNHOjM3ODUnXSA9IGRlZnNbJ0VQU0c6Mzg1NyddOyAvLyBtYWludGFpbiBiYWNrd2FyZCBjb21wYXQsIG9mZmljaWFsIGNvZGUgaXMgMzg1N1xuICBkZWZzLkdPT0dMRSA9IGRlZnNbJ0VQU0c6Mzg1NyddO1xuICBkZWZzWydFUFNHOjkwMDkxMyddID0gZGVmc1snRVBTRzozODU3J107XG4gIGRlZnNbJ0VQU0c6MTAyMTEzJ10gPSBkZWZzWydFUFNHOjM4NTcnXTtcbn1cbiIsImltcG9ydCBwcm9qNCBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IFByb2ogZnJvbSBcIi4vUHJvalwiO1xuaW1wb3J0IFBvaW50IGZyb20gXCIuL1BvaW50XCI7XG5pbXBvcnQgY29tbW9uIGZyb20gXCIuL2NvbW1vbi90b1BvaW50XCI7XG5pbXBvcnQgZGVmcyBmcm9tIFwiLi9kZWZzXCI7XG5pbXBvcnQgbmFkZ3JpZCBmcm9tIFwiLi9uYWRncmlkXCI7XG5pbXBvcnQgdHJhbnNmb3JtIGZyb20gXCIuL3RyYW5zZm9ybVwiO1xuaW1wb3J0IG1ncnMgZnJvbSBcIm1ncnNcIjtcbmltcG9ydCBpbmNsdWRlZFByb2plY3Rpb25zIGZyb20gXCIuLi9wcm9qc1wiO1xuXG5wcm9qNC5kZWZhdWx0RGF0dW0gPSAnV0dTODQnOyAvL2RlZmF1bHQgZGF0dW1cbnByb2o0LlByb2ogPSBQcm9qO1xucHJvajQuV0dTODQgPSBuZXcgcHJvajQuUHJvaignV0dTODQnKTtcbnByb2o0LlBvaW50ID0gUG9pbnQ7XG5wcm9qNC50b1BvaW50ID0gY29tbW9uO1xucHJvajQuZGVmcyA9IGRlZnM7XG5wcm9qNC5uYWRncmlkID0gbmFkZ3JpZDtcbnByb2o0LnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcbnByb2o0Lm1ncnMgPSBtZ3JzO1xucHJvajQudmVyc2lvbiA9ICdfX1ZFUlNJT05fXyc7XG5pbmNsdWRlZFByb2plY3Rpb25zKHByb2o0KTtcbmV4cG9ydCBkZWZhdWx0IHByb2o0O1xuIiwidmFyIGlnbm9yZWRDaGFyID0gL1tcXHNfXFwtXFwvXFwoXFwpXS9nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2gob2JqLCBrZXkpIHtcbiAgaWYgKG9ialtrZXldKSB7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgdmFyIGxrZXkgPSBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGlnbm9yZWRDaGFyLCAnJyk7XG4gIHZhciBpID0gLTE7XG4gIHZhciB0ZXN0a2V5LCBwcm9jZXNzZWRLZXk7XG4gIHdoaWxlICgrK2kgPCBrZXlzLmxlbmd0aCkge1xuICAgIHRlc3RrZXkgPSBrZXlzW2ldO1xuICAgIHByb2Nlc3NlZEtleSA9IHRlc3RrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKGlnbm9yZWRDaGFyLCAnJyk7XG4gICAgaWYgKHByb2Nlc3NlZEtleSA9PT0gbGtleSkge1xuICAgICAgcmV0dXJuIG9ialt0ZXN0a2V5XTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogUmVzb3VyY2VzIGZvciBkZXRhaWxzIG9mIE5UdjIgZmlsZSBmb3JtYXRzOlxuICogLSBodHRwczovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxNDAxMjcyMDQ4MjJpZl8vaHR0cDovL3d3dy5tZ3MuZ292Lm9uLmNhOjgwL3N0ZHByb2Rjb25zdW1lL2dyb3Vwcy9jb250ZW50L0BtZ3MvQGlhbmRpdC9kb2N1bWVudHMvcmVzb3VyY2VsaXN0L3N0ZWwwMl8wNDc0NDcucGRmXG4gKiAtIGh0dHA6Ly9taW1ha2EuY29tL2hlbHAvZ3MvaHRtbC8wMDRfTlRWMiUyMERhdGElMjBGb3JtYXQuaHRtXG4gKi9cblxudmFyIGxvYWRlZE5hZGdyaWRzID0ge307XG5cbi8qKlxuICogTG9hZCBhIGJpbmFyeSBOVHYyIGZpbGUgKC5nc2IpIHRvIGEga2V5IHRoYXQgY2FuIGJlIHVzZWQgaW4gYSBwcm9qIHN0cmluZyBsaWtlICtuYWRncmlkcz08a2V5Pi4gUGFzcyB0aGUgTlR2MiBmaWxlXG4gKiBhcyBhbiBBcnJheUJ1ZmZlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmFkZ3JpZChrZXksIGRhdGEpIHtcbiAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoZGF0YSk7XG4gIHZhciBpc0xpdHRsZUVuZGlhbiA9IGRldGVjdExpdHRsZUVuZGlhbih2aWV3KTtcbiAgdmFyIGhlYWRlciA9IHJlYWRIZWFkZXIodmlldywgaXNMaXR0bGVFbmRpYW4pO1xuICBpZiAoaGVhZGVyLm5TdWJncmlkcyA+IDEpIHtcbiAgICBjb25zb2xlLmxvZygnT25seSBzaW5nbGUgTlR2MiBzdWJncmlkcyBhcmUgY3VycmVudGx5IHN1cHBvcnRlZCwgc3Vic2VxdWVudCBzdWIgZ3JpZHMgYXJlIGlnbm9yZWQnKTtcbiAgfVxuICB2YXIgc3ViZ3JpZHMgPSByZWFkU3ViZ3JpZHModmlldywgaGVhZGVyLCBpc0xpdHRsZUVuZGlhbik7XG4gIHZhciBuYWRncmlkID0ge2hlYWRlcjogaGVhZGVyLCBzdWJncmlkczogc3ViZ3JpZHN9O1xuICBsb2FkZWROYWRncmlkc1trZXldID0gbmFkZ3JpZDtcbiAgcmV0dXJuIG5hZGdyaWQ7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBwcm9qNCB2YWx1ZSBmb3IgbmFkZ3JpZHMsIHJldHVybiBhbiBhcnJheSBvZiBsb2FkZWQgZ3JpZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5hZGdyaWRzKG5hZGdyaWRzKSB7XG4gIC8vIEZvcm1hdCBkZXRhaWxzOiBodHRwOi8vcHJvai5tYXB0b29scy5vcmcvZ2VuX3Bhcm1zLmh0bWxcbiAgaWYgKG5hZGdyaWRzID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIG51bGw7IH1cbiAgdmFyIGdyaWRzID0gbmFkZ3JpZHMuc3BsaXQoJywnKTtcbiAgcmV0dXJuIGdyaWRzLm1hcChwYXJzZU5hZGdyaWRTdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5hZGdyaWRTdHJpbmcodmFsdWUpIHtcbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBvcHRpb25hbCA9IHZhbHVlWzBdID09PSAnQCc7XG4gIGlmIChvcHRpb25hbCkge1xuICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSk7XG4gIH1cbiAgaWYgKHZhbHVlID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4ge25hbWU6ICdudWxsJywgbWFuZGF0b3J5OiAhb3B0aW9uYWwsIGdyaWQ6IG51bGwsIGlzTnVsbDogdHJ1ZX07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiB2YWx1ZSxcbiAgICBtYW5kYXRvcnk6ICFvcHRpb25hbCxcbiAgICBncmlkOiBsb2FkZWROYWRncmlkc1t2YWx1ZV0gfHwgbnVsbCxcbiAgICBpc051bGw6IGZhbHNlXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlY29uZHNUb1JhZGlhbnMoc2Vjb25kcykge1xuICByZXR1cm4gKHNlY29uZHMgLyAzNjAwKSAqIE1hdGguUEkgLyAxODA7XG59XG5cbmZ1bmN0aW9uIGRldGVjdExpdHRsZUVuZGlhbih2aWV3KSB7XG4gIHZhciBuRmllbGRzID0gdmlldy5nZXRJbnQzMig4LCBmYWxzZSk7XG4gIGlmIChuRmllbGRzID09PSAxMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBuRmllbGRzID0gdmlldy5nZXRJbnQzMig4LCB0cnVlKTtcbiAgaWYgKG5GaWVsZHMgIT09IDExKSB7XG4gICAgY29uc29sZS53YXJuKCdGYWlsZWQgdG8gZGV0ZWN0IG5hZGdyaWQgZW5kaWFuLW5lc3MsIGRlZmF1bHRpbmcgdG8gbGl0dGxlLWVuZGlhbicpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZWFkSGVhZGVyKHZpZXcsIGlzTGl0dGxlRW5kaWFuKSB7XG4gIHJldHVybiB7XG4gICAgbkZpZWxkczogdmlldy5nZXRJbnQzMig4LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgblN1YmdyaWRGaWVsZHM6IHZpZXcuZ2V0SW50MzIoMjQsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBuU3ViZ3JpZHM6IHZpZXcuZ2V0SW50MzIoNDAsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBzaGlmdFR5cGU6IGRlY29kZVN0cmluZyh2aWV3LCA1NiwgNTYgKyA4KS50cmltKCksXG4gICAgZnJvbVNlbWlNYWpvckF4aXM6IHZpZXcuZ2V0RmxvYXQ2NCgxMjAsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBmcm9tU2VtaU1pbm9yQXhpczogdmlldy5nZXRGbG9hdDY0KDEzNiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHRvU2VtaU1ham9yQXhpczogdmlldy5nZXRGbG9hdDY0KDE1MiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHRvU2VtaU1pbm9yQXhpczogdmlldy5nZXRGbG9hdDY0KDE2OCwgaXNMaXR0bGVFbmRpYW4pLFxuICB9O1xufVxuXG5mdW5jdGlvbiBkZWNvZGVTdHJpbmcodmlldywgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDhBcnJheSh2aWV3LmJ1ZmZlci5zbGljZShzdGFydCwgZW5kKSkpO1xufVxuXG5mdW5jdGlvbiByZWFkU3ViZ3JpZHModmlldywgaGVhZGVyLCBpc0xpdHRsZUVuZGlhbikge1xuICB2YXIgZ3JpZE9mZnNldCA9IDE3NjtcbiAgdmFyIGdyaWRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaGVhZGVyLm5TdWJncmlkczsgaSsrKSB7XG4gICAgdmFyIHN1YkhlYWRlciA9IHJlYWRHcmlkSGVhZGVyKHZpZXcsIGdyaWRPZmZzZXQsIGlzTGl0dGxlRW5kaWFuKTtcbiAgICB2YXIgbm9kZXMgPSByZWFkR3JpZE5vZGVzKHZpZXcsIGdyaWRPZmZzZXQsIHN1YkhlYWRlciwgaXNMaXR0bGVFbmRpYW4pO1xuICAgIHZhciBsbmdDb2x1bW5Db3VudCA9IE1hdGgucm91bmQoXG4gICAgICAxICsgKHN1YkhlYWRlci51cHBlckxvbmdpdHVkZSAtIHN1YkhlYWRlci5sb3dlckxvbmdpdHVkZSkgLyBzdWJIZWFkZXIubG9uZ2l0dWRlSW50ZXJ2YWwpO1xuICAgIHZhciBsYXRDb2x1bW5Db3VudCA9IE1hdGgucm91bmQoXG4gICAgICAxICsgKHN1YkhlYWRlci51cHBlckxhdGl0dWRlIC0gc3ViSGVhZGVyLmxvd2VyTGF0aXR1ZGUpIC8gc3ViSGVhZGVyLmxhdGl0dWRlSW50ZXJ2YWwpO1xuICAgIC8vIFByb2o0IG9wZXJhdGVzIG9uIHJhZGlhbnMgd2hlcmVhcyB0aGUgY29vcmRpbmF0ZXMgYXJlIGluIHNlY29uZHMgaW4gdGhlIGdyaWRcbiAgICBncmlkcy5wdXNoKHtcbiAgICAgIGxsOiBbc2Vjb25kc1RvUmFkaWFucyhzdWJIZWFkZXIubG93ZXJMb25naXR1ZGUpLCBzZWNvbmRzVG9SYWRpYW5zKHN1YkhlYWRlci5sb3dlckxhdGl0dWRlKV0sXG4gICAgICBkZWw6IFtzZWNvbmRzVG9SYWRpYW5zKHN1YkhlYWRlci5sb25naXR1ZGVJbnRlcnZhbCksIHNlY29uZHNUb1JhZGlhbnMoc3ViSGVhZGVyLmxhdGl0dWRlSW50ZXJ2YWwpXSxcbiAgICAgIGxpbTogW2xuZ0NvbHVtbkNvdW50LCBsYXRDb2x1bW5Db3VudF0sXG4gICAgICBjb3VudDogc3ViSGVhZGVyLmdyaWROb2RlQ291bnQsXG4gICAgICBjdnM6IG1hcE5vZGVzKG5vZGVzKVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBncmlkcztcbn1cblxuZnVuY3Rpb24gbWFwTm9kZXMobm9kZXMpIHtcbiAgcmV0dXJuIG5vZGVzLm1hcChmdW5jdGlvbiAocikge3JldHVybiBbc2Vjb25kc1RvUmFkaWFucyhyLmxvbmdpdHVkZVNoaWZ0KSwgc2Vjb25kc1RvUmFkaWFucyhyLmxhdGl0dWRlU2hpZnQpXTt9KTtcbn1cblxuZnVuY3Rpb24gcmVhZEdyaWRIZWFkZXIodmlldywgb2Zmc2V0LCBpc0xpdHRsZUVuZGlhbikge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IGRlY29kZVN0cmluZyh2aWV3LCBvZmZzZXQgKyA4LCBvZmZzZXQgKyAxNikudHJpbSgpLFxuICAgIHBhcmVudDogZGVjb2RlU3RyaW5nKHZpZXcsIG9mZnNldCArIDI0LCBvZmZzZXQgKyAyNCArIDgpLnRyaW0oKSxcbiAgICBsb3dlckxhdGl0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgNzIsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICB1cHBlckxhdGl0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgODgsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICBsb3dlckxvbmdpdHVkZTogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDEwNCwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIHVwcGVyTG9uZ2l0dWRlOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgMTIwLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgbGF0aXR1ZGVJbnRlcnZhbDogdmlldy5nZXRGbG9hdDY0KG9mZnNldCArIDEzNiwgaXNMaXR0bGVFbmRpYW4pLFxuICAgIGxvbmdpdHVkZUludGVydmFsOiB2aWV3LmdldEZsb2F0NjQob2Zmc2V0ICsgMTUyLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgZ3JpZE5vZGVDb3VudDogdmlldy5nZXRJbnQzMihvZmZzZXQgKyAxNjgsIGlzTGl0dGxlRW5kaWFuKVxuICB9O1xufVxuXG5mdW5jdGlvbiByZWFkR3JpZE5vZGVzKHZpZXcsIG9mZnNldCwgZ3JpZEhlYWRlciwgaXNMaXR0bGVFbmRpYW4pIHtcbiAgdmFyIG5vZGVzT2Zmc2V0ID0gb2Zmc2V0ICsgMTc2O1xuICB2YXIgZ3JpZFJlY29yZExlbmd0aCA9IDE2O1xuICB2YXIgZ3JpZFNoaWZ0UmVjb3JkcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGdyaWRIZWFkZXIuZ3JpZE5vZGVDb3VudDsgaSsrKSB7XG4gICAgdmFyIHJlY29yZCA9IHtcbiAgICAgIGxhdGl0dWRlU2hpZnQ6IHZpZXcuZ2V0RmxvYXQzMihub2Rlc09mZnNldCArIGkgKiBncmlkUmVjb3JkTGVuZ3RoLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgICBsb25naXR1ZGVTaGlmdDogdmlldy5nZXRGbG9hdDMyKG5vZGVzT2Zmc2V0ICsgaSAqIGdyaWRSZWNvcmRMZW5ndGggKyA0LCBpc0xpdHRsZUVuZGlhbiksXG4gICAgICBsYXRpdHVkZUFjY3VyYWN5OiB2aWV3LmdldEZsb2F0MzIobm9kZXNPZmZzZXQgKyBpICogZ3JpZFJlY29yZExlbmd0aCArIDgsIGlzTGl0dGxlRW5kaWFuKSxcbiAgICAgIGxvbmdpdHVkZUFjY3VyYWN5OiB2aWV3LmdldEZsb2F0MzIobm9kZXNPZmZzZXQgKyBpICogZ3JpZFJlY29yZExlbmd0aCArIDEyLCBpc0xpdHRsZUVuZGlhbiksXG4gICAgfTtcbiAgICBncmlkU2hpZnRSZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgfVxuICByZXR1cm4gZ3JpZFNoaWZ0UmVjb3Jkcztcbn1cbiIsImltcG9ydCBkZWZzIGZyb20gJy4vZGVmcyc7XG5pbXBvcnQgd2t0IGZyb20gJ3drdC1wYXJzZXInO1xuaW1wb3J0IHByb2pTdHIgZnJvbSAnLi9wcm9qU3RyaW5nJztcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJztcbmZ1bmN0aW9uIHRlc3RPYmooY29kZSl7XG4gIHJldHVybiB0eXBlb2YgY29kZSA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiB0ZXN0RGVmKGNvZGUpe1xuICByZXR1cm4gY29kZSBpbiBkZWZzO1xufVxudmFyIGNvZGVXb3JkcyA9IFsnUFJPSkVDVEVEQ1JTJywgJ1BST0pDUlMnLCAnR0VPR0NTJywnR0VPQ0NTJywnUFJPSkNTJywnTE9DQUxfQ1MnLCAnR0VPRENSUycsICdHRU9ERVRJQ0NSUycsICdHRU9ERVRJQ0RBVFVNJywgJ0VOR0NSUycsICdFTkdJTkVFUklOR0NSUyddO1xuZnVuY3Rpb24gdGVzdFdLVChjb2RlKXtcbiAgcmV0dXJuIGNvZGVXb3Jkcy5zb21lKGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgcmV0dXJuIGNvZGUuaW5kZXhPZih3b3JkKSA+IC0xO1xuICB9KTtcbn1cbnZhciBjb2RlcyA9IFsnMzg1NycsICc5MDA5MTMnLCAnMzc4NScsICcxMDIxMTMnXTtcbmZ1bmN0aW9uIGNoZWNrTWVyY2F0b3IoaXRlbSkge1xuICB2YXIgYXV0aCA9IG1hdGNoKGl0ZW0sICdhdXRob3JpdHknKTtcbiAgaWYgKCFhdXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBjb2RlID0gbWF0Y2goYXV0aCwgJ2Vwc2cnKTtcbiAgcmV0dXJuIGNvZGUgJiYgY29kZXMuaW5kZXhPZihjb2RlKSA+IC0xO1xufVxuZnVuY3Rpb24gY2hlY2tQcm9qU3RyKGl0ZW0pIHtcbiAgdmFyIGV4dCA9IG1hdGNoKGl0ZW0sICdleHRlbnNpb24nKTtcbiAgaWYgKCFleHQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcmV0dXJuIG1hdGNoKGV4dCwgJ3Byb2o0Jyk7XG59XG5mdW5jdGlvbiB0ZXN0UHJvaihjb2RlKXtcbiAgcmV0dXJuIGNvZGVbMF0gPT09ICcrJztcbn1cbmZ1bmN0aW9uIHBhcnNlKGNvZGUpe1xuICBpZiAodGVzdE9iaihjb2RlKSkge1xuICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoaXMgaXMgYSBXS1Qgc3RyaW5nXG4gICAgaWYgKHRlc3REZWYoY29kZSkpIHtcbiAgICAgIHJldHVybiBkZWZzW2NvZGVdO1xuICAgIH1cbiAgICBpZiAodGVzdFdLVChjb2RlKSkge1xuICAgICAgdmFyIG91dCA9IHdrdChjb2RlKTtcbiAgICAgIC8vIHRlc3Qgb2Ygc3BldGlhbCBjYXNlLCBkdWUgdG8gdGhpcyBiZWluZyBhIHZlcnkgY29tbW9uIGFuZCBvZnRlbiBtYWxmb3JtZWRcbiAgICAgIGlmIChjaGVja01lcmNhdG9yKG91dCkpIHtcbiAgICAgICAgcmV0dXJuIGRlZnNbJ0VQU0c6Mzg1NyddO1xuICAgICAgfVxuICAgICAgdmFyIG1heWJlUHJvalN0ciA9IGNoZWNrUHJvalN0cihvdXQpO1xuICAgICAgaWYgKG1heWJlUHJvalN0cikge1xuICAgICAgICByZXR1cm4gcHJvalN0cihtYXliZVByb2pTdHIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgaWYgKHRlc3RQcm9qKGNvZGUpKSB7XG4gICAgICByZXR1cm4gcHJvalN0cihjb2RlKTtcbiAgICB9XG4gIH1lbHNle1xuICAgIHJldHVybiBjb2RlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlO1xuIiwiaW1wb3J0IHtEMlJ9IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgUHJpbWVNZXJpZGlhbiBmcm9tICcuL2NvbnN0YW50cy9QcmltZU1lcmlkaWFuJztcbmltcG9ydCB1bml0cyBmcm9tICcuL2NvbnN0YW50cy91bml0cyc7XG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlZkRhdGEpIHtcbiAgdmFyIHNlbGYgPSB7fTtcbiAgdmFyIHBhcmFtT2JqID0gZGVmRGF0YS5zcGxpdCgnKycpLm1hcChmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIHYudHJpbSgpO1xuICB9KS5maWx0ZXIoZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9KS5yZWR1Y2UoZnVuY3Rpb24ocCwgYSkge1xuICAgIHZhciBzcGxpdCA9IGEuc3BsaXQoJz0nKTtcbiAgICBzcGxpdC5wdXNoKHRydWUpO1xuICAgIHBbc3BsaXRbMF0udG9Mb3dlckNhc2UoKV0gPSBzcGxpdFsxXTtcbiAgICByZXR1cm4gcDtcbiAgfSwge30pO1xuICB2YXIgcGFyYW1OYW1lLCBwYXJhbVZhbCwgcGFyYW1PdXRuYW1lO1xuICB2YXIgcGFyYW1zID0ge1xuICAgIHByb2o6ICdwcm9qTmFtZScsXG4gICAgZGF0dW06ICdkYXR1bUNvZGUnLFxuICAgIHJmOiBmdW5jdGlvbih2KSB7XG4gICAgICBzZWxmLnJmID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGxhdF8wOiBmdW5jdGlvbih2KSB7XG4gICAgICBzZWxmLmxhdDAgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbGF0XzE6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYubGF0MSA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICBsYXRfMjogZnVuY3Rpb24odikge1xuICAgICAgc2VsZi5sYXQyID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIGxhdF90czogZnVuY3Rpb24odikge1xuICAgICAgc2VsZi5sYXRfdHMgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbG9uXzA6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYubG9uZzAgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbG9uXzE6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYubG9uZzEgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgbG9uXzI6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYubG9uZzIgPSB2ICogRDJSO1xuICAgIH0sXG4gICAgYWxwaGE6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYuYWxwaGEgPSBwYXJzZUZsb2F0KHYpICogRDJSO1xuICAgIH0sXG4gICAgZ2FtbWE6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYucmVjdGlmaWVkX2dyaWRfYW5nbGUgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgbG9uYzogZnVuY3Rpb24odikge1xuICAgICAgc2VsZi5sb25nYyA9IHYgKiBEMlI7XG4gICAgfSxcbiAgICB4XzA6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYueDAgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgeV8wOiBmdW5jdGlvbih2KSB7XG4gICAgICBzZWxmLnkwID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGtfMDogZnVuY3Rpb24odikge1xuICAgICAgc2VsZi5rMCA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBrOiBmdW5jdGlvbih2KSB7XG4gICAgICBzZWxmLmswID0gcGFyc2VGbG9hdCh2KTtcbiAgICB9LFxuICAgIGE6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYuYSA9IHBhcnNlRmxvYXQodik7XG4gICAgfSxcbiAgICBiOiBmdW5jdGlvbih2KSB7XG4gICAgICBzZWxmLmIgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgcl9hOiBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuUl9BID0gdHJ1ZTtcbiAgICB9LFxuICAgIHpvbmU6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYuem9uZSA9IHBhcnNlSW50KHYsIDEwKTtcbiAgICB9LFxuICAgIHNvdXRoOiBmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYudXRtU291dGggPSB0cnVlO1xuICAgIH0sXG4gICAgdG93Z3M4NDogZnVuY3Rpb24odikge1xuICAgICAgc2VsZi5kYXR1bV9wYXJhbXMgPSB2LnNwbGl0KFwiLFwiKS5tYXAoZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChhKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdG9fbWV0ZXI6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYudG9fbWV0ZXIgPSBwYXJzZUZsb2F0KHYpO1xuICAgIH0sXG4gICAgdW5pdHM6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIHNlbGYudW5pdHMgPSB2O1xuICAgICAgdmFyIHVuaXQgPSBtYXRjaCh1bml0cywgdik7XG4gICAgICBpZiAodW5pdCkge1xuICAgICAgICBzZWxmLnRvX21ldGVyID0gdW5pdC50b19tZXRlcjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZyb21fZ3JlZW53aWNoOiBmdW5jdGlvbih2KSB7XG4gICAgICBzZWxmLmZyb21fZ3JlZW53aWNoID0gdiAqIEQyUjtcbiAgICB9LFxuICAgIHBtOiBmdW5jdGlvbih2KSB7XG4gICAgICB2YXIgcG0gPSBtYXRjaChQcmltZU1lcmlkaWFuLCB2KTtcbiAgICAgIHNlbGYuZnJvbV9ncmVlbndpY2ggPSAocG0gPyBwbSA6IHBhcnNlRmxvYXQodikpICogRDJSO1xuICAgIH0sXG4gICAgbmFkZ3JpZHM6IGZ1bmN0aW9uKHYpIHtcbiAgICAgIGlmICh2ID09PSAnQG51bGwnKSB7XG4gICAgICAgIHNlbGYuZGF0dW1Db2RlID0gJ25vbmUnO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNlbGYubmFkZ3JpZHMgPSB2O1xuICAgICAgfVxuICAgIH0sXG4gICAgYXhpczogZnVuY3Rpb24odikge1xuICAgICAgdmFyIGxlZ2FsQXhpcyA9IFwiZXduc3VkXCI7XG4gICAgICBpZiAodi5sZW5ndGggPT09IDMgJiYgbGVnYWxBeGlzLmluZGV4T2Yodi5zdWJzdHIoMCwgMSkpICE9PSAtMSAmJiBsZWdhbEF4aXMuaW5kZXhPZih2LnN1YnN0cigxLCAxKSkgIT09IC0xICYmIGxlZ2FsQXhpcy5pbmRleE9mKHYuc3Vic3RyKDIsIDEpKSAhPT0gLTEpIHtcbiAgICAgICAgc2VsZi5heGlzID0gdjtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFwcHJveDogZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLmFwcHJveCA9IHRydWU7XG4gICAgfVxuICB9O1xuICBmb3IgKHBhcmFtTmFtZSBpbiBwYXJhbU9iaikge1xuICAgIHBhcmFtVmFsID0gcGFyYW1PYmpbcGFyYW1OYW1lXTtcbiAgICBpZiAocGFyYW1OYW1lIGluIHBhcmFtcykge1xuICAgICAgcGFyYW1PdXRuYW1lID0gcGFyYW1zW3BhcmFtTmFtZV07XG4gICAgICBpZiAodHlwZW9mIHBhcmFtT3V0bmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwYXJhbU91dG5hbWUocGFyYW1WYWwpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHNlbGZbcGFyYW1PdXRuYW1lXSA9IHBhcmFtVmFsO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHNlbGZbcGFyYW1OYW1lXSA9IHBhcmFtVmFsO1xuICAgIH1cbiAgfVxuICBpZih0eXBlb2Ygc2VsZi5kYXR1bUNvZGUgPT09ICdzdHJpbmcnICYmIHNlbGYuZGF0dW1Db2RlICE9PSBcIldHUzg0XCIpe1xuICAgIHNlbGYuZGF0dW1Db2RlID0gc2VsZi5kYXR1bUNvZGUudG9Mb3dlckNhc2UoKTtcbiAgfVxuICByZXR1cm4gc2VsZjtcbn1cbiIsImltcG9ydCBtZXJjIGZyb20gXCIuL3Byb2plY3Rpb25zL21lcmNcIjtcbmltcG9ydCBsb25nbGF0IGZyb20gXCIuL3Byb2plY3Rpb25zL2xvbmdsYXRcIjtcbnZhciBwcm9qcyA9IFttZXJjLCBsb25nbGF0XTtcbnZhciBuYW1lcyA9IHt9O1xudmFyIHByb2pTdG9yZSA9IFtdO1xuXG5mdW5jdGlvbiBhZGQocHJvaiwgaSkge1xuICB2YXIgbGVuID0gcHJvalN0b3JlLmxlbmd0aDtcbiAgaWYgKCFwcm9qLm5hbWVzKSB7XG4gICAgY29uc29sZS5sb2coaSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcHJvalN0b3JlW2xlbl0gPSBwcm9qO1xuICBwcm9qLm5hbWVzLmZvckVhY2goZnVuY3Rpb24obikge1xuICAgIG5hbWVzW24udG9Mb3dlckNhc2UoKV0gPSBsZW47XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IHthZGR9O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KG5hbWUpIHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBuID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAodHlwZW9mIG5hbWVzW25dICE9PSAndW5kZWZpbmVkJyAmJiBwcm9qU3RvcmVbbmFtZXNbbl1dKSB7XG4gICAgcmV0dXJuIHByb2pTdG9yZVtuYW1lc1tuXV07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICBwcm9qcy5mb3JFYWNoKGFkZCk7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gIHN0YXJ0OiBzdGFydCxcbiAgYWRkOiBhZGQsXG4gIGdldDogZ2V0XG59O1xuIiwiaW1wb3J0IG1zZm56IGZyb20gJy4uL2NvbW1vbi9tc2Zueic7XG5pbXBvcnQgcXNmbnogZnJvbSAnLi4vY29tbW9uL3FzZm56JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuaW1wb3J0IHtFUFNMTn0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIE1hdGgucG93KHRoaXMudGVtcCwgMik7XG4gIHRoaXMuZTMgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG5cbiAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDEpO1xuICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0MSk7XG4gIHRoaXMudDEgPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5jb24gPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5tczEgPSBtc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuICB0aGlzLnFzMSA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvLCB0aGlzLmNvc19wbyk7XG5cbiAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0Mik7XG4gIHRoaXMudDIgPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5tczIgPSBtc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuICB0aGlzLnFzMiA9IHFzZm56KHRoaXMuZTMsIHRoaXMuc2luX3BvLCB0aGlzLmNvc19wbyk7XG5cbiAgdGhpcy5zaW5fcG8gPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wbyA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIHRoaXMudDMgPSB0aGlzLnNpbl9wbztcbiAgdGhpcy5xczAgPSBxc2Zueih0aGlzLmUzLCB0aGlzLnNpbl9wbywgdGhpcy5jb3NfcG8pO1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgLSB0aGlzLmxhdDIpID4gRVBTTE4pIHtcbiAgICB0aGlzLm5zMCA9ICh0aGlzLm1zMSAqIHRoaXMubXMxIC0gdGhpcy5tczIgKiB0aGlzLm1zMikgLyAodGhpcy5xczIgLSB0aGlzLnFzMSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5uczAgPSB0aGlzLmNvbjtcbiAgfVxuICB0aGlzLmMgPSB0aGlzLm1zMSAqIHRoaXMubXMxICsgdGhpcy5uczAgKiB0aGlzLnFzMTtcbiAgdGhpcy5yaCA9IHRoaXMuYSAqIE1hdGguc3FydCh0aGlzLmMgLSB0aGlzLm5zMCAqIHRoaXMucXMwKSAvIHRoaXMubnMwO1xufVxuXG4vKiBBbGJlcnMgQ29uaWNhbCBFcXVhbCBBcmVhIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcblxuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHRoaXMuc2luX3BoaSA9IE1hdGguc2luKGxhdCk7XG4gIHRoaXMuY29zX3BoaSA9IE1hdGguY29zKGxhdCk7XG5cbiAgdmFyIHFzID0gcXNmbnoodGhpcy5lMywgdGhpcy5zaW5fcGhpLCB0aGlzLmNvc19waGkpO1xuICB2YXIgcmgxID0gdGhpcy5hICogTWF0aC5zcXJ0KHRoaXMuYyAtIHRoaXMubnMwICogcXMpIC8gdGhpcy5uczA7XG4gIHZhciB0aGV0YSA9IHRoaXMubnMwICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcbiAgdmFyIHggPSByaDEgKiBNYXRoLnNpbih0aGV0YSkgKyB0aGlzLngwO1xuICB2YXIgeSA9IHRoaXMucmggLSByaDEgKiBNYXRoLmNvcyh0aGV0YSkgKyB0aGlzLnkwO1xuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDEsIHFzLCBjb24sIHRoZXRhLCBsb24sIGxhdDtcblxuICBwLnggLT0gdGhpcy54MDtcbiAgcC55ID0gdGhpcy5yaCAtIHAueSArIHRoaXMueTA7XG4gIGlmICh0aGlzLm5zMCA+PSAwKSB7XG4gICAgcmgxID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gMTtcbiAgfVxuICBlbHNlIHtcbiAgICByaDEgPSAtTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gLTE7XG4gIH1cbiAgdGhldGEgPSAwO1xuICBpZiAocmgxICE9PSAwKSB7XG4gICAgdGhldGEgPSBNYXRoLmF0YW4yKGNvbiAqIHAueCwgY29uICogcC55KTtcbiAgfVxuICBjb24gPSByaDEgKiB0aGlzLm5zMCAvIHRoaXMuYTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgbGF0ID0gTWF0aC5hc2luKCh0aGlzLmMgLSBjb24gKiBjb24pIC8gKDIgKiB0aGlzLm5zMCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHFzID0gKHRoaXMuYyAtIGNvbiAqIGNvbikgLyB0aGlzLm5zMDtcbiAgICBsYXQgPSB0aGlzLnBoaTF6KHRoaXMuZTMsIHFzKTtcbiAgfVxuXG4gIGxvbiA9IGFkanVzdF9sb24odGhldGEgLyB0aGlzLm5zMCArIHRoaXMubG9uZzApO1xuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEZ1bmN0aW9uIHRvIGNvbXB1dGUgcGhpMSwgdGhlIGxhdGl0dWRlIGZvciB0aGUgaW52ZXJzZSBvZiB0aGVcbiAgIEFsYmVycyBDb25pY2FsIEVxdWFsLUFyZWEgcHJvamVjdGlvbi5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIHBoaTF6KGVjY2VudCwgcXMpIHtcbiAgdmFyIHNpbnBoaSwgY29zcGhpLCBjb24sIGNvbSwgZHBoaTtcbiAgdmFyIHBoaSA9IGFzaW56KDAuNSAqIHFzKTtcbiAgaWYgKGVjY2VudCA8IEVQU0xOKSB7XG4gICAgcmV0dXJuIHBoaTtcbiAgfVxuXG4gIHZhciBlY2NudHMgPSBlY2NlbnQgKiBlY2NlbnQ7XG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IDI1OyBpKyspIHtcbiAgICBzaW5waGkgPSBNYXRoLnNpbihwaGkpO1xuICAgIGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgY29uID0gZWNjZW50ICogc2lucGhpO1xuICAgIGNvbSA9IDEgLSBjb24gKiBjb247XG4gICAgZHBoaSA9IDAuNSAqIGNvbSAqIGNvbSAvIGNvc3BoaSAqIChxcyAvICgxIC0gZWNjbnRzKSAtIHNpbnBoaSAvIGNvbSArIDAuNSAvIGVjY2VudCAqIE1hdGgubG9nKCgxIC0gY29uKSAvICgxICsgY29uKSkpO1xuICAgIHBoaSA9IHBoaSArIGRwaGk7XG4gICAgaWYgKE1hdGguYWJzKGRwaGkpIDw9IDFlLTcpIHtcbiAgICAgIHJldHVybiBwaGk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiQWxiZXJzX0NvbmljX0VxdWFsX0FyZWFcIiwgXCJBbGJlcnNcIiwgXCJhZWFcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lcyxcbiAgcGhpMXo6IHBoaTF6XG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHtIQUxGX1BJLCBFUFNMTn0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBtbGZuIGZyb20gJy4uL2NvbW1vbi9tbGZuJztcbmltcG9ydCBlMGZuIGZyb20gJy4uL2NvbW1vbi9lMGZuJztcbmltcG9ydCBlMWZuIGZyb20gJy4uL2NvbW1vbi9lMWZuJztcbmltcG9ydCBlMmZuIGZyb20gJy4uL2NvbW1vbi9lMmZuJztcbmltcG9ydCBlM2ZuIGZyb20gJy4uL2NvbW1vbi9lM2ZuJztcbmltcG9ydCBnTiBmcm9tICcuLi9jb21tb24vZ04nO1xuaW1wb3J0IGFzaW56IGZyb20gJy4uL2NvbW1vbi9hc2lueic7XG5pbXBvcnQgaW1sZm4gZnJvbSAnLi4vY29tbW9uL2ltbGZuJztcblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLnNpbl9wMTIgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wMTIgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciBzaW5waGkgPSBNYXRoLnNpbihwLnkpO1xuICB2YXIgY29zcGhpID0gTWF0aC5jb3MocC55KTtcbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuICB2YXIgZTAsIGUxLCBlMiwgZTMsIE1scCwgTWwsIHRhbnBoaSwgTmwxLCBObCwgcHNpLCBBeiwgRywgSCwgR0gsIEhzLCBjLCBrcCwgY29zX2MsIHMsIHMyLCBzMywgczQsIHM1O1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyIC0gMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vTm9ydGggUG9sZSBjYXNlXG4gICAgICBwLnggPSB0aGlzLngwICsgdGhpcy5hICogKEhBTEZfUEkgLSBsYXQpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwIC0gdGhpcy5hICogKEhBTEZfUEkgLSBsYXQpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgZWxzZSBpZiAoTWF0aC5hYnModGhpcy5zaW5fcDEyICsgMSkgPD0gRVBTTE4pIHtcbiAgICAgIC8vU291dGggUG9sZSBjYXNlXG4gICAgICBwLnggPSB0aGlzLngwICsgdGhpcy5hICogKEhBTEZfUEkgKyBsYXQpICogTWF0aC5zaW4oZGxvbik7XG4gICAgICBwLnkgPSB0aGlzLnkwICsgdGhpcy5hICogKEhBTEZfUEkgKyBsYXQpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvL2RlZmF1bHQgY2FzZVxuICAgICAgY29zX2MgPSB0aGlzLnNpbl9wMTIgKiBzaW5waGkgKyB0aGlzLmNvc19wMTIgKiBjb3NwaGkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIGMgPSBNYXRoLmFjb3MoY29zX2MpO1xuICAgICAga3AgPSBjID8gYyAvIE1hdGguc2luKGMpIDogMTtcbiAgICAgIHAueCA9IHRoaXMueDAgKyB0aGlzLmEgKiBrcCAqIGNvc3BoaSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCArIHRoaXMuYSAqIGtwICogKHRoaXMuY29zX3AxMiAqIHNpbnBoaSAtIHRoaXMuc2luX3AxMiAqIGNvc3BoaSAqIE1hdGguY29zKGRsb24pKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBlMCA9IGUwZm4odGhpcy5lcyk7XG4gICAgZTEgPSBlMWZuKHRoaXMuZXMpO1xuICAgIGUyID0gZTJmbih0aGlzLmVzKTtcbiAgICBlMyA9IGUzZm4odGhpcy5lcyk7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuc2luX3AxMiAtIDEpIDw9IEVQU0xOKSB7XG4gICAgICAvL05vcnRoIFBvbGUgY2FzZVxuICAgICAgTWxwID0gdGhpcy5hICogbWxmbihlMCwgZTEsIGUyLCBlMywgSEFMRl9QSSk7XG4gICAgICBNbCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIGxhdCk7XG4gICAgICBwLnggPSB0aGlzLngwICsgKE1scCAtIE1sKSAqIE1hdGguc2luKGRsb24pO1xuICAgICAgcC55ID0gdGhpcy55MCAtIChNbHAgLSBNbCkgKiBNYXRoLmNvcyhkbG9uKTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgKyAxKSA8PSBFUFNMTikge1xuICAgICAgLy9Tb3V0aCBQb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgTWwgPSB0aGlzLmEgKiBtbGZuKGUwLCBlMSwgZTIsIGUzLCBsYXQpO1xuICAgICAgcC54ID0gdGhpcy54MCArIChNbHAgKyBNbCkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICAgIHAueSA9IHRoaXMueTAgKyAoTWxwICsgTWwpICogTWF0aC5jb3MoZGxvbik7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvL0RlZmF1bHQgY2FzZVxuICAgICAgdGFucGhpID0gc2lucGhpIC8gY29zcGhpO1xuICAgICAgTmwxID0gZ04odGhpcy5hLCB0aGlzLmUsIHRoaXMuc2luX3AxMik7XG4gICAgICBObCA9IGdOKHRoaXMuYSwgdGhpcy5lLCBzaW5waGkpO1xuICAgICAgcHNpID0gTWF0aC5hdGFuKCgxIC0gdGhpcy5lcykgKiB0YW5waGkgKyB0aGlzLmVzICogTmwxICogdGhpcy5zaW5fcDEyIC8gKE5sICogY29zcGhpKSk7XG4gICAgICBBeiA9IE1hdGguYXRhbjIoTWF0aC5zaW4oZGxvbiksIHRoaXMuY29zX3AxMiAqIE1hdGgudGFuKHBzaSkgLSB0aGlzLnNpbl9wMTIgKiBNYXRoLmNvcyhkbG9uKSk7XG4gICAgICBpZiAoQXogPT09IDApIHtcbiAgICAgICAgcyA9IE1hdGguYXNpbih0aGlzLmNvc19wMTIgKiBNYXRoLnNpbihwc2kpIC0gdGhpcy5zaW5fcDEyICogTWF0aC5jb3MocHNpKSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChNYXRoLmFicyhNYXRoLmFicyhBeikgLSBNYXRoLlBJKSA8PSBFUFNMTikge1xuICAgICAgICBzID0gLU1hdGguYXNpbih0aGlzLmNvc19wMTIgKiBNYXRoLnNpbihwc2kpIC0gdGhpcy5zaW5fcDEyICogTWF0aC5jb3MocHNpKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcyA9IE1hdGguYXNpbihNYXRoLnNpbihkbG9uKSAqIE1hdGguY29zKHBzaSkgLyBNYXRoLnNpbihBeikpO1xuICAgICAgfVxuICAgICAgRyA9IHRoaXMuZSAqIHRoaXMuc2luX3AxMiAvIE1hdGguc3FydCgxIC0gdGhpcy5lcyk7XG4gICAgICBIID0gdGhpcy5lICogdGhpcy5jb3NfcDEyICogTWF0aC5jb3MoQXopIC8gTWF0aC5zcXJ0KDEgLSB0aGlzLmVzKTtcbiAgICAgIEdIID0gRyAqIEg7XG4gICAgICBIcyA9IEggKiBIO1xuICAgICAgczIgPSBzICogcztcbiAgICAgIHMzID0gczIgKiBzO1xuICAgICAgczQgPSBzMyAqIHM7XG4gICAgICBzNSA9IHM0ICogcztcbiAgICAgIGMgPSBObDEgKiBzICogKDEgLSBzMiAqIEhzICogKDEgLSBIcykgLyA2ICsgczMgLyA4ICogR0ggKiAoMSAtIDIgKiBIcykgKyBzNCAvIDEyMCAqIChIcyAqICg0IC0gNyAqIEhzKSAtIDMgKiBHICogRyAqICgxIC0gNyAqIEhzKSkgLSBzNSAvIDQ4ICogR0gpO1xuICAgICAgcC54ID0gdGhpcy54MCArIGMgKiBNYXRoLnNpbihBeik7XG4gICAgICBwLnkgPSB0aGlzLnkwICsgYyAqIE1hdGguY29zKEF6KTtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgfVxuXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciByaCwgeiwgc2lueiwgY29zeiwgbG9uLCBsYXQsIGNvbiwgZTAsIGUxLCBlMiwgZTMsIE1scCwgTSwgTjEsIHBzaSwgQXosIGNvc0F6LCB0bXAsIEEsIEIsIEQsIEVlLCBGLCBzaW5wc2k7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgaWYgKHJoID4gKDIgKiBIQUxGX1BJICogdGhpcy5hKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB6ID0gcmggLyB0aGlzLmE7XG5cbiAgICBzaW56ID0gTWF0aC5zaW4oeik7XG4gICAgY29zeiA9IE1hdGguY29zKHopO1xuXG4gICAgbG9uID0gdGhpcy5sb25nMDtcbiAgICBpZiAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSB7XG4gICAgICBsYXQgPSB0aGlzLmxhdDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGF0ID0gYXNpbnooY29zeiAqIHRoaXMuc2luX3AxMiArIChwLnkgKiBzaW56ICogdGhpcy5jb3NfcDEyKSAvIHJoKTtcbiAgICAgIGNvbiA9IE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJO1xuICAgICAgaWYgKE1hdGguYWJzKGNvbikgPD0gRVBTTE4pIHtcbiAgICAgICAgaWYgKHRoaXMubGF0MCA+PSAwKSB7XG4gICAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0gcC55KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwIC0gTWF0aC5hdGFuMigtcC54LCBwLnkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8qY29uID0gY29zeiAtIHRoaXMuc2luX3AxMiAqIE1hdGguc2luKGxhdCk7XG4gICAgICAgIGlmICgoTWF0aC5hYnMoY29uKSA8IEVQU0xOKSAmJiAoTWF0aC5hYnMocC54KSA8IEVQU0xOKSkge1xuICAgICAgICAgIC8vbm8tb3AsIGp1c3Qga2VlcCB0aGUgbG9uIHZhbHVlIGFzIGlzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRlbXAgPSBNYXRoLmF0YW4yKChwLnggKiBzaW56ICogdGhpcy5jb3NfcDEyKSwgKGNvbiAqIHJoKSk7XG4gICAgICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMigocC54ICogc2lueiAqIHRoaXMuY29zX3AxMiksIChjb24gKiByaCkpKTtcbiAgICAgICAgfSovXG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogc2lueiwgcmggKiB0aGlzLmNvc19wMTIgKiBjb3N6IC0gcC55ICogdGhpcy5zaW5fcDEyICogc2lueikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgZWxzZSB7XG4gICAgZTAgPSBlMGZuKHRoaXMuZXMpO1xuICAgIGUxID0gZTFmbih0aGlzLmVzKTtcbiAgICBlMiA9IGUyZm4odGhpcy5lcyk7XG4gICAgZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgLSAxKSA8PSBFUFNMTikge1xuICAgICAgLy9Ob3J0aCBwb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICAgIE0gPSBNbHAgLSByaDtcbiAgICAgIGxhdCA9IGltbGZuKE0gLyB0aGlzLmEsIGUwLCBlMSwgZTIsIGUzKTtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtIDEgKiBwLnkpKTtcbiAgICAgIHAueCA9IGxvbjtcbiAgICAgIHAueSA9IGxhdDtcbiAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnNpbl9wMTIgKyAxKSA8PSBFUFNMTikge1xuICAgICAgLy9Tb3V0aCBwb2xlIGNhc2VcbiAgICAgIE1scCA9IHRoaXMuYSAqIG1sZm4oZTAsIGUxLCBlMiwgZTMsIEhBTEZfUEkpO1xuICAgICAgcmggPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgICAgIE0gPSByaCAtIE1scDtcblxuICAgICAgbGF0ID0gaW1sZm4oTSAvIHRoaXMuYSwgZTAsIGUxLCBlMiwgZTMpO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIHAueSkpO1xuICAgICAgcC54ID0gbG9uO1xuICAgICAgcC55ID0gbGF0O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy9kZWZhdWx0IGNhc2VcbiAgICAgIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgICBBeiA9IE1hdGguYXRhbjIocC54LCBwLnkpO1xuICAgICAgTjEgPSBnTih0aGlzLmEsIHRoaXMuZSwgdGhpcy5zaW5fcDEyKTtcbiAgICAgIGNvc0F6ID0gTWF0aC5jb3MoQXopO1xuICAgICAgdG1wID0gdGhpcy5lICogdGhpcy5jb3NfcDEyICogY29zQXo7XG4gICAgICBBID0gLXRtcCAqIHRtcCAvICgxIC0gdGhpcy5lcyk7XG4gICAgICBCID0gMyAqIHRoaXMuZXMgKiAoMSAtIEEpICogdGhpcy5zaW5fcDEyICogdGhpcy5jb3NfcDEyICogY29zQXogLyAoMSAtIHRoaXMuZXMpO1xuICAgICAgRCA9IHJoIC8gTjE7XG4gICAgICBFZSA9IEQgLSBBICogKDEgKyBBKSAqIE1hdGgucG93KEQsIDMpIC8gNiAtIEIgKiAoMSArIDMgKiBBKSAqIE1hdGgucG93KEQsIDQpIC8gMjQ7XG4gICAgICBGID0gMSAtIEEgKiBFZSAqIEVlIC8gMiAtIEQgKiBFZSAqIEVlICogRWUgLyA2O1xuICAgICAgcHNpID0gTWF0aC5hc2luKHRoaXMuc2luX3AxMiAqIE1hdGguY29zKEVlKSArIHRoaXMuY29zX3AxMiAqIE1hdGguc2luKEVlKSAqIGNvc0F6KTtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXNpbihNYXRoLnNpbihBeikgKiBNYXRoLnNpbihFZSkgLyBNYXRoLmNvcyhwc2kpKSk7XG4gICAgICBzaW5wc2kgPSBNYXRoLnNpbihwc2kpO1xuICAgICAgbGF0ID0gTWF0aC5hdGFuMigoc2lucHNpIC0gdGhpcy5lcyAqIEYgKiB0aGlzLnNpbl9wMTIpICogTWF0aC50YW4ocHNpKSwgc2lucHNpICogKDEgLSB0aGlzLmVzKSk7XG4gICAgICBwLnggPSBsb247XG4gICAgICBwLnkgPSBsYXQ7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiQXppbXV0aGFsX0VxdWlkaXN0YW50XCIsIFwiYWVxZFwiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IGUwZm4gZnJvbSAnLi4vY29tbW9uL2UwZm4nO1xuaW1wb3J0IGUxZm4gZnJvbSAnLi4vY29tbW9uL2UxZm4nO1xuaW1wb3J0IGUyZm4gZnJvbSAnLi4vY29tbW9uL2UyZm4nO1xuaW1wb3J0IGUzZm4gZnJvbSAnLi4vY29tbW9uL2UzZm4nO1xuaW1wb3J0IGdOIGZyb20gJy4uL2NvbW1vbi9nTic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgaW1sZm4gZnJvbSAnLi4vY29tbW9uL2ltbGZuJztcbmltcG9ydCB7SEFMRl9QSSwgRVBTTE59IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKCF0aGlzLnNwaGVyZSkge1xuICAgIHRoaXMuZTAgPSBlMGZuKHRoaXMuZXMpO1xuICAgIHRoaXMuZTEgPSBlMWZuKHRoaXMuZXMpO1xuICAgIHRoaXMuZTIgPSBlMmZuKHRoaXMuZXMpO1xuICAgIHRoaXMuZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICAgIHRoaXMubWwwID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDApO1xuICB9XG59XG5cbi8qIENhc3NpbmkgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcblxuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICB2YXIgeCwgeTtcbiAgdmFyIGxhbSA9IHAueDtcbiAgdmFyIHBoaSA9IHAueTtcbiAgbGFtID0gYWRqdXN0X2xvbihsYW0gLSB0aGlzLmxvbmcwKTtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB4ID0gdGhpcy5hICogTWF0aC5hc2luKE1hdGguY29zKHBoaSkgKiBNYXRoLnNpbihsYW0pKTtcbiAgICB5ID0gdGhpcy5hICogKE1hdGguYXRhbjIoTWF0aC50YW4ocGhpKSwgTWF0aC5jb3MobGFtKSkgLSB0aGlzLmxhdDApO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vZWxsaXBzb2lkXG4gICAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgdmFyIGNvc3BoaSA9IE1hdGguY29zKHBoaSk7XG4gICAgdmFyIG5sID0gZ04odGhpcy5hLCB0aGlzLmUsIHNpbnBoaSk7XG4gICAgdmFyIHRsID0gTWF0aC50YW4ocGhpKSAqIE1hdGgudGFuKHBoaSk7XG4gICAgdmFyIGFsID0gbGFtICogTWF0aC5jb3MocGhpKTtcbiAgICB2YXIgYXNxID0gYWwgKiBhbDtcbiAgICB2YXIgY2wgPSB0aGlzLmVzICogY29zcGhpICogY29zcGhpIC8gKDEgLSB0aGlzLmVzKTtcbiAgICB2YXIgbWwgPSB0aGlzLmEgKiBtbGZuKHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMsIHBoaSk7XG5cbiAgICB4ID0gbmwgKiBhbCAqICgxIC0gYXNxICogdGwgKiAoMSAvIDYgLSAoOCAtIHRsICsgOCAqIGNsKSAqIGFzcSAvIDEyMCkpO1xuICAgIHkgPSBtbCAtIHRoaXMubWwwICsgbmwgKiBzaW5waGkgLyBjb3NwaGkgKiBhc3EgKiAoMC41ICsgKDUgLSB0bCArIDYgKiBjbCkgKiBhc3EgLyAyNCk7XG5cblxuICB9XG5cbiAgcC54ID0geCArIHRoaXMueDA7XG4gIHAueSA9IHkgKyB0aGlzLnkwO1xuICByZXR1cm4gcDtcbn1cblxuLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciB4ID0gcC54IC8gdGhpcy5hO1xuICB2YXIgeSA9IHAueSAvIHRoaXMuYTtcbiAgdmFyIHBoaSwgbGFtO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHZhciBkZCA9IHkgKyB0aGlzLmxhdDA7XG4gICAgcGhpID0gTWF0aC5hc2luKE1hdGguc2luKGRkKSAqIE1hdGguY29zKHgpKTtcbiAgICBsYW0gPSBNYXRoLmF0YW4yKE1hdGgudGFuKHgpLCBNYXRoLmNvcyhkZCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8qIGVsbGlwc29pZCAqL1xuICAgIHZhciBtbDEgPSB0aGlzLm1sMCAvIHRoaXMuYSArIHk7XG4gICAgdmFyIHBoaTEgPSBpbWxmbihtbDEsIHRoaXMuZTAsIHRoaXMuZTEsIHRoaXMuZTIsIHRoaXMuZTMpO1xuICAgIGlmIChNYXRoLmFicyhNYXRoLmFicyhwaGkxKSAtIEhBTEZfUEkpIDw9IEVQU0xOKSB7XG4gICAgICBwLnggPSB0aGlzLmxvbmcwO1xuICAgICAgcC55ID0gSEFMRl9QSTtcbiAgICAgIGlmICh5IDwgMCkge1xuICAgICAgICBwLnkgKj0gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgdmFyIG5sMSA9IGdOKHRoaXMuYSwgdGhpcy5lLCBNYXRoLnNpbihwaGkxKSk7XG5cbiAgICB2YXIgcmwxID0gbmwxICogbmwxICogbmwxIC8gdGhpcy5hIC8gdGhpcy5hICogKDEgLSB0aGlzLmVzKTtcbiAgICB2YXIgdGwxID0gTWF0aC5wb3coTWF0aC50YW4ocGhpMSksIDIpO1xuICAgIHZhciBkbCA9IHggKiB0aGlzLmEgLyBubDE7XG4gICAgdmFyIGRzcSA9IGRsICogZGw7XG4gICAgcGhpID0gcGhpMSAtIG5sMSAqIE1hdGgudGFuKHBoaTEpIC8gcmwxICogZGwgKiBkbCAqICgwLjUgLSAoMSArIDMgKiB0bDEpICogZGwgKiBkbCAvIDI0KTtcbiAgICBsYW0gPSBkbCAqICgxIC0gZHNxICogKHRsMSAvIDMgKyAoMSArIDMgKiB0bDEpICogdGwxICogZHNxIC8gMTUpKSAvIE1hdGguY29zKHBoaTEpO1xuXG4gIH1cblxuICBwLnggPSBhZGp1c3RfbG9uKGxhbSArIHRoaXMubG9uZzApO1xuICBwLnkgPSBhZGp1c3RfbGF0KHBoaSk7XG4gIHJldHVybiBwO1xuXG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJDYXNzaW5pXCIsIFwiQ2Fzc2luaV9Tb2xkbmVyXCIsIFwiY2Fzc1wiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IHFzZm56IGZyb20gJy4uL2NvbW1vbi9xc2Zueic7XG5pbXBvcnQgbXNmbnogZnJvbSAnLi4vY29tbW9uL21zZm56JztcbmltcG9ydCBpcXNmbnogZnJvbSAnLi4vY29tbW9uL2lxc2Zueic7XG5cbi8qXG4gIHJlZmVyZW5jZTpcbiAgICBcIkNhcnRvZ3JhcGhpYyBQcm9qZWN0aW9uIFByb2NlZHVyZXMgZm9yIHRoZSBVTklYIEVudmlyb25tZW50LVxuICAgIEEgVXNlcidzIE1hbnVhbFwiIGJ5IEdlcmFsZCBJLiBFdmVuZGVuLFxuICAgIFVTR1MgT3BlbiBGaWxlIFJlcG9ydCA5MC0yODRhbmQgUmVsZWFzZSA0IEludGVyaW0gUmVwb3J0cyAoMjAwMylcbiovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy9uby1vcFxuICBpZiAoIXRoaXMuc3BoZXJlKSB7XG4gICAgdGhpcy5rMCA9IG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpO1xuICB9XG59XG5cbi8qIEN5bGluZHJpY2FsIEVxdWFsIEFyZWEgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHgsIHk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG4gIHZhciBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiBkbG9uICogTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xuICAgIHkgPSB0aGlzLnkwICsgdGhpcy5hICogTWF0aC5zaW4obGF0KSAvIE1hdGguY29zKHRoaXMubGF0X3RzKTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgcXMgPSBxc2Zueih0aGlzLmUsIE1hdGguc2luKGxhdCkpO1xuICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogdGhpcy5rMCAqIGRsb247XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBxcyAqIDAuNSAvIHRoaXMuazA7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuLyogQ3lsaW5kcmljYWwgRXF1YWwgQXJlYSBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHZhciBsb24sIGxhdDtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAocC54IC8gdGhpcy5hKSAvIE1hdGguY29zKHRoaXMubGF0X3RzKSk7XG4gICAgbGF0ID0gTWF0aC5hc2luKChwLnkgLyB0aGlzLmEpICogTWF0aC5jb3ModGhpcy5sYXRfdHMpKTtcbiAgfVxuICBlbHNlIHtcbiAgICBsYXQgPSBpcXNmbnoodGhpcy5lLCAyICogcC55ICogdGhpcy5rMCAvIHRoaXMuYSk7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgcC54IC8gKHRoaXMuYSAqIHRoaXMuazApKTtcbiAgfVxuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcImNlYVwiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgdGhpcy5sYXRfdHMgPSB0aGlzLmxhdF90cyB8fCAwO1xuICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCBcIkVxdWlkaXN0YW50IEN5bGluZHJpY2FsIChQbGF0ZSBDYXJyZSlcIjtcblxuICB0aGlzLnJjID0gTWF0aC5jb3ModGhpcy5sYXRfdHMpO1xufVxuXG4vLyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG5cbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcblxuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gIHZhciBkbGF0ID0gYWRqdXN0X2xhdChsYXQgLSB0aGlzLmxhdDApO1xuICBwLnggPSB0aGlzLngwICsgKHRoaXMuYSAqIGRsb24gKiB0aGlzLnJjKTtcbiAgcC55ID0gdGhpcy55MCArICh0aGlzLmEgKiBkbGF0KTtcbiAgcmV0dXJuIHA7XG59XG5cbi8vIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcblxuICB2YXIgeCA9IHAueDtcbiAgdmFyIHkgPSBwLnk7XG5cbiAgcC54ID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgKCh4IC0gdGhpcy54MCkgLyAodGhpcy5hICogdGhpcy5yYykpKTtcbiAgcC55ID0gYWRqdXN0X2xhdCh0aGlzLmxhdDAgKyAoKHkgLSB0aGlzLnkwKSAvICh0aGlzLmEpKSk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiRXF1aXJlY3Rhbmd1bGFyXCIsIFwiRXF1aWRpc3RhbnRfQ3lsaW5kcmljYWxcIiwgXCJlcWNcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBlMGZuIGZyb20gJy4uL2NvbW1vbi9lMGZuJztcbmltcG9ydCBlMWZuIGZyb20gJy4uL2NvbW1vbi9lMWZuJztcbmltcG9ydCBlMmZuIGZyb20gJy4uL2NvbW1vbi9lMmZuJztcbmltcG9ydCBlM2ZuIGZyb20gJy4uL2NvbW1vbi9lM2ZuJztcbmltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IGltbGZuIGZyb20gJy4uL2NvbW1vbi9pbWxmbic7XG5pbXBvcnQge0VQU0xOfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gIC8vIFN0YW5kYXJkIFBhcmFsbGVscyBjYW5ub3QgYmUgZXF1YWwgYW5kIG9uIG9wcG9zaXRlIHNpZGVzIG9mIHRoZSBlcXVhdG9yXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgKyB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5sYXQyID0gdGhpcy5sYXQyIHx8IHRoaXMubGF0MTtcbiAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIE1hdGgucG93KHRoaXMudGVtcCwgMik7XG4gIHRoaXMuZSA9IE1hdGguc3FydCh0aGlzLmVzKTtcbiAgdGhpcy5lMCA9IGUwZm4odGhpcy5lcyk7XG4gIHRoaXMuZTEgPSBlMWZuKHRoaXMuZXMpO1xuICB0aGlzLmUyID0gZTJmbih0aGlzLmVzKTtcbiAgdGhpcy5lMyA9IGUzZm4odGhpcy5lcyk7XG5cbiAgdGhpcy5zaW5waGkgPSBNYXRoLnNpbih0aGlzLmxhdDEpO1xuICB0aGlzLmNvc3BoaSA9IE1hdGguY29zKHRoaXMubGF0MSk7XG5cbiAgdGhpcy5tczEgPSBtc2Zueih0aGlzLmUsIHRoaXMuc2lucGhpLCB0aGlzLmNvc3BoaSk7XG4gIHRoaXMubWwxID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCB0aGlzLmxhdDEpO1xuXG4gIGlmIChNYXRoLmFicyh0aGlzLmxhdDEgLSB0aGlzLmxhdDIpIDwgRVBTTE4pIHtcbiAgICB0aGlzLm5zID0gdGhpcy5zaW5waGk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5zaW5waGkgPSBNYXRoLnNpbih0aGlzLmxhdDIpO1xuICAgIHRoaXMuY29zcGhpID0gTWF0aC5jb3ModGhpcy5sYXQyKTtcbiAgICB0aGlzLm1zMiA9IG1zZm56KHRoaXMuZSwgdGhpcy5zaW5waGksIHRoaXMuY29zcGhpKTtcbiAgICB0aGlzLm1sMiA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQyKTtcbiAgICB0aGlzLm5zID0gKHRoaXMubXMxIC0gdGhpcy5tczIpIC8gKHRoaXMubWwyIC0gdGhpcy5tbDEpO1xuICB9XG4gIHRoaXMuZyA9IHRoaXMubWwxICsgdGhpcy5tczEgLyB0aGlzLm5zO1xuICB0aGlzLm1sMCA9IG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQwKTtcbiAgdGhpcy5yaCA9IHRoaXMuYSAqICh0aGlzLmcgLSB0aGlzLm1sMCk7XG59XG5cbi8qIEVxdWlkaXN0YW50IENvbmljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciByaDE7XG5cbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgcmgxID0gdGhpcy5hICogKHRoaXMuZyAtIGxhdCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIG1sID0gbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBsYXQpO1xuICAgIHJoMSA9IHRoaXMuYSAqICh0aGlzLmcgLSBtbCk7XG4gIH1cbiAgdmFyIHRoZXRhID0gdGhpcy5ucyAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gIHZhciB4ID0gdGhpcy54MCArIHJoMSAqIE1hdGguc2luKHRoZXRhKTtcbiAgdmFyIHkgPSB0aGlzLnkwICsgdGhpcy5yaCAtIHJoMSAqIE1hdGguY29zKHRoZXRhKTtcbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIEludmVyc2UgZXF1YXRpb25zXG4gIC0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSA9IHRoaXMucmggLSBwLnkgKyB0aGlzLnkwO1xuICB2YXIgY29uLCByaDEsIGxhdCwgbG9uO1xuICBpZiAodGhpcy5ucyA+PSAwKSB7XG4gICAgcmgxID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gMTtcbiAgfVxuICBlbHNlIHtcbiAgICByaDEgPSAtTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gICAgY29uID0gLTE7XG4gIH1cbiAgdmFyIHRoZXRhID0gMDtcbiAgaWYgKHJoMSAhPT0gMCkge1xuICAgIHRoZXRhID0gTWF0aC5hdGFuMihjb24gKiBwLngsIGNvbiAqIHAueSk7XG4gIH1cblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyB0aGV0YSAvIHRoaXMubnMpO1xuICAgIGxhdCA9IGFkanVzdF9sYXQodGhpcy5nIC0gcmgxIC8gdGhpcy5hKTtcbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBtbCA9IHRoaXMuZyAtIHJoMSAvIHRoaXMuYTtcbiAgICBsYXQgPSBpbWxmbihtbCwgdGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMyk7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgdGhldGEgLyB0aGlzLm5zKTtcbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9XG5cbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIkVxdWlkaXN0YW50X0NvbmljXCIsIFwiZXFkY1wiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiLy8gSGVhdmlseSBiYXNlZCBvbiB0aGlzIGV0bWVyYyBwcm9qZWN0aW9uIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWJsb2NoL21hcHNoYXBlci1wcm9qL2Jsb2IvbWFzdGVyL3NyYy9wcm9qZWN0aW9ucy9ldG1lcmMuanNcblxuaW1wb3J0IHRtZXJjIGZyb20gJy4uL3Byb2plY3Rpb25zL3RtZXJjJztcbmltcG9ydCBzaW5oIGZyb20gJy4uL2NvbW1vbi9zaW5oJztcbmltcG9ydCBoeXBvdCBmcm9tICcuLi9jb21tb24vaHlwb3QnO1xuaW1wb3J0IGFzaW5oeSBmcm9tICcuLi9jb21tb24vYXNpbmh5JztcbmltcG9ydCBnYXRnIGZyb20gJy4uL2NvbW1vbi9nYXRnJztcbmltcG9ydCBjbGVucyBmcm9tICcuLi9jb21tb24vY2xlbnMnO1xuaW1wb3J0IGNsZW5zX2NtcGx4IGZyb20gJy4uL2NvbW1vbi9jbGVuc19jbXBseCc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoIXRoaXMuYXBwcm94ICYmIChpc05hTih0aGlzLmVzKSB8fCB0aGlzLmVzIDw9IDApKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgZWxsaXB0aWNhbCB1c2FnZS4gVHJ5IHVzaW5nIHRoZSArYXBwcm94IG9wdGlvbiBpbiB0aGUgcHJvaiBzdHJpbmcsIG9yIFBST0pFQ1RJT05bXCJGYXN0X1RyYW5zdmVyc2VfTWVyY2F0b3JcIl0gaW4gdGhlIFdLVC4nKTtcbiAgfVxuICBpZiAodGhpcy5hcHByb3gpIHtcbiAgICAvLyBXaGVuICcrYXBwcm94JyBpcyBzZXQsIHVzZSB0bWVyYyBpbnN0ZWFkXG4gICAgdG1lcmMuaW5pdC5hcHBseSh0aGlzKTtcbiAgICB0aGlzLmZvcndhcmQgPSB0bWVyYy5mb3J3YXJkO1xuICAgIHRoaXMuaW52ZXJzZSA9IHRtZXJjLmludmVyc2U7XG4gIH1cblxuICB0aGlzLngwID0gdGhpcy54MCAhPT0gdW5kZWZpbmVkID8gdGhpcy54MCA6IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgIT09IHVuZGVmaW5lZCA/IHRoaXMubGF0MCA6IDA7XG5cbiAgdGhpcy5jZ2IgPSBbXTtcbiAgdGhpcy5jYmcgPSBbXTtcbiAgdGhpcy51dGcgPSBbXTtcbiAgdGhpcy5ndHUgPSBbXTtcblxuICB2YXIgZiA9IHRoaXMuZXMgLyAoMSArIE1hdGguc3FydCgxIC0gdGhpcy5lcykpO1xuICB2YXIgbiA9IGYgLyAoMiAtIGYpO1xuICB2YXIgbnAgPSBuO1xuXG4gIHRoaXMuY2diWzBdID0gbiAqICgyICsgbiAqICgtMiAvIDMgKyBuICogKC0yICsgbiAqICgxMTYgLyA0NSArIG4gKiAoMjYgLyA0NSArIG4gKiAoLTI4NTQgLyA2NzUgKSkpKSkpO1xuICB0aGlzLmNiZ1swXSA9IG4gKiAoLTIgKyBuICogKCAyIC8gMyArIG4gKiAoIDQgLyAzICsgbiAqICgtODIgLyA0NSArIG4gKiAoMzIgLyA0NSArIG4gKiAoNDY0MiAvIDQ3MjUpKSkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzFdID0gbnAgKiAoNyAvIDMgKyBuICogKC04IC8gNSArIG4gKiAoLTIyNyAvIDQ1ICsgbiAqICgyNzA0IC8gMzE1ICsgbiAqICgyMzIzIC8gOTQ1KSkpKSk7XG4gIHRoaXMuY2JnWzFdID0gbnAgKiAoNSAvIDMgKyBuICogKC0xNiAvIDE1ICsgbiAqICggLTEzIC8gOSArIG4gKiAoOTA0IC8gMzE1ICsgbiAqICgtMTUyMiAvIDk0NSkpKSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYlsyXSA9IG5wICogKDU2IC8gMTUgKyBuICogKC0xMzYgLyAzNSArIG4gKiAoLTEyNjIgLyAxMDUgKyBuICogKDczODE0IC8gMjgzNSkpKSk7XG4gIHRoaXMuY2JnWzJdID0gbnAgKiAoLTI2IC8gMTUgKyBuICogKDM0IC8gMjEgKyBuICogKDggLyA1ICsgbiAqICgtMTI2ODYgLyAyODM1KSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy5jZ2JbM10gPSBucCAqICg0Mjc5IC8gNjMwICsgbiAqICgtMzMyIC8gMzUgKyBuICogKC0zOTk1NzIgLyAxNDE3NSkpKTtcbiAgdGhpcy5jYmdbM10gPSBucCAqICgxMjM3IC8gNjMwICsgbiAqICgtMTIgLyA1ICsgbiAqICggLTI0ODMyIC8gMTQxNzUpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMuY2diWzRdID0gbnAgKiAoNDE3NCAvIDMxNSArIG4gKiAoLTE0NDgzOCAvIDYyMzcpKTtcbiAgdGhpcy5jYmdbNF0gPSBucCAqICgtNzM0IC8gMzE1ICsgbiAqICgxMDk1OTggLyAzMTE4NSkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLmNnYls1XSA9IG5wICogKDYwMTY3NiAvIDIyMjc1KTtcbiAgdGhpcy5jYmdbNV0gPSBucCAqICg0NDQzMzcgLyAxNTU5MjUpO1xuXG4gIG5wID0gTWF0aC5wb3cobiwgMik7XG4gIHRoaXMuUW4gPSB0aGlzLmswIC8gKDEgKyBuKSAqICgxICsgbnAgKiAoMSAvIDQgKyBucCAqICgxIC8gNjQgKyBucCAvIDI1NikpKTtcblxuICB0aGlzLnV0Z1swXSA9IG4gKiAoLTAuNSArIG4gKiAoIDIgLyAzICsgbiAqICgtMzcgLyA5NiArIG4gKiAoIDEgLyAzNjAgKyBuICogKDgxIC8gNTEyICsgbiAqICgtOTYxOTkgLyA2MDQ4MDApKSkpKSk7XG4gIHRoaXMuZ3R1WzBdID0gbiAqICgwLjUgKyBuICogKC0yIC8gMyArIG4gKiAoNSAvIDE2ICsgbiAqICg0MSAvIDE4MCArIG4gKiAoLTEyNyAvIDI4OCArIG4gKiAoNzg5MSAvIDM3ODAwKSkpKSkpO1xuXG4gIHRoaXMudXRnWzFdID0gbnAgKiAoLTEgLyA0OCArIG4gKiAoLTEgLyAxNSArIG4gKiAoNDM3IC8gMTQ0MCArIG4gKiAoLTQ2IC8gMTA1ICsgbiAqICgxMTE4NzExIC8gMzg3MDcyMCkpKSkpO1xuICB0aGlzLmd0dVsxXSA9IG5wICogKDEzIC8gNDggKyBuICogKC0zIC8gNSArIG4gKiAoNTU3IC8gMTQ0MCArIG4gKiAoMjgxIC8gNjMwICsgbiAqICgtMTk4MzQzMyAvIDE5MzUzNjApKSkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy51dGdbMl0gPSBucCAqICgtMTcgLyA0ODAgKyBuICogKDM3IC8gODQwICsgbiAqICgyMDkgLyA0NDgwICsgbiAqICgtNTU2OSAvIDkwNzIwICkpKSk7XG4gIHRoaXMuZ3R1WzJdID0gbnAgKiAoNjEgLyAyNDAgKyBuICogKC0xMDMgLyAxNDAgKyBuICogKDE1MDYxIC8gMjY4ODAgKyBuICogKDE2NzYwMyAvIDE4MTQ0MCkpKSk7XG5cbiAgbnAgPSBucCAqIG47XG4gIHRoaXMudXRnWzNdID0gbnAgKiAoLTQzOTcgLyAxNjEyODAgKyBuICogKDExIC8gNTA0ICsgbiAqICg4MzAyNTEgLyA3MjU3NjAwKSkpO1xuICB0aGlzLmd0dVszXSA9IG5wICogKDQ5NTYxIC8gMTYxMjgwICsgbiAqICgtMTc5IC8gMTY4ICsgbiAqICg2NjAxNjYxIC8gNzI1NzYwMCkpKTtcblxuICBucCA9IG5wICogbjtcbiAgdGhpcy51dGdbNF0gPSBucCAqICgtNDU4MyAvIDE2MTI4MCArIG4gKiAoMTA4ODQ3IC8gMzk5MTY4MCkpO1xuICB0aGlzLmd0dVs0XSA9IG5wICogKDM0NzI5IC8gODA2NDAgKyBuICogKC0zNDE4ODg5IC8gMTk5NTg0MCkpO1xuXG4gIG5wID0gbnAgKiBuO1xuICB0aGlzLnV0Z1s1XSA9IG5wICogKC0yMDY0ODY5MyAvIDYzODY2ODgwMCk7XG4gIHRoaXMuZ3R1WzVdID0gbnAgKiAoMjEyMzc4OTQxIC8gMzE5MzM0NDAwKTtcblxuICB2YXIgWiA9IGdhdGcodGhpcy5jYmcsIHRoaXMubGF0MCk7XG4gIHRoaXMuWmIgPSAtdGhpcy5RbiAqIChaICsgY2xlbnModGhpcy5ndHUsIDIgKiBaKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIENlID0gYWRqdXN0X2xvbihwLnggLSB0aGlzLmxvbmcwKTtcbiAgdmFyIENuID0gcC55O1xuXG4gIENuID0gZ2F0Zyh0aGlzLmNiZywgQ24pO1xuICB2YXIgc2luX0NuID0gTWF0aC5zaW4oQ24pO1xuICB2YXIgY29zX0NuID0gTWF0aC5jb3MoQ24pO1xuICB2YXIgc2luX0NlID0gTWF0aC5zaW4oQ2UpO1xuICB2YXIgY29zX0NlID0gTWF0aC5jb3MoQ2UpO1xuXG4gIENuID0gTWF0aC5hdGFuMihzaW5fQ24sIGNvc19DZSAqIGNvc19Dbik7XG4gIENlID0gTWF0aC5hdGFuMihzaW5fQ2UgKiBjb3NfQ24sIGh5cG90KHNpbl9DbiwgY29zX0NuICogY29zX0NlKSk7XG4gIENlID0gYXNpbmh5KE1hdGgudGFuKENlKSk7XG5cbiAgdmFyIHRtcCA9IGNsZW5zX2NtcGx4KHRoaXMuZ3R1LCAyICogQ24sIDIgKiBDZSk7XG5cbiAgQ24gPSBDbiArIHRtcFswXTtcbiAgQ2UgPSBDZSArIHRtcFsxXTtcblxuICB2YXIgeDtcbiAgdmFyIHk7XG5cbiAgaWYgKE1hdGguYWJzKENlKSA8PSAyLjYyMzM5NTE2Mjc3OCkge1xuICAgIHggPSB0aGlzLmEgKiAodGhpcy5RbiAqIENlKSArIHRoaXMueDA7XG4gICAgeSA9IHRoaXMuYSAqICh0aGlzLlFuICogQ24gKyB0aGlzLlpiKSArIHRoaXMueTA7XG4gIH1cbiAgZWxzZSB7XG4gICAgeCA9IEluZmluaXR5O1xuICAgIHkgPSBJbmZpbml0eTtcbiAgfVxuXG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIENlID0gKHAueCAtIHRoaXMueDApICogKDEgLyB0aGlzLmEpO1xuICB2YXIgQ24gPSAocC55IC0gdGhpcy55MCkgKiAoMSAvIHRoaXMuYSk7XG5cbiAgQ24gPSAoQ24gLSB0aGlzLlpiKSAvIHRoaXMuUW47XG4gIENlID0gQ2UgLyB0aGlzLlFuO1xuXG4gIHZhciBsb247XG4gIHZhciBsYXQ7XG5cbiAgaWYgKE1hdGguYWJzKENlKSA8PSAyLjYyMzM5NTE2Mjc3OCkge1xuICAgIHZhciB0bXAgPSBjbGVuc19jbXBseCh0aGlzLnV0ZywgMiAqIENuLCAyICogQ2UpO1xuXG4gICAgQ24gPSBDbiArIHRtcFswXTtcbiAgICBDZSA9IENlICsgdG1wWzFdO1xuICAgIENlID0gTWF0aC5hdGFuKHNpbmgoQ2UpKTtcblxuICAgIHZhciBzaW5fQ24gPSBNYXRoLnNpbihDbik7XG4gICAgdmFyIGNvc19DbiA9IE1hdGguY29zKENuKTtcbiAgICB2YXIgc2luX0NlID0gTWF0aC5zaW4oQ2UpO1xuICAgIHZhciBjb3NfQ2UgPSBNYXRoLmNvcyhDZSk7XG5cbiAgICBDbiA9IE1hdGguYXRhbjIoc2luX0NuICogY29zX0NlLCBoeXBvdChzaW5fQ2UsIGNvc19DZSAqIGNvc19DbikpO1xuICAgIENlID0gTWF0aC5hdGFuMihzaW5fQ2UsIGNvc19DZSAqIGNvc19Dbik7XG5cbiAgICBsb24gPSBhZGp1c3RfbG9uKENlICsgdGhpcy5sb25nMCk7XG4gICAgbGF0ID0gZ2F0Zyh0aGlzLmNnYiwgQ24pO1xuICB9XG4gIGVsc2Uge1xuICAgIGxvbiA9IEluZmluaXR5O1xuICAgIGxhdCA9IEluZmluaXR5O1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJFeHRlbmRlZF9UcmFuc3ZlcnNlX01lcmNhdG9yXCIsIFwiRXh0ZW5kZWQgVHJhbnN2ZXJzZSBNZXJjYXRvclwiLCBcImV0bWVyY1wiLCBcIlRyYW5zdmVyc2VfTWVyY2F0b3JcIiwgXCJUcmFuc3ZlcnNlIE1lcmNhdG9yXCIsIFwidG1lcmNcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBzcmF0IGZyb20gJy4uL2NvbW1vbi9zcmF0JztcbnZhciBNQVhfSVRFUiA9IDIwO1xuaW1wb3J0IHtIQUxGX1BJLCBGT1JUUEl9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHNwaGkgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB2YXIgY3BoaSA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIGNwaGkgKj0gY3BoaTtcbiAgdGhpcy5yYyA9IE1hdGguc3FydCgxIC0gdGhpcy5lcykgLyAoMSAtIHRoaXMuZXMgKiBzcGhpICogc3BoaSk7XG4gIHRoaXMuQyA9IE1hdGguc3FydCgxICsgdGhpcy5lcyAqIGNwaGkgKiBjcGhpIC8gKDEgLSB0aGlzLmVzKSk7XG4gIHRoaXMucGhpYzAgPSBNYXRoLmFzaW4oc3BoaSAvIHRoaXMuQyk7XG4gIHRoaXMucmF0ZXhwID0gMC41ICogdGhpcy5DICogdGhpcy5lO1xuICB0aGlzLksgPSBNYXRoLnRhbigwLjUgKiB0aGlzLnBoaWMwICsgRk9SVFBJKSAvIChNYXRoLnBvdyhNYXRoLnRhbigwLjUgKiB0aGlzLmxhdDAgKyBGT1JUUEkpLCB0aGlzLkMpICogc3JhdCh0aGlzLmUgKiBzcGhpLCB0aGlzLnJhdGV4cCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgcC55ID0gMiAqIE1hdGguYXRhbih0aGlzLksgKiBNYXRoLnBvdyhNYXRoLnRhbigwLjUgKiBsYXQgKyBGT1JUUEkpLCB0aGlzLkMpICogc3JhdCh0aGlzLmUgKiBNYXRoLnNpbihsYXQpLCB0aGlzLnJhdGV4cCkpIC0gSEFMRl9QSTtcbiAgcC54ID0gdGhpcy5DICogbG9uO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgREVMX1RPTCA9IDFlLTE0O1xuICB2YXIgbG9uID0gcC54IC8gdGhpcy5DO1xuICB2YXIgbGF0ID0gcC55O1xuICB2YXIgbnVtID0gTWF0aC5wb3coTWF0aC50YW4oMC41ICogbGF0ICsgRk9SVFBJKSAvIHRoaXMuSywgMSAvIHRoaXMuQyk7XG4gIGZvciAodmFyIGkgPSBNQVhfSVRFUjsgaSA+IDA7IC0taSkge1xuICAgIGxhdCA9IDIgKiBNYXRoLmF0YW4obnVtICogc3JhdCh0aGlzLmUgKiBNYXRoLnNpbihwLnkpLCAtIDAuNSAqIHRoaXMuZSkpIC0gSEFMRl9QSTtcbiAgICBpZiAoTWF0aC5hYnMobGF0IC0gcC55KSA8IERFTF9UT0wpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBwLnkgPSBsYXQ7XG4gIH1cbiAgLyogY29udmVyZ2VuY2UgZmFpbGVkICovXG4gIGlmICghaSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcImdhdXNzXCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQge1xuICAgIGdlb2RldGljVG9HZW9jZW50cmljLFxuICAgIGdlb2NlbnRyaWNUb0dlb2RldGljXG59IGZyb20gJy4uL2RhdHVtVXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLm5hbWUgPSAnZ2VvY2VudCc7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICAgIHZhciBwb2ludCA9IGdlb2RldGljVG9HZW9jZW50cmljKHAsIHRoaXMuZXMsIHRoaXMuYSk7XG4gICAgcmV0dXJuIHBvaW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gICAgdmFyIHBvaW50ID0gZ2VvY2VudHJpY1RvR2VvZGV0aWMocCwgdGhpcy5lcywgdGhpcy5hLCB0aGlzLmIpO1xuICAgIHJldHVybiBwb2ludDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIkdlb2NlbnRyaWNcIiwgJ2dlb2NlbnRyaWMnLCBcImdlb2NlbnRcIiwgXCJHZW9jZW50XCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQ6IGluaXQsXG4gICAgZm9yd2FyZDogZm9yd2FyZCxcbiAgICBpbnZlcnNlOiBpbnZlcnNlLFxuICAgIG5hbWVzOiBuYW1lc1xufTsiLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcbmltcG9ydCB7RVBTTE59IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKlxuICByZWZlcmVuY2U6XG4gICAgV29sZnJhbSBNYXRod29ybGQgXCJHbm9tb25pYyBQcm9qZWN0aW9uXCJcbiAgICBodHRwOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL0dub21vbmljUHJvamVjdGlvbi5odG1sXG4gICAgQWNjZXNzZWQ6IDEydGggTm92ZW1iZXIgMjAwOVxuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgLyogUGxhY2UgcGFyYW1ldGVycyBpbiBzdGF0aWMgc3RvcmFnZSBmb3IgY29tbW9uIHVzZVxuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gIHRoaXMuc2luX3AxNCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gIHRoaXMuY29zX3AxNCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gIC8vIEFwcHJveGltYXRpb24gZm9yIHByb2plY3RpbmcgcG9pbnRzIHRvIHRoZSBob3Jpem9uIChpbmZpbml0eSlcbiAgdGhpcy5pbmZpbml0eV9kaXN0ID0gMTAwMCAqIHRoaXMuYTtcbiAgdGhpcy5yYyA9IDE7XG59XG5cbi8qIEdub21vbmljIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBzaW5waGksIGNvc3BoaTsgLyogc2luIGFuZCBjb3MgdmFsdWUgICAgICAgICovXG4gIHZhciBkbG9uOyAvKiBkZWx0YSBsb25naXR1ZGUgdmFsdWUgICAgICAqL1xuICB2YXIgY29zbG9uOyAvKiBjb3Mgb2YgbG9uZ2l0dWRlICAgICAgICAqL1xuICB2YXIga3NwOyAvKiBzY2FsZSBmYWN0b3IgICAgICAgICAgKi9cbiAgdmFyIGc7XG4gIHZhciB4LCB5O1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICBkbG9uID0gYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcblxuICBzaW5waGkgPSBNYXRoLnNpbihsYXQpO1xuICBjb3NwaGkgPSBNYXRoLmNvcyhsYXQpO1xuXG4gIGNvc2xvbiA9IE1hdGguY29zKGRsb24pO1xuICBnID0gdGhpcy5zaW5fcDE0ICogc2lucGhpICsgdGhpcy5jb3NfcDE0ICogY29zcGhpICogY29zbG9uO1xuICBrc3AgPSAxO1xuICBpZiAoKGcgPiAwKSB8fCAoTWF0aC5hYnMoZykgPD0gRVBTTE4pKSB7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiBrc3AgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKSAvIGc7XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBrc3AgKiAodGhpcy5jb3NfcDE0ICogc2lucGhpIC0gdGhpcy5zaW5fcDE0ICogY29zcGhpICogY29zbG9uKSAvIGc7XG4gIH1cbiAgZWxzZSB7XG5cbiAgICAvLyBQb2ludCBpcyBpbiB0aGUgb3Bwb3NpbmcgaGVtaXNwaGVyZSBhbmQgaXMgdW5wcm9qZWN0YWJsZVxuICAgIC8vIFdlIHN0aWxsIG5lZWQgdG8gcmV0dXJuIGEgcmVhc29uYWJsZSBwb2ludCwgc28gd2UgcHJvamVjdFxuICAgIC8vIHRvIGluZmluaXR5LCBvbiBhIGJlYXJpbmdcbiAgICAvLyBlcXVpdmFsZW50IHRvIHRoZSBub3J0aGVybiBoZW1pc3BoZXJlIGVxdWl2YWxlbnRcbiAgICAvLyBUaGlzIGlzIGEgcmVhc29uYWJsZSBhcHByb3hpbWF0aW9uIGZvciBzaG9ydCBzaGFwZXMgYW5kIGxpbmVzIHRoYXRcbiAgICAvLyBzdHJhZGRsZSB0aGUgaG9yaXpvbi5cblxuICAgIHggPSB0aGlzLngwICsgdGhpcy5pbmZpbml0eV9kaXN0ICogY29zcGhpICogTWF0aC5zaW4oZGxvbik7XG4gICAgeSA9IHRoaXMueTAgKyB0aGlzLmluZmluaXR5X2Rpc3QgKiAodGhpcy5jb3NfcDE0ICogc2lucGhpIC0gdGhpcy5zaW5fcDE0ICogY29zcGhpICogY29zbG9uKTtcblxuICB9XG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDsgLyogUmhvICovXG4gIHZhciBzaW5jLCBjb3NjO1xuICB2YXIgYztcbiAgdmFyIGxvbiwgbGF0O1xuXG4gIC8qIEludmVyc2UgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIHAueCAvPSB0aGlzLmswO1xuICBwLnkgLz0gdGhpcy5rMDtcblxuICBpZiAoKHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSkpKSB7XG4gICAgYyA9IE1hdGguYXRhbjIocmgsIHRoaXMucmMpO1xuICAgIHNpbmMgPSBNYXRoLnNpbihjKTtcbiAgICBjb3NjID0gTWF0aC5jb3MoYyk7XG5cbiAgICBsYXQgPSBhc2lueihjb3NjICogdGhpcy5zaW5fcDE0ICsgKHAueSAqIHNpbmMgKiB0aGlzLmNvc19wMTQpIC8gcmgpO1xuICAgIGxvbiA9IE1hdGguYXRhbjIocC54ICogc2luYywgcmggKiB0aGlzLmNvc19wMTQgKiBjb3NjIC0gcC55ICogdGhpcy5zaW5fcDE0ICogc2luYyk7XG4gICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgbG9uKTtcbiAgfVxuICBlbHNlIHtcbiAgICBsYXQgPSB0aGlzLnBoaWMwO1xuICAgIGxvbiA9IDA7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJnbm9tXCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLmEgPSA2Mzc3Mzk3LjE1NTtcbiAgdGhpcy5lcyA9IDAuMDA2Njc0MzcyMjMwNjE0O1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG4gIGlmICghdGhpcy5sYXQwKSB7XG4gICAgdGhpcy5sYXQwID0gMC44NjM5Mzc5Nzk3MzcxOTM7XG4gIH1cbiAgaWYgKCF0aGlzLmxvbmcwKSB7XG4gICAgdGhpcy5sb25nMCA9IDAuNzQxNzY0OTMyMDk3NTkwMSAtIDAuMzA4MzQxNTAxMTg1NjY1O1xuICB9XG4gIC8qIGlmIHNjYWxlIG5vdCBzZXQgZGVmYXVsdCB0byAwLjk5OTkgKi9cbiAgaWYgKCF0aGlzLmswKSB7XG4gICAgdGhpcy5rMCA9IDAuOTk5OTtcbiAgfVxuICB0aGlzLnM0NSA9IDAuNzg1Mzk4MTYzMzk3NDQ4OyAvKiA0NSAqL1xuICB0aGlzLnM5MCA9IDIgKiB0aGlzLnM0NTtcbiAgdGhpcy5maTAgPSB0aGlzLmxhdDA7XG4gIHRoaXMuZTIgPSB0aGlzLmVzO1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lMik7XG4gIHRoaXMuYWxmYSA9IE1hdGguc3FydCgxICsgKHRoaXMuZTIgKiBNYXRoLnBvdyhNYXRoLmNvcyh0aGlzLmZpMCksIDQpKSAvICgxIC0gdGhpcy5lMikpO1xuICB0aGlzLnVxID0gMS4wNDIxNjg1NjM4MDQ3NDtcbiAgdGhpcy51MCA9IE1hdGguYXNpbihNYXRoLnNpbih0aGlzLmZpMCkgLyB0aGlzLmFsZmEpO1xuICB0aGlzLmcgPSBNYXRoLnBvdygoMSArIHRoaXMuZSAqIE1hdGguc2luKHRoaXMuZmkwKSkgLyAoMSAtIHRoaXMuZSAqIE1hdGguc2luKHRoaXMuZmkwKSksIHRoaXMuYWxmYSAqIHRoaXMuZSAvIDIpO1xuICB0aGlzLmsgPSBNYXRoLnRhbih0aGlzLnUwIC8gMiArIHRoaXMuczQ1KSAvIE1hdGgucG93KE1hdGgudGFuKHRoaXMuZmkwIC8gMiArIHRoaXMuczQ1KSwgdGhpcy5hbGZhKSAqIHRoaXMuZztcbiAgdGhpcy5rMSA9IHRoaXMuazA7XG4gIHRoaXMubjAgPSB0aGlzLmEgKiBNYXRoLnNxcnQoMSAtIHRoaXMuZTIpIC8gKDEgLSB0aGlzLmUyICogTWF0aC5wb3coTWF0aC5zaW4odGhpcy5maTApLCAyKSk7XG4gIHRoaXMuczAgPSAxLjM3MDA4MzQ2MjgxNTU1O1xuICB0aGlzLm4gPSBNYXRoLnNpbih0aGlzLnMwKTtcbiAgdGhpcy5ybzAgPSB0aGlzLmsxICogdGhpcy5uMCAvIE1hdGgudGFuKHRoaXMuczApO1xuICB0aGlzLmFkID0gdGhpcy5zOTAgLSB0aGlzLnVxO1xufVxuXG4vKiBlbGxpcHNvaWQgKi9cbi8qIGNhbGN1bGF0ZSB4eSBmcm9tIGxhdC9sb24gKi9cbi8qIENvbnN0YW50cywgaWRlbnRpY2FsIHRvIGludmVyc2UgdHJhbnNmb3JtIGZ1bmN0aW9uICovXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBnZmksIHUsIGRlbHRhdiwgcywgZCwgZXBzLCBybztcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIGRlbHRhX2xvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gIC8qIFRyYW5zZm9ybWF0aW9uICovXG4gIGdmaSA9IE1hdGgucG93KCgoMSArIHRoaXMuZSAqIE1hdGguc2luKGxhdCkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihsYXQpKSksICh0aGlzLmFsZmEgKiB0aGlzLmUgLyAyKSk7XG4gIHUgPSAyICogKE1hdGguYXRhbih0aGlzLmsgKiBNYXRoLnBvdyhNYXRoLnRhbihsYXQgLyAyICsgdGhpcy5zNDUpLCB0aGlzLmFsZmEpIC8gZ2ZpKSAtIHRoaXMuczQ1KTtcbiAgZGVsdGF2ID0gLWRlbHRhX2xvbiAqIHRoaXMuYWxmYTtcbiAgcyA9IE1hdGguYXNpbihNYXRoLmNvcyh0aGlzLmFkKSAqIE1hdGguc2luKHUpICsgTWF0aC5zaW4odGhpcy5hZCkgKiBNYXRoLmNvcyh1KSAqIE1hdGguY29zKGRlbHRhdikpO1xuICBkID0gTWF0aC5hc2luKE1hdGguY29zKHUpICogTWF0aC5zaW4oZGVsdGF2KSAvIE1hdGguY29zKHMpKTtcbiAgZXBzID0gdGhpcy5uICogZDtcbiAgcm8gPSB0aGlzLnJvMCAqIE1hdGgucG93KE1hdGgudGFuKHRoaXMuczAgLyAyICsgdGhpcy5zNDUpLCB0aGlzLm4pIC8gTWF0aC5wb3coTWF0aC50YW4ocyAvIDIgKyB0aGlzLnM0NSksIHRoaXMubik7XG4gIHAueSA9IHJvICogTWF0aC5jb3MoZXBzKSAvIDE7XG4gIHAueCA9IHJvICogTWF0aC5zaW4oZXBzKSAvIDE7XG5cbiAgaWYgKCF0aGlzLmN6ZWNoKSB7XG4gICAgcC55ICo9IC0xO1xuICAgIHAueCAqPSAtMTtcbiAgfVxuICByZXR1cm4gKHApO1xufVxuXG4vKiBjYWxjdWxhdGUgbGF0L2xvbiBmcm9tIHh5ICovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciB1LCBkZWx0YXYsIHMsIGQsIGVwcywgcm8sIGZpMTtcbiAgdmFyIG9rO1xuXG4gIC8qIFRyYW5zZm9ybWF0aW9uICovXG4gIC8qIHJldmVydCB5LCB4Ki9cbiAgdmFyIHRtcCA9IHAueDtcbiAgcC54ID0gcC55O1xuICBwLnkgPSB0bXA7XG4gIGlmICghdGhpcy5jemVjaCkge1xuICAgIHAueSAqPSAtMTtcbiAgICBwLnggKj0gLTE7XG4gIH1cbiAgcm8gPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KTtcbiAgZXBzID0gTWF0aC5hdGFuMihwLnksIHAueCk7XG4gIGQgPSBlcHMgLyBNYXRoLnNpbih0aGlzLnMwKTtcbiAgcyA9IDIgKiAoTWF0aC5hdGFuKE1hdGgucG93KHRoaXMucm8wIC8gcm8sIDEgLyB0aGlzLm4pICogTWF0aC50YW4odGhpcy5zMCAvIDIgKyB0aGlzLnM0NSkpIC0gdGhpcy5zNDUpO1xuICB1ID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYWQpICogTWF0aC5zaW4ocykgLSBNYXRoLnNpbih0aGlzLmFkKSAqIE1hdGguY29zKHMpICogTWF0aC5jb3MoZCkpO1xuICBkZWx0YXYgPSBNYXRoLmFzaW4oTWF0aC5jb3MocykgKiBNYXRoLnNpbihkKSAvIE1hdGguY29zKHUpKTtcbiAgcC54ID0gdGhpcy5sb25nMCAtIGRlbHRhdiAvIHRoaXMuYWxmYTtcbiAgZmkxID0gdTtcbiAgb2sgPSAwO1xuICB2YXIgaXRlciA9IDA7XG4gIGRvIHtcbiAgICBwLnkgPSAyICogKE1hdGguYXRhbihNYXRoLnBvdyh0aGlzLmssIC0gMSAvIHRoaXMuYWxmYSkgKiBNYXRoLnBvdyhNYXRoLnRhbih1IC8gMiArIHRoaXMuczQ1KSwgMSAvIHRoaXMuYWxmYSkgKiBNYXRoLnBvdygoMSArIHRoaXMuZSAqIE1hdGguc2luKGZpMSkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihmaTEpKSwgdGhpcy5lIC8gMikpIC0gdGhpcy5zNDUpO1xuICAgIGlmIChNYXRoLmFicyhmaTEgLSBwLnkpIDwgMC4wMDAwMDAwMDAxKSB7XG4gICAgICBvayA9IDE7XG4gICAgfVxuICAgIGZpMSA9IHAueTtcbiAgICBpdGVyICs9IDE7XG4gIH0gd2hpbGUgKG9rID09PSAwICYmIGl0ZXIgPCAxNSk7XG4gIGlmIChpdGVyID49IDE1KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKHApO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiS3JvdmFrXCIsIFwia3JvdmFrXCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJcbmltcG9ydCB7SEFMRl9QSSwgRVBTTE4sIEZPUlRQSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBxc2ZueiBmcm9tICcuLi9jb21tb24vcXNmbnonO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuXG4vKlxuICByZWZlcmVuY2VcbiAgICBcIk5ldyBFcXVhbC1BcmVhIE1hcCBQcm9qZWN0aW9ucyBmb3IgTm9uY2lyY3VsYXIgUmVnaW9uc1wiLCBKb2huIFAuIFNueWRlcixcbiAgICBUaGUgQW1lcmljYW4gQ2FydG9ncmFwaGVyLCBWb2wgMTUsIE5vLiA0LCBPY3RvYmVyIDE5ODgsIHBwLiAzNDEtMzU1LlxuICAqL1xuXG5leHBvcnQgdmFyIFNfUE9MRSA9IDE7XG5cbmV4cG9ydCB2YXIgTl9QT0xFID0gMjtcbmV4cG9ydCB2YXIgRVFVSVQgPSAzO1xuZXhwb3J0IHZhciBPQkxJUSA9IDQ7XG5cbi8qIEluaXRpYWxpemUgdGhlIExhbWJlcnQgQXppbXV0aGFsIEVxdWFsIEFyZWEgcHJvamVjdGlvblxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciB0ID0gTWF0aC5hYnModGhpcy5sYXQwKTtcbiAgaWYgKE1hdGguYWJzKHQgLSBIQUxGX1BJKSA8IEVQU0xOKSB7XG4gICAgdGhpcy5tb2RlID0gdGhpcy5sYXQwIDwgMCA/IHRoaXMuU19QT0xFIDogdGhpcy5OX1BPTEU7XG4gIH1cbiAgZWxzZSBpZiAoTWF0aC5hYnModCkgPCBFUFNMTikge1xuICAgIHRoaXMubW9kZSA9IHRoaXMuRVFVSVQ7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5tb2RlID0gdGhpcy5PQkxJUTtcbiAgfVxuICBpZiAodGhpcy5lcyA+IDApIHtcbiAgICB2YXIgc2lucGhpO1xuXG4gICAgdGhpcy5xcCA9IHFzZm56KHRoaXMuZSwgMSk7XG4gICAgdGhpcy5tbWYgPSAwLjUgLyAoMSAtIHRoaXMuZXMpO1xuICAgIHRoaXMuYXBhID0gYXV0aHNldCh0aGlzLmVzKTtcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgIGNhc2UgdGhpcy5OX1BPTEU6XG4gICAgICB0aGlzLmRkID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdGhpcy5TX1BPTEU6XG4gICAgICB0aGlzLmRkID0gMTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdGhpcy5FUVVJVDpcbiAgICAgIHRoaXMucnEgPSBNYXRoLnNxcnQoMC41ICogdGhpcy5xcCk7XG4gICAgICB0aGlzLmRkID0gMSAvIHRoaXMucnE7XG4gICAgICB0aGlzLnhtZiA9IDE7XG4gICAgICB0aGlzLnltZiA9IDAuNSAqIHRoaXMucXA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIHRoaXMuT0JMSVE6XG4gICAgICB0aGlzLnJxID0gTWF0aC5zcXJ0KDAuNSAqIHRoaXMucXApO1xuICAgICAgc2lucGhpID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgICAgIHRoaXMuc2luYjEgPSBxc2Zueih0aGlzLmUsIHNpbnBoaSkgLyB0aGlzLnFwO1xuICAgICAgdGhpcy5jb3NiMSA9IE1hdGguc3FydCgxIC0gdGhpcy5zaW5iMSAqIHRoaXMuc2luYjEpO1xuICAgICAgdGhpcy5kZCA9IE1hdGguY29zKHRoaXMubGF0MCkgLyAoTWF0aC5zcXJ0KDEgLSB0aGlzLmVzICogc2lucGhpICogc2lucGhpKSAqIHRoaXMucnEgKiB0aGlzLmNvc2IxKTtcbiAgICAgIHRoaXMueW1mID0gKHRoaXMueG1mID0gdGhpcy5ycSkgLyB0aGlzLmRkO1xuICAgICAgdGhpcy54bWYgKj0gdGhpcy5kZDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRKSB7XG4gICAgICB0aGlzLnNpbnBoMCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gICAgICB0aGlzLmNvc3BoMCA9IE1hdGguY29zKHRoaXMubGF0MCk7XG4gICAgfVxuICB9XG59XG5cbi8qIExhbWJlcnQgQXppbXV0aGFsIEVxdWFsIEFyZWEgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcblxuICAvKiBGb3J3YXJkIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICB2YXIgeCwgeSwgY29zbGFtLCBzaW5sYW0sIHNpbnBoaSwgcSwgc2luYiwgY29zYiwgYiwgY29zcGhpO1xuICB2YXIgbGFtID0gcC54O1xuICB2YXIgcGhpID0gcC55O1xuXG4gIGxhbSA9IGFkanVzdF9sb24obGFtIC0gdGhpcy5sb25nMCk7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgY29zcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICBjb3NsYW0gPSBNYXRoLmNvcyhsYW0pO1xuICAgIGlmICh0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEgfHwgdGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSB7XG4gICAgICB5ID0gKHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkgPyAxICsgY29zcGhpICogY29zbGFtIDogMSArIHRoaXMuc2lucGgwICogc2lucGhpICsgdGhpcy5jb3NwaDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBpZiAoeSA8PSBFUFNMTikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHkgPSBNYXRoLnNxcnQoMiAvIHkpO1xuICAgICAgeCA9IHkgKiBjb3NwaGkgKiBNYXRoLnNpbihsYW0pO1xuICAgICAgeSAqPSAodGhpcy5tb2RlID09PSB0aGlzLkVRVUlUKSA/IHNpbnBoaSA6IHRoaXMuY29zcGgwICogc2lucGhpIC0gdGhpcy5zaW5waDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUgfHwgdGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUpIHtcbiAgICAgICAgY29zbGFtID0gLWNvc2xhbTtcbiAgICAgIH1cbiAgICAgIGlmIChNYXRoLmFicyhwaGkgKyB0aGlzLmxhdDApIDwgRVBTTE4pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICB5ID0gRk9SVFBJIC0gcGhpICogMC41O1xuICAgICAgeSA9IDIgKiAoKHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpID8gTWF0aC5jb3MoeSkgOiBNYXRoLnNpbih5KSk7XG4gICAgICB4ID0geSAqIE1hdGguc2luKGxhbSk7XG4gICAgICB5ICo9IGNvc2xhbTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgc2luYiA9IDA7XG4gICAgY29zYiA9IDA7XG4gICAgYiA9IDA7XG4gICAgY29zbGFtID0gTWF0aC5jb3MobGFtKTtcbiAgICBzaW5sYW0gPSBNYXRoLnNpbihsYW0pO1xuICAgIHNpbnBoaSA9IE1hdGguc2luKHBoaSk7XG4gICAgcSA9IHFzZm56KHRoaXMuZSwgc2lucGhpKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgc2luYiA9IHEgLyB0aGlzLnFwO1xuICAgICAgY29zYiA9IE1hdGguc3FydCgxIC0gc2luYiAqIHNpbmIpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgIGNhc2UgdGhpcy5PQkxJUTpcbiAgICAgIGIgPSAxICsgdGhpcy5zaW5iMSAqIHNpbmIgKyB0aGlzLmNvc2IxICogY29zYiAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdGhpcy5FUVVJVDpcbiAgICAgIGIgPSAxICsgY29zYiAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdGhpcy5OX1BPTEU6XG4gICAgICBiID0gSEFMRl9QSSArIHBoaTtcbiAgICAgIHEgPSB0aGlzLnFwIC0gcTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgdGhpcy5TX1BPTEU6XG4gICAgICBiID0gcGhpIC0gSEFMRl9QSTtcbiAgICAgIHEgPSB0aGlzLnFwICsgcTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoTWF0aC5hYnMoYikgPCBFUFNMTikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSB0aGlzLk9CTElROlxuICAgIGNhc2UgdGhpcy5FUVVJVDpcbiAgICAgIGIgPSBNYXRoLnNxcnQoMiAvIGIpO1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkge1xuICAgICAgICB5ID0gdGhpcy55bWYgKiBiICogKHRoaXMuY29zYjEgKiBzaW5iIC0gdGhpcy5zaW5iMSAqIGNvc2IgKiBjb3NsYW0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHkgPSAoYiA9IE1hdGguc3FydCgyIC8gKDEgKyBjb3NiICogY29zbGFtKSkpICogc2luYiAqIHRoaXMueW1mO1xuICAgICAgfVxuICAgICAgeCA9IHRoaXMueG1mICogYiAqIGNvc2IgKiBzaW5sYW07XG4gICAgICBicmVhaztcbiAgICBjYXNlIHRoaXMuTl9QT0xFOlxuICAgIGNhc2UgdGhpcy5TX1BPTEU6XG4gICAgICBpZiAocSA+PSAwKSB7XG4gICAgICAgIHggPSAoYiA9IE1hdGguc3FydChxKSkgKiBzaW5sYW07XG4gICAgICAgIHkgPSBjb3NsYW0gKiAoKHRoaXMubW9kZSA9PT0gdGhpcy5TX1BPTEUpID8gYiA6IC1iKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB4ID0geSA9IDA7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwLnggPSB0aGlzLmEgKiB4ICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5hICogeSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG4vKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIHggPSBwLnggLyB0aGlzLmE7XG4gIHZhciB5ID0gcC55IC8gdGhpcy5hO1xuICB2YXIgbGFtLCBwaGksIGNDZSwgc0NlLCBxLCByaG8sIGFiO1xuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICB2YXIgY29zeiA9IDAsXG4gICAgICByaCwgc2lueiA9IDA7XG5cbiAgICByaCA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICBwaGkgPSByaCAqIDAuNTtcbiAgICBpZiAocGhpID4gMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHBoaSA9IDIgKiBNYXRoLmFzaW4ocGhpKTtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgc2lueiA9IE1hdGguc2luKHBoaSk7XG4gICAgICBjb3N6ID0gTWF0aC5jb3MocGhpKTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICBjYXNlIHRoaXMuRVFVSVQ6XG4gICAgICBwaGkgPSAoTWF0aC5hYnMocmgpIDw9IEVQU0xOKSA/IDAgOiBNYXRoLmFzaW4oeSAqIHNpbnogLyByaCk7XG4gICAgICB4ICo9IHNpbno7XG4gICAgICB5ID0gY29zeiAqIHJoO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSB0aGlzLk9CTElROlxuICAgICAgcGhpID0gKE1hdGguYWJzKHJoKSA8PSBFUFNMTikgPyB0aGlzLmxhdDAgOiBNYXRoLmFzaW4oY29zeiAqIHRoaXMuc2lucGgwICsgeSAqIHNpbnogKiB0aGlzLmNvc3BoMCAvIHJoKTtcbiAgICAgIHggKj0gc2lueiAqIHRoaXMuY29zcGgwO1xuICAgICAgeSA9IChjb3N6IC0gTWF0aC5zaW4ocGhpKSAqIHRoaXMuc2lucGgwKSAqIHJoO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSB0aGlzLk5fUE9MRTpcbiAgICAgIHkgPSAteTtcbiAgICAgIHBoaSA9IEhBTEZfUEkgLSBwaGk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIHRoaXMuU19QT0xFOlxuICAgICAgcGhpIC09IEhBTEZfUEk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgbGFtID0gKHkgPT09IDAgJiYgKHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCB8fCB0aGlzLm1vZGUgPT09IHRoaXMuT0JMSVEpKSA/IDAgOiBNYXRoLmF0YW4yKHgsIHkpO1xuICB9XG4gIGVsc2Uge1xuICAgIGFiID0gMDtcbiAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLk9CTElRIHx8IHRoaXMubW9kZSA9PT0gdGhpcy5FUVVJVCkge1xuICAgICAgeCAvPSB0aGlzLmRkO1xuICAgICAgeSAqPSB0aGlzLmRkO1xuICAgICAgcmhvID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgICAgaWYgKHJobyA8IEVQU0xOKSB7XG4gICAgICAgIHAueCA9IHRoaXMubG9uZzA7XG4gICAgICAgIHAueSA9IHRoaXMubGF0MDtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9XG4gICAgICBzQ2UgPSAyICogTWF0aC5hc2luKDAuNSAqIHJobyAvIHRoaXMucnEpO1xuICAgICAgY0NlID0gTWF0aC5jb3Moc0NlKTtcbiAgICAgIHggKj0gKHNDZSA9IE1hdGguc2luKHNDZSkpO1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5PQkxJUSkge1xuICAgICAgICBhYiA9IGNDZSAqIHRoaXMuc2luYjEgKyB5ICogc0NlICogdGhpcy5jb3NiMSAvIHJobztcbiAgICAgICAgcSA9IHRoaXMucXAgKiBhYjtcbiAgICAgICAgeSA9IHJobyAqIHRoaXMuY29zYjEgKiBjQ2UgLSB5ICogdGhpcy5zaW5iMSAqIHNDZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBhYiA9IHkgKiBzQ2UgLyByaG87XG4gICAgICAgIHEgPSB0aGlzLnFwICogYWI7XG4gICAgICAgIHkgPSByaG8gKiBjQ2U7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUgfHwgdGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gdGhpcy5OX1BPTEUpIHtcbiAgICAgICAgeSA9IC15O1xuICAgICAgfVxuICAgICAgcSA9ICh4ICogeCArIHkgKiB5KTtcbiAgICAgIGlmICghcSkge1xuICAgICAgICBwLnggPSB0aGlzLmxvbmcwO1xuICAgICAgICBwLnkgPSB0aGlzLmxhdDA7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfVxuICAgICAgYWIgPSAxIC0gcSAvIHRoaXMucXA7XG4gICAgICBpZiAodGhpcy5tb2RlID09PSB0aGlzLlNfUE9MRSkge1xuICAgICAgICBhYiA9IC1hYjtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFtID0gTWF0aC5hdGFuMih4LCB5KTtcbiAgICBwaGkgPSBhdXRobGF0KE1hdGguYXNpbihhYiksIHRoaXMuYXBhKTtcbiAgfVxuXG4gIHAueCA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIGxhbSk7XG4gIHAueSA9IHBoaTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIGRldGVybWluZSBsYXRpdHVkZSBmcm9tIGF1dGhhbGljIGxhdGl0dWRlICovXG52YXIgUDAwID0gMC4zMzMzMzMzMzMzMzMzMzMzMzMzMztcblxudmFyIFAwMSA9IDAuMTcyMjIyMjIyMjIyMjIyMjIyMjI7XG52YXIgUDAyID0gMC4xMDI1NzkzNjUwNzkzNjUwNzkzNjtcbnZhciBQMTAgPSAwLjA2Mzg4ODg4ODg4ODg4ODg4ODg4O1xudmFyIFAxMSA9IDAuMDY2NDAyMTE2NDAyMTE2NDAyMTE7XG52YXIgUDIwID0gMC4wMTY0MTUwMTI5NDIxOTE1NDQ0MztcblxuZnVuY3Rpb24gYXV0aHNldChlcykge1xuICB2YXIgdDtcbiAgdmFyIEFQQSA9IFtdO1xuICBBUEFbMF0gPSBlcyAqIFAwMDtcbiAgdCA9IGVzICogZXM7XG4gIEFQQVswXSArPSB0ICogUDAxO1xuICBBUEFbMV0gPSB0ICogUDEwO1xuICB0ICo9IGVzO1xuICBBUEFbMF0gKz0gdCAqIFAwMjtcbiAgQVBBWzFdICs9IHQgKiBQMTE7XG4gIEFQQVsyXSA9IHQgKiBQMjA7XG4gIHJldHVybiBBUEE7XG59XG5cbmZ1bmN0aW9uIGF1dGhsYXQoYmV0YSwgQVBBKSB7XG4gIHZhciB0ID0gYmV0YSArIGJldGE7XG4gIHJldHVybiAoYmV0YSArIEFQQVswXSAqIE1hdGguc2luKHQpICsgQVBBWzFdICogTWF0aC5zaW4odCArIHQpICsgQVBBWzJdICogTWF0aC5zaW4odCArIHQgKyB0KSk7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJMYW1iZXJ0IEF6aW11dGhhbCBFcXVhbCBBcmVhXCIsIFwiTGFtYmVydF9BemltdXRoYWxfRXF1YWxfQXJlYVwiLCBcImxhZWFcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lcyxcbiAgU19QT0xFOiBTX1BPTEUsXG4gIE5fUE9MRTogTl9QT0xFLFxuICBFUVVJVDogRVFVSVQsXG4gIE9CTElROiBPQkxJUVxufTtcbiIsImltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgc2lnbiBmcm9tICcuLi9jb21tb24vc2lnbic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCB7SEFMRl9QSSwgRVBTTE59IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIFxuICAvL2RvdWJsZSBsYXQwOyAgICAgICAgICAgICAgICAgICAgLyogdGhlIHJlZmVyZW5jZSBsYXRpdHVkZSAgICAgICAgICAgICAgICovXG4gIC8vZG91YmxlIGxvbmcwOyAgICAgICAgICAgICAgICAgICAvKiB0aGUgcmVmZXJlbmNlIGxvbmdpdHVkZSAgICAgICAgICAgICAgKi9cbiAgLy9kb3VibGUgbGF0MTsgICAgICAgICAgICAgICAgICAgIC8qIGZpcnN0IHN0YW5kYXJkIHBhcmFsbGVsICAgICAgICAgICAgICAqL1xuICAvL2RvdWJsZSBsYXQyOyAgICAgICAgICAgICAgICAgICAgLyogc2Vjb25kIHN0YW5kYXJkIHBhcmFsbGVsICAgICAgICAgICAgICovXG4gIC8vZG91YmxlIHJfbWFqOyAgICAgICAgICAgICAgICAgICAvKiBtYWpvciBheGlzICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgLy9kb3VibGUgcl9taW47ICAgICAgICAgICAgICAgICAgIC8qIG1pbm9yIGF4aXMgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAvL2RvdWJsZSBmYWxzZV9lYXN0OyAgICAgICAgICAgICAgLyogeCBvZmZzZXQgaW4gbWV0ZXJzICAgICAgICAgICAgICAgICAgICovXG4gIC8vZG91YmxlIGZhbHNlX25vcnRoOyAgICAgICAgICAgICAvKiB5IG9mZnNldCBpbiBtZXRlcnMgICAgICAgICAgICAgICAgICAgKi9cbiAgXG4gIC8vdGhlIGFib3ZlIHZhbHVlIGNhbiBiZSBzZXQgd2l0aCBwcm9qNC5kZWZzXG4gIC8vZXhhbXBsZTogcHJvajQuZGVmcyhcIkVQU0c6MjE1NFwiLFwiK3Byb2o9bGNjICtsYXRfMT00OSArbGF0XzI9NDQgK2xhdF8wPTQ2LjUgK2xvbl8wPTMgK3hfMD03MDAwMDAgK3lfMD02NjAwMDAwICtlbGxwcz1HUlM4MCArdG93Z3M4ND0wLDAsMCwwLDAsMCwwICt1bml0cz1tICtub19kZWZzXCIpO1xuXG4gIGlmICghdGhpcy5sYXQyKSB7XG4gICAgdGhpcy5sYXQyID0gdGhpcy5sYXQxO1xuICB9IC8vaWYgbGF0MiBpcyBub3QgZGVmaW5lZFxuICBpZiAoIXRoaXMuazApIHtcbiAgICB0aGlzLmswID0gMTtcbiAgfVxuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICAvLyBTdGFuZGFyZCBQYXJhbGxlbHMgY2Fubm90IGJlIGVxdWFsIGFuZCBvbiBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgZXF1YXRvclxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxICsgdGhpcy5sYXQyKSA8IEVQU0xOKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRlbXAgPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZSA9IE1hdGguc3FydCgxIC0gdGVtcCAqIHRlbXApO1xuXG4gIHZhciBzaW4xID0gTWF0aC5zaW4odGhpcy5sYXQxKTtcbiAgdmFyIGNvczEgPSBNYXRoLmNvcyh0aGlzLmxhdDEpO1xuICB2YXIgbXMxID0gbXNmbnoodGhpcy5lLCBzaW4xLCBjb3MxKTtcbiAgdmFyIHRzMSA9IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQxLCBzaW4xKTtcblxuICB2YXIgc2luMiA9IE1hdGguc2luKHRoaXMubGF0Mik7XG4gIHZhciBjb3MyID0gTWF0aC5jb3ModGhpcy5sYXQyKTtcbiAgdmFyIG1zMiA9IG1zZm56KHRoaXMuZSwgc2luMiwgY29zMik7XG4gIHZhciB0czIgPSB0c2Zueih0aGlzLmUsIHRoaXMubGF0Miwgc2luMik7XG5cbiAgdmFyIHRzMCA9IHRzZm56KHRoaXMuZSwgdGhpcy5sYXQwLCBNYXRoLnNpbih0aGlzLmxhdDApKTtcblxuICBpZiAoTWF0aC5hYnModGhpcy5sYXQxIC0gdGhpcy5sYXQyKSA+IEVQU0xOKSB7XG4gICAgdGhpcy5ucyA9IE1hdGgubG9nKG1zMSAvIG1zMikgLyBNYXRoLmxvZyh0czEgLyB0czIpO1xuICB9XG4gIGVsc2Uge1xuICAgIHRoaXMubnMgPSBzaW4xO1xuICB9XG4gIGlmIChpc05hTih0aGlzLm5zKSkge1xuICAgIHRoaXMubnMgPSBzaW4xO1xuICB9XG4gIHRoaXMuZjAgPSBtczEgLyAodGhpcy5ucyAqIE1hdGgucG93KHRzMSwgdGhpcy5ucykpO1xuICB0aGlzLnJoID0gdGhpcy5hICogdGhpcy5mMCAqIE1hdGgucG93KHRzMCwgdGhpcy5ucyk7XG4gIGlmICghdGhpcy50aXRsZSkge1xuICAgIHRoaXMudGl0bGUgPSBcIkxhbWJlcnQgQ29uZm9ybWFsIENvbmljXCI7XG4gIH1cbn1cblxuLy8gTGFtYmVydCBDb25mb3JtYWwgY29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuXG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgLy8gc2luZ3VsYXIgY2FzZXMgOlxuICBpZiAoTWF0aC5hYnMoMiAqIE1hdGguYWJzKGxhdCkgLSBNYXRoLlBJKSA8PSBFUFNMTikge1xuICAgIGxhdCA9IHNpZ24obGF0KSAqIChIQUxGX1BJIC0gMiAqIEVQU0xOKTtcbiAgfVxuXG4gIHZhciBjb24gPSBNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSk7XG4gIHZhciB0cywgcmgxO1xuICBpZiAoY29uID4gRVBTTE4pIHtcbiAgICB0cyA9IHRzZm56KHRoaXMuZSwgbGF0LCBNYXRoLnNpbihsYXQpKTtcbiAgICByaDEgPSB0aGlzLmEgKiB0aGlzLmYwICogTWF0aC5wb3codHMsIHRoaXMubnMpO1xuICB9XG4gIGVsc2Uge1xuICAgIGNvbiA9IGxhdCAqIHRoaXMubnM7XG4gICAgaWYgKGNvbiA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmgxID0gMDtcbiAgfVxuICB2YXIgdGhldGEgPSB0aGlzLm5zICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcbiAgcC54ID0gdGhpcy5rMCAqIChyaDEgKiBNYXRoLnNpbih0aGV0YSkpICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5rMCAqICh0aGlzLnJoIC0gcmgxICogTWF0aC5jb3ModGhldGEpKSArIHRoaXMueTA7XG5cbiAgcmV0dXJuIHA7XG59XG5cbi8vIExhbWJlcnQgQ29uZm9ybWFsIENvbmljIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcblxuICB2YXIgcmgxLCBjb24sIHRzO1xuICB2YXIgbGF0LCBsb247XG4gIHZhciB4ID0gKHAueCAtIHRoaXMueDApIC8gdGhpcy5rMDtcbiAgdmFyIHkgPSAodGhpcy5yaCAtIChwLnkgLSB0aGlzLnkwKSAvIHRoaXMuazApO1xuICBpZiAodGhpcy5ucyA+IDApIHtcbiAgICByaDEgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgY29uID0gMTtcbiAgfVxuICBlbHNlIHtcbiAgICByaDEgPSAtTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgIGNvbiA9IC0xO1xuICB9XG4gIHZhciB0aGV0YSA9IDA7XG4gIGlmIChyaDEgIT09IDApIHtcbiAgICB0aGV0YSA9IE1hdGguYXRhbjIoKGNvbiAqIHgpLCAoY29uICogeSkpO1xuICB9XG4gIGlmICgocmgxICE9PSAwKSB8fCAodGhpcy5ucyA+IDApKSB7XG4gICAgY29uID0gMSAvIHRoaXMubnM7XG4gICAgdHMgPSBNYXRoLnBvdygocmgxIC8gKHRoaXMuYSAqIHRoaXMuZjApKSwgY29uKTtcbiAgICBsYXQgPSBwaGkyeih0aGlzLmUsIHRzKTtcbiAgICBpZiAobGF0ID09PSAtOTk5OSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGxhdCA9IC1IQUxGX1BJO1xuICB9XG4gIGxvbiA9IGFkanVzdF9sb24odGhldGEgLyB0aGlzLm5zICsgdGhpcy5sb25nMCk7XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1xuICBcIkxhbWJlcnQgVGFuZ2VudGlhbCBDb25mb3JtYWwgQ29uaWMgUHJvamVjdGlvblwiLFxuICBcIkxhbWJlcnRfQ29uZm9ybWFsX0NvbmljXCIsXG4gIFwiTGFtYmVydF9Db25mb3JtYWxfQ29uaWNfMVNQXCIsXG4gIFwiTGFtYmVydF9Db25mb3JtYWxfQ29uaWNfMlNQXCIsXG4gIFwibGNjXCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vbm8tb3AgZm9yIGxvbmdsYXRcbn1cblxuZnVuY3Rpb24gaWRlbnRpdHkocHQpIHtcbiAgcmV0dXJuIHB0O1xufVxuZXhwb3J0IHtpZGVudGl0eSBhcyBmb3J3YXJkfTtcbmV4cG9ydCB7aWRlbnRpdHkgYXMgaW52ZXJzZX07XG5leHBvcnQgdmFyIG5hbWVzID0gW1wibG9uZ2xhdFwiLCBcImlkZW50aXR5XCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBpZGVudGl0eSxcbiAgaW52ZXJzZTogaWRlbnRpdHksXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuXG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgdHNmbnogZnJvbSAnLi4vY29tbW9uL3RzZm56JztcbmltcG9ydCBwaGkyeiBmcm9tICcuLi9jb21tb24vcGhpMnonO1xuaW1wb3J0IHtGT1JUUEksIFIyRCwgRVBTTE4sIEhBTEZfUEl9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gIHZhciBjb24gPSB0aGlzLmIgLyB0aGlzLmE7XG4gIHRoaXMuZXMgPSAxIC0gY29uICogY29uO1xuICBpZighKCd4MCcgaW4gdGhpcykpe1xuICAgIHRoaXMueDAgPSAwO1xuICB9XG4gIGlmKCEoJ3kwJyBpbiB0aGlzKSl7XG4gICAgdGhpcy55MCA9IDA7XG4gIH1cbiAgdGhpcy5lID0gTWF0aC5zcXJ0KHRoaXMuZXMpO1xuICBpZiAodGhpcy5sYXRfdHMpIHtcbiAgICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICAgIHRoaXMuazAgPSBNYXRoLmNvcyh0aGlzLmxhdF90cyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5rMCA9IG1zZm56KHRoaXMuZSwgTWF0aC5zaW4odGhpcy5sYXRfdHMpLCBNYXRoLmNvcyh0aGlzLmxhdF90cykpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoIXRoaXMuazApIHtcbiAgICAgIGlmICh0aGlzLmspIHtcbiAgICAgICAgdGhpcy5rMCA9IHRoaXMuaztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmswID0gMTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyogTWVyY2F0b3IgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuICAvLyBjb252ZXJ0IHRvIHJhZGlhbnNcbiAgaWYgKGxhdCAqIFIyRCA+IDkwICYmIGxhdCAqIFIyRCA8IC05MCAmJiBsb24gKiBSMkQgPiAxODAgJiYgbG9uICogUjJEIDwgLTE4MCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHgsIHk7XG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSkgPD0gRVBTTE4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICAgIHggPSB0aGlzLngwICsgdGhpcy5hICogdGhpcy5rMCAqIGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gICAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIHRoaXMuazAgKiBNYXRoLmxvZyhNYXRoLnRhbihGT1JUUEkgKyAwLjUgKiBsYXQpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcbiAgICAgIHZhciB0cyA9IHRzZm56KHRoaXMuZSwgbGF0LCBzaW5waGkpO1xuICAgICAgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiB0aGlzLmswICogYWRqdXN0X2xvbihsb24gLSB0aGlzLmxvbmcwKTtcbiAgICAgIHkgPSB0aGlzLnkwIC0gdGhpcy5hICogdGhpcy5rMCAqIE1hdGgubG9nKHRzKTtcbiAgICB9XG4gICAgcC54ID0geDtcbiAgICBwLnkgPSB5O1xuICAgIHJldHVybiBwO1xuICB9XG59XG5cbi8qIE1lcmNhdG9yIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG5cbiAgdmFyIHggPSBwLnggLSB0aGlzLngwO1xuICB2YXIgeSA9IHAueSAtIHRoaXMueTA7XG4gIHZhciBsb24sIGxhdDtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsYXQgPSBIQUxGX1BJIC0gMiAqIE1hdGguYXRhbihNYXRoLmV4cCgteSAvICh0aGlzLmEgKiB0aGlzLmswKSkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciB0cyA9IE1hdGguZXhwKC15IC8gKHRoaXMuYSAqIHRoaXMuazApKTtcbiAgICBsYXQgPSBwaGkyeih0aGlzLmUsIHRzKTtcbiAgICBpZiAobGF0ID09PSAtOTk5OSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHggLyAodGhpcy5hICogdGhpcy5rMCkpO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIk1lcmNhdG9yXCIsIFwiUG9wdWxhciBWaXN1YWxpc2F0aW9uIFBzZXVkbyBNZXJjYXRvclwiLCBcIk1lcmNhdG9yXzFTUFwiLCBcIk1lcmNhdG9yX0F1eGlsaWFyeV9TcGhlcmVcIiwgXCJtZXJjXCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbi8qXG4gIHJlZmVyZW5jZVxuICAgIFwiTmV3IEVxdWFsLUFyZWEgTWFwIFByb2plY3Rpb25zIGZvciBOb25jaXJjdWxhciBSZWdpb25zXCIsIEpvaG4gUC4gU255ZGVyLFxuICAgIFRoZSBBbWVyaWNhbiBDYXJ0b2dyYXBoZXIsIFZvbCAxNSwgTm8uIDQsIE9jdG9iZXIgMTk4OCwgcHAuIDM0MS0zNTUuXG4gICovXG5cblxuLyogSW5pdGlhbGl6ZSB0aGUgTWlsbGVyIEN5bGluZHJpY2FsIHByb2plY3Rpb25cbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy9uby1vcFxufVxuXG4vKiBNaWxsZXIgQ3lsaW5kcmljYWwgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuICB2YXIgeCA9IHRoaXMueDAgKyB0aGlzLmEgKiBkbG9uO1xuICB2YXIgeSA9IHRoaXMueTAgKyB0aGlzLmEgKiBNYXRoLmxvZyhNYXRoLnRhbigoTWF0aC5QSSAvIDQpICsgKGxhdCAvIDIuNSkpKSAqIDEuMjU7XG5cbiAgcC54ID0geDtcbiAgcC55ID0geTtcbiAgcmV0dXJuIHA7XG59XG5cbi8qIE1pbGxlciBDeWxpbmRyaWNhbCBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG5cbiAgdmFyIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHAueCAvIHRoaXMuYSk7XG4gIHZhciBsYXQgPSAyLjUgKiAoTWF0aC5hdGFuKE1hdGguZXhwKDAuOCAqIHAueSAvIHRoaXMuYSkpIC0gTWF0aC5QSSAvIDQpO1xuXG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIk1pbGxlcl9DeWxpbmRyaWNhbFwiLCBcIm1pbGxcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge31cbmltcG9ydCB7RVBTTE59IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuLyogTW9sbHdlaWRlIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuXG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLSovXG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdmFyIGRlbHRhX2xvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gIHZhciB0aGV0YSA9IGxhdDtcbiAgdmFyIGNvbiA9IE1hdGguUEkgKiBNYXRoLnNpbihsYXQpO1xuXG4gIC8qIEl0ZXJhdGUgdXNpbmcgdGhlIE5ld3Rvbi1SYXBoc29uIG1ldGhvZCB0byBmaW5kIHRoZXRhXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIGRlbHRhX3RoZXRhID0gLSh0aGV0YSArIE1hdGguc2luKHRoZXRhKSAtIGNvbikgLyAoMSArIE1hdGguY29zKHRoZXRhKSk7XG4gICAgdGhldGEgKz0gZGVsdGFfdGhldGE7XG4gICAgaWYgKE1hdGguYWJzKGRlbHRhX3RoZXRhKSA8IEVQU0xOKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdGhldGEgLz0gMjtcblxuICAvKiBJZiB0aGUgbGF0aXR1ZGUgaXMgOTAgZGVnLCBmb3JjZSB0aGUgeCBjb29yZGluYXRlIHRvIGJlIFwiMCArIGZhbHNlIGVhc3RpbmdcIlxuICAgICAgIHRoaXMgaXMgZG9uZSBoZXJlIGJlY2F1c2Ugb2YgcHJlY2lzaW9uIHByb2JsZW1zIHdpdGggXCJjb3ModGhldGEpXCJcbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gIGlmIChNYXRoLlBJIC8gMiAtIE1hdGguYWJzKGxhdCkgPCBFUFNMTikge1xuICAgIGRlbHRhX2xvbiA9IDA7XG4gIH1cbiAgdmFyIHggPSAwLjkwMDMxNjMxNjE1OCAqIHRoaXMuYSAqIGRlbHRhX2xvbiAqIE1hdGguY29zKHRoZXRhKSArIHRoaXMueDA7XG4gIHZhciB5ID0gMS40MTQyMTM1NjIzNzMxICogdGhpcy5hICogTWF0aC5zaW4odGhldGEpICsgdGhpcy55MDtcblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgdGhldGE7XG4gIHZhciBhcmc7XG5cbiAgLyogSW52ZXJzZSBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgcC54IC09IHRoaXMueDA7XG4gIHAueSAtPSB0aGlzLnkwO1xuICBhcmcgPSBwLnkgLyAoMS40MTQyMTM1NjIzNzMxICogdGhpcy5hKTtcblxuICAvKiBCZWNhdXNlIG9mIGRpdmlzaW9uIGJ5IHplcm8gcHJvYmxlbXMsICdhcmcnIGNhbiBub3QgYmUgMS4gIFRoZXJlZm9yZVxuICAgICAgIGEgbnVtYmVyIHZlcnkgY2xvc2UgdG8gb25lIGlzIHVzZWQgaW5zdGVhZC5cbiAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgaWYgKE1hdGguYWJzKGFyZykgPiAwLjk5OTk5OTk5OTk5OSkge1xuICAgIGFyZyA9IDAuOTk5OTk5OTk5OTk5O1xuICB9XG4gIHRoZXRhID0gTWF0aC5hc2luKGFyZyk7XG4gIHZhciBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyAocC54IC8gKDAuOTAwMzE2MzE2MTU4ICogdGhpcy5hICogTWF0aC5jb3ModGhldGEpKSkpO1xuICBpZiAobG9uIDwgKC1NYXRoLlBJKSkge1xuICAgIGxvbiA9IC1NYXRoLlBJO1xuICB9XG4gIGlmIChsb24gPiBNYXRoLlBJKSB7XG4gICAgbG9uID0gTWF0aC5QSTtcbiAgfVxuICBhcmcgPSAoMiAqIHRoZXRhICsgTWF0aC5zaW4oMiAqIHRoZXRhKSkgLyBNYXRoLlBJO1xuICBpZiAoTWF0aC5hYnMoYXJnKSA+IDEpIHtcbiAgICBhcmcgPSAxO1xuICB9XG4gIHZhciBsYXQgPSBNYXRoLmFzaW4oYXJnKTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJNb2xsd2VpZGVcIiwgXCJtb2xsXCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQge1NFQ19UT19SQUR9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKlxuICByZWZlcmVuY2VcbiAgICBEZXBhcnRtZW50IG9mIExhbmQgYW5kIFN1cnZleSBUZWNobmljYWwgQ2lyY3VsYXIgMTk3My8zMlxuICAgICAgaHR0cDovL3d3dy5saW56LmdvdnQubnovZG9jcy9taXNjZWxsYW5lb3VzL256LW1hcC1kZWZpbml0aW9uLnBkZlxuICAgIE9TRyBUZWNobmljYWwgUmVwb3J0IDQuMVxuICAgICAgaHR0cDovL3d3dy5saW56LmdvdnQubnovZG9jcy9taXNjZWxsYW5lb3VzL256bWcucGRmXG4gICovXG5cbi8qKlxuICogaXRlcmF0aW9uczogTnVtYmVyIG9mIGl0ZXJhdGlvbnMgdG8gcmVmaW5lIGludmVyc2UgdHJhbnNmb3JtLlxuICogICAgIDAgLT4ga20gYWNjdXJhY3lcbiAqICAgICAxIC0+IG0gYWNjdXJhY3kgLS0gc3VpdGFibGUgZm9yIG1vc3QgbWFwcGluZyBhcHBsaWNhdGlvbnNcbiAqICAgICAyIC0+IG1tIGFjY3VyYWN5XG4gKi9cbmV4cG9ydCB2YXIgaXRlcmF0aW9ucyA9IDE7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLkEgPSBbXTtcbiAgdGhpcy5BWzFdID0gMC42Mzk5MTc1MDczO1xuICB0aGlzLkFbMl0gPSAtMC4xMzU4Nzk3NjEzO1xuICB0aGlzLkFbM10gPSAwLjA2MzI5NDQwOTtcbiAgdGhpcy5BWzRdID0gLTAuMDI1MjY4NTM7XG4gIHRoaXMuQVs1XSA9IDAuMDExNzg3OTtcbiAgdGhpcy5BWzZdID0gLTAuMDA1NTE2MTtcbiAgdGhpcy5BWzddID0gMC4wMDI2OTA2O1xuICB0aGlzLkFbOF0gPSAtMC4wMDEzMzM7XG4gIHRoaXMuQVs5XSA9IDAuMDAwNjc7XG4gIHRoaXMuQVsxMF0gPSAtMC4wMDAzNDtcblxuICB0aGlzLkJfcmUgPSBbXTtcbiAgdGhpcy5CX2ltID0gW107XG4gIHRoaXMuQl9yZVsxXSA9IDAuNzU1Nzg1MzIyODtcbiAgdGhpcy5CX2ltWzFdID0gMDtcbiAgdGhpcy5CX3JlWzJdID0gMC4yNDkyMDQ2NDY7XG4gIHRoaXMuQl9pbVsyXSA9IDAuMDAzMzcxNTA3O1xuICB0aGlzLkJfcmVbM10gPSAtMC4wMDE1NDE3Mzk7XG4gIHRoaXMuQl9pbVszXSA9IDAuMDQxMDU4NTYwO1xuICB0aGlzLkJfcmVbNF0gPSAtMC4xMDE2MjkwNztcbiAgdGhpcy5CX2ltWzRdID0gMC4wMTcyNzYwOTtcbiAgdGhpcy5CX3JlWzVdID0gLTAuMjY2MjM0ODk7XG4gIHRoaXMuQl9pbVs1XSA9IC0wLjM2MjQ5MjE4O1xuICB0aGlzLkJfcmVbNl0gPSAtMC42ODcwOTgzO1xuICB0aGlzLkJfaW1bNl0gPSAtMS4xNjUxOTY3O1xuXG4gIHRoaXMuQ19yZSA9IFtdO1xuICB0aGlzLkNfaW0gPSBbXTtcbiAgdGhpcy5DX3JlWzFdID0gMS4zMjMxMjcwNDM5O1xuICB0aGlzLkNfaW1bMV0gPSAwO1xuICB0aGlzLkNfcmVbMl0gPSAtMC41NzcyNDU3ODk7XG4gIHRoaXMuQ19pbVsyXSA9IC0wLjAwNzgwOTU5ODtcbiAgdGhpcy5DX3JlWzNdID0gMC41MDgzMDc1MTM7XG4gIHRoaXMuQ19pbVszXSA9IC0wLjExMjIwODk1MjtcbiAgdGhpcy5DX3JlWzRdID0gLTAuMTUwOTQ3NjI7XG4gIHRoaXMuQ19pbVs0XSA9IDAuMTgyMDA2MDI7XG4gIHRoaXMuQ19yZVs1XSA9IDEuMDE0MTgxNzk7XG4gIHRoaXMuQ19pbVs1XSA9IDEuNjQ0OTc2OTY7XG4gIHRoaXMuQ19yZVs2XSA9IDEuOTY2MDU0OTtcbiAgdGhpcy5DX2ltWzZdID0gMi41MTI3NjQ1O1xuXG4gIHRoaXMuRCA9IFtdO1xuICB0aGlzLkRbMV0gPSAxLjU2MjcwMTQyNDM7XG4gIHRoaXMuRFsyXSA9IDAuNTE4NTQwNjM5ODtcbiAgdGhpcy5EWzNdID0gLTAuMDMzMzMwOTg7XG4gIHRoaXMuRFs0XSA9IC0wLjEwNTI5MDY7XG4gIHRoaXMuRFs1XSA9IC0wLjAzNjg1OTQ7XG4gIHRoaXMuRFs2XSA9IDAuMDA3MzE3O1xuICB0aGlzLkRbN10gPSAwLjAxMjIwO1xuICB0aGlzLkRbOF0gPSAwLjAwMzk0O1xuICB0aGlzLkRbOV0gPSAtMC4wMDEzO1xufVxuXG4vKipcbiAgICBOZXcgWmVhbGFuZCBNYXAgR3JpZCBGb3J3YXJkICAtIGxvbmcvbGF0IHRvIHgveVxuICAgIGxvbmcvbGF0IGluIHJhZGlhbnNcbiAgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIG47XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG5cbiAgdmFyIGRlbHRhX2xhdCA9IGxhdCAtIHRoaXMubGF0MDtcbiAgdmFyIGRlbHRhX2xvbiA9IGxvbiAtIHRoaXMubG9uZzA7XG5cbiAgLy8gMS4gQ2FsY3VsYXRlIGRfcGhpIGFuZCBkX3BzaSAgICAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuZCBkX2xhbWJkYVxuICAvLyBGb3IgdGhpcyBhbGdvcml0aG0sIGRlbHRhX2xhdGl0dWRlIGlzIGluIHNlY29uZHMgb2YgYXJjIHggMTAtNSwgc28gd2UgbmVlZCB0byBzY2FsZSB0byB0aG9zZSB1bml0cy4gTG9uZ2l0dWRlIGlzIHJhZGlhbnMuXG4gIHZhciBkX3BoaSA9IGRlbHRhX2xhdCAvIFNFQ19UT19SQUQgKiAxRS01O1xuICB2YXIgZF9sYW1iZGEgPSBkZWx0YV9sb247XG4gIHZhciBkX3BoaV9uID0gMTsgLy8gZF9waGleMFxuXG4gIHZhciBkX3BzaSA9IDA7XG4gIGZvciAobiA9IDE7IG4gPD0gMTA7IG4rKykge1xuICAgIGRfcGhpX24gPSBkX3BoaV9uICogZF9waGk7XG4gICAgZF9wc2kgPSBkX3BzaSArIHRoaXMuQVtuXSAqIGRfcGhpX247XG4gIH1cblxuICAvLyAyLiBDYWxjdWxhdGUgdGhldGFcbiAgdmFyIHRoX3JlID0gZF9wc2k7XG4gIHZhciB0aF9pbSA9IGRfbGFtYmRhO1xuXG4gIC8vIDMuIENhbGN1bGF0ZSB6XG4gIHZhciB0aF9uX3JlID0gMTtcbiAgdmFyIHRoX25faW0gPSAwOyAvLyB0aGV0YV4wXG4gIHZhciB0aF9uX3JlMTtcbiAgdmFyIHRoX25faW0xO1xuXG4gIHZhciB6X3JlID0gMDtcbiAgdmFyIHpfaW0gPSAwO1xuICBmb3IgKG4gPSAxOyBuIDw9IDY7IG4rKykge1xuICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuICAgIHRoX25faW0xID0gdGhfbl9pbSAqIHRoX3JlICsgdGhfbl9yZSAqIHRoX2ltO1xuICAgIHRoX25fcmUgPSB0aF9uX3JlMTtcbiAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG4gICAgel9yZSA9IHpfcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX3JlIC0gdGhpcy5CX2ltW25dICogdGhfbl9pbTtcbiAgICB6X2ltID0gel9pbSArIHRoaXMuQl9pbVtuXSAqIHRoX25fcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX2ltO1xuICB9XG5cbiAgLy8gNC4gQ2FsY3VsYXRlIGVhc3RpbmcgYW5kIG5vcnRoaW5nXG4gIHAueCA9ICh6X2ltICogdGhpcy5hKSArIHRoaXMueDA7XG4gIHAueSA9ICh6X3JlICogdGhpcy5hKSArIHRoaXMueTA7XG5cbiAgcmV0dXJuIHA7XG59XG5cbi8qKlxuICAgIE5ldyBaZWFsYW5kIE1hcCBHcmlkIEludmVyc2UgIC0gIHgveSB0byBsb25nL2xhdFxuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbjtcbiAgdmFyIHggPSBwLng7XG4gIHZhciB5ID0gcC55O1xuXG4gIHZhciBkZWx0YV94ID0geCAtIHRoaXMueDA7XG4gIHZhciBkZWx0YV95ID0geSAtIHRoaXMueTA7XG5cbiAgLy8gMS4gQ2FsY3VsYXRlIHpcbiAgdmFyIHpfcmUgPSBkZWx0YV95IC8gdGhpcy5hO1xuICB2YXIgel9pbSA9IGRlbHRhX3ggLyB0aGlzLmE7XG5cbiAgLy8gMmEuIENhbGN1bGF0ZSB0aGV0YSAtIGZpcnN0IGFwcHJveGltYXRpb24gZ2l2ZXMga20gYWNjdXJhY3lcbiAgdmFyIHpfbl9yZSA9IDE7XG4gIHZhciB6X25faW0gPSAwOyAvLyB6XjBcbiAgdmFyIHpfbl9yZTE7XG4gIHZhciB6X25faW0xO1xuXG4gIHZhciB0aF9yZSA9IDA7XG4gIHZhciB0aF9pbSA9IDA7XG4gIGZvciAobiA9IDE7IG4gPD0gNjsgbisrKSB7XG4gICAgel9uX3JlMSA9IHpfbl9yZSAqIHpfcmUgLSB6X25faW0gKiB6X2ltO1xuICAgIHpfbl9pbTEgPSB6X25faW0gKiB6X3JlICsgel9uX3JlICogel9pbTtcbiAgICB6X25fcmUgPSB6X25fcmUxO1xuICAgIHpfbl9pbSA9IHpfbl9pbTE7XG4gICAgdGhfcmUgPSB0aF9yZSArIHRoaXMuQ19yZVtuXSAqIHpfbl9yZSAtIHRoaXMuQ19pbVtuXSAqIHpfbl9pbTtcbiAgICB0aF9pbSA9IHRoX2ltICsgdGhpcy5DX2ltW25dICogel9uX3JlICsgdGhpcy5DX3JlW25dICogel9uX2ltO1xuICB9XG5cbiAgLy8gMmIuIEl0ZXJhdGUgdG8gcmVmaW5lIHRoZSBhY2N1cmFjeSBvZiB0aGUgY2FsY3VsYXRpb25cbiAgLy8gICAgICAgIDAgaXRlcmF0aW9ucyBnaXZlcyBrbSBhY2N1cmFjeVxuICAvLyAgICAgICAgMSBpdGVyYXRpb24gZ2l2ZXMgbSBhY2N1cmFjeSAtLSBnb29kIGVub3VnaCBmb3IgbW9zdCBtYXBwaW5nIGFwcGxpY2F0aW9uc1xuICAvLyAgICAgICAgMiBpdGVyYXRpb25zIGJpdmVzIG1tIGFjY3VyYWN5XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVyYXRpb25zOyBpKyspIHtcbiAgICB2YXIgdGhfbl9yZSA9IHRoX3JlO1xuICAgIHZhciB0aF9uX2ltID0gdGhfaW07XG4gICAgdmFyIHRoX25fcmUxO1xuICAgIHZhciB0aF9uX2ltMTtcblxuICAgIHZhciBudW1fcmUgPSB6X3JlO1xuICAgIHZhciBudW1faW0gPSB6X2ltO1xuICAgIGZvciAobiA9IDI7IG4gPD0gNjsgbisrKSB7XG4gICAgICB0aF9uX3JlMSA9IHRoX25fcmUgKiB0aF9yZSAtIHRoX25faW0gKiB0aF9pbTtcbiAgICAgIHRoX25faW0xID0gdGhfbl9pbSAqIHRoX3JlICsgdGhfbl9yZSAqIHRoX2ltO1xuICAgICAgdGhfbl9yZSA9IHRoX25fcmUxO1xuICAgICAgdGhfbl9pbSA9IHRoX25faW0xO1xuICAgICAgbnVtX3JlID0gbnVtX3JlICsgKG4gLSAxKSAqICh0aGlzLkJfcmVbbl0gKiB0aF9uX3JlIC0gdGhpcy5CX2ltW25dICogdGhfbl9pbSk7XG4gICAgICBudW1faW0gPSBudW1faW0gKyAobiAtIDEpICogKHRoaXMuQl9pbVtuXSAqIHRoX25fcmUgKyB0aGlzLkJfcmVbbl0gKiB0aF9uX2ltKTtcbiAgICB9XG5cbiAgICB0aF9uX3JlID0gMTtcbiAgICB0aF9uX2ltID0gMDtcbiAgICB2YXIgZGVuX3JlID0gdGhpcy5CX3JlWzFdO1xuICAgIHZhciBkZW5faW0gPSB0aGlzLkJfaW1bMV07XG4gICAgZm9yIChuID0gMjsgbiA8PSA2OyBuKyspIHtcbiAgICAgIHRoX25fcmUxID0gdGhfbl9yZSAqIHRoX3JlIC0gdGhfbl9pbSAqIHRoX2ltO1xuICAgICAgdGhfbl9pbTEgPSB0aF9uX2ltICogdGhfcmUgKyB0aF9uX3JlICogdGhfaW07XG4gICAgICB0aF9uX3JlID0gdGhfbl9yZTE7XG4gICAgICB0aF9uX2ltID0gdGhfbl9pbTE7XG4gICAgICBkZW5fcmUgPSBkZW5fcmUgKyBuICogKHRoaXMuQl9yZVtuXSAqIHRoX25fcmUgLSB0aGlzLkJfaW1bbl0gKiB0aF9uX2ltKTtcbiAgICAgIGRlbl9pbSA9IGRlbl9pbSArIG4gKiAodGhpcy5CX2ltW25dICogdGhfbl9yZSArIHRoaXMuQl9yZVtuXSAqIHRoX25faW0pO1xuICAgIH1cblxuICAgIC8vIENvbXBsZXggZGl2aXNpb25cbiAgICB2YXIgZGVuMiA9IGRlbl9yZSAqIGRlbl9yZSArIGRlbl9pbSAqIGRlbl9pbTtcbiAgICB0aF9yZSA9IChudW1fcmUgKiBkZW5fcmUgKyBudW1faW0gKiBkZW5faW0pIC8gZGVuMjtcbiAgICB0aF9pbSA9IChudW1faW0gKiBkZW5fcmUgLSBudW1fcmUgKiBkZW5faW0pIC8gZGVuMjtcbiAgfVxuXG4gIC8vIDMuIENhbGN1bGF0ZSBkX3BoaSAgICAgICAgICAgICAgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGRfbGFtYmRhXG4gIHZhciBkX3BzaSA9IHRoX3JlO1xuICB2YXIgZF9sYW1iZGEgPSB0aF9pbTtcbiAgdmFyIGRfcHNpX24gPSAxOyAvLyBkX3BzaV4wXG5cbiAgdmFyIGRfcGhpID0gMDtcbiAgZm9yIChuID0gMTsgbiA8PSA5OyBuKyspIHtcbiAgICBkX3BzaV9uID0gZF9wc2lfbiAqIGRfcHNpO1xuICAgIGRfcGhpID0gZF9waGkgKyB0aGlzLkRbbl0gKiBkX3BzaV9uO1xuICB9XG5cbiAgLy8gNC4gQ2FsY3VsYXRlIGxhdGl0dWRlIGFuZCBsb25naXR1ZGVcbiAgLy8gZF9waGkgaXMgY2FsY3VhdGVkIGluIHNlY29uZCBvZiBhcmMgKiAxMF4tNSwgc28gd2UgbmVlZCB0byBzY2FsZSBiYWNrIHRvIHJhZGlhbnMuIGRfbGFtYmRhIGlzIGluIHJhZGlhbnMuXG4gIHZhciBsYXQgPSB0aGlzLmxhdDAgKyAoZF9waGkgKiBTRUNfVE9fUkFEICogMUU1KTtcbiAgdmFyIGxvbiA9IHRoaXMubG9uZzAgKyBkX2xhbWJkYTtcblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcblxuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIk5ld19aZWFsYW5kX01hcF9HcmlkXCIsIFwibnptZ1wiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCB7IEQyUiwgRVBTTE4sIEhBTEZfUEksIFRXT19QSSwgRk9SVFBJIH0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbnZhciBUT0wgPSAxZS03O1xuXG5mdW5jdGlvbiBpc1R5cGVBKFApIHtcbiAgdmFyIHR5cGVBUHJvamVjdGlvbnMgPSBbJ0hvdGluZV9PYmxpcXVlX01lcmNhdG9yJywnSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfQXppbXV0aF9OYXR1cmFsX09yaWdpbiddO1xuICB2YXIgcHJvamVjdGlvbk5hbWUgPSB0eXBlb2YgUC5QUk9KRUNUSU9OID09PSBcIm9iamVjdFwiID8gT2JqZWN0LmtleXMoUC5QUk9KRUNUSU9OKVswXSA6IFAuUFJPSkVDVElPTjtcbiAgXG4gIHJldHVybiAnbm9fdW9mZicgaW4gUCB8fCAnbm9fb2ZmJyBpbiBQIHx8IHR5cGVBUHJvamVjdGlvbnMuaW5kZXhPZihwcm9qZWN0aW9uTmFtZSkgIT09IC0xO1xufVxuXG5cbi8qIEluaXRpYWxpemUgdGhlIE9ibGlxdWUgTWVyY2F0b3IgIHByb2plY3Rpb25cbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7ICBcbiAgdmFyIGNvbiwgY29tLCBjb3NwaDAsIEQsIEYsIEgsIEwsIHNpbnBoMCwgcCwgSiwgZ2FtbWEgPSAwLFxuICAgIGdhbW1hMCwgbGFtYyA9IDAsIGxhbTEgPSAwLCBsYW0yID0gMCwgcGhpMSA9IDAsIHBoaTIgPSAwLCBhbHBoYV9jID0gMCwgQUI7XG4gIFxuICAvLyBvbmx5IFR5cGUgQSB1c2VzIHRoZSBub19vZmYgb3Igbm9fdW9mZiBwcm9wZXJ0eVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2lzc3Vlcy8xMDRcbiAgdGhpcy5ub19vZmYgPSBpc1R5cGVBKHRoaXMpO1xuICB0aGlzLm5vX3JvdCA9ICdub19yb3QnIGluIHRoaXM7XG4gIFxuICB2YXIgYWxwID0gZmFsc2U7XG4gIGlmIChcImFscGhhXCIgaW4gdGhpcykge1xuICAgIGFscCA9IHRydWU7XG4gIH1cblxuICB2YXIgZ2FtID0gZmFsc2U7XG4gIGlmIChcInJlY3RpZmllZF9ncmlkX2FuZ2xlXCIgaW4gdGhpcykge1xuICAgIGdhbSA9IHRydWU7XG4gIH1cblxuICBpZiAoYWxwKSB7XG4gICAgYWxwaGFfYyA9IHRoaXMuYWxwaGE7XG4gIH1cbiAgXG4gIGlmIChnYW0pIHtcbiAgICBnYW1tYSA9ICh0aGlzLnJlY3RpZmllZF9ncmlkX2FuZ2xlICogRDJSKTtcbiAgfVxuICBcbiAgaWYgKGFscCB8fCBnYW0pIHtcbiAgICBsYW1jID0gdGhpcy5sb25nYztcbiAgfSBlbHNlIHtcbiAgICBsYW0xID0gdGhpcy5sb25nMTtcbiAgICBwaGkxID0gdGhpcy5sYXQxO1xuICAgIGxhbTIgPSB0aGlzLmxvbmcyO1xuICAgIHBoaTIgPSB0aGlzLmxhdDI7XG4gICAgXG4gICAgaWYgKE1hdGguYWJzKHBoaTEgLSBwaGkyKSA8PSBUT0wgfHwgKGNvbiA9IE1hdGguYWJzKHBoaTEpKSA8PSBUT0wgfHxcbiAgICAgICAgTWF0aC5hYnMoY29uIC0gSEFMRl9QSSkgPD0gVE9MIHx8IE1hdGguYWJzKE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJKSA8PSBUT0wgfHxcbiAgICAgICAgTWF0aC5hYnMoTWF0aC5hYnMocGhpMikgLSBIQUxGX1BJKSA8PSBUT0wpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbiAgfVxuICBcbiAgdmFyIG9uZV9lcyA9IDEuMCAtIHRoaXMuZXM7XG4gIGNvbSA9IE1hdGguc3FydChvbmVfZXMpO1xuICBcbiAgaWYgKE1hdGguYWJzKHRoaXMubGF0MCkgPiBFUFNMTikge1xuICAgIHNpbnBoMCA9IE1hdGguc2luKHRoaXMubGF0MCk7XG4gICAgY29zcGgwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgICBjb24gPSAxIC0gdGhpcy5lcyAqIHNpbnBoMCAqIHNpbnBoMDtcbiAgICB0aGlzLkIgPSBjb3NwaDAgKiBjb3NwaDA7XG4gICAgdGhpcy5CID0gTWF0aC5zcXJ0KDEgKyB0aGlzLmVzICogdGhpcy5CICogdGhpcy5CIC8gb25lX2VzKTtcbiAgICB0aGlzLkEgPSB0aGlzLkIgKiB0aGlzLmswICogY29tIC8gY29uO1xuICAgIEQgPSB0aGlzLkIgKiBjb20gLyAoY29zcGgwICogTWF0aC5zcXJ0KGNvbikpO1xuICAgIEYgPSBEICogRCAtMTtcbiAgICBcbiAgICBpZiAoRiA8PSAwKSB7XG4gICAgICBGID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgRiA9IE1hdGguc3FydChGKTtcbiAgICAgIGlmICh0aGlzLmxhdDAgPCAwKSB7XG4gICAgICAgIEYgPSAtRjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5FID0gRiArPSBEO1xuICAgIHRoaXMuRSAqPSBNYXRoLnBvdyh0c2Zueih0aGlzLmUsIHRoaXMubGF0MCwgc2lucGgwKSwgdGhpcy5CKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLkIgPSAxIC8gY29tO1xuICAgIHRoaXMuQSA9IHRoaXMuazA7XG4gICAgdGhpcy5FID0gRCA9IEYgPSAxO1xuICB9XG4gIFxuICBpZiAoYWxwIHx8IGdhbSkge1xuICAgIGlmIChhbHApIHtcbiAgICAgIGdhbW1hMCA9IE1hdGguYXNpbihNYXRoLnNpbihhbHBoYV9jKSAvIEQpO1xuICAgICAgaWYgKCFnYW0pIHtcbiAgICAgICAgZ2FtbWEgPSBhbHBoYV9jO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBnYW1tYTAgPSBnYW1tYTtcbiAgICAgIGFscGhhX2MgPSBNYXRoLmFzaW4oRCAqIE1hdGguc2luKGdhbW1hMCkpO1xuICAgIH1cbiAgICB0aGlzLmxhbTAgPSBsYW1jIC0gTWF0aC5hc2luKDAuNSAqIChGIC0gMSAvIEYpICogTWF0aC50YW4oZ2FtbWEwKSkgLyB0aGlzLkI7XG4gIH0gZWxzZSB7XG4gICAgSCA9IE1hdGgucG93KHRzZm56KHRoaXMuZSwgcGhpMSwgTWF0aC5zaW4ocGhpMSkpLCB0aGlzLkIpO1xuICAgIEwgPSBNYXRoLnBvdyh0c2Zueih0aGlzLmUsIHBoaTIsIE1hdGguc2luKHBoaTIpKSwgdGhpcy5CKTtcbiAgICBGID0gdGhpcy5FIC8gSDtcbiAgICBwID0gKEwgLSBIKSAvIChMICsgSCk7XG4gICAgSiA9IHRoaXMuRSAqIHRoaXMuRTtcbiAgICBKID0gKEogLSBMICogSCkgLyAoSiArIEwgKiBIKTtcbiAgICBjb24gPSBsYW0xIC0gbGFtMjtcbiAgICBcbiAgICBpZiAoY29uIDwgLU1hdGgucGkpIHtcbiAgICAgIGxhbTIgLT1UV09fUEk7XG4gICAgfSBlbHNlIGlmIChjb24gPiBNYXRoLnBpKSB7XG4gICAgICBsYW0yICs9IFRXT19QSTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5sYW0wID0gYWRqdXN0X2xvbigwLjUgKiAobGFtMSArIGxhbTIpIC0gTWF0aC5hdGFuKEogKiBNYXRoLnRhbigwLjUgKiB0aGlzLkIgKiAobGFtMSAtIGxhbTIpKSAvIHApIC8gdGhpcy5CKTtcbiAgICBnYW1tYTAgPSBNYXRoLmF0YW4oMiAqIE1hdGguc2luKHRoaXMuQiAqIGFkanVzdF9sb24obGFtMSAtIHRoaXMubGFtMCkpIC8gKEYgLSAxIC8gRikpO1xuICAgIGdhbW1hID0gYWxwaGFfYyA9IE1hdGguYXNpbihEICogTWF0aC5zaW4oZ2FtbWEwKSk7XG4gIH1cbiAgXG4gIHRoaXMuc2luZ2FtID0gTWF0aC5zaW4oZ2FtbWEwKTtcbiAgdGhpcy5jb3NnYW0gPSBNYXRoLmNvcyhnYW1tYTApO1xuICB0aGlzLnNpbnJvdCA9IE1hdGguc2luKGdhbW1hKTtcbiAgdGhpcy5jb3Nyb3QgPSBNYXRoLmNvcyhnYW1tYSk7XG4gIFxuICB0aGlzLnJCID0gMSAvIHRoaXMuQjtcbiAgdGhpcy5BckIgPSB0aGlzLkEgKiB0aGlzLnJCO1xuICB0aGlzLkJyQSA9IDEgLyB0aGlzLkFyQjtcbiAgQUIgPSB0aGlzLkEgKiB0aGlzLkI7XG4gIFxuICBpZiAodGhpcy5ub19vZmYpIHtcbiAgICB0aGlzLnVfMCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy51XzAgPSBNYXRoLmFicyh0aGlzLkFyQiAqIE1hdGguYXRhbihNYXRoLnNxcnQoRCAqIEQgLSAxKSAvIE1hdGguY29zKGFscGhhX2MpKSk7XG4gICAgXG4gICAgaWYgKHRoaXMubGF0MCA8IDApIHtcbiAgICAgIHRoaXMudV8wID0gLSB0aGlzLnVfMDtcbiAgICB9ICBcbiAgfVxuICAgIFxuICBGID0gMC41ICogZ2FtbWEwO1xuICB0aGlzLnZfcG9sZV9uID0gdGhpcy5BckIgKiBNYXRoLmxvZyhNYXRoLnRhbihGT1JUUEkgLSBGKSk7XG4gIHRoaXMudl9wb2xlX3MgPSB0aGlzLkFyQiAqIE1hdGgubG9nKE1hdGgudGFuKEZPUlRQSSArIEYpKTtcbn1cblxuXG4vKiBPYmxpcXVlIE1lcmNhdG9yIGZvcndhcmQgZXF1YXRpb25zLS1tYXBwaW5nIGxhdCxsb25nIHRvIHgseVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgY29vcmRzID0ge307XG4gIHZhciBTLCBULCBVLCBWLCBXLCB0ZW1wLCB1LCB2O1xuICBwLnggPSBwLnggLSB0aGlzLmxhbTA7XG4gIFxuICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMocC55KSAtIEhBTEZfUEkpID4gRVBTTE4pIHtcbiAgICBXID0gdGhpcy5FIC8gTWF0aC5wb3codHNmbnoodGhpcy5lLCBwLnksIE1hdGguc2luKHAueSkpLCB0aGlzLkIpO1xuICAgIFxuICAgIHRlbXAgPSAxIC8gVztcbiAgICBTID0gMC41ICogKFcgLSB0ZW1wKTtcbiAgICBUID0gMC41ICogKFcgKyB0ZW1wKTtcbiAgICBWID0gTWF0aC5zaW4odGhpcy5CICogcC54KTtcbiAgICBVID0gKFMgKiB0aGlzLnNpbmdhbSAtIFYgKiB0aGlzLmNvc2dhbSkgLyBUO1xuICAgICAgICBcbiAgICBpZiAoTWF0aC5hYnMoTWF0aC5hYnMoVSkgLSAxLjApIDwgRVBTTE4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbiAgICBcbiAgICB2ID0gMC41ICogdGhpcy5BckIgKiBNYXRoLmxvZygoMSAtIFUpLygxICsgVSkpO1xuICAgIHRlbXAgPSBNYXRoLmNvcyh0aGlzLkIgKiBwLngpO1xuICAgIFxuICAgIGlmIChNYXRoLmFicyh0ZW1wKSA8IFRPTCkge1xuICAgICAgdSA9IHRoaXMuQSAqIHAueDtcbiAgICB9IGVsc2Uge1xuICAgICAgdSA9IHRoaXMuQXJCICogTWF0aC5hdGFuMigoUyAqIHRoaXMuY29zZ2FtICsgViAqIHRoaXMuc2luZ2FtKSwgdGVtcCk7XG4gICAgfSAgICBcbiAgfSBlbHNlIHtcbiAgICB2ID0gcC55ID4gMCA/IHRoaXMudl9wb2xlX24gOiB0aGlzLnZfcG9sZV9zO1xuICAgIHUgPSB0aGlzLkFyQiAqIHAueTtcbiAgfVxuICAgICBcbiAgaWYgKHRoaXMubm9fcm90KSB7XG4gICAgY29vcmRzLnggPSB1O1xuICAgIGNvb3Jkcy55ID0gdjtcbiAgfSBlbHNlIHtcbiAgICB1IC09IHRoaXMudV8wO1xuICAgIGNvb3Jkcy54ID0gdiAqIHRoaXMuY29zcm90ICsgdSAqIHRoaXMuc2lucm90O1xuICAgIGNvb3Jkcy55ID0gdSAqIHRoaXMuY29zcm90IC0gdiAqIHRoaXMuc2lucm90O1xuICB9XG4gIFxuICBjb29yZHMueCA9ICh0aGlzLmEgKiBjb29yZHMueCArIHRoaXMueDApO1xuICBjb29yZHMueSA9ICh0aGlzLmEgKiBjb29yZHMueSArIHRoaXMueTApO1xuICBcbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgdSwgdiwgUXAsIFNwLCBUcCwgVnAsIFVwO1xuICB2YXIgY29vcmRzID0ge307XG4gIFxuICBwLnggPSAocC54IC0gdGhpcy54MCkgKiAoMS4wIC8gdGhpcy5hKTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApICogKDEuMCAvIHRoaXMuYSk7XG5cbiAgaWYgKHRoaXMubm9fcm90KSB7XG4gICAgdiA9IHAueTtcbiAgICB1ID0gcC54O1xuICB9IGVsc2Uge1xuICAgIHYgPSBwLnggKiB0aGlzLmNvc3JvdCAtIHAueSAqIHRoaXMuc2lucm90O1xuICAgIHUgPSBwLnkgKiB0aGlzLmNvc3JvdCArIHAueCAqIHRoaXMuc2lucm90ICsgdGhpcy51XzA7XG4gIH1cbiAgXG4gIFFwID0gTWF0aC5leHAoLXRoaXMuQnJBICogdik7XG4gIFNwID0gMC41ICogKFFwIC0gMSAvIFFwKTtcbiAgVHAgPSAwLjUgKiAoUXAgKyAxIC8gUXApO1xuICBWcCA9IE1hdGguc2luKHRoaXMuQnJBICogdSk7XG4gIFVwID0gKFZwICogdGhpcy5jb3NnYW0gKyBTcCAqIHRoaXMuc2luZ2FtKSAvIFRwO1xuICBcbiAgaWYgKE1hdGguYWJzKE1hdGguYWJzKFVwKSAtIDEpIDwgRVBTTE4pIHtcbiAgICBjb29yZHMueCA9IDA7XG4gICAgY29vcmRzLnkgPSBVcCA8IDAgPyAtSEFMRl9QSSA6IEhBTEZfUEk7XG4gIH0gZWxzZSB7XG4gICAgY29vcmRzLnkgPSB0aGlzLkUgLyBNYXRoLnNxcnQoKDEgKyBVcCkgLyAoMSAtIFVwKSk7XG4gICAgY29vcmRzLnkgPSBwaGkyeih0aGlzLmUsIE1hdGgucG93KGNvb3Jkcy55LCAxIC8gdGhpcy5CKSk7XG4gICAgXG4gICAgaWYgKGNvb3Jkcy55ID09PSBJbmZpbml0eSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuICAgICAgICBcbiAgICBjb29yZHMueCA9IC10aGlzLnJCICogTWF0aC5hdGFuMigoU3AgKiB0aGlzLmNvc2dhbSAtIFZwICogdGhpcy5zaW5nYW0pLCBNYXRoLmNvcyh0aGlzLkJyQSAqIHUpKTtcbiAgfVxuICBcbiAgY29vcmRzLnggKz0gdGhpcy5sYW0wO1xuICBcbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIkhvdGluZV9PYmxpcXVlX01lcmNhdG9yXCIsIFwiSG90aW5lIE9ibGlxdWUgTWVyY2F0b3JcIiwgXCJIb3RpbmVfT2JsaXF1ZV9NZXJjYXRvcl9BemltdXRoX05hdHVyYWxfT3JpZ2luXCIsIFwiSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfVHdvX1BvaW50X05hdHVyYWxfT3JpZ2luXCIsIFwiSG90aW5lX09ibGlxdWVfTWVyY2F0b3JfQXppbXV0aF9DZW50ZXJcIiwgXCJPYmxpcXVlX01lcmNhdG9yXCIsIFwib21lcmNcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuaW1wb3J0IHtFUFNMTiwgSEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvL2RvdWJsZSB0ZW1wOyAgICAgIC8qIHRlbXBvcmFyeSB2YXJpYWJsZSAgICAqL1xuXG4gIC8qIFBsYWNlIHBhcmFtZXRlcnMgaW4gc3RhdGljIHN0b3JhZ2UgZm9yIGNvbW1vbiB1c2VcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICB0aGlzLnNpbl9wMTQgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICB0aGlzLmNvc19wMTQgPSBNYXRoLmNvcyh0aGlzLmxhdDApO1xufVxuXG4vKiBPcnRob2dyYXBoaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHNpbnBoaSwgY29zcGhpOyAvKiBzaW4gYW5kIGNvcyB2YWx1ZSAgICAgICAgKi9cbiAgdmFyIGRsb247IC8qIGRlbHRhIGxvbmdpdHVkZSB2YWx1ZSAgICAgICovXG4gIHZhciBjb3Nsb247IC8qIGNvcyBvZiBsb25naXR1ZGUgICAgICAgICovXG4gIHZhciBrc3A7IC8qIHNjYWxlIGZhY3RvciAgICAgICAgICAqL1xuICB2YXIgZywgeCwgeTtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgLyogRm9yd2FyZCBlcXVhdGlvbnNcbiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG5cbiAgc2lucGhpID0gTWF0aC5zaW4obGF0KTtcbiAgY29zcGhpID0gTWF0aC5jb3MobGF0KTtcblxuICBjb3Nsb24gPSBNYXRoLmNvcyhkbG9uKTtcbiAgZyA9IHRoaXMuc2luX3AxNCAqIHNpbnBoaSArIHRoaXMuY29zX3AxNCAqIGNvc3BoaSAqIGNvc2xvbjtcbiAga3NwID0gMTtcbiAgaWYgKChnID4gMCkgfHwgKE1hdGguYWJzKGcpIDw9IEVQU0xOKSkge1xuICAgIHggPSB0aGlzLmEgKiBrc3AgKiBjb3NwaGkgKiBNYXRoLnNpbihkbG9uKTtcbiAgICB5ID0gdGhpcy55MCArIHRoaXMuYSAqIGtzcCAqICh0aGlzLmNvc19wMTQgKiBzaW5waGkgLSB0aGlzLnNpbl9wMTQgKiBjb3NwaGkgKiBjb3Nsb24pO1xuICB9XG4gIHAueCA9IHg7XG4gIHAueSA9IHk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciByaDsgLyogaGVpZ2h0IGFib3ZlIGVsbGlwc29pZCAgICAgICovXG4gIHZhciB6OyAvKiBhbmdsZSAgICAgICAgICAqL1xuICB2YXIgc2lueiwgY29zejsgLyogc2luIG9mIHogYW5kIGNvcyBvZiB6ICAgICAgKi9cbiAgdmFyIGNvbjtcbiAgdmFyIGxvbiwgbGF0O1xuICAvKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAgICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gIHogPSBhc2lueihyaCAvIHRoaXMuYSk7XG5cbiAgc2lueiA9IE1hdGguc2luKHopO1xuICBjb3N6ID0gTWF0aC5jb3Moeik7XG5cbiAgbG9uID0gdGhpcy5sb25nMDtcbiAgaWYgKE1hdGguYWJzKHJoKSA8PSBFUFNMTikge1xuICAgIGxhdCA9IHRoaXMubGF0MDtcbiAgICBwLnggPSBsb247XG4gICAgcC55ID0gbGF0O1xuICAgIHJldHVybiBwO1xuICB9XG4gIGxhdCA9IGFzaW56KGNvc3ogKiB0aGlzLnNpbl9wMTQgKyAocC55ICogc2lueiAqIHRoaXMuY29zX3AxNCkgLyByaCk7XG4gIGNvbiA9IE1hdGguYWJzKHRoaXMubGF0MCkgLSBIQUxGX1BJO1xuICBpZiAoTWF0aC5hYnMoY29uKSA8PSBFUFNMTikge1xuICAgIGlmICh0aGlzLmxhdDAgPj0gMCkge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLngsIC0gcC55KSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwIC0gTWF0aC5hdGFuMigtcC54LCBwLnkpKTtcbiAgICB9XG4gICAgcC54ID0gbG9uO1xuICAgIHAueSA9IGxhdDtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKChwLnggKiBzaW56KSwgcmggKiB0aGlzLmNvc19wMTQgKiBjb3N6IC0gcC55ICogdGhpcy5zaW5fcDE0ICogc2lueikpO1xuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJvcnRob1wiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IGUwZm4gZnJvbSAnLi4vY29tbW9uL2UwZm4nO1xuaW1wb3J0IGUxZm4gZnJvbSAnLi4vY29tbW9uL2UxZm4nO1xuaW1wb3J0IGUyZm4gZnJvbSAnLi4vY29tbW9uL2UyZm4nO1xuaW1wb3J0IGUzZm4gZnJvbSAnLi4vY29tbW9uL2UzZm4nO1xuaW1wb3J0IGFkanVzdF9sb24gZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sb24nO1xuaW1wb3J0IGFkanVzdF9sYXQgZnJvbSAnLi4vY29tbW9uL2FkanVzdF9sYXQnO1xuaW1wb3J0IG1sZm4gZnJvbSAnLi4vY29tbW9uL21sZm4nO1xuaW1wb3J0IHtFUFNMTn0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBnTiBmcm9tICcuLi9jb21tb24vZ04nO1xudmFyIE1BWF9JVEVSID0gMjA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgdGhpcy50ZW1wID0gdGhpcy5iIC8gdGhpcy5hO1xuICB0aGlzLmVzID0gMSAtIE1hdGgucG93KHRoaXMudGVtcCwgMik7IC8vIGRldmFpdCBldHJlIGRhbnMgdG1lcmMuanMgbWFpcyBuIHkgZXN0IHBhcyBkb25jIGplIGNvbW1lbnRlIHNpbm9uIHJldG91ciBkZSB2YWxldXJzIG51bGxlc1xuICB0aGlzLmUgPSBNYXRoLnNxcnQodGhpcy5lcyk7XG4gIHRoaXMuZTAgPSBlMGZuKHRoaXMuZXMpO1xuICB0aGlzLmUxID0gZTFmbih0aGlzLmVzKTtcbiAgdGhpcy5lMiA9IGUyZm4odGhpcy5lcyk7XG4gIHRoaXMuZTMgPSBlM2ZuKHRoaXMuZXMpO1xuICB0aGlzLm1sMCA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgdGhpcy5sYXQwKTsgLy9zaSBxdWUgZGVzIHplcm9zIGxlIGNhbGN1bCBuZSBzZSBmYWl0IHBhc1xufVxuXG4vKiBQb2x5Y29uaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIGxvbiA9IHAueDtcbiAgdmFyIGxhdCA9IHAueTtcbiAgdmFyIHgsIHksIGVsO1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gIGVsID0gZGxvbiAqIE1hdGguc2luKGxhdCk7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG4gICAgICB4ID0gdGhpcy5hICogZGxvbjtcbiAgICAgIHkgPSAtMSAqIHRoaXMuYSAqIHRoaXMubGF0MDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB4ID0gdGhpcy5hICogTWF0aC5zaW4oZWwpIC8gTWF0aC50YW4obGF0KTtcbiAgICAgIHkgPSB0aGlzLmEgKiAoYWRqdXN0X2xhdChsYXQgLSB0aGlzLmxhdDApICsgKDEgLSBNYXRoLmNvcyhlbCkpIC8gTWF0aC50YW4obGF0KSk7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG4gICAgICB4ID0gdGhpcy5hICogZGxvbjtcbiAgICAgIHkgPSAtMSAqIHRoaXMubWwwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBubCA9IGdOKHRoaXMuYSwgdGhpcy5lLCBNYXRoLnNpbihsYXQpKSAvIE1hdGgudGFuKGxhdCk7XG4gICAgICB4ID0gbmwgKiBNYXRoLnNpbihlbCk7XG4gICAgICB5ID0gdGhpcy5hICogbWxmbih0aGlzLmUwLCB0aGlzLmUxLCB0aGlzLmUyLCB0aGlzLmUzLCBsYXQpIC0gdGhpcy5tbDAgKyBubCAqICgxIC0gTWF0aC5jb3MoZWwpKTtcbiAgICB9XG5cbiAgfVxuICBwLnggPSB4ICsgdGhpcy54MDtcbiAgcC55ID0geSArIHRoaXMueTA7XG4gIHJldHVybiBwO1xufVxuXG4vKiBJbnZlcnNlIGVxdWF0aW9uc1xuICAtLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBsb24sIGxhdCwgeCwgeSwgaTtcbiAgdmFyIGFsLCBibDtcbiAgdmFyIHBoaSwgZHBoaTtcbiAgeCA9IHAueCAtIHRoaXMueDA7XG4gIHkgPSBwLnkgLSB0aGlzLnkwO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmIChNYXRoLmFicyh5ICsgdGhpcy5hICogdGhpcy5sYXQwKSA8PSBFUFNMTikge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih4IC8gdGhpcy5hICsgdGhpcy5sb25nMCk7XG4gICAgICBsYXQgPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGFsID0gdGhpcy5sYXQwICsgeSAvIHRoaXMuYTtcbiAgICAgIGJsID0geCAqIHggLyB0aGlzLmEgLyB0aGlzLmEgKyBhbCAqIGFsO1xuICAgICAgcGhpID0gYWw7XG4gICAgICB2YXIgdGFucGhpO1xuICAgICAgZm9yIChpID0gTUFYX0lURVI7IGk7IC0taSkge1xuICAgICAgICB0YW5waGkgPSBNYXRoLnRhbihwaGkpO1xuICAgICAgICBkcGhpID0gLTEgKiAoYWwgKiAocGhpICogdGFucGhpICsgMSkgLSBwaGkgLSAwLjUgKiAocGhpICogcGhpICsgYmwpICogdGFucGhpKSAvICgocGhpIC0gYWwpIC8gdGFucGhpIC0gMSk7XG4gICAgICAgIHBoaSArPSBkcGhpO1xuICAgICAgICBpZiAoTWF0aC5hYnMoZHBoaSkgPD0gRVBTTE4pIHtcbiAgICAgICAgICBsYXQgPSBwaGk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChNYXRoLmFzaW4oeCAqIE1hdGgudGFuKHBoaSkgLyB0aGlzLmEpKSAvIE1hdGguc2luKGxhdCkpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnMoeSArIHRoaXMubWwwKSA8PSBFUFNMTikge1xuICAgICAgbGF0ID0gMDtcbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIHggLyB0aGlzLmEpO1xuICAgIH1cbiAgICBlbHNlIHtcblxuICAgICAgYWwgPSAodGhpcy5tbDAgKyB5KSAvIHRoaXMuYTtcbiAgICAgIGJsID0geCAqIHggLyB0aGlzLmEgLyB0aGlzLmEgKyBhbCAqIGFsO1xuICAgICAgcGhpID0gYWw7XG4gICAgICB2YXIgY2wsIG1sbiwgbWxucCwgbWE7XG4gICAgICB2YXIgY29uO1xuICAgICAgZm9yIChpID0gTUFYX0lURVI7IGk7IC0taSkge1xuICAgICAgICBjb24gPSB0aGlzLmUgKiBNYXRoLnNpbihwaGkpO1xuICAgICAgICBjbCA9IE1hdGguc3FydCgxIC0gY29uICogY29uKSAqIE1hdGgudGFuKHBoaSk7XG4gICAgICAgIG1sbiA9IHRoaXMuYSAqIG1sZm4odGhpcy5lMCwgdGhpcy5lMSwgdGhpcy5lMiwgdGhpcy5lMywgcGhpKTtcbiAgICAgICAgbWxucCA9IHRoaXMuZTAgLSAyICogdGhpcy5lMSAqIE1hdGguY29zKDIgKiBwaGkpICsgNCAqIHRoaXMuZTIgKiBNYXRoLmNvcyg0ICogcGhpKSAtIDYgKiB0aGlzLmUzICogTWF0aC5jb3MoNiAqIHBoaSk7XG4gICAgICAgIG1hID0gbWxuIC8gdGhpcy5hO1xuICAgICAgICBkcGhpID0gKGFsICogKGNsICogbWEgKyAxKSAtIG1hIC0gMC41ICogY2wgKiAobWEgKiBtYSArIGJsKSkgLyAodGhpcy5lcyAqIE1hdGguc2luKDIgKiBwaGkpICogKG1hICogbWEgKyBibCAtIDIgKiBhbCAqIG1hKSAvICg0ICogY2wpICsgKGFsIC0gbWEpICogKGNsICogbWxucCAtIDIgLyBNYXRoLnNpbigyICogcGhpKSkgLSBtbG5wKTtcbiAgICAgICAgcGhpIC09IGRwaGk7XG4gICAgICAgIGlmIChNYXRoLmFicyhkcGhpKSA8PSBFUFNMTikge1xuICAgICAgICAgIGxhdCA9IHBoaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvL2xhdD1waGk0eih0aGlzLmUsdGhpcy5lMCx0aGlzLmUxLHRoaXMuZTIsdGhpcy5lMyxhbCxibCwwLDApO1xuICAgICAgY2wgPSBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBNYXRoLnBvdyhNYXRoLnNpbihsYXQpLCAyKSkgKiBNYXRoLnRhbihsYXQpO1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hc2luKHggKiBjbCAvIHRoaXMuYSkgLyBNYXRoLnNpbihsYXQpKTtcbiAgICB9XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJQb2x5Y29uaWNcIiwgXCJwb2x5XCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvLyBRU0MgcHJvamVjdGlvbiByZXdyaXR0ZW4gZnJvbSB0aGUgb3JpZ2luYWwgUFJPSjRcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9PU0dlby9wcm9qLjQvYmxvYi9tYXN0ZXIvc3JjL1BKX3FzYy5jXG5cbmltcG9ydCB7RVBTTE4sIFRXT19QSSwgU1BJLCBIQUxGX1BJLCBGT1JUUEl9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG4vKiBjb25zdGFudHMgKi9cbnZhciBGQUNFX0VOVU0gPSB7XG4gICAgRlJPTlQ6IDEsXG4gICAgUklHSFQ6IDIsXG4gICAgQkFDSzogMyxcbiAgICBMRUZUOiA0LFxuICAgIFRPUDogNSxcbiAgICBCT1RUT006IDZcbn07XG5cbnZhciBBUkVBX0VOVU0gPSB7XG4gICAgQVJFQV8wOiAxLFxuICAgIEFSRUFfMTogMixcbiAgICBBUkVBXzI6IDMsXG4gICAgQVJFQV8zOiA0XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcblxuICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICB0aGlzLnkwID0gdGhpcy55MCB8fCAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgfHwgMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgdGhpcy5sYXRfdHMgPSB0aGlzLmxhdF90cyB8fCAwO1xuICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCBcIlF1YWRyaWxhdGVyYWxpemVkIFNwaGVyaWNhbCBDdWJlXCI7XG5cbiAgLyogRGV0ZXJtaW5lIHRoZSBjdWJlIGZhY2UgZnJvbSB0aGUgY2VudGVyIG9mIHByb2plY3Rpb24uICovXG4gIGlmICh0aGlzLmxhdDAgPj0gSEFMRl9QSSAtIEZPUlRQSSAvIDIuMCkge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5UT1A7XG4gIH0gZWxzZSBpZiAodGhpcy5sYXQwIDw9IC0oSEFMRl9QSSAtIEZPUlRQSSAvIDIuMCkpIHtcbiAgICB0aGlzLmZhY2UgPSBGQUNFX0VOVU0uQk9UVE9NO1xuICB9IGVsc2UgaWYgKE1hdGguYWJzKHRoaXMubG9uZzApIDw9IEZPUlRQSSkge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5GUk9OVDtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLmxvbmcwKSA8PSBIQUxGX1BJICsgRk9SVFBJKSB7XG4gICAgdGhpcy5mYWNlID0gdGhpcy5sb25nMCA+IDAuMCA/IEZBQ0VfRU5VTS5SSUdIVCA6IEZBQ0VfRU5VTS5MRUZUO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZmFjZSA9IEZBQ0VfRU5VTS5CQUNLO1xuICB9XG5cbiAgLyogRmlsbCBpbiB1c2VmdWwgdmFsdWVzIGZvciB0aGUgZWxsaXBzb2lkIDwtPiBzcGhlcmUgc2hpZnRcbiAgICogZGVzY3JpYmVkIGluIFtMSzEyXS4gKi9cbiAgaWYgKHRoaXMuZXMgIT09IDApIHtcbiAgICB0aGlzLm9uZV9taW51c19mID0gMSAtICh0aGlzLmEgLSB0aGlzLmIpIC8gdGhpcy5hO1xuICAgIHRoaXMub25lX21pbnVzX2Zfc3F1YXJlZCA9IHRoaXMub25lX21pbnVzX2YgKiB0aGlzLm9uZV9taW51c19mO1xuICB9XG59XG5cbi8vIFFTQyBmb3J3YXJkIGVxdWF0aW9ucy0tbWFwcGluZyBsYXQsbG9uZyB0byB4LHlcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciB4eSA9IHt4OiAwLCB5OiAwfTtcbiAgdmFyIGxhdCwgbG9uO1xuICB2YXIgdGhldGEsIHBoaTtcbiAgdmFyIHQsIG11O1xuICAvKiBudTsgKi9cbiAgdmFyIGFyZWEgPSB7dmFsdWU6IDB9O1xuXG4gIC8vIG1vdmUgbG9uIGFjY29yZGluZyB0byBwcm9qZWN0aW9uJ3MgbG9uXG4gIHAueCAtPSB0aGlzLmxvbmcwO1xuXG4gIC8qIENvbnZlcnQgdGhlIGdlb2RldGljIGxhdGl0dWRlIHRvIGEgZ2VvY2VudHJpYyBsYXRpdHVkZS5cbiAgICogVGhpcyBjb3JyZXNwb25kcyB0byB0aGUgc2hpZnQgZnJvbSB0aGUgZWxsaXBzb2lkIHRvIHRoZSBzcGhlcmVcbiAgICogZGVzY3JpYmVkIGluIFtMSzEyXS4gKi9cbiAgaWYgKHRoaXMuZXMgIT09IDApIHsvL2lmIChQLT5lcyAhPSAwKSB7XG4gICAgbGF0ID0gTWF0aC5hdGFuKHRoaXMub25lX21pbnVzX2Zfc3F1YXJlZCAqIE1hdGgudGFuKHAueSkpO1xuICB9IGVsc2Uge1xuICAgIGxhdCA9IHAueTtcbiAgfVxuXG4gIC8qIENvbnZlcnQgdGhlIGlucHV0IGxhdCwgbG9uIGludG8gdGhldGEsIHBoaSBhcyB1c2VkIGJ5IFFTQy5cbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSBjdWJlIGZhY2UgYW5kIHRoZSBhcmVhIG9uIGl0LlxuICAgKiBGb3IgdGhlIHRvcCBhbmQgYm90dG9tIGZhY2UsIHdlIGNhbiBjb21wdXRlIHRoZXRhIGFuZCBwaGlcbiAgICogZGlyZWN0bHkgZnJvbSBwaGksIGxhbS4gRm9yIHRoZSBvdGhlciBmYWNlcywgd2UgbXVzdCB1c2VcbiAgICogdW5pdCBzcGhlcmUgY2FydGVzaWFuIGNvb3JkaW5hdGVzIGFzIGFuIGludGVybWVkaWF0ZSBzdGVwLiAqL1xuICBsb24gPSBwLng7IC8vbG9uID0gbHAubGFtO1xuICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uVE9QKSB7XG4gICAgcGhpID0gSEFMRl9QSSAtIGxhdDtcbiAgICBpZiAobG9uID49IEZPUlRQSSAmJiBsb24gPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgICB0aGV0YSA9IGxvbiAtIEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmIChsb24gPiBIQUxGX1BJICsgRk9SVFBJIHx8IGxvbiA8PSAtKEhBTEZfUEkgKyBGT1JUUEkpKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICAgIHRoZXRhID0gKGxvbiA+IDAuMCA/IGxvbiAtIFNQSSA6IGxvbiArIFNQSSk7XG4gICAgfSBlbHNlIGlmIChsb24gPiAtKEhBTEZfUEkgKyBGT1JUUEkpICYmIGxvbiA8PSAtRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMjtcbiAgICAgIHRoZXRhID0gbG9uICsgSEFMRl9QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgICB0aGV0YSA9IGxvbjtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQk9UVE9NKSB7XG4gICAgcGhpID0gSEFMRl9QSSArIGxhdDtcbiAgICBpZiAobG9uID49IEZPUlRQSSAmJiBsb24gPD0gSEFMRl9QSSArIEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgICB0aGV0YSA9IC1sb24gKyBIQUxGX1BJO1xuICAgIH0gZWxzZSBpZiAobG9uIDwgRk9SVFBJICYmIGxvbiA+PSAtRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICAgIHRoZXRhID0gLWxvbjtcbiAgICB9IGVsc2UgaWYgKGxvbiA8IC1GT1JUUEkgJiYgbG9uID49IC0oSEFMRl9QSSArIEZPUlRQSSkpIHtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuICAgICAgdGhldGEgPSAtbG9uIC0gSEFMRl9QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgICB0aGV0YSA9IChsb24gPiAwLjAgPyAtbG9uICsgU1BJIDogLWxvbiAtIFNQSSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBxLCByLCBzO1xuICAgIHZhciBzaW5sYXQsIGNvc2xhdDtcbiAgICB2YXIgc2lubG9uLCBjb3Nsb247XG5cbiAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIGxvbiA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgK0hBTEZfUEkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgbG9uID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obG9uLCArU1BJKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcbiAgICAgIGxvbiA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgLUhBTEZfUEkpO1xuICAgIH1cbiAgICBzaW5sYXQgPSBNYXRoLnNpbihsYXQpO1xuICAgIGNvc2xhdCA9IE1hdGguY29zKGxhdCk7XG4gICAgc2lubG9uID0gTWF0aC5zaW4obG9uKTtcbiAgICBjb3Nsb24gPSBNYXRoLmNvcyhsb24pO1xuICAgIHEgPSBjb3NsYXQgKiBjb3Nsb247XG4gICAgciA9IGNvc2xhdCAqIHNpbmxvbjtcbiAgICBzID0gc2lubGF0O1xuXG4gICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkZST05UKSB7XG4gICAgICBwaGkgPSBNYXRoLmFjb3MocSk7XG4gICAgICB0aGV0YSA9IHFzY19md2RfZXF1YXRfZmFjZV90aGV0YShwaGksIHMsIHIsIGFyZWEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIHBoaSA9IE1hdGguYWNvcyhyKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgLXEsIGFyZWEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgcGhpID0gTWF0aC5hY29zKC1xKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgLXIsIGFyZWEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuICAgICAgcGhpID0gTWF0aC5hY29zKC1yKTtcbiAgICAgIHRoZXRhID0gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgcywgcSwgYXJlYSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qIEltcG9zc2libGUgKi9cbiAgICAgIHBoaSA9IHRoZXRhID0gMDtcbiAgICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgIH1cbiAgfVxuXG4gIC8qIENvbXB1dGUgbXUgYW5kIG51IGZvciB0aGUgYXJlYSBvZiBkZWZpbml0aW9uLlxuICAgKiBGb3IgbXUsIHNlZSBFcS4gKDMtMjEpIGluIFtPTDc2XSwgYnV0IG5vdGUgdGhlIHR5cG9zOlxuICAgKiBjb21wYXJlIHdpdGggRXEuICgzLTE0KS4gRm9yIG51LCBzZWUgRXEuICgzLTM4KS4gKi9cbiAgbXUgPSBNYXRoLmF0YW4oKDEyIC8gU1BJKSAqICh0aGV0YSArIE1hdGguYWNvcyhNYXRoLnNpbih0aGV0YSkgKiBNYXRoLmNvcyhGT1JUUEkpKSAtIEhBTEZfUEkpKTtcbiAgdCA9IE1hdGguc3FydCgoMSAtIE1hdGguY29zKHBoaSkpIC8gKE1hdGguY29zKG11KSAqIE1hdGguY29zKG11KSkgLyAoMSAtIE1hdGguY29zKE1hdGguYXRhbigxIC8gTWF0aC5jb3ModGhldGEpKSkpKTtcblxuICAvKiBBcHBseSB0aGUgcmVzdWx0IHRvIHRoZSByZWFsIGFyZWEuICovXG4gIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG4gICAgbXUgKz0gSEFMRl9QSTtcbiAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgbXUgKz0gU1BJO1xuICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzMpIHtcbiAgICBtdSArPSAxLjUgKiBTUEk7XG4gIH1cblxuICAvKiBOb3cgY29tcHV0ZSB4LCB5IGZyb20gbXUgYW5kIG51ICovXG4gIHh5LnggPSB0ICogTWF0aC5jb3MobXUpO1xuICB4eS55ID0gdCAqIE1hdGguc2luKG11KTtcbiAgeHkueCA9IHh5LnggKiB0aGlzLmEgKyB0aGlzLngwO1xuICB4eS55ID0geHkueSAqIHRoaXMuYSArIHRoaXMueTA7XG5cbiAgcC54ID0geHkueDtcbiAgcC55ID0geHkueTtcbiAgcmV0dXJuIHA7XG59XG5cbi8vIFFTQyBpbnZlcnNlIGVxdWF0aW9ucy0tbWFwcGluZyB4LHkgdG8gbGF0L2xvbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHZhciBscCA9IHtsYW06IDAsIHBoaTogMH07XG4gIHZhciBtdSwgbnUsIGNvc211LCB0YW5udTtcbiAgdmFyIHRhbnRoZXRhLCB0aGV0YSwgY29zcGhpLCBwaGk7XG4gIHZhciB0O1xuICB2YXIgYXJlYSA9IHt2YWx1ZTogMH07XG5cbiAgLyogZGUtb2Zmc2V0ICovXG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIC8qIENvbnZlcnQgdGhlIGlucHV0IHgsIHkgdG8gdGhlIG11IGFuZCBudSBhbmdsZXMgYXMgdXNlZCBieSBRU0MuXG4gICAqIFRoaXMgZGVwZW5kcyBvbiB0aGUgYXJlYSBvZiB0aGUgY3ViZSBmYWNlLiAqL1xuICBudSA9IE1hdGguYXRhbihNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KSk7XG4gIG11ID0gTWF0aC5hdGFuMihwLnksIHAueCk7XG4gIGlmIChwLnggPj0gMC4wICYmIHAueCA+PSBNYXRoLmFicyhwLnkpKSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gIH0gZWxzZSBpZiAocC55ID49IDAuMCAmJiBwLnkgPj0gTWF0aC5hYnMocC54KSkge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8xO1xuICAgIG11IC09IEhBTEZfUEk7XG4gIH0gZWxzZSBpZiAocC54IDwgMC4wICYmIC1wLnggPj0gTWF0aC5hYnMocC55KSkge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8yO1xuICAgIG11ID0gKG11IDwgMC4wID8gbXUgKyBTUEkgOiBtdSAtIFNQSSk7XG4gIH0gZWxzZSB7XG4gICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgbXUgKz0gSEFMRl9QSTtcbiAgfVxuXG4gIC8qIENvbXB1dGUgcGhpIGFuZCB0aGV0YSBmb3IgdGhlIGFyZWEgb2YgZGVmaW5pdGlvbi5cbiAgICogVGhlIGludmVyc2UgcHJvamVjdGlvbiBpcyBub3QgZGVzY3JpYmVkIGluIHRoZSBvcmlnaW5hbCBwYXBlciwgYnV0IHNvbWVcbiAgICogZ29vZCBoaW50cyBjYW4gYmUgZm91bmQgaGVyZSAoYXMgb2YgMjAxMS0xMi0xNCk6XG4gICAqIGh0dHA6Ly9maXRzLmdzZmMubmFzYS5nb3YvZml0c2JpdHMvc2FmLjkzL3NhZi45MzAyXG4gICAqIChzZWFyY2ggZm9yIFwiTWVzc2FnZS1JZDogPDkzMDIxODE3NTkuQUEyNTQ3NyBhdCBmaXRzLmN2Lm5yYW8uZWR1PlwiKSAqL1xuICB0ID0gKFNQSSAvIDEyKSAqIE1hdGgudGFuKG11KTtcbiAgdGFudGhldGEgPSBNYXRoLnNpbih0KSAvIChNYXRoLmNvcyh0KSAtICgxIC8gTWF0aC5zcXJ0KDIpKSk7XG4gIHRoZXRhID0gTWF0aC5hdGFuKHRhbnRoZXRhKTtcbiAgY29zbXUgPSBNYXRoLmNvcyhtdSk7XG4gIHRhbm51ID0gTWF0aC50YW4obnUpO1xuICBjb3NwaGkgPSAxIC0gY29zbXUgKiBjb3NtdSAqIHRhbm51ICogdGFubnUgKiAoMSAtIE1hdGguY29zKE1hdGguYXRhbigxIC8gTWF0aC5jb3ModGhldGEpKSkpO1xuICBpZiAoY29zcGhpIDwgLTEpIHtcbiAgICBjb3NwaGkgPSAtMTtcbiAgfSBlbHNlIGlmIChjb3NwaGkgPiArMSkge1xuICAgIGNvc3BoaSA9ICsxO1xuICB9XG5cbiAgLyogQXBwbHkgdGhlIHJlc3VsdCB0byB0aGUgcmVhbCBhcmVhIG9uIHRoZSBjdWJlIGZhY2UuXG4gICAqIEZvciB0aGUgdG9wIGFuZCBib3R0b20gZmFjZSwgd2UgY2FuIGNvbXB1dGUgcGhpIGFuZCBsYW0gZGlyZWN0bHkuXG4gICAqIEZvciB0aGUgb3RoZXIgZmFjZXMsIHdlIG11c3QgdXNlIHVuaXQgc3BoZXJlIGNhcnRlc2lhbiBjb29yZGluYXRlc1xuICAgKiBhcyBhbiBpbnRlcm1lZGlhdGUgc3RlcC4gKi9cbiAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlRPUCkge1xuICAgIHBoaSA9IE1hdGguYWNvcyhjb3NwaGkpO1xuICAgIGxwLnBoaSA9IEhBTEZfUEkgLSBwaGk7XG4gICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzApIHtcbiAgICAgIGxwLmxhbSA9IHRoZXRhICsgSEFMRl9QSTtcbiAgICB9IGVsc2UgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcbiAgICAgIGxwLmxhbSA9ICh0aGV0YSA8IDAuMCA/IHRoZXRhICsgU1BJIDogdGhldGEgLSBTUEkpO1xuICAgIH0gZWxzZSBpZiAoYXJlYS52YWx1ZSA9PT0gQVJFQV9FTlVNLkFSRUFfMikge1xuICAgICAgbHAubGFtID0gdGhldGEgLSBIQUxGX1BJO1xuICAgIH0gZWxzZSAvKiBhcmVhLnZhbHVlID09IEFSRUFfRU5VTS5BUkVBXzMgKi8ge1xuICAgICAgbHAubGFtID0gdGhldGE7XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkJPVFRPTSkge1xuICAgIHBoaSA9IE1hdGguYWNvcyhjb3NwaGkpO1xuICAgIGxwLnBoaSA9IHBoaSAtIEhBTEZfUEk7XG4gICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzApIHtcbiAgICAgIGxwLmxhbSA9IC10aGV0YSArIEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8xKSB7XG4gICAgICBscC5sYW0gPSAtdGhldGE7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgICBscC5sYW0gPSAtdGhldGEgLSBIQUxGX1BJO1xuICAgIH0gZWxzZSAvKiBhcmVhLnZhbHVlID09IEFSRUFfRU5VTS5BUkVBXzMgKi8ge1xuICAgICAgbHAubGFtID0gKHRoZXRhIDwgMC4wID8gLXRoZXRhIC0gU1BJIDogLXRoZXRhICsgU1BJKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLyogQ29tcHV0ZSBwaGkgYW5kIGxhbSB2aWEgY2FydGVzaWFuIHVuaXQgc3BoZXJlIGNvb3JkaW5hdGVzLiAqL1xuICAgIHZhciBxLCByLCBzO1xuICAgIHEgPSBjb3NwaGk7XG4gICAgdCA9IHEgKiBxO1xuICAgIGlmICh0ID49IDEpIHtcbiAgICAgIHMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBzID0gTWF0aC5zcXJ0KDEgLSB0KSAqIE1hdGguc2luKHRoZXRhKTtcbiAgICB9XG4gICAgdCArPSBzICogcztcbiAgICBpZiAodCA+PSAxKSB7XG4gICAgICByID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgciA9IE1hdGguc3FydCgxIC0gdCk7XG4gICAgfVxuICAgIC8qIFJvdGF0ZSBxLHIscyBpbnRvIHRoZSBjb3JyZWN0IGFyZWEuICovXG4gICAgaWYgKGFyZWEudmFsdWUgPT09IEFSRUFfRU5VTS5BUkVBXzEpIHtcbiAgICAgIHQgPSByO1xuICAgICAgciA9IC1zO1xuICAgICAgcyA9IHQ7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8yKSB7XG4gICAgICByID0gLXI7XG4gICAgICBzID0gLXM7XG4gICAgfSBlbHNlIGlmIChhcmVhLnZhbHVlID09PSBBUkVBX0VOVU0uQVJFQV8zKSB7XG4gICAgICB0ID0gcjtcbiAgICAgIHIgPSBzO1xuICAgICAgcyA9IC10O1xuICAgIH1cbiAgICAvKiBSb3RhdGUgcSxyLHMgaW50byB0aGUgY29ycmVjdCBjdWJlIGZhY2UuICovXG4gICAgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLlJJR0hUKSB7XG4gICAgICB0ID0gcTtcbiAgICAgIHEgPSAtcjtcbiAgICAgIHIgPSB0O1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgcSA9IC1xO1xuICAgICAgciA9IC1yO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uTEVGVCkge1xuICAgICAgdCA9IHE7XG4gICAgICBxID0gcjtcbiAgICAgIHIgPSAtdDtcbiAgICB9XG4gICAgLyogTm93IGNvbXB1dGUgcGhpIGFuZCBsYW0gZnJvbSB0aGUgdW5pdCBzcGhlcmUgY29vcmRpbmF0ZXMuICovXG4gICAgbHAucGhpID0gTWF0aC5hY29zKC1zKSAtIEhBTEZfUEk7XG4gICAgbHAubGFtID0gTWF0aC5hdGFuMihyLCBxKTtcbiAgICBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uUklHSFQpIHtcbiAgICAgIGxwLmxhbSA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxwLmxhbSwgLUhBTEZfUEkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mYWNlID09PSBGQUNFX0VOVU0uQkFDSykge1xuICAgICAgbHAubGFtID0gcXNjX3NoaWZ0X2xvbl9vcmlnaW4obHAubGFtLCAtU1BJKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmFjZSA9PT0gRkFDRV9FTlVNLkxFRlQpIHtcbiAgICAgIGxwLmxhbSA9IHFzY19zaGlmdF9sb25fb3JpZ2luKGxwLmxhbSwgK0hBTEZfUEkpO1xuICAgIH1cbiAgfVxuXG4gIC8qIEFwcGx5IHRoZSBzaGlmdCBmcm9tIHRoZSBzcGhlcmUgdG8gdGhlIGVsbGlwc29pZCBhcyBkZXNjcmliZWRcbiAgICogaW4gW0xLMTJdLiAqL1xuICBpZiAodGhpcy5lcyAhPT0gMCkge1xuICAgIHZhciBpbnZlcnRfc2lnbjtcbiAgICB2YXIgdGFucGhpLCB4YTtcbiAgICBpbnZlcnRfc2lnbiA9IChscC5waGkgPCAwID8gMSA6IDApO1xuICAgIHRhbnBoaSA9IE1hdGgudGFuKGxwLnBoaSk7XG4gICAgeGEgPSB0aGlzLmIgLyBNYXRoLnNxcnQodGFucGhpICogdGFucGhpICsgdGhpcy5vbmVfbWludXNfZl9zcXVhcmVkKTtcbiAgICBscC5waGkgPSBNYXRoLmF0YW4oTWF0aC5zcXJ0KHRoaXMuYSAqIHRoaXMuYSAtIHhhICogeGEpIC8gKHRoaXMub25lX21pbnVzX2YgKiB4YSkpO1xuICAgIGlmIChpbnZlcnRfc2lnbikge1xuICAgICAgbHAucGhpID0gLWxwLnBoaTtcbiAgICB9XG4gIH1cblxuICBscC5sYW0gKz0gdGhpcy5sb25nMDtcbiAgcC54ID0gbHAubGFtO1xuICBwLnkgPSBscC5waGk7XG4gIHJldHVybiBwO1xufVxuXG4vKiBIZWxwZXIgZnVuY3Rpb24gZm9yIGZvcndhcmQgcHJvamVjdGlvbjogY29tcHV0ZSB0aGUgdGhldGEgYW5nbGVcbiAqIGFuZCBkZXRlcm1pbmUgdGhlIGFyZWEgbnVtYmVyLiAqL1xuZnVuY3Rpb24gcXNjX2Z3ZF9lcXVhdF9mYWNlX3RoZXRhKHBoaSwgeSwgeCwgYXJlYSkge1xuICB2YXIgdGhldGE7XG4gIGlmIChwaGkgPCBFUFNMTikge1xuICAgIGFyZWEudmFsdWUgPSBBUkVBX0VOVU0uQVJFQV8wO1xuICAgIHRoZXRhID0gMC4wO1xuICB9IGVsc2Uge1xuICAgIHRoZXRhID0gTWF0aC5hdGFuMih5LCB4KTtcbiAgICBpZiAoTWF0aC5hYnModGhldGEpIDw9IEZPUlRQSSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzA7XG4gICAgfSBlbHNlIGlmICh0aGV0YSA+IEZPUlRQSSAmJiB0aGV0YSA8PSBIQUxGX1BJICsgRk9SVFBJKSB7XG4gICAgICBhcmVhLnZhbHVlID0gQVJFQV9FTlVNLkFSRUFfMTtcbiAgICAgIHRoZXRhIC09IEhBTEZfUEk7XG4gICAgfSBlbHNlIGlmICh0aGV0YSA+IEhBTEZfUEkgKyBGT1JUUEkgfHwgdGhldGEgPD0gLShIQUxGX1BJICsgRk9SVFBJKSkge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzI7XG4gICAgICB0aGV0YSA9ICh0aGV0YSA+PSAwLjAgPyB0aGV0YSAtIFNQSSA6IHRoZXRhICsgU1BJKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJlYS52YWx1ZSA9IEFSRUFfRU5VTS5BUkVBXzM7XG4gICAgICB0aGV0YSArPSBIQUxGX1BJO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhldGE7XG59XG5cbi8qIEhlbHBlciBmdW5jdGlvbjogc2hpZnQgdGhlIGxvbmdpdHVkZS4gKi9cbmZ1bmN0aW9uIHFzY19zaGlmdF9sb25fb3JpZ2luKGxvbiwgb2Zmc2V0KSB7XG4gIHZhciBzbG9uID0gbG9uICsgb2Zmc2V0O1xuICBpZiAoc2xvbiA8IC1TUEkpIHtcbiAgICBzbG9uICs9IFRXT19QSTtcbiAgfSBlbHNlIGlmIChzbG9uID4gK1NQSSkge1xuICAgIHNsb24gLT0gVFdPX1BJO1xuICB9XG4gIHJldHVybiBzbG9uO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiUXVhZHJpbGF0ZXJhbGl6ZWQgU3BoZXJpY2FsIEN1YmVcIiwgXCJRdWFkcmlsYXRlcmFsaXplZF9TcGhlcmljYWxfQ3ViZVwiLCBcInFzY1wiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuXG4iLCIvLyBSb2JpbnNvbiBwcm9qZWN0aW9uXG4vLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vT1NHZW8vcHJvai40L2Jsb2IvbWFzdGVyL3NyYy9QSl9yb2Jpbi5jXG4vLyBQb2x5bm9taWFsIGNvZWZpY2llbnRzIGZyb20gaHR0cDovL2FydGljbGUuZ21hbmUub3JnL2dtYW5lLmNvbXAuZ2lzLnByb2otNC5kZXZlbC82MDM5XG5cbmltcG9ydCB7SEFMRl9QSSwgRDJSLCBSMkQsIEVQU0xOfSBmcm9tICcuLi9jb25zdGFudHMvdmFsdWVzJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxudmFyIENPRUZTX1ggPSBbXG4gICAgWzEuMDAwMCwgMi4yMTk5ZS0xNywgLTcuMTU1MTVlLTA1LCAzLjExMDNlLTA2XSxcbiAgICBbMC45OTg2LCAtMC4wMDA0ODIyNDMsIC0yLjQ4OTdlLTA1LCAtMS4zMzA5ZS0wNl0sXG4gICAgWzAuOTk1NCwgLTAuMDAwODMxMDMsIC00LjQ4NjA1ZS0wNSwgLTkuODY3MDFlLTA3XSxcbiAgICBbMC45OTAwLCAtMC4wMDEzNTM2NCwgLTUuOTY2MWUtMDUsIDMuNjc3N2UtMDZdLFxuICAgIFswLjk4MjIsIC0wLjAwMTY3NDQyLCAtNC40OTU0N2UtMDYsIC01LjcyNDExZS0wNl0sXG4gICAgWzAuOTczMCwgLTAuMDAyMTQ4NjgsIC05LjAzNTcxZS0wNSwgMS44NzM2ZS0wOF0sXG4gICAgWzAuOTYwMCwgLTAuMDAzMDUwODUsIC05LjAwNzYxZS0wNSwgMS42NDkxN2UtMDZdLFxuICAgIFswLjk0MjcsIC0wLjAwMzgyNzkyLCAtNi41MzM4NmUtMDUsIC0yLjYxNTRlLTA2XSxcbiAgICBbMC45MjE2LCAtMC4wMDQ2Nzc0NiwgLTAuMDAwMTA0NTcsIDQuODEyNDNlLTA2XSxcbiAgICBbMC44OTYyLCAtMC4wMDUzNjIyMywgLTMuMjM4MzFlLTA1LCAtNS40MzQzMmUtMDZdLFxuICAgIFswLjg2NzksIC0wLjAwNjA5MzYzLCAtMC4wMDAxMTM4OTgsIDMuMzI0ODRlLTA2XSxcbiAgICBbMC44MzUwLCAtMC4wMDY5ODMyNSwgLTYuNDAyNTNlLTA1LCA5LjM0OTU5ZS0wN10sXG4gICAgWzAuNzk4NiwgLTAuMDA3NTUzMzgsIC01LjAwMDA5ZS0wNSwgOS4zNTMyNGUtMDddLFxuICAgIFswLjc1OTcsIC0wLjAwNzk4MzI0LCAtMy41OTcxZS0wNSwgLTIuMjc2MjZlLTA2XSxcbiAgICBbMC43MTg2LCAtMC4wMDg1MTM2NywgLTcuMDExNDllLTA1LCAtOC42MzAzZS0wNl0sXG4gICAgWzAuNjczMiwgLTAuMDA5ODYyMDksIC0wLjAwMDE5OTU2OSwgMS45MTk3NGUtMDVdLFxuICAgIFswLjYyMTMsIC0wLjAxMDQxOCwgOC44MzkyM2UtMDUsIDYuMjQwNTFlLTA2XSxcbiAgICBbMC41NzIyLCAtMC4wMDkwNjYwMSwgMC4wMDAxODIsIDYuMjQwNTFlLTA2XSxcbiAgICBbMC41MzIyLCAtMC4wMDY3Nzc5NywgMC4wMDAyNzU2MDgsIDYuMjQwNTFlLTA2XVxuXTtcblxudmFyIENPRUZTX1kgPSBbXG4gICAgWy01LjIwNDE3ZS0xOCwgMC4wMTI0LCAxLjIxNDMxZS0xOCwgLTguNDUyODRlLTExXSxcbiAgICBbMC4wNjIwLCAwLjAxMjQsIC0xLjI2NzkzZS0wOSwgNC4yMjY0MmUtMTBdLFxuICAgIFswLjEyNDAsIDAuMDEyNCwgNS4wNzE3MWUtMDksIC0xLjYwNjA0ZS0wOV0sXG4gICAgWzAuMTg2MCwgMC4wMTIzOTk5LCAtMS45MDE4OWUtMDgsIDYuMDAxNTJlLTA5XSxcbiAgICBbMC4yNDgwLCAwLjAxMjQwMDIsIDcuMTAwMzllLTA4LCAtMi4yNGUtMDhdLFxuICAgIFswLjMxMDAsIDAuMDEyMzk5MiwgLTIuNjQ5OTdlLTA3LCA4LjM1OTg2ZS0wOF0sXG4gICAgWzAuMzcyMCwgMC4wMTI0MDI5LCA5Ljg4OTgzZS0wNywgLTMuMTE5OTRlLTA3XSxcbiAgICBbMC40MzQwLCAwLjAxMjM4OTMsIC0zLjY5MDkzZS0wNiwgLTQuMzU2MjFlLTA3XSxcbiAgICBbMC40OTU4LCAwLjAxMjMxOTgsIC0xLjAyMjUyZS0wNSwgLTMuNDU1MjNlLTA3XSxcbiAgICBbMC41NTcxLCAwLjAxMjE5MTYsIC0xLjU0MDgxZS0wNSwgLTUuODIyODhlLTA3XSxcbiAgICBbMC42MTc2LCAwLjAxMTk5MzgsIC0yLjQxNDI0ZS0wNSwgLTUuMjUzMjdlLTA3XSxcbiAgICBbMC42NzY5LCAwLjAxMTcxMywgLTMuMjAyMjNlLTA1LCAtNS4xNjQwNWUtMDddLFxuICAgIFswLjczNDYsIDAuMDExMzU0MSwgLTMuOTc2ODRlLTA1LCAtNi4wOTA1MmUtMDddLFxuICAgIFswLjc5MDMsIDAuMDEwOTEwNywgLTQuODkwNDJlLTA1LCAtMS4wNDczOWUtMDZdLFxuICAgIFswLjg0MzUsIDAuMDEwMzQzMSwgLTYuNDYxNWUtMDUsIC0xLjQwMzc0ZS0wOV0sXG4gICAgWzAuODkzNiwgMC4wMDk2OTY4NiwgLTYuNDYzNmUtMDUsIC04LjU0N2UtMDZdLFxuICAgIFswLjkzOTQsIDAuMDA4NDA5NDcsIC0wLjAwMDE5Mjg0MSwgLTQuMjEwNmUtMDZdLFxuICAgIFswLjk3NjEsIDAuMDA2MTY1MjcsIC0wLjAwMDI1NiwgLTQuMjEwNmUtMDZdLFxuICAgIFsxLjAwMDAsIDAuMDAzMjg5NDcsIC0wLjAwMDMxOTE1OSwgLTQuMjEwNmUtMDZdXG5dO1xuXG52YXIgRlhDID0gMC44NDg3O1xudmFyIEZZQyA9IDEuMzUyMztcbnZhciBDMSA9IFIyRC81OyAvLyByYWQgdG8gNS1kZWdyZWUgaW50ZXJ2YWxcbnZhciBSQzEgPSAxL0MxO1xudmFyIE5PREVTID0gMTg7XG5cbnZhciBwb2x5M192YWwgPSBmdW5jdGlvbihjb2VmcywgeCkge1xuICAgIHJldHVybiBjb2Vmc1swXSArIHggKiAoY29lZnNbMV0gKyB4ICogKGNvZWZzWzJdICsgeCAqIGNvZWZzWzNdKSk7XG59O1xuXG52YXIgcG9seTNfZGVyID0gZnVuY3Rpb24oY29lZnMsIHgpIHtcbiAgICByZXR1cm4gY29lZnNbMV0gKyB4ICogKDIgKiBjb2Vmc1syXSArIHggKiAzICogY29lZnNbM10pO1xufTtcblxuZnVuY3Rpb24gbmV3dG9uX3JhcHNob24oZl9kZiwgc3RhcnQsIG1heF9lcnIsIGl0ZXJzKSB7XG4gICAgdmFyIHggPSBzdGFydDtcbiAgICBmb3IgKDsgaXRlcnM7IC0taXRlcnMpIHtcbiAgICAgICAgdmFyIHVwZCA9IGZfZGYoeCk7XG4gICAgICAgIHggLT0gdXBkO1xuICAgICAgICBpZiAoTWF0aC5hYnModXBkKSA8IG1heF9lcnIpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLngwID0gdGhpcy54MCB8fCAwO1xuICAgIHRoaXMueTAgPSB0aGlzLnkwIHx8IDA7XG4gICAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgfHwgMDtcbiAgICB0aGlzLmVzID0gMDtcbiAgICB0aGlzLnRpdGxlID0gdGhpcy50aXRsZSB8fCBcIlJvYmluc29uXCI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKGxsKSB7XG4gICAgdmFyIGxvbiA9IGFkanVzdF9sb24obGwueCAtIHRoaXMubG9uZzApO1xuXG4gICAgdmFyIGRwaGkgPSBNYXRoLmFicyhsbC55KTtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoZHBoaSAqIEMxKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgaSA9IDA7XG4gICAgfSBlbHNlIGlmIChpID49IE5PREVTKSB7XG4gICAgICAgIGkgPSBOT0RFUyAtIDE7XG4gICAgfVxuICAgIGRwaGkgPSBSMkQgKiAoZHBoaSAtIFJDMSAqIGkpO1xuICAgIHZhciB4eSA9IHtcbiAgICAgICAgeDogcG9seTNfdmFsKENPRUZTX1hbaV0sIGRwaGkpICogbG9uLFxuICAgICAgICB5OiBwb2x5M192YWwoQ09FRlNfWVtpXSwgZHBoaSlcbiAgICB9O1xuICAgIGlmIChsbC55IDwgMCkge1xuICAgICAgICB4eS55ID0gLXh5Lnk7XG4gICAgfVxuXG4gICAgeHkueCA9IHh5LnggKiB0aGlzLmEgKiBGWEMgKyB0aGlzLngwO1xuICAgIHh5LnkgPSB4eS55ICogdGhpcy5hICogRllDICsgdGhpcy55MDtcbiAgICByZXR1cm4geHk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHh5KSB7XG4gICAgdmFyIGxsID0ge1xuICAgICAgICB4OiAoeHkueCAtIHRoaXMueDApIC8gKHRoaXMuYSAqIEZYQyksXG4gICAgICAgIHk6IE1hdGguYWJzKHh5LnkgLSB0aGlzLnkwKSAvICh0aGlzLmEgKiBGWUMpXG4gICAgfTtcblxuICAgIGlmIChsbC55ID49IDEpIHsgLy8gcGF0aG9sb2dpYyBjYXNlXG4gICAgICAgIGxsLnggLz0gQ09FRlNfWFtOT0RFU11bMF07XG4gICAgICAgIGxsLnkgPSB4eS55IDwgMCA/IC1IQUxGX1BJIDogSEFMRl9QSTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmaW5kIHRhYmxlIGludGVydmFsXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihsbC55ICogTk9ERVMpO1xuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPj0gTk9ERVMpIHtcbiAgICAgICAgICAgIGkgPSBOT0RFUyAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgaWYgKENPRUZTX1lbaV1bMF0gPiBsbC55KSB7XG4gICAgICAgICAgICAgICAgLS1pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChDT0VGU19ZW2krMV1bMF0gPD0gbGwueSkge1xuICAgICAgICAgICAgICAgICsraTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gbGluZWFyIGludGVycG9sYXRpb24gaW4gNSBkZWdyZWUgaW50ZXJ2YWxcbiAgICAgICAgdmFyIGNvZWZzID0gQ09FRlNfWVtpXTtcbiAgICAgICAgdmFyIHQgPSA1ICogKGxsLnkgLSBjb2Vmc1swXSkgLyAoQ09FRlNfWVtpKzFdWzBdIC0gY29lZnNbMF0pO1xuICAgICAgICAvLyBmaW5kIHQgc28gdGhhdCBwb2x5M192YWwoY29lZnMsIHQpID0gbGwueVxuICAgICAgICB0ID0gbmV3dG9uX3JhcHNob24oZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgcmV0dXJuIChwb2x5M192YWwoY29lZnMsIHgpIC0gbGwueSkgLyBwb2x5M19kZXIoY29lZnMsIHgpO1xuICAgICAgICB9LCB0LCBFUFNMTiwgMTAwKTtcblxuICAgICAgICBsbC54IC89IHBvbHkzX3ZhbChDT0VGU19YW2ldLCB0KTtcbiAgICAgICAgbGwueSA9ICg1ICogaSArIHQpICogRDJSO1xuICAgICAgICBpZiAoeHkueSA8IDApIHtcbiAgICAgICAgICAgIGxsLnkgPSAtbGwueTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxsLnggPSBhZGp1c3RfbG9uKGxsLnggKyB0aGlzLmxvbmcwKTtcbiAgICByZXR1cm4gbGw7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJSb2JpbnNvblwiLCBcInJvYmluXCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5pbXBvcnQgYWRqdXN0X2xhdCBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xhdCc7XG5pbXBvcnQgcGpfZW5mbiBmcm9tICcuLi9jb21tb24vcGpfZW5mbic7XG52YXIgTUFYX0lURVIgPSAyMDtcbmltcG9ydCBwal9tbGZuIGZyb20gJy4uL2NvbW1vbi9wal9tbGZuJztcbmltcG9ydCBwal9pbnZfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfaW52X21sZm4nO1xuaW1wb3J0IHtFUFNMTiwgSEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBhc2lueiBmcm9tICcuLi9jb21tb24vYXNpbnonO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAvKiBQbGFjZSBwYXJhbWV0ZXJzIGluIHN0YXRpYyBzdG9yYWdlIGZvciBjb21tb24gdXNlXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblxuICBpZiAoIXRoaXMuc3BoZXJlKSB7XG4gICAgdGhpcy5lbiA9IHBqX2VuZm4odGhpcy5lcyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdGhpcy5uID0gMTtcbiAgICB0aGlzLm0gPSAwO1xuICAgIHRoaXMuZXMgPSAwO1xuICAgIHRoaXMuQ195ID0gTWF0aC5zcXJ0KCh0aGlzLm0gKyAxKSAvIHRoaXMubik7XG4gICAgdGhpcy5DX3ggPSB0aGlzLkNfeSAvICh0aGlzLm0gKyAxKTtcbiAgfVxuXG59XG5cbi8qIFNpbnVzb2lkYWwgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcbiAgdmFyIHgsIHk7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICBsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIGlmICghdGhpcy5tKSB7XG4gICAgICBsYXQgPSB0aGlzLm4gIT09IDEgPyBNYXRoLmFzaW4odGhpcy5uICogTWF0aC5zaW4obGF0KSkgOiBsYXQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGsgPSB0aGlzLm4gKiBNYXRoLnNpbihsYXQpO1xuICAgICAgZm9yICh2YXIgaSA9IE1BWF9JVEVSOyBpOyAtLWkpIHtcbiAgICAgICAgdmFyIFYgPSAodGhpcy5tICogbGF0ICsgTWF0aC5zaW4obGF0KSAtIGspIC8gKHRoaXMubSArIE1hdGguY29zKGxhdCkpO1xuICAgICAgICBsYXQgLT0gVjtcbiAgICAgICAgaWYgKE1hdGguYWJzKFYpIDwgRVBTTE4pIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB4ID0gdGhpcy5hICogdGhpcy5DX3ggKiBsb24gKiAodGhpcy5tICsgTWF0aC5jb3MobGF0KSk7XG4gICAgeSA9IHRoaXMuYSAqIHRoaXMuQ195ICogbGF0O1xuXG4gIH1cbiAgZWxzZSB7XG5cbiAgICB2YXIgcyA9IE1hdGguc2luKGxhdCk7XG4gICAgdmFyIGMgPSBNYXRoLmNvcyhsYXQpO1xuICAgIHkgPSB0aGlzLmEgKiBwal9tbGZuKGxhdCwgcywgYywgdGhpcy5lbik7XG4gICAgeCA9IHRoaXMuYSAqIGxvbiAqIGMgLyBNYXRoLnNxcnQoMSAtIHRoaXMuZXMgKiBzICogcyk7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbGF0LCB0ZW1wLCBsb24sIHM7XG5cbiAgcC54IC09IHRoaXMueDA7XG4gIGxvbiA9IHAueCAvIHRoaXMuYTtcbiAgcC55IC09IHRoaXMueTA7XG4gIGxhdCA9IHAueSAvIHRoaXMuYTtcblxuICBpZiAodGhpcy5zcGhlcmUpIHtcbiAgICBsYXQgLz0gdGhpcy5DX3k7XG4gICAgbG9uID0gbG9uIC8gKHRoaXMuQ194ICogKHRoaXMubSArIE1hdGguY29zKGxhdCkpKTtcbiAgICBpZiAodGhpcy5tKSB7XG4gICAgICBsYXQgPSBhc2lueigodGhpcy5tICogbGF0ICsgTWF0aC5zaW4obGF0KSkgLyB0aGlzLm4pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLm4gIT09IDEpIHtcbiAgICAgIGxhdCA9IGFzaW56KE1hdGguc2luKGxhdCkgLyB0aGlzLm4pO1xuICAgIH1cbiAgICBsb24gPSBhZGp1c3RfbG9uKGxvbiArIHRoaXMubG9uZzApO1xuICAgIGxhdCA9IGFkanVzdF9sYXQobGF0KTtcbiAgfVxuICBlbHNlIHtcbiAgICBsYXQgPSBwal9pbnZfbWxmbihwLnkgLyB0aGlzLmEsIHRoaXMuZXMsIHRoaXMuZW4pO1xuICAgIHMgPSBNYXRoLmFicyhsYXQpO1xuICAgIGlmIChzIDwgSEFMRl9QSSkge1xuICAgICAgcyA9IE1hdGguc2luKGxhdCk7XG4gICAgICB0ZW1wID0gdGhpcy5sb25nMCArIHAueCAqIE1hdGguc3FydCgxIC0gdGhpcy5lcyAqIHMgKiBzKSAvICh0aGlzLmEgKiBNYXRoLmNvcyhsYXQpKTtcbiAgICAgIC8vdGVtcCA9IHRoaXMubG9uZzAgKyBwLnggLyAodGhpcy5hICogTWF0aC5jb3MobGF0KSk7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKHRlbXApO1xuICAgIH1cbiAgICBlbHNlIGlmICgocyAtIEVQU0xOKSA8IEhBTEZfUEkpIHtcbiAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgfVxuICB9XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIlNpbnVzb2lkYWxcIiwgXCJzaW51XCJdO1xuZXhwb3J0IGRlZmF1bHQge1xuICBpbml0OiBpbml0LFxuICBmb3J3YXJkOiBmb3J3YXJkLFxuICBpbnZlcnNlOiBpbnZlcnNlLFxuICBuYW1lczogbmFtZXNcbn07XG4iLCIvKlxuICByZWZlcmVuY2VzOlxuICAgIEZvcm11bGVzIGV0IGNvbnN0YW50ZXMgcG91ciBsZSBDYWxjdWwgcG91ciBsYVxuICAgIHByb2plY3Rpb24gY3lsaW5kcmlxdWUgY29uZm9ybWUgw6AgYXhlIG9ibGlxdWUgZXQgcG91ciBsYSB0cmFuc2Zvcm1hdGlvbiBlbnRyZVxuICAgIGRlcyBzeXN0w6htZXMgZGUgcsOpZsOpcmVuY2UuXG4gICAgaHR0cDovL3d3dy5zd2lzc3RvcG8uYWRtaW4uY2gvaW50ZXJuZXQvc3dpc3N0b3BvL2ZyL2hvbWUvdG9waWNzL3N1cnZleS9zeXMvcmVmc3lzL3N3aXR6ZXJsYW5kLnBhcnN5c3JlbGF0ZWQxLjMxMjE2LmRvd25sb2FkTGlzdC43NzAwNC5Eb3dubG9hZEZpbGUudG1wL3N3aXNzcHJvamVjdGlvbmZyLnBkZlxuICAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdmFyIHBoeTAgPSB0aGlzLmxhdDA7XG4gIHRoaXMubGFtYmRhMCA9IHRoaXMubG9uZzA7XG4gIHZhciBzaW5QaHkwID0gTWF0aC5zaW4ocGh5MCk7XG4gIHZhciBzZW1pTWFqb3JBeGlzID0gdGhpcy5hO1xuICB2YXIgaW52RiA9IHRoaXMucmY7XG4gIHZhciBmbGF0dGVuaW5nID0gMSAvIGludkY7XG4gIHZhciBlMiA9IDIgKiBmbGF0dGVuaW5nIC0gTWF0aC5wb3coZmxhdHRlbmluZywgMik7XG4gIHZhciBlID0gdGhpcy5lID0gTWF0aC5zcXJ0KGUyKTtcbiAgdGhpcy5SID0gdGhpcy5rMCAqIHNlbWlNYWpvckF4aXMgKiBNYXRoLnNxcnQoMSAtIGUyKSAvICgxIC0gZTIgKiBNYXRoLnBvdyhzaW5QaHkwLCAyKSk7XG4gIHRoaXMuYWxwaGEgPSBNYXRoLnNxcnQoMSArIGUyIC8gKDEgLSBlMikgKiBNYXRoLnBvdyhNYXRoLmNvcyhwaHkwKSwgNCkpO1xuICB0aGlzLmIwID0gTWF0aC5hc2luKHNpblBoeTAgLyB0aGlzLmFscGhhKTtcbiAgdmFyIGsxID0gTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyB0aGlzLmIwIC8gMikpO1xuICB2YXIgazIgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIHBoeTAgLyAyKSk7XG4gIHZhciBrMyA9IE1hdGgubG9nKCgxICsgZSAqIHNpblBoeTApIC8gKDEgLSBlICogc2luUGh5MCkpO1xuICB0aGlzLksgPSBrMSAtIHRoaXMuYWxwaGEgKiBrMiArIHRoaXMuYWxwaGEgKiBlIC8gMiAqIGszO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBTYTEgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCAtIHAueSAvIDIpKTtcbiAgdmFyIFNhMiA9IHRoaXMuZSAvIDIgKiBNYXRoLmxvZygoMSArIHRoaXMuZSAqIE1hdGguc2luKHAueSkpIC8gKDEgLSB0aGlzLmUgKiBNYXRoLnNpbihwLnkpKSk7XG4gIHZhciBTID0gLXRoaXMuYWxwaGEgKiAoU2ExICsgU2EyKSArIHRoaXMuSztcblxuICAvLyBzcGhlcmljIGxhdGl0dWRlXG4gIHZhciBiID0gMiAqIChNYXRoLmF0YW4oTWF0aC5leHAoUykpIC0gTWF0aC5QSSAvIDQpO1xuXG4gIC8vIHNwaGVyaWMgbG9uZ2l0dWRlXG4gIHZhciBJID0gdGhpcy5hbHBoYSAqIChwLnggLSB0aGlzLmxhbWJkYTApO1xuXG4gIC8vIHBzb2V1ZG8gZXF1YXRvcmlhbCByb3RhdGlvblxuICB2YXIgcm90SSA9IE1hdGguYXRhbihNYXRoLnNpbihJKSAvIChNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGgudGFuKGIpICsgTWF0aC5jb3ModGhpcy5iMCkgKiBNYXRoLmNvcyhJKSkpO1xuXG4gIHZhciByb3RCID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYjApICogTWF0aC5zaW4oYikgLSBNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGguY29zKGIpICogTWF0aC5jb3MoSSkpO1xuXG4gIHAueSA9IHRoaXMuUiAvIDIgKiBNYXRoLmxvZygoMSArIE1hdGguc2luKHJvdEIpKSAvICgxIC0gTWF0aC5zaW4ocm90QikpKSArIHRoaXMueTA7XG4gIHAueCA9IHRoaXMuUiAqIHJvdEkgKyB0aGlzLngwO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgWSA9IHAueCAtIHRoaXMueDA7XG4gIHZhciBYID0gcC55IC0gdGhpcy55MDtcblxuICB2YXIgcm90SSA9IFkgLyB0aGlzLlI7XG4gIHZhciByb3RCID0gMiAqIChNYXRoLmF0YW4oTWF0aC5leHAoWCAvIHRoaXMuUikpIC0gTWF0aC5QSSAvIDQpO1xuXG4gIHZhciBiID0gTWF0aC5hc2luKE1hdGguY29zKHRoaXMuYjApICogTWF0aC5zaW4ocm90QikgKyBNYXRoLnNpbih0aGlzLmIwKSAqIE1hdGguY29zKHJvdEIpICogTWF0aC5jb3Mocm90SSkpO1xuICB2YXIgSSA9IE1hdGguYXRhbihNYXRoLnNpbihyb3RJKSAvIChNYXRoLmNvcyh0aGlzLmIwKSAqIE1hdGguY29zKHJvdEkpIC0gTWF0aC5zaW4odGhpcy5iMCkgKiBNYXRoLnRhbihyb3RCKSkpO1xuXG4gIHZhciBsYW1iZGEgPSB0aGlzLmxhbWJkYTAgKyBJIC8gdGhpcy5hbHBoYTtcblxuICB2YXIgUyA9IDA7XG4gIHZhciBwaHkgPSBiO1xuICB2YXIgcHJldlBoeSA9IC0xMDAwO1xuICB2YXIgaXRlcmF0aW9uID0gMDtcbiAgd2hpbGUgKE1hdGguYWJzKHBoeSAtIHByZXZQaHkpID4gMC4wMDAwMDAxKSB7XG4gICAgaWYgKCsraXRlcmF0aW9uID4gMjApIHtcbiAgICAgIC8vLi4ucmVwb3J0RXJyb3IoXCJvbWVyY0Z3ZEluZmluaXR5XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL1MgPSBNYXRoLmxvZyhNYXRoLnRhbihNYXRoLlBJIC8gNCArIHBoeSAvIDIpKTtcbiAgICBTID0gMSAvIHRoaXMuYWxwaGEgKiAoTWF0aC5sb2coTWF0aC50YW4oTWF0aC5QSSAvIDQgKyBiIC8gMikpIC0gdGhpcy5LKSArIHRoaXMuZSAqIE1hdGgubG9nKE1hdGgudGFuKE1hdGguUEkgLyA0ICsgTWF0aC5hc2luKHRoaXMuZSAqIE1hdGguc2luKHBoeSkpIC8gMikpO1xuICAgIHByZXZQaHkgPSBwaHk7XG4gICAgcGh5ID0gMiAqIE1hdGguYXRhbihNYXRoLmV4cChTKSkgLSBNYXRoLlBJIC8gMjtcbiAgfVxuXG4gIHAueCA9IGxhbWJkYTtcbiAgcC55ID0gcGh5O1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcInNvbWVyY1wiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzXG59O1xuIiwiaW1wb3J0IHtFUFNMTiwgSEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5cbmltcG9ydCBzaWduIGZyb20gJy4uL2NvbW1vbi9zaWduJztcbmltcG9ydCBtc2ZueiBmcm9tICcuLi9jb21tb24vbXNmbnonO1xuaW1wb3J0IHRzZm56IGZyb20gJy4uL2NvbW1vbi90c2Zueic7XG5pbXBvcnQgcGhpMnogZnJvbSAnLi4vY29tbW9uL3BoaTJ6JztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNzZm5fKHBoaXQsIHNpbnBoaSwgZWNjZW4pIHtcbiAgc2lucGhpICo9IGVjY2VuO1xuICByZXR1cm4gKE1hdGgudGFuKDAuNSAqIChIQUxGX1BJICsgcGhpdCkpICogTWF0aC5wb3coKDEgLSBzaW5waGkpIC8gKDEgKyBzaW5waGkpLCAwLjUgKiBlY2NlbikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgdGhpcy5jb3NsYXQwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgdGhpcy5zaW5sYXQwID0gTWF0aC5zaW4odGhpcy5sYXQwKTtcbiAgaWYgKHRoaXMuc3BoZXJlKSB7XG4gICAgaWYgKHRoaXMuazAgPT09IDEgJiYgIWlzTmFOKHRoaXMubGF0X3RzKSAmJiBNYXRoLmFicyh0aGlzLmNvc2xhdDApIDw9IEVQU0xOKSB7XG4gICAgICB0aGlzLmswID0gMC41ICogKDEgKyBzaWduKHRoaXMubGF0MCkgKiBNYXRoLnNpbih0aGlzLmxhdF90cykpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAoTWF0aC5hYnModGhpcy5jb3NsYXQwKSA8PSBFUFNMTikge1xuICAgICAgaWYgKHRoaXMubGF0MCA+IDApIHtcbiAgICAgICAgLy9Ob3J0aCBwb2xlXG4gICAgICAgIC8vdHJhY2UoJ3N0ZXJlOm5vcnRoIHBvbGUnKTtcbiAgICAgICAgdGhpcy5jb24gPSAxO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vU291dGggcG9sZVxuICAgICAgICAvL3RyYWNlKCdzdGVyZTpzb3V0aCBwb2xlJyk7XG4gICAgICAgIHRoaXMuY29uID0gLTE7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY29ucyA9IE1hdGguc3FydChNYXRoLnBvdygxICsgdGhpcy5lLCAxICsgdGhpcy5lKSAqIE1hdGgucG93KDEgLSB0aGlzLmUsIDEgLSB0aGlzLmUpKTtcbiAgICBpZiAodGhpcy5rMCA9PT0gMSAmJiAhaXNOYU4odGhpcy5sYXRfdHMpICYmIE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIHRoaXMuazAgPSAwLjUgKiB0aGlzLmNvbnMgKiBtc2Zueih0aGlzLmUsIE1hdGguc2luKHRoaXMubGF0X3RzKSwgTWF0aC5jb3ModGhpcy5sYXRfdHMpKSAvIHRzZm56KHRoaXMuZSwgdGhpcy5jb24gKiB0aGlzLmxhdF90cywgdGhpcy5jb24gKiBNYXRoLnNpbih0aGlzLmxhdF90cykpO1xuICAgIH1cbiAgICB0aGlzLm1zMSA9IG1zZm56KHRoaXMuZSwgdGhpcy5zaW5sYXQwLCB0aGlzLmNvc2xhdDApO1xuICAgIHRoaXMuWDAgPSAyICogTWF0aC5hdGFuKHRoaXMuc3Nmbl8odGhpcy5sYXQwLCB0aGlzLnNpbmxhdDAsIHRoaXMuZSkpIC0gSEFMRl9QSTtcbiAgICB0aGlzLmNvc1gwID0gTWF0aC5jb3ModGhpcy5YMCk7XG4gICAgdGhpcy5zaW5YMCA9IE1hdGguc2luKHRoaXMuWDApO1xuICB9XG59XG5cbi8vIFN0ZXJlb2dyYXBoaWMgZm9yd2FyZCBlcXVhdGlvbnMtLW1hcHBpbmcgbGF0LGxvbmcgdG8geCx5XG5leHBvcnQgZnVuY3Rpb24gZm9yd2FyZChwKSB7XG4gIHZhciBsb24gPSBwLng7XG4gIHZhciBsYXQgPSBwLnk7XG4gIHZhciBzaW5sYXQgPSBNYXRoLnNpbihsYXQpO1xuICB2YXIgY29zbGF0ID0gTWF0aC5jb3MobGF0KTtcbiAgdmFyIEEsIFgsIHNpblgsIGNvc1gsIHRzLCByaDtcbiAgdmFyIGRsb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuXG4gIGlmIChNYXRoLmFicyhNYXRoLmFicyhsb24gLSB0aGlzLmxvbmcwKSAtIE1hdGguUEkpIDw9IEVQU0xOICYmIE1hdGguYWJzKGxhdCArIHRoaXMubGF0MCkgPD0gRVBTTE4pIHtcbiAgICAvL2Nhc2Ugb2YgdGhlIG9yaWdpbmUgcG9pbnRcbiAgICAvL3RyYWNlKCdzdGVyZTp0aGlzIGlzIHRoZSBvcmlnaW4gcG9pbnQnKTtcbiAgICBwLnggPSBOYU47XG4gICAgcC55ID0gTmFOO1xuICAgIHJldHVybiBwO1xuICB9XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIC8vdHJhY2UoJ3N0ZXJlOnNwaGVyZSBjYXNlJyk7XG4gICAgQSA9IDIgKiB0aGlzLmswIC8gKDEgKyB0aGlzLnNpbmxhdDAgKiBzaW5sYXQgKyB0aGlzLmNvc2xhdDAgKiBjb3NsYXQgKiBNYXRoLmNvcyhkbG9uKSk7XG4gICAgcC54ID0gdGhpcy5hICogQSAqIGNvc2xhdCAqIE1hdGguc2luKGRsb24pICsgdGhpcy54MDtcbiAgICBwLnkgPSB0aGlzLmEgKiBBICogKHRoaXMuY29zbGF0MCAqIHNpbmxhdCAtIHRoaXMuc2lubGF0MCAqIGNvc2xhdCAqIE1hdGguY29zKGRsb24pKSArIHRoaXMueTA7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgZWxzZSB7XG4gICAgWCA9IDIgKiBNYXRoLmF0YW4odGhpcy5zc2ZuXyhsYXQsIHNpbmxhdCwgdGhpcy5lKSkgLSBIQUxGX1BJO1xuICAgIGNvc1ggPSBNYXRoLmNvcyhYKTtcbiAgICBzaW5YID0gTWF0aC5zaW4oWCk7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIHRzID0gdHNmbnoodGhpcy5lLCBsYXQgKiB0aGlzLmNvbiwgdGhpcy5jb24gKiBzaW5sYXQpO1xuICAgICAgcmggPSAyICogdGhpcy5hICogdGhpcy5rMCAqIHRzIC8gdGhpcy5jb25zO1xuICAgICAgcC54ID0gdGhpcy54MCArIHJoICogTWF0aC5zaW4obG9uIC0gdGhpcy5sb25nMCk7XG4gICAgICBwLnkgPSB0aGlzLnkwIC0gdGhpcy5jb24gKiByaCAqIE1hdGguY29zKGxvbiAtIHRoaXMubG9uZzApO1xuICAgICAgLy90cmFjZShwLnRvU3RyaW5nKCkpO1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuc2lubGF0MCkgPCBFUFNMTikge1xuICAgICAgLy9FcVxuICAgICAgLy90cmFjZSgnc3RlcmU6ZXF1YXRldXInKTtcbiAgICAgIEEgPSAyICogdGhpcy5hICogdGhpcy5rMCAvICgxICsgY29zWCAqIE1hdGguY29zKGRsb24pKTtcbiAgICAgIHAueSA9IEEgKiBzaW5YO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vb3RoZXIgY2FzZVxuICAgICAgLy90cmFjZSgnc3RlcmU6bm9ybWFsIGNhc2UnKTtcbiAgICAgIEEgPSAyICogdGhpcy5hICogdGhpcy5rMCAqIHRoaXMubXMxIC8gKHRoaXMuY29zWDAgKiAoMSArIHRoaXMuc2luWDAgKiBzaW5YICsgdGhpcy5jb3NYMCAqIGNvc1ggKiBNYXRoLmNvcyhkbG9uKSkpO1xuICAgICAgcC55ID0gQSAqICh0aGlzLmNvc1gwICogc2luWCAtIHRoaXMuc2luWDAgKiBjb3NYICogTWF0aC5jb3MoZGxvbikpICsgdGhpcy55MDtcbiAgICB9XG4gICAgcC54ID0gQSAqIGNvc1ggKiBNYXRoLnNpbihkbG9uKSArIHRoaXMueDA7XG4gIH1cbiAgLy90cmFjZShwLnRvU3RyaW5nKCkpO1xuICByZXR1cm4gcDtcbn1cblxuLy8qIFN0ZXJlb2dyYXBoaWMgaW52ZXJzZSBlcXVhdGlvbnMtLW1hcHBpbmcgeCx5IHRvIGxhdC9sb25nXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAtPSB0aGlzLngwO1xuICBwLnkgLT0gdGhpcy55MDtcbiAgdmFyIGxvbiwgbGF0LCB0cywgY2UsIENoaTtcbiAgdmFyIHJoID0gTWF0aC5zcXJ0KHAueCAqIHAueCArIHAueSAqIHAueSk7XG4gIGlmICh0aGlzLnNwaGVyZSkge1xuICAgIHZhciBjID0gMiAqIE1hdGguYXRhbihyaCAvICgyICogdGhpcy5hICogdGhpcy5rMCkpO1xuICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgbGF0ID0gdGhpcy5sYXQwO1xuICAgIGlmIChyaCA8PSBFUFNMTikge1xuICAgICAgcC54ID0gbG9uO1xuICAgICAgcC55ID0gbGF0O1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGxhdCA9IE1hdGguYXNpbihNYXRoLmNvcyhjKSAqIHRoaXMuc2lubGF0MCArIHAueSAqIE1hdGguc2luKGMpICogdGhpcy5jb3NsYXQwIC8gcmgpO1xuICAgIGlmIChNYXRoLmFicyh0aGlzLmNvc2xhdDApIDwgRVBTTE4pIHtcbiAgICAgIGlmICh0aGlzLmxhdDAgPiAwKSB7XG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtIDEgKiBwLnkpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLmF0YW4yKHAueCwgcC55KSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbG9uID0gYWRqdXN0X2xvbih0aGlzLmxvbmcwICsgTWF0aC5hdGFuMihwLnggKiBNYXRoLnNpbihjKSwgcmggKiB0aGlzLmNvc2xhdDAgKiBNYXRoLmNvcyhjKSAtIHAueSAqIHRoaXMuc2lubGF0MCAqIE1hdGguc2luKGMpKSk7XG4gICAgfVxuICAgIHAueCA9IGxvbjtcbiAgICBwLnkgPSBsYXQ7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuY29zbGF0MCkgPD0gRVBTTE4pIHtcbiAgICAgIGlmIChyaCA8PSBFUFNMTikge1xuICAgICAgICBsYXQgPSB0aGlzLmxhdDA7XG4gICAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgICAgIHAueCA9IGxvbjtcbiAgICAgICAgcC55ID0gbGF0O1xuICAgICAgICAvL3RyYWNlKHAudG9TdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfVxuICAgICAgcC54ICo9IHRoaXMuY29uO1xuICAgICAgcC55ICo9IHRoaXMuY29uO1xuICAgICAgdHMgPSByaCAqIHRoaXMuY29ucyAvICgyICogdGhpcy5hICogdGhpcy5rMCk7XG4gICAgICBsYXQgPSB0aGlzLmNvbiAqIHBoaTJ6KHRoaXMuZSwgdHMpO1xuICAgICAgbG9uID0gdGhpcy5jb24gKiBhZGp1c3RfbG9uKHRoaXMuY29uICogdGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54LCAtIDEgKiBwLnkpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjZSA9IDIgKiBNYXRoLmF0YW4ocmggKiB0aGlzLmNvc1gwIC8gKDIgKiB0aGlzLmEgKiB0aGlzLmswICogdGhpcy5tczEpKTtcbiAgICAgIGxvbiA9IHRoaXMubG9uZzA7XG4gICAgICBpZiAocmggPD0gRVBTTE4pIHtcbiAgICAgICAgQ2hpID0gdGhpcy5YMDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBDaGkgPSBNYXRoLmFzaW4oTWF0aC5jb3MoY2UpICogdGhpcy5zaW5YMCArIHAueSAqIE1hdGguc2luKGNlKSAqIHRoaXMuY29zWDAgLyByaCk7XG4gICAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIE1hdGguYXRhbjIocC54ICogTWF0aC5zaW4oY2UpLCByaCAqIHRoaXMuY29zWDAgKiBNYXRoLmNvcyhjZSkgLSBwLnkgKiB0aGlzLnNpblgwICogTWF0aC5zaW4oY2UpKSk7XG4gICAgICB9XG4gICAgICBsYXQgPSAtMSAqIHBoaTJ6KHRoaXMuZSwgTWF0aC50YW4oMC41ICogKEhBTEZfUEkgKyBDaGkpKSk7XG4gICAgfVxuICB9XG4gIHAueCA9IGxvbjtcbiAgcC55ID0gbGF0O1xuXG4gIC8vdHJhY2UocC50b1N0cmluZygpKTtcbiAgcmV0dXJuIHA7XG5cbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcInN0ZXJlXCIsIFwiU3RlcmVvZ3JhcGhpY19Tb3V0aF9Qb2xlXCIsIFwiUG9sYXIgU3RlcmVvZ3JhcGhpYyAodmFyaWFudCBCKVwiXTtcbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5pdDogaW5pdCxcbiAgZm9yd2FyZDogZm9yd2FyZCxcbiAgaW52ZXJzZTogaW52ZXJzZSxcbiAgbmFtZXM6IG5hbWVzLFxuICBzc2ZuXzogc3Nmbl9cbn07XG4iLCJpbXBvcnQgZ2F1c3MgZnJvbSAnLi9nYXVzcyc7XG5pbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBnYXVzcy5pbml0LmFwcGx5KHRoaXMpO1xuICBpZiAoIXRoaXMucmMpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5zaW5jMCA9IE1hdGguc2luKHRoaXMucGhpYzApO1xuICB0aGlzLmNvc2MwID0gTWF0aC5jb3ModGhpcy5waGljMCk7XG4gIHRoaXMuUjIgPSAyICogdGhpcy5yYztcbiAgaWYgKCF0aGlzLnRpdGxlKSB7XG4gICAgdGhpcy50aXRsZSA9IFwiT2JsaXF1ZSBTdGVyZW9ncmFwaGljIEFsdGVybmF0aXZlXCI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgc2luYywgY29zYywgY29zbCwgaztcbiAgcC54ID0gYWRqdXN0X2xvbihwLnggLSB0aGlzLmxvbmcwKTtcbiAgZ2F1c3MuZm9yd2FyZC5hcHBseSh0aGlzLCBbcF0pO1xuICBzaW5jID0gTWF0aC5zaW4ocC55KTtcbiAgY29zYyA9IE1hdGguY29zKHAueSk7XG4gIGNvc2wgPSBNYXRoLmNvcyhwLngpO1xuICBrID0gdGhpcy5rMCAqIHRoaXMuUjIgLyAoMSArIHRoaXMuc2luYzAgKiBzaW5jICsgdGhpcy5jb3NjMCAqIGNvc2MgKiBjb3NsKTtcbiAgcC54ID0gayAqIGNvc2MgKiBNYXRoLnNpbihwLngpO1xuICBwLnkgPSBrICogKHRoaXMuY29zYzAgKiBzaW5jIC0gdGhpcy5zaW5jMCAqIGNvc2MgKiBjb3NsKTtcbiAgcC54ID0gdGhpcy5hICogcC54ICsgdGhpcy54MDtcbiAgcC55ID0gdGhpcy5hICogcC55ICsgdGhpcy55MDtcbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnNlKHApIHtcbiAgdmFyIHNpbmMsIGNvc2MsIGxvbiwgbGF0LCByaG87XG4gIHAueCA9IChwLnggLSB0aGlzLngwKSAvIHRoaXMuYTtcbiAgcC55ID0gKHAueSAtIHRoaXMueTApIC8gdGhpcy5hO1xuXG4gIHAueCAvPSB0aGlzLmswO1xuICBwLnkgLz0gdGhpcy5rMDtcbiAgaWYgKChyaG8gPSBNYXRoLnNxcnQocC54ICogcC54ICsgcC55ICogcC55KSkpIHtcbiAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKHJobywgdGhpcy5SMik7XG4gICAgc2luYyA9IE1hdGguc2luKGMpO1xuICAgIGNvc2MgPSBNYXRoLmNvcyhjKTtcbiAgICBsYXQgPSBNYXRoLmFzaW4oY29zYyAqIHRoaXMuc2luYzAgKyBwLnkgKiBzaW5jICogdGhpcy5jb3NjMCAvIHJobyk7XG4gICAgbG9uID0gTWF0aC5hdGFuMihwLnggKiBzaW5jLCByaG8gKiB0aGlzLmNvc2MwICogY29zYyAtIHAueSAqIHRoaXMuc2luYzAgKiBzaW5jKTtcbiAgfVxuICBlbHNlIHtcbiAgICBsYXQgPSB0aGlzLnBoaWMwO1xuICAgIGxvbiA9IDA7XG4gIH1cblxuICBwLnggPSBsb247XG4gIHAueSA9IGxhdDtcbiAgZ2F1c3MuaW52ZXJzZS5hcHBseSh0aGlzLCBbcF0pO1xuICBwLnggPSBhZGp1c3RfbG9uKHAueCArIHRoaXMubG9uZzApO1xuICByZXR1cm4gcDtcbn1cblxuZXhwb3J0IHZhciBuYW1lcyA9IFtcIlN0ZXJlb2dyYXBoaWNfTm9ydGhfUG9sZVwiLCBcIk9ibGlxdWVfU3RlcmVvZ3JhcGhpY1wiLCBcIlBvbGFyX1N0ZXJlb2dyYXBoaWNcIiwgXCJzdGVyZWFcIixcIk9ibGlxdWUgU3RlcmVvZ3JhcGhpYyBBbHRlcm5hdGl2ZVwiLFwiRG91YmxlX1N0ZXJlb2dyYXBoaWNcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIi8vIEhlYXZpbHkgYmFzZWQgb24gdGhpcyB0bWVyYyBwcm9qZWN0aW9uIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbWJsb2NoL21hcHNoYXBlci1wcm9qL2Jsb2IvbWFzdGVyL3NyYy9wcm9qZWN0aW9ucy90bWVyYy5qc1xuXG5pbXBvcnQgcGpfZW5mbiBmcm9tICcuLi9jb21tb24vcGpfZW5mbic7XG5pbXBvcnQgcGpfbWxmbiBmcm9tICcuLi9jb21tb24vcGpfbWxmbic7XG5pbXBvcnQgcGpfaW52X21sZm4gZnJvbSAnLi4vY29tbW9uL3BqX2ludl9tbGZuJztcbmltcG9ydCBhZGp1c3RfbG9uIGZyb20gJy4uL2NvbW1vbi9hZGp1c3RfbG9uJztcblxuaW1wb3J0IHtFUFNMTiwgSEFMRl9QSX0gZnJvbSAnLi4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgc2lnbiBmcm9tICcuLi9jb21tb24vc2lnbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB0aGlzLngwID0gdGhpcy54MCAhPT0gdW5kZWZpbmVkID8gdGhpcy54MCA6IDA7XG4gIHRoaXMueTAgPSB0aGlzLnkwICE9PSB1bmRlZmluZWQgPyB0aGlzLnkwIDogMDtcbiAgdGhpcy5sb25nMCA9IHRoaXMubG9uZzAgIT09IHVuZGVmaW5lZCA/IHRoaXMubG9uZzAgOiAwO1xuICB0aGlzLmxhdDAgPSB0aGlzLmxhdDAgIT09IHVuZGVmaW5lZCA/IHRoaXMubGF0MCA6IDA7XG5cbiAgaWYgKHRoaXMuZXMpIHtcbiAgICB0aGlzLmVuID0gcGpfZW5mbih0aGlzLmVzKTtcbiAgICB0aGlzLm1sMCA9IHBqX21sZm4odGhpcy5sYXQwLCBNYXRoLnNpbih0aGlzLmxhdDApLCBNYXRoLmNvcyh0aGlzLmxhdDApLCB0aGlzLmVuKTtcbiAgfVxufVxuXG4vKipcbiAgICBUcmFuc3ZlcnNlIE1lcmNhdG9yIEZvcndhcmQgIC0gbG9uZy9sYXQgdG8geC95XG4gICAgbG9uZy9sYXQgaW4gcmFkaWFuc1xuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIHZhciBkZWx0YV9sb24gPSBhZGp1c3RfbG9uKGxvbiAtIHRoaXMubG9uZzApO1xuICB2YXIgY29uO1xuICB2YXIgeCwgeTtcbiAgdmFyIHNpbl9waGkgPSBNYXRoLnNpbihsYXQpO1xuICB2YXIgY29zX3BoaSA9IE1hdGguY29zKGxhdCk7XG5cbiAgaWYgKCF0aGlzLmVzKSB7XG4gICAgdmFyIGIgPSBjb3NfcGhpICogTWF0aC5zaW4oZGVsdGFfbG9uKTtcblxuICAgIGlmICgoTWF0aC5hYnMoTWF0aC5hYnMoYikgLSAxKSkgPCBFUFNMTikge1xuICAgICAgcmV0dXJuICg5Myk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeCA9IDAuNSAqIHRoaXMuYSAqIHRoaXMuazAgKiBNYXRoLmxvZygoMSArIGIpIC8gKDEgLSBiKSkgKyB0aGlzLngwO1xuICAgICAgeSA9IGNvc19waGkgKiBNYXRoLmNvcyhkZWx0YV9sb24pIC8gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyhiLCAyKSk7XG4gICAgICBiID0gTWF0aC5hYnMoeSk7XG5cbiAgICAgIGlmIChiID49IDEpIHtcbiAgICAgICAgaWYgKChiIC0gMSkgPiBFUFNMTikge1xuICAgICAgICAgIHJldHVybiAoOTMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHkgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgeSA9IE1hdGguYWNvcyh5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhdCA8IDApIHtcbiAgICAgICAgeSA9IC15O1xuICAgICAgfVxuXG4gICAgICB5ID0gdGhpcy5hICogdGhpcy5rMCAqICh5IC0gdGhpcy5sYXQwKSArIHRoaXMueTA7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIHZhciBhbCA9IGNvc19waGkgKiBkZWx0YV9sb247XG4gICAgdmFyIGFscyA9IE1hdGgucG93KGFsLCAyKTtcbiAgICB2YXIgYyA9IHRoaXMuZXAyICogTWF0aC5wb3coY29zX3BoaSwgMik7XG4gICAgdmFyIGNzID0gTWF0aC5wb3coYywgMik7XG4gICAgdmFyIHRxID0gTWF0aC5hYnMoY29zX3BoaSkgPiBFUFNMTiA/IE1hdGgudGFuKGxhdCkgOiAwO1xuICAgIHZhciB0ID0gTWF0aC5wb3codHEsIDIpO1xuICAgIHZhciB0cyA9IE1hdGgucG93KHQsIDIpO1xuICAgIGNvbiA9IDEgLSB0aGlzLmVzICogTWF0aC5wb3coc2luX3BoaSwgMik7XG4gICAgYWwgPSBhbCAvIE1hdGguc3FydChjb24pO1xuICAgIHZhciBtbCA9IHBqX21sZm4obGF0LCBzaW5fcGhpLCBjb3NfcGhpLCB0aGlzLmVuKTtcblxuICAgIHggPSB0aGlzLmEgKiAodGhpcy5rMCAqIGFsICogKDEgK1xuICAgICAgYWxzIC8gNiAqICgxIC0gdCArIGMgK1xuICAgICAgYWxzIC8gMjAgKiAoNSAtIDE4ICogdCArIHRzICsgMTQgKiBjIC0gNTggKiB0ICogYyArXG4gICAgICBhbHMgLyA0MiAqICg2MSArIDE3OSAqIHRzIC0gdHMgKiB0IC0gNDc5ICogdCkpKSkpICtcbiAgICAgIHRoaXMueDA7XG5cbiAgICB5ID0gdGhpcy5hICogKHRoaXMuazAgKiAobWwgLSB0aGlzLm1sMCArXG4gICAgICBzaW5fcGhpICogZGVsdGFfbG9uICogYWwgLyAyICogKDEgK1xuICAgICAgYWxzIC8gMTIgKiAoNSAtIHQgKyA5ICogYyArIDQgKiBjcyArXG4gICAgICBhbHMgLyAzMCAqICg2MSArIHRzIC0gNTggKiB0ICsgMjcwICogYyAtIDMzMCAqIHQgKiBjICtcbiAgICAgIGFscyAvIDU2ICogKDEzODUgKyA1NDMgKiB0cyAtIHRzICogdCAtIDMxMTEgKiB0KSkpKSkpICtcbiAgICAgIHRoaXMueTA7XG4gIH1cblxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuXG4gIHJldHVybiBwO1xufVxuXG4vKipcbiAgICBUcmFuc3ZlcnNlIE1lcmNhdG9yIEludmVyc2UgIC0gIHgveSB0byBsb25nL2xhdFxuICAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgY29uLCBwaGk7XG4gIHZhciBsYXQsIGxvbjtcbiAgdmFyIHggPSAocC54IC0gdGhpcy54MCkgKiAoMSAvIHRoaXMuYSk7XG4gIHZhciB5ID0gKHAueSAtIHRoaXMueTApICogKDEgLyB0aGlzLmEpO1xuXG4gIGlmICghdGhpcy5lcykge1xuICAgIHZhciBmID0gTWF0aC5leHAoeCAvIHRoaXMuazApO1xuICAgIHZhciBnID0gMC41ICogKGYgLSAxIC8gZik7XG4gICAgdmFyIHRlbXAgPSB0aGlzLmxhdDAgKyB5IC8gdGhpcy5rMDtcbiAgICB2YXIgaCA9IE1hdGguY29zKHRlbXApO1xuICAgIGNvbiA9IE1hdGguc3FydCgoMSAtIE1hdGgucG93KGgsIDIpKSAvICgxICsgTWF0aC5wb3coZywgMikpKTtcbiAgICBsYXQgPSBNYXRoLmFzaW4oY29uKTtcblxuICAgIGlmICh5IDwgMCkge1xuICAgICAgbGF0ID0gLWxhdDtcbiAgICB9XG5cbiAgICBpZiAoKGcgPT09IDApICYmIChoID09PSAwKSkge1xuICAgICAgbG9uID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb24gPSBhZGp1c3RfbG9uKE1hdGguYXRhbjIoZywgaCkgKyB0aGlzLmxvbmcwKTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7IC8vIGVsbGlwc29pZGFsIGZvcm1cbiAgICBjb24gPSB0aGlzLm1sMCArIHkgLyB0aGlzLmswO1xuICAgIHBoaSA9IHBqX2ludl9tbGZuKGNvbiwgdGhpcy5lcywgdGhpcy5lbik7XG5cbiAgICBpZiAoTWF0aC5hYnMocGhpKSA8IEhBTEZfUEkpIHtcbiAgICAgIHZhciBzaW5fcGhpID0gTWF0aC5zaW4ocGhpKTtcbiAgICAgIHZhciBjb3NfcGhpID0gTWF0aC5jb3MocGhpKTtcbiAgICAgIHZhciB0YW5fcGhpID0gTWF0aC5hYnMoY29zX3BoaSkgPiBFUFNMTiA/IE1hdGgudGFuKHBoaSkgOiAwO1xuICAgICAgdmFyIGMgPSB0aGlzLmVwMiAqIE1hdGgucG93KGNvc19waGksIDIpO1xuICAgICAgdmFyIGNzID0gTWF0aC5wb3coYywgMik7XG4gICAgICB2YXIgdCA9IE1hdGgucG93KHRhbl9waGksIDIpO1xuICAgICAgdmFyIHRzID0gTWF0aC5wb3codCwgMik7XG4gICAgICBjb24gPSAxIC0gdGhpcy5lcyAqIE1hdGgucG93KHNpbl9waGksIDIpO1xuICAgICAgdmFyIGQgPSB4ICogTWF0aC5zcXJ0KGNvbikgLyB0aGlzLmswO1xuICAgICAgdmFyIGRzID0gTWF0aC5wb3coZCwgMik7XG4gICAgICBjb24gPSBjb24gKiB0YW5fcGhpO1xuXG4gICAgICBsYXQgPSBwaGkgLSAoY29uICogZHMgLyAoMSAtIHRoaXMuZXMpKSAqIDAuNSAqICgxIC1cbiAgICAgICAgZHMgLyAxMiAqICg1ICsgMyAqIHQgLSA5ICogYyAqIHQgKyBjIC0gNCAqIGNzIC1cbiAgICAgICAgZHMgLyAzMCAqICg2MSArIDkwICogdCAtIDI1MiAqIGMgKiB0ICsgNDUgKiB0cyArIDQ2ICogYyAtXG4gICAgICAgIGRzIC8gNTYgKiAoMTM4NSArIDM2MzMgKiB0ICsgNDA5NSAqIHRzICsgMTU3NCAqIHRzICogdCkpKSk7XG5cbiAgICAgIGxvbiA9IGFkanVzdF9sb24odGhpcy5sb25nMCArIChkICogKDEgLVxuICAgICAgICBkcyAvIDYgKiAoMSArIDIgKiB0ICsgYyAtXG4gICAgICAgIGRzIC8gMjAgKiAoNSArIDI4ICogdCArIDI0ICogdHMgKyA4ICogYyAqIHQgKyA2ICogYyAtXG4gICAgICAgIGRzIC8gNDIgKiAoNjEgKyA2NjIgKiB0ICsgMTMyMCAqIHRzICsgNzIwICogdHMgKiB0KSkpKSAvIGNvc19waGkpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsYXQgPSBIQUxGX1BJICogc2lnbih5KTtcbiAgICAgIGxvbiA9IDA7XG4gICAgfVxuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG5cbiAgcmV0dXJuIHA7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJGYXN0X1RyYW5zdmVyc2VfTWVyY2F0b3JcIiwgXCJGYXN0IFRyYW5zdmVyc2UgTWVyY2F0b3JcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsIlxudmFyIG1vZGUgPSB7XG4gIE5fUE9MRTogMCxcbiAgU19QT0xFOiAxLFxuICBFUVVJVDogMixcbiAgT0JMSVE6IDNcbn07XG5cbmltcG9ydCB7IEQyUiwgSEFMRl9QSSwgRVBTTE4gfSBmcm9tIFwiLi4vY29uc3RhbnRzL3ZhbHVlc1wiO1xuaW1wb3J0IGh5cG90IGZyb20gXCIuLi9jb21tb24vaHlwb3RcIjtcblxudmFyIHBhcmFtcyA9IHtcbiAgaDogICAgIHsgZGVmOiAxMDAwMDAsIG51bTogdHJ1ZSB9LCAgICAgICAgICAgLy8gZGVmYXVsdCBpcyBLYXJtYW4gbGluZSwgbm8gZGVmYXVsdCBpbiBQUk9KLjdcbiAgYXppOiAgIHsgZGVmOiAwLCBudW06IHRydWUsIGRlZ3JlZXM6IHRydWUgfSwgLy8gZGVmYXVsdCBpcyBOb3J0aFxuICB0aWx0OiAgeyBkZWY6IDAsIG51bTogdHJ1ZSwgZGVncmVlczogdHJ1ZSB9LCAvLyBkZWZhdWx0IGlzIE5hZGlyXG4gIGxvbmcwOiB7IGRlZjogMCwgbnVtOiB0cnVlIH0sICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgaXMgR3JlZW53aWNoLCBjb252ZXJzaW9uIHRvIHJhZCBpcyBhdXRvbWF0aWNcbiAgbGF0MDogIHsgZGVmOiAwLCBudW06IHRydWUgfSAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCBpcyBFcXVhdG9yLCBjb252ZXJzaW9uIHRvIHJhZCBpcyBhdXRvbWF0aWNcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goZnVuY3Rpb24gKHApIHtcbiAgICBpZiAodHlwZW9mIHRoaXNbcF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXNbcF0gPSBwYXJhbXNbcF0uZGVmO1xuICAgIH0gZWxzZSBpZiAocGFyYW1zW3BdLm51bSAmJiBpc05hTih0aGlzW3BdKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXJhbWV0ZXIgdmFsdWUsIG11c3QgYmUgbnVtZXJpYyBcIiArIHAgKyBcIiA9IFwiICsgdGhpc1twXSk7XG4gICAgfSBlbHNlIGlmIChwYXJhbXNbcF0ubnVtKSB7XG4gICAgICB0aGlzW3BdID0gcGFyc2VGbG9hdCh0aGlzW3BdKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtc1twXS5kZWdyZWVzKSB7XG4gICAgICB0aGlzW3BdID0gdGhpc1twXSAqIEQyUjtcbiAgICB9XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgaWYgKE1hdGguYWJzKChNYXRoLmFicyh0aGlzLmxhdDApIC0gSEFMRl9QSSkpIDwgRVBTTE4pIHtcbiAgICB0aGlzLm1vZGUgPSB0aGlzLmxhdDAgPCAwID8gbW9kZS5TX1BPTEUgOiBtb2RlLk5fUE9MRTtcbiAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLmxhdDApIDwgRVBTTE4pIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlLkVRVUlUO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubW9kZSA9IG1vZGUuT0JMSVE7XG4gICAgdGhpcy5zaW5waDAgPSBNYXRoLnNpbih0aGlzLmxhdDApO1xuICAgIHRoaXMuY29zcGgwID0gTWF0aC5jb3ModGhpcy5sYXQwKTtcbiAgfVxuXG4gIHRoaXMucG4xID0gdGhpcy5oIC8gdGhpcy5hOyAgLy8gTm9ybWFsaXplIHJlbGF0aXZlIHRvIHRoZSBFYXJ0aCdzIHJhZGl1c1xuXG4gIGlmICh0aGlzLnBuMSA8PSAwIHx8IHRoaXMucG4xID4gMWUxMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaGVpZ2h0XCIpO1xuICB9XG4gIFxuICB0aGlzLnAgPSAxICsgdGhpcy5wbjE7XG4gIHRoaXMucnAgPSAxIC8gdGhpcy5wO1xuICB0aGlzLmgxID0gMSAvIHRoaXMucG4xO1xuICB0aGlzLnBmYWN0ID0gKHRoaXMucCArIDEpICogdGhpcy5oMTtcbiAgdGhpcy5lcyA9IDA7XG5cbiAgdmFyIG9tZWdhID0gdGhpcy50aWx0O1xuICB2YXIgZ2FtbWEgPSB0aGlzLmF6aTtcbiAgdGhpcy5jZyA9IE1hdGguY29zKGdhbW1hKTtcbiAgdGhpcy5zZyA9IE1hdGguc2luKGdhbW1hKTtcbiAgdGhpcy5jdyA9IE1hdGguY29zKG9tZWdhKTtcbiAgdGhpcy5zdyA9IE1hdGguc2luKG9tZWdhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcndhcmQocCkge1xuICBwLnggLT0gdGhpcy5sb25nMDtcbiAgdmFyIHNpbnBoaSA9IE1hdGguc2luKHAueSk7XG4gIHZhciBjb3NwaGkgPSBNYXRoLmNvcyhwLnkpO1xuICB2YXIgY29zbGFtID0gTWF0aC5jb3MocC54KTtcbiAgdmFyIHgsIHk7XG4gIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgY2FzZSBtb2RlLk9CTElROlxuICAgICAgeSA9IHRoaXMuc2lucGgwICogc2lucGhpICsgdGhpcy5jb3NwaDAgKiBjb3NwaGkgKiBjb3NsYW07XG4gICAgICBicmVhaztcbiAgICBjYXNlIG1vZGUuRVFVSVQ6XG4gICAgICB5ID0gY29zcGhpICogY29zbGFtO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLlNfUE9MRTpcbiAgICAgIHkgPSAtc2lucGhpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLk5fUE9MRTpcbiAgICAgIHkgPSBzaW5waGk7XG4gICAgICBicmVhaztcbiAgfVxuICB5ID0gdGhpcy5wbjEgLyAodGhpcy5wIC0geSk7XG4gIHggPSB5ICogY29zcGhpICogTWF0aC5zaW4ocC54KTtcblxuICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgIGNhc2UgbW9kZS5PQkxJUTpcbiAgICAgIHkgKj0gdGhpcy5jb3NwaDAgKiBzaW5waGkgLSB0aGlzLnNpbnBoMCAqIGNvc3BoaSAqIGNvc2xhbTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbW9kZS5FUVVJVDpcbiAgICAgIHkgKj0gc2lucGhpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLk5fUE9MRTpcbiAgICAgIHkgKj0gLShjb3NwaGkgKiBjb3NsYW0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBtb2RlLlNfUE9MRTpcbiAgICAgIHkgKj0gY29zcGhpICogY29zbGFtO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBUaWx0IFxuICB2YXIgeXQsIGJhO1xuICB5dCA9IHkgKiB0aGlzLmNnICsgeCAqIHRoaXMuc2c7XG4gIGJhID0gMSAvICh5dCAqIHRoaXMuc3cgKiB0aGlzLmgxICsgdGhpcy5jdyk7XG4gIHggPSAoeCAqIHRoaXMuY2cgLSB5ICogdGhpcy5zZykgKiB0aGlzLmN3ICogYmE7XG4gIHkgPSB5dCAqIGJhO1xuXG4gIHAueCA9IHggKiB0aGlzLmE7XG4gIHAueSA9IHkgKiB0aGlzLmE7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZShwKSB7XG4gIHAueCAvPSB0aGlzLmE7XG4gIHAueSAvPSB0aGlzLmE7XG4gIHZhciByID0geyB4OiBwLngsIHk6IHAueSB9O1xuXG4gIC8vIFVuLVRpbHRcbiAgdmFyIGJtLCBicSwgeXQ7XG4gIHl0ID0gMSAvICh0aGlzLnBuMSAtIHAueSAqIHRoaXMuc3cpO1xuICBibSA9IHRoaXMucG4xICogcC54ICogeXQ7XG4gIGJxID0gdGhpcy5wbjEgKiBwLnkgKiB0aGlzLmN3ICogeXQ7XG4gIHAueCA9IGJtICogdGhpcy5jZyArIGJxICogdGhpcy5zZztcbiAgcC55ID0gYnEgKiB0aGlzLmNnIC0gYm0gKiB0aGlzLnNnO1xuXG4gIHZhciByaCA9IGh5cG90KHAueCwgcC55KTtcbiAgaWYgKE1hdGguYWJzKHJoKSA8IEVQU0xOKSB7XG4gICAgci54ID0gMDtcbiAgICByLnkgPSBwLnk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNvc3osIHNpbno7XG4gICAgc2lueiA9IDEgLSByaCAqIHJoICogdGhpcy5wZmFjdDtcbiAgICBzaW56ID0gKHRoaXMucCAtIE1hdGguc3FydChzaW56KSkgLyAodGhpcy5wbjEgLyByaCArIHJoIC8gdGhpcy5wbjEpO1xuICAgIGNvc3ogPSBNYXRoLnNxcnQoMSAtIHNpbnogKiBzaW56KTtcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSBtb2RlLk9CTElROlxuICAgICAgICByLnkgPSBNYXRoLmFzaW4oY29zeiAqIHRoaXMuc2lucGgwICsgcC55ICogc2lueiAqIHRoaXMuY29zcGgwIC8gcmgpO1xuICAgICAgICBwLnkgPSAoY29zeiAtIHRoaXMuc2lucGgwICogTWF0aC5zaW4oci55KSkgKiByaDtcbiAgICAgICAgcC54ICo9IHNpbnogKiB0aGlzLmNvc3BoMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG1vZGUuRVFVSVQ6XG4gICAgICAgIHIueSA9IE1hdGguYXNpbihwLnkgKiBzaW56IC8gcmgpO1xuICAgICAgICBwLnkgPSBjb3N6ICogcmg7XG4gICAgICAgIHAueCAqPSBzaW56O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgbW9kZS5OX1BPTEU6XG4gICAgICAgIHIueSA9IE1hdGguYXNpbihjb3N6KTtcbiAgICAgICAgcC55ID0gLXAueTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG1vZGUuU19QT0xFOlxuICAgICAgICByLnkgPSAtTWF0aC5hc2luKGNvc3opO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgci54ID0gTWF0aC5hdGFuMihwLngsIHAueSk7XG4gIH1cblxuICBwLnggPSByLnggKyB0aGlzLmxvbmcwO1xuICBwLnkgPSByLnk7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiVGlsdGVkX1BlcnNwZWN0aXZlXCIsIFwidHBlcnNcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCBhZGp1c3Rfem9uZSBmcm9tICcuLi9jb21tb24vYWRqdXN0X3pvbmUnO1xuaW1wb3J0IGV0bWVyYyBmcm9tICcuL2V0bWVyYyc7XG5leHBvcnQgdmFyIGRlcGVuZHNPbiA9ICdldG1lcmMnO1xuaW1wb3J0IHtEMlJ9IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICB2YXIgem9uZSA9IGFkanVzdF96b25lKHRoaXMuem9uZSwgdGhpcy5sb25nMCk7XG4gIGlmICh6b25lID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vua25vd24gdXRtIHpvbmUnKTtcbiAgfVxuICB0aGlzLmxhdDAgPSAwO1xuICB0aGlzLmxvbmcwID0gICgoNiAqIE1hdGguYWJzKHpvbmUpKSAtIDE4MykgKiBEMlI7XG4gIHRoaXMueDAgPSA1MDAwMDA7XG4gIHRoaXMueTAgPSB0aGlzLnV0bVNvdXRoID8gMTAwMDAwMDAgOiAwO1xuICB0aGlzLmswID0gMC45OTk2O1xuXG4gIGV0bWVyYy5pbml0LmFwcGx5KHRoaXMpO1xuICB0aGlzLmZvcndhcmQgPSBldG1lcmMuZm9yd2FyZDtcbiAgdGhpcy5pbnZlcnNlID0gZXRtZXJjLmludmVyc2U7XG59XG5cbmV4cG9ydCB2YXIgbmFtZXMgPSBbXCJVbml2ZXJzYWwgVHJhbnN2ZXJzZSBNZXJjYXRvciBTeXN0ZW1cIiwgXCJ1dG1cIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIG5hbWVzOiBuYW1lcyxcbiAgZGVwZW5kc09uOiBkZXBlbmRzT25cbn07XG4iLCJpbXBvcnQgYWRqdXN0X2xvbiBmcm9tICcuLi9jb21tb24vYWRqdXN0X2xvbic7XG5cbmltcG9ydCB7SEFMRl9QSSwgRVBTTE59IGZyb20gJy4uL2NvbnN0YW50cy92YWx1ZXMnO1xuXG5pbXBvcnQgYXNpbnogZnJvbSAnLi4vY29tbW9uL2FzaW56JztcblxuLyogSW5pdGlhbGl6ZSB0aGUgVmFuIERlciBHcmludGVuIHByb2plY3Rpb25cbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy90aGlzLlIgPSA2MzcwOTk3OyAvL1JhZGl1cyBvZiBlYXJ0aFxuICB0aGlzLlIgPSB0aGlzLmE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkKHApIHtcblxuICB2YXIgbG9uID0gcC54O1xuICB2YXIgbGF0ID0gcC55O1xuXG4gIC8qIEZvcndhcmQgZXF1YXRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICB2YXIgZGxvbiA9IGFkanVzdF9sb24obG9uIC0gdGhpcy5sb25nMCk7XG4gIHZhciB4LCB5O1xuXG4gIGlmIChNYXRoLmFicyhsYXQpIDw9IEVQU0xOKSB7XG4gICAgeCA9IHRoaXMueDAgKyB0aGlzLlIgKiBkbG9uO1xuICAgIHkgPSB0aGlzLnkwO1xuICB9XG4gIHZhciB0aGV0YSA9IGFzaW56KDIgKiBNYXRoLmFicyhsYXQgLyBNYXRoLlBJKSk7XG4gIGlmICgoTWF0aC5hYnMoZGxvbikgPD0gRVBTTE4pIHx8IChNYXRoLmFicyhNYXRoLmFicyhsYXQpIC0gSEFMRl9QSSkgPD0gRVBTTE4pKSB7XG4gICAgeCA9IHRoaXMueDA7XG4gICAgaWYgKGxhdCA+PSAwKSB7XG4gICAgICB5ID0gdGhpcy55MCArIE1hdGguUEkgKiB0aGlzLlIgKiBNYXRoLnRhbigwLjUgKiB0aGV0YSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgeSA9IHRoaXMueTAgKyBNYXRoLlBJICogdGhpcy5SICogLU1hdGgudGFuKDAuNSAqIHRoZXRhKTtcbiAgICB9XG4gICAgLy8gIHJldHVybihPSyk7XG4gIH1cbiAgdmFyIGFsID0gMC41ICogTWF0aC5hYnMoKE1hdGguUEkgLyBkbG9uKSAtIChkbG9uIC8gTWF0aC5QSSkpO1xuICB2YXIgYXNxID0gYWwgKiBhbDtcbiAgdmFyIHNpbnRoID0gTWF0aC5zaW4odGhldGEpO1xuICB2YXIgY29zdGggPSBNYXRoLmNvcyh0aGV0YSk7XG5cbiAgdmFyIGcgPSBjb3N0aCAvIChzaW50aCArIGNvc3RoIC0gMSk7XG4gIHZhciBnc3EgPSBnICogZztcbiAgdmFyIG0gPSBnICogKDIgLyBzaW50aCAtIDEpO1xuICB2YXIgbXNxID0gbSAqIG07XG4gIHZhciBjb24gPSBNYXRoLlBJICogdGhpcy5SICogKGFsICogKGcgLSBtc3EpICsgTWF0aC5zcXJ0KGFzcSAqIChnIC0gbXNxKSAqIChnIC0gbXNxKSAtIChtc3EgKyBhc3EpICogKGdzcSAtIG1zcSkpKSAvIChtc3EgKyBhc3EpO1xuICBpZiAoZGxvbiA8IDApIHtcbiAgICBjb24gPSAtY29uO1xuICB9XG4gIHggPSB0aGlzLngwICsgY29uO1xuICAvL2NvbiA9IE1hdGguYWJzKGNvbiAvIChNYXRoLlBJICogdGhpcy5SKSk7XG4gIHZhciBxID0gYXNxICsgZztcbiAgY29uID0gTWF0aC5QSSAqIHRoaXMuUiAqIChtICogcSAtIGFsICogTWF0aC5zcXJ0KChtc3EgKyBhc3EpICogKGFzcSArIDEpIC0gcSAqIHEpKSAvIChtc3EgKyBhc3EpO1xuICBpZiAobGF0ID49IDApIHtcbiAgICAvL3kgPSB0aGlzLnkwICsgTWF0aC5QSSAqIHRoaXMuUiAqIE1hdGguc3FydCgxIC0gY29uICogY29uIC0gMiAqIGFsICogY29uKTtcbiAgICB5ID0gdGhpcy55MCArIGNvbjtcbiAgfVxuICBlbHNlIHtcbiAgICAvL3kgPSB0aGlzLnkwIC0gTWF0aC5QSSAqIHRoaXMuUiAqIE1hdGguc3FydCgxIC0gY29uICogY29uIC0gMiAqIGFsICogY29uKTtcbiAgICB5ID0gdGhpcy55MCAtIGNvbjtcbiAgfVxuICBwLnggPSB4O1xuICBwLnkgPSB5O1xuICByZXR1cm4gcDtcbn1cblxuLyogVmFuIERlciBHcmludGVuIGludmVyc2UgZXF1YXRpb25zLS1tYXBwaW5nIHgseSB0byBsYXQvbG9uZ1xuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuZXhwb3J0IGZ1bmN0aW9uIGludmVyc2UocCkge1xuICB2YXIgbG9uLCBsYXQ7XG4gIHZhciB4eCwgeXksIHh5cywgYzEsIGMyLCBjMztcbiAgdmFyIGExO1xuICB2YXIgbTE7XG4gIHZhciBjb247XG4gIHZhciB0aDE7XG4gIHZhciBkO1xuXG4gIC8qIGludmVyc2UgZXF1YXRpb25zXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0qL1xuICBwLnggLT0gdGhpcy54MDtcbiAgcC55IC09IHRoaXMueTA7XG4gIGNvbiA9IE1hdGguUEkgKiB0aGlzLlI7XG4gIHh4ID0gcC54IC8gY29uO1xuICB5eSA9IHAueSAvIGNvbjtcbiAgeHlzID0geHggKiB4eCArIHl5ICogeXk7XG4gIGMxID0gLU1hdGguYWJzKHl5KSAqICgxICsgeHlzKTtcbiAgYzIgPSBjMSAtIDIgKiB5eSAqIHl5ICsgeHggKiB4eDtcbiAgYzMgPSAtMiAqIGMxICsgMSArIDIgKiB5eSAqIHl5ICsgeHlzICogeHlzO1xuICBkID0geXkgKiB5eSAvIGMzICsgKDIgKiBjMiAqIGMyICogYzIgLyBjMyAvIGMzIC8gYzMgLSA5ICogYzEgKiBjMiAvIGMzIC8gYzMpIC8gMjc7XG4gIGExID0gKGMxIC0gYzIgKiBjMiAvIDMgLyBjMykgLyBjMztcbiAgbTEgPSAyICogTWF0aC5zcXJ0KC1hMSAvIDMpO1xuICBjb24gPSAoKDMgKiBkKSAvIGExKSAvIG0xO1xuICBpZiAoTWF0aC5hYnMoY29uKSA+IDEpIHtcbiAgICBpZiAoY29uID49IDApIHtcbiAgICAgIGNvbiA9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uID0gLTE7XG4gICAgfVxuICB9XG4gIHRoMSA9IE1hdGguYWNvcyhjb24pIC8gMztcbiAgaWYgKHAueSA+PSAwKSB7XG4gICAgbGF0ID0gKC1tMSAqIE1hdGguY29zKHRoMSArIE1hdGguUEkgLyAzKSAtIGMyIC8gMyAvIGMzKSAqIE1hdGguUEk7XG4gIH1cbiAgZWxzZSB7XG4gICAgbGF0ID0gLSgtbTEgKiBNYXRoLmNvcyh0aDEgKyBNYXRoLlBJIC8gMykgLSBjMiAvIDMgLyBjMykgKiBNYXRoLlBJO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKHh4KSA8IEVQU0xOKSB7XG4gICAgbG9uID0gdGhpcy5sb25nMDtcbiAgfVxuICBlbHNlIHtcbiAgICBsb24gPSBhZGp1c3RfbG9uKHRoaXMubG9uZzAgKyBNYXRoLlBJICogKHh5cyAtIDEgKyBNYXRoLnNxcnQoMSArIDIgKiAoeHggKiB4eCAtIHl5ICogeXkpICsgeHlzICogeHlzKSkgLyAyIC8geHgpO1xuICB9XG5cbiAgcC54ID0gbG9uO1xuICBwLnkgPSBsYXQ7XG4gIHJldHVybiBwO1xufVxuXG5leHBvcnQgdmFyIG5hbWVzID0gW1wiVmFuX2Rlcl9HcmludGVuX0lcIiwgXCJWYW5EZXJHcmludGVuXCIsIFwidmFuZGdcIl07XG5leHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGluaXQsXG4gIGZvcndhcmQ6IGZvcndhcmQsXG4gIGludmVyc2U6IGludmVyc2UsXG4gIG5hbWVzOiBuYW1lc1xufTtcbiIsImltcG9ydCB7RDJSLCBSMkQsIFBKRF8zUEFSQU0sIFBKRF83UEFSQU19IGZyb20gJy4vY29uc3RhbnRzL3ZhbHVlcyc7XG5pbXBvcnQgZGF0dW1fdHJhbnNmb3JtIGZyb20gJy4vZGF0dW1fdHJhbnNmb3JtJztcbmltcG9ydCBhZGp1c3RfYXhpcyBmcm9tICcuL2FkanVzdF9heGlzJztcbmltcG9ydCBwcm9qIGZyb20gJy4vUHJvaic7XG5pbXBvcnQgdG9Qb2ludCBmcm9tICcuL2NvbW1vbi90b1BvaW50JztcbmltcG9ydCBjaGVja1Nhbml0eSBmcm9tICcuL2NoZWNrU2FuaXR5JztcblxuZnVuY3Rpb24gY2hlY2tOb3RXR1Moc291cmNlLCBkZXN0KSB7XG4gIHJldHVybiAoKHNvdXJjZS5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfM1BBUkFNIHx8IHNvdXJjZS5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSAmJiBkZXN0LmRhdHVtQ29kZSAhPT0gJ1dHUzg0JykgfHwgKChkZXN0LmRhdHVtLmRhdHVtX3R5cGUgPT09IFBKRF8zUEFSQU0gfHwgZGVzdC5kYXR1bS5kYXR1bV90eXBlID09PSBQSkRfN1BBUkFNKSAmJiBzb3VyY2UuZGF0dW1Db2RlICE9PSAnV0dTODQnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtKHNvdXJjZSwgZGVzdCwgcG9pbnQsIGVuZm9yY2VBeGlzKSB7XG4gIHZhciB3Z3M4NDtcbiAgaWYgKEFycmF5LmlzQXJyYXkocG9pbnQpKSB7XG4gICAgcG9pbnQgPSB0b1BvaW50KHBvaW50KTtcbiAgfVxuICBjaGVja1Nhbml0eShwb2ludCk7XG4gIC8vIFdvcmthcm91bmQgZm9yIGRhdHVtIHNoaWZ0cyB0b3dnczg0LCBpZiBlaXRoZXIgc291cmNlIG9yIGRlc3RpbmF0aW9uIHByb2plY3Rpb24gaXMgbm90IHdnczg0XG4gIGlmIChzb3VyY2UuZGF0dW0gJiYgZGVzdC5kYXR1bSAmJiBjaGVja05vdFdHUyhzb3VyY2UsIGRlc3QpKSB7XG4gICAgd2dzODQgPSBuZXcgcHJvaignV0dTODQnKTtcbiAgICBwb2ludCA9IHRyYW5zZm9ybShzb3VyY2UsIHdnczg0LCBwb2ludCwgZW5mb3JjZUF4aXMpO1xuICAgIHNvdXJjZSA9IHdnczg0O1xuICB9XG4gIC8vIERHUiwgMjAxMC8xMS8xMlxuICBpZiAoZW5mb3JjZUF4aXMgJiYgc291cmNlLmF4aXMgIT09ICdlbnUnKSB7XG4gICAgcG9pbnQgPSBhZGp1c3RfYXhpcyhzb3VyY2UsIGZhbHNlLCBwb2ludCk7XG4gIH1cbiAgLy8gVHJhbnNmb3JtIHNvdXJjZSBwb2ludHMgdG8gbG9uZy9sYXQsIGlmIHRoZXkgYXJlbid0IGFscmVhZHkuXG4gIGlmIChzb3VyY2UucHJvak5hbWUgPT09ICdsb25nbGF0Jykge1xuICAgIHBvaW50ID0ge1xuICAgICAgeDogcG9pbnQueCAqIEQyUixcbiAgICAgIHk6IHBvaW50LnkgKiBEMlIsXG4gICAgICB6OiBwb2ludC56IHx8IDBcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGlmIChzb3VyY2UudG9fbWV0ZXIpIHtcbiAgICAgIHBvaW50ID0ge1xuICAgICAgICB4OiBwb2ludC54ICogc291cmNlLnRvX21ldGVyLFxuICAgICAgICB5OiBwb2ludC55ICogc291cmNlLnRvX21ldGVyLFxuICAgICAgICB6OiBwb2ludC56IHx8IDBcbiAgICAgIH07XG4gICAgfVxuICAgIHBvaW50ID0gc291cmNlLmludmVyc2UocG9pbnQpOyAvLyBDb252ZXJ0IENhcnRlc2lhbiB0byBsb25nbGF0XG4gICAgaWYgKCFwb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICAvLyBBZGp1c3QgZm9yIHRoZSBwcmltZSBtZXJpZGlhbiBpZiBuZWNlc3NhcnlcbiAgaWYgKHNvdXJjZS5mcm9tX2dyZWVud2ljaCkge1xuICAgIHBvaW50LnggKz0gc291cmNlLmZyb21fZ3JlZW53aWNoO1xuICB9XG5cbiAgLy8gQ29udmVydCBkYXR1bXMgaWYgbmVlZGVkLCBhbmQgaWYgcG9zc2libGUuXG4gIHBvaW50ID0gZGF0dW1fdHJhbnNmb3JtKHNvdXJjZS5kYXR1bSwgZGVzdC5kYXR1bSwgcG9pbnQpO1xuICBpZiAoIXBvaW50KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQWRqdXN0IGZvciB0aGUgcHJpbWUgbWVyaWRpYW4gaWYgbmVjZXNzYXJ5XG4gIGlmIChkZXN0LmZyb21fZ3JlZW53aWNoKSB7XG4gICAgcG9pbnQgPSB7XG4gICAgICB4OiBwb2ludC54IC0gZGVzdC5mcm9tX2dyZWVud2ljaCxcbiAgICAgIHk6IHBvaW50LnksXG4gICAgICB6OiBwb2ludC56IHx8IDBcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRlc3QucHJvak5hbWUgPT09ICdsb25nbGF0Jykge1xuICAgIC8vIGNvbnZlcnQgcmFkaWFucyB0byBkZWNpbWFsIGRlZ3JlZXNcbiAgICBwb2ludCA9IHtcbiAgICAgIHg6IHBvaW50LnggKiBSMkQsXG4gICAgICB5OiBwb2ludC55ICogUjJELFxuICAgICAgejogcG9pbnQueiB8fCAwXG4gICAgfTtcbiAgfSBlbHNlIHsgLy8gZWxzZSBwcm9qZWN0XG4gICAgcG9pbnQgPSBkZXN0LmZvcndhcmQocG9pbnQpO1xuICAgIGlmIChkZXN0LnRvX21ldGVyKSB7XG4gICAgICBwb2ludCA9IHtcbiAgICAgICAgeDogcG9pbnQueCAvIGRlc3QudG9fbWV0ZXIsXG4gICAgICAgIHk6IHBvaW50LnkgLyBkZXN0LnRvX21ldGVyLFxuICAgICAgICB6OiBwb2ludC56IHx8IDBcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLy8gREdSLCAyMDEwLzExLzEyXG4gIGlmIChlbmZvcmNlQXhpcyAmJiBkZXN0LmF4aXMgIT09ICdlbnUnKSB7XG4gICAgcmV0dXJuIGFkanVzdF9heGlzKGRlc3QsIHRydWUsIHBvaW50KTtcbiAgfVxuXG4gIHJldHVybiBwb2ludDtcbn1cbiIsImltcG9ydCB0bWVyYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy90bWVyYyc7XG5pbXBvcnQgZXRtZXJjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2V0bWVyYyc7XG5pbXBvcnQgdXRtIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3V0bSc7XG5pbXBvcnQgc3RlcmVhIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3N0ZXJlYSc7XG5pbXBvcnQgc3RlcmUgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvc3RlcmUnO1xuaW1wb3J0IHNvbWVyYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9zb21lcmMnO1xuaW1wb3J0IG9tZXJjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL29tZXJjJztcbmltcG9ydCBsY2MgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbGNjJztcbmltcG9ydCBrcm92YWsgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMva3JvdmFrJztcbmltcG9ydCBjYXNzIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2Nhc3MnO1xuaW1wb3J0IGxhZWEgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbGFlYSc7XG5pbXBvcnQgYWVhIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL2FlYSc7XG5pbXBvcnQgZ25vbSBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9nbm9tJztcbmltcG9ydCBjZWEgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvY2VhJztcbmltcG9ydCBlcWMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZXFjJztcbmltcG9ydCBwb2x5IGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3BvbHknO1xuaW1wb3J0IG56bWcgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbnptZyc7XG5pbXBvcnQgbWlsbCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9taWxsJztcbmltcG9ydCBzaW51IGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3NpbnUnO1xuaW1wb3J0IG1vbGwgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvbW9sbCc7XG5pbXBvcnQgZXFkYyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9lcWRjJztcbmltcG9ydCB2YW5kZyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy92YW5kZyc7XG5pbXBvcnQgYWVxZCBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9hZXFkJztcbmltcG9ydCBvcnRobyBmcm9tICcuL2xpYi9wcm9qZWN0aW9ucy9vcnRobyc7XG5pbXBvcnQgcXNjIGZyb20gJy4vbGliL3Byb2plY3Rpb25zL3FzYyc7XG5pbXBvcnQgcm9iaW4gZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvcm9iaW4nO1xuaW1wb3J0IGdlb2NlbnQgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvZ2VvY2VudCc7XG5pbXBvcnQgdHBlcnMgZnJvbSAnLi9saWIvcHJvamVjdGlvbnMvdHBlcnMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocHJvajQpe1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZCh0bWVyYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGV0bWVyYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHV0bSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHN0ZXJlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHN0ZXJlKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoc29tZXJjKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQob21lcmMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChsY2MpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChrcm92YWspO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChjYXNzKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobGFlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGFlYSk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGdub20pO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChjZWEpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChlcWMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChwb2x5KTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobnptZyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKG1pbGwpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChzaW51KTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQobW9sbCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGVxZGMpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZCh2YW5kZyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKGFlcWQpO1xuICBwcm9qNC5Qcm9qLnByb2plY3Rpb25zLmFkZChvcnRobyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHFzYyk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHJvYmluKTtcbiAgcHJvajQuUHJvai5wcm9qZWN0aW9ucy5hZGQoZ2VvY2VudCk7XG4gIHByb2o0LlByb2oucHJvamVjdGlvbnMuYWRkKHRwZXJzKTtcbn0iLCJ2YXIgRDJSID0gMC4wMTc0NTMyOTI1MTk5NDMyOTU3NztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IHtzRXhwcn0gZnJvbSAnLi9wcm9jZXNzJztcblxuXG5cbmZ1bmN0aW9uIHJlbmFtZShvYmosIHBhcmFtcykge1xuICB2YXIgb3V0TmFtZSA9IHBhcmFtc1swXTtcbiAgdmFyIGluTmFtZSA9IHBhcmFtc1sxXTtcbiAgaWYgKCEob3V0TmFtZSBpbiBvYmopICYmIChpbk5hbWUgaW4gb2JqKSkge1xuICAgIG9ialtvdXROYW1lXSA9IG9ialtpbk5hbWVdO1xuICAgIGlmIChwYXJhbXMubGVuZ3RoID09PSAzKSB7XG4gICAgICBvYmpbb3V0TmFtZV0gPSBwYXJhbXNbMl0ob2JqW291dE5hbWVdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZDJyKGlucHV0KSB7XG4gIHJldHVybiBpbnB1dCAqIEQyUjtcbn1cblxuZnVuY3Rpb24gY2xlYW5XS1Qod2t0KSB7XG4gIGlmICh3a3QudHlwZSA9PT0gJ0dFT0dDUycpIHtcbiAgICB3a3QucHJvak5hbWUgPSAnbG9uZ2xhdCc7XG4gIH0gZWxzZSBpZiAod2t0LnR5cGUgPT09ICdMT0NBTF9DUycpIHtcbiAgICB3a3QucHJvak5hbWUgPSAnaWRlbnRpdHknO1xuICAgIHdrdC5sb2NhbCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiB3a3QuUFJPSkVDVElPTiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHdrdC5wcm9qTmFtZSA9IE9iamVjdC5rZXlzKHdrdC5QUk9KRUNUSU9OKVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2t0LnByb2pOYW1lID0gd2t0LlBST0pFQ1RJT047XG4gICAgfVxuICB9XG4gIGlmICh3a3QuQVhJUykge1xuICAgIHZhciBheGlzT3JkZXIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMCwgaWkgPSB3a3QuQVhJUy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICB2YXIgYXhpcyA9IFt3a3QuQVhJU1tpXVswXS50b0xvd2VyQ2FzZSgpLCB3a3QuQVhJU1tpXVsxXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgIGlmIChheGlzWzBdLmluZGV4T2YoJ25vcnRoJykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3knIHx8IGF4aXNbMF0gPT09ICdsYXQnKSAmJiBheGlzWzFdID09PSAnbm9ydGgnKSkge1xuICAgICAgICBheGlzT3JkZXIgKz0gJ24nO1xuICAgICAgfSBlbHNlIGlmIChheGlzWzBdLmluZGV4T2YoJ3NvdXRoJykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3knIHx8IGF4aXNbMF0gPT09ICdsYXQnKSAmJiBheGlzWzFdID09PSAnc291dGgnKSkge1xuICAgICAgICBheGlzT3JkZXIgKz0gJ3MnO1xuICAgICAgfSBlbHNlIGlmIChheGlzWzBdLmluZGV4T2YoJ2Vhc3QnKSAhPT0gLTEgfHwgKChheGlzWzBdID09PSAneCcgfHwgYXhpc1swXSA9PT0gJ2xvbicpICYmIGF4aXNbMV0gPT09ICdlYXN0JykpIHtcbiAgICAgICAgYXhpc09yZGVyICs9ICdlJztcbiAgICAgIH0gZWxzZSBpZiAoYXhpc1swXS5pbmRleE9mKCd3ZXN0JykgIT09IC0xIHx8ICgoYXhpc1swXSA9PT0gJ3gnIHx8IGF4aXNbMF0gPT09ICdsb24nKSAmJiBheGlzWzFdID09PSAnd2VzdCcpKSB7XG4gICAgICAgIGF4aXNPcmRlciArPSAndyc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChheGlzT3JkZXIubGVuZ3RoID09PSAyKSB7XG4gICAgICBheGlzT3JkZXIgKz0gJ3UnO1xuICAgIH1cbiAgICBpZiAoYXhpc09yZGVyLmxlbmd0aCA9PT0gMykge1xuICAgICAgd2t0LmF4aXMgPSBheGlzT3JkZXI7XG4gICAgfVxuICB9XG4gIGlmICh3a3QuVU5JVCkge1xuICAgIHdrdC51bml0cyA9IHdrdC5VTklULm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAod2t0LnVuaXRzID09PSAnbWV0cmUnKSB7XG4gICAgICB3a3QudW5pdHMgPSAnbWV0ZXInO1xuICAgIH1cbiAgICBpZiAod2t0LlVOSVQuY29udmVydCkge1xuICAgICAgaWYgKHdrdC50eXBlID09PSAnR0VPR0NTJykge1xuICAgICAgICBpZiAod2t0LkRBVFVNICYmIHdrdC5EQVRVTS5TUEhFUk9JRCkge1xuICAgICAgICAgIHdrdC50b19tZXRlciA9IHdrdC5VTklULmNvbnZlcnQqd2t0LkRBVFVNLlNQSEVST0lELmE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdrdC50b19tZXRlciA9IHdrdC5VTklULmNvbnZlcnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHZhciBnZW9nY3MgPSB3a3QuR0VPR0NTO1xuICBpZiAod2t0LnR5cGUgPT09ICdHRU9HQ1MnKSB7XG4gICAgZ2VvZ2NzID0gd2t0O1xuICB9XG4gIGlmIChnZW9nY3MpIHtcbiAgICAvL2lmKHdrdC5HRU9HQ1MuUFJJTUVNJiZ3a3QuR0VPR0NTLlBSSU1FTS5jb252ZXJ0KXtcbiAgICAvLyAgd2t0LmZyb21fZ3JlZW53aWNoPXdrdC5HRU9HQ1MuUFJJTUVNLmNvbnZlcnQqRDJSO1xuICAgIC8vfVxuICAgIGlmIChnZW9nY3MuREFUVU0pIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSBnZW9nY3MuREFUVU0ubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gZ2VvZ2NzLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUuc2xpY2UoMCwgMikgPT09ICdkXycpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSB3a3QuZGF0dW1Db2RlLnNsaWNlKDIpO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ25ld196ZWFsYW5kX2dlb2RldGljX2RhdHVtXzE5NDknIHx8IHdrdC5kYXR1bUNvZGUgPT09ICduZXdfemVhbGFuZF8xOTQ5Jykge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICduemdkNDknO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZSA9PT0gJ3dnc18xOTg0JyB8fCB3a3QuZGF0dW1Db2RlID09PSAnd29ybGRfZ2VvZGV0aWNfc3lzdGVtXzE5ODQnKSB7XG4gICAgICBpZiAod2t0LlBST0pFQ1RJT04gPT09ICdNZXJjYXRvcl9BdXhpbGlhcnlfU3BoZXJlJykge1xuICAgICAgICB3a3Quc3BoZXJlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnd2dzODQnO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZS5zbGljZSgtNikgPT09ICdfZmVycm8nKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gd2t0LmRhdHVtQ29kZS5zbGljZSgwLCAtIDYpO1xuICAgIH1cbiAgICBpZiAod2t0LmRhdHVtQ29kZS5zbGljZSgtOCkgPT09ICdfamFrYXJ0YScpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSB3a3QuZGF0dW1Db2RlLnNsaWNlKDAsIC0gOCk7XG4gICAgfVxuICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdiZWxnZScpKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ3JuYjcyJztcbiAgICB9XG4gICAgaWYgKGdlb2djcy5EQVRVTSAmJiBnZW9nY3MuREFUVU0uU1BIRVJPSUQpIHtcbiAgICAgIHdrdC5lbGxwcyA9IGdlb2djcy5EQVRVTS5TUEhFUk9JRC5uYW1lLnJlcGxhY2UoJ18xOScsICcnKS5yZXBsYWNlKC9bQ2NdbGFya2VcXF8xOC8sICdjbHJrJyk7XG4gICAgICBpZiAod2t0LmVsbHBzLnRvTG93ZXJDYXNlKCkuc2xpY2UoMCwgMTMpID09PSAnaW50ZXJuYXRpb25hbCcpIHtcbiAgICAgICAgd2t0LmVsbHBzID0gJ2ludGwnO1xuICAgICAgfVxuXG4gICAgICB3a3QuYSA9IGdlb2djcy5EQVRVTS5TUEhFUk9JRC5hO1xuICAgICAgd2t0LnJmID0gcGFyc2VGbG9hdChnZW9nY3MuREFUVU0uU1BIRVJPSUQucmYsIDEwKTtcbiAgICB9XG5cbiAgICBpZiAoZ2VvZ2NzLkRBVFVNICYmIGdlb2djcy5EQVRVTS5UT1dHUzg0KSB7XG4gICAgICB3a3QuZGF0dW1fcGFyYW1zID0gZ2VvZ2NzLkRBVFVNLlRPV0dTODQ7XG4gICAgfVxuICAgIGlmICh+d2t0LmRhdHVtQ29kZS5pbmRleE9mKCdvc2diXzE5MzYnKSkge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdvc2diMzYnO1xuICAgIH1cbiAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZignb3NuaV8xOTUyJykpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnb3NuaTUyJztcbiAgICB9XG4gICAgaWYgKH53a3QuZGF0dW1Db2RlLmluZGV4T2YoJ3RtNjUnKVxuICAgICAgfHwgfndrdC5kYXR1bUNvZGUuaW5kZXhPZignZ2VvZGV0aWNfZGF0dW1fb2ZfMTk2NScpKSB7XG4gICAgICB3a3QuZGF0dW1Db2RlID0gJ2lyZTY1JztcbiAgICB9XG4gICAgaWYgKHdrdC5kYXR1bUNvZGUgPT09ICdjaDE5MDMrJykge1xuICAgICAgd2t0LmRhdHVtQ29kZSA9ICdjaDE5MDMnO1xuICAgIH1cbiAgICBpZiAofndrdC5kYXR1bUNvZGUuaW5kZXhPZignaXNyYWVsJykpIHtcbiAgICAgIHdrdC5kYXR1bUNvZGUgPSAnaXNyOTMnO1xuICAgIH1cbiAgfVxuICBpZiAod2t0LmIgJiYgIWlzRmluaXRlKHdrdC5iKSkge1xuICAgIHdrdC5iID0gd2t0LmE7XG4gIH1cblxuICBmdW5jdGlvbiB0b01ldGVyKGlucHV0KSB7XG4gICAgdmFyIHJhdGlvID0gd2t0LnRvX21ldGVyIHx8IDE7XG4gICAgcmV0dXJuIGlucHV0ICogcmF0aW87XG4gIH1cbiAgdmFyIHJlbmFtZXIgPSBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIHJlbmFtZSh3a3QsIGEpO1xuICB9O1xuICB2YXIgbGlzdCA9IFtcbiAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCAnU3RhbmRhcmRfUGFyYWxsZWxfMSddLFxuICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMScsICdMYXRpdHVkZSBvZiAxc3Qgc3RhbmRhcmQgcGFyYWxsZWwnXSxcbiAgICBbJ3N0YW5kYXJkX3BhcmFsbGVsXzInLCAnU3RhbmRhcmRfUGFyYWxsZWxfMiddLFxuICAgIFsnc3RhbmRhcmRfcGFyYWxsZWxfMicsICdMYXRpdHVkZSBvZiAybmQgc3RhbmRhcmQgcGFyYWxsZWwnXSxcbiAgICBbJ2ZhbHNlX2Vhc3RpbmcnLCAnRmFsc2VfRWFzdGluZyddLFxuICAgIFsnZmFsc2VfZWFzdGluZycsICdGYWxzZSBlYXN0aW5nJ10sXG4gICAgWydmYWxzZS1lYXN0aW5nJywgJ0Vhc3RpbmcgYXQgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydmYWxzZV9ub3J0aGluZycsICdGYWxzZV9Ob3J0aGluZyddLFxuICAgIFsnZmFsc2Vfbm9ydGhpbmcnLCAnRmFsc2Ugbm9ydGhpbmcnXSxcbiAgICBbJ2ZhbHNlX25vcnRoaW5nJywgJ05vcnRoaW5nIGF0IGZhbHNlIG9yaWdpbiddLFxuICAgIFsnY2VudHJhbF9tZXJpZGlhbicsICdDZW50cmFsX01lcmlkaWFuJ10sXG4gICAgWydjZW50cmFsX21lcmlkaWFuJywgJ0xvbmdpdHVkZSBvZiBuYXR1cmFsIG9yaWdpbiddLFxuICAgIFsnY2VudHJhbF9tZXJpZGlhbicsICdMb25naXR1ZGUgb2YgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnTGF0aXR1ZGVfT2ZfT3JpZ2luJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnQ2VudHJhbF9QYXJhbGxlbCddLFxuICAgIFsnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgJ0xhdGl0dWRlIG9mIG5hdHVyYWwgb3JpZ2luJ10sXG4gICAgWydsYXRpdHVkZV9vZl9vcmlnaW4nLCAnTGF0aXR1ZGUgb2YgZmFsc2Ugb3JpZ2luJ10sXG4gICAgWydzY2FsZV9mYWN0b3InLCAnU2NhbGVfRmFjdG9yJ10sXG4gICAgWydrMCcsICdzY2FsZV9mYWN0b3InXSxcbiAgICBbJ2xhdGl0dWRlX29mX2NlbnRlcicsICdMYXRpdHVkZV9PZl9DZW50ZXInXSxcbiAgICBbJ2xhdGl0dWRlX29mX2NlbnRlcicsICdMYXRpdHVkZV9vZl9jZW50ZXInXSxcbiAgICBbJ2xhdDAnLCAnbGF0aXR1ZGVfb2ZfY2VudGVyJywgZDJyXSxcbiAgICBbJ2xvbmdpdHVkZV9vZl9jZW50ZXInLCAnTG9uZ2l0dWRlX09mX0NlbnRlciddLFxuICAgIFsnbG9uZ2l0dWRlX29mX2NlbnRlcicsICdMb25naXR1ZGVfb2ZfY2VudGVyJ10sXG4gICAgWydsb25nYycsICdsb25naXR1ZGVfb2ZfY2VudGVyJywgZDJyXSxcbiAgICBbJ3gwJywgJ2ZhbHNlX2Vhc3RpbmcnLCB0b01ldGVyXSxcbiAgICBbJ3kwJywgJ2ZhbHNlX25vcnRoaW5nJywgdG9NZXRlcl0sXG4gICAgWydsb25nMCcsICdjZW50cmFsX21lcmlkaWFuJywgZDJyXSxcbiAgICBbJ2xhdDAnLCAnbGF0aXR1ZGVfb2Zfb3JpZ2luJywgZDJyXSxcbiAgICBbJ2xhdDAnLCAnc3RhbmRhcmRfcGFyYWxsZWxfMScsIGQycl0sXG4gICAgWydsYXQxJywgJ3N0YW5kYXJkX3BhcmFsbGVsXzEnLCBkMnJdLFxuICAgIFsnbGF0MicsICdzdGFuZGFyZF9wYXJhbGxlbF8yJywgZDJyXSxcbiAgICBbJ2F6aW11dGgnLCAnQXppbXV0aCddLFxuICAgIFsnYWxwaGEnLCAnYXppbXV0aCcsIGQycl0sXG4gICAgWydzcnNDb2RlJywgJ25hbWUnXVxuICBdO1xuICBsaXN0LmZvckVhY2gocmVuYW1lcik7XG4gIGlmICghd2t0LmxvbmcwICYmIHdrdC5sb25nYyAmJiAod2t0LnByb2pOYW1lID09PSAnQWxiZXJzX0NvbmljX0VxdWFsX0FyZWEnIHx8IHdrdC5wcm9qTmFtZSA9PT0gJ0xhbWJlcnRfQXppbXV0aGFsX0VxdWFsX0FyZWEnKSkge1xuICAgIHdrdC5sb25nMCA9IHdrdC5sb25nYztcbiAgfVxuICBpZiAoIXdrdC5sYXRfdHMgJiYgd2t0LmxhdDEgJiYgKHdrdC5wcm9qTmFtZSA9PT0gJ1N0ZXJlb2dyYXBoaWNfU291dGhfUG9sZScgfHwgd2t0LnByb2pOYW1lID09PSAnUG9sYXIgU3RlcmVvZ3JhcGhpYyAodmFyaWFudCBCKScpKSB7XG4gICAgd2t0LmxhdDAgPSBkMnIod2t0LmxhdDEgPiAwID8gOTAgOiAtOTApO1xuICAgIHdrdC5sYXRfdHMgPSB3a3QubGF0MTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24od2t0KSB7XG4gIHZhciBsaXNwID0gcGFyc2VyKHdrdCk7XG4gIHZhciB0eXBlID0gbGlzcC5zaGlmdCgpO1xuICB2YXIgbmFtZSA9IGxpc3Auc2hpZnQoKTtcbiAgbGlzcC51bnNoaWZ0KFsnbmFtZScsIG5hbWVdKTtcbiAgbGlzcC51bnNoaWZ0KFsndHlwZScsIHR5cGVdKTtcbiAgdmFyIG9iaiA9IHt9O1xuICBzRXhwcihsaXNwLCBvYmopO1xuICBjbGVhbldLVChvYmopO1xuICByZXR1cm4gb2JqO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgcGFyc2VTdHJpbmc7XG5cbnZhciBORVVUUkFMID0gMTtcbnZhciBLRVlXT1JEID0gMjtcbnZhciBOVU1CRVIgPSAzO1xudmFyIFFVT1RFRCA9IDQ7XG52YXIgQUZURVJRVU9URSA9IDU7XG52YXIgRU5ERUQgPSAtMTtcbnZhciB3aGl0ZXNwYWNlID0gL1xccy87XG52YXIgbGF0aW4gPSAvW0EtWmEtel0vO1xudmFyIGtleXdvcmQgPSAvW0EtWmEtejg0XS87XG52YXIgZW5kVGhpbmdzID0gL1ssXFxdXS87XG52YXIgZGlnZXRzID0gL1tcXGRcXC5FXFwtXFwrXS87XG4vLyBjb25zdCBpZ25vcmVkQ2hhciA9IC9bXFxzX1xcLVxcL1xcKFxcKV0vZztcbmZ1bmN0aW9uIFBhcnNlcih0ZXh0KSB7XG4gIGlmICh0eXBlb2YgdGV4dCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBhIHN0cmluZycpO1xuICB9XG4gIHRoaXMudGV4dCA9IHRleHQudHJpbSgpO1xuICB0aGlzLmxldmVsID0gMDtcbiAgdGhpcy5wbGFjZSA9IDA7XG4gIHRoaXMucm9vdCA9IG51bGw7XG4gIHRoaXMuc3RhY2sgPSBbXTtcbiAgdGhpcy5jdXJyZW50T2JqZWN0ID0gbnVsbDtcbiAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG59XG5QYXJzZXIucHJvdG90eXBlLnJlYWRDaGFyaWN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNoYXIgPSB0aGlzLnRleHRbdGhpcy5wbGFjZSsrXTtcbiAgaWYgKHRoaXMuc3RhdGUgIT09IFFVT1RFRCkge1xuICAgIHdoaWxlICh3aGl0ZXNwYWNlLnRlc3QoY2hhcikpIHtcbiAgICAgIGlmICh0aGlzLnBsYWNlID49IHRoaXMudGV4dC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2hhciA9IHRoaXMudGV4dFt0aGlzLnBsYWNlKytdO1xuICAgIH1cbiAgfVxuICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICBjYXNlIE5FVVRSQUw6XG4gICAgICByZXR1cm4gdGhpcy5uZXV0cmFsKGNoYXIpO1xuICAgIGNhc2UgS0VZV09SRDpcbiAgICAgIHJldHVybiB0aGlzLmtleXdvcmQoY2hhcilcbiAgICBjYXNlIFFVT1RFRDpcbiAgICAgIHJldHVybiB0aGlzLnF1b3RlZChjaGFyKTtcbiAgICBjYXNlIEFGVEVSUVVPVEU6XG4gICAgICByZXR1cm4gdGhpcy5hZnRlcnF1b3RlKGNoYXIpO1xuICAgIGNhc2UgTlVNQkVSOlxuICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKGNoYXIpO1xuICAgIGNhc2UgRU5ERUQ6XG4gICAgICByZXR1cm47XG4gIH1cbn07XG5QYXJzZXIucHJvdG90eXBlLmFmdGVycXVvdGUgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChjaGFyID09PSAnXCInKSB7XG4gICAgdGhpcy53b3JkICs9ICdcIic7XG4gICAgdGhpcy5zdGF0ZSA9IFFVT1RFRDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkID0gdGhpcy53b3JkLnRyaW0oKTtcbiAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBhZnRlcnF1b3RlIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xufTtcblBhcnNlci5wcm90b3R5cGUuYWZ0ZXJJdGVtID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoY2hhciA9PT0gJywnKSB7XG4gICAgaWYgKHRoaXMud29yZCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5jdXJyZW50T2JqZWN0LnB1c2godGhpcy53b3JkKTtcbiAgICB9XG4gICAgdGhpcy53b3JkID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gTkVVVFJBTDtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNoYXIgPT09ICddJykge1xuICAgIHRoaXMubGV2ZWwtLTtcbiAgICBpZiAodGhpcy53b3JkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmN1cnJlbnRPYmplY3QucHVzaCh0aGlzLndvcmQpO1xuICAgICAgdGhpcy53b3JkID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IE5FVVRSQUw7XG4gICAgdGhpcy5jdXJyZW50T2JqZWN0ID0gdGhpcy5zdGFjay5wb3AoKTtcbiAgICBpZiAoIXRoaXMuY3VycmVudE9iamVjdCkge1xuICAgICAgdGhpcy5zdGF0ZSA9IEVOREVEO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxufTtcblBhcnNlci5wcm90b3R5cGUubnVtYmVyID0gZnVuY3Rpb24oY2hhcikge1xuICBpZiAoZGlnZXRzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgKz0gY2hhcjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy53b3JkID0gcGFyc2VGbG9hdCh0aGlzLndvcmQpO1xuICAgIHRoaXMuYWZ0ZXJJdGVtKGNoYXIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ2hhdm5cXCd0IGhhbmRsZWQgXCInICtjaGFyICsgJ1wiIGluIG51bWJlciB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcbn07XG5QYXJzZXIucHJvdG90eXBlLnF1b3RlZCA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGNoYXIgPT09ICdcIicpIHtcbiAgICB0aGlzLnN0YXRlID0gQUZURVJRVU9URTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy53b3JkICs9IGNoYXI7XG4gIHJldHVybjtcbn07XG5QYXJzZXIucHJvdG90eXBlLmtleXdvcmQgPSBmdW5jdGlvbihjaGFyKSB7XG4gIGlmIChrZXl3b3JkLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgKz0gY2hhcjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGNoYXIgPT09ICdbJykge1xuICAgIHZhciBuZXdPYmplY3RzID0gW107XG4gICAgbmV3T2JqZWN0cy5wdXNoKHRoaXMud29yZCk7XG4gICAgdGhpcy5sZXZlbCsrO1xuICAgIGlmICh0aGlzLnJvb3QgPT09IG51bGwpIHtcbiAgICAgIHRoaXMucm9vdCA9IG5ld09iamVjdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudE9iamVjdC5wdXNoKG5ld09iamVjdHMpO1xuICAgIH1cbiAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5jdXJyZW50T2JqZWN0KTtcbiAgICB0aGlzLmN1cnJlbnRPYmplY3QgPSBuZXdPYmplY3RzO1xuICAgIHRoaXMuc3RhdGUgPSBORVVUUkFMO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZW5kVGhpbmdzLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLmFmdGVySXRlbShjaGFyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdoYXZuXFwndCBoYW5kbGVkIFwiJyArY2hhciArICdcIiBpbiBrZXl3b3JkIHlldCwgaW5kZXggJyArIHRoaXMucGxhY2UpO1xufTtcblBhcnNlci5wcm90b3R5cGUubmV1dHJhbCA9IGZ1bmN0aW9uKGNoYXIpIHtcbiAgaWYgKGxhdGluLnRlc3QoY2hhcikpIHtcbiAgICB0aGlzLndvcmQgPSBjaGFyO1xuICAgIHRoaXMuc3RhdGUgPSBLRVlXT1JEO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoY2hhciA9PT0gJ1wiJykge1xuICAgIHRoaXMud29yZCA9ICcnO1xuICAgIHRoaXMuc3RhdGUgPSBRVU9URUQ7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChkaWdldHMudGVzdChjaGFyKSkge1xuICAgIHRoaXMud29yZCA9IGNoYXI7XG4gICAgdGhpcy5zdGF0ZSA9IE5VTUJFUjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVuZFRoaW5ncy50ZXN0KGNoYXIpKSB7XG4gICAgdGhpcy5hZnRlckl0ZW0oY2hhcik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcignaGF2blxcJ3QgaGFuZGxlZCBcIicgK2NoYXIgKyAnXCIgaW4gbmV1dHJhbCB5ZXQsIGluZGV4ICcgKyB0aGlzLnBsYWNlKTtcbn07XG5QYXJzZXIucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKCkge1xuICB3aGlsZSAodGhpcy5wbGFjZSA8IHRoaXMudGV4dC5sZW5ndGgpIHtcbiAgICB0aGlzLnJlYWRDaGFyaWN0ZXIoKTtcbiAgfVxuICBpZiAodGhpcy5zdGF0ZSA9PT0gRU5ERUQpIHtcbiAgICByZXR1cm4gdGhpcy5yb290O1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIHBhcnNlIHN0cmluZyBcIicgK3RoaXMudGV4dCArICdcIi4gU3RhdGUgaXMgJyArIHRoaXMuc3RhdGUpO1xufTtcblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcodHh0KSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKHR4dCk7XG4gIHJldHVybiBwYXJzZXIub3V0cHV0KCk7XG59XG4iLCJcblxuZnVuY3Rpb24gbWFwaXQob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICB2YWx1ZS51bnNoaWZ0KGtleSk7XG4gICAga2V5ID0gbnVsbDtcbiAgfVxuICB2YXIgdGhpbmcgPSBrZXkgPyB7fSA6IG9iajtcblxuICB2YXIgb3V0ID0gdmFsdWUucmVkdWNlKGZ1bmN0aW9uKG5ld09iaiwgaXRlbSkge1xuICAgIHNFeHByKGl0ZW0sIG5ld09iaik7XG4gICAgcmV0dXJuIG5ld09ialxuICB9LCB0aGluZyk7XG4gIGlmIChrZXkpIHtcbiAgICBvYmpba2V5XSA9IG91dDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc0V4cHIodiwgb2JqKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh2KSkge1xuICAgIG9ialt2XSA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBrZXkgPSB2LnNoaWZ0KCk7XG4gIGlmIChrZXkgPT09ICdQQVJBTUVURVInKSB7XG4gICAga2V5ID0gdi5zaGlmdCgpO1xuICB9XG4gIGlmICh2Lmxlbmd0aCA9PT0gMSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZbMF0pKSB7XG4gICAgICBvYmpba2V5XSA9IHt9O1xuICAgICAgc0V4cHIodlswXSwgb2JqW2tleV0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvYmpba2V5XSA9IHZbMF07XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghdi5sZW5ndGgpIHtcbiAgICBvYmpba2V5XSA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChrZXkgPT09ICdUT1dHUzg0Jykge1xuICAgIG9ialtrZXldID0gdjtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGtleSA9PT0gJ0FYSVMnKSB7XG4gICAgaWYgKCEoa2V5IGluIG9iaikpIHtcbiAgICAgIG9ialtrZXldID0gW107XG4gICAgfVxuICAgIG9ialtrZXldLnB1c2godik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgb2JqW2tleV0gPSB7fTtcbiAgfVxuXG4gIHZhciBpO1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgJ1VOSVQnOlxuICAgIGNhc2UgJ1BSSU1FTSc6XG4gICAgY2FzZSAnVkVSVF9EQVRVTSc6XG4gICAgICBvYmpba2V5XSA9IHtcbiAgICAgICAgbmFtZTogdlswXS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBjb252ZXJ0OiB2WzFdXG4gICAgICB9O1xuICAgICAgaWYgKHYubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHNFeHByKHZbMl0sIG9ialtrZXldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdTUEhFUk9JRCc6XG4gICAgY2FzZSAnRUxMSVBTT0lEJzpcbiAgICAgIG9ialtrZXldID0ge1xuICAgICAgICBuYW1lOiB2WzBdLFxuICAgICAgICBhOiB2WzFdLFxuICAgICAgICByZjogdlsyXVxuICAgICAgfTtcbiAgICAgIGlmICh2Lmxlbmd0aCA9PT0gNCkge1xuICAgICAgICBzRXhwcih2WzNdLCBvYmpba2V5XSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgY2FzZSAnUFJPSkVDVEVEQ1JTJzpcbiAgICBjYXNlICdQUk9KQ1JTJzpcbiAgICBjYXNlICdHRU9HQ1MnOlxuICAgIGNhc2UgJ0dFT0NDUyc6XG4gICAgY2FzZSAnUFJPSkNTJzpcbiAgICBjYXNlICdMT0NBTF9DUyc6XG4gICAgY2FzZSAnR0VPRENSUyc6XG4gICAgY2FzZSAnR0VPREVUSUNDUlMnOlxuICAgIGNhc2UgJ0dFT0RFVElDREFUVU0nOlxuICAgIGNhc2UgJ0VEQVRVTSc6XG4gICAgY2FzZSAnRU5HSU5FRVJJTkdEQVRVTSc6XG4gICAgY2FzZSAnVkVSVF9DUyc6XG4gICAgY2FzZSAnVkVSVENSUyc6XG4gICAgY2FzZSAnVkVSVElDQUxDUlMnOlxuICAgIGNhc2UgJ0NPTVBEX0NTJzpcbiAgICBjYXNlICdDT01QT1VORENSUyc6XG4gICAgY2FzZSAnRU5HSU5FRVJJTkdDUlMnOlxuICAgIGNhc2UgJ0VOR0NSUyc6XG4gICAgY2FzZSAnRklUVEVEX0NTJzpcbiAgICBjYXNlICdMT0NBTF9EQVRVTSc6XG4gICAgY2FzZSAnREFUVU0nOlxuICAgICAgdlswXSA9IFsnbmFtZScsIHZbMF1dO1xuICAgICAgbWFwaXQob2JqLCBrZXksIHYpO1xuICAgICAgcmV0dXJuO1xuICAgIGRlZmF1bHQ6XG4gICAgICBpID0gLTE7XG4gICAgICB3aGlsZSAoKytpIDwgdi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHNFeHByKHYsIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1hcGl0KG9iaiwga2V5LCB2KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==