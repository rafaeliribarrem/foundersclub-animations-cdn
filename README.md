# FoundersClub Animations CDN

Unified GSAP animation module for FoundersClub Webflow site. Served via jsDelivr CDN.

## Usage

Add these scripts to your Webflow site's custom code (before `</body>` or in Page Settings):

```html
<!-- GSAP + ScrollTrigger -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>

<!-- FoundersClub Animations -->
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/foundersclub-animations-cdn@v1.0.0/foundersclub-animations.js" defer></script>
```

Replace `YOUR_USERNAME` with your GitHub username.

## CDN URLs

### Versioned (recommended for production)
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/foundersclub-animations-cdn@v1.0.0/foundersclub-animations.js
```

### Latest (always pulls from main branch)
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/foundersclub-animations-cdn/foundersclub-animations.js
```

### Minified (auto-minified by jsDelivr)
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/foundersclub-animations-cdn@v1.0.0/foundersclub-animations.min.js
```

## Modules Included

| Module | Data Attribute | Description |
|--------|---------------|-------------|
| EventsSection | `data-events-section` | Interactive events with hover image reveal |
| ScrollTextReveal | `data-scroll-text` | Character-by-character text reveal on scroll |
| CurtainReveal | `data-curtain-wrapper` | Curtain overlay animation |
| HorizontalScroll | `data-horizontal-section` | Horizontal scroll section with cards |
| StaggerAnimations | `data-animate-stagger`, `data-animate-item` | Fade + blur + slide animations |
| HoverCards | `data-hover-card` | Card hover effects |
| ParallaxPolaroids | `data-founders-section` | Parallax image effects |
| ScrollPinSection | `data-scroll-pin` | Pinned image swap on scroll |

## Debug Mode

Enable debug mode to see ScrollTrigger markers:

### Option 1: Data attribute
```html
<html data-gsap-debug>
```

### Option 2: JavaScript
```javascript
window.GSAP_DEBUG = true; // Before script loads
// or
window.GSAPController.setDebug(true); // After script loads
```

## API

The script exposes `window.GSAPController` with these methods:

```javascript
GSAPController.setDebug(true);   // Enable/disable debug mode
GSAPController.refresh();        // Manually refresh ScrollTrigger
GSAPController.destroy();        // Cleanup all animations
```

## Creating a Release

1. Push changes to main branch
2. Create a new release/tag on GitHub (e.g., `v1.0.0`)
3. jsDelivr will automatically cache the new version

## License

Private - FoundersClub

