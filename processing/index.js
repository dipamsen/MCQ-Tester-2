import Tesseract from "tesseract.js";
import { Image } from "image-js";
import Axios from "axios";
import { writeFile } from "fs/promises";
import ProgressBar from "progress";

const allQues = [];

const chaps = ["a", "b", "c", "f", "g", "h", "o"];
const chapNames = {
  a: "The Rise of Nationalism in Europe",
  b: "Resources and Development",
  c: "Agriculture",
  f: "Power Sharing",
  g: "Federalism",
  h: "Development",
  o: "Sectors of Indian Economy",
};
async function makeImg(chap, num) {
  const url = `https://jess.sgp1.cdn.digitaloceanspaces.com/${chap}m${
    num + 100
  }.png`;
  const data = await Tesseract.recognize(url, "eng");
  const words = data.data.words;
  const ans = words.find((word) => word.text === "Ans" || word.text === "Ans:");
  // const res = await Axios.get(url, { responseType: "arraybuffer" });
  // const img = await Image.load(res.data);
  // const ques = img.crop({
  //   height: ans.bbox.y0,
  // });
  // const croppedUrl = ques.toDataURL("image/png");
  try {
    var correctOpt = [...data.data.text.matchAll(/Ans\s*\:\s+\((.)\)/g)][0][1];
  } catch (e) {
    // console.log(data.data.text, num);
    // await writeFile("SST.json", JSON.stringify(allQues), "utf8");
    // process.exit(1);
    var correctOpt = "undefined";
  }
  allQues.push({
    yCrop: ans.bbox.y0,
    url,
    correctOpt,
    chapter: chapNames[chap],
  });
  bar.tick();
  if (bar.complete) {
    console.log("\ncomplete\n");
    await writeFile("SST.json", JSON.stringify(allQues), "utf8");
  }
}

const bar = new ProgressBar(":current/:total :bar", { total: 140 });

process.on("uncaughtException", async function (err) {
  console.log("Caught exception: " + err);
  console.log(allQues);
  await writeFile("SST.json", JSON.stringify(allQues), "utf8");
  process.exit(1);
});

(async () => {
  for (let chap of chaps) {
    for (let i = 0; i < 20; i++) {
      await makeImg(chap, i + 1);
    }
  }
})();
