#!/bin/bash

# Requires rsvg-convert
# sudo apt install librsvg2-bin

rsvg-convert --width=440 --height=280 --keep-aspect-ratio promo.svg > promo.png