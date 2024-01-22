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
 // user:{
 //  type: mongoose.Schema.Types.ObjectId,
 //  ref: 'Collection1',
 //  required: true,
 // },
  date: {
    type: String,
    required:true,
  },
  location:{
    type: String,
    required: false
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