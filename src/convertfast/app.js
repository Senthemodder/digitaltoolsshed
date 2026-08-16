/**
 * ConvertFast — Application Engine
 * Handles Theme, Drag & Drop, Live Studio Workbench GUI, Client-side Conversions & Category Filters.
 */

// 1. Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        theme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// Helper: Format Bytes
function formatBytes(bytes, decimals = 2) {
    if (!+bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Helper: Download File
function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// 2. Category Filter Tabs for Tool Grid
const filterTabs = document.querySelectorAll('.filter-tab');
const toolCards = document.querySelectorAll('#tool-grid .tool-card');

if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');

            toolCards.forEach(card => {
                const cardCat = card.getAttribute('data-cat');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 3. LIVE INTERACTIVE STUDIO WORKBENCH ENGINE
(function initStudioWorkbench() {
    const mainDropZone = document.getElementById('main-drop-zone');
    const mainFileInput = document.getElementById('main-file-input');
    const previewCard = document.getElementById('file-preview-card');
    const previewThumb = document.getElementById('preview-thumb');
    const previewFilename = document.getElementById('preview-filename');
    const previewFilesize = document.getElementById('preview-filesize');
    const previewFiletype = document.getElementById('preview-filetype');
    const btnRemoveFile = document.getElementById('btn-remove-file');

    const workbenchControls = document.getElementById('workbench-controls');
    const targetFormatGrid = document.getElementById('target-format-grid');
    const settingsGrid = document.getElementById('settings-grid');
    const actionBar = document.getElementById('action-bar');
    const btnConvertExecute = document.getElementById('btn-execute-convert');
    
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    const resultCard = document.getElementById('result-card');
    const savingsBadge = document.getElementById('savings-badge');
    const resultSummary = document.getElementById('result-summary');
    const resultPreviewBox = document.getElementById('result-preview-box');
    const btnDownloadResult = document.getElementById('btn-download-result');
    const btnCopyResult = document.getElementById('btn-copy-result');

    const studioWorkbench = document.getElementById('studio-workbench');
    const presetPills = document.querySelectorAll('.preset-pill');

    if (!mainDropZone || !mainFileInput) return;

    let currentFile = null;
    let fileCategory = 'image'; // 'image' or 'data'
    let selectedTargetFormat = '';
    let imageWidth = 0;
    let imageHeight = 0;
    let aspectRatio = 1;
    let lockAspect = true;
    let qualityVal = 85;
    let indentVal = 2;

    let convertedBlob = null;
    let convertedText = null;
    let convertedFilename = '';

    // Drag & Drop Setup
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        mainDropZone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
    });

    ['dragenter', 'dragover'].forEach(evt => {
        mainDropZone.addEventListener(evt, () => {
            mainDropZone.classList.add('dragover');
            if (studioWorkbench) studioWorkbench.classList.add('active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(evt => {
        mainDropZone.addEventListener(evt, () => {
            mainDropZone.classList.remove('dragover');
        }, false);
    });

    mainDropZone.addEventListener('click', () => mainFileInput.click());
    mainDropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    mainFileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            handleFileSelection(this.files[0]);
        }
    });

    if (btnRemoveFile) {
        btnRemoveFile.addEventListener('click', (e) => {
            e.stopPropagation();
            resetStudioState();
        });
    }

    // Preset Pills Listener
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const preset = pill.getAttribute('data-preset');
            if (preset === 'auto') return;

            // Trigger browse if no file selected yet
            if (!currentFile) {
                mainFileInput.click();
            } else {
                // Adjust target format if file loaded
                if (preset === 'png-webp') selectTargetFormat('WEBP');
                if (preset === 'jpg-png') selectTargetFormat('PNG');
                if (preset === 'json') selectTargetFormat('JSON FORMAT');
                if (preset === 'yaml') selectTargetFormat('YAML');
                if (preset === 'base64') selectTargetFormat('BASE64 ENCODE');
            }
        });
    });

    function handleFileSelection(file) {
        currentFile = file;
        resultCard.classList.remove('show');
        if (studioWorkbench) studioWorkbench.classList.add('active');

        // File Details
        previewFilename.textContent = file.name;
        previewFilesize.textContent = formatBytes(file.size);
        
        // Detect Type
        const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif)$/i.test(file.name);
        fileCategory = isImage ? 'image' : 'data';
        previewFiletype.textContent = isImage ? `Image (${file.type || 'Raster'})` : `Data/Text (${file.type || 'Plain'})`;

        // Render Preview Thumb
        if (isImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewThumb.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
                // Load dimensions
                const img = new Image();
                img.onload = function() {
                    imageWidth = img.width;
                    imageHeight = img.height;
                    aspectRatio = imageWidth / imageHeight;
                    renderSettingsControls();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            previewThumb.innerHTML = `📄`;
            renderSettingsControls();
        }

        // Show preview card, controls, action bar
        mainDropZone.style.display = 'none';
        previewCard.classList.add('show');
        workbenchControls.style.display = 'grid';
        actionBar.style.display = 'block';

        renderTargetFormatPills();
    }

    function resetStudioState() {
        currentFile = null;
        convertedBlob = null;
        convertedText = null;
        mainFileInput.value = '';
        
        mainDropZone.style.display = 'flex';
        previewCard.classList.remove('show');
        workbenchControls.style.display = 'none';
        actionBar.style.display = 'none';
        resultCard.classList.remove('show');
        if (studioWorkbench) studioWorkbench.classList.remove('active');
    }

    function renderTargetFormatPills() {
        targetFormatGrid.innerHTML = '';
        let formats = [];
        
        if (fileCategory === 'image') {
            formats = ['WEBP', 'PNG', 'JPG', 'SVG', 'RESIZE'];
            selectedTargetFormat = formats[0]; // Default WEBP
        } else {
            formats = ['JSON FORMAT', 'JSON MINIFY', 'YAML', 'BASE64 ENCODE', 'BASE64 DECODE'];
            selectedTargetFormat = formats[0];
        }

        formats.forEach((fmt, idx) => {
            const btn = document.createElement('button');
            btn.className = `target-pill ${idx === 0 ? 'selected' : ''}`;
            btn.textContent = fmt;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.target-pill').forEach(p => p.classList.remove('selected'));
                btn.classList.add('selected');
                selectTargetFormat(fmt);
            });
            targetFormatGrid.appendChild(btn);
        });

        renderSettingsControls();
    }

    function selectTargetFormat(fmt) {
        selectedTargetFormat = fmt;
        renderSettingsControls();
    }

    function renderSettingsControls() {
        settingsGrid.innerHTML = '';

        if (fileCategory === 'image') {
            if (['WEBP', 'JPG'].includes(selectedTargetFormat)) {
                // Quality Slider
                const row = document.createElement('div');
                row.className = 'setting-row';
                row.innerHTML = `
                    <span class="setting-label">Compression Quality</span>
                    <span class="setting-value" id="quality-disp">${qualityVal}%</span>
                    <input type="range" id="quality-slider" min="1" max="100" value="${qualityVal}">
                `;
                settingsGrid.appendChild(row);
                setTimeout(() => {
                    const slider = document.getElementById('quality-slider');
                    const disp = document.getElementById('quality-disp');
                    if (slider) {
                        slider.addEventListener('input', (e) => {
                            qualityVal = parseInt(e.target.value);
                            if (disp) disp.textContent = `${qualityVal}%`;
                        });
                    }
                }, 0);
            }

            if (selectedTargetFormat === 'RESIZE' || selectedTargetFormat === 'SVG') {
                // Width & Height Controls
                const row = document.createElement('div');
                row.className = 'setting-row';
                row.innerHTML = `
                    <span class="setting-label">Dimensions (W × H)</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <input type="number" id="input-w" class="input-num" value="${imageWidth}">
                        <span class="text-muted">×</span>
                        <input type="number" id="input-h" class="input-num" value="${imageHeight}">
                        <button id="btn-lock-aspect" style="font-size:1rem; padding:0.2rem;" title="Lock aspect ratio">${lockAspect ? '🔒' : '🔓'}</button>
                    </div>
                `;
                settingsGrid.appendChild(row);
                setTimeout(() => {
                    const inputW = document.getElementById('input-w');
                    const inputH = document.getElementById('input-h');
                    const btnLock = document.getElementById('btn-lock-aspect');

                    if (inputW && inputH) {
                        inputW.addEventListener('input', (e) => {
                            imageWidth = parseInt(e.target.value) || 0;
                            if (lockAspect && aspectRatio > 0) {
                                imageHeight = Math.round(imageWidth / aspectRatio);
                                inputH.value = imageHeight;
                            }
                        });
                        inputH.addEventListener('input', (e) => {
                            imageHeight = parseInt(e.target.value) || 0;
                            if (lockAspect && aspectRatio > 0) {
                                imageWidth = Math.round(imageHeight * aspectRatio);
                                inputW.value = imageWidth;
                            }
                        });
                    }
                    if (btnLock) {
                        btnLock.addEventListener('click', () => {
                            lockAspect = !lockAspect;
                            btnLock.textContent = lockAspect ? '🔒' : '🔓';
                        });
                    }
                }, 0);
            }
        } else {
            // Data Settings
            if (['JSON FORMAT', 'YAML'].includes(selectedTargetFormat)) {
                const row = document.createElement('div');
                row.className = 'setting-row';
                row.innerHTML = `
                    <span class="setting-label">Indentation</span>
                    <select id="indent-select" class="input-num" style="width:110px;">
                        <option value="2">2 Spaces</option>
                        <option value="4">4 Spaces</option>
                    </select>
                `;
                settingsGrid.appendChild(row);
                setTimeout(() => {
                    const sel = document.getElementById('indent-select');
                    if (sel) {
                        sel.value = indentVal;
                        sel.addEventListener('change', (e) => {
                            indentVal = parseInt(e.target.value);
                        });
                    }
                }, 0);
            }
        }
    }

    // Convert Execute Listener
    if (btnConvertExecute) {
        btnConvertExecute.addEventListener('click', executeConversion);
    }

    function executeConversion() {
        if (!currentFile) return;

        btnConvertExecute.disabled = true;

        // --- Open Sponsor Ad Modal ---
        const modalOverlay = document.getElementById('sponsor-modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const modalProgressBar = document.getElementById('modal-progress-bar');
        const modalStatusText = document.getElementById('modal-status-text');
        const modalActions = document.getElementById('modal-actions');
        const modalBtnDownload = document.getElementById('modal-btn-download');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        // Reset modal state
        modalTitle.textContent = '⚡ CONVERTING FILE...';
        modalSubtitle.textContent = 'Our sponsors make ConvertFast 100% free and private. Thank you for supporting free software!';
        modalProgressBar.style.width = '0%';
        modalStatusText.textContent = 'Processing file on your CPU... 0%';
        modalActions.style.display = 'none';
        modalCloseBtn.style.display = 'none';

        // Show modal
        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        window._modalOpenedAt = Date.now();

        // Animated progress steps (fake delay to show ad for ~4 seconds)
        const steps = [
            { pct: 15, text: 'Reading file data...', delay: 400 },
            { pct: 30, text: 'Analyzing format...', delay: 800 },
            { pct: 50, text: 'Converting...', delay: 1500 },
            { pct: 70, text: 'Encoding output...', delay: 2200 },
            { pct: 85, text: 'Optimizing result...', delay: 3000 },
        ];

        steps.forEach(step => {
            setTimeout(() => {
                modalProgressBar.style.width = step.pct + '%';
                modalStatusText.textContent = step.text + ' ' + step.pct + '%';
            }, step.delay);
        });

        // Run actual conversion after a short delay (lets the ad render)
        setTimeout(() => {
            if (fileCategory === 'image') {
                convertImageFile();
            } else {
                convertDataFile();
            }
        }, 800);
    }

    function finishConversion(outputBlob, outputText, ext) {
        convertedBlob = outputBlob;
        convertedText = outputText;

        const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
        convertedFilename = `${baseName}-converted.${ext}`;

        const modalOverlay = document.getElementById('sponsor-modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalSubtitle = document.getElementById('modal-subtitle');
        const modalProgressBar = document.getElementById('modal-progress-bar');
        const modalStatusText = document.getElementById('modal-status-text');
        const modalActions = document.getElementById('modal-actions');
        const modalBtnDownload = document.getElementById('modal-btn-download');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        // Ensure minimum ad display time (~3.5s from modal open)
        // The conversion itself is fast, so we pad to let the ad breathe
        const minAdDisplayMs = 3500;
        const timeSinceModalOpened = Date.now() - (window._modalOpenedAt || Date.now());
        const remainingWait = Math.max(0, minAdDisplayMs - timeSinceModalOpened);

        setTimeout(() => {
            // Complete progress
            modalProgressBar.style.width = '100%';
            modalStatusText.textContent = '✅ Conversion complete!';
            modalTitle.textContent = '✅ FILE READY';
            modalSubtitle.textContent = 'Your file has been converted successfully. Thank you for supporting ConvertFast!';

            // Show download button & close button inside modal
            modalActions.style.display = 'block';
            modalCloseBtn.style.display = 'block';

            // Wire modal download button
            modalBtnDownload.onclick = function() {
                if (convertedBlob) {
                    downloadFile(convertedBlob, convertedFilename);
                } else if (convertedText) {
                    const blob = new Blob([convertedText], { type: 'text/plain;charset=utf-8' });
                    downloadFile(blob, convertedFilename);
                }
            };

            // Wire modal close button
            modalCloseBtn.onclick = function() {
                closeModalAndShowResult();
            };

            // Also close if clicking overlay background
            modalOverlay.onclick = function(e) {
                if (e.target === modalOverlay) {
                    closeModalAndShowResult();
                }
            };
        }, remainingWait);

        function closeModalAndShowResult() {
            modalOverlay.classList.remove('show');
            document.body.style.overflow = '';
            btnConvertExecute.disabled = false;

            // Also populate the inline result card
            const originalSize = currentFile.size;
            const newSize = outputBlob ? outputBlob.size : (outputText ? new Blob([outputText]).size : 0);

            resultSummary.textContent = `Original: ${formatBytes(originalSize)} ➔ Converted: ${formatBytes(newSize)}`;

            if (newSize > 0 && originalSize > 0) {
                const diff = ((originalSize - newSize) / originalSize) * 100;
                if (diff > 0) {
                    savingsBadge.textContent = `-${diff.toFixed(1)}% SMALLER!`;
                    savingsBadge.style.display = 'inline-block';
                } else if (diff < 0) {
                    savingsBadge.textContent = `+${Math.abs(diff).toFixed(1)}% LARGER`;
                    savingsBadge.style.display = 'inline-block';
                } else {
                    savingsBadge.style.display = 'none';
                }
            } else {
                savingsBadge.style.display = 'none';
            }

            resultPreviewBox.innerHTML = '';
            if (outputBlob && outputBlob.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(outputBlob);
                resultPreviewBox.appendChild(img);
                btnCopyResult.style.display = 'none';
            } else if (outputText) {
                const pre = document.createElement('pre');
                pre.textContent = outputText.length > 2000 ? outputText.substring(0, 2000) + '\n... [Truncated Preview]' : outputText;
                resultPreviewBox.appendChild(pre);
                btnCopyResult.style.display = 'inline-block';
            }

            resultCard.classList.add('show');
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function convertImageFile() {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let targetW = imageWidth || img.width;
                let targetH = imageHeight || img.height;

                canvas.width = targetW;
                canvas.height = targetH;

                let mimeType = 'image/webp';
                let ext = 'webp';

                if (selectedTargetFormat === 'PNG') {
                    mimeType = 'image/png';
                    ext = 'png';
                    ctx.drawImage(img, 0, 0, targetW, targetH);
                } else if (selectedTargetFormat === 'JPG') {
                    mimeType = 'image/jpeg';
                    ext = 'jpg';
                    // Fill white background for JPG
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, targetW, targetH);
                    ctx.drawImage(img, 0, 0, targetW, targetH);
                } else if (selectedTargetFormat === 'SVG') {
                    mimeType = 'image/png';
                    ext = 'png';
                    ctx.drawImage(img, 0, 0, targetW, targetH);
                } else {
                    // WEBP or RESIZE
                    mimeType = 'image/webp';
                    ext = 'webp';
                    ctx.drawImage(img, 0, 0, targetW, targetH);
                }

                canvas.toBlob((blob) => {
                    finishConversion(blob, null, ext);
                }, mimeType, qualityVal / 100);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(currentFile);
    }

    function convertDataFile() {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            let outputText = '';
            let ext = 'txt';

            try {
                if (selectedTargetFormat === 'JSON FORMAT') {
                    const parsed = JSON.parse(content);
                    outputText = JSON.stringify(parsed, null, indentVal);
                    ext = 'json';
                } else if (selectedTargetFormat === 'JSON MINIFY') {
                    const parsed = JSON.parse(content);
                    outputText = JSON.stringify(parsed);
                    ext = 'json';
                } else if (selectedTargetFormat === 'YAML') {
                    const parsed = JSON.parse(content);
                    if (window.jsyaml) {
                        outputText = window.jsyaml.dump(parsed, { indent: indentVal });
                    } else {
                        outputText = JSON.stringify(parsed, null, indentVal);
                    }
                    ext = 'yaml';
                } else if (selectedTargetFormat === 'BASE64 ENCODE') {
                    outputText = btoa(content);
                    ext = 'txt';
                } else if (selectedTargetFormat === 'BASE64 DECODE') {
                    outputText = atob(content);
                    ext = 'txt';
                }
            } catch (err) {
                alert('Conversion Error: ' + err.message);
                btnConvertExecute.disabled = false;
                progressContainer.style.display = 'none';
                return;
            }

            const outputBlob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
            finishConversion(outputBlob, outputText, ext);
        };
        reader.readAsText(currentFile);
    }

    // Download & Copy Button Event Handlers
    if (btnDownloadResult) {
        btnDownloadResult.addEventListener('click', () => {
            if (convertedBlob) {
                downloadFile(convertedBlob, convertedFilename);
            } else if (convertedText) {
                const blob = new Blob([convertedText], { type: 'text/plain;charset=utf-8' });
                downloadFile(blob, convertedFilename);
            }
        });
    }

    if (btnCopyResult) {
        btnCopyResult.addEventListener('click', () => {
            if (convertedText) {
                navigator.clipboard.writeText(convertedText).then(() => {
                    const origText = btnCopyResult.textContent;
                    btnCopyResult.textContent = '✅ COPIED!';
                    setTimeout(() => { btnCopyResult.textContent = origText; }, 1500);
                });
            }
        });
    }
})();
