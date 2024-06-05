const tabs = document.querySelector(".tabs");
const paginator = document.querySelector(".paginator");
const bubbles = document.querySelector(".bubbles");
const actions = document.querySelector(".actions");
const input = document.querySelector(".input");
const wrapper = document.querySelector(".wrapper");
const info = document.querySelector(".info");

input.addEventListener("focus", () => {
  // tabs.setAttribute("hidden", "true");
  actions.setAttribute("hidden", "true");
  bubbles.removeAttribute("hidden");
});

input.addEventListener("blur", () => {
  // tabs.removeAttribute("hidden");
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
  });
}

window.visualViewport.addEventListener("scroll", viewportHandler);
window.visualViewport.addEventListener("resize", viewportHandler);
