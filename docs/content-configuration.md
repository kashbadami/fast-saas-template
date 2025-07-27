---
title: Content Configuration
description: Customize all website content and branding through simple JSON files
category: Features
order: 5
---

# Content Configuration System

This template uses a centralized content configuration system that allows you to easily update all website content and branding without modifying component code.

## Overview

The content configuration system consists of two main files:
- `src/config/content.json` - All website content, text, and structure
- `src/config/branding.json` - Colors, fonts, and visual styling

## Content Configuration (`content.json`)

### Structure

```json
{
  "meta": {
    "voice": { /* Writing style and tone guidelines */ },
    "purpose": "...",
    "goals": [...],
    "target_audience": "..."
  },
  "brand": {
    "name": "Your Brand",
    "logo": "/path-to-logo.png",
    "tagline": "Your tagline"
  },
  // Section configurations...
}
```

### Key Features

1. **Voice and Tone Settings**
   - Define your brand's writing style
   - Specify tone (professional, casual, etc.)
   - Set perspective (we/our vs you/your)
   - Useful for AI content generation

2. **Rich Text Support**
   - Headlines support multiple parts with styling:
   ```json
   "headline": {
     "parts": [
       { "text": "Build faster with " },
       { "text": "AI", "italic": true, "color": "primary" }
     ]
   }
   ```

3. **Dynamic Content**
   - All text is pulled from the config
   - Easy to A/B test different copy
   - Supports multiple languages (create `content.fr.json`, etc.)

### Updating Content

1. Edit `src/config/content.json`
2. Save the file
3. The changes will be reflected immediately (hot reload in dev)

## Branding Configuration (`branding.json`)

### Structure

```json
{
  "colors": {
    "primary": { /* Color definitions */ },
    "secondary": { /* Color definitions */ },
    "accent": { /* Color definitions */ },
    "destructive": { /* Color definitions */ }
  },
  "fonts": {
    "sans": { /* Font configuration */ },
    "serif": { /* Font configuration */ }
  },
  "radius": { /* Border radius values */ },
  "shadows": { /* Box shadow values */ }
}
```

### Updating Branding

1. Edit `src/config/branding.json`
2. Run the update script:
   ```bash
   npm run update-branding
   ```
3. Restart your development server
4. The script will:
   - Update CSS variables in `globals.css`
   - Generate Tailwind extensions
   - Update font imports

### Color Configuration

Each color includes:
- `name`: Human-readable name
- `hex`: Hex color value
- `rgb`: RGB values
- `hsl`: HSL values
- `tailwind`: Full color palette or reference

Example:
```json
"primary": {
  "name": "orange",
  "hex": "#f97316",
  "tailwind": {
    "50": "#fff7ed",
    "500": "#f97316",
    "900": "#7c2d12"
  }
}
```

## Usage in Components

### Import the configuration

```typescript
import { content, branding } from "~/lib/config";
```

### Use content in your components

```typescript
// Basic usage
<h1>{content.hero.headline}</h1>

// With rich text
import { renderHeadline } from "~/lib/config";
<h1>{renderHeadline(content.hero.headline)}</h1>

// Access nested content
<img src={content.brand.logo} alt={content.brand.name} />
```

### Use branding colors

```typescript
// Get color values
const primaryColor = getColor("primary");

// Use in styles
style={{ color: branding.colors.primary.hex }}
```

## AI Content Generation

The `meta` section in `content.json` is designed to help AI tools understand your brand:

```json
"meta": {
  "voice": {
    "tone": "professional yet approachable",
    "style": "conversational, direct, benefit-focused",
    "perspective": "we/our when referring to the product",
    "personality": "confident, helpful, empowering"
  },
  "purpose": "To help developers build faster",
  "goals": ["Reduce development time", "Provide best practices"],
  "target_audience": "Developers and technical founders"
}
```

You can use this with AI prompts like:
```
Using the voice and tone guidelines in the meta section, 
rewrite the features section to be more engaging.
```

## Best Practices

1. **Keep content DRY** - Use the config for all user-facing text
2. **Version control** - Track changes to content/branding in git
3. **Validate JSON** - Use a JSON validator before committing
4. **Test thoroughly** - Check all pages after content updates
5. **Document changes** - Add comments in the JSON for complex sections

## Extending the System

To add new configurable sections:

1. Add the content structure to `content.json`
2. Update type definitions in `src/lib/config.ts`
3. Import and use in your components
4. Document the new section structure

## Multi-language Support

To add language support:

1. Create `src/config/content.{lang}.json`
2. Update the config loader to detect language
3. Use Next.js i18n routing
4. Switch content based on locale

## Troubleshooting

- **Changes not showing**: Clear Next.js cache (`.next` folder)
- **Type errors**: Run `npm run typecheck` after updating config structure
- **Branding not updating**: Ensure you ran `npm run update-branding`
- **Invalid JSON**: Use a JSON linter to check syntax