var qe = Object.defineProperty,
    Qe = (t, e, o) =>
        e in t
            ? qe(t, e, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: o
              })
            : (t[e] = o),
    _e = (t, e, o) => Qe(t, typeof e != "symbol" ? e + "" : e, o),
    pe = class {
        constructor() {
            _e(this, "debugMode"),
                _e(
                    this,
                    "style",
                    "color: #f3f1ff; font-weight: bold; background-color: #6b04fd; padding: 2px; border-radius: 2px;"
                ),
                (this.debugMode = new URLSearchParams(
                    window.location.search
                ).has("adv_debug"));
        }
        formatMessage(e) {
            return `${new Date().toISOString()} [${e.toUpperCase()}] %cADVANTAGE`;
        }
        log(e, o, ...a) {
            this.debugMode &&
                (console[e](this.formatMessage(e), this.style, `- ${o}`, ...a),
                e === "error" && console.trace());
        }
        debug(e, ...o) {
            this.log("log", e, ...o);
        }
        info(e, ...o) {
            this.log("info", e, ...o);
        }
        error(e, ...o) {
            this.log("error", e, ...o);
        }
        enableDebugMode() {
            this.debugMode = !0;
        }
    },
    i = new pe();
var g = ((t) => (
        (t.START_SESSION = "START_SESSION"),
        (t.CONFIRM_SESSION = "CONFIRM_SESSION"),
        (t.REQUEST_FORMAT = "REQUEST_FORMAT"),
        (t.FORMAT_CONFIRMED = "FORMAT_CONFIRMED"),
        (t.FORMAT_REJECTED = "FORMAT_REJECTED"),
        t
    ))(g || {}),
    c = ((t) => (
        (t.TopScroll = "TOPSCROLL"),
        (t.DoubleMidscroll = "DOUBLE_MIDSCROLL"),
        (t.Midscroll = "MIDSCROLL"),
        (t.TripleMidscroll = "TRIPLE_MIDSCROLL"),
        (t.WelcomePage = "WELCOME_PAGE"),
        t
    ))(c || {});
var me =
    ":host{--adv-close-button-animation-duration:.5s;--adv-topscroll-height:80svh;height:var(--adv-topscroll-height);width:100svw;display:block;position:relative;overflow:hidden}:host(.animate){transition:height var(--adv-close-button-animation-duration)}#container{height:var(--adv-topscroll-height);clip-path:inset(0);width:100svw;position:absolute;top:0}#ad-slot{height:var(--adv-topscroll-height);width:100svw;position:fixed;top:0}::slotted(#simulated-ad){height:var(--adv-topscroll-height);background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTkyMHB4IiBoZWlnaHQ9IjEwODBweCIgdmlld0JveD0iMCAwIDE5MjAgMTA4MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5VbnRpdGxlZDwvdGl0bGU+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBzdHJva2U9IiM5Nzk3OTciIGZpbGw9IiM5MDkwOTAiIHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIj48L3JlY3Q+CiAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgc3Ryb2tlPSIjOTc5Nzk3IiBmaWxsPSIjRDhEOEQ4IiB4PSIyNjAuNSIgeT0iMjMwLjUiIHdpZHRoPSIxNDAwIiBoZWlnaHQ9IjYyMCI+PC9yZWN0PgogICAgICAgIDx0ZXh0IGlkPSJUT1BTQ1JPTEwtU0FGRS1BUkVBIiBmb250LWZhbWlseT0iSGVsdmV0aWNhIiBmb250LXNpemU9IjcyIiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPHRzcGFuIHg9Ijc0Mi41NzYxNzIiIHk9IjUyMyI+VE9QU0NST0xMPC90c3Bhbj4KICAgICAgICAgICAgPHRzcGFuIHg9IjU5My43MjQ2MDkiIHk9IjYwOSI+U0FGRSBBUkVBIDE0MDB4NjIwPC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPg==);background-position:50%;background-size:cover;width:100svw}@media screen and (orientation:portrait){::slotted(#simulated-ad){height:var(--adv-topscroll-height);width:100svw}}";
var ue = `#down-arrow{cursor:pointer;opacity:.8;background-color:#0000004d;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22.82' height='14.24' viewBox='0 0 22.82 14.24'%3E%3Cpolygon points='2.82 0 0 2.83 11.41 14.24 22.82 2.83 20 0 11.41 8.58 2.82 0' fill='%23fff'/%3E%3C/svg%3E");background-position:50% 52%;background-repeat:no-repeat;background-size:44%;border-radius:50%;width:2rem;height:2rem;position:absolute;bottom:1rem;left:50%;transform:translate(-50%)}#close{cursor:pointer;opacity:.8;background-color:#0006;background-image:url("data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Cpath d='M21.989,3.187,18.813.01,11,7.824,3.174,0,0,3.174,7.824,11,.01,18.813l3.177,3.176L11,14.176,18.826,22,22,18.826,14.176,11Z' fill='%23fff'/%3E%3C/svg%3E");background-position:50%;background-repeat:no-repeat;background-size:34%;border-radius:50%;width:2rem;height:2rem;position:absolute;top:1rem;right:1rem}#close:before{content:var(--before-content,"Ad");white-space:nowrap;color:#fff;text-shadow:.2rem .2rem 2rem #000000e6;font-family:Arial,sans-serif;font-size:.8rem;font-weight:600;position:absolute;top:50%;right:2.7rem;transform:translateY(-50%)}@media (orientation:portrait){#down-arrow,#close{width:22px;height:22px}#close:before{right:32px}}`;
function T(t, e = !0) {
    function o(a) {
        a && ((a.style.height = "100%"), (a.style.width = "100%"));
    }
    if (t) {
        let a = t.parentElement;
        for (o(t); a; ) {
            if (a.slot === "advantage-ad-slot") {
                e && o(a);
                break;
            }
            o(a), (a = a.parentElement);
        }
    }
}
function L(t, e = !0) {
    function o(a) {
        a && ((a.style.height = ""), (a.style.width = ""));
    }
    if (t) {
        let a = t.parentElement;
        for (o(t); a; ) {
            if (a.slot === "advantage-ad-slot") {
                e && o(a);
                break;
            }
            o(a), (a = a.parentElement);
        }
    }
}
function Te(t, e, o, a) {
    let s = document.createElement("iframe");
    return (
        (s.src = t),
        (s.id = e),
        (s.className = o),
        s.setAttribute(
            "sandbox",
            "allow-scripts allow-same-origin allow-popups"
        ),
        s.setAttribute("scrolling", "no"),
        s
    );
}
var fe = 80,
    Le = (t) => {
        i.debug("Down arrow clicked");
        let e =
            t && t <= 100
                ? window.innerHeight * (t / 100)
                : window.innerHeight * (fe / 100);
        window.scrollBy({ top: e, behavior: "smooth" });
    },
    xe = {
        name: c.TopScroll,
        description:
            "A format that sticks the ad to the top of the page as the user scrolls down.",
        setup: (t, e, o) => {
            let s = {
                ...{
                    closeButton: !0,
                    closeButtonText: "Close ad",
                    downArrow: !0,
                    height: fe,
                    closeButtonAnimationDuration: 0.5
                },
                ...(o || {})
            };
            return new Promise((l) => {
                t.insertCSS(me), e && T(e);
                let r = document.createElement("div");
                if (
                    ((r.id = "ui-container"),
                    s.height &&
                        s.height <= 100 &&
                        t.style.setProperty(
                            "--adv-topscroll-height",
                            `${s.height}svh`
                        ),
                    s?.closeButton)
                ) {
                    let n = document.createElement("div");
                    (n.id = "close"),
                        n.addEventListener("click", () => {
                            i.debug("Close button clicked"), t.close();
                        }),
                        r.appendChild(n),
                        t.uiLayer.style.setProperty(
                            "--before-content",
                            `'${s.closeButtonText}'`
                        ),
                        t.style.setProperty(
                            "--adv-close-button-animation-duration",
                            `${s.closeButtonAnimationDuration}s`
                        );
                }
                if (s?.downArrow) {
                    let n = document.createElement("div");
                    (n.id = "down-arrow"),
                        n.addEventListener("click", () => Le(s.height)),
                        r.appendChild(n);
                }
                t.uiLayer.insertCSS(ue), t.uiLayer.changeContent(r), l();
            });
        },
        simulate: (t) => {
            t.resetCSS(), t.insertCSS(me);
            let e = document.createElement("div");
            (e.id = "simulated-ad"), t.changeContent(e);
            let o = document.createElement("div");
            o.id = "ui-container";
            let a = document.createElement("div");
            a.id = "close";
            let s = document.createElement("div");
            (s.id = "down-arrow"),
                o.appendChild(a),
                o.appendChild(s),
                t.uiLayer.insertCSS(ue),
                t.uiLayer.changeContent(o),
                a.addEventListener("click", () => {
                    i.debug("Close button clicked"), t.close();
                }),
                s.addEventListener("click", () => Le(fe));
        },
        reset: (t, e) => {
            e && L(e), t.resetCSS();
        },
        close: (t) => {
            t.animateClose();
        }
    };
var De =
    ":host{width:100vw;height:100vh;transition:height .5s ease-out;display:block;position:relative;overflow:hidden}#container{clip-path:inset(0);width:100vw;height:100vh;position:absolute;top:0}#ad-slot{width:100vw;height:100vh;position:fixed;top:0}";
var Re = {
    name: c.Midscroll,
    description:
        "A fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
    setup: (t, e) =>
        new Promise((o) => {
            t.insertCSS(De), e && T(e);
            let a = document.createElement("div");
            (a.id = "ui-container"), t.uiLayer.changeContent(a), o();
        }),
    reset: (t, e) => {
        e && L(e), t.resetCSS();
    },
    close: (t) => {
        t.animateClose();
    }
};
var ge =
    ":host{--adv-c-gray-1:#dddde3;--adv-c-gray-2:#e4e4e9;--adv-c-gray-3:#ebebef;--adv-c-gray-soft:#8e96aa24;--adv-c-indigo-1:#3451b2;--adv-c-indigo-2:#3a5ccc;--adv-c-indigo-3:#5672cd;--adv-c-indigo-soft:#646cff24;--adv-c-purple-1:#1f1031;--adv-c-purple-2:#b2aeff;--adv-c-purple-3:#ecebff;--adv-c-purple-soft:#9f7aea24;--adv-c-text-1:#fff;--adv-c-text-2:#3c3c43c7;--adv-c-bg:#1f1031;--adv-c-bg-alt:#1f1031;--adv-c-default-1:var(--adv-c-gray-1);--adv-c-default-2:var(--adv-c-gray-2);--adv-c-default-3:var(--adv-c-gray-3);--adv-c-default-soft:var(--adv-c-gray-soft);--adv-c-brand-1:var(--adv-c-purple-1);--adv-c-brand-2:var(--adv-c-purple-2);--adv-c-brand-3:var(--adv-c-purple-3);--adv-c-brand-soft:var(--adv-c-purple-soft);--adv-font-family-base:ui-sans-serif,system-ui,sans-serif;font-optical-sizing:auto;--adv-wp-zindex:2147480000;--adv-wp-header-height:48px;--adv-wp-header-text:var(--adv-c-text-1);--adv-wp-header-hover-text:var(--adv-c-brand-2);--adv-wp-header-bg:var(--adv-c-brand-1);--adv-wp-countdown-color:var(--adv-c-text-1);--adv-wp-countdown-stroke:var(--adv-c-brand-2);--adv-wp-countdown-border-width:4px}";
var ve =
    ":host{display:block}#container{z-index:var(--adv-wp-zindex);opacity:0;width:100vw;height:100vh;margin:0;padding:0;transition:all .5s;position:fixed;top:0;left:0;overflow-y:hidden;transform:translateY(5%)}:host(.show) #container{opacity:1;transform:translateY(0%)}#ad-slot{width:100%;height:100%}::slotted([slot=advantage-ad-slot]){top:var(--adv-wp-header-height);position:absolute;left:0;height:calc(100svh - var(--adv-wp-header-height))!important}";
var ke =
    '.close-area{height:var(--adv-wp-header-height);background-color:var(--adv-wp-header-bg);color:var(--adv-wp-header-text);font-family:var(--adv-font-family-base);cursor:pointer;box-sizing:border-box;border-bottom:1px solid #ffffff26;width:100vw;padding:0 14px;display:grid;position:absolute;top:0;left:0}.mw{grid-template-columns:1fr 1fr 1fr;align-items:center;max-width:1260px;display:grid;position:relative;left:50%;transform:translate(-50%)}.continue,.countdown,.label{align-self:center}.countdown{justify-self:left;font-size:20px;font-weight:700;position:relative}.countdown--hide{opacity:0}.label{justify-self:center}.continue{color:var(--adv-wp-header-text);cursor:pointer;justify-self:right;align-items:center;font-size:16px;font-weight:700;transition:all .15s;display:flex}svg.arrow{width:auto;height:1em;margin-left:.25em;transition:all .15s}span.arrow{margin-left:.25em;transition:all .15s;display:inline-block}.continue:hover{color:var(--adv-wp-header-hover-text)}.continue:hover .arrow{transform:translate(.25em)}.continue .to-label{display:none}.favico{width:auto;height:1.5rem;margin-right:8px}.cdw{font-size:80%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.cw{stroke:var(--adv-wp-countdown-stroke);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(-90deg)scale(.88)}.loader{box-sizing:border-box;width:calc(var(--adv-wp-header-height) - 14px);aspect-ratio:1;border:var(--adv-wp-countdown-border-width)solid #ffffff2e;border-radius:50%;position:relative;transform:rotate(45deg)}.loader:before{content:"";inset:calc(-1*var(--adv-wp-countdown-border-width));border:var(--adv-wp-countdown-border-width)solid var(--adv-wp-countdown-stroke);animation:l18 var(--adv-wp-countdown-duration,10s)1 linear;border-radius:50%;animation-direction:reverse;animation-fill-mode:forwards;position:absolute}@keyframes l18{0%{clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}25%{clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}50%{clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}75%{clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)}to{clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)}}@media (orientation:portrait){.continue{font-size:14px}.countdown{transform:scale(.9)}}@media (min-width:600px){.continue .to-label{display:inline-block}}';
var Fe = {
    name: c.WelcomePage,
    description:
        "Positioned on top of the site content with a close button to continue to the site",
    setup: (t, e, o) => {
        let s = {
            ...{
                autoCloseDuration: 21,
                siteTitle: window.location.hostname,
                logo: `https://icons.duckduckgo.com/ip3/${window.location.hostname}.ico`,
                continueToLabel: "To",
                scrollBackToTop: !1,
                adLabel: "Advertisement"
            },
            ...(o || {})
        };
        return new Promise((l) => {
            t.insertCSS(ge.concat(ve)), e && T(e);
            let r = document.createElement("div");
            (r.id = "ui-container"),
                r.insertAdjacentHTML(
                    "afterbegin",
                    `<div class="close-area">
                  <div class="mw">
                    <div class="countdown ${
                        s.autoCloseDuration
                            ? "countdown--show"
                            : "countdown--hide"
                    }">
                      <div class="loader"></div>
                      <span class="cdw"><span class="cd">${
                          s.autoCloseDuration
                      }</span></span>
                    </div>
                    <div class="label">${s.adLabel}</div>
                    <div class="continue">
                        ${
                            s.logo
                                ? `<img class="favico" src="${s.logo}" onerror="this.style.display='none'" />`
                                : ""
                        }<span class="to-label">${s.continueToLabel} ${
                        s.siteTitle ? s.siteTitle : ""
                    }</span><span class="arrow">\u279C</span>
                    </div>
                  </div>
                </div>`
                );
            let n = 0,
                d = 0;
            if (s?.autoCloseDuration) {
                let y = r.querySelector(".cd"),
                    f = s.autoCloseDuration;
                y &&
                    (n = setInterval(() => {
                        f--,
                            (y.textContent = f.toString()),
                            f === 0 && clearInterval(n);
                    }, 1e3)),
                    t.uiLayer.style.setProperty(
                        "--adv-wp-countdown-duration",
                        `${s.autoCloseDuration}s`
                    ),
                    (d = setTimeout(() => {
                        i.debug("Auto closing the ad"), t.close();
                    }, s.autoCloseDuration * 1e3));
            }
            let v = r.querySelector(".continue");
            v &&
                v.addEventListener("click", () => {
                    clearInterval(n), clearTimeout(d), t.close();
                }),
                t.uiLayer.insertCSS(ke),
                t.uiLayer.changeContent(r),
                t.classList.add("show"),
                l();
        });
    },
    simulate: (t) => {
        t.resetCSS(), t.insertCSS(ge.concat(ve));
        let e = document.createElement("div");
        (e.id = "simulated-ad"), t.changeContent(e);
    },
    reset: (t, e) => {
        e && L(e), t.resetCSS();
    },
    close: (t) => {
        var e;
        function o() {
            (t.style.display = "none"),
                a?.removeEventListener("transitionend", o);
        }
        let a =
            (e = t.shadowRoot) == null ? void 0 : e.getElementById("container");
        a?.addEventListener("transitionend", o),
            t.classList.remove("show"),
            (t.style.height = "0px");
    }
};
var Ne =
    ":host #ad-slot{height:calc(var(--adv-midscroll-multiplier,2)*100dvh);width:100dvw;display:block;position:relative}::slotted([slot=advantage-ad-slot]){z-index:var(--adv-wp-zindex);width:100dvw;height:100dvh;transition:all .5s;position:sticky;top:0;left:0}#advantage-ad-background{width:100%;height:100%;position:absolute;top:0;left:0}#advantage-ad-background>iframe{border:none;width:100%;height:100%}";
function se(t, e, o) {
    return {
        name: t,
        description: e,
        setup: (a, s, l) => {
            let n = {
                ...{ allowedOrigins: [], dangerouslyAllowAllOrigins: !1 },
                ...(l || {})
            };
            function d(v, y) {
                try {
                    let f = new URL(v).origin;
                    return f.startsWith("http") && y.includes(f);
                } catch (f) {
                    return i.error("Invalid backgroundAdURL:", v, f), !1;
                }
            }
            return new Promise((v, y) => {
                var f, M;
                if (!n.backgroundAdURL || !n.sessionID) {
                    y(new Error("backgroundAdURL or sessionID is required"));
                    return;
                }
                if (
                    !d(n.backgroundAdURL, n.allowedOrigins ?? []) &&
                    !n.dangerouslyAllowAllOrigins
                ) {
                    y(new Error("backgroundAdURL is not allowed"));
                    return;
                }
                a.insertCSS(
                    `:host { --adv-midscroll-multiplier: ${o}; } ${Ne}`
                ),
                    T(s, !1);
                let te = new URL(n.backgroundAdURL);
                te.searchParams.set("sessionId", n.sessionID);
                let _ = document.createElement("div");
                _.id = "advantage-ad-background";
                let Q = Te(
                    te.toString(),
                    "background",
                    "advantage-background-iframe"
                );
                _.appendChild(Q),
                    (M =
                        (f = a.shadowRoot) == null
                            ? void 0
                            : f.getElementById("ad-slot")) == null ||
                        M.insertAdjacentElement("afterbegin", _),
                    i.debug("GOT BACKGROUND_AD_URL", n.backgroundAdURL),
                    v();
            });
        },
        reset: (a, s) => {
            L(s, !1), a.resetCSS();
        },
        close: () => {}
    };
}
var We = se(
    c.DoubleMidscroll,
    "A double fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
    2
);
var Pe = se(
    c.TripleMidscroll,
    "A triple fullscreen format that fixes the ad to the middle of the page as the user scrolls down.",
    3
);
var we = [xe, Re, Fe, We, Pe];
var Je = Object.defineProperty,
    Oe = (t) => {
        throw TypeError(t);
    },
    Ye = (t, e, o) =>
        e in t
            ? Je(t, e, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: o
              })
            : (t[e] = o),
    O = (t, e, o) => Ye(t, typeof e != "symbol" ? e + "" : e, o),
    je = (t, e, o) => e.has(t) || Oe("Cannot " + o),
    Ke = (t, e, o) => (
        je(t, e, "read from private field"), o ? o.call(t) : e.get(t)
    ),
    Xe = (t, e, o) =>
        e.has(t)
            ? Oe("Cannot add the same private member more than once")
            : e instanceof WeakSet
            ? e.add(t)
            : e.set(t, o),
    ye,
    Se = class P {
        constructor() {
            O(this, "config", null),
                O(this, "defaultFormats", we),
                O(this, "wrappers", []),
                Xe(this, ye, []),
                O(this, "formats", new Map()),
                O(this, "formatIntegrations", new Map()),
                P.id++,
                i.info("Advantage constructor", P.id);
        }
        configure(e) {
            e.configUrlResolver
                ? (i.info("Config URL resolver provided"),
                  this.loadConfig(e.configUrlResolver()))
                : (i.info(
                      "No config URL resolver provided, using provided config"
                  ),
                  this.applyConfig(e));
        }
        registerWrapper(e) {
            this.wrappers.push(e), i.info("Wrapper registered", e);
        }
        registerCustomWrapper(e) {
            Ke(this, ye).push(e), i.info("Custom wrapper registered", e);
        }
        static getInstance() {
            return (
                P.instance ||
                    (i.info("Creating a new instance of Advantage"),
                    (P.instance = new P())),
                P.instance
            );
        }
        loadConfig(e) {
            i.info(`\u2B07 Loading config from remote URL: ${e}`),
                import(e)
                    .then((o) => {
                        this.applyConfig(o.default);
                    })
                    .catch((o) => {
                        i.error("Error fetching config", o);
                    });
        }
        applyConfig(e) {
            if (
                ((this.config = e),
                e.formats
                    ? this.mergeUniqueFormats(this.defaultFormats, e.formats)
                    : (this.formats = new Map(we.map((o) => [o.name, o]))),
                i.info("Format configurations applied \u2705", this.formats),
                e.formatIntegrations)
            ) {
                for (let o of e.formatIntegrations)
                    this.formatIntegrations.set(o.format, o);
                i.info(
                    "Format integrations applied \u2705",
                    this.formatIntegrations
                );
            }
        }
        mergeUniqueFormats(e, o) {
            let a = [...e, ...o],
                s = new Map();
            for (let l of a) s.set(l.name, l);
            return (this.formats = s), Array.from(s.values());
        }
    };
ye = new WeakMap();
O(Se, "instance", null);
O(Se, "id", 0);
var m = Se;
var Ie = (t) => {
        let e = [];
        if (t.nodeType === Node.ELEMENT_NODE) {
            let o = t;
            o.tagName === "IFRAME" && e.push(o),
                o.childNodes.forEach((a) => {
                    e = e.concat(Ie(a));
                });
        }
        return e;
    },
    Ae = (t, e) => {
        if (t.nodeType === Node.ELEMENT_NODE) {
            e(t);
            for (let o of t.childNodes) Ae(o, e);
        }
    },
    A =
        "adoptedStyleSheets" in Document.prototype &&
        "replace" in CSSStyleSheet.prototype;
var x = "ADVANTAGE";
var et = Object.defineProperty,
    He = (t) => {
        throw TypeError(t);
    },
    tt = (t, e, o) =>
        e in t
            ? et(t, e, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: o
              })
            : (t[e] = o),
    ot = (t, e, o) => tt(t, typeof e != "symbol" ? e + "" : e, o),
    Ce = (t, e, o) => e.has(t) || He("Cannot " + o),
    h = (t, e, o) => (
        Ce(t, e, "read from private field"), o ? o.call(t) : e.get(t)
    ),
    D = (t, e, o) =>
        e.has(t)
            ? He("Cannot add the same private member more than once")
            : e instanceof WeakSet
            ? e.add(t)
            : e.set(t, o),
    U = (t, e, o, a) => (
        Ce(t, e, "write to private field"), a ? a.call(t, o) : e.set(t, o), o
    ),
    be = (t, e, o) => (Ce(t, e, "access private method"), o),
    b,
    ie,
    J,
    Ue,
    B,
    C,
    z,
    Y,
    Be,
    j,
    ze,
    K = class {
        constructor(e) {
            if (
                (D(this, J),
                D(this, b),
                D(this, ie),
                D(this, B),
                D(this, C, null),
                D(this, z),
                ot(this, "ad", null),
                D(this, Y, async (o) => {
                    let a = o.data;
                    a.action === g.START_SESSION &&
                        (i.debug("start session!", o),
                        U(this, C, o.ports[0]),
                        h(this, C).postMessage({
                            type: x,
                            action: g.CONFIRM_SESSION,
                            sessionID: a.sessionID
                        }),
                        (h(this, C).onmessage = h(this, Y).bind(this))),
                        a.action === g.REQUEST_FORMAT &&
                            (h(this, B)
                                ? h(this, b)
                                      .morphIntoFormat(a.format, a)
                                      .then(() => {
                                          var s;
                                          i.info(
                                              "morphed into format",
                                              a.format
                                          ),
                                              (s = h(this, C)) == null ||
                                                  s.postMessage({
                                                      type: x,
                                                      action: g.FORMAT_CONFIRMED,
                                                      sessionID: a.sessionID
                                                  });
                                      })
                                      .catch((s) => {
                                          var l;
                                          i.error(
                                              "morphing failed",
                                              a.format,
                                              s
                                          ),
                                              (l = h(this, C)) == null ||
                                                  l.postMessage({
                                                      type: x,
                                                      action: g.FORMAT_REJECTED,
                                                      sessionID: a.sessionID
                                                  });
                                      })
                                : h(this, z) &&
                                  (i.debug(
                                      "Sending format request",
                                      h(this, z)
                                  ),
                                  h(this, z)
                                      .call(this, a.format, h(this, b))
                                      .then(() => {
                                          var s;
                                          (s = h(this, C)) == null ||
                                              s.postMessage({
                                                  type: x,
                                                  action: g.FORMAT_CONFIRMED,
                                                  sessionID: a.sessionID
                                              });
                                      })
                                      .catch(() => {
                                          var s;
                                          (s = h(this, C)) == null ||
                                              s.postMessage({
                                                  type: x,
                                                  action: g.FORMAT_REJECTED,
                                                  sessionID: a.sessionID
                                              });
                                      })));
                }),
                D(this, j, (o) => {
                    if (be(this, J, Be).call(this, o.source)) {
                        i.info(
                            "A message was received from a child of the component. \u{1F44D}",
                            o
                        ),
                            h(this, Y).call(this, o);
                        return;
                    }
                    if (
                        !(h(this, ie) || be(this, J, Ue).bind(this))(
                            h(this, b),
                            o
                        )
                    )
                        return;
                    let s = (l) => {
                        let n = 0,
                            d = o.source;
                        for (; d && d !== window.top && n < 10; ) {
                            n++;
                            try {
                                if (l.contentWindow === d) {
                                    i.info(
                                        "The message is from a child of the component. \u{1F44D}"
                                    ),
                                        (this.ad = {
                                            iframe: l,
                                            eventSource: o.source,
                                            port: o.ports[0]
                                        }),
                                        h(this, Y).call(this, o);
                                    break;
                                }
                                d = d.parent;
                            } catch (v) {
                                i.error(
                                    "Error while traversing iframe hierarchy",
                                    v
                                );
                                break;
                            }
                        }
                    };
                    if (h(this, B)) {
                        let l = h(this, b).contentNodes.flatMap((r) => Ie(r));
                        if (l.length === 0) return;
                        l.forEach(s);
                    } else
                        i.debug("NOT A WRAPPER!", h(this, b)),
                            Array.from(
                                h(this, b).getElementsByTagName("iframe")
                            ).forEach(s);
                }),
                !e.adSlotElement)
            )
                throw new Error("An adSlotElement must be provided");
            U(this, b, e.adSlotElement),
                U(this, z, e.formatRequestHandler),
                U(this, ie, e.messageValidator),
                U(this, B, be(this, J, ze).call(this, e.adSlotElement)),
                h(this, B) ||
                    m.getInstance().registerCustomWrapper(e.adSlotElement),
                U(this, j, h(this, j).bind(this)),
                window.addEventListener("message", h(this, j));
        }
    };
b = new WeakMap();
ie = new WeakMap();
J = new WeakSet();
Ue = function (t, e) {
    return !(
        !e.data ||
        typeof e.data != "object" ||
        e.data.type !== "ADVANTAGE" ||
        !e.data.action
    );
};
B = new WeakMap();
C = new WeakMap();
z = new WeakMap();
Y = new WeakMap();
Be = function (t) {
    return t ? this.ad && this.ad.eventSource === t : !1;
};
j = new WeakMap();
ze = function (t) {
    return (
        "container" in t &&
        "currentFormat" in t &&
        "uiLayer" in t &&
        "morphIntoFormat" in t
    );
};
var at = Object.defineProperty,
    Ge = (t) => {
        throw TypeError(t);
    },
    st = (t, e, o) =>
        e in t
            ? at(t, e, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: o
              })
            : (t[e] = o),
    S = (t, e, o) => st(t, typeof e != "symbol" ? e + "" : e, o),
    Me = (t, e, o) => e.has(t) || Ge("Cannot " + o),
    p = (t, e, o) => (
        Me(t, e, "read from private field"), o ? o.call(t) : e.get(t)
    ),
    R = (t, e, o) =>
        e.has(t)
            ? Ge("Cannot add the same private member more than once")
            : e instanceof WeakSet
            ? e.add(t)
            : e.set(t, o),
    k = (t, e, o, a) => (
        Me(t, e, "write to private field"), a ? a.call(t, o) : e.set(t, o), o
    ),
    ne = (t, e, o) => (Me(t, e, "access private method"), o),
    I,
    G,
    H,
    re,
    le,
    E,
    $,
    X,
    Ee,
    de = class extends HTMLElement {
        constructor() {
            var e;
            super(),
                R(this, $),
                R(this, I),
                R(this, G),
                R(this, H),
                R(this, re, !1),
                R(this, le, new WeakSet()),
                R(this, E, null),
                S(this, "allowedFormats", null),
                S(this, "container"),
                S(this, "content"),
                S(this, "uiLayer"),
                S(this, "currentFormat", ""),
                S(this, "messageHandler"),
                S(this, "simulating", !1),
                R(this, Ee, () => {
                    new MutationObserver((s) => {
                        s.forEach((l) => {
                            l.type === "childList" &&
                                (l.addedNodes.forEach((r) => {
                                    if (r.tagName === "IFRAME") {
                                        let n = r;
                                        i.debug("An <iframe> was added:", n),
                                            p(this, le).add(n),
                                            this.currentFormat &&
                                                p(this, E) &&
                                                p(this, E) !== n &&
                                                !this.simulating &&
                                                (i.info(
                                                    "A new <iframe> was added while a format is active. The previous iframe may have been replaced. Resetting wrapper."
                                                ),
                                                this.reset());
                                    }
                                }),
                                l.removedNodes.forEach((r) => {
                                    if (r.tagName === "IFRAME") {
                                        let n = r;
                                        p(this, E) === n
                                            ? this.currentFormat &&
                                              this.simulating === !1 &&
                                              (i.debug(
                                                  "The active format <iframe> was removed. This probably means that a new ad was loaded. Resetting the wrapper."
                                              ),
                                              this.reset())
                                            : p(this, le).has(n)
                                            ? i.debug(
                                                  "A tracked <iframe> was removed, but it wasn't the active format iframe."
                                              )
                                            : i.debug(
                                                  "An untracked <iframe> was removed."
                                              );
                                    }
                                }));
                        });
                    }).observe(this, { childList: !0, subtree: !0 });
                }),
                S(this, "simulateFormat", async (a) => {
                    if (this.simulating) return;
                    this.simulating = !0;
                    let s = m.getInstance().formats.get(a);
                    s &&
                        s.simulate &&
                        (i.debug("SIMULATE FORMAT"), s.simulate(this));
                }),
                S(
                    this,
                    "morphIntoFormat",
                    async (a, s) => (
                        i.debug("MORPH INTO FORMAT"),
                        new Promise(async (l, r) => {
                            var n, d, v, y, f;
                            let M = a.toUpperCase(),
                                te =
                                    (n =
                                        this.getAttribute("allowed-formats")) ==
                                    null
                                        ? void 0
                                        : n
                                              .split(",")
                                              .map((W) =>
                                                  W.trim().toUpperCase()
                                              )
                                              .filter(Boolean),
                                _ = this.allowedFormats ?? te;
                            if (_ && !_.includes(M)) {
                                i.info(
                                    `The format "${M}" is not in the allowed-formats list (${_.join(
                                        ", "
                                    )}).`
                                ),
                                    r(
                                        `The format ${M} is not allowed for this wrapper. \u{1F6D1}`
                                    );
                                return;
                            }
                            let Q =
                                _ ||
                                (d = this.getAttribute("exclude-formats")) ==
                                    null
                                    ? void 0
                                    : d
                                          .split(",")
                                          .map((W) => W.trim().toUpperCase());
                            if (Q && Q.includes(M)) {
                                i.info(
                                    `This wrapper does not support the format(s): "${Q.join(
                                        ", "
                                    )}".`
                                ),
                                    r(
                                        `The format ${M} is forbidden for this wrapper. \u{1F6D1}`
                                    );
                                return;
                            }
                            (this.currentFormat = a), ne(this, $, X).call(this);
                            let oe = m.getInstance().formats.get(a);
                            if (
                                !oe &&
                                ((oe = m
                                    .getInstance()
                                    .defaultFormats.find((W) => W.name === a)),
                                !oe)
                            ) {
                                r(
                                    `\u{1F631} The format ${a} is not supported. No configuration was found.`
                                ),
                                    (this.currentFormat = ""),
                                    ne(this, $, X).call(this);
                                return;
                            }
                            let ae = m
                                .getInstance()
                                .formatIntegrations.get(this.currentFormat);
                            try {
                                (v = this.messageHandler.ad) != null &&
                                    v.iframe &&
                                    (k(this, E, this.messageHandler.ad.iframe),
                                    i.debug(
                                        `Set active format iframe for format: ${a}`,
                                        p(this, E)
                                    )),
                                    await oe.setup(
                                        this,
                                        (y = this.messageHandler.ad) == null
                                            ? void 0
                                            : y.iframe,
                                        {
                                            ...ae?.options,
                                            backgroundAdURL: s?.backgroundAdURL,
                                            sessionID: s?.sessionID
                                        }
                                    ),
                                    await ae?.setup(
                                        this,
                                        (f = this.messageHandler.ad) == null
                                            ? void 0
                                            : f.iframe
                                    ),
                                    l();
                            } catch (W) {
                                this.reset(), r(W);
                            }
                        })
                    )
                ),
                S(this, "forceFormat", async (a, s, l) => {
                    if ((i.debug("FORCE FORMAT", a), s)) {
                        let d = new MessageChannel();
                        this.messageHandler.ad = {
                            iframe: s,
                            eventSource: s.contentWindow,
                            port: d.port1
                        };
                    }
                    let r = Math.random().toString(36).substring(2, 15),
                        n = {
                            type: x,
                            action: g.REQUEST_FORMAT,
                            format: a,
                            sessionID: r,
                            ...l
                        };
                    return this.morphIntoFormat(a, n);
                }),
                A
                    ? k(this, I, new CSSStyleSheet())
                    : k(this, I, document.createElement("style")),
                k(this, G, this.attachShadow({ mode: "open" })),
                A
                    ? (p(this, G).adoptedStyleSheets = [p(this, I)])
                    : p(this, G).appendChild(p(this, I)),
                (this.container = document.createElement("div")),
                (this.container.id = "container"),
                (this.content = document.createElement("div")),
                (this.content.id = "ad-slot"),
                (this.content.className = "advantage-ad-slot"),
                k(this, H, document.createElement("slot")),
                (p(this, H).name = "advantage-ad-slot");
            let o = document.createElement("slot");
            (o.name = "overlay"),
                (this.uiLayer = document.createElement("advantage-ui-layer")),
                this.content.appendChild(p(this, H)),
                this.content.appendChild(o),
                this.content.appendChild(this.uiLayer),
                this.container.appendChild(this.content),
                p(this, G).append(this.container),
                m.getInstance().registerWrapper(this),
                p(this, H).addEventListener("slotchange", () => {
                    if (!p(this, re)) {
                        i.info("The content slot has been changed"),
                            k(this, re, !0);
                        return;
                    }
                }),
                p(this, Ee).call(this),
                (this.messageHandler = new K({
                    adSlotElement: this,
                    messageValidator:
                        (e = m.getInstance().config) == null
                            ? void 0
                            : e.messageValidator
                })),
                i.info(
                    "\u{1F50D} AdvantageWrapper initialized with ENHANCED iframe tracking (fix/detect-reset branch) \u{1F50D}"
                );
        }
        get contentNodes() {
            return p(this, H).assignedNodes() ?? [];
        }
        setAllowedFormats(e) {
            this.allowedFormats = e.map((o) => o.trim().toUpperCase());
        }
        clearAllowedFormats() {
            this.allowedFormats = null;
        }
        changeContent(e) {
            let o = this.querySelector('[slot="advantage-ad-slot"]');
            if ((o?.remove(), typeof e == "string")) {
                let a = document.createElement("div");
                (a.innerHTML = e),
                    a.setAttribute("slot", "advantage-ad-slot"),
                    this.appendChild(a);
            } else
                e.setAttribute("slot", "advantage-ad-slot"),
                    this.appendChild(e);
        }
        reset() {
            var e, o, a, s, l, r;
            if (!this.currentFormat) return;
            i.debug("Resetting wrapper. Current format:", this.currentFormat);
            let n = m.getInstance().formats.get(this.currentFormat);
            n &&
                n.reset(
                    this,
                    (o = (e = this.messageHandler) == null ? void 0 : e.ad) ==
                        null
                        ? void 0
                        : o.iframe
                );
            let d = m.getInstance().formatIntegrations.get(this.currentFormat);
            d &&
                (typeof d.reset == "function"
                    ? d.reset(
                          this,
                          (s =
                              (a = this.messageHandler) == null
                                  ? void 0
                                  : a.ad) == null
                              ? void 0
                              : s.iframe
                      )
                    : typeof d.onReset == "function" &&
                      d.onReset(
                          this,
                          (r =
                              (l = this.messageHandler) == null
                                  ? void 0
                                  : l.ad) == null
                              ? void 0
                              : r.iframe
                      )),
                this.uiLayer.changeContent(""),
                (this.currentFormat = ""),
                ne(this, $, X).call(this),
                k(this, E, null),
                i.debug("Wrapper reset complete. Active iframe cleared.");
        }
        animateClose() {
            this.classList.add("animate"),
                this.addEventListener("transitionend", () => {
                    this.style.display = "none";
                }),
                (this.style.height = "0px");
        }
        close() {
            var e, o, a, s, l, r;
            if (!this.currentFormat) {
                i.info("No format to close.");
                return;
            }
            let n = m.getInstance().formats.get(this.currentFormat);
            i.info("Advantage.getInstance().formats", m.getInstance().formats),
                i.info("Advantage.getInstance().id", m.id),
                i.info("Closing the current format.", n),
                n &&
                    (i.info("Closing the current format.", n),
                    n.close &&
                        n.close(
                            this,
                            (o =
                                (e = this.messageHandler) == null
                                    ? void 0
                                    : e.ad) == null
                                ? void 0
                                : o.iframe
                        ));
            let d = m.getInstance().formatIntegrations.get(this.currentFormat);
            d &&
                (typeof d.close == "function"
                    ? d.close(
                          this,
                          (s =
                              (a = this.messageHandler) == null
                                  ? void 0
                                  : a.ad) == null
                              ? void 0
                              : s.iframe
                      )
                    : typeof d.onClose == "function" &&
                      d.onClose(
                          this,
                          (r =
                              (l = this.messageHandler) == null
                                  ? void 0
                                  : l.ad) == null
                              ? void 0
                              : r.iframe
                      )),
                (this.currentFormat = ""),
                ne(this, $, X).call(this),
                k(this, E, null),
                i.debug("Format closed. Active iframe cleared.");
        }
        applyStylesToAllChildElements(e) {
            this.contentNodes.forEach((o) =>
                Ae(o, (a) => {
                    (a instanceof HTMLDivElement ||
                        a instanceof HTMLIFrameElement) &&
                        (a.style.cssText = e);
                })
            );
        }
        insertCSS(e) {
            A ? p(this, I).replaceSync(e) : (p(this, I).textContent = e);
        }
        resetCSS() {
            A ? p(this, I).replaceSync("") : (p(this, I).textContent = "");
        }
        connectedCallback() {}
    };
I = new WeakMap();
G = new WeakMap();
H = new WeakMap();
re = new WeakMap();
le = new WeakMap();
E = new WeakMap();
$ = new WeakSet();
X = function () {
    this.currentFormat
        ? this.setAttribute("current-format", this.currentFormat)
        : this.removeAttribute("current-format");
};
Ee = new WeakMap();
var it = Object.defineProperty,
    $e = (t) => {
        throw TypeError(t);
    },
    nt = (t, e, o) =>
        e in t
            ? it(t, e, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: o
              })
            : (t[e] = o),
    rt = (t, e, o) => nt(t, typeof e != "symbol" ? e + "" : e, o),
    Ve = (t, e, o) => e.has(t) || $e("Cannot " + o),
    u = (t, e, o) => (
        Ve(t, e, "read from private field"), o ? o.call(t) : e.get(t)
    ),
    ce = (t, e, o) =>
        e.has(t)
            ? $e("Cannot add the same private member more than once")
            : e instanceof WeakSet
            ? e.add(t)
            : e.set(t, o),
    ee = (t, e, o, a) => (
        Ve(t, e, "write to private field"), a ? a.call(t, o) : e.set(t, o), o
    ),
    V,
    F,
    Z,
    N,
    he = class extends HTMLElement {
        constructor() {
            super(),
                ce(this, V),
                ce(this, F),
                ce(this, Z),
                ce(this, N),
                rt(this, "slotName", "advantage-ui-content"),
                A
                    ? ee(this, F, new CSSStyleSheet())
                    : ee(this, F, document.createElement("style")),
                ee(this, V, this.attachShadow({ mode: "open" })),
                A
                    ? (u(this, V).adoptedStyleSheets = [u(this, F)])
                    : u(this, V).appendChild(u(this, F)),
                ee(this, Z, document.createElement("div")),
                (u(this, Z).id = "container"),
                ee(this, N, document.createElement("div")),
                (u(this, N).id = "content"),
                u(this, Z).appendChild(u(this, N)),
                u(this, V).append(u(this, Z));
        }
        changeContent(e) {
            typeof e == "string"
                ? (u(this, N).innerHTML = e)
                : ((u(this, N).innerHTML = ""), u(this, N).appendChild(e));
        }
        insertCSS(e) {
            A ? u(this, F).replaceSync(e) : (u(this, F).textContent = e);
        }
    };
V = new WeakMap();
F = new WeakMap();
Z = new WeakMap();
N = new WeakMap();
function q(t, e, o) {
    var a;
    let s;
    if (
        (typeof t == "string" ? (s = document.querySelector(t)) : (s = t), !s)
    ) {
        console.warn("Target element not found.");
        return;
    }
    let l = document.createElement("advantage-wrapper");
    if (e && e.length > 0) {
        let n = e.join(", ");
        l.setAttribute("exclude-formats", n);
    }
    if (o && o.length > 0) {
        let n = o.join(", ");
        l.setAttribute("allowed-formats", n);
    }
    let r = document.createElement("div");
    r.setAttribute("slot", "advantage-ad-slot"),
        (a = s.parentNode) == null || a.insertBefore(l, s),
        l.appendChild(r),
        r.appendChild(s);
}
var lt, dt, ct, ht;
lt = new WeakMap();
dt = new WeakMap();
ct = new WeakMap();
ht = new WeakMap();
if (window.advantageWrapQueue)
    for (let t of window.advantageWrapQueue) {
        let [e, o] = t;
        q(e, o);
    }
window.advantageWrapAdSlotElement = q;
if (window.advantageCmdQueue)
    for (let t of window.advantageCmdQueue)
        try {
            t(q);
        } catch (e) {
            i.error("Error executing callback:", e);
        }
else window.advantageCmdQueue = [];
window.advantageCmdQueue.push = function (t) {
    Array.prototype.push.call(this, t);
    try {
        t(q);
    } catch (e) {
        i.error("Error executing callback:", e);
    }
};
window.advantageCmd = function (t) {
    try {
        t(q);
    } catch (e) {
        i.error("Error executing callback:", e);
    }
};
customElements.define("advantage-wrapper", de);
customElements.define("advantage-ui-layer", he);
var w = class t {
    static stringInstances = new Map();
    static elementInstances = new WeakMap();
    originalStyles = new Map();
    static getInstance(e) {
        return typeof e == "string"
            ? (t.stringInstances.has(e) || t.stringInstances.set(e, new t()),
              t.stringInstances.get(e))
            : (t.elementInstances.has(e) || t.elementInstances.set(e, new t()),
              t.elementInstances.get(e));
    }
    setStyle(e, o) {
        if (!e) {
            console.error("Element is not defined");
            return;
        }
        let a = this.originalStyles.get(e) || {};
        for (let [s, l] of Object.entries(o))
            s in a || (a[s] = e.style[s]), (e.style[s] = l);
        this.originalStyles.set(e, a);
    }
    restoreStyles() {
        this.originalStyles.forEach((e, o) => {
            for (let [a, s] of Object.entries(e)) o.style[a] = s;
        }),
            this.originalStyles.clear();
    }
};
var Ze = (t, e) => {
    t.uiLayer.style.setProperty("--adv-wp-header-bg", "#102433"),
        t.uiLayer.style.setProperty("--adv-wp-header-text", "#AEC2D0"),
        t.style.setProperty("--adv-wp-header-height", "40px"),
        t.uiLayer.style.setProperty("--adv-font-family-base", "sans-serif"),
        (t.uiLayer.style.fontSize = "14px");
    let o = t.uiLayer.shadowRoot?.querySelector(".continue");
    (o.style.fontSize = "14px"),
        matchMedia("(orientation: portrait)").matches &&
            (o.style.fontSize = "12px");
    let a = t.uiLayer.shadowRoot?.querySelector(".to-label");
    a && ((a.style.display = "block"), (a.style.whiteSpace = "nowrap"));
    let s = t.uiLayer.shadowRoot?.querySelector(".countdown"),
        l = t.uiLayer.shadowRoot?.querySelector(".favico");
    (l.style.position = "absolute"), (l.style.left = "0px");
    let r = document.createElement("div");
    (r.textContent = e),
        (r.style.position = "absolute"),
        (r.style.left = "30px"),
        (r.style.color = "#AEC2D0"),
        (r.style.fontSize = "14px"),
        l.parentElement?.appendChild(r),
        (s.style.opacity = "0");
};
var pt = m.getInstance();
pt.configure({
    formatIntegrations: [
        {
            format: c.TopScroll,
            options: {
                closeButton: !0,
                closeButtonText: "Forts\xE4tt till sajt",
                downArrow: !0,
                height: 80,
                closeButtonAnimationDuration: 0
            },
            setup: (t, e) =>
                new Promise((o) => {
                    let a = w.getInstance(e?.id ?? c.TopScroll);
                    a.setStyle(document.querySelector(".container"), {
                        position: "relative",
                        marginTop: "80svh",
                        zIndex: "1"
                    }),
                        a.setStyle(document.querySelector("main"), {
                            position: "absolute",
                            top: "0"
                        }),
                        a.setStyle(
                            document
                                .querySelector("main")
                                ?.querySelector(".container"),
                            {
                                paddingTop:
                                    document.querySelector(".container")
                                        .offsetHeight + "px"
                            }
                        ),
                        o();
                }),
            reset(t, e) {
                w.getInstance(e?.id ?? c.TopScroll).restoreStyles();
            },
            close: (t, e) => {
                w.getInstance(e?.id ?? c.TopScroll).restoreStyles();
            }
        },
        {
            format: c.Midscroll,
            setup: (t, e) =>
                new Promise((o) => {
                    let a = w.getInstance(e?.id ?? c.Midscroll);
                    a.setStyle(t.parentElement, {
                        position: "relative",
                        width: "100vw",
                        zIndex: "9999999999"
                    });
                    let s = t.parentElement.getBoundingClientRect();
                    s.left > 0 &&
                        a.setStyle(t.parentElement, {
                            marginLeft: `-${s.left}px`
                        }),
                        o();
                }),
            reset(t, e) {
                w.getInstance(e?.id ?? c.Midscroll).restoreStyles();
            },
            close(t, e) {
                w.getInstance(e?.id ?? c.Midscroll).restoreStyles();
            }
        },
        {
            format: c.WelcomePage,
            options: {
                autoCloseDuration: 20,
                siteTitle: `${
                    window.innerWidth < 450 ? "" : "Fotbolltransfers"
                }`,
                logo: `https://icons.duckduckgo.com/ip3/${window.location.hostname}.ico`,
                continueToLabel: "Forts\xE4tt till",
                scrollBackToTop: !1,
                adLabel: "Annons"
            },
            setup: (t, e) =>
                new Promise((o) => {
                    let a = w.getInstance(e?.id ?? c.WelcomePage);
                    a.setStyle(e?.parentElement, { margin: "0" }),
                        a.setStyle(t.parentElement, {
                            position: "relative",
                            zIndex: "9999999999"
                        }),
                        a.setStyle(document.body, {
                            paddingTop: "100vh",
                            overflow: "hidden"
                        }),
                        Ze(t, "Fotbolltransfers"),
                        o();
                }),
            reset(t, e) {
                w.getInstance(e?.id ?? c.WelcomePage).restoreStyles();
            },
            close(t, e) {
                w.getInstance(e?.id ?? c.WelcomePage).restoreStyles();
            }
        }
    ]
});
