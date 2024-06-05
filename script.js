const tabs = document.querySelector(".tabs");
const paginator = document.querySelector(".paginator");
const snippets = document.querySelector(".snippets");
const controls = document.querySelector(".controls");
const input = document.querySelector(".input");
const topBar = document.querySelector(".topBar");
const bottomBar = document.querySelector(".bottomBar");

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

const focusOnInput = (e) => {
  e.preventDefault();
  input.focus();
};

snippets.addEventListener("mousedown", focusOnInput);

input.addEventListener("focus", () => {
  tabs.setAttribute("hidden", "true");
  controls.setAttribute("hidden", "true");
  snippets.removeAttribute("hidden");
});

input.addEventListener("blur", () => {
  tabs.removeAttribute("hidden");
  controls.removeAttribute("hidden");
  snippets.setAttribute("hidden", "true");
});

const viewport = window.visualViewport;
let pendingUpdate = false;

function viewportHandler(event) {
  if (pendingUpdate) return;
  pendingUpdate = true;

  requestAnimationFrame(() => {
    pendingUpdate = false;
    const layoutViewport = document.querySelector(".layoutViewport");

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

const debouncedViewportHandler = debounce(viewportHandler, 500);
const debouncedShowBars = debounce(showBars, 500);

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
