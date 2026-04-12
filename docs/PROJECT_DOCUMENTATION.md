# Inventory Management System Documentation

## Overview

This project is a React + Vite Inventory Management System with Supabase for:
- Authentication
- PostgreSQL database

## Tech Stack

- React (Vite)
- Plain CSS
- Supabase (`@supabase/supabase-js`)


## Setup

1. Install dependencies:
   - `npm install`
2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set all required `VITE_` variables
3. Run database schema:
   - Open Supabase SQL Editor
   - Run `database/schema.sql`
4. Start development server:
   - `npm run dev`

## Environment Variables

Use the values below as placeholders in `.env`:

```env
VITE_SUPABASE_URL=https://iskygnzlixhmtslfcobr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3lnbnpsaXhobXRzbGZjb2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NzUwMDIsImV4cCI6MjA5MTU1MTAwMn0.aveWppalbTkkn58JMQkLiU-GhnPBC_QIozi6OV2RHgk

```

## Credentials
### Gmail

```text
GMAIL_EMAIL=inventorymanagement40@gmail.com
GMAIL_PASSWORD=uHR9B9D0>#@1
```

### Supabase

```text
SUPABASE_PASSWORD=>d18BQR285zZ
```