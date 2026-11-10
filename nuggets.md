---
layout: archive
title: "Nuggets"
permalink: /nuggets/
redirect_from:
  - /nuggets.html
search: false
---

{% assign nuggets = site.nuggets | sort: "date" | reverse %}
{% for post in nuggets %}
  {% include archive-single.html type="post" %}
{% endfor %}