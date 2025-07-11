from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class ConnectedDevice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(100), unique=True, nullable=False)
    device_name = db.Column(db.String(200), nullable=False)
    device_type = db.Column(db.String(50), nullable=False)  # phone, tablet, computer, watch
    ip_address = db.Column(db.String(45), nullable=False)
    user_agent = db.Column(db.Text)
    connected_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Device specific data
    battery_level = db.Column(db.Integer, default=100)
    cpu_usage = db.Column(db.Float, default=0.0)
    memory_usage = db.Column(db.Float, default=0.0)
    storage_usage = db.Column(db.Float, default=0.0)
    network_status = db.Column(db.String(20), default="Online")
    
    # Quantum Watch specific data
    quantum_energy = db.Column(db.Integer, default=100)
    neural_sync = db.Column(db.Integer, default=0)
    matrix_stability = db.Column(db.Integer, default=85)
    threat_level = db.Column(db.String(20), default="Green")
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'device_name': self.device_name,
            'device_type': self.device_type,
            'ip_address': self.ip_address,
            'connected_at': self.connected_at.isoformat(),
            'last_seen': self.last_seen.isoformat(),
            'is_active': self.is_active,
            'battery_level': self.battery_level,
            'cpu_usage': self.cpu_usage,
            'memory_usage': self.memory_usage,
            'storage_usage': self.storage_usage,
            'network_status': self.network_status,
            'quantum_energy': self.quantum_energy,
            'neural_sync': self.neural_sync,
            'matrix_stability': self.matrix_stability,
            'threat_level': self.threat_level
        }

class DeviceAction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(100), nullable=False)
    action_type = db.Column(db.String(100), nullable=False)
    action_data = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'action_type': self.action_type,
            'action_data': json.loads(self.action_data) if self.action_data else None,
            'timestamp': self.timestamp.isoformat()
        }

class SystemAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(100), nullable=False)
    alert_type = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), default="INFO")  # INFO, WARNING, ERROR, CRITICAL
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_acknowledged = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'alert_type': self.alert_type,
            'message': self.message,
            'severity': self.severity,
            'timestamp': self.timestamp.isoformat(),
            'is_acknowledged': self.is_acknowledged
        }

class AIAssistant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    device_count = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'message': self.message,
            'response': self.response,
            'timestamp': self.timestamp.isoformat(),
            'device_count': self.device_count
        }

class DeviceNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    target_ip = db.Column(db.String(45), nullable=False)
    notification_type = db.Column(db.String(50), default="APP_INSTALL")
    message = db.Column(db.Text, nullable=False)
    install_url = db.Column(db.String(500), nullable=False)
    is_sent = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'target_ip': self.target_ip,
            'notification_type': self.notification_type,
            'message': self.message,
            'install_url': self.install_url,
            'is_sent': self.is_sent,
            'timestamp': self.timestamp.isoformat()
        }