<!-- Use cmd+shift+v in macOS to open as a preview -->
# Mock-Test-Node.js
Mock test Rest APIs for users using Node/Express.js, Sequelize and Jwts

### CONFIGURATION

This section covers the process for configuring and installing the application packages.

1. Install `Node.js` in your system.
2. In your terminal, run `npm init -y` && `npm i` to install all the packages.
4. Use `DBeaver` or `MySQL Workbench` for easy database usage.
5. Add `.env` to your root folder and as this is a mock project, the env is not added to gitignores
6. Start SQL in your local machine
7. create a database named `mock_user` in your local mysql
8. run `npx sequelize-cli db:migrate` in your terminal to migrate the database
9. run `npm run start` to start the server.
10. run `npm run doc` to generate a jsdoc, after generating, go to /out directory and open index.html file.
10. From your post man, try out the APIs by taking references from the jsDoc generated HTML file.

##Happy Codding
