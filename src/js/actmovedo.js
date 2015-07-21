var actMoveDo = actMoveDo || (function($) {
    "use strict";

        function ActMoveDo(settings) {

            this.settings = {
                container: ".actmovedo",
                isTouchDevice: this.checkTouch(),
                isWheelDevice: this.checkScrollWheel(),
                zoom: {
                    min: 0.0,
                    max: 1.0,
                    initial: 0.5,
                    steps: {
                        tap: 0.5,
                        scroll: 0.05
                    }
                },
                callbacks: {
                    pan: null,
                    flick: null,
                    zoom: null
                }
            };

            this.settings.eventNames = {
                "start": this.settings.isTouchDevice ? "touchstart" : "mousedown",
                "move": this.settings.isTouchDevice ? "touchmove" : "mousemove",
                "end": this.settings.isTouchDevice ? "touchend" : "mouseup",
                "scroll": this.getScrollEventName()
            };

            $.extend(this.settings, settings || {});

            this.current = {
                downEvent: false,
                start: [0,0]
            };

            this.init();
            this.bindEvents();

        }

        ActMoveDo.prototype.init = function() {
            this.$container = $(this.settings.container);
        };

        ActMoveDo.prototype.bindEvents = function() {
            var self = this;

            // if no touch device, enable mousewheel listener
            if (this.settings.isWheelDevice) {
                this.$container.on(this.settings.eventNames.scroll, function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    var e = self.getEvent(event);

                    self.getScrollDirection(e);

                });
            }

            this.$container.on(this.settings.eventNames.start, function(event) {

                event.stopPropagation();
                event.preventDefault();

                var e = self.getEvent(event);

                self.current.downEvent = true;

                // mouse is used
                if (e instanceof MouseEvent) {
                    console.log("mouse down", e);
                } // touch is used
                else {
                    // singletouch startet
                    if (e.length <= 1) {
                        console.log("single touch", e);
                    } // multitouch started
                    else {
                        console.log("multi touch", e);

                    }
                    console.log(e);
                }
            });

            this.$container.on(this.settings.eventNames.move, function(event) {

                event.stopPropagation();
                event.preventDefault();

                var e = self.getEvent(event);
                
                if (!self.current.downEvent) {
                    return false;
                }
            });

            };

        ActMoveDo.prototype.getScrollDirection = function(event) {
            // down
            if ((event.deltaY > 0) || ((event.axis === 2) && (event.detail > 0))) {
                console.log("down");
            }
            // up
            else if ((event.deltaY < 0) || ((event.axis === 2) && (event.detail < 0))) {
                console.log("up");
            }
        };

        ActMoveDo.prototype.checkTouch = function() {
            return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
        };

        ActMoveDo.prototype.checkScrollWheel = function() {
            return ("onwheel" in window);
        };



        ActMoveDo.prototype.getScrollEventName = function() {
            if ('onmousewheel' in window) {
                return "mousewheel";
            } else {
                return "DOMMouseScroll";
            }
        };

        ActMoveDo.prototype.getEvent = function(e) {
            return e.originalEvent.touches || e.originalEvent.changedTouches || e.originalEvent;
        };

    return ActMoveDo;

}(jQuery));