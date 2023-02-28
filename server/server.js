const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

//parse JSON from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve static files (css and html)
app.use(express.static(path.resolve(__dirname, "../client")));

//route handlers

//catch all 404 handler
// app.use('*', (req, res) => res.sendStatus(404));
app.get("*", (req, res) => {
  res.status(404).send("Page not found");
});

//Global error handling middleware
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middlware error",
    status: 500,
    message: { err: "Error occured, global error handling" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;
