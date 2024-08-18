#!/bin/bash

# Requires rsvg-convert
# sudo apt install librsvg2-bin

for size in 16 32 48 128
do
    echo "Building ${size}x${size}"
    rsvg-convert --width=$size --height=$size --keep-aspect-ratio icon.svg > icon$size.png
done

echo "Finished."