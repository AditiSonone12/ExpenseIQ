# 💰 ExpenseIQ — Smart Expense Tracker

> A sleek, fully client-side expense tracker built with **Vanilla JavaScript**, **HTML5**, and **CSS3** — no frameworks, no dependencies, no backend required.

![ExpenseIQ Preview](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square) ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

- **Add / Edit / Delete** expenses with title, amount, category, date, and optional note
- **4 Summary Cards** — Total Spent, This Month, Top Category, Daily Average
- **Animated Donut Chart** — Category breakdown drawn on HTML5 Canvas
- **Monthly Trend Bar Chart** — Visualize spending across all 12 months
- **Filter & Sort** — Filter by category, sort by date or amount
- **Dark / Light Mode** — Toggle with persistent preference saved to localStorage
- **Fully Responsive** — Works on mobile, tablet, and desktop
- **localStorage Persistence** — Data survives page refreshes with no backend
- **Input Validation** — Clear inline error messages on every field
- **Toast Notifications** — Feedback on add, edit, and delete actions
- **Keyboard Accessible** — Enter to save, Escape to close modal

---

## 📁 Project Structure

```
expense-tracker/
├── index.html       # App markup — header, cards, charts, modal
├── style.css        # All styles — tokens, layout, animations, dark mode
├── script.js        # All logic — CRUD, charts, filters, localStorage
└── README.md        # You are here
```

---

## 🚀 Getting Started

### Option 1 — Open directly
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/expense-tracker.git

# Navigate into the folder
cd expense-tracker

# Open in your browser
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

### Option 2 — Use Live Server (VS Code)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. App opens at `http://127.0.0.1:5500`

### Option 3 — Deploy to GitHub Pages
1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your app will be live at `https://YOUR_USERNAME.github.io/expense-tracker`

---

## 🧩 Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic structure, Canvas element, ARIA accessibility |
| **CSS3** | Custom properties (tokens), Grid, Flexbox, animations |
| **Vanilla JavaScript (ES6+)** | DOM manipulation, Canvas API, localStorage |
| **Google Fonts** | Inter (UI) + JetBrains Mono (numbers) |

> **Zero dependencies** — no npm, no build step, no frameworks.

---

## 📊 Categories Supported

| Emoji | Category | Emoji | Category |
|---|---|---|---|
| 🍔 | Food & Dining | 💊 | Health & Medical |
| 🚗 | Transport | 📚 | Education |
| 🛍 | Shopping | ⚡ | Utilities |
| 🎬 | Entertainment | 🏠 | Rent & Housing |
| 🔖 | Other | | |

---

## 💡 Key Concepts Demonstrated

- **DOM Manipulation** — Dynamic rendering of lists, charts, and cards
- **HTML5 Canvas API** — Custom donut chart drawn with arcs and paths
- **localStorage** — Client-side data persistence across sessions
- **CSS Custom Properties** — Design token system powering dark/light theming
- **Event Delegation & Listeners** — Modal, keyboard shortcuts, filter/sort
- **Form Validation** — Client-side validation with error state styling
- **Responsive Design** — CSS Grid layout that adapts from mobile to desktop
- **ES6+ Features** — Arrow functions, destructuring, template literals, spread

---

## 📸 Screenshots

> _Add screenshots here after deployment. Recommended: one light mode, one dark mode._

---

## 🔮 Future Improvements

- [ ] Budget limits per category with overspend alerts
- [ ] CSV / PDF export of transaction history
- [ ] Recurring expense support
- [ ] Multi-currency support
- [ ] PWA support (installable, offline-ready)
- [ ] Chart.js integration for richer visualizations

---

## 👩‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [linkedin.com/in/YOUR_PROFILE](https://linkedin.com/in/YOUR_PROFILE)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built as a portfolio project to demonstrate front-end development skills — DOM manipulation, Canvas API, responsive design, and clean vanilla JS architecture.
