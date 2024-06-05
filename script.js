const tabs = document.querySelector(".tabs");
const paginator = document.querySelector(".paginator");
const bubbles = document.querySelector(".bubbles");
const actions = document.querySelector(".actions");
const input = document.querySelector(".input");
const anotherWrapper = document.querySelector(".another-wrapper");

const updateStyles = (newHeight) => {
  bubbles.style.top = `${newHeight}px`;
};

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () =>
    updateStyles(window.visualViewport.height)
  );
  updateStyles(window.visualViewport.height);
} else {
  window.addEventListener("resize", () => updateStyles(window.innerHeight));
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

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;

    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

let fixPaginatorPosition = 0; // the fix
let lastScrollY = window.scrollY; // the last scroll position
let wrapper = document.querySelector(".wrapper"); // the toolbar wrap

// function to set the margin to show the toolbar if hidden
const setMargin = function () {
  // if toolbar wrap is hidden
  const newPosition = wrapper.getBoundingClientRect().top;
  if (newPosition < -1) {
    // add a margin to show the toolbar
    anotherWrapper.classList.add("down"); // add class so toolbar can be animated
    fixPaginatorPosition = Math.abs(newPosition); // this is new position we need to fix the toolbar in the display
    // if at the bottom of the page take a couple of pixels off due to gap
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      fixPaginatorPosition -= 2;
    }
    // set the margin to the new fixed position
    anotherWrapper.style["margin-top"] = fixPaginatorPosition + "px";
  }
};

// use lodash debounce to stop flicker
const debounceMargin = debounce(setMargin, 150);

// function to run on scroll and blur
const showToolbar = function () {
  // remove animation and put toolbar back in default position
  if (fixPaginatorPosition > 0) {
    anotherWrapper.classList.remove("down");
    fixPaginatorPosition = 0;
    anotherWrapper.style["margin-top"] = 0 + "px";
  }

  // will check if toolbar needs to be fixed
  debounceMargin();
};

// add an event listener to scroll to check if
// toolbar position has moved off the page
window.addEventListener("scroll", showToolbar);
// add an event listener to blur as iOS keyboard may have closed
// and toolbar postition needs to be checked again
input.addEventListener("blur", showToolbar);
