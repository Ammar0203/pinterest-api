const fs = require('fs-extra')
const mime = require('mime-types')
const sizeOf = require('image-size')
const sharp = require('sharp')

sharp.cache(false)

const compress = () => async (req, res, next) => {
  try {
    const filePath = req.file.path;
        
    const fileSizeInBytes = await fs.stat(filePath).then(stat => stat.size);
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    const maxSizeMB = 3

    if (fileSizeInMB > maxSizeMB) {
      const metadata = await sharp(filePath).metadata();
      let quality = 80; // Start with 80% quality
      
      // Compress until the size is below the max size
      let buffer = await sharp(filePath)
      .resize({ width: metadata.width }) // Adjust width if needed
      .jpeg({ quality: quality }) // Adjust the quality as needed
      .toBuffer();
      
      // If the image is still larger than maxSizeMB, reduce the quality further
      while (buffer.length > maxSizeMB * 1024 * 1024 && quality > 10) {
        quality -= 10;
        buffer = await sharp(filePath)
        .resize({ width: metadata.width }) // Adjust width if needed
        .jpeg({ quality: quality }) // Further reduce quality
        .toBuffer();
      }
      
      await fs.writeFile(filePath, buffer)
    }
    
    const file = await fs.readFile(filePath);
    
    const base64 = file.toString('base64');
    
    const mimeType = mime.lookup(req.file.originalname);
    
    const base64String = `data:${mimeType};base64,${base64}`;

    req.body.image = base64String

    const {width, height} = sizeOf(filePath)
    
    req.body.width = width
    req.body.height = height

    await fs.unlink(filePath); // Delete the original file    
    
    return next()
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

module.exports = {
  compress
}