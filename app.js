/**
 * ShopSteward 3D — Cyber Spatial HUD & Brutalist Interactivity
 * Built with Web Audio API sound synthesis, thermal receipt engine,
 * 3D spatial perspective tilt, and AI assistant simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initSpatialTilt();
  initThermalReceiptEngine();
  initAIAssistant();
  initNicheMatrix();
  initFAQSystem();
  initMobileHUD();
  initCopyTriggers();
});

// --- 1. WEB AUDIO API SYNTHETIC SOUND ENGINE ---
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  function playSynthBleep(freq = 600, duration = 0.04, type = 'sine') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not allowed yet', e);
    }
  }

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleBtn.classList.toggle('on', soundEnabled);
    toggleBtn.innerText = soundEnabled ? '⚡ SFX: ON' : '⚡ SFX: OFF';
    if (soundEnabled) {
      playSynthBleep(880, 0.08, 'triangle');
    }
  });

  // Attach sound to cyber buttons & interactive tabs
  document.querySelectorAll('button, .btn-cyber, .niche-hud-chip, .sandbox-tab-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => playSynthBleep(420, 0.03, 'sine'));
    elem.addEventListener('click', () => playSynthBleep(950, 0.06, 'triangle'));
  });

  window.playShopBleep = playSynthBleep;
}

// --- 2. 3D SPATIAL PERSPECTIVE TILT ---
function initSpatialTilt() {
  const cards = document.querySelectorAll('.spatial-card');
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -8;
      const rotY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// --- 3. THERMAL RECEIPT PRINTER & POS SIMULATOR ---
function initThermalReceiptEngine() {
  const itemSelect = document.getElementById('pos-item-select');
  const qtyInput = document.getElementById('pos-qty-input');
  const printBtn = document.getElementById('pos-print-trigger');
  
  const receiptItem = document.getElementById('receipt-item-name');
  const receiptQty = document.getElementById('receipt-item-qty');
  const receiptRate = document.getElementById('receipt-item-rate');
  const receiptSubtotal = document.getElementById('receipt-subtotal');
  const receiptTotal = document.getElementById('receipt-grand-total');
  const receiptTime = document.getElementById('receipt-timestamp');
  const receiptTape = document.getElementById('thermal-receipt-tape');

  function calculateAndRender() {
    if (!itemSelect || !qtyInput) return;
    const selectedOption = itemSelect.options[itemSelect.selectedIndex];
    const itemName = selectedOption.text.split(' - ')[0];
    const rate = parseFloat(selectedOption.value) || 0;
    const qty = parseInt(qtyInput.value) || 1;
    const total = rate * qty;

    if (receiptItem) receiptItem.innerText = itemName;
    if (receiptQty) receiptQty.innerText = `${qty}x`;
    if (receiptRate) receiptRate.innerText = `₹${rate}`;
    if (receiptSubtotal) receiptSubtotal.innerText = `₹${total.toLocaleString('en-IN')}`;
    if (receiptTotal) receiptTotal.innerText = `₹${total.toLocaleString('en-IN')}.00`;
    if (receiptTime) receiptTime.innerText = new Date().toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });
  }

  if (itemSelect && qtyInput) {
    itemSelect.addEventListener('change', calculateAndRender);
    qtyInput.addEventListener('input', calculateAndRender);
  }

  if (printBtn && receiptTape) {
    printBtn.addEventListener('click', () => {
      calculateAndRender();
      receiptTape.style.animation = 'none';
      void receiptTape.offsetWidth;
      receiptTape.style.animation = 'receiptSpool 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      if (window.playShopBleep) {
        window.playShopBleep(300, 0.12, 'sawtooth');
      }
    });
  }

  // Interactive Sandbox Tabs
  const tabs = document.querySelectorAll('.sandbox-tab-btn');
  const panels = document.querySelectorAll('.sandbox-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  calculateAndRender();
}

// --- 4. AI STEWARD CONSOLE ASSISTANT ---
function initAIAssistant() {
  const input = document.getElementById('ai-query-input');
  const submitBtn = document.getElementById('ai-query-submit');
  const outputBox = document.getElementById('ai-output-stream');
  const presetChips = document.querySelectorAll('.ai-preset-btn');

  if (!input || !submitBtn || !outputBox) return;

  const responses = {
    'top selling item this week': '📊 [TELEMETRY RECORD]: Top seller this week is **IFFCO Urea 45kg** (142 bags moved, ₹37,914 turnover, 18.2% margin). Second rank: **Coromandel Gromor 14:35:14** (88 bags).',
    'dap fertilizer stock level': '⚠️ [CRITICAL ALERT]: **DAP 18:46:00** is at **14 bags** remaining (Buffer target: 50 bags). At current sales rate, stock exhausts in 36 hours. Supplier: Agro Syndicate.',
    'pending udhaar list': '📒 [KHAATA SUMMARY]: Total credit outstanding: **₹48,250** across 12 farmers. Oldest balance: **Ramesh Patel (₹6,400, 34 days)**. WhatsApp reminder link primed.',
    'today\'s total profit': '💰 [PROFIT AUDIT]: Estimated net profit today: **₹9,420** across 48 thermal invoices (Gross Revenue: ₹41,380). Peak rush: 10:30 AM to 1:15 PM.'
  };

  function runQuery(q) {
    const clean = q.trim().toLowerCase();
    input.value = q;
    outputBox.innerHTML = '<span style="color: var(--acid);">[PROCESSING] Querying encrypted local shop ledger...</span>';

    setTimeout(() => {
      let result = responses[clean];
      if (!result) {
        if (clean.includes('stock') || clean.includes('item') || clean.includes('fertilizer')) {
          result = responses['dap fertilizer stock level'];
        } else if (clean.includes('udhaar') || clean.includes('credit') || clean.includes('due')) {
          result = responses['pending udhaar list'];
        } else if (clean.includes('profit') || clean.includes('margin') || clean.includes('today')) {
          result = responses['today\'s total profit'];
        } else {
          result = responses['top selling item this week'];
        }
      }

      outputBox.innerHTML = `
        <div style="color: var(--acid); margin-bottom: 6px; font-weight: 800;">[AI_STEWARD_RESPONSE // STATUS: OK]</div>
        <div style="color: #ffffff; line-height: 1.6;">${result.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--acid);">$1</strong>')}</div>
      `;
      if (window.playShopBleep) window.playShopBleep(800, 0.08, 'sine');
    }, 400);
  }

  submitBtn.addEventListener('click', () => {
    if (input.value) runQuery(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value) runQuery(input.value);
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      runQuery(chip.getAttribute('data-ask'));
    });
  });
}

// --- 5. NICHE INDUSTRY MATRIX ---
function initNicheMatrix() {
  const chips = document.querySelectorAll('.niche-hud-chip');
  const tag = document.getElementById('niche-active-tag');
  const desc = document.getElementById('niche-active-desc');

  const data = {
    agro: {
      tag: 'AGRICULTURE // AGRO CHEMICALS & SEEDS',
      text: 'Custom units: Quintals, 50kg Bags, Litres, Bottles. Batch number and expiration alerts for pesticides, seeds subsidy billing, and farmer credit (Khaata) logging.'
    },
    grocery: {
      tag: 'GROCERY // KIRANA & GENERAL STORE',
      text: 'Ultra-fast 1-click counter billing for 2,000+ items. Kg, Grams, Packets, and Cartons. Loose commodity calculator and fast thermal receipt printing.'
    },
    hardware: {
      tag: 'HARDWARE // TOOLS, PAINTS & SANITARY',
      text: 'Measurements in MM, Inches, Feet, Bundles & Pieces. Track supplier purchase bills, wholesale margins, and contractor commission payouts.'
    },
    wholesale: {
      tag: 'WHOLESALE // FMCG & DISTRIBUTION',
      text: 'Dual-tier rates (Retail vs Dealer), box-to-piece conversions, multi-vehicle dispatch challans, and GST E-way bill records.'
    },
    textile: {
      tag: 'TEXTILE // CLOTHING & FABRICS',
      text: 'Variants by Size, Color, Fabric, Roll & Meter counts. Seasonal dead-stock alerts and festive discount pricing management.'
    },
    electronics: {
      tag: 'ELECTRONICS // MOBILE & APPLIANCES',
      text: 'IMEI and Serial number tracking printed directly on bills. Warranty logging, technician repair jobs, and accessory margin reports.'
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const key = chip.getAttribute('data-cat');
      const item = data[key];
      if (item && tag && desc) {
        tag.innerText = item.tag;
        desc.innerText = item.text;
      }
    });
  });
}

// --- 6. FAQ SYSTEM ---
function initFAQSystem() {
  const rows = document.querySelectorAll('.faq-row');

  rows.forEach(row => {
    const btn = row.querySelector('.faq-button');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      rows.forEach(r => r.classList.remove('open'));
      if (!isOpen) row.classList.add('open');
    });
  });
}

// --- 7. MOBILE HUD DRAWER ---
function initMobileHUD() {
  const trigger = document.getElementById('hud-mobile-toggle');
  const closeBtn = document.getElementById('hud-drawer-close');
  const drawer = document.getElementById('hud-mobile-drawer');
  const links = document.querySelectorAll('.drawer-link-item');

  if (!trigger || !drawer) return;

  function toggle(open) {
    if (open) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  trigger.addEventListener('click', () => toggle(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggle(false));
  links.forEach(l => l.addEventListener('click', () => toggle(false)));
}

// --- 8. COPY TRIGGERS ---
function initCopyTriggers() {
  const copyBtns = document.querySelectorAll('.copy-badge-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const prev = btn.innerText;
        btn.innerText = 'COPIED!';
        btn.style.color = 'var(--acid)';
        btn.style.borderColor = 'var(--acid)';
        setTimeout(() => {
          btn.innerText = prev;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1800);
      });
    });
  });
}
