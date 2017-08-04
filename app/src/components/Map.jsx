import React from 'react';
import PropTypes from 'prop-types';
import Constants from './../Constants';

const { EMPTY, DUNGEON, HERO, ENEMY, HEALTHPOINT } = Constants.CellState;

function getItemID(x, y) {
    return ''.concat(x).concat('-').concat(y);
}

function Grid({ map, visibilityArea }) {
    const width = map.length;
    const height = map[0].length;

    const mapToRender = [];
    let currentRow;
    let currentCellStyle;

    for (let y = 0; y < height; y += 1) {
        currentRow = [];
        for (let x = 0; x < width; x += 1) {
            if (visibilityArea && visibilityArea.indexOf(getItemID(x, y)) === -1) {
                currentCellStyle = 'map-cell-empty';
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

Grid.propTypes = {
    map: PropTypes.array.isRequired,
    visibilityArea: PropTypes.array
};

Grid.defaultProps = {
    visibilityArea: null
};

export default Grid;
