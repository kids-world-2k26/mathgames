import { sound } from '../audio.js';

export class GameNumberHouse {
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

    // Total number between 2 and 10 (or up to 20 for semester 2)
    const maxTotal = this.semester === 1 ? 10 : 20;
    const total = Math.floor(Math.random() * (maxTotal - 1)) + 2; // at least 2
    const partA = Math.floor(Math.random() * (total + 1)); // 0 to total
    const partB = total - partA;

    // Type of question:
    // 0: find partB (Tách: Total gồm partA và mấy?)
    // 1: find total (Gộp: Gộp partA và partB được mấy?)
    const mode = Math.random() > 0.4 ? 'findPart' : 'findTotal';

    let promptText = '';
    let targetAnswer = 0;
    let roofHtml = '';
    let windowAHtml = '';
    let windowBHtml = '';

    if (mode === 'findPart') {
      promptText = `Số <b>${total}</b> gồm <b>${partA}</b> và mấy?`;
      targetAnswer = partB;
      roofHtml = `<div class="roof-number-badge">${total}</div>`;
      windowAHtml = `<div class="house-window">${partA}</div>`;
      windowBHtml = `<div class="house-window mystery" id="targetWindow">?</div>`;
    } else {
      promptText = `Gộp <b>${partA}</b> và <b>${partB}</b> được mấy?`;
      targetAnswer = total;
      roofHtml = `<div class="roof-number-badge mystery" id="targetWindow" style="background: #fde047;">?</div>`;
      windowAHtml = `<div class="house-window">${partA}</div>`;
      windowBHtml = `<div class="house-window">${partB}</div>`;
    }

    // Generate 4 distinct options
    const options = [targetAnswer];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(0, Math.min(maxTotal + 2, targetAnswer + delta));
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Ngôi Nhà Tách - Gộp Số ("Mấy và Mấy")</h2>
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
        <span class="prompt-icon">🏠</span>
        <span class="prompt-text">${promptText}</span>
      </div>

      <div class="game-play-area">
        <div class="number-house">
          <div class="house-roof">
            ${roofHtml}
          </div>
          <div class="house-body">
            ${windowAHtml}
            ${windowBHtml}
          </div>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt}</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetAnswer);
  }

  bindEvents(targetAnswer) {
    const choices = this.container.querySelectorAll('.choice-btn');
    const targetWin = this.container.querySelector('#targetWindow');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetAnswer) {
          sound.playCorrect();
          btn.classList.add('correct');
          if (targetWin) {
            targetWin.textContent = targetAnswer;
            targetWin.style.background = '#dcfce7';
            targetWin.style.color = '#15803d';
            targetWin.style.borderColor = '#16a34a';
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
