# 🚀 GoEurorail - UI/UX Enhancement Plan

## 🎯 Goal
Redesign modal windows and user interactions to feel smoother, more integrated, and consistent with the overall flow of the website. Inspired by platforms like [Stippl.io](https://www.stippl.io), the experience should feel like moving through layers of a single app — not disjointed popup windows.

---

## 🧩 Design Strategy

### 1. Unified Layered Modals
- Replace default popups with **slide-in panels** or **bottom sheets**.
- Panels should feel **stacked**, with a subtle background blur/dim on the previous layer.
- Allow **easy back navigation** between layers (like a breadcrumb or back arrow).

### 2. Transitions & Animations
- Use **Framer Motion** for:
  - Enter/exit animations on panels.
  - Smooth transitions when switching between views.
- Animate field appearances (e.g., tag buttons that expand into inputs).
- Apply transition delays to maintain natural pacing.

### 3. Context Awareness
- When viewing or editing a segment (like Vienna → Ljubljana):
  - Show the full trip context in the background.
  - Don’t isolate the user in the modal — keep anchoring info visible.

---

## ⚙️ Technical Implementation Plan

### ✅ Setup
- Install Framer Motion:
  ```bash
  npm install framer-motion