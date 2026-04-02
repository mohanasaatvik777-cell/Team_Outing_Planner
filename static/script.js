// ===== STATE =====
let members = [];
const AVATARS = ['👩', '👨', '🧑', '👩‍💻', '👨‍💻', '🧑‍🎨', '👩‍🔬', '👨‍🍳', '🧑‍🚀', '👩‍🎤'];

// ===== PARTICLES =====
(function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#6c63ff', '#ff6584', '#43e97b', '#38f9d7', '#ffd700'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 3;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

// ===== GEMINI KEY =====
let geminiActivated = false;

async function setApiKey() {
  const key = document.getElementById('geminiKeyInput').value.trim();
  if (!key) { showToast('⚠️ Please paste your API key'); return; }
  const status = document.getElementById('apiKeyStatus');
  status.innerHTML = '<span style="color:var(--text-muted);font-size:0.82rem">🔄 Activating...</span>';
  try {
    const res = await fetch('/api/set_key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      geminiActivated = true;
      status.innerHTML = '<span style="color:#43e97b;font-size:0.82rem">✅ Gemini AI activated — plans will use real restaurant data!</span>';
      document.getElementById('geminiKeyInput').value = '';
      showToast('✅ Gemini AI activated!');
    } else {
      status.innerHTML = `<span style="color:var(--secondary);font-size:0.82rem">❌ ${data.message}</span>`;
    }
  } catch (e) {
    status.innerHTML = '<span style="color:var(--secondary);font-size:0.82rem">❌ Failed to connect</span>';
  }
}

// ===== BUDGET FIXED AT 800 =====
const FIXED_BUDGET = 800;
function addMember() {
  const name = document.getElementById('memberName').value.trim();
  if (!name) { showToast('⚠️ Please enter your name!'); return; }
  if (members.length >= 10) { showToast('👥 Max 10 members reached!'); return; }
  if (members.find(m => m.name.toLowerCase() === name.toLowerCase())) {
    showToast('🔁 This name is already added!'); return;
  }

  const food = document.querySelector('input[name="food"]:checked').value;
  const checkedActivities = [...document.querySelectorAll('input[name="activity"]:checked')].map(el => el.value);
  if (checkedActivities.length < 2 || checkedActivities.length > 3) {
    document.getElementById('activityError').style.display = 'block';
    return;
  }
  document.getElementById('activityError').style.display = 'none';
  const activity = checkedActivities[0]; // primary for planner logic
  const budget = FIXED_BUDGET;

  const member = { name, food_pref: food, activity_pref: activity, activity_prefs: checkedActivities, budget };
  members.push(member);

  renderMembers();

  // Reset form for next member
  document.getElementById('memberName').value = '';
  document.querySelector('input[name="food"][value="veg"]').checked = true;
  document.querySelectorAll('input[name="activity"]').forEach(cb => cb.checked = false);
  document.getElementById('activityError').style.display = 'none';
  document.getElementById('memberCount').textContent = members.length;

  updateTeamSummary();
  if (members.length === 10) {
    document.getElementById('generateSection').style.display = 'block';
  } else {
    document.getElementById('generateSection').style.display = 'none';
  }

  showToast(`✅ ${name} added! (${members.length}/10 members)`);

  // Submit to backend
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member)
  }).catch(() => {});
}

// ===== RENDER MEMBERS =====
function renderMembers() {
  const grid = document.getElementById('membersGrid');
  grid.innerHTML = '';
  members.forEach((m, i) => {
    const initial = escapeHtml(m.name.charAt(0).toUpperCase());
    const gradients = [
      'linear-gradient(135deg,#6c63ff,#ff6584)',
      'linear-gradient(135deg,#43e97b,#38f9d7)',
      'linear-gradient(135deg,#f7971e,#ffd200)',
      'linear-gradient(135deg,#f953c6,#b91d73)',
      'linear-gradient(135deg,#4facfe,#00f2fe)',
      'linear-gradient(135deg,#43e97b,#6c63ff)',
      'linear-gradient(135deg,#fa709a,#fee140)',
      'linear-gradient(135deg,#a18cd1,#fbc2eb)',
      'linear-gradient(135deg,#fd7043,#ff8a65)',
      'linear-gradient(135deg,#00c6ff,#0072ff)',
    ];
    const grad = gradients[i % gradients.length];
    const foodLabels = { veg: '🥗 Vegetarian', non_veg: '🍖 Non-Veg', both: '🍽️ Both' };
    const foodColors = { veg: '#43e97b', non_veg: '#ff6584', both: '#ffb400' };
    const foodText = foodLabels[m.food_pref] || m.food_pref;
    const foodColor = foodColors[m.food_pref] || '#aaa';
    const activityList = (m.activity_prefs || [m.activity_pref]);

    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
      <button class="member-remove" onclick="removeMember(${i})" title="Remove">✕</button>

      <div class="mc-header" style="background:${grad}">
        <div class="mc-avatar-ring">
          <div class="mc-avatar-letter">${initial}</div>
        </div>
        <div class="mc-header-info">
          <div class="mc-name">${escapeHtml(m.name)}</div>
          <div class="mc-member-num">Member #${i + 1}</div>
        </div>
      </div>

      <div class="mc-body">
        <div class="mc-info-row">
          <div class="mc-info-icon" style="background:${foodColor}20;color:${foodColor}">🍽</div>
          <div class="mc-info-content">
            <div class="mc-info-label">Food</div>
            <div class="mc-info-val" style="color:${foodColor}">${foodText}</div>
          </div>
        </div>

        <div class="mc-info-row">
          <div class="mc-info-icon" style="background:rgba(108,99,255,0.15);color:#a78bfa">🎯</div>
          <div class="mc-info-content">
            <div class="mc-info-label">Activities</div>
            <div class="mc-chips-mini">
              ${activityList.map(a => `<span class="mc-chip">${activityLabel(a)}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="mc-budget-strip" style="background:${grad}">
          <span class="mc-budget-label">Budget</span>
          <span class="mc-budget-val">₹${m.budget}<span class="mc-budget-sub">/person</span></span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function removeMember(i) {
  members.splice(i, 1);
  renderMembers();
  document.getElementById('memberCount').textContent = members.length;
  if (members.length === 10) {
    document.getElementById('generateSection').style.display = 'block';
  } else {
    document.getElementById('generateSection').style.display = 'none';
  }
  updateTeamSummary();
}

function updateTeamSummary() {
  document.getElementById('teamSize').textContent = members.length;
  const hasVeg = members.some(m => m.food_pref === 'veg' || m.food_pref === 'both');
  const hasNV = members.some(m => m.food_pref === 'non_veg' || m.food_pref === 'both');
  let foodText = hasVeg && hasNV ? '🍽️ Mixed food preferences' : hasNV ? '🍖 Non-veg team' : '🥗 Veg team';
  document.getElementById('foodSummary').textContent = foodText;

  const remaining = 10 - members.length;
  const counter = document.getElementById('memberCounter');
  if (counter) {
    counter.textContent = remaining > 0
      ? `➕ Add ${remaining} more member${remaining > 1 ? 's' : ''} to unlock AI plans`
      : '🎉 All 10 members added! Ready to generate.';
    counter.style.color = remaining === 0 ? '#43e97b' : 'var(--text-muted)';
  }
}

// ===== GENERATE PLANS =====
async function generatePlans() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.style.display = 'flex';
  animateLoading();

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ members, use_gemini: true })
    });
    const data = await res.json();

    setTimeout(() => {
      overlay.style.display = 'none';
      if (!data.plans || data.plans.length === 0) {
        showToast('❌ Could not generate plans. Please try again!');
        return;
      }
      renderPlans(data.plans);
      document.getElementById('resultsSection').style.display = 'block';
      document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 3200);
  } catch (e) {
    overlay.style.display = 'none';
    showToast('❌ Something went wrong. Try again!');
  }
}

function animateLoading() {
  const steps = document.querySelectorAll('.load-step');
  const fill = document.getElementById('loadingFill');
  let current = 0;
  steps.forEach(s => s.classList.remove('active'));
  steps[0].classList.add('active');
  fill.style.width = '10%';

  const interval = setInterval(() => {
    current++;
    if (current >= steps.length) { clearInterval(interval); return; }
    steps.forEach(s => s.classList.remove('active'));
    steps[current].classList.add('active');
    fill.style.width = `${((current + 1) / steps.length) * 100}%`;
  }, 750);
}

// ===== RENDER PLANS =====
function renderPlans(plans) {
  window._lastPlans = plans;  // store for print
  const container = document.getElementById('plansContainer');
  container.innerHTML = '';

  plans.forEach((plan, idx) => {
    const cb = plan.cost_breakdown;
    const fitPct = Math.min(100, Math.max(0, plan.fit_score));
    const stars = '★'.repeat(Math.round(plan.rating)) + '☆'.repeat(5 - Math.round(plan.rating));

    const card = document.createElement('div');
    card.className = 'plan-card';
    card.innerHTML = `
      <!-- HEADER -->
      <div class="plan-header">
        <div>
          <div class="plan-number">Plan ${plan.plan_number} of ${plans.length}</div>
          <div class="plan-title">${plan.venue_emoji} ${plan.venue}</div>
          <div class="plan-rating">
            <span class="stars">${stars}</span>
            <span style="color:var(--text-muted);font-size:0.85rem">${plan.rating}/5</span>
          </div>
        </div>
        <div style="text-align:right">
          <div class="budget-badge budget-ok">${plan.budget_status}</div>
          <div style="margin-top:8px;font-size:0.8rem;color:var(--text-muted)">📍 ${plan.distance_km} km from office</div>
        </div>
      </div>

      <!-- THREE KEY SECTIONS -->
      <div class="plan-three-sections">

        <!-- SECTION 1: RECOMMENDED VENUE -->
        <div class="key-section venue-section">
          <div class="key-section-label">🏛️ Recommended Venue</div>
          <div class="key-section-title">${plan.venue_emoji} ${plan.venue}</div>
          <p class="venue-desc">${plan.venue_description}</p>
          <div class="highlights">
            ${plan.highlights.map(h => `<div class="highlight-item">${h}</div>`).join('')}
          </div>
          <div style="margin-top:14px">
            <div class="plan-section-title">🎯 Activities Included</div>
            <div class="activities-list">
              ${plan.activities.map(a => `<span class="activity-chip">${a}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- SECTION 2: FOOD OPTION -->
        <div class="key-section food-section">
          <div class="key-section-label">🍽️ Food Option</div>
          <div class="food-option-card">
            <div class="food-emoji-big">${plan.food_emoji}</div>
            <div class="food-option-name">${plan.food}</div>
            <div class="food-option-type">${plan.food_type}</div>
            ${plan.food_location ? `<div class="food-location">📍 ${plan.food_location}</div>` : ''}
            ${plan.food_maps ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.food_maps)}" target="_blank" class="maps-link">🗺️ Open in Google Maps</a>` : ''}
            <div class="food-option-cost">₹${cb.food} <span>per person</span></div>
            ${plan.food_why ? `<div class="food-why">${plan.food_why}</div>` : ''}
            <div style="margin:10px 0 6px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ffb400">🍴 What to Order</div>
            <div class="dishes-list">
              ${(plan.food_dishes || []).map(d => `
                <div class="dish-item">
                  <span>✦ ${typeof d === 'object' ? d.item : d}</span>
                  ${typeof d === 'object' && d.price ? `<span class="dish-price">₹${d.price}</span>` : ''}
                </div>`).join('')}
            </div>
            <div class="food-tags" style="margin-top:12px">
              ${plan.food_type.toLowerCase().includes('veg') && !plan.food_type.toLowerCase().includes('non') ? '<span class="food-tag veg-tag">🥗 Veg Friendly</span>' : ''}
              ${plan.food_type.toLowerCase().includes('non') || plan.food_type.toLowerCase().includes('bbq') || plan.food_type.toLowerCase().includes('grill') ? '<span class="food-tag nonveg-tag">🍖 Non-Veg Available</span>' : ''}
              <span class="food-tag">📍 Near Venue</span>
            </div>
          </div>
        </div>

        <!-- SECTION 3: COST BREAKDOWN -->
        <div class="key-section cost-section">
          <div class="key-section-label">💰 Estimated Cost Breakdown</div>
          <div class="cost-breakdown">
            <div class="cost-row">
              <span class="cost-label">🎟️ Entry / Ticket Fee</span>
              <span class="cost-value">₹${cb.entry_fee}</span>
            </div>
            <div class="cost-row">
              <span class="cost-label">🍽️ Food & Beverages</span>
              <span class="cost-value">₹${cb.food}</span>
            </div>
            <div class="cost-row">
              <span class="cost-label">🚌 Transport (to & fro)</span>
              <span class="cost-value">₹${cb.transport}</span>
            </div>
            <div class="cost-row">
              <span class="cost-label">🧃 Misc / Snacks / Water</span>
              <span class="cost-value">₹${cb.misc}</span>
            </div>
            <div class="cost-row total">
              <span>💳 Total Per Person</span>
              <span>₹${cb.total_per_person}</span>
            </div>
            <div class="cost-row savings-row">
              <span>💚 Savings Per Person</span>
              <span>₹${plan.savings}</span>
            </div>
            <div class="cost-row group-total-row">
              <span>👥 Group Total (${members.length} people)</span>
              <span>₹${cb.total_group.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- AI RECOMMENDATION BAR -->
      <div class="ai-rec-bar">
        <div class="ai-rec-left">
          <span class="ai-rec-icon">🤖</span>
          <div>
            <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">AI Recommends</div>
            <div style="font-size:0.95rem;line-height:1.6;font-weight:500">${plan.ai_recommendation}</div>
          </div>
        </div>
        <div class="ai-rec-score">
          <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;text-align:center">Fit Score</div>
          <div class="fit-circle">${fitPct.toFixed(0)}%</div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="plan-footer">
        <div style="font-size:0.85rem;color:var(--text-muted)">
          🤖 Generated based on ${members.length} team member preferences
        </div>
        <button class="btn btn-outline" style="padding:8px 20px;font-size:0.8rem" onclick="copyPlan(${idx})">
          <i class="fas fa-copy"></i> Copy Plan
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function getRecommendationText(plan, members) {
  const count = members.length;
  const hasVeg = members.some(m => m.food_pref === 'veg' || m.food_pref === 'both');
  const hasNV = members.some(m => m.food_pref === 'non_veg' || m.food_pref === 'both');
  const foodNote = hasVeg && hasNV
    ? 'The food option caters to both veg and non-veg preferences in your team.'
    : hasNV ? 'Great non-veg options for your team.'
    : 'Fully vegetarian-friendly venue and food.';
  return `A solid pick for a team of ${count}. ${foodNote} At ₹${plan.cost_breakdown.total_per_person}/person, it ${plan.within_budget ? 'fits comfortably within' : 'slightly exceeds'} the ₹800 budget.`;
}

// ===== PRINT MODAL =====
function printPlans() {
  if (!window._lastPlans || window._lastPlans.length === 0) {
    showToast('⚠️ No plans to print yet!'); return;
  }
  const options = document.getElementById('printOptions');
  options.innerHTML = '';

  // "All Plans" option
  const allOpt = document.createElement('div');
  allOpt.className = 'print-option selected';
  allOpt.dataset.value = 'all';
  allOpt.innerHTML = `
    <div class="print-check">✓</div>
    <div class="print-option-info">
      <div class="print-option-name">🗂️ All Plans (${window._lastPlans.length} plans)</div>
      <div class="print-option-meta">Print all AI-generated plans together</div>
    </div>`;
  allOpt.onclick = () => togglePrintOption(allOpt);
  options.appendChild(allOpt);

  // Individual plan options
  window._lastPlans.forEach((plan, i) => {
    const opt = document.createElement('div');
    opt.className = 'print-option';
    opt.dataset.value = String(i);
    opt.innerHTML = `
      <div class="print-check"></div>
      <div class="print-option-info">
        <div class="print-option-name">${plan.venue_emoji} Plan ${plan.plan_number} — ${plan.venue}</div>
        <div class="print-option-meta">📍 ${plan.distance_km} km &nbsp;|&nbsp; ₹${plan.cost_breakdown.total_per_person}/person &nbsp;|&nbsp; ⭐ ${plan.rating}/5</div>
      </div>`;
    opt.onclick = () => togglePrintOption(opt);
    options.appendChild(opt);
  });

  document.getElementById('printModal').style.display = 'flex';
}

function togglePrintOption(el) {
  const allOpt = document.querySelector('.print-option[data-value="all"]');
  if (el.dataset.value === 'all') {
    // selecting "all" deselects individual ones
    document.querySelectorAll('.print-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    el.querySelector('.print-check').textContent = '✓';
  } else {
    // deselect "all" when individual picked
    allOpt.classList.remove('selected');
    allOpt.querySelector('.print-check').textContent = '';
    el.classList.toggle('selected');
    el.querySelector('.print-check').textContent = el.classList.contains('selected') ? '✓' : '';
  }
}

function closePrintModal() {
  document.getElementById('printModal').style.display = 'none';
}

function confirmPrint() {
  const selected = [...document.querySelectorAll('.print-option.selected')];
  if (selected.length === 0) { showToast('⚠️ Select at least one plan!'); return; }

  let plansToPrint;
  if (selected[0].dataset.value === 'all') {
    plansToPrint = window._lastPlans;
  } else {
    const indices = selected.map(el => parseInt(el.dataset.value));
    plansToPrint = indices.map(i => window._lastPlans[i]);
  }

  closePrintModal();
  openPrintWindow(plansToPrint);
}

function openPrintWindow(plans) {
  const teamNames = members.map(m => m.name).join(', ');

  const planHTML = plans.map(plan => {
    const cb = plan.cost_breakdown;
    const stars = '★'.repeat(Math.round(plan.rating)) + '☆'.repeat(5 - Math.round(plan.rating));
    const dishRows = (plan.food_dishes || []).map(d =>
      `<tr><td>${typeof d === 'object' ? d.item : d}</td><td style="text-align:right;color:#b45309;font-weight:600">${typeof d === 'object' && d.price ? '₹' + d.price : ''}</td></tr>`
    ).join('');

    return `
    <div class="plan-block">
      <div class="plan-top">
        <div>
          <div class="plan-label">Plan ${plan.plan_number} of ${plans.length}</div>
          <div class="plan-name">${plan.venue_emoji} ${plan.venue}</div>
          <div class="plan-stars">${stars} &nbsp; ${plan.rating}/5 &nbsp;&nbsp; 📍 ${plan.distance_km} km from office</div>
        </div>
        <div class="budget-pill">✅ Within ₹800 Budget</div>
      </div>

      <div class="three-col">

        <div class="col">
          <div class="col-title">🏛️ Recommended Venue</div>
          <p class="venue-desc">${plan.venue_description}</p>
          <table class="info-table">
            ${plan.highlights.map(h => `<tr><td>${h}</td></tr>`).join('')}
          </table>
          <div class="col-title" style="margin-top:12px">🎯 Activities</div>
          <div class="chips">
            ${plan.activities.map(a => `<span class="chip">${a}</span>`).join('')}
          </div>
        </div>

        <div class="col">
          <div class="col-title">🍽️ Food Option</div>
          <div class="food-box">
            <div class="food-name">${plan.food_emoji} ${plan.food}</div>
            <div class="food-type">${plan.food_type}</div>
            ${plan.food_location ? `<div class="food-loc">📍 ${plan.food_location}</div>` : ''}
            ${plan.food_maps ? `<div class="food-loc">🗺️ Search: ${plan.food_maps}</div>` : ''}
            <div class="food-cost">₹${cb.food} per person</div>
            <div class="col-title" style="margin-top:10px">🍴 What to Order</div>
            <table class="dish-table">
              ${dishRows}
            </table>
          </div>
        </div>

        <div class="col">
          <div class="col-title">💰 Cost Breakdown</div>
          <table class="cost-table">
            <tr><td>🎟️ Entry Fee</td><td>₹${cb.entry_fee}</td></tr>
            <tr><td>🍽️ Food</td><td>₹${cb.food}</td></tr>
            <tr><td>🚌 Transport</td><td>₹${cb.transport}</td></tr>
            <tr><td>🧃 Misc / Snacks</td><td>₹${cb.misc}</td></tr>
            <tr class="total-row"><td>💳 Per Person Total</td><td>₹${cb.total_per_person}</td></tr>
            <tr class="savings-row"><td>💚 Savings/Person</td><td>₹${plan.savings}</td></tr>
            <tr class="group-row"><td>👥 Group Total (${members.length} people)</td><td>₹${cb.total_group.toLocaleString()}</td></tr>
          </table>
        </div>

      </div>

      <div class="ai-bar">
        <span class="ai-icon">🤖</span>
        <div><strong>AI Recommends:</strong> ${plan.ai_recommendation}</div>
      </div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Team Outing Plans — Hyderabad</title>
  <style>
    @page { size: A4; margin: 12mm 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; color: #111; background: #fff; }

    .header { text-align: center; padding: 10px 0 14px; border-bottom: 2px solid #6c63ff; margin-bottom: 16px; }
    .header h1 { font-size: 18pt; color: #6c63ff; }
    .header p { font-size: 9pt; color: #555; margin-top: 4px; }

    .plan-block { border: 1.5px solid #ddd; border-radius: 10px; margin-bottom: 18px; overflow: hidden; page-break-inside: avoid; break-inside: avoid; }

    .plan-top { background: #f3f2ff; padding: 10px 14px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #ddd; }
    .plan-label { font-size: 7.5pt; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    .plan-name { font-size: 14pt; font-weight: 800; color: #111; margin: 2px 0; }
    .plan-stars { font-size: 8.5pt; color: #555; }
    .budget-pill { background: #e6faf0; color: #1a7a4a; border: 1px solid #a3d9b8; padding: 4px 12px; border-radius: 20px; font-size: 8pt; font-weight: 700; white-space: nowrap; }

    .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #eee; }
    .col { padding: 12px 14px; border-right: 1px solid #eee; }
    .col:last-child { border-right: none; }
    .col-title { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6c63ff; margin-bottom: 6px; }

    .venue-desc { font-size: 8.5pt; color: #444; line-height: 1.5; margin-bottom: 8px; }

    .info-table { width: 100%; font-size: 8pt; }
    .info-table td { padding: 3px 0; color: #333; border-bottom: 1px solid #f0f0f0; }

    .chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .chip { background: #edfff5; border: 1px solid #a3d9b8; color: #1a7a4a; font-size: 7.5pt; padding: 2px 8px; border-radius: 20px; }

    .food-box { background: #fffbf0; border: 1px solid #ffe0a0; border-radius: 8px; padding: 10px; }
    .food-name { font-size: 10pt; font-weight: 700; color: #111; }
    .food-type { font-size: 8pt; color: #888; margin: 2px 0 4px; }
    .food-loc { font-size: 7.5pt; color: #555; margin: 2px 0; }
    .food-cost { font-size: 11pt; font-weight: 800; color: #b45309; margin: 6px 0 4px; }

    .dish-table { width: 100%; font-size: 8pt; margin-top: 4px; }
    .dish-table td { padding: 3px 0; border-bottom: 1px dashed #ffe0a0; }

    .cost-table { width: 100%; font-size: 8.5pt; border-collapse: collapse; }
    .cost-table td { padding: 5px 4px; border-bottom: 1px solid #f0f0f0; }
    .cost-table td:last-child { text-align: right; font-weight: 600; }
    .total-row td { font-weight: 800; font-size: 10pt; color: #6c63ff; border-top: 2px solid #ddd; padding-top: 8px; }
    .savings-row td { color: #1a7a4a; font-weight: 700; }
    .group-row td { color: #888; font-size: 8pt; }

    .ai-bar { background: #f9fff9; border-top: 1px solid #d4edda; padding: 8px 14px; display: flex; gap: 10px; align-items: flex-start; font-size: 8.5pt; color: #333; }
    .ai-icon { font-size: 14pt; flex-shrink: 0; }

    .footer { text-align: center; font-size: 8pt; color: #aaa; margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🗺️ Team Outing Planner — AI Generated Plans</h1>
    <p>Hyderabad &nbsp;|&nbsp; Budget: ₹800/person &nbsp;|&nbsp; Max Distance: 40 km &nbsp;|&nbsp; Team: ${teamNames}</p>
  </div>
  ${planHTML}
  <div class="footer">Generated by Team Outing Planner &nbsp;|&nbsp; 🤖 AI-Powered &nbsp;|&nbsp; Hyderabad</div>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

function copyPlan(idx) {
  const plans = document.querySelectorAll('.plan-card');
  const text = plans[idx].innerText;
  navigator.clipboard.writeText(text).then(() => showToast('📋 Plan copied to clipboard!'));
}

// ===== RESET =====
function resetPlanner() {
  members = [];
  renderMembers();
  document.getElementById('memberCount').textContent = '0';
  document.getElementById('memberCounter').textContent = '';
  document.getElementById('generateSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('plansContainer').innerHTML = '';
  window._lastPlans = [];

  // Reset form too
  document.getElementById('memberName').value = '';
  document.querySelector('input[name="food"][value="veg"]').checked = true;
  document.querySelectorAll('input[name="activity"]').forEach(cb => cb.checked = false);
  document.getElementById('activityError').style.display = 'none';

  // Scroll to very top
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('🔄 Planner reset. Start fresh!');
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== HELPERS =====
function foodLabel(v) {
  return { veg: '🥗 Veg', non_veg: '🍖 Non-Veg', both: '🍽️ Both' }[v] || v;
}
function activityLabel(v) {
  return {
    adventure: '🧗 Adventure', nature: '🌿 Nature',
    entertainment: '🎭 Entertainment', leisure: '🌅 Leisure',
    spiritual: '🛕 Spiritual', food_tour: '🍜 Food Tour',
    sports: '⚽ Sports', cultural: '🏛️ Cultural',
    photography: '📸 Photography', wellness: '🧘 Wellness'
  }[v] || v;
}
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Allow Enter key to add member
document.getElementById('memberName').addEventListener('keydown', e => {
  if (e.key === 'Enter') addMember();
});
