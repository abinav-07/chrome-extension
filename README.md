<!-- Use cmd+shift+v in macOS to open as a preview -->
# role-based-app
Role based App for users using Node/Express.js and React.js, Sequelize and Jwts

### CONFIGURATION

#### Admin Cred: admin@gmail.com admin

`NOTE: Use separate browsers for admin and user pages as I have its a mock project, both authenticated users have token ids assigned to same storage key.`

This section covers the process for configuring and installing the application packages.

- run `npm run doc` to generate a jsdoc, after generating, go to /server/v1/documentation/api directory and open index.html file.

1. Install `Node.js` in your system.
2. In your terminal, run `npm i` to install all the packages.
4. Use `DBeaver` or `MySQL Workbench` for easy database usage.
5. Add `.env` to your `server/v1` folder, It has exampleenv file, you can copy same values to .env., also add env inside web folder with value `REACT_APP_API=http://localhost:5000/v1` to connect to API
6. Start SQL in your local machine
7. create a database named `role_based_app` in your local mysql
8. run `npx sequelize-cli db:migrate` in your `server/v1` folder's terminal to migrate the database
Also run `npx sequelize-cli db:seed:all` in your terminal to migrate the database
9. run `npm run dev` in root directory to start the application, dont forget to kill your previous ports using `npx kill-port 3000` and `5000` similarly.

11. From your post man, try out the APIs by taking references from the jsDoc generated HTML file.

12. The urls are for the application pages are:
#### User Routes
- /login Login user,
- /register
- /features
- /features/:id

#### Admin Routes
- /admin/login Login user,
- /admin/features

13. Register some users from /register page, and then use admin dashboard to see atleast some user data.

##Happy Codding

