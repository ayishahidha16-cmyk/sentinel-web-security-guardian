from flask import Flask, jsonify, request
from flask_cors import CORS

import sqlite3
import os
import requests
import time

from urllib.parse import urlparse


app = Flask(__name__)

CORS(app)

DATABASE = os.path.join(
    os.path.dirname(__file__),
    "sentinel.db"
)


# ==============================
# DATABASE INITIALIZATION
# ==============================

def init_db():

    connection = sqlite3.connect(DATABASE)

    cursor = connection.cursor()

    # Incidents table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            type TEXT NOT NULL,

            severity TEXT NOT NULL,

            description TEXT NOT NULL,

            status TEXT NOT NULL
        )
    """)

    # Scan history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scan_history (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            website_url TEXT NOT NULL,

            security_score INTEGER NOT NULL,

            status_code INTEGER NOT NULL,

            response_time REAL NOT NULL,

            scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Add sample incidents if table is empty
    cursor.execute(
        "SELECT COUNT(*) FROM incidents"
    )

    count = cursor.fetchone()[0]

    if count == 0:

        sample_incidents = [

            (
                "Traffic Spike",
                "High",
                "Unusual increase in incoming requests detected",
                "Open"
            ),

            (
                "Security Headers",
                "Medium",
                "Some recommended security headers are missing",
                "Review"
            ),

            (
                "CORS Policy",
                "Low",
                "CORS configuration requires review",
                "Review"
            )
        ]

        cursor.executemany("""
            INSERT INTO incidents
            (type, severity, description, status)

            VALUES (?, ?, ?, ?)
        """, sample_incidents)

    connection.commit()

    connection.close()


# ==============================
# HOME / HEALTH CHECK
# ==============================

@app.route("/")
def home():

    return jsonify({

        "system": "Sentinel",

        "message": "Sentinel Backend is running!",

        "status": "online"
    })


# ==============================
# DASHBOARD STATUS API
# ==============================

@app.route("/api/status")
def status():

    return jsonify({

        "system": "Sentinel",

        "status": "online",

        "security_score": 92,

        "performance_score": 87,

        "threats": 3,

        "requests": 14200
    })

# ==============================
# SCAN HISTORY API
# ==============================

@app.route("/api/scan-history")
def scan_history():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM scan_history
        ORDER BY id DESC
    """)

    history_data = cursor.fetchall()

    connection.close()

    return jsonify([
        dict(scan)
        for scan in history_data
    ])
# ==============================
# INCIDENTS API
# ==============================

@app.route("/api/incidents")
def incidents():

    connection = sqlite3.connect(DATABASE)

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM incidents
        ORDER BY id DESC
    """)

    incidents_data = cursor.fetchall()

    connection.close()

    return jsonify([
        dict(incident)
        for incident in incidents_data
    ])


# ==============================
# WEBSITE SECURITY SCANNER API
# ==============================

@app.route("/api/scan", methods=["POST"])
def scan_website():

    data = request.get_json()

    if not data or "url" not in data:

        return jsonify({
            "error": "Website URL is required"
        }), 400

    url = data["url"].strip()

    # Add HTTPS automatically if missing
    if not url.startswith(("http://", "https://")):

        url = "https://" + url

    try:

        parsed_url = urlparse(url)

        if not parsed_url.netloc:

            return jsonify({
                "error": "Invalid website URL"
            }), 400

        # ==============================
        # MEASURE RESPONSE TIME
        # ==============================

        start_time = time.time()

        response = requests.get(

            url,

            timeout=10,

            allow_redirects=True,

            headers={
                "User-Agent":
                    "Sentinel-Web-Security-Scanner/1.0"
            }
        )

        response_time = round(

            (time.time() - start_time) * 1000,

            2
        )

        headers = response.headers

        # ==============================
        # CORS CHECK
        # ==============================

        cors_header = headers.get(
            "Access-Control-Allow-Origin"
        )

        cors_status = (
            "Configured"
            if cors_header
            else "Not Configured"
        )

        # ==============================
        # SECURITY CHECKS
        # ==============================

        https_secure = response.url.startswith(
            "https://"
        )

        security_headers = {

            "Strict-Transport-Security":
                "Strict-Transport-Security" in headers,

            "Content-Security-Policy":
                "Content-Security-Policy" in headers,

            "X-Content-Type-Options":
                "X-Content-Type-Options" in headers,

            "X-Frame-Options":
                "X-Frame-Options" in headers
        }

        secure_headers_count = sum(
            security_headers.values()
        )

        # ==============================
        # COOKIE SECURITY
        # ==============================

        cookies_secure = True

        set_cookie = headers.get(
            "Set-Cookie",
            ""
        )

        if set_cookie:

            cookies_secure = (
                "Secure" in set_cookie
                and
                "HttpOnly" in set_cookie
            )

        # ==============================
        # SECURITY SCORE
        # ==============================

        score = 0

        # HTTPS
        if https_secure:

            score += 25

        # HTTP status
        if 200 <= response.status_code < 400:

            score += 20

        # Security headers
        score += secure_headers_count * 8

        # Cookies
        if cookies_secure:

            score += 15

        # Response time
        if response_time < 1000:

            score += 8

        elif response_time < 2000:

            score += 4

        score = min(score, 100)

        # ==============================
        # SAVE SCAN HISTORY
        # ==============================

        connection = sqlite3.connect(DATABASE)

        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO scan_history
            (
                website_url,
                security_score,
                status_code,
                response_time
            )

            VALUES (?, ?, ?, ?)
        """, (

            response.url,

            score,

            response.status_code,

            response_time
        ))

        connection.commit()

        connection.close()

        # ==============================
        # RETURN SCAN RESULT
        # ==============================

        return jsonify({

            "url": response.url,

            "status_code":
                response.status_code,

            "response_time_ms":
                response_time,

            "https": {

                "secure":
                    https_secure
            },

            "security_headers":
                security_headers,

            "cookies": {

                "secure":
                    cookies_secure
            },

            "cors": {

                "configured":
                    cors_header is not None,

                "status":
                    cors_status,

                "value":
                    cors_header
            },

            "security_score":
                score,

            "message":
                "Website scan completed successfully"
        })

    except requests.exceptions.Timeout:

        return jsonify({

            "error":
                "Website took too long to respond"

        }), 408

    except requests.exceptions.RequestException as error:

        return jsonify({

            "error":
                f"Unable to scan website: {str(error)}"

        }), 500


# ==============================
# UPTIME MONITOR API
# ==============================

@app.route("/api/uptime", methods=["POST"])
def uptime_check():

    data = request.get_json()

    if not data or "url" not in data:

        return jsonify({

            "error":
                "Website URL is required"

        }), 400

    url = data["url"].strip()

    if not url.startswith(
        ("http://", "https://")
    ):

        url = "https://" + url

    try:

        parsed_url = urlparse(url)

        if not parsed_url.netloc:

            return jsonify({

                "error":
                    "Invalid website URL"

            }), 400

        start_time = time.time()

        response = requests.get(

            url,

            timeout=10,

            allow_redirects=True,

            headers={

                "User-Agent":
                    "Sentinel-Uptime-Monitor/1.0"
            }
        )

        response_time = round(

            (time.time() - start_time) * 1000,

            2
        )

        is_up = (
            200 <= response.status_code < 400
        )

        return jsonify({

            "url":
                response.url,

            "status":
                "UP" if is_up else "DOWN",

            "status_code":
                response.status_code,

            "response_time_ms":
                response_time,

            "message":
                "Uptime check completed successfully"
        })

    except requests.exceptions.Timeout:

        return jsonify({

            "status":
                "DOWN",

            "error":
                "Website took too long to respond"

        }), 408

    except requests.exceptions.RequestException as error:

        return jsonify({

            "status":
                "DOWN",

            "error":
                f"Unable to reach website: {str(error)}"

        }), 500


# ==============================
# STARTUP
# ==============================

init_db()


if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=int(
            os.environ.get("PORT", 5000)
        ),

        debug=False
    )