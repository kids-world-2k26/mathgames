import { sound } from '../audio.js';

export class GameBubbles {
  constructor(container, onComplete, onStarEarned, semester = 1) {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.semester = semester;
    this.currentQ = 0;
    this.totalQ = 5;
    this.correctCount = 0;
  }

  start() {
    this.currentQ = 0;
    this.correctCount = 0;
    this.nextQuestion();
  }

  generateQuestion() {
    let num1, num2, isAdd, targetAnswer;

    if (this.semester === 1) {
      isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 6) + 1;
        num2 = Math.floor(Math.random() * (10 - num1 + 1));
        targetAnswer = num1 + num2;
      } else {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * num1) + 1;
        targetAnswer = num1 - num2;
      }
    } else {
      isAdd = Math.random() > 0.5;
      const t1 = (Math.floor(Math.random() * 4) + 1) * 10;
      const t2 = (Math.floor(Math.random() * 3) + 1) * 10;
      if (isAdd) {
        num1 = t1;
        num2 = t2;
        targetAnswer = num1 + num2;
      } else {
        num1 = t1 + t2;
        num2 = t2;
        targetAnswer = t1;
      }
    }

    const equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;

    // 4 bubble options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 7) - 3;
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    return {
      equationStr,
      targetAnswer,
      options
    };
  }

  nextQuestion() {
    if (this.currentQ >= this.totalQ) {
      this.onComplete(this.correctCount, this.totalQ);
      return;
    }

    this.currentQ++;
    this.currentProblem = this.generateQuestion();
    this.render();
  }

  render() {
    const { equationStr, options } = this.currentProblem;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>🫧 Vương Quốc Bong Bóng (Bubble Math Pop)</h2>
          </div>
        </div>
        <div class="game-progress-bar-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${(this.currentQ / this.totalQ) * 100}%"></div>
          </div>
          <span class="question-counter">Câu ${this.currentQ}/${this.totalQ}</span>
        </div>
      </div>

      <div class="question-prompt-box">
        <span class="prompt-icon">🫧</span>
        <span class="prompt-text">Bé hãy bấm vào quả bong bóng mang đáp án chính xác để làm nổ nhé!</span>
      </div>

      <!-- Bubble Floating Arena -->
      <div class="bubbles-arena">
        <div class="bubble-floating-list">
          ${options.map((opt, idx) => `
            <div class="bubble-target-ball" data-val="${opt}" style="animation-delay: ${idx * 0.4}s;">
              ${opt}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Equation Board -->
      <div class="math-board" style="margin-top: 20px;">
        <span class="math-equation" style="font-size: 36px;">
          ${equationStr.replace('?', '<span class="math-question-mark" id="bubbleTargetVal">?</span>')}
        </span>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const bubbles = this.container.querySelectorAll('.bubble-target-ball');
    const { targetAnswer } = this.currentProblem;
    const targetSpan = this.container.querySelector('#bubbleTargetVal');

    bubbles.forEach(bubble => {
      bubble.addEventListener('click', () => {
        const val = parseInt(bubble.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playBubblePop();
          sound.playCorrect();
          bubble.classList.add('popping');

          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }

          bubbles.forEach(b => b.style.pointerEvents = 'none');
          this.correctCount++;
          this.onStarEarned();

          setTimeout(() => {
            this.nextQuestion();
          }, 850);
        } else {
          sound.playWrong();
          bubble.style.animation = 'shakeWrong 0.5s ease-in-out';
          setTimeout(() => {
            bubble.style.animation = 'bubbleFloat 3.5s ease-in-out infinite';
          }, 500);
        }
      });
    });
  }
}
