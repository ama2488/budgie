const Receipts = require('../db/receipts');
const express = require('express');
const cors = require('cors');
const im = require('imagemagick');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploads');
  },
  filename: function(req, file, callback) {
    const fileExt = file.mimetype.split('/')[1];
    if (fileExt === 'jpeg') {
      fileExt = 'jpg';
    }
    callback(null, file.fieldname + '-' + Date.now() + '.' + fileExt);
  }
});

const upload = multer({storage: storage}).single('userPhoto');

const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:8100',
  optionsSuccessStatus: 200
};

router.get('/receipts/users/:id', cors(corsOptions), (req, res, next) => {
  Receipts.getAll(req.params.id, (err, receipts) => {
    if (err) {
      next(err);
    } else {
      res.json(receipts);
    }
  });
});

router.post('/receipts/image', cors(corsOptions), (req, res, next) => {

  upload(req, res, function(err) {
    const photo = req.file.path;
    if (err) {
      console.log(err, "file errored and here is the error message")
      return res.end("Error uploading file.");
    }
    console.log(photo, 'FILEPATHOFTHENEWDANGFILE!!!')

    im.convert([
      photo,
      // '-resize',
      // '400%',
      '-type',
      'Grayscale',
      './uploads/cleaned.jpg'
    ], (err, result) => {
      if (err) {
        console.log(err, 'ERROR!!!!');
      }
      console.log('converted complete.')
      Tesseract.recognize('./uploads/cleaned.jpg').then((clean) => {
        console.log(clean, 'here is the tessy result');
        // const lines = clean.text.split('\n');
        // const cleanLines = [];
        // console.log("LINES?");
        // console.log(lines);
        //
        // const priceRegex = /\d+[\.\,]\d+$/;
        // for (let i = 0; i < lines.length; i++) {
        //   const item = {};
        //   if (lines[i].match(priceRegex)) {
        //     item.price = lines[i].match(priceRegex)[0];
        //   }
        //   item.name = lines[i].substring(0, lines[i].indexOf(item.price)).trim().toLowerCase();
        //   item.price = item.price.replace(',', '.');
        //   if (item.name && item.price) {
        //     cleanLines.push(item);
        //   }
        // }
        res.json(clean);
      }).catch((err) => {
        console.error("********** RECOGNIZE ERROR **************");
        console.error(err);
      });
    });
    // res.end("File is uploaded");
  });
});

router.post('/receipts/users/:id', cors(corsOptions), (req, res, next) => {
  Receipts.addNew(req.body, req.params.id, (err, newReceipt) => {
    if (err) {
      next(err);
    } else {
      res.json(newReceipt);
    }
  });
});

router.get('/receipts/:id', cors(corsOptions), (req, res, next) => {
  Receipts.getOne(req.params.id, (err, receipt) => {
    if (err) {
      next(err);
    } else {
      res.json(receipt);
    }
  });
});

router.patch('/receipts/:id', cors(corsOptions), (req, res, next) => {
  Receipts.updateReceipt(req.params.id, req.body, (err, receipt) => {
    if (err) {
      next(err);
    } else {
      res.json(receipt);
    }
  });
});

router.delete('/receipts/:id', cors(corsOptions), (req, res, next) => {
  Receipts.deleteReceipt(req.params.id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(result);
    }
  });
});

// function validate(req, res, next) {
//   const errors = [];
//   ['location_id', 'date'].forEach((field) => {
//     if (!req.body[field] || req.body[field].trim() === '') {
//       errors.push({ field, messages: ['cannot be blank'] });
//     }
//   });
//   if (errors.length) {
//     return res.status(422).json({ errors });
//   }
//   next();
// }

module.exports = router;
