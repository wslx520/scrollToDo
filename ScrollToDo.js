/**
 * @file 添加滚动事件监听。支持上下左右4个方向的滚动事件添加。
 * @author XLee
 * @param {Object} ops。一个对象
 */
(function (factory) {
    if ("function" === typeof define) {
        define(factory);
    }
    else {
        window.ScrollToDo = factory();
    }
})(function () {
    var types = {
        'scrollbottom': 1, 'scrolltop': 1, 'scrollleft': 1, 'scrollright': 1, 'scroll': 1
    };
    // 根据 scroller 返回一个能正确获取 scrollTop 与 scrollLeft 的函数
    var toGetScroll = function (scroller) {
        if (scroller === window || scroller === document.body || scroller === document.documentElement) {
            if (typeof window.pageYOffset === 'undefined') {
                return function () {
                    return {
                        scrollLeft: Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
                        scrollTop: Math.max(document.documentElement.scrollTop, document.body.scrollTop)
                    }
                }
            }
            return function () {
                return {
                    scrollLeft: window.pageXOffset,
                    scrollTop: window.pageYOffset
                }
            }
        }
        return function () {
            return {
                scrollLeft: scroller.scrollLeft,
                scrollTop: scroller.scrollTop
            }
        }
    };
    function ScrollToDo(ops) {
        var root = this;
        root.scroller = typeof ops.scroller === 'string' ? document.querySelector(ops.scroller) : ops.scroller;
        var bindTo = root.scroller;
        if (root.scroller.length) {
            root.scroller = root.scroller[0];
        }
        var scroller = root.scroller;
        var getScroll = toGetScroll(scroller);
        // scroll 事件节流器 timer
        var _timer = null;
        // var callbackPrefix = '__';
        root.callbacks = {};
        // 支持以下事件监听
        // var events = ['scrollBottom', 'scrollTop', 'scrollLeft', 'scrollRight', 'scroll'];
        root.directions = {X: 0, Y: 0};
        root.getDirection = function () {
            var lastScrollTop = scroller.lastScrollTop || 0;
            var lastScrollLeft = scroller.lastScrollLeft || 0;
            // 1为向右，-1为向左
            var X = 0;
            // 1为向下，-1为向上
            var Y = 0;
            var scrolls = root.scrolls = getScroll();
            var _scrollTop = scrolls.scrollTop;
            var _scrollLeft = scrolls.scrollLeft;
            if (_scrollTop - lastScrollTop > 0) {
                Y = 1;
            }
            else if (_scrollTop - lastScrollTop < 0) {
                Y = -1;
            }
            if (_scrollLeft - lastScrollLeft > 0) {
                X = 1;
            }
            else if (_scrollLeft - lastScrollLeft < 0) {
                X = -1;
            }
            setTimeout(function () {
                scroller.lastScrollTop = _scrollTop;
                scroller.lastScrollLeft = _scrollLeft;
            }, 0);


            return {
                X: X,
                Y: Y
            };
        };
        // document.documentElement 并没有 onscroll事件；document.body 的 onscroll 兼容性也不好
        // 所以，若 scroller 是 document.documentElement 或 body 时，则将 onscroll 监听加在 window 上
        if (scroller === document.body || scroller === document.documentElement) {
            bindTo = window;
        }
        bindTo.addEventListener('scroll', function () {
            window.clearTimeout(_timer);
            _timer = setTimeout(function () {
                var directions = root.directions = root.getDirection();
                var directionX = directions.X;
                var directionY = directions.Y;
                root.scrollTop = root.scrolls.scrollTop;
                root.scrollLeft = root.scrolls.scrollLeft;
                if (directionY === -1) {
                    root.fire('scrolltop');
                }
                else if (directionY === 1) {
                    root.fire('scrollbottom');
                }
                if (directionX === -1) {
                    root.fire('scrollleft');
                }
                else if (directionX === 1) {
                    root.fire('scrollright');
                }
                root.fire('scroll');
            }, 20);            
        });
    }
    ScrollToDo.prototype = {
        on: function (eventType, callback) {
            eventType = eventType.toLowerCase();
            if (!types[eventType]) {
                throw new Error('不支持监听此类事件：' + eventType);
            }
            var prefixType = '__' + eventType;
            if (!this.callbacks[prefixType]) {
                this.callbacks[prefixType] = [];
            }
            var callbacksOfEvent = this.callbacks[prefixType];
            callbacksOfEvent.push(callback);
            return this;
        },
        fire: function (eventType) {
            var root = this;
            var callbacksOfEvent = this.callbacks['__' + eventType];
            if (callbacksOfEvent && callbacksOfEvent.length) {
                // 使用for循环而不用forEach
                for (var i = 0; i < callbacksOfEvent.length; i++) {
                    callbacksOfEvent[i].call(root, root.directions);
                }
            }
            return this;
        }
    };
    return ScrollToDo;
});


