---
name: publish-to-git
description: >-
  將本專案網頁簡報／週報 deck（或專案 skill）commit 並推送到 GitHub／GitHub Pages。
  當使用者要求上載到 git、推送、發布、更新網站、publish、push to GitHub Pages，
  或要把 .cursor/skills 一併上 git 時使用。與 web-slides（內容製作）分開；
  改稿過程不要主動套用本 skill。
---

# 上載到 Git（GitHub Pages）

僅在使用者**明確要求**時執行 commit／push。不要擅自上載。

製作／改簡報內容用 **web-slides**；本 skill 只負責版本控管與發布。

## 本專案現況（週報 deck）

| 項目 | 值 |
|------|-----|
| Git 根目錄 | `decks/weekly-report-260903/`（**不是** `slides_buider` 專案根） |
| Remote | `https://github.com/gaga930/my-website.git` |
| 分支 | `main`（此目錄檔案＝站點根目錄） |
| 網站 | `https://gaga930.github.io/my-website/` |

換 deck／repo 時先在該目錄跑 `git remote -v` 確認，再依同樣步驟。

## 步驟（deck 內容）

1. **進入 git 根目錄**（含 `.git` 的那層；通常有要發布的 `index.html`）。
2. 檢查：
   - `git status`
   - `git diff`／`git diff --stat`
   - `git log -5 --oneline`（對齊 commit 語氣）
3. **Stage 僅相關檔案**（例：`index.html`、`styles.css`、`deck.js`、`assets/`）。排除暫存、密鑰、本機筆記、未要求的 Excel 原稿。
4. **Commit**（英文一句說明 why；PowerShell here-string）：

```powershell
git add index.html styles.css
git commit -m @"
Update bonus table Gantt waves to the revised schedule.
"@
```

5. **Author identity unknown**：**禁止** `git config`。用上一筆作者＋環境變數單次帶入：

```powershell
git log -1 --format='%an%n%ae'
$env:GIT_AUTHOR_NAME='gaga930'
$env:GIT_AUTHOR_EMAIL='gaga930@users.noreply.github.com'
$env:GIT_COMMITTER_NAME='gaga930'
$env:GIT_COMMITTER_EMAIL='gaga930@users.noreply.github.com'
git commit -m @"
Your message here.
"@
```

6. **Push**：`git push origin main`（或追蹤分支）。被 Auto-review／權限擋住時，請使用者核准後重試同一指令。
7. 確認 `git status` 乾淨；回覆 commit hash、repo、Pages 網址。提醒 Pages 約 **1–2 分鐘**更新。

## 步驟（專案 skill 上 git）

工作區 skill 在 `slides_buider/.cursor/skills/`；git 根在 deck 目錄。要上載 skill 時：

1. 將要發布的 skill 目錄**複製**到 git 根：`decks/weekly-report-260903/.cursor/skills/<skill-name>/`
2. 與工作區來源對齊後再 `git add .cursor/skills/` → commit → push
3. 勿只改一邊：工作區與 repo 內副本需同步，或明確告知使用者哪邊是權威來源

## 規則與反模式

- 只在使用者要求時 commit／push
- 不要改 `git config`；用 `GIT_AUTHOR_*`／`GIT_COMMITTER_*`
- 不要 force push、`--no-verify`、amend 已推送 commit（除非使用者明確要求且安全條件滿足）
- 不要在 `slides_buider` 根目錄找本站 git
- Pages 站以靜態前端為主；不要順便推整包編輯素材（除非使用者指定）
