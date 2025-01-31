import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../../public/uploads');

if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer to store files in the `uploads` folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where the files should be saved
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename using the current timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Append the original file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
export default upload;
