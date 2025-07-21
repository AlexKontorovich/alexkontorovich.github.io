// lecture-scripts.js - Shared functionality for all lectures

// === CHESS BOARD FUNCTIONALITY ===

// Chess piece Unicode symbols
const pieces = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

// Initial chess position
const initialPosition = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let currentPosition = [];

function initializeChessBoard() {
    const board = document.getElementById('chess-board');
    if (!board) return; // Exit if chess board doesn't exist on this page
    
    board.innerHTML = '';
    
    // Initialize position
    currentPosition = initialPosition.map(row => [...row]);
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'chess-square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
            square.id = `square-${row}-${col}`;
            
            const piece = currentPosition[row][col];
            if (piece !== ' ') {
                square.textContent = pieces[piece];
            }
            
            board.appendChild(square);
        }
    }
}

function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = currentPosition[fromRow][fromCol];
    currentPosition[fromRow][fromCol] = ' ';
    currentPosition[toRow][toCol] = piece;
    
    // Update visual board
    const fromSquare = document.getElementById(`square-${fromRow}-${fromCol}`);
    const toSquare = document.getElementById(`square-${toRow}-${toCol}`);
    
    if (fromSquare && toSquare) {
        fromSquare.textContent = '';
        toSquare.textContent = pieces[piece];
    }
}

function animateChess() {
    // Reset to initial position
    initializeChessBoard();
    
    // Remove previous highlighting
    document.querySelectorAll('.current-move').forEach(el => {
        el.classList.remove('current-move');
    });
    
    setTimeout(() => {
        // Highlight first move
        const move1 = document.getElementById('move-1');
        if (move1) move1.classList.add('current-move');
        
        // 1. e4
        makeMove(6, 4, 4, 4);
    }, 500);
    
    setTimeout(() => {
        // 1... e5
        makeMove(1, 4, 3, 4);
    }, 1000);
    
    setTimeout(() => {
        // Remove first move highlight, add second
        const move1 = document.getElementById('move-1');
        const move2 = document.getElementById('move-2');
        if (move1) move1.classList.remove('current-move');
        if (move2) move2.classList.add('current-move');
        
        // 2. Nf3
        makeMove(7, 6, 5, 5);
    }, 1500);
    
    setTimeout(() => {
        // 2... Nf6
        makeMove(0, 6, 2, 5);
    }, 2000);
    
    setTimeout(() => {
        // Remove highlighting
        const move2 = document.getElementById('move-2');
        if (move2) move2.classList.remove('current-move');
    }, 2500);
}

function resetChess() {
    initializeChessBoard();
    document.querySelectorAll('.current-move').forEach(el => {
        el.classList.remove('current-move');
    });
}

// === LEAN INTERFACE FUNCTIONALITY ===

function showLeanInterface() {
    const container = document.getElementById('main-container');
    if (container) {
        container.classList.remove('bottom-hidden');
    }
}

function hideLeanInterface() {
    const container = document.getElementById('main-container');
    if (container) {
        container.classList.add('bottom-hidden');
    }
}

// === DIVIDER FUNCTIONALITY ===

function initializeDivider() {
    const divider = document.getElementById('divider');
    const topPane = document.querySelector('.top-pane');
    const bottomPane = document.getElementById('bottom-pane');
    const container = document.querySelector('.split-container');
    
    if (!divider || !topPane || !bottomPane || !container) return;
    
    let isDragging = false;
    
    divider.addEventListener('mousedown', function(e) {
        isDragging = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
        document.body.style.userSelect = 'none';
    });
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const containerRect = container.getBoundingClientRect();
        const containerHeight = containerRect.height;
        const yPos = e.clientY - containerRect.top;
        const percentage = Math.max(20, Math.min(80, (yPos / containerHeight) * 100));
        
        topPane.style.flex = 'none';
        topPane.style.height = `${percentage}%`;
        bottomPane.style.height = `${100 - percentage}%`;
    }
    
    function handleMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
    }
}

// === LECTURE 3 SPECIFIC: REVEAL ERROR FUNCTIONALITY ===

function initializeLecture3Features() {
    const revealBtn = document.getElementById('reveal-error-btn');
    const errorExplanation = document.getElementById('error-explanation');
    const gapExplanation = document.getElementById('gap-explanation');
    const arrowContainer = document.getElementById('arrowContainer');
    
    if (!revealBtn) return; // Not on Lecture 3
    
    let isRevealed = false;
    
    revealBtn.addEventListener('click', function() {
        if (!isRevealed) {
            showArrowToStep5();
            revealBtn.textContent = 'Hide the error';
            if (errorExplanation) errorExplanation.style.display = 'block';
            if (gapExplanation) gapExplanation.style.display = 'block';
            isRevealed = true;
        } else {
            hideArrow();
            revealBtn.textContent = 'Show me where the error is!';
            if (errorExplanation) errorExplanation.style.display = 'none';
            if (gapExplanation) gapExplanation.style.display = 'none';
            isRevealed = false;
        }
    });
    
    function showArrowToStep5() {
        if (!arrowContainer) return;
        
        // Clear any existing arrows
        arrowContainer.innerHTML = '';
        
        // Find step 5 specifically in the Euclid I.1 proof section
        const euclidSection = document.querySelector('iframe[src*="p3jzs8x7"]');
        if (!euclidSection) return;
        
        const proofSteps = euclidSection.closest('section').querySelectorAll('.proof-step');
        const step5 = proofSteps[4]; // Step 5 is index 4 within the Euclid proof    
        
        if (!step5) return;
        
        // Highlight step 5
        step5.style.backgroundColor = '#ffe6e6';
        step5.style.border = '2px solid #dc3545';
        step5.style.animation = 'pulse 2s infinite';
        step5.id = 'highlighted-step';
        
        // Check if step 5 is visible in viewport
        const step5Rect = step5.getBoundingClientRect();
        const isVisible = step5Rect.top >= 0 && step5Rect.bottom <= window.innerHeight;
        
        if (!isVisible) {
            // Scroll step 5 to the top of the page
            step5.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Wait for scroll to complete, then draw arrow
            setTimeout(() => {
                drawArrowToStep5();
            }, 800);
        } else {
            // Step 5 is already visible, draw arrow immediately
            drawArrowToStep5();
        }
    }
    
    function drawArrowToStep5(animate = true) {
        if (!arrowContainer || !revealBtn) return;
        
        // Clear any existing arrows
        arrowContainer.innerHTML = '';
        
        const step5 = document.getElementById('highlighted-step');
        if (!step5) return;
        
        function createArrow(shouldAnimate = false) {
            // Clear previous arrow
            arrowContainer.innerHTML = '';
            
            // Get fresh positions
            const buttonRect = revealBtn.getBoundingClientRect();
            const step5Rect = step5.getBoundingClientRect();
            
            const startX = buttonRect.left + buttonRect.width / 2;
            const startY = buttonRect.top;
            
            const endX = step5Rect.left + step5Rect.width * 0.55;
            const endY = step5Rect.top + step5Rect.height / 2;
            
            // Only draw if both elements are visible
            if (startY < 0 || endY < 0 || startY > window.innerHeight || endY > window.innerHeight) {
                return;
            }
            
            // Create control points for upward curve
            const controlX1 = startX - 80;
            const controlY1 = startY - 100;
            const controlX2 = endX;
            const controlY2 = endY + 50;
            
            // Create SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('viewBox', '0 0 ' + window.innerWidth + ' ' + window.innerHeight);
            svg.classList.add('curvy-arrow');
            if (!shouldAnimate) svg.classList.add('show');
            
            // Create arrowhead marker definition
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'arrowhead-' + Date.now());
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '7');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '3.5');
            marker.setAttribute('orient', 'auto');
            
            const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            triangle.setAttribute('points', '0 0, 10 3.5, 0 7');
            triangle.setAttribute('fill', '#dc3545');
            
            marker.appendChild(triangle);
            defs.appendChild(marker);
            svg.appendChild(defs);
            
            // Create the curved path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', '#dc3545');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('marker-end', `url(#${marker.id})`);
            
            if (shouldAnimate) {
                path.classList.add('arrow-path');
                const pathLength = path.getTotalLength();
                path.style.strokeDasharray = pathLength;
                path.style.strokeDashoffset = pathLength;
            }
            
            svg.appendChild(path);
            arrowContainer.appendChild(svg);
            
            if (shouldAnimate) {
                setTimeout(() => {
                    svg.classList.add('show');
                }, 10);
            }
        }
        
        // Create initial arrow with animation
        createArrow(animate);
        
        // Find the actual scrolling container
        const scrollContainer = document.querySelector('.content-scroll');
        
        // Redraw arrow on scroll WITHOUT animation
        let scrollTimeout;
        function onScroll() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => createArrow(false), 10);
        }
        
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', onScroll);
            
            // Store the scroll listener so we can remove it later
            arrowContainer.scrollListener = onScroll;
            arrowContainer.scrollContainer = scrollContainer;
        }
    }
    
    function hideArrow() {
        if (!arrowContainer) return;
        
        // Remove scroll listener from the correct container
        if (arrowContainer.scrollListener && arrowContainer.scrollContainer) {
            arrowContainer.scrollContainer.removeEventListener('scroll', arrowContainer.scrollListener);
            arrowContainer.scrollListener = null;
            arrowContainer.scrollContainer = null;
        }
        
        // Clear arrows
        arrowContainer.innerHTML = '';
        
        // Remove highlighting from step 5
        const highlightedStep = document.getElementById('highlighted-step');
        if (highlightedStep) {
            highlightedStep.style.backgroundColor = '';
            highlightedStep.style.border = '';
            highlightedStep.style.animation = '';
            highlightedStep.removeAttribute('id');
        }
    }
    
    // === REVEAL POSTULATE 3 FUNCTIONALITY ===
    const revealPostulate3Btn = document.getElementById('reveal-postulate3-btn');
    const postulate3Formal = document.getElementById('postulate3-formal');
    
    if (revealPostulate3Btn && postulate3Formal) {
        revealPostulate3Btn.addEventListener('click', function() {
            if (postulate3Formal.style.display === 'none') {
                postulate3Formal.style.display = 'block';
                revealPostulate3Btn.textContent = 'Hide the formal version';
            } else {
                postulate3Formal.style.display = 'none';
                revealPostulate3Btn.textContent = 'Show the formal version';
            }
        });
    }
}

// === MATHJAX CONFIGURATION ===
function initializeMathJax() {
    window.MathJax = {
        tex: {
            inlineMath: [[', '], ['\\(', '\\)']],
            displayMath: [['$', '$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        }
    };
}

// === MAIN INITIALIZATION ===
function initializePage() {
    // Initialize MathJax
    initializeMathJax();
    
    // Initialize chess board if it exists
    initializeChessBoard();
    
    // Initialize divider functionality
    initializeDivider();
    
    // Initialize Lecture 3 specific features
    initializeLecture3Features();
    
    // Force scroll to top
    const contentScroll = document.querySelector('.content-scroll');
    if (contentScroll) {
        contentScroll.scrollTop = 0;
    }
    window.scrollTo(0, 0);
}

// Initialize everything when page loads
window.addEventListener('load', initializePage);

// Make functions globally available for onclick handlers
window.animateChess = animateChess;
window.resetChess = resetChess;
window.showLeanInterface = showLeanInterface;
window.hideLeanInterface = hideLeanInterface;