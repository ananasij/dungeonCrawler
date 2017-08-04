import React from 'react';
import update from 'immutability-helper';
import GenerateDungeon from './GenerateDungeon';
import Map from './Map';
import Constants from './../Constants';

const { EMPTY, DUNGEON, HERO, ENEMY, HEALTHPOINT } = Constants.CellState;
const { LIMITED, VISIBILITYRADIUS } = Constants.Visibility;
const { ENEMIESDENSITY, HEALTHPOINTSDENSITY } = Constants.ItemsDensity;
const { GAME, LOSS } = Constants.GameState;
const { E_MINHEALTH, E_HEALTHDEVIATION, E_MINDAMAGE, E_DAMAGEDEVIATION } = Constants.Enemy;
const { HP_MINHEALTH, HP_HEALTHDEVIATION } = Constants.HealthPoints;
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

    static placeItems(map, items, cellValue) {
        let filledMap = map;
        let x;
        let y;
        Object.keys(items).forEach((key) => {
            x = items[key].x;
            y = items[key].y;
            filledMap = update(filledMap, { [x]: { $splice: [[y, 1, cellValue]] } });
        });
        return filledMap;
    }

    static calculateXpToNextLevel(currentLevel) {
        return ((currentLevel + 1) ** 2) * LEVELUP_BASE;
    }

    constructor() {
        super();
        this.state = {
            dungeonWidth: 10,
            dungeonHeight: 8,
            visibility: LIMITED,
            map: [],
            hero: {},
            enemies: {},
            healthPoints: {}
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
        let map = GenerateDungeon(width, height);
        const hero = this.initHero(map);
        map = App.placeItems(map, { hero }, HERO);
        const enemies = this.initEnemies(map);
        map = App.placeItems(map, enemies, ENEMY);
        const healthPoints = this.initHealthPoints(map);
        map = App.placeItems(map, healthPoints, HEALTHPOINT);
        this.setState({ gameState: GAME, width, height, map, hero, enemies, healthPoints });
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

    initHealthPoints(map) {
        const healthPoints = {};
        const healthPointsLimit = (map.length * map[0].length) * HEALTHPOINTSDENSITY;
        let healthPointsCounter = 0;
        let x;
        let y;
        let health;
        let point = { x: null, y: null };
        let id;
        while (healthPointsCounter < healthPointsLimit) {
            point = App.getRandomPoint(map);
            if (map[point.x][point.y] === DUNGEON) {
                health = App.getRandomValue(HP_MINHEALTH, HP_HEALTHDEVIATION);
                x = point.x;
                y = point.y;
                id = App.getItemID(x, y);
                healthPoints[id] = { x, y, health };
                healthPointsCounter += 1;
            }
        }
        return healthPoints;
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
        case HEALTHPOINT:
            this.pickHealth(nextX, nextY);
            break;
        case EMPTY:
            break;
        default:
            break;
        }
    }

    walk(nextX, nextY) {
        const x = this.state.hero.x;
        const y = this.state.hero.y;
        let map = this.state.map;
        map = update(map, { [x]: { $splice: [[y, 1, DUNGEON]] } });
        map = update(map, { [nextX]: { $splice: [[nextY, 1, HERO]] } });
        const hero = update(this.state.hero, { $merge: {
            x: nextX,
            y: nextY
        } });
        this.setState({ hero, map });
    }

    fight(nextX, nextY) {
        let hero = this.state.hero;
        const enemyID = App.getItemID(nextX, nextY);
        let enemy = this.state.enemies[enemyID];

        console.log('FIGHT');
        console.log('Hero attacks: hero health ' + hero.health + ' hero damage ' + (hero.level * hero.weapon) + ' enemy health: ' + enemy.health);

        hero = update(hero, { $merge: { hits: hero.hits + 1 } });
        enemy = update(enemy, { $merge: { health: enemy.health - (hero.level * hero.weapon) } });

        console.log('Hero attacked: enemy health: ' + enemy.health);

        if (enemy.health > 0) {
            console.log('Enemy attacks:  hero health ' + hero.health + ' enemy damage ' + enemy.damage);
            hero = update(hero, { $merge: { health: hero.health - enemy.damage } });
            console.log('Enemy attacked:  hero health ' + hero.health);

            if (hero.health <= 0) {
                this.endGame(LOSS);
            } else {
                const enemies = update(this.state.enemies, { $merge: { [enemyID]: enemy } });
                this.setState({ hero, enemies });
            }
        } else {
            this.updateXp(hero);
            console.log('Win! hero xp ' + hero.xp);
            this.removeItem(enemyID, 'enemies');
        }
    }

    updateXp(heroToUpdate) {
        const hero = heroToUpdate;
        const currentXp = XP_MIN + (XP_PER_HIT * hero.hits);
        hero.xp += currentXp;
        if (currentXp < hero.xpToNextLevel) {
            hero.xpToNextLevel -= currentXp;
        } else {
            hero.level += 1;
            hero.xpToNextLevel = App.calculateXpToNextLevel(hero.level) - hero.xpToNextLevel;
        }
        hero.hits = 0;
        this.setState({ hero });
    }

    removeItem(itemID, targetName) {
        let target = this.state[targetName];
        const item = target[itemID];
        const map = update(this.state.map, { [item.x]: { $splice: [[item.y, 1, DUNGEON]] } });
        target = update(target, { $unset: [itemID] });
        this.setState({ [targetName]: target, map });
    }

    pickHealth(nextX, nextY) {
        let hero = this.state.hero;
        const healthPointID = App.getItemID(nextX, nextY);
        const healthPoint = this.state.healthPoints[healthPointID];
        hero = update(hero, { $merge: { health: hero.health + healthPoint.health } });
        console.log('Health top-up: +' + healthPoint.health + ', current health ' + hero.health);
        this.removeItem(healthPointID, 'healthPoints');
        this.setState({ hero });
    }

    endGame(gameState) {
        window.removeEventListener('keydown', this.handleKeyDown);
        this.setState({ gameState });
    }

    setVisibilityArea() {
        const visibilityArea = [];
        const maxRowSize = (VISIBILITYRADIUS * 2) + 1;
        const minRowSize = VISIBILITYRADIUS % 2 ? VISIBILITYRADIUS : VISIBILITYRADIUS - 1;
        const startX = this.state.hero.x - minRowSize;
        const startY = this.state.hero.y - minRowSize;
        let currentRowSize = minRowSize;
        let rowsWithMaxSizeCount = 0;
        let rowSizeModifier = 2;
        let rowStart;

        for (let i = 0; i < maxRowSize; i += 1) {
            rowStart = (maxRowSize - currentRowSize) / 2;

            for (let j = rowStart; j < rowStart + currentRowSize; j += 1) {
                visibilityArea.push(App.getItemID(startX + i, startY + j));
            }

            if (currentRowSize === maxRowSize) {
                rowsWithMaxSizeCount += 1;
                if (rowsWithMaxSizeCount === minRowSize) {
                    rowSizeModifier *= -1;
                    currentRowSize += rowSizeModifier;
                }
            } else {
                currentRowSize += rowSizeModifier;
            }
        }
        return visibilityArea;
    }

    render() {
        if (this.state.gameState === GAME) {
            const visibilityArea = this.setVisibilityArea();
            return (
                <Map
                    map={this.state.map}
                    visibilityArea={visibilityArea}
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
