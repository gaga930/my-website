---
name: web-slides-design
description: 網頁式簡報的視覺 tokens、字級與版型細節；由 web-slides skill 引用。
---

# 網頁式簡報｜設計細節

配合 [SKILL.md](SKILL.md)。實作時把下列概念寫成 CSS 變數，不要散落 magic number。

## 設計 tokens（起手式）

每個 deck 在根層定義，並依主題覆寫顏色即可：

```css
:root {
  --bg: #0f1419;
  --bg-accent: #1a2332;
  --fg: #f2f5f8;
  --fg-muted: #9aa8b5;
  --accent: #3db8a0;      /* 選一個有個性的強調色，避免預設紫 */
  --danger: #e85d4c;
  --font-display: "Fraunces", "Noto Serif TC", serif;
  --font-body: "IBM Plex Sans", "Noto Sans TC", sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --slide-pad: clamp(1.5rem, 5vw, 4rem);
  --step: 0.25rem;
}
```

淺色 deck 同樣用變數，只換 `--bg` / `--fg`；不要另寫一套 class 命名。

### 選色

- 先定 **背景氣氛** 與 **一個強調色**，再推 muted／border
- 正文與背景對比要高（投影偏亮時仍可讀）
- 強調色用於：關鍵數字、當頁焦點詞、進度點；不要整段著色

### 字體

- Display：標題／主張（可有性格）
- Body：副標與列表
- Mono：程式與數據
- 避免 Inter / Roboto / Arial / system-ui 當主視覺字（可用於後備）
- 繁中務必備 Noto 或專案指定中文字體，避免標題缺字

## 字級階梯（遠距可讀）

在 1920×1080 心智下的起點，實作以 `clamp` 縮放：

| 角色 | 約略大小 | 用途 |
|------|----------|------|
| Display | 4.5–7rem | 開場題名、單句主張 |
| Title | 2.75–3.5rem | 一般頁標題 |
| Body | 1.35–1.75rem | 副標、列表 |
| Small | 0.95–1.1rem | 來源、頁碼、眉標 |
| Code | 1.1–1.4rem | 程式；寧可少行加大字 |

行長：主張句可較短；列表單行尽量不超約 35–40 中文字。

## 間距與安全區

- 章節式：內容落在報告欄 `--page-pad`／內容 max-width 內；**章高隨內容**，禁止用 `min-height: 100vh` 灌空白
- 區塊間距用適中步進（例如 0.75rem–1.5rem）；章與章用分隔線或 padding，不要整屏留白
- 投影分頁模式（例外）才用 `--slide-pad` 與滿窗安全區
- sticky TOC／頁尾註記字小、對比略低，不搶章標題

## 版型細節

### title / report-header

- 題名最大；副標一行；日期／場合用 small
- 與 TOC 同一報告頭即可，勿另開空白全屏

### section → 併入 chapter__head

- 章號 + 短章名／主張寫在該章標題列
- **禁止**只含章名的滿屏分隔頁

### claim

- 主張用 display／title；`support` 一行解釋即可
- eyebrow 可有可無；有則極短（2–6 字）

### bullets

- 最多 5 點；可用 `dl`（詞＋說明）取代純 `ul` 更易掃讀
- 不要多層巢狀列表

### split

- 兩欄等權或 40/60；中間可用細分隔線
- 每欄一個小標 + 極短說明；不要兩欄各塞長文

### code

- 7–12 行內為佳；用 `.hl` 標焦點行
- 背景略異於 slide，圓角可有可無；不要厚重陰影堆疊

### figure

- 圖表上方或下方放**一句結論**（不是「圖 1」）
- 軸標、圖例要夠大；複雜圖改拆頁

### outro

- 一句話置中或偏左；CTA 最多一組

## 動效

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

建議配額（每 deck）：

1. 翻頁淡入或短位移（≤300ms）
2. 當頁焦點元素一次強調（數字／主張）
3. 可選：章節頁背景輕微 kenburns 或漸層漂移

禁止：無限脈衝、強 glow、全頁粒子、進場逐行過慢（講者已開講內容還在播動畫）。

## 反光檢查

完成一頁後自問：

1. 拿掉裝飾後，主張是否仍成立？
2. 三秒內能否看出要聽眾記住什麼？
3. 是否不像儀表板、不像落地頁首屏資訊堆疊？
