// Enhanced Poem Editor JavaScript

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize template selection
    initializeTemplates();
    
    // Load saved draft if exists
    loadSavedDraft();
    
    // Update poem preview on page load
    updatePoem();
}

function setupEventListeners() {
    // Real-time updates
    document.getElementById('poem-input').addEventListener('input', updatePoem);
    document.getElementById('poet-name').addEventListener('input', updatePoem);
    document.getElementById('poem-title').addEventListener('input', updatePoem);
    
    // Style controls
    document.getElementById('font-select').addEventListener('change', updatePoem);
    document.getElementById('font-color').addEventListener('change', updatePoem);
    document.getElementById('bg-color').addEventListener('change', updatePoem);
    document.getElementById('text-align').addEventListener('change', updatePoem);
    
    // Range sliders with live display
    const fontSizeSlider = document.getElementById('font-size');
    const lineHeightSlider = document.getElementById('line-height');
    
    fontSizeSlider.addEventListener('input', function() {
        document.getElementById('font-size-display').textContent = this.value + 'px';
        updatePoem();
    });
    
    lineHeightSlider.addEventListener('input', function() {
        document.getElementById('line-height-display').textContent = this.value;
        updatePoem();
    });
    
    // Modal close events
    const modal = document.getElementById('shareModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Auto-save functionality
    setInterval(autoSave, 30000); // Auto-save every 30 seconds
}

function initializeTemplates() {
    const templateOptions = document.querySelectorAll('.template-option');
    
    templateOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            templateOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Apply template
            applyTemplate(this.dataset.bg);
        });
    });
    
    // Set default template as active
    templateOptions[0].classList.add('active');
}

function updatePoem() {
    const poemText = document.getElementById('poem-input').value;
    const poetName = document.getElementById('poet-name').value;
    const poemTitle = document.getElementById('poem-title').value;
    const font = document.getElementById('font-select').value;
    const fontSize = document.getElementById('font-size').value;
    const lineHeight = document.getElementById('line-height').value;
    const fontColor = document.getElementById('font-color').value;
    const bgColor = document.getElementById('bg-color').value;
    const textAlign = document.getElementById('text-align').value;

    const poemDisplay = document.getElementById('poem-display');
    const titleElement = poemDisplay.querySelector('.poem-title');
    const contentElement = poemDisplay.querySelector('.poem-content');
    const signatureElement = poemDisplay.querySelector('.poet-signature');

    // Update styles
    poemDisplay.style.fontFamily = font;
    poemDisplay.style.fontSize = fontSize + 'px';
    poemDisplay.style.lineHeight = lineHeight;
    poemDisplay.style.color = fontColor;
    poemDisplay.style.textAlign = textAlign;
    
    // Only update background if no template is active
    const activeTemplate = document.querySelector('.template-option.active');
    if (activeTemplate && activeTemplate.dataset.bg === 'none') {
        poemDisplay.style.background = bgColor;
    }

    // Update content
    titleElement.textContent = poemTitle || '';
    titleElement.style.display = poemTitle ? 'block' : 'none';
    
    contentElement.textContent = poemText || 'Start writing to see your beautiful poem here...';
    
    signatureElement.textContent = poetName ? `~ ${poetName}` : '';
    signatureElement.style.display = poetName ? 'block' : 'none';
}

function applyTemplate(templateType) {
    const poemDisplay = document.getElementById('poem-display');
    
    // Remove all template classes
    poemDisplay.classList.remove('gradient1', 'gradient2', 'gradient3', 'gradient4', 'paper');
    
    // Apply new template
    if (templateType !== 'none') {
        poemDisplay.classList.add(templateType);
        poemDisplay.style.background = ''; // Clear inline background
    } else {
        // Apply current background color
        const bgColor = document.getElementById('bg-color').value;
        poemDisplay.style.background = bgColor;
    }
}

async function downloadPoem() {
    const poemWrapper = document.getElementById('poem-wrapper');
    const downloadBtn = document.querySelector('.btn-success');
    
    // Add loading state
    downloadBtn.classList.add('loading');
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    try {
        // Use html2canvas to capture the poem
        const canvas = await html2canvas(poemWrapper, {
            backgroundColor: null,
            scale: 2, // Higher quality
            useCORS: true,
            allowTaint: true
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `poem-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showNotification('Poem downloaded successfully!', 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('Download failed. Please try again.', 'error');
    } finally {
        // Remove loading state
        downloadBtn.classList.remove('loading');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download as Image';
    }
}

async function exportPDF() {
    const poemText = document.getElementById('poem-input').value;
    const poetName = document.getElementById('poet-name').value;
    const poemTitle = document.getElementById('poem-title').value;
    
    if (!poemText.trim()) {
        showNotification('Please write a poem first!', 'warning');
        return;
    }
    
    try {
        // Create a simple PDF content
        const pdfContent = `
${poemTitle ? poemTitle + '\n\n' : ''}${poemText}

${poetName ? '\n~ ' + poetName : ''}
        `;
        
        // Create a blob and download
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `poem-${Date.now()}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        showNotification('Poem exported as text file!', 'success');
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Export failed. Please try again.', 'error');
    }
}

function sharePoem() {
    const modal = document.getElementById('shareModal');
    modal.style.display = 'block';
}

function copyToClipboard() {
    const poemText = document.getElementById('poem-input').value;
    const poetName = document.getElementById('poet-name').value;
    const poemTitle = document.getElementById('poem-title').value;
    
    const fullText = `${poemTitle ? poemTitle + '\n\n' : ''}${poemText}${poetName ? '\n\n~ ' + poetName : ''}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        showNotification('Poem copied to clipboard!', 'success');
        document.getElementById('shareModal').style.display = 'none';
    }).catch(() => {
        showNotification('Failed to copy poem.', 'error');
    });
}

function shareTwitter() {
    const poemText = document.getElementById('poem-input').value;
    const poetName = document.getElementById('poet-name').value;
    const text = encodeURIComponent(`"${poemText}" ${poetName ? '~ ' + poetName : ''} #poetry #poem`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function shareFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareWhatsApp() {
    const poemText = document.getElementById('poem-input').value;
    const poetName = document.getElementById('poet-name').value;
    const text = encodeURIComponent(`${poemText}\n${poetName ? '~ ' + poetName : ''}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function savePoem() {
    const poemData = {
        text: document.getElementById('poem-input').value,
        title: document.getElementById('poem-title').value,
        poet: document.getElementById('poet-name').value,
        font: document.getElementById('font-select').value,
        fontSize: document.getElementById('font-size').value,
        lineHeight: document.getElementById('line-height').value,
        fontColor: document.getElementById('font-color').value,
        bgColor: document.getElementById('bg-color').value,
        textAlign: document.getElementById('text-align').value,
        template: document.querySelector('.template-option.active')?.dataset.bg || 'none',
        timestamp: Date.now()
    };
    
    localStorage.setItem('savedPoem', JSON.stringify(poemData));
    showNotification('Poem saved as draft!', 'success');
}

function loadPoem() {
    const savedPoem = localStorage.getItem('savedPoem');
    
    if (!savedPoem) {
        showNotification('No saved draft found.', 'warning');
        return;
    }
    
    try {
        const poemData = JSON.parse(savedPoem);
        
        // Load all the data
        document.getElementById('poem-input').value = poemData.text || '';
        document.getElementById('poem-title').value = poemData.title || '';
        document.getElementById('poet-name').value = poemData.poet || '';
        document.getElementById('font-select').value = poemData.font || 'Playfair Display';
        document.getElementById('font-size').value = poemData.fontSize || 18;
        document.getElementById('line-height').value = poemData.lineHeight || 1.6;
        document.getElementById('font-color').value = poemData.fontColor || '#2c3e50';
        document.getElementById('bg-color').value = poemData.bgColor || '#f8f9fa';
        document.getElementById('text-align').value = poemData.textAlign || 'center';
        
        // Update displays
        document.getElementById('font-size-display').textContent = poemData.fontSize + 'px';
        document.getElementById('line-height-display').textContent = poemData.lineHeight;
        
        // Apply template
        const templateOptions = document.querySelectorAll('.template-option');
        templateOptions.forEach(opt => opt.classList.remove('active'));
        
        const activeTemplate = document.querySelector(`[data-bg="${poemData.template}"]`);
        if (activeTemplate) {
            activeTemplate.classList.add('active');
            applyTemplate(poemData.template);
        }
        
        updatePoem();
        showNotification('Draft loaded successfully!', 'success');
    } catch (error) {
        console.error('Failed to load poem:', error);
        showNotification('Failed to load draft.', 'error');
    }
}

function resetPoem() {
    if (confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
        document.getElementById('poem-input').value = '';
        document.getElementById('poem-title').value = '';
        document.getElementById('poet-name').value = '';
        
        // Reset to defaults
        document.getElementById('font-select').value = 'Playfair Display';
        document.getElementById('font-size').value = 18;
        document.getElementById('line-height').value = 1.6;
        document.getElementById('font-color').value = '#2c3e50';
        document.getElementById('bg-color').value = '#f8f9fa';
        document.getElementById('text-align').value = 'center';
        
        // Update displays
        document.getElementById('font-size-display').textContent = '18px';
        document.getElementById('line-height-display').textContent = '1.6';
        
        // Reset templates
        const templateOptions = document.querySelectorAll('.template-option');
        templateOptions.forEach(opt => opt.classList.remove('active'));
        templateOptions[0].classList.add('active');
        applyTemplate('none');
        
        updatePoem();
        showNotification('Content cleared successfully!', 'success');
    }
}

function toggleFullscreen() {
    const poemWrapper = document.getElementById('poem-wrapper');
    
    if (poemWrapper.classList.contains('fullscreen')) {
        poemWrapper.classList.remove('fullscreen');
        document.body.style.overflow = 'auto';
    } else {
        poemWrapper.classList.add('fullscreen');
        document.body.style.overflow = 'hidden';
        
        // Add click to exit fullscreen
        poemWrapper.addEventListener('click', function exitFullscreen(e) {
            if (e.target === poemWrapper) {
                poemWrapper.classList.remove('fullscreen');
                document.body.style.overflow = 'auto';
                poemWrapper.removeEventListener('click', exitFullscreen);
            }
        });
    }
}

function autoSave() {
    const poemText = document.getElementById('poem-input').value;
    
    if (poemText.trim()) {
        const autoSaveData = {
            text: poemText,
            title: document.getElementById('poem-title').value,
            poet: document.getElementById('poet-name').value,
            timestamp: Date.now()
        };
        
        localStorage.setItem('autoSave', JSON.stringify(autoSaveData));
    }
}

function loadSavedDraft() {
    const autoSaveData = localStorage.getItem('autoSave');
    
    if (autoSaveData) {
        try {
            const data = JSON.parse(autoSaveData);
            const timeDiff = Date.now() - data.timestamp;
            
            // If auto-save is less than 1 hour old, show notification
            if (timeDiff < 3600000) {
                showNotification('Auto-saved draft detected. Click "Load Draft" to restore.', 'info');
            }
        } catch (error) {
            console.error('Failed to load auto-save:', error);
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        savePoem();
    }
    
    // Ctrl+O to load
    if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        loadPoem();
    }
    
    // Ctrl+D to download
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        downloadPoem();
    }
    
    // F11 for fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // Escape to exit fullscreen
    if (e.key === 'Escape') {
        const poemWrapper = document.getElementById('poem-wrapper');
        if (poemWrapper.classList.contains('fullscreen')) {
            poemWrapper.classList.remove('fullscreen');
            document.body.style.overflow = 'auto';
        }
    }
});

// Print functionality
function printPoem() {
    window.print();
}

// Add context menu for poem display
document.getElementById('poem-display').addEventListener('contextmenu', function(e) {
    e.preventDefault();
    
    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        padding: 8px 0;
        min-width: 150px;
    `;
    
    const menuItems = [
        { text: 'Copy Text', action: copyToClipboard },
        { text: 'Download Image', action: downloadPoem },
        { text: 'Print', action: printPoem },
        { text: 'Share', action: sharePoem }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#f3f4f6';
        });
        
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
        });
        
        menuItem.addEventListener('click', () => {
            item.action();
            document.body.removeChild(contextMenu);
        });
        
        contextMenu.appendChild(menuItem);
    });
    
    document.body.appendChild(contextMenu);
    
    // Remove menu when clicking elsewhere
    const removeMenu = (event) => {
        if (!contextMenu.contains(event.target)) {
            document.body.removeChild(contextMenu);
            document.removeEventListener('click', removeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', removeMenu);
    }, 100);
});
