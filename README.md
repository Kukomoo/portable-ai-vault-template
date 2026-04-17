# Portable AI Vault

Portable AI Vault is a simple way to keep the important things you repeat to AI in files you own.

It gives you a clean folder structure and a calm, Notion-like interface (in progress) for storing your reusable context, preferences, company details, and project notes as Markdown (`.md`) files. Those files live in your own private GitHub account and can be reused across AI tools and other note apps later.

---

## Why this project exists

Today, a lot of useful information lives only inside AI chats:

- how you like things explained  
- details about your company, products, or offers  
- decisions you make with AI’s help  
- prompts and instructions that worked well last time  

Each time you start a new chat, you re‑explain the same context. That wastes time and makes results less consistent.

**Portable AI Vault is my attempt to fix that with something small and practical:**

- Save important context once, in simple files.
- Organize those files in a way that makes sense to founders and small teams.
- Reuse them across any AI tool that accepts text or Markdown.
- Keep everything in a place you own (your GitHub account).

---

## Who this is for

- **General users** who are tired of repeating the same personal context to AI.  
- **Early-stage founders** who keep re‑explaining their company, ICP, and offers to different AI tools.  
- **Lean small teams** who want a shared “AI memory” that is portable and not locked into one app.

The template is deliberately simple so non‑technical users can follow it, but the underlying structure is strong enough to be useful for more technical workflows.

---

## What’s in this repo

This repository is a **template vault**. You copy it (or use it as a GitHub template repo) to create your own private AI memory space.

### Key folders

```text
memory/
  00-home/
  01-identity/
  02-projects/
  03-policies/
  04-prompts/
  05-knowledge/
  06-archive/

exports/
  bundles/
  backups/

docs/
```

- `memory/` — where your actual AI memory lives, organized by topic.  
- `exports/` — where you can put bundles or backups you want to share or download.  
- `docs/` — extra documentation about how to use and adapt the system.

---

## Core docs

These files explain how the system works in plain language:

- `START_HERE.md` – what to do first.  
- `WHY_MARKDOWN.md` – what a `.md` file is and why it’s used here.  
- `HOW_TO_SAVE_FROM_AI.md` – how to turn chats into reusable memory.  
- `HOW_TO_USE_WITH_OTHER_TOOLS.md` – how to use this with Notion, Obsidian, ClickUp, and AI tools.

---

## Why GitHub (in simple terms)

GitHub is a private home for your files.

- You keep everything under your own account.  
- You can choose whether a repo is public or private.  
- You can invite collaborators if you ever want to share the system with a co‑founder or a team.  
- You can clone, download, or move the files whenever you want.

GitHub also makes it easy to turn this repository into a **template** so that creating a new vault is as simple as clicking “Use this template” and naming your new space.

Recruiter note: this project also demonstrates practical use of GitHub’s template repository features and is designed to be driven by a GitHub App–backed, Notion‑style frontend.

---

## Why Markdown (`.md` files)

Markdown is a simple document format used widely on GitHub, in note‑taking tools, and in developer documentation.

In human terms:

- It’s like a lighter, simpler version of a Word doc or Google Doc.  
- It uses plain text with a few symbols for headings, lists, and links.  
- It is easy to read even without special software.

For this project, Markdown is ideal because:

- It’s easy to copy into or out of AI tools.
- It’s easy to organize into folders.
- It’s easy to move between tools later.
- Many note tools already support it directly.

---

## How this works with AI tools

The basic workflow is:

1. You store reusable context in Markdown files.  
2. When you want to use that context, you select one or more files.  
3. You either:
   - copy the text into your AI chat as context (“Copy for AI”), or  
   - upload the files if the tool supports file uploads.

The planned interface makes this “Copy for AI” pattern a first‑class action so you don’t have to dig through folders each time.

---

## How this works with Notion, Obsidian, ClickUp

Because everything is stored as Markdown:

- **Obsidian** – works directly with Markdown notes. You can bring these files straight into an Obsidian vault.  
- **Notion** – can import Markdown files and even whole folders or ZIPs.  
- **ClickUp Docs** – supports importing Markdown into docs.  

If you stop using the frontend for this project, your AI memory remains useful in these tools.

---

## Interface concept (Notion-like)

Below are simple wireframe‑style SVGs showing the planned interface. The goal is to keep it as calm and intuitive as Notion, with almost no technical jargon.

### Home – your AI memories

Each “AI Memory” is a space backed by its own repo, but the user just sees a name, icon, and a card.

![Alt](https://github.com/Kukomoo/portable-ai-vault-template/blob/main/Media-storage/home-screen.png)

### Create a new AI memory

Creating a new memory space is a simple modal: name, icon, template.

![Alt](https://github.com/Kukomoo/portable-ai-vault-template/blob/main/Media-storage/ai-memory.png)

---

### Save from a conversation

The “save from chat” flow helps users move from AI discussion → reusable memory file.

![Alt](https://github.com/Kukomoo/portable-ai-vault-template/blob/main/Media-storage/save-convo.png)

---

## How I plan to use this

- As my own personal AI memory vault.  
- As a starter system for founders and small teams I work with.  
- As the backend for a Notion-like web interface that lets non‑technical users create new AI memories, paste from chats, and export bundles without touching GitHub directly.

---

## Launch plan

- Price: $5 (with the first 5 users who email me getting it free).  
- Distribution: Gumroad + GitHub template + hosted demo.  
- Supported use cases at launch:
  - Personal AI memory  
  - Founder/company OS  
  - Lean team shared memory  

---

If you’re a recruiter reading this: this project is a concrete example of how I think about AI products for real users. It focuses on clear UX, realistic technical constraints, and making ownership/portability a first‑class feature rather than an afterthought.
