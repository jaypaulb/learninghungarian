# Tech Stack

## Overview

Learning Hungarian is a static website built with simplicity and accessibility as core principles. The stack prioritizes zero build complexity, free hosting, and minimal dependencies while delivering an interactive learning experience.

## Current Stack

### Static Site Generator

**Jekyll**
- **Version:** Latest stable via GitHub Pages
- **Rationale:** Native GitHub Pages support with zero configuration; Markdown content authoring; Liquid templating for layouts; Proven stability and long-term support
- **Usage:** Processes `index.md` and provides layout templating via `_layouts/default.html`

### Hosting

**GitHub Pages**
- **Rationale:** Free hosting with SSL; Automatic builds on push; Custom domain support; Reliable global CDN; No server maintenance
- **URL:** https://jaypaulb.github.io/learninghungarian/

### CSS Framework

**Tailwind CSS (CDN)**
- **Source:** `https://cdn.tailwindcss.com`
- **Rationale:** Utility-first approach enables rapid styling; No build step required via CDN; Consistent design language; Responsive utilities built-in; Small learning curve for contributors
- **Usage:** All styling via utility classes in HTML

### JavaScript

**Vanilla JavaScript (Inline)**
- **Rationale:** Zero dependencies; No build step; Full browser compatibility; Simpler debugging; Faster page loads; Self-contained lesson files
- **Usage:** Each lesson contains inline `<script>` blocks for interactivity
- **Patterns:** DOM manipulation, event listeners, input validation, score tracking

### Typography

**Inter (Google Fonts)**
- **Source:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap`
- **Weights:** 400 (regular), 700 (bold)
- **Rationale:** Excellent readability; Wide language support including Hungarian diacritics; Clean modern aesthetic

### Design System

**Color Palette:**
- Background: `bg-slate-100`
- Content containers: `bg-white`
- Primary text: `text-slate-700`, `text-slate-600`
- Accent color: `#0f766e` (teal)
- Success: Green indicators
- Error: Red indicators

**Layout:**
- Container: `max-w-3xl mx-auto`
- Responsive breakpoint: `md:` (768px)
- Padding: `p-4 md:p-8`

## Planned Feature Implementations

### Progress Tracking (Phase 2)

**Technology:** localStorage API

**Implementation Approach:**
```javascript
// Data structure
const progressData = {
  lessonProgress: {
    "lesson-1": { completed: true, score: 85, lastAttempt: "2024-01-15" },
    "lesson-2": { completed: true, score: 92, lastAttempt: "2024-01-16" },
    "lesson-3": { completed: false, score: 0, lastAttempt: null }
  },
  currentLesson: "lesson-3",
  totalTimeSpent: 3600, // seconds
  lastVisit: "2024-01-17"
};

// Save progress
localStorage.setItem('hungarianProgress', JSON.stringify(progressData));

// Load progress
const saved = JSON.parse(localStorage.getItem('hungarianProgress'));
```

**Rationale:**
- No backend required
- Persists across browser sessions
- ~5MB storage limit is sufficient
- Works offline
- No user accounts needed

**Limitations:**
- Device-specific (no sync across devices)
- Cleared if user clears browser data
- No backup/export (could add JSON export feature)

### Audio Pronunciation (Phase 3)

**Technology:** HTML5 Audio API with MP3/OGG files

**Implementation Approach:**
```html
<!-- Audio element per word/phrase -->
<button class="audio-btn" data-audio="words/alma.mp3">
  alma (apple) <span class="speaker-icon">speaker</span>
</button>

<script>
document.querySelectorAll('.audio-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const audio = new Audio(btn.dataset.audio);
    audio.play();
  });
});
</script>
```

**File Structure:**
```
audio/
  lessons/
    lesson-01/
      words/
        alma.mp3
        alma.ogg
      phrases/
        jo_napot.mp3
        jo_napot.ogg
```

**Audio Requirements:**
- **Format:** MP3 (primary) + OGG (fallback for older browsers)
- **Quality:** 128kbps mono sufficient for speech
- **Source:** Native Hungarian speaker recordings
- **Naming:** Lowercase, underscores for spaces, Hungarian spelling

**Rationale:**
- Universal browser support
- No streaming service dependencies
- Works offline after initial load
- Simple implementation

**Considerations:**
- File size: ~50KB per word, ~200KB per phrase
- Lazy loading for performance
- Consider audio sprites for common short words

### Spaced Repetition System (Phase 4)

**Technology:** Client-side JavaScript with localStorage

**Algorithm:** Modified SM-2 (SuperMemo 2)

**Implementation Approach:**
```javascript
// Vocabulary item structure
const vocabItem = {
  id: "alma",
  hungarian: "alma",
  english: "apple",
  audioFile: "audio/words/alma.mp3",
  easeFactor: 2.5,  // Starting ease
  interval: 1,       // Days until next review
  repetitions: 0,    // Successful reviews in a row
  nextReview: "2024-01-18",
  lastReview: "2024-01-17"
};

// SM-2 algorithm core
function updateSRS(item, quality) {
  // quality: 0-5 (0=complete fail, 5=perfect)
  if (quality >= 3) {
    if (item.repetitions === 0) {
      item.interval = 1;
    } else if (item.repetitions === 1) {
      item.interval = 6;
    } else {
      item.interval = Math.round(item.interval * item.easeFactor);
    }
    item.repetitions++;
  } else {
    item.repetitions = 0;
    item.interval = 1;
  }

  // Update ease factor
  item.easeFactor = Math.max(1.3,
    item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  item.nextReview = addDays(new Date(), item.interval);
  return item;
}
```

**Data Structure:**
```javascript
const srsData = {
  vocabulary: [...vocabItems],
  grammarPoints: [...grammarItems],
  reviewQueue: ["alma", "ko_szo_no_m", "vagyok"],
  dailyStats: {
    "2024-01-17": { reviewed: 25, correct: 22, newLearned: 5 }
  },
  settings: {
    newCardsPerDay: 10,
    maxReviewsPerDay: 50
  }
};
```

**Features:**
- Daily review session with due items
- New vocabulary introduction limits
- Performance statistics
- Review history tracking

**Rationale:**
- Proven algorithm for long-term retention
- No server required
- User controls their learning pace
- Integrates with existing lesson structure

**Limitations:**
- Complex state management
- localStorage size constraints (~5MB)
- No cross-device sync without backend

## Architecture Decisions

### Why No Build Step

**Decision:** Keep all assets as plain files, no webpack/vite/bundlers

**Rationale:**
- Lower barrier to contribution
- Simpler debugging
- GitHub Pages builds Jekyll only
- CDN handles optimization for CSS/fonts
- Inline JS keeps lessons self-contained

### Why No Backend

**Decision:** Fully static site, no server-side code

**Rationale:**
- Zero hosting cost
- No server maintenance
- Global CDN distribution
- High reliability
- Privacy-friendly (no data collection)

**Trade-offs:**
- No cross-device progress sync
- No user accounts
- No collaborative features
- Limited analytics (GitHub traffic only)

### Why Inline JavaScript

**Decision:** JavaScript embedded in each lesson HTML file

**Rationale:**
- Lessons are self-contained units
- Simpler file structure
- No module bundling needed
- Easy to copy/adapt lessons
- Clear what code belongs to what lesson

**Trade-offs:**
- Some code duplication across lessons
- Harder to update shared patterns
- Consider extracting common utilities if duplication becomes excessive

## Future Considerations

### Potential Enhancements (Not Currently Planned)

- **Service Worker:** For true offline capability
- **IndexedDB:** If localStorage limits become constraining
- **Web Audio API:** For more sophisticated pronunciation practice
- **JSON Data Files:** Extract lesson content from HTML if lesson count grows significantly

### What We Explicitly Avoid

- npm/Node.js dependencies
- JavaScript frameworks (React, Vue, etc.)
- CSS preprocessors (Sass, Less)
- Server-side rendering
- Database backends
- Authentication systems
- Payment processing
