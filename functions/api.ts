// Start up the Node server
import * as express from 'express';

import ArticleHistoryService from './src/article/ArticleHistoryService';
import ArticleServiceFactory from './src/article/ArticleServiceFactory';
import notifyHandler from './src/notification/notificationHandler';
import StoryServiceFactory from './src/story/StoryServiceFactory';
import { ttsArticle } from './tts';
require('dotenv').config();
const axios = require('axios');


const app = express();
var router = express.Router();

const compression = require('compression');

const cors = require('cors');
const sharp = require('sharp');
const request = require('request');

router.use(compression());
router.use(cors());
router.use(express.json());
router.get('/story', async (req, res) => {
  const story = await StoryServiceFactory.get(req).getStories();
  res.send(story);
});

router.get('/article', async (req, res) => {
  const { category, url } = req.query;
  const article = await ArticleServiceFactory.get(category as string).getArticleById(url as string);
  res.send(article);
});

router.get('/articles/read', async (req, res) => {
  res.send(await new ArticleHistoryService(req.query.googleId as string).getReadArticle());
});


router.put('/articles/read', async (req, res) => {
  res.send(await new ArticleHistoryService(req.query.googleId as string).readArticle(req.body.articleId as string, req.body.categoryId as string));
});
router.get('/cachestory', async (req, res) => {
  const result = await StoryServiceFactory.get(req).cache();
  res.send({ articles: result, number: result.length });
});

// TODO: extract to separate file
router.get('/redirect', async (req, res) => {
  const url = req.query.url as string;
  try {
    const response = await axios.get(url);

    const headerString = /<head([^>]*)>/gm.exec(response.data as string)?.[0] as string;
    const data = (response.data as string).replace(
      headerString,
      `${headerString}<base href="${new URL(url).origin}" /><meta content="width=device-width, initial-scale=1, maximum-scale=5" name="viewport" />
      <script>
      window.addEventListener('DOMContentLoaded', (event) => {
        setTimeout(function (){
          var parent = window.parent;
          parent.postMessage({height:document.documentElement.scrollHeight},'*');

        })
     });
     
      </script>`
    );

    res.send(data);
  } catch (error) {
    res.status(404).send();
  }
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
  const audio = await ttsArticle(article);
  res.end(Buffer.from(audio as any, 'binary'));
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
