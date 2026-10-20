---
layout: page
title: Blog
permalink: /blog/
description: Field notes, walkthroughs, and things worth remembering.
---
<div class="post-list">
{% for post in site.posts %}
<article class="post-card"><div class="post-meta">{{ post.date | date: "%d %b %Y" }} · {{ post.categories | join: " / " }}</div><h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2><p>{{ post.description | default: post.excerpt | strip_html | truncate: 180 }}</p><a class="read-more" href="{{ post.url | relative_url }}">Read entry ↗</a></article>
{% endfor %}
{% unless site.posts.size > 0 %}<p>No entries yet. Add a Markdown file to <code>_posts</code> to publish your first post.</p>{% endunless %}
</div>
