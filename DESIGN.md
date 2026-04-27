# Design Brief

## Direction

**Refined Fintech Dashboard** — A sophisticated portfolio management interface for Indian investors prioritizing precision, data density, and trusted financial authority.

## Tone

Technical and authoritative without coldness: teal primary (financial trust) with warm amber accents, dark mode-first, inspired by professional trading platforms and SaaS tools like Linear and Stripe.

## Differentiation

Precise metric-centric UI with card-based hierarchy and monospace data surfaces; broker auto-suggest dropdown, rebalancing alerts, and tax analysis bucketed in intentional zones rather than scattered across the page.

## Color Palette

| Token           | Light (L C H)     | Dark (L C H)      | Role                                |
| --------------- | ----------------- | ----------------- | ----------------------------------- |
| background      | 0.98 0.01 240     | 0.12 0.02 245     | Page background, neutral base       |
| foreground      | 0.16 0.01 240     | 0.93 0.01 245     | Body text, primary readable text    |
| card            | 1.0 0.0 0         | 0.16 0.025 245    | Card/section surfaces               |
| primary         | 0.52 0.19 240     | 0.68 0.18 190     | CTA, active states, teal accent    |
| accent          | 0.68 0.16 65      | 0.72 0.16 65      | Rebalancing alerts, warnings, warm |
| muted           | 0.95 0.01 240     | 0.22 0.025 245    | Secondary text, disabled states     |
| destructive     | 0.55 0.22 25      | 0.58 0.2 25       | Error, loss indicators              |
| border          | 0.91 0.008 240    | 0.28 0.025 245    | Subtle dividers between zones       |

## Typography

- **Display**: Space Grotesk — Technical authority for headings, dashboard titles, metric labels
- **Body**: DM Sans — Readable paragraph and UI label text with balanced weight
- **Mono**: JetBrains Mono — Ticker symbols, numerical data, price quotes
- **Scale**: Hero `text-3xl font-bold tracking-tight`, section heads `text-xl font-semibold`, labels `text-xs font-semibold uppercase tracking-wider`

## Elevation & Depth

Minimal shadow hierarchy: card surfaces elevated 2–8px via `shadow-card` (subtle), section containers use `bg-card` with `border-b border-border`, alternating `bg-background` and `bg-muted/20` for row sections to create density without clutter.

## Structural Zones

| Zone            | Background       | Border              | Notes                               |
| --------------- | ---------------- | ------------------- | ----------------------------------- |
| Header          | `bg-card`        | `border-b`          | User account, date, nav buttons     |
| Sidebar         | `bg-sidebar`     | `border-r`          | Broker list, nav sections           |
| Main Content    | `bg-background`  | —                   | Grid of holdings cards, charts      |
| Alert Banner    | `bg-destructive` | `border-destructive` | Rebalancing alerts, above content   |
| Card Rows       | `bg-card`        | `border-b`          | Holdings, recommendations, metrics  |
| Footer          | `bg-background`  | `border-t`          | Developer credit, links             |

## Spacing & Rhythm

Consistent 16px base grid (via Tailwind's default). Sections gap by `gap-6`, cards by `gap-4`, inner label-value pairs by `gap-1`. Compact microspacing for metric badges and labels (px-2 py-1) preserves data density.

## Component Patterns

- **Buttons**: `bg-primary text-primary-foreground` for CTA, `bg-secondary text-secondary-foreground` for secondary, `bg-muted text-muted-foreground` for tertiary; all use `rounded-md` with `transition-smooth`
- **Cards**: `bg-card` with `border-border border` and `shadow-card`, `rounded-md`
- **Data Tables**: `font-mono text-sm` with `bg-muted/10` row alternation, metric badges use `.metric-badge` utility
- **Alerts**: `.alert-banner` utility for rebalancing/warnings; `bg-accent/5 text-accent-foreground`

## Motion

Entrance: 0.3s fade-in + slide-up on metric cards on page load. Hover: all interactive elements use `transition-smooth` (0.3s cubic-bezier). No decorative animations — focus is clarity and speed.

## Constraints

- Always use dark mode by default; light mode available but secondary
- No full-width gradients — depth via layered backgrounds and cards
- Monospace required for all numerical data, ticker symbols
- Broker dropdown must show auto-suggest list, no external API calls
- Tax analysis splits into 3 buckets only (STCG 15%, LTCG 10%, unrealized)

## Signature Detail

Monospace metric surfaces with subtle `bg-muted/20` backgrounds emphasize data precision; combined with warm amber accent color in alerts, this creates a finance-forward aesthetic distinct from generic SaaS dashboards.
