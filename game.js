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
    constructor(id, name, balance = 1000000, isAI = false) {
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
            new Player(0, "Bạn", 1000000, false),
            new Player(1, "Lâm Híp", 1000000, true),
            new Player(2, "Bác Ba Phi", 1000000, true),
            new Player(3, "Chị Hoa", 1000000, true)
        ];
        this.deck = [];
        this.drawPile = []; // Draw stack (Nọc)
        this.tableDiscards = [[], [], [], []];
        
        this.dealerIdx = 0; // Index of dealer (gets 10 cards)
        this.currentTurnIdx = 0; // Whose turn is it
        
        this.roundNum = 1; // 1 to 4 rounds
        this.turnStep = 'ACTION'; // 'ACTION' (eat/draw) or 'DISCARD'
        this.selectedCardId = null;
        this.selectedEatCardIds = [];
        this.isDrawingOrEating = false;
        this.isReturningDiscards = false;
        this.meldStartIdx = 0;
        
        this.betAmount = 10000;
        this.lastDiscardedCard = null;
        this.lastDiscardedPlayerIdx = -1;
        this.chotRound = false; // Is this round 4 (last round where eating causes chot)
        this.consecutiveEatenCounts = [0, 0, 0, 0]; // Track how many times a player was eaten consecutively by next player (for đền bài)
        
        this.gameHistory = [];
        this.sortMode = 'SUIT'; // 'SUIT' or 'RANK'
        
        this.initDOM();
        this.resetGame();
    }

    initDOM() {
        // Core buttons
        document.getElementById('btnDraw').addEventListener('click', () => this.playerDraw());
        document.getElementById('btnEat').addEventListener('click', () => this.playerEat());
        document.getElementById('btnDiscard').addEventListener('click', () => this.playerDiscard());
        document.getElementById('btnSort').addEventListener('click', () => this.toggleSort());
        document.getElementById('btnLayMelds').addEventListener('click', () => this.playerLayMelds());
        document.getElementById('btnSendCards').addEventListener('click', () => this.playerSendCards());
        document.getElementById('btnRestart').addEventListener('click', () => this.manualRestart());
        document.getElementById('btnNextGame').addEventListener('click', () => this.startNextGame());
        
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
        
        // Sound toggle
        const btnSound = document.getElementById('btnSound');
        btnSound.addEventListener('click', () => {
            AudioSynth.enabled = !AudioSynth.enabled;
            btnSound.innerHTML = AudioSynth.enabled ? '🔊 Âm thanh' : '🔇 Tắt âm';
            AudioSynth.playClick();
        });

        // Bet selector
        const betSelect = document.getElementById('betSelect');
        betSelect.addEventListener('change', (e) => {
            this.betAmount = parseInt(e.target.value);
            this.logMessage(`Mức cược thay đổi thành: ${this.betAmount.toLocaleString()} Xu`, 'system');
            AudioSynth.playClick();
        });

        // Event for clicking the stock pile
        document.getElementById('drawPile').addEventListener('click', () => {
            if (this.currentTurnIdx === 0 && this.turnStep === 'ACTION' && !document.getElementById('btnDraw').disabled) {
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

    manualRestart() {
        AudioSynth.init();
        AudioSynth.playClick();
        if (confirm("Bạn có muốn bắt đầu ván mới hoàn toàn? Tiền xu sẽ được khôi phục.")) {
            this.players.forEach(p => p.balance = 1000000);
            this.resetGame();
        }
    }

    resetGame() {
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
        this.roundNum = 1;
        this.turnStep = 'DEALING';
        this.chotRound = false;
        this.consecutiveEatenCounts = [0, 0, 0, 0];
        
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
            curr = (curr + 1) % 4;
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

        cardDiv.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-face-back"></div>
                <div class="card-face card-face-front">
                    <div class="card-corner top-left">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                    <div class="card-corner top-right">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                    <div class="card-center-suit">${card.suitSymbol}</div>
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
        const showFront = (this.turnStep === 'LAY_MELDS' || this.turnStep === 'SEND_CARDS' || this.turnStep === 'GAME_OVER');
        
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
                
                if (slotIdx === 0) { // Bottom plays to Right (Player 1)
                    x = 350 - Math.abs(pileIdx - 1.5) * 12;
                    y = 220 + pileIdx * 32;
                    rot = (pileIdx - 1.5) * 12;
                } else if (slotIdx === 1) { // Right plays to Top (Player 2)
                    x = 240 + pileIdx * 32;
                    y = 20 + Math.abs(pileIdx - 1.5) * 12;
                    rot = (pileIdx - 1.5) * 12;
                } else if (slotIdx === 2) { // Top plays to Left (Player 3)
                    x = 40 + Math.abs(pileIdx - 1.5) * 12;
                    y = 20 + pileIdx * 32;
                    rot = -(pileIdx - 1.5) * 12;
                } else if (slotIdx === 3) { // Left plays to Bottom (Player 0)
                    x = 70 + pileIdx * 32;
                    y = 300 - Math.abs(pileIdx - 1.5) * 12;
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
                    let showFront = (cardIdx === 0) || (this.turnStep === 'LAY_MELDS' || this.turnStep === 'SEND_CARDS' || this.turnStep === 'GAME_OVER');
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
                            let showFront = (cIdx === 0) || (this.turnStep === 'LAY_MELDS' || this.turnStep === 'SEND_CARDS' || this.turnStep === 'GAME_OVER');
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
            
            balanceEl.textContent = `${this.players[i].balance.toLocaleString()} Xu`;
            
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
        const btnDraw = document.getElementById('btnDraw');
        const btnEat = document.getElementById('btnEat');
        const btnDiscard = document.getElementById('btnDiscard');
        const btnLayMelds = document.getElementById('btnLayMelds');
        const btnSendCards = document.getElementById('btnSendCards');

        // Reset all to disabled initially
        btnDraw.disabled = true;
        btnEat.disabled = true;
        btnDiscard.disabled = true;
        btnLayMelds.disabled = true;
        btnSendCards.disabled = true;

        if (isUserTurn && !this.isReturningDiscards) {
            if (this.turnStep === 'ACTION') {
                btnDraw.disabled = false;
                
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
                    btnDiscard.disabled = false;
                }
            } else if (this.turnStep === 'LAY_MELDS') {
                btnLayMelds.disabled = false;
            } else if (this.turnStep === 'SEND_CARDS') {
                btnSendCards.disabled = false;
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
        
        tempCard.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-face-back"></div>
                <div class="card-face card-face-front">
                    <div class="card-corner">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                    <div class="card-center-suit">${card.suitSymbol}</div>
                    <div class="card-corner" style="transform: rotate(180deg);">
                        <span>${card.symbol}</span>
                        <span class="suit-mini">${card.suitSymbol}</span>
                    </div>
                </div>
            </div>
        `;
        
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
        
        this.applyEatShift(eatenSlotIdx);
        
        let eatenCard = this.lastDiscardedCard;
        // Remove the selected Cạ cards from hand
        selectedCards.forEach(c => this.players[0].removeCard(c.id));

        // Add to eaten
        let eatenPhom = [eatenCard, ...selectedCards];
        this.players[0].eaten.push(eatenPhom);
        
        this.logMessage(`Bạn đã ăn lá ${eatenCard.name} từ ${sourcePlayer.name}!`, 'player');
        this.showStatusBubble(0, "Ăn bài!", 1500);

        // Immediate penalty payment
        this.handleEatPenalty(this.lastDiscardedPlayerIdx, 0);

        this.selectedEatCardIds = []; // Clear eat selections

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
                        this.endGame();
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
        if (this.currentTurnIdx !== 0 || this.turnStep !== 'LAY_MELDS') return;
        
        this.startPlayerMeldPhase(0, () => {
            AudioSynth.playClick();
            this.players[0].melds = [];
            
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
                this.turnStep = 'SEND_CARDS';
                this.updateHUD();
                
                let sends = this.findPossibleSends(0);
                if (sends.length === 0 || this.players[0].isMom) {
                    setTimeout(() => this.playerSendCards(), 1000);
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

        let sends = this.findPossibleSends(0);
        let animationsToRun = [];

        if (sends.length > 0 && !this.players[0].isMom) {
            sends.forEach(send => {
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
            
            if (animationsToRun.length > 0) {
                AudioSynth.playClick();
                this.showStatusBubble(0, `Gửi ${animationsToRun.length} lá!`, 2000);
            }
        }

        this.renderPlayerHand();
        this.renderMelds();

        const proceed = () => {
            let nextIdx = (this.currentTurnIdx + 1) % 4;
            if (nextIdx === this.meldStartIdx) {
                this.endGame();
            } else {
                this.currentTurnIdx = nextIdx;
                this.turnStep = 'LAY_MELDS';
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
        this.currentTurnIdx = (this.currentTurnIdx + 1) % 4;
        this.turnStep = 'ACTION';
        this.selectedCardId = null; // Clear discard selection on turn change
        this.selectedEatCardIds = []; // Clear selections on turn change

        // Auto-select matching Cạ cards if the user can eat
        if (this.currentTurnIdx === 0 && this.lastDiscardedCard && this.lastDiscardedPlayerIdx !== 0) {
            let autoSelectIds = this.findValidEatCạ(0, this.lastDiscardedCard);
            if (autoSelectIds) {
                this.selectedEatCardIds = autoSelectIds;
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
        const discardIdx = (playerIdx + 3) % 4; // Target the discard pile physically located in front of playerIdx
        const cards = this.tableDiscards[discardIdx] || [];
        if (cards.length === 0) {
            callback();
            return;
        }

        this.isReturningDiscards = true;
        this.updateHUD();

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
        this.meldStartIdx = (this.lastDiscardedPlayerIdx + 1) % 4;
        this.currentTurnIdx = this.meldStartIdx;
        this.turnStep = 'LAY_MELDS';
        this.logMessage(`--- HẠ PHỎM ---`, 'system');
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
                
                this.applyEatShift(eatenSlotIdx);
                
                // Remove the Cạ cards from AI hand
                chosenMeld.forEach(c => ai.removeCard(c.id));

                // Add to eaten
                let eatenPhom = [eatenCard, ...chosenMeld];
                ai.eaten.push(eatenPhom);
                
                this.logMessage(`${ai.name} đã ăn lá ${eatenCard.name} từ ${sourcePlayer.name}!`, 'ai');
                this.showStatusBubble(this.currentTurnIdx, "Ăn bài!", 1500);
                
                this.handleEatPenalty(this.lastDiscardedPlayerIdx, this.currentTurnIdx);
                
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
            this.endGame();
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
                        this.endGame();
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
        
        if (!ai.isMom) {
            let sends = this.findPossibleSends(this.currentTurnIdx);
            if (sends.length > 0) {
                sends.forEach(send => {
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
                
                if (animationsToRun.length > 0) {
                    AudioSynth.playClick();
                    this.showStatusBubble(this.currentTurnIdx, `Gửi ${animationsToRun.length} lá!`, 2000);
                }
            }
        }

        this.renderAIHands();
        this.renderMelds();

        const proceed = () => {
            let nextIdx = (this.currentTurnIdx + 1) % 4;
            if (nextIdx === this.meldStartIdx) {
                this.endGame();
            } else {
                this.currentTurnIdx = nextIdx;
                this.turnStep = 'LAY_MELDS';
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
        
        // Standard eat penalty: 1x bet
        // If it's a chot card: 4x bet
        let isChot = (payer.discardCount === 4); // The card just eaten was their 4th discard card
        let multiplier = isChot ? 4 : 1;
        let penaltyAmount = this.betAmount * multiplier;
        
        payer.balance -= penaltyAmount;
        earner.balance += penaltyAmount;

        // Visual effects
        this.createFloatingTextOnPlayer(payerIdx, `-${penaltyAmount.toLocaleString()}`, true, false);
        this.createFloatingTextOnPlayer(earnerIdx, `+${penaltyAmount.toLocaleString()}`, false, true);

        if (isChot) {
            AudioSynth.playChot();
            this.logMessage(`[CHỐT!] ${earner.name} đã ăn CHỐT của ${payer.name}! Phạt ${penaltyAmount.toLocaleString()} Xu!`, 'alert');
        } else {
            this.logMessage(`${earner.name} ăn bài của ${payer.name}. Phạt ${penaltyAmount.toLocaleString()} Xu.`, 'system');
        }

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
        let prev1 = (target - 1 + 4) % 4;
        let prev2 = (target - 2 + 4) % 4;
        let prev3 = (target - 3 + 4) % 4;

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
            this.logMessage(`Chuyển bài rác ${action.card.name} từ khay của ${this.players[(action.from + 1) % 4].name} sang khay của ${this.players[(action.to + 1) % 4].name}.`, 'system');
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
        
        if (uPlayer) {
            AudioSynth.playWin();
            this.logMessage(`${uPlayer.name} đã Ù thắng tuyệt đối!`, 'win');
            
            // Distribute winnings
            // Each player pays U player 5x bet
            // Unless there is a player who must "Đền" (if a player got eaten 3 times by the U player)
            // Or if a player got eaten 3 times, they pay for ALL players!
            let denPlayerIdx = this.consecutiveEatenCounts.findIndex(count => count === 3);
            let denPlayer = denPlayerIdx !== -1 ? this.players[denPlayerIdx] : null;

            this.players.forEach((p, idx) => {
                if (p.id === uPlayer.id) return;
                p.score = 99; // Dummy score
                
                let payAmount = this.betAmount * 5;
                
                if (denPlayer) {
                    // Den player pays for this player!
                    denPlayer.balance -= payAmount;
                    uPlayer.balance += payAmount;
                    this.createFloatingTextOnPlayer(denPlayerIdx, `-${payAmount.toLocaleString()}`, true, false);
                } else {
                    p.balance -= payAmount;
                    uPlayer.balance += payAmount;
                    this.createFloatingTextOnPlayer(p.id, `-${payAmount.toLocaleString()}`, true, false);
                }
            });
            
            if (denPlayer) {
                this.logMessage(`${denPlayer.name} đền bài! Trả toàn bộ tiền phạt (15x cược) cho ${uPlayer.name}!`, 'alert');
                this.createFloatingTextOnPlayer(uPlayer.id, `+${(this.betAmount * 15).toLocaleString()}`, false, true);
            } else {
                this.createFloatingTextOnPlayer(uPlayer.id, `+${(this.betAmount * 15).toLocaleString()}`, false, true);
            }

            // Assign placements
            this.players.forEach(p => {
                if (p.id === uPlayer.id) p.placement = 1;
                else p.placement = 4; // Everyone else ranks last
            });
            
        } else {
            // No one U'd. Calculate score based on remaining rubbish cards
            this.players.forEach(p => {
                let partition = getBestPartitions(p.hand);
                p.score = p.isMom ? 999 : partition.score; // Mom gets 999 (highest score, auto last)
            });

            // Sort players to decide placements
            // Rank from lowest score to highest score
            // If scores are equal, who laid down phoms first wins?
            // Turn order starts at dealerIdx, so we calculate proximity to dealer
            let sortedPlayers = [...this.players].sort((a, b) => {
                if (a.score !== b.score) return a.score - b.score;
                // Proximity to dealer (closer to dealer in turn order lays down earlier)
                let distA = (a.id - this.dealerIdx + 4) % 4;
                let distB = (b.id - this.dealerIdx + 4) % 4;
                return distA - distB;
            });

            // Assign placement indices
            sortedPlayers.forEach((p, idx) => {
                p.placement = idx + 1; // 1st, 2nd, 3rd, 4th
            });

            // Calculate payouts:
            // 1st wins:
            // - 2nd pays 1st: 1x bet
            // - 3rd pays 1st: 2x bet
            // - 4th pays 1st: 3x bet
            // - If Mom: pays 1st 4x bet
            
            let winner = sortedPlayers[0];
            let totalWinnings = 0;
            
            sortedPlayers.forEach((p, idx) => {
                if (idx === 0) return; // Skip winner
                
                let multiplier = 1;
                if (p.isMom) {
                    multiplier = 4;
                    this.logMessage(`${p.name} bị Móm (Cháy bài)! Chịu phạt nặng.`, 'alert');
                } else {
                    multiplier = idx; // 2nd (idx 1) pays 1x, 3rd (idx 2) pays 2x, 4th (idx 3) pays 3x
                }
                
                let amount = this.betAmount * multiplier;
                p.balance -= amount;
                totalWinnings += amount;
                
                this.createFloatingTextOnPlayer(p.id, `-${amount.toLocaleString()}`, true, false);
            });

            winner.balance += totalWinnings;
            this.createFloatingTextOnPlayer(winner.id, `+${totalWinnings.toLocaleString()}`, false, true);
            
            if (winner.id === 0) {
                AudioSynth.playWin();
                this.logMessage(`Bạn đã giành chiến thắng ván đấu này! Nhận được ${totalWinnings.toLocaleString()} Xu.`, 'win');
            } else {
                AudioSynth.playLose();
                this.logMessage(`${winner.name} giành chiến thắng ván đấu. Nhận được ${totalWinnings.toLocaleString()} Xu.`, 'system');
            }
        }

        // Increment dealer for next game
        this.dealerIdx = (this.dealerIdx + 1) % 4;

        this.renderAll();
        this.updateHUD();
        setTimeout(() => {
            this.showGameOverModal();
        }, 1000);
    }

    showGameOverModal() {
        const body = document.getElementById('scoreTableBody');
        body.innerHTML = '';

        // Sort players by placement for display
        let sorted = [...this.players].sort((a, b) => a.placement - b.placement);
        
        sorted.forEach(p => {
            const tr = document.createElement('tr');
            
            // Format phoms text
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

            // Results text
            let resultText = '';
            let coinDelta = 0;
            
            // Calculate approximate coin change (rough estimate based on game result for display)
            if (p.placement === 1) {
                resultText = 'Nhất';
                tr.style.color = '#72ff9f';
                tr.style.fontWeight = 'bold';
            } else if (p.placement === 2) {
                resultText = 'Nhì';
            } else if (p.placement === 3) {
                resultText = 'Ba';
            } else {
                resultText = p.isMom ? 'Móm (Bét)' : 'Bét';
                tr.style.color = '#ff5252';
            }

            if (p.isU) {
                resultText = 'Ù Thắng';
            }

            tr.innerHTML = `
                <td>${p.name} ${p.id === 0 ? '(Ta)' : ''}</td>
                <td>${phomsText}</td>
                <td>${p.isMom || p.isU ? '-' : p.score}</td>
                <td>${resultText}</td>
                <td>${p.balance.toLocaleString()} Xu</td>
            `;
            body.appendChild(tr);
        });

        // Set title announcement
        const announcement = document.getElementById('winnerAnnouncement');
        let win = sorted[0];
        if (win.id === 0) {
            announcement.textContent = win.isU ? "Chúc mừng! Bạn đã Ù thắng tuyệt đối!" : "Chúc mừng! Bạn đã giành chiến thắng!";
            announcement.style.color = '#72ff9f';
        } else {
            announcement.textContent = `${win.name} đã chiến thắng ván đấu này.`;
            announcement.style.color = '#dfb76c';
        }

        const modal = document.getElementById('gameOverModal');
        modal.classList.remove('minimized');
        modal.classList.add('show');
        const btnMinimize = document.getElementById('btnMinimizeGameOver');
        if (btnMinimize) btnMinimize.textContent = '➖';
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
