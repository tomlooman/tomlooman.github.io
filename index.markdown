---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: custom-home
title: Unreal Engine C++ Tutorials
---
<div id="courses-banner"></div>
<section class="intro-highlight">
    <h2>Unreal Engine 5 Courses for Programmers and Tech Artists.</h2>
    <p>
        Level-up your Unreal Engine skills with my Unreal Engine 5 Courses on
        <a href="courses/unrealengine-cpp">Professional Game Development with C++</a> and
        <a href="courses/unrealengine-optimization">Complete Game Optimization (CPU, Memory, & GPU)</a> for Engineers & Tech Artists!
    </p>
</section>

<div class="wide-content"><div id="email-sign-up"></div></div>

<h2>Featured Posts</h2>
Some popular pages you may be interested in! Looking for a specific post? Try searching in the top-right or [Browse Posts by Category](/categories) instead.
<section class="featured-posts">
  {% assign featured_urls = 
    "/unreal-engine-cpp-guide/,/unreal-engine-5-8-performance-highlights/,/unreal-engine-cpp-course-early-access/" | split: "," %}

  {% for url in featured_urls %}
    {% assign post = site.posts | where: "url", url | first %}
    {% if post %}
      {% include archive-single.html type="post" %}
    {% endif %}
  {% endfor %}
</section>