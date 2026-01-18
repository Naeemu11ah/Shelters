# Shelter (Express Project)

This is my first major project, a practical shelter-listing web app built with Node.js and Express. It demonstrates user authentication, file uploads to Cloudinary, client & server-side validation, geocoding for locations, reviews, ownership-based authorization and many more.

**Features**

- **Listings:** Create, read, update, delete shelters with images, price, description, and GeoJSON location data.
- **Images:** File upload via `multer` + `multer-storage-cloudinary`; images are stored on Cloudinary and deleted from Cloudinary when a listing is replaced or removed.
- **Reviews:** Authenticated users can post, edit, and delete reviews. Reviews store rating, comment, author and created timestamp. Non-authenticated users can only view reviews given by others.
- **Validation:** Server-side validation using `Joi` for listings and reviews, client side validation using bootstrap form validation and schema validation for database.
- **Auth:** Sign-in with `passport-local` and `passport-local-mongoose`. (Sign-up is currently disabled by default in the codebase.)
- **Authorization & Guards:** Middlewares ensure only owners can edit/delete their listings and only review authors can modify their reviews.
- **Sessions:** Sessions persisted in MongoDB using `connect-mongo` and `express-session`.
- **Geocoding:** Mapbox geocoding is used to translate location + country into coordinates (geometry stored on listings).
- **Flash & UX:** `connect-flash` used for success/error messages; views rendered with EJS + `ejs-mate`.

**Project structure (high-level)**

- `index.js` — app entry, session + passport setup, route mounting
- `cloudConfig.js` — Cloudinary + storage configuration
- `controllers/` — route handlers (listings, reviews, user)
- `models/` — Mongoose models (`User`, `Listing`, `Review`)
- `routes/` — Express routers for listings, reviews, user pages
- `utils/` — validation, common middlewares, error wrapper
- `views/` — EJS templates
- `public/` — static assets

**How to use!**

1. Install dependencies:

```
npm install
```

2. Set environment variables (example `.env`)

```
MONGODB_ATLAS_URL=your_mongo_url
MY_SECRET=some_long_secret
CLOUD_NAME=your_cloud_name
API_KEY=your_cloud_api_key
API_SECRET=your_cloud_api_secret

--> The MapBox token is currently embedded in "controllers/listings.js". you can replace it with "process.env.MAPBOX_TOKEN" for safety.
```

3. Run the app:

```
node index.js
```

## Project Links

You can explore the project live --> [Visit the website](https://shelters-production.up.railway.app/list), or watch a demo video showcasing its design and functionality --> [watch video in linkedin](https://www.linkedin.com/posts/naeemullah-%7E-081059352_full-stack-web-app-built-using-express-js-activity-7418326193201987585-iUQT?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAAFftsiEB4tZusIFGExXzwDNsmOyFmnG3S1s&utm_campaign=copy_link)
