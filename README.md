# The Study Room, shown on someone else's diary

**This site is a demo.** The room you can open here holds Katherine Mansfield's diary, not yours.

The Study Room is an app that runs on your own computer. It reads writing you have already saved and shows some of it back to you, a few pieces at a time. Setting it up takes an evening and a local AI model, so before you spend that evening, this site lets you see what a day in the room looks like.

Why the demo cannot show your writing: the room is run by an AI. A live copy on a public page would spend money for every visitor, which makes no sense for a free app, so nothing here runs live. And your own writing stays on your machine and never leaves it, so it cannot appear on a website. What the demo uses instead is a whole life that is already public: Mansfield's diary from 1914 to 1922, 206 days, read by the app in advance on one computer. She died in 1923. Her writing is public domain.

## Where to start

- [Open the demo room](https://indoorhuman.github.io/mansfield-room-demo/room/) and press a date on the calendar. You are in that day, and the room holds only what she had written by then.
- [Read the walkthrough](https://indoorhuman.github.io/mansfield-room-demo/) for what the app is and what you would see if you ran it on your own writing.
- [The first day, step by step](https://indoorhuman.github.io/mansfield-room-demo/start/) covers install, setup and first use, with the real screens.
- [Watch the two-minute film](https://indoorhuman.github.io/mansfield-room-demo/film.mp4), from an empty computer to your own writing coming back a few pieces at a time. Captions, no voice.
- [Get the Study Room on GitHub](https://github.com/IndoorHuman/study-room) to run it on your own writing.

## What it promises, and what it costs

- Your old writing comes back a few pieces at a time. The slow pace is the point.
- It is free, and nothing you import leaves your computer.
- The price is hours. On one real library it took most of an evening before the app was worth opening. How long it takes depends on what you import, and nothing on screen tells you which run you got.
- Writing works well. Photos work too, and they take much longer.
- This is the first room in a larger app, and it is still being built.

## Measured figures (checkable)

These numbers come from real first runs on one fast Mac (Apple M5, 16 GB, macOS 26.5.1, Ollama with `qwen2.5:7b`). Every figure here is a best case; a slower machine, or a slower connection, will take longer. And how much writing you have does not tell you how long it will take: one library with fewer pieces of writing took nearly twice as long as a larger one, and changing only a folder's name once moved a run by sixty-four times.

| What | Measured |
| --- | --- |
| Downloads (Ollama + two models, ~5.15 GB on a ~29 MB/s line) | ~3 minutes |
| Bringing in 476 pieces of writing (dragging a folder in) | 0.19 s |
| Bringing in 50 photographs (dragging a folder in) | 0.12 s |
| Sorting 476 pieces of writing (small library, as it comes) | 41 min |
| Sorting 3,447 pieces of writing (middling library, one folder held back) | 3.5 min |
| Sorting 3,447 pieces of writing (same library, the diary folder *not* held back) | ~4.4 h, steady the whole way |
| Sorting 2,665 pieces of writing (a real everyday library, nothing held back) | ~8.2 h |
| Looking at 50 photographs, all on your own machine | 3.5 s |
| Opening the room and reaching your first piece of writing | 27 s and two clicks; the machine's part only, your reading time is on top |

Bringing in an Apple Photos library has no single number, because the room copies whole videos out of it before it works out that it cannot show them. Two real runs on one library took 52 min (4 photographs arrived, 576 videos set aside) and 10 min (no photographs, 19 videos set aside).

A folder of iPhone photographs can be worse: dragging it in can say it worked while bringing in none of them, and then tell you *That folder looks empty*. Bringing in an Obsidian vault says plainly what it cannot read. Dragging a folder in does not.

Every step of this, in order and with what it costs, is on [the first-day walkthrough](https://indoorhuman.github.io/mansfield-room-demo/start/).

## Three current limits

1. Import is all-or-nothing. Close the laptop, lose power, or stop part-way and the whole import is discarded. There is no resume.
2. Import only works on Mac today. No support is promised for other platforms.
3. When the app fails, it may say nothing. Silence does not always mean "no opinion."

Each limit has a plan. None is fixed yet.

## The privacy rule, shown on a real diary

The app will not read a private folder until you say so. Mark a folder private and it never reaches the part of the app that reads your writing.

Showing that rule needs real private writing. Copyright keeps most diaries locked up for decades. Mansfield's whole life, diary included, is public domain, so the demo can show the rule on something raw instead of on fake placeholder notes.

One of her days is still blocked in this demo. The app cannot see it: not the words, not the date, not that it exists. You can unblock it for your visit, watch that day fill in, and reload to put it back behind the block for the next visitor.

## Two things to expect in the demo

The app writes as if she were still alive ("you set that down") because it always writes to whoever it is reading, and nobody told it she was gone.

Some days come back with no reflection. The app will not write about someone it cannot address, and her quietest years produce the thinnest reflections. Those days are marked on the calendar. Her own writing is still there on every one of them.

## This demo is read-only

Everything here was recorded in advance, on one computer, before this page existed. Nothing runs live while you browse. There is no API key on this page and nothing here can spend money.

What you save during a visit lasts until you reload. Keep a reflection and it goes on the shelf; reload and the shelf is empty again. The next visitor gets a fresh room.

## One question, if you have a minute

After you have looked around, [say what you think this is](https://docs.google.com/forms/d/e/1FAIpQLSdCkMN5tPIucmXGkwX706QkIrlUsUu1yrRrtZvzVxmMSqEjGQ/viewform?usp=pp_url&entry.1432361672=project+page). One tap, nothing typed, nothing asked about you.

## What running it yourself involves

[The Study Room on GitHub](https://github.com/IndoorHuman/study-room): download a release or clone it, then follow that README.

[The first day, step by step](https://indoorhuman.github.io/mansfield-room-demo/start/) covers a cold install: what you need, what the app asks before it reads anything, what folder you point it at, the wait, and the room filling up. Screenshots are from a real first run.

## How the demo is built

- One static page and a copy of the app's front end, the same files that ship rather than a rebuild.
- The server is replaced by a short stand-in script, because the surface turned out to be small: one read helper and one write helper. Reads come from a snapshot captured off the real server. Writes live in memory for your visit and disappear on reload, which is what makes the page read-only.
- The calendar is a real object in the room: a 44×40 sprite in the app's palette, on the wall above the desk.
- Nothing is stored in your browser. No cookies, no service worker, no database.

## Source material

Mansfield's diary, letters, poems and short fiction are public domain worldwide. She died in 1923; the *Journal* was published in 1927 and the *Letters* in 1929.

The reflections were written by the app in advance, one day at a time, on one machine. They are quoted whole and unedited, including the awkward ones.

## Search engines

This page asks search engines and archives to stay away while the wording is still being finished. That block comes off in one line, in two files, once it is.
