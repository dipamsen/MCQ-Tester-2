// express app
const express = require("express");
// middleware
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Image } = require("image-js");
const { default: axios } = require("axios");

const questions = require("./SST.json");

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const cache = [];

// home
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/data/:num", async (req, res) => {
  const { num } = req.params;
  res.send({
    imageUrl: req.protocol + "://" + req.get("host") + "/question/" + num,
    correctOption: questions[num - 1].correctOpt,
  });
});

app.get("/question/:num", async (req, res) => {
  const { num } = req.params;
  const question = questions[num - 1];
  const response = await axios.get(question.url, {
    responseType: "arraybuffer",
  });
  res.type("png");

  if (cache[num - 1]) return res.write(cache[num - 1].toBuffer());
  const image = await Image.load(response.data);
  const cropped = image.crop({ x: 0, y: 0, height: question.yCrop });
  const buffer = cropped.toBuffer();
  cache[num - 1] = cropped;
  res.write(buffer);
});

// port
const port = process.env.PORT || 2453;
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
