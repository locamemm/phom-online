// server.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Thư viện để tạo ID duy nhất

// Khởi tạo server WebSocket trên cổng 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log("Phom Server is running on port 8080");

/**
 * Cấu trúc dữ liệu chính của server
 * rooms: Lưu trữ tất cả các phòng chơi đang hoạt động.
 *   - key: roomId
 *   - value: { id: roomId, clients: Map<clientId, ws>, game: ServerGameManager }
 * 
 * clients: Ánh xạ từ clientId tới thông tin phòng của họ để dễ dàng xử lý khi ngắt kết nối.
 *   - key: clientId
 *   - value: { roomId: string }
 */
const rooms = {};
const clients = {};

// Đây là phiên bản Server của GameManager, chỉ chứa logic, không có DOM.
// Trong thực tế, bạn sẽ chuyển toàn bộ logic từ game.js vào đây.
// Tạm thời chúng ta sẽ thêm logic khởi tạo game.
class ServerGameManager {
    constructor(roomId, broadcastCallback) {
        this.roomId = roomId;
        this.players = [];
        this.deck = [];
        this.drawPile = [];
        this.currentTurnIdx = 0;
        this.dealerIdx = 0; // Sẽ được cập nhật
        // ... và tất cả các thuộc tính trạng thái game khác
        this.broadcast = broadcastCallback; // Hàm để gửi thông tin cho các client trong phòng
    }

    // Ví dụ một hàm xử lý hành động
    handleAction(clientId, action) {
        console.log(`Game in room handling action from ${clientId}:`, action);
        // 1. Xác thực hành động (có đúng lượt, có hợp lệ không?)
        // 2. Cập nhật trạng thái game (this.players, this.deck, ...)
        // 3. Gọi this.broadcast() để gửi trạng thái mới cho mọi người.
        // Ví dụ:
        // const newState = this.getGameState();
        // this.broadcast({ type: 'GAME_STATE_UPDATE', payload: newState });
    }

    startGame(clientIds) {
        console.log(`[${this.roomId}] Starting game with players:`, clientIds);
        // 1. Tạo người chơi
        this.players = clientIds.map((id, index) => ({
            id: id, // Sử dụng clientId làm id người chơi
            name: `Player ${index + 1}`, // Tên tạm thời
            hand: [],
            // ... các thuộc tính khác của Player
        }));

        // 2. Tạo và xáo bài (lấy từ game.js)
        this.deck = [];
        for (let s = 0; s < 4; s++) {
            for (let r = 0; r < 13; r++) {
                // Tạo object card đơn giản cho server
                this.deck.push({ suit: s, rankIndex: r, id: `card-${s}-${r}` });
            }
        }
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }

        // 3. Chia bài
        this.dealerIdx = Math.floor(Math.random() * 4); // Chọn người chia bài ngẫu nhiên
        this.currentTurnIdx = this.dealerIdx;

        const dealerPlayerId = this.players[this.dealerIdx].id;

        for (let i = 0; i < 9; i++) {
            this.players.forEach(p => p.hand.push(this.deck.pop()));
        }
        // Người chia bài nhận thêm 1 lá
        this.players[this.dealerIdx].hand.push(this.deck.pop());

        this.drawPile = this.deck; // Phần còn lại là Nọc

        // 4. Gửi trạng thái game cho từng người chơi
        this.players.forEach((player, index) => {
            const clientSocket = clients[player.id]?.ws;
            if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
                const gameStateForPlayer = this.getGameStateForPlayer(player.id);
                clientSocket.send(JSON.stringify({ type: 'GAME_START', payload: gameStateForPlayer }));
            }
        });
    }

    // Hàm này tạo ra một phiên bản của trạng thái game, ẩn bài của người khác
    getGameStateForPlayer(clientId) {
        return {
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                // Chỉ gửi bài của chính người chơi đó, người khác chỉ gửi số lượng
                hand: p.id === clientId ? p.hand : null,
                handCardCount: p.hand.length,
            })),
            drawPileCount: this.drawPile.length,
            currentTurnIdx: this.players.findIndex(p => p.id === this.players[this.currentTurnIdx].id), // Gửi index của lượt đi
            dealerIdx: this.dealerIdx,
        };
    }
}

wss.on('connection', (ws) => {
    // 1. Gán một ID duy nhất cho client vừa kết nối
    const clientId = uuidv4();
    clients[clientId] = { ws }; // Lưu lại đối tượng ws
    console.log(`Client connected with ID: ${clientId}`);

    // Gửi ID cho client để họ tự định danh
    ws.send(JSON.stringify({ type: 'REGISTER', payload: { clientId } }));

    // Khi nhận được tin nhắn từ một client
    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error("Invalid JSON received:", message);
            return;
        }
        
        console.log(`Received from ${clientId}:`, data);

        // Xử lý các loại tin nhắn khác nhau
        switch (data.type) {
            case 'CREATE_ROOM':
                {
                    const roomId = `phom-${uuidv4().substring(0, 4)}`;
                    // Tạo hàm broadcast riêng cho phòng này
                    const broadcast = (message) => broadcastToRoom(roomId, message);

                    rooms[roomId] = {
                        id: roomId,
                        clients: new Map(), // Sử dụng Map để dễ dàng thêm/xóa client
                        game: new ServerGameManager(roomId, broadcast)
                    };
                    console.log(`Room created: ${roomId}`);
                    // Tự động cho người tạo phòng tham gia luôn
                    joinRoom(clientId, roomId);
                }
                break;

            case 'JOIN_ROOM':
                joinRoom(clientId, data.payload.roomId);
                break;

            case 'PLAYER_ACTION':
                {
                    const clientInfo = clients[clientId];
                    if (clientInfo && clientInfo.roomId) {
                        const room = rooms[clientInfo.roomId];
                        if (room && room.game) {
                            // Chuyển hành động cho GameManager của phòng đó xử lý
                            room.game.handleAction(clientId, data.payload);
                        }
                    }
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        const clientInfo = clients[clientId];
        if (clientInfo && clientInfo.roomId) {
            const roomId = clientInfo.roomId;
            const room = rooms[roomId];
            if (room) {
                // Xóa client khỏi phòng
                room.clients.delete(clientId);
                console.log(`Client ${clientId} removed from room ${roomId}`);

                // Thông báo cho những người còn lại trong phòng
                broadcastToRoom(roomId, {
                    type: 'PLAYER_LEFT',
                    payload: { clientId, playerCount: room.clients.size }
                });

                // Nếu phòng trống, xóa phòng
                if (room.clients.size === 0) {
                    console.log(`Room ${roomId} is empty, deleting.`);
                    delete rooms[roomId];
                }
            }
        }
        // Xóa client khỏi danh sách quản lý
        delete clients[clientId];
    });
});

function joinRoom(clientId, roomId) {
    const room = rooms[roomId];
    const client = clients[clientId];

    if (!room) {
        client.ws.send(JSON.stringify({ type: 'ERROR', payload: { message: `Phòng ${roomId} không tồn tại.` } }));
        return;
    }

    if (room.clients.size >= 4) {
        client.ws.send(JSON.stringify({ type: 'ERROR', payload: { message: `Phòng ${roomId} đã đầy.` } }));
        return;
    }

    // Thêm client vào phòng
    room.clients.set(clientId, client.ws);
    clients[clientId].roomId = roomId; // Lưu lại roomId cho client

    console.log(`Client ${clientId} joined room ${roomId}. Player count: ${room.clients.size}`);

    // Gửi thông báo cho client vừa vào phòng thành công
    client.ws.send(JSON.stringify({ type: 'JOIN_SUCCESS', payload: { roomId, playerCount: room.clients.size } }));

    // Thông báo cho tất cả người chơi khác trong phòng về người chơi mới
    broadcastToRoom(roomId, { type: 'PLAYER_JOINED', payload: { clientId, playerCount: room.clients.size } }, clientId);

    // KIỂM TRA ĐỂ BẮT ĐẦU GAME
    if (room.clients.size === 4) {
        console.log(`Room ${roomId} is full. Starting game...`);
        room.game.startGame(Array.from(room.clients.keys()));
    }
}

function broadcastToRoom(roomId, message, excludeClientId = null) {
    const room = rooms[roomId];
    if (!room) return;

    const messageString = JSON.stringify(message);
    for (const [clientId, clientSocket] of room.clients.entries()) {
        if (clientId !== excludeClientId && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(messageString);
        }
    }
}
