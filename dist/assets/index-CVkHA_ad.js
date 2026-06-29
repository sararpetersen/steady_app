(function () {
  const k = document.createElement("link").relList;
  if (k && k.supports && k.supports("modulepreload")) return;
  for (const v of document.querySelectorAll('link[rel="modulepreload"]')) W(v);
  new MutationObserver((v) => {
    for (const w of v) if (w.type === "childList") for (const C of w.addedNodes) C.tagName === "LINK" && C.rel === "modulepreload" && W(C);
  }).observe(document, { childList: !0, subtree: !0 });
  function f(v) {
    const w = {};
    return (
      v.integrity && (w.integrity = v.integrity),
      v.referrerPolicy && (w.referrerPolicy = v.referrerPolicy),
      v.crossOrigin === "use-credentials"
        ? (w.credentials = "include")
        : v.crossOrigin === "anonymous"
          ? (w.credentials = "omit")
          : (w.credentials = "same-origin"),
      w
    );
  }
  function W(v) {
    if (v.ep) return;
    v.ep = !0;
    const w = f(v);
    fetch(v.href, w);
  }
})();
var Ri = { exports: {} },
  Nr = {},
  Ii = { exports: {} },
  re = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Bu;
function af() {
  if (Bu) return re;
  Bu = 1;
  var c = Symbol.for("react.element"),
    k = Symbol.for("react.portal"),
    f = Symbol.for("react.fragment"),
    W = Symbol.for("react.strict_mode"),
    v = Symbol.for("react.profiler"),
    w = Symbol.for("react.provider"),
    C = Symbol.for("react.context"),
    F = Symbol.for("react.forward_ref"),
    D = Symbol.for("react.suspense"),
    N = Symbol.for("react.memo"),
    R = Symbol.for("react.lazy"),
    E = Symbol.iterator;
  function j(a) {
    return a === null || typeof a != "object" ? null : ((a = (E && a[E]) || a["@@iterator"]), typeof a == "function" ? a : null);
  }
  var B = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    Y = Object.assign,
    Z = {};
  function g(a, x, K) {
    ((this.props = a), (this.context = x), (this.refs = Z), (this.updater = K || B));
  }
  ((g.prototype.isReactComponent = {}),
    (g.prototype.setState = function (a, x) {
      if (typeof a != "object" && typeof a != "function" && a != null)
        throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
      this.updater.enqueueSetState(this, a, x, "setState");
    }),
    (g.prototype.forceUpdate = function (a) {
      this.updater.enqueueForceUpdate(this, a, "forceUpdate");
    }));
  function M() {}
  M.prototype = g.prototype;
  function T(a, x, K) {
    ((this.props = a), (this.context = x), (this.refs = Z), (this.updater = K || B));
  }
  var le = (T.prototype = new M());
  ((le.constructor = T), Y(le, g.prototype), (le.isPureReactComponent = !0));
  var ae = Array.isArray,
    ue = Object.prototype.hasOwnProperty,
    me = { current: null },
    Ce = { key: !0, ref: !0, __self: !0, __source: !0 };
  function A(a, x, K) {
    var q,
      te = {},
      oe = null,
      G = null;
    if (x != null)
      for (q in (x.ref !== void 0 && (G = x.ref), x.key !== void 0 && (oe = "" + x.key), x)) ue.call(x, q) && !Ce.hasOwnProperty(q) && (te[q] = x[q]);
    var ne = arguments.length - 2;
    if (ne === 1) te.children = K;
    else if (1 < ne) {
      for (var ge = Array(ne), Ve = 0; Ve < ne; Ve++) ge[Ve] = arguments[Ve + 2];
      te.children = ge;
    }
    if (a && a.defaultProps) for (q in ((ne = a.defaultProps), ne)) te[q] === void 0 && (te[q] = ne[q]);
    return { $$typeof: c, type: a, key: oe, ref: G, props: te, _owner: me.current };
  }
  function de(a, x) {
    return { $$typeof: c, type: a.type, key: x, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function He(a) {
    return typeof a == "object" && a !== null && a.$$typeof === c;
  }
  function Re(a) {
    var x = { "=": "=0", ":": "=2" };
    return (
      "$" +
      a.replace(/[=:]/g, function (K) {
        return x[K];
      })
    );
  }
  var Ie = /\/+/g;
  function ze(a, x) {
    return typeof a == "object" && a !== null && a.key != null ? Re("" + a.key) : x.toString(36);
  }
  function Ne(a, x, K, q, te) {
    var oe = typeof a;
    (oe === "undefined" || oe === "boolean") && (a = null);
    var G = !1;
    if (a === null) G = !0;
    else
      switch (oe) {
        case "string":
        case "number":
          G = !0;
          break;
        case "object":
          switch (a.$$typeof) {
            case c:
            case k:
              G = !0;
          }
      }
    if (G)
      return (
        (G = a),
        (te = te(G)),
        (a = q === "" ? "." + ze(G, 0) : q),
        ae(te)
          ? ((K = ""),
            a != null && (K = a.replace(Ie, "$&/") + "/"),
            Ne(te, x, K, "", function (Ve) {
              return Ve;
            }))
          : te != null &&
            (He(te) && (te = de(te, K + (!te.key || (G && G.key === te.key) ? "" : ("" + te.key).replace(Ie, "$&/") + "/") + a)), x.push(te)),
        1
      );
    if (((G = 0), (q = q === "" ? "." : q + ":"), ae(a)))
      for (var ne = 0; ne < a.length; ne++) {
        oe = a[ne];
        var ge = q + ze(oe, ne);
        G += Ne(oe, x, K, ge, te);
      }
    else if (((ge = j(a)), typeof ge == "function"))
      for (a = ge.call(a), ne = 0; !(oe = a.next()).done; ) ((oe = oe.value), (ge = q + ze(oe, ne++)), (G += Ne(oe, x, K, ge, te)));
    else if (oe === "object")
      throw (
        (x = String(a)),
        Error(
          "Objects are not valid as a React child (found: " +
            (x === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : x) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    return G;
  }
  function we(a, x, K) {
    if (a == null) return a;
    var q = [],
      te = 0;
    return (
      Ne(a, q, "", "", function (oe) {
        return x.call(K, oe, te++);
      }),
      q
    );
  }
  function fe(a) {
    if (a._status === -1) {
      var x = a._result;
      ((x = x()),
        x.then(
          function (K) {
            (a._status === 0 || a._status === -1) && ((a._status = 1), (a._result = K));
          },
          function (K) {
            (a._status === 0 || a._status === -1) && ((a._status = 2), (a._result = K));
          },
        ),
        a._status === -1 && ((a._status = 0), (a._result = x)));
    }
    if (a._status === 1) return a._result.default;
    throw a._result;
  }
  var ce = { current: null },
    O = { transition: null },
    S = { ReactCurrentDispatcher: ce, ReactCurrentBatchConfig: O, ReactCurrentOwner: me };
  function _() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return (
    (re.Children = {
      map: we,
      forEach: function (a, x, K) {
        we(
          a,
          function () {
            x.apply(this, arguments);
          },
          K,
        );
      },
      count: function (a) {
        var x = 0;
        return (
          we(a, function () {
            x++;
          }),
          x
        );
      },
      toArray: function (a) {
        return (
          we(a, function (x) {
            return x;
          }) || []
        );
      },
      only: function (a) {
        if (!He(a)) throw Error("React.Children.only expected to receive a single React element child.");
        return a;
      },
    }),
    (re.Component = g),
    (re.Fragment = f),
    (re.Profiler = v),
    (re.PureComponent = T),
    (re.StrictMode = W),
    (re.Suspense = D),
    (re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = S),
    (re.act = _),
    (re.cloneElement = function (a, x, K) {
      if (a == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
      var q = Y({}, a.props),
        te = a.key,
        oe = a.ref,
        G = a._owner;
      if (x != null) {
        if ((x.ref !== void 0 && ((oe = x.ref), (G = me.current)), x.key !== void 0 && (te = "" + x.key), a.type && a.type.defaultProps))
          var ne = a.type.defaultProps;
        for (ge in x) ue.call(x, ge) && !Ce.hasOwnProperty(ge) && (q[ge] = x[ge] === void 0 && ne !== void 0 ? ne[ge] : x[ge]);
      }
      var ge = arguments.length - 2;
      if (ge === 1) q.children = K;
      else if (1 < ge) {
        ne = Array(ge);
        for (var Ve = 0; Ve < ge; Ve++) ne[Ve] = arguments[Ve + 2];
        q.children = ne;
      }
      return { $$typeof: c, type: a.type, key: te, ref: oe, props: q, _owner: G };
    }),
    (re.createContext = function (a) {
      return (
        (a = {
          $$typeof: C,
          _currentValue: a,
          _currentValue2: a,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }),
        (a.Provider = { $$typeof: w, _context: a }),
        (a.Consumer = a)
      );
    }),
    (re.createElement = A),
    (re.createFactory = function (a) {
      var x = A.bind(null, a);
      return ((x.type = a), x);
    }),
    (re.createRef = function () {
      return { current: null };
    }),
    (re.forwardRef = function (a) {
      return { $$typeof: F, render: a };
    }),
    (re.isValidElement = He),
    (re.lazy = function (a) {
      return { $$typeof: R, _payload: { _status: -1, _result: a }, _init: fe };
    }),
    (re.memo = function (a, x) {
      return { $$typeof: N, type: a, compare: x === void 0 ? null : x };
    }),
    (re.startTransition = function (a) {
      var x = O.transition;
      O.transition = {};
      try {
        a();
      } finally {
        O.transition = x;
      }
    }),
    (re.unstable_act = _),
    (re.useCallback = function (a, x) {
      return ce.current.useCallback(a, x);
    }),
    (re.useContext = function (a) {
      return ce.current.useContext(a);
    }),
    (re.useDebugValue = function () {}),
    (re.useDeferredValue = function (a) {
      return ce.current.useDeferredValue(a);
    }),
    (re.useEffect = function (a, x) {
      return ce.current.useEffect(a, x);
    }),
    (re.useId = function () {
      return ce.current.useId();
    }),
    (re.useImperativeHandle = function (a, x, K) {
      return ce.current.useImperativeHandle(a, x, K);
    }),
    (re.useInsertionEffect = function (a, x) {
      return ce.current.useInsertionEffect(a, x);
    }),
    (re.useLayoutEffect = function (a, x) {
      return ce.current.useLayoutEffect(a, x);
    }),
    (re.useMemo = function (a, x) {
      return ce.current.useMemo(a, x);
    }),
    (re.useReducer = function (a, x, K) {
      return ce.current.useReducer(a, x, K);
    }),
    (re.useRef = function (a) {
      return ce.current.useRef(a);
    }),
    (re.useState = function (a) {
      return ce.current.useState(a);
    }),
    (re.useSyncExternalStore = function (a, x, K) {
      return ce.current.useSyncExternalStore(a, x, K);
    }),
    (re.useTransition = function () {
      return ce.current.useTransition();
    }),
    (re.version = "18.3.1"),
    re
  );
}
var Vu;
function Gi() {
  return (Vu || ((Vu = 1), (Ii.exports = af())), Ii.exports);
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Qu;
function uf() {
  if (Qu) return Nr;
  Qu = 1;
  var c = Gi(),
    k = Symbol.for("react.element"),
    f = Symbol.for("react.fragment"),
    W = Object.prototype.hasOwnProperty,
    v = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    w = { key: !0, ref: !0, __self: !0, __source: !0 };
  function C(F, D, N) {
    var R,
      E = {},
      j = null,
      B = null;
    (N !== void 0 && (j = "" + N), D.key !== void 0 && (j = "" + D.key), D.ref !== void 0 && (B = D.ref));
    for (R in D) W.call(D, R) && !w.hasOwnProperty(R) && (E[R] = D[R]);
    if (F && F.defaultProps) for (R in ((D = F.defaultProps), D)) E[R] === void 0 && (E[R] = D[R]);
    return { $$typeof: k, type: F, key: j, ref: B, props: E, _owner: v.current };
  }
  return ((Nr.Fragment = f), (Nr.jsx = C), (Nr.jsxs = C), Nr);
}
var Gu;
function df() {
  return (Gu || ((Gu = 1), (Ri.exports = uf())), Ri.exports);
}
var i = df(),
  Io = {},
  Wi = { exports: {} },
  et = {},
  Fi = { exports: {} },
  Hi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Yu;
function cf() {
  return (
    Yu ||
      ((Yu = 1),
      (function (c) {
        function k(O, S) {
          var _ = O.length;
          O.push(S);
          e: for (; 0 < _; ) {
            var a = (_ - 1) >>> 1,
              x = O[a];
            if (0 < v(x, S)) ((O[a] = S), (O[_] = x), (_ = a));
            else break e;
          }
        }
        function f(O) {
          return O.length === 0 ? null : O[0];
        }
        function W(O) {
          if (O.length === 0) return null;
          var S = O[0],
            _ = O.pop();
          if (_ !== S) {
            O[0] = _;
            e: for (var a = 0, x = O.length, K = x >>> 1; a < K; ) {
              var q = 2 * (a + 1) - 1,
                te = O[q],
                oe = q + 1,
                G = O[oe];
              if (0 > v(te, _)) oe < x && 0 > v(G, te) ? ((O[a] = G), (O[oe] = _), (a = oe)) : ((O[a] = te), (O[q] = _), (a = q));
              else if (oe < x && 0 > v(G, _)) ((O[a] = G), (O[oe] = _), (a = oe));
              else break e;
            }
          }
          return S;
        }
        function v(O, S) {
          var _ = O.sortIndex - S.sortIndex;
          return _ !== 0 ? _ : O.id - S.id;
        }
        if (typeof performance == "object" && typeof performance.now == "function") {
          var w = performance;
          c.unstable_now = function () {
            return w.now();
          };
        } else {
          var C = Date,
            F = C.now();
          c.unstable_now = function () {
            return C.now() - F;
          };
        }
        var D = [],
          N = [],
          R = 1,
          E = null,
          j = 3,
          B = !1,
          Y = !1,
          Z = !1,
          g = typeof setTimeout == "function" ? setTimeout : null,
          M = typeof clearTimeout == "function" ? clearTimeout : null,
          T = typeof setImmediate < "u" ? setImmediate : null;
        typeof navigator < "u" &&
          navigator.scheduling !== void 0 &&
          navigator.scheduling.isInputPending !== void 0 &&
          navigator.scheduling.isInputPending.bind(navigator.scheduling);
        function le(O) {
          for (var S = f(N); S !== null; ) {
            if (S.callback === null) W(N);
            else if (S.startTime <= O) (W(N), (S.sortIndex = S.expirationTime), k(D, S));
            else break;
            S = f(N);
          }
        }
        function ae(O) {
          if (((Z = !1), le(O), !Y))
            if (f(D) !== null) ((Y = !0), fe(ue));
            else {
              var S = f(N);
              S !== null && ce(ae, S.startTime - O);
            }
        }
        function ue(O, S) {
          ((Y = !1), Z && ((Z = !1), M(A), (A = -1)), (B = !0));
          var _ = j;
          try {
            for (le(S), E = f(D); E !== null && (!(E.expirationTime > S) || (O && !Re())); ) {
              var a = E.callback;
              if (typeof a == "function") {
                ((E.callback = null), (j = E.priorityLevel));
                var x = a(E.expirationTime <= S);
                ((S = c.unstable_now()), typeof x == "function" ? (E.callback = x) : E === f(D) && W(D), le(S));
              } else W(D);
              E = f(D);
            }
            if (E !== null) var K = !0;
            else {
              var q = f(N);
              (q !== null && ce(ae, q.startTime - S), (K = !1));
            }
            return K;
          } finally {
            ((E = null), (j = _), (B = !1));
          }
        }
        var me = !1,
          Ce = null,
          A = -1,
          de = 5,
          He = -1;
        function Re() {
          return !(c.unstable_now() - He < de);
        }
        function Ie() {
          if (Ce !== null) {
            var O = c.unstable_now();
            He = O;
            var S = !0;
            try {
              S = Ce(!0, O);
            } finally {
              S ? ze() : ((me = !1), (Ce = null));
            }
          } else me = !1;
        }
        var ze;
        if (typeof T == "function")
          ze = function () {
            T(Ie);
          };
        else if (typeof MessageChannel < "u") {
          var Ne = new MessageChannel(),
            we = Ne.port2;
          ((Ne.port1.onmessage = Ie),
            (ze = function () {
              we.postMessage(null);
            }));
        } else
          ze = function () {
            g(Ie, 0);
          };
        function fe(O) {
          ((Ce = O), me || ((me = !0), ze()));
        }
        function ce(O, S) {
          A = g(function () {
            O(c.unstable_now());
          }, S);
        }
        ((c.unstable_IdlePriority = 5),
          (c.unstable_ImmediatePriority = 1),
          (c.unstable_LowPriority = 4),
          (c.unstable_NormalPriority = 3),
          (c.unstable_Profiling = null),
          (c.unstable_UserBlockingPriority = 2),
          (c.unstable_cancelCallback = function (O) {
            O.callback = null;
          }),
          (c.unstable_continueExecution = function () {
            Y || B || ((Y = !0), fe(ue));
          }),
          (c.unstable_forceFrameRate = function (O) {
            0 > O || 125 < O
              ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported")
              : (de = 0 < O ? Math.floor(1e3 / O) : 5);
          }),
          (c.unstable_getCurrentPriorityLevel = function () {
            return j;
          }),
          (c.unstable_getFirstCallbackNode = function () {
            return f(D);
          }),
          (c.unstable_next = function (O) {
            switch (j) {
              case 1:
              case 2:
              case 3:
                var S = 3;
                break;
              default:
                S = j;
            }
            var _ = j;
            j = S;
            try {
              return O();
            } finally {
              j = _;
            }
          }),
          (c.unstable_pauseExecution = function () {}),
          (c.unstable_requestPaint = function () {}),
          (c.unstable_runWithPriority = function (O, S) {
            switch (O) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                O = 3;
            }
            var _ = j;
            j = O;
            try {
              return S();
            } finally {
              j = _;
            }
          }),
          (c.unstable_scheduleCallback = function (O, S, _) {
            var a = c.unstable_now();
            switch ((typeof _ == "object" && _ !== null ? ((_ = _.delay), (_ = typeof _ == "number" && 0 < _ ? a + _ : a)) : (_ = a), O)) {
              case 1:
                var x = -1;
                break;
              case 2:
                x = 250;
                break;
              case 5:
                x = 1073741823;
                break;
              case 4:
                x = 1e4;
                break;
              default:
                x = 5e3;
            }
            return (
              (x = _ + x),
              (O = { id: R++, callback: S, priorityLevel: O, startTime: _, expirationTime: x, sortIndex: -1 }),
              _ > a
                ? ((O.sortIndex = _), k(N, O), f(D) === null && O === f(N) && (Z ? (M(A), (A = -1)) : (Z = !0), ce(ae, _ - a)))
                : ((O.sortIndex = x), k(D, O), Y || B || ((Y = !0), fe(ue))),
              O
            );
          }),
          (c.unstable_shouldYield = Re),
          (c.unstable_wrapCallback = function (O) {
            var S = j;
            return function () {
              var _ = j;
              j = S;
              try {
                return O.apply(this, arguments);
              } finally {
                j = _;
              }
            };
          }));
      })(Hi)),
    Hi
  );
}
var Ku;
function ff() {
  return (Ku || ((Ku = 1), (Fi.exports = cf())), Fi.exports);
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ju;
function pf() {
  if (Ju) return et;
  Ju = 1;
  var c = Gi(),
    k = ff();
  function f(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++)
      t += "&args[]=" + encodeURIComponent(arguments[n]);
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  var W = new Set(),
    v = {};
  function w(e, t) {
    (C(e, t), C(e + "Capture", t));
  }
  function C(e, t) {
    for (v[e] = t, e = 0; e < t.length; e++) W.add(t[e]);
  }
  var F = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    D = Object.prototype.hasOwnProperty,
    N =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    R = {},
    E = {};
  function j(e) {
    return D.call(E, e) ? !0 : D.call(R, e) ? !1 : N.test(e) ? (E[e] = !0) : ((R[e] = !0), !1);
  }
  function B(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : n !== null ? !n.acceptsBooleans : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function Y(e, t, n, r) {
    if (t === null || typeof t > "u" || B(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null)
      switch (n.type) {
        case 3:
          return !t;
        case 4:
          return t === !1;
        case 5:
          return isNaN(t);
        case 6:
          return isNaN(t) || 1 > t;
      }
    return !1;
  }
  function Z(e, t, n, r, o, l, s) {
    ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
      (this.attributeName = r),
      (this.attributeNamespace = o),
      (this.mustUseProperty = n),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = l),
      (this.removeEmptyString = s));
  }
  var g = {};
  ("children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
    .split(" ")
    .forEach(function (e) {
      g[e] = new Z(e, 0, !1, e, null, !1, !1);
    }),
    [
      ["acceptCharset", "accept-charset"],
      ["className", "class"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
    ].forEach(function (e) {
      var t = e[0];
      g[t] = new Z(t, 1, !1, e[1], null, !1, !1);
    }),
    ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
      g[e] = new Z(e, 2, !1, e.toLowerCase(), null, !1, !1);
    }),
    ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
      g[e] = new Z(e, 2, !1, e, null, !1, !1);
    }),
    "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
      .split(" ")
      .forEach(function (e) {
        g[e] = new Z(e, 3, !1, e.toLowerCase(), null, !1, !1);
      }),
    ["checked", "multiple", "muted", "selected"].forEach(function (e) {
      g[e] = new Z(e, 3, !0, e, null, !1, !1);
    }),
    ["capture", "download"].forEach(function (e) {
      g[e] = new Z(e, 4, !1, e, null, !1, !1);
    }),
    ["cols", "rows", "size", "span"].forEach(function (e) {
      g[e] = new Z(e, 6, !1, e, null, !1, !1);
    }),
    ["rowSpan", "start"].forEach(function (e) {
      g[e] = new Z(e, 5, !1, e.toLowerCase(), null, !1, !1);
    }));
  var M = /[\-:]([a-z])/g;
  function T(e) {
    return e[1].toUpperCase();
  }
  ("accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (e) {
      var t = e.replace(M, T);
      g[t] = new Z(t, 1, !1, e, null, !1, !1);
    }),
    "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
      var t = e.replace(M, T);
      g[t] = new Z(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
    }),
    ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
      var t = e.replace(M, T);
      g[t] = new Z(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
    }),
    ["tabIndex", "crossOrigin"].forEach(function (e) {
      g[e] = new Z(e, 1, !1, e.toLowerCase(), null, !1, !1);
    }),
    (g.xlinkHref = new Z("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1)),
    ["src", "href", "action", "formAction"].forEach(function (e) {
      g[e] = new Z(e, 1, !1, e.toLowerCase(), null, !0, !0);
    }));
  function le(e, t, n, r) {
    var o = g.hasOwnProperty(t) ? g[t] : null;
    (o !== null ? o.type !== 0 : r || !(2 < t.length) || (t[0] !== "o" && t[0] !== "O") || (t[1] !== "n" && t[1] !== "N")) &&
      (Y(t, n, o, r) && (n = null),
      r || o === null
        ? j(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
        : o.mustUseProperty
          ? (e[o.propertyName] = n === null ? (o.type === 3 ? !1 : "") : n)
          : ((t = o.attributeName),
            (r = o.attributeNamespace),
            n === null
              ? e.removeAttribute(t)
              : ((o = o.type), (n = o === 3 || (o === 4 && n === !0) ? "" : "" + n), r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ae = c.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    ue = Symbol.for("react.element"),
    me = Symbol.for("react.portal"),
    Ce = Symbol.for("react.fragment"),
    A = Symbol.for("react.strict_mode"),
    de = Symbol.for("react.profiler"),
    He = Symbol.for("react.provider"),
    Re = Symbol.for("react.context"),
    Ie = Symbol.for("react.forward_ref"),
    ze = Symbol.for("react.suspense"),
    Ne = Symbol.for("react.suspense_list"),
    we = Symbol.for("react.memo"),
    fe = Symbol.for("react.lazy"),
    ce = Symbol.for("react.offscreen"),
    O = Symbol.iterator;
  function S(e) {
    return e === null || typeof e != "object" ? null : ((e = (O && e[O]) || e["@@iterator"]), typeof e == "function" ? e : null);
  }
  var _ = Object.assign,
    a;
  function x(e) {
    if (a === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        a = (t && t[1]) || "";
      }
    return (
      `
` +
      a +
      e
    );
  }
  var K = !1;
  function q(e, t) {
    if (!e || K) return "";
    K = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t)
        if (
          ((t = function () {
            throw Error();
          }),
          Object.defineProperty(t.prototype, "props", {
            set: function () {
              throw Error();
            },
          }),
          typeof Reflect == "object" && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, []);
          } catch (y) {
            var r = y;
          }
          Reflect.construct(e, [], t);
        } else {
          try {
            t.call();
          } catch (y) {
            r = y;
          }
          e.call(t.prototype);
        }
      else {
        try {
          throw Error();
        } catch (y) {
          r = y;
        }
        e();
      }
    } catch (y) {
      if (y && r && typeof y.stack == "string") {
        for (
          var o = y.stack.split(`
`),
            l = r.stack.split(`
`),
            s = o.length - 1,
            u = l.length - 1;
          1 <= s && 0 <= u && o[s] !== l[u];
        )
          u--;
        for (; 1 <= s && 0 <= u; s--, u--)
          if (o[s] !== l[u]) {
            if (s !== 1 || u !== 1)
              do
                if ((s--, u--, 0 > u || o[s] !== l[u])) {
                  var d =
                    `
` + o[s].replace(" at new ", " at ");
                  return (e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), d);
                }
              while (1 <= s && 0 <= u);
            break;
          }
      }
    } finally {
      ((K = !1), (Error.prepareStackTrace = n));
    }
    return (e = e ? e.displayName || e.name : "") ? x(e) : "";
  }
  function te(e) {
    switch (e.tag) {
      case 5:
        return x(e.type);
      case 16:
        return x("Lazy");
      case 13:
        return x("Suspense");
      case 19:
        return x("SuspenseList");
      case 0:
      case 2:
      case 15:
        return ((e = q(e.type, !1)), e);
      case 11:
        return ((e = q(e.type.render, !1)), e);
      case 1:
        return ((e = q(e.type, !0)), e);
      default:
        return "";
    }
  }
  function oe(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ce:
        return "Fragment";
      case me:
        return "Portal";
      case de:
        return "Profiler";
      case A:
        return "StrictMode";
      case ze:
        return "Suspense";
      case Ne:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Re:
          return (e.displayName || "Context") + ".Consumer";
        case He:
          return (e._context.displayName || "Context") + ".Provider";
        case Ie:
          var t = e.render;
          return ((e = e.displayName), e || ((e = t.displayName || t.name || ""), (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")), e);
        case we:
          return ((t = e.displayName || null), t !== null ? t : oe(e.type) || "Memo");
        case fe:
          ((t = e._payload), (e = e._init));
          try {
            return oe(e(t));
          } catch {}
      }
    return null;
  }
  function G(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return ((e = t.render), (e = e.displayName || e.name || ""), t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"));
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return oe(t);
      case 8:
        return t === A ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function ne(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ge(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Ve(e) {
    var t = ge(e) ? "checked" : "value",
      n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
      r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var o = n.get,
        l = n.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return o.call(this);
          },
          set: function (s) {
            ((r = "" + s), l.call(this, s));
          },
        }),
        Object.defineProperty(e, t, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return r;
          },
          setValue: function (s) {
            r = "" + s;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function fn(e) {
    e._valueTracker || (e._valueTracker = Ve(e));
  }
  function Ji(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      r = "";
    return (e && (r = ge(e) ? (e.checked ? "true" : "false") : e.value), (e = r), e !== n ? (t.setValue(e), !0) : !1);
  }
  function zr(e) {
    if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function $o(e, t) {
    var n = t.checked;
    return _({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Xi(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue,
      r = t.checked != null ? t.checked : t.defaultChecked;
    ((n = ne(t.value != null ? t.value : n)),
      (e._wrapperState = {
        initialChecked: r,
        initialValue: n,
        controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null,
      }));
  }
  function Zi(e, t) {
    ((t = t.checked), t != null && le(e, "checked", t, !1));
  }
  function Bo(e, t) {
    Zi(e, t);
    var n = ne(t.value),
      r = t.type;
    if (n != null) r === "number" ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    (t.hasOwnProperty("value") ? Vo(e, t.type, n) : t.hasOwnProperty("defaultValue") && Vo(e, t.type, ne(t.defaultValue)),
      t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked));
  }
  function qi(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!((r !== "submit" && r !== "reset") || (t.value !== void 0 && t.value !== null))) return;
      ((t = "" + e._wrapperState.initialValue), n || t === e.value || (e.value = t), (e.defaultValue = t));
    }
    ((n = e.name), n !== "" && (e.name = ""), (e.defaultChecked = !!e._wrapperState.initialChecked), n !== "" && (e.name = n));
  }
  function Vo(e, t, n) {
    (t !== "number" || zr(e.ownerDocument) !== e) &&
      (n == null ? (e.defaultValue = "" + e._wrapperState.initialValue) : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Fn = Array.isArray;
  function pn(e, t, n, r) {
    if (((e = e.options), t)) {
      t = {};
      for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
      for (n = 0; n < e.length; n++)
        ((o = t.hasOwnProperty("$" + e[n].value)), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0));
    } else {
      for (n = "" + ne(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) {
          ((e[o].selected = !0), r && (e[o].defaultSelected = !0));
          return;
        }
        t !== null || e[o].disabled || (t = e[o]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Qo(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(f(91));
    return _({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function es(e, t) {
    var n = t.value;
    if (n == null) {
      if (((n = t.children), (t = t.defaultValue), n != null)) {
        if (t != null) throw Error(f(92));
        if (Fn(n)) {
          if (1 < n.length) throw Error(f(93));
          n = n[0];
        }
        t = n;
      }
      (t == null && (t = ""), (n = t));
    }
    e._wrapperState = { initialValue: ne(n) };
  }
  function ts(e, t) {
    var n = ne(t.value),
      r = ne(t.defaultValue);
    (n != null && ((n = "" + n), n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
      r != null && (e.defaultValue = "" + r));
  }
  function ns(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function rs(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Go(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml"
      ? rs(t)
      : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
        ? "http://www.w3.org/1999/xhtml"
        : e;
  }
  var Er,
    os = (function (e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
        ? function (t, n, r, o) {
            MSApp.execUnsafeLocalFunction(function () {
              return e(t, n, r, o);
            });
          }
        : e;
    })(function (e, t) {
      if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
      else {
        for (Er = Er || document.createElement("div"), Er.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Er.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; t.firstChild; ) e.appendChild(t.firstChild);
      }
    });
  function Hn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var An = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    cd = ["Webkit", "ms", "Moz", "O"];
  Object.keys(An).forEach(function (e) {
    cd.forEach(function (t) {
      ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (An[t] = An[e]));
    });
  });
  function ls(e, t, n) {
    return t == null || typeof t == "boolean" || t === ""
      ? ""
      : n || typeof t != "number" || t === 0 || (An.hasOwnProperty(e) && An[e])
        ? ("" + t).trim()
        : t + "px";
  }
  function is(e, t) {
    e = e.style;
    for (var n in t)
      if (t.hasOwnProperty(n)) {
        var r = n.indexOf("--") === 0,
          o = ls(n, t[n], r);
        (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o));
      }
  }
  var fd = _(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    },
  );
  function Yo(e, t) {
    if (t) {
      if (fd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(f(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(f(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(f(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(f(62));
    }
  }
  function Ko(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Jo = null;
  function Xo(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var Zo = null,
    mn = null,
    hn = null;
  function ss(e) {
    if ((e = ur(e))) {
      if (typeof Zo != "function") throw Error(f(280));
      var t = e.stateNode;
      t && ((t = Xr(t)), Zo(e.stateNode, e.type, t));
    }
  }
  function as(e) {
    mn ? (hn ? hn.push(e) : (hn = [e])) : (mn = e);
  }
  function us() {
    if (mn) {
      var e = mn,
        t = hn;
      if (((hn = mn = null), ss(e), t)) for (e = 0; e < t.length; e++) ss(t[e]);
    }
  }
  function ds(e, t) {
    return e(t);
  }
  function cs() {}
  var qo = !1;
  function fs(e, t, n) {
    if (qo) return e(t, n);
    qo = !0;
    try {
      return ds(e, t, n);
    } finally {
      ((qo = !1), (mn !== null || hn !== null) && (cs(), us()));
    }
  }
  function Un(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Xr(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((r = !r.disabled) || ((e = e.type), (r = !(e === "button" || e === "input" || e === "select" || e === "textarea"))), (e = !r));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(f(231, t, typeof n));
    return n;
  }
  var el = !1;
  if (F)
    try {
      var $n = {};
      (Object.defineProperty($n, "passive", {
        get: function () {
          el = !0;
        },
      }),
        window.addEventListener("test", $n, $n),
        window.removeEventListener("test", $n, $n));
    } catch {
      el = !1;
    }
  function pd(e, t, n, r, o, l, s, u, d) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (z) {
      this.onError(z);
    }
  }
  var Bn = !1,
    Pr = null,
    _r = !1,
    tl = null,
    md = {
      onError: function (e) {
        ((Bn = !0), (Pr = e));
      },
    };
  function hd(e, t, n, r, o, l, s, u, d) {
    ((Bn = !1), (Pr = null), pd.apply(md, arguments));
  }
  function gd(e, t, n, r, o, l, s, u, d) {
    if ((hd.apply(this, arguments), Bn)) {
      if (Bn) {
        var y = Pr;
        ((Bn = !1), (Pr = null));
      } else throw Error(f(198));
      _r || ((_r = !0), (tl = y));
    }
  }
  function Xt(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function ps(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null)) return t.dehydrated;
    }
    return null;
  }
  function ms(e) {
    if (Xt(e) !== e) throw Error(f(188));
  }
  function yd(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = Xt(e)), t === null)) throw Error(f(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var o = n.return;
      if (o === null) break;
      var l = o.alternate;
      if (l === null) {
        if (((r = o.return), r !== null)) {
          n = r;
          continue;
        }
        break;
      }
      if (o.child === l.child) {
        for (l = o.child; l; ) {
          if (l === n) return (ms(o), e);
          if (l === r) return (ms(o), t);
          l = l.sibling;
        }
        throw Error(f(188));
      }
      if (n.return !== r.return) ((n = o), (r = l));
      else {
        for (var s = !1, u = o.child; u; ) {
          if (u === n) {
            ((s = !0), (n = o), (r = l));
            break;
          }
          if (u === r) {
            ((s = !0), (r = o), (n = l));
            break;
          }
          u = u.sibling;
        }
        if (!s) {
          for (u = l.child; u; ) {
            if (u === n) {
              ((s = !0), (n = l), (r = o));
              break;
            }
            if (u === r) {
              ((s = !0), (r = l), (n = o));
              break;
            }
            u = u.sibling;
          }
          if (!s) throw Error(f(189));
        }
      }
      if (n.alternate !== r) throw Error(f(190));
    }
    if (n.tag !== 3) throw Error(f(188));
    return n.stateNode.current === n ? e : t;
  }
  function hs(e) {
    return ((e = yd(e)), e !== null ? gs(e) : null);
  }
  function gs(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = gs(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var ys = k.unstable_scheduleCallback,
    vs = k.unstable_cancelCallback,
    vd = k.unstable_shouldYield,
    xd = k.unstable_requestPaint,
    Ee = k.unstable_now,
    kd = k.unstable_getCurrentPriorityLevel,
    nl = k.unstable_ImmediatePriority,
    xs = k.unstable_UserBlockingPriority,
    Tr = k.unstable_NormalPriority,
    wd = k.unstable_LowPriority,
    ks = k.unstable_IdlePriority,
    Lr = null,
    xt = null;
  function Sd(e) {
    if (xt && typeof xt.onCommitFiberRoot == "function")
      try {
        xt.onCommitFiberRoot(Lr, e, void 0, (e.current.flags & 128) === 128);
      } catch {}
  }
  var ct = Math.clz32 ? Math.clz32 : bd,
    jd = Math.log,
    Nd = Math.LN2;
  function bd(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((jd(e) / Nd) | 0)) | 0);
  }
  var Dr = 64,
    Mr = 4194304;
  function Vn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function Or(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0,
      o = e.suspendedLanes,
      l = e.pingedLanes,
      s = n & 268435455;
    if (s !== 0) {
      var u = s & ~o;
      u !== 0 ? (r = Vn(u)) : ((l &= s), l !== 0 && (r = Vn(l)));
    } else ((s = n & ~o), s !== 0 ? (r = Vn(s)) : l !== 0 && (r = Vn(l)));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & o) === 0 && ((o = r & -r), (l = t & -t), o >= l || (o === 16 && (l & 4194240) !== 0))) return t;
    if (((r & 4) !== 0 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
      for (e = e.entanglements, t &= r; 0 < t; ) ((n = 31 - ct(t)), (o = 1 << n), (r |= e[n]), (t &= ~o));
    return r;
  }
  function Cd(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function zd(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, o = e.expirationTimes, l = e.pendingLanes; 0 < l; ) {
      var s = 31 - ct(l),
        u = 1 << s,
        d = o[s];
      (d === -1 ? ((u & n) === 0 || (u & r) !== 0) && (o[s] = Cd(u, t)) : d <= t && (e.expiredLanes |= u), (l &= ~u));
    }
  }
  function rl(e) {
    return ((e = e.pendingLanes & -1073741825), e !== 0 ? e : e & 1073741824 ? 1073741824 : 0);
  }
  function ws() {
    var e = Dr;
    return ((Dr <<= 1), (Dr & 4194240) === 0 && (Dr = 64), e);
  }
  function ol(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Qn(e, t, n) {
    ((e.pendingLanes |= t), t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)), (e = e.eventTimes), (t = 31 - ct(t)), (e[t] = n));
  }
  function Ed(e, t) {
    var n = e.pendingLanes & ~t;
    ((e.pendingLanes = t),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.expiredLanes &= t),
      (e.mutableReadLanes &= t),
      (e.entangledLanes &= t),
      (t = e.entanglements));
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var o = 31 - ct(n),
        l = 1 << o;
      ((t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~l));
    }
  }
  function ll(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var r = 31 - ct(n),
        o = 1 << r;
      ((o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o));
    }
  }
  var pe = 0;
  function Ss(e) {
    return ((e &= -e), 1 < e ? (4 < e ? ((e & 268435455) !== 0 ? 16 : 536870912) : 4) : 1);
  }
  var js,
    il,
    Ns,
    bs,
    Cs,
    sl = !1,
    Rr = [],
    Lt = null,
    Dt = null,
    Mt = null,
    Gn = new Map(),
    Yn = new Map(),
    Ot = [],
    Pd =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
        " ",
      );
  function zs(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Lt = null;
        break;
      case "dragenter":
      case "dragleave":
        Dt = null;
        break;
      case "mouseover":
      case "mouseout":
        Mt = null;
        break;
      case "pointerover":
      case "pointerout":
        Gn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Yn.delete(t.pointerId);
    }
  }
  function Kn(e, t, n, r, o, l) {
    return e === null || e.nativeEvent !== l
      ? ((e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: l, targetContainers: [o] }),
        t !== null && ((t = ur(t)), t !== null && il(t)),
        e)
      : ((e.eventSystemFlags |= r), (t = e.targetContainers), o !== null && t.indexOf(o) === -1 && t.push(o), e);
  }
  function _d(e, t, n, r, o) {
    switch (t) {
      case "focusin":
        return ((Lt = Kn(Lt, e, t, n, r, o)), !0);
      case "dragenter":
        return ((Dt = Kn(Dt, e, t, n, r, o)), !0);
      case "mouseover":
        return ((Mt = Kn(Mt, e, t, n, r, o)), !0);
      case "pointerover":
        var l = o.pointerId;
        return (Gn.set(l, Kn(Gn.get(l) || null, e, t, n, r, o)), !0);
      case "gotpointercapture":
        return ((l = o.pointerId), Yn.set(l, Kn(Yn.get(l) || null, e, t, n, r, o)), !0);
    }
    return !1;
  }
  function Es(e) {
    var t = Zt(e.target);
    if (t !== null) {
      var n = Xt(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = ps(n)), t !== null)) {
            ((e.blockedOn = t),
              Cs(e.priority, function () {
                Ns(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ir(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ul(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ((Jo = r), n.target.dispatchEvent(r), (Jo = null));
      } else return ((t = ur(n)), t !== null && il(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function Ps(e, t, n) {
    Ir(e) && n.delete(t);
  }
  function Td() {
    ((sl = !1),
      Lt !== null && Ir(Lt) && (Lt = null),
      Dt !== null && Ir(Dt) && (Dt = null),
      Mt !== null && Ir(Mt) && (Mt = null),
      Gn.forEach(Ps),
      Yn.forEach(Ps));
  }
  function Jn(e, t) {
    e.blockedOn === t && ((e.blockedOn = null), sl || ((sl = !0), k.unstable_scheduleCallback(k.unstable_NormalPriority, Td)));
  }
  function Xn(e) {
    function t(o) {
      return Jn(o, e);
    }
    if (0 < Rr.length) {
      Jn(Rr[0], e);
      for (var n = 1; n < Rr.length; n++) {
        var r = Rr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Lt !== null && Jn(Lt, e), Dt !== null && Jn(Dt, e), Mt !== null && Jn(Mt, e), Gn.forEach(t), Yn.forEach(t), n = 0; n < Ot.length; n++)
      ((r = Ot[n]), r.blockedOn === e && (r.blockedOn = null));
    for (; 0 < Ot.length && ((n = Ot[0]), n.blockedOn === null); ) (Es(n), n.blockedOn === null && Ot.shift());
  }
  var gn = ae.ReactCurrentBatchConfig,
    Wr = !0;
  function Ld(e, t, n, r) {
    var o = pe,
      l = gn.transition;
    gn.transition = null;
    try {
      ((pe = 1), al(e, t, n, r));
    } finally {
      ((pe = o), (gn.transition = l));
    }
  }
  function Dd(e, t, n, r) {
    var o = pe,
      l = gn.transition;
    gn.transition = null;
    try {
      ((pe = 4), al(e, t, n, r));
    } finally {
      ((pe = o), (gn.transition = l));
    }
  }
  function al(e, t, n, r) {
    if (Wr) {
      var o = ul(e, t, n, r);
      if (o === null) (Cl(e, t, r, Fr, n), zs(e, r));
      else if (_d(o, e, t, n, r)) r.stopPropagation();
      else if ((zs(e, r), t & 4 && -1 < Pd.indexOf(e))) {
        for (; o !== null; ) {
          var l = ur(o);
          if ((l !== null && js(l), (l = ul(e, t, n, r)), l === null && Cl(e, t, r, Fr, n), l === o)) break;
          o = l;
        }
        o !== null && r.stopPropagation();
      } else Cl(e, t, r, null, n);
    }
  }
  var Fr = null;
  function ul(e, t, n, r) {
    if (((Fr = null), (e = Xo(r)), (e = Zt(e)), e !== null))
      if (((t = Xt(e)), t === null)) e = null;
      else if (((n = t.tag), n === 13)) {
        if (((e = ps(t)), e !== null)) return e;
        e = null;
      } else if (n === 3) {
        if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
        e = null;
      } else t !== e && (e = null);
    return ((Fr = e), null);
  }
  function _s(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (kd()) {
          case nl:
            return 1;
          case xs:
            return 4;
          case Tr:
          case wd:
            return 16;
          case ks:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Rt = null,
    dl = null,
    Hr = null;
  function Ts() {
    if (Hr) return Hr;
    var e,
      t = dl,
      n = t.length,
      r,
      o = "value" in Rt ? Rt.value : Rt.textContent,
      l = o.length;
    for (e = 0; e < n && t[e] === o[e]; e++);
    var s = n - e;
    for (r = 1; r <= s && t[n - r] === o[l - r]; r++);
    return (Hr = o.slice(e, 1 < r ? 1 - r : void 0));
  }
  function Ar(e) {
    var t = e.keyCode;
    return ("charCode" in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t), e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0);
  }
  function Ur() {
    return !0;
  }
  function Ls() {
    return !1;
  }
  function tt(e) {
    function t(n, r, o, l, s) {
      ((this._reactName = n), (this._targetInst = o), (this.type = r), (this.nativeEvent = l), (this.target = s), (this.currentTarget = null));
      for (var u in e) e.hasOwnProperty(u) && ((n = e[u]), (this[u] = n ? n(l) : l[u]));
      return (
        (this.isDefaultPrevented = (l.defaultPrevented != null ? l.defaultPrevented : l.returnValue === !1) ? Ur : Ls),
        (this.isPropagationStopped = Ls),
        this
      );
    }
    return (
      _(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), (this.isDefaultPrevented = Ur));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), (this.isPropagationStopped = Ur));
        },
        persist: function () {},
        isPersistent: Ur,
      }),
      t
    );
  }
  var yn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    cl = tt(yn),
    Zn = _({}, yn, { view: 0, detail: 0 }),
    Md = tt(Zn),
    fl,
    pl,
    qn,
    $r = _({}, Zn, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: hl,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0 ? (e.fromElement === e.srcElement ? e.toElement : e.fromElement) : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== qn && (qn && e.type === "mousemove" ? ((fl = e.screenX - qn.screenX), (pl = e.screenY - qn.screenY)) : (pl = fl = 0), (qn = e)),
            fl);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : pl;
      },
    }),
    Ds = tt($r),
    Od = _({}, $r, { dataTransfer: 0 }),
    Rd = tt(Od),
    Id = _({}, Zn, { relatedTarget: 0 }),
    ml = tt(Id),
    Wd = _({}, yn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Fd = tt(Wd),
    Hd = _({}, yn, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    Ad = tt(Hd),
    Ud = _({}, yn, { data: 0 }),
    Ms = tt(Ud),
    $d = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    Bd = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    Vd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Qd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Vd[e]) ? !!t[e] : !1;
  }
  function hl() {
    return Qd;
  }
  var Gd = _({}, Zn, {
      key: function (e) {
        if (e.key) {
          var t = $d[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = Ar(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? Bd[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: hl,
      charCode: function (e) {
        return e.type === "keypress" ? Ar(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress" ? Ar(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
    }),
    Yd = tt(Gd),
    Kd = _({}, $r, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Os = tt(Kd),
    Jd = _({}, Zn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: hl }),
    Xd = tt(Jd),
    Zd = _({}, yn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    qd = tt(Zd),
    ec = _({}, $r, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    tc = tt(ec),
    nc = [9, 13, 27, 32],
    gl = F && "CompositionEvent" in window,
    er = null;
  F && "documentMode" in document && (er = document.documentMode);
  var rc = F && "TextEvent" in window && !er,
    Rs = F && (!gl || (er && 8 < er && 11 >= er)),
    Is = " ",
    Ws = !1;
  function Fs(e, t) {
    switch (e) {
      case "keyup":
        return nc.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Hs(e) {
    return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
  }
  var vn = !1;
  function oc(e, t) {
    switch (e) {
      case "compositionend":
        return Hs(t);
      case "keypress":
        return t.which !== 32 ? null : ((Ws = !0), Is);
      case "textInput":
        return ((e = t.data), e === Is && Ws ? null : e);
      default:
        return null;
    }
  }
  function lc(e, t) {
    if (vn) return e === "compositionend" || (!gl && Fs(e, t)) ? ((e = Ts()), (Hr = dl = Rt = null), (vn = !1), e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Rs && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var ic = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function As(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!ic[e.type] : t === "textarea";
  }
  function Us(e, t, n, r) {
    (as(r), (t = Yr(t, "onChange")), 0 < t.length && ((n = new cl("onChange", "change", null, n, r)), e.push({ event: n, listeners: t })));
  }
  var tr = null,
    nr = null;
  function sc(e) {
    ia(e, 0);
  }
  function Br(e) {
    var t = jn(e);
    if (Ji(t)) return e;
  }
  function ac(e, t) {
    if (e === "change") return t;
  }
  var $s = !1;
  if (F) {
    var yl;
    if (F) {
      var vl = "oninput" in document;
      if (!vl) {
        var Bs = document.createElement("div");
        (Bs.setAttribute("oninput", "return;"), (vl = typeof Bs.oninput == "function"));
      }
      yl = vl;
    } else yl = !1;
    $s = yl && (!document.documentMode || 9 < document.documentMode);
  }
  function Vs() {
    tr && (tr.detachEvent("onpropertychange", Qs), (nr = tr = null));
  }
  function Qs(e) {
    if (e.propertyName === "value" && Br(nr)) {
      var t = [];
      (Us(t, nr, e, Xo(e)), fs(sc, t));
    }
  }
  function uc(e, t, n) {
    e === "focusin" ? (Vs(), (tr = t), (nr = n), tr.attachEvent("onpropertychange", Qs)) : e === "focusout" && Vs();
  }
  function dc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Br(nr);
  }
  function cc(e, t) {
    if (e === "click") return Br(t);
  }
  function fc(e, t) {
    if (e === "input" || e === "change") return Br(t);
  }
  function pc(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var ft = typeof Object.is == "function" ? Object.is : pc;
  function rr(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e),
      r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var o = n[r];
      if (!D.call(t, o) || !ft(e[o], t[o])) return !1;
    }
    return !0;
  }
  function Gs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ys(e, t) {
    var n = Gs(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Gs(n);
    }
  }
  function Ks(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Ks(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Js() {
    for (var e = window, t = zr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = zr(e.document);
    }
    return t;
  }
  function xl(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  function mc(e) {
    var t = Js(),
      n = e.focusedElem,
      r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Ks(n.ownerDocument.documentElement, n)) {
      if (r !== null && xl(n)) {
        if (((t = r.start), (e = r.end), e === void 0 && (e = t), "selectionStart" in n))
          ((n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length)));
        else if (((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)) {
          e = e.getSelection();
          var o = n.textContent.length,
            l = Math.min(r.start, o);
          ((r = r.end === void 0 ? l : Math.min(r.end, o)), !e.extend && l > r && ((o = r), (r = l), (l = o)), (o = Ys(n, l)));
          var s = Ys(n, r);
          o &&
            s &&
            (e.rangeCount !== 1 || e.anchorNode !== o.node || e.anchorOffset !== o.offset || e.focusNode !== s.node || e.focusOffset !== s.offset) &&
            ((t = t.createRange()),
            t.setStart(o.node, o.offset),
            e.removeAllRanges(),
            l > r ? (e.addRange(t), e.extend(s.node, s.offset)) : (t.setEnd(s.node, s.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; (e = e.parentNode); ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
        ((e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top));
    }
  }
  var hc = F && "documentMode" in document && 11 >= document.documentMode,
    xn = null,
    kl = null,
    or = null,
    wl = !1;
  function Xs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    wl ||
      xn == null ||
      xn !== zr(r) ||
      ((r = xn),
      "selectionStart" in r && xl(r)
        ? (r = { start: r.selectionStart, end: r.selectionEnd })
        : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
          (r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset })),
      (or && rr(or, r)) ||
        ((or = r),
        (r = Yr(kl, "onSelect")),
        0 < r.length && ((t = new cl("onSelect", "select", null, t, n)), e.push({ event: t, listeners: r }), (t.target = xn))));
  }
  function Vr(e, t) {
    var n = {};
    return ((n[e.toLowerCase()] = t.toLowerCase()), (n["Webkit" + e] = "webkit" + t), (n["Moz" + e] = "moz" + t), n);
  }
  var kn = {
      animationend: Vr("Animation", "AnimationEnd"),
      animationiteration: Vr("Animation", "AnimationIteration"),
      animationstart: Vr("Animation", "AnimationStart"),
      transitionend: Vr("Transition", "TransitionEnd"),
    },
    Sl = {},
    Zs = {};
  F &&
    ((Zs = document.createElement("div").style),
    "AnimationEvent" in window || (delete kn.animationend.animation, delete kn.animationiteration.animation, delete kn.animationstart.animation),
    "TransitionEvent" in window || delete kn.transitionend.transition);
  function Qr(e) {
    if (Sl[e]) return Sl[e];
    if (!kn[e]) return e;
    var t = kn[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in Zs) return (Sl[e] = t[n]);
    return e;
  }
  var qs = Qr("animationend"),
    ea = Qr("animationiteration"),
    ta = Qr("animationstart"),
    na = Qr("transitionend"),
    ra = new Map(),
    oa =
      "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  function It(e, t) {
    (ra.set(e, t), w(t, [e]));
  }
  for (var jl = 0; jl < oa.length; jl++) {
    var Nl = oa[jl],
      gc = Nl.toLowerCase(),
      yc = Nl[0].toUpperCase() + Nl.slice(1);
    It(gc, "on" + yc);
  }
  (It(qs, "onAnimationEnd"),
    It(ea, "onAnimationIteration"),
    It(ta, "onAnimationStart"),
    It("dblclick", "onDoubleClick"),
    It("focusin", "onFocus"),
    It("focusout", "onBlur"),
    It(na, "onTransitionEnd"),
    C("onMouseEnter", ["mouseout", "mouseover"]),
    C("onMouseLeave", ["mouseout", "mouseover"]),
    C("onPointerEnter", ["pointerout", "pointerover"]),
    C("onPointerLeave", ["pointerout", "pointerover"]),
    w("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    w("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    w("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    w("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    w("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    w("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" ")));
  var lr =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    vc = new Set("cancel close invalid load scroll toggle".split(" ").concat(lr));
  function la(e, t, n) {
    var r = e.type || "unknown-event";
    ((e.currentTarget = n), gd(r, t, void 0, e), (e.currentTarget = null));
  }
  function ia(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n],
        o = r.event;
      r = r.listeners;
      e: {
        var l = void 0;
        if (t)
          for (var s = r.length - 1; 0 <= s; s--) {
            var u = r[s],
              d = u.instance,
              y = u.currentTarget;
            if (((u = u.listener), d !== l && o.isPropagationStopped())) break e;
            (la(o, u, y), (l = d));
          }
        else
          for (s = 0; s < r.length; s++) {
            if (((u = r[s]), (d = u.instance), (y = u.currentTarget), (u = u.listener), d !== l && o.isPropagationStopped())) break e;
            (la(o, u, y), (l = d));
          }
      }
    }
    if (_r) throw ((e = tl), (_r = !1), (tl = null), e);
  }
  function ve(e, t) {
    var n = t[Ll];
    n === void 0 && (n = t[Ll] = new Set());
    var r = e + "__bubble";
    n.has(r) || (sa(t, e, 2, !1), n.add(r));
  }
  function bl(e, t, n) {
    var r = 0;
    (t && (r |= 4), sa(n, e, r, t));
  }
  var Gr = "_reactListening" + Math.random().toString(36).slice(2);
  function ir(e) {
    if (!e[Gr]) {
      ((e[Gr] = !0),
        W.forEach(function (n) {
          n !== "selectionchange" && (vc.has(n) || bl(n, !1, e), bl(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Gr] || ((t[Gr] = !0), bl("selectionchange", !1, t));
    }
  }
  function sa(e, t, n, r) {
    switch (_s(t)) {
      case 1:
        var o = Ld;
        break;
      case 4:
        o = Dd;
        break;
      default:
        o = al;
    }
    ((n = o.bind(null, t, n, e)),
      (o = void 0),
      !el || (t !== "touchstart" && t !== "touchmove" && t !== "wheel") || (o = !0),
      r
        ? o !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: o })
          : e.addEventListener(t, n, !0)
        : o !== void 0
          ? e.addEventListener(t, n, { passive: o })
          : e.addEventListener(t, n, !1));
  }
  function Cl(e, t, n, r, o) {
    var l = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null)
      e: for (;;) {
        if (r === null) return;
        var s = r.tag;
        if (s === 3 || s === 4) {
          var u = r.stateNode.containerInfo;
          if (u === o || (u.nodeType === 8 && u.parentNode === o)) break;
          if (s === 4)
            for (s = r.return; s !== null; ) {
              var d = s.tag;
              if ((d === 3 || d === 4) && ((d = s.stateNode.containerInfo), d === o || (d.nodeType === 8 && d.parentNode === o))) return;
              s = s.return;
            }
          for (; u !== null; ) {
            if (((s = Zt(u)), s === null)) return;
            if (((d = s.tag), d === 5 || d === 6)) {
              r = l = s;
              continue e;
            }
            u = u.parentNode;
          }
        }
        r = r.return;
      }
    fs(function () {
      var y = l,
        z = Xo(n),
        P = [];
      e: {
        var b = ra.get(e);
        if (b !== void 0) {
          var H = cl,
            $ = e;
          switch (e) {
            case "keypress":
              if (Ar(n) === 0) break e;
            case "keydown":
            case "keyup":
              H = Yd;
              break;
            case "focusin":
              (($ = "focus"), (H = ml));
              break;
            case "focusout":
              (($ = "blur"), (H = ml));
              break;
            case "beforeblur":
            case "afterblur":
              H = ml;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              H = Ds;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              H = Rd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              H = Xd;
              break;
            case qs:
            case ea:
            case ta:
              H = Fd;
              break;
            case na:
              H = qd;
              break;
            case "scroll":
              H = Md;
              break;
            case "wheel":
              H = tc;
              break;
            case "copy":
            case "cut":
            case "paste":
              H = Ad;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              H = Os;
          }
          var V = (t & 4) !== 0,
            Pe = !V && e === "scroll",
            m = V ? (b !== null ? b + "Capture" : null) : b;
          V = [];
          for (var p = y, h; p !== null; ) {
            h = p;
            var L = h.stateNode;
            if ((h.tag === 5 && L !== null && ((h = L), m !== null && ((L = Un(p, m)), L != null && V.push(sr(p, L, h)))), Pe)) break;
            p = p.return;
          }
          0 < V.length && ((b = new H(b, $, null, n, z)), P.push({ event: b, listeners: V }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((b = e === "mouseover" || e === "pointerover"),
            (H = e === "mouseout" || e === "pointerout"),
            b && n !== Jo && ($ = n.relatedTarget || n.fromElement) && (Zt($) || $[Nt]))
          )
            break e;
          if (
            (H || b) &&
            ((b = z.window === z ? z : (b = z.ownerDocument) ? b.defaultView || b.parentWindow : window),
            H
              ? (($ = n.relatedTarget || n.toElement),
                (H = y),
                ($ = $ ? Zt($) : null),
                $ !== null && ((Pe = Xt($)), $ !== Pe || ($.tag !== 5 && $.tag !== 6)) && ($ = null))
              : ((H = null), ($ = y)),
            H !== $)
          ) {
            if (
              ((V = Ds),
              (L = "onMouseLeave"),
              (m = "onMouseEnter"),
              (p = "mouse"),
              (e === "pointerout" || e === "pointerover") && ((V = Os), (L = "onPointerLeave"), (m = "onPointerEnter"), (p = "pointer")),
              (Pe = H == null ? b : jn(H)),
              (h = $ == null ? b : jn($)),
              (b = new V(L, p + "leave", H, n, z)),
              (b.target = Pe),
              (b.relatedTarget = h),
              (L = null),
              Zt(z) === y && ((V = new V(m, p + "enter", $, n, z)), (V.target = h), (V.relatedTarget = Pe), (L = V)),
              (Pe = L),
              H && $)
            )
              t: {
                for (V = H, m = $, p = 0, h = V; h; h = wn(h)) p++;
                for (h = 0, L = m; L; L = wn(L)) h++;
                for (; 0 < p - h; ) ((V = wn(V)), p--);
                for (; 0 < h - p; ) ((m = wn(m)), h--);
                for (; p--; ) {
                  if (V === m || (m !== null && V === m.alternate)) break t;
                  ((V = wn(V)), (m = wn(m)));
                }
                V = null;
              }
            else V = null;
            (H !== null && aa(P, b, H, V, !1), $ !== null && Pe !== null && aa(P, Pe, $, V, !0));
          }
        }
        e: {
          if (((b = y ? jn(y) : window), (H = b.nodeName && b.nodeName.toLowerCase()), H === "select" || (H === "input" && b.type === "file")))
            var Q = ac;
          else if (As(b))
            if ($s) Q = fc;
            else {
              Q = dc;
              var J = uc;
            }
          else (H = b.nodeName) && H.toLowerCase() === "input" && (b.type === "checkbox" || b.type === "radio") && (Q = cc);
          if (Q && (Q = Q(e, y))) {
            Us(P, Q, n, z);
            break e;
          }
          (J && J(e, b, y), e === "focusout" && (J = b._wrapperState) && J.controlled && b.type === "number" && Vo(b, "number", b.value));
        }
        switch (((J = y ? jn(y) : window), e)) {
          case "focusin":
            (As(J) || J.contentEditable === "true") && ((xn = J), (kl = y), (or = null));
            break;
          case "focusout":
            or = kl = xn = null;
            break;
          case "mousedown":
            wl = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((wl = !1), Xs(P, n, z));
            break;
          case "selectionchange":
            if (hc) break;
          case "keydown":
          case "keyup":
            Xs(P, n, z);
        }
        var X;
        if (gl)
          e: {
            switch (e) {
              case "compositionstart":
                var ee = "onCompositionStart";
                break e;
              case "compositionend":
                ee = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ee = "onCompositionUpdate";
                break e;
            }
            ee = void 0;
          }
        else vn ? Fs(e, n) && (ee = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ee = "onCompositionStart");
        (ee &&
          (Rs &&
            n.locale !== "ko" &&
            (vn || ee !== "onCompositionStart"
              ? ee === "onCompositionEnd" && vn && (X = Ts())
              : ((Rt = z), (dl = "value" in Rt ? Rt.value : Rt.textContent), (vn = !0))),
          (J = Yr(y, ee)),
          0 < J.length &&
            ((ee = new Ms(ee, e, null, n, z)), P.push({ event: ee, listeners: J }), X ? (ee.data = X) : ((X = Hs(n)), X !== null && (ee.data = X)))),
          (X = rc ? oc(e, n) : lc(e, n)) &&
            ((y = Yr(y, "onBeforeInput")),
            0 < y.length && ((z = new Ms("onBeforeInput", "beforeinput", null, n, z)), P.push({ event: z, listeners: y }), (z.data = X))));
      }
      ia(P, t);
    });
  }
  function sr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Yr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var o = e,
        l = o.stateNode;
      (o.tag === 5 && l !== null && ((o = l), (l = Un(e, n)), l != null && r.unshift(sr(e, l, o)), (l = Un(e, t)), l != null && r.push(sr(e, l, o))),
        (e = e.return));
    }
    return r;
  }
  function wn(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function aa(e, t, n, r, o) {
    for (var l = t._reactName, s = []; n !== null && n !== r; ) {
      var u = n,
        d = u.alternate,
        y = u.stateNode;
      if (d !== null && d === r) break;
      (u.tag === 5 &&
        y !== null &&
        ((u = y), o ? ((d = Un(n, l)), d != null && s.unshift(sr(n, d, u))) : o || ((d = Un(n, l)), d != null && s.push(sr(n, d, u)))),
        (n = n.return));
    }
    s.length !== 0 && e.push({ event: t, listeners: s });
  }
  var xc = /\r\n?/g,
    kc = /\u0000|\uFFFD/g;
  function ua(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        xc,
        `
`,
      )
      .replace(kc, "");
  }
  function Kr(e, t, n) {
    if (((t = ua(t)), ua(e) !== t && n)) throw Error(f(425));
  }
  function Jr() {}
  var zl = null,
    El = null;
  function Pl(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      (typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var _l = typeof setTimeout == "function" ? setTimeout : void 0,
    wc = typeof clearTimeout == "function" ? clearTimeout : void 0,
    da = typeof Promise == "function" ? Promise : void 0,
    Sc =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof da < "u"
          ? function (e) {
              return da.resolve(null).then(e).catch(jc);
            }
          : _l;
  function jc(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Tl(e, t) {
    var n = t,
      r = 0;
    do {
      var o = n.nextSibling;
      if ((e.removeChild(n), o && o.nodeType === 8))
        if (((n = o.data), n === "/$")) {
          if (r === 0) {
            (e.removeChild(o), Xn(t));
            return;
          }
          r--;
        } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
      n = o;
    } while (n);
    Xn(t);
  }
  function Wt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function ca(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Sn = Math.random().toString(36).slice(2),
    kt = "__reactFiber$" + Sn,
    ar = "__reactProps$" + Sn,
    Nt = "__reactContainer$" + Sn,
    Ll = "__reactEvents$" + Sn,
    Nc = "__reactListeners$" + Sn,
    bc = "__reactHandles$" + Sn;
  function Zt(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[Nt] || n[kt])) {
        if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
          for (e = ca(e); e !== null; ) {
            if ((n = e[kt])) return n;
            e = ca(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function ur(e) {
    return ((e = e[kt] || e[Nt]), !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e);
  }
  function jn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(f(33));
  }
  function Xr(e) {
    return e[ar] || null;
  }
  var Dl = [],
    Nn = -1;
  function Ft(e) {
    return { current: e };
  }
  function xe(e) {
    0 > Nn || ((e.current = Dl[Nn]), (Dl[Nn] = null), Nn--);
  }
  function ye(e, t) {
    (Nn++, (Dl[Nn] = e.current), (e.current = t));
  }
  var Ht = {},
    Ae = Ft(Ht),
    Ke = Ft(!1),
    qt = Ht;
  function bn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ht;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o = {},
      l;
    for (l in n) o[l] = t[l];
    return (r && ((e = e.stateNode), (e.__reactInternalMemoizedUnmaskedChildContext = t), (e.__reactInternalMemoizedMaskedChildContext = o)), o);
  }
  function Je(e) {
    return ((e = e.childContextTypes), e != null);
  }
  function Zr() {
    (xe(Ke), xe(Ae));
  }
  function fa(e, t, n) {
    if (Ae.current !== Ht) throw Error(f(168));
    (ye(Ae, t), ye(Ke, n));
  }
  function pa(e, t, n) {
    var r = e.stateNode;
    if (((t = t.childContextTypes), typeof r.getChildContext != "function")) return n;
    r = r.getChildContext();
    for (var o in r) if (!(o in t)) throw Error(f(108, G(e) || "Unknown", o));
    return _({}, n, r);
  }
  function qr(e) {
    return ((e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Ht), (qt = Ae.current), ye(Ae, e), ye(Ke, Ke.current), !0);
  }
  function ma(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(f(169));
    (n ? ((e = pa(e, t, qt)), (r.__reactInternalMemoizedMergedChildContext = e), xe(Ke), xe(Ae), ye(Ae, e)) : xe(Ke), ye(Ke, n));
  }
  var bt = null,
    eo = !1,
    Ml = !1;
  function ha(e) {
    bt === null ? (bt = [e]) : bt.push(e);
  }
  function Cc(e) {
    ((eo = !0), ha(e));
  }
  function At() {
    if (!Ml && bt !== null) {
      Ml = !0;
      var e = 0,
        t = pe;
      try {
        var n = bt;
        for (pe = 1; e < n.length; e++) {
          var r = n[e];
          do r = r(!0);
          while (r !== null);
        }
        ((bt = null), (eo = !1));
      } catch (o) {
        throw (bt !== null && (bt = bt.slice(e + 1)), ys(nl, At), o);
      } finally {
        ((pe = t), (Ml = !1));
      }
    }
    return null;
  }
  var Cn = [],
    zn = 0,
    to = null,
    no = 0,
    lt = [],
    it = 0,
    en = null,
    Ct = 1,
    zt = "";
  function tn(e, t) {
    ((Cn[zn++] = no), (Cn[zn++] = to), (to = e), (no = t));
  }
  function ga(e, t, n) {
    ((lt[it++] = Ct), (lt[it++] = zt), (lt[it++] = en), (en = e));
    var r = Ct;
    e = zt;
    var o = 32 - ct(r) - 1;
    ((r &= ~(1 << o)), (n += 1));
    var l = 32 - ct(t) + o;
    if (30 < l) {
      var s = o - (o % 5);
      ((l = (r & ((1 << s) - 1)).toString(32)), (r >>= s), (o -= s), (Ct = (1 << (32 - ct(t) + o)) | (n << o) | r), (zt = l + e));
    } else ((Ct = (1 << l) | (n << o) | r), (zt = e));
  }
  function Ol(e) {
    e.return !== null && (tn(e, 1), ga(e, 1, 0));
  }
  function Rl(e) {
    for (; e === to; ) ((to = Cn[--zn]), (Cn[zn] = null), (no = Cn[--zn]), (Cn[zn] = null));
    for (; e === en; ) ((en = lt[--it]), (lt[it] = null), (zt = lt[--it]), (lt[it] = null), (Ct = lt[--it]), (lt[it] = null));
  }
  var nt = null,
    rt = null,
    ke = !1,
    pt = null;
  function ya(e, t) {
    var n = dt(5, null, null, 0);
    ((n.elementType = "DELETED"),
      (n.stateNode = t),
      (n.return = e),
      (t = e.deletions),
      t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
  }
  function va(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return (
          (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
          t !== null ? ((e.stateNode = t), (nt = e), (rt = Wt(t.firstChild)), !0) : !1
        );
      case 6:
        return ((t = e.pendingProps === "" || t.nodeType !== 3 ? null : t), t !== null ? ((e.stateNode = t), (nt = e), (rt = null), !0) : !1);
      case 13:
        return (
          (t = t.nodeType !== 8 ? null : t),
          t !== null
            ? ((n = en !== null ? { id: Ct, overflow: zt } : null),
              (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
              (n = dt(18, null, null, 0)),
              (n.stateNode = t),
              (n.return = e),
              (e.child = n),
              (nt = e),
              (rt = null),
              !0)
            : !1
        );
      default:
        return !1;
    }
  }
  function Il(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Wl(e) {
    if (ke) {
      var t = rt;
      if (t) {
        var n = t;
        if (!va(e, t)) {
          if (Il(e)) throw Error(f(418));
          t = Wt(n.nextSibling);
          var r = nt;
          t && va(e, t) ? ya(r, n) : ((e.flags = (e.flags & -4097) | 2), (ke = !1), (nt = e));
        }
      } else {
        if (Il(e)) throw Error(f(418));
        ((e.flags = (e.flags & -4097) | 2), (ke = !1), (nt = e));
      }
    }
  }
  function xa(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function ro(e) {
    if (e !== nt) return !1;
    if (!ke) return (xa(e), (ke = !0), !1);
    var t;
    if (
      ((t = e.tag !== 3) && !(t = e.tag !== 5) && ((t = e.type), (t = t !== "head" && t !== "body" && !Pl(e.type, e.memoizedProps))), t && (t = rt))
    ) {
      if (Il(e)) throw (ka(), Error(f(418)));
      for (; t; ) (ya(e, t), (t = Wt(t.nextSibling)));
    }
    if ((xa(e), e.tag === 13)) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(f(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                rt = Wt(e.nextSibling);
                break e;
              }
              t--;
            } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
          }
          e = e.nextSibling;
        }
        rt = null;
      }
    } else rt = nt ? Wt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ka() {
    for (var e = rt; e; ) e = Wt(e.nextSibling);
  }
  function En() {
    ((rt = nt = null), (ke = !1));
  }
  function Fl(e) {
    pt === null ? (pt = [e]) : pt.push(e);
  }
  var zc = ae.ReactCurrentBatchConfig;
  function dr(e, t, n) {
    if (((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")) {
      if (n._owner) {
        if (((n = n._owner), n)) {
          if (n.tag !== 1) throw Error(f(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(f(147, e));
        var o = r,
          l = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === l
          ? t.ref
          : ((t = function (s) {
              var u = o.refs;
              s === null ? delete u[l] : (u[l] = s);
            }),
            (t._stringRef = l),
            t);
      }
      if (typeof e != "string") throw Error(f(284));
      if (!n._owner) throw Error(f(290, e));
    }
    return e;
  }
  function oo(e, t) {
    throw (
      (e = Object.prototype.toString.call(t)),
      Error(f(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e))
    );
  }
  function wa(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Sa(e) {
    function t(m, p) {
      if (e) {
        var h = m.deletions;
        h === null ? ((m.deletions = [p]), (m.flags |= 16)) : h.push(p);
      }
    }
    function n(m, p) {
      if (!e) return null;
      for (; p !== null; ) (t(m, p), (p = p.sibling));
      return null;
    }
    function r(m, p) {
      for (m = new Map(); p !== null; ) (p.key !== null ? m.set(p.key, p) : m.set(p.index, p), (p = p.sibling));
      return m;
    }
    function o(m, p) {
      return ((m = Kt(m, p)), (m.index = 0), (m.sibling = null), m);
    }
    function l(m, p, h) {
      return (
        (m.index = h),
        e ? ((h = m.alternate), h !== null ? ((h = h.index), h < p ? ((m.flags |= 2), p) : h) : ((m.flags |= 2), p)) : ((m.flags |= 1048576), p)
      );
    }
    function s(m) {
      return (e && m.alternate === null && (m.flags |= 2), m);
    }
    function u(m, p, h, L) {
      return p === null || p.tag !== 6 ? ((p = _i(h, m.mode, L)), (p.return = m), p) : ((p = o(p, h)), (p.return = m), p);
    }
    function d(m, p, h, L) {
      var Q = h.type;
      return Q === Ce
        ? z(m, p, h.props.children, L, h.key)
        : p !== null && (p.elementType === Q || (typeof Q == "object" && Q !== null && Q.$$typeof === fe && wa(Q) === p.type))
          ? ((L = o(p, h.props)), (L.ref = dr(m, p, h)), (L.return = m), L)
          : ((L = Po(h.type, h.key, h.props, null, m.mode, L)), (L.ref = dr(m, p, h)), (L.return = m), L);
    }
    function y(m, p, h, L) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== h.containerInfo || p.stateNode.implementation !== h.implementation
        ? ((p = Ti(h, m.mode, L)), (p.return = m), p)
        : ((p = o(p, h.children || [])), (p.return = m), p);
    }
    function z(m, p, h, L, Q) {
      return p === null || p.tag !== 7 ? ((p = dn(h, m.mode, L, Q)), (p.return = m), p) : ((p = o(p, h)), (p.return = m), p);
    }
    function P(m, p, h) {
      if ((typeof p == "string" && p !== "") || typeof p == "number") return ((p = _i("" + p, m.mode, h)), (p.return = m), p);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case ue:
            return ((h = Po(p.type, p.key, p.props, null, m.mode, h)), (h.ref = dr(m, null, p)), (h.return = m), h);
          case me:
            return ((p = Ti(p, m.mode, h)), (p.return = m), p);
          case fe:
            var L = p._init;
            return P(m, L(p._payload), h);
        }
        if (Fn(p) || S(p)) return ((p = dn(p, m.mode, h, null)), (p.return = m), p);
        oo(m, p);
      }
      return null;
    }
    function b(m, p, h, L) {
      var Q = p !== null ? p.key : null;
      if ((typeof h == "string" && h !== "") || typeof h == "number") return Q !== null ? null : u(m, p, "" + h, L);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ue:
            return h.key === Q ? d(m, p, h, L) : null;
          case me:
            return h.key === Q ? y(m, p, h, L) : null;
          case fe:
            return ((Q = h._init), b(m, p, Q(h._payload), L));
        }
        if (Fn(h) || S(h)) return Q !== null ? null : z(m, p, h, L, null);
        oo(m, h);
      }
      return null;
    }
    function H(m, p, h, L, Q) {
      if ((typeof L == "string" && L !== "") || typeof L == "number") return ((m = m.get(h) || null), u(p, m, "" + L, Q));
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ue:
            return ((m = m.get(L.key === null ? h : L.key) || null), d(p, m, L, Q));
          case me:
            return ((m = m.get(L.key === null ? h : L.key) || null), y(p, m, L, Q));
          case fe:
            var J = L._init;
            return H(m, p, h, J(L._payload), Q);
        }
        if (Fn(L) || S(L)) return ((m = m.get(h) || null), z(p, m, L, Q, null));
        oo(p, L);
      }
      return null;
    }
    function $(m, p, h, L) {
      for (var Q = null, J = null, X = p, ee = (p = 0), Oe = null; X !== null && ee < h.length; ee++) {
        X.index > ee ? ((Oe = X), (X = null)) : (Oe = X.sibling);
        var se = b(m, X, h[ee], L);
        if (se === null) {
          X === null && (X = Oe);
          break;
        }
        (e && X && se.alternate === null && t(m, X), (p = l(se, p, ee)), J === null ? (Q = se) : (J.sibling = se), (J = se), (X = Oe));
      }
      if (ee === h.length) return (n(m, X), ke && tn(m, ee), Q);
      if (X === null) {
        for (; ee < h.length; ee++) ((X = P(m, h[ee], L)), X !== null && ((p = l(X, p, ee)), J === null ? (Q = X) : (J.sibling = X), (J = X)));
        return (ke && tn(m, ee), Q);
      }
      for (X = r(m, X); ee < h.length; ee++)
        ((Oe = H(X, m, ee, h[ee], L)),
          Oe !== null &&
            (e && Oe.alternate !== null && X.delete(Oe.key === null ? ee : Oe.key),
            (p = l(Oe, p, ee)),
            J === null ? (Q = Oe) : (J.sibling = Oe),
            (J = Oe)));
      return (
        e &&
          X.forEach(function (Jt) {
            return t(m, Jt);
          }),
        ke && tn(m, ee),
        Q
      );
    }
    function V(m, p, h, L) {
      var Q = S(h);
      if (typeof Q != "function") throw Error(f(150));
      if (((h = Q.call(h)), h == null)) throw Error(f(151));
      for (var J = (Q = null), X = p, ee = (p = 0), Oe = null, se = h.next(); X !== null && !se.done; ee++, se = h.next()) {
        X.index > ee ? ((Oe = X), (X = null)) : (Oe = X.sibling);
        var Jt = b(m, X, se.value, L);
        if (Jt === null) {
          X === null && (X = Oe);
          break;
        }
        (e && X && Jt.alternate === null && t(m, X), (p = l(Jt, p, ee)), J === null ? (Q = Jt) : (J.sibling = Jt), (J = Jt), (X = Oe));
      }
      if (se.done) return (n(m, X), ke && tn(m, ee), Q);
      if (X === null) {
        for (; !se.done; ee++, se = h.next())
          ((se = P(m, se.value, L)), se !== null && ((p = l(se, p, ee)), J === null ? (Q = se) : (J.sibling = se), (J = se)));
        return (ke && tn(m, ee), Q);
      }
      for (X = r(m, X); !se.done; ee++, se = h.next())
        ((se = H(X, m, ee, se.value, L)),
          se !== null &&
            (e && se.alternate !== null && X.delete(se.key === null ? ee : se.key),
            (p = l(se, p, ee)),
            J === null ? (Q = se) : (J.sibling = se),
            (J = se)));
      return (
        e &&
          X.forEach(function (sf) {
            return t(m, sf);
          }),
        ke && tn(m, ee),
        Q
      );
    }
    function Pe(m, p, h, L) {
      if ((typeof h == "object" && h !== null && h.type === Ce && h.key === null && (h = h.props.children), typeof h == "object" && h !== null)) {
        switch (h.$$typeof) {
          case ue:
            e: {
              for (var Q = h.key, J = p; J !== null; ) {
                if (J.key === Q) {
                  if (((Q = h.type), Q === Ce)) {
                    if (J.tag === 7) {
                      (n(m, J.sibling), (p = o(J, h.props.children)), (p.return = m), (m = p));
                      break e;
                    }
                  } else if (J.elementType === Q || (typeof Q == "object" && Q !== null && Q.$$typeof === fe && wa(Q) === J.type)) {
                    (n(m, J.sibling), (p = o(J, h.props)), (p.ref = dr(m, J, h)), (p.return = m), (m = p));
                    break e;
                  }
                  n(m, J);
                  break;
                } else t(m, J);
                J = J.sibling;
              }
              h.type === Ce
                ? ((p = dn(h.props.children, m.mode, L, h.key)), (p.return = m), (m = p))
                : ((L = Po(h.type, h.key, h.props, null, m.mode, L)), (L.ref = dr(m, p, h)), (L.return = m), (m = L));
            }
            return s(m);
          case me:
            e: {
              for (J = h.key; p !== null; ) {
                if (p.key === J)
                  if (p.tag === 4 && p.stateNode.containerInfo === h.containerInfo && p.stateNode.implementation === h.implementation) {
                    (n(m, p.sibling), (p = o(p, h.children || [])), (p.return = m), (m = p));
                    break e;
                  } else {
                    n(m, p);
                    break;
                  }
                else t(m, p);
                p = p.sibling;
              }
              ((p = Ti(h, m.mode, L)), (p.return = m), (m = p));
            }
            return s(m);
          case fe:
            return ((J = h._init), Pe(m, p, J(h._payload), L));
        }
        if (Fn(h)) return $(m, p, h, L);
        if (S(h)) return V(m, p, h, L);
        oo(m, h);
      }
      return (typeof h == "string" && h !== "") || typeof h == "number"
        ? ((h = "" + h),
          p !== null && p.tag === 6
            ? (n(m, p.sibling), (p = o(p, h)), (p.return = m), (m = p))
            : (n(m, p), (p = _i(h, m.mode, L)), (p.return = m), (m = p)),
          s(m))
        : n(m, p);
    }
    return Pe;
  }
  var Pn = Sa(!0),
    ja = Sa(!1),
    lo = Ft(null),
    io = null,
    _n = null,
    Hl = null;
  function Al() {
    Hl = _n = io = null;
  }
  function Ul(e) {
    var t = lo.current;
    (xe(lo), (e._currentValue = t));
  }
  function $l(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
          : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function Tn(e, t) {
    ((io = e),
      (Hl = _n = null),
      (e = e.dependencies),
      e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Xe = !0), (e.firstContext = null)));
  }
  function st(e) {
    var t = e._currentValue;
    if (Hl !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), _n === null)) {
        if (io === null) throw Error(f(308));
        ((_n = e), (io.dependencies = { lanes: 0, firstContext: e }));
      } else _n = _n.next = e;
    return t;
  }
  var nn = null;
  function Bl(e) {
    nn === null ? (nn = [e]) : nn.push(e);
  }
  function Na(e, t, n, r) {
    var o = t.interleaved;
    return (o === null ? ((n.next = n), Bl(t)) : ((n.next = o.next), (o.next = n)), (t.interleaved = n), Et(e, r));
  }
  function Et(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
      ((e.childLanes |= t), (n = e.alternate), n !== null && (n.childLanes |= t), (n = e), (e = e.return));
    return n.tag === 3 ? n.stateNode : null;
  }
  var Ut = !1;
  function Vl(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function ba(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        }));
  }
  function Pt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function $t(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (((r = r.shared), (ie & 2) !== 0)) {
      var o = r.pending;
      return (o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)), (r.pending = t), Et(e, n));
    }
    return ((o = r.interleaved), o === null ? ((t.next = t), Bl(r)) : ((t.next = o.next), (o.next = t)), (r.interleaved = t), Et(e, n));
  }
  function so(e, t, n) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), ll(e, n));
    }
  }
  function Ca(e, t) {
    var n = e.updateQueue,
      r = e.alternate;
    if (r !== null && ((r = r.updateQueue), n === r)) {
      var o = null,
        l = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var s = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          (l === null ? (o = l = s) : (l = l.next = s), (n = n.next));
        } while (n !== null);
        l === null ? (o = l = t) : (l = l.next = t);
      } else o = l = t;
      ((n = { baseState: r.baseState, firstBaseUpdate: o, lastBaseUpdate: l, shared: r.shared, effects: r.effects }), (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate), e === null ? (n.firstBaseUpdate = t) : (e.next = t), (n.lastBaseUpdate = t));
  }
  function ao(e, t, n, r) {
    var o = e.updateQueue;
    Ut = !1;
    var l = o.firstBaseUpdate,
      s = o.lastBaseUpdate,
      u = o.shared.pending;
    if (u !== null) {
      o.shared.pending = null;
      var d = u,
        y = d.next;
      ((d.next = null), s === null ? (l = y) : (s.next = y), (s = d));
      var z = e.alternate;
      z !== null &&
        ((z = z.updateQueue), (u = z.lastBaseUpdate), u !== s && (u === null ? (z.firstBaseUpdate = y) : (u.next = y), (z.lastBaseUpdate = d)));
    }
    if (l !== null) {
      var P = o.baseState;
      ((s = 0), (z = y = d = null), (u = l));
      do {
        var b = u.lane,
          H = u.eventTime;
        if ((r & b) === b) {
          z !== null && (z = z.next = { eventTime: H, lane: 0, tag: u.tag, payload: u.payload, callback: u.callback, next: null });
          e: {
            var $ = e,
              V = u;
            switch (((b = t), (H = n), V.tag)) {
              case 1:
                if ((($ = V.payload), typeof $ == "function")) {
                  P = $.call(H, P, b);
                  break e;
                }
                P = $;
                break e;
              case 3:
                $.flags = ($.flags & -65537) | 128;
              case 0:
                if ((($ = V.payload), (b = typeof $ == "function" ? $.call(H, P, b) : $), b == null)) break e;
                P = _({}, P, b);
                break e;
              case 2:
                Ut = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && ((e.flags |= 64), (b = o.effects), b === null ? (o.effects = [u]) : b.push(u));
        } else
          ((H = { eventTime: H, lane: b, tag: u.tag, payload: u.payload, callback: u.callback, next: null }),
            z === null ? ((y = z = H), (d = P)) : (z = z.next = H),
            (s |= b));
        if (((u = u.next), u === null)) {
          if (((u = o.shared.pending), u === null)) break;
          ((b = u), (u = b.next), (b.next = null), (o.lastBaseUpdate = b), (o.shared.pending = null));
        }
      } while (!0);
      if ((z === null && (d = P), (o.baseState = d), (o.firstBaseUpdate = y), (o.lastBaseUpdate = z), (t = o.shared.interleaved), t !== null)) {
        o = t;
        do ((s |= o.lane), (o = o.next));
        while (o !== t);
      } else l === null && (o.shared.lanes = 0);
      ((ln |= s), (e.lanes = s), (e.memoizedState = P));
    }
  }
  function za(e, t, n) {
    if (((e = t.effects), (t.effects = null), e !== null))
      for (t = 0; t < e.length; t++) {
        var r = e[t],
          o = r.callback;
        if (o !== null) {
          if (((r.callback = null), (r = n), typeof o != "function")) throw Error(f(191, o));
          o.call(r);
        }
      }
  }
  var cr = {},
    wt = Ft(cr),
    fr = Ft(cr),
    pr = Ft(cr);
  function rn(e) {
    if (e === cr) throw Error(f(174));
    return e;
  }
  function Ql(e, t) {
    switch ((ye(pr, t), ye(fr, e), ye(wt, cr), (e = t.nodeType), e)) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Go(null, "");
        break;
      default:
        ((e = e === 8 ? t.parentNode : t), (t = e.namespaceURI || null), (e = e.tagName), (t = Go(t, e)));
    }
    (xe(wt), ye(wt, t));
  }
  function Ln() {
    (xe(wt), xe(fr), xe(pr));
  }
  function Ea(e) {
    rn(pr.current);
    var t = rn(wt.current),
      n = Go(t, e.type);
    t !== n && (ye(fr, e), ye(wt, n));
  }
  function Gl(e) {
    fr.current === e && (xe(wt), xe(fr));
  }
  var Se = Ft(0);
  function uo(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Yl = [];
  function Kl() {
    for (var e = 0; e < Yl.length; e++) Yl[e]._workInProgressVersionPrimary = null;
    Yl.length = 0;
  }
  var co = ae.ReactCurrentDispatcher,
    Jl = ae.ReactCurrentBatchConfig,
    on = 0,
    je = null,
    Te = null,
    De = null,
    fo = !1,
    mr = !1,
    hr = 0,
    Ec = 0;
  function Ue() {
    throw Error(f(321));
  }
  function Xl(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function Zl(e, t, n, r, o, l) {
    if (
      ((on = l),
      (je = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (co.current = e === null || e.memoizedState === null ? Lc : Dc),
      (e = n(r, o)),
      mr)
    ) {
      l = 0;
      do {
        if (((mr = !1), (hr = 0), 25 <= l)) throw Error(f(301));
        ((l += 1), (De = Te = null), (t.updateQueue = null), (co.current = Mc), (e = n(r, o)));
      } while (mr);
    }
    if (((co.current = ho), (t = Te !== null && Te.next !== null), (on = 0), (De = Te = je = null), (fo = !1), t)) throw Error(f(300));
    return e;
  }
  function ql() {
    var e = hr !== 0;
    return ((hr = 0), e);
  }
  function St() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (De === null ? (je.memoizedState = De = e) : (De = De.next = e), De);
  }
  function at() {
    if (Te === null) {
      var e = je.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Te.next;
    var t = De === null ? je.memoizedState : De.next;
    if (t !== null) ((De = t), (Te = e));
    else {
      if (e === null) throw Error(f(310));
      ((Te = e),
        (e = { memoizedState: Te.memoizedState, baseState: Te.baseState, baseQueue: Te.baseQueue, queue: Te.queue, next: null }),
        De === null ? (je.memoizedState = De = e) : (De = De.next = e));
    }
    return De;
  }
  function gr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ei(e) {
    var t = at(),
      n = t.queue;
    if (n === null) throw Error(f(311));
    n.lastRenderedReducer = e;
    var r = Te,
      o = r.baseQueue,
      l = n.pending;
    if (l !== null) {
      if (o !== null) {
        var s = o.next;
        ((o.next = l.next), (l.next = s));
      }
      ((r.baseQueue = o = l), (n.pending = null));
    }
    if (o !== null) {
      ((l = o.next), (r = r.baseState));
      var u = (s = null),
        d = null,
        y = l;
      do {
        var z = y.lane;
        if ((on & z) === z)
          (d !== null && (d = d.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }),
            (r = y.hasEagerState ? y.eagerState : e(r, y.action)));
        else {
          var P = { lane: z, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null };
          (d === null ? ((u = d = P), (s = r)) : (d = d.next = P), (je.lanes |= z), (ln |= z));
        }
        y = y.next;
      } while (y !== null && y !== l);
      (d === null ? (s = r) : (d.next = u),
        ft(r, t.memoizedState) || (Xe = !0),
        (t.memoizedState = r),
        (t.baseState = s),
        (t.baseQueue = d),
        (n.lastRenderedState = r));
    }
    if (((e = n.interleaved), e !== null)) {
      o = e;
      do ((l = o.lane), (je.lanes |= l), (ln |= l), (o = o.next));
      while (o !== e);
    } else o === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ti(e) {
    var t = at(),
      n = t.queue;
    if (n === null) throw Error(f(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch,
      o = n.pending,
      l = t.memoizedState;
    if (o !== null) {
      n.pending = null;
      var s = (o = o.next);
      do ((l = e(l, s.action)), (s = s.next));
      while (s !== o);
      (ft(l, t.memoizedState) || (Xe = !0), (t.memoizedState = l), t.baseQueue === null && (t.baseState = l), (n.lastRenderedState = l));
    }
    return [l, r];
  }
  function Pa() {}
  function _a(e, t) {
    var n = je,
      r = at(),
      o = t(),
      l = !ft(r.memoizedState, o);
    if (
      (l && ((r.memoizedState = o), (Xe = !0)),
      (r = r.queue),
      ni(Da.bind(null, n, r, e), [e]),
      r.getSnapshot !== t || l || (De !== null && De.memoizedState.tag & 1))
    ) {
      if (((n.flags |= 2048), yr(9, La.bind(null, n, r, o, t), void 0, null), Me === null)) throw Error(f(349));
      (on & 30) !== 0 || Ta(n, t, o);
    }
    return o;
  }
  function Ta(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = je.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }), (je.updateQueue = t), (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function La(e, t, n, r) {
    ((t.value = n), (t.getSnapshot = r), Ma(t) && Oa(e));
  }
  function Da(e, t, n) {
    return n(function () {
      Ma(t) && Oa(e);
    });
  }
  function Ma(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Oa(e) {
    var t = Et(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function Ra(e) {
    var t = St();
    return (
      typeof e == "function" && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: gr, lastRenderedState: e }),
      (t.queue = e),
      (e = e.dispatch = Tc.bind(null, je, e)),
      [t.memoizedState, e]
    );
  }
  function yr(e, t, n, r) {
    return (
      (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
      (t = je.updateQueue),
      t === null
        ? ((t = { lastEffect: null, stores: null }), (je.updateQueue = t), (t.lastEffect = e.next = e))
        : ((n = t.lastEffect), n === null ? (t.lastEffect = e.next = e) : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
      e
    );
  }
  function Ia() {
    return at().memoizedState;
  }
  function po(e, t, n, r) {
    var o = St();
    ((je.flags |= e), (o.memoizedState = yr(1 | t, n, void 0, r === void 0 ? null : r)));
  }
  function mo(e, t, n, r) {
    var o = at();
    r = r === void 0 ? null : r;
    var l = void 0;
    if (Te !== null) {
      var s = Te.memoizedState;
      if (((l = s.destroy), r !== null && Xl(r, s.deps))) {
        o.memoizedState = yr(t, n, l, r);
        return;
      }
    }
    ((je.flags |= e), (o.memoizedState = yr(1 | t, n, l, r)));
  }
  function Wa(e, t) {
    return po(8390656, 8, e, t);
  }
  function ni(e, t) {
    return mo(2048, 8, e, t);
  }
  function Fa(e, t) {
    return mo(4, 2, e, t);
  }
  function Ha(e, t) {
    return mo(4, 4, e, t);
  }
  function Aa(e, t) {
    if (typeof t == "function")
      return (
        (e = e()),
        t(e),
        function () {
          t(null);
        }
      );
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function Ua(e, t, n) {
    return ((n = n != null ? n.concat([e]) : null), mo(4, 4, Aa.bind(null, t, e), n));
  }
  function ri() {}
  function $a(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xl(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
  }
  function Ba(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xl(t, r[1]) ? r[0] : ((e = e()), (n.memoizedState = [e, t]), e);
  }
  function Va(e, t, n) {
    return (on & 21) === 0
      ? (e.baseState && ((e.baseState = !1), (Xe = !0)), (e.memoizedState = n))
      : (ft(n, t) || ((n = ws()), (je.lanes |= n), (ln |= n), (e.baseState = !0)), t);
  }
  function Pc(e, t) {
    var n = pe;
    ((pe = n !== 0 && 4 > n ? n : 4), e(!0));
    var r = Jl.transition;
    Jl.transition = {};
    try {
      (e(!1), t());
    } finally {
      ((pe = n), (Jl.transition = r));
    }
  }
  function Qa() {
    return at().memoizedState;
  }
  function _c(e, t, n) {
    var r = Gt(e);
    if (((n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }), Ga(e))) Ya(t, n);
    else if (((n = Na(e, t, n, r)), n !== null)) {
      var o = Ge();
      (yt(n, e, r, o), Ka(n, t, r));
    }
  }
  function Tc(e, t, n) {
    var r = Gt(e),
      o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Ga(e)) Ya(t, o);
    else {
      var l = e.alternate;
      if (e.lanes === 0 && (l === null || l.lanes === 0) && ((l = t.lastRenderedReducer), l !== null))
        try {
          var s = t.lastRenderedState,
            u = l(s, n);
          if (((o.hasEagerState = !0), (o.eagerState = u), ft(u, s))) {
            var d = t.interleaved;
            (d === null ? ((o.next = o), Bl(t)) : ((o.next = d.next), (d.next = o)), (t.interleaved = o));
            return;
          }
        } catch {
        } finally {
        }
      ((n = Na(e, t, o, r)), n !== null && ((o = Ge()), yt(n, e, r, o), Ka(n, t, r)));
    }
  }
  function Ga(e) {
    var t = e.alternate;
    return e === je || (t !== null && t === je);
  }
  function Ya(e, t) {
    mr = fo = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
  }
  function Ka(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      ((r &= e.pendingLanes), (n |= r), (t.lanes = n), ll(e, n));
    }
  }
  var ho = {
      readContext: st,
      useCallback: Ue,
      useContext: Ue,
      useEffect: Ue,
      useImperativeHandle: Ue,
      useInsertionEffect: Ue,
      useLayoutEffect: Ue,
      useMemo: Ue,
      useReducer: Ue,
      useRef: Ue,
      useState: Ue,
      useDebugValue: Ue,
      useDeferredValue: Ue,
      useTransition: Ue,
      useMutableSource: Ue,
      useSyncExternalStore: Ue,
      useId: Ue,
      unstable_isNewReconciler: !1,
    },
    Lc = {
      readContext: st,
      useCallback: function (e, t) {
        return ((St().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: st,
      useEffect: Wa,
      useImperativeHandle: function (e, t, n) {
        return ((n = n != null ? n.concat([e]) : null), po(4194308, 4, Aa.bind(null, t, e), n));
      },
      useLayoutEffect: function (e, t) {
        return po(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        return po(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = St();
        return ((t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e);
      },
      useReducer: function (e, t, n) {
        var r = St();
        return (
          (t = n !== void 0 ? n(t) : t),
          (r.memoizedState = r.baseState = t),
          (e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }),
          (r.queue = e),
          (e = e.dispatch = _c.bind(null, je, e)),
          [r.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = St();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: Ra,
      useDebugValue: ri,
      useDeferredValue: function (e) {
        return (St().memoizedState = e);
      },
      useTransition: function () {
        var e = Ra(!1),
          t = e[0];
        return ((e = Pc.bind(null, e[1])), (St().memoizedState = e), [t, e]);
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, n) {
        var r = je,
          o = St();
        if (ke) {
          if (n === void 0) throw Error(f(407));
          n = n();
        } else {
          if (((n = t()), Me === null)) throw Error(f(349));
          (on & 30) !== 0 || Ta(r, t, n);
        }
        o.memoizedState = n;
        var l = { value: n, getSnapshot: t };
        return ((o.queue = l), Wa(Da.bind(null, r, l, e), [e]), (r.flags |= 2048), yr(9, La.bind(null, r, l, n, t), void 0, null), n);
      },
      useId: function () {
        var e = St(),
          t = Me.identifierPrefix;
        if (ke) {
          var n = zt,
            r = Ct;
          ((n = (r & ~(1 << (32 - ct(r) - 1))).toString(32) + n),
            (t = ":" + t + "R" + n),
            (n = hr++),
            0 < n && (t += "H" + n.toString(32)),
            (t += ":"));
        } else ((n = Ec++), (t = ":" + t + "r" + n.toString(32) + ":"));
        return (e.memoizedState = t);
      },
      unstable_isNewReconciler: !1,
    },
    Dc = {
      readContext: st,
      useCallback: $a,
      useContext: st,
      useEffect: ni,
      useImperativeHandle: Ua,
      useInsertionEffect: Fa,
      useLayoutEffect: Ha,
      useMemo: Ba,
      useReducer: ei,
      useRef: Ia,
      useState: function () {
        return ei(gr);
      },
      useDebugValue: ri,
      useDeferredValue: function (e) {
        var t = at();
        return Va(t, Te.memoizedState, e);
      },
      useTransition: function () {
        var e = ei(gr)[0],
          t = at().memoizedState;
        return [e, t];
      },
      useMutableSource: Pa,
      useSyncExternalStore: _a,
      useId: Qa,
      unstable_isNewReconciler: !1,
    },
    Mc = {
      readContext: st,
      useCallback: $a,
      useContext: st,
      useEffect: ni,
      useImperativeHandle: Ua,
      useInsertionEffect: Fa,
      useLayoutEffect: Ha,
      useMemo: Ba,
      useReducer: ti,
      useRef: Ia,
      useState: function () {
        return ti(gr);
      },
      useDebugValue: ri,
      useDeferredValue: function (e) {
        var t = at();
        return Te === null ? (t.memoizedState = e) : Va(t, Te.memoizedState, e);
      },
      useTransition: function () {
        var e = ti(gr)[0],
          t = at().memoizedState;
        return [e, t];
      },
      useMutableSource: Pa,
      useSyncExternalStore: _a,
      useId: Qa,
      unstable_isNewReconciler: !1,
    };
  function mt(e, t) {
    if (e && e.defaultProps) {
      ((t = _({}, t)), (e = e.defaultProps));
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function oi(e, t, n, r) {
    ((t = e.memoizedState), (n = n(r, t)), (n = n == null ? t : _({}, t, n)), (e.memoizedState = n), e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var go = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? Xt(e) === e : !1;
    },
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ge(),
        o = Gt(e),
        l = Pt(r, o);
      ((l.payload = t), n != null && (l.callback = n), (t = $t(e, l, o)), t !== null && (yt(t, e, o, r), so(t, e, o)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var r = Ge(),
        o = Gt(e),
        l = Pt(r, o);
      ((l.tag = 1), (l.payload = t), n != null && (l.callback = n), (t = $t(e, l, o)), t !== null && (yt(t, e, o, r), so(t, e, o)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = Ge(),
        r = Gt(e),
        o = Pt(n, r);
      ((o.tag = 2), t != null && (o.callback = t), (t = $t(e, o, r)), t !== null && (yt(t, e, r, n), so(t, e, r)));
    },
  };
  function Ja(e, t, n, r, o, l, s) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(r, l, s)
        : t.prototype && t.prototype.isPureReactComponent
          ? !rr(n, r) || !rr(o, l)
          : !0
    );
  }
  function Xa(e, t, n) {
    var r = !1,
      o = Ht,
      l = t.contextType;
    return (
      typeof l == "object" && l !== null ? (l = st(l)) : ((o = Je(t) ? qt : Ae.current), (r = t.contextTypes), (l = (r = r != null) ? bn(e, o) : Ht)),
      (t = new t(n, l)),
      (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
      (t.updater = go),
      (e.stateNode = t),
      (t._reactInternals = e),
      r && ((e = e.stateNode), (e.__reactInternalMemoizedUnmaskedChildContext = o), (e.__reactInternalMemoizedMaskedChildContext = l)),
      t
    );
  }
  function Za(e, t, n, r) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r),
      typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r),
      t.state !== e && go.enqueueReplaceState(t, t.state, null));
  }
  function li(e, t, n, r) {
    var o = e.stateNode;
    ((o.props = n), (o.state = e.memoizedState), (o.refs = {}), Vl(e));
    var l = t.contextType;
    (typeof l == "object" && l !== null ? (o.context = st(l)) : ((l = Je(t) ? qt : Ae.current), (o.context = bn(e, l))),
      (o.state = e.memoizedState),
      (l = t.getDerivedStateFromProps),
      typeof l == "function" && (oi(e, t, l, n), (o.state = e.memoizedState)),
      typeof t.getDerivedStateFromProps == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function" ||
        (typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function") ||
        ((t = o.state),
        typeof o.componentWillMount == "function" && o.componentWillMount(),
        typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(),
        t !== o.state && go.enqueueReplaceState(o, o.state, null),
        ao(e, n, o, r),
        (o.state = e.memoizedState)),
      typeof o.componentDidMount == "function" && (e.flags |= 4194308));
  }
  function Dn(e, t) {
    try {
      var n = "",
        r = t;
      do ((n += te(r)), (r = r.return));
      while (r);
      var o = n;
    } catch (l) {
      o =
        `
Error generating stack: ` +
        l.message +
        `
` +
        l.stack;
    }
    return { value: e, source: t, stack: o, digest: null };
  }
  function ii(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function si(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  var Oc = typeof WeakMap == "function" ? WeakMap : Map;
  function qa(e, t, n) {
    ((n = Pt(-1, n)), (n.tag = 3), (n.payload = { element: null }));
    var r = t.value;
    return (
      (n.callback = function () {
        (jo || ((jo = !0), (Si = r)), si(e, t));
      }),
      n
    );
  }
  function eu(e, t, n) {
    ((n = Pt(-1, n)), (n.tag = 3));
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var o = t.value;
      ((n.payload = function () {
        return r(o);
      }),
        (n.callback = function () {
          si(e, t);
        }));
    }
    var l = e.stateNode;
    return (
      l !== null &&
        typeof l.componentDidCatch == "function" &&
        (n.callback = function () {
          (si(e, t), typeof r != "function" && (Vt === null ? (Vt = new Set([this])) : Vt.add(this)));
          var s = t.stack;
          this.componentDidCatch(t.value, { componentStack: s !== null ? s : "" });
        }),
      n
    );
  }
  function tu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Oc();
      var o = new Set();
      r.set(t, o);
    } else ((o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o)));
    o.has(n) || (o.add(n), (e = Kc.bind(null, e, t, n)), t.then(e, e));
  }
  function nu(e) {
    do {
      var t;
      if (((t = e.tag === 13) && ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)), t)) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ru(e, t, n, r, o) {
    return (e.mode & 1) === 0
      ? (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (n.flags |= 131072),
            (n.flags &= -52805),
            n.tag === 1 && (n.alternate === null ? (n.tag = 17) : ((t = Pt(-1, 1)), (t.tag = 2), $t(n, t, 1))),
            (n.lanes |= 1)),
        e)
      : ((e.flags |= 65536), (e.lanes = o), e);
  }
  var Rc = ae.ReactCurrentOwner,
    Xe = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? ja(t, null, n, r) : Pn(t, e.child, n, r);
  }
  function ou(e, t, n, r, o) {
    n = n.render;
    var l = t.ref;
    return (
      Tn(t, o),
      (r = Zl(e, t, n, r, l, o)),
      (n = ql()),
      e !== null && !Xe
        ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~o), _t(e, t, o))
        : (ke && n && Ol(t), (t.flags |= 1), Qe(e, t, r, o), t.child)
    );
  }
  function lu(e, t, n, r, o) {
    if (e === null) {
      var l = n.type;
      return typeof l == "function" && !Pi(l) && l.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0
        ? ((t.tag = 15), (t.type = l), iu(e, t, l, r, o))
        : ((e = Po(n.type, null, r, t, t.mode, o)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((l = e.child), (e.lanes & o) === 0)) {
      var s = l.memoizedProps;
      if (((n = n.compare), (n = n !== null ? n : rr), n(s, r) && e.ref === t.ref)) return _t(e, t, o);
    }
    return ((t.flags |= 1), (e = Kt(l, r)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function iu(e, t, n, r, o) {
    if (e !== null) {
      var l = e.memoizedProps;
      if (rr(l, r) && e.ref === t.ref)
        if (((Xe = !1), (t.pendingProps = r = l), (e.lanes & o) !== 0)) (e.flags & 131072) !== 0 && (Xe = !0);
        else return ((t.lanes = e.lanes), _t(e, t, o));
    }
    return ai(e, t, n, r, o);
  }
  function su(e, t, n) {
    var r = t.pendingProps,
      o = r.children,
      l = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden")
      if ((t.mode & 1) === 0) ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }), ye(On, ot), (ot |= n));
      else {
        if ((n & 1073741824) === 0)
          return (
            (e = l !== null ? l.baseLanes | n : n),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
            (t.updateQueue = null),
            ye(On, ot),
            (ot |= e),
            null
          );
        ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }), (r = l !== null ? l.baseLanes : n), ye(On, ot), (ot |= r));
      }
    else (l !== null ? ((r = l.baseLanes | n), (t.memoizedState = null)) : (r = n), ye(On, ot), (ot |= r));
    return (Qe(e, t, o, n), t.child);
  }
  function au(e, t) {
    var n = t.ref;
    ((e === null && n !== null) || (e !== null && e.ref !== n)) && ((t.flags |= 512), (t.flags |= 2097152));
  }
  function ai(e, t, n, r, o) {
    var l = Je(n) ? qt : Ae.current;
    return (
      (l = bn(t, l)),
      Tn(t, o),
      (n = Zl(e, t, n, r, l, o)),
      (r = ql()),
      e !== null && !Xe
        ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~o), _t(e, t, o))
        : (ke && r && Ol(t), (t.flags |= 1), Qe(e, t, n, o), t.child)
    );
  }
  function uu(e, t, n, r, o) {
    if (Je(n)) {
      var l = !0;
      qr(t);
    } else l = !1;
    if ((Tn(t, o), t.stateNode === null)) (vo(e, t), Xa(t, n, r), li(t, n, r, o), (r = !0));
    else if (e === null) {
      var s = t.stateNode,
        u = t.memoizedProps;
      s.props = u;
      var d = s.context,
        y = n.contextType;
      typeof y == "object" && y !== null ? (y = st(y)) : ((y = Je(n) ? qt : Ae.current), (y = bn(t, y)));
      var z = n.getDerivedStateFromProps,
        P = typeof z == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      (P ||
        (typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function") ||
        ((u !== r || d !== y) && Za(t, s, r, y)),
        (Ut = !1));
      var b = t.memoizedState;
      ((s.state = b),
        ao(t, r, s, o),
        (d = t.memoizedState),
        u !== r || b !== d || Ke.current || Ut
          ? (typeof z == "function" && (oi(t, n, z, r), (d = t.memoizedState)),
            (u = Ut || Ja(t, n, u, r, b, d, y))
              ? (P ||
                  (typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function") ||
                  (typeof s.componentWillMount == "function" && s.componentWillMount(),
                  typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()),
                typeof s.componentDidMount == "function" && (t.flags |= 4194308))
              : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), (t.memoizedProps = r), (t.memoizedState = d)),
            (s.props = r),
            (s.state = d),
            (s.context = y),
            (r = u))
          : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), (r = !1)));
    } else {
      ((s = t.stateNode),
        ba(e, t),
        (u = t.memoizedProps),
        (y = t.type === t.elementType ? u : mt(t.type, u)),
        (s.props = y),
        (P = t.pendingProps),
        (b = s.context),
        (d = n.contextType),
        typeof d == "object" && d !== null ? (d = st(d)) : ((d = Je(n) ? qt : Ae.current), (d = bn(t, d))));
      var H = n.getDerivedStateFromProps;
      ((z = typeof H == "function" || typeof s.getSnapshotBeforeUpdate == "function") ||
        (typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function") ||
        ((u !== P || b !== d) && Za(t, s, r, d)),
        (Ut = !1),
        (b = t.memoizedState),
        (s.state = b),
        ao(t, r, s, o));
      var $ = t.memoizedState;
      u !== P || b !== $ || Ke.current || Ut
        ? (typeof H == "function" && (oi(t, n, H, r), ($ = t.memoizedState)),
          (y = Ut || Ja(t, n, y, r, b, $, d) || !1)
            ? (z ||
                (typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function") ||
                (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(r, $, d),
                typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(r, $, d)),
              typeof s.componentDidUpdate == "function" && (t.flags |= 4),
              typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
            : (typeof s.componentDidUpdate != "function" || (u === e.memoizedProps && b === e.memoizedState) || (t.flags |= 4),
              typeof s.getSnapshotBeforeUpdate != "function" || (u === e.memoizedProps && b === e.memoizedState) || (t.flags |= 1024),
              (t.memoizedProps = r),
              (t.memoizedState = $)),
          (s.props = r),
          (s.state = $),
          (s.context = d),
          (r = y))
        : (typeof s.componentDidUpdate != "function" || (u === e.memoizedProps && b === e.memoizedState) || (t.flags |= 4),
          typeof s.getSnapshotBeforeUpdate != "function" || (u === e.memoizedProps && b === e.memoizedState) || (t.flags |= 1024),
          (r = !1));
    }
    return ui(e, t, n, r, l, o);
  }
  function ui(e, t, n, r, o, l) {
    au(e, t);
    var s = (t.flags & 128) !== 0;
    if (!r && !s) return (o && ma(t, n, !1), _t(e, t, l));
    ((r = t.stateNode), (Rc.current = t));
    var u = s && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return (
      (t.flags |= 1),
      e !== null && s ? ((t.child = Pn(t, e.child, null, l)), (t.child = Pn(t, null, u, l))) : Qe(e, t, u, l),
      (t.memoizedState = r.state),
      o && ma(t, n, !0),
      t.child
    );
  }
  function du(e) {
    var t = e.stateNode;
    (t.pendingContext ? fa(e, t.pendingContext, t.pendingContext !== t.context) : t.context && fa(e, t.context, !1), Ql(e, t.containerInfo));
  }
  function cu(e, t, n, r, o) {
    return (En(), Fl(o), (t.flags |= 256), Qe(e, t, n, r), t.child);
  }
  var di = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ci(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function fu(e, t, n) {
    var r = t.pendingProps,
      o = Se.current,
      l = !1,
      s = (t.flags & 128) !== 0,
      u;
    if (
      ((u = s) || (u = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
      u ? ((l = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (o |= 1),
      ye(Se, o & 1),
      e === null)
    )
      return (
        Wl(t),
        (e = t.memoizedState),
        e !== null && ((e = e.dehydrated), e !== null)
          ? ((t.mode & 1) === 0 ? (t.lanes = 1) : e.data === "$!" ? (t.lanes = 8) : (t.lanes = 1073741824), null)
          : ((s = r.children),
            (e = r.fallback),
            l
              ? ((r = t.mode),
                (l = t.child),
                (s = { mode: "hidden", children: s }),
                (r & 1) === 0 && l !== null ? ((l.childLanes = 0), (l.pendingProps = s)) : (l = _o(s, r, 0, null)),
                (e = dn(e, r, n, null)),
                (l.return = t),
                (e.return = t),
                (l.sibling = e),
                (t.child = l),
                (t.child.memoizedState = ci(n)),
                (t.memoizedState = di),
                e)
              : fi(t, s))
      );
    if (((o = e.memoizedState), o !== null && ((u = o.dehydrated), u !== null))) return Ic(e, t, s, r, u, o, n);
    if (l) {
      ((l = r.fallback), (s = t.mode), (o = e.child), (u = o.sibling));
      var d = { mode: "hidden", children: r.children };
      return (
        (s & 1) === 0 && t.child !== o
          ? ((r = t.child), (r.childLanes = 0), (r.pendingProps = d), (t.deletions = null))
          : ((r = Kt(o, d)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
        u !== null ? (l = Kt(u, l)) : ((l = dn(l, s, n, null)), (l.flags |= 2)),
        (l.return = t),
        (r.return = t),
        (r.sibling = l),
        (t.child = r),
        (r = l),
        (l = t.child),
        (s = e.child.memoizedState),
        (s = s === null ? ci(n) : { baseLanes: s.baseLanes | n, cachePool: null, transitions: s.transitions }),
        (l.memoizedState = s),
        (l.childLanes = e.childLanes & ~n),
        (t.memoizedState = di),
        r
      );
    }
    return (
      (l = e.child),
      (e = l.sibling),
      (r = Kt(l, { mode: "visible", children: r.children })),
      (t.mode & 1) === 0 && (r.lanes = n),
      (r.return = t),
      (r.sibling = null),
      e !== null && ((n = t.deletions), n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
      (t.child = r),
      (t.memoizedState = null),
      r
    );
  }
  function fi(e, t) {
    return ((t = _o({ mode: "visible", children: t }, e.mode, 0, null)), (t.return = e), (e.child = t));
  }
  function yo(e, t, n, r) {
    return (r !== null && Fl(r), Pn(t, e.child, null, n), (e = fi(t, t.pendingProps.children)), (e.flags |= 2), (t.memoizedState = null), e);
  }
  function Ic(e, t, n, r, o, l, s) {
    if (n)
      return t.flags & 256
        ? ((t.flags &= -257), (r = ii(Error(f(422)))), yo(e, t, s, r))
        : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((l = r.fallback),
            (o = t.mode),
            (r = _o({ mode: "visible", children: r.children }, o, 0, null)),
            (l = dn(l, o, s, null)),
            (l.flags |= 2),
            (r.return = t),
            (l.return = t),
            (r.sibling = l),
            (t.child = r),
            (t.mode & 1) !== 0 && Pn(t, e.child, null, s),
            (t.child.memoizedState = ci(s)),
            (t.memoizedState = di),
            l);
    if ((t.mode & 1) === 0) return yo(e, t, s, null);
    if (o.data === "$!") {
      if (((r = o.nextSibling && o.nextSibling.dataset), r)) var u = r.dgst;
      return ((r = u), (l = Error(f(419))), (r = ii(l, r, void 0)), yo(e, t, s, r));
    }
    if (((u = (s & e.childLanes) !== 0), Xe || u)) {
      if (((r = Me), r !== null)) {
        switch (s & -s) {
          case 4:
            o = 2;
            break;
          case 16:
            o = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            o = 32;
            break;
          case 536870912:
            o = 268435456;
            break;
          default:
            o = 0;
        }
        ((o = (o & (r.suspendedLanes | s)) !== 0 ? 0 : o), o !== 0 && o !== l.retryLane && ((l.retryLane = o), Et(e, o), yt(r, e, o, -1)));
      }
      return (Ei(), (r = ii(Error(f(421)))), yo(e, t, s, r));
    }
    return o.data === "$?"
      ? ((t.flags |= 128), (t.child = e.child), (t = Jc.bind(null, e)), (o._reactRetry = t), null)
      : ((e = l.treeContext),
        (rt = Wt(o.nextSibling)),
        (nt = t),
        (ke = !0),
        (pt = null),
        e !== null && ((lt[it++] = Ct), (lt[it++] = zt), (lt[it++] = en), (Ct = e.id), (zt = e.overflow), (en = t)),
        (t = fi(t, r.children)),
        (t.flags |= 4096),
        t);
  }
  function pu(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    (r !== null && (r.lanes |= t), $l(e.return, t, n));
  }
  function pi(e, t, n, r, o) {
    var l = e.memoizedState;
    l === null
      ? (e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: o })
      : ((l.isBackwards = t), (l.rendering = null), (l.renderingStartTime = 0), (l.last = r), (l.tail = n), (l.tailMode = o));
  }
  function mu(e, t, n) {
    var r = t.pendingProps,
      o = r.revealOrder,
      l = r.tail;
    if ((Qe(e, t, r.children, n), (r = Se.current), (r & 2) !== 0)) ((r = (r & 1) | 2), (t.flags |= 128));
    else {
      if (e !== null && (e.flags & 128) !== 0)
        e: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && pu(e, n, t);
          else if (e.tag === 19) pu(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break e;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break e;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      r &= 1;
    }
    if ((ye(Se, r), (t.mode & 1) === 0)) t.memoizedState = null;
    else
      switch (o) {
        case "forwards":
          for (n = t.child, o = null; n !== null; ) ((e = n.alternate), e !== null && uo(e) === null && (o = n), (n = n.sibling));
          ((n = o), n === null ? ((o = t.child), (t.child = null)) : ((o = n.sibling), (n.sibling = null)), pi(t, !1, o, n, l));
          break;
        case "backwards":
          for (n = null, o = t.child, t.child = null; o !== null; ) {
            if (((e = o.alternate), e !== null && uo(e) === null)) {
              t.child = o;
              break;
            }
            ((e = o.sibling), (o.sibling = n), (n = o), (o = e));
          }
          pi(t, !0, n, null, l);
          break;
        case "together":
          pi(t, !1, null, null, void 0);
          break;
        default:
          t.memoizedState = null;
      }
    return t.child;
  }
  function vo(e, t) {
    (t.mode & 1) === 0 && e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
  }
  function _t(e, t, n) {
    if ((e !== null && (t.dependencies = e.dependencies), (ln |= t.lanes), (n & t.childLanes) === 0)) return null;
    if (e !== null && t.child !== e.child) throw Error(f(153));
    if (t.child !== null) {
      for (e = t.child, n = Kt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        ((e = e.sibling), (n = n.sibling = Kt(e, e.pendingProps)), (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function Wc(e, t, n) {
    switch (t.tag) {
      case 3:
        (du(t), En());
        break;
      case 5:
        Ea(t);
        break;
      case 1:
        Je(t.type) && qr(t);
        break;
      case 4:
        Ql(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context,
          o = t.memoizedProps.value;
        (ye(lo, r._currentValue), (r._currentValue = o));
        break;
      case 13:
        if (((r = t.memoizedState), r !== null))
          return r.dehydrated !== null
            ? (ye(Se, Se.current & 1), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? fu(e, t, n)
              : (ye(Se, Se.current & 1), (e = _t(e, t, n)), e !== null ? e.sibling : null);
        ye(Se, Se.current & 1);
        break;
      case 19:
        if (((r = (n & t.childLanes) !== 0), (e.flags & 128) !== 0)) {
          if (r) return mu(e, t, n);
          t.flags |= 128;
        }
        if (((o = t.memoizedState), o !== null && ((o.rendering = null), (o.tail = null), (o.lastEffect = null)), ye(Se, Se.current), r)) break;
        return null;
      case 22:
      case 23:
        return ((t.lanes = 0), su(e, t, n));
    }
    return _t(e, t, n);
  }
  var hu, mi, gu, yu;
  ((hu = function (e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        ((n.child.return = n), (n = n.child));
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      ((n.sibling.return = n.return), (n = n.sibling));
    }
  }),
    (mi = function () {}),
    (gu = function (e, t, n, r) {
      var o = e.memoizedProps;
      if (o !== r) {
        ((e = t.stateNode), rn(wt.current));
        var l = null;
        switch (n) {
          case "input":
            ((o = $o(e, o)), (r = $o(e, r)), (l = []));
            break;
          case "select":
            ((o = _({}, o, { value: void 0 })), (r = _({}, r, { value: void 0 })), (l = []));
            break;
          case "textarea":
            ((o = Qo(e, o)), (r = Qo(e, r)), (l = []));
            break;
          default:
            typeof o.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Jr);
        }
        Yo(n, r);
        var s;
        n = null;
        for (y in o)
          if (!r.hasOwnProperty(y) && o.hasOwnProperty(y) && o[y] != null)
            if (y === "style") {
              var u = o[y];
              for (s in u) u.hasOwnProperty(s) && (n || (n = {}), (n[s] = ""));
            } else
              y !== "dangerouslySetInnerHTML" &&
                y !== "children" &&
                y !== "suppressContentEditableWarning" &&
                y !== "suppressHydrationWarning" &&
                y !== "autoFocus" &&
                (v.hasOwnProperty(y) ? l || (l = []) : (l = l || []).push(y, null));
        for (y in r) {
          var d = r[y];
          if (((u = o != null ? o[y] : void 0), r.hasOwnProperty(y) && d !== u && (d != null || u != null)))
            if (y === "style")
              if (u) {
                for (s in u) !u.hasOwnProperty(s) || (d && d.hasOwnProperty(s)) || (n || (n = {}), (n[s] = ""));
                for (s in d) d.hasOwnProperty(s) && u[s] !== d[s] && (n || (n = {}), (n[s] = d[s]));
              } else (n || (l || (l = []), l.push(y, n)), (n = d));
            else
              y === "dangerouslySetInnerHTML"
                ? ((d = d ? d.__html : void 0), (u = u ? u.__html : void 0), d != null && u !== d && (l = l || []).push(y, d))
                : y === "children"
                  ? (typeof d != "string" && typeof d != "number") || (l = l || []).push(y, "" + d)
                  : y !== "suppressContentEditableWarning" &&
                    y !== "suppressHydrationWarning" &&
                    (v.hasOwnProperty(y) ? (d != null && y === "onScroll" && ve("scroll", e), l || u === d || (l = [])) : (l = l || []).push(y, d));
        }
        n && (l = l || []).push("style", n);
        var y = l;
        (t.updateQueue = y) && (t.flags |= 4);
      }
    }),
    (yu = function (e, t, n, r) {
      n !== r && (t.flags |= 4);
    }));
  function vr(e, t) {
    if (!ke)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; ) (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = e.tail;
          for (var r = null; n !== null; ) (n.alternate !== null && (r = n), (n = n.sibling));
          r === null ? (t || e.tail === null ? (e.tail = null) : (e.tail.sibling = null)) : (r.sibling = null);
      }
  }
  function $e(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      r = 0;
    if (t)
      for (var o = e.child; o !== null; )
        ((n |= o.lanes | o.childLanes), (r |= o.subtreeFlags & 14680064), (r |= o.flags & 14680064), (o.return = e), (o = o.sibling));
    else for (o = e.child; o !== null; ) ((n |= o.lanes | o.childLanes), (r |= o.subtreeFlags), (r |= o.flags), (o.return = e), (o = o.sibling));
    return ((e.subtreeFlags |= r), (e.childLanes = n), t);
  }
  function Fc(e, t, n) {
    var r = t.pendingProps;
    switch ((Rl(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ($e(t), null);
      case 1:
        return (Je(t.type) && Zr(), $e(t), null);
      case 3:
        return (
          (r = t.stateNode),
          Ln(),
          xe(Ke),
          xe(Ae),
          Kl(),
          r.pendingContext && ((r.context = r.pendingContext), (r.pendingContext = null)),
          (e === null || e.child === null) &&
            (ro(t)
              ? (t.flags |= 4)
              : e === null || (e.memoizedState.isDehydrated && (t.flags & 256) === 0) || ((t.flags |= 1024), pt !== null && (bi(pt), (pt = null)))),
          mi(e, t),
          $e(t),
          null
        );
      case 5:
        Gl(t);
        var o = rn(pr.current);
        if (((n = t.type), e !== null && t.stateNode != null)) (gu(e, t, n, r, o), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(f(166));
            return ($e(t), null);
          }
          if (((e = rn(wt.current)), ro(t))) {
            ((r = t.stateNode), (n = t.type));
            var l = t.memoizedProps;
            switch (((r[kt] = t), (r[ar] = l), (e = (t.mode & 1) !== 0), n)) {
              case "dialog":
                (ve("cancel", r), ve("close", r));
                break;
              case "iframe":
              case "object":
              case "embed":
                ve("load", r);
                break;
              case "video":
              case "audio":
                for (o = 0; o < lr.length; o++) ve(lr[o], r);
                break;
              case "source":
                ve("error", r);
                break;
              case "img":
              case "image":
              case "link":
                (ve("error", r), ve("load", r));
                break;
              case "details":
                ve("toggle", r);
                break;
              case "input":
                (Xi(r, l), ve("invalid", r));
                break;
              case "select":
                ((r._wrapperState = { wasMultiple: !!l.multiple }), ve("invalid", r));
                break;
              case "textarea":
                (es(r, l), ve("invalid", r));
            }
            (Yo(n, l), (o = null));
            for (var s in l)
              if (l.hasOwnProperty(s)) {
                var u = l[s];
                s === "children"
                  ? typeof u == "string"
                    ? r.textContent !== u && (l.suppressHydrationWarning !== !0 && Kr(r.textContent, u, e), (o = ["children", u]))
                    : typeof u == "number" &&
                      r.textContent !== "" + u &&
                      (l.suppressHydrationWarning !== !0 && Kr(r.textContent, u, e), (o = ["children", "" + u]))
                  : v.hasOwnProperty(s) && u != null && s === "onScroll" && ve("scroll", r);
              }
            switch (n) {
              case "input":
                (fn(r), qi(r, l, !0));
                break;
              case "textarea":
                (fn(r), ns(r));
                break;
              case "select":
              case "option":
                break;
              default:
                typeof l.onClick == "function" && (r.onclick = Jr);
            }
            ((r = o), (t.updateQueue = r), r !== null && (t.flags |= 4));
          } else {
            ((s = o.nodeType === 9 ? o : o.ownerDocument),
              e === "http://www.w3.org/1999/xhtml" && (e = rs(n)),
              e === "http://www.w3.org/1999/xhtml"
                ? n === "script"
                  ? ((e = s.createElement("div")), (e.innerHTML = "<script><\/script>"), (e = e.removeChild(e.firstChild)))
                  : typeof r.is == "string"
                    ? (e = s.createElement(n, { is: r.is }))
                    : ((e = s.createElement(n)), n === "select" && ((s = e), r.multiple ? (s.multiple = !0) : r.size && (s.size = r.size)))
                : (e = s.createElementNS(e, n)),
              (e[kt] = t),
              (e[ar] = r),
              hu(e, t, !1, !1),
              (t.stateNode = e));
            e: {
              switch (((s = Ko(n, r)), n)) {
                case "dialog":
                  (ve("cancel", e), ve("close", e), (o = r));
                  break;
                case "iframe":
                case "object":
                case "embed":
                  (ve("load", e), (o = r));
                  break;
                case "video":
                case "audio":
                  for (o = 0; o < lr.length; o++) ve(lr[o], e);
                  o = r;
                  break;
                case "source":
                  (ve("error", e), (o = r));
                  break;
                case "img":
                case "image":
                case "link":
                  (ve("error", e), ve("load", e), (o = r));
                  break;
                case "details":
                  (ve("toggle", e), (o = r));
                  break;
                case "input":
                  (Xi(e, r), (o = $o(e, r)), ve("invalid", e));
                  break;
                case "option":
                  o = r;
                  break;
                case "select":
                  ((e._wrapperState = { wasMultiple: !!r.multiple }), (o = _({}, r, { value: void 0 })), ve("invalid", e));
                  break;
                case "textarea":
                  (es(e, r), (o = Qo(e, r)), ve("invalid", e));
                  break;
                default:
                  o = r;
              }
              (Yo(n, o), (u = o));
              for (l in u)
                if (u.hasOwnProperty(l)) {
                  var d = u[l];
                  l === "style"
                    ? is(e, d)
                    : l === "dangerouslySetInnerHTML"
                      ? ((d = d ? d.__html : void 0), d != null && os(e, d))
                      : l === "children"
                        ? typeof d == "string"
                          ? (n !== "textarea" || d !== "") && Hn(e, d)
                          : typeof d == "number" && Hn(e, "" + d)
                        : l !== "suppressContentEditableWarning" &&
                          l !== "suppressHydrationWarning" &&
                          l !== "autoFocus" &&
                          (v.hasOwnProperty(l) ? d != null && l === "onScroll" && ve("scroll", e) : d != null && le(e, l, d, s));
                }
              switch (n) {
                case "input":
                  (fn(e), qi(e, r, !1));
                  break;
                case "textarea":
                  (fn(e), ns(e));
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ne(r.value));
                  break;
                case "select":
                  ((e.multiple = !!r.multiple),
                    (l = r.value),
                    l != null ? pn(e, !!r.multiple, l, !1) : r.defaultValue != null && pn(e, !!r.multiple, r.defaultValue, !0));
                  break;
                default:
                  typeof o.onClick == "function" && (e.onclick = Jr);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
        }
        return ($e(t), null);
      case 6:
        if (e && t.stateNode != null) yu(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(f(166));
          if (((n = rn(pr.current)), rn(wt.current), ro(t))) {
            if (((r = t.stateNode), (n = t.memoizedProps), (r[kt] = t), (l = r.nodeValue !== n) && ((e = nt), e !== null)))
              switch (e.tag) {
                case 3:
                  Kr(r.nodeValue, n, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 && Kr(r.nodeValue, n, (e.mode & 1) !== 0);
              }
            l && (t.flags |= 4);
          } else ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)), (r[kt] = t), (t.stateNode = r));
        }
        return ($e(t), null);
      case 13:
        if ((xe(Se), (r = t.memoizedState), e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))) {
          if (ke && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) (ka(), En(), (t.flags |= 98560), (l = !1));
          else if (((l = ro(t)), r !== null && r.dehydrated !== null)) {
            if (e === null) {
              if (!l) throw Error(f(318));
              if (((l = t.memoizedState), (l = l !== null ? l.dehydrated : null), !l)) throw Error(f(317));
              l[kt] = t;
            } else (En(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            ($e(t), (l = !1));
          } else (pt !== null && (bi(pt), (pt = null)), (l = !0));
          if (!l) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0
          ? ((t.lanes = n), t)
          : ((r = r !== null),
            r !== (e !== null && e.memoizedState !== null) &&
              r &&
              ((t.child.flags |= 8192), (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Le === 0 && (Le = 3) : Ei())),
            t.updateQueue !== null && (t.flags |= 4),
            $e(t),
            null);
      case 4:
        return (Ln(), mi(e, t), e === null && ir(t.stateNode.containerInfo), $e(t), null);
      case 10:
        return (Ul(t.type._context), $e(t), null);
      case 17:
        return (Je(t.type) && Zr(), $e(t), null);
      case 19:
        if ((xe(Se), (l = t.memoizedState), l === null)) return ($e(t), null);
        if (((r = (t.flags & 128) !== 0), (s = l.rendering), s === null))
          if (r) vr(l, !1);
          else {
            if (Le !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((s = uo(e)), s !== null)) {
                  for (
                    t.flags |= 128,
                      vr(l, !1),
                      r = s.updateQueue,
                      r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      r = n,
                      n = t.child;
                    n !== null;
                  )
                    ((l = n),
                      (e = r),
                      (l.flags &= 14680066),
                      (s = l.alternate),
                      s === null
                        ? ((l.childLanes = 0),
                          (l.lanes = e),
                          (l.child = null),
                          (l.subtreeFlags = 0),
                          (l.memoizedProps = null),
                          (l.memoizedState = null),
                          (l.updateQueue = null),
                          (l.dependencies = null),
                          (l.stateNode = null))
                        : ((l.childLanes = s.childLanes),
                          (l.lanes = s.lanes),
                          (l.child = s.child),
                          (l.subtreeFlags = 0),
                          (l.deletions = null),
                          (l.memoizedProps = s.memoizedProps),
                          (l.memoizedState = s.memoizedState),
                          (l.updateQueue = s.updateQueue),
                          (l.type = s.type),
                          (e = s.dependencies),
                          (l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                      (n = n.sibling));
                  return (ye(Se, (Se.current & 1) | 2), t.child);
                }
                e = e.sibling;
              }
            l.tail !== null && Ee() > Rn && ((t.flags |= 128), (r = !0), vr(l, !1), (t.lanes = 4194304));
          }
        else {
          if (!r)
            if (((e = uo(s)), e !== null)) {
              if (
                ((t.flags |= 128),
                (r = !0),
                (n = e.updateQueue),
                n !== null && ((t.updateQueue = n), (t.flags |= 4)),
                vr(l, !0),
                l.tail === null && l.tailMode === "hidden" && !s.alternate && !ke)
              )
                return ($e(t), null);
            } else 2 * Ee() - l.renderingStartTime > Rn && n !== 1073741824 && ((t.flags |= 128), (r = !0), vr(l, !1), (t.lanes = 4194304));
          l.isBackwards ? ((s.sibling = t.child), (t.child = s)) : ((n = l.last), n !== null ? (n.sibling = s) : (t.child = s), (l.last = s));
        }
        return l.tail !== null
          ? ((t = l.tail),
            (l.rendering = t),
            (l.tail = t.sibling),
            (l.renderingStartTime = Ee()),
            (t.sibling = null),
            (n = Se.current),
            ye(Se, r ? (n & 1) | 2 : n & 1),
            t)
          : ($e(t), null);
      case 22:
      case 23:
        return (
          zi(),
          (r = t.memoizedState !== null),
          e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
          r && (t.mode & 1) !== 0 ? (ot & 1073741824) !== 0 && ($e(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : $e(t),
          null
        );
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(f(156, t.tag));
  }
  function Hc(e, t) {
    switch ((Rl(t), t.tag)) {
      case 1:
        return (Je(t.type) && Zr(), (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (Ln(), xe(Ke), xe(Ae), Kl(), (e = t.flags), (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 5:
        return (Gl(t), null);
      case 13:
        if ((xe(Se), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(f(340));
          En();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (xe(Se), null);
      case 4:
        return (Ln(), null);
      case 10:
        return (Ul(t.type._context), null);
      case 22:
      case 23:
        return (zi(), null);
      case 24:
        return null;
      default:
        return null;
    }
  }
  var xo = !1,
    Be = !1,
    Ac = typeof WeakSet == "function" ? WeakSet : Set,
    U = null;
  function Mn(e, t) {
    var n = e.ref;
    if (n !== null)
      if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          be(e, t, r);
        }
      else n.current = null;
  }
  function hi(e, t, n) {
    try {
      n();
    } catch (r) {
      be(e, t, r);
    }
  }
  var vu = !1;
  function Uc(e, t) {
    if (((zl = Wr), (e = Js()), xl(e))) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var r = n.getSelection && n.getSelection();
          if (r && r.rangeCount !== 0) {
            n = r.anchorNode;
            var o = r.anchorOffset,
              l = r.focusNode;
            r = r.focusOffset;
            try {
              (n.nodeType, l.nodeType);
            } catch {
              n = null;
              break e;
            }
            var s = 0,
              u = -1,
              d = -1,
              y = 0,
              z = 0,
              P = e,
              b = null;
            t: for (;;) {
              for (
                var H;
                P !== n || (o !== 0 && P.nodeType !== 3) || (u = s + o),
                  P !== l || (r !== 0 && P.nodeType !== 3) || (d = s + r),
                  P.nodeType === 3 && (s += P.nodeValue.length),
                  (H = P.firstChild) !== null;
              )
                ((b = P), (P = H));
              for (;;) {
                if (P === e) break t;
                if ((b === n && ++y === o && (u = s), b === l && ++z === r && (d = s), (H = P.nextSibling) !== null)) break;
                ((P = b), (b = P.parentNode));
              }
              P = H;
            }
            n = u === -1 || d === -1 ? null : { start: u, end: d };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (El = { focusedElem: e, selectionRange: n }, Wr = !1, U = t; U !== null; )
      if (((t = U), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null)) ((e.return = t), (U = e));
      else
        for (; U !== null; ) {
          t = U;
          try {
            var $ = t.alternate;
            if ((t.flags & 1024) !== 0)
              switch (t.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if ($ !== null) {
                    var V = $.memoizedProps,
                      Pe = $.memoizedState,
                      m = t.stateNode,
                      p = m.getSnapshotBeforeUpdate(t.elementType === t.type ? V : mt(t.type, V), Pe);
                    m.__reactInternalSnapshotBeforeUpdate = p;
                  }
                  break;
                case 3:
                  var h = t.stateNode.containerInfo;
                  h.nodeType === 1 ? (h.textContent = "") : h.nodeType === 9 && h.documentElement && h.removeChild(h.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(f(163));
              }
          } catch (L) {
            be(t, t.return, L);
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (U = e));
            break;
          }
          U = t.return;
        }
    return (($ = vu), (vu = !1), $);
  }
  function xr(e, t, n) {
    var r = t.updateQueue;
    if (((r = r !== null ? r.lastEffect : null), r !== null)) {
      var o = (r = r.next);
      do {
        if ((o.tag & e) === e) {
          var l = o.destroy;
          ((o.destroy = void 0), l !== void 0 && hi(t, n, l));
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function ko(e, t) {
    if (((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)) {
      var n = (t = t.next);
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function gi(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : (t.current = e);
    }
  }
  function xu(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), xu(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && (delete t[kt], delete t[ar], delete t[Ll], delete t[Nc], delete t[bc])),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  function ku(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function wu(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || ku(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function yi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6)
      ((e = e.stateNode),
        t
          ? n.nodeType === 8
            ? n.parentNode.insertBefore(e, t)
            : n.insertBefore(e, t)
          : (n.nodeType === 8 ? ((t = n.parentNode), t.insertBefore(e, n)) : ((t = n), t.appendChild(e)),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = Jr)));
    else if (r !== 4 && ((e = e.child), e !== null)) for (yi(e, t, n), e = e.sibling; e !== null; ) (yi(e, t, n), (e = e.sibling));
  }
  function vi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (r !== 4 && ((e = e.child), e !== null)) for (vi(e, t, n), e = e.sibling; e !== null; ) (vi(e, t, n), (e = e.sibling));
  }
  var We = null,
    ht = !1;
  function Bt(e, t, n) {
    for (n = n.child; n !== null; ) (Su(e, t, n), (n = n.sibling));
  }
  function Su(e, t, n) {
    if (xt && typeof xt.onCommitFiberUnmount == "function")
      try {
        xt.onCommitFiberUnmount(Lr, n);
      } catch {}
    switch (n.tag) {
      case 5:
        Be || Mn(n, t);
      case 6:
        var r = We,
          o = ht;
        ((We = null),
          Bt(e, t, n),
          (We = r),
          (ht = o),
          We !== null &&
            (ht ? ((e = We), (n = n.stateNode), e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : We.removeChild(n.stateNode)));
        break;
      case 18:
        We !== null &&
          (ht ? ((e = We), (n = n.stateNode), e.nodeType === 8 ? Tl(e.parentNode, n) : e.nodeType === 1 && Tl(e, n), Xn(e)) : Tl(We, n.stateNode));
        break;
      case 4:
        ((r = We), (o = ht), (We = n.stateNode.containerInfo), (ht = !0), Bt(e, t, n), (We = r), (ht = o));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Be && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
          o = r = r.next;
          do {
            var l = o,
              s = l.destroy;
            ((l = l.tag), s !== void 0 && ((l & 2) !== 0 || (l & 4) !== 0) && hi(n, t, s), (o = o.next));
          } while (o !== r);
        }
        Bt(e, t, n);
        break;
      case 1:
        if (!Be && (Mn(n, t), (r = n.stateNode), typeof r.componentWillUnmount == "function"))
          try {
            ((r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount());
          } catch (u) {
            be(n, t, u);
          }
        Bt(e, t, n);
        break;
      case 21:
        Bt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? ((Be = (r = Be) || n.memoizedState !== null), Bt(e, t, n), (Be = r)) : Bt(e, t, n);
        break;
      default:
        Bt(e, t, n);
    }
  }
  function ju(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      (n === null && (n = e.stateNode = new Ac()),
        t.forEach(function (r) {
          var o = Xc.bind(null, e, r);
          n.has(r) || (n.add(r), r.then(o, o));
        }));
    }
  }
  function gt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var r = 0; r < n.length; r++) {
        var o = n[r];
        try {
          var l = e,
            s = t,
            u = s;
          e: for (; u !== null; ) {
            switch (u.tag) {
              case 5:
                ((We = u.stateNode), (ht = !1));
                break e;
              case 3:
                ((We = u.stateNode.containerInfo), (ht = !0));
                break e;
              case 4:
                ((We = u.stateNode.containerInfo), (ht = !0));
                break e;
            }
            u = u.return;
          }
          if (We === null) throw Error(f(160));
          (Su(l, s, o), (We = null), (ht = !1));
          var d = o.alternate;
          (d !== null && (d.return = null), (o.return = null));
        } catch (y) {
          be(o, t, y);
        }
      }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) (Nu(t, e), (t = t.sibling));
  }
  function Nu(e, t) {
    var n = e.alternate,
      r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((gt(t, e), jt(e), r & 4)) {
          try {
            (xr(3, e, e.return), ko(3, e));
          } catch (V) {
            be(e, e.return, V);
          }
          try {
            xr(5, e, e.return);
          } catch (V) {
            be(e, e.return, V);
          }
        }
        break;
      case 1:
        (gt(t, e), jt(e), r & 512 && n !== null && Mn(n, n.return));
        break;
      case 5:
        if ((gt(t, e), jt(e), r & 512 && n !== null && Mn(n, n.return), e.flags & 32)) {
          var o = e.stateNode;
          try {
            Hn(o, "");
          } catch (V) {
            be(e, e.return, V);
          }
        }
        if (r & 4 && ((o = e.stateNode), o != null)) {
          var l = e.memoizedProps,
            s = n !== null ? n.memoizedProps : l,
            u = e.type,
            d = e.updateQueue;
          if (((e.updateQueue = null), d !== null))
            try {
              (u === "input" && l.type === "radio" && l.name != null && Zi(o, l), Ko(u, s));
              var y = Ko(u, l);
              for (s = 0; s < d.length; s += 2) {
                var z = d[s],
                  P = d[s + 1];
                z === "style" ? is(o, P) : z === "dangerouslySetInnerHTML" ? os(o, P) : z === "children" ? Hn(o, P) : le(o, z, P, y);
              }
              switch (u) {
                case "input":
                  Bo(o, l);
                  break;
                case "textarea":
                  ts(o, l);
                  break;
                case "select":
                  var b = o._wrapperState.wasMultiple;
                  o._wrapperState.wasMultiple = !!l.multiple;
                  var H = l.value;
                  H != null
                    ? pn(o, !!l.multiple, H, !1)
                    : b !== !!l.multiple &&
                      (l.defaultValue != null ? pn(o, !!l.multiple, l.defaultValue, !0) : pn(o, !!l.multiple, l.multiple ? [] : "", !1));
              }
              o[ar] = l;
            } catch (V) {
              be(e, e.return, V);
            }
        }
        break;
      case 6:
        if ((gt(t, e), jt(e), r & 4)) {
          if (e.stateNode === null) throw Error(f(162));
          ((o = e.stateNode), (l = e.memoizedProps));
          try {
            o.nodeValue = l;
          } catch (V) {
            be(e, e.return, V);
          }
        }
        break;
      case 3:
        if ((gt(t, e), jt(e), r & 4 && n !== null && n.memoizedState.isDehydrated))
          try {
            Xn(t.containerInfo);
          } catch (V) {
            be(e, e.return, V);
          }
        break;
      case 4:
        (gt(t, e), jt(e));
        break;
      case 13:
        (gt(t, e),
          jt(e),
          (o = e.child),
          o.flags & 8192 &&
            ((l = o.memoizedState !== null),
            (o.stateNode.isHidden = l),
            !l || (o.alternate !== null && o.alternate.memoizedState !== null) || (wi = Ee())),
          r & 4 && ju(e));
        break;
      case 22:
        if (((z = n !== null && n.memoizedState !== null), e.mode & 1 ? ((Be = (y = Be) || z), gt(t, e), (Be = y)) : gt(t, e), jt(e), r & 8192)) {
          if (((y = e.memoizedState !== null), (e.stateNode.isHidden = y) && !z && (e.mode & 1) !== 0))
            for (U = e, z = e.child; z !== null; ) {
              for (P = U = z; U !== null; ) {
                switch (((b = U), (H = b.child), b.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    xr(4, b, b.return);
                    break;
                  case 1:
                    Mn(b, b.return);
                    var $ = b.stateNode;
                    if (typeof $.componentWillUnmount == "function") {
                      ((r = b), (n = b.return));
                      try {
                        ((t = r), ($.props = t.memoizedProps), ($.state = t.memoizedState), $.componentWillUnmount());
                      } catch (V) {
                        be(r, n, V);
                      }
                    }
                    break;
                  case 5:
                    Mn(b, b.return);
                    break;
                  case 22:
                    if (b.memoizedState !== null) {
                      zu(P);
                      continue;
                    }
                }
                H !== null ? ((H.return = b), (U = H)) : zu(P);
              }
              z = z.sibling;
            }
          e: for (z = null, P = e; ; ) {
            if (P.tag === 5) {
              if (z === null) {
                z = P;
                try {
                  ((o = P.stateNode),
                    y
                      ? ((l = o.style), typeof l.setProperty == "function" ? l.setProperty("display", "none", "important") : (l.display = "none"))
                      : ((u = P.stateNode),
                        (d = P.memoizedProps.style),
                        (s = d != null && d.hasOwnProperty("display") ? d.display : null),
                        (u.style.display = ls("display", s))));
                } catch (V) {
                  be(e, e.return, V);
                }
              }
            } else if (P.tag === 6) {
              if (z === null)
                try {
                  P.stateNode.nodeValue = y ? "" : P.memoizedProps;
                } catch (V) {
                  be(e, e.return, V);
                }
            } else if (((P.tag !== 22 && P.tag !== 23) || P.memoizedState === null || P === e) && P.child !== null) {
              ((P.child.return = P), (P = P.child));
              continue;
            }
            if (P === e) break e;
            for (; P.sibling === null; ) {
              if (P.return === null || P.return === e) break e;
              (z === P && (z = null), (P = P.return));
            }
            (z === P && (z = null), (P.sibling.return = P.return), (P = P.sibling));
          }
        }
        break;
      case 19:
        (gt(t, e), jt(e), r & 4 && ju(e));
        break;
      case 21:
        break;
      default:
        (gt(t, e), jt(e));
    }
  }
  function jt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (ku(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(f(160));
        }
        switch (r.tag) {
          case 5:
            var o = r.stateNode;
            r.flags & 32 && (Hn(o, ""), (r.flags &= -33));
            var l = wu(e);
            vi(e, l, o);
            break;
          case 3:
          case 4:
            var s = r.stateNode.containerInfo,
              u = wu(e);
            yi(e, u, s);
            break;
          default:
            throw Error(f(161));
        }
      } catch (d) {
        be(e, e.return, d);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function $c(e, t, n) {
    ((U = e), bu(e));
  }
  function bu(e, t, n) {
    for (var r = (e.mode & 1) !== 0; U !== null; ) {
      var o = U,
        l = o.child;
      if (o.tag === 22 && r) {
        var s = o.memoizedState !== null || xo;
        if (!s) {
          var u = o.alternate,
            d = (u !== null && u.memoizedState !== null) || Be;
          u = xo;
          var y = Be;
          if (((xo = s), (Be = d) && !y))
            for (U = o; U !== null; )
              ((s = U), (d = s.child), s.tag === 22 && s.memoizedState !== null ? Eu(o) : d !== null ? ((d.return = s), (U = d)) : Eu(o));
          for (; l !== null; ) ((U = l), bu(l), (l = l.sibling));
          ((U = o), (xo = u), (Be = y));
        }
        Cu(e);
      } else (o.subtreeFlags & 8772) !== 0 && l !== null ? ((l.return = o), (U = l)) : Cu(e);
    }
  }
  function Cu(e) {
    for (; U !== null; ) {
      var t = U;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                Be || ko(5, t);
                break;
              case 1:
                var r = t.stateNode;
                if (t.flags & 4 && !Be)
                  if (n === null) r.componentDidMount();
                  else {
                    var o = t.elementType === t.type ? n.memoizedProps : mt(t.type, n.memoizedProps);
                    r.componentDidUpdate(o, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                  }
                var l = t.updateQueue;
                l !== null && za(t, l, r);
                break;
              case 3:
                var s = t.updateQueue;
                if (s !== null) {
                  if (((n = null), t.child !== null))
                    switch (t.child.tag) {
                      case 5:
                        n = t.child.stateNode;
                        break;
                      case 1:
                        n = t.child.stateNode;
                    }
                  za(t, s, n);
                }
                break;
              case 5:
                var u = t.stateNode;
                if (n === null && t.flags & 4) {
                  n = u;
                  var d = t.memoizedProps;
                  switch (t.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      d.autoFocus && n.focus();
                      break;
                    case "img":
                      d.src && (n.src = d.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (t.memoizedState === null) {
                  var y = t.alternate;
                  if (y !== null) {
                    var z = y.memoizedState;
                    if (z !== null) {
                      var P = z.dehydrated;
                      P !== null && Xn(P);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(f(163));
            }
          Be || (t.flags & 512 && gi(t));
        } catch (b) {
          be(t, t.return, b);
        }
      }
      if (t === e) {
        U = null;
        break;
      }
      if (((n = t.sibling), n !== null)) {
        ((n.return = t.return), (U = n));
        break;
      }
      U = t.return;
    }
  }
  function zu(e) {
    for (; U !== null; ) {
      var t = U;
      if (t === e) {
        U = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        ((n.return = t.return), (U = n));
        break;
      }
      U = t.return;
    }
  }
  function Eu(e) {
    for (; U !== null; ) {
      var t = U;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              ko(4, t);
            } catch (d) {
              be(t, n, d);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var o = t.return;
              try {
                r.componentDidMount();
              } catch (d) {
                be(t, o, d);
              }
            }
            var l = t.return;
            try {
              gi(t);
            } catch (d) {
              be(t, l, d);
            }
            break;
          case 5:
            var s = t.return;
            try {
              gi(t);
            } catch (d) {
              be(t, s, d);
            }
        }
      } catch (d) {
        be(t, t.return, d);
      }
      if (t === e) {
        U = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        ((u.return = t.return), (U = u));
        break;
      }
      U = t.return;
    }
  }
  var Bc = Math.ceil,
    wo = ae.ReactCurrentDispatcher,
    xi = ae.ReactCurrentOwner,
    ut = ae.ReactCurrentBatchConfig,
    ie = 0,
    Me = null,
    _e = null,
    Fe = 0,
    ot = 0,
    On = Ft(0),
    Le = 0,
    kr = null,
    ln = 0,
    So = 0,
    ki = 0,
    wr = null,
    Ze = null,
    wi = 0,
    Rn = 1 / 0,
    Tt = null,
    jo = !1,
    Si = null,
    Vt = null,
    No = !1,
    Qt = null,
    bo = 0,
    Sr = 0,
    ji = null,
    Co = -1,
    zo = 0;
  function Ge() {
    return (ie & 6) !== 0 ? Ee() : Co !== -1 ? Co : (Co = Ee());
  }
  function Gt(e) {
    return (e.mode & 1) === 0
      ? 1
      : (ie & 2) !== 0 && Fe !== 0
        ? Fe & -Fe
        : zc.transition !== null
          ? (zo === 0 && (zo = ws()), zo)
          : ((e = pe), e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : _s(e.type))), e);
  }
  function yt(e, t, n, r) {
    if (50 < Sr) throw ((Sr = 0), (ji = null), Error(f(185)));
    (Qn(e, n, r),
      ((ie & 2) === 0 || e !== Me) &&
        (e === Me && ((ie & 2) === 0 && (So |= n), Le === 4 && Yt(e, Fe)),
        qe(e, r),
        n === 1 && ie === 0 && (t.mode & 1) === 0 && ((Rn = Ee() + 500), eo && At())));
  }
  function qe(e, t) {
    var n = e.callbackNode;
    zd(e, t);
    var r = Or(e, e === Me ? Fe : 0);
    if (r === 0) (n !== null && vs(n), (e.callbackNode = null), (e.callbackPriority = 0));
    else if (((t = r & -r), e.callbackPriority !== t)) {
      if ((n != null && vs(n), t === 1))
        (e.tag === 0 ? Cc(_u.bind(null, e)) : ha(_u.bind(null, e)),
          Sc(function () {
            (ie & 6) === 0 && At();
          }),
          (n = null));
      else {
        switch (Ss(r)) {
          case 1:
            n = nl;
            break;
          case 4:
            n = xs;
            break;
          case 16:
            n = Tr;
            break;
          case 536870912:
            n = ks;
            break;
          default:
            n = Tr;
        }
        n = Wu(n, Pu.bind(null, e));
      }
      ((e.callbackPriority = t), (e.callbackNode = n));
    }
  }
  function Pu(e, t) {
    if (((Co = -1), (zo = 0), (ie & 6) !== 0)) throw Error(f(327));
    var n = e.callbackNode;
    if (In() && e.callbackNode !== n) return null;
    var r = Or(e, e === Me ? Fe : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Eo(e, r);
    else {
      t = r;
      var o = ie;
      ie |= 2;
      var l = Lu();
      (Me !== e || Fe !== t) && ((Tt = null), (Rn = Ee() + 500), an(e, t));
      do
        try {
          Gc();
          break;
        } catch (u) {
          Tu(e, u);
        }
      while (!0);
      (Al(), (wo.current = l), (ie = o), _e !== null ? (t = 0) : ((Me = null), (Fe = 0), (t = Le)));
    }
    if (t !== 0) {
      if ((t === 2 && ((o = rl(e)), o !== 0 && ((r = o), (t = Ni(e, o)))), t === 1)) throw ((n = kr), an(e, 0), Yt(e, r), qe(e, Ee()), n);
      if (t === 6) Yt(e, r);
      else {
        if (
          ((o = e.current.alternate),
          (r & 30) === 0 && !Vc(o) && ((t = Eo(e, r)), t === 2 && ((l = rl(e)), l !== 0 && ((r = l), (t = Ni(e, l)))), t === 1))
        )
          throw ((n = kr), an(e, 0), Yt(e, r), qe(e, Ee()), n);
        switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
          case 0:
          case 1:
            throw Error(f(345));
          case 2:
            un(e, Ze, Tt);
            break;
          case 3:
            if ((Yt(e, r), (r & 130023424) === r && ((t = wi + 500 - Ee()), 10 < t))) {
              if (Or(e, 0) !== 0) break;
              if (((o = e.suspendedLanes), (o & r) !== r)) {
                (Ge(), (e.pingedLanes |= e.suspendedLanes & o));
                break;
              }
              e.timeoutHandle = _l(un.bind(null, e, Ze, Tt), t);
              break;
            }
            un(e, Ze, Tt);
            break;
          case 4:
            if ((Yt(e, r), (r & 4194240) === r)) break;
            for (t = e.eventTimes, o = -1; 0 < r; ) {
              var s = 31 - ct(r);
              ((l = 1 << s), (s = t[s]), s > o && (o = s), (r &= ~l));
            }
            if (
              ((r = o),
              (r = Ee() - r),
              (r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Bc(r / 1960)) - r),
              10 < r)
            ) {
              e.timeoutHandle = _l(un.bind(null, e, Ze, Tt), r);
              break;
            }
            un(e, Ze, Tt);
            break;
          case 5:
            un(e, Ze, Tt);
            break;
          default:
            throw Error(f(329));
        }
      }
    }
    return (qe(e, Ee()), e.callbackNode === n ? Pu.bind(null, e) : null);
  }
  function Ni(e, t) {
    var n = wr;
    return (e.current.memoizedState.isDehydrated && (an(e, t).flags |= 256), (e = Eo(e, t)), e !== 2 && ((t = Ze), (Ze = n), t !== null && bi(t)), e);
  }
  function bi(e) {
    Ze === null ? (Ze = e) : Ze.push.apply(Ze, e);
  }
  function Vc(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && ((n = n.stores), n !== null))
          for (var r = 0; r < n.length; r++) {
            var o = n[r],
              l = o.getSnapshot;
            o = o.value;
            try {
              if (!ft(l(), o)) return !1;
            } catch {
              return !1;
            }
          }
      }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function Yt(e, t) {
    for (t &= ~ki, t &= ~So, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ct(t),
        r = 1 << n;
      ((e[n] = -1), (t &= ~r));
    }
  }
  function _u(e) {
    if ((ie & 6) !== 0) throw Error(f(327));
    In();
    var t = Or(e, 0);
    if ((t & 1) === 0) return (qe(e, Ee()), null);
    var n = Eo(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = rl(e);
      r !== 0 && ((t = r), (n = Ni(e, r)));
    }
    if (n === 1) throw ((n = kr), an(e, 0), Yt(e, t), qe(e, Ee()), n);
    if (n === 6) throw Error(f(345));
    return ((e.finishedWork = e.current.alternate), (e.finishedLanes = t), un(e, Ze, Tt), qe(e, Ee()), null);
  }
  function Ci(e, t) {
    var n = ie;
    ie |= 1;
    try {
      return e(t);
    } finally {
      ((ie = n), ie === 0 && ((Rn = Ee() + 500), eo && At()));
    }
  }
  function sn(e) {
    Qt !== null && Qt.tag === 0 && (ie & 6) === 0 && In();
    var t = ie;
    ie |= 1;
    var n = ut.transition,
      r = pe;
    try {
      if (((ut.transition = null), (pe = 1), e)) return e();
    } finally {
      ((pe = r), (ut.transition = n), (ie = t), (ie & 6) === 0 && At());
    }
  }
  function zi() {
    ((ot = On.current), xe(On));
  }
  function an(e, t) {
    ((e.finishedWork = null), (e.finishedLanes = 0));
    var n = e.timeoutHandle;
    if ((n !== -1 && ((e.timeoutHandle = -1), wc(n)), _e !== null))
      for (n = _e.return; n !== null; ) {
        var r = n;
        switch ((Rl(r), r.tag)) {
          case 1:
            ((r = r.type.childContextTypes), r != null && Zr());
            break;
          case 3:
            (Ln(), xe(Ke), xe(Ae), Kl());
            break;
          case 5:
            Gl(r);
            break;
          case 4:
            Ln();
            break;
          case 13:
            xe(Se);
            break;
          case 19:
            xe(Se);
            break;
          case 10:
            Ul(r.type._context);
            break;
          case 22:
          case 23:
            zi();
        }
        n = n.return;
      }
    if (((Me = e), (_e = e = Kt(e.current, null)), (Fe = ot = t), (Le = 0), (kr = null), (ki = So = ln = 0), (Ze = wr = null), nn !== null)) {
      for (t = 0; t < nn.length; t++)
        if (((n = nn[t]), (r = n.interleaved), r !== null)) {
          n.interleaved = null;
          var o = r.next,
            l = n.pending;
          if (l !== null) {
            var s = l.next;
            ((l.next = o), (r.next = s));
          }
          n.pending = r;
        }
      nn = null;
    }
    return e;
  }
  function Tu(e, t) {
    do {
      var n = _e;
      try {
        if ((Al(), (co.current = ho), fo)) {
          for (var r = je.memoizedState; r !== null; ) {
            var o = r.queue;
            (o !== null && (o.pending = null), (r = r.next));
          }
          fo = !1;
        }
        if (((on = 0), (De = Te = je = null), (mr = !1), (hr = 0), (xi.current = null), n === null || n.return === null)) {
          ((Le = 1), (kr = t), (_e = null));
          break;
        }
        e: {
          var l = e,
            s = n.return,
            u = n,
            d = t;
          if (((t = Fe), (u.flags |= 32768), d !== null && typeof d == "object" && typeof d.then == "function")) {
            var y = d,
              z = u,
              P = z.tag;
            if ((z.mode & 1) === 0 && (P === 0 || P === 11 || P === 15)) {
              var b = z.alternate;
              b
                ? ((z.updateQueue = b.updateQueue), (z.memoizedState = b.memoizedState), (z.lanes = b.lanes))
                : ((z.updateQueue = null), (z.memoizedState = null));
            }
            var H = nu(s);
            if (H !== null) {
              ((H.flags &= -257), ru(H, s, u, l, t), H.mode & 1 && tu(l, y, t), (t = H), (d = y));
              var $ = t.updateQueue;
              if ($ === null) {
                var V = new Set();
                (V.add(d), (t.updateQueue = V));
              } else $.add(d);
              break e;
            } else {
              if ((t & 1) === 0) {
                (tu(l, y, t), Ei());
                break e;
              }
              d = Error(f(426));
            }
          } else if (ke && u.mode & 1) {
            var Pe = nu(s);
            if (Pe !== null) {
              ((Pe.flags & 65536) === 0 && (Pe.flags |= 256), ru(Pe, s, u, l, t), Fl(Dn(d, u)));
              break e;
            }
          }
          ((l = d = Dn(d, u)), Le !== 4 && (Le = 2), wr === null ? (wr = [l]) : wr.push(l), (l = s));
          do {
            switch (l.tag) {
              case 3:
                ((l.flags |= 65536), (t &= -t), (l.lanes |= t));
                var m = qa(l, d, t);
                Ca(l, m);
                break e;
              case 1:
                u = d;
                var p = l.type,
                  h = l.stateNode;
                if (
                  (l.flags & 128) === 0 &&
                  (typeof p.getDerivedStateFromError == "function" ||
                    (h !== null && typeof h.componentDidCatch == "function" && (Vt === null || !Vt.has(h))))
                ) {
                  ((l.flags |= 65536), (t &= -t), (l.lanes |= t));
                  var L = eu(l, u, t);
                  Ca(l, L);
                  break e;
                }
            }
            l = l.return;
          } while (l !== null);
        }
        Mu(n);
      } catch (Q) {
        ((t = Q), _e === n && n !== null && (_e = n = n.return));
        continue;
      }
      break;
    } while (!0);
  }
  function Lu() {
    var e = wo.current;
    return ((wo.current = ho), e === null ? ho : e);
  }
  function Ei() {
    ((Le === 0 || Le === 3 || Le === 2) && (Le = 4), Me === null || ((ln & 268435455) === 0 && (So & 268435455) === 0) || Yt(Me, Fe));
  }
  function Eo(e, t) {
    var n = ie;
    ie |= 2;
    var r = Lu();
    (Me !== e || Fe !== t) && ((Tt = null), an(e, t));
    do
      try {
        Qc();
        break;
      } catch (o) {
        Tu(e, o);
      }
    while (!0);
    if ((Al(), (ie = n), (wo.current = r), _e !== null)) throw Error(f(261));
    return ((Me = null), (Fe = 0), Le);
  }
  function Qc() {
    for (; _e !== null; ) Du(_e);
  }
  function Gc() {
    for (; _e !== null && !vd(); ) Du(_e);
  }
  function Du(e) {
    var t = Iu(e.alternate, e, ot);
    ((e.memoizedProps = e.pendingProps), t === null ? Mu(e) : (_e = t), (xi.current = null));
  }
  function Mu(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (((e = t.return), (t.flags & 32768) === 0)) {
        if (((n = Fc(n, t, ot)), n !== null)) {
          _e = n;
          return;
        }
      } else {
        if (((n = Hc(n, t)), n !== null)) {
          ((n.flags &= 32767), (_e = n));
          return;
        }
        if (e !== null) ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
        else {
          ((Le = 6), (_e = null));
          return;
        }
      }
      if (((t = t.sibling), t !== null)) {
        _e = t;
        return;
      }
      _e = t = e;
    } while (t !== null);
    Le === 0 && (Le = 5);
  }
  function un(e, t, n) {
    var r = pe,
      o = ut.transition;
    try {
      ((ut.transition = null), (pe = 1), Yc(e, t, n, r));
    } finally {
      ((ut.transition = o), (pe = r));
    }
    return null;
  }
  function Yc(e, t, n, r) {
    do In();
    while (Qt !== null);
    if ((ie & 6) !== 0) throw Error(f(327));
    n = e.finishedWork;
    var o = e.finishedLanes;
    if (n === null) return null;
    if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(f(177));
    ((e.callbackNode = null), (e.callbackPriority = 0));
    var l = n.lanes | n.childLanes;
    if (
      (Ed(e, l),
      e === Me && ((_e = Me = null), (Fe = 0)),
      ((n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0) ||
        No ||
        ((No = !0),
        Wu(Tr, function () {
          return (In(), null);
        })),
      (l = (n.flags & 15990) !== 0),
      (n.subtreeFlags & 15990) !== 0 || l)
    ) {
      ((l = ut.transition), (ut.transition = null));
      var s = pe;
      pe = 1;
      var u = ie;
      ((ie |= 4),
        (xi.current = null),
        Uc(e, n),
        Nu(n, e),
        mc(El),
        (Wr = !!zl),
        (El = zl = null),
        (e.current = n),
        $c(n),
        xd(),
        (ie = u),
        (pe = s),
        (ut.transition = l));
    } else e.current = n;
    if ((No && ((No = !1), (Qt = e), (bo = o)), (l = e.pendingLanes), l === 0 && (Vt = null), Sd(n.stateNode), qe(e, Ee()), t !== null))
      for (r = e.onRecoverableError, n = 0; n < t.length; n++) ((o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest }));
    if (jo) throw ((jo = !1), (e = Si), (Si = null), e);
    return (
      (bo & 1) !== 0 && e.tag !== 0 && In(),
      (l = e.pendingLanes),
      (l & 1) !== 0 ? (e === ji ? Sr++ : ((Sr = 0), (ji = e))) : (Sr = 0),
      At(),
      null
    );
  }
  function In() {
    if (Qt !== null) {
      var e = Ss(bo),
        t = ut.transition,
        n = pe;
      try {
        if (((ut.transition = null), (pe = 16 > e ? 16 : e), Qt === null)) var r = !1;
        else {
          if (((e = Qt), (Qt = null), (bo = 0), (ie & 6) !== 0)) throw Error(f(331));
          var o = ie;
          for (ie |= 4, U = e.current; U !== null; ) {
            var l = U,
              s = l.child;
            if ((U.flags & 16) !== 0) {
              var u = l.deletions;
              if (u !== null) {
                for (var d = 0; d < u.length; d++) {
                  var y = u[d];
                  for (U = y; U !== null; ) {
                    var z = U;
                    switch (z.tag) {
                      case 0:
                      case 11:
                      case 15:
                        xr(8, z, l);
                    }
                    var P = z.child;
                    if (P !== null) ((P.return = z), (U = P));
                    else
                      for (; U !== null; ) {
                        z = U;
                        var b = z.sibling,
                          H = z.return;
                        if ((xu(z), z === y)) {
                          U = null;
                          break;
                        }
                        if (b !== null) {
                          ((b.return = H), (U = b));
                          break;
                        }
                        U = H;
                      }
                  }
                }
                var $ = l.alternate;
                if ($ !== null) {
                  var V = $.child;
                  if (V !== null) {
                    $.child = null;
                    do {
                      var Pe = V.sibling;
                      ((V.sibling = null), (V = Pe));
                    } while (V !== null);
                  }
                }
                U = l;
              }
            }
            if ((l.subtreeFlags & 2064) !== 0 && s !== null) ((s.return = l), (U = s));
            else
              e: for (; U !== null; ) {
                if (((l = U), (l.flags & 2048) !== 0))
                  switch (l.tag) {
                    case 0:
                    case 11:
                    case 15:
                      xr(9, l, l.return);
                  }
                var m = l.sibling;
                if (m !== null) {
                  ((m.return = l.return), (U = m));
                  break e;
                }
                U = l.return;
              }
          }
          var p = e.current;
          for (U = p; U !== null; ) {
            s = U;
            var h = s.child;
            if ((s.subtreeFlags & 2064) !== 0 && h !== null) ((h.return = s), (U = h));
            else
              e: for (s = p; U !== null; ) {
                if (((u = U), (u.flags & 2048) !== 0))
                  try {
                    switch (u.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ko(9, u);
                    }
                  } catch (Q) {
                    be(u, u.return, Q);
                  }
                if (u === s) {
                  U = null;
                  break e;
                }
                var L = u.sibling;
                if (L !== null) {
                  ((L.return = u.return), (U = L));
                  break e;
                }
                U = u.return;
              }
          }
          if (((ie = o), At(), xt && typeof xt.onPostCommitFiberRoot == "function"))
            try {
              xt.onPostCommitFiberRoot(Lr, e);
            } catch {}
          r = !0;
        }
        return r;
      } finally {
        ((pe = n), (ut.transition = t));
      }
    }
    return !1;
  }
  function Ou(e, t, n) {
    ((t = Dn(n, t)), (t = qa(e, t, 1)), (e = $t(e, t, 1)), (t = Ge()), e !== null && (Qn(e, 1, t), qe(e, t)));
  }
  function be(e, t, n) {
    if (e.tag === 3) Ou(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Ou(t, e, n);
          break;
        } else if (t.tag === 1) {
          var r = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || (typeof r.componentDidCatch == "function" && (Vt === null || !Vt.has(r)))) {
            ((e = Dn(n, e)), (e = eu(t, e, 1)), (t = $t(t, e, 1)), (e = Ge()), t !== null && (Qn(t, 1, e), qe(t, e)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Kc(e, t, n) {
    var r = e.pingCache;
    (r !== null && r.delete(t),
      (t = Ge()),
      (e.pingedLanes |= e.suspendedLanes & n),
      Me === e && (Fe & n) === n && (Le === 4 || (Le === 3 && (Fe & 130023424) === Fe && 500 > Ee() - wi) ? an(e, 0) : (ki |= n)),
      qe(e, t));
  }
  function Ru(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? (t = 1) : ((t = Mr), (Mr <<= 1), (Mr & 130023424) === 0 && (Mr = 4194304)));
    var n = Ge();
    ((e = Et(e, t)), e !== null && (Qn(e, t, n), qe(e, n)));
  }
  function Jc(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), Ru(e, n));
  }
  function Xc(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode,
          o = e.memoizedState;
        o !== null && (n = o.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(f(314));
    }
    (r !== null && r.delete(t), Ru(e, n));
  }
  var Iu;
  Iu = function (e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps || Ke.current) Xe = !0;
      else {
        if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return ((Xe = !1), Wc(e, t, n));
        Xe = (e.flags & 131072) !== 0;
      }
    else ((Xe = !1), ke && (t.flags & 1048576) !== 0 && ga(t, no, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var r = t.type;
        (vo(e, t), (e = t.pendingProps));
        var o = bn(t, Ae.current);
        (Tn(t, n), (o = Zl(null, t, r, e, o, n)));
        var l = ql();
        return (
          (t.flags |= 1),
          typeof o == "object" && o !== null && typeof o.render == "function" && o.$$typeof === void 0
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              Je(r) ? ((l = !0), qr(t)) : (l = !1),
              (t.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null),
              Vl(t),
              (o.updater = go),
              (t.stateNode = o),
              (o._reactInternals = t),
              li(t, r, e, n),
              (t = ui(null, t, r, !0, l, n)))
            : ((t.tag = 0), ke && l && Ol(t), Qe(null, t, o, n), (t = t.child)),
          t
        );
      case 16:
        r = t.elementType;
        e: {
          switch ((vo(e, t), (e = t.pendingProps), (o = r._init), (r = o(r._payload)), (t.type = r), (o = t.tag = qc(r)), (e = mt(r, e)), o)) {
            case 0:
              t = ai(null, t, r, e, n);
              break e;
            case 1:
              t = uu(null, t, r, e, n);
              break e;
            case 11:
              t = ou(null, t, r, e, n);
              break e;
            case 14:
              t = lu(null, t, r, mt(r.type, e), n);
              break e;
          }
          throw Error(f(306, r, ""));
        }
        return t;
      case 0:
        return ((r = t.type), (o = t.pendingProps), (o = t.elementType === r ? o : mt(r, o)), ai(e, t, r, o, n));
      case 1:
        return ((r = t.type), (o = t.pendingProps), (o = t.elementType === r ? o : mt(r, o)), uu(e, t, r, o, n));
      case 3:
        e: {
          if ((du(t), e === null)) throw Error(f(387));
          ((r = t.pendingProps), (l = t.memoizedState), (o = l.element), ba(e, t), ao(t, r, null, n));
          var s = t.memoizedState;
          if (((r = s.element), l.isDehydrated))
            if (
              ((l = {
                element: r,
                isDehydrated: !1,
                cache: s.cache,
                pendingSuspenseBoundaries: s.pendingSuspenseBoundaries,
                transitions: s.transitions,
              }),
              (t.updateQueue.baseState = l),
              (t.memoizedState = l),
              t.flags & 256)
            ) {
              ((o = Dn(Error(f(423)), t)), (t = cu(e, t, r, n, o)));
              break e;
            } else if (r !== o) {
              ((o = Dn(Error(f(424)), t)), (t = cu(e, t, r, n, o)));
              break e;
            } else
              for (rt = Wt(t.stateNode.containerInfo.firstChild), nt = t, ke = !0, pt = null, n = ja(t, null, r, n), t.child = n; n; )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
          else {
            if ((En(), r === o)) {
              t = _t(e, t, n);
              break e;
            }
            Qe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return (
          Ea(t),
          e === null && Wl(t),
          (r = t.type),
          (o = t.pendingProps),
          (l = e !== null ? e.memoizedProps : null),
          (s = o.children),
          Pl(r, o) ? (s = null) : l !== null && Pl(r, l) && (t.flags |= 32),
          au(e, t),
          Qe(e, t, s, n),
          t.child
        );
      case 6:
        return (e === null && Wl(t), null);
      case 13:
        return fu(e, t, n);
      case 4:
        return (Ql(t, t.stateNode.containerInfo), (r = t.pendingProps), e === null ? (t.child = Pn(t, null, r, n)) : Qe(e, t, r, n), t.child);
      case 11:
        return ((r = t.type), (o = t.pendingProps), (o = t.elementType === r ? o : mt(r, o)), ou(e, t, r, o, n));
      case 7:
        return (Qe(e, t, t.pendingProps, n), t.child);
      case 8:
        return (Qe(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (Qe(e, t, t.pendingProps.children, n), t.child);
      case 10:
        e: {
          if (
            ((r = t.type._context),
            (o = t.pendingProps),
            (l = t.memoizedProps),
            (s = o.value),
            ye(lo, r._currentValue),
            (r._currentValue = s),
            l !== null)
          )
            if (ft(l.value, s)) {
              if (l.children === o.children && !Ke.current) {
                t = _t(e, t, n);
                break e;
              }
            } else
              for (l = t.child, l !== null && (l.return = t); l !== null; ) {
                var u = l.dependencies;
                if (u !== null) {
                  s = l.child;
                  for (var d = u.firstContext; d !== null; ) {
                    if (d.context === r) {
                      if (l.tag === 1) {
                        ((d = Pt(-1, n & -n)), (d.tag = 2));
                        var y = l.updateQueue;
                        if (y !== null) {
                          y = y.shared;
                          var z = y.pending;
                          (z === null ? (d.next = d) : ((d.next = z.next), (z.next = d)), (y.pending = d));
                        }
                      }
                      ((l.lanes |= n), (d = l.alternate), d !== null && (d.lanes |= n), $l(l.return, n, t), (u.lanes |= n));
                      break;
                    }
                    d = d.next;
                  }
                } else if (l.tag === 10) s = l.type === t.type ? null : l.child;
                else if (l.tag === 18) {
                  if (((s = l.return), s === null)) throw Error(f(341));
                  ((s.lanes |= n), (u = s.alternate), u !== null && (u.lanes |= n), $l(s, n, t), (s = l.sibling));
                } else s = l.child;
                if (s !== null) s.return = l;
                else
                  for (s = l; s !== null; ) {
                    if (s === t) {
                      s = null;
                      break;
                    }
                    if (((l = s.sibling), l !== null)) {
                      ((l.return = s.return), (s = l));
                      break;
                    }
                    s = s.return;
                  }
                l = s;
              }
          (Qe(e, t, o.children, n), (t = t.child));
        }
        return t;
      case 9:
        return ((o = t.type), (r = t.pendingProps.children), Tn(t, n), (o = st(o)), (r = r(o)), (t.flags |= 1), Qe(e, t, r, n), t.child);
      case 14:
        return ((r = t.type), (o = mt(r, t.pendingProps)), (o = mt(r.type, o)), lu(e, t, r, o, n));
      case 15:
        return iu(e, t, t.type, t.pendingProps, n);
      case 17:
        return (
          (r = t.type),
          (o = t.pendingProps),
          (o = t.elementType === r ? o : mt(r, o)),
          vo(e, t),
          (t.tag = 1),
          Je(r) ? ((e = !0), qr(t)) : (e = !1),
          Tn(t, n),
          Xa(t, r, o),
          li(t, r, o, n),
          ui(null, t, r, !0, e, n)
        );
      case 19:
        return mu(e, t, n);
      case 22:
        return su(e, t, n);
    }
    throw Error(f(156, t.tag));
  };
  function Wu(e, t) {
    return ys(e, t);
  }
  function Zc(e, t, n, r) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = r),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function dt(e, t, n, r) {
    return new Zc(e, t, n, r);
  }
  function Pi(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function qc(e) {
    if (typeof e == "function") return Pi(e) ? 1 : 0;
    if (e != null) {
      if (((e = e.$$typeof), e === Ie)) return 11;
      if (e === we) return 14;
    }
    return 2;
  }
  function Kt(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = dt(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t), (n.type = e.type), (n.flags = 0), (n.subtreeFlags = 0), (n.deletions = null)),
      (n.flags = e.flags & 14680064),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      n
    );
  }
  function Po(e, t, n, r, o, l) {
    var s = 2;
    if (((r = e), typeof e == "function")) Pi(e) && (s = 1);
    else if (typeof e == "string") s = 5;
    else
      e: switch (e) {
        case Ce:
          return dn(n.children, o, l, t);
        case A:
          ((s = 8), (o |= 8));
          break;
        case de:
          return ((e = dt(12, n, t, o | 2)), (e.elementType = de), (e.lanes = l), e);
        case ze:
          return ((e = dt(13, n, t, o)), (e.elementType = ze), (e.lanes = l), e);
        case Ne:
          return ((e = dt(19, n, t, o)), (e.elementType = Ne), (e.lanes = l), e);
        case ce:
          return _o(n, o, l, t);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case He:
                s = 10;
                break e;
              case Re:
                s = 9;
                break e;
              case Ie:
                s = 11;
                break e;
              case we:
                s = 14;
                break e;
              case fe:
                ((s = 16), (r = null));
                break e;
            }
          throw Error(f(130, e == null ? e : typeof e, ""));
      }
    return ((t = dt(s, n, t, o)), (t.elementType = e), (t.type = r), (t.lanes = l), t);
  }
  function dn(e, t, n, r) {
    return ((e = dt(7, e, r, t)), (e.lanes = n), e);
  }
  function _o(e, t, n, r) {
    return ((e = dt(22, e, r, t)), (e.elementType = ce), (e.lanes = n), (e.stateNode = { isHidden: !1 }), e);
  }
  function _i(e, t, n) {
    return ((e = dt(6, e, null, t)), (e.lanes = n), e);
  }
  function Ti(e, t, n) {
    return (
      (t = dt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }),
      t
    );
  }
  function ef(e, t, n, r, o) {
    ((this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = ol(0)),
      (this.expirationTimes = ol(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = ol(0)),
      (this.identifierPrefix = r),
      (this.onRecoverableError = o),
      (this.mutableSourceEagerHydrationData = null));
  }
  function Li(e, t, n, r, o, l, s, u, d) {
    return (
      (e = new ef(e, t, n, u, d)),
      t === 1 ? ((t = 1), l === !0 && (t |= 8)) : (t = 0),
      (l = dt(3, null, null, t)),
      (e.current = l),
      (l.stateNode = e),
      (l.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }),
      Vl(l),
      e
    );
  }
  function tf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: me, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Fu(e) {
    if (!e) return Ht;
    e = e._reactInternals;
    e: {
      if (Xt(e) !== e || e.tag !== 1) throw Error(f(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Je(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(f(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Je(n)) return pa(e, n, t);
    }
    return t;
  }
  function Hu(e, t, n, r, o, l, s, u, d) {
    return (
      (e = Li(n, r, !0, e, o, l, s, u, d)),
      (e.context = Fu(null)),
      (n = e.current),
      (r = Ge()),
      (o = Gt(n)),
      (l = Pt(r, o)),
      (l.callback = t ?? null),
      $t(n, l, o),
      (e.current.lanes = o),
      Qn(e, o, r),
      qe(e, r),
      e
    );
  }
  function To(e, t, n, r) {
    var o = t.current,
      l = Ge(),
      s = Gt(o);
    return (
      (n = Fu(n)),
      t.context === null ? (t.context = n) : (t.pendingContext = n),
      (t = Pt(l, s)),
      (t.payload = { element: e }),
      (r = r === void 0 ? null : r),
      r !== null && (t.callback = r),
      (e = $t(o, t, s)),
      e !== null && (yt(e, o, s, l), so(e, o, s)),
      s
    );
  }
  function Lo(e) {
    if (((e = e.current), !e.child)) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Au(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Di(e, t) {
    (Au(e, t), (e = e.alternate) && Au(e, t));
  }
  function nf() {
    return null;
  }
  var Uu =
    typeof reportError == "function"
      ? reportError
      : function (e) {
          console.error(e);
        };
  function Mi(e) {
    this._internalRoot = e;
  }
  ((Do.prototype.render = Mi.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(f(409));
      To(e, t, null, null);
    }),
    (Do.prototype.unmount = Mi.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (sn(function () {
            To(null, e, null, null);
          }),
            (t[Nt] = null));
        }
      }));
  function Do(e) {
    this._internalRoot = e;
  }
  Do.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = bs();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ot.length && t !== 0 && t < Ot[n].priority; n++);
      (Ot.splice(n, 0, e), n === 0 && Es(e));
    }
  };
  function Oi(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function Mo(e) {
    return !(
      !e ||
      (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
    );
  }
  function $u() {}
  function rf(e, t, n, r, o) {
    if (o) {
      if (typeof r == "function") {
        var l = r;
        r = function () {
          var y = Lo(s);
          l.call(y);
        };
      }
      var s = Hu(t, r, e, 0, null, !1, !1, "", $u);
      return ((e._reactRootContainer = s), (e[Nt] = s.current), ir(e.nodeType === 8 ? e.parentNode : e), sn(), s);
    }
    for (; (o = e.lastChild); ) e.removeChild(o);
    if (typeof r == "function") {
      var u = r;
      r = function () {
        var y = Lo(d);
        u.call(y);
      };
    }
    var d = Li(e, 0, !1, null, null, !1, !1, "", $u);
    return (
      (e._reactRootContainer = d),
      (e[Nt] = d.current),
      ir(e.nodeType === 8 ? e.parentNode : e),
      sn(function () {
        To(t, d, n, r);
      }),
      d
    );
  }
  function Oo(e, t, n, r, o) {
    var l = n._reactRootContainer;
    if (l) {
      var s = l;
      if (typeof o == "function") {
        var u = o;
        o = function () {
          var d = Lo(s);
          u.call(d);
        };
      }
      To(t, s, e, o);
    } else s = rf(n, t, e, o, r);
    return Lo(s);
  }
  ((js = function (e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Vn(t.pendingLanes);
          n !== 0 && (ll(t, n | 1), qe(t, Ee()), (ie & 6) === 0 && ((Rn = Ee() + 500), At()));
        }
        break;
      case 13:
        (sn(function () {
          var r = Et(e, 1);
          if (r !== null) {
            var o = Ge();
            yt(r, e, 1, o);
          }
        }),
          Di(e, 1));
    }
  }),
    (il = function (e) {
      if (e.tag === 13) {
        var t = Et(e, 134217728);
        if (t !== null) {
          var n = Ge();
          yt(t, e, 134217728, n);
        }
        Di(e, 134217728);
      }
    }),
    (Ns = function (e) {
      if (e.tag === 13) {
        var t = Gt(e),
          n = Et(e, t);
        if (n !== null) {
          var r = Ge();
          yt(n, e, t, r);
        }
        Di(e, t);
      }
    }),
    (bs = function () {
      return pe;
    }),
    (Cs = function (e, t) {
      var n = pe;
      try {
        return ((pe = e), t());
      } finally {
        pe = n;
      }
    }),
    (Zo = function (e, t, n) {
      switch (t) {
        case "input":
          if ((Bo(e, n), (t = n.name), n.type === "radio" && t != null)) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
              var r = n[t];
              if (r !== e && r.form === e.form) {
                var o = Xr(r);
                if (!o) throw Error(f(90));
                (Ji(r), Bo(r, o));
              }
            }
          }
          break;
        case "textarea":
          ts(e, n);
          break;
        case "select":
          ((t = n.value), t != null && pn(e, !!n.multiple, t, !1));
      }
    }),
    (ds = Ci),
    (cs = sn));
  var of = { usingClientEntryPoint: !1, Events: [ur, jn, Xr, as, us, Ci] },
    jr = { findFiberByHostInstance: Zt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" },
    lf = {
      bundleType: jr.bundleType,
      version: jr.version,
      rendererPackageName: jr.rendererPackageName,
      rendererConfig: jr.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: ae.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return ((e = hs(e)), e === null ? null : e.stateNode);
      },
      findFiberByHostInstance: jr.findFiberByHostInstance || nf,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
    };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ro = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ro.isDisabled && Ro.supportsFiber)
      try {
        ((Lr = Ro.inject(lf)), (xt = Ro));
      } catch {}
  }
  return (
    (et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = of),
    (et.createPortal = function (e, t) {
      var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Oi(t)) throw Error(f(200));
      return tf(e, t, null, n);
    }),
    (et.createRoot = function (e, t) {
      if (!Oi(e)) throw Error(f(299));
      var n = !1,
        r = "",
        o = Uu;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
        (t = Li(e, 1, !1, null, null, n, !1, r, o)),
        (e[Nt] = t.current),
        ir(e.nodeType === 8 ? e.parentNode : e),
        new Mi(t)
      );
    }),
    (et.findDOMNode = function (e) {
      if (e == null) return null;
      if (e.nodeType === 1) return e;
      var t = e._reactInternals;
      if (t === void 0) throw typeof e.render == "function" ? Error(f(188)) : ((e = Object.keys(e).join(",")), Error(f(268, e)));
      return ((e = hs(t)), (e = e === null ? null : e.stateNode), e);
    }),
    (et.flushSync = function (e) {
      return sn(e);
    }),
    (et.hydrate = function (e, t, n) {
      if (!Mo(t)) throw Error(f(200));
      return Oo(null, e, t, !0, n);
    }),
    (et.hydrateRoot = function (e, t, n) {
      if (!Oi(e)) throw Error(f(405));
      var r = (n != null && n.hydratedSources) || null,
        o = !1,
        l = "",
        s = Uu;
      if (
        (n != null &&
          (n.unstable_strictMode === !0 && (o = !0),
          n.identifierPrefix !== void 0 && (l = n.identifierPrefix),
          n.onRecoverableError !== void 0 && (s = n.onRecoverableError)),
        (t = Hu(t, null, e, 1, n ?? null, o, !1, l, s)),
        (e[Nt] = t.current),
        ir(e),
        r)
      )
        for (e = 0; e < r.length; e++)
          ((n = r[e]),
            (o = n._getVersion),
            (o = o(n._source)),
            t.mutableSourceEagerHydrationData == null ? (t.mutableSourceEagerHydrationData = [n, o]) : t.mutableSourceEagerHydrationData.push(n, o));
      return new Do(t);
    }),
    (et.render = function (e, t, n) {
      if (!Mo(t)) throw Error(f(200));
      return Oo(null, e, t, !1, n);
    }),
    (et.unmountComponentAtNode = function (e) {
      if (!Mo(e)) throw Error(f(40));
      return e._reactRootContainer
        ? (sn(function () {
            Oo(null, null, e, !1, function () {
              ((e._reactRootContainer = null), (e[Nt] = null));
            });
          }),
          !0)
        : !1;
    }),
    (et.unstable_batchedUpdates = Ci),
    (et.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
      if (!Mo(n)) throw Error(f(200));
      if (e == null || e._reactInternals === void 0) throw Error(f(38));
      return Oo(e, t, n, !1, r);
    }),
    (et.version = "18.3.1-next-f1338f8080-20240426"),
    et
  );
}
var Xu;
function mf() {
  if (Xu) return Wi.exports;
  Xu = 1;
  function c() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(c);
      } catch (k) {
        console.error(k);
      }
  }
  return (c(), (Wi.exports = pf()), Wi.exports);
}
var Zu;
function hf() {
  if (Zu) return Io;
  Zu = 1;
  var c = mf();
  return ((Io.createRoot = c.createRoot), (Io.hydrateRoot = c.hydrateRoot), Io);
}
var gf = hf(),
  I = Gi();
function Ye(c, k) {
  const [f, W] = I.useState(() => {
    try {
      const w = localStorage.getItem(c);
      return w !== null ? JSON.parse(w) : k;
    } catch {
      return k;
    }
  });
  return [
    f,
    (w) => {
      W((C) => {
        const F = typeof w == "function" ? w(C) : w;
        try {
          localStorage.setItem(c, JSON.stringify(F));
        } catch {}
        return F;
      });
    },
  ];
}
const yf = {
    lang: "en",
    dateLocale: "en-GB",
    greeting: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
    nav: { overview: "Home", tasks: "Tasks", routines: "Routines", habits: "Habits", focus: "Focus", note: "Note", profile: "Profile" },
    auth: {
      signUp: "Sign up",
      logIn: "Log in",
      emailLabel: "Email address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm password",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "At least 6 characters",
      confirmPasswordPlaceholder: "Repeat your password",
      createAccount: "Create account",
      continueWithGoogle: "Continue with Google",
      continueWithApple: "Continue with Apple",
      continueAsGuest: "Continue as guest (no account)",
      socialComingSoon: "Social login coming soon — use email to get started.",
      passwordsNoMatch: "Passwords don't match.",
      emailRequired: "Please enter your email address.",
      passwordTooShort: "Password must be at least 6 characters.",
      emailInUse: "An account with this email already exists.",
      invalidCredentials: "Incorrect email or password.",
      localDataNote: "Your data is stored locally on this device. Nothing is sent to any server.",
    },
    account: {
      heading: "Account",
      guestHeading: "Guest account",
      guestNote: "You're using Steady as a guest. Create an account if you'd like your data to carry over between sessions.",
      createAccount: "Create an account",
      emailLabel: "Email",
      changeEmail: "Change email",
      newEmailLabel: "New email address",
      newEmailPlaceholder: "new@example.com",
      verifyPasswordLabel: "Current password (to confirm)",
      changePassword: "Change password",
      currentPasswordLabel: "Current password",
      newPasswordLabel: "New password",
      confirmNewPasswordLabel: "Confirm new password",
      save: "Save changes",
      saved: "Saved!",
      cancel: "Cancel",
      signOut: "Sign out",
      wrongPassword: "Current password is incorrect.",
      passwordTooShort: "New password must be at least 6 characters.",
      passwordsNoMatch: "Passwords don't match.",
      emailInUse: "This email is already in use.",
      emailRequired: "Please enter a new email address.",
    },
    settings: {
      title: "Settings",
      sections: { appearance: "Appearance", readability: "Readability", language: "Language", data: "Data & Privacy", account: "Account" },
      darkMode: { label: "Dark mode", description: "Switch to a dark colour theme" },
      fontSize: { label: "Text size", normal: "Normal", large: "Large", xlarge: "Extra large" },
      font: { label: "Font", standard: "Standard", readable: "Dyslexia-friendly (Atkinson)" },
      lineSpacing: { label: "Line spacing", normal: "Normal", spacious: "Spacious" },
      reduceMotion: { label: "Reduce motion", description: "Turn off animations across the app" },
      highContrast: { label: "High contrast", description: "Stronger text and border contrast" },
      resetOnboarding: "Restart onboarding",
      clearData: "Clear all my data",
      clearConfirm: "Are you sure? This will delete all tasks, notes, habits and mood history.",
      clearYes: "Yes, clear everything",
      clearNo: "Cancel",
      dataCleared: "All data cleared.",
      privacy:
        "Your data stays on this device only — nothing is sent to any server, and there is no tracking or advertising of any kind. Account creation is optional.",
      privacyLink: "Read full privacy policy",
      privacyPolicy: {
        title: "Privacy policy",
        lastUpdated: "Last updated: June 2026",
        sections: [
          {
            heading: "Who we are",
            body: "Steady is a calm daily companion app designed for neurodivergent people. It is built to work entirely on your device, with your privacy protected by default.",
          },
          {
            heading: "What data is stored",
            body: "Steady stores your profile (name, pronouns, avatar, preferences), tasks, habits, routines, daily mood check-ins, and notes. If you create an account, your email address and a secure hash of your password are also stored. None of this is linked to any external identity.",
          },
          {
            heading: "Where data is stored",
            body: "Everything is stored in your browser's local storage — on this device only. Nothing is ever sent to a server. Steady has no backend, no database, and no cloud storage.",
          },
          {
            heading: "Account creation",
            body: "Creating an account is completely optional. You can always use Steady as a guest. If you do create an account, it exists only in your browser. You cannot log in from another device.",
          },
          {
            heading: "Deleting your data",
            body: "You can delete all your data at any time from Settings → Data & Privacy → Clear all my data. You can also clear your browser's local storage directly. Either way, all data is permanently removed.",
          },
          {
            heading: "Tracking and analytics",
            body: "Steady does not use any analytics tools, advertising networks, cookies, or tracking of any kind. We do not know how you use the app, and we do not want to.",
          },
          {
            heading: "Data sharing",
            body: "Your data is never shared with anyone. There are no third-party services, no data processors, and no partners receiving any information about you.",
          },
          {
            heading: "Children",
            body: "Steady does not knowingly collect data from children. Because all data stays on-device and no accounts are required, the app is safe for users of all ages.",
          },
          {
            heading: "Changes to this policy",
            body: "If this policy ever changes in a meaningful way, the update date above will reflect that. We will always aim to keep Steady's privacy approach simple and honest.",
          },
          {
            heading: "Questions",
            body: "If you have any questions about how Steady handles your data, you are welcome to reach out. Contact details will be available once the Steady website launches.",
          },
        ],
      },
    },
    moodHistory: {
      heading: "Mood History",
      description: "Your check-ins over the last 7 days.",
      noData: "No check-ins yet. You can start from the Overview whenever you're ready.",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    strengths: {
      heading: "My Strengths",
      description: "Things that tend to come naturally to you.",
      options: [
        { key: "hyperfocus", label: "Hyperfocus", emoji: "🎯" },
        { key: "creative", label: "Creative thinking", emoji: "🎨" },
        { key: "patterns", label: "Pattern recognition", emoji: "🔍" },
        { key: "empathy", label: "Deep empathy", emoji: "💗" },
        { key: "detail", label: "Attention to detail", emoji: "🔬" },
        { key: "outofbox", label: "Out-of-the-box ideas", emoji: "💡" },
        { key: "passionate", label: "Passionate interests", emoji: "⭐" },
        { key: "honest", label: "Honest & direct", emoji: "💬" },
        { key: "solver", label: "Creative problem solver", emoji: "🧩" },
        { key: "intuition", label: "Strong intuition", emoji: "🌊" },
      ],
    },
    noteHistory: { heading: "Previous Notes", empty: "No previous notes yet.", today: "Today", deleteEntry: "Delete this entry" },
    onboarding: {
      welcome: {
        title: "Welcome to Steady",
        subtitle: "Your calm daily companion for neurodivergent minds.",
        start: "Get started",
        returning: "I've been here before",
      },
      name: {
        title: "What should we call you?",
        subtitle: "A name or nickname — whatever feels right.",
        namePlaceholder: "Your name…",
        pronounPlaceholder: "Pronouns (optional)",
      },
      avatar: { title: "Pick your avatar", subtitle: "Choose one that feels like you." },
      language: { title: "Choose your language", subtitle: "You can change this anytime in your profile." },
      sensory: {
        title: "What's sometimes tricky for you?",
        subtitle: "Select anything that feels true — or skip. This is just for you.",
        skip: "Skip this step",
      },
      support: { title: "What helps you most?", subtitle: "These will shape your daily tips in the app.", skip: "Skip this step" },
      setup: {
        title: "How should the app look?",
        subtitle: "You can change all of this later in your profile.",
        textSize: "Text size",
        darkMode: "Dark mode",
        font: "Dyslexia-friendly font",
      },
      done: {
        title: "You're all set!",
        subtitle: "Steady is ready. Let's take today one step at a time.",
        enter: "Start my day",
        guestNote: "You're using Steady as a guest. To save your data, create an account any time in Settings.",
      },
      next: "Next",
      back: "Back",
      stepOf: (c, k) => `${c} of ${k}`,
    },
    overview: {
      tasksLeft: "Tasks left",
      habitsDone: "Habits done",
      streakDays: "Streak days",
      reminderTitle: "💡 Reminder",
      reminderText: "You don't have to do everything perfectly. Just do the next small step. That's enough.",
      tipForYou: "✨ A tip for you",
    },
    supportTips: {
      "Gentle reminders": "A gentle nudge: take a moment to check your routine list.",
      Checklists: "Try breaking your biggest task today into 3 small checkable steps.",
      "Quiet focus time": "When you want some quiet, try silencing notifications and using the focus timer.",
      "Written instructions": "Writing down what you need to do today can make it feel more manageable.",
      "Extra time to process": "It's okay to take your time. You don't need to rush.",
      "Visual cues": "Your colour-coded routines are ready when you need a visual guide.",
      default: "You're doing well. Take it one small step at a time.",
    },
    sensoryTips: {
      "Noise-sensitive": "🎧 If it's noisy, try headphones or earplugs to protect your focus.",
      "Light-sensitive": "🌙 Dark mode is on. You can also lower your screen brightness.",
      "Need lots of movement": "🚶 Short movement breaks can help — take one whenever you feel like it.",
      "Need stillness": "🧘 Find a calm spot when you can — stillness can make it easier to settle in.",
      "Texture-sensitive": "🤲 Wear comfortable clothing today — comfort supports focus.",
      "Smell-sensitive": "🪟 Opening a window for fresh air can help clear your head.",
    },
    mood: {
      heading: "How are you feeling right now?",
      description: "Just pick the one that feels closest — no wrong answer.",
      result: (c, k) => `Got it — you're feeling ${c.toLowerCase()} ${k}. That's okay.`,
      options: [
        { key: "Tired", label: "Tired", emoji: "😴" },
        { key: "Stressed", label: "Stressed", emoji: "😟" },
        { key: "Okay", label: "Okay", emoji: "😐" },
        { key: "Good", label: "Good", emoji: "🙂" },
        { key: "Great", label: "Great", emoji: "😄" },
      ],
    },
    tasks: {
      heading: "Today's Tasks",
      description: "Check things off as you go. One step at a time is enough.",
      left: "left",
      placeholder: "Add a new task...",
      add: "Add",
      markComplete: "Mark complete",
      markIncomplete: "Mark incomplete",
      remove: "Remove task",
      emptyTitle: "No tasks yet",
      emptySubtitle: "Add something small to start — even one thing is enough.",
    },
    routines: {
      heading: "Daily Routines",
      description: "Your day broken into easy steps. Tap a section to open it.",
      addStepPlaceholder: "Add a step…",
      addStepButton: "Add",
      deleteStep: "Delete step",
      noSteps: "No steps yet — tap below to add your first one.",
      sections: {
        morning: { label: "Morning", time: "7:00 – 9:00 AM" },
        afternoon: { label: "Afternoon", time: "12:00 – 2:00 PM" },
        evening: { label: "Evening", time: "8:00 – 10:00 PM" },
      },
      items: {
        1: "Wake up",
        2: "Drink some water",
        3: "Take morning medication and vitamins",
        4: "Eat breakfast",
        5: "Get ready for the day",
        6: "Eat lunch",
        7: "Take afternoon medication",
        8: "Do homework",
        9: "Prepare clothes for tomorrow",
        10: "Wind-down activity (reading/music)",
        11: "Check to-do list",
        12: "Lights out",
      },
    },
    habits: {
      heading: "Habit Tracker",
      description: "Tap to mark a habit done for today. One is enough.",
      addHabit: "Add a habit",
      namePlaceholder: "Habit name…",
      deleteHabit: "Delete habit",
      noHabits: "No habits yet. Add one below.",
      emptyTitle: "No habits yet",
      emptySubtitle: "Start with something simple — one small habit makes a difference.",
      cancel: "Cancel",
      items: [
        { key: "water", name: "Drink 8 glasses of water", emoji: "💧" },
        { key: "move", name: "Move my body", emoji: "🚶" },
        { key: "screens", name: "No screens 1 hr before bed", emoji: "📵" },
        { key: "journal", name: "Journal or gratitude note", emoji: "📝" },
      ],
    },
    focus: {
      heading: "Focus Timer",
      description: "Choose a duration and focus on one thing at a time.",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      done: "Done. Time for a short break.",
    },
    note: {
      heading: "Daily Note",
      description: "No pressure — just a space to write down anything on your mind.",
      prompts: [
        "What's one thing you're looking forward to today?",
        "What's something small you're proud of recently?",
        "What do you need most right now?",
        "What's one thing you want to let go of today?",
        "How can you be kind to yourself today?",
      ],
      placeholder: "Write anything here...",
      characters: "characters",
      save: "Save",
      saved: "Saved ✓",
    },
    profile: {
      heading: "About Me",
      description: "This is just for you — it helps Steady feel personal.",
      pickAvatar: "Pick your avatar",
      emojiAvatar: "Emoji avatar",
      shownWhenNoPhoto: "shown when no photo",
      addPhoto: "Add photo",
      changePhoto: "Change",
      removePhoto: "Remove photo",
      optionalPhoto: "Optional photo",
      photoSet: "Photo set",
      namePlaceholder: "Your name or nickname",
      pronounsLabel: "Pronouns (optional)",
      pronounsOptions: ["he/him", "she/her", "they/them", "he/they", "she/they", "any/all"],
      aboutLabel: "A note to yourself (optional)",
      sensory: {
        heading: "My Sensory Profile",
        description: "Select what applies to you. This helps you understand yourself better.",
        options: [
          { key: "Noise-sensitive", label: "Noise-sensitive", emoji: "🔇" },
          { key: "Light-sensitive", label: "Light-sensitive", emoji: "💡" },
          { key: "Need lots of movement", label: "Need lots of movement", emoji: "🚶" },
          { key: "Need stillness", label: "Need stillness", emoji: "🧘" },
          { key: "Texture-sensitive", label: "Texture-sensitive", emoji: "🤲" },
          { key: "Smell-sensitive", label: "Smell-sensitive", emoji: "👃" },
        ],
      },
      support: {
        heading: "What Helps Me",
        description: "Good to know what works for you. Select all that apply.",
        options: [
          { key: "Gentle reminders", label: "Gentle reminders", emoji: "🔔" },
          { key: "Checklists", label: "Checklists", emoji: "✅" },
          { key: "Quiet focus time", label: "Quiet focus time", emoji: "🤫" },
          { key: "Written instructions", label: "Written instructions", emoji: "📋" },
          { key: "Extra time to process", label: "Extra time to process", emoji: "⏳" },
          { key: "Visual cues", label: "Visual cues", emoji: "👁️" },
        ],
      },
      save: "Save my profile",
      saved: "✓ Profile saved!",
    },
    a11y: {
      heading: "Accessibility",
      description: "Make Steady work the way that's easiest for you.",
      fontSize: {
        label: "Text size",
        normal: "Normal",
        normalHint: "Default",
        large: "Large",
        largeHint: "A bit bigger",
        xlarge: "Extra large",
        xlargeHint: "Biggest",
      },
      font: {
        label: "Font style",
        standard: "Standard",
        standardHint: "Nunito — rounded & friendly",
        readable: "Dyslexia-friendly",
        readableHint: "Atkinson Hyperlegible",
      },
      lineSpacing: { label: "Line spacing", normal: "Normal", spacious: "Spacious", spaciousHint: "More breathing room" },
      reduceMotion: { label: "Reduce motion", description: "Turns off animations and transitions across the app" },
      highContrast: { label: "High contrast", description: "Darker text and stronger borders for easier reading" },
      darkMode: { label: "Dark mode", description: "Switches the app to a dark colour theme" },
      language: { label: "Language", en: "English", da: "Dansk" },
      instantNote: "💡 These settings will be applied automatically — no need to save.",
    },
  },
  vf = {
    lang: "da",
    dateLocale: "da-DK",
    greeting: { morning: "God morgen", afternoon: "God eftermiddag", evening: "God aften" },
    nav: { overview: "Hjem", tasks: "Opgaver", routines: "Rutiner", habits: "Vaner", focus: "Fokus", note: "Note", profile: "Profil" },
    auth: {
      signUp: "Opret konto",
      logIn: "Log ind",
      emailLabel: "E-mailadresse",
      passwordLabel: "Adgangskode",
      confirmPasswordLabel: "Bekræft adgangskode",
      emailPlaceholder: "dig@eksempel.dk",
      passwordPlaceholder: "Mindst 6 tegn",
      confirmPasswordPlaceholder: "Gentag din adgangskode",
      createAccount: "Opret konto",
      continueWithGoogle: "Fortsæt med Google",
      continueWithApple: "Fortsæt med Apple",
      continueAsGuest: "Fortsæt som gæst (uden konto)",
      socialComingSoon: "Social login kommer snart — brug e-mail i mellemtiden.",
      passwordsNoMatch: "Adgangskoderne stemmer ikke overens.",
      emailRequired: "Indtast venligst din e-mailadresse.",
      passwordTooShort: "Adgangskoden skal være mindst 6 tegn.",
      emailInUse: "Der findes allerede en konto med denne e-mail.",
      invalidCredentials: "Forkert e-mail eller adgangskode.",
      localDataNote: "Dine data gemmes lokalt på denne enhed. Intet sendes til nogen server.",
    },
    account: {
      heading: "Konto",
      guestHeading: "Gæstekonto",
      guestNote: "Du bruger Steady som gæst. Opret en konto, hvis du gerne vil beholde dine data mellem sessioner.",
      createAccount: "Opret en konto",
      emailLabel: "E-mail",
      changeEmail: "Skift e-mail",
      newEmailLabel: "Ny e-mailadresse",
      newEmailPlaceholder: "ny@eksempel.dk",
      verifyPasswordLabel: "Nuværende adgangskode (til bekræftelse)",
      changePassword: "Skift adgangskode",
      currentPasswordLabel: "Nuværende adgangskode",
      newPasswordLabel: "Ny adgangskode",
      confirmNewPasswordLabel: "Bekræft ny adgangskode",
      save: "Gem ændringer",
      saved: "Gemt!",
      cancel: "Annuller",
      signOut: "Log ud",
      wrongPassword: "Den nuværende adgangskode er forkert.",
      passwordTooShort: "Ny adgangskode skal være mindst 6 tegn.",
      passwordsNoMatch: "Adgangskoderne stemmer ikke overens.",
      emailInUse: "Denne e-mail er allerede i brug.",
      emailRequired: "Indtast venligst en ny e-mailadresse.",
    },
    settings: {
      title: "Indstillinger",
      sections: { appearance: "Udseende", readability: "Læsbarhed", language: "Sprog", data: "Data og privatliv", account: "Konto" },
      darkMode: { label: "Mørk tilstand", description: "Skift til et mørkt farvetema" },
      fontSize: { label: "Tekststørrelse", normal: "Normal", large: "Stor", xlarge: "Ekstra stor" },
      font: { label: "Skrifttype", standard: "Standard", readable: "Dysleksivenlig (Atkinson)" },
      lineSpacing: { label: "Linjeafstand", normal: "Normal", spacious: "Rumlig" },
      reduceMotion: { label: "Reducér bevægelse", description: "Sluk for animationer i appen" },
      highContrast: { label: "Høj kontrast", description: "Stærkere tekst- og kantkontrast" },
      resetOnboarding: "Genstart opsætning",
      clearData: "Ryd alle mine data",
      clearConfirm: "Er du sikker? Dette sletter alle opgaver, noter, vaner og stemningshistorik.",
      clearYes: "Ja, ryd alt",
      clearNo: "Annuller",
      dataCleared: "Alle data er ryddet.",
      privacy:
        "Dine data forbliver kun på denne enhed — intet sendes til nogen server, og der er ingen sporing eller reklamer af nogen art. Kontooprettelse er valgfrit.",
      privacyLink: "Læs fuld privatlivspolitik",
      privacyPolicy: {
        title: "Privatlivspolitik",
        lastUpdated: "Sidst opdateret: juni 2026",
        sections: [
          {
            heading: "Hvem er vi",
            body: "Steady er en rolig daglig følgesvend-app designet til neurodivergente mennesker. Den er bygget til at fungere helt på din enhed, med dit privatliv beskyttet som standard.",
          },
          {
            heading: "Hvilke data gemmes",
            body: "Steady gemmer din profil (navn, pronomen, avatar, præferencer), opgaver, vaner, rutiner, daglige humørtjek og noter. Hvis du opretter en konto, gemmes din e-mailadresse og en sikker hashværdi af dit adgangskode også. Intet af dette er knyttet til en ekstern identitet.",
          },
          {
            heading: "Hvor data gemmes",
            body: "Alt gemmes i din browsers lokale lager — kun på denne enhed. Intet sendes nogensinde til en server. Steady har ingen backend, ingen database og ingen cloud-lagring.",
          },
          {
            heading: "Oprettelse af konto",
            body: "At oprette en konto er fuldstændig valgfrit. Du kan altid bruge Steady som gæst. Hvis du opretter en konto, findes den kun i din browser. Du kan ikke logge ind fra en anden enhed.",
          },
          {
            heading: "Sletning af dine data",
            body: "Du kan slette alle dine data til enhver tid fra Indstillinger → Data og privatliv → Ryd alle mine data. Du kan også rydde din browsers lokale lager direkte. Uanset hvad fjernes alle data permanent.",
          },
          {
            heading: "Sporing og analyser",
            body: "Steady bruger ingen analyseværktøjer, reklamenetværk, cookies eller sporing af nogen art. Vi ved ikke, hvordan du bruger appen, og det ønsker vi heller ikke at vide.",
          },
          {
            heading: "Deling af data",
            body: "Dine data deles aldrig med nogen. Der er ingen tredjepartstjenester, ingen databehandlere og ingen partnere, der modtager oplysninger om dig.",
          },
          {
            heading: "Børn",
            body: "Steady indsamler ikke bevidst data fra børn. Da alle data forbliver på enheden og ingen konti er påkrævet, er appen sikker for brugere i alle aldre.",
          },
          {
            heading: "Ændringer af denne politik",
            body: "Hvis denne politik nogensinde ændres på en meningsfuld måde, vil opdateringsdatoen ovenfor afspejle det. Vi vil altid bestræbe os på at holde Steadys privatlivstilgang enkel og ærlig.",
          },
          {
            heading: "Spørgsmål",
            body: "Hvis du har spørgsmål om, hvordan Steady håndterer dine data, er du velkommen til at kontakte os. Kontaktoplysninger vil være tilgængelige, når Steadys hjemmeside lanceres.",
          },
        ],
      },
    },
    moodHistory: {
      heading: "Stemningshistorik",
      description: "Dine tjek-ind de seneste 7 dage.",
      noData: "Ingen tjek-ind endnu. Du kan starte fra Hjem, når du er klar.",
      days: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
    },
    strengths: {
      heading: "Mine styrker",
      description: "Ting der ofte falder dig naturligt.",
      options: [
        { key: "hyperfocus", label: "Hyperfokus", emoji: "🎯" },
        { key: "creative", label: "Kreativ tænkning", emoji: "🎨" },
        { key: "patterns", label: "Mønstergenkendelse", emoji: "🔍" },
        { key: "empathy", label: "Dyb empati", emoji: "💗" },
        { key: "detail", label: "Øje for detaljer", emoji: "🔬" },
        { key: "outofbox", label: "Originale idéer", emoji: "💡" },
        { key: "passionate", label: "Lidenskabelige interesser", emoji: "⭐" },
        { key: "honest", label: "Ærlig og direkte", emoji: "💬" },
        { key: "solver", label: "Kreativ problemløser", emoji: "🧩" },
        { key: "intuition", label: "Stærk intuition", emoji: "🌊" },
      ],
    },
    noteHistory: { heading: "Tidligere noter", empty: "Ingen tidligere noter endnu.", today: "I dag", deleteEntry: "Slet denne note" },
    onboarding: {
      welcome: {
        title: "Velkommen til Steady",
        subtitle: "Din rolige daglige følgesvend for neurodivergente sind.",
        start: "Kom i gang",
        returning: "Jeg har været her før",
      },
      name: {
        title: "Hvad skal vi kalde dig?",
        subtitle: "Et navn eller kaldenavn — hvad der føles rigtigt.",
        namePlaceholder: "Dit navn…",
        pronounPlaceholder: "Pronomener (valgfrit)",
      },
      avatar: { title: "Vælg din avatar", subtitle: "Vælg én der føles som dig." },
      language: { title: "Vælg dit sprog", subtitle: "Du kan ændre dette når som helst i din profil." },
      sensory: {
        title: "Hvad kan nogle gange være svært?",
        subtitle: "Vælg hvad der føles sandt — eller spring over. Det er kun for dig.",
        skip: "Spring dette trin over",
      },
      support: { title: "Hvad hjælper dig mest?", subtitle: "Disse former dine daglige tips i appen.", skip: "Spring dette trin over" },
      setup: {
        title: "Hvordan skal appen se ud?",
        subtitle: "Du kan ændre alt dette senere i din profil.",
        textSize: "Tekststørrelse",
        darkMode: "Mørk tilstand",
        font: "Dysleksivenlig skrift",
      },
      done: {
        title: "Du er klar!",
        subtitle: "Steady er klar. Lad os tage dagen ét lille skridt ad gangen.",
        enter: "Start min dag",
        guestNote: "Du bruger Steady som gæst. For at gemme dine data, opret en konto når som helst i Indstillinger.",
      },
      next: "Næste",
      back: "Tilbage",
      stepOf: (c, k) => `${c} af ${k}`,
    },
    overview: {
      tasksLeft: "Opgaver tilbage",
      habitsDone: "Vaner klaret",
      streakDays: "Dages streak",
      reminderTitle: "💡 Påmindelse",
      reminderText: "Du behøver ikke gøre alt perfekt. Tag bare det næste lille skridt. Det er nok.",
      tipForYou: "✨ Et tip til dig",
    },
    supportTips: {
      "Gentle reminders": "En blid påmindelse: tag et øjeblik til at tjekke din rutinoversigt.",
      Checklists: "Prøv at dele din største opgave i dag op i 3 små trin.",
      "Quiet focus time": "Når du vil have lidt ro, kan du slå notifikationer fra og prøve fokus-timeren.",
      "Written instructions": "At skrive ned, hvad du skal i dag, kan gøre det nemmere at overskue.",
      "Extra time to process": "Det er okay at tage din tid. Du behøver ikke skynde dig.",
      "Visual cues": "Dine farvekodede rutiner er klar, når du har brug for et visuelt overblik.",
      default: "Du klarer dig godt. Tag det ét lille skridt ad gangen.",
    },
    sensoryTips: {
      "Noise-sensitive": "🎧 Hvis det er støjende, prøv høretelefoner eller ørepropper.",
      "Light-sensitive": "🌙 Mørk tilstand er slået til. Du kan også sænke skærmens lysstyrke.",
      "Need lots of movement": "🚶 Korte bevægelsespauser kan hjælpe — tag en, når du har lyst.",
      "Need stillness": "🧘 Find et roligt sted, når du kan — ro kan gøre det lettere at falde til ro.",
      "Texture-sensitive": "🤲 Bær behageligt tøj i dag — komfort støtter fokus.",
      "Smell-sensitive": "🪟 At åbne et vindue for frisk luft kan hjælpe med at rydde hovedet.",
    },
    mood: {
      heading: "Hvordan har du det lige nu?",
      description: "Vælg bare den, der føles tættest på — der er intet forkert svar.",
      result: (c, k) => `Forstået — du har det ${c.toLowerCase()} ${k}. Det er okay.`,
      options: [
        { key: "Tired", label: "Træt", emoji: "😴" },
        { key: "Stressed", label: "Stresset", emoji: "😟" },
        { key: "Okay", label: "Okay", emoji: "😐" },
        { key: "Good", label: "Godt", emoji: "🙂" },
        { key: "Great", label: "Fantastisk", emoji: "😄" },
      ],
    },
    tasks: {
      heading: "Dagens opgaver",
      description: "Sæt kryds efterhånden. Ét skridt ad gangen er nok.",
      left: "tilbage",
      placeholder: "Tilføj en ny opgave...",
      add: "Tilføj",
      markComplete: "Markér som færdig",
      markIncomplete: "Markér som ufærdig",
      remove: "Fjern opgave",
      emptyTitle: "Ingen opgaver endnu",
      emptySubtitle: "Tilføj noget lille for at starte — selv én ting er nok.",
    },
    routines: {
      heading: "Daglige rutiner",
      description: "Din dag opdelt i nemme trin. Tryk på en sektion for at åbne den.",
      addStepPlaceholder: "Tilføj et trin…",
      addStepButton: "Tilføj",
      deleteStep: "Slet trin",
      noSteps: "Ingen trin endnu — tryk nedenfor for at tilføje det første.",
      sections: {
        morning: { label: "Morgen", time: "7:00 – 9:00" },
        afternoon: { label: "Eftermiddag", time: "12:00 – 14:00" },
        evening: { label: "Aften", time: "20:00 – 22:00" },
      },
      items: {
        1: "Vågn op",
        2: "Drik noget vand",
        3: "Tag morgen-medicin og vitaminer",
        4: "Spis morgenmad",
        5: "Gør dig klar til dagen",
        6: "Spis frokost",
        7: "Tag eftermiddags-medicin",
        8: "Lav lektier",
        9: "Læg tøj frem til i morgen",
        10: "Afslappende aktivitet (læsning/musik)",
        11: "Tjek opgavelisten",
        12: "Sluk lyset",
      },
    },
    habits: {
      heading: "Vane-tracker",
      description: "Tryk for at markere en vane som gjort i dag. Én er nok.",
      addHabit: "Tilføj en vane",
      namePlaceholder: "Vanenavn…",
      deleteHabit: "Slet vane",
      noHabits: "Ingen vaner endnu. Tilføj en nedenfor.",
      emptyTitle: "Ingen vaner endnu",
      emptySubtitle: "Start med noget enkelt — én lille vane gør en forskel.",
      cancel: "Annuller",
      items: [
        { key: "water", name: "Drik 8 glas vand", emoji: "💧" },
        { key: "move", name: "Bevæg kroppen", emoji: "🚶" },
        { key: "screens", name: "Ingen skærm 1 time før sengetid", emoji: "📵" },
        { key: "journal", name: "Dagbog eller taknemlighedsnote", emoji: "📝" },
      ],
    },
    focus: {
      heading: "Fokus-timer",
      description: "Vælg en varighed og fokusér på én ting ad gangen.",
      start: "Start",
      pause: "Pause",
      reset: "Nulstil",
      done: "Færdig. Tid til en kort pause.",
    },
    note: {
      heading: "Daglig note",
      description: "Intet pres — bare et sted at skrive alt, hvad du har på hjertet.",
      prompts: [
        "Hvad er ét ting, du glæder dig til i dag?",
        "Hvad er noget lille, du er stolt af for nylig?",
        "Hvad har du mest brug for lige nu?",
        "Hvad er ét ting, du gerne vil slippe i dag?",
        "Hvordan kan du være venlig over for dig selv i dag?",
      ],
      placeholder: "Skriv hvad som helst her...",
      characters: "tegn",
      save: "Gem",
      saved: "Gemt ✓",
    },
    profile: {
      heading: "Om mig",
      description: "Dette er bare for dig — det hjælper Steady med at føles personlig.",
      pickAvatar: "Vælg din avatar",
      emojiAvatar: "Emoji-avatar",
      shownWhenNoPhoto: "vises når der ikke er foto",
      addPhoto: "Tilføj foto",
      changePhoto: "Skift",
      removePhoto: "Fjern foto",
      optionalPhoto: "Valgfrit foto",
      photoSet: "Foto valgt",
      namePlaceholder: "Dit navn eller kaldenavn",
      pronounsLabel: "Pronomener (valgfrit)",
      pronounsOptions: ["han/ham", "hun/hende", "de/dem", "han/de", "hun/de", "alle"],
      aboutLabel: "En note til dig selv (valgfrit)",
      sensory: {
        heading: "Mit sensoriske profil",
        description: "Vælg det, der gælder for dig. Det hjælper dig med at forstå dig selv bedre.",
        options: [
          { key: "Noise-sensitive", label: "Lydfølsom", emoji: "🔇" },
          { key: "Light-sensitive", label: "Lysfølsom", emoji: "💡" },
          { key: "Need lots of movement", label: "Har brug for bevægelse", emoji: "🚶" },
          { key: "Need stillness", label: "Har brug for ro", emoji: "🧘" },
          { key: "Texture-sensitive", label: "Teksturfølsom", emoji: "🤲" },
          { key: "Smell-sensitive", label: "Lugtefølsom", emoji: "👃" },
        ],
      },
      support: {
        heading: "Hvad hjælper mig",
        description: "Godt at vide hvad der virker for dig. Vælg alt der gælder.",
        options: [
          { key: "Gentle reminders", label: "Rolige påmindelser", emoji: "🔔" },
          { key: "Checklists", label: "Tjeklister", emoji: "✅" },
          { key: "Quiet focus time", label: "Stille fokustid", emoji: "🤫" },
          { key: "Written instructions", label: "Skriftlige instruktioner", emoji: "📋" },
          { key: "Extra time to process", label: "Ekstra tid til bearbejdning", emoji: "⏳" },
          { key: "Visual cues", label: "Visuelle signaler", emoji: "👁️" },
        ],
      },
      save: "Gem min profil",
      saved: "✓ Profil gemt!",
    },
    a11y: {
      heading: "Tilgængelighed",
      description: "Gør Steady til at fungere på den måde, der er nemmest for dig.",
      fontSize: {
        label: "Tekststørrelse",
        normal: "Normal",
        normalHint: "Standard",
        large: "Stor",
        largeHint: "Lidt større",
        xlarge: "Ekstra stor",
        xlargeHint: "Størst",
      },
      font: {
        label: "Skriftstil",
        standard: "Standard",
        standardHint: "Nunito — rundet & læsevenlig",
        readable: "Dysleksivenlig",
        readableHint: "Atkinson Hyperlegible",
      },
      lineSpacing: { label: "Linjeafstand", normal: "Normal", spacious: "Rumlig", spaciousHint: "Mere luft" },
      reduceMotion: { label: "Reducér bevægelse", description: "Slukker for animationer og overgange i hele appen" },
      highContrast: { label: "Høj kontrast", description: "Mørkere tekst og stærkere kanter for nemmere læsning" },
      darkMode: { label: "Mørk tilstand", description: "Skifter appen til et mørkt farvetema" },
      language: { label: "Sprog", en: "English", da: "Dansk" },
      instantNote: "💡 Disse indstillinger træder i kraft automatisk — du behøver ikke gemme.",
    },
  },
  Uo = { en: yf, da: vf },
  Vi = I.createContext(Uo.en);
function vt() {
  return I.useContext(Vi);
}
function xf() {
  return new Date().toISOString().slice(0, 10);
}
const kf = ["var(--mood-color-0)", "var(--mood-color-1)", "var(--mood-color-2)", "var(--mood-color-3)", "var(--mood-color-4)"];
function wf() {
  const c = vt(),
    [k, f] = Ye("steady-mood-history", []),
    W = c.mood.options,
    v = xf(),
    w = k.find((D) => D.date === v),
    C = (w == null ? void 0 : w.moodIndex) ?? null,
    F = (D) => {
      f((N) => [...N.filter((E) => E.date !== v), { date: v, moodIndex: D }]);
    };
  return i.jsxs("div", {
    className: "steady-card bg-card rounded-2xl p-5 border border-border",
    children: [
      i.jsx("h3", { className: "mb-1 text-foreground", children: c.mood.heading }),
      i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: c.mood.description }),
      i.jsx("div", {
        style: { display: "flex", gap: "6px" },
        children: W.map((D, N) =>
          i.jsxs(
            "button",
            {
              onClick: () => F(N),
              className: "flex flex-col items-center gap-1 rounded-xl border-2 cursor-pointer hover:opacity-85",
              style: {
                flex: 1,
                minWidth: 0,
                padding: "8px 2px",
                borderColor: C === N ? "var(--primary)" : "transparent",
                backgroundColor: C === N ? kf[N] : "var(--surface-1)",
                transform: C === N ? "scale(1.06)" : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              },
              "aria-label": D.label,
              "aria-pressed": C === N,
              children: [
                i.jsx("span", { "aria-hidden": "true", style: { fontSize: "1.4rem" }, children: D.emoji }),
                i.jsx("span", {
                  className: "mood-label text-foreground",
                  style: { fontSize: "11px", fontWeight: 600, lineHeight: 1.2, overflow: "hidden", maxWidth: "100%" },
                  children: D.label,
                }),
              ],
            },
            D.key,
          ),
        ),
      }),
      C !== null &&
        i.jsx("p", { className: "mt-4", style: { fontWeight: 600, color: "var(--primary)" }, children: c.mood.result(W[C].label, W[C].emoji) }),
    ],
  });
}
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Sf = (c) => c.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  jf = (c) => c.replace(/^([A-Z])|[\s-_]+(\w)/g, (k, f, W) => (W ? W.toUpperCase() : f.toLowerCase())),
  qu = (c) => {
    const k = jf(c);
    return k.charAt(0).toUpperCase() + k.slice(1);
  },
  ld = (...c) =>
    c
      .filter((k, f, W) => !!k && k.trim() !== "" && W.indexOf(k) === f)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Nf = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const bf = I.forwardRef(
  ({ color: c = "currentColor", size: k = 24, strokeWidth: f = 2, absoluteStrokeWidth: W, className: v = "", children: w, iconNode: C, ...F }, D) =>
    I.createElement(
      "svg",
      { ref: D, ...Nf, width: k, height: k, stroke: c, strokeWidth: W ? (Number(f) * 24) / Number(k) : f, className: ld("lucide", v), ...F },
      [...C.map(([N, R]) => I.createElement(N, R)), ...(Array.isArray(w) ? w : [w])],
    ),
);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const he = (c, k) => {
  const f = I.forwardRef(({ className: W, ...v }, w) =>
    I.createElement(bf, { ref: w, iconNode: k, className: ld(`lucide-${Sf(qu(c))}`, `lucide-${c}`, W), ...v }),
  );
  return ((f.displayName = qu(c)), f);
};
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cf = [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }],
  ],
  zf = he("arrow-left", Cf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ef = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
  ],
  Pf = he("arrow-right", Ef);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _f = [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
    ["path", { d: "M3 10h18", key: "8toen8" }],
    ["path", { d: "M8 14h.01", key: "6423bh" }],
    ["path", { d: "M12 14h.01", key: "1etili" }],
    ["path", { d: "M16 14h.01", key: "1gbofw" }],
    ["path", { d: "M8 18h.01", key: "lrp35t" }],
    ["path", { d: "M12 18h.01", key: "mhygvu" }],
    ["path", { d: "M16 18h.01", key: "kzsmim" }],
  ],
  Tf = he("calendar-days", _f);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Lf = [
    ["path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z", key: "1tc9qg" }],
    ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
  ],
  Df = he("camera", Lf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Mf = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
  Wo = he("check", Mf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Of = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  Fo = he("chevron-down", Of);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Rf = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]],
  Ho = he("chevron-up", Rf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const If = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
  Qi = he("circle-check", If);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wf = [
    ["path", { d: "M18 20a6 6 0 0 0-12 0", key: "1qehca" }],
    ["circle", { cx: "12", cy: "10", r: "4", key: "1h16sb" }],
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ],
  Ff = he("circle-user-round", Wf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Hf = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", key: "116196" }],
    ["path", { d: "M12 11h4", key: "1jrz19" }],
    ["path", { d: "M12 16h4", key: "n85exb" }],
    ["path", { d: "M8 11h.01", key: "1dfujw" }],
    ["path", { d: "M8 16h.01", key: "18s6g9" }],
  ],
  Af = he("clipboard-list", Hf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Uf = [
    ["path", { d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49", key: "ct8e1f" }],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    ["path", { d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143", key: "13bj9a" }],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ],
  id = he("eye-off", Uf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $f = [
    ["path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0", key: "1nclc0" }],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  sd = he("eye", $f);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Bf = [
    [
      "path",
      {
        d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
        key: "96xj49",
      },
    ],
  ],
  ad = he("flame", Bf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Vf = [
    ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
    ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
    ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
    ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }],
  ],
  Qf = he("layout-dashboard", Vf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Gf = [["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]],
  Yf = he("moon", Gf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Kf = [
    ["path", { d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4", key: "re6nr2" }],
    ["path", { d: "M2 6h4", key: "aawbzj" }],
    ["path", { d: "M2 10h4", key: "l0bgd4" }],
    ["path", { d: "M2 14h4", key: "1gsvsf" }],
    ["path", { d: "M2 18h4", key: "1bu2t1" }],
    [
      "path",
      {
        d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        key: "pqwjuv",
      },
    ],
  ],
  Jf = he("notebook-pen", Kf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Xf = [
    ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
    ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }],
  ],
  Zf = he("pause", Xf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qf = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]],
  ep = he("play", qf);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const tp = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
  Yi = he("plus", tp);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const np = [
    ["path", { d: "m2 9 3-3 3 3", key: "1ltn5i" }],
    ["path", { d: "M13 18H7a2 2 0 0 1-2-2V6", key: "1r6tfw" }],
    ["path", { d: "m22 15-3 3-3-3", key: "4rnwn2" }],
    ["path", { d: "M11 6h6a2 2 0 0 1 2 2v10", key: "2f72bc" }],
  ],
  rp = he("repeat-2", np);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const op = [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ],
  lp = he("rotate-ccw", op);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ip = [
    ["path", { d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", key: "1c8476" }],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
  ],
  ud = he("save", ip);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sp = [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        key: "1qme2f",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  ed = he("settings", sp);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ap = [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ],
  up = he("sun", ap);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dp = [
    ["path", { d: "M12 10V2", key: "16sf7g" }],
    ["path", { d: "m4.93 10.93 1.41 1.41", key: "2a7f42" }],
    ["path", { d: "M2 18h2", key: "j10viu" }],
    ["path", { d: "M20 18h2", key: "wocana" }],
    ["path", { d: "m19.07 10.93-1.41 1.41", key: "15zs5n" }],
    ["path", { d: "M22 22H2", key: "19qnx5" }],
    ["path", { d: "m16 6-4 4-4-4", key: "6wukr" }],
    ["path", { d: "M16 18a4 4 0 0 0-8 0", key: "1lzouq" }],
  ],
  cp = he("sunset", dp);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fp = [
    ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
    ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
    ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }],
  ],
  pp = he("timer", fp);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mp = [
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
  ],
  hp = he("trash-2", mp);
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const gp = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  cn = he("x", gp);
function td({ tasks: c, setTasks: k, nextId: f, setNextId: W }) {
  const v = vt(),
    [w, C] = I.useState(""),
    F = (E) => k((j) => j.map((B) => (B.id === E ? { ...B, done: !B.done } : B))),
    D = (E) => k((j) => j.filter((B) => B.id !== E)),
    N = () => {
      const E = w.trim();
      E && (k((j) => [...j, { id: f, text: E, done: !1 }]), W((j) => j + 1), C(""));
    },
    R = c.filter((E) => !E.done).length;
  return i.jsxs("div", {
    className: "steady-card bg-card rounded-2xl p-5 border border-border",
    children: [
      i.jsxs("div", {
        className: "flex items-center justify-between mb-1",
        children: [
          i.jsx("h3", { className: "text-foreground", children: v.tasks.heading }),
          c.length > 0 && R === 0
            ? i.jsxs("span", {
                className: "rounded-full px-3 py-1 flex items-center gap-1.5",
                style: { backgroundColor: "var(--green-bg)", color: "var(--green-text)", fontSize: "0.85rem", fontWeight: 700 },
                children: [i.jsx(Qi, { size: 14 }), "All done!"],
              })
            : i.jsxs("span", {
                className: "rounded-full px-3 py-1",
                style: { backgroundColor: "var(--green-bg)", color: "var(--green-text)", fontSize: "0.85rem", fontWeight: 700 },
                children: [R, " ", v.tasks.left],
              }),
        ],
      }),
      i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: v.tasks.description }),
      c.length === 0 &&
        i.jsxs("div", {
          className: "text-center py-6 space-y-1",
          children: [
            i.jsx("p", { className: "text-foreground", style: { fontWeight: 700 }, children: v.tasks.emptyTitle }),
            i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.88rem" }, children: v.tasks.emptySubtitle }),
          ],
        }),
      i.jsx("div", {
        className: "space-y-2 mb-4",
        children: c.map((E) =>
          i.jsxs(
            "div",
            {
              className: "flex items-center gap-3 rounded-xl p-3 hover:brightness-95",
              style: { backgroundColor: E.done ? "var(--surface-2)" : "var(--surface-1)" },
              children: [
                i.jsx("button", {
                  onClick: () => F(E.id),
                  className: `flex-shrink-0 rounded-full border-2 flex items-center justify-center${E.done ? " task-checked" : ""}`,
                  style: {
                    width: 28,
                    height: 28,
                    borderColor: E.done ? "var(--primary)" : "var(--muted-foreground)",
                    backgroundColor: E.done ? "var(--primary)" : "transparent",
                    transition: "background-color 0.2s, border-color 0.2s",
                  },
                  "aria-label": E.done ? v.tasks.markIncomplete : v.tasks.markComplete,
                  children:
                    E.done &&
                    i.jsx("svg", {
                      width: "14",
                      height: "14",
                      viewBox: "0 0 14 14",
                      fill: "none",
                      children: i.jsx("path", {
                        d: "M2.5 7L5.5 10L11.5 4",
                        stroke: "white",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }),
                    }),
                }),
                i.jsx("span", {
                  className: "flex-1 text-foreground",
                  style: { textDecoration: E.done ? "line-through" : "none", opacity: E.done ? 0.5 : 1 },
                  children: E.text,
                }),
                i.jsx("button", {
                  onClick: () => D(E.id),
                  className: "text-muted-foreground hover:text-destructive p-1 rounded-lg",
                  style: { transition: "color 0.15s" },
                  "aria-label": `${v.tasks.remove}: ${E.text}`,
                  children: i.jsx(cn, { size: 16 }),
                }),
              ],
            },
            E.id,
          ),
        ),
      }),
      c.length > 0 &&
        R === 0 &&
        i.jsxs("div", {
          className: "rounded-xl px-4 py-3 flex items-center gap-3 mb-4",
          style: { backgroundColor: "var(--green-bg)" },
          children: [
            i.jsx(Qi, { size: 20, style: { color: "var(--green-text)", flexShrink: 0 } }),
            i.jsx("p", {
              style: { color: "var(--green-text)", fontWeight: 700, fontSize: "0.95rem" },
              children: "Everything on your list is done — great work! 🎉",
            }),
          ],
        }),
      i.jsxs("div", {
        className: "flex gap-2",
        children: [
          i.jsx("input", {
            type: "text",
            value: w,
            onChange: (E) => C(E.target.value),
            onKeyDown: (E) => E.key === "Enter" && N(),
            placeholder: v.tasks.placeholder,
            className:
              "flex-1 min-w-0 rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
            style: { transition: "border-color 0.15s" },
          }),
          i.jsxs("button", {
            onClick: N,
            className: "rounded-xl px-4 py-3 bg-primary text-primary-foreground flex items-center gap-2 hover:opacity-90 flex-shrink-0",
            style: { fontWeight: 700, transition: "opacity 0.15s" },
            children: [i.jsx(Yi, { size: 18 }), i.jsx("span", { className: "hidden sm:inline", children: v.tasks.add })],
          }),
        ],
      }),
    ],
  });
}
const yp = ["morning", "afternoon", "evening"],
  vp = { morning: i.jsx(up, { size: 20 }), afternoon: i.jsx(cp, { size: 20 }), evening: i.jsx(Yf, { size: 20 }) },
  xp = { morning: "var(--morning-bg)", afternoon: "var(--afternoon-bg)", evening: "var(--evening-bg)" },
  kp = 100;
function wp({ sectionKey: c, doneIds: k, onToggle: f, customItems: W, onAddCustom: v, onDeleteCustom: w }) {
  const C = vt(),
    F = C.routines.sections[c],
    [D, N] = I.useState(c === "morning"),
    [R, E] = I.useState(!1),
    [j, B] = I.useState(""),
    Y = W.map((T) => T.id),
    Z = Y.filter((T) => k.includes(T)).length,
    g = () => {
      const T = j.trim();
      T && (v(T), B(""), E(!1));
    },
    M = (T, le, ae) => {
      const ue = k.includes(T);
      return i.jsxs(
        "div",
        {
          className: "flex items-center gap-2 group",
          children: [
            i.jsxs("button", {
              onClick: () => f(T),
              className: "flex-1 flex items-center gap-3 rounded-xl p-3 text-left hover:bg-muted",
              style: { backgroundColor: ue ? "var(--surface-2)" : "transparent", transition: "background-color 0.15s" },
              children: [
                i.jsx("span", {
                  className: "flex-shrink-0 rounded-full border-2 flex items-center justify-center",
                  style: {
                    width: 24,
                    height: 24,
                    borderColor: ue ? "var(--primary)" : "var(--muted-foreground)",
                    backgroundColor: ue ? "var(--primary)" : "transparent",
                  },
                  children:
                    ue &&
                    i.jsx("svg", {
                      width: "12",
                      height: "12",
                      viewBox: "0 0 14 14",
                      fill: "none",
                      children: i.jsx("path", {
                        d: "M2.5 7L5.5 10L11.5 4",
                        stroke: "white",
                        strokeWidth: "2.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }),
                    }),
                }),
                i.jsx("span", {
                  className: "text-foreground",
                  style: { textDecoration: ue ? "line-through" : "none", opacity: ue ? 0.45 : 1 },
                  children: le,
                }),
              ],
            }),
            i.jsx("button", {
              onClick: () => w(T),
              className: "flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100",
              style: { transition: "all 0.15s" },
              "aria-label": C.routines.deleteStep,
              children: i.jsx(cn, { size: 14 }),
            }),
          ],
        },
        T,
      );
    };
  return i.jsxs("div", {
    className: "rounded-2xl border border-border overflow-hidden",
    children: [
      i.jsxs("button", {
        onClick: () => N((T) => !T),
        className: "w-full flex items-center gap-3 p-4 text-left hover:opacity-90",
        style: { backgroundColor: xp[c], transition: "opacity 0.15s" },
        children: [
          i.jsx("span", { className: "text-foreground", children: vp[c] }),
          i.jsxs("div", {
            className: "flex-1",
            children: [
              i.jsx("p", { style: { fontWeight: 700, fontSize: "1.05rem" }, className: "text-foreground", children: F.label }),
              i.jsx("p", { style: { fontSize: "0.85rem" }, className: "text-muted-foreground", children: F.time }),
            ],
          }),
          Y.length > 0 && Z === Y.length
            ? i.jsx(Qi, { size: 22, className: "mr-2 flex-shrink-0", style: { color: "var(--primary)" } })
            : i.jsxs("span", {
                className: "rounded-full px-2.5 py-0.5 mr-2 text-foreground",
                style: { backgroundColor: "rgba(128,128,128,0.25)", fontSize: "0.8rem", fontWeight: 700 },
                children: [Z, "/", Y.length],
              }),
          D ? i.jsx(Ho, { size: 18, className: "text-muted-foreground" }) : i.jsx(Fo, { size: 18, className: "text-muted-foreground" }),
        ],
      }),
      D &&
        i.jsxs("div", {
          className: "p-4 space-y-1 bg-card",
          children: [
            W.length === 0 &&
              !R &&
              i.jsx("p", { className: "text-muted-foreground py-2 pl-1", style: { fontSize: "0.88rem" }, children: C.routines.noSteps }),
            W.map((T) => M(T.id, T.text)),
            R
              ? i.jsxs("div", {
                  className: "flex gap-2 mt-2",
                  children: [
                    i.jsx("input", {
                      type: "text",
                      value: j,
                      onChange: (T) => B(T.target.value),
                      onKeyDown: (T) => T.key === "Enter" && g(),
                      placeholder: C.routines.addStepPlaceholder,
                      autoFocus: !0,
                      className:
                        "flex-1 rounded-xl px-3 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                      style: { fontSize: "0.9rem", transition: "border-color 0.15s" },
                    }),
                    i.jsx("button", {
                      onClick: g,
                      className: "rounded-xl px-4 py-2.5 bg-primary text-primary-foreground hover:opacity-90",
                      style: { fontWeight: 700, fontSize: "0.9rem", transition: "opacity 0.15s" },
                      children: C.routines.addStepButton,
                    }),
                    i.jsx("button", {
                      onClick: () => {
                        (E(!1), B(""));
                      },
                      className: "rounded-xl px-3 py-2.5 border border-border text-muted-foreground hover:bg-muted",
                      style: { transition: "background-color 0.15s" },
                      "aria-label": "Cancel",
                      children: i.jsx(cn, { size: 16 }),
                    }),
                  ],
                })
              : i.jsxs("button", {
                  onClick: () => E(!0),
                  className: "flex items-center gap-2 text-muted-foreground hover:text-primary mt-1 pl-1",
                  style: { fontSize: "0.88rem", fontWeight: 600, transition: "color 0.15s" },
                  children: [i.jsx(Yi, { size: 15 }), C.routines.addStepPlaceholder.replace("…", "")],
                }),
          ],
        }),
    ],
  });
}
function Sp() {
  const c = vt(),
    [k, f] = Ye("steady-routines-done", []),
    [W, v] = Ye("steady-routines-custom", { morning: [], afternoon: [], evening: [] }),
    [w, C] = Ye("steady-routines-nextid", kp),
    F = (R) => {
      f((E) => (E.includes(R) ? E.filter((j) => j !== R) : [...E, R]));
    },
    D = (R, E) => {
      const j = w;
      (C((B) => B + 1), v((B) => ({ ...B, [R]: [...(B[R] ?? []), { id: j, text: E }] })));
    },
    N = (R, E) => {
      (v((j) => ({ ...j, [R]: (j[R] ?? []).filter((B) => B.id !== E) })), f((j) => j.filter((B) => B !== E)));
    };
  return i.jsxs("div", {
    className: "steady-card bg-card rounded-2xl p-5 border border-border",
    children: [
      i.jsx("h3", { className: "mb-1 text-foreground", children: c.routines.heading }),
      i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: c.routines.description }),
      i.jsx("div", {
        className: "space-y-3",
        children: yp.map((R) =>
          i.jsx(
            wp,
            { sectionKey: R, doneIds: k, onToggle: F, customItems: W[R] ?? [], onAddCustom: (E) => D(R, E), onDeleteCustom: (E) => N(R, E) },
            R,
          ),
        ),
      }),
    ],
  });
}
const jp = ["💧", "🚶", "📵", "📝", "🏃", "😴", "🥗", "🧘", "📚", "💊", "🎵", "🌳", "☀️", "🍎", "💪", "🧹", "🎯", "✍️", "🫧", "🌿"],
  nd = [
    "var(--habit-water)",
    "var(--habit-move)",
    "var(--habit-screens)",
    "var(--habit-journal)",
    "var(--green-bg)",
    "var(--purple-bg)",
    "var(--yellow-bg)",
  ];
function Np(c) {
  return nd[c % nd.length];
}
function bp() {
  return `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function Cp() {
  const c = vt(),
    [k, f] = Ye("steady-habits-v2", []),
    [W, v] = I.useState(!1),
    [w, C] = I.useState("🎯"),
    [F, D] = I.useState(""),
    N = (j) => {
      f((B) => B.map((Y) => (Y.id === j ? { ...Y, doneToday: !Y.doneToday, streak: Y.doneToday ? Math.max(0, Y.streak - 1) : Y.streak + 1 } : Y)));
    },
    R = (j) => {
      f((B) => B.filter((Y) => Y.id !== j));
    },
    E = () => {
      const j = F.trim();
      j && (f((B) => [...B, { id: bp(), name: j, emoji: w, streak: 0, doneToday: !1 }]), D(""), C("🎯"), v(!1));
    };
  return i.jsxs("div", {
    className: "steady-card bg-card rounded-2xl p-5 border border-border",
    children: [
      i.jsx("h3", { className: "mb-1 text-foreground", children: c.habits.heading }),
      i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: c.habits.description }),
      k.length === 0 &&
        !W &&
        i.jsxs("div", {
          className: "text-center py-6 space-y-1",
          children: [
            i.jsx("p", { className: "text-foreground", style: { fontWeight: 700 }, children: c.habits.emptyTitle }),
            i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.88rem" }, children: c.habits.emptySubtitle }),
          ],
        }),
      i.jsx("div", {
        className: "space-y-2 mb-3",
        children: k.map((j, B) =>
          i.jsxs(
            "div",
            {
              className: "relative group",
              children: [
                i.jsxs("button", {
                  onClick: () => N(j.id),
                  className: "w-full flex items-center gap-3 p-3 pr-10 rounded-xl hover:opacity-90 text-left",
                  style: {
                    backgroundColor: j.doneToday ? Np(B) : "var(--surface-1)",
                    border: j.doneToday ? "2px solid var(--primary)" : "2px solid transparent",
                    transition:
                      "background-color 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s cubic-bezier(0.34,1.56,0.64,1), transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: j.doneToday ? "scale(1.01)" : "scale(1)",
                  },
                  children: [
                    i.jsx("span", { style: { fontSize: "1.7rem", flexShrink: 0 }, children: j.emoji }),
                    i.jsx("span", { className: "flex-1 text-foreground", style: { fontWeight: 600 }, children: j.name }),
                    i.jsxs("div", {
                      className: "flex items-center gap-1",
                      children: [
                        i.jsx(ad, { size: 15, style: { color: j.streak > 0 ? "#E8834A" : "var(--muted-foreground)" } }),
                        i.jsx("span", {
                          style: { fontWeight: 700, fontSize: "0.9rem", color: j.streak > 0 ? "#E8834A" : "var(--muted-foreground)" },
                          children: j.streak,
                        }),
                      ],
                    }),
                    i.jsx("div", {
                      className: "rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      style: {
                        width: 24,
                        height: 24,
                        borderColor: j.doneToday ? "var(--primary)" : "var(--muted-foreground)",
                        backgroundColor: j.doneToday ? "var(--primary)" : "transparent",
                        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                      },
                      children:
                        j.doneToday &&
                        i.jsx("svg", {
                          width: "11",
                          height: "11",
                          viewBox: "0 0 14 14",
                          fill: "none",
                          children: i.jsx("path", {
                            d: "M2.5 7L5.5 10L11.5 4",
                            stroke: "white",
                            strokeWidth: "2.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                          }),
                        }),
                    }),
                  ],
                }),
                i.jsx("button", {
                  onClick: () => R(j.id),
                  className:
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted sm:opacity-0 sm:group-hover:opacity-100",
                  style: { transition: "all 0.15s" },
                  "aria-label": `${c.habits.deleteHabit}: ${j.name}`,
                  children: i.jsx(cn, { size: 15 }),
                }),
              ],
            },
            j.id,
          ),
        ),
      }),
      W
        ? i.jsxs("div", {
            className: "rounded-2xl p-4 border-2 space-y-3",
            style: { borderColor: "var(--primary)", backgroundColor: "var(--surface-1)" },
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("p", { className: "text-muted-foreground mb-2", style: { fontSize: "0.82rem", fontWeight: 600 }, children: "Pick an emoji" }),
                  i.jsx("div", {
                    className: "flex flex-wrap gap-1.5 mb-2",
                    children: jp.map((j) =>
                      i.jsx(
                        "button",
                        {
                          onClick: () => C(j),
                          className: "rounded-lg hover:scale-110",
                          style: {
                            width: 36,
                            height: 36,
                            fontSize: "1.3rem",
                            backgroundColor: w === j ? "var(--green-bg)" : "transparent",
                            border: w === j ? "2px solid var(--primary)" : "2px solid transparent",
                            transition: "all 0.15s",
                          },
                          children: j,
                        },
                        j,
                      ),
                    ),
                  }),
                  i.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      i.jsx("span", { style: { fontSize: "1.8rem" }, children: w }),
                      i.jsx("span", { className: "text-muted-foreground", style: { fontSize: "0.82rem" }, children: "or type your own:" }),
                      i.jsx("input", {
                        type: "text",
                        value: w,
                        onChange: (j) => C(j.target.value.slice(-2) || j.target.value),
                        className:
                          "rounded-lg border border-border bg-input-background text-foreground outline-none focus:border-primary text-center",
                        style: { width: 48, height: 36, fontSize: "1.2rem" },
                        maxLength: 2,
                      }),
                    ],
                  }),
                ],
              }),
              i.jsx("input", {
                type: "text",
                value: F,
                onChange: (j) => D(j.target.value),
                onKeyDown: (j) => j.key === "Enter" && E(),
                placeholder: c.habits.namePlaceholder,
                autoFocus: !0,
                className:
                  "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                style: { transition: "border-color 0.15s" },
              }),
              i.jsxs("div", {
                className: "flex gap-2",
                children: [
                  i.jsxs("button", {
                    onClick: E,
                    className: "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90",
                    style: { fontWeight: 700, transition: "opacity 0.15s" },
                    children: [i.jsx(Wo, { size: 16 }), c.habits.addHabit],
                  }),
                  i.jsx("button", {
                    onClick: () => {
                      (v(!1), D(""), C("🎯"));
                    },
                    className: "rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted",
                    style: { fontWeight: 600, transition: "background-color 0.15s" },
                    children: c.habits.cancel,
                  }),
                ],
              }),
            ],
          })
        : i.jsxs("button", {
            onClick: () => v(!0),
            className:
              "w-full flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary",
            style: { borderColor: "var(--border)", transition: "all 0.15s" },
            children: [
              i.jsx("span", {
                style: { fontSize: "1.7rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
                children: i.jsx(Yi, { size: 22 }),
              }),
              i.jsx("span", { style: { fontWeight: 600, fontSize: "1rem" }, children: c.habits.addHabit }),
            ],
          }),
    ],
  });
}
const zp = [300, 900, 1500, 2700],
  Ep = ["5 min", "15 min", "25 min", "45 min"];
function Pp() {
  const c = vt(),
    [k, f] = I.useState(1500),
    [W, v] = I.useState(1500),
    [w, C] = I.useState(!1),
    [F, D] = I.useState(!1),
    N = I.useRef(null);
  I.useEffect(
    () => (
      w
        ? (N.current = setInterval(() => {
            v((g) => (g <= 1 ? (clearInterval(N.current), C(!1), D(!0), 0) : g - 1));
          }, 1e3))
        : clearInterval(N.current),
      () => clearInterval(N.current)
    ),
    [w],
  );
  const R = (g) => {
      clearInterval(N.current);
      const M = g ?? k;
      (f(M), v(M), C(!1), D(!1));
    },
    E = String(Math.floor(W / 60)).padStart(2, "0"),
    j = String(W % 60).padStart(2, "0"),
    B = W / k,
    Y = 2 * Math.PI * 52,
    Z = Y * B;
  return i.jsxs(i.Fragment, {
    children: [
      i.jsx("style", {
        children: `
        @keyframes ring-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px var(--primary)); }
          50%       { filter: drop-shadow(0 0 12px var(--primary)); }
        }
        .timer-ring-running { animation: ring-pulse 2s ease-in-out infinite; }
        @keyframes dot-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .focus-dot { animation: dot-blink 1.4s ease-in-out infinite; }
      `,
      }),
      i.jsxs("div", {
        className: "steady-card rounded-2xl p-5 border-2",
        style: {
          backgroundColor: "var(--card)",
          borderColor: w ? "var(--primary)" : F ? "var(--purple-vivid)" : "var(--border)",
          transition: "border-color 0.4s",
        },
        children: [
          i.jsxs("div", {
            className: "flex items-center justify-between mb-1",
            children: [
              i.jsx("h3", { className: "text-foreground", children: c.focus.heading }),
              w &&
                i.jsxs("span", {
                  className: "flex items-center gap-1.5 rounded-full px-3 py-1",
                  style: { backgroundColor: "var(--green-bg)", color: "var(--green-text)", fontSize: "0.78rem", fontWeight: 700 },
                  children: [
                    i.jsx("span", {
                      className: "focus-dot",
                      style: { width: 7, height: 7, borderRadius: "50%", backgroundColor: "var(--primary)", display: "inline-block" },
                    }),
                    "Focusing",
                  ],
                }),
            ],
          }),
          i.jsx("p", { className: "text-muted-foreground mb-5", style: { fontSize: "0.95rem" }, children: c.focus.description }),
          !w &&
            !F &&
            i.jsx("div", {
              className: "flex gap-2 mb-6 flex-wrap",
              children: zp.map((g, M) =>
                i.jsx(
                  "button",
                  {
                    onClick: () => R(g),
                    "aria-pressed": k === g,
                    className: "rounded-xl px-4 py-2 border border-border hover:opacity-80",
                    style: {
                      backgroundColor: k === g ? "var(--primary)" : "var(--surface-1)",
                      color: k === g ? "var(--primary-foreground)" : "var(--foreground)",
                      fontWeight: 700,
                      transition: "all 0.15s",
                    },
                    children: Ep[M],
                  },
                  g,
                ),
              ),
            }),
          i.jsxs("div", {
            className: "flex flex-col items-center gap-5",
            children: [
              i.jsxs("div", {
                className: "relative",
                style: { width: 148, height: 148 },
                children: [
                  i.jsxs("svg", {
                    width: "148",
                    height: "148",
                    viewBox: "0 0 148 148",
                    "aria-hidden": "true",
                    className: w ? "timer-ring-running" : "",
                    children: [
                      i.jsx("circle", { cx: "74", cy: "74", r: "60", fill: "none", stroke: "var(--surface-2)", strokeWidth: "11" }),
                      i.jsx("circle", {
                        cx: "74",
                        cy: "74",
                        r: "60",
                        fill: "none",
                        stroke: F ? "var(--purple-vivid)" : "var(--primary)",
                        strokeWidth: "11",
                        strokeDasharray: `${Z * (60 / 52)} ${Y * (60 / 52)}`,
                        strokeLinecap: "round",
                        transform: "rotate(-90 74 74)",
                        style: { transition: "stroke-dasharray 0.5s ease" },
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "absolute inset-0 flex flex-col items-center justify-center gap-1",
                    children: [
                      i.jsxs("span", {
                        role: "timer",
                        "aria-label": `${E} minutes ${j} seconds remaining`,
                        style: {
                          fontSize: w ? "2rem" : "1.8rem",
                          fontWeight: 800,
                          fontFamily: "inherit",
                          color: F ? "var(--purple-vivid)" : "var(--foreground)",
                          transition: "font-size 0.2s",
                          lineHeight: 1,
                        },
                        children: [E, ":", j],
                      }),
                      w &&
                        i.jsx("span", {
                          style: {
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          },
                          children: c.focus.pause.includes("Pause") ? "running" : "kører",
                        }),
                    ],
                  }),
                ],
              }),
              F && i.jsx("p", { style: { fontWeight: 700, color: "var(--purple-vivid)", fontSize: "1rem" }, children: c.focus.done }),
              i.jsxs("div", {
                className: "flex gap-3",
                children: [
                  i.jsxs("button", {
                    onClick: () => C((g) => !g),
                    "aria-label": w ? c.focus.pause : c.focus.start,
                    className: "flex items-center gap-2 rounded-xl px-6 py-3 bg-primary text-primary-foreground hover:opacity-90",
                    style: { fontWeight: 700, transition: "opacity 0.15s", minWidth: 120, justifyContent: "center" },
                    children: [w ? i.jsx(Zf, { size: 18 }) : i.jsx(ep, { size: 18 }), w ? c.focus.pause : c.focus.start],
                  }),
                  i.jsxs("button", {
                    onClick: () => R(),
                    className: "flex items-center gap-2 rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted",
                    style: { fontWeight: 600, transition: "background-color 0.15s" },
                    children: [i.jsx(lp, { size: 18 }), c.focus.reset],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function dd() {
  return new Date().toISOString().slice(0, 10);
}
function rd(c, k, f) {
  return c === dd() ? f : new Date(c).toLocaleDateString(k, { weekday: "short", day: "numeric", month: "short" });
}
function _p() {
  const c = vt(),
    [k, f] = Ye("steady-notes", []),
    [W, v] = Ye("steady-notes-nextid", 1),
    [w, C] = I.useState(!1),
    [F, D] = I.useState(!1),
    N = dd(),
    R = k.find((M) => M.date === N),
    [E, j] = I.useState((R == null ? void 0 : R.text) ?? ""),
    B = new Date().getDate() % c.note.prompts.length,
    Y = () => {
      const M = E.trim();
      M &&
        (R ? f((T) => T.map((le) => (le.date === N ? { ...le, text: M } : le))) : (f((T) => [...T, { id: W, date: N, text: M }]), v((T) => T + 1)),
        C(!0),
        setTimeout(() => C(!1), 2500));
    },
    Z = (M) => {
      f((T) => T.filter((le) => le.id !== M));
    },
    g = [...k].filter((M) => M.date !== N).sort((M, T) => T.date.localeCompare(M.date));
  return i.jsxs("div", {
    className: "space-y-4",
    children: [
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border",
        children: [
          i.jsx("h3", { className: "mb-1 text-foreground", children: c.note.heading }),
          i.jsx("p", { className: "text-muted-foreground mb-1", style: { fontSize: "0.95rem" }, children: c.note.description }),
          i.jsxs("p", {
            className: "mb-3 rounded-xl px-4 py-3",
            style: { backgroundColor: "var(--purple-bg)", fontSize: "0.95rem", color: "var(--purple-text)", fontStyle: "italic" },
            children: [i.jsx("span", { "aria-hidden": "true", children: "💭 " }), c.note.prompts[B]],
          }),
          i.jsx("textarea", {
            value: E,
            onChange: (M) => j(M.target.value),
            placeholder: c.note.placeholder,
            rows: 5,
            className:
              "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none",
            style: { lineHeight: 1.7, transition: "border-color 0.15s" },
          }),
          i.jsxs("div", {
            className: "flex items-center justify-between mt-3",
            children: [
              i.jsxs("span", { className: "text-muted-foreground", style: { fontSize: "0.85rem" }, children: [E.length, " ", c.note.characters] }),
              i.jsxs("button", {
                onClick: Y,
                className: "flex items-center gap-2 rounded-xl px-4 py-2 bg-primary text-primary-foreground hover:opacity-90",
                style: { fontWeight: 700, transition: "opacity 0.15s" },
                children: [i.jsx(ud, { size: 15 }), w ? c.note.saved : c.note.save],
              }),
            ],
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl border border-border overflow-hidden",
        children: [
          i.jsxs("button", {
            onClick: () => D((M) => !M),
            "aria-expanded": F,
            className: "w-full flex items-center justify-between px-5 py-4 hover:bg-muted",
            style: { transition: "background-color 0.15s" },
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("p", { className: "text-foreground text-left", style: { fontWeight: 700 }, children: c.noteHistory.heading }),
                  i.jsxs("p", {
                    className: "text-muted-foreground text-left",
                    style: { fontSize: "0.85rem" },
                    children: [g.length, " ", g.length === 1 ? "entry" : "entries"],
                  }),
                ],
              }),
              F ? i.jsx(Ho, { size: 18, className: "text-muted-foreground" }) : i.jsx(Fo, { size: 18, className: "text-muted-foreground" }),
            ],
          }),
          F &&
            i.jsx("div", {
              className: "border-t border-border",
              children:
                g.length === 0
                  ? i.jsx("p", { className: "text-muted-foreground px-5 py-4", style: { fontSize: "0.9rem" }, children: c.noteHistory.empty })
                  : i.jsx("div", {
                      className: "divide-y",
                      style: { borderColor: "var(--border)" },
                      children: g.map((M) =>
                        i.jsxs(
                          "div",
                          {
                            className: "px-5 py-4 group",
                            children: [
                              i.jsxs("div", {
                                className: "flex items-center justify-between mb-1",
                                children: [
                                  i.jsx("span", {
                                    style: { fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" },
                                    children: rd(M.date, c.dateLocale, c.noteHistory.today),
                                  }),
                                  i.jsx("button", {
                                    onClick: () => Z(M.id),
                                    className: "text-muted-foreground hover:text-destructive p-1 rounded-lg sm:opacity-0 sm:group-hover:opacity-100",
                                    style: { transition: "all 0.15s" },
                                    "aria-label": `${c.noteHistory.deleteEntry}: ${rd(M.date, c.dateLocale, c.noteHistory.today)}`,
                                    children: i.jsx(hp, { size: 14 }),
                                  }),
                                ],
                              }),
                              i.jsx("p", {
                                className: "text-foreground",
                                style: { fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" },
                                children: M.text,
                              }),
                            ],
                          },
                          M.id,
                        ),
                      ),
                    }),
            }),
        ],
      }),
    ],
  });
}
const Ki = { fontSize: "normal", font: "standard", lineSpacing: "normal", reduceMotion: !1, highContrast: !1, darkMode: !1, language: "en" },
  Cr = { name: "", pronoun: "", avatar: "🌱", about: "", sensory: [], support: [], strengths: [], a11y: Ki },
  Tp = ["🌱", "🌻", "🌊", "🍂", "⭐", "🌙", "🦋", "🐢", "🌈", "🎨", "🍵", "🐾"];
async function Lp(c, k = 240) {
  return new Promise((f) => {
    const W = new FileReader();
    ((W.onload = (v) => {
      const w = new Image();
      ((w.onload = () => {
        const C = Math.min(k / w.width, k / w.height, 1),
          F = document.createElement("canvas");
        ((F.width = Math.round(w.width * C)),
          (F.height = Math.round(w.height * C)),
          F.getContext("2d").drawImage(w, 0, 0, F.width, F.height),
          f(F.toDataURL("image/jpeg", 0.82)));
      }),
        (w.src = v.target.result));
    }),
      W.readAsDataURL(c));
  });
}
function Dp() {
  return Array.from({ length: 7 }, (c, k) => {
    const f = new Date();
    return (f.setDate(f.getDate() - (6 - k)), f.toISOString().slice(0, 10));
  });
}
function Mp({ profile: c, onChange: k, photo: f, onPhotoChange: W }) {
  const v = vt(),
    w = v.profile,
    [C, F] = I.useState(!1),
    D = I.useRef(null),
    [N] = Ye("steady-mood-history", []),
    R = (g) => k({ ...c, ...g }),
    E = (g, M) => {
      const T = c[g],
        le = !T.includes(M),
        ae = le ? [...T, M] : T.filter((me) => me !== M),
        ue = { [g]: ae };
      (g === "sensory" && M === "Light-sensitive" && le && (ue.a11y = { ...c.a11y, darkMode: !0 }), R(ue));
    },
    j = async (g) => {
      var T;
      const M = (T = g.target.files) == null ? void 0 : T[0];
      M && (W(await Lp(M)), (g.target.value = ""));
    },
    B = () => {
      (F(!0), setTimeout(() => F(!1), 2500));
    },
    Y = Dp(),
    Z = v.mood.options;
  return i.jsxs("div", {
    className: "space-y-5",
    children: [
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border",
        children: [
          i.jsx("h3", { className: "mb-1 text-foreground", children: w.heading }),
          i.jsx("p", { className: "text-muted-foreground mb-5", style: { fontSize: "0.95rem" }, children: w.description }),
          i.jsxs("div", {
            className: "flex gap-4 items-start mb-5",
            children: [
              i.jsxs("div", {
                className: "flex flex-col items-center gap-2",
                children: [
                  i.jsx("div", {
                    className: "rounded-full flex items-center justify-center overflow-hidden",
                    style: { width: 80, height: 80, backgroundColor: "var(--surface-2)", flexShrink: 0 },
                    children: f
                      ? i.jsx("img", { src: f, alt: "Your profile", style: { width: 80, height: 80, objectFit: "cover" } })
                      : i.jsx("span", { style: { fontSize: "3.5rem", lineHeight: 1 }, children: c.avatar }),
                  }),
                  i.jsx("input", { ref: D, type: "file", accept: "image/*", onChange: j, className: "hidden" }),
                  i.jsxs("div", {
                    className: "flex gap-1.5",
                    children: [
                      i.jsxs("button", {
                        onClick: () => {
                          var g;
                          return (g = D.current) == null ? void 0 : g.click();
                        },
                        className: "flex items-center gap-1 rounded-lg px-2.5 py-1.5 border border-border text-foreground hover:bg-muted",
                        style: { fontSize: "0.8rem", fontWeight: 600, transition: "background-color 0.15s" },
                        children: [i.jsx(Df, { size: 13 }), f ? w.changePhoto : w.addPhoto],
                      }),
                      f &&
                        i.jsx("button", {
                          onClick: () => W(null),
                          className: "rounded-lg px-2 py-1.5 border border-border text-muted-foreground hover:text-destructive",
                          style: { fontSize: "0.8rem", transition: "color 0.15s" },
                          "aria-label": w.removePhoto,
                          children: i.jsx(cn, { size: 13 }),
                        }),
                    ],
                  }),
                ],
              }),
              i.jsxs("div", {
                className: "flex-1",
                children: [
                  i.jsxs("p", {
                    style: { fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 },
                    className: "text-foreground",
                    children: [
                      w.emojiAvatar,
                      f &&
                        i.jsxs("span", { className: "text-muted-foreground", style: { fontWeight: 500 }, children: [" (", w.shownWhenNoPhoto, ")"] }),
                    ],
                  }),
                  i.jsx("div", {
                    className: "flex flex-wrap gap-2",
                    children: Tp.map((g) =>
                      i.jsx(
                        "button",
                        {
                          onClick: () => R({ avatar: g }),
                          className: "rounded-xl flex items-center justify-center hover:scale-110 hover:opacity-85",
                          style: {
                            width: 40,
                            height: 40,
                            fontSize: "1.4rem",
                            backgroundColor: c.avatar === g ? "var(--green-bg)" : "var(--surface-1)",
                            border: c.avatar === g ? "2px solid var(--primary)" : "2px solid transparent",
                            transition: "all 0.15s",
                          },
                          "aria-pressed": c.avatar === g,
                          children: g,
                        },
                        g,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("label", {
                    className: "text-foreground",
                    style: { display: "block", marginBottom: 6, fontSize: "0.9rem" },
                    children: w.namePlaceholder,
                  }),
                  i.jsx("input", {
                    type: "text",
                    value: c.name,
                    onChange: (g) => R({ name: g.target.value }),
                    className:
                      "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground outline-none focus:border-primary",
                    style: { transition: "border-color 0.15s" },
                  }),
                ],
              }),
              i.jsxs("div", {
                children: [
                  i.jsx("label", {
                    className: "text-foreground",
                    style: { display: "block", marginBottom: 6, fontSize: "0.9rem" },
                    children: w.pronounsLabel,
                  }),
                  i.jsxs("select", {
                    value: c.pronoun,
                    onChange: (g) => R({ pronoun: g.target.value }),
                    className:
                      "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground outline-none focus:border-primary appearance-none",
                    style: {
                      transition: "border-color 0.15s",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "2.5rem",
                    },
                    children: [
                      i.jsx("option", { value: "", children: "—" }),
                      w.pronounsOptions.map((g) => i.jsx("option", { value: g, children: g }, g)),
                    ],
                  }),
                ],
              }),
            ],
          }),
          i.jsxs("div", {
            children: [
              i.jsx("label", {
                className: "text-foreground",
                style: { display: "block", marginBottom: 6, fontSize: "0.9rem" },
                children: w.aboutLabel,
              }),
              i.jsx("textarea", {
                value: c.about,
                onChange: (g) => R({ about: g.target.value }),
                rows: 2,
                className:
                  "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground outline-none focus:border-primary resize-none",
                style: { lineHeight: 1.6, transition: "border-color 0.15s" },
              }),
            ],
          }),
        ],
      }),
      i.jsxs("div", {
        className: "rounded-2xl p-5 border border-border flex items-center gap-4",
        style: { backgroundColor: "var(--purple-bg)" },
        children: [
          i.jsx("div", {
            className: "rounded-full overflow-hidden flex items-center justify-center flex-shrink-0",
            style: { width: 60, height: 60, backgroundColor: "var(--surface-2)" },
            children: f
              ? i.jsx("img", { src: f, alt: "Profile", style: { width: 60, height: 60, objectFit: "cover" } })
              : i.jsx("span", { style: { fontSize: "2.2rem" }, children: c.avatar }),
          }),
          i.jsxs("div", {
            children: [
              i.jsx("p", { className: "text-foreground", style: { fontWeight: 800, fontSize: "1.15rem" }, children: c.name || w.namePlaceholder }),
              c.pronoun && i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.85rem", marginBottom: 2 }, children: c.pronoun }),
              c.about &&
                i.jsxs("p", { style: { fontSize: "0.88rem", color: "var(--purple-text)", fontStyle: "italic" }, children: ['"', c.about, '"'] }),
            ],
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border",
        children: [
          i.jsx("h3", { className: "mb-1 text-foreground", children: v.moodHistory.heading }),
          i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: v.moodHistory.description }),
          N.length === 0
            ? i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.9rem" }, children: v.moodHistory.noData })
            : i.jsx("div", {
                className: "grid gap-2",
                style: { gridTemplateColumns: "repeat(7, 1fr)" },
                children: Y.map((g) => {
                  const M = N.find((ue) => ue.date === g),
                    T = M !== void 0 ? Z[M.moodIndex] : null,
                    le = new Date(g).getDay(),
                    ae = v.moodHistory.days[(le + 6) % 7];
                  return i.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center gap-1.5",
                      children: [
                        i.jsx("div", {
                          className: "rounded-full flex items-center justify-center",
                          style: { width: 40, height: 40, backgroundColor: T ? "var(--surface-2)" : "var(--surface-1)", fontSize: "1.4rem" },
                          children: T ? T.emoji : i.jsx("span", { style: { color: "var(--muted-foreground)", fontSize: "1rem" }, children: "·" }),
                        }),
                        i.jsx("span", { className: "text-muted-foreground", style: { fontSize: "0.68rem", fontWeight: 600 }, children: ae }),
                      ],
                    },
                    g,
                  );
                }),
              }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border",
        children: [
          i.jsx("h3", { className: "mb-1 text-foreground", children: v.strengths.heading }),
          i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: v.strengths.description }),
          i.jsx("div", {
            className: "flex flex-wrap gap-2",
            children: v.strengths.options.map((g) => {
              const M = c.strengths.includes(g.key);
              return i.jsxs(
                "button",
                {
                  onClick: () => E("strengths", g.key),
                  className: "flex items-center gap-2 rounded-xl px-4 py-2.5 border-2 hover:opacity-85",
                  style: {
                    borderColor: M ? "var(--primary)" : "transparent",
                    backgroundColor: M ? "var(--green-bg)" : "var(--surface-1)",
                    fontWeight: M ? 700 : 500,
                    color: M ? "var(--green-text)" : "var(--foreground)",
                    transition: "all 0.15s",
                  },
                  "aria-pressed": M,
                  children: [i.jsx("span", { children: g.emoji }), i.jsx("span", { style: { fontSize: "0.9rem" }, children: g.label })],
                },
                g.key,
              );
            }),
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border",
        children: [
          i.jsx("h3", { className: "mb-1 text-foreground", children: w.sensory.heading }),
          i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: w.sensory.description }),
          i.jsx("div", {
            className: "flex flex-wrap gap-2",
            children: w.sensory.options.map((g) => {
              const M = c.sensory.includes(g.key);
              return i.jsxs(
                "button",
                {
                  onClick: () => E("sensory", g.key),
                  className: "flex items-center gap-2 rounded-xl px-4 py-2.5 border-2 hover:opacity-85",
                  style: {
                    borderColor: M ? "var(--primary)" : "transparent",
                    backgroundColor: M ? "var(--green-bg)" : "var(--surface-1)",
                    fontWeight: M ? 700 : 500,
                    color: M ? "var(--green-text)" : "var(--foreground)",
                    transition: "all 0.15s",
                  },
                  "aria-pressed": M,
                  children: [i.jsx("span", { children: g.emoji }), i.jsx("span", { style: { fontSize: "0.9rem" }, children: g.label })],
                },
                g.key,
              );
            }),
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border",
        children: [
          i.jsx("h3", { className: "mb-1 text-foreground", children: w.support.heading }),
          i.jsx("p", { className: "text-muted-foreground mb-4", style: { fontSize: "0.95rem" }, children: w.support.description }),
          i.jsx("div", {
            className: "flex flex-wrap gap-2",
            children: w.support.options.map((g) => {
              const M = c.support.includes(g.key);
              return i.jsxs(
                "button",
                {
                  onClick: () => E("support", g.key),
                  className: "flex items-center gap-2 rounded-xl px-4 py-2.5 border-2 hover:opacity-85",
                  style: {
                    borderColor: M ? "var(--purple-vivid)" : "transparent",
                    backgroundColor: M ? "var(--purple-bg)" : "var(--surface-1)",
                    fontWeight: M ? 700 : 500,
                    color: M ? "var(--purple-text)" : "var(--foreground)",
                    transition: "all 0.15s",
                  },
                  "aria-pressed": M,
                  children: [i.jsx("span", { children: g.emoji }), i.jsx("span", { style: { fontSize: "0.9rem" }, children: g.label })],
                },
                g.key,
              );
            }),
          }),
        ],
      }),
      i.jsx("button", {
        onClick: B,
        className: "w-full flex items-center justify-center gap-2 rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90",
        style: { fontWeight: 700, fontSize: "1rem", transition: "opacity 0.15s" },
        children: C ? w.saved : i.jsxs(i.Fragment, { children: [i.jsx(ud, { size: 18 }), " ", w.save] }),
      }),
    ],
  });
}
function Op({ support: c, sensory: k }) {
  const f = vt(),
    W = k.find((C) => f.sensoryTips[C]),
    v = c.filter((C) => f.supportTips[C]),
    w = v.length > 0 ? f.supportTips[v[new Date().getDate() % v.length]] : f.supportTips.default;
  return i.jsxs("div", {
    className: "space-y-3",
    children: [
      W &&
        i.jsx("div", {
          className: "rounded-2xl px-4 py-3 border border-border",
          style: { backgroundColor: "var(--surface-1)" },
          children: i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.9rem", lineHeight: 1.6 }, children: f.sensoryTips[W] }),
        }),
      i.jsxs("div", {
        className: "rounded-2xl p-4 border border-border",
        style: { backgroundColor: "var(--purple-bg)" },
        children: [
          i.jsx("p", { style: { fontWeight: 700, color: "var(--purple-text)", marginBottom: 4 }, children: f.overview.tipForYou }),
          i.jsx("p", { style: { color: "var(--purple-text)", fontSize: "0.95rem", lineHeight: 1.6 }, children: w }),
        ],
      }),
    ],
  });
}
function Ao({ size: c = 28, className: k }) {
  return i.jsxs("svg", {
    width: c,
    height: c,
    viewBox: "0 0 32 32",
    fill: "none",
    className: k,
    "aria-hidden": "true",
    children: [
      i.jsx("path", { d: "M15 17 C15 17 9 15 6 8 C6 8 11 5 15 11 L15 17Z", fill: "var(--primary)" }),
      i.jsx("path", { d: "M15 17 C15 17 21 15 24 8 C24 8 19 5 15 11 L15 17Z", fill: "var(--primary)", opacity: "0.55" }),
      i.jsx("path", { d: "M15 17 L15 26", stroke: "var(--primary)", strokeWidth: "2.2", strokeLinecap: "round" }),
      i.jsx("path", { d: "M11 27 Q15 25.5 19 27", stroke: "var(--muted-foreground)", strokeWidth: "2", strokeLinecap: "round" }),
    ],
  });
}
async function Wn(c) {
  const k = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(c));
  return Array.from(new Uint8Array(k))
    .map((f) => f.toString(16).padStart(2, "0"))
    .join("");
}
const Rp = ["🌱", "🌻", "🌊", "🍂", "⭐", "🌙", "🦋", "🐢", "🌈", "🎨", "🍵", "🐾"],
  Ip = [
    { key: "Noise-sensitive", emoji: "🔇" },
    { key: "Light-sensitive", emoji: "💡" },
    { key: "Need lots of movement", emoji: "🚶" },
    { key: "Need stillness", emoji: "🧘" },
    { key: "Texture-sensitive", emoji: "🤲" },
    { key: "Smell-sensitive", emoji: "👃" },
  ],
  Wp = [
    { key: "Gentle reminders", emoji: "🔔" },
    { key: "Checklists", emoji: "✅" },
    { key: "Quiet focus time", emoji: "🤫" },
    { key: "Written instructions", emoji: "📋" },
    { key: "Extra time to process", emoji: "⏳" },
    { key: "Visual cues", emoji: "👁️" },
  ],
  od = 7;
function Fp({ onComplete: c, onSkip: k, isGuest: f, onRegister: W }) {
  const [v, w] = I.useState(0),
    [C, F] = I.useState("en"),
    [D, N] = I.useState(""),
    [R, E] = I.useState(""),
    [j, B] = I.useState("🌱"),
    [Y, Z] = I.useState([]),
    [g, M] = I.useState([]),
    [T, le] = I.useState("normal"),
    [ae, ue] = I.useState(!1),
    [me, Ce] = I.useState(!1),
    A = Uo[C],
    [de, He] = I.useState(!1),
    [Re, Ie] = I.useState(""),
    [ze, Ne] = I.useState(""),
    [we, fe] = I.useState(""),
    ce = async () => {
      if ((fe(""), !Re.trim())) {
        fe("Please enter your email.");
        return;
      }
      if (ze.length < 6) {
        fe("Password must be at least 6 characters.");
        return;
      }
      const a = (() => {
        try {
          return JSON.parse(localStorage.getItem("steady-accounts") ?? "{}");
        } catch {
          return {};
        }
      })();
      if (a[Re.toLowerCase()]) {
        fe("That email is already in use.");
        return;
      }
      ((a[Re.toLowerCase()] = { passwordHash: await Wn(ze) }),
        localStorage.setItem("steady-accounts", JSON.stringify(a)),
        W == null || W(Re.toLowerCase()),
        _());
    },
    O = (a) => {
      const x = !Y.includes(a);
      (Z((K) => (x ? [...K, a] : K.filter((q) => q !== a))), a === "Light-sensitive" && x && ue(!0));
    },
    S = (a) => M((x) => (x.includes(a) ? x.filter((K) => K !== a) : [...x, a])),
    _ = () => {
      const a = {
        ...Cr,
        name: D.trim() || Cr.name,
        pronoun: R,
        avatar: j,
        sensory: Y,
        support: g,
        a11y: { ...Ki, language: C, fontSize: T, darkMode: ae, font: me ? "readable" : "standard" },
      };
      c(a);
    };
  return (
    ae ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark"),
    i.jsxs("div", {
      className: "min-h-screen flex flex-col",
      style: { backgroundColor: "var(--background)", fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" },
      children: [
        v === 0 &&
          i.jsxs("div", {
            className: "flex-1 flex flex-col items-center justify-center px-8 text-center gap-6",
            children: [
              i.jsx("div", {
                className: "rounded-3xl flex items-center justify-center",
                style: { width: 96, height: 96, backgroundColor: "var(--green-bg)", border: "2px solid var(--border)" },
                children: i.jsx(Ao, { size: 56 }),
              }),
              i.jsxs("div", {
                children: [
                  i.jsx("h1", {
                    className: "text-foreground",
                    style: { fontFamily: "var(--app-font-heading, Nunito)", fontSize: "2rem", fontWeight: 800, marginBottom: 12 },
                    children: A.onboarding.welcome.title,
                  }),
                  i.jsx("p", {
                    className: "text-muted-foreground",
                    style: { fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 320 },
                    children: A.onboarding.welcome.subtitle,
                  }),
                ],
              }),
              i.jsx("button", {
                onClick: () => w(1),
                className: "w-full max-w-xs rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90",
                style: { fontWeight: 700, fontSize: "1.05rem", transition: "opacity 0.15s" },
                children: A.onboarding.welcome.start,
              }),
              !f &&
                i.jsxs(i.Fragment, {
                  children: [
                    i.jsxs("div", {
                      className: "flex items-center gap-3 w-full max-w-xs",
                      children: [
                        i.jsx("div", { className: "flex-1 h-px", style: { backgroundColor: "var(--border)" } }),
                        i.jsx("span", { className: "text-muted-foreground", style: { fontSize: "0.75rem" }, children: "or" }),
                        i.jsx("div", { className: "flex-1 h-px", style: { backgroundColor: "var(--border)" } }),
                      ],
                    }),
                    i.jsx("button", {
                      onClick: k,
                      className: "text-muted-foreground hover:text-foreground",
                      style: { fontSize: "0.88rem", transition: "color 0.15s" },
                      children: A.onboarding.welcome.returning,
                    }),
                  ],
                }),
            ],
          }),
        v >= 1 &&
          i.jsxs(i.Fragment, {
            children: [
              i.jsxs("div", {
                className: "px-6 pt-6 pb-2 flex items-center gap-3 max-w-lg mx-auto w-full",
                children: [
                  i.jsx("button", {
                    onClick: () => w((a) => Math.max(1, a - 1)),
                    className: "text-muted-foreground hover:text-foreground p-1",
                    style: { transition: "color 0.15s" },
                    children: i.jsx(zf, { size: 20 }),
                  }),
                  i.jsx("div", {
                    className: "flex-1 flex gap-1.5",
                    children: Array.from({ length: od }).map((a, x) =>
                      i.jsx(
                        "div",
                        {
                          className: "flex-1 rounded-full",
                          style: { height: 4, backgroundColor: x < v ? "var(--primary)" : "var(--surface-2)", transition: "background-color 0.3s" },
                        },
                        x,
                      ),
                    ),
                  }),
                  i.jsx("span", {
                    className: "text-muted-foreground",
                    style: { fontSize: "0.8rem", minWidth: 40, textAlign: "right" },
                    children: A.onboarding.stepOf(v, od),
                  }),
                ],
              }),
              i.jsxs("div", {
                className: "flex-1 flex flex-col px-6 py-4 max-w-lg mx-auto w-full",
                children: [
                  v === 1 &&
                    i.jsxs("div", {
                      className: "flex flex-col gap-5 flex-1",
                      children: [
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-2",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 },
                              children: A.onboarding.name.title,
                            }),
                            i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.95rem" }, children: A.onboarding.name.subtitle }),
                          ],
                        }),
                        i.jsx("input", {
                          type: "text",
                          value: D,
                          onChange: (a) => N(a.target.value),
                          placeholder: A.onboarding.name.namePlaceholder,
                          autoFocus: !0,
                          className:
                            "w-full rounded-2xl px-5 py-4 border border-border bg-card text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                          style: { fontSize: "1.1rem", transition: "border-color 0.15s" },
                        }),
                        i.jsxs("select", {
                          value: R,
                          onChange: (a) => E(a.target.value),
                          className:
                            "w-full rounded-2xl px-5 py-4 border border-border bg-card text-foreground outline-none focus:border-primary appearance-none",
                          style: {
                            fontSize: "1rem",
                            transition: "border-color 0.15s",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 16px center",
                            paddingRight: "3rem",
                          },
                          children: [
                            i.jsx("option", { value: "", children: A.onboarding.name.pronounPlaceholder }),
                            A.profile.pronounsOptions.map((a) => i.jsx("option", { value: a, children: a }, a)),
                          ],
                        }),
                      ],
                    }),
                  v === 2 &&
                    i.jsxs("div", {
                      className: "flex flex-col gap-5 flex-1",
                      children: [
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-2",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 },
                              children: A.onboarding.avatar.title,
                            }),
                            i.jsx("p", {
                              className: "text-muted-foreground",
                              style: { fontSize: "0.95rem" },
                              children: A.onboarding.avatar.subtitle,
                            }),
                          ],
                        }),
                        i.jsx("div", {
                          className: "rounded-2xl p-4 flex items-center justify-center border border-border bg-card",
                          style: { fontSize: "4rem", height: 100 },
                          children: j,
                        }),
                        i.jsx("div", {
                          className: "grid gap-3",
                          style: { gridTemplateColumns: "repeat(6, 1fr)" },
                          children: Rp.map((a) =>
                            i.jsx(
                              "button",
                              {
                                onClick: () => B(a),
                                className: "rounded-2xl flex items-center justify-center hover:scale-110",
                                style: {
                                  aspectRatio: "1",
                                  fontSize: "1.8rem",
                                  backgroundColor: j === a ? "var(--green-bg)" : "var(--surface-1)",
                                  border: j === a ? "2px solid var(--primary)" : "2px solid transparent",
                                  transition: "all 0.15s",
                                },
                                children: a,
                              },
                              a,
                            ),
                          ),
                        }),
                      ],
                    }),
                  v === 3 &&
                    i.jsxs("div", {
                      className: "flex flex-col gap-5 flex-1",
                      children: [
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-2",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 },
                              children: A.onboarding.language.title,
                            }),
                            i.jsx("p", {
                              className: "text-muted-foreground",
                              style: { fontSize: "0.95rem" },
                              children: A.onboarding.language.subtitle,
                            }),
                          ],
                        }),
                        i.jsx("div", {
                          className: "flex flex-col gap-3",
                          children: ["en", "da"].map((a) =>
                            i.jsxs(
                              "button",
                              {
                                onClick: () => F(a),
                                className: "flex items-center gap-4 rounded-2xl px-5 py-4 border-2 text-left hover:opacity-85",
                                style: {
                                  backgroundColor: C === a ? "var(--green-bg)" : "var(--card)",
                                  borderColor: C === a ? "var(--primary)" : "var(--border)",
                                  transition: "all 0.15s",
                                },
                                children: [
                                  i.jsx("span", { style: { fontSize: "2rem" }, children: a === "en" ? "🇬🇧" : "🇩🇰" }),
                                  i.jsxs("div", {
                                    children: [
                                      i.jsx("p", {
                                        className: "text-foreground",
                                        style: { fontWeight: 700 },
                                        children: a === "en" ? "English" : "Dansk",
                                      }),
                                      i.jsx("p", {
                                        className: "text-muted-foreground",
                                        style: { fontSize: "0.85rem" },
                                        children: a === "en" ? "English" : "Danish",
                                      }),
                                    ],
                                  }),
                                  C === a &&
                                    i.jsx("div", {
                                      className: "ml-auto rounded-full bg-primary flex items-center justify-center",
                                      style: { width: 24, height: 24 },
                                      children: i.jsx(Wo, { size: 14, color: "white" }),
                                    }),
                                ],
                              },
                              a,
                            ),
                          ),
                        }),
                      ],
                    }),
                  v === 4 &&
                    i.jsxs("div", {
                      className: "flex flex-col gap-5 flex-1",
                      children: [
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-2",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 },
                              children: A.onboarding.sensory.title,
                            }),
                            i.jsx("p", {
                              className: "text-muted-foreground",
                              style: { fontSize: "0.95rem" },
                              children: A.onboarding.sensory.subtitle,
                            }),
                          ],
                        }),
                        i.jsx("div", {
                          className: "flex flex-col gap-2",
                          children: Ip.map((a) => {
                            var q;
                            const x = Y.includes(a.key),
                              K = ((q = A.profile.sensory.options.find((te) => te.key === a.key)) == null ? void 0 : q.label) ?? a.key;
                            return i.jsxs(
                              "button",
                              {
                                onClick: () => O(a.key),
                                className: "flex items-center gap-4 rounded-2xl px-5 py-4 border-2 text-left hover:opacity-85",
                                style: {
                                  backgroundColor: x ? "var(--green-bg)" : "var(--card)",
                                  borderColor: x ? "var(--primary)" : "var(--border)",
                                  transition: "all 0.15s",
                                },
                                "aria-pressed": x,
                                children: [
                                  i.jsx("span", { style: { fontSize: "1.5rem", width: 32 }, children: a.emoji }),
                                  i.jsx("span", { className: "text-foreground flex-1", style: { fontWeight: x ? 700 : 500 }, children: K }),
                                  x &&
                                    i.jsx("div", {
                                      className: "rounded-full bg-primary flex items-center justify-center",
                                      style: { width: 24, height: 24, flexShrink: 0 },
                                      children: i.jsx(Wo, { size: 14, color: "white" }),
                                    }),
                                ],
                              },
                              a.key,
                            );
                          }),
                        }),
                      ],
                    }),
                  v === 5 &&
                    i.jsxs("div", {
                      className: "flex flex-col gap-5 flex-1",
                      children: [
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-2",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 },
                              children: A.onboarding.support.title,
                            }),
                            i.jsx("p", {
                              className: "text-muted-foreground",
                              style: { fontSize: "0.95rem" },
                              children: A.onboarding.support.subtitle,
                            }),
                          ],
                        }),
                        i.jsx("div", {
                          className: "flex flex-col gap-2",
                          children: Wp.map((a) => {
                            var q;
                            const x = g.includes(a.key),
                              K = ((q = A.profile.support.options.find((te) => te.key === a.key)) == null ? void 0 : q.label) ?? a.key;
                            return i.jsxs(
                              "button",
                              {
                                onClick: () => S(a.key),
                                className: "flex items-center gap-4 rounded-2xl px-5 py-4 border-2 text-left hover:opacity-85",
                                style: {
                                  backgroundColor: x ? "var(--purple-bg)" : "var(--card)",
                                  borderColor: x ? "var(--purple-vivid)" : "var(--border)",
                                  transition: "all 0.15s",
                                },
                                "aria-pressed": x,
                                children: [
                                  i.jsx("span", { style: { fontSize: "1.5rem", width: 32 }, children: a.emoji }),
                                  i.jsx("span", { className: "text-foreground flex-1", style: { fontWeight: x ? 700 : 500 }, children: K }),
                                  x &&
                                    i.jsx("div", {
                                      className: "rounded-full flex items-center justify-center",
                                      style: { width: 24, height: 24, backgroundColor: "var(--purple-vivid)", flexShrink: 0 },
                                      children: i.jsx(Wo, { size: 14, color: "white" }),
                                    }),
                                ],
                              },
                              a.key,
                            );
                          }),
                        }),
                      ],
                    }),
                  v === 6 &&
                    i.jsxs("div", {
                      className: "flex flex-col gap-5 flex-1",
                      children: [
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-2",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800 },
                              children: A.onboarding.setup.title,
                            }),
                            i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.95rem" }, children: A.onboarding.setup.subtitle }),
                          ],
                        }),
                        i.jsxs("div", {
                          className: "bg-card rounded-2xl p-5 border border-border space-y-4",
                          children: [
                            i.jsxs("div", {
                              children: [
                                i.jsx("p", { className: "text-foreground mb-3", style: { fontWeight: 700 }, children: A.onboarding.setup.textSize }),
                                i.jsx("div", {
                                  className: "flex gap-2",
                                  children: ["normal", "large", "xlarge"].map((a) => {
                                    const x = { normal: A.a11y.fontSize.normal, large: A.a11y.fontSize.large, xlarge: A.a11y.fontSize.xlarge };
                                    return i.jsx(
                                      "button",
                                      {
                                        onClick: () => le(a),
                                        className: "flex-1 rounded-xl py-3 border-2",
                                        style: {
                                          backgroundColor: T === a ? "var(--green-bg)" : "var(--surface-1)",
                                          borderColor: T === a ? "var(--primary)" : "transparent",
                                          color: "var(--foreground)",
                                          fontWeight: 600,
                                          fontSize: a === "normal" ? "13px" : a === "large" ? "15px" : "17px",
                                          whiteSpace: "nowrap",
                                          transition: "all 0.15s",
                                        },
                                        children: x[a],
                                      },
                                      a,
                                    );
                                  }),
                                }),
                              ],
                            }),
                            [
                              { label: A.onboarding.setup.darkMode, value: ae, set: ue },
                              { label: A.onboarding.setup.font, value: me, set: Ce },
                            ].map(({ label: a, value: x, set: K }) =>
                              i.jsxs(
                                "button",
                                {
                                  onClick: () => K(!x),
                                  className: "w-full flex items-center justify-between rounded-xl p-4 border-2",
                                  style: {
                                    backgroundColor: x ? "var(--green-bg)" : "var(--surface-1)",
                                    borderColor: x ? "var(--primary)" : "transparent",
                                    transition: "all 0.15s",
                                  },
                                  "aria-pressed": x,
                                  children: [
                                    i.jsx("span", { className: "text-foreground", style: { fontWeight: x ? 700 : 500 }, children: a }),
                                    i.jsx("div", {
                                      className: "rounded-full relative",
                                      style: { width: 44, height: 24, backgroundColor: x ? "var(--primary)" : "var(--muted-foreground)" },
                                      children: i.jsx("div", {
                                        className: "absolute top-1 rounded-full bg-white",
                                        style: { width: 16, height: 16, left: x ? 24 : 4, transition: "left 0.2s" },
                                      }),
                                    }),
                                  ],
                                },
                                a,
                              ),
                            ),
                          ],
                        }),
                      ],
                    }),
                  v === 7 &&
                    i.jsxs("div", {
                      className: "flex flex-col items-center text-center gap-6 flex-1 justify-center",
                      children: [
                        i.jsx("div", { style: { fontSize: "5rem", lineHeight: 1 }, children: j }),
                        i.jsxs("div", {
                          children: [
                            i.jsx("h2", {
                              className: "text-foreground mb-3",
                              style: { fontFamily: "var(--app-font-heading, Nunito)", fontWeight: 800, fontSize: "1.8rem" },
                              children: D ? `${A.onboarding.done.title.replace("!", "")} ${D}! ✨` : A.onboarding.done.title,
                            }),
                            i.jsx("p", {
                              className: "text-muted-foreground",
                              style: { fontSize: "1rem", lineHeight: 1.7 },
                              children: A.onboarding.done.subtitle,
                            }),
                          ],
                        }),
                        i.jsx("div", {
                          className: "w-full space-y-2",
                          children: [
                            D && `👋 ${D}${R ? ` (${R})` : ""}`,
                            C === "da" ? "🇩🇰 Dansk" : "🇬🇧 English",
                            Y.length > 0 && `🧠 ${Y.length} sensory note${Y.length > 1 ? "s" : ""}`,
                            g.length > 0 && `✨ ${g.length} support style${g.length > 1 ? "s" : ""}`,
                          ]
                            .filter(Boolean)
                            .map((a, x) =>
                              i.jsx(
                                "div",
                                {
                                  className: "rounded-xl px-4 py-2 text-left",
                                  style: { backgroundColor: "var(--surface-1)" },
                                  children: i.jsx("p", { className: "text-foreground", style: { fontSize: "0.9rem" }, children: a }),
                                },
                                x,
                              ),
                            ),
                        }),
                      ],
                    }),
                  i.jsx("div", {
                    className: "pt-6 pb-4 flex flex-col gap-3",
                    children:
                      v === 7
                        ? i.jsxs(i.Fragment, {
                            children: [
                              f &&
                                W &&
                                i.jsxs("div", {
                                  className: "rounded-2xl border border-border overflow-hidden",
                                  style: { backgroundColor: "var(--surface-1)" },
                                  children: [
                                    i.jsxs("button", {
                                      onClick: () => {
                                        (He((a) => !a), fe(""));
                                      },
                                      className: "w-full flex items-center justify-between px-4 py-3 text-left hover:opacity-85",
                                      style: { transition: "opacity 0.15s" },
                                      children: [
                                        i.jsxs("div", {
                                          children: [
                                            i.jsx("p", {
                                              className: "text-foreground",
                                              style: { fontWeight: 700, fontSize: "0.95rem" },
                                              children: "Save your setup",
                                            }),
                                            i.jsx("p", {
                                              className: "text-muted-foreground",
                                              style: { fontSize: "0.8rem" },
                                              children: "Create a free account to keep your data",
                                            }),
                                          ],
                                        }),
                                        i.jsx("span", {
                                          className: "text-muted-foreground",
                                          style: { fontSize: "1.2rem", lineHeight: 1 },
                                          children: de ? "−" : "+",
                                        }),
                                      ],
                                    }),
                                    de &&
                                      i.jsxs("div", {
                                        className: "px-4 pb-4 space-y-2.5 border-t border-border",
                                        style: { paddingTop: 12 },
                                        children: [
                                          i.jsx("input", {
                                            type: "email",
                                            value: Re,
                                            onChange: (a) => Ie(a.target.value),
                                            placeholder: "you@example.com",
                                            className:
                                              "w-full rounded-xl px-4 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                                            style: { fontSize: "0.9rem", transition: "border-color 0.15s" },
                                            autoComplete: "email",
                                          }),
                                          i.jsx("input", {
                                            type: "password",
                                            value: ze,
                                            onChange: (a) => Ne(a.target.value),
                                            onKeyDown: (a) => a.key === "Enter" && ce(),
                                            placeholder: "Password (6+ characters)",
                                            className:
                                              "w-full rounded-xl px-4 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                                            style: { fontSize: "0.9rem", transition: "border-color 0.15s" },
                                            autoComplete: "new-password",
                                          }),
                                          we &&
                                            i.jsx("p", {
                                              style: { color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 },
                                              children: we,
                                            }),
                                          i.jsx("button", {
                                            onClick: ce,
                                            className: "w-full rounded-xl py-3 bg-primary text-primary-foreground hover:opacity-90",
                                            style: { fontWeight: 700, fontSize: "0.95rem", transition: "opacity 0.15s" },
                                            children: "Create account & enter Steady",
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                              i.jsx("button", {
                                onClick: _,
                                className: "w-full rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90",
                                style: { fontWeight: 700, fontSize: "1.05rem", transition: "opacity 0.15s" },
                                children: A.onboarding.done.enter,
                              }),
                            ],
                          })
                        : i.jsxs(i.Fragment, {
                            children: [
                              i.jsxs("button", {
                                onClick: () => w((a) => a + 1),
                                className:
                                  "w-full flex items-center justify-center gap-2 rounded-2xl py-4 bg-primary text-primary-foreground hover:opacity-90",
                                style: { fontWeight: 700, fontSize: "1.05rem", transition: "opacity 0.15s" },
                                children: [A.onboarding.next, i.jsx(Pf, { size: 18 })],
                              }),
                              (v === 4 || v === 5) &&
                                i.jsx("button", {
                                  onClick: () => w((a) => a + 1),
                                  className: "text-muted-foreground hover:text-foreground text-center py-1",
                                  style: { fontSize: "0.9rem", transition: "color 0.15s" },
                                  children: v === 4 ? A.onboarding.sensory.skip : A.onboarding.support.skip,
                                }),
                            ],
                          }),
                  }),
                ],
              }),
            ],
          }),
      ],
    })
  );
}
function br({ children: c }) {
  return i.jsx("p", {
    style: { fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: 8 },
    children: c,
  });
}
function Ai({ label: c, description: k, value: f, onChange: W }) {
  return i.jsxs("button", {
    onClick: () => W(!f),
    className: "w-full flex items-center justify-between rounded-xl px-4 py-3 hover:opacity-85 border-2",
    style: {
      backgroundColor: f ? "var(--green-bg)" : "var(--surface-1)",
      borderColor: f ? "var(--primary)" : "transparent",
      transition: "all 0.15s",
    },
    "aria-pressed": f,
    children: [
      i.jsxs("div", {
        className: "flex-1 mr-4 text-left",
        children: [
          i.jsx("p", { className: "text-foreground", style: { fontWeight: 600 }, children: c }),
          k && i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.82rem" }, children: k }),
        ],
      }),
      i.jsx("div", {
        className: "flex-shrink-0 rounded-full relative",
        style: { width: 44, height: 24, backgroundColor: f ? "var(--primary)" : "var(--muted-foreground)" },
        children: i.jsx("div", {
          className: "absolute top-1 rounded-full bg-white",
          style: { width: 16, height: 16, left: f ? 24 : 4, transition: "left 0.2s" },
        }),
      }),
    ],
  });
}
function Ui({ label: c, options: k, value: f, onChange: W, stacked: v }) {
  const w = (C) =>
    i.jsx(
      "button",
      {
        onClick: () => W(C.value),
        className: `rounded-lg border-2 hover:opacity-85${v ? " w-full px-4 py-2.5 text-left" : " px-3 py-1.5"}`,
        style: {
          borderColor: f === C.value ? "var(--primary)" : "transparent",
          backgroundColor: f === C.value ? "var(--green-bg)" : "var(--surface-1)",
          color: f === C.value ? "var(--green-text)" : "var(--foreground)",
          fontWeight: f === C.value ? 700 : 500,
          fontSize: "14px",
          transition: "all 0.15s",
          whiteSpace: v ? "normal" : "nowrap",
        },
        "aria-pressed": f === C.value,
        children: C.label,
      },
      C.value,
    );
  return v
    ? i.jsxs("div", {
        className: "py-1 space-y-1.5",
        children: [
          i.jsx("span", { className: "text-foreground", style: { fontWeight: 600, display: "block", marginBottom: 6 }, children: c }),
          k.map(w),
        ],
      })
    : i.jsxs("div", {
        className: "flex items-center justify-between gap-x-3 gap-y-2 py-1 flex-wrap",
        children: [
          i.jsx("span", { className: "text-foreground", style: { fontWeight: 600 }, children: c }),
          i.jsx("div", { className: "flex gap-1.5", children: k.map(w) }),
        ],
      });
}
function $i() {
  try {
    return JSON.parse(localStorage.getItem("steady-accounts") ?? "{}");
  } catch {
    return {};
  }
}
function Bi(c) {
  localStorage.setItem("steady-accounts", JSON.stringify(c));
}
function Hp({ auth: c, onSignOut: k, onAuthUpdate: f }) {
  const v = vt().account,
    [w, C] = I.useState(!1),
    [F, D] = I.useState(!1),
    [N, R] = I.useState(""),
    [E, j] = I.useState(""),
    [B, Y] = I.useState(""),
    [Z, g] = I.useState(!1),
    [M, T] = I.useState(""),
    [le, ae] = I.useState(""),
    [ue, me] = I.useState(""),
    [Ce, A] = I.useState(""),
    [de, He] = I.useState(!1),
    Re = !c || c.isGuest,
    Ie = async () => {
      if ((Y(""), !N.trim())) {
        Y(v.emailRequired);
        return;
      }
      const G = $i(),
        ne = G[c.email];
      if (!ne || ne.passwordHash !== (await Wn(E))) {
        Y(v.wrongPassword);
        return;
      }
      if (G[N.toLowerCase()] && N.toLowerCase() !== c.email) {
        Y(v.emailInUse);
        return;
      }
      ((G[N.toLowerCase()] = ne),
        N.toLowerCase() !== c.email && delete G[c.email],
        Bi(G),
        f(N.toLowerCase()),
        C(!1),
        R(""),
        j(""),
        g(!0),
        setTimeout(() => g(!1), 2500));
    },
    ze = async () => {
      A("");
      const G = $i(),
        ne = G[c.email];
      if (!ne || ne.passwordHash !== (await Wn(M))) {
        A(v.wrongPassword);
        return;
      }
      if (le.length < 6) {
        A(v.passwordTooShort);
        return;
      }
      if (le !== ue) {
        A(v.passwordsNoMatch);
        return;
      }
      ((G[c.email] = { passwordHash: await Wn(le) }), Bi(G), D(!1), T(""), ae(""), me(""), He(!0), setTimeout(() => He(!1), 2500));
    },
    Ne =
      "w-full rounded-xl px-4 py-2.5 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
    we = { fontSize: "0.9rem", transition: "border-color 0.15s" },
    [fe, ce] = I.useState(""),
    [O, S] = I.useState(""),
    [_, a] = I.useState(""),
    [x, K] = I.useState(!1),
    [q, te] = I.useState(""),
    oe = async () => {
      if ((te(""), !fe.trim())) {
        te(v.emailRequired);
        return;
      }
      if (O.length < 6) {
        te(v.passwordTooShort);
        return;
      }
      if (O !== _) {
        te(v.passwordsNoMatch);
        return;
      }
      const G = $i();
      if (G[fe.toLowerCase()]) {
        te(v.emailInUse);
        return;
      }
      ((G[fe.toLowerCase()] = { passwordHash: await Wn(O) }), Bi(G), f(fe.toLowerCase()));
    };
  return Re
    ? i.jsxs("div", {
        className: "space-y-3",
        children: [
          i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.88rem" }, children: v.guestNote }),
          i.jsxs("div", {
            children: [
              i.jsx("label", {
                style: { display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" },
                children: v.emailLabel,
              }),
              i.jsx("input", {
                type: "email",
                value: fe,
                onChange: (G) => ce(G.target.value),
                placeholder: "you@example.com",
                className: Ne,
                style: we,
                autoComplete: "email",
              }),
            ],
          }),
          i.jsxs("div", {
            children: [
              i.jsx("label", {
                style: { display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" },
                children: v.newPasswordLabel,
              }),
              i.jsxs("div", {
                className: "relative",
                children: [
                  i.jsx("input", {
                    type: x ? "text" : "password",
                    value: O,
                    onChange: (G) => S(G.target.value),
                    placeholder: "At least 6 characters",
                    className: Ne,
                    style: { ...we, paddingRight: "2.5rem" },
                    autoComplete: "new-password",
                  }),
                  i.jsx("button", {
                    type: "button",
                    onClick: () => K((G) => !G),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                    "aria-label": x ? "Hide password" : "Show password",
                    children: x ? i.jsx(id, { size: 15 }) : i.jsx(sd, { size: 15 }),
                  }),
                ],
              }),
            ],
          }),
          i.jsxs("div", {
            children: [
              i.jsx("label", {
                style: { display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" },
                children: v.confirmNewPasswordLabel,
              }),
              i.jsx("input", {
                type: x ? "text" : "password",
                value: _,
                onChange: (G) => a(G.target.value),
                placeholder: "Repeat your password",
                className: Ne,
                style: we,
                autoComplete: "new-password",
              }),
            ],
          }),
          q &&
            i.jsx("p", {
              role: "alert",
              className: "rounded-xl px-3 py-2",
              style: { backgroundColor: "rgba(192,57,43,0.1)", color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 },
              children: q,
            }),
          i.jsxs("div", {
            className: "flex gap-2",
            children: [
              i.jsx("button", {
                onClick: oe,
                className: "flex-1 rounded-xl px-4 py-3 bg-primary text-primary-foreground hover:opacity-90 text-center",
                style: { fontWeight: 700, transition: "opacity 0.15s" },
                children: v.createAccount,
              }),
              i.jsx("button", {
                onClick: k,
                className: "flex-1 rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-center",
                style: { fontWeight: 600, transition: "background-color 0.15s" },
                children: v.signOut,
              }),
            ],
          }),
        ],
      })
    : i.jsxs("div", {
        className: "space-y-3",
        children: [
          i.jsxs("div", {
            className: "rounded-xl px-4 py-3",
            style: { backgroundColor: "var(--surface-1)" },
            children: [
              i.jsx("p", {
                className: "text-muted-foreground",
                style: { fontSize: "0.78rem", fontWeight: 600, marginBottom: 2 },
                children: v.emailLabel,
              }),
              i.jsx("p", { className: "text-foreground", style: { fontWeight: 600 }, children: c.email }),
            ],
          }),
          i.jsxs("div", {
            className: "rounded-xl border border-border overflow-hidden",
            children: [
              i.jsxs("button", {
                onClick: () => {
                  (C((G) => !G), Y(""));
                },
                className: "w-full flex items-center justify-between px-4 py-3 hover:bg-muted text-left",
                style: { transition: "background-color 0.15s" },
                children: [
                  i.jsx("span", { className: "text-foreground", style: { fontWeight: 600 }, children: Z ? v.saved : v.changeEmail }),
                  w ? i.jsx(Ho, { size: 16, className: "text-muted-foreground" }) : i.jsx(Fo, { size: 16, className: "text-muted-foreground" }),
                ],
              }),
              w &&
                i.jsxs("div", {
                  className: "px-4 pb-4 space-y-3 border-t border-border",
                  style: { paddingTop: 12 },
                  children: [
                    i.jsxs("div", {
                      children: [
                        i.jsx("label", {
                          style: { display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" },
                          children: v.newEmailLabel,
                        }),
                        i.jsx("input", {
                          type: "email",
                          value: N,
                          onChange: (G) => R(G.target.value),
                          placeholder: v.newEmailPlaceholder,
                          className: Ne,
                          style: we,
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      children: [
                        i.jsx("label", {
                          style: { display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" },
                          children: v.verifyPasswordLabel,
                        }),
                        i.jsx("input", {
                          type: "password",
                          value: E,
                          onChange: (G) => j(G.target.value),
                          placeholder: "••••••",
                          className: Ne,
                          style: we,
                          autoComplete: "current-password",
                        }),
                      ],
                    }),
                    B && i.jsx("p", { role: "alert", style: { color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 }, children: B }),
                    i.jsxs("div", {
                      className: "flex gap-2",
                      children: [
                        i.jsx("button", {
                          onClick: Ie,
                          className: "rounded-xl px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90",
                          style: { fontWeight: 700, fontSize: "0.88rem", transition: "opacity 0.15s" },
                          children: v.save,
                        }),
                        i.jsx("button", {
                          onClick: () => C(!1),
                          className: "rounded-xl px-4 py-2.5 border border-border text-foreground hover:bg-muted",
                          style: { fontWeight: 600, fontSize: "0.88rem", transition: "background-color 0.15s" },
                          children: v.cancel,
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
          i.jsxs("div", {
            className: "rounded-xl border border-border overflow-hidden",
            children: [
              i.jsxs("button", {
                onClick: () => {
                  (D((G) => !G), A(""));
                },
                className: "w-full flex items-center justify-between px-4 py-3 hover:bg-muted text-left",
                style: { transition: "background-color 0.15s" },
                children: [
                  i.jsx("span", { className: "text-foreground", style: { fontWeight: 600 }, children: de ? v.saved : v.changePassword }),
                  F ? i.jsx(Ho, { size: 16, className: "text-muted-foreground" }) : i.jsx(Fo, { size: 16, className: "text-muted-foreground" }),
                ],
              }),
              F &&
                i.jsxs("div", {
                  className: "px-4 pb-4 space-y-3 border-t border-border",
                  style: { paddingTop: 12 },
                  children: [
                    [
                      { label: v.currentPasswordLabel, value: M, set: T, autocomplete: "current-password" },
                      { label: v.newPasswordLabel, value: le, set: ae, autocomplete: "new-password" },
                      { label: v.confirmNewPasswordLabel, value: ue, set: me, autocomplete: "new-password" },
                    ].map(({ label: G, value: ne, set: ge, autocomplete: Ve }) =>
                      i.jsxs(
                        "div",
                        {
                          children: [
                            i.jsx("label", {
                              style: { display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 5, color: "var(--foreground)" },
                              children: G,
                            }),
                            i.jsx("input", {
                              type: "password",
                              value: ne,
                              onChange: (fn) => ge(fn.target.value),
                              placeholder: "••••••",
                              className: Ne,
                              style: we,
                              autoComplete: Ve,
                            }),
                          ],
                        },
                        G,
                      ),
                    ),
                    Ce && i.jsx("p", { role: "alert", style: { color: "var(--destructive)", fontSize: "0.82rem", fontWeight: 600 }, children: Ce }),
                    i.jsxs("div", {
                      className: "flex gap-2",
                      children: [
                        i.jsx("button", {
                          onClick: ze,
                          className: "rounded-xl px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90",
                          style: { fontWeight: 700, fontSize: "0.88rem", transition: "opacity 0.15s" },
                          children: v.save,
                        }),
                        i.jsx("button", {
                          onClick: () => D(!1),
                          className: "rounded-xl px-4 py-2.5 border border-border text-foreground hover:bg-muted",
                          style: { fontWeight: 600, fontSize: "0.88rem", transition: "background-color 0.15s" },
                          children: v.cancel,
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
          i.jsx("button", {
            onClick: k,
            className: "w-full rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-center",
            style: { fontWeight: 600, transition: "background-color 0.15s" },
            children: v.signOut,
          }),
        ],
      });
}
function Ap({ settings: c, onChange: k, onClose: f, onResetOnboarding: W, onClearData: v, auth: w, onSignOut: C, onAuthUpdate: F }) {
  const N = vt().settings,
    [R, E] = I.useState(!1),
    [j, B] = I.useState(!1),
    [Y, Z] = I.useState(!1),
    g = (T) => k({ ...c, ...T }),
    M = () => {
      (v(), E(!1), B(!0));
    };
  return i.jsxs("div", {
    className: "space-y-6",
    children: [
      i.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          i.jsx("h2", { className: "text-foreground", style: { fontFamily: "var(--app-font-heading, Nunito)" }, children: N.title }),
          i.jsx("button", {
            onClick: f,
            className: "rounded-xl p-2 hover:bg-muted",
            style: { transition: "background-color 0.15s" },
            "aria-label": "Close settings",
            children: i.jsx(cn, { size: 20, className: "text-foreground" }),
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border space-y-3",
        children: [i.jsx(br, { children: N.sections.account }), i.jsx(Hp, { auth: w, onSignOut: C, onAuthUpdate: F })],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border space-y-3",
        children: [
          i.jsx(br, { children: N.sections.appearance }),
          i.jsx(Ai, { label: N.darkMode.label, description: N.darkMode.description, value: c.darkMode, onChange: (T) => g({ darkMode: T }) }),
          i.jsx(Ui, {
            label: N.fontSize.label,
            value: c.fontSize,
            onChange: (T) => g({ fontSize: T }),
            options: [
              { value: "normal", label: N.fontSize.normal },
              { value: "large", label: N.fontSize.large },
              { value: "xlarge", label: N.fontSize.xlarge },
            ],
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border space-y-3",
        children: [
          i.jsx(br, { children: N.sections.readability }),
          i.jsx(Ui, {
            label: N.font.label,
            value: c.font,
            onChange: (T) => g({ font: T }),
            options: [
              { value: "standard", label: N.font.standard },
              { value: "readable", label: N.font.readable },
            ],
            stacked: !0,
          }),
          i.jsx(Ui, {
            label: N.lineSpacing.label,
            value: c.lineSpacing,
            onChange: (T) => g({ lineSpacing: T }),
            options: [
              { value: "normal", label: N.lineSpacing.normal },
              { value: "spacious", label: N.lineSpacing.spacious },
            ],
          }),
          i.jsx(Ai, {
            label: N.reduceMotion.label,
            description: N.reduceMotion.description,
            value: c.reduceMotion,
            onChange: (T) => g({ reduceMotion: T }),
          }),
          i.jsx(Ai, {
            label: N.highContrast.label,
            description: N.highContrast.description,
            value: c.highContrast,
            onChange: (T) => g({ highContrast: T }),
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border space-y-3",
        children: [
          i.jsx(br, { children: N.sections.language }),
          i.jsx("div", {
            className: "flex flex-wrap gap-3",
            children: ["en", "da"].map((T) =>
              i.jsxs(
                "button",
                {
                  onClick: () => g({ language: T }),
                  className: "flex items-center gap-3 rounded-xl px-4 py-3 border-2 hover:opacity-85",
                  style: {
                    borderColor: c.language === T ? "var(--primary)" : "var(--border)",
                    backgroundColor: c.language === T ? "var(--green-bg)" : "var(--surface-1)",
                    transition: "all 0.15s",
                  },
                  "aria-pressed": c.language === T,
                  children: [
                    i.jsx("span", { style: { fontSize: "1.4rem" }, children: T === "en" ? "🇬🇧" : "🇩🇰" }),
                    i.jsx("span", {
                      className: "text-foreground",
                      style: { fontWeight: c.language === T ? 700 : 500 },
                      children: T === "en" ? "English" : "Dansk",
                    }),
                  ],
                },
                T,
              ),
            ),
          }),
        ],
      }),
      i.jsxs("div", {
        className: "steady-card bg-card rounded-2xl p-5 border border-border space-y-3",
        children: [
          i.jsx(br, { children: N.sections.data }),
          i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.85rem", lineHeight: 1.6 }, children: N.privacy }),
          i.jsxs("button", {
            onClick: () => Z(!0),
            className: "text-left hover:opacity-70",
            style: { color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600, transition: "opacity 0.15s" },
            children: [N.privacyLink, " →"],
          }),
          !R &&
            !j &&
            i.jsxs("div", {
              className: "flex gap-2",
              children: [
                i.jsx("button", {
                  onClick: W,
                  className: "flex-1 rounded-xl px-4 py-3 border border-border text-foreground hover:bg-muted text-center",
                  style: { fontWeight: 600, transition: "background-color 0.15s" },
                  children: N.resetOnboarding,
                }),
                i.jsx("button", {
                  onClick: () => E(!0),
                  className: "flex-1 rounded-xl px-4 py-3 text-center hover:opacity-85",
                  style: {
                    backgroundColor: "var(--destructive)",
                    color: "white",
                    fontWeight: 600,
                    transition: "opacity 0.15s",
                    borderRadius: "0.75rem",
                  },
                  children: N.clearData,
                }),
              ],
            }),
          R &&
            i.jsxs("div", {
              className: "rounded-xl p-4 border-2",
              style: { borderColor: "var(--destructive)", backgroundColor: "var(--surface-1)" },
              children: [
                i.jsx("p", { className: "text-foreground mb-3", style: { fontSize: "0.9rem" }, children: N.clearConfirm }),
                i.jsxs("div", {
                  className: "flex gap-2",
                  children: [
                    i.jsx("button", {
                      onClick: M,
                      className: "rounded-xl px-5 py-2 text-white hover:opacity-85",
                      style: { backgroundColor: "var(--destructive)", fontWeight: 700, transition: "opacity 0.15s" },
                      children: N.clearYes,
                    }),
                    i.jsx("button", {
                      onClick: () => E(!1),
                      className: "rounded-xl px-5 py-2 border border-border text-foreground hover:bg-muted",
                      style: { fontWeight: 600, transition: "background-color 0.15s" },
                      children: N.clearNo,
                    }),
                  ],
                }),
              ],
            }),
          j && i.jsx("p", { className: "text-primary text-center", style: { fontWeight: 600 }, children: N.dataCleared }),
        ],
      }),
      Y &&
        i.jsx("div", {
          className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4",
          style: { backgroundColor: "rgba(0,0,0,0.45)" },
          onClick: (T) => {
            T.target === T.currentTarget && Z(!1);
          },
          children: i.jsxs("div", {
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "privacy-dialog-title",
            className: "w-full max-w-lg rounded-2xl border border-border flex flex-col",
            style: { backgroundColor: "var(--card)", maxHeight: "85vh" },
            children: [
              i.jsxs("div", {
                className: "flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0",
                children: [
                  i.jsxs("div", {
                    children: [
                      i.jsx("h3", {
                        id: "privacy-dialog-title",
                        className: "text-foreground",
                        style: { fontFamily: "var(--app-font-heading, Nunito)" },
                        children: N.privacyPolicy.title,
                      }),
                      i.jsx("p", {
                        className: "text-muted-foreground",
                        style: { fontSize: "0.78rem", marginTop: 2 },
                        children: N.privacyPolicy.lastUpdated,
                      }),
                    ],
                  }),
                  i.jsx("button", {
                    onClick: () => Z(!1),
                    className: "rounded-xl p-2 hover:bg-muted",
                    style: { transition: "background-color 0.15s" },
                    "aria-label": "Close privacy policy",
                    children: i.jsx(cn, { size: 20, className: "text-foreground" }),
                  }),
                ],
              }),
              i.jsx("div", {
                className: "overflow-y-auto px-6 py-5 space-y-5",
                children: N.privacyPolicy.sections.map((T) =>
                  i.jsxs(
                    "div",
                    {
                      children: [
                        i.jsx("p", { className: "text-foreground mb-1", style: { fontWeight: 700, fontSize: "0.9rem" }, children: T.heading }),
                        i.jsx("p", { className: "text-muted-foreground", style: { fontSize: "0.875rem", lineHeight: 1.7 }, children: T.body }),
                      ],
                    },
                    T.heading,
                  ),
                ),
              }),
            ],
          }),
        }),
    ],
  });
}
const Up = () =>
    i.jsxs("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: { flexShrink: 0 },
      children: [
        i.jsx("path", {
          d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
          fill: "#4285F4",
        }),
        i.jsx("path", {
          d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
          fill: "#34A853",
        }),
        i.jsx("path", {
          d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z",
          fill: "#FBBC05",
        }),
        i.jsx("path", {
          d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
          fill: "#EA4335",
        }),
      ],
    }),
  $p = () =>
    i.jsx("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      "aria-hidden": "true",
      style: { flexShrink: 0 },
      children: i.jsx("path", {
        d: "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.32.07 2.23.73 2.99.78.93-.19 1.82-.83 3.24-.79 1.76.06 3.08.8 3.93 2.02-3.46 2.06-2.87 6.63.39 8.09-.61 1.41-1.4 2.77-2.55 3.78zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z",
      }),
    });
function Bp() {
  try {
    return JSON.parse(localStorage.getItem("steady-accounts") ?? "{}");
  } catch {
    return {};
  }
}
function Vp(c) {
  localStorage.setItem("steady-accounts", JSON.stringify(c));
}
function Qp({ onAuth: c }) {
  const k = Uo.en.auth,
    [f, W] = I.useState("signup"),
    [v, w] = I.useState(""),
    [C, F] = I.useState(""),
    [D, N] = I.useState(""),
    [R, E] = I.useState(!1),
    [j, B] = I.useState(""),
    Y = (g) => {
      (W(g), B(""));
    },
    Z = async () => {
      if ((B(""), !v.trim())) {
        B(k.emailRequired);
        return;
      }
      if (C.length < 6) {
        B(k.passwordTooShort);
        return;
      }
      const g = Bp(),
        M = await Wn(C);
      if (f === "signup") {
        if (D !== C) {
          B(k.passwordsNoMatch);
          return;
        }
        if (g[v.toLowerCase()]) {
          B(k.emailInUse);
          return;
        }
        ((g[v.toLowerCase()] = { passwordHash: M }), Vp(g), c({ email: v.toLowerCase(), isGuest: !1 }));
      } else {
        const T = g[v.toLowerCase()];
        if (!T || T.passwordHash !== M) {
          B(k.invalidCredentials);
          return;
        }
        c({ email: v.toLowerCase(), isGuest: !1 });
      }
    };
  return i.jsxs("div", {
    className: "min-h-screen flex flex-col items-center justify-center px-5 py-12",
    style: { backgroundColor: "var(--background)", fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" },
    children: [
      i.jsxs("div", {
        className: "flex items-center gap-3 mb-8",
        children: [
          i.jsx("div", {
            className: "rounded-2xl flex items-center justify-center flex-shrink-0",
            style: { width: 52, height: 52, backgroundColor: "var(--green-bg)", border: "2px solid var(--border)" },
            children: i.jsx(Ao, { size: 34 }),
          }),
          i.jsx("span", {
            style: {
              fontFamily: "var(--app-font-heading, Nunito)",
              fontWeight: 800,
              fontSize: "2rem",
              color: "var(--primary)",
              letterSpacing: "-0.02em",
            },
            children: "Steady",
          }),
        ],
      }),
      i.jsxs("div", {
        className: "w-full max-w-sm rounded-3xl p-7 border border-border steady-card space-y-5",
        style: { backgroundColor: "var(--card)" },
        children: [
          i.jsx("div", {
            className: "flex rounded-2xl overflow-hidden border border-border",
            style: { backgroundColor: "var(--surface-1)" },
            children: ["signup", "login"].map((g) =>
              i.jsx(
                "button",
                {
                  onClick: () => Y(g),
                  className: "flex-1 py-2.5",
                  style: {
                    fontWeight: f === g ? 700 : 500,
                    backgroundColor: f === g ? "var(--primary)" : "transparent",
                    color: f === g ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    fontSize: "0.92rem",
                    transition: "all 0.15s",
                    fontFamily: "var(--app-font-heading, Nunito)",
                  },
                  children: g === "signup" ? k.signUp : k.logIn,
                },
                g,
              ),
            ),
          }),
          i.jsxs("div", {
            children: [
              i.jsx("label", {
                style: { display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: 6, color: "var(--foreground)" },
                children: k.emailLabel,
              }),
              i.jsx("input", {
                type: "email",
                value: v,
                onChange: (g) => w(g.target.value),
                onKeyDown: (g) => g.key === "Enter" && Z(),
                placeholder: k.emailPlaceholder,
                autoComplete: "email",
                className:
                  "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                style: { transition: "border-color 0.15s" },
              }),
            ],
          }),
          i.jsxs("div", {
            children: [
              i.jsx("label", {
                style: { display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: 6, color: "var(--foreground)" },
                children: k.passwordLabel,
              }),
              i.jsxs("div", {
                className: "relative",
                children: [
                  i.jsx("input", {
                    type: R ? "text" : "password",
                    value: C,
                    onChange: (g) => F(g.target.value),
                    onKeyDown: (g) => g.key === "Enter" && Z(),
                    placeholder: k.passwordPlaceholder,
                    autoComplete: f === "signup" ? "new-password" : "current-password",
                    className:
                      "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                    style: { paddingRight: "2.75rem", transition: "border-color 0.15s" },
                  }),
                  i.jsx("button", {
                    type: "button",
                    onClick: () => E((g) => !g),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                    style: { transition: "color 0.15s" },
                    "aria-label": R ? "Hide password" : "Show password",
                    children: R ? i.jsx(id, { size: 17 }) : i.jsx(sd, { size: 17 }),
                  }),
                ],
              }),
            ],
          }),
          f === "signup" &&
            i.jsxs("div", {
              children: [
                i.jsx("label", {
                  style: { display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: 6, color: "var(--foreground)" },
                  children: k.confirmPasswordLabel,
                }),
                i.jsx("input", {
                  type: R ? "text" : "password",
                  value: D,
                  onChange: (g) => N(g.target.value),
                  onKeyDown: (g) => g.key === "Enter" && Z(),
                  placeholder: k.confirmPasswordPlaceholder,
                  autoComplete: "new-password",
                  className:
                    "w-full rounded-xl px-4 py-3 border border-border bg-input-background text-foreground placeholder:text-muted-foreground outline-none focus:border-primary",
                  style: { transition: "border-color 0.15s" },
                }),
              ],
            }),
          j &&
            i.jsx("p", {
              role: "alert",
              className: "rounded-xl px-4 py-2.5",
              style: { backgroundColor: "rgba(192,57,43,0.1)", color: "var(--destructive)", fontSize: "0.88rem", fontWeight: 600 },
              children: j,
            }),
          i.jsx("button", {
            onClick: Z,
            className: "w-full rounded-2xl py-3.5 bg-primary text-primary-foreground hover:opacity-90",
            style: { fontWeight: 700, fontSize: "1rem", transition: "opacity 0.15s" },
            children: f === "signup" ? k.createAccount : k.logIn,
          }),
          i.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              i.jsx("div", { className: "flex-1 h-px", style: { backgroundColor: "var(--border)" } }),
              i.jsx("span", { className: "text-muted-foreground", style: { fontSize: "0.8rem" }, children: "or" }),
              i.jsx("div", { className: "flex-1 h-px", style: { backgroundColor: "var(--border)" } }),
            ],
          }),
          i.jsxs("div", {
            className: "space-y-2.5",
            children: [
              i.jsxs("button", {
                onClick: () => alert(k.socialComingSoon),
                className: "w-full flex items-center justify-center gap-3 rounded-2xl py-3 border hover:opacity-85",
                style: {
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  transition: "opacity 0.15s",
                },
                children: [i.jsx(Up, {}), k.continueWithGoogle],
              }),
              i.jsxs("button", {
                onClick: () => alert(k.socialComingSoon),
                className: "w-full flex items-center justify-center gap-3 rounded-2xl py-3 hover:opacity-85",
                style: {
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  transition: "opacity 0.15s",
                },
                children: [i.jsx($p, {}), k.continueWithApple],
              }),
            ],
          }),
          i.jsx("button", {
            onClick: () => c({ email: "", isGuest: !0 }),
            className: "w-full text-center hover:text-foreground",
            style: { fontSize: "0.88rem", color: "var(--muted-foreground)", transition: "color 0.15s" },
            children: k.continueAsGuest,
          }),
        ],
      }),
      i.jsx("p", {
        className: "text-muted-foreground mt-6 text-center",
        style: { fontSize: "0.76rem", maxWidth: 300, lineHeight: 1.6 },
        children: k.localDataNote,
      }),
    ],
  });
}
function Gp() {
  const [c, k] = Ye("steady-auth-state", null),
    [f, W] = I.useState(() => new URLSearchParams(window.location.search).has("start")),
    [v, w] = Ye("steady-onboarded", !1),
    [C, F] = Ye("steady-active-tab", "overview"),
    [D, N] = I.useState(!1),
    [R, E] = Ye("steady-profile", Cr),
    [j, B] = Ye("steady-profile-photo", null),
    [Y, Z] = Ye("steady-tasks", []),
    [g, M] = Ye("steady-task-nextid", 1),
    [T, le] = I.useState(0),
    [ae, ue] = I.useState(0),
    [me, Ce] = I.useState(0);
  I.useEffect(() => {
    try {
      const S = localStorage.getItem("steady-habits-v2");
      if (!S) return;
      const _ = JSON.parse(S);
      if (!Array.isArray(_)) return;
      (le(_.filter((a) => a.doneToday).length), ue(_.length), Ce(_.length > 0 ? Math.max(..._.map((a) => a.streak)) : 0));
    } catch {}
  }, [C]);
  const A = { ...Cr, ...R, a11y: { ...Ki, ...(R.a11y ?? {}) } },
    de = Uo[A.a11y.language ?? "en"];
  (I.useEffect(() => {
    (!R.sensory || !R.support || !R.a11y) && E(A);
  }, []),
    I.useEffect(() => {
      const S = document.documentElement,
        _ = A.a11y,
        a = { normal: "17px", large: "20px", xlarge: "24px" };
      S.style.setProperty("--font-size", a[_.fontSize]);
      const x = _.font === "readable";
      (S.style.setProperty("--app-font-body", x ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito Sans', 'Nunito', sans-serif"),
        S.style.setProperty("--app-font-heading", x ? "'Atkinson Hyperlegible', sans-serif" : "'Nunito', sans-serif"),
        S.style.setProperty("--app-line-height", _.lineSpacing === "spacious" ? "1.9" : "1.5"),
        (document.documentElement.lang = _.language ?? "en"),
        S.classList.toggle("reduce-motion", _.reduceMotion),
        S.classList.toggle("dark", _.darkMode),
        _.highContrast
          ? (S.style.setProperty("--foreground", _.darkMode ? "#FFFFFF" : "#111111"),
            S.style.setProperty("--muted-foreground", _.darkMode ? "#CCCCCC" : "#444444"),
            S.style.setProperty("--border", _.darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"))
          : (S.style.removeProperty("--foreground"), S.style.removeProperty("--muted-foreground"), S.style.removeProperty("--border")));
    }, [A.a11y]));
  const He = () => {
      k(null);
    },
    Re = (S) => {
      k({ email: S, isGuest: !1 });
    },
    Ie = () => {
      (Z([]),
        M(1),
        localStorage.setItem("steady-habits-v2", JSON.stringify([])),
        localStorage.setItem("steady-mood-history", JSON.stringify([])),
        localStorage.setItem("steady-notes", JSON.stringify([])),
        localStorage.setItem("steady-notes-nextid", JSON.stringify(1)),
        localStorage.setItem("steady-routines-done", JSON.stringify([])),
        localStorage.setItem("steady-routines-custom", JSON.stringify({ morning: [], afternoon: [], evening: [] })),
        localStorage.setItem("steady-routines-nextid", JSON.stringify(100)));
    },
    ze = (S) => {
      (E(S), Ie(), w(!0));
    };
  if (!c || f)
    return i.jsx(Qp, {
      onAuth: (S) => {
        (k(S), f && (W(!1), window.history.replaceState({}, "", window.location.pathname)));
      },
    });
  if (!v)
    return i.jsxs(Vi.Provider, {
      value: de,
      children: [
        i.jsx("style", {
          children:
            ".reduce-motion * { transition: none !important; animation: none !important; } body { line-height: var(--app-line-height, 1.5); }",
        }),
        i.jsx(Fp, { onComplete: ze, onSkip: () => w(!0), isGuest: c.isGuest, onRegister: (S) => k({ email: S, isGuest: !1 }) }),
      ],
    });
  const Ne = Y.filter((S) => !S.done).length,
    we = [
      { key: "overview", label: de.nav.overview, icon: Qf },
      { key: "tasks", label: de.nav.tasks, icon: Af },
      { key: "routines", label: de.nav.routines, icon: rp },
      { key: "habits", label: de.nav.habits, icon: ad },
      { key: "focus", label: de.nav.focus, icon: pp },
      { key: "note", label: de.nav.note, icon: Jf },
      { key: "profile", label: de.nav.profile, icon: Ff },
    ],
    fe = () =>
      i.jsx("button", {
        onClick: () => {
          (F("profile"), N(!1));
        },
        className: "rounded-full flex items-center justify-center overflow-hidden hover:opacity-80",
        style: {
          width: 44,
          height: 44,
          backgroundColor: j ? "transparent" : "var(--green-bg)",
          border: "2px solid var(--primary)",
          flexShrink: 0,
          transition: "opacity 0.15s",
        },
        "aria-label": "Open profile",
        children: j
          ? i.jsx("img", { src: j, alt: "Your profile", style: { width: "100%", height: "100%", objectFit: "cover" } })
          : i.jsx("span", { style: { fontSize: "1.3rem", lineHeight: 1 }, children: A.avatar }),
      }),
    ce = (() => {
      const S = new Date().getHours(),
        _ = S < 12 ? de.greeting.morning : S < 17 ? de.greeting.afternoon : de.greeting.evening;
      return A.name ? `${_}, ${A.name}` : _;
    })(),
    O = new Date().toLocaleDateString(de.dateLocale, { weekday: "short", day: "numeric", month: "short" });
  return i.jsxs(Vi.Provider, {
    value: de,
    children: [
      i.jsx("style", {
        children: `
        .reduce-motion * { transition: none !important; animation: none !important; }
        body { line-height: var(--app-line-height, 1.5); }
        .steady-card { box-shadow: var(--shadow-card); }
        .nav-tab { transition: background-color 0.18s, color 0.18s; }
        .nav-tab-active { background-color: var(--green-bg); }
        .nav-tab-inactive:hover { background-color: var(--muted); }
        .nav-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .nav-scroll::-webkit-scrollbar { display: none; }

        /* ── Tab content entrance ── */
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tab-content { animation: fade-slide-up 0.22s ease-out both; }

        /* ── Stat card stagger ── */
        @keyframes pop-in {
          0%   { opacity: 0; transform: scale(0.93); }
          60%  { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .stat-card { animation: pop-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .stat-card:nth-child(1) { animation-delay: 0.04s; }
        .stat-card:nth-child(2) { animation-delay: 0.09s; }
        .stat-card:nth-child(3) { animation-delay: 0.14s; }

        /* ── Task checkbox pop ── */
        @keyframes check-pop {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.75); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .task-checked { animation: check-pop 0.3s cubic-bezier(0.34,1.56,0.64,1); }

        /* ── Habit row bounce ── */
        @keyframes habit-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.96); }
          65%  { transform: scale(1.03); }
          100% { transform: scale(1); }
        }

        .reduce-motion .tab-content,
        .reduce-motion .stat-card,
        .reduce-motion .task-checked,
        .reduce-motion .habit-bounce { animation: none !important; }

        @media (max-width: 360px) {
          .mood-label { display: none; }
        }
        @media (max-width: 320px) {
          .nav-tab-label { display: none; }
          .nav-tabs-row { padding-left: 4px; padding-right: 4px; gap: 0; }
        }
      `,
      }),
      i.jsxs("div", {
        className: "min-h-screen bg-background",
        style: { fontFamily: "var(--app-font-body, 'Nunito Sans', sans-serif)" },
        children: [
          i.jsxs("aside", {
            "aria-label": "Sidebar navigation",
            className: "hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border z-20",
            style: { backgroundColor: "var(--card)" },
            children: [
              i.jsxs("div", {
                className: "px-4 pt-5 pb-4 border-b border-border space-y-3",
                children: [
                  i.jsxs("button", {
                    onClick: () => {
                      (F("overview"), N(!1));
                    },
                    className: "flex items-center gap-2.5 hover:opacity-80 rounded-xl w-full",
                    style: { transition: "opacity 0.15s" },
                    "aria-label": "Go to Overview",
                    children: [
                      i.jsx(Ao, { size: 30 }),
                      i.jsxs("div", {
                        className: "text-left min-w-0",
                        children: [
                          i.jsx("span", {
                            style: {
                              fontFamily: "var(--app-font-heading, Nunito)",
                              fontWeight: 800,
                              fontSize: "1.2rem",
                              color: "var(--primary)",
                              letterSpacing: "-0.02em",
                              display: "block",
                            },
                            children: "Steady",
                          }),
                          i.jsx("p", { className: "text-muted-foreground truncate", style: { fontSize: "0.75rem", lineHeight: 1.3 }, children: ce }),
                        ],
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 w-full",
                    style: { backgroundColor: "var(--green-bg)", border: "1.5px solid var(--border)" },
                    children: [
                      i.jsx(Tf, { size: 18, style: { color: "var(--primary)", flexShrink: 0 } }),
                      i.jsxs("div", {
                        className: "min-w-0",
                        children: [
                          i.jsx("p", {
                            style: {
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              color: "var(--muted-foreground)",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              lineHeight: 1,
                              marginBottom: 8,
                            },
                            children: "Today",
                          }),
                          i.jsx("p", {
                            style: { fontSize: "0.88rem", fontWeight: 700, color: "var(--green-text)", lineHeight: 1.3 },
                            className: "truncate",
                            children: O,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              i.jsx("nav", {
                className: "flex-1 overflow-y-auto p-2 py-3 space-y-0.5",
                children: we.map((S) => {
                  const _ = S.icon,
                    a = C === S.key && !D;
                  return i.jsxs(
                    "button",
                    {
                      onClick: () => {
                        (F(S.key), N(!1));
                      },
                      className: `nav-tab w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left ${a ? "nav-tab-active" : "nav-tab-inactive"}`,
                      "aria-current": a ? "page" : void 0,
                      children: [
                        i.jsx(_, {
                          size: 18,
                          style: { color: a ? "var(--primary)" : "var(--muted-foreground)", flexShrink: 0 },
                          strokeWidth: a ? 2.5 : 1.8,
                        }),
                        i.jsx("span", {
                          style: {
                            fontSize: "0.9rem",
                            fontWeight: a ? 700 : 500,
                            color: a ? "var(--primary)" : "var(--muted-foreground)",
                            fontFamily: "var(--app-font-heading, Nunito)",
                            whiteSpace: "nowrap",
                          },
                          children: S.label,
                        }),
                      ],
                    },
                    S.key,
                  );
                }),
              }),
              i.jsx("div", {
                className: "p-4 border-t border-border space-y-3",
                children: i.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    i.jsxs("button", {
                      onClick: () => N((S) => !S),
                      className: `nav-tab flex-1 flex items-center justify-center gap-2 rounded-xl py-2 ${D ? "nav-tab-active" : "nav-tab-inactive"}`,
                      style: { color: D ? "var(--primary)" : "var(--muted-foreground)" },
                      "aria-label": "Open settings",
                      "aria-pressed": D,
                      children: [
                        i.jsx(ed, { size: 18 }),
                        i.jsx("span", {
                          style: { fontSize: "0.88rem", fontWeight: D ? 700 : 500, fontFamily: "var(--app-font-heading, Nunito)" },
                          children: de.settings.title,
                        }),
                      ],
                    }),
                    i.jsx(fe, {}),
                  ],
                }),
              }),
            ],
          }),
          i.jsxs("div", {
            className: "lg:pl-60 flex flex-col min-h-screen",
            children: [
              i.jsx("header", {
                className: "sticky top-0 z-10 border-b border-border px-5 py-3 lg:hidden",
                style: { backgroundColor: "var(--card)" },
                children: i.jsxs("div", {
                  className: "max-w-xl mx-auto flex items-center justify-between gap-4",
                  children: [
                    i.jsxs("button", {
                      onClick: () => {
                        (F("overview"), N(!1));
                      },
                      className: "flex items-center gap-2.5 hover:opacity-80 rounded-xl min-w-0",
                      style: { transition: "opacity 0.15s" },
                      "aria-label": "Go to Overview",
                      children: [
                        i.jsx(Ao, { size: 30, className: "flex-shrink-0" }),
                        i.jsxs("div", {
                          className: "text-left min-w-0",
                          children: [
                            i.jsx("span", {
                              style: {
                                fontFamily: "var(--app-font-heading, Nunito)",
                                fontWeight: 800,
                                fontSize: "1.25rem",
                                color: "var(--primary)",
                                letterSpacing: "-0.02em",
                                display: "block",
                              },
                              children: "Steady",
                            }),
                            i.jsx("p", {
                              className: "text-muted-foreground truncate",
                              style: { fontSize: "0.78rem", lineHeight: 1.2 },
                              children: ce,
                            }),
                          ],
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        i.jsx("button", {
                          onClick: () => N((S) => !S),
                          className: "rounded-xl p-2 hover:bg-muted",
                          style: { transition: "background-color 0.15s", color: D ? "var(--primary)" : "var(--muted-foreground)" },
                          "aria-label": "Open settings",
                          "aria-pressed": D,
                          children: i.jsx(ed, { size: 20 }),
                        }),
                        i.jsx(fe, {}),
                      ],
                    }),
                  ],
                }),
              }),
              i.jsx("nav", {
                "aria-label": "Tab navigation",
                className: "sticky top-[61px] z-10 border-b border-border lg:hidden",
                style: { backgroundColor: "var(--card)" },
                children: i.jsx("div", {
                  className: "nav-scroll overflow-x-auto",
                  children: i.jsx("div", {
                    className: "nav-tabs-row flex px-3 py-2 gap-1 max-w-xl mx-auto",
                    children: we.map((S) => {
                      const _ = S.icon,
                        a = C === S.key && !D;
                      return i.jsxs(
                        "button",
                        {
                          onClick: () => {
                            (F(S.key), N(!1));
                          },
                          className: "flex-1 flex flex-col items-center gap-0.5 py-2 px-1 min-w-[44px]",
                          "aria-current": a ? "page" : void 0,
                          children: [
                            i.jsx(_, { size: 18, style: { color: a ? "var(--primary)" : "var(--muted-foreground)" }, strokeWidth: a ? 2.5 : 1.8 }),
                            i.jsx("span", {
                              className: "nav-tab-label",
                              style: {
                                fontSize: "0.65rem",
                                fontWeight: a ? 700 : 500,
                                color: a ? "var(--primary)" : "var(--muted-foreground)",
                                fontFamily: "var(--app-font-heading, Nunito)",
                                whiteSpace: "nowrap",
                              },
                              children: S.label,
                            }),
                          ],
                        },
                        S.key,
                      );
                    }),
                  }),
                }),
              }),
              i.jsx("main", {
                className: "flex-1 w-full max-w-xl lg:max-w-2xl mx-auto px-4 pt-5 pb-8",
                children: D
                  ? i.jsx(Ap, {
                      settings: A.a11y,
                      onChange: (S) => E({ ...A, a11y: S }),
                      onClose: () => N(!1),
                      onResetOnboarding: () => {
                        (w(!1), N(!1));
                      },
                      onClearData: () => {
                        (Ie(), E({ ...Cr, a11y: A.a11y }));
                      },
                      auth: c,
                      onSignOut: He,
                      onAuthUpdate: Re,
                    })
                  : i.jsxs(
                      "div",
                      {
                        className: "tab-content space-y-4",
                        children: [
                          C === "overview" &&
                            i.jsxs(i.Fragment, {
                              children: [
                                i.jsx("div", {
                                  className: "grid grid-cols-3 gap-3",
                                  children: [
                                    {
                                      label: de.overview.tasksLeft,
                                      value: String(Ne),
                                      ariaLabel: void 0,
                                      bg: "var(--green-bg)",
                                      fg: "var(--green-text)",
                                    },
                                    {
                                      label: de.overview.habitsDone,
                                      value: ae > 0 ? `${T} / ${ae}` : "–",
                                      ariaLabel: void 0,
                                      bg: "var(--purple-bg)",
                                      fg: "var(--purple-text)",
                                    },
                                    {
                                      label: de.overview.streakDays,
                                      value: me > 0 ? `${me} 🔥` : "–",
                                      ariaLabel: me > 0 ? `${me} day streak` : "No streak yet",
                                      bg: "var(--yellow-bg)",
                                      fg: "var(--yellow-text)",
                                    },
                                  ].map((S) =>
                                    i.jsxs(
                                      "div",
                                      {
                                        className:
                                          "stat-card steady-card rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center border border-border",
                                        style: { backgroundColor: S.bg },
                                        children: [
                                          i.jsx("span", {
                                            "aria-label": S.ariaLabel,
                                            style: { fontWeight: 800, fontSize: "clamp(16px, 1.4rem, 20px)", color: S.fg, lineHeight: 1.2 },
                                            children: S.value,
                                          }),
                                          i.jsx("span", {
                                            style: {
                                              fontSize: "11px",
                                              color: S.fg,
                                              fontWeight: 600,
                                              marginTop: 4,
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              maxWidth: "100%",
                                            },
                                            children: S.label,
                                          }),
                                        ],
                                      },
                                      S.label,
                                    ),
                                  ),
                                }),
                                i.jsx(wf, {}),
                                i.jsx(Op, { support: A.support, sensory: A.sensory }),
                                i.jsx(td, { tasks: Y, setTasks: Z, nextId: g, setNextId: M }),
                              ],
                            }),
                          C === "tasks" && i.jsx(td, { tasks: Y, setTasks: Z, nextId: g, setNextId: M }),
                          C === "routines" && i.jsx(Sp, {}),
                          C === "habits" && i.jsx(Cp, {}),
                          C === "focus" && i.jsx(Pp, {}),
                          C === "note" && i.jsx(_p, {}),
                          C === "profile" && i.jsx(Mp, { profile: A, onChange: E, photo: j, onPhotoChange: B }),
                        ],
                      },
                      C,
                    ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
gf.createRoot(document.getElementById("root")).render(i.jsx(Gp, {}));
