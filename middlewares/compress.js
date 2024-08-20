const fs = require('fs-extra')
const mime = require('mime-types')
const sizeOf = require('image-size')
const sharp = require('sharp')

sharp.cache(false)

const compressImage = () => async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const fileSizeInBytes = await fs.stat(filePath).then(stat => stat.size);
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    
    const mainImageSize = fileSizeInMB * 0.45
    const lightImageSize = mainImageSize * 0.45 > 0.1 ? 0.1 : mainImageSize * 0.45
    
    const metadata = await sharp(filePath).metadata();
    let quality = 95; // Start with 95% quality
    
    // Compress until the size is below the max size
    let buffer = await sharp(filePath)
    .resize({ width: metadata.width }) // Adjust width if needed
    .jpeg({ quality: quality }) // Adjust the quality as needed
    .toBuffer();
    
    // If the image is still larger than maxSizeMB, reduce the quality further
    while (buffer.length > mainImageSize * 1024 * 1024 && quality > 10) {
      quality -= 5;
      buffer = await sharp(filePath)
      .resize({ width: metadata.width }) // Adjust width if needed
      .jpeg({ quality: quality }) // Further reduce quality
      .toBuffer();
    }
    
    await fs.writeFile(filePath, buffer)
    
    const file = await fs.readFile(filePath);
    const base64 = file.toString('base64');
    const mimeType = mime.lookup(req.file.originalname);
    const mainBase64String = `data:${mimeType};base64,${base64}`;
    req.body.image = mainBase64String
    
    while (buffer.length > lightImageSize * 1024 * 1024 && quality > 10) {
      quality -= 5;
      buffer = await sharp(filePath)
      .resize({ width: metadata.width }) // Adjust width if needed
      .jpeg({ quality: quality }) // Further reduce quality
      .toBuffer();
    }
    await fs.writeFile(filePath, buffer)
    
    const lightFile = await fs.readFile(filePath)
    const lightBase64 = lightFile.toString('base64')
    const lightBase64String = `data:${mimeType};base64,${lightBase64}`;
    req.body.lightImage = lightBase64String
    
    const {width, height} = await sizeOf(filePath)
    req.body.width = width
    req.body.height = height

    await fs.unlink(filePath); // Delete the original file
    
    return next()
  }
  catch (err) {
    return res.status(400).json(err)
  }
}

const compressAvatar = () => async (req, res, next) => {
  try {
    if(!req?.file?.path) {
      return next()
    }
    const filePath = req.file.path;
    const fileSizeInBytes = await fs.stat(filePath).then(stat => stat.size);
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    const imageSize = fileSizeInMB * 0.45 > 0.03 ? 0.03 : fileSizeInMB * 0.45
    
    const metadata = await sharp(filePath).metadata();
    let quality = 95; // Start with 95% quality
    
    // Compress until the size is below the max size
    let buffer = await sharp(filePath)
    .resize({ width: metadata.width }) // Adjust width if needed
    .jpeg({ quality: quality }) // Adjust the quality as needed
    .toBuffer();
    
    // If the image is still larger than maxSizeMB, reduce the quality further
    while (buffer.length > imageSize * 1024 * 1024 && quality > 10) {
      quality -= 5;
      buffer = await sharp(filePath)
      .resize({ width: metadata.width }) // Adjust width if needed
      .jpeg({ quality: quality }) // Further reduce quality
      .toBuffer();
    }
    
    await fs.writeFile(filePath, buffer)
    
    const file = await fs.readFile(filePath);
    const base64 = file.toString('base64');
    const mimeType = mime.lookup(req.file.originalname);
    const mainBase64String = `data:${mimeType};base64,${base64}`;
    req.body.image = mainBase64String
    
    const {width, height} = await sizeOf(filePath)
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
  compressImage,
  compressAvatar,
}