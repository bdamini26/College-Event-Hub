# PSCMRCET College Event Management System

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Prerequisites](#5-prerequisites)
6. [Step-by-Step Setup Guide](#6-step-by-step-setup-guide)
7. [Running the Application](#7-running-the-application)
8. [Using the System](#8-using-the-system)
9. [Admin Panel Guide](#9-admin-panel-guide)
10. [Student Registration Guide](#10-student-registration-guide)
11. [API Reference](#11-api-reference)
12. [Database Schema](#12-database-schema)
13. [Deployment](#13-deployment)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Project Overview

The **PSCMR-CET College Event Management System** is a full-featured web application designed to help students and faculty at Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology manage, discover, and register for college events.

The system supports:
- Browsing upcoming, ongoing, and past events
- Student registration for events
- Admin panel for creating and managing events
- Event categories (Technical, Cultural, Sports, Management, Workshop, Seminar)
- Photo gallery of past events
- Real-time registration tracking

---

## 2. Features

### For Students
- **Browse Events** — View all events with filters by category and status
- **Search Events** — Search for events by name
- **Event Details** — See full details including venue, date, prizes, and contact info
- **Register Online** — Register for events with your college details
- **View Gallery** — Browse photos from past events

### For Administrators
- **Create Events** — Add new events with full details
- **View All Events** — Dashboard with all events at a glance
- **View Registrations** — See who has registered for each event
- **Delete Events** — Remove cancelled or outdated events
- **Statistics** — See total events, upcoming events, and total registrations

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Build Tool | Vite |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| API | REST API (OpenAPI 3.1 spec) |
| Package Manager | pnpm (monorepo) |

---

## 4. Project Structure

```
pscmr-ems/
├── artifacts/
│   ├── college-events/          # Frontend React app
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   │   │   ├── Footer.tsx        # Footer with college info
│   │   │   │   │   └── AppLayout.tsx     # Shared page layout
│   │   │   │   └── ui/
│   │   │   │       └── EventCard.tsx     # Reusable event card
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx              # Homepage with hero + stats
│   │   │   │   ├── Events.tsx            # Events listing with filters
│   │   │   │   ├── EventDetail.tsx       # Event detail + registration form
│   │   │   │   ├── Gallery.tsx           # Photo gallery
│   │   │   │   ├── About.tsx             # About the college
│   │   │   │   └── Admin.tsx             # Admin dashboard
│   │   │   ├── App.tsx                   # Main app with routing
│   │   │   └── index.css                 # Global styles + theme
│   │   └── public/
│   │       └── images/                   # Static images
│   │
│   └── api-server/              # Backend Express API
│       └── src/
│           └── routes/
│               ├── events.ts             # Events CRUD routes
│               ├── registrations.ts      # Registration routes
│               ├── categories.ts         # Categories list
│               └── gallery.ts            # Gallery images
│
├── lib/
│   ├── api-spec/
│   │   └── openapi.yaml                  # OpenAPI 3.1 specification
│   ├── api-client-react/                 # Auto-generated React Query hooks
│   ├── api-zod/                          # Auto-generated Zod schemas
│   └── db/
│       └── src/schema/
│           ├── events.ts                 # Events table schema
│           └── registrations.ts          # Registrations table schema
│
└── README.md                             # This file
```

---

## 5. Prerequisites

Before setting up the project, make sure you have the following installed:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **pnpm** (version 8 or higher)
   - Install via npm: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

3. **PostgreSQL** (version 14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Or use a cloud service like Supabase, Railway, or Neon

4. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

---

## 6. Step-by-Step Setup Guide

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd pscmr-event-management
```

### Step 2: Install Dependencies

Install all dependencies for the entire monorepo from the root directory:

```bash
pnpm install
```

This command installs dependencies for all packages in the workspace (frontend, backend, libraries).

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Database connection string
DATABASE_URL=postgresql://username:password@localhost:5432/pscmr_events

# Individual PostgreSQL settings (alternative to DATABASE_URL)
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_username
PGPASSWORD=your_db_password
PGDATABASE=pscmr_events

# Server port (default: 8080)
PORT=8080
```

> **Note for Replit users:** The DATABASE_URL is automatically set when you provision a PostgreSQL database through Replit.

### Step 4: Set Up the Database

#### 4a. Create the Database

Connect to PostgreSQL and create the database:

```bash
psql -U postgres
```

Inside the PostgreSQL prompt:

```sql
CREATE DATABASE pscmr_events;
\q
```

#### 4b. Push the Database Schema

Run the following command to create all the necessary tables:

```bash
pnpm --filter @workspace/db run push
```

You should see output like:
```
[✓] Pulling schema from database...
[✓] Changes applied
```

This creates the following tables:
- `events` — Stores all event information
- `registrations` — Stores student registrations

#### 4c. Verify Database Tables

Connect to the database and verify:

```bash
psql -U your_username -d pscmr_events
\dt
```

You should see:
```
         List of relations
 Schema |     Name      | Type  
--------+---------------+-------
 public | events        | table 
 public | registrations | table 
```

### Step 5: Generate API Client Code

This step generates TypeScript types and React hooks from the OpenAPI specification:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Output:
```
🎉 api-client-react - Your OpenAPI spec has been converted into ready to use orval!
🎉 zod - Your OpenAPI spec has been converted into ready to use orval!
```

### Step 6: Build the API Server

```bash
pnpm --filter @workspace/api-server run build
```

### Step 7: Seed Sample Data (Optional but Recommended)

To add sample events for testing, you can run the following SQL:

```bash
psql -U your_username -d pscmr_events -f seed.sql
```

Or insert events manually through the Admin Panel after starting the application.

---

## 7. Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1 — Start the Backend API Server:**

```bash
pnpm --filter @workspace/api-server run dev
```

Expected output:
```
> @workspace/api-server@0.0.0 dev
> export NODE_ENV=development && pnpm run build && pnpm run start
Server listening on port 8080
```

**Terminal 2 — Start the Frontend:**

```bash
pnpm --filter @workspace/college-events run dev
```

Expected output:
```
  VITE v7.x.x  ready in 576 ms
  ➜  Local:   http://localhost:3000/
```

### Access the Application

Open your browser and go to:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/api/healthz

### Production Mode

To run in production:

```bash
# Build everything
pnpm run build

# Start the API server
pnpm --filter @workspace/api-server run start
```

For the frontend, serve the built static files from `artifacts/college-events/dist/` using any web server (nginx, Apache, etc.).

---

## 8. Using the System

### Navigation

The application has the following pages accessible from the navigation bar:

| Page | URL | Description |
|---|---|---|
| Home | `/` | Homepage with hero section, statistics, and featured events |
| Events | `/events` | Browse all events with filters |
| Gallery | `/gallery` | Photo gallery of past events |
| About | `/about` | College information and event committee |
| Admin | `/admin` | Admin dashboard for managing events |

### Filtering Events

On the Events page, you can filter events by:
- **Category:** Technical, Cultural, Sports, Management, Workshop, Seminar
- **Status:** Upcoming, Ongoing, Past
- **Search:** Type any keyword to search event names

---

## 9. Admin Panel Guide

The Admin Panel is accessible at `/admin` without any login (for demo purposes — add authentication for production use).

### Creating a New Event

1. Go to `/admin`
2. Click the **"+ Create Event"** button
3. Fill in the event form:
   - **Title*** — Name of the event (e.g., "Code Sprint 2026")
   - **Description*** — Detailed description of the event
   - **Category*** — Select from: Technical, Cultural, Sports, Management, Workshop, Seminar
   - **Venue*** — Location within the campus (e.g., "Computer Lab Block A")
   - **Date*** — Event date (use calendar picker)
   - **Time*** — Event start time (e.g., "09:00 AM")
   - **Max Participants*** — Maximum number of students allowed
   - **Organizer*** — Organizing department or club name
   - **Contact Email*** — Email address for queries
   - **Contact Phone*** — Phone number for queries
   - **Entry Fee** — Cost to participate (leave blank or enter "Free")
   - **Prizes** — Prize details (e.g., "First Prize: ₹10,000")
4. Click **"Create Event"** to publish the event

### Viewing Registrations

1. On the Admin page, find the event you want to check
2. Click the **"View Registrations"** button
3. A panel will open showing all registered students with their:
   - Student Name
   - Roll Number
   - Branch and Year
   - Email and Phone

### Deleting an Event

1. Find the event on the Admin dashboard
2. Click the **"Delete"** (trash icon) button
3. Confirm the deletion
4. All registrations for that event will also be removed

---

## 10. Student Registration Guide

### How to Register for an Event

1. Go to the **Events** page (`/events`)
2. Find the event you want to register for
3. Click on the event card to open event details
4. Scroll down to the **Registration Form**
5. Fill in your details:
   - **Student Name*** — Your full name
   - **Roll Number*** — Your college roll number (e.g., 22A51A0501)
   - **Branch*** — Your branch (CSE, ECE, EEE, MECH, CIVIL, IT)
   - **Year*** — Your current year (1st, 2nd, 3rd, 4th)
   - **Email*** — Your email address
   - **Phone*** — Your 10-digit mobile number
6. Click **"Register Now"**
7. You will see a success notification if registration is successful

### Registration Rules

- You can only register if the event has available spots
- Events that are full will show "Event Full" status
- Past events do not allow registration
- You need a valid roll number to register

---

## 11. API Reference

The backend provides a RESTful API. Base URL: `/api`

### Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Get all events (supports `?category=`, `?status=`, `?search=`) |
| GET | `/api/events/:id` | Get a specific event by ID |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/:id` | Update an existing event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/:id/registrations` | Get all registrations for an event |

### Registrations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/registrations` | Register a student for an event |
| DELETE | `/api/registrations/:id` | Cancel a registration |

### Other Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all event categories |
| GET | `/api/gallery` | Get gallery images |
| GET | `/api/stats` | Get overall statistics |
| GET | `/api/healthz` | Server health check |

### Example API Calls

**Get upcoming events:**
```bash
curl http://localhost:8080/api/events?status=upcoming
```

**Create an event:**
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hackathon 2026",
    "description": "24-hour coding competition",
    "category": "Technical",
    "venue": "IT Lab, Block C",
    "date": "2026-05-15",
    "time": "09:00 AM",
    "maxParticipants": 100,
    "organizer": "CSE Department",
    "contactEmail": "cse@pscmrce.ac.in",
    "contactPhone": "9848012345",
    "prizes": "First Prize: Rs. 20,000",
    "entryFee": "Free"
  }'
```

**Register for an event:**
```bash
curl -X POST http://localhost:8080/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 1,
    "studentName": "Ravi Kumar",
    "rollNumber": "22A51A0501",
    "branch": "CSE",
    "year": "3rd",
    "email": "ravi@example.com",
    "phone": "9876543210"
  }'
```

---

## 12. Database Schema

### Events Table

| Column | Type | Description |
|---|---|---|
| id | SERIAL (auto) | Unique event ID |
| title | TEXT | Event name |
| description | TEXT | Full event description |
| category | TEXT | Event category |
| venue | TEXT | Event location |
| date | TEXT | Event date (YYYY-MM-DD) |
| time | TEXT | Event start time |
| max_participants | INTEGER | Maximum allowed registrations |
| registered_count | INTEGER | Current registration count |
| organizer | TEXT | Organizing department/club |
| contact_email | TEXT | Contact email |
| contact_phone | TEXT | Contact phone number |
| status | TEXT | Event status: upcoming/ongoing/past |
| image_url | TEXT | Optional event image URL |
| prizes | TEXT | Prize information |
| entry_fee | TEXT | Participation fee |
| created_at | TIMESTAMP | Record creation time |

### Registrations Table

| Column | Type | Description |
|---|---|---|
| id | SERIAL (auto) | Unique registration ID |
| event_id | INTEGER | Foreign key to events.id |
| student_name | TEXT | Student's full name |
| roll_number | TEXT | College roll number |
| branch | TEXT | Engineering branch |
| year | TEXT | Current year of study |
| email | TEXT | Student email |
| phone | TEXT | Student phone number |
| created_at | TIMESTAMP | Registration timestamp |

---

## 13. Deployment

### Deploying on Replit

1. Make sure all code is working in development
2. Click the **"Publish"** button in the Replit interface
3. Replit will automatically:
   - Build the frontend to static files
   - Deploy the API server
   - Configure the database
   - Set up HTTPS

### Deploying on a VPS (Linux Server)

**Step 1: Set up the server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

**Step 2: Clone and configure**
```bash
git clone <your-repo-url> /var/www/pscmr-ems
cd /var/www/pscmr-ems
pnpm install
```

**Step 3: Set up environment**
```bash
cp .env.example .env
nano .env  # Fill in your DATABASE_URL and other variables
```

**Step 4: Build and start**
```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-spec run codegen
pnpm run build
pnpm --filter @workspace/api-server run start
```

**Step 5: Set up nginx (optional)**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve frontend
    root /var/www/pscmr-ems/artifacts/college-events/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Step 6: Use PM2 to keep the server running**
```bash
npm install -g pm2
pm2 start "pnpm --filter @workspace/api-server run start" --name pscmr-api
pm2 startup
pm2 save
```

---

## 14. Troubleshooting

### Common Issues and Solutions

#### Issue: Database connection failed
**Symptom:** Server shows `Error: DATABASE_URL must be set`
**Solution:**
1. Check your `.env` file has `DATABASE_URL` set correctly
2. Verify PostgreSQL is running: `sudo systemctl status postgresql`
3. Test the connection: `psql $DATABASE_URL`

#### Issue: `pnpm install` fails
**Symptom:** Package installation errors
**Solution:**
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

#### Issue: Frontend shows blank page
**Symptom:** White screen when opening the app
**Solution:**
1. Check browser console for errors (F12 > Console)
2. Make sure the API server is running
3. Verify the Vite dev server started without errors

#### Issue: "Event not found" when registering
**Symptom:** Registration shows 404 error
**Solution:**
1. Check the event ID in the URL is correct
2. Verify the database has the event: `SELECT * FROM events WHERE id = <id>;`
3. Ensure the API server is connected to the same database

#### Issue: Styles not loading / all red
**Symptom:** Page shows red or unstyled elements
**Solution:**
The CSS theme variables need to be set. Run this fix:
```bash
# The index.css placeholder should be regenerated
pnpm --filter @workspace/college-events run dev
```

#### Issue: TypeScript errors
**Symptom:** Build fails with TypeScript errors
**Solution:**
```bash
# Re-run codegen first
pnpm --filter @workspace/api-spec run codegen
# Then build
pnpm run typecheck
```

---

## Contact

For technical support regarding this system:
- **IT Department:** it@pscmrce.ac.in
- **College Website:** www.pscmrce.ac.in

---

*Developed for Potti Sriramulu Chalavadi Mallikarjuna Rao College of Engineering and Technology, Vijayawada, Andhra Pradesh*
