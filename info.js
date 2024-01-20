const mongoose =  require('mongoose');
const uri = 'mongodb+srv://olayimika:0layimika@weather.o6kaiyj.mongodb.net/?retryWrites=true&w=majority'
async function connect(){
 try{
  await mongoose.connect(uri);
  console.log('connected to db');
 }catch(error){
  console.error(error);
 }
}
connect();
const LogInSchema = new mongoose.Schema({
 username:{
  type:String,
  required:true
 },
 password:{
  type:String,
  required:true
 }
})

const collection = new mongoose.model("Collection1",LogInSchema);

const WeatherSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  temperature: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Weather = mongoose.model('Weather', WeatherSchema);
module.exports = {LogInSchema:collection,
Weather:Weather};