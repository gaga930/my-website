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

  <script src="deck.js"></script>
</body>
</html>
```

## styles.css 責任

1. tokens（見 [design.md](design.md)）
2. `body` **可垂直捲動**；章節 `height: auto`
3. sticky 報告頭／TOC 時，章節設 `scroll-margin-top`
4. **禁止**預設：`html, body { height:100%; overflow:hidden }` + `.slide { height:100% }`

```css
html { scroll-behavior: smooth; }
body { margin: 0; overflow-y: auto; }
.chapter { padding: 1.5rem 0; scroll-margin-top: 5.5rem; }
.chapter__asset img { display: block; width: 100%; height: auto; }
```

## deck.js 責任（章節式）

1. 可選：`IntersectionObserver` 為 TOC 加 `.is-active`
2. 平滑捲動交給 CSS 或原生錨點
3. **不要**實作投影片 `show(i)`／左右鍵翻頁／`1 / N` 頁碼（除非使用者要投影模式）

## 新增一章

1. 大綱寫主張句
2. 加 `<section class="chapter" id="ch-...">` + `chapter__head`
3. 在 TOC 加對應錨點
4. 本體只包實際內容；檢查沒有大片空白

## 原稿連結

若 PPT／來源標題有超連結，用可見 `<a class="chapter__title-link">` 或圖上熱區保留，勿只貼靜態圖。

## 投影分頁模式（例外）

僅當使用者明確要求時，才改用舊式 `.slide` 滿窗 + 鍵盤翻頁；交付時註明「例外：投影模式」。
