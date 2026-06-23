const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const SUITS = [0,1,2,3];
const RANKS = Array.from({length:13},(_,i)=>i);

function createDeck(){
  const deck = [];
  for(let s of SUITS){
    for(let r of RANKS){
      deck.push({suit:s, rankIndex:r, id:`card-${s}-${r}`});
    }
  }
  return deck;
}

function shuffle(deck){
  for(let i = deck.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

const rooms = {}; // roomId -> state

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('createRoom', ({roomId, name}, cb) => {
    if(!roomId) roomId = Math.random().toString(36).slice(2,8);
    rooms[roomId] = rooms[roomId] || {
      players: [],
      drawPile: [],
      tableDiscards: [[],[],[],[]],
      currentTurnIdx: 0,
      lastDiscardedCard: null
    };
    rooms[roomId].players.push({id: socket.id, name: name || 'Player', socketId: socket.id});
    socket.join(roomId);
    console.log(`room ${roomId} created by ${socket.id}`);
    cb && cb({roomId});
    io.to(roomId).emit('roomUpdate', {players: rooms[roomId].players.map(p=>({name:p.name}))});
  });

  socket.on('joinRoom', ({roomId, name}, cb) => {
    const room = rooms[roomId];
    if(!room){
      cb && cb({error: 'Room not found'});
      return;
    }
    if(room.players.length >= 4){
      cb && cb({error: 'Room is full'});
      return;
    }
    room.players.push({id: socket.id, name: name || 'Player', socketId: socket.id});
    socket.join(roomId);
    cb && cb({roomId});
    io.to(roomId).emit('roomUpdate', {players: room.players.map(p=>({name:p.name}))});
  });

  socket.on('startGame', ({roomId}, cb) => {
    const room = rooms[roomId];
    if(!room) return cb && cb({error:'Room not found'});
    // init deck
    let deck = createDeck();
    shuffle(deck);
    // pick dealer randomly
    const dealerIdx = Math.floor(Math.random()*room.players.length);
    room.drawPile = deck;
    room.tableDiscards = [[],[],[],[]];
    room.currentTurnIdx = dealerIdx;
    room.lastDiscardedCard = null;
    // deal: give 10 to dealer, 9 to others
    const hands = [];
    for(let i=0;i<room.players.length;i++) hands.push([]);
    // deal order around seats (0..n-1)
    let dealtCounts = new Array(room.players.length).fill(0);
    const cardsToDeal = room.players.length*9 + 1; // dealer gets 10
    let curr = dealerIdx;
    while(dealtCounts.reduce((a,b)=>a+b,0) < cardsToDeal){
      let limit = (curr === dealerIdx) ? 10 : 9;
      if(dealtCounts[curr] < limit){
        const c = room.drawPile.pop();
        hands[curr].push(c);
        dealtCounts[curr]++;
      }
      curr = (curr + 1) % room.players.length;
    }
    // Send each player their hand privately
    room.players.forEach((p, idx) => {
      const sock = io.sockets.sockets.get(p.socketId);
      if(sock) sock.emit('dealHands', {hand: hands[idx], seatIdx: idx, dealerIdx, players: room.players.map(pl=>({name:pl.name}))});
    });

    // Broadcast public state
    io.to(roomId).emit('stateUpdate', {
      drawPileCount: room.drawPile.length,
      tableDiscards: room.tableDiscards,
      currentTurnIdx: room.currentTurnIdx,
      lastDiscardedCard: room.lastDiscardedCard
    });

    cb && cb({ok:true});
  });

  socket.on('playerDraw', ({roomId, seatIdx}, cb) => {
    const room = rooms[roomId];
    if(!room) return cb && cb({error:'Room not found'});
    if(room.drawPile.length === 0) return cb && cb({error:'Draw pile empty'});
    if(room.players[room.currentTurnIdx].socketId !== socket.id) return cb && cb({error:'Not your turn'});
    const card = room.drawPile.pop();
    // find player and append
    const pl = room.players[seatIdx];
    if(!pl) return cb && cb({error:'Player not found'});
    pl.hand = pl.hand || [];
    pl.hand.push(card);
    // broadcast private hand update
    const sock = io.sockets.sockets.get(pl.socketId);
    if(sock) sock.emit('handUpdate', {hand: pl.hand});

    io.to(roomId).emit('stateUpdate', {
      drawPileCount: room.drawPile.length,
      tableDiscards: room.tableDiscards,
      currentTurnIdx: room.currentTurnIdx,
      lastDiscardedCard: room.lastDiscardedCard
    });
    cb && cb({ok:true, card});
  });

  socket.on('playerDiscard', ({roomId, seatIdx, card}, cb) => {
    const room = rooms[roomId];
    if(!room) return cb && cb({error:'Room not found'});
    if(room.players[room.currentTurnIdx].socketId !== socket.id) return cb && cb({error:'Not your turn'});
    // remove card from player's hand
    const pl = room.players[seatIdx];
    if(!pl || !pl.hand) return cb && cb({error:'Player or hand not found'});
    const idx = pl.hand.findIndex(c => c.id === card.id);
    if(idx === -1) return cb && cb({error:'Card not in hand'});
    const removed = pl.hand.splice(idx,1)[0];
    room.tableDiscards[seatIdx].push(removed);
    room.lastDiscardedCard = removed;
    // advance turn
    room.currentTurnIdx = (room.currentTurnIdx + 1) % room.players.length;

    // notify all
    io.to(roomId).emit('stateUpdate', {
      drawPileCount: room.drawPile.length,
      tableDiscards: room.tableDiscards,
      currentTurnIdx: room.currentTurnIdx,
      lastDiscardedCard: room.lastDiscardedCard,
      playersHandsCounts: room.players.map(p=> (p.hand? p.hand.length:0) )
    });
    // send updated hand to discarder
    const sock = io.sockets.sockets.get(pl.socketId);
    if(sock) sock.emit('handUpdate', {hand: pl.hand});

    cb && cb({ok:true});
  });

  socket.on('disconnecting', () => {
    // remove from rooms
    for(const roomId of socket.rooms){
      if(rooms[roomId]){
        rooms[roomId].players = rooms[roomId].players.filter(p => p.socketId !== socket.id);
        io.to(roomId).emit('roomUpdate', {players: rooms[roomId].players.map(p=>({name:p.name}))});
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
