var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x2, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, isWorkerdProcessV2, unenvProcess, exit, features, platform, env, hrtime3, nextTick, _channel, _disconnect, _events, _eventsCount, _handleQueue, _maxListeners, _pendingMessage, _send, assert2, disconnect, mainModule, _debugEnd, _debugProcess, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _linkedBinding, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, dlopen, domain, emit, emitWarning, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, initgroups, kill, listenerCount, listeners, loadEnvFile, memoryUsage, moduleLoadList, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
    unenvProcess = new Process({
      env: globalProcess.env,
      // `hrtime` is only available from workerd process v2
      hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      env: (
        // Always implemented by workerd
        env
      ),
      hrtime: (
        // Only implemented in workerd v2
        hrtime3
      ),
      nextTick: (
        // Always implemented by workerd
        nextTick
      )
    } = unenvProcess);
    ({
      _channel,
      _disconnect,
      _events,
      _eventsCount,
      _handleQueue,
      _maxListeners,
      _pendingMessage,
      _send,
      assert: assert2,
      disconnect,
      mainModule
    } = unenvProcess);
    ({
      _debugEnd: (
        // @ts-expect-error `_debugEnd` is missing typings
        _debugEnd
      ),
      _debugProcess: (
        // @ts-expect-error `_debugProcess` is missing typings
        _debugProcess
      ),
      _exiting: (
        // @ts-expect-error `_exiting` is missing typings
        _exiting
      ),
      _fatalException: (
        // @ts-expect-error `_fatalException` is missing typings
        _fatalException
      ),
      _getActiveHandles: (
        // @ts-expect-error `_getActiveHandles` is missing typings
        _getActiveHandles
      ),
      _getActiveRequests: (
        // @ts-expect-error `_getActiveRequests` is missing typings
        _getActiveRequests
      ),
      _kill: (
        // @ts-expect-error `_kill` is missing typings
        _kill
      ),
      _linkedBinding: (
        // @ts-expect-error `_linkedBinding` is missing typings
        _linkedBinding
      ),
      _preload_modules: (
        // @ts-expect-error `_preload_modules` is missing typings
        _preload_modules
      ),
      _rawDebug: (
        // @ts-expect-error `_rawDebug` is missing typings
        _rawDebug
      ),
      _startProfilerIdleNotifier: (
        // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
        _startProfilerIdleNotifier
      ),
      _stopProfilerIdleNotifier: (
        // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
        _stopProfilerIdleNotifier
      ),
      _tickCallback: (
        // @ts-expect-error `_tickCallback` is missing typings
        _tickCallback
      ),
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      availableMemory,
      binding: (
        // @ts-expect-error `binding` is missing typings
        binding
      ),
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      domain: (
        // @ts-expect-error `domain` is missing typings
        domain
      ),
      emit,
      emitWarning,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      initgroups: (
        // @ts-expect-error `initgroups` is missing typings
        initgroups
      ),
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      memoryUsage,
      moduleLoadList: (
        // @ts-expect-error `moduleLoadList` is missing typings
        moduleLoadList
      ),
      off,
      on,
      once,
      openStdin: (
        // @ts-expect-error `openStdin` is missing typings
        openStdin
      ),
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit: (
        // @ts-expect-error `reallyExit` is missing typings
        reallyExit
      ),
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = isWorkerdProcessV2 ? workerdProcess : unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../../node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../../node_modules/@prisma/client/runtime/edge.js
var require_edge = __commonJS({
  "../../node_modules/@prisma/client/runtime/edge.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ba = Object.create;
    var lr = Object.defineProperty;
    var xa = Object.getOwnPropertyDescriptor;
    var Pa = Object.getOwnPropertyNames;
    var va = Object.getPrototypeOf;
    var Ta = Object.prototype.hasOwnProperty;
    var fe = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "fe");
    var Je = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "Je");
    var vt = /* @__PURE__ */ __name((e, t) => {
      for (var r in t) lr(e, r, { get: t[r], enumerable: true });
    }, "vt");
    var ci = /* @__PURE__ */ __name((e, t, r, n) => {
      if (t && typeof t == "object" || typeof t == "function") for (let i of Pa(t)) !Ta.call(e, i) && i !== r && lr(e, i, { get: /* @__PURE__ */ __name(() => t[i], "get"), enumerable: !(n = xa(t, i)) || n.enumerable });
      return e;
    }, "ci");
    var Qe = /* @__PURE__ */ __name((e, t, r) => (r = e != null ? ba(va(e)) : {}, ci(t || !e || !e.__esModule ? lr(r, "default", { value: e, enumerable: true }) : r, e)), "Qe");
    var Aa = /* @__PURE__ */ __name((e) => ci(lr({}, "__esModule", { value: true }), e), "Aa");
    var y;
    var b2;
    var u = fe(() => {
      "use strict";
      y = { nextTick: /* @__PURE__ */ __name((e, ...t) => {
        setTimeout(() => {
          e(...t);
        }, 0);
      }, "nextTick"), env: {}, version: "", cwd: /* @__PURE__ */ __name(() => "/", "cwd"), stderr: {}, argv: ["/bin/node"], pid: 1e4 }, { cwd: b2 } = y;
    });
    var x2;
    var c = fe(() => {
      "use strict";
      x2 = globalThis.performance ?? (() => {
        let e = Date.now();
        return { now: /* @__PURE__ */ __name(() => Date.now() - e, "now") };
      })();
    });
    var E;
    var p2 = fe(() => {
      "use strict";
      E = /* @__PURE__ */ __name(() => {
      }, "E");
      E.prototype = E;
    });
    var m = fe(() => {
      "use strict";
    });
    var Ii = Je((ze) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      var gi = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "gi"), Ra = gi((e) => {
        "use strict";
        e.byteLength = l2, e.toByteArray = g, e.fromByteArray = I;
        var t = [], r = [], n = typeof Uint8Array < "u" ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (o = 0, s = i.length; o < s; ++o) t[o] = i[o], r[i.charCodeAt(o)] = o;
        var o, s;
        r[45] = 62, r[95] = 63;
        function a(S2) {
          var C = S2.length;
          if (C % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
          var M = S2.indexOf("=");
          M === -1 && (M = C);
          var F2 = M === C ? 0 : 4 - M % 4;
          return [M, F2];
        }
        __name(a, "a");
        function l2(S2) {
          var C = a(S2), M = C[0], F2 = C[1];
          return (M + F2) * 3 / 4 - F2;
        }
        __name(l2, "l");
        function d(S2, C, M) {
          return (C + M) * 3 / 4 - M;
        }
        __name(d, "d");
        function g(S2) {
          var C, M = a(S2), F2 = M[0], B = M[1], O = new n(d(S2, F2, B)), L = 0, le = B > 0 ? F2 - 4 : F2, J;
          for (J = 0; J < le; J += 4) C = r[S2.charCodeAt(J)] << 18 | r[S2.charCodeAt(J + 1)] << 12 | r[S2.charCodeAt(J + 2)] << 6 | r[S2.charCodeAt(J + 3)], O[L++] = C >> 16 & 255, O[L++] = C >> 8 & 255, O[L++] = C & 255;
          return B === 2 && (C = r[S2.charCodeAt(J)] << 2 | r[S2.charCodeAt(J + 1)] >> 4, O[L++] = C & 255), B === 1 && (C = r[S2.charCodeAt(J)] << 10 | r[S2.charCodeAt(J + 1)] << 4 | r[S2.charCodeAt(J + 2)] >> 2, O[L++] = C >> 8 & 255, O[L++] = C & 255), O;
        }
        __name(g, "g");
        function h(S2) {
          return t[S2 >> 18 & 63] + t[S2 >> 12 & 63] + t[S2 >> 6 & 63] + t[S2 & 63];
        }
        __name(h, "h");
        function T2(S2, C, M) {
          for (var F2, B = [], O = C; O < M; O += 3) F2 = (S2[O] << 16 & 16711680) + (S2[O + 1] << 8 & 65280) + (S2[O + 2] & 255), B.push(h(F2));
          return B.join("");
        }
        __name(T2, "T");
        function I(S2) {
          for (var C, M = S2.length, F2 = M % 3, B = [], O = 16383, L = 0, le = M - F2; L < le; L += O) B.push(T2(S2, L, L + O > le ? le : L + O));
          return F2 === 1 ? (C = S2[M - 1], B.push(t[C >> 2] + t[C << 4 & 63] + "==")) : F2 === 2 && (C = (S2[M - 2] << 8) + S2[M - 1], B.push(t[C >> 10] + t[C >> 4 & 63] + t[C << 2 & 63] + "=")), B.join("");
        }
        __name(I, "I");
      }), Ca = gi((e) => {
        e.read = function(t, r, n, i, o) {
          var s, a, l2 = o * 8 - i - 1, d = (1 << l2) - 1, g = d >> 1, h = -7, T2 = n ? o - 1 : 0, I = n ? -1 : 1, S2 = t[r + T2];
          for (T2 += I, s = S2 & (1 << -h) - 1, S2 >>= -h, h += l2; h > 0; s = s * 256 + t[r + T2], T2 += I, h -= 8) ;
          for (a = s & (1 << -h) - 1, s >>= -h, h += i; h > 0; a = a * 256 + t[r + T2], T2 += I, h -= 8) ;
          if (s === 0) s = 1 - g;
          else {
            if (s === d) return a ? NaN : (S2 ? -1 : 1) * (1 / 0);
            a = a + Math.pow(2, i), s = s - g;
          }
          return (S2 ? -1 : 1) * a * Math.pow(2, s - i);
        }, e.write = function(t, r, n, i, o, s) {
          var a, l2, d, g = s * 8 - o - 1, h = (1 << g) - 1, T2 = h >> 1, I = o === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S2 = i ? 0 : s - 1, C = i ? 1 : -1, M = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
          for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (l2 = isNaN(r) ? 1 : 0, a = h) : (a = Math.floor(Math.log(r) / Math.LN2), r * (d = Math.pow(2, -a)) < 1 && (a--, d *= 2), a + T2 >= 1 ? r += I / d : r += I * Math.pow(2, 1 - T2), r * d >= 2 && (a++, d /= 2), a + T2 >= h ? (l2 = 0, a = h) : a + T2 >= 1 ? (l2 = (r * d - 1) * Math.pow(2, o), a = a + T2) : (l2 = r * Math.pow(2, T2 - 1) * Math.pow(2, o), a = 0)); o >= 8; t[n + S2] = l2 & 255, S2 += C, l2 /= 256, o -= 8) ;
          for (a = a << o | l2, g += o; g > 0; t[n + S2] = a & 255, S2 += C, a /= 256, g -= 8) ;
          t[n + S2 - C] |= M * 128;
        };
      }), un = Ra(), We = Ca(), pi = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
      ze.Buffer = A;
      ze.SlowBuffer = Ma;
      ze.INSPECT_MAX_BYTES = 50;
      var ur = 2147483647;
      ze.kMaxLength = ur;
      A.TYPED_ARRAY_SUPPORT = Sa();
      !A.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
      function Sa() {
        try {
          let e = new Uint8Array(1), t = { foo: /* @__PURE__ */ __name(function() {
            return 42;
          }, "foo") };
          return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), e.foo() === 42;
        } catch {
          return false;
        }
      }
      __name(Sa, "Sa");
      Object.defineProperty(A.prototype, "parent", { enumerable: true, get: /* @__PURE__ */ __name(function() {
        if (A.isBuffer(this)) return this.buffer;
      }, "get") });
      Object.defineProperty(A.prototype, "offset", { enumerable: true, get: /* @__PURE__ */ __name(function() {
        if (A.isBuffer(this)) return this.byteOffset;
      }, "get") });
      function xe(e) {
        if (e > ur) throw new RangeError('The value "' + e + '" is invalid for option "size"');
        let t = new Uint8Array(e);
        return Object.setPrototypeOf(t, A.prototype), t;
      }
      __name(xe, "xe");
      function A(e, t, r) {
        if (typeof e == "number") {
          if (typeof t == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
          return mn(e);
        }
        return hi(e, t, r);
      }
      __name(A, "A");
      A.poolSize = 8192;
      function hi(e, t, r) {
        if (typeof e == "string") return Oa(e, t);
        if (ArrayBuffer.isView(e)) return ka(e);
        if (e == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
        if (de(e, ArrayBuffer) || e && de(e.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (de(e, SharedArrayBuffer) || e && de(e.buffer, SharedArrayBuffer))) return wi(e, t, r);
        if (typeof e == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
        let n = e.valueOf && e.valueOf();
        if (n != null && n !== e) return A.from(n, t, r);
        let i = Da(e);
        if (i) return i;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] == "function") return A.from(e[Symbol.toPrimitive]("string"), t, r);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
      }
      __name(hi, "hi");
      A.from = function(e, t, r) {
        return hi(e, t, r);
      };
      Object.setPrototypeOf(A.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(A, Uint8Array);
      function yi(e) {
        if (typeof e != "number") throw new TypeError('"size" argument must be of type number');
        if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
      }
      __name(yi, "yi");
      function Ia(e, t, r) {
        return yi(e), e <= 0 ? xe(e) : t !== void 0 ? typeof r == "string" ? xe(e).fill(t, r) : xe(e).fill(t) : xe(e);
      }
      __name(Ia, "Ia");
      A.alloc = function(e, t, r) {
        return Ia(e, t, r);
      };
      function mn(e) {
        return yi(e), xe(e < 0 ? 0 : fn(e) | 0);
      }
      __name(mn, "mn");
      A.allocUnsafe = function(e) {
        return mn(e);
      };
      A.allocUnsafeSlow = function(e) {
        return mn(e);
      };
      function Oa(e, t) {
        if ((typeof t != "string" || t === "") && (t = "utf8"), !A.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
        let r = Ei(e, t) | 0, n = xe(r), i = n.write(e, t);
        return i !== r && (n = n.slice(0, i)), n;
      }
      __name(Oa, "Oa");
      function cn(e) {
        let t = e.length < 0 ? 0 : fn(e.length) | 0, r = xe(t);
        for (let n = 0; n < t; n += 1) r[n] = e[n] & 255;
        return r;
      }
      __name(cn, "cn");
      function ka(e) {
        if (de(e, Uint8Array)) {
          let t = new Uint8Array(e);
          return wi(t.buffer, t.byteOffset, t.byteLength);
        }
        return cn(e);
      }
      __name(ka, "ka");
      function wi(e, t, r) {
        if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
        if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
        let n;
        return t === void 0 && r === void 0 ? n = new Uint8Array(e) : r === void 0 ? n = new Uint8Array(e, t) : n = new Uint8Array(e, t, r), Object.setPrototypeOf(n, A.prototype), n;
      }
      __name(wi, "wi");
      function Da(e) {
        if (A.isBuffer(e)) {
          let t = fn(e.length) | 0, r = xe(t);
          return r.length === 0 || e.copy(r, 0, 0, t), r;
        }
        if (e.length !== void 0) return typeof e.length != "number" || gn(e.length) ? xe(0) : cn(e);
        if (e.type === "Buffer" && Array.isArray(e.data)) return cn(e.data);
      }
      __name(Da, "Da");
      function fn(e) {
        if (e >= ur) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ur.toString(16) + " bytes");
        return e | 0;
      }
      __name(fn, "fn");
      function Ma(e) {
        return +e != e && (e = 0), A.alloc(+e);
      }
      __name(Ma, "Ma");
      A.isBuffer = function(e) {
        return e != null && e._isBuffer === true && e !== A.prototype;
      };
      A.compare = function(e, t) {
        if (de(e, Uint8Array) && (e = A.from(e, e.offset, e.byteLength)), de(t, Uint8Array) && (t = A.from(t, t.offset, t.byteLength)), !A.isBuffer(e) || !A.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === t) return 0;
        let r = e.length, n = t.length;
        for (let i = 0, o = Math.min(r, n); i < o; ++i) if (e[i] !== t[i]) {
          r = e[i], n = t[i];
          break;
        }
        return r < n ? -1 : n < r ? 1 : 0;
      };
      A.isEncoding = function(e) {
        switch (String(e).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      A.concat = function(e, t) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (e.length === 0) return A.alloc(0);
        let r;
        if (t === void 0) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
        let n = A.allocUnsafe(t), i = 0;
        for (r = 0; r < e.length; ++r) {
          let o = e[r];
          if (de(o, Uint8Array)) i + o.length > n.length ? (A.isBuffer(o) || (o = A.from(o)), o.copy(n, i)) : Uint8Array.prototype.set.call(n, o, i);
          else if (A.isBuffer(o)) o.copy(n, i);
          else throw new TypeError('"list" argument must be an Array of Buffers');
          i += o.length;
        }
        return n;
      };
      function Ei(e, t) {
        if (A.isBuffer(e)) return e.length;
        if (ArrayBuffer.isView(e) || de(e, ArrayBuffer)) return e.byteLength;
        if (typeof e != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
        let r = e.length, n = arguments.length > 2 && arguments[2] === true;
        if (!n && r === 0) return 0;
        let i = false;
        for (; ; ) switch (t) {
          case "ascii":
          case "latin1":
          case "binary":
            return r;
          case "utf8":
          case "utf-8":
            return pn(e).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return r * 2;
          case "hex":
            return r >>> 1;
          case "base64":
            return Si(e).length;
          default:
            if (i) return n ? -1 : pn(e).length;
            t = ("" + t).toLowerCase(), i = true;
        }
      }
      __name(Ei, "Ei");
      A.byteLength = Ei;
      function _a(e, t, r) {
        let n = false;
        if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((r === void 0 || r > this.length) && (r = this.length), r <= 0) || (r >>>= 0, t >>>= 0, r <= t)) return "";
        for (e || (e = "utf8"); ; ) switch (e) {
          case "hex":
            return Ga(this, t, r);
          case "utf8":
          case "utf-8":
            return xi(this, t, r);
          case "ascii":
            return $a(this, t, r);
          case "latin1":
          case "binary":
            return ja(this, t, r);
          case "base64":
            return qa(this, t, r);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ja(this, t, r);
          default:
            if (n) throw new TypeError("Unknown encoding: " + e);
            e = (e + "").toLowerCase(), n = true;
        }
      }
      __name(_a, "_a");
      A.prototype._isBuffer = true;
      function Le(e, t, r) {
        let n = e[t];
        e[t] = e[r], e[r] = n;
      }
      __name(Le, "Le");
      A.prototype.swap16 = function() {
        let e = this.length;
        if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let t = 0; t < e; t += 2) Le(this, t, t + 1);
        return this;
      };
      A.prototype.swap32 = function() {
        let e = this.length;
        if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let t = 0; t < e; t += 4) Le(this, t, t + 3), Le(this, t + 1, t + 2);
        return this;
      };
      A.prototype.swap64 = function() {
        let e = this.length;
        if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let t = 0; t < e; t += 8) Le(this, t, t + 7), Le(this, t + 1, t + 6), Le(this, t + 2, t + 5), Le(this, t + 3, t + 4);
        return this;
      };
      A.prototype.toString = function() {
        let e = this.length;
        return e === 0 ? "" : arguments.length === 0 ? xi(this, 0, e) : _a.apply(this, arguments);
      };
      A.prototype.toLocaleString = A.prototype.toString;
      A.prototype.equals = function(e) {
        if (!A.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
        return this === e ? true : A.compare(this, e) === 0;
      };
      A.prototype.inspect = function() {
        let e = "", t = ze.INSPECT_MAX_BYTES;
        return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
      };
      pi && (A.prototype[pi] = A.prototype.inspect);
      A.prototype.compare = function(e, t, r, n, i) {
        if (de(e, Uint8Array) && (e = A.from(e, e.offset, e.byteLength)), !A.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
        if (t === void 0 && (t = 0), r === void 0 && (r = e ? e.length : 0), n === void 0 && (n = 0), i === void 0 && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
        if (n >= i && t >= r) return 0;
        if (n >= i) return -1;
        if (t >= r) return 1;
        if (t >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === e) return 0;
        let o = i - n, s = r - t, a = Math.min(o, s), l2 = this.slice(n, i), d = e.slice(t, r);
        for (let g = 0; g < a; ++g) if (l2[g] !== d[g]) {
          o = l2[g], s = d[g];
          break;
        }
        return o < s ? -1 : s < o ? 1 : 0;
      };
      function bi(e, t, r, n, i) {
        if (e.length === 0) return -1;
        if (typeof r == "string" ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, gn(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
          if (i) return -1;
          r = e.length - 1;
        } else if (r < 0) if (i) r = 0;
        else return -1;
        if (typeof t == "string" && (t = A.from(t, n)), A.isBuffer(t)) return t.length === 0 ? -1 : mi(e, t, r, n, i);
        if (typeof t == "number") return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : mi(e, [t], r, n, i);
        throw new TypeError("val must be string, number or Buffer");
      }
      __name(bi, "bi");
      function mi(e, t, r, n, i) {
        let o = 1, s = e.length, a = t.length;
        if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
          if (e.length < 2 || t.length < 2) return -1;
          o = 2, s /= 2, a /= 2, r /= 2;
        }
        function l2(g, h) {
          return o === 1 ? g[h] : g.readUInt16BE(h * o);
        }
        __name(l2, "l");
        let d;
        if (i) {
          let g = -1;
          for (d = r; d < s; d++) if (l2(e, d) === l2(t, g === -1 ? 0 : d - g)) {
            if (g === -1 && (g = d), d - g + 1 === a) return g * o;
          } else g !== -1 && (d -= d - g), g = -1;
        } else for (r + a > s && (r = s - a), d = r; d >= 0; d--) {
          let g = true;
          for (let h = 0; h < a; h++) if (l2(e, d + h) !== l2(t, h)) {
            g = false;
            break;
          }
          if (g) return d;
        }
        return -1;
      }
      __name(mi, "mi");
      A.prototype.includes = function(e, t, r) {
        return this.indexOf(e, t, r) !== -1;
      };
      A.prototype.indexOf = function(e, t, r) {
        return bi(this, e, t, r, true);
      };
      A.prototype.lastIndexOf = function(e, t, r) {
        return bi(this, e, t, r, false);
      };
      function Na(e, t, r, n) {
        r = Number(r) || 0;
        let i = e.length - r;
        n ? (n = Number(n), n > i && (n = i)) : n = i;
        let o = t.length;
        n > o / 2 && (n = o / 2);
        let s;
        for (s = 0; s < n; ++s) {
          let a = parseInt(t.substr(s * 2, 2), 16);
          if (gn(a)) return s;
          e[r + s] = a;
        }
        return s;
      }
      __name(Na, "Na");
      function Fa(e, t, r, n) {
        return cr(pn(t, e.length - r), e, r, n);
      }
      __name(Fa, "Fa");
      function La(e, t, r, n) {
        return cr(Ha(t), e, r, n);
      }
      __name(La, "La");
      function Ua(e, t, r, n) {
        return cr(Si(t), e, r, n);
      }
      __name(Ua, "Ua");
      function Ba(e, t, r, n) {
        return cr(za(t, e.length - r), e, r, n);
      }
      __name(Ba, "Ba");
      A.prototype.write = function(e, t, r, n) {
        if (t === void 0) n = "utf8", r = this.length, t = 0;
        else if (r === void 0 && typeof t == "string") n = t, r = this.length, t = 0;
        else if (isFinite(t)) t = t >>> 0, isFinite(r) ? (r = r >>> 0, n === void 0 && (n = "utf8")) : (n = r, r = void 0);
        else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        let i = this.length - t;
        if ((r === void 0 || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        n || (n = "utf8");
        let o = false;
        for (; ; ) switch (n) {
          case "hex":
            return Na(this, e, t, r);
          case "utf8":
          case "utf-8":
            return Fa(this, e, t, r);
          case "ascii":
          case "latin1":
          case "binary":
            return La(this, e, t, r);
          case "base64":
            return Ua(this, e, t, r);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return Ba(this, e, t, r);
          default:
            if (o) throw new TypeError("Unknown encoding: " + n);
            n = ("" + n).toLowerCase(), o = true;
        }
      };
      A.prototype.toJSON = function() {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      };
      function qa(e, t, r) {
        return t === 0 && r === e.length ? un.fromByteArray(e) : un.fromByteArray(e.slice(t, r));
      }
      __name(qa, "qa");
      function xi(e, t, r) {
        r = Math.min(e.length, r);
        let n = [], i = t;
        for (; i < r; ) {
          let o = e[i], s = null, a = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
          if (i + a <= r) {
            let l2, d, g, h;
            switch (a) {
              case 1:
                o < 128 && (s = o);
                break;
              case 2:
                l2 = e[i + 1], (l2 & 192) === 128 && (h = (o & 31) << 6 | l2 & 63, h > 127 && (s = h));
                break;
              case 3:
                l2 = e[i + 1], d = e[i + 2], (l2 & 192) === 128 && (d & 192) === 128 && (h = (o & 15) << 12 | (l2 & 63) << 6 | d & 63, h > 2047 && (h < 55296 || h > 57343) && (s = h));
                break;
              case 4:
                l2 = e[i + 1], d = e[i + 2], g = e[i + 3], (l2 & 192) === 128 && (d & 192) === 128 && (g & 192) === 128 && (h = (o & 15) << 18 | (l2 & 63) << 12 | (d & 63) << 6 | g & 63, h > 65535 && h < 1114112 && (s = h));
            }
          }
          s === null ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | s & 1023), n.push(s), i += a;
        }
        return Va(n);
      }
      __name(xi, "xi");
      var fi = 4096;
      function Va(e) {
        let t = e.length;
        if (t <= fi) return String.fromCharCode.apply(String, e);
        let r = "", n = 0;
        for (; n < t; ) r += String.fromCharCode.apply(String, e.slice(n, n += fi));
        return r;
      }
      __name(Va, "Va");
      function $a(e, t, r) {
        let n = "";
        r = Math.min(e.length, r);
        for (let i = t; i < r; ++i) n += String.fromCharCode(e[i] & 127);
        return n;
      }
      __name($a, "$a");
      function ja(e, t, r) {
        let n = "";
        r = Math.min(e.length, r);
        for (let i = t; i < r; ++i) n += String.fromCharCode(e[i]);
        return n;
      }
      __name(ja, "ja");
      function Ga(e, t, r) {
        let n = e.length;
        (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
        let i = "";
        for (let o = t; o < r; ++o) i += Ya[e[o]];
        return i;
      }
      __name(Ga, "Ga");
      function Ja(e, t, r) {
        let n = e.slice(t, r), i = "";
        for (let o = 0; o < n.length - 1; o += 2) i += String.fromCharCode(n[o] + n[o + 1] * 256);
        return i;
      }
      __name(Ja, "Ja");
      A.prototype.slice = function(e, t) {
        let r = this.length;
        e = ~~e, t = t === void 0 ? r : ~~t, e < 0 ? (e += r, e < 0 && (e = 0)) : e > r && (e = r), t < 0 ? (t += r, t < 0 && (t = 0)) : t > r && (t = r), t < e && (t = e);
        let n = this.subarray(e, t);
        return Object.setPrototypeOf(n, A.prototype), n;
      };
      function W(e, t, r) {
        if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
        if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
      }
      __name(W, "W");
      A.prototype.readUintLE = A.prototype.readUIntLE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = this[e], i = 1, o = 0;
        for (; ++o < t && (i *= 256); ) n += this[e + o] * i;
        return n;
      };
      A.prototype.readUintBE = A.prototype.readUIntBE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = this[e + --t], i = 1;
        for (; t > 0 && (i *= 256); ) n += this[e + --t] * i;
        return n;
      };
      A.prototype.readUint8 = A.prototype.readUInt8 = function(e, t) {
        return e = e >>> 0, t || W(e, 1, this.length), this[e];
      };
      A.prototype.readUint16LE = A.prototype.readUInt16LE = function(e, t) {
        return e = e >>> 0, t || W(e, 2, this.length), this[e] | this[e + 1] << 8;
      };
      A.prototype.readUint16BE = A.prototype.readUInt16BE = function(e, t) {
        return e = e >>> 0, t || W(e, 2, this.length), this[e] << 8 | this[e + 1];
      };
      A.prototype.readUint32LE = A.prototype.readUInt32LE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
      };
      A.prototype.readUint32BE = A.prototype.readUInt32BE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      };
      A.prototype.readBigUInt64LE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, i = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + r * 2 ** 24;
        return BigInt(n) + (BigInt(i) << BigInt(32));
      });
      A.prototype.readBigUInt64BE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], i = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r;
        return (BigInt(n) << BigInt(32)) + BigInt(i);
      });
      A.prototype.readIntLE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = this[e], i = 1, o = 0;
        for (; ++o < t && (i *= 256); ) n += this[e + o] * i;
        return i *= 128, n >= i && (n -= Math.pow(2, 8 * t)), n;
      };
      A.prototype.readIntBE = function(e, t, r) {
        e = e >>> 0, t = t >>> 0, r || W(e, t, this.length);
        let n = t, i = 1, o = this[e + --n];
        for (; n > 0 && (i *= 256); ) o += this[e + --n] * i;
        return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o;
      };
      A.prototype.readInt8 = function(e, t) {
        return e = e >>> 0, t || W(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
      };
      A.prototype.readInt16LE = function(e, t) {
        e = e >>> 0, t || W(e, 2, this.length);
        let r = this[e] | this[e + 1] << 8;
        return r & 32768 ? r | 4294901760 : r;
      };
      A.prototype.readInt16BE = function(e, t) {
        e = e >>> 0, t || W(e, 2, this.length);
        let r = this[e + 1] | this[e] << 8;
        return r & 32768 ? r | 4294901760 : r;
      };
      A.prototype.readInt32LE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      };
      A.prototype.readInt32BE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      };
      A.prototype.readBigInt64LE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (r << 24);
        return (BigInt(n) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
      });
      A.prototype.readBigInt64BE = Se(function(e) {
        e = e >>> 0, He(e, "offset");
        let t = this[e], r = this[e + 7];
        (t === void 0 || r === void 0) && Tt(e, this.length - 8);
        let n = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
        return (BigInt(n) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r);
      });
      A.prototype.readFloatLE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), We.read(this, e, true, 23, 4);
      };
      A.prototype.readFloatBE = function(e, t) {
        return e = e >>> 0, t || W(e, 4, this.length), We.read(this, e, false, 23, 4);
      };
      A.prototype.readDoubleLE = function(e, t) {
        return e = e >>> 0, t || W(e, 8, this.length), We.read(this, e, true, 52, 8);
      };
      A.prototype.readDoubleBE = function(e, t) {
        return e = e >>> 0, t || W(e, 8, this.length), We.read(this, e, false, 52, 8);
      };
      function re(e, t, r, n, i, o) {
        if (!A.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
        if (r + n > e.length) throw new RangeError("Index out of range");
      }
      __name(re, "re");
      A.prototype.writeUintLE = A.prototype.writeUIntLE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, r = r >>> 0, !n) {
          let s = Math.pow(2, 8 * r) - 1;
          re(this, e, t, r, s, 0);
        }
        let i = 1, o = 0;
        for (this[t] = e & 255; ++o < r && (i *= 256); ) this[t + o] = e / i & 255;
        return t + r;
      };
      A.prototype.writeUintBE = A.prototype.writeUIntBE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, r = r >>> 0, !n) {
          let s = Math.pow(2, 8 * r) - 1;
          re(this, e, t, r, s, 0);
        }
        let i = r - 1, o = 1;
        for (this[t + i] = e & 255; --i >= 0 && (o *= 256); ) this[t + i] = e / o & 255;
        return t + r;
      };
      A.prototype.writeUint8 = A.prototype.writeUInt8 = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
      };
      A.prototype.writeUint16LE = A.prototype.writeUInt16LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      };
      A.prototype.writeUint16BE = A.prototype.writeUInt16BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      };
      A.prototype.writeUint32LE = A.prototype.writeUInt32LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
      };
      A.prototype.writeUint32BE = A.prototype.writeUInt32BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      };
      function Pi(e, t, r, n, i) {
        Ci(t, n, i, e, r, 7);
        let o = Number(t & BigInt(4294967295));
        e[r++] = o, o = o >> 8, e[r++] = o, o = o >> 8, e[r++] = o, o = o >> 8, e[r++] = o;
        let s = Number(t >> BigInt(32) & BigInt(4294967295));
        return e[r++] = s, s = s >> 8, e[r++] = s, s = s >> 8, e[r++] = s, s = s >> 8, e[r++] = s, r;
      }
      __name(Pi, "Pi");
      function vi(e, t, r, n, i) {
        Ci(t, n, i, e, r, 7);
        let o = Number(t & BigInt(4294967295));
        e[r + 7] = o, o = o >> 8, e[r + 6] = o, o = o >> 8, e[r + 5] = o, o = o >> 8, e[r + 4] = o;
        let s = Number(t >> BigInt(32) & BigInt(4294967295));
        return e[r + 3] = s, s = s >> 8, e[r + 2] = s, s = s >> 8, e[r + 1] = s, s = s >> 8, e[r] = s, r + 8;
      }
      __name(vi, "vi");
      A.prototype.writeBigUInt64LE = Se(function(e, t = 0) {
        return Pi(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      A.prototype.writeBigUInt64BE = Se(function(e, t = 0) {
        return vi(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      A.prototype.writeIntLE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, !n) {
          let a = Math.pow(2, 8 * r - 1);
          re(this, e, t, r, a - 1, -a);
        }
        let i = 0, o = 1, s = 0;
        for (this[t] = e & 255; ++i < r && (o *= 256); ) e < 0 && s === 0 && this[t + i - 1] !== 0 && (s = 1), this[t + i] = (e / o >> 0) - s & 255;
        return t + r;
      };
      A.prototype.writeIntBE = function(e, t, r, n) {
        if (e = +e, t = t >>> 0, !n) {
          let a = Math.pow(2, 8 * r - 1);
          re(this, e, t, r, a - 1, -a);
        }
        let i = r - 1, o = 1, s = 0;
        for (this[t + i] = e & 255; --i >= 0 && (o *= 256); ) e < 0 && s === 0 && this[t + i + 1] !== 0 && (s = 1), this[t + i] = (e / o >> 0) - s & 255;
        return t + r;
      };
      A.prototype.writeInt8 = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
      };
      A.prototype.writeInt16LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
      };
      A.prototype.writeInt16BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
      };
      A.prototype.writeInt32LE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
      };
      A.prototype.writeInt32BE = function(e, t, r) {
        return e = +e, t = t >>> 0, r || re(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
      };
      A.prototype.writeBigInt64LE = Se(function(e, t = 0) {
        return Pi(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      A.prototype.writeBigInt64BE = Se(function(e, t = 0) {
        return vi(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function Ti(e, t, r, n, i, o) {
        if (r + n > e.length) throw new RangeError("Index out of range");
        if (r < 0) throw new RangeError("Index out of range");
      }
      __name(Ti, "Ti");
      function Ai(e, t, r, n, i) {
        return t = +t, r = r >>> 0, i || Ti(e, t, r, 4, 34028234663852886e22, -34028234663852886e22), We.write(e, t, r, n, 23, 4), r + 4;
      }
      __name(Ai, "Ai");
      A.prototype.writeFloatLE = function(e, t, r) {
        return Ai(this, e, t, true, r);
      };
      A.prototype.writeFloatBE = function(e, t, r) {
        return Ai(this, e, t, false, r);
      };
      function Ri(e, t, r, n, i) {
        return t = +t, r = r >>> 0, i || Ti(e, t, r, 8, 17976931348623157e292, -17976931348623157e292), We.write(e, t, r, n, 52, 8), r + 8;
      }
      __name(Ri, "Ri");
      A.prototype.writeDoubleLE = function(e, t, r) {
        return Ri(this, e, t, true, r);
      };
      A.prototype.writeDoubleBE = function(e, t, r) {
        return Ri(this, e, t, false, r);
      };
      A.prototype.copy = function(e, t, r, n) {
        if (!A.isBuffer(e)) throw new TypeError("argument should be a Buffer");
        if (r || (r = 0), !n && n !== 0 && (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r || e.length === 0 || this.length === 0) return 0;
        if (t < 0) throw new RangeError("targetStart out of bounds");
        if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
        if (n < 0) throw new RangeError("sourceEnd out of bounds");
        n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
        let i = n - r;
        return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, r, n) : Uint8Array.prototype.set.call(e, this.subarray(r, n), t), i;
      };
      A.prototype.fill = function(e, t, r, n) {
        if (typeof e == "string") {
          if (typeof t == "string" ? (n = t, t = 0, r = this.length) : typeof r == "string" && (n = r, r = this.length), n !== void 0 && typeof n != "string") throw new TypeError("encoding must be a string");
          if (typeof n == "string" && !A.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
          if (e.length === 1) {
            let o = e.charCodeAt(0);
            (n === "utf8" && o < 128 || n === "latin1") && (e = o);
          }
        } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
        if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
        if (r <= t) return this;
        t = t >>> 0, r = r === void 0 ? this.length : r >>> 0, e || (e = 0);
        let i;
        if (typeof e == "number") for (i = t; i < r; ++i) this[i] = e;
        else {
          let o = A.isBuffer(e) ? e : A.from(e, n), s = o.length;
          if (s === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
          for (i = 0; i < r - t; ++i) this[i + t] = o[i % s];
        }
        return this;
      };
      var Ke = {};
      function dn(e, t, r) {
        Ke[e] = class extends r {
          constructor() {
            super(), Object.defineProperty(this, "message", { value: t.apply(this, arguments), writable: true, configurable: true }), this.name = `${this.name} [${e}]`, this.stack, delete this.name;
          }
          get code() {
            return e;
          }
          set code(n) {
            Object.defineProperty(this, "code", { configurable: true, enumerable: true, value: n, writable: true });
          }
          toString() {
            return `${this.name} [${e}]: ${this.message}`;
          }
        };
      }
      __name(dn, "dn");
      dn("ERR_BUFFER_OUT_OF_BOUNDS", function(e) {
        return e ? `${e} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      }, RangeError);
      dn("ERR_INVALID_ARG_TYPE", function(e, t) {
        return `The "${e}" argument must be of type number. Received type ${typeof t}`;
      }, TypeError);
      dn("ERR_OUT_OF_RANGE", function(e, t, r) {
        let n = `The value of "${e}" is out of range.`, i = r;
        return Number.isInteger(r) && Math.abs(r) > 2 ** 32 ? i = di(String(r)) : typeof r == "bigint" && (i = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (i = di(i)), i += "n"), n += ` It must be ${t}. Received ${i}`, n;
      }, RangeError);
      function di(e) {
        let t = "", r = e.length, n = e[0] === "-" ? 1 : 0;
        for (; r >= n + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
        return `${e.slice(0, r)}${t}`;
      }
      __name(di, "di");
      function Qa(e, t, r) {
        He(t, "offset"), (e[t] === void 0 || e[t + r] === void 0) && Tt(t, e.length - (r + 1));
      }
      __name(Qa, "Qa");
      function Ci(e, t, r, n, i, o) {
        if (e > r || e < t) {
          let s = typeof t == "bigint" ? "n" : "", a;
          throw o > 3 ? t === 0 || t === BigInt(0) ? a = `>= 0${s} and < 2${s} ** ${(o + 1) * 8}${s}` : a = `>= -(2${s} ** ${(o + 1) * 8 - 1}${s}) and < 2 ** ${(o + 1) * 8 - 1}${s}` : a = `>= ${t}${s} and <= ${r}${s}`, new Ke.ERR_OUT_OF_RANGE("value", a, e);
        }
        Qa(n, i, o);
      }
      __name(Ci, "Ci");
      function He(e, t) {
        if (typeof e != "number") throw new Ke.ERR_INVALID_ARG_TYPE(t, "number", e);
      }
      __name(He, "He");
      function Tt(e, t, r) {
        throw Math.floor(e) !== e ? (He(e, r), new Ke.ERR_OUT_OF_RANGE(r || "offset", "an integer", e)) : t < 0 ? new Ke.ERR_BUFFER_OUT_OF_BOUNDS() : new Ke.ERR_OUT_OF_RANGE(r || "offset", `>= ${r ? 1 : 0} and <= ${t}`, e);
      }
      __name(Tt, "Tt");
      var Ka = /[^+/0-9A-Za-z-_]/g;
      function Wa(e) {
        if (e = e.split("=")[0], e = e.trim().replace(Ka, ""), e.length < 2) return "";
        for (; e.length % 4 !== 0; ) e = e + "=";
        return e;
      }
      __name(Wa, "Wa");
      function pn(e, t) {
        t = t || 1 / 0;
        let r, n = e.length, i = null, o = [];
        for (let s = 0; s < n; ++s) {
          if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
            if (!i) {
              if (r > 56319) {
                (t -= 3) > -1 && o.push(239, 191, 189);
                continue;
              } else if (s + 1 === n) {
                (t -= 3) > -1 && o.push(239, 191, 189);
                continue;
              }
              i = r;
              continue;
            }
            if (r < 56320) {
              (t -= 3) > -1 && o.push(239, 191, 189), i = r;
              continue;
            }
            r = (i - 55296 << 10 | r - 56320) + 65536;
          } else i && (t -= 3) > -1 && o.push(239, 191, 189);
          if (i = null, r < 128) {
            if ((t -= 1) < 0) break;
            o.push(r);
          } else if (r < 2048) {
            if ((t -= 2) < 0) break;
            o.push(r >> 6 | 192, r & 63 | 128);
          } else if (r < 65536) {
            if ((t -= 3) < 0) break;
            o.push(r >> 12 | 224, r >> 6 & 63 | 128, r & 63 | 128);
          } else if (r < 1114112) {
            if ((t -= 4) < 0) break;
            o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, r & 63 | 128);
          } else throw new Error("Invalid code point");
        }
        return o;
      }
      __name(pn, "pn");
      function Ha(e) {
        let t = [];
        for (let r = 0; r < e.length; ++r) t.push(e.charCodeAt(r) & 255);
        return t;
      }
      __name(Ha, "Ha");
      function za(e, t) {
        let r, n, i, o = [];
        for (let s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
        return o;
      }
      __name(za, "za");
      function Si(e) {
        return un.toByteArray(Wa(e));
      }
      __name(Si, "Si");
      function cr(e, t, r, n) {
        let i;
        for (i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
        return i;
      }
      __name(cr, "cr");
      function de(e, t) {
        return e instanceof t || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === t.name;
      }
      __name(de, "de");
      function gn(e) {
        return e !== e;
      }
      __name(gn, "gn");
      var Ya = function() {
        let e = "0123456789abcdef", t = new Array(256);
        for (let r = 0; r < 16; ++r) {
          let n = r * 16;
          for (let i = 0; i < 16; ++i) t[n + i] = e[r] + e[i];
        }
        return t;
      }();
      function Se(e) {
        return typeof BigInt > "u" ? Za : e;
      }
      __name(Se, "Se");
      function Za() {
        throw new Error("BigInt not supported");
      }
      __name(Za, "Za");
    });
    var w2;
    var f2 = fe(() => {
      "use strict";
      w2 = Qe(Ii());
    });
    function il() {
      return false;
    }
    __name(il, "il");
    function bn() {
      return { dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0, atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0, atime: /* @__PURE__ */ new Date(), mtime: /* @__PURE__ */ new Date(), ctime: /* @__PURE__ */ new Date(), birthtime: /* @__PURE__ */ new Date() };
    }
    __name(bn, "bn");
    function ol() {
      return bn();
    }
    __name(ol, "ol");
    function sl() {
      return [];
    }
    __name(sl, "sl");
    function al(e) {
      e(null, []);
    }
    __name(al, "al");
    function ll() {
      return "";
    }
    __name(ll, "ll");
    function ul() {
      return "";
    }
    __name(ul, "ul");
    function cl() {
    }
    __name(cl, "cl");
    function pl() {
    }
    __name(pl, "pl");
    function ml() {
    }
    __name(ml, "ml");
    function fl() {
    }
    __name(fl, "fl");
    function dl() {
    }
    __name(dl, "dl");
    function gl() {
    }
    __name(gl, "gl");
    function hl() {
    }
    __name(hl, "hl");
    function yl() {
    }
    __name(yl, "yl");
    function wl() {
      return { close: /* @__PURE__ */ __name(() => {
      }, "close"), on: /* @__PURE__ */ __name(() => {
      }, "on"), removeAllListeners: /* @__PURE__ */ __name(() => {
      }, "removeAllListeners") };
    }
    __name(wl, "wl");
    function El(e, t) {
      t(null, bn());
    }
    __name(El, "El");
    var bl;
    var xl;
    var Qi;
    var Ki = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      bl = {}, xl = { existsSync: il, lstatSync: bn, stat: El, statSync: ol, readdirSync: sl, readdir: al, readlinkSync: ll, realpathSync: ul, chmodSync: cl, renameSync: pl, mkdirSync: ml, rmdirSync: fl, rmSync: dl, unlinkSync: gl, watchFile: hl, unwatchFile: yl, watch: wl, promises: bl }, Qi = xl;
    });
    var Wi = Je((df, Pl) => {
      Pl.exports = { name: "@prisma/internals", version: "6.18.0", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.5.0", empathic: "2.0.0", "escape-string-regexp": "5.0.0", execa: "8.0.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "global-directory": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", "@prisma/schema-engine-wasm": "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
    });
    function Tl(...e) {
      return e.join("/");
    }
    __name(Tl, "Tl");
    function Al(...e) {
      return e.join("/");
    }
    __name(Al, "Al");
    function Rl(e) {
      let t = Hi(e), r = zi(e), [n, i] = t.split(".");
      return { root: "/", dir: r, base: t, ext: i, name: n };
    }
    __name(Rl, "Rl");
    function Hi(e) {
      let t = e.split("/");
      return t[t.length - 1];
    }
    __name(Hi, "Hi");
    function zi(e) {
      return e.split("/").slice(0, -1).join("/");
    }
    __name(zi, "zi");
    function Sl(e) {
      let t = e.split("/").filter((i) => i !== "" && i !== "."), r = [];
      for (let i of t) i === ".." ? r.pop() : r.push(i);
      let n = r.join("/");
      return e.startsWith("/") ? "/" + n : n;
    }
    __name(Sl, "Sl");
    var Yi;
    var Cl;
    var Il;
    var Ol;
    var dr;
    var Zi = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      Yi = "/", Cl = ":";
      Il = { sep: Yi }, Ol = { basename: Hi, delimiter: Cl, dirname: zi, join: Al, normalize: Sl, parse: Rl, posix: Il, resolve: Tl, sep: Yi }, dr = Ol;
    });
    var Pn = Je((Mf, Ml) => {
      Ml.exports = { name: "@prisma/engines-version", version: "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "34b5a692b7bd79939a9a2c3ef97d816e749cda2f" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var Xi = Je((gr) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      Object.defineProperty(gr, "__esModule", { value: true });
      gr.enginesVersion = void 0;
      gr.enginesVersion = Pn().prisma.enginesVersion;
    });
    var ro = Je((Qf, to) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      to.exports = (e, t = 1, r) => {
        if (r = { indent: " ", includeEmptyLines: false, ...r }, typeof e != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
        if (typeof t != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t}\``);
        if (typeof r.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
        if (t === 0) return e;
        let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return e.replace(n, r.indent.repeat(t));
      };
    });
    var Nn = Je((Jy, vo) => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      vo.exports = /* @__PURE__ */ function() {
        function e(t, r, n, i, o) {
          return t < r || n < r ? t > n ? n + 1 : t + 1 : i === o ? r : r + 1;
        }
        __name(e, "e");
        return function(t, r) {
          if (t === r) return 0;
          if (t.length > r.length) {
            var n = t;
            t = r, r = n;
          }
          for (var i = t.length, o = r.length; i > 0 && t.charCodeAt(i - 1) === r.charCodeAt(o - 1); ) i--, o--;
          for (var s = 0; s < i && t.charCodeAt(s) === r.charCodeAt(s); ) s++;
          if (i -= s, o -= s, i === 0 || o < 3) return o;
          var a = 0, l2, d, g, h, T2, I, S2, C, M, F2, B, O, L = [];
          for (l2 = 0; l2 < i; l2++) L.push(l2 + 1), L.push(t.charCodeAt(s + l2));
          for (var le = L.length - 1; a < o - 3; ) for (M = r.charCodeAt(s + (d = a)), F2 = r.charCodeAt(s + (g = a + 1)), B = r.charCodeAt(s + (h = a + 2)), O = r.charCodeAt(s + (T2 = a + 3)), I = a += 4, l2 = 0; l2 < le; l2 += 2) S2 = L[l2], C = L[l2 + 1], d = e(S2, d, g, M, C), g = e(d, g, h, F2, C), h = e(g, h, T2, B, C), I = e(h, T2, I, O, C), L[l2] = I, T2 = h, h = g, g = d, d = S2;
          for (; a < o; ) for (M = r.charCodeAt(s + (d = a)), I = ++a, l2 = 0; l2 < le; l2 += 2) S2 = L[l2], L[l2] = I = e(S2, d, I, M, L[l2 + 1]), d = S2;
          return I;
        };
      }();
    });
    var So = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
    });
    var Io = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
    });
    var Jr;
    var Xo = fe(() => {
      "use strict";
      f2();
      u();
      c();
      p2();
      m();
      Jr = class {
        static {
          __name(this, "Jr");
        }
        events = {};
        on(t, r) {
          return this.events[t] || (this.events[t] = []), this.events[t].push(r), this;
        }
        emit(t, ...r) {
          return this.events[t] ? (this.events[t].forEach((n) => {
            n(...r);
          }), true) : false;
        }
      };
    });
    var kp = {};
    vt(kp, { DMMF: /* @__PURE__ */ __name(() => Dt, "DMMF"), Debug: /* @__PURE__ */ __name(() => z, "Debug"), Decimal: /* @__PURE__ */ __name(() => Ae, "Decimal"), Extensions: /* @__PURE__ */ __name(() => hn, "Extensions"), MetricsClient: /* @__PURE__ */ __name(() => pt, "MetricsClient"), PrismaClientInitializationError: /* @__PURE__ */ __name(() => Q, "PrismaClientInitializationError"), PrismaClientKnownRequestError: /* @__PURE__ */ __name(() => ne, "PrismaClientKnownRequestError"), PrismaClientRustPanicError: /* @__PURE__ */ __name(() => Pe, "PrismaClientRustPanicError"), PrismaClientUnknownRequestError: /* @__PURE__ */ __name(() => ie, "PrismaClientUnknownRequestError"), PrismaClientValidationError: /* @__PURE__ */ __name(() => X, "PrismaClientValidationError"), Public: /* @__PURE__ */ __name(() => yn, "Public"), Sql: /* @__PURE__ */ __name(() => se, "Sql"), createParam: /* @__PURE__ */ __name(() => Jo, "createParam"), defineDmmfProperty: /* @__PURE__ */ __name(() => Yo, "defineDmmfProperty"), deserializeJsonResponse: /* @__PURE__ */ __name(() => dt, "deserializeJsonResponse"), deserializeRawResult: /* @__PURE__ */ __name(() => nn, "deserializeRawResult"), dmmfToRuntimeDataModel: /* @__PURE__ */ __name(() => ao, "dmmfToRuntimeDataModel"), empty: /* @__PURE__ */ __name(() => ts, "empty"), getPrismaClient: /* @__PURE__ */ __name(() => ya, "getPrismaClient"), getRuntime: /* @__PURE__ */ __name(() => Zr, "getRuntime"), join: /* @__PURE__ */ __name(() => es, "join"), makeStrictEnum: /* @__PURE__ */ __name(() => wa, "makeStrictEnum"), makeTypedQueryFactory: /* @__PURE__ */ __name(() => Zo, "makeTypedQueryFactory"), objectEnumValues: /* @__PURE__ */ __name(() => Nr, "objectEnumValues"), raw: /* @__PURE__ */ __name(() => Gn, "raw"), serializeJsonQuery: /* @__PURE__ */ __name(() => $r, "serializeJsonQuery"), skip: /* @__PURE__ */ __name(() => Vr, "skip"), sqltag: /* @__PURE__ */ __name(() => Jn, "sqltag"), warnEnvConflicts: /* @__PURE__ */ __name(() => void 0, "warnEnvConflicts"), warnOnce: /* @__PURE__ */ __name(() => St, "warnOnce") });
    module.exports = Aa(kp);
    f2();
    u();
    c();
    p2();
    m();
    var hn = {};
    vt(hn, { defineExtension: /* @__PURE__ */ __name(() => Oi, "defineExtension"), getExtensionContext: /* @__PURE__ */ __name(() => ki, "getExtensionContext") });
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Oi(e) {
      return typeof e == "function" ? e : (t) => t.$extends(e);
    }
    __name(Oi, "Oi");
    f2();
    u();
    c();
    p2();
    m();
    function ki(e) {
      return e;
    }
    __name(ki, "ki");
    var yn = {};
    vt(yn, { validator: /* @__PURE__ */ __name(() => Di, "validator") });
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Di(...e) {
      return (t) => t;
    }
    __name(Di, "Di");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var wn;
    var Mi;
    var _i;
    var Ni;
    var Fi = true;
    typeof y < "u" && ({ FORCE_COLOR: wn, NODE_DISABLE_COLORS: Mi, NO_COLOR: _i, TERM: Ni } = y.env || {}, Fi = y.stdout && y.stdout.isTTY);
    var Xa = { enabled: !Mi && _i == null && Ni !== "dumb" && (wn != null && wn !== "0" || Fi) };
    function j(e, t) {
      let r = new RegExp(`\\x1b\\[${t}m`, "g"), n = `\x1B[${e}m`, i = `\x1B[${t}m`;
      return function(o) {
        return !Xa.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
      };
    }
    __name(j, "j");
    var Pm = j(0, 0);
    var pr = j(1, 22);
    var mr = j(2, 22);
    var vm = j(3, 23);
    var Li = j(4, 24);
    var Tm = j(7, 27);
    var Am = j(8, 28);
    var Rm = j(9, 29);
    var Cm = j(30, 39);
    var Ye = j(31, 39);
    var Ui = j(32, 39);
    var Bi = j(33, 39);
    var qi = j(34, 39);
    var Sm = j(35, 39);
    var Vi = j(36, 39);
    var Im = j(37, 39);
    var $i = j(90, 39);
    var Om = j(90, 39);
    var km = j(40, 49);
    var Dm = j(41, 49);
    var Mm = j(42, 49);
    var _m = j(43, 49);
    var Nm = j(44, 49);
    var Fm = j(45, 49);
    var Lm = j(46, 49);
    var Um = j(47, 49);
    f2();
    u();
    c();
    p2();
    m();
    var el = 100;
    var ji = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var fr = [];
    var Gi = Date.now();
    var tl = 0;
    var En = typeof y < "u" ? y.env : {};
    globalThis.DEBUG ??= En.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= En.DEBUG_COLORS ? En.DEBUG_COLORS === "true" : true;
    var At = { enable(e) {
      typeof e == "string" && (globalThis.DEBUG = e);
    }, disable() {
      let e = globalThis.DEBUG;
      return globalThis.DEBUG = "", e;
    }, enabled(e) {
      let t = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r = t.some((i) => i === "" || i[0] === "-" ? false : e.match(RegExp(i.split("*").join(".*") + "$"))), n = t.some((i) => i === "" || i[0] !== "-" ? false : e.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
      return r && !n;
    }, log: /* @__PURE__ */ __name((...e) => {
      let [t, r, ...n] = e;
      (console.warn ?? console.log)(`${t} ${r}`, ...n);
    }, "log"), formatters: {} };
    function rl(e) {
      let t = { color: ji[tl++ % ji.length], enabled: At.enabled(e), namespace: e, log: At.log, extend: /* @__PURE__ */ __name(() => {
      }, "extend") }, r = /* @__PURE__ */ __name((...n) => {
        let { enabled: i, namespace: o, color: s, log: a } = t;
        if (n.length !== 0 && fr.push([o, ...n]), fr.length > el && fr.shift(), At.enabled(o) || i) {
          let l2 = n.map((g) => typeof g == "string" ? g : nl(g)), d = `+${Date.now() - Gi}ms`;
          Gi = Date.now(), a(o, ...l2, d);
        }
      }, "r");
      return new Proxy(r, { get: /* @__PURE__ */ __name((n, i) => t[i], "get"), set: /* @__PURE__ */ __name((n, i, o) => t[i] = o, "set") });
    }
    __name(rl, "rl");
    var z = new Proxy(rl, { get: /* @__PURE__ */ __name((e, t) => At[t], "get"), set: /* @__PURE__ */ __name((e, t, r) => At[t] = r, "set") });
    function nl(e, t = 2) {
      let r = /* @__PURE__ */ new Set();
      return JSON.stringify(e, (n, i) => {
        if (typeof i == "object" && i !== null) {
          if (r.has(i)) return "[Circular *]";
          r.add(i);
        } else if (typeof i == "bigint") return i.toString();
        return i;
      }, t);
    }
    __name(nl, "nl");
    function Ji() {
      fr.length = 0;
    }
    __name(Ji, "Ji");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var vl = Wi();
    var xn = vl.version;
    f2();
    u();
    c();
    p2();
    m();
    function Ze(e) {
      let t = kl();
      return t || (e?.config.engineType === "library" ? "library" : e?.config.engineType === "binary" ? "binary" : e?.config.engineType === "client" ? "client" : Dl());
    }
    __name(Ze, "Ze");
    function kl() {
      let e = y.env.PRISMA_CLIENT_ENGINE_TYPE;
      return e === "library" ? "library" : e === "binary" ? "binary" : e === "client" ? "client" : void 0;
    }
    __name(kl, "kl");
    function Dl() {
      return "library";
    }
    __name(Dl, "Dl");
    f2();
    u();
    c();
    p2();
    m();
    var eo = "prisma+postgres";
    var hr = `${eo}:`;
    function yr(e) {
      return e?.toString().startsWith(`${hr}//`) ?? false;
    }
    __name(yr, "yr");
    function vn(e) {
      if (!yr(e)) return false;
      let { host: t } = new URL(e);
      return t.includes("localhost") || t.includes("127.0.0.1") || t.includes("[::1]");
    }
    __name(vn, "vn");
    var Ct = {};
    vt(Ct, { error: /* @__PURE__ */ __name(() => Fl, "error"), info: /* @__PURE__ */ __name(() => Nl, "info"), log: /* @__PURE__ */ __name(() => _l, "log"), query: /* @__PURE__ */ __name(() => Ll, "query"), should: /* @__PURE__ */ __name(() => no, "should"), tags: /* @__PURE__ */ __name(() => Rt, "tags"), warn: /* @__PURE__ */ __name(() => Tn, "warn") });
    f2();
    u();
    c();
    p2();
    m();
    var Rt = { error: Ye("prisma:error"), warn: Bi("prisma:warn"), info: Vi("prisma:info"), query: qi("prisma:query") };
    var no = { warn: /* @__PURE__ */ __name(() => !y.env.PRISMA_DISABLE_WARNINGS, "warn") };
    function _l(...e) {
      console.log(...e);
    }
    __name(_l, "_l");
    function Tn(e, ...t) {
      no.warn() && console.warn(`${Rt.warn} ${e}`, ...t);
    }
    __name(Tn, "Tn");
    function Nl(e, ...t) {
      console.info(`${Rt.info} ${e}`, ...t);
    }
    __name(Nl, "Nl");
    function Fl(e, ...t) {
      console.error(`${Rt.error} ${e}`, ...t);
    }
    __name(Fl, "Fl");
    function Ll(e, ...t) {
      console.log(`${Rt.query} ${e}`, ...t);
    }
    __name(Ll, "Ll");
    f2();
    u();
    c();
    p2();
    m();
    function Ue(e, t) {
      throw new Error(t);
    }
    __name(Ue, "Ue");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function An({ onlyFirst: e = false } = {}) {
      let r = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
      return new RegExp(r, e ? void 0 : "g");
    }
    __name(An, "An");
    var Ul = An();
    function Rn(e) {
      if (typeof e != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
      return e.replace(Ul, "");
    }
    __name(Rn, "Rn");
    f2();
    u();
    c();
    p2();
    m();
    function Cn(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }
    __name(Cn, "Cn");
    f2();
    u();
    c();
    p2();
    m();
    function wr(e, t) {
      let r = {};
      for (let n of Object.keys(e)) r[n] = t(e[n], n);
      return r;
    }
    __name(wr, "wr");
    f2();
    u();
    c();
    p2();
    m();
    function Sn(e, t) {
      if (e.length === 0) return;
      let r = e[0];
      for (let n = 1; n < e.length; n++) t(r, e[n]) < 0 && (r = e[n]);
      return r;
    }
    __name(Sn, "Sn");
    f2();
    u();
    c();
    p2();
    m();
    function N(e, t) {
      Object.defineProperty(e, "name", { value: t, configurable: true });
    }
    __name(N, "N");
    f2();
    u();
    c();
    p2();
    m();
    var io = /* @__PURE__ */ new Set();
    var St = /* @__PURE__ */ __name((e, t, ...r) => {
      io.has(e) || (io.add(e), Tn(t, ...r));
    }, "St");
    var Q = class e extends Error {
      static {
        __name(this, "e");
      }
      clientVersion;
      errorCode;
      retryable;
      constructor(t, r, n) {
        super(t), this.name = "PrismaClientInitializationError", this.clientVersion = r, this.errorCode = n, Error.captureStackTrace(e);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    N(Q, "PrismaClientInitializationError");
    f2();
    u();
    c();
    p2();
    m();
    var ne = class extends Error {
      static {
        __name(this, "ne");
      }
      code;
      meta;
      clientVersion;
      batchRequestIdx;
      constructor(t, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
        super(t), this.name = "PrismaClientKnownRequestError", this.code = r, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    N(ne, "PrismaClientKnownRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var Pe = class extends Error {
      static {
        __name(this, "Pe");
      }
      clientVersion;
      constructor(t, r) {
        super(t), this.name = "PrismaClientRustPanicError", this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    N(Pe, "PrismaClientRustPanicError");
    f2();
    u();
    c();
    p2();
    m();
    var ie = class extends Error {
      static {
        __name(this, "ie");
      }
      clientVersion;
      batchRequestIdx;
      constructor(t, { clientVersion: r, batchRequestIdx: n }) {
        super(t), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    N(ie, "PrismaClientUnknownRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var X = class extends Error {
      static {
        __name(this, "X");
      }
      name = "PrismaClientValidationError";
      clientVersion;
      constructor(t, { clientVersion: r }) {
        super(t), this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    N(X, "PrismaClientValidationError");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var ge = class {
      static {
        __name(this, "ge");
      }
      _map = /* @__PURE__ */ new Map();
      get(t) {
        return this._map.get(t)?.value;
      }
      set(t, r) {
        this._map.set(t, { value: r });
      }
      getOrCreate(t, r) {
        let n = this._map.get(t);
        if (n) return n.value;
        let i = r();
        return this.set(t, i), i;
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function Ie(e) {
      return e.substring(0, 1).toLowerCase() + e.substring(1);
    }
    __name(Ie, "Ie");
    f2();
    u();
    c();
    p2();
    m();
    function so(e, t) {
      let r = {};
      for (let n of e) {
        let i = n[t];
        r[i] = n;
      }
      return r;
    }
    __name(so, "so");
    f2();
    u();
    c();
    p2();
    m();
    function It(e) {
      let t;
      return { get() {
        return t || (t = { value: e() }), t.value;
      } };
    }
    __name(It, "It");
    f2();
    u();
    c();
    p2();
    m();
    function ao(e) {
      return { models: In(e.models), enums: In(e.enums), types: In(e.types) };
    }
    __name(ao, "ao");
    function In(e) {
      let t = {};
      for (let { name: r, ...n } of e) t[r] = n;
      return t;
    }
    __name(In, "In");
    f2();
    u();
    c();
    p2();
    m();
    function Xe(e) {
      return e instanceof Date || Object.prototype.toString.call(e) === "[object Date]";
    }
    __name(Xe, "Xe");
    function Er(e) {
      return e.toString() !== "Invalid Date";
    }
    __name(Er, "Er");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var et = 9e15;
    var Me = 1e9;
    var On = "0123456789abcdef";
    var Pr = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
    var vr = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
    var kn = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -et, maxE: et, crypto: false };
    var po;
    var ve;
    var _ = true;
    var Ar = "[DecimalError] ";
    var De = Ar + "Invalid argument: ";
    var mo = Ar + "Precision limit exceeded";
    var fo = Ar + "crypto unavailable";
    var go = "[object Decimal]";
    var ee = Math.floor;
    var K = Math.pow;
    var Bl = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
    var ql = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
    var Vl = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
    var ho = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    var pe = 1e7;
    var D = 7;
    var $l = 9007199254740991;
    var jl = Pr.length - 1;
    var Dn = vr.length - 1;
    var R = { toStringTag: go };
    R.absoluteValue = R.abs = function() {
      var e = new this.constructor(this);
      return e.s < 0 && (e.s = 1), k2(e);
    };
    R.ceil = function() {
      return k2(new this.constructor(this), this.e + 1, 2);
    };
    R.clampedTo = R.clamp = function(e, t) {
      var r, n = this, i = n.constructor;
      if (e = new i(e), t = new i(t), !e.s || !t.s) return new i(NaN);
      if (e.gt(t)) throw Error(De + t);
      return r = n.cmp(e), r < 0 ? e : n.cmp(t) > 0 ? t : new i(n);
    };
    R.comparedTo = R.cmp = function(e) {
      var t, r, n, i, o = this, s = o.d, a = (e = new o.constructor(e)).d, l2 = o.s, d = e.s;
      if (!s || !a) return !l2 || !d ? NaN : l2 !== d ? l2 : s === a ? 0 : !s ^ l2 < 0 ? 1 : -1;
      if (!s[0] || !a[0]) return s[0] ? l2 : a[0] ? -d : 0;
      if (l2 !== d) return l2;
      if (o.e !== e.e) return o.e > e.e ^ l2 < 0 ? 1 : -1;
      for (n = s.length, i = a.length, t = 0, r = n < i ? n : i; t < r; ++t) if (s[t] !== a[t]) return s[t] > a[t] ^ l2 < 0 ? 1 : -1;
      return n === i ? 0 : n > i ^ l2 < 0 ? 1 : -1;
    };
    R.cosine = R.cos = function() {
      var e, t, r = this, n = r.constructor;
      return r.d ? r.d[0] ? (e = n.precision, t = n.rounding, n.precision = e + Math.max(r.e, r.sd()) + D, n.rounding = 1, r = Gl(n, xo(n, r)), n.precision = e, n.rounding = t, k2(ve == 2 || ve == 3 ? r.neg() : r, e, t, true)) : new n(1) : new n(NaN);
    };
    R.cubeRoot = R.cbrt = function() {
      var e, t, r, n, i, o, s, a, l2, d, g = this, h = g.constructor;
      if (!g.isFinite() || g.isZero()) return new h(g);
      for (_ = false, o = g.s * K(g.s * g, 1 / 3), !o || Math.abs(o) == 1 / 0 ? (r = Y(g.d), e = g.e, (o = (e - r.length + 1) % 3) && (r += o == 1 || o == -2 ? "0" : "00"), o = K(r, 1 / 3), e = ee((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), o == 1 / 0 ? r = "5e" + e : (r = o.toExponential(), r = r.slice(0, r.indexOf("e") + 1) + e), n = new h(r), n.s = g.s) : n = new h(o.toString()), s = (e = h.precision) + 3; ; ) if (a = n, l2 = a.times(a).times(a), d = l2.plus(g), n = V(d.plus(g).times(a), d.plus(l2), s + 2, 1), Y(a.d).slice(0, s) === (r = Y(n.d)).slice(0, s)) if (r = r.slice(s - 3, s + 1), r == "9999" || !i && r == "4999") {
        if (!i && (k2(a, e + 1, 0), a.times(a).times(a).eq(g))) {
          n = a;
          break;
        }
        s += 4, i = 1;
      } else {
        (!+r || !+r.slice(1) && r.charAt(0) == "5") && (k2(n, e + 1, 1), t = !n.times(n).times(n).eq(g));
        break;
      }
      return _ = true, k2(n, e, h.rounding, t);
    };
    R.decimalPlaces = R.dp = function() {
      var e, t = this.d, r = NaN;
      if (t) {
        if (e = t.length - 1, r = (e - ee(this.e / D)) * D, e = t[e], e) for (; e % 10 == 0; e /= 10) r--;
        r < 0 && (r = 0);
      }
      return r;
    };
    R.dividedBy = R.div = function(e) {
      return V(this, new this.constructor(e));
    };
    R.dividedToIntegerBy = R.divToInt = function(e) {
      var t = this, r = t.constructor;
      return k2(V(t, new r(e), 0, 1, 1), r.precision, r.rounding);
    };
    R.equals = R.eq = function(e) {
      return this.cmp(e) === 0;
    };
    R.floor = function() {
      return k2(new this.constructor(this), this.e + 1, 3);
    };
    R.greaterThan = R.gt = function(e) {
      return this.cmp(e) > 0;
    };
    R.greaterThanOrEqualTo = R.gte = function(e) {
      var t = this.cmp(e);
      return t == 1 || t === 0;
    };
    R.hyperbolicCosine = R.cosh = function() {
      var e, t, r, n, i, o = this, s = o.constructor, a = new s(1);
      if (!o.isFinite()) return new s(o.s ? 1 / 0 : NaN);
      if (o.isZero()) return a;
      r = s.precision, n = s.rounding, s.precision = r + Math.max(o.e, o.sd()) + 4, s.rounding = 1, i = o.d.length, i < 32 ? (e = Math.ceil(i / 3), t = (1 / Cr(4, e)).toString()) : (e = 16, t = "2.3283064365386962890625e-10"), o = tt(s, 1, o.times(t), new s(1), true);
      for (var l2, d = e, g = new s(8); d--; ) l2 = o.times(o), o = a.minus(l2.times(g.minus(l2.times(g))));
      return k2(o, s.precision = r, s.rounding = n, true);
    };
    R.hyperbolicSine = R.sinh = function() {
      var e, t, r, n, i = this, o = i.constructor;
      if (!i.isFinite() || i.isZero()) return new o(i);
      if (t = o.precision, r = o.rounding, o.precision = t + Math.max(i.e, i.sd()) + 4, o.rounding = 1, n = i.d.length, n < 3) i = tt(o, 2, i, i, true);
      else {
        e = 1.4 * Math.sqrt(n), e = e > 16 ? 16 : e | 0, i = i.times(1 / Cr(5, e)), i = tt(o, 2, i, i, true);
        for (var s, a = new o(5), l2 = new o(16), d = new o(20); e--; ) s = i.times(i), i = i.times(a.plus(s.times(l2.times(s).plus(d))));
      }
      return o.precision = t, o.rounding = r, k2(i, t, r, true);
    };
    R.hyperbolicTangent = R.tanh = function() {
      var e, t, r = this, n = r.constructor;
      return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 7, n.rounding = 1, V(r.sinh(), r.cosh(), n.precision = e, n.rounding = t)) : new n(r.s);
    };
    R.inverseCosine = R.acos = function() {
      var e = this, t = e.constructor, r = e.abs().cmp(1), n = t.precision, i = t.rounding;
      return r !== -1 ? r === 0 ? e.isNeg() ? he(t, n, i) : new t(0) : new t(NaN) : e.isZero() ? he(t, n + 4, i).times(0.5) : (t.precision = n + 6, t.rounding = 1, e = new t(1).minus(e).div(e.plus(1)).sqrt().atan(), t.precision = n, t.rounding = i, e.times(2));
    };
    R.inverseHyperbolicCosine = R.acosh = function() {
      var e, t, r = this, n = r.constructor;
      return r.lte(1) ? new n(r.eq(1) ? 0 : NaN) : r.isFinite() ? (e = n.precision, t = n.rounding, n.precision = e + Math.max(Math.abs(r.e), r.sd()) + 4, n.rounding = 1, _ = false, r = r.times(r).minus(1).sqrt().plus(r), _ = true, n.precision = e, n.rounding = t, r.ln()) : new n(r);
    };
    R.inverseHyperbolicSine = R.asinh = function() {
      var e, t, r = this, n = r.constructor;
      return !r.isFinite() || r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 2 * Math.max(Math.abs(r.e), r.sd()) + 6, n.rounding = 1, _ = false, r = r.times(r).plus(1).sqrt().plus(r), _ = true, n.precision = e, n.rounding = t, r.ln());
    };
    R.inverseHyperbolicTangent = R.atanh = function() {
      var e, t, r, n, i = this, o = i.constructor;
      return i.isFinite() ? i.e >= 0 ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN) : (e = o.precision, t = o.rounding, n = i.sd(), Math.max(n, e) < 2 * -i.e - 1 ? k2(new o(i), e, t, true) : (o.precision = r = n - i.e, i = V(i.plus(1), new o(1).minus(i), r + e, 1), o.precision = e + 4, o.rounding = 1, i = i.ln(), o.precision = e, o.rounding = t, i.times(0.5))) : new o(NaN);
    };
    R.inverseSine = R.asin = function() {
      var e, t, r, n, i = this, o = i.constructor;
      return i.isZero() ? new o(i) : (t = i.abs().cmp(1), r = o.precision, n = o.rounding, t !== -1 ? t === 0 ? (e = he(o, r + 4, n).times(0.5), e.s = i.s, e) : new o(NaN) : (o.precision = r + 6, o.rounding = 1, i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(), o.precision = r, o.rounding = n, i.times(2)));
    };
    R.inverseTangent = R.atan = function() {
      var e, t, r, n, i, o, s, a, l2, d = this, g = d.constructor, h = g.precision, T2 = g.rounding;
      if (d.isFinite()) {
        if (d.isZero()) return new g(d);
        if (d.abs().eq(1) && h + 4 <= Dn) return s = he(g, h + 4, T2).times(0.25), s.s = d.s, s;
      } else {
        if (!d.s) return new g(NaN);
        if (h + 4 <= Dn) return s = he(g, h + 4, T2).times(0.5), s.s = d.s, s;
      }
      for (g.precision = a = h + 10, g.rounding = 1, r = Math.min(28, a / D + 2 | 0), e = r; e; --e) d = d.div(d.times(d).plus(1).sqrt().plus(1));
      for (_ = false, t = Math.ceil(a / D), n = 1, l2 = d.times(d), s = new g(d), i = d; e !== -1; ) if (i = i.times(l2), o = s.minus(i.div(n += 2)), i = i.times(l2), s = o.plus(i.div(n += 2)), s.d[t] !== void 0) for (e = t; s.d[e] === o.d[e] && e--; ) ;
      return r && (s = s.times(2 << r - 1)), _ = true, k2(s, g.precision = h, g.rounding = T2, true);
    };
    R.isFinite = function() {
      return !!this.d;
    };
    R.isInteger = R.isInt = function() {
      return !!this.d && ee(this.e / D) > this.d.length - 2;
    };
    R.isNaN = function() {
      return !this.s;
    };
    R.isNegative = R.isNeg = function() {
      return this.s < 0;
    };
    R.isPositive = R.isPos = function() {
      return this.s > 0;
    };
    R.isZero = function() {
      return !!this.d && this.d[0] === 0;
    };
    R.lessThan = R.lt = function(e) {
      return this.cmp(e) < 0;
    };
    R.lessThanOrEqualTo = R.lte = function(e) {
      return this.cmp(e) < 1;
    };
    R.logarithm = R.log = function(e) {
      var t, r, n, i, o, s, a, l2, d = this, g = d.constructor, h = g.precision, T2 = g.rounding, I = 5;
      if (e == null) e = new g(10), t = true;
      else {
        if (e = new g(e), r = e.d, e.s < 0 || !r || !r[0] || e.eq(1)) return new g(NaN);
        t = e.eq(10);
      }
      if (r = d.d, d.s < 0 || !r || !r[0] || d.eq(1)) return new g(r && !r[0] ? -1 / 0 : d.s != 1 ? NaN : r ? 0 : 1 / 0);
      if (t) if (r.length > 1) o = true;
      else {
        for (i = r[0]; i % 10 === 0; ) i /= 10;
        o = i !== 1;
      }
      if (_ = false, a = h + I, s = ke(d, a), n = t ? Tr(g, a + 10) : ke(e, a), l2 = V(s, n, a, 1), Ot(l2.d, i = h, T2)) do
        if (a += 10, s = ke(d, a), n = t ? Tr(g, a + 10) : ke(e, a), l2 = V(s, n, a, 1), !o) {
          +Y(l2.d).slice(i + 1, i + 15) + 1 == 1e14 && (l2 = k2(l2, h + 1, 0));
          break;
        }
      while (Ot(l2.d, i += 10, T2));
      return _ = true, k2(l2, h, T2);
    };
    R.minus = R.sub = function(e) {
      var t, r, n, i, o, s, a, l2, d, g, h, T2, I = this, S2 = I.constructor;
      if (e = new S2(e), !I.d || !e.d) return !I.s || !e.s ? e = new S2(NaN) : I.d ? e.s = -e.s : e = new S2(e.d || I.s !== e.s ? I : NaN), e;
      if (I.s != e.s) return e.s = -e.s, I.plus(e);
      if (d = I.d, T2 = e.d, a = S2.precision, l2 = S2.rounding, !d[0] || !T2[0]) {
        if (T2[0]) e.s = -e.s;
        else if (d[0]) e = new S2(I);
        else return new S2(l2 === 3 ? -0 : 0);
        return _ ? k2(e, a, l2) : e;
      }
      if (r = ee(e.e / D), g = ee(I.e / D), d = d.slice(), o = g - r, o) {
        for (h = o < 0, h ? (t = d, o = -o, s = T2.length) : (t = T2, r = g, s = d.length), n = Math.max(Math.ceil(a / D), s) + 2, o > n && (o = n, t.length = 1), t.reverse(), n = o; n--; ) t.push(0);
        t.reverse();
      } else {
        for (n = d.length, s = T2.length, h = n < s, h && (s = n), n = 0; n < s; n++) if (d[n] != T2[n]) {
          h = d[n] < T2[n];
          break;
        }
        o = 0;
      }
      for (h && (t = d, d = T2, T2 = t, e.s = -e.s), s = d.length, n = T2.length - s; n > 0; --n) d[s++] = 0;
      for (n = T2.length; n > o; ) {
        if (d[--n] < T2[n]) {
          for (i = n; i && d[--i] === 0; ) d[i] = pe - 1;
          --d[i], d[n] += pe;
        }
        d[n] -= T2[n];
      }
      for (; d[--s] === 0; ) d.pop();
      for (; d[0] === 0; d.shift()) --r;
      return d[0] ? (e.d = d, e.e = Rr(d, r), _ ? k2(e, a, l2) : e) : new S2(l2 === 3 ? -0 : 0);
    };
    R.modulo = R.mod = function(e) {
      var t, r = this, n = r.constructor;
      return e = new n(e), !r.d || !e.s || e.d && !e.d[0] ? new n(NaN) : !e.d || r.d && !r.d[0] ? k2(new n(r), n.precision, n.rounding) : (_ = false, n.modulo == 9 ? (t = V(r, e.abs(), 0, 3, 1), t.s *= e.s) : t = V(r, e, 0, n.modulo, 1), t = t.times(e), _ = true, r.minus(t));
    };
    R.naturalExponential = R.exp = function() {
      return Mn(this);
    };
    R.naturalLogarithm = R.ln = function() {
      return ke(this);
    };
    R.negated = R.neg = function() {
      var e = new this.constructor(this);
      return e.s = -e.s, k2(e);
    };
    R.plus = R.add = function(e) {
      var t, r, n, i, o, s, a, l2, d, g, h = this, T2 = h.constructor;
      if (e = new T2(e), !h.d || !e.d) return !h.s || !e.s ? e = new T2(NaN) : h.d || (e = new T2(e.d || h.s === e.s ? h : NaN)), e;
      if (h.s != e.s) return e.s = -e.s, h.minus(e);
      if (d = h.d, g = e.d, a = T2.precision, l2 = T2.rounding, !d[0] || !g[0]) return g[0] || (e = new T2(h)), _ ? k2(e, a, l2) : e;
      if (o = ee(h.e / D), n = ee(e.e / D), d = d.slice(), i = o - n, i) {
        for (i < 0 ? (r = d, i = -i, s = g.length) : (r = g, n = o, s = d.length), o = Math.ceil(a / D), s = o > s ? o + 1 : s + 1, i > s && (i = s, r.length = 1), r.reverse(); i--; ) r.push(0);
        r.reverse();
      }
      for (s = d.length, i = g.length, s - i < 0 && (i = s, r = g, g = d, d = r), t = 0; i; ) t = (d[--i] = d[i] + g[i] + t) / pe | 0, d[i] %= pe;
      for (t && (d.unshift(t), ++n), s = d.length; d[--s] == 0; ) d.pop();
      return e.d = d, e.e = Rr(d, n), _ ? k2(e, a, l2) : e;
    };
    R.precision = R.sd = function(e) {
      var t, r = this;
      if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(De + e);
      return r.d ? (t = yo(r.d), e && r.e + 1 > t && (t = r.e + 1)) : t = NaN, t;
    };
    R.round = function() {
      var e = this, t = e.constructor;
      return k2(new t(e), e.e + 1, t.rounding);
    };
    R.sine = R.sin = function() {
      var e, t, r = this, n = r.constructor;
      return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + Math.max(r.e, r.sd()) + D, n.rounding = 1, r = Ql(n, xo(n, r)), n.precision = e, n.rounding = t, k2(ve > 2 ? r.neg() : r, e, t, true)) : new n(NaN);
    };
    R.squareRoot = R.sqrt = function() {
      var e, t, r, n, i, o, s = this, a = s.d, l2 = s.e, d = s.s, g = s.constructor;
      if (d !== 1 || !a || !a[0]) return new g(!d || d < 0 && (!a || a[0]) ? NaN : a ? s : 1 / 0);
      for (_ = false, d = Math.sqrt(+s), d == 0 || d == 1 / 0 ? (t = Y(a), (t.length + l2) % 2 == 0 && (t += "0"), d = Math.sqrt(t), l2 = ee((l2 + 1) / 2) - (l2 < 0 || l2 % 2), d == 1 / 0 ? t = "5e" + l2 : (t = d.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + l2), n = new g(t)) : n = new g(d.toString()), r = (l2 = g.precision) + 3; ; ) if (o = n, n = o.plus(V(s, o, r + 2, 1)).times(0.5), Y(o.d).slice(0, r) === (t = Y(n.d)).slice(0, r)) if (t = t.slice(r - 3, r + 1), t == "9999" || !i && t == "4999") {
        if (!i && (k2(o, l2 + 1, 0), o.times(o).eq(s))) {
          n = o;
          break;
        }
        r += 4, i = 1;
      } else {
        (!+t || !+t.slice(1) && t.charAt(0) == "5") && (k2(n, l2 + 1, 1), e = !n.times(n).eq(s));
        break;
      }
      return _ = true, k2(n, l2, g.rounding, e);
    };
    R.tangent = R.tan = function() {
      var e, t, r = this, n = r.constructor;
      return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 10, n.rounding = 1, r = r.sin(), r.s = 1, r = V(r, new n(1).minus(r.times(r)).sqrt(), e + 10, 0), n.precision = e, n.rounding = t, k2(ve == 2 || ve == 4 ? r.neg() : r, e, t, true)) : new n(NaN);
    };
    R.times = R.mul = function(e) {
      var t, r, n, i, o, s, a, l2, d, g = this, h = g.constructor, T2 = g.d, I = (e = new h(e)).d;
      if (e.s *= g.s, !T2 || !T2[0] || !I || !I[0]) return new h(!e.s || T2 && !T2[0] && !I || I && !I[0] && !T2 ? NaN : !T2 || !I ? e.s / 0 : e.s * 0);
      for (r = ee(g.e / D) + ee(e.e / D), l2 = T2.length, d = I.length, l2 < d && (o = T2, T2 = I, I = o, s = l2, l2 = d, d = s), o = [], s = l2 + d, n = s; n--; ) o.push(0);
      for (n = d; --n >= 0; ) {
        for (t = 0, i = l2 + n; i > n; ) a = o[i] + I[n] * T2[i - n - 1] + t, o[i--] = a % pe | 0, t = a / pe | 0;
        o[i] = (o[i] + t) % pe | 0;
      }
      for (; !o[--s]; ) o.pop();
      return t ? ++r : o.shift(), e.d = o, e.e = Rr(o, r), _ ? k2(e, h.precision, h.rounding) : e;
    };
    R.toBinary = function(e, t) {
      return _n(this, 2, e, t);
    };
    R.toDecimalPlaces = R.toDP = function(e, t) {
      var r = this, n = r.constructor;
      return r = new n(r), e === void 0 ? r : (oe(e, 0, Me), t === void 0 ? t = n.rounding : oe(t, 0, 8), k2(r, e + r.e + 1, t));
    };
    R.toExponential = function(e, t) {
      var r, n = this, i = n.constructor;
      return e === void 0 ? r = ye(n, true) : (oe(e, 0, Me), t === void 0 ? t = i.rounding : oe(t, 0, 8), n = k2(new i(n), e + 1, t), r = ye(n, true, e + 1)), n.isNeg() && !n.isZero() ? "-" + r : r;
    };
    R.toFixed = function(e, t) {
      var r, n, i = this, o = i.constructor;
      return e === void 0 ? r = ye(i) : (oe(e, 0, Me), t === void 0 ? t = o.rounding : oe(t, 0, 8), n = k2(new o(i), e + i.e + 1, t), r = ye(n, false, e + n.e + 1)), i.isNeg() && !i.isZero() ? "-" + r : r;
    };
    R.toFraction = function(e) {
      var t, r, n, i, o, s, a, l2, d, g, h, T2, I = this, S2 = I.d, C = I.constructor;
      if (!S2) return new C(I);
      if (d = r = new C(1), n = l2 = new C(0), t = new C(n), o = t.e = yo(S2) - I.e - 1, s = o % D, t.d[0] = K(10, s < 0 ? D + s : s), e == null) e = o > 0 ? t : d;
      else {
        if (a = new C(e), !a.isInt() || a.lt(d)) throw Error(De + a);
        e = a.gt(t) ? o > 0 ? t : d : a;
      }
      for (_ = false, a = new C(Y(S2)), g = C.precision, C.precision = o = S2.length * D * 2; h = V(a, t, 0, 1, 1), i = r.plus(h.times(n)), i.cmp(e) != 1; ) r = n, n = i, i = d, d = l2.plus(h.times(i)), l2 = i, i = t, t = a.minus(h.times(i)), a = i;
      return i = V(e.minus(r), n, 0, 1, 1), l2 = l2.plus(i.times(d)), r = r.plus(i.times(n)), l2.s = d.s = I.s, T2 = V(d, n, o, 1).minus(I).abs().cmp(V(l2, r, o, 1).minus(I).abs()) < 1 ? [d, n] : [l2, r], C.precision = g, _ = true, T2;
    };
    R.toHexadecimal = R.toHex = function(e, t) {
      return _n(this, 16, e, t);
    };
    R.toNearest = function(e, t) {
      var r = this, n = r.constructor;
      if (r = new n(r), e == null) {
        if (!r.d) return r;
        e = new n(1), t = n.rounding;
      } else {
        if (e = new n(e), t === void 0 ? t = n.rounding : oe(t, 0, 8), !r.d) return e.s ? r : e;
        if (!e.d) return e.s && (e.s = r.s), e;
      }
      return e.d[0] ? (_ = false, r = V(r, e, 0, t, 1).times(e), _ = true, k2(r)) : (e.s = r.s, r = e), r;
    };
    R.toNumber = function() {
      return +this;
    };
    R.toOctal = function(e, t) {
      return _n(this, 8, e, t);
    };
    R.toPower = R.pow = function(e) {
      var t, r, n, i, o, s, a = this, l2 = a.constructor, d = +(e = new l2(e));
      if (!a.d || !e.d || !a.d[0] || !e.d[0]) return new l2(K(+a, d));
      if (a = new l2(a), a.eq(1)) return a;
      if (n = l2.precision, o = l2.rounding, e.eq(1)) return k2(a, n, o);
      if (t = ee(e.e / D), t >= e.d.length - 1 && (r = d < 0 ? -d : d) <= $l) return i = wo(l2, a, r, n), e.s < 0 ? new l2(1).div(i) : k2(i, n, o);
      if (s = a.s, s < 0) {
        if (t < e.d.length - 1) return new l2(NaN);
        if ((e.d[t] & 1) == 0 && (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1) return a.s = s, a;
      }
      return r = K(+a, d), t = r == 0 || !isFinite(r) ? ee(d * (Math.log("0." + Y(a.d)) / Math.LN10 + a.e + 1)) : new l2(r + "").e, t > l2.maxE + 1 || t < l2.minE - 1 ? new l2(t > 0 ? s / 0 : 0) : (_ = false, l2.rounding = a.s = 1, r = Math.min(12, (t + "").length), i = Mn(e.times(ke(a, n + r)), n), i.d && (i = k2(i, n + 5, 1), Ot(i.d, n, o) && (t = n + 10, i = k2(Mn(e.times(ke(a, t + r)), t), t + 5, 1), +Y(i.d).slice(n + 1, n + 15) + 1 == 1e14 && (i = k2(i, n + 1, 0)))), i.s = s, _ = true, l2.rounding = o, k2(i, n, o));
    };
    R.toPrecision = function(e, t) {
      var r, n = this, i = n.constructor;
      return e === void 0 ? r = ye(n, n.e <= i.toExpNeg || n.e >= i.toExpPos) : (oe(e, 1, Me), t === void 0 ? t = i.rounding : oe(t, 0, 8), n = k2(new i(n), e, t), r = ye(n, e <= n.e || n.e <= i.toExpNeg, e)), n.isNeg() && !n.isZero() ? "-" + r : r;
    };
    R.toSignificantDigits = R.toSD = function(e, t) {
      var r = this, n = r.constructor;
      return e === void 0 ? (e = n.precision, t = n.rounding) : (oe(e, 1, Me), t === void 0 ? t = n.rounding : oe(t, 0, 8)), k2(new n(r), e, t);
    };
    R.toString = function() {
      var e = this, t = e.constructor, r = ye(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
      return e.isNeg() && !e.isZero() ? "-" + r : r;
    };
    R.truncated = R.trunc = function() {
      return k2(new this.constructor(this), this.e + 1, 1);
    };
    R.valueOf = R.toJSON = function() {
      var e = this, t = e.constructor, r = ye(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
      return e.isNeg() ? "-" + r : r;
    };
    function Y(e) {
      var t, r, n, i = e.length - 1, o = "", s = e[0];
      if (i > 0) {
        for (o += s, t = 1; t < i; t++) n = e[t] + "", r = D - n.length, r && (o += Oe(r)), o += n;
        s = e[t], n = s + "", r = D - n.length, r && (o += Oe(r));
      } else if (s === 0) return "0";
      for (; s % 10 === 0; ) s /= 10;
      return o + s;
    }
    __name(Y, "Y");
    function oe(e, t, r) {
      if (e !== ~~e || e < t || e > r) throw Error(De + e);
    }
    __name(oe, "oe");
    function Ot(e, t, r, n) {
      var i, o, s, a;
      for (o = e[0]; o >= 10; o /= 10) --t;
      return --t < 0 ? (t += D, i = 0) : (i = Math.ceil((t + 1) / D), t %= D), o = K(10, D - t), a = e[i] % o | 0, n == null ? t < 3 ? (t == 0 ? a = a / 100 | 0 : t == 1 && (a = a / 10 | 0), s = r < 4 && a == 99999 || r > 3 && a == 49999 || a == 5e4 || a == 0) : s = (r < 4 && a + 1 == o || r > 3 && a + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == K(10, t - 2) - 1 || (a == o / 2 || a == 0) && (e[i + 1] / o / 100 | 0) == 0 : t < 4 ? (t == 0 ? a = a / 1e3 | 0 : t == 1 ? a = a / 100 | 0 : t == 2 && (a = a / 10 | 0), s = (n || r < 4) && a == 9999 || !n && r > 3 && a == 4999) : s = ((n || r < 4) && a + 1 == o || !n && r > 3 && a + 1 == o / 2) && (e[i + 1] / o / 1e3 | 0) == K(10, t - 3) - 1, s;
    }
    __name(Ot, "Ot");
    function br(e, t, r) {
      for (var n, i = [0], o, s = 0, a = e.length; s < a; ) {
        for (o = i.length; o--; ) i[o] *= t;
        for (i[0] += On.indexOf(e.charAt(s++)), n = 0; n < i.length; n++) i[n] > r - 1 && (i[n + 1] === void 0 && (i[n + 1] = 0), i[n + 1] += i[n] / r | 0, i[n] %= r);
      }
      return i.reverse();
    }
    __name(br, "br");
    function Gl(e, t) {
      var r, n, i;
      if (t.isZero()) return t;
      n = t.d.length, n < 32 ? (r = Math.ceil(n / 3), i = (1 / Cr(4, r)).toString()) : (r = 16, i = "2.3283064365386962890625e-10"), e.precision += r, t = tt(e, 1, t.times(i), new e(1));
      for (var o = r; o--; ) {
        var s = t.times(t);
        t = s.times(s).minus(s).times(8).plus(1);
      }
      return e.precision -= r, t;
    }
    __name(Gl, "Gl");
    var V = /* @__PURE__ */ function() {
      function e(n, i, o) {
        var s, a = 0, l2 = n.length;
        for (n = n.slice(); l2--; ) s = n[l2] * i + a, n[l2] = s % o | 0, a = s / o | 0;
        return a && n.unshift(a), n;
      }
      __name(e, "e");
      function t(n, i, o, s) {
        var a, l2;
        if (o != s) l2 = o > s ? 1 : -1;
        else for (a = l2 = 0; a < o; a++) if (n[a] != i[a]) {
          l2 = n[a] > i[a] ? 1 : -1;
          break;
        }
        return l2;
      }
      __name(t, "t");
      function r(n, i, o, s) {
        for (var a = 0; o--; ) n[o] -= a, a = n[o] < i[o] ? 1 : 0, n[o] = a * s + n[o] - i[o];
        for (; !n[0] && n.length > 1; ) n.shift();
      }
      __name(r, "r");
      return function(n, i, o, s, a, l2) {
        var d, g, h, T2, I, S2, C, M, F2, B, O, L, le, J, sn, or, Pt, an, ce, sr, ar = n.constructor, ln = n.s == i.s ? 1 : -1, Z = n.d, $ = i.d;
        if (!Z || !Z[0] || !$ || !$[0]) return new ar(!n.s || !i.s || (Z ? $ && Z[0] == $[0] : !$) ? NaN : Z && Z[0] == 0 || !$ ? ln * 0 : ln / 0);
        for (l2 ? (I = 1, g = n.e - i.e) : (l2 = pe, I = D, g = ee(n.e / I) - ee(i.e / I)), ce = $.length, Pt = Z.length, F2 = new ar(ln), B = F2.d = [], h = 0; $[h] == (Z[h] || 0); h++) ;
        if ($[h] > (Z[h] || 0) && g--, o == null ? (J = o = ar.precision, s = ar.rounding) : a ? J = o + (n.e - i.e) + 1 : J = o, J < 0) B.push(1), S2 = true;
        else {
          if (J = J / I + 2 | 0, h = 0, ce == 1) {
            for (T2 = 0, $ = $[0], J++; (h < Pt || T2) && J--; h++) sn = T2 * l2 + (Z[h] || 0), B[h] = sn / $ | 0, T2 = sn % $ | 0;
            S2 = T2 || h < Pt;
          } else {
            for (T2 = l2 / ($[0] + 1) | 0, T2 > 1 && ($ = e($, T2, l2), Z = e(Z, T2, l2), ce = $.length, Pt = Z.length), or = ce, O = Z.slice(0, ce), L = O.length; L < ce; ) O[L++] = 0;
            sr = $.slice(), sr.unshift(0), an = $[0], $[1] >= l2 / 2 && ++an;
            do
              T2 = 0, d = t($, O, ce, L), d < 0 ? (le = O[0], ce != L && (le = le * l2 + (O[1] || 0)), T2 = le / an | 0, T2 > 1 ? (T2 >= l2 && (T2 = l2 - 1), C = e($, T2, l2), M = C.length, L = O.length, d = t(C, O, M, L), d == 1 && (T2--, r(C, ce < M ? sr : $, M, l2))) : (T2 == 0 && (d = T2 = 1), C = $.slice()), M = C.length, M < L && C.unshift(0), r(O, C, L, l2), d == -1 && (L = O.length, d = t($, O, ce, L), d < 1 && (T2++, r(O, ce < L ? sr : $, L, l2))), L = O.length) : d === 0 && (T2++, O = [0]), B[h++] = T2, d && O[0] ? O[L++] = Z[or] || 0 : (O = [Z[or]], L = 1);
            while ((or++ < Pt || O[0] !== void 0) && J--);
            S2 = O[0] !== void 0;
          }
          B[0] || B.shift();
        }
        if (I == 1) F2.e = g, po = S2;
        else {
          for (h = 1, T2 = B[0]; T2 >= 10; T2 /= 10) h++;
          F2.e = h + g * I - 1, k2(F2, a ? o + F2.e + 1 : o, s, S2);
        }
        return F2;
      };
    }();
    function k2(e, t, r, n) {
      var i, o, s, a, l2, d, g, h, T2, I = e.constructor;
      e: if (t != null) {
        if (h = e.d, !h) return e;
        for (i = 1, a = h[0]; a >= 10; a /= 10) i++;
        if (o = t - i, o < 0) o += D, s = t, g = h[T2 = 0], l2 = g / K(10, i - s - 1) % 10 | 0;
        else if (T2 = Math.ceil((o + 1) / D), a = h.length, T2 >= a) if (n) {
          for (; a++ <= T2; ) h.push(0);
          g = l2 = 0, i = 1, o %= D, s = o - D + 1;
        } else break e;
        else {
          for (g = a = h[T2], i = 1; a >= 10; a /= 10) i++;
          o %= D, s = o - D + i, l2 = s < 0 ? 0 : g / K(10, i - s - 1) % 10 | 0;
        }
        if (n = n || t < 0 || h[T2 + 1] !== void 0 || (s < 0 ? g : g % K(10, i - s - 1)), d = r < 4 ? (l2 || n) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : l2 > 5 || l2 == 5 && (r == 4 || n || r == 6 && (o > 0 ? s > 0 ? g / K(10, i - s) : 0 : h[T2 - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7)), t < 1 || !h[0]) return h.length = 0, d ? (t -= e.e + 1, h[0] = K(10, (D - t % D) % D), e.e = -t || 0) : h[0] = e.e = 0, e;
        if (o == 0 ? (h.length = T2, a = 1, T2--) : (h.length = T2 + 1, a = K(10, D - o), h[T2] = s > 0 ? (g / K(10, i - s) % K(10, s) | 0) * a : 0), d) for (; ; ) if (T2 == 0) {
          for (o = 1, s = h[0]; s >= 10; s /= 10) o++;
          for (s = h[0] += a, a = 1; s >= 10; s /= 10) a++;
          o != a && (e.e++, h[0] == pe && (h[0] = 1));
          break;
        } else {
          if (h[T2] += a, h[T2] != pe) break;
          h[T2--] = 0, a = 1;
        }
        for (o = h.length; h[--o] === 0; ) h.pop();
      }
      return _ && (e.e > I.maxE ? (e.d = null, e.e = NaN) : e.e < I.minE && (e.e = 0, e.d = [0])), e;
    }
    __name(k2, "k");
    function ye(e, t, r) {
      if (!e.isFinite()) return bo(e);
      var n, i = e.e, o = Y(e.d), s = o.length;
      return t ? (r && (n = r - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + Oe(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (e.e < 0 ? "e" : "e+") + e.e) : i < 0 ? (o = "0." + Oe(-i - 1) + o, r && (n = r - s) > 0 && (o += Oe(n))) : i >= s ? (o += Oe(i + 1 - s), r && (n = r - i - 1) > 0 && (o = o + "." + Oe(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), r && (n = r - s) > 0 && (i + 1 === s && (o += "."), o += Oe(n))), o;
    }
    __name(ye, "ye");
    function Rr(e, t) {
      var r = e[0];
      for (t *= D; r >= 10; r /= 10) t++;
      return t;
    }
    __name(Rr, "Rr");
    function Tr(e, t, r) {
      if (t > jl) throw _ = true, r && (e.precision = r), Error(mo);
      return k2(new e(Pr), t, 1, true);
    }
    __name(Tr, "Tr");
    function he(e, t, r) {
      if (t > Dn) throw Error(mo);
      return k2(new e(vr), t, r, true);
    }
    __name(he, "he");
    function yo(e) {
      var t = e.length - 1, r = t * D + 1;
      if (t = e[t], t) {
        for (; t % 10 == 0; t /= 10) r--;
        for (t = e[0]; t >= 10; t /= 10) r++;
      }
      return r;
    }
    __name(yo, "yo");
    function Oe(e) {
      for (var t = ""; e--; ) t += "0";
      return t;
    }
    __name(Oe, "Oe");
    function wo(e, t, r, n) {
      var i, o = new e(1), s = Math.ceil(n / D + 4);
      for (_ = false; ; ) {
        if (r % 2 && (o = o.times(t), uo(o.d, s) && (i = true)), r = ee(r / 2), r === 0) {
          r = o.d.length - 1, i && o.d[r] === 0 && ++o.d[r];
          break;
        }
        t = t.times(t), uo(t.d, s);
      }
      return _ = true, o;
    }
    __name(wo, "wo");
    function lo(e) {
      return e.d[e.d.length - 1] & 1;
    }
    __name(lo, "lo");
    function Eo(e, t, r) {
      for (var n, i, o = new e(t[0]), s = 0; ++s < t.length; ) {
        if (i = new e(t[s]), !i.s) {
          o = i;
          break;
        }
        n = o.cmp(i), (n === r || n === 0 && o.s === r) && (o = i);
      }
      return o;
    }
    __name(Eo, "Eo");
    function Mn(e, t) {
      var r, n, i, o, s, a, l2, d = 0, g = 0, h = 0, T2 = e.constructor, I = T2.rounding, S2 = T2.precision;
      if (!e.d || !e.d[0] || e.e > 17) return new T2(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
      for (t == null ? (_ = false, l2 = S2) : l2 = t, a = new T2(0.03125); e.e > -2; ) e = e.times(a), h += 5;
      for (n = Math.log(K(2, h)) / Math.LN10 * 2 + 5 | 0, l2 += n, r = o = s = new T2(1), T2.precision = l2; ; ) {
        if (o = k2(o.times(e), l2, 1), r = r.times(++g), a = s.plus(V(o, r, l2, 1)), Y(a.d).slice(0, l2) === Y(s.d).slice(0, l2)) {
          for (i = h; i--; ) s = k2(s.times(s), l2, 1);
          if (t == null) if (d < 3 && Ot(s.d, l2 - n, I, d)) T2.precision = l2 += 10, r = o = a = new T2(1), g = 0, d++;
          else return k2(s, T2.precision = S2, I, _ = true);
          else return T2.precision = S2, s;
        }
        s = a;
      }
    }
    __name(Mn, "Mn");
    function ke(e, t) {
      var r, n, i, o, s, a, l2, d, g, h, T2, I = 1, S2 = 10, C = e, M = C.d, F2 = C.constructor, B = F2.rounding, O = F2.precision;
      if (C.s < 0 || !M || !M[0] || !C.e && M[0] == 1 && M.length == 1) return new F2(M && !M[0] ? -1 / 0 : C.s != 1 ? NaN : M ? 0 : C);
      if (t == null ? (_ = false, g = O) : g = t, F2.precision = g += S2, r = Y(M), n = r.charAt(0), Math.abs(o = C.e) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; ) C = C.times(e), r = Y(C.d), n = r.charAt(0), I++;
        o = C.e, n > 1 ? (C = new F2("0." + r), o++) : C = new F2(n + "." + r.slice(1));
      } else return d = Tr(F2, g + 2, O).times(o + ""), C = ke(new F2(n + "." + r.slice(1)), g - S2).plus(d), F2.precision = O, t == null ? k2(C, O, B, _ = true) : C;
      for (h = C, l2 = s = C = V(C.minus(1), C.plus(1), g, 1), T2 = k2(C.times(C), g, 1), i = 3; ; ) {
        if (s = k2(s.times(T2), g, 1), d = l2.plus(V(s, new F2(i), g, 1)), Y(d.d).slice(0, g) === Y(l2.d).slice(0, g)) if (l2 = l2.times(2), o !== 0 && (l2 = l2.plus(Tr(F2, g + 2, O).times(o + ""))), l2 = V(l2, new F2(I), g, 1), t == null) if (Ot(l2.d, g - S2, B, a)) F2.precision = g += S2, d = s = C = V(h.minus(1), h.plus(1), g, 1), T2 = k2(C.times(C), g, 1), i = a = 1;
        else return k2(l2, F2.precision = O, B, _ = true);
        else return F2.precision = O, l2;
        l2 = d, i += 2;
      }
    }
    __name(ke, "ke");
    function bo(e) {
      return String(e.s * e.s / 0);
    }
    __name(bo, "bo");
    function xr(e, t) {
      var r, n, i;
      for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; n++) ;
      for (i = t.length; t.charCodeAt(i - 1) === 48; --i) ;
      if (t = t.slice(n, i), t) {
        if (i -= n, e.e = r = r - n - 1, e.d = [], n = (r + 1) % D, r < 0 && (n += D), n < i) {
          for (n && e.d.push(+t.slice(0, n)), i -= D; n < i; ) e.d.push(+t.slice(n, n += D));
          t = t.slice(n), n = D - t.length;
        } else n -= i;
        for (; n--; ) t += "0";
        e.d.push(+t), _ && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [0]));
      } else e.e = 0, e.d = [0];
      return e;
    }
    __name(xr, "xr");
    function Jl(e, t) {
      var r, n, i, o, s, a, l2, d, g;
      if (t.indexOf("_") > -1) {
        if (t = t.replace(/(\d)_(?=\d)/g, "$1"), ho.test(t)) return xr(e, t);
      } else if (t === "Infinity" || t === "NaN") return +t || (e.s = NaN), e.e = NaN, e.d = null, e;
      if (ql.test(t)) r = 16, t = t.toLowerCase();
      else if (Bl.test(t)) r = 2;
      else if (Vl.test(t)) r = 8;
      else throw Error(De + t);
      for (o = t.search(/p/i), o > 0 ? (l2 = +t.slice(o + 1), t = t.substring(2, o)) : t = t.slice(2), o = t.indexOf("."), s = o >= 0, n = e.constructor, s && (t = t.replace(".", ""), a = t.length, o = a - o, i = wo(n, new n(r), o, o * 2)), d = br(t, r, pe), g = d.length - 1, o = g; d[o] === 0; --o) d.pop();
      return o < 0 ? new n(e.s * 0) : (e.e = Rr(d, g), e.d = d, _ = false, s && (e = V(e, i, a * 4)), l2 && (e = e.times(Math.abs(l2) < 54 ? K(2, l2) : Te.pow(2, l2))), _ = true, e);
    }
    __name(Jl, "Jl");
    function Ql(e, t) {
      var r, n = t.d.length;
      if (n < 3) return t.isZero() ? t : tt(e, 2, t, t);
      r = 1.4 * Math.sqrt(n), r = r > 16 ? 16 : r | 0, t = t.times(1 / Cr(5, r)), t = tt(e, 2, t, t);
      for (var i, o = new e(5), s = new e(16), a = new e(20); r--; ) i = t.times(t), t = t.times(o.plus(i.times(s.times(i).minus(a))));
      return t;
    }
    __name(Ql, "Ql");
    function tt(e, t, r, n, i) {
      var o, s, a, l2, d = 1, g = e.precision, h = Math.ceil(g / D);
      for (_ = false, l2 = r.times(r), a = new e(n); ; ) {
        if (s = V(a.times(l2), new e(t++ * t++), g, 1), a = i ? n.plus(s) : n.minus(s), n = V(s.times(l2), new e(t++ * t++), g, 1), s = a.plus(n), s.d[h] !== void 0) {
          for (o = h; s.d[o] === a.d[o] && o--; ) ;
          if (o == -1) break;
        }
        o = a, a = n, n = s, s = o, d++;
      }
      return _ = true, s.d.length = h + 1, s;
    }
    __name(tt, "tt");
    function Cr(e, t) {
      for (var r = e; --t; ) r *= e;
      return r;
    }
    __name(Cr, "Cr");
    function xo(e, t) {
      var r, n = t.s < 0, i = he(e, e.precision, 1), o = i.times(0.5);
      if (t = t.abs(), t.lte(o)) return ve = n ? 4 : 1, t;
      if (r = t.divToInt(i), r.isZero()) ve = n ? 3 : 2;
      else {
        if (t = t.minus(r.times(i)), t.lte(o)) return ve = lo(r) ? n ? 2 : 3 : n ? 4 : 1, t;
        ve = lo(r) ? n ? 1 : 4 : n ? 3 : 2;
      }
      return t.minus(i).abs();
    }
    __name(xo, "xo");
    function _n(e, t, r, n) {
      var i, o, s, a, l2, d, g, h, T2, I = e.constructor, S2 = r !== void 0;
      if (S2 ? (oe(r, 1, Me), n === void 0 ? n = I.rounding : oe(n, 0, 8)) : (r = I.precision, n = I.rounding), !e.isFinite()) g = bo(e);
      else {
        for (g = ye(e), s = g.indexOf("."), S2 ? (i = 2, t == 16 ? r = r * 4 - 3 : t == 8 && (r = r * 3 - 2)) : i = t, s >= 0 && (g = g.replace(".", ""), T2 = new I(1), T2.e = g.length - s, T2.d = br(ye(T2), 10, i), T2.e = T2.d.length), h = br(g, 10, i), o = l2 = h.length; h[--l2] == 0; ) h.pop();
        if (!h[0]) g = S2 ? "0p+0" : "0";
        else {
          if (s < 0 ? o-- : (e = new I(e), e.d = h, e.e = o, e = V(e, T2, r, n, 0, i), h = e.d, o = e.e, d = po), s = h[r], a = i / 2, d = d || h[r + 1] !== void 0, d = n < 4 ? (s !== void 0 || d) && (n === 0 || n === (e.s < 0 ? 3 : 2)) : s > a || s === a && (n === 4 || d || n === 6 && h[r - 1] & 1 || n === (e.s < 0 ? 8 : 7)), h.length = r, d) for (; ++h[--r] > i - 1; ) h[r] = 0, r || (++o, h.unshift(1));
          for (l2 = h.length; !h[l2 - 1]; --l2) ;
          for (s = 0, g = ""; s < l2; s++) g += On.charAt(h[s]);
          if (S2) {
            if (l2 > 1) if (t == 16 || t == 8) {
              for (s = t == 16 ? 4 : 3, --l2; l2 % s; l2++) g += "0";
              for (h = br(g, i, t), l2 = h.length; !h[l2 - 1]; --l2) ;
              for (s = 1, g = "1."; s < l2; s++) g += On.charAt(h[s]);
            } else g = g.charAt(0) + "." + g.slice(1);
            g = g + (o < 0 ? "p" : "p+") + o;
          } else if (o < 0) {
            for (; ++o; ) g = "0" + g;
            g = "0." + g;
          } else if (++o > l2) for (o -= l2; o--; ) g += "0";
          else o < l2 && (g = g.slice(0, o) + "." + g.slice(o));
        }
        g = (t == 16 ? "0x" : t == 2 ? "0b" : t == 8 ? "0o" : "") + g;
      }
      return e.s < 0 ? "-" + g : g;
    }
    __name(_n, "_n");
    function uo(e, t) {
      if (e.length > t) return e.length = t, true;
    }
    __name(uo, "uo");
    function Kl(e) {
      return new this(e).abs();
    }
    __name(Kl, "Kl");
    function Wl(e) {
      return new this(e).acos();
    }
    __name(Wl, "Wl");
    function Hl(e) {
      return new this(e).acosh();
    }
    __name(Hl, "Hl");
    function zl(e, t) {
      return new this(e).plus(t);
    }
    __name(zl, "zl");
    function Yl(e) {
      return new this(e).asin();
    }
    __name(Yl, "Yl");
    function Zl(e) {
      return new this(e).asinh();
    }
    __name(Zl, "Zl");
    function Xl(e) {
      return new this(e).atan();
    }
    __name(Xl, "Xl");
    function eu(e) {
      return new this(e).atanh();
    }
    __name(eu, "eu");
    function tu(e, t) {
      e = new this(e), t = new this(t);
      var r, n = this.precision, i = this.rounding, o = n + 4;
      return !e.s || !t.s ? r = new this(NaN) : !e.d && !t.d ? (r = he(this, o, 1).times(t.s > 0 ? 0.25 : 0.75), r.s = e.s) : !t.d || e.isZero() ? (r = t.s < 0 ? he(this, n, i) : new this(0), r.s = e.s) : !e.d || t.isZero() ? (r = he(this, o, 1).times(0.5), r.s = e.s) : t.s < 0 ? (this.precision = o, this.rounding = 1, r = this.atan(V(e, t, o, 1)), t = he(this, o, 1), this.precision = n, this.rounding = i, r = e.s < 0 ? r.minus(t) : r.plus(t)) : r = this.atan(V(e, t, o, 1)), r;
    }
    __name(tu, "tu");
    function ru(e) {
      return new this(e).cbrt();
    }
    __name(ru, "ru");
    function nu(e) {
      return k2(e = new this(e), e.e + 1, 2);
    }
    __name(nu, "nu");
    function iu(e, t, r) {
      return new this(e).clamp(t, r);
    }
    __name(iu, "iu");
    function ou(e) {
      if (!e || typeof e != "object") throw Error(Ar + "Object expected");
      var t, r, n, i = e.defaults === true, o = ["precision", 1, Me, "rounding", 0, 8, "toExpNeg", -et, 0, "toExpPos", 0, et, "maxE", 0, et, "minE", -et, 0, "modulo", 0, 9];
      for (t = 0; t < o.length; t += 3) if (r = o[t], i && (this[r] = kn[r]), (n = e[r]) !== void 0) if (ee(n) === n && n >= o[t + 1] && n <= o[t + 2]) this[r] = n;
      else throw Error(De + r + ": " + n);
      if (r = "crypto", i && (this[r] = kn[r]), (n = e[r]) !== void 0) if (n === true || n === false || n === 0 || n === 1) if (n) if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[r] = true;
      else throw Error(fo);
      else this[r] = false;
      else throw Error(De + r + ": " + n);
      return this;
    }
    __name(ou, "ou");
    function su(e) {
      return new this(e).cos();
    }
    __name(su, "su");
    function au(e) {
      return new this(e).cosh();
    }
    __name(au, "au");
    function Po(e) {
      var t, r, n;
      function i(o) {
        var s, a, l2, d = this;
        if (!(d instanceof i)) return new i(o);
        if (d.constructor = i, co(o)) {
          d.s = o.s, _ ? !o.d || o.e > i.maxE ? (d.e = NaN, d.d = null) : o.e < i.minE ? (d.e = 0, d.d = [0]) : (d.e = o.e, d.d = o.d.slice()) : (d.e = o.e, d.d = o.d ? o.d.slice() : o.d);
          return;
        }
        if (l2 = typeof o, l2 === "number") {
          if (o === 0) {
            d.s = 1 / o < 0 ? -1 : 1, d.e = 0, d.d = [0];
            return;
          }
          if (o < 0 ? (o = -o, d.s = -1) : d.s = 1, o === ~~o && o < 1e7) {
            for (s = 0, a = o; a >= 10; a /= 10) s++;
            _ ? s > i.maxE ? (d.e = NaN, d.d = null) : s < i.minE ? (d.e = 0, d.d = [0]) : (d.e = s, d.d = [o]) : (d.e = s, d.d = [o]);
            return;
          }
          if (o * 0 !== 0) {
            o || (d.s = NaN), d.e = NaN, d.d = null;
            return;
          }
          return xr(d, o.toString());
        }
        if (l2 === "string") return (a = o.charCodeAt(0)) === 45 ? (o = o.slice(1), d.s = -1) : (a === 43 && (o = o.slice(1)), d.s = 1), ho.test(o) ? xr(d, o) : Jl(d, o);
        if (l2 === "bigint") return o < 0 ? (o = -o, d.s = -1) : d.s = 1, xr(d, o.toString());
        throw Error(De + o);
      }
      __name(i, "i");
      if (i.prototype = R, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.EUCLID = 9, i.config = i.set = ou, i.clone = Po, i.isDecimal = co, i.abs = Kl, i.acos = Wl, i.acosh = Hl, i.add = zl, i.asin = Yl, i.asinh = Zl, i.atan = Xl, i.atanh = eu, i.atan2 = tu, i.cbrt = ru, i.ceil = nu, i.clamp = iu, i.cos = su, i.cosh = au, i.div = lu, i.exp = uu, i.floor = cu, i.hypot = pu, i.ln = mu, i.log = fu, i.log10 = gu, i.log2 = du, i.max = hu, i.min = yu, i.mod = wu, i.mul = Eu, i.pow = bu, i.random = xu, i.round = Pu, i.sign = vu, i.sin = Tu, i.sinh = Au, i.sqrt = Ru, i.sub = Cu, i.sum = Su, i.tan = Iu, i.tanh = Ou, i.trunc = ku, e === void 0 && (e = {}), e && e.defaults !== true) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
      return i.config(e), i;
    }
    __name(Po, "Po");
    function lu(e, t) {
      return new this(e).div(t);
    }
    __name(lu, "lu");
    function uu(e) {
      return new this(e).exp();
    }
    __name(uu, "uu");
    function cu(e) {
      return k2(e = new this(e), e.e + 1, 3);
    }
    __name(cu, "cu");
    function pu() {
      var e, t, r = new this(0);
      for (_ = false, e = 0; e < arguments.length; ) if (t = new this(arguments[e++]), t.d) r.d && (r = r.plus(t.times(t)));
      else {
        if (t.s) return _ = true, new this(1 / 0);
        r = t;
      }
      return _ = true, r.sqrt();
    }
    __name(pu, "pu");
    function co(e) {
      return e instanceof Te || e && e.toStringTag === go || false;
    }
    __name(co, "co");
    function mu(e) {
      return new this(e).ln();
    }
    __name(mu, "mu");
    function fu(e, t) {
      return new this(e).log(t);
    }
    __name(fu, "fu");
    function du(e) {
      return new this(e).log(2);
    }
    __name(du, "du");
    function gu(e) {
      return new this(e).log(10);
    }
    __name(gu, "gu");
    function hu() {
      return Eo(this, arguments, -1);
    }
    __name(hu, "hu");
    function yu() {
      return Eo(this, arguments, 1);
    }
    __name(yu, "yu");
    function wu(e, t) {
      return new this(e).mod(t);
    }
    __name(wu, "wu");
    function Eu(e, t) {
      return new this(e).mul(t);
    }
    __name(Eu, "Eu");
    function bu(e, t) {
      return new this(e).pow(t);
    }
    __name(bu, "bu");
    function xu(e) {
      var t, r, n, i, o = 0, s = new this(1), a = [];
      if (e === void 0 ? e = this.precision : oe(e, 1, Me), n = Math.ceil(e / D), this.crypto) if (crypto.getRandomValues) for (t = crypto.getRandomValues(new Uint32Array(n)); o < n; ) i = t[o], i >= 429e7 ? t[o] = crypto.getRandomValues(new Uint32Array(1))[0] : a[o++] = i % 1e7;
      else if (crypto.randomBytes) {
        for (t = crypto.randomBytes(n *= 4); o < n; ) i = t[o] + (t[o + 1] << 8) + (t[o + 2] << 16) + ((t[o + 3] & 127) << 24), i >= 214e7 ? crypto.randomBytes(4).copy(t, o) : (a.push(i % 1e7), o += 4);
        o = n / 4;
      } else throw Error(fo);
      else for (; o < n; ) a[o++] = Math.random() * 1e7 | 0;
      for (n = a[--o], e %= D, n && e && (i = K(10, D - e), a[o] = (n / i | 0) * i); a[o] === 0; o--) a.pop();
      if (o < 0) r = 0, a = [0];
      else {
        for (r = -1; a[0] === 0; r -= D) a.shift();
        for (n = 1, i = a[0]; i >= 10; i /= 10) n++;
        n < D && (r -= D - n);
      }
      return s.e = r, s.d = a, s;
    }
    __name(xu, "xu");
    function Pu(e) {
      return k2(e = new this(e), e.e + 1, this.rounding);
    }
    __name(Pu, "Pu");
    function vu(e) {
      return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
    }
    __name(vu, "vu");
    function Tu(e) {
      return new this(e).sin();
    }
    __name(Tu, "Tu");
    function Au(e) {
      return new this(e).sinh();
    }
    __name(Au, "Au");
    function Ru(e) {
      return new this(e).sqrt();
    }
    __name(Ru, "Ru");
    function Cu(e, t) {
      return new this(e).sub(t);
    }
    __name(Cu, "Cu");
    function Su() {
      var e = 0, t = arguments, r = new this(t[e]);
      for (_ = false; r.s && ++e < t.length; ) r = r.plus(t[e]);
      return _ = true, k2(r, this.precision, this.rounding);
    }
    __name(Su, "Su");
    function Iu(e) {
      return new this(e).tan();
    }
    __name(Iu, "Iu");
    function Ou(e) {
      return new this(e).tanh();
    }
    __name(Ou, "Ou");
    function ku(e) {
      return k2(e = new this(e), e.e + 1, 1);
    }
    __name(ku, "ku");
    R[Symbol.for("nodejs.util.inspect.custom")] = R.toString;
    R[Symbol.toStringTag] = "Decimal";
    var Te = R.constructor = Po(kn);
    Pr = new Te(Pr);
    vr = new Te(vr);
    var Ae = Te;
    function rt(e) {
      return Te.isDecimal(e) ? true : e !== null && typeof e == "object" && typeof e.s == "number" && typeof e.e == "number" && typeof e.toFixed == "function" && Array.isArray(e.d);
    }
    __name(rt, "rt");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Dt = {};
    vt(Dt, { ModelAction: /* @__PURE__ */ __name(() => kt, "ModelAction"), datamodelEnumToSchemaEnum: /* @__PURE__ */ __name(() => Du, "datamodelEnumToSchemaEnum") });
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Du(e) {
      return { name: e.name, values: e.values.map((t) => t.name) };
    }
    __name(Du, "Du");
    f2();
    u();
    c();
    p2();
    m();
    var kt = ((O) => (O.findUnique = "findUnique", O.findUniqueOrThrow = "findUniqueOrThrow", O.findFirst = "findFirst", O.findFirstOrThrow = "findFirstOrThrow", O.findMany = "findMany", O.create = "create", O.createMany = "createMany", O.createManyAndReturn = "createManyAndReturn", O.update = "update", O.updateMany = "updateMany", O.updateManyAndReturn = "updateManyAndReturn", O.upsert = "upsert", O.delete = "delete", O.deleteMany = "deleteMany", O.groupBy = "groupBy", O.count = "count", O.aggregate = "aggregate", O.findRaw = "findRaw", O.aggregateRaw = "aggregateRaw", O))(kt || {});
    var Mu = Qe(ro());
    var _u = { red: Ye, gray: $i, dim: mr, bold: pr, underline: Li, highlightSource: /* @__PURE__ */ __name((e) => e.highlight(), "highlightSource") };
    var Nu = { red: /* @__PURE__ */ __name((e) => e, "red"), gray: /* @__PURE__ */ __name((e) => e, "gray"), dim: /* @__PURE__ */ __name((e) => e, "dim"), bold: /* @__PURE__ */ __name((e) => e, "bold"), underline: /* @__PURE__ */ __name((e) => e, "underline"), highlightSource: /* @__PURE__ */ __name((e) => e, "highlightSource") };
    function Fu({ message: e, originalMethod: t, isPanic: r, callArguments: n }) {
      return { functionName: `prisma.${t}()`, message: e, isPanic: r ?? false, callArguments: n };
    }
    __name(Fu, "Fu");
    function Lu({ functionName: e, location: t, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
      let a = [""], l2 = t ? " in" : ":";
      if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l2}`))) : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l2}`)), t && a.push(s.underline(Uu(t))), i) {
        a.push("");
        let d = [i.toString()];
        o && (d.push(o), d.push(s.dim(")"))), a.push(d.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(r), a.join(`
`);
    }
    __name(Lu, "Lu");
    function Uu(e) {
      let t = [e.fileName];
      return e.lineNumber && t.push(String(e.lineNumber)), e.columnNumber && t.push(String(e.columnNumber)), t.join(":");
    }
    __name(Uu, "Uu");
    function Sr(e) {
      let t = e.showColors ? _u : Nu, r;
      return typeof $getTemplateParameters < "u" ? r = $getTemplateParameters(e, t) : r = Fu(e), Lu(r, t);
    }
    __name(Sr, "Sr");
    f2();
    u();
    c();
    p2();
    m();
    var ko = Qe(Nn());
    f2();
    u();
    c();
    p2();
    m();
    function Ro(e, t, r) {
      let n = Co(e), i = Bu(n), o = Vu(i);
      o ? Ir(o, t, r) : t.addErrorMessage(() => "Unknown error");
    }
    __name(Ro, "Ro");
    function Co(e) {
      return e.errors.flatMap((t) => t.kind === "Union" ? Co(t) : [t]);
    }
    __name(Co, "Co");
    function Bu(e) {
      let t = /* @__PURE__ */ new Map(), r = [];
      for (let n of e) {
        if (n.kind !== "InvalidArgumentType") {
          r.push(n);
          continue;
        }
        let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = t.get(i);
        o ? t.set(i, { ...n, argument: { ...n.argument, typeNames: qu(o.argument.typeNames, n.argument.typeNames) } }) : t.set(i, n);
      }
      return r.push(...t.values()), r;
    }
    __name(Bu, "Bu");
    function qu(e, t) {
      return [...new Set(e.concat(t))];
    }
    __name(qu, "qu");
    function Vu(e) {
      return Sn(e, (t, r) => {
        let n = To(t), i = To(r);
        return n !== i ? n - i : Ao(t) - Ao(r);
      });
    }
    __name(Vu, "Vu");
    function To(e) {
      let t = 0;
      return Array.isArray(e.selectionPath) && (t += e.selectionPath.length), Array.isArray(e.argumentPath) && (t += e.argumentPath.length), t;
    }
    __name(To, "To");
    function Ao(e) {
      switch (e.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    __name(Ao, "Ao");
    f2();
    u();
    c();
    p2();
    m();
    var ue = class {
      static {
        __name(this, "ue");
      }
      constructor(t, r) {
        this.name = t;
        this.value = r;
      }
      isRequired = false;
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(t) {
        let { colors: { green: r } } = t.context;
        t.addMarginSymbol(r(this.isRequired ? "+" : "?")), t.write(r(this.name)), this.isRequired || t.write(r("?")), t.write(r(": ")), typeof this.value == "string" ? t.write(r(this.value)) : t.write(this.value);
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    Io();
    f2();
    u();
    c();
    p2();
    m();
    var nt = class {
      static {
        __name(this, "nt");
      }
      constructor(t = 0, r) {
        this.context = r;
        this.currentIndent = t;
      }
      lines = [];
      currentLine = "";
      currentIndent = 0;
      marginSymbol;
      afterNextNewLineCallback;
      write(t) {
        return typeof t == "string" ? this.currentLine += t : t.write(this), this;
      }
      writeJoined(t, r, n = (i, o) => o.write(i)) {
        let i = r.length - 1;
        for (let o = 0; o < r.length; o++) n(r[o], this), o !== i && this.write(t);
        return this;
      }
      writeLine(t) {
        return this.write(t).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let t = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, t?.(), this;
      }
      withIndent(t) {
        return this.indent(), t(this), this.unindent(), this;
      }
      afterNextNewline(t) {
        return this.afterNextNewLineCallback = t, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(t) {
        return this.marginSymbol = t, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let t = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + t.slice(1) : t;
      }
    };
    So();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Or = class {
      static {
        __name(this, "Or");
      }
      constructor(t) {
        this.value = t;
      }
      write(t) {
        t.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var kr = /* @__PURE__ */ __name((e) => e, "kr");
    var Dr = { bold: kr, red: kr, green: kr, dim: kr, enabled: false };
    var Oo = { bold: pr, red: Ye, green: Ui, dim: mr, enabled: true };
    var it = { write(e) {
      e.writeLine(",");
    } };
    f2();
    u();
    c();
    p2();
    m();
    var we = class {
      static {
        __name(this, "we");
      }
      constructor(t) {
        this.contents = t;
      }
      isUnderlined = false;
      color = /* @__PURE__ */ __name((t) => t, "color");
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(t) {
        return this.color = t, this;
      }
      write(t) {
        let r = t.getCurrentLineLength();
        t.write(this.color(this.contents)), this.isUnderlined && t.afterNextNewline(() => {
          t.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var _e = class {
      static {
        __name(this, "_e");
      }
      hasError = false;
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var ot = class extends _e {
      static {
        __name(this, "ot");
      }
      items = [];
      addItem(t) {
        return this.items.push(new Or(t)), this;
      }
      getField(t) {
        return this.items[t];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((r) => r.value.getPrintWidth())) + 2;
      }
      write(t) {
        if (this.items.length === 0) {
          this.writeEmpty(t);
          return;
        }
        this.writeWithItems(t);
      }
      writeEmpty(t) {
        let r = new we("[]");
        this.hasError && r.setColor(t.context.colors.red).underline(), t.write(r);
      }
      writeWithItems(t) {
        let { colors: r } = t.context;
        t.writeLine("[").withIndent(() => t.writeJoined(it, this.items).newLine()).write("]"), this.hasError && t.afterNextNewline(() => {
          t.writeLine(r.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var st = class e extends _e {
      static {
        __name(this, "e");
      }
      fields = {};
      suggestions = [];
      addField(t) {
        this.fields[t.name] = t;
      }
      addSuggestion(t) {
        this.suggestions.push(t);
      }
      getField(t) {
        return this.fields[t];
      }
      getDeepField(t) {
        let [r, ...n] = t, i = this.getField(r);
        if (!i) return;
        let o = i;
        for (let s of n) {
          let a;
          if (o.value instanceof e ? a = o.value.getField(s) : o.value instanceof ot && (a = o.value.getField(Number(s))), !a) return;
          o = a;
        }
        return o;
      }
      getDeepFieldValue(t) {
        return t.length === 0 ? this : this.getDeepField(t)?.value;
      }
      hasField(t) {
        return !!this.getField(t);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(t) {
        delete this.fields[t];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(t) {
        return this.getField(t)?.value;
      }
      getDeepSubSelectionValue(t) {
        let r = this;
        for (let n of t) {
          if (!(r instanceof e)) return;
          let i = r.getSubSelectionValue(n);
          if (!i) return;
          r = i;
        }
        return r;
      }
      getDeepSelectionParent(t) {
        let r = this.getSelectionParent();
        if (!r) return;
        let n = r;
        for (let i of t) {
          let o = n.value.getFieldValue(i);
          if (!o || !(o instanceof e)) return;
          let s = o.getSelectionParent();
          if (!s) return;
          n = s;
        }
        return n;
      }
      getSelectionParent() {
        let t = this.getField("select")?.value.asObject();
        if (t) return { kind: "select", value: t };
        let r = this.getField("include")?.value.asObject();
        if (r) return { kind: "include", value: r };
      }
      getSubSelectionValue(t) {
        return this.getSelectionParent()?.value.fields[t].value;
      }
      getPrintWidth() {
        let t = Object.values(this.fields);
        return t.length == 0 ? 2 : Math.max(...t.map((n) => n.getPrintWidth())) + 2;
      }
      write(t) {
        let r = Object.values(this.fields);
        if (r.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(t);
          return;
        }
        this.writeWithContents(t, r);
      }
      asObject() {
        return this;
      }
      writeEmpty(t) {
        let r = new we("{}");
        this.hasError && r.setColor(t.context.colors.red).underline(), t.write(r);
      }
      writeWithContents(t, r) {
        t.writeLine("{").withIndent(() => {
          t.writeJoined(it, [...r, ...this.suggestions]).newLine();
        }), t.write("}"), this.hasError && t.afterNextNewline(() => {
          t.writeLine(t.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var H = class extends _e {
      static {
        __name(this, "H");
      }
      constructor(r) {
        super();
        this.text = r;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(r) {
        let n = new we(this.text);
        this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
      }
      asObject() {
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var Mt = class {
      static {
        __name(this, "Mt");
      }
      fields = [];
      addField(t, r) {
        return this.fields.push({ write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${t}: ${r}`))).addMarginSymbol(i(o("+")));
        } }), this;
      }
      write(t) {
        let { colors: { green: r } } = t.context;
        t.writeLine(r("{")).withIndent(() => {
          t.writeJoined(it, this.fields).newLine();
        }).write(r("}")).addMarginSymbol(r("+"));
      }
    };
    function Ir(e, t, r) {
      switch (e.kind) {
        case "MutuallyExclusiveFields":
          $u(e, t);
          break;
        case "IncludeOnScalar":
          ju(e, t);
          break;
        case "EmptySelection":
          Gu(e, t, r);
          break;
        case "UnknownSelectionField":
          Wu(e, t);
          break;
        case "InvalidSelectionValue":
          Hu(e, t);
          break;
        case "UnknownArgument":
          zu(e, t);
          break;
        case "UnknownInputField":
          Yu(e, t);
          break;
        case "RequiredArgumentMissing":
          Zu(e, t);
          break;
        case "InvalidArgumentType":
          Xu(e, t);
          break;
        case "InvalidArgumentValue":
          ec(e, t);
          break;
        case "ValueTooLarge":
          tc(e, t);
          break;
        case "SomeFieldsMissing":
          rc(e, t);
          break;
        case "TooManyFieldsGiven":
          nc(e, t);
          break;
        case "Union":
          Ro(e, t, r);
          break;
        default:
          throw new Error("not implemented: " + e.kind);
      }
    }
    __name(Ir, "Ir");
    function $u(e, t) {
      let r = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      r && (r.getField(e.firstField)?.markAsError(), r.getField(e.secondField)?.markAsError()), t.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    __name($u, "$u");
    function ju(e, t) {
      let [r, n] = at(e.selectionPath), i = e.outputType, o = t.arguments.getDeepSelectionParent(r)?.value;
      if (o && (o.getField(n)?.markAsError(), i)) for (let s of i.fields) s.isRelation && o.addSuggestion(new ue(s.name, "true"));
      t.addErrorMessage((s) => {
        let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
        return i ? a += ` on model ${s.bold(i.name)}. ${_t(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
      });
    }
    __name(ju, "ju");
    function Gu(e, t, r) {
      let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getField("omit")?.value.asObject();
        if (i) {
          Ju(e, t, i);
          return;
        }
        if (n.hasField("select")) {
          Qu(e, t);
          return;
        }
      }
      if (r?.[Ie(e.outputType.name)]) {
        Ku(e, t);
        return;
      }
      t.addErrorMessage(() => `Unknown field at "${e.selectionPath.join(".")} selection"`);
    }
    __name(Gu, "Gu");
    function Ju(e, t, r) {
      r.removeAllFields();
      for (let n of e.outputType.fields) r.addSuggestion(new ue(n.name, "false"));
      t.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    __name(Ju, "Ju");
    function Qu(e, t) {
      let r = e.outputType, n = t.arguments.getDeepSelectionParent(e.selectionPath)?.value, i = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), _o(n, r)), t.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${_t(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    __name(Qu, "Qu");
    function Ku(e, t) {
      let r = new Mt();
      for (let i of e.outputType.fields) i.isRelation || r.addField(i.name, "false");
      let n = new ue("omit", r).makeRequired();
      if (e.selectionPath.length === 0) t.arguments.addSuggestion(n);
      else {
        let [i, o] = at(e.selectionPath), a = t.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
        if (a) {
          let l2 = a?.value.asObject() ?? new st();
          l2.addSuggestion(n), a.value = l2;
        }
      }
      t.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);
    }
    __name(Ku, "Ku");
    function Wu(e, t) {
      let r = No(e.selectionPath, t);
      if (r.parentKind !== "unknown") {
        r.field.markAsError();
        let n = r.parent;
        switch (r.parentKind) {
          case "select":
            _o(n, e.outputType);
            break;
          case "include":
            ic(n, e.outputType);
            break;
          case "omit":
            oc(n, e.outputType);
            break;
        }
      }
      t.addErrorMessage((n) => {
        let i = [`Unknown field ${n.red(`\`${r.fieldName}\``)}`];
        return r.parentKind !== "unknown" && i.push(`for ${n.bold(r.parentKind)} statement`), i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`), i.push(_t(n)), i.join(" ");
      });
    }
    __name(Wu, "Wu");
    function Hu(e, t) {
      let r = No(e.selectionPath, t);
      r.parentKind !== "unknown" && r.field.value.markAsError(), t.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r.fieldName)}\`: ${e.underlyingError}`);
    }
    __name(Hu, "Hu");
    function zu(e, t) {
      let r = e.argumentPath[0], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && (n.getField(r)?.markAsError(), sc(n, e.arguments)), t.addErrorMessage((i) => Do(i, r, e.arguments.map((o) => o.name)));
    }
    __name(zu, "zu");
    function Yu(e, t) {
      let [r, n] = at(e.argumentPath), i = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (i) {
        i.getDeepField(e.argumentPath)?.markAsError();
        let o = i.getDeepFieldValue(r)?.asObject();
        o && Fo(o, e.inputType);
      }
      t.addErrorMessage((o) => Do(o, n, e.inputType.fields.map((s) => s.name)));
    }
    __name(Yu, "Yu");
    function Do(e, t, r) {
      let n = [`Unknown argument \`${e.red(t)}\`.`], i = lc(t, r);
      return i && n.push(`Did you mean \`${e.green(i)}\`?`), r.length > 0 && n.push(_t(e)), n.join(" ");
    }
    __name(Do, "Do");
    function Zu(e, t) {
      let r;
      t.addErrorMessage((l2) => r?.value instanceof H && r.value.text === "null" ? `Argument \`${l2.green(o)}\` must not be ${l2.red("null")}.` : `Argument \`${l2.green(o)}\` is missing.`);
      let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (!n) return;
      let [i, o] = at(e.argumentPath), s = new Mt(), a = n.getDeepFieldValue(i)?.asObject();
      if (a) {
        if (r = a.getField(o), r && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === "object") {
          for (let l2 of e.inputTypes[0].fields) s.addField(l2.name, l2.typeNames.join(" | "));
          a.addSuggestion(new ue(o, s).makeRequired());
        } else {
          let l2 = e.inputTypes.map(Mo).join(" | ");
          a.addSuggestion(new ue(o, l2).makeRequired());
        }
        if (e.dependentArgumentPath) {
          n.getDeepField(e.dependentArgumentPath)?.markAsError();
          let [, l2] = at(e.dependentArgumentPath);
          t.addErrorMessage((d) => `Argument \`${d.green(o)}\` is required because argument \`${d.green(l2)}\` was provided.`);
        }
      }
    }
    __name(Zu, "Zu");
    function Mo(e) {
      return e.kind === "list" ? `${Mo(e.elementType)}[]` : e.name;
    }
    __name(Mo, "Mo");
    function Xu(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
        let o = Mr("or", e.argument.typeNames.map((s) => i.green(s)));
        return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
      });
    }
    __name(Xu, "Xu");
    function ec(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
        let o = [`Invalid value for argument \`${i.bold(r)}\``];
        if (e.underlyingError && o.push(`: ${e.underlyingError}`), o.push("."), e.argument.typeNames.length > 0) {
          let s = Mr("or", e.argument.typeNames.map((a) => i.green(a)));
          o.push(` Expected ${s}.`);
        }
        return o.join("");
      });
    }
    __name(ec, "ec");
    function tc(e, t) {
      let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i;
      if (n) {
        let s = n.getDeepField(e.argumentPath)?.value;
        s?.markAsError(), s instanceof H && (i = s.text);
      }
      t.addErrorMessage((o) => {
        let s = ["Unable to fit value"];
        return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(" ");
      });
    }
    __name(tc, "tc");
    function rc(e, t) {
      let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
      if (n) {
        let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
        i && Fo(i, e.inputType);
      }
      t.addErrorMessage((i) => {
        let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 ? e.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${Mr("or", e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`), o.push(_t(i)), o.join(" ");
      });
    }
    __name(rc, "rc");
    function nc(e, t) {
      let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i = [];
      if (n) {
        let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
        o && (o.markAsError(), i = Object.keys(o.getFields()));
      }
      t.addErrorMessage((o) => {
        let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(e.inputType.name)} needs`];
        return e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : e.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${Mr("and", i.map((a) => o.red(a)))}. Please choose`), e.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${e.constraints.maxFieldCount}.`), s.join(" ");
      });
    }
    __name(nc, "nc");
    function _o(e, t) {
      for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new ue(r.name, "true"));
    }
    __name(_o, "_o");
    function ic(e, t) {
      for (let r of t.fields) r.isRelation && !e.hasField(r.name) && e.addSuggestion(new ue(r.name, "true"));
    }
    __name(ic, "ic");
    function oc(e, t) {
      for (let r of t.fields) !e.hasField(r.name) && !r.isRelation && e.addSuggestion(new ue(r.name, "true"));
    }
    __name(oc, "oc");
    function sc(e, t) {
      for (let r of t) e.hasField(r.name) || e.addSuggestion(new ue(r.name, r.typeNames.join(" | ")));
    }
    __name(sc, "sc");
    function No(e, t) {
      let [r, n] = at(e), i = t.arguments.getDeepSubSelectionValue(r)?.asObject();
      if (!i) return { parentKind: "unknown", fieldName: n };
      let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), l2 = o?.getField(n);
      return o && l2 ? { parentKind: "select", parent: o, field: l2, fieldName: n } : (l2 = s?.getField(n), s && l2 ? { parentKind: "include", field: l2, parent: s, fieldName: n } : (l2 = a?.getField(n), a && l2 ? { parentKind: "omit", field: l2, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    __name(No, "No");
    function Fo(e, t) {
      if (t.kind === "object") for (let r of t.fields) e.hasField(r.name) || e.addSuggestion(new ue(r.name, r.typeNames.join(" | ")));
    }
    __name(Fo, "Fo");
    function at(e) {
      let t = [...e], r = t.pop();
      if (!r) throw new Error("unexpected empty path");
      return [t, r];
    }
    __name(at, "at");
    function _t({ green: e, enabled: t }) {
      return "Available options are " + (t ? `listed in ${e("green")}` : "marked with ?") + ".";
    }
    __name(_t, "_t");
    function Mr(e, t) {
      if (t.length === 1) return t[0];
      let r = [...t], n = r.pop();
      return `${r.join(", ")} ${e} ${n}`;
    }
    __name(Mr, "Mr");
    var ac = 3;
    function lc(e, t) {
      let r = 1 / 0, n;
      for (let i of t) {
        let o = (0, ko.default)(e, i);
        o > ac || o < r && (r = o, n = i);
      }
      return n;
    }
    __name(lc, "lc");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Nt = class {
      static {
        __name(this, "Nt");
      }
      modelName;
      name;
      typeName;
      isList;
      isEnum;
      constructor(t, r, n, i, o) {
        this.modelName = t, this.name = r, this.typeName = n, this.isList = i, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let t = this.isList ? "List" : "", r = this.isEnum ? "Enum" : "";
        return `${t}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function lt(e) {
      return e instanceof Nt;
    }
    __name(lt, "lt");
    f2();
    u();
    c();
    p2();
    m();
    var _r = Symbol();
    var Ln = /* @__PURE__ */ new WeakMap();
    var Re = class {
      static {
        __name(this, "Re");
      }
      constructor(t) {
        t === _r ? Ln.set(this, `Prisma.${this._getName()}`) : Ln.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return Ln.get(this);
      }
    };
    var Ft = class extends Re {
      static {
        __name(this, "Ft");
      }
      _getNamespace() {
        return "NullTypes";
      }
    };
    var Lt = class extends Ft {
      static {
        __name(this, "Lt");
      }
      #e;
    };
    Un(Lt, "DbNull");
    var Ut = class extends Ft {
      static {
        __name(this, "Ut");
      }
      #e;
    };
    Un(Ut, "JsonNull");
    var Bt = class extends Ft {
      static {
        __name(this, "Bt");
      }
      #e;
    };
    Un(Bt, "AnyNull");
    var Nr = { classes: { DbNull: Lt, JsonNull: Ut, AnyNull: Bt }, instances: { DbNull: new Lt(_r), JsonNull: new Ut(_r), AnyNull: new Bt(_r) } };
    function Un(e, t) {
      Object.defineProperty(e, "name", { value: t, configurable: true });
    }
    __name(Un, "Un");
    f2();
    u();
    c();
    p2();
    m();
    var Lo = ": ";
    var Fr = class {
      static {
        __name(this, "Fr");
      }
      constructor(t, r) {
        this.name = t;
        this.value = r;
      }
      hasError = false;
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + Lo.length;
      }
      write(t) {
        let r = new we(this.name);
        this.hasError && r.underline().setColor(t.context.colors.red), t.write(r).write(Lo).write(this.value);
      }
    };
    var Bn = class {
      static {
        __name(this, "Bn");
      }
      arguments;
      errorMessages = [];
      constructor(t) {
        this.arguments = t;
      }
      write(t) {
        t.write(this.arguments);
      }
      addErrorMessage(t) {
        this.errorMessages.push(t);
      }
      renderAllMessages(t) {
        return this.errorMessages.map((r) => r(t)).join(`
`);
      }
    };
    function ut(e) {
      return new Bn(Uo(e));
    }
    __name(ut, "ut");
    function Uo(e) {
      let t = new st();
      for (let [r, n] of Object.entries(e)) {
        let i = new Fr(r, Bo(n));
        t.addField(i);
      }
      return t;
    }
    __name(Uo, "Uo");
    function Bo(e) {
      if (typeof e == "string") return new H(JSON.stringify(e));
      if (typeof e == "number" || typeof e == "boolean") return new H(String(e));
      if (typeof e == "bigint") return new H(`${e}n`);
      if (e === null) return new H("null");
      if (e === void 0) return new H("undefined");
      if (rt(e)) return new H(`new Prisma.Decimal("${e.toFixed()}")`);
      if (e instanceof Uint8Array) return w2.Buffer.isBuffer(e) ? new H(`Buffer.alloc(${e.byteLength})`) : new H(`new Uint8Array(${e.byteLength})`);
      if (e instanceof Date) {
        let t = Er(e) ? e.toISOString() : "Invalid Date";
        return new H(`new Date("${t}")`);
      }
      return e instanceof Re ? new H(`Prisma.${e._getName()}`) : lt(e) ? new H(`prisma.${Ie(e.modelName)}.$fields.${e.name}`) : Array.isArray(e) ? uc(e) : typeof e == "object" ? Uo(e) : new H(Object.prototype.toString.call(e));
    }
    __name(Bo, "Bo");
    function uc(e) {
      let t = new ot();
      for (let r of e) t.addItem(Bo(r));
      return t;
    }
    __name(uc, "uc");
    function Lr(e, t) {
      let r = t === "pretty" ? Oo : Dr, n = e.renderAllMessages(r), i = new nt(0, { colors: r }).write(e).toString();
      return { message: n, args: i };
    }
    __name(Lr, "Lr");
    function Ur({ args: e, errors: t, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
      let a = ut(e);
      for (let h of t) Ir(h, a, s);
      let { message: l2, args: d } = Lr(a, r), g = Sr({ message: l2, callsite: n, originalMethod: i, showColors: r === "pretty", callArguments: d });
      throw new X(g, { clientVersion: o });
    }
    __name(Ur, "Ur");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function Ee(e) {
      return e.replace(/^./, (t) => t.toLowerCase());
    }
    __name(Ee, "Ee");
    f2();
    u();
    c();
    p2();
    m();
    function Vo(e, t, r) {
      let n = Ee(r);
      return !t.result || !(t.result.$allModels || t.result[n]) ? e : cc({ ...e, ...qo(t.name, e, t.result.$allModels), ...qo(t.name, e, t.result[n]) });
    }
    __name(Vo, "Vo");
    function cc(e) {
      let t = new ge(), r = /* @__PURE__ */ __name((n, i) => t.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => r(o, i)) : [n])), "r");
      return wr(e, (n) => ({ ...n, needs: r(n.name, /* @__PURE__ */ new Set()) }));
    }
    __name(cc, "cc");
    function qo(e, t, r) {
      return r ? wr(r, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: pc(t, o, i) })) : {};
    }
    __name(qo, "qo");
    function pc(e, t, r) {
      let n = e?.[t]?.compute;
      return n ? (i) => r({ ...i, [t]: n(i) }) : r;
    }
    __name(pc, "pc");
    function $o(e, t) {
      if (!t) return e;
      let r = { ...e };
      for (let n of Object.values(t)) if (e[n.name]) for (let i of n.needs) r[i] = true;
      return r;
    }
    __name($o, "$o");
    function jo(e, t) {
      if (!t) return e;
      let r = { ...e };
      for (let n of Object.values(t)) if (!e[n.name]) for (let i of n.needs) delete r[i];
      return r;
    }
    __name(jo, "jo");
    var Br = class {
      static {
        __name(this, "Br");
      }
      constructor(t, r) {
        this.extension = t;
        this.previous = r;
      }
      computedFieldsCache = new ge();
      modelExtensionsCache = new ge();
      queryCallbacksCache = new ge();
      clientExtensions = It(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
      batchCallbacks = It(() => {
        let t = this.previous?.getAllBatchQueryCallbacks() ?? [], r = this.extension.query?.$__internalBatch;
        return r ? t.concat(r) : t;
      });
      getAllComputedFields(t) {
        return this.computedFieldsCache.getOrCreate(t, () => Vo(this.previous?.getAllComputedFields(t), this.extension, t));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(t) {
        return this.modelExtensionsCache.getOrCreate(t, () => {
          let r = Ee(t);
          return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(t) : { ...this.previous?.getAllModelExtensions(t), ...this.extension.model.$allModels, ...this.extension.model[r] };
        });
      }
      getAllQueryCallbacks(t, r) {
        return this.queryCallbacksCache.getOrCreate(`${t}:${r}`, () => {
          let n = this.previous?.getAllQueryCallbacks(t, r) ?? [], i = [], o = this.extension.query;
          return !o || !(o[t] || o.$allModels || o[r] || o.$allOperations) ? n : (o[t] !== void 0 && (o[t][r] !== void 0 && i.push(o[t][r]), o[t].$allOperations !== void 0 && i.push(o[t].$allOperations)), t !== "$none" && o.$allModels !== void 0 && (o.$allModels[r] !== void 0 && i.push(o.$allModels[r]), o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)), o[r] !== void 0 && i.push(o[r]), o.$allOperations !== void 0 && i.push(o.$allOperations), n.concat(i));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var ct = class e {
      static {
        __name(this, "e");
      }
      constructor(t) {
        this.head = t;
      }
      static empty() {
        return new e();
      }
      static single(t) {
        return new e(new Br(t));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(t) {
        return new e(new Br(t, this.head));
      }
      getAllComputedFields(t) {
        return this.head?.getAllComputedFields(t);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(t) {
        return this.head?.getAllModelExtensions(t);
      }
      getAllQueryCallbacks(t, r) {
        return this.head?.getAllQueryCallbacks(t, r) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    var qr = class {
      static {
        __name(this, "qr");
      }
      constructor(t) {
        this.name = t;
      }
    };
    function Go(e) {
      return e instanceof qr;
    }
    __name(Go, "Go");
    function Jo(e) {
      return new qr(e);
    }
    __name(Jo, "Jo");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qo = Symbol();
    var qt = class {
      static {
        __name(this, "qt");
      }
      constructor(t) {
        if (t !== Qo) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(t) {
        return t === void 0 ? Vr : t;
      }
    };
    var Vr = new qt(Qo);
    function be(e) {
      return e instanceof qt;
    }
    __name(be, "be");
    var mc = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var Ko = "explicitly `undefined` values are not allowed";
    function $r({ modelName: e, action: t, args: r, runtimeDataModel: n, extensions: i = ct.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: l2, previewFeatures: d, globalOmit: g }) {
      let h = new qn({ runtimeDataModel: n, modelName: e, action: t, rootArgs: r, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: l2, previewFeatures: d, globalOmit: g });
      return { modelName: e, action: mc[t], query: Vt(r, h) };
    }
    __name($r, "$r");
    function Vt({ select: e, include: t, ...r } = {}, n) {
      let i = r.omit;
      return delete r.omit, { arguments: Ho(r, n), selection: fc(e, t, i, n) };
    }
    __name(Vt, "Vt");
    function fc(e, t, r, n) {
      return e ? (t ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), yc(e, n)) : dc(n, t, r);
    }
    __name(fc, "fc");
    function dc(e, t, r) {
      let n = {};
      return e.modelOrType && !e.isRawAction() && (n.$composites = true, n.$scalars = true), t && gc(n, t, e), hc(n, r, e), n;
    }
    __name(dc, "dc");
    function gc(e, t, r) {
      for (let [n, i] of Object.entries(t)) {
        if (be(i)) continue;
        let o = r.nestSelection(n);
        if (Vn(i, o), i === false || i === void 0) {
          e[n] = false;
          continue;
        }
        let s = r.findField(n);
        if (s && s.kind !== "object" && r.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r.getSelectionPath().concat(n), outputType: r.getOutputTypeDescription() }), s) {
          e[n] = Vt(i === true ? {} : i, o);
          continue;
        }
        if (i === true) {
          e[n] = true;
          continue;
        }
        e[n] = Vt(i, o);
      }
    }
    __name(gc, "gc");
    function hc(e, t, r) {
      let n = r.getComputedFields(), i = { ...r.getGlobalOmit(), ...t }, o = jo(i, n);
      for (let [s, a] of Object.entries(o)) {
        if (be(a)) continue;
        Vn(a, r.nestSelection(s));
        let l2 = r.findField(s);
        n?.[s] && !l2 || (e[s] = !a);
      }
    }
    __name(hc, "hc");
    function yc(e, t) {
      let r = {}, n = t.getComputedFields(), i = $o(e, n);
      for (let [o, s] of Object.entries(i)) {
        if (be(s)) continue;
        let a = t.nestSelection(o);
        Vn(s, a);
        let l2 = t.findField(o);
        if (!(n?.[o] && !l2)) {
          if (s === false || s === void 0 || be(s)) {
            r[o] = false;
            continue;
          }
          if (s === true) {
            l2?.kind === "object" ? r[o] = Vt({}, a) : r[o] = true;
            continue;
          }
          r[o] = Vt(s, a);
        }
      }
      return r;
    }
    __name(yc, "yc");
    function Wo(e, t) {
      if (e === null) return null;
      if (typeof e == "string" || typeof e == "number" || typeof e == "boolean") return e;
      if (typeof e == "bigint") return { $type: "BigInt", value: String(e) };
      if (Xe(e)) {
        if (Er(e)) return { $type: "DateTime", value: e.toISOString() };
        t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (Go(e)) return { $type: "Param", value: e.name };
      if (lt(e)) return { $type: "FieldRef", value: { _ref: e.name, _container: e.modelName } };
      if (Array.isArray(e)) return wc(e, t);
      if (ArrayBuffer.isView(e)) {
        let { buffer: r, byteOffset: n, byteLength: i } = e;
        return { $type: "Bytes", value: w2.Buffer.from(r, n, i).toString("base64") };
      }
      if (Ec(e)) return e.values;
      if (rt(e)) return { $type: "Decimal", value: e.toFixed() };
      if (e instanceof Re) {
        if (e !== Nr.instances[e._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: e._getName() };
      }
      if (bc(e)) return e.toJSON();
      if (typeof e == "object") return Ho(e, t);
      t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    __name(Wo, "Wo");
    function Ho(e, t) {
      if (e.$type) return { $type: "Raw", value: e };
      let r = {};
      for (let n in e) {
        let i = e[n], o = t.nestArgument(n);
        be(i) || (i !== void 0 ? r[n] = Wo(i, o) : t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: t.getSelectionPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: Ko }));
      }
      return r;
    }
    __name(Ho, "Ho");
    function wc(e, t) {
      let r = [];
      for (let n = 0; n < e.length; n++) {
        let i = t.nestArgument(String(n)), o = e[n];
        if (o === void 0 || be(o)) {
          let s = o === void 0 ? "undefined" : "Prisma.skip";
          t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${t.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
        }
        r.push(Wo(o, i));
      }
      return r;
    }
    __name(wc, "wc");
    function Ec(e) {
      return typeof e == "object" && e !== null && e.__prismaRawParameters__ === true;
    }
    __name(Ec, "Ec");
    function bc(e) {
      return typeof e == "object" && e !== null && typeof e.toJSON == "function";
    }
    __name(bc, "bc");
    function Vn(e, t) {
      e === void 0 && t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: t.getSelectionPath(), underlyingError: Ko });
    }
    __name(Vn, "Vn");
    var qn = class e {
      static {
        __name(this, "e");
      }
      constructor(t) {
        this.params = t;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      modelOrType;
      throwValidationError(t) {
        Ur({ errors: [t], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((t) => ({ name: t.name, typeName: "boolean", isRelation: t.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(t) {
        return this.params.previewFeatures.includes(t);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(t) {
        return this.modelOrType?.fields.find((r) => r.name === t);
      }
      nestSelection(t) {
        let r = this.findField(t), n = r?.kind === "object" ? r.type : void 0;
        return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(t) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[Ie(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "updateManyAndReturn":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            Ue(this.params.action, "Unknown action");
        }
      }
      nestArgument(t) {
        return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(t) });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function zo(e) {
      if (!e._hasPreviewFlag("metrics")) throw new X("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: e._clientVersion });
    }
    __name(zo, "zo");
    var pt = class {
      static {
        __name(this, "pt");
      }
      _client;
      constructor(t) {
        this._client = t;
      }
      prometheus(t) {
        return zo(this._client), this._client._engine.metrics({ format: "prometheus", ...t });
      }
      json(t) {
        return zo(this._client), this._client._engine.metrics({ format: "json", ...t });
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function Yo(e, t) {
      let r = It(() => xc(t));
      Object.defineProperty(e, "dmmf", { get: /* @__PURE__ */ __name(() => r.get(), "get") });
    }
    __name(Yo, "Yo");
    function xc(e) {
      return { datamodel: { models: $n(e.models), enums: $n(e.enums), types: $n(e.types) } };
    }
    __name(xc, "xc");
    function $n(e) {
      return Object.entries(e).map(([t, r]) => ({ name: t, ...r }));
    }
    __name($n, "$n");
    f2();
    u();
    c();
    p2();
    m();
    var jn = /* @__PURE__ */ new WeakMap();
    var jr = "$$PrismaTypedSql";
    var $t = class {
      static {
        __name(this, "$t");
      }
      constructor(t, r) {
        jn.set(this, { sql: t, values: r }), Object.defineProperty(this, jr, { value: jr });
      }
      get sql() {
        return jn.get(this).sql;
      }
      get values() {
        return jn.get(this).values;
      }
    };
    function Zo(e) {
      return (...t) => new $t(e, t);
    }
    __name(Zo, "Zo");
    function Gr(e) {
      return e != null && e[jr] === jr;
    }
    __name(Gr, "Gr");
    f2();
    u();
    c();
    p2();
    m();
    var ha = Qe(Pn());
    f2();
    u();
    c();
    p2();
    m();
    Xo();
    Ki();
    Zi();
    f2();
    u();
    c();
    p2();
    m();
    var se = class e {
      static {
        __name(this, "e");
      }
      constructor(t, r) {
        if (t.length - 1 !== r.length) throw t.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${t.length} strings to have ${t.length - 1} values`);
        let n = r.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = t[0];
        let i = 0, o = 0;
        for (; i < r.length; ) {
          let s = r[i++], a = t[i];
          if (s instanceof e) {
            this.strings[o] += s.strings[0];
            let l2 = 0;
            for (; l2 < s.values.length; ) this.values[o++] = s.values[l2++], this.strings[o] = s.strings[l2];
            this.strings[o] += a;
          } else this.values[o++] = s, this.strings[o] = a;
        }
      }
      get sql() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `?${this.strings[r++]}`;
        return n;
      }
      get statement() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `:${r}${this.strings[r++]}`;
        return n;
      }
      get text() {
        let t = this.strings.length, r = 1, n = this.strings[0];
        for (; r < t; ) n += `$${r}${this.strings[r++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function es(e, t = ",", r = "", n = "") {
      if (e.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new se([r, ...Array(e.length - 1).fill(t), n], e);
    }
    __name(es, "es");
    function Gn(e) {
      return new se([e], []);
    }
    __name(Gn, "Gn");
    var ts = Gn("");
    function Jn(e, ...t) {
      return new se(e, t);
    }
    __name(Jn, "Jn");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function jt(e) {
      return { getKeys() {
        return Object.keys(e);
      }, getPropertyValue(t) {
        return e[t];
      } };
    }
    __name(jt, "jt");
    f2();
    u();
    c();
    p2();
    m();
    function te(e, t) {
      return { getKeys() {
        return [e];
      }, getPropertyValue() {
        return t();
      } };
    }
    __name(te, "te");
    f2();
    u();
    c();
    p2();
    m();
    function Be(e) {
      let t = new ge();
      return { getKeys() {
        return e.getKeys();
      }, getPropertyValue(r) {
        return t.getOrCreate(r, () => e.getPropertyValue(r));
      }, getPropertyDescriptor(r) {
        return e.getPropertyDescriptor?.(r);
      } };
    }
    __name(Be, "Be");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qr = { enumerable: true, configurable: true, writable: true };
    function Kr(e) {
      let t = new Set(e);
      return { getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf"), getOwnPropertyDescriptor: /* @__PURE__ */ __name(() => Qr, "getOwnPropertyDescriptor"), has: /* @__PURE__ */ __name((r, n) => t.has(n), "has"), set: /* @__PURE__ */ __name((r, n, i) => t.add(n) && Reflect.set(r, n, i), "set"), ownKeys: /* @__PURE__ */ __name(() => [...t], "ownKeys") };
    }
    __name(Kr, "Kr");
    var rs = Symbol.for("nodejs.util.inspect.custom");
    function me(e, t) {
      let r = Pc(t), n = /* @__PURE__ */ new Set(), i = new Proxy(e, { get(o, s) {
        if (n.has(s)) return o[s];
        let a = r.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      }, has(o, s) {
        if (n.has(s)) return true;
        let a = r.get(s);
        return a ? a.has?.(s) ?? true : Reflect.has(o, s);
      }, ownKeys(o) {
        let s = ns(Reflect.ownKeys(o), r), a = ns(Array.from(r.keys()), r);
        return [.../* @__PURE__ */ new Set([...s, ...a, ...n])];
      }, set(o, s, a) {
        return r.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
      }, getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let l2 = r.get(s);
        return l2 ? l2.getPropertyDescriptor ? { ...Qr, ...l2?.getPropertyDescriptor(s) } : Qr : a;
      }, defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      }, getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf") });
      return i[rs] = function() {
        let o = { ...this };
        return delete o[rs], o;
      }, i;
    }
    __name(me, "me");
    function Pc(e) {
      let t = /* @__PURE__ */ new Map();
      for (let r of e) {
        let n = r.getKeys();
        for (let i of n) t.set(i, r);
      }
      return t;
    }
    __name(Pc, "Pc");
    function ns(e, t) {
      return e.filter((r) => t.get(r)?.has?.(r) ?? true);
    }
    __name(ns, "ns");
    f2();
    u();
    c();
    p2();
    m();
    function mt(e) {
      return { getKeys() {
        return e;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    __name(mt, "mt");
    f2();
    u();
    c();
    p2();
    m();
    function Wr(e, t) {
      return { batch: e, transaction: t?.kind === "batch" ? { isolationLevel: t.options.isolationLevel } : void 0 };
    }
    __name(Wr, "Wr");
    f2();
    u();
    c();
    p2();
    m();
    function is(e) {
      if (e === void 0) return "";
      let t = ut(e);
      return new nt(0, { colors: Dr }).write(t).toString();
    }
    __name(is, "is");
    f2();
    u();
    c();
    p2();
    m();
    var vc = "P2037";
    function Hr({ error: e, user_facing_error: t }, r, n) {
      return t.error_code ? new ne(Tc(t, n), { code: t.error_code, clientVersion: r, meta: t.meta, batchRequestIdx: t.batch_request_idx }) : new ie(e, { clientVersion: r, batchRequestIdx: t.batch_request_idx });
    }
    __name(Hr, "Hr");
    function Tc(e, t) {
      let r = e.message;
      return (t === "postgresql" || t === "postgres" || t === "mysql") && e.error_code === vc && (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r;
    }
    __name(Tc, "Tc");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qn = class {
      static {
        __name(this, "Qn");
      }
      getLocation() {
        return null;
      }
    };
    function Ne(e) {
      return typeof $EnabledCallSite == "function" && e !== "minimal" ? new $EnabledCallSite() : new Qn();
    }
    __name(Ne, "Ne");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var os = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function ft(e = {}) {
      let t = Rc(e);
      return Object.entries(t).reduce((n, [i, o]) => (os[i] !== void 0 ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
    }
    __name(ft, "ft");
    function Rc(e = {}) {
      return typeof e._count == "boolean" ? { ...e, _count: { _all: e._count } } : e;
    }
    __name(Rc, "Rc");
    function zr(e = {}) {
      return (t) => (typeof e._count == "boolean" && (t._count = t._count._all), t);
    }
    __name(zr, "zr");
    function ss(e, t) {
      let r = zr(e);
      return t({ action: "aggregate", unpacker: r, argsMapper: ft })(e);
    }
    __name(ss, "ss");
    f2();
    u();
    c();
    p2();
    m();
    function Cc(e = {}) {
      let { select: t, ...r } = e;
      return typeof t == "object" ? ft({ ...r, _count: t }) : ft({ ...r, _count: { _all: true } });
    }
    __name(Cc, "Cc");
    function Sc(e = {}) {
      return typeof e.select == "object" ? (t) => zr(e)(t)._count : (t) => zr(e)(t)._count._all;
    }
    __name(Sc, "Sc");
    function as(e, t) {
      return t({ action: "count", unpacker: Sc(e), argsMapper: Cc })(e);
    }
    __name(as, "as");
    f2();
    u();
    c();
    p2();
    m();
    function Ic(e = {}) {
      let t = ft(e);
      if (Array.isArray(t.by)) for (let r of t.by) typeof r == "string" && (t.select[r] = true);
      else typeof t.by == "string" && (t.select[t.by] = true);
      return t;
    }
    __name(Ic, "Ic");
    function Oc(e = {}) {
      return (t) => (typeof e?._count == "boolean" && t.forEach((r) => {
        r._count = r._count._all;
      }), t);
    }
    __name(Oc, "Oc");
    function ls(e, t) {
      return t({ action: "groupBy", unpacker: Oc(e), argsMapper: Ic })(e);
    }
    __name(ls, "ls");
    function us(e, t, r) {
      if (t === "aggregate") return (n) => ss(n, r);
      if (t === "count") return (n) => as(n, r);
      if (t === "groupBy") return (n) => ls(n, r);
    }
    __name(us, "us");
    f2();
    u();
    c();
    p2();
    m();
    function cs(e, t) {
      let r = t.fields.filter((i) => !i.relationName), n = so(r, "name");
      return new Proxy({}, { get(i, o) {
        if (o in i || typeof o == "symbol") return i[o];
        let s = n[o];
        if (s) return new Nt(e, o, s.type, s.isList, s.kind === "enum");
      }, ...Kr(Object.keys(n)) });
    }
    __name(cs, "cs");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var ps = /* @__PURE__ */ __name((e) => Array.isArray(e) ? e : e.split("."), "ps");
    var Kn = /* @__PURE__ */ __name((e, t) => ps(t).reduce((r, n) => r && r[n], e), "Kn");
    var ms = /* @__PURE__ */ __name((e, t, r) => ps(t).reduceRight((n, i, o, s) => Object.assign({}, Kn(e, s.slice(0, o)), { [i]: n }), r), "ms");
    function kc(e, t) {
      return e === void 0 || t === void 0 ? [] : [...t, "select", e];
    }
    __name(kc, "kc");
    function Dc(e, t, r) {
      return t === void 0 ? e ?? {} : ms(t, r, e || true);
    }
    __name(Dc, "Dc");
    function Wn(e, t, r, n, i, o) {
      let a = e._runtimeDataModel.models[t].fields.reduce((l2, d) => ({ ...l2, [d.name]: d }), {});
      return (l2) => {
        let d = Ne(e._errorFormat), g = kc(n, i), h = Dc(l2, o, g), T2 = r({ dataPath: g, callsite: d })(h), I = Mc(e, t);
        return new Proxy(T2, { get(S2, C) {
          if (!I.includes(C)) return S2[C];
          let F2 = [a[C].type, r, C], B = [g, h];
          return Wn(e, ...F2, ...B);
        }, ...Kr([...I, ...Object.getOwnPropertyNames(T2)]) });
      };
    }
    __name(Wn, "Wn");
    function Mc(e, t) {
      return e._runtimeDataModel.models[t].fields.filter((r) => r.kind === "object").map((r) => r.name);
    }
    __name(Mc, "Mc");
    var _c = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var Nc = ["aggregate", "count", "groupBy"];
    function Hn(e, t) {
      let r = e._extensions.getAllModelExtensions(t) ?? {}, n = [Fc(e, t), Uc(e, t), jt(r), te("name", () => t), te("$name", () => t), te("$parent", () => e._appliedParent)];
      return me({}, n);
    }
    __name(Hn, "Hn");
    function Fc(e, t) {
      let r = Ee(t), n = Object.keys(kt).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = i, s = /* @__PURE__ */ __name((a) => (l2) => {
          let d = Ne(e._errorFormat);
          return e._createPrismaPromise((g) => {
            let h = { args: l2, dataPath: [], action: o, model: t, clientMethod: `${r}.${i}`, jsModelName: r, transaction: g, callsite: d };
            return e._request({ ...h, ...a });
          }, { action: o, args: l2, model: t });
        }, "s");
        return _c.includes(o) ? Wn(e, t, s) : Lc(i) ? us(e, i, s) : s({});
      } };
    }
    __name(Fc, "Fc");
    function Lc(e) {
      return Nc.includes(e);
    }
    __name(Lc, "Lc");
    function Uc(e, t) {
      return Be(te("fields", () => {
        let r = e._runtimeDataModel.models[t];
        return cs(t, r);
      }));
    }
    __name(Uc, "Uc");
    f2();
    u();
    c();
    p2();
    m();
    function fs(e) {
      return e.replace(/^./, (t) => t.toUpperCase());
    }
    __name(fs, "fs");
    var zn = Symbol();
    function Gt(e) {
      let t = [Bc(e), qc(e), te(zn, () => e), te("$parent", () => e._appliedParent)], r = e._extensions.getAllClientExtensions();
      return r && t.push(jt(r)), me(e, t);
    }
    __name(Gt, "Gt");
    function Bc(e) {
      let t = Object.getPrototypeOf(e._originalClient), r = [...new Set(Object.getOwnPropertyNames(t))];
      return { getKeys() {
        return r;
      }, getPropertyValue(n) {
        return e[n];
      } };
    }
    __name(Bc, "Bc");
    function qc(e) {
      let t = Object.keys(e._runtimeDataModel.models), r = t.map(Ee), n = [...new Set(t.concat(r))];
      return Be({ getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = fs(i);
        if (e._runtimeDataModel.models[o] !== void 0) return Hn(e, o);
        if (e._runtimeDataModel.models[i] !== void 0) return Hn(e, i);
      }, getPropertyDescriptor(i) {
        if (!r.includes(i)) return { enumerable: false };
      } });
    }
    __name(qc, "qc");
    function ds(e) {
      return e[zn] ? e[zn] : e;
    }
    __name(ds, "ds");
    function gs(e) {
      if (typeof e == "function") return e(this);
      if (e.client?.__AccelerateEngine) {
        let r = e.client.__AccelerateEngine;
        this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
      }
      let t = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e) }, _appliedParent: { value: this, configurable: true }, $on: { value: void 0 } });
      return Gt(t);
    }
    __name(gs, "gs");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function hs({ result: e, modelName: t, select: r, omit: n, extensions: i }) {
      let o = i.getAllComputedFields(t);
      if (!o) return e;
      let s = [], a = [];
      for (let l2 of Object.values(o)) {
        if (n) {
          if (n[l2.name]) continue;
          let d = l2.needs.filter((g) => n[g]);
          d.length > 0 && a.push(mt(d));
        } else if (r) {
          if (!r[l2.name]) continue;
          let d = l2.needs.filter((g) => !r[g]);
          d.length > 0 && a.push(mt(d));
        }
        Vc(e, l2.needs) && s.push($c(l2, me(e, s)));
      }
      return s.length > 0 || a.length > 0 ? me(e, [...s, ...a]) : e;
    }
    __name(hs, "hs");
    function Vc(e, t) {
      return t.every((r) => Cn(e, r));
    }
    __name(Vc, "Vc");
    function $c(e, t) {
      return Be(te(e.name, () => e.compute(t)));
    }
    __name($c, "$c");
    f2();
    u();
    c();
    p2();
    m();
    function Yr({ visitor: e, result: t, args: r, runtimeDataModel: n, modelName: i }) {
      if (Array.isArray(t)) {
        for (let s = 0; s < t.length; s++) t[s] = Yr({ result: t[s], args: r, modelName: i, runtimeDataModel: n, visitor: e });
        return t;
      }
      let o = e(t, i, r) ?? t;
      return r.include && ys({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), r.select && ys({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), o;
    }
    __name(Yr, "Yr");
    function ys({ includeOrSelect: e, result: t, parentModelName: r, runtimeDataModel: n, visitor: i }) {
      for (let [o, s] of Object.entries(e)) {
        if (!s || t[o] == null || be(s)) continue;
        let l2 = n.models[r].fields.find((g) => g.name === o);
        if (!l2 || l2.kind !== "object" || !l2.relationName) continue;
        let d = typeof s == "object" ? s : {};
        t[o] = Yr({ visitor: i, result: t[o], args: d, modelName: l2.type, runtimeDataModel: n });
      }
    }
    __name(ys, "ys");
    function ws({ result: e, modelName: t, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
      return n.isEmpty() || e == null || typeof e != "object" || !i.models[t] ? e : Yr({ result: e, args: r ?? {}, modelName: t, runtimeDataModel: i, visitor: /* @__PURE__ */ __name((a, l2, d) => {
        let g = Ee(l2);
        return hs({ result: a, modelName: g, select: d.select, omit: d.select ? void 0 : { ...o?.[g], ...d.omit }, extensions: n });
      }, "visitor") });
    }
    __name(ws, "ws");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var jc = ["$connect", "$disconnect", "$on", "$transaction", "$extends"];
    var Es = jc;
    function bs(e) {
      if (e instanceof se) return Gc(e);
      if (Gr(e)) return Jc(e);
      if (Array.isArray(e)) {
        let r = [e[0]];
        for (let n = 1; n < e.length; n++) r[n] = Jt(e[n]);
        return r;
      }
      let t = {};
      for (let r in e) t[r] = Jt(e[r]);
      return t;
    }
    __name(bs, "bs");
    function Gc(e) {
      return new se(e.strings, e.values);
    }
    __name(Gc, "Gc");
    function Jc(e) {
      return new $t(e.sql, e.values);
    }
    __name(Jc, "Jc");
    function Jt(e) {
      if (typeof e != "object" || e == null || e instanceof Re || lt(e)) return e;
      if (rt(e)) return new Ae(e.toFixed());
      if (Xe(e)) return /* @__PURE__ */ new Date(+e);
      if (ArrayBuffer.isView(e)) return e.slice(0);
      if (Array.isArray(e)) {
        let t = e.length, r;
        for (r = Array(t); t--; ) r[t] = Jt(e[t]);
        return r;
      }
      if (typeof e == "object") {
        let t = {};
        for (let r in e) r === "__proto__" ? Object.defineProperty(t, r, { value: Jt(e[r]), configurable: true, enumerable: true, writable: true }) : t[r] = Jt(e[r]);
        return t;
      }
      Ue(e, "Unknown value");
    }
    __name(Jt, "Jt");
    function Ps(e, t, r, n = 0) {
      return e._createPrismaPromise((i) => {
        let o = t.customDataProxyFetch;
        return "transaction" in t && i !== void 0 && (t.transaction?.kind === "batch" && t.transaction.lock.then(), t.transaction = i), n === r.length ? e._executeRequest(t) : r[n]({ model: t.model, operation: t.model ? t.action : t.clientMethod, args: bs(t.args ?? {}), __internalParams: t, query: /* @__PURE__ */ __name((s, a = t) => {
          let l2 = a.customDataProxyFetch;
          return a.customDataProxyFetch = Rs(o, l2), a.args = s, Ps(e, a, r, n + 1);
        }, "query") });
      });
    }
    __name(Ps, "Ps");
    function vs(e, t) {
      let { jsModelName: r, action: n, clientMethod: i } = t, o = r ? n : i;
      if (e._extensions.isEmpty()) return e._executeRequest(t);
      let s = e._extensions.getAllQueryCallbacks(r ?? "$none", o);
      return Ps(e, t, s);
    }
    __name(vs, "vs");
    function Ts(e) {
      return (t) => {
        let r = { requests: t }, n = t[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? As(r, n, 0, e) : e(r);
      };
    }
    __name(Ts, "Ts");
    function As(e, t, r, n) {
      if (r === t.length) return n(e);
      let i = e.customDataProxyFetch, o = e.requests[0].transaction;
      return t[r]({ args: { queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: e, query(s, a = e) {
        let l2 = a.customDataProxyFetch;
        return a.customDataProxyFetch = Rs(i, l2), As(a, t, r + 1, n);
      } });
    }
    __name(As, "As");
    var xs = /* @__PURE__ */ __name((e) => e, "xs");
    function Rs(e = xs, t = xs) {
      return (r) => e(t(r));
    }
    __name(Rs, "Rs");
    f2();
    u();
    c();
    p2();
    m();
    var Cs = z("prisma:client");
    var Ss = { Vercel: "vercel", "Netlify CI": "netlify" };
    function Is({ postinstall: e, ciName: t, clientVersion: r, generator: n }) {
      if (Cs("checkPlatformCaching:postinstall", e), Cs("checkPlatformCaching:ciName", t), e === true && !(n?.output && typeof (n.output.fromEnvVar ?? n.output.value) == "string") && t && t in Ss) {
        let i = `Prisma has detected that this project was built on ${t}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Ss[t]}-build`;
        throw console.error(i), new Q(i, r);
      }
    }
    __name(Is, "Is");
    f2();
    u();
    c();
    p2();
    m();
    function Os(e, t) {
      return e ? e.datasources ? e.datasources : e.datasourceUrl ? { [t[0]]: { url: e.datasourceUrl } } : {} : {};
    }
    __name(Os, "Os");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function ks(e, t) {
      throw new Error(t);
    }
    __name(ks, "ks");
    function Qc(e) {
      return e !== null && typeof e == "object" && typeof e.$type == "string";
    }
    __name(Qc, "Qc");
    function Kc(e, t) {
      let r = {};
      for (let n of Object.keys(e)) r[n] = t(e[n], n);
      return r;
    }
    __name(Kc, "Kc");
    function dt(e) {
      return e === null ? e : Array.isArray(e) ? e.map(dt) : typeof e == "object" ? Qc(e) ? Wc(e) : e.constructor !== null && e.constructor.name !== "Object" ? e : Kc(e, dt) : e;
    }
    __name(dt, "dt");
    function Wc({ $type: e, value: t }) {
      switch (e) {
        case "BigInt":
          return BigInt(t);
        case "Bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = w2.Buffer.from(t, "base64");
          return new Uint8Array(r, n, i);
        }
        case "DateTime":
          return new Date(t);
        case "Decimal":
          return new Te(t);
        case "Json":
          return JSON.parse(t);
        default:
          ks(t, "Unknown tagged value");
      }
    }
    __name(Wc, "Wc");
    var Ds = "6.18.0";
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var zc = /* @__PURE__ */ __name(() => globalThis.process?.release?.name === "node", "zc");
    var Yc = /* @__PURE__ */ __name(() => !!globalThis.Bun || !!globalThis.process?.versions?.bun, "Yc");
    var Zc = /* @__PURE__ */ __name(() => !!globalThis.Deno, "Zc");
    var Xc = /* @__PURE__ */ __name(() => typeof globalThis.Netlify == "object", "Xc");
    var ep = /* @__PURE__ */ __name(() => typeof globalThis.EdgeRuntime == "object", "ep");
    var tp = /* @__PURE__ */ __name(() => globalThis.navigator?.userAgent === "Cloudflare-Workers", "tp");
    function rp() {
      return [[Xc, "netlify"], [ep, "edge-light"], [tp, "workerd"], [Zc, "deno"], [Yc, "bun"], [zc, "node"]].flatMap((r) => r[0]() ? [r[1]] : []).at(0) ?? "";
    }
    __name(rp, "rp");
    var np = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function Zr() {
      let e = rp();
      return { id: e, prettyName: np[e] || e, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e) };
    }
    __name(Zr, "Zr");
    function gt({ inlineDatasources: e, overrideDatasources: t, env: r, clientVersion: n }) {
      let i, o = Object.keys(e)[0], s = e[o]?.url, a = t[o]?.url;
      if (o === void 0 ? i = void 0 : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = r[s.fromEnvVar]), s?.fromEnvVar !== void 0 && i === void 0) throw Zr().id === "workerd" ? new Q(`error: Environment variable not found: ${s.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`, n) : new Q(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
      if (i === void 0) throw new Q("error: Missing URL environment variable, value, or override.", n);
      return i;
    }
    __name(gt, "gt");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Xr = class extends Error {
      static {
        __name(this, "Xr");
      }
      clientVersion;
      cause;
      constructor(t, r) {
        super(t), this.clientVersion = r.clientVersion, this.cause = r.cause;
      }
      get [Symbol.toStringTag]() {
        return this.name;
      }
    };
    var ae = class extends Xr {
      static {
        __name(this, "ae");
      }
      isRetryable;
      constructor(t, r) {
        super(t, r), this.isRetryable = r.isRetryable ?? true;
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function U(e, t) {
      return { ...e, isRetryable: t };
    }
    __name(U, "U");
    var qe = class extends ae {
      static {
        __name(this, "qe");
      }
      name = "InvalidDatasourceError";
      code = "P6001";
      constructor(t, r) {
        super(t, U(r, false));
      }
    };
    N(qe, "InvalidDatasourceError");
    function Ms(e) {
      let t = { clientVersion: e.clientVersion }, r = Object.keys(e.inlineDatasources)[0], n = gt({ inlineDatasources: e.inlineDatasources, overrideDatasources: e.overrideDatasources, clientVersion: e.clientVersion, env: { ...e.env, ...typeof y < "u" ? y.env : {} } }), i;
      try {
        i = new URL(n);
      } catch {
        throw new qe(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, t);
      }
      let { protocol: o, searchParams: s } = i;
      if (o !== "prisma:" && o !== hr) throw new qe(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\` or \`prisma+postgres://\``, t);
      let a = s.get("api_key");
      if (a === null || a.length < 1) throw new qe(`Error validating datasource \`${r}\`: the URL must contain a valid API key`, t);
      let l2 = vn(i) ? "http:" : "https:";
      y.env.TEST_CLIENT_ENGINE_REMOTE_EXECUTOR && i.searchParams.has("use_http") && (l2 = "http:");
      let d = new URL(i.href.replace(o, l2));
      return { apiKey: a, url: d };
    }
    __name(Ms, "Ms");
    f2();
    u();
    c();
    p2();
    m();
    var _s = Qe(Xi());
    var en = class {
      static {
        __name(this, "en");
      }
      apiKey;
      tracingHelper;
      logLevel;
      logQueries;
      engineHash;
      constructor({ apiKey: t, tracingHelper: r, logLevel: n, logQueries: i, engineHash: o }) {
        this.apiKey = t, this.tracingHelper = r, this.logLevel = n, this.logQueries = i, this.engineHash = o;
      }
      build({ traceparent: t, transactionId: r } = {}) {
        let n = { Accept: "application/json", Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json", "Prisma-Engine-Hash": this.engineHash, "Prisma-Engine-Version": _s.enginesVersion };
        this.tracingHelper.isEnabled() && (n.traceparent = t ?? this.tracingHelper.getTraceParent()), r && (n["X-Transaction-Id"] = r);
        let i = this.#e();
        return i.length > 0 && (n["X-Capture-Telemetry"] = i.join(", ")), n;
      }
      #e() {
        let t = [];
        return this.tracingHelper.isEnabled() && t.push("tracing"), this.logLevel && t.push(this.logLevel), this.logQueries && t.push("query"), t;
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function ip(e) {
      return e[0] * 1e3 + e[1] / 1e6;
    }
    __name(ip, "ip");
    function Yn(e) {
      return new Date(ip(e));
    }
    __name(Yn, "Yn");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var ht = class extends ae {
      static {
        __name(this, "ht");
      }
      name = "ForcedRetryError";
      code = "P5001";
      constructor(t) {
        super("This request must be retried", U(t, true));
      }
    };
    N(ht, "ForcedRetryError");
    f2();
    u();
    c();
    p2();
    m();
    var Ve = class extends ae {
      static {
        __name(this, "Ve");
      }
      name = "NotImplementedYetError";
      code = "P5004";
      constructor(t, r) {
        super(t, U(r, false));
      }
    };
    N(Ve, "NotImplementedYetError");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var G = class extends ae {
      static {
        __name(this, "G");
      }
      response;
      constructor(t, r) {
        super(t, r), this.response = r.response;
        let n = this.response.headers.get("prisma-request-id");
        if (n) {
          let i = `(The request id was: ${n})`;
          this.message = this.message + " " + i;
        }
      }
    };
    var $e = class extends G {
      static {
        __name(this, "$e");
      }
      name = "SchemaMissingError";
      code = "P5005";
      constructor(t) {
        super("Schema needs to be uploaded", U(t, true));
      }
    };
    N($e, "SchemaMissingError");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Zn = "This request could not be understood by the server";
    var Qt = class extends G {
      static {
        __name(this, "Qt");
      }
      name = "BadRequestError";
      code = "P5000";
      constructor(t, r, n) {
        super(r || Zn, U(t, false)), n && (this.code = n);
      }
    };
    N(Qt, "BadRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var Kt = class extends G {
      static {
        __name(this, "Kt");
      }
      name = "HealthcheckTimeoutError";
      code = "P5013";
      logs;
      constructor(t, r) {
        super("Engine not started: healthcheck timeout", U(t, true)), this.logs = r;
      }
    };
    N(Kt, "HealthcheckTimeoutError");
    f2();
    u();
    c();
    p2();
    m();
    var Wt = class extends G {
      static {
        __name(this, "Wt");
      }
      name = "EngineStartupError";
      code = "P5014";
      logs;
      constructor(t, r, n) {
        super(r, U(t, true)), this.logs = n;
      }
    };
    N(Wt, "EngineStartupError");
    f2();
    u();
    c();
    p2();
    m();
    var Ht = class extends G {
      static {
        __name(this, "Ht");
      }
      name = "EngineVersionNotSupportedError";
      code = "P5012";
      constructor(t) {
        super("Engine version is not supported", U(t, false));
      }
    };
    N(Ht, "EngineVersionNotSupportedError");
    f2();
    u();
    c();
    p2();
    m();
    var Xn = "Request timed out";
    var zt = class extends G {
      static {
        __name(this, "zt");
      }
      name = "GatewayTimeoutError";
      code = "P5009";
      constructor(t, r = Xn) {
        super(r, U(t, false));
      }
    };
    N(zt, "GatewayTimeoutError");
    f2();
    u();
    c();
    p2();
    m();
    var op = "Interactive transaction error";
    var Yt = class extends G {
      static {
        __name(this, "Yt");
      }
      name = "InteractiveTransactionError";
      code = "P5015";
      constructor(t, r = op) {
        super(r, U(t, false));
      }
    };
    N(Yt, "InteractiveTransactionError");
    f2();
    u();
    c();
    p2();
    m();
    var sp = "Request parameters are invalid";
    var Zt = class extends G {
      static {
        __name(this, "Zt");
      }
      name = "InvalidRequestError";
      code = "P5011";
      constructor(t, r = sp) {
        super(r, U(t, false));
      }
    };
    N(Zt, "InvalidRequestError");
    f2();
    u();
    c();
    p2();
    m();
    var ei = "Requested resource does not exist";
    var Xt = class extends G {
      static {
        __name(this, "Xt");
      }
      name = "NotFoundError";
      code = "P5003";
      constructor(t, r = ei) {
        super(r, U(t, false));
      }
    };
    N(Xt, "NotFoundError");
    f2();
    u();
    c();
    p2();
    m();
    var ti = "Unknown server error";
    var yt = class extends G {
      static {
        __name(this, "yt");
      }
      name = "ServerError";
      code = "P5006";
      logs;
      constructor(t, r, n) {
        super(r || ti, U(t, true)), this.logs = n;
      }
    };
    N(yt, "ServerError");
    f2();
    u();
    c();
    p2();
    m();
    var ri = "Unauthorized, check your connection string";
    var er = class extends G {
      static {
        __name(this, "er");
      }
      name = "UnauthorizedError";
      code = "P5007";
      constructor(t, r = ri) {
        super(r, U(t, false));
      }
    };
    N(er, "UnauthorizedError");
    f2();
    u();
    c();
    p2();
    m();
    var ni = "Usage exceeded, retry again later";
    var tr = class extends G {
      static {
        __name(this, "tr");
      }
      name = "UsageExceededError";
      code = "P5008";
      constructor(t, r = ni) {
        super(r, U(t, true));
      }
    };
    N(tr, "UsageExceededError");
    async function ap(e) {
      let t;
      try {
        t = await e.text();
      } catch {
        return { type: "EmptyError" };
      }
      try {
        let r = JSON.parse(t);
        if (typeof r == "string") switch (r) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: r };
          default:
            return { type: "UnknownTextError", body: r };
        }
        if (typeof r == "object" && r !== null) {
          if ("is_panic" in r && "message" in r && "error_code" in r) return { type: "QueryEngineError", body: r };
          if ("EngineNotStarted" in r || "InteractiveTransactionMisrouted" in r || "InvalidRequestError" in r) {
            let n = Object.values(r)[0].reason;
            return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: r } : { type: "DataProxyError", body: r };
          }
        }
        return { type: "UnknownJsonError", body: r };
      } catch {
        return t === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: t };
      }
    }
    __name(ap, "ap");
    async function rr(e, t) {
      if (e.ok) return;
      let r = { clientVersion: t, response: e }, n = await ap(e);
      if (n.type === "QueryEngineError") throw new ne(n.body.message, { code: n.body.error_code, clientVersion: t });
      if (n.type === "DataProxyError") {
        if (n.body === "InternalDataProxyError") throw new yt(r, "Internal Data Proxy error");
        if ("EngineNotStarted" in n.body) {
          if (n.body.EngineNotStarted.reason === "SchemaMissing") return new $e(r);
          if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported") throw new Ht(r);
          if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
            throw new Wt(r, i, o);
          }
          if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
            let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
            throw new Q(i, t, o);
          }
          if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
            let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
            throw new Kt(r, i);
          }
        }
        if ("InteractiveTransactionMisrouted" in n.body) {
          let i = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
          throw new Yt(r, i[n.body.InteractiveTransactionMisrouted.reason]);
        }
        if ("InvalidRequestError" in n.body) throw new Zt(r, n.body.InvalidRequestError.reason);
      }
      if (e.status === 401 || e.status === 403) throw new er(r, wt(ri, n));
      if (e.status === 404) return new Xt(r, wt(ei, n));
      if (e.status === 429) throw new tr(r, wt(ni, n));
      if (e.status === 504) throw new zt(r, wt(Xn, n));
      if (e.status >= 500) throw new yt(r, wt(ti, n));
      if (e.status >= 400) throw new Qt(r, wt(Zn, n));
    }
    __name(rr, "rr");
    function wt(e, t) {
      return t.type === "EmptyError" ? e : `${e}: ${JSON.stringify(t)}`;
    }
    __name(wt, "wt");
    f2();
    u();
    c();
    p2();
    m();
    function Ns(e) {
      let t = Math.pow(2, e) * 50, r = Math.ceil(Math.random() * t) - Math.ceil(t / 2), n = t + r;
      return new Promise((i) => setTimeout(() => i(n), n));
    }
    __name(Ns, "Ns");
    f2();
    u();
    c();
    p2();
    m();
    var Ce = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function Fs(e) {
      let t = new TextEncoder().encode(e), r = "", n = t.byteLength, i = n % 3, o = n - i, s, a, l2, d, g;
      for (let h = 0; h < o; h = h + 3) g = t[h] << 16 | t[h + 1] << 8 | t[h + 2], s = (g & 16515072) >> 18, a = (g & 258048) >> 12, l2 = (g & 4032) >> 6, d = g & 63, r += Ce[s] + Ce[a] + Ce[l2] + Ce[d];
      return i == 1 ? (g = t[o], s = (g & 252) >> 2, a = (g & 3) << 4, r += Ce[s] + Ce[a] + "==") : i == 2 && (g = t[o] << 8 | t[o + 1], s = (g & 64512) >> 10, a = (g & 1008) >> 4, l2 = (g & 15) << 2, r += Ce[s] + Ce[a] + Ce[l2] + "="), r;
    }
    __name(Fs, "Fs");
    f2();
    u();
    c();
    p2();
    m();
    function Ls(e) {
      if (!!e.generator?.previewFeatures.some((r) => r.toLowerCase().includes("metrics"))) throw new Q("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", e.clientVersion);
    }
    __name(Ls, "Ls");
    f2();
    u();
    c();
    p2();
    m();
    var Us = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var nr = class extends ae {
      static {
        __name(this, "nr");
      }
      name = "RequestError";
      code = "P5010";
      constructor(t, r) {
        super(`Cannot fetch data from service:
${t}`, U(r, true));
      }
    };
    N(nr, "RequestError");
    async function je(e, t, r = (n) => n) {
      let { clientVersion: n, ...i } = t, o = r(fetch);
      try {
        return await o(e, i);
      } catch (s) {
        let a = s.message ?? "Unknown error";
        throw new nr(a, { clientVersion: n, cause: s });
      }
    }
    __name(je, "je");
    var up = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
    var Bs = z("prisma:client:dataproxyEngine");
    async function cp(e, t) {
      let r = Us["@prisma/engines-version"], n = t.clientVersion ?? "unknown";
      if (y.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION) return y.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION || globalThis.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
      if (e.includes("accelerate") && n !== "0.0.0" && n !== "in-memory") return n;
      let [i, o] = n?.split("-") ?? [];
      if (o === void 0 && up.test(i)) return i;
      if (o !== void 0 || n === "0.0.0" || n === "in-memory") {
        let [s] = r.split("-") ?? [], [a, l2, d] = s.split("."), g = pp(`<=${a}.${l2}.${d}`), h = await je(g, { clientVersion: n });
        if (!h.ok) throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${h.status} ${h.statusText}, response body: ${await h.text() || "<empty body>"}`);
        let T2 = await h.text();
        Bs("length of body fetched from unpkg.com", T2.length);
        let I;
        try {
          I = JSON.parse(T2);
        } catch (S2) {
          throw console.error("JSON.parse error: body fetched from unpkg.com: ", T2), S2;
        }
        return I.version;
      }
      throw new Ve("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
    }
    __name(cp, "cp");
    async function qs(e, t) {
      let r = await cp(e, t);
      return Bs("version", r), r;
    }
    __name(qs, "qs");
    function pp(e) {
      return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
    }
    __name(pp, "pp");
    var Vs = 3;
    var ir = z("prisma:client:dataproxyEngine");
    var Et = class {
      static {
        __name(this, "Et");
      }
      name = "DataProxyEngine";
      inlineSchema;
      inlineSchemaHash;
      inlineDatasources;
      config;
      logEmitter;
      env;
      clientVersion;
      engineHash;
      tracingHelper;
      remoteClientVersion;
      host;
      headerBuilder;
      startPromise;
      protocol;
      constructor(t) {
        Ls(t), this.config = t, this.env = t.env, this.inlineSchema = Fs(t.inlineSchema), this.inlineDatasources = t.inlineDatasources, this.inlineSchemaHash = t.inlineSchemaHash, this.clientVersion = t.clientVersion, this.engineHash = t.engineVersion, this.logEmitter = t.logEmitter, this.tracingHelper = t.tracingHelper;
      }
      apiKey() {
        return this.headerBuilder.apiKey;
      }
      version() {
        return this.engineHash;
      }
      async start() {
        this.startPromise !== void 0 && await this.startPromise, this.startPromise = (async () => {
          let { apiKey: t, url: r } = this.getURLAndAPIKey();
          this.host = r.host, this.protocol = r.protocol, this.headerBuilder = new en({ apiKey: t, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel ?? "error", logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await qs(this.host, this.config), ir("host", this.host), ir("protocol", this.protocol);
        })(), await this.startPromise;
      }
      async stop() {
      }
      propagateResponseExtensions(t) {
        t?.logs?.length && t.logs.forEach((r) => {
          switch (r.level) {
            case "debug":
            case "trace":
              ir(r);
              break;
            case "error":
            case "warn":
            case "info": {
              this.logEmitter.emit(r.level, { timestamp: Yn(r.timestamp), message: r.attributes.message ?? "", target: r.target ?? "BinaryEngine" });
              break;
            }
            case "query": {
              this.logEmitter.emit("query", { query: r.attributes.query ?? "", timestamp: Yn(r.timestamp), duration: r.attributes.duration_ms ?? 0, params: r.attributes.params ?? "", target: r.target ?? "BinaryEngine" });
              break;
            }
            default:
              r.level;
          }
        }), t?.traces?.length && this.tracingHelper.dispatchEngineSpans(t.traces);
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the remote query engine');
      }
      async url(t) {
        return await this.start(), `${this.protocol}//${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${t}`;
      }
      async uploadSchema() {
        let t = { name: "schemaUpload", internal: true };
        return this.tracingHelper.runInChildSpan(t, async () => {
          let r = await je(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
          r.ok || ir("schema response status", r.status);
          let n = await rr(r, this.clientVersion);
          if (n) throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: /* @__PURE__ */ new Date(), target: "" }), n;
          this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
        });
      }
      request(t, { traceparent: r, interactiveTransaction: n, customDataProxyFetch: i }) {
        return this.requestInternal({ body: t, traceparent: r, interactiveTransaction: n, customDataProxyFetch: i });
      }
      async requestBatch(t, { traceparent: r, transaction: n, customDataProxyFetch: i }) {
        let o = n?.kind === "itx" ? n.options : void 0, s = Wr(t, n);
        return (await this.requestInternal({ body: s, customDataProxyFetch: i, interactiveTransaction: o, traceparent: r })).map((l2) => (l2.extensions && this.propagateResponseExtensions(l2.extensions), "errors" in l2 ? this.convertProtocolErrorsToClientError(l2.errors) : l2));
      }
      requestInternal({ body: t, traceparent: r, customDataProxyFetch: n, interactiveTransaction: i }) {
        return this.withRetry({ actionGerund: "querying", callback: /* @__PURE__ */ __name(async ({ logHttpCall: o }) => {
          let s = i ? `${i.payload.endpoint}/graphql` : await this.url("graphql");
          o(s);
          let a = await je(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r, transactionId: i?.id }), body: JSON.stringify(t), clientVersion: this.clientVersion }, n);
          a.ok || ir("graphql response status", a.status), await this.handleError(await rr(a, this.clientVersion));
          let l2 = await a.json();
          if (l2.extensions && this.propagateResponseExtensions(l2.extensions), "errors" in l2) throw this.convertProtocolErrorsToClientError(l2.errors);
          return "batchResult" in l2 ? l2.batchResult : l2;
        }, "callback") });
      }
      async transaction(t, r, n) {
        let i = { start: "starting", commit: "committing", rollback: "rolling back" };
        return this.withRetry({ actionGerund: `${i[t]} transaction`, callback: /* @__PURE__ */ __name(async ({ logHttpCall: o }) => {
          if (t === "start") {
            let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
            o(a);
            let l2 = await je(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), body: s, clientVersion: this.clientVersion });
            await this.handleError(await rr(l2, this.clientVersion));
            let d = await l2.json(), { extensions: g } = d;
            g && this.propagateResponseExtensions(g);
            let h = d.id, T2 = d["data-proxy"].endpoint;
            return { id: h, payload: { endpoint: T2 } };
          } else {
            let s = `${n.payload.endpoint}/${t}`;
            o(s);
            let a = await je(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), clientVersion: this.clientVersion });
            await this.handleError(await rr(a, this.clientVersion));
            let l2 = await a.json(), { extensions: d } = l2;
            d && this.propagateResponseExtensions(d);
            return;
          }
        }, "callback") });
      }
      getURLAndAPIKey() {
        return Ms({ clientVersion: this.clientVersion, env: this.env, inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources });
      }
      metrics() {
        throw new Ve("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
      }
      async withRetry(t) {
        for (let r = 0; ; r++) {
          let n = /* @__PURE__ */ __name((i) => {
            this.logEmitter.emit("info", { message: `Calling ${i} (n=${r})`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }, "n");
          try {
            return await t.callback({ logHttpCall: n });
          } catch (i) {
            if (!(i instanceof ae) || !i.isRetryable) throw i;
            if (r >= Vs) throw i instanceof ht ? i.cause : i;
            this.logEmitter.emit("warn", { message: `Attempt ${r + 1}/${Vs} failed for ${t.actionGerund}: ${i.message ?? "(unknown)"}`, timestamp: /* @__PURE__ */ new Date(), target: "" });
            let o = await Ns(r);
            this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: /* @__PURE__ */ new Date(), target: "" });
          }
        }
      }
      async handleError(t) {
        if (t instanceof $e) throw await this.uploadSchema(), new ht({ clientVersion: this.clientVersion, cause: t });
        if (t) throw t;
      }
      convertProtocolErrorsToClientError(t) {
        return t.length === 1 ? Hr(t[0], this.config.clientVersion, this.config.activeProvider) : new ie(JSON.stringify(t), { clientVersion: this.config.clientVersion });
      }
      applyPendingMigrations() {
        throw new Error("Method not implemented.");
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function $s({ url: e, adapter: t, copyEngine: r, targetBuildType: n }) {
      let i = [], o = [], s = /* @__PURE__ */ __name((C) => {
        i.push({ _tag: "warning", value: C });
      }, "s"), a = /* @__PURE__ */ __name((C) => {
        let M = C.join(`
`);
        o.push({ _tag: "error", value: M });
      }, "a"), l2 = !!e?.startsWith("prisma://"), d = yr(e), g = !!t, h = l2 || d;
      !g && r && h && n !== "client" && n !== "wasm-compiler-edge" && s(["recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"]);
      let T2 = h || !r;
      g && (T2 || n === "edge") && (n === "edge" ? a(["Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.", "Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor."]) : h ? a(["You've provided both a driver adapter and an Accelerate database URL. Driver adapters currently cannot connect to Accelerate.", "Please provide either a driver adapter with a direct database URL or an Accelerate URL and no driver adapter."]) : r || a(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));
      let I = { accelerate: T2, ppg: d, driverAdapters: g };
      function S2(C) {
        return C.length > 0;
      }
      __name(S2, "S");
      return S2(o) ? { ok: false, diagnostics: { warnings: i, errors: o }, isUsing: I } : { ok: true, diagnostics: { warnings: i }, isUsing: I };
    }
    __name($s, "$s");
    function js({ copyEngine: e = true }, t) {
      let r;
      try {
        r = gt({ inlineDatasources: t.inlineDatasources, overrideDatasources: t.overrideDatasources, env: { ...t.env, ...y.env }, clientVersion: t.clientVersion });
      } catch {
      }
      let { ok: n, isUsing: i, diagnostics: o } = $s({ url: r, adapter: t.adapter, copyEngine: e, targetBuildType: "edge" });
      for (let h of o.warnings) St(...h.value);
      if (!n) {
        let h = o.errors[0];
        throw new X(h.value, { clientVersion: t.clientVersion });
      }
      let s = Ze(t.generator), a = s === "library", l2 = s === "binary", d = s === "client", g = (i.accelerate || i.ppg) && !i.driverAdapters;
      return i.accelerate ? new Et(t) : (i.driverAdapters, i.accelerate, new Et(t));
    }
    __name(js, "js");
    f2();
    u();
    c();
    p2();
    m();
    function Gs({ generator: e }) {
      return e?.previewFeatures ?? [];
    }
    __name(Gs, "Gs");
    f2();
    u();
    c();
    p2();
    m();
    var Js = /* @__PURE__ */ __name((e) => ({ command: e }), "Js");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    var Qs = /* @__PURE__ */ __name((e) => e.strings.reduce((t, r, n) => `${t}@P${n}${r}`), "Qs");
    f2();
    u();
    c();
    p2();
    m();
    function bt(e) {
      try {
        return Ks(e, "fast");
      } catch {
        return Ks(e, "slow");
      }
    }
    __name(bt, "bt");
    function Ks(e, t) {
      return JSON.stringify(e.map((r) => Hs(r, t)));
    }
    __name(Ks, "Ks");
    function Hs(e, t) {
      if (Array.isArray(e)) return e.map((r) => Hs(r, t));
      if (typeof e == "bigint") return { prisma__type: "bigint", prisma__value: e.toString() };
      if (Xe(e)) return { prisma__type: "date", prisma__value: e.toJSON() };
      if (Ae.isDecimal(e)) return { prisma__type: "decimal", prisma__value: e.toJSON() };
      if (w2.Buffer.isBuffer(e)) return { prisma__type: "bytes", prisma__value: e.toString("base64") };
      if (mp(e)) return { prisma__type: "bytes", prisma__value: w2.Buffer.from(e).toString("base64") };
      if (ArrayBuffer.isView(e)) {
        let { buffer: r, byteOffset: n, byteLength: i } = e;
        return { prisma__type: "bytes", prisma__value: w2.Buffer.from(r, n, i).toString("base64") };
      }
      return typeof e == "object" && t === "slow" ? zs(e) : e;
    }
    __name(Hs, "Hs");
    function mp(e) {
      return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer ? true : typeof e == "object" && e !== null ? e[Symbol.toStringTag] === "ArrayBuffer" || e[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    __name(mp, "mp");
    function zs(e) {
      if (typeof e != "object" || e === null) return e;
      if (typeof e.toJSON == "function") return e.toJSON();
      if (Array.isArray(e)) return e.map(Ws);
      let t = {};
      for (let r of Object.keys(e)) t[r] = Ws(e[r]);
      return t;
    }
    __name(zs, "zs");
    function Ws(e) {
      return typeof e == "bigint" ? e.toString() : zs(e);
    }
    __name(Ws, "Ws");
    var fp = /^(\s*alter\s)/i;
    var Ys = z("prisma:client");
    function ii(e, t, r, n) {
      if (!(e !== "postgresql" && e !== "cockroachdb") && r.length > 0 && fp.exec(t)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    __name(ii, "ii");
    var oi = /* @__PURE__ */ __name(({ clientMethod: e, activeProvider: t }) => (r) => {
      let n = "", i;
      if (Gr(r)) n = r.sql, i = { values: bt(r.values), __prismaRawParameters__: true };
      else if (Array.isArray(r)) {
        let [o, ...s] = r;
        n = o, i = { values: bt(s || []), __prismaRawParameters__: true };
      } else switch (t) {
        case "sqlite":
        case "mysql": {
          n = r.sql, i = { values: bt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r.text, i = { values: bt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = Qs(r), i = { values: bt(r.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${t} provider does not support ${e}`);
      }
      return i?.values ? Ys(`prisma.${e}(${n}, ${i.values})`) : Ys(`prisma.${e}(${n})`), { query: n, parameters: i };
    }, "oi");
    var Zs = { requestArgsToMiddlewareArgs(e) {
      return [e.strings, ...e.values];
    }, middlewareArgsToRequestArgs(e) {
      let [t, ...r] = e;
      return new se(t, r);
    } };
    var Xs = { requestArgsToMiddlewareArgs(e) {
      return [e];
    }, middlewareArgsToRequestArgs(e) {
      return e[0];
    } };
    f2();
    u();
    c();
    p2();
    m();
    function si(e) {
      return function(r, n) {
        let i, o = /* @__PURE__ */ __name((s = e) => {
          try {
            return s === void 0 || s?.kind === "itx" ? i ??= ea(r(s)) : ea(r(s));
          } catch (a) {
            return Promise.reject(a);
          }
        }, "o");
        return { get spec() {
          return n;
        }, then(s, a) {
          return o().then(s, a);
        }, catch(s) {
          return o().catch(s);
        }, finally(s) {
          return o().finally(s);
        }, requestTransaction(s) {
          let a = o(s);
          return a.requestTransaction ? a.requestTransaction(s) : a;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    __name(si, "si");
    function ea(e) {
      return typeof e.then == "function" ? e : Promise.resolve(e);
    }
    __name(ea, "ea");
    f2();
    u();
    c();
    p2();
    m();
    var dp = xn.split(".")[0];
    var gp = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, dispatchEngineSpans() {
    }, getActiveContext() {
    }, runInChildSpan(e, t) {
      return t();
    } };
    var ai = class {
      static {
        __name(this, "ai");
      }
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(t) {
        return this.getGlobalTracingHelper().getTraceParent(t);
      }
      dispatchEngineSpans(t) {
        return this.getGlobalTracingHelper().dispatchEngineSpans(t);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(t, r) {
        return this.getGlobalTracingHelper().runInChildSpan(t, r);
      }
      getGlobalTracingHelper() {
        let t = globalThis[`V${dp}_PRISMA_INSTRUMENTATION`], r = globalThis.PRISMA_INSTRUMENTATION;
        return t?.helper ?? r?.helper ?? gp;
      }
    };
    function ta() {
      return new ai();
    }
    __name(ta, "ta");
    f2();
    u();
    c();
    p2();
    m();
    function ra(e, t = () => {
    }) {
      let r, n = new Promise((i) => r = i);
      return { then(i) {
        return --e === 0 && r(t()), i?.(n);
      } };
    }
    __name(ra, "ra");
    f2();
    u();
    c();
    p2();
    m();
    function na(e) {
      return typeof e == "string" ? e : e.reduce((t, r) => {
        let n = typeof r == "string" ? r : r.level;
        return n === "query" ? t : t && (r === "info" || t === "info") ? "info" : n;
      }, void 0);
    }
    __name(na, "na");
    f2();
    u();
    c();
    p2();
    m();
    f2();
    u();
    c();
    p2();
    m();
    function tn(e) {
      return typeof e.batchRequestIdx == "number";
    }
    __name(tn, "tn");
    f2();
    u();
    c();
    p2();
    m();
    function ia(e) {
      if (e.action !== "findUnique" && e.action !== "findUniqueOrThrow") return;
      let t = [];
      return e.modelName && t.push(e.modelName), e.query.arguments && t.push(li(e.query.arguments)), t.push(li(e.query.selection)), t.join("");
    }
    __name(ia, "ia");
    function li(e) {
      return `(${Object.keys(e).sort().map((r) => {
        let n = e[r];
        return typeof n == "object" && n !== null ? `(${r} ${li(n)})` : r;
      }).join(" ")})`;
    }
    __name(li, "li");
    f2();
    u();
    c();
    p2();
    m();
    var hp = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
    function ui(e) {
      return hp[e];
    }
    __name(ui, "ui");
    f2();
    u();
    c();
    p2();
    m();
    var rn = class {
      static {
        __name(this, "rn");
      }
      constructor(t) {
        this.options = t;
        this.batches = {};
      }
      batches;
      tickActive = false;
      request(t) {
        let r = this.options.batchBy(t);
        return r ? (this.batches[r] || (this.batches[r] = [], this.tickActive || (this.tickActive = true, y.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i) => {
          this.batches[r].push({ request: t, resolve: n, reject: i });
        })) : this.options.singleLoader(t);
      }
      dispatchBatches() {
        for (let t in this.batches) {
          let r = this.batches[t];
          delete this.batches[t], r.length === 1 ? this.options.singleLoader(r[0].request).then((n) => {
            n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
          }).catch((n) => {
            r[0].reject(n);
          }) : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(r.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i = 0; i < r.length; i++) r[i].reject(n);
            else for (let i = 0; i < r.length; i++) {
              let o = n[i];
              o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
            }
          }).catch((n) => {
            for (let i = 0; i < r.length; i++) r[i].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    f2();
    u();
    c();
    p2();
    m();
    function Ge(e, t) {
      if (t === null) return t;
      switch (e) {
        case "bigint":
          return BigInt(t);
        case "bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = w2.Buffer.from(t, "base64");
          return new Uint8Array(r, n, i);
        }
        case "decimal":
          return new Ae(t);
        case "datetime":
        case "date":
          return new Date(t);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${t}Z`);
        case "bigint-array":
          return t.map((r) => Ge("bigint", r));
        case "bytes-array":
          return t.map((r) => Ge("bytes", r));
        case "decimal-array":
          return t.map((r) => Ge("decimal", r));
        case "datetime-array":
          return t.map((r) => Ge("datetime", r));
        case "date-array":
          return t.map((r) => Ge("date", r));
        case "time-array":
          return t.map((r) => Ge("time", r));
        default:
          return t;
      }
    }
    __name(Ge, "Ge");
    function nn(e) {
      let t = [], r = yp(e);
      for (let n = 0; n < e.rows.length; n++) {
        let i = e.rows[n], o = { ...r };
        for (let s = 0; s < i.length; s++) o[e.columns[s]] = Ge(e.types[s], i[s]);
        t.push(o);
      }
      return t;
    }
    __name(nn, "nn");
    function yp(e) {
      let t = {};
      for (let r = 0; r < e.columns.length; r++) t[e.columns[r]] = null;
      return t;
    }
    __name(yp, "yp");
    var wp = z("prisma:client:request_handler");
    var on2 = class {
      static {
        __name(this, "on");
      }
      client;
      dataloader;
      logEmitter;
      constructor(t, r) {
        this.logEmitter = r, this.client = t, this.dataloader = new rn({ batchLoader: Ts(async ({ requests: n, customDataProxyFetch: i }) => {
          let { transaction: o, otelParentCtx: s } = n[0], a = n.map((h) => h.protocolQuery), l2 = this.client._tracingHelper.getTraceParent(s), d = n.some((h) => ui(h.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: l2, transaction: Ep(o), containsWrite: d, customDataProxyFetch: i })).map((h, T2) => {
            if (h instanceof Error) return h;
            try {
              return this.mapQueryEngineResult(n[T2], h);
            } catch (I) {
              return I;
            }
          });
        }), singleLoader: /* @__PURE__ */ __name(async (n) => {
          let i = n.transaction?.kind === "itx" ? oa(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: ui(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, "singleLoader"), batchBy: /* @__PURE__ */ __name((n) => n.transaction?.id ? `transaction-${n.transaction.id}` : ia(n.protocolQuery), "batchBy"), batchOrder(n, i) {
          return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
        } });
      }
      async request(t) {
        try {
          return await this.dataloader.request(t);
        } catch (r) {
          let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = t;
          this.handleAndLogRequestError({ error: r, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: t.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: t, unpacker: r }, n) {
        let i = n?.data, o = this.unpack(i, t, r);
        return y.env.PRISMA_CLIENT_GET_TIME ? { data: o } : o;
      }
      handleAndLogRequestError(t) {
        try {
          this.handleRequestError(t);
        } catch (r) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: r.message, target: t.clientMethod, timestamp: /* @__PURE__ */ new Date() }), r;
        }
      }
      handleRequestError({ error: t, clientMethod: r, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
        if (wp(t), bp(t, i)) throw t;
        if (t instanceof ne && xp(t)) {
          let d = sa(t.meta);
          Ur({ args: o, errors: [d], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let l2 = t.message;
        if (n && (l2 = Sr({ callsite: n, originalMethod: r, isPanic: t.isPanic, showColors: this.client._errorFormat === "pretty", message: l2 })), l2 = this.sanitizeMessage(l2), t.code) {
          let d = s ? { modelName: s, ...t.meta } : t.meta;
          throw new ne(l2, { code: t.code, clientVersion: this.client._clientVersion, meta: d, batchRequestIdx: t.batchRequestIdx });
        } else {
          if (t.isPanic) throw new Pe(l2, this.client._clientVersion);
          if (t instanceof ie) throw new ie(l2, { clientVersion: this.client._clientVersion, batchRequestIdx: t.batchRequestIdx });
          if (t instanceof Q) throw new Q(l2, this.client._clientVersion);
          if (t instanceof Pe) throw new Pe(l2, this.client._clientVersion);
        }
        throw t.clientVersion = this.client._clientVersion, t;
      }
      sanitizeMessage(t) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? Rn(t) : t;
      }
      unpack(t, r, n) {
        if (!t || (t.data && (t = t.data), !t)) return t;
        let i = Object.keys(t)[0], o = Object.values(t)[0], s = r.filter((d) => d !== "select" && d !== "include"), a = Kn(o, s), l2 = i === "queryRaw" ? nn(a) : dt(a);
        return n ? n(l2) : l2;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function Ep(e) {
      if (e) {
        if (e.kind === "batch") return { kind: "batch", options: { isolationLevel: e.isolationLevel } };
        if (e.kind === "itx") return { kind: "itx", options: oa(e) };
        Ue(e, "Unknown transaction kind");
      }
    }
    __name(Ep, "Ep");
    function oa(e) {
      return { id: e.id, payload: e.payload };
    }
    __name(oa, "oa");
    function bp(e, t) {
      return tn(e) && t?.kind === "batch" && e.batchRequestIdx !== t.index;
    }
    __name(bp, "bp");
    function xp(e) {
      return e.code === "P2009" || e.code === "P2012";
    }
    __name(xp, "xp");
    function sa(e) {
      if (e.kind === "Union") return { kind: "Union", errors: e.errors.map(sa) };
      if (Array.isArray(e.selectionPath)) {
        let [, ...t] = e.selectionPath;
        return { ...e, selectionPath: t };
      }
      return e;
    }
    __name(sa, "sa");
    f2();
    u();
    c();
    p2();
    m();
    var aa = Ds;
    f2();
    u();
    c();
    p2();
    m();
    var ma = Qe(Nn());
    f2();
    u();
    c();
    p2();
    m();
    var q = class extends Error {
      static {
        __name(this, "q");
      }
      constructor(t) {
        super(t + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    N(q, "PrismaClientConstructorValidationError");
    var la = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var ua = ["pretty", "colorless", "minimal"];
    var ca = ["info", "query", "warn", "error"];
    var Pp = { datasources: /* @__PURE__ */ __name((e, { datasourceNames: t }) => {
      if (e) {
        if (typeof e != "object" || Array.isArray(e)) throw new q(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
        for (let [r, n] of Object.entries(e)) {
          if (!t.includes(r)) {
            let i = xt(r, t) || ` Available datasources: ${t.join(", ")}`;
            throw new q(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new q(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i, o] of Object.entries(n)) {
            if (i !== "url") throw new q(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new q(`Invalid value ${JSON.stringify(o)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, "datasources"), adapter: /* @__PURE__ */ __name((e, t) => {
      if (!e && Ze(t.generator) === "client") throw new q('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
      if (e !== null) {
        if (e === void 0) throw new q('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
        if (Ze(t.generator) === "binary") throw new q('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
      }
    }, "adapter"), datasourceUrl: /* @__PURE__ */ __name((e) => {
      if (typeof e < "u" && typeof e != "string") throw new q(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, "datasourceUrl"), errorFormat: /* @__PURE__ */ __name((e) => {
      if (e) {
        if (typeof e != "string") throw new q(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!ua.includes(e)) {
          let t = xt(e, ua);
          throw new q(`Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`);
        }
      }
    }, "errorFormat"), log: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      if (!Array.isArray(e)) throw new q(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
      function t(r) {
        if (typeof r == "string" && !ca.includes(r)) {
          let n = xt(r, ca);
          throw new q(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
        }
      }
      __name(t, "t");
      for (let r of e) {
        t(r);
        let n = { level: t, emit: /* @__PURE__ */ __name((i) => {
          let o = ["stdout", "event"];
          if (!o.includes(i)) {
            let s = xt(i, o);
            throw new q(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
          }
        }, "emit") };
        if (r && typeof r == "object") for (let [i, o] of Object.entries(r)) if (n[i]) n[i](o);
        else throw new q(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    }, "log"), transactionOptions: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      let t = e.maxWait;
      if (t != null && t <= 0) throw new q(`Invalid value ${t} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let r = e.timeout;
      if (r != null && r <= 0) throw new q(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, "transactionOptions"), omit: /* @__PURE__ */ __name((e, t) => {
      if (typeof e != "object") throw new q('"omit" option is expected to be an object.');
      if (e === null) throw new q('"omit" option can not be `null`');
      let r = [];
      for (let [n, i] of Object.entries(e)) {
        let o = Tp(n, t.runtimeDataModel);
        if (!o) {
          r.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let l2 = o.fields.find((d) => d.name === s);
          if (!l2) {
            r.push({ kind: "UnknownField", modelKey: n, fieldName: s });
            continue;
          }
          if (l2.relationName) {
            r.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
            continue;
          }
          typeof a != "boolean" && r.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
        }
      }
      if (r.length > 0) throw new q(Ap(e, r));
    }, "omit"), __internal: /* @__PURE__ */ __name((e) => {
      if (!e) return;
      let t = ["debug", "engine", "configOverride"];
      if (typeof e != "object") throw new q(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
      for (let [r] of Object.entries(e)) if (!t.includes(r)) {
        let n = xt(r, t);
        throw new q(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    }, "__internal") };
    function fa(e, t) {
      for (let [r, n] of Object.entries(e)) {
        if (!la.includes(r)) {
          let i = xt(r, la);
          throw new q(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
        }
        Pp[r](n, t);
      }
      if (e.datasourceUrl && e.datasources) throw new q('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    __name(fa, "fa");
    function xt(e, t) {
      if (t.length === 0 || typeof e != "string") return "";
      let r = vp(e, t);
      return r ? ` Did you mean "${r}"?` : "";
    }
    __name(xt, "xt");
    function vp(e, t) {
      if (t.length === 0) return null;
      let r = t.map((i) => ({ value: i, distance: (0, ma.default)(e, i) }));
      r.sort((i, o) => i.distance < o.distance ? -1 : 1);
      let n = r[0];
      return n.distance < 3 ? n.value : null;
    }
    __name(vp, "vp");
    function Tp(e, t) {
      return pa(t.models, e) ?? pa(t.types, e);
    }
    __name(Tp, "Tp");
    function pa(e, t) {
      let r = Object.keys(e).find((n) => Ie(n) === t);
      if (r) return e[r];
    }
    __name(pa, "pa");
    function Ap(e, t) {
      let r = ut(e);
      for (let o of t) switch (o.kind) {
        case "UnknownModel":
          r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i } = Lr(r, "colorless");
      return `Error validating "omit" option:

${i}

${n}`;
    }
    __name(Ap, "Ap");
    f2();
    u();
    c();
    p2();
    m();
    function da(e) {
      return e.length === 0 ? Promise.resolve([]) : new Promise((t, r) => {
        let n = new Array(e.length), i = null, o = false, s = 0, a = /* @__PURE__ */ __name(() => {
          o || (s++, s === e.length && (o = true, i ? r(i) : t(n)));
        }, "a"), l2 = /* @__PURE__ */ __name((d) => {
          o || (o = true, r(d));
        }, "l");
        for (let d = 0; d < e.length; d++) e[d].then((g) => {
          n[d] = g, a();
        }, (g) => {
          if (!tn(g)) {
            l2(g);
            return;
          }
          g.batchRequestIdx === d ? l2(g) : (i || (i = g), a());
        });
      });
    }
    __name(da, "da");
    var Fe = z("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var Rp = { requestArgsToMiddlewareArgs: /* @__PURE__ */ __name((e) => e, "requestArgsToMiddlewareArgs"), middlewareArgsToRequestArgs: /* @__PURE__ */ __name((e) => e, "middlewareArgsToRequestArgs") };
    var Cp = Symbol.for("prisma.client.transaction.id");
    var Sp = { id: 0, nextId() {
      return ++this.id;
    } };
    function ya(e) {
      class t {
        static {
          __name(this, "t");
        }
        _originalClient = this;
        _runtimeDataModel;
        _requestHandler;
        _connectionPromise;
        _disconnectionPromise;
        _engineConfig;
        _accelerateEngineConfig;
        _clientVersion;
        _errorFormat;
        _tracingHelper;
        _previewFeatures;
        _activeProvider;
        _globalOmit;
        _extensions;
        _engine;
        _appliedParent;
        _createPrismaPromise = si();
        constructor(n) {
          e = n?.__internal?.configOverride?.(e) ?? e, Is(e), n && fa(n, e);
          let i = new Jr().on("error", () => {
          });
          this._extensions = ct.empty(), this._previewFeatures = Gs(e), this._clientVersion = e.clientVersion ?? aa, this._activeProvider = e.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = ta();
          let o = e.relativeEnvPaths && { rootEnvPath: e.relativeEnvPaths.rootEnvPath && dr.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath), schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && dr.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath) }, s;
          if (n?.adapter) {
            s = n.adapter;
            let l2 = e.activeProvider === "postgresql" || e.activeProvider === "cockroachdb" ? "postgres" : e.activeProvider;
            if (s.provider !== l2) throw new Q(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l2}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new Q("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = e.injectableEdgeEnv?.();
          try {
            let l2 = n ?? {}, d = l2.__internal ?? {}, g = d.debug === true;
            g && z.enable("prisma:client");
            let h = dr.resolve(e.dirname, e.relativePath);
            Qi.existsSync(h) || (h = e.dirname), Fe("dirname", e.dirname), Fe("relativePath", e.relativePath), Fe("cwd", h);
            let T2 = d.engine || {};
            if (l2.errorFormat ? this._errorFormat = l2.errorFormat : y.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : y.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e.runtimeDataModel, this._engineConfig = { cwd: h, dirname: e.dirname, enableDebugLogs: g, allowTriggerPanic: T2.allowTriggerPanic, prismaPath: T2.binaryPath ?? void 0, engineEndpoint: T2.endpoint, generator: e.generator, showColors: this._errorFormat === "pretty", logLevel: l2.log && na(l2.log), logQueries: l2.log && !!(typeof l2.log == "string" ? l2.log === "query" : l2.log.find((I) => typeof I == "string" ? I === "query" : I.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e.engineWasm, compilerWasm: e.compilerWasm, clientVersion: e.clientVersion, engineVersion: e.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e.activeProvider, inlineSchema: e.inlineSchema, overrideDatasources: Os(l2, e.datasourceNames), inlineDatasources: e.inlineDatasources, inlineSchemaHash: e.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: l2.transactionOptions?.maxWait ?? 2e3, timeout: l2.transactionOptions?.timeout ?? 5e3, isolationLevel: l2.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: e.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: gt, getBatchRequestPayload: Wr, prismaGraphQLToJSError: Hr, PrismaClientUnknownRequestError: ie, PrismaClientInitializationError: Q, PrismaClientKnownRequestError: ne, debug: z("prisma:client:accelerateEngine"), engineVersion: ha.version, clientVersion: e.clientVersion } }, Fe("clientVersion", e.clientVersion), this._engine = js(e, this._engineConfig), this._requestHandler = new on2(this, i), l2.log) for (let I of l2.log) {
              let S2 = typeof I == "string" ? I : I.emit === "stdout" ? I.level : null;
              S2 && this.$on(S2, (C) => {
                Ct.log(`${Ct.tags[S2] ?? ""}`, C.message || C.query);
              });
            }
          } catch (l2) {
            throw l2.clientVersion = this._clientVersion, l2;
          }
          return this._appliedParent = Gt(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $on(n, i) {
          return n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i), this;
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            Ji();
          }
        }
        $executeRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: oi({ clientMethod: i, activeProvider: a }), callsite: Ne(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $executeRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s, a] = ga(n, i);
              return ii(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
            }
            throw new X("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => (ii(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
        }
        $runCommandRaw(n) {
          if (e.activeProvider !== "mongodb") throw new X(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: Js, callsite: Ne(this._errorFormat), transaction: i }));
        }
        async $queryRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: oi({ clientMethod: i, activeProvider: a }), callsite: Ne(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $queryRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...ga(n, i));
            throw new X("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i) => {
            if (!this._hasPreviewFlag("typedSql")) throw new X("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
        }
        _transactionWithArray({ promises: n, options: i }) {
          let o = Sp.nextId(), s = ra(n.length), a = n.map((l2, d) => {
            if (l2?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let g = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, h = { kind: "batch", id: o, index: d, isolationLevel: g, lock: s };
            return l2.requestTransaction?.(h) ?? l2;
          });
          return da(a);
        }
        async _transactionWithCallback({ callback: n, options: i }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), l2;
          try {
            let d = { kind: "itx", ...a };
            l2 = await n(this._createItxClient(d)), await this._engine.transaction("commit", o, a);
          } catch (d) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), d;
          }
          return l2;
        }
        _createItxClient(n) {
          return me(Gt(me(ds(this), [te("_appliedParent", () => this._appliedParent._createItxClient(n)), te("_createPrismaPromise", () => si(n)), te(Cp, () => n.id)])), [mt(Es)]);
        }
        $transaction(n, i) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = /* @__PURE__ */ __name(() => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          }, "o") : o = /* @__PURE__ */ __name(() => this._transactionWithCallback({ callback: n, options: i }), "o") : o = /* @__PURE__ */ __name(() => this._transactionWithArray({ promises: n, options: i }), "o");
          let s = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i = n.middlewareArgsMapper ?? Rp, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = /* @__PURE__ */ __name(async (l2) => {
            let { runInTransaction: d, args: g, ...h } = l2, T2 = { ...n, ...h };
            g && (T2.args = i.middlewareArgsToRequestArgs(g)), n.transaction !== void 0 && d === false && delete T2.transaction;
            let I = await vs(this, T2);
            return T2.model ? ws({ result: I, modelName: T2.model, args: T2.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : I;
          }, "a");
          return this._tracingHelper.runInChildSpan(s.operation, () => a(o));
        }
        async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: l2, argsMapper: d, transaction: g, unpacker: h, otelParentCtx: T2, customDataProxyFetch: I }) {
          try {
            n = d ? d(n) : n;
            let S2 = { name: "serialize" }, C = this._tracingHelper.runInChildSpan(S2, () => $r({ modelName: l2, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return z.enabled("prisma:client") && (Fe("Prisma Client call:"), Fe(`prisma.${i}(${is(n)})`), Fe("Generated request:"), Fe(JSON.stringify(C, null, 2) + `
`)), g?.kind === "batch" && await g.lock, this._requestHandler.request({ protocolQuery: C, modelName: l2, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: g, unpacker: h, otelParentCtx: T2, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: I });
          } catch (S2) {
            throw S2.clientVersion = this._clientVersion, S2;
          }
        }
        $metrics = new pt(this);
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
        $extends = gs;
      }
      return t;
    }
    __name(ya, "ya");
    function ga(e, t) {
      return Ip(e) ? [new se(e, t), Zs] : [e, Xs];
    }
    __name(ga, "ga");
    function Ip(e) {
      return Array.isArray(e) && Array.isArray(e.raw);
    }
    __name(Ip, "Ip");
    f2();
    u();
    c();
    p2();
    m();
    var Op = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function wa(e) {
      return new Proxy(e, { get(t, r) {
        if (r in t) return t[r];
        if (!Op.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
      } });
    }
    __name(wa, "wa");
    f2();
    u();
    c();
    p2();
    m();
  }
});

// ../../node_modules/.prisma/client/edge.js
var require_edge2 = __commonJS({
  "../../node_modules/.prisma/client/edge.js"(exports) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      getPrismaClient: getPrismaClient2,
      sqltag: sqltag2,
      empty: empty2,
      join: join2,
      raw: raw3,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug2,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2,
      createParam: createParam2
    } = require_edge();
    var Prisma = {};
    exports.Prisma = Prisma;
    exports.$Enums = {};
    Prisma.prismaVersion = {
      client: "6.18.0",
      engine: "34b5a692b7bd79939a9a2c3ef97d816e749cda2f"
    };
    Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma.Decimal = Decimal2;
    Prisma.sql = sqltag2;
    Prisma.empty = empty2;
    Prisma.join = join2;
    Prisma.raw = raw3;
    Prisma.validator = Public2.validator;
    Prisma.getExtensionContext = Extensions2.getExtensionContext;
    Prisma.defineExtension = Extensions2.defineExtension;
    Prisma.DbNull = objectEnumValues2.instances.DbNull;
    Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    exports.Prisma.UserScalarFieldEnum = {
      id: "id",
      username: "username",
      password: "password",
      type: "type",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ClientScalarFieldEnum = {
      id: "id",
      userId: "userId",
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      address: "address",
      city: "city",
      state: "state",
      zip: "zip",
      notificationEmail: "notificationEmail",
      notificationSms: "notificationSms",
      profilePicture: "profilePicture",
      isActive: "isActive",
      isBanned: "isBanned",
      suspendedUntil: "suspendedUntil",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ContractorScalarFieldEnum = {
      id: "id",
      userId: "userId",
      name: "name",
      email: "email",
      phone: "phone",
      description: "description",
      yearsInBusiness: "yearsInBusiness",
      location: "location",
      googleBusinessUrl: "googleBusinessUrl",
      verified: "verified",
      licensed: "licensed",
      rating: "rating",
      reviewCount: "reviewCount",
      profilePicture: "profilePicture",
      isActive: "isActive",
      isBanned: "isBanned",
      suspendedUntil: "suspendedUntil",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ServiceScalarFieldEnum = {
      id: "id",
      name: "name",
      icon: "icon",
      description: "description",
      createdAt: "createdAt"
    };
    exports.Prisma.ContractorServiceScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      serviceId: "serviceId",
      basePrice: "basePrice",
      createdAt: "createdAt"
    };
    exports.Prisma.BookingScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      clientId: "clientId",
      serviceId: "serviceId",
      serviceAddress: "serviceAddress",
      scheduledDate: "scheduledDate",
      scheduledTime: "scheduledTime",
      estimatedDuration: "estimatedDuration",
      status: "status",
      price: "price",
      paymentReceived: "paymentReceived",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.JobCompletionScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      startTime: "startTime",
      endTime: "endTime",
      materials: "materials",
      notes: "notes",
      audioNoteUrl: "audioNoteUrl",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.JobPhotoScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      filename: "filename",
      originalName: "originalName",
      photoType: "photoType",
      fileSize: "fileSize",
      url: "url",
      createdAt: "createdAt"
    };
    exports.Prisma.MessageScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      clientId: "clientId",
      subject: "subject",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ChatMessageScalarFieldEnum = {
      id: "id",
      messageId: "messageId",
      sender: "sender",
      messageText: "messageText",
      createdAt: "createdAt"
    };
    exports.Prisma.FlaggedMessageScalarFieldEnum = {
      id: "id",
      messageId: "messageId",
      messageText: "messageText",
      flaggedBy: "flaggedBy",
      flaggedById: "flaggedById",
      contractorId: "contractorId",
      clientId: "clientId",
      reason: "reason",
      details: "details",
      status: "status",
      reviewedBy: "reviewedBy",
      reviewedAt: "reviewedAt",
      createdAt: "createdAt"
    };
    exports.Prisma.ReviewScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      clientId: "clientId",
      rating: "rating",
      reviewText: "reviewText",
      createdAt: "createdAt"
    };
    exports.Prisma.InvoiceScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      amount: "amount",
      taxAmount: "taxAmount",
      totalAmount: "totalAmount",
      status: "status",
      dueDate: "dueDate",
      paidAt: "paidAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.PaymentScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      invoiceId: "invoiceId",
      amount: "amount",
      paymentMethod: "paymentMethod",
      stripePaymentId: "stripePaymentId",
      stripePaymentIntent: "stripePaymentIntent",
      status: "status",
      paidAt: "paidAt",
      createdAt: "createdAt"
    };
    exports.Prisma.AvailabilityScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      dayOfWeek: "dayOfWeek",
      specificDate: "specificDate",
      startTime: "startTime",
      endTime: "endTime",
      maxBookings: "maxBookings",
      isAvailable: "isAvailable",
      isRecurring: "isRecurring",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ContractorServiceAreaScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      dayOfWeek: "dayOfWeek",
      area: "area",
      isActive: "isActive",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.FavoriteContractorScalarFieldEnum = {
      id: "id",
      clientId: "clientId",
      contractorId: "contractorId",
      createdAt: "createdAt"
    };
    exports.Prisma.ActivityLogScalarFieldEnum = {
      id: "id",
      userId: "userId",
      action: "action",
      details: "details",
      severity: "severity",
      metadata: "metadata",
      createdAt: "createdAt"
    };
    exports.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports.Prisma.NullableJsonNullValueInput = {
      DbNull: Prisma.DbNull,
      JsonNull: Prisma.JsonNull
    };
    exports.Prisma.QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    exports.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports.Prisma.JsonNullValueFilter = {
      DbNull: Prisma.DbNull,
      JsonNull: Prisma.JsonNull,
      AnyNull: Prisma.AnyNull
    };
    exports.UserType = exports.$Enums.UserType = {
      CLIENT: "CLIENT",
      CONTRACTOR: "CONTRACTOR",
      ADMIN: "ADMIN"
    };
    exports.BookingStatus = exports.$Enums.BookingStatus = {
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      IN_PROGRESS: "IN_PROGRESS",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED"
    };
    exports.PhotoType = exports.$Enums.PhotoType = {
      BEFORE: "BEFORE",
      AFTER: "AFTER",
      ADDITIONAL: "ADDITIONAL"
    };
    exports.MessageStatus = exports.$Enums.MessageStatus = {
      READ: "READ",
      UNREAD: "UNREAD"
    };
    exports.SenderType = exports.$Enums.SenderType = {
      CONTRACTOR: "CONTRACTOR",
      CLIENT: "CLIENT"
    };
    exports.FlaggedByType = exports.$Enums.FlaggedByType = {
      CONTRACTOR: "CONTRACTOR",
      CLIENT: "CLIENT"
    };
    exports.FlagStatus = exports.$Enums.FlagStatus = {
      PENDING: "PENDING",
      REVIEWED: "REVIEWED",
      RESOLVED: "RESOLVED",
      DISMISSED: "DISMISSED"
    };
    exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
      PENDING: "PENDING",
      PAID: "PAID",
      OVERDUE: "OVERDUE",
      CANCELLED: "CANCELLED"
    };
    exports.PaymentStatus = exports.$Enums.PaymentStatus = {
      PENDING: "PENDING",
      PROCESSING: "PROCESSING",
      SUCCEEDED: "SUCCEEDED",
      FAILED: "FAILED",
      REFUNDED: "REFUNDED"
    };
    exports.ActivitySeverity = exports.$Enums.ActivitySeverity = {
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      HIGH: "HIGH"
    };
    exports.Prisma.ModelName = {
      User: "User",
      Client: "Client",
      Contractor: "Contractor",
      Service: "Service",
      ContractorService: "ContractorService",
      Booking: "Booking",
      JobCompletion: "JobCompletion",
      JobPhoto: "JobPhoto",
      Message: "Message",
      ChatMessage: "ChatMessage",
      FlaggedMessage: "FlaggedMessage",
      Review: "Review",
      Invoice: "Invoice",
      Payment: "Payment",
      Availability: "Availability",
      ContractorServiceArea: "ContractorServiceArea",
      FavoriteContractor: "FavoriteContractor",
      ActivityLog: "ActivityLog"
    };
    var config2 = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "/Users/codylockwood/FixterConnect/fixterconnect/node_modules/@prisma/client",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "darwin-arm64",
            "native": true
          }
        ],
        "previewFeatures": [],
        "sourceFilePath": "/Users/codylockwood/FixterConnect/fixterconnect/packages/server/prisma/schema.prisma"
      },
      "relativeEnvPaths": {
        "rootEnvPath": null,
        "schemaEnvPath": "../../../packages/server/.env"
      },
      "relativePath": "../../../packages/server/prisma",
      "clientVersion": "6.18.0",
      "engineVersion": "34b5a692b7bd79939a9a2c3ef97d816e749cda2f",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "postgresql",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": "DATABASE_URL",
            "value": null
          }
        }
      },
      "inlineSchema": '// FixterConnect Database Schema\n// Using Prisma with Supabase PostgreSQL\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n// ============================================\n// USER & AUTH MODELS\n// ============================================\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  username  String   @unique\n  password  String // bcrypt hashed\n  type      UserType\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  client     Client?\n  contractor Contractor?\n\n  @@map("users")\n}\n\nenum UserType {\n  CLIENT\n  CONTRACTOR\n  ADMIN\n}\n\n// ============================================\n// CLIENT MODEL\n// ============================================\n\nmodel Client {\n  id                Int       @id @default(autoincrement())\n  userId            Int       @unique @map("user_id")\n  firstName         String    @map("first_name")\n  lastName          String    @map("last_name")\n  email             String    @unique\n  phone             String\n  address           String?\n  city              String?\n  state             String?\n  zip               String?\n  notificationEmail Boolean   @default(true) @map("notification_email")\n  notificationSms   Boolean   @default(true) @map("notification_sms")\n  profilePicture    String?   @map("profile_picture")\n  isActive          Boolean   @default(true) @map("is_active")\n  isBanned          Boolean   @default(false) @map("is_banned")\n  suspendedUntil    DateTime? @map("suspended_until")\n  createdAt         DateTime  @default(now()) @map("created_at")\n  updatedAt         DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  user            User                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bookings        Booking[]\n  reviews         Review[]\n  messages        Message[]\n  flaggedMessages FlaggedMessage[]\n  favorites       FavoriteContractor[]\n\n  @@map("clients")\n}\n\n// ============================================\n// CONTRACTOR MODEL\n// ============================================\n\nmodel Contractor {\n  id                Int       @id @default(autoincrement())\n  userId            Int       @unique @map("user_id")\n  name              String\n  email             String?\n  phone             String?\n  description       String?   @db.Text\n  yearsInBusiness   Int?      @map("years_in_business")\n  location          String?\n  googleBusinessUrl String?   @map("google_business_url")\n  verified          Boolean   @default(false)\n  licensed          Boolean   @default(false)\n  rating            Float     @default(0)\n  reviewCount       Int       @default(0) @map("review_count")\n  profilePicture    String?   @map("profile_picture")\n  isActive          Boolean   @default(true) @map("is_active")\n  isBanned          Boolean   @default(false) @map("is_banned")\n  suspendedUntil    DateTime? @map("suspended_until")\n  createdAt         DateTime  @default(now()) @map("created_at")\n  updatedAt         DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  user            User                    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  services        ContractorService[]\n  bookings        Booking[]\n  reviews         Review[]\n  messages        Message[]\n  availability    Availability[]\n  serviceAreas    ContractorServiceArea[]\n  flaggedMessages FlaggedMessage[]\n  favoritedBy     FavoriteContractor[]\n\n  @@map("contractors")\n}\n\n// ============================================\n// SERVICES\n// ============================================\n\nmodel Service {\n  id          Int      @id @default(autoincrement())\n  name        String   @unique\n  icon        String\n  description String?  @db.Text\n  createdAt   DateTime @default(now()) @map("created_at")\n\n  // Relations\n  contractors ContractorService[]\n  bookings    Booking[]\n\n  @@map("services")\n}\n\nmodel ContractorService {\n  id           Int      @id @default(autoincrement())\n  contractorId Int      @map("contractor_id")\n  serviceId    Int      @map("service_id")\n  basePrice    Float?   @map("base_price")\n  createdAt    DateTime @default(now()) @map("created_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n  service    Service    @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n\n  @@unique([contractorId, serviceId])\n  @@map("contractor_services")\n}\n\n// ============================================\n// BOOKINGS & JOBS\n// ============================================\n\nmodel Booking {\n  id                Int           @id @default(autoincrement())\n  contractorId      Int           @map("contractor_id")\n  clientId          Int           @map("client_id")\n  serviceId         Int           @map("service_id")\n  serviceAddress    String        @map("service_address")\n  scheduledDate     DateTime      @map("scheduled_date")\n  scheduledTime     String        @map("scheduled_time")\n  estimatedDuration Int?          @map("estimated_duration") // in minutes\n  status            BookingStatus @default(PENDING)\n  price             Float?\n  paymentReceived   Boolean       @default(false) @map("payment_received")\n  createdAt         DateTime      @default(now()) @map("created_at")\n  updatedAt         DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  contractor Contractor     @relation(fields: [contractorId], references: [id])\n  client     Client         @relation(fields: [clientId], references: [id])\n  service    Service        @relation(fields: [serviceId], references: [id])\n  completion JobCompletion?\n  photos     JobPhoto[]\n  invoice    Invoice?\n  payments   Payment[]\n\n  @@index([contractorId])\n  @@index([clientId])\n  @@index([scheduledDate])\n  @@index([contractorId, scheduledDate, status])\n  @@map("bookings")\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nmodel JobCompletion {\n  id           Int       @id @default(autoincrement())\n  bookingId    Int       @unique @map("booking_id")\n  startTime    DateTime? @map("start_time")\n  endTime      DateTime? @map("end_time")\n  materials    String?   @db.Text\n  notes        String?   @db.Text\n  audioNoteUrl String?   @map("audio_note_url")\n  createdAt    DateTime  @default(now()) @map("created_at")\n  updatedAt    DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@map("job_completions")\n}\n\nmodel JobPhoto {\n  id           Int       @id @default(autoincrement())\n  bookingId    Int       @map("booking_id")\n  filename     String\n  originalName String    @map("original_name")\n  photoType    PhotoType @map("photo_type")\n  fileSize     Int       @map("file_size")\n  url          String\n  createdAt    DateTime  @default(now()) @map("created_at")\n\n  // Relations\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@index([bookingId])\n  @@map("job_photos")\n}\n\nenum PhotoType {\n  BEFORE\n  AFTER\n  ADDITIONAL\n}\n\n// ============================================\n// MESSAGING\n// ============================================\n\nmodel Message {\n  id           Int           @id @default(autoincrement())\n  contractorId Int           @map("contractor_id")\n  clientId     Int           @map("client_id")\n  subject      String?\n  status       MessageStatus @default(UNREAD)\n  createdAt    DateTime      @default(now()) @map("created_at")\n  updatedAt    DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  contractor   Contractor    @relation(fields: [contractorId], references: [id])\n  client       Client        @relation(fields: [clientId], references: [id])\n  chatMessages ChatMessage[]\n\n  @@index([contractorId])\n  @@index([clientId])\n  @@map("messages")\n}\n\nenum MessageStatus {\n  READ\n  UNREAD\n}\n\nmodel ChatMessage {\n  id          Int        @id @default(autoincrement())\n  messageId   Int        @map("message_id")\n  sender      SenderType\n  messageText String     @map("message_text") @db.Text\n  createdAt   DateTime   @default(now()) @map("created_at")\n\n  // Relations\n  message Message @relation(fields: [messageId], references: [id], onDelete: Cascade)\n\n  @@index([messageId])\n  @@map("chat_messages")\n}\n\nenum SenderType {\n  CONTRACTOR\n  CLIENT\n}\n\nmodel FlaggedMessage {\n  id           Int           @id @default(autoincrement())\n  messageId    Int?          @map("message_id")\n  messageText  String        @map("message_text") @db.Text\n  flaggedBy    FlaggedByType @map("flagged_by")\n  flaggedById  Int           @map("flagged_by_id")\n  contractorId Int?          @map("contractor_id")\n  clientId     Int?          @map("client_id")\n  reason       String\n  details      String?       @db.Text\n  status       FlagStatus    @default(PENDING)\n  reviewedBy   Int?          @map("reviewed_by")\n  reviewedAt   DateTime?     @map("reviewed_at")\n  createdAt    DateTime      @default(now()) @map("created_at")\n\n  // Relations\n  contractor Contractor? @relation(fields: [contractorId], references: [id])\n  client     Client?     @relation(fields: [clientId], references: [id])\n\n  @@index([status])\n  @@map("flagged_messages")\n}\n\nenum FlaggedByType {\n  CONTRACTOR\n  CLIENT\n}\n\nenum FlagStatus {\n  PENDING\n  REVIEWED\n  RESOLVED\n  DISMISSED\n}\n\n// ============================================\n// REVIEWS & RATINGS\n// ============================================\n\nmodel Review {\n  id           Int      @id @default(autoincrement())\n  contractorId Int      @map("contractor_id")\n  clientId     Int      @map("client_id")\n  rating       Int // 1-5 stars\n  reviewText   String?  @map("review_text") @db.Text\n  createdAt    DateTime @default(now()) @map("created_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id])\n  client     Client     @relation(fields: [clientId], references: [id])\n\n  @@index([contractorId])\n  @@map("reviews")\n}\n\n// ============================================\n// PAYMENTS & INVOICES\n// ============================================\n\nmodel Invoice {\n  id          Int           @id @default(autoincrement())\n  bookingId   Int           @unique @map("booking_id")\n  amount      Float\n  taxAmount   Float?        @map("tax_amount")\n  totalAmount Float         @map("total_amount")\n  status      InvoiceStatus @default(PENDING)\n  dueDate     DateTime?     @map("due_date")\n  paidAt      DateTime?     @map("paid_at")\n  createdAt   DateTime      @default(now()) @map("created_at")\n  updatedAt   DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  booking  Booking   @relation(fields: [bookingId], references: [id])\n  payments Payment[]\n\n  @@map("invoices")\n}\n\nenum InvoiceStatus {\n  PENDING\n  PAID\n  OVERDUE\n  CANCELLED\n}\n\nmodel Payment {\n  id                  Int           @id @default(autoincrement())\n  bookingId           Int           @map("booking_id")\n  invoiceId           Int?          @map("invoice_id")\n  amount              Float\n  paymentMethod       String        @map("payment_method")\n  stripePaymentId     String?       @unique @map("stripe_payment_id")\n  stripePaymentIntent String?       @unique @map("stripe_payment_intent")\n  status              PaymentStatus @default(PENDING)\n  paidAt              DateTime?     @map("paid_at")\n  createdAt           DateTime      @default(now()) @map("created_at")\n\n  // Relations\n  booking Booking  @relation(fields: [bookingId], references: [id])\n  invoice Invoice? @relation(fields: [invoiceId], references: [id])\n\n  @@index([bookingId])\n  @@map("payments")\n}\n\nenum PaymentStatus {\n  PENDING\n  PROCESSING\n  SUCCEEDED\n  FAILED\n  REFUNDED\n}\n\n// ============================================\n// CONTRACTOR AVAILABILITY\n// ============================================\n\n// General working hours for contractors (recurring schedule)\nmodel Availability {\n  id           Int       @id @default(autoincrement())\n  contractorId Int       @map("contractor_id")\n  dayOfWeek    Int?      @map("day_of_week") // 0=Sunday, 1=Monday, etc. NULL for specific dates\n  specificDate DateTime? @map("specific_date") // For one-time overrides (vacation, holidays)\n  startTime    String    @map("start_time") // e.g., "08:00"\n  endTime      String    @map("end_time") // e.g., "17:00"\n  maxBookings  Int       @default(8) @map("max_bookings") // Max jobs per day\n  isAvailable  Boolean   @default(true) @map("is_available")\n  isRecurring  Boolean   @default(true) @map("is_recurring") // true = recurring weekly, false = specific date\n  createdAt    DateTime  @default(now()) @map("created_at")\n  updatedAt    DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n\n  @@index([contractorId, dayOfWeek])\n  @@index([contractorId, specificDate])\n  @@map("availability")\n}\n\n// ============================================\n// SERVICE AREAS\n// ============================================\n\n// Tracks which areas a contractor serves on which days\nmodel ContractorServiceArea {\n  id           Int      @id @default(autoincrement())\n  contractorId Int      @map("contractor_id")\n  dayOfWeek    Int?     @map("day_of_week") // 0=Sunday, 1=Monday, etc. NULL = all days\n  area         String // City/area name (e.g., "Boise", "Nampa")\n  isActive     Boolean  @default(true) @map("is_active")\n  createdAt    DateTime @default(now()) @map("created_at")\n  updatedAt    DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n\n  @@index([contractorId, dayOfWeek])\n  @@index([area])\n  @@map("contractor_service_areas")\n}\n\n// ============================================\n// FAVORITE CONTRACTORS\n// ============================================\n\nmodel FavoriteContractor {\n  id           Int      @id @default(autoincrement())\n  clientId     Int      @map("client_id")\n  contractorId Int      @map("contractor_id")\n  createdAt    DateTime @default(now()) @map("created_at")\n\n  // Relations\n  client     Client     @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n\n  @@unique([clientId, contractorId])\n  @@index([clientId])\n  @@map("favorite_contractors")\n}\n\n// ============================================\n// ADMIN ACTIVITY LOGS\n// ============================================\n\nenum ActivitySeverity {\n  LOW\n  MEDIUM\n  HIGH\n}\n\nmodel ActivityLog {\n  id        Int              @id @default(autoincrement())\n  userId    Int?             @map("user_id") // Admin user who performed the action\n  action    String // e.g., "Flag Dismissed", "User Suspended", "User Banned"\n  details   String           @db.Text // Full description of what happened\n  severity  ActivitySeverity @default(LOW)\n  metadata  Json? // Additional structured data (user IDs, flag IDs, etc.)\n  createdAt DateTime         @default(now()) @map("created_at")\n\n  @@index([createdAt])\n  @@index([severity])\n  @@map("activity_logs")\n}\n',
      "inlineSchemaHash": "8f2ccfe64660c30850b8766ba153e675908e822190d83a352cf22d905a0361c6",
      "copyEngine": false
    };
    config2.dirname = "/";
    config2.runtimeDataModel = JSON.parse('{"models":{"User":{"dbName":"users","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"username","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"UserType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"client","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Client","nativeType":null,"relationName":"ClientToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"contractor","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Client":{"dbName":"clients","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","dbName":"user_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"firstName","dbName":"first_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"lastName","dbName":"last_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"address","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"city","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"state","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"zip","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"notificationEmail","dbName":"notification_email","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"notificationSms","dbName":"notification_sms","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"profilePicture","dbName":"profile_picture","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isActive","dbName":"is_active","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"isBanned","dbName":"is_banned","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"suspendedUntil","dbName":"suspended_until","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ClientToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"bookings","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToClient","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","nativeType":null,"relationName":"ClientToReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"messages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Message","nativeType":null,"relationName":"ClientToMessage","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"flaggedMessages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"FlaggedMessage","nativeType":null,"relationName":"ClientToFlaggedMessage","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"favorites","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"FavoriteContractor","nativeType":null,"relationName":"ClientToFavoriteContractor","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Contractor":{"dbName":"contractors","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","dbName":"user_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"yearsInBusiness","dbName":"years_in_business","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"googleBusinessUrl","dbName":"google_business_url","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"verified","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"licensed","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"reviewCount","dbName":"review_count","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"profilePicture","dbName":"profile_picture","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isActive","dbName":"is_active","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"isBanned","dbName":"is_banned","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"suspendedUntil","dbName":"suspended_until","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ContractorToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"services","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ContractorService","nativeType":null,"relationName":"ContractorToContractorService","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"bookings","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToContractor","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","nativeType":null,"relationName":"ContractorToReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"messages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Message","nativeType":null,"relationName":"ContractorToMessage","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"availability","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Availability","nativeType":null,"relationName":"AvailabilityToContractor","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"serviceAreas","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ContractorServiceArea","nativeType":null,"relationName":"ContractorToContractorServiceArea","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"flaggedMessages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"FlaggedMessage","nativeType":null,"relationName":"ContractorToFlaggedMessage","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"favoritedBy","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"FavoriteContractor","nativeType":null,"relationName":"ContractorToFavoriteContractor","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Service":{"dbName":"services","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"icon","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractors","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ContractorService","nativeType":null,"relationName":"ContractorServiceToService","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"bookings","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToService","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ContractorService":{"dbName":"contractor_services","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"serviceId","dbName":"service_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"basePrice","dbName":"base_price","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToContractorService","relationFromFields":["contractorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"service","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Service","nativeType":null,"relationName":"ContractorServiceToService","relationFromFields":["serviceId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["contractorId","serviceId"]],"uniqueIndexes":[{"name":null,"fields":["contractorId","serviceId"]}],"isGenerated":false},"Booking":{"dbName":"bookings","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"clientId","dbName":"client_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"serviceId","dbName":"service_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"serviceAddress","dbName":"service_address","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"scheduledDate","dbName":"scheduled_date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"scheduledTime","dbName":"scheduled_time","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"estimatedDuration","dbName":"estimated_duration","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"BookingStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"paymentReceived","dbName":"payment_received","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"BookingToContractor","relationFromFields":["contractorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"client","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Client","nativeType":null,"relationName":"BookingToClient","relationFromFields":["clientId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"service","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Service","nativeType":null,"relationName":"BookingToService","relationFromFields":["serviceId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"completion","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"JobCompletion","nativeType":null,"relationName":"BookingToJobCompletion","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"photos","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"JobPhoto","nativeType":null,"relationName":"BookingToJobPhoto","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"invoice","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Invoice","nativeType":null,"relationName":"BookingToInvoice","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"payments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Payment","nativeType":null,"relationName":"BookingToPayment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"JobCompletion":{"dbName":"job_completions","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"bookingId","dbName":"booking_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"startTime","dbName":"start_time","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"endTime","dbName":"end_time","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"materials","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"audioNoteUrl","dbName":"audio_note_url","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"booking","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToJobCompletion","relationFromFields":["bookingId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"JobPhoto":{"dbName":"job_photos","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"bookingId","dbName":"booking_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"filename","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"originalName","dbName":"original_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"photoType","dbName":"photo_type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PhotoType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"fileSize","dbName":"file_size","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"url","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"booking","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToJobPhoto","relationFromFields":["bookingId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Message":{"dbName":"messages","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"clientId","dbName":"client_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"subject","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"MessageStatus","nativeType":null,"default":"UNREAD","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToMessage","relationFromFields":["contractorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"client","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Client","nativeType":null,"relationName":"ClientToMessage","relationFromFields":["clientId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"chatMessages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ChatMessage","nativeType":null,"relationName":"ChatMessageToMessage","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ChatMessage":{"dbName":"chat_messages","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"messageId","dbName":"message_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sender","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SenderType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"messageText","dbName":"message_text","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Message","nativeType":null,"relationName":"ChatMessageToMessage","relationFromFields":["messageId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"FlaggedMessage":{"dbName":"flagged_messages","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"messageId","dbName":"message_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"messageText","dbName":"message_text","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"flaggedBy","dbName":"flagged_by","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"FlaggedByType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"flaggedById","dbName":"flagged_by_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"clientId","dbName":"client_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"reason","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"details","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"FlagStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"reviewedBy","dbName":"reviewed_by","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"reviewedAt","dbName":"reviewed_at","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractor","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToFlaggedMessage","relationFromFields":["contractorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"client","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Client","nativeType":null,"relationName":"ClientToFlaggedMessage","relationFromFields":["clientId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Review":{"dbName":"reviews","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"clientId","dbName":"client_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"reviewText","dbName":"review_text","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToReview","relationFromFields":["contractorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"client","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Client","nativeType":null,"relationName":"ClientToReview","relationFromFields":["clientId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Invoice":{"dbName":"invoices","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"bookingId","dbName":"booking_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"amount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"taxAmount","dbName":"tax_amount","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"totalAmount","dbName":"total_amount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"InvoiceStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"dueDate","dbName":"due_date","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"paidAt","dbName":"paid_at","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"booking","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToInvoice","relationFromFields":["bookingId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"payments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Payment","nativeType":null,"relationName":"InvoiceToPayment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Payment":{"dbName":"payments","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"bookingId","dbName":"booking_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"invoiceId","dbName":"invoice_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"amount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"paymentMethod","dbName":"payment_method","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"stripePaymentId","dbName":"stripe_payment_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"stripePaymentIntent","dbName":"stripe_payment_intent","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"PaymentStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"paidAt","dbName":"paid_at","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"booking","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Booking","nativeType":null,"relationName":"BookingToPayment","relationFromFields":["bookingId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"invoice","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Invoice","nativeType":null,"relationName":"InvoiceToPayment","relationFromFields":["invoiceId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Availability":{"dbName":"availability","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"dayOfWeek","dbName":"day_of_week","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"specificDate","dbName":"specific_date","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"startTime","dbName":"start_time","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"endTime","dbName":"end_time","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"maxBookings","dbName":"max_bookings","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":8,"isGenerated":false,"isUpdatedAt":false},{"name":"isAvailable","dbName":"is_available","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"isRecurring","dbName":"is_recurring","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"AvailabilityToContractor","relationFromFields":["contractorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ContractorServiceArea":{"dbName":"contractor_service_areas","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"dayOfWeek","dbName":"day_of_week","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"area","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isActive","dbName":"is_active","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToContractorServiceArea","relationFromFields":["contractorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"FavoriteContractor":{"dbName":"favorite_contractors","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"clientId","dbName":"client_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"contractorId","dbName":"contractor_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"client","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Client","nativeType":null,"relationName":"ClientToFavoriteContractor","relationFromFields":["clientId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"contractor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Contractor","nativeType":null,"relationName":"ContractorToFavoriteContractor","relationFromFields":["contractorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["clientId","contractorId"]],"uniqueIndexes":[{"name":null,"fields":["clientId","contractorId"]}],"isGenerated":false},"ActivityLog":{"dbName":"activity_logs","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","dbName":"user_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"action","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"details","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":["Text",[]],"isGenerated":false,"isUpdatedAt":false},{"name":"severity","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"ActivitySeverity","nativeType":null,"default":"LOW","isGenerated":false,"isUpdatedAt":false},{"name":"metadata","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{"UserType":{"values":[{"name":"CLIENT","dbName":null},{"name":"CONTRACTOR","dbName":null},{"name":"ADMIN","dbName":null}],"dbName":null},"BookingStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"CONFIRMED","dbName":null},{"name":"IN_PROGRESS","dbName":null},{"name":"COMPLETED","dbName":null},{"name":"CANCELLED","dbName":null}],"dbName":null},"PhotoType":{"values":[{"name":"BEFORE","dbName":null},{"name":"AFTER","dbName":null},{"name":"ADDITIONAL","dbName":null}],"dbName":null},"MessageStatus":{"values":[{"name":"READ","dbName":null},{"name":"UNREAD","dbName":null}],"dbName":null},"SenderType":{"values":[{"name":"CONTRACTOR","dbName":null},{"name":"CLIENT","dbName":null}],"dbName":null},"FlaggedByType":{"values":[{"name":"CONTRACTOR","dbName":null},{"name":"CLIENT","dbName":null}],"dbName":null},"FlagStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"REVIEWED","dbName":null},{"name":"RESOLVED","dbName":null},{"name":"DISMISSED","dbName":null}],"dbName":null},"InvoiceStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"PAID","dbName":null},{"name":"OVERDUE","dbName":null},{"name":"CANCELLED","dbName":null}],"dbName":null},"PaymentStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"PROCESSING","dbName":null},{"name":"SUCCEEDED","dbName":null},{"name":"FAILED","dbName":null},{"name":"REFUNDED","dbName":null}],"dbName":null},"ActivitySeverity":{"values":[{"name":"LOW","dbName":null},{"name":"MEDIUM","dbName":null},{"name":"HIGH","dbName":null}],"dbName":null}},"types":{}}');
    defineDmmfProperty2(exports.Prisma, config2.runtimeDataModel);
    config2.engineWasm = void 0;
    config2.compilerWasm = void 0;
    config2.injectableEdgeEnv = () => ({
      parsed: {
        DATABASE_URL: typeof globalThis !== "undefined" && globalThis["DATABASE_URL"] || typeof process !== "undefined" && process.env && process.env.DATABASE_URL || void 0
      }
    });
    if (typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0) {
      Debug2.enable(typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0);
    }
    var PrismaClient2 = getPrismaClient2(config2);
    exports.PrismaClient = PrismaClient2;
    Object.assign(exports, Prisma);
  }
});

// ../../node_modules/@prisma/client/edge.js
var require_edge3 = __commonJS({
  "../../node_modules/@prisma/client/edge.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = {
      // https://github.com/prisma/prisma/pull/12907
      ...require_edge2()
    };
  }
});

// ../../node_modules/@prisma/client/scripts/default-index.js
var require_default_index = __commonJS({
  "../../node_modules/@prisma/client/scripts/default-index.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var default_index_exports = {};
    __export(default_index_exports, {
      Prisma: /* @__PURE__ */ __name(() => Prisma, "Prisma"),
      PrismaClient: /* @__PURE__ */ __name(() => PrismaClient2, "PrismaClient"),
      default: /* @__PURE__ */ __name(() => default_index_default, "default")
    });
    module.exports = __toCommonJS(default_index_exports);
    var prisma = {
      enginesVersion: "34b5a692b7bd79939a9a2c3ef97d816e749cda2f"
    };
    var version2 = "6.18.0";
    var clientVersion = version2;
    var PrismaClient2 = class {
      static {
        __name(this, "PrismaClient");
      }
      constructor() {
        throw new Error('@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.');
      }
    };
    function defineExtension(ext) {
      if (typeof ext === "function") {
        return ext;
      }
      return (client) => client.$extends(ext);
    }
    __name(defineExtension, "defineExtension");
    function getExtensionContext(that) {
      return that;
    }
    __name(getExtensionContext, "getExtensionContext");
    var Prisma = {
      defineExtension,
      getExtensionContext,
      prismaVersion: { client: clientVersion, engine: prisma.enginesVersion }
    };
    var default_index_default = { Prisma };
  }
});

// ../../node_modules/@prisma/client/runtime/wasm-engine-edge.js
var require_wasm_engine_edge = __commonJS({
  "../../node_modules/@prisma/client/runtime/wasm-engine-edge.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var zo = Object.create;
    var St = Object.defineProperty;
    var Yo = Object.getOwnPropertyDescriptor;
    var Xo = Object.getOwnPropertyNames;
    var Zo = Object.getPrototypeOf;
    var es = Object.prototype.hasOwnProperty;
    var ie = /* @__PURE__ */ __name((t, e) => () => (t && (e = t(t = 0)), e), "ie");
    var Ot = /* @__PURE__ */ __name((t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports), "Ot");
    var rt = /* @__PURE__ */ __name((t, e) => {
      for (var r in e) St(t, r, { get: e[r], enumerable: true });
    }, "rt");
    var dn = /* @__PURE__ */ __name((t, e, r, n) => {
      if (e && typeof e == "object" || typeof e == "function") for (let i of Xo(e)) !es.call(t, i) && i !== r && St(t, i, { get: /* @__PURE__ */ __name(() => e[i], "get"), enumerable: !(n = Yo(e, i)) || n.enumerable });
      return t;
    }, "dn");
    var kt = /* @__PURE__ */ __name((t, e, r) => (r = t != null ? zo(Zo(t)) : {}, dn(e || !t || !t.__esModule ? St(r, "default", { value: t, enumerable: true }) : r, t)), "kt");
    var ts = /* @__PURE__ */ __name((t) => dn(St({}, "__esModule", { value: true }), t), "ts");
    function xr(t, e) {
      if (e = e.toLowerCase(), e === "utf8" || e === "utf-8") return new y(os.encode(t));
      if (e === "base64" || e === "base64url") return t = t.replace(/-/g, "+").replace(/_/g, "/"), t = t.replace(/[^A-Za-z0-9+/]/g, ""), new y([...atob(t)].map((r) => r.charCodeAt(0)));
      if (e === "binary" || e === "ascii" || e === "latin1" || e === "latin-1") return new y([...t].map((r) => r.charCodeAt(0)));
      if (e === "ucs2" || e === "ucs-2" || e === "utf16le" || e === "utf-16le") {
        let r = new y(t.length * 2), n = new DataView(r.buffer);
        for (let i = 0; i < t.length; i++) n.setUint16(i * 2, t.charCodeAt(i), true);
        return r;
      }
      if (e === "hex") {
        let r = new y(t.length / 2);
        for (let n = 0, i = 0; i < t.length; i += 2, n++) r[n] = parseInt(t.slice(i, i + 2), 16);
        return r;
      }
      gn(`encoding "${e}"`);
    }
    __name(xr, "xr");
    function rs(t) {
      let r = Object.getOwnPropertyNames(DataView.prototype).filter((a) => a.startsWith("get") || a.startsWith("set")), n = r.map((a) => a.replace("get", "read").replace("set", "write")), i = /* @__PURE__ */ __name((a, f2) => function(h = 0) {
        return V(h, "offset"), X(h, "offset"), $(h, "offset", this.length - 1), new DataView(this.buffer)[r[a]](h, f2);
      }, "i"), o = /* @__PURE__ */ __name((a, f2) => function(h, C = 0) {
        let A = r[a].match(/set(\w+\d+)/)[1].toLowerCase(), k2 = is[A];
        return V(C, "offset"), X(C, "offset"), $(C, "offset", this.length - 1), ns(h, "value", k2[0], k2[1]), new DataView(this.buffer)[r[a]](C, h, f2), C + parseInt(r[a].match(/\d+/)[0]) / 8;
      }, "o"), s = /* @__PURE__ */ __name((a) => {
        a.forEach((f2) => {
          f2.includes("Uint") && (t[f2.replace("Uint", "UInt")] = t[f2]), f2.includes("Float64") && (t[f2.replace("Float64", "Double")] = t[f2]), f2.includes("Float32") && (t[f2.replace("Float32", "Float")] = t[f2]);
        });
      }, "s");
      n.forEach((a, f2) => {
        a.startsWith("read") && (t[a] = i(f2, false), t[a + "LE"] = i(f2, true), t[a + "BE"] = i(f2, false)), a.startsWith("write") && (t[a] = o(f2, false), t[a + "LE"] = o(f2, true), t[a + "BE"] = o(f2, false)), s([a, a + "LE", a + "BE"]);
      });
    }
    __name(rs, "rs");
    function gn(t) {
      throw new Error(`Buffer polyfill does not implement "${t}"`);
    }
    __name(gn, "gn");
    function Dt(t, e) {
      if (!(t instanceof Uint8Array)) throw new TypeError(`The "${e}" argument must be an instance of Buffer or Uint8Array`);
    }
    __name(Dt, "Dt");
    function $(t, e, r = ls + 1) {
      if (t < 0 || t > r) {
        let n = new RangeError(`The value of "${e}" is out of range. It must be >= 0 && <= ${r}. Received ${t}`);
        throw n.code = "ERR_OUT_OF_RANGE", n;
      }
    }
    __name($, "$");
    function V(t, e) {
      if (typeof t != "number") {
        let r = new TypeError(`The "${e}" argument must be of type number. Received type ${typeof t}.`);
        throw r.code = "ERR_INVALID_ARG_TYPE", r;
      }
    }
    __name(V, "V");
    function X(t, e) {
      if (!Number.isInteger(t) || Number.isNaN(t)) {
        let r = new RangeError(`The value of "${e}" is out of range. It must be an integer. Received ${t}`);
        throw r.code = "ERR_OUT_OF_RANGE", r;
      }
    }
    __name(X, "X");
    function ns(t, e, r, n) {
      if (t < r || t > n) {
        let i = new RangeError(`The value of "${e}" is out of range. It must be >= ${r} and <= ${n}. Received ${t}`);
        throw i.code = "ERR_OUT_OF_RANGE", i;
      }
    }
    __name(ns, "ns");
    function fn(t, e) {
      if (typeof t != "string") {
        let r = new TypeError(`The "${e}" argument must be of type string. Received type ${typeof t}`);
        throw r.code = "ERR_INVALID_ARG_TYPE", r;
      }
    }
    __name(fn, "fn");
    function us(t, e = "utf8") {
      return y.from(t, e);
    }
    __name(us, "us");
    var y;
    var is;
    var os;
    var ss;
    var as;
    var ls;
    var b2;
    var Er;
    var u = ie(() => {
      "use strict";
      y = class t extends Uint8Array {
        static {
          __name(this, "t");
        }
        _isBuffer = true;
        get offset() {
          return this.byteOffset;
        }
        static alloc(e, r = 0, n = "utf8") {
          return fn(n, "encoding"), t.allocUnsafe(e).fill(r, n);
        }
        static allocUnsafe(e) {
          return t.from(e);
        }
        static allocUnsafeSlow(e) {
          return t.from(e);
        }
        static isBuffer(e) {
          return e && !!e._isBuffer;
        }
        static byteLength(e, r = "utf8") {
          if (typeof e == "string") return xr(e, r).byteLength;
          if (e && e.byteLength) return e.byteLength;
          let n = new TypeError('The "string" argument must be of type string or an instance of Buffer or ArrayBuffer.');
          throw n.code = "ERR_INVALID_ARG_TYPE", n;
        }
        static isEncoding(e) {
          return as.includes(e);
        }
        static compare(e, r) {
          Dt(e, "buff1"), Dt(r, "buff2");
          for (let n = 0; n < e.length; n++) {
            if (e[n] < r[n]) return -1;
            if (e[n] > r[n]) return 1;
          }
          return e.length === r.length ? 0 : e.length > r.length ? 1 : -1;
        }
        static from(e, r = "utf8") {
          if (e && typeof e == "object" && e.type === "Buffer") return new t(e.data);
          if (typeof e == "number") return new t(new Uint8Array(e));
          if (typeof e == "string") return xr(e, r);
          if (ArrayBuffer.isView(e)) {
            let { byteOffset: n, byteLength: i, buffer: o } = e;
            return "map" in e && typeof e.map == "function" ? new t(e.map((s) => s % 256), n, i) : new t(o, n, i);
          }
          if (e && typeof e == "object" && ("length" in e || "byteLength" in e || "buffer" in e)) return new t(e);
          throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
        }
        static concat(e, r) {
          if (e.length === 0) return t.alloc(0);
          let n = [].concat(...e.map((o) => [...o])), i = t.alloc(r !== void 0 ? r : n.length);
          return i.set(r !== void 0 ? n.slice(0, r) : n), i;
        }
        slice(e = 0, r = this.length) {
          return this.subarray(e, r);
        }
        subarray(e = 0, r = this.length) {
          return Object.setPrototypeOf(super.subarray(e, r), t.prototype);
        }
        reverse() {
          return super.reverse(), this;
        }
        readIntBE(e, r) {
          V(e, "offset"), X(e, "offset"), $(e, "offset", this.length - 1), V(r, "byteLength"), X(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i = i * 256 + n.getUint8(o);
          return n.getUint8(0) & 128 && (i -= Math.pow(256, r)), i;
        }
        readIntLE(e, r) {
          V(e, "offset"), X(e, "offset"), $(e, "offset", this.length - 1), V(r, "byteLength"), X(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i += n.getUint8(o) * Math.pow(256, o);
          return n.getUint8(r - 1) & 128 && (i -= Math.pow(256, r)), i;
        }
        readUIntBE(e, r) {
          V(e, "offset"), X(e, "offset"), $(e, "offset", this.length - 1), V(r, "byteLength"), X(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i = i * 256 + n.getUint8(o);
          return i;
        }
        readUintBE(e, r) {
          return this.readUIntBE(e, r);
        }
        readUIntLE(e, r) {
          V(e, "offset"), X(e, "offset"), $(e, "offset", this.length - 1), V(r, "byteLength"), X(r, "byteLength");
          let n = new DataView(this.buffer, e, r), i = 0;
          for (let o = 0; o < r; o++) i += n.getUint8(o) * Math.pow(256, o);
          return i;
        }
        readUintLE(e, r) {
          return this.readUIntLE(e, r);
        }
        writeIntBE(e, r, n) {
          return e = e < 0 ? e + Math.pow(256, n) : e, this.writeUIntBE(e, r, n);
        }
        writeIntLE(e, r, n) {
          return e = e < 0 ? e + Math.pow(256, n) : e, this.writeUIntLE(e, r, n);
        }
        writeUIntBE(e, r, n) {
          V(r, "offset"), X(r, "offset"), $(r, "offset", this.length - 1), V(n, "byteLength"), X(n, "byteLength");
          let i = new DataView(this.buffer, r, n);
          for (let o = n - 1; o >= 0; o--) i.setUint8(o, e & 255), e = e / 256;
          return r + n;
        }
        writeUintBE(e, r, n) {
          return this.writeUIntBE(e, r, n);
        }
        writeUIntLE(e, r, n) {
          V(r, "offset"), X(r, "offset"), $(r, "offset", this.length - 1), V(n, "byteLength"), X(n, "byteLength");
          let i = new DataView(this.buffer, r, n);
          for (let o = 0; o < n; o++) i.setUint8(o, e & 255), e = e / 256;
          return r + n;
        }
        writeUintLE(e, r, n) {
          return this.writeUIntLE(e, r, n);
        }
        toJSON() {
          return { type: "Buffer", data: Array.from(this) };
        }
        swap16() {
          let e = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let r = 0; r < this.length; r += 2) e.setUint16(r, e.getUint16(r, true), false);
          return this;
        }
        swap32() {
          let e = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let r = 0; r < this.length; r += 4) e.setUint32(r, e.getUint32(r, true), false);
          return this;
        }
        swap64() {
          let e = new DataView(this.buffer, this.byteOffset, this.byteLength);
          for (let r = 0; r < this.length; r += 8) e.setBigUint64(r, e.getBigUint64(r, true), false);
          return this;
        }
        compare(e, r = 0, n = e.length, i = 0, o = this.length) {
          return Dt(e, "target"), V(r, "targetStart"), V(n, "targetEnd"), V(i, "sourceStart"), V(o, "sourceEnd"), $(r, "targetStart"), $(n, "targetEnd", e.length), $(i, "sourceStart"), $(o, "sourceEnd", this.length), t.compare(this.slice(i, o), e.slice(r, n));
        }
        equals(e) {
          return Dt(e, "otherBuffer"), this.length === e.length && this.every((r, n) => r === e[n]);
        }
        copy(e, r = 0, n = 0, i = this.length) {
          $(r, "targetStart"), $(n, "sourceStart", this.length), $(i, "sourceEnd"), r >>>= 0, n >>>= 0, i >>>= 0;
          let o = 0;
          for (; n < i && !(this[n] === void 0 || e[r] === void 0); ) e[r] = this[n], o++, n++, r++;
          return o;
        }
        write(e, r, n, i = "utf8") {
          let o = typeof r == "string" ? 0 : r ?? 0, s = typeof n == "string" ? this.length - o : n ?? this.length - o;
          return i = typeof r == "string" ? r : typeof n == "string" ? n : i, V(o, "offset"), V(s, "length"), $(o, "offset", this.length), $(s, "length", this.length), (i === "ucs2" || i === "ucs-2" || i === "utf16le" || i === "utf-16le") && (s = s - s % 2), xr(e, i).copy(this, o, 0, s);
        }
        fill(e = 0, r = 0, n = this.length, i = "utf-8") {
          let o = typeof r == "string" ? 0 : r, s = typeof n == "string" ? this.length : n;
          if (i = typeof r == "string" ? r : typeof n == "string" ? n : i, e = t.from(typeof e == "number" ? [e] : e ?? [], i), fn(i, "encoding"), $(o, "offset", this.length), $(s, "end", this.length), e.length !== 0) for (let a = o; a < s; a += e.length) super.set(e.slice(0, e.length + a >= this.length ? this.length - a : e.length), a);
          return this;
        }
        includes(e, r = null, n = "utf-8") {
          return this.indexOf(e, r, n) !== -1;
        }
        lastIndexOf(e, r = null, n = "utf-8") {
          return this.indexOf(e, r, n, true);
        }
        indexOf(e, r = null, n = "utf-8", i = false) {
          let o = i ? this.findLastIndex.bind(this) : this.findIndex.bind(this);
          n = typeof r == "string" ? r : n;
          let s = t.from(typeof e == "number" ? [e] : e, n), a = typeof r == "string" ? 0 : r;
          return a = typeof r == "number" ? a : null, a = Number.isNaN(a) ? null : a, a ??= i ? this.length : 0, a = a < 0 ? this.length + a : a, s.length === 0 && i === false ? a >= this.length ? this.length : a : s.length === 0 && i === true ? (a >= this.length ? this.length : a) || this.length : o((f2, h) => (i ? h <= a : h >= a) && this[h] === s[0] && s.every((A, k2) => this[h + k2] === A));
        }
        toString(e = "utf8", r = 0, n = this.length) {
          if (r = r < 0 ? 0 : r, e = e.toString().toLowerCase(), n <= 0) return "";
          if (e === "utf8" || e === "utf-8") return ss.decode(this.slice(r, n));
          if (e === "base64" || e === "base64url") {
            let i = btoa(this.reduce((o, s) => o + Er(s), ""));
            return e === "base64url" ? i.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : i;
          }
          if (e === "binary" || e === "ascii" || e === "latin1" || e === "latin-1") return this.slice(r, n).reduce((i, o) => i + Er(o & (e === "ascii" ? 127 : 255)), "");
          if (e === "ucs2" || e === "ucs-2" || e === "utf16le" || e === "utf-16le") {
            let i = new DataView(this.buffer.slice(r, n));
            return Array.from({ length: i.byteLength / 2 }, (o, s) => s * 2 + 1 < i.byteLength ? Er(i.getUint16(s * 2, true)) : "").join("");
          }
          if (e === "hex") return this.slice(r, n).reduce((i, o) => i + o.toString(16).padStart(2, "0"), "");
          gn(`encoding "${e}"`);
        }
        toLocaleString() {
          return this.toString();
        }
        inspect() {
          return `<Buffer ${this.toString("hex").match(/.{1,2}/g).join(" ")}>`;
        }
      };
      is = { int8: [-128, 127], int16: [-32768, 32767], int32: [-2147483648, 2147483647], uint8: [0, 255], uint16: [0, 65535], uint32: [0, 4294967295], float32: [-1 / 0, 1 / 0], float64: [-1 / 0, 1 / 0], bigint64: [-0x8000000000000000n, 0x7fffffffffffffffn], biguint64: [0n, 0xffffffffffffffffn] }, os = new TextEncoder(), ss = new TextDecoder(), as = ["utf8", "utf-8", "hex", "base64", "ascii", "binary", "base64url", "ucs2", "ucs-2", "utf16le", "utf-16le", "latin1", "latin-1"], ls = 4294967295;
      rs(y.prototype);
      b2 = new Proxy(us, { construct(t, [e, r]) {
        return y.from(e, r);
      }, get(t, e) {
        return y[e];
      } }), Er = String.fromCodePoint;
    });
    var g;
    var E;
    var c = ie(() => {
      "use strict";
      g = { nextTick: /* @__PURE__ */ __name((t, ...e) => {
        setTimeout(() => {
          t(...e);
        }, 0);
      }, "nextTick"), env: {}, version: "", cwd: /* @__PURE__ */ __name(() => "/", "cwd"), stderr: {}, argv: ["/bin/node"], pid: 1e4 }, { cwd: E } = g;
    });
    var P2;
    var m = ie(() => {
      "use strict";
      P2 = globalThis.performance ?? (() => {
        let t = Date.now();
        return { now: /* @__PURE__ */ __name(() => Date.now() - t, "now") };
      })();
    });
    var x2;
    var p2 = ie(() => {
      "use strict";
      x2 = /* @__PURE__ */ __name(() => {
      }, "x");
      x2.prototype = x2;
    });
    var w2;
    var d = ie(() => {
      "use strict";
      w2 = class {
        static {
          __name(this, "w");
        }
        value;
        constructor(e) {
          this.value = e;
        }
        deref() {
          return this.value;
        }
      };
    });
    function wn(t, e) {
      var r, n, i, o, s, a, f2, h, C = t.constructor, A = C.precision;
      if (!t.s || !e.s) return e.s || (e = new C(t)), q ? L(e, A) : e;
      if (f2 = t.d, h = e.d, s = t.e, i = e.e, f2 = f2.slice(), o = s - i, o) {
        for (o < 0 ? (n = f2, o = -o, a = h.length) : (n = h, i = s, a = f2.length), s = Math.ceil(A / N), a = s > a ? s + 1 : a + 1, o > a && (o = a, n.length = 1), n.reverse(); o--; ) n.push(0);
        n.reverse();
      }
      for (a = f2.length, o = h.length, a - o < 0 && (o = a, n = h, h = f2, f2 = n), r = 0; o; ) r = (f2[--o] = f2[o] + h[o] + r) / J | 0, f2[o] %= J;
      for (r && (f2.unshift(r), ++i), a = f2.length; f2[--a] == 0; ) f2.pop();
      return e.d = f2, e.e = i, q ? L(e, A) : e;
    }
    __name(wn, "wn");
    function ce(t, e, r) {
      if (t !== ~~t || t < e || t > r) throw Error(Oe + t);
    }
    __name(ce, "ce");
    function ue(t) {
      var e, r, n, i = t.length - 1, o = "", s = t[0];
      if (i > 0) {
        for (o += s, e = 1; e < i; e++) n = t[e] + "", r = N - n.length, r && (o += Pe(r)), o += n;
        s = t[e], n = s + "", r = N - n.length, r && (o += Pe(r));
      } else if (s === 0) return "0";
      for (; s % 10 === 0; ) s /= 10;
      return o + s;
    }
    __name(ue, "ue");
    function xn(t, e) {
      var r, n, i, o, s, a, f2 = 0, h = 0, C = t.constructor, A = C.precision;
      if (j(t) > 16) throw Error(vr + j(t));
      if (!t.s) return new C(te);
      for (e == null ? (q = false, a = A) : a = e, s = new C(0.03125); t.abs().gte(0.1); ) t = t.times(s), h += 5;
      for (n = Math.log(Se(2, h)) / Math.LN10 * 2 + 5 | 0, a += n, r = i = o = new C(te), C.precision = a; ; ) {
        if (i = L(i.times(t), a), r = r.times(++f2), s = o.plus(he(i, r, a)), ue(s.d).slice(0, a) === ue(o.d).slice(0, a)) {
          for (; h--; ) o = L(o.times(o), a);
          return C.precision = A, e == null ? (q = true, L(o, A)) : o;
        }
        o = s;
      }
    }
    __name(xn, "xn");
    function j(t) {
      for (var e = t.e * N, r = t.d[0]; r >= 10; r /= 10) e++;
      return e;
    }
    __name(j, "j");
    function Pr(t, e, r) {
      if (e > t.LN10.sd()) throw q = true, r && (t.precision = r), Error(oe + "LN10 precision limit exceeded");
      return L(new t(t.LN10), e);
    }
    __name(Pr, "Pr");
    function Pe(t) {
      for (var e = ""; t--; ) e += "0";
      return e;
    }
    __name(Pe, "Pe");
    function nt(t, e) {
      var r, n, i, o, s, a, f2, h, C, A = 1, k2 = 10, R = t, _ = R.d, O = R.constructor, D = O.precision;
      if (R.s < 1) throw Error(oe + (R.s ? "NaN" : "-Infinity"));
      if (R.eq(te)) return new O(0);
      if (e == null ? (q = false, h = D) : h = e, R.eq(10)) return e == null && (q = true), Pr(O, h);
      if (h += k2, O.precision = h, r = ue(_), n = r.charAt(0), o = j(R), Math.abs(o) < 15e14) {
        for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; ) R = R.times(t), r = ue(R.d), n = r.charAt(0), A++;
        o = j(R), n > 1 ? (R = new O("0." + r), o++) : R = new O(n + "." + r.slice(1));
      } else return f2 = Pr(O, h + 2, D).times(o + ""), R = nt(new O(n + "." + r.slice(1)), h - k2).plus(f2), O.precision = D, e == null ? (q = true, L(R, D)) : R;
      for (a = s = R = he(R.minus(te), R.plus(te), h), C = L(R.times(R), h), i = 3; ; ) {
        if (s = L(s.times(C), h), f2 = a.plus(he(s, new O(i), h)), ue(f2.d).slice(0, h) === ue(a.d).slice(0, h)) return a = a.times(2), o !== 0 && (a = a.plus(Pr(O, h + 2, D).times(o + ""))), a = he(a, new O(A), h), O.precision = D, e == null ? (q = true, L(a, D)) : a;
        a = f2, i += 2;
      }
    }
    __name(nt, "nt");
    function yn(t, e) {
      var r, n, i;
      for ((r = e.indexOf(".")) > -1 && (e = e.replace(".", "")), (n = e.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +e.slice(n + 1), e = e.substring(0, n)) : r < 0 && (r = e.length), n = 0; e.charCodeAt(n) === 48; ) ++n;
      for (i = e.length; e.charCodeAt(i - 1) === 48; ) --i;
      if (e = e.slice(n, i), e) {
        if (i -= n, r = r - n - 1, t.e = Fe(r / N), t.d = [], n = (r + 1) % N, r < 0 && (n += N), n < i) {
          for (n && t.d.push(+e.slice(0, n)), i -= N; n < i; ) t.d.push(+e.slice(n, n += N));
          e = e.slice(n), n = N - e.length;
        } else n -= i;
        for (; n--; ) e += "0";
        if (t.d.push(+e), q && (t.e > It || t.e < -It)) throw Error(vr + r);
      } else t.s = 0, t.e = 0, t.d = [0];
      return t;
    }
    __name(yn, "yn");
    function L(t, e, r) {
      var n, i, o, s, a, f2, h, C, A = t.d;
      for (s = 1, o = A[0]; o >= 10; o /= 10) s++;
      if (n = e - s, n < 0) n += N, i = e, h = A[C = 0];
      else {
        if (C = Math.ceil((n + 1) / N), o = A.length, C >= o) return t;
        for (h = o = A[C], s = 1; o >= 10; o /= 10) s++;
        n %= N, i = n - N + s;
      }
      if (r !== void 0 && (o = Se(10, s - i - 1), a = h / o % 10 | 0, f2 = e < 0 || A[C + 1] !== void 0 || h % o, f2 = r < 4 ? (a || f2) && (r == 0 || r == (t.s < 0 ? 3 : 2)) : a > 5 || a == 5 && (r == 4 || f2 || r == 6 && (n > 0 ? i > 0 ? h / Se(10, s - i) : 0 : A[C - 1]) % 10 & 1 || r == (t.s < 0 ? 8 : 7))), e < 1 || !A[0]) return f2 ? (o = j(t), A.length = 1, e = e - o - 1, A[0] = Se(10, (N - e % N) % N), t.e = Fe(-e / N) || 0) : (A.length = 1, A[0] = t.e = t.s = 0), t;
      if (n == 0 ? (A.length = C, o = 1, C--) : (A.length = C + 1, o = Se(10, N - n), A[C] = i > 0 ? (h / Se(10, s - i) % Se(10, i) | 0) * o : 0), f2) for (; ; ) if (C == 0) {
        (A[0] += o) == J && (A[0] = 1, ++t.e);
        break;
      } else {
        if (A[C] += o, A[C] != J) break;
        A[C--] = 0, o = 1;
      }
      for (n = A.length; A[--n] === 0; ) A.pop();
      if (q && (t.e > It || t.e < -It)) throw Error(vr + j(t));
      return t;
    }
    __name(L, "L");
    function En(t, e) {
      var r, n, i, o, s, a, f2, h, C, A, k2 = t.constructor, R = k2.precision;
      if (!t.s || !e.s) return e.s ? e.s = -e.s : e = new k2(t), q ? L(e, R) : e;
      if (f2 = t.d, A = e.d, n = e.e, h = t.e, f2 = f2.slice(), s = h - n, s) {
        for (C = s < 0, C ? (r = f2, s = -s, a = A.length) : (r = A, n = h, a = f2.length), i = Math.max(Math.ceil(R / N), a) + 2, s > i && (s = i, r.length = 1), r.reverse(), i = s; i--; ) r.push(0);
        r.reverse();
      } else {
        for (i = f2.length, a = A.length, C = i < a, C && (a = i), i = 0; i < a; i++) if (f2[i] != A[i]) {
          C = f2[i] < A[i];
          break;
        }
        s = 0;
      }
      for (C && (r = f2, f2 = A, A = r, e.s = -e.s), a = f2.length, i = A.length - a; i > 0; --i) f2[a++] = 0;
      for (i = A.length; i > s; ) {
        if (f2[--i] < A[i]) {
          for (o = i; o && f2[--o] === 0; ) f2[o] = J - 1;
          --f2[o], f2[i] += J;
        }
        f2[i] -= A[i];
      }
      for (; f2[--a] === 0; ) f2.pop();
      for (; f2[0] === 0; f2.shift()) --n;
      return f2[0] ? (e.d = f2, e.e = n, q ? L(e, R) : e) : new k2(0);
    }
    __name(En, "En");
    function ke(t, e, r) {
      var n, i = j(t), o = ue(t.d), s = o.length;
      return e ? (r && (n = r - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + Pe(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (i < 0 ? "e" : "e+") + i) : i < 0 ? (o = "0." + Pe(-i - 1) + o, r && (n = r - s) > 0 && (o += Pe(n))) : i >= s ? (o += Pe(i + 1 - s), r && (n = r - i - 1) > 0 && (o = o + "." + Pe(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), r && (n = r - s) > 0 && (i + 1 === s && (o += "."), o += Pe(n))), t.s < 0 ? "-" + o : o;
    }
    __name(ke, "ke");
    function hn(t, e) {
      if (t.length > e) return t.length = e, true;
    }
    __name(hn, "hn");
    function Pn(t) {
      var e, r, n;
      function i(o) {
        var s = this;
        if (!(s instanceof i)) return new i(o);
        if (s.constructor = i, o instanceof i) {
          s.s = o.s, s.e = o.e, s.d = (o = o.d) ? o.slice() : o;
          return;
        }
        if (typeof o == "number") {
          if (o * 0 !== 0) throw Error(Oe + o);
          if (o > 0) s.s = 1;
          else if (o < 0) o = -o, s.s = -1;
          else {
            s.s = 0, s.e = 0, s.d = [0];
            return;
          }
          if (o === ~~o && o < 1e7) {
            s.e = 0, s.d = [o];
            return;
          }
          return yn(s, o.toString());
        } else if (typeof o != "string") throw Error(Oe + o);
        if (o.charCodeAt(0) === 45 ? (o = o.slice(1), s.s = -1) : s.s = 1, ms.test(o)) yn(s, o);
        else throw Error(Oe + o);
      }
      __name(i, "i");
      if (i.prototype = S2, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.clone = Pn, i.config = i.set = ps, t === void 0 && (t = {}), t) for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], e = 0; e < n.length; ) t.hasOwnProperty(r = n[e++]) || (t[r] = this[r]);
      return i.config(t), i;
    }
    __name(Pn, "Pn");
    function ps(t) {
      if (!t || typeof t != "object") throw Error(oe + "Object expected");
      var e, r, n, i = ["precision", 1, Le, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
      for (e = 0; e < i.length; e += 3) if ((n = t[r = i[e]]) !== void 0) if (Fe(n) === n && n >= i[e + 1] && n <= i[e + 2]) this[r] = n;
      else throw Error(Oe + r + ": " + n);
      if ((n = t[r = "LN10"]) !== void 0) if (n == Math.LN10) this[r] = new this(n);
      else throw Error(Oe + r + ": " + n);
      return this;
    }
    __name(ps, "ps");
    var Le;
    var cs;
    var Tr;
    var q;
    var oe;
    var Oe;
    var vr;
    var Fe;
    var Se;
    var ms;
    var te;
    var J;
    var N;
    var bn;
    var It;
    var S2;
    var he;
    var Tr;
    var Mt;
    var vn = ie(() => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
      Le = 1e9, cs = { precision: 20, rounding: 4, toExpNeg: -7, toExpPos: 21, LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286" }, q = true, oe = "[DecimalError] ", Oe = oe + "Invalid argument: ", vr = oe + "Exponent out of range: ", Fe = Math.floor, Se = Math.pow, ms = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, J = 1e7, N = 7, bn = 9007199254740991, It = Fe(bn / N), S2 = {};
      S2.absoluteValue = S2.abs = function() {
        var t = new this.constructor(this);
        return t.s && (t.s = 1), t;
      };
      S2.comparedTo = S2.cmp = function(t) {
        var e, r, n, i, o = this;
        if (t = new o.constructor(t), o.s !== t.s) return o.s || -t.s;
        if (o.e !== t.e) return o.e > t.e ^ o.s < 0 ? 1 : -1;
        for (n = o.d.length, i = t.d.length, e = 0, r = n < i ? n : i; e < r; ++e) if (o.d[e] !== t.d[e]) return o.d[e] > t.d[e] ^ o.s < 0 ? 1 : -1;
        return n === i ? 0 : n > i ^ o.s < 0 ? 1 : -1;
      };
      S2.decimalPlaces = S2.dp = function() {
        var t = this, e = t.d.length - 1, r = (e - t.e) * N;
        if (e = t.d[e], e) for (; e % 10 == 0; e /= 10) r--;
        return r < 0 ? 0 : r;
      };
      S2.dividedBy = S2.div = function(t) {
        return he(this, new this.constructor(t));
      };
      S2.dividedToIntegerBy = S2.idiv = function(t) {
        var e = this, r = e.constructor;
        return L(he(e, new r(t), 0, 1), r.precision);
      };
      S2.equals = S2.eq = function(t) {
        return !this.cmp(t);
      };
      S2.exponent = function() {
        return j(this);
      };
      S2.greaterThan = S2.gt = function(t) {
        return this.cmp(t) > 0;
      };
      S2.greaterThanOrEqualTo = S2.gte = function(t) {
        return this.cmp(t) >= 0;
      };
      S2.isInteger = S2.isint = function() {
        return this.e > this.d.length - 2;
      };
      S2.isNegative = S2.isneg = function() {
        return this.s < 0;
      };
      S2.isPositive = S2.ispos = function() {
        return this.s > 0;
      };
      S2.isZero = function() {
        return this.s === 0;
      };
      S2.lessThan = S2.lt = function(t) {
        return this.cmp(t) < 0;
      };
      S2.lessThanOrEqualTo = S2.lte = function(t) {
        return this.cmp(t) < 1;
      };
      S2.logarithm = S2.log = function(t) {
        var e, r = this, n = r.constructor, i = n.precision, o = i + 5;
        if (t === void 0) t = new n(10);
        else if (t = new n(t), t.s < 1 || t.eq(te)) throw Error(oe + "NaN");
        if (r.s < 1) throw Error(oe + (r.s ? "NaN" : "-Infinity"));
        return r.eq(te) ? new n(0) : (q = false, e = he(nt(r, o), nt(t, o), o), q = true, L(e, i));
      };
      S2.minus = S2.sub = function(t) {
        var e = this;
        return t = new e.constructor(t), e.s == t.s ? En(e, t) : wn(e, (t.s = -t.s, t));
      };
      S2.modulo = S2.mod = function(t) {
        var e, r = this, n = r.constructor, i = n.precision;
        if (t = new n(t), !t.s) throw Error(oe + "NaN");
        return r.s ? (q = false, e = he(r, t, 0, 1).times(t), q = true, r.minus(e)) : L(new n(r), i);
      };
      S2.naturalExponential = S2.exp = function() {
        return xn(this);
      };
      S2.naturalLogarithm = S2.ln = function() {
        return nt(this);
      };
      S2.negated = S2.neg = function() {
        var t = new this.constructor(this);
        return t.s = -t.s || 0, t;
      };
      S2.plus = S2.add = function(t) {
        var e = this;
        return t = new e.constructor(t), e.s == t.s ? wn(e, t) : En(e, (t.s = -t.s, t));
      };
      S2.precision = S2.sd = function(t) {
        var e, r, n, i = this;
        if (t !== void 0 && t !== !!t && t !== 1 && t !== 0) throw Error(Oe + t);
        if (e = j(i) + 1, n = i.d.length - 1, r = n * N + 1, n = i.d[n], n) {
          for (; n % 10 == 0; n /= 10) r--;
          for (n = i.d[0]; n >= 10; n /= 10) r++;
        }
        return t && e > r ? e : r;
      };
      S2.squareRoot = S2.sqrt = function() {
        var t, e, r, n, i, o, s, a = this, f2 = a.constructor;
        if (a.s < 1) {
          if (!a.s) return new f2(0);
          throw Error(oe + "NaN");
        }
        for (t = j(a), q = false, i = Math.sqrt(+a), i == 0 || i == 1 / 0 ? (e = ue(a.d), (e.length + t) % 2 == 0 && (e += "0"), i = Math.sqrt(e), t = Fe((t + 1) / 2) - (t < 0 || t % 2), i == 1 / 0 ? e = "5e" + t : (e = i.toExponential(), e = e.slice(0, e.indexOf("e") + 1) + t), n = new f2(e)) : n = new f2(i.toString()), r = f2.precision, i = s = r + 3; ; ) if (o = n, n = o.plus(he(a, o, s + 2)).times(0.5), ue(o.d).slice(0, s) === (e = ue(n.d)).slice(0, s)) {
          if (e = e.slice(s - 3, s + 1), i == s && e == "4999") {
            if (L(o, r + 1, 0), o.times(o).eq(a)) {
              n = o;
              break;
            }
          } else if (e != "9999") break;
          s += 4;
        }
        return q = true, L(n, r);
      };
      S2.times = S2.mul = function(t) {
        var e, r, n, i, o, s, a, f2, h, C = this, A = C.constructor, k2 = C.d, R = (t = new A(t)).d;
        if (!C.s || !t.s) return new A(0);
        for (t.s *= C.s, r = C.e + t.e, f2 = k2.length, h = R.length, f2 < h && (o = k2, k2 = R, R = o, s = f2, f2 = h, h = s), o = [], s = f2 + h, n = s; n--; ) o.push(0);
        for (n = h; --n >= 0; ) {
          for (e = 0, i = f2 + n; i > n; ) a = o[i] + R[n] * k2[i - n - 1] + e, o[i--] = a % J | 0, e = a / J | 0;
          o[i] = (o[i] + e) % J | 0;
        }
        for (; !o[--s]; ) o.pop();
        return e ? ++r : o.shift(), t.d = o, t.e = r, q ? L(t, A.precision) : t;
      };
      S2.toDecimalPlaces = S2.todp = function(t, e) {
        var r = this, n = r.constructor;
        return r = new n(r), t === void 0 ? r : (ce(t, 0, Le), e === void 0 ? e = n.rounding : ce(e, 0, 8), L(r, t + j(r) + 1, e));
      };
      S2.toExponential = function(t, e) {
        var r, n = this, i = n.constructor;
        return t === void 0 ? r = ke(n, true) : (ce(t, 0, Le), e === void 0 ? e = i.rounding : ce(e, 0, 8), n = L(new i(n), t + 1, e), r = ke(n, true, t + 1)), r;
      };
      S2.toFixed = function(t, e) {
        var r, n, i = this, o = i.constructor;
        return t === void 0 ? ke(i) : (ce(t, 0, Le), e === void 0 ? e = o.rounding : ce(e, 0, 8), n = L(new o(i), t + j(i) + 1, e), r = ke(n.abs(), false, t + j(n) + 1), i.isneg() && !i.isZero() ? "-" + r : r);
      };
      S2.toInteger = S2.toint = function() {
        var t = this, e = t.constructor;
        return L(new e(t), j(t) + 1, e.rounding);
      };
      S2.toNumber = function() {
        return +this;
      };
      S2.toPower = S2.pow = function(t) {
        var e, r, n, i, o, s, a = this, f2 = a.constructor, h = 12, C = +(t = new f2(t));
        if (!t.s) return new f2(te);
        if (a = new f2(a), !a.s) {
          if (t.s < 1) throw Error(oe + "Infinity");
          return a;
        }
        if (a.eq(te)) return a;
        if (n = f2.precision, t.eq(te)) return L(a, n);
        if (e = t.e, r = t.d.length - 1, s = e >= r, o = a.s, s) {
          if ((r = C < 0 ? -C : C) <= bn) {
            for (i = new f2(te), e = Math.ceil(n / N + 4), q = false; r % 2 && (i = i.times(a), hn(i.d, e)), r = Fe(r / 2), r !== 0; ) a = a.times(a), hn(a.d, e);
            return q = true, t.s < 0 ? new f2(te).div(i) : L(i, n);
          }
        } else if (o < 0) throw Error(oe + "NaN");
        return o = o < 0 && t.d[Math.max(e, r)] & 1 ? -1 : 1, a.s = 1, q = false, i = t.times(nt(a, n + h)), q = true, i = xn(i), i.s = o, i;
      };
      S2.toPrecision = function(t, e) {
        var r, n, i = this, o = i.constructor;
        return t === void 0 ? (r = j(i), n = ke(i, r <= o.toExpNeg || r >= o.toExpPos)) : (ce(t, 1, Le), e === void 0 ? e = o.rounding : ce(e, 0, 8), i = L(new o(i), t, e), r = j(i), n = ke(i, t <= r || r <= o.toExpNeg, t)), n;
      };
      S2.toSignificantDigits = S2.tosd = function(t, e) {
        var r = this, n = r.constructor;
        return t === void 0 ? (t = n.precision, e = n.rounding) : (ce(t, 1, Le), e === void 0 ? e = n.rounding : ce(e, 0, 8)), L(new n(r), t, e);
      };
      S2.toString = S2.valueOf = S2.val = S2.toJSON = S2[Symbol.for("nodejs.util.inspect.custom")] = function() {
        var t = this, e = j(t), r = t.constructor;
        return ke(t, e <= r.toExpNeg || e >= r.toExpPos);
      };
      he = /* @__PURE__ */ function() {
        function t(n, i) {
          var o, s = 0, a = n.length;
          for (n = n.slice(); a--; ) o = n[a] * i + s, n[a] = o % J | 0, s = o / J | 0;
          return s && n.unshift(s), n;
        }
        __name(t, "t");
        function e(n, i, o, s) {
          var a, f2;
          if (o != s) f2 = o > s ? 1 : -1;
          else for (a = f2 = 0; a < o; a++) if (n[a] != i[a]) {
            f2 = n[a] > i[a] ? 1 : -1;
            break;
          }
          return f2;
        }
        __name(e, "e");
        function r(n, i, o) {
          for (var s = 0; o--; ) n[o] -= s, s = n[o] < i[o] ? 1 : 0, n[o] = s * J + n[o] - i[o];
          for (; !n[0] && n.length > 1; ) n.shift();
        }
        __name(r, "r");
        return function(n, i, o, s) {
          var a, f2, h, C, A, k2, R, _, O, D, ye, z, F2, Y, Re, wr, se, At, Rt = n.constructor, Ho = n.s == i.s ? 1 : -1, le = n.d, B = i.d;
          if (!n.s) return new Rt(n);
          if (!i.s) throw Error(oe + "Division by zero");
          for (f2 = n.e - i.e, se = B.length, Re = le.length, R = new Rt(Ho), _ = R.d = [], h = 0; B[h] == (le[h] || 0); ) ++h;
          if (B[h] > (le[h] || 0) && --f2, o == null ? z = o = Rt.precision : s ? z = o + (j(n) - j(i)) + 1 : z = o, z < 0) return new Rt(0);
          if (z = z / N + 2 | 0, h = 0, se == 1) for (C = 0, B = B[0], z++; (h < Re || C) && z--; h++) F2 = C * J + (le[h] || 0), _[h] = F2 / B | 0, C = F2 % B | 0;
          else {
            for (C = J / (B[0] + 1) | 0, C > 1 && (B = t(B, C), le = t(le, C), se = B.length, Re = le.length), Y = se, O = le.slice(0, se), D = O.length; D < se; ) O[D++] = 0;
            At = B.slice(), At.unshift(0), wr = B[0], B[1] >= J / 2 && ++wr;
            do
              C = 0, a = e(B, O, se, D), a < 0 ? (ye = O[0], se != D && (ye = ye * J + (O[1] || 0)), C = ye / wr | 0, C > 1 ? (C >= J && (C = J - 1), A = t(B, C), k2 = A.length, D = O.length, a = e(A, O, k2, D), a == 1 && (C--, r(A, se < k2 ? At : B, k2))) : (C == 0 && (a = C = 1), A = B.slice()), k2 = A.length, k2 < D && A.unshift(0), r(O, A, D), a == -1 && (D = O.length, a = e(B, O, se, D), a < 1 && (C++, r(O, se < D ? At : B, D))), D = O.length) : a === 0 && (C++, O = [0]), _[h++] = C, a && O[0] ? O[D++] = le[Y] || 0 : (O = [le[Y]], D = 1);
            while ((Y++ < Re || O[0] !== void 0) && z--);
          }
          return _[0] || _.shift(), R.e = f2, L(R, s ? o + j(R) + 1 : o);
        };
      }();
      Tr = Pn(cs);
      te = new Tr(1);
      Mt = Tr;
    });
    var v;
    var be;
    var l2 = ie(() => {
      "use strict";
      vn();
      v = class extends Mt {
        static {
          __name(this, "v");
        }
        static isDecimal(e) {
          return e instanceof Mt;
        }
        static random(e = 20) {
          {
            let n = globalThis.crypto.getRandomValues(new Uint8Array(e)).reduce((i, o) => i + o, "");
            return new Mt(`0.${n.slice(0, e)}`);
          }
        }
      }, be = v;
    });
    function bs() {
      return false;
    }
    __name(bs, "bs");
    function Or() {
      return { dev: 0, ino: 0, mode: 0, nlink: 0, uid: 0, gid: 0, rdev: 0, size: 0, blksize: 0, blocks: 0, atimeMs: 0, mtimeMs: 0, ctimeMs: 0, birthtimeMs: 0, atime: /* @__PURE__ */ new Date(), mtime: /* @__PURE__ */ new Date(), ctime: /* @__PURE__ */ new Date(), birthtime: /* @__PURE__ */ new Date() };
    }
    __name(Or, "Or");
    function ws() {
      return Or();
    }
    __name(ws, "ws");
    function xs() {
      return [];
    }
    __name(xs, "xs");
    function Es(t) {
      t(null, []);
    }
    __name(Es, "Es");
    function Ps() {
      return "";
    }
    __name(Ps, "Ps");
    function vs() {
      return "";
    }
    __name(vs, "vs");
    function Ts() {
    }
    __name(Ts, "Ts");
    function Cs() {
    }
    __name(Cs, "Cs");
    function As() {
    }
    __name(As, "As");
    function Rs() {
    }
    __name(Rs, "Rs");
    function Ss() {
    }
    __name(Ss, "Ss");
    function Os() {
    }
    __name(Os, "Os");
    function ks() {
    }
    __name(ks, "ks");
    function Ds() {
    }
    __name(Ds, "Ds");
    function Is() {
      return { close: /* @__PURE__ */ __name(() => {
      }, "close"), on: /* @__PURE__ */ __name(() => {
      }, "on"), removeAllListeners: /* @__PURE__ */ __name(() => {
      }, "removeAllListeners") };
    }
    __name(Is, "Is");
    function Ms(t, e) {
      e(null, Or());
    }
    __name(Ms, "Ms");
    var _s;
    var Ls;
    var Bn;
    var Vn = ie(() => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
      _s = {}, Ls = { existsSync: bs, lstatSync: Or, stat: Ms, statSync: ws, readdirSync: xs, readdir: Es, readlinkSync: Ps, realpathSync: vs, chmodSync: Ts, renameSync: Cs, mkdirSync: As, rmdirSync: Rs, rmSync: Ss, unlinkSync: Os, watchFile: ks, unwatchFile: Ds, watch: Is, promises: _s }, Bn = Ls;
    });
    var jn = Ot((Zc, Fs) => {
      Fs.exports = { name: "@prisma/internals", version: "6.18.0", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.5.0", empathic: "2.0.0", "escape-string-regexp": "5.0.0", execa: "8.0.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "global-directory": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", "@prisma/schema-engine-wasm": "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
    });
    function Ns(...t) {
      return t.join("/");
    }
    __name(Ns, "Ns");
    function qs(...t) {
      return t.join("/");
    }
    __name(qs, "qs");
    function Bs(t) {
      let e = $n(t), r = Qn(t), [n, i] = e.split(".");
      return { root: "/", dir: r, base: e, ext: i, name: n };
    }
    __name(Bs, "Bs");
    function $n(t) {
      let e = t.split("/");
      return e[e.length - 1];
    }
    __name($n, "$n");
    function Qn(t) {
      return t.split("/").slice(0, -1).join("/");
    }
    __name(Qn, "Qn");
    function js(t) {
      let e = t.split("/").filter((i) => i !== "" && i !== "."), r = [];
      for (let i of e) i === ".." ? r.pop() : r.push(i);
      let n = r.join("/");
      return t.startsWith("/") ? "/" + n : n;
    }
    __name(js, "js");
    var Jn;
    var Vs;
    var $s;
    var Qs;
    var Ut;
    var Gn = ie(() => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
      Jn = "/", Vs = ":";
      $s = { sep: Jn }, Qs = { basename: $n, delimiter: Vs, dirname: Qn, join: qs, normalize: js, parse: Bs, posix: $s, resolve: Ns, sep: Jn }, Ut = Qs;
    });
    var Yn = Ot((bp, zn) => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
      zn.exports = (t, e = 1, r) => {
        if (r = { indent: " ", includeEmptyLines: false, ...r }, typeof t != "string") throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof t}\``);
        if (typeof e != "number") throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof e}\``);
        if (typeof r.indent != "string") throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
        if (e === 0) return t;
        let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
        return t.replace(n, r.indent.repeat(e));
      };
    });
    var Vr = Ot((Hy, ni) => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
      ni.exports = /* @__PURE__ */ function() {
        function t(e, r, n, i, o) {
          return e < r || n < r ? e > n ? n + 1 : e + 1 : i === o ? r : r + 1;
        }
        __name(t, "t");
        return function(e, r) {
          if (e === r) return 0;
          if (e.length > r.length) {
            var n = e;
            e = r, r = n;
          }
          for (var i = e.length, o = r.length; i > 0 && e.charCodeAt(i - 1) === r.charCodeAt(o - 1); ) i--, o--;
          for (var s = 0; s < i && e.charCodeAt(s) === r.charCodeAt(s); ) s++;
          if (i -= s, o -= s, i === 0 || o < 3) return o;
          var a = 0, f2, h, C, A, k2, R, _, O, D, ye, z, F2, Y = [];
          for (f2 = 0; f2 < i; f2++) Y.push(f2 + 1), Y.push(e.charCodeAt(s + f2));
          for (var Re = Y.length - 1; a < o - 3; ) for (D = r.charCodeAt(s + (h = a)), ye = r.charCodeAt(s + (C = a + 1)), z = r.charCodeAt(s + (A = a + 2)), F2 = r.charCodeAt(s + (k2 = a + 3)), R = a += 4, f2 = 0; f2 < Re; f2 += 2) _ = Y[f2], O = Y[f2 + 1], h = t(_, h, C, D, O), C = t(h, C, A, ye, O), A = t(C, A, k2, z, O), R = t(A, k2, R, F2, O), Y[f2] = R, k2 = A, A = C, C = h, h = _;
          for (; a < o; ) for (D = r.charCodeAt(s + (h = a)), R = ++a, f2 = 0; f2 < Re; f2 += 2) _ = Y[f2], Y[f2] = R = t(_, h, R, D, Y[f2 + 1]), h = _;
          return R;
        };
      }();
    });
    var li = ie(() => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
    });
    var ui = ie(() => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
    });
    var Mi = Ot((zP, Qa) => {
      Qa.exports = { name: "@prisma/engines-version", version: "6.18.0-8.34b5a692b7bd79939a9a2c3ef97d816e749cda2f", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "34b5a692b7bd79939a9a2c3ef97d816e749cda2f" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
    });
    var sr;
    var _i = ie(() => {
      "use strict";
      u();
      c();
      m();
      p2();
      d();
      l2();
      sr = class {
        static {
          __name(this, "sr");
        }
        events = {};
        on(e, r) {
          return this.events[e] || (this.events[e] = []), this.events[e].push(r), this;
        }
        emit(e, ...r) {
          return this.events[e] ? (this.events[e].forEach((n) => {
            n(...r);
          }), true) : false;
        }
      };
    });
    var Xl = {};
    rt(Xl, { DMMF: /* @__PURE__ */ __name(() => ct, "DMMF"), Debug: /* @__PURE__ */ __name(() => G, "Debug"), Decimal: /* @__PURE__ */ __name(() => be, "Decimal"), Extensions: /* @__PURE__ */ __name(() => Cr, "Extensions"), MetricsClient: /* @__PURE__ */ __name(() => He, "MetricsClient"), PrismaClientInitializationError: /* @__PURE__ */ __name(() => I, "PrismaClientInitializationError"), PrismaClientKnownRequestError: /* @__PURE__ */ __name(() => Z, "PrismaClientKnownRequestError"), PrismaClientRustPanicError: /* @__PURE__ */ __name(() => xe, "PrismaClientRustPanicError"), PrismaClientUnknownRequestError: /* @__PURE__ */ __name(() => Q, "PrismaClientUnknownRequestError"), PrismaClientValidationError: /* @__PURE__ */ __name(() => K, "PrismaClientValidationError"), Public: /* @__PURE__ */ __name(() => Ar, "Public"), Sql: /* @__PURE__ */ __name(() => ee, "Sql"), createParam: /* @__PURE__ */ __name(() => Ci, "createParam"), defineDmmfProperty: /* @__PURE__ */ __name(() => Di, "defineDmmfProperty"), deserializeJsonResponse: /* @__PURE__ */ __name(() => Xe, "deserializeJsonResponse"), deserializeRawResult: /* @__PURE__ */ __name(() => hr, "deserializeRawResult"), dmmfToRuntimeDataModel: /* @__PURE__ */ __name(() => ri, "dmmfToRuntimeDataModel"), empty: /* @__PURE__ */ __name(() => Fi, "empty"), getPrismaClient: /* @__PURE__ */ __name(() => Go, "getPrismaClient"), getRuntime: /* @__PURE__ */ __name(() => Ze, "getRuntime"), join: /* @__PURE__ */ __name(() => Li, "join"), makeStrictEnum: /* @__PURE__ */ __name(() => Wo, "makeStrictEnum"), makeTypedQueryFactory: /* @__PURE__ */ __name(() => Ii, "makeTypedQueryFactory"), objectEnumValues: /* @__PURE__ */ __name(() => zt, "objectEnumValues"), raw: /* @__PURE__ */ __name(() => zr, "raw"), serializeJsonQuery: /* @__PURE__ */ __name(() => nr, "serializeJsonQuery"), skip: /* @__PURE__ */ __name(() => rr, "skip"), sqltag: /* @__PURE__ */ __name(() => Yr, "sqltag"), warnEnvConflicts: /* @__PURE__ */ __name(() => void 0, "warnEnvConflicts"), warnOnce: /* @__PURE__ */ __name(() => at, "warnOnce") });
    module.exports = ts(Xl);
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Cr = {};
    rt(Cr, { defineExtension: /* @__PURE__ */ __name(() => Tn, "defineExtension"), getExtensionContext: /* @__PURE__ */ __name(() => Cn, "getExtensionContext") });
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Tn(t) {
      return typeof t == "function" ? t : (e) => e.$extends(t);
    }
    __name(Tn, "Tn");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Cn(t) {
      return t;
    }
    __name(Cn, "Cn");
    var Ar = {};
    rt(Ar, { validator: /* @__PURE__ */ __name(() => An, "validator") });
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function An(...t) {
      return (e) => e;
    }
    __name(An, "An");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Rr;
    var Rn;
    var Sn;
    var On;
    var kn = true;
    typeof g < "u" && ({ FORCE_COLOR: Rr, NODE_DISABLE_COLORS: Rn, NO_COLOR: Sn, TERM: On } = g.env || {}, kn = g.stdout && g.stdout.isTTY);
    var ds = { enabled: !Rn && Sn == null && On !== "dumb" && (Rr != null && Rr !== "0" || kn) };
    function U(t, e) {
      let r = new RegExp(`\\x1b\\[${e}m`, "g"), n = `\x1B[${t}m`, i = `\x1B[${e}m`;
      return function(o) {
        return !ds.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
      };
    }
    __name(U, "U");
    var zu = U(0, 0);
    var _t = U(1, 22);
    var Lt = U(2, 22);
    var Yu = U(3, 23);
    var Dn = U(4, 24);
    var Xu = U(7, 27);
    var Zu = U(8, 28);
    var ec = U(9, 29);
    var tc = U(30, 39);
    var Ue = U(31, 39);
    var In = U(32, 39);
    var Mn = U(33, 39);
    var _n = U(34, 39);
    var rc = U(35, 39);
    var Ln = U(36, 39);
    var nc = U(37, 39);
    var Fn = U(90, 39);
    var ic = U(90, 39);
    var oc = U(40, 49);
    var sc = U(41, 49);
    var ac = U(42, 49);
    var lc = U(43, 49);
    var uc = U(44, 49);
    var cc = U(45, 49);
    var mc = U(46, 49);
    var pc = U(47, 49);
    u();
    c();
    m();
    p2();
    d();
    l2();
    var fs = 100;
    var Un = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var Ft = [];
    var Nn = Date.now();
    var gs = 0;
    var Sr = typeof g < "u" ? g.env : {};
    globalThis.DEBUG ??= Sr.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= Sr.DEBUG_COLORS ? Sr.DEBUG_COLORS === "true" : true;
    var it = { enable(t) {
      typeof t == "string" && (globalThis.DEBUG = t);
    }, disable() {
      let t = globalThis.DEBUG;
      return globalThis.DEBUG = "", t;
    }, enabled(t) {
      let e = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r = e.some((i) => i === "" || i[0] === "-" ? false : t.match(RegExp(i.split("*").join(".*") + "$"))), n = e.some((i) => i === "" || i[0] !== "-" ? false : t.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
      return r && !n;
    }, log: /* @__PURE__ */ __name((...t) => {
      let [e, r, ...n] = t;
      (console.warn ?? console.log)(`${e} ${r}`, ...n);
    }, "log"), formatters: {} };
    function ys(t) {
      let e = { color: Un[gs++ % Un.length], enabled: it.enabled(t), namespace: t, log: it.log, extend: /* @__PURE__ */ __name(() => {
      }, "extend") }, r = /* @__PURE__ */ __name((...n) => {
        let { enabled: i, namespace: o, color: s, log: a } = e;
        if (n.length !== 0 && Ft.push([o, ...n]), Ft.length > fs && Ft.shift(), it.enabled(o) || i) {
          let f2 = n.map((C) => typeof C == "string" ? C : hs(C)), h = `+${Date.now() - Nn}ms`;
          Nn = Date.now(), a(o, ...f2, h);
        }
      }, "r");
      return new Proxy(r, { get: /* @__PURE__ */ __name((n, i) => e[i], "get"), set: /* @__PURE__ */ __name((n, i, o) => e[i] = o, "set") });
    }
    __name(ys, "ys");
    var G = new Proxy(ys, { get: /* @__PURE__ */ __name((t, e) => it[e], "get"), set: /* @__PURE__ */ __name((t, e, r) => it[e] = r, "set") });
    function hs(t, e = 2) {
      let r = /* @__PURE__ */ new Set();
      return JSON.stringify(t, (n, i) => {
        if (typeof i == "object" && i !== null) {
          if (r.has(i)) return "[Circular *]";
          r.add(i);
        } else if (typeof i == "bigint") return i.toString();
        return i;
      }, e);
    }
    __name(hs, "hs");
    function qn() {
      Ft.length = 0;
    }
    __name(qn, "qn");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var kr = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Us = jn();
    var Dr = Us.version;
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Ne(t) {
      let e = Js();
      return e || (t?.config.engineType === "library" ? "library" : t?.config.engineType === "binary" ? "binary" : t?.config.engineType === "client" ? "client" : Gs());
    }
    __name(Ne, "Ne");
    function Js() {
      let t = g.env.PRISMA_CLIENT_ENGINE_TYPE;
      return t === "library" ? "library" : t === "binary" ? "binary" : t === "client" ? "client" : void 0;
    }
    __name(Js, "Js");
    function Gs() {
      return "library";
    }
    __name(Gs, "Gs");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Ir(t) {
      return t.name === "DriverAdapterError" && typeof t.cause == "object";
    }
    __name(Ir, "Ir");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Nt(t) {
      return { ok: true, value: t, map(e) {
        return Nt(e(t));
      }, flatMap(e) {
        return e(t);
      } };
    }
    __name(Nt, "Nt");
    function De(t) {
      return { ok: false, error: t, map() {
        return De(t);
      }, flatMap() {
        return De(t);
      } };
    }
    __name(De, "De");
    var Wn = G("driver-adapter-utils");
    var Mr = class {
      static {
        __name(this, "Mr");
      }
      registeredErrors = [];
      consumeError(e) {
        return this.registeredErrors[e];
      }
      registerNewError(e) {
        let r = 0;
        for (; this.registeredErrors[r] !== void 0; ) r++;
        return this.registeredErrors[r] = { error: e }, r;
      }
    };
    var qt = /* @__PURE__ */ __name((t, e = new Mr()) => {
      let r = { adapterName: t.adapterName, errorRegistry: e, queryRaw: we(e, t.queryRaw.bind(t)), executeRaw: we(e, t.executeRaw.bind(t)), executeScript: we(e, t.executeScript.bind(t)), dispose: we(e, t.dispose.bind(t)), provider: t.provider, startTransaction: /* @__PURE__ */ __name(async (...n) => (await we(e, t.startTransaction.bind(t))(...n)).map((o) => Ws(e, o)), "startTransaction") };
      return t.getConnectionInfo && (r.getConnectionInfo = Ks(e, t.getConnectionInfo.bind(t))), r;
    }, "qt");
    var Ws = /* @__PURE__ */ __name((t, e) => ({ adapterName: e.adapterName, provider: e.provider, options: e.options, queryRaw: we(t, e.queryRaw.bind(e)), executeRaw: we(t, e.executeRaw.bind(e)), commit: we(t, e.commit.bind(e)), rollback: we(t, e.rollback.bind(e)) }), "Ws");
    function we(t, e) {
      return async (...r) => {
        try {
          return Nt(await e(...r));
        } catch (n) {
          if (Wn("[error@wrapAsync]", n), Ir(n)) return De(n.cause);
          let i = t.registerNewError(n);
          return De({ kind: "GenericJs", id: i });
        }
      };
    }
    __name(we, "we");
    function Ks(t, e) {
      return (...r) => {
        try {
          return Nt(e(...r));
        } catch (n) {
          if (Wn("[error@wrapSync]", n), Ir(n)) return De(n.cause);
          let i = t.registerNewError(n);
          return De({ kind: "GenericJs", id: i });
        }
      };
    }
    __name(Ks, "Ks");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Kn = "prisma+postgres";
    var Hn = `${Kn}:`;
    function _r(t) {
      return t?.toString().startsWith(`${Hn}//`) ?? false;
    }
    __name(_r, "_r");
    var st = {};
    rt(st, { error: /* @__PURE__ */ __name(() => Ys, "error"), info: /* @__PURE__ */ __name(() => zs, "info"), log: /* @__PURE__ */ __name(() => Hs, "log"), query: /* @__PURE__ */ __name(() => Xs, "query"), should: /* @__PURE__ */ __name(() => Xn, "should"), tags: /* @__PURE__ */ __name(() => ot, "tags"), warn: /* @__PURE__ */ __name(() => Lr, "warn") });
    u();
    c();
    m();
    p2();
    d();
    l2();
    var ot = { error: Ue("prisma:error"), warn: Mn("prisma:warn"), info: Ln("prisma:info"), query: _n("prisma:query") };
    var Xn = { warn: /* @__PURE__ */ __name(() => !g.env.PRISMA_DISABLE_WARNINGS, "warn") };
    function Hs(...t) {
      console.log(...t);
    }
    __name(Hs, "Hs");
    function Lr(t, ...e) {
      Xn.warn() && console.warn(`${ot.warn} ${t}`, ...e);
    }
    __name(Lr, "Lr");
    function zs(t, ...e) {
      console.info(`${ot.info} ${t}`, ...e);
    }
    __name(zs, "zs");
    function Ys(t, ...e) {
      console.error(`${ot.error} ${t}`, ...e);
    }
    __name(Ys, "Ys");
    function Xs(t, ...e) {
      console.log(`${ot.query} ${t}`, ...e);
    }
    __name(Xs, "Xs");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Bt(t, e) {
      if (!t) throw new Error(`${e}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
    }
    __name(Bt, "Bt");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Ie(t, e) {
      throw new Error(e);
    }
    __name(Ie, "Ie");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Fr({ onlyFirst: t = false } = {}) {
      let r = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
      return new RegExp(r, t ? void 0 : "g");
    }
    __name(Fr, "Fr");
    var Zs = Fr();
    function Ur(t) {
      if (typeof t != "string") throw new TypeError(`Expected a \`string\`, got \`${typeof t}\``);
      return t.replace(Zs, "");
    }
    __name(Ur, "Ur");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Nr(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }
    __name(Nr, "Nr");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Vt(t, e) {
      let r = {};
      for (let n of Object.keys(t)) r[n] = e(t[n], n);
      return r;
    }
    __name(Vt, "Vt");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function qr(t, e) {
      if (t.length === 0) return;
      let r = t[0];
      for (let n = 1; n < t.length; n++) e(r, t[n]) < 0 && (r = t[n]);
      return r;
    }
    __name(qr, "qr");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function re(t, e) {
      Object.defineProperty(t, "name", { value: e, configurable: true });
    }
    __name(re, "re");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Zn = /* @__PURE__ */ new Set();
    var at = /* @__PURE__ */ __name((t, e, ...r) => {
      Zn.has(t) || (Zn.add(t), Lr(e, ...r));
    }, "at");
    var I = class t extends Error {
      static {
        __name(this, "t");
      }
      clientVersion;
      errorCode;
      retryable;
      constructor(e, r, n) {
        super(e), this.name = "PrismaClientInitializationError", this.clientVersion = r, this.errorCode = n, Error.captureStackTrace(t);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
      }
    };
    re(I, "PrismaClientInitializationError");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Z = class extends Error {
      static {
        __name(this, "Z");
      }
      code;
      meta;
      clientVersion;
      batchRequestIdx;
      constructor(e, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
        super(e), this.name = "PrismaClientKnownRequestError", this.code = r, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
      }
    };
    re(Z, "PrismaClientKnownRequestError");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var xe = class extends Error {
      static {
        __name(this, "xe");
      }
      clientVersion;
      constructor(e, r) {
        super(e), this.name = "PrismaClientRustPanicError", this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
      }
    };
    re(xe, "PrismaClientRustPanicError");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Q = class extends Error {
      static {
        __name(this, "Q");
      }
      clientVersion;
      batchRequestIdx;
      constructor(e, { clientVersion: r, batchRequestIdx: n }) {
        super(e), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
      }
    };
    re(Q, "PrismaClientUnknownRequestError");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var K = class extends Error {
      static {
        __name(this, "K");
      }
      name = "PrismaClientValidationError";
      clientVersion;
      constructor(e, { clientVersion: r }) {
        super(e), this.clientVersion = r;
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
      }
    };
    re(K, "PrismaClientValidationError");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var me = class {
      static {
        __name(this, "me");
      }
      _map = /* @__PURE__ */ new Map();
      get(e) {
        return this._map.get(e)?.value;
      }
      set(e, r) {
        this._map.set(e, { value: r });
      }
      getOrCreate(e, r) {
        let n = this._map.get(e);
        if (n) return n.value;
        let i = r();
        return this.set(e, i), i;
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ve(t) {
      return t.substring(0, 1).toLowerCase() + t.substring(1);
    }
    __name(ve, "ve");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ti(t, e) {
      let r = {};
      for (let n of t) {
        let i = n[e];
        r[i] = n;
      }
      return r;
    }
    __name(ti, "ti");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function lt(t) {
      let e;
      return { get() {
        return e || (e = { value: t() }), e.value;
      } };
    }
    __name(lt, "lt");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ri(t) {
      return { models: Br(t.models), enums: Br(t.enums), types: Br(t.types) };
    }
    __name(ri, "ri");
    function Br(t) {
      let e = {};
      for (let { name: r, ...n } of t) e[r] = n;
      return e;
    }
    __name(Br, "Br");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function qe(t) {
      return t instanceof Date || Object.prototype.toString.call(t) === "[object Date]";
    }
    __name(qe, "qe");
    function jt(t) {
      return t.toString() !== "Invalid Date";
    }
    __name(jt, "jt");
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
    function Be(t) {
      return v.isDecimal(t) ? true : t !== null && typeof t == "object" && typeof t.s == "number" && typeof t.e == "number" && typeof t.toFixed == "function" && Array.isArray(t.d);
    }
    __name(Be, "Be");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var ct = {};
    rt(ct, { ModelAction: /* @__PURE__ */ __name(() => ut, "ModelAction"), datamodelEnumToSchemaEnum: /* @__PURE__ */ __name(() => ea, "datamodelEnumToSchemaEnum") });
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ea(t) {
      return { name: t.name, values: t.values.map((e) => e.name) };
    }
    __name(ea, "ea");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var ut = ((F2) => (F2.findUnique = "findUnique", F2.findUniqueOrThrow = "findUniqueOrThrow", F2.findFirst = "findFirst", F2.findFirstOrThrow = "findFirstOrThrow", F2.findMany = "findMany", F2.create = "create", F2.createMany = "createMany", F2.createManyAndReturn = "createManyAndReturn", F2.update = "update", F2.updateMany = "updateMany", F2.updateManyAndReturn = "updateManyAndReturn", F2.upsert = "upsert", F2.delete = "delete", F2.deleteMany = "deleteMany", F2.groupBy = "groupBy", F2.count = "count", F2.aggregate = "aggregate", F2.findRaw = "findRaw", F2.aggregateRaw = "aggregateRaw", F2))(ut || {});
    var ta = kt(Yn());
    var ra = { red: Ue, gray: Fn, dim: Lt, bold: _t, underline: Dn, highlightSource: /* @__PURE__ */ __name((t) => t.highlight(), "highlightSource") };
    var na = { red: /* @__PURE__ */ __name((t) => t, "red"), gray: /* @__PURE__ */ __name((t) => t, "gray"), dim: /* @__PURE__ */ __name((t) => t, "dim"), bold: /* @__PURE__ */ __name((t) => t, "bold"), underline: /* @__PURE__ */ __name((t) => t, "underline"), highlightSource: /* @__PURE__ */ __name((t) => t, "highlightSource") };
    function ia({ message: t, originalMethod: e, isPanic: r, callArguments: n }) {
      return { functionName: `prisma.${e}()`, message: t, isPanic: r ?? false, callArguments: n };
    }
    __name(ia, "ia");
    function oa({ functionName: t, location: e, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
      let a = [""], f2 = e ? " in" : ":";
      if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${t}\``)} invocation${f2}`))) : a.push(s.red(`Invalid ${s.bold(`\`${t}\``)} invocation${f2}`)), e && a.push(s.underline(sa(e))), i) {
        a.push("");
        let h = [i.toString()];
        o && (h.push(o), h.push(s.dim(")"))), a.push(h.join("")), o && a.push("");
      } else a.push(""), o && a.push(o), a.push("");
      return a.push(r), a.join(`
`);
    }
    __name(oa, "oa");
    function sa(t) {
      let e = [t.fileName];
      return t.lineNumber && e.push(String(t.lineNumber)), t.columnNumber && e.push(String(t.columnNumber)), e.join(":");
    }
    __name(sa, "sa");
    function $t(t) {
      let e = t.showColors ? ra : na, r;
      return typeof $getTemplateParameters < "u" ? r = $getTemplateParameters(t, e) : r = ia(t), oa(r, e);
    }
    __name($t, "$t");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var mi = kt(Vr());
    u();
    c();
    m();
    p2();
    d();
    l2();
    function si(t, e, r) {
      let n = ai(t), i = aa(n), o = ua(i);
      o ? Qt(o, e, r) : e.addErrorMessage(() => "Unknown error");
    }
    __name(si, "si");
    function ai(t) {
      return t.errors.flatMap((e) => e.kind === "Union" ? ai(e) : [e]);
    }
    __name(ai, "ai");
    function aa(t) {
      let e = /* @__PURE__ */ new Map(), r = [];
      for (let n of t) {
        if (n.kind !== "InvalidArgumentType") {
          r.push(n);
          continue;
        }
        let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = e.get(i);
        o ? e.set(i, { ...n, argument: { ...n.argument, typeNames: la(o.argument.typeNames, n.argument.typeNames) } }) : e.set(i, n);
      }
      return r.push(...e.values()), r;
    }
    __name(aa, "aa");
    function la(t, e) {
      return [...new Set(t.concat(e))];
    }
    __name(la, "la");
    function ua(t) {
      return qr(t, (e, r) => {
        let n = ii(e), i = ii(r);
        return n !== i ? n - i : oi(e) - oi(r);
      });
    }
    __name(ua, "ua");
    function ii(t) {
      let e = 0;
      return Array.isArray(t.selectionPath) && (e += t.selectionPath.length), Array.isArray(t.argumentPath) && (e += t.argumentPath.length), e;
    }
    __name(ii, "ii");
    function oi(t) {
      switch (t.kind) {
        case "InvalidArgumentValue":
        case "ValueTooLarge":
          return 20;
        case "InvalidArgumentType":
          return 10;
        case "RequiredArgumentMissing":
          return -10;
        default:
          return 0;
      }
    }
    __name(oi, "oi");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var ne = class {
      static {
        __name(this, "ne");
      }
      constructor(e, r) {
        this.name = e;
        this.value = r;
      }
      isRequired = false;
      makeRequired() {
        return this.isRequired = true, this;
      }
      write(e) {
        let { colors: { green: r } } = e.context;
        e.addMarginSymbol(r(this.isRequired ? "+" : "?")), e.write(r(this.name)), this.isRequired || e.write(r("?")), e.write(r(": ")), typeof this.value == "string" ? e.write(r(this.value)) : e.write(this.value);
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    ui();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ve = class {
      static {
        __name(this, "Ve");
      }
      constructor(e = 0, r) {
        this.context = r;
        this.currentIndent = e;
      }
      lines = [];
      currentLine = "";
      currentIndent = 0;
      marginSymbol;
      afterNextNewLineCallback;
      write(e) {
        return typeof e == "string" ? this.currentLine += e : e.write(this), this;
      }
      writeJoined(e, r, n = (i, o) => o.write(i)) {
        let i = r.length - 1;
        for (let o = 0; o < r.length; o++) n(r[o], this), o !== i && this.write(e);
        return this;
      }
      writeLine(e) {
        return this.write(e).newLine();
      }
      newLine() {
        this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = void 0;
        let e = this.afterNextNewLineCallback;
        return this.afterNextNewLineCallback = void 0, e?.(), this;
      }
      withIndent(e) {
        return this.indent(), e(this), this.unindent(), this;
      }
      afterNextNewline(e) {
        return this.afterNextNewLineCallback = e, this;
      }
      indent() {
        return this.currentIndent++, this;
      }
      unindent() {
        return this.currentIndent > 0 && this.currentIndent--, this;
      }
      addMarginSymbol(e) {
        return this.marginSymbol = e, this;
      }
      toString() {
        return this.lines.concat(this.indentedCurrentLine()).join(`
`);
      }
      getCurrentLineLength() {
        return this.currentLine.length;
      }
      indentedCurrentLine() {
        let e = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
        return this.marginSymbol ? this.marginSymbol + e.slice(1) : e;
      }
    };
    li();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Jt = class {
      static {
        __name(this, "Jt");
      }
      constructor(e) {
        this.value = e;
      }
      write(e) {
        e.write(this.value);
      }
      markAsError() {
        this.value.markAsError();
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Gt = /* @__PURE__ */ __name((t) => t, "Gt");
    var Wt = { bold: Gt, red: Gt, green: Gt, dim: Gt, enabled: false };
    var ci = { bold: _t, red: Ue, green: In, dim: Lt, enabled: true };
    var je = { write(t) {
      t.writeLine(",");
    } };
    u();
    c();
    m();
    p2();
    d();
    l2();
    var pe = class {
      static {
        __name(this, "pe");
      }
      constructor(e) {
        this.contents = e;
      }
      isUnderlined = false;
      color = /* @__PURE__ */ __name((e) => e, "color");
      underline() {
        return this.isUnderlined = true, this;
      }
      setColor(e) {
        return this.color = e, this;
      }
      write(e) {
        let r = e.getCurrentLineLength();
        e.write(this.color(this.contents)), this.isUnderlined && e.afterNextNewline(() => {
          e.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));
        });
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Te = class {
      static {
        __name(this, "Te");
      }
      hasError = false;
      markAsError() {
        return this.hasError = true, this;
      }
    };
    var $e = class extends Te {
      static {
        __name(this, "$e");
      }
      items = [];
      addItem(e) {
        return this.items.push(new Jt(e)), this;
      }
      getField(e) {
        return this.items[e];
      }
      getPrintWidth() {
        return this.items.length === 0 ? 2 : Math.max(...this.items.map((r) => r.value.getPrintWidth())) + 2;
      }
      write(e) {
        if (this.items.length === 0) {
          this.writeEmpty(e);
          return;
        }
        this.writeWithItems(e);
      }
      writeEmpty(e) {
        let r = new pe("[]");
        this.hasError && r.setColor(e.context.colors.red).underline(), e.write(r);
      }
      writeWithItems(e) {
        let { colors: r } = e.context;
        e.writeLine("[").withIndent(() => e.writeJoined(je, this.items).newLine()).write("]"), this.hasError && e.afterNextNewline(() => {
          e.writeLine(r.red("~".repeat(this.getPrintWidth())));
        });
      }
      asObject() {
      }
    };
    var Qe = class t extends Te {
      static {
        __name(this, "t");
      }
      fields = {};
      suggestions = [];
      addField(e) {
        this.fields[e.name] = e;
      }
      addSuggestion(e) {
        this.suggestions.push(e);
      }
      getField(e) {
        return this.fields[e];
      }
      getDeepField(e) {
        let [r, ...n] = e, i = this.getField(r);
        if (!i) return;
        let o = i;
        for (let s of n) {
          let a;
          if (o.value instanceof t ? a = o.value.getField(s) : o.value instanceof $e && (a = o.value.getField(Number(s))), !a) return;
          o = a;
        }
        return o;
      }
      getDeepFieldValue(e) {
        return e.length === 0 ? this : this.getDeepField(e)?.value;
      }
      hasField(e) {
        return !!this.getField(e);
      }
      removeAllFields() {
        this.fields = {};
      }
      removeField(e) {
        delete this.fields[e];
      }
      getFields() {
        return this.fields;
      }
      isEmpty() {
        return Object.keys(this.fields).length === 0;
      }
      getFieldValue(e) {
        return this.getField(e)?.value;
      }
      getDeepSubSelectionValue(e) {
        let r = this;
        for (let n of e) {
          if (!(r instanceof t)) return;
          let i = r.getSubSelectionValue(n);
          if (!i) return;
          r = i;
        }
        return r;
      }
      getDeepSelectionParent(e) {
        let r = this.getSelectionParent();
        if (!r) return;
        let n = r;
        for (let i of e) {
          let o = n.value.getFieldValue(i);
          if (!o || !(o instanceof t)) return;
          let s = o.getSelectionParent();
          if (!s) return;
          n = s;
        }
        return n;
      }
      getSelectionParent() {
        let e = this.getField("select")?.value.asObject();
        if (e) return { kind: "select", value: e };
        let r = this.getField("include")?.value.asObject();
        if (r) return { kind: "include", value: r };
      }
      getSubSelectionValue(e) {
        return this.getSelectionParent()?.value.fields[e].value;
      }
      getPrintWidth() {
        let e = Object.values(this.fields);
        return e.length == 0 ? 2 : Math.max(...e.map((n) => n.getPrintWidth())) + 2;
      }
      write(e) {
        let r = Object.values(this.fields);
        if (r.length === 0 && this.suggestions.length === 0) {
          this.writeEmpty(e);
          return;
        }
        this.writeWithContents(e, r);
      }
      asObject() {
        return this;
      }
      writeEmpty(e) {
        let r = new pe("{}");
        this.hasError && r.setColor(e.context.colors.red).underline(), e.write(r);
      }
      writeWithContents(e, r) {
        e.writeLine("{").withIndent(() => {
          e.writeJoined(je, [...r, ...this.suggestions]).newLine();
        }), e.write("}"), this.hasError && e.afterNextNewline(() => {
          e.writeLine(e.context.colors.red("~".repeat(this.getPrintWidth())));
        });
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    var W = class extends Te {
      static {
        __name(this, "W");
      }
      constructor(r) {
        super();
        this.text = r;
      }
      getPrintWidth() {
        return this.text.length;
      }
      write(r) {
        let n = new pe(this.text);
        this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
      }
      asObject() {
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    var mt = class {
      static {
        __name(this, "mt");
      }
      fields = [];
      addField(e, r) {
        return this.fields.push({ write(n) {
          let { green: i, dim: o } = n.context.colors;
          n.write(i(o(`${e}: ${r}`))).addMarginSymbol(i(o("+")));
        } }), this;
      }
      write(e) {
        let { colors: { green: r } } = e.context;
        e.writeLine(r("{")).withIndent(() => {
          e.writeJoined(je, this.fields).newLine();
        }).write(r("}")).addMarginSymbol(r("+"));
      }
    };
    function Qt(t, e, r) {
      switch (t.kind) {
        case "MutuallyExclusiveFields":
          ca(t, e);
          break;
        case "IncludeOnScalar":
          ma(t, e);
          break;
        case "EmptySelection":
          pa(t, e, r);
          break;
        case "UnknownSelectionField":
          ya(t, e);
          break;
        case "InvalidSelectionValue":
          ha(t, e);
          break;
        case "UnknownArgument":
          ba(t, e);
          break;
        case "UnknownInputField":
          wa(t, e);
          break;
        case "RequiredArgumentMissing":
          xa(t, e);
          break;
        case "InvalidArgumentType":
          Ea(t, e);
          break;
        case "InvalidArgumentValue":
          Pa(t, e);
          break;
        case "ValueTooLarge":
          va(t, e);
          break;
        case "SomeFieldsMissing":
          Ta(t, e);
          break;
        case "TooManyFieldsGiven":
          Ca(t, e);
          break;
        case "Union":
          si(t, e, r);
          break;
        default:
          throw new Error("not implemented: " + t.kind);
      }
    }
    __name(Qt, "Qt");
    function ca(t, e) {
      let r = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      r && (r.getField(t.firstField)?.markAsError(), r.getField(t.secondField)?.markAsError()), e.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${t.firstField}\``)} or ${n.green(`\`${t.secondField}\``)}, but ${n.red("not both")} at the same time.`);
    }
    __name(ca, "ca");
    function ma(t, e) {
      let [r, n] = Je(t.selectionPath), i = t.outputType, o = e.arguments.getDeepSelectionParent(r)?.value;
      if (o && (o.getField(n)?.markAsError(), i)) for (let s of i.fields) s.isRelation && o.addSuggestion(new ne(s.name, "true"));
      e.addErrorMessage((s) => {
        let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
        return i ? a += ` on model ${s.bold(i.name)}. ${pt(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
      });
    }
    __name(ma, "ma");
    function pa(t, e, r) {
      let n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (n) {
        let i = n.getField("omit")?.value.asObject();
        if (i) {
          da(t, e, i);
          return;
        }
        if (n.hasField("select")) {
          fa(t, e);
          return;
        }
      }
      if (r?.[ve(t.outputType.name)]) {
        ga(t, e);
        return;
      }
      e.addErrorMessage(() => `Unknown field at "${t.selectionPath.join(".")} selection"`);
    }
    __name(pa, "pa");
    function da(t, e, r) {
      r.removeAllFields();
      for (let n of t.outputType.fields) r.addSuggestion(new ne(n.name, "false"));
      e.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(t.outputType.name)}. At least one field must be included in the result`);
    }
    __name(da, "da");
    function fa(t, e) {
      let r = t.outputType, n = e.arguments.getDeepSelectionParent(t.selectionPath)?.value, i = n?.isEmpty() ?? false;
      n && (n.removeAllFields(), fi(n, r)), e.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${pt(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);
    }
    __name(fa, "fa");
    function ga(t, e) {
      let r = new mt();
      for (let i of t.outputType.fields) i.isRelation || r.addField(i.name, "false");
      let n = new ne("omit", r).makeRequired();
      if (t.selectionPath.length === 0) e.arguments.addSuggestion(n);
      else {
        let [i, o] = Je(t.selectionPath), a = e.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
        if (a) {
          let f2 = a?.value.asObject() ?? new Qe();
          f2.addSuggestion(n), a.value = f2;
        }
      }
      e.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(t.outputType.name)}. At least one field must be included in the result`);
    }
    __name(ga, "ga");
    function ya(t, e) {
      let r = gi(t.selectionPath, e);
      if (r.parentKind !== "unknown") {
        r.field.markAsError();
        let n = r.parent;
        switch (r.parentKind) {
          case "select":
            fi(n, t.outputType);
            break;
          case "include":
            Aa(n, t.outputType);
            break;
          case "omit":
            Ra(n, t.outputType);
            break;
        }
      }
      e.addErrorMessage((n) => {
        let i = [`Unknown field ${n.red(`\`${r.fieldName}\``)}`];
        return r.parentKind !== "unknown" && i.push(`for ${n.bold(r.parentKind)} statement`), i.push(`on model ${n.bold(`\`${t.outputType.name}\``)}.`), i.push(pt(n)), i.join(" ");
      });
    }
    __name(ya, "ya");
    function ha(t, e) {
      let r = gi(t.selectionPath, e);
      r.parentKind !== "unknown" && r.field.value.markAsError(), e.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r.fieldName)}\`: ${t.underlyingError}`);
    }
    __name(ha, "ha");
    function ba(t, e) {
      let r = t.argumentPath[0], n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      n && (n.getField(r)?.markAsError(), Sa(n, t.arguments)), e.addErrorMessage((i) => pi(i, r, t.arguments.map((o) => o.name)));
    }
    __name(ba, "ba");
    function wa(t, e) {
      let [r, n] = Je(t.argumentPath), i = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (i) {
        i.getDeepField(t.argumentPath)?.markAsError();
        let o = i.getDeepFieldValue(r)?.asObject();
        o && yi(o, t.inputType);
      }
      e.addErrorMessage((o) => pi(o, n, t.inputType.fields.map((s) => s.name)));
    }
    __name(wa, "wa");
    function pi(t, e, r) {
      let n = [`Unknown argument \`${t.red(e)}\`.`], i = ka(e, r);
      return i && n.push(`Did you mean \`${t.green(i)}\`?`), r.length > 0 && n.push(pt(t)), n.join(" ");
    }
    __name(pi, "pi");
    function xa(t, e) {
      let r;
      e.addErrorMessage((f2) => r?.value instanceof W && r.value.text === "null" ? `Argument \`${f2.green(o)}\` must not be ${f2.red("null")}.` : `Argument \`${f2.green(o)}\` is missing.`);
      let n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (!n) return;
      let [i, o] = Je(t.argumentPath), s = new mt(), a = n.getDeepFieldValue(i)?.asObject();
      if (a) {
        if (r = a.getField(o), r && a.removeField(o), t.inputTypes.length === 1 && t.inputTypes[0].kind === "object") {
          for (let f2 of t.inputTypes[0].fields) s.addField(f2.name, f2.typeNames.join(" | "));
          a.addSuggestion(new ne(o, s).makeRequired());
        } else {
          let f2 = t.inputTypes.map(di).join(" | ");
          a.addSuggestion(new ne(o, f2).makeRequired());
        }
        if (t.dependentArgumentPath) {
          n.getDeepField(t.dependentArgumentPath)?.markAsError();
          let [, f2] = Je(t.dependentArgumentPath);
          e.addErrorMessage((h) => `Argument \`${h.green(o)}\` is required because argument \`${h.green(f2)}\` was provided.`);
        }
      }
    }
    __name(xa, "xa");
    function di(t) {
      return t.kind === "list" ? `${di(t.elementType)}[]` : t.name;
    }
    __name(di, "di");
    function Ea(t, e) {
      let r = t.argument.name, n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      n && n.getDeepFieldValue(t.argumentPath)?.markAsError(), e.addErrorMessage((i) => {
        let o = Kt("or", t.argument.typeNames.map((s) => i.green(s)));
        return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(t.inferredType)}.`;
      });
    }
    __name(Ea, "Ea");
    function Pa(t, e) {
      let r = t.argument.name, n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      n && n.getDeepFieldValue(t.argumentPath)?.markAsError(), e.addErrorMessage((i) => {
        let o = [`Invalid value for argument \`${i.bold(r)}\``];
        if (t.underlyingError && o.push(`: ${t.underlyingError}`), o.push("."), t.argument.typeNames.length > 0) {
          let s = Kt("or", t.argument.typeNames.map((a) => i.green(a)));
          o.push(` Expected ${s}.`);
        }
        return o.join("");
      });
    }
    __name(Pa, "Pa");
    function va(t, e) {
      let r = t.argument.name, n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject(), i;
      if (n) {
        let s = n.getDeepField(t.argumentPath)?.value;
        s?.markAsError(), s instanceof W && (i = s.text);
      }
      e.addErrorMessage((o) => {
        let s = ["Unable to fit value"];
        return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(" ");
      });
    }
    __name(va, "va");
    function Ta(t, e) {
      let r = t.argumentPath[t.argumentPath.length - 1], n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject();
      if (n) {
        let i = n.getDeepFieldValue(t.argumentPath)?.asObject();
        i && yi(i, t.inputType);
      }
      e.addErrorMessage((i) => {
        let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(t.inputType.name)} needs`];
        return t.constraints.minFieldCount === 1 ? t.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${Kt("or", t.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${t.constraints.minFieldCount}`)} arguments.`), o.push(pt(i)), o.join(" ");
      });
    }
    __name(Ta, "Ta");
    function Ca(t, e) {
      let r = t.argumentPath[t.argumentPath.length - 1], n = e.arguments.getDeepSubSelectionValue(t.selectionPath)?.asObject(), i = [];
      if (n) {
        let o = n.getDeepFieldValue(t.argumentPath)?.asObject();
        o && (o.markAsError(), i = Object.keys(o.getFields()));
      }
      e.addErrorMessage((o) => {
        let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(t.inputType.name)} needs`];
        return t.constraints.minFieldCount === 1 && t.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : t.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${t.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${Kt("and", i.map((a) => o.red(a)))}. Please choose`), t.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${t.constraints.maxFieldCount}.`), s.join(" ");
      });
    }
    __name(Ca, "Ca");
    function fi(t, e) {
      for (let r of e.fields) t.hasField(r.name) || t.addSuggestion(new ne(r.name, "true"));
    }
    __name(fi, "fi");
    function Aa(t, e) {
      for (let r of e.fields) r.isRelation && !t.hasField(r.name) && t.addSuggestion(new ne(r.name, "true"));
    }
    __name(Aa, "Aa");
    function Ra(t, e) {
      for (let r of e.fields) !t.hasField(r.name) && !r.isRelation && t.addSuggestion(new ne(r.name, "true"));
    }
    __name(Ra, "Ra");
    function Sa(t, e) {
      for (let r of e) t.hasField(r.name) || t.addSuggestion(new ne(r.name, r.typeNames.join(" | ")));
    }
    __name(Sa, "Sa");
    function gi(t, e) {
      let [r, n] = Je(t), i = e.arguments.getDeepSubSelectionValue(r)?.asObject();
      if (!i) return { parentKind: "unknown", fieldName: n };
      let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), f2 = o?.getField(n);
      return o && f2 ? { parentKind: "select", parent: o, field: f2, fieldName: n } : (f2 = s?.getField(n), s && f2 ? { parentKind: "include", field: f2, parent: s, fieldName: n } : (f2 = a?.getField(n), a && f2 ? { parentKind: "omit", field: f2, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
    }
    __name(gi, "gi");
    function yi(t, e) {
      if (e.kind === "object") for (let r of e.fields) t.hasField(r.name) || t.addSuggestion(new ne(r.name, r.typeNames.join(" | ")));
    }
    __name(yi, "yi");
    function Je(t) {
      let e = [...t], r = e.pop();
      if (!r) throw new Error("unexpected empty path");
      return [e, r];
    }
    __name(Je, "Je");
    function pt({ green: t, enabled: e }) {
      return "Available options are " + (e ? `listed in ${t("green")}` : "marked with ?") + ".";
    }
    __name(pt, "pt");
    function Kt(t, e) {
      if (e.length === 1) return e[0];
      let r = [...e], n = r.pop();
      return `${r.join(", ")} ${t} ${n}`;
    }
    __name(Kt, "Kt");
    var Oa = 3;
    function ka(t, e) {
      let r = 1 / 0, n;
      for (let i of e) {
        let o = (0, mi.default)(t, i);
        o > Oa || o < r && (r = o, n = i);
      }
      return n;
    }
    __name(ka, "ka");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var dt = class {
      static {
        __name(this, "dt");
      }
      modelName;
      name;
      typeName;
      isList;
      isEnum;
      constructor(e, r, n, i, o) {
        this.modelName = e, this.name = r, this.typeName = n, this.isList = i, this.isEnum = o;
      }
      _toGraphQLInputType() {
        let e = this.isList ? "List" : "", r = this.isEnum ? "Enum" : "";
        return `${e}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
      }
    };
    function Ge(t) {
      return t instanceof dt;
    }
    __name(Ge, "Ge");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ht = Symbol();
    var $r = /* @__PURE__ */ new WeakMap();
    var Ee = class {
      static {
        __name(this, "Ee");
      }
      constructor(e) {
        e === Ht ? $r.set(this, `Prisma.${this._getName()}`) : $r.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
      }
      _getName() {
        return this.constructor.name;
      }
      toString() {
        return $r.get(this);
      }
    };
    var ft = class extends Ee {
      static {
        __name(this, "ft");
      }
      _getNamespace() {
        return "NullTypes";
      }
    };
    var gt = class extends ft {
      static {
        __name(this, "gt");
      }
      #e;
    };
    Qr(gt, "DbNull");
    var yt = class extends ft {
      static {
        __name(this, "yt");
      }
      #e;
    };
    Qr(yt, "JsonNull");
    var ht = class extends ft {
      static {
        __name(this, "ht");
      }
      #e;
    };
    Qr(ht, "AnyNull");
    var zt = { classes: { DbNull: gt, JsonNull: yt, AnyNull: ht }, instances: { DbNull: new gt(Ht), JsonNull: new yt(Ht), AnyNull: new ht(Ht) } };
    function Qr(t, e) {
      Object.defineProperty(t, "name", { value: e, configurable: true });
    }
    __name(Qr, "Qr");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var hi = ": ";
    var Yt = class {
      static {
        __name(this, "Yt");
      }
      constructor(e, r) {
        this.name = e;
        this.value = r;
      }
      hasError = false;
      markAsError() {
        this.hasError = true;
      }
      getPrintWidth() {
        return this.name.length + this.value.getPrintWidth() + hi.length;
      }
      write(e) {
        let r = new pe(this.name);
        this.hasError && r.underline().setColor(e.context.colors.red), e.write(r).write(hi).write(this.value);
      }
    };
    var Jr = class {
      static {
        __name(this, "Jr");
      }
      arguments;
      errorMessages = [];
      constructor(e) {
        this.arguments = e;
      }
      write(e) {
        e.write(this.arguments);
      }
      addErrorMessage(e) {
        this.errorMessages.push(e);
      }
      renderAllMessages(e) {
        return this.errorMessages.map((r) => r(e)).join(`
`);
      }
    };
    function We(t) {
      return new Jr(bi(t));
    }
    __name(We, "We");
    function bi(t) {
      let e = new Qe();
      for (let [r, n] of Object.entries(t)) {
        let i = new Yt(r, wi(n));
        e.addField(i);
      }
      return e;
    }
    __name(bi, "bi");
    function wi(t) {
      if (typeof t == "string") return new W(JSON.stringify(t));
      if (typeof t == "number" || typeof t == "boolean") return new W(String(t));
      if (typeof t == "bigint") return new W(`${t}n`);
      if (t === null) return new W("null");
      if (t === void 0) return new W("undefined");
      if (Be(t)) return new W(`new Prisma.Decimal("${t.toFixed()}")`);
      if (t instanceof Uint8Array) return b2.isBuffer(t) ? new W(`Buffer.alloc(${t.byteLength})`) : new W(`new Uint8Array(${t.byteLength})`);
      if (t instanceof Date) {
        let e = jt(t) ? t.toISOString() : "Invalid Date";
        return new W(`new Date("${e}")`);
      }
      return t instanceof Ee ? new W(`Prisma.${t._getName()}`) : Ge(t) ? new W(`prisma.${ve(t.modelName)}.$fields.${t.name}`) : Array.isArray(t) ? Da(t) : typeof t == "object" ? bi(t) : new W(Object.prototype.toString.call(t));
    }
    __name(wi, "wi");
    function Da(t) {
      let e = new $e();
      for (let r of t) e.addItem(wi(r));
      return e;
    }
    __name(Da, "Da");
    function Xt(t, e) {
      let r = e === "pretty" ? ci : Wt, n = t.renderAllMessages(r), i = new Ve(0, { colors: r }).write(t).toString();
      return { message: n, args: i };
    }
    __name(Xt, "Xt");
    function Zt({ args: t, errors: e, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
      let a = We(t);
      for (let A of e) Qt(A, a, s);
      let { message: f2, args: h } = Xt(a, r), C = $t({ message: f2, callsite: n, originalMethod: i, showColors: r === "pretty", callArguments: h });
      throw new K(C, { clientVersion: o });
    }
    __name(Zt, "Zt");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function de(t) {
      return t.replace(/^./, (e) => e.toLowerCase());
    }
    __name(de, "de");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Ei(t, e, r) {
      let n = de(r);
      return !e.result || !(e.result.$allModels || e.result[n]) ? t : Ia({ ...t, ...xi(e.name, t, e.result.$allModels), ...xi(e.name, t, e.result[n]) });
    }
    __name(Ei, "Ei");
    function Ia(t) {
      let e = new me(), r = /* @__PURE__ */ __name((n, i) => e.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), t[n] ? t[n].needs.flatMap((o) => r(o, i)) : [n])), "r");
      return Vt(t, (n) => ({ ...n, needs: r(n.name, /* @__PURE__ */ new Set()) }));
    }
    __name(Ia, "Ia");
    function xi(t, e, r) {
      return r ? Vt(r, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: Ma(e, o, i) })) : {};
    }
    __name(xi, "xi");
    function Ma(t, e, r) {
      let n = t?.[e]?.compute;
      return n ? (i) => r({ ...i, [e]: n(i) }) : r;
    }
    __name(Ma, "Ma");
    function Pi(t, e) {
      if (!e) return t;
      let r = { ...t };
      for (let n of Object.values(e)) if (t[n.name]) for (let i of n.needs) r[i] = true;
      return r;
    }
    __name(Pi, "Pi");
    function vi(t, e) {
      if (!e) return t;
      let r = { ...t };
      for (let n of Object.values(e)) if (!t[n.name]) for (let i of n.needs) delete r[i];
      return r;
    }
    __name(vi, "vi");
    var er = class {
      static {
        __name(this, "er");
      }
      constructor(e, r) {
        this.extension = e;
        this.previous = r;
      }
      computedFieldsCache = new me();
      modelExtensionsCache = new me();
      queryCallbacksCache = new me();
      clientExtensions = lt(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
      batchCallbacks = lt(() => {
        let e = this.previous?.getAllBatchQueryCallbacks() ?? [], r = this.extension.query?.$__internalBatch;
        return r ? e.concat(r) : e;
      });
      getAllComputedFields(e) {
        return this.computedFieldsCache.getOrCreate(e, () => Ei(this.previous?.getAllComputedFields(e), this.extension, e));
      }
      getAllClientExtensions() {
        return this.clientExtensions.get();
      }
      getAllModelExtensions(e) {
        return this.modelExtensionsCache.getOrCreate(e, () => {
          let r = de(e);
          return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(e) : { ...this.previous?.getAllModelExtensions(e), ...this.extension.model.$allModels, ...this.extension.model[r] };
        });
      }
      getAllQueryCallbacks(e, r) {
        return this.queryCallbacksCache.getOrCreate(`${e}:${r}`, () => {
          let n = this.previous?.getAllQueryCallbacks(e, r) ?? [], i = [], o = this.extension.query;
          return !o || !(o[e] || o.$allModels || o[r] || o.$allOperations) ? n : (o[e] !== void 0 && (o[e][r] !== void 0 && i.push(o[e][r]), o[e].$allOperations !== void 0 && i.push(o[e].$allOperations)), e !== "$none" && o.$allModels !== void 0 && (o.$allModels[r] !== void 0 && i.push(o.$allModels[r]), o.$allModels.$allOperations !== void 0 && i.push(o.$allModels.$allOperations)), o[r] !== void 0 && i.push(o[r]), o.$allOperations !== void 0 && i.push(o.$allOperations), n.concat(i));
        });
      }
      getAllBatchQueryCallbacks() {
        return this.batchCallbacks.get();
      }
    };
    var Ke = class t {
      static {
        __name(this, "t");
      }
      constructor(e) {
        this.head = e;
      }
      static empty() {
        return new t();
      }
      static single(e) {
        return new t(new er(e));
      }
      isEmpty() {
        return this.head === void 0;
      }
      append(e) {
        return new t(new er(e, this.head));
      }
      getAllComputedFields(e) {
        return this.head?.getAllComputedFields(e);
      }
      getAllClientExtensions() {
        return this.head?.getAllClientExtensions();
      }
      getAllModelExtensions(e) {
        return this.head?.getAllModelExtensions(e);
      }
      getAllQueryCallbacks(e, r) {
        return this.head?.getAllQueryCallbacks(e, r) ?? [];
      }
      getAllBatchQueryCallbacks() {
        return this.head?.getAllBatchQueryCallbacks() ?? [];
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    var tr = class {
      static {
        __name(this, "tr");
      }
      constructor(e) {
        this.name = e;
      }
    };
    function Ti(t) {
      return t instanceof tr;
    }
    __name(Ti, "Ti");
    function Ci(t) {
      return new tr(t);
    }
    __name(Ci, "Ci");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ai = Symbol();
    var bt = class {
      static {
        __name(this, "bt");
      }
      constructor(e) {
        if (e !== Ai) throw new Error("Skip instance can not be constructed directly");
      }
      ifUndefined(e) {
        return e === void 0 ? rr : e;
      }
    };
    var rr = new bt(Ai);
    function fe(t) {
      return t instanceof bt;
    }
    __name(fe, "fe");
    var _a = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
    var Ri = "explicitly `undefined` values are not allowed";
    function nr({ modelName: t, action: e, args: r, runtimeDataModel: n, extensions: i = Ke.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: f2, previewFeatures: h, globalOmit: C }) {
      let A = new Gr({ runtimeDataModel: n, modelName: t, action: e, rootArgs: r, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: f2, previewFeatures: h, globalOmit: C });
      return { modelName: t, action: _a[e], query: wt(r, A) };
    }
    __name(nr, "nr");
    function wt({ select: t, include: e, ...r } = {}, n) {
      let i = r.omit;
      return delete r.omit, { arguments: Oi(r, n), selection: La(t, e, i, n) };
    }
    __name(wt, "wt");
    function La(t, e, r, n) {
      return t ? (e ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), qa(t, n)) : Fa(n, e, r);
    }
    __name(La, "La");
    function Fa(t, e, r) {
      let n = {};
      return t.modelOrType && !t.isRawAction() && (n.$composites = true, n.$scalars = true), e && Ua(n, e, t), Na(n, r, t), n;
    }
    __name(Fa, "Fa");
    function Ua(t, e, r) {
      for (let [n, i] of Object.entries(e)) {
        if (fe(i)) continue;
        let o = r.nestSelection(n);
        if (Wr(i, o), i === false || i === void 0) {
          t[n] = false;
          continue;
        }
        let s = r.findField(n);
        if (s && s.kind !== "object" && r.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r.getSelectionPath().concat(n), outputType: r.getOutputTypeDescription() }), s) {
          t[n] = wt(i === true ? {} : i, o);
          continue;
        }
        if (i === true) {
          t[n] = true;
          continue;
        }
        t[n] = wt(i, o);
      }
    }
    __name(Ua, "Ua");
    function Na(t, e, r) {
      let n = r.getComputedFields(), i = { ...r.getGlobalOmit(), ...e }, o = vi(i, n);
      for (let [s, a] of Object.entries(o)) {
        if (fe(a)) continue;
        Wr(a, r.nestSelection(s));
        let f2 = r.findField(s);
        n?.[s] && !f2 || (t[s] = !a);
      }
    }
    __name(Na, "Na");
    function qa(t, e) {
      let r = {}, n = e.getComputedFields(), i = Pi(t, n);
      for (let [o, s] of Object.entries(i)) {
        if (fe(s)) continue;
        let a = e.nestSelection(o);
        Wr(s, a);
        let f2 = e.findField(o);
        if (!(n?.[o] && !f2)) {
          if (s === false || s === void 0 || fe(s)) {
            r[o] = false;
            continue;
          }
          if (s === true) {
            f2?.kind === "object" ? r[o] = wt({}, a) : r[o] = true;
            continue;
          }
          r[o] = wt(s, a);
        }
      }
      return r;
    }
    __name(qa, "qa");
    function Si(t, e) {
      if (t === null) return null;
      if (typeof t == "string" || typeof t == "number" || typeof t == "boolean") return t;
      if (typeof t == "bigint") return { $type: "BigInt", value: String(t) };
      if (qe(t)) {
        if (jt(t)) return { $type: "DateTime", value: t.toISOString() };
        e.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: e.getSelectionPath(), argumentPath: e.getArgumentPath(), argument: { name: e.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
      }
      if (Ti(t)) return { $type: "Param", value: t.name };
      if (Ge(t)) return { $type: "FieldRef", value: { _ref: t.name, _container: t.modelName } };
      if (Array.isArray(t)) return Ba(t, e);
      if (ArrayBuffer.isView(t)) {
        let { buffer: r, byteOffset: n, byteLength: i } = t;
        return { $type: "Bytes", value: b2.from(r, n, i).toString("base64") };
      }
      if (Va(t)) return t.values;
      if (Be(t)) return { $type: "Decimal", value: t.toFixed() };
      if (t instanceof Ee) {
        if (t !== zt.instances[t._getName()]) throw new Error("Invalid ObjectEnumValue");
        return { $type: "Enum", value: t._getName() };
      }
      if (ja(t)) return t.toJSON();
      if (typeof t == "object") return Oi(t, e);
      e.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: e.getSelectionPath(), argumentPath: e.getArgumentPath(), argument: { name: e.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(t)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
    }
    __name(Si, "Si");
    function Oi(t, e) {
      if (t.$type) return { $type: "Raw", value: t };
      let r = {};
      for (let n in t) {
        let i = t[n], o = e.nestArgument(n);
        fe(i) || (i !== void 0 ? r[n] = Si(i, o) : e.isPreviewFeatureOn("strictUndefinedChecks") && e.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: e.getSelectionPath(), argument: { name: e.getArgumentName(), typeNames: [] }, underlyingError: Ri }));
      }
      return r;
    }
    __name(Oi, "Oi");
    function Ba(t, e) {
      let r = [];
      for (let n = 0; n < t.length; n++) {
        let i = e.nestArgument(String(n)), o = t[n];
        if (o === void 0 || fe(o)) {
          let s = o === void 0 ? "undefined" : "Prisma.skip";
          e.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${e.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
        }
        r.push(Si(o, i));
      }
      return r;
    }
    __name(Ba, "Ba");
    function Va(t) {
      return typeof t == "object" && t !== null && t.__prismaRawParameters__ === true;
    }
    __name(Va, "Va");
    function ja(t) {
      return typeof t == "object" && t !== null && typeof t.toJSON == "function";
    }
    __name(ja, "ja");
    function Wr(t, e) {
      t === void 0 && e.isPreviewFeatureOn("strictUndefinedChecks") && e.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: e.getSelectionPath(), underlyingError: Ri });
    }
    __name(Wr, "Wr");
    var Gr = class t {
      static {
        __name(this, "t");
      }
      constructor(e) {
        this.params = e;
        this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
      }
      modelOrType;
      throwValidationError(e) {
        Zt({ errors: [e], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
      }
      getSelectionPath() {
        return this.params.selectionPath;
      }
      getArgumentPath() {
        return this.params.argumentPath;
      }
      getArgumentName() {
        return this.params.argumentPath[this.params.argumentPath.length - 1];
      }
      getOutputTypeDescription() {
        if (!(!this.params.modelName || !this.modelOrType)) return { name: this.params.modelName, fields: this.modelOrType.fields.map((e) => ({ name: e.name, typeName: "boolean", isRelation: e.kind === "object" })) };
      }
      isRawAction() {
        return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
      }
      isPreviewFeatureOn(e) {
        return this.params.previewFeatures.includes(e);
      }
      getComputedFields() {
        if (this.params.modelName) return this.params.extensions.getAllComputedFields(this.params.modelName);
      }
      findField(e) {
        return this.modelOrType?.fields.find((r) => r.name === e);
      }
      nestSelection(e) {
        let r = this.findField(e), n = r?.kind === "object" ? r.type : void 0;
        return new t({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(e) });
      }
      getGlobalOmit() {
        return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[ve(this.params.modelName)] ?? {} : {};
      }
      shouldApplyGlobalOmit() {
        switch (this.params.action) {
          case "findFirst":
          case "findFirstOrThrow":
          case "findUniqueOrThrow":
          case "findMany":
          case "upsert":
          case "findUnique":
          case "createManyAndReturn":
          case "create":
          case "update":
          case "updateManyAndReturn":
          case "delete":
            return true;
          case "executeRaw":
          case "aggregateRaw":
          case "runCommandRaw":
          case "findRaw":
          case "createMany":
          case "deleteMany":
          case "groupBy":
          case "updateMany":
          case "count":
          case "aggregate":
          case "queryRaw":
            return false;
          default:
            Ie(this.params.action, "Unknown action");
        }
      }
      nestArgument(e) {
        return new t({ ...this.params, argumentPath: this.params.argumentPath.concat(e) });
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ki(t) {
      if (!t._hasPreviewFlag("metrics")) throw new K("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: t._clientVersion });
    }
    __name(ki, "ki");
    var He = class {
      static {
        __name(this, "He");
      }
      _client;
      constructor(e) {
        this._client = e;
      }
      prometheus(e) {
        return ki(this._client), this._client._engine.metrics({ format: "prometheus", ...e });
      }
      json(e) {
        return ki(this._client), this._client._engine.metrics({ format: "json", ...e });
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Di(t, e) {
      let r = lt(() => $a(e));
      Object.defineProperty(t, "dmmf", { get: /* @__PURE__ */ __name(() => r.get(), "get") });
    }
    __name(Di, "Di");
    function $a(t) {
      throw new Error("Prisma.dmmf is not available when running in edge runtimes.");
    }
    __name($a, "$a");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Hr = /* @__PURE__ */ new WeakMap();
    var ir = "$$PrismaTypedSql";
    var xt = class {
      static {
        __name(this, "xt");
      }
      constructor(e, r) {
        Hr.set(this, { sql: e, values: r }), Object.defineProperty(this, ir, { value: ir });
      }
      get sql() {
        return Hr.get(this).sql;
      }
      get values() {
        return Hr.get(this).values;
      }
    };
    function Ii(t) {
      return (...e) => new xt(t, e);
    }
    __name(Ii, "Ii");
    function or(t) {
      return t != null && t[ir] === ir;
    }
    __name(or, "or");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Jo = kt(Mi());
    u();
    c();
    m();
    p2();
    d();
    l2();
    _i();
    Vn();
    Gn();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var ee = class t {
      static {
        __name(this, "t");
      }
      constructor(e, r) {
        if (e.length - 1 !== r.length) throw e.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${e.length} strings to have ${e.length - 1} values`);
        let n = r.reduce((s, a) => s + (a instanceof t ? a.values.length : 1), 0);
        this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = e[0];
        let i = 0, o = 0;
        for (; i < r.length; ) {
          let s = r[i++], a = e[i];
          if (s instanceof t) {
            this.strings[o] += s.strings[0];
            let f2 = 0;
            for (; f2 < s.values.length; ) this.values[o++] = s.values[f2++], this.strings[o] = s.strings[f2];
            this.strings[o] += a;
          } else this.values[o++] = s, this.strings[o] = a;
        }
      }
      get sql() {
        let e = this.strings.length, r = 1, n = this.strings[0];
        for (; r < e; ) n += `?${this.strings[r++]}`;
        return n;
      }
      get statement() {
        let e = this.strings.length, r = 1, n = this.strings[0];
        for (; r < e; ) n += `:${r}${this.strings[r++]}`;
        return n;
      }
      get text() {
        let e = this.strings.length, r = 1, n = this.strings[0];
        for (; r < e; ) n += `$${r}${this.strings[r++]}`;
        return n;
      }
      inspect() {
        return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
      }
    };
    function Li(t, e = ",", r = "", n = "") {
      if (t.length === 0) throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
      return new ee([r, ...Array(t.length - 1).fill(e), n], t);
    }
    __name(Li, "Li");
    function zr(t) {
      return new ee([t], []);
    }
    __name(zr, "zr");
    var Fi = zr("");
    function Yr(t, ...e) {
      return new ee(t, e);
    }
    __name(Yr, "Yr");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Et(t) {
      return { getKeys() {
        return Object.keys(t);
      }, getPropertyValue(e) {
        return t[e];
      } };
    }
    __name(Et, "Et");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function H(t, e) {
      return { getKeys() {
        return [t];
      }, getPropertyValue() {
        return e();
      } };
    }
    __name(H, "H");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Me(t) {
      let e = new me();
      return { getKeys() {
        return t.getKeys();
      }, getPropertyValue(r) {
        return e.getOrCreate(r, () => t.getPropertyValue(r));
      }, getPropertyDescriptor(r) {
        return t.getPropertyDescriptor?.(r);
      } };
    }
    __name(Me, "Me");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var ar = { enumerable: true, configurable: true, writable: true };
    function lr(t) {
      let e = new Set(t);
      return { getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf"), getOwnPropertyDescriptor: /* @__PURE__ */ __name(() => ar, "getOwnPropertyDescriptor"), has: /* @__PURE__ */ __name((r, n) => e.has(n), "has"), set: /* @__PURE__ */ __name((r, n, i) => e.add(n) && Reflect.set(r, n, i), "set"), ownKeys: /* @__PURE__ */ __name(() => [...e], "ownKeys") };
    }
    __name(lr, "lr");
    var Ui = Symbol.for("nodejs.util.inspect.custom");
    function ae(t, e) {
      let r = Ja(e), n = /* @__PURE__ */ new Set(), i = new Proxy(t, { get(o, s) {
        if (n.has(s)) return o[s];
        let a = r.get(s);
        return a ? a.getPropertyValue(s) : o[s];
      }, has(o, s) {
        if (n.has(s)) return true;
        let a = r.get(s);
        return a ? a.has?.(s) ?? true : Reflect.has(o, s);
      }, ownKeys(o) {
        let s = Ni(Reflect.ownKeys(o), r), a = Ni(Array.from(r.keys()), r);
        return [.../* @__PURE__ */ new Set([...s, ...a, ...n])];
      }, set(o, s, a) {
        return r.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
      }, getOwnPropertyDescriptor(o, s) {
        let a = Reflect.getOwnPropertyDescriptor(o, s);
        if (a && !a.configurable) return a;
        let f2 = r.get(s);
        return f2 ? f2.getPropertyDescriptor ? { ...ar, ...f2?.getPropertyDescriptor(s) } : ar : a;
      }, defineProperty(o, s, a) {
        return n.add(s), Reflect.defineProperty(o, s, a);
      }, getPrototypeOf: /* @__PURE__ */ __name(() => Object.prototype, "getPrototypeOf") });
      return i[Ui] = function() {
        let o = { ...this };
        return delete o[Ui], o;
      }, i;
    }
    __name(ae, "ae");
    function Ja(t) {
      let e = /* @__PURE__ */ new Map();
      for (let r of t) {
        let n = r.getKeys();
        for (let i of n) e.set(i, r);
      }
      return e;
    }
    __name(Ja, "Ja");
    function Ni(t, e) {
      return t.filter((r) => e.get(r)?.has?.(r) ?? true);
    }
    __name(Ni, "Ni");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ze(t) {
      return { getKeys() {
        return t;
      }, has() {
        return false;
      }, getPropertyValue() {
      } };
    }
    __name(ze, "ze");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ur(t, e) {
      return { batch: t, transaction: e?.kind === "batch" ? { isolationLevel: e.options.isolationLevel } : void 0 };
    }
    __name(ur, "ur");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function qi(t) {
      if (t === void 0) return "";
      let e = We(t);
      return new Ve(0, { colors: Wt }).write(e).toString();
    }
    __name(qi, "qi");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ga = "P2037";
    function cr({ error: t, user_facing_error: e }, r, n) {
      return e.error_code ? new Z(Wa(e, n), { code: e.error_code, clientVersion: r, meta: e.meta, batchRequestIdx: e.batch_request_idx }) : new Q(t, { clientVersion: r, batchRequestIdx: e.batch_request_idx });
    }
    __name(cr, "cr");
    function Wa(t, e) {
      let r = t.message;
      return (e === "postgresql" || e === "postgres" || e === "mysql") && t.error_code === Ga && (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r;
    }
    __name(Wa, "Wa");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Xr = class {
      static {
        __name(this, "Xr");
      }
      getLocation() {
        return null;
      }
    };
    function Ce(t) {
      return typeof $EnabledCallSite == "function" && t !== "minimal" ? new $EnabledCallSite() : new Xr();
    }
    __name(Ce, "Ce");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Bi = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
    function Ye(t = {}) {
      let e = Ha(t);
      return Object.entries(e).reduce((n, [i, o]) => (Bi[i] !== void 0 ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
    }
    __name(Ye, "Ye");
    function Ha(t = {}) {
      return typeof t._count == "boolean" ? { ...t, _count: { _all: t._count } } : t;
    }
    __name(Ha, "Ha");
    function mr(t = {}) {
      return (e) => (typeof t._count == "boolean" && (e._count = e._count._all), e);
    }
    __name(mr, "mr");
    function Vi(t, e) {
      let r = mr(t);
      return e({ action: "aggregate", unpacker: r, argsMapper: Ye })(t);
    }
    __name(Vi, "Vi");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function za(t = {}) {
      let { select: e, ...r } = t;
      return typeof e == "object" ? Ye({ ...r, _count: e }) : Ye({ ...r, _count: { _all: true } });
    }
    __name(za, "za");
    function Ya(t = {}) {
      return typeof t.select == "object" ? (e) => mr(t)(e)._count : (e) => mr(t)(e)._count._all;
    }
    __name(Ya, "Ya");
    function ji(t, e) {
      return e({ action: "count", unpacker: Ya(t), argsMapper: za })(t);
    }
    __name(ji, "ji");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Xa(t = {}) {
      let e = Ye(t);
      if (Array.isArray(e.by)) for (let r of e.by) typeof r == "string" && (e.select[r] = true);
      else typeof e.by == "string" && (e.select[e.by] = true);
      return e;
    }
    __name(Xa, "Xa");
    function Za(t = {}) {
      return (e) => (typeof t?._count == "boolean" && e.forEach((r) => {
        r._count = r._count._all;
      }), e);
    }
    __name(Za, "Za");
    function $i(t, e) {
      return e({ action: "groupBy", unpacker: Za(t), argsMapper: Xa })(t);
    }
    __name($i, "$i");
    function Qi(t, e, r) {
      if (e === "aggregate") return (n) => Vi(n, r);
      if (e === "count") return (n) => ji(n, r);
      if (e === "groupBy") return (n) => $i(n, r);
    }
    __name(Qi, "Qi");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Ji(t, e) {
      let r = e.fields.filter((i) => !i.relationName), n = ti(r, "name");
      return new Proxy({}, { get(i, o) {
        if (o in i || typeof o == "symbol") return i[o];
        let s = n[o];
        if (s) return new dt(t, o, s.type, s.isList, s.kind === "enum");
      }, ...lr(Object.keys(n)) });
    }
    __name(Ji, "Ji");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Gi = /* @__PURE__ */ __name((t) => Array.isArray(t) ? t : t.split("."), "Gi");
    var Zr = /* @__PURE__ */ __name((t, e) => Gi(e).reduce((r, n) => r && r[n], t), "Zr");
    var Wi = /* @__PURE__ */ __name((t, e, r) => Gi(e).reduceRight((n, i, o, s) => Object.assign({}, Zr(t, s.slice(0, o)), { [i]: n }), r), "Wi");
    function el(t, e) {
      return t === void 0 || e === void 0 ? [] : [...e, "select", t];
    }
    __name(el, "el");
    function tl(t, e, r) {
      return e === void 0 ? t ?? {} : Wi(e, r, t || true);
    }
    __name(tl, "tl");
    function en(t, e, r, n, i, o) {
      let a = t._runtimeDataModel.models[e].fields.reduce((f2, h) => ({ ...f2, [h.name]: h }), {});
      return (f2) => {
        let h = Ce(t._errorFormat), C = el(n, i), A = tl(f2, o, C), k2 = r({ dataPath: C, callsite: h })(A), R = rl(t, e);
        return new Proxy(k2, { get(_, O) {
          if (!R.includes(O)) return _[O];
          let ye = [a[O].type, r, O], z = [C, A];
          return en(t, ...ye, ...z);
        }, ...lr([...R, ...Object.getOwnPropertyNames(k2)]) });
      };
    }
    __name(en, "en");
    function rl(t, e) {
      return t._runtimeDataModel.models[e].fields.filter((r) => r.kind === "object").map((r) => r.name);
    }
    __name(rl, "rl");
    var nl = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
    var il = ["aggregate", "count", "groupBy"];
    function tn(t, e) {
      let r = t._extensions.getAllModelExtensions(e) ?? {}, n = [ol(t, e), al(t, e), Et(r), H("name", () => e), H("$name", () => e), H("$parent", () => t._appliedParent)];
      return ae({}, n);
    }
    __name(tn, "tn");
    function ol(t, e) {
      let r = de(e), n = Object.keys(ut).concat("count");
      return { getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = i, s = /* @__PURE__ */ __name((a) => (f2) => {
          let h = Ce(t._errorFormat);
          return t._createPrismaPromise((C) => {
            let A = { args: f2, dataPath: [], action: o, model: e, clientMethod: `${r}.${i}`, jsModelName: r, transaction: C, callsite: h };
            return t._request({ ...A, ...a });
          }, { action: o, args: f2, model: e });
        }, "s");
        return nl.includes(o) ? en(t, e, s) : sl(i) ? Qi(t, i, s) : s({});
      } };
    }
    __name(ol, "ol");
    function sl(t) {
      return il.includes(t);
    }
    __name(sl, "sl");
    function al(t, e) {
      return Me(H("fields", () => {
        let r = t._runtimeDataModel.models[e];
        return Ji(e, r);
      }));
    }
    __name(al, "al");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Ki(t) {
      return t.replace(/^./, (e) => e.toUpperCase());
    }
    __name(Ki, "Ki");
    var rn = Symbol();
    function Pt(t) {
      let e = [ll(t), ul(t), H(rn, () => t), H("$parent", () => t._appliedParent)], r = t._extensions.getAllClientExtensions();
      return r && e.push(Et(r)), ae(t, e);
    }
    __name(Pt, "Pt");
    function ll(t) {
      let e = Object.getPrototypeOf(t._originalClient), r = [...new Set(Object.getOwnPropertyNames(e))];
      return { getKeys() {
        return r;
      }, getPropertyValue(n) {
        return t[n];
      } };
    }
    __name(ll, "ll");
    function ul(t) {
      let e = Object.keys(t._runtimeDataModel.models), r = e.map(de), n = [...new Set(e.concat(r))];
      return Me({ getKeys() {
        return n;
      }, getPropertyValue(i) {
        let o = Ki(i);
        if (t._runtimeDataModel.models[o] !== void 0) return tn(t, o);
        if (t._runtimeDataModel.models[i] !== void 0) return tn(t, i);
      }, getPropertyDescriptor(i) {
        if (!r.includes(i)) return { enumerable: false };
      } });
    }
    __name(ul, "ul");
    function Hi(t) {
      return t[rn] ? t[rn] : t;
    }
    __name(Hi, "Hi");
    function zi(t) {
      if (typeof t == "function") return t(this);
      if (t.client?.__AccelerateEngine) {
        let r = t.client.__AccelerateEngine;
        this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
      }
      let e = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(t) }, _appliedParent: { value: this, configurable: true }, $on: { value: void 0 } });
      return Pt(e);
    }
    __name(zi, "zi");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Yi({ result: t, modelName: e, select: r, omit: n, extensions: i }) {
      let o = i.getAllComputedFields(e);
      if (!o) return t;
      let s = [], a = [];
      for (let f2 of Object.values(o)) {
        if (n) {
          if (n[f2.name]) continue;
          let h = f2.needs.filter((C) => n[C]);
          h.length > 0 && a.push(ze(h));
        } else if (r) {
          if (!r[f2.name]) continue;
          let h = f2.needs.filter((C) => !r[C]);
          h.length > 0 && a.push(ze(h));
        }
        cl(t, f2.needs) && s.push(ml(f2, ae(t, s)));
      }
      return s.length > 0 || a.length > 0 ? ae(t, [...s, ...a]) : t;
    }
    __name(Yi, "Yi");
    function cl(t, e) {
      return e.every((r) => Nr(t, r));
    }
    __name(cl, "cl");
    function ml(t, e) {
      return Me(H(t.name, () => t.compute(e)));
    }
    __name(ml, "ml");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function pr({ visitor: t, result: e, args: r, runtimeDataModel: n, modelName: i }) {
      if (Array.isArray(e)) {
        for (let s = 0; s < e.length; s++) e[s] = pr({ result: e[s], args: r, modelName: i, runtimeDataModel: n, visitor: t });
        return e;
      }
      let o = t(e, i, r) ?? e;
      return r.include && Xi({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: t }), r.select && Xi({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: t }), o;
    }
    __name(pr, "pr");
    function Xi({ includeOrSelect: t, result: e, parentModelName: r, runtimeDataModel: n, visitor: i }) {
      for (let [o, s] of Object.entries(t)) {
        if (!s || e[o] == null || fe(s)) continue;
        let f2 = n.models[r].fields.find((C) => C.name === o);
        if (!f2 || f2.kind !== "object" || !f2.relationName) continue;
        let h = typeof s == "object" ? s : {};
        e[o] = pr({ visitor: i, result: e[o], args: h, modelName: f2.type, runtimeDataModel: n });
      }
    }
    __name(Xi, "Xi");
    function Zi({ result: t, modelName: e, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
      return n.isEmpty() || t == null || typeof t != "object" || !i.models[e] ? t : pr({ result: t, args: r ?? {}, modelName: e, runtimeDataModel: i, visitor: /* @__PURE__ */ __name((a, f2, h) => {
        let C = de(f2);
        return Yi({ result: a, modelName: C, select: h.select, omit: h.select ? void 0 : { ...o?.[C], ...h.omit }, extensions: n });
      }, "visitor") });
    }
    __name(Zi, "Zi");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var pl = ["$connect", "$disconnect", "$on", "$transaction", "$extends"];
    var eo = pl;
    function to(t) {
      if (t instanceof ee) return dl(t);
      if (or(t)) return fl(t);
      if (Array.isArray(t)) {
        let r = [t[0]];
        for (let n = 1; n < t.length; n++) r[n] = vt(t[n]);
        return r;
      }
      let e = {};
      for (let r in t) e[r] = vt(t[r]);
      return e;
    }
    __name(to, "to");
    function dl(t) {
      return new ee(t.strings, t.values);
    }
    __name(dl, "dl");
    function fl(t) {
      return new xt(t.sql, t.values);
    }
    __name(fl, "fl");
    function vt(t) {
      if (typeof t != "object" || t == null || t instanceof Ee || Ge(t)) return t;
      if (Be(t)) return new be(t.toFixed());
      if (qe(t)) return /* @__PURE__ */ new Date(+t);
      if (ArrayBuffer.isView(t)) return t.slice(0);
      if (Array.isArray(t)) {
        let e = t.length, r;
        for (r = Array(e); e--; ) r[e] = vt(t[e]);
        return r;
      }
      if (typeof t == "object") {
        let e = {};
        for (let r in t) r === "__proto__" ? Object.defineProperty(e, r, { value: vt(t[r]), configurable: true, enumerable: true, writable: true }) : e[r] = vt(t[r]);
        return e;
      }
      Ie(t, "Unknown value");
    }
    __name(vt, "vt");
    function no(t, e, r, n = 0) {
      return t._createPrismaPromise((i) => {
        let o = e.customDataProxyFetch;
        return "transaction" in e && i !== void 0 && (e.transaction?.kind === "batch" && e.transaction.lock.then(), e.transaction = i), n === r.length ? t._executeRequest(e) : r[n]({ model: e.model, operation: e.model ? e.action : e.clientMethod, args: to(e.args ?? {}), __internalParams: e, query: /* @__PURE__ */ __name((s, a = e) => {
          let f2 = a.customDataProxyFetch;
          return a.customDataProxyFetch = ao(o, f2), a.args = s, no(t, a, r, n + 1);
        }, "query") });
      });
    }
    __name(no, "no");
    function io(t, e) {
      let { jsModelName: r, action: n, clientMethod: i } = e, o = r ? n : i;
      if (t._extensions.isEmpty()) return t._executeRequest(e);
      let s = t._extensions.getAllQueryCallbacks(r ?? "$none", o);
      return no(t, e, s);
    }
    __name(io, "io");
    function oo(t) {
      return (e) => {
        let r = { requests: e }, n = e[0].extensions.getAllBatchQueryCallbacks();
        return n.length ? so(r, n, 0, t) : t(r);
      };
    }
    __name(oo, "oo");
    function so(t, e, r, n) {
      if (r === e.length) return n(t);
      let i = t.customDataProxyFetch, o = t.requests[0].transaction;
      return e[r]({ args: { queries: t.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : void 0 } : void 0 }, __internalParams: t, query(s, a = t) {
        let f2 = a.customDataProxyFetch;
        return a.customDataProxyFetch = ao(i, f2), so(a, e, r + 1, n);
      } });
    }
    __name(so, "so");
    var ro = /* @__PURE__ */ __name((t) => t, "ro");
    function ao(t = ro, e = ro) {
      return (r) => t(e(r));
    }
    __name(ao, "ao");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var lo = G("prisma:client");
    var uo = { Vercel: "vercel", "Netlify CI": "netlify" };
    function co({ postinstall: t, ciName: e, clientVersion: r, generator: n }) {
      if (lo("checkPlatformCaching:postinstall", t), lo("checkPlatformCaching:ciName", e), t === true && !(n?.output && typeof (n.output.fromEnvVar ?? n.output.value) == "string") && e && e in uo) {
        let i = `Prisma has detected that this project was built on ${e}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${uo[e]}-build`;
        throw console.error(i), new I(i, r);
      }
    }
    __name(co, "co");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function mo(t, e) {
      return t ? t.datasources ? t.datasources : t.datasourceUrl ? { [e[0]]: { url: t.datasourceUrl } } : {} : {};
    }
    __name(mo, "mo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
    function po(t, e) {
      throw new Error(e);
    }
    __name(po, "po");
    function gl(t) {
      return t !== null && typeof t == "object" && typeof t.$type == "string";
    }
    __name(gl, "gl");
    function yl(t, e) {
      let r = {};
      for (let n of Object.keys(t)) r[n] = e(t[n], n);
      return r;
    }
    __name(yl, "yl");
    function Xe(t) {
      return t === null ? t : Array.isArray(t) ? t.map(Xe) : typeof t == "object" ? gl(t) ? hl(t) : t.constructor !== null && t.constructor.name !== "Object" ? t : yl(t, Xe) : t;
    }
    __name(Xe, "Xe");
    function hl({ $type: t, value: e }) {
      switch (t) {
        case "BigInt":
          return BigInt(e);
        case "Bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = b2.from(e, "base64");
          return new Uint8Array(r, n, i);
        }
        case "DateTime":
          return new Date(e);
        case "Decimal":
          return new v(e);
        case "Json":
          return JSON.parse(e);
        default:
          po(e, "Unknown tagged value");
      }
    }
    __name(hl, "hl");
    var fo = "6.18.0";
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var wl = /* @__PURE__ */ __name(() => globalThis.process?.release?.name === "node", "wl");
    var xl = /* @__PURE__ */ __name(() => !!globalThis.Bun || !!globalThis.process?.versions?.bun, "xl");
    var El = /* @__PURE__ */ __name(() => !!globalThis.Deno, "El");
    var Pl = /* @__PURE__ */ __name(() => typeof globalThis.Netlify == "object", "Pl");
    var vl = /* @__PURE__ */ __name(() => typeof globalThis.EdgeRuntime == "object", "vl");
    var Tl = /* @__PURE__ */ __name(() => globalThis.navigator?.userAgent === "Cloudflare-Workers", "Tl");
    function Cl() {
      return [[Pl, "netlify"], [vl, "edge-light"], [Tl, "workerd"], [El, "deno"], [xl, "bun"], [wl, "node"]].flatMap((r) => r[0]() ? [r[1]] : []).at(0) ?? "";
    }
    __name(Cl, "Cl");
    var Al = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
    function Ze() {
      let t = Cl();
      return { id: t, prettyName: Al[t] || t, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(t) };
    }
    __name(Ze, "Ze");
    function dr({ inlineDatasources: t, overrideDatasources: e, env: r, clientVersion: n }) {
      let i, o = Object.keys(t)[0], s = t[o]?.url, a = e[o]?.url;
      if (o === void 0 ? i = void 0 : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = r[s.fromEnvVar]), s?.fromEnvVar !== void 0 && i === void 0) throw Ze().id === "workerd" ? new I(`error: Environment variable not found: ${s.fromEnvVar}.

In Cloudflare module Workers, environment variables are available only in the Worker's \`env\` parameter of \`fetch\`.
To solve this, provide the connection string directly: https://pris.ly/d/cloudflare-datasource-url`, n) : new I(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
      if (i === void 0) throw new I("error: Missing URL environment variable, value, or override.", n);
      return i;
    }
    __name(dr, "dr");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function go(t) {
      if (t?.kind === "itx") return t.options.id;
    }
    __name(go, "go");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var nn;
    var yo = { async loadLibrary(t) {
      let { clientVersion: e, adapter: r, engineWasm: n } = t;
      if (r === void 0) throw new I(`The \`adapter\` option for \`PrismaClient\` is required in this context (${Ze().prettyName})`, e);
      if (n === void 0) throw new I("WASM engine was unexpectedly `undefined`", e);
      nn === void 0 && (nn = (async () => {
        let o = await n.getRuntime(), s = await n.getQueryEngineWasmModule();
        if (s == null) throw new I("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", e);
        let a = { "./query_engine_bg.js": o }, f2 = new WebAssembly.Instance(s, a), h = f2.exports.__wbindgen_start;
        return o.__wbg_set_wasm(f2.exports), h(), o.QueryEngine;
      })());
      let i = await nn;
      return { debugPanic() {
        return Promise.reject("{}");
      }, dmmf() {
        return Promise.resolve("{}");
      }, version() {
        return { commit: "unknown", version: "unknown" };
      }, QueryEngine: i };
    } };
    var Rl = "P2036";
    var ge = G("prisma:client:libraryEngine");
    function Sl(t) {
      return t.item_type === "query" && "query" in t;
    }
    __name(Sl, "Sl");
    function Ol(t) {
      return "level" in t ? t.level === "error" && t.message === "PANIC" : false;
    }
    __name(Ol, "Ol");
    var oO = [...kr, "native"];
    var kl = 0xffffffffffffffffn;
    var on2 = 1n;
    function Dl() {
      let t = on2++;
      return on2 > kl && (on2 = 1n), t;
    }
    __name(Dl, "Dl");
    var Tt = class {
      static {
        __name(this, "Tt");
      }
      name = "LibraryEngine";
      engine;
      libraryInstantiationPromise;
      libraryStartingPromise;
      libraryStoppingPromise;
      libraryStarted;
      executingQueryPromise;
      config;
      QueryEngineConstructor;
      libraryLoader;
      library;
      logEmitter;
      libQueryEnginePath;
      binaryTarget;
      datasourceOverrides;
      datamodel;
      logQueries;
      logLevel;
      lastQuery;
      loggerRustPanic;
      tracingHelper;
      adapterPromise;
      versionInfo;
      constructor(e, r) {
        this.libraryLoader = r ?? yo, this.config = e, this.libraryStarted = false, this.logQueries = e.logQueries ?? false, this.logLevel = e.logLevel ?? "error", this.logEmitter = e.logEmitter, this.datamodel = e.inlineSchema, this.tracingHelper = e.tracingHelper, e.enableDebugLogs && (this.logLevel = "debug");
        let n = Object.keys(e.overrideDatasources)[0], i = e.overrideDatasources[n]?.url;
        n !== void 0 && i !== void 0 && (this.datasourceOverrides = { [n]: i }), this.libraryInstantiationPromise = this.instantiateLibrary();
      }
      wrapEngine(e) {
        return { applyPendingMigrations: e.applyPendingMigrations?.bind(e), commitTransaction: this.withRequestId(e.commitTransaction.bind(e)), connect: this.withRequestId(e.connect.bind(e)), disconnect: this.withRequestId(e.disconnect.bind(e)), metrics: e.metrics?.bind(e), query: this.withRequestId(e.query.bind(e)), rollbackTransaction: this.withRequestId(e.rollbackTransaction.bind(e)), sdlSchema: e.sdlSchema?.bind(e), startTransaction: this.withRequestId(e.startTransaction.bind(e)), trace: e.trace.bind(e), free: e.free?.bind(e) };
      }
      withRequestId(e) {
        return async (...r) => {
          let n = Dl().toString();
          try {
            return await e(...r, n);
          } finally {
            if (this.tracingHelper.isEnabled()) {
              let i = await this.engine?.trace(n);
              if (i) {
                let o = JSON.parse(i);
                this.tracingHelper.dispatchEngineSpans(o.spans);
              }
            }
          }
        };
      }
      async applyPendingMigrations() {
        throw new Error("Cannot call this method from this type of engine instance");
      }
      async transaction(e, r, n) {
        await this.start();
        let i = await this.adapterPromise, o = JSON.stringify(r), s;
        if (e === "start") {
          let f2 = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
          s = await this.engine?.startTransaction(f2, o);
        } else e === "commit" ? s = await this.engine?.commitTransaction(n.id, o) : e === "rollback" && (s = await this.engine?.rollbackTransaction(n.id, o));
        let a = this.parseEngineResponse(s);
        if (Il(a)) {
          let f2 = this.getExternalAdapterError(a, i?.errorRegistry);
          throw f2 ? f2.error : new Z(a.message, { code: a.error_code, clientVersion: this.config.clientVersion, meta: a.meta });
        } else if (typeof a.message == "string") throw new Q(a.message, { clientVersion: this.config.clientVersion });
        return a;
      }
      async instantiateLibrary() {
        if (ge("internalSetup"), this.libraryInstantiationPromise) return this.libraryInstantiationPromise;
        this.binaryTarget = await this.getCurrentBinaryTarget(), await this.tracingHelper.runInChildSpan("load_engine", () => this.loadEngine()), this.version();
      }
      async getCurrentBinaryTarget() {
      }
      parseEngineResponse(e) {
        if (!e) throw new Q("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
        try {
          return JSON.parse(e);
        } catch {
          throw new Q("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
        }
      }
      async loadEngine() {
        if (!this.engine) {
          this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
          try {
            let e = new w2(this);
            this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(qt));
            let r = await this.adapterPromise;
            r && ge("Using driver adapter: %O", r), this.engine = this.wrapEngine(new this.QueryEngineConstructor({ datamodel: this.datamodel, env: g.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json", enableTracing: this.tracingHelper.isEnabled() }, (n) => {
              e.deref()?.logger(n);
            }, r));
          } catch (e) {
            let r = e, n = this.parseInitError(r.message);
            throw typeof n == "string" ? r : new I(n.message, this.config.clientVersion, n.error_code);
          }
        }
      }
      logger(e) {
        let r = this.parseEngineResponse(e);
        r && (r.level = r?.level.toLowerCase() ?? "unknown", Sl(r) ? this.logEmitter.emit("query", { timestamp: /* @__PURE__ */ new Date(), query: r.query, params: r.params, duration: Number(r.duration_ms), target: r.module_path }) : (Ol(r), this.logEmitter.emit(r.level, { timestamp: /* @__PURE__ */ new Date(), message: r.message, target: r.module_path })));
      }
      parseInitError(e) {
        try {
          return JSON.parse(e);
        } catch {
        }
        return e;
      }
      parseRequestError(e) {
        try {
          return JSON.parse(e);
        } catch {
        }
        return e;
      }
      onBeforeExit() {
        throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
      }
      async start() {
        if (this.libraryInstantiationPromise || (this.libraryInstantiationPromise = this.instantiateLibrary()), await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise) return ge(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
        if (this.libraryStarted) return;
        let e = /* @__PURE__ */ __name(async () => {
          ge("library starting");
          try {
            let r = { traceparent: this.tracingHelper.getTraceParent() };
            await this.engine?.connect(JSON.stringify(r)), this.libraryStarted = true, this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(qt)), await this.adapterPromise, ge("library started");
          } catch (r) {
            let n = this.parseInitError(r.message);
            throw typeof n == "string" ? r : new I(n.message, this.config.clientVersion, n.error_code);
          } finally {
            this.libraryStartingPromise = void 0;
          }
        }, "e");
        return this.libraryStartingPromise = this.tracingHelper.runInChildSpan("connect", e), this.libraryStartingPromise;
      }
      async stop() {
        if (await this.libraryInstantiationPromise, await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise) return ge("library is already stopping"), this.libraryStoppingPromise;
        if (!this.libraryStarted) {
          await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0;
          return;
        }
        let e = /* @__PURE__ */ __name(async () => {
          await new Promise((n) => setImmediate(n)), ge("library stopping");
          let r = { traceparent: this.tracingHelper.getTraceParent() };
          await this.engine?.disconnect(JSON.stringify(r)), this.engine?.free && this.engine.free(), this.engine = void 0, this.libraryStarted = false, this.libraryStoppingPromise = void 0, this.libraryInstantiationPromise = void 0, await (await this.adapterPromise)?.dispose(), this.adapterPromise = void 0, ge("library stopped");
        }, "e");
        return this.libraryStoppingPromise = this.tracingHelper.runInChildSpan("disconnect", e), this.libraryStoppingPromise;
      }
      version() {
        return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
      }
      debugPanic(e) {
        return this.library?.debugPanic(e);
      }
      async request(e, { traceparent: r, interactiveTransaction: n }) {
        ge(`sending request, this.libraryStarted: ${this.libraryStarted}`);
        let i = JSON.stringify({ traceparent: r }), o = JSON.stringify(e);
        try {
          await this.start();
          let s = await this.adapterPromise;
          this.executingQueryPromise = this.engine?.query(o, i, n?.id), this.lastQuery = o;
          let a = this.parseEngineResponse(await this.executingQueryPromise);
          if (a.errors) throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], s?.errorRegistry) : new Q(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
          if (this.loggerRustPanic) throw this.loggerRustPanic;
          return { data: a };
        } catch (s) {
          if (s instanceof I) throw s;
          s.code === "GenericFailure" && s.message?.startsWith("PANIC:");
          let a = this.parseRequestError(s.message);
          throw typeof a == "string" ? s : new Q(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
        }
      }
      async requestBatch(e, { transaction: r, traceparent: n }) {
        ge("requestBatch");
        let i = ur(e, r);
        await this.start();
        let o = await this.adapterPromise;
        this.lastQuery = JSON.stringify(i), this.executingQueryPromise = this.engine?.query(this.lastQuery, JSON.stringify({ traceparent: n }), go(r));
        let s = await this.executingQueryPromise, a = this.parseEngineResponse(s);
        if (a.errors) throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], o?.errorRegistry) : new Q(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
        let { batchResult: f2, errors: h } = a;
        if (Array.isArray(f2)) return f2.map((C) => C.errors && C.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(C.errors[0], o?.errorRegistry) : { data: C });
        throw h && h.length === 1 ? new Error(h[0].error) : new Error(JSON.stringify(a));
      }
      buildQueryError(e, r) {
        e.user_facing_error.is_panic;
        let n = this.getExternalAdapterError(e.user_facing_error, r);
        return n ? n.error : cr(e, this.config.clientVersion, this.config.activeProvider);
      }
      getExternalAdapterError(e, r) {
        if (e.error_code === Rl && r) {
          let n = e.meta?.id;
          Bt(typeof n == "number", "Malformed external JS error received from the engine");
          let i = r.consumeError(n);
          return Bt(i, "External error with reported id was not registered"), i;
        }
      }
      async metrics(e) {
        await this.start();
        let r = await this.engine.metrics(JSON.stringify(e));
        return e.format === "prometheus" ? r : this.parseEngineResponse(r);
      }
    };
    function Il(t) {
      return typeof t == "object" && t !== null && t.error_code !== void 0;
    }
    __name(Il, "Il");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ct = "Accelerate has not been setup correctly. Make sure your client is using `.$extends(withAccelerate())`. See https://pris.ly/d/accelerate-getting-started";
    var fr = class {
      static {
        __name(this, "fr");
      }
      constructor(e) {
        this.config = e;
        this.resolveDatasourceUrl = this.config.accelerateUtils?.resolveDatasourceUrl, this.getBatchRequestPayload = this.config.accelerateUtils?.getBatchRequestPayload, this.prismaGraphQLToJSError = this.config.accelerateUtils?.prismaGraphQLToJSError, this.PrismaClientUnknownRequestError = this.config.accelerateUtils?.PrismaClientUnknownRequestError, this.PrismaClientInitializationError = this.config.accelerateUtils?.PrismaClientInitializationError, this.PrismaClientKnownRequestError = this.config.accelerateUtils?.PrismaClientKnownRequestError, this.debug = this.config.accelerateUtils?.debug, this.engineVersion = this.config.accelerateUtils?.engineVersion, this.clientVersion = this.config.accelerateUtils?.clientVersion;
      }
      name = "AccelerateEngine";
      resolveDatasourceUrl;
      getBatchRequestPayload;
      prismaGraphQLToJSError;
      PrismaClientUnknownRequestError;
      PrismaClientInitializationError;
      PrismaClientKnownRequestError;
      debug;
      engineVersion;
      clientVersion;
      onBeforeExit(e) {
      }
      async start() {
      }
      async stop() {
      }
      version(e) {
        return "unknown";
      }
      transaction(e, r, n) {
        throw new I(Ct, this.config.clientVersion);
      }
      metrics(e) {
        throw new I(Ct, this.config.clientVersion);
      }
      request(e, r) {
        throw new I(Ct, this.config.clientVersion);
      }
      requestBatch(e, r) {
        throw new I(Ct, this.config.clientVersion);
      }
      applyPendingMigrations() {
        throw new I(Ct, this.config.clientVersion);
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    function ho({ url: t, adapter: e, copyEngine: r, targetBuildType: n }) {
      let i = [], o = [], s = /* @__PURE__ */ __name((O) => {
        i.push({ _tag: "warning", value: O });
      }, "s"), a = /* @__PURE__ */ __name((O) => {
        let D = O.join(`
`);
        o.push({ _tag: "error", value: D });
      }, "a"), f2 = !!t?.startsWith("prisma://"), h = _r(t), C = !!e, A = f2 || h;
      !C && r && A && n !== "client" && n !== "wasm-compiler-edge" && s(["recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)"]);
      let k2 = A || !r;
      C && (k2 || n === "edge") && (n === "edge" ? a(["Prisma Client was configured to use the `adapter` option but it was imported via its `/edge` endpoint.", "Please either remove the `/edge` endpoint or remove the `adapter` from the Prisma Client constructor."]) : A ? a(["You've provided both a driver adapter and an Accelerate database URL. Driver adapters currently cannot connect to Accelerate.", "Please provide either a driver adapter with a direct database URL or an Accelerate URL and no driver adapter."]) : r || a(["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."]));
      let R = { accelerate: k2, ppg: h, driverAdapters: C };
      function _(O) {
        return O.length > 0;
      }
      __name(_, "_");
      return _(o) ? { ok: false, diagnostics: { warnings: i, errors: o }, isUsing: R } : { ok: true, diagnostics: { warnings: i }, isUsing: R };
    }
    __name(ho, "ho");
    function bo({ copyEngine: t = true }, e) {
      let r;
      try {
        r = dr({ inlineDatasources: e.inlineDatasources, overrideDatasources: e.overrideDatasources, env: { ...e.env, ...g.env }, clientVersion: e.clientVersion });
      } catch {
      }
      let { ok: n, isUsing: i, diagnostics: o } = ho({ url: r, adapter: e.adapter, copyEngine: t, targetBuildType: "wasm-engine-edge" });
      for (let A of o.warnings) at(...A.value);
      if (!n) {
        let A = o.errors[0];
        throw new K(A.value, { clientVersion: e.clientVersion });
      }
      let s = Ne(e.generator), a = s === "library", f2 = s === "binary", h = s === "client", C = (i.accelerate || i.ppg) && !i.driverAdapters;
      return i.accelerate, i.driverAdapters ? new Tt(e) : i.accelerate ? new fr(e) : new sn({ clientVersion: e.clientVersion });
    }
    __name(bo, "bo");
    var sn = class {
      static {
        __name(this, "sn");
      }
      constructor(e) {
        return new Proxy(this, { get(r, n) {
          let i = `In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters`;
          throw new K(i, e);
        } });
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    function wo({ generator: t }) {
      return t?.previewFeatures ?? [];
    }
    __name(wo, "wo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var xo = /* @__PURE__ */ __name((t) => ({ command: t }), "xo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Eo = /* @__PURE__ */ __name((t) => t.strings.reduce((e, r, n) => `${e}@P${n}${r}`), "Eo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
    function et(t) {
      try {
        return Po(t, "fast");
      } catch {
        return Po(t, "slow");
      }
    }
    __name(et, "et");
    function Po(t, e) {
      return JSON.stringify(t.map((r) => To(r, e)));
    }
    __name(Po, "Po");
    function To(t, e) {
      if (Array.isArray(t)) return t.map((r) => To(r, e));
      if (typeof t == "bigint") return { prisma__type: "bigint", prisma__value: t.toString() };
      if (qe(t)) return { prisma__type: "date", prisma__value: t.toJSON() };
      if (be.isDecimal(t)) return { prisma__type: "decimal", prisma__value: t.toJSON() };
      if (b2.isBuffer(t)) return { prisma__type: "bytes", prisma__value: t.toString("base64") };
      if (Ml(t)) return { prisma__type: "bytes", prisma__value: b2.from(t).toString("base64") };
      if (ArrayBuffer.isView(t)) {
        let { buffer: r, byteOffset: n, byteLength: i } = t;
        return { prisma__type: "bytes", prisma__value: b2.from(r, n, i).toString("base64") };
      }
      return typeof t == "object" && e === "slow" ? Co(t) : t;
    }
    __name(To, "To");
    function Ml(t) {
      return t instanceof ArrayBuffer || t instanceof SharedArrayBuffer ? true : typeof t == "object" && t !== null ? t[Symbol.toStringTag] === "ArrayBuffer" || t[Symbol.toStringTag] === "SharedArrayBuffer" : false;
    }
    __name(Ml, "Ml");
    function Co(t) {
      if (typeof t != "object" || t === null) return t;
      if (typeof t.toJSON == "function") return t.toJSON();
      if (Array.isArray(t)) return t.map(vo);
      let e = {};
      for (let r of Object.keys(t)) e[r] = vo(t[r]);
      return e;
    }
    __name(Co, "Co");
    function vo(t) {
      return typeof t == "bigint" ? t.toString() : Co(t);
    }
    __name(vo, "vo");
    var _l = /^(\s*alter\s)/i;
    var Ao = G("prisma:client");
    function an(t, e, r, n) {
      if (!(t !== "postgresql" && t !== "cockroachdb") && r.length > 0 && _l.exec(e)) throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
    }
    __name(an, "an");
    var ln = /* @__PURE__ */ __name(({ clientMethod: t, activeProvider: e }) => (r) => {
      let n = "", i;
      if (or(r)) n = r.sql, i = { values: et(r.values), __prismaRawParameters__: true };
      else if (Array.isArray(r)) {
        let [o, ...s] = r;
        n = o, i = { values: et(s || []), __prismaRawParameters__: true };
      } else switch (e) {
        case "sqlite":
        case "mysql": {
          n = r.sql, i = { values: et(r.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r.text, i = { values: et(r.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = Eo(r), i = { values: et(r.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${e} provider does not support ${t}`);
      }
      return i?.values ? Ao(`prisma.${t}(${n}, ${i.values})`) : Ao(`prisma.${t}(${n})`), { query: n, parameters: i };
    }, "ln");
    var Ro = { requestArgsToMiddlewareArgs(t) {
      return [t.strings, ...t.values];
    }, middlewareArgsToRequestArgs(t) {
      let [e, ...r] = t;
      return new ee(e, r);
    } };
    var So = { requestArgsToMiddlewareArgs(t) {
      return [t];
    }, middlewareArgsToRequestArgs(t) {
      return t[0];
    } };
    u();
    c();
    m();
    p2();
    d();
    l2();
    function un(t) {
      return function(r, n) {
        let i, o = /* @__PURE__ */ __name((s = t) => {
          try {
            return s === void 0 || s?.kind === "itx" ? i ??= Oo(r(s)) : Oo(r(s));
          } catch (a) {
            return Promise.reject(a);
          }
        }, "o");
        return { get spec() {
          return n;
        }, then(s, a) {
          return o().then(s, a);
        }, catch(s) {
          return o().catch(s);
        }, finally(s) {
          return o().finally(s);
        }, requestTransaction(s) {
          let a = o(s);
          return a.requestTransaction ? a.requestTransaction(s) : a;
        }, [Symbol.toStringTag]: "PrismaPromise" };
      };
    }
    __name(un, "un");
    function Oo(t) {
      return typeof t.then == "function" ? t : Promise.resolve(t);
    }
    __name(Oo, "Oo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ll = Dr.split(".")[0];
    var Fl = { isEnabled() {
      return false;
    }, getTraceParent() {
      return "00-10-10-00";
    }, dispatchEngineSpans() {
    }, getActiveContext() {
    }, runInChildSpan(t, e) {
      return e();
    } };
    var cn = class {
      static {
        __name(this, "cn");
      }
      isEnabled() {
        return this.getGlobalTracingHelper().isEnabled();
      }
      getTraceParent(e) {
        return this.getGlobalTracingHelper().getTraceParent(e);
      }
      dispatchEngineSpans(e) {
        return this.getGlobalTracingHelper().dispatchEngineSpans(e);
      }
      getActiveContext() {
        return this.getGlobalTracingHelper().getActiveContext();
      }
      runInChildSpan(e, r) {
        return this.getGlobalTracingHelper().runInChildSpan(e, r);
      }
      getGlobalTracingHelper() {
        let e = globalThis[`V${Ll}_PRISMA_INSTRUMENTATION`], r = globalThis.PRISMA_INSTRUMENTATION;
        return e?.helper ?? r?.helper ?? Fl;
      }
    };
    function ko() {
      return new cn();
    }
    __name(ko, "ko");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Do(t, e = () => {
    }) {
      let r, n = new Promise((i) => r = i);
      return { then(i) {
        return --t === 0 && r(e()), i?.(n);
      } };
    }
    __name(Do, "Do");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Io(t) {
      return typeof t == "string" ? t : t.reduce((e, r) => {
        let n = typeof r == "string" ? r : r.level;
        return n === "query" ? e : e && (r === "info" || e === "info") ? "info" : n;
      }, void 0);
    }
    __name(Io, "Io");
    u();
    c();
    m();
    p2();
    d();
    l2();
    u();
    c();
    m();
    p2();
    d();
    l2();
    function gr(t) {
      return typeof t.batchRequestIdx == "number";
    }
    __name(gr, "gr");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function Mo(t) {
      if (t.action !== "findUnique" && t.action !== "findUniqueOrThrow") return;
      let e = [];
      return t.modelName && e.push(t.modelName), t.query.arguments && e.push(mn(t.query.arguments)), e.push(mn(t.query.selection)), e.join("");
    }
    __name(Mo, "Mo");
    function mn(t) {
      return `(${Object.keys(t).sort().map((r) => {
        let n = t[r];
        return typeof n == "object" && n !== null ? `(${r} ${mn(n)})` : r;
      }).join(" ")})`;
    }
    __name(mn, "mn");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Ul = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
    function pn(t) {
      return Ul[t];
    }
    __name(pn, "pn");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var yr = class {
      static {
        __name(this, "yr");
      }
      constructor(e) {
        this.options = e;
        this.batches = {};
      }
      batches;
      tickActive = false;
      request(e) {
        let r = this.options.batchBy(e);
        return r ? (this.batches[r] || (this.batches[r] = [], this.tickActive || (this.tickActive = true, g.nextTick(() => {
          this.dispatchBatches(), this.tickActive = false;
        }))), new Promise((n, i) => {
          this.batches[r].push({ request: e, resolve: n, reject: i });
        })) : this.options.singleLoader(e);
      }
      dispatchBatches() {
        for (let e in this.batches) {
          let r = this.batches[e];
          delete this.batches[e], r.length === 1 ? this.options.singleLoader(r[0].request).then((n) => {
            n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
          }).catch((n) => {
            r[0].reject(n);
          }) : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(r.map((n) => n.request)).then((n) => {
            if (n instanceof Error) for (let i = 0; i < r.length; i++) r[i].reject(n);
            else for (let i = 0; i < r.length; i++) {
              let o = n[i];
              o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
            }
          }).catch((n) => {
            for (let i = 0; i < r.length; i++) r[i].reject(n);
          }));
        }
      }
      get [Symbol.toStringTag]() {
        return "DataLoader";
      }
    };
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
    function _e(t, e) {
      if (e === null) return e;
      switch (t) {
        case "bigint":
          return BigInt(e);
        case "bytes": {
          let { buffer: r, byteOffset: n, byteLength: i } = b2.from(e, "base64");
          return new Uint8Array(r, n, i);
        }
        case "decimal":
          return new be(e);
        case "datetime":
        case "date":
          return new Date(e);
        case "time":
          return /* @__PURE__ */ new Date(`1970-01-01T${e}Z`);
        case "bigint-array":
          return e.map((r) => _e("bigint", r));
        case "bytes-array":
          return e.map((r) => _e("bytes", r));
        case "decimal-array":
          return e.map((r) => _e("decimal", r));
        case "datetime-array":
          return e.map((r) => _e("datetime", r));
        case "date-array":
          return e.map((r) => _e("date", r));
        case "time-array":
          return e.map((r) => _e("time", r));
        default:
          return e;
      }
    }
    __name(_e, "_e");
    function hr(t) {
      let e = [], r = Nl(t);
      for (let n = 0; n < t.rows.length; n++) {
        let i = t.rows[n], o = { ...r };
        for (let s = 0; s < i.length; s++) o[t.columns[s]] = _e(t.types[s], i[s]);
        e.push(o);
      }
      return e;
    }
    __name(hr, "hr");
    function Nl(t) {
      let e = {};
      for (let r = 0; r < t.columns.length; r++) e[t.columns[r]] = null;
      return e;
    }
    __name(Nl, "Nl");
    var ql = G("prisma:client:request_handler");
    var br = class {
      static {
        __name(this, "br");
      }
      client;
      dataloader;
      logEmitter;
      constructor(e, r) {
        this.logEmitter = r, this.client = e, this.dataloader = new yr({ batchLoader: oo(async ({ requests: n, customDataProxyFetch: i }) => {
          let { transaction: o, otelParentCtx: s } = n[0], a = n.map((A) => A.protocolQuery), f2 = this.client._tracingHelper.getTraceParent(s), h = n.some((A) => pn(A.protocolQuery.action));
          return (await this.client._engine.requestBatch(a, { traceparent: f2, transaction: Bl(o), containsWrite: h, customDataProxyFetch: i })).map((A, k2) => {
            if (A instanceof Error) return A;
            try {
              return this.mapQueryEngineResult(n[k2], A);
            } catch (R) {
              return R;
            }
          });
        }), singleLoader: /* @__PURE__ */ __name(async (n) => {
          let i = n.transaction?.kind === "itx" ? _o(n.transaction) : void 0, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: pn(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
          return this.mapQueryEngineResult(n, o);
        }, "singleLoader"), batchBy: /* @__PURE__ */ __name((n) => n.transaction?.id ? `transaction-${n.transaction.id}` : Mo(n.protocolQuery), "batchBy"), batchOrder(n, i) {
          return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
        } });
      }
      async request(e) {
        try {
          return await this.dataloader.request(e);
        } catch (r) {
          let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = e;
          this.handleAndLogRequestError({ error: r, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: e.globalOmit });
        }
      }
      mapQueryEngineResult({ dataPath: e, unpacker: r }, n) {
        let i = n?.data, o = this.unpack(i, e, r);
        return g.env.PRISMA_CLIENT_GET_TIME ? { data: o } : o;
      }
      handleAndLogRequestError(e) {
        try {
          this.handleRequestError(e);
        } catch (r) {
          throw this.logEmitter && this.logEmitter.emit("error", { message: r.message, target: e.clientMethod, timestamp: /* @__PURE__ */ new Date() }), r;
        }
      }
      handleRequestError({ error: e, clientMethod: r, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
        if (ql(e), Vl(e, i)) throw e;
        if (e instanceof Z && jl(e)) {
          let h = Lo(e.meta);
          Zt({ args: o, errors: [h], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r, clientVersion: this.client._clientVersion, globalOmit: a });
        }
        let f2 = e.message;
        if (n && (f2 = $t({ callsite: n, originalMethod: r, isPanic: e.isPanic, showColors: this.client._errorFormat === "pretty", message: f2 })), f2 = this.sanitizeMessage(f2), e.code) {
          let h = s ? { modelName: s, ...e.meta } : e.meta;
          throw new Z(f2, { code: e.code, clientVersion: this.client._clientVersion, meta: h, batchRequestIdx: e.batchRequestIdx });
        } else {
          if (e.isPanic) throw new xe(f2, this.client._clientVersion);
          if (e instanceof Q) throw new Q(f2, { clientVersion: this.client._clientVersion, batchRequestIdx: e.batchRequestIdx });
          if (e instanceof I) throw new I(f2, this.client._clientVersion);
          if (e instanceof xe) throw new xe(f2, this.client._clientVersion);
        }
        throw e.clientVersion = this.client._clientVersion, e;
      }
      sanitizeMessage(e) {
        return this.client._errorFormat && this.client._errorFormat !== "pretty" ? Ur(e) : e;
      }
      unpack(e, r, n) {
        if (!e || (e.data && (e = e.data), !e)) return e;
        let i = Object.keys(e)[0], o = Object.values(e)[0], s = r.filter((h) => h !== "select" && h !== "include"), a = Zr(o, s), f2 = i === "queryRaw" ? hr(a) : Xe(a);
        return n ? n(f2) : f2;
      }
      get [Symbol.toStringTag]() {
        return "RequestHandler";
      }
    };
    function Bl(t) {
      if (t) {
        if (t.kind === "batch") return { kind: "batch", options: { isolationLevel: t.isolationLevel } };
        if (t.kind === "itx") return { kind: "itx", options: _o(t) };
        Ie(t, "Unknown transaction kind");
      }
    }
    __name(Bl, "Bl");
    function _o(t) {
      return { id: t.id, payload: t.payload };
    }
    __name(_o, "_o");
    function Vl(t, e) {
      return gr(t) && e?.kind === "batch" && t.batchRequestIdx !== e.index;
    }
    __name(Vl, "Vl");
    function jl(t) {
      return t.code === "P2009" || t.code === "P2012";
    }
    __name(jl, "jl");
    function Lo(t) {
      if (t.kind === "Union") return { kind: "Union", errors: t.errors.map(Lo) };
      if (Array.isArray(t.selectionPath)) {
        let [, ...e] = t.selectionPath;
        return { ...t, selectionPath: e };
      }
      return t;
    }
    __name(Lo, "Lo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Fo = fo;
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Vo = kt(Vr());
    u();
    c();
    m();
    p2();
    d();
    l2();
    var M = class extends Error {
      static {
        __name(this, "M");
      }
      constructor(e) {
        super(e + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
      }
      get [Symbol.toStringTag]() {
        return "PrismaClientConstructorValidationError";
      }
    };
    re(M, "PrismaClientConstructorValidationError");
    var Uo = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
    var No = ["pretty", "colorless", "minimal"];
    var qo = ["info", "query", "warn", "error"];
    var $l = { datasources: /* @__PURE__ */ __name((t, { datasourceNames: e }) => {
      if (t) {
        if (typeof t != "object" || Array.isArray(t)) throw new M(`Invalid value ${JSON.stringify(t)} for "datasources" provided to PrismaClient constructor`);
        for (let [r, n] of Object.entries(t)) {
          if (!e.includes(r)) {
            let i = tt(r, e) || ` Available datasources: ${e.join(", ")}`;
            throw new M(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
          }
          if (typeof n != "object" || Array.isArray(n)) throw new M(`Invalid value ${JSON.stringify(t)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object") for (let [i, o] of Object.entries(n)) {
            if (i !== "url") throw new M(`Invalid value ${JSON.stringify(t)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string") throw new M(`Invalid value ${JSON.stringify(o)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
        }
      }
    }, "datasources"), adapter: /* @__PURE__ */ __name((t, e) => {
      if (!t && Ne(e.generator) === "client") throw new M('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
      if (t !== null) {
        if (t === void 0) throw new M('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
        if (Ne(e.generator) === "binary") throw new M('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
      }
    }, "adapter"), datasourceUrl: /* @__PURE__ */ __name((t) => {
      if (typeof t < "u" && typeof t != "string") throw new M(`Invalid value ${JSON.stringify(t)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
    }, "datasourceUrl"), errorFormat: /* @__PURE__ */ __name((t) => {
      if (t) {
        if (typeof t != "string") throw new M(`Invalid value ${JSON.stringify(t)} for "errorFormat" provided to PrismaClient constructor.`);
        if (!No.includes(t)) {
          let e = tt(t, No);
          throw new M(`Invalid errorFormat ${t} provided to PrismaClient constructor.${e}`);
        }
      }
    }, "errorFormat"), log: /* @__PURE__ */ __name((t) => {
      if (!t) return;
      if (!Array.isArray(t)) throw new M(`Invalid value ${JSON.stringify(t)} for "log" provided to PrismaClient constructor.`);
      function e(r) {
        if (typeof r == "string" && !qo.includes(r)) {
          let n = tt(r, qo);
          throw new M(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
        }
      }
      __name(e, "e");
      for (let r of t) {
        e(r);
        let n = { level: e, emit: /* @__PURE__ */ __name((i) => {
          let o = ["stdout", "event"];
          if (!o.includes(i)) {
            let s = tt(i, o);
            throw new M(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
          }
        }, "emit") };
        if (r && typeof r == "object") for (let [i, o] of Object.entries(r)) if (n[i]) n[i](o);
        else throw new M(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
      }
    }, "log"), transactionOptions: /* @__PURE__ */ __name((t) => {
      if (!t) return;
      let e = t.maxWait;
      if (e != null && e <= 0) throw new M(`Invalid value ${e} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
      let r = t.timeout;
      if (r != null && r <= 0) throw new M(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
    }, "transactionOptions"), omit: /* @__PURE__ */ __name((t, e) => {
      if (typeof t != "object") throw new M('"omit" option is expected to be an object.');
      if (t === null) throw new M('"omit" option can not be `null`');
      let r = [];
      for (let [n, i] of Object.entries(t)) {
        let o = Jl(n, e.runtimeDataModel);
        if (!o) {
          r.push({ kind: "UnknownModel", modelKey: n });
          continue;
        }
        for (let [s, a] of Object.entries(i)) {
          let f2 = o.fields.find((h) => h.name === s);
          if (!f2) {
            r.push({ kind: "UnknownField", modelKey: n, fieldName: s });
            continue;
          }
          if (f2.relationName) {
            r.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
            continue;
          }
          typeof a != "boolean" && r.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
        }
      }
      if (r.length > 0) throw new M(Gl(t, r));
    }, "omit"), __internal: /* @__PURE__ */ __name((t) => {
      if (!t) return;
      let e = ["debug", "engine", "configOverride"];
      if (typeof t != "object") throw new M(`Invalid value ${JSON.stringify(t)} for "__internal" to PrismaClient constructor`);
      for (let [r] of Object.entries(t)) if (!e.includes(r)) {
        let n = tt(r, e);
        throw new M(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
    }, "__internal") };
    function jo(t, e) {
      for (let [r, n] of Object.entries(t)) {
        if (!Uo.includes(r)) {
          let i = tt(r, Uo);
          throw new M(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
        }
        $l[r](n, e);
      }
      if (t.datasourceUrl && t.datasources) throw new M('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
    }
    __name(jo, "jo");
    function tt(t, e) {
      if (e.length === 0 || typeof t != "string") return "";
      let r = Ql(t, e);
      return r ? ` Did you mean "${r}"?` : "";
    }
    __name(tt, "tt");
    function Ql(t, e) {
      if (e.length === 0) return null;
      let r = e.map((i) => ({ value: i, distance: (0, Vo.default)(t, i) }));
      r.sort((i, o) => i.distance < o.distance ? -1 : 1);
      let n = r[0];
      return n.distance < 3 ? n.value : null;
    }
    __name(Ql, "Ql");
    function Jl(t, e) {
      return Bo(e.models, t) ?? Bo(e.types, t);
    }
    __name(Jl, "Jl");
    function Bo(t, e) {
      let r = Object.keys(t).find((n) => ve(n) === e);
      if (r) return t[r];
    }
    __name(Bo, "Bo");
    function Gl(t, e) {
      let r = We(t);
      for (let o of e) switch (o.kind) {
        case "UnknownModel":
          r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
      let { message: n, args: i } = Xt(r, "colorless");
      return `Error validating "omit" option:

${i}

${n}`;
    }
    __name(Gl, "Gl");
    u();
    c();
    m();
    p2();
    d();
    l2();
    function $o(t) {
      return t.length === 0 ? Promise.resolve([]) : new Promise((e, r) => {
        let n = new Array(t.length), i = null, o = false, s = 0, a = /* @__PURE__ */ __name(() => {
          o || (s++, s === t.length && (o = true, i ? r(i) : e(n)));
        }, "a"), f2 = /* @__PURE__ */ __name((h) => {
          o || (o = true, r(h));
        }, "f");
        for (let h = 0; h < t.length; h++) t[h].then((C) => {
          n[h] = C, a();
        }, (C) => {
          if (!gr(C)) {
            f2(C);
            return;
          }
          C.batchRequestIdx === h ? f2(C) : (i || (i = C), a());
        });
      });
    }
    __name($o, "$o");
    var Ae = G("prisma:client");
    typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
    var Wl = { requestArgsToMiddlewareArgs: /* @__PURE__ */ __name((t) => t, "requestArgsToMiddlewareArgs"), middlewareArgsToRequestArgs: /* @__PURE__ */ __name((t) => t, "middlewareArgsToRequestArgs") };
    var Kl = Symbol.for("prisma.client.transaction.id");
    var Hl = { id: 0, nextId() {
      return ++this.id;
    } };
    function Go(t) {
      class e {
        static {
          __name(this, "e");
        }
        _originalClient = this;
        _runtimeDataModel;
        _requestHandler;
        _connectionPromise;
        _disconnectionPromise;
        _engineConfig;
        _accelerateEngineConfig;
        _clientVersion;
        _errorFormat;
        _tracingHelper;
        _previewFeatures;
        _activeProvider;
        _globalOmit;
        _extensions;
        _engine;
        _appliedParent;
        _createPrismaPromise = un();
        constructor(n) {
          t = n?.__internal?.configOverride?.(t) ?? t, co(t), n && jo(n, t);
          let i = new sr().on("error", () => {
          });
          this._extensions = Ke.empty(), this._previewFeatures = wo(t), this._clientVersion = t.clientVersion ?? Fo, this._activeProvider = t.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = ko();
          let o = t.relativeEnvPaths && { rootEnvPath: t.relativeEnvPaths.rootEnvPath && Ut.resolve(t.dirname, t.relativeEnvPaths.rootEnvPath), schemaEnvPath: t.relativeEnvPaths.schemaEnvPath && Ut.resolve(t.dirname, t.relativeEnvPaths.schemaEnvPath) }, s;
          if (n?.adapter) {
            s = n.adapter;
            let f2 = t.activeProvider === "postgresql" || t.activeProvider === "cockroachdb" ? "postgres" : t.activeProvider;
            if (s.provider !== f2) throw new I(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${f2}\` specified in the Prisma schema.`, this._clientVersion);
            if (n.datasources || n.datasourceUrl !== void 0) throw new I("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
          }
          let a = t.injectableEdgeEnv?.();
          try {
            let f2 = n ?? {}, h = f2.__internal ?? {}, C = h.debug === true;
            C && G.enable("prisma:client");
            let A = Ut.resolve(t.dirname, t.relativePath);
            Bn.existsSync(A) || (A = t.dirname), Ae("dirname", t.dirname), Ae("relativePath", t.relativePath), Ae("cwd", A);
            let k2 = h.engine || {};
            if (f2.errorFormat ? this._errorFormat = f2.errorFormat : g.env.NODE_ENV === "production" ? this._errorFormat = "minimal" : g.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = t.runtimeDataModel, this._engineConfig = { cwd: A, dirname: t.dirname, enableDebugLogs: C, allowTriggerPanic: k2.allowTriggerPanic, prismaPath: k2.binaryPath ?? void 0, engineEndpoint: k2.endpoint, generator: t.generator, showColors: this._errorFormat === "pretty", logLevel: f2.log && Io(f2.log), logQueries: f2.log && !!(typeof f2.log == "string" ? f2.log === "query" : f2.log.find((R) => typeof R == "string" ? R === "query" : R.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: t.engineWasm, compilerWasm: t.compilerWasm, clientVersion: t.clientVersion, engineVersion: t.engineVersion, previewFeatures: this._previewFeatures, activeProvider: t.activeProvider, inlineSchema: t.inlineSchema, overrideDatasources: mo(f2, t.datasourceNames), inlineDatasources: t.inlineDatasources, inlineSchemaHash: t.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: f2.transactionOptions?.maxWait ?? 2e3, timeout: f2.transactionOptions?.timeout ?? 5e3, isolationLevel: f2.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: t.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: dr, getBatchRequestPayload: ur, prismaGraphQLToJSError: cr, PrismaClientUnknownRequestError: Q, PrismaClientInitializationError: I, PrismaClientKnownRequestError: Z, debug: G("prisma:client:accelerateEngine"), engineVersion: Jo.version, clientVersion: t.clientVersion } }, Ae("clientVersion", t.clientVersion), this._engine = bo(t, this._engineConfig), this._requestHandler = new br(this, i), f2.log) for (let R of f2.log) {
              let _ = typeof R == "string" ? R : R.emit === "stdout" ? R.level : null;
              _ && this.$on(_, (O) => {
                st.log(`${st.tags[_] ?? ""}`, O.message || O.query);
              });
            }
          } catch (f2) {
            throw f2.clientVersion = this._clientVersion, f2;
          }
          return this._appliedParent = Pt(this);
        }
        get [Symbol.toStringTag]() {
          return "PrismaClient";
        }
        $on(n, i) {
          return n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i), this;
        }
        $connect() {
          try {
            return this._engine.start();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          }
        }
        async $disconnect() {
          try {
            await this._engine.stop();
          } catch (n) {
            throw n.clientVersion = this._clientVersion, n;
          } finally {
            qn();
          }
        }
        $executeRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: ln({ clientMethod: i, activeProvider: a }), callsite: Ce(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $executeRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) {
              let [s, a] = Qo(n, i);
              return an(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
            }
            throw new K("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
          });
        }
        $executeRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => (an(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
        }
        $runCommandRaw(n) {
          if (t.activeProvider !== "mongodb") throw new K(`The ${t.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
          return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: xo, callsite: Ce(this._errorFormat), transaction: i }));
        }
        async $queryRawInternal(n, i, o, s) {
          let a = this._activeProvider;
          return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: ln({ clientMethod: i, activeProvider: a }), callsite: Ce(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
        }
        $queryRaw(n, ...i) {
          return this._createPrismaPromise((o) => {
            if (n.raw !== void 0 || n.sql !== void 0) return this.$queryRawInternal(o, "$queryRaw", ...Qo(n, i));
            throw new K("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
          });
        }
        $queryRawTyped(n) {
          return this._createPrismaPromise((i) => {
            if (!this._hasPreviewFlag("typedSql")) throw new K("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
            return this.$queryRawInternal(i, "$queryRawTyped", n);
          });
        }
        $queryRawUnsafe(n, ...i) {
          return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
        }
        _transactionWithArray({ promises: n, options: i }) {
          let o = Hl.nextId(), s = Do(n.length), a = n.map((f2, h) => {
            if (f2?.[Symbol.toStringTag] !== "PrismaPromise") throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
            let C = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, A = { kind: "batch", id: o, index: h, isolationLevel: C, lock: s };
            return f2.requestTransaction?.(A) ?? f2;
          });
          return $o(a);
        }
        async _transactionWithCallback({ callback: n, options: i }) {
          let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), f2;
          try {
            let h = { kind: "itx", ...a };
            f2 = await n(this._createItxClient(h)), await this._engine.transaction("commit", o, a);
          } catch (h) {
            throw await this._engine.transaction("rollback", o, a).catch(() => {
            }), h;
          }
          return f2;
        }
        _createItxClient(n) {
          return ae(Pt(ae(Hi(this), [H("_appliedParent", () => this._appliedParent._createItxClient(n)), H("_createPrismaPromise", () => un(n)), H(Kl, () => n.id)])), [ze(eo)]);
        }
        $transaction(n, i) {
          let o;
          typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = /* @__PURE__ */ __name(() => {
            throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
          }, "o") : o = /* @__PURE__ */ __name(() => this._transactionWithCallback({ callback: n, options: i }), "o") : o = /* @__PURE__ */ __name(() => this._transactionWithArray({ promises: n, options: i }), "o");
          let s = { name: "transaction", attributes: { method: "$transaction" } };
          return this._tracingHelper.runInChildSpan(s, o);
        }
        _request(n) {
          n.otelParentCtx = this._tracingHelper.getActiveContext();
          let i = n.middlewareArgsMapper ?? Wl, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = /* @__PURE__ */ __name(async (f2) => {
            let { runInTransaction: h, args: C, ...A } = f2, k2 = { ...n, ...A };
            C && (k2.args = i.middlewareArgsToRequestArgs(C)), n.transaction !== void 0 && h === false && delete k2.transaction;
            let R = await io(this, k2);
            return k2.model ? Zi({ result: R, modelName: k2.model, args: k2.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : R;
          }, "a");
          return this._tracingHelper.runInChildSpan(s.operation, () => a(o));
        }
        async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: f2, argsMapper: h, transaction: C, unpacker: A, otelParentCtx: k2, customDataProxyFetch: R }) {
          try {
            n = h ? h(n) : n;
            let _ = { name: "serialize" }, O = this._tracingHelper.runInChildSpan(_, () => nr({ modelName: f2, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
            return G.enabled("prisma:client") && (Ae("Prisma Client call:"), Ae(`prisma.${i}(${qi(n)})`), Ae("Generated request:"), Ae(JSON.stringify(O, null, 2) + `
`)), C?.kind === "batch" && await C.lock, this._requestHandler.request({ protocolQuery: O, modelName: f2, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: C, unpacker: A, otelParentCtx: k2, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: R });
          } catch (_) {
            throw _.clientVersion = this._clientVersion, _;
          }
        }
        $metrics = new He(this);
        _hasPreviewFlag(n) {
          return !!this._engineConfig.previewFeatures?.includes(n);
        }
        $applyPendingMigrations() {
          return this._engine.applyPendingMigrations();
        }
        $extends = zi;
      }
      return e;
    }
    __name(Go, "Go");
    function Qo(t, e) {
      return zl(t) ? [new ee(t, e), Ro] : [t, So];
    }
    __name(Qo, "Qo");
    function zl(t) {
      return Array.isArray(t) && Array.isArray(t.raw);
    }
    __name(zl, "zl");
    u();
    c();
    m();
    p2();
    d();
    l2();
    var Yl = /* @__PURE__ */ new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
    function Wo(t) {
      return new Proxy(t, { get(e, r) {
        if (r in e) return e[r];
        if (!Yl.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
      } });
    }
    __name(Wo, "Wo");
    u();
    c();
    m();
    p2();
    d();
    l2();
    l2();
  }
});

// ../../node_modules/.prisma/client/wasm.js
var require_wasm = __commonJS({
  "../../node_modules/.prisma/client/wasm.js"(exports) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    var {
      PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
      PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
      PrismaClientRustPanicError: PrismaClientRustPanicError2,
      PrismaClientInitializationError: PrismaClientInitializationError2,
      PrismaClientValidationError: PrismaClientValidationError2,
      getPrismaClient: getPrismaClient2,
      sqltag: sqltag2,
      empty: empty2,
      join: join2,
      raw: raw3,
      skip: skip2,
      Decimal: Decimal2,
      Debug: Debug2,
      objectEnumValues: objectEnumValues2,
      makeStrictEnum: makeStrictEnum2,
      Extensions: Extensions2,
      warnOnce: warnOnce2,
      defineDmmfProperty: defineDmmfProperty2,
      Public: Public2,
      getRuntime: getRuntime2,
      createParam: createParam2
    } = require_wasm_engine_edge();
    var Prisma = {};
    exports.Prisma = Prisma;
    exports.$Enums = {};
    Prisma.prismaVersion = {
      client: "6.18.0",
      engine: "34b5a692b7bd79939a9a2c3ef97d816e749cda2f"
    };
    Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
    Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
    Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
    Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
    Prisma.PrismaClientValidationError = PrismaClientValidationError2;
    Prisma.Decimal = Decimal2;
    Prisma.sql = sqltag2;
    Prisma.empty = empty2;
    Prisma.join = join2;
    Prisma.raw = raw3;
    Prisma.validator = Public2.validator;
    Prisma.getExtensionContext = Extensions2.getExtensionContext;
    Prisma.defineExtension = Extensions2.defineExtension;
    Prisma.DbNull = objectEnumValues2.instances.DbNull;
    Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
    Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
    Prisma.NullTypes = {
      DbNull: objectEnumValues2.classes.DbNull,
      JsonNull: objectEnumValues2.classes.JsonNull,
      AnyNull: objectEnumValues2.classes.AnyNull
    };
    exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    exports.Prisma.UserScalarFieldEnum = {
      id: "id",
      username: "username",
      password: "password",
      type: "type",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ClientScalarFieldEnum = {
      id: "id",
      userId: "userId",
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      address: "address",
      city: "city",
      state: "state",
      zip: "zip",
      notificationEmail: "notificationEmail",
      notificationSms: "notificationSms",
      profilePicture: "profilePicture",
      isActive: "isActive",
      isBanned: "isBanned",
      suspendedUntil: "suspendedUntil",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ContractorScalarFieldEnum = {
      id: "id",
      userId: "userId",
      name: "name",
      email: "email",
      phone: "phone",
      description: "description",
      yearsInBusiness: "yearsInBusiness",
      location: "location",
      googleBusinessUrl: "googleBusinessUrl",
      verified: "verified",
      licensed: "licensed",
      rating: "rating",
      reviewCount: "reviewCount",
      profilePicture: "profilePicture",
      isActive: "isActive",
      isBanned: "isBanned",
      suspendedUntil: "suspendedUntil",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ServiceScalarFieldEnum = {
      id: "id",
      name: "name",
      icon: "icon",
      description: "description",
      createdAt: "createdAt"
    };
    exports.Prisma.ContractorServiceScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      serviceId: "serviceId",
      basePrice: "basePrice",
      createdAt: "createdAt"
    };
    exports.Prisma.BookingScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      clientId: "clientId",
      serviceId: "serviceId",
      serviceAddress: "serviceAddress",
      scheduledDate: "scheduledDate",
      scheduledTime: "scheduledTime",
      estimatedDuration: "estimatedDuration",
      status: "status",
      price: "price",
      paymentReceived: "paymentReceived",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.JobCompletionScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      startTime: "startTime",
      endTime: "endTime",
      materials: "materials",
      notes: "notes",
      audioNoteUrl: "audioNoteUrl",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.JobPhotoScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      filename: "filename",
      originalName: "originalName",
      photoType: "photoType",
      fileSize: "fileSize",
      url: "url",
      createdAt: "createdAt"
    };
    exports.Prisma.MessageScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      clientId: "clientId",
      subject: "subject",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ChatMessageScalarFieldEnum = {
      id: "id",
      messageId: "messageId",
      sender: "sender",
      messageText: "messageText",
      createdAt: "createdAt"
    };
    exports.Prisma.FlaggedMessageScalarFieldEnum = {
      id: "id",
      messageId: "messageId",
      messageText: "messageText",
      flaggedBy: "flaggedBy",
      flaggedById: "flaggedById",
      contractorId: "contractorId",
      clientId: "clientId",
      reason: "reason",
      details: "details",
      status: "status",
      reviewedBy: "reviewedBy",
      reviewedAt: "reviewedAt",
      createdAt: "createdAt"
    };
    exports.Prisma.ReviewScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      clientId: "clientId",
      rating: "rating",
      reviewText: "reviewText",
      createdAt: "createdAt"
    };
    exports.Prisma.InvoiceScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      amount: "amount",
      taxAmount: "taxAmount",
      totalAmount: "totalAmount",
      status: "status",
      dueDate: "dueDate",
      paidAt: "paidAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.PaymentScalarFieldEnum = {
      id: "id",
      bookingId: "bookingId",
      invoiceId: "invoiceId",
      amount: "amount",
      paymentMethod: "paymentMethod",
      stripePaymentId: "stripePaymentId",
      stripePaymentIntent: "stripePaymentIntent",
      status: "status",
      paidAt: "paidAt",
      createdAt: "createdAt"
    };
    exports.Prisma.AvailabilityScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      dayOfWeek: "dayOfWeek",
      specificDate: "specificDate",
      startTime: "startTime",
      endTime: "endTime",
      maxBookings: "maxBookings",
      isAvailable: "isAvailable",
      isRecurring: "isRecurring",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.ContractorServiceAreaScalarFieldEnum = {
      id: "id",
      contractorId: "contractorId",
      dayOfWeek: "dayOfWeek",
      area: "area",
      isActive: "isActive",
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    };
    exports.Prisma.FavoriteContractorScalarFieldEnum = {
      id: "id",
      clientId: "clientId",
      contractorId: "contractorId",
      createdAt: "createdAt"
    };
    exports.Prisma.ActivityLogScalarFieldEnum = {
      id: "id",
      userId: "userId",
      action: "action",
      details: "details",
      severity: "severity",
      metadata: "metadata",
      createdAt: "createdAt"
    };
    exports.Prisma.SortOrder = {
      asc: "asc",
      desc: "desc"
    };
    exports.Prisma.NullableJsonNullValueInput = {
      DbNull: Prisma.DbNull,
      JsonNull: Prisma.JsonNull
    };
    exports.Prisma.QueryMode = {
      default: "default",
      insensitive: "insensitive"
    };
    exports.Prisma.NullsOrder = {
      first: "first",
      last: "last"
    };
    exports.Prisma.JsonNullValueFilter = {
      DbNull: Prisma.DbNull,
      JsonNull: Prisma.JsonNull,
      AnyNull: Prisma.AnyNull
    };
    exports.UserType = exports.$Enums.UserType = {
      CLIENT: "CLIENT",
      CONTRACTOR: "CONTRACTOR",
      ADMIN: "ADMIN"
    };
    exports.BookingStatus = exports.$Enums.BookingStatus = {
      PENDING: "PENDING",
      CONFIRMED: "CONFIRMED",
      IN_PROGRESS: "IN_PROGRESS",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED"
    };
    exports.PhotoType = exports.$Enums.PhotoType = {
      BEFORE: "BEFORE",
      AFTER: "AFTER",
      ADDITIONAL: "ADDITIONAL"
    };
    exports.MessageStatus = exports.$Enums.MessageStatus = {
      READ: "READ",
      UNREAD: "UNREAD"
    };
    exports.SenderType = exports.$Enums.SenderType = {
      CONTRACTOR: "CONTRACTOR",
      CLIENT: "CLIENT"
    };
    exports.FlaggedByType = exports.$Enums.FlaggedByType = {
      CONTRACTOR: "CONTRACTOR",
      CLIENT: "CLIENT"
    };
    exports.FlagStatus = exports.$Enums.FlagStatus = {
      PENDING: "PENDING",
      REVIEWED: "REVIEWED",
      RESOLVED: "RESOLVED",
      DISMISSED: "DISMISSED"
    };
    exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
      PENDING: "PENDING",
      PAID: "PAID",
      OVERDUE: "OVERDUE",
      CANCELLED: "CANCELLED"
    };
    exports.PaymentStatus = exports.$Enums.PaymentStatus = {
      PENDING: "PENDING",
      PROCESSING: "PROCESSING",
      SUCCEEDED: "SUCCEEDED",
      FAILED: "FAILED",
      REFUNDED: "REFUNDED"
    };
    exports.ActivitySeverity = exports.$Enums.ActivitySeverity = {
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      HIGH: "HIGH"
    };
    exports.Prisma.ModelName = {
      User: "User",
      Client: "Client",
      Contractor: "Contractor",
      Service: "Service",
      ContractorService: "ContractorService",
      Booking: "Booking",
      JobCompletion: "JobCompletion",
      JobPhoto: "JobPhoto",
      Message: "Message",
      ChatMessage: "ChatMessage",
      FlaggedMessage: "FlaggedMessage",
      Review: "Review",
      Invoice: "Invoice",
      Payment: "Payment",
      Availability: "Availability",
      ContractorServiceArea: "ContractorServiceArea",
      FavoriteContractor: "FavoriteContractor",
      ActivityLog: "ActivityLog"
    };
    var config2 = {
      "generator": {
        "name": "client",
        "provider": {
          "fromEnvVar": null,
          "value": "prisma-client-js"
        },
        "output": {
          "value": "/Users/codylockwood/FixterConnect/fixterconnect/node_modules/@prisma/client",
          "fromEnvVar": null
        },
        "config": {
          "engineType": "library"
        },
        "binaryTargets": [
          {
            "fromEnvVar": null,
            "value": "darwin-arm64",
            "native": true
          }
        ],
        "previewFeatures": [],
        "sourceFilePath": "/Users/codylockwood/FixterConnect/fixterconnect/packages/server/prisma/schema.prisma"
      },
      "relativeEnvPaths": {
        "rootEnvPath": null,
        "schemaEnvPath": "../../../packages/server/.env"
      },
      "relativePath": "../../../packages/server/prisma",
      "clientVersion": "6.18.0",
      "engineVersion": "34b5a692b7bd79939a9a2c3ef97d816e749cda2f",
      "datasourceNames": [
        "db"
      ],
      "activeProvider": "postgresql",
      "postinstall": false,
      "inlineDatasources": {
        "db": {
          "url": {
            "fromEnvVar": "DATABASE_URL",
            "value": null
          }
        }
      },
      "inlineSchema": '// FixterConnect Database Schema\n// Using Prisma with Supabase PostgreSQL\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n// ============================================\n// USER & AUTH MODELS\n// ============================================\n\nmodel User {\n  id        Int      @id @default(autoincrement())\n  username  String   @unique\n  password  String // bcrypt hashed\n  type      UserType\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  client     Client?\n  contractor Contractor?\n\n  @@map("users")\n}\n\nenum UserType {\n  CLIENT\n  CONTRACTOR\n  ADMIN\n}\n\n// ============================================\n// CLIENT MODEL\n// ============================================\n\nmodel Client {\n  id                Int       @id @default(autoincrement())\n  userId            Int       @unique @map("user_id")\n  firstName         String    @map("first_name")\n  lastName          String    @map("last_name")\n  email             String    @unique\n  phone             String\n  address           String?\n  city              String?\n  state             String?\n  zip               String?\n  notificationEmail Boolean   @default(true) @map("notification_email")\n  notificationSms   Boolean   @default(true) @map("notification_sms")\n  profilePicture    String?   @map("profile_picture")\n  isActive          Boolean   @default(true) @map("is_active")\n  isBanned          Boolean   @default(false) @map("is_banned")\n  suspendedUntil    DateTime? @map("suspended_until")\n  createdAt         DateTime  @default(now()) @map("created_at")\n  updatedAt         DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  user            User                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bookings        Booking[]\n  reviews         Review[]\n  messages        Message[]\n  flaggedMessages FlaggedMessage[]\n  favorites       FavoriteContractor[]\n\n  @@map("clients")\n}\n\n// ============================================\n// CONTRACTOR MODEL\n// ============================================\n\nmodel Contractor {\n  id                Int       @id @default(autoincrement())\n  userId            Int       @unique @map("user_id")\n  name              String\n  email             String?\n  phone             String?\n  description       String?   @db.Text\n  yearsInBusiness   Int?      @map("years_in_business")\n  location          String?\n  googleBusinessUrl String?   @map("google_business_url")\n  verified          Boolean   @default(false)\n  licensed          Boolean   @default(false)\n  rating            Float     @default(0)\n  reviewCount       Int       @default(0) @map("review_count")\n  profilePicture    String?   @map("profile_picture")\n  isActive          Boolean   @default(true) @map("is_active")\n  isBanned          Boolean   @default(false) @map("is_banned")\n  suspendedUntil    DateTime? @map("suspended_until")\n  createdAt         DateTime  @default(now()) @map("created_at")\n  updatedAt         DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  user            User                    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  services        ContractorService[]\n  bookings        Booking[]\n  reviews         Review[]\n  messages        Message[]\n  availability    Availability[]\n  serviceAreas    ContractorServiceArea[]\n  flaggedMessages FlaggedMessage[]\n  favoritedBy     FavoriteContractor[]\n\n  @@map("contractors")\n}\n\n// ============================================\n// SERVICES\n// ============================================\n\nmodel Service {\n  id          Int      @id @default(autoincrement())\n  name        String   @unique\n  icon        String\n  description String?  @db.Text\n  createdAt   DateTime @default(now()) @map("created_at")\n\n  // Relations\n  contractors ContractorService[]\n  bookings    Booking[]\n\n  @@map("services")\n}\n\nmodel ContractorService {\n  id           Int      @id @default(autoincrement())\n  contractorId Int      @map("contractor_id")\n  serviceId    Int      @map("service_id")\n  basePrice    Float?   @map("base_price")\n  createdAt    DateTime @default(now()) @map("created_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n  service    Service    @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n\n  @@unique([contractorId, serviceId])\n  @@map("contractor_services")\n}\n\n// ============================================\n// BOOKINGS & JOBS\n// ============================================\n\nmodel Booking {\n  id                Int           @id @default(autoincrement())\n  contractorId      Int           @map("contractor_id")\n  clientId          Int           @map("client_id")\n  serviceId         Int           @map("service_id")\n  serviceAddress    String        @map("service_address")\n  scheduledDate     DateTime      @map("scheduled_date")\n  scheduledTime     String        @map("scheduled_time")\n  estimatedDuration Int?          @map("estimated_duration") // in minutes\n  status            BookingStatus @default(PENDING)\n  price             Float?\n  paymentReceived   Boolean       @default(false) @map("payment_received")\n  createdAt         DateTime      @default(now()) @map("created_at")\n  updatedAt         DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  contractor Contractor     @relation(fields: [contractorId], references: [id])\n  client     Client         @relation(fields: [clientId], references: [id])\n  service    Service        @relation(fields: [serviceId], references: [id])\n  completion JobCompletion?\n  photos     JobPhoto[]\n  invoice    Invoice?\n  payments   Payment[]\n\n  @@index([contractorId])\n  @@index([clientId])\n  @@index([scheduledDate])\n  @@index([contractorId, scheduledDate, status])\n  @@map("bookings")\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nmodel JobCompletion {\n  id           Int       @id @default(autoincrement())\n  bookingId    Int       @unique @map("booking_id")\n  startTime    DateTime? @map("start_time")\n  endTime      DateTime? @map("end_time")\n  materials    String?   @db.Text\n  notes        String?   @db.Text\n  audioNoteUrl String?   @map("audio_note_url")\n  createdAt    DateTime  @default(now()) @map("created_at")\n  updatedAt    DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@map("job_completions")\n}\n\nmodel JobPhoto {\n  id           Int       @id @default(autoincrement())\n  bookingId    Int       @map("booking_id")\n  filename     String\n  originalName String    @map("original_name")\n  photoType    PhotoType @map("photo_type")\n  fileSize     Int       @map("file_size")\n  url          String\n  createdAt    DateTime  @default(now()) @map("created_at")\n\n  // Relations\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@index([bookingId])\n  @@map("job_photos")\n}\n\nenum PhotoType {\n  BEFORE\n  AFTER\n  ADDITIONAL\n}\n\n// ============================================\n// MESSAGING\n// ============================================\n\nmodel Message {\n  id           Int           @id @default(autoincrement())\n  contractorId Int           @map("contractor_id")\n  clientId     Int           @map("client_id")\n  subject      String?\n  status       MessageStatus @default(UNREAD)\n  createdAt    DateTime      @default(now()) @map("created_at")\n  updatedAt    DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  contractor   Contractor    @relation(fields: [contractorId], references: [id])\n  client       Client        @relation(fields: [clientId], references: [id])\n  chatMessages ChatMessage[]\n\n  @@index([contractorId])\n  @@index([clientId])\n  @@map("messages")\n}\n\nenum MessageStatus {\n  READ\n  UNREAD\n}\n\nmodel ChatMessage {\n  id          Int        @id @default(autoincrement())\n  messageId   Int        @map("message_id")\n  sender      SenderType\n  messageText String     @map("message_text") @db.Text\n  createdAt   DateTime   @default(now()) @map("created_at")\n\n  // Relations\n  message Message @relation(fields: [messageId], references: [id], onDelete: Cascade)\n\n  @@index([messageId])\n  @@map("chat_messages")\n}\n\nenum SenderType {\n  CONTRACTOR\n  CLIENT\n}\n\nmodel FlaggedMessage {\n  id           Int           @id @default(autoincrement())\n  messageId    Int?          @map("message_id")\n  messageText  String        @map("message_text") @db.Text\n  flaggedBy    FlaggedByType @map("flagged_by")\n  flaggedById  Int           @map("flagged_by_id")\n  contractorId Int?          @map("contractor_id")\n  clientId     Int?          @map("client_id")\n  reason       String\n  details      String?       @db.Text\n  status       FlagStatus    @default(PENDING)\n  reviewedBy   Int?          @map("reviewed_by")\n  reviewedAt   DateTime?     @map("reviewed_at")\n  createdAt    DateTime      @default(now()) @map("created_at")\n\n  // Relations\n  contractor Contractor? @relation(fields: [contractorId], references: [id])\n  client     Client?     @relation(fields: [clientId], references: [id])\n\n  @@index([status])\n  @@map("flagged_messages")\n}\n\nenum FlaggedByType {\n  CONTRACTOR\n  CLIENT\n}\n\nenum FlagStatus {\n  PENDING\n  REVIEWED\n  RESOLVED\n  DISMISSED\n}\n\n// ============================================\n// REVIEWS & RATINGS\n// ============================================\n\nmodel Review {\n  id           Int      @id @default(autoincrement())\n  contractorId Int      @map("contractor_id")\n  clientId     Int      @map("client_id")\n  rating       Int // 1-5 stars\n  reviewText   String?  @map("review_text") @db.Text\n  createdAt    DateTime @default(now()) @map("created_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id])\n  client     Client     @relation(fields: [clientId], references: [id])\n\n  @@index([contractorId])\n  @@map("reviews")\n}\n\n// ============================================\n// PAYMENTS & INVOICES\n// ============================================\n\nmodel Invoice {\n  id          Int           @id @default(autoincrement())\n  bookingId   Int           @unique @map("booking_id")\n  amount      Float\n  taxAmount   Float?        @map("tax_amount")\n  totalAmount Float         @map("total_amount")\n  status      InvoiceStatus @default(PENDING)\n  dueDate     DateTime?     @map("due_date")\n  paidAt      DateTime?     @map("paid_at")\n  createdAt   DateTime      @default(now()) @map("created_at")\n  updatedAt   DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  booking  Booking   @relation(fields: [bookingId], references: [id])\n  payments Payment[]\n\n  @@map("invoices")\n}\n\nenum InvoiceStatus {\n  PENDING\n  PAID\n  OVERDUE\n  CANCELLED\n}\n\nmodel Payment {\n  id                  Int           @id @default(autoincrement())\n  bookingId           Int           @map("booking_id")\n  invoiceId           Int?          @map("invoice_id")\n  amount              Float\n  paymentMethod       String        @map("payment_method")\n  stripePaymentId     String?       @unique @map("stripe_payment_id")\n  stripePaymentIntent String?       @unique @map("stripe_payment_intent")\n  status              PaymentStatus @default(PENDING)\n  paidAt              DateTime?     @map("paid_at")\n  createdAt           DateTime      @default(now()) @map("created_at")\n\n  // Relations\n  booking Booking  @relation(fields: [bookingId], references: [id])\n  invoice Invoice? @relation(fields: [invoiceId], references: [id])\n\n  @@index([bookingId])\n  @@map("payments")\n}\n\nenum PaymentStatus {\n  PENDING\n  PROCESSING\n  SUCCEEDED\n  FAILED\n  REFUNDED\n}\n\n// ============================================\n// CONTRACTOR AVAILABILITY\n// ============================================\n\n// General working hours for contractors (recurring schedule)\nmodel Availability {\n  id           Int       @id @default(autoincrement())\n  contractorId Int       @map("contractor_id")\n  dayOfWeek    Int?      @map("day_of_week") // 0=Sunday, 1=Monday, etc. NULL for specific dates\n  specificDate DateTime? @map("specific_date") // For one-time overrides (vacation, holidays)\n  startTime    String    @map("start_time") // e.g., "08:00"\n  endTime      String    @map("end_time") // e.g., "17:00"\n  maxBookings  Int       @default(8) @map("max_bookings") // Max jobs per day\n  isAvailable  Boolean   @default(true) @map("is_available")\n  isRecurring  Boolean   @default(true) @map("is_recurring") // true = recurring weekly, false = specific date\n  createdAt    DateTime  @default(now()) @map("created_at")\n  updatedAt    DateTime  @updatedAt @map("updated_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n\n  @@index([contractorId, dayOfWeek])\n  @@index([contractorId, specificDate])\n  @@map("availability")\n}\n\n// ============================================\n// SERVICE AREAS\n// ============================================\n\n// Tracks which areas a contractor serves on which days\nmodel ContractorServiceArea {\n  id           Int      @id @default(autoincrement())\n  contractorId Int      @map("contractor_id")\n  dayOfWeek    Int?     @map("day_of_week") // 0=Sunday, 1=Monday, etc. NULL = all days\n  area         String // City/area name (e.g., "Boise", "Nampa")\n  isActive     Boolean  @default(true) @map("is_active")\n  createdAt    DateTime @default(now()) @map("created_at")\n  updatedAt    DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n\n  @@index([contractorId, dayOfWeek])\n  @@index([area])\n  @@map("contractor_service_areas")\n}\n\n// ============================================\n// FAVORITE CONTRACTORS\n// ============================================\n\nmodel FavoriteContractor {\n  id           Int      @id @default(autoincrement())\n  clientId     Int      @map("client_id")\n  contractorId Int      @map("contractor_id")\n  createdAt    DateTime @default(now()) @map("created_at")\n\n  // Relations\n  client     Client     @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  contractor Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)\n\n  @@unique([clientId, contractorId])\n  @@index([clientId])\n  @@map("favorite_contractors")\n}\n\n// ============================================\n// ADMIN ACTIVITY LOGS\n// ============================================\n\nenum ActivitySeverity {\n  LOW\n  MEDIUM\n  HIGH\n}\n\nmodel ActivityLog {\n  id        Int              @id @default(autoincrement())\n  userId    Int?             @map("user_id") // Admin user who performed the action\n  action    String // e.g., "Flag Dismissed", "User Suspended", "User Banned"\n  details   String           @db.Text // Full description of what happened\n  severity  ActivitySeverity @default(LOW)\n  metadata  Json? // Additional structured data (user IDs, flag IDs, etc.)\n  createdAt DateTime         @default(now()) @map("created_at")\n\n  @@index([createdAt])\n  @@index([severity])\n  @@map("activity_logs")\n}\n',
      "inlineSchemaHash": "8f2ccfe64660c30850b8766ba153e675908e822190d83a352cf22d905a0361c6",
      "copyEngine": false
    };
    config2.dirname = "/";
    config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"username","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"UserType"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToUser"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToUser"}],"dbName":"users"},"Client":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"firstName","kind":"scalar","type":"String","dbName":"first_name"},{"name":"lastName","kind":"scalar","type":"String","dbName":"last_name"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"state","kind":"scalar","type":"String"},{"name":"zip","kind":"scalar","type":"String"},{"name":"notificationEmail","kind":"scalar","type":"Boolean","dbName":"notification_email"},{"name":"notificationSms","kind":"scalar","type":"Boolean","dbName":"notification_sms"},{"name":"profilePicture","kind":"scalar","type":"String","dbName":"profile_picture"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"isBanned","kind":"scalar","type":"Boolean","dbName":"is_banned"},{"name":"suspendedUntil","kind":"scalar","type":"DateTime","dbName":"suspended_until"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"ClientToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToClient"},{"name":"reviews","kind":"object","type":"Review","relationName":"ClientToReview"},{"name":"messages","kind":"object","type":"Message","relationName":"ClientToMessage"},{"name":"flaggedMessages","kind":"object","type":"FlaggedMessage","relationName":"ClientToFlaggedMessage"},{"name":"favorites","kind":"object","type":"FavoriteContractor","relationName":"ClientToFavoriteContractor"}],"dbName":"clients"},"Contractor":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"yearsInBusiness","kind":"scalar","type":"Int","dbName":"years_in_business"},{"name":"location","kind":"scalar","type":"String"},{"name":"googleBusinessUrl","kind":"scalar","type":"String","dbName":"google_business_url"},{"name":"verified","kind":"scalar","type":"Boolean"},{"name":"licensed","kind":"scalar","type":"Boolean"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"reviewCount","kind":"scalar","type":"Int","dbName":"review_count"},{"name":"profilePicture","kind":"scalar","type":"String","dbName":"profile_picture"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"isBanned","kind":"scalar","type":"Boolean","dbName":"is_banned"},{"name":"suspendedUntil","kind":"scalar","type":"DateTime","dbName":"suspended_until"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"user","kind":"object","type":"User","relationName":"ContractorToUser"},{"name":"services","kind":"object","type":"ContractorService","relationName":"ContractorToContractorService"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToContractor"},{"name":"reviews","kind":"object","type":"Review","relationName":"ContractorToReview"},{"name":"messages","kind":"object","type":"Message","relationName":"ContractorToMessage"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToContractor"},{"name":"serviceAreas","kind":"object","type":"ContractorServiceArea","relationName":"ContractorToContractorServiceArea"},{"name":"flaggedMessages","kind":"object","type":"FlaggedMessage","relationName":"ContractorToFlaggedMessage"},{"name":"favoritedBy","kind":"object","type":"FavoriteContractor","relationName":"ContractorToFavoriteContractor"}],"dbName":"contractors"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"contractors","kind":"object","type":"ContractorService","relationName":"ContractorServiceToService"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"}],"dbName":"services"},"ContractorService":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"serviceId","kind":"scalar","type":"Int","dbName":"service_id"},{"name":"basePrice","kind":"scalar","type":"Float","dbName":"base_price"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToContractorService"},{"name":"service","kind":"object","type":"Service","relationName":"ContractorServiceToService"}],"dbName":"contractor_services"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"clientId","kind":"scalar","type":"Int","dbName":"client_id"},{"name":"serviceId","kind":"scalar","type":"Int","dbName":"service_id"},{"name":"serviceAddress","kind":"scalar","type":"String","dbName":"service_address"},{"name":"scheduledDate","kind":"scalar","type":"DateTime","dbName":"scheduled_date"},{"name":"scheduledTime","kind":"scalar","type":"String","dbName":"scheduled_time"},{"name":"estimatedDuration","kind":"scalar","type":"Int","dbName":"estimated_duration"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"price","kind":"scalar","type":"Float"},{"name":"paymentReceived","kind":"scalar","type":"Boolean","dbName":"payment_received"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"BookingToContractor"},{"name":"client","kind":"object","type":"Client","relationName":"BookingToClient"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"completion","kind":"object","type":"JobCompletion","relationName":"BookingToJobCompletion"},{"name":"photos","kind":"object","type":"JobPhoto","relationName":"BookingToJobPhoto"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"BookingToInvoice"},{"name":"payments","kind":"object","type":"Payment","relationName":"BookingToPayment"}],"dbName":"bookings"},"JobCompletion":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookingId","kind":"scalar","type":"Int","dbName":"booking_id"},{"name":"startTime","kind":"scalar","type":"DateTime","dbName":"start_time"},{"name":"endTime","kind":"scalar","type":"DateTime","dbName":"end_time"},{"name":"materials","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"audioNoteUrl","kind":"scalar","type":"String","dbName":"audio_note_url"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToJobCompletion"}],"dbName":"job_completions"},"JobPhoto":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookingId","kind":"scalar","type":"Int","dbName":"booking_id"},{"name":"filename","kind":"scalar","type":"String"},{"name":"originalName","kind":"scalar","type":"String","dbName":"original_name"},{"name":"photoType","kind":"enum","type":"PhotoType","dbName":"photo_type"},{"name":"fileSize","kind":"scalar","type":"Int","dbName":"file_size"},{"name":"url","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToJobPhoto"}],"dbName":"job_photos"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"clientId","kind":"scalar","type":"Int","dbName":"client_id"},{"name":"subject","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"MessageStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToMessage"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToMessage"},{"name":"chatMessages","kind":"object","type":"ChatMessage","relationName":"ChatMessageToMessage"}],"dbName":"messages"},"ChatMessage":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"messageId","kind":"scalar","type":"Int","dbName":"message_id"},{"name":"sender","kind":"enum","type":"SenderType"},{"name":"messageText","kind":"scalar","type":"String","dbName":"message_text"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"message","kind":"object","type":"Message","relationName":"ChatMessageToMessage"}],"dbName":"chat_messages"},"FlaggedMessage":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"messageId","kind":"scalar","type":"Int","dbName":"message_id"},{"name":"messageText","kind":"scalar","type":"String","dbName":"message_text"},{"name":"flaggedBy","kind":"enum","type":"FlaggedByType","dbName":"flagged_by"},{"name":"flaggedById","kind":"scalar","type":"Int","dbName":"flagged_by_id"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"clientId","kind":"scalar","type":"Int","dbName":"client_id"},{"name":"reason","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"FlagStatus"},{"name":"reviewedBy","kind":"scalar","type":"Int","dbName":"reviewed_by"},{"name":"reviewedAt","kind":"scalar","type":"DateTime","dbName":"reviewed_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToFlaggedMessage"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToFlaggedMessage"}],"dbName":"flagged_messages"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"clientId","kind":"scalar","type":"Int","dbName":"client_id"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"reviewText","kind":"scalar","type":"String","dbName":"review_text"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToReview"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToReview"}],"dbName":"reviews"},"Invoice":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookingId","kind":"scalar","type":"Int","dbName":"booking_id"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"taxAmount","kind":"scalar","type":"Float","dbName":"tax_amount"},{"name":"totalAmount","kind":"scalar","type":"Float","dbName":"total_amount"},{"name":"status","kind":"enum","type":"InvoiceStatus"},{"name":"dueDate","kind":"scalar","type":"DateTime","dbName":"due_date"},{"name":"paidAt","kind":"scalar","type":"DateTime","dbName":"paid_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToInvoice"},{"name":"payments","kind":"object","type":"Payment","relationName":"InvoiceToPayment"}],"dbName":"invoices"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"bookingId","kind":"scalar","type":"Int","dbName":"booking_id"},{"name":"invoiceId","kind":"scalar","type":"Int","dbName":"invoice_id"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentMethod","kind":"scalar","type":"String","dbName":"payment_method"},{"name":"stripePaymentId","kind":"scalar","type":"String","dbName":"stripe_payment_id"},{"name":"stripePaymentIntent","kind":"scalar","type":"String","dbName":"stripe_payment_intent"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime","dbName":"paid_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"},{"name":"invoice","kind":"object","type":"Invoice","relationName":"InvoiceToPayment"}],"dbName":"payments"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"dayOfWeek","kind":"scalar","type":"Int","dbName":"day_of_week"},{"name":"specificDate","kind":"scalar","type":"DateTime","dbName":"specific_date"},{"name":"startTime","kind":"scalar","type":"String","dbName":"start_time"},{"name":"endTime","kind":"scalar","type":"String","dbName":"end_time"},{"name":"maxBookings","kind":"scalar","type":"Int","dbName":"max_bookings"},{"name":"isAvailable","kind":"scalar","type":"Boolean","dbName":"is_available"},{"name":"isRecurring","kind":"scalar","type":"Boolean","dbName":"is_recurring"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"AvailabilityToContractor"}],"dbName":"availability"},"ContractorServiceArea":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"dayOfWeek","kind":"scalar","type":"Int","dbName":"day_of_week"},{"name":"area","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToContractorServiceArea"}],"dbName":"contractor_service_areas"},"FavoriteContractor":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"clientId","kind":"scalar","type":"Int","dbName":"client_id"},{"name":"contractorId","kind":"scalar","type":"Int","dbName":"contractor_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"client","kind":"object","type":"Client","relationName":"ClientToFavoriteContractor"},{"name":"contractor","kind":"object","type":"Contractor","relationName":"ContractorToFavoriteContractor"}],"dbName":"favorite_contractors"},"ActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"Int","dbName":"user_id"},{"name":"action","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"String"},{"name":"severity","kind":"enum","type":"ActivitySeverity"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"}],"dbName":"activity_logs"}},"enums":{},"types":{}}');
    defineDmmfProperty2(exports.Prisma, config2.runtimeDataModel);
    config2.engineWasm = void 0;
    config2.compilerWasm = void 0;
    config2.injectableEdgeEnv = () => ({
      parsed: {
        DATABASE_URL: typeof globalThis !== "undefined" && globalThis["DATABASE_URL"] || typeof process !== "undefined" && process.env && process.env.DATABASE_URL || void 0
      }
    });
    if (typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0) {
      Debug2.enable(typeof globalThis !== "undefined" && globalThis["DEBUG"] || typeof process !== "undefined" && process.env && process.env.DEBUG || void 0);
    }
    var PrismaClient2 = getPrismaClient2(config2);
    exports.PrismaClient = PrismaClient2;
    Object.assign(exports, Prisma);
  }
});

// ../../node_modules/.prisma/client/default.js
var require_default = __commonJS({
  "../../node_modules/.prisma/client/default.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = { ...require_wasm() };
  }
});

// ../../node_modules/@prisma/client/default.js
var require_default2 = __commonJS({
  "../../node_modules/@prisma/client/default.js"(exports, module) {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = {
      ...require_default()
    };
  }
});

// .wrangler/tmp/bundle-sBA2PU/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-sBA2PU/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/worker.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/hono.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/hono-base.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/compose.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../../node_modules/hono/dist/context.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/request.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/http-exception.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/request/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = Symbol();

// ../../node_modules/hono/dist/utils/body.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// ../../node_modules/hono/dist/utils/url.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw3 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw3[key]();
  }, "#cachedBody");
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/hono/dist/utils/html.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw2 = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw2(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../../node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k2, v] of this.#res.headers.entries()) {
        if (k2 === "content-type") {
          continue;
        }
        if (k2 === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k2, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k2, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k2, v);
        } else {
          responseHeaders.delete(k2);
          for (const v2 of v) {
            responseHeaders.append(k2, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// ../../node_modules/hono/dist/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// ../../node_modules/hono/dist/utils/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class {
  static {
    __name(this, "Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p2 of [path].flat()) {
        this.#path = p2;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// ../../node_modules/hono/dist/router/reg-exp-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/reg-exp-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/reg-exp-router/matcher.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }, "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// ../../node_modules/hono/dist/router/reg-exp-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b2) {
  if (a.length === 1) {
    return b2.length === 1 ? a < b2 ? -1 : 1 : -1;
  }
  if (b2.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b2 === ONLY_WILDCARD_REG_EXP_STR || b2 === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b2 === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b2.length ? a < b2 ? -1 : 1 : b2.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class {
  static {
    __name(this, "Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k2) => k2 !== ONLY_WILDCARD_REG_EXP_STR && k2 !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node();
        if (name !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k2) => k2.length > 1 && k2 !== ONLY_WILDCARD_REG_EXP_STR && k2 !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k2) => {
      const c = this.#children[k2];
      return (typeof c.#varIndex === "number" ? `(${k2})@${c.#varIndex}` : regExpMetaChars.has(k2) ? `\\${k2}` : k2) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/trie.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k2 = 0, len3 = keys.length; k2 < len3; k2++) {
        map[keys[k2]] = paramReplacementMap[map[keys[k2]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k2 of Object.keys(middleware).sort((a, b2) => b2.length - a.length)) {
    if (buildWildcardRegExp(k2).test(path)) {
      return [...middleware[k2]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p2) => {
          handlerMap[method][p2] = [...handlerMap[METHOD_NAME_ALL][p2]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p2) => {
            re.test(p2) && middleware[m][p2].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p2) => re.test(p2) && routes[m][p2].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/smart-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/smart-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/hono/dist/router/trie-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/trie-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/router/trie-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  static {
    __name(this, "Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p2 = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p2, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p2;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k2 = 0, len3 = node.#patterns.length; k2 < len3; k2++) {
          const pattern = node.#patterns[k2];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b2) => {
        return a.score - b2.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// ../../node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../../node_modules/hono/dist/middleware/cors/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/worker.ts
var import_edge = __toESM(require_edge3(), 1);

// ../../node_modules/@prisma/extension-accelerate/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_default_index = __toESM(require_default_index(), 1);
var import_default_index2 = __toESM(require_default_index(), 1);
function f(a, n) {
  let [c = 0, u = 0, m = 0] = a.split(".").map(Number), [o = 0, h = 0, i = 0] = n.split(".").map(Number), r = o - c, e = h - u, t = i - m;
  return r || e || t;
}
__name(f, "f");
function p() {
  let a = import_default_index2.default.Prisma.prismaVersion;
  return [F(), `PrismaEngine/${a.engine}`, `PrismaClient/${a.client}`].join(" ");
}
__name(p, "p");
function F() {
  return typeof navigator < "u" ? "Cloudflare-Workers" : typeof process < "u" && typeof process.versions < "u" ? `Node/${process.versions.node} (${process.platform}; ${process.arch})` : "EdgeRuntime" in globalThis ? "Vercel-Edge-Runtime" : "UnknownRuntime";
}
__name(F, "F");
var P = "@prisma/extension-accelerate";
var x = "Unable to connect to the Accelerate API. This may be due to a network or DNS issue. Please check your connection and the Accelerate connection string. For details, visit https://www.prisma.io/docs/accelerate/troubleshoot.";
function b(a) {
  let n = p(), c;
  return async (u) => {
    let { args: m } = u, { cacheStrategy: o, __accelerateInfo: h = false, ...i } = m, r = null, { __internalParams: e, query: t } = u;
    return e.customDataProxyFetch = () => async (s, d) => {
      let A = new Array();
      typeof o?.ttl == "number" && A.push(`max-age=${o.ttl}`), typeof o?.swr == "number" && A.push(`stale-while-revalidate=${o.swr}`);
      let y = o?.tags?.join(",") ?? "";
      d.headers = { ...d.headers, "cache-control": A.length > 0 ? A.join(",") : "no-cache", "user-agent": n, ...y.length > 0 ? { "accelerate-cache-tags": y } : {} }, c && (d.headers["accelerate-query-engine-jwt"] = c);
      try {
        let g = await a(s, d);
        return r = { cacheStatus: g.headers.get("accelerate-cache-status"), lastModified: new Date(g.headers.get("last-modified") ?? ""), region: g.headers.get("cf-ray")?.split("-")[1] ?? "unspecified", requestId: g.headers.get("cf-ray") ?? "unspecified", signature: g.headers.get("accelerate-signature") ?? "unspecified" }, c = g.headers.get("accelerate-query-engine-jwt") ?? void 0, g;
      } catch {
        throw new Error(x);
      }
    }, h ? { data: await t(i, e), info: r } : t(i, e);
  };
}
__name(b, "b");
function T(a) {
  let n = f("5.1.0", import_default_index.default.Prisma.prismaVersion.client) >= 0;
  return import_default_index.default.Prisma.defineExtension((c) => {
    let { apiKeyPromise: u, baseURL: m } = S(c), o = b(a);
    async function h(r) {
      let e = await u;
      if (!e) return { requestId: "unspecified" };
      let t;
      try {
        t = await a(new URL("/invalidate", m).href, { method: "POST", headers: { authorization: `Bearer ${e}`, "content-type": "application/json" }, body: JSON.stringify(r) });
      } catch {
        throw new Error(x);
      }
      if (!t?.ok) {
        let s = await t.text();
        throw new Error(`Failed to invalidate Accelerate cache. Response was ${t.status} ${t.statusText}. ${s}`);
      }
      return t.body?.cancel(), { requestId: t.headers.get("cf-ray") ?? "unspecified" };
    }
    __name(h, "h");
    let i = c.$extends({ name: P, query: { $allModels: { $allOperations: o } } });
    return i.$extends({ name: P, client: { $accelerate: { invalidate: /* @__PURE__ */ __name((r) => h(r), "invalidate"), invalidateAll: /* @__PURE__ */ __name(() => h({ tags: "all" }), "invalidateAll") } }, model: { $allModels: { aggregate(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.aggregate(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.aggregate({ ...r, __accelerateInfo: true });
      } });
    }, count(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.count(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.count({ ...r, __accelerateInfo: true });
      } });
    }, findFirst(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findFirst(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findFirst({ ...r, __accelerateInfo: true });
      } });
    }, findFirstOrThrow(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findFirstOrThrow(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findFirstOrThrow({ ...r, __accelerateInfo: true });
      } });
    }, findMany(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findMany(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findMany({ ...r, __accelerateInfo: true });
      } });
    }, findUnique(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findUnique(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findUnique({ ...r, __accelerateInfo: true });
      } });
    }, findUniqueOrThrow(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.findUniqueOrThrow(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.findUniqueOrThrow({ ...r, __accelerateInfo: true });
      } });
    }, groupBy(r) {
      let e = import_default_index.default.Prisma.getExtensionContext(this), t = n ? e.$parent[e.$name] : i[e.name], s = t.groupBy(r);
      return Object.assign(s, { withAccelerateInfo() {
        return t.groupBy({ ...r, __accelerateInfo: true });
      } });
    } } } });
  });
}
__name(T, "T");
function S(a) {
  let n = Reflect.get(a, "_accelerateEngineConfig");
  try {
    let { host: c, hostname: u, protocol: m, searchParams: o } = new URL(n?.accelerateUtils?.resolveDatasourceUrl?.(n));
    if (m === "prisma+postgres:" && (u === "localhost" || u === "127.0.0.1")) return { apiKeyPromise: Promise.resolve(o.get("api_key")), baseURL: new URL(`http://${c}`) };
  } catch {
  }
  return { apiKeyPromise: a._engine.start().then(() => a._engine.apiKey?.() ?? null), baseURL: new URL("https://accelerate.prisma-data.net") };
}
__name(S, "S");
function k(a) {
  let n = a?.fetch ?? fetch;
  return T(n);
}
__name(k, "k");

// src/routes-hono/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/middleware/jwt/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/middleware/jwt/jwt.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/helper/cookie/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/utils/cookie.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/utils/jwt/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/utils/jwt/jwt.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/utils/encode.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var decodeBase64Url = /* @__PURE__ */ __name((str) => {
  return decodeBase64(str.replace(/_|-/g, (m) => ({ _: "/", "-": "+" })[m] ?? m));
}, "decodeBase64Url");
var encodeBase64Url = /* @__PURE__ */ __name((buf) => encodeBase64(buf).replace(/\/|\+/g, (m) => ({ "/": "_", "+": "-" })[m] ?? m), "encodeBase64Url");
var encodeBase64 = /* @__PURE__ */ __name((buf) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}, "encodeBase64");
var decodeBase64 = /* @__PURE__ */ __name((str) => {
  const binary = atob(str);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  const half = binary.length / 2;
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i);
    bytes[j] = binary.charCodeAt(j);
  }
  return bytes;
}, "decodeBase64");

// ../../node_modules/hono/dist/utils/jwt/jwa.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var AlgorithmTypes = /* @__PURE__ */ ((AlgorithmTypes2) => {
  AlgorithmTypes2["HS256"] = "HS256";
  AlgorithmTypes2["HS384"] = "HS384";
  AlgorithmTypes2["HS512"] = "HS512";
  AlgorithmTypes2["RS256"] = "RS256";
  AlgorithmTypes2["RS384"] = "RS384";
  AlgorithmTypes2["RS512"] = "RS512";
  AlgorithmTypes2["PS256"] = "PS256";
  AlgorithmTypes2["PS384"] = "PS384";
  AlgorithmTypes2["PS512"] = "PS512";
  AlgorithmTypes2["ES256"] = "ES256";
  AlgorithmTypes2["ES384"] = "ES384";
  AlgorithmTypes2["ES512"] = "ES512";
  AlgorithmTypes2["EdDSA"] = "EdDSA";
  return AlgorithmTypes2;
})(AlgorithmTypes || {});

// ../../node_modules/hono/dist/utils/jwt/jws.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../node_modules/hono/dist/helper/adapter/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var knownUserAgents = {
  deno: "Deno",
  bun: "Bun",
  workerd: "Cloudflare-Workers",
  node: "Node.js"
};
var getRuntimeKey = /* @__PURE__ */ __name(() => {
  const global = globalThis;
  const userAgentSupported = typeof navigator !== "undefined" && true;
  if (userAgentSupported) {
    for (const [runtimeKey, userAgent] of Object.entries(knownUserAgents)) {
      if (checkUserAgentEquals(userAgent)) {
        return runtimeKey;
      }
    }
  }
  if (typeof global?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global?.fastly !== void 0) {
    return "fastly";
  }
  if (global?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
}, "getRuntimeKey");
var checkUserAgentEquals = /* @__PURE__ */ __name((platform2) => {
  const userAgent = "Cloudflare-Workers";
  return userAgent.startsWith(platform2);
}, "checkUserAgentEquals");

// ../../node_modules/hono/dist/utils/jwt/types.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var JwtAlgorithmNotImplemented = class extends Error {
  static {
    __name(this, "JwtAlgorithmNotImplemented");
  }
  constructor(alg) {
    super(`${alg} is not an implemented algorithm`);
    this.name = "JwtAlgorithmNotImplemented";
  }
};
var JwtTokenInvalid = class extends Error {
  static {
    __name(this, "JwtTokenInvalid");
  }
  constructor(token) {
    super(`invalid JWT token: ${token}`);
    this.name = "JwtTokenInvalid";
  }
};
var JwtTokenNotBefore = class extends Error {
  static {
    __name(this, "JwtTokenNotBefore");
  }
  constructor(token) {
    super(`token (${token}) is being used before it's valid`);
    this.name = "JwtTokenNotBefore";
  }
};
var JwtTokenExpired = class extends Error {
  static {
    __name(this, "JwtTokenExpired");
  }
  constructor(token) {
    super(`token (${token}) expired`);
    this.name = "JwtTokenExpired";
  }
};
var JwtTokenIssuedAt = class extends Error {
  static {
    __name(this, "JwtTokenIssuedAt");
  }
  constructor(currentTimestamp, iat) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    );
    this.name = "JwtTokenIssuedAt";
  }
};
var JwtTokenIssuer = class extends Error {
  static {
    __name(this, "JwtTokenIssuer");
  }
  constructor(expected, iss) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : "none"} `);
    this.name = "JwtTokenIssuer";
  }
};
var JwtHeaderInvalid = class extends Error {
  static {
    __name(this, "JwtHeaderInvalid");
  }
  constructor(header) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderInvalid";
  }
};
var JwtHeaderRequiresKid = class extends Error {
  static {
    __name(this, "JwtHeaderRequiresKid");
  }
  constructor(header) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`);
    this.name = "JwtHeaderRequiresKid";
  }
};
var JwtTokenSignatureMismatched = class extends Error {
  static {
    __name(this, "JwtTokenSignatureMismatched");
  }
  constructor(token) {
    super(`token(${token}) signature mismatched`);
    this.name = "JwtTokenSignatureMismatched";
  }
};
var JwtPayloadRequiresAud = class extends Error {
  static {
    __name(this, "JwtPayloadRequiresAud");
  }
  constructor(payload) {
    super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`);
    this.name = "JwtPayloadRequiresAud";
  }
};
var JwtTokenAudience = class extends Error {
  static {
    __name(this, "JwtTokenAudience");
  }
  constructor(expected, aud) {
    super(
      `expected audience "${Array.isArray(expected) ? expected.join(", ") : expected}", got "${aud}"`
    );
    this.name = "JwtTokenAudience";
  }
};
var CryptoKeyUsage = /* @__PURE__ */ ((CryptoKeyUsage2) => {
  CryptoKeyUsage2["Encrypt"] = "encrypt";
  CryptoKeyUsage2["Decrypt"] = "decrypt";
  CryptoKeyUsage2["Sign"] = "sign";
  CryptoKeyUsage2["Verify"] = "verify";
  CryptoKeyUsage2["DeriveKey"] = "deriveKey";
  CryptoKeyUsage2["DeriveBits"] = "deriveBits";
  CryptoKeyUsage2["WrapKey"] = "wrapKey";
  CryptoKeyUsage2["UnwrapKey"] = "unwrapKey";
  return CryptoKeyUsage2;
})(CryptoKeyUsage || {});

// ../../node_modules/hono/dist/utils/jwt/utf8.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var utf8Encoder = new TextEncoder();
var utf8Decoder = new TextDecoder();

// ../../node_modules/hono/dist/utils/jwt/jws.js
async function signing(privateKey, alg, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPrivateKey(privateKey, algorithm);
  return await crypto.subtle.sign(algorithm, cryptoKey, data);
}
__name(signing, "signing");
async function verifying(publicKey, alg, signature, data) {
  const algorithm = getKeyAlgorithm(alg);
  const cryptoKey = await importPublicKey(publicKey, algorithm);
  return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
}
__name(verifying, "verifying");
function pemToBinary(pem) {
  return decodeBase64(pem.replace(/-+(BEGIN|END).*/g, "").replace(/\s/g, ""));
}
__name(pemToBinary, "pemToBinary");
async function importPrivateKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type !== "private" && key.type !== "secret") {
      throw new Error(
        `unexpected key type: CryptoKey.type is ${key.type}, expected private or secret`
      );
    }
    return key;
  }
  const usages = [CryptoKeyUsage.Sign];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PRIVATE")) {
    return await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPrivateKey, "importPrivateKey");
async function importPublicKey(key, alg) {
  if (!crypto.subtle || !crypto.subtle.importKey) {
    throw new Error("`crypto.subtle.importKey` is undefined. JWT auth middleware requires it.");
  }
  if (isCryptoKey(key)) {
    if (key.type === "public" || key.type === "secret") {
      return key;
    }
    key = await exportPublicJwkFrom(key);
  }
  if (typeof key === "string" && key.includes("PRIVATE")) {
    const privateKey = await crypto.subtle.importKey("pkcs8", pemToBinary(key), alg, true, [
      CryptoKeyUsage.Sign
    ]);
    key = await exportPublicJwkFrom(privateKey);
  }
  const usages = [CryptoKeyUsage.Verify];
  if (typeof key === "object") {
    return await crypto.subtle.importKey("jwk", key, alg, false, usages);
  }
  if (key.includes("PUBLIC")) {
    return await crypto.subtle.importKey("spki", pemToBinary(key), alg, false, usages);
  }
  return await crypto.subtle.importKey("raw", utf8Encoder.encode(key), alg, false, usages);
}
__name(importPublicKey, "importPublicKey");
async function exportPublicJwkFrom(privateKey) {
  if (privateKey.type !== "private") {
    throw new Error(`unexpected key type: ${privateKey.type}`);
  }
  if (!privateKey.extractable) {
    throw new Error("unexpected private key is unextractable");
  }
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const { kty } = jwk;
  const { alg, e, n } = jwk;
  const { crv, x: x2, y } = jwk;
  return { kty, alg, e, n, crv, x: x2, y, key_ops: [CryptoKeyUsage.Verify] };
}
__name(exportPublicJwkFrom, "exportPublicJwkFrom");
function getKeyAlgorithm(name) {
  switch (name) {
    case "HS256":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-256"
        }
      };
    case "HS384":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-384"
        }
      };
    case "HS512":
      return {
        name: "HMAC",
        hash: {
          name: "SHA-512"
        }
      };
    case "RS256":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-256"
        }
      };
    case "RS384":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-384"
        }
      };
    case "RS512":
      return {
        name: "RSASSA-PKCS1-v1_5",
        hash: {
          name: "SHA-512"
        }
      };
    case "PS256":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-256"
        },
        saltLength: 32
      };
    case "PS384":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-384"
        },
        saltLength: 48
      };
    case "PS512":
      return {
        name: "RSA-PSS",
        hash: {
          name: "SHA-512"
        },
        saltLength: 64
      };
    case "ES256":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-256"
        },
        namedCurve: "P-256"
      };
    case "ES384":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-384"
        },
        namedCurve: "P-384"
      };
    case "ES512":
      return {
        name: "ECDSA",
        hash: {
          name: "SHA-512"
        },
        namedCurve: "P-521"
      };
    case "EdDSA":
      return {
        name: "Ed25519",
        namedCurve: "Ed25519"
      };
    default:
      throw new JwtAlgorithmNotImplemented(name);
  }
}
__name(getKeyAlgorithm, "getKeyAlgorithm");
function isCryptoKey(key) {
  const runtime = getRuntimeKey();
  if (runtime === "node" && !!crypto.webcrypto) {
    return key instanceof crypto.webcrypto.CryptoKey;
  }
  return key instanceof CryptoKey;
}
__name(isCryptoKey, "isCryptoKey");

// ../../node_modules/hono/dist/utils/jwt/jwt.js
var encodeJwtPart = /* @__PURE__ */ __name((part) => encodeBase64Url(utf8Encoder.encode(JSON.stringify(part)).buffer).replace(/=/g, ""), "encodeJwtPart");
var encodeSignaturePart = /* @__PURE__ */ __name((buf) => encodeBase64Url(buf).replace(/=/g, ""), "encodeSignaturePart");
var decodeJwtPart = /* @__PURE__ */ __name((part) => JSON.parse(utf8Decoder.decode(decodeBase64Url(part))), "decodeJwtPart");
function isTokenHeader(obj) {
  if (typeof obj === "object" && obj !== null) {
    const objWithAlg = obj;
    return "alg" in objWithAlg && Object.values(AlgorithmTypes).includes(objWithAlg.alg) && (!("typ" in objWithAlg) || objWithAlg.typ === "JWT");
  }
  return false;
}
__name(isTokenHeader, "isTokenHeader");
var sign = /* @__PURE__ */ __name(async (payload, privateKey, alg = "HS256") => {
  const encodedPayload = encodeJwtPart(payload);
  let encodedHeader;
  if (typeof privateKey === "object" && "alg" in privateKey) {
    alg = privateKey.alg;
    encodedHeader = encodeJwtPart({ alg, typ: "JWT", kid: privateKey.kid });
  } else {
    encodedHeader = encodeJwtPart({ alg, typ: "JWT" });
  }
  const partialToken = `${encodedHeader}.${encodedPayload}`;
  const signaturePart = await signing(privateKey, alg, utf8Encoder.encode(partialToken));
  const signature = encodeSignaturePart(signaturePart);
  return `${partialToken}.${signature}`;
}, "sign");
var verify = /* @__PURE__ */ __name(async (token, publicKey, algOrOptions) => {
  const {
    alg = "HS256",
    iss,
    nbf = true,
    exp = true,
    iat = true,
    aud
  } = typeof algOrOptions === "string" ? { alg: algOrOptions } : algOrOptions || {};
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new JwtTokenInvalid(token);
  }
  const { header, payload } = decode(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  const now = Date.now() / 1e3 | 0;
  if (nbf && payload.nbf && payload.nbf > now) {
    throw new JwtTokenNotBefore(token);
  }
  if (exp && payload.exp && payload.exp <= now) {
    throw new JwtTokenExpired(token);
  }
  if (iat && payload.iat && now < payload.iat) {
    throw new JwtTokenIssuedAt(now, payload.iat);
  }
  if (iss) {
    if (!payload.iss) {
      throw new JwtTokenIssuer(iss, null);
    }
    if (typeof iss === "string" && payload.iss !== iss) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
    if (iss instanceof RegExp && !iss.test(payload.iss)) {
      throw new JwtTokenIssuer(iss, payload.iss);
    }
  }
  if (aud) {
    if (!payload.aud) {
      throw new JwtPayloadRequiresAud(payload);
    }
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const matched = audiences.some(
      (payloadAud) => aud instanceof RegExp ? aud.test(payloadAud) : typeof aud === "string" ? payloadAud === aud : Array.isArray(aud) && aud.includes(payloadAud)
    );
    if (!matched) {
      throw new JwtTokenAudience(aud, payload.aud);
    }
  }
  const headerPayload = token.substring(0, token.lastIndexOf("."));
  const verified = await verifying(
    publicKey,
    alg,
    decodeBase64Url(tokenParts[2]),
    utf8Encoder.encode(headerPayload)
  );
  if (!verified) {
    throw new JwtTokenSignatureMismatched(token);
  }
  return payload;
}, "verify");
var verifyWithJwks = /* @__PURE__ */ __name(async (token, options, init) => {
  const verifyOpts = options.verification || {};
  const header = decodeHeader(token);
  if (!isTokenHeader(header)) {
    throw new JwtHeaderInvalid(header);
  }
  if (!header.kid) {
    throw new JwtHeaderRequiresKid(header);
  }
  if (options.jwks_uri) {
    const response = await fetch(options.jwks_uri, init);
    if (!response.ok) {
      throw new Error(`failed to fetch JWKS from ${options.jwks_uri}`);
    }
    const data = await response.json();
    if (!data.keys) {
      throw new Error('invalid JWKS response. "keys" field is missing');
    }
    if (!Array.isArray(data.keys)) {
      throw new Error('invalid JWKS response. "keys" field is not an array');
    }
    if (options.keys) {
      options.keys.push(...data.keys);
    } else {
      options.keys = data.keys;
    }
  } else if (!options.keys) {
    throw new Error('verifyWithJwks requires options for either "keys" or "jwks_uri" or both');
  }
  const matchingKey = options.keys.find((key) => key.kid === header.kid);
  if (!matchingKey) {
    throw new JwtTokenInvalid(token);
  }
  return await verify(token, matchingKey, {
    alg: matchingKey.alg || header.alg,
    ...verifyOpts
  });
}, "verifyWithJwks");
var decode = /* @__PURE__ */ __name((token) => {
  try {
    const [h, p2] = token.split(".");
    const header = decodeJwtPart(h);
    const payload = decodeJwtPart(p2);
    return {
      header,
      payload
    };
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decode");
var decodeHeader = /* @__PURE__ */ __name((token) => {
  try {
    const [h] = token.split(".");
    return decodeJwtPart(h);
  } catch {
    throw new JwtTokenInvalid(token);
  }
}, "decodeHeader");

// ../../node_modules/hono/dist/utils/jwt/index.js
var Jwt = { sign, verify, decode, verifyWithJwks };

// ../../node_modules/hono/dist/middleware/jwt/jwt.js
var verifyWithJwks2 = Jwt.verifyWithJwks;
var verify2 = Jwt.verify;
var decode2 = Jwt.decode;
var sign2 = Jwt.sign;

// src/routes-hono/auth.ts
var import_client = __toESM(require_default2(), 1);
var auth = new Hono2();
auth.post("/login", async (c) => {
  try {
    const { username, password, userType } = await c.req.json();
    const prisma = c.get("prisma");
    if (!username || !password || !userType) {
      return c.json({
        success: false,
        error: "Username, password, and userType are required"
      }, 400);
    }
    const normalizedType = userType.toUpperCase();
    const user = await prisma.user.findFirst({
      where: {
        username,
        type: normalizedType
      },
      include: {
        client: true,
        contractor: true
      }
    });
    if (!user) {
      return c.json({
        success: false,
        error: "Invalid credentials"
      }, 401);
    }
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return c.json({
        success: false,
        error: "Invalid credentials"
      }, 401);
    }
    const token = await sign2(
      {
        id: user.id,
        type: userType,
        exp: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60
        // 7 days
      },
      c.env.JWT_SECRET
    );
    if (userType === "client" && user.client) {
      return c.json({
        success: true,
        client: {
          id: user.client.id,
          username: user.username,
          type: "client",
          firstName: user.client.firstName,
          lastName: user.client.lastName,
          email: user.client.email,
          phone: user.client.phone,
          address: user.client.address,
          city: user.client.city,
          state: user.client.state,
          zip: user.client.zip
        },
        token
      });
    } else if (userType === "contractor" && user.contractor) {
      return c.json({
        success: true,
        contractor: {
          id: user.contractor.id,
          username: user.username,
          type: "contractor",
          name: user.contractor.name,
          rating: user.contractor.rating,
          review_count: user.contractor.reviewCount,
          description: user.contractor.description,
          years_in_business: user.contractor.yearsInBusiness,
          location: user.contractor.location,
          google_business_url: user.contractor.googleBusinessUrl
        },
        token
      });
    }
    return c.json({
      success: false,
      error: "User profile not found"
    }, 404);
  } catch (error3) {
    console.error("Login error:", error3);
    return c.json({
      success: false,
      error: "Internal server error"
    }, 500);
  }
});
auth.post("/create-account", async (c) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      accountType,
      yearsExperience
    } = await c.req.json();
    const prisma = c.get("prisma");
    if (!username || !password || !accountType) {
      return c.json({
        success: false,
        error: "Username, password, and accountType are required"
      }, 400);
    }
    if (accountType === "client" && (!firstName || !lastName || !email || !phone)) {
      return c.json({
        success: false,
        error: "First name, last name, email, and phone are required for clients"
      }, 400);
    }
    if (accountType === "contractor" && (!firstName || !lastName)) {
      return c.json({
        success: false,
        error: "First name and last name are required for contractors"
      }, 400);
    }
    const normalizedType = accountType.toUpperCase();
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        type: normalizedType
      }
    });
    if (existingUser) {
      return c.json({
        success: false,
        error: "Username already exists"
      }, 400);
    }
    const hashedPassword = await hashPassword(password);
    if (accountType === "client") {
      const result = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type: import_client.UserType.CLIENT,
          client: {
            create: {
              firstName,
              lastName,
              email,
              phone
            }
          }
        },
        include: {
          client: true
        }
      });
      return c.json({
        success: true,
        userId: result.id,
        message: "Client account created successfully"
      }, 201);
    } else if (accountType === "contractor") {
      const contractorName = `${firstName} ${lastName}`;
      const result = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type: import_client.UserType.CONTRACTOR,
          contractor: {
            create: {
              name: contractorName,
              yearsInBusiness: yearsExperience || 0,
              rating: 0,
              reviewCount: 0
            }
          }
        },
        include: {
          contractor: true
        }
      });
      return c.json({
        success: true,
        userId: result.id,
        message: "Contractor account created successfully"
      }, 201);
    }
    return c.json({
      success: false,
      error: "Invalid account type"
    }, 400);
  } catch (error3) {
    console.error("Create account error:", error3);
    return c.json({
      success: false,
      error: "Failed to create account"
    }, 500);
  }
});
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b2) => b2.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, hashedPassword) {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}
__name(verifyPassword, "verifyPassword");
var auth_default = auth;

// src/routes-hono/services.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var services = new Hono2();
services.get("/services", async (c) => {
  try {
    const prisma = c.get("prisma");
    const servicesList = await prisma.service.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        icon: true,
        description: true
      }
    });
    return c.json({
      success: true,
      services: servicesList
    });
  } catch (error3) {
    console.error("Get services error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch services"
    }, 500);
  }
});
services.get("/services/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        contractors: {
          include: {
            contractor: {
              select: {
                id: true,
                name: true,
                rating: true,
                reviewCount: true,
                location: true,
                verified: true,
                licensed: true
              }
            }
          }
        }
      }
    });
    if (!service) {
      return c.json({
        success: false,
        error: "Service not found"
      }, 404);
    }
    return c.json({
      success: true,
      service
    });
  } catch (error3) {
    console.error("Get service error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch service"
    }, 500);
  }
});
services.get("/contractors", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { minRating, location, verified, area } = c.req.query();
    const where = {};
    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating)
      };
    }
    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive"
      };
    }
    if (verified === "true") {
      where.verified = true;
    }
    if (area) {
      where.serviceAreas = {
        some: {
          area,
          isActive: true
        }
      };
    }
    const contractors = await prisma.contractor.findMany({
      where,
      select: {
        id: true,
        name: true,
        rating: true,
        reviewCount: true,
        description: true,
        yearsInBusiness: true,
        location: true,
        verified: true,
        licensed: true,
        services: {
          select: {
            basePrice: true,
            service: {
              select: {
                id: true,
                name: true,
                icon: true
              }
            }
          }
        },
        serviceAreas: {
          where: {
            isActive: true
          },
          select: {
            area: true,
            dayOfWeek: true
          }
        }
      },
      orderBy: [
        { verified: "desc" },
        { rating: "desc" },
        { reviewCount: "desc" }
      ]
    });
    return c.json({
      success: true,
      contractors,
      count: contractors.length
    });
  } catch (error3) {
    console.error("Get all contractors error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch contractors"
    }, 500);
  }
});
services.get("/contractors/by-service/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { minRating, location, verified } = c.req.query();
    const where = {
      services: {
        some: {
          serviceId: parseInt(id)
        }
      }
    };
    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating)
      };
    }
    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive"
      };
    }
    if (verified === "true") {
      where.verified = true;
    }
    const contractors = await prisma.contractor.findMany({
      where,
      select: {
        id: true,
        name: true,
        rating: true,
        reviewCount: true,
        description: true,
        yearsInBusiness: true,
        location: true,
        verified: true,
        licensed: true,
        services: {
          where: {
            serviceId: parseInt(id)
          },
          select: {
            basePrice: true,
            service: {
              select: {
                id: true,
                name: true,
                icon: true
              }
            }
          }
        },
        serviceAreas: {
          where: {
            isActive: true
          },
          select: {
            area: true,
            dayOfWeek: true
          }
        }
      },
      orderBy: [
        { verified: "desc" },
        { rating: "desc" },
        { reviewCount: "desc" }
      ]
    });
    return c.json({
      success: true,
      contractors,
      count: contractors.length
    });
  } catch (error3) {
    console.error("Get contractors by service error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch contractors"
    }, 500);
  }
});
services.get("/contractor-services/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const contractorServices = await prisma.contractorService.findMany({
      where: { contractorId: parseInt(contractorId) },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true
          }
        }
      }
    });
    const servicesList = contractorServices.map((cs) => cs.service);
    return c.json(servicesList);
  } catch (error3) {
    console.error("Get contractor services error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch contractor services"
    }, 500);
  }
});
services.get("/contractor-areas/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const serviceAreas = await prisma.contractorServiceArea.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isActive: true
      },
      select: {
        id: true,
        area: true,
        dayOfWeek: true
      }
    });
    const uniqueAreas = Array.from(new Set(serviceAreas.map((sa) => sa.area)));
    return c.json(uniqueAreas);
  } catch (error3) {
    console.error("Get contractor service areas error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch contractor service areas"
    }, 500);
  }
});
services.post("/contractor/areas", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId, areas } = await c.req.json();
    if (!contractorId || !Array.isArray(areas)) {
      return c.json({
        success: false,
        error: "Contractor ID and areas array are required"
      }, 400);
    }
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });
    if (!contractor) {
      return c.json({
        success: false,
        error: "Contractor not found"
      }, 404);
    }
    await prisma.contractorServiceArea.deleteMany({
      where: { contractorId }
    });
    const serviceAreaRecords = areas.flatMap(
      (area) => (
        // Create entries for Monday-Friday (1-5)
        [1, 2, 3, 4, 5].map((dayOfWeek) => ({
          contractorId,
          area,
          dayOfWeek,
          isActive: true
        }))
      )
    );
    const result = await prisma.contractorServiceArea.createMany({
      data: serviceAreaRecords
    });
    return c.json({
      success: true,
      message: "Service areas updated successfully",
      count: result.count
    });
  } catch (error3) {
    console.error("Update contractor service areas error:", error3);
    return c.json({
      success: false,
      error: "Failed to update service areas"
    }, 500);
  }
});
services.post("/contractor/services", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId, serviceIds } = await c.req.json();
    if (!contractorId || !Array.isArray(serviceIds)) {
      return c.json({
        success: false,
        error: "Contractor ID and service IDs array are required"
      }, 400);
    }
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });
    if (!contractor) {
      return c.json({
        success: false,
        error: "Contractor not found"
      }, 404);
    }
    await prisma.contractorService.deleteMany({
      where: { contractorId }
    });
    const contractorServices = await prisma.contractorService.createMany({
      data: serviceIds.map((serviceId) => ({
        contractorId,
        serviceId
      }))
    });
    return c.json({
      success: true,
      message: "Services updated successfully",
      count: contractorServices.count
    });
  } catch (error3) {
    console.error("Update contractor services error:", error3);
    return c.json({
      success: false,
      error: "Failed to update services"
    }, 500);
  }
});
var services_default = services;

// src/routes-hono/bookings.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_client2 = __toESM(require_default2(), 1);
var bookings = new Hono2();
bookings.post("/bookings", async (c) => {
  try {
    const prisma = c.get("prisma");
    const {
      contractorId,
      clientId,
      serviceId,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      price
    } = await c.req.json();
    if (!contractorId || !clientId || !serviceId || !serviceAddress || !scheduledDate || !scheduledTime) {
      return c.json({
        success: false,
        error: "All booking fields are required"
      }, 400);
    }
    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId }
    });
    if (!contractor) {
      return c.json({
        success: false,
        error: "Contractor not found"
      }, 404);
    }
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    if (!client) {
      return c.json({
        success: false,
        error: "Client not found"
      }, 404);
    }
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });
    if (!service) {
      return c.json({
        success: false,
        error: "Service not found"
      }, 404);
    }
    const booking = await prisma.booking.create({
      data: {
        contractorId,
        clientId,
        serviceId,
        serviceAddress,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        price: price || null,
        status: import_client2.BookingStatus.PENDING
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        }
      }
    });
    return c.json({
      success: true,
      booking,
      message: "Booking created successfully"
    }, 201);
  } catch (error3) {
    console.error("Create booking error:", error3);
    return c.json({
      success: false,
      error: "Failed to create booking"
    }, 500);
  }
});
bookings.get("/bookings/client/:clientId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId } = c.req.param();
    const { status } = c.req.query();
    const where = {
      clientId: parseInt(clientId)
    };
    if (status) {
      where.status = status;
    }
    const bookingsList = await prisma.booking.findMany({
      where,
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            rating: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        completion: true
      },
      orderBy: {
        scheduledDate: "desc"
      }
    });
    return c.json({
      success: true,
      bookings: bookingsList,
      count: bookingsList.length
    });
  } catch (error3) {
    console.error("Get client bookings error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch bookings"
    }, 500);
  }
});
bookings.get("/bookings/contractor/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { status, date } = c.req.query();
    const where = {
      contractorId: parseInt(contractorId)
    };
    if (status) {
      where.status = status;
    }
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.scheduledDate = {
        gte: targetDate,
        lt: nextDay
      };
    }
    const bookingsList = await prisma.booking.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            state: true,
            zip: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true
          }
        },
        completion: true
      },
      orderBy: {
        scheduledDate: "asc"
      }
    });
    return c.json({
      success: true,
      bookings: bookingsList,
      count: bookingsList.length
    });
  } catch (error3) {
    console.error("Get contractor bookings error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch bookings"
    }, 500);
  }
});
bookings.get("/bookings/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            rating: true,
            reviewCount: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            address: true,
            city: true,
            state: true,
            zip: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true
          }
        },
        completion: true,
        photos: true,
        invoice: true
      }
    });
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    return c.json({
      success: true,
      booking
    });
  } catch (error3) {
    console.error("Get booking error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch booking"
    }, 500);
  }
});
bookings.patch("/bookings/:id/status", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { status, price } = await c.req.json();
    if (!status || !Object.values(import_client2.BookingStatus).includes(status)) {
      return c.json({
        success: false,
        error: "Valid status is required"
      }, 400);
    }
    const updateData = { status };
    if (price !== void 0 && price !== null) {
      updateData.price = parseFloat(price);
    }
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return c.json({
      success: true,
      booking,
      message: "Booking status updated successfully"
    });
  } catch (error3) {
    console.error("Update booking status error:", error3);
    return c.json({
      success: false,
      error: "Failed to update booking status"
    }, 500);
  }
});
bookings.post("/bookings/:id/complete", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { startTime, endTime, materials, notes } = await c.req.json();
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    const result = await prisma.$transaction(async (tx) => {
      const completion = await tx.jobCompletion.create({
        data: {
          bookingId: parseInt(id),
          startTime: startTime ? new Date(startTime) : null,
          endTime: endTime ? new Date(endTime) : null,
          materials,
          notes
        }
      });
      const updatedBooking = await tx.booking.update({
        where: { id: parseInt(id) },
        data: { status: import_client2.BookingStatus.COMPLETED }
      });
      return { completion, booking: updatedBooking };
    });
    return c.json({
      success: true,
      completion: result.completion,
      message: "Job marked as complete"
    });
  } catch (error3) {
    console.error("Complete booking error:", error3);
    return c.json({
      success: false,
      error: "Failed to complete booking"
    }, 500);
  }
});
bookings.delete("/bookings/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: import_client2.BookingStatus.CANCELLED }
    });
    return c.json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error3) {
    console.error("Cancel booking error:", error3);
    return c.json({
      success: false,
      error: "Failed to cancel booking"
    }, 500);
  }
});
var bookings_default = bookings;

// src/routes-hono/profiles.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var profiles = new Hono2();
profiles.get("/client/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        }
      }
    });
    if (!client) {
      return c.json({
        success: false,
        error: "Client not found"
      }, 404);
    }
    return c.json({
      success: true,
      client
    });
  } catch (error3) {
    console.error("Get client profile error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch client profile"
    }, 500);
  }
});
profiles.put("/client/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      notificationEmail,
      notificationSms
    } = await c.req.json();
    const updateData = {};
    if (firstName !== void 0) updateData.firstName = firstName;
    if (lastName !== void 0) updateData.lastName = lastName;
    if (email !== void 0) updateData.email = email;
    if (phone !== void 0) updateData.phone = phone;
    if (address !== void 0) updateData.address = address;
    if (city !== void 0) updateData.city = city;
    if (state !== void 0) updateData.state = state;
    if (zip !== void 0) updateData.zip = zip;
    if (notificationEmail !== void 0) updateData.notificationEmail = notificationEmail;
    if (notificationSms !== void 0) updateData.notificationSms = notificationSms;
    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    return c.json({
      success: true,
      client,
      message: "Profile updated successfully"
    });
  } catch (error3) {
    console.error("Update client profile error:", error3);
    return c.json({
      success: false,
      error: "Failed to update profile"
    }, 500);
  }
});
profiles.get("/contractor/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                icon: true,
                description: true
              }
            }
          }
        },
        reviews: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      }
    });
    if (!contractor) {
      return c.json({
        success: false,
        error: "Contractor not found"
      }, 404);
    }
    return c.json({
      success: true,
      contractor
    });
  } catch (error3) {
    console.error("Get contractor profile error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch contractor profile"
    }, 500);
  }
});
profiles.put("/contractor/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const {
      name,
      email,
      phone,
      description,
      yearsInBusiness,
      location,
      googleBusinessUrl,
      verified,
      licensed
    } = await c.req.json();
    const updateData = {};
    if (name !== void 0) updateData.name = name;
    if (email !== void 0) updateData.email = email;
    if (phone !== void 0) updateData.phone = phone;
    if (description !== void 0) updateData.description = description;
    if (yearsInBusiness !== void 0) updateData.yearsInBusiness = yearsInBusiness;
    if (location !== void 0) updateData.location = location;
    if (googleBusinessUrl !== void 0) updateData.googleBusinessUrl = googleBusinessUrl;
    if (verified !== void 0) updateData.verified = verified;
    if (licensed !== void 0) updateData.licensed = licensed;
    const contractor = await prisma.contractor.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    return c.json({
      success: true,
      contractor,
      message: "Profile updated successfully"
    });
  } catch (error3) {
    console.error("Update contractor profile error:", error3);
    return c.json({
      success: false,
      error: "Failed to update profile"
    }, 500);
  }
});
profiles.get("/contractor/:id/availability", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { startDate, endDate } = c.req.query();
    const where = {
      contractorId: parseInt(id)
    };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    const availability2 = await prisma.availability.findMany({
      where,
      orderBy: {
        date: "asc"
      }
    });
    return c.json({
      success: true,
      availability: availability2
    });
  } catch (error3) {
    console.error("Get availability error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch availability"
    }, 500);
  }
});
profiles.post("/contractor/:id/availability", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { date, startTime, endTime, isAvailable } = await c.req.json();
    if (!date || !startTime || !endTime) {
      return c.json({
        success: false,
        error: "Date, start time, and end time are required"
      }, 400);
    }
    const availability2 = await prisma.availability.create({
      data: {
        contractorId: parseInt(id),
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: isAvailable !== void 0 ? isAvailable : true
      }
    });
    return c.json({
      success: true,
      availability: availability2,
      message: "Availability added successfully"
    }, 201);
  } catch (error3) {
    console.error("Add availability error:", error3);
    return c.json({
      success: false,
      error: "Failed to add availability"
    }, 500);
  }
});
profiles.delete("/contractor/availability/:availabilityId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { availabilityId } = c.req.param();
    await prisma.availability.delete({
      where: { id: parseInt(availabilityId) }
    });
    return c.json({
      success: true,
      message: "Availability deleted successfully"
    });
  } catch (error3) {
    console.error("Delete availability error:", error3);
    return c.json({
      success: false,
      error: "Failed to delete availability"
    }, 500);
  }
});
var profiles_default = profiles;

// src/routes-hono/favorites.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var favorites = new Hono2();
favorites.get("/favorites/client/:clientId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId } = c.req.param();
    const favoritesList = await prisma.favoriteContractor.findMany({
      where: {
        clientId: parseInt(clientId)
      },
      include: {
        contractor: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const transformedFavorites = favoritesList.map((fav) => ({
      id: fav.contractor.id,
      name: fav.contractor.name,
      rating: fav.contractor.rating,
      reviewCount: fav.contractor.reviewCount,
      verified: fav.contractor.verified,
      services: fav.contractor.services.map((s) => s.service.name),
      favoritedAt: fav.createdAt
    }));
    return c.json({
      success: true,
      favorites: transformedFavorites
    });
  } catch (error3) {
    console.error("Error fetching favorites:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch favorites"
    }, 500);
  }
});
favorites.post("/favorites", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId, contractorId } = await c.req.json();
    if (!clientId || !contractorId) {
      return c.json({
        success: false,
        error: "clientId and contractorId are required"
      }, 400);
    }
    const existing = await prisma.favoriteContractor.findUnique({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });
    if (existing) {
      return c.json({
        success: false,
        error: "Contractor already in favorites"
      }, 400);
    }
    const favorite = await prisma.favoriteContractor.create({
      data: {
        clientId: parseInt(clientId),
        contractorId: parseInt(contractorId)
      },
      include: {
        contractor: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      }
    });
    return c.json({
      success: true,
      favorite: {
        id: favorite.contractor.id,
        name: favorite.contractor.name,
        rating: favorite.contractor.rating,
        reviewCount: favorite.contractor.reviewCount,
        verified: favorite.contractor.verified,
        services: favorite.contractor.services.map((s) => s.service.name),
        favoritedAt: favorite.createdAt
      }
    });
  } catch (error3) {
    console.error("Error adding favorite:", error3);
    return c.json({
      success: false,
      error: "Failed to add favorite"
    }, 500);
  }
});
favorites.delete("/favorites/:clientId/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId, contractorId } = c.req.param();
    await prisma.favoriteContractor.delete({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });
    return c.json({
      success: true,
      message: "Contractor removed from favorites"
    });
  } catch (error3) {
    console.error("Error removing favorite:", error3);
    return c.json({
      success: false,
      error: "Failed to remove favorite"
    }, 500);
  }
});
favorites.get("/favorites/check/:clientId/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId, contractorId } = c.req.param();
    const favorite = await prisma.favoriteContractor.findUnique({
      where: {
        clientId_contractorId: {
          clientId: parseInt(clientId),
          contractorId: parseInt(contractorId)
        }
      }
    });
    return c.json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error3) {
    console.error("Error checking favorite:", error3);
    return c.json({
      success: false,
      error: "Failed to check favorite status"
    }, 500);
  }
});
var favorites_default = favorites;

// src/routes-hono/messages.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_client3 = __toESM(require_default2(), 1);
var messages = new Hono2();
messages.post("/messages", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId, clientId, subject } = await c.req.json();
    if (!contractorId || !clientId) {
      return c.json({
        success: false,
        error: "Contractor ID and client ID are required"
      }, 400);
    }
    const existingMessage = await prisma.message.findFirst({
      where: {
        contractorId,
        clientId
      }
    });
    if (existingMessage) {
      return c.json({
        success: true,
        message: existingMessage,
        isNew: false
      });
    }
    const message = await prisma.message.create({
      data: {
        contractorId,
        clientId,
        subject: subject || "New Conversation",
        status: import_client3.MessageStatus.UNREAD
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    return c.json({
      success: true,
      message,
      isNew: true
    }, 201);
  } catch (error3) {
    console.error("Create message error:", error3);
    return c.json({
      success: false,
      error: "Failed to create message"
    }, 500);
  }
});
messages.get("/messages/contractor/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const messagesList = await prisma.message.findMany({
      where: {
        contractorId: parseInt(contractorId)
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        chatMessages: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    return c.json({
      success: true,
      messages: messagesList,
      count: messagesList.length
    });
  } catch (error3) {
    console.error("Get contractor messages error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch messages"
    }, 500);
  }
});
messages.get("/messages/client/:clientId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId } = c.req.param();
    const messagesList = await prisma.message.findMany({
      where: {
        clientId: parseInt(clientId)
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            rating: true
          }
        },
        chatMessages: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    return c.json({
      success: true,
      messages: messagesList,
      count: messagesList.length
    });
  } catch (error3) {
    console.error("Get client messages error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch messages"
    }, 500);
  }
});
messages.get("/messages/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        chatMessages: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });
    if (!message) {
      return c.json({
        success: false,
        error: "Conversation not found"
      }, 404);
    }
    return c.json({
      success: true,
      message
    });
  } catch (error3) {
    console.error("Get message error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch message"
    }, 500);
  }
});
messages.post("/messages/:id/chat", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { sender, messageText } = await c.req.json();
    if (!sender || !messageText) {
      return c.json({
        success: false,
        error: "Sender and message text are required"
      }, 400);
    }
    if (!["CONTRACTOR", "CLIENT"].includes(sender)) {
      return c.json({
        success: false,
        error: "Sender must be CONTRACTOR or CLIENT"
      }, 400);
    }
    const conversation = await prisma.message.findUnique({
      where: { id: parseInt(id) }
    });
    if (!conversation) {
      return c.json({
        success: false,
        error: "Conversation not found"
      }, 404);
    }
    const chatMessage = await prisma.chatMessage.create({
      data: {
        messageId: parseInt(id),
        sender,
        messageText
      }
    });
    await prisma.message.update({
      where: { id: parseInt(id) },
      data: {
        status: import_client3.MessageStatus.UNREAD,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return c.json({
      success: true,
      chatMessage,
      message: "Message sent successfully"
    }, 201);
  } catch (error3) {
    console.error("Send chat message error:", error3);
    return c.json({
      success: false,
      error: "Failed to send message"
    }, 500);
  }
});
messages.patch("/messages/:id/read", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const message = await prisma.message.update({
      where: { id: parseInt(id) },
      data: { status: import_client3.MessageStatus.READ }
    });
    return c.json({
      success: true,
      message
    });
  } catch (error3) {
    console.error("Mark as read error:", error3);
    return c.json({
      success: false,
      error: "Failed to mark as read"
    }, 500);
  }
});
messages.post("/flag-message", async (c) => {
  try {
    const prisma = c.get("prisma");
    const {
      messageId,
      messageText,
      flaggedBy,
      flaggedById,
      contractorId,
      clientId,
      reason,
      details
    } = await c.req.json();
    if (!messageText || !flaggedBy || !flaggedById || !reason) {
      return c.json({
        success: false,
        error: "Message text, flagged by info, and reason are required"
      }, 400);
    }
    if (!["CONTRACTOR", "CLIENT"].includes(flaggedBy)) {
      return c.json({
        success: false,
        error: "Flagged by must be CONTRACTOR or CLIENT"
      }, 400);
    }
    const flaggedMessage = await prisma.flaggedMessage.create({
      data: {
        messageId: messageId || null,
        messageText,
        flaggedBy,
        flaggedById,
        contractorId: contractorId || null,
        clientId: clientId || null,
        reason,
        details: details || null,
        status: import_client3.FlagStatus.PENDING
      }
    });
    return c.json({
      success: true,
      flaggedMessage,
      message: "Message flagged successfully"
    }, 201);
  } catch (error3) {
    console.error("Flag message error:", error3);
    return c.json({
      success: false,
      error: "Failed to flag message"
    }, 500);
  }
});
messages.get("/flagged-messages", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { status } = c.req.query();
    const where = {};
    if (status) {
      where.status = status;
    }
    const flaggedMessages = await prisma.flaggedMessage.findMany({
      where,
      include: {
        contractor: {
          select: {
            id: true,
            name: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return c.json({
      success: true,
      flaggedMessages,
      count: flaggedMessages.length
    });
  } catch (error3) {
    console.error("Get flagged messages error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch flagged messages"
    }, 500);
  }
});
messages.patch("/flagged-messages/:id/status", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { status, reviewedBy, adminNote } = await c.req.json();
    if (!status || !Object.values(import_client3.FlagStatus).includes(status)) {
      return c.json({
        success: false,
        error: "Valid status is required"
      }, 400);
    }
    const existingFlag = await prisma.flaggedMessage.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: true,
        contractor: true
      }
    });
    const flaggedMessage = await prisma.flaggedMessage.update({
      where: { id: parseInt(id) },
      data: {
        status,
        reviewedBy: reviewedBy || null,
        reviewedAt: /* @__PURE__ */ new Date(),
        details: adminNote ? `${adminNote}` : void 0
      }
    });
    if (status === "DISMISSED" && existingFlag) {
      await prisma.activityLog.create({
        data: {
          userId: reviewedBy || 1,
          action: "Flag Dismissed",
          details: `Dismissed flag #${id}. Message from ${existingFlag.flaggedBy.toLowerCase()}. Reason: ${existingFlag.reason}. ${adminNote || "No additional notes."}`,
          severity: "LOW",
          metadata: {
            flagId: parseInt(id),
            flagReason: existingFlag.reason,
            flaggedBy: existingFlag.flaggedBy
          }
        }
      });
    }
    return c.json({
      success: true,
      flaggedMessage,
      message: "Flagged message status updated"
    });
  } catch (error3) {
    console.error("Update flagged message error:", error3);
    return c.json({
      success: false,
      error: "Failed to update flagged message"
    }, 500);
  }
});
messages.post("/admin/user-action", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { userId, userType, action, reason, adminNote, flagId } = await c.req.json();
    if (!userId || !userType || !action) {
      return c.json({
        success: false,
        error: "userId, userType, and action are required"
      }, 400);
    }
    const validActions = ["WARN", "SUSPEND", "BAN"];
    if (!validActions.includes(action)) {
      return c.json({
        success: false,
        error: "Invalid action. Must be WARN, SUSPEND, or BAN"
      }, 400);
    }
    let updateData = {};
    if (action === "WARN") {
      console.log(`WARNING issued to ${userType} ${userId}: ${reason}`);
    } else if (action === "SUSPEND") {
      const suspendUntil = /* @__PURE__ */ new Date();
      suspendUntil.setDate(suspendUntil.getDate() + 7);
      updateData.suspendedUntil = suspendUntil;
      updateData.isActive = false;
    } else if (action === "BAN") {
      updateData.isActive = false;
      updateData.isBanned = true;
    }
    let updatedUser;
    if (userType === "CLIENT") {
      updatedUser = await prisma.client.update({
        where: { id: userId },
        data: updateData
      });
    } else if (userType === "CONTRACTOR") {
      updatedUser = await prisma.contractor.update({
        where: { id: userId },
        data: updateData
      });
    } else {
      return c.json({
        success: false,
        error: "Invalid userType. Must be CLIENT or CONTRACTOR"
      }, 400);
    }
    const userName = userType === "CLIENT" ? `${updatedUser.firstName} ${updatedUser.lastName}` : updatedUser.name;
    await prisma.activityLog.create({
      data: {
        userId: 1,
        // TODO: Replace with actual admin user ID from session
        action: `User ${action}`,
        details: `${action} ${userType.toLowerCase()} "${userName}" (ID: ${userId}). Reason: ${reason || "N/A"}. ${adminNote || ""}`,
        severity: action === "BAN" ? "HIGH" : action === "SUSPEND" ? "MEDIUM" : "LOW",
        metadata: {
          actionType: action,
          targetUserId: userId,
          targetUserType: userType,
          flagId: flagId || null,
          reason: reason || null
        }
      }
    });
    return c.json({
      success: true,
      message: `User ${action.toLowerCase()}ed successfully`,
      user: updatedUser
    });
  } catch (error3) {
    console.error("Admin user action error:", error3);
    return c.json({
      success: false,
      error: "Failed to perform admin action"
    }, 500);
  }
});
messages.post("/admin/delete-message", async (c) => {
  try {
    const { flagId, messageId, adminNote } = await c.req.json();
    if (!flagId) {
      return c.json({
        success: false,
        error: "flagId is required"
      }, 400);
    }
    if (messageId) {
      console.log(`Message ${messageId} marked for deletion by admin`);
    }
    return c.json({
      success: true,
      message: "Message deletion processed"
    });
  } catch (error3) {
    console.error("Delete message error:", error3);
    return c.json({
      success: false,
      error: "Failed to delete message"
    }, 500);
  }
});
var messages_default = messages;

// src/routes-hono/invoices.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_client4 = __toESM(require_default2(), 1);
var invoices = new Hono2();
invoices.get("/invoices/client/:clientId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { clientId } = c.req.param();
    const invoicesList = await prisma.invoice.findMany({
      where: {
        booking: {
          clientId: parseInt(clientId)
        }
      },
      include: {
        booking: {
          include: {
            contractor: true,
            service: true
          }
        },
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const transformedInvoices = invoicesList.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: `INV-${invoice.id.toString().padStart(6, "0")}`,
      service: invoice.booking.service.name,
      provider: invoice.booking.contractor.name,
      providerId: invoice.booking.contractor.id,
      date: invoice.booking.scheduledDate.toISOString().split("T")[0],
      dueDate: invoice.dueDate?.toISOString().split("T")[0] || null,
      amount: invoice.amount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      status: invoice.status === import_client4.InvoiceStatus.PAID ? "paid" : "unpaid",
      description: `${invoice.booking.service.name} service`,
      paidDate: invoice.paidAt?.toISOString().split("T")[0] || null,
      bookingId: invoice.bookingId
    }));
    return c.json({
      success: true,
      invoices: transformedInvoices
    });
  } catch (error3) {
    console.error("Error fetching invoices:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch invoices"
    }, 500);
  }
});
invoices.get("/invoices/contractor/:contractorId", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const invoicesList = await prisma.invoice.findMany({
      where: {
        booking: {
          contractorId: parseInt(contractorId)
        }
      },
      include: {
        booking: {
          include: {
            client: true,
            service: true
          }
        },
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const transformedInvoices = invoicesList.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: `INV-${invoice.id.toString().padStart(6, "0")}`,
      service: invoice.booking.service.name,
      client: `${invoice.booking.client.firstName} ${invoice.booking.client.lastName}`,
      clientId: invoice.booking.client.id,
      date: invoice.booking.scheduledDate.toISOString().split("T")[0],
      dueDate: invoice.dueDate?.toISOString().split("T")[0] || null,
      amount: invoice.amount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      status: invoice.status === import_client4.InvoiceStatus.PAID ? "paid" : "unpaid",
      description: `${invoice.booking.service.name} service`,
      paidDate: invoice.paidAt?.toISOString().split("T")[0] || null,
      bookingId: invoice.bookingId
    }));
    return c.json({
      success: true,
      invoices: transformedInvoices
    });
  } catch (error3) {
    console.error("Error fetching invoices:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch invoices"
    }, 500);
  }
});
invoices.get("/invoices/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        booking: {
          include: {
            contractor: true,
            client: true,
            service: true
          }
        },
        payments: true
      }
    });
    if (!invoice) {
      return c.json({
        success: false,
        error: "Invoice not found"
      }, 404);
    }
    return c.json({
      success: true,
      invoice
    });
  } catch (error3) {
    console.error("Error fetching invoice:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch invoice"
    }, 500);
  }
});
invoices.post("/invoices", async (c) => {
  try {
    const prisma = c.get("prisma");
    const {
      bookingId,
      amount,
      taxAmount,
      dueDate
    } = await c.req.json();
    if (!bookingId || !amount) {
      return c.json({
        success: false,
        error: "bookingId and amount are required"
      }, 400);
    }
    const totalAmount = amount + (taxAmount || 0);
    const invoice = await prisma.invoice.create({
      data: {
        bookingId: parseInt(bookingId),
        amount,
        taxAmount: taxAmount || null,
        totalAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: import_client4.InvoiceStatus.PENDING
      },
      include: {
        booking: {
          include: {
            contractor: true,
            client: true,
            service: true
          }
        }
      }
    });
    return c.json({
      success: true,
      invoice,
      message: "Invoice created successfully"
    }, 201);
  } catch (error3) {
    console.error("Error creating invoice:", error3);
    return c.json({
      success: false,
      error: "Failed to create invoice"
    }, 500);
  }
});
invoices.patch("/invoices/:id/status", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { status } = await c.req.json();
    if (!status || !Object.values(import_client4.InvoiceStatus).includes(status)) {
      return c.json({
        success: false,
        error: "Valid status is required (PENDING, PAID, OVERDUE, CANCELLED)"
      }, 400);
    }
    const updateData = { status };
    if (status === import_client4.InvoiceStatus.PAID) {
      updateData.paidAt = /* @__PURE__ */ new Date();
    }
    const invoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        booking: true
      }
    });
    if (status === import_client4.InvoiceStatus.PAID) {
      await prisma.booking.update({
        where: { id: invoice.bookingId },
        data: { paymentReceived: true }
      });
    }
    return c.json({
      success: true,
      invoice,
      message: "Invoice status updated successfully"
    });
  } catch (error3) {
    console.error("Error updating invoice status:", error3);
    return c.json({
      success: false,
      error: "Failed to update invoice status"
    }, 500);
  }
});
invoices.delete("/invoices/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    await prisma.invoice.delete({
      where: { id: parseInt(id) }
    });
    return c.json({
      success: true,
      message: "Invoice deleted successfully"
    });
  } catch (error3) {
    console.error("Error deleting invoice:", error3);
    return c.json({
      success: false,
      error: "Failed to delete invoice"
    }, 500);
  }
});
var invoices_default = invoices;

// src/routes-hono/admin.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var admin = new Hono2();
admin.get("/admin/users", async (c) => {
  try {
    const prisma = c.get("prisma");
    const clients = await prisma.client.findMany({
      include: {
        user: true,
        bookings: true
      }
    });
    const contractors = await prisma.contractor.findMany({
      include: {
        user: true,
        bookings: true
      }
    });
    const clientUsers = clients.map((client) => ({
      id: `client-${client.id}`,
      // Unique composite key
      originalId: client.id,
      // Keep original ID for operations
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      phone: client.phone,
      type: "client",
      status: "active",
      // TODO: Add status field to schema
      joinDate: client.createdAt.toISOString().split("T")[0],
      totalJobs: client.bookings.length,
      totalSpent: client.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)
    }));
    const contractorUsers = contractors.map((contractor) => ({
      id: `contractor-${contractor.id}`,
      // Unique composite key
      originalId: contractor.id,
      // Keep original ID for operations
      name: contractor.name,
      email: contractor.email || "",
      phone: contractor.phone || "",
      type: "contractor",
      status: "active",
      joinDate: contractor.createdAt.toISOString().split("T")[0],
      totalJobs: contractor.bookings.length,
      totalEarned: contractor.bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)
    }));
    return c.json({
      success: true,
      users: [...clientUsers, ...contractorUsers]
    });
  } catch (error3) {
    console.error("Error fetching users:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch users"
    }, 500);
  }
});
admin.get("/admin/services", async (c) => {
  try {
    const prisma = c.get("prisma");
    const services2 = await prisma.service.findMany({
      include: {
        contractors: true
      }
    });
    const transformedServices = services2.map((service) => ({
      id: service.id,
      name: service.name,
      category: "General",
      // TODO: Add category field to schema
      description: service.description || "",
      active: true,
      // All services are active by default
      contractorCount: service.contractors.length
    }));
    return c.json({
      success: true,
      services: transformedServices
    });
  } catch (error3) {
    console.error("Error fetching services:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch services"
    }, 500);
  }
});
admin.get("/admin/flagged-messages", async (c) => {
  try {
    const prisma = c.get("prisma");
    const flaggedMessages = await prisma.flaggedMessage.findMany({
      include: {
        client: true,
        contractor: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const transformed = flaggedMessages.map((flag) => ({
      id: flag.id,
      conversationId: flag.messageId,
      clientName: flag.client ? `${flag.client.firstName} ${flag.client.lastName}` : "Unknown",
      contractorName: flag.contractor ? flag.contractor.name : "Unknown",
      sender: flag.flaggedBy === "CLIENT" ? "client" : "contractor",
      message: flag.messageText,
      timestamp: new Date(flag.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
      flagged: true,
      reason: flag.reason,
      details: flag.details,
      status: flag.status.toLowerCase()
    }));
    return c.json({
      success: true,
      messages: transformed
    });
  } catch (error3) {
    console.error("Error fetching flagged messages:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch flagged messages"
    }, 500);
  }
});
admin.put("/admin/services/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { name, description } = await c.req.json();
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description
      }
    });
    return c.json({
      success: true,
      service
    });
  } catch (error3) {
    console.error("Error updating service:", error3);
    return c.json({
      success: false,
      error: "Failed to update service"
    }, 500);
  }
});
admin.delete("/admin/services/:id", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    await prisma.service.delete({
      where: { id: parseInt(id) }
    });
    return c.json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error3) {
    console.error("Error deleting service:", error3);
    return c.json({
      success: false,
      error: "Failed to delete service"
    }, 500);
  }
});
admin.patch("/admin/flagged-messages/:id/status", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { id } = c.req.param();
    const { status } = await c.req.json();
    const flaggedMessage = await prisma.flaggedMessage.update({
      where: { id: parseInt(id) },
      data: {
        status: status.toUpperCase(),
        reviewedAt: /* @__PURE__ */ new Date()
      }
    });
    return c.json({
      success: true,
      message: flaggedMessage
    });
  } catch (error3) {
    console.error("Error updating flagged message status:", error3);
    return c.json({
      success: false,
      error: "Failed to update status"
    }, 500);
  }
});
admin.get("/admin/activity-logs", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { limit = "50", severity } = c.req.query();
    const where = {};
    if (severity && ["LOW", "MEDIUM", "HIGH"].includes(severity)) {
      where.severity = severity;
    }
    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take: parseInt(limit)
    });
    const transformedLogs = logs.map((log3) => ({
      id: log3.id,
      user: "Admin",
      // TODO: Get actual admin username from userId
      action: log3.action,
      details: log3.details,
      timestamp: log3.createdAt.toISOString(),
      severity: log3.severity.toLowerCase()
    }));
    return c.json({
      success: true,
      logs: transformedLogs
    });
  } catch (error3) {
    console.error("Error fetching activity logs:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch activity logs"
    }, 500);
  }
});
var admin_default = admin;

// src/routes-hono/availability.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/utils/availability-edge.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var import_client5 = __toESM(require_default2(), 1);
async function getContractorAvailability(prisma, contractorId, date) {
  const dayOfWeek = date.getDay();
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  const specificOverride = await prisma.availability.findFirst({
    where: {
      contractorId,
      isRecurring: false,
      specificDate: dateOnly
    }
  });
  if (specificOverride) {
    if (!specificOverride.isAvailable) {
      return {
        date: dateOnly,
        dayOfWeek,
        isAvailable: false,
        reason: "Contractor unavailable on this date",
        availableSlots: 0,
        maxBookings: 0,
        confirmedBookings: 0,
        startTime: null,
        endTime: null
      };
    }
    const confirmedBookings2 = await prisma.booking.count({
      where: {
        contractorId,
        scheduledDate: dateOnly,
        status: {
          in: [import_client5.BookingStatus.CONFIRMED, import_client5.BookingStatus.IN_PROGRESS]
        }
      }
    });
    const availableSlots2 = specificOverride.maxBookings - confirmedBookings2;
    return {
      date: dateOnly,
      dayOfWeek,
      isAvailable: availableSlots2 > 0,
      reason: availableSlots2 > 0 ? "Available" : "Fully booked",
      availableSlots: availableSlots2,
      maxBookings: specificOverride.maxBookings,
      confirmedBookings: confirmedBookings2,
      startTime: specificOverride.startTime,
      endTime: specificOverride.endTime
    };
  }
  const generalSchedule = await prisma.availability.findFirst({
    where: {
      contractorId,
      isRecurring: true,
      dayOfWeek
    }
  });
  if (!generalSchedule || !generalSchedule.isAvailable) {
    return {
      date: dateOnly,
      dayOfWeek,
      isAvailable: false,
      reason: "Contractor does not work on this day",
      availableSlots: 0,
      maxBookings: 0,
      confirmedBookings: 0,
      startTime: null,
      endTime: null
    };
  }
  const confirmedBookings = await prisma.booking.count({
    where: {
      contractorId,
      scheduledDate: dateOnly,
      status: {
        in: [import_client5.BookingStatus.CONFIRMED, import_client5.BookingStatus.IN_PROGRESS]
      }
    }
  });
  const availableSlots = generalSchedule.maxBookings - confirmedBookings;
  return {
    date: dateOnly,
    dayOfWeek,
    isAvailable: availableSlots > 0,
    reason: availableSlots > 0 ? "Available" : "Fully booked",
    availableSlots,
    maxBookings: generalSchedule.maxBookings,
    confirmedBookings,
    startTime: generalSchedule.startTime,
    endTime: generalSchedule.endTime
  };
}
__name(getContractorAvailability, "getContractorAvailability");
async function getContractorAvailabilityRange(prisma, contractorId, startDate, endDate) {
  const availabilities = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  while (currentDate <= end) {
    const availability2 = await getContractorAvailability(prisma, contractorId, new Date(currentDate));
    availabilities.push(availability2);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return availabilities;
}
__name(getContractorAvailabilityRange, "getContractorAvailabilityRange");
async function canAcceptBooking(prisma, contractorId, date) {
  const availability2 = await getContractorAvailability(prisma, contractorId, date);
  return availability2.isAvailable && availability2.availableSlots > 0;
}
__name(canAcceptBooking, "canAcceptBooking");
async function getNextAvailableDate(prisma, contractorId, startDate = /* @__PURE__ */ new Date(), maxDaysAhead = 30) {
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  for (let i = 0; i < maxDaysAhead; i++) {
    const availability2 = await getContractorAvailability(prisma, contractorId, currentDate);
    if (availability2.isAvailable && availability2.availableSlots > 0) {
      return new Date(currentDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return null;
}
__name(getNextAvailableDate, "getNextAvailableDate");

// src/routes-hono/availability.ts
var availability = new Hono2();
availability.get("/availability/contractor/:contractorId/date/:date", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId, date } = c.req.param();
    const targetDate = new Date(date);
    const availabilityData = await getContractorAvailability(
      prisma,
      parseInt(contractorId),
      targetDate
    );
    return c.json({
      success: true,
      availability: availabilityData
    });
  } catch (error3) {
    console.error("Get contractor availability error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch availability"
    }, 500);
  }
});
availability.get("/availability/contractor/:contractorId/range", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { startDate, endDate } = c.req.query();
    if (!startDate || !endDate) {
      return c.json({
        success: false,
        error: "Start date and end date are required"
      }, 400);
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const availabilities = await getContractorAvailabilityRange(
      prisma,
      parseInt(contractorId),
      start,
      end
    );
    return c.json({
      success: true,
      availabilities,
      count: availabilities.length
    });
  } catch (error3) {
    console.error("Get contractor availability range error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch availability range"
    }, 500);
  }
});
availability.get("/availability/contractor/:contractorId/next", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { startDate, maxDays } = c.req.query();
    const start = startDate ? new Date(startDate) : /* @__PURE__ */ new Date();
    const maxDaysAhead = maxDays ? parseInt(maxDays) : 30;
    const nextAvailable = await getNextAvailableDate(
      prisma,
      parseInt(contractorId),
      start,
      maxDaysAhead
    );
    if (!nextAvailable) {
      return c.json({
        success: true,
        available: false,
        message: `No availability found in the next ${maxDaysAhead} days`
      });
    }
    return c.json({
      success: true,
      available: true,
      date: nextAvailable
    });
  } catch (error3) {
    console.error("Get next available date error:", error3);
    return c.json({
      success: false,
      error: "Failed to find next available date"
    }, 500);
  }
});
availability.post("/availability/contractor/:contractorId/check", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { date } = await c.req.json();
    if (!date) {
      return c.json({
        success: false,
        error: "Date is required"
      }, 400);
    }
    const targetDate = new Date(date);
    const canBook = await canAcceptBooking(prisma, parseInt(contractorId), targetDate);
    return c.json({
      success: true,
      canBook,
      date: targetDate
    });
  } catch (error3) {
    console.error("Check booking availability error:", error3);
    return c.json({
      success: false,
      error: "Failed to check booking availability"
    }, 500);
  }
});
availability.get("/availability/contractor/:contractorId/schedule", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const schedule = await prisma.availability.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: true
      },
      orderBy: {
        dayOfWeek: "asc"
      }
    });
    const serviceAreas = await prisma.contractorServiceArea.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isActive: true
      }
    });
    const areasByDay = {};
    serviceAreas.forEach((sa) => {
      if (sa.dayOfWeek !== null) {
        if (!areasByDay[sa.dayOfWeek]) {
          areasByDay[sa.dayOfWeek] = [];
        }
        areasByDay[sa.dayOfWeek].push(sa.area);
      }
    });
    const scheduleWithAreas = schedule.map((entry) => ({
      ...entry,
      serviceAreas: areasByDay[entry.dayOfWeek || 0] || []
    }));
    return c.json({
      success: true,
      schedule: scheduleWithAreas
    });
  } catch (error3) {
    console.error("Get contractor schedule error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch contractor schedule"
    }, 500);
  }
});
availability.post("/availability/contractor/:contractorId/schedule", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { schedule } = await c.req.json();
    if (!Array.isArray(schedule)) {
      return c.json({
        success: false,
        error: "Schedule must be an array"
      }, 400);
    }
    await prisma.availability.deleteMany({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: true
      }
    });
    await prisma.contractorServiceArea.deleteMany({
      where: {
        contractorId: parseInt(contractorId)
      }
    });
    const created = await prisma.availability.createMany({
      data: schedule.map((entry) => ({
        contractorId: parseInt(contractorId),
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        maxBookings: entry.maxBookings || 8,
        isAvailable: entry.isAvailable !== false,
        isRecurring: true
      }))
    });
    const serviceAreaData = [];
    schedule.forEach((entry) => {
      if (entry.serviceAreas && Array.isArray(entry.serviceAreas)) {
        entry.serviceAreas.forEach((area) => {
          serviceAreaData.push({
            contractorId: parseInt(contractorId),
            dayOfWeek: entry.dayOfWeek,
            area,
            isActive: true
          });
        });
      }
    });
    let serviceAreasCreated = 0;
    if (serviceAreaData.length > 0) {
      const result = await prisma.contractorServiceArea.createMany({
        data: serviceAreaData
      });
      serviceAreasCreated = result.count;
    }
    return c.json({
      success: true,
      message: "Schedule and service areas updated successfully",
      scheduleCount: created.count,
      serviceAreasCount: serviceAreasCreated
    });
  } catch (error3) {
    console.error("Update contractor schedule error:", error3);
    return c.json({
      success: false,
      error: "Failed to update schedule"
    }, 500);
  }
});
availability.post("/availability/contractor/:contractorId/override", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { specificDate, startTime, endTime, maxBookings, isAvailable } = await c.req.json();
    if (!specificDate) {
      return c.json({
        success: false,
        error: "Date is required"
      }, 400);
    }
    const targetDate = new Date(specificDate);
    targetDate.setHours(0, 0, 0, 0);
    const existing = await prisma.availability.findFirst({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: false,
        specificDate: targetDate
      }
    });
    if (existing) {
      const updated = await prisma.availability.update({
        where: { id: existing.id },
        data: {
          startTime: startTime || existing.startTime,
          endTime: endTime || existing.endTime,
          maxBookings: maxBookings || existing.maxBookings,
          isAvailable: isAvailable !== void 0 ? isAvailable : existing.isAvailable
        }
      });
      return c.json({
        success: true,
        message: "Date override updated",
        override: updated
      });
    }
    const override = await prisma.availability.create({
      data: {
        contractorId: parseInt(contractorId),
        specificDate: targetDate,
        startTime: startTime || "08:00",
        endTime: endTime || "17:00",
        maxBookings: maxBookings || 8,
        isAvailable: isAvailable !== false,
        isRecurring: false
      }
    });
    return c.json({
      success: true,
      message: "Date override created",
      override
    });
  } catch (error3) {
    console.error("Create date override error:", error3);
    return c.json({
      success: false,
      error: "Failed to create date override"
    }, 500);
  }
});
availability.get("/availability/contractor/:contractorId/overrides", async (c) => {
  try {
    const prisma = c.get("prisma");
    const { contractorId } = c.req.param();
    const { startDate, endDate } = c.req.query();
    if (!startDate || !endDate) {
      return c.json({
        success: false,
        error: "startDate and endDate are required"
      }, 400);
    }
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const overrides = await prisma.availability.findMany({
      where: {
        contractorId: parseInt(contractorId),
        isRecurring: false,
        specificDate: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        specificDate: "asc"
      }
    });
    const formattedOverrides = overrides.map((override) => ({
      ...override,
      specificDate: override.specificDate?.toISOString().split("T")[0]
    }));
    return c.json({
      success: true,
      overrides: formattedOverrides
    });
  } catch (error3) {
    console.error("Fetch date overrides error:", error3);
    return c.json({
      success: false,
      error: "Failed to fetch date overrides"
    }, 500);
  }
});
var availability_default = availability;

// src/worker.ts
function createPrismaClient(databaseUrl) {
  return new import_edge.PrismaClient({
    datasourceUrl: databaseUrl
  }).$extends(k());
}
__name(createPrismaClient, "createPrismaClient");
var app = new Hono2();
app.use("/*", cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
    "https://1079739b.fixterapp.pages.dev",
    // Your Cloudflare Pages URL
    "https://fixterapp.pages.dev"
    // Add your custom domain when ready
  ],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use("*", async (c, next) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  c.set("prisma", prisma);
  await next();
});
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    message: "FixterConnect API is running on Cloudflare Workers",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.route("/api", auth_default);
app.route("/api", services_default);
app.route("/api", bookings_default);
app.route("/api", profiles_default);
app.route("/api", favorites_default);
app.route("/api", messages_default);
app.route("/api", invoices_default);
app.route("/api", admin_default);
app.route("/api", availability_default);
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({
    success: false,
    error: err.message || "Internal server error"
  }, 500);
});
app.notFound((c) => {
  return c.json({
    success: false,
    error: "Not found"
  }, 404);
});
var worker_default = app;

// ../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-sBA2PU/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-sBA2PU/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
