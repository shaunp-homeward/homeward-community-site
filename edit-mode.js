/* Homeward — live on-page copy editor.
   Inert unless the URL contains ?edit (or #edit). Lets you click any text to
   rewrite it on the real page, then download the updated .html to drop into Netlify.
   Nothing is saved or sent anywhere until you click Download. */
(function () {
  var on = /(?:[?&]edit\b)|(?:#edit\b)/i.test(location.search + location.hash);
  if (!on) return;

  // Elements whose text you can edit. Structural containers are left alone.
  var SEL = "h1,h2,h3,h4,p,li,blockquote,summary,label," +
            ".eyebrow,.mantra,.lede,.place,.num,.tag,.quote,.k,.l,.qtext,.qhint,.btn";

  function editable() {
    return Array.prototype.filter.call(document.querySelectorAll(SEL), function (el) {
      if (el.closest("#hw-edit-bar")) return false;          // skip our own UI
      if (el.querySelector(SEL)) return false;               // only leaf text blocks
      if (!el.textContent.trim()) return false;              // skip empty
      return true;
    });
  }

  function enable() {
    editable().forEach(function (el) {
      el.setAttribute("contenteditable", "true");
      el.classList.add("hw-editable");
      el.setAttribute("spellcheck", "true");
    });
  }

  // Block link/button navigation & form submits while editing
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a,button");
    if (a && a.closest(".hw-editable, [contenteditable]")) { e.preventDefault(); }
    if (a && a.id && a.id.indexOf("hw-") === 0) return;      // allow our toolbar
  }, true);
  document.addEventListener("submit", function (e) { e.preventDefault(); }, true);

  function download() {
    var clone = document.documentElement.cloneNode(true);
    // strip editor UI + attributes from the copy we save
    var bar = clone.querySelector("#hw-edit-bar"); if (bar) bar.remove();
    var st = clone.querySelector("#hw-edit-style"); if (st) st.remove();
    Array.prototype.forEach.call(clone.querySelectorAll("[contenteditable]"), function (el) {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
      el.classList.remove("hw-editable");
      if (el.classList.length === 0) el.removeAttribute("class");
    });
    var html = "<!DOCTYPE html>\n" + clone.outerHTML;
    var name = (location.pathname.split("/").pop() || "index.html");
    if (!/\.html?$/i.test(name)) name = "index.html";
    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
    flash("Saved “" + name + "” to your Downloads. Drop it into Netlify to publish.");
  }

  function flash(msg) {
    var f = document.getElementById("hw-flash");
    f.textContent = msg; f.style.opacity = "1";
    clearTimeout(f._t); f._t = setTimeout(function () { f.style.opacity = "0"; }, 4200);
  }

  function done() {
    Array.prototype.forEach.call(document.querySelectorAll(".hw-editable"), function (el) {
      el.removeAttribute("contenteditable"); el.classList.remove("hw-editable");
    });
    document.getElementById("hw-edit-bar").style.display = "none";
    flash("Edit mode off. Add ?edit to the URL to turn it back on.");
  }

  function ui() {
    var s = document.createElement("style");
    s.id = "hw-edit-style";
    s.textContent =
      ".hw-editable{outline:1px dashed rgba(179,90,42,.45);outline-offset:3px;border-radius:2px;cursor:text;transition:background .12s,outline-color .12s}" +
      ".hw-editable:hover{outline-color:#B35A2A;background:rgba(224,164,67,.10)}" +
      ".hw-editable:focus{outline:2px solid #B35A2A;background:rgba(224,164,67,.14)}" +
      "#hw-edit-bar{position:fixed;right:18px;bottom:18px;z-index:99999;background:#153A2E;color:#FAF6EF;" +
      "font-family:Inter,system-ui,sans-serif;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.32);" +
      "padding:14px 16px;max-width:290px}" +
      "#hw-edit-bar .t{font-weight:700;font-size:.9rem;letter-spacing:.02em;margin-bottom:2px}" +
      "#hw-edit-bar .h{font-size:.78rem;color:rgba(250,246,239,.72);line-height:1.4;margin-bottom:11px}" +
      "#hw-edit-bar .row{display:flex;gap:8px}" +
      "#hw-edit-bar button{flex:1;border:none;border-radius:6px;padding:9px 10px;font-weight:600;font-size:.82rem;cursor:pointer;font-family:inherit}" +
      "#hw-dl{background:#B35A2A;color:#FAF6EF}#hw-dl:hover{background:#9c4d22}" +
      "#hw-done{background:rgba(250,246,239,.14);color:#FAF6EF}#hw-done:hover{background:rgba(250,246,239,.24)}" +
      "#hw-flash{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:99999;background:#153A2E;" +
      "color:#FAF6EF;font-family:Inter,sans-serif;font-size:.85rem;padding:11px 18px;border-radius:30px;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.3);opacity:0;transition:opacity .3s;pointer-events:none;max-width:80vw;text-align:center}";
    document.head.appendChild(s);

    var bar = document.createElement("div");
    bar.id = "hw-edit-bar";
    bar.innerHTML =
      '<div class="t">✏️ Editing this page</div>' +
      '<div class="h">Click any text to rewrite it. When you like it, download the page and drop it into Netlify — or send it to Claude.</div>' +
      '<div class="row"><button id="hw-dl">⬇ Download page</button><button id="hw-done">Done</button></div>';
    document.body.appendChild(bar);

    var f = document.createElement("div"); f.id = "hw-flash"; document.body.appendChild(f);

    document.getElementById("hw-dl").addEventListener("click", download);
    document.getElementById("hw-done").addEventListener("click", done);
  }

  function init() { ui(); enable(); flash("Edit mode on — click any text to change it."); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
