import React from 'react';
import GenerateDungeon from './GenerateDungeon';
import Map from './Map';
import Constants from './../Constants';

const { EMPTY, DUNGEON, HERO, ENEMY } = Constants.CellState;
const { ENEMIESDENSITY } = Constants.ItemsDensity;
const { GAME, LOSS } = Constants.GameState;
const { E_MINHEALTH, E_HEALTHDEVIATION, E_MINDAMAGE, E_DAMAGEDEVIATION } = Constants.Enemy;
const { H_INITIALHEALTH } = Constants.Hero;
const { XP_MIN, XP_PER_HIT, LEVELUP_BASE } = Constants.Xp;

class App extends React.Component {
    static getRandomPoint(map) {
        const point = {};
        point.x = Math.floor(Math.random() * map.length);
        point.y = Math.floor(Math.random() * map[0].length);
        return point;
    }

    static getRandomValue(minValue, deviation) {
        return minValue + Math.floor(Math.random() * deviation);
    }

    static getItemID(x, y) {
        return ''.concat(x).concat('-').concat(y);
    }

    static calculateXpToNextLevel(currentLevel) {
        return ((currentLevel + 1) ** 2) * LEVELUP_BASE;
    }

    constructor() {
        super();
        this.state = {
            dungeonWidth: 10,
            dungeonHeight: 8,
            map: [],
            hero: {},
            enemies: {}
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentWillMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        this.initGame();
    }

    initGame() {
        const width = Constants.Map.WIDTH;
        const height = Constants.Map.HEIGHT;
        const map = GenerateDungeon(width, height);
        const hero = this.initHero(map);
        map[hero.x][hero.y] = HERO;
        const enemies = this.initEnemies(map);
        Object.keys(enemies).forEach((key) => {
            map[enemies[key].x][enemies[key].y] = ENEMY;
        });
        this.setState({ gameState: GAME, width, height, map, hero, enemies });
    }

    initHero(map) {
        const hero = {
            x: 0,
            y: 0,
            health: H_INITIALHEALTH,
            weapon: 10,
            level: 1,
            xp: 0,
            xpToNextLevel: App.calculateXpToNextLevel(1),
            hits: 0
        };
        let point;
        while (true) {
            point = App.getRandomPoint(map);
            if (map[point.x][point.y] === DUNGEON) {
                hero.x = point.x;
                hero.y = point.y;
                break;
            }
        }
        return hero;
    }

    initEnemies(map) {
        const enemies = {};
        const enemiesLimit = (map.length * map[0].length) * ENEMIESDENSITY;
        let enemiesCounter = 0;
        let x;
        let y;
        let health;
        let damage;
        let point = { x: null, y: null };
        let id;
        while (enemiesCounter < enemiesLimit) {
            point = App.getRandomPoint(map);
            if (map[point.x][point.y] === DUNGEON) {
                health = App.getRandomValue(E_MINHEALTH, E_HEALTHDEVIATION);
                damage = App.getRandomValue(E_MINDAMAGE, E_DAMAGEDEVIATION);
                x = point.x;
                y = point.y;
                id = App.getItemID(x, y);
                enemies[id] = { x, y, health, damage };
                enemiesCounter += 1;
            }
        }
        return enemies;
    }

    handleKeyDown(e) {
        switch (e.code) {
        case 'ArrowUp':
            this.goToCell(0, -1);
            break;
        case 'ArrowDown':
            this.goToCell(0, 1);
            break;
        case 'ArrowLeft':
            this.goToCell(-1, 0);
            break;
        case 'ArrowRight':
            this.goToCell(1, 0);
            break;
        default:
            break;
        }
    }

    goToCell(stepX, stepY) {
        const hero = this.state.hero;
        const nextX = hero.x + stepX;
        const nextY = hero.y + stepY;
        switch (this.state.map[nextX][nextY]) {
        case DUNGEON:
            this.walk(nextX, nextY);
            break;
        case ENEMY:
            this.fight(nextX, nextY);
            break;
        case EMPTY:
            break;
        default:
            break;
        }
    }

    walk(nextX, nextY) {
        const map = this.state.map;
        const hero = this.state.hero;
        map[hero.x][hero.y] = DUNGEON;
        hero.x = nextX;
        hero.y = nextY;
        map[hero.x][hero.y] = HERO;
        this.setState({ hero, map });
    }

    fight(nextX, nextY) {
        const hero = this.state.hero;
        const enemyID = App.getItemID(nextX, nextY);
        const enemy = this.state.enemies[enemyID];
        console.log('FIGHT');
        console.log('Hero attacks: hero health ' + hero.health + ' hero damage ' + (hero.level * hero.weapon) + ' enemy health: ' + enemy.health);
        console.log('hero hits ' + hero.hits + ' hero xp ' + hero.xp);
        enemy.health -= hero.level * hero.weapon;
        hero.hits += 1;
        console.log('Hero attacked: enemy health: ' + enemy.health);
        console.log('hero hits ' + hero.hits + ' hero xp ' + hero.xp);
        if (enemy.health > 0) {
            console.log('Enemy attacks:  hero health ' + hero.health + ' enemy damage ' + enemy.damage);
            hero.health -= enemy.damage;
            console.log('Enemy attacked:  hero health ' + hero.health);
            if (hero.health <= 0) {
                this.endGame(LOSS);
            }
        } else {
            this.updateXp();
            hero.hits = 0;
            console.log('Win! hero xp ' + hero.xp);
            this.removeEnemy(enemyID);
        }
    }

    updateXp() {
        const hero = this.state.hero;
        const currentXp = XP_MIN + (XP_PER_HIT * hero.hits);
        hero.xp += currentXp;
        if (currentXp < hero.xpToNextLevel) {
            hero.xpToNextLevel -= currentXp;
        } else {
            hero.level += 1;
            hero.xpToNextLevel = App.calculateXpToNextLevel(hero.level) - hero.xpToNextLevel;
        }
    }

    removeEnemy(enemyID) {
        const enemies = this.state.enemies;
        const enemy = this.state.enemies[enemyID];
        delete enemies[enemyID];
        const map = this.state.map;
        map[enemy.x][enemy.y] = DUNGEON;
        this.setState({ enemies, map });
    }

    endGame(gameState) {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.setState({ gameState });
    }

    render() {
        if (this.state.gameState === GAME) {
            return (
                <Map
                    map={this.state.map}
                />
            );
        } else if (this.state.gameState === LOSS) {
            return (
                <div>
                    WASTED
                </div>
            );
        }
        return null;
    }
}

export default App;
