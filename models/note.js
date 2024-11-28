const mongoose = require ('mongoose')

const url= process.env.MONGODB_URI
 
mongoose.set('strictQuery', false)
console.log('Conneting to',url);

mongoose.connect(url)
    .then(result =>{
        console.log('conected to MongoDB');
    })
    .catch(error =>{
        console.log('error connecting to MondgDB', error.message);
    })

 
const noteSchema = new mongoose.Schema({
content: String,
important: Boolean
})
 
noteSchema.set('toJSON,') ,{
    Transform:(document, returnObject) => {
        returnObject.id=returnObject.id.toString()
        delete returnObject._id
        delete returnObject._v
    }


}


module.exports = mongoose.model('Note', noteSchema)
