---
layout: archive
search: false
---
{% for nugget in site.nuggets %}
  <h2>
    <a href="{{ nugget.url }}">
      {{ nugget.title }} - {{ nugget.category }}
    </a>
  </h2>
  <p>{{ nugget.content | markdownify }}</p>
{% endfor %}