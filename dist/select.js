"use strict";

var Is;

(e => {
    function t(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = t;
    function n(e) {
        return t(e) && typeof e === "object";
    }
    e.definedObject = n;
    function o(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = o;
    function i(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = i;
    function r(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = r;
    function s(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = s;
    function l(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = l;
})(Is || (Is = {}));

var Trigger;

(e => {
    function t(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
    }
    e.customEvent = t;
})(Trigger || (Trigger = {}));

var Constants;

(e => {
    e.SELECT_JS_ATTRIBUTE_NAME = "data-select-js";
})(Constants || (Constants = {}));

var Default2;

(Default => {
    function getString(e, t) {
        return Is.definedString(e) ? e : t;
    }
    Default.getString = getString;
    function getBoolean(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    Default.getBoolean = getBoolean;
    function getNumber(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    Default.getNumber = getNumber;
    function getFunction(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    Default.getFunction = getFunction;
    function getArray(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    Default.getArray = getArray;
    function getObject(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    Default.getObject = getObject;
    function getStringOrArray(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const o = e.toString().split(" ");
            if (o.length === 0) {
                e = t;
            } else {
                n = o;
            }
        } else {
            n = getArray(e, t);
        }
        return n;
    }
    Default.getStringOrArray = getStringOrArray;
    function getObjectFromString(objectString, configuration) {
        const result = {
            parsed: true,
            object: null
        };
        try {
            if (Is.definedString(objectString)) {
                result.object = JSON.parse(objectString);
            }
        } catch (e1) {
            try {
                result.object = eval(`(${objectString})`);
                if (Is.definedFunction(result.object)) {
                    result.object = result.object();
                }
            } catch (e) {
                if (!configuration.safeMode) {
                    console.error("Errors in object: " + e1.message + ", " + e.message);
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    Default.getObjectFromString = getObjectFromString;
})(Default2 || (Default2 = {}));

var DomElement;

(e => {
    function t(e, t = "") {
        const n = e.toLowerCase();
        const o = n === "text";
        let i = o ? document.createTextNode("") : document.createElement(n);
        if (Is.defined(t)) {
            i.className = t;
        }
        return i;
    }
    e.create = t;
    function n(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    e.cancelBubble = n;
})(DomElement || (DomElement = {}));

var Binding;

(e => {
    let t;
    (t => {
        function n(t, n) {
            const o = e.Options.get(t);
            o._currentView = {};
            o._currentView.element = n;
            return o;
        }
        t.getForNewInstance = n;
        function o(e) {
            let t = Default2.getObject(e, {});
            t.render = Default2.getBoolean(t.render, true);
            t.dropDownShowDelay = Default2.getNumber(t.dropDownShowDelay, 50);
            t.showDropDownButton = Default2.getBoolean(t.showDropDownButton, true);
            t = i(t);
            t = r(t);
            return t;
        }
        t.get = o;
        function i(e) {
            e.removeText = Default2.getString(e.removeText, "X");
            e.noItemsSelectedText = Default2.getString(e.noItemsSelectedText, "There are no items selected");
            return e;
        }
        function r(e) {
            e.onRenderComplete = Default2.getFunction(e.onRenderComplete, null);
            e.onSelectedItemsChanged = Default2.getFunction(e.onSelectedItemsChanged, null);
            e.onDropDownShow = Default2.getFunction(e.onDropDownShow, null);
            e.onDropDownHide = Default2.getFunction(e.onDropDownHide, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Binding || (Binding = {}));

var Config;

(e => {
    let t;
    (e => {
        function t(e = null) {
            let t = Default2.getObject(e, {});
            t.safeMode = Default2.getBoolean(t.safeMode, true);
            t.domElementTypes = Default2.getStringOrArray(t.domElementTypes, [ "select" ]);
            return t;
        }
        e.get = t;
    })(t = e.Options || (e.Options = {}));
})(Config || (Config = {}));

(() => {
    let e = {};
    let t = [];
    function n() {
        const t = e.domElementTypes;
        const n = t.length;
        for (let e = 0; e < n; e++) {
            const n = document.getElementsByTagName(t[e]);
            const i = [].slice.call(n);
            const r = i.length;
            for (let e = 0; e < r; e++) {
                if (!o(i[e])) {
                    break;
                }
            }
        }
    }
    function o(t) {
        let n = true;
        if (Is.defined(t) && t.hasAttribute(Constants.SELECT_JS_ATTRIBUTE_NAME)) {
            const o = t.getAttribute(Constants.SELECT_JS_ATTRIBUTE_NAME);
            if (Is.definedString(o)) {
                const s = Default2.getObjectFromString(o, e);
                if (s.parsed && Is.definedObject(s.object)) {
                    const e = Binding.Options.getForNewInstance(s.object, t);
                    if (e.render) {
                        t.removeAttribute(Constants.SELECT_JS_ATTRIBUTE_NAME);
                        const n = i(t);
                        const o = r(n, t, e);
                        l(o);
                        u(o, false);
                        a(o);
                        Trigger.customEvent(e.onRenderComplete, e._currentView.element);
                    }
                } else {
                    if (!e.safeMode) {
                        console.error(`The attribute '${Constants.SELECT_JS_ATTRIBUTE_NAME}' is not a valid object.`);
                        n = false;
                    }
                }
            } else {
                if (!e.safeMode) {
                    console.error(`The attribute '${Constants.SELECT_JS_ATTRIBUTE_NAME}' has not been set correctly.`);
                    n = false;
                }
            }
        }
        return n;
    }
    function i(e) {
        const t = e.parentNode;
        const n = t.children;
        const o = n.length;
        let i = null;
        let r = false;
        for (let t = 0; t < o; t++) {
            const o = n[t];
            if (!r) {
                if (o === e) {
                    r = true;
                }
            } else {
                i = o;
                break;
            }
        }
        const s = DomElement.create("div", "select-js");
        if (Is.defined(i)) {
            t.insertBefore(s, i);
        } else {
            t.appendChild(s);
        }
        t.removeChild(e);
        s.appendChild(e);
        return s;
    }
    function r(e, n, o) {
        const i = DomElement.create("div", "control");
        e.appendChild(i);
        const r = DomElement.create("div", "drop-down");
        r.style.display = "none";
        e.appendChild(r);
        const s = {
            control: i,
            dropDown: r,
            select: n,
            bindingOptions: o,
            multiSelectEnabled: n.hasAttribute("multiple")
        };
        if (!o.showDropDownButton) {
            i.onclick = () => f(s);
        }
        t.push(s);
        return s;
    }
    function s(e) {
        if (e.bindingOptions.showDropDownButton) {
            const t = DomElement.create("div", "button");
            e.control.appendChild(t);
            if (p(e)) {
                t.classList.add("button-open");
            }
            t.onclick = () => f(e);
        }
    }
    function l(e) {
        const t = e.select.options;
        const n = t.length;
        e.dropDown.innerHTML = "";
        for (let t = 0; t < n; t++) {
            c(e, t);
        }
    }
    function c(e, t) {
        const n = DomElement.create("div", "item");
        const o = e.select.options[t];
        n.innerHTML = o.text;
        e.dropDown.appendChild(n);
        if (o.selected) {
            n.classList.add("selected");
        }
        n.onclick = o => {
            DomElement.cancelBubble(o);
            if (!e.multiSelectEnabled) {
                const t = e.select.options.length;
                for (let n = 0; n < t; n++) {
                    e.select.options[n].selected = false;
                }
            }
            e.select.options[t].selected = !e.select.options[t].selected;
            if (e.select.options[t].selected) {
                n.className = "item selected";
            } else {
                n.className = "item";
            }
            u(e);
            if (!e.multiSelectEnabled) {
                g(e);
            }
        };
    }
    function u(e, t = true) {
        const n = e.select.options;
        const o = n.length;
        let i = false;
        e.control.innerHTML = "";
        s(e);
        for (let t = 0; t < o; t++) {
            const o = n[t];
            if (o.selected) {
                i = true;
                d(e, t);
            }
        }
        if (!i) {
            const t = DomElement.create("div", "no-items-selected");
            t.innerHTML = e.bindingOptions.noItemsSelectedText;
            e.control.appendChild(t);
        }
        if (t) {
            Trigger.customEvent(e.bindingOptions.onSelectedItemsChanged, m(e));
        }
    }
    function d(e, t) {
        const n = DomElement.create("div", "selected-item");
        e.control.appendChild(n);
        const o = DomElement.create("span", "text");
        o.innerHTML = e.select.options[t].text;
        n.appendChild(o);
        if (e.multiSelectEnabled) {
            const o = DomElement.create("div", "remove");
            o.innerHTML = e.bindingOptions.removeText;
            n.appendChild(o);
            o.onclick = n => {
                DomElement.cancelBubble(n);
                e.select.options[t].selected = false;
                g(e);
                u(e);
            };
        }
    }
    function a(e) {
        const t = () => g(e);
        document.body.addEventListener("click", t);
        window.addEventListener("resize", t);
        window.addEventListener("click", t);
    }
    function f(e) {
        if (!p(e)) {
            setTimeout((function() {
                e.dropDown.style.display = "block";
                l(e);
                u(e, false);
                Trigger.customEvent(e.bindingOptions.onDropDownShow);
            }), e.bindingOptions.dropDownShowDelay);
        } else {
            g(e);
        }
    }
    function g(e) {
        if (e.dropDown !== null && e.dropDown.style.display !== "none") {
            e.dropDown.style.display = "none";
            u(e, false);
            Trigger.customEvent(e.bindingOptions.onDropDownHide);
        }
    }
    function p(e) {
        return e.dropDown !== null && e.dropDown.style.display === "block";
    }
    function m(e) {
        const t = e.select.options;
        const n = t.length;
        const o = [];
        for (let e = 0; e < n; e++) {
            const n = t[e];
            if (n.selected) {
                o.push(n.value);
            }
        }
        return o;
    }
    function D(e = true) {
        const t = e ? document.addEventListener : document.removeEventListener;
        t("keydown", b);
    }
    function b(e) {
        if (e.code === "Escape") {
            e.preventDefault();
            E();
        }
    }
    function E() {
        const e = t.length;
        for (let n = 0; n < e; n++) {
            g(t[n]);
        }
    }
    const S = {
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const o = e;
                for (let i in t) {
                    if (t.hasOwnProperty(i) && e.hasOwnProperty(i) && o[i] !== t[i]) {
                        o[i] = t[i];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(o);
                }
            }
            return S;
        },
        getVersion: function() {
            return "1.0.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (function() {
            n();
            D();
        }));
        if (!Is.defined(window.$select)) {
            window.$select = S;
        }
    })();
})();//# sourceMappingURL=select.js.map