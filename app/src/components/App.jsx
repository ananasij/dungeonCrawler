import React from 'react';
import GenerateDungeon from './GenerateDungeon';
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
        this.initGame();
    }

    initGame() {
        const width = Constants.Map.WIDTH;
        const height = Constants.Map.HEIGHT;
        const map = GenerateDungeon(width, height);
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
                <Map
                    map={this.state.map}
                />
        );
    }
}

export default App;
