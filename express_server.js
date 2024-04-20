const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
   app.use(cookieParser());

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}



app.set("view engine", "ejs");


const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  aj7utn: "car"
};

app.use(express.urlencoded({ extended: true }));

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const newKey = generateRandomString(6)
  urlDatabase[newKey] = req.body.longURL
  res.redirect(`/urls/${newKey}`); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const updatedURL = req.body.url;
  urlDatabase[id] = updatedURL
  res.redirect("/urls");
});


// .post cookie
app.post('/login', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username);
  res.redirect('/urls');
});




// app.post("/urls/:id/edit", (req, res) => {
//   //delete urlDatabase[req.params.id]
//   const id = req.params.id;
//   const updatedURL = req.body.url;
//   res.redirect("/urls/:id");
// });

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id; // Grab the ID from params
  const updatedURL = req.body.url; // Assuming 'url' is the name attribute of the input in your form for the new URL
  
  // Update the URL in the database
  urlDatabase[id] = updatedURL; // This adjusts the actual URL. Make sure this aligns with how your database is structured.

  // Redirect to the updated URL's page or to the index
  res.redirect(`/urls/${id}`); // Note the use of template literals to dynamically insert the ID
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");
});




app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id
  const longURL = urlDatabase[id]
  const templateVars = { id, longURL };
    res.render("urls_show", templateVars);
  });

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("Short URL not found");
  }

  //cookie parser/////////////////////////////////////////
  app.get('/login', (req, res) => {
    const username = req.cookies['username'];
    
    // Now you can use the username in your response
    res.send(`Hello, ${username}!`);
  });

});

  