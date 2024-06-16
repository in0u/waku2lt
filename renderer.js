document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  // const quitButton = document.getElementById('quitButton');
  const secondsSelect = document.getElementById("seconds");
  const countSelect = document.getElementById("count");
  const settingsScreen = document.getElementById("settingsScreen");
  const displayScreen = document.getElementById("displayScreen");
  const timerElement = document.getElementById("timeLeft");
  const titleContainer = document.getElementById("titleContainer");
  const imageContainer = document.getElementById("imageContainer");
  const nextImageContainer = document.getElementById("nextImageContainer");

  startButton.addEventListener("click", () => {
    const seconds = secondsSelect.value;
    const count = countSelect.value;
    window.electronAPI.startDisplay({ seconds, count });

    settingsScreen.style.display = "none";
    displayScreen.style.display = "block";
  });

  // quitButton.addEventListener('click', () => {
  //   window.electronAPI.quitApp();
  // });

  window.electronAPI.onDisplayImages((event, data) => {
    const { seconds, count } = data;
    const imagesDirectory = window.electronAPI.getPath("assets/images");
    const images = window.electronAPI.readImageFiles(imagesDirectory);
    const titles = window.electronAPI.readJSONFile();
    const title = getRandomItem(titles).topic; //タイトル確定
    startInitialDisplay(
      images,
      title,
      seconds,
      count,
      timerElement,
      titleContainer,
      imageContainer,
      nextImageContainer
    );
  });
});

function startInitialDisplay(
  images,
  title,
  displayDuration,
  totalCount,
  timerElement,
  titleContainer,
  imageContainer,
  nextImageContainer
) {
  const startImage = window.electronAPI.getPath("assets/start.png"); // 初回に表示する画像のパス
  const startNextImage = getRandomItem(images); //最初にnextに表示する画像

  updateContent(
    imageContainer,
    nextImageContainer,
    titleContainer,
    startImage,
    startNextImage,
    title
  );

  // 初回の画像とタイトルを5秒表示
  setTimeout(() => {
    startImageDisplayCycle(
      images,
      startNextImage,
      title,
      displayDuration,
      totalCount,
      timerElement,
      titleContainer,
      imageContainer,
      nextImageContainer
    );
  }, 5000);

  startCountdown(5, timerElement, () => {
    startImageDisplayCycle(
      images,
      title,
      displayDuration,
      totalCount,
      timerElement,
      titleContainer,
      imageContainer,
      nextImageContainer
    );
  });
  // startImageDisplayCycle(images, title, displayDuration, totalCount, timerElement, titleContainer, imageContainer,nextImageContainer);
}

function startImageDisplayCycle(
  images,
  title,
  displayDuration,
  totalCount,
  timerElement,
  titleContainer,
  imageContainer,
  nextImageContainer
) {
  let currentIndex = 0;
  let next = getRandomItem(images);

  const displayNextContent = () => {
    if (currentIndex < totalCount) {
      const randomImage = getRandomItem(images);
      updateContent(
        imageContainer,
        nextImageContainer,
        titleContainer,
        next,
        randomImage,
        title
      );
      currentIndex++;
      next = randomImage;
      startCountdown(displayDuration, timerElement, displayNextContent);
      //最後の前はNext非表示
      if (currentIndex == totalCount) {
        nextImageContainer.style.display = "none";
      }
    } else {
      //終了表示
      const endImage = window.electronAPI.getPath("assets/end.png"); // 初回に表示する画像のパス
      updateContent(
        imageContainer,
        nextImageContainer,
        titleContainer,
        endImage,
        endImage,
        "終了"
      );
    }
  };

  displayNextContent();
}

function startCountdown(duration, timerElement, callback) {
  let timeLeft = duration;
  timerElement.textContent = timeLeft;

  const countdownInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      callback();
    }
  }, 1000);
}

function updateContent(
  imageContainer,
  nextImageContainer,
  titleContainer,
  imagePath,
  nextImage,
  title
) {
  imageContainer.innerHTML = `<img src="${imagePath}" alt="Random Image">`;
  nextImageContainer.innerHTML = `<img src="${nextImage}" alt="Random Image">`;
  titleContainer.innerHTML = `<h2>${title}</h2>`;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
