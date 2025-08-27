## NASA Visualizer API

Express.js + TypeScript API server that proxies and transforms NASA API responses for the frontend.

### Features
- Photo of the Day (APOD) endpoint with date range support
- Mars Rover photos (Curiosity) with sol and camera filtering
- Request cancellation support
- Rate limiting header logging
- TypeScript with strict typing

### Tech stack
- Express.js + TypeScript
- NASA APIs (APOD, Mars Rover)
- PNPM workspaces (this package lives under the monorepo `nasa-vis/api`)

### Prerequisites
- Node.js v24+
- pnpm v10+
- NASA API key (optional, uses DEMO_KEY by default)

### Environment variables
```bash
# Required for production use
NASA_API_KEY=your_nasa_api_key_here

# Optional
PORT=3000  # defaults to 3000
```

**Note**: Without `NASA_API_KEY`, the API will use NASA's `DEMO_KEY` which has strict rate limits (30 requests/hour, 50 requests/day).

### Getting started
```bash
# from repo root (recommended)
pnpm install
```

### Scripts
```bash
# start dev server with hot reload on http://localhost:3000
pnpm dev

# run eslint
pnpm lint-fix

# build TypeScript to dist/
pnpm build

# start production server
pnpm start
```

### API Endpoints

#### GET /api/photo-of-the-day
Fetch NASA's Astronomy Picture of the Day.

**Query parameters:**
- `date` (optional): Single date in YYYY-MM-DD format
- `start_date` + `end_date` (optional): Date range in YYYY-MM-DD format

**Examples:**
```bash
# Today's photo
GET /api/photo-of-the-day

# Specific date
GET /api/photo-of-the-day?date=2025-01-15

# Date range
GET /api/photo-of-the-day?start_date=2025-01-10&end_date=2025-01-15
```

**Response:**
```json
{
  "photos": [
    {
      "id": "2025-01-15",
      "title": "Photo Title",
      "explanation": "Photo description...",
      "date": "2025-01-15",
      "HDURL": "https://...",
      "imageURL": "https://...",
      "copyright": "Photographer Name"
    }
  ]
}
```

#### GET /api/mars-photos
Fetch Mars Rover photos from Curiosity.

**Query parameters:**
- `sol` (optional): Martian sol number (default: 1000)
- `camera` (optional): Camera code (default: FHAZ)

**Allowed camera values:**
- FHAZ (Front Hazard Avoidance Camera)
- RHAZ (Rear Hazard Avoidance Camera)
- MAST (Mast Camera)
- CHEMCAM (Chemistry and Camera Complex)
- MAHLI (Mars Hand Lens Imager)
- MARDI (Mars Descent Imager)
- NAVCAM (Navigation Camera)

**Examples:**
```bash
# Default (sol 1000, FHAZ camera)
GET /api/mars-photos

# Specific sol
GET /api/mars-photos?sol=500

# Specific sol and camera
GET /api/mars-photos?sol=500&camera=MAST
```

**Response:**
```json
{
  "photos": [
    {
      "id": 12345,
      "title": "Curiosity - MAST | 2025-01-15",
      "date": "2025-01-15",
      "sol": 500,
      "imageURL": "https://..."
    }
  ]
}
```

### License
This project uses the NASA public APIs. Respect their rate limits and attribution guidelines. See [NASA API docs](https://api.nasa.gov/) for details.
