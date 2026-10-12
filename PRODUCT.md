# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS (user choice). Single `index.html` plus `styles.css`, no build step. Hosted on GitHub Pages from the `NyleGarcia/garcia.systems` repository root with a `CNAME` for `garcia.systems`.

## Users

Primary: developers, maintainers, and Linux users who arrive from a GitHub repo, a plugin catalogue entry, or a search for one of Nyle's tools, and want to know who built it and what else they make. Secondary (inferred, unconfirmed): recruiters or collaborators checking a name.

## Product Purpose

Personal homepage and portfolio for Nyle Garcia, Manager of Cloud Engineering at The Options Clearing Corporation (OCC) in Chicago, a DevOps and platform engineer by trade who builds open-source Linux tools on the side. The site is the stable public address: a short bio, selected projects, and the links that lead onward (GitHub, email, others). Success: a visitor understands in one viewport who Nyle is and what they build, and can reach a project or contact in one click.

## Positioning

Working Linux desktop and infrastructure tooling, shipped and used: native Linux control for Elgato Wave audio hardware (OpenWave, Rust/GTK4), a family of OpenDeck plugins that put Linux tools on a Stream Deck (GPU Screen Recorder, OpenWave, countdown, Star Citizen timers), a voice assistant for games on Linux (gamehail), and a Crunchyroll extension with AniList sync (Crunchy+). The common thread is reverse-engineering and filling Linux gaps left by vendor-only software.

## Operating Context

Visitors come from GitHub README links, the OpenAction plugin catalogue, and direct domain visits. Content is maintained by hand in the HTML; no CMS, no analytics required.

## Capabilities and Constraints

- Static site, no JavaScript required for content; progressive enhancement only.
- Must work on GitHub Pages as plain files (no server, no build).
- Custom domain `garcia.systems`: DNS currently carries only Google MX records; A/AAAA/CNAME for GitHub Pages must be added by the user after the repo exists.
- Content sections confirmed: short bio, selected projects, links. Resume/CV link explicitly not included.
- Title (confirmed from LinkedIn, 2026-10-12): Manager, Cloud Engineering @ OCC | DevOps | Platform Engineering. User framing: Linux/infra engineer who builds tools.
- Links confirmed: GitHub, email, LinkedIn (https://www.linkedin.com/in/nylegarcia). No others supplied.

## Brand Commitments

Name: Nyle Garcia. Domain and site name: garcia.systems. GitHub: @NyleGarcia. LinkedIn: /in/nylegarcia. Location: Chicago, IL. No logo, colors, or type pinned.

User-pinned direction (2026-10-12): space themed; identity reads as gamer plus cloud engineer; automation, Kafka, and Kubernetes must be visibly part of the story, not footnotes. Chosen world (2026-10-12): PC-98 sixteen-color field, a retro space-sim screen; user steer: less anime, more space (no character portrait, space imagery instead).

## Evidence on Hand

Public GitHub repositories with descriptions and READMEs (verified 2026-10-12):
- OpenWave (fork, Rust/GTK4/libadwaita): Elgato Wave XLR / XLR Dock / Wave:3 control for Linux, PipeWire mixing matrix.
- gpu-screen-recorder-opendeck (Python): replay buffer, record, stream, screenshot on Stream Deck keys; 1 star.
- openwave-opendeck (Python): OpenWave mix/mic/source volumes from a Stream Deck; 1 star.
- cztimer-opendeck (JS): Star Citizen contested-zone timers for OpenDeck.
- countdown-opendeck (JS): countdown timer for OpenDeck.
- gamehail (Python): voice assistant for games on Linux, per-game MCP modules, OpenDeck plugin.
- crunchy-plus (TypeScript/Svelte): Crunchyroll MV3 extension, sub/dub modes, AniList sync and import.
- plugins (fork): OpenAction plugin registry contributions.
Career facts supplied by the user from LinkedIn (2026-10-12), usable verbatim or condensed:
- OCC (The Options Clearing Corporation), Chicago, Jun 2023 to present: Manager, Cloud Engineering (Oct 2025 to present); Lead Associate Principal Cloud Engineering (Mar 2025 to Oct 2025); Associate Principal Cloud Engineering (Jun 2023 to Mar 2025). Technical owner and lead for Kafka; multi-region event-driven AWS architecture on Kubernetes; Terraform, Ansible, Jenkins and GitHub CI/CD; OCC cloud migration program "Renaissance"; OCC is a designated SIFMU.
- XSELL Technologies, Chicago (remote), Jun 2021 to Jun 2023: DevOps Engineering Lead (Feb 2022 to Jun 2023), DevOps Engineering (Jun 2021 to Feb 2022). Moved manually deployed EC2 to Kubernetes; KEDA event-based autoscaling; AWS/Azure; Terraform, Ansible; Kafka, RabbitMQ, Snowflake; ELK observability; FinTech and healthcare compliance review boards.
- Wynndalco Enterprises, Mokena IL, Sep 2016 to Jun 2021: IT Technician, System Engineer, DevOps Engineer, then Lead DevOps Engineer and Manager (Mar 2019 to Jun 2021) managing 70 IT technicians; custom scheduling/routing tools; Flask API servers in Docker.
- Freelance DevOps Engineer, Jan 2016 to present: hosting for Twitch streamers (channel bots, RTMP/encoding servers, game servers, backups), real-time services for over 300 unique users.
- LinkedIn summary skills: AWS, CI/CD, Linux/Unix administration, Python, Shell, Batch, Jenkins, GitHub Actions, Harness.io.
Absent: no photo, no testimonials, no star counts worth citing, no resume PDF. Do not fabricate downloads, users, or metrics beyond those listed.

## Product Principles

- Lead with the work; the person is explained by the tools.
- Every project line links to its real repository and states what it does in one sentence of plain words.
- Stay honest about scale: small open-source tools, no inflated metrics.
- Zero maintenance burden: one HTML file a human can edit in a text editor.
- Fast and accessible by default: semantic HTML, system-friendly, readable without JavaScript.
