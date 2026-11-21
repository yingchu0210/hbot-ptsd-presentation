"""手臂（裸臂＋三種手勢），套用使用者設計的膚色與描線。原點＝肩膀樞紐，手臂朝 +y 垂下。輸出 rig3/arm{L,R}_{fist,open,thumb}.svg"""
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rig3')
INK = '#2d1c0f'; SKIN = '#fcc4a5'; OW = 8
GLOVE = SKIN; HINK = INK   # 手：沿用「花洋裝版」畫的膚色裸手（形狀與手勢不變）
def ln(d, w, op=1): return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>'
def parts_svg(parts, fill=None, ink=None):
    o = f = ''
    for p in parts:
        ink_ = ink or INK; fill_ = fill or SKIN
        if p['t'] == 'cap':
            o += f'<line x1="{p["x1"]}" y1="{p["y1"]}" x2="{p["x2"]}" y2="{p["y2"]}" stroke="{ink_}" stroke-width="{p["w"]+2*OW}" stroke-linecap="round"/>'
            f += f'<line x1="{p["x1"]}" y1="{p["y1"]}" x2="{p["x2"]}" y2="{p["y2"]}" stroke="{fill_}" stroke-width="{p["w"]}" stroke-linecap="round"/>'
        else:
            o += f'<ellipse cx="{p["cx"]}" cy="{p["cy"]}" rx="{p["rx"]}" ry="{p["ry"]}" fill="{ink_}" stroke="{ink_}" stroke-width="{2*OW}"/>'
            f += f'<ellipse cx="{p["cx"]}" cy="{p["cy"]}" rx="{p["rx"]}" ry="{p["ry"]}" fill="{fill_}"/>'
    return o + f
def hand(kind, wy, sd, k=1.15):
    P = []
    C = lambda x1, y1, x2, y2, w: P.append(dict(t='cap', x1=x1*k, y1=wy+y1*k, x2=x2*k, y2=wy+y2*k, w=w*k))
    E = lambda cx, cy, rx, ry: P.append(dict(t='ell', cx=cx*k, cy=wy+cy*k, rx=rx*k, ry=ry*k))
    if kind == 'fist': E(0, 36, 38, 34); C(sd*30, 16, sd*36, 40, 22)
    elif kind == 'open':
        E(0, 40, 38, 32)
        for x, l in ((-27, 104), (-9, 118), (9, 118), (27, 104)): C(x, 52, x*1.1, l, 18)
        C(sd*30, 28, sd*70, 76, 21)
    elif kind == 'thumb': E(0, 38, 38, 32); C(sd*16, 24, sd*84, 6, 25)
    o = parts_svg(P, GLOVE, HINK)
    def hl(d, w, op=1): return f'<path d="{d}" fill="none" stroke="{HINK}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>'
    if kind in ('fist', 'thumb'):
        for x in (-14, 0, 14): o += hl(f'M {x*k} {wy+44*k} L {x*k} {wy+64*k}', 4*k, .9)
    return o
def arm(side, kind):
    sd = -1 if side == 'L' else 1; wy = 235
    inner = parts_svg([dict(t='cap', x1=0, y1=0, x2=0, y2=wy, w=56)]) + hand(kind, wy, sd)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="340" height="760" viewBox="-170 -110 340 760">{inner}</svg>'
if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for s in 'LR':
        for k in ('fist', 'open', 'thumb'): open(f'{OUT}/arm{s}_{k}.svg', 'w').write(arm(s, k))
    print('ok')
