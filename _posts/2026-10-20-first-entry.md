---
layout: post
title: Building a personal security lab
date: 2026-10-20 09:00:00 +0100
categories: [lab-notes, learning]
description: A simple framework for documenting experiments, tools, and lessons learned.
---
A useful lab is more than a collection of tools. It is a repeatable environment where you can test ideas safely and write down what you discover.

## Start with a question

Give each experiment one clear objective. For example:

- What does this service expose on my local network?
- How does a Linux permission change affect a process?
- Can I automate a repetitive task with a small script?

## Keep experiments reproducible

Record the environment, commands, expected outcome, actual result, and what you learned. Remove secrets, tokens, public IPs, and other sensitive details before publishing.

```bash
# Example: collect basic information about your own Linux lab
uname -a
id
ip addr
```

Only run tests against systems you own or have explicit permission to assess.

## The useful part is the write-up

A concise explanation of *why* something happened is usually more valuable than a pasted terminal dump. Capture the question, method, result, and next step — then make it easy for future-you to find.
