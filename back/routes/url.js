import { serviceRouteWrap } from "../modules/misc.js";
import services from "../services/index.js";
import express from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/:shortened', serviceRouteWrap(services.redirectToUrl));
router.post('/', serviceRouteWrap(services.shortenUrl));

export default router;
