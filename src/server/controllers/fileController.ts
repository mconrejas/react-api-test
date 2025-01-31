import { Request, Response } from "express";

// **Upload an image to serve as avatar
export const uploadFile = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    // Log file information for debugging
    console.log('Uploaded file info:', req.file);
  
    return res.status(200).json({
      message: 'File uploaded successfully!',
      filename: req.file.filename
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};