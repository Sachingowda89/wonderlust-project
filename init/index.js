const mongoose=require("mongoose");
const { removeAllListeners } = require("../models/listing");
// add data in this
const initData=require("./data.js");
// creatig sxhema and model
const listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main()
.then(()=>{
    console.log("connected DB");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
    
}
// sample data insert
const initDB=async ()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,
        owner:"68a2cc9ca71169aef115e0c9"}))
    await listing.insertMany(initData.data);
    console.log("data was initilized");
}
initDB();