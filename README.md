# Exhibition Curation App
- Hosted site: 

https://exhibition-curation.netlify.app/

## Note - Homepage Under Construction - Search Works - Links May not Work
Whilst you can currently search for and add artworks to a  'Temporary Gallery', our homepage is currently being built and we soon hope to add pre-curated galleries. Currently you may click on an image (which will soon be) linking to one of these curated galleries -such as those under 'Themes', and be taken to a blank page, but this will soon be filled with curated artworks and artefacts from the curated gallery.  

## Overview
The **Exhibition Curation App** is a web application designed for users to search, collect, and curate artwork from multiple online museum collections. Users can browse artwork, save pieces to a temporary collection, and create personal galleries once logged in.

## Features
- 🔍 **Search Artwork**: Retrieve artworks from sources like The Met and Cleveland Museum.
- 📌 **Temporary Collection**: Add items to a collection without logging in (session-based storage).
- 🏛 **User Collections**: Registered users can save collections as permanent galleries.
- 🎨 **User Profile**: View saved galleries and manage personal details.
- 🖼 **Gallery Detail View**: Browse and interact with saved collections.

## Setup and Installation

### **Prerequisites**
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/) (Database setup required)

### **Backend Setup**
1. **Clone the repository**
   ```sh
   git clone [https://github.com/Hydrochilli/Exhibition_app]
   cd exhibition-app/backend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgres://exhibition_user:yourpassword@localhost:5432/exhibition_db
   JWT_SECRET=your_secret_key
   ```
4. **Setup PostgreSQL Database**
   ```sh
   psql -U postgres
   CREATE DATABASE exhibition_db;
   CREATE USER exhibition_user WITH PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE exhibition_db TO exhibition_user;
   ```
5. **Run database migrations**
   ```sh
   npm run migrate
   ```
6. **Start the backend server**
   ```sh
   npm run dev
   ```
   The backend should now be running on `http://localhost:3001`

### **Frontend Setup**
1. **Navigate to frontend directory**
   ```sh
   cd ../frontend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Start the frontend server**
   ```sh
   npm run dev
   ```
   The frontend should now be accessible at `http://localhost:5173`

## **How to Use**
1. **Browse artworks** via the search bar on the homepage.
2. **Add to Temporary Collection** by clicking **"Add to My Gallery"**.
3. **Save Collection**: If logged in, users can permanently save collections.
4. **View Profile & Galleries**: Navigate to **"My Collections"** to see saved galleries.
5. **Click on a Gallery** to explore the artworks in a detailed view.

## **Upcoming Improvements**
- 🖼 **Gallery Detail Pages**: Display saved artwork with thumbnails.
- 📸 **Thumbnails in My Collections**: Show a preview of artworks.
- 🔍 **Enhanced Filtering & Sorting**: Improve search functionality.

## **Contributing**
1. **Fork the repo** and create a new branch.
2. **Make changes** and commit with meaningful messages.
3. **Push** to your fork and submit a **pull request**.



---
Happy curating! 🎨🏛

