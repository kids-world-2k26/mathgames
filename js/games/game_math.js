import { sound } from '../audio.js';

export class GameMath {
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

  nextQuestion() {
    if (this.currentQ >= this.totalQ) {
      this.onComplete(this.correctCount, this.totalQ);
      return;
    }

    this.currentQ++;

    let num1 = 0, num2 = 0, isAdd = true, targetAnswer = 0;
    let equationStr = '';
    let visualCountersHtml = '';

    if (this.semester === 1) {
      // Within 10
      isAdd = Math.random() > 0.5;
      if (isAdd) {
        num1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
        num2 = Math.floor(Math.random() * (10 - num1 + 1)); // num1 + num2 <= 10
        targetAnswer = num1 + num2;
        equationStr = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 9) + 2; // 2 to 10
        num2 = Math.floor(Math.random() * (num1 + 1)); // num2 <= num1
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }

      // Visual counters
      visualCountersHtml = `
        <div class="visual-counters-bar">
          <span>🍎 x ${num1}</span>
          <span>${isAdd ? '➕' : '➖'}</span>
          <span>🍎 x ${num2}</span>
        </div>
      `;
    } else {
      // Semester 2: Within 100 without regrouping
      isAdd = Math.random() > 0.5;
      const type = Math.random() > 0.5 ? 'twoPlusOne' : 'twoPlusTwo';

      if (isAdd) {
        if (type === 'twoPlusOne') {
          const tens = Math.floor(Math.random() * 8) + 1; // 10 to 80
          const u1 = Math.floor(Math.random() * 6); // 0 to 5
          const u2 = Math.floor(Math.random() * (9 - u1 + 1)); // sum <= 9
          num1 = tens * 10 + u1;
          num2 = u2;
        } else {
          const t1 = Math.floor(Math.random() * 4) + 1;
          const t2 = Math.floor(Math.random() * (8 - t1)) + 1;
          const u1 = Math.floor(Math.random() * 5);
          const u2 = Math.floor(Math.random() * (9 - u1));
          num1 = t1 * 10 + u1;
          num2 = t2 * 10 + u2;
        }
        targetAnswer = num1 + num2;
        equationStr = `${num1} + ${num2} = ?`;
      } else {
        if (type === 'twoPlusOne') {
          const tens = Math.floor(Math.random() * 8) + 1;
          const u1 = Math.floor(Math.random() * 6) + 4; // 4 to 9
          const u2 = Math.floor(Math.random() * (u1 + 1));
          num1 = tens * 10 + u1;
          num2 = u2;
        } else {
          const t1 = Math.floor(Math.random() * 4) + 4; // 4 to 7
          const t2 = Math.floor(Math.random() * t1);
          const u1 = Math.floor(Math.random() * 5) + 4;
          const u2 = Math.floor(Math.random() * (u1 + 1));
          num1 = t1 * 10 + u1;
          num2 = t2 * 10 + u2;
        }
        targetAnswer = num1 - num2;
        equationStr = `${num1} - ${num2} = ?`;
      }
    }

    // Generate 4 options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 7) - 3;
      const opt = Math.max(0, targetAnswer + delta);
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Khu Vườn Phép Tính (${this.semester === 1 ? 'Phạm vi 10' : 'Phạm vi 100'})</h2>
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
        <span class="prompt-icon">🍎</span>
        <span class="prompt-text">Bé hãy nhẩm tính kết quả phép tính bên dưới nhé!</span>
      </div>

      <div class="game-play-area">
        <div class="math-board">
          <span class="math-equation">${equationStr.replace('?', '<span class="math-question-mark" id="mathTarget">?</span>')}</span>
        </div>
        ${visualCountersHtml}
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    const choices = this.container.querySelectorAll('.choice-btn');
    const targetSpan = this.container.querySelector('#mathTarget');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playCorrect();
          btn.classList.add('correct');
          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }
          this.correctCount++;
          this.onStarEarned();
          choices.forEach(b => b.disabled = true);
          setTimeout(() => this.nextQuestion(), 900);
        } else {
          sound.playWrong();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      });
    });
  }
}
