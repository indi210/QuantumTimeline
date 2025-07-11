import os
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import hashlib
import json
import time

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "quantum-interface-secret-key")

# Hidden root access logic
ROOT_EMAIL = "ervin210@icloud.com"
HIDDEN_ROOT_KEY = hashlib.sha256(ROOT_EMAIL.encode()).hexdigest()

# QuantumWatch Class - Enhanced version
class QuantumWatch:
    def __init__(self, user="Ervin Remus Radosavlevici"):
        self.owner = user
        self.status = "Idle"
        self.timestamp = time.time()
        self.actions_log = []
        self.activation_count = 0
        self.build_count = 0
        self.signature_count = 0

    def activate_interface(self):
        self.status = "Activated"
        self.activation_count += 1
        self.log_action("Quantum Interface Activated")

    def build_completed(self):
        self.status = "Build Completed"
        self.build_count += 1
        self.log_action("Build Status: Completed")

    def generate_signature(self):
        data = json.dumps({
            "owner": self.owner,
            "status": self.status,
            "timestamp": self.timestamp
        }, sort_keys=True).encode()
        self.signature_count += 1
        self.log_action("Digital Signature Generated")
        return hashlib.sha256(data).hexdigest()

    def log_action(self, action):
        timestamped = f"{datetime.utcnow().isoformat()}Z: {action}"
        self.actions_log.append(timestamped)

    def reset_interface(self):
        self.status = "Idle"
        self.actions_log = []
        self.activation_count = 0
        self.build_count = 0
        self.signature_count = 0
        self.log_action("Quantum Interface Reset")

    def get_status_data(self):
        return {
            "status": self.status,
            "activation_count": self.activation_count,
            "build_count": self.build_count,
            "signature_count": self.signature_count,
            "total_actions": len(self.actions_log),
            "logs": self.actions_log
        }

# Initialize the quantum watch
watch = QuantumWatch()

# Web Routes
@app.route("/")
def index():
    return render_template("index.html", watch=watch)

# API Routes for AJAX requests
@app.route("/api/activate", methods=["POST"])
def api_activate():
    try:
        watch.activate_interface()
        return jsonify({
            "success": True,
            "message": "Quantum Interface Activated Successfully",
            "status": watch.status,
            "activation_count": watch.activation_count
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Activation failed: {str(e)}"
        }), 500

@app.route("/api/build", methods=["POST"])
def api_build():
    try:
        watch.build_completed()
        return jsonify({
            "success": True,
            "message": "Build Completed Successfully",
            "status": watch.status,
            "build_count": watch.build_count
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Build failed: {str(e)}"
        }), 500

@app.route("/api/signature", methods=["POST"])
def api_signature():
    try:
        signature = watch.generate_signature()
        return jsonify({
            "success": True,
            "message": "Digital Signature Generated",
            "signature": signature,
            "signature_count": watch.signature_count
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Signature generation failed: {str(e)}"
        }), 500

@app.route("/api/logs", methods=["GET"])
def api_logs():
    try:
        return jsonify({
            "success": True,
            "logs": watch.actions_log
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Log retrieval failed: {str(e)}"
        }), 500

@app.route("/api/reset", methods=["POST"])
def api_reset():
    try:
        watch.reset_interface()
        return jsonify({
            "success": True,
            "message": "Quantum Interface Reset",
            "status": watch.status
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Reset failed: {str(e)}"
        }), 500

@app.route("/api/status", methods=["GET"])
def api_status():
    try:
        return jsonify(watch.get_status_data())
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Status retrieval failed: {str(e)}"
        }), 500

@app.route("/root-access", methods=["GET"])
def root_access():
    try:
        return jsonify({
            "success": True,
            "email": ROOT_EMAIL,
            "access_level": "ADMINISTRATOR",
            "root_hash": HIDDEN_ROOT_KEY,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Root access failed: {str(e)}"
        }), 500

# Legacy routes for backward compatibility
@app.route("/activate", methods=["POST"])
def legacy_activate():
    watch.activate_interface()
    return render_template("index.html", watch=watch)

@app.route("/build", methods=["POST"])
def legacy_build():
    watch.build_completed()
    return render_template("index.html", watch=watch)

@app.route("/sign", methods=["POST"])
def legacy_sign():
    signature = watch.generate_signature()
    return render_template("index.html", watch=watch, signature=signature)

@app.route("/root-key", methods=["GET"])
def legacy_root_key():
    return jsonify({"root_hash": HIDDEN_ROOT_KEY})

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)