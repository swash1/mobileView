const tabs = document.querySelector(".tabs");
const paginator = document.querySelector(".paginator");
const snippets = document.querySelector(".snippets");
const controls = document.querySelector(".controls");
const input = document.querySelector(".input");
const topBar = document.querySelector(".topBar");
const bottomBar = document.querySelector(".bottomBar");

debounce = (fn, delay) => {
  let timerId;

  return (...args) => {
    // Если таймер уже существует, очистим его (сбросим время)
    if (timerId) {
      clearTimeout(timerId);
    }

    // Устанавливаем новый таймер
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// Если нажимаем на сниппет, не снимать фокус с инпута и не скрывать клавиатуру
const focusOnInput = (e) => {
  e.preventDefault();
  input.focus();
};
snippets.addEventListener("mousedown", focusOnInput);

// При фокусе на клавиатуру прячем ненужные элементы и отображаем нужные
// Можно будет прикрутить анимацию появления, чтобы было поприятнее
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

// Предотваращет лишние перерисовки, т.к. ивент вызывает на resize и scroll, а эти события могут происходить одновременно
let pendingUpdate = false;

const viewportHandler = (event) => {
  if (pendingUpdate) return;
  pendingUpdate = true;

  // requestAnimationFrame гарантирует что изменения произойдут перед следующим рендерингом
  requestAnimationFrame(() => {
    pendingUpdate = false;
    const layoutViewport = document.querySelector(".layoutViewport");

    // т.к. позиция верхнего и нижнего баров с position fixed считается
    // для layout viewport, то нам надо сделать некоторые расчеты
    // чтобы такие элементы спозиционировались для visual viewport
    const viewport = event.target;
    // Если пользователь увеличил экран и у него есть какой-то отступ от краев
    const offsetLeft = viewport.offsetLeft;
    // Считаем насколько надо поднять bottom bar
    const offsetTopForBottomBar =
      viewport.height -
      layoutViewport.getBoundingClientRect().height +
      viewport.offsetTop;

    // document.querySelector("#height").innerHTML = "vvh " + viewport.height;
    // document.querySelector("#layoutViewport").innerHTML =
    //   "lvh " + layoutViewport.getBoundingClientRect().height;
    // document.querySelector("#offsetTop").innerHTML = "ot " + viewport.offsetTop;

    // Поднимаем bottom bar
    bottomBar.style.transform = `translate(${offsetLeft}px, ${offsetTopForBottomBar}px) scale(${
      1 / viewport.scale
    })`;

    // Опускаем bottom bar, если позиция верха visual viewport != позиции верха layout viewport
    topBar.style.transform = `translate(${offsetLeft}px, ${
      viewport.offsetTop
    }px) scale(${1 / viewport.scale})`;
  });

  bottomBar.removeAttribute("hidden");
  topBar.removeAttribute("hidden");
};

const showBars = () => {
  bottomBar.removeAttribute("hidden");
  topBar.removeAttribute("hidden");
};

// Дебаунс чтобы предотвратить "мерцания" во время скрытия и показа
const debouncedViewportHandler = debounce(viewportHandler, 500);
const debouncedShowBars = debounce(showBars, 500);

// Прячем когда начали скроллить, тк например айфон переопределяет параметры visual viewport только после окончания скролла, и элементы во время начала скролла остаются на своем месте и улетают вместе со страницей.
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
