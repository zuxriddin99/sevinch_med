!function (t, i) {
    "object" == typeof exports && "undefined" != typeof module ? i(exports) : "function" == typeof define && define.amd ? define(["exports"], i) : i((t = "undefined" != typeof globalThis ? globalThis : t || self).countUp = {})
}(this, (function (t) {
    "use strict";
    var i = function () {
        return i = Object.assign || function (t) {
            for (var i, n = 1, s = arguments.length; n < s; n++) for (var e in i = arguments[n]) Object.prototype.hasOwnProperty.call(i, e) && (t[e] = i[e]);
            return t
        }, i.apply(this, arguments)
    }, n = function () {
        function t(t, n, s) {
            var e = this;
            this.endVal = n, this.options = s, this.version = "2.8.0", this.defaults = {
                startVal: 0,
                decimalPlaces: 0,
                duration: 1,
                useEasing: !0,
                useGrouping: !0,
                useIndianSeparators: !1,
                smartEasingThreshold: 999,
                smartEasingAmount: 333,
                separator: " ",
                decimal: ".",
                prefix: "",
                suffix: " so'm",
                enableScrollSpy: !1,
                scrollSpyDelay: 100,
                scrollSpyOnce: !1
            }, this.finalEndVal = null, this.useEasing = !0, this.countDown = !1, this.error = "", this.startVal = 0, this.paused = !0, this.once = !1, this.count = function (t) {
                e.startTime || (e.startTime = t);
                var i = t - e.startTime;
                e.remaining = e.duration - i, e.useEasing ? e.countDown ? e.frameVal = e.startVal - e.easingFn(i, 0, e.startVal - e.endVal, e.duration) : e.frameVal = e.easingFn(i, e.startVal, e.endVal - e.startVal, e.duration) : e.frameVal = e.startVal + (e.endVal - e.startVal) * (i / e.duration);
                var n = e.countDown ? e.frameVal < e.endVal : e.frameVal > e.endVal;
                e.frameVal = n ? e.endVal : e.frameVal, e.frameVal = Number(e.frameVal.toFixed(e.options.decimalPlaces)), e.printValue(e.frameVal), i < e.duration ? e.rAF = requestAnimationFrame(e.count) : null !== e.finalEndVal ? e.update(e.finalEndVal) : e.options.onCompleteCallback && e.options.onCompleteCallback()
            }, this.formatNumber = function (t) {
                var i, n, s, a, o = t < 0 ? "-" : "";
                i = Math.abs(t).toFixed(e.options.decimalPlaces);
                var r = (i += "").split(".");
                if (n = r[0], s = r.length > 1 ? e.options.decimal + r[1] : "", e.options.useGrouping) {
                    a = "";
                    for (var l = 3, u = 0, h = 0, p = n.length; h < p; ++h) e.options.useIndianSeparators && 4 === h && (l = 2, u = 1), 0 !== h && u % l == 0 && (a = e.options.separator + a), u++, a = n[p - h - 1] + a;
                    n = a
                }
                return e.options.numerals && e.options.numerals.length && (n = n.replace(/[0-9]/g, (function (t) {
                    return e.options.numerals[+t]
                })), s = s.replace(/[0-9]/g, (function (t) {
                    return e.options.numerals[+t]
                }))), o + e.options.prefix + n + s + e.options.suffix
            }, this.easeOutExpo = function (t, i, n, s) {
                return n * (1 - Math.pow(2, -10 * t / s)) * 1024 / 1023 + i
            }, this.options = i(i({}, this.defaults), s), this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber, this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo, this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.endVal = this.validateValue(n), this.options.decimalPlaces = Math.max(this.options.decimalPlaces), this.resetDuration(), this.options.separator = String(this.options.separator), this.useEasing = this.options.useEasing, "" === this.options.separator && (this.options.useGrouping = !1), this.el = "string" == typeof t ? document.getElementById(t) : t, this.el ? this.printValue(this.startVal) : this.error = "[CountUp] target is null or undefined", "undefined" != typeof window && this.options.enableScrollSpy && (this.error ? console.error(this.error, t) : (window.onScrollFns = window.onScrollFns || [], window.onScrollFns.push((function () {
                return e.handleScroll(e)
            })), window.onscroll = function () {
                window.onScrollFns.forEach((function (t) {
                    return t()
                }))
            }, this.handleScroll(this)))
        }

        return t.prototype.handleScroll = function (t) {
            if (t && window && !t.once) {
                var i = window.innerHeight + window.scrollY, n = t.el.getBoundingClientRect(),
                    s = n.top + window.pageYOffset, e = n.top + n.height + window.pageYOffset;
                e < i && e > window.scrollY && t.paused ? (t.paused = !1, setTimeout((function () {
                    return t.start()
                }), t.options.scrollSpyDelay), t.options.scrollSpyOnce && (t.once = !0)) : (window.scrollY > e || s > i) && !t.paused && t.reset()
            }
        }, t.prototype.determineDirectionAndSmartEasing = function () {
            var t = this.finalEndVal ? this.finalEndVal : this.endVal;
            this.countDown = this.startVal > t;
            var i = t - this.startVal;
            if (Math.abs(i) > this.options.smartEasingThreshold && this.options.useEasing) {
                this.finalEndVal = t;
                var n = this.countDown ? 1 : -1;
                this.endVal = t + n * this.options.smartEasingAmount, this.duration = this.duration / 2
            } else this.endVal = t, this.finalEndVal = null;
            null !== this.finalEndVal ? this.useEasing = !1 : this.useEasing = this.options.useEasing
        }, t.prototype.start = function (t) {
            this.error || (this.options.onStartCallback && this.options.onStartCallback(), t && (this.options.onCompleteCallback = t), this.duration > 0 ? (this.determineDirectionAndSmartEasing(), this.paused = !1, this.rAF = requestAnimationFrame(this.count)) : this.printValue(this.endVal))
        }, t.prototype.pauseResume = function () {
            this.paused ? (this.startTime = null, this.duration = this.remaining, this.startVal = this.frameVal, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count)) : cancelAnimationFrame(this.rAF), this.paused = !this.paused
        }, t.prototype.reset = function () {
            cancelAnimationFrame(this.rAF), this.paused = !0, this.resetDuration(), this.startVal = this.validateValue(this.options.startVal), this.frameVal = this.startVal, this.printValue(this.startVal)
        }, t.prototype.update = function (t) {
            cancelAnimationFrame(this.rAF), this.startTime = null, this.endVal = this.validateValue(t), this.endVal !== this.frameVal && (this.startVal = this.frameVal, null == this.finalEndVal && this.resetDuration(), this.finalEndVal = null, this.determineDirectionAndSmartEasing(), this.rAF = requestAnimationFrame(this.count))
        }, t.prototype.printValue = function (t) {
            var i;
            if (this.el) {
                var n = this.formattingFn(t);
                if (null === (i = this.options.plugin) || void 0 === i ? void 0 : i.render) this.options.plugin.render(this.el, n); else if ("INPUT" === this.el.tagName) this.el.value = n; else "text" === this.el.tagName || "tspan" === this.el.tagName ? this.el.textContent = n : this.el.innerHTML = n
            }
        }, t.prototype.ensureNumber = function (t) {
            return "number" == typeof t && !isNaN(t)
        }, t.prototype.validateValue = function (t) {
            var i = Number(t);
            return this.ensureNumber(i) ? i : (this.error = "[CountUp] invalid start or end value: ".concat(t), null)
        }, t.prototype.resetDuration = function () {
            this.startTime = null, this.duration = 1e3 * Number(this.options.duration), this.remaining = this.duration
        }, t
    }();
    t.CountUp = n, Object.defineProperty(t, "__esModule", {value: !0})
}));
