import express from 'express';
import { someControllerFunction } from '../controllers/index.js';

const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('Welcome to the Node.js Server!');
});

router.get('/some-endpoint', someControllerFunction);

export default router;