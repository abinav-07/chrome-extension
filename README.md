<!-- Use cmd+shift+v in macOS or ctrl+alt+v on windows to open as a preview -->
# Scrapper Extension 
Scrapper Extension using Node/Express.js and React.js, Sequelize and Jwts, manifest.json.
`Work Better in Mac, not tested in Windows(follow second last line if you are on windows and dont have docker)`

### CONFIGURATION

#### Admin Cred: admin@gmail.com admin

`NOTE: Seeder is already run along with migrations`

This section covers the process for configuring and installing the application packages.

- run `npm i` and `npm run doc` in root directory to generate a jsdoc, after generating, go to /server/v1/documentation/api directory and open index.html file for APIs documentation.

1. Install `Node.js v ^18.17.0` in your system. USe `nvm install ^18.17.0` and `nvm use 18.17.0`.
2. Install `docker` in your system.
3. Add `.env` to your `root` directory, It has exampleenv file, you can copy same values to .env.
4. Go to `./web` directory and run `npm run build` to generate the build for extension.
5. After building extension, go to your web browser and type `[yourbrowsername]://extensions` or go to extensions setting page, enable developer mode and click on load unpacked and select the `build` directory that we built inside web directory.
6. In root directory, run `docker compose up --build` to run the application, both react and node apps will be run, node.js port is taken from env, react runs on default port, takes some time to build (react app takes more time to start) :).
7. You can now access your applications, 5001 for database, 3000 (default) react and 5000 from env for nodejs.
8. To check if extension worked, open any product in your needed ecommerce website(tested in daraz and amazon).
9. You will see the scrapped data in admin dashboard page.
10. The urls are for the application pages are:
#### User Routes
- /register
#### Admin Routes
- /admin/login Login admin,
- /admin/features
- /admin/members

11. Register some users from /admin/register page, and then use admin dashboard using the email that was provided at the start to see atleast some user data in members tab.

`Final Note: If docker doesnt work for you and you are on windows, Follow Below:`

1. change env, set MY_SQL_PASSWORD= [empty] MY_SQL_HOST=localhost
2. copy envs in both web and server folders
3. Make sure mysql is up and running(mysql.server start) in terminal.
4. mysql -u root -h  in terminal to get inside mysql.
5. Create new DATABASE: CREATE DATABASE extension_scraping;
6. npm run start:win

### Happy Codding!

