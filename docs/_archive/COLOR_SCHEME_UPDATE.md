# AirSquad Color Scheme Update - Yellow to Purple/Blue

## Summary of Changes

The entire color scheme has been transformed from yellow/orange accents to purple/blue tones while maintaining the dark theme aesthetic and AirSquad branding.

## Color Palette Transformation

### Primary Colors

**Before (Yellow/Orange)**
- Primary: `oklch(0.85 0.18 85)` - Bright yellow
- Accent: `oklch(0.7 0.2 45)` - Orange/coral

**After (Purple/Blue)**
- Primary: `oklch(0.65 0.25 285)` - Vibrant purple (Hue: 285°)
- Accent: `oklch(0.7 0.2 250)` - Bright cyan/blue (Hue: 250°)

### Background & Card Colors

**Before**
- Background: `oklch(0.13 0 0)` - Neutral dark

**After**
- Background: `oklch(0.12 0.02 280)` - Dark with subtle purple tint
- Card: `oklch(0.15 0.02 275)` - Dark card with blue-purple tone
- Border: `oklch(0.28 0.03 275)` - Borders with purple undertone

### Light Mode (Admin Panel)

**Before**
- Primary light: `oklch(0.55 0.2 85)` - Light yellow
- Background: `oklch(0.98 0 0)` - Neutral white

**After**
- Primary light: `oklch(0.5 0.25 285)` - Purple
- Background: `oklch(0.98 0.01 270)` - Off-white with subtle blue tint
- Accent light: `oklch(0.55 0.2 250)` - Light blue

## Database Updates

All training type colors in the database have been updated to use the new purple/blue palette:

- **Akrobatyka**: `#8B5CF6` (Violet)
- **Tricking**: `#3B82F6` (Blue)
- **Skoki na ścieżce**: `#06B6D4` (Cyan)
- **ShowDance**: `#A855F7` (Purple)
- **Longboard**: `#6366F1` (Indigo)

## Component Updates

All components are now using CSS custom properties (variables) instead of hardcoded colors:
- **Hero Section**: Purple primary text, blue accents
- **Header**: Purple navigation highlights on hover
- **Training Types Cards**: Purple/blue accent borders and icon highlights
- **Locations Grid**: Purple accent borders
- **CTA Section**: Now uses primary purple background instead of orange
- **Footer**: Purple text links on hover, purple social icons
- **Admin Dashboard**: Purple stat cards and UI elements

## File Changes

### Modified Files
1. `/app/globals.css` - Updated all CSS custom properties with new purple/blue hues
2. `/app/admin/page.tsx` - Updated stat card color from orange to violet
3. Database training_types table - Updated all color values to new palette

### Unchanged
- All component JSX files use CSS variables, so they automatically reflect the new colors
- No hardcoded hex color references found in component files

## Design Consistency

The new purple/blue scheme maintains:
- High contrast against dark backgrounds
- Professional, modern aesthetic
- Accessibility standards maintained
- Responsive design preserved
- All visual hierarchy intact

## Color Values Reference

### CSS Variables Used Throughout
```css
--primary: oklch(0.65 0.25 285)   /* Purple */
--accent: oklch(0.7 0.2 250)      /* Blue */
--background: oklch(0.12 0.02 280) /* Dark purple-tinted */
--secondary: oklch(0.2 0.03 270)   /* Dark blue-tinted */
```

## Visual Impact

The purple/blue color scheme creates:
- A more modern, tech-forward appearance
- Better distinction from typical orange/yellow sports branding
- Unique identity for Air Squad
- Professional and energetic atmosphere
- Improved visual consistency across all UI elements
