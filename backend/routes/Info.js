import mongoose from 'mongoose';
import { Router } from 'express';
const router = Router();
import multer, { diskStorage } from 'multer';
import Info, { find, findById, deleteOne } from '../models/Record';
import { extname as _extname } from 'path';

const storage = diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(_extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb('Error: Images Only!');
      }
    }
  }).single('FILE');

  router.get('/', async (req, res) => {
    try{
        const info = await find();
        res.json(info);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
  });

  router.get('/:id', async (req, res) => {
    const info = new Info({
        name: req.body.name,
        motto: req.body.motto,
        filename: req.file.filename,
        date: Date.now(),
    })
    try{
        const newInfo = await info.save();
        res.status(201).json(newInfo)
    }
    catch (err){
        res.status(400).json({ message: err.message })
    }
  });
  router.put('/:id', upload.single('filename'), async (req, res) => {
    try {
        const info = await findById(req.params.id);
        if (!info) return res.status(404).json ({ message: 'Record not found'});

        info.name = req.body.name || info.name;
        info.motto = req.body.motto || info.motto;

        if (req.file){
            info.filename = `/uploads/${req.file.filename}`;
        }

        await info.save();
        res.json(info);
    }
    catch (err) {
        res.status(400).json({ messages: err.message });
    }
  });
  router.delete('/:id', async (req, res) => {
    try{
        const info = await findById(req.params.id);
        if (!info) return res.status(404).json ({ message: 'Record not found'});

        await deleteOne({_id: req.params.id });
        res.json({ message: 'Record deleted'})
    }
    catch (err) {
        console.error('Error deleting:', err);
        res.status(500).json({ message: err.message });
    }
  });

  export default router;