"""女兒的新服裝（使用者提供的款式）：
  cardi    紫色針織外套＋白上衣＋咖啡色 A 字裙＋粉紅瑪莉珍鞋   （refs/girl_cardigan_full.png）
  cardi2   同款，外套改粉紅
  overall  黃 T 恤＋藍色吊帶牛仔褲＋小白鞋                    （refs/girl_overalls_full.png）
  overall2 同款，T 恤改米白
從全身圖去掉頭與手臂，手臂另畫成可轉動的圖層（SVG）。輸出 rig3/girl_<id>_body.png、girl_<id>_arm{L,R}_{fist,open,thumb}.svg"""
import os, sys, json, math
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); RIG = os.path.join(HERE, 'rig3'); sys.path.insert(0, HERE)
import gen_arms3 as G
SKIN = '#fcc9a7'; INK = '#36261e'
CX = 452                           # 身體中線

def load(n): return np.array(Image.open(f'{HERE}/refs/{n}.png').convert('RGBA'))
def erase_head(a):
    H, W = a.shape[:2]; yy, xx = np.mgrid[:H, :W]
    a[yy < 572, 3] = 0
    a[(yy >= 572) & (yy < 598) & ((xx < 392) | (xx > 495)), 3] = 0
def save(a, name): Image.fromarray(a, 'RGBA').save(f'{RIG}/{name}.png')

def mirror_paste(a, x0, x1, y0, y1, cx=CX):
    """把左邊的一塊區域左右鏡射貼到右邊（以身體中線為軸）"""
    blk = a[y0:y1, x0:x1].copy()[:, ::-1]
    nx0 = 2 * cx - x1; nx1 = 2 * cx - x0
    dst = a[y0:y1, nx0:nx1]
    m = blk[..., 3] > 0
    dst[m] = blk[m]

def recolor(a, mask, base, target):
    rgb = a[..., :3].astype(int); new = np.clip(np.array(target) + (rgb - np.array(base)), 0, 255)
    a[mask, :3] = new[mask].astype(np.uint8)

def body_cardi(variant):
    a = load('girl_cardigan_full'); H, W = a.shape[:2]; yy, xx = np.mgrid[:H, :W]
    erase_head(a)
    a[(xx < 345) & (yy < 1190), 3] = 0                          # 左袖＋手（含肩膀圓弧，改由手臂圖層的袖子負責）
    a[(xx >= 560) & (yy < 850), 3] = 0                          # 右袖＋手
    a[(xx >= 640) & (yy < 1100), 3] = 0
    # 左手擋住的裙子：用右半邊鏡射補回（A 字裙左右對稱）
    right = a[846:1262, CX:645].copy()[:, ::-1]; L0 = 2 * CX - 645
    dst = a[846:1262, L0:CX]; m = right[..., 3] > 0; dst[m] = right[m]
    a[846:1262, :L0 + 2, 3] = np.where(a[846:1262, :L0 + 2, 3] > 0, a[846:1262, :L0 + 2, 3], 0)
    if variant == 2:      # 外套改粉紅
        rgb = a[..., :3].astype(int)
        m = (a[..., 3] > 40) & (np.abs(rgb - np.array([186, 146, 168])).sum(2) < 60)
        recolor(a, m, [186, 146, 168], [232, 165, 176])
        m2 = (a[..., 3] > 40) & (np.abs(rgb - np.array([150, 108, 130])).sum(2) < 50)
        recolor(a, m2, [150, 108, 130], [190, 112, 128])
    save(a, f'girl_cardi{"" if variant == 1 else "2"}_body')

def body_overall(variant):
    a = load('girl_overalls_full'); H, W = a.shape[:2]; yy, xx = np.mgrid[:H, :W]
    erase_head(a)
    C2 = 450
    sl = a[600:783, 248:340].copy()                           # 左邊（下垂的）短袖
    a[(yy >= 783) & (xx <= 350) & (yy < 1262), 3] = 0        # 下垂的手臂
    a[(xx >= 568) & (yy < 1320), 3] = 0                       # 右邊整個斜伸的袖子＋手臂
    r = a[783:1262, C2:572].copy()[:, ::-1]; L0 = 2 * C2 - 572    # 牛仔吊帶褲左右對稱：右半邊鏡射補左半邊
    dd = a[783:1262, L0:C2]; mm = r[..., 3] > 0; dd[mm] = r[mm]
    blk = sl[:, ::-1]; nx0 = 2 * C2 - 340
    d = a[600:783, nx0:nx0 + blk.shape[1]]; m = blk[..., 3] > 0; d[m] = blk[m]    # 右袖＝左袖鏡射
    if variant == 2:      # T 恤改米白
        rgb = a[..., :3].astype(int)
        m = (a[..., 3] > 40) & (np.abs(rgb - np.array([252, 212, 116])).sum(2) < 42)
        recolor(a, m, [252, 212, 116], [253, 243, 225])
    save(a, f'girl_overall{"" if variant == 1 else "2"}_body')

# ---------------- 手臂 ----------------
def hand_svg(kind, wy, sd):
    G.SKIN = SKIN; G.INK = INK; G.GLOVE = SKIN; G.HINK = INK; G.OW = 7
    return G.hand(kind, wy, sd, 1.0)
def arm_cardi(side, kind, variant):
    sd = -1 if side == 'L' else 1; wy = 392
    pur, cuff, seam = ('#ba92a8', '#8a5f72', '#a07890') if variant == 1 else ('#e8a5b0', '#be7080', '#d28a98')
    inner = G.parts_svg([dict(t='cap', x1=0, y1=0, x2=0, y2=wy, w=44)]) + hand_svg(kind, wy, sd)
    sl = f'M-41 -12 Q-41 -40 0 -40 Q41 -40 41 -12 L40 338 L-40 338 Z'
    inner += f'<path d="{sl}" fill="{pur}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    inner += f'<path d="M-41 -12 Q-30 20 -26 70" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round" opacity=".7"/>'
    # 針織袖口
    inner += f'<rect x="-44" y="336" width="88" height="54" rx="8" fill="{cuff}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    for x in range(-33, 40, 12): inner += f'<path d="M{x} 342 L{x} 384" stroke="{INK}" stroke-width="4" stroke-linecap="round" opacity=".75"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="340" height="760" viewBox="-170 -110 340 760">{inner}</svg>'
def arm_overall(side, kind):
    sd = -1 if side == 'L' else 1; wy = 320
    inner = G.parts_svg([dict(t='cap', x1=0, y1=-60, x2=0, y2=wy, w=54)], SKIN, INK) if False else None
    G.SKIN = SKIN; G.INK = INK; G.GLOVE = SKIN; G.HINK = INK; G.OW = 7
    inner = G.parts_svg([dict(t='cap', x1=0, y1=-60, x2=0, y2=wy, w=56)]) + hand_svg(kind, wy, sd)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="340" height="760" viewBox="-170 -110 340 760">{inner}</svg>'

INFO = {
 'cardi':    dict(zh='紫針織外套＋咖啡裙', note='優雅、慶祝', pivot=dict(L=[307, 655], R=[597, 655]), behind=False),
 'cardi2':   dict(zh='粉紅針織外套＋咖啡裙', note='溫柔', pivot=dict(L=[307, 655], R=[597, 655]), behind=False),
 'overall':  dict(zh='黃 T 恤＋吊帶牛仔褲', note='番茄園日常', pivot=dict(L=[308, 770], R=[596, 770]), behind=True),
 'overall2': dict(zh='米白 T 恤＋吊帶牛仔褲', note='清爽', pivot=dict(L=[308, 770], R=[596, 770]), behind=True),
}
if __name__ == '__main__':
    os.makedirs(RIG, exist_ok=True)
    body_cardi(1); body_cardi(2); body_overall(1); body_overall(2)
    for oid in INFO:
        for s in 'LR':
            for k in ('fist', 'open', 'thumb'):
                svg = arm_cardi(s, k, 2 if oid == 'cardi2' else 1) if oid.startswith('cardi') else arm_overall(s, k)
                open(f'{RIG}/girl_{oid}_arm{s}_{k}.svg', 'w').write(svg)
        print('made', oid)
    json.dump(INFO, open(f'{RIG}/girl_outfits.json', 'w'), ensure_ascii=False, indent=1)
