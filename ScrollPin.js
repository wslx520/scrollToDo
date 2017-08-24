/**
 * @file ScrollToDo.js
 * @author XLee
 *
 * 滚动时切换固定到顶部，依赖于ScrollToDo
 */
(function (factory) {
    if ("function" === typeof define) {
        define(function (require) {
            return factory(require('./ScrollToDo'));
        });
    }
    else {
        window.ScrollPin = factory(ScrollToDo);
    }
})(function (ScrollToDo) {

    function ScrollPin(ops) {
        var root = this;
        // 需要切换至fixed定位的容器
        root.pinner = ops.pinner;
        // 距顶边多少时，切换定位
        root.boundary = ops.boundary || 300;
        // 是否处于固定定位状态
        root.isPin = ops.isPin || false;
        // 自定义固定定位的className
        root.className = ops.className || 'fixed-top';
        // 结合iscroll使用
        var scroller = root.scroller = ops.scroller || window;
        // 如果初始化时就为固定状态，则加上classname
        if (root.isPin) {
            $(root.pinner).addClass(root.className);
        }
        var onScroll = function (directions) {
            // console.log(directions, this.scrollTop, root.boundary);
            if (directions.Y === 1 && this.scrollTop > root.boundary && !root.isPin) {
                $(root.pinner).addClass(root.className);
                root.isPin = true;
                ops.ontoggle && ops.ontoggle.call(root);
            }
            else if (directions.Y === -1 && this.scrollTop < root.boundary && root.isPin) {
                $(root.pinner).removeClass(root.className);
                root.isPin = false;
                ops.ontoggle && ops.ontoggle.call(root);
            }
        };

        var scrollToToggle = scroller.on ? scroller : new ScrollToDo({
            scroller: scroller
        });
        root.scroller = scrollToToggle;
        scrollToToggle.on('scroll', onScroll);
    }
    return ScrollPin;
});
