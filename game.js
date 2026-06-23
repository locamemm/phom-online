// --- WEB AUDIO SYNTHESIZER ---
const AudioSynth = {
    ctx: null,
    enabled: true,
    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    },
    playClick() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    },
    playSwoosh() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let bufferSize = this.ctx.sampleRate * 0.15;
        let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        let data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        let noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        let filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);
        let gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    },
    playEat() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        [440, 554, 659].forEach((freq, idx) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.06);
            gain.gain.setValueAtTime(0.15, t + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.06 + 0.12);
            osc.start(t + idx * 0.06);
            osc.stop(t + idx * 0.06 + 0.15);
        });
    },
    playWin() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        let notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.09);
            gain.gain.setValueAtTime(0.15, t + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.09 + 0.25);
            osc.start(t + idx * 0.09);
            osc.stop(t + idx * 0.09 + 0.3);
        });
     },
    playU() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        // Bouncy chiptune 8-bit arpeggio
        let notes = [
            523.25, 392.00, 523.25, 392.00, // C5, G4, C5, G4
            587.33, 440.00, 587.33, 440.00, // D5, A4, D5, A4
            659.25, 523.25, 783.99, 659.25, // E5, C5, G5, E5
            1046.50, 783.99, 1318.51, 1046.50, // C6, G5, E6, C6
            1567.98 // G6
        ];
        notes.forEach((freq, idx) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'square';
            let noteTime = t + idx * 0.07;
            osc.frequency.setValueAtTime(freq, noteTime);
            osc.frequency.linearRampToValueAtTime(freq + 15, noteTime + 0.05); // Bouncy pitch shift/vibrato
            
            gain.gain.setValueAtTime(0.08, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.08);
            osc.start(noteTime);
            osc.stop(noteTime + 0.1);
        });
    },
    playLose() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        let notes = [392.00, 349.23, 311.13, 261.63];
        notes.forEach((freq, idx) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t + idx * 0.15);
            gain.gain.setValueAtTime(0.1, t + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.15 + 0.25);
            osc.start(t + idx * 0.15);
            osc.stop(t + idx * 0.15 + 0.3);
        });
    },
    playShuffle() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        for (let i = 0; i < 6; i++) {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, t + i * 0.08);
            gain.gain.setValueAtTime(0.08, t + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.05);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.06);
        }
    },
    playChot() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        [600, 900].forEach((freq, idx) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t + idx * 0.1);
            gain.gain.setValueAtTime(0.15, t + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.1 + 0.18);
            osc.start(t + idx * 0.1);
            osc.stop(t + idx * 0.1 + 0.2);
        });
    },
    playMeld() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.08);
            gain.gain.setValueAtTime(0.12, t + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.15);
            osc.start(t + idx * 0.08);
            osc.stop(t + idx * 0.08 + 0.18);
        });
    },
    playSort() {
        if (!this.enabled || !this.ctx) return;
        this.resumeContext();
        let t = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300 + i * 100, t + i * 0.04);
            gain.gain.setValueAtTime(0.08, t + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.04 + 0.05);
            osc.start(t + i * 0.04);
            osc.stop(t + i * 0.04 + 0.06);
        }
    },
    resumeContext() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
};

// --- PHOM GAME STATE & ENGINE ---

// Suit names and symbols (0: Spades, 1: Clubs, 2: Diamonds, 3: Hearts)
const SUITS = [
    { name: 'Bích', symbol: '♠', cssClass: 'suit-spades' },
    { name: 'Tép', symbol: '♣', cssClass: 'suit-clubs' },
    { name: 'Rô', symbol: '♦', cssClass: 'suit-diamonds' },
    { name: 'Cơ', symbol: '♥', cssClass: 'suit-hearts' }
];

const RANKS = [
    { name: 'A', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
    { name: 'J', value: 11 },
    { name: 'Q', value: 12 },
    { name: 'K', value: 13 }
];

// Deck logic
class Card {
    constructor(suit, rankIndex) {
        this.suit = suit; // Index 0..3
        this.rankIndex = rankIndex; // Index 0..12
        this.rank = RANKS[rankIndex].value; // 1..13
        this.name = RANKS[rankIndex].name + ' ' + SUITS[suit].name;
        this.symbol = RANKS[rankIndex].name;
        this.suitSymbol = SUITS[suit].symbol;
        this.cssClass = SUITS[suit].cssClass;
        this.id = `card-${suit}-${rankIndex}`;
    }
}

// Player state
class Player {
    constructor(id, name, balance = 0, isAI = false) {
        this.id = id; // 0: Player (User), 1: East AI, 2: North AI, 3: West AI
        this.name = name;
        this.balance = balance;
        this.isAI = isAI;
        
        this.hand = []; // Cards currently on hand
        this.discards = []; // Discarded cards (lying in front of them)
        this.discardCount = 0; // Actual number of discards made
        this.eaten = []; // Cards they ate from others
        this.melds = []; // Phoms they have laid down (array of arrays of Cards)
        this.isMom = false;
        this.isU = false;
        this.score = 0;
        this.placement = 0; // 1st, 2nd, 3rd, 4th
        this.matchEatPoints = 0; // NEW: track eat points in this match
        this.matchPlacementPoints = 0; // NEW: track placement points in this match
        this.hasLaidMelds = false; // Trạng thái đã hạ bài trong ván đấu
    }

    reset() {
        this.hand = [];
        this.discards = [];
        this.discardCount = 0;
        this.eaten = [];
        this.melds = [];
        this.isMom = false;
        this.isU = false;
        this.score = 0;
        this.placement = 0;
        this.matchEatPoints = 0;
        this.matchPlacementPoints = 0;
        this.hasLaidMelds = false;
    }

    addCard(card) {
        this.hand.push(card);
    }

    removeCard(cardId) {
        let index = this.hand.findIndex(c => c.id === cardId);
        if (index !== -1) {
            return this.hand.splice(index, 1)[0];
        }
        return null;
    }
}

// Main Game Manager
class GameManager {
    constructor() {
        this.players = [
            new Player(0, "Bạn", 0, false),
            new Player(1, "Lâm Híp", 0, true),
            new Player(2, "Bác Ba Phi", 0, true),
            new Player(3, "Chị Hoa", 0, true)
        ];
        this.deck = [];
        this.drawPile = []; // Draw stack (Nọc)
        this.tableDiscards = [[], [], [], []];
        
        this.dealerIdx = 0; // Index of dealer (gets 10 cards)
        this.playDirection = 1; // 1 = Counter-clockwise (0->1->2->3), -1 = Clockwise (0->3->2->1)
        this.currentTurnIdx = 0; // Whose turn is it
        
        this.roundNum = 1; // 1 to 4 rounds
        this.turnStep = 'ACTION'; // 'ACTION' (eat/draw) or 'DISCARD'
        this.selectedCardId = null;
        this.selectedEatCardIds = [];
        this.isDrawingOrEating = false;
        this.isReturningDiscards = false;
        this.meldStartIdx = 0;
        this.hasStartedDọnRác = false;
        
        this.betAmount = 10000;
        this.lastDiscardedCard = null;
        this.lastDiscardedPlayerIdx = -1;
        this.chotRound = false; // Is this round 4 (last round where eating causes chot)
        this.consecutiveEatenCounts = [0, 0, 0, 0]; // Track how many times a player was eaten consecutively by next player (for đền bài)
        
        this.gameHistory = [];
        this.scoreHistory = [];
        this.gameHistoryRecords = [];
        this.isViewingHistoryRecord = false;
        this.returnToHistoryOnClose = false;
        this.sortMode = 'SUIT'; // 'SUIT' or 'RANK'
        this.autoSendTimeout = null;
        this.baseWidth = 760;
        this.baseHeight = 520;
        
        this.initDOM();
        this.resetGame();
    }

    initDOM() {
        // Core buttons
        document.getElementById('btnEat').addEventListener('click', () => this.playerEat());
        document.getElementById('btnDiscard').addEventListener('click', () => this.playerDiscard());
        document.getElementById('btnSort').addEventListener('click', () => this.toggleSort());
        document.getElementById('btnLayMelds').addEventListener('click', () => this.playerLayMelds());
        document.getElementById('btnRestart').addEventListener('click', () => this.manualRestart());
        document.getElementById('btnNextGame').addEventListener('click', () => this.startNextGame());
        
        // History Modal Listeners
        const btnHistory = document.getElementById('btnHistory');
        const historyModal = document.getElementById('historyModal');
        if (btnHistory && historyModal) {
            btnHistory.addEventListener('click', () => {
                this.renderHistoryTable();
                historyModal.classList.add('show');
                AudioSynth.playClick();
            });
            document.getElementById('closeHistory').addEventListener('click', () => {
                historyModal.classList.remove('show');
                AudioSynth.playClick();
            });
            document.getElementById('btnClearHistory').addEventListener('click', () => {
                AudioSynth.playClick();
                if (confirm("Bạn có muốn xóa toàn bộ lịch sử điểm số và khôi phục điểm về 0?")) {
                    this.scoreHistory = [];
                    this.gameHistoryRecords = [];
                    this.players.forEach(p => p.balance = 0);
                    this.renderHistoryTable();
                    this.updateHUD();
                    historyModal.classList.remove('show');
                    this.resetGame();
                }
            });
        }
        
        // Modals
        const helpModal = document.getElementById('helpModal');
        document.getElementById('btnHelp').addEventListener('click', () => {
            helpModal.classList.add('show');
            AudioSynth.playClick();
        });
        document.getElementById('closeHelp').addEventListener('click', () => {
            helpModal.classList.remove('show');
            AudioSynth.playClick();
        });
        
        // Minimize Game Over Modal
        const btnMinimize = document.getElementById('btnMinimizeGameOver');
        const gameOverModal = document.getElementById('gameOverModal');
        if (btnMinimize && gameOverModal) {
            btnMinimize.addEventListener('click', () => {
                AudioSynth.playClick();
                if (gameOverModal.classList.contains('minimized')) {
                    gameOverModal.classList.remove('minimized');
                    btnMinimize.textContent = '➖';
                } else {
                    gameOverModal.classList.add('minimized');
                    btnMinimize.textContent = '➕';
                }
            });
        }
        
        // Minimize / Maximize Log Panel
        const btnMinimizeLog = document.getElementById('btnMinimizeLog');
        const btnMaximizeLog = document.getElementById('btnMaximizeLog');
        const gameLogPanel = document.getElementById('gameLogPanel');
        if (btnMinimizeLog && btnMaximizeLog && gameLogPanel) {
            btnMinimizeLog.addEventListener('click', () => {
                AudioSynth.playClick();
                if (gameLogPanel.classList.contains('minimized')) {
                    gameLogPanel.classList.remove('minimized');
                    btnMinimizeLog.textContent = '➖';
                    btnMinimizeLog.title = 'Thu nhỏ';
                } else {
                    gameLogPanel.classList.remove('maximized');
                    gameLogPanel.classList.add('minimized');
                    btnMinimizeLog.textContent = '➕';
                    btnMinimizeLog.title = 'Mở rộng';
                    btnMaximizeLog.textContent = '🗖';
                    btnMaximizeLog.title = 'Phóng to';
                }
            });
            btnMaximizeLog.addEventListener('click', () => {
                AudioSynth.playClick();
                if (gameLogPanel.classList.contains('maximized')) {
                    gameLogPanel.classList.remove('maximized');
                    btnMaximizeLog.textContent = '🗖';
                    btnMaximizeLog.title = 'Phóng to';
                } else {
                    gameLogPanel.classList.remove('minimized');
                    gameLogPanel.classList.add('maximized');
                    btnMaximizeLog.textContent = '🗗';
                    btnMaximizeLog.title = 'Thu nhỏ lại';
                    btnMinimizeLog.textContent = '➖';
                    btnMinimizeLog.title = 'Thu nhỏ';
                }
            });
        }
        
        // Sound toggle
        const btnSound = document.getElementById('btnSound');
        btnSound.addEventListener('click', () => {
            AudioSynth.enabled = !AudioSynth.enabled;
            btnSound.innerHTML = AudioSynth.enabled ? '🔊 Âm thanh' : '🔇 Tắt âm';
            AudioSynth.playClick();
        });

        // Fullscreen toggle
        const btnFullscreen = document.getElementById('btnFullscreen');
        if (btnFullscreen) {
            const docEl = document.documentElement;
            
            // Helper functions to enter/exit pseudo-fullscreen
            const enterPseudoFullscreen = () => {
                if (!document.body.classList.contains('pseudo-fullscreen')) {
                    document.body.classList.add('pseudo-fullscreen');
                    btnFullscreen.textContent = '⛶ Thu nhỏ';
                    this.logMessage("Đã bật chế độ phóng to màn hình (Tối ưu thiết bị).", "system");
                    setTimeout(() => this.adjustMatScale(), 100);
                }
            };

            const exitPseudoFullscreen = () => {
                if (document.body.classList.contains('pseudo-fullscreen')) {
                    document.body.classList.remove('pseudo-fullscreen');
                    btnFullscreen.textContent = '⛶ Full screen';
                    this.logMessage("Đã tắt chế độ phóng to màn hình.", "system");
                    setTimeout(() => this.adjustMatScale(), 100);
                }
            };

            const isNativeFullscreen = () => {
                return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            };

            const isPseudoFullscreen = () => {
                return document.body.classList.contains('pseudo-fullscreen');
            };

            btnFullscreen.addEventListener('click', () => {
                AudioSynth.playClick();
                
                // If currently in pseudo-fullscreen, exit it
                if (isPseudoFullscreen()) {
                    exitPseudoFullscreen();
                    return;
                }
                
                // If currently in native fullscreen, exit it
                if (isNativeFullscreen()) {
                    try {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        }
                    } catch (err) {
                        console.warn("Failed to exit native fullscreen, trying pseudo-fullscreen:", err);
                        exitPseudoFullscreen();
                    }
                    return;
                }

                // Try to enter native fullscreen
                let nativePromise = null;
                let methodCalled = false;
                try {
                    if (docEl.requestFullscreen) {
                        nativePromise = docEl.requestFullscreen();
                        methodCalled = true;
                    } else if (docEl.webkitRequestFullscreen) {
                        nativePromise = docEl.webkitRequestFullscreen();
                        methodCalled = true;
                    } else if (docEl.mozRequestFullScreen) {
                        nativePromise = docEl.mozRequestFullScreen();
                        methodCalled = true;
                    } else if (docEl.msRequestFullscreen) {
                        nativePromise = docEl.msRequestFullscreen();
                        methodCalled = true;
                    }
                } catch (err) {
                    console.warn("Native fullscreen rejected/threw error, falling back to pseudo:", err);
                    enterPseudoFullscreen();
                    return;
                }

                if (methodCalled) {
                    if (nativePromise && typeof nativePromise.catch === 'function') {
                        nativePromise.catch(err => {
                            console.warn("Native fullscreen promise rejected, falling back to pseudo:", err);
                            enterPseudoFullscreen();
                        });
                    }
                    // For browsers that don't return a promise but fail, the fullscreenerror events will handle it.
                } else {
                    // No native fullscreen support at all (e.g., iPhone Safari)
                    enterPseudoFullscreen();
                }
            });

            const onFSChange = () => {
                if (isNativeFullscreen()) {
                    btnFullscreen.textContent = '⛶ Thu nhỏ';
                    // Disable pseudo-fullscreen if native succeeds
                    document.body.classList.remove('pseudo-fullscreen');
                } else {
                    btnFullscreen.textContent = '⛶ Full screen';
                }
                setTimeout(() => this.adjustMatScale(), 100);
            };

            const onFSError = (e) => {
                console.warn("Native fullscreen error event triggered, falling back to pseudo-fullscreen:", e);
                if (!isNativeFullscreen()) {
                    enterPseudoFullscreen();
                }
            };

            document.addEventListener('fullscreenchange', onFSChange);
            document.addEventListener('webkitfullscreenchange', onFSChange);
            document.addEventListener('mozfullscreenchange', onFSChange);
            document.addEventListener('MSFullscreenChange', onFSChange);

            document.addEventListener('fullscreenerror', onFSError);
            document.addEventListener('webkitfullscreenerror', onFSError);
            document.addEventListener('mozfullscreenerror', onFSError);
            document.addEventListener('MSFullscreenError', onFSError);
        }

        // Bet selector removed in point system

        // Event for clicking the stock pile
        document.getElementById('drawPile').addEventListener('click', () => {
            const canDraw = (this.currentTurnIdx === 0 && !this.isReturningDiscards && this.turnStep === 'ACTION' && this.drawPile.length > 0);
            if (canDraw) {
                this.playerDraw();
            }
        });

        // Click outside to deselect card
        document.addEventListener('click', (e) => {
            const handContainer = document.getElementById('playerHand');
            const isClickInsideHand = handContainer && handContainer.contains(e.target);
            const isClickOnCard = e.target.closest('#playerHand .card-3d');
            const isClickOnActionBtn = e.target.closest('button') || e.target.closest('select') || e.target.closest('#drawPile');

            if (!isClickInsideHand && !isClickOnCard && !isClickOnActionBtn) {
                if (this.selectedCardId !== null || (this.selectedEatCardIds && this.selectedEatCardIds.length > 0)) {
                    this.selectedCardId = null;
                    this.selectedEatCardIds = [];
                    this.renderPlayerHand();
                    this.updateHUD();
                }
            }
        });

        // Mat scaling for mobile devices
        window.addEventListener('resize', () => this.adjustMatScale());
        this.adjustMatScale();
    }

    adjustMatScale() {
        const mat = document.querySelector('.straw-mat');
        if (!mat) return;
        
        this.baseWidth = 760;
        this.baseHeight = 520;
        
        const isMobile = window.innerWidth < 768 || window.innerHeight < 500;
        const isPseudo = document.body.classList.contains('pseudo-fullscreen');
        const isNative = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        const isFullscreen = isPseudo || isNative;
        
        let padX = 20;
        let padY = 180;
        let translateY = 0;
        
        if (isMobile) {
            padX = 10;
            this.baseWidth = 990; // Tăng chiều ngang chiếu lên 30% ở chế độ điện thoại
            // Check if mobile is in landscape mode
            const isLandscape = window.innerHeight < window.innerWidth;
            if (isLandscape) {
                padY = isFullscreen ? 120 : 150;
                translateY = isFullscreen ? -20 : -15;
            } else {
                padY = isFullscreen ? 100 : 140;
                translateY = 0;
                this.baseHeight = 650; // Tăng chiều dọc chiếu lên 25% ở chế độ dọc
            }
        } else if (isFullscreen) {
            padY = 110;
        }
        
        const scaleX = window.innerWidth / (this.baseWidth + padX);
        const scaleY = window.innerHeight / (this.baseHeight + padY);
        
        let scale = Math.min(scaleX, scaleY);
        if (isMobile) {
            scale *= 0.8; // Zoom tổng thể thêm 40% trên di động
        } else {
            if (scale > 1) scale = 1;
        }
        
        mat.style.transform = `translateY(${translateY}px) scale(${scale})`;
    }

    logMessage(text, type = 'system') {
        const logMessages = document.getElementById('logMessages');
        const msg = document.createElement('div');
        msg.className = `log-message ${type}`;
        msg.textContent = text;
        logMessages.appendChild(msg);
        logMessages.scrollTop = logMessages.scrollHeight;
    }

    createFloatingText(text, x, y, isRed = false, isGreen = false) {
        const container = document.getElementById('floatingTexts');
        const tag = document.createElement('div');
        tag.className = `float-tag ${isRed ? 'red' : ''} ${isGreen ? 'green' : ''}`;
        tag.textContent = text;
        tag.style.left = `${x}px`;
        tag.style.top = `${y}px`;
        container.appendChild(tag);
        
        // Remove after animation finishes
        setTimeout(() => {
            tag.remove();
        }, 2000);
    }

    createFloatingTextOnPlayer(playerIdx, text, isRed = false, isGreen = false) {
        // Find player avatar position in 2D
        const playerZone = document.getElementById(`playerZone-${playerIdx}`);
        if (!playerZone) return;
        const rect = playerZone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        this.createFloatingText(text, centerX, centerY, isRed, isGreen);
    }

    updateSingleAvatarForMeldPhase(playerIdx) {
        const zone = document.getElementById(`playerZone-${playerIdx}`);
        const avatarEl = (zone && typeof zone.querySelector === 'function') ? zone.querySelector('.avatar') : null;
        if (avatarEl) {
            let order = (playerIdx - this.meldStartIdx) * this.playDirection;
            order = (order % 4 + 4) % 4 + 1;
            avatarEl.textContent = order;
        }
    }

    restoreOriginalAvatars() {
        const originalLabels = ["Ta", "LH", "B3", "CH"];
        for (let i = 0; i < 4; i++) {
            const zone = document.getElementById(`playerZone-${i}`);
            const avatarEl = (zone && typeof zone.querySelector === 'function') ? zone.querySelector('.avatar') : null;
            if (avatarEl) {
                avatarEl.textContent = originalLabels[i];
            }
        }
    }

    manualRestart() {
        AudioSynth.init();
        AudioSynth.playClick();
        if (confirm("Bạn có muốn bắt đầu ván mới hoàn toàn? Điểm số sẽ được khôi phục về 0.")) {
            this.players.forEach(p => p.balance = 0);
            this.dealerIdx = 0;
            this.playDirection = 1;
            this.resetGame();
        }
    }

    resetGame() {
        this.restoreOriginalAvatars();
        this.players.forEach(p => p.reset());
        this.deck = [];
        this.drawPile = [];
        this.tableDiscards = [[], [], [], []];
        this.lastDiscardedCard = null;
        this.lastDiscardedPlayerIdx = -1;
        this.selectedEatCardIds = [];
        this.isDrawingOrEating = false;
        this.isReturningDiscards = false;
        this.meldStartIdx = 0;
        this.hasStartedDọnRác = false;
        this.roundNum = 1;
        this.turnStep = 'DEALING';
        this.chotRound = false;
        this.consecutiveEatenCounts = [0, 0, 0, 0];
        if (this.autoSendTimeout) {
            clearTimeout(this.autoSendTimeout);
            this.autoSendTimeout = null;
        }
        
        // Dealer moves to next player (or starts at 0)
        this.currentTurnIdx = this.dealerIdx;
        
        document.getElementById('gameOverModal').classList.remove('show');
        this.clearTableDOM();
        this.logMessage(`--- Ván mới bắt đầu. Người chia bài: ${this.players[this.dealerIdx].name} ---`, 'system');
        
        AudioSynth.playShuffle();
        this.initializeDeck();
        this.shuffleDeck();
        
        this.updateHUD();
        this.renderAll();
        
        // Start animated dealing
        this.dealCards();
    }

    startNextGame() {
        AudioSynth.playClick();
        if (this.isViewingHistoryRecord) {
            document.getElementById('gameOverModal').classList.remove('show');
            this.isViewingHistoryRecord = false;
            if (this.returnToHistoryOnClose) {
                document.getElementById('historyModal').classList.add('show');
                this.returnToHistoryOnClose = false;
            }
            return;
        }
        this.resetGame();
    }

    initializeDeck() {
        this.deck = [];
        for (let s = 0; s < 4; s++) {
            for (let r = 0; r < 13; r++) {
                this.deck.push(new Card(s, r));
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        // Dealer gets 10 cards, others 9
        let cardsToDeal = 9 * 4 + 1;
        let dealOrder = [];
        let curr = this.dealerIdx;
        
        let dealtCounts = [0, 0, 0, 0];
        while (dealtCounts.reduce((a,b)=>a+b, 0) < cardsToDeal) {
            let limit = (curr === this.dealerIdx) ? 10 : 9;
            if (dealtCounts[curr] < limit) {
                dealOrder.push(curr);
                dealtCounts[curr]++;
            }
            curr = (curr + this.playDirection + 4) % 4;
        }

        // Remaining deck goes to draw pile
        this.drawPile = [...this.deck];
        this.deck = [];
        
        this.turnStep = 'DEALING';
        this.updateHUD();

        let dealIndex = 0;
        const dealNextCard = () => {
            if (dealIndex >= dealOrder.length) {
                // Done dealing!
                this.sortHand(0);
                this.renderAll();
                
                // Start game flow
                if (this.currentTurnIdx === 0) {
                    this.turnStep = 'DISCARD'; // Dealer starts with 10 cards, so they discard immediately
                    this.logMessage(`Bạn chia được 10 lá bài. Hãy chọn 1 lá rác để Đánh!`, 'player');
                    this.updateHUD();
                    this.renderPlayerHand();
                } else {
                    this.turnStep = 'ACTION';
                    this.updateHUD();
                    // AI is dealer, so they discard immediately
                    setTimeout(() => this.runAIDiscardTurn(), 1000);
                }
                return;
            }

            let playerIdx = dealOrder[dealIndex];
            let card = this.drawPile.pop();
            this.players[playerIdx].addCard(card);

            // Render current hands
            if (playerIdx === 0) {
                this.sortHand(0);
                this.renderPlayerHand();
            } else {
                this.renderAIHands();
            }
            this.renderDrawPile();

            // Animate flying card from draw pile to player hand
            const drawPileEl = document.getElementById('drawPile');
            const startRect = drawPileEl ? drawPileEl.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2, width: 64, height: 88 };

            let targetCardEl = null;
            let showFront = (playerIdx === 0);
            
            if (playerIdx === 0) {
                targetCardEl = document.getElementById(card.id);
            } else {
                const container = document.getElementById('hand-' + playerIdx);
                targetCardEl = container ? container.lastElementChild : null;
            }

            if (targetCardEl) {
                targetCardEl.style.opacity = '0';
                const endRect = targetCardEl.getBoundingClientRect();
                
                AudioSynth.playSwoosh();
                this.animateCardFlying(card, startRect, endRect, showFront, () => {
                    targetCardEl.style.opacity = '1';
                    AudioSynth.playClick();
                    this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, showFront ? '#dfb76c' : '#1a1a1a');
                });
            }

            dealIndex++;
            setTimeout(dealNextCard, 100); // Deal pace (100ms per card)
        };

        dealNextCard();
    }

    clearTableDOM() {
        document.getElementById('discardArea').innerHTML = '';
        document.getElementById('playerHand').innerHTML = '';
        document.getElementById('hand-1').innerHTML = '';
        document.getElementById('hand-2').innerHTML = '';
        document.getElementById('hand-3').innerHTML = '';
        document.getElementById('eaten-0').innerHTML = '';
        document.getElementById('eaten-1').innerHTML = '';
        document.getElementById('eaten-2').innerHTML = '';
        document.getElementById('eaten-3').innerHTML = '';
        document.getElementById('melds-0').innerHTML = '';
        document.getElementById('melds-1').innerHTML = '';
        document.getElementById('melds-2').innerHTML = '';
        document.getElementById('melds-3').innerHTML = '';
    }

    sortHand(playerIdx) {
        let player = this.players[playerIdx];
        if (this.sortMode === 'RANK') {
            // Sort by rank value (A -> K), then suit
            player.hand.sort((a, b) => {
                if (a.rank !== b.rank) return a.rank - b.rank;
                return a.suit - b.suit;
            });
        } else {
            // Sort by suit (Bích -> Tép -> Rô -> Cơ), then rank
            player.hand.sort((a, b) => {
                if (a.suit !== b.suit) return a.suit - b.suit;
                return a.rank - b.rank;
            });
        }
    }

    toggleSort() {
        AudioSynth.playSort();
        this.sortMode = (this.sortMode === 'SUIT') ? 'RANK' : 'SUIT';
        this.sortHand(0);
        this.renderPlayerHand();
        this.logMessage(`Đã xếp bài theo: ${this.sortMode === 'SUIT' ? 'Chất (Cơ-Rô-Tép-Bích)' : 'Số (A-2-3...K)'}`, 'system');
    }

    // --- RENDERING HANDS & SCENE ---

    renderAll() {
        this.renderDrawPile();
        this.renderPlayerHand();
        this.renderAIHands();
        this.renderDiscardArea();
        this.renderEatenCards();
        this.renderMelds();
    }

    renderDrawPile() {
        const stack = document.getElementById('drawStack');
        stack.innerHTML = '';
        const count = this.drawPile.length;
        document.getElementById('pileCount').textContent = count;

        // Render layered visual stack
        let stackCount = Math.min(count, 8); // Render max 8 visual layers
        for (let i = 0; i < stackCount; i++) {
            let cardBack = document.createElement('div');
            cardBack.className = 'card-face card-face-back';
            cardBack.style.position = 'absolute';
            cardBack.style.top = '0px';
            cardBack.style.left = '0px';
            // Lift each layer up in Z
            cardBack.style.transform = `translateZ(${i * 1.5}px) rotateZ(${(i - stackCount/2)*1.5}deg)`;
            stack.appendChild(cardBack);
        }
    }

    createCardElement(card, isFlipped = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card-3d ${card.cssClass} ${isFlipped ? '' : 'flipped'}`;
        cardDiv.id = card.id;

        const isFaceCard = ['J', 'Q', 'K'].includes(card.symbol);
        const bgImageHTML = isFaceCard ? `<img class="card-bg-image" src="${card.symbol}.jpg" onerror="this.onerror=null; this.src='${card.symbol.toLowerCase()}.jpg';" />` : '';
        const centerSuitHTML = isFaceCard ? '' : `<div class="card-center-suit">${card.suitSymbol}</div>`;

        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-face-back"></div>
                <div class="card-face card-face-front">
                    ${bgImageHTML}
                    <div class="card-corner top-left">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                    <div class="card-corner top-right">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                    ${centerSuitHTML}
                    <div class="card-corner bottom-left">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                    <div class="card-corner bottom-right">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                </div>
            </div>
        `;
        return cardDiv;
    }

    renderPlayerHand() {
        const container = document.getElementById('playerHand');
        container.innerHTML = '';
        const hand = this.players[0].hand;
        const total = hand.length;
        
        hand.forEach((card, idx) => {
            const cardEl = this.createCardElement(card, true); // true = front facing
            
            // Calculate fan rotation & spacing (flat 2D arch)
            let angle = (idx - (total - 1) / 2) * 5; // Fan angle
            let offset = (idx - (total - 1) / 2) * 24; // Horizontal offset
            let archY = Math.abs(idx - (total - 1) / 2) * 2.5; // Push down slightly on edges to form an arc curve
            let zIndex = idx;
            
            cardEl.style.setProperty('--offset-x', `${offset}px`);
            cardEl.style.setProperty('--angle-z', `${angle}deg`);
            cardEl.style.setProperty('--arch-y', `${archY}px`);
            cardEl.style.zIndex = zIndex;

            let isSelected = (card.id === this.selectedCardId) || (this.selectedEatCardIds && this.selectedEatCardIds.includes(card.id));
            if (isSelected) {
                cardEl.classList.add('selected');
            }

            // Click listener for selecting card to discard or eat or swap
            cardEl.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click listener from deselecting
                let isSwapBlocked = false;
                if (this.currentTurnIdx === 0 && this.turnStep === 'ACTION' && this.lastDiscardedCard && this.canEatCard(0, this.lastDiscardedCard)) {
                    isSwapBlocked = true;
                }

                if (!isSwapBlocked) {
                    if (this.selectedCardId === null) {
                        AudioSynth.playClick();
                        this.selectedCardId = card.id;
                    } else if (this.selectedCardId === card.id) {
                        AudioSynth.playClick();
                        this.selectedCardId = null;
                    } else {
                        // Insert the first selected card to the right of the second card
                        let hand = this.players[0].hand;
                        let idxA = hand.findIndex(c => c.id === this.selectedCardId);
                        let idxB = hand.findIndex(c => c.id === card.id);
                        if (idxA !== -1 && idxB !== -1) {
                            let cardA = hand.splice(idxA, 1)[0];
                            let newIdxB = hand.findIndex(c => c.id === card.id);
                            hand.splice(newIdxB + 1, 0, cardA);
                            AudioSynth.playSort();
                        }
                        this.selectedCardId = null;
                    }
                    this.renderPlayerHand();
                    this.updateHUD();
                } else {
                    // Swapping is blocked
                    if (this.currentTurnIdx === 0) {
                        if (this.turnStep === 'DISCARD') {
                            AudioSynth.playClick();
                            if (this.selectedCardId === card.id) {
                                this.selectedCardId = null;
                            } else {
                                this.selectedCardId = card.id;
                            }
                            this.renderPlayerHand();
                            this.updateHUD();
                        } else if (this.turnStep === 'ACTION') {
                            AudioSynth.playClick();
                            if (this.selectedEatCardIds.includes(card.id)) {
                                this.selectedEatCardIds = this.selectedEatCardIds.filter(id => id !== card.id);
                            } else {
                                if (this.selectedEatCardIds.length < 3) {
                                    this.selectedEatCardIds.push(card.id);
                                } else {
                                    this.selectedEatCardIds.shift();
                                    this.selectedEatCardIds.push(card.id);
                                }
                            }
                            this.renderPlayerHand();
                            this.updateHUD();
                        }
                    }
                }
            });

            container.appendChild(cardEl);
        });
    }

    renderAIHands() {
        const showFront = this.hasStartedDọnRác || (this.turnStep === 'GAME_OVER');
        
        // East AI (Player 1) - Stacked vertically
        const container1 = document.getElementById('hand-1');
        container1.innerHTML = '';
        let count1 = this.players[1].hand.length;
        this.players[1].hand.forEach((card, i) => {
            let el = this.createCardElement(card, showFront);
            let offset = (i - (count1 - 1)/2) * 24;
            el.style.transform = `translateY(${offset}px)`;
            container1.appendChild(el);
        });

        // North AI (Player 2) - Stacked horizontally
        const container2 = document.getElementById('hand-2');
        container2.innerHTML = '';
        let count2 = this.players[2].hand.length;
        this.players[2].hand.forEach((card, i) => {
            let el = this.createCardElement(card, showFront);
            let offset = (i - (count2 - 1)/2) * 24;
            el.style.transform = `translateX(${offset}px)`;
            container2.appendChild(el);
        });

        // West AI (Player 3) - Stacked vertically
        const container3 = document.getElementById('hand-3');
        container3.innerHTML = '';
        let count3 = this.players[3].hand.length;
        this.players[3].hand.forEach((card, i) => {
            let el = this.createCardElement(card, showFront);
            let offset = (i - (count3 - 1)/2) * 24;
            el.style.transform = `translateY(${offset}px)`;
            container3.appendChild(el);
        });
    }

    renderDiscardArea() {
        const container = document.getElementById('discardArea');
        container.innerHTML = '';

        this.tableDiscards.forEach((slotCards, slotIdx) => {
            slotCards.forEach((card, pileIdx) => {
                const cardEl = this.createCardElement(card, true);
                let x = 0, y = 0, rot = 0;
                let visualIdx = slotIdx;
                if (this.playDirection === -1) {
                    visualIdx = (slotIdx - 2 + 4) % 4;
                }
                
                if (visualIdx === 0) { // Bottom plays to Right
                    x = 422 + (this.baseWidth - 760) - Math.abs(pileIdx - 1.5) * 12;
                    y = 220 + (this.baseHeight - 520) + pileIdx * 32;
                    rot = (pileIdx - 1.5) * 12;
                } else if (visualIdx === 1) { // Right plays to Top
                    x = 240 + (this.baseWidth - 760) + pileIdx * 32;
                    y = 20 + Math.abs(pileIdx - 1.5) * 12;
                    rot = (pileIdx - 1.5) * 12;
                } else if (visualIdx === 2) { // Top plays to Left
                    x = 40 + Math.abs(pileIdx - 1.5) * 12;
                    y = 20 + pileIdx * 32;
                    rot = -(pileIdx - 1.5) * 12;
                } else if (visualIdx === 3) { // Left plays to Bottom
                    x = 100 + pileIdx * 32;
                    y = 275 + (this.baseHeight - 520) - Math.abs(pileIdx - 1.5) * 12;
                    rot = -(pileIdx - 1.5) * 12;
                }

                cardEl.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
                cardEl.style.zIndex = pileIdx + 1;
                
                if (card === this.lastDiscardedCard) {
                    cardEl.style.boxShadow = '0px 0px 0px 3px #ffcc00, 4px 4px 0px rgba(0,0,0,0.4)';
                }

                container.appendChild(cardEl);
            });
        });
    }

    renderEatenCards() {
        this.renderMelds();
    }

    renderMelds() {
        this.players.forEach((p, idx) => {
            const container = document.getElementById(`melds-${idx}`);
            if (!container) return;
            container.innerHTML = '';
            
            // Create exactly 3 slots for each player
            const slots = [];
            for (let sIdx = 0; sIdx < 3; sIdx++) {
                const slot = document.createElement('div');
                slot.className = 'phom-slot';
                container.appendChild(slot);
                slots.push(slot);
            }
            
            let slotIdx = 0;
            
            // 1. Render eaten Phoms first into slots
            p.eaten.forEach((eatenPhom) => {
                if (slotIdx >= 3) return;
                const slot = slots[slotIdx++];
                
                const groupDiv = document.createElement('div');
                groupDiv.className = 'eaten-phom-group';
                groupDiv.style.left = '0px';
                
                // Keep the eaten card (eatenPhom[0]) at index 0, and sort the other cards by rank
                let sortedEatenPhom = [eatenPhom[0]];
                if (eatenPhom.length > 1) {
                    let restSorted = eatenPhom.slice(1).sort((a, b) => a.rank - b.rank);
                    sortedEatenPhom = sortedEatenPhom.concat(restSorted);
                }
                
                sortedEatenPhom.forEach((card, cardIdx) => {
                    let showFront = (cardIdx === 0) || this.hasStartedDọnRác || (this.turnStep === 'GAME_OVER');
                    const cardEl = this.createCardElement(card, showFront);
                    
                    let angle = 0;
                    let x = 0;
                    let y = 0;
                    
                    if (cardIdx === 0) { // Eaten card (middle, horizontal on top)
                        angle = 90;
                        x = 12;
                        y = 20;
                    } else {
                        // Ca cards & Sent cards
                        let caCount = sortedEatenPhom.length - 1;
                        if (caCount === 2) {
                            if (cardIdx === 1) {
                                angle = -15;
                                x = -4;
                                y = 0;
                            } else if (cardIdx === 2) {
                                angle = 15;
                                x = 28;
                                y = 0;
                            }
                        } else if (caCount === 3) {
                            if (cardIdx === 1) {
                                angle = -25;
                                x = -10;
                                y = 0;
                            } else if (cardIdx === 2) {
                                angle = 0;
                                x = 12;
                                y = 0;
                            } else if (cardIdx === 3) {
                                angle = 25;
                                x = 34;
                                y = 0;
                            }
                        } else if (caCount === 4) {
                            if (cardIdx === 1) {
                                angle = -30;
                                x = -15;
                                y = 0;
                            } else if (cardIdx === 2) {
                                angle = -10;
                                x = 8;
                                y = 0;
                            } else if (cardIdx === 3) {
                                angle = 10;
                                x = 30;
                                y = 0;
                            } else if (cardIdx === 4) {
                                angle = 30;
                                x = 52;
                                y = 0;
                            }
                        } else {
                            // Fallback for caCount >= 5
                            let step = 60 / (caCount - 1);
                            let startAngle = -30;
                            let startX = -15;
                            angle = startAngle + (cardIdx - 1) * step;
                            x = startX + (cardIdx - 1) * 22;
                            y = 0;
                        }
                    }
                    
                    cardEl.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
                    cardEl.style.zIndex = (cardIdx === 0) ? 2 : 1;
                    cardEl.style.pointerEvents = 'none';
                    groupDiv.appendChild(cardEl);
                });
                
                if (idx === 0) {
                    groupDiv.style.pointerEvents = 'auto';
                    groupDiv.style.cursor = 'pointer';
                    
                    const revealCards = (e) => {
                        e.preventDefault();
                        const cards = groupDiv.querySelectorAll('.card-3d');
                        cards.forEach(cardEl => {
                            cardEl.classList.remove('flipped');
                        });
                    };
                    
                    const hideCards = (e) => {
                        e.preventDefault();
                        const cards = groupDiv.querySelectorAll('.card-3d');
                        cards.forEach((cardEl, cIdx) => {
                            let showFront = (cIdx === 0) || this.hasStartedDọnRác || (this.turnStep === 'GAME_OVER');
                            if (!showFront) {
                                cardEl.classList.add('flipped');
                            }
                        });
                    };
                    
                    groupDiv.addEventListener('mousedown', revealCards);
                    groupDiv.addEventListener('touchstart', revealCards);
                    
                    groupDiv.addEventListener('mouseup', hideCards);
                    groupDiv.addEventListener('mouseleave', hideCards);
                    groupDiv.addEventListener('touchend', hideCards);
                }
                
                slot.appendChild(groupDiv);
            });
            
            // 2. Render hand Phoms next into remaining slots
            p.melds.forEach((meld) => {
                if (slotIdx >= 3) return;
                const slot = slots[slotIdx++];
                
                const meldStack = document.createElement('div');
                meldStack.className = 'meld-stack';
                
                // Sort copy by rank for correct visual order
                let sortedMeld = [...meld].sort((a, b) => a.rank - b.rank);
                meldStack.style.width = `${64 + (sortedMeld.length - 1) * 24}px`;
                
                sortedMeld.forEach((card, cardIdx) => {
                    const cardEl = this.createCardElement(card, true);
                    let x = cardIdx * 24;
                    cardEl.style.transform = `translate(${x}px, 0px)`;
                    cardEl.style.pointerEvents = 'none';
                    meldStack.appendChild(cardEl);
                });
                
                slot.appendChild(meldStack);
            });
        });
    }

    // --- GAME INTERACTION CONTROLS ---

    updateHUD() {
        // Toggle player turn and dealer indicators
        for (let i = 0; i < 4; i++) {
            const zone = document.getElementById(`playerZone-${i}`);
            const balanceEl = document.getElementById(`balance-${i}`);
            
            let currentPoints = this.players[i].matchEatPoints + this.players[i].matchPlacementPoints;
            balanceEl.textContent = `${currentPoints > 0 ? '+' : ''}${currentPoints} Điểm`;
            
            if (this.currentTurnIdx === i) {
                zone.classList.add('active');
            } else {
                zone.classList.remove('active');
            }

            if (this.dealerIdx === i) {
                zone.classList.add('is-dealer');
            } else {
                zone.classList.remove('is-dealer');
            }
        }

        // Active state of buttons for User (player 0)
        const isUserTurn = (this.currentTurnIdx === 0);
        const btnEat = document.getElementById('btnEat');
        const btnDiscard = document.getElementById('btnDiscard');
        const btnLayMelds = document.getElementById('btnLayMelds');

        // Reset all to disabled initially
        if (btnEat) btnEat.disabled = true;
        if (btnDiscard) btnDiscard.disabled = true;
        if (btnLayMelds) btnLayMelds.disabled = true;

        if (isUserTurn && !this.isReturningDiscards) {
            if (this.turnStep === 'ACTION') {
                // Can user eat the last discarded card?
                if (this.lastDiscardedCard && this.lastDiscardedPlayerIdx !== 0) {
                    if (this.selectedEatCardIds && (this.selectedEatCardIds.length === 2 || this.selectedEatCardIds.length === 3)) {
                        let selectedCards = this.selectedEatCardIds.map(id => this.players[0].hand.find(c => c.id === id));
                        if (this.isValidPhom(...selectedCards, this.lastDiscardedCard)) {
                            btnEat.disabled = false;
                        }
                    }
                }
            } else if (this.turnStep === 'DISCARD') {
                // Discard is active if a card is selected
                if (this.selectedCardId !== null) {
                    if (btnDiscard) btnDiscard.disabled = false;
                }
                // Check if user is eligible to U (0 or 1 rubbish card remaining in their 10-card hand)
                let partition = getBestPartitions(this.players[0].hand);
                if (partition.racs.length <= 1) {
                    if (btnLayMelds) btnLayMelds.disabled = false;
                }
            } else if (this.turnStep === 'LAY_MELDS') {
                if (btnLayMelds) btnLayMelds.disabled = false;
            }
        }

        // Toggle U highlight class on btnLayMelds
        let isEligibleU = false;
        if (isUserTurn && !this.isReturningDiscards && this.turnStep === 'DISCARD') {
            let partition = getBestPartitions(this.players[0].hand);
            if (partition.racs.length <= 1) {
                isEligibleU = true;
            }
        }
        if (btnLayMelds) {
            if (isEligibleU) {
                btnLayMelds.classList.add('highlight-u');
            } else {
                btnLayMelds.classList.remove('highlight-u');
            }
        }

        // Toggle active play direction indicators
        const dirCCW = document.getElementById('dirCCW');
        const dirCW = document.getElementById('dirCW');
        if (dirCCW && dirCW) {
            if (this.playDirection === 1) {
                dirCCW.classList.add('active');
                dirCW.classList.remove('active');
            } else {
                dirCW.classList.add('active');
                dirCCW.classList.remove('active');
            }
        }

        // Rumble stack effect when user can draw
        const drawStack = document.getElementById('drawStack');
        if (drawStack) {
            const canDraw = isUserTurn && !this.isReturningDiscards && this.turnStep === 'ACTION' && this.drawPile.length > 0;
            if (canDraw) {
                drawStack.classList.add('rumble');
            } else {
                drawStack.classList.remove('rumble');
            }
        }
    }

    showStatusBubble(playerIdx, text, duration = 2000) {
        const bubble = document.getElementById(`status-${playerIdx}`);
        if (!bubble) return;
        bubble.textContent = text;
        bubble.classList.add('show');
        setTimeout(() => {
            bubble.classList.remove('show');
        }, duration);
    }

    createPixelSplash(x, y, color = '#dfb76c') {
        const particleCount = 10;
        const colors = [color, '#ffffff', '#1a1a1a'];
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'pixel-particle';
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.style.background = colors[i % colors.length];
            
            const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const speed = 20 + Math.random() * 30;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            
            p.style.setProperty('--dx', `${dx}px`);
            p.style.setProperty('--dy', `${dy}px`);
            
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 400);
        }
    }

    animateCardFlying(card, startRect, endRect, showFront, callback, duration = 350) {
        const tempCard = document.createElement('div');
        tempCard.className = `card-3d ${card.cssClass} ${showFront ? '' : 'flipped'} animating-card`;
        
        tempCard.innerHTML = this.createCardElement(card, showFront).innerHTML;
        
        tempCard.style.position = 'fixed';
        tempCard.style.left = `${startRect.left}px`;
        tempCard.style.top = `${startRect.top}px`;
        tempCard.style.width = `${startRect.width}px`;
        tempCard.style.height = `${startRect.height}px`;
        tempCard.style.margin = '0';
        tempCard.style.zIndex = '9999';
        tempCard.style.transition = `all ${duration}ms steps(6)`;
        
        document.body.appendChild(tempCard);
        
        // Force reflow
        tempCard.offsetHeight;
        
        tempCard.style.left = `${endRect.left}px`;
        tempCard.style.top = `${endRect.top}px`;
        tempCard.style.width = `${endRect.width}px`;
        tempCard.style.height = `${endRect.height}px`;
        
        setTimeout(() => {
            tempCard.remove();
            if (callback) callback();
        }, duration);
    }

    animateULayMelds(playerIdx, callback) {
        let player = this.players[playerIdx];
        player.hasLaidMelds = true; // Hạ phỏm khi Ù
        let partition = getBestPartitions(player.hand);
        let animationsToRun = [];

        if (partition.phoms.length > 0) {
            // Collect source positions of the cards in their hand
            partition.phoms.forEach(phom => {
                phom.forEach(c => {
                    const cardEl = document.getElementById(c.id);
                    const startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                    animationsToRun.push({
                        card: c,
                        startRect: startRect
                    });
                });
            });

            // Update the data model
            player.melds = [...player.melds, ...partition.phoms];
            partition.phoms.forEach(phom => {
                phom.forEach(c => player.removeCard(c.id));
            });

            // Render hand and melds to set target DOM positions
            if (playerIdx === 0) {
                this.renderPlayerHand();
            } else {
                this.renderAIHands();
            }
            this.renderMelds();

            // Play the meld sound
            AudioSynth.playMeld();

            let animCount = animationsToRun.length;
            let finishedCount = 0;

            animationsToRun.forEach(anim => {
                const targetEl = document.getElementById(anim.card.id);
                if (anim.startRect && targetEl) {
                    targetEl.style.opacity = '0';
                    const endRect = targetEl.getBoundingClientRect();
                    AudioSynth.playSwoosh();
                    this.animateCardFlying(anim.card, anim.startRect, endRect, true, () => {
                        targetEl.style.opacity = '1';
                        AudioSynth.playClick();
                        this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');

                        finishedCount++;
                        if (finishedCount === animCount) {
                            if (callback) callback();
                        }
                    }, 550);
                } else {
                    finishedCount++;
                    if (finishedCount === animCount) {
                        if (callback) callback();
                    }
                }
            });
        } else {
            if (callback) callback();
        }
    }

    // --- TURN ACTIONS ---

    playerDraw() {
        if (this.currentTurnIdx !== 0 || this.turnStep !== 'ACTION') return;
        if (this.isDrawingOrEating) return;
        this.isDrawingOrEating = true;
        
        if (this.drawPile.length === 0) {
            this.logMessage(`Nọc đã hết bài. Bắt đầu hạ phỏm!`, 'system');
            this.startMeldPhase();
            this.isDrawingOrEating = false;
            return;
        }
        
        this.selectedEatCardIds = []; // Clear eat selections
        this.selectedCardId = null; // Clear discard selection immediately
        
        const drawPileEl = document.getElementById('drawPile');
        const startRect = drawPileEl ? drawPileEl.getBoundingClientRect() : { left: 0, top: 0, width: 64, height: 88 };

        AudioSynth.playSwoosh();
        let card = this.drawPile.pop();
        this.players[0].addCard(card);
        this.logMessage(`Bạn đã bốc 1 lá bài từ Nọc.`, 'player');
        
        this.renderDrawPile();
        this.renderPlayerHand();
        
        const targetCardEl = document.getElementById(card.id);
        if (targetCardEl) {
            targetCardEl.style.opacity = '0';
            const endRect = targetCardEl.getBoundingClientRect();
            
            this.animateCardFlying(card, startRect, endRect, true, () => {
                targetCardEl.style.opacity = '1';
                AudioSynth.playClick();
                this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');
                
                this.selectedCardId = null; // Do not auto select the drawn card
                this.turnStep = 'DISCARD';
                this.isDrawingOrEating = false;
                this.updateHUD();
            });
        } else {
            this.selectedCardId = null;
            this.turnStep = 'DISCARD';
            this.isDrawingOrEating = false;
            this.updateHUD();
        }
    }

    playerEat() {
        if (this.currentTurnIdx !== 0 || this.turnStep !== 'ACTION') return;
        if (this.isDrawingOrEating) return;
        this.isDrawingOrEating = true;
        
        if (!this.lastDiscardedCard) {
            this.isDrawingOrEating = false;
            return;
        }

        if (this.selectedEatCardIds.length < 2 || this.selectedEatCardIds.length > 3) {
            this.showStatusBubble(0, "Chọn 2 hoặc 3 lá cạ trên tay!", 2000);
            this.isDrawingOrEating = false;
            return;
        }

        let selectedCards = this.selectedEatCardIds.map(id => this.players[0].hand.find(c => c.id === id));

        if (!this.isValidPhom(...selectedCards, this.lastDiscardedCard)) {
            this.showStatusBubble(0, "Cạ chọn không hợp lệ!", 2000);
            this.isDrawingOrEating = false;
            return;
        }

        const cardEl = document.getElementById(this.lastDiscardedCard.id);
        const startRect = cardEl ? cardEl.getBoundingClientRect() : { left: 0, top: 0, width: 64, height: 88 };

        AudioSynth.playEat();
        
        let sourcePlayer = this.players[this.lastDiscardedPlayerIdx];
        let eatenSlotIdx = this.lastDiscardedPlayerIdx;

        let idx = this.tableDiscards[eatenSlotIdx].findIndex(c => c.id === this.lastDiscardedCard.id);
        if (idx !== -1) {
            this.tableDiscards[eatenSlotIdx].splice(idx, 1);
        }
        
        // Immediate penalty payment
        this.handleEatPenalty(this.lastDiscardedPlayerIdx, 0);

        this.applyEatShift(eatenSlotIdx);
        
        let eatenCard = this.lastDiscardedCard;
        // Remove the selected Cạ cards from hand
        selectedCards.forEach(c => this.players[0].removeCard(c.id));

        // Add to eaten
        let eatenPhom = [eatenCard, ...selectedCards];
        this.players[0].eaten.push(eatenPhom);
        
        this.logMessage(`Bạn đã ăn lá ${eatenCard.name} từ ${sourcePlayer.name}!`, 'player');
        this.showStatusBubble(0, "Ăn bài!", 1500);

        this.selectedEatCardIds = []; // Clear eat selections
        this.selectedCardId = null; // Clear discard selection immediately

        this.renderDiscardArea();
        this.renderEatenCards();
        this.renderPlayerHand();
        this.renderMelds();
        
        const targetEl = document.getElementById(eatenCard.id);
        if (targetEl) {
            targetEl.style.opacity = '0';
            const endRect = targetEl.getBoundingClientRect();
            
            this.animateCardFlying(eatenCard, startRect, endRect, true, () => {
                targetEl.style.opacity = '1';
                AudioSynth.playClick();
                this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#5cff9f');
                
                this.lastDiscardedCard = null;
                this.lastDiscardedPlayerIdx = -1;
                this.selectedCardId = null;
                this.turnStep = 'DISCARD';
                this.isDrawingOrEating = false;
                this.updateHUD();
            });
        } else {
            this.lastDiscardedCard = null;
            this.lastDiscardedPlayerIdx = -1;
            this.selectedCardId = null;
            this.turnStep = 'DISCARD';
            this.isDrawingOrEating = false;
            this.updateHUD();
        }
    }

    playerDiscard() {
        if (this.currentTurnIdx !== 0 || this.turnStep !== 'DISCARD') return;
        if (!this.selectedCardId) return;

        const cardEl = document.getElementById(this.selectedCardId);
        const startRect = cardEl ? cardEl.getBoundingClientRect() : { left: 0, top: 0, width: 64, height: 88 };

        AudioSynth.playClick();
        
        // Find card
        let card = this.players[0].removeCard(this.selectedCardId);
        if (card) {
            this.tableDiscards[0].push(card);
            this.players[0].discardCount++;
            this.lastDiscardedCard = card;
            this.lastDiscardedPlayerIdx = 0;
            this.logMessage(`Bạn đã đánh lá ${card.name}.`, 'player');
            
            this.selectedCardId = null;
            
            this.renderPlayerHand();
            this.renderDiscardArea();
            
            const targetEl = document.getElementById(card.id);
            if (targetEl) {
                targetEl.style.opacity = '0';
                const endRect = targetEl.getBoundingClientRect();
                
                this.animateCardFlying(card, startRect, endRect, true, () => {
                    targetEl.style.opacity = '1';
                    AudioSynth.playClick();
                    this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#ff5c5c');
                    
                    // Check for instant win (Ù) after discard?
                    let checkU = getBestPartitions(this.players[0].hand);
                    if (checkU.racs.length === 0) {
                        this.players[0].isU = true;
                        this.logMessage(`Bạn đã Ù!`, 'win');
                        this.showStatusBubble(0, "Ù!!! 🎉", 3000);
                        this.animateULayMelds(0, () => {
                            this.endGame();
                        });
                        return;
                    }

                    // Move to next player
                    this.nextTurn();
                });
            } else {
                this.nextTurn();
            }
        }
    }

    playerLayMelds() {
        if (this.currentTurnIdx !== 0) return;
        
        // If player clicks "Hạ phỏm" during DISCARD turn step to U
        if (this.turnStep === 'DISCARD') {
            let partition = getBestPartitions(this.players[0].hand);
            if (partition.racs.length <= 1) {
                // Yes, they can U!
                this.players[0].isU = true;
                
                let rubbishCard = null;
                let startRect = null;
                if (partition.racs.length === 1) {
                    rubbishCard = partition.racs[0];
                    const cardEl = document.getElementById(rubbishCard.id);
                    startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                    
                    // Modify data model for discard
                    this.players[0].removeCard(rubbishCard.id);
                    this.tableDiscards[0].push(rubbishCard);
                    this.players[0].discardCount++;
                    this.lastDiscardedCard = rubbishCard;
                    this.lastDiscardedPlayerIdx = 0;
                    this.logMessage(`Bạn đã đánh lá ${rubbishCard.name} và Ù!`, 'player');
                } else {
                    this.logMessage(`Bạn đã Ù (Ù khan)!`, 'player');
                }
                
                this.logMessage(`${this.players[0].name} đã Ù!`, 'alert');
                this.showStatusBubble(0, "Ù! 🎉", 3000);
                
                const performMeldAnimation = () => {
                    this.animateULayMelds(0, () => {
                        this.endGame();
                    });
                };
                
                if (rubbishCard && startRect) {
                    this.renderPlayerHand();
                    this.renderDiscardArea();
                    
                    const targetEl = document.getElementById(rubbishCard.id);
                    if (targetEl) {
                        targetEl.style.opacity = '0';
                        const endRect = targetEl.getBoundingClientRect();
                        AudioSynth.playSwoosh();
                        this.animateCardFlying(rubbishCard, startRect, endRect, true, () => {
                            targetEl.style.opacity = '1';
                            AudioSynth.playClick();
                            this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#1a1a1a');
                            
                            performMeldAnimation();
                        }, 550);
                    } else {
                        performMeldAnimation();
                    }
                } else {
                    performMeldAnimation();
                }
                return;
            }
        }

        if (this.turnStep !== 'LAY_MELDS') return;
        
        this.startPlayerMeldPhase(0, () => {
            AudioSynth.playClick();
            this.players[0].melds = [];
            this.players[0].hasLaidMelds = true; // Đã hạ bài
            
            let partition = getBestPartitions(this.players[0].hand);
            let totalMeldsCount = this.players[0].eaten.length + partition.phoms.length;
            let animationsToRun = [];

            if (totalMeldsCount > 0) {
                if (partition.phoms.length > 0) {
                    // Collect source positions before modifying data model
                    partition.phoms.forEach(phom => {
                        phom.forEach(c => {
                            const cardEl = document.getElementById(c.id);
                            const startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                            animationsToRun.push({
                                card: c,
                                startRect: startRect
                            });
                        });
                    });

                    this.players[0].melds = [...partition.phoms];
                    partition.phoms.forEach(phom => {
                        phom.forEach(c => this.players[0].removeCard(c.id));
                    });
                    
                    this.logMessage(`Bạn hạ thêm ${partition.phoms.length} Phỏm!`, 'player');
                    this.showStatusBubble(0, `Hạ ${partition.phoms.length} Phỏm!`, 2000);
                    AudioSynth.playMeld();
                } else {
                    this.logMessage(`Bạn hạ bài (Phỏm ăn có sẵn).`, 'player');
                    this.showStatusBubble(0, "Hạ bài!", 2000);
                }
            } else {
                this.players[0].isMom = true;
                this.logMessage(`Bạn không có Phỏm nào (Móm)!`, 'alert');
                this.showStatusBubble(0, "Móm!", 2000);
                this.players[0].isMom = true;
                AudioSynth.playLose();
            }

            this.renderPlayerHand();
            this.renderMelds();

            const proceed = () => {
                if (this.players[0].hand.length === 0) {
                    this.players[0].isU = true;
                    this.logMessage(`Bạn đã Ù (Ù hạ hết)!`, 'win');
                    this.showStatusBubble(0, "Ù!!! 🎉", 3000);
                    this.endGame();
                    return;
                }
                this.turnStep = 'SEND_CARDS';
                this.updateHUD();
                
                // Tự động gọi gửi bài sau 1.2 giây
                this.autoSendTimeout = setTimeout(() => this.playerSendCards(), 1200);
            };

            if (animationsToRun.length > 0) {
                let animCount = animationsToRun.length;
                let finishedCount = 0;
                
                animationsToRun.forEach(anim => {
                    const targetEl = document.getElementById(anim.card.id);
                    if (anim.startRect && targetEl) {
                        targetEl.style.opacity = '0';
                        const endRect = targetEl.getBoundingClientRect();
                        AudioSynth.playSwoosh();
                        this.animateCardFlying(anim.card, anim.startRect, endRect, true, () => {
                            targetEl.style.opacity = '1';
                            AudioSynth.playClick();
                            this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');
                            
                            finishedCount++;
                            if (finishedCount === animCount) {
                                proceed();
                            }
                        });
                    } else {
                        finishedCount++;
                        if (finishedCount === animCount) {
                            proceed();
                        }
                    }
                });
            } else {
                proceed();
            }
        });
    }

    playerSendCards() {
        if (this.currentTurnIdx !== 0 || this.turnStep !== 'SEND_CARDS') return;

        // Xóa bộ hẹn giờ nếu được gọi thủ công bằng nút bấm
        if (this.autoSendTimeout) {
            clearTimeout(this.autoSendTimeout);
            this.autoSendTimeout = null;
        }

        let animationsToRun = [];
        let hasNewSends = true;

        // Vòng lặp tìm kiếm và thực hiện gửi bài liên tiếp (chained sends)
        while (hasNewSends) {
            let sends = this.findPossibleSends(0);
            if (sends.length === 0 || this.players[0].isMom) {
                hasNewSends = false;
            } else {
                let uniqueSends = [];
                let seenCardIds = new Set();
                
                // Lọc để mỗi quân bài chỉ gửi đi 1 lần trong lượt quét này
                for (let send of sends) {
                    if (!seenCardIds.has(send.card.id)) {
                        seenCardIds.add(send.card.id);
                        uniqueSends.push(send);
                    }
                }
                
                if (uniqueSends.length === 0) {
                    hasNewSends = false;
                } else {
                    uniqueSends.forEach(send => {
                        const cardEl = document.getElementById(send.card.id);
                        const startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                        
                        let removed = this.players[0].removeCard(send.card.id);
                        if (removed) {
                            if (send.meldType === 'eaten') {
                                this.players[send.targetPlayerIdx].eaten[send.meldIdx].push(removed);
                            } else {
                                this.players[send.targetPlayerIdx].melds[send.meldIdx].push(removed);
                            }
                            
                            animationsToRun.push({
                                card: removed,
                                startRect: startRect
                            });
                            
                            this.logMessage(`Bạn gửi lá ${removed.name} vào Phỏm của ${this.players[send.targetPlayerIdx].name}.`, 'player');
                        }
                    });
                }
            }
        }

        if (animationsToRun.length > 0) {
            AudioSynth.playClick();
            this.showStatusBubble(0, `Gửi ${animationsToRun.length} lá!`, 2000);
        }

        this.renderPlayerHand();
        this.renderMelds();

        const proceed = () => {
            if (this.players[0].hand.length === 0) {
                this.players[0].isU = true;
                this.logMessage(`Bạn đã gửi hết bài và Ù!`, 'win');
                this.showStatusBubble(0, "Ù!!! 🎉", 3000);
                this.endGame();
                return;
            }
            let nextIdx = (this.currentTurnIdx + this.playDirection + 4) % 4;
            if (nextIdx === this.meldStartIdx) {
                this.endGame();
            } else {
                this.currentTurnIdx = nextIdx;
                this.turnStep = 'LAY_MELDS';
                this.updateSingleAvatarForMeldPhase(nextIdx);
                this.updateHUD();
                if (nextIdx !== 0) {
                    this.startPlayerMeldPhase(nextIdx, () => {
                        setTimeout(() => this.runAIMeldTurn(), 1200);
                    });
                }
            }
        };

        if (animationsToRun.length > 0) {
            let animCount = animationsToRun.length;
            let finishedCount = 0;
            
            animationsToRun.forEach(anim => {
                const targetEl = document.getElementById(anim.card.id);
                if (anim.startRect && targetEl) {
                    targetEl.style.opacity = '0';
                    const endRect = targetEl.getBoundingClientRect();
                    AudioSynth.playSwoosh();
                    this.animateCardFlying(anim.card, anim.startRect, endRect, true, () => {
                        targetEl.style.opacity = '1';
                        AudioSynth.playClick();
                        this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');
                        
                        finishedCount++;
                        if (finishedCount === animCount) {
                            proceed();
                        }
                    }, 550);
                } else {
                    finishedCount++;
                    if (finishedCount === animCount) {
                        proceed();
                    }
                }
            });
        } else {
            proceed();
        }
    }

    // --- GAME FLOW LOGIC ---

    nextTurn() {
        let prevTurnIdx = this.currentTurnIdx;
        this.currentTurnIdx = (this.currentTurnIdx + this.playDirection + 4) % 4;
        this.turnStep = 'ACTION';
        
        if (prevTurnIdx === 0) {
            this.selectedCardId = null; // Clear discard selection when user's turn ends
            this.selectedEatCardIds = []; // Clear selections when user's turn ends
        }

        // Auto-select matching Cạ cards if the user can eat when it becomes their turn
        if (this.currentTurnIdx === 0) {
            this.selectedEatCardIds = []; // Reset eat selections at start of user's turn
            if (this.lastDiscardedCard && this.lastDiscardedPlayerIdx !== 0) {
                let autoSelectIds = this.findValidEatCạ(0, this.lastDiscardedCard);
                if (autoSelectIds) {
                    this.selectedEatCardIds = autoSelectIds;
                    this.selectedCardId = null; // Clear pre-selected discard card to avoid double highlighting
                }
            }
        }
        
        // If draw pile is empty and the next player cannot eat, end the game by starting the Meld Phase
        let canEat = this.lastDiscardedCard && 
                     this.lastDiscardedPlayerIdx !== this.currentTurnIdx && 
                     this.canEatCard(this.currentTurnIdx, this.lastDiscardedCard);
        if (this.drawPile.length === 0 && !canEat) {
            this.logMessage(`Nọc đã hết bài và không thể ăn. Bắt đầu hạ phỏm!`, 'system');
            this.startMeldPhase();
            return;
        }

        // Update round count
        if (this.currentTurnIdx === this.dealerIdx) {
            this.roundNum++;
            this.logMessage(`--- Vòng ${this.roundNum} ---`, 'system');
        }

        this.updateHUD();
        this.renderAll();

        if (this.currentTurnIdx !== 0) {
            // AI Turn
            setTimeout(() => this.runAITurn(), 1200);
        }
    }

    startPlayerMeldPhase(playerIdx, callback) {
        this.hasStartedDọnRác = true;
        const discardIdx = (playerIdx - this.playDirection + 4) % 4; // Target the discard pile physically located in front of playerIdx
        const cards = this.tableDiscards[discardIdx] || [];
        if (cards.length === 0) {
            callback();
            return;
        }

        this.showStatusBubble(playerIdx, "Dọn rác", 1500);
        this.isReturningDiscards = true;
        this.updateHUD();
        this.renderAIHands();
        this.renderMelds();

        // 1. Flip all discard cards face down simultaneously
        cards.forEach(card => {
            const cardEl = document.getElementById(card.id);
            if (cardEl) {
                cardEl.classList.add('flipped');
            }
        });

        AudioSynth.playSort(); // Play flip sound

        // 2. Wait 300ms, then fly them simultaneously back to Nọc
        setTimeout(() => {
            AudioSynth.playShuffle(); // Play return sound

            let animCount = cards.length;
            let finishedCount = 0;

            const drawPileEl = document.getElementById('drawPile');
            const endRect = drawPileEl ? drawPileEl.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2, width: 64, height: 88 };

            cards.forEach(card => {
                const cardEl = document.getElementById(card.id);
                if (cardEl) {
                    const startRect = cardEl.getBoundingClientRect();
                    cardEl.style.opacity = '0';

                    this.animateCardFlying(card, startRect, endRect, false, () => {
                        this.drawPile.push(card);
                        this.renderDrawPile();

                        finishedCount++;
                        if (finishedCount === animCount) {
                            this.tableDiscards[discardIdx] = [];
                            this.renderDiscardArea();
                            this.isReturningDiscards = false;
                            this.updateHUD();
                            callback();
                        }
                    }, 650);
                } else {
                    this.drawPile.push(card);
                    this.renderDrawPile();

                    finishedCount++;
                    if (finishedCount === animCount) {
                        this.tableDiscards[discardIdx] = [];
                        this.renderDiscardArea();
                        this.isReturningDiscards = false;
                        this.updateHUD();
                        callback();
                    }
                }
            });
        }, 300);
    }

    startMeldPhase() {
        // Lay phom in turn order: start with the player discarded the last card of the game (in case it wasn't eaten)
        this.meldStartIdx = (this.lastDiscardedPlayerIdx + this.playDirection + 4) % 4;
        this.currentTurnIdx = this.meldStartIdx;
        this.turnStep = 'LAY_MELDS';
        this.logMessage(`--- HẠ PHỎM ---`, 'system');
        
        this.updateSingleAvatarForMeldPhase(this.currentTurnIdx);
        
        this.updateHUD();
        this.renderAll();
        
        if (this.currentTurnIdx !== 0) {
            this.startPlayerMeldPhase(this.currentTurnIdx, () => {
                setTimeout(() => this.runAIMeldTurn(), 1000);
            });
        }
    }

    // --- AI DECISION LOGIC ---

    runAITurn() {
        if (this.currentTurnIdx === 0) return; // Not AI's turn
        let ai = this.players[this.currentTurnIdx];
        
        this.logMessage(`Đến lượt ${ai.name}...`, 'system');
        
        // Step 1: Decision to Eat or Draw
        let ate = false;
        if (this.lastDiscardedCard && this.lastDiscardedPlayerIdx !== this.currentTurnIdx) {
            // Check if eat is possible and beneficial
            if (this.canEatCard(this.currentTurnIdx, this.lastDiscardedCard)) {
                // AI chooses a valid pair (Cạ) or triplet from hand to eat the card
                let possibleTriplets = [];
                for (let i = 0; i < ai.hand.length; i++) {
                    for (let j = i + 1; j < ai.hand.length; j++) {
                        for (let k = j + 1; k < ai.hand.length; k++) {
                            if (this.isValidPhom(ai.hand[i], ai.hand[j], ai.hand[k], this.lastDiscardedCard)) {
                                possibleTriplets.push([ai.hand[i], ai.hand[j], ai.hand[k]]);
                            }
                        }
                    }
                }
                let possiblePairs = [];
                for (let i = 0; i < ai.hand.length; i++) {
                    for (let j = i + 1; j < ai.hand.length; j++) {
                        if (this.isValidPhom(ai.hand[i], ai.hand[j], this.lastDiscardedCard)) {
                            possiblePairs.push([ai.hand[i], ai.hand[j]]);
                        }
                    }
                }
                let chosenMeld = possibleTriplets.length > 0 ? possibleTriplets[0] : possiblePairs[0];

                // Get coordinates before modifying state/DOM
                let eatenCard = this.lastDiscardedCard;
                const cardEl = document.getElementById(eatenCard.id);
                const startRect = cardEl ? cardEl.getBoundingClientRect() : { left: 0, top: 0, width: 64, height: 88 };

                AudioSynth.playEat();
                let sourcePlayer = this.players[this.lastDiscardedPlayerIdx];
                let eatenSlotIdx = this.lastDiscardedPlayerIdx;

                let idx = this.tableDiscards[eatenSlotIdx].findIndex(c => c.id === eatenCard.id);
                if (idx !== -1) {
                    this.tableDiscards[eatenSlotIdx].splice(idx, 1);
                }
                
                this.handleEatPenalty(this.lastDiscardedPlayerIdx, this.currentTurnIdx);

                this.applyEatShift(eatenSlotIdx);
                
                // Remove the Cạ cards from AI hand
                chosenMeld.forEach(c => ai.removeCard(c.id));

                // Add to eaten
                let eatenPhom = [eatenCard, ...chosenMeld];
                ai.eaten.push(eatenPhom);
                
                this.logMessage(`${ai.name} đã ăn lá ${eatenCard.name} từ ${sourcePlayer.name}!`, 'ai');
                this.showStatusBubble(this.currentTurnIdx, "Ăn bài!", 1500);
                
                this.lastDiscardedCard = null;
                this.lastDiscardedPlayerIdx = -1;
                ate = true;
                
                this.renderDiscardArea();
                this.renderEatenCards();
                this.renderAIHands();

                const targetEl = document.getElementById(eatenCard.id);
                if (targetEl) {
                    targetEl.style.opacity = '0';
                    const endRect = targetEl.getBoundingClientRect();
                    this.animateCardFlying(eatenCard, startRect, endRect, true, () => {
                        targetEl.style.opacity = '1';
                        AudioSynth.playClick();
                        this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#5cff9f');
                        
                        this.updateHUD();
                        setTimeout(() => { this.runAIDiscardTurn(); }, 800);
                    });
                    return; // exit and let animation finish
                }
            }
        }
        
        if (!ate) {
            if (this.drawPile.length === 0) {
                this.logMessage(`Nọc đã hết bài. Bắt đầu hạ phỏm!`, 'system');
                this.startMeldPhase();
                return;
            }
            // AI draws
            const drawPileEl = document.getElementById('drawPile');
            const startRect = drawPileEl ? drawPileEl.getBoundingClientRect() : { left: 0, top: 0, width: 64, height: 88 };

            AudioSynth.playSwoosh();
            let card = this.drawPile.pop();
            ai.addCard(card);
            this.logMessage(`${ai.name} đã bốc 1 lá từ Nọc.`, 'system');
            
            this.renderDrawPile();
            this.renderAIHands();
            
            // Find the new card back inside container
            const container = document.getElementById('hand-' + this.currentTurnIdx);
            const lastCardEl = container ? container.lastElementChild : null;
            if (lastCardEl) {
                lastCardEl.style.opacity = '0';
                const endRect = lastCardEl.getBoundingClientRect();
                this.animateCardFlying(card, startRect, endRect, false, () => {
                    lastCardEl.style.opacity = '1';
                    AudioSynth.playClick();
                    this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');
                    
                    this.updateHUD();
                    setTimeout(() => { this.runAIDiscardTurn(); }, 800);
                });
                return; // exit and let animation finish
            }
        }
        
        this.updateHUD();
        setTimeout(() => {
            this.runAIDiscardTurn();
        }, 1200);
    }

    runAIDiscardTurn() {
        let ai = this.players[this.currentTurnIdx];
        
        // Check if AI is Ù (before discard)
        let checkU = getBestPartitions(ai.hand);
        if (checkU.racs.length === 0) {
            ai.isU = true;
            this.logMessage(`${ai.name} đã Ù!`, 'alert');
            this.showStatusBubble(this.currentTurnIdx, "Ù khan! 🎉", 3000);
            this.animateULayMelds(this.currentTurnIdx, () => {
                this.endGame();
            });
            return;
        }

        // Find best card to discard
        let discardCard = this.chooseAIDiscard(this.currentTurnIdx);
        if (discardCard) {
            // Get starting rect: last card back of AI hand
            const container = document.getElementById('hand-' + this.currentTurnIdx);
            const lastCardEl = container ? container.lastElementChild : null;
            const startRect = lastCardEl ? lastCardEl.getBoundingClientRect() : { left: 0, top: 0, width: 64, height: 88 };

            ai.removeCard(discardCard.id);
            this.tableDiscards[this.currentTurnIdx].push(discardCard);
            ai.discardCount++;
            this.lastDiscardedCard = discardCard;
            this.lastDiscardedPlayerIdx = this.currentTurnIdx;
            this.logMessage(`${ai.name} đã đánh lá ${discardCard.name}.`, 'ai');
            
            this.renderDiscardArea();
            this.renderAIHands();

            const targetEl = document.getElementById(discardCard.id);
            if (targetEl) {
                targetEl.style.opacity = '0';
                const endRect = targetEl.getBoundingClientRect();
                
                this.animateCardFlying(discardCard, startRect, endRect, true, () => {
                    targetEl.style.opacity = '1';
                    AudioSynth.playClick();
                    this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#1a1a1a'); // black splash!
                    
                    // Check if AI is Ù (after discard - 9 cards remaining)
                    let checkU2 = getBestPartitions(ai.hand);
                    if (checkU2.racs.length === 0) {
                        ai.isU = true;
                        this.logMessage(`${ai.name} đã Ù!`, 'alert');
                        this.showStatusBubble(this.currentTurnIdx, "Ù! 🎉", 3000);
                        this.animateULayMelds(this.currentTurnIdx, () => {
                            this.endGame();
                        });
                        return;
                    }

                    this.nextTurn();
                });
            } else {
                this.nextTurn();
            }
        }
    }

    chooseAIDiscard(playerIdx) {
        let ai = this.players[playerIdx];
        let partition = getBestPartitions(ai.hand);
        let rubbish = partition.racs;
        
        // If no rubbish, choose any card that is not in a Phom
        if (rubbish.length === 0) {
            return ai.hand[0];
        }

        // Rank rubbish cards by suitability to discard
        // Priority: high point value (K, Q, J, 10...)
        // But also check if it is "safe" (next player unlikely to eat it)
        let bestCard = null;
        let highestScore = -Infinity;

        rubbish.forEach(card => {
            let score = card.rank * 10; // Baseline: higher rank is better to discard (minimize hand score)
            
            // Avoid breaking cạ (pairs like 7-8 or 7-7)
            let isCa = false;
            ai.hand.forEach(c => {
                if (c.id === card.id) return;
                // Same rank (e.g. 7-7)
                if (c.rank === card.rank) isCa = true;
                // Same suit, consecutive (e.g. 7-8 or 6-7)
                if (c.suit === card.suit && Math.abs(c.rank - card.rank) === 1) isCa = true;
                // Same suit, gap of 1 (e.g. 7-9)
                if (c.suit === card.suit && Math.abs(c.rank - card.rank) === 2) isCa = true;
            });
            if (isCa) {
                score -= 40; // Keep cạ if possible
            }

            // Check next player's profile (playerIdx + 1) % 4
            let nextPlayerIdx = (playerIdx + 1) % 4;
            let nextPlayer = this.players[nextPlayerIdx];
            
            // Standard safety check:
            // Has anyone already discarded this card value in the current round or game?
            // If yes, it's safer.
            let countInTable = 0;
            this.tableDiscards.forEach(slot => {
                slot.forEach(dc => {
                    if (dc.rank === card.rank && dc.suit === card.suit) countInTable++;
                });
            });
            
            if (countInTable > 0) {
                score += 30; // Safer
            }

            // Strict chốt round logic (4th discard card):
            // Discarding a card the next player eats is extremely costly (pays 4x bet, or đền bài)
            // If this is the 4th round, safety is #1 priority.
            if (ai.discardCount === 3) { // This is their 4th discard card
                score = (countInTable > 0) ? 1000 + card.rank : card.rank; // Safety override
                
                // Absolute safety: card of same rank is already thrown on table, next player did not eat
                let sameRankOnTable = false;
                this.tableDiscards.forEach(slot => {
                    slot.forEach(dc => {
                        if (dc.rank === card.rank) sameRankOnTable = true;
                    });
                });
                if (sameRankOnTable) {
                    score += 500; // Super safe
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestCard = card;
            }
        });

        return bestCard || rubbish[0];
    }

    runAIMeldTurn() {
        let ai = this.players[this.currentTurnIdx];
        ai.melds = [];
        ai.hasLaidMelds = true; // Đã hạ bài
        
        let partition = getBestPartitions(ai.hand);
        let totalMeldsCount = ai.eaten.length + partition.phoms.length;
        let animationsToRun = [];
        
        if (totalMeldsCount > 0) {
            if (partition.phoms.length > 0) {
                // Collect source positions of cards in the new AI phoms
                partition.phoms.forEach(phom => {
                    phom.forEach(c => {
                        const cardEl = document.getElementById(c.id);
                        const startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                        animationsToRun.push({
                            card: c,
                            startRect: startRect
                        });
                    });
                });

                ai.melds = [...partition.phoms];
                partition.phoms.forEach(phom => {
                    phom.forEach(c => ai.removeCard(c.id));
                });
                
                this.logMessage(`${ai.name} hạ thêm ${partition.phoms.length} Phỏm!`, 'ai');
                this.showStatusBubble(this.currentTurnIdx, `Hạ ${partition.phoms.length} Phỏm!`, 2000);
                AudioSynth.playMeld();
            } else {
                this.logMessage(`${ai.name} hạ bài (Phỏm ăn có sẵn).`, 'ai');
                this.showStatusBubble(this.currentTurnIdx, "Hạ bài!", 2000);
            }
        } else {
            ai.isMom = true;
            this.logMessage(`${ai.name} không có Phỏm (Móm)!`, 'alert');
            this.showStatusBubble(this.currentTurnIdx, "Móm!", 2000);
            AudioSynth.playLose();
        }

        this.renderAIHands();
        this.renderMelds();

        const proceed = () => {
            if (ai.hand.length === 0) {
                ai.isU = true;
                this.logMessage(`${ai.name} đã Ù (Ù hạ hết)!`, 'alert');
                this.showStatusBubble(this.currentTurnIdx, "Ù! 🎉", 3000);
                this.endGame();
                return;
            }
            this.turnStep = 'SEND_CARDS';
            this.updateHUD();

            setTimeout(() => {
                this.runAISendTurn();
            }, 1000);
        };

        if (animationsToRun.length > 0) {
            let animCount = animationsToRun.length;
            let finishedCount = 0;
            animationsToRun.forEach(anim => {
                const targetEl = document.getElementById(anim.card.id);
                if (anim.startRect && targetEl) {
                    targetEl.style.opacity = '0';
                    const endRect = targetEl.getBoundingClientRect();
                    AudioSynth.playSwoosh();
                    this.animateCardFlying(anim.card, anim.startRect, endRect, true, () => {
                        targetEl.style.opacity = '1';
                        AudioSynth.playClick();
                        this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');
                        
                        finishedCount++;
                        if (finishedCount === animCount) {
                            proceed();
                        }
                    });
                } else {
                    finishedCount++;
                    if (finishedCount === animCount) {
                        proceed();
                    }
                }
            });
        } else {
            proceed();
        }
    }

    runAISendTurn() {
        let ai = this.players[this.currentTurnIdx];
        let animationsToRun = [];
        
        let hasNewSends = true;
        while (hasNewSends) {
            let sends = this.findPossibleSends(this.currentTurnIdx);
            if (sends.length === 0 || ai.isMom) {
                hasNewSends = false;
            } else {
                let uniqueSends = [];
                let seenCardIds = new Set();
                for (let send of sends) {
                    if (!seenCardIds.has(send.card.id)) {
                        seenCardIds.add(send.card.id);
                        uniqueSends.push(send);
                    }
                }
                
                if (uniqueSends.length === 0) {
                    hasNewSends = false;
                } else {
                    uniqueSends.forEach(send => {
                        const cardEl = document.getElementById(send.card.id);
                        const startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                        
                        let removed = ai.removeCard(send.card.id);
                        if (removed) {
                            if (send.meldType === 'eaten') {
                                this.players[send.targetPlayerIdx].eaten[send.meldIdx].push(removed);
                            } else {
                                this.players[send.targetPlayerIdx].melds[send.meldIdx].push(removed);
                            }
                            
                            animationsToRun.push({
                                card: removed,
                                startRect: startRect
                            });
                            
                            this.logMessage(`${ai.name} gửi lá ${removed.name} vào Phỏm của ${this.players[send.targetPlayerIdx].name}.`, 'ai');
                        }
                    });
                }
            }
        }

        if (animationsToRun.length > 0) {
            AudioSynth.playClick();
            this.showStatusBubble(this.currentTurnIdx, `Gửi ${animationsToRun.length} lá!`, 2000);
        }

        this.renderAIHands();
        this.renderMelds();

        const proceed = () => {
            if (ai.hand.length === 0) {
                ai.isU = true;
                this.logMessage(`${ai.name} đã gửi hết bài và Ù!`, 'alert');
                this.showStatusBubble(this.currentTurnIdx, "Ù! 🎉", 3000);
                this.endGame();
                return;
            }
            let nextIdx = (this.currentTurnIdx + this.playDirection + 4) % 4;
            if (nextIdx === this.meldStartIdx) {
                this.endGame();
            } else {
                this.currentTurnIdx = nextIdx;
                this.turnStep = 'LAY_MELDS';
                this.updateSingleAvatarForMeldPhase(nextIdx);
                this.updateHUD();
                
                if (nextIdx !== 0) {
                    this.startPlayerMeldPhase(nextIdx, () => {
                        setTimeout(() => this.runAIMeldTurn(), 1200);
                    });
                }
            }
        };

        if (animationsToRun.length > 0) {
            let animCount = animationsToRun.length;
            let finishedCount = 0;
            
            animationsToRun.forEach(anim => {
                const targetEl = document.getElementById(anim.card.id);
                if (anim.startRect && targetEl) {
                    targetEl.style.opacity = '0';
                    const endRect = targetEl.getBoundingClientRect();
                    AudioSynth.playSwoosh();
                    this.animateCardFlying(anim.card, anim.startRect, endRect, true, () => {
                        targetEl.style.opacity = '1';
                        AudioSynth.playClick();
                        this.createPixelSplash(endRect.left + endRect.width/2, endRect.top + endRect.height/2, '#dfb76c');
                        
                        finishedCount++;
                        if (finishedCount === animCount) {
                            proceed();
                        }
                    }, 550);
                } else {
                    finishedCount++;
                    if (finishedCount === animCount) {
                        proceed();
                    }
                }
            });
        } else {
            proceed();
        }
    }

    // --- GAME ENGINE HELPERS ---

    isValidPhom(...args) {
        let cards = args;
        if (cards.length === 1 && Array.isArray(cards[0])) {
            cards = cards[0];
        }
        if (cards.length < 3 || cards.length > 4) return false;
        if (cards.some(c => !c)) return false;

        // Check Sap (same rank)
        let firstRank = cards[0].rank;
        let isSap = cards.every(c => c.rank === firstRank);
        if (isSap) return true;

        // Check Sanh (same suit, consecutive ranks)
        let firstSuit = cards[0].suit;
        let isSameSuit = cards.every(c => c.suit === firstSuit);
        if (isSameSuit) {
            let ranks = cards.map(c => c.rank).sort((a, b) => a - b);
            let isConsecutive = true;
            for (let i = 1; i < ranks.length; i++) {
                if (ranks[i] !== ranks[i - 1] + 1) {
                    isConsecutive = false;
                    break;
                }
            }
            if (isConsecutive) return true;
        }
        return false;
    }

    findValidEatCạ(playerIdx, card) {
        let player = this.players[playerIdx];
        let hand = player.hand;
        
        // Prefer triplets to make Phom of 4 (quad)
        for (let i = 0; i < hand.length; i++) {
            for (let j = i + 1; j < hand.length; j++) {
                for (let k = j + 1; k < hand.length; k++) {
                    if (this.isValidPhom(hand[i], hand[j], hand[k], card)) {
                        return [hand[i].id, hand[j].id, hand[k].id];
                    }
                }
            }
        }
        
        // Fallback to pairs to make Phom of 3
        for (let i = 0; i < hand.length; i++) {
            for (let j = i + 1; j < hand.length; j++) {
                if (this.isValidPhom(hand[i], hand[j], card)) {
                    return [hand[i].id, hand[j].id];
                }
            }
        }
        
        return null;
    }

    canEatCard(playerIdx, card) {
        return this.findValidEatCạ(playerIdx, card) !== null;
    }

    findPossibleSends(playerIdx) {
        let player = this.players[playerIdx];
        if (player.isMom) return []; // Mom players cannot send cards

        let hand = [...player.hand];
        let possibleSends = []; // Items of { card: Card, targetPlayerIdx: number, meldIdx: number }

        // Go through each card on hand
        hand.forEach(card => {
            // Scan other players' Phoms (and own Phoms)
            this.players.forEach((targetPlayer, targetIdx) => {
                // CHỈ CHO PHÉP gửi tới người chơi khác khi họ đã hạ bài
                if (targetIdx !== playerIdx && !targetPlayer.hasLaidMelds) {
                    return;
                }

                // Hand Phoms
                targetPlayer.melds.forEach((meld, meldIdx) => {
                    if (this.canExtendMeld(meld, card)) {
                        possibleSends.push({
                            card: card,
                            targetPlayerIdx: targetIdx,
                            meldType: 'meld',
                            meldIdx: meldIdx
                        });
                    }
                });
                // Eaten Phoms
                targetPlayer.eaten.forEach((meld, meldIdx) => {
                    if (this.canExtendMeld(meld, card)) {
                        possibleSends.push({
                            card: card,
                            targetPlayerIdx: targetIdx,
                            meldType: 'eaten',
                            meldIdx: meldIdx
                        });
                    }
                });
            });
        });

        return possibleSends;
    }

    canExtendMeld(meld, card) {
        if (meld.length === 0) return false;
        
        // 1. Sap extension (same rank)
        if (meld[0].rank === card.rank) {
            // If meld is a Sap (all same rank)
            let isSap = meld.every(c => c.rank === meld[0].rank);
            if (isSap && meld.length < 4) {
                return true;
            }
        }

        // 2. Sanh extension (consecutive suit run)
        if (meld[0].suit === card.suit) {
            // Sort existing meld by rank
            let sortedMeld = [...meld].sort((a, b) => a.rank - b.rank);
            let minRank = sortedMeld[0].rank;
            let maxRank = sortedMeld[sortedMeld.length - 1].rank;
            
            // Check if card fits right at start or end of consecutive sequence
            if (card.rank === minRank - 1 || card.rank === maxRank + 1) {
                // Confirm it is actually a Sanh (different ranks sequence)
                let isSanh = sortedMeld.every((c, idx) => idx === 0 || c.rank === sortedMeld[idx-1].rank + 1);
                if (isSanh) return true;
            }
        }

        return false;
    }

    handleEatPenalty(payerIdx, earnerIdx) {
        let payer = this.players[payerIdx];
        let earner = this.players[earnerIdx];
        
        let isChot = (payer.discardCount === 4);
        let points = isChot ? 2 : 1;
        
        payer.balance -= points;
        earner.balance += points;
        
        payer.matchEatPoints -= points;
        earner.matchEatPoints += points;

        // Visual effects
        this.createFloatingTextOnPlayer(payerIdx, `-${points} Điểm`, true, false);
        this.createFloatingTextOnPlayer(earnerIdx, `+${points} Điểm`, false, true);

        if (isChot) {
            AudioSynth.playChot();
            this.logMessage(`[CHỐT!] ${earner.name} đã ăn CHỐT của ${payer.name}! (+2 Điểm)`, 'alert');
        } else {
            this.logMessage(`${earner.name} ăn bài của ${payer.name}. (+1 Điểm)`, 'system');
        }

        // Decrement payer's discardCount since their discarded card was eaten
        payer.discardCount--;

        // Track consecutive eats for đền bài (eating 3 times in a row leads to paying for everyone)
        // If player A got eaten by player B (who is A's next player), we increment consecutive counts
        if ((payerIdx + 1) % 4 === earnerIdx) {
            this.consecutiveEatenCounts[payerIdx]++;
            if (this.consecutiveEatenCounts[payerIdx] === 3) {
                this.logMessage(`[ĐỀN BÀI!] ${payer.name} đã bị ${earner.name} ăn 3 lá liên tục! Nguy cơ đền bài cực cao!`, 'alert');
                this.showStatusBubble(payerIdx, "Đền bài!", 3000);
            }
        }
    }

    applyEatShift(eatenPlayerIdx) {
        let target = eatenPlayerIdx;
        let prev1 = (target - this.playDirection + 4) % 4;
        let prev2 = (target - 2 * this.playDirection + 8) % 4;
        let prev3 = (target - 3 * this.playDirection + 12) % 4;

        let shifts = [
            { from: prev1, to: target },
            { from: prev2, to: prev1 },
            { from: prev3, to: prev2 }
        ];

        // Gather start rects before modifying state/DOM
        let shiftActions = [];
        let currentLengths = this.tableDiscards.map(slot => slot.length);

        shifts.forEach(s => {
            if (currentLengths[s.from] > currentLengths[s.to]) {
                let slot = this.tableDiscards[s.from];
                if (slot.length > 0) {
                    let card = slot[slot.length - 1]; // Peak the top card
                    const cardEl = document.getElementById(card.id);
                    const startRect = cardEl ? cardEl.getBoundingClientRect() : null;
                    shiftActions.push({
                        card: card,
                        from: s.from,
                        to: s.to,
                        startRect: startRect
                    });
                    currentLengths[s.from]--;
                    currentLengths[s.to]++;
                }
            }
        });

        if (shiftActions.length === 0) return;

        // Perform all state updates synchronously
        shiftActions.forEach(action => {
            this.tableDiscards[action.from].pop();
            this.tableDiscards[action.to].push(action.card);
            
            // Sync players' discardCount
            this.players[action.from].discardCount--;
            this.players[action.to].discardCount++;
            
            this.logMessage(`Chuyển bài rác ${action.card.name} từ khay của ${this.players[action.from].name} sang khay của ${this.players[action.to].name}.`, 'system');
        });

        // Render DOM once after all shifts are applied
        this.renderDiscardArea();

        // Animate all shifts simultaneously
        shiftActions.forEach(action => {
            const targetEl = document.getElementById(action.card.id);
            if (action.startRect && targetEl) {
                targetEl.style.opacity = '0';
                const endRect = targetEl.getBoundingClientRect();
                AudioSynth.playSwoosh();
                this.animateCardFlying(action.card, action.startRect, endRect, true, () => {
                    targetEl.style.opacity = '1';
                    AudioSynth.playClick();
                });
            }
        });
    }

    getPlayerAllPhoms(p) {
        let allPhoms = [...p.melds, ...p.eaten];
        let handPhoms = getBestPartitions(p.hand).phoms || [];
        handPhoms.forEach(hp => {
            let isAlreadyIncluded = hp.some(hc => 
                allPhoms.some(ap => ap.some(ac => ac.id === hc.id))
            );
            if (!isAlreadyIncluded) {
                allPhoms.push(hp);
            }
        });
        return allPhoms;
    }

    // --- GAME END & PAYMENTS ---

    endGame() {
        this.logMessage(`--- VÁN ĐẤU KẾT THÚC ---`, 'system');
        this.turnStep = 'GAME_OVER';

        // Determine Mom status dynamically for all players at the end of the game
        this.players.forEach(p => {
            let allPhoms = this.getPlayerAllPhoms(p);
            p.isMom = (allPhoms.length === 0);
        });

        // Calculate scores for players who did not U
        // If someone U'd, they are automatically 1st and others pay them
        let uPlayer = this.players.find(p => p.isU);
        
        // Calculate scores for players (U is 0, Mom is 999)
        this.players.forEach(p => {
            let partition = getBestPartitions(p.hand);
            p.score = p.isMom ? 999 : (p.isU ? 0 : partition.score);
        });

        // Sort players to decide placements
        // Rank from lowest score to highest score
        let sortedPlayers = [...this.players].sort((a, b) => {
            if (a.isU && !b.isU) return -1;
            if (!a.isU && b.isU) return 1;
            
            if (a.isMom && !b.isMom) return 1;
            if (!a.isMom && b.isMom) return -1;
            
            if (a.score !== b.score) return a.score - b.score;
            
            // Proximity to meld start (closer to meldStartIdx in turn order lays down earlier)
            let distA = (a.id - this.meldStartIdx) * this.playDirection;
            distA = (distA % 4 + 4) % 4;
            let distB = (b.id - this.meldStartIdx) * this.playDirection;
            distB = (distB % 4 + 4) % 4;
            return distA - distB;
        });

        // Assign placement indices
        sortedPlayers.forEach((p, idx) => {
            p.placement = idx + 1; // 1st, 2nd, 3rd, 4th
        });

        // Calculate points based on the number of Móm players
        let numMom = this.players.filter(p => p.isMom).length;
        let pointChanges = [0, 0, 0, 0]; // index matches player.id
        let winner = sortedPlayers[0];

        if (uPlayer) {
            // Khi một người Ù thì thu mỗi người 2 điểm (Ù thắng thu mỗi người 2đ, tức là +6đ)
            this.players.forEach(p => {
                if (p.id === uPlayer.id) {
                    pointChanges[p.id] = 6;
                    p.placement = 1;
                } else {
                    pointChanges[p.id] = -2;
                    p.placement = 4;
                }
            });
            this.logMessage(`${uPlayer.name} đã Ù thắng tuyệt đối! Thu mỗi người 2 điểm (+6 Điểm).`, 'win');
        } else {
            if (numMom === 4) {
                // Cả 4 người bị Móm thì không ai chiến thắng.
                this.players.forEach(p => {
                    pointChanges[p.id] = 0;
                    p.placement = 4;
                });
                this.logMessage("Cả 4 người chơi đều bị Móm. Ván này hòa, không ai nhận điểm.", "alert");
            } else if (numMom === 3) {
                // Trường hợp 3 người bị Móm thì cả 3 người bị móm mỗi người -1; Nhất +3;
                this.players.forEach(p => {
                    if (p.isMom) {
                        pointChanges[p.id] = -1;
                        p.placement = 4;
                    } else {
                        pointChanges[p.id] = 3;
                        p.placement = 1;
                    }
                });
                this.logMessage(`3 người bị Móm. ${winner.name} (Nhất) +3 điểm, 3 người móm mỗi người -1 điểm.`, "system");
            } else if (numMom === 2) {
                // Trường hợp 2 người bị móm thì mỗi người bị móm -2; Nhất +3; Nhì +1
                let nonMomPlayers = sortedPlayers.filter(p => !p.isMom);
                let p1st = nonMomPlayers[0];
                let p2nd = nonMomPlayers[1];
                
                pointChanges[p1st.id] = 3;
                pointChanges[p2nd.id] = 1;
                
                this.players.forEach(p => {
                    if (p.isMom) {
                        pointChanges[p.id] = -2;
                        p.placement = 4;
                    }
                });
                this.logMessage(`2 người bị Móm. ${p1st.name} (Nhất) +3 điểm, ${p2nd.name} (Nhì) +1 điểm, 2 người móm mỗi người -2 điểm.`, "system");
            } else if (numMom === 1) {
                // Trường hợp 1 người Móm thì người móm -3; Nhất +2; Nhì +1
                let nonMomPlayers = sortedPlayers.filter(p => !p.isMom);
                let p1st = nonMomPlayers[0];
                let p2nd = nonMomPlayers[1];
                let p3rd = nonMomPlayers[2];
                
                pointChanges[p1st.id] = 2;
                pointChanges[p2nd.id] = 1;
                pointChanges[p3rd.id] = 0;
                
                this.players.forEach(p => {
                    if (p.isMom) {
                        pointChanges[p.id] = -3;
                        p.placement = 4;
                    }
                });
                this.logMessage(`1 người bị Móm. ${p1st.name} (Nhất) +2 điểm, ${p2nd.name} (Nhì) +1 điểm, ${p3rd.name} (Ba) 0 điểm, ${this.players.find(p => p.isMom).name} (Móm) -3 điểm.`, "system");
            } else {
                // numMom === 0
                // Nhất +2; Nhì +1; Ba -1 và Bét -2
                let p1st = sortedPlayers[0];
                let p2nd = sortedPlayers[1];
                let p3rd = sortedPlayers[2];
                let p4th = sortedPlayers[3];
                
                pointChanges[p1st.id] = 2;
                pointChanges[p2nd.id] = 1;
                pointChanges[p3rd.id] = -1;
                pointChanges[p4th.id] = -2;
                this.logMessage(`Không ai bị Móm. ${p1st.name} (Nhất) +2 điểm, ${p2nd.name} (Nhì) +1 điểm, ${p3rd.name} (Ba) -1 điểm, ${p4th.name} (Bét) -2 điểm.`, "system");
            }
        }

        // Apply point changes to balance
        this.players.forEach(p => {
            p.balance += pointChanges[p.id];
            p.matchPlacementPoints = pointChanges[p.id];
            let changeVal = pointChanges[p.id];
            if (changeVal > 0) {
                this.createFloatingTextOnPlayer(p.id, `+${changeVal} Điểm`, false, true);
            } else if (changeVal < 0) {
                this.createFloatingTextOnPlayer(p.id, `${changeVal} Điểm`, true, false);
            } else {
                this.createFloatingTextOnPlayer(p.id, `0 Điểm`, false, false);
            }
        });

        // Log final actual match score changes
        let finalChangesStr = this.players.map(p => {
            let matchChange = p.matchEatPoints + p.matchPlacementPoints;
            return `${p.name}: ${matchChange > 0 ? '+' : ''}${matchChange} Điểm`;
        }).join(', ');
        this.logMessage(`Tổng kết điểm ván này: ${finalChangesStr}.`, 'system');

        // Save scores to history (net match score change: placement points + eat points)
        this.scoreHistory.push(this.players.map(p => p.matchPlacementPoints + p.matchEatPoints));

        // Save detailed record for history playback
        let sorted = [...this.players].sort((a, b) => a.placement - b.placement);
        let record = {
            roundNumber: this.scoreHistory.length,
            allMom: this.players.every(pl => pl.isMom),
            winnerName: sorted[0] ? sorted[0].name : '',
            winnerId: sorted[0] ? sorted[0].id : -1,
            winnerIsU: sorted[0] ? sorted[0].isU : false,
            players: sorted.map(p => {
                let allPhoms = this.getPlayerAllPhoms(p);
                let phomsText = 'Không';
                if (p.isU) {
                    let uPhomsStr = allPhoms.map(meld => meld.map(c => c.symbol + c.suitSymbol).join('-')).join(', ');
                    phomsText = uPhomsStr ? `Ù (${uPhomsStr})` : 'Ù';
                } else if (allPhoms.length > 0) {
                    phomsText = allPhoms.map(meld => meld.map(c => c.symbol + c.suitSymbol).join('-')).join(', ');
                } else if (p.isMom) {
                    phomsText = 'Móm (Cháy)';
                }

                let resultText = '';
                let textColor = '';
                let fontWeight = 'normal';
                let allMom = this.players.every(pl => pl.isMom);
                if (allMom) {
                    resultText = 'Móm';
                    textColor = '#ff5252';
                } else {
                    if (p.placement === 1) {
                        resultText = p.isU ? 'Ù Thắng' : 'Nhất';
                        textColor = '#72ff9f';
                        fontWeight = 'bold';
                    } else if (p.placement === 2) {
                        resultText = 'Nhì';
                    } else if (p.placement === 3) {
                        resultText = 'Ba';
                    } else {
                        resultText = p.isMom ? 'Móm (Bét)' : 'Bét';
                        textColor = '#ff5252';
                    }
                }

                let matchChange = (p.matchEatPoints || 0) + (p.matchPlacementPoints || 0);
                let breakdown = [];
                if ((p.matchPlacementPoints || 0) !== 0 || resultText !== '') {
                    breakdown.push(`${p.matchPlacementPoints > 0 ? '+' : ''}${p.matchPlacementPoints} ${resultText}`);
                }
                if ((p.matchEatPoints || 0) !== 0) {
                    breakdown.push(`${p.matchEatPoints > 0 ? '+' : ''}${p.matchEatPoints} ${p.matchEatPoints > 0 ? 'Ăn' : 'Bị ăn'}`);
                }
                let breakdownStr = breakdown.length > 0 ? ` (${breakdown.join(', ')})` : '';

                return {
                    name: p.name,
                    id: p.id,
                    phomsText: phomsText,
                    scoreText: p.isMom || p.isU ? '-' : p.score,
                    resultText: resultText,
                    textColor: textColor,
                    fontWeight: fontWeight,
                    matchChange: matchChange,
                    breakdownStr: breakdownStr,
                    balance: p.balance
                };
            })
        };
        this.gameHistoryRecords.push(record);

        // Play sounds
        if (uPlayer) {
            AudioSynth.playU();
        } else if (numMom === 4) {
            AudioSynth.playLose();
        } else if (winner.id === 0) {
            AudioSynth.playWin();
        } else {
            AudioSynth.playLose();
        }

        // Determine dealer for next game: winner (placement === 1) of current game. If tie (4 Mom), rotate dealer
        let winnerOfGame = this.players.find(p => p.placement === 1);
        if (winnerOfGame) {
            this.dealerIdx = winnerOfGame.id;
            this.logMessage(`Người đứng Nhất (${winnerOfGame.name}) sẽ là người chia bài ván tiếp theo.`, 'system');
        } else {
            this.dealerIdx = (this.dealerIdx + this.playDirection + 4) % 4;
            this.logMessage(`Ván đấu hòa. Người chia bài xoay vòng sang: ${this.players[this.dealerIdx].name}.`, 'system');
        }

        // Alternate play direction for the next game
        this.playDirection = this.playDirection === 1 ? -1 : 1;
        let directionStr = this.playDirection === 1 ? "Ngược Chiều Kim Đồng Hồ" : "Thuận Chiều Kim Đồng Hồ";
        this.logMessage(`Hướng chơi và chia bài của ván tiếp theo sẽ là: ${directionStr}.`, 'system');

        this.renderAll();
        this.updateHUD();
        setTimeout(() => {
            this.showGameOverModal();
        }, 1000);
    }

    showGameOverModal(pastRecord = null) {
        const body = document.getElementById('scoreTableBody');
        body.innerHTML = '';

        const titleEl = document.getElementById('gameOverTitle');
        const btnNextGame = document.getElementById('btnNextGame');
        const announcement = document.getElementById('winnerAnnouncement');

        let dataSrc;
        if (pastRecord) {
            this.isViewingHistoryRecord = true;
            if (titleEl) titleEl.textContent = `Kết Quả Ván ${pastRecord.roundNumber}`;
            if (btnNextGame) btnNextGame.textContent = 'Đóng';
            dataSrc = pastRecord;
        } else {
            this.isViewingHistoryRecord = false;
            if (titleEl) titleEl.textContent = 'Kết Quả Ván Đấu';
            if (btnNextGame) btnNextGame.textContent = 'Chia Bài';
            
            // Build dynamic record from current state
            let sorted = [...this.players].sort((a, b) => a.placement - b.placement);
            let tempRecord = {
                roundNumber: this.scoreHistory.length,
                allMom: this.players.every(pl => pl.isMom),
                winnerName: sorted[0] ? sorted[0].name : '',
                winnerId: sorted[0] ? sorted[0].id : -1,
                winnerIsU: sorted[0] ? sorted[0].isU : false,
                players: sorted.map(p => {
                    let allPhoms = this.getPlayerAllPhoms(p);
                    let phomsText = 'Không';
                    if (p.isU) {
                        let uPhomsStr = allPhoms.map(meld => meld.map(c => c.symbol + c.suitSymbol).join('-')).join(', ');
                        phomsText = uPhomsStr ? `Ù (${uPhomsStr})` : 'Ù';
                    } else if (allPhoms.length > 0) {
                        phomsText = allPhoms.map(meld => meld.map(c => c.symbol + c.suitSymbol).join('-')).join(', ');
                    } else if (p.isMom) {
                        phomsText = 'Móm (Cháy)';
                    }

                    let resultText = '';
                    let textColor = '';
                    let fontWeight = 'normal';
                    let allMom = this.players.every(pl => pl.isMom);
                    if (allMom) {
                        resultText = 'Móm';
                        textColor = '#ff5252';
                    } else {
                        if (p.placement === 1) {
                            resultText = p.isU ? 'Ù Thắng' : 'Nhất';
                            textColor = '#72ff9f';
                            fontWeight = 'bold';
                        } else if (p.placement === 2) {
                            resultText = 'Nhì';
                        } else if (p.placement === 3) {
                            resultText = 'Ba';
                        } else {
                            resultText = p.isMom ? 'Móm (Bét)' : 'Bét';
                            textColor = '#ff5252';
                        }
                    }

                    let matchChange = (p.matchEatPoints || 0) + (p.matchPlacementPoints || 0);
                    let breakdown = [];
                    if ((p.matchPlacementPoints || 0) !== 0 || resultText !== '') {
                        breakdown.push(`${p.matchPlacementPoints > 0 ? '+' : ''}${p.matchPlacementPoints} ${resultText}`);
                    }
                    if ((p.matchEatPoints || 0) !== 0) {
                        breakdown.push(`${p.matchEatPoints > 0 ? '+' : ''}${p.matchEatPoints} ${p.matchEatPoints > 0 ? 'Ăn' : 'Bị ăn'}`);
                    }
                    let breakdownStr = breakdown.length > 0 ? ` (${breakdown.join(', ')})` : '';

                    return {
                        name: p.name,
                        id: p.id,
                        phomsText: phomsText,
                        scoreText: p.isMom || p.isU ? '-' : p.score,
                        resultText: resultText,
                        textColor: textColor,
                        fontWeight: fontWeight,
                        matchChange: matchChange,
                        breakdownStr: breakdownStr,
                        balance: p.balance
                    };
                })
            };
            dataSrc = tempRecord;
        }

        // Render rows
        dataSrc.players.forEach(p => {
            const tr = document.createElement('tr');
            if (p.textColor) tr.style.color = p.textColor;
            if (p.fontWeight) tr.style.fontWeight = p.fontWeight;

            tr.innerHTML = `
                <td>${p.name} ${p.id === 0 ? '(Ta)' : ''}</td>
                <td>${p.phomsText}</td>
                <td>${p.scoreText}</td>
                <td>${p.resultText}</td>
                <td>
                    ${p.matchChange > 0 ? '+' : ''}${p.matchChange} Điểm${p.breakdownStr}
                    <br><span style="font-size: 0.85em; color: #aaa296; font-weight: normal;">(Tổng: ${p.balance > 0 ? '+' : ''}${p.balance}đ)</span>
                </td>
            `;
            body.appendChild(tr);
        });

        // Set title announcement
        if (dataSrc.allMom) {
            announcement.textContent = "Không có người chiến thắng (Cả 4 người chơi đều bị Móm)";
            announcement.style.color = '#ff5252';
        } else {
            if (dataSrc.winnerId === 0) {
                announcement.textContent = dataSrc.winnerIsU ? "Chúc mừng! Bạn đã Ù thắng tuyệt đối!" : "Chúc mừng! Bạn đã giành chiến thắng!";
                announcement.style.color = '#72ff9f';
            } else {
                announcement.textContent = `${dataSrc.winnerName} đã chiến thắng ván đấu này.`;
                announcement.style.color = '#dfb76c';
            }
        }

        const modal = document.getElementById('gameOverModal');
        modal.classList.remove('minimized');
        modal.classList.add('show');
        const btnMinimize = document.getElementById('btnMinimizeGameOver');
        if (btnMinimize) btnMinimize.textContent = '➖';
    }

    renderHistoryTable() {
        const body = document.getElementById('historyTableBody');
        if (!body) return;
        body.innerHTML = '';
        
        if (this.scoreHistory.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5" style="text-align: center; color: #aaa296; padding: 10px;">Chưa có ván đấu nào được ghi nhận.</td>`;
            body.appendChild(tr);
            return;
        }
        
        let totals = [0, 0, 0, 0];
        
        this.scoreHistory.forEach((scores, idx) => {
            const tr = document.createElement('tr');
            tr.classList.add('history-row');
            tr.innerHTML = `
                <td><span style="text-decoration: underline; color: #dfb76c;">Ván ${idx + 1}</span></td>
                <td>${scores[0] > 0 ? '+' : ''}${scores[0]}</td>
                <td>${scores[1] > 0 ? '+' : ''}${scores[1]}</td>
                <td>${scores[2] > 0 ? '+' : ''}${scores[2]}</td>
                <td>${scores[3] > 0 ? '+' : ''}${scores[3]}</td>
            `;
            tr.addEventListener('click', () => {
                AudioSynth.playClick();
                const historyModal = document.getElementById('historyModal');
                if (historyModal) {
                    historyModal.classList.remove('show');
                }
                this.returnToHistoryOnClose = true;
                const record = this.gameHistoryRecords[idx];
                if (record) {
                    this.showGameOverModal(record);
                }
            });
            body.appendChild(tr);
            
            // Accumulate totals
            totals[0] += scores[0];
            totals[1] += scores[1];
            totals[2] += scores[2];
            totals[3] += scores[3];
        });

        // Append a bold total row at the bottom
        const trTotal = document.createElement('tr');
        trTotal.style.fontWeight = 'bold';
        trTotal.style.color = '#dfb76c';
        trTotal.style.borderTop = '2px dashed #dfb76c';
        trTotal.innerHTML = `
            <td>Tổng</td>
            <td>${totals[0] > 0 ? '+' : ''}${totals[0]}</td>
            <td>${totals[1] > 0 ? '+' : ''}${totals[1]}</td>
            <td>${totals[2] > 0 ? '+' : ''}${totals[2]}</td>
            <td>${totals[3] > 0 ? '+' : ''}${totals[3]}</td>
        `;
        body.appendChild(trTotal);
    }
}

// --- CLASSIC PHOM SOLVER ALGORITHM ---

function findAllPhoms(cards) {
    let phoms = [];
    
    // 1. Phom Sap (3 or 4 cards of same rank)
    // Group cards by rank
    for (let r = 1; r <= 13; r++) {
        let rankCards = cards.filter(c => c.rank === r);
        if (rankCards.length >= 3) {
            phoms.push(rankCards); // 3 or 4 cards
            if (rankCards.length === 4) {
                // Also add all possible 3-card combinations from the 4 cards
                for (let i = 0; i < 4; i++) {
                    phoms.push(rankCards.filter((_, idx) => idx !== i));
                }
            }
        }
    }
    
    // 2. Phom Sanh (3+ cards of same suit, consecutive)
    for (let s = 0; s < 4; s++) {
        let suitCards = cards.filter(c => c.suit === s).sort((a, b) => a.rank - b.rank);
        // Find consecutive subgroups of length >= 3
        for (let i = 0; i < suitCards.length; i++) {
            for (let len = 3; len <= suitCards.length - i; len++) {
                let sub = suitCards.slice(i, i + len);
                // Validate consecutive
                let isConsec = true;
                for (let k = 1; k < sub.length; k++) {
                    if (sub[k].rank !== sub[k-1].rank + 1) {
                        isConsec = false;
                        break;
                    }
                }
                if (isConsec) {
                    phoms.push(sub);
                }
            }
        }
    }
    
    return phoms;
}

function getBestPartitions(cards) {
    let allPhoms = findAllPhoms(cards);
    let bestScore = Infinity;
    let bestPhoms = [];
    let bestRacs = [...cards];
    
    // Backtracking Search to find non-overlapping Phoms
    function backtrack(index, currentPhoms, usedCardIds) {
        // Evaluate current leaf state
        let currentRacs = cards.filter(c => !usedCardIds.has(c.id));
        let totalRubbishScore = currentRacs.reduce((sum, c) => sum + c.rank, 0);
        
        // Custom objective score: we heavily reward placing cards in Phoms (-1000 per card)
        // and penalize points of remaining rubbish cards (+rank points)
        let totalPhomCards = cards.length - currentRacs.length;
        let scoreIndex = (totalPhomCards * -1000) + totalRubbishScore;
        
        if (scoreIndex < bestScore) {
            bestScore = scoreIndex;
            bestPhoms = [...currentPhoms];
            bestRacs = currentRacs;
        }
        
        // Try to add next non-overlapping Phom
        for (let i = index; i < allPhoms.length; i++) {
            let phom = allPhoms[i];
            
            // Check if phom overlaps with already used cards
            let overlap = phom.some(c => usedCardIds.has(c.id));
            if (!overlap) {
                // Choose
                phom.forEach(c => usedCardIds.add(c.id));
                currentPhoms.push(phom);
                
                // Recurse
                backtrack(i + 1, currentPhoms, usedCardIds);
                
                // Unchoose
                currentPhoms.pop();
                phom.forEach(c => usedCardIds.delete(c.id));
            }
        }
    }
    
    backtrack(0, [], new Set());
    
    return {
        phoms: bestPhoms,
        racs: bestRacs,
        score: bestRacs.reduce((sum, c) => sum + c.rank, 0)
    };
}

// Start game manager when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    AudioSynth.init();
    window.game = new GameManager();
});

// Auto-initialize audio on user gesture
document.addEventListener('click', () => {
    AudioSynth.init();
    AudioSynth.resumeContext();
}, { once: true });

document.addEventListener('touchstart', () => {
    AudioSynth.init();
    AudioSynth.resumeContext();
}, { once: true });
