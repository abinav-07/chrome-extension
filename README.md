<!-- Use cmd+shift+v in macOS to open as a preview -->
# role-based-app
Role based App for users using Node/Express.js and React.js, Sequelize and Jwts

### CONFIGURATION

This section covers the process for configuring and installing the application packages.

1. Install `Node.js` in your system.
2. In your terminal, run `npm init -y` && `npm i` to install all the packages.
4. Use `DBeaver` or `MySQL Workbench` for easy database usage.
5. Add `.env` to your `server/v1` folder and as this is a mock project, the env is added to gitignores
6. Start SQL in your local machine
7. create a database named `role_based_app` in your local mysql
8. run `npx sequelize-cli db:migrate` in your terminal to migrate the database
9. run `npm run dev` to start the application, dont forget to kill your previous ports using `npx kill-port 3000` and `5000` similarly.
10. run `npm run doc` to generate a jsdoc, after generating, go to /out directory and open index.html file.
10. From your post man, try out the APIs by taking references from the jsDoc generated HTML file.

##Happy Codding

