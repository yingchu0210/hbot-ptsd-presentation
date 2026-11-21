from gen import *

def face_svg(ch,expr,W,H):
    F=FACE[ch];ink=F['ink'];cx,dx,ey=F['cx'],F['dx'],F['ey'];s=''
    by=F['by'];bw=F['bw'];bcol=F['bcol'];bwid=F['bwid']
    # ---- brows
    for sd in(-1,1):
        x=cx+sd*dx
        if expr=='sad':d=f'M {x+sd*bw*.5} {by+10} Q {x} {by-6} {x-sd*bw*.5} {by-24}'
        elif expr=='wow':d=f'M {x-bw*.5} {by-30} Q {x} {by-50} {x+bw*.5} {by-30}'
        elif expr=='laugh':d=f'M {x-bw*.5} {by-12} Q {x} {by-30} {x+bw*.5} {by-12}'
        elif expr=='shy':d=f'M {x-bw*.5} {by+2} Q {x} {by-12} {x+bw*.5} {by+4}'
        else:d=f'M {x-bw*.5} {by} Q {x} {by-18} {x+bw*.5} {by+2}'
        if not F.get('nobrow'):s+=ln(d,bcol,bwid)
    # ---- eyes
    closed=expr in('happy','laugh') or (F['eye']=='arc' and expr in('smile','shy'))
    for sd in(-1,1):
        x=cx+sd*dx
        if closed:
            r=F['ar']
            s+=ln(f'M {x-r} {ey+8} Q {x} {ey-r*1.05} {x+r} {ey+8}',ink,F['aw'])
        elif expr=='wow' or F['eye']=='round' or expr=='sad':
            rx,ry=F['rx'],F['ry']
            if expr=='wow':rx,ry=rx*1.12,ry*1.12
            if expr=='sad':rx,ry=rx*.9,ry*.9
            if F['eye']=='lens' and expr=='sad':
                s+=f'<ellipse cx="{x}" cy="{ey+2}" rx="{rx*.55}" ry="{ry*.55}" fill="#2a1a12"/><circle cx="{x+4}" cy="{ey-2}" r="4" fill="#fff"/>'
            else:
                s+=f'<ellipse cx="{x}" cy="{ey}" rx="{rx}" ry="{ry}" fill="#fff" stroke="{ink}" stroke-width="{F["ew"]}"/>'
                s+=f'<ellipse cx="{x+sd*-2}" cy="{ey+3}" rx="{rx*.6}" ry="{ry*.66}" fill="#1b110d"/><circle cx="{x+sd*-2+rx*.18}" cy="{ey-ry*.2}" r="{rx*.2}" fill="#fff"/><circle cx="{x+sd*-2-rx*.2}" cy="{ey+ry*.28}" r="{rx*.09}" fill="#fff" opacity=".85"/>'
        else: # lens (dad smile / shy)
            r=F['lr']
            s+=f'<path d="M {x-r} {ey+6} Q {x} {ey-r*.62} {x+r} {ey+6} Q {x} {ey+r*.34} {x-r} {ey+6} Z" fill="#33201a" stroke="{ink}" stroke-width="5" stroke-linejoin="round"/>'
            s+=f'<circle cx="{x+sd*-6}" cy="{ey+3}" r="3.4" fill="#fff" opacity=".9"/>'
        if F.get('crow') and expr not in('wow','sad'):
            for k,(a,b) in enumerate(((-14,-9),(-2,0),(10,9))):
                s+=ln(f'M {x+sd*(F["ar"]+6)} {ey+a} l {sd*17} {b}',ink,4,.9)
    # ---- mouth
    mx,my,m=F['mx'],F['my'],F['ms']
    red='#d9525b';dk='#8c2c33'
    def teeth_smile(w,h):
        return (f'<path d="M {mx-w} {my} Q {mx} {my+h*.18} {mx+w} {my} Q {mx+w*.92} {my+h} {mx} {my+h*1.06} Q {mx-w*.92} {my+h} {mx-w} {my} Z" fill="{red}" stroke="{ink}" stroke-width="{F["mw"]}" stroke-linejoin="round"/>'
                f'<path d="M {mx-w*.86} {my+h*.1} Q {mx} {my+h*.26} {mx+w*.86} {my+h*.1} L {mx+w*.8} {my+h*.38} Q {mx} {my+h*.5} {mx-w*.8} {my+h*.38} Z" fill="#fff"/>')
    if F['mouth']=='crescent' and expr in('smile','happy'):
        w=52*m*(1.1 if expr=='happy' else 1)
        s+=f'<path d="M {mx-w} {my} Q {mx} {my+10} {mx+w} {my-4} Q {mx+w*.55} {my+34*m} {mx} {my+36*m} Q {mx-w*.55} {my+34*m} {mx-w} {my} Z" fill="#fff" stroke="{ink}" stroke-width="{F["mw"]}" stroke-linejoin="round"/>'
    elif expr in('smile','happy'):
        s+=teeth_smile(34*m*(1.15 if expr=='happy' else 1),40*m*(1.2 if expr=='happy' else 1))
    elif expr=='laugh':
        w=46*m;h=70*m
        s+=f'<path d="M {mx-w} {my-2} Q {mx} {my+14} {mx+w} {my-2} Q {mx+w*.95} {my+h} {mx} {my+h+6} Q {mx-w*.95} {my+h} {mx-w} {my-2} Z" fill="{dk}" stroke="{ink}" stroke-width="{F["mw"]}" stroke-linejoin="round"/>'
        s+=f'<path d="M {mx-w*.86} {my} Q {mx} {my+16} {mx+w*.86} {my} L {mx+w*.8} {my+h*.22} Q {mx} {my+h*.34} {mx-w*.8} {my+h*.22} Z" fill="#fff"/><ellipse cx="{mx}" cy="{my+h*.82}" rx="{w*.5}" ry="{h*.16}" fill="#ee8c96"/>'
    elif expr=='shy':
        s+=ln(f'M {mx-22*m} {my+4} Q {mx} {my+22*m} {mx+22*m} {my+4}',ink,F['mw']+1)+ln(f'M {mx+26*m} {my+2} l 6 -8',ink,F['mw']-1)
    elif expr=='sad':
        s+=ln(f'M {mx-26*m} {my+26*m} Q {mx} {my-2} {mx+26*m} {my+26*m}',ink,F['mw']+1)
    elif expr=='wow':
        s+=f'<ellipse cx="{mx}" cy="{my+14*m}" rx="{17*m}" ry="{24*m}" fill="{dk}" stroke="{ink}" stroke-width="{F["mw"]}"/><ellipse cx="{mx}" cy="{my+26*m}" rx="{10*m}" ry="{8*m}" fill="#ee8c96"/>'
    if expr=='shy':
        for sd in(-1,1):s+=f'<ellipse cx="{cx+sd*(dx+F["bl"])}" cy="{ey+F["bly"]}" rx="{F["blr"]}" ry="{F["blr"]*.62}" fill="#fb7f86" opacity=".55"/>'
    return svgwrap(s,0,0,W,H)

FACE={
 'girl':dict(nobrow=True,ink='#33211a',cx=432,dx=64,ey=382,by=303,bw=66,bcol='#33211a',bwid=5,eye='round',rx=27,ry=31,ew=6,ar=26,aw=8,lr=34,mx=438,my=495,ms=1.15,mw=6,mouth='smile',bl=40,bly=70,blr=30),
 'dad':dict(ink='#3d2216',cx=460,dx=75,ey=335,by=283,bw=84,bcol='#8c837e',bwid=15,eye='lens',rx=22,ry=24,ew=6,ar=32,aw=9,lr=37,mx=460,my=447,ms=1.0,mw=6,mouth='crescent',crow=True,bl=40,bly=67,blr=28),
 'mom':dict(ink='#1c110c',cx=560,dx=80,ey=382,by=326,bw=76,bcol='#a39b96',bwid=11,eye='arc',rx=24,ry=28,ew=6,ar=40,aw=10,lr=40,mx=558,my=444,ms=1.2,mw=6,mouth='smile',bl=32,bly=52,blr=32),
}
if __name__=='__main__':
    import subprocess
    for ch,(W,H) in {'girl':(1116,1410),'dad':(1056,1490),'mom':(1103,1426)}.items():
        for e in EXPR:open(f'{OUT}{ch}_face_{e}.svg','w').write(face_svg(ch,e,W,H))
        for side in('L','R'):
            for hnd in('fist','open','thumb'):open(f'{OUT}{ch}_arm{side}_{hnd}.svg','w').write(arm_svg(ch,hnd,side))
    print('faces+arms written',len(os.listdir(OUT)))
