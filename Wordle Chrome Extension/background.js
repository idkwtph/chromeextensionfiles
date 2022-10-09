let answer;
let locationHref;
const answerText = document.getElementById("answer");
const settingsButton = document.querySelector(".settings-button");
let autoFillValue;
var darkModeValue;
chrome.storage.sync.get(function (result) {
  darkModeValue = result.darkMode;
  updateDarkMode();
  autoFillValue = result.autoFill;
});
updateAutoFill();
var url;
chrome.tabs.query(
  {
    active: true,
    currentWindow: true,
  },
  function (tabs) {
    var tab = tabs[0];
    url = tab.url;
  }
);
handleTabUpdate();

window.addEventListener("load", () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      var tab = tabs[0];
      url = tab.url;
    }
  );
  handleTabUpdate();
});

url = JSON.parse(localStorage.getItem("tab")).url;

chrome.runtime.onInstalled.addListener(handleInstalled);
chrome.storage.sync.onChanged.addListener(handleStorageChange);
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  handleTabUpdate();
});

function updateAnswerText(href) {
  url = href;
  chrome.storage.sync.get(function (result) {
    answer = result.wordleAnswer;
  });
  if (typeof url === "undefined") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        var tab = tabs[0];
        url = tab.url;
      }
    );
  }
  if (url == "https://www.nytimes.com/games/wordle/index.html") {
    if (typeof answer !== "undefined") {
      answerText.innerHTML = `The Wordle Answer Is: ${answer}`;
    } else {
      answerText.innerHTML = "ERROR! PLEASE REFRESH THE PAGE!";
    }
  } else {
    answerText.innerHTML =
      "<a href='https://www.nytimes.com/games/wordle/index.html' target='_blank'>Open Today's Wordle</a>";
  }
}

function updateAutoFill() {
  chrome.storage.sync.get(function (result) {
    autoFillValue = result.autoFill;
  });
  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      greeting: "autoFill",
      message: autoFillValue,
    });
  });
}

function updateDarkMode() {
  chrome.storage.sync.get(function (result) {
    darkModeValue = result.darkMode;
  });
  if (darkModeValue) {
    document.body.classList = "dark";
  } else {
    document.body.classList = "light";
  }
  chrome.tabs.query({ active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      greeting: "darkMode",
      message: darkModeValue,
    });
  });
}

function getCurrentTabURL() {
  chrome.tabs.query({ active: true }, function (tabs) {
    return tabs[0].url;
  });
}

function handleInstalled(details) {
  if (details.reason == "installed") {
    chrome.tabs.create({
      url: "chrome-extension://dkdjnmadfgeococnnkmepbnplfllaffg/options.html",
    });
    chrome.storage.sync.set({ autoFill: true });
    chrome.storage.sync.set({ darkMode: true });
    chrome.storage.sync.set({ location: location.href });
    chrome.storage.sync.set({ wordleSync: false });
  } else if (details.reason == "update") {
  }
}

function handleTabUpdate() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      var tab = tabs[0];
      url = tab.url;
    }
  );
  updateAnswerText(url);
}

function handleStorageChange() {
  updateDarkMode();
  updateAutoFill();
}
