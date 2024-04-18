const Vi = "finalize", Hi = "consider";
function Ct(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(Vi, {
      detail: { items: e, info: t }
    })
  );
}
function rt(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(Hi, {
      detail: { items: e, info: t }
    })
  );
}
const vn = "draggedEntered", Zt = "draggedLeft", yn = "draggedOverIndex", Hn = "draggedLeftDocument", on = {
  LEFT_FOR_ANOTHER: "leftForAnother",
  OUTSIDE_OF_ANY: "outsideOfAny"
};
function Ui(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(vn, {
      detail: { indexObj: e, draggedEl: t }
    })
  );
}
function ji(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(Zt, {
      detail: { draggedEl: e, type: on.LEFT_FOR_ANOTHER, theOtherDz: t }
    })
  );
}
function Wi(n, e) {
  n.dispatchEvent(
    new CustomEvent(Zt, {
      detail: { draggedEl: e, type: on.OUTSIDE_OF_ANY }
    })
  );
}
function Yi(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(yn, {
      detail: { indexObj: e, draggedEl: t }
    })
  );
}
function Ki(n) {
  window.dispatchEvent(
    new CustomEvent(Hn, {
      detail: { draggedEl: n }
    })
  );
}
const de = {
  DRAG_STARTED: "dragStarted",
  DRAGGED_ENTERED: vn,
  DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
  DRAGGED_OVER_INDEX: yn,
  DRAGGED_LEFT: Zt,
  DRAGGED_LEFT_ALL: "draggedLeftAll",
  DROPPED_INTO_ZONE: "droppedIntoZone",
  DROPPED_INTO_ANOTHER: "droppedIntoAnother",
  DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
  DRAG_STOPPED: "dragStopped"
}, _e = {
  POINTER: "pointer",
  KEYBOARD: "keyboard"
}, En = "isDndShadowItem", Un = "data-is-dnd-shadow-item-internal", Xi = "data-is-dnd-shadow-item-hint", Ji = "id:dnd-shadow-placeholder-0000", Qi = "dnd-action-dragged-el";
let se = "id", Mn = 0;
function Ql() {
  Mn++;
}
function xl() {
  if (Mn === 0)
    throw new Error("Bug! trying to decrement when there are no dropzones");
  Mn--;
}
const jn = typeof window > "u";
function Pn(n) {
  let e;
  const t = n.getBoundingClientRect(), l = getComputedStyle(n), i = l.transform;
  if (i) {
    let s, r, a, o;
    if (i.startsWith("matrix3d("))
      e = i.slice(9, -1).split(/, /), s = +e[0], r = +e[5], a = +e[12], o = +e[13];
    else if (i.startsWith("matrix("))
      e = i.slice(7, -1).split(/, /), s = +e[0], r = +e[3], a = +e[4], o = +e[5];
    else
      return t;
    const f = l.transformOrigin, u = t.x - a - (1 - s) * parseFloat(f), d = t.y - o - (1 - r) * parseFloat(f.slice(f.indexOf(" ") + 1)), c = s ? t.width / s : n.offsetWidth, m = r ? t.height / r : n.offsetHeight;
    return {
      x: u,
      y: d,
      width: c,
      height: m,
      top: d,
      right: u + c,
      bottom: d + m,
      left: u
    };
  } else
    return t;
}
function $l(n) {
  const e = Pn(n);
  return {
    top: e.top + window.scrollY,
    bottom: e.bottom + window.scrollY,
    left: e.left + window.scrollX,
    right: e.right + window.scrollX
  };
}
function ei(n) {
  const e = n.getBoundingClientRect();
  return {
    top: e.top + window.scrollY,
    bottom: e.bottom + window.scrollY,
    left: e.left + window.scrollX,
    right: e.right + window.scrollX
  };
}
function ti(n) {
  return {
    x: (n.left + n.right) / 2,
    y: (n.top + n.bottom) / 2
  };
}
function xi(n, e) {
  return Math.sqrt(Math.pow(n.x - e.x, 2) + Math.pow(n.y - e.y, 2));
}
function Dn(n, e) {
  return n.y <= e.bottom && n.y >= e.top && n.x >= e.left && n.x <= e.right;
}
function Pt(n) {
  return ti(ei(n));
}
function nl(n, e) {
  const t = Pt(n), l = $l(e);
  return Dn(t, l);
}
function $i(n, e) {
  const t = Pt(n), l = Pt(e);
  return xi(t, l);
}
function es(n) {
  const e = ei(n);
  return e.right < 0 || e.left > document.documentElement.scrollWidth || e.bottom < 0 || e.top > document.documentElement.scrollHeight;
}
let Dt;
function Wn() {
  Dt = /* @__PURE__ */ new Map();
}
Wn();
function ts(n) {
  const e = Array.from(n.children).findIndex((t) => t.getAttribute(Un));
  if (e >= 0)
    return Dt.has(n) || Dt.set(n, /* @__PURE__ */ new Map()), Dt.get(n).set(e, $l(n.children[e])), e;
}
function ns(n, e) {
  if (!nl(n, e))
    return null;
  const t = e.children;
  if (t.length === 0)
    return { index: 0, isProximityBased: !0 };
  const l = ts(e);
  for (let r = 0; r < t.length; r++)
    if (nl(n, t[r])) {
      const a = Dt.has(e) && Dt.get(e).get(r);
      return a && !Dn(Pt(n), a) ? { index: l, isProximityBased: !1 } : { index: r, isProximityBased: !1 };
    }
  let i = Number.MAX_VALUE, s;
  for (let r = 0; r < t.length; r++) {
    const a = $i(n, t[r]);
    a < i && (i = a, s = r);
  }
  return { index: s, isProximityBased: !0 };
}
function Ut(n) {
  return JSON.stringify(n, null, 2);
}
function rn(n) {
  if (!n)
    throw new Error("cannot get depth of a falsy node");
  return ni(n, 0);
}
function ni(n, e = 0) {
  return n.parentElement ? ni(n.parentElement, e + 1) : e - 1;
}
function ls(n, e) {
  if (Object.keys(n).length !== Object.keys(e).length)
    return !1;
  for (const t in n)
    if (!{}.hasOwnProperty.call(e, t) || e[t] !== n[t])
      return !1;
  return !0;
}
function is(n, e) {
  if (n.length !== e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
const ss = 200, ll = 10;
let Fn;
function os(n, e, t = ss, l) {
  let i, s, r = !1, a;
  const o = Array.from(e).sort((u, d) => rn(d) - rn(u));
  function f() {
    const u = Pt(n), d = l.multiScrollIfNeeded();
    if (!d && a && Math.abs(a.x - u.x) < ll && Math.abs(a.y - u.y) < ll) {
      Fn = window.setTimeout(f, t);
      return;
    }
    if (es(n)) {
      Ki(n);
      return;
    }
    a = u;
    let c = !1;
    for (const m of o) {
      d && Wn();
      const y = ns(n, m);
      if (y === null)
        continue;
      const { index: C } = y;
      c = !0, m !== i ? (i && ji(i, n, m), Ui(m, y, n), i = m) : C !== s && (Yi(m, y, n), s = C);
      break;
    }
    !c && r && i ? (Wi(i, n), i = void 0, s = void 0, r = !1) : r = !0, Fn = window.setTimeout(f, t);
  }
  f();
}
function rs() {
  clearTimeout(Fn), Wn();
}
const Nt = 30;
function as() {
  let n;
  function e() {
    n = { directionObj: void 0, stepPx: 0 };
  }
  e();
  function t(s) {
    const { directionObj: r, stepPx: a } = n;
    r && (s.scrollBy(r.x * a, r.y * a), window.requestAnimationFrame(() => t(s)));
  }
  function l(s) {
    return Nt - s;
  }
  function i(s, r) {
    if (!r)
      return !1;
    const a = fs(s, r);
    if (a === null)
      return e(), !1;
    const o = !!n.directionObj;
    let [f, u] = [!1, !1];
    return r.scrollHeight > r.clientHeight && (a.bottom < Nt ? (f = !0, n.directionObj = { x: 0, y: 1 }, n.stepPx = l(a.bottom)) : a.top < Nt && (f = !0, n.directionObj = { x: 0, y: -1 }, n.stepPx = l(a.top)), !o && f) || r.scrollWidth > r.clientWidth && (a.right < Nt ? (u = !0, n.directionObj = { x: 1, y: 0 }, n.stepPx = l(a.right)) : a.left < Nt && (u = !0, n.directionObj = { x: -1, y: 0 }, n.stepPx = l(a.left)), !o && u) ? (t(r), !0) : (e(), !1);
  }
  return {
    scrollIfNeeded: i,
    resetScrolling: e
  };
}
function fs(n, e) {
  const t = e === document.scrollingElement ? {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth
  } : e.getBoundingClientRect();
  return Dn(n, t) ? {
    top: n.y - t.top,
    bottom: t.bottom - n.y,
    left: n.x - t.left,
    right: t.right - n.x
  } : null;
}
function us(n = [], e) {
  const t = ds(n), l = Array.from(t).sort((r, a) => rn(a) - rn(r)), { scrollIfNeeded: i } = as();
  function s() {
    const r = e();
    if (!r || !l)
      return !1;
    const a = l.filter(
      (o) => Dn(r, o.getBoundingClientRect()) || o === document.scrollingElement
    );
    for (let o = 0; o < a.length; o++)
      if (i(r, a[o]))
        return !0;
    return !1;
  }
  return {
    multiScrollIfNeeded: t.size > 0 ? s : () => !1
  };
}
function cs(n) {
  if (!n)
    return [];
  const e = [];
  let t = n;
  for (; t; ) {
    const { overflow: l } = window.getComputedStyle(t);
    l.split(" ").some((i) => i.includes("auto") || i.includes("scroll")) && e.push(t), t = t.parentElement;
  }
  return e;
}
function ds(n) {
  const e = /* @__PURE__ */ new Set();
  for (let t of n)
    cs(t).forEach((l) => e.add(l));
  return (document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight || document.scrollingElement.scrollWidth > document.scrollingElement.clientHeight) && e.add(document.scrollingElement), e;
}
function _s(n) {
  const e = n.cloneNode(!0), t = [], l = n.tagName === "SELECT", i = l ? [n] : [...n.querySelectorAll("select")];
  for (const a of i)
    t.push(a.value);
  if (i.length > 0) {
    const a = l ? [e] : [...e.querySelectorAll("select")];
    for (let o = 0; o < a.length; o++) {
      const f = a[o], u = t[o], d = f.querySelector(`option[value="${u}"`);
      d && d.setAttribute("selected", !0);
    }
  }
  const s = n.tagName === "CANVAS", r = s ? [n] : [...n.querySelectorAll("canvas")];
  if (r.length > 0) {
    const a = s ? [e] : [...e.querySelectorAll("canvas")];
    for (let o = 0; o < a.length; o++) {
      const f = r[o], u = a[o];
      u.width = f.width, u.height = f.height, u.getContext("2d").drawImage(f, 0, 0);
    }
  }
  return e;
}
const Ft = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
}), ms = {
  [Ft.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT]: !1
};
function li(n) {
  if (!Ft[n])
    throw new Error(`Can't get non existing feature flag ${n}! Supported flags: ${Object.keys(Ft)}`);
  return ms[n];
}
const gs = 0.2;
function ft(n) {
  return `${n} ${gs}s ease`;
}
function hs(n, e) {
  const t = n.getBoundingClientRect(), l = _s(n);
  ii(n, l), l.id = Qi, l.style.position = "fixed";
  let i = t.top, s = t.left;
  if (l.style.top = `${i}px`, l.style.left = `${s}px`, e) {
    const r = ti(t);
    i -= r.y - e.y, s -= r.x - e.x, window.setTimeout(() => {
      l.style.top = `${i}px`, l.style.left = `${s}px`;
    }, 0);
  }
  return l.style.margin = "0", l.style.boxSizing = "border-box", l.style.height = `${t.height}px`, l.style.width = `${t.width}px`, l.style.transition = `${ft("top")}, ${ft("left")}, ${ft("background-color")}, ${ft("opacity")}, ${ft("color")} `, window.setTimeout(() => l.style.transition += `, ${ft("width")}, ${ft("height")}`, 0), l.style.zIndex = "9999", l.style.cursor = "grabbing", l;
}
function bs(n) {
  n.style.cursor = "grab";
}
function ps(n, e, t, l) {
  ii(e, n);
  const i = e.getBoundingClientRect(), s = n.getBoundingClientRect(), r = i.width - s.width, a = i.height - s.height;
  if (r || a) {
    const o = {
      left: (t - s.left) / s.width,
      top: (l - s.top) / s.height
    };
    li(Ft.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) || (n.style.height = `${i.height}px`, n.style.width = `${i.width}px`), n.style.left = `${parseFloat(n.style.left) - o.left * r}px`, n.style.top = `${parseFloat(n.style.top) - o.top * a}px`;
  }
}
function ii(n, e) {
  const t = window.getComputedStyle(n);
  Array.from(t).filter(
    (l) => l.startsWith("background") || l.startsWith("padding") || l.startsWith("font") || l.startsWith("text") || l.startsWith("align") || l.startsWith("justify") || l.startsWith("display") || l.startsWith("flex") || l.startsWith("border") || l === "opacity" || l === "color" || l === "list-style-type" || // copying with and height to make up for rect update timing issues in some browsers
    li(Ft.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) && (l === "width" || l === "height")
  ).forEach((l) => e.style.setProperty(l, t.getPropertyValue(l), t.getPropertyPriority(l)));
}
function ws(n, e) {
  n.draggable = !1, n.ondragstart = () => !1, e ? (n.style.userSelect = "", n.style.WebkitUserSelect = "", n.style.cursor = "") : (n.style.userSelect = "none", n.style.WebkitUserSelect = "none", n.style.cursor = "grab");
}
function si(n) {
  n.style.display = "none", n.style.position = "fixed", n.style.zIndex = "-5";
}
function vs(n) {
  n.style.visibility = "hidden", n.setAttribute(Un, "true");
}
function ys(n) {
  n.style.visibility = "", n.removeAttribute(Un);
}
function Yt(n, e = () => {
}, t = () => []) {
  n.forEach((l) => {
    const i = e(l);
    Object.keys(i).forEach((s) => {
      l.style[s] = i[s];
    }), t(l).forEach((s) => l.classList.add(s));
  });
}
function an(n, e = () => {
}, t = () => []) {
  n.forEach((l) => {
    const i = e(l);
    Object.keys(i).forEach((s) => {
      l.style[s] = "";
    }), t(l).forEach((s) => l.classList.contains(s) && l.classList.remove(s));
  });
}
function Es(n) {
  const e = n.style.minHeight;
  n.style.minHeight = window.getComputedStyle(n).getPropertyValue("height");
  const t = n.style.minWidth;
  return n.style.minWidth = window.getComputedStyle(n).getPropertyValue("width"), function() {
    n.style.minHeight = e, n.style.minWidth = t;
  };
}
const Ds = "--any--", ks = 100, Ts = 20, il = 3, sl = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
}, ol = "data-is-dnd-original-dragged-item";
let He, ae, ye, kn, W, Tn, ot, fe, lt, Ce, dt = !1, Yn = !1, Kn, zt = !1, Kt = [];
const Ze = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new Map(), An = /* @__PURE__ */ new WeakMap();
function Cs(n, e) {
  Ze.has(e) || Ze.set(e, /* @__PURE__ */ new Set()), Ze.get(e).has(n) || (Ze.get(e).add(n), Ql());
}
function rl(n, e) {
  Ze.get(e).delete(n), xl(), Ze.get(e).size === 0 && Ze.delete(e);
}
function Os() {
  const n = Ze.get(kn);
  for (const i of n)
    i.addEventListener(vn, oi), i.addEventListener(Zt, ri), i.addEventListener(yn, ai);
  window.addEventListener(Hn, Ot);
  const e = Math.max(...Array.from(n.keys()).map((i) => ne.get(i).dropAnimationDurationMs)), t = e === 0 ? Ts : Math.max(e, ks), l = us(n, () => Ce);
  os(ae, n, t * 1.07, l);
}
function As() {
  const n = Ze.get(kn);
  for (const e of n)
    e.removeEventListener(vn, oi), e.removeEventListener(Zt, ri), e.removeEventListener(yn, ai);
  window.removeEventListener(Hn, Ot), rs();
}
function Cn(n) {
  return n.findIndex((e) => !!e[En]);
}
function Is(n) {
  return { ...n, [En]: !0, [se]: Ji };
}
function oi(n) {
  let { items: e, dropFromOthersDisabled: t } = ne.get(n.currentTarget);
  if (t && n.currentTarget !== W)
    return;
  if (zt = !1, e = e.filter((r) => r[se] !== ot[se]), W !== n.currentTarget) {
    const a = ne.get(W).items.filter((o) => !o[En]);
    rt(W, a, {
      trigger: de.DRAGGED_ENTERED_ANOTHER,
      id: ye[se],
      source: _e.POINTER
    });
  }
  const { index: l, isProximityBased: i } = n.detail.indexObj, s = i && l === n.currentTarget.children.length - 1 ? l + 1 : l;
  fe = n.currentTarget, e.splice(s, 0, ot), rt(n.currentTarget, e, { trigger: de.DRAGGED_ENTERED, id: ye[se], source: _e.POINTER });
}
function ri(n) {
  if (!dt)
    return;
  const { items: e, dropFromOthersDisabled: t } = ne.get(n.currentTarget);
  if (t && n.currentTarget !== W && n.currentTarget !== fe)
    return;
  const l = [...e], i = Cn(l);
  i !== -1 && l.splice(i, 1);
  const s = fe;
  fe = void 0;
  const { type: r, theOtherDz: a } = n.detail;
  if (r === on.OUTSIDE_OF_ANY || r === on.LEFT_FOR_ANOTHER && a !== W && ne.get(a).dropFromOthersDisabled) {
    zt = !0, fe = W;
    const o = s === W ? l : [...ne.get(W).items];
    o.splice(Tn, 0, ot), rt(W, o, {
      trigger: de.DRAGGED_LEFT_ALL,
      id: ye[se],
      source: _e.POINTER
    });
  }
  rt(n.currentTarget, l, {
    trigger: de.DRAGGED_LEFT,
    id: ye[se],
    source: _e.POINTER
  });
}
function ai(n) {
  const { items: e, dropFromOthersDisabled: t } = ne.get(n.currentTarget);
  if (t && n.currentTarget !== W)
    return;
  const l = [...e];
  zt = !1;
  const { index: i } = n.detail.indexObj, s = Cn(l);
  s !== -1 && l.splice(s, 1), l.splice(i, 0, ot), rt(n.currentTarget, l, { trigger: de.DRAGGED_OVER_INDEX, id: ye[se], source: _e.POINTER });
}
function fn(n) {
  n.preventDefault();
  const e = n.touches ? n.touches[0] : n;
  Ce = { x: e.clientX, y: e.clientY }, ae.style.transform = `translate3d(${Ce.x - lt.x}px, ${Ce.y - lt.y}px, 0)`;
}
function Ot() {
  Yn = !0, window.removeEventListener("mousemove", fn), window.removeEventListener("touchmove", fn), window.removeEventListener("mouseup", Ot), window.removeEventListener("touchend", Ot), As(), bs(ae), fe || (fe = W);
  let { items: n, type: e } = ne.get(fe);
  an(
    Ze.get(e),
    (i) => ne.get(i).dropTargetStyle,
    (i) => ne.get(i).dropTargetClasses
  );
  let t = Cn(n);
  t === -1 && fe === W && (t = Tn), n = n.map((i) => i[En] ? ye : i);
  function l() {
    Kn(), Ct(fe, n, {
      trigger: zt ? de.DROPPED_OUTSIDE_OF_ANY : de.DROPPED_INTO_ZONE,
      id: ye[se],
      source: _e.POINTER
    }), fe !== W && Ct(W, ne.get(W).items, {
      trigger: de.DROPPED_INTO_ANOTHER,
      id: ye[se],
      source: _e.POINTER
    }), t !== -1 && ys(fe.children[t]), Ns();
  }
  Ss(t, l);
}
function Ss(n, e) {
  const t = n > -1 ? Pn(fe.children[n]) : Pn(fe), l = {
    x: t.left - parseFloat(ae.style.left),
    y: t.top - parseFloat(ae.style.top)
  }, { dropAnimationDurationMs: i } = ne.get(fe), s = `transform ${i}ms ease`;
  ae.style.transition = ae.style.transition ? ae.style.transition + "," + s : s, ae.style.transform = `translate3d(${l.x}px, ${l.y}px, 0)`, window.setTimeout(e, i);
}
function Rs(n, e) {
  Kt.push({ dz: n, destroy: e }), window.requestAnimationFrame(() => {
    si(n), document.body.appendChild(n);
  });
}
function Ns() {
  ae.remove(), He.remove(), Kt.length && (Kt.forEach(({ dz: n, destroy: e }) => {
    e(), n.remove();
  }), Kt = []), ae = void 0, He = void 0, ye = void 0, kn = void 0, W = void 0, Tn = void 0, ot = void 0, fe = void 0, lt = void 0, Ce = void 0, dt = !1, Yn = !1, Kn = void 0, zt = !1;
}
function Ls(n, e) {
  let t = !1;
  const l = {
    items: void 0,
    type: void 0,
    flipDurationMs: 0,
    dragDisabled: !1,
    morphDisabled: !1,
    dropFromOthersDisabled: !1,
    dropTargetStyle: sl,
    dropTargetClasses: [],
    transformDraggedElement: () => {
    },
    centreDraggedOnCursor: !1
  };
  let i = /* @__PURE__ */ new Map();
  function s() {
    window.addEventListener("mousemove", o, { passive: !1 }), window.addEventListener("touchmove", o, { passive: !1, capture: !1 }), window.addEventListener("mouseup", a, { passive: !1 }), window.addEventListener("touchend", a, { passive: !1 });
  }
  function r() {
    window.removeEventListener("mousemove", o), window.removeEventListener("touchmove", o), window.removeEventListener("mouseup", a), window.removeEventListener("touchend", a);
  }
  function a(c) {
    r(), He = void 0, lt = void 0, Ce = void 0, c.type === "touchend" && c.target.click();
  }
  function o(c) {
    c.preventDefault();
    const m = c.touches ? c.touches[0] : c;
    Ce = { x: m.clientX, y: m.clientY }, (Math.abs(Ce.x - lt.x) >= il || Math.abs(Ce.y - lt.y) >= il) && (r(), u());
  }
  function f(c) {
    if (c.target !== c.currentTarget && (c.target.value !== void 0 || c.target.isContentEditable) || c.button || dt)
      return;
    c.preventDefault(), c.stopPropagation();
    const m = c.touches ? c.touches[0] : c;
    lt = { x: m.clientX, y: m.clientY }, Ce = { ...lt }, He = c.currentTarget, s();
  }
  function u() {
    dt = !0;
    const c = i.get(He);
    Tn = c, W = He.parentElement;
    const m = W.closest("dialog") || W.getRootNode(), y = m.body || m, { items: C, type: T, centreDraggedOnCursor: E } = l, O = [...C];
    ye = O[c], kn = T, ot = Is(ye), ae = hs(He, E && Ce), He.setAttribute(ol, !0);
    function _() {
      ae.parentElement ? window.requestAnimationFrame(_) : (y.appendChild(ae), ae.focus(), Os(), si(He), y.appendChild(He), ot[se] = ye[se]);
    }
    window.requestAnimationFrame(_), Yt(
      Array.from(Ze.get(l.type)).filter((p) => p === W || !ne.get(p).dropFromOthersDisabled),
      (p) => ne.get(p).dropTargetStyle,
      (p) => ne.get(p).dropTargetClasses
    ), O.splice(c, 1, ot), Kn = Es(W), rt(W, O, { trigger: de.DRAG_STARTED, id: ye[se], source: _e.POINTER }), window.addEventListener("mousemove", fn, { passive: !1 }), window.addEventListener("touchmove", fn, { passive: !1, capture: !1 }), window.addEventListener("mouseup", Ot, { passive: !1 }), window.addEventListener("touchend", Ot, { passive: !1 });
  }
  function d({
    items: c = void 0,
    flipDurationMs: m = 0,
    type: y = Ds,
    dragDisabled: C = !1,
    morphDisabled: T = !1,
    dropFromOthersDisabled: E = !1,
    dropTargetStyle: O = sl,
    dropTargetClasses: _ = [],
    transformDraggedElement: p = () => {
    },
    centreDraggedOnCursor: Z = !1
  }) {
    l.dropAnimationDurationMs = m, l.type && y !== l.type && rl(n, l.type), l.type = y, l.items = [...c], l.dragDisabled = C, l.morphDisabled = T, l.transformDraggedElement = p, l.centreDraggedOnCursor = Z, t && dt && !Yn && (!ls(O, l.dropTargetStyle) || !is(_, l.dropTargetClasses)) && (an(
      [n],
      () => l.dropTargetStyle,
      () => _
    ), Yt(
      [n],
      () => O,
      () => _
    )), l.dropTargetStyle = O, l.dropTargetClasses = [..._];
    function k(S, h) {
      return ne.get(S) ? ne.get(S)[h] : l[h];
    }
    t && dt && l.dropFromOthersDisabled !== E && (E ? an(
      [n],
      (S) => k(S, "dropTargetStyle"),
      (S) => k(S, "dropTargetClasses")
    ) : Yt(
      [n],
      (S) => k(S, "dropTargetStyle"),
      (S) => k(S, "dropTargetClasses")
    )), l.dropFromOthersDisabled = E, ne.set(n, l), Cs(n, y);
    const z = Cn(l.items);
    for (let S = 0; S < n.children.length; S++) {
      const h = n.children[S];
      if (ws(h, C), S === z) {
        l.transformDraggedElement(ae, ye, S), T || ps(ae, h, Ce.x, Ce.y), vs(h);
        continue;
      }
      h.removeEventListener("mousedown", An.get(h)), h.removeEventListener("touchstart", An.get(h)), C || (h.addEventListener("mousedown", f), h.addEventListener("touchstart", f), An.set(h, f)), i.set(h, S), t || (t = !0);
    }
  }
  return d(e), {
    update: (c) => {
      d(c);
    },
    destroy: () => {
      function c() {
        rl(n, ne.get(n).type), ne.delete(n);
      }
      dt && !n.closest(`[${ol}]`) ? Rs(n, c) : c();
    }
  };
}
const qn = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
}, fi = {
  [qn.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
  [qn.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
}, Ms = "dnd-action-aria-alert";
let ee;
function Zn() {
  ee || (ee = document.createElement("div"), function() {
    ee.id = Ms, ee.style.position = "fixed", ee.style.bottom = "0", ee.style.left = "0", ee.style.zIndex = "-5", ee.style.opacity = "0", ee.style.height = "0", ee.style.width = "0", ee.setAttribute("role", "alert");
  }(), document.body.prepend(ee), Object.entries(fi).forEach(([n, e]) => document.body.prepend(qs(n, e))));
}
function Ps() {
  return jn ? null : (document.readyState === "complete" ? Zn() : window.addEventListener("DOMContentLoaded", Zn), { ...qn });
}
function Fs() {
  jn || !ee || (Object.keys(fi).forEach((n) => {
    var e;
    return (e = document.getElementById(n)) == null ? void 0 : e.remove();
  }), ee.remove(), ee = void 0);
}
function qs(n, e) {
  const t = document.createElement("div");
  return t.id = n, t.innerHTML = `<p>${e}</p>`, t.style.display = "none", t.style.position = "fixed", t.style.zIndex = "-5", t;
}
function kt(n) {
  if (jn)
    return;
  ee || Zn(), ee.innerHTML = "";
  const e = document.createTextNode(n);
  ee.appendChild(e), ee.style.display = "none", ee.style.display = "inline";
}
const Zs = "--any--", al = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
let Oe = !1, zn, ue, mt = "", ct, Ue, it = "";
const un = /* @__PURE__ */ new WeakSet(), fl = /* @__PURE__ */ new WeakMap(), ul = /* @__PURE__ */ new WeakMap(), Gn = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map();
let cn;
function zs(n, e) {
  qe.size === 0 && (cn = Ps(), window.addEventListener("keydown", ui), window.addEventListener("click", ci)), qe.has(e) || qe.set(e, /* @__PURE__ */ new Set()), qe.get(e).has(n) || (qe.get(e).add(n), Ql());
}
function cl(n, e) {
  ue === n && qt(), qe.get(e).delete(n), xl(), qe.get(e).size === 0 && qe.delete(e), qe.size === 0 && (window.removeEventListener("keydown", ui), window.removeEventListener("click", ci), cn = void 0, Fs());
}
function ui(n) {
  if (Oe)
    switch (n.key) {
      case "Escape": {
        qt();
        break;
      }
    }
}
function ci() {
  Oe && (un.has(document.activeElement) || qt());
}
function Gs(n) {
  if (!Oe)
    return;
  const e = n.currentTarget;
  if (e === ue)
    return;
  mt = e.getAttribute("aria-label") || "";
  const { items: t } = oe.get(ue), l = t.find((f) => f[se] === Ue), i = t.indexOf(l), s = t.splice(i, 1)[0], { items: r, autoAriaDisabled: a } = oe.get(e);
  e.getBoundingClientRect().top < ue.getBoundingClientRect().top || e.getBoundingClientRect().left < ue.getBoundingClientRect().left ? (r.push(s), a || kt(`Moved item ${it} to the end of the list ${mt}`)) : (r.unshift(s), a || kt(`Moved item ${it} to the beginning of the list ${mt}`)), Ct(ue, t, { trigger: de.DROPPED_INTO_ANOTHER, id: Ue, source: _e.KEYBOARD }), Ct(e, r, { trigger: de.DROPPED_INTO_ZONE, id: Ue, source: _e.KEYBOARD }), ue = e;
}
function di() {
  Gn.forEach(({ update: n }, e) => n(oe.get(e)));
}
function qt(n = !0) {
  oe.get(ue).autoAriaDisabled || kt(`Stopped dragging item ${it}`), un.has(document.activeElement) && document.activeElement.blur(), n && rt(ue, oe.get(ue).items, {
    trigger: de.DRAG_STOPPED,
    id: Ue,
    source: _e.KEYBOARD
  }), an(
    qe.get(zn),
    (e) => oe.get(e).dropTargetStyle,
    (e) => oe.get(e).dropTargetClasses
  ), ct = null, Ue = null, it = "", zn = null, ue = null, mt = "", Oe = !1, di();
}
function Bs(n, e) {
  const t = {
    items: void 0,
    type: void 0,
    dragDisabled: !1,
    zoneTabIndex: 0,
    zoneItemTabIndex: 0,
    dropFromOthersDisabled: !1,
    dropTargetStyle: al,
    dropTargetClasses: [],
    autoAriaDisabled: !1
  };
  function l(u, d, c) {
    u.length <= 1 || u.splice(c, 1, u.splice(d, 1, u[c])[0]);
  }
  function i(u) {
    switch (u.key) {
      case "Enter":
      case " ": {
        if ((u.target.disabled !== void 0 || u.target.href || u.target.isContentEditable) && !un.has(u.target))
          return;
        u.preventDefault(), u.stopPropagation(), Oe ? qt() : s(u);
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (!Oe)
          return;
        u.preventDefault(), u.stopPropagation();
        const { items: d } = oe.get(n), c = Array.from(n.children), m = c.indexOf(u.currentTarget);
        m < c.length - 1 && (t.autoAriaDisabled || kt(`Moved item ${it} to position ${m + 2} in the list ${mt}`), l(d, m, m + 1), Ct(n, d, { trigger: de.DROPPED_INTO_ZONE, id: Ue, source: _e.KEYBOARD }));
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        if (!Oe)
          return;
        u.preventDefault(), u.stopPropagation();
        const { items: d } = oe.get(n), m = Array.from(n.children).indexOf(u.currentTarget);
        m > 0 && (t.autoAriaDisabled || kt(`Moved item ${it} to position ${m} in the list ${mt}`), l(d, m, m - 1), Ct(n, d, { trigger: de.DROPPED_INTO_ZONE, id: Ue, source: _e.KEYBOARD }));
        break;
      }
    }
  }
  function s(u) {
    a(u.currentTarget), ue = n, zn = t.type, Oe = !0;
    const d = Array.from(qe.get(t.type)).filter((c) => c === ue || !oe.get(c).dropFromOthersDisabled);
    if (Yt(
      d,
      (c) => oe.get(c).dropTargetStyle,
      (c) => oe.get(c).dropTargetClasses
    ), !t.autoAriaDisabled) {
      let c = `Started dragging item ${it}. Use the arrow keys to move it within its list ${mt}`;
      d.length > 1 && (c += ", or tab to another list in order to move the item into it"), kt(c);
    }
    rt(n, oe.get(n).items, { trigger: de.DRAG_STARTED, id: Ue, source: _e.KEYBOARD }), di();
  }
  function r(u) {
    Oe && u.currentTarget !== ct && (u.stopPropagation(), qt(!1), s(u));
  }
  function a(u) {
    const { items: d } = oe.get(n), c = Array.from(n.children), m = c.indexOf(u);
    ct = u, ct.tabIndex = t.zoneItemTabIndex, Ue = d[m][se], it = c[m].getAttribute("aria-label") || "";
  }
  function o({
    items: u = [],
    type: d = Zs,
    dragDisabled: c = !1,
    zoneTabIndex: m = 0,
    zoneItemTabIndex: y = 0,
    dropFromOthersDisabled: C = !1,
    dropTargetStyle: T = al,
    dropTargetClasses: E = [],
    autoAriaDisabled: O = !1
  }) {
    t.items = [...u], t.dragDisabled = c, t.dropFromOthersDisabled = C, t.zoneTabIndex = m, t.zoneItemTabIndex = y, t.dropTargetStyle = T, t.dropTargetClasses = E, t.autoAriaDisabled = O, t.type && d !== t.type && cl(n, t.type), t.type = d, zs(n, d), O || (n.setAttribute("aria-disabled", c), n.setAttribute("role", "list"), n.setAttribute("aria-describedby", c ? cn.DND_ZONE_DRAG_DISABLED : cn.DND_ZONE_ACTIVE)), oe.set(n, t), Oe ? n.tabIndex = n === ue || ct.contains(n) || t.dropFromOthersDisabled || ue && t.type !== oe.get(ue).type ? -1 : 0 : n.tabIndex = t.zoneTabIndex, n.addEventListener("focus", Gs);
    for (let _ = 0; _ < n.children.length; _++) {
      const p = n.children[_];
      un.add(p), p.tabIndex = Oe ? -1 : t.zoneItemTabIndex, O || p.setAttribute("role", "listitem"), p.removeEventListener("keydown", fl.get(p)), p.removeEventListener("click", ul.get(p)), c || (p.addEventListener("keydown", i), fl.set(p, i), p.addEventListener("click", r), ul.set(p, r)), Oe && t.items[_][se] === Ue && (ct = p, ct.tabIndex = t.zoneItemTabIndex, p.focus());
    }
  }
  o(e);
  const f = {
    update: (u) => {
      o(u);
    },
    destroy: () => {
      cl(n, t.type), oe.delete(n), Gn.delete(n);
    }
  };
  return Gn.set(n, f), f;
}
function _i(n, e) {
  if (Vs(n))
    return {
      update: () => {
      },
      destroy: () => {
      }
    };
  dl(e);
  const t = Ls(n, e), l = Bs(n, e);
  return {
    update: (i) => {
      dl(i), t.update(i), l.update(i);
    },
    destroy: () => {
      t.destroy(), l.destroy();
    }
  };
}
function Vs(n) {
  return !!n.closest(`[${Xi}="true"]`);
}
function dl(n) {
  const {
    items: e,
    flipDurationMs: t,
    type: l,
    dragDisabled: i,
    morphDisabled: s,
    dropFromOthersDisabled: r,
    zoneTabIndex: a,
    zoneItemTabIndex: o,
    dropTargetStyle: f,
    dropTargetClasses: u,
    transformDraggedElement: d,
    autoAriaDisabled: c,
    centreDraggedOnCursor: m,
    ...y
  } = n;
  if (Object.keys(y).length > 0 && console.warn("dndzone will ignore unknown options", y), !e)
    throw new Error("no 'items' key provided to dndzone");
  const C = e.find((T) => !{}.hasOwnProperty.call(T, se));
  if (C)
    throw new Error(`missing '${se}' property for item ${Ut(C)}`);
  if (u && !Array.isArray(u))
    throw new Error(`dropTargetClasses should be an array but instead it is a ${typeof u}, ${Ut(u)}`);
  if (a && !_l(a))
    throw new Error(`zoneTabIndex should be a number but instead it is a ${typeof a}, ${Ut(a)}`);
  if (o && !_l(o))
    throw new Error(`zoneItemTabIndex should be a number but instead it is a ${typeof o}, ${Ut(o)}`);
}
function _l(n) {
  return !isNaN(n) && function(e) {
    return (e | 0) === e;
  }(parseFloat(n));
}
function Xt() {
}
const Hs = (n) => n;
function Us(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
const mi = typeof window < "u";
let ml = mi ? () => window.performance.now() : () => Date.now(), gi = mi ? (n) => requestAnimationFrame(n) : Xt;
const Tt = /* @__PURE__ */ new Set();
function hi(n) {
  Tt.forEach((e) => {
    e.c(n) || (Tt.delete(e), e.f());
  }), Tt.size !== 0 && gi(hi);
}
function js(n) {
  let e;
  return Tt.size === 0 && gi(hi), {
    promise: new Promise((t) => {
      Tt.add(e = { c: n, f: t });
    }),
    abort() {
      Tt.delete(e);
    }
  };
}
function Ws(n, { delay: e = 0, duration: t = 400, easing: l = Hs } = {}) {
  const i = +getComputedStyle(n).opacity;
  return {
    delay: e,
    duration: t,
    easing: l,
    css: (s) => `opacity: ${s * i}`
  };
}
const wt = [];
function Ys(n, e = Xt) {
  let t;
  const l = /* @__PURE__ */ new Set();
  function i(a) {
    if (Us(n, a) && (n = a, t)) {
      const o = !wt.length;
      for (const f of l)
        f[1](), wt.push(f, n);
      if (o) {
        for (let f = 0; f < wt.length; f += 2)
          wt[f][0](wt[f + 1]);
        wt.length = 0;
      }
    }
  }
  function s(a) {
    i(a(n));
  }
  function r(a, o = Xt) {
    const f = [a, o];
    return l.add(f), l.size === 1 && (t = e(i, s) || Xt), a(n), () => {
      l.delete(f), l.size === 0 && t && (t(), t = null);
    };
  }
  return { set: i, update: s, subscribe: r };
}
function gl(n) {
  return Object.prototype.toString.call(n) === "[object Date]";
}
function Bn(n, e, t, l) {
  if (typeof t == "number" || gl(t)) {
    const i = l - t, s = (t - e) / (n.dt || 1 / 60), r = n.opts.stiffness * i, a = n.opts.damping * s, o = (r - a) * n.inv_mass, f = (s + o) * n.dt;
    return Math.abs(f) < n.opts.precision && Math.abs(i) < n.opts.precision ? l : (n.settled = !1, gl(t) ? new Date(t.getTime() + f) : t + f);
  } else {
    if (Array.isArray(t))
      return t.map(
        (i, s) => Bn(n, e[s], t[s], l[s])
      );
    if (typeof t == "object") {
      const i = {};
      for (const s in t)
        i[s] = Bn(n, e[s], t[s], l[s]);
      return i;
    } else
      throw new Error(`Cannot spring ${typeof t} values`);
  }
}
function hl(n, e = {}) {
  const t = Ys(n), { stiffness: l = 0.15, damping: i = 0.8, precision: s = 0.01 } = e;
  let r, a, o, f = n, u = n, d = 1, c = 0, m = !1;
  function y(T, E = {}) {
    u = T;
    const O = o = {};
    return n == null || E.hard || C.stiffness >= 1 && C.damping >= 1 ? (m = !0, r = ml(), f = T, t.set(n = u), Promise.resolve()) : (E.soft && (c = 1 / ((E.soft === !0 ? 0.5 : +E.soft) * 60), d = 0), a || (r = ml(), m = !1, a = js((_) => {
      if (m)
        return m = !1, a = null, !1;
      d = Math.min(d + c, 1);
      const p = {
        inv_mass: d,
        opts: C,
        settled: !0,
        dt: (_ - r) * 60 / 1e3
      }, Z = Bn(p, f, n, u);
      return r = _, f = n, t.set(n = Z), p.settled && (a = null), !p.settled;
    })), new Promise((_) => {
      a.promise.then(() => {
        O === o && _();
      });
    }));
  }
  const C = {
    set: y,
    update: (T, E) => y(T(u, n), E),
    subscribe: t.subscribe,
    stiffness: l,
    damping: i,
    precision: s
  };
  return C;
}
const {
  SvelteComponent: Ks,
  append: Xs,
  attr: et,
  detach: Js,
  init: Qs,
  insert: xs,
  noop: In,
  safe_not_equal: $s,
  svg_element: bl
} = window.__gradio__svelte__internal;
function eo(n) {
  let e, t;
  return {
    c() {
      e = bl("svg"), t = bl("polyline"), et(t, "points", "20 6 9 17 4 12"), et(e, "xmlns", "http://www.w3.org/2000/svg"), et(e, "viewBox", "2 0 20 20"), et(e, "fill", "none"), et(e, "stroke", "currentColor"), et(e, "stroke-width", "3"), et(e, "stroke-linecap", "round"), et(e, "stroke-linejoin", "round");
    },
    m(l, i) {
      xs(l, e, i), Xs(e, t);
    },
    p: In,
    i: In,
    o: In,
    d(l) {
      l && Js(e);
    }
  };
}
class bi extends Ks {
  constructor(e) {
    super(), Qs(this, e, null, eo, $s, {});
  }
}
const {
  SvelteComponent: to,
  append: pl,
  attr: ut,
  detach: no,
  init: lo,
  insert: io,
  noop: Sn,
  safe_not_equal: so,
  svg_element: Rn
} = window.__gradio__svelte__internal;
function oo(n) {
  let e, t, l;
  return {
    c() {
      e = Rn("svg"), t = Rn("path"), l = Rn("path"), ut(t, "fill", "currentColor"), ut(t, "d", "M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"), ut(l, "fill", "currentColor"), ut(l, "d", "M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"), ut(e, "xmlns", "http://www.w3.org/2000/svg"), ut(e, "viewBox", "0 0 33 33"), ut(e, "color", "currentColor");
    },
    m(i, s) {
      io(i, e, s), pl(e, t), pl(e, l);
    },
    p: Sn,
    i: Sn,
    o: Sn,
    d(i) {
      i && no(e);
    }
  };
}
class pi extends to {
  constructor(e) {
    super(), lo(this, e, null, oo, so, {});
  }
}
const {
  SvelteComponent: ro,
  append: tt,
  attr: J,
  detach: ao,
  init: fo,
  insert: uo,
  noop: Nn,
  safe_not_equal: co,
  svg_element: nt,
  text: _o
} = window.__gradio__svelte__internal;
function mo(n) {
  let e, t, l, i, s, r, a, o, f;
  return {
    c() {
      e = nt("svg"), t = nt("defs"), l = nt("style"), i = _o(`.cls-1 {
				fill: none;
			}
		`), s = nt("rect"), r = nt("rect"), a = nt("path"), o = nt("rect"), f = nt("rect"), J(s, "x", "12"), J(s, "y", "12"), J(s, "width", "2"), J(s, "height", "12"), J(r, "x", "18"), J(r, "y", "12"), J(r, "width", "2"), J(r, "height", "12"), J(a, "d", "M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"), J(o, "x", "12"), J(o, "y", "2"), J(o, "width", "8"), J(o, "height", "2"), J(f, "id", "_Transparent_Rectangle_"), J(f, "data-name", "<Transparent Rectangle>"), J(f, "class", "cls-1"), J(f, "width", "32"), J(f, "height", "32"), J(e, "id", "icon"), J(e, "xmlns", "http://www.w3.org/2000/svg"), J(e, "viewBox", "0 0 32 32");
    },
    m(u, d) {
      uo(u, e, d), tt(e, t), tt(t, l), tt(l, i), tt(e, s), tt(e, r), tt(e, a), tt(e, o), tt(e, f);
    },
    p: Nn,
    i: Nn,
    o: Nn,
    d(u) {
      u && ao(e);
    }
  };
}
class wi extends ro {
  constructor(e) {
    super(), fo(this, e, null, mo, co, {});
  }
}
const {
  SvelteComponent: go,
  assign: ho,
  create_slot: bo,
  detach: po,
  element: wo,
  get_all_dirty_from_scope: vo,
  get_slot_changes: yo,
  get_spread_update: Eo,
  init: Do,
  insert: ko,
  safe_not_equal: To,
  set_dynamic_element_data: wl,
  set_style: Te,
  toggle_class: Be,
  transition_in: vi,
  transition_out: yi,
  update_slot_base: Co
} = window.__gradio__svelte__internal;
function Oo(n) {
  let e, t, l;
  const i = (
    /*#slots*/
    n[18].default
  ), s = bo(
    i,
    n,
    /*$$scope*/
    n[17],
    null
  );
  let r = [
    { "data-testid": (
      /*test_id*/
      n[7]
    ) },
    { id: (
      /*elem_id*/
      n[2]
    ) },
    {
      class: t = "block " + /*elem_classes*/
      n[3].join(" ") + " svelte-nl1om8"
    }
  ], a = {};
  for (let o = 0; o < r.length; o += 1)
    a = ho(a, r[o]);
  return {
    c() {
      e = wo(
        /*tag*/
        n[14]
      ), s && s.c(), wl(
        /*tag*/
        n[14]
      )(e, a), Be(
        e,
        "hidden",
        /*visible*/
        n[10] === !1
      ), Be(
        e,
        "padded",
        /*padding*/
        n[6]
      ), Be(
        e,
        "border_focus",
        /*border_mode*/
        n[5] === "focus"
      ), Be(
        e,
        "border_contrast",
        /*border_mode*/
        n[5] === "contrast"
      ), Be(e, "hide-container", !/*explicit_call*/
      n[8] && !/*container*/
      n[9]), Te(
        e,
        "height",
        /*get_dimension*/
        n[15](
          /*height*/
          n[0]
        )
      ), Te(e, "width", typeof /*width*/
      n[1] == "number" ? `calc(min(${/*width*/
      n[1]}px, 100%))` : (
        /*get_dimension*/
        n[15](
          /*width*/
          n[1]
        )
      )), Te(
        e,
        "border-style",
        /*variant*/
        n[4]
      ), Te(
        e,
        "overflow",
        /*allow_overflow*/
        n[11] ? "visible" : "hidden"
      ), Te(
        e,
        "flex-grow",
        /*scale*/
        n[12]
      ), Te(e, "min-width", `calc(min(${/*min_width*/
      n[13]}px, 100%))`), Te(e, "border-width", "var(--block-border-width)");
    },
    m(o, f) {
      ko(o, e, f), s && s.m(e, null), l = !0;
    },
    p(o, f) {
      s && s.p && (!l || f & /*$$scope*/
      131072) && Co(
        s,
        i,
        o,
        /*$$scope*/
        o[17],
        l ? yo(
          i,
          /*$$scope*/
          o[17],
          f,
          null
        ) : vo(
          /*$$scope*/
          o[17]
        ),
        null
      ), wl(
        /*tag*/
        o[14]
      )(e, a = Eo(r, [
        (!l || f & /*test_id*/
        128) && { "data-testid": (
          /*test_id*/
          o[7]
        ) },
        (!l || f & /*elem_id*/
        4) && { id: (
          /*elem_id*/
          o[2]
        ) },
        (!l || f & /*elem_classes*/
        8 && t !== (t = "block " + /*elem_classes*/
        o[3].join(" ") + " svelte-nl1om8")) && { class: t }
      ])), Be(
        e,
        "hidden",
        /*visible*/
        o[10] === !1
      ), Be(
        e,
        "padded",
        /*padding*/
        o[6]
      ), Be(
        e,
        "border_focus",
        /*border_mode*/
        o[5] === "focus"
      ), Be(
        e,
        "border_contrast",
        /*border_mode*/
        o[5] === "contrast"
      ), Be(e, "hide-container", !/*explicit_call*/
      o[8] && !/*container*/
      o[9]), f & /*height*/
      1 && Te(
        e,
        "height",
        /*get_dimension*/
        o[15](
          /*height*/
          o[0]
        )
      ), f & /*width*/
      2 && Te(e, "width", typeof /*width*/
      o[1] == "number" ? `calc(min(${/*width*/
      o[1]}px, 100%))` : (
        /*get_dimension*/
        o[15](
          /*width*/
          o[1]
        )
      )), f & /*variant*/
      16 && Te(
        e,
        "border-style",
        /*variant*/
        o[4]
      ), f & /*allow_overflow*/
      2048 && Te(
        e,
        "overflow",
        /*allow_overflow*/
        o[11] ? "visible" : "hidden"
      ), f & /*scale*/
      4096 && Te(
        e,
        "flex-grow",
        /*scale*/
        o[12]
      ), f & /*min_width*/
      8192 && Te(e, "min-width", `calc(min(${/*min_width*/
      o[13]}px, 100%))`);
    },
    i(o) {
      l || (vi(s, o), l = !0);
    },
    o(o) {
      yi(s, o), l = !1;
    },
    d(o) {
      o && po(e), s && s.d(o);
    }
  };
}
function Ao(n) {
  let e, t = (
    /*tag*/
    n[14] && Oo(n)
  );
  return {
    c() {
      t && t.c();
    },
    m(l, i) {
      t && t.m(l, i), e = !0;
    },
    p(l, [i]) {
      /*tag*/
      l[14] && t.p(l, i);
    },
    i(l) {
      e || (vi(t, l), e = !0);
    },
    o(l) {
      yi(t, l), e = !1;
    },
    d(l) {
      t && t.d(l);
    }
  };
}
function Io(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { height: s = void 0 } = e, { width: r = void 0 } = e, { elem_id: a = "" } = e, { elem_classes: o = [] } = e, { variant: f = "solid" } = e, { border_mode: u = "base" } = e, { padding: d = !0 } = e, { type: c = "normal" } = e, { test_id: m = void 0 } = e, { explicit_call: y = !1 } = e, { container: C = !0 } = e, { visible: T = !0 } = e, { allow_overflow: E = !0 } = e, { scale: O = null } = e, { min_width: _ = 0 } = e, p = c === "fieldset" ? "fieldset" : "div";
  const Z = (k) => {
    if (k !== void 0) {
      if (typeof k == "number")
        return k + "px";
      if (typeof k == "string")
        return k;
    }
  };
  return n.$$set = (k) => {
    "height" in k && t(0, s = k.height), "width" in k && t(1, r = k.width), "elem_id" in k && t(2, a = k.elem_id), "elem_classes" in k && t(3, o = k.elem_classes), "variant" in k && t(4, f = k.variant), "border_mode" in k && t(5, u = k.border_mode), "padding" in k && t(6, d = k.padding), "type" in k && t(16, c = k.type), "test_id" in k && t(7, m = k.test_id), "explicit_call" in k && t(8, y = k.explicit_call), "container" in k && t(9, C = k.container), "visible" in k && t(10, T = k.visible), "allow_overflow" in k && t(11, E = k.allow_overflow), "scale" in k && t(12, O = k.scale), "min_width" in k && t(13, _ = k.min_width), "$$scope" in k && t(17, i = k.$$scope);
  }, [
    s,
    r,
    a,
    o,
    f,
    u,
    d,
    m,
    y,
    C,
    T,
    E,
    O,
    _,
    p,
    Z,
    c,
    i,
    l
  ];
}
class So extends go {
  constructor(e) {
    super(), Do(this, e, Io, Ao, To, {
      height: 0,
      width: 1,
      elem_id: 2,
      elem_classes: 3,
      variant: 4,
      border_mode: 5,
      padding: 6,
      type: 16,
      test_id: 7,
      explicit_call: 8,
      container: 9,
      visible: 10,
      allow_overflow: 11,
      scale: 12,
      min_width: 13
    });
  }
}
const {
  SvelteComponent: Ro,
  attr: No,
  create_slot: Lo,
  detach: Mo,
  element: Po,
  get_all_dirty_from_scope: Fo,
  get_slot_changes: qo,
  init: Zo,
  insert: zo,
  safe_not_equal: Go,
  transition_in: Bo,
  transition_out: Vo,
  update_slot_base: Ho
} = window.__gradio__svelte__internal;
function Uo(n) {
  let e, t;
  const l = (
    /*#slots*/
    n[1].default
  ), i = Lo(
    l,
    n,
    /*$$scope*/
    n[0],
    null
  );
  return {
    c() {
      e = Po("div"), i && i.c(), No(e, "class", "svelte-1hnfib2");
    },
    m(s, r) {
      zo(s, e, r), i && i.m(e, null), t = !0;
    },
    p(s, [r]) {
      i && i.p && (!t || r & /*$$scope*/
      1) && Ho(
        i,
        l,
        s,
        /*$$scope*/
        s[0],
        t ? qo(
          l,
          /*$$scope*/
          s[0],
          r,
          null
        ) : Fo(
          /*$$scope*/
          s[0]
        ),
        null
      );
    },
    i(s) {
      t || (Bo(i, s), t = !0);
    },
    o(s) {
      Vo(i, s), t = !1;
    },
    d(s) {
      s && Mo(e), i && i.d(s);
    }
  };
}
function jo(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e;
  return n.$$set = (s) => {
    "$$scope" in s && t(0, i = s.$$scope);
  }, [i, l];
}
class Wo extends Ro {
  constructor(e) {
    super(), Zo(this, e, jo, Uo, Go, {});
  }
}
const {
  SvelteComponent: Yo,
  attr: vl,
  check_outros: Ko,
  create_component: Xo,
  create_slot: Jo,
  destroy_component: Qo,
  detach: Jt,
  element: xo,
  empty: $o,
  get_all_dirty_from_scope: er,
  get_slot_changes: tr,
  group_outros: nr,
  init: lr,
  insert: Qt,
  mount_component: ir,
  safe_not_equal: sr,
  set_data: or,
  space: rr,
  text: ar,
  toggle_class: vt,
  transition_in: Mt,
  transition_out: xt,
  update_slot_base: fr
} = window.__gradio__svelte__internal;
function yl(n) {
  let e, t;
  return e = new Wo({
    props: {
      $$slots: { default: [ur] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      Xo(e.$$.fragment);
    },
    m(l, i) {
      ir(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i & /*$$scope, info*/
      10 && (s.$$scope = { dirty: i, ctx: l }), e.$set(s);
    },
    i(l) {
      t || (Mt(e.$$.fragment, l), t = !0);
    },
    o(l) {
      xt(e.$$.fragment, l), t = !1;
    },
    d(l) {
      Qo(e, l);
    }
  };
}
function ur(n) {
  let e;
  return {
    c() {
      e = ar(
        /*info*/
        n[1]
      );
    },
    m(t, l) {
      Qt(t, e, l);
    },
    p(t, l) {
      l & /*info*/
      2 && or(
        e,
        /*info*/
        t[1]
      );
    },
    d(t) {
      t && Jt(e);
    }
  };
}
function cr(n) {
  let e, t, l, i;
  const s = (
    /*#slots*/
    n[2].default
  ), r = Jo(
    s,
    n,
    /*$$scope*/
    n[3],
    null
  );
  let a = (
    /*info*/
    n[1] && yl(n)
  );
  return {
    c() {
      e = xo("span"), r && r.c(), t = rr(), a && a.c(), l = $o(), vl(e, "data-testid", "block-info"), vl(e, "class", "svelte-22c38v"), vt(e, "sr-only", !/*show_label*/
      n[0]), vt(e, "hide", !/*show_label*/
      n[0]), vt(
        e,
        "has-info",
        /*info*/
        n[1] != null
      );
    },
    m(o, f) {
      Qt(o, e, f), r && r.m(e, null), Qt(o, t, f), a && a.m(o, f), Qt(o, l, f), i = !0;
    },
    p(o, [f]) {
      r && r.p && (!i || f & /*$$scope*/
      8) && fr(
        r,
        s,
        o,
        /*$$scope*/
        o[3],
        i ? tr(
          s,
          /*$$scope*/
          o[3],
          f,
          null
        ) : er(
          /*$$scope*/
          o[3]
        ),
        null
      ), (!i || f & /*show_label*/
      1) && vt(e, "sr-only", !/*show_label*/
      o[0]), (!i || f & /*show_label*/
      1) && vt(e, "hide", !/*show_label*/
      o[0]), (!i || f & /*info*/
      2) && vt(
        e,
        "has-info",
        /*info*/
        o[1] != null
      ), /*info*/
      o[1] ? a ? (a.p(o, f), f & /*info*/
      2 && Mt(a, 1)) : (a = yl(o), a.c(), Mt(a, 1), a.m(l.parentNode, l)) : a && (nr(), xt(a, 1, 1, () => {
        a = null;
      }), Ko());
    },
    i(o) {
      i || (Mt(r, o), Mt(a), i = !0);
    },
    o(o) {
      xt(r, o), xt(a), i = !1;
    },
    d(o) {
      o && (Jt(e), Jt(t), Jt(l)), r && r.d(o), a && a.d(o);
    }
  };
}
function dr(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { show_label: s = !0 } = e, { info: r = void 0 } = e;
  return n.$$set = (a) => {
    "show_label" in a && t(0, s = a.show_label), "info" in a && t(1, r = a.info), "$$scope" in a && t(3, i = a.$$scope);
  }, [s, r, l, i];
}
class Ei extends Yo {
  constructor(e) {
    super(), lr(this, e, dr, cr, sr, { show_label: 0, info: 1 });
  }
}
const _r = [
  { color: "red", primary: 600, secondary: 100 },
  { color: "green", primary: 600, secondary: 100 },
  { color: "blue", primary: 600, secondary: 100 },
  { color: "yellow", primary: 500, secondary: 100 },
  { color: "purple", primary: 600, secondary: 100 },
  { color: "teal", primary: 600, secondary: 100 },
  { color: "orange", primary: 600, secondary: 100 },
  { color: "cyan", primary: 600, secondary: 100 },
  { color: "lime", primary: 500, secondary: 100 },
  { color: "pink", primary: 600, secondary: 100 }
], El = {
  inherit: "inherit",
  current: "currentColor",
  transparent: "transparent",
  black: "#000",
  white: "#fff",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712"
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b"
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a"
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09"
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a"
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03"
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006"
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
    950: "#1a2e05"
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16"
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22"
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e"
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344"
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b"
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065"
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764"
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e"
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724"
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519"
  }
};
_r.reduce(
  (n, { color: e, primary: t, secondary: l }) => ({
    ...n,
    [e]: {
      primary: El[e][t],
      secondary: El[e][l]
    }
  }),
  {}
);
function yt(n) {
  let e = ["", "k", "M", "G", "T", "P", "E", "Z"], t = 0;
  for (; n > 1e3 && t < e.length - 1; )
    n /= 1e3, t++;
  let l = e[t];
  return (Number.isInteger(n) ? n : n.toFixed(1)) + l;
}
const {
  SvelteComponent: mr,
  append: Pe,
  attr: q,
  component_subscribe: Dl,
  detach: gr,
  element: hr,
  init: br,
  insert: pr,
  noop: kl,
  safe_not_equal: wr,
  set_style: jt,
  svg_element: Fe,
  toggle_class: Tl
} = window.__gradio__svelte__internal, { onMount: vr } = window.__gradio__svelte__internal;
function yr(n) {
  let e, t, l, i, s, r, a, o, f, u, d, c;
  return {
    c() {
      e = hr("div"), t = Fe("svg"), l = Fe("g"), i = Fe("path"), s = Fe("path"), r = Fe("path"), a = Fe("path"), o = Fe("g"), f = Fe("path"), u = Fe("path"), d = Fe("path"), c = Fe("path"), q(i, "d", "M255.926 0.754768L509.702 139.936V221.027L255.926 81.8465V0.754768Z"), q(i, "fill", "#FF7C00"), q(i, "fill-opacity", "0.4"), q(i, "class", "svelte-43sxxs"), q(s, "d", "M509.69 139.936L254.981 279.641V361.255L509.69 221.55V139.936Z"), q(s, "fill", "#FF7C00"), q(s, "class", "svelte-43sxxs"), q(r, "d", "M0.250138 139.937L254.981 279.641V361.255L0.250138 221.55V139.937Z"), q(r, "fill", "#FF7C00"), q(r, "fill-opacity", "0.4"), q(r, "class", "svelte-43sxxs"), q(a, "d", "M255.923 0.232622L0.236328 139.936V221.55L255.923 81.8469V0.232622Z"), q(a, "fill", "#FF7C00"), q(a, "class", "svelte-43sxxs"), jt(l, "transform", "translate(" + /*$top*/
      n[1][0] + "px, " + /*$top*/
      n[1][1] + "px)"), q(f, "d", "M255.926 141.5L509.702 280.681V361.773L255.926 222.592V141.5Z"), q(f, "fill", "#FF7C00"), q(f, "fill-opacity", "0.4"), q(f, "class", "svelte-43sxxs"), q(u, "d", "M509.69 280.679L254.981 420.384V501.998L509.69 362.293V280.679Z"), q(u, "fill", "#FF7C00"), q(u, "class", "svelte-43sxxs"), q(d, "d", "M0.250138 280.681L254.981 420.386V502L0.250138 362.295V280.681Z"), q(d, "fill", "#FF7C00"), q(d, "fill-opacity", "0.4"), q(d, "class", "svelte-43sxxs"), q(c, "d", "M255.923 140.977L0.236328 280.68V362.294L255.923 222.591V140.977Z"), q(c, "fill", "#FF7C00"), q(c, "class", "svelte-43sxxs"), jt(o, "transform", "translate(" + /*$bottom*/
      n[2][0] + "px, " + /*$bottom*/
      n[2][1] + "px)"), q(t, "viewBox", "-1200 -1200 3000 3000"), q(t, "fill", "none"), q(t, "xmlns", "http://www.w3.org/2000/svg"), q(t, "class", "svelte-43sxxs"), q(e, "class", "svelte-43sxxs"), Tl(
        e,
        "margin",
        /*margin*/
        n[0]
      );
    },
    m(m, y) {
      pr(m, e, y), Pe(e, t), Pe(t, l), Pe(l, i), Pe(l, s), Pe(l, r), Pe(l, a), Pe(t, o), Pe(o, f), Pe(o, u), Pe(o, d), Pe(o, c);
    },
    p(m, [y]) {
      y & /*$top*/
      2 && jt(l, "transform", "translate(" + /*$top*/
      m[1][0] + "px, " + /*$top*/
      m[1][1] + "px)"), y & /*$bottom*/
      4 && jt(o, "transform", "translate(" + /*$bottom*/
      m[2][0] + "px, " + /*$bottom*/
      m[2][1] + "px)"), y & /*margin*/
      1 && Tl(
        e,
        "margin",
        /*margin*/
        m[0]
      );
    },
    i: kl,
    o: kl,
    d(m) {
      m && gr(e);
    }
  };
}
function Er(n, e, t) {
  let l, i, { margin: s = !0 } = e;
  const r = hl([0, 0]);
  Dl(n, r, (c) => t(1, l = c));
  const a = hl([0, 0]);
  Dl(n, a, (c) => t(2, i = c));
  let o;
  async function f() {
    await Promise.all([r.set([125, 140]), a.set([-125, -140])]), await Promise.all([r.set([-125, 140]), a.set([125, -140])]), await Promise.all([r.set([-125, 0]), a.set([125, -0])]), await Promise.all([r.set([125, 0]), a.set([-125, 0])]);
  }
  async function u() {
    await f(), o || u();
  }
  async function d() {
    await Promise.all([r.set([125, 0]), a.set([-125, 0])]), u();
  }
  return vr(() => (d(), () => o = !0)), n.$$set = (c) => {
    "margin" in c && t(0, s = c.margin);
  }, [s, l, i, r, a];
}
class Dr extends mr {
  constructor(e) {
    super(), br(this, e, Er, yr, wr, { margin: 0 });
  }
}
const {
  SvelteComponent: kr,
  append: _t,
  attr: je,
  binding_callbacks: Cl,
  check_outros: Di,
  create_component: Tr,
  create_slot: Cr,
  destroy_component: Or,
  destroy_each: ki,
  detach: R,
  element: Xe,
  empty: St,
  ensure_array_like: dn,
  get_all_dirty_from_scope: Ar,
  get_slot_changes: Ir,
  group_outros: Ti,
  init: Sr,
  insert: N,
  mount_component: Rr,
  noop: Vn,
  safe_not_equal: Nr,
  set_data: Re,
  set_style: st,
  space: We,
  text: Y,
  toggle_class: Ae,
  transition_in: At,
  transition_out: It,
  update_slot_base: Lr
} = window.__gradio__svelte__internal, { tick: Mr } = window.__gradio__svelte__internal, { onDestroy: Pr } = window.__gradio__svelte__internal, Fr = (n) => ({}), Ol = (n) => ({});
function Al(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l[40] = t, l;
}
function Il(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l;
}
function qr(n) {
  let e, t = (
    /*i18n*/
    n[1]("common.error") + ""
  ), l, i, s;
  const r = (
    /*#slots*/
    n[29].error
  ), a = Cr(
    r,
    n,
    /*$$scope*/
    n[28],
    Ol
  );
  return {
    c() {
      e = Xe("span"), l = Y(t), i = We(), a && a.c(), je(e, "class", "error svelte-1yserjw");
    },
    m(o, f) {
      N(o, e, f), _t(e, l), N(o, i, f), a && a.m(o, f), s = !0;
    },
    p(o, f) {
      (!s || f[0] & /*i18n*/
      2) && t !== (t = /*i18n*/
      o[1]("common.error") + "") && Re(l, t), a && a.p && (!s || f[0] & /*$$scope*/
      268435456) && Lr(
        a,
        r,
        o,
        /*$$scope*/
        o[28],
        s ? Ir(
          r,
          /*$$scope*/
          o[28],
          f,
          Fr
        ) : Ar(
          /*$$scope*/
          o[28]
        ),
        Ol
      );
    },
    i(o) {
      s || (At(a, o), s = !0);
    },
    o(o) {
      It(a, o), s = !1;
    },
    d(o) {
      o && (R(e), R(i)), a && a.d(o);
    }
  };
}
function Zr(n) {
  let e, t, l, i, s, r, a, o, f, u = (
    /*variant*/
    n[8] === "default" && /*show_eta_bar*/
    n[18] && /*show_progress*/
    n[6] === "full" && Sl(n)
  );
  function d(_, p) {
    if (
      /*progress*/
      _[7]
    )
      return Br;
    if (
      /*queue_position*/
      _[2] !== null && /*queue_size*/
      _[3] !== void 0 && /*queue_position*/
      _[2] >= 0
    )
      return Gr;
    if (
      /*queue_position*/
      _[2] === 0
    )
      return zr;
  }
  let c = d(n), m = c && c(n), y = (
    /*timer*/
    n[5] && Ll(n)
  );
  const C = [jr, Ur], T = [];
  function E(_, p) {
    return (
      /*last_progress_level*/
      _[15] != null ? 0 : (
        /*show_progress*/
        _[6] === "full" ? 1 : -1
      )
    );
  }
  ~(s = E(n)) && (r = T[s] = C[s](n));
  let O = !/*timer*/
  n[5] && Gl(n);
  return {
    c() {
      u && u.c(), e = We(), t = Xe("div"), m && m.c(), l = We(), y && y.c(), i = We(), r && r.c(), a = We(), O && O.c(), o = St(), je(t, "class", "progress-text svelte-1yserjw"), Ae(
        t,
        "meta-text-center",
        /*variant*/
        n[8] === "center"
      ), Ae(
        t,
        "meta-text",
        /*variant*/
        n[8] === "default"
      );
    },
    m(_, p) {
      u && u.m(_, p), N(_, e, p), N(_, t, p), m && m.m(t, null), _t(t, l), y && y.m(t, null), N(_, i, p), ~s && T[s].m(_, p), N(_, a, p), O && O.m(_, p), N(_, o, p), f = !0;
    },
    p(_, p) {
      /*variant*/
      _[8] === "default" && /*show_eta_bar*/
      _[18] && /*show_progress*/
      _[6] === "full" ? u ? u.p(_, p) : (u = Sl(_), u.c(), u.m(e.parentNode, e)) : u && (u.d(1), u = null), c === (c = d(_)) && m ? m.p(_, p) : (m && m.d(1), m = c && c(_), m && (m.c(), m.m(t, l))), /*timer*/
      _[5] ? y ? y.p(_, p) : (y = Ll(_), y.c(), y.m(t, null)) : y && (y.d(1), y = null), (!f || p[0] & /*variant*/
      256) && Ae(
        t,
        "meta-text-center",
        /*variant*/
        _[8] === "center"
      ), (!f || p[0] & /*variant*/
      256) && Ae(
        t,
        "meta-text",
        /*variant*/
        _[8] === "default"
      );
      let Z = s;
      s = E(_), s === Z ? ~s && T[s].p(_, p) : (r && (Ti(), It(T[Z], 1, 1, () => {
        T[Z] = null;
      }), Di()), ~s ? (r = T[s], r ? r.p(_, p) : (r = T[s] = C[s](_), r.c()), At(r, 1), r.m(a.parentNode, a)) : r = null), /*timer*/
      _[5] ? O && (O.d(1), O = null) : O ? O.p(_, p) : (O = Gl(_), O.c(), O.m(o.parentNode, o));
    },
    i(_) {
      f || (At(r), f = !0);
    },
    o(_) {
      It(r), f = !1;
    },
    d(_) {
      _ && (R(e), R(t), R(i), R(a), R(o)), u && u.d(_), m && m.d(), y && y.d(), ~s && T[s].d(_), O && O.d(_);
    }
  };
}
function Sl(n) {
  let e, t = `translateX(${/*eta_level*/
  (n[17] || 0) * 100 - 100}%)`;
  return {
    c() {
      e = Xe("div"), je(e, "class", "eta-bar svelte-1yserjw"), st(e, "transform", t);
    },
    m(l, i) {
      N(l, e, i);
    },
    p(l, i) {
      i[0] & /*eta_level*/
      131072 && t !== (t = `translateX(${/*eta_level*/
      (l[17] || 0) * 100 - 100}%)`) && st(e, "transform", t);
    },
    d(l) {
      l && R(e);
    }
  };
}
function zr(n) {
  let e;
  return {
    c() {
      e = Y("processing |");
    },
    m(t, l) {
      N(t, e, l);
    },
    p: Vn,
    d(t) {
      t && R(e);
    }
  };
}
function Gr(n) {
  let e, t = (
    /*queue_position*/
    n[2] + 1 + ""
  ), l, i, s, r;
  return {
    c() {
      e = Y("queue: "), l = Y(t), i = Y("/"), s = Y(
        /*queue_size*/
        n[3]
      ), r = Y(" |");
    },
    m(a, o) {
      N(a, e, o), N(a, l, o), N(a, i, o), N(a, s, o), N(a, r, o);
    },
    p(a, o) {
      o[0] & /*queue_position*/
      4 && t !== (t = /*queue_position*/
      a[2] + 1 + "") && Re(l, t), o[0] & /*queue_size*/
      8 && Re(
        s,
        /*queue_size*/
        a[3]
      );
    },
    d(a) {
      a && (R(e), R(l), R(i), R(s), R(r));
    }
  };
}
function Br(n) {
  let e, t = dn(
    /*progress*/
    n[7]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = Nl(Il(n, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = St();
    },
    m(i, s) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, s);
      N(i, e, s);
    },
    p(i, s) {
      if (s[0] & /*progress*/
      128) {
        t = dn(
          /*progress*/
          i[7]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = Il(i, t, r);
          l[r] ? l[r].p(a, s) : (l[r] = Nl(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && R(e), ki(l, i);
    }
  };
}
function Rl(n) {
  let e, t = (
    /*p*/
    n[38].unit + ""
  ), l, i, s = " ", r;
  function a(u, d) {
    return (
      /*p*/
      u[38].length != null ? Hr : Vr
    );
  }
  let o = a(n), f = o(n);
  return {
    c() {
      f.c(), e = We(), l = Y(t), i = Y(" | "), r = Y(s);
    },
    m(u, d) {
      f.m(u, d), N(u, e, d), N(u, l, d), N(u, i, d), N(u, r, d);
    },
    p(u, d) {
      o === (o = a(u)) && f ? f.p(u, d) : (f.d(1), f = o(u), f && (f.c(), f.m(e.parentNode, e))), d[0] & /*progress*/
      128 && t !== (t = /*p*/
      u[38].unit + "") && Re(l, t);
    },
    d(u) {
      u && (R(e), R(l), R(i), R(r)), f.d(u);
    }
  };
}
function Vr(n) {
  let e = yt(
    /*p*/
    n[38].index || 0
  ) + "", t;
  return {
    c() {
      t = Y(e);
    },
    m(l, i) {
      N(l, t, i);
    },
    p(l, i) {
      i[0] & /*progress*/
      128 && e !== (e = yt(
        /*p*/
        l[38].index || 0
      ) + "") && Re(t, e);
    },
    d(l) {
      l && R(t);
    }
  };
}
function Hr(n) {
  let e = yt(
    /*p*/
    n[38].index || 0
  ) + "", t, l, i = yt(
    /*p*/
    n[38].length
  ) + "", s;
  return {
    c() {
      t = Y(e), l = Y("/"), s = Y(i);
    },
    m(r, a) {
      N(r, t, a), N(r, l, a), N(r, s, a);
    },
    p(r, a) {
      a[0] & /*progress*/
      128 && e !== (e = yt(
        /*p*/
        r[38].index || 0
      ) + "") && Re(t, e), a[0] & /*progress*/
      128 && i !== (i = yt(
        /*p*/
        r[38].length
      ) + "") && Re(s, i);
    },
    d(r) {
      r && (R(t), R(l), R(s));
    }
  };
}
function Nl(n) {
  let e, t = (
    /*p*/
    n[38].index != null && Rl(n)
  );
  return {
    c() {
      t && t.c(), e = St();
    },
    m(l, i) {
      t && t.m(l, i), N(l, e, i);
    },
    p(l, i) {
      /*p*/
      l[38].index != null ? t ? t.p(l, i) : (t = Rl(l), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(l) {
      l && R(e), t && t.d(l);
    }
  };
}
function Ll(n) {
  let e, t = (
    /*eta*/
    n[0] ? `/${/*formatted_eta*/
    n[19]}` : ""
  ), l, i;
  return {
    c() {
      e = Y(
        /*formatted_timer*/
        n[20]
      ), l = Y(t), i = Y("s");
    },
    m(s, r) {
      N(s, e, r), N(s, l, r), N(s, i, r);
    },
    p(s, r) {
      r[0] & /*formatted_timer*/
      1048576 && Re(
        e,
        /*formatted_timer*/
        s[20]
      ), r[0] & /*eta, formatted_eta*/
      524289 && t !== (t = /*eta*/
      s[0] ? `/${/*formatted_eta*/
      s[19]}` : "") && Re(l, t);
    },
    d(s) {
      s && (R(e), R(l), R(i));
    }
  };
}
function Ur(n) {
  let e, t;
  return e = new Dr({
    props: { margin: (
      /*variant*/
      n[8] === "default"
    ) }
  }), {
    c() {
      Tr(e.$$.fragment);
    },
    m(l, i) {
      Rr(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i[0] & /*variant*/
      256 && (s.margin = /*variant*/
      l[8] === "default"), e.$set(s);
    },
    i(l) {
      t || (At(e.$$.fragment, l), t = !0);
    },
    o(l) {
      It(e.$$.fragment, l), t = !1;
    },
    d(l) {
      Or(e, l);
    }
  };
}
function jr(n) {
  let e, t, l, i, s, r = `${/*last_progress_level*/
  n[15] * 100}%`, a = (
    /*progress*/
    n[7] != null && Ml(n)
  );
  return {
    c() {
      e = Xe("div"), t = Xe("div"), a && a.c(), l = We(), i = Xe("div"), s = Xe("div"), je(t, "class", "progress-level-inner svelte-1yserjw"), je(s, "class", "progress-bar svelte-1yserjw"), st(s, "width", r), je(i, "class", "progress-bar-wrap svelte-1yserjw"), je(e, "class", "progress-level svelte-1yserjw");
    },
    m(o, f) {
      N(o, e, f), _t(e, t), a && a.m(t, null), _t(e, l), _t(e, i), _t(i, s), n[30](s);
    },
    p(o, f) {
      /*progress*/
      o[7] != null ? a ? a.p(o, f) : (a = Ml(o), a.c(), a.m(t, null)) : a && (a.d(1), a = null), f[0] & /*last_progress_level*/
      32768 && r !== (r = `${/*last_progress_level*/
      o[15] * 100}%`) && st(s, "width", r);
    },
    i: Vn,
    o: Vn,
    d(o) {
      o && R(e), a && a.d(), n[30](null);
    }
  };
}
function Ml(n) {
  let e, t = dn(
    /*progress*/
    n[7]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = zl(Al(n, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = St();
    },
    m(i, s) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, s);
      N(i, e, s);
    },
    p(i, s) {
      if (s[0] & /*progress_level, progress*/
      16512) {
        t = dn(
          /*progress*/
          i[7]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = Al(i, t, r);
          l[r] ? l[r].p(a, s) : (l[r] = zl(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && R(e), ki(l, i);
    }
  };
}
function Pl(n) {
  let e, t, l, i, s = (
    /*i*/
    n[40] !== 0 && Wr()
  ), r = (
    /*p*/
    n[38].desc != null && Fl(n)
  ), a = (
    /*p*/
    n[38].desc != null && /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null && ql()
  ), o = (
    /*progress_level*/
    n[14] != null && Zl(n)
  );
  return {
    c() {
      s && s.c(), e = We(), r && r.c(), t = We(), a && a.c(), l = We(), o && o.c(), i = St();
    },
    m(f, u) {
      s && s.m(f, u), N(f, e, u), r && r.m(f, u), N(f, t, u), a && a.m(f, u), N(f, l, u), o && o.m(f, u), N(f, i, u);
    },
    p(f, u) {
      /*p*/
      f[38].desc != null ? r ? r.p(f, u) : (r = Fl(f), r.c(), r.m(t.parentNode, t)) : r && (r.d(1), r = null), /*p*/
      f[38].desc != null && /*progress_level*/
      f[14] && /*progress_level*/
      f[14][
        /*i*/
        f[40]
      ] != null ? a || (a = ql(), a.c(), a.m(l.parentNode, l)) : a && (a.d(1), a = null), /*progress_level*/
      f[14] != null ? o ? o.p(f, u) : (o = Zl(f), o.c(), o.m(i.parentNode, i)) : o && (o.d(1), o = null);
    },
    d(f) {
      f && (R(e), R(t), R(l), R(i)), s && s.d(f), r && r.d(f), a && a.d(f), o && o.d(f);
    }
  };
}
function Wr(n) {
  let e;
  return {
    c() {
      e = Y(" /");
    },
    m(t, l) {
      N(t, e, l);
    },
    d(t) {
      t && R(e);
    }
  };
}
function Fl(n) {
  let e = (
    /*p*/
    n[38].desc + ""
  ), t;
  return {
    c() {
      t = Y(e);
    },
    m(l, i) {
      N(l, t, i);
    },
    p(l, i) {
      i[0] & /*progress*/
      128 && e !== (e = /*p*/
      l[38].desc + "") && Re(t, e);
    },
    d(l) {
      l && R(t);
    }
  };
}
function ql(n) {
  let e;
  return {
    c() {
      e = Y("-");
    },
    m(t, l) {
      N(t, e, l);
    },
    d(t) {
      t && R(e);
    }
  };
}
function Zl(n) {
  let e = (100 * /*progress_level*/
  (n[14][
    /*i*/
    n[40]
  ] || 0)).toFixed(1) + "", t, l;
  return {
    c() {
      t = Y(e), l = Y("%");
    },
    m(i, s) {
      N(i, t, s), N(i, l, s);
    },
    p(i, s) {
      s[0] & /*progress_level*/
      16384 && e !== (e = (100 * /*progress_level*/
      (i[14][
        /*i*/
        i[40]
      ] || 0)).toFixed(1) + "") && Re(t, e);
    },
    d(i) {
      i && (R(t), R(l));
    }
  };
}
function zl(n) {
  let e, t = (
    /*p*/
    (n[38].desc != null || /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null) && Pl(n)
  );
  return {
    c() {
      t && t.c(), e = St();
    },
    m(l, i) {
      t && t.m(l, i), N(l, e, i);
    },
    p(l, i) {
      /*p*/
      l[38].desc != null || /*progress_level*/
      l[14] && /*progress_level*/
      l[14][
        /*i*/
        l[40]
      ] != null ? t ? t.p(l, i) : (t = Pl(l), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(l) {
      l && R(e), t && t.d(l);
    }
  };
}
function Gl(n) {
  let e, t;
  return {
    c() {
      e = Xe("p"), t = Y(
        /*loading_text*/
        n[9]
      ), je(e, "class", "loading svelte-1yserjw");
    },
    m(l, i) {
      N(l, e, i), _t(e, t);
    },
    p(l, i) {
      i[0] & /*loading_text*/
      512 && Re(
        t,
        /*loading_text*/
        l[9]
      );
    },
    d(l) {
      l && R(e);
    }
  };
}
function Yr(n) {
  let e, t, l, i, s;
  const r = [Zr, qr], a = [];
  function o(f, u) {
    return (
      /*status*/
      f[4] === "pending" ? 0 : (
        /*status*/
        f[4] === "error" ? 1 : -1
      )
    );
  }
  return ~(t = o(n)) && (l = a[t] = r[t](n)), {
    c() {
      e = Xe("div"), l && l.c(), je(e, "class", i = "wrap " + /*variant*/
      n[8] + " " + /*show_progress*/
      n[6] + " svelte-1yserjw"), Ae(e, "hide", !/*status*/
      n[4] || /*status*/
      n[4] === "complete" || /*show_progress*/
      n[6] === "hidden"), Ae(
        e,
        "translucent",
        /*variant*/
        n[8] === "center" && /*status*/
        (n[4] === "pending" || /*status*/
        n[4] === "error") || /*translucent*/
        n[11] || /*show_progress*/
        n[6] === "minimal"
      ), Ae(
        e,
        "generating",
        /*status*/
        n[4] === "generating"
      ), Ae(
        e,
        "border",
        /*border*/
        n[12]
      ), st(
        e,
        "position",
        /*absolute*/
        n[10] ? "absolute" : "static"
      ), st(
        e,
        "padding",
        /*absolute*/
        n[10] ? "0" : "var(--size-8) 0"
      );
    },
    m(f, u) {
      N(f, e, u), ~t && a[t].m(e, null), n[31](e), s = !0;
    },
    p(f, u) {
      let d = t;
      t = o(f), t === d ? ~t && a[t].p(f, u) : (l && (Ti(), It(a[d], 1, 1, () => {
        a[d] = null;
      }), Di()), ~t ? (l = a[t], l ? l.p(f, u) : (l = a[t] = r[t](f), l.c()), At(l, 1), l.m(e, null)) : l = null), (!s || u[0] & /*variant, show_progress*/
      320 && i !== (i = "wrap " + /*variant*/
      f[8] + " " + /*show_progress*/
      f[6] + " svelte-1yserjw")) && je(e, "class", i), (!s || u[0] & /*variant, show_progress, status, show_progress*/
      336) && Ae(e, "hide", !/*status*/
      f[4] || /*status*/
      f[4] === "complete" || /*show_progress*/
      f[6] === "hidden"), (!s || u[0] & /*variant, show_progress, variant, status, translucent, show_progress*/
      2384) && Ae(
        e,
        "translucent",
        /*variant*/
        f[8] === "center" && /*status*/
        (f[4] === "pending" || /*status*/
        f[4] === "error") || /*translucent*/
        f[11] || /*show_progress*/
        f[6] === "minimal"
      ), (!s || u[0] & /*variant, show_progress, status*/
      336) && Ae(
        e,
        "generating",
        /*status*/
        f[4] === "generating"
      ), (!s || u[0] & /*variant, show_progress, border*/
      4416) && Ae(
        e,
        "border",
        /*border*/
        f[12]
      ), u[0] & /*absolute*/
      1024 && st(
        e,
        "position",
        /*absolute*/
        f[10] ? "absolute" : "static"
      ), u[0] & /*absolute*/
      1024 && st(
        e,
        "padding",
        /*absolute*/
        f[10] ? "0" : "var(--size-8) 0"
      );
    },
    i(f) {
      s || (At(l), s = !0);
    },
    o(f) {
      It(l), s = !1;
    },
    d(f) {
      f && R(e), ~t && a[t].d(), n[31](null);
    }
  };
}
let Wt = [], Ln = !1;
async function Kr(n, e = !0) {
  if (!(window.__gradio_mode__ === "website" || window.__gradio_mode__ !== "app" && e !== !0)) {
    if (Wt.push(n), !Ln)
      Ln = !0;
    else
      return;
    await Mr(), requestAnimationFrame(() => {
      let t = [0, 0];
      for (let l = 0; l < Wt.length; l++) {
        const s = Wt[l].getBoundingClientRect();
        (l === 0 || s.top + window.scrollY <= t[0]) && (t[0] = s.top + window.scrollY, t[1] = l);
      }
      window.scrollTo({ top: t[0] - 20, behavior: "smooth" }), Ln = !1, Wt = [];
    });
  }
}
function Xr(n, e, t) {
  let l, { $$slots: i = {}, $$scope: s } = e, { i18n: r } = e, { eta: a = null } = e, { queue_position: o } = e, { queue_size: f } = e, { status: u } = e, { scroll_to_output: d = !1 } = e, { timer: c = !0 } = e, { show_progress: m = "full" } = e, { message: y = null } = e, { progress: C = null } = e, { variant: T = "default" } = e, { loading_text: E = "Loading..." } = e, { absolute: O = !0 } = e, { translucent: _ = !1 } = e, { border: p = !1 } = e, { autoscroll: Z } = e, k, z = !1, S = 0, h = 0, D = null, G = null, me = 0, P = null, B, le = null, x = !0;
  const X = () => {
    t(0, a = t(26, D = t(19, $ = null))), t(24, S = performance.now()), t(25, h = 0), z = !0, pe();
  };
  function pe() {
    requestAnimationFrame(() => {
      t(25, h = (performance.now() - S) / 1e3), z && pe();
    });
  }
  function Ee() {
    t(25, h = 0), t(0, a = t(26, D = t(19, $ = null))), z && (z = !1);
  }
  Pr(() => {
    z && Ee();
  });
  let $ = null;
  function b(w) {
    Cl[w ? "unshift" : "push"](() => {
      le = w, t(16, le), t(7, C), t(14, P), t(15, B);
    });
  }
  function M(w) {
    Cl[w ? "unshift" : "push"](() => {
      k = w, t(13, k);
    });
  }
  return n.$$set = (w) => {
    "i18n" in w && t(1, r = w.i18n), "eta" in w && t(0, a = w.eta), "queue_position" in w && t(2, o = w.queue_position), "queue_size" in w && t(3, f = w.queue_size), "status" in w && t(4, u = w.status), "scroll_to_output" in w && t(21, d = w.scroll_to_output), "timer" in w && t(5, c = w.timer), "show_progress" in w && t(6, m = w.show_progress), "message" in w && t(22, y = w.message), "progress" in w && t(7, C = w.progress), "variant" in w && t(8, T = w.variant), "loading_text" in w && t(9, E = w.loading_text), "absolute" in w && t(10, O = w.absolute), "translucent" in w && t(11, _ = w.translucent), "border" in w && t(12, p = w.border), "autoscroll" in w && t(23, Z = w.autoscroll), "$$scope" in w && t(28, s = w.$$scope);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*eta, old_eta, timer_start, eta_from_start*/
    218103809 && (a === null && t(0, a = D), a != null && D !== a && (t(27, G = (performance.now() - S) / 1e3 + a), t(19, $ = G.toFixed(1)), t(26, D = a))), n.$$.dirty[0] & /*eta_from_start, timer_diff*/
    167772160 && t(17, me = G === null || G <= 0 || !h ? null : Math.min(h / G, 1)), n.$$.dirty[0] & /*progress*/
    128 && C != null && t(18, x = !1), n.$$.dirty[0] & /*progress, progress_level, progress_bar, last_progress_level*/
    114816 && (C != null ? t(14, P = C.map((w) => {
      if (w.index != null && w.length != null)
        return w.index / w.length;
      if (w.progress != null)
        return w.progress;
    })) : t(14, P = null), P ? (t(15, B = P[P.length - 1]), le && (B === 0 ? t(16, le.style.transition = "0", le) : t(16, le.style.transition = "150ms", le))) : t(15, B = void 0)), n.$$.dirty[0] & /*status*/
    16 && (u === "pending" ? X() : Ee()), n.$$.dirty[0] & /*el, scroll_to_output, status, autoscroll*/
    10493968 && k && d && (u === "pending" || u === "complete") && Kr(k, Z), n.$$.dirty[0] & /*status, message*/
    4194320, n.$$.dirty[0] & /*timer_diff*/
    33554432 && t(20, l = h.toFixed(1));
  }, [
    a,
    r,
    o,
    f,
    u,
    c,
    m,
    C,
    T,
    E,
    O,
    _,
    p,
    k,
    P,
    B,
    le,
    me,
    x,
    $,
    l,
    d,
    y,
    Z,
    S,
    h,
    D,
    G,
    s,
    i,
    b,
    M
  ];
}
class Jr extends kr {
  constructor(e) {
    super(), Sr(
      this,
      e,
      Xr,
      Yr,
      Nr,
      {
        i18n: 1,
        eta: 0,
        queue_position: 2,
        queue_size: 3,
        status: 4,
        scroll_to_output: 21,
        timer: 5,
        show_progress: 6,
        message: 22,
        progress: 7,
        variant: 8,
        loading_text: 9,
        absolute: 10,
        translucent: 11,
        border: 12,
        autoscroll: 23
      },
      null,
      [-1, -1]
    );
  }
}
new Intl.Collator(0, { numeric: 1 }).compare;
const {
  SvelteComponent: Qr,
  append: Ci,
  attr: j,
  bubble: xr,
  check_outros: $r,
  create_slot: Oi,
  detach: Gt,
  element: On,
  empty: ea,
  get_all_dirty_from_scope: Ai,
  get_slot_changes: Ii,
  group_outros: ta,
  init: na,
  insert: Bt,
  listen: la,
  safe_not_equal: ia,
  set_style: ve,
  space: Si,
  src_url_equal: _n,
  toggle_class: Et,
  transition_in: mn,
  transition_out: gn,
  update_slot_base: Ri
} = window.__gradio__svelte__internal;
function sa(n) {
  let e, t, l, i, s, r, a = (
    /*icon*/
    n[7] && Bl(n)
  );
  const o = (
    /*#slots*/
    n[12].default
  ), f = Oi(
    o,
    n,
    /*$$scope*/
    n[11],
    null
  );
  return {
    c() {
      e = On("button"), a && a.c(), t = Si(), f && f.c(), j(e, "class", l = /*size*/
      n[4] + " " + /*variant*/
      n[3] + " " + /*elem_classes*/
      n[1].join(" ") + " svelte-8huxfn"), j(
        e,
        "id",
        /*elem_id*/
        n[0]
      ), e.disabled = /*disabled*/
      n[8], Et(e, "hidden", !/*visible*/
      n[2]), ve(
        e,
        "flex-grow",
        /*scale*/
        n[9]
      ), ve(
        e,
        "width",
        /*scale*/
        n[9] === 0 ? "fit-content" : null
      ), ve(e, "min-width", typeof /*min_width*/
      n[10] == "number" ? `calc(min(${/*min_width*/
      n[10]}px, 100%))` : null);
    },
    m(u, d) {
      Bt(u, e, d), a && a.m(e, null), Ci(e, t), f && f.m(e, null), i = !0, s || (r = la(
        e,
        "click",
        /*click_handler*/
        n[13]
      ), s = !0);
    },
    p(u, d) {
      /*icon*/
      u[7] ? a ? a.p(u, d) : (a = Bl(u), a.c(), a.m(e, t)) : a && (a.d(1), a = null), f && f.p && (!i || d & /*$$scope*/
      2048) && Ri(
        f,
        o,
        u,
        /*$$scope*/
        u[11],
        i ? Ii(
          o,
          /*$$scope*/
          u[11],
          d,
          null
        ) : Ai(
          /*$$scope*/
          u[11]
        ),
        null
      ), (!i || d & /*size, variant, elem_classes*/
      26 && l !== (l = /*size*/
      u[4] + " " + /*variant*/
      u[3] + " " + /*elem_classes*/
      u[1].join(" ") + " svelte-8huxfn")) && j(e, "class", l), (!i || d & /*elem_id*/
      1) && j(
        e,
        "id",
        /*elem_id*/
        u[0]
      ), (!i || d & /*disabled*/
      256) && (e.disabled = /*disabled*/
      u[8]), (!i || d & /*size, variant, elem_classes, visible*/
      30) && Et(e, "hidden", !/*visible*/
      u[2]), d & /*scale*/
      512 && ve(
        e,
        "flex-grow",
        /*scale*/
        u[9]
      ), d & /*scale*/
      512 && ve(
        e,
        "width",
        /*scale*/
        u[9] === 0 ? "fit-content" : null
      ), d & /*min_width*/
      1024 && ve(e, "min-width", typeof /*min_width*/
      u[10] == "number" ? `calc(min(${/*min_width*/
      u[10]}px, 100%))` : null);
    },
    i(u) {
      i || (mn(f, u), i = !0);
    },
    o(u) {
      gn(f, u), i = !1;
    },
    d(u) {
      u && Gt(e), a && a.d(), f && f.d(u), s = !1, r();
    }
  };
}
function oa(n) {
  let e, t, l, i, s = (
    /*icon*/
    n[7] && Vl(n)
  );
  const r = (
    /*#slots*/
    n[12].default
  ), a = Oi(
    r,
    n,
    /*$$scope*/
    n[11],
    null
  );
  return {
    c() {
      e = On("a"), s && s.c(), t = Si(), a && a.c(), j(
        e,
        "href",
        /*link*/
        n[6]
      ), j(e, "rel", "noopener noreferrer"), j(
        e,
        "aria-disabled",
        /*disabled*/
        n[8]
      ), j(e, "class", l = /*size*/
      n[4] + " " + /*variant*/
      n[3] + " " + /*elem_classes*/
      n[1].join(" ") + " svelte-8huxfn"), j(
        e,
        "id",
        /*elem_id*/
        n[0]
      ), Et(e, "hidden", !/*visible*/
      n[2]), Et(
        e,
        "disabled",
        /*disabled*/
        n[8]
      ), ve(
        e,
        "flex-grow",
        /*scale*/
        n[9]
      ), ve(
        e,
        "pointer-events",
        /*disabled*/
        n[8] ? "none" : null
      ), ve(
        e,
        "width",
        /*scale*/
        n[9] === 0 ? "fit-content" : null
      ), ve(e, "min-width", typeof /*min_width*/
      n[10] == "number" ? `calc(min(${/*min_width*/
      n[10]}px, 100%))` : null);
    },
    m(o, f) {
      Bt(o, e, f), s && s.m(e, null), Ci(e, t), a && a.m(e, null), i = !0;
    },
    p(o, f) {
      /*icon*/
      o[7] ? s ? s.p(o, f) : (s = Vl(o), s.c(), s.m(e, t)) : s && (s.d(1), s = null), a && a.p && (!i || f & /*$$scope*/
      2048) && Ri(
        a,
        r,
        o,
        /*$$scope*/
        o[11],
        i ? Ii(
          r,
          /*$$scope*/
          o[11],
          f,
          null
        ) : Ai(
          /*$$scope*/
          o[11]
        ),
        null
      ), (!i || f & /*link*/
      64) && j(
        e,
        "href",
        /*link*/
        o[6]
      ), (!i || f & /*disabled*/
      256) && j(
        e,
        "aria-disabled",
        /*disabled*/
        o[8]
      ), (!i || f & /*size, variant, elem_classes*/
      26 && l !== (l = /*size*/
      o[4] + " " + /*variant*/
      o[3] + " " + /*elem_classes*/
      o[1].join(" ") + " svelte-8huxfn")) && j(e, "class", l), (!i || f & /*elem_id*/
      1) && j(
        e,
        "id",
        /*elem_id*/
        o[0]
      ), (!i || f & /*size, variant, elem_classes, visible*/
      30) && Et(e, "hidden", !/*visible*/
      o[2]), (!i || f & /*size, variant, elem_classes, disabled*/
      282) && Et(
        e,
        "disabled",
        /*disabled*/
        o[8]
      ), f & /*scale*/
      512 && ve(
        e,
        "flex-grow",
        /*scale*/
        o[9]
      ), f & /*disabled*/
      256 && ve(
        e,
        "pointer-events",
        /*disabled*/
        o[8] ? "none" : null
      ), f & /*scale*/
      512 && ve(
        e,
        "width",
        /*scale*/
        o[9] === 0 ? "fit-content" : null
      ), f & /*min_width*/
      1024 && ve(e, "min-width", typeof /*min_width*/
      o[10] == "number" ? `calc(min(${/*min_width*/
      o[10]}px, 100%))` : null);
    },
    i(o) {
      i || (mn(a, o), i = !0);
    },
    o(o) {
      gn(a, o), i = !1;
    },
    d(o) {
      o && Gt(e), s && s.d(), a && a.d(o);
    }
  };
}
function Bl(n) {
  let e, t, l;
  return {
    c() {
      e = On("img"), j(e, "class", "button-icon svelte-8huxfn"), _n(e.src, t = /*icon*/
      n[7].url) || j(e, "src", t), j(e, "alt", l = `${/*value*/
      n[5]} icon`);
    },
    m(i, s) {
      Bt(i, e, s);
    },
    p(i, s) {
      s & /*icon*/
      128 && !_n(e.src, t = /*icon*/
      i[7].url) && j(e, "src", t), s & /*value*/
      32 && l !== (l = `${/*value*/
      i[5]} icon`) && j(e, "alt", l);
    },
    d(i) {
      i && Gt(e);
    }
  };
}
function Vl(n) {
  let e, t, l;
  return {
    c() {
      e = On("img"), j(e, "class", "button-icon svelte-8huxfn"), _n(e.src, t = /*icon*/
      n[7].url) || j(e, "src", t), j(e, "alt", l = `${/*value*/
      n[5]} icon`);
    },
    m(i, s) {
      Bt(i, e, s);
    },
    p(i, s) {
      s & /*icon*/
      128 && !_n(e.src, t = /*icon*/
      i[7].url) && j(e, "src", t), s & /*value*/
      32 && l !== (l = `${/*value*/
      i[5]} icon`) && j(e, "alt", l);
    },
    d(i) {
      i && Gt(e);
    }
  };
}
function ra(n) {
  let e, t, l, i;
  const s = [oa, sa], r = [];
  function a(o, f) {
    return (
      /*link*/
      o[6] && /*link*/
      o[6].length > 0 ? 0 : 1
    );
  }
  return e = a(n), t = r[e] = s[e](n), {
    c() {
      t.c(), l = ea();
    },
    m(o, f) {
      r[e].m(o, f), Bt(o, l, f), i = !0;
    },
    p(o, [f]) {
      let u = e;
      e = a(o), e === u ? r[e].p(o, f) : (ta(), gn(r[u], 1, 1, () => {
        r[u] = null;
      }), $r(), t = r[e], t ? t.p(o, f) : (t = r[e] = s[e](o), t.c()), mn(t, 1), t.m(l.parentNode, l));
    },
    i(o) {
      i || (mn(t), i = !0);
    },
    o(o) {
      gn(t), i = !1;
    },
    d(o) {
      o && Gt(l), r[e].d(o);
    }
  };
}
function aa(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { elem_id: s = "" } = e, { elem_classes: r = [] } = e, { visible: a = !0 } = e, { variant: o = "secondary" } = e, { size: f = "lg" } = e, { value: u = null } = e, { link: d = null } = e, { icon: c = null } = e, { disabled: m = !1 } = e, { scale: y = null } = e, { min_width: C = void 0 } = e;
  function T(E) {
    xr.call(this, n, E);
  }
  return n.$$set = (E) => {
    "elem_id" in E && t(0, s = E.elem_id), "elem_classes" in E && t(1, r = E.elem_classes), "visible" in E && t(2, a = E.visible), "variant" in E && t(3, o = E.variant), "size" in E && t(4, f = E.size), "value" in E && t(5, u = E.value), "link" in E && t(6, d = E.link), "icon" in E && t(7, c = E.icon), "disabled" in E && t(8, m = E.disabled), "scale" in E && t(9, y = E.scale), "min_width" in E && t(10, C = E.min_width), "$$scope" in E && t(11, i = E.$$scope);
  }, [
    s,
    r,
    a,
    o,
    f,
    u,
    d,
    c,
    m,
    y,
    C,
    i,
    l,
    T
  ];
}
class hn extends Qr {
  constructor(e) {
    super(), na(this, e, aa, ra, ia, {
      elem_id: 0,
      elem_classes: 1,
      visible: 2,
      variant: 3,
      size: 4,
      value: 5,
      link: 6,
      icon: 7,
      disabled: 8,
      scale: 9,
      min_width: 10
    });
  }
}
const {
  SvelteComponent: fa,
  action_destroyer: ua,
  add_render_callback: ca,
  append: da,
  attr: I,
  binding_callbacks: Lt,
  bubble: Ve,
  check_outros: Xn,
  create_component: Jn,
  create_in_transition: _a,
  destroy_component: Qn,
  detach: Ne,
  element: at,
  empty: Ni,
  group_outros: xn,
  init: ma,
  insert: Le,
  is_function: ga,
  listen: V,
  mount_component: $n,
  noop: bn,
  run_all: Vt,
  safe_not_equal: ha,
  set_data: ba,
  set_input_value: Ke,
  space: Li,
  text: pa,
  to_number: Mi,
  toggle_class: Hl,
  transition_in: Ye,
  transition_out: Qe
} = window.__gradio__svelte__internal, { beforeUpdate: wa, afterUpdate: va, createEventDispatcher: ya, tick: Ul } = window.__gradio__svelte__internal;
function Ea(n) {
  let e;
  return {
    c() {
      e = pa(
        /*label*/
        n[3]
      );
    },
    m(t, l) {
      Le(t, e, l);
    },
    p(t, l) {
      l[0] & /*label*/
      8 && ba(
        e,
        /*label*/
        t[3]
      );
    },
    d(t) {
      t && Ne(e);
    }
  };
}
function Da(n) {
  let e, t, l, i, s, r, a, o, f = (
    /*show_label*/
    n[6] && /*show_copy_button*/
    n[10] && jl(n)
  );
  return {
    c() {
      f && f.c(), e = Li(), t = at("textarea"), I(t, "data-testid", "textbox"), I(t, "class", "scroll-hide svelte-9f62t7"), I(t, "dir", l = /*rtl*/
      n[11] ? "rtl" : "ltr"), I(
        t,
        "placeholder",
        /*placeholder*/
        n[2]
      ), I(
        t,
        "rows",
        /*lines*/
        n[1]
      ), t.disabled = /*disabled*/
      n[5], t.autofocus = /*autofocus*/
      n[12], I(t, "style", i = /*text_align*/
      n[13] ? "text-align: " + /*text_align*/
      n[13] : "");
    },
    m(u, d) {
      f && f.m(u, d), Le(u, e, d), Le(u, t, d), Ke(
        t,
        /*value*/
        n[0]
      ), n[42](t), r = !0, /*autofocus*/
      n[12] && t.focus(), a || (o = [
        ua(s = /*text_area_resize*/
        n[20].call(
          null,
          t,
          /*value*/
          n[0]
        )),
        V(
          t,
          "input",
          /*textarea_input_handler*/
          n[41]
        ),
        V(
          t,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        V(
          t,
          "blur",
          /*blur_handler_4*/
          n[31]
        ),
        V(
          t,
          "select",
          /*handle_select*/
          n[17]
        ),
        V(
          t,
          "focus",
          /*focus_handler_4*/
          n[32]
        ),
        V(
          t,
          "scroll",
          /*handle_scroll*/
          n[19]
        )
      ], a = !0);
    },
    p(u, d) {
      /*show_label*/
      u[6] && /*show_copy_button*/
      u[10] ? f ? (f.p(u, d), d[0] & /*show_label, show_copy_button*/
      1088 && Ye(f, 1)) : (f = jl(u), f.c(), Ye(f, 1), f.m(e.parentNode, e)) : f && (xn(), Qe(f, 1, 1, () => {
        f = null;
      }), Xn()), (!r || d[0] & /*rtl*/
      2048 && l !== (l = /*rtl*/
      u[11] ? "rtl" : "ltr")) && I(t, "dir", l), (!r || d[0] & /*placeholder*/
      4) && I(
        t,
        "placeholder",
        /*placeholder*/
        u[2]
      ), (!r || d[0] & /*lines*/
      2) && I(
        t,
        "rows",
        /*lines*/
        u[1]
      ), (!r || d[0] & /*disabled*/
      32) && (t.disabled = /*disabled*/
      u[5]), (!r || d[0] & /*autofocus*/
      4096) && (t.autofocus = /*autofocus*/
      u[12]), (!r || d[0] & /*text_align*/
      8192 && i !== (i = /*text_align*/
      u[13] ? "text-align: " + /*text_align*/
      u[13] : "")) && I(t, "style", i), s && ga(s.update) && d[0] & /*value*/
      1 && s.update.call(
        null,
        /*value*/
        u[0]
      ), d[0] & /*value*/
      1 && Ke(
        t,
        /*value*/
        u[0]
      );
    },
    i(u) {
      r || (Ye(f), r = !0);
    },
    o(u) {
      Qe(f), r = !1;
    },
    d(u) {
      u && (Ne(e), Ne(t)), f && f.d(u), n[42](null), a = !1, Vt(o);
    }
  };
}
function ka(n) {
  let e;
  function t(s, r) {
    if (
      /*type*/
      s[9] === "text"
    )
      return Sa;
    if (
      /*type*/
      s[9] === "password"
    )
      return Ia;
    if (
      /*type*/
      s[9] === "email"
    )
      return Aa;
    if (
      /*type*/
      s[9] === "number"
    )
      return Oa;
  }
  let l = t(n), i = l && l(n);
  return {
    c() {
      i && i.c(), e = Ni();
    },
    m(s, r) {
      i && i.m(s, r), Le(s, e, r);
    },
    p(s, r) {
      l === (l = t(s)) && i ? i.p(s, r) : (i && i.d(1), i = l && l(s), i && (i.c(), i.m(e.parentNode, e)));
    },
    i: bn,
    o: bn,
    d(s) {
      s && Ne(e), i && i.d(s);
    }
  };
}
function jl(n) {
  let e, t, l, i;
  const s = [Ca, Ta], r = [];
  function a(o, f) {
    return (
      /*copied*/
      o[15] ? 0 : 1
    );
  }
  return e = a(n), t = r[e] = s[e](n), {
    c() {
      t.c(), l = Ni();
    },
    m(o, f) {
      r[e].m(o, f), Le(o, l, f), i = !0;
    },
    p(o, f) {
      let u = e;
      e = a(o), e === u ? r[e].p(o, f) : (xn(), Qe(r[u], 1, 1, () => {
        r[u] = null;
      }), Xn(), t = r[e], t ? t.p(o, f) : (t = r[e] = s[e](o), t.c()), Ye(t, 1), t.m(l.parentNode, l));
    },
    i(o) {
      i || (Ye(t), i = !0);
    },
    o(o) {
      Qe(t), i = !1;
    },
    d(o) {
      o && Ne(l), r[e].d(o);
    }
  };
}
function Ta(n) {
  let e, t, l, i, s;
  return t = new pi({}), {
    c() {
      e = at("button"), Jn(t.$$.fragment), I(e, "aria-label", "Copy"), I(e, "aria-roledescription", "Copy text"), I(e, "class", "svelte-9f62t7");
    },
    m(r, a) {
      Le(r, e, a), $n(t, e, null), l = !0, i || (s = V(
        e,
        "click",
        /*handle_copy*/
        n[16]
      ), i = !0);
    },
    p: bn,
    i(r) {
      l || (Ye(t.$$.fragment, r), l = !0);
    },
    o(r) {
      Qe(t.$$.fragment, r), l = !1;
    },
    d(r) {
      r && Ne(e), Qn(t), i = !1, s();
    }
  };
}
function Ca(n) {
  let e, t, l, i;
  return t = new bi({}), {
    c() {
      e = at("button"), Jn(t.$$.fragment), I(e, "aria-label", "Copied"), I(e, "aria-roledescription", "Text copied"), I(e, "class", "svelte-9f62t7");
    },
    m(s, r) {
      Le(s, e, r), $n(t, e, null), i = !0;
    },
    p: bn,
    i(s) {
      i || (Ye(t.$$.fragment, s), s && (l || ca(() => {
        l = _a(e, Ws, { duration: 300 }), l.start();
      })), i = !0);
    },
    o(s) {
      Qe(t.$$.fragment, s), i = !1;
    },
    d(s) {
      s && Ne(e), Qn(t);
    }
  };
}
function Oa(n) {
  let e, t, l;
  return {
    c() {
      e = at("input"), I(e, "data-testid", "textbox"), I(e, "type", "number"), I(e, "class", "scroll-hide svelte-9f62t7"), I(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], I(e, "autocomplete", "");
    },
    m(i, s) {
      Le(i, e, s), Ke(
        e,
        /*value*/
        n[0]
      ), n[40](e), /*autofocus*/
      n[12] && e.focus(), t || (l = [
        V(
          e,
          "input",
          /*input_input_handler_3*/
          n[39]
        ),
        V(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        V(
          e,
          "blur",
          /*blur_handler_3*/
          n[29]
        ),
        V(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        V(
          e,
          "focus",
          /*focus_handler_3*/
          n[30]
        )
      ], t = !0);
    },
    p(i, s) {
      s[0] & /*placeholder*/
      4 && I(
        e,
        "placeholder",
        /*placeholder*/
        i[2]
      ), s[0] & /*disabled*/
      32 && (e.disabled = /*disabled*/
      i[5]), s[0] & /*autofocus*/
      4096 && (e.autofocus = /*autofocus*/
      i[12]), s[0] & /*value*/
      1 && Mi(e.value) !== /*value*/
      i[0] && Ke(
        e,
        /*value*/
        i[0]
      );
    },
    d(i) {
      i && Ne(e), n[40](null), t = !1, Vt(l);
    }
  };
}
function Aa(n) {
  let e, t, l;
  return {
    c() {
      e = at("input"), I(e, "data-testid", "textbox"), I(e, "type", "email"), I(e, "class", "scroll-hide svelte-9f62t7"), I(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], I(e, "autocomplete", "email");
    },
    m(i, s) {
      Le(i, e, s), Ke(
        e,
        /*value*/
        n[0]
      ), n[38](e), /*autofocus*/
      n[12] && e.focus(), t || (l = [
        V(
          e,
          "input",
          /*input_input_handler_2*/
          n[37]
        ),
        V(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        V(
          e,
          "blur",
          /*blur_handler_2*/
          n[27]
        ),
        V(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        V(
          e,
          "focus",
          /*focus_handler_2*/
          n[28]
        )
      ], t = !0);
    },
    p(i, s) {
      s[0] & /*placeholder*/
      4 && I(
        e,
        "placeholder",
        /*placeholder*/
        i[2]
      ), s[0] & /*disabled*/
      32 && (e.disabled = /*disabled*/
      i[5]), s[0] & /*autofocus*/
      4096 && (e.autofocus = /*autofocus*/
      i[12]), s[0] & /*value*/
      1 && e.value !== /*value*/
      i[0] && Ke(
        e,
        /*value*/
        i[0]
      );
    },
    d(i) {
      i && Ne(e), n[38](null), t = !1, Vt(l);
    }
  };
}
function Ia(n) {
  let e, t, l;
  return {
    c() {
      e = at("input"), I(e, "data-testid", "password"), I(e, "type", "password"), I(e, "class", "scroll-hide svelte-9f62t7"), I(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], I(e, "autocomplete", "");
    },
    m(i, s) {
      Le(i, e, s), Ke(
        e,
        /*value*/
        n[0]
      ), n[36](e), /*autofocus*/
      n[12] && e.focus(), t || (l = [
        V(
          e,
          "input",
          /*input_input_handler_1*/
          n[35]
        ),
        V(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        V(
          e,
          "blur",
          /*blur_handler_1*/
          n[25]
        ),
        V(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        V(
          e,
          "focus",
          /*focus_handler_1*/
          n[26]
        )
      ], t = !0);
    },
    p(i, s) {
      s[0] & /*placeholder*/
      4 && I(
        e,
        "placeholder",
        /*placeholder*/
        i[2]
      ), s[0] & /*disabled*/
      32 && (e.disabled = /*disabled*/
      i[5]), s[0] & /*autofocus*/
      4096 && (e.autofocus = /*autofocus*/
      i[12]), s[0] & /*value*/
      1 && e.value !== /*value*/
      i[0] && Ke(
        e,
        /*value*/
        i[0]
      );
    },
    d(i) {
      i && Ne(e), n[36](null), t = !1, Vt(l);
    }
  };
}
function Sa(n) {
  let e, t, l, i, s;
  return {
    c() {
      e = at("input"), I(e, "data-testid", "textbox"), I(e, "type", "text"), I(e, "class", "scroll-hide svelte-9f62t7"), I(e, "dir", t = /*rtl*/
      n[11] ? "rtl" : "ltr"), I(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], I(e, "style", l = /*text_align*/
      n[13] ? "text-align: " + /*text_align*/
      n[13] : "");
    },
    m(r, a) {
      Le(r, e, a), Ke(
        e,
        /*value*/
        n[0]
      ), n[34](e), /*autofocus*/
      n[12] && e.focus(), i || (s = [
        V(
          e,
          "input",
          /*input_input_handler*/
          n[33]
        ),
        V(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        V(
          e,
          "blur",
          /*blur_handler*/
          n[23]
        ),
        V(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        V(
          e,
          "focus",
          /*focus_handler*/
          n[24]
        )
      ], i = !0);
    },
    p(r, a) {
      a[0] & /*rtl*/
      2048 && t !== (t = /*rtl*/
      r[11] ? "rtl" : "ltr") && I(e, "dir", t), a[0] & /*placeholder*/
      4 && I(
        e,
        "placeholder",
        /*placeholder*/
        r[2]
      ), a[0] & /*disabled*/
      32 && (e.disabled = /*disabled*/
      r[5]), a[0] & /*autofocus*/
      4096 && (e.autofocus = /*autofocus*/
      r[12]), a[0] & /*text_align*/
      8192 && l !== (l = /*text_align*/
      r[13] ? "text-align: " + /*text_align*/
      r[13] : "") && I(e, "style", l), a[0] & /*value*/
      1 && e.value !== /*value*/
      r[0] && Ke(
        e,
        /*value*/
        r[0]
      );
    },
    d(r) {
      r && Ne(e), n[34](null), i = !1, Vt(s);
    }
  };
}
function Ra(n) {
  let e, t, l, i, s, r;
  t = new Ei({
    props: {
      show_label: (
        /*show_label*/
        n[6]
      ),
      info: (
        /*info*/
        n[4]
      ),
      $$slots: { default: [Ea] },
      $$scope: { ctx: n }
    }
  });
  const a = [ka, Da], o = [];
  function f(u, d) {
    return (
      /*lines*/
      u[1] === 1 && /*max_lines*/
      u[8] === 1 ? 0 : 1
    );
  }
  return i = f(n), s = o[i] = a[i](n), {
    c() {
      e = at("label"), Jn(t.$$.fragment), l = Li(), s.c(), I(e, "class", "svelte-9f62t7"), Hl(
        e,
        "container",
        /*container*/
        n[7]
      );
    },
    m(u, d) {
      Le(u, e, d), $n(t, e, null), da(e, l), o[i].m(e, null), r = !0;
    },
    p(u, d) {
      const c = {};
      d[0] & /*show_label*/
      64 && (c.show_label = /*show_label*/
      u[6]), d[0] & /*info*/
      16 && (c.info = /*info*/
      u[4]), d[0] & /*label*/
      8 | d[1] & /*$$scope*/
      2097152 && (c.$$scope = { dirty: d, ctx: u }), t.$set(c);
      let m = i;
      i = f(u), i === m ? o[i].p(u, d) : (xn(), Qe(o[m], 1, 1, () => {
        o[m] = null;
      }), Xn(), s = o[i], s ? s.p(u, d) : (s = o[i] = a[i](u), s.c()), Ye(s, 1), s.m(e, null)), (!r || d[0] & /*container*/
      128) && Hl(
        e,
        "container",
        /*container*/
        u[7]
      );
    },
    i(u) {
      r || (Ye(t.$$.fragment, u), Ye(s), r = !0);
    },
    o(u) {
      Qe(t.$$.fragment, u), Qe(s), r = !1;
    },
    d(u) {
      u && Ne(e), Qn(t), o[i].d();
    }
  };
}
function Na(n, e, t) {
  let { value: l = "" } = e, { value_is_output: i = !1 } = e, { lines: s = 1 } = e, { placeholder: r = "Type here..." } = e, { label: a } = e, { info: o = void 0 } = e, { disabled: f = !1 } = e, { show_label: u = !0 } = e, { container: d = !0 } = e, { max_lines: c } = e, { type: m = "text" } = e, { show_copy_button: y = !1 } = e, { rtl: C = !1 } = e, { autofocus: T = !1 } = e, { text_align: E = void 0 } = e, { autoscroll: O = !0 } = e, _, p = !1, Z, k, z = 0, S = !1;
  const h = ya();
  wa(() => {
    k = _ && _.offsetHeight + _.scrollTop > _.scrollHeight - 100;
  });
  const D = () => {
    k && O && !S && _.scrollTo(0, _.scrollHeight);
  };
  function G() {
    h("change", l), i || h("input");
  }
  va(() => {
    T && _.focus(), k && O && D(), t(21, i = !1);
  });
  async function me() {
    "clipboard" in navigator && (await navigator.clipboard.writeText(l), P());
  }
  function P() {
    t(15, p = !0), Z && clearTimeout(Z), Z = setTimeout(
      () => {
        t(15, p = !1);
      },
      1e3
    );
  }
  function B(g) {
    const ke = g.target, $e = ke.value, Ge = [ke.selectionStart, ke.selectionEnd];
    h("select", { value: $e.substring(...Ge), index: Ge });
  }
  async function le(g) {
    await Ul(), (g.key === "Enter" && g.shiftKey && s > 1 || g.key === "Enter" && !g.shiftKey && s === 1 && c >= 1) && (g.preventDefault(), h("submit"));
  }
  function x(g) {
    const ke = g.target, $e = ke.scrollTop;
    $e < z && (S = !0), z = $e;
    const Ge = ke.scrollHeight - ke.clientHeight;
    $e >= Ge && (S = !1);
  }
  async function X(g) {
    if (await Ul(), s === c)
      return;
    let ke = c === void 0 ? !1 : c === void 0 ? 21 * 11 : 21 * (c + 1), $e = 21 * (s + 1);
    const Ge = g.target;
    Ge.style.height = "1px";
    let Rt;
    ke && Ge.scrollHeight > ke ? Rt = ke : Ge.scrollHeight < $e ? Rt = $e : Rt = Ge.scrollHeight, Ge.style.height = `${Rt}px`;
  }
  function pe(g, ke) {
    if (s !== c && (g.style.overflowY = "scroll", g.addEventListener("input", X), !!ke.trim()))
      return X({ target: g }), {
        destroy: () => g.removeEventListener("input", X)
      };
  }
  function Ee(g) {
    Ve.call(this, n, g);
  }
  function $(g) {
    Ve.call(this, n, g);
  }
  function b(g) {
    Ve.call(this, n, g);
  }
  function M(g) {
    Ve.call(this, n, g);
  }
  function w(g) {
    Ve.call(this, n, g);
  }
  function Me(g) {
    Ve.call(this, n, g);
  }
  function xe(g) {
    Ve.call(this, n, g);
  }
  function ht(g) {
    Ve.call(this, n, g);
  }
  function ze(g) {
    Ve.call(this, n, g);
  }
  function bt(g) {
    Ve.call(this, n, g);
  }
  function pt() {
    l = this.value, t(0, l);
  }
  function H(g) {
    Lt[g ? "unshift" : "push"](() => {
      _ = g, t(14, _);
    });
  }
  function U() {
    l = this.value, t(0, l);
  }
  function F(g) {
    Lt[g ? "unshift" : "push"](() => {
      _ = g, t(14, _);
    });
  }
  function L() {
    l = this.value, t(0, l);
  }
  function ie(g) {
    Lt[g ? "unshift" : "push"](() => {
      _ = g, t(14, _);
    });
  }
  function De() {
    l = Mi(this.value), t(0, l);
  }
  function Ht(g) {
    Lt[g ? "unshift" : "push"](() => {
      _ = g, t(14, _);
    });
  }
  function Gi() {
    l = this.value, t(0, l);
  }
  function Bi(g) {
    Lt[g ? "unshift" : "push"](() => {
      _ = g, t(14, _);
    });
  }
  return n.$$set = (g) => {
    "value" in g && t(0, l = g.value), "value_is_output" in g && t(21, i = g.value_is_output), "lines" in g && t(1, s = g.lines), "placeholder" in g && t(2, r = g.placeholder), "label" in g && t(3, a = g.label), "info" in g && t(4, o = g.info), "disabled" in g && t(5, f = g.disabled), "show_label" in g && t(6, u = g.show_label), "container" in g && t(7, d = g.container), "max_lines" in g && t(8, c = g.max_lines), "type" in g && t(9, m = g.type), "show_copy_button" in g && t(10, y = g.show_copy_button), "rtl" in g && t(11, C = g.rtl), "autofocus" in g && t(12, T = g.autofocus), "text_align" in g && t(13, E = g.text_align), "autoscroll" in g && t(22, O = g.autoscroll);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*value*/
    1 && l === null && t(0, l = ""), n.$$.dirty[0] & /*value, el, lines, max_lines*/
    16643 && _ && s !== c && X({ target: _ }), n.$$.dirty[0] & /*value*/
    1 && G();
  }, [
    l,
    s,
    r,
    a,
    o,
    f,
    u,
    d,
    c,
    m,
    y,
    C,
    T,
    E,
    _,
    p,
    me,
    B,
    le,
    x,
    pe,
    i,
    O,
    Ee,
    $,
    b,
    M,
    w,
    Me,
    xe,
    ht,
    ze,
    bt,
    pt,
    H,
    U,
    F,
    L,
    ie,
    De,
    Ht,
    Gi,
    Bi
  ];
}
class $t extends fa {
  constructor(e) {
    super(), ma(
      this,
      e,
      Na,
      Ra,
      ha,
      {
        value: 0,
        value_is_output: 21,
        lines: 1,
        placeholder: 2,
        label: 3,
        info: 4,
        disabled: 5,
        show_label: 6,
        container: 7,
        max_lines: 8,
        type: 9,
        show_copy_button: 10,
        rtl: 11,
        autofocus: 12,
        text_align: 13,
        autoscroll: 22
      },
      null,
      [-1, -1]
    );
  }
}
const {
  SvelteComponent: La,
  action_destroyer: Pi,
  add_flush_callback: en,
  append: A,
  assign: Ma,
  attr: v,
  bind: tn,
  binding_callbacks: nn,
  check_outros: ln,
  create_component: ge,
  destroy_component: he,
  detach: Ie,
  element: re,
  ensure_array_like: pn,
  flush: we,
  get_spread_object: Pa,
  get_spread_update: Fa,
  group_outros: sn,
  init: qa,
  insert: Se,
  is_function: Fi,
  listen: Je,
  mount_component: be,
  noop: qi,
  outro_and_destroy_block: Zi,
  run_all: el,
  safe_not_equal: Za,
  set_data: tl,
  space: ce,
  svg_element: te,
  text: gt,
  transition_in: K,
  transition_out: Q,
  update_keyed_each: zi
} = window.__gradio__svelte__internal;
function Wl(n, e, t) {
  const l = n.slice();
  return l[35] = e[t], l[36] = e, l[37] = t, l;
}
function Yl(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l[39] = e, l[40] = t, l;
}
function Kl(n) {
  let e, t;
  const l = [
    { autoscroll: (
      /*gradio*/
      n[1].autoscroll
    ) },
    { i18n: (
      /*gradio*/
      n[1].i18n
    ) },
    /*loading_status*/
    n[10]
  ];
  let i = {};
  for (let s = 0; s < l.length; s += 1)
    i = Ma(i, l[s]);
  return e = new Jr({ props: i }), {
    c() {
      ge(e.$$.fragment);
    },
    m(s, r) {
      be(e, s, r), t = !0;
    },
    p(s, r) {
      const a = r[0] & /*gradio, loading_status*/
      1026 ? Fa(l, [
        r[0] & /*gradio*/
        2 && { autoscroll: (
          /*gradio*/
          s[1].autoscroll
        ) },
        r[0] & /*gradio*/
        2 && { i18n: (
          /*gradio*/
          s[1].i18n
        ) },
        r[0] & /*loading_status*/
        1024 && Pa(
          /*loading_status*/
          s[10]
        )
      ]) : {};
      e.$set(a);
    },
    i(s) {
      t || (K(e.$$.fragment, s), t = !0);
    },
    o(s) {
      Q(e.$$.fragment, s), t = !1;
    },
    d(s) {
      he(e, s);
    }
  };
}
function za(n) {
  let e;
  return {
    c() {
      e = gt(
        /*label*/
        n[2]
      );
    },
    m(t, l) {
      Se(t, e, l);
    },
    p(t, l) {
      l[0] & /*label*/
      4 && tl(
        e,
        /*label*/
        t[2]
      );
    },
    d(t) {
      t && Ie(e);
    }
  };
}
function Ga(n) {
  let e, t, l;
  return t = new wi({}), {
    c() {
      e = re("div"), ge(t.$$.fragment), v(e, "class", "icon-button svelte-1iqbtd5");
    },
    m(i, s) {
      Se(i, e, s), be(t, e, null), l = !0;
    },
    p: qi,
    i(i) {
      l || (K(t.$$.fragment, i), l = !0);
    },
    o(i) {
      Q(t.$$.fragment, i), l = !1;
    },
    d(i) {
      i && Ie(e), he(t);
    }
  };
}
function Ba(n) {
  let e, t, l;
  return t = new wi({}), {
    c() {
      e = re("div"), ge(t.$$.fragment), v(e, "class", "icon-button svelte-1iqbtd5");
    },
    m(i, s) {
      Se(i, e, s), be(t, e, null), l = !0;
    },
    p: qi,
    i(i) {
      l || (K(t.$$.fragment, i), l = !0);
    },
    o(i) {
      Q(t.$$.fragment, i), l = !1;
    },
    d(i) {
      i && Ie(e), he(t);
    }
  };
}
function Xl(n, e) {
  let t, l, i, s, r = (
    /*j*/
    e[40] + 1 + ""
  ), a, o, f, u, d, c, m, y, C, T, E, O, _, p, Z, k, z, S, h, D, G, me, P, B, le, x, X, pe, Ee, $, b, M;
  function w() {
    return (
      /*click_handler_1*/
      e[24](
        /*i*/
        e[37],
        /*j*/
        e[40]
      )
    );
  }
  u = new hn({
    props: {
      $$slots: { default: [Ba] },
      $$scope: { ctx: e }
    }
  }), u.$on("click", w);
  function Me(H) {
    e[25](
      H,
      /*i*/
      e[37],
      /*j*/
      e[40]
    );
  }
  let xe = {
    type: "number",
    max_lines: 1,
    label: "Length",
    placeholder: (
      /*placeholder*/
      e[6]
    ),
    disabled: !/*interactive*/
    e[11],
    dir: (
      /*rtl*/
      e[12] ? "rtl" : "ltr"
    )
  };
  /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].length !== void 0 && (xe.value = /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].length), D = new $t({ props: xe }), nn.push(() => tn(D, "value", Me)), D.$on(
    "input",
    /*handle_change*/
    e[16]
  );
  function ht(H) {
    e[26](
      H,
      /*i*/
      e[37],
      /*j*/
      e[40]
    );
  }
  let ze = {
    type: "text",
    label: "Motion description",
    placeholder: (
      /*placeholder*/
      e[6]
    ),
    disabled: !/*interactive*/
    e[11],
    dir: (
      /*rtl*/
      e[12] ? "rtl" : "ltr"
    )
  };
  /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].motion_description !== void 0 && (ze.value = /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].motion_description), P = new $t({ props: ze }), nn.push(() => tn(P, "value", ht)), P.$on(
    "input",
    /*handle_change*/
    e[16]
  );
  function bt(H) {
    e[27](
      H,
      /*i*/
      e[37],
      /*j*/
      e[40]
    );
  }
  let pt = {
    type: "text",
    label: "Scene description",
    placeholder: (
      /*placeholder*/
      e[6]
    ),
    disabled: !/*interactive*/
    e[11],
    dir: (
      /*rtl*/
      e[12] ? "rtl" : "ltr"
    )
  };
  return (
    /*value*/
    e[0][
      /*i*/
      e[37]
    ].actions[
      /*j*/
      e[40]
    ].scene_description !== void 0 && (pt.value = /*value*/
    e[0][
      /*i*/
      e[37]
    ].actions[
      /*j*/
      e[40]
    ].scene_description), x = new $t({ props: pt }), nn.push(() => tn(x, "value", bt)), x.$on(
      "input",
      /*handle_change*/
      e[16]
    ), {
      key: n,
      first: null,
      c() {
        t = re("div"), l = re("div"), i = re("div"), s = gt("Action #"), a = gt(r), o = ce(), f = re("div"), ge(u.$$.fragment), d = ce(), c = re("div"), m = te("svg"), y = te("g"), C = te("g"), T = te("g"), E = te("path"), O = te("path"), _ = te("path"), p = te("path"), Z = te("path"), k = te("path"), h = ce(), ge(D.$$.fragment), me = ce(), ge(P.$$.fragment), le = ce(), ge(x.$$.fragment), pe = ce(), Ee = re("hr"), v(i, "class", "scene-title svelte-1iqbtd5"), v(y, "id", "SVGRepo_bgCarrier"), v(y, "stroke-width", "0"), v(C, "id", "SVGRepo_tracerCarrier"), v(C, "stroke-linecap", "round"), v(C, "stroke-linejoin", "round"), v(E, "d", "M5.99499 7C4.89223 7 4 7.9 4 9C4 10.1 4.89223 11 5.99499 11C7.09774 11 8 10.1 8 9C8 7.9 7.09774 7 5.99499 7Z"), v(E, "fill", "#000000"), v(O, "d", "M11.995 7C10.8922 7 10 7.9 10 9C10 10.1 10.8922 11 11.995 11C13.0977 11 14 10.1 14 9C14 7.9 13.0977 7 11.995 7Z"), v(O, "fill", "#000000"), v(_, "d", "M17.995 7C16.8922 7 16 7.9 16 9C16 10.1 16.8922 11 17.995 11C19.0977 11 20 10.1 20 9C20 7.9 19.0977 7 17.995 7Z"), v(_, "fill", "#000000"), v(p, "d", "M17.995 13C16.8922 13 16 13.9 16 15C16 16.1 16.8922 17 17.995 17C19.0977 17 20 16.1 20 15C20 13.9 19.0977 13 17.995 13Z"), v(p, "fill", "#000000"), v(Z, "d", "M11.995 13C10.8922 13 10 13.9 10 15C10 16.1 10.8922 17 11.995 17C13.0977 17 14 16.1 14 15C14 13.9 13.0977 13 11.995 13Z"), v(Z, "fill", "#000000"), v(k, "d", "M5.99499 13C4.89223 13 4 13.9 4 15C4 16.1 4.89223 17 5.99499 17C7.09774 17 8 16.1 8 15C8 13.9 7.09774 13 5.99499 13Z"), v(k, "fill", "#000000"), v(T, "id", "SVGRepo_iconCarrier"), v(m, "viewBox", "0 0 24 24"), v(m, "fill", "none"), v(m, "xmlns", "http://www.w3.org/2000/svg"), v(c, "tabindex", z = /*dragDisabled*/
        e[15] ? 0 : -1), v(c, "aria-label", "drag-handle"), v(c, "class", "handle svelte-1iqbtd5"), v(c, "style", S = /*dragDisabled*/
        e[15] ? "cursor: grab" : "cursor: grabbing"), v(f, "class", "scene-actions svelte-1iqbtd5"), v(l, "class", "scene-header svelte-1iqbtd5"), v(Ee, "class", "hr-action svelte-1iqbtd5"), this.first = t;
      },
      m(H, U) {
        Se(H, t, U), A(t, l), A(l, i), A(i, s), A(i, a), A(l, o), A(l, f), be(u, f, null), A(f, d), A(f, c), A(c, m), A(m, y), A(m, C), A(m, T), A(T, E), A(T, O), A(T, _), A(T, p), A(T, Z), A(T, k), A(t, h), be(D, t, null), A(t, me), be(P, t, null), A(t, le), be(x, t, null), A(t, pe), A(t, Ee), $ = !0, b || (M = [
          Je(
            c,
            "mousedown",
            /*startDrag*/
            e[20]
          ),
          Je(
            c,
            "touchstart",
            /*startDrag*/
            e[20]
          )
        ], b = !0);
      },
      p(H, U) {
        e = H, (!$ || U[0] & /*value*/
        1) && r !== (r = /*j*/
        e[40] + 1 + "") && tl(a, r);
        const F = {};
        U[1] & /*$$scope*/
        1024 && (F.$$scope = { dirty: U, ctx: e }), u.$set(F), (!$ || U[0] & /*dragDisabled*/
        32768 && z !== (z = /*dragDisabled*/
        e[15] ? 0 : -1)) && v(c, "tabindex", z), (!$ || U[0] & /*dragDisabled*/
        32768 && S !== (S = /*dragDisabled*/
        e[15] ? "cursor: grab" : "cursor: grabbing")) && v(c, "style", S);
        const L = {};
        U[0] & /*placeholder*/
        64 && (L.placeholder = /*placeholder*/
        e[6]), U[0] & /*interactive*/
        2048 && (L.disabled = !/*interactive*/
        e[11]), U[0] & /*rtl*/
        4096 && (L.dir = /*rtl*/
        e[12] ? "rtl" : "ltr"), !G && U[0] & /*value*/
        1 && (G = !0, L.value = /*value*/
        e[0][
          /*i*/
          e[37]
        ].actions[
          /*j*/
          e[40]
        ].length, en(() => G = !1)), D.$set(L);
        const ie = {};
        U[0] & /*placeholder*/
        64 && (ie.placeholder = /*placeholder*/
        e[6]), U[0] & /*interactive*/
        2048 && (ie.disabled = !/*interactive*/
        e[11]), U[0] & /*rtl*/
        4096 && (ie.dir = /*rtl*/
        e[12] ? "rtl" : "ltr"), !B && U[0] & /*value*/
        1 && (B = !0, ie.value = /*value*/
        e[0][
          /*i*/
          e[37]
        ].actions[
          /*j*/
          e[40]
        ].motion_description, en(() => B = !1)), P.$set(ie);
        const De = {};
        U[0] & /*placeholder*/
        64 && (De.placeholder = /*placeholder*/
        e[6]), U[0] & /*interactive*/
        2048 && (De.disabled = !/*interactive*/
        e[11]), U[0] & /*rtl*/
        4096 && (De.dir = /*rtl*/
        e[12] ? "rtl" : "ltr"), !X && U[0] & /*value*/
        1 && (X = !0, De.value = /*value*/
        e[0][
          /*i*/
          e[37]
        ].actions[
          /*j*/
          e[40]
        ].scene_description, en(() => X = !1)), x.$set(De);
      },
      i(H) {
        $ || (K(u.$$.fragment, H), K(D.$$.fragment, H), K(P.$$.fragment, H), K(x.$$.fragment, H), $ = !0);
      },
      o(H) {
        Q(u.$$.fragment, H), Q(D.$$.fragment, H), Q(P.$$.fragment, H), Q(x.$$.fragment, H), $ = !1;
      },
      d(H) {
        H && Ie(t), he(u), he(D), he(P), he(x), b = !1, el(M);
      }
    }
  );
}
function Va(n) {
  let e;
  return {
    c() {
      e = gt("New action");
    },
    m(t, l) {
      Se(t, e, l);
    },
    d(t) {
      t && Ie(e);
    }
  };
}
function Jl(n, e) {
  let t, l, i, s, r = (
    /*i*/
    e[37] + 1 + ""
  ), a, o, f, u, d, c, m, y, C, T, E, O, _, p, Z, k, z, S, h, D, G, me, P, B = [], le = /* @__PURE__ */ new Map(), x, X, pe, Ee, $, b, M, w;
  function Me() {
    return (
      /*click_handler*/
      e[22](
        /*i*/
        e[37]
      )
    );
  }
  u = new hn({
    props: {
      $$slots: { default: [Ga] },
      $$scope: { ctx: e }
    }
  }), u.$on("click", Me);
  function xe(F) {
    e[23](
      F,
      /*i*/
      e[37]
    );
  }
  let ht = {
    type: "text",
    label: "Character description",
    placeholder: (
      /*placeholder*/
      e[6]
    ),
    disabled: !/*interactive*/
    e[11],
    dir: (
      /*rtl*/
      e[12] ? "rtl" : "ltr"
    )
  };
  /*value*/
  e[0][
    /*i*/
    e[37]
  ].character_description !== void 0 && (ht.value = /*value*/
  e[0][
    /*i*/
    e[37]
  ].character_description), D = new $t({ props: ht }), nn.push(() => tn(D, "value", xe)), D.$on(
    "input",
    /*handle_change*/
    e[16]
  );
  let ze = pn(
    /*scene*/
    e[35].actions
  );
  const bt = (F) => (
    /*action*/
    F[38].id
  );
  for (let F = 0; F < ze.length; F += 1) {
    let L = Yl(e, ze, F), ie = bt(L);
    le.set(ie, B[F] = Xl(ie, L));
  }
  function pt() {
    return (
      /*click_handler_2*/
      e[28](
        /*i*/
        e[37]
      )
    );
  }
  X = new hn({
    props: {
      $$slots: { default: [Va] },
      $$scope: { ctx: e }
    }
  }), X.$on("click", pt);
  function H(...F) {
    return (
      /*consider_handler*/
      e[29](
        /*i*/
        e[37],
        ...F
      )
    );
  }
  function U(...F) {
    return (
      /*finalize_handler*/
      e[30](
        /*i*/
        e[37],
        ...F
      )
    );
  }
  return {
    key: n,
    first: null,
    c() {
      t = re("div"), l = re("div"), i = re("div"), s = gt("Scene #"), a = gt(r), o = ce(), f = re("div"), ge(u.$$.fragment), d = ce(), c = re("div"), m = te("svg"), y = te("g"), C = te("g"), T = te("g"), E = te("path"), O = te("path"), _ = te("path"), p = te("path"), Z = te("path"), k = te("path"), h = ce(), ge(D.$$.fragment), me = ce(), P = re("div");
      for (let F = 0; F < B.length; F += 1)
        B[F].c();
      x = ce(), ge(X.$$.fragment), Ee = ce(), $ = re("hr"), v(i, "class", "scene-title svelte-1iqbtd5"), v(y, "id", "SVGRepo_bgCarrier"), v(y, "stroke-width", "0"), v(C, "id", "SVGRepo_tracerCarrier"), v(C, "stroke-linecap", "round"), v(C, "stroke-linejoin", "round"), v(E, "d", "M5.99499 7C4.89223 7 4 7.9 4 9C4 10.1 4.89223 11 5.99499 11C7.09774 11 8 10.1 8 9C8 7.9 7.09774 7 5.99499 7Z"), v(E, "fill", "#000000"), v(O, "d", "M11.995 7C10.8922 7 10 7.9 10 9C10 10.1 10.8922 11 11.995 11C13.0977 11 14 10.1 14 9C14 7.9 13.0977 7 11.995 7Z"), v(O, "fill", "#000000"), v(_, "d", "M17.995 7C16.8922 7 16 7.9 16 9C16 10.1 16.8922 11 17.995 11C19.0977 11 20 10.1 20 9C20 7.9 19.0977 7 17.995 7Z"), v(_, "fill", "#000000"), v(p, "d", "M17.995 13C16.8922 13 16 13.9 16 15C16 16.1 16.8922 17 17.995 17C19.0977 17 20 16.1 20 15C20 13.9 19.0977 13 17.995 13Z"), v(p, "fill", "#000000"), v(Z, "d", "M11.995 13C10.8922 13 10 13.9 10 15C10 16.1 10.8922 17 11.995 17C13.0977 17 14 16.1 14 15C14 13.9 13.0977 13 11.995 13Z"), v(Z, "fill", "#000000"), v(k, "d", "M5.99499 13C4.89223 13 4 13.9 4 15C4 16.1 4.89223 17 5.99499 17C7.09774 17 8 16.1 8 15C8 13.9 7.09774 13 5.99499 13Z"), v(k, "fill", "#000000"), v(T, "id", "SVGRepo_iconCarrier"), v(m, "viewBox", "0 0 24 24"), v(m, "fill", "none"), v(m, "xmlns", "http://www.w3.org/2000/svg"), v(c, "tabindex", z = /*dragDisabled*/
      e[15] ? 0 : -1), v(c, "aria-label", "drag-handle"), v(c, "class", "handle svelte-1iqbtd5"), v(c, "style", S = /*dragDisabled*/
      e[15] ? "cursor: grab" : "cursor: grabbing"), v(f, "class", "scene-actions svelte-1iqbtd5"), v(l, "class", "scene-header svelte-1iqbtd5"), v(P, "class", "actions svelte-1iqbtd5"), v($, "class", "hr-scene svelte-1iqbtd5"), v(t, "class", "scene svelte-1iqbtd5"), this.first = t;
    },
    m(F, L) {
      Se(F, t, L), A(t, l), A(l, i), A(i, s), A(i, a), A(l, o), A(l, f), be(u, f, null), A(f, d), A(f, c), A(c, m), A(m, y), A(m, C), A(m, T), A(T, E), A(T, O), A(T, _), A(T, p), A(T, Z), A(T, k), A(t, h), be(D, t, null), A(t, me), A(t, P);
      for (let ie = 0; ie < B.length; ie += 1)
        B[ie] && B[ie].m(P, null);
      A(P, x), be(X, P, null), A(t, Ee), A(t, $), b = !0, M || (w = [
        Je(
          c,
          "mousedown",
          /*startDrag*/
          e[20]
        ),
        Je(
          c,
          "touchstart",
          /*startDrag*/
          e[20]
        ),
        Pi(pe = _i.call(null, P, {
          items: (
            /*scene*/
            e[35].actions
          ),
          dragDisabled: (
            /*dragDisabled*/
            e[15]
          ),
          flipDurationMs: wn,
          type: "action"
        })),
        Je(P, "consider", H),
        Je(P, "finalize", U)
      ], M = !0);
    },
    p(F, L) {
      e = F, (!b || L[0] & /*value*/
      1) && r !== (r = /*i*/
      e[37] + 1 + "") && tl(a, r);
      const ie = {};
      L[1] & /*$$scope*/
      1024 && (ie.$$scope = { dirty: L, ctx: e }), u.$set(ie), (!b || L[0] & /*dragDisabled*/
      32768 && z !== (z = /*dragDisabled*/
      e[15] ? 0 : -1)) && v(c, "tabindex", z), (!b || L[0] & /*dragDisabled*/
      32768 && S !== (S = /*dragDisabled*/
      e[15] ? "cursor: grab" : "cursor: grabbing")) && v(c, "style", S);
      const De = {};
      L[0] & /*placeholder*/
      64 && (De.placeholder = /*placeholder*/
      e[6]), L[0] & /*interactive*/
      2048 && (De.disabled = !/*interactive*/
      e[11]), L[0] & /*rtl*/
      4096 && (De.dir = /*rtl*/
      e[12] ? "rtl" : "ltr"), !G && L[0] & /*value*/
      1 && (G = !0, De.value = /*value*/
      e[0][
        /*i*/
        e[37]
      ].character_description, en(() => G = !1)), D.$set(De), L[0] & /*placeholder, interactive, rtl, value, handle_change, dragDisabled, startDrag*/
      1153089 && (ze = pn(
        /*scene*/
        e[35].actions
      ), sn(), B = zi(B, L, bt, 1, e, ze, le, P, Zi, Xl, x, Yl), ln());
      const Ht = {};
      L[1] & /*$$scope*/
      1024 && (Ht.$$scope = { dirty: L, ctx: e }), X.$set(Ht), pe && Fi(pe.update) && L[0] & /*value, dragDisabled*/
      32769 && pe.update.call(null, {
        items: (
          /*scene*/
          e[35].actions
        ),
        dragDisabled: (
          /*dragDisabled*/
          e[15]
        ),
        flipDurationMs: wn,
        type: "action"
      });
    },
    i(F) {
      if (!b) {
        K(u.$$.fragment, F), K(D.$$.fragment, F);
        for (let L = 0; L < ze.length; L += 1)
          K(B[L]);
        K(X.$$.fragment, F), b = !0;
      }
    },
    o(F) {
      Q(u.$$.fragment, F), Q(D.$$.fragment, F);
      for (let L = 0; L < B.length; L += 1)
        Q(B[L]);
      Q(X.$$.fragment, F), b = !1;
    },
    d(F) {
      F && Ie(t), he(u), he(D);
      for (let L = 0; L < B.length; L += 1)
        B[L].d();
      he(X), M = !1, el(w);
    }
  };
}
function Ha(n) {
  let e;
  return {
    c() {
      e = gt("New scene");
    },
    m(t, l) {
      Se(t, e, l);
    },
    d(t) {
      t && Ie(e);
    }
  };
}
function Ua(n) {
  let e, t;
  return e = new pi({}), {
    c() {
      ge(e.$$.fragment);
    },
    m(l, i) {
      be(e, l, i), t = !0;
    },
    i(l) {
      t || (K(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Q(e.$$.fragment, l), t = !1;
    },
    d(l) {
      he(e, l);
    }
  };
}
function ja(n) {
  let e, t;
  return e = new bi({}), {
    c() {
      ge(e.$$.fragment);
    },
    m(l, i) {
      be(e, l, i), t = !0;
    },
    i(l) {
      t || (K(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Q(e.$$.fragment, l), t = !1;
    },
    d(l) {
      he(e, l);
    }
  };
}
function Wa(n) {
  let e, t, l, i, s = [], r = /* @__PURE__ */ new Map(), a, o, f, u, d, c, m, y, C, T, E, O, _ = (
    /*loading_status*/
    n[10] && Kl(n)
  );
  t = new Ei({
    props: {
      show_label: (
        /*show_label*/
        n[7]
      ),
      info: void 0,
      $$slots: { default: [za] },
      $$scope: { ctx: n }
    }
  });
  let p = pn(
    /*value*/
    n[0]
  );
  const Z = (h) => (
    /*scene*/
    h[35].id
  );
  for (let h = 0; h < p.length; h += 1) {
    let D = Wl(n, p, h), G = Z(D);
    r.set(G, s[h] = Jl(G, D));
  }
  o = new hn({
    props: {
      $$slots: { default: [Ha] },
      $$scope: { ctx: n }
    }
  }), o.$on(
    "click",
    /*click_handler_3*/
    n[31]
  );
  const k = [ja, Ua], z = [];
  function S(h, D) {
    return (
      /*copied*/
      h[14] ? 0 : 1
    );
  }
  return c = S(n), m = z[c] = k[c](n), {
    c() {
      _ && _.c(), e = ce(), ge(t.$$.fragment), l = ce(), i = re("div");
      for (let h = 0; h < s.length; h += 1)
        s[h].c();
      a = ce(), ge(o.$$.fragment), u = ce(), d = re("button"), m.c(), v(i, "class", "scroll svelte-1iqbtd5"), v(d, "title", "copy"), v(d, "class", "json-copy-button svelte-1iqbtd5"), v(d, "aria-roledescription", y = /*copied*/
      n[14] ? "Copied value" : "Copy value"), v(d, "aria-label", C = /*copied*/
      n[14] ? "Copied" : "Copy");
    },
    m(h, D) {
      _ && _.m(h, D), Se(h, e, D), be(t, h, D), Se(h, l, D), Se(h, i, D);
      for (let G = 0; G < s.length; G += 1)
        s[G] && s[G].m(i, null);
      A(i, a), be(o, i, null), Se(h, u, D), Se(h, d, D), z[c].m(d, null), T = !0, E || (O = [
        Pi(f = _i.call(null, i, {
          items: (
            /*value*/
            n[0]
          ),
          dragDisabled: (
            /*dragDisabled*/
            n[15]
          ),
          flipDurationMs: wn,
          type: "scene"
        })),
        Je(
          i,
          "consider",
          /*handleConsider*/
          n[18]
        ),
        Je(
          i,
          "finalize",
          /*handleFinalize*/
          n[19]
        ),
        Je(
          d,
          "click",
          /*handle_copy*/
          n[17]
        )
      ], E = !0);
    },
    p(h, D) {
      /*loading_status*/
      h[10] ? _ ? (_.p(h, D), D[0] & /*loading_status*/
      1024 && K(_, 1)) : (_ = Kl(h), _.c(), K(_, 1), _.m(e.parentNode, e)) : _ && (sn(), Q(_, 1, 1, () => {
        _ = null;
      }), ln());
      const G = {};
      D[0] & /*show_label*/
      128 && (G.show_label = /*show_label*/
      h[7]), D[0] & /*label*/
      4 | D[1] & /*$$scope*/
      1024 && (G.$$scope = { dirty: D, ctx: h }), t.$set(G), D[0] & /*value, dragDisabled, handleConsider, handleFinalize, id, placeholder, interactive, rtl, handle_change, startDrag*/
      1947713 && (p = pn(
        /*value*/
        h[0]
      ), sn(), s = zi(s, D, Z, 1, h, p, r, i, Zi, Jl, a, Wl), ln());
      const me = {};
      D[1] & /*$$scope*/
      1024 && (me.$$scope = { dirty: D, ctx: h }), o.$set(me), f && Fi(f.update) && D[0] & /*value, dragDisabled*/
      32769 && f.update.call(null, {
        items: (
          /*value*/
          h[0]
        ),
        dragDisabled: (
          /*dragDisabled*/
          h[15]
        ),
        flipDurationMs: wn,
        type: "scene"
      });
      let P = c;
      c = S(h), c !== P && (sn(), Q(z[P], 1, 1, () => {
        z[P] = null;
      }), ln(), m = z[c], m || (m = z[c] = k[c](h), m.c()), K(m, 1), m.m(d, null)), (!T || D[0] & /*copied*/
      16384 && y !== (y = /*copied*/
      h[14] ? "Copied value" : "Copy value")) && v(d, "aria-roledescription", y), (!T || D[0] & /*copied*/
      16384 && C !== (C = /*copied*/
      h[14] ? "Copied" : "Copy")) && v(d, "aria-label", C);
    },
    i(h) {
      if (!T) {
        K(_), K(t.$$.fragment, h);
        for (let D = 0; D < p.length; D += 1)
          K(s[D]);
        K(o.$$.fragment, h), K(m), T = !0;
      }
    },
    o(h) {
      Q(_), Q(t.$$.fragment, h);
      for (let D = 0; D < s.length; D += 1)
        Q(s[D]);
      Q(o.$$.fragment, h), Q(m), T = !1;
    },
    d(h) {
      h && (Ie(e), Ie(l), Ie(i), Ie(u), Ie(d)), _ && _.d(h), he(t, h);
      for (let D = 0; D < s.length; D += 1)
        s[D].d();
      he(o), z[c].d(), E = !1, el(O);
    }
  };
}
function Ya(n) {
  let e, t;
  return e = new So({
    props: {
      visible: (
        /*visible*/
        n[5]
      ),
      elem_id: (
        /*elem_id*/
        n[3]
      ),
      elem_classes: (
        /*elem_classes*/
        n[4]
      ),
      scale: (
        /*scale*/
        n[8]
      ),
      min_width: (
        /*min_width*/
        n[9]
      ),
      allow_overflow: !1,
      padding: !0,
      $$slots: { default: [Wa] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      ge(e.$$.fragment);
    },
    m(l, i) {
      be(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i[0] & /*visible*/
      32 && (s.visible = /*visible*/
      l[5]), i[0] & /*elem_id*/
      8 && (s.elem_id = /*elem_id*/
      l[3]), i[0] & /*elem_classes*/
      16 && (s.elem_classes = /*elem_classes*/
      l[4]), i[0] & /*scale*/
      256 && (s.scale = /*scale*/
      l[8]), i[0] & /*min_width*/
      512 && (s.min_width = /*min_width*/
      l[9]), i[0] & /*copied, value, dragDisabled, id, placeholder, interactive, rtl, show_label, label, gradio, loading_status*/
      64711 | i[1] & /*$$scope*/
      1024 && (s.$$scope = { dirty: i, ctx: l }), e.$set(s);
    },
    i(l) {
      t || (K(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Q(e.$$.fragment, l), t = !1;
    },
    d(l) {
      he(e, l);
    }
  };
}
const wn = 200;
function Ka(n, e, t) {
  let { gradio: l } = e, { label: i = "Textbox" } = e, { elem_id: s = "" } = e, { elem_classes: r = [] } = e, { visible: a = !0 } = e, { value: o = [] } = e, { placeholder: f = "" } = e, { show_label: u } = e, { scale: d = null } = e, { min_width: c = void 0 } = e, { loading_status: m = void 0 } = e, { value_is_output: y = !1 } = e, { interactive: C } = e, { rtl: T = !1 } = e, E = !1, O, _ = 0;
  function p() {
    l.dispatch("change"), y || l.dispatch("input");
  }
  function Z() {
    t(14, E = !0), O && clearTimeout(O), O = setTimeout(
      () => {
        t(14, E = !1);
      },
      1e3
    );
  }
  async function k() {
    "clipboard" in navigator && (await navigator.clipboard.writeText(JSON.stringify(o, null, 2)), Z());
  }
  function z(b, M = void 0) {
    console.log("e", b);
    const { items: w, info: { source: Me, trigger: xe } } = b.detail;
    typeof M < "u" ? t(0, o[M].actions = w, o) : t(0, o = w), Me === _e.KEYBOARD && xe === de.DRAG_STOPPED && t(15, D = !0);
  }
  function S(b, M = void 0) {
    const { items: w, info: { source: Me } } = b.detail;
    typeof M < "u" ? t(0, o[M].actions = w, o) : t(0, o = w), Me === _e.POINTER && t(15, D = !0);
  }
  function h(b) {
    b.preventDefault(), t(15, D = !1);
  }
  let D = !0;
  const G = (b) => {
    t(0, o = o.filter((M, w) => w !== b));
  };
  function me(b, M) {
    n.$$.not_equal(o[M].character_description, b) && (o[M].character_description = b, t(0, o));
  }
  const P = (b, M) => {
    t(0, o[b].actions = o[b].actions.filter((w, Me) => Me !== M), o);
  };
  function B(b, M, w) {
    n.$$.not_equal(o[M].actions[w].length, b) && (o[M].actions[w].length = b, t(0, o));
  }
  function le(b, M, w) {
    n.$$.not_equal(o[M].actions[w].motion_description, b) && (o[M].actions[w].motion_description = b, t(0, o));
  }
  function x(b, M, w) {
    n.$$.not_equal(o[M].actions[w].scene_description, b) && (o[M].actions[w].scene_description = b, t(0, o));
  }
  const X = (b) => {
    t(
      0,
      o[b].actions = [
        ...o[b].actions,
        {
          length: null,
          motion_description: "",
          scene_description: "",
          id: t(13, _++, _)
        }
      ],
      o
    ), t(0, o);
  }, pe = (b, M) => z(M, b), Ee = (b, M) => S(M, b), $ = () => {
    t(0, o = [
      ...o,
      {
        character_description: "",
        actions: [],
        id: t(13, _++, _)
      }
    ]), console.log(o);
  };
  return n.$$set = (b) => {
    "gradio" in b && t(1, l = b.gradio), "label" in b && t(2, i = b.label), "elem_id" in b && t(3, s = b.elem_id), "elem_classes" in b && t(4, r = b.elem_classes), "visible" in b && t(5, a = b.visible), "value" in b && t(0, o = b.value), "placeholder" in b && t(6, f = b.placeholder), "show_label" in b && t(7, u = b.show_label), "scale" in b && t(8, d = b.scale), "min_width" in b && t(9, c = b.min_width), "loading_status" in b && t(10, m = b.loading_status), "value_is_output" in b && t(21, y = b.value_is_output), "interactive" in b && t(11, C = b.interactive), "rtl" in b && t(12, T = b.rtl);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*value, id*/
    8193 && (t(13, _ = o.reduce(
      (b, M) => Math.max(b, M.id, ...M.actions.map((w) => w.id)),
      0
    ) + 1), console.log("id", _)), n.$$.dirty[0] & /*value*/
    1 && p(), n.$$.dirty[0] & /*value*/
    1 && console.log("value", o);
  }, [
    o,
    l,
    i,
    s,
    r,
    a,
    f,
    u,
    d,
    c,
    m,
    C,
    T,
    _,
    E,
    D,
    p,
    k,
    z,
    S,
    h,
    y,
    G,
    me,
    P,
    B,
    le,
    x,
    X,
    pe,
    Ee,
    $
  ];
}
class Xa extends La {
  constructor(e) {
    super(), qa(
      this,
      e,
      Ka,
      Ya,
      Za,
      {
        gradio: 1,
        label: 2,
        elem_id: 3,
        elem_classes: 4,
        visible: 5,
        value: 0,
        placeholder: 6,
        show_label: 7,
        scale: 8,
        min_width: 9,
        loading_status: 10,
        value_is_output: 21,
        interactive: 11,
        rtl: 12
      },
      null,
      [-1, -1]
    );
  }
  get gradio() {
    return this.$$.ctx[1];
  }
  set gradio(e) {
    this.$$set({ gradio: e }), we();
  }
  get label() {
    return this.$$.ctx[2];
  }
  set label(e) {
    this.$$set({ label: e }), we();
  }
  get elem_id() {
    return this.$$.ctx[3];
  }
  set elem_id(e) {
    this.$$set({ elem_id: e }), we();
  }
  get elem_classes() {
    return this.$$.ctx[4];
  }
  set elem_classes(e) {
    this.$$set({ elem_classes: e }), we();
  }
  get visible() {
    return this.$$.ctx[5];
  }
  set visible(e) {
    this.$$set({ visible: e }), we();
  }
  get value() {
    return this.$$.ctx[0];
  }
  set value(e) {
    this.$$set({ value: e }), we();
  }
  get placeholder() {
    return this.$$.ctx[6];
  }
  set placeholder(e) {
    this.$$set({ placeholder: e }), we();
  }
  get show_label() {
    return this.$$.ctx[7];
  }
  set show_label(e) {
    this.$$set({ show_label: e }), we();
  }
  get scale() {
    return this.$$.ctx[8];
  }
  set scale(e) {
    this.$$set({ scale: e }), we();
  }
  get min_width() {
    return this.$$.ctx[9];
  }
  set min_width(e) {
    this.$$set({ min_width: e }), we();
  }
  get loading_status() {
    return this.$$.ctx[10];
  }
  set loading_status(e) {
    this.$$set({ loading_status: e }), we();
  }
  get value_is_output() {
    return this.$$.ctx[21];
  }
  set value_is_output(e) {
    this.$$set({ value_is_output: e }), we();
  }
  get interactive() {
    return this.$$.ctx[11];
  }
  set interactive(e) {
    this.$$set({ interactive: e }), we();
  }
  get rtl() {
    return this.$$.ctx[12];
  }
  set rtl(e) {
    this.$$set({ rtl: e }), we();
  }
}
export {
  Xa as default
};
