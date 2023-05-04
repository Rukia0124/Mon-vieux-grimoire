###Book Rating Application

This application allows users to rate and comment on books they have read. Users can create an account, add books, and modify or delete them. The back-end of the application is developed with Node.js and Express, while the front-end uses React.

##Installation

To install the application, follow the steps below:

#Back-end

1. Clone the project from the GitHub repository:
git clone https://github.com/Rukia0124/Mon-vieux-grimoire.git

2. Navigate to the backend directory:
cd backend

3. Install the dependencies:
npm install

4. Add a .env file containing:
SECRET_TOKEN="YOUR_SECRET_TOKEN"
DB_LINK="YOUR_MONGODB_URL"

5. Start the server:
nodemon server

#Front-end

1.Navigate to the frontend directory:
cd frontend

2.Install the dependencies:
npm install

3. Add a .env file containing:
REACT_APP_API_URL="http://localhost:PORT"

4.Start the application:
npm start

##How to Use the Application
Once the application is installed and both servers are running, you can access the application by opening your web browser to http://localhost:PORT, where PORT is the port of your choice (for example, 3000).

To get started, you can create an account by clicking on the "Sign Up" button and filling out the form. Once you have created an account, you can log in and start adding books using the "Add Book" button. To modify or delete books, click on the book you want to edit or delete and make the necessary changes. Note that only the user who created a book can modify or delete it.On the page of each book, you can view its rating and informations. Additionally, the top three highest-rated books will be displayed on this page.