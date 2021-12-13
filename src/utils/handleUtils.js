
const response = (res, obj) => {
     try{
        if(!obj) return res.status(404).end()
        res.json(obj)
     } catch (error) {
        console.log(error)
        return res.error(error)
     }
  
    
}

const message = (msg) => {
   return {message : msg}

}
module.exports = {response, message}