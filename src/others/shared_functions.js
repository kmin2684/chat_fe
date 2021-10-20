function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

export function StringToColor(string) {
  let colorMap = {
    0: "#313E50",
    1: "#924C5D",
    2: "#C5867A",
    3: "#E1915E",
    4: "#E17F5E",
    5: "#85A47A",
  };

  let sum = 0;
  for (let char of string) {
    sum += char.charCodeAt(0);
  }

  return colorMap[sum % 6];
}

export function MobileViewSide(viewSide) {
  let show;
  let hide;
  if (viewSide === "left") {
    show = "left";
    hide = "right";
  } else if (viewSide === "right") {
    show = "right";
    hide = "left";
  } else {
    console.log("invalide viewSide for MobileViewSide function");
    return;
  }
  // add className of "ShowIfMobile" to the element that will be displayed
  let sideDisplayed = document.querySelector(`.${show}`);
  let originalClassList = sideDisplayed.classList.value
    .split(/(\s+)/)
    .filter(function (e) {
      return e.trim().length > 0;
    });
  let uniqueClassList = [...new Set(originalClassList)];
  let modifiedClassList = uniqueClassList.filter(
    (e) => !(e === "HideIfMobile" || e === "ShowIfMobile")
  );
  sideDisplayed.classList.remove(...originalClassList);
  sideDisplayed.classList.add(...[...modifiedClassList, "ShowIfMobile"]);

  // add className of "HideIfMobile" to the element that will be displayed
  let sideHidden = document.querySelector(`.${hide}`);
  if (!sideHidden) {
    console.log("no side to hide");
    return;
  }
  console.log("side hidden", sideHidden);
  originalClassList = sideHidden?.classList?.value
    ?.split(/(\s+)/)
    .filter(function (e) {
      return e.trim().length > 0;
    });
  uniqueClassList = [...new Set(originalClassList)];
  modifiedClassList = uniqueClassList.filter(
    (e) => !(e === "HideIfMobile" || e === "ShowIfMobile")
  );
  sideHidden.classList.remove(...originalClassList);
  sideHidden.classList.add(...[...modifiedClassList, "HideIfMobile"]);
  return;
}

export function SaveUserInfo(userInfo) {
  if (typeof Storage !== "undefined") {
    if (!userInfo) localStorage.ChatUserInfo = null;
    else localStorage.ChatUserInfo = JSON.stringify(userInfo);
    console.log("user info saved in local storage");
  } else {
    console.log("unable to use localStorage");
  }
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function GetChatTitle(currentChat, chats, userInfo) {
  let displayedChat;
  if (!currentChat) return undefined;
  displayedChat = chats?.find((chat) => chat.id == currentChat);

  if (displayedChat?.name) return displayedChat.name;
  else {
    return displayedChat?.members?.find(
      (member) => member !== userInfo?.username
    );
  }
}
