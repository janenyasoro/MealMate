MealMate — Smart Weekly Meal Planner WebApp

 1) Overview
MealMate is a web application designed to help families and individuals plan weekly meals, reduce food waste, and streamline grocery shopping through one centralized platform. It brings together key functions like recipe management, weekly calendar planning, and automated shopping lists so users can access their meal plans anytime from a phone or computer.

2) The Problem
Many households struggle with:
- Daily "what's for dinner?" decision fatigue wasting 30+ minutes each day
- Food spoilage from buying ingredients without a plan (average $50/week wasted)
- Meal plans loss when switching devices because they're saved in browser cache or localStorage
- Shopping lists created manually, often missing ingredients
- Difficulty coordinating meals across family members with different preferences

3) The Solution
MealMate provides one reliable system where:
- Recipes are stored and organized in one place
- Weekly meal plans are created via drag-and-drop on a visual calendar
- Shopping lists are auto-generated from planned meals
- Meal plans sync across all devices through cloud storage (no browser caching or localStorage)
- Families can share and collaborate on weekly menus

4) MVP (Minimum Viable Product)
Core MVP Features
a)Public Pages
- Home (welcome + value proposition)
- Features overview
- Login/Signup

b)Authentication
- Social login (Google + GitHub via Auth0)
- Protected routes for authenticated users only

c)Recipe Management
- Users can view demo recipes
- Recipe details (title, ingredients, instructions, prep time, servings)

d)Weekly Calendar
- 7-day grid view (Sunday to Saturday)
- Drag-and-drop recipes onto meal slots (Breakfast, Lunch, Dinner)
- Remove or swap meals easily

e)Shopping List
- Auto-generated from all meals in the current week
- Ingredients de-duplicated and aggregated by quantity
- Check-off items as you shop

f)User Dashboard
- View current week's meal plan
- Access past meal plans (history)
- Quick-add to shopping list

 
5) Tech Stack (Vite + Firebase/JSON)

Frontend
- Vite + React: fast development server, optimized production builds
- React Router: nested routes for dashboard, calendar, recipes, shopping list (standard application flow)
- Tailwind CSS: responsive styling for mobile, tablet, and desktop layouts

Backend / Services
- JSON Server: store user profiles, recipes, meal plans, shopping lists
- Auth0: social authentication (Google + GitHub)
- Real-time sync: meal plans update instantly across devices
- Data Persistence: All data stored in cloud database – no localStorage, no browser caching, no client-side storage

Testing & CI/CD
- Vitest + React Testing Library: minimum 30% test coverage on core components and business logic
- GitHub Actions: automated testing pipeline (fails if coverage < 30%)

Deployment
- GitHub Pages: free static hosting directly from repository
- Semantic Versioning: v1.0.0, v1.1.0, v1.2.0 releases with auto-tagged versions following semver specification (major.minor.patch)

Standard Application Flow

Landing Page → Social Login → Dashboard → Weekly Calendar → 
Add Recipes → Generate Shopping List → Logout
6) Advantages (Pros)
- Fast to build with Vite + Supabase: Vite provides instant HMR during development; Supabase reduces backend complexity with real-time PostgreSQL
- No data loss: Cloud persistence means meal plans don't disappear when clearing browser cache or switching devices – no localStorage dependency
- Secure authentication: Social login handled reliably by Auth0 (no password management)
- Fully responsive: Works on phone (vertical calendar), tablet (scrollable row), and desktop (full grid)
- Automated testing: GitHub Actions enforces 30% minimum test coverage before deployment
- GitHub Pages deployment: Free, fast, and integrates seamlessly with GitHub repository
- Semantic versioning: Clear release process with v1.0.0, v1.1.0, v2.0.0 following industry standards

7) Disadvantages (Cons / Challenges)
- Internet required: Users need an active connection to view and edit meal plans (no offline mode in MVP)
- Learning curve: Drag-and-drop calendar interaction may take time for non-technical users
- Social login only: No email/password option in MVP (limits users without Google/GitHub accounts)
- Static hosting limits: GitHub Pages serves static files only – backend logic relies entirely on Supabase (no server-side API endpoints)

8) Deployment

The application will be deployed using GitHub Pages with automated CI/CD;

Deployed link: 
GitHub repository link: 


Closing Pitch

MealMate modernizes weekly meal planning by centralizing recipes, calendar scheduling, and shopping lists into one reliable web app. With cloud-based data persistence (no localStorage or browser caching), social authentication, standard application flow, 30%+ test coverage, and semantic versioning deployed to GitHub Pages – MealMate delivers a production-ready solution that syncs across all devices. No more decision fatigue, no more wasted food, and no more lost meal plans. MealMate: plan once, eat well all week.



