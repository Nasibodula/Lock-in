# Lock-in

React (Vite) habit tracker, installable on a phone as a PWA.

## Run
    npm install
    npm run dev          # http://localhost:5173

## Build and host
    npm run build        # output in dist/
Upload `dist/` to Netlify, Vercel or GitHub Pages (must be served over HTTPS).

## Install on phone
Open the hosted URL in Chrome (Android) or Safari (iOS) and choose Install app / Add to Home Screen.

## Structure
- src/lib.js        data, dates, streak logic, localStorage
- src/App.jsx       sidebar and view switching
- src/Dashboard.jsx, Tracker.jsx, Settings.jsx
- src/styles.css    all styling
- vite.config.js    PWA manifest (name, colors, icons)
