import { sound } from '../audio.js';

export class GameMeasure {
  constructor(container, onComplete, onStarEarned, semester = 2) {
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

    // Items to measure
    const items = [
      { name: 'Bút chì', icon: '✏️', color: '#f59e0b' },
      { name: 'Cục tẩy', icon: '🧼', color: '#ec4899' },
      { name: 'Bút màu', icon: '🖍️', color: '#10b981' },
      { name: 'Que kem', icon: '🍦', color: '#8b5cf6' },
      { name: 'Cái thìa', icon: '🥄', color: '#0284c7' }
    ];
    const chosen = items[Math.floor(Math.random() * items.length)];

    // Target cm between 3 and 10 cm
    const targetCm = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const rulerMax = 12; // 0 to 12 cm

    // Generate 4 distinct options
    const options = [targetCm];
    while (options.length < 4) {
      const delta = Math.floor(Math.random() * 5) - 2;
      const opt = Math.max(1, Math.min(rulerMax, targetCm + delta));
      if (!options.includes(opt)) options.push(opt);
    }
    options.sort(() => Math.random() - 0.5);

    // Calculate percentage width on ruler
    // 0 to 12 cm. targetCm / 12 * 100%
    const itemWidthPercent = (targetCm / rulerMax) * 100;

    this.container.innerHTML = `
      <div class="game-top-bar">
        <div class="game-header-info">
          <button class="btn-back" id="gameExitBtn">← Trở về</button>
          <div class="game-title-badge">
            <h2>Cây Thước Kì Diệu (Đo độ dài cm)</h2>
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
        <span class="prompt-icon">📏</span>
        <span class="prompt-text">Bé hãy nhìn thước và cho biết <b>${chosen.name}</b> dài bao nhiêu cm?</span>
      </div>

      <div class="game-play-area">
        <div class="measure-area">
          <!-- Item to measure aligned to 0 -->
          <div style="width: 100%; position: relative; height: 60px; display: flex; align-items: center;">
            <div style="width: ${itemWidthPercent}%; height: 36px; background: ${chosen.color}; border-radius: 10px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; font-size: 26px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: width 0.5s ease;">
              <span>${chosen.icon}</span>
            </div>
          </div>

          <!-- Ruler -->
          <div class="virtual-ruler">
            ${Array.from({ length: rulerMax + 1 }).map((_, cm) => `
              <div class="ruler-tick" style="flex: ${cm === rulerMax ? '0' : '1'};">
                <span>${cm}</span>
              </div>
            `).join('')}
          </div>
          <span style="font-size: 14px; font-weight: 800; color: #a16207; align-self: flex-end;">Đơn vị: cm (xăng-ti-mét)</span>
        </div>
      </div>

      <div class="answer-choices-area" id="choicesArea">
        ${options.map(opt => `<button class="choice-btn" data-val="${opt}">${opt} cm</button>`).join('')}
      </div>
    `;

    this.bindEvents(targetCm);
  }

  bindEvents(targetCm) {
    const choices = this.container.querySelectorAll('.choice-btn');

    choices.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === targetCm) {
          sound.playCorrect();
          btn.classList.add('correct');
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
