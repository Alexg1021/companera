# Compañera — Style Guide
## Visual design system for the Zócalo Health promotora companion app

This guide defines the visual language for Compañera. It's intentionally aligned with Zócalo Health's brand while remaining appropriate for an internal care coordination tool — warm and human, not clinical; grounded in community, not corporate.

---

## Color

### Primary palette

| Token | Hex | Usage |
|---|---|---|
| `brand-navy` | `#1A2E4A` | Logo bar, topbar background, primary buttons, active nav |
| `brand-teal` | `#1D9E75` | Accent, secondary buttons, badge borders, progress bars, links |
| `brand-teal-light` | `#E1F5EE` | Teal tint backgrounds, selected pill state |
| `brand-teal-dark` | `#085041` | Teal text on light backgrounds (for contrast) |

### Status colors

| Token | Hex | Usage |
|---|---|---|
| `status-urgent-bg` | `#FCEBEB` | Urgent badge background |
| `status-urgent-text` | `#A32D2D` | Urgent badge text, urgent CV values |
| `status-upcoming-bg` | `#FAEEDA` | Upcoming badge background, alert card background |
| `status-upcoming-text` | `#854F0B` | Upcoming badge text |
| `status-current-bg` | `#EAF3DE` | Current/good badge background |
| `status-current-text` | `#3B6D11` | Current/good badge text, positive delta text |

### Neutral palette

| Token | Hex | Usage |
|---|---|---|
| `neutral-900` | `#111827` | Primary text |
| `neutral-500` | `#6B7280` | Secondary text, labels |
| `neutral-400` | `#9CA3AF` | Tertiary text, timestamps |
| `neutral-200` | `#E5E7EB` | Borders, dividers |
| `neutral-100` | `#F3F4F6` | Card backgrounds, secondary surfaces |
| `neutral-50` | `#F9FAFB` | Page background |
| `white` | `#FFFFFF` | Primary surface |

### Tailwind config

Add these to `tailwind.config.ts` under `theme.extend.colors`:

```ts
colors: {
  brand: {
    navy: '#1A2E4A',
    teal: '#1D9E75',
    'teal-light': '#E1F5EE',
    'teal-dark': '#085041',
  },
  status: {
    'urgent-bg': '#FCEBEB',
    'urgent-text': '#A32D2D',
    'upcoming-bg': '#FAEEDA',
    'upcoming-text': '#854F0B',
    'current-bg': '#EAF3DE',
    'current-text': '#3B6D11',
  },
}
```

---

## Typography

Zócalo Health uses **Plus Jakarta Sans** for their marketing site. Use it here for visual continuity.

### Setup

In `app/layout.tsx`:

```tsx
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})
```

### Scale

| Role | Size | Weight | Usage |
|---|---|---|---|
| Screen title | `16px` / `text-base` | 500 | Topbar page titles |
| Section label | `10px` / `text-[10px]` | 500 | Uppercase section headers (ALL CAPS + letter-spacing) |
| Member name | `13px` / `text-[13px]` | 500 | List row primary text |
| Body / notes | `12px` / `text-xs` | 400 | Card content, timeline notes, form labels |
| Timestamp / meta | `11px` / `text-[11px]` | 400 | Last contact line, dates |
| Stat number | `17–22px` | 500 | Dashboard metrics, stat chips |
| Badge | `10px` / `text-[10px]` | 500 | Status badges |

Section labels should always be uppercase with `tracking-wide` (0.04–0.05em letter spacing) and `text-neutral-400`.

---

## Spacing & Layout

### App shell

- Max width: `390px` — centered on larger screens, full-width on mobile
- The app is a phone-shaped container. On desktop it sits centered with a subtle background behind it.
- Bottom safe area: always add `env(safe-area-inset-bottom)` to the bottom action row

```css
padding-bottom: max(12px, env(safe-area-inset-bottom));
```

### Spacing scale

Use Tailwind's default spacing scale. Key values in use:

| Value | Tailwind | Usage |
|---|---|---|
| 4px | `p-1` | Tight internal padding (badges) |
| 8px | `p-2` | Pill padding, small gaps |
| 10–12px | `p-[10px]` / `p-3` | Card internal padding, list row padding |
| 14–18px | `px-[18px]` | Screen horizontal padding (consistent across all screens) |
| 24px | `gap-6` | Between major sections |

### Consistent horizontal padding

All screen content uses `px-[18px]` as the horizontal gutter. Never let content touch the edges.

---

## Components

### Status badge

```tsx
// Usage: <StatusBadge status="urgent" />
const config = {
  urgent:   { bg: 'bg-status-urgent-bg',   text: 'text-status-urgent-text',   label: 'Urgente' },
  upcoming: { bg: 'bg-status-upcoming-bg', text: 'text-status-upcoming-text', label: 'Pronto' },
  current:  { bg: 'bg-status-current-bg',  text: 'text-status-current-text',  label: 'Bien' },
}

<span className={`text-[10px] font-medium px-[7px] py-[2px] rounded-full ${config[status].bg} ${config[status].text}`}>
  {config[status].label}
</span>
```

### Avatar

Avatars are initials-based circles. Color is assigned by member — use a consistent mapping (not random) so the same member always gets the same color.

```tsx
const avatarColors = [
  'bg-[#FAECE7] text-[#712B13]', // coral
  'bg-[#FAEEDA] text-[#633806]', // amber
  'bg-[#EEEDFE] text-[#3C3489]', // purple
  'bg-[#E6F1FB] text-[#0C447C]', // blue
  'bg-[#FBEAF0] text-[#72243E]', // pink
  'bg-brand-teal-light text-brand-teal-dark', // teal
]
// Assign by: avatarColors[memberIndex % avatarColors.length]
```

### Alert card

Used for urgent notices on member profiles. Background matches the alert type.

```tsx
// Urgent (red-tinted)
<div className="bg-status-upcoming-bg rounded-lg p-[10px] flex gap-2 mb-[10px]">
  <AlertTriangle size={15} className="text-status-upcoming-text shrink-0 mt-[1px]" />
  <p className="text-xs text-[#633806] leading-relaxed">{message}</p>
</div>
```

### Primary button

```tsx
<button className="flex-1 bg-brand-navy text-white rounded-lg py-[9px] text-xs font-medium">
  {label}
</button>
```

Note: primary buttons use `brand-navy`, not teal. Teal is used for secondary/outline buttons and accents.

### Pill selector

Used on the log touchpoint form for contact type and outcome selection.

```tsx
// Unselected
<button className="px-3 py-[5px] rounded-full border border-neutral-200 text-xs text-neutral-500">
// Selected
<button className="px-3 py-[5px] rounded-full border border-brand-teal bg-brand-teal-light text-brand-teal-dark font-medium">
```

Minimum tap target: wrap in a container with `min-h-[44px] flex items-center` if pills are small.

### Card

```tsx
<div className="bg-neutral-100 rounded-lg p-[10px] mb-[10px]">
  <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-[6px]">{label}</p>
  {children}
</div>
```

### Skeleton loader

Used during data fetching. Apply `animate-pulse` to the wrapper.

```tsx
<div className="animate-pulse px-[18px] py-[11px] flex items-center gap-[10px] border-b border-neutral-200">
  <div className="rounded-full bg-neutral-200 h-[34px] w-[34px] shrink-0" />
  <div className="flex-1 space-y-2">
    <div className="h-3 bg-neutral-200 rounded w-1/3" />
    <div className="h-2 bg-neutral-200 rounded w-1/2" />
  </div>
  <div className="h-5 w-12 bg-neutral-200 rounded-full" />
</div>
```

---

## Iconography

Use **Lucide React** icons throughout. They're already in the ecosystem and match the clean, minimal aesthetic.

Key icons in use:

| Context | Icon |
|---|---|
| Back navigation | `ArrowLeft` |
| Alert / urgent | `AlertTriangle` |
| WhatsApp | `MessageCircle` (or brand icon if available) |
| Log touchpoint | `Pencil` |
| Escalation | `AlertCircle` |
| Success / confirmed | `Check` |
| Health / app logo | `Heart` |
| Dashboard | `BarChart2` |
| Document / Medicaid | `FileText` |

Always set `size={14}` or `size={15}` for inline icons, `size={18}` for topbar icons, `size={26}` for the success screen hero icon.

---

## Logo bar

The logo bar appears at the top of every screen. It uses `brand-navy` as the background with white text and icon.

```tsx
<div className="px-[18px] py-[10px] flex items-center gap-2 border-b border-neutral-200 bg-brand-navy">
  <div className="w-[26px] h-[26px] rounded-[8px] bg-brand-teal flex items-center justify-center">
    <Heart size={14} className="text-white" />
  </div>
  <div>
    <p className="text-[13px] font-medium text-white">Zócalo Health</p>
    <p className="text-[10px] text-white/60">Promotora companion</p>
  </div>
</div>
```

---

## Tone & copy

- **Spanish-first** — all UI copy is in Spanish. Notes and clinical content can be bilingual.
- **Warm, not clinical** — write like a colleague, not a system. "Buenos días, Rosa" not "Welcome, User."
- **Concise** — promotoras are in the field. Every label should be scannable.
- **Humanizing** — member names always appear with full name. Never "Patient #1042."

### Common strings

| Context | Copy |
|---|---|
| Greeting | `Buenos días / tardes / noches, {name}` |
| Urgent section header | `Necesita contacto` |
| Upcoming section header | `Próximamente` |
| Current section header | `Al día` |
| Save button | `Guardar` |
| Cancel | `Cancelar` |
| Back | `← Mis miembros` |
| Success title | `Contacto registrado` |
| Empty — no urgent | `Todo al día ✓` |
| Error — save failed | `No se pudo guardar. Intenta de nuevo.` |

---

## Motion

Keep transitions subtle and functional:

- Navigation between screens: no animation (instant, like a native mobile app)
- Button hover: `transition-colors duration-150`
- Toggle: `transition-all duration-200`
- Skeleton pulse: Tailwind's `animate-pulse` (default timing is correct)

No page-level transitions — they add latency feel on mobile and don't belong in a field tool.

---

## Accessibility

- All interactive elements must have a minimum tap target of **44×44px** on mobile
- Color is never the only indicator of status — badges always include a text label
- All icon-only buttons must have an `aria-label`
- Form inputs must have associated `<label>` elements or `aria-label`
- Maintain WCAG AA contrast on all text — teal on white passes; white on navy passes
