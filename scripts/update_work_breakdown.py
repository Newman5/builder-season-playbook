#!/usr/bin/env python3
"""Regenerate templates/admins/work-breakdown.md from the GitHub Project."""

import argparse
import json
import re
import subprocess
from collections import OrderedDict
from pathlib import Path


DEFAULT_OWNER = "Newman5"
DEFAULT_PROJECT_NUMBER = "3"
DEFAULT_OUTPUT = Path("templates/admins/work-breakdown.md")


def run_gh_project_items(owner, project_number):
    raw = subprocess.check_output(
        [
            "gh",
            "project",
            "item-list",
            str(project_number),
            "--owner",
            owner,
            "--format",
            "json",
            "--limit",
            "200",
        ],
        text=True,
    )
    return json.loads(raw)["items"]


def section(body, heading):
    marker = f"## {heading}\n"
    start = body.find(marker)
    if start < 0:
        return ""

    start += len(marker)
    next_heading = body.find("\n## ", start)
    text = body[start:] if next_heading < 0 else body[start:next_heading]
    return text.strip()


def single_line(text):
    return " ".join(text.split())


def strip_issue_prefix(title):
    return re.sub(r"^\[[^\]]+\]\s*", "", title).strip()


def markdown_cell(value):
    return str(value or "").replace("|", "\\|").replace("\n", " ").strip()


def counts_text(counts):
    return ", ".join(f"{key}: {value}" for key, value in counts.items())


def issue_number(item):
    return item.get("content", {}).get("number", 10**9)


def build_markdown(owner, project_number, items):
    items = sorted(items, key=issue_number)

    by_epic = OrderedDict()
    for item in items:
        by_epic.setdefault(item.get("epic") or "Unassigned", []).append(item)

    lines = [
        "# Builder Season Playbook Work Breakdown",
        "",
        f"Source of truth: GitHub Project `Builder Season Playbook v1` at https://github.com/users/{owner}/projects/{project_number}.",
        "",
        "This file is a local snapshot generated from the Project items. Update the GitHub Project first, then regenerate this file so issues, fields, milestones, and dependencies stay aligned.",
        "",
        f"Total project items: {len(items)}",
        "",
        "## Board Fields",
        "",
        "- Kanban Status: Backlog, Ready, In Progress, Blocked, Review, Done",
        "- Priority Tier: Foundation, Polish, Nice-to-Have",
        "- Effort: Small, Medium, Large",
        "- Artifact Type: Documentation, Template, Script, Workflow, Website Component, Legal Document, Automation, Example",
        "- Target Week: W5 Foundation Package through W12 Release",
        "",
    ]

    for epic, epic_items in by_epic.items():
        body = epic_items[0].get("content", {}).get("body", "") or ""
        goal = single_line(section(body, "Goal"))
        problem = single_line(section(body, "Problem This Solves"))
        deliverable_section = section(body, "Deliverable")
        epic_deliverables = ""

        for line in deliverable_section.splitlines():
            if line.startswith("Epic deliverables:"):
                epic_deliverables = single_line(
                    line.replace("Epic deliverables:", "", 1)
                )
                break

        priority_counts = OrderedDict()
        effort_counts = OrderedDict()
        target_weeks = OrderedDict()

        for item in epic_items:
            priority = item.get("priority Tier") or "Unspecified"
            effort = item.get("effort") or "Unspecified"
            target_week = item.get("target Week") or "Unspecified"
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
            effort_counts[effort] = effort_counts.get(effort, 0) + 1
            target_weeks[target_week] = True

        lines.extend(
            [
                f"## {epic}",
                "",
            ]
        )
        if goal:
            lines.append(f"Goal: {goal}")
        if problem:
            lines.append(f"Problem solved: {problem}")
        if epic_deliverables:
            lines.append(f"Deliverables: {epic_deliverables}")

        lines.extend(
            [
                f"Project items: {len(epic_items)}",
                f"Priority mix: {counts_text(priority_counts)}",
                f"Effort mix: {counts_text(effort_counts)}",
                f"Target weeks: {', '.join(target_weeks.keys())}",
                "",
                "| Issue | Task | Priority | Effort | Artifact | Target Week | Kanban | Dependencies |",
                "| --- | --- | --- | --- | --- | --- | --- | --- |",
            ]
        )

        for item in epic_items:
            content = item.get("content", {})
            number = content.get("number")
            url = content.get("url", "")
            issue = f"[#{number}]({url})" if number and url else ""
            row = [
                issue,
                strip_issue_prefix(item.get("title", "")),
                item.get("priority Tier", ""),
                item.get("effort", ""),
                item.get("artifact Type", ""),
                item.get("target Week", ""),
                item.get("kanban Status", ""),
                item.get("dependencies") or "None",
            ]
            lines.append("| " + " | ".join(markdown_cell(value) for value in row) + " |")

        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main():
    parser = argparse.ArgumentParser(
        description="Regenerate work-breakdown.md from GitHub Project items."
    )
    parser.add_argument("--owner", default=DEFAULT_OWNER)
    parser.add_argument("--project-number", default=DEFAULT_PROJECT_NUMBER)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    items = run_gh_project_items(args.owner, args.project_number)
    args.output.write_text(
        build_markdown(args.owner, args.project_number, items),
        encoding="utf-8",
    )
    print(f"Wrote {args.output} from {len(items)} project items.")


if __name__ == "__main__":
    main()
