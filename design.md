# Finance product design system

This file is the canonical design brief for this repository. Read it completely before designing or implementing any new page. Then inspect the living reference at `/design-system` and its source in `src/routes/design-system.tsx`.

## Design read

This is a high-trust finance product inspired by the provided Ramp references. The visual language is precise, quiet, fast, and operational. It combines compact product UI with more generous marketing composition. It is inspiration, not a pixel-for-pixel copy of Ramp or an official Ramp design system.

Design dials:

- Product UI: variance 4, motion 3, density 7.
- Marketing UI: variance 5, motion 5, density 4.
- The product should feel confident and modern, never playful, ornamental, glassy, or futuristic.

## Source references

The source images are in `design-ref/`:

- Product shell: sidebar, command search, balances, approval rows.
- Marketing home: large editorial type, asymmetrical product imagery, chartreuse CTA.
- Reporting page: alternating product stories, light gray media panels, data cards.
- Mega menu: strict columns, fine separators, compact icon tiles.

When the screenshots and this document disagree, this document is the implementation contract. Update both this file and `/design-system` when intentionally changing the system.

## Principles

1. Make money legible. Financial values, statuses, units, and time periods must be unambiguous.
2. Use density with intent. Product workflows are compact. Marketing content has more air.
3. Reserve the signal. Chartreuse is for the primary action, active signal, or brief emphasis only.
4. Prefer structure over decoration. Use alignment, spacing, typography, and thin dividers before shadows or cards.
5. State is part of the design. Every feature must account for loading, empty, error, permission, and success states.

## Tokens

Tokens live in `src/styles.css` as CSS variables and are exposed to Tailwind v4 through `@theme inline`.

### Color

| Role          | Token                      | Value     | Use                                               |
| ------------- | -------------------------- | --------- | ------------------------------------------------- |
| Canvas        | `--background`             | `#FFFFFF` | Main page and panel background                    |
| Ink           | `--foreground`             | `#161616` | Primary text, dark buttons, dark utility surfaces |
| Card          | `--card`                   | `#FFFFFF` | Elevated or bounded content                       |
| Soft surface  | `--muted`                  | `#F6F6F4` | Secondary panels, table headers, media wells      |
| Muted text    | `--muted-foreground`       | `#686866` | Supporting copy and metadata                      |
| Divider       | `--border`                 | `#DEDEDB` | Hairlines and component boundaries                |
| Input border  | `--input`                  | `#C9C9C5` | Interactive field boundary                        |
| Signal        | `--accent`                 | `#D7F500` | Primary CTA and rare active signal                |
| Signal hover  | `--accent-hover`           | `#C7E600` | Hover surface of the primary button               |
| Ink hover     | `--primary-hover`          | `#30302F` | Hover surface of dark buttons and selected dates  |
| Danger hover  | `--destructive-text-hover` | `#9A1E14` | Hover surface of destructive buttons              |
| Danger soft   | `--destructive-soft`       | `#FFF1F0` | Hover and notice surfaces for destructive actions |
| Success       | `--success`                | `#00B852` | Approved, positive, complete                      |
| Success text  | `--success-text`           | `#007A37` | Accessible labels and icons on success surfaces   |
| Warning       | `--warning`                | `#F5A000` | Needs review, caution                             |
| Warning text  | `--warning-text`           | `#854900` | Accessible labels and icons on warning surfaces   |
| Danger        | `--destructive`            | `#F04438` | Destructive or failed action                      |
| Danger text   | `--destructive-text`       | `#B42318` | Accessible labels and icons on danger surfaces    |
| Information   | `--info`                   | `#3567B7` | Informational states and selected data            |
| Chart blue    | `--chart-blue`             | `#3B82F6` | Primary comparison series                         |
| Chart green   | `--chart-green`            | `#00B852` | Positive or cash series                           |
| Chart berry   | `--chart-plum`             | `#C2467D` | Secondary comparison series                       |
| Chart amber   | `--chart-amber`            | `#F5A000` | Additional category series                        |
| Chart neutral | `--chart-neutral`          | `#858581` | Lower-priority category series                    |

Color rules:

- Use warm-neutral grays. Do not mix with blue-gray or purple-gray surfaces.
- Do not use gradients as decoration.
- Do not use chartreuse for body text, large surfaces, or multiple competing controls.
- Use the chart palette for categories and comparisons. Reserve success, warning, and danger for values with their actual semantic meaning.
- In the Dashboard latest transactions list, show income in green and expenses in red; retain the type label and plus or minus sign.
- Never communicate status by color alone. Include a label or icon.
- All text and controls must meet WCAG AA. Body text should target AAA where practical.

### Typography

The working font stack is `Helvetica Neue, Helvetica, Arial, ui-sans-serif, system-ui, sans-serif`. This approximates the neutral grotesk feel of the references without adding a network font dependency. Monospaced numbers use `SFMono-Regular, Consolas, Liberation Mono, monospace`.

| Style             | Size / line height                | Weight | Tracking                                     |
| ----------------- | --------------------------------- | ------ | -------------------------------------------- |
| Marketing display | `64/64` desktop, responsive below | 500    | `-0.05em`                                    |
| Page title        | `40/44`                           | 500    | `-0.04em`                                    |
| Section title     | `28/34`                           | 500    | `-0.03em`                                    |
| Product title     | `20/26`                           | 500    | `-0.02em`                                    |
| Body              | `15/24`                           | 400    | normal                                       |
| Compact body      | `13/20`                           | 400    | normal                                       |
| Label             | `12/16`                           | 600    | normal, uppercase only for system categories |
| Data              | `24/30` or contextual             | 500    | `-0.03em`, tabular numerals                  |

Typography rules:

- Use sentence case for headings, buttons, navigation, and labels.
- Use uppercase only for rare system categories in 10-12px type.
- Keep headings short and literal. Avoid poetic finance copy.
- Use monospaced, tabular numerals for values in columns and dense comparisons.
- Never use a serif in product UI.

### Spacing

Use a 4px base unit:

| Token intent | Value |
| ------------ | ----- |
| 1            | 4px   |
| 2            | 8px   |
| 3            | 12px  |
| 4            | 16px  |
| 6            | 24px  |
| 8            | 32px  |
| 12           | 48px  |
| 16           | 64px  |

Product defaults:

- Control gaps: 8-12px.
- Component padding: 12-16px.
- Panel padding: 20-24px.
- Page gutters: 24-32px desktop, 16px mobile.
- Product section gaps: 32-48px.

Marketing defaults:

- Content maximum: 1280-1440px.
- Page gutters: 32-48px desktop, 16px mobile.
- Section gaps: 96-160px desktop, 64-80px mobile.

### Radius and elevation

- Inputs, buttons, compact controls: 4px.
- Default elements: 6px.
- Panels and media wells: 8px.
- Pills: only badges, counts, and status chips.
- Avoid large soft radii. Do not exceed 12px without a documented exception.
- Prefer borders and surface contrast. Shadows are only for floating menus, dialogs, and sticky overlays.
- Default shadow for floating UI: `0 8px 30px rgb(22 22 22 / 0.08)`.

### Borders and icons

- Default border is 1px `--border`.
- Use a single divider between adjacent rows. Do not box every piece of content.
- The project already uses Lucide through shadcn. Keep one icon family and use `strokeWidth={1.75}` by default.
- Product icons are normally 14-18px. Navigation icons may be 18-20px.
- Never hand-draw SVG paths for interface icons.

## Components

This project uses shadcn conventions. New primitives should be added under `src/components/ui` and customized to these tokens. Do not ship shadcn default styling unchanged.

### Buttons

- Always render buttons with `Button`. Links that look like buttons use `buttonClasses()` from the same file. Do not hand-write button classes.
- Sizes: `default` 40px for every standard action, including auth and marketing. `md` 36px and `sm` 32px are only for dense rows, empty states, and inline secondary actions. There is no 44px button.
- Primary finance action: chartreuse background, near-black text, 4px radius.
- Dark action: near-black background, white text.
- Secondary action (`outline`): white background, 1px input border.
- Ghost action: transparent, muted text, with a clear hover surface.
- Destructive action: white text on dark red (`--destructive-text`).
- Hover colors come from the hover tokens. Disabled buttons use 50% opacity.
- Icons inside buttons are 16px with `strokeWidth={1.75}`.
- Modal footer buttons are text only. The submit button shows a spinner while it works.
- One primary action per view or bounded workflow region.
- Button labels should be direct verbs and stay on one line.
- Active state moves down by 1px. Focus uses a 2px near-black ring with 2px offset.

### Fields

- Labels always appear above fields.
- Helper and error text appears below fields.
- Default height is 40px. Dense table filters may use 32-36px.
- Placeholder text is never the only label.
- Error state uses text, icon, and border, not color alone.

### Search input

- Use `SearchInput` for controlled, dense collection and table filtering.
- It uses a leading search icon and requires an accessible label; the placeholder describes the searchable content but is not the label.
- Return the query through `onValueChange`. The owning feature manages pagination reset, debouncing, and data fetching.

### Date picker

- Use the date picker when choosing one calendar date is clearer than manual entry.
- Its trigger follows the standard 40px field treatment: label above, helper or error below, 4px radius, and 1px input border.
- `mode="date"` stores local calendar dates as `YYYY-MM-DD` and displays them as `DD/MM/YYYY`. `mode="month"` stores month values as `YYYY-MM` and displays them as `MMM YYYY`.
- The popover uses the standard popover surface, 6px radius, one border, and floating shadow. It supports keyboard navigation and respects date bounds.
- Use month mode for a reporting period or billing cycle. Use separate start and end fields for a simple bounded workflow. Add a range picker only when selecting a range is the primary task.

### Checkbox

- Use a checkbox for an independent boolean setting, never to select a mutually exclusive status.
- Pair it with a literal label and concise explanation when the effect needs context.
- The control is 20px with a 4px radius. The checked state uses the ink surface and a white check icon.

### Dropdown menus

- Use dropdown menus for compact secondary actions, especially table rows and mobile overflow controls.
- Triggers are ghost icon buttons with an accessible name and a visible open state.
- Menus use the popover surface, a 6px radius, a single border, and the standard floating shadow.
- Keep labels literal, separate destructive actions, and return focus to the trigger after dismissal.
- Support arrow keys, Home, End, Enter, Space, Escape, and outside-click dismissal.

### Select

- Use a select for choosing one value from a known list. Use a dropdown menu for actions, never for values.
- Default trigger height is 40px, 4px radius, 1px `--input` border. Dense table filters use 36px.
- The label sits above the trigger. Helper or error text sits below, exactly as with text fields.
- Placeholder text is muted and never replaces the label. The chevron rotates 180 degrees when open.
- The list uses the popover surface, a 6px radius, and the standard floating shadow. The selected item shows a check on the right.
- Group related options with a group label and a separator when the list mixes categories.
- Support arrow keys, Home, End, typeahead, Enter, Space, Escape, and outside-click dismissal. Return focus to the trigger after dismissal.
- `SelectField` automatically uses `SearchSelect` when it receives more than 9 options. Focus remains on the select trigger when opened; users can choose to search. `onSearch` returns the keyword to the owning feature, which is responsible for querying the API and supplying updated options.

### Icon picker

- Use `IconPicker` when a user assigns a pictogram to a category or other named item.
- Show a selected icon and its readable name in a standard 40px field. The popover offers a searchable grid of curated Lucide icons.
- Return the Lucide export name through `onValueChange` so the owning form can store the string. The picker does not save data itself.
- Keep every icon option keyboard reachable and named for assistive technology. Show an empty message when search has no matches.

### Confirm dialog

- Use a confirm dialog for actions that are hard to undo, move money, affect other people, or log out. Other reversible actions get an inline undo instead.
- The title states the action as a question. The body states the consequence, including what is affected and whether it can be undone.
- The confirm button repeats the verb from the trigger, for example `Delete transaction`, never `OK` or `Yes`.
- Two tones only: neutral for consequential actions and destructive red for deletions. The tone icon sits in a soft square, 36px, at 4px radius.
- Destructive confirm buttons use white text on a dark red surface for contrast.
- Cancel comes first in the DOM and appears last on desktop. On mobile the buttons stack with confirm on top.
- Include a bounded summary panel when the user needs to verify amounts, accounts, or counts before confirming.
- While the action is in flight, disable both buttons, show a spinner, and block Escape, outside click, and the close button.
- If the action fails, keep the dialog open and show a recovery message inline above the actions.
- The panel uses an 8px radius, the standard floating shadow, and a `#161616` overlay at 35 percent. Maximum width is 448px.
- Focus is trapped inside the dialog and returns to the trigger after dismissal.

### Modal layout

- Compose every form dialog from `BaseModalHeader`, `BaseModalBody`, and `BaseModalFooter`.
- The title is 18px medium with `-0.02em` tracking. The description below it is 12px muted text. Form dialogs do not use a tone icon; that is reserved for confirm dialogs.
- Widths follow the content: 448px for one or two fields, 520px by default, and 672px for two-column forms.
- Every overlay is `#161616` at 35 percent. The close button is a 32px ghost icon button.
- The header and footer remain fixed. Only `BaseModalBody` scrolls, and its scrollbar is visually hidden in Chrome and Safari while wheel, touch, and keyboard scrolling remain available.
- Existing simple dialogs can keep `BaseModalContent`'s default whole-panel scrolling until they are migrated to this layout.

### Cards and panels

- Use a card only when a border, distinct surface, or grouping communicates real hierarchy.
- Dashboard metrics may share one bounded panel with internal dividers.
- Use `MetricCard` for every metric. Every metric shows an icon at the top right. Pass `loading` to show the value-shaped skeleton; never show a dash as a placeholder.
- Four-metric strips are two columns on phones and four on wide screens.
- Marketing imagery lives in `--muted` media wells with 8px radius.
- Avoid three identical floating cards as a default page composition.
- In the Dashboard upcoming recurring list, place the due date before a blue informational marker, followed by the category, description, and right-aligned amount. Show the year and do not imply a time of day.

### Tables

- Headers use 11-12px muted text on a soft surface or white canvas.
- Rows use one bottom divider, 44-52px height, and a subtle hover background.
- Text aligns left. Numeric values align right with tabular numerals.
- Keep units in headers or values. Never make the user infer currency or time range.
- Horizontal overflow is explicit on small screens. Freeze the identifying column when useful.

### Pagination

- Use pagination at the bottom of data tables to navigate multi-page collections.
- Displays the currently visible item range and total count on the left (e.g., `Showing 1-10 of 42 transactions`).
- Controls sit on the right with icon buttons for previous and next page navigation, with `Page X of Y` indicator in between.
- Navigation buttons use 32px (`size-8`) squares with `4px` radius, 1px input border, and semantic hover/focus ring.
- Disabled buttons use 40% opacity and ignore pointer events when on the first or last page.
- Stacks vertically on small screens (`flex-col sm:flex-row`).

### Empty and error states

- Use empty states when a table or collection has no records or when search/filter criteria match nothing.
- Use error states when an API request fails, offering a clear recovery action (e.g. `Retry`).
- Container uses 288px minimum height (`min-h-72`), centered text, and 48px vertical padding.
- Icons sit inside a 44px (`size-11`) rounded square with 4px radius (`rounded-sm bg-muted` for empty, `rounded-sm bg-destructive/10` for error).
- Title uses 16px medium text. Description uses 12px muted text with a 384px maximum width (`max-w-sm`).
- Actions sit 20px below description (`mt-5`).
- `DataTable` owns empty-state action markup. Pages provide an `actions` array with each label, callback, and optional button presentation.

### Navigation

- The shared top bar searches the four workspace menus locally using the same entries as the sidebar: Overview, Transactions, Budgets, and Recurring.
- Open menu search from its button or with Command+K (Control+K is also supported). Use a search icon on compact screens while keeping page period controls visible.
- The search dialog uses the existing modal and search input. Focus the input on open, support arrow keys and Enter for navigation, Escape to close, and a readable no-results state. Return focus to the trigger when dismissed.
- Use the shared `LedgrIcon` at 32px for workspace and design-system navigation branding.
- Use a Lucide `UserRound` icon in a neutral circular placeholder when no account photo is available.
- The sidebar brand reads "Ledgr" with "Personal workspace" below it.
- The right side of the top bar holds the page's period control only, such as the month picker. A page without a period leaves it empty. Page-level switches, such as Monthly and Yearly on the dashboard, sit in the page header action slot.
- Show Settings and Log out as separate sidebar actions, including in mobile navigation. Settings links to the profile page and shows its active state there. Confirm before logging out.
- In compact app bars, show the navigation menu without a second brand mark. Keep the month picker visible when a page provides one.
- Desktop product sidebar: 216-240px.
- Top command bar: 56-64px.
- Active nav item uses a stronger neutral fill and text color without changing font weight or size. Accent color is reserved for notification counts or primary actions.
- Group labels are 10-11px uppercase and muted. Do not add decorative status dots.
- Product content should remain usable when the sidebar collapses below 1024px.

### Feedback and status

- Success uses green text/icon on a pale green surface.
- Review uses ochre text/icon on a pale amber surface.
- Information uses blue text/icon on a pale blue surface.
- Error uses red text/icon and must describe recovery.
- Toasts are only for transient confirmation. Persistent problems stay inline.

### Toast

- Use a toast to confirm completed work such as creating, updating, or deleting a transaction.
- Show one toast at a time at the bottom right on desktop and above the bottom gutter on mobile.
- Use a literal title, an optional one-line explanation, a semantic icon, and a labeled dismiss button.
- Success uses the success-soft surface and success icon. Information uses the info-soft surface. Error uses the destructive icon and must include recovery guidance.
- Default duration is 4 seconds. Keep persistent or recoverable errors inline instead of relying on auto-dismissed feedback.
- Toasts use a 6px radius, one border, the standard floating shadow, and `role="status"` or `role="alert"` based on urgency.

## Layout patterns

### Product pages

1. Persistent shell: sidebar, command/search bar, and content canvas.
2. Page header: use `PageHeader` (eyebrow, title, description, optional action aligned to the right). On phones the action spans the full width.
3. Overview data: shared bounded panel or clear grid, not floating decorative cards.
4. Operational content: tabs, filters, table or list, pagination.
5. Mobile: collapse to one column, move secondary actions into a menu, preserve value and status labels.

### Marketing pages

1. Navigation is 64-72px and fits on one line at desktop.
2. Hero uses large left-aligned copy with a real product or editorial image.
3. Chartreuse appears on the principal CTA only.
4. Alternate composition families. Do not repeat the same image-text split more than twice.
5. Use real screenshots from the product. Do not build fake dashboard screenshots from decorative divs.
6. Keep the whole page in one light theme unless the brief explicitly calls for a dark utility region.

## Motion

Motion explains what changed: a page arrived, a value loaded, a bar filled. Product UI uses motion level 3 and marketing uses level 5. Tokens and utilities live in `src/styles.css`, with live examples on `/design-system#motion`.

| Token               | Value                            | Use                                                        |
| ------------------- | -------------------------------- | ---------------------------------------------------------- |
| `--duration-fast`   | 140ms                            | Hover, focus, press, and color changes                     |
| `--duration-base`   | 220ms                            | Page crossfade, values replacing skeletons, tab indicators |
| `--duration-enter`  | 300ms                            | Headers, toasts, drawers, and panels entering              |
| `--duration-reveal` | 600ms                            | Marketing entrance and scroll reveal                       |
| `--ease-out`        | `cubic-bezier(0.22, 1, 0.36, 1)` | Anything arriving                                          |
| `--ease-in-out`     | `cubic-bezier(0.65, 0, 0.35, 1)` | Anything moving between two positions                      |

Product UI:

- Route changes use the View Transitions API (`defaultViewTransition` in `src/router.tsx`). The content area fades out in 120ms and rises in over 220ms. The sidebar and top bar keep their own transition names so they do not move.
- Page headers enter with `.ds-enter`. Metric values replace skeletons with `.ds-value-in`.
- Progress fills and stacked bars grow from the left with `.ds-grow-x`, using `scaleX` rather than width. Chart bars grow from the baseline with `.ds-grow-y` and a 12ms stagger.
- Tab and segmented control indicators slide to the selected option.
- Toasts and drawers slide in from their edge with `--duration-enter`.
- Do not animate table rows or count numbers up in product UI. These pages are used every day and repeated motion reads as slowness.

Marketing UI:

- The hero enters on load with `.ds-rise`, staggered 80ms per element. The example card uses `.ds-pop` and its numbers count up once.
- Sections below the hero reveal once on scroll with `useReveal()`, `.ds-reveal`, and `.ds-reveal-item`. Rows inside a revealed card use `.ds-reveal-rows`.

Always:

- Animate opacity and transform only.
- No automatic marquee, parallax, magnetic buttons, glow, or scroll hijacking.
- Loading uses skeletons shaped like the final content, not generic spinners. A spinner is allowed inside a button that is submitting.
- Every utility above is off under `prefers-reduced-motion`. Content must be fully visible without JavaScript.

## Content and data

- Use plain language: `Review expenses`, not `Unlock financial clarity`.
- Use realistic names and sample data. Label examples when values are not real.
- Use currency codes when currencies can differ. Use locale-aware formatting in production.
- Group thousands in displayed amounts and show decimal digits only when the value has them.
- Show the time period near every metric and chart.
- Avoid fake precision and unexplained percentages.
- Do not use em dashes or en dashes as separators. Use a hyphen, line break, or separate columns.

## Accessibility and responsive requirements

- Minimum text contrast is 4.5:1, or 3:1 for large text.
- Preferred touch target is 44px. Compact desktop controls may be 32-40px when adjacent spacing prevents misclicks.
- Every interactive element has a visible `:focus-visible` state.
- Icon-only buttons require an accessible name.
- Tables need headers and a responsive overflow strategy.
- Charts need a text summary or accessible data alternative.
- Multi-column layouts collapse explicitly below 768px.
- Use `min-height: 100dvh` for full-height shells, never `100vh`.

## Do not use

- Purple or blue glow aesthetics.
- Glassmorphism, translucent cards, or decorative blur.
- Large pill-shaped buttons.
- Warm beige luxury palettes.
- Serif type in the product.
- Gradient text.
- Decorative status dots.
- Excessive shadows or floating card grids.
- Fake product screenshots.
- Three identical feature cards as the default layout.
- Em dashes in visible copy.

## New page checklist

Before implementation:

- Read this file completely.
- Inspect `/design-system` and `src/routes/design-system.tsx`.
- Review relevant screenshots in `design-ref/`.
- Decide whether the page is product or marketing.
- Identify the page's single primary action.
- List loading, empty, error, and permission states.

Before completion:

- Reuse the CSS tokens in `src/styles.css`.
- Use or extend shadcn components rather than introducing a second system.
- Verify mobile at 375px, tablet at 768px, and desktop at 1440px.
- Verify keyboard focus, contrast, control labels, and table semantics.
- Run tests and a production build.
- Update this document and `/design-system` if new reusable tokens or patterns were introduced.
