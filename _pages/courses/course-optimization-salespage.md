---
layout: salespage
title: "Complete Game Optimization for Unreal Engine 5"
permalink: /courses/unrealengine-optimization/
coverImage: "Thumb_Course_Optim_Hero_5.jpg"
excerpt: "Learn how to profile, diagnose, and optimize Unreal Engine games across CPU, GPU, and memory."
header:
  og_image: "/assets/images/Thumb_Course_Optim_Hero_5.jpg"
  overlay_image: "/assets/images/Course_HeroBanner_Optim.jpg"
  actions:
    - label: "See Pricing"
      url: "/courses/unrealengine-optimization/#pricing-options"
    - label: "View Curriculum"
      url: "/courses/unrealengine-optimization/#curriculum-overview"
  overlay_filter: 0.3
tagline: "Learn how to find performance bottlenecks, understand what causes them, and optimize Unreal Engine games with confidence."
redirect_from:
  - /unreal-engine-course-optimization/
  - /performance-optimization/
---

{% assign summary = "
[100+ Lessons and Resources](/courses/unrealengine-optimization/#curriculum-overview)|
CPU, GPU and Memory Optimization|
Real Production Case Studies|
Gameplay and Graphics Learning Tracks|
Lifetime Access|
Instructor Support|
Completion Certificate |
Subtitled in 5 languages"
| split:"|" %}

{% include course-summary.html
  title="Course at a Glance"
  items=summary %}

Game performance is one of the hardest parts of Unreal Engine development to learn. Public information is often fragmented, surface-level, or written for older versions of the engine. Even when you find the right profiling tool, understanding what the results mean and deciding what to optimize next can still be difficult.

This course gives you a structured approach to **profiling, diagnosing, and optimizing Unreal Engine games across CPU, GPU, and memory**. You will learn fundamentally how Unreal renders a frame, how systems interact and are affected by content and tuning and to understand what is causing your bottlenecks and how to optimize once the problems have been identified.

> **Profile first. Find the real bottleneck. Make changes you can measure.**

Optimization is always specific to your project, but the process should never rely on guesswork. The course teaches repeatable workflows, practical tools, and common performance issues seen in many of Unreal's built-in systems, so you can make informed decisions throughout development, not only when performance becomes a crisis near launch.

<div class="wide-content" id="studio-logos" data-course-id="1"></div>

## What makes this course different?

### Learn the optimization process

Start by setting meaningful performance targets, preparing reliable builds, reducing profiling noise, and identifying your bottleneck.

### Understand the engine behind the profiler

Profiling tools only become useful when you understand what Unreal Engine is doing. The course connects profiler data to engine architecture, CPU threading, rendering, memory, content, and gameplay systems so you can understand the cost you are seeing.

### Study real production problems

See profiling and optimization applied to real games. The case studies show the investigation process, trade-offs, and practical optimizations that are difficult to capture in isolated examples.

## Built for AAA and Indie Developers Alike

The course covers a wide range of performance subjects for developers working at different scales. An indie developer can follow the complete curriculum, while specialists at larger studios can focus on the lessons most relevant to their role.

**The course is especially useful for:**

- Gameplay programmers and technical designers working primarily on CPU performance.
- Graphics programmers, technical artists, and environment artists working primarily on GPU and content performance.
- Generalist developers who need to understand the complete frame.
- Teams preparing a project for new platforms, performance targets, or launch.
- Developers who want to prevent expensive performance problems earlier in production.

No C++ experience is required for most of the course. Programming-focused lessons use C++ where it is relevant, while many sections focus on profiling tools, rendering features, project settings, content, Blueprints, and production workflows.

<div class="wide-content">
  <section
    class="partition_1"
    style="background-image: url('https://www.tomlooman.com/assets/images/banner_full_gray.svg')"
  >
    <h1 class="salesheader" style="text-align: center;"><strong>SUMMER SALE IS NOW!</strong></h1>
    <p style="text-align: center;"><strong>Use coupon code <a href="/courses/unrealengine-optimization/#pricing-options">SUMMERSALE</a> at checkout for $100 discount! Sale ends September 12th!</strong></p>
  </section>
</div>

## What You'll Learn

### Performance fundamentals and reliable profiling

Understand frame time, frame rate, and frame pacing. Learn how to prepare a suitable build, reduce profiling noise, and identify whether your current bottleneck is on the CPU or GPU.

### Unreal Engine profiling tools

Use Unreal Insights, ProfileGPU, optimization view modes, render-buffer visualization, Size Map, Reference Viewer, Statistics panels, MemReport, and more built-in profiling tools. Learn what each tool is good at and when to use it.

{% capture insights %}
Unreal Insights is one of the central profiling tools for Unreal Engine.

We deep dive Insights throughout the course to understand CPU, GPU, rendering, and memory performance. You will learn how to capture useful traces, inspect frame and per-call costs, add your own trace events and counters, and connect profiler data back to engine source code or rendering features.
{% endcapture %}

{% include feature-block.html
  title="Master Unreal Insights"
  image="/assets/images/unrealinsightsoverview.jpg"
  alt="Unreal Insights profiling in Unreal Engine 5"
  content=insights
%}

### Gameplay, CPU, and memory optimization

Explore Unreal Engine's threading architecture and optimize gameplay systems including ticks, timers, collision, physics queries, Blueprint code, garbage collection, object lifetime, Actor pooling, Significance Manager, component updates, and multithreading.

### GPU, rendering, and content optimization

Investigate expensive rendering features and content using practical profiling workflows. Topics include Nanite, Virtual Shadow Maps, lighting, Niagara, materials, Lumen, PSO caching, Variable Rate Shading, skeletal animation, scene setup, and draw distances.

### Platform scalability

Build scalability into the project instead of treating it as a final pass. Learn how to manage settings for different hardware, use detail modes, evaluate automatic scalability, and make deliberate visual and performance tradeoffs.

## Real Production Profiling and Optimization

{% capture casestudies %}
The course includes extensive case studies from production games and Epic sample projects. These are complete investigations rather than lists of generic tips. You will see how profiling evidence leads to the next question, how several costs can interact, and how to judge whether a proposed fix is worth its tradeoffs.
{% endcapture %}

{% include feature-block.html
  title="Production Case Studies"
  image="/assets/images/course_optim_casestudies.jpg"
  alt="Real game production optimization case studies"
  content=casestudies
%}

Current case studies include:

- **Far Far West**, including a one-hour GPU profiling and optimization session.
- **The Forever Winter**, with production examples across gameplay, collision, scene setup, and rendering.
- Sample Projects: **Dark Ruins** (Environment Art Showcase), **Lyra Starter Game** (C++ FPS Combat), **Project Orion** (Showcasing game code optimizations in a substantial C++ Sample Game)

## Learning Tracks for Engineers and Technical Artists

Watch the entire course at your own pace or follow the track most relevant to your role:

All lessons are divided into **Gameplay** and **Graphics** learning tracks to make it easier to find lessons most valuable to your specialization. This way you can optimize your learning experience.

## Continuously Updated for Unreal Engine 5 {#curriculum-overview}

The course is available in **Early Access** and already contains a substantial curriculum. New lessons and production case studies continue to be added, with new material recorded using current Unreal Engine releases. You can browse the Curriculum below to see what is currently available and what is still up coming.

{% include course-curriculum.html curriculum=site.data.course_curriculum_optimization %}

## Your Instructor: Tom Looman

{% include bio.html %}

<a name="pricing-options"></a>

<div class="wide-content">
  <section
    class="partition_1"
    style="background-image: url('https://www.tomlooman.com/assets/images/banner_full_gray.svg')"
  >
    <h1 class="salesheader" style="text-align: center;"><strong>SUMMER SALE IS NOW!</strong></h1>
    <p style="text-align: center;"><strong>Use coupon code <a href="/courses/unrealengine-optimization/#pricing-options">SUMMERSALE</a> at checkout for $100 discount! Sale ends September 12th!</strong></p>
  </section>
</div>

{: .text-center}

## Get Started Today

{: .text-center}

Prices include VAT/Sales tax where applicable.

<div id="pricing" data-course-id="2"></div>

<br />

{: .text-center}

## Training for Studios

{: .text-center}

Discounted partner pricing is available for multiple licenses, with flexible enrollment and invoice payment for studios. See the [Studio Pricing and Partner Tiers](/courses/studio-pricing/) or contact [info@tomlooman.com](mailto:info@tomlooman.com) to discuss your needs.

{: .text-center}

**Need a single license for someone on your team?** During checkout, choose the option to purchase the course for someone else.

{: .text-center}

![](/assets/images/courses/moneyback_logo_small.png)

<br />

<div id="faq" data-course-id="2"></div>

## Questions?

Feel free to use the contact form below or email me directly at [info@tomlooman.com](mailto:info@tomlooman.com).

{% include contact-form.html %}
