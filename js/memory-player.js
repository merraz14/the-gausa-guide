const totalMemories = 17;

const imageFolder = "images";
const audioFolder = "audio";
const videoFolder = "videos";

const imagePrefix = "memory-";
const audioPrefix = "message-";

const imageExtension = "jpg";
const audioExtension = "mp3";

const videoMemories = {
  11: {
    src: `${videoFolder}/memory-11.mp4`,
    type: "video/mp4"
  }
};

const slidesContainer = document.getElementById("memorySlides");
const audio = document.getElementById("memoryAudio");
const startButton = document.getElementById("memoryStartButton");
const pauseButton = document.getElementById("memoryPauseButton");
const statusText = document.getElementById("memoryStatus");

if (!slidesContainer) {
  throw new Error('Could not find #memorySlides. Check the HTML includes <div id="memorySlides" class="swiper-wrapper">');
}

if (!audio || !startButton || !pauseButton || !statusText) {
  throw new Error("Memory player HTML is incomplete. Check the audio, buttons, and status elements are present.");
}

let currentIndex = 0;
let hasStarted = false;

const playlist = Array.from({ length: totalMemories }, (_, index) => {
  const memoryNumber = index + 1;
  const paddedNumber = String(memoryNumber).padStart(2, "0");

  const item = {
    title: `Memory ${memoryNumber}`,
    audio: `${audioFolder}/${audioPrefix}${paddedNumber}.${audioExtension}`,
    mediaType: "image",
    mediaSrc: `${imageFolder}/${imagePrefix}${paddedNumber}.${imageExtension}`
  };

  if (videoMemories[memoryNumber]) {
    item.mediaType = "video";
    item.mediaSrc = videoMemories[memoryNumber].src;
    item.videoType = videoMemories[memoryNumber].type;
  }

  return item;
});

playlist.forEach((item) => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  if (item.mediaType === "video") {
    const video = document.createElement("video");
    video.src = item.mediaSrc;
    video.type = item.videoType;
    video.controls = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    slide.appendChild(video);
  } else {
    const image = document.createElement("img");
    image.src = item.mediaSrc;
    image.alt = item.title;

    slide.appendChild(image);
  }

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

function getActiveVideo() {
  const activeSlide = memorySwiper.slides[memorySwiper.activeIndex];
  return activeSlide ? activeSlide.querySelector("video") : null;
}

function pauseAllVideos() {
  document.querySelectorAll(".memory-swiper video").forEach((video) => {
    video.pause();
  });
}

function loadTrack(index, shouldPlay = false) {
  currentIndex = index;

  const track = playlist[currentIndex];

  pauseAllVideos();

  audio.src = track.audio;
  audio.load();

  statusText.textContent = `Loaded: ${track.title}`;

  if (shouldPlay) {
    playCurrentTrack();
  }
}

function playCurrentTrack() {
  const track = playlist[currentIndex];
  const activeVideo = getActiveVideo();

  if (activeVideo) {
    activeVideo.play().catch(() => {
      // Video playback may be blocked until user interacts with the video controls.
    });
  }

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
  const activeVideo = getActiveVideo();

  if (audio.paused) {
    playCurrentTrack();
    pauseButton.textContent = "Pause";
  } else {
    audio.pause();

    if (activeVideo) {
      activeVideo.pause();
    }

    pauseButton.textContent = "Resume";
    statusText.textContent = "Paused";
  }
});

audio.addEventListener("ended", () => {
  const nextIndex = currentIndex + 1;

  pauseAllVideos();

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