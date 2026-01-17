# Spec Kit Workflow

A step-by-step guide for using GitHub Spec Kit for spec-driven development with Claude Code or other AI coding agents.

---

## 1. Constitution

**Command:** `/speckit.constitution`

Define immutable principles that apply to ALL work in this project.

- Tech stack constraints
- Quality standards (accessibility, performance)
- Architectural patterns
- References to existing docs (CLAUDE.md, design system, etc.)

*Do once per project, update rarely.*

---

## 2. Specify

**Command:** `/speckit.specify`

Describe WHAT you're building in plain language—features, user stories, acceptance criteria.

- Focus on outcomes, not implementation
- Be explicit about scope boundaries
- Don't mention tech stack here

*Creates: `.specify/specs/[feature-name]/spec.md`*

---

## 3. Plan

**Command:** `/speckit.plan`

Agent analyzes your spec against the constitution and proposes HOW to build it.

- Technical approach
- Architecture decisions
- Dependencies
- Research notes (existing code patterns, etc.)

*Creates: `.specify/specs/[feature-name]/plan.md`*

**Review checkpoint:** Validate the plan before proceeding. This is where you catch misalignment.

---

## 4. Tasks

**Command:** `/speckit.tasks`

Break the plan into ordered, actionable implementation tasks.

- Dependency sequencing (models before services, etc.)
- File paths specified
- Parallel tasks marked with `[P]`
- Tests included if requested

*Creates: `.specify/specs/[feature-name]/tasks.md`*

---

## 5. Implement

**Command:** `/speckit.implement`

Agent executes tasks one by one, checking each against constitution + spec.

---

## 6. Analyze (Optional)

**Command:** `/speckit.analyze`

Quality gate—checks spec/plan/tasks for constitution violations or inconsistencies. Can be run at any point in the workflow.

---

## Quick Reference

| Step | Input | Output | Your Role |
|------|-------|--------|-----------|
| Constitution | Project principles | `constitution.md` | Author |
| Specify | Feature description | `spec.md` | Author |
| Plan | Spec + constitution | `plan.md` | Review/approve |
| Tasks | Plan | `tasks.md` | Review/approve |
| Implement | Tasks | Code | Review/test |

---

## Tips

- **Constitution as orchestrator:** Reference existing docs (CLAUDE.md, design systems) rather than duplicating content
- **Review checkpoints matter:** The plan step is where you catch misalignment before implementation
- **One spec per feature:** Each feature/change gets its own spec branch
- **Iterate on specs, not code:** When requirements change, update the spec first

---

## Resources

- [GitHub Spec Kit Repository](https://github.com/github/spec-kit)
- [Spec-Driven Development Overview](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [GitHub Blog: Spec-Driven Development](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
