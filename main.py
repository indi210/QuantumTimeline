import os
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime
import hashlib
import json
import time
import uuid
from models import db, ConnectedDevice, DeviceAction, SystemAlert

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "quantum-interface-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///quantum_devices.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize extensions
db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Create database tables
with app.app_context():
    db.create_all()

# Hidden root access logic
ROOT_EMAIL = "ervin210@icloud.com"
HIDDEN_ROOT_KEY = hashlib.sha256(ROOT_EMAIL.encode()).hexdigest()

# QuantumWatch Class - Advanced Admin Dashboard
class QuantumWatch:
    def __init__(self, user="Ervin Remus Radosavlevici"):
        self.owner = user
        self.status = "Idle"
        self.timestamp = time.time()
        self.actions_log = []
        self.activation_count = 0
        self.build_count = 0
        self.signature_count = 0
        self.quantum_energy = 100
        self.neural_sync = 0
        self.matrix_stability = 85
        self.system_alerts = []
        self.security_level = "Standard"
        self.active_protocols = []
        self.data_streams = []
        self.threat_level = "Green"
        self.uptime = 0
        self.last_sync = time.time()
        
        # Admin Dashboard Features
        self.admin_mode = False
        self.system_performance = 95
        self.network_status = "Online"
        self.cpu_usage = 45
        self.memory_usage = 67
        self.storage_usage = 33
        self.active_users = 1
        self.total_requests = 0
        self.error_count = 0
        self.response_time = 0.125
        self.bandwidth_usage = 0.5
        self.system_temperature = 42
        self.power_consumption = 85
        self.database_connections = 12
        self.cache_hit_rate = 94
        self.service_status = {
            "Authentication": "Active",
            "Database": "Active", 
            "Cache": "Active",
            "API Gateway": "Active",
            "File Storage": "Active",
            "Monitoring": "Active"
        }
        self.user_sessions = []
        self.system_modules = [
            {"name": "Core Engine", "status": "Running", "version": "v2.1.4"},
            {"name": "Neural Networks", "status": "Running", "version": "v1.8.2"},
            {"name": "Quantum Processor", "status": "Running", "version": "v3.0.1"},
            {"name": "Security Matrix", "status": "Running", "version": "v2.5.3"},
            {"name": "Data Analytics", "status": "Running", "version": "v1.9.7"},
            {"name": "Communication Hub", "status": "Running", "version": "v2.3.1"}
        ]
        self.connected_devices = []
        self.device_sync_enabled = True

    def activate_interface(self):
        self.status = "Activated"
        self.activation_count += 1
        self.quantum_energy = min(100, self.quantum_energy + 15)
        self.neural_sync = min(100, self.neural_sync + 25)
        self.active_protocols.append("QUANTUM_SYNC")
        self.log_action("Quantum Interface Activated")
        self.check_system_health()

    def build_completed(self):
        self.status = "Build Completed"
        self.build_count += 1
        self.quantum_energy = max(0, self.quantum_energy - 10)
        self.matrix_stability = min(100, self.matrix_stability + 5)
        self.active_protocols.append("BUILD_PROTOCOL")
        self.log_action("Build Status: Completed")
        self.check_system_health()

    def generate_signature(self):
        data = json.dumps({
            "owner": self.owner,
            "status": self.status,
            "timestamp": self.timestamp,
            "quantum_energy": self.quantum_energy,
            "neural_sync": self.neural_sync
        }, sort_keys=True).encode()
        self.signature_count += 1
        self.quantum_energy = max(0, self.quantum_energy - 5)
        self.active_protocols.append("CRYPTO_SIGN")
        self.log_action("Digital Signature Generated")
        return hashlib.sha256(data).hexdigest()

    def initiate_neural_scan(self):
        self.neural_sync = min(100, self.neural_sync + 35)
        self.active_protocols.append("NEURAL_SCAN")
        self.log_action("Neural Pattern Scan Initiated")
        self.check_system_health()
        return {
            "patterns_detected": ["ALPHA_WAVE", "BETA_SURGE", "GAMMA_PULSE"],
            "sync_level": self.neural_sync,
            "scan_complete": True
        }

    def quantum_boost(self):
        self.quantum_energy = 100
        self.matrix_stability = min(100, self.matrix_stability + 10)
        self.active_protocols.append("QUANTUM_BOOST")
        self.log_action("Quantum Energy Boost Applied")
        self.check_system_health()

    def security_scan(self):
        import random
        threats = ["INTRUSION_DETECTED", "FIREWALL_BREACH", "DATA_LEAK", "CLEAN"]
        threat = random.choice(threats)
        
        if threat == "CLEAN":
            self.threat_level = "Green"
            self.security_level = "Enhanced"
            self.log_action("Security Scan: No Threats Detected")
        else:
            self.threat_level = "Yellow"
            self.security_level = "Alert"
            self.system_alerts.append(f"SECURITY: {threat}")
            self.log_action(f"Security Scan: {threat}")
        
        self.active_protocols.append("SECURITY_SCAN")
        self.check_system_health()
        return {"threat_level": self.threat_level, "threat_type": threat}

    def data_stream_analysis(self):
        import random
        streams = []
        for i in range(3):
            stream = {
                "id": f"STREAM_{i+1:03d}",
                "type": random.choice(["NEURAL", "QUANTUM", "MATRIX", "CRYPTO"]),
                "status": random.choice(["ACTIVE", "IDLE", "PROCESSING"]),
                "bandwidth": random.randint(50, 100),
                "latency": random.randint(1, 15)
            }
            streams.append(stream)
        
        self.data_streams = streams
        self.active_protocols.append("DATA_ANALYSIS")
        self.log_action("Data Stream Analysis Complete")
        return streams

    def matrix_recalibration(self):
        self.matrix_stability = min(100, self.matrix_stability + 15)
        self.quantum_energy = max(0, self.quantum_energy - 20)
        self.active_protocols.append("MATRIX_RECAL")
        self.log_action("Matrix Recalibration Complete")
        self.check_system_health()

    def toggle_admin_mode(self):
        self.admin_mode = not self.admin_mode
        mode_text = "Enabled" if self.admin_mode else "Disabled"
        self.log_action(f"Admin Mode {mode_text}")
        return self.admin_mode

    def system_reboot(self):
        self.status = "Rebooting"
        self.quantum_energy = 100
        self.neural_sync = 0
        self.matrix_stability = 85
        self.system_alerts = []
        self.active_protocols = []
        self.log_action("System Reboot Initiated")
        return {"status": "Rebooting", "eta": "30 seconds"}

    def emergency_shutdown(self):
        self.status = "Emergency Shutdown"
        self.quantum_energy = 0
        self.neural_sync = 0
        self.matrix_stability = 0
        self.system_alerts.append("EMERGENCY: System Shutdown Activated")
        self.log_action("Emergency Shutdown Activated")
        return {"status": "Emergency Shutdown", "reason": "Admin Command"}

    def performance_optimization(self):
        import random
        self.system_performance = min(100, self.system_performance + random.randint(3, 8))
        self.cpu_usage = max(10, self.cpu_usage - random.randint(5, 15))
        self.memory_usage = max(20, self.memory_usage - random.randint(3, 10))
        self.cache_hit_rate = min(99, self.cache_hit_rate + random.randint(1, 3))
        self.log_action("Performance Optimization Applied")
        return {
            "performance": self.system_performance,
            "cpu_usage": self.cpu_usage,
            "memory_usage": self.memory_usage
        }

    def check_system_health(self):
        if self.quantum_energy < 20:
            self.system_alerts.append("LOW_ENERGY: Quantum Energy Below 20%")
        if self.matrix_stability < 70:
            self.system_alerts.append("UNSTABLE: Matrix Stability Critical")
        if self.neural_sync > 90:
            self.system_alerts.append("HIGH_SYNC: Neural Synchronization at Maximum")
        if self.cpu_usage > 85:
            self.system_alerts.append("HIGH_CPU: CPU Usage Critical")
        if self.memory_usage > 90:
            self.system_alerts.append("HIGH_MEMORY: Memory Usage Critical")

    def log_action(self, action):
        timestamped = f"{datetime.utcnow().isoformat()}Z: {action}"
        self.actions_log.append(timestamped)
        if len(self.actions_log) > 100:
            self.actions_log = self.actions_log[-100:]

    def reset_interface(self):
        self.status = "Idle"
        self.actions_log = []
        self.activation_count = 0
        self.build_count = 0
        self.signature_count = 0
        self.quantum_energy = 100
        self.neural_sync = 0
        self.matrix_stability = 85
        self.system_alerts = []
        self.security_level = "Standard"
        self.active_protocols = []
        self.data_streams = []
        self.threat_level = "Green"
        self.log_action("Quantum Interface Reset")

    def get_status_data(self):
        return {
            "status": self.status,
            "activation_count": self.activation_count,
            "build_count": self.build_count,
            "signature_count": self.signature_count,
            "total_actions": len(self.actions_log),
            "logs": self.actions_log,
            "quantum_energy": self.quantum_energy,
            "neural_sync": self.neural_sync,
            "matrix_stability": self.matrix_stability,
            "system_alerts": self.system_alerts,
            "security_level": self.security_level,
            "active_protocols": self.active_protocols,
            "data_streams": self.data_streams,
            "threat_level": self.threat_level,
            "uptime": int(time.time() - self.last_sync),
            "admin_mode": self.admin_mode,
            "system_performance": self.system_performance,
            "network_status": self.network_status,
            "cpu_usage": self.cpu_usage,
            "memory_usage": self.memory_usage,
            "storage_usage": self.storage_usage,
            "active_users": self.active_users,
            "total_requests": self.total_requests,
            "error_count": self.error_count,
            "response_time": self.response_time,
            "bandwidth_usage": self.bandwidth_usage,
            "system_temperature": self.system_temperature,
            "power_consumption": self.power_consumption,
            "database_connections": self.database_connections,
            "cache_hit_rate": self.cache_hit_rate,
            "service_status": self.service_status,
            "system_modules": self.system_modules,
            "connected_devices": self.connected_devices,
            "device_sync_enabled": self.device_sync_enabled
        }

# Device Management Functions
def detect_device_type(user_agent):
    """Detect device type from user agent string"""
    user_agent = user_agent.lower()
    if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
        return 'phone'
    elif 'tablet' in user_agent or 'ipad' in user_agent:
        return 'tablet'
    elif 'watch' in user_agent or 'wearable' in user_agent:
        return 'watch'
    else:
        return 'computer'

def register_device(device_data, ip_address, user_agent):
    """Register a new device or update existing device"""
    device_type = detect_device_type(user_agent)
    
    # Check if device already exists
    device = ConnectedDevice.query.filter_by(device_id=device_data.get('device_id')).first()
    
    if device:
        # Update existing device
        device.last_seen = datetime.utcnow()
        device.is_active = True
        device.ip_address = ip_address
        device.user_agent = user_agent
    else:
        # Create new device
        device = ConnectedDevice(
            device_id=device_data.get('device_id', str(uuid.uuid4())),
            device_name=device_data.get('device_name', f"Unknown {device_type.title()}"),
            device_type=device_type,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(device)
    
    db.session.commit()
    return device

def sync_device_data(device_id, data):
    """Sync device data with quantum watch"""
    device = ConnectedDevice.query.filter_by(device_id=device_id).first()
    if device:
        # Update device metrics
        device.battery_level = data.get('battery_level', device.battery_level)
        device.cpu_usage = data.get('cpu_usage', device.cpu_usage)
        device.memory_usage = data.get('memory_usage', device.memory_usage)
        device.storage_usage = data.get('storage_usage', device.storage_usage)
        device.network_status = data.get('network_status', device.network_status)
        
        # Update quantum data
        device.quantum_energy = data.get('quantum_energy', device.quantum_energy)
        device.neural_sync = data.get('neural_sync', device.neural_sync)
        device.matrix_stability = data.get('matrix_stability', device.matrix_stability)
        device.threat_level = data.get('threat_level', device.threat_level)
        
        device.last_seen = datetime.utcnow()
        db.session.commit()
        
        # Update main quantum watch if sync is enabled
        if watch.device_sync_enabled:
            watch.quantum_energy = max(watch.quantum_energy, device.quantum_energy)
            watch.neural_sync = max(watch.neural_sync, device.neural_sync)
            watch.matrix_stability = max(watch.matrix_stability, device.matrix_stability)
            
            # Sync threat level (take highest priority)
            threat_priority = {"Green": 0, "Yellow": 1, "Red": 2}
            if threat_priority.get(device.threat_level, 0) > threat_priority.get(watch.threat_level, 0):
                watch.threat_level = device.threat_level
        
        return device
    return None

# SocketIO Event Handlers
@socketio.on('connect')
def handle_connect():
    """Handle new device connection"""
    device_id = request.sid
    ip_address = request.environ.get('REMOTE_ADDR', 'unknown')
    user_agent = request.headers.get('User-Agent', '')
    
    # Register device
    device_data = {
        'device_id': device_id,
        'device_name': f"Device {device_id[:8]}"
    }
    
    device = register_device(device_data, ip_address, user_agent)
    
    # Join device room
    join_room(f"device_{device_id}")
    
    # Broadcast device connection
    emit('device_connected', {
        'device': device.to_dict(),
        'message': f"{device.device_name} connected"
    }, broadcast=True)
    
    print(f"Device connected: {device.device_name} ({device.device_type})")

@socketio.on('disconnect')
def handle_disconnect():
    """Handle device disconnection"""
    device_id = request.sid
    device = ConnectedDevice.query.filter_by(device_id=device_id).first()
    
    if device:
        device.is_active = False
        db.session.commit()
        
        # Broadcast device disconnection
        emit('device_disconnected', {
            'device_id': device_id,
            'message': f"{device.device_name} disconnected"
        }, broadcast=True)
        
        print(f"Device disconnected: {device.device_name}")

@socketio.on('sync_device_data')
def handle_sync_device_data(data):
    """Handle device data synchronization"""
    device_id = request.sid
    device = sync_device_data(device_id, data)
    
    if device:
        # Broadcast updated device data
        emit('device_data_updated', {
            'device': device.to_dict(),
            'quantum_watch_data': watch.get_status_data()
        }, broadcast=True)

@socketio.on('device_action')
def handle_device_action(data):
    """Handle device actions (activate, scan, etc.)"""
    device_id = request.sid
    action_type = data.get('action_type')
    action_data = data.get('action_data', {})
    
    # Log device action
    device_action = DeviceAction(
        device_id=device_id,
        action_type=action_type,
        action_data=json.dumps(action_data)
    )
    db.session.add(device_action)
    db.session.commit()
    
    # Execute action on quantum watch
    result = execute_device_action(action_type, action_data)
    
    # Broadcast action result
    emit('action_result', {
        'action_type': action_type,
        'result': result,
        'device_id': device_id
    }, broadcast=True)

def execute_device_action(action_type, action_data):
    """Execute device action on quantum watch"""
    if action_type == 'activate':
        watch.activate_interface()
        return {'success': True, 'message': 'Interface activated'}
    elif action_type == 'neural_scan':
        return watch.initiate_neural_scan()
    elif action_type == 'quantum_boost':
        watch.quantum_boost()
        return {'success': True, 'message': 'Quantum boost applied'}
    elif action_type == 'security_scan':
        return watch.security_scan()
    elif action_type == 'matrix_recalibration':
        watch.matrix_recalibration()
        return {'success': True, 'message': 'Matrix recalibrated'}
    else:
        return {'success': False, 'message': 'Unknown action'}

@socketio.on('get_all_devices')
def handle_get_all_devices():
    """Get all connected devices"""
    devices = ConnectedDevice.query.all()
    emit('all_devices', {
        'devices': [device.to_dict() for device in devices],
        'count': len(devices)
    })

@socketio.on('toggle_device_sync')
def handle_toggle_device_sync():
    """Toggle device synchronization"""
    watch.device_sync_enabled = not watch.device_sync_enabled
    emit('device_sync_toggled', {
        'enabled': watch.device_sync_enabled,
        'message': f"Device sync {'enabled' if watch.device_sync_enabled else 'disabled'}"
    }, broadcast=True)

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

@app.route("/api/neural-scan", methods=["POST"])
def api_neural_scan():
    try:
        result = watch.initiate_neural_scan()
        return jsonify({
            "success": True,
            "message": "Neural Scan Complete",
            "scan_results": result,
            "neural_sync": watch.neural_sync
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Neural scan failed: {str(e)}"
        }), 500

@app.route("/api/quantum-boost", methods=["POST"])
def api_quantum_boost():
    try:
        watch.quantum_boost()
        return jsonify({
            "success": True,
            "message": "Quantum Energy Boosted to Maximum",
            "quantum_energy": watch.quantum_energy,
            "matrix_stability": watch.matrix_stability
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Quantum boost failed: {str(e)}"
        }), 500

@app.route("/api/security-scan", methods=["POST"])
def api_security_scan():
    try:
        result = watch.security_scan()
        return jsonify({
            "success": True,
            "message": "Security Scan Complete",
            "scan_results": result,
            "threat_level": watch.threat_level,
            "security_level": watch.security_level
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Security scan failed: {str(e)}"
        }), 500

@app.route("/api/data-analysis", methods=["POST"])
def api_data_analysis():
    try:
        streams = watch.data_stream_analysis()
        return jsonify({
            "success": True,
            "message": "Data Stream Analysis Complete",
            "data_streams": streams
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Data analysis failed: {str(e)}"
        }), 500

@app.route("/api/matrix-recalibration", methods=["POST"])
def api_matrix_recalibration():
    try:
        watch.matrix_recalibration()
        return jsonify({
            "success": True,
            "message": "Matrix Recalibration Complete",
            "matrix_stability": watch.matrix_stability,
            "quantum_energy": watch.quantum_energy
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Matrix recalibration failed: {str(e)}"
        }), 500

@app.route("/api/clear-alerts", methods=["POST"])
def api_clear_alerts():
    try:
        watch.system_alerts = []
        watch.log_action("System Alerts Cleared")
        return jsonify({
            "success": True,
            "message": "All System Alerts Cleared"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Alert clearing failed: {str(e)}"
        }), 500

@app.route("/api/admin-toggle", methods=["POST"])
def api_admin_toggle():
    try:
        admin_mode = watch.toggle_admin_mode()
        return jsonify({
            "success": True,
            "message": f"Admin Mode {'Enabled' if admin_mode else 'Disabled'}",
            "admin_mode": admin_mode
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Admin toggle failed: {str(e)}"
        }), 500

@app.route("/api/system-reboot", methods=["POST"])
def api_system_reboot():
    try:
        result = watch.system_reboot()
        return jsonify({
            "success": True,
            "message": "System Reboot Initiated",
            "reboot_info": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"System reboot failed: {str(e)}"
        }), 500

@app.route("/api/emergency-shutdown", methods=["POST"])
def api_emergency_shutdown():
    try:
        result = watch.emergency_shutdown()
        return jsonify({
            "success": True,
            "message": "Emergency Shutdown Activated",
            "shutdown_info": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Emergency shutdown failed: {str(e)}"
        }), 500

@app.route("/api/performance-optimization", methods=["POST"])
def api_performance_optimization():
    try:
        result = watch.performance_optimization()
        return jsonify({
            "success": True,
            "message": "Performance Optimization Applied",
            "optimization_results": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Performance optimization failed: {str(e)}"
        }), 500

# Device Connection API Endpoints
@app.route("/api/devices", methods=["GET"])
def api_get_devices():
    try:
        devices = ConnectedDevice.query.all()
        return jsonify({
            "success": True,
            "devices": [device.to_dict() for device in devices],
            "count": len(devices)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get devices: {str(e)}"
        }), 500

@app.route("/api/device/<device_id>", methods=["GET"])
def api_get_device(device_id):
    try:
        device = ConnectedDevice.query.filter_by(device_id=device_id).first()
        if device:
            return jsonify({
                "success": True,
                "device": device.to_dict()
            })
        else:
            return jsonify({
                "success": False,
                "message": "Device not found"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get device: {str(e)}"
        }), 500

@app.route("/api/device/<device_id>/sync", methods=["POST"])
def api_sync_device(device_id):
    try:
        data = request.get_json()
        device = sync_device_data(device_id, data)
        if device:
            return jsonify({
                "success": True,
                "message": "Device data synchronized",
                "device": device.to_dict()
            })
        else:
            return jsonify({
                "success": False,
                "message": "Device not found"
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to sync device: {str(e)}"
        }), 500

@app.route("/api/device-sync/toggle", methods=["POST"])
def api_toggle_device_sync():
    try:
        watch.device_sync_enabled = not watch.device_sync_enabled
        return jsonify({
            "success": True,
            "message": f"Device sync {'enabled' if watch.device_sync_enabled else 'disabled'}",
            "enabled": watch.device_sync_enabled
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to toggle device sync: {str(e)}"
        }), 500

@app.route("/api/device/<device_id>/actions", methods=["GET"])
def api_get_device_actions(device_id):
    try:
        actions = DeviceAction.query.filter_by(device_id=device_id).order_by(DeviceAction.timestamp.desc()).limit(50).all()
        return jsonify({
            "success": True,
            "actions": [action.to_dict() for action in actions],
            "count": len(actions)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get device actions: {str(e)}"
        }), 500

@app.route("/api/alerts", methods=["GET"])
def api_get_alerts():
    try:
        alerts = SystemAlert.query.filter_by(is_acknowledged=False).order_by(SystemAlert.timestamp.desc()).all()
        return jsonify({
            "success": True,
            "alerts": [alert.to_dict() for alert in alerts],
            "count": len(alerts)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to get alerts: {str(e)}"
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
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)