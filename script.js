// ---------- mobile menu toggle ----------
document.addEventListener('DOMContentLoaded', function () {
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var open = mainNav.style.display === 'flex';
      mainNav.style.display = open ? 'none' : 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '56px';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.background = '#ffffff';
      mainNav.style.padding = '10px 24px 16px';
      mainNav.style.borderBottom = '1px solid var(--line)';
      mainNav.style.gap = '4px';
    });
  }
});

// ---------- quiz logic ----------
(function () {
  var questionCard = document.getElementById('question-card');
  if (!questionCard) return; // not on the quiz page

  var questions = [
    {
      text: "Which body is primarily responsible for conducting elections to the Lok Sabha and state legislatures in India?",
      options: ["Election Commission of India", "Law Commission of India", "Finance Commission", "Union Public Service Commission"],
      correct: 0,
      explanation: "The Election Commission of India, a constitutional body under Article 324, conducts elections to Parliament, state legislatures, and the offices of President and Vice-President."
    },
    {
      text: "A satellite in a sun-synchronous orbit passes over any given point on Earth at roughly the same:",
      options: ["Altitude every year", "Local solar time each pass", "Temperature each orbit", "Speed as the Earth's rotation"],
      correct: 1,
      explanation: "Sun-synchronous orbits are timed so the satellite crosses a given latitude at a consistent local solar time, which keeps lighting conditions similar for repeated imaging."
    },
    {
      text: "The Ramsar Convention is an international treaty concerned with the conservation of:",
      options: ["Coral reefs", "Wetlands", "Rainforests", "Glaciers"],
      correct: 1,
      explanation: "The Ramsar Convention, signed in 1971 in Ramsar, Iran, provides a framework for the conservation and sustainable use of wetlands."
    },
    {
      text: "A cut in the repo rate by the central bank is generally intended to:",
      options: ["Reduce the money supply", "Make borrowing cheaper and boost demand", "Increase the fiscal deficit directly", "Fix the exchange rate"],
      correct: 1,
      explanation: "Lowering the repo rate reduces the cost at which banks borrow from the central bank, which typically lowers lending rates and encourages borrowing and spending."
    },
    {
      text: "Fundamental Rights in the Indian Constitution are primarily contained in which Part?",
      options: ["Part II", "Part III", "Part IV", "Part V"],
      correct: 1,
      explanation: "Part III of the Constitution (Articles 12 to 35) lays down the Fundamental Rights guaranteed to citizens."
    }
  ];

  var current = 0;
  var answers = new Array(questions.length).fill(null);
  var score = { correct: 0, incorrect: 0 };

  var qText = document.getElementById('q-text');
  var optionsContainer = document.getElementById('options-container');
  var explanation = document.getElementById('explanation');
  var progressLabel = document.getElementById('progress-label');
  var progressFill = document.getElementById('progress-fill');
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var resultBanner = document.getElementById('result-banner');
  var finalScore = document.getElementById('final-score');
  var scoreCorrect = document.getElementById('score-correct');
  var scoreIncorrect = document.getElementById('score-incorrect');
  var scoreRemaining = document.getElementById('score-remaining');

  function updateScoreSidebar() {
    scoreCorrect.textContent = score.correct;
    scoreIncorrect.textContent = score.incorrect;
    scoreRemaining.textContent = questions.length - (score.correct + score.incorrect);
  }

  function renderQuestion(index) {
    var q = questions[index];
    qText.textContent = q.text;
    optionsContainer.innerHTML = '';
    explanation.classList.remove('show');
    explanation.innerHTML = '';

    var answered = answers[index] !== null;

    q.options.forEach(function (optionText, i) {
      var btn = document.createElement('button');
      btn.className = 'option';
      btn.type = 'button';
      btn.innerHTML = '<span class="bullet"></span><span>' + optionText + '</span>';

      if (answered) {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add('correct');
        if (i === answers[index] && answers[index] !== q.correct) btn.classList.add('incorrect');
        if (i === answers[index] && answers[index] === q.correct) btn.classList.add('selected');
      } else {
        btn.addEventListener('click', function () { selectAnswer(index, i); });
      }
      optionsContainer.appendChild(btn);
    });

    if (answered) {
      explanation.innerHTML = '<strong>Explanation. </strong>' + q.explanation;
      explanation.classList.add('show');
    }

    progressLabel.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;
    progressFill.style.width = (((index + 1) / questions.length) * 100) + '%';
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? 'Finish quiz' : 'Next question';
  }

  function selectAnswer(index, optionIndex) {
    if (answers[index] !== null) return;
    answers[index] = optionIndex;
    if (optionIndex === questions[index].correct) {
      score.correct++;
    } else {
      score.incorrect++;
    }
    updateScoreSidebar();
    renderQuestion(index);
  }

  function showResults() {
    questionCard.style.display = 'none';
    document.querySelector('.quiz-nav').style.display = 'none';
    resultBanner.classList.add('show');
    finalScore.textContent = score.correct + ' / ' + questions.length;
  }

  prevBtn.addEventListener('click', function () {
    if (current === 0) return;
    current--;
    renderQuestion(current);
  });

  nextBtn.addEventListener('click', function () {
    if (answers[current] === null) {
      optionsContainer.style.outline = '1px solid var(--danger)';
      optionsContainer.style.borderRadius = '8px';
      setTimeout(function () { optionsContainer.style.outline = 'none'; }, 700);
      return;
    }
    if (current === questions.length - 1) {
      showResults();
      return;
    }
    current++;
    renderQuestion(current);
  });

  // simple elapsed timer
  var seconds = 0;
  var timerDisplay = document.getElementById('timer-display');
  setInterval(function () {
    seconds++;
    var m = Math.floor(seconds / 60).toString().padStart(2, '0');
    var s = (seconds % 60).toString().padStart(2, '0');
    if (timerDisplay) timerDisplay.textContent = m + ':' + s;
  }, 1000);

  updateScoreSidebar();
  renderQuestion(current);
})();
