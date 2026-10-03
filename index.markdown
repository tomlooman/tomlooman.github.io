---
layout: custom-home
title: Unreal Engine C++ & Optimization Tutorials
---
<div class="courses-banner">
  <a
    href="{{ '/courses/unrealengine-cpp/' | relative_url }}"
    class="courses-banner__cpp"
    aria-label="C++ course"
    style="background-image: url('{{ '/assets/images/Home_Course_CPP_Hero.webp' | relative_url }}');"
  ></a>
  <a
    href="{{ '/courses/unrealengine-optimization/' | relative_url }}"
    class="courses-banner__optimization"
    aria-label="Optimization course"
    style="background-image: url('{{ '/assets/images/Home_Course_Optim_Hero.webp' | relative_url }}');"
  ></a>
</div>
<section class="intro-highlight">
    <h2>Unreal Engine 5 Tutorials & Courses for Programmers and (Tech) Artists.</h2>
    <p>
        Learn Unreal Engine 5 through practical tutorials, production case studies, courses, and open-source sample projects. Explore C++, gameplay systems, multiplayer programming, profiling, and CPU/GPU optimization from a former Epic Games engineer.

        Level up your Unreal Engine skills with my Unreal Engine 5 Courses on
        <a href="courses/unrealengine-cpp">Professional Game Development with C++</a> and
        <a href="courses/unrealengine-optimization">Complete Game Optimization (CPU, Memory, & GPU)</a> for Engineers & Tech Artists!
    </p>
</section>

<h2>Featured Posts</h2>
Some popular pages you may be interested in! Looking for a specific post? Try searching in the top-right or [Browse Posts by Category](/categories) instead.
<section class="featured-posts">
  {% assign featured_urls =
    "/unreal-engine-cpp-course-rebuilt/,/unreal-engine-5-8-performance-highlights/,/unreal-engine-sample-game-action-roguelike/" | split: ","
  %}

  {% assign featured_content = site.posts | concat: site.pages %}

  {% for url in featured_urls %}
    {% assign post = featured_content | where: "url", url | first %}

    {% if post %}
      {% include archive-single.html type="post" %}
    {% endif %}
  {% endfor %}
</section>

<div class="wide-content"><div id="email-sign-up"></div></div>
