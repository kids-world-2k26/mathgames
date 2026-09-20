import { WARDROBE_ITEMS } from './data.js';
import { sound } from './audio.js';

export class WardrobeModal {
  constructor(overlay, modalBody, onUpdate) {
    this.overlay = overlay;
    this.modalBody = modalBody;
    this.onUpdate = onUpdate;
  }

  open() {
    this.render();
    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
  }

  render() {
    const stars = parseInt(localStorage.getItem('math_stars') || '0', 10);
    const owned = JSON.parse(localStorage.getItem('adv_owned_wardrobe') || '[]');
    const equipped = JSON.parse(localStorage.getItem('adv_equipped_wardrobe') || '[]');

    const equippedHat = WARDROBE_ITEMS.find(i => equipped.includes(i.id) && i.type === 'hat');
    const equippedGlasses = WARDROBE_ITEMS.find(i => equipped.includes(i.id) && i.type === 'glasses');
    const equippedRibbon = WARDROBE_ITEMS.find(i => equipped.includes(i.id) && i.type === 'accessory');

    this.modalBody.innerHTML = `
      <div class="wardrobe-modal-layout">
        <h2 style="font-size: 24px; color: #0284c7; margin-bottom: 6px; text-align: center;">
          👗 Tủ Đồ Thời Trang Của Miu Miu
        </h2>
        <div style="display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; color: #f59e0b; margin-bottom: 16px;">
          <span>Ngôi sao của bé:</span>
          <span style="font-size: 22px;">⭐ ${stars}</span>
        </div>

        <!-- Live Mascot Preview -->
        <div class="wardrobe-preview-box">
          <div class="miu-live-preview">
            <div class="miu-accessories-preview">
              ${equippedHat ? `<span class="acc-hat-preview">${equippedHat.icon}</span>` : ''}
              ${equippedGlasses ? `<span class="acc-glasses-preview">${equippedGlasses.icon}</span>` : ''}
              ${equippedRibbon ? `<span class="acc-ribbon-preview">${equippedRibbon.icon}</span>` : ''}
            </div>
            <div class="miu-cat-preview">🐱</div>
          </div>
          <div style="font-weight: 800; color: #0369a1; font-size: 15px; margin-top: 8px;">
            Miu Miu siêu cấp đáng yêu!
          </div>
        </div>

        <!-- Items Grid -->
        <div class="wardrobe-items-grid">
          ${WARDROBE_ITEMS.map(item => {
            const isOwned = owned.includes(item.id);
            const isEquipped = equipped.includes(item.id);
            const canBuy = stars >= item.cost;

            return `
              <div class="wardrobe-item-card ${isEquipped ? 'item-equipped' : ''}">
                <div style="font-size: 38px; margin-bottom: 4px;">${item.icon}</div>
                <div style="font-weight: 800; font-size: 14px; color: #1e293b;">${item.name}</div>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${item.desc}</div>

                ${isOwned ? `
                  <button class="wardrobe-action-btn ${isEquipped ? 'btn-unequip' : 'btn-equip'}" data-item-id="${item.id}" data-action="${isEquipped ? 'unequip' : 'equip'}">
                    ${isEquipped ? '✓ Đang mặc' : 'Mặc lên'}
                  </button>
                ` : `
                  <button class="wardrobe-action-btn btn-buy" data-item-id="${item.id}" data-action="buy" ${!canBuy ? 'disabled' : ''}>
                    ${item.cost} ⭐ Mua
                  </button>
                `}
              </div>
            `;
          }).join('')}
        </div>

        <button class="play-action-btn" id="closeWardrobeBtn" style="margin: 20px auto 0; font-size: 16px;">
          Xong rồi, về đảo chơi thôi!
        </button>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.modalBody.querySelector('#closeWardrobeBtn')?.addEventListener('click', () => {
      sound.playClick();
      this.close();
    });

    this.modalBody.querySelectorAll('.wardrobe-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const itemId = btn.dataset.itemId;
        const action = btn.dataset.action;

        let stars = parseInt(localStorage.getItem('math_stars') || '0', 10);
        let owned = JSON.parse(localStorage.getItem('adv_owned_wardrobe') || '[]');
        let equipped = JSON.parse(localStorage.getItem('adv_equipped_wardrobe') || '[]');

        const item = WARDROBE_ITEMS.find(i => i.id === itemId);
        if (!item) return;

        if (action === 'buy') {
          if (stars >= item.cost && !owned.includes(itemId)) {
            stars -= item.cost;
            owned.push(itemId);
            equipped.push(itemId);
            localStorage.setItem('math_stars', stars);
            localStorage.setItem('adv_owned_wardrobe', JSON.stringify(owned));
            localStorage.setItem('adv_equipped_wardrobe', JSON.stringify(equipped));
            sound.playCorrect();
          }
        } else if (action === 'equip') {
          // Remove conflicting item of same type
          equipped = equipped.filter(id => {
            const it = WARDROBE_ITEMS.find(x => x.id === id);
            return it && it.type !== item.type;
          });
          equipped.push(itemId);
          localStorage.setItem('adv_equipped_wardrobe', JSON.stringify(equipped));
        } else if (action === 'unequip') {
          equipped = equipped.filter(id => id !== itemId);
          localStorage.setItem('adv_equipped_wardrobe', JSON.stringify(equipped));
        }

        this.onUpdate();
        this.render();
      });
    });
  }
}
