var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/images/tempDir/'});


var im = require('imagemagick');

compressImage = async (req, res, next) => {
  var file = req.file.path
  const fs = require('fs');
  const b = (err, stdout, stderr) => {
      if (err) throw err;
      var stats = fs.statSync('public/images/' + req.file.filename + '.jpg');
      req.body.newSize= stats.size;
      req.body.newName= 'public/images/' + req.file.filename + '.jpg';
      // Aqui al no dar error ya tienes que borrar el archivo subido en el tempDir con fs....
      next();
  }
  await im.resize({
    srcPath: file,
    dstPath: 'public/images/' + req.file.filename + '.jpg',
    width:   720
    }, b);  
}


/* GET home page. */
router.get('/', function(req, res, next) {
console.log('get')
  res.render('index', { title: 'Subida de Imagenes' });
});

/* GET home page. */
router.post('/', upload.single('photo'), compressImage,function(req, res, next) {
  const obj = { 
    title: 'Archivo subido', 
    newSize: req.body.newSize ? (req.body.newSize / 1024 / 1024).toFixed(2) : 'Error al comprimir',
    newName: req.body.newName ? req.body.newName : 'Error al comprimir',
    oldName: req.file.originalname,
    oldSize: (req.file.size / 1024 / 1024).toFixed(2) ,
    post: true
  }
  res.render('index', obj);
});

module.exports = router;
