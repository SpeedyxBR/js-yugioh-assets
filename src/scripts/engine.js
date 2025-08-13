const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },

  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },

  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(randomIdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", randomIdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    // enable drag support (desktop)
    cardImage.setAttribute("draggable", "true");
    cardImage.addEventListener("dragstart", (ev) => {
      try {
        ev.dataTransfer.setData("text/plain", String(randomIdCard));
      } catch (_) {}
    });

    // enable touch support (mobile) com feedback e highlight dinâmico
    let touchMoveListener;
    cardImage.addEventListener(
      "touchstart",
      (ev) => {
        ev.preventDefault();
        cardImage.classList.add("touch-dragging");
        const dropZone = document.getElementById("player-drop-zone");
        if (dropZone) dropZone.classList.add("is-dragover");

        touchMoveListener = (e) => {
          const t = e.touches && e.touches[0];
          if (!t) return;
          if (dropZone) {
            const r = dropZone.getBoundingClientRect();
            const inside =
              t.clientX >= r.left && t.clientX <= r.right && t.clientY >= r.top && t.clientY <= r.bottom;
            dropZone.classList.toggle("is-dragover", inside);
          }
        };
        cardImage.addEventListener("touchmove", touchMoveListener, { passive: false });
      },
      { passive: false }
    );

    cardImage.addEventListener("touchend", (ev) => {
      cardImage.classList.remove("touch-dragging");
      if (touchMoveListener) {
        cardImage.removeEventListener("touchmove", touchMoveListener);
        touchMoveListener = null;
      }
      const touch = ev.changedTouches && ev.changedTouches[0];
      const dropZone = document.getElementById("player-drop-zone");
      if (!touch || !dropZone) return;

      const rect = dropZone.getBoundingClientRect();
      const x = touch.clientX;
      const y = touch.clientY;
      const inside =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      dropZone.classList.remove("is-dragover");
      if (inside) {
        setCardsField(String(randomIdCard));
      }
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(randomIdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsInField(cardId, computerCardId);

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  }

  if (value === false) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  }
}

function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win";
    state.score.playerScore++;
  }

  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose";
    state.score.computerScore++;
  }

  await playAudio(duelResults);

  return duelResults;
}

async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides;
  let imgElements = computerBOX.querySelectorAll("img");

  imgElements.forEach((img) => img.remove());
  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  await removeAllCardsImages();

  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  updateScore();
}

state.actions.button.addEventListener("click", () => {
  resetDuel();
});

// audio controls
let sfxVolume = 0.8;
let sfxMuted = false;

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.volume = sfxMuted ? 0 : sfxVolume;
  try {
    await audio.play();
  } catch (error) {
    console.error("Erro ao reproduzir SFX");
  }
}

function init() {
  showHiddenCardFieldsImages(false);

  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  updateScore();

  setupDragAndDrop();
  setupStartOverlay();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

function setupDragAndDrop() {
  const dropZone = document.getElementById("player-drop-zone");
  if (!dropZone) return;

  function clearDragState() {
    dropZone.classList.remove("is-dragover");
  }

  dropZone.addEventListener("dragover", (ev) => {
    ev.preventDefault();
  });

  dropZone.addEventListener("dragenter", () => {
    dropZone.classList.add("is-dragover");
  });

  dropZone.addEventListener("dragleave", clearDragState);

  dropZone.addEventListener("drop", (ev) => {
    ev.preventDefault();
    clearDragState();
    let data = "";
    try {
      data = ev.dataTransfer.getData("text/plain");
    } catch (_) {}
    if (data !== "") {
      setCardsField(data);
    }
  });
}

function setupStartOverlay() {
  const overlay = document.getElementById("start-overlay");
  const startBtn = document.getElementById("start-game");
  const bgm = document.getElementById("bgm");
  const bgmVolume = document.getElementById("bgm-volume");
  const sfxVol = document.getElementById("sfx-volume");
  const muteBgm = document.getElementById("mute-bgm");
  const muteSfx = document.getElementById("mute-sfx");

  if (!overlay || !startBtn || !bgm) return;

  // defaults
  bgm.volume = bgmVolume ? Number(bgmVolume.value) : 0.6;
  sfxVolume = sfxVol ? Number(sfxVol.value) : 0.8;
  bgm.muted = muteBgm ? muteBgm.checked : false;
  sfxMuted = muteSfx ? muteSfx.checked : false;

  startBtn.addEventListener("click", async () => {
    try {
      await bgm.play();
    } catch (_) {}
    overlay.style.display = "none";
  });

  if (bgmVolume) {
    bgmVolume.addEventListener("input", () => {
      bgm.volume = Number(bgmVolume.value);
    });
  }
  if (sfxVol) {
    sfxVol.addEventListener("input", () => {
      sfxVolume = Number(sfxVol.value);
    });
  }
  if (muteBgm) {
    muteBgm.addEventListener("change", () => {
      bgm.muted = muteBgm.checked;
    });
  }
  if (muteSfx) {
    muteSfx.addEventListener("change", () => {
      sfxMuted = muteSfx.checked;
    });
  }
}
