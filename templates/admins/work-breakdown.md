# Builder Season Playbook Work Breakdown

Source of truth: GitHub Project `Builder Season Playbook v1` at https://github.com/users/Newman5/projects/3.

This file is a local snapshot generated from the Project items. Update the GitHub Project first, then regenerate this file so issues, fields, milestones, and dependencies stay aligned.

Total project items: 109

## Board Fields

- Kanban Status: Backlog, Ready, In Progress, Blocked, Review, Done
- Priority Tier: Foundation, Polish, Nice-to-Have
- Effort: Small, Medium, Large
- Artifact Type: Documentation, Template, Script, Workflow, Website Component, Legal Document, Automation, Example
- Target Week: W5 Foundation Package through W12 Release

## Organizer Handbook

Goal: Make the season repeatable for admins.
Problem solved: Operators know what to do each week without improvising.
Deliverables: Responsibilities doc, onboarding workflow, weekly admin workflow, payout workflow, sponsor workflow, dispute and inactive-builder processes, organizer checklist, season timeline.
Project items: 10
Priority mix: Foundation: 10
Effort mix: Medium: 9, Small: 1
Target weeks: W5 Foundation Package

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#2](https://github.com/Newman5/builder-season-playbook/issues/2) | Define organizer responsibilities | Foundation | Medium | Documentation | W5 Foundation Package | Ready | None |
| [#3](https://github.com/Newman5/builder-season-playbook/issues/3) | Write onboarding workflow | Foundation | Medium | Workflow | W5 Foundation Package | Ready | None |
| [#4](https://github.com/Newman5/builder-season-playbook/issues/4) | Write weekly admin workflow | Foundation | Medium | Workflow | W5 Foundation Package | Ready | None |
| [#5](https://github.com/Newman5/builder-season-playbook/issues/5) | Write final presentation workflow | Foundation | Medium | Workflow | W5 Foundation Package | Ready | None |
| [#6](https://github.com/Newman5/builder-season-playbook/issues/6) | Write payout workflow | Foundation | Medium | Workflow | W5 Foundation Package | Ready | None |
| [#7](https://github.com/Newman5/builder-season-playbook/issues/7) | Write sponsor workflow | Foundation | Medium | Workflow | W5 Foundation Package | Ready | None |
| [#8](https://github.com/Newman5/builder-season-playbook/issues/8) | Write dispute resolution process | Foundation | Medium | Documentation | W5 Foundation Package | Ready | None |
| [#9](https://github.com/Newman5/builder-season-playbook/issues/9) | Write inactive builder process | Foundation | Medium | Documentation | W5 Foundation Package | Ready | None |
| [#10](https://github.com/Newman5/builder-season-playbook/issues/10) | Create organizer checklist | Foundation | Small | Template | W5 Foundation Package | Ready | None |
| [#11](https://github.com/Newman5/builder-season-playbook/issues/11) | Create season timeline template | Foundation | Medium | Template | W5 Foundation Package | Ready | None |

## Template Starter Repo

Goal: Provide a clean reusable repo package.
Problem solved: Future seasons can start from a known structure.
Deliverables: Repo structure, config samples, sample data, deployment instructions, GitHub Actions workflow, license, README, screenshots, clean-install test.
Project items: 11
Priority mix: Foundation: 10, Polish: 1
Effort mix: Medium: 7, Small: 3, Large: 1
Target weeks: W5 Foundation Package, W10 Polish, W8 Sellable v1

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#12](https://github.com/Newman5/builder-season-playbook/issues/12) | Create reusable repo structure | Foundation | Medium | Documentation | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#13](https://github.com/Newman5/builder-season-playbook/issues/13) | Create configurable settings.yml | Foundation | Medium | Template | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#14](https://github.com/Newman5/builder-season-playbook/issues/14) | Add sample builders.yml | Foundation | Small | Example | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#15](https://github.com/Newman5/builder-season-playbook/issues/15) | Add sample sponsors.yml | Foundation | Small | Example | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#16](https://github.com/Newman5/builder-season-playbook/issues/16) | Add sample dashboard data | Foundation | Medium | Example | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#17](https://github.com/Newman5/builder-season-playbook/issues/17) | Add deployment instructions | Foundation | Medium | Documentation | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#18](https://github.com/Newman5/builder-season-playbook/issues/18) | Add GitHub Actions workflow | Foundation | Medium | Workflow | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#19](https://github.com/Newman5/builder-season-playbook/issues/19) | Add LICENSE | Foundation | Small | Legal Document | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#20](https://github.com/Newman5/builder-season-playbook/issues/20) | Add README onboarding | Foundation | Medium | Documentation | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#21](https://github.com/Newman5/builder-season-playbook/issues/21) | Add example screenshots | Polish | Medium | Example | W10 Polish | Backlog | #2 (Organizer Handbook) |
| [#22](https://github.com/Newman5/builder-season-playbook/issues/22) | Test clean installation from scratch | Foundation | Large | Workflow | W8 Sellable v1 | Ready | #2 (Organizer Handbook) |

## Dashboard System

Goal: Make builder activity visible.
Problem solved: Admins, sponsors, and builders can see progress without manual tracking.
Deliverables: Profile page, feed, commits component, update aggregation, filters, search, sponsor section, responsive homepage.
Project items: 11
Priority mix: Foundation: 6, Polish: 5
Effort mix: Medium: 10, Large: 1
Target weeks: W6 Usable Playbook, W10 Polish

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#23](https://github.com/Newman5/builder-season-playbook/issues/23) | Build builder profile page | Foundation | Medium | Website Component | W6 Usable Playbook | Ready | #12 (Template Starter Repo) |
| [#24](https://github.com/Newman5/builder-season-playbook/issues/24) | Build activity feed page | Foundation | Medium | Website Component | W6 Usable Playbook | Ready | #12 (Template Starter Repo) |
| [#25](https://github.com/Newman5/builder-season-playbook/issues/25) | Add recent commits component | Foundation | Medium | Automation | W6 Usable Playbook | Ready | #12 (Template Starter Repo) |
| [#26](https://github.com/Newman5/builder-season-playbook/issues/26) | Add RSS aggregation | Polish | Large | Automation | W10 Polish | Backlog | #12 (Template Starter Repo) |
| [#27](https://github.com/Newman5/builder-season-playbook/issues/27) | Add weekly update aggregation | Foundation | Medium | Automation | W6 Usable Playbook | Ready | #12 (Template Starter Repo) |
| [#28](https://github.com/Newman5/builder-season-playbook/issues/28) | Improve mobile responsiveness | Polish | Medium | Website Component | W10 Polish | Backlog | #12 (Template Starter Repo) |
| [#29](https://github.com/Newman5/builder-season-playbook/issues/29) | Add topic and tag filtering | Foundation | Medium | Website Component | W6 Usable Playbook | Ready | #12 (Template Starter Repo) |
| [#30](https://github.com/Newman5/builder-season-playbook/issues/30) | Add builder search | Foundation | Medium | Website Component | W6 Usable Playbook | Ready | #12 (Template Starter Repo) |
| [#31](https://github.com/Newman5/builder-season-playbook/issues/31) | Simplify long homepage scrolling | Polish | Medium | Website Component | W10 Polish | Backlog | #12 (Template Starter Repo) |
| [#32](https://github.com/Newman5/builder-season-playbook/issues/32) | Add native collapsible sections | Polish | Medium | Website Component | W10 Polish | Backlog | #12 (Template Starter Repo) |
| [#33](https://github.com/Newman5/builder-season-playbook/issues/33) | Add sponsor display section | Polish | Medium | Website Component | W10 Polish | Backlog | #12 (Template Starter Repo) |

## Builder Lifecycle

Goal: Define the builder journey from onboarding to final presentation.
Problem solved: Builders know expectations and success criteria.
Deliverables: Onboarding checklist, weekly expectations, feedback expectations, final presentation requirements, proof-of-user requirements, FAQ, example journey.
Project items: 7
Priority mix: Foundation: 7
Effort mix: Medium: 7
Target weeks: W6 Usable Playbook

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#34](https://github.com/Newman5/builder-season-playbook/issues/34) | Create builder onboarding checklist | Foundation | Medium | Template | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |
| [#35](https://github.com/Newman5/builder-season-playbook/issues/35) | Define weekly update expectations | Foundation | Medium | Documentation | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |
| [#36](https://github.com/Newman5/builder-season-playbook/issues/36) | Define feedback expectations | Foundation | Medium | Documentation | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |
| [#37](https://github.com/Newman5/builder-season-playbook/issues/37) | Define final presentation requirements | Foundation | Medium | Documentation | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |
| [#38](https://github.com/Newman5/builder-season-playbook/issues/38) | Define proof-of-user requirements | Foundation | Medium | Documentation | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |
| [#39](https://github.com/Newman5/builder-season-playbook/issues/39) | Write builder FAQ | Foundation | Medium | Documentation | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |
| [#40](https://github.com/Newman5/builder-season-playbook/issues/40) | Document example successful builder journey | Foundation | Medium | Example | W6 Usable Playbook | Ready | #2 (Organizer Handbook) |

## Documentation Site

Goal: Make the product understandable and installable.
Problem solved: Buyers and users can adopt the playbook without direct support.
Deliverables: Tutorials, how-to guides, reference docs, explanation docs, install guide, FAQ, screenshots, architecture diagrams, examples, contribution guide.
Project items: 10
Priority mix: Foundation: 9, Polish: 1
Effort mix: Medium: 10
Target weeks: W8 Sellable v1, W10 Polish

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#41](https://github.com/Newman5/builder-season-playbook/issues/41) | Create tutorials section | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#42](https://github.com/Newman5/builder-season-playbook/issues/42) | Create how-to guides section | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#43](https://github.com/Newman5/builder-season-playbook/issues/43) | Create reference docs section | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#44](https://github.com/Newman5/builder-season-playbook/issues/44) | Create philosophy and explanation section | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#45](https://github.com/Newman5/builder-season-playbook/issues/45) | Write install instructions | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#46](https://github.com/Newman5/builder-season-playbook/issues/46) | Write documentation FAQ | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#47](https://github.com/Newman5/builder-season-playbook/issues/47) | Add documentation screenshots | Polish | Medium | Example | W10 Polish | Backlog | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#48](https://github.com/Newman5/builder-season-playbook/issues/48) | Add architecture diagrams | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#49](https://github.com/Newman5/builder-season-playbook/issues/49) | Document example deployments | Foundation | Medium | Example | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |
| [#50](https://github.com/Newman5/builder-season-playbook/issues/50) | Write contribution guide | Foundation | Medium | Documentation | W8 Sellable v1 | Ready | #12 (Template Starter Repo), #2 (Organizer Handbook) |

## Template Library

Goal: Provide reusable communication and operating templates.
Problem solved: Organizers do not need to recreate repeated season assets.
Deliverables: Weekly update, final presentation, feedback request, README, sponsor outreach, welcome email, countdown post, newsletter, retrospective, evaluation templates.
Project items: 10
Priority mix: Foundation: 7, Polish: 3
Effort mix: Small: 10
Target weeks: W7 Automation + Templates, W10 Polish, W11 Launch Prep

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#51](https://github.com/Newman5/builder-season-playbook/issues/51) | Create weekly update template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#52](https://github.com/Newman5/builder-season-playbook/issues/52) | Create final presentation template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#53](https://github.com/Newman5/builder-season-playbook/issues/53) | Create feedback request template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#54](https://github.com/Newman5/builder-season-playbook/issues/54) | Create README template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#55](https://github.com/Newman5/builder-season-playbook/issues/55) | Create sponsor outreach template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#56](https://github.com/Newman5/builder-season-playbook/issues/56) | Create welcome email template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#57](https://github.com/Newman5/builder-season-playbook/issues/57) | Create countdown post template | Polish | Small | Template | W10 Polish | Backlog | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#58](https://github.com/Newman5/builder-season-playbook/issues/58) | Create newsletter template | Polish | Small | Template | W10 Polish | Backlog | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#59](https://github.com/Newman5/builder-season-playbook/issues/59) | Create retrospective template | Polish | Small | Template | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #34 (Builder Lifecycle) |
| [#60](https://github.com/Newman5/builder-season-playbook/issues/60) | Create judge-free evaluation template | Foundation | Small | Template | W7 Automation + Templates | Ready | #2 (Organizer Handbook), #34 (Builder Lifecycle) |

## Automation Layer

Goal: Reduce manual admin work.
Problem solved: Season reporting and monitoring scale beyond one organizer.
Deliverables: Commit ingestion, social/update ingestion, summaries, newsletter generation, missed-update detection, sponsor metrics, leaderboard, statistics, generated pages, topic detection, daily deploy workflow.
Project items: 11
Priority mix: Foundation: 6, Nice-to-Have: 2, Polish: 3
Effort mix: Large: 2, Medium: 9
Target weeks: W7 Automation + Templates, W12 Release, W10 Polish

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#61](https://github.com/Newman5/builder-season-playbook/issues/61) | Create GitHub commit ingestion | Foundation | Large | Automation | W7 Automation + Templates | Ready | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#62](https://github.com/Newman5/builder-season-playbook/issues/62) | Create X/Twitter update ingestion spec | Nice-to-Have | Medium | Documentation | W12 Release | Backlog | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#63](https://github.com/Newman5/builder-season-playbook/issues/63) | Generate builder activity summaries | Foundation | Medium | Automation | W7 Automation + Templates | Ready | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#64](https://github.com/Newman5/builder-season-playbook/issues/64) | Automate newsletter generation | Polish | Medium | Automation | W10 Polish | Backlog | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#65](https://github.com/Newman5/builder-season-playbook/issues/65) | Add missed-update detection | Foundation | Medium | Automation | W7 Automation + Templates | Ready | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#66](https://github.com/Newman5/builder-season-playbook/issues/66) | Generate sponsor metrics report | Polish | Medium | Automation | W10 Polish | Backlog | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#67](https://github.com/Newman5/builder-season-playbook/issues/67) | Generate weekly leaderboard | Polish | Medium | Automation | W10 Polish | Backlog | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#68](https://github.com/Newman5/builder-season-playbook/issues/68) | Generate builder statistics | Foundation | Medium | Automation | W7 Automation + Templates | Ready | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#69](https://github.com/Newman5/builder-season-playbook/issues/69) | Auto-generate builder pages | Foundation | Large | Automation | W7 Automation + Templates | Ready | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#70](https://github.com/Newman5/builder-season-playbook/issues/70) | Detect repository topics | Nice-to-Have | Medium | Automation | W12 Release | Backlog | #23 (Dashboard System), #12 (Template Starter Repo) |
| [#71](https://github.com/Newman5/builder-season-playbook/issues/71) | Create daily deploy workflow | Foundation | Medium | Workflow | W7 Automation + Templates | Ready | #23 (Dashboard System), #12 (Template Starter Repo) |

## Marketing Website

Goal: Explain and sell the playbook.
Problem solved: Visitors understand who it is for, what it includes, and why to buy or use it.
Deliverables: Homepage copy, positioning, audience definition, pricing, CTAs, testimonials, case study, sponsor section, FAQ, analytics.
Project items: 11
Priority mix: Polish: 9, Nice-to-Have: 2
Effort mix: Medium: 11
Target weeks: W9 Sales + Legal, W12 Release, W10 Polish

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#72](https://github.com/Newman5/builder-season-playbook/issues/72) | Write homepage copy | Polish | Medium | Documentation | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#73](https://github.com/Newman5/builder-season-playbook/issues/73) | Write product positioning | Polish | Medium | Documentation | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#74](https://github.com/Newman5/builder-season-playbook/issues/74) | Define target audience | Polish | Medium | Documentation | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#75](https://github.com/Newman5/builder-season-playbook/issues/75) | Add pricing section | Polish | Medium | Website Component | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#76](https://github.com/Newman5/builder-season-playbook/issues/76) | Add CTA buttons | Polish | Medium | Website Component | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#77](https://github.com/Newman5/builder-season-playbook/issues/77) | Add testimonials section | Nice-to-Have | Medium | Website Component | W12 Release | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#78](https://github.com/Newman5/builder-season-playbook/issues/78) | Add case study section | Polish | Medium | Website Component | W10 Polish | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#79](https://github.com/Newman5/builder-season-playbook/issues/79) | Add sponsor section | Polish | Medium | Website Component | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#80](https://github.com/Newman5/builder-season-playbook/issues/80) | Add marketing FAQ section | Polish | Medium | Website Component | W9 Sales + Legal | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#81](https://github.com/Newman5/builder-season-playbook/issues/81) | Optimize marketing site for mobile | Polish | Medium | Website Component | W10 Polish | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |
| [#82](https://github.com/Newman5/builder-season-playbook/issues/82) | Add analytics integration | Nice-to-Have | Medium | Website Component | W12 Release | Backlog | #41 (Documentation Site), #12 (Template Starter Repo) |

## Sales Funnel

Goal: Make the product purchasable and deliverable.
Problem solved: The playbook can become a sellable product, not just a repo.
Deliverables: Free/paid offer map, Gumroad product, ADA payment research, Stripe path, thank-you/download page, email delivery, launch announcement, sales emails.
Project items: 8
Priority mix: Polish: 7, Nice-to-Have: 1
Effort mix: Medium: 8
Target weeks: W9 Sales + Legal, W12 Release, W11 Launch Prep

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#83](https://github.com/Newman5/builder-season-playbook/issues/83) | Define free vs paid offerings | Polish | Medium | Documentation | W9 Sales + Legal | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#84](https://github.com/Newman5/builder-season-playbook/issues/84) | Create Gumroad product setup checklist | Polish | Medium | Workflow | W9 Sales + Legal | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#85](https://github.com/Newman5/builder-season-playbook/issues/85) | Research ADA payment flow | Nice-to-Have | Medium | Documentation | W12 Release | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#86](https://github.com/Newman5/builder-season-playbook/issues/86) | Define Stripe integration path | Polish | Medium | Documentation | W9 Sales + Legal | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#87](https://github.com/Newman5/builder-season-playbook/issues/87) | Create thank-you and download page | Polish | Medium | Website Component | W9 Sales + Legal | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#88](https://github.com/Newman5/builder-season-playbook/issues/88) | Create automated email delivery workflow | Polish | Medium | Workflow | W9 Sales + Legal | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#89](https://github.com/Newman5/builder-season-playbook/issues/89) | Draft launch announcement | Polish | Medium | Documentation | W11 Launch Prep | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |
| [#90](https://github.com/Newman5/builder-season-playbook/issues/90) | Draft sales emails | Polish | Medium | Template | W11 Launch Prep | Backlog | #12 (Template Starter Repo), #41 (Documentation Site), #51 (Template Library) |

## Legal Kit

Goal: Reduce ambiguity for sponsors, builders, and operators.
Problem solved: Future seasons have reusable governance documents.
Deliverables: Sponsorship agreement, Code of Conduct, participant agreement, privacy policy, terms, media release, payout disclaimer, licensing note.
Project items: 8
Priority mix: Polish: 7, Foundation: 1
Effort mix: Medium: 8
Target weeks: W10 Polish, W5 Foundation Package

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#91](https://github.com/Newman5/builder-season-playbook/issues/91) | Draft sponsorship agreement template | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |
| [#92](https://github.com/Newman5/builder-season-playbook/issues/92) | Add Code of Conduct | Foundation | Medium | Legal Document | W5 Foundation Package | Ready | #2 (Organizer Handbook) |
| [#93](https://github.com/Newman5/builder-season-playbook/issues/93) | Draft participant agreement | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |
| [#94](https://github.com/Newman5/builder-season-playbook/issues/94) | Draft privacy policy | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |
| [#95](https://github.com/Newman5/builder-season-playbook/issues/95) | Draft terms of use | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |
| [#96](https://github.com/Newman5/builder-season-playbook/issues/96) | Draft media release form | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |
| [#97](https://github.com/Newman5/builder-season-playbook/issues/97) | Draft payout disclaimer | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |
| [#98](https://github.com/Newman5/builder-season-playbook/issues/98) | Clarify open source licensing | Polish | Medium | Legal Document | W10 Polish | Backlog | #2 (Organizer Handbook), #83 (Sales Funnel) |

## Product Launch

Goal: Ship a complete v1.
Problem solved: The product is packaged, tested, and ready to sell or share.
Deliverables: Tested onboarding, tested payment/download flow, reviewed docs, fixed links, polished screenshots, demo video, launch thread/newsletter, v1 release, testimonials, archived current season.
Project items: 12
Priority mix: Polish: 11, Nice-to-Have: 1
Effort mix: Medium: 10, Large: 2
Target weeks: W11 Launch Prep, W12 Release

| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [#99](https://github.com/Newman5/builder-season-playbook/issues/99) | Test full onboarding flow | Polish | Medium | Workflow | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#100](https://github.com/Newman5/builder-season-playbook/issues/100) | Test payment flow | Polish | Medium | Workflow | W11 Launch Prep | Backlog | #83 (Sales Funnel) |
| [#101](https://github.com/Newman5/builder-season-playbook/issues/101) | Test downloadable package | Polish | Medium | Workflow | W11 Launch Prep | Backlog | #12 (Template Starter Repo), #41 (Documentation Site) |
| [#102](https://github.com/Newman5/builder-season-playbook/issues/102) | Review all docs | Polish | Medium | Documentation | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#103](https://github.com/Newman5/builder-season-playbook/issues/103) | Fix broken links | Polish | Medium | Documentation | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#104](https://github.com/Newman5/builder-season-playbook/issues/104) | Polish screenshots | Polish | Medium | Example | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#105](https://github.com/Newman5/builder-season-playbook/issues/105) | Record demo video | Polish | Large | Example | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#106](https://github.com/Newman5/builder-season-playbook/issues/106) | Create launch thread | Polish | Medium | Template | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#107](https://github.com/Newman5/builder-season-playbook/issues/107) | Create launch newsletter | Polish | Medium | Template | W11 Launch Prep | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#108](https://github.com/Newman5/builder-season-playbook/issues/108) | Publish v1 release | Polish | Large | Workflow | W12 Release | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#109](https://github.com/Newman5/builder-season-playbook/issues/109) | Collect testimonials | Nice-to-Have | Medium | Example | W12 Release | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
| [#110](https://github.com/Newman5/builder-season-playbook/issues/110) | Archive current hackathon season | Polish | Medium | Example | W12 Release | Backlog | #2 (Organizer Handbook), #12 (Template Starter Repo), #23 (Dashboard System), #41 (Documentation Site), #51 (Template Library) |
