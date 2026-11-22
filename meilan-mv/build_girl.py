"""女兒的夏季服裝（短袖）：把原本的羽絨外套＋圍巾換掉，產生 rig3/girl_<id>_body.png 與短袖手臂 SVG。
輸入：refs/girl_body_winter.png（原角色包的女兒身體圖層，已轉成點陣）。頭、表情沿用原圖層。
三套：tomato 番茄 T 恤＋牛仔短褲／sky 藍白條紋＋卡其短褲／sun 檸檬黃小花＋白短褲。"""
import os, math, sys
import numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); RIG = os.path.join(HERE, 'rig3')
sys.path.insert(0, HERE)
import gen_arms3 as G
INK = (51, 33, 26, 255); SKIN = (252, 206, 171, 255)
SS = 2
W, H = 1116, 1410

OUT = {
 'tomato': dict(zh='番茄 T 恤＋牛仔短褲', base=(255, 243, 220), pat='tomato', shorts=(110, 147, 196), note='番茄園日常'),
 'sky':    dict(zh='藍白條紋＋卡其短褲', base=(190, 224, 242), pat='stripe', shorts=(216, 195, 154), note='出遊'),
 'sun':    dict(zh='檸檬黃小花＋白短褲', base=(255, 226, 138), pat='daisy', shorts=(246, 240, 230), note='夏日'),
}

class Layer:
    def __init__(s): s.im = Image.new('RGBA', (W*SS, H*SS), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.im)
    def P(s, pts): return [(x*SS, y*SS) for x, y in pts]
    def poly(s, pts, fill): s.d.polygon(s.P(pts), fill=fill)
    def line(s, pts, fill, w): s.d.line(s.P(pts), fill=fill, width=int(w*SS), joint='curve')
    def circle(s, x, y, r, fill): s.d.ellipse([(x-r)*SS, (y-r)*SS, (x+r)*SS, (y+r)*SS], fill=fill)
    def ellipse(s, x, y, rx, ry, fill): s.d.ellipse([(x-rx)*SS, (y-ry)*SS, (x+rx)*SS, (y+ry)*SS], fill=fill)
    def rect(s, x0, y0, x1, y1, fill): s.d.rectangle([x0*SS, y0*SS, x1*SS, y1*SS], fill=fill)
    def out(s): return np.array(s.im.resize((W, H), Image.LANCZOS))

def comp(base, layer, mask=None):
    la = layer.copy()
    if mask is not None: la[..., 3] = (la[..., 3] * mask).astype(np.uint8)
    b = Image.fromarray(base, 'RGBA'); b.alpha_composite(Image.fromarray(la, 'RGBA')); base[:] = np.array(b)

def pattern(L, kind, box, seed=1):
    x0, y0, x1, y1 = box; rng = np.random.RandomState(seed)
    if kind == 'stripe':
        for y in range(int(y0), int(y1), 44): L.rect(x0, y, x1, y + 20, (255, 255, 255, 255))
    elif kind == 'tomato':
        y = y0; row = 0
        while y < y1:
            x = x0 + (34 if row % 2 else 0)
            while x < x1:
                px, py = x + rng.uniform(-6, 6), y + rng.uniform(-6, 6)
                L.circle(px, py, 15, (222, 62, 52, 255)); L.circle(px - 5, py - 5, 4, (255, 150, 140, 255))
                for a in range(5):
                    ang = a * 2 * math.pi / 5 - math.pi / 2; L.ellipse(px + math.cos(ang) * 6, py - 12 + math.sin(ang) * 3, 5, 3, (96, 160, 80, 255))
                x += 68
            y += 56; row += 1
    elif kind == 'daisy':
        y = y0; row = 0
        while y < y1:
            x = x0 + (30 if row % 2 else 0)
            while x < x1:
                px, py = x + rng.uniform(-6, 6), y + rng.uniform(-6, 6)
                for a in range(6):
                    ang = a * math.pi / 3; L.circle(px + math.cos(ang) * 9, py + math.sin(ang) * 9, 7, (255, 255, 255, 255))
                L.circle(px, py, 6, (230, 160, 60, 255)); x += 60
            y += 52; row += 1

def body(oid):
    o = OUT[oid]; a = np.array(Image.open(f'{HERE}/refs/girl_body_winter.png').convert('RGBA'))
    yy, xx = np.mgrid[:H, :W]
    a[yy < 1048, 3] = 0                                   # 外套、圍巾、斜背包上半
    a[(yy < 1125) & (xx < 333), 3] = 0                    # 包包
    # 短褲：剪到膝上，褲管換色
    SH = 1168
    keep_shoes = yy >= 1356
    a[(yy >= SH) & ~keep_shoes, 3] = 0
    rgb = a[..., :3].astype(int); sel = (a[..., 3] > 40) & (yy < 1356) & (rgb.sum(2) > 110) & (rgb[..., 2] >= rgb[..., 0] + 3)
    base = np.array([58, 56, 72]); tgt = np.array(o['shorts'])
    new = np.clip(tgt + (rgb - base), 0, 255); a[sel, :3] = new[sel].astype(np.uint8)
    # 腳底的深色褲管尾端 → 白襪
    low = (yy >= 1356) & (a[..., 3] > 40) & (np.abs(rgb - np.array([63, 61, 79])).sum(2) < 60) | ((yy >= 1356) & (yy < 1372) & (a[..., 3] > 40) & (rgb.sum(2) < 260))
    a[low & (yy < 1372), :3] = (250, 248, 244)
    out = np.zeros_like(a)
    # 小腿（先畫，再疊褲子與鞋）
    legs = Layer()
    for cx in (390, 494):
        legs.line([(cx, SH - 10), (cx, 1362)], INK, 62 + 14);
    for cx in (390, 494):
        legs.line([(cx, SH - 10), (cx, 1362)], SKIN, 62)
    comp(out, legs.out()); comp(out, a)
    # 短褲褲管下緣線
    hem = Layer()
    for (x0, x1) in ((337, 441), (443, 547)):
        hem.line([(x0 - 1, SH - 4), (x1 + 1, SH - 4)], INK, 9)
    comp(out, hem.out())
    # 脖子
    nk = Layer(); nk.rect(402, 560, 478, 650, INK); nk.rect(409, 560, 471, 650, SKIN); comp(out, nk.out())
    # T 恤
    tee = [(308, 650), (352, 624), (400, 626), (440, 650), (480, 626), (528, 624), (572, 650), (588, 700), (582, 1040), (440, 1062), (298, 1040), (292, 700)]
    m = Layer(); m.poly(tee, (255, 255, 255, 255)); mask = m.out()[..., 3] / 255.0
    f = Layer(); f.rect(280, 600, 600, 1080, tuple(o['base']) + (255,))
    pattern(f, o['pat'], (290, 640, 590, 1060), 2)
    comp(out, f.out(), mask)
    ol = Layer(); ol.line(tee + [tee[0]], INK, 10); comp(out, ol.out())
    # 領口
    col = Layer(); col.poly([(396, 624), (440, 668), (484, 624)], SKIN + ()) if False else None
    cl = Layer(); cl.line([(398, 626), (418, 654), (440, 662), (462, 654), (482, 626)], INK, 8); comp(out, cl.out())
    cs = Layer(); cs.poly([(400, 628), (440, 664), (480, 628), (480, 610), (400, 610)], SKIN); comp(out, cs.out())
    cl2 = Layer(); cl2.line([(398, 626), (418, 654), (440, 662), (462, 654), (482, 626)], INK, 8); comp(out, cl2.out())
    Image.fromarray(out, 'RGBA').save(f'{RIG}/girl_{oid}_body.png')

# ---- 短袖手臂 ----
def arm(side, hand, oid):
    o = OUT[oid]; sd = -1 if side == 'L' else 1; wy = 402
    G.SKIN = '#fcceab'; G.INK = '#33211a'; G.GLOVE = G.SKIN; G.HINK = G.INK; G.OW = 7
    inner = G.parts_svg([dict(t='cap', x1=0, y1=0, x2=0, y2=wy, w=48)]) + G.hand(hand, wy, sd, 1.0)
    fab = '#%02x%02x%02x' % tuple(o['base'])
    sl = 'M-48 -14 Q0 -64 48 -14 L54 112 Q0 132 -54 112 Z'
    cid = f'sl{side}{hand}{oid}'
    pat = ''
    if o['pat'] == 'stripe':
        pat = ''.join(f'<rect x="-60" y="{y}" width="120" height="12" fill="#fff"/>' for y in range(-30, 130, 32))
    elif o['pat'] == 'tomato':
        pat = ''.join(f'<g transform="translate({x} {y})"><circle r="11" fill="#de3e34"/><ellipse cx="0" cy="-9" rx="6" ry="3" fill="#60a050"/></g>' for x, y in ((-24, 6), (22, 20), (-8, 62), (26, 88), (-30, 100)))
    elif o['pat'] == 'daisy':
        pat = ''.join(f'<g transform="translate({x} {y})">' + ''.join(f'<circle cx="{7*math.cos(k*math.pi/3):.1f}" cy="{7*math.sin(k*math.pi/3):.1f}" r="5.5" fill="#fff"/>' for k in range(6)) + '<circle r="4.5" fill="#e6a03c"/></g>' for x, y in ((-24, 8), (22, 24), (-6, 64), (26, 90), (-30, 100)))
    inner += (f'<defs><clipPath id="{cid}"><path d="{sl}"/></clipPath></defs><path d="{sl}" fill="{fab}" stroke="#33211a" stroke-width="9" stroke-linejoin="round"/>'
              f'<g clip-path="url(#{cid})">{pat}</g><path d="{sl}" fill="none" stroke="#33211a" stroke-width="9" stroke-linejoin="round"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="340" height="760" viewBox="-170 -110 340 760">{inner}</svg>'

if __name__ == '__main__':
    os.makedirs(RIG, exist_ok=True)
    for k in OUT:
        body(k)
        for s in 'LR':
            for h in ('fist', 'open', 'thumb'):
                open(f'{RIG}/girl_{k}_arm{s}_{h}.svg', 'w').write(arm(s, h, k))
        print('made', k)
    import json
    json.dump({k: {'zh': v['zh'], 'note': v['note']} for k, v in OUT.items()}, open(f'{RIG}/girl_outfits.json', 'w'), ensure_ascii=False, indent=1)
