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

    async updateMetrics() {
        try {
            const result = await this.makeRequest('/api/status', 'GET');
            
            // Update metrics display
            document.getElementById('activationCount').textContent = result.activation_count;
            document.getElementById('buildCount').textContent = result.build_count;
            document.getElementById('actionCount').textContent = result.total_actions;
            
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

// Initialize the Quantum Interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quantumInterface = new QuantumInterface();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.quantumInterface) {
        window.quantumInterface.destroy();
    }
});
