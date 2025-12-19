# Game Gems Library

![Game Gems Library](https://i.postimg.cc/0ySwHmrm/Screenshot-2025-12-18-at-11-23-02-PM.png)

**Game Gems Library** is a full stack MEN (MongoDB, Express, Node.js) app where players can manage their game collection, write reviews, mark favorites, and explore games from the community with filters and ratings.

---

## Links

- **Deployed app:** ([Heroku](https://game-gems-library-f7f85062758d.herokuapp.com/))
- **Repository:** ([Github](https://github.com/gabogara/game-gems-library))
- **Planning:** ([Trello](https://trello.com/b/RIoSTEpd/project-2-game-gems-library))
- **ERD / Data Model diagram:** ([Made in drawio](https://drive.google.com/file/d/1NhK4Np5zGc00_P3BS3qvxuvLcHu9BjdK/view?usp=sharing))

---

## Features

### Authentication & Authorization

- Session-based authentication.
- Sign up, sign in and sign out flows.
- All games / My games / favorites / profile routes are **protected** with middleware (`is-signed-in`).
- Only the owner of a game can **edit or delete** it.
- Only the author of a review can **edit or delete** that review.

### Games (CRUD)

- Full CRUD for games:
  - Create a game with: title, genre, platform, release year, description and cover image URL.
  - View “My Games” (only games created by the logged-in user).
  - Edit and delete your own games.
  - View a **game detail page** with rating stats and reviews.
- “Community Games” page that shows games created by **other users**.

### Reviews

- Logged-in users can leave **one review per game** (rating 0–5 and comment).
- Edit and delete your own reviews.
- Game stats are recalculated on every review create/update/delete using a helper:
  - `averageRating`
  - `reviewCount`
- Game detail page shows:

  - average rating
  - review count
  - list of player reviews (with author username and date).

  ### Favorites

- Users can mark any game as a **favorite**.
- Toggle favorite / unfavorite from:
  - My Games
  - Community Games
  - Game detail page
- Dedicated **“My Favorites”** page showing only games the user has favorited.

### Search and Filters

Available both on **My Games** and **Community Games**:

- Filter by **title** (text search).
- Filter by **genre** (select).
- Filter by **platform** (text search).
- Sort results by:
  - default (newest first)
  - highest rating.

### User Profiles

- Public user profile page:
  - Basic user info (`bio`, `favoriteGenre`).
  - List of games created by that user.
  - List of reviews written by that user (with links to the games).
- “Edit Profile” page for the currently logged-in user.

### UI / UX

- Retro arcade-style theme using Google Fonts:
  - `Press Start 2P`
  - `VT323`
- Clear empty states:
  - No games yet
  - No favorites yet
  - No reviews yet
- Layout built with Flexbox and simple responsive rules for smaller screens.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Views:** EJS templates
- **Styling:** CSS, flex-box
- **Auth:** `express-session`, `bcrypt`
- **Logging & tools:** `morgan`, `method-override`, `dotenv`

---

## Getting Started

### 1. Clone this repository:

```bash
git clone https://github.com/gabogara/game-gems-library
cd game-gems-library
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add:

> example

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@sei-w0kys.azure.mongodb.net/?retryWrites=true
SESSION_SECRET=some-super-secret-string
PORT=3000
```

### 4. Start the server

```bash
node server.js
```

---

## Future Improvements

- Integrate an external video game API (e.g. RAWG, IGDB) to fetch real game data instead of manually entering everything.
- Allow users to launch or play games via embedded widgets or links provided by external APIs when available.
- Add pagination for games and reviews.
- Allow users to filter by release year range.

---

## Attributions

- This project was built using starter code provided by General Assembly: [MEN Stack Auth Template](https://git.generalassemb.ly/modular-curriculum-all-courses/men-stack-session-auth-template.git)
- **Fonts** (from Google Fonts):

  - [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
  - [VT323](https://fonts.google.com/specimen/VT323)

- **Placeholder images**:
  - Cover placeholders generated with [placehold.co](https://placehold.co/).
