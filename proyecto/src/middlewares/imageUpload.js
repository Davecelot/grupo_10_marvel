const multer = require('multer');
const path = require('node:path');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const { validateCsrf } = require('./csrf');
const { validationResult } = require('express-validator');

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif' };
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function imageType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return '.png';
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return '.jpg';
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'))) return '.gif';
  return null;
}

function imageUpload(directory, prefix) {
  const parse = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 50, parts: 51, fieldSize: 16384 },
    fileFilter(req, file, done) {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!TYPES[extension] || TYPES[extension] !== file.mimetype) {
        return done(Object.assign(new Error('Solo se permiten imágenes JPEG, PNG y GIF.'), { status: 400 }));
      }
      done(null, true);
    },
  }).single('imagen');
  const persist = async (req, res, next) => {
    if (!req.file || !validationResult(req).isEmpty()) return next();
    const extension = imageType(req.file.buffer);
    if (!extension || TYPES[extension] !== req.file.mimetype) {
      return res.status(400).send('El contenido del archivo no es una imagen permitida.');
    }
    try {
      // Keep full public paths inside the existing VARCHAR(50) columns while
      // retaining 128 unpredictable bits and exclusive file creation.
      req.file.filename = `${prefix[0]}-${crypto.randomBytes(16).toString('base64url')}${extension}`;
      await fs.writeFile(path.join(directory, req.file.filename), req.file.buffer, { flag: 'wx' });
      delete req.file.buffer;
      next();
    } catch (error) { next(error); }
  };
  return [parse, validateCsrf, persist];
}

module.exports = { imageUpload, imageType, MAX_IMAGE_BYTES };
