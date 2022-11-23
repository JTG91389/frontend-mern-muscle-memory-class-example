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

# Steps

We will challenge you all to create this doodle app with the functionality to rewind our drawing using react on our frontend. 

## Create the doodle pad component

This will be a react component built of an n by n array of child react components

### Create doodle cell component

### Create rewind dropdown component