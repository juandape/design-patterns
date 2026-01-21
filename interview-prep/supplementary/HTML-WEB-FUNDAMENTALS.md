# HTML & Web Fundamentals - EPAM Interview Prep

> **Target**: Senior Full Stack Developer Position
> **Focus**: HTML5, BOM, CSSOM, Accessibility, Responsive Design

---

## Table of Contents

1. [HTML5 Media Elements](#html5-media)
2. [BOM (Browser Object Model)](#bom)
3. [CSSOM (CSS Object Model)](#cssom)
4. [Accessibility (a11y)](#accessibility)
5. [Responsive Design](#responsive-design)
6. [Mobile First vs Desktop First](#mobile-vs-desktop)

---

## HTML5 Media Elements

### Audio Element

```html
<!-- Basic audio -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>

<!-- With attributes -->
<audio
  controls
  autoplay
  loop
  muted
  preload="auto"
>
  <source src="podcast.mp3" type="audio/mpeg">
</audio>
```

**Audio Attributes:**

- `controls` - Show playback controls
- `autoplay` - Start playing automatically (often blocked by browsers)
- `loop` - Repeat playback
- `muted` - Start muted
- `preload` - `none` | `metadata` | `auto`

**JavaScript Audio API:**

```javascript
const audio = document.querySelector('audio');

// Properties
audio.currentTime; // Get/set playback position
audio.duration; // Total duration
audio.volume; // 0.0 to 1.0
audio.playbackRate; // Speed (1.0 = normal)
audio.paused; // Boolean
audio.ended; // Boolean

// Methods
audio.play(); // Returns Promise
audio.pause();
audio.load(); // Reload source

// Events
audio.addEventListener('play', () => console.log('Playing'));
audio.addEventListener('pause', () => console.log('Paused'));
audio.addEventListener('ended', () => console.log('Finished'));
audio.addEventListener('timeupdate', () => {
  console.log(`Current time: ${audio.currentTime}`);
});
audio.addEventListener('loadedmetadata', () => {
  console.log(`Duration: ${audio.duration}`);
});
audio.addEventListener('error', (e) => {
  console.error('Audio error:', e);
});

// Example: Custom audio player
class AudioPlayer {
  constructor(audioElement) {
    this.audio = audioElement;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  seek(time) {
    this.audio.currentTime = time;
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    console.log(`Progress: ${progress.toFixed(2)}%`);
  }
}
```

---

### Video Element

```html
<!-- Basic video -->
<video controls width="640" height="360">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <track
    kind="subtitles"
    src="subtitles-en.vtt"
    srclang="en"
    label="English"
  >
  Your browser does not support the video tag.
</video>

<!-- With poster and attributes -->
<video
  controls
  poster="thumbnail.jpg"
  preload="metadata"
  width="100%"
>
  <source src="movie.mp4" type="video/mp4">
</video>
```

**Video Attributes:**

- `poster` - Image shown before playback
- `width`, `height` - Dimensions
- `muted` - Start muted (required for autoplay in most browsers)
- `playsinline` - Play inline on iOS (not fullscreen)

**JavaScript Video API:**

```javascript
const video = document.querySelector('video');

// Additional video properties
video.videoWidth; // Intrinsic width
video.videoHeight; // Intrinsic height

// Fullscreen API
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

video.addEventListener('fullscreenchange', () => {
  console.log('Fullscreen:', !!document.fullscreenElement);
});

// Picture-in-Picture API
async function togglePiP() {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else {
    await video.requestPictureInPicture();
  }
}

video.addEventListener('enterpictureinpicture', () => {
  console.log('Entered PiP');
});

video.addEventListener('leavepictureinpicture', () => {
  console.log('Left PiP');
});

// Example: Video player with quality selection
class VideoPlayer {
  constructor(videoElement, sources) {
    this.video = videoElement;
    this.sources = sources; // { '720p': 'url', '1080p': 'url' }
    this.currentQuality = '720p';
  }

  changeQuality(quality) {
    const currentTime = this.video.currentTime;
    const wasPaused = this.video.paused;

    this.video.src = this.sources[quality];
    this.video.currentTime = currentTime;

    if (!wasPaused) {
      this.video.play();
    }

    this.currentQuality = quality;
  }

  captureFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0);

    return canvas.toDataURL('image/png');
  }
}
```

---

## BOM (Browser Object Model)

### Window Object

```javascript
// Window dimensions
window.innerWidth; // Viewport width (including scrollbar)
window.innerHeight; // Viewport height
window.outerWidth; // Browser window width
window.outerHeight; // Browser window height

// Screen information
window.screen.width; // Screen width
window.screen.height; // Screen height
window.screen.availWidth; // Available width (excluding taskbar)
window.screen.availHeight; // Available height

// Window position
window.screenX; // Distance from left edge of screen
window.screenY; // Distance from top edge of screen

// Scrolling
window.scrollX; // Horizontal scroll position
window.scrollY; // Vertical scroll position

window.scrollTo(0, 100); // Scroll to position
window.scrollTo({ top: 100, behavior: 'smooth' });

window.scrollBy(0, 50); // Scroll by amount
window.scrollBy({ top: 50, behavior: 'smooth' });

// Open/close windows
const newWindow = window.open('https://example.com', '_blank', 'width=600,height=400');
newWindow.close();

// Dialogs
window.alert('Message');
const confirmed = window.confirm('Are you sure?');
const input = window.prompt('Enter your name:', 'Default');

// Timers
const timeoutId = window.setTimeout(() => {
  console.log('Executed after 1 second');
}, 1000);

const intervalId = window.setInterval(() => {
  console.log('Executed every 1 second');
}, 1000);

window.clearTimeout(timeoutId);
window.clearInterval(intervalId);

// Request Animation Frame (preferred for animations)
function animate() {
  // Animation logic
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Local and Session Storage
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();

sessionStorage.setItem('key', 'value'); // Clears on tab close

// Store objects
localStorage.setItem('user', JSON.stringify({ name: 'John', age: 30 }));
const user = JSON.parse(localStorage.getItem('user'));
```

---

### Location Object

```javascript
// Current URL information
window.location.href; // Full URL
window.location.protocol; // 'http:' or 'https:'
window.location.host; // 'example.com:3000'
window.location.hostname; // 'example.com'
window.location.port; // '3000'
window.location.pathname; // '/path/to/page'
window.location.search; // '?query=string'
window.location.hash; // '#section'

// Navigation
window.location.href = 'https://example.com'; // Navigate
window.location.assign('https://example.com'); // Navigate (same as above)
window.location.replace('https://example.com'); // Navigate (no history entry)
window.location.reload(); // Reload page
window.location.reload(true); // Force reload from server

// Parse query string
const params = new URLSearchParams(window.location.search);
params.get('query'); // Get parameter value
params.has('query'); // Check if parameter exists
params.getAll('tag'); // Get all values for parameter

// Build URL
const url = new URL('https://example.com/path');
url.searchParams.set('page', '2');
url.searchParams.append('tag', 'javascript');
console.log(url.href); // 'https://example.com/path?page=2&tag=javascript'
```

---

### History Object

```javascript
// Navigation
window.history.back(); // Go back
window.history.forward(); // Go forward
window.history.go(-2); // Go back 2 pages
window.history.go(1); // Go forward 1 page

// History API (SPA routing)
window.history.pushState({ page: 1 }, 'Title', '/page/1');
window.history.replaceState({ page: 1 }, 'Title', '/page/1');

// Listen for history changes
window.addEventListener('popstate', (event) => {
  console.log('Location:', window.location.pathname);
  console.log('State:', event.state);
});

// Example: Simple SPA router
class Router {
  constructor(routes) {
    this.routes = routes;

    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });

    this.handleRoute(window.location.pathname);
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute(path);
  }

  handleRoute(path) {
    const route = this.routes[path] || this.routes['*'];
    if (route) {
      route();
    }
  }
}

// Usage
const router = new Router({
  '/': () => console.log('Home page'),
  '/about': () => console.log('About page'),
  '*': () => console.log('404 Not found')
});

// Navigate programmatically
router.navigate('/about');
```

---

### Navigator Object

```javascript
// Browser information
navigator.userAgent; // Browser user agent string
navigator.language; // 'en-US'
navigator.languages; // ['en-US', 'en', 'es']
navigator.platform; // 'MacIntel', 'Win32', etc.
navigator.cookieEnabled; // Boolean

// Online/offline detection
navigator.onLine; // Boolean

window.addEventListener('online', () => {
  console.log('Connection restored');
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
});

// Geolocation API
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  (error) => {
    console.error('Error:', error.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);

// Clipboard API
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted:', text);
  } catch (err) {
    console.error('Failed to paste:', err);
  }
}

// Share API (mobile)
async function share(data) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Title',
        text: 'Description',
        url: 'https://example.com'
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }
}

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
```

---

## CSSOM (CSS Object Model)

### Accessing and Modifying Styles

```javascript
const element = document.querySelector('.box');

// Inline styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.fontSize = '16px';

// CSS properties use camelCase
element.style.borderRadius = '5px';
element.style.marginTop = '10px';

// Get computed styles (includes all CSS, not just inline)
const styles = window.getComputedStyle(element);
styles.color; // 'rgb(255, 0, 0)'
styles.width; // '100px'
styles.getPropertyValue('background-color'); // 'rgb(0, 0, 255)'

// Get pseudo-element styles
const beforeStyles = window.getComputedStyle(element, '::before');
beforeStyles.content; // Content of ::before

// CSS custom properties (CSS variables)
const root = document.documentElement;
root.style.setProperty('--primary-color', '#007bff');
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');

// Remove property
element.style.removeProperty('color');

// Set multiple properties
Object.assign(element.style, {
  color: 'white',
  backgroundColor: 'black',
  padding: '10px'
});
```

---

### Working with Stylesheets

```javascript
// Get all stylesheets
const stylesheets = document.styleSheets;

for (const sheet of stylesheets) {
  console.log('Stylesheet:', sheet.href);

  // Get CSS rules
  try {
    const rules = sheet.cssRules || sheet.rules;

    for (const rule of rules) {
      console.log('Selector:', rule.selectorText);
      console.log('CSS:', rule.cssText);

      // Modify rule
      if (rule.selectorText === '.box') {
        rule.style.color = 'red';
      }
    }
  } catch (e) {
    // Cross-origin stylesheets throw SecurityError
    console.log('Cannot access cross-origin stylesheet');
  }
}

// Add new rule
const sheet = document.styleSheets[0];
sheet.insertRule('.new-class { color: blue; }', sheet.cssRules.length);

// Delete rule
sheet.deleteRule(0);

// Create new stylesheet
const style = document.createElement('style');
style.textContent = `
  .dynamic-class {
    color: green;
    font-size: 18px;
  }
`;
document.head.appendChild(style);
```

---

### CSS Class Manipulation

```javascript
const element = document.querySelector('.box');

// classList API (preferred)
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('visible'); // Add if absent, remove if present
element.classList.toggle('dark-mode', true); // Force add
element.classList.contains('active'); // Boolean
element.classList.replace('old-class', 'new-class');

// Multiple classes
element.classList.add('class1', 'class2', 'class3');
element.classList.remove('class1', 'class2');

// className (older, less convenient)
element.className = 'new-class another-class';
element.className += ' additional-class';
```

---

### Measuring Elements

```javascript
const element = document.querySelector('.box');

// Dimensions
element.offsetWidth; // Width including padding, border, scrollbar
element.offsetHeight; // Height including padding, border, scrollbar
element.clientWidth; // Width including padding (no border, scrollbar)
element.clientHeight; // Height including padding
element.scrollWidth; // Total scrollable width
element.scrollHeight; // Total scrollable height

// Position
element.offsetLeft; // Left position relative to offsetParent
element.offsetTop; // Top position relative to offsetParent
element.offsetParent; // Positioned ancestor

// Bounding rectangle
const rect = element.getBoundingClientRect();
rect.top; // Distance from top of viewport
rect.left; // Distance from left of viewport
rect.bottom; // Distance from top of viewport to bottom of element
rect.right; // Distance from left of viewport to right of element
rect.width; // Width
rect.height; // Height

// Scroll position
element.scrollTop; // Vertical scroll position
element.scrollLeft; // Horizontal scroll position

// Scroll element into view
element.scrollIntoView();
element.scrollIntoView({ behavior: 'smooth', block: 'center' });

// Example: Lazy loading images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}
```

---

## Accessibility (a11y)

### Semantic HTML

```html
<!-- ❌ BAD: Non-semantic -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
<div class="content">
  <div class="article">Content</div>
</div>

<!-- ✅ GOOD: Semantic -->
<header>
  <nav>
    <a href="#home">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>
```

---

### ARIA Attributes

```html
<!-- Role attribute -->
<div role="button" tabindex="0">Click me</div>
<nav role="navigation">...</nav>
<div role="alert">Important message</div>

<!-- ARIA states -->
<button aria-pressed="false">Toggle</button>
<div aria-expanded="true">Expanded content</div>
<input aria-invalid="true" aria-describedby="error">
<span id="error">Invalid email</span>

<!-- ARIA properties -->
<button aria-label="Close dialog">×</button>
<img src="logo.png" alt="Company logo" aria-hidden="true">
<div aria-live="polite">Updates appear here</div>
<input aria-required="true" aria-labelledby="username-label">
<label id="username-label">Username</label>

<!-- Skip navigation -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">...</main>

<!-- Accessible form -->
<form>
  <label for="email">
    Email address
    <span aria-label="required">*</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    aria-required="true"
    aria-describedby="email-help"
  >
  <small id="email-help">We'll never share your email</small>
</form>
```

---

### Keyboard Navigation

```javascript
// Make div focusable and keyboard accessible
const button = document.querySelector('[role="button"]');

button.setAttribute('tabindex', '0'); // Make focusable

button.addEventListener('click', handleClick);
button.addEventListener('keydown', (e) => {
  // Enter or Space activates button
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
});

function handleClick() {
  console.log('Button activated');
}

// Focus management
const dialog = document.querySelector('[role="dialog"]');
const firstFocusable = dialog.querySelector('button');
const lastFocusable = dialog.querySelector('button:last-child');

// Trap focus in dialog
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }

  // Escape closes dialog
  if (e.key === 'Escape') {
    closeDialog();
  }
});

// Focus visible (only show outline on keyboard navigation)
document.addEventListener('mousedown', () => {
  document.body.classList.add('using-mouse');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.remove('using-mouse');
  }
});

/* CSS */
/*
.using-mouse *:focus {
  outline: none;
}
*/
```

---

### Screen Reader Support

```html
<!-- Announce dynamic content -->
<div aria-live="polite" aria-atomic="true">
  <p>Item added to cart</p>
</div>

<!-- aria-live values:
  - off: Don't announce
  - polite: Announce when convenient
  - assertive: Announce immediately
-->

<!-- Loading state -->
<button aria-busy="true" aria-live="polite">
  <span class="spinner" aria-hidden="true"></span>
  Loading...
</button>

<!-- Visually hidden but screen reader accessible -->
<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<button>
  <span class="sr-only">Add to cart</span>
  <svg aria-hidden="true">...</svg>
</button>
```

---

## Responsive Design

### Responsive vs Adaptive Design

```
Responsive Design:
- Fluid layouts (%, vw, vh, fr)
- Flexible images
- Media queries
- One codebase for all devices
- Content reflows smoothly

Adaptive Design:
- Fixed breakpoints
- Different layouts for specific sizes
- May serve different HTML/CSS
- Optimized for specific devices
- More control over each layout
```

---

### Media Queries

```css
/* Mobile First (recommended) */
/* Base styles for mobile */
.container {
  padding: 10px;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 20px;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .container {
    font-size: 18px;
  }
}

/* Desktop First */
/* Base styles for desktop */
.container {
  padding: 30px;
  font-size: 18px;
}

/* Tablet and down */
@media (max-width: 1023px) {
  .container {
    padding: 20px;
    font-size: 16px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .container {
    padding: 10px;
    font-size: 14px;
  }
}

/* Orientation */
@media (orientation: portrait) {
  .sidebar {
    display: none;
  }
}

@media (orientation: landscape) {
  .sidebar {
    display: block;
  }
}

/* Feature queries */
@media (hover: hover) {
  .button:hover {
    background: blue;
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #ffffff;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none;
  }
}
```

---

### Responsive Units

```css
/* Relative units */
.text {
  font-size: 1rem; /* Relative to root font-size */
  padding: 2em; /* Relative to element's font-size */
}

/* Viewport units */
.hero {
  height: 100vh; /* 100% of viewport height */
  width: 100vw; /* 100% of viewport width */
  font-size: 5vmin; /* 5% of smaller viewport dimension */
  padding: 2vmax; /* 2% of larger viewport dimension */
}

/* Calculated values */
.container {
  width: calc(100% - 40px);
  font-size: clamp(14px, 2vw, 20px); /* Min, preferred, max */
  padding: min(5vw, 40px); /* Use smaller value */
  margin: max(20px, 2vw); /* Use larger value */
}

/* CSS Grid responsive */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Flexbox responsive */
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.flex-item {
  flex: 1 1 300px; /* Grow, shrink, basis */
}
```

---

### Responsive Images

```html
<!-- srcset for different sizes -->
<img
  src="image-400.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  alt="Responsive image"
>

<!-- Picture element for art direction -->
<picture>
  <source media="(min-width: 1024px)" srcset="desktop.jpg">
  <source media="(min-width: 768px)" srcset="tablet.jpg">
  <img src="mobile.jpg" alt="Responsive image">
</picture>

<!-- Modern image formats with fallback -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Image">
</picture>
```

---

### Mobile First vs Desktop First

**Mobile First Approach (Recommended):**

```css
/* ✅ Mobile First - Start with mobile, enhance for desktop */

/* Base (mobile) styles */
.container {
  width: 100%;
  padding: 15px;
}

.navigation {
  display: none; /* Hidden on mobile */
}

.hamburger {
  display: block;
}

/* Progressively enhance for larger screens */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }

  .navigation {
    display: flex;
  }

  .hamburger {
    display: none;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
```

**Advantages:**

- Better performance (mobile loads less CSS)
- Forces prioritization of content
- Easier to enhance than strip down
- Aligns with mobile-first indexing (SEO)

**Desktop First Approach:**

```css
/* ❌ Desktop First - Start with desktop, degrade for mobile */

/* Base (desktop) styles */
.container {
  max-width: 1200px;
  padding: 40px;
}

.sidebar {
  width: 25%;
  float: left;
}

/* Remove/hide for mobile */
@media (max-width: 767px) {
  .container {
    padding: 15px;
  }

  .sidebar {
    display: none; /* Loaded but hidden - waste */
  }
}
```

**Disadvantages:**

- Mobile loads unnecessary CSS
- Harder to remove features than add
- Not aligned with mobile usage trends

---

## Interview Tips

### Common Questions

**Q: What's the difference between responsive and adaptive design?**
A: Responsive uses fluid grids and flexible layouts that adapt to any screen size. Adaptive uses fixed layouts for specific breakpoints. Responsive is one codebase, adaptive may have multiple layouts.

**Q: Mobile first vs desktop first?**
A: Mobile first starts with mobile styles and enhances for larger screens using min-width media queries. It's better for performance, forces content prioritization, and aligns with mobile usage trends.

**Q: How do you make a website accessible?**
A: Use semantic HTML, ARIA attributes where needed, ensure keyboard navigation, provide text alternatives (alt, labels), maintain color contrast, support screen readers, and test with accessibility tools.

**Q: What is the BOM?**
A: Browser Object Model - the API for interacting with the browser outside of the document (window, navigator, location, history, screen, localStorage, etc.)

**Q: What is the CSSOM?**
A: CSS Object Model - JavaScript API for reading and manipulating CSS (getComputedStyle, styleSheets, classList, etc.)

Good luck! 🚀
