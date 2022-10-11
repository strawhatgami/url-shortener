import services from "../services/index.js";
import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({});
});

export default router;
