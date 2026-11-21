"""由使用者提供的角色圖（頭、全身）建立動畫用分層素材 rig3/。
輸入：refs/head.png、refs/body.png（透明底 PNG）
輸出：rig3/head.png（去掉五官的頭）、rig3/body_base.png（去掉頭與手臂的身體）"""
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, 'refs'); OUT = os.path.join(HERE, 'rig3'); os.makedirs(OUT, exist_ok=True)
CW, CH = 1103, 1426           # 畫布（與原角色包相同）
CX = 555                      # 身體中線
SKIN = np.array([252, 196, 165])

def dilate(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            if dx * dx + dy * dy <= r * r:
                out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out

def ellipse_mask(shape, cx, cy, rx, ry):
    yy, xx = np.mgrid[:shape[0], :shape[1]]
    return ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= 1

# ---------------- 頭：擦掉眉、眼、鼻、嘴（之後由程式畫表情）----------------
def build_head():
    im = Image.open(f'{REF}/head.png').convert('RGBA'); a = np.array(im).astype(int)
    H, W = a.shape[:2]
    box = np.zeros((H, W), bool); box[470:840, 495:935] = True
    cheeks = ellipse_mask((H, W), 537, 697, 70, 50) | ellipse_mask((H, W), 900, 697, 70, 50)   # 腮紅保留
    dist = np.abs(a[..., :3] - SKIN).sum(2)
    feat = box & ~cheeks & (dist > 26) & (a[..., 3] > 100)
    feat = dilate(feat, 5) & box & ~cheeks
    a[feat, :3] = SKIN
    im2 = Image.fromarray(a.astype(np.uint8), 'RGBA')
    s = 0.616
    im2 = im2.resize((round(W * s), round(H * s)), Image.LANCZOS)
    canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    ox, oy = round(CX - 711 * s), round(45 - 76 * s)
    # 裁掉脖子（身體層自己有脖子）：下巴約在原圖 y=878
    cut = round(oy + 884 * s)
    arr = np.array(im2); arr[cut - oy:, :, 3] = 0; im2 = Image.fromarray(arr, 'RGBA')
    canvas.alpha_composite(im2, (ox, oy))
    canvas.save(f'{OUT}/head.png')
    return canvas

# ---------------- 身體：去掉頭與手臂（袖子留著）----------------
def build_body():
    a = np.array(Image.open(f'{REF}/body.png').convert('RGBA'))
    a[:530, :, 3] = 0                         # 頭
    for y in range(530, 549): a[y, :503, 3] = 0; a[y, 614:, 3] = 0    # 只留脖子，頭層蓋在上面
    al = a[..., 3] > 40
    H, W = al.shape
    for y in range(790, 1010):                # 袖子下方的手臂：只保留含中線的那一段
        xs = np.where(al[y])[0]
        if len(xs) == 0: continue
        runs = []; s = p = xs[0]
        for x in xs[1:]:
            if x != p + 1: runs.append((s, p)); s = x
            p = x
        runs.append((s, p))
        keep = [r for r in runs if r[0] <= CX <= r[1]]
        a[y, :, 3] = 0
        for r0, r1 in keep: a[y, r0:r1 + 1, 3] = np.array(Image.open(f'{REF}/body.png').convert('RGBA'))[y, r0:r1 + 1, 3]
    # 袖口下緣線以下的手臂（左右對稱）
    src = np.array(Image.open(f'{REF}/body.png').convert('RGBA'))
    for y in range(716, 790):
        lx = 338 + (y - 719) * (79 / 63) - 3
        a[y, :int(lx), 3] = 0
        rx = 2 * CX - lx
        a[y, int(rx):, 3] = 0
    Image.fromarray(a, 'RGBA').save(f'{OUT}/body_base.png')

if __name__ == '__main__':
    build_head(); build_body(); print('ok')
