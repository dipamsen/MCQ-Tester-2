let index = +localStorage.getItem("MCQ__TESTER__IMAGE") || 1;

const qCache = [];

const API_URL =
  location.hostname === "localhost"
    ? "http://localhost:2453"
    : "https://mcq-tester-fp-api.vercel.app";
async function main() {
  if (qCache[index]) {
    var question = qCache[index];
  } else {
    const data = await fetch(API_URL + "/data/" + index);
    var question = await data.json();
  }
  console.log("Received data", question);
  document.querySelector(
    ".image"
  ).innerHTML = `<img src="${question.imageUrl}" alt="" id="question-image">`;
  document.querySelector("#question-index").innerHTML = index;
  const ans = question.correctOption;
  const buttons = [...document.querySelectorAll(".opt")];
  buttons.forEach((button) => {
    button.classList.remove("correct");
    button.classList.remove("wrong");
  });
  // disable next
  document.querySelector(".next").disabled = true;
  const clickEventListener = (e) => {
    const answer = e.target.innerHTML;
    question.attempted = answer;
    if (answer === ans.toUpperCase()) {
      e.target.classList.add("correct");
    } else {
      e.target.classList.add("wrong");
    }
    buttons
      .find((btn) => btn.textContent === ans.toUpperCase())
      .classList.add("correct");
    buttons.forEach((btn) =>
      btn.removeEventListener("click", clickEventListener)
    );
    // enable .next
    document.querySelector(".next").disabled = false;
  };
  buttons.forEach((button) => {
    button.addEventListener("click", clickEventListener);
  });
  if (question.attempted) {
    buttons.find((btn) => btn.textContent === question.attempted).click();
    buttons.forEach((btn) =>
      btn.removeEventListener("click", clickEventListener)
    );
  }
}

main();

// next click -> main()
document.querySelector(".next").addEventListener("click", () => {
  updateIndex(1);
  main();
});
document.querySelector(".previous").addEventListener("click", () => {
  updateIndex(-1);
  main();
});

function updateIndex(num) {
  index += num;
  localStorage.setItem("MCQ__TESTER__IMAGE", index);
  if (index === 1) {
    // disable previous
    document.querySelector(".previous").disabled = true;
  } else {
    document.querySelector(".previous").disabled = false;
  }
  if (index === 140) {
    // disable next
    document.querySelector(".next").disabled = true;
  }
}

function __RESET__() {
  localStorage.removeItem("MCQ__TESTER__IMAGE");
  location.reload();
}
