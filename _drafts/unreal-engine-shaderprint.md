---
title: "ShaderPrint for GPU Debugging/Optimization - Nanite, Lumen, VSM"
date: 2026-05-27
last_modified_at: 2026-05-27
categories:
  - "Performance & Optimization"
tags:
  - "Rendering"
  - "Performance"
  - "Nanite"
  - "Lumen"
  - "VSM"
coverImage: "Blog_MainHeroThumbnail_Logo.jpg"
---

## What is ShaderPrint?

ShaderPrint in Unreal Engine 5 is a debugging and optimization tool to retrieve stats and pixels from the GPU.

## ShaderPrint for Nanite

`nanitestats`

...

## ShaderPrint for Lumen

...

## ShaderPrint for Virtual Shadow Maps

...


## ShaderPrint Zoom

You can zoom into a section of the screen (cursor location) by enabling `r.ShaderPrint.Zoom 1`. ShaderSprint itself must be enable with `r.ShaderPrint 1`.

![shaderprint zoom console commands](/assets/images/shaderprint_zoomjpg.jpg)

Relevant console commands:

- `r.ShaderPrint.Zoom.Corner` - Change the debug view location
- `r.ShaderPrint.Zoom.Pixel` - Number of pixels to be zoomed
- `r.ShaderPrint.Zoom.Factor` - Zoom Magnification