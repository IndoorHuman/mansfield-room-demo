# Katherine Mansfield's room

**→ [Walk through what this is](https://indoorhuman.github.io/mansfield-room-demo/)**
· **[Go straight into the room](https://indoorhuman.github.io/mansfield-room-demo/room/)**
· **[What the first day looks like](https://indoorhuman.github.io/mansfield-room-demo/start/)**
· **[Watch the two-minute film](https://indoorhuman.github.io/mansfield-room-demo/film.mp4)**

> ⚠️ **This repo is a demo, not the app you can fork and run yet.** The forkable version is still being built. Mansfield's diary entries and the app's reflections in the demo are real; the explanatory copy is still being rewritten.
>
> **Where to start**
> - **See how the visual room works** → [open the demo room](https://indoorhuman.github.io/mansfield-room-demo/room/)
> - **Understand what the product is** → [read the walkthrough](https://indoorhuman.github.io/mansfield-room-demo/)
> - **See how setup works on day one** → [what the first day looks like, step by step](https://indoorhuman.github.io/mansfield-room-demo/start/)

---

## What this is

The Study Room is an app on your own computer. It reads writing you have already saved and shows some of it back to you, a few pieces at a time.

You cannot see that happen with your own writing on this site. Your files stay on your machine and never leave it. This demo uses someone else's instead: **Katherine Mansfield's diary, 1914–1922.** Two hundred and six days. She died in 1923. Her writing is public domain now.

Pick a date on the calendar and you are in that day. The demo only shows what she had written by then — about fifty pieces in the summer of 1914, nearly four hundred by the end of 1922. You watch the archive grow.

## What it promises, and what it costs

- **Your old writing comes back a few pieces at a time.** That slow pace is the point.
- **It is free, and nothing you import leaves your computer.**
- **The price is hours, not money.** On one real library it took most of an evening before the app was worth opening. How long it takes depends on what you import. Nothing on screen tells you which run you got.
- **Writing works well. Photos work too, and they take much longer.**
- This is **the first room in a larger app**, and it is still being built.

## Three current limits

1. **Import is all-or-nothing.** Close the laptop, lose power, or stop part-way and the whole import is discarded. There is no resume.
2. **Import only works on Mac today.** No support is promised for other platforms.
3. **When the app fails, it may say nothing.** Silence does not always mean "no opinion."

Each limit has a plan. None is fixed yet.

## Why the demo uses Mansfield's diary

The app's main privacy rule is simple: **it will not read a private folder until you say so.** Mark a folder private and it never reaches the part of the app that reads your writing.

Showing that rule needs real private writing. Copyright keeps most diaries locked up for decades. Mansfield is the rare case where her whole life, diary included, is public domain. So the demo can show the privacy rule on something genuinely raw instead of on fake placeholder notes.

**One of her days is still blocked in this demo.** The app cannot see it — not the words, not the date, not that it exists. You can unblock it for your visit, watch that day fill in, and reload to put it back behind the block for the next visitor.

## Two things to expect in the demo

**The app writes as if she were still alive** — "you set that down" — because it always writes to whoever it is reading, and nobody told it she was gone.

**Some days come back with no reflection.** The app will not write about someone it cannot address. Her quietest years produce the thinnest reflections. Those days are marked on the calendar. Her own writing is still there on every one of them.

## This demo is read-only

Everything here was recorded in advance, on one computer, before this page existed. **Nothing runs live while you browse.** There is no API key on this page and nothing here can spend money.

What you save during a visit lasts until you reload. Keep a reflection and it goes on the shelf; reload and the shelf is empty again. The next visitor gets a fresh room.

## Two minutes, if you would rather watch

**[The two-minute film](https://indoorhuman.github.io/mansfield-room-demo/film.mp4)** goes from an empty computer to the Study Room on your machine, with your own writing coming back a few pieces at a time. No voice; captions only. It shows the private-folder rule first, the hours honestly, and which parts were recorded in advance rather than generated while you watch.

Music is Erik Satie's first Gymnopédie, 1888.

## What running it yourself involves

**[The first day, step by step](https://indoorhuman.github.io/mansfield-room-demo/start/)** covers a cold install: what you need, what the app asks before it reads anything, what folder you point it at, the wait, and the room filling up. Screenshots are from a real first run.

⚠️ **You cannot download it yet.** The app's source code is not public. That page exists so nobody has to guess what they would be signing up for.

## How the demo is built

- **One static page and a copy of the app's front end** — the same files that ship, not a rebuild.
- **The server is replaced by a short stand-in script**, because the surface turned out to be small: one read helper and one write helper. Reads come from a snapshot captured off the real server. **Writes live in memory for your visit and disappear on reload** — which is how the read-only rule is enforced, not just promised.
- The calendar is a real object in the room: a 44×40 sprite in the app's palette, on the wall above the desk.
- Nothing is stored in your browser. No cookies, no service worker, no database.

## Source material

Mansfield's diary, letters, poems and short fiction are **public domain worldwide** — she died in 1923, the *Journal* was published in 1927 and the *Letters* in 1929.

The reflections were written by the app in advance, one day at a time, on one machine. They are quoted whole and unedited, including the awkward ones.

## Search engines

This page currently asks search engines and archives to stay away, because the explanatory copy is still a draft. That block comes off in one line, in two files, once the wording is final.
