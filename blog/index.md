---
layout: archive
title: "Blog"
permalink: /blog/
author_profile: false
entries_layout: list
search: false
---

{% assign posts = site.posts | sort: "date" | reverse %}
{% for post in posts %}
  {% include archive-single.html type="post" %}
{% endfor %}