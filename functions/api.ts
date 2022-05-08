// Start up the Node server
import * as express from 'express';

import StoryServiceFactory from './src/story/StoryServiceFactory';
import ArticleServiceFactory from './src/article/ArticleServiceFactory';
import notifyHandler from './src/notification/notificationHandler';
import { ttsArticle } from './tts';
var cloudscraper = require('cloudscraper');
var proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
var router = express.Router();

const compression = require('compression');

const cors = require('cors');
const sharp = require('sharp');
const request = require('request');
import axios from 'axios';

router.use(compression());
router.use(cors());

router.get('/story', async (req, res) => {
  const story = await StoryServiceFactory.get(req).getStories();
  res.send(story);
});

router.get('/article', async (req, res) => {
  const { category, url } = req.query;
  const article = await ArticleServiceFactory.get(category as string).getArticleById(url as string);
  res.send(article);
});
router.get('/cachestory', async (req, res) => {
  const result = await StoryServiceFactory.get(req).cache();
  res.send({ articles: result, number: result.length });
});

router.get('/search', async (req, res) => {
  const value = await StoryServiceFactory.get(req).search(req.query.pageNumber as string, req.query.keyword as string);
  res.send(value);
});

router.get('/blur', (req, res) => {
  request({ url: req.query.url, encoding: null }, async (err2, res2, bodyBuffer) => {
    try {
      const output = await sharp(bodyBuffer)
        .blur(5)
        .composite([{ input: Buffer.from([0, 0, 0, 128]), tile: true, raw: { width: 1, height: 1, channels: 4 } }])
        .jpeg()
        .toBuffer();
      res.set('Content-Type', 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=31557600');
      res.send(output);
    } catch (e) {
      console.error(e);
      res.send(null);
    }
  });
});

router.get('/tts', async (req, res) => {
  const { category, id } = req.query;
  const article = await ArticleServiceFactory.get(category as string).getArticleById(id as string);

  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
  });
  const autio = await ttsArticle(article);
  res.end(Buffer.from(autio as any, 'binary'));
});

router.get('/test', async (req, res) => {
  cloudscraper.get('https://tinhte.vn/').then(
    (data) => {
      console.log(data);
      res.send(data);
    },
    (data) => {
      console.error(data);
      res.send(data);
    }
  );
});

// regular function
router.use(express.json()); // to support JSON-encoded bodies
router.use(express.urlencoded());

notifyHandler(router);

app.use('/api', router);
app.listen(3001, () => {
  console.log(`Node Express server listening on http://localhost:${3001}`);
});

export default app;
