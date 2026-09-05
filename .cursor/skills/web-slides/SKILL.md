---
name: web-slides
description: >-
  以網頁製作簡報／週報內容：預設章節式連續捲動（非全螢幕分頁），避免空白佔高。
  含進度卡、SVG 甘特圖、表格盤點、附件全寬區隔等章節版型。
  遇到照片都可以點選後放大；遇到影片可以點選播放。
  一組多張現場照用拼貼感（不等大、輕交疊），不要均勻格線。
  交疊不擋畫面重點（人物臉）；滑鼠移上暫時浮到最上層並稍微放大。
  當使用者要求製作簡報、投影片、presentation、deck、slides、週報、網頁式簡報，
  甘特圖／時程圖／附件，或在本專案新增／修改簡報內容時使用。
  上載／推送 git 請用 publish-to-git，不要用本 skill。
---

# 網頁式簡報（Web Slides）

本專案以**網頁**承載簡報／週報，不是 PPT/Google Slides。Agent 製作或修改時必須遵循本 skill。

上載到 Git／GitHub Pages → 改讀 **publish-to-git** skill，本檔不處理 commit／push。

## 何時啟用

- 建立新簡報、週報、新增章節、改版既有 deck
- 使用者提到：簡報、投影片、slides、presentation、deck、週報、演講稿頁面
- 需要調整簡報視覺、動效、章節導覽或素材嵌入

## 核心原則

1. **章節式，不分頁（預設）**：用連續捲動的 `<section class="chapter">` 組織內容；**禁止**預設做成全螢幕一頁一頁翻（`100vh` slide + 鍵盤翻頁）。章節高度跟內容走，**不要為了「滿一屏」留大片空白**。
2. **一章一焦點**：每個章節一個清楚主張或交付物；標題即主張，不是空洞主題詞。
3. **密度剛好**：可掃讀、對比足夠；遠距投影仍要可讀，但不靠拉高頁面灌空氣。
4. **網頁優勢要用**：錨點導覽、可點連結、嵌入圖／表——服務論點，不炫技。
5. **照片可放大、影片可播放**：遇到照片都可以點選後放大；遇到影片可以點選播放。靜態縮圖或只留外連文字不算完成。
6. **現場照用拼貼，不要均勻格線**：一組多張活動／人物／現場照，做成不等大、輕交疊、微傾角的 collage；不要 `auto-fit` 等大相簿牆。地圖、截圖、文件另用可讀版型。
7. **交疊不擋重點、hover 可浮起**：照片交疊時不要壓到畫面重點；有人物主角時臉不要被蓋掉。照片／影片滑鼠移上去暫時移到最上層並稍微放大，移開後縮回原樣。
8. **結構優先**：報告頭＋章節 TOC＋各章內容；講者備註可選，不假設有雷射筆 UI。

### 何時才可用全螢幕分頁

僅在使用者**明確要求**「投影翻頁／簡報模式／fullscreen slides」時，才改用 viewport 分頁。預設與週報、進度報告一律章節式。

## 工作流程

```
簡報進度:
- [ ] 1. 釐清受眾、場合、時長、語氣
- [ ] 2. 產出大綱（章節 → 每章一句主張）
- [ ] 3. 選定／沿用視覺方向（色票、字體）
- [ ] 4. 依章節模板建立檔案與各 chapter
- [ ] 5. 接上章節 TOC 錨點（可選：捲動高亮）
- [ ] 6. 照片接 lightbox 放大；影片接點選播放（見「照片與影片」）
- [ ] 7. 現場照拼貼（不等大、輕交疊）；地圖／文件不硬疊
- [ ] 8. 瀏覽器預覽：無無謂留白、對比、窄螢幕、點圖放大、點影片播放（YouTube 不可 Error 153）；拼貼不像格線相簿；交疊不擋臉；hover 浮起後移開會縮回
- [ ] 9. 精簡文案後交付
- [ ] 10. （僅使用者要求時）上載 → 改用 publish-to-git skill
```

### Step 1–2：大綱先於視覺

先列**章節大綱**再寫 HTML。每章寫成完整主張句。

| 區段 | 說明 |
|------|------|
| 報告頭 | 題名、日期、場合；可 sticky |
| 章節 TOC | 錨點連到各章，勿另開空白「分隔全頁」 |
| 內容章 | 每章：短標題列 + 本體（圖／表／要點） |
| 結尾 | 可選；一句帶走的話或來源註記 |

**不要**做「只有章名、佔滿一屏」的分隔頁——章名寫在該章 `chapter__head` 即可。

### Step 3–4：建立檔案

```
decks/<deck-slug>/
├── index.html      # 報告頭 + TOC + chapters
├── styles.css
├── deck.js         # TOC 高亮 + 照片放大／影片播放 lightbox
└── assets/
```

技術預設：

- 單頁 HTML + CSS + 少量 JS
- 每個 `.chapter`（`id` 可錨點）= 一章；高度 `auto`，隨內容增長
- `body` **允許垂直捲動**；`overflow: hidden` + 滿高分頁是反模式（除非使用者要投影模式）

### Step 5：導航（章節式必做）

- 頂部或報告頭提供章節 TOC（`#ch-...` 錨點）
- `scroll-margin-top` 避開 sticky 標頭
- 可選：`IntersectionObserver` 高亮目前章節
- **不要**做左右鍵翻「虛擬頁」、頁碼 `3 / 12`（那是分頁模式）

### Step 6：預覽檢查

- 各章之間沒有大片無內容空白
- 圖片／表格寬度吃滿內容欄，不強制撐滿視窗高度
- 窄螢幕可捲動閱讀；TOC 仍可用
- **點一張內容照片會放大**；**點一則影片會播放**（不是只開新分頁）；YouTube 內嵌不可出現 Error 153
- 一組現場照是拼貼（大小不一、有交疊），不是等大格線；地圖／截圖仍可讀字
- `prefers-reduced-motion` 下降級平滑捲動
- 若有甘特圖：色條（SVG rect）清楚可見，不是只有文字日期

## 章節版型

優先使用；不要每章發明新佈局。

| 版型 | 用途 | 版面要點 |
|------|------|----------|
| `report-header` | 全稿開頭 | 品牌／題名／日期 + TOC |
| `chapter` | 一般章 | 編號 + 主張標題 + 短 support + 本體 |
| `claim` | 純主張 | 大字主張 + 一行解釋 |
| `bullets` | 要點 | ≤5 點；可掃讀 |
| `split` | 對照 | 左／右各一意 |
| `figure` / `asset` | 圖表素材 | 圖為主；**點選後放大**；多張現場照用**拼貼**（不等大、輕交疊）；交疊不擋臉；hover 浮起放大；原稿超連結另以可見連結保留 |
| `progress` / `matrix` | 進度表 | 成組對照時才用卡片式容器 |
| `gantt`（SVG） | 起始→完成日時程 | **必須用 SVG 色條**；見下方「甘特圖」 |
| `appendix` | 附件／附錄 | 正文後；**明顯全寬區隔**；見下方「附件區隔」 |
| `outro` | 結尾 | 一句話 + 可選 CTA |

```html
<section class="chapter" id="ch-modeling">
  <header class="chapter__head">
    <p class="chapter__num">02</p>
    <div>
      <h2>簽約訂單已完成；出貨與應收已逾目標日</h2>
      <p class="support">來源：數據建模進度現況.xlsx｜截至 2026/09/03</p>
    </div>
  </header>
  <!-- 本體：圖、表、要點；高度隨內容 -->
</section>
```

## 照片與影片（必做）

**遇到照片都可以點選後放大。遇到影片可以點選播放。** 有圖／影的 deck 必須實作，不是可選加分。

### 硬性規則

1. **照片**：內容照片（人物、現場、地圖、截圖、海報）一律可點；點了在燈箱顯示大圖，`object-fit: contain` 不裁切。Esc、點遮罩、關閉鈕可關。同一組（`[data-gallery]`）可用左右鍵切換。
2. **影片**：YouTube、Google Drive、本機 `mp4`／`webm` 一律可點即播。用封面圖＋左下角 `.media__badge`（「播放影片」＋三角形 icon）；**字體與 icon 尺寸見下方「播放標記尺寸」**。點了在**燈箱內直接播放**（iframe 或 `<video controls autoplay>`），**不要**跳新視窗才開始播，也不要只放不會動的縮圖。
3. 原稿若照片本身帶相簿／外連，**點圖仍是放大**；外連用圖下方可見 `<a>` 保留，不要讓點圖直接跳走。
4. PPT 轉檔時略過裝飾用小圖：播放鈕圖示、1×1 間隔、純色方塊。真正的活動照／地圖／截圖都要可放大。原稿同一頁／同一主題的照片編成**一組拼貼**，不要整章倒進一個等大 grid。
5. 燈箱 `z-index` 必須蓋過 sticky 報告頭。關閉時清掉 iframe／`src`，避免背景繼續播。
6. 內嵌可能被擋（Drive 權限、YouTube 隱私）時，燈箱字幕可留「若未出現畫面可改新分頁」當後備，但**預設仍是頁內播放**，不要一點就 `window.open`。
7. **YouTube**：點了在燈箱 iframe **直接播**，不要為了播放跳新視窗。iframe 對齊官方 oembed——**先**設 `referrerpolicy="strict-origin-when-cross-origin"`、掛進 DOM，**再**設 `src`（`embed/ID?autoplay=1&rel=0`），讓點擊手勢能傳給 autoplay。`<head>` 加 `<meta name="referrer" content="strict-origin-when-cross-origin">`，**不要**全站 `no-referrer`。**不要**在 embed URL 加 `origin=`。影片 ID 可能以 `-` 開頭，用第一個冒號切開 `yt:`。預覽請用 `http://` 本機伺服器，不要雙擊 HTML（`file://` 時 YouTube 內嵌會失敗）。

最小標記見 [template.md](template.md)「照片放大／影片播放」。

### 播放標記尺寸（必做）

左下角 `.media__badge` 要讓人一眼看出可點擊播放。字與三角形 **用下列尺寸**，不要做成小標。

| 項目 | 值 |
|------|-----|
| 文字 | `font-size: 1.05rem`（**≥ 1rem**；禁止 0.75–0.8rem） |
| 字重 | `font-weight: 700` |
| 播放三角形 icon | `::before` 的 `border-width: 0.55rem 0 0.55rem 0.92rem` |
| 與字間距 | `gap: 0.5rem` |
| 內距 | `padding: 0.48rem 0.85rem` |
| 位置 | `left` / `bottom: 0.75rem` |

完整 CSS 見 [template.md](template.md) `.media__badge`。

### 拼貼感（一組多張現場照必做）

**一組多張活動照、人物照、現場照，用拼貼（collage）呈現：大小不一、邊角輕交疊、微微傾斜，像桌上攤開的照片，不要做成等大格線相簿。**

- 預設 `.gallery`：12 欄 CSS grid、`gap: 0`、`isolation: isolate`。用 `:has(> :nth-child(N):last-child)` 依**張數**套版型（2／3／4／5／6／8）。
- 每組對應原稿**一頁或一個主題**。7 張拆成 3+4 或 2+5；9 張以上拆多組，各加小標 `.caption`。**1 張**用 `gallery--hero`，不要丟進空的 12×12 grid。
- 縮圖在拼貼裡可用 `object-fit: cover`；燈箱大圖仍 `contain`、不裁切。直圖加 `media--tall`（`object-position` 偏上）。
- 疊相紙感：`outline: 3px solid var(--bg)` + 陰影；`--tilt` 約 ±0.5–2deg，不要每張亂轉很大。
- HTML 順序要配合版型：主角／大圖通常當該組第一張；人物加 `media--face`。
- **不要拼貼、改可讀排法**：地圖、簡報截圖、文件、需要讀字的圖 → `gallery--docs`（有間距、不交疊、不傾斜、`object-fit: contain`）。單張主視覺、aftermovie 封面、全寬地圖 → `gallery--hero`。
- 窄螢幕可減交疊、改較疏的欄，**仍不要**改成等大 `auto-fit` 磚牆。

最小 CSS 見 [template.md](template.md)「拼貼、交疊與 hover」。

### 交疊與 hover（有圖／影即做）

**照片交疊的時候，不要壓到畫面重點，特別是有人物主角的時候，臉不要被蓋掉。**

- 拼貼／交疊只咬邊角，不要從畫面中央切過去。
- 有清楚人臉、主角的照片加 `media--face`：預設 `z-index` 高於風景／食物／徽章／地圖；`object-position` 偏上保住頭部。
- 地圖、截圖、文件圖不要為了炫而交疊到字看不清。

**照片／影片在滑鼠移上去的時候，能暫時移到最上層，並有稍微放大一點的效果；移開後就縮回原樣。**

- 用 CSS 變數拆開傾斜與放大：`--tilt` 管交疊傾角，`--lift` 管 hover 縮放（約 `1.06–1.08`）。**不要**在 hover 寫死 `transform:`，否則會蓋掉傾角、也放大不了。
- hover／`:focus-visible`：`z-index` 必須高過交疊層與 `media--face`（例如 24）；`transition` 約 0.2s。
- 這是額外回饋，**不能**取代可見的播放標記；播放鈕仍要平時看得到，字 `1.05rem`、三角形約 `0.55rem × 0.92rem`。
- `prefers-reduced-motion` 下降級 transition。

最小 CSS 見 [template.md](template.md)「拼貼、交疊與 hover」。

### 反模式（媒體）

- `<img>` 沒包可點控件，只能看不能放大
- 影片只有超連結、沒有點選播放
- 用 `hover` 才出現播放鈕或放大提示
- 播放標記字級過小（＜1rem），左下角「播放影片」看不清楚
- 點圖卻 `window.open` 原檔，沒有頁內燈箱
- 交疊切過人物臉或畫面主體
- 活動照做成 `repeat(auto-fit, minmax(...))` 等大格線，或全部一樣大、一樣間距、零交疊
- 整章幾十張塞同一個 `.gallery`；或把地圖／文件截圖硬拼貼到字被切掉
- hover 寫死 `transform` 導致不能放大、或移開後回不去原傾角
- 點影片卻 `window.open` 新視窗才播，燈箱裡沒有播放器
- YouTube iframe 沒設 `referrerpolicy`、或先設 `src` 再掛進 DOM，點播放出現 Error 153
- `<head>` 用 `no-referrer`，YouTube 拿不到 origin

## 甘特圖（起始日 → 完成日）

當章節需要呈現「從開工／起始到目標完成」的時程（例如建模進度），在既有進度卡／摘要**下方**加甘特圖。

### 硬性規則

1. **用 SVG 畫色條**，不要用 CSS `position: absolute` + `% left/width` 的 div 色條。後者在部分環境會只剩文字、看不到色條（已踩過坑）。
2. 資料以來源表為準：至少要有**起始日**與**完成日**（如「實際開工日」「目標完成日」）。
3. 甘特放在該章本體下方，標題清楚（例：`時程甘特圖｜實際開工 → 目標完成`），並標區間與報告日。
4. 預覽時**必須確認色條可見**（綠／紅／藍等實心矩形），不能只有日期文字列表。

### 實作要點

- 容器：`.model-gantt`（標題列 + `.model-gantt__body` + `<svg class="model-gantt__svg">`）
- 時間軸：用固定 `viewBox`（例：`0 0 1000 280`），左側留標籤欄，右側為軌道
- 換算：`x = trackLeft + (startDay / totalDays) * trackWidth`，`width = (endDay - startDay) / totalDays * trackWidth`
- 畫：`<rect>` 色條 + `<text>` 標籤／日期；報告日用虛線 `<line stroke-dasharray>`
- 狀態色對齊進度卡：完成＝mint、逾期＝coral、進行中＝blue、未開始＝灰
- SVG `width: 100%`；窄螢幕可 `min-width` + 橫向捲動，勿把色條擠到消失

### 最小結構

```html
<div class="model-gantt" aria-label="時程甘特圖">
  <div class="model-gantt__head">
    <h3 class="model-gantt__title">時程甘特圖｜實際開工 → 目標完成</h3>
    <p class="model-gantt__note">區間 YYYY/MM/DD–MM/DD｜虛線＝報告日</p>
  </div>
  <div class="model-gantt__body">
    <svg class="model-gantt__svg" viewBox="0 0 1000 280" role="img" aria-label="…">
      <!-- 軸線、報告日虛線、列標籤、各列 rect 色條 + 日期文字 -->
    </svg>
  </div>
</div>
```

### 反模式（甘特）

- 只用 CSS absolute 定位的 `.bar { left:%; width:% }` 當主視覺
- 只有文字日期、沒有可見色條就當作「甘特圖已完成」
- 與進度卡日期不一致卻不註明來源差異

## 附件區隔

當某章改為**附件／附錄**（放在正文各章之後），正文最後一章與附件之間必須有**明顯區隔**，不可只靠一般 `chapter` 底線。

### 規則

1. 附件放在 `main` **最後**。
2. **TOC 按鈕名稱固定為「附件」**（不要寫「附件 下半年時程」等長文案）；使用 `class="toc__appendix"`。
3. 附件章：`class="chapter chapter--appendix"`；章號用「附」，不要繼續編 06、07。
4. 區隔元件插在附件 `<section>` **之前**，需同時具備：
   - **全寬**（可破內容欄：`width: 100vw; margin-left: calc(50% - 50vw)`）
   - **足夠高度**（上下 padding 約 `2rem`，不要做成細線條）
   - 中央標籤「附件」＋兩側橫線

### TOC 按鈕（名稱＋樣式）

```html
<nav class="toc" aria-label="章節導覽">
  <!-- …正文各章 01–05… -->
  <a href="#ch-schedule" class="toc__appendix">附件</a>
</nav>
```

```css
.toc a.toc__appendix {
  border-color: var(--digi-navy);
  background: rgba(0, 0, 100, 0.06);
}
.toc a.toc__appendix.is-active,
.toc a.toc__appendix:hover,
.toc a.toc__appendix:focus-visible {
  background: var(--digi-navy);
  border-color: var(--digi-navy);
  color: #fff;
}
```

### 區隔＋附件章最小結構

```html
<div class="appendix-divider" role="separator" aria-label="以下為附件">
  <span class="appendix-divider__line" aria-hidden="true"></span>
  <span class="appendix-divider__label">附件</span>
  <span class="appendix-divider__line" aria-hidden="true"></span>
</div>

<section class="chapter chapter--appendix" id="ch-schedule">
  <header class="chapter__head">
    <p class="chapter__num">附</p>
    <div>
      <h2>…</h2>
      <p class="support">附件｜…</p>
    </div>
  </header>
  <!-- 本體 -->
</section>
```

### 區隔樣式要點（對齊現行週報）

```css
.appendix-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100vw;
  margin: 2.25rem 0 0.75rem;
  margin-left: calc(50% - 50vw);
  padding: 2rem var(--page-pad);
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(0, 0, 100, 0.05) 22%,
    rgba(0, 0, 100, 0.05) 78%,
    transparent
  );
}
.appendix-divider__line {
  flex: 1;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--digi-navy) 8%, var(--digi-navy) 92%, transparent);
  opacity: 0.4;
}
.appendix-divider__label {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #fff;
  background: var(--digi-navy);
  padding: 0.7rem 1.6rem;
  border-radius: 3px;
}
.chapter--appendix .chapter__num {
  color: var(--digi-navy);
  font-size: clamp(1.5rem, 2.6vw, 1.9rem);
}
```

### 反模式（附件）

- TOC 寫成長標題（如「附件 下半年時程」）而非單純「附件」
- TOC 附件鈕與一般章樣式無差異
- 附件與正文之間只有普通 `border-bottom`，沒有「附件」標籤帶
- 區隔過矮（細線）或困在內容 `max-width` 內看不出分界
- 附件仍用 01、02… 與正文連續編號造成混淆

## 文案規範

- 標題用**主張**，不用「簡介」「背景」等空洞詞（除非開場必要）
- 正文短；細節可放章內次級區塊，勿另開空白章
- 列表平行、可掃讀；數字附單位與比較基準
- 繁中內容用繁中 UI 微文案（「章節導覽」等，不用「下一頁」當主操作）

## 視覺與動效

詳見 [design.md](design.md)。摘要：

- 每稿先定色票 CSS 變數 + 字體，全稿一致（本專案週報可沿用鼎新：`#000064` / `#00AFF0` / `#005AFF`）
- 背景可輕漸層，主訊息仍是文字／圖表
- **預設不用卡片牆**；僅在拿掉容器就難讀的成組對照時使用
- 動效克制：TOC 高亮、輕微進場即可
- 避開常見 AI 套版味（紫白漸層、奶油底 terracotta、新聞紙密排）

## 實作慣例（章節式）

```css
html { scroll-behavior: smooth; }
body { overflow-x: hidden; overflow-y: auto; } /* 允許捲動 */
.chapter { scroll-margin-top: 5.5rem; }         /* 避開 sticky 頭 */
.chapter__asset img { width: 100%; height: auto; }
```

- 用 `clamp()` 管字級與內距
- 圖片放 `assets/`，有意義的 `alt`；內容照片用 `.media` 點選放大
- 原稿標題若有超連結，必須在網頁保留可點連結
- JS：TOC active ＋ **lightbox**（圖放大／影播放）；不要實作 slide `show(i)` 翻頁器（除非投影模式）

## 反模式（禁止）

- **全螢幕分頁當預設**（`100vh` + `overflow: hidden` + 左右鍵翻頁）卻內容只佔半屏
- 只含章名的空白「分隔投影片」
- 把報告做成無章節的長散文牆
- 依賴 hover 才看得到關鍵資訊
- 每章不同主題色／不同字體家族
- 為了「看起來滿」加假統計、假徽章、裝飾 sticker
- 甘特圖用 CSS absolute 色條導致只剩文字、看不到時程條
- 內容照片不能點選放大、影片不能點選播放
- 現場照排成等大格線相簿，沒有拼貼感
- 交疊蓋住人臉；hover 不能浮起或移開後不縮回

## 交付方式

1. deck 路徑與如何開啟
2. **章節結構**（不是頁數）
3. TOC／錨點說明；若有外部連結一併註明
4. 已知限制
5. 若使用者另要求上載：依 **publish-to-git** 執行，並回報 commit／Pages 網址

## 附加資源

- 視覺 tokens：[design.md](design.md)
- 章節式最小模板（含 lightbox）：[template.md](template.md)
- 上載 Git／Pages：專案 skill **publish-to-git**
