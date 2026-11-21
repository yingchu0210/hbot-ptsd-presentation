"""由 rig3/body_base.png 產生多套服裝：rig3/body_<id>.png
做法：把上衣／長褲的底色重新上色（保留描線與陰影），擦掉原本的小花後換成新圖案，必要時再畫圍裙、裙子等。"""
import os, math, json
import numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); RIG = os.path.join(HERE, 'rig3')
INK = (45, 28, 15, 255)
SHIRT0 = np.array([202, 162, 188.]); PANTS0 = np.array([253, 208, 124.]); SHOE0 = np.array([241, 229, 214.])
SS = 2   # 繪圖超採樣

def hexc(h): return np.array([int(h[i:i+2], 16) for i in (1, 3, 5)], float)
def dil(m, r):
    o = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dx*dx + dy*dy <= r*r: o |= np.roll(np.roll(m, dy, 0), dx, 1)
    return o

def load():
    return np.array(Image.open(f'{RIG}/body_base.png').convert('RGBA'))

def regions(a):
    H, W = a.shape[:2]; yy, xx = np.mgrid[:H, :W]
    rgb = a[..., :3].astype(float); al = a[..., 3] > 40
    skin = np.abs(rgb - np.array([252, 196, 165.])).sum(2) < 40
    lum = rgb @ np.array([.299, .587, .114])
    shirt = al & (yy >= 586) & (yy <= 992) & ~skin
    pants = al & (yy >= 987) & (yy <= 1306) & (np.abs(rgb - PANTS0).sum(2) < 70)
    shoes = al & (yy >= 1296) & ~pants & (lum > 100)
    return dict(shirt=shirt, pants=pants, shoes=shoes, lum=lum, rgb=rgb, al=al, yy=yy, xx=xx)

def recolor(a, R, key, base, target, motif=False):
    reg = R[key]; rgb = R['rgb']; lum = R['lum']
    keep = lum < 95
    if motif:
        bl = base @ np.array([.299, .587, .114])
        m = reg & ((lum > bl + 26) | (rgb[..., 1] - (rgb[..., 0] + rgb[..., 2]) / 2 > 8) | ((rgb[..., 0] > 200) & (rgb[..., 1] > 150) & (rgb[..., 2] < 135)))
        m = dil(m, 2) & reg & ~keep
    new = np.clip(target + (rgb - base), 0, 255)
    sel = reg & ~keep
    a[sel, :3] = new[sel].astype(np.uint8)
    if motif: a[m, :3] = np.clip(target, 0, 255).astype(np.uint8)

# ------------- 超採樣繪圖：在整張畫布大小的透明層上畫，再縮小疊上去 -------------
class Layer:
    def __init__(s, W=1103, H=1426):
        s.W, s.H = W, H; s.im = Image.new('RGBA', (W*SS, H*SS), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.im)
    def P(s, pts): return [(x*SS, y*SS) for x, y in pts]
    def poly(s, pts, fill): s.d.polygon(s.P(pts), fill=fill)
    def line(s, pts, fill, w): s.d.line(s.P(pts), fill=fill, width=int(w*SS), joint='curve')
    def circle(s, x, y, r, fill): s.d.ellipse([(x-r)*SS, (y-r)*SS, (x+r)*SS, (y+r)*SS], fill=fill)
    def ellipse(s, x, y, rx, ry, fill): s.d.ellipse([(x-rx)*SS, (y-ry)*SS, (x+rx)*SS, (y+ry)*SS], fill=fill)
    def rect(s, x0, y0, x1, y1, fill): s.d.rectangle([x0*SS, y0*SS, x1*SS, y1*SS], fill=fill)
    def out(s): return np.array(s.im.resize((s.W, s.H), Image.LANCZOS))

def paste(a, layer_arr, mask=None):
    """把繪圖層疊到 a 上；mask 限制範圍"""
    la = layer_arr.copy()
    if mask is not None: la[..., 3] = (la[..., 3] * mask).astype(np.uint8)
    base = Image.fromarray(a, 'RGBA'); base.alpha_composite(Image.fromarray(la, 'RGBA'))
    a[:] = np.array(base)

def fillmask(R, key):   # 可以畫圖案的地方：該區域內、不是描線
    return (R[key] & (R['lum'] >= 95)).astype(float)

# ------------- 圖案 -------------
def daisy(L, x, y, r, col=(255, 244, 222, 255), mid=(214, 170, 60, 255), leaf=(137, 176, 100, 255), rot=0):
    for sd in (-1, 1):
        ang = rot + sd * 0.9
        L.ellipse(x + math.cos(ang)*r*1.5, y + math.sin(ang)*r*1.5 + r*.2, r*.55, r*.25, leaf)
    for i in range(5):
        a = rot + i*2*math.pi/5
        L.circle(x + math.cos(a)*r*.62, y + math.sin(a)*r*.62, r*.5, col)
    L.circle(x, y, r*.34, mid)
def scatter(L, box, fn, step=62, seed=1):
    rng = np.random.RandomState(seed); x0, y0, x1, y1 = box; row = 0; y = y0
    while y < y1:
        x = x0 + (step/2 if row % 2 else 0)
        while x < x1:
            fn(L, x + rng.uniform(-10, 10), y + rng.uniform(-10, 10), rng); x += step
        y += step*.8; row += 1
def tuanhua(L, x, y, r, gold=(240, 190, 80, 255), dark=(190, 60, 50, 255)):
    L.circle(x, y, r, gold); L.circle(x, y, r*.78, dark)
    for i in range(8):
        a = i*math.pi/4; L.circle(x + math.cos(a)*r*.46, y + math.sin(a)*r*.46, r*.2, gold)
    L.circle(x, y, r*.22, gold)
def peony(L, x, y, r, c1=(240, 120, 150, 255), c2=(255, 190, 205, 255), c3=(255, 235, 240, 255)):
    L.circle(x, y, r, c1); L.circle(x, y, r*.66, c2); L.circle(x, y, r*.32, c3)

# ------------- 服裝設定 -------------
BOX = (322, 590, 790, 990)
def top_pattern(a, R, kind, c):
    mask = fillmask(R, 'shirt'); L = Layer()
    if kind == 'daisy':
        scatter(L, BOX, lambda L, x, y, rng: daisy(L, x, y, rng.uniform(13, 17), rot=rng.uniform(0, 6.28), col=c.get('petal', (255, 244, 222, 255))), 66, 3)
    elif kind == 'dots':
        scatter(L, BOX, lambda L, x, y, rng: L.circle(x, y, 9, c['dot']), 40, 1)
    elif kind == 'stripe':
        for y in range(590, 1000, 46): L.rect(300, y, 810, y + 22, c['stripe'])
    elif kind == 'tuanhua':
        scatter(L, BOX, lambda L, x, y, rng: tuanhua(L, x, y, 17), 74, 2)
    elif kind == 'tiny':
        scatter(L, BOX, lambda L, x, y, rng: L.circle(x, y, 5, c['dot']), 28, 4)
    paste(a, L.out(), mask)

def draw_outlined(a, pts, fill_fn, w=9):
    """畫一塊有描線的衣物（圍裙／裙子）：fill_fn(L, mask_layer) 在多邊形內畫圖案"""
    m = Layer(); m.poly(pts, (255, 255, 255, 255))
    marr = m.out()[..., 3] / 255.0
    L = Layer(); fill_fn(L)
    paste(a, L.out(), marr)
    o = Layer(); o.line(pts + [pts[0]], INK, w); paste(a, o.out())

def gingham(L, box, c1, c2, cell=26):
    x0, y0, x1, y1 = box
    L.rect(x0, y0, x1, y1, c1)
    for x in range(int(x0), int(x1), cell*2): L.rect(x, y0, x + cell, y1, c2)
    for y in range(int(y0), int(y1), cell*2): L.rect(x0, y, x1, y + cell, c2)

def make(outfit_id):
    a = load(); R = regions(a); o = OUTFITS[outfit_id]
    if o.get('shirt'): recolor(a, R, 'shirt', SHIRT0, hexc(o['shirt']), motif=True)
    if o.get('pants'): recolor(a, R, 'pants', PANTS0, hexc(o['pants']))
    if o.get('shoes'): recolor(a, R, 'shoes', SHOE0, hexc(o['shoes']))
    R = regions(a) if False else R
    if o.get('pattern'): top_pattern(a, R, o['pattern'], o.get('c', {}))
    for fn in o.get('extra', []): fn(a, R)
    Image.fromarray(a, 'RGBA').save(f'{RIG}/body_{outfit_id}.png')

# ----- 各套的額外細節 -----
def hakka_extra(a, R):
    L = Layer(); pink = (240, 120, 150, 255); cream = (255, 240, 220, 255)
    # 大襟：從領口斜向右下的滾邊
    pts = [(566, 626), (600, 690), (650, 760), (690, 830), (700, 900)]
    L.line(pts, cream, 11); L.line(pts, pink, 5)
    for (x, y) in [(600, 690), (650, 760), (690, 830)]: L.circle(x, y, 7, (250, 220, 120, 255)); L.circle(x, y, 3.5, INK)
    # 袖口、下擺花布滾邊
    for sd in (-1, 1):
        cx = 555 + sd*0
    paste(a, L.out(), fillmask(R, 'shirt'))
    T = Layer()
    # 下擺帶狀花布
    T.rect(380, 944, 730, 970, (236, 118, 142, 255))
    for x in range(392, 730, 34): peony(T, x, 957, 9)
    # 袖口帶
    for sd in (-1, 1):
        for t in np.linspace(0, 1, 6):
            pass
    paste(a, T.out(), fillmask(R, 'shirt'))
def apron_extra(a, R):
    ink = INK; red = (214, 70, 66, 255); white = (255, 250, 240, 255)
    # 圍裙：肩帶 + 胸襟 + 裙擺
    skirt = [(488, 800), (626, 800), (702, 1095), (668, 1118), (440, 1118), (408, 1095)]
    bib = [(503, 690), (612, 690), (628, 802), (486, 802)]
    straps = L = Layer(); L.line([(505, 692), (486, 606)], (214, 70, 66, 255), 16); L.line([(610, 692), (628, 606)], (214, 70, 66, 255), 16)
    paste(a, L.out(), fillmask(R, 'shirt') + 0)
    for sd in (-1, 1):
        o = Layer(); x0 = 505 if sd < 0 else 610; x1 = 486 if sd < 0 else 628
        o.line([(x0 - 8, 692), (x1 - 8, 606)], INK, 3); o.line([(x0 + 8, 692), (x1 + 8, 606)], INK, 3); paste(a, o.out(), fillmask(R, 'shirt'))
    draw_outlined(a, skirt, lambda L: gingham(L, (400, 790, 710, 1125), red, (240, 150, 140, 255)))
    draw_outlined(a, bib, lambda L: gingham(L, (480, 685, 635, 806), red, (240, 150, 140, 255)))
    # 腰繩 + 口袋
    o = Layer(); o.line([(486, 804), (628, 804)], INK, 9); paste(a, o.out())
    pocket = [(500, 930), (612, 930), (606, 1010), (506, 1010)]
    draw_outlined(a, pocket, lambda L: gingham(L, (495, 925, 620, 1015), white, (240, 215, 200, 255), 18), 7)
    t = Layer(); t.circle(556, 975, 20, (230, 60, 50, 255)); t.circle(556, 950, 6, (110, 170, 90, 255)); t.circle(556, 975, 20, (230, 60, 50, 255)); paste(a, t.out())
def redtang_extra(a, R):
    L = Layer(); gold = (245, 200, 90, 255)
    # 領口金邊 + 盤扣
    L.line([(500, 604), (520, 626), (556, 634), (592, 626), (612, 604)], gold, 9)
    for (x, y) in [(556, 660), (556, 700), (556, 740)]:
        L.circle(x, y, 11, gold); L.circle(x, y, 5, (190, 60, 50, 255))
    paste(a, L.out(), fillmask(R, 'shirt'))
    T = Layer(); T.rect(380, 950, 730, 966, gold); paste(a, T.out(), fillmask(R, 'shirt'))
def dress_extra(a, R):
    # 先把長褲擦掉，換成裙子與露出的小腿
    yy = R['yy']; xx = R['xx']
    a[(yy >= 986) & (yy <= 1298) & (xx > 418) & (xx < 692), 3] = 0
    legs = Layer()
    skin = (252, 196, 165, 255)
    for cx in (500, 612):
        legs.line([(cx, 1090), (cx, 1300)], INK, 70); 
    for cx in (500, 612):
        legs.line([(cx, 1090), (cx, 1300)], skin, 54)
    base = Image.fromarray(np.zeros_like(a), 'RGBA'); base.alpha_composite(Image.fromarray(legs.out(), 'RGBA')); base.alpha_composite(Image.fromarray(a, 'RGBA'))
    a[:] = np.array(base)
    pts = [(389, 962), (718, 962), (770, 1150), (744, 1176), (676, 1166), (612, 1180), (556, 1168), (496, 1180), (432, 1166), (366, 1176), (336, 1150)]
    c = DRESS
    def fill(L):
        L.rect(320, 955, 790, 1190, c['base'])
        scatter(L, (330, 970, 780, 1190), lambda L, x, y, rng: daisy(L, x, y, rng.uniform(13, 17), rot=rng.uniform(0, 6.28)), 66, 5)
    draw_outlined(a, pts, fill)
DRESS = {'base': (62, 124, 140, 255)}

OUTFITS = {
 'daily':   dict(zh='紫花衫＋黃長褲', note='原始設計'),
 'hakka':   dict(zh='客家藍衫', shirt='#2D4A80', pants='#2B2B36', shoes='#3A4258', extra=[hakka_extra], note='美濃場景'),
 'apron':   dict(zh='廚房格紋圍裙', shirt='#FFF0D2', pants='#D8B98C', pattern='tiny', c=dict(dot=(240, 150, 150, 255)), extra=[apron_extra], note='廚房場景'),
 'redtang': dict(zh='喜氣紅唐裝', shirt='#C8403A', pants='#3A2A30', shoes='#8E2F2F', pattern='tuanhua', extra=[redtang_extra], note='過年、財神場景'),
 'mint':    dict(zh='薄荷點點衫＋白褲', shirt='#A3DAC8', pants='#F5EBDD', pattern='dots', c=dict(dot=(255, 255, 255, 255)), note='夏日'),
 'stripe':  dict(zh='橘白條紋＋牛仔褲', shirt='#FFF3DC', pants='#5C84B8', pattern='stripe', c=dict(stripe=(242, 140, 80, 255)), note='出遊'),
 'dress':   dict(zh='青藍小花洋裝', shirt='#3E7C8C', pants='#3E7C8C', pattern='daisy', extra=[dress_extra], note='正式、慶祝'),
}
if __name__ == '__main__':
    for k in OUTFITS: make(k); print('made', k)
    json.dump({k: {'zh': v['zh'], 'note': v.get('note', '')} for k, v in OUTFITS.items()}, open(f'{RIG}/outfits.json', 'w'), ensure_ascii=False, indent=1)
