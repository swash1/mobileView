const tabs = document.querySelector(".tabs");
const paginator = document.querySelector(".paginator");
const bubbles = document.querySelector(".bubbles");
const actions = document.querySelector(".actions");
const input = document.querySelector(".input");
const topBar = document.querySelector(".topBar");
const info = document.querySelector(".info");

function debounce(fn, delay) {
  let timerId;

  return function (...args) {
    // Если таймер уже существует, очистим его (сбросим время)
    if (timerId) {
      clearTimeout(timerId);
    }

    // Устанавливаем новый таймер
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

input.addEventListener("focus", () => {
  tabs.setAttribute("hidden", "true");
  actions.setAttribute("hidden", "true");
  bubbles.removeAttribute("hidden");
});

input.addEventListener("blur", () => {
  tabs.removeAttribute("hidden");
  actions.removeAttribute("hidden");
  bubbles.setAttribute("hidden", "true");
});

const bottomBar = document.querySelector(".bottombar");
const viewport = window.visualViewport;
let pendingUpdate = false;

function viewportHandler(event) {
  if (pendingUpdate) return;
  pendingUpdate = true;

  requestAnimationFrame(() => {
    pendingUpdate = false;
    const layoutViewport = document.getElementById("layoutViewport");

    // Since the bar is position: fixed we need to offset it by the
    // visual viewport's offset from the layout viewport origin.
    const viewport = event.target;
    const offsetLeft = viewport.offsetLeft;
    const offsetTop =
      viewport.height -
      layoutViewport.getBoundingClientRect().height +
      viewport.offsetTop;

    // You could also do this by setting style.left and style.top if you
    // use width: 100% instead.
    bottomBar.style.transform = `translate(${offsetLeft}px, ${offsetTop}px) scale(${
      1 / viewport.scale
    })`;

    bottomBar.removeAttribute("hidden");
    topBar.removeAttribute("hidden");
  });
}

const showBars = () => {
  bottomBar.removeAttribute("hidden");
  topBar.removeAttribute("hidden");
};

const debouncedViewportHandler = debounce(viewportHandler, 300);
const debouncedShowBars = debounce(showBars, 300);

const handleViewport = (e) => {
  bottomBar.setAttribute("hidden", "true");
  topBar.setAttribute("hidden", "true");

  debouncedViewportHandler(e);
};

window.visualViewport.addEventListener("scroll", (e) => handleViewport(e));
window.visualViewport.addEventListener("resize", (e) => handleViewport(e));

window.addEventListener("scroll", () => {
  bottomBar.setAttribute("hidden", "true");
  topBar.setAttribute("hidden", "true");

  debouncedShowBars();
});
