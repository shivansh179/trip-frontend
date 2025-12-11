# Tailwind CSS v4 Configuration Documentation

## Overview
This project uses **Tailwind CSS v4** with Next.js. Tailwind v4 introduces a new CSS-first configuration approach using `@theme` blocks instead of JavaScript config files.

## File Structure

```
trip-frontend/
├── postcss.config.js          # PostCSS configuration
├── src/
│   └── app/
│       └── globals.css        # Main CSS file with Tailwind imports and theme
```

## Configuration Files

### 1. PostCSS Configuration (`postcss.config.js`)
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},  // Tailwind v4 PostCSS plugin
    autoprefixer: {},            // Browser compatibility
  },
};
```

**Purpose**: Processes CSS through Tailwind and adds vendor prefixes.

### 2. Global CSS (`src/app/globals.css`)

#### Tailwind Import
```css
@import "tailwindcss";
```
This imports all Tailwind utilities (base, components, utilities).

#### Theme Configuration (`@theme` block)
```css
@theme {
  --color-primary: #1a1a1a;
  --color-accent: #d4af37;
  /* ... more colors ... */
}
```

**How it works**: Colors defined in `@theme` are automatically available as Tailwind utilities:
- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

## Custom Colors Available

| Color Name | Value | Usage Examples |
|------------|-------|----------------|
| `primary` | `#1a1a1a` | `bg-primary`, `text-primary` |
| `secondary` | `#2c2c2c` | `bg-secondary`, `text-secondary` |
| `accent` | `#d4af37` | `bg-accent`, `text-accent` |
| `success` | `#00b894` | `bg-success`, `text-success` |
| `warning` | `#fdcb6e` | `bg-warning`, `text-warning` |
| `error` | `#d63031` | `bg-error`, `text-error` |
| `background` | `#ffffff` | `bg-background` |
| `surface` | `#fafafa` | `bg-surface` |
| `foreground` | `#1a1a1a` | `text-foreground`, `bg-foreground` |
| `text-secondary` | `#666666` | `text-text-secondary` |
| `border` | `#e5e5e5` | `border-border` |

## Custom Utility Classes

### Animation Classes
- `.animate-fade-in` - Fade in animation
- `.animate-fade-in-up` - Fade in from bottom
- `.animate-slide-left` - Slide in from left
- `.animate-slide-right` - Slide in from right
- `.animate-scale-in` - Scale in animation
- `.animate-float` - Floating animation

### Component Classes
- `.card-hover` - Card hover effect with lift
- `.glass-morphism` - Glass effect with backdrop blur
- `.gradient-text` - Gradient text effect
- `.gradient-text-accent` - Accent gradient text
- `.section-padding` - Standard section padding (6rem, 4rem on mobile)
- `.text-balance` - Balanced text wrapping

## Usage Examples

### Background Colors
```tsx
<div className="bg-primary">Primary background</div>
<div className="bg-surface">Surface background</div>
<div className="bg-accent">Accent background</div>
```

### Text Colors
```tsx
<h1 className="text-foreground">Foreground text</h1>
<p className="text-text-secondary">Secondary text</p>
<span className="text-accent">Accent text</span>
```

### Borders
```tsx
<div className="border border-border">Border</div>
<div className="border-2 border-foreground">Foreground border</div>
```

### Custom Utilities
```tsx
<section className="section-padding bg-surface">
  <div className="card-hover animate-fade-in">
    <h2 className="gradient-text">Title</h2>
  </div>
</section>
```

## How Tailwind v4 Works

1. **CSS-First Configuration**: Colors and theme are defined in CSS using `@theme`
2. **Automatic Utility Generation**: Tailwind automatically creates utilities from theme variables
3. **No Config File Needed**: Unlike v3, v4 doesn't require `tailwind.config.js`
4. **PostCSS Processing**: `@tailwindcss/postcss` processes the CSS and generates utilities

## Troubleshooting

### Colors Not Working?
- Ensure colors are defined in the `@theme` block
- Check that `@import "tailwindcss"` is at the top of `globals.css`
- Verify `postcss.config.js` uses `@tailwindcss/postcss`

### Custom Utilities Not Working?
- Custom utilities in `@layer utilities` work alongside Tailwind
- Ensure they're defined after `@import "tailwindcss"`

### Build Errors?
- Make sure `@tailwindcss/postcss` is installed: `npm install @tailwindcss/postcss`
- Verify PostCSS config uses the correct plugin name

## Best Practices

1. **Use Theme Colors**: Always use theme colors (`bg-primary`) instead of hardcoded colors
2. **Custom Utilities**: Add reusable patterns in `@layer utilities`
3. **Responsive Design**: Use Tailwind's responsive prefixes (`md:`, `lg:`)
4. **Animation Delays**: Use inline styles for dynamic animation delays

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)

