from gen import *
import gen

def med(cv,box):
    a=np.array(cv.im);x0,y0,x1,y1=box;sub=a[y0:y1,x0:x1].reshape(-1,4);sub=sub[sub[:,3]>200]
    c=np.median(sub[:,:3],axis=0).astype(int);return '#%02x%02x%02x'%tuple(c)

def split_head(cv,Yh,W,H):
    head=Canvas.__new__(Canvas);head.im=cv.im.copy();head.W,head.H=cv.W,cv.H;head.d=ImageDraw.Draw(head.im)
    head.erase([(0,Yh),(W,Yh),(W,H),(0,H)]);cv.erase([(0,0),(W,0),(W,Yh),(0,Yh)]);return head

def clean_small(cv,frac=.12):
    a=np.array(cv.im);al=(a[...,3]>0).astype(np.uint8);n,lab,st,_=cv2.connectedComponentsWithStats(al,connectivity=8)
    big=st[1:,cv2.CC_STAT_AREA].max()
    for i in range(1,n):
        if st[i,cv2.CC_STAT_AREA]<big*frac:a[lab==i]=0
    cv.im=Image.fromarray(a,'RGBA');cv.d=ImageDraw.Draw(cv.im)

def erase_dark_box(cv,box,skin,thr=140):
    """paint skin colour over dark/feature pixels inside box (keeps skin edge)"""
    a=np.array(cv.im);x0,y0,x1,y1=box;sub=a[y0:y1,x0:x1]
    sub[...,:3]=hexrgb(skin);sub[...,3]=255;cv.im=Image.fromarray(a,'RGBA');cv.d=ImageDraw.Draw(cv.im)

def ell_box(cx,cy,rx,ry):
    return [(cx+rx*math.cos(t/20*math.pi),cy+ry*math.sin(t/20*math.pi)) for t in range(41)]

def girl():
    W,H=1116,1410;INK='#33211a'
    cv=Canvas(VEC+'girl_q2.png')
    # ---- scarf layer (front) from original raster
    a=np.array(cv.im).astype(int);r,g,b=a[...,0],a[...,1],a[...,2]
    orange=(r>200)&(g>60)&(g<175)&(b<100)
    yy,xx=np.mgrid[0:H,0:W];box=(xx>305)&(xx<585)&(yy>583)&(yy<975)
    orange&=box
    dil=cv2.dilate(orange.astype(np.uint8),np.ones((15,15),np.uint8))>0
    dark=(a[...,:3].sum(2)<300)&(a[...,3]>200)
    scarf=orange|(dil&dark&box)
    sc=np.array(cv.im);sc[~scarf]=0;Image.fromarray(sc,'RGBA').save(OUT+'girl_scarf_q.png')
    # ---- head
    head=split_head(cv,590,W,H);skin=med(head,(420,415,450,435))
    for poly in (ell_box(368,383,40,44),ell_box(497,380,40,44),ell_box(440,512,40,46)):head.fill(poly,skin)
    # girl: keep the original thin brows (erasing them smudges the bangs)
    head.save(OUT+'girl_head_q.png')
    # ---- body: erase arms, repair
    JP='#fc7aa1';NAVY='#29292f';PANTS='#403e50';GL='#8a3a50'
    capL=[(284,645),(388,645),(388,1112),(284,1112)];handL=[(280,1085),(378,1085),(382,1172),(278,1172)]
    capR=capsule_poly((545,694),(912,896),54);handR=[(884,820),(985,826),(988,965),(884,965)]
    for p in (capL,handL,capR,handR):cv.erase(p)
    # left side: jacket, bag, pants behind arm
    cv.fill([(276,652),(396,652),(396,935),(276,935)],JP)
    cv.fill([(276,935),(396,935),(396,1110),(276,1110)],NAVY)
    cv.line([(276,935),(396,935)],INK,7);cv.line([(276,1108),(396,1108)],INK,7)
    cv.fill([(340,1112),(388,1112),(388,1172),(340,1172)],PANTS);cv.line([(339,1110),(339,1172)],INK,7)
    cv.line([(286,680),(304,662),(326,652)],INK,7)
    for y in (762,842,940):cv.line([(286,y),(386,y)],GL,3,clip=[(286,652),(386,652),(386,935),(286,935)])
    # right side: jacket inside silhouette, outline, grid
    JR=[(520,640),(585,640),(615,666),(634,700),(644,750),(644,848),(520,848)]
    cv.fill(JR,JP,clip=capR)
    cv.line([(585,642),(615,666),(634,700),(644,750),(644,848)],INK,7,clip=capsule_poly((545,694),(912,896),64))
    for y in (772,852):cv.line([(520,y),(644,y)],GL,3,clip=capR)
    # neck extension
    cv.fill([(402,558),(488,558),(488,602),(402,602)],'#fcceab');cv.line([(398,558),(398,600)],INK,6);cv.line([(492,558),(492,600)],INK,6)
    clean_small(cv);cv.save(OUT+'girl_body_q.png')

def dad():
    W,H=1056,1490;INK='#3d2216'
    cv=Canvas(VEC+'dad_q.png');BL='#4e739e'
    head=split_head(cv,575,W,H);skin=med(head,(430,360,500,380))
    for bx in ((343,312,430,352),(490,312,580,352),(308,324,354,358),(576,324,606,358),(326,260,417,306),(498,260,592,306),(402,440,517,487)):erase_dark_box(head,bx,skin)
    head.save(OUT+'dad_head_q.png')
    # arms erase (leave sleeve above y=768 by erasing tube top separately)
    capL=[(214,733),(310,733),(310,1092),(214,1092)];handL=[(194,1020),(304,1020),(306,1132),(194,1132)]
    capR=[(596,722),(896,722),(896,832),(596,832)];handR=[(846,650),(1020,650),(1020,840),(846,840)]
    for p in (capL,handL,capR,handR):cv.erase(p)
    # left: sleeve bottom + torso edge
    cv.fill([(205,740),(300,740),(300,770),(224,770)],BL);cv.line([(205,751),(224,769),(300,771)],INK,7)
    cv.fill([(272,770),(314,770),(314,1004),(272,1004)],BL);cv.line([(274,770),(274,1000),(284,1004),(300,1004)],INK,7)
    # mirror left half onto right half about x=450 (x' = 900-x)
    a=np.array(cv.im);ys=slice(590,1012);L=a[ys,195:451].copy();Rm=L[:,::-1]
    a[ys,450:706]=Rm;cv.im=Image.fromarray(a,'RGBA');cv.d=ImageDraw.Draw(cv.im)
    cv.fill([(398,543),(514,543),(514,578),(398,578)],'#fbbc8d');cv.line([(394,543),(394,590)],INK,7);cv.line([(518,543),(518,590)],INK,7)
    clean_small(cv);cv.save(OUT+'dad_body_q.png')

def mom():
    W,H=1103,1426;INK='#1c110c';TEAL='#37bcb3'
    cv=Canvas(VEC+'mom_q2.png')
    head=split_head(cv,562,W,H);skin=med(head,(540,418,580,432))
    for bx in ((433,352,528,402),(592,352,690,402),(436,304,522,338),(598,304,692,338),(507,436,613,506)):erase_dark_box(head,bx,skin)
    head.save(OUT+'mom_head_q.png')
    capL=capsule_poly((455,652),(226,925),56);gloveL=[(140,870),(290,870),(290,1005),(140,1005)]
    capR=capsule_poly((665,652),(894,925),56);gloveR=[(830,870),(980,870),(980,1005),(830,1005)]
    for p in (capL,gloveL,capR,gloveR):cv.erase(p)
    T=[(385,985),(385,780),(395,700),(440,625),(500,598),(620,598),(680,625),(725,700),(735,780),(735,975)]
    cv.fill(T,TEAL,clip=capL);cv.fill(T,TEAL,clip=capR)
    left=[(385,810),(388,742),(398,702),(420,664),(450,634),(490,607),(512,598)]
    right=[(1120-x,y) for x,y in left]
    cv.line(left,INK,7,clip=capsule_poly((455,652),(226,925),66));cv.line(right,INK,7,clip=capsule_poly((665,652),(894,925),66))
    cv.fill([(512,520),(608,520),(608,566),(512,566)],'#eab98f');cv.line([(508,520),(508,600)],INK,7);cv.line([(612,520),(612,600)],INK,7)
    clean_small(cv);cv.save(OUT+'mom_body_q.png')

if __name__=='__main__':
    girl();dad();mom()
    for ch in ('girl','dad','mom'):
        for part in ('body','head'):trace(f'{OUT}{ch}_{part}_q.png',f'{OUT}{ch}_{part}.svg')
    trace(OUT+'girl_scarf_q.png',OUT+'girl_scarf.svg')
    print({f:os.path.getsize(OUT+f)//1024 for f in sorted(os.listdir(OUT)) if f.endswith('.svg') and 'face' not in f and 'arm' not in f})
