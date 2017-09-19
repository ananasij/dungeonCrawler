import React from 'react';
import PropTypes from 'prop-types';
import Constants from './../Constants';

const { EMPTY, DUNGEON, HERO, ENEMY, HEALTHPOINT } = Constants.CellState;
const { CELL_SIZE_PX } = Constants.Map;

function getItemID(x, y) {
    return ''.concat(x).concat('-').concat(y);
}

function getStart(heroCoordinate, viewportSize, mapSize) {
    const offset = Math.floor(viewportSize / 2);
    if (viewportSize > mapSize || heroCoordinate - offset < 0) {
        return 0;
    } else if (heroCoordinate + offset > mapSize) {
        return mapSize - viewportSize;
    }
    return heroCoordinate - offset;
}

function Map({ hero, map, visibilityArea, windowSize }) {
    const mapWidth = map.length;
    const mapHeight = map[0].length;
    const mapToRender = [];
    let currentRow;
    let currentCellStyle;

    const viewportWidth = Math.floor(windowSize.width / CELL_SIZE_PX);
    const viewportHeight = Math.floor(windowSize.height / CELL_SIZE_PX);

    const width = viewportWidth > mapWidth ? mapWidth : viewportWidth;
    const height = viewportHeight > mapHeight ? mapHeight : viewportHeight;

    const startX = getStart(hero.x, width, mapWidth);
    const startY = getStart(hero.y, height, mapHeight);

    for (let y = startY; y < startY + height; y += 1) {
        currentRow = [];
        for (let x = startX; x < startX + width; x += 1) {
            if (visibilityArea && visibilityArea.indexOf(getItemID(x, y)) === -1) {
                currentCellStyle = 'map-cell-invisible';
            } else {
                switch (map[x][y]) {
                case EMPTY:
                    currentCellStyle = 'map-cell-empty';
                    break;
                case DUNGEON:
                    currentCellStyle = 'map-cell-dungeon';
                    break;
                case HERO:
                    currentCellStyle = 'map-cell-hero';
                    break;
                case ENEMY:
                    currentCellStyle = 'map-cell-enemy';
                    break;
                case HEALTHPOINT:
                    currentCellStyle = 'map-cell-healthpoint';
                    break;
                default:
                    break;
                }
            }

            if (!map[x][y]) {
                throw new Error(`Undefined cell: ${x}, ${y}`);
            }

            currentRow.push(
                <div
                    key={''.concat(x, y)}
                    className={'map-cell '.concat(currentCellStyle)}
                >{map[x][y] === DUNGEON ? '' : '' }</div>
            );
        }
        mapToRender.push(<div className="map-row" key={y}>{currentRow}</div>);
    }

    return (
        <div className="map">
            {mapToRender}
        </div>
    );
}

Map.propTypes = {
    hero: PropTypes.object.isRequired,
    map: PropTypes.array.isRequired,
    visibilityArea: PropTypes.array,
    windowSize: PropTypes.object.isRequired
};

Map.defaultProps = {
    visibilityArea: null
};

export default Map;
