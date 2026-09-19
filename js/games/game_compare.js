import { EMOJI_ITEMS } from '../data.js';
import { sound } from '../audio.js';

export class GameCompare {
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

    // Range: Semester 1 (0 to 10), Semester 2 (0 to 100)
    let leftVal = 0;
    let rightVal = 0;
    const max = this.semester === 1 ? 10 : 99;

    // 25% chance of being equal
    if (Math.random() < 0.25) {
      leftVal = Math.floor(Math.random() * (max + 1));
      rightVal = leftVal;
    } else {
      leftVal = Math.floor(Math.random() * (max + 1));
      rightVal = Math.floor(Math.random() * (max + 1));
      if (leftVal === rightVal) rightVal = (leftVal + 1) % (max + 1);
    }

    const correctSign = leftVal > rightVal ? '>' : leftVal < rightVal ? '<' : '=';
    const showItems = this.semester === 1 && leftVal <= 10 && rightVal <= 10;
    const emoji = EMOJI_ITEMS[Math.floor(Math.random() * EMOJI_ITEMS.length)];

    // Seesaw tilt angle:
    let plankRotation = 0;
    if (leftVal > rightVal) plankRotation = -10;
    else if (leftVal < rightVal) plankRotation = 10;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Bập Bênh So Sánh (&gt;, &lt;, =)</h2>
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
        <span class="prompt-icon">⚖️</span>
        <span class="prompt-text">Bé hãy chọn dấu thích hợp (<b>&gt;</b>, <b>&lt;</b>, hoặc <b>=</b>) vào ô vuông nhé!</span>
      </div>

      <div class="game-play-area">
        <div class="seesaw-center-box" id="centerBox">?</div>

        <div class="seesaw-container">
          <div class="seesaw-plank" id="seesawPlank" style="transform: rotate(${plankRotation}deg);">
            <!-- Left Pan -->
            <div class="seesaw-pan">
              <span class="pan-value">${leftVal}</span>
              ${showItems ? `<div class="pan-items-grid">${Array.from({ length: leftVal }).map(() => emoji).join('')}</div>` : ''}
            </div>

            <!-- Right Pan -->
            <div class="seesaw-pan">
              <span class="pan-value">${rightVal}</span>
              ${showItems ? `<div class="pan-items-grid">${Array.from({ length: rightVal }).map(() => emoji).join('')}</div>` : ''}
            </div>
          </div>
          <div class="seesaw-fulcrum"></div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        <button class="choice-btn" data-sign=">">&gt; (Lớn hơn)</button>
        <button class="choice-btn" data-sign="=">= (Bằng nhau)</button>
        <button class="choice-btn" data-sign="<">&lt; (Bé hơn)</button>
      </div>
    `;

    this.bindEvents(correctSign);
  }

  bindEvents(correctSign) {
    const choices = this.container.querySelectorAll('.choice-btn');
    const centerBox = this.container.querySelector('#centerBox');
    const plank = this.container.querySelector('#seesawPlank');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const sign = btn.dataset.sign;
        if (sign === correctSign) {
          sound.playCorrect();
          btn.classList.add('correct');
          centerBox.textContent = correctSign;
          centerBox.style.color = '#10b981';
          centerBox.style.borderColor = '#10b981';
          centerBox.classList.add('correct-yay');
          
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
