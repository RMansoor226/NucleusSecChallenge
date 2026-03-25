# fixed_app.py
import os
import json
import sqlite3
import hashlib
import hmac
from flask import Flask, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)

# Payload size limit
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024  # 10 KB

# Rate limiting
limiter = Limiter(get_remote_address, app=app)

DB_PATH = os.getenv("DB_PATH", "/tmp/app.db")
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "dev-secret")  # default for dev

# Fixed signature verification method
def verify(sig, body: bytes) -> bool:
    expected = hashlib.sha256(WEBHOOK_SECRET.encode("utf-8") + body).hexdigest()
    return hmac.compare_digest(expected, sig)


# Fixed db getter via context manager for DB connections
def get_db():
    return sqlite3.connect(DB_PATH)

# Implement rate limiting
@limiter.limit("5 per second")
@app.post("/webhook")
def webhook():
    raw = request.data  # bytes
    sig = request.headers.get("X-Signature", "")

    # Signature verification
    if not verify(sig, raw):
        return ("bad sig", 401)

    # Input validation
    try:
        payload = request.get_json(force=True)
    except Exception:
        return ("invalid json", 400)

    email = payload.get("email")
    role = payload.get("role", "user")

    # Validate email
    if not isinstance(email, str) or "@" not in email:
        return ("invalid email", 400)

    # Validate user role
    if role not in {"user", "admin"}:
        return ("invalid role", 400)

    # Context manager to ensure DB closes properly
    with sqlite3.connect(DB_PATH) as db:
        cur = db.cursor()

        # Parameterized queries replacing previous queries
        cur.execute(
            "INSERT INTO webhook_audit(email, raw_json) VALUES (?, ?)",
            (email, raw.decode("utf-8"))
        )

        # Proper upsertion logic
        cur.execute("""
            INSERT INTO users(email, role)
            VALUES (?, ?)
            ON CONFLICT(email) DO UPDATE SET role = excluded.role
        """, (email, role))

        db.commit()

    return ("ok", 200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
