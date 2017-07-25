import React from 'react';
import Map from './Map';
import Constants from './../Constants';

const { EMPTY, DUNGEON, HERO } = Constants.CellState;

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            dungeonWidth: 10,
            dungeonHeight: 8,
            map: [],
            hero: {}
        };
    }

    componentWillMount() {
        window.addEventListener('keydown', e => this.handleKeyDown(e));
        this.initMap(Constants.Map.WIDTH, Constants.Map.HEIGHT);
    }

    initMap(width, height) {
        const map = [];
        for (let i = 0; i < width; i += 1) {
            map[i] = [];
            for (let j = 0; j < height; j += 1) {
                map[i][j] = EMPTY;
            }
        }
        const dungeonStartX = Math.floor(Math.random() * (width - this.state.dungeonWidth - 1)) + 1;
        const dungeonStartY = Math.floor(Math.random() * (height - this.state.dungeonHeight - 1)) + 1;

        for (let i = dungeonStartX; i < dungeonStartX + this.state.dungeonWidth; i += 1) {
            for (let j = dungeonStartY; j < dungeonStartY + this.state.dungeonHeight; j += 1) {
                map[i][j] = DUNGEON;
            }
        }
        const hero = this.initHero(map);
        this.setState({ width, height, map, hero });
    }

    initHero(map) {
        const hero = {
            x: 0,
            y: 0
        };
        while (true) {
            hero.x = Math.floor(Math.random() * map.length);
            hero.y = Math.floor(Math.random() * map[0].length);
            if (map[hero.x][hero.y] === DUNGEON) {
                break;
            }
        }
        return hero;
    }

    handleKeyDown(e) {
        switch (e.code) {
        case 'ArrowUp':
            this.walk(0, -1);
            break;
        case 'ArrowDown':
            this.walk(0, 1);
            break;
        case 'ArrowLeft':
            this.walk(-1, 0);
            break;
        case 'ArrowRight':
            this.walk(1, 0);
            break;
        default:
            break;
        }
    }

    walk(stepX, stepY) {
        const map = this.state.map;
        const hero = this.state.hero;
        const nextX = hero.x + stepX;
        const nextY = hero.y + stepY;
        if (this.state.map[nextX][nextY] === DUNGEON) {
            map[hero.x][hero.y] = DUNGEON;
            hero.x = nextX;
            hero.y = nextY;
            this.setState({ hero, map });
        }
    }

    render() {
        const currentMap = this.state.map;
        currentMap[this.state.hero.x][this.state.hero.y] = HERO;
        return (
            <div
                tabIndex="0"
                onKeyPress={this.walk}
            >
                <Map
                    map={this.state.map}
                />
            </div>
        );
    }
}

export default App;
