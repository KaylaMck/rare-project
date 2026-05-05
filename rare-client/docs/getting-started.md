# Getting Started

## Prerequisites

Make sure the following are installed before continuing:

- [Python 3.11+](https://www.python.org/downloads/)
- [pipenv](https://pipenv.pypa.io/en/latest/) — `pip install pipenv`
- [Node.js 18+](https://nodejs.org/) and npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (used to run PostgreSQL)

---

## 1. Database Setup

The API depends on a PostgreSQL 16 database running on `localhost:5432`. A `docker-compose.yml` in `rare-api/` handles this.

```bash
cd rare-api
docker-compose up -d
```

This creates a container with:

| Setting  | Value           |
|----------|-----------------|
| Database | `rare`          |
| User     | `rare_user`     |
| Password | `rare_password` |
| Port     | `5432`          |

To stop the database later: `docker-compose down`  
To stop and remove all data: `docker-compose down -v`

---

## 2. API Setup

From the `rare-api/` directory:

```bash
cd rare-api

# Install Python dependencies
pipenv install

# Activate the virtual environment
pipenv shell

# Apply all migrations
python manage.py migrate
```

---

## 3. Seeding the Database

Load the initial fixture data (users, posts, categories, tags, comments, and reactions):

```bash
python manage.py loaddata rareapi/fixtures/initial_data.json
```

---

## 4. Starting Both Servers

Open two terminal windows/tabs.

**Terminal 1 — Django API (port 8000):**

```bash
cd rare-api
pipenv shell
python manage.py runserver
```

**Terminal 2 — React client (port 3000):**

```bash
cd rare-client
npm install
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).  
The API is available at [http://localhost:8000](http://localhost:8000).

---

## 5. Login Credentials

The fixture includes 13 pre-loaded accounts. All accounts share the same password — ask your instructor or team lead for the fixture password.

If you need to set a known password yourself, run the following in the Django shell:

```bash
python manage.py shell
```

```python
from rareapi.models import RareUser
user = RareUser.objects.get(username="admin_sarah")
user.set_password("YourPasswordHere")
user.save()
```

### Staff accounts (can approve posts and manage users)

| Username       | Email                   |
|----------------|-------------------------|
| `admin_sarah`  | sarah.chen@rare.com     |
| `admin_marcus` | marcus.j@rare.com       |

### Regular accounts

| Username         |
|------------------|
| `dev_diana`      |
| `wanderlust_joe` |
| `chef_maya`      |
| `bookworm_alex`  |
| `fit_jordan`     |
| `gamer_priya`    |
| `eco_oliver`     |
| `music_luna`     |
| `startup_raj`    |
| `photo_emma`     |
