const totalMemories = 17;

const imageFolder = "images";
const audioFolder = "audio";

const imagePrefix = "memory-";
const audioPrefix = "message-";

const imageExtension = "jpg";
const audioExtension = "mp3";

const slidesContainer = document.getElementById("memorySlides");
const audio = document.getElementById("memoryAudio");
const startButton = document.getElementById("memoryStartButton");
const pauseButton = document.getElementById("memoryPauseButton");
const statusText = document.getElementById("memoryStatus");

let currentIndex = 0;
let hasStarted = false;

const playlist = Array.from({ length: totalMemories }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    title: `Memory ${index + 1}`,
    image: `${imageFolder}/${imagePrefix}${number}.${imageExtension}`,
    audio: `${audioFolder}/${audioPrefix}${number}.${audioExtension}`
  };
});

playlist.forEach((item) => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;

  slide.appendChild(image);
  slidesContainer.appendChild(slide);
});

const memorySwiper = new Swiper(".memory-swiper", {
  loop: false,
  speed: 600,

  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});

function loadTrack(index, shouldPlay = false) {
  currentIndex = index;

  const track = playlist[currentIndex];

  audio.src = track.audio;
  audio.load();

  statusText.textContent = `Loaded: ${track.title}`;

  if (shouldPlay) {
    playCurrentTrack();
  }
}

function playCurrentTrack() {
  const track = playlist[currentIndex];

  audio.play()
    .then(() => {
      hasStarted = true;
      startButton.textContent = "Restart playlist";
      pauseButton.textContent = "Pause";
      statusText.textContent = `Now playing: ${track.title}`;
    })
    .catch(() => {
      statusText.textContent = "Press Start to play the audio.";
    });
}

function goToTrack(index, shouldPlay = hasStarted) {
  memorySwiper.slideTo(index);
  loadTrack(index, shouldPlay);
}

startButton.addEventListener("click", () => {
  goToTrack(0, true);
});

pauseButton.addEventListener("click", () => {
  if (audio.paused) {
    playCurrentTrack();
    pauseButton.textContent = "Pause";
  } else {
    audio.pause();
    pauseButton.textContent = "Resume";
    statusText.textContent = "Paused";
  }
});

audio.addEventListener("ended", () => {
  const nextIndex = currentIndex + 1;

  if (nextIndex < playlist.length) {
    goToTrack(nextIndex, true);
  } else {
    statusText.textContent = "Playlist finished";
    startButton.textContent = "Play again";
    pauseButton.textContent = "Pause";
    hasStarted = false;
  }
});

memorySwiper.on("slideChange", () => {
  const newIndex = memorySwiper.activeIndex;

  if (newIndex !== currentIndex) {
    loadTrack(newIndex, hasStarted);
  }
});

loadTrack(0, false);