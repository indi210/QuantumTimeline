// Quantum Interface Watch - Enhanced JavaScript
// Author: Ervin Remus Radosavlevici

class QuantumInterface {
    constructor() {
        this.isLoading = false;
        this.statusUpdateInterval = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.startStatusUpdates();
        this.initializeParticles();
    }

    bindEvents() {
        // Button event listeners
        document.getElementById('activateBtn').addEventListener('click', () => this.activateInterface());
        document.getElementById('buildBtn').addEventListener('click', () => this.completeBuild());
        document.getElementById('signatureBtn').addEventListener('click', () => this.generateSignature());
        document.getElementById('logsBtn').addEventListener('click', () => this.refreshLogs());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetInterface());
        document.getElementById('rootAccessBtn').addEventListener('click', () => this.accessRootKey());

        // Advanced feature buttons
        document.getElementById('neuralScanBtn').addEventListener('click', () => this.performNeuralScan());
        document.getElementById('quantumBoostBtn').addEventListener('click', () => this.performQuantumBoost());
        document.getElementById('securityScanBtn').addEventListener('click', () => this.performSecurityScan());
        document.getElementById('dataAnalysisBtn').addEventListener('click', () => this.performDataAnalysis());
        document.getElementById('matrixRecalBtn').addEventListener('click', () => this.performMatrixRecalibration());

        // Admin dashboard buttons
        document.getElementById('adminToggleBtn').addEventListener('click', () => this.toggleAdminMode());
        document.getElementById('performanceOptBtn').addEventListener('click', () => this.performanceOptimization());
        document.getElementById('systemRebootBtn').addEventListener('click', () => this.systemReboot());
        document.getElementById('emergencyShutdownBtn').addEventListener('click', () => this.emergencyShutdown());
    }

    showLoading() {
        this.isLoading = true;
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('active');
    }

    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('successToast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Add visual feedback
        this.addVisualFeedback(type);
    }

    addVisualFeedback(type) {
        const colors = {
            success: '#00ff41',
            warning: '#ffaa00',
            danger: '#ff0055',
            info: '#0099ff'
        };

        // Create temporary glow effect
        document.body.style.boxShadow = `inset 0 0 50px ${colors[type]}`;
        setTimeout(() => {
            document.body.style.boxShadow = '';
        }, 500);
    }

    async makeRequest(endpoint, method = 'POST') {
        try {
            this.showLoading();

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Request failed:', error);
            this.showToast('Request failed: ' + error.message, 'danger');
            throw error;
        } finally {
            this.hideLoading();
        }
    }

    async activateInterface() {
        try {
            const result = await this.makeRequest('/api/activate');
            if (result.success) {
                this.showToast(result.message, 'success');
                this.updateStatus(result.status);
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Activation failed:', error);
        }
    }

    async completeBuild() {
        try {
            const result = await this.makeRequest('/api/build');
            if (result.success) {
                this.showToast(result.message, 'success');
                this.updateStatus(result.status);
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Build completion failed:', error);
        }
    }

    async generateSignature() {
        try {
            const result = await this.makeRequest('/api/signature');
            if (result.success) {
                this.showToast(result.message, 'warning');
                this.displaySignature(result.signature);
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Signature generation failed:', error);
        }
    }

    async refreshLogs() {
        try {
            const result = await this.makeRequest('/api/logs', 'GET');
            this.updateLogs(result.logs);
        } catch (error) {
            console.error('Log refresh failed:', error);
        }
    }

    async resetInterface() {
        if (confirm('Are you sure you want to reset the Quantum Interface?')) {
            try {
                const result = await this.makeRequest('/api/reset');
                if (result.success) {
                    this.showToast(result.message, 'info');
                    this.updateStatus(result.status);
                    this.refreshLogs();
                    this.hideSignature();
                }
            } catch (error) {
                console.error('Reset failed:', error);
            }
        }
    }

    async accessRootKey() {
        try {
            const result = await this.makeRequest('/root-access', 'GET');
            this.displayRootKey(result);
            this.showToast('Root access granted', 'danger');
        } catch (error) {
            console.error('Root access failed:', error);
        }
    }

    updateStatus(status) {
        const statusText = document.getElementById('statusText');
        const pulseDot = document.getElementById('pulseDot');

        statusText.textContent = status;

        // Update pulse dot color based on status
        if (status === 'Activated') {
            pulseDot.style.background = '#00ff41';
        } else if (status === 'Build Completed') {
            pulseDot.style.background = '#ffaa00';
        } else {
            pulseDot.style.background = '#00ffff';
        }
    }

    updateLogs(logs) {
        const logDisplay = document.getElementById('logDisplay');
        logDisplay.innerHTML = '';

        logs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = log;
            logDisplay.appendChild(logEntry);
        });

        // Auto-scroll to bottom
        logDisplay.scrollTop = logDisplay.scrollHeight;
    }

    displaySignature(signature) {
        const signaturePanel = document.getElementById('signaturePanel');
        const signatureDisplay = document.getElementById('signatureDisplay');

        signatureDisplay.innerHTML = `
            <div class="signature-header">
                <strong>SHA256 Digital Signature:</strong>
            </div>
            <div class="signature-hash">${signature}</div>
            <div class="signature-info">
                <small>Generated at: ${new Date().toISOString()}</small>
            </div>
        `;

        signaturePanel.style.display = 'block';
        signaturePanel.scrollIntoView({ behavior: 'smooth' });
    }

    hideSignature() {
        const signaturePanel = document.getElementById('signaturePanel');
        signaturePanel.style.display = 'none';
    }

    displayRootKey(rootData) {
        const rootKeyDisplay = document.getElementById('rootKeyDisplay');

        rootKeyDisplay.innerHTML = `
            <div class="root-key-header">
                <strong>Root Access Granted:</strong>
            </div>
            <div class="root-key-item">
                <span>Email:</span> ${rootData.email}
            </div>
            <div class="root-key-item">
                <span>Access Level:</span> ${rootData.access_level}
            </div>
            <div class="root-key-item">
                <span>Root Hash:</span> ${rootData.root_hash}
            </div>
        `;

        rootKeyDisplay.style.display = 'block';
    }

    startStatusUpdates() {
        this.statusUpdateInterval = setInterval(() => {
            this.updateMetrics();
        }, 5000);
    }

    async performNeuralScan() {
        try {
            const result = await this.makeRequest('/api/neural-scan');
            if (result.success) {
                this.showToast(result.message, 'info');
                this.displayNeuralResults(result.scan_results);
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Neural scan failed:', error);
        }
    }

    async performQuantumBoost() {
        try {
            const result = await this.makeRequest('/api/quantum-boost');
            if (result.success) {
                this.showToast(result.message, 'success');
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Quantum boost failed:', error);
        }
    }

    async performSecurityScan() {
        try {
            const result = await this.makeRequest('/api/security-scan');
            if (result.success) {
                this.showToast(result.message, 'warning');
                this.displaySecurityResults(result.scan_results);
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Security scan failed:', error);
        }
    }

    async performDataAnalysis() {
        try {
            const result = await this.makeRequest('/api/data-analysis');
            if (result.success) {
                this.showToast(result.message, 'info');
                this.displayDataStreams(result.data_streams);
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Data analysis failed:', error);
        }
    }

    async performMatrixRecalibration() {
        try {
            const result = await this.makeRequest('/api/matrix-recalibration');
            if (result.success) {
                this.showToast(result.message, 'warning');
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Matrix recalibration failed:', error);
        }
    }

    async clearSystemAlerts() {
        try {
            const result = await this.makeRequest('/api/clear-alerts');
            if (result.success) {
                this.showToast(result.message, 'success');
                this.updateAlerts([]);
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Clear alerts failed:', error);
        }
    }

    async toggleAdminMode() {
        try {
            const result = await this.makeRequest('/api/admin-toggle');
            if (result.success) {
                this.showToast(result.message, 'warning');
                this.updateAdminMode(result.admin_mode);
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Admin toggle failed:', error);
        }
    }

    async performanceOptimization() {
        try {
            const result = await this.makeRequest('/api/performance-optimization');
            if (result.success) {
                this.showToast(result.message, 'success');
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Performance optimization failed:', error);
        }
    }

    async systemReboot() {
        try {
            const result = await this.makeRequest('/api/system-reboot');
            if (result.success) {
                this.showToast(result.message, 'warning');
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('System reboot failed:', error);
        }
    }

    async emergencyShutdown() {
        try {
            const result = await this.makeRequest('/api/emergency-shutdown');
            if (result.success) {
                this.showToast(result.message, 'danger');
                this.updateMetrics();
                this.refreshLogs();
            }
        } catch (error) {
            console.error('Emergency shutdown failed:', error);
        }
    }

    displayNeuralResults(results) {
        const signaturePanel = document.getElementById('signaturePanel');
        const signatureDisplay = document.getElementById('signatureDisplay');

        signatureDisplay.innerHTML = `
            <div class="neural-scan-results">
                <div class="signature-header">
                    <strong>Neural Scan Results:</strong>
                </div>
                <div class="neural-pattern">
                    <span>Patterns Detected:</span>
                    <span>${results.patterns_detected.join(', ')}</span>
                </div>
                <div class="neural-pattern">
                    <span>Sync Level:</span>
                    <span>${results.sync_level}%</span>
                </div>
                <div class="neural-pattern">
                    <span>Scan Status:</span>
                    <span>${results.scan_complete ? 'COMPLETE' : 'PROCESSING'}</span>
                </div>
            </div>
        `;

        signaturePanel.style.display = 'block';
        signaturePanel.scrollIntoView({ behavior: 'smooth' });
    }

    displaySecurityResults(results) {
        const signaturePanel = document.getElementById('signaturePanel');
        const signatureDisplay = document.getElementById('signatureDisplay');

        const threatClass = results.threat_level === 'Green' ? 'security-threat-green' : 
                           results.threat_level === 'Yellow' ? 'security-threat-yellow' : 
                           'security-threat-red';

        signatureDisplay.innerHTML = `
            <div class="security-scan-results">
                <div class="signature-header">
                    <strong>Security Scan Results:</strong>
                </div>
                <div class="security-item">
                    <span>Threat Level:</span>
                    <span class="${threatClass}">${results.threat_level}</span>
                </div>
                <div class="security-item">
                    <span>Threat Type:</span>
                    <span>${results.threat_type}</span>
                </div>
                <div class="security-item">
                    <span>Scan Time:</span>
                    <span>${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;

        signaturePanel.style.display = 'block';
        signaturePanel.scrollIntoView({ behavior: 'smooth' });
    }

    displayDataStreams(streams) {
        const dataStreamsDisplay = document.getElementById('dataStreamsDisplay');
        dataStreamsDisplay.innerHTML = '';

        if (streams.length === 0) {
            dataStreamsDisplay.innerHTML = '<div class="stream-item-empty">No active data streams</div>';
            return;
        }

        streams.forEach(stream => {
            const streamItem = document.createElement('div');
            streamItem.className = 'stream-item';
            streamItem.innerHTML = `
                <div class="stream-id">${stream.id}</div>
                <div class="stream-type">${stream.type}</div>
                <div class="stream-status">${stream.status}</div>
                <div class="stream-bandwidth">${stream.bandwidth}%</div>
                <div class="stream-latency">${stream.latency}ms</div>
            `;
            dataStreamsDisplay.appendChild(streamItem);
        });
    }

    updateAlerts(alerts) {
        const alertDisplay = document.getElementById('alertDisplay');
        alertDisplay.innerHTML = '';

        if (alerts.length === 0) {
            alertDisplay.innerHTML = '<div class="alert-entry-empty">No active alerts</div>';
            return;
        }

        alerts.forEach(alert => {
            const alertEntry = document.createElement('div');
            alertEntry.className = 'alert-entry';
            alertEntry.textContent = alert;
            alertDisplay.appendChild(alertEntry);
        });
    }

    updateAdminMode(adminMode) {
        const adminToggleBtn = document.getElementById('adminToggleBtn');
        const icon = adminToggleBtn.querySelector('i');

        if (adminMode) {
            icon.className = 'fas fa-toggle-on';
            adminToggleBtn.classList.add('admin-mode-active');
        } else {
            icon.className = 'fas fa-toggle-off';
            adminToggleBtn.classList.remove('admin-mode-active');
        }
    }

    async updateMetrics() {
        try {
            const result = await this.makeRequest('/api/status', 'GET');

            // Update advanced metrics display
            const quantumEnergyEl = document.getElementById('quantumEnergy');
            const neuralSyncEl = document.getElementById('neuralSync');
            const matrixStabilityEl = document.getElementById('matrixStability');
            const threatLevelEl = document.getElementById('threatLevel');

            if (quantumEnergyEl) quantumEnergyEl.textContent = result.quantum_energy + '%';
            if (neuralSyncEl) neuralSyncEl.textContent = result.neural_sync + '%';
            if (matrixStabilityEl) matrixStabilityEl.textContent = result.matrix_stability + '%';
            if (threatLevelEl) threatLevelEl.textContent = result.threat_level;

            // Update admin metrics
            const cpuValue = document.getElementById('cpuValue');
            const memoryValue = document.getElementById('memoryValue');
            const storageValue = document.getElementById('storageValue');
            const systemPerformance = document.getElementById('systemPerformance');
            const systemTemperature = document.getElementById('systemTemperature');
            const powerConsumption = document.getElementById('powerConsumption');
            const cacheHitRate = document.getElementById('cacheHitRate');

            if (cpuValue) cpuValue.textContent = result.cpu_usage + '%';
            if (memoryValue) memoryValue.textContent = result.memory_usage + '%';
            if (storageValue) storageValue.textContent = result.storage_usage + '%';
            if (systemPerformance) systemPerformance.textContent = result.system_performance + '%';
            if (systemTemperature) systemTemperature.textContent = result.system_temperature + '°C';
            if (powerConsumption) powerConsumption.textContent = result.power_consumption + 'W';
            if (cacheHitRate) cacheHitRate.textContent = result.cache_hit_rate + '%';

            // Update progress bars
            const cpuBar = document.getElementById('cpuBar');
            const memoryBar = document.getElementById('memoryBar');
            const storageBar = document.getElementById('storageBar');

            if (cpuBar) cpuBar.style.width = result.cpu_usage + '%';
            if (memoryBar) memoryBar.style.width = result.memory_usage + '%';
            if (storageBar) storageBar.style.width = result.storage_usage + '%';

            // Update alerts
            this.updateAlerts(result.system_alerts);

            // Update data streams
            const dataStreamsDisplay = document.getElementById('dataStreamsDisplay');
            if (dataStreamsDisplay) {
                this.displayDataStreams(result.data_streams);
            }

            // Update admin mode
            this.updateAdminMode(result.admin_mode);

        } catch (error) {
            console.error('Status update failed:', error);
        }
    }

    initializeParticles() {
        // Create additional quantum particles effect
        const particlesContainer = document.querySelector('.quantum-particles');

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #00ffff;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: quantumParticle ${3 + Math.random() * 4}s linear infinite;
                opacity: ${0.3 + Math.random() * 0.7};
            `;
            particlesContainer.appendChild(particle);
        }
    }

    destroy() {
        if (this.statusUpdateInterval) {
            clearInterval(this.statusUpdateInterval);
        }
    }
}

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes quantumParticle {
        0% { transform: translateY(0px) rotate(0deg); }
        100% { transform: translateY(-100vh) rotate(360deg); }
    }

    .signature-header, .root-key-header {
        color: #00ffff;
        margin-bottom: 10px;
    }

    .signature-hash {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        word-break: break-all;
        padding: 10px;
        background: rgba(255, 170, 0, 0.1);
        border-radius: 5px;
        margin: 10px 0;
    }

    .signature-info {
        color: #888;
        font-size: 0.8rem;
        margin-top: 10px;
    }

    .root-key-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #333;
    }

    .root-key-item:last-child {
        border-bottom: none;
    }

    .root-key-item span:first-child {
        font-weight: bold;
        color: #ff0055;
    }
`;
document.head.appendChild(style);

// Device Management Functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('URL copied to clipboard!');
    });
}

// Socket.IO Integration
let socket;
let connectedDevices = [];

function initializeSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
        loadConnectedDevices();
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('device_connected', (data) => {
        console.log('Device connected:', data);
        addDeviceToGrid(data.device);
        showDeviceNotification(data.message, 'success');
    });

    socket.on('device_disconnected', (data) => {
        console.log('Device disconnected:', data);
        removeDeviceFromGrid(data.device_id);
        showDeviceNotification(data.message, 'warning');
    });

    socket.on('device_data_updated', (data) => {
        console.log('Device data updated:', data);
        updateDeviceInGrid(data.device);
    });

    socket.on('action_result', (data) => {
        console.log('Action result:', data);
        addActionToLog(data);
    });

    socket.on('device_sync_toggled', (data) => {
        console.log('Device sync toggled:', data);
        updateSyncStatus(data.enabled);
        showDeviceNotification(data.message, 'info');
    });

    socket.on('all_devices', (data) => {
        console.log('All devices:', data);
        connectedDevices = data.devices;
        renderDevicesGrid();
    });
}

function loadConnectedDevices() {
    fetch('/api/devices')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                connectedDevices = data.devices;
                renderDevicesGrid();
            }
        })
        .catch(error => {
            console.error('Error loading devices:', error);
        });
}

function renderDevicesGrid() {
    const grid = document.getElementById('connectedDevicesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (connectedDevices.length === 0) {
        grid.innerHTML = `
            <div class="no-devices">
                <i class="fas fa-mobile-alt"></i>
                <p>No devices connected</p>
                <p>Use the instructions below to connect your devices</p>
            </div>
        `;
        return;
    }

    connectedDevices.forEach(device => {
        const deviceCard = createDeviceCard(device);
        grid.appendChild(deviceCard);
    });
}

function createDeviceCard(device) {
    const card = document.createElement('div');
    card.className = `device-card ${device.is_active ? 'online' : 'offline'}`;
    card.id = `device-${device.device_id}`;

    const deviceIcon = getDeviceIcon(device.device_type);
    const connectionTime = new Date(device.connected_at).toLocaleString();
    const lastSeen = new Date(device.last_seen).toLocaleString();

    card.innerHTML = `
        <div class="device-header">
            <div class="device-name">
                <i class="${deviceIcon}"></i>
                ${device.device_name}
            </div>
            <div class="device-type ${device.device_type}">${device.device_type}</div>
        </div>
        <div class="device-status ${device.is_active ? 'online' : 'offline'}">
            Status: ${device.is_active ? 'Online' : 'Offline'}
        </div>
        <div class="device-info">
            <small>IP: ${device.ip_address}</small><br>
            <small>Connected: ${connectionTime}</small><br>
            <small>Last Seen: ${lastSeen}</small>
        </div>
        <div class="device-metrics">
            <div class="device-metric">
                <div class="device-metric-label">Battery</div>
                <div class="device-metric-value">${device.battery_level}%</div>
            </div>
            <div class="device-metric">
                <div class="device-metric-label">CPU</div>
                <div class="device-metric-value">${device.cpu_usage}%</div>
            </div>
            <div class="device-metric">
                <div class="device-metric-label">Memory</div>
                <div class="device-metric-value">${device.memory_usage}%</div>
            </div>
            <div class="device-metric">
                <div class="device-metric-label">Quantum</div>
                <div class="device-metric-value">${device.quantum_energy}%</div>
            </div>
        </div>
        <div class="device-actions">
            <button class="device-action-btn" onclick="syncDevice('${device.device_id}')">
                <i class="fas fa-sync"></i> Sync
            </button>
            <button class="device-action-btn" onclick="sendActionToDevice('${device.device_id}', 'activate')">
                <i class="fas fa-power-off"></i> Activate
            </button>
            <button class="device-action-btn" onclick="sendActionToDevice('${device.device_id}', 'neural_scan')">
                <i class="fas fa-brain"></i> Scan
            </button>
            <button class="device-action-btn" onclick="disconnectDevice('${device.device_id}')">
                <i class="fas fa-times"></i> Disconnect
            </button>
        </div>
    `;

    return card;
}

function getDeviceIcon(deviceType) {
    switch(deviceType) {
        case 'phone': return 'fas fa-mobile-alt';
        case 'tablet': return 'fas fa-tablet-alt';
        case 'watch': return 'fas fa-clock';
        case 'computer': return 'fas fa-desktop';
        default: return 'fas fa-question';
    }
}

function addDeviceToGrid(device) {
    const existingIndex = connectedDevices.findIndex(d => d.device_id === device.device_id);
    if (existingIndex !== -1) {
        connectedDevices[existingIndex] = device;
    } else {
        connectedDevices.push(device);
    }
    renderDevicesGrid();
}

function removeDeviceFromGrid(deviceId) {
    connectedDevices = connectedDevices.filter(d => d.device_id !== deviceId);
    renderDevicesGrid();
}

function updateDeviceInGrid(device) {
    const existingIndex = connectedDevices.findIndex(d => d.device_id === device.device_id);
    if (existingIndex !== -1) {
        connectedDevices[existingIndex] = device;
        renderDevicesGrid();
    }
}

function syncDevice(deviceId) {
    // Generate some realistic device data
    const syncData = {
        battery_level: Math.floor(Math.random() * 100) + 1,
        cpu_usage: Math.floor(Math.random() * 80) + 10,
        memory_usage: Math.floor(Math.random() * 90) + 10,
        quantum_energy: Math.floor(Math.random() * 100) + 1,
        neural_sync: Math.floor(Math.random() * 100),
        matrix_stability: Math.floor(Math.random() * 100) + 50,
        threat_level: ['Green', 'Yellow', 'Red'][Math.floor(Math.random() * 3)]
    };

    fetch(`/api/device/${deviceId}/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showDeviceNotification(`Device ${deviceId.substr(0, 8)} synced successfully`, 'success');
            updateDeviceInGrid(data.device);
        }
    })
    .catch(error => {
        console.error('Error syncing device:', error);
        showDeviceNotification('Device sync failed', 'error');
    });
}

function sendActionToDevice(deviceId, actionType) {
    if (socket) {
        socket.emit('device_action', {
            device_id: deviceId,
            action_type: actionType,
            action_data: {}
        });
        showDeviceNotification(`Action "${actionType}" sent to device`, 'info');
    }
}

function disconnectDevice(deviceId) {
    // Mark device as inactive
    const device = connectedDevices.find(d => d.device_id === deviceId);
    if (device) {
        device.is_active = false;
        updateDeviceInGrid(device);
        showDeviceNotification(`Device ${device.device_name} disconnected`, 'warning');
    }
}

function showDeviceNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `device-notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: 1px solid #00ff41;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateSyncStatus(enabled) {
    const syncIndicator = document.querySelector('.sync-indicator');
    const syncStatusText = document.getElementById('syncStatusText');

    if (syncIndicator && syncStatusText) {
        if (enabled) {
            syncIndicator.classList.remove('disabled');
            syncStatusText.textContent = 'Enabled';
        } else {
            syncIndicator.classList.add('disabled');
            syncStatusText.textContent = 'Disabled';
        }
    }
}

function addActionToLog(actionData) {
    const actionsDisplay = document.getElementById('actionsDisplay');
    if (!actionsDisplay) return;

    const actionEntry = document.createElement('div');
    actionEntry.className = 'action-entry';

    const timestamp = new Date().toLocaleTimeString();
    actionEntry.innerHTML = `
        <div class="action-device">${actionData.device_id.substr(0, 8)}</div>
        <div class="action-type">${actionData.action_type}</div>
        <div class="action-timestamp">${timestamp}</div>
    `;

    actionsDisplay.insertBefore(actionEntry, actionsDisplay.firstChild);

    // Keep only last 10 actions
    while (actionsDisplay.children.length > 10) {
        actionsDisplay.removeChild(actionsDisplay.lastChild);
    }
}

// Global variables for AI assistant
let aiAssistantActive = false;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    loadConnectedDevices();
    initializeEventListeners();
    initializeSocket();
    updateConnectionUrl();
    initializeAIAssistant();
    startAutoDiscovery();

    // Auto-refresh status every 5 seconds
    setInterval(updateStatus, 5000);

    // AI monitoring every 2 minutes
    setInterval(checkAIUpdates, 120000);

    // Auto data sharing every 10 seconds
    setInterval(shareDataWithAllDevices, 10000);
});

function initializeAIAssistant() {
    // Add AI assistant panel to page
    const aiPanel = document.createElement('div');
    aiPanel.className = 'quantum-panel ai-assistant-panel';
    aiPanel.innerHTML = `
        <h3><i class="fas fa-robot"></i> AI Assistant</h3>
        <div class="ai-chat-area" id="aiChatArea">
            <div class="ai-message">
                <strong>AI Assistant:</strong> Hello! I'm monitoring all connected devices and can help with security, data sharing, and device management. What would you like to know?
            </div>
        </div>
        <div class="ai-input-area">
            <input type="text" id="aiMessageInput" class="form-control" placeholder="Ask about devices, security, or data sharing...">
            <button id="aiSendBtn" class="quantum-btn quantum-btn-primary">
                <i class="fas fa-paper-plane"></i>
                Send
            </button>
        </div>
    `;

    // Insert AI panel after the main controls
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        mainContainer.appendChild(aiPanel);
    }

    // AI input event listeners
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiMessageInput = document.getElementById('aiMessageInput');

    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendAIMessage);
    }

    if (aiMessageInput) {
        aiMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAIMessage();
            }
        });
    }
}

function sendAIMessage() {
    const messageInput = document.getElementById('aiMessageInput');
    const chatArea = document.getElementById('aiChatArea');
    const message = messageInput.value.trim();

    if (!message) return;

    // Add user message to chat
    chatArea.innerHTML += `
        <div class="user-message">
            <strong>You:</strong> ${message}
        </div>
    `;

    messageInput.value = '';

    // Send to AI assistant
    fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            chatArea.innerHTML += `
                <div class="ai-message">
                    <strong>AI Assistant:</strong> ${data.response}
                </div>
            `;

            // Show device summary if available
            if (data.device_summary) {
                displayDeviceSummary(data.device_summary);
            }
        }
        chatArea.scrollTop = chatArea.scrollHeight;
    })
    .catch(error => {
        console.error('AI assistant error:', error);
        chatArea.innerHTML += `
            <div class="ai-error">
                <strong>Error:</strong> AI assistant temporarily unavailable
            </div>
        `;
    });
}

function displayDeviceSummary(summary) {
    const summaryPanel = document.getElementById('deviceSummaryPanel') || createDeviceSummaryPanel();
    summaryPanel.innerHTML = `
        <h4>Device Network Summary</h4>
        <div class="summary-stats">
            <div class="stat-item">
                <i class="fas fa-mobile-alt"></i>
                <span>Total Devices: ${summary.total_devices}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-battery-three-quarters"></i>
                <span>Avg Battery: ${summary.average_battery}%</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-share-alt"></i>
                <span>Data Sharing: ${summary.data_sharing_active ? 'Active' : 'Inactive'}</span>
            </div>
        </div>
    `;
}

function createDeviceSummaryPanel() {
    const panel = document.createElement('div');
    panel.id = 'deviceSummaryPanel';
    panel.className = 'quantum-panel device-summary-panel';

    const container = document.querySelector('.container');
    if (container) {
        container.appendChild(panel);
    }

    return panel;
}

function startAutoDiscovery() {
    // Auto-discover new devices every 30 seconds
    setInterval(() => {
        fetch('/api/device-discovery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.discovered_devices.length > 0) {
                console.log(`Discovered ${data.total_discovered} devices on network`);
                notifyAutoInstall(data.discovered_devices);
            }
        })
        .catch(error => {
            console.error('Auto-discovery error:', error);
        });
    }, 30000);
}

function notifyAutoInstall(devices) {
    devices.forEach(device => {
        if (!device.has_app) {
            showDeviceNotification(`New device detected at ${device.ip}. Installation notification sent.`, 'info');
        }
    });
}

function shareDataWithAllDevices() {
    // Auto-share current quantum data with all connected devices
    const sharedData = {
        quantum_energy: 100,
        neural_sync: Math.floor(Math.random() * 100),
        matrix_stability: Math.floor(Math.random() * 100) + 50,
        timestamp: new Date().toISOString(),
        data_sharing: true,
        auto_sync: true
    };

    if (socket && socket.connected) {
        socket.emit('share_data_all_devices', sharedData);
    }
}

function checkAIUpdates() {
    // Check for AI assistant updates and security monitoring
    fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "security status update" })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.response.includes('ALERT')) {
            showDeviceNotification('🚨 Security Alert: ' + data.response, 'error');
        }
    })
    .catch(error => {
        console.error('AI update check failed:', error);
    });
}

// Initialize the Quantum Interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quantumInterface = new QuantumInterface();

    // Initialize Socket.IO
    initializeSocket();

    // Add event listeners for device management buttons
    const deviceSyncToggleBtn = document.getElementById('deviceSyncToggleBtn');
    if (deviceSyncToggleBtn) {
        deviceSyncToggleBtn.addEventListener('click', function() {
            fetch('/api/device-sync/toggle', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateSyncStatus(data.enabled);
                        showDeviceNotification(data.message, 'info');
                    }
                });
        });
    }

    const refreshDevicesBtn = document.getElementById('refreshDevicesBtn');
    if (refreshDevicesBtn) {
        refreshDevicesBtn.addEventListener('click', function() {
            loadConnectedDevices();
            showDeviceNotification('Devices refreshed', 'info');
        });
    }

    const scanDevicesBtn = document.getElementById('scanDevicesBtn');
    if (scanDevicesBtn) {
        scanDevicesBtn.addEventListener('click', function() {
            if (socket) {
                socket.emit('get_all_devices');
                showDeviceNotification('Scanning for devices...', 'info');
            }
        });
    }

    const syncAllDevicesBtn = document.getElementById('syncAllDevicesBtn');
    if (syncAllDevicesBtn) {
        syncAllDevicesBtn.addEventListener('click', function() {
            connectedDevices.forEach(device => {
                if (device.is_active) {
                    syncDevice(device.device_id);
                }
            });
        });
    }

    const broadcastActionBtn = document.getElementById('broadcastActionBtn');
    if (broadcastActionBtn) {
        broadcastActionBtn.addEventListener('click', function() {
            const action = prompt('Enter action to broadcast (activate, neural_scan, quantum_boost, security_scan):');
            if (action && socket) {
                connectedDevices.forEach(device => {
                    if (device.is_active) {
                        sendActionToDevice(device.device_id, action);
                    }
                });
            }
        });
    }

    const disconnectAllBtn = document.getElementById('disconnectAllBtn');
    if (disconnectAllBtn) {
        disconnectAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to disconnect all devices?')) {
                connectedDevices.forEach(device => {
                    disconnectDevice(device.device_id);
                });
            }
        });
    }

    // Update connection URL with current host
    const connectionUrlElement = document.getElementById('phoneConnectionUrl');
    if (connectionUrlElement) {
        const connectionUrl = `${window.location.protocol}//${window.location.host}`;
        connectionUrlElement.textContent = connectionUrl;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.quantumInterface) {
        window.quantumInterface.destroy();
    }
    if (socket) {
        socket.disconnect();
    }
});