import connectDB from "./db/db.js";
import dotenv from "dotenv";
dotenv.config({
    path: './env'
})


connectDB()
.then(() =>  {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port: ${process.env.PORT || 3000}`);
    })
})
.catch(error => console.log('Connection Failed: ', error.message));