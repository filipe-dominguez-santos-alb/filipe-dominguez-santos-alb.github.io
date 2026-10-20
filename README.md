# GHOSTBYTE — GitHub Pages starter

A dark, terminal-inspired personal website for cybersecurity notes, ethical hacking labs, projects, and a Markdown-powered blog. Built with Jekyll for GitHub Pages.

## Publish on GitHub Pages

1. Create a repository named `YOUR-USERNAME.github.io` for a user site, or use any repository for a project site.
2. Upload the contents of this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. For a project site, set `baseurl: "/YOUR-REPOSITORY"` in `_config.yml`. For a user site, leave `baseurl: ""`.
7. Wait for deployment. Your URL will appear in Settings → Pages.

## Add a blog post

Create a Markdown file in `_posts` using `YYYY-MM-DD-short-title.md`, then add front matter:

```yaml
---
layout: post
title: "Your post title"
date: 2026-10-21 10:00:00 +0100
categories: [security, lab-notes]
description: "One sentence for post previews."
---
```

Write the post in Markdown underneath. Commit and push; GitHub Pages publishes it automatically. Posts appear on the home page and `/blog/`.

## Add a project

Edit `projects.md` and duplicate a `project-card` block. Update the title, description, and tags.

## Personalize

- Change `title` and `description` in `_config.yml`.
- Edit `about.md` and `projects.md`.
- Replace or delete the sample post in `_posts`.
- Change colors and layout in `assets/css/style.css`.
- Update the GitHub link in `_layouts/default.html` to your profile.

## Preview locally (optional)

Requires Ruby and Bundler:

```bash
bundle install
bundle exec jekyll serve
```

Then open the local address Jekyll prints, usually `http://127.0.0.1:4000`.

Keep credentials and sensitive target details out of public posts. Only test systems you own or have explicit permission to assess.
