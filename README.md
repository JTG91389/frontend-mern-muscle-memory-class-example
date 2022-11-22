# Doodle history app

This is a simple web app that allows a user to log into the site with an email and password and then draw a piece of pixel art. 

This app will save each new pixel added to the drawing and will allow the user to rewind their drawing. 

# Setup

Please install npm packages with 

```
npm i
```

then ensure that you have the backend project running and your local mongodb instance running(or atlas connection added to backend).

You must also include a .env file that looks like this 

```
REACT_APP_SERVER_URL=http://localhost:5000
```

our backend project is configured to run on PORT 5000. 