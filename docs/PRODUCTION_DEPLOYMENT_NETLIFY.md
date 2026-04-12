# Netlify Production Deployment Guide

This document explains how to deploy this Vite + React app to Netlify for production and ensure client-side routes work on page refresh.

## 1) Prerequisites

- Netlify account
- GitHub/GitLab/Bitbucket repository connected to Netlify
- All required `VITE_` environment variables ready

## 2) Build Configuration

In Netlify site settings, use:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20` (recommended)

## 3) Environment Variables

Add your production environment variables in:

`Site configuration -> Environment variables`

For this project, configure at minimum:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Important:
- Do not commit secrets in source files.
- Keep production values only in Netlify environment variables.

## 4) SPA Reload/Deep-Link Fix

This project uses React Router (`BrowserRouter`), so direct reloads on routes like `/login` must be rewritten to `index.html`.

The fix is included in:

- `public/_redirects`

Rule:

`/* /index.html 200`

Netlify applies this at deploy time, preventing 404 errors on refresh for client-side routes.

## 5) Deploy Steps

1. Push your branch to the remote repository.
2. In Netlify, create/import the site from your repository.
3. Confirm build settings from section 2.
4. Add environment variables from section 3.
5. Trigger deploy.
6. Open deploy URL and validate routes.

## 6) Post-Deploy Validation

- App loads from `/`
- Directly open a nested route (example: `/login`)
- Refresh nested route page (should not return 404)
- Verify authentication and Supabase data access in production

## 7) Optional: Custom Domain

1. Go to `Domain management` in Netlify.
2. Add your domain.
3. Configure DNS records as instructed by Netlify.
4. Wait for SSL certificate provisioning.
