const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    draws: 0,
    totalGames: 0,
    winStreak: 0,
    bestWinStreak: 0,
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
    WinOf: [1, 3, 6],
    LoseOf: [2, 4, 7],
  },

  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2, 4, 7],
    LoseOf: [0, 3, 6],
  },

  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0, 3, 6],
    LoseOf: [1, 4, 7],
  },

  {
    id: 3,
    name: "Red Eyes Black Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1, 4, 7],
    LoseOf: [2, 5, 8],
  },

  {
    id: 4,
    name: "Dark Magician Girl",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2, 5, 8],
    LoseOf: [0, 3, 6],
  },

  {
    id: 5,
    name: "Exodia Necross",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0, 3, 6],
    LoseOf: [1, 4, 7],
  },

  {
    id: 6,
    name: "Blue Eyes Ultimate Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1, 4, 7],
    LoseOf: [2, 5, 8],
  },

  {
    id: 7,
    name: "Magician of Black Chaos",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2, 5, 8],
    LoseOf: [0, 3, 6],
  },

  {
    id: 8,
    name: "Exodia the Forbidden One",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0, 3, 6],
    LoseOf: [1, 4, 7],
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
              t.clientX >= r.left &&
              t.clientX <= r.right &&
              t.clientY >= r.top &&
              t.clientY <= r.bottom;
            dropZone.classList.toggle("is-dragover", inside);
          }
        };
        cardImage.addEventListener("touchmove", touchMoveListener, {
          passive: false,
        });
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
      playHoverSound();
    });

    cardImage.addEventListener("click", () => {
      playSelectSound();
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

  // Adicionar efeito especial para vitória
  if (
    text.toLowerCase().includes("ganhou") ||
    text.toLowerCase().includes("win")
  ) {
    state.actions.button.classList.add("victory-button");
  } else {
    state.actions.button.classList.remove("victory-button");
  }
}

async function updateScore() {
  const winRate =
    state.score.totalGames > 0
      ? Math.round((state.score.playerScore / state.score.totalGames) * 100)
      : 0;

  state.score.scoreBox.innerHTML = `
    <div style="font-size: 0.9em; margin-bottom: 5px;">
      <strong>Vitórias:</strong> ${state.score.playerScore} | 
      <strong>Derrotas:</strong> ${state.score.computerScore} | 
      <strong>Empates:</strong> ${state.score.draws}
    </div>
    <div style="font-size: 0.8em; color: #666;">
      Taxa de Vitória: ${winRate}% | 
      Sequência: ${state.score.winStreak} | 
      Melhor Sequência: ${state.score.bestWinStreak}
    </div>
  `;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  state.score.totalGames++;

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win";
    state.score.playerScore++;
    state.score.winStreak++;
    if (state.score.winStreak > state.score.bestWinStreak) {
      state.score.bestWinStreak = state.score.winStreak;
    }
    // Adicionar animação de vitória
    addVictoryAnimation();
    triggerHapticFeedback("success");
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose";
    state.score.computerScore++;
    state.score.winStreak = 0;
    // Adicionar animação de derrota
    addLoseAnimation();
    triggerHapticFeedback("error");
  } else {
    duelResults = "draw";
    state.score.draws++;
    state.score.winStreak = 0;
    triggerHapticFeedback("medium");
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

// Cache de áudios para melhor performance
const audioCache = new Map();

async function playAudio(status) {
  if (sfxMuted) return;

  try {
    let audio = audioCache.get(status);
    if (!audio) {
      audio = new Audio(`./src/assets/audios/${status}.wav`);
      audio.volume = sfxVolume;
      audioCache.set(status, audio);
    }

    // Clonar o áudio para permitir sobreposição
    const audioClone = audio.cloneNode();
    audioClone.volume = sfxVolume;
    await audioClone.play();
  } catch (error) {
    console.error("Erro ao reproduzir SFX:", error);
  }
}

// Função para feedback tátil em dispositivos móveis
function triggerHapticFeedback(type = "light") {
  if ("vibrate" in navigator) {
    switch (type) {
      case "light":
        navigator.vibrate(50);
        break;
      case "medium":
        navigator.vibrate([50, 30, 50]);
        break;
      case "heavy":
        navigator.vibrate([100, 50, 100]);
        break;
      case "success":
        navigator.vibrate([50, 30, 50, 30, 100]);
        break;
      case "error":
        navigator.vibrate([200, 100, 200]);
        break;
    }
  }
}

// Função para tocar som de hover
function playHoverSound() {
  if (sfxMuted) return;
  triggerHapticFeedback("light");
}

// Função para tocar som de seleção
function playSelectSound() {
  if (sfxMuted) return;
  triggerHapticFeedback("medium");
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

// Funções de animação e efeitos visuais
function addVictoryAnimation() {
  const playerField = document.getElementById("player-drop-zone");
  const computerField = document.querySelector(
    ".card-infield:not(#player-drop-zone)"
  );

  if (playerField) {
    playerField.classList.add("win-animation", "victory-glow");
    createSparkleEffect(playerField);
    createEnergyExplosion(playerField);
  }

  if (computerField) {
    computerField.classList.add("lose-animation");
  }

  // Remover classes após animação
  setTimeout(() => {
    if (playerField) {
      playerField.classList.remove("win-animation", "victory-glow");
    }
    if (computerField) {
      computerField.classList.remove("lose-animation");
    }
  }, 2000);
}

function addLoseAnimation() {
  const playerField = document.getElementById("player-drop-zone");
  const computerField = document.querySelector(
    ".card-infield:not(#player-drop-zone)"
  );

  if (playerField) {
    playerField.classList.add("lose-animation");
  }

  if (computerField) {
    computerField.classList.add("win-animation", "victory-glow");
    createSparkleEffect(computerField);
  }

  // Remover classes após animação
  setTimeout(() => {
    if (playerField) {
      playerField.classList.remove("lose-animation");
    }
    if (computerField) {
      computerField.classList.remove("win-animation", "victory-glow");
    }
  }, 2000);
}

function createSparkleEffect(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Criar múltiplas ondas de partículas
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";

        // Variações de cor e tamanho
        const colors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const angle = (i / 12) * Math.PI * 2;
        const distance = 40 + Math.random() * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        sparkle.style.left = x + "px";
        sparkle.style.top = y + "px";
        sparkle.style.position = "fixed";
        sparkle.style.zIndex = "1000";
        sparkle.style.background = randomColor;
        sparkle.style.width = 3 + Math.random() * 4 + "px";
        sparkle.style.height = sparkle.style.width;
        sparkle.style.boxShadow = `0 0 10px ${randomColor}`;

        // Adicionar rotação aleatória
        sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(sparkle);

        // Remover sparkle após animação
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 1200 + Math.random() * 300);
      }
    }, wave * 200);
  }
}

// Função para criar efeito de explosão de energia
function createEnergyExplosion(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = centerX + "px";
    particle.style.top = centerY + "px";
    particle.style.width = "6px";
    particle.style.height = "6px";
    particle.style.background = "radial-gradient(circle, #ffd700, #ff6b6b)";
    particle.style.borderRadius = "50%";
    particle.style.zIndex = "1000";
    particle.style.pointerEvents = "none";

    // Animação de explosão
    const angle = (i / 20) * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    let x = 0,
      y = 0;
    const animate = () => {
      x += vx;
      y += vy;
      particle.style.left = centerX + x + "px";
      particle.style.top = centerY + y + "px";
      particle.style.opacity = 1 - Math.sqrt(x * x + y * y) / 100;

      if (Math.sqrt(x * x + y * y) < 150) {
        requestAnimationFrame(animate);
      } else {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }
    };

    document.body.appendChild(particle);
    requestAnimationFrame(animate);
  }
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
