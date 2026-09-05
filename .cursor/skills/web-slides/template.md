---
name: web-slides-template
description: 網頁式簡報章節式（連續捲動）最小模板；由 web-slides skill 引用。
---

# 網頁式簡報｜章節式最小模板

新建 deck 依此骨架。預設**連續捲動分章**，不要做成全螢幕分頁。路徑見 [SKILL.md](SKILL.md)。

## index.html 骨架

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <title>簡報標題</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="brand-bar" aria-hidden="true"></div>

  <header class="report-header">
    <div>
      <p class="eyebrow">Weekly Report</p>
      <h1>報告主標題</h1>
      <p class="support">日期｜場合</p>
    </div>
    <nav class="toc" aria-label="章節導覽">
      <a href="#ch-a">01 章名 A</a>
      <a href="#ch-b">02 章名 B</a>
    </nav>
  </header>

  <main class="report">
    <section class="chapter" id="ch-a">
      <header class="chapter__head">
        <p class="chapter__num">01</p>
        <div>
          <h2>章 A 的主張句</h2>
          <p class="support">一行補充</p>
        </div>
      </header>
      <!-- 本體：高度隨內容，不設 min-height: 100vh -->
      <div class="gallery" data-gallery="ch-a">
        <button type="button" class="media media--face" data-full="assets/photo.jpg">
          <img src="assets/photo.jpg" alt="說明這張在講什麼" />
        </button>
        <button type="button" class="media media--video" data-video="yt:VIDEO_ID">
          <img src="assets/poster.jpg" alt="影片標題" />
          <span class="media__badge">播放影片</span>
        </button>
        <button type="button" class="media" data-full="assets/photo-b.jpg">
          <img src="assets/photo-b.jpg" alt="同主題第二張現場照" />
        </button>
      </div>
    </section>

    <section class="chapter" id="ch-b">
      <header class="chapter__head">
        <p class="chapter__num">02</p>
        <div>
          <h2>章 B 的主張句</h2>
          <p class="support">一行補充</p>
        </div>
      </header>
    </section>
  </main>

  <div id="lightbox" class="lightbox" aria-hidden="true" role="dialog" aria-label="放大檢視">
    <button type="button" class="lightbox__close" aria-label="關閉">×</button>
    <button type="button" class="lightbox__btn lightbox__prev" aria-label="上一張">‹</button>
    <div class="lightbox__stage"></div>
    <button type="button" class="lightbox__btn lightbox__next" aria-label="下一張">›</button>
    <p class="lightbox__caption"></p>
  </div>

  <script src="deck.js"></script>
</body>
</html>
```

## styles.css 責任

1. tokens（見 [design.md](design.md)）
2. `body` **可垂直捲動**；章節 `height: auto`
3. sticky 報告頭／TOC 時，章節設 `scroll-margin-top`
4. **禁止**預設：`html, body { height:100%; overflow:hidden }` + `.slide { height:100% }`
5. 照片／影片 lightbox：遮罩蓋過 sticky 頭；大圖 `max-height: 82vh`；影片 iframe 固定可視高度
6. 現場照拼貼：12 欄 grid、依張數定位、`--tilt` 微傾；hover 用 `--lift` 放大並提高 `z-index`（見下方）

```css
html { scroll-behavior: smooth; }
body { margin: 0; overflow-y: auto; }
.chapter { padding: 1.5rem 0; scroll-margin-top: 5.5rem; }
.chapter__asset img,
.media img { display: block; width: 100%; height: auto; }
.media { padding: 0; border: 0; background: none; cursor: zoom-in; }
.media--video { cursor: pointer; }
.media__badge {
  position: absolute; left: 0.75rem; bottom: 0.75rem;
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.48rem 0.85rem; border-radius: 6px;
  font-size: 1.05rem; font-weight: 700;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
}
.media__badge::before {
  content: ""; width: 0; height: 0;
  border-style: solid; border-width: 0.55rem 0 0.55rem 0.92rem;
  border-color: transparent transparent transparent var(--play);
}
.lightbox { display: none; position: fixed; inset: 0; z-index: 80; background: rgba(6,6,8,.88); }
.lightbox.is-open { display: flex; align-items: center; justify-content: center; }
body.lightbox-open { overflow: hidden; }
```

## deck.js 責任（章節式）

1. 可選：`IntersectionObserver` 為 TOC 加 `.is-active`
2. 平滑捲動交給 CSS 或原生錨點
3. **lightbox**：`.media` 點選 → 照片放大／影片播放；Esc 關閉；同 `[data-gallery]` 左右鍵切換；關閉時卸 iframe
4. **不要**實作投影片 `show(i)`／左右鍵翻頁／`1 / N` 頁碼（除非使用者要投影模式；投影模式左右鍵讓給翻頁時，燈箱開啟中仍優先關燈箱／切媒體）

`data-video` 格式：`yt:VIDEO_ID`、`drive:FILE_ID`、`file:assets/clip.mp4`。

## 照片放大／影片播放

**遇到照片都可以點選後放大。遇到影片可以點選播放。**

```html
<button type="button" class="media" data-full="assets/photo.jpg">
  <img src="assets/photo.jpg" alt="…" />
</button>
<button type="button" class="media media--video" data-video="yt:VIDEO_ID">
  <img src="assets/poster.jpg" alt="…" />
  <span class="media__badge">播放影片</span>
</button>
```

燈箱開啟時：照片塞 `<img>`；`yt`／`drive` 在**燈箱 iframe 內直接播放**（YouTube 對齊 oembed：`embed` + `autoplay=1&rel=0`，**不要**加 `origin=`；Drive `/file/d/{id}/preview`）；`file:` 塞 `<video controls autoplay>`。**不要**點了就 `window.open`。字幕可留「若未出現畫面可改新分頁」當後備。

YouTube iframe **先**設 `referrerpolicy="strict-origin-when-cross-origin"` 並掛進 DOM，**再**指定 `src`，否則會 Error 153。不要用 `no-referrer`。預覽用本機 `http://` 伺服器，不要用 `file://`。

## 拼貼、交疊與 hover

一組多張現場照用 `.gallery` 拼貼，**不要** `repeat(auto-fit, minmax())` 等大格。人物照加 `media--face`；直圖加 `media--tall`。1 張用 `gallery--hero`；地圖／截圖／文件用 `gallery--docs`。傾角寫在 `--tilt`，不要寫死 `transform`。

```html
<h3 class="caption">同一主題的一組照片</h3>
<div class="gallery" data-gallery="camp-life">
  <button type="button" class="media media--face" data-full="assets/a.jpg">…</button>
  <button type="button" class="media media--tall" data-full="assets/b.jpg">…</button>
  <button type="button" class="media" data-full="assets/c.jpg">…</button>
</div>
<div class="gallery gallery--docs" data-gallery="screenshots">…</div>
```

```css
.gallery {
  isolation: isolate;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: repeat(12, minmax(1.35rem, 1fr));
  min-height: clamp(22rem, 48vw, 34rem);
  gap: 0;
}
.gallery > .media {
  --tilt: 0deg;
  --lift: 1;
  position: relative;
  overflow: hidden;
  outline: 3px solid var(--bg);
  box-shadow: 0 12px 28px var(--shadow);
  transform: rotate(var(--tilt)) scale(var(--lift));
  transform-origin: center;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  z-index: 1;
}
.gallery > .media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery > .media.media--face { z-index: 8; }
.gallery > .media.media--face img,
.gallery > .media.media--tall img { object-position: center 16%; }
.gallery > .media:hover,
.gallery > .media:focus-visible {
  --lift: 1.08;
  z-index: 24;
}

/* 2 張：只壓右下角 */
.gallery:has(> :nth-child(2):last-child) > :nth-child(1) {
  grid-column: 1 / 8; grid-row: 1 / 11; --tilt: -1.2deg; z-index: 2;
}
.gallery:has(> :nth-child(2):last-child) > :nth-child(2) {
  grid-column: 7 / 13; grid-row: 7 / 13; --tilt: 1.5deg; z-index: 3;
}

/* 3 張：直圖壓左上、寬圖壓底邊 */
.gallery:has(> :nth-child(3):last-child) > :nth-child(1) {
  grid-column: 4 / 13; grid-row: 1 / 12; z-index: 1;
}
.gallery:has(> :nth-child(3):last-child) > :nth-child(2) {
  grid-column: 1 / 5; grid-row: 2 / 8; --tilt: -2deg; z-index: 3;
}
.gallery:has(> :nth-child(3):last-child) > :nth-child(3) {
  grid-column: 1 / 7; grid-row: 9 / 13; --tilt: 0.8deg; z-index: 2;
}

/* 4 張：四角錯開，重疊停在邊 */
.gallery:has(> :nth-child(4):last-child) > :nth-child(1) {
  grid-column: 3 / 9; grid-row: 1 / 7; --tilt: -0.7deg; z-index: 2;
}
.gallery:has(> :nth-child(4):last-child) > :nth-child(2) {
  grid-column: 1 / 5; grid-row: 6 / 13; --tilt: -1.5deg; z-index: 3;
}
.gallery:has(> :nth-child(4):last-child) > :nth-child(3) {
  grid-column: 9 / 13; grid-row: 2 / 10; --tilt: 1.3deg; z-index: 4;
}
.gallery:has(> :nth-child(4):last-child) > :nth-child(4) {
  grid-column: 5 / 11; grid-row: 8 / 13; --tilt: 0.7deg; z-index: 1;
}

/* 5 張：交疊只咬邊角 */
.gallery:has(> :nth-child(5):last-child) > :nth-child(1) {
  grid-column: 1 / 7; grid-row: 3 / 12; --tilt: -1deg; z-index: 2;
}
.gallery:has(> :nth-child(5):last-child) > :nth-child(2) {
  grid-column: 10 / 13; grid-row: 8 / 13; --tilt: 1.4deg; z-index: 1;
}
.gallery:has(> :nth-child(5):last-child) > :nth-child(3) {
  grid-column: 7 / 12; grid-row: 1 / 5; --tilt: 0.6deg; z-index: 3;
}
.gallery:has(> :nth-child(5):last-child) > :nth-child(4) {
  grid-column: 7 / 12; grid-row: 6 / 13; --tilt: -0.4deg; z-index: 2;
}
.gallery:has(> :nth-child(5):last-child) > :nth-child(5) {
  grid-column: 10 / 13; grid-row: 1 / 7; --tilt: -1.3deg; z-index: 4;
}

/* 6 張 */
.gallery:has(> :nth-child(6):last-child) > :nth-child(1) {
  grid-column: 4 / 9; grid-row: 1 / 6; --tilt: -0.6deg; z-index: 3;
}
.gallery:has(> :nth-child(6):last-child) > :nth-child(2) {
  grid-column: 9 / 13; grid-row: 1 / 6; --tilt: 1deg; z-index: 2;
}
.gallery:has(> :nth-child(6):last-child) > :nth-child(3) {
  grid-column: 9 / 13; grid-row: 6 / 12; z-index: 1;
}
.gallery:has(> :nth-child(6):last-child) > :nth-child(4) {
  grid-column: 1 / 4; grid-row: 3 / 12; --tilt: -1.5deg; z-index: 4;
}
.gallery:has(> :nth-child(6):last-child) > :nth-child(5) {
  grid-column: 4 / 9; grid-row: 7 / 13; --tilt: 0.7deg; z-index: 2;
}
.gallery:has(> :nth-child(6):last-child) > :nth-child(6) {
  grid-column: 1 / 4; grid-row: 1 / 4; --tilt: 1.1deg; z-index: 5;
}

/* 8 張：密鋪；合影／主角放上層 */
.gallery:has(> :nth-child(8):last-child) > :nth-child(1) {
  grid-column: 5 / 10; grid-row: 4 / 8; z-index: 3;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(2) {
  grid-column: 3 / 7; grid-row: 8 / 13; --tilt: -0.8deg; z-index: 2;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(3) {
  grid-column: 1 / 5; grid-row: 8 / 13; --tilt: 1deg; z-index: 1;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(4) {
  grid-column: 10 / 13; grid-row: 1 / 7; --tilt: 1.3deg; z-index: 4;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(5) {
  grid-column: 9 / 13; grid-row: 7 / 13; z-index: 1;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(6) {
  grid-column: 4 / 8; grid-row: 1 / 6; --tilt: -0.6deg; z-index: 2;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(7) {
  grid-column: 1 / 4; grid-row: 1 / 8; --tilt: -1.2deg; z-index: 2;
}
.gallery:has(> :nth-child(8):last-child) > :nth-child(8) {
  grid-column: 7 / 11; grid-row: 1 / 5; --tilt: 0.7deg; z-index: 5;
}

.gallery--hero { display: block; min-height: 0; }
.gallery--hero > .media { width: 100%; --tilt: 0deg; }
.gallery--hero > .media img { height: auto; object-fit: contain; }

.gallery--docs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  grid-template-rows: none;
  min-height: 0;
  gap: 0.75rem;
}
.gallery--docs > .media {
  --tilt: 0deg;
  grid-column: auto !important;
  outline-width: 1px;
}
.gallery--docs > .media img { height: auto; object-fit: contain; }

@media (max-width: 720px) {
  .gallery {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    min-height: 28rem;
  }
}
```

7 張拆成兩組；9+ 依主題再拆。交疊只咬邊角。hover 的 `z-index` 必須高過 `media--face`。移開後 `--lift: 1`，縮回原樣。

```js
// deck.js 媒體段（與 TOC observer 並列）
const box = document.getElementById("lightbox");
const stage = box.querySelector(".lightbox__stage");
const cap = box.querySelector(".lightbox__caption");
let group = [], index = 0;

const parse = (v) => {
  if (!v) return null;
  const i = v.indexOf(":");
  return i < 0 ? { kind: v, id: "" } : { kind: v.slice(0, i), id: v.slice(i + 1) };
};
const openHref = (v) =>
  v.kind === "yt" ? `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}` :
  v.kind === "drive" ? `https://drive.google.com/file/d/${v.id}/view` : v.id;

function render() {
  const el = group[index];
  stage.replaceChildren();
  const v = parse(el.dataset.video);
  const alt = el.querySelector("img")?.alt || "";
  if (v?.kind === "yt" || v?.kind === "drive") {
    const href = openHref(v);
    const f = document.createElement("iframe");
    f.allow = "autoplay; fullscreen; picture-in-picture; web-share";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    stage.append(f);
    f.src = v.kind === "yt"
      ? `https://www.youtube.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0&playsinline=1&feature=oembed`
      : `https://drive.google.com/file/d/${v.id}/preview`;
    const a = document.createElement("a");
    a.href = href; a.target = "_blank"; a.rel = "noopener";
    a.textContent = "若未出現畫面可改新分頁";
    cap.replaceChildren(alt ? alt + "　" : "", a);
  } else if (v?.kind === "file") {
    const vid = document.createElement("video");
    vid.controls = true; vid.autoplay = true; vid.src = v.id;
    stage.append(vid);
    cap.textContent = alt;
  } else {
    const img = document.createElement("img");
    img.src = el.dataset.full || el.querySelector("img").src;
    img.alt = alt;
    stage.append(img);
    cap.textContent = alt;
  }
}

function open(btn) {
  group = [...(btn.closest("[data-gallery]") || document).querySelectorAll(".media")];
  index = group.indexOf(btn);
  box.classList.add("is-open");
  document.body.classList.add("lightbox-open");
  render();
}
function close() {
  box.classList.remove("is-open");
  document.body.classList.remove("lightbox-open");
  stage.replaceChildren();
}

document.querySelectorAll(".media").forEach((b) => b.addEventListener("click", () => open(b)));
box.querySelector(".lightbox__close").addEventListener("click", close);
box.addEventListener("click", (e) => { if (e.target === box) close(); });
document.addEventListener("keydown", (e) => {
  if (!box.classList.contains("is-open")) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") { index = (index - 1 + group.length) % group.length; render(); }
  if (e.key === "ArrowRight") { index = (index + 1) % group.length; render(); }
});
```

## 新增一章

1. 大綱寫主張句
2. 加 `<section class="chapter" id="ch-...">` + `chapter__head`
3. 在 TOC 加對應錨點
4. 本體只包實際內容；檢查沒有大片空白

## 原稿連結

若 PPT／來源標題有超連結，用可見 `<a class="chapter__title-link">` 保留。內容照片仍走 lightbox 放大，不要讓點圖只負責跳外連。

## 投影分頁模式（例外）

僅當使用者明確要求時，才改用舊式 `.slide` 滿窗 + 鍵盤翻頁；交付時註明「例外：投影模式」。
