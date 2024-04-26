const io = "finalize", so = "consider";
function Ht(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(io, {
      detail: { items: e, info: t }
    })
  );
}
function Et(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(so, {
      detail: { items: e, info: t }
    })
  );
}
const el = "draggedEntered", cn = "draggedLeft", tl = "draggedOverIndex", Ll = "draggedLeftDocument", Zn = {
  LEFT_FOR_ANOTHER: "leftForAnother",
  OUTSIDE_OF_ANY: "outsideOfAny"
};
function oo(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(el, {
      detail: { indexObj: e, draggedEl: t }
    })
  );
}
function ro(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(cn, {
      detail: { draggedEl: e, type: Zn.LEFT_FOR_ANOTHER, theOtherDz: t }
    })
  );
}
function ao(n, e) {
  n.dispatchEvent(
    new CustomEvent(cn, {
      detail: { draggedEl: e, type: Zn.OUTSIDE_OF_ANY }
    })
  );
}
function fo(n, e, t) {
  n.dispatchEvent(
    new CustomEvent(tl, {
      detail: { indexObj: e, draggedEl: t }
    })
  );
}
function uo(n) {
  window.dispatchEvent(
    new CustomEvent(Ll, {
      detail: { draggedEl: n }
    })
  );
}
const we = {
  DRAG_STARTED: "dragStarted",
  DRAGGED_ENTERED: el,
  DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
  DRAGGED_OVER_INDEX: tl,
  DRAGGED_LEFT: cn,
  DRAGGED_LEFT_ALL: "draggedLeftAll",
  DROPPED_INTO_ZONE: "droppedIntoZone",
  DROPPED_INTO_ANOTHER: "droppedIntoAnother",
  DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
  DRAG_STOPPED: "dragStopped"
}, ve = {
  POINTER: "pointer",
  KEYBOARD: "keyboard"
}, nl = "isDndShadowItem", Ml = "data-is-dnd-shadow-item-internal", _o = "data-is-dnd-shadow-item-hint", co = "id:dnd-shadow-placeholder-0000", mo = "dnd-action-dragged-el";
let _e = "id", hl = 0;
function as() {
  hl++;
}
function fs() {
  if (hl === 0)
    throw new Error("Bug! trying to decrement when there are no dropzones");
  hl--;
}
const Fl = typeof window > "u";
function bl(n) {
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
    const f = l.transformOrigin, u = t.x - a - (1 - s) * parseFloat(f), c = t.y - o - (1 - r) * parseFloat(f.slice(f.indexOf(" ") + 1)), d = s ? t.width / s : n.offsetWidth, m = r ? t.height / r : n.offsetHeight;
    return {
      x: u,
      y: c,
      width: d,
      height: m,
      top: c,
      right: u + d,
      bottom: c + m,
      left: u
    };
  } else
    return t;
}
function us(n) {
  const e = bl(n);
  return {
    top: e.top + window.scrollY,
    bottom: e.bottom + window.scrollY,
    left: e.left + window.scrollX,
    right: e.right + window.scrollX
  };
}
function _s(n) {
  const e = n.getBoundingClientRect();
  return {
    top: e.top + window.scrollY,
    bottom: e.bottom + window.scrollY,
    left: e.left + window.scrollX,
    right: e.right + window.scrollX
  };
}
function cs(n) {
  return {
    x: (n.left + n.right) / 2,
    y: (n.top + n.bottom) / 2
  };
}
function go(n, e) {
  return Math.sqrt(Math.pow(n.x - e.x, 2) + Math.pow(n.y - e.y, 2));
}
function ll(n, e) {
  return n.y <= e.bottom && n.y >= e.top && n.x >= e.left && n.x <= e.right;
}
function fn(n) {
  return cs(_s(n));
}
function Wl(n, e) {
  const t = fn(n), l = us(e);
  return ll(t, l);
}
function ho(n, e) {
  const t = fn(n), l = fn(e);
  return go(t, l);
}
function bo(n) {
  const e = _s(n);
  return e.right < 0 || e.left > document.documentElement.scrollWidth || e.bottom < 0 || e.top > document.documentElement.scrollHeight;
}
let Gt;
function Pl() {
  Gt = /* @__PURE__ */ new Map();
}
Pl();
function po(n) {
  const e = Array.from(n.children).findIndex((t) => t.getAttribute(Ml));
  if (e >= 0)
    return Gt.has(n) || Gt.set(n, /* @__PURE__ */ new Map()), Gt.get(n).set(e, us(n.children[e])), e;
}
function wo(n, e) {
  if (!Wl(n, e))
    return null;
  const t = e.children;
  if (t.length === 0)
    return { index: 0, isProximityBased: !0 };
  const l = po(e);
  for (let r = 0; r < t.length; r++)
    if (Wl(n, t[r])) {
      const a = Gt.has(e) && Gt.get(e).get(r);
      return a && !ll(fn(n), a) ? { index: l, isProximityBased: !1 } : { index: r, isProximityBased: !1 };
    }
  let i = Number.MAX_VALUE, s;
  for (let r = 0; r < t.length; r++) {
    const a = ho(n, t[r]);
    a < i && (i = a, s = r);
  }
  return { index: s, isProximityBased: !0 };
}
function bn(n) {
  return JSON.stringify(n, null, 2);
}
function zn(n) {
  if (!n)
    throw new Error("cannot get depth of a falsy node");
  return ds(n, 0);
}
function ds(n, e = 0) {
  return n.parentElement ? ds(n.parentElement, e + 1) : e - 1;
}
function vo(n, e) {
  if (Object.keys(n).length !== Object.keys(e).length)
    return !1;
  for (const t in n)
    if (!{}.hasOwnProperty.call(e, t) || e[t] !== n[t])
      return !1;
  return !0;
}
function yo(n, e) {
  if (n.length !== e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] !== e[t])
      return !1;
  return !0;
}
const ko = 200, Yl = 10;
let pl;
function Eo(n, e, t = ko, l) {
  let i, s, r = !1, a;
  const o = Array.from(e).sort((u, c) => zn(c) - zn(u));
  function f() {
    const u = fn(n), c = l.multiScrollIfNeeded();
    if (!c && a && Math.abs(a.x - u.x) < Yl && Math.abs(a.y - u.y) < Yl) {
      pl = window.setTimeout(f, t);
      return;
    }
    if (bo(n)) {
      uo(n);
      return;
    }
    a = u;
    let d = !1;
    for (const m of o) {
      c && Pl();
      const p = wo(n, m);
      if (p === null)
        continue;
      const { index: T } = p;
      d = !0, m !== i ? (i && ro(i, n, m), oo(m, p, n), i = m) : T !== s && (fo(m, p, n), s = T);
      break;
    }
    !d && r && i ? (ao(i, n), i = void 0, s = void 0, r = !1) : r = !0, pl = window.setTimeout(f, t);
  }
  f();
}
function Do() {
  clearTimeout(pl), Pl();
}
const tn = 30;
function To() {
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
    return tn - s;
  }
  function i(s, r) {
    if (!r)
      return !1;
    const a = Co(s, r);
    if (a === null)
      return e(), !1;
    const o = !!n.directionObj;
    let [f, u] = [!1, !1];
    return r.scrollHeight > r.clientHeight && (a.bottom < tn ? (f = !0, n.directionObj = { x: 0, y: 1 }, n.stepPx = l(a.bottom)) : a.top < tn && (f = !0, n.directionObj = { x: 0, y: -1 }, n.stepPx = l(a.top)), !o && f) || r.scrollWidth > r.clientWidth && (a.right < tn ? (u = !0, n.directionObj = { x: 1, y: 0 }, n.stepPx = l(a.right)) : a.left < tn && (u = !0, n.directionObj = { x: -1, y: 0 }, n.stepPx = l(a.left)), !o && u) ? (t(r), !0) : (e(), !1);
  }
  return {
    scrollIfNeeded: i,
    resetScrolling: e
  };
}
function Co(n, e) {
  const t = e === document.scrollingElement ? {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth
  } : e.getBoundingClientRect();
  return ll(n, t) ? {
    top: n.y - t.top,
    bottom: t.bottom - n.y,
    left: n.x - t.left,
    right: t.right - n.x
  } : null;
}
function Oo(n = [], e) {
  const t = So(n), l = Array.from(t).sort((r, a) => zn(a) - zn(r)), { scrollIfNeeded: i } = To();
  function s() {
    const r = e();
    if (!r || !l)
      return !1;
    const a = l.filter(
      (o) => ll(r, o.getBoundingClientRect()) || o === document.scrollingElement
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
function Io(n) {
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
function So(n) {
  const e = /* @__PURE__ */ new Set();
  for (let t of n)
    Io(t).forEach((l) => e.add(l));
  return (document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight || document.scrollingElement.scrollWidth > document.scrollingElement.clientHeight) && e.add(document.scrollingElement), e;
}
function Ao(n) {
  const e = n.cloneNode(!0), t = [], l = n.tagName === "SELECT", i = l ? [n] : [...n.querySelectorAll("select")];
  for (const a of i)
    t.push(a.value);
  if (i.length > 0) {
    const a = l ? [e] : [...e.querySelectorAll("select")];
    for (let o = 0; o < a.length; o++) {
      const f = a[o], u = t[o], c = f.querySelector(`option[value="${u}"`);
      c && c.setAttribute("selected", !0);
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
const un = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
}), No = {
  [un.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT]: !1
};
function ms(n) {
  if (!un[n])
    throw new Error(`Can't get non existing feature flag ${n}! Supported flags: ${Object.keys(un)}`);
  return No[n];
}
const Ro = 0.2;
function Ct(n) {
  return `${n} ${Ro}s ease`;
}
function Lo(n, e) {
  const t = n.getBoundingClientRect(), l = Ao(n);
  gs(n, l), l.id = mo, l.style.position = "fixed";
  let i = t.top, s = t.left;
  if (l.style.top = `${i}px`, l.style.left = `${s}px`, e) {
    const r = cs(t);
    i -= r.y - e.y, s -= r.x - e.x, window.setTimeout(() => {
      l.style.top = `${i}px`, l.style.left = `${s}px`;
    }, 0);
  }
  return l.style.margin = "0", l.style.boxSizing = "border-box", l.style.height = `${t.height}px`, l.style.width = `${t.width}px`, l.style.transition = `${Ct("top")}, ${Ct("left")}, ${Ct("background-color")}, ${Ct("opacity")}, ${Ct("color")} `, window.setTimeout(() => l.style.transition += `, ${Ct("width")}, ${Ct("height")}`, 0), l.style.zIndex = "9999", l.style.cursor = "grabbing", l;
}
function Mo(n) {
  n.style.cursor = "grab";
}
function Fo(n, e, t, l) {
  gs(e, n);
  const i = e.getBoundingClientRect(), s = n.getBoundingClientRect(), r = i.width - s.width, a = i.height - s.height;
  if (r || a) {
    const o = {
      left: (t - s.left) / s.width,
      top: (l - s.top) / s.height
    };
    ms(un.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) || (n.style.height = `${i.height}px`, n.style.width = `${i.width}px`), n.style.left = `${parseFloat(n.style.left) - o.left * r}px`, n.style.top = `${parseFloat(n.style.top) - o.top * a}px`;
  }
}
function gs(n, e) {
  const t = window.getComputedStyle(n);
  Array.from(t).filter(
    (l) => l.startsWith("background") || l.startsWith("padding") || l.startsWith("font") || l.startsWith("text") || l.startsWith("align") || l.startsWith("justify") || l.startsWith("display") || l.startsWith("flex") || l.startsWith("border") || l === "opacity" || l === "color" || l === "list-style-type" || // copying with and height to make up for rect update timing issues in some browsers
    ms(un.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT) && (l === "width" || l === "height")
  ).forEach((l) => e.style.setProperty(l, t.getPropertyValue(l), t.getPropertyPriority(l)));
}
function Po(n, e) {
  n.draggable = !1, n.ondragstart = () => !1, e ? (n.style.userSelect = "", n.style.WebkitUserSelect = "", n.style.cursor = "") : (n.style.userSelect = "none", n.style.WebkitUserSelect = "none", n.style.cursor = "grab");
}
function hs(n) {
  n.style.display = "none", n.style.position = "fixed", n.style.zIndex = "-5";
}
function qo(n) {
  n.style.visibility = "hidden", n.setAttribute(Ml, "true");
}
function Zo(n) {
  n.style.visibility = "", n.removeAttribute(Ml);
}
function Dn(n, e = () => {
}, t = () => []) {
  n.forEach((l) => {
    const i = e(l);
    Object.keys(i).forEach((s) => {
      l.style[s] = i[s];
    }), t(l).forEach((s) => l.classList.add(s));
  });
}
function Vn(n, e = () => {
}, t = () => []) {
  n.forEach((l) => {
    const i = e(l);
    Object.keys(i).forEach((s) => {
      l.style[s] = "";
    }), t(l).forEach((s) => l.classList.contains(s) && l.classList.remove(s));
  });
}
function zo(n) {
  const e = n.style.minHeight;
  n.style.minHeight = window.getComputedStyle(n).getPropertyValue("height");
  const t = n.style.minWidth;
  return n.style.minWidth = window.getComputedStyle(n).getPropertyValue("width"), function() {
    n.style.minHeight = e, n.style.minWidth = t;
  };
}
const Vo = "--any--", Bo = 100, Go = 20, Kl = 3, Xl = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
}, Jl = "data-is-dnd-original-dragged-item";
let tt, ge, Ce, il, x, sl, kt, he, pt, Re, St = !1, ql = !1, Zl, dn = !1, Tn = [];
const Xe = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map(), al = /* @__PURE__ */ new WeakMap();
function jo(n, e) {
  Xe.has(e) || Xe.set(e, /* @__PURE__ */ new Set()), Xe.get(e).has(n) || (Xe.get(e).add(n), as());
}
function Ql(n, e) {
  Xe.get(e).delete(n), fs(), Xe.get(e).size === 0 && Xe.delete(e);
}
function Uo() {
  const n = Xe.get(il);
  for (const i of n)
    i.addEventListener(el, bs), i.addEventListener(cn, ps), i.addEventListener(tl, ws);
  window.addEventListener(Ll, Wt);
  const e = Math.max(...Array.from(n.keys()).map((i) => ae.get(i).dropAnimationDurationMs)), t = e === 0 ? Go : Math.max(e, Bo), l = Oo(n, () => Re);
  Eo(ge, n, t * 1.07, l);
}
function Ho() {
  const n = Xe.get(il);
  for (const e of n)
    e.removeEventListener(el, bs), e.removeEventListener(cn, ps), e.removeEventListener(tl, ws);
  window.removeEventListener(Ll, Wt), Do();
}
function ol(n) {
  return n.findIndex((e) => !!e[nl]);
}
function Wo(n) {
  return { ...n, [nl]: !0, [_e]: co };
}
function bs(n) {
  let { items: e, dropFromOthersDisabled: t } = ae.get(n.currentTarget);
  if (t && n.currentTarget !== x)
    return;
  if (dn = !1, e = e.filter((r) => r[_e] !== kt[_e]), x !== n.currentTarget) {
    const a = ae.get(x).items.filter((o) => !o[nl]);
    Et(x, a, {
      trigger: we.DRAGGED_ENTERED_ANOTHER,
      id: Ce[_e],
      source: ve.POINTER
    });
  }
  const { index: l, isProximityBased: i } = n.detail.indexObj, s = i && l === n.currentTarget.children.length - 1 ? l + 1 : l;
  he = n.currentTarget, e.splice(s, 0, kt), Et(n.currentTarget, e, { trigger: we.DRAGGED_ENTERED, id: Ce[_e], source: ve.POINTER });
}
function ps(n) {
  if (!St)
    return;
  const { items: e, dropFromOthersDisabled: t } = ae.get(n.currentTarget);
  if (t && n.currentTarget !== x && n.currentTarget !== he)
    return;
  const l = [...e], i = ol(l);
  i !== -1 && l.splice(i, 1);
  const s = he;
  he = void 0;
  const { type: r, theOtherDz: a } = n.detail;
  if (r === Zn.OUTSIDE_OF_ANY || r === Zn.LEFT_FOR_ANOTHER && a !== x && ae.get(a).dropFromOthersDisabled) {
    dn = !0, he = x;
    const o = s === x ? l : [...ae.get(x).items];
    o.splice(sl, 0, kt), Et(x, o, {
      trigger: we.DRAGGED_LEFT_ALL,
      id: Ce[_e],
      source: ve.POINTER
    });
  }
  Et(n.currentTarget, l, {
    trigger: we.DRAGGED_LEFT,
    id: Ce[_e],
    source: ve.POINTER
  });
}
function ws(n) {
  const { items: e, dropFromOthersDisabled: t } = ae.get(n.currentTarget);
  if (t && n.currentTarget !== x)
    return;
  const l = [...e];
  dn = !1;
  const { index: i } = n.detail.indexObj, s = ol(l);
  s !== -1 && l.splice(s, 1), l.splice(i, 0, kt), Et(n.currentTarget, l, { trigger: we.DRAGGED_OVER_INDEX, id: Ce[_e], source: ve.POINTER });
}
function Bn(n) {
  n.preventDefault();
  const e = n.touches ? n.touches[0] : n;
  Re = { x: e.clientX, y: e.clientY }, ge.style.transform = `translate3d(${Re.x - pt.x}px, ${Re.y - pt.y}px, 0)`;
}
function Wt() {
  ql = !0, window.removeEventListener("mousemove", Bn), window.removeEventListener("touchmove", Bn), window.removeEventListener("mouseup", Wt), window.removeEventListener("touchend", Wt), Ho(), Mo(ge), he || (he = x);
  let { items: n, type: e } = ae.get(he);
  Vn(
    Xe.get(e),
    (i) => ae.get(i).dropTargetStyle,
    (i) => ae.get(i).dropTargetClasses
  );
  let t = ol(n);
  t === -1 && he === x && (t = sl), n = n.map((i) => i[nl] ? Ce : i);
  function l() {
    Zl(), Ht(he, n, {
      trigger: dn ? we.DROPPED_OUTSIDE_OF_ANY : we.DROPPED_INTO_ZONE,
      id: Ce[_e],
      source: ve.POINTER
    }), he !== x && Ht(x, ae.get(x).items, {
      trigger: we.DROPPED_INTO_ANOTHER,
      id: Ce[_e],
      source: ve.POINTER
    }), t !== -1 && Zo(he.children[t]), Xo();
  }
  Yo(t, l);
}
function Yo(n, e) {
  const t = n > -1 ? bl(he.children[n]) : bl(he), l = {
    x: t.left - parseFloat(ge.style.left),
    y: t.top - parseFloat(ge.style.top)
  }, { dropAnimationDurationMs: i } = ae.get(he), s = `transform ${i}ms ease`;
  ge.style.transition = ge.style.transition ? ge.style.transition + "," + s : s, ge.style.transform = `translate3d(${l.x}px, ${l.y}px, 0)`, window.setTimeout(e, i);
}
function Ko(n, e) {
  Tn.push({ dz: n, destroy: e }), window.requestAnimationFrame(() => {
    hs(n), document.body.appendChild(n);
  });
}
function Xo() {
  ge.remove(), tt.remove(), Tn.length && (Tn.forEach(({ dz: n, destroy: e }) => {
    e(), n.remove();
  }), Tn = []), ge = void 0, tt = void 0, Ce = void 0, il = void 0, x = void 0, sl = void 0, kt = void 0, he = void 0, pt = void 0, Re = void 0, St = !1, ql = !1, Zl = void 0, dn = !1;
}
function Jo(n, e) {
  let t = !1;
  const l = {
    items: void 0,
    type: void 0,
    flipDurationMs: 0,
    dragDisabled: !1,
    morphDisabled: !1,
    dropFromOthersDisabled: !1,
    dropTargetStyle: Xl,
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
  function a(d) {
    r(), tt = void 0, pt = void 0, Re = void 0, d.type === "touchend" && d.target.click();
  }
  function o(d) {
    d.preventDefault();
    const m = d.touches ? d.touches[0] : d;
    Re = { x: m.clientX, y: m.clientY }, (Math.abs(Re.x - pt.x) >= Kl || Math.abs(Re.y - pt.y) >= Kl) && (r(), u());
  }
  function f(d) {
    if (d.target !== d.currentTarget && (d.target.value !== void 0 || d.target.isContentEditable) || d.button || St)
      return;
    d.preventDefault(), d.stopPropagation();
    const m = d.touches ? d.touches[0] : d;
    pt = { x: m.clientX, y: m.clientY }, Re = { ...pt }, tt = d.currentTarget, s();
  }
  function u() {
    St = !0;
    const d = i.get(tt);
    sl = d, x = tt.parentElement;
    const m = x.closest("dialog") || x.getRootNode(), p = m.body || m, { items: T, type: k, centreDraggedOnCursor: y } = l, h = [...T];
    Ce = h[d], il = k, kt = Wo(Ce), ge = Lo(tt, y && Re), tt.setAttribute(Jl, !0);
    function _() {
      ge.parentElement ? window.requestAnimationFrame(_) : (p.appendChild(ge), ge.focus(), Uo(), hs(tt), p.appendChild(tt), kt[_e] = Ce[_e]);
    }
    window.requestAnimationFrame(_), Dn(
      Array.from(Xe.get(l.type)).filter((w) => w === x || !ae.get(w).dropFromOthersDisabled),
      (w) => ae.get(w).dropTargetStyle,
      (w) => ae.get(w).dropTargetClasses
    ), h.splice(d, 1, kt), Zl = zo(x), Et(x, h, { trigger: we.DRAG_STARTED, id: Ce[_e], source: ve.POINTER }), window.addEventListener("mousemove", Bn, { passive: !1 }), window.addEventListener("touchmove", Bn, { passive: !1, capture: !1 }), window.addEventListener("mouseup", Wt, { passive: !1 }), window.addEventListener("touchend", Wt, { passive: !1 });
  }
  function c({
    items: d = void 0,
    flipDurationMs: m = 0,
    type: p = Vo,
    dragDisabled: T = !1,
    morphDisabled: k = !1,
    dropFromOthersDisabled: y = !1,
    dropTargetStyle: h = Xl,
    dropTargetClasses: _ = [],
    transformDraggedElement: w = () => {
    },
    centreDraggedOnCursor: S = !1
  }) {
    l.dropAnimationDurationMs = m, l.type && p !== l.type && Ql(n, l.type), l.type = p, l.items = [...d], l.dragDisabled = T, l.morphDisabled = k, l.transformDraggedElement = w, l.centreDraggedOnCursor = S, t && St && !ql && (!vo(h, l.dropTargetStyle) || !yo(_, l.dropTargetClasses)) && (Vn(
      [n],
      () => l.dropTargetStyle,
      () => _
    ), Dn(
      [n],
      () => h,
      () => _
    )), l.dropTargetStyle = h, l.dropTargetClasses = [..._];
    function b(A, v) {
      return ae.get(A) ? ae.get(A)[v] : l[v];
    }
    t && St && l.dropFromOthersDisabled !== y && (y ? Vn(
      [n],
      (A) => b(A, "dropTargetStyle"),
      (A) => b(A, "dropTargetClasses")
    ) : Dn(
      [n],
      (A) => b(A, "dropTargetStyle"),
      (A) => b(A, "dropTargetClasses")
    )), l.dropFromOthersDisabled = y, ae.set(n, l), jo(n, p);
    const B = ol(l.items);
    for (let A = 0; A < n.children.length; A++) {
      const v = n.children[A];
      if (Po(v, T), A === B) {
        l.transformDraggedElement(ge, Ce, A), k || Fo(ge, v, Re.x, Re.y), qo(v);
        continue;
      }
      v.removeEventListener("mousedown", al.get(v)), v.removeEventListener("touchstart", al.get(v)), T || (v.addEventListener("mousedown", f), v.addEventListener("touchstart", f), al.set(v, f)), i.set(v, A), t || (t = !0);
    }
  }
  return c(e), {
    update: (d) => {
      c(d);
    },
    destroy: () => {
      function d() {
        Ql(n, ae.get(n).type), ae.delete(n);
      }
      St && !n.closest(`[${Jl}]`) ? Ko(n, d) : d();
    }
  };
}
const wl = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
}, vs = {
  [wl.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
  [wl.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
}, Qo = "dnd-action-aria-alert";
let oe;
function vl() {
  oe || (oe = document.createElement("div"), function() {
    oe.id = Qo, oe.style.position = "fixed", oe.style.bottom = "0", oe.style.left = "0", oe.style.zIndex = "-5", oe.style.opacity = "0", oe.style.height = "0", oe.style.width = "0", oe.setAttribute("role", "alert");
  }(), document.body.prepend(oe), Object.entries(vs).forEach(([n, e]) => document.body.prepend(er(n, e))));
}
function xo() {
  return Fl ? null : (document.readyState === "complete" ? vl() : window.addEventListener("DOMContentLoaded", vl), { ...wl });
}
function $o() {
  Fl || !oe || (Object.keys(vs).forEach((n) => {
    var e;
    return (e = document.getElementById(n)) == null ? void 0 : e.remove();
  }), oe.remove(), oe = void 0);
}
function er(n, e) {
  const t = document.createElement("div");
  return t.id = n, t.innerHTML = `<p>${e}</p>`, t.style.display = "none", t.style.position = "fixed", t.style.zIndex = "-5", t;
}
function jt(n) {
  if (Fl)
    return;
  oe || vl(), oe.innerHTML = "";
  const e = document.createTextNode(n);
  oe.appendChild(e), oe.style.display = "none", oe.style.display = "inline";
}
const tr = "--any--", xl = {
  outline: "rgba(255, 255, 102, 0.7) solid 2px"
};
let Me = !1, yl, be, Rt = "", It, nt, wt = "";
const Gn = /* @__PURE__ */ new WeakSet(), $l = /* @__PURE__ */ new WeakMap(), ei = /* @__PURE__ */ new WeakMap(), kl = /* @__PURE__ */ new Map(), me = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map();
let jn;
function nr(n, e) {
  Ke.size === 0 && (jn = xo(), window.addEventListener("keydown", ys), window.addEventListener("click", ks)), Ke.has(e) || Ke.set(e, /* @__PURE__ */ new Set()), Ke.get(e).has(n) || (Ke.get(e).add(n), as());
}
function ti(n, e) {
  be === n && _n(), Ke.get(e).delete(n), fs(), Ke.get(e).size === 0 && Ke.delete(e), Ke.size === 0 && (window.removeEventListener("keydown", ys), window.removeEventListener("click", ks), jn = void 0, $o());
}
function ys(n) {
  if (Me)
    switch (n.key) {
      case "Escape": {
        _n();
        break;
      }
    }
}
function ks() {
  Me && (Gn.has(document.activeElement) || _n());
}
function lr(n) {
  if (!Me)
    return;
  const e = n.currentTarget;
  if (e === be)
    return;
  Rt = e.getAttribute("aria-label") || "";
  const { items: t } = me.get(be), l = t.find((f) => f[_e] === nt), i = t.indexOf(l), s = t.splice(i, 1)[0], { items: r, autoAriaDisabled: a } = me.get(e);
  e.getBoundingClientRect().top < be.getBoundingClientRect().top || e.getBoundingClientRect().left < be.getBoundingClientRect().left ? (r.push(s), a || jt(`Moved item ${wt} to the end of the list ${Rt}`)) : (r.unshift(s), a || jt(`Moved item ${wt} to the beginning of the list ${Rt}`)), Ht(be, t, { trigger: we.DROPPED_INTO_ANOTHER, id: nt, source: ve.KEYBOARD }), Ht(e, r, { trigger: we.DROPPED_INTO_ZONE, id: nt, source: ve.KEYBOARD }), be = e;
}
function Es() {
  kl.forEach(({ update: n }, e) => n(me.get(e)));
}
function _n(n = !0) {
  me.get(be).autoAriaDisabled || jt(`Stopped dragging item ${wt}`), Gn.has(document.activeElement) && document.activeElement.blur(), n && Et(be, me.get(be).items, {
    trigger: we.DRAG_STOPPED,
    id: nt,
    source: ve.KEYBOARD
  }), Vn(
    Ke.get(yl),
    (e) => me.get(e).dropTargetStyle,
    (e) => me.get(e).dropTargetClasses
  ), It = null, nt = null, wt = "", yl = null, be = null, Rt = "", Me = !1, Es();
}
function ir(n, e) {
  const t = {
    items: void 0,
    type: void 0,
    dragDisabled: !1,
    zoneTabIndex: 0,
    zoneItemTabIndex: 0,
    dropFromOthersDisabled: !1,
    dropTargetStyle: xl,
    dropTargetClasses: [],
    autoAriaDisabled: !1
  };
  function l(u, c, d) {
    u.length <= 1 || u.splice(d, 1, u.splice(c, 1, u[d])[0]);
  }
  function i(u) {
    switch (u.key) {
      case "Enter":
      case " ": {
        if ((u.target.disabled !== void 0 || u.target.href || u.target.isContentEditable) && !Gn.has(u.target))
          return;
        u.preventDefault(), u.stopPropagation(), Me ? _n() : s(u);
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        if (!Me)
          return;
        u.preventDefault(), u.stopPropagation();
        const { items: c } = me.get(n), d = Array.from(n.children), m = d.indexOf(u.currentTarget);
        m < d.length - 1 && (t.autoAriaDisabled || jt(`Moved item ${wt} to position ${m + 2} in the list ${Rt}`), l(c, m, m + 1), Ht(n, c, { trigger: we.DROPPED_INTO_ZONE, id: nt, source: ve.KEYBOARD }));
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        if (!Me)
          return;
        u.preventDefault(), u.stopPropagation();
        const { items: c } = me.get(n), m = Array.from(n.children).indexOf(u.currentTarget);
        m > 0 && (t.autoAriaDisabled || jt(`Moved item ${wt} to position ${m} in the list ${Rt}`), l(c, m, m - 1), Ht(n, c, { trigger: we.DROPPED_INTO_ZONE, id: nt, source: ve.KEYBOARD }));
        break;
      }
    }
  }
  function s(u) {
    a(u.currentTarget), be = n, yl = t.type, Me = !0;
    const c = Array.from(Ke.get(t.type)).filter((d) => d === be || !me.get(d).dropFromOthersDisabled);
    if (Dn(
      c,
      (d) => me.get(d).dropTargetStyle,
      (d) => me.get(d).dropTargetClasses
    ), !t.autoAriaDisabled) {
      let d = `Started dragging item ${wt}. Use the arrow keys to move it within its list ${Rt}`;
      c.length > 1 && (d += ", or tab to another list in order to move the item into it"), jt(d);
    }
    Et(n, me.get(n).items, { trigger: we.DRAG_STARTED, id: nt, source: ve.KEYBOARD }), Es();
  }
  function r(u) {
    Me && u.currentTarget !== It && (u.stopPropagation(), _n(!1), s(u));
  }
  function a(u) {
    const { items: c } = me.get(n), d = Array.from(n.children), m = d.indexOf(u);
    It = u, It.tabIndex = t.zoneItemTabIndex, nt = c[m][_e], wt = d[m].getAttribute("aria-label") || "";
  }
  function o({
    items: u = [],
    type: c = tr,
    dragDisabled: d = !1,
    zoneTabIndex: m = 0,
    zoneItemTabIndex: p = 0,
    dropFromOthersDisabled: T = !1,
    dropTargetStyle: k = xl,
    dropTargetClasses: y = [],
    autoAriaDisabled: h = !1
  }) {
    t.items = [...u], t.dragDisabled = d, t.dropFromOthersDisabled = T, t.zoneTabIndex = m, t.zoneItemTabIndex = p, t.dropTargetStyle = k, t.dropTargetClasses = y, t.autoAriaDisabled = h, t.type && c !== t.type && ti(n, t.type), t.type = c, nr(n, c), h || (n.setAttribute("aria-disabled", d), n.setAttribute("role", "list"), n.setAttribute("aria-describedby", d ? jn.DND_ZONE_DRAG_DISABLED : jn.DND_ZONE_ACTIVE)), me.set(n, t), Me ? n.tabIndex = n === be || It.contains(n) || t.dropFromOthersDisabled || be && t.type !== me.get(be).type ? -1 : 0 : n.tabIndex = t.zoneTabIndex, n.addEventListener("focus", lr);
    for (let _ = 0; _ < n.children.length; _++) {
      const w = n.children[_];
      Gn.add(w), w.tabIndex = Me ? -1 : t.zoneItemTabIndex, h || w.setAttribute("role", "listitem"), w.removeEventListener("keydown", $l.get(w)), w.removeEventListener("click", ei.get(w)), d || (w.addEventListener("keydown", i), $l.set(w, i), w.addEventListener("click", r), ei.set(w, r)), Me && t.items[_][_e] === nt && (It = w, It.tabIndex = t.zoneItemTabIndex, w.focus());
    }
  }
  o(e);
  const f = {
    update: (u) => {
      o(u);
    },
    destroy: () => {
      ti(n, t.type), me.delete(n), kl.delete(n);
    }
  };
  return kl.set(n, f), f;
}
function Ds(n, e) {
  if (sr(n))
    return {
      update: () => {
      },
      destroy: () => {
      }
    };
  ni(e);
  const t = Jo(n, e), l = ir(n, e);
  return {
    update: (i) => {
      ni(i), t.update(i), l.update(i);
    },
    destroy: () => {
      t.destroy(), l.destroy();
    }
  };
}
function sr(n) {
  return !!n.closest(`[${_o}="true"]`);
}
function ni(n) {
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
    transformDraggedElement: c,
    autoAriaDisabled: d,
    centreDraggedOnCursor: m,
    ...p
  } = n;
  if (Object.keys(p).length > 0 && console.warn("dndzone will ignore unknown options", p), !e)
    throw new Error("no 'items' key provided to dndzone");
  const T = e.find((k) => !{}.hasOwnProperty.call(k, _e));
  if (T)
    throw new Error(`missing '${_e}' property for item ${bn(T)}`);
  if (u && !Array.isArray(u))
    throw new Error(`dropTargetClasses should be an array but instead it is a ${typeof u}, ${bn(u)}`);
  if (a && !li(a))
    throw new Error(`zoneTabIndex should be a number but instead it is a ${typeof a}, ${bn(a)}`);
  if (o && !li(o))
    throw new Error(`zoneItemTabIndex should be a number but instead it is a ${typeof o}, ${bn(o)}`);
}
function li(n) {
  return !isNaN(n) && function(e) {
    return (e | 0) === e;
  }(parseFloat(n));
}
function Cn() {
}
const or = (n) => n;
function rr(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
const Ts = typeof window < "u";
let ii = Ts ? () => window.performance.now() : () => Date.now(), Cs = Ts ? (n) => requestAnimationFrame(n) : Cn;
const Ut = /* @__PURE__ */ new Set();
function Os(n) {
  Ut.forEach((e) => {
    e.c(n) || (Ut.delete(e), e.f());
  }), Ut.size !== 0 && Cs(Os);
}
function ar(n) {
  let e;
  return Ut.size === 0 && Cs(Os), {
    promise: new Promise((t) => {
      Ut.add(e = { c: n, f: t });
    }),
    abort() {
      Ut.delete(e);
    }
  };
}
function fr(n, { delay: e = 0, duration: t = 400, easing: l = or } = {}) {
  const i = +getComputedStyle(n).opacity;
  return {
    delay: e,
    duration: t,
    easing: l,
    css: (s) => `opacity: ${s * i}`
  };
}
const Ft = [];
function ur(n, e = Cn) {
  let t;
  const l = /* @__PURE__ */ new Set();
  function i(a) {
    if (rr(n, a) && (n = a, t)) {
      const o = !Ft.length;
      for (const f of l)
        f[1](), Ft.push(f, n);
      if (o) {
        for (let f = 0; f < Ft.length; f += 2)
          Ft[f][0](Ft[f + 1]);
        Ft.length = 0;
      }
    }
  }
  function s(a) {
    i(a(n));
  }
  function r(a, o = Cn) {
    const f = [a, o];
    return l.add(f), l.size === 1 && (t = e(i, s) || Cn), a(n), () => {
      l.delete(f), l.size === 0 && t && (t(), t = null);
    };
  }
  return { set: i, update: s, subscribe: r };
}
function si(n) {
  return Object.prototype.toString.call(n) === "[object Date]";
}
function El(n, e, t, l) {
  if (typeof t == "number" || si(t)) {
    const i = l - t, s = (t - e) / (n.dt || 1 / 60), r = n.opts.stiffness * i, a = n.opts.damping * s, o = (r - a) * n.inv_mass, f = (s + o) * n.dt;
    return Math.abs(f) < n.opts.precision && Math.abs(i) < n.opts.precision ? l : (n.settled = !1, si(t) ? new Date(t.getTime() + f) : t + f);
  } else {
    if (Array.isArray(t))
      return t.map(
        (i, s) => El(n, e[s], t[s], l[s])
      );
    if (typeof t == "object") {
      const i = {};
      for (const s in t)
        i[s] = El(n, e[s], t[s], l[s]);
      return i;
    } else
      throw new Error(`Cannot spring ${typeof t} values`);
  }
}
function Un(n, e = {}) {
  const t = ur(n), { stiffness: l = 0.15, damping: i = 0.8, precision: s = 0.01 } = e;
  let r, a, o, f = n, u = n, c = 1, d = 0, m = !1;
  function p(k, y = {}) {
    u = k;
    const h = o = {};
    return n == null || y.hard || T.stiffness >= 1 && T.damping >= 1 ? (m = !0, r = ii(), f = k, t.set(n = u), Promise.resolve()) : (y.soft && (d = 1 / ((y.soft === !0 ? 0.5 : +y.soft) * 60), c = 0), a || (r = ii(), m = !1, a = ar((_) => {
      if (m)
        return m = !1, a = null, !1;
      c = Math.min(c + d, 1);
      const w = {
        inv_mass: c,
        opts: T,
        settled: !0,
        dt: (_ - r) * 60 / 1e3
      }, S = El(w, f, n, u);
      return r = _, f = n, t.set(n = S), w.settled && (a = null), !w.settled;
    })), new Promise((_) => {
      a.promise.then(() => {
        h === o && _();
      });
    }));
  }
  const T = {
    set: p,
    update: (k, y) => p(k(u, n), y),
    subscribe: t.subscribe,
    stiffness: l,
    damping: i,
    precision: s
  };
  return T;
}
const {
  SvelteComponent: _r,
  append: cr,
  attr: gt,
  detach: dr,
  init: mr,
  insert: gr,
  noop: fl,
  safe_not_equal: hr,
  svg_element: oi
} = window.__gradio__svelte__internal;
function br(n) {
  let e, t;
  return {
    c() {
      e = oi("svg"), t = oi("polyline"), gt(t, "points", "20 6 9 17 4 12"), gt(e, "xmlns", "http://www.w3.org/2000/svg"), gt(e, "viewBox", "2 0 20 20"), gt(e, "fill", "none"), gt(e, "stroke", "currentColor"), gt(e, "stroke-width", "3"), gt(e, "stroke-linecap", "round"), gt(e, "stroke-linejoin", "round");
    },
    m(l, i) {
      gr(l, e, i), cr(e, t);
    },
    p: fl,
    i: fl,
    o: fl,
    d(l) {
      l && dr(e);
    }
  };
}
class Is extends _r {
  constructor(e) {
    super(), mr(this, e, null, br, hr, {});
  }
}
const {
  SvelteComponent: pr,
  append: ri,
  attr: Ot,
  detach: wr,
  init: vr,
  insert: yr,
  noop: ul,
  safe_not_equal: kr,
  svg_element: _l
} = window.__gradio__svelte__internal;
function Er(n) {
  let e, t, l;
  return {
    c() {
      e = _l("svg"), t = _l("path"), l = _l("path"), Ot(t, "fill", "currentColor"), Ot(t, "d", "M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"), Ot(l, "fill", "currentColor"), Ot(l, "d", "M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"), Ot(e, "xmlns", "http://www.w3.org/2000/svg"), Ot(e, "viewBox", "0 0 33 33"), Ot(e, "color", "currentColor");
    },
    m(i, s) {
      yr(i, e, s), ri(e, t), ri(e, l);
    },
    p: ul,
    i: ul,
    o: ul,
    d(i) {
      i && wr(e);
    }
  };
}
class Ss extends pr {
  constructor(e) {
    super(), vr(this, e, null, Er, kr, {});
  }
}
const {
  SvelteComponent: Dr,
  append: ht,
  attr: ie,
  detach: Tr,
  init: Cr,
  insert: Or,
  noop: cl,
  safe_not_equal: Ir,
  svg_element: bt,
  text: Sr
} = window.__gradio__svelte__internal;
function Ar(n) {
  let e, t, l, i, s, r, a, o, f;
  return {
    c() {
      e = bt("svg"), t = bt("defs"), l = bt("style"), i = Sr(`.cls-1 {
				fill: none;
			}
		`), s = bt("rect"), r = bt("rect"), a = bt("path"), o = bt("rect"), f = bt("rect"), ie(s, "x", "12"), ie(s, "y", "12"), ie(s, "width", "2"), ie(s, "height", "12"), ie(r, "x", "18"), ie(r, "y", "12"), ie(r, "width", "2"), ie(r, "height", "12"), ie(a, "d", "M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"), ie(o, "x", "12"), ie(o, "y", "2"), ie(o, "width", "8"), ie(o, "height", "2"), ie(f, "id", "_Transparent_Rectangle_"), ie(f, "data-name", "<Transparent Rectangle>"), ie(f, "class", "cls-1"), ie(f, "width", "32"), ie(f, "height", "32"), ie(e, "id", "icon"), ie(e, "xmlns", "http://www.w3.org/2000/svg"), ie(e, "viewBox", "0 0 32 32");
    },
    m(u, c) {
      Or(u, e, c), ht(e, t), ht(t, l), ht(l, i), ht(e, s), ht(e, r), ht(e, a), ht(e, o), ht(e, f);
    },
    p: cl,
    i: cl,
    o: cl,
    d(u) {
      u && Tr(e);
    }
  };
}
class As extends Dr {
  constructor(e) {
    super(), Cr(this, e, null, Ar, Ir, {});
  }
}
const {
  SvelteComponent: Nr,
  assign: Rr,
  create_slot: Lr,
  detach: Mr,
  element: Fr,
  get_all_dirty_from_scope: Pr,
  get_slot_changes: qr,
  get_spread_update: Zr,
  init: zr,
  insert: Vr,
  safe_not_equal: Br,
  set_dynamic_element_data: ai,
  set_style: Ae,
  toggle_class: xe,
  transition_in: Ns,
  transition_out: Rs,
  update_slot_base: Gr
} = window.__gradio__svelte__internal;
function jr(n) {
  let e, t, l;
  const i = (
    /*#slots*/
    n[18].default
  ), s = Lr(
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
    a = Rr(a, r[o]);
  return {
    c() {
      e = Fr(
        /*tag*/
        n[14]
      ), s && s.c(), ai(
        /*tag*/
        n[14]
      )(e, a), xe(
        e,
        "hidden",
        /*visible*/
        n[10] === !1
      ), xe(
        e,
        "padded",
        /*padding*/
        n[6]
      ), xe(
        e,
        "border_focus",
        /*border_mode*/
        n[5] === "focus"
      ), xe(
        e,
        "border_contrast",
        /*border_mode*/
        n[5] === "contrast"
      ), xe(e, "hide-container", !/*explicit_call*/
      n[8] && !/*container*/
      n[9]), Ae(
        e,
        "height",
        /*get_dimension*/
        n[15](
          /*height*/
          n[0]
        )
      ), Ae(e, "width", typeof /*width*/
      n[1] == "number" ? `calc(min(${/*width*/
      n[1]}px, 100%))` : (
        /*get_dimension*/
        n[15](
          /*width*/
          n[1]
        )
      )), Ae(
        e,
        "border-style",
        /*variant*/
        n[4]
      ), Ae(
        e,
        "overflow",
        /*allow_overflow*/
        n[11] ? "visible" : "hidden"
      ), Ae(
        e,
        "flex-grow",
        /*scale*/
        n[12]
      ), Ae(e, "min-width", `calc(min(${/*min_width*/
      n[13]}px, 100%))`), Ae(e, "border-width", "var(--block-border-width)");
    },
    m(o, f) {
      Vr(o, e, f), s && s.m(e, null), l = !0;
    },
    p(o, f) {
      s && s.p && (!l || f & /*$$scope*/
      131072) && Gr(
        s,
        i,
        o,
        /*$$scope*/
        o[17],
        l ? qr(
          i,
          /*$$scope*/
          o[17],
          f,
          null
        ) : Pr(
          /*$$scope*/
          o[17]
        ),
        null
      ), ai(
        /*tag*/
        o[14]
      )(e, a = Zr(r, [
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
      ])), xe(
        e,
        "hidden",
        /*visible*/
        o[10] === !1
      ), xe(
        e,
        "padded",
        /*padding*/
        o[6]
      ), xe(
        e,
        "border_focus",
        /*border_mode*/
        o[5] === "focus"
      ), xe(
        e,
        "border_contrast",
        /*border_mode*/
        o[5] === "contrast"
      ), xe(e, "hide-container", !/*explicit_call*/
      o[8] && !/*container*/
      o[9]), f & /*height*/
      1 && Ae(
        e,
        "height",
        /*get_dimension*/
        o[15](
          /*height*/
          o[0]
        )
      ), f & /*width*/
      2 && Ae(e, "width", typeof /*width*/
      o[1] == "number" ? `calc(min(${/*width*/
      o[1]}px, 100%))` : (
        /*get_dimension*/
        o[15](
          /*width*/
          o[1]
        )
      )), f & /*variant*/
      16 && Ae(
        e,
        "border-style",
        /*variant*/
        o[4]
      ), f & /*allow_overflow*/
      2048 && Ae(
        e,
        "overflow",
        /*allow_overflow*/
        o[11] ? "visible" : "hidden"
      ), f & /*scale*/
      4096 && Ae(
        e,
        "flex-grow",
        /*scale*/
        o[12]
      ), f & /*min_width*/
      8192 && Ae(e, "min-width", `calc(min(${/*min_width*/
      o[13]}px, 100%))`);
    },
    i(o) {
      l || (Ns(s, o), l = !0);
    },
    o(o) {
      Rs(s, o), l = !1;
    },
    d(o) {
      o && Mr(e), s && s.d(o);
    }
  };
}
function Ur(n) {
  let e, t = (
    /*tag*/
    n[14] && jr(n)
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
      e || (Ns(t, l), e = !0);
    },
    o(l) {
      Rs(t, l), e = !1;
    },
    d(l) {
      t && t.d(l);
    }
  };
}
function Hr(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { height: s = void 0 } = e, { width: r = void 0 } = e, { elem_id: a = "" } = e, { elem_classes: o = [] } = e, { variant: f = "solid" } = e, { border_mode: u = "base" } = e, { padding: c = !0 } = e, { type: d = "normal" } = e, { test_id: m = void 0 } = e, { explicit_call: p = !1 } = e, { container: T = !0 } = e, { visible: k = !0 } = e, { allow_overflow: y = !0 } = e, { scale: h = null } = e, { min_width: _ = 0 } = e, w = d === "fieldset" ? "fieldset" : "div";
  const S = (b) => {
    if (b !== void 0) {
      if (typeof b == "number")
        return b + "px";
      if (typeof b == "string")
        return b;
    }
  };
  return n.$$set = (b) => {
    "height" in b && t(0, s = b.height), "width" in b && t(1, r = b.width), "elem_id" in b && t(2, a = b.elem_id), "elem_classes" in b && t(3, o = b.elem_classes), "variant" in b && t(4, f = b.variant), "border_mode" in b && t(5, u = b.border_mode), "padding" in b && t(6, c = b.padding), "type" in b && t(16, d = b.type), "test_id" in b && t(7, m = b.test_id), "explicit_call" in b && t(8, p = b.explicit_call), "container" in b && t(9, T = b.container), "visible" in b && t(10, k = b.visible), "allow_overflow" in b && t(11, y = b.allow_overflow), "scale" in b && t(12, h = b.scale), "min_width" in b && t(13, _ = b.min_width), "$$scope" in b && t(17, i = b.$$scope);
  }, [
    s,
    r,
    a,
    o,
    f,
    u,
    c,
    m,
    p,
    T,
    k,
    y,
    h,
    _,
    w,
    S,
    d,
    i,
    l
  ];
}
let Wr = class extends Nr {
  constructor(e) {
    super(), zr(this, e, Hr, Ur, Br, {
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
};
const {
  SvelteComponent: Yr,
  attr: Kr,
  create_slot: Xr,
  detach: Jr,
  element: Qr,
  get_all_dirty_from_scope: xr,
  get_slot_changes: $r,
  init: ea,
  insert: ta,
  safe_not_equal: na,
  transition_in: la,
  transition_out: ia,
  update_slot_base: sa
} = window.__gradio__svelte__internal;
function oa(n) {
  let e, t;
  const l = (
    /*#slots*/
    n[1].default
  ), i = Xr(
    l,
    n,
    /*$$scope*/
    n[0],
    null
  );
  return {
    c() {
      e = Qr("div"), i && i.c(), Kr(e, "class", "svelte-1hnfib2");
    },
    m(s, r) {
      ta(s, e, r), i && i.m(e, null), t = !0;
    },
    p(s, [r]) {
      i && i.p && (!t || r & /*$$scope*/
      1) && sa(
        i,
        l,
        s,
        /*$$scope*/
        s[0],
        t ? $r(
          l,
          /*$$scope*/
          s[0],
          r,
          null
        ) : xr(
          /*$$scope*/
          s[0]
        ),
        null
      );
    },
    i(s) {
      t || (la(i, s), t = !0);
    },
    o(s) {
      ia(i, s), t = !1;
    },
    d(s) {
      s && Jr(e), i && i.d(s);
    }
  };
}
function ra(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e;
  return n.$$set = (s) => {
    "$$scope" in s && t(0, i = s.$$scope);
  }, [i, l];
}
let aa = class extends Yr {
  constructor(e) {
    super(), ea(this, e, ra, oa, na, {});
  }
};
const {
  SvelteComponent: fa,
  attr: fi,
  check_outros: ua,
  create_component: _a,
  create_slot: ca,
  destroy_component: da,
  detach: On,
  element: ma,
  empty: ga,
  get_all_dirty_from_scope: ha,
  get_slot_changes: ba,
  group_outros: pa,
  init: wa,
  insert: In,
  mount_component: va,
  safe_not_equal: ya,
  set_data: ka,
  space: Ea,
  text: Da,
  toggle_class: Pt,
  transition_in: sn,
  transition_out: Sn,
  update_slot_base: Ta
} = window.__gradio__svelte__internal;
function ui(n) {
  let e, t;
  return e = new aa({
    props: {
      $$slots: { default: [Ca] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      _a(e.$$.fragment);
    },
    m(l, i) {
      va(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i & /*$$scope, info*/
      10 && (s.$$scope = { dirty: i, ctx: l }), e.$set(s);
    },
    i(l) {
      t || (sn(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Sn(e.$$.fragment, l), t = !1;
    },
    d(l) {
      da(e, l);
    }
  };
}
function Ca(n) {
  let e;
  return {
    c() {
      e = Da(
        /*info*/
        n[1]
      );
    },
    m(t, l) {
      In(t, e, l);
    },
    p(t, l) {
      l & /*info*/
      2 && ka(
        e,
        /*info*/
        t[1]
      );
    },
    d(t) {
      t && On(e);
    }
  };
}
function Oa(n) {
  let e, t, l, i;
  const s = (
    /*#slots*/
    n[2].default
  ), r = ca(
    s,
    n,
    /*$$scope*/
    n[3],
    null
  );
  let a = (
    /*info*/
    n[1] && ui(n)
  );
  return {
    c() {
      e = ma("span"), r && r.c(), t = Ea(), a && a.c(), l = ga(), fi(e, "data-testid", "block-info"), fi(e, "class", "svelte-22c38v"), Pt(e, "sr-only", !/*show_label*/
      n[0]), Pt(e, "hide", !/*show_label*/
      n[0]), Pt(
        e,
        "has-info",
        /*info*/
        n[1] != null
      );
    },
    m(o, f) {
      In(o, e, f), r && r.m(e, null), In(o, t, f), a && a.m(o, f), In(o, l, f), i = !0;
    },
    p(o, [f]) {
      r && r.p && (!i || f & /*$$scope*/
      8) && Ta(
        r,
        s,
        o,
        /*$$scope*/
        o[3],
        i ? ba(
          s,
          /*$$scope*/
          o[3],
          f,
          null
        ) : ha(
          /*$$scope*/
          o[3]
        ),
        null
      ), (!i || f & /*show_label*/
      1) && Pt(e, "sr-only", !/*show_label*/
      o[0]), (!i || f & /*show_label*/
      1) && Pt(e, "hide", !/*show_label*/
      o[0]), (!i || f & /*info*/
      2) && Pt(
        e,
        "has-info",
        /*info*/
        o[1] != null
      ), /*info*/
      o[1] ? a ? (a.p(o, f), f & /*info*/
      2 && sn(a, 1)) : (a = ui(o), a.c(), sn(a, 1), a.m(l.parentNode, l)) : a && (pa(), Sn(a, 1, 1, () => {
        a = null;
      }), ua());
    },
    i(o) {
      i || (sn(r, o), sn(a), i = !0);
    },
    o(o) {
      Sn(r, o), Sn(a), i = !1;
    },
    d(o) {
      o && (On(e), On(t), On(l)), r && r.d(o), a && a.d(o);
    }
  };
}
function Ia(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { show_label: s = !0 } = e, { info: r = void 0 } = e;
  return n.$$set = (a) => {
    "show_label" in a && t(0, s = a.show_label), "info" in a && t(1, r = a.info), "$$scope" in a && t(3, i = a.$$scope);
  }, [s, r, l, i];
}
let Ls = class extends fa {
  constructor(e) {
    super(), wa(this, e, Ia, Oa, ya, { show_label: 0, info: 1 });
  }
};
const Sa = [
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
], _i = {
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
Sa.reduce(
  (n, { color: e, primary: t, secondary: l }) => ({
    ...n,
    [e]: {
      primary: _i[e][t],
      secondary: _i[e][l]
    }
  }),
  {}
);
function zt(n) {
  let e = ["", "k", "M", "G", "T", "P", "E", "Z"], t = 0;
  for (; n > 1e3 && t < e.length - 1; )
    n /= 1e3, t++;
  let l = e[t];
  return (Number.isInteger(n) ? n : n.toFixed(1)) + l;
}
const {
  SvelteComponent: Aa,
  append: Ue,
  attr: U,
  component_subscribe: ci,
  detach: Na,
  element: Ra,
  init: La,
  insert: Ma,
  noop: di,
  safe_not_equal: Fa,
  set_style: pn,
  svg_element: He,
  toggle_class: mi
} = window.__gradio__svelte__internal, { onMount: Pa } = window.__gradio__svelte__internal;
function qa(n) {
  let e, t, l, i, s, r, a, o, f, u, c, d;
  return {
    c() {
      e = Ra("div"), t = He("svg"), l = He("g"), i = He("path"), s = He("path"), r = He("path"), a = He("path"), o = He("g"), f = He("path"), u = He("path"), c = He("path"), d = He("path"), U(i, "d", "M255.926 0.754768L509.702 139.936V221.027L255.926 81.8465V0.754768Z"), U(i, "fill", "#FF7C00"), U(i, "fill-opacity", "0.4"), U(i, "class", "svelte-43sxxs"), U(s, "d", "M509.69 139.936L254.981 279.641V361.255L509.69 221.55V139.936Z"), U(s, "fill", "#FF7C00"), U(s, "class", "svelte-43sxxs"), U(r, "d", "M0.250138 139.937L254.981 279.641V361.255L0.250138 221.55V139.937Z"), U(r, "fill", "#FF7C00"), U(r, "fill-opacity", "0.4"), U(r, "class", "svelte-43sxxs"), U(a, "d", "M255.923 0.232622L0.236328 139.936V221.55L255.923 81.8469V0.232622Z"), U(a, "fill", "#FF7C00"), U(a, "class", "svelte-43sxxs"), pn(l, "transform", "translate(" + /*$top*/
      n[1][0] + "px, " + /*$top*/
      n[1][1] + "px)"), U(f, "d", "M255.926 141.5L509.702 280.681V361.773L255.926 222.592V141.5Z"), U(f, "fill", "#FF7C00"), U(f, "fill-opacity", "0.4"), U(f, "class", "svelte-43sxxs"), U(u, "d", "M509.69 280.679L254.981 420.384V501.998L509.69 362.293V280.679Z"), U(u, "fill", "#FF7C00"), U(u, "class", "svelte-43sxxs"), U(c, "d", "M0.250138 280.681L254.981 420.386V502L0.250138 362.295V280.681Z"), U(c, "fill", "#FF7C00"), U(c, "fill-opacity", "0.4"), U(c, "class", "svelte-43sxxs"), U(d, "d", "M255.923 140.977L0.236328 280.68V362.294L255.923 222.591V140.977Z"), U(d, "fill", "#FF7C00"), U(d, "class", "svelte-43sxxs"), pn(o, "transform", "translate(" + /*$bottom*/
      n[2][0] + "px, " + /*$bottom*/
      n[2][1] + "px)"), U(t, "viewBox", "-1200 -1200 3000 3000"), U(t, "fill", "none"), U(t, "xmlns", "http://www.w3.org/2000/svg"), U(t, "class", "svelte-43sxxs"), U(e, "class", "svelte-43sxxs"), mi(
        e,
        "margin",
        /*margin*/
        n[0]
      );
    },
    m(m, p) {
      Ma(m, e, p), Ue(e, t), Ue(t, l), Ue(l, i), Ue(l, s), Ue(l, r), Ue(l, a), Ue(t, o), Ue(o, f), Ue(o, u), Ue(o, c), Ue(o, d);
    },
    p(m, [p]) {
      p & /*$top*/
      2 && pn(l, "transform", "translate(" + /*$top*/
      m[1][0] + "px, " + /*$top*/
      m[1][1] + "px)"), p & /*$bottom*/
      4 && pn(o, "transform", "translate(" + /*$bottom*/
      m[2][0] + "px, " + /*$bottom*/
      m[2][1] + "px)"), p & /*margin*/
      1 && mi(
        e,
        "margin",
        /*margin*/
        m[0]
      );
    },
    i: di,
    o: di,
    d(m) {
      m && Na(e);
    }
  };
}
function Za(n, e, t) {
  let l, i, { margin: s = !0 } = e;
  const r = Un([0, 0]);
  ci(n, r, (d) => t(1, l = d));
  const a = Un([0, 0]);
  ci(n, a, (d) => t(2, i = d));
  let o;
  async function f() {
    await Promise.all([r.set([125, 140]), a.set([-125, -140])]), await Promise.all([r.set([-125, 140]), a.set([125, -140])]), await Promise.all([r.set([-125, 0]), a.set([125, -0])]), await Promise.all([r.set([125, 0]), a.set([-125, 0])]);
  }
  async function u() {
    await f(), o || u();
  }
  async function c() {
    await Promise.all([r.set([125, 0]), a.set([-125, 0])]), u();
  }
  return Pa(() => (c(), () => o = !0)), n.$$set = (d) => {
    "margin" in d && t(0, s = d.margin);
  }, [s, l, i, r, a];
}
let za = class extends Aa {
  constructor(e) {
    super(), La(this, e, Za, qa, Fa, { margin: 0 });
  }
};
const {
  SvelteComponent: Va,
  append: At,
  attr: lt,
  binding_callbacks: gi,
  check_outros: Ms,
  create_component: Ba,
  create_slot: Ga,
  destroy_component: ja,
  destroy_each: Fs,
  detach: q,
  element: ut,
  empty: Qt,
  ensure_array_like: Hn,
  get_all_dirty_from_scope: Ua,
  get_slot_changes: Ha,
  group_outros: Ps,
  init: Wa,
  insert: Z,
  mount_component: Ya,
  noop: Dl,
  safe_not_equal: Ka,
  set_data: ze,
  set_style: vt,
  space: it,
  text: $,
  toggle_class: Fe,
  transition_in: Yt,
  transition_out: Kt,
  update_slot_base: Xa
} = window.__gradio__svelte__internal, { tick: Ja } = window.__gradio__svelte__internal, { onDestroy: Qa } = window.__gradio__svelte__internal, xa = (n) => ({}), hi = (n) => ({});
function bi(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l[40] = t, l;
}
function pi(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l;
}
function $a(n) {
  let e, t = (
    /*i18n*/
    n[1]("common.error") + ""
  ), l, i, s;
  const r = (
    /*#slots*/
    n[29].error
  ), a = Ga(
    r,
    n,
    /*$$scope*/
    n[28],
    hi
  );
  return {
    c() {
      e = ut("span"), l = $(t), i = it(), a && a.c(), lt(e, "class", "error svelte-1yserjw");
    },
    m(o, f) {
      Z(o, e, f), At(e, l), Z(o, i, f), a && a.m(o, f), s = !0;
    },
    p(o, f) {
      (!s || f[0] & /*i18n*/
      2) && t !== (t = /*i18n*/
      o[1]("common.error") + "") && ze(l, t), a && a.p && (!s || f[0] & /*$$scope*/
      268435456) && Xa(
        a,
        r,
        o,
        /*$$scope*/
        o[28],
        s ? Ha(
          r,
          /*$$scope*/
          o[28],
          f,
          xa
        ) : Ua(
          /*$$scope*/
          o[28]
        ),
        hi
      );
    },
    i(o) {
      s || (Yt(a, o), s = !0);
    },
    o(o) {
      Kt(a, o), s = !1;
    },
    d(o) {
      o && (q(e), q(i)), a && a.d(o);
    }
  };
}
function ef(n) {
  let e, t, l, i, s, r, a, o, f, u = (
    /*variant*/
    n[8] === "default" && /*show_eta_bar*/
    n[18] && /*show_progress*/
    n[6] === "full" && wi(n)
  );
  function c(_, w) {
    if (
      /*progress*/
      _[7]
    )
      return lf;
    if (
      /*queue_position*/
      _[2] !== null && /*queue_size*/
      _[3] !== void 0 && /*queue_position*/
      _[2] >= 0
    )
      return nf;
    if (
      /*queue_position*/
      _[2] === 0
    )
      return tf;
  }
  let d = c(n), m = d && d(n), p = (
    /*timer*/
    n[5] && ki(n)
  );
  const T = [af, rf], k = [];
  function y(_, w) {
    return (
      /*last_progress_level*/
      _[15] != null ? 0 : (
        /*show_progress*/
        _[6] === "full" ? 1 : -1
      )
    );
  }
  ~(s = y(n)) && (r = k[s] = T[s](n));
  let h = !/*timer*/
  n[5] && Si(n);
  return {
    c() {
      u && u.c(), e = it(), t = ut("div"), m && m.c(), l = it(), p && p.c(), i = it(), r && r.c(), a = it(), h && h.c(), o = Qt(), lt(t, "class", "progress-text svelte-1yserjw"), Fe(
        t,
        "meta-text-center",
        /*variant*/
        n[8] === "center"
      ), Fe(
        t,
        "meta-text",
        /*variant*/
        n[8] === "default"
      );
    },
    m(_, w) {
      u && u.m(_, w), Z(_, e, w), Z(_, t, w), m && m.m(t, null), At(t, l), p && p.m(t, null), Z(_, i, w), ~s && k[s].m(_, w), Z(_, a, w), h && h.m(_, w), Z(_, o, w), f = !0;
    },
    p(_, w) {
      /*variant*/
      _[8] === "default" && /*show_eta_bar*/
      _[18] && /*show_progress*/
      _[6] === "full" ? u ? u.p(_, w) : (u = wi(_), u.c(), u.m(e.parentNode, e)) : u && (u.d(1), u = null), d === (d = c(_)) && m ? m.p(_, w) : (m && m.d(1), m = d && d(_), m && (m.c(), m.m(t, l))), /*timer*/
      _[5] ? p ? p.p(_, w) : (p = ki(_), p.c(), p.m(t, null)) : p && (p.d(1), p = null), (!f || w[0] & /*variant*/
      256) && Fe(
        t,
        "meta-text-center",
        /*variant*/
        _[8] === "center"
      ), (!f || w[0] & /*variant*/
      256) && Fe(
        t,
        "meta-text",
        /*variant*/
        _[8] === "default"
      );
      let S = s;
      s = y(_), s === S ? ~s && k[s].p(_, w) : (r && (Ps(), Kt(k[S], 1, 1, () => {
        k[S] = null;
      }), Ms()), ~s ? (r = k[s], r ? r.p(_, w) : (r = k[s] = T[s](_), r.c()), Yt(r, 1), r.m(a.parentNode, a)) : r = null), /*timer*/
      _[5] ? h && (h.d(1), h = null) : h ? h.p(_, w) : (h = Si(_), h.c(), h.m(o.parentNode, o));
    },
    i(_) {
      f || (Yt(r), f = !0);
    },
    o(_) {
      Kt(r), f = !1;
    },
    d(_) {
      _ && (q(e), q(t), q(i), q(a), q(o)), u && u.d(_), m && m.d(), p && p.d(), ~s && k[s].d(_), h && h.d(_);
    }
  };
}
function wi(n) {
  let e, t = `translateX(${/*eta_level*/
  (n[17] || 0) * 100 - 100}%)`;
  return {
    c() {
      e = ut("div"), lt(e, "class", "eta-bar svelte-1yserjw"), vt(e, "transform", t);
    },
    m(l, i) {
      Z(l, e, i);
    },
    p(l, i) {
      i[0] & /*eta_level*/
      131072 && t !== (t = `translateX(${/*eta_level*/
      (l[17] || 0) * 100 - 100}%)`) && vt(e, "transform", t);
    },
    d(l) {
      l && q(e);
    }
  };
}
function tf(n) {
  let e;
  return {
    c() {
      e = $("processing |");
    },
    m(t, l) {
      Z(t, e, l);
    },
    p: Dl,
    d(t) {
      t && q(e);
    }
  };
}
function nf(n) {
  let e, t = (
    /*queue_position*/
    n[2] + 1 + ""
  ), l, i, s, r;
  return {
    c() {
      e = $("queue: "), l = $(t), i = $("/"), s = $(
        /*queue_size*/
        n[3]
      ), r = $(" |");
    },
    m(a, o) {
      Z(a, e, o), Z(a, l, o), Z(a, i, o), Z(a, s, o), Z(a, r, o);
    },
    p(a, o) {
      o[0] & /*queue_position*/
      4 && t !== (t = /*queue_position*/
      a[2] + 1 + "") && ze(l, t), o[0] & /*queue_size*/
      8 && ze(
        s,
        /*queue_size*/
        a[3]
      );
    },
    d(a) {
      a && (q(e), q(l), q(i), q(s), q(r));
    }
  };
}
function lf(n) {
  let e, t = Hn(
    /*progress*/
    n[7]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = yi(pi(n, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = Qt();
    },
    m(i, s) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, s);
      Z(i, e, s);
    },
    p(i, s) {
      if (s[0] & /*progress*/
      128) {
        t = Hn(
          /*progress*/
          i[7]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = pi(i, t, r);
          l[r] ? l[r].p(a, s) : (l[r] = yi(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && q(e), Fs(l, i);
    }
  };
}
function vi(n) {
  let e, t = (
    /*p*/
    n[38].unit + ""
  ), l, i, s = " ", r;
  function a(u, c) {
    return (
      /*p*/
      u[38].length != null ? of : sf
    );
  }
  let o = a(n), f = o(n);
  return {
    c() {
      f.c(), e = it(), l = $(t), i = $(" | "), r = $(s);
    },
    m(u, c) {
      f.m(u, c), Z(u, e, c), Z(u, l, c), Z(u, i, c), Z(u, r, c);
    },
    p(u, c) {
      o === (o = a(u)) && f ? f.p(u, c) : (f.d(1), f = o(u), f && (f.c(), f.m(e.parentNode, e))), c[0] & /*progress*/
      128 && t !== (t = /*p*/
      u[38].unit + "") && ze(l, t);
    },
    d(u) {
      u && (q(e), q(l), q(i), q(r)), f.d(u);
    }
  };
}
function sf(n) {
  let e = zt(
    /*p*/
    n[38].index || 0
  ) + "", t;
  return {
    c() {
      t = $(e);
    },
    m(l, i) {
      Z(l, t, i);
    },
    p(l, i) {
      i[0] & /*progress*/
      128 && e !== (e = zt(
        /*p*/
        l[38].index || 0
      ) + "") && ze(t, e);
    },
    d(l) {
      l && q(t);
    }
  };
}
function of(n) {
  let e = zt(
    /*p*/
    n[38].index || 0
  ) + "", t, l, i = zt(
    /*p*/
    n[38].length
  ) + "", s;
  return {
    c() {
      t = $(e), l = $("/"), s = $(i);
    },
    m(r, a) {
      Z(r, t, a), Z(r, l, a), Z(r, s, a);
    },
    p(r, a) {
      a[0] & /*progress*/
      128 && e !== (e = zt(
        /*p*/
        r[38].index || 0
      ) + "") && ze(t, e), a[0] & /*progress*/
      128 && i !== (i = zt(
        /*p*/
        r[38].length
      ) + "") && ze(s, i);
    },
    d(r) {
      r && (q(t), q(l), q(s));
    }
  };
}
function yi(n) {
  let e, t = (
    /*p*/
    n[38].index != null && vi(n)
  );
  return {
    c() {
      t && t.c(), e = Qt();
    },
    m(l, i) {
      t && t.m(l, i), Z(l, e, i);
    },
    p(l, i) {
      /*p*/
      l[38].index != null ? t ? t.p(l, i) : (t = vi(l), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(l) {
      l && q(e), t && t.d(l);
    }
  };
}
function ki(n) {
  let e, t = (
    /*eta*/
    n[0] ? `/${/*formatted_eta*/
    n[19]}` : ""
  ), l, i;
  return {
    c() {
      e = $(
        /*formatted_timer*/
        n[20]
      ), l = $(t), i = $("s");
    },
    m(s, r) {
      Z(s, e, r), Z(s, l, r), Z(s, i, r);
    },
    p(s, r) {
      r[0] & /*formatted_timer*/
      1048576 && ze(
        e,
        /*formatted_timer*/
        s[20]
      ), r[0] & /*eta, formatted_eta*/
      524289 && t !== (t = /*eta*/
      s[0] ? `/${/*formatted_eta*/
      s[19]}` : "") && ze(l, t);
    },
    d(s) {
      s && (q(e), q(l), q(i));
    }
  };
}
function rf(n) {
  let e, t;
  return e = new za({
    props: { margin: (
      /*variant*/
      n[8] === "default"
    ) }
  }), {
    c() {
      Ba(e.$$.fragment);
    },
    m(l, i) {
      Ya(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i[0] & /*variant*/
      256 && (s.margin = /*variant*/
      l[8] === "default"), e.$set(s);
    },
    i(l) {
      t || (Yt(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Kt(e.$$.fragment, l), t = !1;
    },
    d(l) {
      ja(e, l);
    }
  };
}
function af(n) {
  let e, t, l, i, s, r = `${/*last_progress_level*/
  n[15] * 100}%`, a = (
    /*progress*/
    n[7] != null && Ei(n)
  );
  return {
    c() {
      e = ut("div"), t = ut("div"), a && a.c(), l = it(), i = ut("div"), s = ut("div"), lt(t, "class", "progress-level-inner svelte-1yserjw"), lt(s, "class", "progress-bar svelte-1yserjw"), vt(s, "width", r), lt(i, "class", "progress-bar-wrap svelte-1yserjw"), lt(e, "class", "progress-level svelte-1yserjw");
    },
    m(o, f) {
      Z(o, e, f), At(e, t), a && a.m(t, null), At(e, l), At(e, i), At(i, s), n[30](s);
    },
    p(o, f) {
      /*progress*/
      o[7] != null ? a ? a.p(o, f) : (a = Ei(o), a.c(), a.m(t, null)) : a && (a.d(1), a = null), f[0] & /*last_progress_level*/
      32768 && r !== (r = `${/*last_progress_level*/
      o[15] * 100}%`) && vt(s, "width", r);
    },
    i: Dl,
    o: Dl,
    d(o) {
      o && q(e), a && a.d(), n[30](null);
    }
  };
}
function Ei(n) {
  let e, t = Hn(
    /*progress*/
    n[7]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = Ii(bi(n, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = Qt();
    },
    m(i, s) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, s);
      Z(i, e, s);
    },
    p(i, s) {
      if (s[0] & /*progress_level, progress*/
      16512) {
        t = Hn(
          /*progress*/
          i[7]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = bi(i, t, r);
          l[r] ? l[r].p(a, s) : (l[r] = Ii(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && q(e), Fs(l, i);
    }
  };
}
function Di(n) {
  let e, t, l, i, s = (
    /*i*/
    n[40] !== 0 && ff()
  ), r = (
    /*p*/
    n[38].desc != null && Ti(n)
  ), a = (
    /*p*/
    n[38].desc != null && /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null && Ci()
  ), o = (
    /*progress_level*/
    n[14] != null && Oi(n)
  );
  return {
    c() {
      s && s.c(), e = it(), r && r.c(), t = it(), a && a.c(), l = it(), o && o.c(), i = Qt();
    },
    m(f, u) {
      s && s.m(f, u), Z(f, e, u), r && r.m(f, u), Z(f, t, u), a && a.m(f, u), Z(f, l, u), o && o.m(f, u), Z(f, i, u);
    },
    p(f, u) {
      /*p*/
      f[38].desc != null ? r ? r.p(f, u) : (r = Ti(f), r.c(), r.m(t.parentNode, t)) : r && (r.d(1), r = null), /*p*/
      f[38].desc != null && /*progress_level*/
      f[14] && /*progress_level*/
      f[14][
        /*i*/
        f[40]
      ] != null ? a || (a = Ci(), a.c(), a.m(l.parentNode, l)) : a && (a.d(1), a = null), /*progress_level*/
      f[14] != null ? o ? o.p(f, u) : (o = Oi(f), o.c(), o.m(i.parentNode, i)) : o && (o.d(1), o = null);
    },
    d(f) {
      f && (q(e), q(t), q(l), q(i)), s && s.d(f), r && r.d(f), a && a.d(f), o && o.d(f);
    }
  };
}
function ff(n) {
  let e;
  return {
    c() {
      e = $(" /");
    },
    m(t, l) {
      Z(t, e, l);
    },
    d(t) {
      t && q(e);
    }
  };
}
function Ti(n) {
  let e = (
    /*p*/
    n[38].desc + ""
  ), t;
  return {
    c() {
      t = $(e);
    },
    m(l, i) {
      Z(l, t, i);
    },
    p(l, i) {
      i[0] & /*progress*/
      128 && e !== (e = /*p*/
      l[38].desc + "") && ze(t, e);
    },
    d(l) {
      l && q(t);
    }
  };
}
function Ci(n) {
  let e;
  return {
    c() {
      e = $("-");
    },
    m(t, l) {
      Z(t, e, l);
    },
    d(t) {
      t && q(e);
    }
  };
}
function Oi(n) {
  let e = (100 * /*progress_level*/
  (n[14][
    /*i*/
    n[40]
  ] || 0)).toFixed(1) + "", t, l;
  return {
    c() {
      t = $(e), l = $("%");
    },
    m(i, s) {
      Z(i, t, s), Z(i, l, s);
    },
    p(i, s) {
      s[0] & /*progress_level*/
      16384 && e !== (e = (100 * /*progress_level*/
      (i[14][
        /*i*/
        i[40]
      ] || 0)).toFixed(1) + "") && ze(t, e);
    },
    d(i) {
      i && (q(t), q(l));
    }
  };
}
function Ii(n) {
  let e, t = (
    /*p*/
    (n[38].desc != null || /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null) && Di(n)
  );
  return {
    c() {
      t && t.c(), e = Qt();
    },
    m(l, i) {
      t && t.m(l, i), Z(l, e, i);
    },
    p(l, i) {
      /*p*/
      l[38].desc != null || /*progress_level*/
      l[14] && /*progress_level*/
      l[14][
        /*i*/
        l[40]
      ] != null ? t ? t.p(l, i) : (t = Di(l), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(l) {
      l && q(e), t && t.d(l);
    }
  };
}
function Si(n) {
  let e, t;
  return {
    c() {
      e = ut("p"), t = $(
        /*loading_text*/
        n[9]
      ), lt(e, "class", "loading svelte-1yserjw");
    },
    m(l, i) {
      Z(l, e, i), At(e, t);
    },
    p(l, i) {
      i[0] & /*loading_text*/
      512 && ze(
        t,
        /*loading_text*/
        l[9]
      );
    },
    d(l) {
      l && q(e);
    }
  };
}
function uf(n) {
  let e, t, l, i, s;
  const r = [ef, $a], a = [];
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
      e = ut("div"), l && l.c(), lt(e, "class", i = "wrap " + /*variant*/
      n[8] + " " + /*show_progress*/
      n[6] + " svelte-1yserjw"), Fe(e, "hide", !/*status*/
      n[4] || /*status*/
      n[4] === "complete" || /*show_progress*/
      n[6] === "hidden"), Fe(
        e,
        "translucent",
        /*variant*/
        n[8] === "center" && /*status*/
        (n[4] === "pending" || /*status*/
        n[4] === "error") || /*translucent*/
        n[11] || /*show_progress*/
        n[6] === "minimal"
      ), Fe(
        e,
        "generating",
        /*status*/
        n[4] === "generating"
      ), Fe(
        e,
        "border",
        /*border*/
        n[12]
      ), vt(
        e,
        "position",
        /*absolute*/
        n[10] ? "absolute" : "static"
      ), vt(
        e,
        "padding",
        /*absolute*/
        n[10] ? "0" : "var(--size-8) 0"
      );
    },
    m(f, u) {
      Z(f, e, u), ~t && a[t].m(e, null), n[31](e), s = !0;
    },
    p(f, u) {
      let c = t;
      t = o(f), t === c ? ~t && a[t].p(f, u) : (l && (Ps(), Kt(a[c], 1, 1, () => {
        a[c] = null;
      }), Ms()), ~t ? (l = a[t], l ? l.p(f, u) : (l = a[t] = r[t](f), l.c()), Yt(l, 1), l.m(e, null)) : l = null), (!s || u[0] & /*variant, show_progress*/
      320 && i !== (i = "wrap " + /*variant*/
      f[8] + " " + /*show_progress*/
      f[6] + " svelte-1yserjw")) && lt(e, "class", i), (!s || u[0] & /*variant, show_progress, status, show_progress*/
      336) && Fe(e, "hide", !/*status*/
      f[4] || /*status*/
      f[4] === "complete" || /*show_progress*/
      f[6] === "hidden"), (!s || u[0] & /*variant, show_progress, variant, status, translucent, show_progress*/
      2384) && Fe(
        e,
        "translucent",
        /*variant*/
        f[8] === "center" && /*status*/
        (f[4] === "pending" || /*status*/
        f[4] === "error") || /*translucent*/
        f[11] || /*show_progress*/
        f[6] === "minimal"
      ), (!s || u[0] & /*variant, show_progress, status*/
      336) && Fe(
        e,
        "generating",
        /*status*/
        f[4] === "generating"
      ), (!s || u[0] & /*variant, show_progress, border*/
      4416) && Fe(
        e,
        "border",
        /*border*/
        f[12]
      ), u[0] & /*absolute*/
      1024 && vt(
        e,
        "position",
        /*absolute*/
        f[10] ? "absolute" : "static"
      ), u[0] & /*absolute*/
      1024 && vt(
        e,
        "padding",
        /*absolute*/
        f[10] ? "0" : "var(--size-8) 0"
      );
    },
    i(f) {
      s || (Yt(l), s = !0);
    },
    o(f) {
      Kt(l), s = !1;
    },
    d(f) {
      f && q(e), ~t && a[t].d(), n[31](null);
    }
  };
}
let wn = [], dl = !1;
async function _f(n, e = !0) {
  if (!(window.__gradio_mode__ === "website" || window.__gradio_mode__ !== "app" && e !== !0)) {
    if (wn.push(n), !dl)
      dl = !0;
    else
      return;
    await Ja(), requestAnimationFrame(() => {
      let t = [0, 0];
      for (let l = 0; l < wn.length; l++) {
        const s = wn[l].getBoundingClientRect();
        (l === 0 || s.top + window.scrollY <= t[0]) && (t[0] = s.top + window.scrollY, t[1] = l);
      }
      window.scrollTo({ top: t[0] - 20, behavior: "smooth" }), dl = !1, wn = [];
    });
  }
}
function cf(n, e, t) {
  let l, { $$slots: i = {}, $$scope: s } = e, { i18n: r } = e, { eta: a = null } = e, { queue_position: o } = e, { queue_size: f } = e, { status: u } = e, { scroll_to_output: c = !1 } = e, { timer: d = !0 } = e, { show_progress: m = "full" } = e, { message: p = null } = e, { progress: T = null } = e, { variant: k = "default" } = e, { loading_text: y = "Loading..." } = e, { absolute: h = !0 } = e, { translucent: _ = !1 } = e, { border: w = !1 } = e, { autoscroll: S } = e, b, B = !1, A = 0, v = 0, C = null, L = null, J = 0, G = null, P, W = null, fe = !0;
  const I = () => {
    t(0, a = t(26, C = t(19, le = null))), t(24, A = performance.now()), t(25, v = 0), B = !0, ne();
  };
  function ne() {
    requestAnimationFrame(() => {
      t(25, v = (performance.now() - A) / 1e3), B && ne();
    });
  }
  function ce() {
    t(25, v = 0), t(0, a = t(26, C = t(19, le = null))), B && (B = !1);
  }
  Qa(() => {
    B && ce();
  });
  let le = null;
  function E(g) {
    gi[g ? "unshift" : "push"](() => {
      W = g, t(16, W), t(7, T), t(14, G), t(15, P);
    });
  }
  function F(g) {
    gi[g ? "unshift" : "push"](() => {
      b = g, t(13, b);
    });
  }
  return n.$$set = (g) => {
    "i18n" in g && t(1, r = g.i18n), "eta" in g && t(0, a = g.eta), "queue_position" in g && t(2, o = g.queue_position), "queue_size" in g && t(3, f = g.queue_size), "status" in g && t(4, u = g.status), "scroll_to_output" in g && t(21, c = g.scroll_to_output), "timer" in g && t(5, d = g.timer), "show_progress" in g && t(6, m = g.show_progress), "message" in g && t(22, p = g.message), "progress" in g && t(7, T = g.progress), "variant" in g && t(8, k = g.variant), "loading_text" in g && t(9, y = g.loading_text), "absolute" in g && t(10, h = g.absolute), "translucent" in g && t(11, _ = g.translucent), "border" in g && t(12, w = g.border), "autoscroll" in g && t(23, S = g.autoscroll), "$$scope" in g && t(28, s = g.$$scope);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*eta, old_eta, timer_start, eta_from_start*/
    218103809 && (a === null && t(0, a = C), a != null && C !== a && (t(27, L = (performance.now() - A) / 1e3 + a), t(19, le = L.toFixed(1)), t(26, C = a))), n.$$.dirty[0] & /*eta_from_start, timer_diff*/
    167772160 && t(17, J = L === null || L <= 0 || !v ? null : Math.min(v / L, 1)), n.$$.dirty[0] & /*progress*/
    128 && T != null && t(18, fe = !1), n.$$.dirty[0] & /*progress, progress_level, progress_bar, last_progress_level*/
    114816 && (T != null ? t(14, G = T.map((g) => {
      if (g.index != null && g.length != null)
        return g.index / g.length;
      if (g.progress != null)
        return g.progress;
    })) : t(14, G = null), G ? (t(15, P = G[G.length - 1]), W && (P === 0 ? t(16, W.style.transition = "0", W) : t(16, W.style.transition = "150ms", W))) : t(15, P = void 0)), n.$$.dirty[0] & /*status*/
    16 && (u === "pending" ? I() : ce()), n.$$.dirty[0] & /*el, scroll_to_output, status, autoscroll*/
    10493968 && b && c && (u === "pending" || u === "complete") && _f(b, S), n.$$.dirty[0] & /*status, message*/
    4194320, n.$$.dirty[0] & /*timer_diff*/
    33554432 && t(20, l = v.toFixed(1));
  }, [
    a,
    r,
    o,
    f,
    u,
    d,
    m,
    T,
    k,
    y,
    h,
    _,
    w,
    b,
    G,
    P,
    W,
    J,
    fe,
    le,
    l,
    c,
    p,
    S,
    A,
    v,
    C,
    L,
    s,
    i,
    E,
    F
  ];
}
let df = class extends Va {
  constructor(e) {
    super(), Wa(
      this,
      e,
      cf,
      uf,
      Ka,
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
};
new Intl.Collator(0, { numeric: 1 }).compare;
const {
  SvelteComponent: mf,
  append: qs,
  attr: Q,
  bubble: gf,
  check_outros: hf,
  create_slot: Zs,
  detach: mn,
  element: rl,
  empty: bf,
  get_all_dirty_from_scope: zs,
  get_slot_changes: Vs,
  group_outros: pf,
  init: wf,
  insert: gn,
  listen: vf,
  safe_not_equal: yf,
  set_style: Te,
  space: Bs,
  src_url_equal: Wn,
  toggle_class: Vt,
  transition_in: Yn,
  transition_out: Kn,
  update_slot_base: Gs
} = window.__gradio__svelte__internal;
function kf(n) {
  let e, t, l, i, s, r, a = (
    /*icon*/
    n[7] && Ai(n)
  );
  const o = (
    /*#slots*/
    n[12].default
  ), f = Zs(
    o,
    n,
    /*$$scope*/
    n[11],
    null
  );
  return {
    c() {
      e = rl("button"), a && a.c(), t = Bs(), f && f.c(), Q(e, "class", l = /*size*/
      n[4] + " " + /*variant*/
      n[3] + " " + /*elem_classes*/
      n[1].join(" ") + " svelte-8huxfn"), Q(
        e,
        "id",
        /*elem_id*/
        n[0]
      ), e.disabled = /*disabled*/
      n[8], Vt(e, "hidden", !/*visible*/
      n[2]), Te(
        e,
        "flex-grow",
        /*scale*/
        n[9]
      ), Te(
        e,
        "width",
        /*scale*/
        n[9] === 0 ? "fit-content" : null
      ), Te(e, "min-width", typeof /*min_width*/
      n[10] == "number" ? `calc(min(${/*min_width*/
      n[10]}px, 100%))` : null);
    },
    m(u, c) {
      gn(u, e, c), a && a.m(e, null), qs(e, t), f && f.m(e, null), i = !0, s || (r = vf(
        e,
        "click",
        /*click_handler*/
        n[13]
      ), s = !0);
    },
    p(u, c) {
      /*icon*/
      u[7] ? a ? a.p(u, c) : (a = Ai(u), a.c(), a.m(e, t)) : a && (a.d(1), a = null), f && f.p && (!i || c & /*$$scope*/
      2048) && Gs(
        f,
        o,
        u,
        /*$$scope*/
        u[11],
        i ? Vs(
          o,
          /*$$scope*/
          u[11],
          c,
          null
        ) : zs(
          /*$$scope*/
          u[11]
        ),
        null
      ), (!i || c & /*size, variant, elem_classes*/
      26 && l !== (l = /*size*/
      u[4] + " " + /*variant*/
      u[3] + " " + /*elem_classes*/
      u[1].join(" ") + " svelte-8huxfn")) && Q(e, "class", l), (!i || c & /*elem_id*/
      1) && Q(
        e,
        "id",
        /*elem_id*/
        u[0]
      ), (!i || c & /*disabled*/
      256) && (e.disabled = /*disabled*/
      u[8]), (!i || c & /*size, variant, elem_classes, visible*/
      30) && Vt(e, "hidden", !/*visible*/
      u[2]), c & /*scale*/
      512 && Te(
        e,
        "flex-grow",
        /*scale*/
        u[9]
      ), c & /*scale*/
      512 && Te(
        e,
        "width",
        /*scale*/
        u[9] === 0 ? "fit-content" : null
      ), c & /*min_width*/
      1024 && Te(e, "min-width", typeof /*min_width*/
      u[10] == "number" ? `calc(min(${/*min_width*/
      u[10]}px, 100%))` : null);
    },
    i(u) {
      i || (Yn(f, u), i = !0);
    },
    o(u) {
      Kn(f, u), i = !1;
    },
    d(u) {
      u && mn(e), a && a.d(), f && f.d(u), s = !1, r();
    }
  };
}
function Ef(n) {
  let e, t, l, i, s = (
    /*icon*/
    n[7] && Ni(n)
  );
  const r = (
    /*#slots*/
    n[12].default
  ), a = Zs(
    r,
    n,
    /*$$scope*/
    n[11],
    null
  );
  return {
    c() {
      e = rl("a"), s && s.c(), t = Bs(), a && a.c(), Q(
        e,
        "href",
        /*link*/
        n[6]
      ), Q(e, "rel", "noopener noreferrer"), Q(
        e,
        "aria-disabled",
        /*disabled*/
        n[8]
      ), Q(e, "class", l = /*size*/
      n[4] + " " + /*variant*/
      n[3] + " " + /*elem_classes*/
      n[1].join(" ") + " svelte-8huxfn"), Q(
        e,
        "id",
        /*elem_id*/
        n[0]
      ), Vt(e, "hidden", !/*visible*/
      n[2]), Vt(
        e,
        "disabled",
        /*disabled*/
        n[8]
      ), Te(
        e,
        "flex-grow",
        /*scale*/
        n[9]
      ), Te(
        e,
        "pointer-events",
        /*disabled*/
        n[8] ? "none" : null
      ), Te(
        e,
        "width",
        /*scale*/
        n[9] === 0 ? "fit-content" : null
      ), Te(e, "min-width", typeof /*min_width*/
      n[10] == "number" ? `calc(min(${/*min_width*/
      n[10]}px, 100%))` : null);
    },
    m(o, f) {
      gn(o, e, f), s && s.m(e, null), qs(e, t), a && a.m(e, null), i = !0;
    },
    p(o, f) {
      /*icon*/
      o[7] ? s ? s.p(o, f) : (s = Ni(o), s.c(), s.m(e, t)) : s && (s.d(1), s = null), a && a.p && (!i || f & /*$$scope*/
      2048) && Gs(
        a,
        r,
        o,
        /*$$scope*/
        o[11],
        i ? Vs(
          r,
          /*$$scope*/
          o[11],
          f,
          null
        ) : zs(
          /*$$scope*/
          o[11]
        ),
        null
      ), (!i || f & /*link*/
      64) && Q(
        e,
        "href",
        /*link*/
        o[6]
      ), (!i || f & /*disabled*/
      256) && Q(
        e,
        "aria-disabled",
        /*disabled*/
        o[8]
      ), (!i || f & /*size, variant, elem_classes*/
      26 && l !== (l = /*size*/
      o[4] + " " + /*variant*/
      o[3] + " " + /*elem_classes*/
      o[1].join(" ") + " svelte-8huxfn")) && Q(e, "class", l), (!i || f & /*elem_id*/
      1) && Q(
        e,
        "id",
        /*elem_id*/
        o[0]
      ), (!i || f & /*size, variant, elem_classes, visible*/
      30) && Vt(e, "hidden", !/*visible*/
      o[2]), (!i || f & /*size, variant, elem_classes, disabled*/
      282) && Vt(
        e,
        "disabled",
        /*disabled*/
        o[8]
      ), f & /*scale*/
      512 && Te(
        e,
        "flex-grow",
        /*scale*/
        o[9]
      ), f & /*disabled*/
      256 && Te(
        e,
        "pointer-events",
        /*disabled*/
        o[8] ? "none" : null
      ), f & /*scale*/
      512 && Te(
        e,
        "width",
        /*scale*/
        o[9] === 0 ? "fit-content" : null
      ), f & /*min_width*/
      1024 && Te(e, "min-width", typeof /*min_width*/
      o[10] == "number" ? `calc(min(${/*min_width*/
      o[10]}px, 100%))` : null);
    },
    i(o) {
      i || (Yn(a, o), i = !0);
    },
    o(o) {
      Kn(a, o), i = !1;
    },
    d(o) {
      o && mn(e), s && s.d(), a && a.d(o);
    }
  };
}
function Ai(n) {
  let e, t, l;
  return {
    c() {
      e = rl("img"), Q(e, "class", "button-icon svelte-8huxfn"), Wn(e.src, t = /*icon*/
      n[7].url) || Q(e, "src", t), Q(e, "alt", l = `${/*value*/
      n[5]} icon`);
    },
    m(i, s) {
      gn(i, e, s);
    },
    p(i, s) {
      s & /*icon*/
      128 && !Wn(e.src, t = /*icon*/
      i[7].url) && Q(e, "src", t), s & /*value*/
      32 && l !== (l = `${/*value*/
      i[5]} icon`) && Q(e, "alt", l);
    },
    d(i) {
      i && mn(e);
    }
  };
}
function Ni(n) {
  let e, t, l;
  return {
    c() {
      e = rl("img"), Q(e, "class", "button-icon svelte-8huxfn"), Wn(e.src, t = /*icon*/
      n[7].url) || Q(e, "src", t), Q(e, "alt", l = `${/*value*/
      n[5]} icon`);
    },
    m(i, s) {
      gn(i, e, s);
    },
    p(i, s) {
      s & /*icon*/
      128 && !Wn(e.src, t = /*icon*/
      i[7].url) && Q(e, "src", t), s & /*value*/
      32 && l !== (l = `${/*value*/
      i[5]} icon`) && Q(e, "alt", l);
    },
    d(i) {
      i && mn(e);
    }
  };
}
function Df(n) {
  let e, t, l, i;
  const s = [Ef, kf], r = [];
  function a(o, f) {
    return (
      /*link*/
      o[6] && /*link*/
      o[6].length > 0 ? 0 : 1
    );
  }
  return e = a(n), t = r[e] = s[e](n), {
    c() {
      t.c(), l = bf();
    },
    m(o, f) {
      r[e].m(o, f), gn(o, l, f), i = !0;
    },
    p(o, [f]) {
      let u = e;
      e = a(o), e === u ? r[e].p(o, f) : (pf(), Kn(r[u], 1, 1, () => {
        r[u] = null;
      }), hf(), t = r[e], t ? t.p(o, f) : (t = r[e] = s[e](o), t.c()), Yn(t, 1), t.m(l.parentNode, l));
    },
    i(o) {
      i || (Yn(t), i = !0);
    },
    o(o) {
      Kn(t), i = !1;
    },
    d(o) {
      o && mn(l), r[e].d(o);
    }
  };
}
function Tf(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { elem_id: s = "" } = e, { elem_classes: r = [] } = e, { visible: a = !0 } = e, { variant: o = "secondary" } = e, { size: f = "lg" } = e, { value: u = null } = e, { link: c = null } = e, { icon: d = null } = e, { disabled: m = !1 } = e, { scale: p = null } = e, { min_width: T = void 0 } = e;
  function k(y) {
    gf.call(this, n, y);
  }
  return n.$$set = (y) => {
    "elem_id" in y && t(0, s = y.elem_id), "elem_classes" in y && t(1, r = y.elem_classes), "visible" in y && t(2, a = y.visible), "variant" in y && t(3, o = y.variant), "size" in y && t(4, f = y.size), "value" in y && t(5, u = y.value), "link" in y && t(6, c = y.link), "icon" in y && t(7, d = y.icon), "disabled" in y && t(8, m = y.disabled), "scale" in y && t(9, p = y.scale), "min_width" in y && t(10, T = y.min_width), "$$scope" in y && t(11, i = y.$$scope);
  }, [
    s,
    r,
    a,
    o,
    f,
    u,
    c,
    d,
    m,
    p,
    T,
    i,
    l,
    k
  ];
}
class Xn extends mf {
  constructor(e) {
    super(), wf(this, e, Tf, Df, yf, {
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
  SvelteComponent: Cf,
  action_destroyer: Of,
  add_render_callback: If,
  append: Sf,
  attr: M,
  binding_callbacks: nn,
  bubble: $e,
  check_outros: zl,
  create_component: Vl,
  create_in_transition: Af,
  destroy_component: Bl,
  detach: Ve,
  element: Dt,
  empty: js,
  group_outros: Gl,
  init: Nf,
  insert: Be,
  is_function: Rf,
  listen: Y,
  mount_component: jl,
  noop: Jn,
  run_all: hn,
  safe_not_equal: Lf,
  set_data: Mf,
  set_input_value: at,
  space: Us,
  text: Ff,
  to_number: Hs,
  toggle_class: Ri,
  transition_in: rt,
  transition_out: dt
} = window.__gradio__svelte__internal, { beforeUpdate: Pf, afterUpdate: qf, createEventDispatcher: Zf, tick: Li } = window.__gradio__svelte__internal;
function zf(n) {
  let e;
  return {
    c() {
      e = Ff(
        /*label*/
        n[3]
      );
    },
    m(t, l) {
      Be(t, e, l);
    },
    p(t, l) {
      l[0] & /*label*/
      8 && Mf(
        e,
        /*label*/
        t[3]
      );
    },
    d(t) {
      t && Ve(e);
    }
  };
}
function Vf(n) {
  let e, t, l, i, s, r, a, o, f = (
    /*show_label*/
    n[6] && /*show_copy_button*/
    n[10] && Mi(n)
  );
  return {
    c() {
      f && f.c(), e = Us(), t = Dt("textarea"), M(t, "data-testid", "textbox"), M(t, "class", "scroll-hide svelte-9f62t7"), M(t, "dir", l = /*rtl*/
      n[11] ? "rtl" : "ltr"), M(
        t,
        "placeholder",
        /*placeholder*/
        n[2]
      ), M(
        t,
        "rows",
        /*lines*/
        n[1]
      ), t.disabled = /*disabled*/
      n[5], t.autofocus = /*autofocus*/
      n[12], M(t, "style", i = /*text_align*/
      n[13] ? "text-align: " + /*text_align*/
      n[13] : "");
    },
    m(u, c) {
      f && f.m(u, c), Be(u, e, c), Be(u, t, c), at(
        t,
        /*value*/
        n[0]
      ), n[42](t), r = !0, /*autofocus*/
      n[12] && t.focus(), a || (o = [
        Of(s = /*text_area_resize*/
        n[20].call(
          null,
          t,
          /*value*/
          n[0]
        )),
        Y(
          t,
          "input",
          /*textarea_input_handler*/
          n[41]
        ),
        Y(
          t,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        Y(
          t,
          "blur",
          /*blur_handler_4*/
          n[31]
        ),
        Y(
          t,
          "select",
          /*handle_select*/
          n[17]
        ),
        Y(
          t,
          "focus",
          /*focus_handler_4*/
          n[32]
        ),
        Y(
          t,
          "scroll",
          /*handle_scroll*/
          n[19]
        )
      ], a = !0);
    },
    p(u, c) {
      /*show_label*/
      u[6] && /*show_copy_button*/
      u[10] ? f ? (f.p(u, c), c[0] & /*show_label, show_copy_button*/
      1088 && rt(f, 1)) : (f = Mi(u), f.c(), rt(f, 1), f.m(e.parentNode, e)) : f && (Gl(), dt(f, 1, 1, () => {
        f = null;
      }), zl()), (!r || c[0] & /*rtl*/
      2048 && l !== (l = /*rtl*/
      u[11] ? "rtl" : "ltr")) && M(t, "dir", l), (!r || c[0] & /*placeholder*/
      4) && M(
        t,
        "placeholder",
        /*placeholder*/
        u[2]
      ), (!r || c[0] & /*lines*/
      2) && M(
        t,
        "rows",
        /*lines*/
        u[1]
      ), (!r || c[0] & /*disabled*/
      32) && (t.disabled = /*disabled*/
      u[5]), (!r || c[0] & /*autofocus*/
      4096) && (t.autofocus = /*autofocus*/
      u[12]), (!r || c[0] & /*text_align*/
      8192 && i !== (i = /*text_align*/
      u[13] ? "text-align: " + /*text_align*/
      u[13] : "")) && M(t, "style", i), s && Rf(s.update) && c[0] & /*value*/
      1 && s.update.call(
        null,
        /*value*/
        u[0]
      ), c[0] & /*value*/
      1 && at(
        t,
        /*value*/
        u[0]
      );
    },
    i(u) {
      r || (rt(f), r = !0);
    },
    o(u) {
      dt(f), r = !1;
    },
    d(u) {
      u && (Ve(e), Ve(t)), f && f.d(u), n[42](null), a = !1, hn(o);
    }
  };
}
function Bf(n) {
  let e;
  function t(s, r) {
    if (
      /*type*/
      s[9] === "text"
    )
      return Yf;
    if (
      /*type*/
      s[9] === "password"
    )
      return Wf;
    if (
      /*type*/
      s[9] === "email"
    )
      return Hf;
    if (
      /*type*/
      s[9] === "number"
    )
      return Uf;
  }
  let l = t(n), i = l && l(n);
  return {
    c() {
      i && i.c(), e = js();
    },
    m(s, r) {
      i && i.m(s, r), Be(s, e, r);
    },
    p(s, r) {
      l === (l = t(s)) && i ? i.p(s, r) : (i && i.d(1), i = l && l(s), i && (i.c(), i.m(e.parentNode, e)));
    },
    i: Jn,
    o: Jn,
    d(s) {
      s && Ve(e), i && i.d(s);
    }
  };
}
function Mi(n) {
  let e, t, l, i;
  const s = [jf, Gf], r = [];
  function a(o, f) {
    return (
      /*copied*/
      o[15] ? 0 : 1
    );
  }
  return e = a(n), t = r[e] = s[e](n), {
    c() {
      t.c(), l = js();
    },
    m(o, f) {
      r[e].m(o, f), Be(o, l, f), i = !0;
    },
    p(o, f) {
      let u = e;
      e = a(o), e === u ? r[e].p(o, f) : (Gl(), dt(r[u], 1, 1, () => {
        r[u] = null;
      }), zl(), t = r[e], t ? t.p(o, f) : (t = r[e] = s[e](o), t.c()), rt(t, 1), t.m(l.parentNode, l));
    },
    i(o) {
      i || (rt(t), i = !0);
    },
    o(o) {
      dt(t), i = !1;
    },
    d(o) {
      o && Ve(l), r[e].d(o);
    }
  };
}
function Gf(n) {
  let e, t, l, i, s;
  return t = new Ss({}), {
    c() {
      e = Dt("button"), Vl(t.$$.fragment), M(e, "aria-label", "Copy"), M(e, "aria-roledescription", "Copy text"), M(e, "class", "svelte-9f62t7");
    },
    m(r, a) {
      Be(r, e, a), jl(t, e, null), l = !0, i || (s = Y(
        e,
        "click",
        /*handle_copy*/
        n[16]
      ), i = !0);
    },
    p: Jn,
    i(r) {
      l || (rt(t.$$.fragment, r), l = !0);
    },
    o(r) {
      dt(t.$$.fragment, r), l = !1;
    },
    d(r) {
      r && Ve(e), Bl(t), i = !1, s();
    }
  };
}
function jf(n) {
  let e, t, l, i;
  return t = new Is({}), {
    c() {
      e = Dt("button"), Vl(t.$$.fragment), M(e, "aria-label", "Copied"), M(e, "aria-roledescription", "Text copied"), M(e, "class", "svelte-9f62t7");
    },
    m(s, r) {
      Be(s, e, r), jl(t, e, null), i = !0;
    },
    p: Jn,
    i(s) {
      i || (rt(t.$$.fragment, s), s && (l || If(() => {
        l = Af(e, fr, { duration: 300 }), l.start();
      })), i = !0);
    },
    o(s) {
      dt(t.$$.fragment, s), i = !1;
    },
    d(s) {
      s && Ve(e), Bl(t);
    }
  };
}
function Uf(n) {
  let e, t, l;
  return {
    c() {
      e = Dt("input"), M(e, "data-testid", "textbox"), M(e, "type", "number"), M(e, "class", "scroll-hide svelte-9f62t7"), M(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], M(e, "autocomplete", "");
    },
    m(i, s) {
      Be(i, e, s), at(
        e,
        /*value*/
        n[0]
      ), n[40](e), /*autofocus*/
      n[12] && e.focus(), t || (l = [
        Y(
          e,
          "input",
          /*input_input_handler_3*/
          n[39]
        ),
        Y(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        Y(
          e,
          "blur",
          /*blur_handler_3*/
          n[29]
        ),
        Y(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        Y(
          e,
          "focus",
          /*focus_handler_3*/
          n[30]
        )
      ], t = !0);
    },
    p(i, s) {
      s[0] & /*placeholder*/
      4 && M(
        e,
        "placeholder",
        /*placeholder*/
        i[2]
      ), s[0] & /*disabled*/
      32 && (e.disabled = /*disabled*/
      i[5]), s[0] & /*autofocus*/
      4096 && (e.autofocus = /*autofocus*/
      i[12]), s[0] & /*value*/
      1 && Hs(e.value) !== /*value*/
      i[0] && at(
        e,
        /*value*/
        i[0]
      );
    },
    d(i) {
      i && Ve(e), n[40](null), t = !1, hn(l);
    }
  };
}
function Hf(n) {
  let e, t, l;
  return {
    c() {
      e = Dt("input"), M(e, "data-testid", "textbox"), M(e, "type", "email"), M(e, "class", "scroll-hide svelte-9f62t7"), M(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], M(e, "autocomplete", "email");
    },
    m(i, s) {
      Be(i, e, s), at(
        e,
        /*value*/
        n[0]
      ), n[38](e), /*autofocus*/
      n[12] && e.focus(), t || (l = [
        Y(
          e,
          "input",
          /*input_input_handler_2*/
          n[37]
        ),
        Y(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        Y(
          e,
          "blur",
          /*blur_handler_2*/
          n[27]
        ),
        Y(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        Y(
          e,
          "focus",
          /*focus_handler_2*/
          n[28]
        )
      ], t = !0);
    },
    p(i, s) {
      s[0] & /*placeholder*/
      4 && M(
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
      i[0] && at(
        e,
        /*value*/
        i[0]
      );
    },
    d(i) {
      i && Ve(e), n[38](null), t = !1, hn(l);
    }
  };
}
function Wf(n) {
  let e, t, l;
  return {
    c() {
      e = Dt("input"), M(e, "data-testid", "password"), M(e, "type", "password"), M(e, "class", "scroll-hide svelte-9f62t7"), M(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], M(e, "autocomplete", "");
    },
    m(i, s) {
      Be(i, e, s), at(
        e,
        /*value*/
        n[0]
      ), n[36](e), /*autofocus*/
      n[12] && e.focus(), t || (l = [
        Y(
          e,
          "input",
          /*input_input_handler_1*/
          n[35]
        ),
        Y(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        Y(
          e,
          "blur",
          /*blur_handler_1*/
          n[25]
        ),
        Y(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        Y(
          e,
          "focus",
          /*focus_handler_1*/
          n[26]
        )
      ], t = !0);
    },
    p(i, s) {
      s[0] & /*placeholder*/
      4 && M(
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
      i[0] && at(
        e,
        /*value*/
        i[0]
      );
    },
    d(i) {
      i && Ve(e), n[36](null), t = !1, hn(l);
    }
  };
}
function Yf(n) {
  let e, t, l, i, s;
  return {
    c() {
      e = Dt("input"), M(e, "data-testid", "textbox"), M(e, "type", "text"), M(e, "class", "scroll-hide svelte-9f62t7"), M(e, "dir", t = /*rtl*/
      n[11] ? "rtl" : "ltr"), M(
        e,
        "placeholder",
        /*placeholder*/
        n[2]
      ), e.disabled = /*disabled*/
      n[5], e.autofocus = /*autofocus*/
      n[12], M(e, "style", l = /*text_align*/
      n[13] ? "text-align: " + /*text_align*/
      n[13] : "");
    },
    m(r, a) {
      Be(r, e, a), at(
        e,
        /*value*/
        n[0]
      ), n[34](e), /*autofocus*/
      n[12] && e.focus(), i || (s = [
        Y(
          e,
          "input",
          /*input_input_handler*/
          n[33]
        ),
        Y(
          e,
          "keypress",
          /*handle_keypress*/
          n[18]
        ),
        Y(
          e,
          "blur",
          /*blur_handler*/
          n[23]
        ),
        Y(
          e,
          "select",
          /*handle_select*/
          n[17]
        ),
        Y(
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
      r[11] ? "rtl" : "ltr") && M(e, "dir", t), a[0] & /*placeholder*/
      4 && M(
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
      r[13] : "") && M(e, "style", l), a[0] & /*value*/
      1 && e.value !== /*value*/
      r[0] && at(
        e,
        /*value*/
        r[0]
      );
    },
    d(r) {
      r && Ve(e), n[34](null), i = !1, hn(s);
    }
  };
}
function Kf(n) {
  let e, t, l, i, s, r;
  t = new Ls({
    props: {
      show_label: (
        /*show_label*/
        n[6]
      ),
      info: (
        /*info*/
        n[4]
      ),
      $$slots: { default: [zf] },
      $$scope: { ctx: n }
    }
  });
  const a = [Bf, Vf], o = [];
  function f(u, c) {
    return (
      /*lines*/
      u[1] === 1 && /*max_lines*/
      u[8] === 1 ? 0 : 1
    );
  }
  return i = f(n), s = o[i] = a[i](n), {
    c() {
      e = Dt("label"), Vl(t.$$.fragment), l = Us(), s.c(), M(e, "class", "svelte-9f62t7"), Ri(
        e,
        "container",
        /*container*/
        n[7]
      );
    },
    m(u, c) {
      Be(u, e, c), jl(t, e, null), Sf(e, l), o[i].m(e, null), r = !0;
    },
    p(u, c) {
      const d = {};
      c[0] & /*show_label*/
      64 && (d.show_label = /*show_label*/
      u[6]), c[0] & /*info*/
      16 && (d.info = /*info*/
      u[4]), c[0] & /*label*/
      8 | c[1] & /*$$scope*/
      2097152 && (d.$$scope = { dirty: c, ctx: u }), t.$set(d);
      let m = i;
      i = f(u), i === m ? o[i].p(u, c) : (Gl(), dt(o[m], 1, 1, () => {
        o[m] = null;
      }), zl(), s = o[i], s ? s.p(u, c) : (s = o[i] = a[i](u), s.c()), rt(s, 1), s.m(e, null)), (!r || c[0] & /*container*/
      128) && Ri(
        e,
        "container",
        /*container*/
        u[7]
      );
    },
    i(u) {
      r || (rt(t.$$.fragment, u), rt(s), r = !0);
    },
    o(u) {
      dt(t.$$.fragment, u), dt(s), r = !1;
    },
    d(u) {
      u && Ve(e), Bl(t), o[i].d();
    }
  };
}
function Xf(n, e, t) {
  let { value: l = "" } = e, { value_is_output: i = !1 } = e, { lines: s = 1 } = e, { placeholder: r = "Type here..." } = e, { label: a } = e, { info: o = void 0 } = e, { disabled: f = !1 } = e, { show_label: u = !0 } = e, { container: c = !0 } = e, { max_lines: d } = e, { type: m = "text" } = e, { show_copy_button: p = !1 } = e, { rtl: T = !1 } = e, { autofocus: k = !1 } = e, { text_align: y = void 0 } = e, { autoscroll: h = !0 } = e, _, w = !1, S, b, B = 0, A = !1;
  const v = Zf();
  Pf(() => {
    b = _ && _.offsetHeight + _.scrollTop > _.scrollHeight - 100;
  });
  const C = () => {
    b && h && !A && _.scrollTo(0, _.scrollHeight);
  };
  function L() {
    v("change", l), i || v("input");
  }
  qf(() => {
    k && _.focus(), b && h && C(), t(21, i = !1);
  });
  async function J() {
    "clipboard" in navigator && (await navigator.clipboard.writeText(l), G());
  }
  function G() {
    t(15, w = !0), S && clearTimeout(S), S = setTimeout(
      () => {
        t(15, w = !1);
      },
      1e3
    );
  }
  function P(D) {
    const Se = D.target, mt = Se.value, Qe = [Se.selectionStart, Se.selectionEnd];
    v("select", { value: mt.substring(...Qe), index: Qe });
  }
  async function W(D) {
    await Li(), (D.key === "Enter" && D.shiftKey && s > 1 || D.key === "Enter" && !D.shiftKey && s === 1 && d >= 1) && (D.preventDefault(), v("submit"));
  }
  function fe(D) {
    const Se = D.target, mt = Se.scrollTop;
    mt < B && (A = !0), B = mt;
    const Qe = Se.scrollHeight - Se.clientHeight;
    mt >= Qe && (A = !1);
  }
  async function I(D) {
    if (await Li(), s === d)
      return;
    let Se = d === void 0 ? !1 : d === void 0 ? 21 * 11 : 21 * (d + 1), mt = 21 * (s + 1);
    const Qe = D.target;
    Qe.style.height = "1px";
    let en;
    Se && Qe.scrollHeight > Se ? en = Se : Qe.scrollHeight < mt ? en = mt : en = Qe.scrollHeight, Qe.style.height = `${en}px`;
  }
  function ne(D, Se) {
    if (s !== d && (D.style.overflowY = "scroll", D.addEventListener("input", I), !!Se.trim()))
      return I({ target: D }), {
        destroy: () => D.removeEventListener("input", I)
      };
  }
  function ce(D) {
    $e.call(this, n, D);
  }
  function le(D) {
    $e.call(this, n, D);
  }
  function E(D) {
    $e.call(this, n, D);
  }
  function F(D) {
    $e.call(this, n, D);
  }
  function g(D) {
    $e.call(this, n, D);
  }
  function Oe(D) {
    $e.call(this, n, D);
  }
  function Ie(D) {
    $e.call(this, n, D);
  }
  function Je(D) {
    $e.call(this, n, D);
  }
  function je(D) {
    $e.call(this, n, D);
  }
  function Tt(D) {
    $e.call(this, n, D);
  }
  function $t() {
    l = this.value, t(0, l);
  }
  function Mt(D) {
    nn[D ? "unshift" : "push"](() => {
      _ = D, t(14, _);
    });
  }
  function X() {
    l = this.value, t(0, l);
  }
  function N(D) {
    nn[D ? "unshift" : "push"](() => {
      _ = D, t(14, _);
    });
  }
  function j() {
    l = this.value, t(0, l);
  }
  function de(D) {
    nn[D ? "unshift" : "push"](() => {
      _ = D, t(14, _);
    });
  }
  function Le() {
    l = Hs(this.value), t(0, l);
  }
  function ft(D) {
    nn[D ? "unshift" : "push"](() => {
      _ = D, t(14, _);
    });
  }
  function no() {
    l = this.value, t(0, l);
  }
  function lo(D) {
    nn[D ? "unshift" : "push"](() => {
      _ = D, t(14, _);
    });
  }
  return n.$$set = (D) => {
    "value" in D && t(0, l = D.value), "value_is_output" in D && t(21, i = D.value_is_output), "lines" in D && t(1, s = D.lines), "placeholder" in D && t(2, r = D.placeholder), "label" in D && t(3, a = D.label), "info" in D && t(4, o = D.info), "disabled" in D && t(5, f = D.disabled), "show_label" in D && t(6, u = D.show_label), "container" in D && t(7, c = D.container), "max_lines" in D && t(8, d = D.max_lines), "type" in D && t(9, m = D.type), "show_copy_button" in D && t(10, p = D.show_copy_button), "rtl" in D && t(11, T = D.rtl), "autofocus" in D && t(12, k = D.autofocus), "text_align" in D && t(13, y = D.text_align), "autoscroll" in D && t(22, h = D.autoscroll);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*value*/
    1 && l === null && t(0, l = ""), n.$$.dirty[0] & /*value, el, lines, max_lines*/
    16643 && _ && s !== d && I({ target: _ }), n.$$.dirty[0] & /*value*/
    1 && L();
  }, [
    l,
    s,
    r,
    a,
    o,
    f,
    u,
    c,
    d,
    m,
    p,
    T,
    k,
    y,
    _,
    w,
    J,
    P,
    W,
    fe,
    ne,
    i,
    h,
    ce,
    le,
    E,
    F,
    g,
    Oe,
    Ie,
    Je,
    je,
    Tt,
    $t,
    Mt,
    X,
    N,
    j,
    de,
    Le,
    ft,
    no,
    lo
  ];
}
class Tl extends Cf {
  constructor(e) {
    super(), Nf(
      this,
      e,
      Xf,
      Kf,
      Lf,
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
  SvelteComponent: Jf,
  assign: Qf,
  create_slot: xf,
  detach: $f,
  element: eu,
  get_all_dirty_from_scope: tu,
  get_slot_changes: nu,
  get_spread_update: lu,
  init: iu,
  insert: su,
  safe_not_equal: ou,
  set_dynamic_element_data: Fi,
  set_style: Ne,
  toggle_class: et,
  transition_in: Ws,
  transition_out: Ys,
  update_slot_base: ru
} = window.__gradio__svelte__internal;
function au(n) {
  let e, t, l;
  const i = (
    /*#slots*/
    n[18].default
  ), s = xf(
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
    a = Qf(a, r[o]);
  return {
    c() {
      e = eu(
        /*tag*/
        n[14]
      ), s && s.c(), Fi(
        /*tag*/
        n[14]
      )(e, a), et(
        e,
        "hidden",
        /*visible*/
        n[10] === !1
      ), et(
        e,
        "padded",
        /*padding*/
        n[6]
      ), et(
        e,
        "border_focus",
        /*border_mode*/
        n[5] === "focus"
      ), et(
        e,
        "border_contrast",
        /*border_mode*/
        n[5] === "contrast"
      ), et(e, "hide-container", !/*explicit_call*/
      n[8] && !/*container*/
      n[9]), Ne(
        e,
        "height",
        /*get_dimension*/
        n[15](
          /*height*/
          n[0]
        )
      ), Ne(e, "width", typeof /*width*/
      n[1] == "number" ? `calc(min(${/*width*/
      n[1]}px, 100%))` : (
        /*get_dimension*/
        n[15](
          /*width*/
          n[1]
        )
      )), Ne(
        e,
        "border-style",
        /*variant*/
        n[4]
      ), Ne(
        e,
        "overflow",
        /*allow_overflow*/
        n[11] ? "visible" : "hidden"
      ), Ne(
        e,
        "flex-grow",
        /*scale*/
        n[12]
      ), Ne(e, "min-width", `calc(min(${/*min_width*/
      n[13]}px, 100%))`), Ne(e, "border-width", "var(--block-border-width)");
    },
    m(o, f) {
      su(o, e, f), s && s.m(e, null), l = !0;
    },
    p(o, f) {
      s && s.p && (!l || f & /*$$scope*/
      131072) && ru(
        s,
        i,
        o,
        /*$$scope*/
        o[17],
        l ? nu(
          i,
          /*$$scope*/
          o[17],
          f,
          null
        ) : tu(
          /*$$scope*/
          o[17]
        ),
        null
      ), Fi(
        /*tag*/
        o[14]
      )(e, a = lu(r, [
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
      ])), et(
        e,
        "hidden",
        /*visible*/
        o[10] === !1
      ), et(
        e,
        "padded",
        /*padding*/
        o[6]
      ), et(
        e,
        "border_focus",
        /*border_mode*/
        o[5] === "focus"
      ), et(
        e,
        "border_contrast",
        /*border_mode*/
        o[5] === "contrast"
      ), et(e, "hide-container", !/*explicit_call*/
      o[8] && !/*container*/
      o[9]), f & /*height*/
      1 && Ne(
        e,
        "height",
        /*get_dimension*/
        o[15](
          /*height*/
          o[0]
        )
      ), f & /*width*/
      2 && Ne(e, "width", typeof /*width*/
      o[1] == "number" ? `calc(min(${/*width*/
      o[1]}px, 100%))` : (
        /*get_dimension*/
        o[15](
          /*width*/
          o[1]
        )
      )), f & /*variant*/
      16 && Ne(
        e,
        "border-style",
        /*variant*/
        o[4]
      ), f & /*allow_overflow*/
      2048 && Ne(
        e,
        "overflow",
        /*allow_overflow*/
        o[11] ? "visible" : "hidden"
      ), f & /*scale*/
      4096 && Ne(
        e,
        "flex-grow",
        /*scale*/
        o[12]
      ), f & /*min_width*/
      8192 && Ne(e, "min-width", `calc(min(${/*min_width*/
      o[13]}px, 100%))`);
    },
    i(o) {
      l || (Ws(s, o), l = !0);
    },
    o(o) {
      Ys(s, o), l = !1;
    },
    d(o) {
      o && $f(e), s && s.d(o);
    }
  };
}
function fu(n) {
  let e, t = (
    /*tag*/
    n[14] && au(n)
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
      e || (Ws(t, l), e = !0);
    },
    o(l) {
      Ys(t, l), e = !1;
    },
    d(l) {
      t && t.d(l);
    }
  };
}
function uu(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { height: s = void 0 } = e, { width: r = void 0 } = e, { elem_id: a = "" } = e, { elem_classes: o = [] } = e, { variant: f = "solid" } = e, { border_mode: u = "base" } = e, { padding: c = !0 } = e, { type: d = "normal" } = e, { test_id: m = void 0 } = e, { explicit_call: p = !1 } = e, { container: T = !0 } = e, { visible: k = !0 } = e, { allow_overflow: y = !0 } = e, { scale: h = null } = e, { min_width: _ = 0 } = e, w = d === "fieldset" ? "fieldset" : "div";
  const S = (b) => {
    if (b !== void 0) {
      if (typeof b == "number")
        return b + "px";
      if (typeof b == "string")
        return b;
    }
  };
  return n.$$set = (b) => {
    "height" in b && t(0, s = b.height), "width" in b && t(1, r = b.width), "elem_id" in b && t(2, a = b.elem_id), "elem_classes" in b && t(3, o = b.elem_classes), "variant" in b && t(4, f = b.variant), "border_mode" in b && t(5, u = b.border_mode), "padding" in b && t(6, c = b.padding), "type" in b && t(16, d = b.type), "test_id" in b && t(7, m = b.test_id), "explicit_call" in b && t(8, p = b.explicit_call), "container" in b && t(9, T = b.container), "visible" in b && t(10, k = b.visible), "allow_overflow" in b && t(11, y = b.allow_overflow), "scale" in b && t(12, h = b.scale), "min_width" in b && t(13, _ = b.min_width), "$$scope" in b && t(17, i = b.$$scope);
  }, [
    s,
    r,
    a,
    o,
    f,
    u,
    c,
    m,
    p,
    T,
    k,
    y,
    h,
    _,
    w,
    S,
    d,
    i,
    l
  ];
}
class _u extends Jf {
  constructor(e) {
    super(), iu(this, e, uu, fu, ou, {
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
  SvelteComponent: cu,
  attr: du,
  create_slot: mu,
  detach: gu,
  element: hu,
  get_all_dirty_from_scope: bu,
  get_slot_changes: pu,
  init: wu,
  insert: vu,
  safe_not_equal: yu,
  transition_in: ku,
  transition_out: Eu,
  update_slot_base: Du
} = window.__gradio__svelte__internal;
function Tu(n) {
  let e, t;
  const l = (
    /*#slots*/
    n[1].default
  ), i = mu(
    l,
    n,
    /*$$scope*/
    n[0],
    null
  );
  return {
    c() {
      e = hu("div"), i && i.c(), du(e, "class", "svelte-1hnfib2");
    },
    m(s, r) {
      vu(s, e, r), i && i.m(e, null), t = !0;
    },
    p(s, [r]) {
      i && i.p && (!t || r & /*$$scope*/
      1) && Du(
        i,
        l,
        s,
        /*$$scope*/
        s[0],
        t ? pu(
          l,
          /*$$scope*/
          s[0],
          r,
          null
        ) : bu(
          /*$$scope*/
          s[0]
        ),
        null
      );
    },
    i(s) {
      t || (ku(i, s), t = !0);
    },
    o(s) {
      Eu(i, s), t = !1;
    },
    d(s) {
      s && gu(e), i && i.d(s);
    }
  };
}
function Cu(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e;
  return n.$$set = (s) => {
    "$$scope" in s && t(0, i = s.$$scope);
  }, [i, l];
}
class Ou extends cu {
  constructor(e) {
    super(), wu(this, e, Cu, Tu, yu, {});
  }
}
const {
  SvelteComponent: Iu,
  attr: Pi,
  check_outros: Su,
  create_component: Au,
  create_slot: Nu,
  destroy_component: Ru,
  detach: An,
  element: Lu,
  empty: Mu,
  get_all_dirty_from_scope: Fu,
  get_slot_changes: Pu,
  group_outros: qu,
  init: Zu,
  insert: Nn,
  mount_component: zu,
  safe_not_equal: Vu,
  set_data: Bu,
  space: Gu,
  text: ju,
  toggle_class: qt,
  transition_in: on,
  transition_out: Rn,
  update_slot_base: Uu
} = window.__gradio__svelte__internal;
function qi(n) {
  let e, t;
  return e = new Ou({
    props: {
      $$slots: { default: [Hu] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      Au(e.$$.fragment);
    },
    m(l, i) {
      zu(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i & /*$$scope, info*/
      10 && (s.$$scope = { dirty: i, ctx: l }), e.$set(s);
    },
    i(l) {
      t || (on(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Rn(e.$$.fragment, l), t = !1;
    },
    d(l) {
      Ru(e, l);
    }
  };
}
function Hu(n) {
  let e;
  return {
    c() {
      e = ju(
        /*info*/
        n[1]
      );
    },
    m(t, l) {
      Nn(t, e, l);
    },
    p(t, l) {
      l & /*info*/
      2 && Bu(
        e,
        /*info*/
        t[1]
      );
    },
    d(t) {
      t && An(e);
    }
  };
}
function Wu(n) {
  let e, t, l, i;
  const s = (
    /*#slots*/
    n[2].default
  ), r = Nu(
    s,
    n,
    /*$$scope*/
    n[3],
    null
  );
  let a = (
    /*info*/
    n[1] && qi(n)
  );
  return {
    c() {
      e = Lu("span"), r && r.c(), t = Gu(), a && a.c(), l = Mu(), Pi(e, "data-testid", "block-info"), Pi(e, "class", "svelte-22c38v"), qt(e, "sr-only", !/*show_label*/
      n[0]), qt(e, "hide", !/*show_label*/
      n[0]), qt(
        e,
        "has-info",
        /*info*/
        n[1] != null
      );
    },
    m(o, f) {
      Nn(o, e, f), r && r.m(e, null), Nn(o, t, f), a && a.m(o, f), Nn(o, l, f), i = !0;
    },
    p(o, [f]) {
      r && r.p && (!i || f & /*$$scope*/
      8) && Uu(
        r,
        s,
        o,
        /*$$scope*/
        o[3],
        i ? Pu(
          s,
          /*$$scope*/
          o[3],
          f,
          null
        ) : Fu(
          /*$$scope*/
          o[3]
        ),
        null
      ), (!i || f & /*show_label*/
      1) && qt(e, "sr-only", !/*show_label*/
      o[0]), (!i || f & /*show_label*/
      1) && qt(e, "hide", !/*show_label*/
      o[0]), (!i || f & /*info*/
      2) && qt(
        e,
        "has-info",
        /*info*/
        o[1] != null
      ), /*info*/
      o[1] ? a ? (a.p(o, f), f & /*info*/
      2 && on(a, 1)) : (a = qi(o), a.c(), on(a, 1), a.m(l.parentNode, l)) : a && (qu(), Rn(a, 1, 1, () => {
        a = null;
      }), Su());
    },
    i(o) {
      i || (on(r, o), on(a), i = !0);
    },
    o(o) {
      Rn(r, o), Rn(a), i = !1;
    },
    d(o) {
      o && (An(e), An(t), An(l)), r && r.d(o), a && a.d(o);
    }
  };
}
function Yu(n, e, t) {
  let { $$slots: l = {}, $$scope: i } = e, { show_label: s = !0 } = e, { info: r = void 0 } = e;
  return n.$$set = (a) => {
    "show_label" in a && t(0, s = a.show_label), "info" in a && t(1, r = a.info), "$$scope" in a && t(3, i = a.$$scope);
  }, [s, r, l, i];
}
class Ku extends Iu {
  constructor(e) {
    super(), Zu(this, e, Yu, Wu, Vu, { show_label: 0, info: 1 });
  }
}
function Bt(n) {
  let e = ["", "k", "M", "G", "T", "P", "E", "Z"], t = 0;
  for (; n > 1e3 && t < e.length - 1; )
    n /= 1e3, t++;
  let l = e[t];
  return (Number.isInteger(n) ? n : n.toFixed(1)) + l;
}
const {
  SvelteComponent: Xu,
  append: We,
  attr: H,
  component_subscribe: Zi,
  detach: Ju,
  element: Qu,
  init: xu,
  insert: $u,
  noop: zi,
  safe_not_equal: e_,
  set_style: vn,
  svg_element: Ye,
  toggle_class: Vi
} = window.__gradio__svelte__internal, { onMount: t_ } = window.__gradio__svelte__internal;
function n_(n) {
  let e, t, l, i, s, r, a, o, f, u, c, d;
  return {
    c() {
      e = Qu("div"), t = Ye("svg"), l = Ye("g"), i = Ye("path"), s = Ye("path"), r = Ye("path"), a = Ye("path"), o = Ye("g"), f = Ye("path"), u = Ye("path"), c = Ye("path"), d = Ye("path"), H(i, "d", "M255.926 0.754768L509.702 139.936V221.027L255.926 81.8465V0.754768Z"), H(i, "fill", "#FF7C00"), H(i, "fill-opacity", "0.4"), H(i, "class", "svelte-43sxxs"), H(s, "d", "M509.69 139.936L254.981 279.641V361.255L509.69 221.55V139.936Z"), H(s, "fill", "#FF7C00"), H(s, "class", "svelte-43sxxs"), H(r, "d", "M0.250138 139.937L254.981 279.641V361.255L0.250138 221.55V139.937Z"), H(r, "fill", "#FF7C00"), H(r, "fill-opacity", "0.4"), H(r, "class", "svelte-43sxxs"), H(a, "d", "M255.923 0.232622L0.236328 139.936V221.55L255.923 81.8469V0.232622Z"), H(a, "fill", "#FF7C00"), H(a, "class", "svelte-43sxxs"), vn(l, "transform", "translate(" + /*$top*/
      n[1][0] + "px, " + /*$top*/
      n[1][1] + "px)"), H(f, "d", "M255.926 141.5L509.702 280.681V361.773L255.926 222.592V141.5Z"), H(f, "fill", "#FF7C00"), H(f, "fill-opacity", "0.4"), H(f, "class", "svelte-43sxxs"), H(u, "d", "M509.69 280.679L254.981 420.384V501.998L509.69 362.293V280.679Z"), H(u, "fill", "#FF7C00"), H(u, "class", "svelte-43sxxs"), H(c, "d", "M0.250138 280.681L254.981 420.386V502L0.250138 362.295V280.681Z"), H(c, "fill", "#FF7C00"), H(c, "fill-opacity", "0.4"), H(c, "class", "svelte-43sxxs"), H(d, "d", "M255.923 140.977L0.236328 280.68V362.294L255.923 222.591V140.977Z"), H(d, "fill", "#FF7C00"), H(d, "class", "svelte-43sxxs"), vn(o, "transform", "translate(" + /*$bottom*/
      n[2][0] + "px, " + /*$bottom*/
      n[2][1] + "px)"), H(t, "viewBox", "-1200 -1200 3000 3000"), H(t, "fill", "none"), H(t, "xmlns", "http://www.w3.org/2000/svg"), H(t, "class", "svelte-43sxxs"), H(e, "class", "svelte-43sxxs"), Vi(
        e,
        "margin",
        /*margin*/
        n[0]
      );
    },
    m(m, p) {
      $u(m, e, p), We(e, t), We(t, l), We(l, i), We(l, s), We(l, r), We(l, a), We(t, o), We(o, f), We(o, u), We(o, c), We(o, d);
    },
    p(m, [p]) {
      p & /*$top*/
      2 && vn(l, "transform", "translate(" + /*$top*/
      m[1][0] + "px, " + /*$top*/
      m[1][1] + "px)"), p & /*$bottom*/
      4 && vn(o, "transform", "translate(" + /*$bottom*/
      m[2][0] + "px, " + /*$bottom*/
      m[2][1] + "px)"), p & /*margin*/
      1 && Vi(
        e,
        "margin",
        /*margin*/
        m[0]
      );
    },
    i: zi,
    o: zi,
    d(m) {
      m && Ju(e);
    }
  };
}
function l_(n, e, t) {
  let l, i, { margin: s = !0 } = e;
  const r = Un([0, 0]);
  Zi(n, r, (d) => t(1, l = d));
  const a = Un([0, 0]);
  Zi(n, a, (d) => t(2, i = d));
  let o;
  async function f() {
    await Promise.all([r.set([125, 140]), a.set([-125, -140])]), await Promise.all([r.set([-125, 140]), a.set([125, -140])]), await Promise.all([r.set([-125, 0]), a.set([125, -0])]), await Promise.all([r.set([125, 0]), a.set([-125, 0])]);
  }
  async function u() {
    await f(), o || u();
  }
  async function c() {
    await Promise.all([r.set([125, 0]), a.set([-125, 0])]), u();
  }
  return t_(() => (c(), () => o = !0)), n.$$set = (d) => {
    "margin" in d && t(0, s = d.margin);
  }, [s, l, i, r, a];
}
class i_ extends Xu {
  constructor(e) {
    super(), xu(this, e, l_, n_, e_, { margin: 0 });
  }
}
const {
  SvelteComponent: s_,
  append: Nt,
  attr: st,
  binding_callbacks: Bi,
  check_outros: Ks,
  create_component: o_,
  create_slot: r_,
  destroy_component: a_,
  destroy_each: Xs,
  detach: z,
  element: _t,
  empty: xt,
  ensure_array_like: Qn,
  get_all_dirty_from_scope: f_,
  get_slot_changes: u_,
  group_outros: Js,
  init: __,
  insert: V,
  mount_component: c_,
  noop: Cl,
  safe_not_equal: d_,
  set_data: Ge,
  set_style: yt,
  space: ot,
  text: ee,
  toggle_class: Pe,
  transition_in: Xt,
  transition_out: Jt,
  update_slot_base: m_
} = window.__gradio__svelte__internal, { tick: g_ } = window.__gradio__svelte__internal, { onDestroy: h_ } = window.__gradio__svelte__internal, b_ = (n) => ({}), Gi = (n) => ({});
function ji(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l[40] = t, l;
}
function Ui(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l;
}
function p_(n) {
  let e, t = (
    /*i18n*/
    n[1]("common.error") + ""
  ), l, i, s;
  const r = (
    /*#slots*/
    n[29].error
  ), a = r_(
    r,
    n,
    /*$$scope*/
    n[28],
    Gi
  );
  return {
    c() {
      e = _t("span"), l = ee(t), i = ot(), a && a.c(), st(e, "class", "error svelte-1yserjw");
    },
    m(o, f) {
      V(o, e, f), Nt(e, l), V(o, i, f), a && a.m(o, f), s = !0;
    },
    p(o, f) {
      (!s || f[0] & /*i18n*/
      2) && t !== (t = /*i18n*/
      o[1]("common.error") + "") && Ge(l, t), a && a.p && (!s || f[0] & /*$$scope*/
      268435456) && m_(
        a,
        r,
        o,
        /*$$scope*/
        o[28],
        s ? u_(
          r,
          /*$$scope*/
          o[28],
          f,
          b_
        ) : f_(
          /*$$scope*/
          o[28]
        ),
        Gi
      );
    },
    i(o) {
      s || (Xt(a, o), s = !0);
    },
    o(o) {
      Jt(a, o), s = !1;
    },
    d(o) {
      o && (z(e), z(i)), a && a.d(o);
    }
  };
}
function w_(n) {
  let e, t, l, i, s, r, a, o, f, u = (
    /*variant*/
    n[8] === "default" && /*show_eta_bar*/
    n[18] && /*show_progress*/
    n[6] === "full" && Hi(n)
  );
  function c(_, w) {
    if (
      /*progress*/
      _[7]
    )
      return k_;
    if (
      /*queue_position*/
      _[2] !== null && /*queue_size*/
      _[3] !== void 0 && /*queue_position*/
      _[2] >= 0
    )
      return y_;
    if (
      /*queue_position*/
      _[2] === 0
    )
      return v_;
  }
  let d = c(n), m = d && d(n), p = (
    /*timer*/
    n[5] && Ki(n)
  );
  const T = [C_, T_], k = [];
  function y(_, w) {
    return (
      /*last_progress_level*/
      _[15] != null ? 0 : (
        /*show_progress*/
        _[6] === "full" ? 1 : -1
      )
    );
  }
  ~(s = y(n)) && (r = k[s] = T[s](n));
  let h = !/*timer*/
  n[5] && ts(n);
  return {
    c() {
      u && u.c(), e = ot(), t = _t("div"), m && m.c(), l = ot(), p && p.c(), i = ot(), r && r.c(), a = ot(), h && h.c(), o = xt(), st(t, "class", "progress-text svelte-1yserjw"), Pe(
        t,
        "meta-text-center",
        /*variant*/
        n[8] === "center"
      ), Pe(
        t,
        "meta-text",
        /*variant*/
        n[8] === "default"
      );
    },
    m(_, w) {
      u && u.m(_, w), V(_, e, w), V(_, t, w), m && m.m(t, null), Nt(t, l), p && p.m(t, null), V(_, i, w), ~s && k[s].m(_, w), V(_, a, w), h && h.m(_, w), V(_, o, w), f = !0;
    },
    p(_, w) {
      /*variant*/
      _[8] === "default" && /*show_eta_bar*/
      _[18] && /*show_progress*/
      _[6] === "full" ? u ? u.p(_, w) : (u = Hi(_), u.c(), u.m(e.parentNode, e)) : u && (u.d(1), u = null), d === (d = c(_)) && m ? m.p(_, w) : (m && m.d(1), m = d && d(_), m && (m.c(), m.m(t, l))), /*timer*/
      _[5] ? p ? p.p(_, w) : (p = Ki(_), p.c(), p.m(t, null)) : p && (p.d(1), p = null), (!f || w[0] & /*variant*/
      256) && Pe(
        t,
        "meta-text-center",
        /*variant*/
        _[8] === "center"
      ), (!f || w[0] & /*variant*/
      256) && Pe(
        t,
        "meta-text",
        /*variant*/
        _[8] === "default"
      );
      let S = s;
      s = y(_), s === S ? ~s && k[s].p(_, w) : (r && (Js(), Jt(k[S], 1, 1, () => {
        k[S] = null;
      }), Ks()), ~s ? (r = k[s], r ? r.p(_, w) : (r = k[s] = T[s](_), r.c()), Xt(r, 1), r.m(a.parentNode, a)) : r = null), /*timer*/
      _[5] ? h && (h.d(1), h = null) : h ? h.p(_, w) : (h = ts(_), h.c(), h.m(o.parentNode, o));
    },
    i(_) {
      f || (Xt(r), f = !0);
    },
    o(_) {
      Jt(r), f = !1;
    },
    d(_) {
      _ && (z(e), z(t), z(i), z(a), z(o)), u && u.d(_), m && m.d(), p && p.d(), ~s && k[s].d(_), h && h.d(_);
    }
  };
}
function Hi(n) {
  let e, t = `translateX(${/*eta_level*/
  (n[17] || 0) * 100 - 100}%)`;
  return {
    c() {
      e = _t("div"), st(e, "class", "eta-bar svelte-1yserjw"), yt(e, "transform", t);
    },
    m(l, i) {
      V(l, e, i);
    },
    p(l, i) {
      i[0] & /*eta_level*/
      131072 && t !== (t = `translateX(${/*eta_level*/
      (l[17] || 0) * 100 - 100}%)`) && yt(e, "transform", t);
    },
    d(l) {
      l && z(e);
    }
  };
}
function v_(n) {
  let e;
  return {
    c() {
      e = ee("processing |");
    },
    m(t, l) {
      V(t, e, l);
    },
    p: Cl,
    d(t) {
      t && z(e);
    }
  };
}
function y_(n) {
  let e, t = (
    /*queue_position*/
    n[2] + 1 + ""
  ), l, i, s, r;
  return {
    c() {
      e = ee("queue: "), l = ee(t), i = ee("/"), s = ee(
        /*queue_size*/
        n[3]
      ), r = ee(" |");
    },
    m(a, o) {
      V(a, e, o), V(a, l, o), V(a, i, o), V(a, s, o), V(a, r, o);
    },
    p(a, o) {
      o[0] & /*queue_position*/
      4 && t !== (t = /*queue_position*/
      a[2] + 1 + "") && Ge(l, t), o[0] & /*queue_size*/
      8 && Ge(
        s,
        /*queue_size*/
        a[3]
      );
    },
    d(a) {
      a && (z(e), z(l), z(i), z(s), z(r));
    }
  };
}
function k_(n) {
  let e, t = Qn(
    /*progress*/
    n[7]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = Yi(Ui(n, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = xt();
    },
    m(i, s) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, s);
      V(i, e, s);
    },
    p(i, s) {
      if (s[0] & /*progress*/
      128) {
        t = Qn(
          /*progress*/
          i[7]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = Ui(i, t, r);
          l[r] ? l[r].p(a, s) : (l[r] = Yi(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && z(e), Xs(l, i);
    }
  };
}
function Wi(n) {
  let e, t = (
    /*p*/
    n[38].unit + ""
  ), l, i, s = " ", r;
  function a(u, c) {
    return (
      /*p*/
      u[38].length != null ? D_ : E_
    );
  }
  let o = a(n), f = o(n);
  return {
    c() {
      f.c(), e = ot(), l = ee(t), i = ee(" | "), r = ee(s);
    },
    m(u, c) {
      f.m(u, c), V(u, e, c), V(u, l, c), V(u, i, c), V(u, r, c);
    },
    p(u, c) {
      o === (o = a(u)) && f ? f.p(u, c) : (f.d(1), f = o(u), f && (f.c(), f.m(e.parentNode, e))), c[0] & /*progress*/
      128 && t !== (t = /*p*/
      u[38].unit + "") && Ge(l, t);
    },
    d(u) {
      u && (z(e), z(l), z(i), z(r)), f.d(u);
    }
  };
}
function E_(n) {
  let e = Bt(
    /*p*/
    n[38].index || 0
  ) + "", t;
  return {
    c() {
      t = ee(e);
    },
    m(l, i) {
      V(l, t, i);
    },
    p(l, i) {
      i[0] & /*progress*/
      128 && e !== (e = Bt(
        /*p*/
        l[38].index || 0
      ) + "") && Ge(t, e);
    },
    d(l) {
      l && z(t);
    }
  };
}
function D_(n) {
  let e = Bt(
    /*p*/
    n[38].index || 0
  ) + "", t, l, i = Bt(
    /*p*/
    n[38].length
  ) + "", s;
  return {
    c() {
      t = ee(e), l = ee("/"), s = ee(i);
    },
    m(r, a) {
      V(r, t, a), V(r, l, a), V(r, s, a);
    },
    p(r, a) {
      a[0] & /*progress*/
      128 && e !== (e = Bt(
        /*p*/
        r[38].index || 0
      ) + "") && Ge(t, e), a[0] & /*progress*/
      128 && i !== (i = Bt(
        /*p*/
        r[38].length
      ) + "") && Ge(s, i);
    },
    d(r) {
      r && (z(t), z(l), z(s));
    }
  };
}
function Yi(n) {
  let e, t = (
    /*p*/
    n[38].index != null && Wi(n)
  );
  return {
    c() {
      t && t.c(), e = xt();
    },
    m(l, i) {
      t && t.m(l, i), V(l, e, i);
    },
    p(l, i) {
      /*p*/
      l[38].index != null ? t ? t.p(l, i) : (t = Wi(l), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(l) {
      l && z(e), t && t.d(l);
    }
  };
}
function Ki(n) {
  let e, t = (
    /*eta*/
    n[0] ? `/${/*formatted_eta*/
    n[19]}` : ""
  ), l, i;
  return {
    c() {
      e = ee(
        /*formatted_timer*/
        n[20]
      ), l = ee(t), i = ee("s");
    },
    m(s, r) {
      V(s, e, r), V(s, l, r), V(s, i, r);
    },
    p(s, r) {
      r[0] & /*formatted_timer*/
      1048576 && Ge(
        e,
        /*formatted_timer*/
        s[20]
      ), r[0] & /*eta, formatted_eta*/
      524289 && t !== (t = /*eta*/
      s[0] ? `/${/*formatted_eta*/
      s[19]}` : "") && Ge(l, t);
    },
    d(s) {
      s && (z(e), z(l), z(i));
    }
  };
}
function T_(n) {
  let e, t;
  return e = new i_({
    props: { margin: (
      /*variant*/
      n[8] === "default"
    ) }
  }), {
    c() {
      o_(e.$$.fragment);
    },
    m(l, i) {
      c_(e, l, i), t = !0;
    },
    p(l, i) {
      const s = {};
      i[0] & /*variant*/
      256 && (s.margin = /*variant*/
      l[8] === "default"), e.$set(s);
    },
    i(l) {
      t || (Xt(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Jt(e.$$.fragment, l), t = !1;
    },
    d(l) {
      a_(e, l);
    }
  };
}
function C_(n) {
  let e, t, l, i, s, r = `${/*last_progress_level*/
  n[15] * 100}%`, a = (
    /*progress*/
    n[7] != null && Xi(n)
  );
  return {
    c() {
      e = _t("div"), t = _t("div"), a && a.c(), l = ot(), i = _t("div"), s = _t("div"), st(t, "class", "progress-level-inner svelte-1yserjw"), st(s, "class", "progress-bar svelte-1yserjw"), yt(s, "width", r), st(i, "class", "progress-bar-wrap svelte-1yserjw"), st(e, "class", "progress-level svelte-1yserjw");
    },
    m(o, f) {
      V(o, e, f), Nt(e, t), a && a.m(t, null), Nt(e, l), Nt(e, i), Nt(i, s), n[30](s);
    },
    p(o, f) {
      /*progress*/
      o[7] != null ? a ? a.p(o, f) : (a = Xi(o), a.c(), a.m(t, null)) : a && (a.d(1), a = null), f[0] & /*last_progress_level*/
      32768 && r !== (r = `${/*last_progress_level*/
      o[15] * 100}%`) && yt(s, "width", r);
    },
    i: Cl,
    o: Cl,
    d(o) {
      o && z(e), a && a.d(), n[30](null);
    }
  };
}
function Xi(n) {
  let e, t = Qn(
    /*progress*/
    n[7]
  ), l = [];
  for (let i = 0; i < t.length; i += 1)
    l[i] = es(ji(n, t, i));
  return {
    c() {
      for (let i = 0; i < l.length; i += 1)
        l[i].c();
      e = xt();
    },
    m(i, s) {
      for (let r = 0; r < l.length; r += 1)
        l[r] && l[r].m(i, s);
      V(i, e, s);
    },
    p(i, s) {
      if (s[0] & /*progress_level, progress*/
      16512) {
        t = Qn(
          /*progress*/
          i[7]
        );
        let r;
        for (r = 0; r < t.length; r += 1) {
          const a = ji(i, t, r);
          l[r] ? l[r].p(a, s) : (l[r] = es(a), l[r].c(), l[r].m(e.parentNode, e));
        }
        for (; r < l.length; r += 1)
          l[r].d(1);
        l.length = t.length;
      }
    },
    d(i) {
      i && z(e), Xs(l, i);
    }
  };
}
function Ji(n) {
  let e, t, l, i, s = (
    /*i*/
    n[40] !== 0 && O_()
  ), r = (
    /*p*/
    n[38].desc != null && Qi(n)
  ), a = (
    /*p*/
    n[38].desc != null && /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null && xi()
  ), o = (
    /*progress_level*/
    n[14] != null && $i(n)
  );
  return {
    c() {
      s && s.c(), e = ot(), r && r.c(), t = ot(), a && a.c(), l = ot(), o && o.c(), i = xt();
    },
    m(f, u) {
      s && s.m(f, u), V(f, e, u), r && r.m(f, u), V(f, t, u), a && a.m(f, u), V(f, l, u), o && o.m(f, u), V(f, i, u);
    },
    p(f, u) {
      /*p*/
      f[38].desc != null ? r ? r.p(f, u) : (r = Qi(f), r.c(), r.m(t.parentNode, t)) : r && (r.d(1), r = null), /*p*/
      f[38].desc != null && /*progress_level*/
      f[14] && /*progress_level*/
      f[14][
        /*i*/
        f[40]
      ] != null ? a || (a = xi(), a.c(), a.m(l.parentNode, l)) : a && (a.d(1), a = null), /*progress_level*/
      f[14] != null ? o ? o.p(f, u) : (o = $i(f), o.c(), o.m(i.parentNode, i)) : o && (o.d(1), o = null);
    },
    d(f) {
      f && (z(e), z(t), z(l), z(i)), s && s.d(f), r && r.d(f), a && a.d(f), o && o.d(f);
    }
  };
}
function O_(n) {
  let e;
  return {
    c() {
      e = ee(" /");
    },
    m(t, l) {
      V(t, e, l);
    },
    d(t) {
      t && z(e);
    }
  };
}
function Qi(n) {
  let e = (
    /*p*/
    n[38].desc + ""
  ), t;
  return {
    c() {
      t = ee(e);
    },
    m(l, i) {
      V(l, t, i);
    },
    p(l, i) {
      i[0] & /*progress*/
      128 && e !== (e = /*p*/
      l[38].desc + "") && Ge(t, e);
    },
    d(l) {
      l && z(t);
    }
  };
}
function xi(n) {
  let e;
  return {
    c() {
      e = ee("-");
    },
    m(t, l) {
      V(t, e, l);
    },
    d(t) {
      t && z(e);
    }
  };
}
function $i(n) {
  let e = (100 * /*progress_level*/
  (n[14][
    /*i*/
    n[40]
  ] || 0)).toFixed(1) + "", t, l;
  return {
    c() {
      t = ee(e), l = ee("%");
    },
    m(i, s) {
      V(i, t, s), V(i, l, s);
    },
    p(i, s) {
      s[0] & /*progress_level*/
      16384 && e !== (e = (100 * /*progress_level*/
      (i[14][
        /*i*/
        i[40]
      ] || 0)).toFixed(1) + "") && Ge(t, e);
    },
    d(i) {
      i && (z(t), z(l));
    }
  };
}
function es(n) {
  let e, t = (
    /*p*/
    (n[38].desc != null || /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null) && Ji(n)
  );
  return {
    c() {
      t && t.c(), e = xt();
    },
    m(l, i) {
      t && t.m(l, i), V(l, e, i);
    },
    p(l, i) {
      /*p*/
      l[38].desc != null || /*progress_level*/
      l[14] && /*progress_level*/
      l[14][
        /*i*/
        l[40]
      ] != null ? t ? t.p(l, i) : (t = Ji(l), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(l) {
      l && z(e), t && t.d(l);
    }
  };
}
function ts(n) {
  let e, t;
  return {
    c() {
      e = _t("p"), t = ee(
        /*loading_text*/
        n[9]
      ), st(e, "class", "loading svelte-1yserjw");
    },
    m(l, i) {
      V(l, e, i), Nt(e, t);
    },
    p(l, i) {
      i[0] & /*loading_text*/
      512 && Ge(
        t,
        /*loading_text*/
        l[9]
      );
    },
    d(l) {
      l && z(e);
    }
  };
}
function I_(n) {
  let e, t, l, i, s;
  const r = [w_, p_], a = [];
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
      e = _t("div"), l && l.c(), st(e, "class", i = "wrap " + /*variant*/
      n[8] + " " + /*show_progress*/
      n[6] + " svelte-1yserjw"), Pe(e, "hide", !/*status*/
      n[4] || /*status*/
      n[4] === "complete" || /*show_progress*/
      n[6] === "hidden"), Pe(
        e,
        "translucent",
        /*variant*/
        n[8] === "center" && /*status*/
        (n[4] === "pending" || /*status*/
        n[4] === "error") || /*translucent*/
        n[11] || /*show_progress*/
        n[6] === "minimal"
      ), Pe(
        e,
        "generating",
        /*status*/
        n[4] === "generating"
      ), Pe(
        e,
        "border",
        /*border*/
        n[12]
      ), yt(
        e,
        "position",
        /*absolute*/
        n[10] ? "absolute" : "static"
      ), yt(
        e,
        "padding",
        /*absolute*/
        n[10] ? "0" : "var(--size-8) 0"
      );
    },
    m(f, u) {
      V(f, e, u), ~t && a[t].m(e, null), n[31](e), s = !0;
    },
    p(f, u) {
      let c = t;
      t = o(f), t === c ? ~t && a[t].p(f, u) : (l && (Js(), Jt(a[c], 1, 1, () => {
        a[c] = null;
      }), Ks()), ~t ? (l = a[t], l ? l.p(f, u) : (l = a[t] = r[t](f), l.c()), Xt(l, 1), l.m(e, null)) : l = null), (!s || u[0] & /*variant, show_progress*/
      320 && i !== (i = "wrap " + /*variant*/
      f[8] + " " + /*show_progress*/
      f[6] + " svelte-1yserjw")) && st(e, "class", i), (!s || u[0] & /*variant, show_progress, status, show_progress*/
      336) && Pe(e, "hide", !/*status*/
      f[4] || /*status*/
      f[4] === "complete" || /*show_progress*/
      f[6] === "hidden"), (!s || u[0] & /*variant, show_progress, variant, status, translucent, show_progress*/
      2384) && Pe(
        e,
        "translucent",
        /*variant*/
        f[8] === "center" && /*status*/
        (f[4] === "pending" || /*status*/
        f[4] === "error") || /*translucent*/
        f[11] || /*show_progress*/
        f[6] === "minimal"
      ), (!s || u[0] & /*variant, show_progress, status*/
      336) && Pe(
        e,
        "generating",
        /*status*/
        f[4] === "generating"
      ), (!s || u[0] & /*variant, show_progress, border*/
      4416) && Pe(
        e,
        "border",
        /*border*/
        f[12]
      ), u[0] & /*absolute*/
      1024 && yt(
        e,
        "position",
        /*absolute*/
        f[10] ? "absolute" : "static"
      ), u[0] & /*absolute*/
      1024 && yt(
        e,
        "padding",
        /*absolute*/
        f[10] ? "0" : "var(--size-8) 0"
      );
    },
    i(f) {
      s || (Xt(l), s = !0);
    },
    o(f) {
      Jt(l), s = !1;
    },
    d(f) {
      f && z(e), ~t && a[t].d(), n[31](null);
    }
  };
}
let yn = [], ml = !1;
async function S_(n, e = !0) {
  if (!(window.__gradio_mode__ === "website" || window.__gradio_mode__ !== "app" && e !== !0)) {
    if (yn.push(n), !ml)
      ml = !0;
    else
      return;
    await g_(), requestAnimationFrame(() => {
      let t = [0, 0];
      for (let l = 0; l < yn.length; l++) {
        const s = yn[l].getBoundingClientRect();
        (l === 0 || s.top + window.scrollY <= t[0]) && (t[0] = s.top + window.scrollY, t[1] = l);
      }
      window.scrollTo({ top: t[0] - 20, behavior: "smooth" }), ml = !1, yn = [];
    });
  }
}
function A_(n, e, t) {
  let l, { $$slots: i = {}, $$scope: s } = e, { i18n: r } = e, { eta: a = null } = e, { queue_position: o } = e, { queue_size: f } = e, { status: u } = e, { scroll_to_output: c = !1 } = e, { timer: d = !0 } = e, { show_progress: m = "full" } = e, { message: p = null } = e, { progress: T = null } = e, { variant: k = "default" } = e, { loading_text: y = "Loading..." } = e, { absolute: h = !0 } = e, { translucent: _ = !1 } = e, { border: w = !1 } = e, { autoscroll: S } = e, b, B = !1, A = 0, v = 0, C = null, L = null, J = 0, G = null, P, W = null, fe = !0;
  const I = () => {
    t(0, a = t(26, C = t(19, le = null))), t(24, A = performance.now()), t(25, v = 0), B = !0, ne();
  };
  function ne() {
    requestAnimationFrame(() => {
      t(25, v = (performance.now() - A) / 1e3), B && ne();
    });
  }
  function ce() {
    t(25, v = 0), t(0, a = t(26, C = t(19, le = null))), B && (B = !1);
  }
  h_(() => {
    B && ce();
  });
  let le = null;
  function E(g) {
    Bi[g ? "unshift" : "push"](() => {
      W = g, t(16, W), t(7, T), t(14, G), t(15, P);
    });
  }
  function F(g) {
    Bi[g ? "unshift" : "push"](() => {
      b = g, t(13, b);
    });
  }
  return n.$$set = (g) => {
    "i18n" in g && t(1, r = g.i18n), "eta" in g && t(0, a = g.eta), "queue_position" in g && t(2, o = g.queue_position), "queue_size" in g && t(3, f = g.queue_size), "status" in g && t(4, u = g.status), "scroll_to_output" in g && t(21, c = g.scroll_to_output), "timer" in g && t(5, d = g.timer), "show_progress" in g && t(6, m = g.show_progress), "message" in g && t(22, p = g.message), "progress" in g && t(7, T = g.progress), "variant" in g && t(8, k = g.variant), "loading_text" in g && t(9, y = g.loading_text), "absolute" in g && t(10, h = g.absolute), "translucent" in g && t(11, _ = g.translucent), "border" in g && t(12, w = g.border), "autoscroll" in g && t(23, S = g.autoscroll), "$$scope" in g && t(28, s = g.$$scope);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*eta, old_eta, timer_start, eta_from_start*/
    218103809 && (a === null && t(0, a = C), a != null && C !== a && (t(27, L = (performance.now() - A) / 1e3 + a), t(19, le = L.toFixed(1)), t(26, C = a))), n.$$.dirty[0] & /*eta_from_start, timer_diff*/
    167772160 && t(17, J = L === null || L <= 0 || !v ? null : Math.min(v / L, 1)), n.$$.dirty[0] & /*progress*/
    128 && T != null && t(18, fe = !1), n.$$.dirty[0] & /*progress, progress_level, progress_bar, last_progress_level*/
    114816 && (T != null ? t(14, G = T.map((g) => {
      if (g.index != null && g.length != null)
        return g.index / g.length;
      if (g.progress != null)
        return g.progress;
    })) : t(14, G = null), G ? (t(15, P = G[G.length - 1]), W && (P === 0 ? t(16, W.style.transition = "0", W) : t(16, W.style.transition = "150ms", W))) : t(15, P = void 0)), n.$$.dirty[0] & /*status*/
    16 && (u === "pending" ? I() : ce()), n.$$.dirty[0] & /*el, scroll_to_output, status, autoscroll*/
    10493968 && b && c && (u === "pending" || u === "complete") && S_(b, S), n.$$.dirty[0] & /*status, message*/
    4194320, n.$$.dirty[0] & /*timer_diff*/
    33554432 && t(20, l = v.toFixed(1));
  }, [
    a,
    r,
    o,
    f,
    u,
    d,
    m,
    T,
    k,
    y,
    h,
    _,
    w,
    b,
    G,
    P,
    W,
    J,
    fe,
    le,
    l,
    c,
    p,
    S,
    A,
    v,
    C,
    L,
    s,
    i,
    E,
    F
  ];
}
class N_ extends s_ {
  constructor(e) {
    super(), __(
      this,
      e,
      A_,
      I_,
      d_,
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
const {
  SvelteComponent: R_,
  append: kn,
  assign: L_,
  attr: K,
  binding_callbacks: ns,
  create_component: Ol,
  destroy_component: Il,
  detach: rn,
  element: ln,
  get_spread_object: M_,
  get_spread_update: F_,
  init: P_,
  insert: an,
  listen: Zt,
  mount_component: Sl,
  run_all: q_,
  safe_not_equal: Z_,
  set_data: z_,
  set_input_value: En,
  space: gl,
  text: V_,
  to_number: Al,
  transition_in: Nl,
  transition_out: Rl
} = window.__gradio__svelte__internal, { afterUpdate: B_ } = window.__gradio__svelte__internal;
function G_(n) {
  let e;
  return {
    c() {
      e = V_(
        /*label*/
        n[5]
      );
    },
    m(t, l) {
      an(t, e, l);
    },
    p(t, l) {
      l & /*label*/
      32 && z_(
        e,
        /*label*/
        t[5]
      );
    },
    d(t) {
      t && rn(e);
    }
  };
}
function j_(n) {
  let e, t, l, i, s, r, a, o, f, u, c, d, m, p, T;
  const k = [
    { autoscroll: (
      /*gradio*/
      n[1].autoscroll
    ) },
    { i18n: (
      /*gradio*/
      n[1].i18n
    ) },
    /*loading_status*/
    n[14]
  ];
  let y = {};
  for (let h = 0; h < k.length; h += 1)
    y = L_(y, k[h]);
  return e = new N_({ props: y }), r = new Ku({
    props: {
      show_label: (
        /*show_label*/
        n[13]
      ),
      info: (
        /*info*/
        n[6]
      ),
      $$slots: { default: [G_] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      Ol(e.$$.fragment), t = gl(), l = ln("div"), i = ln("div"), s = ln("label"), Ol(r.$$.fragment), a = gl(), o = ln("input"), u = gl(), c = ln("input"), K(
        s,
        "for",
        /*id*/
        n[18]
      ), K(o, "aria-label", f = `number input for ${/*label*/
      n[5]}`), K(o, "data-testid", "number-input"), K(o, "type", "number"), K(
        o,
        "min",
        /*minimum*/
        n[10]
      ), K(
        o,
        "max",
        /*maximum*/
        n[11]
      ), K(
        o,
        "step",
        /*step*/
        n[12]
      ), o.disabled = /*disabled*/
      n[17], K(o, "class", "svelte-x7uq94"), K(i, "class", "head svelte-x7uq94"), K(l, "class", "wrap svelte-x7uq94"), K(c, "type", "range"), K(
        c,
        "id",
        /*id*/
        n[18]
      ), K(c, "name", "cowbell"), K(
        c,
        "min",
        /*minimum*/
        n[10]
      ), K(
        c,
        "max",
        /*maximum*/
        n[11]
      ), K(
        c,
        "step",
        /*step*/
        n[12]
      ), c.disabled = /*disabled*/
      n[17], K(c, "aria-label", d = `range slider for ${/*label*/
      n[5]}`), K(c, "class", "svelte-x7uq94");
    },
    m(h, _) {
      Sl(e, h, _), an(h, t, _), an(h, l, _), kn(l, i), kn(i, s), Sl(r, s, null), kn(i, a), kn(i, o), En(
        o,
        /*value*/
        n[0]
      ), n[24](o), an(h, u, _), an(h, c, _), En(
        c,
        /*value*/
        n[0]
      ), n[26](c), m = !0, p || (T = [
        Zt(
          o,
          "input",
          /*input0_input_handler*/
          n[23]
        ),
        Zt(
          o,
          "blur",
          /*clamp*/
          n[20]
        ),
        Zt(
          o,
          "pointerup",
          /*handle_release*/
          n[19]
        ),
        Zt(
          c,
          "change",
          /*input1_change_input_handler*/
          n[25]
        ),
        Zt(
          c,
          "input",
          /*input1_change_input_handler*/
          n[25]
        ),
        Zt(
          c,
          "pointerup",
          /*handle_release*/
          n[19]
        )
      ], p = !0);
    },
    p(h, _) {
      const w = _ & /*gradio, loading_status*/
      16386 ? F_(k, [
        _ & /*gradio*/
        2 && { autoscroll: (
          /*gradio*/
          h[1].autoscroll
        ) },
        _ & /*gradio*/
        2 && { i18n: (
          /*gradio*/
          h[1].i18n
        ) },
        _ & /*loading_status*/
        16384 && M_(
          /*loading_status*/
          h[14]
        )
      ]) : {};
      e.$set(w);
      const S = {};
      _ & /*show_label*/
      8192 && (S.show_label = /*show_label*/
      h[13]), _ & /*info*/
      64 && (S.info = /*info*/
      h[6]), _ & /*$$scope, label*/
      1073741856 && (S.$$scope = { dirty: _, ctx: h }), r.$set(S), (!m || _ & /*label*/
      32 && f !== (f = `number input for ${/*label*/
      h[5]}`)) && K(o, "aria-label", f), (!m || _ & /*minimum*/
      1024) && K(
        o,
        "min",
        /*minimum*/
        h[10]
      ), (!m || _ & /*maximum*/
      2048) && K(
        o,
        "max",
        /*maximum*/
        h[11]
      ), (!m || _ & /*step*/
      4096) && K(
        o,
        "step",
        /*step*/
        h[12]
      ), (!m || _ & /*disabled*/
      131072) && (o.disabled = /*disabled*/
      h[17]), _ & /*value*/
      1 && Al(o.value) !== /*value*/
      h[0] && En(
        o,
        /*value*/
        h[0]
      ), (!m || _ & /*minimum*/
      1024) && K(
        c,
        "min",
        /*minimum*/
        h[10]
      ), (!m || _ & /*maximum*/
      2048) && K(
        c,
        "max",
        /*maximum*/
        h[11]
      ), (!m || _ & /*step*/
      4096) && K(
        c,
        "step",
        /*step*/
        h[12]
      ), (!m || _ & /*disabled*/
      131072) && (c.disabled = /*disabled*/
      h[17]), (!m || _ & /*label*/
      32 && d !== (d = `range slider for ${/*label*/
      h[5]}`)) && K(c, "aria-label", d), _ & /*value*/
      1 && En(
        c,
        /*value*/
        h[0]
      );
    },
    i(h) {
      m || (Nl(e.$$.fragment, h), Nl(r.$$.fragment, h), m = !0);
    },
    o(h) {
      Rl(e.$$.fragment, h), Rl(r.$$.fragment, h), m = !1;
    },
    d(h) {
      h && (rn(t), rn(l), rn(u), rn(c)), Il(e, h), Il(r), n[24](null), n[26](null), p = !1, q_(T);
    }
  };
}
function U_(n) {
  let e, t;
  return e = new _u({
    props: {
      visible: (
        /*visible*/
        n[4]
      ),
      elem_id: (
        /*elem_id*/
        n[2]
      ),
      elem_classes: (
        /*elem_classes*/
        n[3]
      ),
      container: (
        /*container*/
        n[7]
      ),
      scale: (
        /*scale*/
        n[8]
      ),
      min_width: (
        /*min_width*/
        n[9]
      ),
      $$slots: { default: [j_] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      Ol(e.$$.fragment);
    },
    m(l, i) {
      Sl(e, l, i), t = !0;
    },
    p(l, [i]) {
      const s = {};
      i & /*visible*/
      16 && (s.visible = /*visible*/
      l[4]), i & /*elem_id*/
      4 && (s.elem_id = /*elem_id*/
      l[2]), i & /*elem_classes*/
      8 && (s.elem_classes = /*elem_classes*/
      l[3]), i & /*container*/
      128 && (s.container = /*container*/
      l[7]), i & /*scale*/
      256 && (s.scale = /*scale*/
      l[8]), i & /*min_width*/
      512 && (s.min_width = /*min_width*/
      l[9]), i & /*$$scope, minimum, maximum, step, disabled, label, value, rangeInput, numberInput, show_label, info, gradio, loading_status*/
      1074003043 && (s.$$scope = { dirty: i, ctx: l }), e.$set(s);
    },
    i(l) {
      t || (Nl(e.$$.fragment, l), t = !0);
    },
    o(l) {
      Rl(e.$$.fragment, l), t = !1;
    },
    d(l) {
      Il(e, l);
    }
  };
}
let H_ = 0;
function W_(n, e, t) {
  let l, { gradio: i } = e, { elem_id: s = "" } = e, { elem_classes: r = [] } = e, { visible: a = !0 } = e, { value: o = 0 } = e, { label: f = i.i18n("slider.slider") } = e, { info: u = void 0 } = e, { container: c = !0 } = e, { scale: d = null } = e, { min_width: m = void 0 } = e, { minimum: p } = e, { maximum: T = 100 } = e, { step: k } = e, { show_label: y } = e, { interactive: h } = e, { loading_status: _ } = e, { value_is_output: w = !1 } = e, S, b;
  const B = `range_id_${H_++}`;
  function A() {
    i.dispatch("change"), w || i.dispatch("input");
  }
  B_(() => {
    t(21, w = !1), L();
  });
  function v(I) {
    i.dispatch("release", o);
  }
  function C() {
    i.dispatch("release", o), t(0, o = Math.min(Math.max(o, p), T));
  }
  function L() {
    J(), S.addEventListener("input", J), b.addEventListener("input", J);
  }
  function J() {
    const I = Number(S.value) - Number(S.min), ne = Number(S.max) - Number(S.min), ce = ne === 0 ? 0 : I / ne;
    t(15, S.style.backgroundSize = ce * 100 + "% 100%", S);
  }
  function G() {
    o = Al(this.value), t(0, o);
  }
  function P(I) {
    ns[I ? "unshift" : "push"](() => {
      b = I, t(16, b);
    });
  }
  function W() {
    o = Al(this.value), t(0, o);
  }
  function fe(I) {
    ns[I ? "unshift" : "push"](() => {
      S = I, t(15, S);
    });
  }
  return n.$$set = (I) => {
    "gradio" in I && t(1, i = I.gradio), "elem_id" in I && t(2, s = I.elem_id), "elem_classes" in I && t(3, r = I.elem_classes), "visible" in I && t(4, a = I.visible), "value" in I && t(0, o = I.value), "label" in I && t(5, f = I.label), "info" in I && t(6, u = I.info), "container" in I && t(7, c = I.container), "scale" in I && t(8, d = I.scale), "min_width" in I && t(9, m = I.min_width), "minimum" in I && t(10, p = I.minimum), "maximum" in I && t(11, T = I.maximum), "step" in I && t(12, k = I.step), "show_label" in I && t(13, y = I.show_label), "interactive" in I && t(22, h = I.interactive), "loading_status" in I && t(14, _ = I.loading_status), "value_is_output" in I && t(21, w = I.value_is_output);
  }, n.$$.update = () => {
    n.$$.dirty & /*interactive*/
    4194304 && t(17, l = !h), n.$$.dirty & /*value*/
    1 && A();
  }, [
    o,
    i,
    s,
    r,
    a,
    f,
    u,
    c,
    d,
    m,
    p,
    T,
    k,
    y,
    _,
    S,
    b,
    l,
    B,
    v,
    C,
    w,
    h,
    G,
    P,
    W,
    fe
  ];
}
let Y_ = class extends R_ {
  constructor(e) {
    super(), P_(this, e, W_, U_, Z_, {
      gradio: 1,
      elem_id: 2,
      elem_classes: 3,
      visible: 4,
      value: 0,
      label: 5,
      info: 6,
      container: 7,
      scale: 8,
      min_width: 9,
      minimum: 10,
      maximum: 11,
      step: 12,
      show_label: 13,
      interactive: 22,
      loading_status: 14,
      value_is_output: 21
    });
  }
};
const {
  SvelteComponent: K_,
  action_destroyer: Qs,
  add_flush_callback: Ln,
  append: R,
  assign: X_,
  attr: O,
  bind: Mn,
  binding_callbacks: Fn,
  check_outros: Pn,
  create_component: ye,
  destroy_component: ke,
  detach: qe,
  element: ue,
  ensure_array_like: xn,
  flush: De,
  get_spread_object: J_,
  get_spread_update: Q_,
  group_outros: qn,
  init: x_,
  insert: Ze,
  is_function: xs,
  listen: ct,
  mount_component: Ee,
  noop: $s,
  outro_and_destroy_block: eo,
  run_all: Ul,
  safe_not_equal: $_,
  set_data: Hl,
  space: pe,
  svg_element: re,
  text: Lt,
  transition_in: te,
  transition_out: se,
  update_keyed_each: to
} = window.__gradio__svelte__internal;
function ls(n, e, t) {
  const l = n.slice();
  return l[35] = e[t], l[36] = e, l[37] = t, l;
}
function is(n, e, t) {
  const l = n.slice();
  return l[38] = e[t], l[39] = e, l[40] = t, l;
}
function ss(n) {
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
    i = X_(i, l[s]);
  return e = new df({ props: i }), {
    c() {
      ye(e.$$.fragment);
    },
    m(s, r) {
      Ee(e, s, r), t = !0;
    },
    p(s, r) {
      const a = r[0] & /*gradio, loading_status*/
      1026 ? Q_(l, [
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
        1024 && J_(
          /*loading_status*/
          s[10]
        )
      ]) : {};
      e.$set(a);
    },
    i(s) {
      t || (te(e.$$.fragment, s), t = !0);
    },
    o(s) {
      se(e.$$.fragment, s), t = !1;
    },
    d(s) {
      ke(e, s);
    }
  };
}
function ec(n) {
  let e;
  return {
    c() {
      e = Lt(
        /*label*/
        n[2]
      );
    },
    m(t, l) {
      Ze(t, e, l);
    },
    p(t, l) {
      l[0] & /*label*/
      4 && Hl(
        e,
        /*label*/
        t[2]
      );
    },
    d(t) {
      t && qe(e);
    }
  };
}
function tc(n) {
  let e, t, l;
  return t = new As({}), {
    c() {
      e = ue("div"), ye(t.$$.fragment), O(e, "class", "icon-button svelte-dkw2bo");
    },
    m(i, s) {
      Ze(i, e, s), Ee(t, e, null), l = !0;
    },
    p: $s,
    i(i) {
      l || (te(t.$$.fragment, i), l = !0);
    },
    o(i) {
      se(t.$$.fragment, i), l = !1;
    },
    d(i) {
      i && qe(e), ke(t);
    }
  };
}
function nc(n) {
  let e, t, l;
  return t = new As({}), {
    c() {
      e = ue("div"), ye(t.$$.fragment), O(e, "class", "icon-button svelte-dkw2bo");
    },
    m(i, s) {
      Ze(i, e, s), Ee(t, e, null), l = !0;
    },
    p: $s,
    i(i) {
      l || (te(t.$$.fragment, i), l = !0);
    },
    o(i) {
      se(t.$$.fragment, i), l = !1;
    },
    d(i) {
      i && qe(e), ke(t);
    }
  };
}
function os(n, e) {
  let t, l, i, s, r = (
    /*j*/
    e[40] + 1 + ""
  ), a, o, f, u, c, d, m, p, T, k, y, h, _, w, S, b, B, A, v, C, L, J, G, P, W, fe, I, ne, ce, le, E, F, g;
  function Oe() {
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
  u = new Xn({
    props: {
      $$slots: { default: [nc] },
      $$scope: { ctx: e }
    }
  }), u.$on("click", Oe);
  function Ie(X) {
    e[25](
      X,
      /*i*/
      e[37],
      /*j*/
      e[40]
    );
  }
  let Je = {
    gradio: (
      /*gradio*/
      e[1]
    ),
    interactive: (
      /*interactive*/
      e[11]
    ),
    minimum: 2,
    maximum: 10,
    container: !1,
    label: "Length (seconds) *"
  };
  /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].length !== void 0 && (Je.value = /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].length), L = new Y_({ props: Je }), Fn.push(() => Mn(L, "value", Ie)), L.$on(
    "input",
    /*handle_change*/
    e[16]
  );
  function je(X) {
    e[26](
      X,
      /*i*/
      e[37],
      /*j*/
      e[40]
    );
  }
  let Tt = {
    type: "text",
    label: "Scene description *",
    placeholder: (
      /*placeholder*/
      e[6]
    ),
    disabled: !/*interactive*/
    e[11]
  };
  /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].scene_description !== void 0 && (Tt.value = /*value*/
  e[0][
    /*i*/
    e[37]
  ].actions[
    /*j*/
    e[40]
  ].scene_description), P = new Tl({ props: Tt }), Fn.push(() => Mn(P, "value", je)), P.$on(
    "input",
    /*handle_change*/
    e[16]
  );
  function $t(X) {
    e[27](
      X,
      /*i*/
      e[37],
      /*j*/
      e[40]
    );
  }
  let Mt = {
    type: "text",
    label: "Motion description",
    placeholder: (
      /*placeholder*/
      e[6]
    ),
    disabled: !/*interactive*/
    e[11]
  };
  return (
    /*value*/
    e[0][
      /*i*/
      e[37]
    ].actions[
      /*j*/
      e[40]
    ].motion_description !== void 0 && (Mt.value = /*value*/
    e[0][
      /*i*/
      e[37]
    ].actions[
      /*j*/
      e[40]
    ].motion_description), I = new Tl({ props: Mt }), Fn.push(() => Mn(I, "value", $t)), I.$on(
      "input",
      /*handle_change*/
      e[16]
    ), {
      key: n,
      first: null,
      c() {
        t = ue("div"), l = ue("div"), i = ue("div"), s = Lt("Action #"), a = Lt(r), o = pe(), f = ue("div"), ye(u.$$.fragment), c = pe(), d = ue("div"), m = re("svg"), p = re("g"), T = re("g"), k = re("g"), y = re("path"), h = re("path"), _ = re("path"), w = re("path"), S = re("path"), b = re("path"), v = pe(), C = ue("div"), ye(L.$$.fragment), G = pe(), ye(P.$$.fragment), fe = pe(), ye(I.$$.fragment), ce = pe(), le = ue("hr"), O(i, "class", "scene-title svelte-dkw2bo"), O(p, "id", "SVGRepo_bgCarrier"), O(p, "stroke-width", "0"), O(T, "id", "SVGRepo_tracerCarrier"), O(T, "stroke-linecap", "round"), O(T, "stroke-linejoin", "round"), O(y, "d", "M5.99499 7C4.89223 7 4 7.9 4 9C4 10.1 4.89223 11 5.99499 11C7.09774 11 8 10.1 8 9C8 7.9 7.09774 7 5.99499 7Z"), O(y, "fill", "#000000"), O(h, "d", "M11.995 7C10.8922 7 10 7.9 10 9C10 10.1 10.8922 11 11.995 11C13.0977 11 14 10.1 14 9C14 7.9 13.0977 7 11.995 7Z"), O(h, "fill", "#000000"), O(_, "d", "M17.995 7C16.8922 7 16 7.9 16 9C16 10.1 16.8922 11 17.995 11C19.0977 11 20 10.1 20 9C20 7.9 19.0977 7 17.995 7Z"), O(_, "fill", "#000000"), O(w, "d", "M17.995 13C16.8922 13 16 13.9 16 15C16 16.1 16.8922 17 17.995 17C19.0977 17 20 16.1 20 15C20 13.9 19.0977 13 17.995 13Z"), O(w, "fill", "#000000"), O(S, "d", "M11.995 13C10.8922 13 10 13.9 10 15C10 16.1 10.8922 17 11.995 17C13.0977 17 14 16.1 14 15C14 13.9 13.0977 13 11.995 13Z"), O(S, "fill", "#000000"), O(b, "d", "M5.99499 13C4.89223 13 4 13.9 4 15C4 16.1 4.89223 17 5.99499 17C7.09774 17 8 16.1 8 15C8 13.9 7.09774 13 5.99499 13Z"), O(b, "fill", "#000000"), O(k, "id", "SVGRepo_iconCarrier"), O(m, "viewBox", "0 0 24 24"), O(m, "fill", "none"), O(m, "xmlns", "http://www.w3.org/2000/svg"), O(d, "tabindex", B = /*dragDisabled*/
        e[15] ? 0 : -1), O(d, "aria-label", "drag-handle"), O(d, "class", "handle svelte-dkw2bo"), O(d, "style", A = /*dragDisabled*/
        e[15] ? "cursor: grab" : "cursor: grabbing"), O(f, "class", "scene-actions svelte-dkw2bo"), O(l, "class", "scene-header svelte-dkw2bo"), O(C, "class", "slider svelte-dkw2bo"), O(le, "class", "hr-action svelte-dkw2bo"), this.first = t;
      },
      m(X, N) {
        Ze(X, t, N), R(t, l), R(l, i), R(i, s), R(i, a), R(l, o), R(l, f), Ee(u, f, null), R(f, c), R(f, d), R(d, m), R(m, p), R(m, T), R(m, k), R(k, y), R(k, h), R(k, _), R(k, w), R(k, S), R(k, b), R(t, v), R(t, C), Ee(L, C, null), R(t, G), Ee(P, t, null), R(t, fe), Ee(I, t, null), R(t, ce), R(t, le), E = !0, F || (g = [
          ct(
            d,
            "mousedown",
            /*startDrag*/
            e[20]
          ),
          ct(
            d,
            "touchstart",
            /*startDrag*/
            e[20]
          )
        ], F = !0);
      },
      p(X, N) {
        e = X, (!E || N[0] & /*value*/
        1) && r !== (r = /*j*/
        e[40] + 1 + "") && Hl(a, r);
        const j = {};
        N[1] & /*$$scope*/
        1024 && (j.$$scope = { dirty: N, ctx: e }), u.$set(j), (!E || N[0] & /*dragDisabled*/
        32768 && B !== (B = /*dragDisabled*/
        e[15] ? 0 : -1)) && O(d, "tabindex", B), (!E || N[0] & /*dragDisabled*/
        32768 && A !== (A = /*dragDisabled*/
        e[15] ? "cursor: grab" : "cursor: grabbing")) && O(d, "style", A);
        const de = {};
        N[0] & /*gradio*/
        2 && (de.gradio = /*gradio*/
        e[1]), N[0] & /*interactive*/
        2048 && (de.interactive = /*interactive*/
        e[11]), !J && N[0] & /*value*/
        1 && (J = !0, de.value = /*value*/
        e[0][
          /*i*/
          e[37]
        ].actions[
          /*j*/
          e[40]
        ].length, Ln(() => J = !1)), L.$set(de);
        const Le = {};
        N[0] & /*placeholder*/
        64 && (Le.placeholder = /*placeholder*/
        e[6]), N[0] & /*interactive*/
        2048 && (Le.disabled = !/*interactive*/
        e[11]), !W && N[0] & /*value*/
        1 && (W = !0, Le.value = /*value*/
        e[0][
          /*i*/
          e[37]
        ].actions[
          /*j*/
          e[40]
        ].scene_description, Ln(() => W = !1)), P.$set(Le);
        const ft = {};
        N[0] & /*placeholder*/
        64 && (ft.placeholder = /*placeholder*/
        e[6]), N[0] & /*interactive*/
        2048 && (ft.disabled = !/*interactive*/
        e[11]), !ne && N[0] & /*value*/
        1 && (ne = !0, ft.value = /*value*/
        e[0][
          /*i*/
          e[37]
        ].actions[
          /*j*/
          e[40]
        ].motion_description, Ln(() => ne = !1)), I.$set(ft);
      },
      i(X) {
        E || (te(u.$$.fragment, X), te(L.$$.fragment, X), te(P.$$.fragment, X), te(I.$$.fragment, X), E = !0);
      },
      o(X) {
        se(u.$$.fragment, X), se(L.$$.fragment, X), se(P.$$.fragment, X), se(I.$$.fragment, X), E = !1;
      },
      d(X) {
        X && qe(t), ke(u), ke(L), ke(P), ke(I), F = !1, Ul(g);
      }
    }
  );
}
function lc(n) {
  let e;
  return {
    c() {
      e = Lt("New action");
    },
    m(t, l) {
      Ze(t, e, l);
    },
    d(t) {
      t && qe(e);
    }
  };
}
function rs(n, e) {
  let t, l, i, s, r = (
    /*i*/
    e[37] + 1 + ""
  ), a, o, f, u, c, d, m, p, T, k, y, h, _, w, S, b, B, A, v, C, L, J, G, P = [], W = /* @__PURE__ */ new Map(), fe, I, ne, ce, le, E, F, g;
  function Oe() {
    return (
      /*click_handler*/
      e[22](
        /*i*/
        e[37]
      )
    );
  }
  u = new Xn({
    props: {
      $$slots: { default: [tc] },
      $$scope: { ctx: e }
    }
  }), u.$on("click", Oe);
  function Ie(N) {
    e[23](
      N,
      /*i*/
      e[37]
    );
  }
  let Je = {
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
  ].character_description !== void 0 && (Je.value = /*value*/
  e[0][
    /*i*/
    e[37]
  ].character_description), C = new Tl({ props: Je }), Fn.push(() => Mn(C, "value", Ie)), C.$on(
    "input",
    /*handle_change*/
    e[16]
  );
  let je = xn(
    /*scene*/
    e[35].actions
  );
  const Tt = (N) => (
    /*action*/
    N[38].id
  );
  for (let N = 0; N < je.length; N += 1) {
    let j = is(e, je, N), de = Tt(j);
    W.set(de, P[N] = os(de, j));
  }
  function $t() {
    return (
      /*click_handler_2*/
      e[28](
        /*i*/
        e[37]
      )
    );
  }
  I = new Xn({
    props: {
      $$slots: { default: [lc] },
      $$scope: { ctx: e }
    }
  }), I.$on("click", $t);
  function Mt(...N) {
    return (
      /*consider_handler*/
      e[29](
        /*i*/
        e[37],
        ...N
      )
    );
  }
  function X(...N) {
    return (
      /*finalize_handler*/
      e[30](
        /*i*/
        e[37],
        ...N
      )
    );
  }
  return {
    key: n,
    first: null,
    c() {
      t = ue("div"), l = ue("div"), i = ue("div"), s = Lt("Scene #"), a = Lt(r), o = pe(), f = ue("div"), ye(u.$$.fragment), c = pe(), d = ue("div"), m = re("svg"), p = re("g"), T = re("g"), k = re("g"), y = re("path"), h = re("path"), _ = re("path"), w = re("path"), S = re("path"), b = re("path"), v = pe(), ye(C.$$.fragment), J = pe(), G = ue("div");
      for (let N = 0; N < P.length; N += 1)
        P[N].c();
      fe = pe(), ye(I.$$.fragment), ce = pe(), le = ue("hr"), O(i, "class", "scene-title svelte-dkw2bo"), O(p, "id", "SVGRepo_bgCarrier"), O(p, "stroke-width", "0"), O(T, "id", "SVGRepo_tracerCarrier"), O(T, "stroke-linecap", "round"), O(T, "stroke-linejoin", "round"), O(y, "d", "M5.99499 7C4.89223 7 4 7.9 4 9C4 10.1 4.89223 11 5.99499 11C7.09774 11 8 10.1 8 9C8 7.9 7.09774 7 5.99499 7Z"), O(y, "fill", "#000000"), O(h, "d", "M11.995 7C10.8922 7 10 7.9 10 9C10 10.1 10.8922 11 11.995 11C13.0977 11 14 10.1 14 9C14 7.9 13.0977 7 11.995 7Z"), O(h, "fill", "#000000"), O(_, "d", "M17.995 7C16.8922 7 16 7.9 16 9C16 10.1 16.8922 11 17.995 11C19.0977 11 20 10.1 20 9C20 7.9 19.0977 7 17.995 7Z"), O(_, "fill", "#000000"), O(w, "d", "M17.995 13C16.8922 13 16 13.9 16 15C16 16.1 16.8922 17 17.995 17C19.0977 17 20 16.1 20 15C20 13.9 19.0977 13 17.995 13Z"), O(w, "fill", "#000000"), O(S, "d", "M11.995 13C10.8922 13 10 13.9 10 15C10 16.1 10.8922 17 11.995 17C13.0977 17 14 16.1 14 15C14 13.9 13.0977 13 11.995 13Z"), O(S, "fill", "#000000"), O(b, "d", "M5.99499 13C4.89223 13 4 13.9 4 15C4 16.1 4.89223 17 5.99499 17C7.09774 17 8 16.1 8 15C8 13.9 7.09774 13 5.99499 13Z"), O(b, "fill", "#000000"), O(k, "id", "SVGRepo_iconCarrier"), O(m, "viewBox", "0 0 24 24"), O(m, "fill", "none"), O(m, "xmlns", "http://www.w3.org/2000/svg"), O(d, "tabindex", B = /*dragDisabled*/
      e[15] ? 0 : -1), O(d, "aria-label", "drag-handle"), O(d, "class", "handle svelte-dkw2bo"), O(d, "style", A = /*dragDisabled*/
      e[15] ? "cursor: grab" : "cursor: grabbing"), O(f, "class", "scene-actions svelte-dkw2bo"), O(l, "class", "scene-header svelte-dkw2bo"), O(G, "class", "actions svelte-dkw2bo"), O(le, "class", "hr-scene svelte-dkw2bo"), O(t, "class", "scene"), this.first = t;
    },
    m(N, j) {
      Ze(N, t, j), R(t, l), R(l, i), R(i, s), R(i, a), R(l, o), R(l, f), Ee(u, f, null), R(f, c), R(f, d), R(d, m), R(m, p), R(m, T), R(m, k), R(k, y), R(k, h), R(k, _), R(k, w), R(k, S), R(k, b), R(t, v), Ee(C, t, null), R(t, J), R(t, G);
      for (let de = 0; de < P.length; de += 1)
        P[de] && P[de].m(G, null);
      R(G, fe), Ee(I, G, null), R(t, ce), R(t, le), E = !0, F || (g = [
        ct(
          d,
          "mousedown",
          /*startDrag*/
          e[20]
        ),
        ct(
          d,
          "touchstart",
          /*startDrag*/
          e[20]
        ),
        Qs(ne = Ds.call(null, G, {
          items: (
            /*scene*/
            e[35].actions
          ),
          dragDisabled: (
            /*dragDisabled*/
            e[15]
          ),
          flipDurationMs: $n,
          type: "action"
        })),
        ct(G, "consider", Mt),
        ct(G, "finalize", X)
      ], F = !0);
    },
    p(N, j) {
      e = N, (!E || j[0] & /*value*/
      1) && r !== (r = /*i*/
      e[37] + 1 + "") && Hl(a, r);
      const de = {};
      j[1] & /*$$scope*/
      1024 && (de.$$scope = { dirty: j, ctx: e }), u.$set(de), (!E || j[0] & /*dragDisabled*/
      32768 && B !== (B = /*dragDisabled*/
      e[15] ? 0 : -1)) && O(d, "tabindex", B), (!E || j[0] & /*dragDisabled*/
      32768 && A !== (A = /*dragDisabled*/
      e[15] ? "cursor: grab" : "cursor: grabbing")) && O(d, "style", A);
      const Le = {};
      j[0] & /*placeholder*/
      64 && (Le.placeholder = /*placeholder*/
      e[6]), j[0] & /*interactive*/
      2048 && (Le.disabled = !/*interactive*/
      e[11]), j[0] & /*rtl*/
      4096 && (Le.dir = /*rtl*/
      e[12] ? "rtl" : "ltr"), !L && j[0] & /*value*/
      1 && (L = !0, Le.value = /*value*/
      e[0][
        /*i*/
        e[37]
      ].character_description, Ln(() => L = !1)), C.$set(Le), j[0] & /*placeholder, interactive, value, handle_change, gradio, dragDisabled, startDrag*/
      1148995 && (je = xn(
        /*scene*/
        e[35].actions
      ), qn(), P = to(P, j, Tt, 1, e, je, W, G, eo, os, fe, is), Pn());
      const ft = {};
      j[1] & /*$$scope*/
      1024 && (ft.$$scope = { dirty: j, ctx: e }), I.$set(ft), ne && xs(ne.update) && j[0] & /*value, dragDisabled*/
      32769 && ne.update.call(null, {
        items: (
          /*scene*/
          e[35].actions
        ),
        dragDisabled: (
          /*dragDisabled*/
          e[15]
        ),
        flipDurationMs: $n,
        type: "action"
      });
    },
    i(N) {
      if (!E) {
        te(u.$$.fragment, N), te(C.$$.fragment, N);
        for (let j = 0; j < je.length; j += 1)
          te(P[j]);
        te(I.$$.fragment, N), E = !0;
      }
    },
    o(N) {
      se(u.$$.fragment, N), se(C.$$.fragment, N);
      for (let j = 0; j < P.length; j += 1)
        se(P[j]);
      se(I.$$.fragment, N), E = !1;
    },
    d(N) {
      N && qe(t), ke(u), ke(C);
      for (let j = 0; j < P.length; j += 1)
        P[j].d();
      ke(I), F = !1, Ul(g);
    }
  };
}
function ic(n) {
  let e;
  return {
    c() {
      e = Lt("New scene");
    },
    m(t, l) {
      Ze(t, e, l);
    },
    d(t) {
      t && qe(e);
    }
  };
}
function sc(n) {
  let e, t;
  return e = new Ss({}), {
    c() {
      ye(e.$$.fragment);
    },
    m(l, i) {
      Ee(e, l, i), t = !0;
    },
    i(l) {
      t || (te(e.$$.fragment, l), t = !0);
    },
    o(l) {
      se(e.$$.fragment, l), t = !1;
    },
    d(l) {
      ke(e, l);
    }
  };
}
function oc(n) {
  let e, t;
  return e = new Is({}), {
    c() {
      ye(e.$$.fragment);
    },
    m(l, i) {
      Ee(e, l, i), t = !0;
    },
    i(l) {
      t || (te(e.$$.fragment, l), t = !0);
    },
    o(l) {
      se(e.$$.fragment, l), t = !1;
    },
    d(l) {
      ke(e, l);
    }
  };
}
function rc(n) {
  let e, t, l, i, s = [], r = /* @__PURE__ */ new Map(), a, o, f, u, c, d, m, p, T, k, y, h, _ = (
    /*loading_status*/
    n[10] && ss(n)
  );
  t = new Ls({
    props: {
      show_label: (
        /*show_label*/
        n[7]
      ),
      info: void 0,
      $$slots: { default: [ec] },
      $$scope: { ctx: n }
    }
  });
  let w = xn(
    /*value*/
    n[0]
  );
  const S = (v) => (
    /*scene*/
    v[35].id
  );
  for (let v = 0; v < w.length; v += 1) {
    let C = ls(n, w, v), L = S(C);
    r.set(L, s[v] = rs(L, C));
  }
  o = new Xn({
    props: {
      $$slots: { default: [ic] },
      $$scope: { ctx: n }
    }
  }), o.$on(
    "click",
    /*click_handler_3*/
    n[31]
  );
  const b = [oc, sc], B = [];
  function A(v, C) {
    return (
      /*copied*/
      v[13] ? 0 : 1
    );
  }
  return d = A(n), m = B[d] = b[d](n), {
    c() {
      _ && _.c(), e = pe(), ye(t.$$.fragment), l = pe(), i = ue("div");
      for (let v = 0; v < s.length; v += 1)
        s[v].c();
      a = pe(), ye(o.$$.fragment), u = pe(), c = ue("button"), m.c(), O(i, "class", "scroll svelte-dkw2bo"), O(c, "title", "copy"), O(c, "class", "json-copy-button svelte-dkw2bo"), O(c, "aria-roledescription", p = /*copied*/
      n[13] ? "Copied value" : "Copy value"), O(c, "aria-label", T = /*copied*/
      n[13] ? "Copied" : "Copy");
    },
    m(v, C) {
      _ && _.m(v, C), Ze(v, e, C), Ee(t, v, C), Ze(v, l, C), Ze(v, i, C);
      for (let L = 0; L < s.length; L += 1)
        s[L] && s[L].m(i, null);
      R(i, a), Ee(o, i, null), Ze(v, u, C), Ze(v, c, C), B[d].m(c, null), k = !0, y || (h = [
        Qs(f = Ds.call(null, i, {
          items: (
            /*value*/
            n[0]
          ),
          dragDisabled: (
            /*dragDisabled*/
            n[15]
          ),
          flipDurationMs: $n,
          type: "scene"
        })),
        ct(
          i,
          "consider",
          /*handleConsider*/
          n[18]
        ),
        ct(
          i,
          "finalize",
          /*handleFinalize*/
          n[19]
        ),
        ct(
          c,
          "click",
          /*handle_copy*/
          n[17]
        )
      ], y = !0);
    },
    p(v, C) {
      /*loading_status*/
      v[10] ? _ ? (_.p(v, C), C[0] & /*loading_status*/
      1024 && te(_, 1)) : (_ = ss(v), _.c(), te(_, 1), _.m(e.parentNode, e)) : _ && (qn(), se(_, 1, 1, () => {
        _ = null;
      }), Pn());
      const L = {};
      C[0] & /*show_label*/
      128 && (L.show_label = /*show_label*/
      v[7]), C[0] & /*label*/
      4 | C[1] & /*$$scope*/
      1024 && (L.$$scope = { dirty: C, ctx: v }), t.$set(L), C[0] & /*value, dragDisabled, handleConsider, handleFinalize, id, placeholder, interactive, handle_change, gradio, startDrag, rtl*/
      1955907 && (w = xn(
        /*value*/
        v[0]
      ), qn(), s = to(s, C, S, 1, v, w, r, i, eo, rs, a, ls), Pn());
      const J = {};
      C[1] & /*$$scope*/
      1024 && (J.$$scope = { dirty: C, ctx: v }), o.$set(J), f && xs(f.update) && C[0] & /*value, dragDisabled*/
      32769 && f.update.call(null, {
        items: (
          /*value*/
          v[0]
        ),
        dragDisabled: (
          /*dragDisabled*/
          v[15]
        ),
        flipDurationMs: $n,
        type: "scene"
      });
      let G = d;
      d = A(v), d !== G && (qn(), se(B[G], 1, 1, () => {
        B[G] = null;
      }), Pn(), m = B[d], m || (m = B[d] = b[d](v), m.c()), te(m, 1), m.m(c, null)), (!k || C[0] & /*copied*/
      8192 && p !== (p = /*copied*/
      v[13] ? "Copied value" : "Copy value")) && O(c, "aria-roledescription", p), (!k || C[0] & /*copied*/
      8192 && T !== (T = /*copied*/
      v[13] ? "Copied" : "Copy")) && O(c, "aria-label", T);
    },
    i(v) {
      if (!k) {
        te(_), te(t.$$.fragment, v);
        for (let C = 0; C < w.length; C += 1)
          te(s[C]);
        te(o.$$.fragment, v), te(m), k = !0;
      }
    },
    o(v) {
      se(_), se(t.$$.fragment, v);
      for (let C = 0; C < s.length; C += 1)
        se(s[C]);
      se(o.$$.fragment, v), se(m), k = !1;
    },
    d(v) {
      v && (qe(e), qe(l), qe(i), qe(u), qe(c)), _ && _.d(v), ke(t, v);
      for (let C = 0; C < s.length; C += 1)
        s[C].d();
      ke(o), B[d].d(), y = !1, Ul(h);
    }
  };
}
function ac(n) {
  let e, t;
  return e = new Wr({
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
      $$slots: { default: [rc] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      ye(e.$$.fragment);
    },
    m(l, i) {
      Ee(e, l, i), t = !0;
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
      l[9]), i[0] & /*copied, value, dragDisabled, id, placeholder, interactive, gradio, rtl, show_label, label, loading_status*/
      64711 | i[1] & /*$$scope*/
      1024 && (s.$$scope = { dirty: i, ctx: l }), e.$set(s);
    },
    i(l) {
      t || (te(e.$$.fragment, l), t = !0);
    },
    o(l) {
      se(e.$$.fragment, l), t = !1;
    },
    d(l) {
      ke(e, l);
    }
  };
}
const $n = 200;
function fc(n, e, t) {
  let { gradio: l } = e, { label: i = "Textbox" } = e, { elem_id: s = "" } = e, { elem_classes: r = [] } = e, { visible: a = !0 } = e, { value: o = [] } = e, { placeholder: f = "" } = e, { show_label: u } = e, { scale: c = null } = e, { min_width: d = void 0 } = e, { loading_status: m = void 0 } = e, { value_is_output: p = !1 } = e, { interactive: T } = e, { rtl: k = !1 } = e, y = !1, h, _ = 0;
  function w() {
    l.dispatch("change"), p || l.dispatch("input");
  }
  function S() {
    t(13, y = !0), h && clearTimeout(h), h = setTimeout(
      () => {
        t(13, y = !1);
      },
      1e3
    );
  }
  async function b() {
    const E = JSON.parse(JSON.stringify(o));
    E.forEach((Je) => {
      delete Je.id, Je.actions.forEach((je) => {
        delete je.id;
      });
    });
    const F = JSON.stringify(E, null, 2), g = new Blob([F], { type: "application/json" }), Oe = URL.createObjectURL(g), Ie = document.createElement("a");
    Ie.href = Oe, Ie.download = "scenario.json", document.body.appendChild(Ie), Ie.click(), Ie.remove(), S();
  }
  function B(E, F = void 0) {
    const { items: g, info: { source: Oe, trigger: Ie } } = E.detail;
    typeof F < "u" ? t(0, o[F].actions = g, o) : t(0, o = g), Oe === ve.KEYBOARD && Ie === we.DRAG_STOPPED && t(15, C = !0);
  }
  function A(E, F = void 0) {
    const { items: g, info: { source: Oe } } = E.detail;
    typeof F < "u" ? t(0, o[F].actions = g, o) : t(0, o = g), Oe === ve.POINTER && t(15, C = !0);
  }
  function v(E) {
    E.preventDefault(), t(15, C = !1);
  }
  let C = !0;
  const L = (E) => {
    t(0, o = o.filter((F, g) => g !== E));
  };
  function J(E, F) {
    n.$$.not_equal(o[F].character_description, E) && (o[F].character_description = E, t(0, o));
  }
  const G = (E, F) => {
    t(0, o[E].actions = o[E].actions.filter((g, Oe) => Oe !== F), o);
  };
  function P(E, F, g) {
    n.$$.not_equal(o[F].actions[g].length, E) && (o[F].actions[g].length = E, t(0, o));
  }
  function W(E, F, g) {
    n.$$.not_equal(o[F].actions[g].scene_description, E) && (o[F].actions[g].scene_description = E, t(0, o));
  }
  function fe(E, F, g) {
    n.$$.not_equal(o[F].actions[g].motion_description, E) && (o[F].actions[g].motion_description = E, t(0, o));
  }
  const I = (E) => {
    t(
      0,
      o[E].actions = [
        ...o[E].actions,
        {
          length: 2,
          motion_description: "",
          scene_description: "",
          id: t(14, _++, _)
        }
      ],
      o
    ), t(0, o);
  }, ne = (E, F) => B(F, E), ce = (E, F) => A(F, E), le = () => {
    t(0, o = [
      ...o,
      {
        character_description: "",
        actions: [],
        id: t(14, _++, _)
      }
    ]);
  };
  return n.$$set = (E) => {
    "gradio" in E && t(1, l = E.gradio), "label" in E && t(2, i = E.label), "elem_id" in E && t(3, s = E.elem_id), "elem_classes" in E && t(4, r = E.elem_classes), "visible" in E && t(5, a = E.visible), "value" in E && t(0, o = E.value), "placeholder" in E && t(6, f = E.placeholder), "show_label" in E && t(7, u = E.show_label), "scale" in E && t(8, c = E.scale), "min_width" in E && t(9, d = E.min_width), "loading_status" in E && t(10, m = E.loading_status), "value_is_output" in E && t(21, p = E.value_is_output), "interactive" in E && t(11, T = E.interactive), "rtl" in E && t(12, k = E.rtl);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*value*/
    1 && t(14, _ = o.reduce(
      (E, F) => Math.max(E, F.id, ...F.actions.map((g) => g.id)),
      0
    ) + 1), n.$$.dirty[0] & /*value*/
    1 && w();
  }, [
    o,
    l,
    i,
    s,
    r,
    a,
    f,
    u,
    c,
    d,
    m,
    T,
    k,
    y,
    _,
    C,
    w,
    b,
    B,
    A,
    v,
    p,
    L,
    J,
    G,
    P,
    W,
    fe,
    I,
    ne,
    ce,
    le
  ];
}
class hc extends K_ {
  constructor(e) {
    super(), x_(
      this,
      e,
      fc,
      ac,
      $_,
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
    this.$$set({ gradio: e }), De();
  }
  get label() {
    return this.$$.ctx[2];
  }
  set label(e) {
    this.$$set({ label: e }), De();
  }
  get elem_id() {
    return this.$$.ctx[3];
  }
  set elem_id(e) {
    this.$$set({ elem_id: e }), De();
  }
  get elem_classes() {
    return this.$$.ctx[4];
  }
  set elem_classes(e) {
    this.$$set({ elem_classes: e }), De();
  }
  get visible() {
    return this.$$.ctx[5];
  }
  set visible(e) {
    this.$$set({ visible: e }), De();
  }
  get value() {
    return this.$$.ctx[0];
  }
  set value(e) {
    this.$$set({ value: e }), De();
  }
  get placeholder() {
    return this.$$.ctx[6];
  }
  set placeholder(e) {
    this.$$set({ placeholder: e }), De();
  }
  get show_label() {
    return this.$$.ctx[7];
  }
  set show_label(e) {
    this.$$set({ show_label: e }), De();
  }
  get scale() {
    return this.$$.ctx[8];
  }
  set scale(e) {
    this.$$set({ scale: e }), De();
  }
  get min_width() {
    return this.$$.ctx[9];
  }
  set min_width(e) {
    this.$$set({ min_width: e }), De();
  }
  get loading_status() {
    return this.$$.ctx[10];
  }
  set loading_status(e) {
    this.$$set({ loading_status: e }), De();
  }
  get value_is_output() {
    return this.$$.ctx[21];
  }
  set value_is_output(e) {
    this.$$set({ value_is_output: e }), De();
  }
  get interactive() {
    return this.$$.ctx[11];
  }
  set interactive(e) {
    this.$$set({ interactive: e }), De();
  }
  get rtl() {
    return this.$$.ctx[12];
  }
  set rtl(e) {
    this.$$set({ rtl: e }), De();
  }
}
export {
  hc as default
};
