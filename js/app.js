/* ============================================
   MORAL WEIGHTS EXPLORER - MAIN APPLICATION
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

let state = {
    sessionId: generateSessionId(),
    sessionStart: new Date().toISOString(),
    questionCount: 0,
    responses: [],
    eloRatings: {},
    started: false
};

let currentScenario = null;

function generateSessionId() {
    return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function loadState() {
    const saved = localStorage.getItem('moralWeightsState_v5');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
    }
    // Initialize Elo ratings for all entities
    Object.keys(entities).forEach(e => {
        if (!state.eloRatings[e]) {
            state.eloRatings[e] = { rating: 0, comparisons: 0, wins: 0, losses: 0 };
        }
    });
}

function saveState() {
    localStorage.setItem('moralWeightsState_v5', JSON.stringify(state));
}

// ============================================
// ELO RATING SYSTEM
// ============================================

function calculateEloChange(winnerRating, loserRating, numWinner, numLoser) {
    const K = 32;
    const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    const numberRatio = Math.log10(Math.max(numLoser / numWinner, 1) + 1);
    const adjustedK = K * (1 + numberRatio * 0.5);
    return adjustedK * (1 - expectedWinner);
}

function updateEloRatings(winnerId, loserId, numWinner, numLoser) {
    const winner = state.eloRatings[winnerId];
    const loser = state.eloRatings[loserId];
    
    if (!winner || !loser) return;
    
    const change = calculateEloChange(winner.rating, loser.rating, numWinner, numLoser);
    
    winner.rating += change;
    winner.comparisons++;
    winner.wins++;
    
    loser.rating -= change;
    loser.comparisons++;
    loser.losses++;
}

// ============================================
// UI RENDERING
// ============================================

function renderScenario() {
    currentScenario = generateNextScenario(state.questionCount);
    const container = document.getElementById('scenarioContainer');
    
    container.innerHTML = `
        <div class="scenario-card">
            <div class="scenario-meta">
                <span class="scenario-category">${currentScenario.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <span class="scenario-framing">${currentScenario.framing}</span>
                <span class="scenario-number">Question ${state.questionCount + 1}</span>
            </div>
            <p class="scenario-question">${currentScenario.question}</p>
            <div class="choices">
                <button class="choice-btn" data-choice="A">
                    <div class="choice-header">
                        <span class="choice-label">Option A</span>
                        <div class="choice-tags">
                            ${currentScenario.optionA.categories.slice(0, 3).map(c => `<span class="choice-tag">${c}</span>`).join('')}
                        </div>
                    </div>
                    <div class="choice-text">${currentScenario.optionA.text}</div>
                </button>
                <button class="choice-btn" data-choice="B">
                    <div class="choice-header">
                        <span class="choice-label">Option B</span>
                        <div class="choice-tags">
                            ${currentScenario.optionB.categories.slice(0, 3).map(c => `<span class="choice-tag">${c}</span>`).join('')}
                        </div>
                    </div>
                    <div class="choice-text">${currentScenario.optionB.text}</div>
                </button>
            </div>
        </div>
    `;

    container.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoice(btn.dataset.choice));
    });

    document.getElementById('progressText').textContent = `Question ${state.questionCount + 1}`;
}

function handleChoice(choice) {
    const btn = document.querySelector(`[data-choice="${choice}"]`);
    
    // Determine winner/loser for Elo
    const winner = choice === 'A' ? currentScenario.optionA : currentScenario.optionB;
    const loser = choice === 'A' ? currentScenario.optionB : currentScenario.optionA;
    
    // Update Elo ratings
    updateEloRatings(winner.entity, loser.entity, winner.num, loser.num);
    
    // Store response
    state.responses.push({
        id: currentScenario.id,
        choice,
        scenario: currentScenario,
        timestamp: new Date().toISOString()
    });
    
    state.questionCount++;
    saveState();
    
    // Send to backend
    submitResponse(currentScenario.id, choice, currentScenario);
    
    // Visual feedback
    btn.classList.add(choice === 'A' ? 'selected-a' : 'selected-b');
    
    // Auto-advance
    setTimeout(() => {
        renderScenario();
    }, 200);
}

// ============================================
// RESULTS DISPLAY
// ============================================

function updateResults() {
    updateSessionInfo();
    updateStats();
    updateWeights();
    updateCategoryWeights();
    updateUntestedList();
    updateResponseList();
    updateInsights();
    updateExportData();
}

function updateSessionInfo() {
    document.getElementById('sessionId').textContent = state.sessionId;
    document.getElementById('responseCount').textContent = state.responses.length;
    document.getElementById('sessionStart').textContent = new Date(state.sessionStart).toLocaleString();
}

function updateStats() {
    const comparedEntities = Object.values(state.eloRatings).filter(e => e.comparisons > 0).length;
    const categories = new Set();
    Object.entries(state.eloRatings).forEach(([entity, data]) => {
        if (data.comparisons > 0 && entities[entity]) {
            entities[entity].categories.forEach(c => categories.add(c));
        }
    });
    
    document.getElementById('statAnswered').textContent = state.responses.length;
    document.getElementById('statEntities').textContent = comparedEntities;
    document.getElementById('statCategories').textContent = categories.size;
}

function updateWeights() {
    const container = document.getElementById('weightsContainer');
    
    const compared = Object.entries(state.eloRatings)
        .filter(([_, data]) => data.comparisons > 0)
        .sort((a, b) => b[1].rating - a[1].rating);
    
    if (compared.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚖️</div>
                <p>Complete some scenarios to see your moral weights!</p>
            </div>
        `;
        return;
    }

    const maxAbs = Math.max(...compared.map(([_, d]) => Math.abs(d.rating)), 1);

    container.innerHTML = compared.map(([entity, data]) => {
        const rating = data.rating;
        const isPositive = rating >= 0;
        const barWidth = (Math.abs(rating) / maxAbs) * 50;
        const valueClass = rating > 0.5 ? 'positive' : (rating < -0.5 ? 'negative' : 'neutral');
        
        return `
            <div class="weight-item">
                <span class="weight-label">${entities[entity]?.display || entity}</span>
                <div class="weight-bar-container">
                    <div class="weight-bar-zero"></div>
                    <div class="weight-bar ${isPositive ? 'positive' : 'negative'}" 
                         style="width: ${barWidth}%;"></div>
                </div>
                <span class="weight-value ${valueClass}">${rating >= 0 ? '+' : ''}${rating.toFixed(1)}</span>
                <span class="weight-comparisons">(${data.comparisons})</span>
            </div>
        `;
    }).join('');
}

function updateCategoryWeights() {
    const container = document.getElementById('categoryWeights');
    
    const categoryScores = {};
    
    Object.entries(state.eloRatings).forEach(([entity, data]) => {
        if (data.comparisons === 0) return;
        const ent = entities[entity];
        if (!ent) return;
        
        ent.categories.forEach(cat => {
            if (!categoryScores[cat]) {
                categoryScores[cat] = { total: 0, count: 0 };
            }
            categoryScores[cat].total += data.rating;
            categoryScores[cat].count++;
        });
    });

    const sortedCats = Object.entries(categoryScores)
        .map(([cat, data]) => ({ cat, avg: data.total / data.count, count: data.count }))
        .sort((a, b) => b.avg - a.avg);

    if (sortedCats.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Complete some scenarios to see category weights.</p></div>';
        return;
    }

    const maxAbs = Math.max(...sortedCats.map(c => Math.abs(c.avg)), 1);

    container.innerHTML = sortedCats.map(({ cat, avg, count }) => {
        const isPositive = avg >= 0;
        const barWidth = (Math.abs(avg) / maxAbs) * 50;
        const valueClass = avg > 0.5 ? 'positive' : (avg < -0.5 ? 'negative' : 'neutral');
        
        return `
            <div class="weight-item">
                <span class="weight-label">${cat}</span>
                <div class="weight-bar-container">
                    <div class="weight-bar-zero"></div>
                    <div class="weight-bar ${isPositive ? 'positive' : 'negative'}" 
                         style="width: ${barWidth}%;"></div>
                </div>
                <span class="weight-value ${valueClass}">${avg >= 0 ? '+' : ''}${avg.toFixed(1)}</span>
                <span class="weight-comparisons">(${count})</span>
            </div>
        `;
    }).join('');
}

function updateUntestedList() {
    const container = document.getElementById('untestedList');
    const untested = Object.entries(state.eloRatings)
        .filter(([_, data]) => data.comparisons === 0)
        .map(([entity]) => entity);
    
    if (untested.length === 0) {
        container.innerHTML = '<span class="untested-item" style="background: var(--selection-a); border-color: var(--selection-a-border); color: var(--selection-a-border);">All entities have been compared!</span>';
        return;
    }
    
    container.innerHTML = untested.map(e => 
        `<span class="untested-item">${entities[e]?.display || e}</span>`
    ).join('');
}

function updateResponseList() {
    const container = document.getElementById('responseList');
    
    if (state.responses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No responses recorded yet.</p>
            </div>
        `;
        return;
    }
    
    const recentResponses = state.responses.slice(-15).reverse();
    
    container.innerHTML = recentResponses.map(resp => {
        const scenario = resp.scenario;
        const chosen = resp.choice === 'A' ? scenario.optionA : scenario.optionB;
        const rejected = resp.choice === 'A' ? scenario.optionB : scenario.optionA;
        
        return `
            <div class="response-item">
                <span class="response-question">
                    Chose <strong>${chosen.text}</strong> over ${rejected.text}
                </span>
                <span class="response-badge choice-${resp.choice.toLowerCase()}">
                    ${resp.choice}
                </span>
            </div>
        `;
    }).join('');
    
    if (state.responses.length > 15) {
        container.innerHTML += `<p style="text-align: center; color: var(--text-muted); margin-top: 1rem;">Showing last 15 of ${state.responses.length} responses</p>`;
    }
}

function updateInsights() {
    const box = document.getElementById('insightsBox');
    const content = document.getElementById('insightsContent');
    
    if (state.responses.length < 10) {
        box.style.display = 'none';
        return;
    }
    
    const insights = [];
    const ratings = state.eloRatings;
    
    // Human vs Animal gap
    const humanEnts = Object.entries(ratings).filter(([e, d]) => 
        d.comparisons > 0 && entities[e]?.isHuman
    );
    const animalEnts = Object.entries(ratings).filter(([e, d]) => 
        d.comparisons > 0 && !entities[e]?.isHuman
    );
    
    if (humanEnts.length > 0 && animalEnts.length > 0) {
        const avgHuman = humanEnts.reduce((s, [_, d]) => s + d.rating, 0) / humanEnts.length;
        const avgAnimal = animalEnts.reduce((s, [_, d]) => s + d.rating, 0) / animalEnts.length;
        const gap = avgHuman - avgAnimal;
        
        if (gap > 20) {
            insights.push(`Strong human preference: Human entities average ${gap.toFixed(0)} points higher than animals.`);
        } else if (gap > 10) {
            insights.push(`Moderate human preference: Human entities average ${gap.toFixed(0)} points higher than animals.`);
        } else if (gap < 5) {
            insights.push(`Relatively equal weighting: Only ${gap.toFixed(0)} point gap between humans and animals on average.`);
        }
    }
    
    // Pet vs farm animal
    const pets = ['dog', 'cat'].filter(e => ratings[e]?.comparisons > 0);
    const farm = ['pig', 'cow', 'chicken'].filter(e => ratings[e]?.comparisons > 0);
    
    if (pets.length > 0 && farm.length > 0) {
        const avgPet = pets.reduce((s, e) => s + ratings[e].rating, 0) / pets.length;
        const avgFarm = farm.reduce((s, e) => s + ratings[e].rating, 0) / farm.length;
        
        if (avgPet > avgFarm + 10) {
            insights.push(`Pet bias detected: Companion animals rated ${(avgPet - avgFarm).toFixed(0)} points higher than farm animals.`);
        }
    }
    
    // Great apes
    const greatApes = ['chimpanzee', 'gorilla', 'orangutan'].filter(e => ratings[e]?.comparisons > 0);
    if (greatApes.length > 0 && animalEnts.length > greatApes.length) {
        const avgApe = greatApes.reduce((s, e) => s + ratings[e].rating, 0) / greatApes.length;
        const otherAnimals = animalEnts.filter(([e]) => !greatApes.includes(e));
        if (otherAnimals.length > 0) {
            const avgOther = otherAnimals.reduce((s, [_, d]) => s + d.rating, 0) / otherAnimals.length;
            if (avgApe > avgOther + 15) {
                insights.push(`Great ape recognition: Apes rated ${(avgApe - avgOther).toFixed(0)} points higher than other animals.`);
            }
        }
    }
    
    insights.push(`Analysis based on ${state.responses.length} responses comparing ${Object.values(ratings).filter(r => r.comparisons > 0).length} entities.`);
    
    box.style.display = 'block';
    content.innerHTML = insights.map(i => `<div class="insight-item">${i}</div>`).join('');
}

function updateExportData() {
    const exportData = {
        sessionId: state.sessionId,
        sessionStart: state.sessionStart,
        exportTime: new Date().toISOString(),
        totalResponses: state.responses.length,
        eloRatings: state.eloRatings,
        responses: state.responses
    };
    
    document.getElementById('exportData').value = JSON.stringify(exportData, null, 2);
}

// ============================================
// EVENT HANDLERS
// ============================================

function initEventHandlers() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
            
            if (tab.dataset.tab === 'results') {
                updateResults();
            }
        });
    });

    // Start button
    document.getElementById('startBtn').addEventListener('click', () => {
        state.started = true;
        saveState();
        document.getElementById('introSection').style.display = 'none';
        document.getElementById('scenarioSection').style.display = 'block';
        renderScenario();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all responses? This cannot be undone.')) {
            state.responses = [];
            state.questionCount = 0;
            state.sessionId = generateSessionId();
            state.sessionStart = new Date().toISOString();
            Object.keys(state.eloRatings).forEach(e => {
                state.eloRatings[e] = { rating: 0, comparisons: 0, wins: 0, losses: 0 };
            });
            saveState();
            updateResults();
        }
    });

    // Copy button
    document.getElementById('copyDataBtn').addEventListener('click', () => {
        const textarea = document.getElementById('exportData');
        textarea.select();
        document.execCommand('copy');
        alert('Data copied to clipboard!');
    });

    // Download button
    document.getElementById('downloadDataBtn').addEventListener('click', () => {
        const data = document.getElementById('exportData').value;
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moral-weights-${state.sessionId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Submit on page unload
    window.addEventListener('beforeunload', () => {
        if (state.responses.length > 0) {
            submitFullSession();
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    loadState();
    initEventHandlers();
    
    if (state.started) {
        document.getElementById('introSection').style.display = 'none';
        document.getElementById('scenarioSection').style.display = 'block';
        renderScenario();
    }
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);