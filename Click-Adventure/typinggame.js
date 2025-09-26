// Replace the random word generator with a real English word list

// Example word lists (expand as needed)
const beginnerWords = [
  "act","and","are","arm","ask","bad","bag","bee","big","boy","but","buy","can","car","cat","cow",
  "cry","cup","cut","dad","day","did","dog","dry","eat","egg","end","eye","fan","far","few","fix","for","fun","gas","get","had",
  "has","hat","her","him","his","how","ice","ink","key","man","may","mom","now","odd","old","one","out","own","pet","pie","pin","pot",
  "put","red","run","saw","see","she","sit","sun","the","too","toy","two","use","van","was","wet","why","win","you","yes","zip","also",
  "aqua","area","away","baby","back","ball","bank","bean","bear","been","best","blue","boat","book","both","cake","call","care","city",
  "cold","come","cook","cool","dark","desk","door","down","each","east","even","ever","exit","face","fact","fair","feel","feet","fire",
  "five","food","four","from","game","gave","girl","give","gold","good","gone","half","hand","hard","have","head","help","here","hide",
  "high","hold","home","hope","hour","idea","into","iron","item","jobs","join","jump","just","keep","kind","king","know","lace","lake","land","last","late","lead","leaf","life","like","line","live","load","long","look","lost","love","made","main","make",
  "many","mark","mask","meet","much","must","name","near","need","next","nice","nine","nose","note","once","only","open","over","page",
  "pain","pair","part","past","path","play","post","pull","push","quiz","rain","read","real","rest","rice","ride","road","rock","rose","said","safe","sale","same","sand","save","seal","seat","seed","seem","self","sell","send","sent","show",
  "shut","side","sigh","sign","sing","size","skin","sky","slow","snow","soap","soft","sold","some","song","soon","sore","sort","star","stay","step","stop","such","sure","take","talk","tall","tape","task","team","tell","tend","tent","term","that","them","then","they","thin","this","tidy","time","tire","told","tone",
  "took","town","toys","tree","true","try","tune","turn","ugly","unit","upon","used","user","very",
  "view","vote","wait","walk","wall","want","warm","wash","wave","weak","wear","week","well","went","were","west","what","when","will","wind","wise","wish","with","work","your","zero","zone","zoom","zest"
];
const intermediateWords = [
  "about","above","begin","dream","force","heart","house","light","money","world","border","camera","damage","design","father",
  "friend","listen","mother","school","travel","journey", "message", "package", "station"
];
const advancedWords = [
  "keyboard", "monitor", "window", "garden", "bottle", "orange", "purple", "yellow", "school", "family",
  "pencil", "rocket", "planet", "river", "mountain", "forest", "camera", "ticket", "market", "pillow",
  "library", "picture", "holiday", "battery", "blanket", "diamond","javascript", "development", "application", "performance", "technology", "environment", "sophisticated", "congratulations", "responsibility", "communication",
  "architecture", "algorithm", "sustainability", "entrepreneurship", "optimization", "synchronization", "implementation", "configuration", "documentation", "transformation",
  "phenomenon", "accommodation", "recommendation", "circumstance", "opportunity", "consequence", "appreciation", "determination", "organization", "presentation"
];

// Helper to fetch more real words from a static file or API (optional)
// For demo, we'll use a large static array (replace with your own list for 1000+ words)
const englishWords = [
  // Add a large list of real English words here for all levels
  // Example: "about", "above", "accept", "accident", "account", ...
];

// Utility to get random words from a real word list
function getRandomWords(sourceList, count, minLen, maxLen) {
  // Filter by length and avoid duplicates
  const filtered = sourceList.filter(
    w => w.length >= minLen && w.length <= maxLen
  );
  let words = [];
  while (words.length < count && filtered.length > 0) {
    const idx = Math.floor(Math.random() * filtered.length);
    const word = filtered[idx];
    if (!words.includes(word)) words.push(word);
  }
  return words;
}

// Build the typingWords object with real words
const typingWords = {
  beginner: beginnerWords.concat(getRandomWords(englishWords, 350, 3, 6)),
  intermediate: intermediateWords.concat(getRandomWords(englishWords, 350, 5, 8)),
  advanced: advancedWords.concat(getRandomWords(englishWords, 350, 8, 14))
};

let typingScore = 0;
let typingLevel = "beginner";
let typingLives = 3;
let typingInterval;
let typingHighScore = localStorage.getItem("typing_highscore") || 0;
let currentWord = "";
let balloonY = 0;

function showTypingGame() {
  document.getElementById("gameSelector").style.display = "none";
  document.getElementById("typingInstructions").style.display = "block";
}
function startTypingGame() {
  document.getElementById("typingInstructions").style.display = "none";
  document.getElementById("typingGame").style.display = "block";
  typingScore = 0;
  typingLevel = "beginner";
  typingLives = 3;
  document.getElementById("typingScoreBoard").innerText = "Score: 0";
  document.getElementById("typingLevelMeter").innerText = "Level: Beginner";
  document.getElementById("typingLives").innerText = "Lives: 3";
  document.getElementById("typingInput").value = "";
  document.getElementById("typingInput").focus();
  spawnTypingBalloon();
}
function spawnTypingBalloon() {
  let area = document.getElementById("typingBalloonArea");
  area.innerHTML = "";
  balloonY = 0;

  let wordList = typingWords[typingLevel];
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];

  let balloon = document.createElement("div");
  balloon.className = "typing-balloon";
  balloon.innerText = currentWord;

  let rope = document.createElement("div");
  rope.className = "typing-balloon-rope";
  balloon.appendChild(rope);

  balloon.style.top = balloonY + "vh"; // start at top
  area.appendChild(balloon);

  // Movement speed relative to screen height
  const baseSpeed = 0.3; // % of screen per tick
  let speed =
    baseSpeed +
    (typingLevel === "beginner" ? 0 : typingLevel === "intermediate" ? 0.1 : 0.2);

  typingInterval = setInterval(() => {
    balloonY += speed; // now using vh, scales to screen height
    balloon.style.top = balloonY + "vh";

    // Check bottom collision relative to viewport height
    if (balloonY > 90) { // 90vh (close to bottom)
      clearInterval(typingInterval);
      typingLives--;
      document.getElementById("typingLives").innerText = "Lives: " + typingLives;

      if (typingLives <= 0) {
        typingGameOver("Out of lives!");
      } else {
        spawnTypingBalloon();
      }
    }
  }, 30);
}

document.getElementById("typingInput").addEventListener("input", function(e) {
  let val = e.target.value.trim();
  let balloon = document.querySelector(".typing-balloon");
  if (val.toLowerCase() === currentWord.toLowerCase()) {
    document.getElementById("popSound").currentTime = 0;
    document.getElementById("popSound").play();
    balloon.classList.add("burst");
    setTimeout(() => {
      clearInterval(typingInterval);
      typingScore += 10 + Math.max(0, 60 - balloonY / 10);
      document.getElementById("typingScoreBoard").innerText = "Score: " + typingScore;
      updateTypingLevel();
      updateTypingHighScore();
      document.getElementById("typingInput").value = "";
      spawnTypingBalloon();
    }, 350);
  }
});
function updateTypingLevel() {
  if (typingScore >= 200 && typingScore < 500) typingLevel = "intermediate";
  else if (typingScore >= 500) typingLevel = "advanced";
  else typingLevel = "beginner";
  document.getElementById("typingLevelMeter").innerText =
    "Level: " + (typingLevel.charAt(0).toUpperCase() + typingLevel.slice(1));
}
function updateTypingHighScore() {
  if (typingScore > typingHighScore) {
    typingHighScore = typingScore;
    localStorage.setItem("typing_highscore", typingHighScore);
  }
}
function typingGameOver(msg) {
  document.getElementById("typingGame").style.display = "none";
  document.getElementById("typingGameOver").style.display = "block";
  document.getElementById("typingGameOverMsg").innerText = msg + " High Score: " + typingHighScore;
}
function resetTypingGame() {
  document.getElementById("typingGameOver").style.display = "none";
  document.getElementById("typingGame").style.display = "block";
  typingScore = 0;
  typingLevel = "beginner";
  typingLives = 3;
  document.getElementById("typingScoreBoard").innerText = "Score: 0";
  document.getElementById("typingLevelMeter").innerText = "Level: Beginner";
  document.getElementById("typingLives").innerText = "Lives: 3";
  document.getElementById("typingInput").value = "";
  spawnTypingBalloon();
}
function backToSelector() {
  document.getElementById("welcomeInstructions").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("typingInstructions").style.display = "none";
  document.getElementById("typingGame").style.display = "none";
  document.getElementById("typingGameOver").style.display = "none";
  document.getElementById("gameSelector").style.display = "block";
}
function showClickerGame() {
  document.getElementById("gameSelector").style.display = "none";
  document.getElementById("welcomeInstructions").style.display = "block";
}
document.getElementById("startBtn").addEventListener("click", function() {
  let bgMusic = document.getElementById("bgMusic");
  bgMusic.currentTime = 0;
  bgMusic.play();
});