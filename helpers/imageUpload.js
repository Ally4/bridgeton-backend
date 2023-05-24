import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import 'dotenv/config';
import HttpError from './errorsHandler/httpError';


// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('fra1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DIGITAL_OCEAN_KEY,
  secretAccessKey: process.env.DIGITAL_OCEAN_SECRET
});

// Change bucket property to your Space name
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'nisisi',
    acl: 'public-read',
    key(request, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, files, cb) => {

    const mimeTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/jpg': true,
    };

    if (!mimeTypes[files.mimetype]) {
      cb(new HttpError(400, "'please upload a png/jpg/jpeg file only' "));
    }
    cb(null, true);
  },
});

const imageValidation = (req, res, next) => {
  const image = req.file;
  switch (true) {
    case image === undefined:
      next();
      break;
    case image.mimetype !== 'image/png' && image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/jpg':
      return res.status(400).json({ error: 'please upload a png/jpg/jpeg file only' });
    case image.size > 2000000:
      return res.status(400).json({ error: 'image size is too big, upload an image which is 2 mbs or less' });
    default:
      next();
  }
};

export { upload, imageValidation };
