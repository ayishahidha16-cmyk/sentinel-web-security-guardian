// =====================================
// SENTINEL | WEB SECURITY GUARDIAN
// MAIN JAVASCRIPT
// =====================================


// =====================================
// LIVE BACKEND URL
// =====================================

const API_BASE_URL = "http://127.0.0.1:5000";

// =====================================
// DASHBOARD ELEMENTS
// =====================================

const simulateBtn =
    document.getElementById("simulateBtn");

const alertsContainer =
    document.getElementById("alerts");


// =====================================
// DASHBOARD CARDS
// =====================================

function findCard(title) {

    const cards =
        document.querySelectorAll(".card");

    for (const card of cards) {

        const cardTitle =
            card.querySelector(".card-title");

        if (
            cardTitle &&
            cardTitle.textContent.includes(title)
        ) {
            return card;
        }
    }

    return null;
}


const securityCard =
    findCard("Security Score");

const performanceCard =
    findCard("Performance");

const requestsCard =
    findCard("Requests");

const threatsCard =
    findCard("Threats");


const securityScore =
    securityCard?.querySelector(".score");

const performanceScore =
    performanceCard?.querySelector(".score");

const requestsScore =
    requestsCard?.querySelector(".score");

const threatsScore =
    threatsCard?.querySelector(".score");


// =====================================
// REAL-TIME TRAFFIC GRAPH
// =====================================

const trafficLine =
    document.getElementById("trafficLine");

let trafficPoints = [

    [0, 150],
    [70, 145],
    [140, 152],
    [210, 140],
    [280, 148],
    [350, 135],
    [420, 142],
    [490, 130],
    [560, 138],
    [630, 125],
    [700, 132]

];


function updateTrafficGraph() {

    if (!trafficLine) return;

    trafficPoints.shift();

    const lastPoint =
        trafficPoints[
            trafficPoints.length - 1
        ];

    const newX = 700;

    let newY =
        lastPoint[1] +
        (Math.random() * 30 - 15);

    newY = Math.max(
        60,
        Math.min(180, newY)
    );

    trafficPoints.push([
        newX,
        newY
    ]);


    const pointsString =
        trafficPoints
            .map(
                point =>
                    `${point[0]},${point[1]}`
            )
            .join(" ");


    trafficLine.setAttribute(
        "points",
        pointsString
    );
}


setInterval(
    updateTrafficGraph,
    1000
);


// =====================================
// TRAFFIC SPIKE SIMULATION
// =====================================

if (simulateBtn) {

    simulateBtn.addEventListener(
        "click",
        function () {

            simulateBtn.textContent =
                "⏳ Detecting...";

            simulateBtn.disabled =
                true;


            setTimeout(() => {


                // SECURITY SCORE

                if (securityScore) {

                    securityScore.innerHTML = `
                        86<span>/100</span>
                    `;
                }


                // PERFORMANCE

                if (performanceScore) {

                    performanceScore.innerHTML = `
                        72<span>/100</span>
                    `;
                }


                // REQUESTS

                if (requestsScore) {

                    requestsScore.innerHTML = `
                        18.7K
                    `;
                }


                // THREATS

                if (threatsScore) {

                    threatsScore.innerHTML = `
                        04
                    `;
                }


                // CREATE ALERT

                if (alertsContainer) {

                    const newAlert =
                        document.createElement(
                            "div"
                        );

                    newAlert.className =
                        "alert";


                    newAlert.innerHTML = `
                        <span class="alert-icon red">
                            !
                        </span>

                        <div>

                            <strong>
                                Traffic Anomaly Detected
                            </strong>

                            <p>
                                Unusual traffic spike detected by Sentinel.
                            </p>

                        </div>

                        <small>
                            Just now
                        </small>
                    `;


                    alertsContainer.prepend(
                        newAlert
                    );
                }


                // TRAFFIC SPIKE GRAPH

                if (trafficLine) {

                    trafficPoints = [

                        [0, 150],
                        [70, 145],
                        [140, 152],
                        [210, 140],
                        [280, 120],
                        [350, 90],
                        [420, 65],
                        [490, 85],
                        [560, 70],
                        [630, 55],
                        [700, 45]

                    ];


                    trafficLine.setAttribute(
                        "points",
                        trafficPoints
                            .map(
                                point =>
                                    `${point[0]},${point[1]}`
                            )
                            .join(" ")
                    );
                }


                // BUTTON

                simulateBtn.textContent =
                    "🚨 Traffic Spike Detected";

                simulateBtn.disabled =
                    false;


            }, 1000);

        }
    );
}


// =====================================
// SIDEBAR NAVIGATION
// =====================================

const navItems =
    document.querySelectorAll(
        ".sidebar nav a"
    );


const mainContent =
    document.querySelector(
        ".main-content"
    );


// Save dashboard content

const dashboardContent =
    Array.from(
        mainContent.children
    );


// =====================================
// NAVIGATION CLICK
// =====================================

navItems.forEach(item => {

    item.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            // Active menu

            navItems.forEach(nav => {

                nav.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            const page =
                this.textContent.trim();


            // =================================
            // DASHBOARD
            // =================================

            if (
                page.includes("Dashboard")
            ) {

                mainContent.innerHTML = "";


                dashboardContent.forEach(
                    element => {

                        element.style.display =
                            "";

                        mainContent.appendChild(
                            element
                        );

                    }
                );


                // Reload backend dashboard data

                loadBackendData();

                return;
            }


            // =================================
            // HIDE DASHBOARD
            // =================================

            dashboardContent.forEach(
                element => {

                    element.style.display =
                        "none";

                }
            );


            // Remove previous page

            const oldPage =
                document.getElementById(
                    "dynamicPage"
                );


            if (oldPage) {

                oldPage.remove();

            }


            // Create new page

            const newPage =
                document.createElement(
                    "div"
                );


            newPage.id =
                "dynamicPage";


            // =================================
            // SECURITY PAGE
            // =================================

            if (
                page.includes("Security")
            ) {

                newPage.innerHTML = `

                    <header class="topbar">

                        <div>

                            <h1>
                               Website Security
                            </h1>

                            <p>
                                Monitor your website security, headers and protection status.
                            </p>

                        </div>


                        <div class="live-status">

                            <span class="live-dot"></span>

                            PROTECTED

                        </div>

                    </header>


                    <section class="stats">


                        <div class="card">

                            <div class="card-title">
                                🛡️ Security Score
                            </div>

                            <div class="score">
                                92<span>/100</span>
                            </div>

                            <p class="good">
                                ● Excellent
                            </p>

                        </div>


                        <div class="card">

                            <div class="card-title">
                                🔒 HTTPS
                            </div>

                            <div class="score">
                                100<span>%</span>
                            </div>

                            <p class="good">
                                ● Secure
                            </p>

                        </div>


                        <div class="card">

                            <div class="card-title">
                                🍪 Cookies
                            </div>

                            <div class="score">
                                98<span>%</span>
                            </div>

                            <p class="good">
                                ● Secure
                            </p>

                        </div>


                        <div class="card">

                            <div class="card-title">
                                ⚠️ Issues
                            </div>

                            <div class="score" id="issuesCount">
                                 02
                            </div>

                            <p class="warning">
                                ● Review
                            </p>

                        </div>


                    </section>


                    <section class="panel security-scan-panel">


                        <div class="panel-header">

                            <div>

                                <h2>
                                    Security Checks
                                </h2>

                                <p>
                                    Latest security analysis
                                </p>

                            </div>


                            <button
                                class="scan-btn security-page-scan"
                            >
                                🔍 Run Scan
                            </button>

                        </div>


                        <div class="security-item">

                            <span>
                                HTTPS Encryption
                            </span>

                            <strong
                                class="safe scan-https"
                            >
                                ✓ Secure
                            </strong>

                        </div>


                        <div class="security-item">

                            <span>
                                Security Headers
                            </span>

                            <strong
                                class="warning-text scan-headers"
                            >
                                ⚠ Review
                            </strong>

                        </div>


                        <div class="security-item">

                            <span>
                                Cookie Protection
                            </span>

                            <strong
                                class="safe scan-cookies"
                            >
                                ✓ Secure
                            </strong>

                        </div>


                        <div class="security-item">

                            <span>
                                CORS Policy
                            </span>

                            <strong
                                class="warning-text scan-cors"
                            >
                                ⚠ Review
                            </strong>

                        </div>


                        <div class="scan-result">
                            Ready to scan
                        </div>


                    </section>

                `;
            }


            // =================================
            // PERFORMANCE PAGE
            // =================================

            else if (
                page.includes("Performance")
            ) {

                newPage.innerHTML = `

                    <header class="topbar">

                        <div>

                            <h1>
                                 Website Performance
                            </h1>

                            <p>
                               Monitor your website speed, response time and availability. 
                            </p>

                        </div>

                    </header>


                    <section class="stats">


                        <div class="card">

                            <div class="card-title">
                                ⚡ Performance Score
                            </div>

                            <div class="score">
                                87<span>/100</span>
                            </div>

                            <p class="good">
                                ● Good
                            </p>

                        </div>


                        <div class="card">

                            <div class="card-title">
                                🚀 Response Time
                            </div>

                            <div class="score">
                                142<span>ms</span>
                            </div>

                            <p class="good">
                                ● Normal
                            </p>

                        </div>


                        <div class="card">

                            <div class="card-title">
                                🌐 Requests
                            </div>

                            <div class="score">
                                14.2K
                            </div>

                            <p>
                                Today
                            </p>

                        </div>


                        <div class="card">

                            <div class="card-title">
                                ⚠️ Slow Requests
                            </div>

                            <div class="score">
                                12
                            </div>

                            <p class="warning">
                                ● Attention
                            </p>

                        </div>

                    <!-- =================================
                         UPTIME MONITOR
                         ================================= -->

                    <section class="panel uptime-panel">

                        <div class="panel-header">

                            <div>

                                <h2>
                                    🌐 Uptime Monitor
                                </h2>

                                <p>
                                    Track website availability, response time and service health.
                                </p>

                            </div>

                        </div>


                        <div
                            style="
                                display: flex;
                                gap: 10px;
                                flex-wrap: wrap;
                                margin-top: 18px;
                            "
                        >

                            <input
                                type="text"
                                id="uptimeUrl"
                                placeholder="https://example.com"
                                style="
                                    flex: 1;
                                    min-width: 220px;
                                    padding: 11px 13px;
                                    border-radius: 8px;
                                    border: 1px solid rgba(255,255,255,0.12);
                                    background: #0d1624;
                                    color: #ffffff;
                                    outline: none;
                                "
                            >

                            <button
                                class="scan-btn"
                                id="uptimeCheckBtn"
                                type="button"
                            >
                                🔍 Check Uptime
                            </button>

                        </div>


                        <div
                            class="uptime-result"
                            id="uptimeResult"
                            style="
                                margin-top: 18px;
                                padding: 14px;
                                border-radius: 8px;
                                background: rgba(54,211,153,0.08);
                                border: 1px solid rgba(54,211,153,0.20);
                                color: #36d399;
                                font-size: 13px;
                            "
                        >
                            Enter a website URL and check its uptime.
                        </div>

                    </section>
                    </section>

                `;
            }
                     

            // =================================
// INCIDENTS PAGE
// =================================

else if (
    page.includes("Incidents")
) {

    newPage.innerHTML = `

        <header class="topbar">

            <div>

                <h1>
                    Incidents
                </h1>

                <p>
                    Track security incidents detected by Sentinel.
                </p>

            </div>

        </header>


        <section class="panel">

            <div class="panel-header">

                <div>

                    <h2>
                        Active Incidents
                    </h2>

                    <p>
                        Recent security events
                    </p>

                </div>

                <span class="badge">
                    INCIDENTS
                </span>

            </div>


            <div
                class="incidents-list"
                id="incidentsList"
            >

                <p>
                    Loading incidents...
                </p>

            </div>


        </section>

    `;

    loadIncidents();
}


            // =================================
            // SETTINGS PAGE
            // =================================

            else if (
                page.includes("Settings")
            ) {

                newPage.innerHTML = `

                    <header class="topbar">

                        <div>

                            <h1>
                                Settings
                            </h1>

                            <p>
                                Configure your Sentinel security monitoring.
                            </p>

                        </div>

                    </header>


                    <section class="panel">


                        <div class="panel-header">

                            <div>

                                <h2>
                                    System Settings
                                </h2>

                                <p>
                                    Security monitoring configuration
                                </p>

                            </div>

                        </div>


                        <div class="security-item">

                            <span>
                                Real-time Monitoring
                            </span>

                            <strong class="safe">
                                ✓ Enabled
                            </strong>

                        </div>


                        <div class="security-item">

                            <span>
                                Threat Detection
                            </span>

                            <strong class="safe">
                                ✓ Enabled
                            </strong>

                        </div>


                        <div class="security-item">

                            <span>
                                Alert Notifications
                            </span>

                            <strong class="safe">
                                ✓ Enabled
                            </strong>

                        </div>


                    </section>

                `;
            }


            // =================================
            // ADD PAGE TO SCREEN
            // =================================

            mainContent.appendChild(
                newPage
            );


            // =================================
            // LOAD INCIDENTS AFTER PAGE EXISTS
            // =================================

            if (
                page.includes("Incidents")
            ) {

                loadIncidents();

            }

        }
    );

});


// =====================================
// REAL WEBSITE SECURITY SCAN
// =====================================

async function startSecurityScan(panel, button) {

    if (!panel || !button) {
        return;
    }

    const scanResult =
        panel.querySelector(".scan-result");

    const httpsStatus =
        panel.querySelector(".scan-https");

    const headersStatus =
        panel.querySelector(".scan-headers");

    const cookiesStatus =
        panel.querySelector(".scan-cookies");

    const corsStatus =
        panel.querySelector(".scan-cors");


    // =================================
    // ASK FOR WEBSITE URL
    // =================================

    let websiteUrl = prompt(
        "Enter the website URL to scan:",
        "https://example.com"
    );

    if (!websiteUrl) {
        return;
    }


    // =================================
    // START SCAN
    // =================================

    button.textContent = "⏳ Scanning...";
    button.disabled = true;

    if (scanResult) {
        scanResult.textContent =
            "🔍 Sentinel is scanning the website...";
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/scan`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    url: websiteUrl
                })
            }
        );


        const data = await response.json();


        // =================================
        // ERROR
        // =================================

        if (!response.ok) {

            throw new Error(
                data.error || "Website scan failed"
            );

        }


        // =================================
        // HTTPS RESULT
        // =================================

        if (httpsStatus) {

            if (data.https.secure) {

                httpsStatus.textContent =
                    "✓ Secure";

                httpsStatus.className =
                    "safe";

            } else {

                httpsStatus.textContent =
                    "⚠ Not Secure";

                httpsStatus.className =
                    "warning-text";

            }

        }


        // =================================
        // SECURITY HEADERS
        // =================================

        if (headersStatus) {

            const headers =
                data.security_headers;

            const secureCount =
                Object.values(headers)
                    .filter(Boolean)
                    .length;

            const totalHeaders =
                Object.keys(headers).length;


            if (secureCount === totalHeaders) {

                headersStatus.textContent =
                    "✓ All Secure";

                headersStatus.className =
                    "safe";

            } else {

                headersStatus.textContent =
                    `⚠ ${secureCount}/${totalHeaders} Secure`;

                headersStatus.className =
                    "warning-text";

            }

        }


        // =================================
        // COOKIE RESULT
        // =================================

        if (cookiesStatus) {

            if (data.cookies.secure) {

                cookiesStatus.textContent =
                    "✓ Secure";

                cookiesStatus.className =
                    "safe";

            } else {

                cookiesStatus.textContent =
                    "⚠ Review";

                cookiesStatus.className =
                    "warning-text";

            }

        }


 // =================================
// CORS
// =================================

if (corsStatus) {

    if (data.cors && data.cors.configured) {

        corsStatus.textContent =
            "✓ Configured";

        corsStatus.className =
            "good-text";

    } else {

        corsStatus.textContent =
            "⚠ Not Configured";

        corsStatus.className =
            "warning-text";

    }

}      


// =================================
// UPDATE SECURITY PAGE SCORE
// =================================
const securityScores =
    document.querySelectorAll(".score");

const currentSecurityScore =
    securityScores[4];

if (currentSecurityScore) {
    currentSecurityScore.innerHTML =
        `${data.security_score}<span>/100</span>`;
}
// =================================
// FINAL RESULT
// =================================

if (scanResult) {

    scanResult.innerHTML = `
        ✓ Scan completed<br>
        Security Score:
        <strong>
            ${data.security_score}/100
        </strong>
        <br>
        HTTP Status:
        ${data.status_code}
        <br>
        Response Time:
        ${data.response_time_ms} ms
    `;

}
        // =================================
// UPDATE ISSUES COUNT
// =================================

const headerIssues = Object.values(
    data.security_headers || {}
).filter(value => value === false).length;

const corsIssue =
    data.cors && data.cors.configured === false ? 1 : 0;

const totalIssues = headerIssues + corsIssue;

const issuesCount =
    document.getElementById("issuesCount");

if (issuesCount) {
    issuesCount.textContent =
        String(totalIssues).padStart(2, "0");
}
        // =================================
        // CONSOLE RESULT
        // =================================

        console.log(
            "🛡️ Sentinel website scan result:",
            data
        );


        button.textContent =
            "🔄 Run Again";

    }


    catch (error) {

        console.error(
            "❌ Website scan failed:",
            error
        );


        if (scanResult) {

            scanResult.textContent =
                `❌ ${error.message}`;

        }

        button.textContent =
            "🔄 Try Again";

    }


    finally {

        button.disabled = false;

    }

}

// =====================================
// SECURITY SCAN BUTTON HANDLER
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".scan-btn"
            );


        if (!button) {
            return;
        }


        const panel =
            button.closest(
                ".security-scan-panel, .security-status-panel"
            );


        if (!panel) {
            return;
        }


        startSecurityScan(
            panel,
            button
        );

    }
);


// =====================================
// BACKEND API CONNECTION
// =====================================

async function loadBackendData() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/status`
            );


        if (!response.ok) {

            throw new Error(
                "Backend API is not responding"
            );

        }


        const data =
            await response.json();


        // Security Score

        if (securityScore) {

            securityScore.innerHTML =
                `${data.security_score}<span>/100</span>`;

        }


        // Performance Score

        if (performanceScore) {

            performanceScore.innerHTML =
                `${data.performance_score}<span>/100</span>`;

        }


        // Requests

        if (requestsScore) {

            requestsScore.textContent =
                `${(data.requests / 1000).toFixed(1)}K`;

        }


        // Threats

        if (threatsScore) {

            threatsScore.textContent =
                String(
                    data.threats
                ).padStart(
                    2,
                    "0"
                );

        }


        console.log(
            "✅ Sentinel backend data loaded:",
            data
        );


    } catch (error) {

        console.error(
            "❌ Backend connection failed:",
            error
        );

    }

}


// =====================================
// LOAD BACKEND DATA
// =====================================

loadBackendData();


// =====================================
// LOAD INCIDENTS FROM DATABASE
// =====================================

async function loadIncidents() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/incidents`
            );


        if (!response.ok) {

            throw new Error(
                "Incidents API is not responding"
            );

        }


        const incidents =
            await response.json();


        console.log(
            "✅ Incidents loaded from database:",
            incidents
        );


        // Find incidents container

        const incidentsContainer =
            document.querySelector(
                ".incidents-list"
            );


        if (!incidentsContainer) {

            console.log(
                "ℹ️ Incidents page is not open yet."
            );

            return;

        }


        // Clear loading text

        incidentsContainer.innerHTML =
            "";


        // If no incidents

        if (
            incidents.length === 0
        ) {

            incidentsContainer.innerHTML = `
                <p>
                    No incidents found.
                </p>
            `;

            return;

        }


        // Create incident cards

        incidents.forEach(
            incident => {


                const incidentCard =
                    document.createElement(
                        "div"
                    );


                incidentCard.className =
                    "incident-card";


                incidentCard.innerHTML = `

                    <div class="incident-top">

                        <strong>
                            ${incident.type}
                        </strong>


                        <span
                            class="severity ${incident.severity.toLowerCase()}"
                        >
                            ${incident.severity}
                        </span>

                    </div>


                    <p>
                        ${incident.description}
                    </p>


                    <div class="incident-bottom">

                        <span>
                            ID: #${incident.id}
                        </span>


                        <span>
                            Status: ${incident.status}
                        </span>

                    </div>

                `;


                incidentsContainer.appendChild(
                    incidentCard
                );

            }
        );


    } catch (error) {

        console.error(
            "❌ Failed to load incidents:",
            error
        );


        const incidentsContainer =
            document.querySelector(
                ".incidents-list"
            );


        if (incidentsContainer) {

            incidentsContainer.innerHTML = `

                <p>
                    ❌ Unable to load incidents.
                </p>

            `;

        }

    }

}


// =====================================
// SENTINEL READY
// =====================================

console.log(
    "🛡️ Sentinel Web Security Guardian loaded successfully."
);
// =====================================
// UPTIME MONITOR FUNCTION
// =====================================

async function checkUptime() {

    const urlInput =
        document.getElementById("uptimeUrl");

    const checkButton =
        document.getElementById("uptimeCheckBtn");

    const result =
        document.getElementById("uptimeResult");


    if (!urlInput || !checkButton || !result) {
        return;
    }


    let websiteUrl =
        urlInput.value.trim();


    if (!websiteUrl) {

        result.textContent =
            "⚠️ Please enter a website URL.";

        return;
    }


    if (
        !websiteUrl.startsWith("http://") &&
        !websiteUrl.startsWith("https://")
    ) {

        websiteUrl =
            "https://" + websiteUrl;
    }


    checkButton.textContent =
        "⏳ Checking...";

    checkButton.disabled =
        true;


    result.textContent =
        "🔍 Sentinel is checking website availability...";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/uptime`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        url: websiteUrl
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Uptime check failed"
            );
        }


        if (data.status === "UP") {

            result.innerHTML = `
                <strong style="font-size:16px;">
                    🟢 WEBSITE UP
                </strong>

                <br><br>

                URL: ${data.url}

                <br>

                HTTP Status:
                ${data.status_code}

                <br>

                Response Time:
                ${data.response_time_ms} ms
            `;

            result.style.color =
                "#36d399";

        } else {

            result.innerHTML = `
                <strong style="font-size:16px;">
                    🔴 WEBSITE DOWN
                </strong>

                <br><br>

                ${data.error ||
                "Website is not responding."}
            `;

            result.style.color =
                "#ff5c5c";
        }


    } catch (error) {

        console.error(
            "❌ Uptime check failed:",
            error
        );


        result.innerHTML = `
            <strong>
                🔴 WEBSITE DOWN
            </strong>

            <br><br>

            ${error.message}
        `;

        result.style.color =
            "#ff5c5c";


    } finally {

        checkButton.textContent =
            "🔍 Check Uptime";

        checkButton.disabled =
            false;
    }
}


// =====================================
// UPTIME BUTTON CLICK
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#uptimeCheckBtn"
            );

        if (!button) {
            return;
        }

        checkUptime();
    }
);
// =====================================
// WEBSITE ANALYZER
// =====================================

async function analyzeWebsite() {

    const urlInput =
        document.getElementById("websiteUrl");

    const analyzeButton =
        document.getElementById("analyzeWebsiteBtn");

    const result =
        document.getElementById("websiteAnalyzerResult");

    if (!urlInput || !analyzeButton || !result) {
        return;
    }

    let websiteUrl =
        urlInput.value.trim();

    if (!websiteUrl) {

        result.textContent =
            "⚠️ Please enter a website URL.";

        return;
    }

    if (
        !websiteUrl.startsWith("http://") &&
        !websiteUrl.startsWith("https://")
    ) {
        websiteUrl =
            "https://" + websiteUrl;
    }

    analyzeButton.textContent =
        "⏳ Analyzing...";

    analyzeButton.disabled =
        true;

    result.innerHTML =
        "🔍 Sentinel is analyzing the website...";

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/scan`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        url: websiteUrl
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Website analysis failed"
            );
        }

        result.innerHTML = `
    <div style="text-align:center;">

        <div style="
            font-size:12px;
            color:#8fa3bf;
            margin-bottom:8px;
        ">
            WEBSITE HEALTH
        </div>

        <div style="
            font-size:42px;
            font-weight:700;
            color:${
                data.security_score >= 80
                    ? "#36d399"
                    : data.security_score >= 60
                    ? "#f5b942"
                    : "#ff5c5c"
            };
        ">
            ${data.security_score}
            <span style="font-size:18px;color:#71839d;">
                /100
            </span>
        </div>

        <div style="
            margin-top:5px;
            color:${
                data.security_score >= 80
                    ? "#36d399"
                    : data.security_score >= 60
                    ? "#f5b942"
                    : "#ff5c5c"
            };
        ">
            ${
                data.security_score >= 80
                    ? "Excellent"
                    : data.security_score >= 60
                    ? "Needs Attention"
                    : "Critical"
            }
        </div>

        <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-top:18px;
            text-align:left;
        ">

            <div style="
                padding:12px;
                border-radius:8px;
                background:rgba(255,255,255,0.03);
            ">
                <small>HTTP STATUS</small><br>
                <strong style="color:#36d399;">
                    ${data.status_code}
                </strong>
            </div>

            <div style="
                padding:12px;
                border-radius:8px;
                background:rgba(255,255,255,0.03);
            ">
                <small>RESPONSE TIME</small><br>
                <strong>
                    ${data.response_time_ms} ms
                </strong>
            </div>

            <div style="
                padding:12px;
                border-radius:8px;
                background:rgba(255,255,255,0.03);
            ">
                <small>HTTPS</small><br>
                <strong style="
                    color:${data.https.secure ? "#36d399" : "#ff5c5c"};
                ">
                    ${data.https.secure ? "✓ Secure" : "⚠ Not Secure"}
                </strong>
            </div>

            <div style="
                padding:12px;
                border-radius:8px;
                background:rgba(255,255,255,0.03);
            ">
                <small>CORS</small><br>
                <strong style="
                    color:${
                        data.cors && data.cors.configured
                            ? "#36d399"
                            : "#f5b942"
                    };
                ">
                    ${
                        data.cors && data.cors.configured
                            ? "✓ Configured"
                            : "⚠ Review"
                    }
                </strong>
            </div>

        </div>

    </div>
`;

        result.style.color =
            "#36d399";

    } catch (error) {

        console.error(
            "❌ Website analysis failed:",
            error
        );

        result.innerHTML = `
            <strong>
                ❌ Analysis Failed
            </strong>

            <br><br>

            ${error.message}
        `;

        result.style.color =
            "#ff5c5c";

    } finally {

        analyzeButton.textContent =
            "🔍 Analyze Website";

        analyzeButton.disabled =
            false;
    }
}


// =====================================
// WEBSITE ANALYZER BUTTON CLICK
// =====================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "#analyzeWebsiteBtn"
            );

        if (!button) {
            return;
        }

        analyzeWebsite();
    }
);
// =====================================
// LOAD SCAN HISTORY
// =====================================

async function loadScanHistory() {

    const container =
        document.getElementById("scanHistoryContainer");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/scan-history`
        );

        const history = await response.json();

        if (!response.ok) {
            throw new Error(
                "Failed to load scan history"
            );
        }

        if (history.length === 0) {

            container.innerHTML = `
                <div class="scan-history-loading">
                    No scans found yet.
                </div>
            `;

            return;
        }

        container.innerHTML = history.map(
            function (scan) {

                return `
                    <div class="scan-history-item">

                        <div>
                            <strong>
                                🌐 ${scan.website_url}
                            </strong>

                            <small>
                                ${scan.scanned_at}
                            </small>
                        </div>

                        <div>
                            <span>
                                ${scan.status_code}
                            </span>

                            <span>
                                ${scan.response_time} ms
                            </span>

                            <strong>
                                ${scan.security_score}/100
                            </strong>
                        </div>

                    </div>
                `;
            }
        ).join("");

    } catch (error) {

        console.error(
            "❌ Scan history failed:",
            error
        );

        container.innerHTML = `
            <div class="scan-history-loading">
                ❌ Unable to load scan history.
            </div>
        `;
    }
}


// =====================================
// LOAD SCAN HISTORY WHEN PAGE LOADS
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {
        loadScanHistory();
    }
);