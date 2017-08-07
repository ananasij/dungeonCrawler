import React from 'react';
import Constants from './../Constants';

const { EMPTY, DUNGEON } = Constants.CellState;
const { MAXROOMSIDE, MINROOMSIDE, COVERAGEINDEX } = Constants.Map;

const roomConnections = {};

function generateRandomRoom(map) {
    const mapWidth = map.length;
    const mapHeight = map[0].length;

    const roomWidth = MINROOMSIDE + Math.floor(Math.random() * (MAXROOMSIDE - MINROOMSIDE));
    const roomHeight = MINROOMSIDE + Math.floor(Math.random() * (MAXROOMSIDE - MINROOMSIDE));
    const roomStartX = Math.floor(Math.random() * (mapWidth - roomWidth - 1)) + 1;
    const roomStartY = Math.floor(Math.random() * (mapHeight - roomHeight - 1)) + 1;

    return { width: roomWidth, height: roomHeight, startX: roomStartX, startY: roomStartY };
}

function roomsIntersect(start1, start2, size2) {
    return (start1 >= start2 && start1 < start2 + size2);
}

function roomIntersectsOthers(newRoom, existingRooms) {
    for (let i = 0; i < existingRooms.length; i += 1) {
        const currentRoom = existingRooms[i];
        if ((roomsIntersect(newRoom.startX, currentRoom.startX, currentRoom.width)
            || roomsIntersect(currentRoom.startX, newRoom.startX, newRoom.width)) &&
            (roomsIntersect(newRoom.startY, currentRoom.startY, currentRoom.height)
            || roomsIntersect(currentRoom.startY, newRoom.startY, newRoom.height))) {
            return true;
        }
    }
    return false;
}

function countRoomsRatio(rooms, map) {
    const mapArea = map.length * map[0].length;
    let roomsArea = 0;
    for (let i = 0; i < rooms.length; i += 1) {
        roomsArea += rooms[i].width * rooms[i].height;
    }
    return roomsArea / mapArea;
}

function roomIsConnected(room) {
    return (Object.keys(roomConnections).indexOf(''.concat(room)) !== -1 && roomConnections[room] > 1);
}

function saveConnection(roomIndex) {
    if (Object.keys(roomConnections).indexOf(''.concat(roomIndex)) === -1) {
        roomConnections[roomIndex] = 1;
    } else {
        roomConnections[roomIndex] += 1;
    }
}

function findRoomCenter(room) {
    const x = Math.round(room.startX + (room.width / 2));
    const y = Math.round(room.startY + (room.height / 2));
    return { x, y };
}

function makePassage(rooms, currentRoomIndex) {
    const room1 = rooms[currentRoomIndex];
    let room2 = null;
    while (!room2) {
        const i = Math.floor(Math.random() * rooms.length);
        if (i !== currentRoomIndex && !roomIsConnected(i)) {
            room2 = rooms[i];
            saveConnection(i);
        }
    }
    const room1Center = findRoomCenter(room1);
    const room2Center = findRoomCenter(room2);

    const horizontalArm = {
        startX: room1Center.x < room2Center.x ? room1Center.x : room2Center.x,
        endX: room2Center.x > room1Center.x ? room2Center.x : room1Center.x,
        startY: room2Center.y,
        endY: room2Center.y
    };
    const verticalArm = {
        startX: room1Center.x,
        endX: room1Center.x,
        startY: room1Center.y < room2Center.y ? room1Center.y : room2Center.y,
        endY: room2Center.y > room1Center.y ? room2Center.y : room1Center.y
    };
    return { horizontalArm, verticalArm };
}

function GenerateDungeon(width, height) {
    const map = [];
    const rooms = [];

    for (let i = 0; i < width; i += 1) {
        map[i] = [];
        for (let j = 0; j < height; j += 1) {
            map[i][j] = EMPTY;
        }
    }

    while (countRoomsRatio(rooms, map) < COVERAGEINDEX) {
        const newRoom = generateRandomRoom(map);
        if (!rooms.length || !roomIntersectsOthers(newRoom, rooms)) {
            rooms.push(newRoom);
        }
    }

    for (let i = 0; i < rooms.length; i += 1) {
        const room = rooms[i];
        for (let x = room.startX; x < room.startX + room.width; x += 1) {
            for (let y = room.startY; y < room.startY + room.height; y += 1) {
                map[x][y] = DUNGEON;
            }
        }
    }

    for (let i = 0; i < rooms.length; i += 1) {
        if (!roomIsConnected(i)) {
            const passage = makePassage(rooms, i);
            placePassageArm(passage.horizontalArm);
            placePassageArm(passage.verticalArm);
        }
    }

    return map;

    function placePassageArm(passage) {
        for (let x = passage.startX; x <= passage.endX; x += 1) {
            for (let y = passage.startY; y <= passage.endY; y += 1) {
                map[x][y] = DUNGEON;
            }
        }
    }
}

export default GenerateDungeon;