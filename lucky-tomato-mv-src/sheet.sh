#!/bin/bash
# usage: sheet.sh out.png file1 file2 ... (up to 9)
out=$1;shift
ins="";fc="";n=0;for f in "$@";do ins="$ins -i $f";fc="$fc[$n]scale=640:360[s$n];";n=$((n+1));done
rows="";for r in 0 1 2;do row="";cnt=0;for c in 0 1 2;do i=$((r*3+c));[ $i -lt $n ] && row="$row[s$i]" && cnt=$((cnt+1));done;[ $cnt -gt 0 ] && fc="$fc${row}hstack=inputs=$cnt[r$r];" && rows="$rows[r$r]";done
rc=$(echo $rows | grep -o '\[r' | wc -l)
ffmpeg -loglevel error -y $ins -filter_complex "${fc}${rows}vstack=inputs=$rc" $out
