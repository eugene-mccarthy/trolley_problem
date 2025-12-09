/* ============================================
   MORAL WEIGHTS EXPLORER - API / SUPABASE
   ============================================ */

// Submit individual response
async function submitResponse(scenarioId, choice, scenario) {
    try {
        await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': CONFIG.SUPABASE_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                session_id: state.sessionId,
                scenario_id: scenarioId,
                choice: choice,
                scenario: {
                    category: scenario.category,
                    framing: scenario.framing,
                    question: scenario.question,
                    optionA: scenario.optionA,
                    optionB: scenario.optionB
                },
                elo_ratings: state.eloRatings,
                user_agent: navigator.userAgent,
                question_number: state.questionCount
            })
        });
        
        // Periodically submit full session
        if (state.responses.length % CONFIG.SESSION_SUBMIT_INTERVAL === 0) {
            submitFullSession();
        }
    } catch (e) {
        console.log('Supabase submission failed, data saved locally');
    }
}

// Submit full session summary
async function submitFullSession() {
    try {
        await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': CONFIG.SUPABASE_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                session_id: state.sessionId,
                session_start: state.sessionStart,
                completed_at: new Date().toISOString(),
                total_responses: state.responses.length,
                elo_ratings: state.eloRatings,
                responses: state.responses.map(r => ({
                    scenarioId: r.id,
                    choice: r.choice,
                    category: r.scenario?.category
                })),
                user_agent: navigator.userAgent
            })
        });
    } catch (e) {
        console.log('Supabase session submission failed');
    }
}