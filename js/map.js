import { ISLAND_STATIONS, WARDROBE_ITEMS } from './data.js';
import { sound } from './audio.js';

export class AdventureMap {
  constructor(container, onStationSelect, onOpenWardrobe, onOpenParentZone) {
    this.container = container;
    this.onStationSelect = onStationSelect;
    this.onOpenWardrobe = onOpenWardrobe;
    this.onOpenParentZone = onOpenParentZone;

    // Load unlocked stations and equipped wardrobe
    this.unlockedStations = JSON.parse(localStorage.getItem('adv_unlocked_stations') || '["adv_count"]');
    this.stationStars = JSON.parse(localStorage.getItem('adv_station_stars') || '{}');
    this.equippedWardrobe = JSON.parse(localStorage.getItem('adv_equipped_wardrobe') || '[]');
    this.currentStationId = localStorage.getItem('adv_current_station') || 'adv_count';
  }

  render() {
    // Determine equipped items icons
    const equippedHat = WARDROBE_ITEMS.find(i => this.equippedWardrobe.includes(i.id) && i.type === 'hat');
    const equippedGlasses = WARDROBE_ITEMS.find(i => this.equippedWardrobe.includes(i.id) && i.type === 'glasses');
    const equippedRibbon = WARDROBE_ITEMS.find(i => this.equippedWardrobe.includes(i.id) && i.type === 'accessory');

    this.container.innerHTML = `
      <div class="adventure-map-container">
        <!-- Top Navigation Bar for Adventure Mode -->
        <div class="adv-top-bar">
          <div class="adv-badge-group">
            <span style="font-size: 28px;">🏝️</span>
            <div>
              <h2 style="font-size: 20px; font-weight: 800; color: #0284c7; margin: 0;">Đảo Toán Học Phiêu Lưu</h2>
              <span style="font-size: 13px; color: #64748b;">Đồng hành cùng bé: <b>Mèo Miu Miu</b> 🐱</span>
            </div>
          </div>

          <div class="adv-actions">
            <button class="adv-btn-pill" id="advWardrobeBtn" title="Tủ đồ thời trang cho Miu Miu">
              👗 Tủ Đồ
            </button>
            <button class="adv-btn-pill" id="advParentBtn" title="Khu vực dành cho ba mẹ">
              👨‍👩‍👧 Phụ Huynh
            </button>
          </div>
        </div>

        <!-- Interactive Map Canvas / SVG Canvas -->
        <div class="island-map-board">
          <!-- Background Decor: Sea, Palm Trees, Clouds -->
          <div class="map-cloud cloud-a">☁️</div>
          <div class="map-cloud cloud-b">☁️</div>
          <div class="map-sea-waves">🌊 ⛵ 🐬</div>

          <!-- Winding Path SVG -->
          <svg class="map-path-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path d="M 180 450 Q 300 480 420 312 T 680 210 T 840 408" fill="none" stroke="#f59e0b" stroke-width="10" stroke-dasharray="16 12" stroke-linecap="round" opacity="0.85"/>
          </svg>

          <!-- Stations on the Map -->
          ${ISLAND_STATIONS.map((station) => {
            const isUnlocked = this.unlockedStations.includes(station.id);
            const stars = this.stationStars[station.id] || 0;
            const isCurrent = this.currentStationId === station.id;

            return `
              <div class="map-station-point ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current-active' : ''}" 
                   style="left: ${station.x}%; top: ${station.y}%;"
                   data-station-id="${station.id}">
                
                ${isCurrent ? `
                  <!-- Mascot Character Avatar standing at current station -->
                  <div class="miu-mascot-avatar pop-in">
                    <div class="miu-accessories">
                      ${equippedHat ? `<span class="acc-hat">${equippedHat.icon}</span>` : ''}
                      ${equippedGlasses ? `<span class="acc-glasses">${equippedGlasses.icon}</span>` : ''}
                      ${equippedRibbon ? `<span class="acc-ribbon">${equippedRibbon.icon}</span>` : ''}
                    </div>
                    <div class="miu-cat-face">🐱</div>
                    <div class="miu-speech-bubble">Miu Miu đây!</div>
                  </div>
                ` : ''}

                <!-- Station Circle Node -->
                <div class="station-node-circle" style="background: ${station.bgTheme}; border-color: ${station.color};">
                  ${isUnlocked 
                    ? `<span class="station-icon">${station.icon}</span>` 
                    : `<span class="station-icon" style="filter: grayscale(1); opacity: 0.6;">🔒</span>`
                  }
                  <span class="station-number-tag" style="background: ${station.color};">${station.number}</span>
                </div>

                <!-- Station Card Details -->
                <div class="station-info-card">
                  <div class="station-title">${station.title}</div>
                  <div class="station-sub">${station.subtitle}</div>
                  ${isUnlocked ? `
                    <div class="station-stars">
                      ${'⭐'.repeat(stars) || '✨ Chưa có sao'}
                    </div>
                  ` : `
                    <div class="station-lock-label">${station.isComingSoon ? 'Sắp mở khóa' : 'Cần vượt trạm trước'}</div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Wardrobe button
    this.container.querySelector('#advWardrobeBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.onOpenWardrobe();
    });

    // Parent Zone button
    this.container.querySelector('#advParentBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.onOpenParentZone();
    });

    // Station nodes
    this.container.querySelectorAll('.map-station-point.unlocked').forEach(el => {
      el.addEventListener('click', () => {
        sound.playClick();
        const stationId = el.dataset.stationId;
        this.currentStationId = stationId;
        localStorage.setItem('adv_current_station', stationId);
        this.onStationSelect(stationId);
      });
    });
  }
}
