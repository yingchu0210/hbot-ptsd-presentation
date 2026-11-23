# 動畫 MV 製作經驗（美蘭 MV 成功流程）

以後做動畫／MV 照這套做。

## 技術流程
1. **程式繪製動畫**：Canvas 2D 程序式動畫。`mv.html` 載入 `timeline.js`（時間軸）+ `scenes.js`（場景），`renderFrame(t)` 畫出時間 t 的一格。
2. **時間軸對歌詞**：用 faster-whisper（small，word timestamps，歌詞當 initial_prompt，分段視窗）抓每句起訖；onset 自相關估 BPM。換歌時只需重抓時間、改 `timeline.js`。
3. **角色骨架**：身體／手臂（繞肩軸轉）／頭（繞頸軸轉）分層，臉用程式畫表情；服裝用 PIL 對圖層重新上色或貼圖案產生多套。
4. **輸出**：`node render.js 0 <秒數> 30 <資料夾> <i> 3` 開 3 個 worker 平行輸出 JPG，再用 ffmpeg（libx264 + AAC，crf 23、preset slow）合併 mp3。
5. **字體**：標題 Noto Serif TC 900、歌詞 jf-openhuninn（皆 OFL，放 `fonts/`）。

## 協作習慣（使用者很滿意）
- 使用者提供的圖優先使用，不要自己重畫；替換素材時先出**對照圖**（A/B）讓使用者決定，決定後再整片重輸出。
- 每次改動先截關鍵畫面檢查（疊字、重疊、跳格），再整片輸出。
- 設定圖（角色主設定／服裝）另外輸出給使用者看。
- 成品用 SendUserFile 傳給使用者；commit 並 push 到指定分支，不開 PR。

## 注意事項
- **mp4 要小於 100 MB**（GitHub 上限）：crf 18 會超過，用 crf 23 約 55 MB。
- 預覽用 `python3 -m http.server 8765`，背景有時間上限會被停，連線被拒就重開。
- Bash 的 `sleep` 被擋，等待用 Monitor／run_in_background。
- Canvas 橢圓半徑不能為負：翻轉縮放時用 `Math.abs`。
- `build_girl.py` 為舊版，重跑會覆蓋 `girl_outfits.json`，不要重跑；現用 `build_girl2.py`。
