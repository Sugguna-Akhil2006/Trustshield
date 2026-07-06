const BACKEND_BASE_URL = "http://127.0.0.1:8000";

document.getElementById("analyzeBtn").addEventListener("click", async () => {

    try {
        // Get active tab
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab?.id) {
            showError("Unable to access current tab.");
            return;
        }

        // Inject content script if not already loaded
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });

        // Request email content from Gmail
        chrome.tabs.sendMessage(tab.id, { action: "getEmail" }, async (response) => {

            if (chrome.runtime.lastError) {
                showError("Unable to read email content from the page.");
                return;
            }

            if (!response) {
                showError("No email detected. Open an email first.");
                return;
            }

            try {
                const fullText = response?.text || `${response?.subject || ""}\n\n${response?.body || ""}`;
                // Call backend API
                const apiResponse = await fetch(`${BACKEND_BASE_URL}/analyze`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: fullText,
                        source: "extension"
                    })
                });

                if (!apiResponse.ok) {
                    showError("Backend error.");
                    return;
                }

                const data = await apiResponse.json();

                renderResult(data);

                if ((data.explanation_status === "pending" || !data.llm_explanation) && data.threat_id) {
                    pollExplanationForPopup(data.threat_id);
                }

                // Inject result into Gmail UI
                chrome.tabs.sendMessage(tab.id, {
                    action: "injectResult",
                    data: data
                });

            } catch (apiError) {
                console.error("API Error:", apiError);
                showError("Cannot connect to backend.");
            }
        });

    } catch (err) {
        console.error("Extension Error:", err);
        showError("Unexpected extension error.");
    }
});


// ===============================
// Render Popup UI Result
// ===============================

function renderResult(data) {

    const riskClass = (data.risk_level || "Low").toLowerCase();
    const confidence = Number(data.confidence_score || 0).toFixed(2);
    const trust = Number(data.trust_score || 0).toFixed(2);

    let breakdownHTML = `
        <div class="breakdown">
            <div>Confidence: ${confidence}%</div>
            <div>Threat ID: ${data.threat_id || "N/A"}</div>
        </div>
    `;

    let explanationHTML = "";

    if (data.anomalies?.length > 0) {
        explanationHTML += `
            <div class="why-flagged">
                <strong>Why Flagged:</strong>
                <ul>
                    ${data.anomalies.map(a => `<li>${a}</li>`).join("")}
                </ul>
            </div>
        `;
    }

    document.getElementById("result").innerHTML = `
        <div class="card ${riskClass}">
            <div class="badge">
                ${data.classification} (${confidence}%)
            </div>

            <div class="attack-type">
                🔎 ${data.attack_type || "Unknown Threat Type"}
            </div>

            <div class="risk-meter">
                <div class="risk-label">
                    Risk Level: ${data.risk_level}
                </div>
                <div class="risk-bar">
                    <div class="risk-fill" style="width:${100 - data.trust_score}%"></div>
                </div>
            </div>

            <div class="small">
                Trust Score: ${trust}%
            </div>

            ${breakdownHTML}
            ${explanationHTML}

            <div id="popupExplanation" class="why-flagged" style="margin-top:10px;">
                <strong>AI Explanation:</strong>
                <div id="popupExplanationText">${escapeHtml(data.llm_explanation || "Generating AI explanation...")}</div>
            </div>
        </div>
    `;
}

async function pollExplanationForPopup(threatId) {
    const maxAttempts = 10;
    const intervalMs = 2000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/analysis/${encodeURIComponent(threatId)}`);
            if (!response.ok) {
                continue;
            }

            const payload = await response.json();
            if (payload.explanation_status === "ready" && payload.llm_explanation) {
                const explanationText = document.getElementById("popupExplanationText");
                if (explanationText) {
                    explanationText.textContent = payload.llm_explanation;
                }
                return;
            }
        } catch (error) {
            console.error("Popup explanation polling failed:", error);
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ===============================
// Show Error Helper
// ===============================

function showError(message) {
    document.getElementById("result").innerHTML = `
        <div class="card critical">
            ${message}
        </div>
    `;
}