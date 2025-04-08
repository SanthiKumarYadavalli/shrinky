import express from 'express';
import UrlController from '../controllers/url.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();
const urlController = new UrlController();

router.post('/', auth, urlController.createShortUrl);
router.get('/', auth, urlController.getAllUrls);
router.get('/:id', auth, urlController.getUrlById);
router.put('/:id', auth, urlController.updateUrl);
router.delete('/:id', auth, urlController.deleteUrl);

export default router;
