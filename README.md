# QIVANTA: Freelance Team Website (MERN)

A full-stack website for a freelance team of **web/app developers and designers**. Clients can browse your services, portfolio and team, then send a **quote request** that lands in your admin dashboard.

**Stack:** MongoDB + Mongoose, Express, React 18 (Vite), Node.js, Tailwind CSS, JWT login.

---

## 1. What you get

| Area | Features |
|------|----------|
| Public site | Home, About, Services (+ detail pages with FAQ), Portfolio (category filter), Team, Blog (search, filters, pagination), Contact / Request a quote, 404 |
| Quote form | Name, email, service, budget, timeline, details. Saved to MongoDB, optional email alerts |
| Admin (`/admin`) | Login, overview, **quote requests** (search, status, CSV export), and add/edit/delete for **projects, services, team, testimonials, blog posts** |
| Security | Helmet, rate limiting, Zod validation, bcrypt, JWT (1 day), no public signup |

---

## 2. Project structure

```
qivanta/
├── package.json             # root scripts: install:all, dev, seed, build, start
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/      # layout/, ui/, home/
│       ├── pages/           # public pages, pages/admin/ (Dashboard, Leads, Posts, ResourceManager)
│       ├── context/         # AuthContext
│       ├── hooks/useFetch.js
│       └── services/api.js  # axios (baseURL "/api")
└── server/                  # Express backend
    ├── models/index.js      # User, Lead, Service, Project, Post, Testimonial, TeamMember, Subscriber
    ├── routes/              # auth, posts, leads, misc (subscribe, stats)
    ├── utils/               # crud.js, sendEmail.js
    ├── seed.js              # sample content + admin user
    └── server.js
```

**How frontend and backend connect**
- **Development:** Vite (port 5173) forwards every `/api` request to Express (port 5000). No CORS setup.
- **Production:** `npm run build` creates `client/dist`, and Express serves it. One server, one URL.

---

## 3. Prerequisites

- **Node.js 18+** (`node -v`)
- **MongoDB**: install it locally, **or** create a free cluster on MongoDB Atlas.

---

## 4. Run it step by step

**Step 1.** Unzip, then open a terminal in the project folder:
```bash
cd qivanta
```

**Step 2.** Install everything (root, server and client):
```bash
npm run install:all
```

**Step 3.** Check `server/.env` (a working default is included; if missing, run `cp server/.env.example server/.env`):

| Variable | Meaning |
|----------|---------|
| `PORT` | Backend port (default `5000`) |
| `MONGO_URI` | Local: `mongodb://127.0.0.1:27017/qivanta`. Atlas: `mongodb+srv://<user>:<password>@<cluster>/qivanta` |
| `JWT_SECRET` | Long random string. **Change it.** |
| `CLIENT_URL` | Frontend origin for CORS (default `http://localhost:5173`) |
| `EMAIL_USER`, `EMAIL_PASS` | Optional. Gmail address + App Password for new-request alerts and the client auto-reply. If blank, emails are logged instead of sent. |
| `BRAND_NAME` | Name shown in outgoing emails |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin account created by the seed |

Atlas users: create a database user and allow your IP under *Network Access*.

**Step 4.** Load sample content and create the admin account:
```bash
npm run seed
```
Expected output: `Seeded. Admin login: admin@qivanta.studio / Admin@12345`

**Step 5.** Start frontend and backend together:
```bash
npm run dev
```
- Website: http://localhost:5173
- API health check: http://localhost:5000/api/health
- Admin: http://localhost:5173/admin/login

**Step 6.** Test the whole flow:
1. Open **Contact**, send a quote request, and look for the success message.
2. Sign in at `/admin/login`.
3. Open **Quote requests** to see it. Change its status or export CSV.
4. Open **Projects**, add one, then check `/portfolio`.

---

## 5. Production build (single server)

```bash
npm run build
npm start
```
Open http://localhost:5000. The API and website share one origin.

---

## 6. Deployment

**Option A, one service (simplest):** Render or Railway.
- Build: `npm run install:all && npm run build`
- Start: `npm start`
- Env vars: everything from `server/.env`, with a strong `JWT_SECRET` and an Atlas `MONGO_URI`.
- Run `npm run seed` once against the production database, **then change the admin password** (or set `ADMIN_PASSWORD` before seeding).

**Option B, split hosting:** backend on Render/Railway (root `server`, start `npm start`, set `CLIENT_URL`), frontend on Vercel/Netlify (root `client`, build `npm run build`, output `dist`, env `VITE_API_URL=https://<backend>/api`, plus an SPA rewrite to `index.html`).

---

## 7. Make it yours

1. **Brand name and domain:** the site is named QIVANTA. The email domain `qivanta.studio` is a placeholder: replace it with your real domain in `client/src/pages/Contact.jsx`, `client/src/components/layout/Footer.jsx` and `server/.env`.
2. **Replace sample content:** log in to `/admin` and edit or delete the sample projects, team members and services. Nothing is shown as a testimonial until you add one, and the seed contains no invented client quotes.
3. **Team page:** edit the four placeholder people (name, role, bio, skills, photo URL, LinkedIn, portfolio link).
4. **Colors and fonts:** `client/tailwind.config.js` (`ink`, `brand`, `pop`, `soft`) and the font import at the top of `client/src/index.css`.
5. **Budget and timeline options:** the lists at the top of `client/src/pages/Contact.jsx`.
6. **About page and contact email:** `client/src/pages/About.jsx`, `Contact.jsx` and `Footer.jsx`.
7. **Images:** projects, team and posts take image URLs (for example from Cloudinary or your own hosting). Without one, a styled placeholder is shown.

---

## 8. API reference

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/services`, `/api/services/:slug` | Public |
| GET | `/api/projects`, `/api/team`, `/api/testimonials` | Public |
| POST, PUT, DELETE | `/api/{services,projects,team,testimonials}[/:id]` | Admin |
| GET | `/api/posts?page=&limit=&q=&category=`, `/api/posts/:slug` | Public |
| GET | `/api/posts/admin/all` | Admin |
| POST, PUT, DELETE | `/api/posts[/:id]` | Admin |
| POST | `/api/leads` | Public (rate limited) |
| GET, PATCH, DELETE | `/api/leads[/:id]` | Admin |
| POST | `/api/subscribe` | Public |
| GET | `/api/stats` | Admin |

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoDB connection failed` | Start MongoDB locally, or check Atlas IP access and that the password is URL-encoded. |
| Page shows "Cannot GET /" | You opened the API port (5000). In development open the website at http://localhost:5173. |
| Hosted site shows 404 on refresh | Static hosts need an SPA rewrite to `index.html`. `client/vercel.json` and `client/public/_redirects` (Netlify) are included. |
| Pages are empty | Run `npm run seed` and confirm http://localhost:5000/api/services returns data. |
| `Port 5000 already in use` | Change `PORT` in `server/.env` and the proxy target in `client/vite.config.js`. |
| Admin login fails | Run `npm run seed` again; it recreates the admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. |
| Logged out after a day | Tokens last 1 day. Sign in again. |
| No emails | Set `EMAIL_USER` and a Gmail App Password in `EMAIL_PASS`. |

---

## 10. Before you go live

- [ ] Change `JWT_SECRET` and the admin password
- [ ] Replace all sample content, names and the contact email
- [ ] Add real project images and a favicon
- [ ] Add Privacy and Terms pages, plus a sitemap and `robots.txt`
- [ ] Set your real budget ranges and quote process on the Contact page


## Dark mode, colors and animation

- **Theme toggle:** the sun/moon button in the navbar (and admin sidebar) switches light and dark mode. The choice is saved in the browser; first-time visitors get their device setting.
- **Change the colors:** edit the `:root` (light) and `.dark` blocks at the top of `client/src/index.css`. Every page uses these variables, so one edit updates the whole site.
- **Animations:** scroll reveals use `client/src/components/ui/Reveal.jsx` (wrap any block in `<Reveal>`). Hero blobs, the marquee and floating cards are CSS animations defined in `client/tailwind.config.js`. Visitors who set "reduce motion" on their device get no animation.
