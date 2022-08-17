import Victor from "./vic.js";
import { getAnimationCoord, newInput } from "./utils.js";

import { Arm } from "./Arm.js";

let canvas;
let ctx;

let counter = 0;

let arms = new Array();

let mouse = { x: 0, y: 0 };

window.onload = () => {
  // ! smá leyni :Z
  if (window.location.hostname !== "www.sjomli.is") {
    document.querySelector('header').remove();
  }

  canvas = document.querySelector("#c");
  ctx = canvas.getContext("2d");

  document
    .querySelector("button")
    .addEventListener("click", () => newArm(20, 20));

  canvas.addEventListener("mousemove", (e) => {
    mouse = getMousePos(canvas, e);
  });

  newArm(30, 15);
  animate();
};

function animate() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  arms.forEach((arm) => {
    arm.animated
      ? arm.follow(getAnimationCoord(arm.animStyle, counter, canvas.width / 2))
      : arm.follow(mouse);
    if (arm.stuck) arm.stick();
    arm.show();
  });

  counter++;
  window.requestAnimationFrame(animate);
}

function newArm(iNum, iLen) {
  let arm = new Arm(iNum, iLen, ctx);
  arm.animated = true;
  let numSlider = newInput(
    "range",
    "num",
    iNum,
    (e) => {
      arm.num = e.target.value;
    },
    1,
    50
  );
  let lenSlider = newInput(
    "range",
    "len",
    iLen,
    (e) => {
      arm.len = e.target.value;
    },
    1,
    100
  );
  let stuckToggle = newInput("checkbox", "stuck", "", () => {
    arm.stuck = !arm.stuck;
  });
  let xPos = newInput(
    "range",
    "x",
    100,
    (e) => {
      arm.xPos = Number(e.target.value);
    },
    0,
    canvas.width
  );
  let yPos = newInput(
    "range",
    "y",
    100,
    (e) => {
      arm.yPos = Number(e.target.value);
    },
    0,
    canvas.height
  );
  let mouseToggle = newInput("checkbox", "follow mouse", "", () => {
    arm.animated = !arm.animated;
    console.log("arm.animated --> ", arm.animated);
  });

  // * anim dropdown
  let animDropdown = document.createElement("select");
  animDropdown.addEventListener("change", () => {
    arm.animStyle = Number(animDropdown.value);
  });
  let opt1 = document.createElement("option");
  opt1.value = 1;
  opt1.text = "infinity";
  let opt2 = document.createElement("option");
  opt2.value = 2;
  opt2.text = "circle";
  animDropdown.append(opt1, opt2);

  let div = document.createElement("div");
  div.classList.add("cell");
  div.append(
    numSlider,
    lenSlider,
    stuckToggle,
    xPos,
    yPos,
    mouseToggle,
    animDropdown
  );
  document.querySelector(".prison").appendChild(div);
  arms.push(arm);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
