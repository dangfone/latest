/* =========================================================
   UTIL: Get first user frame from stack
========================================================= */
function getUserFrame() {
  try {
    const stack = new Error().stack;
    if (!stack) return null;

    const lines = stack.split("\n");
    for (const l of lines) {
      const m = l.match(/\(?(.+):(\d+):(\d+)\)?$/) || l.match(/@(.*):(\d+):\d+/);
      if (!m) continue;

      const file = m[1];
      if (file.includes("iframe") || file.includes("checker") || file.startsWith("blob:") || file === "about:blank") continue;

      return { file, line: Number(m[2]) };
    }
  } catch(e) {}
  return null;
}

/* =========================================================
   SAFE CONSOLE PATCH
========================================================= */
if (!window.__consolePatched) {
  window.__consolePatched = true;

  ["log","warn","error","info","debug"].forEach(level => {
    const original = console[level];

    console[level] = function(...args) {
      // Prevent multiple messages for same log due to DevTools internal calls
      if (window.__sendingConsole) return;
      window.__sendingConsole = true;

      try {
        const loc = getUserFrame();

        // Serialize args to string for parent
        const message = args.map(a => {
          if (typeof a === "object") {
            try { return JSON.stringify(a); } catch { return "[Object]"; }
          }
          return String(a);
        }).join(" ");

        // Send single message
        parent.postMessage({
          type: "log",
          level,
          message,
          source: loc?.file || null,
          line: loc?.line || null
        }, "*");

        // Call original console safely
        const snapshot = args.map(a => (typeof a === "object" ? "[Object]" : a));
        original.apply(console, snapshot);

      } finally {
        window.__sendingConsole = false;
      }
    };
  });
}

/* =========================================================
   ERROR HANDLING
========================================================= */
if (!window.__errorHandlersInstalled) {
  window.__errorHandlersInstalled = true;
  const reportedErrors = new Set();

  function reportError(info) {
    const key = info.message + ":" + info.line + ":" + info.source;
    if (reportedErrors.has(key)) return;
    reportedErrors.add(key);
    parent.postMessage({ type: "error", ...info }, "*");
  }

  window.onerror = (msg, src, line, col, err) => {
    reportError({
      message: err?.message || msg,
      source: err?.fileName || src || null,
      line: err?.lineNumber || line || null,
      col: err?.columnNumber || col || null,
      stack: err?.stack || null
    });
    return true;
  };

  window.onunhandledrejection = e => {
    const r = e.reason;
    if (r instanceof Error) {
      reportError({
        message: r.message,
        source: r.fileName || null,
        line: r.lineNumber || null,
        col: null,
        stack: r.stack || null
      });
    } else {
      reportError({
        message: String(r),
        source: null,
        line: null,
        col: null,
        stack: null
      });
    }
  };
}

/* =========================================================
   BOOTSTRAP
========================================================= */
parent.postMessage({ type: "iframe-ready" }, "*");
window.addEventListener("message", e => update(e.data));

/* =========================================================
   UPDATE PIPELINE
========================================================= */
function update(data) {
  loadHtml(data.html, () => {
    loadCss(data.css);
    loadJsFiles(data.scripts);
  });
}

/* =========================================================
   HTML + INLINE SCRIPT LOADING
========================================================= */
function loadHtml(html, done) {
  document.body.innerHTML = "";
  document.body.insertAdjacentHTML("beforeend", html || "");

  const scripts = Array.from(document.querySelectorAll("script"));
  runScriptsInOrder(scripts, done);
}

function runScriptsInOrder(scripts, done) {
  let i = 0;
  function next() {
    if (i >= scripts.length) return done && done();

    const old = scripts[i++];
    const s = document.createElement("script");

    if (old.src) {
      s.src = old.src;
      s.onload = next;
      s.onerror = next;
    } else {
      s.textContent = old.textContent;
      next();
    }

    old.remove();
    document.body.appendChild(s);
  }
  next();
}

/* =========================================================
   CSS LOADING
========================================================= */
function loadCss(css) {
  let style = document.getElementById("user-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "user-style";
    document.head.appendChild(style);
  }
  style.textContent = css || "";
}

/* =========================================================
   JS FILES LOADING (DEDUPED)
========================================================= */
function loadJsFiles(files) {
  if (!files) return;

  document.querySelectorAll("script[data-user]").forEach(s => s.remove());

  files.forEach(f => {
    const existing = document.querySelector(`script[data-user][data-name="${f.name}"]`);
    if (existing) return;

    const s = document.createElement("script");
    s.dataset.user = "true";
    s.dataset.name = f.name;
    s.textContent = (f.data || "") + "\n//# sourceURL=" + (f.name || "user") + ".js";
    document.body.appendChild(s);
  });
}