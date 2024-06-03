const tabs = document.querySelector(".tabs");
const bubbles = document.querySelector(".bubbles");
const actions = document.querySelector(".actions");
const height = document.querySelector("#height");
const width = document.querySelector("#width");

let initialWindowHeight = window.visualViewport
  ? window.visualViewport.height
  : window.innerHeight;
let initialWindowWidth = window.visualViewport
  ? window.visualViewport.width
  : window.innerWidth;

height.innerHTML = `newHeight is ${initialWindowHeight}px`;
width.innerHTML = `newWidth is is ${initialWindowWidth}px`;

const updateHeightAndWidthInfo = (newWidth, newHeight) => {
  height.innerHTML = `newHeight is ${newHeight}px`;
  width.innerHTML = `newWidth is ${newWidth}px`;
};

const handleResize = (newWidth, newHeight) => {
  console.log("newWidth: ", newWidth);
  console.log("newHeight: ", newHeight);
  console.log("initialWindowHeight: ", initialWindowHeight);
  console.log("initialWindowWidth: ", initialWindowWidth);

  // Если перевернули девайс
  if (initialWindowWidth !== newWidth && initialWindowHeight !== newHeight) {
    return;
  }

  // Вычитаем 100 пикселей т.к. в браузерах навбар умеет прятаться. То есть проверяем что экран уменьшился на большую высоту, чем навбар
  if (newHeight < initialWindowHeight - 100) {
    tabs.setAttribute("hidden", "true");
    actions.setAttribute("hidden", "true");
    bubbles.removeAttribute("hidden");
  } else {
    tabs.removeAttribute("hidden");
    actions.removeAttribute("hidden");
    bubbles.setAttribute("hidden", "true");
  }

  updateHeightAndWidthInfo(newWidth, newHeight);
};

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () =>
    handleResize(window.visualViewport.width, window.visualViewport.height)
  );
} else {
  window.addEventListener("resize", () =>
    handleResize(window.innerWidth, window.innerHeight)
  );
}

// Портретная или горизонтальная ориентация
const portrait = window.matchMedia("(orientation: portrait)");
portrait.addEventListener("change", () => {
  initialWindowWidth = window.innerWidth;
  initialWindowHeight = window.innerHeight;

  updateHeightAndWidthInfo(initialWindowWidth, initialWindowHeight);
});
