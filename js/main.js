/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1)


	var content = document.querySelector('.content');
	// 缓存所有移动块
	var cubes = [];
	// 缓存指令
	var order = ['Up','Down','Left','Right'];
	// 计时开始、结束时间
	var startTime = 0;
	var endTime;
	// 最佳成绩
	var bestRecord;
	// 级别选择
	var level = {
	    // 区域总长度
	    width: 450,
	    // 移动增量
	    moveTemp: 150,
	    // 方块个数
	    cubesNum: 3
	};

	init();
	/**
	 * 初始化函数
	 */
	function init() {
	    // 每次初始化
	    var width = level.width;
	    var moveTemp = level.moveTemp;
	    cubes = document.querySelectorAll(".pic");
	    var cubesNum = level.cubesNum;
	    var divs = document.querySelectorAll('.content div');

	    for (var i = 0; i < divs.length; i++) {
	        divs[i].style.left = '';
	        divs[i].style.top = '';
	        divs[i].style.width = level.moveTemp+'px';
	        divs[i].style.height = level.moveTemp+'px';
	    };
	    divs[0].attributes.style="top:0px;left:0px";
	    // 设置方块背景
	    for (var i = 0,ii = cubes.length;i<ii;i++) {
	        // 设置背景，第一块不设置背景
	        if(i>0)cubes[i].style.backgroundImage = "url('img/bg.jpg')";
	        cubes[i].style.backgroundSize = width+"px "+ width+"px";
	        var positionX = (i%cubesNum)*(-moveTemp) + 'px ';
	        var positionY = parseInt(i/cubesNum)*(-moveTemp) + 'px';
	        cubes[i].style.backgroundPosition = positionX+positionY;
	    }
	    document.querySelector('.main').style.width = level.width+'px';
	    // 打乱方块
	    setTimeout(function(){
	        for (var i = 150; i >= 0; i--) {
	            var randomI = parseInt(Math.random()*order.length);
	            cubeMove(order[randomI],'init');
	            startTime = new Date().getTime();
	        }
	     },0);
	};

	/**
	 * 按键事件绑定
	 * left: 37
	 * up : 38
	 * right: 39
	 * down : 40 
	 */
	document.body.addEventListener('keydown',function(event){
	    event.preventDefault();
	    cubeMove(event.keyIdentifier);
	},false);
	document.querySelector('#refresh').addEventListener('click',function(event){
	    init();
	},false);
	document.querySelector('#level').addEventListener('change', function(event){
	    var content = document.querySelector(".content");
	    if (event.target.value === 'normal') {
	        level.width = 450;
	        level.moveTemp = 150;
	        level.cubesNum = 3;
	        content.style.height = 450+'px';
	        init();
	    }
	    if (event.target.value === 'hard') {
	        level.width = 452;
	        level.moveTemp = 113;
	        level.cubesNum = 4;
	        content.style.height = 'auto';
	        init();
	    }
	    // 初始化最佳记录
	    bestRecord = 0;
	    document.getElementById('best-record').value = '';
	},false)

	/**
	 * 拼块移动主要逻辑方法
	 * 移动方块其实是标志位方块的移动，再判断周围
	 * 是否存在合法方块填充到标志位方块移动前的位置
	 * @param  {type}
	 */
	function cubeMove (type) {
	    // 标志位方块
	    var flagCube = cubes[0];
	    // 标志位当前位置
	    var flagPosition = {};
	    // 标志位变化位置
	    var changePosition;
	    // 移动目标方块
	    var targetCube;
	    var targetCubeTop;
	    var targetCubeLeft;
	    // 每次移动的偏移量
	    var moveTemp = level.moveTemp;
	    var width = level.width;
	    switch(type) {
	        case 'Up':
	            changePosition = flagCube.offsetTop + moveTemp;
	            // 判断是否出界
	            if(changePosition >= width) return false;
	            // 首先移动flagCube标志位
	            flagCube.style.top = changePosition + 'px';
	            // 获得位置需要变换的合法方块
	            targetCube = getValidCube();
	            targetCubeTop = (targetCube.style.top || '0px');
	            targetCubeTop = parseInt(targetCubeTop.substr(0,targetCubeTop.length-2))-moveTemp;
	            targetCube.style.top = targetCubeTop + 'px';
	            break;
	        case 'Down':
	            changePosition = flagCube.offsetTop - moveTemp;
	            if(changePosition < 0) return false;
	            flagCube.style.top = changePosition + 'px';
	            targetCube = getValidCube();
	            targetCubeTop = (targetCube.style.top || '0px');
	            targetCubeTop = parseInt(targetCubeTop.substr(0,targetCubeTop.length-2))+moveTemp;
	            targetCube.style.top = targetCubeTop + 'px';
	            break;
	        case 'Right':
	            changePosition = flagCube.offsetLeft - moveTemp;
	            if(changePosition < 0) return false;
	            flagCube.style.left = changePosition + 'px';
	            targetCube = getValidCube();
	            targetCubeLeft = (targetCube.style.left || '0px');
	            targetCubeLeft = parseInt(targetCubeLeft.substr(0,targetCubeLeft.length-2))+moveTemp;
	            targetCube.style.left = targetCubeLeft + 'px';
	            break;
	        case 'Left':
	            changePosition = flagCube.offsetLeft + moveTemp;
	            if(changePosition >= width) return false;
	            flagCube.style.left = changePosition + 'px';
	            targetCube = getValidCube();
	            targetCubeLeft = (targetCube.style.left || '0px');
	            targetCubeLeft = parseInt(targetCubeLeft.substr(0,targetCubeLeft.length-2))-moveTemp;
	            targetCube.style.left = targetCubeLeft + 'px';
	            break;
	        default: 
	            break;
	    }
	    // 初始化时会调用该移动函数，但初始化时arguments.length == 2
	    if(isFinish()&&arguments.length<2) {
	        endTime = new Date().getTime();
	        var timeDuring = new Number((endTime - startTime)/1000).toFixed(2);
	        if (!bestRecord || (bestRecord&&timeDuring < bestRecord)) {
	            document.getElementById('best-record').value = timeDuring;
	            bestRecord = timeDuring;
	        }
	        startTime = new Date().getTime();
	        alert('完成,共用时'+timeDuring+'秒');
	    } 
	}

	/**
	 * 获得合法的移动方块
	 * @return {object} 合法的dom节点
	 */
	function getValidCube () {
	    var left = cubes[0].offsetLeft;
	    var top = cubes[0].offsetTop;
	    for (var i = 1,ii = cubes.length;i<ii; i++) {
	        if (cubes[i].offsetTop === top && cubes[i].offsetLeft === left) {
	            return cubes[i];
	        }
	    }
	}

	/**
	 * 判断是否完成
	 * @return {Boolean} [description]
	 */
	function isFinish () {
	    var isfinish = true;
	    var cubesNum = level.cubesNum;
	    var moveTemp = level.moveTemp;
	    for (var i = cubes.length - 1; i >= 0; i--) {
	        var left = cubes[i].offsetLeft;
	        var top = cubes[i].offsetTop;
	        isfinish = isfinish && (left == (i%cubesNum)*moveTemp && top == parseInt(i/cubesNum)*moveTemp);
	    };
	    return isfinish;
	}




/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./main.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./main.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "body {\n  background-color: #eee;\n}\n.main {\n  position: relative;\n  margin: 0 auto;\n  width: 450px;\n  border: 1px solid black;\n}\n.main .content {\n  position: relative;\n  height: 450px;\n  overflow: hidden;\n}\n.main .content div {\n  border: 1px solid black;\n  box-sizing: border-box;\n  position: relative;\n  width: 150px;\n  height: 150px;\n  display: inline-block;\n  text-indent: -999px;\n}\n.main .control-board {\n  position: relative;\n}\n.main .control-board img {\n  display: block;\n  margin: 5px auto;\n  border-radius: 10px;\n}\n#refresh {\n  position: absolute;\n  top: 50%;\n  left: 9%;\n}\n#level {\n  position: absolute;\n  top: 35%;\n  left: 67%;\n}\n#best-record {\n  width: 50px;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);