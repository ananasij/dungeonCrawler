import React from 'react';
import Constants from './../Constants';

const { EMPTY, DUNGEON } = Constants.CellState;
const { MAXROOMSIDE, MINROOMSIDE, COVERAGEINDEX } = Constants.Map;

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
    return map;
}

export default GenerateDungeon;