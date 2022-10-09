const darkModeToggle = document.getElementById("darkModeToggle");
const autoFillToggle = document.getElementById("autofillToggle");
const wordleDarkToggle = document.getElementById("wordleDarkToggle");
const previewImage = document.querySelector(".preview-image");

let isDarkMode;
let isAutoFill;
let isWordleSync;
chrome.storage.sync.get(function (result) {
  isDarkMode = result.darkMode;
  darkModeToggle.setAttribute("isChecked", isDarkMode);
  isAutoFill = result.autoFill;
  autoFillToggle.setAttribute("isChecked", isAutoFill);
  isWordleSync = result.wordleSync;
  wordleDarkToggle.setAttribute("isChecked", isWordleSync);
  update();
});
update();

// setInterval(() => {
//   chrome.storage.sync.set({ location: location.href });
// }, 2000);

wordleDarkToggle.addEventListener("click", () => {
  toggleWordleDark();
});

darkModeToggle.addEventListener("click", () => {
  toggleDarkMode();
});

autoFillToggle.addEventListener("click", () => {
  toggleAutofill();
});

function update() {
  darkModeToggle.setAttribute("isChecked", isDarkMode);
  autoFillToggle.setAttribute("isChecked", isAutoFill);
  wordleDarkToggle.setAttribute("isChecked", isWordleSync);
  if (isDarkMode) {
    document.body.classList = "dark";
  } else {
    document.body.classList = "light";
  }
}

function toggleDarkMode() {
  let isChecked = darkModeToggle.getAttribute("isChecked") === "true";
  isDarkMode = !isChecked;
  darkModeToggle.setAttribute("isChecked", isDarkMode);
  document.body.classList =
    document.body.classList == "dark" ? "light" : "dark";
  chrome.storage.sync.set({ darkMode: isDarkMode }, function () {});
}

function toggleWordleDark() {
  let isChecked = wordleDarkToggle.getAttribute("isChecked") == "true";
  isWordleSync = !isChecked;
  wordleDarkToggle.setAttribute("isChecked", isWordleSync);
  chrome.storage.sync.set({ wordleSync: isWordleSync }, function () {});
}

function toggleAutofill() {
  let isChecked = autoFillToggle.getAttribute("isChecked") === "true";
  isAutoFill = !isChecked;
  autoFillToggle.setAttribute("isChecked", isAutoFill);
  chrome.storage.sync.set({ autoFill: isAutoFill }, function () {});
}

setInterval(() => {
  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { greeting: "location" },
      function (response) {}
    );
  });
}, 2000);
