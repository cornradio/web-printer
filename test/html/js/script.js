        // --- Configuration & Constants ---
        const MM_TO_PX = 8; // 8 pixels per mm for preview (approx 203 DPI scale)
        const api = dtpweb.getInstance();

        // --- State ---
        let state = {
            paper: {
                width: parseInt(localStorage.getItem('dtp_paper_width')) || 40,
                height: parseInt(localStorage.getItem('dtp_paper_height')) || 30
            },
            items: [], // Array of { type: 'image'|'text', id, ...props }
            selectedId: null,
            zoom: 1.0, // Manual zoom multiplier
            autoScale: 1.0, // Calculated base scale to fit screen
            lastMousePos: { x: 0, y: 0 },
            isDragging: false,
            isResizing: false,
            isResizingWidth: false,
            crop: {
                active: false,
                targetId: null,
                rect: { x: 0, y: 0, w: 0, h: 0 },
                isDragging: false,
                handle: null,
                freeRatio: false
            },
            draggedId: null,
            clipboardItem: null // 存储复制的元素
        };

        // --- Initialization ---
        window.onload = () => {
            initApp();
            setupEventListeners();
            window.onresize = updateScale;
        };

        function initApp() {
            // Restore UI values from state
            document.getElementById('paperSizeInput').value = `${state.paper.width}x${state.paper.height}`;

            // 默认缩放为100%，不自动加载现实比例
            state.zoom = 1.0;
            updateScale();

            updatePaperUI();
            renderLayersList();
            renderRecentPaperSizes();

            api.checkPlugin((resp) => {
                if (resp.statusCode === 0) {
                    document.getElementById('printerStatus').innerText = '打印助手已就绪';
                    refreshPrinters();
                    loadSystemFonts();
                    refreshTplList();
                } else {
                    document.getElementById('printerStatus').innerText = '未检测到打印助手';
                    showStatus('请确保打印助手已启动', 'error');
                }
            });
        }

        function loadSystemFonts() {
            try {
                const fonts = api.getFontNames();
                const select = document.getElementById('fontFamilySelect');
                if (fonts && fonts.length > 0) {
                    // Get existing option values to avoid duplicates
                    const existingValues = Array.from(select.options).map(opt => opt.value);

                    // Add system fonts that don't already exist
                    fonts.forEach(font => {
                        if (!existingValues.includes(font)) {
                            const opt = document.createElement('option');
                            opt.value = font;
                            opt.text = font;
                            if (font === '微软雅黑' && !select.value) opt.selected = true;
                            select.appendChild(opt);
                        }
                    });
                }
            } catch (e) {
                console.log("Failed to load system fonts", e);
            }
        }

        // --- UI Updates ---
        function updatePaperUI() {
            const container = document.getElementById('paperContainer');
            const canvas = document.getElementById('previewCanvas');

            const wPx = state.paper.width * MM_TO_PX;
            const hPx = state.paper.height * MM_TO_PX;

            container.style.width = wPx + 'px';
            container.style.height = hPx + 'px';
            canvas.width = wPx;
            canvas.height = hPx;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, wPx, hPx);

            updateScale();
        }

        function updateScale() {
            const area = document.getElementById('previewArea');
            const container = document.getElementById('paperContainer');

            const availableW = area.clientWidth - 80;
            const availableH = area.clientHeight - 80;

            const scaleW = availableW / (state.paper.width * MM_TO_PX);
            const scaleH = availableH / (state.paper.height * MM_TO_PX);
            state.autoScale = Math.min(scaleW, scaleH, 2); // Max 2x base zoom

            const finalScale = state.autoScale * state.zoom;
            container.style.transform = `scale(${finalScale})`;

            // Update zoom UI - 精确到1%
            state.zoom = Math.round(state.zoom * 100) / 100; // 确保精确到0.01
            document.getElementById('zoomValue').innerText = Math.round(state.zoom * 100) + '%';
            document.getElementById('zoomRange').value = state.zoom;

            // 更新现实比例按钮提示
            const realityScaleBtn = document.getElementById('realityScaleBtn');
            if (realityScaleBtn) {
                const savedScale = localStorage.getItem('dtp_reality_scale');
                if (savedScale) {
                    const scale = parseFloat(savedScale);
                    realityScaleBtn.title = `点击缩放到现实比例 (${Math.round(scale * 100)}%)`;
                } else {
                    realityScaleBtn.title = '点击设置当前缩放比例为现实比例';
                }
            }
        }

        function showStatus(msg) {
            const bar = document.getElementById('statusBar');
            bar.innerText = msg;
            bar.classList.add('show');
            setTimeout(() => bar.classList.remove('show'), 3000);
        }

        function renderRecentPaperSizes() {
            const container = document.getElementById('recentPaperSizes');
            if (!container) return;
            container.innerHTML = '';

            const recents = JSON.parse(localStorage.getItem('dtp_recent_papers') || '["40x30", "40x40", "30x20", "50x30"]');

            recents.forEach(size => {
                const group = document.createElement('div');
                group.style.display = 'flex';
                group.style.alignItems = 'center';
                group.style.background = '#f1f5f9';
                group.style.borderRadius = '4px';
                group.style.overflow = 'hidden';
                group.style.border = '1px solid var(--border-color)';

                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.style.padding = '4px 8px';
                btn.style.fontSize = '11px';
                btn.style.border = 'none';
                btn.style.background = 'transparent';
                btn.innerText = size;
                btn.onclick = () => {
                    document.getElementById('paperSizeInput').value = size;
                    document.getElementById('applyPaperSize').click();
                };

                const del = document.createElement('div');
                del.innerText = '×';
                del.style.padding = '0 6px';
                del.style.fontSize = '12px';
                del.style.cursor = 'pointer';
                del.style.color = 'var(--text-muted)';
                del.style.borderLeft = '1px solid var(--border-color)';
                del.onclick = (e) => {
                    e.stopPropagation();
                    const newRecents = recents.filter(s => s !== size);
                    localStorage.setItem('dtp_recent_papers', JSON.stringify(newRecents));
                    renderRecentPaperSizes();
                };
                del.onmouseover = () => del.style.background = '#fee2e2';
                del.onmouseleave = () => del.style.background = 'transparent';

                group.appendChild(btn);
                group.appendChild(del);
                container.appendChild(group);
            });
        }

        function addRecentPaperSize(w, h) {
            const size = `${w}x${h}`;
            let recents = JSON.parse(localStorage.getItem('dtp_recent_papers') || '["40x30", "40x40", "30x20", "50x30"]');

            // Remove if exists and add to front
            recents = recents.filter(s => s !== size);
            recents.unshift(size);

            // Keep only top 6
            recents = recents.slice(0, 6);

            localStorage.setItem('dtp_recent_papers', JSON.stringify(recents));
            renderRecentPaperSizes();
        }

        // --- Image Loading ---
        function handleFile(file) {
            if (!file || !file.type.startsWith('image/')) {
                showStatus('请选择有效的图片文件');
                return;
            }

            showStatus('正在加载图片...');
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const id = 'img-' + Date.now();
                    const aspect = img.width / img.height;

                    // Default size: 50% of paper, centered
                    let w = state.paper.width * 0.5;
                    let h = w / aspect;

                    state.items.push({
                        type: 'image',
                        id: id,
                        originalImg: img,
                        workingImg: img,
                        x: (state.paper.width - w) / 2,
                        y: (state.paper.height - h) / 2,
                        w: w,
                        h: h,
                        ditherMode: 'atkinson',
                        threshold: 128,
                        exposure: 0,
                        invert: false,
                        isFlipped: false
                    });

                    state.selectedId = id;
                    renderAll();
                    document.getElementById('editControls').style.display = 'block';
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function resetImagePos() {
            const img = state.workingImg;
            const aspect = img.width / img.height;

            // Default size: 80% of paper, centered
            let w = state.paper.width * 0.8;
            let h = w / aspect;

            if (h > state.paper.height * 0.8) {
                h = state.paper.height * 0.8;
                w = h * aspect;
            }

            state.imagePos = {
                x: (state.paper.width - w) / 2,
                y: (state.paper.height - h) / 2,
                w: w,
                h: h
            };
        }

        // --- Rendering Logic ---
        function renderAll() {
            // Clear existing overlays
            document.querySelectorAll('.image-overlay, .text-overlay').forEach(el => el.remove());
            const container = document.getElementById('paperContainer');

            state.items.forEach(item => {
                if (item.type === 'image') {
                    renderImageItem(item, container);
                } else if (item.type === 'text') {
                    renderTextItem(item, container);
                }
            });

            updateControlPanel();
            renderLayersList();

            // Update layer count badge
            const badge = document.getElementById('layerCountBadge');
            if (state.items.length > 0) {
                badge.innerText = state.items.length;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        function renderLayersList() {
            const list = document.getElementById('layersList');
            if (!list) return;
            list.innerHTML = '';

            // Show layers in reverse order (top of array = top of list = top in preview)
            const reversedItems = [...state.items].reverse();

            reversedItems.forEach((item, index) => {
                const actualIndex = state.items.length - 1 - index;
                const div = document.createElement('div');
                div.className = 'layer-item';
                div.draggable = true;
                if (state.selectedId === item.id) div.classList.add('selected');
                if (state.draggedId === item.id) div.classList.add('dragging');

                let name = item.type === 'image' ? '图片' : item.text.trim();
                if (name.length > 15) name = name.substring(0, 15) + '...';
                if (!name) name = '(空文字)';

                div.innerHTML = `
                    <div class="layer-thumb" id="thumb-${item.id}"></div>
                    <div class="layer-info">
                        <span class="layer-name">${name}</span>
                        <span class="layer-type">${item.type === 'image' ? 'Image' : 'Text'}</span>
                    </div>
                    <div class="layer-actions">
                        <button class="layer-btn" id="duplicate-layer-${item.id}" title="复制图层">📋</button>
                        <button class="layer-btn" id="delete-layer-${item.id}" title="删除">🗑️</button>
                    </div>
                `;

                // Render thumbnail
                setTimeout(() => renderLayerThumbnail(item), 0);

                div.onclick = (e) => {
                    if (e.target.closest('.layer-btn')) return;
                    state.selectedId = item.id;
                    renderAll();
                };

                // Drag and Drop events
                div.ondragstart = (e) => {
                    state.draggedId = item.id;
                    div.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', item.id);
                };

                div.ondragend = (e) => {
                    state.draggedId = null;
                    div.classList.remove('dragging');
                    document.querySelectorAll('.layer-item').forEach(el => el.classList.remove('drag-over'));
                };

                div.ondragover = (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const target = e.target.closest('.layer-item');
                    if (target && state.draggedId !== item.id) {
                        const rect = target.getBoundingClientRect();
                        const isAfter = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                        target.classList.remove('drag-over-top', 'drag-over-bottom');
                        target.classList.add(isAfter ? 'drag-over-bottom' : 'drag-over-top');
                    }
                };

                div.ondragleave = (e) => {
                    const target = e.target.closest('.layer-item');
                    if (target) {
                        target.classList.remove('drag-over-top', 'drag-over-bottom');
                    }
                };

                div.ondrop = (e) => {
                    e.preventDefault();
                    const draggedId = e.dataTransfer.getData('text/plain');
                    if (draggedId !== item.id) {
                        const rect = div.getBoundingClientRect();
                        const isAfter = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                        moveLayerTo(draggedId, item.id, isAfter);
                    }
                };

                div.querySelector(`#delete-layer-${item.id}`).onclick = (e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                };

                div.querySelector(`#duplicate-layer-${item.id}`).onclick = (e) => {
                    e.stopPropagation();
                    duplicateItem(item.id);
                };

                list.appendChild(div);
            });
        }

        function renderLayerThumbnail(item) {
            const thumbContainer = document.getElementById(`thumb-${item.id}`);
            if (!thumbContainer) return;

            if (item.type === 'image') {
                const img = new Image();
                img.src = item.workingImg.src;
                thumbContainer.appendChild(img);
            } else if (item.type === 'text') {
                const canvas = document.createElement('canvas');
                canvas.width = 40;
                canvas.height = 40;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(0, 0, 40, 40);
                ctx.fillStyle = item.color === 'white' ? '#ccc' : 'black';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('T', 20, 20);
                thumbContainer.appendChild(canvas);
            }
        }

        function moveLayerTo(draggedId, targetId, isAfter) {
            const draggedIdx = state.items.findIndex(i => i.id === draggedId);
            const targetIdx = state.items.findIndex(i => i.id === targetId);

            if (draggedIdx === -1 || targetIdx === -1) return;

            const item = state.items.splice(draggedIdx, 1)[0];
            const newTargetIdx = state.items.findIndex(i => i.id === targetId);

            // In the UI list (reversed), moving to the "bottom half" (isAfter=true) 
            // means moving it towards the start of the state.items array.
            const finalIdx = isAfter ? newTargetIdx : newTargetIdx + 1;
            state.items.splice(finalIdx, 0, item);

            renderAll();
        }

        function renderImageItem(item, container) {
            const div = document.createElement('div');
            div.className = 'image-overlay';
            div.id = item.id;
            if (state.selectedId === item.id) div.classList.add('selected');

            const wPx = item.w * MM_TO_PX;
            const hPx = item.h * MM_TO_PX;

            div.style.width = wPx + 'px';
            div.style.height = hPx + 'px';
            div.style.left = (item.x * MM_TO_PX) + 'px';
            div.style.top = (item.y * MM_TO_PX) + 'px';

            const canvas = document.createElement('canvas');
            canvas.width = wPx;
            canvas.height = hPx;
            div.appendChild(canvas);

            const handle = document.createElement('div');
            handle.className = 'resize-handle';
            handle.id = 'resize-' + item.id;
            div.appendChild(handle);

            const del = document.createElement('div');
            del.className = 'delete-handle';
            del.innerText = '×';
            del.onmousedown = (e) => {
                deleteItem(item.id);
                e.stopPropagation();
            };
            div.appendChild(del);

            div.onmousedown = (e) => {
                state.selectedId = item.id;
                state.isResizing = e.target.id.startsWith('resize-');
                state.isDragging = !state.isResizing;
                state.lastMousePos = { x: e.clientX, y: e.clientY };
                renderAll();
                e.stopPropagation();
            };

            container.appendChild(div);

            // Process image
            const ctx = canvas.getContext('2d');
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = wPx; tempCanvas.height = hPx;
            const tempCtx = tempCanvas.getContext('2d');

            if (item.isFlipped) {
                tempCtx.translate(wPx, 0);
                tempCtx.scale(-1, 1);
            }
            tempCtx.drawImage(item.workingImg, 0, 0, wPx, hPx);

            const imageData = tempCtx.getImageData(0, 0, wPx, hPx);
            applyDitheringToItem(imageData, item);
            ctx.putImageData(imageData, 0, 0);
        }

        function renderTextItem(item, container) {
            const div = document.createElement('div');
            div.className = 'text-overlay';
            div.id = item.id;
            if (state.selectedId === item.id) div.classList.add('selected');

            const dpi = MM_TO_PX;
            const fontSize = item.size * dpi;
            const maxWidth = (item.w || 30) * dpi;

            // Temporary canvas to measure and draw text exactly as it will be printed
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // First pass to get height
            const textHeight = drawWrappedText(ctx, item, dpi);

            canvas.width = maxWidth;
            canvas.height = textHeight;

            // Second pass to actually draw
            drawWrappedText(ctx, item, dpi);

            div.style.left = (item.x * dpi) + 'px';
            div.style.top = (item.y * dpi) + 'px';
            div.style.width = maxWidth + 'px';
            div.style.height = textHeight + 'px';
            div.style.transform = `rotate(${item.orientation || 0}deg)`;
            div.style.transformOrigin = '0 0';

            // Add a handle for resizing width
            const resizeH = document.createElement('div');
            resizeH.className = 'resize-handle';
            resizeH.style.right = '-6px';
            resizeH.style.bottom = '50%';
            resizeH.style.marginTop = '-6px';
            resizeH.style.cursor = 'ew-resize';
            resizeH.id = 'resize-width-' + item.id;
            div.appendChild(resizeH);

            const displayCanvas = document.createElement('canvas');
            displayCanvas.width = maxWidth;
            displayCanvas.height = textHeight;
            displayCanvas.style.width = '100%';
            displayCanvas.style.height = '100%';
            const dCtx = displayCanvas.getContext('2d');
            dCtx.drawImage(canvas, 0, 0);
            div.appendChild(displayCanvas);

            const del = document.createElement('div');
            del.className = 'delete-handle';
            del.innerText = '×';
            del.onmousedown = (e) => {
                deleteItem(item.id);
                e.stopPropagation();
            };
            div.appendChild(del);

            div.onmousedown = (e) => {
                state.selectedId = item.id;
                state.isResizingWidth = e.target.id.startsWith('resize-width-');
                state.isDragging = !state.isResizingWidth;
                state.lastMousePos = { x: e.clientX, y: e.clientY };
                renderAll();
                e.stopPropagation();
            };

            container.appendChild(div);
        }

        function updateControlPanel() {
            const item = state.items.find(i => i.id === state.selectedId);
            const imgControls = document.getElementById('editControls');
            const ditherControls = document.getElementById('ditherModeControl').parentElement.parentElement;
            const textStyleControls = document.getElementById('textStyleControls');

            if (item && item.type === 'image') {
                imgControls.style.display = 'block';
                ditherControls.style.display = 'block';
                textStyleControls.style.display = 'none';
                // Sync values
                document.getElementById('ditherMode').value = item.ditherMode;
                document.getElementById('exposureRange').value = item.exposure;
                document.getElementById('exposureValue').innerText = item.exposure;
                document.getElementById('thresholdRange').value = item.threshold;
                document.getElementById('thresholdValue').innerText = item.threshold;
                document.getElementById('invertColors').checked = item.invert;
                document.getElementById('thresholdControl').style.display =
                    item.ditherMode === 'threshold' ? 'block' : 'none';
            } else if (item && item.type === 'text') {
                imgControls.style.display = 'none';
                ditherControls.style.display = 'none';
                textStyleControls.style.display = 'block';
                // Sync text styles
                document.getElementById('fontFamilySelect').value = item.fontFamily;
                const colorRadios = document.getElementsByName('textColor');
                colorRadios.forEach(r => r.checked = r.value === (item.color || 'black'));
                const boldBtn = document.getElementById('boldToggleBtn');
                if (item.isBold) boldBtn.classList.add('btn-primary');
                else boldBtn.classList.remove('btn-primary');
            } else {
                imgControls.style.display = 'none';
                textStyleControls.style.display = 'none';
                if (!item) ditherControls.style.display = 'none';
            }
        }

        function deleteItem(id) {
            state.items = state.items.filter(i => i.id !== id);
            if (state.selectedId === id) state.selectedId = null;
            renderAll();
        }

        function clearAllItems() {
            if (confirm('确定要清空所有元素吗？此操作不可撤销。')) {
                state.items = [];
                state.selectedId = null;
                renderAll();
                showStatus('已清空所有元素');
            }
        }

        function drawWrappedText(ctx, item, dpi) {
            const fontSize = item.size * dpi;
            // Ensure font family is quoted if it contains spaces and isn't already quoted
            const fontFamily = (item.fontFamily.includes(' ') && !item.fontFamily.includes("'") && !item.fontFamily.includes('"'))
                ? `"${item.fontFamily}"`
                : item.fontFamily;

            ctx.font = `${item.isBold ? 'bold' : ''} ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = item.color || 'black';
            ctx.textBaseline = 'top';

            const maxWidth = (item.w || 30) * dpi;
            const paragraphs = item.text.split('\n');
            const lines = [];

            paragraphs.forEach(p => {
                let currentLine = '';
                for (let i = 0; i < p.length; i++) {
                    const char = p[i];
                    const testLine = currentLine + char;
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = char;
                    } else {
                        currentLine = testLine;
                    }
                }
                lines.push(currentLine);
            });

            lines.forEach((line, index) => {
                // Add a small 0.15 * fontSize padding to the top to prevent clipping
                ctx.fillText(line, 0, (index * fontSize * 1.2) + (fontSize * 0.15));
            });

            // Return total height with a bit more buffer (1.4 instead of 1.3)
            return lines.length * fontSize * 1.2 + (fontSize * 0.3);
        }

        function duplicateItem(id) {
            const index = state.items.findIndex(i => i.id === id);
            if (index === -1) return;

            const original = state.items[index];
            const newItem = { ...original };

            // Generate new ID
            newItem.id = (original.type === 'image' ? 'img-' : 'text-') + Date.now() + '-' + Math.floor(Math.random() * 1000);

            // Offset position slightly
            newItem.x += 2;
            newItem.y += 2;

            // Insert after the original (on top in the preview)
            state.items.splice(index + 1, 0, newItem);
            state.selectedId = newItem.id;
            renderAll();
            showStatus('已复制图层');
        }

        // 复制元素到剪贴板
        function copyItemToClipboard(id) {
            const item = state.items.find(i => i.id === id);
            if (!item) return;

            // 深拷贝元素，包括图片对象
            const copiedItem = JSON.parse(JSON.stringify(item));

            // 对于图片类型，需要重新创建Image对象
            if (item.type === 'image') {
                // 将图片转换为dataURL以便后续恢复
                const canvas = document.createElement('canvas');
                canvas.width = item.workingImg.width;
                canvas.height = item.workingImg.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(item.workingImg, 0, 0);
                copiedItem.imageDataUrl = canvas.toDataURL('image/png');
            }

            state.clipboardItem = copiedItem;
            showStatus('已复制到剪贴板');
        }

        // 计算文字高度（单位：毫米）
        function calculateTextHeight(item) {
            const dpi = MM_TO_PX;
            const fontSize = item.size * dpi;
            const maxWidth = (item.w || 30) * dpi;

            // 创建临时 canvas 来测量文字
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const fontFamily = (item.fontFamily.includes(' ') && !item.fontFamily.includes("'") && !item.fontFamily.includes('"'))
                ? `"${item.fontFamily}"`
                : item.fontFamily;
            ctx.font = `${item.isBold ? 'bold' : ''} ${fontSize}px ${fontFamily}`;

            const paragraphs = item.text.split('\n');
            const lines = [];

            paragraphs.forEach(p => {
                let currentLine = '';
                for (let i = 0; i < p.length; i++) {
                    const char = p[i];
                    const testLine = currentLine + char;
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > maxWidth && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = char;
                    } else {
                        currentLine = testLine;
                    }
                }
                lines.push(currentLine);
            });

            // 计算总高度（像素），然后转换为毫米
            const heightPx = lines.length * fontSize * 1.2 + (fontSize * 0.3);
            return heightPx / dpi; // 转换为毫米
        }

        // 复制元素并放置在原图下面（不重叠）
        function duplicateItemBelow(id) {
            const index = state.items.findIndex(i => i.id === id);
            if (index === -1) return;

            const original = state.items[index];
            const newItem = { ...original };

            // Generate new ID
            newItem.id = (original.type === 'image' ? 'img-' : 'text-') + Date.now() + '-' + Math.floor(Math.random() * 1000);

            if (original.type === 'text') {
                // 针对文字的特殊处理
                // 计算原文字的高度
                const textHeight = calculateTextHeight(original);

                // 位置放在原文字下面，使用计算出的高度作为偏移
                newItem.x = original.x;
                newItem.y = original.y + textHeight + 1; // 加1mm间距，避免重叠

                // 确保不超出纸张范围，如果超出则放在纸张内部
                const newTextHeight = calculateTextHeight(newItem);
                if (newItem.y + newTextHeight > state.paper.height) {
                    // 如果超出，尝试放在原文字上方
                    if (original.y - textHeight - 1 >= 0) {
                        newItem.y = original.y - textHeight - 1;
                    } else {
                        // 如果上方也放不下，就放在纸张顶部
                        newItem.y = Math.max(0, state.paper.height - newTextHeight);
                    }
                }
            } else {
                // 针对图片的处理（保持原有逻辑）
                newItem.x = original.x;
                newItem.y = original.y + (original.h || 0); // 放在原图正下方

                // 确保不超出纸张范围
                if (newItem.y + (newItem.h || 0) > state.paper.height) {
                    newItem.y = Math.max(0, state.paper.height - (newItem.h || 0));
                }
            }

            // Insert after the original (on top in the preview)
            state.items.splice(index + 1, 0, newItem);
            state.selectedId = newItem.id;
            renderAll();
            showStatus('已复制并放置');
        }

        function applyDitheringToItem(imageData, item) {
            const data = imageData.data;
            const w = imageData.width;
            const h = imageData.height;
            const exposureFactor = (item.exposure + 100) / 100;

            const getGray = (i) => {
                let r = Math.min(255, data[i] * exposureFactor);
                let g = Math.min(255, data[i + 1] * exposureFactor);
                let b = Math.min(255, data[i + 2] * exposureFactor);
                let gray = 0.299 * r + 0.587 * g + 0.114 * b;
                return item.invert ? 255 - gray : gray;
            };

            if (item.ditherMode === 'threshold') {
                for (let i = 0; i < data.length; i += 4) {
                    const v = getGray(i) >= item.threshold ? 255 : 0;
                    data[i] = data[i + 1] = data[i + 2] = v;
                }
            } else if (item.ditherMode === 'floyd-steinberg') {
                const gray = new Float32Array(w * h);
                for (let i = 0; i < data.length; i += 4) gray[i / 4] = getGray(i);
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const idx = y * w + x;
                        const oldPixel = gray[idx];
                        const newPixel = oldPixel >= 128 ? 255 : 0;
                        const error = oldPixel - newPixel;
                        gray[idx] = newPixel;
                        if (x + 1 < w) gray[idx + 1] += error * 7 / 16;
                        if (y + 1 < h) {
                            if (x > 0) gray[idx + w - 1] += error * 3 / 16;
                            gray[idx + w] += error * 5 / 16;
                            if (x + 1 < w) gray[idx + w + 1] += error * 1 / 16;
                        }
                    }
                }
                for (let i = 0; i < gray.length; i++) data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = gray[i];
            } else if (item.ditherMode === 'atkinson') {
                const gray = new Float32Array(w * h);
                for (let i = 0; i < data.length; i += 4) gray[i / 4] = getGray(i);
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const idx = y * w + x;
                        const oldP = gray[idx];
                        const newP = oldP >= 128 ? 255 : 0;
                        const err = (oldP - newP) / 8;
                        gray[idx] = newP;
                        if (x + 1 < w) gray[idx + 1] += err;
                        if (x + 2 < w) gray[idx + 2] += err;
                        if (y + 1 < h) {
                            if (x > 0) gray[idx + w - 1] += err;
                            gray[idx + w] += err;
                            if (x + 1 < w) gray[idx + w + 1] += err;
                        }
                        if (y + 2 < h) gray[idx + 2 * w] += err;
                    }
                }
                for (let i = 0; i < gray.length; i++) data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = gray[i];
            } else if (item.ditherMode === 'bayer') {
                const bayer = [
                    [0, 32, 8, 40, 2, 34, 10, 42],
                    [48, 16, 56, 24, 50, 18, 58, 26],
                    [12, 44, 4, 36, 14, 46, 6, 38],
                    [60, 28, 52, 20, 62, 30, 54, 22],
                    [3, 35, 11, 43, 1, 33, 9, 41],
                    [51, 19, 59, 27, 49, 17, 57, 25],
                    [15, 47, 7, 39, 13, 45, 5, 37],
                    [63, 31, 55, 23, 61, 29, 53, 21]
                ];
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const i = (y * w + x) * 4;
                        const g = getGray(i);
                        const v = (g / 4) > bayer[y % 8][x % 8] ? 255 : 0;
                        data[i] = data[i + 1] = data[i + 2] = v;
                    }
                }
            }
        }

        // --- Cropping Logic ---
        function startCrop(item) {
            const modal = document.getElementById('cropModal');
            const canvas = document.getElementById('cropCanvas');
            const ctx = canvas.getContext('2d');

            canvas.width = item.workingImg.width;
            canvas.height = item.workingImg.height;
            ctx.drawImage(item.workingImg, 0, 0);

            // Initial crop rect: locked to paper aspect ratio, 80% size
            const paperAspect = state.paper.width / state.paper.height;
            const imgAspect = item.workingImg.width / item.workingImg.height;

            let w, h;
            if (imgAspect > paperAspect) {
                h = item.workingImg.height * 0.8;
                w = h * paperAspect;
            } else {
                w = item.workingImg.width * 0.8;
                h = w / paperAspect;
            }

            state.crop.targetId = item.id;
            state.crop.rect = {
                x: (item.workingImg.width - w) / 2,
                y: (item.workingImg.height - h) / 2,
                w: w,
                h: h
            };

            state.crop.freeRatio = false;
            const freeRatioBtn = document.getElementById('freeRatioBtn');
            freeRatioBtn.classList.remove('btn-primary');
            freeRatioBtn.textContent = '自由比例';

            state.crop.active = true;
            modal.style.display = 'flex';
            drawCropOverlay();
        }

        function drawCropOverlay() {
            const canvas = document.getElementById('cropCanvas');
            const ctx = canvas.getContext('2d');
            const item = state.items.find(i => i.id === state.crop.targetId);
            const r = state.crop.rect;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(item.workingImg, 0, 0);

            // Dim background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            // Counter-clockwise hole
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x, r.y + r.h);
            ctx.lineTo(r.x + r.w, r.y + r.h);
            ctx.lineTo(r.x + r.w, r.y);
            ctx.closePath();
            ctx.fill();

            // Stroke border
            ctx.strokeStyle = '#2563eb';
            ctx.lineWidth = 2 * (canvas.width / canvas.clientWidth); // Consistent screen width
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(r.x, r.y, r.w, r.h);
            ctx.setLineDash([]);

            // Draw handles
            const handleSize = 10 * (canvas.width / canvas.clientWidth);
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(r.x - handleSize / 2, r.y - handleSize / 2, handleSize, handleSize); // TL
            ctx.fillRect(r.x + r.w - handleSize / 2, r.y - handleSize / 2, handleSize, handleSize); // TR
            ctx.fillRect(r.x - handleSize / 2, r.y + r.h - handleSize / 2, handleSize, handleSize); // BL
            ctx.fillRect(r.x + r.w - handleSize / 2, r.y + r.h - handleSize / 2, handleSize, handleSize); // BR
        }

        // --- Event Listeners ---
        function setupEventListeners() {
            // Paper size
            document.getElementById('applyPaperSize').onclick = () => {
                const input = document.getElementById('paperSizeInput').value.trim().toLowerCase();
                const match = input.match(/^(\d+)[x\*](\d+)$/);

                if (!match) {
                    showStatus('尺寸格式错误 (例如: 40x30)', 'error');
                    return;
                }

                const w = parseInt(match[1]);
                const h = parseInt(match[2]);

                if (w < 10 || w > 100 || h < 10 || h > 150) {
                    showStatus('尺寸超出范围 (宽10-100, 高10-150)', 'error');
                    return;
                }

                state.paper.width = w;
                state.paper.height = h;

                // Save to localStorage
                localStorage.setItem('dtp_paper_width', w);
                localStorage.setItem('dtp_paper_height', h);

                // Save to recent sizes
                addRecentPaperSize(w, h);

                updatePaperUI();
                renderAll();
                showStatus('纸张尺寸已应用');
            };

            // File input
            document.getElementById('dropZone').onclick = () => document.getElementById('fileInput').click();
            document.getElementById('fileInput').onchange = (e) => handleFile(e.target.files[0]);

            // Drag & Drop
            const dz = document.getElementById('dropZone');
            dz.ondragover = (e) => { e.preventDefault(); dz.classList.add('drag-over'); };
            dz.ondragleave = () => dz.classList.remove('drag-over');
            dz.ondrop = (e) => {
                e.preventDefault();
                dz.classList.remove('drag-over');
                if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
            };

            // Global Drag & Drop for the whole page
            window.ondragover = (e) => e.preventDefault();
            window.ondrop = (e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
            };

            // Paste support
            document.addEventListener('paste', (e) => {
                const data = e.clipboardData || window.clipboardData;
                if (!data || !data.items) return;

                const items = data.items;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.indexOf('image') !== -1) {
                        const blob = item.getAsFile();
                        if (blob) {
                            handleFile(blob);
                            e.preventDefault(); // Prevent default only if we found an image
                            break;
                        }
                    }
                }
            });

            // Edit controls
            document.getElementById('startCropBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;
                startCrop(item);
            };
            document.getElementById('rotateBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;

                const canvas = document.createElement('canvas');
                canvas.width = item.workingImg.height;
                canvas.height = item.workingImg.width;
                const ctx = canvas.getContext('2d');

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(item.workingImg, -item.workingImg.width / 2, -item.workingImg.height / 2);

                const newImg = new Image();
                newImg.onload = () => {
                    item.workingImg = newImg;
                    // Swap w and h
                    const oldW = item.w;
                    item.w = item.h;
                    item.h = oldW;
                    renderAll();
                };
                newImg.src = canvas.toDataURL();
            };
            document.getElementById('fitToPaperBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;

                const aspect = item.workingImg.width / item.workingImg.height;
                const paperAspect = state.paper.width / state.paper.height;

                if (aspect > paperAspect) {
                    item.w = state.paper.width;
                    item.h = state.paper.width / aspect;
                } else {
                    item.h = state.paper.height;
                    item.w = state.paper.height * aspect;
                }
                item.x = (state.paper.width - item.w) / 2;
                item.y = (state.paper.height - item.h) / 2;
                renderAll();
            };
            document.getElementById('resetImageBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;

                item.workingImg = item.originalImg;
                const aspect = item.workingImg.width / item.workingImg.height;
                item.w = state.paper.width * 0.5;
                item.h = item.w / aspect;
                item.isFlipped = false;
                renderAll();
            };

            document.getElementById('mirrorFlipBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;
                item.isFlipped = !item.isFlipped;
                renderAll();
            };

            document.getElementById('ditherMode').onchange = (e) => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;
                item.ditherMode = e.target.value;
                renderAll();
            };

            document.getElementById('thresholdRange').oninput = (e) => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;
                item.threshold = parseInt(e.target.value);
                document.getElementById('thresholdValue').innerText = item.threshold;
                renderAll();
            };
            document.getElementById('exposureRange').oninput = (e) => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;
                item.exposure = parseInt(e.target.value);
                document.getElementById('exposureValue').innerText = item.exposure;
                renderAll();
            };
            document.getElementById('invertColors').onchange = (e) => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (!item || item.type !== 'image') return;
                item.invert = e.target.checked;
                renderAll();
            };

            // Printer refresh
            refreshPrinters();

            // Logo Search & QR Code logic
            const toggleDropdown = (id) => {
                const dropdowns = ['infoTooltip', 'searchModal', 'qrModal', 'bgModal', 'aiModal'];
                dropdowns.forEach(dId => {
                    const el = document.getElementById(dId);
                    if (dId === id) {
                        el.classList.toggle('show');
                        if (el.classList.contains('show')) {
                            const input = el.querySelector('input, textarea');
                            if (input) setTimeout(() => input.focus(), 100);
                        }
                    } else {
                        el.classList.remove('show');
                    }
                });

                const infoBtn = document.getElementById('infoBtn');
                if (id === 'infoTooltip' && document.getElementById('infoTooltip').classList.contains('show')) {
                    infoBtn.classList.add('active');
                } else {
                    infoBtn.classList.remove('active');
                }
            };

            document.getElementById('layerToggleBtn').onclick = (e) => {
                const sidebar = document.getElementById('layersSidebar');
                const btn = document.getElementById('layerToggleBtn');
                sidebar.classList.toggle('show');
                btn.classList.toggle('active');
                e.stopPropagation();
            };

            document.getElementById('aiToolsBtn').onclick = (e) => {
                toggleDropdown('aiModal');
                e.stopPropagation();
            };

            document.getElementById('searchLogoBtn').onclick = (e) => {
                toggleDropdown('searchModal');
                e.stopPropagation();
            };

            document.getElementById('createQRBtn').onclick = (e) => {
                toggleDropdown('qrModal');
                e.stopPropagation();
            };

            document.getElementById('removeBgBtn').onclick = (e) => {
                toggleDropdown('bgModal');
                e.stopPropagation();
            };

            document.getElementById('infoBtn').onclick = (e) => {
                toggleDropdown('infoTooltip');
                e.stopPropagation();
            };

            document.getElementById('showShortcutsBtn').onclick = () => {
                document.getElementById('shortcutModal').style.display = 'flex';
                toggleDropdown(null);
            };

            // Global click to close dropdowns
            window.addEventListener('click', (e) => {
                if (!e.target.closest('.header-dropdown') && !e.target.closest('.info-tooltip')) {
                    toggleDropdown(null);
                }

                // Also close layers sidebar if clicking elsewhere (and not on the toggle button)
                const sidebar = document.getElementById('layersSidebar');
                const btn = document.getElementById('layerToggleBtn');
                if (sidebar.classList.contains('show') &&
                    !e.target.closest('#layersSidebar') &&
                    !e.target.closest('#layerToggleBtn')) {
                    sidebar.classList.remove('show');
                    btn.classList.remove('active');
                }
            });

            // Prevent dropdowns from closing when clicking inside them
            document.querySelectorAll('.header-dropdown, .info-tooltip, .layers-sidebar').forEach(el => {
                el.onclick = (e) => e.stopPropagation();
            });

            const performSearch = (engine) => {
                const brand = document.getElementById('logoSearchInput').value.trim();
                if (!brand) return;
                const query = encodeURIComponent(brand + ' logo black and white');
                const url = engine === 'google'
                    ? `https://www.google.com/search?q=${query}&tbm=isch`
                    : `https://www.bing.com/images/search?q=${query}`;
                window.open(url, '_blank');
                toggleDropdown(null);
            };
            document.getElementById('goGoogle').onclick = () => performSearch('google');
            document.getElementById('goBing').onclick = () => performSearch('bing');

            document.getElementById('confirmQR').onclick = () => {
                const text = document.getElementById('qrContentInput').value.trim();
                if (!text) return;

                toggleDropdown(null);
                showStatus('正在生成二维码...');

                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`;
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    const id = 'qr-' + Date.now();
                    let w = state.paper.width * 0.3;
                    let h = w;
                    state.items.push({
                        type: 'image',
                        id: id,
                        originalImg: img,
                        workingImg: img,
                        x: (state.paper.width - w) / 2,
                        y: (state.paper.height - h) / 2,
                        w: w, h: h,
                        ditherMode: 'threshold',
                        threshold: 128, exposure: 0, invert: false
                    });
                    state.selectedId = id;
                    renderAll();
                    showStatus('二维码已添加到画布');
                };
                img.onerror = () => showStatus('二维码生成失败');
                img.src = qrUrl;
            };

            // Template Management
            document.getElementById('saveTplBtn').onclick = saveCurrentAsTpl;
            document.getElementById('showTplGalleryBtn').onclick = showTemplateGallery;

            // Font Favorites Functions
            function getFavoriteFonts() {
                return JSON.parse(localStorage.getItem('dtp_favorite_fonts') || '[]');
            }

            function saveFavoriteFonts(fonts) {
                localStorage.setItem('dtp_favorite_fonts', JSON.stringify(fonts));
            }

            function addFavoriteFont(fontFamily) {
                const favorites = getFavoriteFonts();
                if (!favorites.includes(fontFamily)) {
                    favorites.push(fontFamily);
                    saveFavoriteFonts(favorites);
                    renderFavoriteFonts();
                    showStatus('已收藏字体: ' + fontFamily);
                }
            }

            function removeFavoriteFont(fontFamily) {
                const favorites = getFavoriteFonts();
                const index = favorites.indexOf(fontFamily);
                if (index > -1) {
                    favorites.splice(index, 1);
                    saveFavoriteFonts(favorites);
                    renderFavoriteFonts();
                    showStatus('已取消收藏: ' + fontFamily);
                }
            }

            function isFavoriteFont(fontFamily) {
                if (!fontFamily) return false;
                const favorites = getFavoriteFonts();
                // Exact match
                if (favorites.includes(fontFamily)) return true;
                // Also check with trimmed and normalized (remove quotes)
                const normalized = fontFamily.trim().replace(/^["']|["']$/g, '');
                return favorites.some(fav => {
                    const favNormalized = fav.trim().replace(/^["']|["']$/g, '');
                    return favNormalized === normalized || fav === normalized || favNormalized === fontFamily;
                });
            }

            function renderFavoriteFonts() {
                const select = document.getElementById('fontFamilySelect');
                const favoriteGroup = document.getElementById('favoriteFontsGroup');

                // Clear existing favorite options
                favoriteGroup.innerHTML = '';

                const favorites = getFavoriteFonts();
                if (favorites.length > 0) {
                    favorites.forEach(fontFamily => {
                        const opt = document.createElement('option');
                        opt.value = fontFamily;
                        opt.text = fontFamily;
                        favoriteGroup.appendChild(opt);
                    });
                    favoriteGroup.style.display = '';
                } else {
                    favoriteGroup.style.display = 'none';
                }
            }

            // Removed updateFavoriteButton - button now just shows "收藏" text

            // Initialize favorite fonts on load
            renderFavoriteFonts();

            // Text Style Listeners
            const fontFamilySelect = document.getElementById('fontFamilySelect');

            // Function to handle font change
            function handleFontChange(newValue) {
                const item = state.items.find(i => i.id === state.selectedId);
                if (item && item.type === 'text') {
                    item.fontFamily = newValue;
                    renderAll();
                }
            }

            // Use addEventListener for better compatibility
            fontFamilySelect.addEventListener('change', (e) => {
                handleFontChange(e.target.value);
            });

            // Also listen to input event (for some browsers)
            fontFamilySelect.addEventListener('input', (e) => {
                handleFontChange(e.target.value);
            });


            document.getElementById('favoriteFontBtn').onclick = () => {
                const select = document.getElementById('fontFamilySelect');
                const currentFont = select.value;

                if (!currentFont) {
                    showStatus('请先选择字体');
                    return;
                }

                // Toggle favorite: if already favorite, remove it; otherwise add it
                if (isFavoriteFont(currentFont)) {
                    removeFavoriteFont(currentFont);
                } else {
                    addFavoriteFont(currentFont);
                }
            };

            document.getElementById('browseSystemFontsBtn').onclick = async () => {
                if (!window.queryLocalFonts) {
                    alert('您的浏览器不支持扫描本地字体，请手动输入名称。');
                    return;
                }

                try {
                    showStatus('正在扫描系统字体...');
                    const availableFonts = await window.queryLocalFonts();
                    if (availableFonts.length > 0) {
                        // Extract unique family names
                        const fontFamilies = [...new Set(availableFonts.map(f => f.family))].sort();

                        const select = document.getElementById('fontFamilySelect');
                        // Add to current select if not already there
                        const existingValues = Array.from(select.options).map(opt => opt.value);

                        const group = document.createElement('optgroup');
                        group.label = '💻 系统已安装字体';

                        let addedCount = 0;
                        fontFamilies.forEach(family => {
                            if (!existingValues.includes(family)) {
                                const opt = document.createElement('option');
                                opt.value = family;
                                opt.text = family;
                                group.appendChild(opt);
                                addedCount++;
                            }
                        });

                        if (addedCount > 0) {
                            select.appendChild(group);
                            showStatus(`成功加载 ${addedCount} 款系统字体`);
                        } else {
                            showStatus('未发现新字体');
                        }
                    }
                } catch (err) {
                    console.error(err);
                    showStatus('获取本地字体失败: ' + err.message, 'error');
                }
            };

            document.getElementsByName('textColor').forEach(radio => {
                radio.onchange = (e) => {
                    const item = state.items.find(i => i.id === state.selectedId);
                    if (item && item.type === 'text') {
                        item.color = e.target.value;
                        renderAll();
                    }
                };
            });

            document.getElementById('boldToggleBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (item && item.type === 'text') {
                    item.isBold = !item.isBold;
                    renderAll();
                }
            };

            document.getElementById('textRotateBtn').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (item && item.type === 'text') {
                    item.orientation = ((item.orientation || 0) + 90) % 360;
                    renderAll();
                }
            };

            // Zoom Listeners
            document.getElementById('zoomRange').oninput = (e) => {
                state.zoom = parseFloat(e.target.value);
                updateScale();
            };

            // 缩放加减按钮 - 精确到1%
            document.getElementById('zoomDecreaseBtn').onclick = () => {
                state.zoom = Math.max(0.1, Math.round((state.zoom - 0.01) * 100) / 100);
                updateScale();
            };

            document.getElementById('zoomIncreaseBtn').onclick = () => {
                state.zoom = Math.min(3, Math.round((state.zoom + 0.01) * 100) / 100);
                updateScale();
            };

            // 100%按钮：缩放到100%
            document.getElementById('zoom100Btn').onclick = () => {
                state.zoom = 1.0;
                updateScale();
                showStatus('已缩放到100%');
            };

            // 现实比例按钮 - 保存/恢复缩放比例
            const realityScaleBtn = document.getElementById('realityScaleBtn');

            function updateRealityScaleBtn() {
                const savedScale = localStorage.getItem('dtp_reality_scale');
                if (savedScale) {
                    const scale = parseFloat(savedScale);
                    realityScaleBtn.style.background = 'var(--primary-color)';
                    realityScaleBtn.style.color = 'white';
                    realityScaleBtn.title = `点击缩放到现实比例 (${Math.round(scale * 100)}%)，右键清除设置`;
                } else {
                    realityScaleBtn.style.background = '';
                    realityScaleBtn.style.color = '';
                    realityScaleBtn.title = '点击设置当前缩放比例为现实比例';
                }
            }

            // 初始化按钮状态
            updateRealityScaleBtn();

            // 现实比例按钮：第一次点击设置，之后点击恢复
            realityScaleBtn.onclick = () => {
                const savedScale = localStorage.getItem('dtp_reality_scale');
                if (savedScale) {
                    // 已保存，则缩放到现实比例
                    const scale = parseFloat(savedScale);
                    state.zoom = scale;
                    updateScale();
                    showStatus(`已缩放到现实比例: ${Math.round(scale * 100)}%`);
                } else {
                    // 未保存，则保存当前比例
                    localStorage.setItem('dtp_reality_scale', state.zoom.toString());
                    updateRealityScaleBtn();
                    showStatus(`已设置现实比例: ${Math.round(state.zoom * 100)}%`);
                }
            };

            // 右键点击清除现实比例设置
            realityScaleBtn.oncontextmenu = (e) => {
                e.preventDefault();
                const savedScale = localStorage.getItem('dtp_reality_scale');
                if (savedScale) {
                    if (confirm('确定要清除现实比例设置吗？')) {
                        localStorage.removeItem('dtp_reality_scale');
                        updateRealityScaleBtn();
                        showStatus('已清除现实比例设置');
                    }
                } else {
                    showStatus('当前没有保存的现实比例');
                }
            };



            // Add Text
            document.getElementById('addTextBtn').onclick = () => {
                const text = document.getElementById('textInput').value.trim();
                if (!text) {
                    showStatus('请输入文字内容');
                    return;
                }
                const fontSize = 4; // Default font size
                const id = 'text-' + Date.now();
                state.items.push({
                    type: 'text',
                    id: id,
                    text: text,
                    x: 5,
                    y: 5,
                    w: 30, // Default width for wrapping
                    size: fontSize,
                    fontFamily: document.getElementById('fontFamilySelect').value || '微软雅黑',
                    color: document.querySelector('input[name="textColor"]:checked').value || 'black',
                    isBold: false,
                    orientation: 0
                });
                state.selectedId = id;
                renderAll();
                document.getElementById('textInput').value = '';
            };

            // Keyboard support for font size, editing, and deletion
            window.addEventListener('keydown', (e) => {
                // Don't trigger if user is typing in an input or textarea
                if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                    return;
                }

                // K: 显示快捷键弹窗
                if (e.key === 'k' || e.key === 'K') {
                    document.getElementById('shortcutModal').style.display = 'flex';
                    e.preventDefault();
                    return;
                }

                // F5: 插入日期
                if (e.key === 'F5') {
                    addTimestamp('date');
                    e.preventDefault();
                    return;
                }

                // F6: 插入时间
                if (e.key === 'F6') {
                    addTimestamp('time');
                    e.preventDefault();
                    return;
                }

                // Ctrl-C: 复制当前元素
                if (e.ctrlKey && e.key === 'c') {
                    if (state.selectedId) {
                        const item = state.items.find(i => i.id === state.selectedId);
                        if (item) {
                            copyItemToClipboard(item.id);
                            e.preventDefault();
                            return;
                        }
                    }
                }

                // Ctrl-D: 复制并放置当前元素（保持大小相同、位置放在原图下面不重叠）
                if (e.ctrlKey && e.key === 'd') {
                    if (state.selectedId) {
                        const item = state.items.find(i => i.id === state.selectedId);
                        if (item) {
                            duplicateItemBelow(item.id);
                            e.preventDefault();
                            return;
                        }
                    }
                }

                if (!state.selectedId) return;

                const item = state.items.find(i => i.id === state.selectedId);
                if (!item) return;

                // Deletion (Works for both images and text)
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    deleteItem(item.id);
                    e.preventDefault();
                    return;
                }

                // R key: Rotate 90° (Works for both images and text)
                if (e.key === 'r' || e.key === 'R') {
                    if (item.type === 'image') {
                        // Rotate image 90 degrees
                        const canvas = document.createElement('canvas');
                        canvas.width = item.workingImg.height;
                        canvas.height = item.workingImg.width;
                        const ctx = canvas.getContext('2d');

                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.rotate(Math.PI / 2);
                        ctx.drawImage(item.workingImg, -item.workingImg.width / 2, -item.workingImg.height / 2);

                        const newImg = new Image();
                        newImg.onload = () => {
                            item.workingImg = newImg;
                            // Swap w and h
                            const oldW = item.w;
                            item.w = item.h;
                            item.h = oldW;
                            renderAll();
                        };
                        newImg.src = canvas.toDataURL();
                    } else if (item.type === 'text') {
                        // Rotate text 90 degrees
                        item.orientation = ((item.orientation || 0) + 90) % 360;
                        renderAll();
                    }
                    e.preventDefault();
                    return;
                }

                // Image specific shortcuts
                if (item.type === 'image') {
                    // V key: Mirror flip
                    if (e.key === 'v' || e.key === 'V') {
                        item.isFlipped = !item.isFlipped;
                        renderAll();
                        e.preventDefault();
                        return;
                    }

                    // F key: Fit to paper
                    if (e.key === 'f' || e.key === 'F') {
                        const aspect = item.workingImg.width / item.workingImg.height;
                        const paperAspect = state.paper.width / state.paper.height;

                        if (aspect > paperAspect) {
                            item.w = state.paper.width;
                            item.h = state.paper.width / aspect;
                        } else {
                            item.h = state.paper.height;
                            item.w = state.paper.height * aspect;
                        }
                        item.x = (state.paper.width - item.w) / 2;
                        item.y = (state.paper.height - item.h) / 2;
                        renderAll();
                        e.preventDefault();
                        return;
                    }

                    // X key: Start crop
                    if (e.key === 'x' || e.key === 'X') {
                        startCrop(item);
                        e.preventDefault();
                        return;
                    }
                }

                // Text specific shortcuts
                if (item.type === 'text') {
                    if (e.key === 'ArrowUp') {
                        item.size += 0.5;
                        renderAll();
                        e.preventDefault();
                    } else if (e.key === 'ArrowDown') {
                        item.size = Math.max(1, item.size - 0.5);
                        renderAll();
                        e.preventDefault();
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        const select = document.getElementById('fontFamilySelect');
                        const options = Array.from(select.options).filter(opt => opt.value);
                        let currentIndex = options.findIndex(opt => opt.value === item.fontFamily);

                        if (e.key === 'ArrowLeft') {
                            currentIndex = (currentIndex - 1 + options.length) % options.length;
                        } else {
                            currentIndex = (currentIndex + 1) % options.length;
                        }

                        item.fontFamily = options[currentIndex].value;
                        select.value = item.fontFamily;
                        renderAll();
                        e.preventDefault();
                    } else if (e.key === 'Enter') {
                        openTextEditModal(item);
                        e.preventDefault();
                    }
                }
            });

            // Text Edit Modal Event Listeners
            document.getElementById('cancelTextEdit').onclick = () => {
                document.getElementById('textEditModal').style.display = 'none';
            };

            document.getElementById('saveTextEdit').onclick = () => {
                const item = state.items.find(i => i.id === state.selectedId);
                if (item && item.type === 'text') {
                    item.text = document.getElementById('editTextarea').value;
                    renderAll();
                }
                document.getElementById('textEditModal').style.display = 'none';
            };

            document.getElementById('editTextarea').onkeydown = (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    document.getElementById('saveTextEdit').click();
                }
            };

            function openTextEditModal(item) {
                const modal = document.getElementById('textEditModal');
                const textarea = document.getElementById('editTextarea');
                textarea.value = item.text;
                modal.style.display = 'flex';
                setTimeout(() => textarea.focus(), 100);
            }

            function formatDateTime(type) {
                const now = new Date();
                const Y = now.getFullYear();
                const M = String(now.getMonth() + 1).padStart(2, '0');
                const D = String(now.getDate()).padStart(2, '0');
                const h = String(now.getHours()).padStart(2, '0');
                const m = String(now.getMinutes()).padStart(2, '0');
                const s = String(now.getSeconds()).padStart(2, '0');

                if (type === 'date') return `${Y}-${M}-${D}`;
                if (type === 'time') return `${h}:${m}:${s}`;
                return `${Y}-${M}-${D} ${h}:${m}:${s}`;
            }

            function addTimestamp(type) {
                const text = formatDateTime(type);
                const id = 'text-' + Date.now();
                state.items.push({
                    type: 'text',
                    id: id,
                    text: text,
                    isDynamic: type === 'time', // 时间允许动态更变
                    dynamicType: type,
                    x: 5,
                    y: 5,
                    w: 30,
                    size: 4,
                    fontFamily: document.getElementById('fontFamilySelect').value || '微软雅黑',
                    color: document.querySelector('input[name="textColor"]:checked').value || 'black',
                    isBold: false,
                    orientation: 0
                });
                state.selectedId = id;
                renderAll();
                showStatus(`已添加当前${type === 'date' ? '日期' : '时间'}`);
            }

            // Print button
            document.getElementById('printBtn').onclick = doPrint;
            document.getElementById('exportPngBtn').onclick = exportToPNG;
            document.getElementById('clearBtn').onclick = clearAllItems;

            // 定时更新动态字段 (如时间)
            setInterval(() => {
                let changed = false;
                state.items.forEach(item => {
                    if (item.type === 'text' && item.isDynamic) {
                        const newText = formatDateTime(item.dynamicType);
                        if (item.text !== newText) {
                            item.text = newText;
                            changed = true;
                        }
                    }
                });
                if (changed) {
                    renderAll();
                }
            }, 1000);

            // Overlay dragging
            const overlay = document.getElementById('imageOverlay');
            overlay.onmousedown = (e) => {
                state.selectedId = 'image';
                if (e.target.id === 'resizeHandle') {
                    state.isResizing = true;
                } else {
                    state.isDragging = true;
                }
                state.lastMousePos = { x: e.clientX, y: e.clientY };
                renderWorkingImage(); // Show selection
                e.preventDefault();
                e.stopPropagation();
            };

            window.onmousemove = (e) => {
                if (!state.isDragging && !state.isResizing && !state.isResizingWidth && !state.crop.isDragging) return;

                const dx = e.clientX - state.lastMousePos.x;
                const dy = e.clientY - state.lastMousePos.y;

                const container = document.getElementById('paperContainer');
                const scale = container.getBoundingClientRect().width / (state.paper.width * MM_TO_PX);

                if (state.isDragging) {
                    const item = state.items.find(i => i.id === state.selectedId);
                    if (item) {
                        item.x += dx / (MM_TO_PX * scale);
                        item.y += dy / (MM_TO_PX * scale);
                        renderAll();
                    }
                } else if (state.isResizing) {
                    const item = state.items.find(i => i.id === state.selectedId);
                    if (item && item.type === 'image') {
                        item.w += dx / (MM_TO_PX * scale);
                        item.h += dy / (MM_TO_PX * scale);
                        renderAll();
                    }
                } else if (state.isResizingWidth) {
                    const item = state.items.find(i => i.id === state.selectedId);
                    if (item && item.type === 'text') {
                        item.w = Math.max(5, (item.w || 30) + dx / (MM_TO_PX * scale));
                        renderAll();
                    }
                } else if (state.crop.isDragging) {
                    handleCropDrag(e);
                }
                state.lastMousePos = { x: e.clientX, y: e.clientY };
            };

            window.onmouseup = () => {
                state.isDragging = false;
                state.isResizing = false;
                state.isResizingWidth = false;
                state.crop.isDragging = false;
                state.crop.handle = null;
            };

            // Crop Modal Events
            document.getElementById('cropCanvas').onmousedown = (e) => {
                const rect = e.target.getBoundingClientRect();
                const scale = e.target.width / rect.width;
                const x = (e.clientX - rect.left) * scale;
                const y = (e.clientY - rect.top) * scale;

                const r = state.crop.rect;
                const hSize = 20 * scale; // Area to catch handle

                // Check handles
                if (Math.abs(x - r.x) < hSize && Math.abs(y - r.y) < hSize) state.crop.handle = 'tl';
                else if (Math.abs(x - (r.x + r.w)) < hSize && Math.abs(y - r.y) < hSize) state.crop.handle = 'tr';
                else if (Math.abs(x - r.x) < hSize && Math.abs(y - (r.y + r.h)) < hSize) state.crop.handle = 'bl';
                else if (Math.abs(x - (r.x + r.w)) < hSize && Math.abs(y - (r.y + r.h)) < hSize) state.crop.handle = 'br';
                else if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h) state.crop.handle = 'move';

                if (state.crop.handle) {
                    state.crop.isDragging = true;
                    state.lastMousePos = { x: e.clientX, y: e.clientY };
                }
            };

            document.getElementById('freeRatioBtn').onclick = () => {
                state.crop.freeRatio = !state.crop.freeRatio;
                const btn = document.getElementById('freeRatioBtn');
                if (state.crop.freeRatio) {
                    btn.classList.add('btn-primary');
                    btn.textContent = '锁定比例';
                } else {
                    btn.classList.remove('btn-primary');
                    btn.textContent = '自由比例';
                }
            };

            document.getElementById('cancelCrop').onclick = () => {
                document.getElementById('cropModal').style.display = 'none';
                state.crop.active = false;
            };

            document.getElementById('confirmCrop').onclick = () => {
                const item = state.items.find(i => i.id === state.crop.targetId);
                const canvas = document.createElement('canvas');
                const r = state.crop.rect;
                canvas.width = r.w;
                canvas.height = r.h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(item.workingImg, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);

                const newImg = new Image();
                newImg.onload = () => {
                    item.workingImg = newImg;
                    // Auto-fit to paper or maintain scale? Let's auto-center it.
                    const aspect = newImg.width / newImg.height;
                    item.w = state.paper.width * 0.5;
                    item.h = item.w / aspect;
                    item.x = (state.paper.width - item.w) / 2;
                    item.y = (state.paper.height - item.h) / 2;

                    renderAll();
                    document.getElementById('cropModal').style.display = 'none';
                };
                newImg.src = canvas.toDataURL();
            };
        }

        function handleCropDrag(e) {
            const canvas = document.getElementById('cropCanvas');
            const rect = canvas.getBoundingClientRect();
            const scale = canvas.width / rect.width;

            const mx = (e.clientX - rect.left) * scale;
            const my = (e.clientY - rect.top) * scale;

            const r = state.crop.rect;
            const h = state.crop.handle;
            const freeRatio = state.crop.freeRatio;
            const paperAspect = state.paper.width / state.paper.height;

            if (h === 'move') {
                const dx = (e.clientX - state.lastMousePos.x) * scale;
                const dy = (e.clientY - state.lastMousePos.y) * scale;
                r.x = Math.max(0, Math.min(canvas.width - r.w, r.x + dx));
                r.y = Math.max(0, Math.min(canvas.height - r.h, r.y + dy));
            } else {
                let newW, newH;
                const anchorX = (h === 'tl' || h === 'bl') ? r.x + r.w : r.x;
                const anchorY = (h === 'tl' || h === 'tr') ? r.y + r.h : r.y;

                if (freeRatio) {
                    // Free ratio: allow independent width and height adjustment
                    if (h === 'br' || h === 'tr') {
                        newW = mx - anchorX;
                    } else {
                        newW = anchorX - mx;
                    }

                    if (h === 'bl' || h === 'br') {
                        newH = my - anchorY;
                    } else {
                        newH = anchorY - my;
                    }

                    // Bounds check and clamp
                    if (anchorX + (h === 'br' || h === 'tr' ? newW : -newW) < 0) {
                        newW = anchorX;
                    }
                    if (anchorX + (h === 'br' || h === 'tr' ? newW : -newW) > canvas.width) {
                        newW = canvas.width - anchorX;
                    }
                    if (anchorY + (h === 'bl' || h === 'br' ? newH : -newH) < 0) {
                        newH = anchorY;
                    }
                    if (anchorY + (h === 'bl' || h === 'br' ? newH : -newH) > canvas.height) {
                        newH = canvas.height - anchorY;
                    }
                } else {
                    // Locked ratio: maintain paper aspect ratio
                    if (h === 'br' || h === 'tr') {
                        newW = mx - anchorX;
                    } else {
                        newW = anchorX - mx;
                    }

                    newH = newW / paperAspect;

                    // Bounds check and clamp
                    if (anchorX + (h === 'br' || h === 'tr' ? newW : -newW) < 0) {
                        newW = anchorX;
                        newH = newW / paperAspect;
                    }
                    if (anchorX + (h === 'br' || h === 'tr' ? newW : -newW) > canvas.width) {
                        newW = canvas.width - anchorX;
                        newH = newW / paperAspect;
                    }
                    if (anchorY + (h === 'bl' || h === 'br' ? newH : -newH) < 0) {
                        newH = anchorY;
                        newW = newH * paperAspect;
                    }
                    if (anchorY + (h === 'bl' || h === 'br' ? newH : -newH) > canvas.height) {
                        newH = canvas.height - anchorY;
                        newW = newH * paperAspect;
                    }
                }

                // Update rect
                r.w = Math.max(20, newW);
                r.h = Math.max(20, newH);
                r.x = (h === 'tl' || h === 'bl') ? anchorX - r.w : anchorX;
                r.y = (h === 'tl' || h === 'tr') ? anchorY - r.h : anchorY;
            }

            state.lastMousePos = { x: e.clientX, y: e.clientY };
            drawCropOverlay();
        }

        // --- Printer Management ---
        async function refreshPrinters() {
            const list = api.getPrinters({ onlyLocal: false });
            const select = document.getElementById('printerSelect');
            select.innerHTML = '';

            if (list.length === 0) {
                select.innerHTML = '<option value="">无可用打印机</option>';
                document.getElementById('printBtn').disabled = true;
                return;
            }

            list.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.name + (p.ip ? '@' + p.ip : '');
                opt.text = (p.deviceName || p.name) + (p.ip ? ` (${p.ip})` : '');
                select.appendChild(opt);
            });

            state.printers = list;
            document.getElementById('printBtn').disabled = false;
        }

        function getSelectedPrinterInfo() {
            const val = document.getElementById('printerSelect').value;
            if (!val) return null;
            const [name, ip] = val.split('@');
            return { name, ip };
        }

        // --- Template Logic ---
        function refreshTplList() {
            // This function is kept for backward compatibility but not used in new UI
            const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
            return Object.keys(tpls);
        }

        // Generate thumbnail for a template
        async function generateTemplateThumbnail(tplData, maxWidth = 200, maxHeight = 150) {
            return new Promise((resolve) => {
                const dpi = 2; // Lower DPI for thumbnail
                const canvas = document.createElement('canvas');
                const paperWidth = tplData.paper.width;
                const paperHeight = tplData.paper.height;

                // Calculate thumbnail size maintaining aspect ratio
                const aspectRatio = paperWidth / paperHeight;
                let thumbWidth = maxWidth;
                let thumbHeight = maxHeight;

                if (aspectRatio > 1) {
                    thumbHeight = thumbWidth / aspectRatio;
                } else {
                    thumbWidth = thumbHeight * aspectRatio;
                }

                canvas.width = Math.round(paperWidth * dpi);
                canvas.height = Math.round(paperHeight * dpi);
                const ctx = canvas.getContext('2d');

                // White background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Load and render items
                const loadPromises = tplData.items.map(item => {
                    return new Promise((itemResolve) => {
                        if (item.type === 'image' && item.imgData) {
                            const img = new Image();
                            img.onload = () => {
                                ctx.save();
                                ctx.translate(item.x * dpi, item.y * dpi);
                                if (item.orientation) {
                                    ctx.rotate((item.orientation * Math.PI) / 180);
                                }
                                ctx.drawImage(img, 0, 0, item.w * dpi, item.h * dpi);
                                ctx.restore();
                                itemResolve();
                            };
                            img.onerror = () => itemResolve();
                            img.src = item.imgData;
                        } else if (item.type === 'text') {
                            ctx.save();
                            ctx.translate(item.x * dpi, item.y * dpi);
                            if (item.orientation) {
                                ctx.rotate((item.orientation * Math.PI) / 180);
                            }
                            drawWrappedText(ctx, item, dpi);
                            ctx.restore();
                            itemResolve();
                        } else {
                            itemResolve();
                        }
                    });
                });

                Promise.all(loadPromises).then(() => {
                    // Create thumbnail canvas
                    const thumbCanvas = document.createElement('canvas');
                    thumbCanvas.width = thumbWidth;
                    thumbCanvas.height = thumbHeight;
                    const thumbCtx = thumbCanvas.getContext('2d');
                    thumbCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);
                    resolve(thumbCanvas.toDataURL('image/png'));
                });
            });
        }

        // Show template gallery modal
        async function showTemplateGallery() {
            const modal = document.getElementById('templateGalleryModal');
            const grid = document.getElementById('templateGalleryGrid');
            const loadBtn = document.getElementById('loadTemplateFromGallery');
            const deleteBtn = document.getElementById('deleteTemplateFromGallery');

            modal.style.display = 'flex';
            grid.innerHTML = '';

            const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
            const templateNames = Object.keys(tpls);

            if (templateNames.length === 0) {
                grid.innerHTML = `
                    <div class="template-empty" style="grid-column: 1 / -1;">
                        <div class="template-empty-icon">📄</div>
                        <p>还没有保存任何模板</p>
                        <p style="font-size: 12px; margin-top: 8px;">保存模板后，缩略图会显示在这里</p>
                    </div>
                `;
                loadBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
                return;
            }

            let selectedTemplate = null;

            // Load thumbnails
            for (const name of templateNames) {
                const tpl = tpls[name];
                const item = document.createElement('div');
                item.className = 'template-item';
                item.dataset.templateName = name;

                const thumbDiv = document.createElement('div');
                thumbDiv.className = 'template-thumbnail';

                // Try to load existing thumbnail or generate new one
                if (tpl.thumbnail) {
                    const img = document.createElement('img');
                    img.src = tpl.thumbnail;
                    thumbDiv.appendChild(img);
                } else {
                    // Generate thumbnail on the fly
                    const loadingDiv = document.createElement('div');
                    loadingDiv.style.cssText = 'color: var(--text-muted); font-size: 12px;';
                    loadingDiv.textContent = '生成中...';
                    thumbDiv.appendChild(loadingDiv);

                    generateTemplateThumbnail(tpl).then(thumbData => {
                        loadingDiv.remove();
                        const img = document.createElement('img');
                        img.src = thumbData;
                        thumbDiv.appendChild(img);

                        // Save thumbnail for future use
                        tpl.thumbnail = thumbData;
                        tpls[name] = tpl;
                        localStorage.setItem('dtp_templates', JSON.stringify(tpls));
                    });
                }

                const nameDiv = document.createElement('div');
                nameDiv.className = 'template-name';
                nameDiv.textContent = name;

                const infoDiv = document.createElement('div');
                infoDiv.className = 'template-info';
                const itemCount = tpl.items ? tpl.items.length : 0;
                infoDiv.textContent = `${tpl.paper.width}×${tpl.paper.height}mm · ${itemCount}个元素`;

                item.appendChild(thumbDiv);
                item.appendChild(nameDiv);
                item.appendChild(infoDiv);

                item.onclick = () => {
                    // Toggle selection
                    document.querySelectorAll('.template-item').forEach(el => {
                        el.classList.remove('selected');
                    });
                    item.classList.add('selected');
                    selectedTemplate = name;
                    loadBtn.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                };

                grid.appendChild(item);
            }

            // Load button handler
            loadBtn.onclick = () => {
                if (selectedTemplate) {
                    loadTemplateByName(selectedTemplate);
                    modal.style.display = 'none';
                }
            };

            // Delete button handler
            deleteBtn.onclick = () => {
                if (selectedTemplate && confirm(`确定要删除模板 "${selectedTemplate}" 吗？`)) {
                    const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
                    delete tpls[selectedTemplate];
                    localStorage.setItem('dtp_templates', JSON.stringify(tpls));
                    showTemplateGallery(); // Refresh
                }
            };

            // Close button handler
            document.getElementById('closeTemplateGallery').onclick = () => {
                modal.style.display = 'none';
            };

            // Close on overlay click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            };
        }

        // Load template by name
        function loadTemplateByName(name) {
            if (!name) return;

            showStatus('正在加载模板...');
            const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
            const tpl = tpls[name];

            if (!tpl) return;

            // Restore paper
            state.paper = tpl.paper;
            document.getElementById('paperSizeInput').value = `${state.paper.width}x${state.paper.height}`;
            updatePaperUI();

            // Restore items
            const loadPromises = tpl.items.map(item => {
                return new Promise((resolve) => {
                    if (item.type === 'image') {
                        const img = new Image();
                        img.onload = () => {
                            item.originalImg = img;
                            item.workingImg = img;
                            resolve(item);
                        };
                        img.src = item.imgData;
                        delete item.imgData; // Clean up
                    } else {
                        resolve(item);
                    }
                });
            });

            Promise.all(loadPromises).then(items => {
                state.items = items;
                state.selectedId = null;
                renderAll();
                showStatus('模板已成功加载');
            });
        }

        async function saveCurrentAsTpl() {
            const name = document.getElementById('tplNameInput').value.trim();
            if (!name) {
                showStatus('请输入模板名称');
                return;
            }

            showStatus('正在保存模板...');

            // Serialize items (handle images to Base64)
            const serializedItems = await Promise.all(state.items.map(async item => {
                const base = { ...item };
                if (item.type === 'image') {
                    // Store images as data URLs
                    const canvas = document.createElement('canvas');
                    canvas.width = item.workingImg.width;
                    canvas.height = item.workingImg.height;
                    canvas.getContext('2d').drawImage(item.workingImg, 0, 0);
                    base.imgData = canvas.toDataURL();
                    // Don't store actual Image objects
                    delete base.originalImg;
                    delete base.workingImg;
                }
                return base;
            }));

            const tplData = {
                paper: state.paper,
                items: serializedItems
            };

            // Generate thumbnail
            showStatus('正在生成缩略图...');
            try {
                tplData.thumbnail = await generateTemplateThumbnail(tplData);
            } catch (e) {
                console.error('Failed to generate thumbnail:', e);
            }

            const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
            tpls[name] = tplData;
            localStorage.setItem('dtp_templates', JSON.stringify(tpls));

            document.getElementById('tplNameInput').value = '';
            refreshTplList();
            showStatus('模板 "' + name + '" 已保存');
        }

        function loadSelectedTpl() {
            const name = document.getElementById('tplSelect').value;
            if (!name) return;

            showStatus('正在加载模板...');
            const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
            const tpl = tpls[name];

            if (!tpl) return;

            // Restore paper
            state.paper = tpl.paper;
            document.getElementById('paperSizeInput').value = `${state.paper.width}x${state.paper.height}`;
            updatePaperUI();

            // Restore items
            const loadPromises = tpl.items.map(item => {
                return new Promise((resolve) => {
                    if (item.type === 'image') {
                        const img = new Image();
                        img.onload = () => {
                            item.originalImg = img;
                            item.workingImg = img;
                            resolve(item);
                        };
                        img.src = item.imgData;
                        delete item.imgData; // Clean up
                    } else {
                        resolve(item);
                    }
                });
            });

            Promise.all(loadPromises).then(items => {
                state.items = items;
                state.selectedId = null;
                renderAll();
                showStatus('模板已成功加载');
            });
        }

        function deleteSelectedTpl() {
            const name = document.getElementById('tplSelect').value;
            if (!name) return;

            if (confirm('确定要删除模板 "' + name + '" 吗？')) {
                const tpls = JSON.parse(localStorage.getItem('dtp_templates') || '{}');
                delete tpls[name];
                localStorage.setItem('dtp_templates', JSON.stringify(tpls));
                refreshTplList();
                showStatus('模板已删除');
            }
        }

        // --- Printing ---
        function exportToPNG() {
            if (state.items.length === 0) {
                showStatus('没有可导出的内容');
                return;
            }

            showStatus('正在生成图片...');

            // Use 10 dots/mm for high resolution export
            const dpi = 10;
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = Math.round(state.paper.width * dpi);
            exportCanvas.height = Math.round(state.paper.height * dpi);
            const ctx = exportCanvas.getContext('2d');

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

            state.items.forEach(item => {
                ctx.save();
                ctx.translate(item.x * dpi, item.y * dpi);
                if (item.orientation) {
                    ctx.rotate((item.orientation * Math.PI) / 180);
                }

                if (item.type === 'image') {
                    const wPx = item.w * dpi;
                    const hPx = item.h * dpi;
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = wPx; tempCanvas.height = hPx;
                    const tempCtx = tempCanvas.getContext('2d');

                    if (item.isFlipped) {
                        tempCtx.translate(wPx, 0);
                        tempCtx.scale(-1, 1);
                    }
                    tempCtx.drawImage(item.workingImg, 0, 0, wPx, hPx);

                    const imageData = tempCtx.getImageData(0, 0, wPx, hPx);
                    applyDitheringToItem(imageData, item);
                    tempCtx.putImageData(imageData, 0, 0);
                    ctx.drawImage(tempCanvas, 0, 0);
                } else if (item.type === 'text') {
                    drawWrappedText(ctx, item, dpi);
                }
                ctx.restore();
            });

            // Trigger download
            const link = document.createElement('a');
            link.download = `web-printer-export-${Date.now()}.png`;
            link.href = exportCanvas.toDataURL('image/png');
            link.click();
            showStatus('图片导出成功');
        }

        function doPrint() {
            if (state.items.length === 0) return;
            const printer = getSelectedPrinterInfo();
            if (!printer) return;

            showStatus('正在发送打印任务...');

            api.openPrinter(printer, (success) => {
                if (!success) {
                    showStatus('无法连接打印机', 'error');
                    return;
                }

                // Use composite mode for all prints to ensure high quality and WYSIWYG transparency
                const dpi = 8; // 8 dots/mm (203 DPI)
                const printCanvas = document.createElement('canvas');
                printCanvas.width = Math.round(state.paper.width * dpi);
                printCanvas.height = Math.round(state.paper.height * dpi);
                const ctx = printCanvas.getContext('2d');

                // Background is white (no ink)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);

                state.items.forEach(item => {
                    ctx.save();
                    ctx.translate(item.x * dpi, item.y * dpi);
                    if (item.orientation) {
                        ctx.rotate((item.orientation * Math.PI) / 180);
                    }

                    if (item.type === 'image') {
                        const wPx = item.w * dpi;
                        const hPx = item.h * dpi;
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = wPx; tempCanvas.height = hPx;
                        const tempCtx = tempCanvas.getContext('2d');

                        if (item.isFlipped) {
                            tempCtx.translate(wPx, 0);
                            tempCtx.scale(-1, 1);
                        }
                        tempCtx.drawImage(item.workingImg, 0, 0, wPx, hPx);

                        const imageData = tempCtx.getImageData(0, 0, wPx, hPx);
                        applyDitheringToItem(imageData, item);
                        tempCtx.putImageData(imageData, 0, 0);
                        ctx.drawImage(tempCanvas, 0, 0);
                    } else if (item.type === 'text') {
                        drawWrappedText(ctx, item, dpi);
                    }
                    ctx.restore();
                });

                api.startJob({
                    width: state.paper.width,
                    height: state.paper.height,
                    jobName: "CompositePrint",
                    margin: 0
                });

                api.drawImageD({
                    data: printCanvas.toDataURL('image/png'),
                    x: 0, y: 0,
                    drawWidth: state.paper.width,
                    drawHeight: state.paper.height,
                    threshold: 257
                });

                api.commitJob((result) => {
                    api.closePrinter();
                    if (result) showStatus('打印已提交');
                    else showStatus('打印失败', 'error');
                });
            });
        }
