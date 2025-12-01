🌐 Wanderlust
Welcome to Wanderlust! This repository includes a dynamic web application inspired by Airbnb, built using the MERN stack with EJS and EJS-mate templating engines.

📑 Table of Contents
Overview
Technologies
Packages & Libraries Used
Getting Started
Setup
Features
Demo & Screenshots
Acknowledgments
License
🌟 Overview
Description: Wanderlust is a dynamic web application inspired by Airbnb, built using the MERN stack (MongoDB, Express.js, Node.js) with EJS and EJS-mate templating engines. The platform allows users to manage property listings seamlessly, including creating, viewing, editing, and deleting listings. It also offers user signup, login functionality, and various advanced features optimized for mobile devices.

💻 Technologies
Below is a breakdown of the core technologies used in this project.

🌐 Web
HTML
Node.js
MongoDB
📦 Packages / Libraries Used
This project uses the following essential libraries and packages:

Package / Library	Purpose
Bootstrap 5.3	Responsive design and components
EJS	Server-side templating
EJS Mate	Enhanced templating with EJS
Express.js	Backend framework
Express-Session	Session management
Mongoose	MongoDB object modeling
connect-Mongo	MongoDB session storage
connect-Flash	Flash messages
method-override	HTTP method override
passport	Authentication
passport-local	Local strategy for passport
passport-local-mongoose	Passport plugin for Mongoose
cloudinary	Image storage
multer	Middleware for handling file uploads
multer-storage-cloudinary	Cloudinary storage for multer
joi	Data validation
mapbox	Mapping functionality
nodemon	Development tool
🚀 Getting Started
Follow these steps to set up the project in your local environment:

Clone the repository:
git clone https://github.com/Jenil-Desai/Wander-lust.git
Install dependencies:
npm install
Configure environment variables by creating .env file at root of project and add following :
MONGO_URL=your_mongodb_url
secret=secret_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOEKN=your_mapbox_public_token
Run the web application:
nodemon app.js
⚙️ Setup
Go to the init folder.
Run:
node index.js
You should see "Data Was Initialized".
Access the application at localhost:8080.
🎯 Features
Explore the unique features available in this application:

Create Listing
View Listings
Edit Listing
Delete Listing
User Signup and Login
Add Review
Delete Review
Map View
Filter Listings
Search Listings
Toggle Tax
View Owners
Mobile Optimization
🔗 Demo & Screenshots
Live
The project will take some time to load considering that it is hosted on the free tier. Therefore, maintain patient.
Mockup	Home Page	New Listing Page	Edit Listing	Sign Up Page	Log In Page
Mockup	Home Page	New Listing Page	Edit Listing	Sign Up Page	Log In Page
🙏 Acknowledgments
We’d like to thank the following contributors and resources:

Apna College's Delta 3.0 Course - Course resource.
📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

Enjoy exploring and contributing to Wanderlust!
