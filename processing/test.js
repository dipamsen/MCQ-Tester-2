const bar = new ProgressBar(":current/:total :bar", { total: 1000 });
const timer = setInterval(function () {
  bar.tick();
  if (bar.complete) {
    console.log("\ncomplete\n");
    clearInterval(timer);
  }
}, 10);
