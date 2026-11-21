import sys,os,json,re,math
S='/tmp/claude-0/-home-user-hbot-ptsd-presentation/c2a4fe47-30e5-5535-bfbf-4dee275d6c91/scratchpad'
sys.path.insert(0,S+'/pylib5');sys.path.insert(0,S+'/pylib3');sys.path.insert(0,S+'/pylib2')
import numpy as np, vtracer
from PIL import Image, ImageDraw
import cv2
VEC=S+'/vec/';OUT=S+'/rig/out/';os.makedirs(OUT,exist_ok=True)
EXPR=['smile','happy','laugh','shy','sad','wow']

def hexrgb(h):return tuple(int(h[i:i+2],16) for i in (1,3,5))
def trace(png,svg,speckle=6,layer=6):
    vtracer.convert_image_to_svg_py(png,svg,colormode='color',hierarchical='stacked',mode='spline',filter_speckle=speckle,color_precision=8,layer_difference=layer,corner_threshold=60,length_threshold=4.0,max_iterations=10,splice_threshold=45,path_precision=2)

class Canvas:
    """RGBA raster with simple editing helpers (no antialias; tracing smooths)"""
    def __init__(s,path):
        s.im=Image.open(path).convert('RGBA');s.W,s.H=s.im.size;s.d=ImageDraw.Draw(s.im)
    def erase(s,poly):
        m=Image.new('L',s.im.size,0);ImageDraw.Draw(m).polygon(poly,fill=255)
        a=np.array(s.im);mm=np.array(m)>0;a[mm,3]=0;a[mm,:3]=0;s.im=Image.fromarray(a,'RGBA');s.d=ImageDraw.Draw(s.im)
    def erase_mask(s,mask):
        a=np.array(s.im);a[mask,3]=0;a[mask,:3]=0;s.im=Image.fromarray(a,'RGBA');s.d=ImageDraw.Draw(s.im)
    def fill(s,poly,col,clip=None):
        m=Image.new('L',s.im.size,0);ImageDraw.Draw(m).polygon(poly,fill=255)
        if clip is not None:
            c=Image.new('L',s.im.size,0);ImageDraw.Draw(c).polygon(clip,fill=255);m=Image.fromarray(np.minimum(np.array(m),np.array(c)))
        a=np.array(s.im);mm=np.array(m)>0;a[mm,:3]=hexrgb(col);a[mm,3]=255;s.im=Image.fromarray(a,'RGBA');s.d=ImageDraw.Draw(s.im)
    def line(s,pts,col,w,clip=None):
        if clip is None:
            s.d.line(pts,fill=hexrgb(col)+(255,),width=w,joint='curve');return
        layer=Image.new('RGBA',s.im.size,(0,0,0,0));ImageDraw.Draw(layer).line(pts,fill=hexrgb(col)+(255,),width=w,joint='curve')
        c=Image.new('L',s.im.size,0);ImageDraw.Draw(c).polygon(clip,fill=255)
        la=np.array(layer);la[np.array(c)==0]=0;s.im=Image.alpha_composite(s.im,Image.fromarray(la,'RGBA'));s.d=ImageDraw.Draw(s.im)
    def save(s,p):s.im.save(p)

def capsule_poly(p0,p1,r,n=24):
    (x0,y0),(x1,y1)=p0,p1;a=math.atan2(y1-y0,x1-x0);pts=[]
    for i in range(n+1):t=a-math.pi/2+math.pi*i/n;pts.append((x1+r*math.cos(t),y1+r*math.sin(t)))
    for i in range(n+1):t=a+math.pi/2+math.pi*i/n;pts.append((x0+r*math.cos(t),y0+r*math.sin(t)))
    return pts

# ---------- SVG building blocks (local coordinates) ----------
def svgwrap(inner,vx,vy,vw,vh):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{vw}" height="{vh}" viewBox="{vx} {vy} {vw} {vh}">{inner}</svg>'
def parts_svg(parts,ink,ow):
    """parts: list of dict(t=cap|path|ell, fill=..) -> outlines first, then fills"""
    o='';f=''
    for p in parts:
        t=p['t']
        if t=='cap':
            o+=f'<line x1="{p["x1"]}" y1="{p["y1"]}" x2="{p["x2"]}" y2="{p["y2"]}" stroke="{ink}" stroke-width="{p["w"]+2*ow}" stroke-linecap="round"/>'
            f+=f'<line x1="{p["x1"]}" y1="{p["y1"]}" x2="{p["x2"]}" y2="{p["y2"]}" stroke="{p["fill"]}" stroke-width="{p["w"]}" stroke-linecap="round"/>'
        elif t=='path':
            o+=f'<path d="{p["d"]}" fill="{ink}" stroke="{ink}" stroke-width="{2*ow}" stroke-linejoin="round"/>'
            f+=f'<path d="{p["d"]}" fill="{p["fill"]}"/>'
        elif t=='ell':
            o+=f'<ellipse cx="{p["cx"]}" cy="{p["cy"]}" rx="{p["rx"]}" ry="{p["ry"]}" fill="{ink}" stroke="{ink}" stroke-width="{2*ow}"/>'
            f+=f'<ellipse cx="{p["cx"]}" cy="{p["cy"]}" rx="{p["rx"]}" ry="{p["ry"]}" fill="{p["fill"]}"/>'
    return o+f
def ln(d,ink,w,op=1):return f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>'

# ---------- hands (local: wrist at (0,wy), pointing +y). side=-1 left arm, +1 right arm: thumb direction = side ----------
def hand_parts(kind,wy,skin,sd,glove=False,sc=1.0):
    P=[];k=sc
    def C(x1,y1,x2,y2,w):P.append(dict(t='cap',x1=x1*k,y1=wy+y1*k,x2=x2*k,y2=wy+y2*k,w=w*k,fill=skin))
    def E(cx,cy,rx,ry):P.append(dict(t='ell',cx=cx*k,cy=wy+cy*k,rx=rx*k,ry=ry*k,fill=skin))
    if kind in('fist','hold'):
        E(0,36,38,34);C(sd*30,16,sd*36,40,22)
    elif kind=='open':
        E(0,40,38,32)
        for x,ln_ in((-27,104),(-9,118),(9,118),(27,104)):C(x,52,x*1.1,ln_,18)
        C(sd*30,28,sd*70,76,21)
    elif kind=='thumb':
        E(0,38,38,32);C(sd*16,24,sd*84,6,25)   # thumb sticks along local sd*x (world 'up' when the arm is raised)
        for x in(-14,0,14):pass
    return P
def hand_detail(kind,wy,ink,sd,sc=1.0,glove=False):
    k=sc;o=''
    if kind in('fist','hold','thumb'):
        for x in(-14,0,14):o+=ln(f'M {x*k} {wy+(36+8)*k} L {x*k} {wy+(36+28)*k}',ink,4*k,.9)
    if glove:o+=ln(f'M {-22*k} {wy+46*k} l {12*k} {14*k}',ink,4*k)+ln(f'M {-4*k} {wy+46*k} l {12*k} {14*k}',ink,4*k)
    return o

def arm_svg(kind_ch,hand,side):
    """returns svg for one arm sprite; origin (0,0) = shoulder pivot; arm hangs along +y."""
    cfg=ARM[kind_ch];ink=cfg['ink'];ow=cfg['ow'];sd=-1 if side=='L' else 1
    w=cfg['w'];top=cfg['top'];wy=cfg['wrist']
    hp=hand_parts(hand,wy,cfg['skin'],sd,sc=cfg['hs'])
    hands=parts_svg(hp,ink,ow)+hand_detail(hand,wy,ink,sd,cfg['hs'],cfg.get('glove',False))
    if cfg.get('glove'):
        hp2=[dict(p,fill=cfg['glove']) for p in hp];hands=parts_svg(hp2,ink,ow)+hand_detail(hand,wy,ink,sd,cfg['hs'],True)
    inner=hands
    r=w/2
    if kind_ch=='girl':
        d=f'M {-r} 0 A {r} {r} 0 0 1 {r} 0 L {r} {wy} Q 0 {wy+10} {-r} {wy} Z'
        cuff=f'M {-r} {wy-36} Q 0 {wy-26} {r} {wy-36} L {r} {wy} Q 0 {wy+10} {-r} {wy} Z'
        inner+=parts_svg([dict(t='path',d=d,fill=cfg['c1'])],ink,ow)+f'<path d="{cuff}" fill="{cfg["c2"]}"/>'+ln(f'M {-r} {wy-36} Q 0 {wy-26} {r} {wy-36}',ink,4)
    elif kind_ch=='dad':
        d=f'M {-r} 0 A {r} {r} 0 0 1 {r} 0 L {r} {wy} Q 0 {wy+8} {-r} {wy} Z'
        inner+=parts_svg([dict(t='path',d=d,fill=cfg['c1'])],ink,ow)
    else:  # mom: teal upper arm + blue forearm
        blue=f'M {-r} 120 L {r} 120 L {r} {wy} Q 0 {wy+10} {-r} {wy} Z'
        teal=f'M {-r} 0 A {r} {r} 0 0 1 {r} 0 L {r} 150 A {r} {r*0.62} 0 0 1 {-r} 150 Z'
        inner+=parts_svg([dict(t='path',d=blue,fill=cfg['c2'])],ink,ow)+parts_svg([dict(t='path',d=teal,fill=cfg['c1'])],ink,ow)
    return svgwrap(inner,-170,-110,340,760)

ARM={
 'girl':dict(ink='#33211a',ow=7,w=74,top=-37,wrist=402,skin='#fcceab',hs=1.0,c1='#fc7aa1',c2='#c8ccd6'),
 'dad':dict(ink='#3d2216',ow=7,w=62,top=-31,wrist=278,skin='#fbbc8d',hs=1.0,c1='#fbbc8d'),
 'mom':dict(ink='#1c110c',ow=7,w=76,top=-38,wrist=330,skin='#fdd0a8',hs=1.15,c1='#37bcb3',c2='#2364b6',glove='#87859f'),
}
PIV={'girl':{'L':(336,700),'R':(544,700)},'dad':{'L':(262,762),'R':(638,762)},'mom':{'L':(455,650),'R':(665,650)}}
