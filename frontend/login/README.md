HOW TO SET UP:
cd backend
node index.js

cd frontend
cd login
npm run dev 

if the front end doesnt connect to the backend, change the port in index.js to whatever port the website is running on


frontend:
npm create vite@latest

backend:
prisma set up

# backend: go to backend folder and install
cd c:\Users\borki\Desktop\Login\backend
npm install
# if prisma not installed previously
npm install prisma --save-dev
npm install @prisma/client
# init or generate prisma client (ensure DATABASE_URL in .env)
npx prisma generate
# run migrations or push schema
npx prisma migrate dev --name init
# start server
node index.js
# OR (recommended during development)
npx nodemon index.js

# frontend: go to frontend login folder and install & run dev server
cd c:\Users\borki\Desktop\Login\frontend\login
npm install
npm run dev
# or if project uses CRA
# npm start

Backend — common dependencies

express
cors
cookie-parser
bcrypt
jsonwebtoken
dotenv
@prisma/client
prisma (devDependency)
(optional) nodemon (devDependency)
Frontend — common dependencies

react
react-dom
react-router-dom
(if Vite) vite and @vitejs/plugin-react (devDependencies)

# go to backend
cd C:\Users\borki\Desktop\Login\backend

# install packages listed below (or just run `npm install` if package.json exists)
npm install express cors cookie-parser bcrypt jsonwebtoken dotenv @prisma/client

# dev dependencies
npm install --save-dev prisma nodemon

# prisma setup (ensure DATABASE_URL in backend/.env)
npx prisma generate
npx prisma migrate dev --name init   # or: npx prisma db push

# start server
node index.js
# or use nodemon for dev:
npx nodemon index.js


# go to frontend folder
cd C:\Users\borki\Desktop\Login\frontend\login

# install project deps from package.json
npm install

# if you need to add specific libs:
npm install react react-dom react-router-dom

# if using Vite and missing dev tools:
npm install --save-dev vite @vitejs/plugin-react

# start dev server
npm run dev
# or for CRA projects:
# npm start


HolySpiritus findafun