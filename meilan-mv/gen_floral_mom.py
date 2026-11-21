"""產生「無帽子＋花花連身裙」版本的美蘭圖層（SVG，輸出到 rig/mom2_*.svg）。
沿用角色包的畫布 1103×1426、肩膀樞紐 (455,650)/(665,650)、脖子樞紐 (560,565)、描線色 #1c110c，
表情圖層（mom_face_*.svg）不變，可直接疊上去。"""
import math, os, random
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rig')
INK = '#1c110c'; SKIN = '#fdd0a8'; HAIR = '#debd93'; HAIR2 = '#c49a68'
BASE = '#8FD6C7'; LEAF = '#3FA68E'; BELT = '#E9708F'
SH = {'L': (455, 650), 'R': (665, 650)}
W, H = 1103, 1426

def svg(inner, w=W, h=H, vb=None):
    vb = vb or f'0 0 {w} {h}'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{inner}</svg>'

# ---------- 小花（印花用）----------
def flower(x, y, r, kind, rot=0):
    s = f'<g transform="translate({x:.1f} {y:.1f}) rotate({rot:.0f})" stroke="{INK}" stroke-width="2.6" stroke-linejoin="round">'
    if kind == 'plum':
        for i in range(5):
            a = i * 72
            s += f'<ellipse cx="0" cy="{-r*.55:.1f}" rx="{r*.42:.1f}" ry="{r*.5:.1f}" transform="rotate({a})" fill="#F58AA8"/>'
        s += f'<circle r="{r*.2:.1f}" fill="#FFD66B"/>'
    elif kind == 'daisy':
        for i in range(8):
            s += f'<ellipse cx="0" cy="{-r*.6:.1f}" rx="{r*.2:.1f}" ry="{r*.4:.1f}" transform="rotate({i*45})" fill="#FFFFFF"/>'
        s += f'<circle r="{r*.3:.1f}" fill="#FFC94A"/>'
    elif kind == 'orchid':
        for sx in (-1, 1):
            s += f'<ellipse cx="{sx*r*.5:.1f}" cy="{-r*.1:.1f}" rx="{r*.55:.1f}" ry="{r*.45:.1f}" transform="rotate({sx*20})" fill="#FFFFFF"/>'
        s += f'<ellipse cx="0" cy="{-r*.55:.1f}" rx="{r*.3:.1f}" ry="{r*.5:.1f}" fill="#FFFFFF"/>'
        for sx in (-1, 1):
            s += f'<ellipse cx="{sx*r*.35:.1f}" cy="{r*.45:.1f}" rx="{r*.26:.1f}" ry="{r*.45:.1f}" transform="rotate({-sx*28})" fill="#F3E3FA"/>'
        s += f'<path d="M0 {-r*.1:.1f} Q{-r*.3:.1f} {r*.2:.1f} 0 {r*.55:.1f} Q{r*.3:.1f} {r*.2:.1f} 0 {-r*.1:.1f}" fill="#D86CB8"/>'
    elif kind == 'peony':
        s += f'<circle r="{r*.85:.1f}" fill="#F27B63"/><circle r="{r*.55:.1f}" fill="#F8A08C"/><circle r="{r*.25:.1f}" fill="#FFD1C2"/>'
    elif kind == 'leaf':
        s += f'<ellipse cx="0" cy="{-r*.6:.1f}" rx="{r*.3:.1f}" ry="{r*.7:.1f}" fill="{LEAF}" stroke-width="2"/>'
    return s + '</g>'

def pattern(x0, y0, x1, y1, seed, step=64, scale=1.0):
    rnd = random.Random(seed); out = ''
    kinds = ['peony', 'plum', 'orchid', 'daisy', 'plum', 'orchid']
    gy = 0
    y = y0
    while y < y1:
        x = x0 + (step / 2 if gy % 2 else 0)
        while x < x1:
            jx, jy = rnd.uniform(-10, 10), rnd.uniform(-10, 10)
            k = rnd.choice(kinds); r = rnd.uniform(19, 27) * scale
            ra = rnd.uniform(0, 360)
            out += flower(x + jx - 22 * scale, y + jy + 4, 13 * scale, 'leaf', ra)
            out += flower(x + jx + 22 * scale, y + jy + 10, 13 * scale, 'leaf', ra + 140)
            out += flower(x + jx, y + jy, r, k, ra)
            x += step
        y += step * .82; gy += 1
    return out

# ---------- 頭：捲髮＋蘭花髮飾（沒有帽子）----------
def head():
    cx = 565
    curls_L = [(398, 372, 50), (378, 440, 52), (392, 508, 50), (432, 555, 44)]
    curls_R = [(2 * cx - x, y, r) for x, y, r in curls_L]
    top = [(cx - 150, 246, 58), (cx - 80, 218, 62), (cx, 210, 64), (cx + 80, 218, 62), (cx + 150, 246, 58),
           (cx - 195, 300, 56), (cx + 195, 300, 56)]
    bangs = [(cx - 132, 288, 38), (cx - 64, 278, 34), (cx + 2, 274, 34), (cx + 66, 278, 34), (cx + 134, 288, 38)]
    face = f'<ellipse cx="{cx}" cy="425" rx="166" ry="138" />'
    ow = 9
    o = ''
    # 後面的髮量（外描邊先、填色後）
    back = curls_L + curls_R + top
    o += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}" stroke="{INK}" stroke-width="{2*ow}"/>' for x, y, r in back)
    o += f'<ellipse cx="{cx}" cy="335" rx="203" ry="136" fill="{INK}" stroke="{INK}" stroke-width="{2*ow}"/>'
    o += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{HAIR}"/>' for x, y, r in back)
    o += f'<ellipse cx="{cx}" cy="335" rx="203" ry="136" fill="{HAIR}"/>'
    # 捲度細線
    for x, y, r in curls_L + curls_R:
        sd = 1 if x < cx else -1
        o += f'<path d="M{x-sd*r*.1:.0f} {y-r*.55:.0f} q{sd*r*.55:.0f} {r*.3:.0f} {sd*r*.1:.0f} {r*.8:.0f}" fill="none" stroke="{HAIR2}" stroke-width="6" stroke-linecap="round"/>'
    # 臉
    o += f'<ellipse cx="{cx}" cy="425" rx="166" ry="138" fill="{SKIN}" stroke="{INK}" stroke-width="{ow}"/>'
    # 瀏海（捲捲的）
    o += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}" stroke="{INK}" stroke-width="{2*ow}"/>' for x, y, r in bangs)
    o += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{HAIR}"/>' for x, y, r in bangs)
    o += f'<path d="M{cx-172} 278 Q{cx} 240 {cx+172} 278 L{cx+172} 245 L{cx-172} 245 Z" fill="{HAIR}"/>'
    for x, y, r in bangs:
        o += f'<path d="M{x-r*.35:.0f} {y-r*.3:.0f} q{r*.4:.0f} {r*.2:.0f} {r*.1:.0f} {r*.65:.0f}" fill="none" stroke="{HAIR2}" stroke-width="5" stroke-linecap="round"/>'
    # 蘭花髮飾（左上）＋ 小梅花
    o += flower(cx - 120, 252, 46, 'orchid', -18)
    o += flower(cx - 70, 215, 22, 'plum', 10)
    o += flower(cx - 178, 290, 20, 'leaf', -50) + flower(cx - 160, 300, 20, 'leaf', -100)
    return svg(o)

# ---------- 身體：花花連身裙＋小腿＋白球鞋 ----------
def body():
    cx = 560
    o = ''
    # 小腿與白球鞋
    for lx in (515, 605):
        o += f'<line x1="{lx}" y1="1100" x2="{lx}" y2="1318" stroke="{INK}" stroke-width="{58+16}" stroke-linecap="round"/>'
    for lx in (515, 605):
        o += f'<line x1="{lx}" y1="1100" x2="{lx}" y2="1318" stroke="{SKIN}" stroke-width="58" stroke-linecap="round"/>'
    for lx, sd in ((505, -1), (615, 1)):
        d = f'M{lx-64} 1352 Q{lx-70} 1300 {lx-30} 1294 L{lx+34} 1294 Q{lx+66} 1300 {lx+74} 1340 Q{lx+80} 1384 {lx+40} 1388 L{lx-44} 1388 Q{lx-70} 1388 {lx-64} 1352 Z'
        o += f'<path d="{d}" fill="#FFFFFF" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
        o += f'<path d="M{lx-62} 1366 Q{lx} 1376 {lx+76} 1362 L{lx+74} 1384 Q{lx+40} 1390 {lx-44} 1388 Q{lx-68} 1386 {lx-62} 1366 Z" fill="#E5D3BD" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
        o += f'<path d="M{lx-34} 1320 l20 -6 M{lx-26} 1336 l20 -6" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    # 脖子
    o += f'<rect x="530" y="520" width="60" height="110" rx="20" fill="{SKIN}" stroke="{INK}" stroke-width="9"/>'
    # 洋裝輪廓（A 字，過膝）
    dress = ('M498 612 C468 618 452 640 448 672 L458 786 Q466 816 476 828 '
             'C420 930 380 1030 358 1120 Q380 1154 430 1142 Q466 1164 510 1146 Q560 1170 610 1146 Q654 1164 690 1142 Q740 1154 762 1120 '
             'C740 1030 700 930 644 828 Q654 816 662 786 L672 672 C668 640 652 618 622 612 Q560 668 498 612 Z')
    o += f'<defs><clipPath id="dr"><path d="{dress}"/></clipPath></defs>'
    o += f'<path d="{dress}" fill="{BASE}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    o += f'<g clip-path="url(#dr)">{pattern(350, 640, 780, 1180, 7, 66, 1.0)}</g>'
    o += f'<path d="{dress}" fill="none" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    # 領口（露出脖子下方皮膚）
    o += f'<path d="M500 612 Q560 700 620 612 Z" fill="{SKIN}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>'
    # 腰帶＋蝴蝶結
    o += f'<path d="M462 800 Q560 830 658 800 L664 842 Q560 872 456 842 Z" fill="{BELT}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>'
    bow = f'M560 836 C520 800 486 806 488 842 C490 866 530 856 560 836 C590 856 630 866 632 842 C634 806 600 800 560 836 Z'
    o += f'<path d="{bow}" fill="#F58AA8" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/><circle cx="560" cy="836" r="14" fill="#F27B63" stroke="{INK}" stroke-width="6"/>'
    return svg(o)

# ---------- 手臂：花朵泡泡袖＋裸臂＋裸手 ----------
def ln(d, w, op=1):
    return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>'

def parts_svg(parts, ow=7):
    o = f_ = ''
    for p in parts:
        if p['t'] == 'cap':
            o += f'<line x1="{p["x1"]}" y1="{p["y1"]}" x2="{p["x2"]}" y2="{p["y2"]}" stroke="{INK}" stroke-width="{p["w"]+2*ow}" stroke-linecap="round"/>'
            f_ += f'<line x1="{p["x1"]}" y1="{p["y1"]}" x2="{p["x2"]}" y2="{p["y2"]}" stroke="{p["fill"]}" stroke-width="{p["w"]}" stroke-linecap="round"/>'
        elif p['t'] == 'ell':
            o += f'<ellipse cx="{p["cx"]}" cy="{p["cy"]}" rx="{p["rx"]}" ry="{p["ry"]}" fill="{INK}" stroke="{INK}" stroke-width="{2*ow}"/>'
            f_ += f'<ellipse cx="{p["cx"]}" cy="{p["cy"]}" rx="{p["rx"]}" ry="{p["ry"]}" fill="{p["fill"]}"/>'
        elif p['t'] == 'path':
            o += f'<path d="{p["d"]}" fill="{INK}" stroke="{INK}" stroke-width="{2*ow}" stroke-linejoin="round"/>'
            f_ += f'<path d="{p["d"]}" fill="{p["fill"]}"/>'
    return o + f_

def hand_parts(kind, wy, sd, k=1.15):
    P = []
    C = lambda x1, y1, x2, y2, w: P.append(dict(t='cap', x1=x1*k, y1=wy+y1*k, x2=x2*k, y2=wy+y2*k, w=w*k, fill=SKIN))
    E = lambda cx, cy, rx, ry: P.append(dict(t='ell', cx=cx*k, cy=wy+cy*k, rx=rx*k, ry=ry*k, fill=SKIN))
    if kind == 'fist':
        E(0, 36, 38, 34); C(sd*30, 16, sd*36, 40, 22)
    elif kind == 'open':
        E(0, 40, 38, 32)
        for x, l in ((-27, 104), (-9, 118), (9, 118), (27, 104)): C(x, 52, x*1.1, l, 18)
        C(sd*30, 28, sd*70, 76, 21)
    elif kind == 'thumb':
        E(0, 38, 38, 32); C(sd*16, 24, sd*84, 6, 25)
    return P

def hand_detail(kind, wy, k=1.15):
    o = ''
    if kind in ('fist', 'thumb'):
        for x in (-14, 0, 14): o += ln(f'M {x*k} {wy+44*k} L {x*k} {wy+64*k}', 4*k, .9)
    return o

def arm(side, kind):
    sd = -1 if side == 'L' else 1
    wy = 330; r = 38
    inner = ''
    # 裸臂（細一點）
    inner += parts_svg([dict(t='cap', x1=0, y1=40, x2=0, y2=wy, w=52, fill=SKIN)])
    inner += parts_svg(hand_parts(kind, wy, sd)) + hand_detail(kind, wy)
    # 泡泡袖（花布）
    sl = f'M{-r-8} 6 A{r+8} {r+6} 0 0 1 {r+8} 6 L{r+14} 96 Q{r+8} 112 {r-6} 106 Q{r*.4:.0f} 124 0 108 Q{-r*.4:.0f} 124 {-r+6} 106 Q{-r-8} 112 {-r-14} 96 Z'
    inner += f'<defs><clipPath id="sl{side}{kind}"><path d="{sl}"/></clipPath></defs>'
    inner += f'<path d="{sl}" fill="{BASE}" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    inner += f'<g clip-path="url(#sl{side}{kind})">{pattern(-60, 10, 60, 120, 3 if side=="L" else 5, 46, .62)}</g>'
    inner += f'<path d="{sl}" fill="none" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/>'
    return svg(inner, 340, 760, '-170 -110 340 760')

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    open(f'{OUT}/mom2_head.svg', 'w').write(head())
    open(f'{OUT}/mom2_body.svg', 'w').write(body())
    for sd in 'LR':
        for k in ('fist', 'open', 'thumb'):
            open(f'{OUT}/mom2_arm{sd}_{k}.svg', 'w').write(arm(sd, k))
    print('ok')
