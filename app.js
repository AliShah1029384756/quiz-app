const questions = [
  {
    q: "What is the capital city of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    answer: 2
  },
  {
    q: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1
  },
  {
    q: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    answer: 2
  },
  {
    q: "Who wrote the play 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    answer: 1
  },
  {
    q: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    answer: 1
  },
  {
    q: "Which country is the largest by land area?",
    options: ["USA", "China", "Canada", "Russia"],
    answer: 3
  },
  {
    q: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    answer: 1
  },
  {
    q: "What is the fastest land animal?",
    options: ["Lion", "Horse", "Cheetah", "Leopard"],
    answer: 2
  },
  {
    q: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    answer: 2
  },
  {
    q: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    answer: 2
  }
];

const TIME_PER_QUESTION = 15;

let shuffled = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let timerInterval = null;
let timeLeft = TIME_PER_QUESTION;

// Elements
const startScreen  = document.getElementById('startScreen');
const quizScreen   = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const questionCounter = document.getElementById('questionCounter');
const timerEl         = document.getElementById('timer');
const scoreEl         = document.getElementById('score');
const progressFill    = document.getElementById('progressFill');
const questionText    = document.getElementById('questionText');
const optionsList     = document.getElementById('optionsList');

const finalScore   = document.getElementById('finalScore');
const finalCorrect = document.getElementById('finalCorrect');
const finalWrong   = document.getElementById('finalWrong');
const resultEmoji  = document.getElementById('resultEmoji');
const resultTitle  = document.getElementById('resultTitle');
const resultMsg    = document.getElementById('resultMsg');

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  shuffled = shuffle(questions);
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  if (currentIndex >= shuffled.length) { showResult(); return; }

  const q = shuffled[currentIndex];
  const total = shuffled.length;

  questionCounter.textContent = `Question ${currentIndex + 1} / ${total}`;
  scoreEl.textContent = `Score: ${score}`;
  progressFill.style.width = `${(currentIndex / total) * 100}%`;
  questionText.textContent = q.q;

  optionsList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.className = 'option';
    li.textContent = opt;
    li.addEventListener('click', () => selectAnswer(i));
    optionsList.appendChild(li);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      revealAnswer(-1); // timeout — no answer
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerEl.textContent = `⏱ ${timeLeft}s`;
  timerEl.classList.toggle('urgent', timeLeft <= 5);
}

function selectAnswer(chosen) {
  clearInterval(timerInterval);
  revealAnswer(chosen);
}

function revealAnswer(chosen) {
  const q = shuffled[currentIndex];
  const options = optionsList.querySelectorAll('.option');

  options.forEach(o => o.classList.add('disabled'));

  if (chosen === q.answer) {
    options[chosen].classList.add('correct');
    score += 10 + Math.max(0, timeLeft);
    correctCount++;
  } else {
    if (chosen >= 0) options[chosen].classList.add('wrong');
    options[q.answer].classList.add('correct');
  }

  scoreEl.textContent = `Score: ${score}`;

  setTimeout(() => {
    currentIndex++;
    loadQuestion();
  }, 1200);
}

function showResult() {
  progressFill.style.width = '100%';
  showScreen(resultScreen);

  const wrong = shuffled.length - correctCount;
  finalScore.textContent = score;
  finalCorrect.textContent = correctCount;
  finalWrong.textContent = wrong;

  const pct = (correctCount / shuffled.length) * 100;
  if (pct === 100) { resultEmoji.textContent = '🏆'; resultTitle.textContent = 'Perfect Score!'; resultMsg.textContent = 'Outstanding! You got everything right.'; }
  else if (pct >= 70) { resultEmoji.textContent = '🎉'; resultTitle.textContent = 'Great Job!'; resultMsg.textContent = 'You did really well!'; }
  else if (pct >= 40) { resultEmoji.textContent = '🙂'; resultTitle.textContent = 'Not bad!'; resultMsg.textContent = 'Keep practicing to improve.'; }
  else { resultEmoji.textContent = '📚'; resultTitle.textContent = 'Keep Learning!'; resultMsg.textContent = 'Review the topics and try again.'; }
}

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => {
    s.classList.add('hidden');
  });
  screen.classList.remove('hidden');
}

document.getElementById('startBtn').addEventListener('click', startQuiz);
document.getElementById('restartBtn').addEventListener('click', startQuiz);
