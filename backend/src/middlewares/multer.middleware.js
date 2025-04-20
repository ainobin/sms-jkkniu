import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })
  

// in the secend version, multer is used to store files in memory,
// which send file  directly to the server without saving it to disk
const storage = multer.memoryStorage();
  
export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit (adjust as needed)
    }
});