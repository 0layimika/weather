const express = require('express');
const mongoose = require('mongoose');
const server = express();
const path = require("path")
const hbs = require("hbs")
const PORT = 8000
const session = require('express-session')
const collection = require('./info')
const axios = require('axios')
const passport = require('passport');
const template = path.join(__dirname,'./templates')
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json())
server.use(session({
  secret:'123456789abcd',
  resave: false,
  saveUninitialized: true,
}))
server.set("view engine", "hbs")
server.set("views",template)
server.use(express.urlencoded({extended:false}))
server.get('/', (req, res) =>{
  res.redirect('/login')
})
server.get('/login',(req, res) => {
 res.render("login")
})
server.get('/signup',(req, res) => {
 res.render("signup")
})

server.post("/signup",async(req,res) => {
 const data = {
  username:req.body.username,
  password:req.body.password
 };
 await collection.LogInSchema.insertMany([data]);
 const indexPath = path.join(__dirname,'./public/index.html');
 res.sendFile(indexPath);
 // res.render("home")
})

server.post("/login",async(req,res) => {
 try{
  const check = await collection.LogInSchema.findOne({username:req.body.username})

  if(check.password == req.body.password){
    const indexPath = path.join(__dirname,'./public/index.html');
    res.sendFile(indexPath);
  }else{
   res.send("Wrong password")
  }
 }catch{
  res.send("Wrong details")
 }
    const indexPath = path.join(__dirname,'./public/index.html');
    res.sendFile(indexPath);
})
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated){
    return next();
  }else{
    res.redirect('/');
  }
};
server.post("/weather", async (req, res) => {
  const locationToSearch = req.body.location;
  const openWeatherMapApiKey = '5b5e364ad73b6698554607ec8884f813';

  try {
    const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: locationToSearch,
        limit: 1,
        appid: openWeatherMapApiKey,
      },
    });

    const lat = geoResponse.data[0].lat;
    const lon = geoResponse.data[0].lon;

    const weatherResponse = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: lat,
        lon: lon,
        appid: openWeatherMapApiKey,
      },
    });

    const weatherData = weatherResponse.data;

    // Save weather data to MongoDB
    const newWeatherEntry = new collection.Weather({
      location: locationToSearch,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      date: formatDateToYYYYMMDD(new Date())
    });

    await newWeatherEntry.save();

    res.json(weatherData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.get('/search', async(req, res) => {
  try{
    const dateToSearch = req.query.date;
    console.log('Search request received:', req.query.date);
    const weatherData = await collection.Weather.findOne({
      date: dateToSearch,
    });
    if (weatherData) {
      res.json(weatherData);
    } else{
      res.status(404).json({error:'Weather data not found for specified date'})
    }
  } catch (error){
    console.error('Error:', error.message);
    res.status(500).json({error:'Internal Server Error'})
  }
});

server.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err){
      console.error('Error destroying session:',err)
    } else{
      res.redirect('/login')
    }
  })
})
server.listen(8000, () => {
 console.log(`server is running on PORT http://localhost:${PORT}`);
})



function formatDateToYYYYMMDD(date) {
  return date.getDate() +"/"+ (String(date.getMonth()+1)).padStart(2,"0") + "/"+date.getFullYear();
}

