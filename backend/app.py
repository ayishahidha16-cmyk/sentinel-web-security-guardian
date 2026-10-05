from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(os.path.dirname(__file__), "sentinel.db")


# ==============================
# DATABASE INITIALIZATION
# ==============================

def init_db():
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    cursor.execute("SELECT COUNT(*) FROM incidents")
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
# STARTUP
# ==============================

init_db()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )