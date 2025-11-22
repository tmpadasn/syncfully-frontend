## SyncFully Frontend (Concise Guide)

Minimal instructions to run and understand the project.

### 1. What It Is
React app for discovering works (movies, books, music, series, graphic novels) with search + filters (type, year, genre, rating) and user/work toggle.

### 2. Prerequisites
- Node.js (v16+)
- Backend running (port 3000) in `syncfully-backend`

### 3. Run Backend
```bash
cd syncfully-backend
npm install
npm run dev   # or: npm start
# Backend API at http://localhost:3000/api
```

### 4. Run Frontend
```bash
cd syncfully-frontend
npm install
npm start
# Frontend at http://localhost:3001
```

### 5. Optional .env (frontend)
Create `.env` if backend not on default port:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_DEFAULT_USER_ID=1
```

### 6. Key Pages
| Path | Purpose |
|------|---------|
| `/` | Popular works overview |
| `/search` | Search + filters (works/users) |
| `/works/:id` | Work details + ratings |

### 7. Search & Filters (URL params)
`q`, `type`, `year`, `genre`, `rating`, `itemType` → all optional. Empty selection removes the param. Leaving `/search` clears them automatically.

### 8. Common Issues
| Problem | Fix |
|---------|-----|
| Search does nothing | Press Enter or click icon; backend must be running |
| Filters empty | Backend returned no works → seed data/mockWorks |
| Ratings all 0 | Mock ratings limited → extend `mockRatings.js` |

### 9. Modify Filters Quickly
Add backend support → expose field → extend `FilterBar.jsx` → parse in `SearchResults.jsx` → test URL.

### 10. Build For Production
```bash
cd syncfully-frontend
npm run build
```
Outputs static assets in `build/`.

### 11. Tech Stack (Short)
React 18, React Router 6, Axios, react-icons, CRA.

### 12. Folder Snapshot
`src/api` (requests) · `src/pages` (screens) · `src/components` (UI) · `src/hooks` (utilities).

### 12.a Detailed Structure (Condensed)
```
src/
	api/            # client.js (axios), works.js, users.js, search.js
	components/     # Header, FilterBar, WorkCard
	pages/          # Home, SearchResults, WorkDetails, Recommendations
	hooks/          # useAuth, useNavigationWithClearFilters
	context/        # AuthContext (default user)
	router/         # AppRouter (declares routes)
	styles/         # global.css
```

### 13. Available Filter Options
Source: dynamically derived from backend `/works` response.

| Filter | Param | Example | Notes |
|--------|-------|---------|-------|
| Type   | `type` | `?type=movie` | Uses the `type` field directly |
| Year   | `year` | `?year=1999` | Numeric equality match |
| Genre  | `genre`| `?genre=Action` | Single genre; derived from genre/genres array |
| Rating | `rating`| `?rating=4` | Minimum rating threshold (>=) |
| Item Type | `itemType` | `?itemType=user` | Limits search domain (work/user) |
| Query  | `q`    | `?q=matrix` | Text search (title, description, creator) |

Empty/"ALL" removes the parameter for clean URLs.

### 14. Extending Options Quickly
1. Add field in backend (e.g. `language`).
2. Return it in works payload.
3. In `FilterBar.jsx`: collect unique values → add a `MenuControl`.
4. Parse it in `SearchResults.jsx` like other filters.
5. Pass to API as part of `filters` object.

### 13. Quick Reset
If navigation behaves oddly, hard refresh or clear URL params manually.

---

