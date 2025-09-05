# CSS Organization - Portfolio Project

## File Structure

### Global Styles
- **`src/App.css`** - Global styles, animations, navigation, and layout containers
  - Global keyframes (@keyframes glow, pulse, scanline, etc.)
  - Global layout (.portfolio-container, body styles)
  - Navigation styles (.hamburger-menu, .nav-menu, .menu-overlay)
  - Responsive design for navigation

### Page-Specific Styles
- **`src/components/Home.css`** - Home page specific styles
  - .home-container and home layout
  - Scanline effects (.scanline-layer, .scanline.blue, .scanline.cyan)
  - Home content sections (.showcase, .about-section, .work-experience, .additional-awards)
  - Home-specific responsive design

- **`src/components/Contact.css`** - Contact page specific styles
  - .contact-section layout
  - Contact-specific animations (float, contactGlow)
  - Contact form styling
  - Contact page responsive design

### Shared Components
- **`src/components/Components.css`** - Reusable component styles
  - Card components (.about-card, .awards-card, .game-card, .experience-card, .contact-card)
  - Button components (.play-preview-btn, .submit-btn, .close-modal)
  - Modal components (.video-modal)
  - Form components (.contact-form, .form-group)
  - Grid components (.slices-grid, .slice)
  - Shared responsive design

## Import Structure

### App.js
```javascript
import './App.css'; // Global styles only
```

### Home.js
```javascript
import './Home.css';      // Home page styles
import './Components.css'; // Shared component styles
```

### Contact.js
```javascript
import './Contact.css';    // Contact page styles
import './Components.css'; // Shared component styles
```

### Navigation.js
```javascript
// Uses navigation styles from App.css (no additional imports needed)
```

## Benefits of This Organization

1. **Separation of Concerns**: Each file has a specific purpose
2. **Maintainability**: Easy to find and modify styles for specific features
3. **Reusability**: Shared components can be easily reused across pages
4. **Performance**: Only load the CSS needed for each component
5. **Scalability**: Easy to add new pages or components without bloating existing files

## Backup

- **`src/App.css.backup`** - Backup of the original monolithic CSS file

## File Sizes (Approximate)
- App.css: ~260 lines (was ~1500 lines)
- Home.css: ~250 lines
- Contact.css: ~180 lines  
- Components.css: ~350 lines
- **Total: ~1040 lines** (down from ~1500 lines after removing duplicates and organizing)

## Next Steps

If you need to add new features:
1. **New page**: Create a new `.css` file in `/components/` and import `Components.css`
2. **New global animation**: Add to `App.css`
3. **New shared component**: Add to `Components.css`
4. **Page-specific feature**: Add to the appropriate page's CSS file
