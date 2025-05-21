# 🔧 Development & Production-Based Approach

## 🌐 Live Demo

[Visit the App](https://website-frontend-8wnm.onrender.com)

> ⚠️ **Note:** It may take **50 to 160 seconds** for the website to load due to the limitations of a free Render account.

---

## 🔐 Test Credentials

To test the application, log in using:

- **Username:** `Wimpie Blok`  
- **Password:** `Wimpie1234`

> ⚠️ **Important:** Do **NOT** click the “Delete” button on the user account page. If you do, you’ll need a new test account.

- You can find alternative credentials in this GitHub file:  
  `/website-backend/src/data/users.json`
- Or simply create a new account via the **signup page**.

---

## 🛠️ Local Setup Instructions

### Step 1: Frontend (Terminal 1)

```bash
npm install
npm audit fix       # Optional, if needed
npm run start       # Starts on port 5173
```

### Step 2: Backend (Terminal 2)

```bash
npm install
npm audit fix       # Optional, if needed
npm run start       # Starts on port 3000
```

### Step 3: MySQL Database (Terminal 3)

```bash
npx prisma studio
```

---

## 🌍 API Routing Note

To simplify development and deployment, **absolute URLs** are used when making API requests:

```js
fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`)
```

### 📌 Why this approach?

Using a full base URL via `import.meta.env.VITE_API_URL` avoids the need to switch between relative paths (like `/api/...`) in development vs. production. This ensures consistency and reduces manual adjustments across environments.

- ✅ Works seamlessly with environment variables (e.g., `.env.local`, `.env.production`)
- ✅ Prevents CORS issues when frontend and backend are hosted on different domains
- ✅ Suitable for both **local development** and **split deployment** (e.g., Render)

> ℹ️ `VITE_API_URL` is defined in your `.env` file and points to the backend’s base URL (e.g., `http://localhost:3000` for local or your Render backend URL in production).

---

## 🔗 Project Context: Render-Based Split Deployment

This project was originally developed as a **monorepo fullstack application** (frontend + backend in one).

> ⚠️ **However, due to Render’s free-tier limitations**, the project has been split into two public repositories for deployment:
- `website-frontend`
- `website-backend`

Although hosted separately, both are **part of the same project** and communicate via API endpoints. The frontend uses the backend through a base URL defined in environment variables.

> 🧩 In a professional setup (like Vercel, AWS, or Docker), the app can run as a single fullstack application again.

---

## 🧪 Testing Notes

- The `.env` file is included for testing purposes.
- Integration and unit tests are **still being updated** due to recent project changes.

---


