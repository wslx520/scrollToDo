# ScrollToDo

人如其名。用来监听scroll事件并执行对应代码，支持上下左右 4 个方向，即: 

`'scrollBottom', 'scrollTop', 'scrollLeft', 'scrollRight', 'scroll'`

4个方向的事件监听。

可多次监听同一方向。但对传入的监听函数没有去重（即监听两个scrollBottom且传入两个一样的函数，都会执行）

实现方式简单粗暴。无依赖。

有函数节流器，优化滚动时性能

示例请打开 `index.html` 查看

比如实现一个 scroll to toggle pin 效果（使用了jQuery）：

    var scrollPin = new ScrollToDo({
            scroller: window
        }).on('scroll', function (directions) {
            var _scroller = this.scroller;
            // 这个表示当滚动距离超过此值时，发生变化
            var boundary = 200;
            var pinClass = 'fixed-top';
            var pinner = $('#true-fixed');
            var isPin = pinner.hasClass(pinClass);
            if (directions.Y === 1 && this.scrollTop > boundary && !isPin) {
                pinner.addClass(pinClass);
            }
            else if (directions.Y === -1 && this.scrollTop < boundary && isPin) {
                pinner.removeClass(pinClass);
            }
        });



