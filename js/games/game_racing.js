import { sound } from '../audio.js';

export class GameRacing {
  constructor(container, onComplete, onStarEarned, semester = 1) {
    this.container = container;
    this.onComplete = onComplete;
    this.onStarEarned = onStarEarned;
    this.semester = semester;
    this.currentQ = 0;
    this.totalQ = 5;
    this.correctCount = 0;
    this.carLane = 1; // 0: Left, 1: Center, 2: Right
  }

  start() {
    this.currentQ = 0;
    this.correctCount = 0;
    this.carLane = 1;
    this.nextQuestion();
  }

  generateQuestion() {
    let num1, num2, isAdd, targetAnswer;

    if (this.semester === 1) {
      isAdd = Math.random() > 0.45;
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
      // Semester 2
      isAdd = Math.random() > 0.5;
      const tens = (Math.floor(Math.random() * 5) + 1) * 10;
      const unit = Math.floor(Math.random() * 8) + 1;
      if (isAdd) {
        num1 = tens;
        num2 = unit;
        targetAnswer = num1 + num2;
      } else {
        num1 = tens + unit;
        num2 = unit;
        targetAnswer = tens;
      }
    }

    const equationStr = `${num1} ${isAdd ? '+' : '-'} ${num2} = ?`;

    // 3 lane options (one for each lane)
    const options = [targetAnswer];
    while (options.length < 3) {
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
            <h2>🏎️ Cuộc Đua Siêu Tốc (Turbo Racing)</h2>
          </div>
        </div>
        <div class="game-progress-bar-wrap">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${(this.currentQ / this.totalQ) * 100}%"></div>
          </div>
          <span class="question-counter">Chặng ${this.currentQ}/${this.totalQ}</span>
        </div>
      </div>

      <div class="racing-arena">
        <!-- Prompt Box -->
        <div class="question-prompt-box">
          <span class="prompt-icon">🏁</span>
          <span class="prompt-text">Chọn cổng số đúng để kích hoạt Nitro bứt phá về đích!</span>
        </div>

        <!-- Dashboard Equation HUD -->
        <div class="math-board" style="padding: 12px 24px; background: #0f172a; border-color: #38bdf8;">
          <span style="font-size: 14px; color: #38bdf8; font-weight: 800; letter-spacing: 1px;">TURBO METER</span>
          <span class="math-equation" style="color: #f8fafc; font-size: 34px;">
            ${equationStr.replace('?', '<span class="math-question-mark" id="racingTargetVal" style="background:#0284c7; color:#fff;">?</span>')}
          </span>
        </div>

        <!-- Racing Track (3 Lanes) -->
        <div class="racing-track" id="racingTrack">
          <!-- 3 Lanes with portals -->
          ${options.map((opt, idx) => `
            <div class="racing-lane" data-lane="${idx}">
              <button class="racing-portal" data-val="${opt}" data-lane="${idx}">
                🚪 Cổng: ${opt}
              </button>

              ${idx === 0 ? '<div class="racing-rival" style="bottom: 150px;">🐰</div>' : ''}
              ${idx === 2 ? '<div class="racing-rival" style="bottom: 120px;">🐻</div>' : ''}

              <!-- Robot Car (appears on current lane) -->
              <div class="racing-car" id="robotCar" style="display: ${this.carLane === idx ? 'flex' : 'none'};">
                <span style="font-size: 42px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">🏎️</span>
                <span class="nitro-flame">🔥💨</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Answer buttons at bottom for convenience -->
        <div class="answer-choices-area" style="margin-top: 8px;">
          ${options.map((opt, idx) => `
            <button class="choice-btn" data-val="${opt}" data-lane="${idx}">
              Làn ${idx + 1}: ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const portals = this.container.querySelectorAll('.racing-portal, .choice-btn');
    const { targetAnswer } = this.currentProblem;
    const targetSpan = this.container.querySelector('#racingTargetVal');

    portals.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        const lane = parseInt(btn.dataset.lane, 10);

        if (val === targetAnswer) {
          // Switch robot car to this lane and boost!
          this.carLane = lane;
          const robotCar = this.container.querySelector('#robotCar');
          const lanes = this.container.querySelectorAll('.racing-lane');

          lanes.forEach((l, idx) => {
            const carInLane = l.querySelector('#robotCar');
            if (carInLane) carInLane.style.display = idx === lane ? 'flex' : 'none';
          });

          if (robotCar) {
            robotCar.classList.add('nitro-boost');
          }

          sound.playNitro();
          sound.playCorrect();

          btn.classList.add('correct');
          if (targetSpan) {
            targetSpan.textContent = targetAnswer;
            targetSpan.style.background = '#4ade80';
            targetSpan.style.color = '#064e3b';
          }

          portals.forEach(b => b.disabled = true);
          this.correctCount++;
          this.onStarEarned();

          setTimeout(() => {
            this.nextQuestion();
          }, 950);

        } else {
          sound.playWrong();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 500);
        }
      });
    });
  }
}
