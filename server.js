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

  socket.on('createRoom', ({roomId, name, preferredSeat}, cb) => {
    if(!roomId) roomId = Math.random().toString(36).slice(2,8);
    rooms[roomId] = rooms[roomId] || {
      players: [], // list of player objects {socketId, name, hand, seatIdx}
      drawPile: [],
      tableDiscards: [[],[],[],[]],
      currentTurnSeatIdx: 0,
      lastDiscardedCard: null
    };
    const room = rooms[roomId];
    // determine seat: try preferredSeat if provided and free
    const usedSeats = room.players.map(p => p.seatIdx);
    let seatIdx = null;
    if (typeof preferredSeat === 'number' && preferredSeat >=0 && preferredSeat < 4 && !usedSeats.includes(preferredSeat)) {
      seatIdx = preferredSeat;
    } else {
      // find first free seat 0..3
      for(let i=0;i<4;i++){ if(!usedSeats.includes(i)){ seatIdx = i; break; } }
    }
    if(seatIdx === null) return cb && cb({error: 'Room full'});
    const playerObj = {id: socket.id, name: name || 'Player', socketId: socket.id, hand: [], seatIdx};
    room.players.push(playerObj);
    socket.join(roomId);
    console.log(`room ${roomId} created by ${socket.id} at seat ${seatIdx}`);
    cb && cb({roomId, seatIdx});
    // broadcast players by seat (array length 4)
    const playersBySeat = new Array(4).fill(null);
    room.players.forEach(p => { playersBySeat[p.seatIdx] = {name: p.name}; });
    io.to(roomId).emit('roomUpdate', {players: playersBySeat});
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
    // try to honor preferredSeat if provided
    const usedSeats = room.players.map(p => p.seatIdx);
    let seatIdx = null;
    if (typeof preferredSeat === 'number' && preferredSeat >=0 && preferredSeat < 4 && !usedSeats.includes(preferredSeat)) {
      seatIdx = preferredSeat;
    } else {
      for(let i=0;i<4;i++){ if(!usedSeats.includes(i)){ seatIdx = i; break; } }
    }
    if(seatIdx === null) return cb && cb({error:'Room full'});
    const playerObj = {id: socket.id, name: name || 'Player', socketId: socket.id, hand: [], seatIdx};
    room.players.push(playerObj);
    socket.join(roomId);
    cb && cb({roomId, seatIdx});
    const playersBySeat = new Array(4).fill(null);
    room.players.forEach(p => { playersBySeat[p.seatIdx] = {name: p.name}; });
    io.to(roomId).emit('roomUpdate', {players: playersBySeat});
  });

  socket.on('startGame', ({roomId}, cb) => {
    const room = rooms[roomId];
    if(!room) return cb && cb({error:'Room not found'});
    // init deck
    let deck = createDeck();
    shuffle(deck);
    // occupied seats
    const occupiedSeats = room.players.map(p => p.seatIdx).sort((a,b)=>a-b);
    if(occupiedSeats.length === 0) return cb && cb({error:'No players in room'});
    // pick dealer randomly among occupied seats
    const dealerSeatIdx = occupiedSeats[Math.floor(Math.random()*occupiedSeats.length)];
    room.drawPile = deck;
    room.tableDiscards = [[],[],[],[]];
    room.currentTurnSeatIdx = dealerSeatIdx;
    room.lastDiscardedCard = null;
    // prepare hands keyed by seatIdx
    const hands = {};
    const dealtCounts = {};
    occupiedSeats.forEach(s => { hands[s] = []; dealtCounts[s] = 0; });
    const cardsToDeal = occupiedSeats.length*9 + 1; // dealer gets 10
    let currSeat = dealerSeatIdx;
    const nextSeat = (seat) => {
      const idx = occupiedSeats.indexOf(seat);
      return occupiedSeats[(idx + 1) % occupiedSeats.length];
    };
    while(Object.values(dealtCounts).reduce((a,b)=>a+b,0) < cardsToDeal){
      const limit = (currSeat === dealerSeatIdx) ? 10 : 9;
      if(dealtCounts[currSeat] < limit){
        const c = room.drawPile.pop();
        hands[currSeat].push(c);
        dealtCounts[currSeat]++;
      }
      currSeat = nextSeat(currSeat);
    }
    // Send each player their hand privately
    const playersBySeat = new Array(4).fill(null);
    room.players.forEach(pl => { playersBySeat[pl.seatIdx] = {name: pl.name}; });
    room.players.forEach((p) => {
      const sock = io.sockets.sockets.get(p.socketId);
      if(sock) sock.emit('dealHands', {hand: hands[p.seatIdx] || [], seatIdx: p.seatIdx, dealerIdx: dealerSeatIdx, players: playersBySeat});
    });

    // Broadcast public state
    const playersHandsCounts = new Array(4).fill(0);
    room.players.forEach(p => { playersHandsCounts[p.seatIdx] = (p.hand? p.hand.length : (hands[p.seatIdx]||[]).length); });
    io.to(roomId).emit('stateUpdate', {
      drawPileCount: room.drawPile.length,
      tableDiscards: room.tableDiscards,
      currentTurnSeatIdx: room.currentTurnSeatIdx,
      lastDiscardedCard: room.lastDiscardedCard,
      playersHandsCounts
    });

    cb && cb({ok:true});
  });

  socket.on('playerDraw', ({roomId, seatIdx}, cb) => {
    const room = rooms[roomId];
    if(!room) return cb && cb({error:'Room not found'});
    if(room.drawPile.length === 0) return cb && cb({error:'Draw pile empty'});
    if(room.currentTurnSeatIdx !== seatIdx) return cb && cb({error:'Not your turn'});
    const pl = room.players.find(p => p.seatIdx === seatIdx);
    if(!pl) return cb && cb({error:'Player not found'});
    const card = room.drawPile.pop();
    pl.hand = pl.hand || [];
    pl.hand.push(card);
    const sock = io.sockets.sockets.get(pl.socketId);
    if(sock) sock.emit('handUpdate', {hand: pl.hand});

    // broadcast public state with seat-based counts
    const playersHandsCounts = new Array(4).fill(0);
    room.players.forEach(p => { playersHandsCounts[p.seatIdx] = (p.hand? p.hand.length : 0); });
    io.to(roomId).emit('stateUpdate', {
      drawPileCount: room.drawPile.length,
      tableDiscards: room.tableDiscards,
      currentTurnSeatIdx: room.currentTurnSeatIdx,
      lastDiscardedCard: room.lastDiscardedCard,
      playersHandsCounts
    });
    cb && cb({ok:true, card});
  });

  socket.on('playerDiscard', ({roomId, seatIdx, card}, cb) => {
    const room = rooms[roomId];
    if(!room) return cb && cb({error:'Room not found'});
    if(room.currentTurnSeatIdx !== seatIdx) return cb && cb({error:'Not your turn'});
    const pl = room.players.find(p => p.seatIdx === seatIdx);
    if(!pl || !pl.hand) return cb && cb({error:'Player or hand not found'});
    const idx = pl.hand.findIndex(c => c.id === card.id);
    if(idx === -1) return cb && cb({error:'Card not in hand'});
    const removed = pl.hand.splice(idx,1)[0];
    room.tableDiscards[seatIdx].push(removed);
    room.lastDiscardedCard = removed;
    // advance turn to next occupied seat
    const occupiedSeats = room.players.map(p=>p.seatIdx).sort((a,b)=>a-b);
    const currIndex = occupiedSeats.indexOf(seatIdx);
    const nextSeat = occupiedSeats[(currIndex + 1) % occupiedSeats.length];
    room.currentTurnSeatIdx = nextSeat;

    // notify all
    const playersHandsCounts = new Array(4).fill(0);
    room.players.forEach(p => { playersHandsCounts[p.seatIdx] = (p.hand? p.hand.length : 0); });
    io.to(roomId).emit('stateUpdate', {
      drawPileCount: room.drawPile.length,
      tableDiscards: room.tableDiscards,
      currentTurnSeatIdx: room.currentTurnSeatIdx,
      lastDiscardedCard: room.lastDiscardedCard,
      playersHandsCounts
    });
    const sock = io.sockets.sockets.get(pl.socketId);
    if(sock) sock.emit('handUpdate', {hand: pl.hand});

    cb && cb({ok:true});
  });

  socket.on('disconnecting', () => {
    // remove from rooms
    for(const roomId of socket.rooms){
      // skip the socket's own room id
      if(roomId === socket.id) continue;
      if(rooms[roomId]){
        rooms[roomId].players = rooms[roomId].players.filter(p => p.socketId !== socket.id);
        if(rooms[roomId].players.length === 0){
          delete rooms[roomId];
          console.log(`room ${roomId} deleted (empty)`);
        } else {
          io.to(roomId).emit('roomUpdate', {players: rooms[roomId].players.map(p=>({name:p.name}))});
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
