# Agent design rules

For every task that creates or changes a page, component, layout, visual style, chart, navigation pattern, or interaction:

1. Read `design.md` completely before planning or editing.
2. Inspect the living reference at `/design-system` and its implementation in `src/routes/design-system.tsx`.
3. Review the relevant source screenshots in `design-ref/` when visual context is needed.
4. Use the semantic tokens in `src/styles.css`. Do not introduce a parallel palette, radius scale, type system, or component library.
5. Build with the existing TanStack Router, Tailwind v4, and customized shadcn conventions.
6. Treat `design.md` as the source of truth. If a task intentionally changes the system, update both `design.md` and `/design-system` in the same change.
7. Do not begin visual implementation until steps 1-3 are complete.

For non-design tasks, these rules apply whenever the change affects rendered UI.

# Learning project — answer-only by default

This project exists for the user to learn. When the user asks a question ("why does this happen", "how would I...", "is this right", "what's the difference between..."), answer the question in words/explanation only. Do not edit files or change code in response to a question.

Only make code changes when the user explicitly asks for an action (e.g. "fix this", "add X", "implement this", "change it to..."). If a request is ambiguous about whether it's a question or an instruction to change code, ask before editing.
