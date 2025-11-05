# FletNex - Netflix clone
Node.js/Express backend service with angular frontend. Movie searching app with all netfix functionality.

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- Jest (testing)

<img width="1898" height="915" alt="image" src="https://github.com/user-attachments/assets/c1b4b901-ed2d-4a6f-b3df-47725529d648" />


## Folder structure

    backend/
    ├── config/
    │   ├── database.js
    │   └── config.js
    ├── controllers/
    │   ├── authController.js
    │   └── showController.js
    ├── middleware/
    │   ├── auth.js
    │   ├── ageMiddleware.js
    │   └── errorHandler.js
    ├── models/
    │   ├── Show.js
    │   └── User.js
    ├── routes/
    │   ├── auth.js
    │   └── shows.js
    ├── scripts/
    │   └── importCsv.js
    ├── tests/
    │   ├── auth.test.js
    │   └── shows.test.js
    ├── utils/
    │   └── validation.js
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── README.md
    └── server.js

    frontend/
    ├── src/
    │   ├── app/
    │   │   ├── auth/
    │   │   │   ├── login/
    │   │   │   ├── register/
    │   │   │   └── auth.service.ts
    │   │   ├── core/
    │   │   │   ├── guards/
    │   │   │   ├── interceptors/
    │   │   │   └── services/
    │   │   ├── shared/
    │   │   │   ├── components/
    │   │   │   ├── models/
    │   │   │   └── pipes/
    │   │   ├── shows/
    │   │   │   ├── show-list/
    │   │   │   ├── show-detail/
    │   │   │   └── show.service.ts
    │   │   ├── app.component.ts
    │   │   ├── app.module.ts
    │   │   └── app-routing.module.ts
    │   ├── assets/
    │   ├── environments/
    │   │   ├── environment.ts
    │   │   └── environment.prod.ts
    │   ├── styles/
    │   │   ├── _variables.scss
    │   │   └── styles.scss
    │   ├── index.html
    │   └── main.ts
    ├── .gitignore
    ├── angular.json
    ├── package.json
    ├── README.md
    └── tsconfig.json


## Prerequisites
1. Node.js (v16 or higher)
2. MongoDB
3. npm or yarn

## Setup
1. Clone the repository
2. Install dependencies:
   
    ```bash
    npm install

3. Copy .env.example to .env:
   
       Copy .env.example to .env:
4.Configure environment variables:

    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/netflix-shows
    JWT_SECRET=your-secret-key

Running Locally
 - Start MongoDB service
 - Run the development server:

        npm run dev

## API Endpoints
 - Get Shows

       GET /api/shows?page=1&limit=15&search=&type=Movie&cast=
 - Get Show by ID
   
       GET /api/shows/:id
 - Authentication
   
       POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "age": 18
}

    POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}

## Testing
 - Run tests:

    npm test
## Deployment (Render)
 - Create new Web Service
 - Connect GitHub repo
 - Set build command: npm install
 - Set start command: npm start
 - Add environment variables
    ```markdown
    # Netflix Shows Frontend
    Angular frontend application for browsing Netflix shows.
    
    ## Tech Stack
    - Angular 12
    - TypeScript
    - Tailwind css
    - RxJS
    - Jest (testing)
    
    ## Prerequisites
    1. Node.js (v16 or higher)
    2. Angular CLI
    ```bash
    npm install -g @angular/cli

## Setup
 - Clone the repository
 - Install dependencies:
   
       npm install
 - Copy environment.example.ts to environment.ts:
   
       cp src/environments/environment.example.ts src/environments/environment.ts
 - Configure environment:
   
        export const environment = {
          production: false,
          apiUrl: 'http://localhost:3000/api'
        };
## Running Locally
 - Start development server:
   
       ng serve
 - Navigate to http://localhost:4200
## Testing
 - Run tests:
   
        ng test




