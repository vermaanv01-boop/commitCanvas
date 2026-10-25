# CommitCanvas

**GitHub Developer Analytics and Visualization Tool**

An editorial data studio with experimental typography and a structured Swiss-style grid. Built with vanilla HTML, CSS, and JavaScript.

## Design Direction

- **Editorial aesthetic**: Minimal navigation, large editorial hero, intentional whitespace
- **Typography**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) for headings, [DM Sans](https://fonts.google.com/specimen/DM+Sans) for body
- **Color palette**: Background `#F7F5F0`, text `#20201E`, accent `#C65D3B`, secondary accent `#85865B`, borders `#DAD7D0`
- **Layout**: Asymmetric editorial composition with thin borders and restrained accents

## Features

- **Minimal navigation** with CommitCanvas branding
- **Editorial hero**: "Your code. Your story."
- **GitHub username search form** with client-side validation
- **Four-statistic analytics overview** (repositories, stars, followers, following)
- **Programming language distribution chart placeholder**
- **Contribution activity heatmap placeholder**
- **Repository leaderboard** with language, stars, and forks columns
- **Recent public activity section**
- **Minimal footer** with GitHub API attribution note

## Technical Details

- **Semantic HTML5** with proper ARIA labels and roles
- **Modular CSS** with CSS custom properties for theming
- **Vanilla JavaScript** with form validation and UI state management
- **Responsive design** for desktop and mobile
- **Accessible** form controls with focus states, skip link, and ARIA live regions
- **No dependencies** - pure HTML, CSS, and JavaScript
- **GitHub API integration not yet implemented** - all data sections use placeholders

## How to Run

1. Open `index.html` directly in your web browser
2. Or serve with a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with http-server)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000`

## Project Structure

```
commit-canvaas/
├── index.html    # Main HTML structure
├── style.css     # Styles and layout
├── script.js     # Form logic and interactions
└── README.md     # This file
```

## Notes

- All statistic cards, charts, and lists show placeholders until GitHub API integration is added
- The search form validates username format but does not fetch data
- Design follows editorial/data studio principles with no gradients, glassmorphism, or neon effects
- Built for future extensibility while maintaining a distinctive, production-quality aesthetic
