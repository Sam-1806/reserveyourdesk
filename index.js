const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongodb");
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../templates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/', (req, res) => {
  res.render('Homepage');
});

app.get('/userlogin', (req, res) => {
    res.render('userlogin');
  });

app.get('/seatbooking', (req, res) => {
  res.render('seatbooking');
});

app.get('/booked', (req, res) => {
  res.render('booked');
});

app.post('/signup', async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  try {
    const checking = await LogInCollection.findOne({ name: req.body.name });

    if (checking) {
      res.send("User details already exist");
    } else {
      await LogInCollection.insertMany([data]);
      res.status(201).render("homepage", {
        naming: req.body.name
      });
    }
  } catch (error) {
    res.send("Error occurred while signing up");
  }
});

app.post('/userlogin', async (req, res) => {
  try {
    console.log('Login request received');
    console.log('Username:', req.body.name);
    console.log('Password:', req.body.password);

    const check = await LogInCollection.findOne({ name: req.body.name });

    console.log('User record from the database:', check);

    if (check && check.password === req.body.password) {
      // Redirect to the reservation page
      res.redirect('/seatbooking');
    } else {
        console.log('Incorrect password');
        res.send('Incorrect password');
      }
    } catch (error) {
      console.log('Error occurred:', error);
      res.send('Wrong details');
    }
  });
  
     

  


app.listen(port, () => {
    console.log('port connected');
})