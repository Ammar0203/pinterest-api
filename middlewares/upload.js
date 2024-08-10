const multer = require("multer");

const pinStorage = multer.diskStorage({
  destination: 'public/pins/',
  filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase()
      cb(null, `${Date.now() + Math.random().toFixed(5).slice(2)}.${ext}`)
  }
});

const pinUpload = multer({
  limits: { fileSize: 1024 * 1024 * 100 },
  storage: pinStorage,
  fileFilter: (req, file, cb) => {
      let fileTypes = /jpeg|jpg|png/;
      let mimeType = fileTypes.test(file.mimetype);
      if (mimeType)  return cb(null, true);
      cb(new Error('It is not allowed to upload this file'));
  },
});

const avatarStorage = multer.diskStorage({
  destination: 'public/avatars/',
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now() + Math.random().toFixed(5).slice(2)}.${ext}`)
  }
});

const avatarUpload = multer({
  limits: { fileSize: 1024 * 1024 * 10 },
  storage: avatarStorage,
  fileFilter: (req, file, cb) => {
      let fileTypes = /jpeg|jpg|png/;
      let mimeType = fileTypes.test(file.mimetype);
      if (mimeType)  return cb(null, true);
      cb(new Error('It is not allowed to upload this file'));
  },
});

module.exports = {
  uploadPin: () => pinUpload.single('pin'),
  uploadAvatar: () => avatarUpload.single('avatar')
}