# React Frontend
Sign-Off Task for SSE Module,  University Of Portsmouth

# Description 
This application is a React.js user interface which connects to an API at the endpoint /api/.

For development purposes, I've set up the React.js development proxy which redirects api calls to https://counters-dot-sse-2019.appspot.com/

# Before installation
- The current configuartion tells the React Development Server to run on port 80 so admin privileges are required.

 

# Assumptions/Decision notes
- I've left the application in one file instead of code splitting as it's a small applicaiton and doing so wouldn't aid readability.
- refreshCounter simply calls updateValue, I found it more readable when keeping the event handler seprate from the timer - rather than having the interval call the event handler.
