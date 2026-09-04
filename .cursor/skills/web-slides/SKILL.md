---
name: web-slides
description: >-
  以網頁製作簡報／週報內容：預設章節式連續捲動（非全螢幕分頁），避免空白佔高。
  含進度卡、SVG 甘特圖、表格盤點、附件全寬區隔等章節版型。
  當使用者要求製作簡報、投影片、presentation、deck、slides、週報、網頁式簡報，
  甘特圖／時程圖／附件、上載／推送到 git／GitHub Pages，
  或在本專案新增／修改簡報內容時使用。
---

# 網頁式簡報（Web Slides）

本專案以**網頁**承載簡報／週報，不是 PPT/Google Slides。Agent 製作或修改時必須遵循本 skill。

## 何時啟用

- 建立新簡報、週報、新增章節、改版既有 deck
- 使用者提到：簡報、投影片、slides、presentation、deck、週報、演講稿頁面
- 需要調整簡報視覺、動效、章節導覽或素材嵌入
- 使用者要求「上載到 git／推送／發布／更新 GitHub Pages」

## 核心原則

1. **章節式，不分頁（預設）**：用連續捲動的 `<section class="chapter">` 組織內容；**禁止**預設做成全螢幕一頁一頁翻（`100vh` slide + 鍵盤翻頁）。章節高度跟內容走，**不要為了「滿一屏」留大片空白**。
2. **一章一焦點**：每個章節一個清楚主張或交付物；標題即主張，不是空洞主題詞。
3. **密度剛好**：可掃讀、對比足夠；遠距投影仍要可讀，但不靠拉高頁面灌空氣。
4. **網頁優勢要用**：錨點導覽、可點連結、嵌入圖／表——服務論點，不炫技。
5. **結構優先**：報告頭＋章節 TOC＋各章內容；講者備註可選，不假設有雷射筆 UI。

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
- [ ] 6. 瀏覽器預覽：無無謂留白、對比、窄螢幕
- [ ] 7. 精簡文案後交付
- [ ] 8. （僅使用者要求時）上載到 Git／GitHub Pages → 見「上載到 Git」
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
├── deck.js         # 章節 TOC 高亮／平滑捲動（可選、保持輕量）
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
| `figure` / `asset` | 圖表素材 | 圖為主；原稿超連結用可見或熱區保留 |
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
- 圖片放 `assets/`，有意義的 `alt`
- 原稿標題若有超連結，必須在網頁保留可點連結
- JS 保持小：TOC active 狀態即可；不要實作 slide `show(i)` 翻頁器（除非投影模式）

## 反模式（禁止）

- **全螢幕分頁當預設**（`100vh` + `overflow: hidden` + 左右鍵翻頁）卻內容只佔半屏
- 只含章名的空白「分隔投影片」
- 把報告做成無章節的長散文牆
- 依賴 hover 才看得到關鍵資訊
- 每章不同主題色／不同字體家族
- 為了「看起來滿」加假統計、假徽章、裝飾 sticker
- 甘特圖用 CSS absolute 色條導致只剩文字、看不到時程條

## 交付方式

1. deck 路徑與如何開啟
2. **章節結構**（不是頁數）
3. TOC／錨點說明；若有外部連結一併註明
4. 已知限制
5. 若已上載：給出 commit、repo、Pages 網址

## 上載到 Git（GitHub Pages）

僅在使用者**明確要求**「上載到 git／推送／發布／更新網站」時執行。不要擅自 commit 或 push。

### 本專案現況（週報 deck）

| 項目 | 值 |
|------|-----|
| Git 根目錄 | `decks/weekly-report-260903/`（**不是** `slides_buider` 專案根） |
| Remote | `https://github.com/gaga930/my-website.git` |
| 分支 | `main`（deck 檔案即站點根目錄） |
| 網站 | `https://gaga930.github.io/my-website/` |

之後若換 deck／repo，先在該目錄跑 `git remote -v` 確認，再依同樣步驟操作。

### 步驟

1. **進入該 deck 的 git 根目錄**（含 `.git` 的那層，通常就是要發布的 `index.html` 所在目錄）。
2. 檢查狀態與差異：
   - `git status`
   - `git diff`／`git diff --stat`
   - `git log -5 --oneline`（對齊既有 commit 語氣）
3. **Stage 僅相關檔案**（例：`index.html`、`styles.css`、`deck.js`、`assets/`）。不要把暫存、密鑰、本機筆記一起加進去。
4. **Commit**（訊息用英文一句、說明 why；PowerShell 可用 here-string）：

```powershell
git add index.html styles.css
git commit -m @"
Move H2 schedule to appendix and add bonus table SVG Gantt from schedule waves.
"@
```

5. **若 commit 失敗且提示 Author identity unknown**：**禁止**執行 `git config`（含 `--global`／local）。改用上一筆 commit 的作者，以環境變數單次帶入：

```powershell
git log -1 --format='%an%n%ae'
# 假設得到 gaga930 / gaga930@users.noreply.github.com
$env:GIT_AUTHOR_NAME='gaga930'
$env:GIT_AUTHOR_EMAIL='gaga930@users.noreply.github.com'
$env:GIT_COMMITTER_NAME='gaga930'
$env:GIT_COMMITTER_EMAIL='gaga930@users.noreply.github.com'
git commit -m @"
Your message here.
"@
```

6. **Push**：`git push origin main`（或該 repo 追蹤的分支）。若被 Auto-review／權限擋住，依系統提示請使用者核准後重試同一指令。
7. 確認：`git status` 乾淨、`git log -1` 為剛推的 commit；回覆使用者 repo 與 Pages 網址。提醒 Pages 通常需 **1–2 分鐘**才會更新。

### 規則與反模式

- **只在使用者要求時**才 commit／push；改稿過程中不要主動上載。
- **不要**改 `git config`；身分未知時用 `GIT_AUTHOR_*`／`GIT_COMMITTER_*` 環境變數。
- **不要** force push、`--no-verify`、amend 已推送的 commit（除非使用者明確要求且符合安全條件）。
- **不要**在 `slides_buider` 根目錄找 git——週報站點的 repo 在 **deck 目錄內**。
- 推送目標是 GitHub Pages 用的靜態站：只放前端檔（HTML/CSS/JS/assets），不要推整包編輯素材或 Excel 來源（除非使用者指定）。

## 附加資源

- 視覺 tokens：[design.md](design.md)
- 章節式最小模板：[template.md](template.md)
