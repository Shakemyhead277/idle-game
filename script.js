const stats = document.getElementById("stats");
const tt = document.getElementById("toggleBar");
const artT = document.getElementById("techart");
const ttext = document.getElementById("ttext");
const acctext = document.getElementById("acctext");
const upgrades = document.getElementById("upgrades");
const penciltext = document.getElementById("penciltext");
const debugBox = document.getElementById("debug");
const optionsMenu = document.getElementById("options");
const root = document.querySelector(":root");

let opt = false;

function options() {
  if (!opt) {
    optionsMenu.style.visibility = "visible";
    opt = true;
  } else {
    optionsMenu.style.visibility = "hidden";
    opt = false;
  }
}

let config = {
  coins: 10,
  cps: 1,
  dark: false,
  time: 1,
  tech: [/*cost*/ 10, /*level*/ 1],
  accfirm: [/*cost*/ 50, /*level*/ 0],
  pencil: [/*cost*/ 75, /*level*/ 0],
  upgrades: [],
};

function getLength(num) {
  let str = num.toString();
  let s = str.length;
  return s;
}

function dak() {
  if (config.dark) {
    config.dark = false;
  } else {
    config.dark = true;
  }
  setVals();
}

function darklight() {
  if (config.dark) {
    root.style.setProperty("--color", "black");
    root.style.setProperty("--color2", "white");
    root.style.setProperty("--color3", "white");
  } else {
    root.style.setProperty("--color", "white");
    root.style.setProperty("--color2", "gray");
    root.style.setProperty("--color3", "black");
  }
}

darklight();

function expo(x) {
  let length = getLength(x);
  if (length > 6) {
    return Number.parseFloat(x).toExponential(1);
  } else {
    return x;
  }
}

if (Object.keys(localStorage).includes("config")) {
  config = JSON.parse(localStorage.getItem("config"));
} else {
  localStorage.setItem("config", JSON.stringify(config));
}

let tBar = false;

function toggleBar() {
  if (!tBar) {
    tBar = true;
    move("techBar");
    tt.textContent = "auto: on";
  } else {
    tBar = false;
    tt.textContent = "auto: off";
  }
}

function getCost(item, amount, multi) {
  let aftAmt = item;
  for (let i = 0; i < amount - 1; i++) {
    aftAmt = aftAmt + aftAmt * multi;
  }
  return expo(Math.floor(aftAmt));
}

function save() {
  localStorage.setItem("config", JSON.stringify(config));
}

function setVals() {
  root.style.setProperty("--costx1", "'" + expo(config.tech[0]) + "'");
  root.style.setProperty(
    "--costx2",
    "'" + getCost(config.tech[0], 2, 1.1) + "'"
  );
  root.style.setProperty(
    "--costx10",
    "'" + getCost(config.tech[0], 10, 1.1) + "'"
  );
  root.style.setProperty(
    "--costx50",
    "'" + getCost(config.tech[0], 50, 1.1) + "'"
  );
  root.style.setProperty(
    "--costx100",
    "'" + getCost(config.tech[0], 100, 1.1) + "'"
  );
  root.style.setProperty("--costx11", "'" + expo(config.accfirm[0]) + "'");
  root.style.setProperty(
    "--costx21",
    "'" + getCost(config.accfirm[0], 2, 1.2) + "'"
  );
  root.style.setProperty(
    "--costx101",
    "'" + getCost(config.accfirm[0], 10, 1.2) + "'"
  );
  root.style.setProperty(
    "--costx501",
    "'" + getCost(config.accfirm[0], 50, 1.2) + "'"
  );
  root.style.setProperty(
    "--costx1001",
    "'" + getCost(config.accfirm[0], 100, 1.2) + "'"
  );
  root.style.setProperty("--costx12", "'" + expo(config.pencil[0]) + "'");
  root.style.setProperty(
    "--costx22",
    "'" + getCost(config.pencil[0], 2, 1.25) + "'"
  );
  root.style.setProperty(
    "--costx102",
    "'" + getCost(config.pencil[0], 10, 1.25) + "'"
  );
  root.style.setProperty(
    "--costx502",
    "'" + getCost(config.pencil[0], 50, 1.25) + "'"
  );
  root.style.setProperty(
    "--costx1002",
    "'" + getCost(config.pencil[0], 100, 1.25) + "'"
  );
  stats.innerHTML =
    "coins: " + expo(config.coins) + "\nCps: " + expo(config.cps);
  ttext.innerHTML = "tech startup | level: " + config.tech[1];
  acctext.innerHTML = "accounting firm | level: " + config.accfirm[1];
  penciltext.innerHTML = "pencil company | level: " + config.pencil[1];
  darklight();
}

setVals();

function buy(item, amount, multi, cps) {
  let costA = getCost(item[0], amount, multi);
  if (config.coins - costA < 0) {
  } else {
    let cost = getCost(item[0], cps, multi);
    config.coins = config.coins - item[0];
    item[1] = item[1] + amount;
    item[0] = cost;
    config.cps = config.cps + cps;
    stats.innerHTML =
      "coins: " + expo(config.coins) + "\nCps: " + expo(config.cps);
    ttext.innerHTML = "tech startup | level: " + config.tech[1];
    acctext.innerHTML = "accounting firm | level: " + config.accfirm[1];
    penciltext.innerHTML = "pencil company | level: " + config.pencil[1];
    save();
    setVals();
  }
}

stats.innerHTML = "coins: " + expo(config.coins) + "\nCps: " + expo(config.cps);
ttext.innerHTML = "tech startup | level: " + config.tech[1];
acctext.innerHTML = "accounting firm | level: " + config.accfirm[1];
penciltext.innerHTML = "pencil company | level: " + config.pencil[1];

let barMoving = false;
let out;
let outB;

function move(object) {
  const bar = document.getElementById(object);
  out = bar;
  outB = object;
  bar.style.animation = "fill " + config.time + "s linear 1";
  add();
}

let added = false;

function add() {
  if (added) {
  } else {
    added = true;
    out.addEventListener("animationend", function () {
      out.style.animation = "none";
      out.offsetHeight;
      out.style.animation = null;
      config.coins = config.coins + config.cps;
      console.log(config.coins + config.cps);
      stats.innerHTML =
        "coins: " + expo(config.coins) + "\nCps: " + expo(config.cps);
      save();
      if (tBar) {
        move(outB);
      }
    });
  }
}

function addText(object) {
  const div = document.createElement("input");
  div.value = object;
  div.style.width = "96%";
  debugBox.appendChild(div);
  div.addEventListener("input", function () {
    let val = div.value.split(":");
    let val1 = val[1].split(",");
    if (val[0].includes("coins")) {
      config.coins = +val1;
    } else if (val[0].includes("cps")) {
      config.cps = +val1;
    } else if (val[0].includes("time")) {
      config.time = +val1;
    } else if (val[0].includes("tech")) {
      config.tech[0] = +val1[0];
      config.tech[1] = +val1[1];
    } else if (val[0].includes("accfirm")) {
      config.accfirm[0] = +val1[0];
      config.accfirm[1] = +val1[1];
    } else if (val[0].includes("dark")) {
      if (val1 == "true") {
        config.dark = true;
      } else if (val1 == "false") {
        config.dark = false;
      }
    } else if (val[0].includes("pencil")) {
      config.pencil[0] = +val1[0];
      config.pencil[1] = +val1[1];
    }
    setVals();
    save();
  });
}

let on = false;

function debug() {
  if (on) {
  } else {
    on = true;
    let x = Object.keys(config);
    let res = [];
    for (var i in config) {
      addText("config." + i + ":" + config[i]);
    }
  }
}

function addUpgrade(id, price, name) {
  const button = document.createElement("button");
  const textBox = document.createElement("div");
  const text = document.createElement("div");
  text.innerHTML = name;
  text.style.position = "absolute";
  text.style.width = "242px";
  text.style.marginTop = "5px";
  text.style.textAlign = "center";
  textBox.style.height = "30px";
  textBox.style.width = "296px";
  textBox.style.marginTop = "4px";
  textBox.style.marginLeft = "2px";
  textBox.style.outline = "solid 1px grey";
  button.innerHTML = "unlock";
  button.style.height = "30px";
  button.style.width = "54px";
  button.style.float = "right";
  upgrades.appendChild(textBox);
  textBox.appendChild(text);
  textBox.appendChild(button);
  button.addEventListener("mouseover", function () {
    button.innerHTML = expo(price);
  });
  button.addEventListener("mouseout", function () {
    button.innerHTML = "unlock";
  });
  button.addEventListener("click", function () {
    if (id === "Aspeed") {
      config.time = config.time / 2;
    }
  });
}

addUpgrade("Aspeed", 10000, "auto speed ÷ 2");
