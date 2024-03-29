var Box2D = function(Box2D) {
  Box2D = Box2D || {}
  var Module = Box2D

  var b
  b ||
    (b = eval(
      "(function() { try { return Box2D || {} } catch(e) { return {} } })()"
    ))
  var aa = {},
    ba
  for (ba in b) b.hasOwnProperty(ba) && (aa[ba] = b[ba])
  var ca = !1,
    da = !1,
    ea = !1,
    fa = !1
  if (b.ENVIRONMENT)
    if ("WEB" === b.ENVIRONMENT) ca = !0
    else if ("WORKER" === b.ENVIRONMENT) da = !0
    else if ("NODE" === b.ENVIRONMENT) ea = !0
    else if ("SHELL" === b.ENVIRONMENT) fa = !0
    else
      throw Error(
        "The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL."
      )
  else
    (ca = "object" === typeof window),
      (da = "function" === typeof importScripts),
      (ea =
        "object" === typeof process &&
        "function" === typeof require &&
        !ca &&
        !da),
      (fa = !ca && !ea && !da)
  if (ea) {
    b.print || (b.print = console.log)
    b.printErr || (b.printErr = console.warn)
    var ga, ha
    b.read = function(a, c) {
      ga || (ga = require("fs"))
      ha || (ha = require("path"))
      a = ha.normalize(a)
      var d = ga.readFileSync(a)
      return c ? d : d.toString()
    }
    b.readBinary = function(a) {
      a = b.read(a, !0)
      a.buffer || (a = new Uint8Array(a))
      assert(a.buffer)
      return a
    }
    b.load = function(a) {
      ia(read(a))
    }
    b.thisProgram ||
      (b.thisProgram =
        1 < process.argv.length
          ? process.argv[1].replace(/\\/g, "/")
          : "unknown-program")
    b.arguments = process.argv.slice(2)
    "undefined" !== typeof module && (module.exports = b)
    process.on("uncaughtException", function(a) {
      if (!(a instanceof ja)) throw a
    })
    b.inspect = function() {
      return "[Emscripten Module object]"
    }
  } else if (fa)
    b.print || (b.print = print),
      "undefined" != typeof printErr && (b.printErr = printErr),
      (b.read =
        "undefined" != typeof read
          ? read
          : function() {
              throw "no read() available"
            }),
      (b.readBinary = function(a) {
        if ("function" === typeof readbuffer)
          return new Uint8Array(readbuffer(a))
        a = read(a, "binary")
        assert("object" === typeof a)
        return a
      }),
      "undefined" != typeof scriptArgs
        ? (b.arguments = scriptArgs)
        : "undefined" != typeof arguments && (b.arguments = arguments),
      "function" === typeof quit &&
        (b.quit = function(a) {
          quit(a)
        }),
      eval(
        "if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"
      )
  else if (ca || da)
    (b.read = function(a) {
      var c = new XMLHttpRequest()
      c.open("GET", a, !1)
      c.send(null)
      return c.responseText
    }),
      da &&
        (b.readBinary = function(a) {
          var c = new XMLHttpRequest()
          c.open("GET", a, !1)
          c.responseType = "arraybuffer"
          c.send(null)
          return c.response
        }),
      (b.readAsync = function(a, c, d) {
        var e = new XMLHttpRequest()
        e.open("GET", a, !0)
        e.responseType = "arraybuffer"
        e.onload = function() {
          200 == e.status || (0 == e.status && e.response) ? c(e.response) : d()
        }
        e.onerror = d
        e.send(null)
      }),
      "undefined" != typeof arguments && (b.arguments = arguments),
      "undefined" !== typeof console
        ? (b.print ||
            (b.print = function(a) {
              console.log(a)
            }),
          b.printErr ||
            (b.printErr = function(a) {
              console.warn(a)
            }))
        : b.print || (b.print = function() {}),
      da && (b.load = importScripts),
      "undefined" === typeof b.setWindowTitle &&
        (b.setWindowTitle = function(a) {
          document.title = a
        })
  else throw "Unknown runtime environment. Where are we?"
  function ia(a) {
    eval.call(null, a)
  }
  !b.load &&
    b.read &&
    (b.load = function(a) {
      ia(b.read(a))
    })
  b.print || (b.print = function() {})
  b.printErr || (b.printErr = b.print)
  b.arguments || (b.arguments = [])
  b.thisProgram || (b.thisProgram = "./this.program")
  b.quit ||
    (b.quit = function(a, c) {
      throw c
    })
  b.print = b.print
  b.h = b.printErr
  b.preRun = []
  b.postRun = []
  for (ba in aa) aa.hasOwnProperty(ba) && (b[ba] = aa[ba])
  var aa = void 0,
    f = {
      f: function(a) {
        return (tempRet0 = a)
      },
      H: function() {
        return tempRet0
      },
      L: function() {
        return la
      },
      K: function(a) {
        la = a
      },
      s: function(a) {
        switch (a) {
          case "i1":
          case "i8":
            return 1
          case "i16":
            return 2
          case "i32":
            return 4
          case "i64":
            return 8
          case "float":
            return 4
          case "double":
            return 8
          default:
            return "*" === a[a.length - 1]
              ? f.j
              : "i" === a[0]
              ? ((a = parseInt(a.substr(1))), assert(0 === a % 8), a / 8)
              : 0
        }
      },
      F: function(a) {
        return Math.max(f.s(a), f.j)
      },
      M: 16,
      aa: function(a, c) {
        "double" === c || "i64" === c
          ? a & 7 && (assert(4 === (a & 7)), (a += 4))
          : assert(0 === (a & 3))
        return a
      },
      T: function(a, c, d) {
        return d || ("i64" != a && "double" != a)
          ? a
            ? Math.min(c || (a ? f.F(a) : 0), f.j)
            : Math.min(c, 8)
          : 8
      },
      l: function(a, c, d) {
        return d && d.length
          ? b["dynCall_" + a].apply(null, [c].concat(d))
          : b["dynCall_" + a].call(null, c)
      },
      d: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      v: function(a) {
        for (var c = 0; c < f.d.length; c++)
          if (!f.d[c]) return (f.d[c] = a), 2 * (1 + c)
        throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
      },
      J: function(a) {
        f.d[(a - 2) / 2] = null
      },
      g: function(a) {
        f.g.n || (f.g.n = {})
        f.g.n[a] || ((f.g.n[a] = 1), b.h(a))
      },
      m: {},
      V: function(a, c) {
        assert(c)
        f.m[c] || (f.m[c] = {})
        var d = f.m[c]
        d[a] ||
          (d[a] =
            1 === c.length
              ? function() {
                  return f.l(c, a)
                }
              : 2 === c.length
              ? function(d) {
                  return f.l(c, a, [d])
                }
              : function() {
                  return f.l(c, a, Array.prototype.slice.call(arguments))
                })
        return d[a]
      },
      U: function() {
        throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
      },
      t: function(a) {
        var c = la
        la = (la + a) | 0
        la = (la + 15) & -16
        return c
      },
      u: function(a) {
        var c = ma
        ma = (ma + a) | 0
        ma = (ma + 15) & -16
        return c
      },
      D: function(a) {
        var c = oa[qa >> 2]
        a = ((c + a + 15) | 0) & -16
        oa[qa >> 2] = a
        if ((a = a >= ra)) sa(), (a = !0)
        return a ? ((oa[qa >> 2] = c), 0) : c
      },
      p: function(a, c) {
        return Math.ceil(a / (c ? c : 16)) * (c ? c : 16)
      },
      $: function(a, c, d) {
        return d
          ? +(a >>> 0) + 4294967296 * +(c >>> 0)
          : +(a >>> 0) + 4294967296 * +(c | 0)
      },
      i: 1024,
      j: 4,
      N: 0
    }
  f.addFunction = f.v
  f.removeFunction = f.J
  var ua = 0
  function assert(a, c) {
    a || va("Assertion failed: " + c)
  }
  function wa(a) {
    var c
    c = "i32"
    "*" === c.charAt(c.length - 1) && (c = "i32")
    switch (c) {
      case "i1":
        return xa[a >> 0]
      case "i8":
        return xa[a >> 0]
      case "i16":
        return ya[a >> 1]
      case "i32":
        return oa[a >> 2]
      case "i64":
        return oa[a >> 2]
      case "float":
        return za[a >> 2]
      case "double":
        return Aa[a >> 3]
      default:
        va("invalid type for setValue: " + c)
    }
    return null
  }
  function Ba(a, c, d) {
    var e, h, l
    "number" === typeof a ? ((h = !0), (l = a)) : ((h = !1), (l = a.length))
    var m = "string" === typeof c ? c : null
    d =
      4 == d
        ? e
        : ["function" === typeof Ca ? Ca : f.u, f.t, f.u, f.D][
            void 0 === d ? 2 : d
          ](Math.max(l, m ? 1 : c.length))
    if (h) {
      e = d
      assert(0 == (d & 3))
      for (a = d + (l & -4); e < a; e += 4) oa[e >> 2] = 0
      for (a = d + l; e < a; ) xa[e++ >> 0] = 0
      return d
    }
    if ("i8" === m)
      return (
        a.subarray || a.slice ? Ea.set(a, d) : Ea.set(new Uint8Array(a), d), d
      )
    e = 0
    for (var K, Da; e < l; ) {
      var O = a[e]
      "function" === typeof O && (O = f.W(O))
      h = m || c[e]
      if (0 === h) e++
      else {
        "i64" == h && (h = "i32")
        var na = d + e,
          pa = h,
          pa = pa || "i8"
        "*" === pa.charAt(pa.length - 1) && (pa = "i32")
        switch (pa) {
          case "i1":
            xa[na >> 0] = O
            break
          case "i8":
            xa[na >> 0] = O
            break
          case "i16":
            ya[na >> 1] = O
            break
          case "i32":
            oa[na >> 2] = O
            break
          case "i64":
            tempI64 = [
              O >>> 0,
              ((tempDouble = O),
              1 <= +Fa(tempDouble)
                ? 0 < tempDouble
                  ? (Ga(+Ha(tempDouble / 4294967296), 4294967295) | 0) >>> 0
                  : ~~+Ia((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
                    0
                : 0)
            ]
            oa[na >> 2] = tempI64[0]
            oa[(na + 4) >> 2] = tempI64[1]
            break
          case "float":
            za[na >> 2] = O
            break
          case "double":
            Aa[na >> 3] = O
            break
          default:
            va("invalid type for setValue: " + pa)
        }
        Da !== h && ((K = f.s(h)), (Da = h))
        e += K
      }
    }
    return d
  }
  function Ja(a) {
    var c
    if (0 === c || !a) return ""
    for (var d = 0, e, h = 0; ; ) {
      e = Ea[(a + h) >> 0]
      d |= e
      if (0 == e && !c) break
      h++
      if (c && h == c) break
    }
    c || (c = h)
    e = ""
    if (128 > d) {
      for (; 0 < c; )
        (d = String.fromCharCode.apply(
          String,
          Ea.subarray(a, a + Math.min(c, 1024))
        )),
          (e = e ? e + d : d),
          (a += 1024),
          (c -= 1024)
      return e
    }
    return b.UTF8ToString(a)
  }
  var Ma = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0
  function Na(a, c, d, e) {
    if (0 < e) {
      e = d + e - 1
      for (var h = 0; h < a.length; ++h) {
        var l = a.charCodeAt(h)
        55296 <= l &&
          57343 >= l &&
          (l = (65536 + ((l & 1023) << 10)) | (a.charCodeAt(++h) & 1023))
        if (127 >= l) {
          if (d >= e) break
          c[d++] = l
        } else {
          if (2047 >= l) {
            if (d + 1 >= e) break
            c[d++] = 192 | (l >> 6)
          } else {
            if (65535 >= l) {
              if (d + 2 >= e) break
              c[d++] = 224 | (l >> 12)
            } else {
              if (2097151 >= l) {
                if (d + 3 >= e) break
                c[d++] = 240 | (l >> 18)
              } else {
                if (67108863 >= l) {
                  if (d + 4 >= e) break
                  c[d++] = 248 | (l >> 24)
                } else {
                  if (d + 5 >= e) break
                  c[d++] = 252 | (l >> 30)
                  c[d++] = 128 | ((l >> 24) & 63)
                }
                c[d++] = 128 | ((l >> 18) & 63)
              }
              c[d++] = 128 | ((l >> 12) & 63)
            }
            c[d++] = 128 | ((l >> 6) & 63)
          }
          c[d++] = 128 | (l & 63)
        }
      }
      c[d] = 0
    }
  }
  function Oa(a) {
    for (var c = 0, d = 0; d < a.length; ++d) {
      var e = a.charCodeAt(d)
      55296 <= e &&
        57343 >= e &&
        (e = (65536 + ((e & 1023) << 10)) | (a.charCodeAt(++d) & 1023))
      127 >= e
        ? ++c
        : (c =
            2047 >= e
              ? c + 2
              : 65535 >= e
              ? c + 3
              : 2097151 >= e
              ? c + 4
              : 67108863 >= e
              ? c + 5
              : c + 6)
    }
    return c
  }
  "undefined" !== typeof TextDecoder && new TextDecoder("utf-16le")
  function Pa(a) {
    return a.replace(/__Z[\w\d_]+/g, function(a) {
      var d
      a: {
        var e = b.___cxa_demangle || b.__cxa_demangle
        if (e)
          try {
            var h = a.substr(1),
              l = Oa(h) + 1,
              m = Ca(l)
            Na(h, Ea, m, l)
            var K = Ca(4),
              Da = e(m, 0, 0, K)
            if (0 === wa(K) && Da) {
              d = Ja(Da)
              break a
            }
          } catch (O) {
          } finally {
            m && Qa(m), K && Qa(K), Da && Qa(Da)
          }
        else
          f.g(
            "warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"
          )
        d = a
      }
      return a === d ? a : a + " [" + d + "]"
    })
  }
  function Ra() {
    var a
    a: {
      a = Error()
      if (!a.stack) {
        try {
          throw Error(0)
        } catch (c) {
          a = c
        }
        if (!a.stack) {
          a = "(no stack trace available)"
          break a
        }
      }
      a = a.stack.toString()
    }
    b.extraStackTrace && (a += "\n" + b.extraStackTrace())
    return Pa(a)
  }
  var buffer, xa, Ea, ya, Sa, oa, Ta, za, Aa
  function Ua() {
    b.HEAP8 = xa = new Int8Array(buffer)
    b.HEAP16 = ya = new Int16Array(buffer)
    b.HEAP32 = oa = new Int32Array(buffer)
    b.HEAPU8 = Ea = new Uint8Array(buffer)
    b.HEAPU16 = Sa = new Uint16Array(buffer)
    b.HEAPU32 = Ta = new Uint32Array(buffer)
    b.HEAPF32 = za = new Float32Array(buffer)
    b.HEAPF64 = Aa = new Float64Array(buffer)
  }
  var Va, ma, Wa, la, Za, $a, qa
  Va = ma = Wa = la = Za = $a = qa = 0
  function sa() {
    va(
      "Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " +
        ra +
        ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 "
    )
  }
  var ab = b.TOTAL_STACK || 5242880,
    ra = b.TOTAL_MEMORY || 16777216
  ra < ab &&
    b.h(
      "TOTAL_MEMORY should be larger than TOTAL_STACK, was " +
        ra +
        "! (TOTAL_STACK=" +
        ab +
        ")"
    )
  b.buffer
    ? (buffer = b.buffer)
    : "object" === typeof WebAssembly &&
      "function" === typeof WebAssembly.Memory
    ? ((b.wasmMemory = new WebAssembly.Memory({
        initial: ra / 65536,
        maximum: ra / 65536
      })),
      (buffer = b.wasmMemory.buffer))
    : (buffer = new ArrayBuffer(ra))
  Ua()
  oa[0] = 1668509029
  ya[1] = 25459
  if (115 !== Ea[2] || 99 !== Ea[3])
    throw "Runtime error: expected the system to be little-endian!"
  b.HEAP = void 0
  b.buffer = buffer
  b.HEAP8 = xa
  b.HEAP16 = ya
  b.HEAP32 = oa
  b.HEAPU8 = Ea
  b.HEAPU16 = Sa
  b.HEAPU32 = Ta
  b.HEAPF32 = za
  b.HEAPF64 = Aa
  function bb(a) {
    for (; 0 < a.length; ) {
      var c = a.shift()
      if ("function" == typeof c) c()
      else {
        var d = c.S
        "number" === typeof d
          ? void 0 === c.k
            ? b.dynCall_v(d)
            : b.dynCall_vi(d, c.k)
          : d(void 0 === c.k ? null : c.k)
      }
    }
  }
  var cb = [],
    db = [],
    eb = [],
    fb = [],
    gb = [],
    hb = !1
  function ib() {
    var a = b.preRun.shift()
    cb.unshift(a)
  }
  function jb(a) {
    var c = Array(Oa(a) + 1)
    Na(a, c, 0, c.length)
    return c
  }
  ;(Math.imul && -5 === Math.imul(4294967295, 5)) ||
    (Math.imul = function(a, c) {
      var d = a & 65535,
        e = c & 65535
      return (d * e + (((a >>> 16) * e + d * (c >>> 16)) << 16)) | 0
    })
  Math.Y = Math.imul
  if (!Math.fround) {
    var kb = new Float32Array(1)
    Math.fround = function(a) {
      kb[0] = a
      return kb[0]
    }
  }
  Math.R = Math.fround
  Math.clz32 ||
    (Math.clz32 = function(a) {
      a = a >>> 0
      for (var c = 0; 32 > c; c++) if (a & (1 << (31 - c))) return c
      return 32
    })
  Math.P = Math.clz32
  Math.trunc ||
    (Math.trunc = function(a) {
      return 0 > a ? Math.ceil(a) : Math.floor(a)
    })
  Math.trunc = Math.trunc
  var Fa = Math.abs,
    Ia = Math.ceil,
    Ha = Math.floor,
    Ga = Math.min,
    mb = 0,
    nb = null,
    ob = null
  function pb() {
    mb++
    b.monitorRunDependencies && b.monitorRunDependencies(mb)
  }
  function qb() {
    mb--
    b.monitorRunDependencies && b.monitorRunDependencies(mb)
    if (0 == mb && (null !== nb && (clearInterval(nb), (nb = null)), ob)) {
      var a = ob
      ob = null
      a()
    }
  }
  b.preloadedImages = {}
  b.preloadedAudios = {}
  var rb = null
  ;(function(a) {
    function c(a, c) {
      var d = pa
      if (0 > a.indexOf(".")) d = (d || {})[a]
      else
        var e = a.split("."),
          d = (d || {})[e[0]],
          d = (d || {})[e[1]]
      c && (d = (d || {})[c])
      void 0 === d && va("bad lookupImport to (" + a + ")." + c)
      return d
    }
    function d(c) {
      var d = a.buffer
      c.byteLength < d.byteLength &&
        a.printErr(
          "the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here"
        )
      var d = new Int8Array(d),
        e = new Int8Array(c)
      rb ||
        d.set(
          e.subarray(a.STATIC_BASE, a.STATIC_BASE + a.STATIC_BUMP),
          a.STATIC_BASE
        )
      e.set(d)
      b.buffer = buffer = c
      Ua()
    }
    function e() {
      var c
      if (a.wasmBinary) (c = a.wasmBinary), (c = new Uint8Array(c))
      else if (a.readBinary) c = a.readBinary(O)
      else
        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)"
      return c
    }
    function h() {
      return a.wasmBinary || "function" !== typeof fetch
        ? new Promise(function(a) {
            a(e())
          })
        : fetch(O).then(function(a) {
            return a.arrayBuffer()
          })
    }
    function l(c, d, e) {
      if ("function" !== typeof a.asm || a.asm === Ya)
        a.asmPreload ? (a.asm = a.asmPreload) : eval(a.read(na))
      return "function" !== typeof a.asm
        ? (a.printErr("asm evalling did not set the module properly"), !1)
        : a.asm(c, d, e)
    }
    function m(c, e) {
      function l(c) {
        lb = c.exports
        lb.memory && d(lb.memory)
        a.asm = lb
        a.usingWasm = !0
        qb()
      }
      if ("object" !== typeof WebAssembly)
        return a.printErr("no native wasm support detected"), !1
      if (!(a.wasmMemory instanceof WebAssembly.Memory))
        return a.printErr("no native wasm Memory in use"), !1
      e.memory = a.wasmMemory
      pa.global = { NaN: NaN, Infinity: Infinity }
      pa["global.Math"] = c.Math
      pa.env = e
      pb()
      if (a.instantiateWasm)
        try {
          return a.instantiateWasm(pa, l)
        } catch (m) {
          return (
            a.printErr(
              "Module.instantiateWasm callback failed with error: " + m
            ),
            !1
          )
        }
      a.printErr("asynchronously preparing wasm")
      h()
        .then(function(a) {
          return WebAssembly.instantiate(a, pa)
        })
        .then(function(a) {
          l(a.instance)
        })
        .catch(function(c) {
          a.printErr("failed to asynchronously prepare wasm: " + c)
          a.quit(1, c)
        })
      return {}
    }
    var K = a.wasmJSMethod || "native-wasm"
    a.wasmJSMethod = K
    var Da = a.wasmTextFile || "Box2D_v2.3.1_min.wasm.wast",
      O = a.wasmBinaryFile || "./lib/Box2D/Box2D_v2.3.1_min.wasm.wasm",
      na = a.asmjsCodeFile || "Box2D_v2.3.1_min.wasm.temp.asm.js",
      pa = {
        global: null,
        env: null,
        asm2wasm: {
          "f64-rem": function(a, c) {
            return a % c
          },
          "f64-to-int": function(a) {
            return a | 0
          },
          "i32s-div": function(a, c) {
            return ((a | 0) / (c | 0)) | 0
          },
          "i32u-div": function(a, c) {
            return ((a >>> 0) / (c >>> 0)) >>> 0
          },
          "i32s-rem": function(a, c) {
            return (a | 0) % (c | 0) | 0
          },
          "i32u-rem": function(a, c) {
            return (a >>> 0) % (c >>> 0) >>> 0
          },
          debugger: function() {
            debugger
          }
        },
        parent: a
      },
      lb = null
    a.asmPreload = a.asm
    a.reallocBuffer = function(c) {
      var d = a.usingWasm ? 65536 : 16777216
      0 < c % d && (c += d - (c % d))
      var d = a.buffer,
        e = d.byteLength
      if (a.usingWasm)
        try {
          return -1 !== a.wasmMemory.X((c - e) / 65536)
            ? (a.buffer = a.wasmMemory.buffer)
            : null
        } catch (h) {
          return null
        }
      else
        return (
          lb.__growWasmMemory((c - e) / 65536), a.buffer !== d ? a.buffer : null
        )
    }
    a.asm = function(h, Ka, O) {
      if (!Ka.table) {
        var Xa = a.wasmTableSize
        void 0 === Xa && (Xa = 1024)
        var Ya = a.wasmMaxTableSize
        Ka.table =
          "object" === typeof WebAssembly &&
          "function" === typeof WebAssembly.Table
            ? void 0 !== Ya
              ? new WebAssembly.Table({
                  initial: Xa,
                  maximum: Ya,
                  element: "anyfunc"
                })
              : new WebAssembly.Table({ initial: Xa, element: "anyfunc" })
            : Array(Xa)
        a.wasmTable = Ka.table
      }
      Ka.memoryBase || (Ka.memoryBase = a.STATIC_BASE)
      Ka.tableBase || (Ka.tableBase = 0)
      for (var P, Xa = K.split(","), Ya = 0; Ya < Xa.length; Ya++)
        if (
          ((P = Xa[Ya]),
          a.printErr("trying binaryen method: " + P),
          "native-wasm" === P)
        ) {
          if ((P = m(h, Ka))) break
        } else if ("asmjs" === P) {
          if ((P = l(h, Ka, O))) break
        } else if (
          "interpret-asm2wasm" === P ||
          "interpret-s-expr" === P ||
          "interpret-binary" === P
        ) {
          var La = h,
            ka = Ka,
            Nb = O
          if ("function" !== typeof WasmJS)
            a.printErr("WasmJS not detected - polyfill not bundled?"), (P = !1)
          else {
            var ta = WasmJS({})
            ta.outside = a
            ta.info = pa
            ta.lookupImport = c
            assert(Nb === a.buffer)
            pa.global = La
            pa.env = ka
            assert(Nb === a.buffer)
            ka.memory = Nb
            assert(ka.memory instanceof ArrayBuffer)
            ta.providedTotalMemory = a.buffer.byteLength
            La = void 0
            La =
              "interpret-binary" === P
                ? e()
                : a.read("interpret-asm2wasm" == P ? na : Da)
            ka = void 0
            if ("interpret-asm2wasm" == P)
              (ka = ta._malloc(La.length + 1)),
                ta.writeAsciiToMemory(La, ka),
                ta._load_asm2wasm(ka)
            else if ("interpret-s-expr" === P)
              (ka = ta._malloc(La.length + 1)),
                ta.writeAsciiToMemory(La, ka),
                ta._load_s_expr2wasm(ka)
            else if ("interpret-binary" === P)
              (ka = ta._malloc(La.length)),
                ta.HEAPU8.set(La, ka),
                ta._load_binary2wasm(ka, La.length)
            else throw "what? " + P
            ta._free(ka)
            ta._instantiate(ka)
            a.newBuffer && (d(a.newBuffer), (a.newBuffer = null))
            P = lb = ta.asmExports
          }
          if (P) break
        } else throw "bad method: " + P
      if (!P)
        throw "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods"
      a.printErr("binaryen method succeeded.")
      return P
    }
    var Ya = a.asm
  })(b)
  var sb = [
    function(a, c) {
      var d = b.getCache(b.JSDestructionListener)[a]
      if (!d.hasOwnProperty("SayGoodbyeJoint"))
        throw "a JSImplementation must implement all functions, you forgot JSDestructionListener::SayGoodbyeJoint."
      d.SayGoodbyeJoint(c)
    },
    function(a, c) {
      var d = b.getCache(b.JSDestructionListener)[a]
      if (!d.hasOwnProperty("SayGoodbyeFixture"))
        throw "a JSImplementation must implement all functions, you forgot JSDestructionListener::SayGoodbyeFixture."
      d.SayGoodbyeFixture(c)
    },
    function(a, c) {
      var d = b.getCache(b.JSQueryCallback)[a]
      if (!d.hasOwnProperty("ReportFixture"))
        throw "a JSImplementation must implement all functions, you forgot JSQueryCallback::ReportFixture."
      return d.ReportFixture(c)
    },
    function(a, c, d, e, h) {
      a = b.getCache(b.JSRayCastCallback)[a]
      if (!a.hasOwnProperty("ReportFixture"))
        throw "a JSImplementation must implement all functions, you forgot JSRayCastCallback::ReportFixture."
      return a.ReportFixture(c, d, e, h)
    },
    function(a, c) {
      var d = b.getCache(b.JSContactListener)[a]
      if (!d.hasOwnProperty("BeginContact"))
        throw "a JSImplementation must implement all functions, you forgot JSContactListener::BeginContact."
      d.BeginContact(c)
    },
    function(a, c) {
      var d = b.getCache(b.JSContactListener)[a]
      if (!d.hasOwnProperty("EndContact"))
        throw "a JSImplementation must implement all functions, you forgot JSContactListener::EndContact."
      d.EndContact(c)
    },
    function(a, c, d) {
      a = b.getCache(b.JSContactListener)[a]
      if (!a.hasOwnProperty("PreSolve"))
        throw "a JSImplementation must implement all functions, you forgot JSContactListener::PreSolve."
      a.PreSolve(c, d)
    },
    function(a, c, d) {
      a = b.getCache(b.JSContactListener)[a]
      if (!a.hasOwnProperty("PostSolve"))
        throw "a JSImplementation must implement all functions, you forgot JSContactListener::PostSolve."
      a.PostSolve(c, d)
    },
    function(a, c, d) {
      a = b.getCache(b.JSContactFilter)[a]
      if (!a.hasOwnProperty("ShouldCollide"))
        throw "a JSImplementation must implement all functions, you forgot JSContactFilter::ShouldCollide."
      return a.ShouldCollide(c, d)
    },
    function(a, c, d, e) {
      a = b.getCache(b.JSDraw)[a]
      if (!a.hasOwnProperty("DrawPolygon"))
        throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawPolygon."
      a.DrawPolygon(c, d, e)
    },
    function(a, c, d, e) {
      a = b.getCache(b.JSDraw)[a]
      if (!a.hasOwnProperty("DrawSolidPolygon"))
        throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawSolidPolygon."
      a.DrawSolidPolygon(c, d, e)
    },
    function(a, c, d, e) {
      a = b.getCache(b.JSDraw)[a]
      if (!a.hasOwnProperty("DrawCircle"))
        throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawCircle."
      a.DrawCircle(c, d, e)
    },
    function(a, c, d, e, h) {
      a = b.getCache(b.JSDraw)[a]
      if (!a.hasOwnProperty("DrawSolidCircle"))
        throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawSolidCircle."
      a.DrawSolidCircle(c, d, e, h)
    },
    function(a, c, d, e) {
      a = b.getCache(b.JSDraw)[a]
      if (!a.hasOwnProperty("DrawSegment"))
        throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawSegment."
      a.DrawSegment(c, d, e)
    },
    function(a, c) {
      var d = b.getCache(b.JSDraw)[a]
      if (!d.hasOwnProperty("DrawTransform"))
        throw "a JSImplementation must implement all functions, you forgot JSDraw::DrawTransform."
      d.DrawTransform(c)
    }
  ]
  Va = f.i
  ma = Va + 23264
  db.push()
  rb =
    0 <= b.wasmJSMethod.indexOf("asmjs") ||
    0 <= b.wasmJSMethod.indexOf("interpret-asm2wasm")
      ? "Box2D_v2.3.1_min.wasm.js.mem"
      : null
  b.STATIC_BASE = Va
  b.STATIC_BUMP = 23264
  var tb = ma
  ma += 16
  b._memset = ub
  function vb() {
    return !!vb.e
  }
  var wb = 0,
    xb = [],
    yb = {}
  function zb(a, c) {
    zb.e || (zb.e = {})
    a in zb.e || (b.dynCall_v(c), (zb.e[a] = 1))
  }
  b._memcpy = Ab
  var Bb = 0
  function Cb() {
    Bb += 4
    return oa[(Bb - 4) >> 2]
  }
  var Db = {},
    Eb = {}
  b._sbrk = Fb
  var Gb = 1
  function Hb() {
    var a = wb
    if (!a) return (f.f(0), 0) | 0
    var c = yb[a],
      d = c.type
    if (!d) return (f.f(0), a) | 0
    var e = Array.prototype.slice.call(arguments)
    b.___cxa_is_pointer_type(d)
    Hb.buffer || (Hb.buffer = Ca(4))
    oa[Hb.buffer >> 2] = a
    for (var a = Hb.buffer, h = 0; h < e.length; h++)
      if (e[h] && b.___cxa_can_catch(e[h], d, a))
        return (a = oa[a >> 2]), (c.w = a), (f.f(e[h]), a) | 0
    a = oa[a >> 2]
    return (f.f(d), a) | 0
  }
  b._llvm_bswap_i32 = Ib
  function Jb(a, c) {
    Bb = c
    try {
      var d = Cb(),
        e = Cb(),
        h = Cb(),
        l = 0
      Jb.buffer ||
        ((Jb.e = [null, [], []]),
        (Jb.q = function(a, c) {
          var d = Jb.e[a]
          assert(d)
          if (0 === c || 10 === c) {
            var e = 1 === a ? b.print : b.printErr,
              h
            a: {
              for (var l = (h = 0); d[l]; ) ++l
              if (16 < l - h && d.subarray && Ma)
                h = Ma.decode(d.subarray(h, l))
              else
                for (var m, K, P, O, ka, na, l = ""; ; ) {
                  m = d[h++]
                  if (!m) {
                    h = l
                    break a
                  }
                  m & 128
                    ? ((K = d[h++] & 63),
                      192 == (m & 224)
                        ? (l += String.fromCharCode(((m & 31) << 6) | K))
                        : ((P = d[h++] & 63),
                          224 == (m & 240)
                            ? (m = ((m & 15) << 12) | (K << 6) | P)
                            : ((O = d[h++] & 63),
                              240 == (m & 248)
                                ? (m =
                                    ((m & 7) << 18) | (K << 12) | (P << 6) | O)
                                : ((ka = d[h++] & 63),
                                  248 == (m & 252)
                                    ? (m =
                                        ((m & 3) << 24) |
                                        (K << 18) |
                                        (P << 12) |
                                        (O << 6) |
                                        ka)
                                    : ((na = d[h++] & 63),
                                      (m =
                                        ((m & 1) << 30) |
                                        (K << 24) |
                                        (P << 18) |
                                        (O << 12) |
                                        (ka << 6) |
                                        na)))),
                          65536 > m
                            ? (l += String.fromCharCode(m))
                            : ((m -= 65536),
                              (l += String.fromCharCode(
                                55296 | (m >> 10),
                                56320 | (m & 1023)
                              )))))
                    : (l += String.fromCharCode(m))
                }
            }
            e(h)
            d.length = 0
          } else d.push(c)
        }))
      for (var m = 0; m < h; m++) {
        for (
          var K = oa[(e + 8 * m) >> 2], Da = oa[(e + (8 * m + 4)) >> 2], O = 0;
          O < Da;
          O++
        )
          Jb.q(d, Ea[K + O])
        l += Da
      }
      return l
    } catch (na) {
      return ("undefined" !== typeof FS && na instanceof FS.o) || va(na), -na.r
    }
  }
  fb.push(function() {
    var a = b._fflush
    a && a(0)
    if ((a = Jb.q)) {
      var c = Jb.e
      c[1].length && a(1, 10)
      c[2].length && a(2, 10)
    }
  })
  qa = Ba(1, "i32", 2)
  Wa = la = f.p(ma)
  Za = Wa + ab
  $a = f.p(Za)
  oa[qa >> 2] = $a
  b.wasmTableSize = 1152
  b.wasmMaxTableSize = 1152
  b.A = {
    Math: Math,
    Int8Array: Int8Array,
    Int16Array: Int16Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array,
    Uint16Array: Uint16Array,
    Uint32Array: Uint32Array,
    Float32Array: Float32Array,
    Float64Array: Float64Array,
    NaN: NaN,
    Infinity: Infinity
  }
  b.B = {
    abort: va,
    assert: assert,
    enlargeMemory: function() {
      sa()
    },
    getTotalMemory: function() {
      return ra
    },
    abortOnCannotGrowMemory: sa,
    invoke_iiii: function(a, c, d, e) {
      try {
        return b.dynCall_iiii(a, c, d, e)
      } catch (h) {
        if ("number" !== typeof h && "longjmp" !== h) throw h
        b.setThrew(1, 0)
      }
    },
    jsCall_iiii: function(a, c, d, e) {
      return f.d[a](c, d, e)
    },
    invoke_viifii: function(a, c, d, e, h, l) {
      try {
        b.dynCall_viifii(a, c, d, e, h, l)
      } catch (m) {
        if ("number" !== typeof m && "longjmp" !== m) throw m
        b.setThrew(1, 0)
      }
    },
    jsCall_viifii: function(a, c, d, e, h, l) {
      f.d[a](c, d, e, h, l)
    },
    invoke_viiiii: function(a, c, d, e, h, l) {
      try {
        b.dynCall_viiiii(a, c, d, e, h, l)
      } catch (m) {
        if ("number" !== typeof m && "longjmp" !== m) throw m
        b.setThrew(1, 0)
      }
    },
    jsCall_viiiii: function(a, c, d, e, h, l) {
      f.d[a](c, d, e, h, l)
    },
    invoke_vi: function(a, c) {
      try {
        b.dynCall_vi(a, c)
      } catch (d) {
        if ("number" !== typeof d && "longjmp" !== d) throw d
        b.setThrew(1, 0)
      }
    },
    jsCall_vi: function(a, c) {
      f.d[a](c)
    },
    invoke_vii: function(a, c, d) {
      try {
        b.dynCall_vii(a, c, d)
      } catch (e) {
        if ("number" !== typeof e && "longjmp" !== e) throw e
        b.setThrew(1, 0)
      }
    },
    jsCall_vii: function(a, c, d) {
      f.d[a](c, d)
    },
    invoke_ii: function(a, c) {
      try {
        return b.dynCall_ii(a, c)
      } catch (d) {
        if ("number" !== typeof d && "longjmp" !== d) throw d
        b.setThrew(1, 0)
      }
    },
    jsCall_ii: function(a, c) {
      return f.d[a](c)
    },
    invoke_fif: function(a, c, d) {
      try {
        return b.dynCall_fif(a, c, d)
      } catch (e) {
        if ("number" !== typeof e && "longjmp" !== e) throw e
        b.setThrew(1, 0)
      }
    },
    jsCall_fif: function(a, c, d) {
      return f.d[a](c, d)
    },
    invoke_viii: function(a, c, d, e) {
      try {
        b.dynCall_viii(a, c, d, e)
      } catch (h) {
        if ("number" !== typeof h && "longjmp" !== h) throw h
        b.setThrew(1, 0)
      }
    },
    jsCall_viii: function(a, c, d, e) {
      f.d[a](c, d, e)
    },
    invoke_viifi: function(a, c, d, e, h) {
      try {
        b.dynCall_viifi(a, c, d, e, h)
      } catch (l) {
        if ("number" !== typeof l && "longjmp" !== l) throw l
        b.setThrew(1, 0)
      }
    },
    jsCall_viifi: function(a, c, d, e, h) {
      f.d[a](c, d, e, h)
    },
    invoke_v: function(a) {
      try {
        b.dynCall_v(a)
      } catch (c) {
        if ("number" !== typeof c && "longjmp" !== c) throw c
        b.setThrew(1, 0)
      }
    },
    jsCall_v: function(a) {
      f.d[a]()
    },
    invoke_viif: function(a, c, d, e) {
      try {
        b.dynCall_viif(a, c, d, e)
      } catch (h) {
        if ("number" !== typeof h && "longjmp" !== h) throw h
        b.setThrew(1, 0)
      }
    },
    jsCall_viif: function(a, c, d, e) {
      f.d[a](c, d, e)
    },
    invoke_viiiiii: function(a, c, d, e, h, l, m) {
      try {
        b.dynCall_viiiiii(a, c, d, e, h, l, m)
      } catch (K) {
        if ("number" !== typeof K && "longjmp" !== K) throw K
        b.setThrew(1, 0)
      }
    },
    jsCall_viiiiii: function(a, c, d, e, h, l, m) {
      f.d[a](c, d, e, h, l, m)
    },
    invoke_iii: function(a, c, d) {
      try {
        return b.dynCall_iii(a, c, d)
      } catch (e) {
        if ("number" !== typeof e && "longjmp" !== e) throw e
        b.setThrew(1, 0)
      }
    },
    jsCall_iii: function(a, c, d) {
      return f.d[a](c, d)
    },
    invoke_iiiiii: function(a, c, d, e, h, l) {
      try {
        return b.dynCall_iiiiii(a, c, d, e, h, l)
      } catch (m) {
        if ("number" !== typeof m && "longjmp" !== m) throw m
        b.setThrew(1, 0)
      }
    },
    jsCall_iiiiii: function(a, c, d, e, h, l) {
      return f.d[a](c, d, e, h, l)
    },
    invoke_fiiiif: function(a, c, d, e, h, l) {
      try {
        return b.dynCall_fiiiif(a, c, d, e, h, l)
      } catch (m) {
        if ("number" !== typeof m && "longjmp" !== m) throw m
        b.setThrew(1, 0)
      }
    },
    jsCall_fiiiif: function(a, c, d, e, h, l) {
      return f.d[a](c, d, e, h, l)
    },
    invoke_viiii: function(a, c, d, e, h) {
      try {
        b.dynCall_viiii(a, c, d, e, h)
      } catch (l) {
        if ("number" !== typeof l && "longjmp" !== l) throw l
        b.setThrew(1, 0)
      }
    },
    jsCall_viiii: function(a, c, d, e, h) {
      f.d[a](c, d, e, h)
    },
    _emscripten_asm_const_iiiii: function(a, c, d, e, h) {
      return sb[a](c, d, e, h)
    },
    _emscripten_asm_const_diiiid: function(a, c, d, e, h, l) {
      return sb[a](c, d, e, h, l)
    },
    _pthread_key_create: function(a) {
      if (0 == a) return 22
      oa[a >> 2] = Gb
      Eb[Gb] = 0
      Gb++
      return 0
    },
    _abort: function() {
      b.abort()
    },
    ___gxx_personality_v0: function() {},
    _emscripten_asm_const_iiidii: function(a, c, d, e, h, l) {
      return sb[a](c, d, e, h, l)
    },
    ___assert_fail: function(a, c, d, e) {
      ua = !0
      throw "Assertion failed: " +
        Ja(a) +
        ", at: " +
        [c ? Ja(c) : "unknown filename", d, e ? Ja(e) : "unknown function"] +
        " at " +
        Ra()
    },
    __ZSt18uncaught_exceptionv: vb,
    ___setErrNo: function(a) {
      b.___errno_location && (oa[b.___errno_location() >> 2] = a)
      return a
    },
    ___cxa_begin_catch: function(a) {
      var c = yb[a]
      c && !c.C && ((c.C = !0), vb.e--)
      c && (c.da = !1)
      xb.push(a)
      a: {
        if (a && !yb[a])
          for (var d in yb)
            if (yb[d].w === a) {
              c = d
              break a
            }
        c = a
      }
      c && yb[c].ba++
      return a
    },
    _emscripten_memcpy_big: function(a, c, d) {
      Ea.set(Ea.subarray(c, c + d), a)
      return a
    },
    ___resumeException: function(a) {
      wb || (wb = a)
      throw a +
        " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
    },
    ___cxa_find_matching_catch: Hb,
    _pthread_getspecific: function(a) {
      return Eb[a] || 0
    },
    _pthread_once: zb,
    ___syscall54: function(a, c) {
      Bb = c
      return 0
    },
    _emscripten_asm_const_iii: function(a, c, d) {
      return sb[a](c, d)
    },
    _emscripten_asm_const_iiidi: function(a, c, d, e, h) {
      return sb[a](c, d, e, h)
    },
    _pthread_setspecific: function(a, c) {
      if (!(a in Eb)) return 22
      Eb[a] = c
      return 0
    },
    _emscripten_asm_const_iiii: function(a, c, d, e) {
      return sb[a](c, d, e)
    },
    ___syscall6: function(a, c) {
      Bb = c
      try {
        var d = Db.G()
        FS.close(d)
        return 0
      } catch (e) {
        return ("undefined" !== typeof FS && e instanceof FS.o) || va(e), -e.r
      }
    },
    ___syscall140: function(a, c) {
      Bb = c
      try {
        var d = Db.G(),
          e = Cb(),
          h = Cb(),
          l = Cb(),
          m = Cb()
        assert(0 === e)
        FS.Z(d, h, m)
        oa[l >> 2] = d.position
        d.I && 0 === h && 0 === m && (d.I = null)
        return 0
      } catch (K) {
        return ("undefined" !== typeof FS && K instanceof FS.o) || va(K), -K.r
      }
    },
    ___cxa_pure_virtual: function() {
      ua = !0
      throw "Pure virtual function called!"
    },
    ___syscall146: Jb,
    DYNAMICTOP_PTR: qa,
    tempDoublePtr: tb,
    ABORT: ua,
    STACKTOP: la,
    STACK_MAX: Za
  }
  var Kb = b.asm(b.A, b.B, buffer)
  b.asm = Kb
  var Lb = (b._emscripten_bind_b2WheelJoint_GetSpringDampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetSpringDampingRatio_0.apply(
        null,
        arguments
      )
    }),
    Mb = (b._emscripten_bind_b2ContactEdge_set_next_1 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_set_next_1.apply(
        null,
        arguments
      )
    }),
    Ob = (b._emscripten_bind_b2ChainShape_get_m_count_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_count_0.apply(
        null,
        arguments
      )
    }),
    Pb = (b._emscripten_bind_b2PrismaticJointDef_get_motorSpeed_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_motorSpeed_0.apply(
        null,
        arguments
      )
    }),
    Qb = (b._emscripten_bind_b2PulleyJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    Rb = (b._emscripten_bind_b2Shape_ComputeAABB_3 = function() {
      return b.asm._emscripten_bind_b2Shape_ComputeAABB_3.apply(null, arguments)
    }),
    Sb = (b._emscripten_bind_b2FrictionJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    Tb = (b._emscripten_bind_b2MouseJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    Ub = (b._emscripten_bind_b2World_IsLocked_0 = function() {
      return b.asm._emscripten_bind_b2World_IsLocked_0.apply(null, arguments)
    }),
    Vb = (b._emscripten_bind_b2Draw_GetFlags_0 = function() {
      return b.asm._emscripten_bind_b2Draw_GetFlags_0.apply(null, arguments)
    }),
    Wb = (b._emscripten_bind_b2FrictionJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    Xb = (b._emscripten_bind_b2Color_set_g_1 = function() {
      return b.asm._emscripten_bind_b2Color_set_g_1.apply(null, arguments)
    }),
    Yb = (b._emscripten_bind_b2PolygonShape_RayCast_4 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_RayCast_4.apply(
        null,
        arguments
      )
    }),
    Zb = (b._emscripten_bind_b2World_GetTreeBalance_0 = function() {
      return b.asm._emscripten_bind_b2World_GetTreeBalance_0.apply(
        null,
        arguments
      )
    }),
    $b = (b._emscripten_bind_b2ChainShape_get_m_vertices_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_vertices_0.apply(
        null,
        arguments
      )
    }),
    ac = (b._emscripten_bind_JSDraw_DrawSolidCircle_4 = function() {
      return b.asm._emscripten_bind_JSDraw_DrawSolidCircle_4.apply(
        null,
        arguments
      )
    }),
    bc = (b._emscripten_bind_b2RevoluteJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    cc = (b._emscripten_bind_b2FixtureDef_get_filter_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_filter_0.apply(
        null,
        arguments
      )
    }),
    dc = (b._emscripten_bind_b2FrictionJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    ec = (b._emscripten_bind_b2MotorJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    fc = (b._emscripten_bind_b2FixtureDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    gc = (b._emscripten_bind_b2EdgeShape_set_m_hasVertex3_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_hasVertex3_1.apply(
        null,
        arguments
      )
    }),
    hc = (b._emscripten_bind_b2JointEdge_set_joint_1 = function() {
      return b.asm._emscripten_bind_b2JointEdge_set_joint_1.apply(
        null,
        arguments
      )
    }),
    ic = (b._emscripten_bind_b2Fixture___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Fixture___destroy___0.apply(
        null,
        arguments
      )
    }),
    jc = (b._emscripten_bind_b2World_SetWarmStarting_1 = function() {
      return b.asm._emscripten_bind_b2World_SetWarmStarting_1.apply(
        null,
        arguments
      )
    }),
    kc = (b._emscripten_bind_JSDraw_DrawCircle_3 = function() {
      return b.asm._emscripten_bind_JSDraw_DrawCircle_3.apply(null, arguments)
    }),
    lc = (b._emscripten_bind_b2WeldJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    mc = (b._emscripten_bind_b2DestructionListener___destroy___0 = function() {
      return b.asm._emscripten_bind_b2DestructionListener___destroy___0.apply(
        null,
        arguments
      )
    }),
    nc = (b._emscripten_bind_b2BodyDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_type_1.apply(null, arguments)
    }),
    oc = (b._emscripten_bind_b2ChainShape_ComputeAABB_3 = function() {
      return b.asm._emscripten_bind_b2ChainShape_ComputeAABB_3.apply(
        null,
        arguments
      )
    }),
    pc = (b._emscripten_bind_b2PulleyJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    qc = (b._emscripten_bind_b2WeldJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    rc = (b._emscripten_bind_b2MotorJointDef_get_maxForce_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_maxForce_0.apply(
        null,
        arguments
      )
    }),
    sc = (b._emscripten_bind_b2DistanceJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    tc = (b._emscripten_bind_b2BodyDef_get_position_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_position_0.apply(
        null,
        arguments
      )
    }),
    uc = (b._emscripten_bind_b2RevoluteJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    vc = (b._emscripten_bind_b2World_SetContactFilter_1 = function() {
      return b.asm._emscripten_bind_b2World_SetContactFilter_1.apply(
        null,
        arguments
      )
    }),
    wc = (b._emscripten_bind_b2WheelJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    xc = (b._emscripten_bind_b2MouseJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_userData_1.apply(
        null,
        arguments
      )
    })
  b.stackSave = function() {
    return b.asm.stackSave.apply(null, arguments)
  }
  var yc = (b._emscripten_bind_b2FixtureDef_set_restitution_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_restitution_1.apply(
        null,
        arguments
      )
    }),
    zc = (b._emscripten_bind_b2RevoluteJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    Ac = (b._emscripten_bind_b2Mat33_get_ey_0 = function() {
      return b.asm._emscripten_bind_b2Mat33_get_ey_0.apply(null, arguments)
    }),
    Bc = (b._emscripten_bind_b2MouseJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    Cc = (b._emscripten_bind_b2World_GetGravity_0 = function() {
      return b.asm._emscripten_bind_b2World_GetGravity_0.apply(null, arguments)
    }),
    Dc = (b._emscripten_bind_b2Mat33_set_ey_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_set_ey_1.apply(null, arguments)
    }),
    Ec = (b._emscripten_bind_b2Profile_get_broadphase_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_broadphase_0.apply(
        null,
        arguments
      )
    }),
    Fc = (b._emscripten_bind_b2PulleyJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    Gc = (b._emscripten_bind_b2PrismaticJoint_SetLimits_2 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_SetLimits_2.apply(
        null,
        arguments
      )
    }),
    Hc = (b._emscripten_bind_b2PulleyJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Ic = (b._emscripten_bind_b2DistanceJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Jc = (b._emscripten_bind_b2DistanceJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    Kc = (b._emscripten_bind_b2DistanceJointDef_set_dampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_dampingRatio_1.apply(
        null,
        arguments
      )
    }),
    Lc = (b._emscripten_bind_b2RopeJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Mc = (b._emscripten_bind_b2ChainShape_set_m_nextVertex_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_nextVertex_1.apply(
        null,
        arguments
      )
    }),
    Nc = (b._emscripten_bind_JSContactListener_EndContact_1 = function() {
      return b.asm._emscripten_bind_JSContactListener_EndContact_1.apply(
        null,
        arguments
      )
    }),
    Oc = (b._emscripten_bind_b2MassData_set_mass_1 = function() {
      return b.asm._emscripten_bind_b2MassData_set_mass_1.apply(null, arguments)
    }),
    Pc = (b._emscripten_bind_b2Vec3_get_x_0 = function() {
      return b.asm._emscripten_bind_b2Vec3_get_x_0.apply(null, arguments)
    }),
    Qc = (b._emscripten_bind_b2ChainShape_CreateChain_2 = function() {
      return b.asm._emscripten_bind_b2ChainShape_CreateChain_2.apply(
        null,
        arguments
      )
    }),
    Rc = (b._emscripten_bind_b2RopeJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    Sc = (b._emscripten_bind_b2World_DestroyBody_1 = function() {
      return b.asm._emscripten_bind_b2World_DestroyBody_1.apply(null, arguments)
    }),
    Tc = (b._emscripten_bind_b2Profile_get_solvePosition_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_solvePosition_0.apply(
        null,
        arguments
      )
    }),
    Uc = (b._emscripten_bind_b2Shape_RayCast_4 = function() {
      return b.asm._emscripten_bind_b2Shape_RayCast_4.apply(null, arguments)
    }),
    Vc = (b._emscripten_bind_b2PulleyJoint_GetGroundAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetGroundAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Wc = (b._emscripten_bind_b2Mat33___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Mat33___destroy___0.apply(null, arguments)
    }),
    Xc = (b._emscripten_bind_b2GearJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Yc = (b._emscripten_bind_b2WeldJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Zc = (b._emscripten_bind_b2JointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2JointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    })
  b.getTempRet0 = function() {
    return b.asm.getTempRet0.apply(null, arguments)
  }
  var $c = (b._emscripten_bind_b2FrictionJointDef_get_maxTorque_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_maxTorque_0.apply(
        null,
        arguments
      )
    }),
    ad = (b._emscripten_bind_JSQueryCallback_JSQueryCallback_0 = function() {
      return b.asm._emscripten_bind_JSQueryCallback_JSQueryCallback_0.apply(
        null,
        arguments
      )
    }),
    bd = (b._emscripten_bind_b2World_SetAutoClearForces_1 = function() {
      return b.asm._emscripten_bind_b2World_SetAutoClearForces_1.apply(
        null,
        arguments
      )
    }),
    cd = (b._emscripten_bind_b2PrismaticJointDef_set_lowerTranslation_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_lowerTranslation_1.apply(
        null,
        arguments
      )
    }),
    dd = (b._emscripten_bind_b2Contact_GetTangentSpeed_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetTangentSpeed_0.apply(
        null,
        arguments
      )
    }),
    ed = (b._emscripten_bind_b2BodyDef_set_position_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_position_1.apply(
        null,
        arguments
      )
    }),
    fd = (b._emscripten_bind_b2Transform_get_q_0 = function() {
      return b.asm._emscripten_bind_b2Transform_get_q_0.apply(null, arguments)
    }),
    gd = (b._emscripten_bind_b2PolygonShape_set_m_count_1 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_set_m_count_1.apply(
        null,
        arguments
      )
    }),
    hd = (b._emscripten_bind_b2Contact_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetNext_0.apply(null, arguments)
    }),
    id = (b._emscripten_bind_b2MotorJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    jd = (b._emscripten_bind_b2GearJoint_GetJoint1_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetJoint1_0.apply(
        null,
        arguments
      )
    }),
    kd = (b._emscripten_bind_b2World_GetProxyCount_0 = function() {
      return b.asm._emscripten_bind_b2World_GetProxyCount_0.apply(
        null,
        arguments
      )
    }),
    ld = (b._emscripten_bind_b2MotorJoint_SetMaxTorque_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_SetMaxTorque_1.apply(
        null,
        arguments
      )
    }),
    md = (b._emscripten_bind_b2GearJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    nd = (b._emscripten_bind_b2MouseJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    od = (b._emscripten_bind_b2World_SetContactListener_1 = function() {
      return b.asm._emscripten_bind_b2World_SetContactListener_1.apply(
        null,
        arguments
      )
    }),
    pd = (b._emscripten_bind_b2Body_IsAwake_0 = function() {
      return b.asm._emscripten_bind_b2Body_IsAwake_0.apply(null, arguments)
    }),
    qd = (b._emscripten_bind_b2JointEdge_set_other_1 = function() {
      return b.asm._emscripten_bind_b2JointEdge_set_other_1.apply(
        null,
        arguments
      )
    }),
    rd = (b._emscripten_bind_b2MouseJointDef_set_target_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_target_1.apply(
        null,
        arguments
      )
    }),
    sd = (b._emscripten_bind_b2MotorJoint_SetCorrectionFactor_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_SetCorrectionFactor_1.apply(
        null,
        arguments
      )
    }),
    td = (b._emscripten_bind_b2FixtureDef_get_density_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_density_0.apply(
        null,
        arguments
      )
    }),
    ud = (b._emscripten_bind_b2GearJoint_GetRatio_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetRatio_0.apply(
        null,
        arguments
      )
    }),
    vd = (b._emscripten_bind_b2PrismaticJointDef_get_upperTranslation_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_upperTranslation_0.apply(
        null,
        arguments
      )
    }),
    wd = (b._emscripten_bind_b2RevoluteJoint_GetReferenceAngle_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetReferenceAngle_0.apply(
        null,
        arguments
      )
    }),
    xd = (b._emscripten_bind_b2MotorJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    yd = (b._emscripten_enum_b2ManifoldType_e_circles = function() {
      return b.asm._emscripten_enum_b2ManifoldType_e_circles.apply(
        null,
        arguments
      )
    }),
    zd = (b._emscripten_bind_b2PulleyJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    Ad = (b._emscripten_bind_b2RevoluteJointDef_Initialize_3 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_Initialize_3.apply(
        null,
        arguments
      )
    }),
    Bd = (b._emscripten_bind_b2FixtureDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Cd = (b._emscripten_bind_b2DistanceJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    Dd = (b._emscripten_bind_b2FrictionJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Ed = (b._emscripten_bind_b2PrismaticJointDef_get_lowerTranslation_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_lowerTranslation_0.apply(
        null,
        arguments
      )
    }),
    Fd = (b._emscripten_bind_b2GearJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    Gd = (b._emscripten_bind_b2Filter_b2Filter_0 = function() {
      return b.asm._emscripten_bind_b2Filter_b2Filter_0.apply(null, arguments)
    }),
    Hd = (b._emscripten_bind_b2MouseJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    Id = (b._emscripten_bind_b2Body_ApplyAngularImpulse_2 = function() {
      return b.asm._emscripten_bind_b2Body_ApplyAngularImpulse_2.apply(
        null,
        arguments
      )
    }),
    Jd = (b._emscripten_enum_b2JointType_e_frictionJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_frictionJoint.apply(
        null,
        arguments
      )
    }),
    Kd = (b._emscripten_bind_b2RayCastOutput_set_fraction_1 = function() {
      return b.asm._emscripten_bind_b2RayCastOutput_set_fraction_1.apply(
        null,
        arguments
      )
    }),
    Ld = (b._emscripten_bind_b2Color_set_r_1 = function() {
      return b.asm._emscripten_bind_b2Color_set_r_1.apply(null, arguments)
    }),
    Md = (b._emscripten_bind_b2DistanceJointDef_get_length_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_length_0.apply(
        null,
        arguments
      )
    }),
    Nd = (b._emscripten_bind_b2PulleyJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Od = (b._emscripten_bind_b2WheelJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    Pd = (b._emscripten_bind_b2World_GetTreeQuality_0 = function() {
      return b.asm._emscripten_bind_b2World_GetTreeQuality_0.apply(
        null,
        arguments
      )
    }),
    Qd = (b._emscripten_bind_b2BodyDef_set_gravityScale_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_gravityScale_1.apply(
        null,
        arguments
      )
    }),
    Rd = (b._emscripten_bind_b2RopeJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    Sd = (b._emscripten_bind_b2PrismaticJoint_GetLowerLimit_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetLowerLimit_0.apply(
        null,
        arguments
      )
    }),
    Td = (b._emscripten_bind_b2AABB_get_lowerBound_0 = function() {
      return b.asm._emscripten_bind_b2AABB_get_lowerBound_0.apply(
        null,
        arguments
      )
    }),
    Ud = (b._emscripten_bind_b2WheelJoint_SetMotorSpeed_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_SetMotorSpeed_1.apply(
        null,
        arguments
      )
    }),
    Vd = (b._emscripten_bind_b2PrismaticJointDef_get_referenceAngle_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_referenceAngle_0.apply(
        null,
        arguments
      )
    }),
    Wd = (b._emscripten_bind_b2Body_SetMassData_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetMassData_1.apply(null, arguments)
    }),
    Xd = (b._emscripten_bind_b2BodyDef_get_angularVelocity_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_angularVelocity_0.apply(
        null,
        arguments
      )
    }),
    Yd = (b._emscripten_bind_b2WeldJoint_SetDampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_SetDampingRatio_1.apply(
        null,
        arguments
      )
    }),
    Zd = (b._emscripten_bind_b2PrismaticJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    $d = (b._emscripten_bind_b2Contact_IsTouching_0 = function() {
      return b.asm._emscripten_bind_b2Contact_IsTouching_0.apply(
        null,
        arguments
      )
    }),
    ae = (b._emscripten_bind_b2Draw_SetFlags_1 = function() {
      return b.asm._emscripten_bind_b2Draw_SetFlags_1.apply(null, arguments)
    }),
    be = (b._emscripten_bind_b2AABB_Contains_1 = function() {
      return b.asm._emscripten_bind_b2AABB_Contains_1.apply(null, arguments)
    }),
    ce = (b._emscripten_bind_b2DistanceJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    de = (b._emscripten_bind_b2EdgeShape_set_m_radius_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_radius_1.apply(
        null,
        arguments
      )
    }),
    ee = (b._emscripten_bind_b2DistanceJointDef_get_dampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_dampingRatio_0.apply(
        null,
        arguments
      )
    }),
    fe = (b._emscripten_bind_b2DistanceJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    ge = (b._emscripten_bind_b2PrismaticJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    he = (b._emscripten_bind_b2Fixture_GetRestitution_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetRestitution_0.apply(
        null,
        arguments
      )
    }),
    ie = (b._emscripten_bind_b2Transform_set_q_1 = function() {
      return b.asm._emscripten_bind_b2Transform_set_q_1.apply(null, arguments)
    }),
    je = (b._emscripten_bind_b2PolygonShape___destroy___0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape___destroy___0.apply(
        null,
        arguments
      )
    }),
    ke = (b._emscripten_bind_b2AABB_get_upperBound_0 = function() {
      return b.asm._emscripten_bind_b2AABB_get_upperBound_0.apply(
        null,
        arguments
      )
    }),
    le = (b._emscripten_bind_b2Transform___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Transform___destroy___0.apply(
        null,
        arguments
      )
    }),
    me = (b._emscripten_bind_b2Body_GetLinearVelocity_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetLinearVelocity_0.apply(
        null,
        arguments
      )
    }),
    ne = (b._emscripten_bind_b2CircleShape_set_m_radius_1 = function() {
      return b.asm._emscripten_bind_b2CircleShape_set_m_radius_1.apply(
        null,
        arguments
      )
    }),
    oe = (b._emscripten_bind_b2EdgeShape_set_m_hasVertex0_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_hasVertex0_1.apply(
        null,
        arguments
      )
    }),
    pe = (b._emscripten_bind_b2RopeJoint_GetMaxLength_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetMaxLength_0.apply(
        null,
        arguments
      )
    }),
    qe = (b._emscripten_bind_b2GearJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    re = (b._emscripten_bind_b2MotorJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    se = (b._emscripten_bind_b2GearJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    te = (b._emscripten_bind_b2DistanceJoint_SetDampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_SetDampingRatio_1.apply(
        null,
        arguments
      )
    }),
    ue = (b._emscripten_bind_b2Contact_GetFixtureA_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetFixtureA_0.apply(
        null,
        arguments
      )
    }),
    ve = (b._emscripten_bind_b2PulleyJointDef_get_ratio_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_ratio_0.apply(
        null,
        arguments
      )
    }),
    we = (b._emscripten_bind_b2PrismaticJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    xe = (b._emscripten_bind_b2CircleShape_set_m_type_1 = function() {
      return b.asm._emscripten_bind_b2CircleShape_set_m_type_1.apply(
        null,
        arguments
      )
    }),
    ye = (b._emscripten_bind_b2DistanceJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    ze = (b._emscripten_bind_b2RopeJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Ae = (b._emscripten_bind_b2AABB_set_upperBound_1 = function() {
      return b.asm._emscripten_bind_b2AABB_set_upperBound_1.apply(
        null,
        arguments
      )
    }),
    Be = (b._emscripten_bind_JSRayCastCallback_ReportFixture_4 = function() {
      return b.asm._emscripten_bind_JSRayCastCallback_ReportFixture_4.apply(
        null,
        arguments
      )
    }),
    Ce = (b._emscripten_bind_b2ContactImpulse___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ContactImpulse___destroy___0.apply(
        null,
        arguments
      )
    }),
    De = (b._emscripten_bind_b2FrictionJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Ee = (b._emscripten_bind_b2PulleyJointDef_set_lengthB_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_lengthB_1.apply(
        null,
        arguments
      )
    }),
    Fe = (b._emscripten_bind_b2RayCastInput___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RayCastInput___destroy___0.apply(
        null,
        arguments
      )
    }),
    Ge = (b._emscripten_bind_b2Body_ApplyForceToCenter_2 = function() {
      return b.asm._emscripten_bind_b2Body_ApplyForceToCenter_2.apply(
        null,
        arguments
      )
    }),
    He = (b._emscripten_bind_JSDestructionListener_JSDestructionListener_0 = function() {
      return b.asm._emscripten_bind_JSDestructionListener_JSDestructionListener_0.apply(
        null,
        arguments
      )
    }),
    Ie = (b._emscripten_bind_b2WheelJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    Je = (b._emscripten_bind_b2FrictionJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Ke = (b._emscripten_bind_b2WeldJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    Le = (b._emscripten_bind_b2DistanceJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Me = (b._emscripten_enum_b2JointType_e_wheelJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_wheelJoint.apply(
        null,
        arguments
      )
    }),
    Ne = (b._emscripten_bind_b2JointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2JointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    Oe = (b._emscripten_bind_b2ContactEdge___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ContactEdge___destroy___0.apply(
        null,
        arguments
      )
    }),
    Pe = (b._emscripten_bind_b2Filter_get_groupIndex_0 = function() {
      return b.asm._emscripten_bind_b2Filter_get_groupIndex_0.apply(
        null,
        arguments
      )
    }),
    Qe = (b._emscripten_bind_b2FrictionJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Re = (b._emscripten_bind_b2CircleShape_GetChildCount_0 = function() {
      return b.asm._emscripten_bind_b2CircleShape_GetChildCount_0.apply(
        null,
        arguments
      )
    }),
    Se = (b._emscripten_bind_b2BodyDef_get_bullet_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_bullet_0.apply(
        null,
        arguments
      )
    }),
    Te = (b._emscripten_bind_b2Color_set_b_1 = function() {
      return b.asm._emscripten_bind_b2Color_set_b_1.apply(null, arguments)
    }),
    Ue = (b._emscripten_bind_b2Mat33_get_ez_0 = function() {
      return b.asm._emscripten_bind_b2Mat33_get_ez_0.apply(null, arguments)
    }),
    Ve = (b._emscripten_bind_b2MassData_get_center_0 = function() {
      return b.asm._emscripten_bind_b2MassData_get_center_0.apply(
        null,
        arguments
      )
    }),
    We = (b._emscripten_bind_b2WeldJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Xe = (b._emscripten_bind_b2WheelJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    Ye = (b._emscripten_bind_b2World_SetSubStepping_1 = function() {
      return b.asm._emscripten_bind_b2World_SetSubStepping_1.apply(
        null,
        arguments
      )
    }),
    Ze = (b._emscripten_bind_b2Vec2_op_add_1 = function() {
      return b.asm._emscripten_bind_b2Vec2_op_add_1.apply(null, arguments)
    }),
    $e = (b._emscripten_bind_JSDraw_DrawSegment_3 = function() {
      return b.asm._emscripten_bind_JSDraw_DrawSegment_3.apply(null, arguments)
    }),
    af = (b._emscripten_bind_b2Joint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    bf = (b._emscripten_bind_b2MotorJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    cf = (b._emscripten_bind_b2FrictionJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    df = (b._emscripten_bind_b2WheelJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    ef = (b._emscripten_bind_b2BodyDef_get_gravityScale_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_gravityScale_0.apply(
        null,
        arguments
      )
    }),
    ff = (b._emscripten_bind_b2Vec3_SetZero_0 = function() {
      return b.asm._emscripten_bind_b2Vec3_SetZero_0.apply(null, arguments)
    }),
    gf = (b._emscripten_enum_b2JointType_e_pulleyJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_pulleyJoint.apply(
        null,
        arguments
      )
    }),
    hf = (b._emscripten_bind_b2ChainShape_get_m_nextVertex_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_nextVertex_0.apply(
        null,
        arguments
      )
    }),
    jf = (b._emscripten_bind_b2Contact_SetEnabled_1 = function() {
      return b.asm._emscripten_bind_b2Contact_SetEnabled_1.apply(
        null,
        arguments
      )
    }),
    kf = (b._emscripten_bind_b2Shape_set_m_radius_1 = function() {
      return b.asm._emscripten_bind_b2Shape_set_m_radius_1.apply(
        null,
        arguments
      )
    }),
    lf = (b._emscripten_bind_b2World_SetDebugDraw_1 = function() {
      return b.asm._emscripten_bind_b2World_SetDebugDraw_1.apply(
        null,
        arguments
      )
    }),
    mf = (b._emscripten_bind_b2ContactID_set_key_1 = function() {
      return b.asm._emscripten_bind_b2ContactID_set_key_1.apply(null, arguments)
    }),
    Ca = (b._malloc = function() {
      return b.asm._malloc.apply(null, arguments)
    }),
    nf = (b._emscripten_bind_b2WheelJoint_GetMaxMotorTorque_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetMaxMotorTorque_0.apply(
        null,
        arguments
      )
    }),
    of = (b._emscripten_bind_b2Vec2_Normalize_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_Normalize_0.apply(null, arguments)
    }),
    pf = (b._emscripten_bind_b2WheelJoint_GetJointSpeed_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetJointSpeed_0.apply(
        null,
        arguments
      )
    }),
    qf = (b._emscripten_bind_b2FrictionJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    rf = (b._emscripten_bind_b2ChainShape_set_m_vertices_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_vertices_1.apply(
        null,
        arguments
      )
    }),
    sf = (b._emscripten_bind_JSRayCastCallback_JSRayCastCallback_0 = function() {
      return b.asm._emscripten_bind_JSRayCastCallback_JSRayCastCallback_0.apply(
        null,
        arguments
      )
    }),
    tf = (b._emscripten_bind_b2RayCastInput_set_p2_1 = function() {
      return b.asm._emscripten_bind_b2RayCastInput_set_p2_1.apply(
        null,
        arguments
      )
    }),
    uf = (b._emscripten_bind_b2RevoluteJointDef_get_motorSpeed_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_motorSpeed_0.apply(
        null,
        arguments
      )
    }),
    vf = (b._emscripten_bind_b2Manifold_get_pointCount_0 = function() {
      return b.asm._emscripten_bind_b2Manifold_get_pointCount_0.apply(
        null,
        arguments
      )
    }),
    wf = (b._emscripten_bind_b2RayCastOutput_get_normal_0 = function() {
      return b.asm._emscripten_bind_b2RayCastOutput_get_normal_0.apply(
        null,
        arguments
      )
    }),
    xf = (b._emscripten_bind_b2WeldJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    yf = (b._emscripten_enum_b2DrawFlag_e_jointBit = function() {
      return b.asm._emscripten_enum_b2DrawFlag_e_jointBit.apply(null, arguments)
    }),
    zf = (b._emscripten_bind_b2FixtureDef_get_isSensor_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_isSensor_0.apply(
        null,
        arguments
      )
    }),
    Af = (b._emscripten_bind_b2PrismaticJointDef_Initialize_4 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_Initialize_4.apply(
        null,
        arguments
      )
    }),
    Bf = (b._emscripten_bind_b2PulleyJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    Cf = (b._emscripten_bind_b2WheelJoint_EnableMotor_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_EnableMotor_1.apply(
        null,
        arguments
      )
    }),
    Df = (b._emscripten_bind_b2RevoluteJoint_GetJointSpeed_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetJointSpeed_0.apply(
        null,
        arguments
      )
    }),
    Ef = (b._emscripten_bind_JSDraw_DrawSolidPolygon_3 = function() {
      return b.asm._emscripten_bind_JSDraw_DrawSolidPolygon_3.apply(
        null,
        arguments
      )
    }),
    Ff = (b._emscripten_bind_b2Rot_Set_1 = function() {
      return b.asm._emscripten_bind_b2Rot_Set_1.apply(null, arguments)
    }),
    Gf = (b._emscripten_bind_b2RevoluteJoint_GetJointAngle_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetJointAngle_0.apply(
        null,
        arguments
      )
    }),
    Hf = (b._emscripten_bind_JSDraw___destroy___0 = function() {
      return b.asm._emscripten_bind_JSDraw___destroy___0.apply(null, arguments)
    }),
    If = (b._emscripten_bind_b2MouseJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    Jf = (b._emscripten_bind_b2Mat33_Solve22_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_Solve22_1.apply(null, arguments)
    }),
    Kf = (b._emscripten_bind_b2Profile_set_solvePosition_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_solvePosition_1.apply(
        null,
        arguments
      )
    }),
    Lf = (b._emscripten_bind_b2ContactFilter___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ContactFilter___destroy___0.apply(
        null,
        arguments
      )
    }),
    Mf = (b._emscripten_bind_b2WheelJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Nf = (b._emscripten_bind_b2ChainShape_set_m_hasPrevVertex_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_hasPrevVertex_1.apply(
        null,
        arguments
      )
    }),
    Of = (b._emscripten_bind_b2DistanceJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    Pf = (b._emscripten_bind_b2PrismaticJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Qf = (b._emscripten_bind_b2RopeJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    Rf = (b._emscripten_bind_b2GearJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2GearJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Sf = (b._emscripten_bind_b2PrismaticJoint_GetJointTranslation_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetJointTranslation_0.apply(
        null,
        arguments
      )
    }),
    Tf = (b._emscripten_bind_b2ManifoldPoint_get_id_0 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_get_id_0.apply(
        null,
        arguments
      )
    }),
    Uf = (b._emscripten_bind_b2CircleShape_get_m_radius_0 = function() {
      return b.asm._emscripten_bind_b2CircleShape_get_m_radius_0.apply(
        null,
        arguments
      )
    }),
    Vf = (b._emscripten_bind_b2PrismaticJoint_GetMotorSpeed_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetMotorSpeed_0.apply(
        null,
        arguments
      )
    }),
    Wf = (b._emscripten_bind_b2PulleyJoint_GetGroundAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetGroundAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Xf = (b._emscripten_bind_b2Vec3_op_add_1 = function() {
      return b.asm._emscripten_bind_b2Vec3_op_add_1.apply(null, arguments)
    }),
    Yf = (b._emscripten_bind_b2FrictionJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    Zf = (b._emscripten_bind_b2MouseJoint_GetMaxForce_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetMaxForce_0.apply(
        null,
        arguments
      )
    }),
    $f = (b._emscripten_bind_b2MouseJoint_SetTarget_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_SetTarget_1.apply(
        null,
        arguments
      )
    }),
    ag = (b._emscripten_bind_b2MouseJointDef_get_dampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_dampingRatio_0.apply(
        null,
        arguments
      )
    }),
    bg = (b._emscripten_bind_b2RevoluteJoint_GetMotorSpeed_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetMotorSpeed_0.apply(
        null,
        arguments
      )
    }),
    cg = (b._emscripten_bind_b2ChainShape_set_m_type_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_type_1.apply(
        null,
        arguments
      )
    }),
    dg = (b._emscripten_bind_b2RevoluteJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    eg = (b._emscripten_bind_b2Rot_GetXAxis_0 = function() {
      return b.asm._emscripten_bind_b2Rot_GetXAxis_0.apply(null, arguments)
    }),
    fg = (b._emscripten_bind_b2Mat33_b2Mat33_0 = function() {
      return b.asm._emscripten_bind_b2Mat33_b2Mat33_0.apply(null, arguments)
    }),
    gg = (b._emscripten_bind_b2MouseJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    hg = (b._emscripten_bind_b2Body_GetWorldVector_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetWorldVector_1.apply(
        null,
        arguments
      )
    }),
    ig = (b._emscripten_bind_b2WeldJointDef_get_frequencyHz_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_frequencyHz_0.apply(
        null,
        arguments
      )
    }),
    jg = (b._emscripten_bind_b2GearJointDef_set_ratio_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_ratio_1.apply(
        null,
        arguments
      )
    }),
    kg = (b._emscripten_bind_b2Manifold___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Manifold___destroy___0.apply(
        null,
        arguments
      )
    }),
    lg = (b._emscripten_bind_b2PulleyJointDef_set_lengthA_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_lengthA_1.apply(
        null,
        arguments
      )
    }),
    mg = (b._emscripten_bind_b2Contact_IsEnabled_0 = function() {
      return b.asm._emscripten_bind_b2Contact_IsEnabled_0.apply(null, arguments)
    })
  b.stackRestore = function() {
    return b.asm.stackRestore.apply(null, arguments)
  }
  var ng = (b._emscripten_bind_b2World_CreateJoint_1 = function() {
      return b.asm._emscripten_bind_b2World_CreateJoint_1.apply(null, arguments)
    }),
    og = (b._emscripten_bind_b2PulleyJointDef_set_ratio_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_ratio_1.apply(
        null,
        arguments
      )
    }),
    pg = (b._emscripten_bind_b2JointEdge_set_prev_1 = function() {
      return b.asm._emscripten_bind_b2JointEdge_set_prev_1.apply(
        null,
        arguments
      )
    }),
    qg = (b._emscripten_bind_b2PrismaticJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    rg = (b._emscripten_bind_b2Body_GetLocalPoint_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetLocalPoint_1.apply(
        null,
        arguments
      )
    }),
    sg = (b._emscripten_bind_b2PrismaticJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    tg = (b._emscripten_bind_b2DistanceJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    ug = (b._emscripten_bind_b2RopeJoint_GetLimitState_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetLimitState_0.apply(
        null,
        arguments
      )
    }),
    vg = (b._emscripten_bind_b2Profile_get_solveTOI_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_solveTOI_0.apply(
        null,
        arguments
      )
    }),
    wg = (b._emscripten_bind_b2Vec2_b2Vec2_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_b2Vec2_0.apply(null, arguments)
    }),
    xg = (b._emscripten_bind_b2DistanceJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    yg = (b._emscripten_bind_b2WheelJointDef_get_maxMotorTorque_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_maxMotorTorque_0.apply(
        null,
        arguments
      )
    }),
    zg = (b._emscripten_bind_b2Vec2_op_sub_1 = function() {
      return b.asm._emscripten_bind_b2Vec2_op_sub_1.apply(null, arguments)
    }),
    Ag = (b._emscripten_bind_b2CircleShape_get_m_p_0 = function() {
      return b.asm._emscripten_bind_b2CircleShape_get_m_p_0.apply(
        null,
        arguments
      )
    }),
    Bg = (b._emscripten_bind_b2ContactFeature_get_indexA_0 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_get_indexA_0.apply(
        null,
        arguments
      )
    }),
    Cg = (b._emscripten_bind_b2MotorJointDef_b2MotorJointDef_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_b2MotorJointDef_0.apply(
        null,
        arguments
      )
    }),
    Dg = (b._emscripten_bind_b2RevoluteJoint_EnableLimit_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_EnableLimit_1.apply(
        null,
        arguments
      )
    }),
    Eg = (b._emscripten_bind_b2ContactEdge_get_next_0 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_get_next_0.apply(
        null,
        arguments
      )
    }),
    Fg = (b._emscripten_bind_b2AABB_GetPerimeter_0 = function() {
      return b.asm._emscripten_bind_b2AABB_GetPerimeter_0.apply(null, arguments)
    }),
    Gg = (b._emscripten_bind_b2RevoluteJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    Hg = (b._emscripten_bind_b2Mat33_get_ex_0 = function() {
      return b.asm._emscripten_bind_b2Mat33_get_ex_0.apply(null, arguments)
    }),
    Ig = (b._emscripten_bind_b2Body_GetPosition_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetPosition_0.apply(null, arguments)
    }),
    Jg = (b._emscripten_bind_b2Profile___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Profile___destroy___0.apply(
        null,
        arguments
      )
    }),
    Kg = (b._emscripten_bind_b2ContactEdge_get_prev_0 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_get_prev_0.apply(
        null,
        arguments
      )
    }),
    Lg = (b._emscripten_bind_b2DistanceJoint_SetFrequency_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_SetFrequency_1.apply(
        null,
        arguments
      )
    }),
    Mg = (b._emscripten_bind_b2Fixture_GetBody_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetBody_0.apply(null, arguments)
    }),
    Ng = (b._emscripten_bind_b2ContactImpulse_set_count_1 = function() {
      return b.asm._emscripten_bind_b2ContactImpulse_set_count_1.apply(
        null,
        arguments
      )
    }),
    Og = (b._emscripten_bind_b2FixtureDef_set_shape_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_shape_1.apply(
        null,
        arguments
      )
    }),
    Pg = (b._emscripten_bind_b2PulleyJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    Qg = (b._emscripten_bind_b2ChainShape_GetChildCount_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_GetChildCount_0.apply(
        null,
        arguments
      )
    }),
    Rg = (b._emscripten_bind_b2CircleShape_b2CircleShape_0 = function() {
      return b.asm._emscripten_bind_b2CircleShape_b2CircleShape_0.apply(
        null,
        arguments
      )
    }),
    Sg = (b._emscripten_bind_b2RevoluteJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Tg = (b._emscripten_bind_b2Fixture_SetDensity_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_SetDensity_1.apply(
        null,
        arguments
      )
    }),
    Ug = (b._emscripten_bind_b2ChainShape_get_m_prevVertex_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_prevVertex_0.apply(
        null,
        arguments
      )
    }),
    Vg = (b._emscripten_bind_b2AABB_GetExtents_0 = function() {
      return b.asm._emscripten_bind_b2AABB_GetExtents_0.apply(null, arguments)
    }),
    Wg = (b._emscripten_bind_b2World_ClearForces_0 = function() {
      return b.asm._emscripten_bind_b2World_ClearForces_0.apply(null, arguments)
    }),
    Xg = (b._emscripten_bind_b2Vec3___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Vec3___destroy___0.apply(null, arguments)
    }),
    Yg = (b._emscripten_bind_b2WheelJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    Zg = (b._emscripten_bind_b2WeldJoint_SetFrequency_1 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_SetFrequency_1.apply(
        null,
        arguments
      )
    }),
    $g = (b._emscripten_bind_JSContactListener_PreSolve_2 = function() {
      return b.asm._emscripten_bind_JSContactListener_PreSolve_2.apply(
        null,
        arguments
      )
    }),
    ah = (b._emscripten_bind_b2Body_SetFixedRotation_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetFixedRotation_1.apply(
        null,
        arguments
      )
    }),
    bh = (b._emscripten_bind_b2RayCastOutput_set_normal_1 = function() {
      return b.asm._emscripten_bind_b2RayCastOutput_set_normal_1.apply(
        null,
        arguments
      )
    }),
    ch = (b._emscripten_bind_b2DistanceJoint_GetDampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetDampingRatio_0.apply(
        null,
        arguments
      )
    }),
    dh = (b._emscripten_bind_b2RevoluteJoint_SetMaxMotorTorque_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_SetMaxMotorTorque_1.apply(
        null,
        arguments
      )
    }),
    eh = (b._emscripten_bind_b2RevoluteJoint_EnableMotor_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_EnableMotor_1.apply(
        null,
        arguments
      )
    }),
    fh = (b._emscripten_bind_b2Contact_GetChildIndexB_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetChildIndexB_0.apply(
        null,
        arguments
      )
    }),
    gh = (b._emscripten_bind_b2MouseJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    hh = (b._emscripten_bind_b2CircleShape_GetType_0 = function() {
      return b.asm._emscripten_bind_b2CircleShape_GetType_0.apply(
        null,
        arguments
      )
    }),
    ih = (b._emscripten_bind_b2PolygonShape_GetType_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_GetType_0.apply(
        null,
        arguments
      )
    }),
    jh = (b._emscripten_bind_b2PrismaticJointDef_set_referenceAngle_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_referenceAngle_1.apply(
        null,
        arguments
      )
    }),
    kh = (b._emscripten_bind_b2RopeJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    lh = (b._emscripten_bind_b2FixtureDef_set_filter_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_filter_1.apply(
        null,
        arguments
      )
    }),
    mh = (b._emscripten_bind_b2Body_ApplyTorque_2 = function() {
      return b.asm._emscripten_bind_b2Body_ApplyTorque_2.apply(null, arguments)
    }),
    nh = (b._emscripten_bind_b2RevoluteJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    oh = (b._emscripten_bind_b2FrictionJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    ph = (b._emscripten_bind_b2RayCastCallback___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RayCastCallback___destroy___0.apply(
        null,
        arguments
      )
    }),
    qh = (b._emscripten_bind_b2RevoluteJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    rh = (b._emscripten_bind_b2MotorJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    sh = (b._emscripten_bind_b2PrismaticJoint_GetLocalAxisA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetLocalAxisA_0.apply(
        null,
        arguments
      )
    }),
    th = (b._emscripten_bind_b2MotorJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    uh = (b._emscripten_bind_b2Transform_Set_2 = function() {
      return b.asm._emscripten_bind_b2Transform_Set_2.apply(null, arguments)
    }),
    vh = (b._emscripten_bind_b2MotorJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    })
  b.stackAlloc = function() {
    return b.asm.stackAlloc.apply(null, arguments)
  }
  var wh = (b._emscripten_bind_b2Draw_AppendFlags_1 = function() {
      return b.asm._emscripten_bind_b2Draw_AppendFlags_1.apply(null, arguments)
    }),
    xh = (b._emscripten_bind_b2EdgeShape_GetChildCount_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_GetChildCount_0.apply(
        null,
        arguments
      )
    }),
    yh = (b._emscripten_bind_b2Contact_ResetFriction_0 = function() {
      return b.asm._emscripten_bind_b2Contact_ResetFriction_0.apply(
        null,
        arguments
      )
    }),
    zh = (b._emscripten_bind_b2Profile_set_solveTOI_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_solveTOI_1.apply(
        null,
        arguments
      )
    }),
    Ah = (b._emscripten_bind_b2PrismaticJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    Bh = (b._emscripten_bind_b2AABB_GetCenter_0 = function() {
      return b.asm._emscripten_bind_b2AABB_GetCenter_0.apply(null, arguments)
    }),
    Ch = (b._emscripten_bind_b2WheelJoint_SetSpringFrequencyHz_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_SetSpringFrequencyHz_1.apply(
        null,
        arguments
      )
    }),
    Dh = (b._emscripten_bind_b2FrictionJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    Eh = (b._emscripten_bind_b2PrismaticJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    Fh = (b._emscripten_bind_b2Transform_b2Transform_0 = function() {
      return b.asm._emscripten_bind_b2Transform_b2Transform_0.apply(
        null,
        arguments
      )
    }),
    Gh = (b._emscripten_enum_b2LimitState_e_equalLimits = function() {
      return b.asm._emscripten_enum_b2LimitState_e_equalLimits.apply(
        null,
        arguments
      )
    }),
    Hh = (b._emscripten_bind_b2ManifoldPoint_set_normalImpulse_1 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_set_normalImpulse_1.apply(
        null,
        arguments
      )
    }),
    Ih = (b._emscripten_bind_b2Body_IsFixedRotation_0 = function() {
      return b.asm._emscripten_bind_b2Body_IsFixedRotation_0.apply(
        null,
        arguments
      )
    }),
    Jh = (b._emscripten_enum_b2DrawFlag_e_shapeBit = function() {
      return b.asm._emscripten_enum_b2DrawFlag_e_shapeBit.apply(null, arguments)
    }),
    Kh = (b._emscripten_bind_b2Contact_GetFriction_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetFriction_0.apply(
        null,
        arguments
      )
    }),
    Lh = (b._emscripten_bind_b2Body_GetContactList_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetContactList_0.apply(
        null,
        arguments
      )
    }),
    Mh = (b._emscripten_bind_b2DistanceJointDef_set_length_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_length_1.apply(
        null,
        arguments
      )
    }),
    Nh = (b._emscripten_bind_b2DistanceJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Oh = (b._emscripten_bind_b2FrictionJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Ph = (b._emscripten_bind_b2World_b2World_1 = function() {
      return b.asm._emscripten_bind_b2World_b2World_1.apply(null, arguments)
    }),
    Qh = (b._emscripten_bind_b2PrismaticJoint_IsLimitEnabled_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_IsLimitEnabled_0.apply(
        null,
        arguments
      )
    }),
    Rh = (b._emscripten_bind_b2DistanceJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    Sh = (b._emscripten_bind_b2Draw_ClearFlags_1 = function() {
      return b.asm._emscripten_bind_b2Draw_ClearFlags_1.apply(null, arguments)
    }),
    Th = (b._emscripten_bind_b2Body_SetAngularDamping_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetAngularDamping_1.apply(
        null,
        arguments
      )
    }),
    Uh = (b._emscripten_bind_b2Body_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2Body_IsActive_0.apply(null, arguments)
    }),
    Vh = (b._emscripten_bind_b2Contact_ResetRestitution_0 = function() {
      return b.asm._emscripten_bind_b2Contact_ResetRestitution_0.apply(
        null,
        arguments
      )
    }),
    Wh = (b._emscripten_bind_b2World_GetAllowSleeping_0 = function() {
      return b.asm._emscripten_bind_b2World_GetAllowSleeping_0.apply(
        null,
        arguments
      )
    }),
    Xh = (b._emscripten_bind_b2ManifoldPoint_b2ManifoldPoint_0 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_b2ManifoldPoint_0.apply(
        null,
        arguments
      )
    }),
    Yh = (b._emscripten_bind_b2EdgeShape_set_m_type_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_type_1.apply(
        null,
        arguments
      )
    }),
    Zh = (b._emscripten_enum_b2JointType_e_unknownJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_unknownJoint.apply(
        null,
        arguments
      )
    }),
    $h = (b._emscripten_bind_b2RevoluteJointDef_set_enableMotor_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_enableMotor_1.apply(
        null,
        arguments
      )
    }),
    ai = (b._emscripten_bind_b2PulleyJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    bi = (b._emscripten_bind_b2MouseJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    ci = (b._emscripten_bind_b2RevoluteJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    di = (b._emscripten_bind_b2Manifold_get_localPoint_0 = function() {
      return b.asm._emscripten_bind_b2Manifold_get_localPoint_0.apply(
        null,
        arguments
      )
    }),
    ei = (b._emscripten_bind_b2PulleyJointDef_get_lengthB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_lengthB_0.apply(
        null,
        arguments
      )
    }),
    fi = (b._emscripten_bind_b2WeldJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    gi = (b._emscripten_bind_b2ChainShape_CreateLoop_2 = function() {
      return b.asm._emscripten_bind_b2ChainShape_CreateLoop_2.apply(
        null,
        arguments
      )
    }),
    hi = (b._emscripten_bind_b2GearJointDef_get_joint1_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_joint1_0.apply(
        null,
        arguments
      )
    }),
    ii = (b._emscripten_bind_b2PrismaticJoint_GetMotorForce_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetMotorForce_1.apply(
        null,
        arguments
      )
    }),
    ji = (b._emscripten_bind_b2Body_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetUserData_1.apply(null, arguments)
    }),
    ki = (b._emscripten_bind_b2GearJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    li = (b._emscripten_bind_b2EdgeShape_get_m_vertex0_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_vertex0_0.apply(
        null,
        arguments
      )
    }),
    mi = (b._emscripten_enum_b2JointType_e_revoluteJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_revoluteJoint.apply(
        null,
        arguments
      )
    }),
    ni = (b._emscripten_bind_b2Vec2_get_x_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_get_x_0.apply(null, arguments)
    }),
    oi = (b._emscripten_bind_b2WeldJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    pi = (b._emscripten_bind_b2FrictionJoint_GetMaxTorque_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetMaxTorque_0.apply(
        null,
        arguments
      )
    }),
    qi = (b._emscripten_bind_b2EdgeShape_RayCast_4 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_RayCast_4.apply(null, arguments)
    }),
    ri = (b._emscripten_bind_b2BodyDef_set_allowSleep_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_allowSleep_1.apply(
        null,
        arguments
      )
    }),
    si = (b._emscripten_bind_b2PulleyJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    ti = (b._emscripten_bind_b2WeldJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    ui = (b._emscripten_bind_b2Profile_set_step_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_step_1.apply(null, arguments)
    }),
    vi = (b._emscripten_bind_b2ContactEdge_set_other_1 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_set_other_1.apply(
        null,
        arguments
      )
    }),
    wi = (b._emscripten_bind_b2PulleyJoint_GetCurrentLengthB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetCurrentLengthB_0.apply(
        null,
        arguments
      )
    }),
    xi = (b._emscripten_bind_b2Vec2_op_mul_1 = function() {
      return b.asm._emscripten_bind_b2Vec2_op_mul_1.apply(null, arguments)
    }),
    yi = (b._emscripten_bind_b2PrismaticJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    zi = (b._emscripten_bind_b2EdgeShape___destroy___0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape___destroy___0.apply(
        null,
        arguments
      )
    }),
    Ai = (b._emscripten_bind_b2PolygonShape_get_m_count_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_get_m_count_0.apply(
        null,
        arguments
      )
    }),
    Bi = (b._emscripten_bind_b2RopeJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Ci = (b._emscripten_bind_b2DistanceJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    Di = (b._emscripten_bind_b2AABB_Combine_2 = function() {
      return b.asm._emscripten_bind_b2AABB_Combine_2.apply(null, arguments)
    }),
    Ei = (b._emscripten_bind_b2ManifoldPoint_set_tangentImpulse_1 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_set_tangentImpulse_1.apply(
        null,
        arguments
      )
    }),
    Fi = (b._emscripten_bind_b2BodyDef_get_allowSleep_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_allowSleep_0.apply(
        null,
        arguments
      )
    }),
    Gi = (b._emscripten_bind_b2ContactEdge_get_other_0 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_get_other_0.apply(
        null,
        arguments
      )
    }),
    Hi = (b._emscripten_bind_b2RopeJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Ii = (b._emscripten_bind_b2PulleyJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    Ji = (b._emscripten_bind_b2MouseJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Ki = (b._emscripten_bind_b2PolygonShape_TestPoint_2 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_TestPoint_2.apply(
        null,
        arguments
      )
    }),
    Li = (b._emscripten_bind_b2JointEdge_get_other_0 = function() {
      return b.asm._emscripten_bind_b2JointEdge_get_other_0.apply(
        null,
        arguments
      )
    }),
    Mi = (b._emscripten_bind_b2PolygonShape_b2PolygonShape_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_b2PolygonShape_0.apply(
        null,
        arguments
      )
    }),
    Ni = (b._emscripten_bind_b2PolygonShape_Set_2 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_Set_2.apply(null, arguments)
    }),
    Oi = (b._emscripten_bind_b2GearJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    Pi = (b._emscripten_bind_b2DistanceJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Qi = (b._emscripten_bind_b2Fixture_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    Ri = (b._emscripten_bind_b2Contact_SetTangentSpeed_1 = function() {
      return b.asm._emscripten_bind_b2Contact_SetTangentSpeed_1.apply(
        null,
        arguments
      )
    }),
    Si = (b._emscripten_bind_b2PrismaticJointDef_b2PrismaticJointDef_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_b2PrismaticJointDef_0.apply(
        null,
        arguments
      )
    }),
    Ti = (b._emscripten_bind_b2BodyDef_get_active_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_active_0.apply(
        null,
        arguments
      )
    }),
    Ui = (b._emscripten_bind_b2Body_GetAngularVelocity_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetAngularVelocity_0.apply(
        null,
        arguments
      )
    }),
    Vi = (b._emscripten_bind_b2CircleShape_set_m_p_1 = function() {
      return b.asm._emscripten_bind_b2CircleShape_set_m_p_1.apply(
        null,
        arguments
      )
    }),
    Wi = (b._emscripten_bind_b2Draw___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Draw___destroy___0.apply(null, arguments)
    }),
    Xi = (b._emscripten_bind_b2WheelJointDef_Initialize_4 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_Initialize_4.apply(
        null,
        arguments
      )
    }),
    Yi = (b._emscripten_bind_b2WeldJointDef_set_dampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_dampingRatio_1.apply(
        null,
        arguments
      )
    }),
    Zi = (b._emscripten_bind_b2ChainShape_b2ChainShape_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_b2ChainShape_0.apply(
        null,
        arguments
      )
    }),
    $i = (b._emscripten_bind_b2Joint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetAnchorB_0.apply(null, arguments)
    }),
    aj = (b._emscripten_bind_b2PrismaticJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    bj = (b._emscripten_bind_b2MotorJoint_GetMaxForce_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetMaxForce_0.apply(
        null,
        arguments
      )
    }),
    cj = (b._emscripten_bind_b2RevoluteJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    dj = (b._emscripten_bind_b2ContactID_set_cf_1 = function() {
      return b.asm._emscripten_bind_b2ContactID_set_cf_1.apply(null, arguments)
    }),
    ej = (b._emscripten_bind_b2Body_GetGravityScale_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetGravityScale_0.apply(
        null,
        arguments
      )
    }),
    fj = (b._emscripten_bind_b2Vec3_Set_3 = function() {
      return b.asm._emscripten_bind_b2Vec3_Set_3.apply(null, arguments)
    }),
    gj = (b._emscripten_bind_b2RevoluteJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    hj = (b._emscripten_bind_b2FrictionJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    ij = (b._emscripten_bind_b2PulleyJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    jj = (b._emscripten_bind_b2ChainShape_get_m_type_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_type_0.apply(
        null,
        arguments
      )
    }),
    kj = (b._emscripten_bind_b2PulleyJointDef_get_groundAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_groundAnchorB_0.apply(
        null,
        arguments
      )
    }),
    lj = (b._emscripten_bind_JSDraw_DrawTransform_1 = function() {
      return b.asm._emscripten_bind_JSDraw_DrawTransform_1.apply(
        null,
        arguments
      )
    }),
    mj = (b._emscripten_bind_b2GearJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    nj = (b._emscripten_bind_b2DistanceJointDef_set_frequencyHz_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_frequencyHz_1.apply(
        null,
        arguments
      )
    }),
    oj = (b._emscripten_bind_b2RevoluteJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    pj = (b._emscripten_bind_b2RevoluteJointDef_get_referenceAngle_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_referenceAngle_0.apply(
        null,
        arguments
      )
    }),
    qj = (b._emscripten_bind_JSContactFilter___destroy___0 = function() {
      return b.asm._emscripten_bind_JSContactFilter___destroy___0.apply(
        null,
        arguments
      )
    }),
    rj = (b._emscripten_bind_b2RevoluteJointDef_get_enableMotor_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_enableMotor_0.apply(
        null,
        arguments
      )
    }),
    ub = (b._memset = function() {
      return b.asm._memset.apply(null, arguments)
    }),
    sj = (b._emscripten_bind_b2PolygonShape_get_m_radius_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_get_m_radius_0.apply(
        null,
        arguments
      )
    }),
    tj = (b._emscripten_enum_b2BodyType_b2_kinematicBody = function() {
      return b.asm._emscripten_enum_b2BodyType_b2_kinematicBody.apply(
        null,
        arguments
      )
    }),
    uj = (b._emscripten_bind_b2Rot_set_s_1 = function() {
      return b.asm._emscripten_bind_b2Rot_set_s_1.apply(null, arguments)
    }),
    vj = (b._emscripten_enum_b2ManifoldType_e_faceA = function() {
      return b.asm._emscripten_enum_b2ManifoldType_e_faceA.apply(
        null,
        arguments
      )
    }),
    wj = (b._emscripten_enum_b2ManifoldType_e_faceB = function() {
      return b.asm._emscripten_enum_b2ManifoldType_e_faceB.apply(
        null,
        arguments
      )
    }),
    xj = (b._emscripten_bind_b2RevoluteJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    yj = (b._emscripten_bind_b2FixtureDef_b2FixtureDef_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_b2FixtureDef_0.apply(
        null,
        arguments
      )
    }),
    zj = (b._emscripten_bind_b2PrismaticJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    Aj = (b._emscripten_bind_b2EdgeShape_get_m_hasVertex3_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_hasVertex3_0.apply(
        null,
        arguments
      )
    }),
    Bj = (b._emscripten_enum_b2ShapeType_e_edge = function() {
      return b.asm._emscripten_enum_b2ShapeType_e_edge.apply(null, arguments)
    }),
    Cj = (b._emscripten_bind_b2RevoluteJoint_GetMaxMotorTorque_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetMaxMotorTorque_0.apply(
        null,
        arguments
      )
    }),
    Dj = (b._emscripten_bind_b2BodyDef_set_active_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_active_1.apply(
        null,
        arguments
      )
    }),
    Ej = (b._emscripten_bind_b2EdgeShape_Set_2 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_Set_2.apply(null, arguments)
    }),
    Fj = (b._emscripten_bind_b2FixtureDef_set_isSensor_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_isSensor_1.apply(
        null,
        arguments
      )
    }),
    Gj = (b._emscripten_bind_b2Body_GetWorldPoint_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetWorldPoint_1.apply(
        null,
        arguments
      )
    }),
    Hj = (b._emscripten_bind_b2ManifoldPoint_get_normalImpulse_0 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_get_normalImpulse_0.apply(
        null,
        arguments
      )
    }),
    Ij = (b._emscripten_bind_JSContactFilter_ShouldCollide_2 = function() {
      return b.asm._emscripten_bind_JSContactFilter_ShouldCollide_2.apply(
        null,
        arguments
      )
    }),
    Jj = (b._emscripten_bind_b2Joint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2Joint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Kj = (b._emscripten_bind_b2RevoluteJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    Lj = (b._emscripten_bind_b2RayCastInput_set_p1_1 = function() {
      return b.asm._emscripten_bind_b2RayCastInput_set_p1_1.apply(
        null,
        arguments
      )
    }),
    Mj = (b._emscripten_bind_b2RopeJointDef_b2RopeJointDef_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_b2RopeJointDef_0.apply(
        null,
        arguments
      )
    }),
    Nj = (b._emscripten_bind_b2BodyDef_get_linearDamping_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_linearDamping_0.apply(
        null,
        arguments
      )
    }),
    Oj = (b._emscripten_bind_b2World_Step_3 = function() {
      return b.asm._emscripten_bind_b2World_Step_3.apply(null, arguments)
    }),
    Pj = (b._emscripten_bind_b2CircleShape_RayCast_4 = function() {
      return b.asm._emscripten_bind_b2CircleShape_RayCast_4.apply(
        null,
        arguments
      )
    }),
    Qj = (b._emscripten_bind_b2Profile_get_step_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_step_0.apply(null, arguments)
    }),
    Rj = (b._emscripten_bind_b2AABB_RayCast_2 = function() {
      return b.asm._emscripten_bind_b2AABB_RayCast_2.apply(null, arguments)
    }),
    Sj = (b._emscripten_bind_b2Mat22_SetZero_0 = function() {
      return b.asm._emscripten_bind_b2Mat22_SetZero_0.apply(null, arguments)
    })
  b.setTempRet0 = function() {
    return b.asm.setTempRet0.apply(null, arguments)
  }
  var Tj = (b._emscripten_bind_b2DistanceJoint_GetLength_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetLength_0.apply(
        null,
        arguments
      )
    }),
    Uj = (b._emscripten_bind_b2PulleyJoint_GetLengthB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetLengthB_0.apply(
        null,
        arguments
      )
    }),
    Vj = (b._emscripten_bind_b2PrismaticJoint_GetUpperLimit_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetUpperLimit_0.apply(
        null,
        arguments
      )
    }),
    Wj = (b._emscripten_bind_b2WheelJoint_SetMaxMotorTorque_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_SetMaxMotorTorque_1.apply(
        null,
        arguments
      )
    }),
    Xj = (b._emscripten_bind_b2MotorJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    Yj = (b._emscripten_bind_b2FrictionJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Zj = (b._emscripten_bind_b2Shape_get_m_type_0 = function() {
      return b.asm._emscripten_bind_b2Shape_get_m_type_0.apply(null, arguments)
    }),
    ak = (b._emscripten_bind_b2MouseJoint_SetDampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_SetDampingRatio_1.apply(
        null,
        arguments
      )
    }),
    bk = (b._emscripten_bind_b2World_GetAutoClearForces_0 = function() {
      return b.asm._emscripten_bind_b2World_GetAutoClearForces_0.apply(
        null,
        arguments
      )
    }),
    ck = (b._emscripten_enum_b2ShapeType_e_circle = function() {
      return b.asm._emscripten_enum_b2ShapeType_e_circle.apply(null, arguments)
    }),
    dk = (b._emscripten_bind_b2BodyDef_set_fixedRotation_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_fixedRotation_1.apply(
        null,
        arguments
      )
    }),
    ek = (b._emscripten_bind_b2Vec2_b2Vec2_2 = function() {
      return b.asm._emscripten_bind_b2Vec2_b2Vec2_2.apply(null, arguments)
    }),
    fk = (b._emscripten_bind_b2Manifold_get_type_0 = function() {
      return b.asm._emscripten_bind_b2Manifold_get_type_0.apply(null, arguments)
    }),
    gk = (b._emscripten_bind_b2Body_Dump_0 = function() {
      return b.asm._emscripten_bind_b2Body_Dump_0.apply(null, arguments)
    }),
    hk = (b._emscripten_bind_b2RevoluteJoint_GetLowerLimit_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetLowerLimit_0.apply(
        null,
        arguments
      )
    }),
    ik = (b._emscripten_bind_b2Body_GetWorldCenter_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetWorldCenter_0.apply(
        null,
        arguments
      )
    }),
    jk = (b._emscripten_bind_b2WheelJointDef_set_maxMotorTorque_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_maxMotorTorque_1.apply(
        null,
        arguments
      )
    }),
    kk = (b._emscripten_bind_b2BodyDef_set_linearVelocity_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_linearVelocity_1.apply(
        null,
        arguments
      )
    }),
    lk = (b._emscripten_bind_b2JointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2JointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    mk = (b._emscripten_bind_b2MotorJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    nk = (b._emscripten_bind_b2Body_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetUserData_0.apply(null, arguments)
    }),
    ok = (b._emscripten_bind_b2Body_GetAngularDamping_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetAngularDamping_0.apply(
        null,
        arguments
      )
    }),
    pk = (b._emscripten_bind_b2Fixture_RayCast_3 = function() {
      return b.asm._emscripten_bind_b2Fixture_RayCast_3.apply(null, arguments)
    }),
    qk = (b._emscripten_bind_b2JointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2JointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    rk = (b._emscripten_bind_b2GearJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    sk = (b._emscripten_bind_b2RopeJointDef_get_maxLength_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_maxLength_0.apply(
        null,
        arguments
      )
    }),
    tk = (b._emscripten_bind_b2MouseJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    uk = (b._emscripten_bind_b2Body_SetBullet_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetBullet_1.apply(null, arguments)
    }),
    vk = (b._emscripten_bind_b2DistanceJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    wk = (b._emscripten_bind_b2FixtureDef_get_restitution_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_restitution_0.apply(
        null,
        arguments
      )
    }),
    xk = (b._emscripten_bind_b2Fixture_GetType_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetType_0.apply(null, arguments)
    }),
    yk = (b._emscripten_bind_b2WheelJointDef_set_enableMotor_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_enableMotor_1.apply(
        null,
        arguments
      )
    }),
    zk = (b._emscripten_bind_b2RevoluteJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Ak = (b._emscripten_bind_b2Profile_set_solveInit_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_solveInit_1.apply(
        null,
        arguments
      )
    }),
    Bk = (b._emscripten_bind_b2RopeJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    Ck = (b._emscripten_bind_b2PrismaticJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    Dk = (b._emscripten_bind_b2GearJoint_GetJoint2_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetJoint2_0.apply(
        null,
        arguments
      )
    }),
    Ek = (b._emscripten_bind_b2PulleyJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Fk = (b._emscripten_bind_b2PrismaticJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    Gk = (b._emscripten_bind_b2FrictionJointDef_b2FrictionJointDef_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_b2FrictionJointDef_0.apply(
        null,
        arguments
      )
    }),
    Hk = (b._emscripten_bind_b2PulleyJoint_GetCurrentLengthA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetCurrentLengthA_0.apply(
        null,
        arguments
      )
    }),
    Ik = (b._emscripten_bind_b2Manifold_get_localNormal_0 = function() {
      return b.asm._emscripten_bind_b2Manifold_get_localNormal_0.apply(
        null,
        arguments
      )
    }),
    Jk = (b._emscripten_bind_b2Vec3_b2Vec3_0 = function() {
      return b.asm._emscripten_bind_b2Vec3_b2Vec3_0.apply(null, arguments)
    }),
    Kk = (b._emscripten_bind_b2Body_SetSleepingAllowed_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetSleepingAllowed_1.apply(
        null,
        arguments
      )
    }),
    Lk = (b._emscripten_bind_b2DistanceJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Mk = (b._emscripten_bind_b2PrismaticJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Nk = (b._emscripten_bind_b2Manifold_set_pointCount_1 = function() {
      return b.asm._emscripten_bind_b2Manifold_set_pointCount_1.apply(
        null,
        arguments
      )
    }),
    Ok = (b._emscripten_bind_b2PrismaticJoint_IsMotorEnabled_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_IsMotorEnabled_0.apply(
        null,
        arguments
      )
    }),
    Pk = (b._emscripten_bind_b2WeldJoint_GetFrequency_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetFrequency_0.apply(
        null,
        arguments
      )
    }),
    Qk = (b._emscripten_bind_b2Joint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetUserData_0.apply(null, arguments)
    }),
    Rk = (b._emscripten_bind_b2RevoluteJointDef_get_lowerAngle_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_lowerAngle_0.apply(
        null,
        arguments
      )
    }),
    Sk = (b._emscripten_bind_b2Manifold_set_type_1 = function() {
      return b.asm._emscripten_bind_b2Manifold_set_type_1.apply(null, arguments)
    }),
    Tk = (b._emscripten_bind_b2Vec3_b2Vec3_3 = function() {
      return b.asm._emscripten_bind_b2Vec3_b2Vec3_3.apply(null, arguments)
    }),
    Uk = (b._emscripten_bind_b2RopeJointDef_set_maxLength_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_maxLength_1.apply(
        null,
        arguments
      )
    }),
    Vk = (b._emscripten_bind_b2ChainShape_TestPoint_2 = function() {
      return b.asm._emscripten_bind_b2ChainShape_TestPoint_2.apply(
        null,
        arguments
      )
    }),
    Wk = (b._emscripten_bind_b2PrismaticJoint_GetReferenceAngle_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetReferenceAngle_0.apply(
        null,
        arguments
      )
    }),
    Xk = (b._emscripten_bind_b2RayCastInput_get_p2_0 = function() {
      return b.asm._emscripten_bind_b2RayCastInput_get_p2_0.apply(
        null,
        arguments
      )
    }),
    Yk = (b._emscripten_bind_b2BodyDef_set_angle_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_angle_1.apply(null, arguments)
    }),
    Zk = (b._emscripten_bind_b2WeldJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    $k = (b._emscripten_bind_b2WheelJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    al = (b._emscripten_bind_b2PulleyJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    bl = (b._emscripten_bind_b2Body_IsBullet_0 = function() {
      return b.asm._emscripten_bind_b2Body_IsBullet_0.apply(null, arguments)
    }),
    cl = (b._emscripten_bind_b2MotorJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    dl = (b._emscripten_bind_b2Fixture_TestPoint_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_TestPoint_1.apply(null, arguments)
    }),
    el = (b._emscripten_bind_b2Mat33_GetSymInverse33_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_GetSymInverse33_1.apply(
        null,
        arguments
      )
    }),
    fl = (b._emscripten_bind_JSDraw_DrawPolygon_3 = function() {
      return b.asm._emscripten_bind_JSDraw_DrawPolygon_3.apply(null, arguments)
    }),
    gl = (b._emscripten_bind_b2PolygonShape_ComputeMass_2 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_ComputeMass_2.apply(
        null,
        arguments
      )
    }),
    hl = (b._emscripten_bind_b2PrismaticJoint_EnableMotor_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_EnableMotor_1.apply(
        null,
        arguments
      )
    }),
    il = (b._emscripten_bind_b2PrismaticJointDef_set_upperTranslation_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_upperTranslation_1.apply(
        null,
        arguments
      )
    }),
    jl = (b._emscripten_bind_b2MouseJoint_SetFrequency_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_SetFrequency_1.apply(
        null,
        arguments
      )
    }),
    kl = (b._emscripten_bind_b2EdgeShape_get_m_vertex1_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_vertex1_0.apply(
        null,
        arguments
      )
    }),
    ll = (b._emscripten_bind_b2BodyDef_set_awake_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_awake_1.apply(null, arguments)
    }),
    ml = (b._emscripten_bind_b2Vec2_get_y_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_get_y_0.apply(null, arguments)
    }),
    nl = (b._emscripten_bind_b2Filter_set_categoryBits_1 = function() {
      return b.asm._emscripten_bind_b2Filter_set_categoryBits_1.apply(
        null,
        arguments
      )
    }),
    ol = (b._emscripten_bind_b2Body_CreateFixture_2 = function() {
      return b.asm._emscripten_bind_b2Body_CreateFixture_2.apply(
        null,
        arguments
      )
    }),
    pl = (b._emscripten_bind_b2Body_SetActive_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetActive_1.apply(null, arguments)
    }),
    ql = (b._emscripten_bind_b2ContactFeature_get_indexB_0 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_get_indexB_0.apply(
        null,
        arguments
      )
    }),
    rl = (b._emscripten_bind_b2Fixture_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    sl = (b._emscripten_bind_b2PolygonShape_ComputeAABB_3 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_ComputeAABB_3.apply(
        null,
        arguments
      )
    }),
    tl = (b._emscripten_bind_b2ContactFeature_get_typeA_0 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_get_typeA_0.apply(
        null,
        arguments
      )
    }),
    ul = (b._emscripten_bind_b2MouseJointDef_set_maxForce_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_maxForce_1.apply(
        null,
        arguments
      )
    }),
    vl = (b._emscripten_bind_b2PrismaticJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    wl = (b._emscripten_bind_b2EdgeShape_TestPoint_2 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_TestPoint_2.apply(
        null,
        arguments
      )
    }),
    xl = (b._emscripten_bind_b2PolygonShape_get_m_centroid_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_get_m_centroid_0.apply(
        null,
        arguments
      )
    }),
    yl = (b._emscripten_bind_b2ChainShape___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ChainShape___destroy___0.apply(
        null,
        arguments
      )
    }),
    zl = (b._emscripten_bind_b2GearJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2GearJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    Al = (b._emscripten_bind_b2Vec3_set_z_1 = function() {
      return b.asm._emscripten_bind_b2Vec3_set_z_1.apply(null, arguments)
    }),
    Bl = (b._emscripten_bind_b2PrismaticJointDef_set_enableLimit_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_enableLimit_1.apply(
        null,
        arguments
      )
    }),
    Cl = (b._emscripten_bind_b2DistanceJoint_GetFrequency_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetFrequency_0.apply(
        null,
        arguments
      )
    }),
    Dl = (b._emscripten_bind_b2PrismaticJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    El = (b._emscripten_bind_b2Body_SetGravityScale_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetGravityScale_1.apply(
        null,
        arguments
      )
    }),
    Fl = (b._emscripten_enum_b2ContactFeatureType_e_face = function() {
      return b.asm._emscripten_enum_b2ContactFeatureType_e_face.apply(
        null,
        arguments
      )
    }),
    Gl = (b._emscripten_bind_b2RevoluteJoint_GetUpperLimit_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetUpperLimit_0.apply(
        null,
        arguments
      )
    }),
    Hl = (b._emscripten_bind_b2PulleyJointDef_get_lengthA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_lengthA_0.apply(
        null,
        arguments
      )
    }),
    Il = (b._emscripten_bind_b2Vec3_set_x_1 = function() {
      return b.asm._emscripten_bind_b2Vec3_set_x_1.apply(null, arguments)
    }),
    Jl = (b._emscripten_bind_b2PulleyJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    Kl = (b._emscripten_bind_JSDestructionListener_SayGoodbyeJoint_1 = function() {
      return b.asm._emscripten_bind_JSDestructionListener_SayGoodbyeJoint_1.apply(
        null,
        arguments
      )
    }),
    Ll = (b._emscripten_bind_b2Shape___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Shape___destroy___0.apply(null, arguments)
    }),
    Ml = (b._emscripten_bind_b2Joint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2Joint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    Nl = (b._emscripten_bind_b2FixtureDef_set_friction_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_friction_1.apply(
        null,
        arguments
      )
    }),
    Ol = (b._emscripten_bind_b2ContactID___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ContactID___destroy___0.apply(
        null,
        arguments
      )
    }),
    Pl = (b._emscripten_bind_b2EdgeShape_get_m_hasVertex0_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_hasVertex0_0.apply(
        null,
        arguments
      )
    }),
    Ql = (b._emscripten_bind_b2World_GetBodyCount_0 = function() {
      return b.asm._emscripten_bind_b2World_GetBodyCount_0.apply(
        null,
        arguments
      )
    }),
    Rl = (b._emscripten_bind_b2JointEdge_get_prev_0 = function() {
      return b.asm._emscripten_bind_b2JointEdge_get_prev_0.apply(
        null,
        arguments
      )
    }),
    Sl = (b._emscripten_bind_b2MotorJointDef_get_linearOffset_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_linearOffset_0.apply(
        null,
        arguments
      )
    }),
    Tl = (b._emscripten_bind_b2MotorJointDef_Initialize_2 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_Initialize_2.apply(
        null,
        arguments
      )
    }),
    Ul = (b._emscripten_bind_b2PrismaticJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Vl = (b._emscripten_bind_b2Body_SetLinearVelocity_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetLinearVelocity_1.apply(
        null,
        arguments
      )
    }),
    Wl = (b._emscripten_enum_b2BodyType_b2_staticBody = function() {
      return b.asm._emscripten_enum_b2BodyType_b2_staticBody.apply(
        null,
        arguments
      )
    }),
    Xl = (b._emscripten_bind_b2RevoluteJointDef_set_upperAngle_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_upperAngle_1.apply(
        null,
        arguments
      )
    }),
    Yl = (b._emscripten_bind_b2RevoluteJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    Zl = (b._emscripten_bind_b2GearJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    $l = (b._emscripten_bind_b2ChainShape_GetType_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_GetType_0.apply(
        null,
        arguments
      )
    }),
    am = (b._emscripten_bind_b2RayCastInput_get_maxFraction_0 = function() {
      return b.asm._emscripten_bind_b2RayCastInput_get_maxFraction_0.apply(
        null,
        arguments
      )
    }),
    bm = (b._emscripten_bind_b2GearJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    cm = (b._emscripten_bind_b2Body_GetLocalVector_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetLocalVector_1.apply(
        null,
        arguments
      )
    }),
    dm = (b._emscripten_bind_b2PrismaticJoint_EnableLimit_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_EnableLimit_1.apply(
        null,
        arguments
      )
    }),
    em = (b._emscripten_bind_b2FrictionJointDef_get_maxForce_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_maxForce_0.apply(
        null,
        arguments
      )
    }),
    fm = (b._emscripten_bind_b2BodyDef_set_angularVelocity_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_angularVelocity_1.apply(
        null,
        arguments
      )
    }),
    gm = (b._emscripten_bind_b2Body_SetLinearDamping_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetLinearDamping_1.apply(
        null,
        arguments
      )
    }),
    hm = (b._emscripten_bind_b2WheelJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    im = (b._emscripten_bind_b2GearJointDef_get_joint2_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_joint2_0.apply(
        null,
        arguments
      )
    }),
    jm = (b._emscripten_bind_b2PrismaticJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    km = (b._emscripten_bind_b2Vec3_get_z_0 = function() {
      return b.asm._emscripten_bind_b2Vec3_get_z_0.apply(null, arguments)
    }),
    lm = (b._emscripten_bind_b2Filter_get_categoryBits_0 = function() {
      return b.asm._emscripten_bind_b2Filter_get_categoryBits_0.apply(
        null,
        arguments
      )
    }),
    mm = (b._emscripten_enum_b2JointType_e_weldJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_weldJoint.apply(
        null,
        arguments
      )
    }),
    nm = (b._emscripten_bind_b2World_SetContinuousPhysics_1 = function() {
      return b.asm._emscripten_bind_b2World_SetContinuousPhysics_1.apply(
        null,
        arguments
      )
    }),
    om = (b._emscripten_bind_b2MouseJointDef_get_target_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_target_0.apply(
        null,
        arguments
      )
    }),
    pm = (b._emscripten_bind_b2Body_SetTransform_2 = function() {
      return b.asm._emscripten_bind_b2Body_SetTransform_2.apply(null, arguments)
    }),
    qm = (b._emscripten_bind_b2PulleyJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    rm = (b._emscripten_bind_b2FrictionJointDef_set_maxForce_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_maxForce_1.apply(
        null,
        arguments
      )
    }),
    sm = (b._emscripten_bind_b2DistanceJointDef_b2DistanceJointDef_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_b2DistanceJointDef_0.apply(
        null,
        arguments
      )
    }),
    tm = (b._emscripten_bind_b2BodyDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_type_0.apply(null, arguments)
    }),
    um = (b._emscripten_bind_b2Mat33_GetInverse22_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_GetInverse22_1.apply(
        null,
        arguments
      )
    }),
    wm = (b._emscripten_bind_b2PulleyJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    xm = (b._emscripten_bind_b2WheelJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    ym = (b._emscripten_bind_b2RevoluteJointDef_b2RevoluteJointDef_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_b2RevoluteJointDef_0.apply(
        null,
        arguments
      )
    }),
    zm = (b._emscripten_bind_b2ContactFeature_set_typeA_1 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_set_typeA_1.apply(
        null,
        arguments
      )
    }),
    Am = (b._emscripten_bind_b2Fixture_Dump_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_Dump_1.apply(null, arguments)
    }),
    Bm = (b._emscripten_bind_b2RevoluteJointDef_get_enableLimit_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_enableLimit_0.apply(
        null,
        arguments
      )
    }),
    Cm = (b._emscripten_bind_b2Manifold_set_localPoint_1 = function() {
      return b.asm._emscripten_bind_b2Manifold_set_localPoint_1.apply(
        null,
        arguments
      )
    }),
    Dm = (b._emscripten_bind_b2JointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2JointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Em = (b._emscripten_bind_b2BodyDef_set_bullet_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_bullet_1.apply(
        null,
        arguments
      )
    }),
    Fm = (b._emscripten_bind_b2RayCastOutput___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RayCastOutput___destroy___0.apply(
        null,
        arguments
      )
    }),
    Gm = (b._emscripten_bind_JSContactListener___destroy___0 = function() {
      return b.asm._emscripten_bind_JSContactListener___destroy___0.apply(
        null,
        arguments
      )
    }),
    Hm = (b._emscripten_bind_b2World_DrawDebugData_0 = function() {
      return b.asm._emscripten_bind_b2World_DrawDebugData_0.apply(
        null,
        arguments
      )
    })
  b.___cxa_can_catch = function() {
    return b.asm.___cxa_can_catch.apply(null, arguments)
  }
  var Im = (b._emscripten_bind_b2RopeJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Jm = (b._emscripten_bind_b2Profile_set_solveVelocity_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_solveVelocity_1.apply(
        null,
        arguments
      )
    }),
    Km = (b._emscripten_bind_b2GearJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Lm = (b._emscripten_bind_b2Filter_set_groupIndex_1 = function() {
      return b.asm._emscripten_bind_b2Filter_set_groupIndex_1.apply(
        null,
        arguments
      )
    }),
    Mm = (b._emscripten_bind_b2JointDef_b2JointDef_0 = function() {
      return b.asm._emscripten_bind_b2JointDef_b2JointDef_0.apply(
        null,
        arguments
      )
    }),
    Nm = (b._emscripten_bind_b2Rot_set_c_1 = function() {
      return b.asm._emscripten_bind_b2Rot_set_c_1.apply(null, arguments)
    }),
    Om = (b._emscripten_bind_b2GearJointDef_b2GearJointDef_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_b2GearJointDef_0.apply(
        null,
        arguments
      )
    }),
    Pm = (b._emscripten_bind_b2JointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2JointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    Qm = (b._emscripten_bind_b2DistanceJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    Rm = (b._emscripten_bind_b2PrismaticJoint_GetJointSpeed_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetJointSpeed_0.apply(
        null,
        arguments
      )
    }),
    Sm = (b._emscripten_bind_b2MouseJointDef_set_frequencyHz_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_frequencyHz_1.apply(
        null,
        arguments
      )
    }),
    Tm = (b._emscripten_bind_b2PulleyJointDef_get_groundAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_groundAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Um = (b._emscripten_bind_b2Joint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetAnchorA_0.apply(null, arguments)
    }),
    Vm = (b._emscripten_bind_b2Contact_GetRestitution_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetRestitution_0.apply(
        null,
        arguments
      )
    }),
    Wm = (b._emscripten_bind_b2ContactEdge_get_contact_0 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_get_contact_0.apply(
        null,
        arguments
      )
    }),
    Xm = (b._emscripten_bind_b2RevoluteJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Ym = (b._emscripten_bind_b2Body_ResetMassData_0 = function() {
      return b.asm._emscripten_bind_b2Body_ResetMassData_0.apply(
        null,
        arguments
      )
    }),
    Zm = (b._emscripten_bind_b2Fixture_GetAABB_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetAABB_1.apply(null, arguments)
    }),
    $m = (b._emscripten_bind_b2PrismaticJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    an = (b._emscripten_bind_b2Body_GetMassData_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetMassData_1.apply(null, arguments)
    }),
    bn = (b._emscripten_bind_b2RevoluteJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    cn = (b._emscripten_bind_b2EdgeShape_ComputeMass_2 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_ComputeMass_2.apply(
        null,
        arguments
      )
    }),
    dn = (b._emscripten_bind_b2GearJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    en = (b._emscripten_enum_b2LimitState_e_atLowerLimit = function() {
      return b.asm._emscripten_enum_b2LimitState_e_atLowerLimit.apply(
        null,
        arguments
      )
    }),
    fn = (b._emscripten_bind_b2ManifoldPoint_set_id_1 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_set_id_1.apply(
        null,
        arguments
      )
    }),
    gn = (b._emscripten_bind_b2WheelJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    hn = (b._emscripten_bind_b2WeldJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    jn = (b._emscripten_bind_b2RevoluteJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    kn = (b._emscripten_bind_b2Body_DestroyFixture_1 = function() {
      return b.asm._emscripten_bind_b2Body_DestroyFixture_1.apply(
        null,
        arguments
      )
    }),
    ln = (b._emscripten_bind_b2Profile_set_broadphase_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_broadphase_1.apply(
        null,
        arguments
      )
    }),
    mn = (b._emscripten_bind_b2WheelJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    nn = (b._emscripten_bind_b2ContactImpulse_get_count_0 = function() {
      return b.asm._emscripten_bind_b2ContactImpulse_get_count_0.apply(
        null,
        arguments
      )
    }),
    on = (b._emscripten_bind_b2World_GetJointCount_0 = function() {
      return b.asm._emscripten_bind_b2World_GetJointCount_0.apply(
        null,
        arguments
      )
    }),
    pn = (b._emscripten_bind_b2WheelJoint_GetMotorSpeed_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetMotorSpeed_0.apply(
        null,
        arguments
      )
    }),
    qn = (b._emscripten_bind_b2WheelJointDef_get_dampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_dampingRatio_0.apply(
        null,
        arguments
      )
    }),
    rn = (b._emscripten_bind_b2RayCastOutput_get_fraction_0 = function() {
      return b.asm._emscripten_bind_b2RayCastOutput_get_fraction_0.apply(
        null,
        arguments
      )
    }),
    sn = (b._emscripten_bind_b2AABB___destroy___0 = function() {
      return b.asm._emscripten_bind_b2AABB___destroy___0.apply(null, arguments)
    }),
    tn = (b._emscripten_bind_b2GearJoint_SetRatio_1 = function() {
      return b.asm._emscripten_bind_b2GearJoint_SetRatio_1.apply(
        null,
        arguments
      )
    }),
    un = (b._emscripten_bind_b2Body_ApplyLinearImpulse_3 = function() {
      return b.asm._emscripten_bind_b2Body_ApplyLinearImpulse_3.apply(
        null,
        arguments
      )
    }),
    vn = (b._emscripten_bind_b2Filter___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Filter___destroy___0.apply(
        null,
        arguments
      )
    }),
    wn = (b._emscripten_bind_b2RopeJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_userData_0.apply(
        null,
        arguments
      )
    })
  b.___cxa_is_pointer_type = function() {
    return b.asm.___cxa_is_pointer_type.apply(null, arguments)
  }
  var xn = (b._emscripten_bind_b2BodyDef_get_fixedRotation_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_fixedRotation_0.apply(
        null,
        arguments
      )
    }),
    yn = (b._emscripten_bind_b2PrismaticJointDef_set_motorSpeed_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_motorSpeed_1.apply(
        null,
        arguments
      )
    }),
    zn = (b._emscripten_bind_b2ChainShape_SetPrevVertex_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_SetPrevVertex_1.apply(
        null,
        arguments
      )
    }),
    An = (b._emscripten_bind_b2MotorJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    Bn = (b._emscripten_bind_b2MouseJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Cn = (b._emscripten_bind_b2DistanceJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Dn = (b._emscripten_bind_b2WheelJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    En = (b._emscripten_bind_b2Vec3_op_sub_1 = function() {
      return b.asm._emscripten_bind_b2Vec3_op_sub_1.apply(null, arguments)
    }),
    Fn = (b._emscripten_bind_b2WheelJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    Gn = (b._emscripten_bind_b2Shape_GetType_0 = function() {
      return b.asm._emscripten_bind_b2Shape_GetType_0.apply(null, arguments)
    }),
    Hn = (b._emscripten_bind_b2AABB_IsValid_0 = function() {
      return b.asm._emscripten_bind_b2AABB_IsValid_0.apply(null, arguments)
    }),
    In = (b._emscripten_bind_b2WheelJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    Jn = (b._emscripten_enum_b2ShapeType_e_chain = function() {
      return b.asm._emscripten_enum_b2ShapeType_e_chain.apply(null, arguments)
    }),
    Kn = (b._emscripten_bind_b2PulleyJoint_GetLengthA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetLengthA_0.apply(
        null,
        arguments
      )
    }),
    Ln = (b._emscripten_bind_b2DistanceJointDef_get_frequencyHz_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_frequencyHz_0.apply(
        null,
        arguments
      )
    }),
    Mn = (b._emscripten_bind_b2RevoluteJoint_SetMotorSpeed_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_SetMotorSpeed_1.apply(
        null,
        arguments
      )
    }),
    Nn = (b._emscripten_bind_b2World___destroy___0 = function() {
      return b.asm._emscripten_bind_b2World___destroy___0.apply(null, arguments)
    }),
    On = (b._emscripten_bind_b2ChainShape_set_m_prevVertex_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_prevVertex_1.apply(
        null,
        arguments
      )
    }),
    Pn = (b._emscripten_bind_b2ChainShape_get_m_hasNextVertex_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_hasNextVertex_0.apply(
        null,
        arguments
      )
    }),
    Qn = (b._emscripten_bind_b2ChainShape_SetNextVertex_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_SetNextVertex_1.apply(
        null,
        arguments
      )
    }),
    Rn = (b._emscripten_bind_b2Body_SetType_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetType_1.apply(null, arguments)
    }),
    Sn = (b._emscripten_bind_b2Body_GetMass_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetMass_0.apply(null, arguments)
    }),
    Tn = (b._emscripten_bind_b2Rot_b2Rot_0 = function() {
      return b.asm._emscripten_bind_b2Rot_b2Rot_0.apply(null, arguments)
    }),
    Un = (b._emscripten_bind_b2Rot_b2Rot_1 = function() {
      return b.asm._emscripten_bind_b2Rot_b2Rot_1.apply(null, arguments)
    }),
    Vn = (b._emscripten_enum_b2JointType_e_distanceJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_distanceJoint.apply(
        null,
        arguments
      )
    }),
    Wn = (b._emscripten_bind_b2WheelJoint_SetSpringDampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_SetSpringDampingRatio_1.apply(
        null,
        arguments
      )
    }),
    Xn = (b._emscripten_bind_b2MouseJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    Yn = (b._emscripten_bind_b2MouseJoint_GetTarget_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetTarget_0.apply(
        null,
        arguments
      )
    }),
    Zn = (b._emscripten_bind_JSQueryCallback___destroy___0 = function() {
      return b.asm._emscripten_bind_JSQueryCallback___destroy___0.apply(
        null,
        arguments
      )
    }),
    $n = (b._emscripten_bind_b2Fixture_Refilter_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_Refilter_0.apply(null, arguments)
    }),
    ao = (b._emscripten_bind_b2RevoluteJointDef_set_lowerAngle_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_lowerAngle_1.apply(
        null,
        arguments
      )
    }),
    bo = (b._emscripten_bind_b2JointEdge___destroy___0 = function() {
      return b.asm._emscripten_bind_b2JointEdge___destroy___0.apply(
        null,
        arguments
      )
    }),
    co = (b._emscripten_bind_b2PulleyJoint_GetRatio_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetRatio_0.apply(
        null,
        arguments
      )
    }),
    eo = (b._emscripten_bind_JSContactListener_BeginContact_1 = function() {
      return b.asm._emscripten_bind_JSContactListener_BeginContact_1.apply(
        null,
        arguments
      )
    }),
    fo = (b._emscripten_bind_b2MotorJointDef_set_linearOffset_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_linearOffset_1.apply(
        null,
        arguments
      )
    }),
    go = (b._emscripten_enum_b2JointType_e_motorJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_motorJoint.apply(
        null,
        arguments
      )
    }),
    ho = (b._emscripten_bind_b2EdgeShape_get_m_vertex2_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_vertex2_0.apply(
        null,
        arguments
      )
    }),
    io = (b._emscripten_bind_b2JointEdge_get_next_0 = function() {
      return b.asm._emscripten_bind_b2JointEdge_get_next_0.apply(
        null,
        arguments
      )
    }),
    jo = (b._emscripten_bind_b2RayCastInput_set_maxFraction_1 = function() {
      return b.asm._emscripten_bind_b2RayCastInput_set_maxFraction_1.apply(
        null,
        arguments
      )
    }),
    ko = (b._emscripten_bind_b2MouseJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    lo = (b._emscripten_bind_b2BodyDef_get_awake_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_awake_0.apply(null, arguments)
    }),
    mo = (b._emscripten_bind_b2AABB_b2AABB_0 = function() {
      return b.asm._emscripten_bind_b2AABB_b2AABB_0.apply(null, arguments)
    }),
    no = (b._emscripten_bind_b2Fixture_SetFriction_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_SetFriction_1.apply(
        null,
        arguments
      )
    }),
    oo = (b._emscripten_enum_b2DrawFlag_e_centerOfMassBit = function() {
      return b.asm._emscripten_enum_b2DrawFlag_e_centerOfMassBit.apply(
        null,
        arguments
      )
    }),
    po = (b._emscripten_bind_b2World_CreateBody_1 = function() {
      return b.asm._emscripten_bind_b2World_CreateBody_1.apply(null, arguments)
    }),
    qo = (b._emscripten_bind_b2RopeJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    ro = (b._emscripten_bind_b2WeldJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetNext_0.apply(null, arguments)
    }),
    so = (b._emscripten_bind_b2WeldJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetType_0.apply(null, arguments)
    }),
    to = (b._emscripten_enum_b2ContactFeatureType_e_vertex = function() {
      return b.asm._emscripten_enum_b2ContactFeatureType_e_vertex.apply(
        null,
        arguments
      )
    }),
    uo = (b._emscripten_bind_b2Rot___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Rot___destroy___0.apply(null, arguments)
    }),
    vo = (b._emscripten_bind_b2Filter_get_maskBits_0 = function() {
      return b.asm._emscripten_bind_b2Filter_get_maskBits_0.apply(
        null,
        arguments
      )
    }),
    wo = (b._emscripten_bind_b2Mat22_get_ex_0 = function() {
      return b.asm._emscripten_bind_b2Mat22_get_ex_0.apply(null, arguments)
    }),
    xo = (b._emscripten_bind_b2Body_GetFixtureList_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetFixtureList_0.apply(
        null,
        arguments
      )
    }),
    yo = (b._emscripten_bind_b2PulleyJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    zo = (b._emscripten_bind_b2MouseJointDef_set_dampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_dampingRatio_1.apply(
        null,
        arguments
      )
    }),
    Ao = (b._emscripten_bind_JSRayCastCallback___destroy___0 = function() {
      return b.asm._emscripten_bind_JSRayCastCallback___destroy___0.apply(
        null,
        arguments
      )
    }),
    Bo = (b._emscripten_bind_b2ContactListener___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ContactListener___destroy___0.apply(
        null,
        arguments
      )
    }),
    Co = (b._emscripten_bind_b2PrismaticJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    })
  b.establishStackSpace = function() {
    return b.asm.establishStackSpace.apply(null, arguments)
  }
  var Do = (b._emscripten_bind_b2FrictionJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Eo = (b._emscripten_bind_b2WeldJoint_Dump_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_Dump_0.apply(null, arguments)
    }),
    Fo = (b._emscripten_bind_b2MotorJoint_SetMaxForce_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_SetMaxForce_1.apply(
        null,
        arguments
      )
    }),
    Go = (b._emscripten_bind_b2MouseJoint_GetFrequency_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetFrequency_0.apply(
        null,
        arguments
      )
    }),
    Ho = (b._emscripten_bind_b2FrictionJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Io = (b._emscripten_bind_b2RevoluteJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Jo = (b._emscripten_bind_b2GearJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Ko = (b._emscripten_bind_b2Vec2_IsValid_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_IsValid_0.apply(null, arguments)
    }),
    Lo = (b._emscripten_bind_b2PrismaticJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    Mo = (b._emscripten_bind_b2World_GetWarmStarting_0 = function() {
      return b.asm._emscripten_bind_b2World_GetWarmStarting_0.apply(
        null,
        arguments
      )
    }),
    No = (b._emscripten_bind_b2RevoluteJointDef_set_enableLimit_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_enableLimit_1.apply(
        null,
        arguments
      )
    }),
    Oo = (b._emscripten_bind_b2WeldJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    Po = (b._emscripten_bind_b2Mat22_Solve_1 = function() {
      return b.asm._emscripten_bind_b2Mat22_Solve_1.apply(null, arguments)
    }),
    Qo = (b._emscripten_bind_b2Color_get_g_0 = function() {
      return b.asm._emscripten_bind_b2Color_get_g_0.apply(null, arguments)
    }),
    Ro = (b._emscripten_bind_VoidPtr___destroy___0 = function() {
      return b.asm._emscripten_bind_VoidPtr___destroy___0.apply(null, arguments)
    }),
    So = (b._emscripten_bind_b2RopeJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetNext_0.apply(null, arguments)
    }),
    To = (b._emscripten_bind_b2EdgeShape_get_m_type_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_type_0.apply(
        null,
        arguments
      )
    }),
    Uo = (b._emscripten_bind_b2PolygonShape_GetChildCount_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_GetChildCount_0.apply(
        null,
        arguments
      )
    }),
    Vo = (b._emscripten_bind_b2GearJointDef_get_ratio_0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_get_ratio_0.apply(
        null,
        arguments
      )
    }),
    Wo = (b._emscripten_bind_b2Mat33_Solve33_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_Solve33_1.apply(null, arguments)
    }),
    Xo = (b._emscripten_bind_b2WeldJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    Yo = (b._emscripten_bind_b2PrismaticJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Zo = (b._emscripten_bind_b2RevoluteJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    $o = (b._emscripten_bind_b2MotorJointDef_get_correctionFactor_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_correctionFactor_0.apply(
        null,
        arguments
      )
    }),
    ap = (b._emscripten_bind_b2ContactFeature_get_typeB_0 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_get_typeB_0.apply(
        null,
        arguments
      )
    }),
    bp = (b._emscripten_bind_b2ContactID_get_key_0 = function() {
      return b.asm._emscripten_bind_b2ContactID_get_key_0.apply(null, arguments)
    }),
    cp = (b._emscripten_bind_b2MotorJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    dp = (b._emscripten_bind_b2Rot_GetAngle_0 = function() {
      return b.asm._emscripten_bind_b2Rot_GetAngle_0.apply(null, arguments)
    }),
    ep = (b._emscripten_bind_b2World_SetAllowSleeping_1 = function() {
      return b.asm._emscripten_bind_b2World_SetAllowSleeping_1.apply(
        null,
        arguments
      )
    }),
    fp = (b._emscripten_bind_b2RopeJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetType_0.apply(null, arguments)
    }),
    gp = (b._emscripten_bind_b2MotorJoint_SetAngularOffset_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_SetAngularOffset_1.apply(
        null,
        arguments
      )
    }),
    hp = (b._emscripten_bind_b2MotorJoint_GetLinearOffset_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetLinearOffset_0.apply(
        null,
        arguments
      )
    }),
    ip = (b._emscripten_bind_b2FrictionJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    jp = (b._emscripten_bind_b2WheelJointDef_set_motorSpeed_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_motorSpeed_1.apply(
        null,
        arguments
      )
    }),
    kp = (b._emscripten_bind_b2MotorJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    lp = (b._emscripten_bind_b2Fixture_GetDensity_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetDensity_0.apply(
        null,
        arguments
      )
    }),
    mp = (b._emscripten_bind_b2MouseJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    np = (b._emscripten_bind_b2Vec2_Set_2 = function() {
      return b.asm._emscripten_bind_b2Vec2_Set_2.apply(null, arguments)
    }),
    op = (b._emscripten_bind_b2WeldJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    pp = (b._emscripten_bind_b2MouseJointDef_b2MouseJointDef_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_b2MouseJointDef_0.apply(
        null,
        arguments
      )
    }),
    qp = (b._emscripten_bind_b2Rot_get_s_0 = function() {
      return b.asm._emscripten_bind_b2Rot_get_s_0.apply(null, arguments)
    }),
    rp = (b._emscripten_bind_b2FrictionJoint_SetMaxTorque_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_SetMaxTorque_1.apply(
        null,
        arguments
      )
    }),
    sp = (b._emscripten_bind_b2MouseJointDef_get_frequencyHz_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_frequencyHz_0.apply(
        null,
        arguments
      )
    }),
    tp = (b._emscripten_bind_b2FrictionJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    up = (b._emscripten_bind_b2RayCastInput_get_p1_0 = function() {
      return b.asm._emscripten_bind_b2RayCastInput_get_p1_0.apply(
        null,
        arguments
      )
    }),
    vp = (b._emscripten_bind_b2DistanceJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    wp = (b._emscripten_bind_b2RevoluteJointDef_set_referenceAngle_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_referenceAngle_1.apply(
        null,
        arguments
      )
    }),
    xp = (b._emscripten_bind_b2ContactFeature___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ContactFeature___destroy___0.apply(
        null,
        arguments
      )
    }),
    yp = (b._emscripten_bind_b2Color___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Color___destroy___0.apply(null, arguments)
    }),
    zp = (b._emscripten_bind_b2DistanceJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    Ap = (b._emscripten_bind_b2ChainShape_get_m_hasPrevVertex_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_hasPrevVertex_0.apply(
        null,
        arguments
      )
    }),
    Bp = (b._emscripten_bind_b2PulleyJointDef_b2PulleyJointDef_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_b2PulleyJointDef_0.apply(
        null,
        arguments
      )
    }),
    Cp = (b._emscripten_bind_b2RevoluteJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    Dp = (b._emscripten_bind_b2MassData_b2MassData_0 = function() {
      return b.asm._emscripten_bind_b2MassData_b2MassData_0.apply(
        null,
        arguments
      )
    }),
    Ep = (b._emscripten_bind_b2Vec3_set_y_1 = function() {
      return b.asm._emscripten_bind_b2Vec3_set_y_1.apply(null, arguments)
    }),
    Fp = (b._emscripten_bind_b2BodyDef_set_angularDamping_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_angularDamping_1.apply(
        null,
        arguments
      )
    }),
    Gp = (b._emscripten_bind_b2AABB_Combine_1 = function() {
      return b.asm._emscripten_bind_b2AABB_Combine_1.apply(null, arguments)
    }),
    Hp = (b._emscripten_bind_b2WheelJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    Ip = (b._emscripten_bind_b2PrismaticJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    Jp = (b._emscripten_bind_b2PrismaticJoint_GetMaxMotorForce_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetMaxMotorForce_0.apply(
        null,
        arguments
      )
    }),
    Kp = (b._emscripten_bind_b2RevoluteJointDef_get_upperAngle_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_upperAngle_0.apply(
        null,
        arguments
      )
    }),
    Lp = (b._emscripten_bind_b2Body_IsSleepingAllowed_0 = function() {
      return b.asm._emscripten_bind_b2Body_IsSleepingAllowed_0.apply(
        null,
        arguments
      )
    }),
    Mp = (b._emscripten_bind_b2MotorJoint_GetCorrectionFactor_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetCorrectionFactor_0.apply(
        null,
        arguments
      )
    }),
    Np = (b._emscripten_bind_b2Profile_get_solve_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_solve_0.apply(null, arguments)
    }),
    Op = (b._emscripten_bind_JSDestructionListener_SayGoodbyeFixture_1 = function() {
      return b.asm._emscripten_bind_JSDestructionListener_SayGoodbyeFixture_1.apply(
        null,
        arguments
      )
    }),
    Pp = (b._emscripten_bind_b2PolygonShape_GetVertexCount_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_GetVertexCount_0.apply(
        null,
        arguments
      )
    }),
    Qp = (b._emscripten_bind_b2Rot_get_c_0 = function() {
      return b.asm._emscripten_bind_b2Rot_get_c_0.apply(null, arguments)
    }),
    Rp = (b._emscripten_bind_b2AABB_set_lowerBound_1 = function() {
      return b.asm._emscripten_bind_b2AABB_set_lowerBound_1.apply(
        null,
        arguments
      )
    }),
    Sp = (b._emscripten_bind_b2Fixture_SetFilterData_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_SetFilterData_1.apply(
        null,
        arguments
      )
    }),
    Tp = (b._emscripten_bind_b2MouseJoint_SetMaxForce_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_SetMaxForce_1.apply(
        null,
        arguments
      )
    }),
    Up = (b._emscripten_bind_b2WheelJoint_IsMotorEnabled_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_IsMotorEnabled_0.apply(
        null,
        arguments
      )
    }),
    Vp = (b._emscripten_bind_b2JointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2JointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    Wp = (b._emscripten_bind_b2ManifoldPoint_get_tangentImpulse_0 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_get_tangentImpulse_0.apply(
        null,
        arguments
      )
    }),
    Xp = (b._emscripten_bind_b2RevoluteJointDef_get_maxMotorTorque_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_maxMotorTorque_0.apply(
        null,
        arguments
      )
    }),
    Yp = (b._emscripten_bind_b2WeldJointDef_get_dampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_dampingRatio_0.apply(
        null,
        arguments
      )
    }),
    Zp = (b._emscripten_bind_b2Rot_SetIdentity_0 = function() {
      return b.asm._emscripten_bind_b2Rot_SetIdentity_0.apply(null, arguments)
    }),
    $p = (b._emscripten_bind_b2EdgeShape_b2EdgeShape_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_b2EdgeShape_0.apply(
        null,
        arguments
      )
    }),
    aq = (b._emscripten_bind_b2FrictionJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    bq = (b._emscripten_bind_b2MouseJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    cq = (b._emscripten_bind_b2DistanceJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    dq = (b._emscripten_bind_b2WeldJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    eq = (b._emscripten_bind_b2WeldJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    fq = (b._emscripten_bind_b2Manifold_b2Manifold_0 = function() {
      return b.asm._emscripten_bind_b2Manifold_b2Manifold_0.apply(
        null,
        arguments
      )
    }),
    gq = (b._emscripten_bind_JSContactListener_PostSolve_2 = function() {
      return b.asm._emscripten_bind_JSContactListener_PostSolve_2.apply(
        null,
        arguments
      )
    }),
    hq = (b._emscripten_bind_b2PulleyJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    iq = (b._emscripten_bind_b2RopeJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    jq = (b._emscripten_bind_b2CircleShape_ComputeMass_2 = function() {
      return b.asm._emscripten_bind_b2CircleShape_ComputeMass_2.apply(
        null,
        arguments
      )
    }),
    kq = (b._emscripten_bind_b2DistanceJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    lq = (b._emscripten_bind_b2GearJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2GearJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    mq = (b._emscripten_bind_b2PulleyJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    nq = (b._emscripten_bind_b2CircleShape_TestPoint_2 = function() {
      return b.asm._emscripten_bind_b2CircleShape_TestPoint_2.apply(
        null,
        arguments
      )
    }),
    oq = (b._emscripten_bind_b2MotorJointDef_get_maxTorque_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_maxTorque_0.apply(
        null,
        arguments
      )
    }),
    pq = (b._emscripten_bind_b2Body_GetLinearVelocityFromLocalPoint_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetLinearVelocityFromLocalPoint_1.apply(
        null,
        arguments
      )
    }),
    qq = (b._emscripten_bind_b2FrictionJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    rq = (b._emscripten_bind_b2MouseJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    sq = (b._emscripten_bind_b2RopeJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    tq = (b._emscripten_bind_b2GearJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    uq = (b._emscripten_bind_b2ChainShape_Clear_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_Clear_0.apply(null, arguments)
    }),
    vq = (b._emscripten_bind_b2CircleShape___destroy___0 = function() {
      return b.asm._emscripten_bind_b2CircleShape___destroy___0.apply(
        null,
        arguments
      )
    }),
    wq = (b._emscripten_bind_b2MotorJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    xq = (b._emscripten_bind_b2World_GetContactCount_0 = function() {
      return b.asm._emscripten_bind_b2World_GetContactCount_0.apply(
        null,
        arguments
      )
    }),
    yq = (b._emscripten_bind_b2Contact_SetRestitution_1 = function() {
      return b.asm._emscripten_bind_b2Contact_SetRestitution_1.apply(
        null,
        arguments
      )
    }),
    zq = (b._emscripten_bind_b2BodyDef_get_angularDamping_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_angularDamping_0.apply(
        null,
        arguments
      )
    }),
    Aq = (b._emscripten_bind_b2EdgeShape_get_m_vertex3_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_vertex3_0.apply(
        null,
        arguments
      )
    }),
    Bq = (b._emscripten_bind_b2MassData_set_center_1 = function() {
      return b.asm._emscripten_bind_b2MassData_set_center_1.apply(
        null,
        arguments
      )
    }),
    Cq = (b._emscripten_bind_b2Transform_SetIdentity_0 = function() {
      return b.asm._emscripten_bind_b2Transform_SetIdentity_0.apply(
        null,
        arguments
      )
    }),
    Dq = (b._emscripten_bind_b2GearJointDef_set_joint1_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_joint1_1.apply(
        null,
        arguments
      )
    }),
    Eq = (b._emscripten_bind_b2EdgeShape_set_m_vertex2_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_vertex2_1.apply(
        null,
        arguments
      )
    }),
    Fq = (b._emscripten_bind_b2Contact_SetFriction_1 = function() {
      return b.asm._emscripten_bind_b2Contact_SetFriction_1.apply(
        null,
        arguments
      )
    }),
    Gq = (b._emscripten_bind_b2MouseJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Hq = (b._emscripten_bind_b2ContactFeature_set_indexB_1 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_set_indexB_1.apply(
        null,
        arguments
      )
    }),
    Iq = (b._emscripten_bind_b2Body_GetLinearVelocityFromWorldPoint_1 = function() {
      return b.asm._emscripten_bind_b2Body_GetLinearVelocityFromWorldPoint_1.apply(
        null,
        arguments
      )
    }),
    Jq = (b._emscripten_bind_b2WeldJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    Kq = (b._emscripten_bind_b2Mat22_GetInverse_0 = function() {
      return b.asm._emscripten_bind_b2Mat22_GetInverse_0.apply(null, arguments)
    }),
    Lq = (b._emscripten_bind_b2WheelJointDef_set_frequencyHz_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_frequencyHz_1.apply(
        null,
        arguments
      )
    }),
    Mq = (b._emscripten_bind_b2World_GetSubStepping_0 = function() {
      return b.asm._emscripten_bind_b2World_GetSubStepping_0.apply(
        null,
        arguments
      )
    }),
    Nq = (b._emscripten_bind_b2Rot_GetYAxis_0 = function() {
      return b.asm._emscripten_bind_b2Rot_GetYAxis_0.apply(null, arguments)
    })
  b._emscripten_get_global_libc = function() {
    return b.asm._emscripten_get_global_libc.apply(null, arguments)
  }
  var Oq = (b._emscripten_bind_b2WheelJointDef_get_localAxisA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_localAxisA_0.apply(
        null,
        arguments
      )
    }),
    Pq = (b._emscripten_bind_b2RopeJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    Qq = (b._emscripten_bind_b2EdgeShape_GetType_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_GetType_0.apply(null, arguments)
    }),
    Rq = (b._emscripten_bind_b2Mat22_set_ex_1 = function() {
      return b.asm._emscripten_bind_b2Mat22_set_ex_1.apply(null, arguments)
    }),
    Sq = (b._emscripten_bind_b2ManifoldPoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Tq = (b._emscripten_enum_b2JointType_e_prismaticJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_prismaticJoint.apply(
        null,
        arguments
      )
    }),
    Uq = (b._emscripten_bind_b2WeldJointDef_get_referenceAngle_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_referenceAngle_0.apply(
        null,
        arguments
      )
    }),
    Vq = (b._emscripten_bind_b2Vec2_Length_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_Length_0.apply(null, arguments)
    }),
    Wq = (b._emscripten_bind_b2Vec2_SetZero_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_SetZero_0.apply(null, arguments)
    }),
    Xq = (b._emscripten_bind_b2RopeJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Yq = (b._emscripten_bind_b2World_DestroyJoint_1 = function() {
      return b.asm._emscripten_bind_b2World_DestroyJoint_1.apply(
        null,
        arguments
      )
    }),
    Zq = (b._emscripten_bind_b2JointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2JointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    $q = (b._emscripten_bind_b2Mat22_Set_2 = function() {
      return b.asm._emscripten_bind_b2Mat22_Set_2.apply(null, arguments)
    }),
    ar = (b._emscripten_bind_b2JointEdge_set_next_1 = function() {
      return b.asm._emscripten_bind_b2JointEdge_set_next_1.apply(
        null,
        arguments
      )
    }),
    br = (b._emscripten_bind_b2WeldJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    cr = (b._emscripten_enum_b2DrawFlag_e_aabbBit = function() {
      return b.asm._emscripten_enum_b2DrawFlag_e_aabbBit.apply(null, arguments)
    }),
    dr = (b._emscripten_bind_b2EdgeShape_ComputeAABB_3 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_ComputeAABB_3.apply(
        null,
        arguments
      )
    }),
    er = (b._emscripten_bind_b2PolygonShape_set_m_centroid_1 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_set_m_centroid_1.apply(
        null,
        arguments
      )
    }),
    fr = (b._emscripten_bind_b2WheelJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    gr = (b._emscripten_bind_b2World_GetJointList_0 = function() {
      return b.asm._emscripten_bind_b2World_GetJointList_0.apply(
        null,
        arguments
      )
    }),
    hr = (b._emscripten_bind_b2MotorJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    ir = (b._emscripten_bind_b2RopeJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    jr = (b._emscripten_bind_b2BodyDef_set_linearDamping_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_linearDamping_1.apply(
        null,
        arguments
      )
    }),
    kr = (b._emscripten_bind_b2FrictionJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    lr = (b._emscripten_bind_b2Shape_TestPoint_2 = function() {
      return b.asm._emscripten_bind_b2Shape_TestPoint_2.apply(null, arguments)
    }),
    mr = (b._emscripten_bind_b2Manifold_set_localNormal_1 = function() {
      return b.asm._emscripten_bind_b2Manifold_set_localNormal_1.apply(
        null,
        arguments
      )
    }),
    nr = (b._emscripten_bind_b2JointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2JointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    or = (b._emscripten_bind_b2Body_GetLinearDamping_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetLinearDamping_0.apply(
        null,
        arguments
      )
    }),
    pr = (b._emscripten_bind_b2WeldJointDef_set_frequencyHz_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_frequencyHz_1.apply(
        null,
        arguments
      )
    }),
    qr = (b._emscripten_bind_b2BodyDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2BodyDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    rr = (b._emscripten_bind_b2PrismaticJointDef_set_enableMotor_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_enableMotor_1.apply(
        null,
        arguments
      )
    }),
    sr = (b._emscripten_bind_b2Vec2_Skew_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_Skew_0.apply(null, arguments)
    }),
    tr = (b._emscripten_bind_b2MouseJoint_GetDampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetDampingRatio_0.apply(
        null,
        arguments
      )
    }),
    ur = (b._emscripten_bind_b2RevoluteJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    vr = (b._emscripten_bind_b2ContactFeature_set_typeB_1 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_set_typeB_1.apply(
        null,
        arguments
      )
    }),
    wr = (b._emscripten_bind_b2WheelJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    xr = (b._emscripten_bind_b2MotorJoint_GetMaxTorque_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetMaxTorque_0.apply(
        null,
        arguments
      )
    })
  b.setThrew = function() {
    return b.asm.setThrew.apply(null, arguments)
  }
  var yr = (b._emscripten_bind_b2PrismaticJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    zr = (b._emscripten_bind_b2FrictionJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    Ar = (b._emscripten_bind_b2FrictionJointDef_Initialize_3 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_Initialize_3.apply(
        null,
        arguments
      )
    }),
    Fb = (b._sbrk = function() {
      return b.asm._sbrk.apply(null, arguments)
    }),
    Br = (b._emscripten_bind_b2FrictionJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    Ab = (b._memcpy = function() {
      return b.asm._memcpy.apply(null, arguments)
    }),
    Cr = (b._emscripten_bind_b2FrictionJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Dr = (b._emscripten_enum_b2DrawFlag_e_pairBit = function() {
      return b.asm._emscripten_enum_b2DrawFlag_e_pairBit.apply(null, arguments)
    }),
    Er = (b._emscripten_bind_b2MassData_get_I_0 = function() {
      return b.asm._emscripten_bind_b2MassData_get_I_0.apply(null, arguments)
    }),
    Fr = (b._emscripten_bind_b2WheelJointDef_get_motorSpeed_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_motorSpeed_0.apply(
        null,
        arguments
      )
    }),
    Gr = (b._emscripten_bind_b2Filter_set_maskBits_1 = function() {
      return b.asm._emscripten_bind_b2Filter_set_maskBits_1.apply(
        null,
        arguments
      )
    }),
    Hr = (b._emscripten_bind_b2WheelJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    Ir = (b._emscripten_bind_b2EdgeShape_get_m_radius_0 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_get_m_radius_0.apply(
        null,
        arguments
      )
    }),
    Jr = (b._emscripten_bind_b2World_GetTreeHeight_0 = function() {
      return b.asm._emscripten_bind_b2World_GetTreeHeight_0.apply(
        null,
        arguments
      )
    }),
    Kr = (b._emscripten_bind_b2Mat22_b2Mat22_2 = function() {
      return b.asm._emscripten_bind_b2Mat22_b2Mat22_2.apply(null, arguments)
    }),
    Lr = (b._emscripten_bind_b2PrismaticJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    Mr = (b._emscripten_bind_b2Mat22_b2Mat22_0 = function() {
      return b.asm._emscripten_bind_b2Mat22_b2Mat22_0.apply(null, arguments)
    }),
    Nr = (b._emscripten_bind_b2PrismaticJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    Or = (b._emscripten_bind_b2RopeJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    Pr = (b._emscripten_bind_b2ChainShape_set_m_hasNextVertex_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_hasNextVertex_1.apply(
        null,
        arguments
      )
    }),
    Qr = (b._emscripten_bind_b2Mat22_set_ey_1 = function() {
      return b.asm._emscripten_bind_b2Mat22_set_ey_1.apply(null, arguments)
    }),
    Rr = (b._emscripten_bind_b2MotorJointDef_set_angularOffset_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_angularOffset_1.apply(
        null,
        arguments
      )
    }),
    Sr = (b._emscripten_bind_b2CircleShape_get_m_type_0 = function() {
      return b.asm._emscripten_bind_b2CircleShape_get_m_type_0.apply(
        null,
        arguments
      )
    }),
    Tr = (b._emscripten_bind_b2Body_GetType_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetType_0.apply(null, arguments)
    }),
    Ur = (b._emscripten_bind_b2ContactEdge_b2ContactEdge_0 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_b2ContactEdge_0.apply(
        null,
        arguments
      )
    }),
    Vr = (b._emscripten_bind_b2BodyDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2BodyDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    Wr = (b._emscripten_bind_b2FrictionJointDef_set_maxTorque_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_maxTorque_1.apply(
        null,
        arguments
      )
    }),
    Qa = (b._free = function() {
      return b.asm._free.apply(null, arguments)
    }),
    Xr = (b._emscripten_bind_b2PulleyJointDef_set_groundAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_groundAnchorB_1.apply(
        null,
        arguments
      )
    }),
    Yr = (b._emscripten_bind_b2RevoluteJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    Zr = (b._emscripten_bind_b2DistanceJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    })
  b.runPostSets = function() {
    return b.asm.runPostSets.apply(null, arguments)
  }
  var $r = (b._emscripten_bind_b2RevoluteJoint_SetLimits_2 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_SetLimits_2.apply(
        null,
        arguments
      )
    }),
    as = (b._emscripten_bind_b2WeldJointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_type_1.apply(
        null,
        arguments
      )
    }),
    bs = (b._emscripten_bind_b2MotorJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    cs = (b._emscripten_bind_b2FrictionJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    ds = (b._emscripten_bind_b2Shape_set_m_type_1 = function() {
      return b.asm._emscripten_bind_b2Shape_set_m_type_1.apply(null, arguments)
    }),
    es = (b._emscripten_bind_b2WheelJoint_GetJointTranslation_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetJointTranslation_0.apply(
        null,
        arguments
      )
    }),
    gs = (b._emscripten_bind_b2WheelJoint_GetMotorTorque_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetMotorTorque_1.apply(
        null,
        arguments
      )
    }),
    hs = (b._emscripten_bind_b2RopeJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    is = (b._emscripten_bind_b2RopeJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    js = (b._emscripten_bind_b2WheelJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    ks = (b._emscripten_bind_b2PrismaticJointDef_get_enableMotor_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_enableMotor_0.apply(
        null,
        arguments
      )
    }),
    ls = (b._emscripten_bind_b2MotorJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    ms = (b._emscripten_bind_JSDestructionListener___destroy___0 = function() {
      return b.asm._emscripten_bind_JSDestructionListener___destroy___0.apply(
        null,
        arguments
      )
    }),
    ns = (b._emscripten_bind_b2Transform_b2Transform_2 = function() {
      return b.asm._emscripten_bind_b2Transform_b2Transform_2.apply(
        null,
        arguments
      )
    }),
    ps = (b._emscripten_bind_b2WeldJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    qs = (b._emscripten_bind_b2ChainShape_RayCast_4 = function() {
      return b.asm._emscripten_bind_b2ChainShape_RayCast_4.apply(
        null,
        arguments
      )
    }),
    rs = (b._emscripten_bind_b2Vec2_set_y_1 = function() {
      return b.asm._emscripten_bind_b2Vec2_set_y_1.apply(null, arguments)
    }),
    ss = (b._emscripten_bind_b2PrismaticJoint_SetMotorSpeed_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_SetMotorSpeed_1.apply(
        null,
        arguments
      )
    }),
    ts = (b._emscripten_bind_b2ContactID_get_cf_0 = function() {
      return b.asm._emscripten_bind_b2ContactID_get_cf_0.apply(null, arguments)
    }),
    us = (b._emscripten_bind_b2DistanceJointDef_Initialize_4 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_Initialize_4.apply(
        null,
        arguments
      )
    }),
    vs = (b._emscripten_bind_b2ChainShape_get_m_radius_0 = function() {
      return b.asm._emscripten_bind_b2ChainShape_get_m_radius_0.apply(
        null,
        arguments
      )
    }),
    xs = (b._emscripten_bind_b2WeldJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    ys = (b._emscripten_bind_b2ChainShape_set_m_radius_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_radius_1.apply(
        null,
        arguments
      )
    }),
    zs = (b._emscripten_bind_b2DistanceJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    As = (b._emscripten_bind_b2World_Dump_0 = function() {
      return b.asm._emscripten_bind_b2World_Dump_0.apply(null, arguments)
    }),
    Bs = (b._emscripten_bind_b2RevoluteJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Cs = (b._emscripten_bind_JSContactFilter_JSContactFilter_0 = function() {
      return b.asm._emscripten_bind_JSContactFilter_JSContactFilter_0.apply(
        null,
        arguments
      )
    }),
    Ds = (b._emscripten_bind_b2Profile_set_solve_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_solve_1.apply(null, arguments)
    }),
    Es = (b._emscripten_bind_b2FixtureDef_set_density_1 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_set_density_1.apply(
        null,
        arguments
      )
    }),
    Fs = (b._emscripten_bind_b2WeldJoint_GetDampingRatio_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetDampingRatio_0.apply(
        null,
        arguments
      )
    }),
    Gs = (b._emscripten_bind_b2Color_get_b_0 = function() {
      return b.asm._emscripten_bind_b2Color_get_b_0.apply(null, arguments)
    }),
    Hs = (b._emscripten_bind_b2MouseJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Is = (b._emscripten_bind_b2CircleShape_ComputeAABB_3 = function() {
      return b.asm._emscripten_bind_b2CircleShape_ComputeAABB_3.apply(
        null,
        arguments
      )
    }),
    Js = (b._emscripten_bind_b2RopeJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    Ks = (b._emscripten_bind_b2PrismaticJointDef_get_enableLimit_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_enableLimit_0.apply(
        null,
        arguments
      )
    }),
    Ls = (b._emscripten_bind_b2ManifoldPoint_set_localPoint_1 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_set_localPoint_1.apply(
        null,
        arguments
      )
    }),
    Ms = (b._emscripten_bind_b2Fixture_GetFilterData_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetFilterData_0.apply(
        null,
        arguments
      )
    }),
    Ns = (b._emscripten_bind_b2World_GetBodyList_0 = function() {
      return b.asm._emscripten_bind_b2World_GetBodyList_0.apply(null, arguments)
    }),
    Os = (b._emscripten_bind_b2Body_GetJointList_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetJointList_0.apply(null, arguments)
    }),
    Ps = (b._emscripten_bind_b2Joint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetNext_0.apply(null, arguments)
    }),
    Qs = (b._emscripten_bind_b2Joint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetType_0.apply(null, arguments)
    }),
    Rs = (b._emscripten_bind_b2World_RayCast_3 = function() {
      return b.asm._emscripten_bind_b2World_RayCast_3.apply(null, arguments)
    }),
    Ss = (b._emscripten_bind_b2MassData_set_I_1 = function() {
      return b.asm._emscripten_bind_b2MassData_set_I_1.apply(null, arguments)
    }),
    Ts = (b._emscripten_bind_b2MassData___destroy___0 = function() {
      return b.asm._emscripten_bind_b2MassData___destroy___0.apply(
        null,
        arguments
      )
    }),
    Us = (b._emscripten_bind_b2Profile_get_collide_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_collide_0.apply(
        null,
        arguments
      )
    }),
    Vs = (b._emscripten_bind_b2Color_b2Color_3 = function() {
      return b.asm._emscripten_bind_b2Color_b2Color_3.apply(null, arguments)
    }),
    Ws = (b._emscripten_bind_b2Color_b2Color_0 = function() {
      return b.asm._emscripten_bind_b2Color_b2Color_0.apply(null, arguments)
    }),
    Xs = (b._emscripten_bind_b2WheelJointDef_get_frequencyHz_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_frequencyHz_0.apply(
        null,
        arguments
      )
    }),
    Ys = (b._emscripten_bind_b2WeldJointDef_Initialize_3 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_Initialize_3.apply(
        null,
        arguments
      )
    }),
    Zs = (b._emscripten_bind_b2RevoluteJoint_GetMotorTorque_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetMotorTorque_1.apply(
        null,
        arguments
      )
    }),
    $s = (b._emscripten_enum_b2JointType_e_gearJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_gearJoint.apply(
        null,
        arguments
      )
    }),
    at = (b._emscripten_bind_b2FixtureDef_get_friction_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_friction_0.apply(
        null,
        arguments
      )
    }),
    bt = (b._emscripten_bind_b2PrismaticJointDef_set_localAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_localAnchorA_1.apply(
        null,
        arguments
      )
    }),
    ct = (b._emscripten_bind_b2Contact_GetManifold_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetManifold_0.apply(
        null,
        arguments
      )
    }),
    dt = (b._emscripten_bind_b2QueryCallback___destroy___0 = function() {
      return b.asm._emscripten_bind_b2QueryCallback___destroy___0.apply(
        null,
        arguments
      )
    }),
    et = (b._emscripten_bind_b2WeldJointDef_get_localAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_localAnchorA_0.apply(
        null,
        arguments
      )
    }),
    ft = (b._emscripten_bind_b2MouseJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    gt = (b._emscripten_bind_b2MotorJointDef_set_correctionFactor_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_correctionFactor_1.apply(
        null,
        arguments
      )
    }),
    ht = (b._emscripten_bind_b2ChainShape_GetChildEdge_2 = function() {
      return b.asm._emscripten_bind_b2ChainShape_GetChildEdge_2.apply(
        null,
        arguments
      )
    }),
    it = (b._emscripten_enum_b2JointType_e_mouseJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_mouseJoint.apply(
        null,
        arguments
      )
    }),
    jt = (b._emscripten_bind_b2MotorJointDef_get_angularOffset_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_angularOffset_0.apply(
        null,
        arguments
      )
    }),
    kt = (b._emscripten_bind_b2WheelJoint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_SetUserData_1.apply(
        null,
        arguments
      )
    }),
    lt = (b._emscripten_bind_b2Body_ApplyForce_3 = function() {
      return b.asm._emscripten_bind_b2Body_ApplyForce_3.apply(null, arguments)
    }),
    mt = (b._emscripten_bind_b2ChainShape_set_m_count_1 = function() {
      return b.asm._emscripten_bind_b2ChainShape_set_m_count_1.apply(
        null,
        arguments
      )
    }),
    nt = (b._emscripten_bind_b2DistanceJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    ot = (b._emscripten_bind_b2RevoluteJoint_IsMotorEnabled_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_IsMotorEnabled_0.apply(
        null,
        arguments
      )
    }),
    pt = (b._emscripten_bind_b2PolygonShape_GetVertex_1 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_GetVertex_1.apply(
        null,
        arguments
      )
    }),
    qt = (b._emscripten_bind_b2World_SetGravity_1 = function() {
      return b.asm._emscripten_bind_b2World_SetGravity_1.apply(null, arguments)
    }),
    rt = (b._emscripten_bind_b2MouseJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    Ib = (b._llvm_bswap_i32 = function() {
      return b.asm._llvm_bswap_i32.apply(null, arguments)
    }),
    st = (b._emscripten_bind_b2Fixture_SetRestitution_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_SetRestitution_1.apply(
        null,
        arguments
      )
    }),
    tt = (b._emscripten_bind_b2Body_GetTransform_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetTransform_0.apply(null, arguments)
    }),
    ut = (b._emscripten_enum_b2ShapeType_e_typeCount = function() {
      return b.asm._emscripten_enum_b2ShapeType_e_typeCount.apply(
        null,
        arguments
      )
    }),
    vt = (b._emscripten_bind_b2Mat33_set_ex_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_set_ex_1.apply(null, arguments)
    }),
    wt = (b._emscripten_bind_b2PulleyJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    xt = (b._emscripten_bind_b2RevoluteJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    yt = (b._emscripten_bind_b2PrismaticJoint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetBodyB_0.apply(
        null,
        arguments
      )
    }),
    zt = (b._emscripten_bind_b2WheelJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    At = (b._emscripten_bind_b2MotorJointDef_set_maxForce_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_maxForce_1.apply(
        null,
        arguments
      )
    }),
    Bt = (b._emscripten_bind_b2BodyDef_get_angle_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_angle_0.apply(null, arguments)
    }),
    Ct = (b._emscripten_bind_b2FixtureDef_get_shape_0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef_get_shape_0.apply(
        null,
        arguments
      )
    }),
    Dt = (b._emscripten_bind_b2Body_SetAngularVelocity_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetAngularVelocity_1.apply(
        null,
        arguments
      )
    }),
    Et = (b._emscripten_bind_b2WeldJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Ft = (b._emscripten_bind_b2FrictionJoint_SetMaxForce_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_SetMaxForce_1.apply(
        null,
        arguments
      )
    }),
    Gt = (b._emscripten_bind_b2Mat33_b2Mat33_3 = function() {
      return b.asm._emscripten_bind_b2Mat33_b2Mat33_3.apply(null, arguments)
    }),
    Ht = (b._emscripten_bind_b2Vec3_get_y_0 = function() {
      return b.asm._emscripten_bind_b2Vec3_get_y_0.apply(null, arguments)
    }),
    It = (b._emscripten_bind_b2JointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2JointDef_get_type_0.apply(null, arguments)
    }),
    Jt = (b._emscripten_bind_JSQueryCallback_ReportFixture_1 = function() {
      return b.asm._emscripten_bind_JSQueryCallback_ReportFixture_1.apply(
        null,
        arguments
      )
    }),
    Kt = (b._emscripten_bind_b2PulleyJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    Lt = (b._emscripten_bind_b2Body_CreateFixture_1 = function() {
      return b.asm._emscripten_bind_b2Body_CreateFixture_1.apply(
        null,
        arguments
      )
    }),
    Mt = (b._emscripten_bind_JSDraw_JSDraw_0 = function() {
      return b.asm._emscripten_bind_JSDraw_JSDraw_0.apply(null, arguments)
    }),
    Nt = (b._emscripten_bind_b2MouseJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Ot = (b._emscripten_bind_b2Transform_get_p_0 = function() {
      return b.asm._emscripten_bind_b2Transform_get_p_0.apply(null, arguments)
    }),
    Pt = (b._emscripten_enum_b2BodyType_b2_dynamicBody = function() {
      return b.asm._emscripten_enum_b2BodyType_b2_dynamicBody.apply(
        null,
        arguments
      )
    }),
    Qt = (b._emscripten_bind_b2World_GetProfile_0 = function() {
      return b.asm._emscripten_bind_b2World_GetProfile_0.apply(null, arguments)
    }),
    Rt = (b._emscripten_bind_b2DistanceJointDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    St = (b._emscripten_bind_b2GearJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    Tt = (b._emscripten_bind_b2JointDef_set_type_1 = function() {
      return b.asm._emscripten_bind_b2JointDef_set_type_1.apply(null, arguments)
    }),
    Ut = (b._emscripten_bind_b2ContactEdge_set_contact_1 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_set_contact_1.apply(
        null,
        arguments
      )
    }),
    Vt = (b._emscripten_bind_b2MotorJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    Wt = (b._emscripten_bind_b2World_GetContactList_0 = function() {
      return b.asm._emscripten_bind_b2World_GetContactList_0.apply(
        null,
        arguments
      )
    }),
    Xt = (b._emscripten_bind_b2Mat33_set_ez_1 = function() {
      return b.asm._emscripten_bind_b2Mat33_set_ez_1.apply(null, arguments)
    }),
    Yt = (b._emscripten_bind_b2JointEdge_b2JointEdge_0 = function() {
      return b.asm._emscripten_bind_b2JointEdge_b2JointEdge_0.apply(
        null,
        arguments
      )
    }),
    Zt = (b._emscripten_bind_b2FrictionJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    $t = (b._emscripten_bind_b2WheelJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    au = (b._emscripten_bind_b2RevoluteJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    bu = (b._emscripten_bind_b2PulleyJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    cu = (b._emscripten_bind_b2RopeJoint_GetCollideConnected_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetCollideConnected_0.apply(
        null,
        arguments
      )
    }),
    du = (b._emscripten_bind_b2GearJointDef_set_joint2_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_joint2_1.apply(
        null,
        arguments
      )
    }),
    eu = (b._emscripten_bind_b2EdgeShape_set_m_vertex3_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_vertex3_1.apply(
        null,
        arguments
      )
    }),
    fu = (b._emscripten_bind_b2GearJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    gu = (b._emscripten_bind_b2RopeJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    hu = (b._emscripten_bind_b2Fixture_GetFriction_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetFriction_0.apply(
        null,
        arguments
      )
    }),
    iu = (b._emscripten_bind_b2Fixture_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetNext_0.apply(null, arguments)
    }),
    ju = (b._emscripten_bind_b2RopeJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    ku = (b._emscripten_bind_b2WeldJointDef_get_localAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_localAnchorB_0.apply(
        null,
        arguments
      )
    }),
    lu = (b._emscripten_bind_b2WeldJointDef_set_referenceAngle_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_referenceAngle_1.apply(
        null,
        arguments
      )
    }),
    mu = (b._emscripten_bind_b2DistanceJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    nu = (b._emscripten_bind_b2Mat33_SetZero_0 = function() {
      return b.asm._emscripten_bind_b2Mat33_SetZero_0.apply(null, arguments)
    }),
    ou = (b._emscripten_bind_b2MotorJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    pu = (b._emscripten_bind_b2WheelJointDef_b2WheelJointDef_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_b2WheelJointDef_0.apply(
        null,
        arguments
      )
    }),
    qu = (b._emscripten_bind_b2PrismaticJointDef_get_localAxisA_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_localAxisA_0.apply(
        null,
        arguments
      )
    }),
    ru = (b._emscripten_bind_b2Mat22_get_ey_0 = function() {
      return b.asm._emscripten_bind_b2Mat22_get_ey_0.apply(null, arguments)
    }),
    su = (b._emscripten_bind_b2Mat22_SetIdentity_0 = function() {
      return b.asm._emscripten_bind_b2Mat22_SetIdentity_0.apply(null, arguments)
    }),
    tu = (b._emscripten_bind_b2Joint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2Joint_IsActive_0.apply(null, arguments)
    }),
    uu = (b._emscripten_bind_b2PulleyJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    vu = (b._emscripten_bind_b2Shape_get_m_radius_0 = function() {
      return b.asm._emscripten_bind_b2Shape_get_m_radius_0.apply(
        null,
        arguments
      )
    }),
    wu = (b._emscripten_bind_b2Mat22_b2Mat22_4 = function() {
      return b.asm._emscripten_bind_b2Mat22_b2Mat22_4.apply(null, arguments)
    }),
    xu = (b._emscripten_bind_b2PrismaticJointDef_set_localAxisA_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_localAxisA_1.apply(
        null,
        arguments
      )
    }),
    yu = (b._emscripten_bind_b2PolygonShape_SetAsBox_4 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_SetAsBox_4.apply(
        null,
        arguments
      )
    }),
    zu = (b._emscripten_bind_b2EdgeShape_set_m_vertex1_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_vertex1_1.apply(
        null,
        arguments
      )
    }),
    Au = (b._emscripten_bind_b2Body_GetWorld_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetWorld_0.apply(null, arguments)
    }),
    Bu = (b._emscripten_enum_b2LimitState_e_inactiveLimit = function() {
      return b.asm._emscripten_enum_b2LimitState_e_inactiveLimit.apply(
        null,
        arguments
      )
    }),
    Cu = (b._emscripten_bind_b2Vec2_set_x_1 = function() {
      return b.asm._emscripten_bind_b2Vec2_set_x_1.apply(null, arguments)
    }),
    Du = (b._emscripten_bind_b2Body_SetAwake_1 = function() {
      return b.asm._emscripten_bind_b2Body_SetAwake_1.apply(null, arguments)
    }),
    Eu = (b._emscripten_bind_b2WeldJoint_GetLocalAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2WeldJoint_GetLocalAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Fu = (b._emscripten_bind_b2Vec2___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Vec2___destroy___0.apply(null, arguments)
    }),
    Gu = (b._emscripten_enum_b2ShapeType_e_polygon = function() {
      return b.asm._emscripten_enum_b2ShapeType_e_polygon.apply(null, arguments)
    }),
    Hu = (b._emscripten_bind_b2Body_GetInertia_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetInertia_0.apply(null, arguments)
    }),
    Iu = (b._emscripten_bind_b2PulleyJoint_GetAnchorA_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetAnchorA_0.apply(
        null,
        arguments
      )
    }),
    Ju = (b._emscripten_bind_b2BodyDef_get_linearVelocity_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_linearVelocity_0.apply(
        null,
        arguments
      )
    }),
    Ku = (b._emscripten_bind_b2DistanceJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    Lu = (b._emscripten_bind_b2Mat22___destroy___0 = function() {
      return b.asm._emscripten_bind_b2Mat22___destroy___0.apply(null, arguments)
    }),
    Mu = (b._emscripten_bind_b2RevoluteJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    Nu = (b._emscripten_bind_b2WeldJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    Ou = (b._emscripten_bind_b2MotorJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Pu = (b._emscripten_bind_b2Fixture_GetShape_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetShape_0.apply(null, arguments)
    }),
    Qu = (b._emscripten_bind_b2PulleyJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Ru = (b._emscripten_bind_b2Vec3_op_mul_1 = function() {
      return b.asm._emscripten_bind_b2Vec3_op_mul_1.apply(null, arguments)
    }),
    Su = (b._emscripten_bind_b2PolygonShape_set_m_type_1 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_set_m_type_1.apply(
        null,
        arguments
      )
    }),
    Tu = (b._emscripten_bind_b2WheelJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetType_0.apply(
        null,
        arguments
      )
    }),
    Uu = (b._emscripten_bind_b2MotorJoint_GetAngularOffset_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetAngularOffset_0.apply(
        null,
        arguments
      )
    }),
    Vu = (b._emscripten_bind_b2RevoluteJoint_IsActive_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_IsActive_0.apply(
        null,
        arguments
      )
    }),
    Wu = (b._emscripten_bind_b2GearJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetNext_0.apply(null, arguments)
    }),
    Xu = (b._emscripten_bind_b2MouseJointDef_get_maxForce_0 = function() {
      return b.asm._emscripten_bind_b2MouseJointDef_get_maxForce_0.apply(
        null,
        arguments
      )
    }),
    Yu = (b._emscripten_bind_b2DestructionListenerWrapper___destroy___0 = function() {
      return b.asm._emscripten_bind_b2DestructionListenerWrapper___destroy___0.apply(
        null,
        arguments
      )
    }),
    Zu = (b._emscripten_bind_b2PrismaticJointDef_set_maxMotorForce_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_set_maxMotorForce_1.apply(
        null,
        arguments
      )
    }),
    $u = (b._emscripten_bind_b2WheelJoint_GetLocalAxisA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetLocalAxisA_0.apply(
        null,
        arguments
      )
    }),
    av = (b._emscripten_bind_b2Body_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetNext_0.apply(null, arguments)
    }),
    bv = (b._emscripten_bind_b2MouseJoint_GetReactionForce_1 = function() {
      return b.asm._emscripten_bind_b2MouseJoint_GetReactionForce_1.apply(
        null,
        arguments
      )
    }),
    cv = (b._emscripten_bind_b2RopeJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    dv = (b._emscripten_bind_b2ContactFeature_set_indexA_1 = function() {
      return b.asm._emscripten_bind_b2ContactFeature_set_indexA_1.apply(
        null,
        arguments
      )
    }),
    ev = (b._emscripten_bind_b2Profile_get_solveInit_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_solveInit_0.apply(
        null,
        arguments
      )
    }),
    fv = (b._emscripten_bind_b2Fixture_IsSensor_0 = function() {
      return b.asm._emscripten_bind_b2Fixture_IsSensor_0.apply(null, arguments)
    }),
    gv = (b._emscripten_bind_b2FrictionJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    hv = (b._emscripten_bind_b2World_QueryAABB_2 = function() {
      return b.asm._emscripten_bind_b2World_QueryAABB_2.apply(null, arguments)
    }),
    iv = (b._emscripten_bind_b2Profile_set_collide_1 = function() {
      return b.asm._emscripten_bind_b2Profile_set_collide_1.apply(
        null,
        arguments
      )
    }),
    jv = (b._emscripten_bind_b2BodyDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    kv = (b._emscripten_bind_b2MotorJoint_SetLinearOffset_1 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_SetLinearOffset_1.apply(
        null,
        arguments
      )
    }),
    lv = (b._emscripten_bind_b2FrictionJoint_GetMaxForce_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetMaxForce_0.apply(
        null,
        arguments
      )
    }),
    mv = (b._emscripten_bind_b2WheelJointDef_get_userData_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_userData_0.apply(
        null,
        arguments
      )
    }),
    nv = (b._emscripten_bind_b2RevoluteJoint_IsLimitEnabled_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_IsLimitEnabled_0.apply(
        null,
        arguments
      )
    }),
    ov = (b._emscripten_bind_b2World_SetDestructionListener_1 = function() {
      return b.asm._emscripten_bind_b2World_SetDestructionListener_1.apply(
        null,
        arguments
      )
    }),
    pv = (b._emscripten_bind_b2RevoluteJointDef_set_maxMotorTorque_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_maxMotorTorque_1.apply(
        null,
        arguments
      )
    }),
    qv = (b._emscripten_bind_b2WeldJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    rv = (b._emscripten_bind_b2Transform_set_p_1 = function() {
      return b.asm._emscripten_bind_b2Transform_set_p_1.apply(null, arguments)
    }),
    sv = (b._emscripten_bind_b2DistanceJoint_SetLength_1 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_SetLength_1.apply(
        null,
        arguments
      )
    }),
    tv = (b._emscripten_bind_b2ManifoldPoint_get_localPoint_0 = function() {
      return b.asm._emscripten_bind_b2ManifoldPoint_get_localPoint_0.apply(
        null,
        arguments
      )
    }),
    uv = (b._emscripten_bind_b2JointEdge_get_joint_0 = function() {
      return b.asm._emscripten_bind_b2JointEdge_get_joint_0.apply(
        null,
        arguments
      )
    }),
    vv = (b._emscripten_bind_b2Body_GetLocalCenter_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetLocalCenter_0.apply(
        null,
        arguments
      )
    }),
    wv = (b._emscripten_bind_b2FixtureDef___destroy___0 = function() {
      return b.asm._emscripten_bind_b2FixtureDef___destroy___0.apply(
        null,
        arguments
      )
    }),
    xv = (b._emscripten_bind_b2MouseJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2MouseJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    yv = (b._emscripten_enum_b2JointType_e_ropeJoint = function() {
      return b.asm._emscripten_enum_b2JointType_e_ropeJoint.apply(
        null,
        arguments
      )
    }),
    zv = (b._emscripten_bind_b2Profile_get_solveVelocity_0 = function() {
      return b.asm._emscripten_bind_b2Profile_get_solveVelocity_0.apply(
        null,
        arguments
      )
    }),
    Av = (b._emscripten_bind_b2WeldJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    Bv = (b._emscripten_bind_b2World_GetContinuousPhysics_0 = function() {
      return b.asm._emscripten_bind_b2World_GetContinuousPhysics_0.apply(
        null,
        arguments
      )
    }),
    Cv = (b._emscripten_bind_b2Joint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetBodyA_0.apply(null, arguments)
    }),
    Dv = (b._emscripten_bind_b2MotorJointDef_set_maxTorque_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_maxTorque_1.apply(
        null,
        arguments
      )
    }),
    Ev = (b._emscripten_bind_b2PulleyJointDef_Initialize_7 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_Initialize_7.apply(
        null,
        arguments
      )
    }),
    Fv = (b._emscripten_bind_b2GearJointDef_set_bodyB_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_bodyB_1.apply(
        null,
        arguments
      )
    }),
    Gv = (b._emscripten_bind_b2RopeJoint_GetReactionTorque_1 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_GetReactionTorque_1.apply(
        null,
        arguments
      )
    }),
    Hv = (b._emscripten_bind_b2WheelJointDef_set_dampingRatio_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_dampingRatio_1.apply(
        null,
        arguments
      )
    }),
    Iv = (b._emscripten_bind_b2GearJoint_GetType_0 = function() {
      return b.asm._emscripten_bind_b2GearJoint_GetType_0.apply(null, arguments)
    }),
    Jv = (b._emscripten_bind_b2MotorJoint_GetNext_0 = function() {
      return b.asm._emscripten_bind_b2MotorJoint_GetNext_0.apply(
        null,
        arguments
      )
    }),
    Kv = (b._emscripten_bind_b2EdgeShape_set_m_vertex0_1 = function() {
      return b.asm._emscripten_bind_b2EdgeShape_set_m_vertex0_1.apply(
        null,
        arguments
      )
    }),
    Lv = (b._emscripten_bind_b2RevoluteJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2RevoluteJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    Mv = (b._emscripten_bind_b2RopeJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    Nv = (b._emscripten_bind_b2PrismaticJoint_GetUserData_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_GetUserData_0.apply(
        null,
        arguments
      )
    }),
    Ov = (b._emscripten_bind_b2GearJointDef_set_userData_1 = function() {
      return b.asm._emscripten_bind_b2GearJointDef_set_userData_1.apply(
        null,
        arguments
      )
    }),
    Pv = (b._emscripten_bind_b2Fixture_SetSensor_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_SetSensor_1.apply(null, arguments)
    }),
    Qv = (b._emscripten_bind_b2MotorJointDef_set_collideConnected_1 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_set_collideConnected_1.apply(
        null,
        arguments
      )
    }),
    Rv = (b._emscripten_bind_b2Contact_GetFixtureB_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetFixtureB_0.apply(
        null,
        arguments
      )
    }),
    Sv = (b._emscripten_bind_b2ChainShape_ComputeMass_2 = function() {
      return b.asm._emscripten_bind_b2ChainShape_ComputeMass_2.apply(
        null,
        arguments
      )
    }),
    Tv = (b._emscripten_bind_b2WeldJointDef_b2WeldJointDef_0 = function() {
      return b.asm._emscripten_bind_b2WeldJointDef_b2WeldJointDef_0.apply(
        null,
        arguments
      )
    }),
    Uv = (b._emscripten_bind_b2Contact_GetChildIndexA_0 = function() {
      return b.asm._emscripten_bind_b2Contact_GetChildIndexA_0.apply(
        null,
        arguments
      )
    }),
    Vv = (b._emscripten_bind_b2RopeJointDef_get_bodyB_0 = function() {
      return b.asm._emscripten_bind_b2RopeJointDef_get_bodyB_0.apply(
        null,
        arguments
      )
    }),
    Wv = (b._emscripten_bind_b2BodyDef_b2BodyDef_0 = function() {
      return b.asm._emscripten_bind_b2BodyDef_b2BodyDef_0.apply(null, arguments)
    }),
    Xv = (b._emscripten_bind_b2MassData_get_mass_0 = function() {
      return b.asm._emscripten_bind_b2MassData_get_mass_0.apply(null, arguments)
    }),
    Yv = (b._emscripten_bind_b2Joint_SetUserData_1 = function() {
      return b.asm._emscripten_bind_b2Joint_SetUserData_1.apply(null, arguments)
    }),
    Zv = (b._emscripten_bind_b2Joint_GetBodyB_0 = function() {
      return b.asm._emscripten_bind_b2Joint_GetBodyB_0.apply(null, arguments)
    }),
    $v = (b._emscripten_bind_b2Shape_GetChildCount_0 = function() {
      return b.asm._emscripten_bind_b2Shape_GetChildCount_0.apply(
        null,
        arguments
      )
    }),
    aw = (b._emscripten_bind_b2WheelJointDef_set_localAxisA_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_localAxisA_1.apply(
        null,
        arguments
      )
    }),
    bw = (b._emscripten_bind_b2Joint_Dump_0 = function() {
      return b.asm._emscripten_bind_b2Joint_Dump_0.apply(null, arguments)
    }),
    cw = (b._emscripten_bind_b2Color_get_r_0 = function() {
      return b.asm._emscripten_bind_b2Color_get_r_0.apply(null, arguments)
    }),
    dw = (b._emscripten_bind_b2RevoluteJointDef_set_motorSpeed_1 = function() {
      return b.asm._emscripten_bind_b2RevoluteJointDef_set_motorSpeed_1.apply(
        null,
        arguments
      )
    }),
    ew = (b._emscripten_bind_b2MotorJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2MotorJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    fw = (b._emscripten_bind_b2WheelJointDef_get_enableMotor_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_enableMotor_0.apply(
        null,
        arguments
      )
    }),
    gw = (b._emscripten_bind_b2Vec2_LengthSquared_0 = function() {
      return b.asm._emscripten_bind_b2Vec2_LengthSquared_0.apply(
        null,
        arguments
      )
    }),
    hw = (b._emscripten_bind_b2FrictionJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2FrictionJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    iw = (b._emscripten_bind_b2WheelJoint_GetSpringFrequencyHz_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetSpringFrequencyHz_0.apply(
        null,
        arguments
      )
    }),
    jw = (b._emscripten_bind_b2ContactEdge_set_prev_1 = function() {
      return b.asm._emscripten_bind_b2ContactEdge_set_prev_1.apply(
        null,
        arguments
      )
    }),
    kw = (b._emscripten_bind_b2Shape_ComputeMass_2 = function() {
      return b.asm._emscripten_bind_b2Shape_ComputeMass_2.apply(null, arguments)
    }),
    lw = (b._emscripten_bind_b2FrictionJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2FrictionJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    mw = (b._emscripten_bind_b2WheelJointDef_set_localAnchorB_1 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_set_localAnchorB_1.apply(
        null,
        arguments
      )
    }),
    nw = (b._emscripten_bind_b2Body_GetAngle_0 = function() {
      return b.asm._emscripten_bind_b2Body_GetAngle_0.apply(null, arguments)
    }),
    ow = (b._emscripten_bind_b2PrismaticJointDef_get_maxMotorForce_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_maxMotorForce_0.apply(
        null,
        arguments
      )
    }),
    pw = (b._emscripten_bind_b2DistanceJoint_GetBodyA_0 = function() {
      return b.asm._emscripten_bind_b2DistanceJoint_GetBodyA_0.apply(
        null,
        arguments
      )
    }),
    qw = (b._emscripten_bind_b2WheelJoint_GetLocalAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetLocalAnchorB_0.apply(
        null,
        arguments
      )
    }),
    rw = (b._emscripten_bind_b2PulleyJointDef_set_bodyA_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_bodyA_1.apply(
        null,
        arguments
      )
    }),
    sw = (b._emscripten_bind_b2WheelJoint_GetAnchorB_0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint_GetAnchorB_0.apply(
        null,
        arguments
      )
    }),
    tw = (b._emscripten_bind_b2PolygonShape_SetAsBox_2 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_SetAsBox_2.apply(
        null,
        arguments
      )
    }),
    uw = (b._emscripten_bind_b2PrismaticJointDef_get_type_0 = function() {
      return b.asm._emscripten_bind_b2PrismaticJointDef_get_type_0.apply(
        null,
        arguments
      )
    }),
    vw = (b._emscripten_bind_b2Color_Set_3 = function() {
      return b.asm._emscripten_bind_b2Color_Set_3.apply(null, arguments)
    }),
    ww = (b._emscripten_bind_b2WheelJointDef_get_bodyA_0 = function() {
      return b.asm._emscripten_bind_b2WheelJointDef_get_bodyA_0.apply(
        null,
        arguments
      )
    }),
    xw = (b._emscripten_enum_b2LimitState_e_atUpperLimit = function() {
      return b.asm._emscripten_enum_b2LimitState_e_atUpperLimit.apply(
        null,
        arguments
      )
    }),
    yw = (b._emscripten_bind_b2PulleyJointDef_set_groundAnchorA_1 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_set_groundAnchorA_1.apply(
        null,
        arguments
      )
    }),
    zw = (b._emscripten_bind_b2PolygonShape_get_m_type_0 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_get_m_type_0.apply(
        null,
        arguments
      )
    }),
    Aw = (b._emscripten_bind_b2PrismaticJoint_SetMaxMotorForce_1 = function() {
      return b.asm._emscripten_bind_b2PrismaticJoint_SetMaxMotorForce_1.apply(
        null,
        arguments
      )
    }),
    Bw = (b._emscripten_bind_b2PulleyJointDef_get_collideConnected_0 = function() {
      return b.asm._emscripten_bind_b2PulleyJointDef_get_collideConnected_0.apply(
        null,
        arguments
      )
    }),
    Cw = (b._emscripten_bind_JSContactListener_JSContactListener_0 = function() {
      return b.asm._emscripten_bind_JSContactListener_JSContactListener_0.apply(
        null,
        arguments
      )
    }),
    Dw = (b._emscripten_bind_b2WheelJoint___destroy___0 = function() {
      return b.asm._emscripten_bind_b2WheelJoint___destroy___0.apply(
        null,
        arguments
      )
    }),
    Ew = (b._emscripten_bind_b2PolygonShape_set_m_radius_1 = function() {
      return b.asm._emscripten_bind_b2PolygonShape_set_m_radius_1.apply(
        null,
        arguments
      )
    }),
    Fw = (b._emscripten_bind_b2Fixture_GetMassData_1 = function() {
      return b.asm._emscripten_bind_b2Fixture_GetMassData_1.apply(
        null,
        arguments
      )
    }),
    Gw = (b._emscripten_bind_b2RopeJoint_SetMaxLength_1 = function() {
      return b.asm._emscripten_bind_b2RopeJoint_SetMaxLength_1.apply(
        null,
        arguments
      )
    })
  b.dynCall_iiii = function() {
    return b.asm.dynCall_iiii.apply(null, arguments)
  }
  b.dynCall_viifii = function() {
    return b.asm.dynCall_viifii.apply(null, arguments)
  }
  b.dynCall_viiiii = function() {
    return b.asm.dynCall_viiiii.apply(null, arguments)
  }
  b.dynCall_vi = function() {
    return b.asm.dynCall_vi.apply(null, arguments)
  }
  b.dynCall_vii = function() {
    return b.asm.dynCall_vii.apply(null, arguments)
  }
  b.dynCall_ii = function() {
    return b.asm.dynCall_ii.apply(null, arguments)
  }
  b.dynCall_fif = function() {
    return b.asm.dynCall_fif.apply(null, arguments)
  }
  b.dynCall_viii = function() {
    return b.asm.dynCall_viii.apply(null, arguments)
  }
  b.dynCall_viifi = function() {
    return b.asm.dynCall_viifi.apply(null, arguments)
  }
  b.dynCall_v = function() {
    return b.asm.dynCall_v.apply(null, arguments)
  }
  b.dynCall_viif = function() {
    return b.asm.dynCall_viif.apply(null, arguments)
  }
  b.dynCall_viiiiii = function() {
    return b.asm.dynCall_viiiiii.apply(null, arguments)
  }
  b.dynCall_iii = function() {
    return b.asm.dynCall_iii.apply(null, arguments)
  }
  b.dynCall_iiiiii = function() {
    return b.asm.dynCall_iiiiii.apply(null, arguments)
  }
  b.dynCall_fiiiif = function() {
    return b.asm.dynCall_fiiiif.apply(null, arguments)
  }
  b.dynCall_viiii = function() {
    return b.asm.dynCall_viiii.apply(null, arguments)
  }
  f.t = b.stackAlloc
  f.L = b.stackSave
  f.K = b.stackRestore
  f.Q = b.establishStackSpace
  f.f = b.setTempRet0
  f.H = b.getTempRet0
  b.asm = Kb
  if (rb)
    if (
      ("function" === typeof b.locateFile
        ? (rb = b.locateFile(rb))
        : b.memoryInitializerPrefixURL &&
          (rb = b.memoryInitializerPrefixURL + rb),
      ea || fa)
    ) {
      var Hw = b.readBinary(rb)
      Ea.set(Hw, f.i)
    } else {
      var Jw = function() {
        b.readAsync(rb, Iw, function() {
          throw "could not load memory initializer " + rb
        })
      }
      pb()
      var Iw = function(a) {
        a.byteLength && (a = new Uint8Array(a))
        Ea.set(a, f.i)
        b.memoryInitializerRequest && delete b.memoryInitializerRequest.response
        qb()
      }
      if (b.memoryInitializerRequest) {
        var Kw = function() {
          var a = b.memoryInitializerRequest
          200 !== a.status && 0 !== a.status
            ? (console.warn(
                "a problem seems to have happened with Module.memoryInitializerRequest, status: " +
                  a.status +
                  ", retrying " +
                  rb
              ),
              Jw())
            : Iw(a.response)
        }
        b.memoryInitializerRequest.response
          ? setTimeout(Kw, 0)
          : b.memoryInitializerRequest.addEventListener("load", Kw)
      } else Jw()
    }
  b.then = function(a) {
    if (b.calledRun) a(b)
    else {
      var c = b.onRuntimeInitialized
      b.onRuntimeInitialized = function() {
        c && c()
        a(b)
      }
    }
    return b
  }
  function ja(a) {
    this.name = "ExitStatus"
    this.message = "Program terminated with exit(" + a + ")"
    this.status = a
  }
  ja.prototype = Error()
  ja.prototype.constructor = ja
  var Lw = null,
    ob = function Mw() {
      b.calledRun || Nw()
      b.calledRun || (ob = Mw)
    }
  b.callMain = b.O = function(a) {
    function c() {
      for (var a = 0; 3 > a; a++) e.push(0)
    }
    a = a || []
    hb || ((hb = !0), bb(db))
    var d = a.length + 1,
      e = [Ba(jb(b.thisProgram), "i8", 0)]
    c()
    for (var h = 0; h < d - 1; h += 1) e.push(Ba(jb(a[h]), "i8", 0)), c()
    e.push(0)
    e = Ba(e, "i32", 0)
    try {
      var l = b._main(d, e, 0)
      Ow(l, !0)
    } catch (m) {
      m instanceof ja ||
        ("SimulateInfiniteLoop" == m
          ? (b.noExitRuntime = !0)
          : ((a = m) && "object" === typeof m && m.stack && (a = [m, m.stack]),
            b.h("exception thrown: " + a),
            b.quit(1, m)))
    } finally {
    }
  }
  function Nw(a) {
    function c() {
      if (!b.calledRun && ((b.calledRun = !0), !ua)) {
        hb || ((hb = !0), bb(db))
        bb(eb)
        if (b.onRuntimeInitialized) b.onRuntimeInitialized()
        b._main && Pw && b.callMain(a)
        if (b.postRun)
          for (
            "function" == typeof b.postRun && (b.postRun = [b.postRun]);
            b.postRun.length;

          ) {
            var c = b.postRun.shift()
            gb.unshift(c)
          }
        bb(gb)
      }
    }
    a = a || b.arguments
    null === Lw && (Lw = Date.now())
    if (!(0 < mb)) {
      if (b.preRun)
        for (
          "function" == typeof b.preRun && (b.preRun = [b.preRun]);
          b.preRun.length;

        )
          ib()
      bb(cb)
      0 < mb ||
        b.calledRun ||
        (b.setStatus
          ? (b.setStatus("Running..."),
            setTimeout(function() {
              setTimeout(function() {
                b.setStatus("")
              }, 1)
              c()
            }, 1))
          : c())
    }
  }
  b.run = b.run = Nw
  function Ow(a, c) {
    if (!c || !b.noExitRuntime) {
      if (!b.noExitRuntime && ((ua = !0), (la = void 0), bb(fb), b.onExit))
        b.onExit(a)
      ea && process.exit(a)
      b.quit(a, new ja(a))
    }
  }
  b.exit = b.exit = Ow
  var Qw = []
  function va(a) {
    void 0 !== a ? (b.print(a), b.h(a), (a = JSON.stringify(a))) : (a = "")
    ua = !0
    var c =
      "abort(" +
      a +
      ") at " +
      Ra() +
      "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information."
    Qw &&
      Qw.forEach(function(d) {
        c = d(c, a)
      })
    throw c
  }
  b.abort = b.abort = va
  if (b.preInit)
    for (
      "function" == typeof b.preInit && (b.preInit = [b.preInit]);
      0 < b.preInit.length;

    )
      b.preInit.pop()()
  var Pw = !0
  b.noInitialRun && (Pw = !1)
  b.noExitRuntime = !0
  Nw()
  function g() {}
  g.prototype = Object.create(g.prototype)
  g.prototype.constructor = g
  g.prototype.b = g
  g.c = {}
  b.WrapperObject = g
  function k(a) {
    return (a || g).c
  }
  b.getCache = k
  function n(a, c) {
    var d = k(c),
      e = d[a]
    if (e) return e
    e = Object.create((c || g).prototype)
    e.a = a
    return (d[a] = e)
  }
  b.wrapPointer = n
  b.castObject = function(a, c) {
    return n(a.a, c)
  }
  b.NULL = n(0)
  b.destroy = function(a) {
    if (!a.__destroy__)
      throw "Error: Cannot destroy object. (Did you create it yourself?)"
    a.__destroy__()
    delete k(a.b)[a.a]
  }
  b.compare = function(a, c) {
    return a.a === c.a
  }
  b.getPointer = function(a) {
    return a.a
  }
  b.getClass = function(a) {
    return a.b
  }
  function Rw() {
    throw "cannot construct a b2DestructionListenerWrapper, no constructor in IDL"
  }
  Rw.prototype = Object.create(g.prototype)
  Rw.prototype.constructor = Rw
  Rw.prototype.b = Rw
  Rw.c = {}
  b.b2DestructionListenerWrapper = Rw
  Rw.prototype.__destroy__ = function() {
    Yu(this.a)
  }
  function Sw() {
    throw "cannot construct a b2Draw, no constructor in IDL"
  }
  Sw.prototype = Object.create(g.prototype)
  Sw.prototype.constructor = Sw
  Sw.prototype.b = Sw
  Sw.c = {}
  b.b2Draw = Sw
  Sw.prototype.SetFlags = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ae(c, a)
  }
  Sw.prototype.GetFlags = function() {
    return Vb(this.a)
  }
  Sw.prototype.AppendFlags = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    wh(c, a)
  }
  Sw.prototype.ClearFlags = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Sh(c, a)
  }
  Sw.prototype.__destroy__ = function() {
    Wi(this.a)
  }
  function p() {
    throw "cannot construct a b2Joint, no constructor in IDL"
  }
  p.prototype = Object.create(g.prototype)
  p.prototype.constructor = p
  p.prototype.b = p
  p.c = {}
  b.b2Joint = p
  p.prototype.GetType = function() {
    return Qs(this.a)
  }
  p.prototype.GetBodyA = function() {
    return n(Cv(this.a), q)
  }
  p.prototype.GetBodyB = function() {
    return n(Zv(this.a), q)
  }
  p.prototype.GetAnchorA = function() {
    return n(Um(this.a), r)
  }
  p.prototype.GetAnchorB = function() {
    return n($i(this.a), r)
  }
  p.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Ml(c, a), r)
  }
  p.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Jj(c, a)
  }
  p.prototype.GetNext = function() {
    return n(Ps(this.a), p)
  }
  p.prototype.GetUserData = function() {
    return Qk(this.a)
  }
  p.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yv(c, a)
  }
  p.prototype.IsActive = function() {
    return !!tu(this.a)
  }
  p.prototype.GetCollideConnected = function() {
    return !!af(this.a)
  }
  p.prototype.Dump = function() {
    bw(this.a)
  }
  function Tw() {
    throw "cannot construct a b2RayCastCallback, no constructor in IDL"
  }
  Tw.prototype = Object.create(g.prototype)
  Tw.prototype.constructor = Tw
  Tw.prototype.b = Tw
  Tw.c = {}
  b.b2RayCastCallback = Tw
  Tw.prototype.__destroy__ = function() {
    ph(this.a)
  }
  function Uw() {
    throw "cannot construct a b2ContactListener, no constructor in IDL"
  }
  Uw.prototype = Object.create(g.prototype)
  Uw.prototype.constructor = Uw
  Uw.prototype.b = Uw
  Uw.c = {}
  b.b2ContactListener = Uw
  Uw.prototype.__destroy__ = function() {
    Bo(this.a)
  }
  function Vw() {
    throw "cannot construct a b2QueryCallback, no constructor in IDL"
  }
  Vw.prototype = Object.create(g.prototype)
  Vw.prototype.constructor = Vw
  Vw.prototype.b = Vw
  Vw.c = {}
  b.b2QueryCallback = Vw
  Vw.prototype.__destroy__ = function() {
    dt(this.a)
  }
  function t() {
    this.a = Mm()
    k(t)[this.a] = this
  }
  t.prototype = Object.create(g.prototype)
  t.prototype.constructor = t
  t.prototype.b = t
  t.c = {}
  b.b2JointDef = t
  t.prototype.get_type = function() {
    return It(this.a)
  }
  t.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Tt(c, a)
  }
  t.prototype.get_userData = function() {
    return Dm(this.a)
  }
  t.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Vp(c, a)
  }
  t.prototype.get_bodyA = function() {
    return n(nr(this.a), q)
  }
  t.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qk(c, a)
  }
  t.prototype.get_bodyB = function() {
    return n(Pm(this.a), q)
  }
  t.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Zq(c, a)
  }
  t.prototype.get_collideConnected = function() {
    return !!Zc(this.a)
  }
  t.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    lk(c, a)
  }
  t.prototype.__destroy__ = function() {
    Ne(this.a)
  }
  function Ww() {
    throw "cannot construct a b2Shape, no constructor in IDL"
  }
  Ww.prototype = Object.create(g.prototype)
  Ww.prototype.constructor = Ww
  Ww.prototype.b = Ww
  Ww.c = {}
  b.b2Shape = Ww
  Ww.prototype.GetType = function() {
    return Gn(this.a)
  }
  Ww.prototype.GetChildCount = function() {
    return $v(this.a)
  }
  Ww.prototype.TestPoint = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!lr(d, a, c)
  }
  Ww.prototype.RayCast = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    return !!Uc(h, a, c, d, e)
  }
  Ww.prototype.ComputeAABB = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Rb(e, a, c, d)
  }
  Ww.prototype.ComputeMass = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    kw(d, a, c)
  }
  Ww.prototype.get_m_type = function() {
    return Zj(this.a)
  }
  Ww.prototype.set_m_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ds(c, a)
  }
  Ww.prototype.get_m_radius = function() {
    return vu(this.a)
  }
  Ww.prototype.set_m_radius = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    kf(c, a)
  }
  Ww.prototype.__destroy__ = function() {
    Ll(this.a)
  }
  function Xw() {
    throw "cannot construct a b2ContactFilter, no constructor in IDL"
  }
  Xw.prototype = Object.create(g.prototype)
  Xw.prototype.constructor = Xw
  Xw.prototype.b = Xw
  Xw.c = {}
  b.b2ContactFilter = Xw
  Xw.prototype.__destroy__ = function() {
    Lf(this.a)
  }
  function Yw() {
    this.a = He()
    k(Yw)[this.a] = this
  }
  Yw.prototype = Object.create(Rw.prototype)
  Yw.prototype.constructor = Yw
  Yw.prototype.b = Yw
  Yw.c = {}
  b.JSDestructionListener = Yw
  Yw.prototype.SayGoodbyeJoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kl(c, a)
  }
  Yw.prototype.SayGoodbyeFixture = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Op(c, a)
  }
  Yw.prototype.__destroy__ = function() {
    ms(this.a)
  }
  function Zw() {
    throw "cannot construct a b2ContactImpulse, no constructor in IDL"
  }
  Zw.prototype = Object.create(g.prototype)
  Zw.prototype.constructor = Zw
  Zw.prototype.b = Zw
  Zw.c = {}
  b.b2ContactImpulse = Zw
  Zw.prototype.get_count = function() {
    return nn(this.a)
  }
  Zw.prototype.set_count = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ng(c, a)
  }
  Zw.prototype.__destroy__ = function() {
    Ce(this.a)
  }
  function u() {
    throw "cannot construct a b2DistanceJoint, no constructor in IDL"
  }
  u.prototype = Object.create(p.prototype)
  u.prototype.constructor = u
  u.prototype.b = u
  u.c = {}
  b.b2DistanceJoint = u
  u.prototype.GetLocalAnchorA = function() {
    return n(fe(this.a), r)
  }
  u.prototype.GetLocalAnchorB = function() {
    return n(Nh(this.a), r)
  }
  u.prototype.SetLength = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    sv(c, a)
  }
  u.prototype.GetLength = function() {
    return Tj(this.a)
  }
  u.prototype.SetFrequency = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Lg(c, a)
  }
  u.prototype.GetFrequency = function() {
    return Cl(this.a)
  }
  u.prototype.SetDampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    te(c, a)
  }
  u.prototype.GetDampingRatio = function() {
    return ch(this.a)
  }
  u.prototype.GetType = function() {
    return vk(this.a)
  }
  u.prototype.GetBodyA = function() {
    return n(pw(this.a), q)
  }
  u.prototype.GetBodyB = function() {
    return n(Le(this.a), q)
  }
  u.prototype.GetAnchorA = function() {
    return n(Ic(this.a), r)
  }
  u.prototype.GetAnchorB = function() {
    return n(xg(this.a), r)
  }
  u.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Qm(c, a), r)
  }
  u.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return zs(c, a)
  }
  u.prototype.GetNext = function() {
    return n(ce(this.a), p)
  }
  u.prototype.GetUserData = function() {
    return Cd(this.a)
  }
  u.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Of(c, a)
  }
  u.prototype.IsActive = function() {
    return !!tg(this.a)
  }
  u.prototype.GetCollideConnected = function() {
    return !!nt(this.a)
  }
  u.prototype.__destroy__ = function() {
    Lk(this.a)
  }
  function $w(a, c, d) {
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    this.a =
      void 0 === a
        ? fg()
        : void 0 === c
        ? _emscripten_bind_b2Mat33_b2Mat33_1(a)
        : void 0 === d
        ? _emscripten_bind_b2Mat33_b2Mat33_2(a, c)
        : Gt(a, c, d)
    k($w)[this.a] = this
  }
  $w.prototype = Object.create(g.prototype)
  $w.prototype.constructor = $w
  $w.prototype.b = $w
  $w.c = {}
  b.b2Mat33 = $w
  $w.prototype.SetZero = function() {
    nu(this.a)
  }
  $w.prototype.Solve33 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Wo(c, a), ax)
  }
  $w.prototype.Solve22 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Jf(c, a), r)
  }
  $w.prototype.GetInverse22 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    um(c, a)
  }
  $w.prototype.GetSymInverse33 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    el(c, a)
  }
  $w.prototype.get_ex = function() {
    return n(Hg(this.a), ax)
  }
  $w.prototype.set_ex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    vt(c, a)
  }
  $w.prototype.get_ey = function() {
    return n(Ac(this.a), ax)
  }
  $w.prototype.set_ey = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dc(c, a)
  }
  $w.prototype.get_ez = function() {
    return n(Ue(this.a), ax)
  }
  $w.prototype.set_ez = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Xt(c, a)
  }
  $w.prototype.__destroy__ = function() {
    Wc(this.a)
  }
  function v() {
    throw "cannot construct a b2Fixture, no constructor in IDL"
  }
  v.prototype = Object.create(g.prototype)
  v.prototype.constructor = v
  v.prototype.b = v
  v.c = {}
  b.b2Fixture = v
  v.prototype.GetType = function() {
    return xk(this.a)
  }
  v.prototype.GetShape = function() {
    return n(Pu(this.a), Ww)
  }
  v.prototype.SetSensor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Pv(c, a)
  }
  v.prototype.IsSensor = function() {
    return !!fv(this.a)
  }
  v.prototype.SetFilterData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Sp(c, a)
  }
  v.prototype.GetFilterData = function() {
    return n(Ms(this.a), bx)
  }
  v.prototype.Refilter = function() {
    $n(this.a)
  }
  v.prototype.GetBody = function() {
    return n(Mg(this.a), q)
  }
  v.prototype.GetNext = function() {
    return n(iu(this.a), v)
  }
  v.prototype.GetUserData = function() {
    return rl(this.a)
  }
  v.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qi(c, a)
  }
  v.prototype.TestPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return !!dl(c, a)
  }
  v.prototype.RayCast = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    return !!pk(e, a, c, d)
  }
  v.prototype.GetMassData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fw(c, a)
  }
  v.prototype.SetDensity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Tg(c, a)
  }
  v.prototype.GetDensity = function() {
    return lp(this.a)
  }
  v.prototype.GetFriction = function() {
    return hu(this.a)
  }
  v.prototype.SetFriction = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    no(c, a)
  }
  v.prototype.GetRestitution = function() {
    return he(this.a)
  }
  v.prototype.SetRestitution = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    st(c, a)
  }
  v.prototype.GetAABB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Zm(c, a), cx)
  }
  v.prototype.Dump = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Am(c, a)
  }
  v.prototype.__destroy__ = function() {
    ic(this.a)
  }
  function bx() {
    this.a = Gd()
    k(bx)[this.a] = this
  }
  bx.prototype = Object.create(g.prototype)
  bx.prototype.constructor = bx
  bx.prototype.b = bx
  bx.c = {}
  b.b2Filter = bx
  bx.prototype.get_categoryBits = function() {
    return lm(this.a)
  }
  bx.prototype.set_categoryBits = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    nl(c, a)
  }
  bx.prototype.get_maskBits = function() {
    return vo(this.a)
  }
  bx.prototype.set_maskBits = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Gr(c, a)
  }
  bx.prototype.get_groupIndex = function() {
    return Pe(this.a)
  }
  bx.prototype.set_groupIndex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Lm(c, a)
  }
  bx.prototype.__destroy__ = function() {
    vn(this.a)
  }
  function dx() {
    this.a = ad()
    k(dx)[this.a] = this
  }
  dx.prototype = Object.create(Vw.prototype)
  dx.prototype.constructor = dx
  dx.prototype.b = dx
  dx.c = {}
  b.JSQueryCallback = dx
  dx.prototype.ReportFixture = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return !!Jt(c, a)
  }
  dx.prototype.__destroy__ = function() {
    Zn(this.a)
  }
  function w() {
    throw "cannot construct a b2MouseJoint, no constructor in IDL"
  }
  w.prototype = Object.create(p.prototype)
  w.prototype.constructor = w
  w.prototype.b = w
  w.c = {}
  b.b2MouseJoint = w
  w.prototype.SetTarget = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    $f(c, a)
  }
  w.prototype.GetTarget = function() {
    return n(Yn(this.a), r)
  }
  w.prototype.SetMaxForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Tp(c, a)
  }
  w.prototype.GetMaxForce = function() {
    return Zf(this.a)
  }
  w.prototype.SetFrequency = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jl(c, a)
  }
  w.prototype.GetFrequency = function() {
    return Go(this.a)
  }
  w.prototype.SetDampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ak(c, a)
  }
  w.prototype.GetDampingRatio = function() {
    return tr(this.a)
  }
  w.prototype.GetType = function() {
    return Xn(this.a)
  }
  w.prototype.GetBodyA = function() {
    return n(ko(this.a), q)
  }
  w.prototype.GetBodyB = function() {
    return n(Ji(this.a), q)
  }
  w.prototype.GetAnchorA = function() {
    return n(Nt(this.a), r)
  }
  w.prototype.GetAnchorB = function() {
    return n(rq(this.a), r)
  }
  w.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(bv(c, a), r)
  }
  w.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Bn(c, a)
  }
  w.prototype.GetNext = function() {
    return n(bi(this.a), p)
  }
  w.prototype.GetUserData = function() {
    return bq(this.a)
  }
  w.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ft(c, a)
  }
  w.prototype.IsActive = function() {
    return !!Tb(this.a)
  }
  w.prototype.GetCollideConnected = function() {
    return !!Bc(this.a)
  }
  w.prototype.__destroy__ = function() {
    xv(this.a)
  }
  function ex(a) {
    a && "object" === typeof a && (a = a.a)
    this.a = void 0 === a ? Tn() : Un(a)
    k(ex)[this.a] = this
  }
  ex.prototype = Object.create(g.prototype)
  ex.prototype.constructor = ex
  ex.prototype.b = ex
  ex.c = {}
  b.b2Rot = ex
  ex.prototype.Set = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ff(c, a)
  }
  ex.prototype.SetIdentity = function() {
    Zp(this.a)
  }
  ex.prototype.GetAngle = function() {
    return dp(this.a)
  }
  ex.prototype.GetXAxis = function() {
    return n(eg(this.a), r)
  }
  ex.prototype.GetYAxis = function() {
    return n(Nq(this.a), r)
  }
  ex.prototype.get_s = function() {
    return qp(this.a)
  }
  ex.prototype.set_s = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    uj(c, a)
  }
  ex.prototype.get_c = function() {
    return Qp(this.a)
  }
  ex.prototype.set_c = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Nm(c, a)
  }
  ex.prototype.__destroy__ = function() {
    uo(this.a)
  }
  function x() {
    throw "cannot construct a b2MotorJoint, no constructor in IDL"
  }
  x.prototype = Object.create(p.prototype)
  x.prototype.constructor = x
  x.prototype.b = x
  x.c = {}
  b.b2MotorJoint = x
  x.prototype.SetLinearOffset = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    kv(c, a)
  }
  x.prototype.GetLinearOffset = function() {
    return n(hp(this.a), r)
  }
  x.prototype.SetAngularOffset = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gp(c, a)
  }
  x.prototype.GetAngularOffset = function() {
    return Uu(this.a)
  }
  x.prototype.SetMaxForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fo(c, a)
  }
  x.prototype.GetMaxForce = function() {
    return bj(this.a)
  }
  x.prototype.SetMaxTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ld(c, a)
  }
  x.prototype.GetMaxTorque = function() {
    return xr(this.a)
  }
  x.prototype.SetCorrectionFactor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    sd(c, a)
  }
  x.prototype.GetCorrectionFactor = function() {
    return Mp(this.a)
  }
  x.prototype.GetType = function() {
    return wq(this.a)
  }
  x.prototype.GetBodyA = function() {
    return n(vh(this.a), q)
  }
  x.prototype.GetBodyB = function() {
    return n(th(this.a), q)
  }
  x.prototype.GetAnchorA = function() {
    return n(kp(this.a), r)
  }
  x.prototype.GetAnchorB = function() {
    return n(Ou(this.a), r)
  }
  x.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(cp(c, a), r)
  }
  x.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return bf(c, a)
  }
  x.prototype.GetNext = function() {
    return n(Jv(this.a), p)
  }
  x.prototype.GetUserData = function() {
    return Xj(this.a)
  }
  x.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rh(c, a)
  }
  x.prototype.IsActive = function() {
    return !!An(this.a)
  }
  x.prototype.GetCollideConnected = function() {
    return !!re(this.a)
  }
  x.prototype.__destroy__ = function() {
    mk(this.a)
  }
  function y() {
    throw "cannot construct a b2Profile, no constructor in IDL"
  }
  y.prototype = Object.create(g.prototype)
  y.prototype.constructor = y
  y.prototype.b = y
  y.c = {}
  b.b2Profile = y
  y.prototype.get_step = function() {
    return Qj(this.a)
  }
  y.prototype.set_step = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ui(c, a)
  }
  y.prototype.get_collide = function() {
    return Us(this.a)
  }
  y.prototype.set_collide = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    iv(c, a)
  }
  y.prototype.get_solve = function() {
    return Np(this.a)
  }
  y.prototype.set_solve = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ds(c, a)
  }
  y.prototype.get_solveInit = function() {
    return ev(this.a)
  }
  y.prototype.set_solveInit = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ak(c, a)
  }
  y.prototype.get_solveVelocity = function() {
    return zv(this.a)
  }
  y.prototype.set_solveVelocity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Jm(c, a)
  }
  y.prototype.get_solvePosition = function() {
    return Tc(this.a)
  }
  y.prototype.set_solvePosition = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kf(c, a)
  }
  y.prototype.get_broadphase = function() {
    return Ec(this.a)
  }
  y.prototype.set_broadphase = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ln(c, a)
  }
  y.prototype.get_solveTOI = function() {
    return vg(this.a)
  }
  y.prototype.set_solveTOI = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zh(c, a)
  }
  y.prototype.__destroy__ = function() {
    Jg(this.a)
  }
  function fx() {
    throw "cannot construct a VoidPtr, no constructor in IDL"
  }
  fx.prototype = Object.create(g.prototype)
  fx.prototype.constructor = fx
  fx.prototype.b = fx
  fx.c = {}
  b.VoidPtr = fx
  fx.prototype.__destroy__ = function() {
    Ro(this.a)
  }
  function z() {
    this.a = Wv()
    k(z)[this.a] = this
  }
  z.prototype = Object.create(g.prototype)
  z.prototype.constructor = z
  z.prototype.b = z
  z.c = {}
  b.b2BodyDef = z
  z.prototype.get_type = function() {
    return tm(this.a)
  }
  z.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    nc(c, a)
  }
  z.prototype.get_position = function() {
    return n(tc(this.a), r)
  }
  z.prototype.set_position = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ed(c, a)
  }
  z.prototype.get_angle = function() {
    return Bt(this.a)
  }
  z.prototype.set_angle = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yk(c, a)
  }
  z.prototype.get_linearVelocity = function() {
    return n(Ju(this.a), r)
  }
  z.prototype.set_linearVelocity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    kk(c, a)
  }
  z.prototype.get_angularVelocity = function() {
    return Xd(this.a)
  }
  z.prototype.set_angularVelocity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    fm(c, a)
  }
  z.prototype.get_linearDamping = function() {
    return Nj(this.a)
  }
  z.prototype.set_linearDamping = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jr(c, a)
  }
  z.prototype.get_angularDamping = function() {
    return zq(this.a)
  }
  z.prototype.set_angularDamping = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fp(c, a)
  }
  z.prototype.get_allowSleep = function() {
    return !!Fi(this.a)
  }
  z.prototype.set_allowSleep = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ri(c, a)
  }
  z.prototype.get_awake = function() {
    return !!lo(this.a)
  }
  z.prototype.set_awake = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ll(c, a)
  }
  z.prototype.get_fixedRotation = function() {
    return !!xn(this.a)
  }
  z.prototype.set_fixedRotation = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dk(c, a)
  }
  z.prototype.get_bullet = function() {
    return !!Se(this.a)
  }
  z.prototype.set_bullet = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Em(c, a)
  }
  z.prototype.get_active = function() {
    return !!Ti(this.a)
  }
  z.prototype.set_active = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dj(c, a)
  }
  z.prototype.get_userData = function() {
    return jv(this.a)
  }
  z.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qr(c, a)
  }
  z.prototype.get_gravityScale = function() {
    return ef(this.a)
  }
  z.prototype.set_gravityScale = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qd(c, a)
  }
  z.prototype.__destroy__ = function() {
    Vr(this.a)
  }
  function gx() {
    this.a = sf()
    k(gx)[this.a] = this
  }
  gx.prototype = Object.create(Tw.prototype)
  gx.prototype.constructor = gx
  gx.prototype.b = gx
  gx.c = {}
  b.JSRayCastCallback = gx
  gx.prototype.ReportFixture = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    return Be(h, a, c, d, e)
  }
  gx.prototype.__destroy__ = function() {
    Ao(this.a)
  }
  function hx() {
    throw "cannot construct a b2ContactFeature, no constructor in IDL"
  }
  hx.prototype = Object.create(g.prototype)
  hx.prototype.constructor = hx
  hx.prototype.b = hx
  hx.c = {}
  b.b2ContactFeature = hx
  hx.prototype.get_indexA = function() {
    return Bg(this.a)
  }
  hx.prototype.set_indexA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dv(c, a)
  }
  hx.prototype.get_indexB = function() {
    return ql(this.a)
  }
  hx.prototype.set_indexB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Hq(c, a)
  }
  hx.prototype.get_typeA = function() {
    return tl(this.a)
  }
  hx.prototype.set_typeA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zm(c, a)
  }
  hx.prototype.get_typeB = function() {
    return ap(this.a)
  }
  hx.prototype.set_typeB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    vr(c, a)
  }
  hx.prototype.__destroy__ = function() {
    xp(this.a)
  }
  function r(a, c) {
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    this.a =
      void 0 === a
        ? wg()
        : void 0 === c
        ? _emscripten_bind_b2Vec2_b2Vec2_1(a)
        : ek(a, c)
    k(r)[this.a] = this
  }
  r.prototype = Object.create(g.prototype)
  r.prototype.constructor = r
  r.prototype.b = r
  r.c = {}
  b.b2Vec2 = r
  r.prototype.SetZero = function() {
    Wq(this.a)
  }
  r.prototype.Set = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    np(d, a, c)
  }
  r.prototype.op_add = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ze(c, a)
  }
  r.prototype.op_sub = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zg(c, a)
  }
  r.prototype.op_mul = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    xi(c, a)
  }
  r.prototype.Length = function() {
    return Vq(this.a)
  }
  r.prototype.LengthSquared = function() {
    return gw(this.a)
  }
  r.prototype.Normalize = function() {
    return of(this.a)
  }
  r.prototype.IsValid = function() {
    return !!Ko(this.a)
  }
  r.prototype.Skew = function() {
    return n(sr(this.a), r)
  }
  r.prototype.get_x = function() {
    return ni(this.a)
  }
  r.prototype.set_x = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Cu(c, a)
  }
  r.prototype.get_y = function() {
    return ml(this.a)
  }
  r.prototype.set_y = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rs(c, a)
  }
  r.prototype.__destroy__ = function() {
    Fu(this.a)
  }
  function ax(a, c, d) {
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    this.a =
      void 0 === a
        ? Jk()
        : void 0 === c
        ? _emscripten_bind_b2Vec3_b2Vec3_1(a)
        : void 0 === d
        ? _emscripten_bind_b2Vec3_b2Vec3_2(a, c)
        : Tk(a, c, d)
    k(ax)[this.a] = this
  }
  ax.prototype = Object.create(g.prototype)
  ax.prototype.constructor = ax
  ax.prototype.b = ax
  ax.c = {}
  b.b2Vec3 = ax
  ax.prototype.SetZero = function() {
    ff(this.a)
  }
  ax.prototype.Set = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    fj(e, a, c, d)
  }
  ax.prototype.op_add = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Xf(c, a)
  }
  ax.prototype.op_sub = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    En(c, a)
  }
  ax.prototype.op_mul = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ru(c, a)
  }
  ax.prototype.get_x = function() {
    return Pc(this.a)
  }
  ax.prototype.set_x = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Il(c, a)
  }
  ax.prototype.get_y = function() {
    return Ht(this.a)
  }
  ax.prototype.set_y = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ep(c, a)
  }
  ax.prototype.get_z = function() {
    return km(this.a)
  }
  ax.prototype.set_z = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Al(c, a)
  }
  ax.prototype.__destroy__ = function() {
    Xg(this.a)
  }
  function cx() {
    this.a = mo()
    k(cx)[this.a] = this
  }
  cx.prototype = Object.create(g.prototype)
  cx.prototype.constructor = cx
  cx.prototype.b = cx
  cx.c = {}
  b.b2AABB = cx
  cx.prototype.IsValid = function() {
    return !!Hn(this.a)
  }
  cx.prototype.GetCenter = function() {
    return n(Bh(this.a), r)
  }
  cx.prototype.GetExtents = function() {
    return n(Vg(this.a), r)
  }
  cx.prototype.GetPerimeter = function() {
    return Fg(this.a)
  }
  cx.prototype.Combine = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    void 0 === c ? Gp(d, a) : Di(d, a, c)
  }
  cx.prototype.Contains = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return !!be(c, a)
  }
  cx.prototype.RayCast = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!Rj(d, a, c)
  }
  cx.prototype.get_lowerBound = function() {
    return n(Td(this.a), r)
  }
  cx.prototype.set_lowerBound = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Rp(c, a)
  }
  cx.prototype.get_upperBound = function() {
    return n(ke(this.a), r)
  }
  cx.prototype.set_upperBound = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ae(c, a)
  }
  cx.prototype.__destroy__ = function() {
    sn(this.a)
  }
  function ix() {
    this.a = yj()
    k(ix)[this.a] = this
  }
  ix.prototype = Object.create(g.prototype)
  ix.prototype.constructor = ix
  ix.prototype.b = ix
  ix.c = {}
  b.b2FixtureDef = ix
  ix.prototype.get_shape = function() {
    return n(Ct(this.a), Ww)
  }
  ix.prototype.set_shape = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Og(c, a)
  }
  ix.prototype.get_userData = function() {
    return Bd(this.a)
  }
  ix.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    fc(c, a)
  }
  ix.prototype.get_friction = function() {
    return at(this.a)
  }
  ix.prototype.set_friction = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Nl(c, a)
  }
  ix.prototype.get_restitution = function() {
    return wk(this.a)
  }
  ix.prototype.set_restitution = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    yc(c, a)
  }
  ix.prototype.get_density = function() {
    return td(this.a)
  }
  ix.prototype.set_density = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Es(c, a)
  }
  ix.prototype.get_isSensor = function() {
    return !!zf(this.a)
  }
  ix.prototype.set_isSensor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fj(c, a)
  }
  ix.prototype.get_filter = function() {
    return n(cc(this.a), bx)
  }
  ix.prototype.set_filter = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    lh(c, a)
  }
  ix.prototype.__destroy__ = function() {
    wv(this.a)
  }
  function A() {
    this.a = Gk()
    k(A)[this.a] = this
  }
  A.prototype = Object.create(t.prototype)
  A.prototype.constructor = A
  A.prototype.b = A
  A.c = {}
  b.b2FrictionJointDef = A
  A.prototype.Initialize = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Ar(e, a, c, d)
  }
  A.prototype.get_localAnchorA = function() {
    return n(Qe(this.a), r)
  }
  A.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qf(c, a)
  }
  A.prototype.get_localAnchorB = function() {
    return n(De(this.a), r)
  }
  A.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    hj(c, a)
  }
  A.prototype.get_maxForce = function() {
    return em(this.a)
  }
  A.prototype.set_maxForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rm(c, a)
  }
  A.prototype.get_maxTorque = function() {
    return $c(this.a)
  }
  A.prototype.set_maxTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Wr(c, a)
  }
  A.prototype.get_type = function() {
    return dc(this.a)
  }
  A.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zr(c, a)
  }
  A.prototype.get_userData = function() {
    return oh(this.a)
  }
  A.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Sb(c, a)
  }
  A.prototype.get_bodyA = function() {
    return n(Zt(this.a), q)
  }
  A.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    hw(c, a)
  }
  A.prototype.get_bodyB = function() {
    return n(cf(this.a), q)
  }
  A.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qq(c, a)
  }
  A.prototype.get_collideConnected = function() {
    return !!Br(this.a)
  }
  A.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dd(c, a)
  }
  A.prototype.__destroy__ = function() {
    Dh(this.a)
  }
  function jx() {
    this.a = fq()
    k(jx)[this.a] = this
  }
  jx.prototype = Object.create(g.prototype)
  jx.prototype.constructor = jx
  jx.prototype.b = jx
  jx.c = {}
  b.b2Manifold = jx
  jx.prototype.get_localNormal = function() {
    return n(Ik(this.a), r)
  }
  jx.prototype.set_localNormal = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    mr(c, a)
  }
  jx.prototype.get_localPoint = function() {
    return n(di(this.a), r)
  }
  jx.prototype.set_localPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Cm(c, a)
  }
  jx.prototype.get_type = function() {
    return fk(this.a)
  }
  jx.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Sk(c, a)
  }
  jx.prototype.get_pointCount = function() {
    return vf(this.a)
  }
  jx.prototype.set_pointCount = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Nk(c, a)
  }
  jx.prototype.__destroy__ = function() {
    kg(this.a)
  }
  function B() {
    this.a = Si()
    k(B)[this.a] = this
  }
  B.prototype = Object.create(t.prototype)
  B.prototype.constructor = B
  B.prototype.b = B
  B.c = {}
  b.b2PrismaticJointDef = B
  B.prototype.Initialize = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    Af(h, a, c, d, e)
  }
  B.prototype.get_localAnchorA = function() {
    return n(yi(this.a), r)
  }
  B.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    bt(c, a)
  }
  B.prototype.get_localAnchorB = function() {
    return n(we(this.a), r)
  }
  B.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Co(c, a)
  }
  B.prototype.get_localAxisA = function() {
    return n(qu(this.a), r)
  }
  B.prototype.set_localAxisA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    xu(c, a)
  }
  B.prototype.get_referenceAngle = function() {
    return Vd(this.a)
  }
  B.prototype.set_referenceAngle = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jh(c, a)
  }
  B.prototype.get_enableLimit = function() {
    return !!Ks(this.a)
  }
  B.prototype.set_enableLimit = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Bl(c, a)
  }
  B.prototype.get_lowerTranslation = function() {
    return Ed(this.a)
  }
  B.prototype.set_lowerTranslation = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    cd(c, a)
  }
  B.prototype.get_upperTranslation = function() {
    return vd(this.a)
  }
  B.prototype.set_upperTranslation = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    il(c, a)
  }
  B.prototype.get_enableMotor = function() {
    return !!ks(this.a)
  }
  B.prototype.set_enableMotor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rr(c, a)
  }
  B.prototype.get_maxMotorForce = function() {
    return ow(this.a)
  }
  B.prototype.set_maxMotorForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Zu(c, a)
  }
  B.prototype.get_motorSpeed = function() {
    return Pb(this.a)
  }
  B.prototype.set_motorSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    yn(c, a)
  }
  B.prototype.get_type = function() {
    return uw(this.a)
  }
  B.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ah(c, a)
  }
  B.prototype.get_userData = function() {
    return aj(this.a)
  }
  B.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    yr(c, a)
  }
  B.prototype.get_bodyA = function() {
    return n(Nr(this.a), q)
  }
  B.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Lo(c, a)
  }
  B.prototype.get_bodyB = function() {
    return n(Ck(this.a), q)
  }
  B.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fk(c, a)
  }
  B.prototype.get_collideConnected = function() {
    return !!Dl(this.a)
  }
  B.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    $m(c, a)
  }
  B.prototype.__destroy__ = function() {
    Zd(this.a)
  }
  function C(a) {
    a && "object" === typeof a && (a = a.a)
    this.a = Ph(a)
    k(C)[this.a] = this
  }
  C.prototype = Object.create(g.prototype)
  C.prototype.constructor = C
  C.prototype.b = C
  C.c = {}
  b.b2World = C
  C.prototype.SetDestructionListener = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ov(c, a)
  }
  C.prototype.SetContactFilter = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    vc(c, a)
  }
  C.prototype.SetContactListener = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    od(c, a)
  }
  C.prototype.SetDebugDraw = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    lf(c, a)
  }
  C.prototype.CreateBody = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(po(c, a), q)
  }
  C.prototype.DestroyBody = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Sc(c, a)
  }
  C.prototype.CreateJoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(ng(c, a), p)
  }
  C.prototype.DestroyJoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yq(c, a)
  }
  C.prototype.Step = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Oj(e, a, c, d)
  }
  C.prototype.ClearForces = function() {
    Wg(this.a)
  }
  C.prototype.DrawDebugData = function() {
    Hm(this.a)
  }
  C.prototype.QueryAABB = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    hv(d, a, c)
  }
  C.prototype.RayCast = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Rs(e, a, c, d)
  }
  C.prototype.GetBodyList = function() {
    return n(Ns(this.a), q)
  }
  C.prototype.GetJointList = function() {
    return n(gr(this.a), p)
  }
  C.prototype.GetContactList = function() {
    return n(Wt(this.a), D)
  }
  C.prototype.SetAllowSleeping = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ep(c, a)
  }
  C.prototype.GetAllowSleeping = function() {
    return !!Wh(this.a)
  }
  C.prototype.SetWarmStarting = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jc(c, a)
  }
  C.prototype.GetWarmStarting = function() {
    return !!Mo(this.a)
  }
  C.prototype.SetContinuousPhysics = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    nm(c, a)
  }
  C.prototype.GetContinuousPhysics = function() {
    return !!Bv(this.a)
  }
  C.prototype.SetSubStepping = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ye(c, a)
  }
  C.prototype.GetSubStepping = function() {
    return !!Mq(this.a)
  }
  C.prototype.GetProxyCount = function() {
    return kd(this.a)
  }
  C.prototype.GetBodyCount = function() {
    return Ql(this.a)
  }
  C.prototype.GetJointCount = function() {
    return on(this.a)
  }
  C.prototype.GetContactCount = function() {
    return xq(this.a)
  }
  C.prototype.GetTreeHeight = function() {
    return Jr(this.a)
  }
  C.prototype.GetTreeBalance = function() {
    return Zb(this.a)
  }
  C.prototype.GetTreeQuality = function() {
    return Pd(this.a)
  }
  C.prototype.SetGravity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qt(c, a)
  }
  C.prototype.GetGravity = function() {
    return n(Cc(this.a), r)
  }
  C.prototype.IsLocked = function() {
    return !!Ub(this.a)
  }
  C.prototype.SetAutoClearForces = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    bd(c, a)
  }
  C.prototype.GetAutoClearForces = function() {
    return !!bk(this.a)
  }
  C.prototype.GetProfile = function() {
    return n(Qt(this.a), y)
  }
  C.prototype.Dump = function() {
    As(this.a)
  }
  C.prototype.__destroy__ = function() {
    Nn(this.a)
  }
  function E() {
    throw "cannot construct a b2PrismaticJoint, no constructor in IDL"
  }
  E.prototype = Object.create(p.prototype)
  E.prototype.constructor = E
  E.prototype.b = E
  E.c = {}
  b.b2PrismaticJoint = E
  E.prototype.GetLocalAnchorA = function() {
    return n(vl(this.a), r)
  }
  E.prototype.GetLocalAnchorB = function() {
    return n(Yo(this.a), r)
  }
  E.prototype.GetLocalAxisA = function() {
    return n(sh(this.a), r)
  }
  E.prototype.GetReferenceAngle = function() {
    return Wk(this.a)
  }
  E.prototype.GetJointTranslation = function() {
    return Sf(this.a)
  }
  E.prototype.GetJointSpeed = function() {
    return Rm(this.a)
  }
  E.prototype.IsLimitEnabled = function() {
    return !!Qh(this.a)
  }
  E.prototype.EnableLimit = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dm(c, a)
  }
  E.prototype.GetLowerLimit = function() {
    return Sd(this.a)
  }
  E.prototype.GetUpperLimit = function() {
    return Vj(this.a)
  }
  E.prototype.SetLimits = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Gc(d, a, c)
  }
  E.prototype.IsMotorEnabled = function() {
    return !!Ok(this.a)
  }
  E.prototype.EnableMotor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    hl(c, a)
  }
  E.prototype.SetMotorSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ss(c, a)
  }
  E.prototype.GetMotorSpeed = function() {
    return Vf(this.a)
  }
  E.prototype.SetMaxMotorForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Aw(c, a)
  }
  E.prototype.GetMaxMotorForce = function() {
    return Jp(this.a)
  }
  E.prototype.GetMotorForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return ii(c, a)
  }
  E.prototype.GetType = function() {
    return ge(this.a)
  }
  E.prototype.GetBodyA = function() {
    return n(Ip(this.a), q)
  }
  E.prototype.GetBodyB = function() {
    return n(yt(this.a), q)
  }
  E.prototype.GetAnchorA = function() {
    return n(Mk(this.a), r)
  }
  E.prototype.GetAnchorB = function() {
    return n(Ul(this.a), r)
  }
  E.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Eh(c, a), r)
  }
  E.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return qg(c, a)
  }
  E.prototype.GetNext = function() {
    return n(Lr(this.a), p)
  }
  E.prototype.GetUserData = function() {
    return Nv(this.a)
  }
  E.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zj(c, a)
  }
  E.prototype.IsActive = function() {
    return !!jm(this.a)
  }
  E.prototype.GetCollideConnected = function() {
    return !!sg(this.a)
  }
  E.prototype.__destroy__ = function() {
    Pf(this.a)
  }
  function kx() {
    throw "cannot construct a b2RayCastOutput, no constructor in IDL"
  }
  kx.prototype = Object.create(g.prototype)
  kx.prototype.constructor = kx
  kx.prototype.b = kx
  kx.c = {}
  b.b2RayCastOutput = kx
  kx.prototype.get_normal = function() {
    return n(wf(this.a), r)
  }
  kx.prototype.set_normal = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    bh(c, a)
  }
  kx.prototype.get_fraction = function() {
    return rn(this.a)
  }
  kx.prototype.set_fraction = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kd(c, a)
  }
  kx.prototype.__destroy__ = function() {
    Fm(this.a)
  }
  function lx() {
    throw "cannot construct a b2ContactID, no constructor in IDL"
  }
  lx.prototype = Object.create(g.prototype)
  lx.prototype.constructor = lx
  lx.prototype.b = lx
  lx.c = {}
  b.b2ContactID = lx
  lx.prototype.get_cf = function() {
    return n(ts(this.a), hx)
  }
  lx.prototype.set_cf = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dj(c, a)
  }
  lx.prototype.get_key = function() {
    return bp(this.a)
  }
  lx.prototype.set_key = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    mf(c, a)
  }
  lx.prototype.__destroy__ = function() {
    Ol(this.a)
  }
  function mx() {
    this.a = Cw()
    k(mx)[this.a] = this
  }
  mx.prototype = Object.create(Uw.prototype)
  mx.prototype.constructor = mx
  mx.prototype.b = mx
  mx.c = {}
  b.JSContactListener = mx
  mx.prototype.BeginContact = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    eo(c, a)
  }
  mx.prototype.EndContact = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Nc(c, a)
  }
  mx.prototype.PreSolve = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    $g(d, a, c)
  }
  mx.prototype.PostSolve = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    gq(d, a, c)
  }
  mx.prototype.__destroy__ = function() {
    Gm(this.a)
  }
  function nx(a, c, d, e) {
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    this.a =
      void 0 === a
        ? Mr()
        : void 0 === c
        ? _emscripten_bind_b2Mat22_b2Mat22_1(a)
        : void 0 === d
        ? Kr(a, c)
        : void 0 === e
        ? _emscripten_bind_b2Mat22_b2Mat22_3(a, c, d)
        : wu(a, c, d, e)
    k(nx)[this.a] = this
  }
  nx.prototype = Object.create(g.prototype)
  nx.prototype.constructor = nx
  nx.prototype.b = nx
  nx.c = {}
  b.b2Mat22 = nx
  nx.prototype.Set = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    $q(d, a, c)
  }
  nx.prototype.SetIdentity = function() {
    su(this.a)
  }
  nx.prototype.SetZero = function() {
    Sj(this.a)
  }
  nx.prototype.GetInverse = function() {
    return n(Kq(this.a), nx)
  }
  nx.prototype.Solve = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Po(c, a), r)
  }
  nx.prototype.get_ex = function() {
    return n(wo(this.a), r)
  }
  nx.prototype.set_ex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Rq(c, a)
  }
  nx.prototype.get_ey = function() {
    return n(ru(this.a), r)
  }
  nx.prototype.set_ey = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qr(c, a)
  }
  nx.prototype.__destroy__ = function() {
    Lu(this.a)
  }
  function F() {
    this.a = pu()
    k(F)[this.a] = this
  }
  F.prototype = Object.create(t.prototype)
  F.prototype.constructor = F
  F.prototype.b = F
  F.c = {}
  b.b2WheelJointDef = F
  F.prototype.Initialize = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    Xi(h, a, c, d, e)
  }
  F.prototype.get_localAnchorA = function() {
    return n($k(this.a), r)
  }
  F.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ie(c, a)
  }
  F.prototype.get_localAnchorB = function() {
    return n(mn(this.a), r)
  }
  F.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    mw(c, a)
  }
  F.prototype.get_localAxisA = function() {
    return n(Oq(this.a), r)
  }
  F.prototype.set_localAxisA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    aw(c, a)
  }
  F.prototype.get_enableMotor = function() {
    return !!fw(this.a)
  }
  F.prototype.set_enableMotor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    yk(c, a)
  }
  F.prototype.get_maxMotorTorque = function() {
    return yg(this.a)
  }
  F.prototype.set_maxMotorTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jk(c, a)
  }
  F.prototype.get_motorSpeed = function() {
    return Fr(this.a)
  }
  F.prototype.set_motorSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jp(c, a)
  }
  F.prototype.get_frequencyHz = function() {
    return Xs(this.a)
  }
  F.prototype.set_frequencyHz = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Lq(c, a)
  }
  F.prototype.get_dampingRatio = function() {
    return qn(this.a)
  }
  F.prototype.set_dampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Hv(c, a)
  }
  F.prototype.get_type = function() {
    return $t(this.a)
  }
  F.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Od(c, a)
  }
  F.prototype.get_userData = function() {
    return mv(this.a)
  }
  F.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yg(c, a)
  }
  F.prototype.get_bodyA = function() {
    return n(ww(this.a), q)
  }
  F.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zt(c, a)
  }
  F.prototype.get_bodyB = function() {
    return n(gn(this.a), q)
  }
  F.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Hp(c, a)
  }
  F.prototype.get_collideConnected = function() {
    return !!wc(this.a)
  }
  F.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    fr(c, a)
  }
  F.prototype.__destroy__ = function() {
    df(this.a)
  }
  function ox() {
    this.a = Rg()
    k(ox)[this.a] = this
  }
  ox.prototype = Object.create(Ww.prototype)
  ox.prototype.constructor = ox
  ox.prototype.b = ox
  ox.c = {}
  b.b2CircleShape = ox
  ox.prototype.GetType = function() {
    return hh(this.a)
  }
  ox.prototype.GetChildCount = function() {
    return Re(this.a)
  }
  ox.prototype.TestPoint = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!nq(d, a, c)
  }
  ox.prototype.RayCast = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    return !!Pj(h, a, c, d, e)
  }
  ox.prototype.ComputeAABB = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Is(e, a, c, d)
  }
  ox.prototype.ComputeMass = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    jq(d, a, c)
  }
  ox.prototype.get_m_p = function() {
    return n(Ag(this.a), r)
  }
  ox.prototype.set_m_p = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Vi(c, a)
  }
  ox.prototype.get_m_type = function() {
    return Sr(this.a)
  }
  ox.prototype.set_m_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    xe(c, a)
  }
  ox.prototype.get_m_radius = function() {
    return Uf(this.a)
  }
  ox.prototype.set_m_radius = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ne(c, a)
  }
  ox.prototype.__destroy__ = function() {
    vq(this.a)
  }
  function G() {
    this.a = Tv()
    k(G)[this.a] = this
  }
  G.prototype = Object.create(t.prototype)
  G.prototype.constructor = G
  G.prototype.b = G
  G.c = {}
  b.b2WeldJointDef = G
  G.prototype.Initialize = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Ys(e, a, c, d)
  }
  G.prototype.get_localAnchorA = function() {
    return n(et(this.a), r)
  }
  G.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ti(c, a)
  }
  G.prototype.get_localAnchorB = function() {
    return n(ku(this.a), r)
  }
  G.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    xs(c, a)
  }
  G.prototype.get_referenceAngle = function() {
    return Uq(this.a)
  }
  G.prototype.set_referenceAngle = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    lu(c, a)
  }
  G.prototype.get_frequencyHz = function() {
    return ig(this.a)
  }
  G.prototype.set_frequencyHz = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    pr(c, a)
  }
  G.prototype.get_dampingRatio = function() {
    return Yp(this.a)
  }
  G.prototype.set_dampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yi(c, a)
  }
  G.prototype.get_type = function() {
    return op(this.a)
  }
  G.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    as(c, a)
  }
  G.prototype.get_userData = function() {
    return Et(this.a)
  }
  G.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Xo(c, a)
  }
  G.prototype.get_bodyA = function() {
    return n(Nu(this.a), q)
  }
  G.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ke(c, a)
  }
  G.prototype.get_bodyB = function() {
    return n(Av(this.a), q)
  }
  G.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qv(c, a)
  }
  G.prototype.get_collideConnected = function() {
    return !!oi(this.a)
  }
  G.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yc(c, a)
  }
  G.prototype.__destroy__ = function() {
    Oo(this.a)
  }
  function px() {
    this.a = Dp()
    k(px)[this.a] = this
  }
  px.prototype = Object.create(g.prototype)
  px.prototype.constructor = px
  px.prototype.b = px
  px.c = {}
  b.b2MassData = px
  px.prototype.get_mass = function() {
    return Xv(this.a)
  }
  px.prototype.set_mass = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Oc(c, a)
  }
  px.prototype.get_center = function() {
    return n(Ve(this.a), r)
  }
  px.prototype.set_center = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Bq(c, a)
  }
  px.prototype.get_I = function() {
    return Er(this.a)
  }
  px.prototype.set_I = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ss(c, a)
  }
  px.prototype.__destroy__ = function() {
    Ts(this.a)
  }
  function qx() {
    throw "cannot construct a b2GearJoint, no constructor in IDL"
  }
  qx.prototype = Object.create(p.prototype)
  qx.prototype.constructor = qx
  qx.prototype.b = qx
  qx.c = {}
  b.b2GearJoint = qx
  qx.prototype.GetJoint1 = function() {
    return n(jd(this.a), p)
  }
  qx.prototype.GetJoint2 = function() {
    return n(Dk(this.a), p)
  }
  qx.prototype.SetRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    tn(c, a)
  }
  qx.prototype.GetRatio = function() {
    return ud(this.a)
  }
  qx.prototype.GetType = function() {
    return Iv(this.a)
  }
  qx.prototype.GetBodyA = function() {
    return n(bm(this.a), q)
  }
  qx.prototype.GetBodyB = function() {
    return n(tq(this.a), q)
  }
  qx.prototype.GetAnchorA = function() {
    return n(md(this.a), r)
  }
  qx.prototype.GetAnchorB = function() {
    return n(fu(this.a), r)
  }
  qx.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Oi(c, a), r)
  }
  qx.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Xc(c, a)
  }
  qx.prototype.GetNext = function() {
    return n(Wu(this.a), p)
  }
  qx.prototype.GetUserData = function() {
    return qe(this.a)
  }
  qx.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zl(c, a)
  }
  qx.prototype.IsActive = function() {
    return !!ki(this.a)
  }
  qx.prototype.GetCollideConnected = function() {
    return !!Fd(this.a)
  }
  qx.prototype.__destroy__ = function() {
    Rf(this.a)
  }
  function H() {
    throw "cannot construct a b2WeldJoint, no constructor in IDL"
  }
  H.prototype = Object.create(p.prototype)
  H.prototype.constructor = H
  H.prototype.b = H
  H.c = {}
  b.b2WeldJoint = H
  H.prototype.GetLocalAnchorA = function() {
    return n(Eu(this.a), r)
  }
  H.prototype.GetLocalAnchorB = function() {
    return n(hn(this.a), r)
  }
  H.prototype.SetFrequency = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Zg(c, a)
  }
  H.prototype.GetFrequency = function() {
    return Pk(this.a)
  }
  H.prototype.SetDampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yd(c, a)
  }
  H.prototype.GetDampingRatio = function() {
    return Fs(this.a)
  }
  H.prototype.Dump = function() {
    Eo(this.a)
  }
  H.prototype.GetType = function() {
    return so(this.a)
  }
  H.prototype.GetBodyA = function() {
    return n(xf(this.a), q)
  }
  H.prototype.GetBodyB = function() {
    return n(We(this.a), q)
  }
  H.prototype.GetAnchorA = function() {
    return n(dq(this.a), r)
  }
  H.prototype.GetAnchorB = function() {
    return n(br(this.a), r)
  }
  H.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(ps(c, a), r)
  }
  H.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return qc(c, a)
  }
  H.prototype.GetNext = function() {
    return n(ro(this.a), p)
  }
  H.prototype.GetUserData = function() {
    return Zk(this.a)
  }
  H.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    fi(c, a)
  }
  H.prototype.IsActive = function() {
    return !!lc(this.a)
  }
  H.prototype.GetCollideConnected = function() {
    return !!Jq(this.a)
  }
  H.prototype.__destroy__ = function() {
    eq(this.a)
  }
  function rx() {
    this.a = Yt()
    k(rx)[this.a] = this
  }
  rx.prototype = Object.create(g.prototype)
  rx.prototype.constructor = rx
  rx.prototype.b = rx
  rx.c = {}
  b.b2JointEdge = rx
  rx.prototype.get_other = function() {
    return n(Li(this.a), q)
  }
  rx.prototype.set_other = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qd(c, a)
  }
  rx.prototype.get_joint = function() {
    return n(uv(this.a), p)
  }
  rx.prototype.set_joint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    hc(c, a)
  }
  rx.prototype.get_prev = function() {
    return n(Rl(this.a), rx)
  }
  rx.prototype.set_prev = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    pg(c, a)
  }
  rx.prototype.get_next = function() {
    return n(io(this.a), rx)
  }
  rx.prototype.set_next = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ar(c, a)
  }
  rx.prototype.__destroy__ = function() {
    bo(this.a)
  }
  function I() {
    this.a = Bp()
    k(I)[this.a] = this
  }
  I.prototype = Object.create(t.prototype)
  I.prototype.constructor = I
  I.prototype.b = I
  I.c = {}
  b.b2PulleyJointDef = I
  I.prototype.Initialize = function(a, c, d, e, h, l, m) {
    var K = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    h && "object" === typeof h && (h = h.a)
    l && "object" === typeof l && (l = l.a)
    m && "object" === typeof m && (m = m.a)
    Ev(K, a, c, d, e, h, l, m)
  }
  I.prototype.get_groundAnchorA = function() {
    return n(Tm(this.a), r)
  }
  I.prototype.set_groundAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    yw(c, a)
  }
  I.prototype.get_groundAnchorB = function() {
    return n(kj(this.a), r)
  }
  I.prototype.set_groundAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Xr(c, a)
  }
  I.prototype.get_localAnchorA = function() {
    return n(Hc(this.a), r)
  }
  I.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    mq(c, a)
  }
  I.prototype.get_localAnchorB = function() {
    return n(wt(this.a), r)
  }
  I.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zd(c, a)
  }
  I.prototype.get_lengthA = function() {
    return Hl(this.a)
  }
  I.prototype.set_lengthA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    lg(c, a)
  }
  I.prototype.get_lengthB = function() {
    return ei(this.a)
  }
  I.prototype.set_lengthB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ee(c, a)
  }
  I.prototype.get_ratio = function() {
    return ve(this.a)
  }
  I.prototype.set_ratio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    og(c, a)
  }
  I.prototype.get_type = function() {
    return Jl(this.a)
  }
  I.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    al(c, a)
  }
  I.prototype.get_userData = function() {
    return Ek(this.a)
  }
  I.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qm(c, a)
  }
  I.prototype.get_bodyA = function() {
    return n(Fc(this.a), q)
  }
  I.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rw(c, a)
  }
  I.prototype.get_bodyB = function() {
    return n(Pg(this.a), q)
  }
  I.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Bf(c, a)
  }
  I.prototype.get_collideConnected = function() {
    return !!Bw(this.a)
  }
  I.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    bu(c, a)
  }
  I.prototype.__destroy__ = function() {
    Ii(this.a)
  }
  function sx() {
    this.a = Xh()
    k(sx)[this.a] = this
  }
  sx.prototype = Object.create(g.prototype)
  sx.prototype.constructor = sx
  sx.prototype.b = sx
  sx.c = {}
  b.b2ManifoldPoint = sx
  sx.prototype.get_localPoint = function() {
    return n(tv(this.a), r)
  }
  sx.prototype.set_localPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ls(c, a)
  }
  sx.prototype.get_normalImpulse = function() {
    return Hj(this.a)
  }
  sx.prototype.set_normalImpulse = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Hh(c, a)
  }
  sx.prototype.get_tangentImpulse = function() {
    return Wp(this.a)
  }
  sx.prototype.set_tangentImpulse = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ei(c, a)
  }
  sx.prototype.get_id = function() {
    return n(Tf(this.a), lx)
  }
  sx.prototype.set_id = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    fn(c, a)
  }
  sx.prototype.__destroy__ = function() {
    Sq(this.a)
  }
  function tx(a, c) {
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    this.a =
      void 0 === a
        ? Fh()
        : void 0 === c
        ? _emscripten_bind_b2Transform_b2Transform_1(a)
        : ns(a, c)
    k(tx)[this.a] = this
  }
  tx.prototype = Object.create(g.prototype)
  tx.prototype.constructor = tx
  tx.prototype.b = tx
  tx.c = {}
  b.b2Transform = tx
  tx.prototype.SetIdentity = function() {
    Cq(this.a)
  }
  tx.prototype.Set = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    uh(d, a, c)
  }
  tx.prototype.get_p = function() {
    return n(Ot(this.a), r)
  }
  tx.prototype.set_p = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rv(c, a)
  }
  tx.prototype.get_q = function() {
    return n(fd(this.a), ex)
  }
  tx.prototype.set_q = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ie(c, a)
  }
  tx.prototype.__destroy__ = function() {
    le(this.a)
  }
  function J() {
    this.a = Zi()
    k(J)[this.a] = this
  }
  J.prototype = Object.create(Ww.prototype)
  J.prototype.constructor = J
  J.prototype.b = J
  J.c = {}
  b.b2ChainShape = J
  J.prototype.Clear = function() {
    uq(this.a)
  }
  J.prototype.CreateLoop = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    gi(d, a, c)
  }
  J.prototype.CreateChain = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Qc(d, a, c)
  }
  J.prototype.SetPrevVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zn(c, a)
  }
  J.prototype.SetNextVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qn(c, a)
  }
  J.prototype.GetChildEdge = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    ht(d, a, c)
  }
  J.prototype.GetType = function() {
    return $l(this.a)
  }
  J.prototype.GetChildCount = function() {
    return Qg(this.a)
  }
  J.prototype.TestPoint = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!Vk(d, a, c)
  }
  J.prototype.RayCast = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    return !!qs(h, a, c, d, e)
  }
  J.prototype.ComputeAABB = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    oc(e, a, c, d)
  }
  J.prototype.ComputeMass = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Sv(d, a, c)
  }
  J.prototype.get_m_vertices = function() {
    return n($b(this.a), r)
  }
  J.prototype.set_m_vertices = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rf(c, a)
  }
  J.prototype.get_m_count = function() {
    return Ob(this.a)
  }
  J.prototype.set_m_count = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    mt(c, a)
  }
  J.prototype.get_m_prevVertex = function() {
    return n(Ug(this.a), r)
  }
  J.prototype.set_m_prevVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    On(c, a)
  }
  J.prototype.get_m_nextVertex = function() {
    return n(hf(this.a), r)
  }
  J.prototype.set_m_nextVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Mc(c, a)
  }
  J.prototype.get_m_hasPrevVertex = function() {
    return !!Ap(this.a)
  }
  J.prototype.set_m_hasPrevVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Nf(c, a)
  }
  J.prototype.get_m_hasNextVertex = function() {
    return !!Pn(this.a)
  }
  J.prototype.set_m_hasNextVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Pr(c, a)
  }
  J.prototype.get_m_type = function() {
    return jj(this.a)
  }
  J.prototype.set_m_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    cg(c, a)
  }
  J.prototype.get_m_radius = function() {
    return vs(this.a)
  }
  J.prototype.set_m_radius = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ys(c, a)
  }
  J.prototype.__destroy__ = function() {
    yl(this.a)
  }
  function ux(a, c, d) {
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    this.a =
      void 0 === a
        ? Ws()
        : void 0 === c
        ? _emscripten_bind_b2Color_b2Color_1(a)
        : void 0 === d
        ? _emscripten_bind_b2Color_b2Color_2(a, c)
        : Vs(a, c, d)
    k(ux)[this.a] = this
  }
  ux.prototype = Object.create(g.prototype)
  ux.prototype.constructor = ux
  ux.prototype.b = ux
  ux.c = {}
  b.b2Color = ux
  ux.prototype.Set = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    vw(e, a, c, d)
  }
  ux.prototype.get_r = function() {
    return cw(this.a)
  }
  ux.prototype.set_r = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ld(c, a)
  }
  ux.prototype.get_g = function() {
    return Qo(this.a)
  }
  ux.prototype.set_g = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Xb(c, a)
  }
  ux.prototype.get_b = function() {
    return Gs(this.a)
  }
  ux.prototype.set_b = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Te(c, a)
  }
  ux.prototype.__destroy__ = function() {
    yp(this.a)
  }
  function L() {
    throw "cannot construct a b2RopeJoint, no constructor in IDL"
  }
  L.prototype = Object.create(p.prototype)
  L.prototype.constructor = L
  L.prototype.b = L
  L.c = {}
  b.b2RopeJoint = L
  L.prototype.GetLocalAnchorA = function() {
    return n(ir(this.a), r)
  }
  L.prototype.GetLocalAnchorB = function() {
    return n(Hi(this.a), r)
  }
  L.prototype.SetMaxLength = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Gw(c, a)
  }
  L.prototype.GetMaxLength = function() {
    return pe(this.a)
  }
  L.prototype.GetLimitState = function() {
    return ug(this.a)
  }
  L.prototype.GetType = function() {
    return fp(this.a)
  }
  L.prototype.GetBodyA = function() {
    return n(cv(this.a), q)
  }
  L.prototype.GetBodyB = function() {
    return n(Pq(this.a), q)
  }
  L.prototype.GetAnchorA = function() {
    return n(Bi(this.a), r)
  }
  L.prototype.GetAnchorB = function() {
    return n(ze(this.a), r)
  }
  L.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Js(c, a), r)
  }
  L.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Gv(c, a)
  }
  L.prototype.GetNext = function() {
    return n(So(this.a), p)
  }
  L.prototype.GetUserData = function() {
    return Rc(this.a)
  }
  L.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    hs(c, a)
  }
  L.prototype.IsActive = function() {
    return !!gu(this.a)
  }
  L.prototype.GetCollideConnected = function() {
    return !!cu(this.a)
  }
  L.prototype.__destroy__ = function() {
    Xq(this.a)
  }
  function vx() {
    throw "cannot construct a b2RayCastInput, no constructor in IDL"
  }
  vx.prototype = Object.create(g.prototype)
  vx.prototype.constructor = vx
  vx.prototype.b = vx
  vx.c = {}
  b.b2RayCastInput = vx
  vx.prototype.get_p1 = function() {
    return n(up(this.a), r)
  }
  vx.prototype.set_p1 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Lj(c, a)
  }
  vx.prototype.get_p2 = function() {
    return n(Xk(this.a), r)
  }
  vx.prototype.set_p2 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    tf(c, a)
  }
  vx.prototype.get_maxFraction = function() {
    return am(this.a)
  }
  vx.prototype.set_maxFraction = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jo(c, a)
  }
  vx.prototype.__destroy__ = function() {
    Fe(this.a)
  }
  function M() {
    this.a = Mi()
    k(M)[this.a] = this
  }
  M.prototype = Object.create(Ww.prototype)
  M.prototype.constructor = M
  M.prototype.b = M
  M.c = {}
  b.b2PolygonShape = M
  M.prototype.Set = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Ni(d, a, c)
  }
  M.prototype.SetAsBox = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    void 0 === d
      ? tw(h, a, c)
      : void 0 === e
      ? _emscripten_bind_b2PolygonShape_SetAsBox_3(h, a, c, d)
      : yu(h, a, c, d, e)
  }
  M.prototype.GetVertexCount = function() {
    return Pp(this.a)
  }
  M.prototype.GetVertex = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(pt(c, a), r)
  }
  M.prototype.GetType = function() {
    return ih(this.a)
  }
  M.prototype.GetChildCount = function() {
    return Uo(this.a)
  }
  M.prototype.TestPoint = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!Ki(d, a, c)
  }
  M.prototype.RayCast = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    return !!Yb(h, a, c, d, e)
  }
  M.prototype.ComputeAABB = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    sl(e, a, c, d)
  }
  M.prototype.ComputeMass = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    gl(d, a, c)
  }
  M.prototype.get_m_centroid = function() {
    return n(xl(this.a), r)
  }
  M.prototype.set_m_centroid = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    er(c, a)
  }
  M.prototype.get_m_count = function() {
    return Ai(this.a)
  }
  M.prototype.set_m_count = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gd(c, a)
  }
  M.prototype.get_m_type = function() {
    return zw(this.a)
  }
  M.prototype.set_m_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Su(c, a)
  }
  M.prototype.get_m_radius = function() {
    return sj(this.a)
  }
  M.prototype.set_m_radius = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ew(c, a)
  }
  M.prototype.__destroy__ = function() {
    je(this.a)
  }
  function N() {
    this.a = $p()
    k(N)[this.a] = this
  }
  N.prototype = Object.create(Ww.prototype)
  N.prototype.constructor = N
  N.prototype.b = N
  N.c = {}
  b.b2EdgeShape = N
  N.prototype.Set = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Ej(d, a, c)
  }
  N.prototype.GetType = function() {
    return Qq(this.a)
  }
  N.prototype.GetChildCount = function() {
    return xh(this.a)
  }
  N.prototype.TestPoint = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!wl(d, a, c)
  }
  N.prototype.RayCast = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    return !!qi(h, a, c, d, e)
  }
  N.prototype.ComputeAABB = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    dr(e, a, c, d)
  }
  N.prototype.ComputeMass = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    cn(d, a, c)
  }
  N.prototype.get_m_vertex1 = function() {
    return n(kl(this.a), r)
  }
  N.prototype.set_m_vertex1 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zu(c, a)
  }
  N.prototype.get_m_vertex2 = function() {
    return n(ho(this.a), r)
  }
  N.prototype.set_m_vertex2 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Eq(c, a)
  }
  N.prototype.get_m_vertex0 = function() {
    return n(li(this.a), r)
  }
  N.prototype.set_m_vertex0 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kv(c, a)
  }
  N.prototype.get_m_vertex3 = function() {
    return n(Aq(this.a), r)
  }
  N.prototype.set_m_vertex3 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    eu(c, a)
  }
  N.prototype.get_m_hasVertex0 = function() {
    return !!Pl(this.a)
  }
  N.prototype.set_m_hasVertex0 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    oe(c, a)
  }
  N.prototype.get_m_hasVertex3 = function() {
    return !!Aj(this.a)
  }
  N.prototype.set_m_hasVertex3 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gc(c, a)
  }
  N.prototype.get_m_type = function() {
    return To(this.a)
  }
  N.prototype.set_m_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Yh(c, a)
  }
  N.prototype.get_m_radius = function() {
    return Ir(this.a)
  }
  N.prototype.set_m_radius = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    de(c, a)
  }
  N.prototype.__destroy__ = function() {
    zi(this.a)
  }
  function wx() {
    this.a = Cs()
    k(wx)[this.a] = this
  }
  wx.prototype = Object.create(Xw.prototype)
  wx.prototype.constructor = wx
  wx.prototype.b = wx
  wx.c = {}
  b.JSContactFilter = wx
  wx.prototype.ShouldCollide = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return !!Ij(d, a, c)
  }
  wx.prototype.__destroy__ = function() {
    qj(this.a)
  }
  function Q() {
    this.a = ym()
    k(Q)[this.a] = this
  }
  Q.prototype = Object.create(t.prototype)
  Q.prototype.constructor = Q
  Q.prototype.b = Q
  Q.c = {}
  b.b2RevoluteJointDef = Q
  Q.prototype.Initialize = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Ad(e, a, c, d)
  }
  Q.prototype.get_localAnchorA = function() {
    return n(bn(this.a), r)
  }
  Q.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gj(c, a)
  }
  Q.prototype.get_localAnchorB = function() {
    return n(oj(this.a), r)
  }
  Q.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jn(c, a)
  }
  Q.prototype.get_referenceAngle = function() {
    return pj(this.a)
  }
  Q.prototype.set_referenceAngle = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    wp(c, a)
  }
  Q.prototype.get_enableLimit = function() {
    return !!Bm(this.a)
  }
  Q.prototype.set_enableLimit = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    No(c, a)
  }
  Q.prototype.get_lowerAngle = function() {
    return Rk(this.a)
  }
  Q.prototype.set_lowerAngle = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ao(c, a)
  }
  Q.prototype.get_upperAngle = function() {
    return Kp(this.a)
  }
  Q.prototype.set_upperAngle = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Xl(c, a)
  }
  Q.prototype.get_enableMotor = function() {
    return !!rj(this.a)
  }
  Q.prototype.set_enableMotor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    $h(c, a)
  }
  Q.prototype.get_motorSpeed = function() {
    return uf(this.a)
  }
  Q.prototype.set_motorSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dw(c, a)
  }
  Q.prototype.get_maxMotorTorque = function() {
    return Xp(this.a)
  }
  Q.prototype.set_maxMotorTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    pv(c, a)
  }
  Q.prototype.get_type = function() {
    return Yl(this.a)
  }
  Q.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kj(c, a)
  }
  Q.prototype.get_userData = function() {
    return Xm(this.a)
  }
  Q.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    uc(c, a)
  }
  Q.prototype.get_bodyA = function() {
    return n(xt(this.a), q)
  }
  Q.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qh(c, a)
  }
  Q.prototype.get_bodyB = function() {
    return n(xj(this.a), q)
  }
  Q.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dg(c, a)
  }
  Q.prototype.get_collideConnected = function() {
    return !!Yr(this.a)
  }
  Q.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Io(c, a)
  }
  Q.prototype.__destroy__ = function() {
    Zo(this.a)
  }
  function xx() {
    this.a = Mt()
    k(xx)[this.a] = this
  }
  xx.prototype = Object.create(Sw.prototype)
  xx.prototype.constructor = xx
  xx.prototype.b = xx
  xx.c = {}
  b.JSDraw = xx
  xx.prototype.DrawPolygon = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    fl(e, a, c, d)
  }
  xx.prototype.DrawSolidPolygon = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    Ef(e, a, c, d)
  }
  xx.prototype.DrawCircle = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    kc(e, a, c, d)
  }
  xx.prototype.DrawSolidCircle = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    ac(h, a, c, d, e)
  }
  xx.prototype.DrawSegment = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    $e(e, a, c, d)
  }
  xx.prototype.DrawTransform = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    lj(c, a)
  }
  xx.prototype.__destroy__ = function() {
    Hf(this.a)
  }
  function R() {
    throw "cannot construct a b2WheelJoint, no constructor in IDL"
  }
  R.prototype = Object.create(p.prototype)
  R.prototype.constructor = R
  R.prototype.b = R
  R.c = {}
  b.b2WheelJoint = R
  R.prototype.GetLocalAnchorA = function() {
    return n(Mf(this.a), r)
  }
  R.prototype.GetLocalAnchorB = function() {
    return n(qw(this.a), r)
  }
  R.prototype.GetLocalAxisA = function() {
    return n($u(this.a), r)
  }
  R.prototype.GetJointTranslation = function() {
    return es(this.a)
  }
  R.prototype.GetJointSpeed = function() {
    return pf(this.a)
  }
  R.prototype.IsMotorEnabled = function() {
    return !!Up(this.a)
  }
  R.prototype.EnableMotor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Cf(c, a)
  }
  R.prototype.SetMotorSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ud(c, a)
  }
  R.prototype.GetMotorSpeed = function() {
    return pn(this.a)
  }
  R.prototype.SetMaxMotorTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Wj(c, a)
  }
  R.prototype.GetMaxMotorTorque = function() {
    return nf(this.a)
  }
  R.prototype.GetMotorTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return gs(c, a)
  }
  R.prototype.SetSpringFrequencyHz = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ch(c, a)
  }
  R.prototype.GetSpringFrequencyHz = function() {
    return iw(this.a)
  }
  R.prototype.SetSpringDampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Wn(c, a)
  }
  R.prototype.GetSpringDampingRatio = function() {
    return Lb(this.a)
  }
  R.prototype.GetType = function() {
    return Tu(this.a)
  }
  R.prototype.GetBodyA = function() {
    return n(In(this.a), q)
  }
  R.prototype.GetBodyB = function() {
    return n(hm(this.a), q)
  }
  R.prototype.GetAnchorA = function() {
    return n(wr(this.a), r)
  }
  R.prototype.GetAnchorB = function() {
    return n(sw(this.a), r)
  }
  R.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Xe(c, a), r)
  }
  R.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return xm(c, a)
  }
  R.prototype.GetNext = function() {
    return n(Fn(this.a), p)
  }
  R.prototype.GetUserData = function() {
    return Dn(this.a)
  }
  R.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    kt(c, a)
  }
  R.prototype.IsActive = function() {
    return !!js(this.a)
  }
  R.prototype.GetCollideConnected = function() {
    return !!Hr(this.a)
  }
  R.prototype.__destroy__ = function() {
    Dw(this.a)
  }
  function S() {
    throw "cannot construct a b2PulleyJoint, no constructor in IDL"
  }
  S.prototype = Object.create(p.prototype)
  S.prototype.constructor = S
  S.prototype.b = S
  S.c = {}
  b.b2PulleyJoint = S
  S.prototype.GetGroundAnchorA = function() {
    return n(Vc(this.a), r)
  }
  S.prototype.GetGroundAnchorB = function() {
    return n(Wf(this.a), r)
  }
  S.prototype.GetLengthA = function() {
    return Kn(this.a)
  }
  S.prototype.GetLengthB = function() {
    return Uj(this.a)
  }
  S.prototype.GetRatio = function() {
    return co(this.a)
  }
  S.prototype.GetCurrentLengthA = function() {
    return Hk(this.a)
  }
  S.prototype.GetCurrentLengthB = function() {
    return wi(this.a)
  }
  S.prototype.GetType = function() {
    return si(this.a)
  }
  S.prototype.GetBodyA = function() {
    return n(hq(this.a), q)
  }
  S.prototype.GetBodyB = function() {
    return n(Nd(this.a), q)
  }
  S.prototype.GetAnchorA = function() {
    return n(Iu(this.a), r)
  }
  S.prototype.GetAnchorB = function() {
    return n(wm(this.a), r)
  }
  S.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(uu(c, a), r)
  }
  S.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Qu(c, a)
  }
  S.prototype.GetNext = function() {
    return n(ij(this.a), p)
  }
  S.prototype.GetUserData = function() {
    return pc(this.a)
  }
  S.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qb(c, a)
  }
  S.prototype.IsActive = function() {
    return !!ai(this.a)
  }
  S.prototype.GetCollideConnected = function() {
    return !!Kt(this.a)
  }
  S.prototype.__destroy__ = function() {
    yo(this.a)
  }
  function T() {
    this.a = pp()
    k(T)[this.a] = this
  }
  T.prototype = Object.create(t.prototype)
  T.prototype.constructor = T
  T.prototype.b = T
  T.c = {}
  b.b2MouseJointDef = T
  T.prototype.get_target = function() {
    return n(om(this.a), r)
  }
  T.prototype.set_target = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rd(c, a)
  }
  T.prototype.get_maxForce = function() {
    return Xu(this.a)
  }
  T.prototype.set_maxForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ul(c, a)
  }
  T.prototype.get_frequencyHz = function() {
    return sp(this.a)
  }
  T.prototype.set_frequencyHz = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Sm(c, a)
  }
  T.prototype.get_dampingRatio = function() {
    return ag(this.a)
  }
  T.prototype.set_dampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zo(c, a)
  }
  T.prototype.get_type = function() {
    return mp(this.a)
  }
  T.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Hd(c, a)
  }
  T.prototype.get_userData = function() {
    return Hs(this.a)
  }
  T.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    xc(c, a)
  }
  T.prototype.get_bodyA = function() {
    return n(tk(this.a), q)
  }
  T.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    nd(c, a)
  }
  T.prototype.get_bodyB = function() {
    return n(gg(this.a), q)
  }
  T.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gh(c, a)
  }
  T.prototype.get_collideConnected = function() {
    return !!rt(this.a)
  }
  T.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Gq(c, a)
  }
  T.prototype.__destroy__ = function() {
    If(this.a)
  }
  function D() {
    throw "cannot construct a b2Contact, no constructor in IDL"
  }
  D.prototype = Object.create(g.prototype)
  D.prototype.constructor = D
  D.prototype.b = D
  D.c = {}
  b.b2Contact = D
  D.prototype.GetManifold = function() {
    return n(ct(this.a), jx)
  }
  D.prototype.IsTouching = function() {
    return !!$d(this.a)
  }
  D.prototype.SetEnabled = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jf(c, a)
  }
  D.prototype.IsEnabled = function() {
    return !!mg(this.a)
  }
  D.prototype.GetNext = function() {
    return n(hd(this.a), D)
  }
  D.prototype.GetFixtureA = function() {
    return n(ue(this.a), v)
  }
  D.prototype.GetChildIndexA = function() {
    return Uv(this.a)
  }
  D.prototype.GetFixtureB = function() {
    return n(Rv(this.a), v)
  }
  D.prototype.GetChildIndexB = function() {
    return fh(this.a)
  }
  D.prototype.SetFriction = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fq(c, a)
  }
  D.prototype.GetFriction = function() {
    return Kh(this.a)
  }
  D.prototype.ResetFriction = function() {
    yh(this.a)
  }
  D.prototype.SetRestitution = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    yq(c, a)
  }
  D.prototype.GetRestitution = function() {
    return Vm(this.a)
  }
  D.prototype.ResetRestitution = function() {
    Vh(this.a)
  }
  D.prototype.SetTangentSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ri(c, a)
  }
  D.prototype.GetTangentSpeed = function() {
    return dd(this.a)
  }
  function U() {
    this.a = sm()
    k(U)[this.a] = this
  }
  U.prototype = Object.create(t.prototype)
  U.prototype.constructor = U
  U.prototype.b = U
  U.c = {}
  b.b2DistanceJointDef = U
  U.prototype.Initialize = function(a, c, d, e) {
    var h = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    e && "object" === typeof e && (e = e.a)
    us(h, a, c, d, e)
  }
  U.prototype.get_localAnchorA = function() {
    return n(Pi(this.a), r)
  }
  U.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ye(c, a)
  }
  U.prototype.get_localAnchorB = function() {
    return n(kq(this.a), r)
  }
  U.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    mu(c, a)
  }
  U.prototype.get_length = function() {
    return Md(this.a)
  }
  U.prototype.set_length = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Mh(c, a)
  }
  U.prototype.get_frequencyHz = function() {
    return Ln(this.a)
  }
  U.prototype.set_frequencyHz = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    nj(c, a)
  }
  U.prototype.get_dampingRatio = function() {
    return ee(this.a)
  }
  U.prototype.set_dampingRatio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kc(c, a)
  }
  U.prototype.get_type = function() {
    return Rh(this.a)
  }
  U.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    cq(c, a)
  }
  U.prototype.get_userData = function() {
    return sc(this.a)
  }
  U.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Jc(c, a)
  }
  U.prototype.get_bodyA = function() {
    return n(Ci(this.a), q)
  }
  U.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Zr(c, a)
  }
  U.prototype.get_bodyB = function() {
    return n(Ku(this.a), q)
  }
  U.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    zp(c, a)
  }
  U.prototype.get_collideConnected = function() {
    return !!vp(this.a)
  }
  U.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Cn(c, a)
  }
  U.prototype.__destroy__ = function() {
    Rt(this.a)
  }
  function q() {
    throw "cannot construct a b2Body, no constructor in IDL"
  }
  q.prototype = Object.create(g.prototype)
  q.prototype.constructor = q
  q.prototype.b = q
  q.c = {}
  b.b2Body = q
  q.prototype.CreateFixture = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    return void 0 === c ? n(Lt(d, a), v) : n(ol(d, a, c), v)
  }
  q.prototype.DestroyFixture = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    kn(c, a)
  }
  q.prototype.SetTransform = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    pm(d, a, c)
  }
  q.prototype.GetTransform = function() {
    return n(tt(this.a), tx)
  }
  q.prototype.GetPosition = function() {
    return n(Ig(this.a), r)
  }
  q.prototype.GetAngle = function() {
    return nw(this.a)
  }
  q.prototype.GetWorldCenter = function() {
    return n(ik(this.a), r)
  }
  q.prototype.GetLocalCenter = function() {
    return n(vv(this.a), r)
  }
  q.prototype.SetLinearVelocity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Vl(c, a)
  }
  q.prototype.GetLinearVelocity = function() {
    return n(me(this.a), r)
  }
  q.prototype.SetAngularVelocity = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dt(c, a)
  }
  q.prototype.GetAngularVelocity = function() {
    return Ui(this.a)
  }
  q.prototype.ApplyForce = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    lt(e, a, c, d)
  }
  q.prototype.ApplyForceToCenter = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Ge(d, a, c)
  }
  q.prototype.ApplyTorque = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    mh(d, a, c)
  }
  q.prototype.ApplyLinearImpulse = function(a, c, d) {
    var e = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    d && "object" === typeof d && (d = d.a)
    un(e, a, c, d)
  }
  q.prototype.ApplyAngularImpulse = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Id(d, a, c)
  }
  q.prototype.GetMass = function() {
    return Sn(this.a)
  }
  q.prototype.GetInertia = function() {
    return Hu(this.a)
  }
  q.prototype.GetMassData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    an(c, a)
  }
  q.prototype.SetMassData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Wd(c, a)
  }
  q.prototype.ResetMassData = function() {
    Ym(this.a)
  }
  q.prototype.GetWorldPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Gj(c, a), r)
  }
  q.prototype.GetWorldVector = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(hg(c, a), r)
  }
  q.prototype.GetLocalPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(rg(c, a), r)
  }
  q.prototype.GetLocalVector = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(cm(c, a), r)
  }
  q.prototype.GetLinearVelocityFromWorldPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(Iq(c, a), r)
  }
  q.prototype.GetLinearVelocityFromLocalPoint = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(pq(c, a), r)
  }
  q.prototype.GetLinearDamping = function() {
    return or(this.a)
  }
  q.prototype.SetLinearDamping = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gm(c, a)
  }
  q.prototype.GetAngularDamping = function() {
    return ok(this.a)
  }
  q.prototype.SetAngularDamping = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Th(c, a)
  }
  q.prototype.GetGravityScale = function() {
    return ej(this.a)
  }
  q.prototype.SetGravityScale = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    El(c, a)
  }
  q.prototype.SetType = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Rn(c, a)
  }
  q.prototype.GetType = function() {
    return Tr(this.a)
  }
  q.prototype.SetBullet = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    uk(c, a)
  }
  q.prototype.IsBullet = function() {
    return !!bl(this.a)
  }
  q.prototype.SetSleepingAllowed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Kk(c, a)
  }
  q.prototype.IsSleepingAllowed = function() {
    return !!Lp(this.a)
  }
  q.prototype.SetAwake = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Du(c, a)
  }
  q.prototype.IsAwake = function() {
    return !!pd(this.a)
  }
  q.prototype.SetActive = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    pl(c, a)
  }
  q.prototype.IsActive = function() {
    return !!Uh(this.a)
  }
  q.prototype.SetFixedRotation = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ah(c, a)
  }
  q.prototype.IsFixedRotation = function() {
    return !!Ih(this.a)
  }
  q.prototype.GetFixtureList = function() {
    return n(xo(this.a), v)
  }
  q.prototype.GetJointList = function() {
    return n(Os(this.a), rx)
  }
  q.prototype.GetContactList = function() {
    return n(Lh(this.a), yx)
  }
  q.prototype.GetNext = function() {
    return n(av(this.a), q)
  }
  q.prototype.GetUserData = function() {
    return nk(this.a)
  }
  q.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ji(c, a)
  }
  q.prototype.GetWorld = function() {
    return n(Au(this.a), C)
  }
  q.prototype.Dump = function() {
    gk(this.a)
  }
  function V() {
    throw "cannot construct a b2FrictionJoint, no constructor in IDL"
  }
  V.prototype = Object.create(p.prototype)
  V.prototype.constructor = V
  V.prototype.b = V
  V.c = {}
  b.b2FrictionJoint = V
  V.prototype.GetLocalAnchorA = function() {
    return n(Ho(this.a), r)
  }
  V.prototype.GetLocalAnchorB = function() {
    return n(Oh(this.a), r)
  }
  V.prototype.SetMaxForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ft(c, a)
  }
  V.prototype.GetMaxForce = function() {
    return lv(this.a)
  }
  V.prototype.SetMaxTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    rp(c, a)
  }
  V.prototype.GetMaxTorque = function() {
    return pi(this.a)
  }
  V.prototype.GetType = function() {
    return Yf(this.a)
  }
  V.prototype.GetBodyA = function() {
    return n(lw(this.a), q)
  }
  V.prototype.GetBodyB = function() {
    return n(Je(this.a), q)
  }
  V.prototype.GetAnchorA = function() {
    return n(Cr(this.a), r)
  }
  V.prototype.GetAnchorB = function() {
    return n(gv(this.a), r)
  }
  V.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(aq(c, a), r)
  }
  V.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Yj(c, a)
  }
  V.prototype.GetNext = function() {
    return n(cs(this.a), p)
  }
  V.prototype.GetUserData = function() {
    return kr(this.a)
  }
  V.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    tp(c, a)
  }
  V.prototype.IsActive = function() {
    return !!Wb(this.a)
  }
  V.prototype.GetCollideConnected = function() {
    return !!ip(this.a)
  }
  V.prototype.__destroy__ = function() {
    Do(this.a)
  }
  function zx() {
    throw "cannot construct a b2DestructionListener, no constructor in IDL"
  }
  zx.prototype = Object.create(g.prototype)
  zx.prototype.constructor = zx
  zx.prototype.b = zx
  zx.c = {}
  b.b2DestructionListener = zx
  zx.prototype.__destroy__ = function() {
    mc(this.a)
  }
  function W() {
    this.a = Om()
    k(W)[this.a] = this
  }
  W.prototype = Object.create(t.prototype)
  W.prototype.constructor = W
  W.prototype.b = W
  W.c = {}
  b.b2GearJointDef = W
  W.prototype.get_joint1 = function() {
    return n(hi(this.a), p)
  }
  W.prototype.set_joint1 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dq(c, a)
  }
  W.prototype.get_joint2 = function() {
    return n(im(this.a), p)
  }
  W.prototype.set_joint2 = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    du(c, a)
  }
  W.prototype.get_ratio = function() {
    return Vo(this.a)
  }
  W.prototype.set_ratio = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jg(c, a)
  }
  W.prototype.get_type = function() {
    return Zl(this.a)
  }
  W.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    se(c, a)
  }
  W.prototype.get_userData = function() {
    return Km(this.a)
  }
  W.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ov(c, a)
  }
  W.prototype.get_bodyA = function() {
    return n(mj(this.a), q)
  }
  W.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    St(c, a)
  }
  W.prototype.get_bodyB = function() {
    return n(dn(this.a), q)
  }
  W.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Fv(c, a)
  }
  W.prototype.get_collideConnected = function() {
    return !!rk(this.a)
  }
  W.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Jo(c, a)
  }
  W.prototype.__destroy__ = function() {
    lq(this.a)
  }
  function X() {
    throw "cannot construct a b2RevoluteJoint, no constructor in IDL"
  }
  X.prototype = Object.create(p.prototype)
  X.prototype.constructor = X
  X.prototype.b = X
  X.c = {}
  b.b2RevoluteJoint = X
  X.prototype.GetLocalAnchorA = function() {
    return n(bc(this.a), r)
  }
  X.prototype.GetLocalAnchorB = function() {
    return n(Bs(this.a), r)
  }
  X.prototype.GetReferenceAngle = function() {
    return wd(this.a)
  }
  X.prototype.GetJointAngle = function() {
    return Gf(this.a)
  }
  X.prototype.GetJointSpeed = function() {
    return Df(this.a)
  }
  X.prototype.IsLimitEnabled = function() {
    return !!nv(this.a)
  }
  X.prototype.EnableLimit = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dg(c, a)
  }
  X.prototype.GetLowerLimit = function() {
    return hk(this.a)
  }
  X.prototype.GetUpperLimit = function() {
    return Gl(this.a)
  }
  X.prototype.SetLimits = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    $r(d, a, c)
  }
  X.prototype.IsMotorEnabled = function() {
    return !!ot(this.a)
  }
  X.prototype.EnableMotor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    eh(c, a)
  }
  X.prototype.SetMotorSpeed = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Mn(c, a)
  }
  X.prototype.GetMotorSpeed = function() {
    return bg(this.a)
  }
  X.prototype.SetMaxMotorTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    dh(c, a)
  }
  X.prototype.GetMaxMotorTorque = function() {
    return Cj(this.a)
  }
  X.prototype.GetMotorTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Zs(c, a)
  }
  X.prototype.GetType = function() {
    return Cp(this.a)
  }
  X.prototype.GetBodyA = function() {
    return n(cj(this.a), q)
  }
  X.prototype.GetBodyB = function() {
    return n(zk(this.a), q)
  }
  X.prototype.GetAnchorA = function() {
    return n(ur(this.a), r)
  }
  X.prototype.GetAnchorB = function() {
    return n(Lv(this.a), r)
  }
  X.prototype.GetReactionForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return n(au(c, a), r)
  }
  X.prototype.GetReactionTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    return Sg(c, a)
  }
  X.prototype.GetNext = function() {
    return n(Mu(this.a), p)
  }
  X.prototype.GetUserData = function() {
    return zc(this.a)
  }
  X.prototype.SetUserData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ci(c, a)
  }
  X.prototype.IsActive = function() {
    return !!Vu(this.a)
  }
  X.prototype.GetCollideConnected = function() {
    return !!Gg(this.a)
  }
  X.prototype.__destroy__ = function() {
    nh(this.a)
  }
  function yx() {
    this.a = Ur()
    k(yx)[this.a] = this
  }
  yx.prototype = Object.create(g.prototype)
  yx.prototype.constructor = yx
  yx.prototype.b = yx
  yx.c = {}
  b.b2ContactEdge = yx
  yx.prototype.get_other = function() {
    return n(Gi(this.a), q)
  }
  yx.prototype.set_other = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    vi(c, a)
  }
  yx.prototype.get_contact = function() {
    return n(Wm(this.a), D)
  }
  yx.prototype.set_contact = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Ut(c, a)
  }
  yx.prototype.get_prev = function() {
    return n(Kg(this.a), yx)
  }
  yx.prototype.set_prev = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    jw(c, a)
  }
  yx.prototype.get_next = function() {
    return n(Eg(this.a), yx)
  }
  yx.prototype.set_next = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Mb(c, a)
  }
  yx.prototype.__destroy__ = function() {
    Oe(this.a)
  }
  function Y() {
    this.a = Mj()
    k(Y)[this.a] = this
  }
  Y.prototype = Object.create(t.prototype)
  Y.prototype.constructor = Y
  Y.prototype.b = Y
  Y.c = {}
  b.b2RopeJointDef = Y
  Y.prototype.get_localAnchorA = function() {
    return n(Im(this.a), r)
  }
  Y.prototype.set_localAnchorA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Or(c, a)
  }
  Y.prototype.get_localAnchorB = function() {
    return n(sq(this.a), r)
  }
  Y.prototype.set_localAnchorB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Mv(c, a)
  }
  Y.prototype.get_maxLength = function() {
    return sk(this.a)
  }
  Y.prototype.set_maxLength = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Uk(c, a)
  }
  Y.prototype.get_type = function() {
    return iq(this.a)
  }
  Y.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Bk(c, a)
  }
  Y.prototype.get_userData = function() {
    return wn(this.a)
  }
  Y.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    qo(c, a)
  }
  Y.prototype.get_bodyA = function() {
    return n(ju(this.a), q)
  }
  Y.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qf(c, a)
  }
  Y.prototype.get_bodyB = function() {
    return n(Vv(this.a), q)
  }
  Y.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Rd(c, a)
  }
  Y.prototype.get_collideConnected = function() {
    return !!kh(this.a)
  }
  Y.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Lc(c, a)
  }
  Y.prototype.__destroy__ = function() {
    is(this.a)
  }
  function Z() {
    this.a = Cg()
    k(Z)[this.a] = this
  }
  Z.prototype = Object.create(t.prototype)
  Z.prototype.constructor = Z
  Z.prototype.b = Z
  Z.c = {}
  b.b2MotorJointDef = Z
  Z.prototype.Initialize = function(a, c) {
    var d = this.a
    a && "object" === typeof a && (a = a.a)
    c && "object" === typeof c && (c = c.a)
    Tl(d, a, c)
  }
  Z.prototype.get_linearOffset = function() {
    return n(Sl(this.a), r)
  }
  Z.prototype.set_linearOffset = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    fo(c, a)
  }
  Z.prototype.get_angularOffset = function() {
    return jt(this.a)
  }
  Z.prototype.set_angularOffset = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Rr(c, a)
  }
  Z.prototype.get_maxForce = function() {
    return rc(this.a)
  }
  Z.prototype.set_maxForce = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    At(c, a)
  }
  Z.prototype.get_maxTorque = function() {
    return oq(this.a)
  }
  Z.prototype.set_maxTorque = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Dv(c, a)
  }
  Z.prototype.get_correctionFactor = function() {
    return $o(this.a)
  }
  Z.prototype.set_correctionFactor = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    gt(c, a)
  }
  Z.prototype.get_type = function() {
    return hr(this.a)
  }
  Z.prototype.set_type = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ec(c, a)
  }
  Z.prototype.get_userData = function() {
    return Vt(this.a)
  }
  Z.prototype.set_userData = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    id(c, a)
  }
  Z.prototype.get_bodyA = function() {
    return n(ew(this.a), q)
  }
  Z.prototype.set_bodyA = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    cl(c, a)
  }
  Z.prototype.get_bodyB = function() {
    return n(ou(this.a), q)
  }
  Z.prototype.set_bodyB = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    ls(c, a)
  }
  Z.prototype.get_collideConnected = function() {
    return !!xd(this.a)
  }
  Z.prototype.set_collideConnected = function(a) {
    var c = this.a
    a && "object" === typeof a && (a = a.a)
    Qv(c, a)
  }
  Z.prototype.__destroy__ = function() {
    bs(this.a)
  }
  ;(function() {
    function a() {
      b.b2Shape.e_circle = ck()
      b.b2Shape.e_edge = Bj()
      b.b2Shape.e_polygon = Gu()
      b.b2Shape.e_chain = Jn()
      b.b2Shape.e_typeCount = ut()
      b.e_unknownJoint = Zh()
      b.e_revoluteJoint = mi()
      b.e_prismaticJoint = Tq()
      b.e_distanceJoint = Vn()
      b.e_pulleyJoint = gf()
      b.e_mouseJoint = it()
      b.e_gearJoint = $s()
      b.e_wheelJoint = Me()
      b.e_weldJoint = mm()
      b.e_frictionJoint = Jd()
      b.e_ropeJoint = yv()
      b.e_motorJoint = go()
      b.e_inactiveLimit = Bu()
      b.e_atLowerLimit = en()
      b.e_atUpperLimit = xw()
      b.e_equalLimits = Gh()
      b.b2Manifold.e_circles = yd()
      b.b2Manifold.e_faceA = vj()
      b.b2Manifold.e_faceB = wj()
      b.b2_staticBody = Wl()
      b.b2_kinematicBody = tj()
      b.b2_dynamicBody = Pt()
      b.b2Draw.e_shapeBit = Jh()
      b.b2Draw.e_jointBit = yf()
      b.b2Draw.e_aabbBit = cr()
      b.b2Draw.e_pairBit = Dr()
      b.b2Draw.e_centerOfMassBit = oo()
      b.b2ContactFeature.e_vertex = to()
      b.b2ContactFeature.e_face = Fl()
    }
    b.calledRun ? a() : eb.unshift(a)
  })()

  return Box2D
}
