# STEP TECH

Online electronics shop built with Angular 21. It is a front-end clone of the STEP Academy demo shop, built for learning: authentication, product catalog, cart, favorites, profile, product reviews and an AI shopping assistant.

Live demo: https://secreta77.github.io/Tech_Shop-4.0/

## Features

- Sign in, register, email verification, forgot and reset password (Signal Forms)
- Catalog with URL-driven filters, search, sorting, pagination and loading skeletons
- Product page with gallery, tabs (description, specifications, reviews) and related products
- Reviews: rating summary, write and edit your own review
- Cart (slide-in drawer and full page) with quantity editing and checkout
- Favorites with optimistic updates
- Profile area: personal information, change password, delete account
- Chatbot: a floating assistant that can search products, manage the cart and favorites and place an order after confirmation

## Tech stack

- Angular 21: standalone components, zoneless, OnPush, signals, new control flow
- Signal Forms (experimental) for all forms
- RxJS for HTTP and async flows (`switchMap`, `mergeMap`, `exhaustMap`, `forkJoin`)
- SCSS with shared design tokens, Bootstrap Icons
- Cloudflare Worker (`chatbot-proxy/`) as a small proxy for the chatbot

## Project structure

```
src/app
  core/        interceptors, guards, shared services and models
  layout/      header, footer, toast container
  shared/      reusable dumb components
  features/    auth, home, products, categories, cart, favorites, profile, reviews, chatbot
               each feature has: pages (smart), components (dumb), models, data-access (services)
chatbot-proxy/ Cloudflare Worker that forwards chat messages to the AI model
```

## Run locally

```bash
npm install
ng serve
```

Open http://localhost:4200/. Use port 4200: the chatbot proxy only accepts requests from `http://localhost:4200` and from the live GitHub Pages site.

The shop API address and key are in `src/environments/environment.ts`, so no extra setup is needed.

## Chatbot

The chatbot sends messages to a Cloudflare Worker (`chatbot-proxy/worker.js`), which adds the secret API key and forwards them to the model. The key is stored as a Worker secret, never in the repository. The address of the Worker is `chatProxyUrl` in `src/environments/environment.ts`.

## Deployment

Every push to `main` builds the app and publishes it to GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, Pages must use **GitHub Actions** as the source.

## Scripts

| Command | What it does |
| --- | --- |
| `ng serve` | Development server on port 4200 |
| `ng build` | Production build into `dist/` |
| `ng test` | Unit tests |
