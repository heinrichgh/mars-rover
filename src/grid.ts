import Direction from "./direction";
import Position from "./position";
import Rover from "./rover";

interface PlacedRover {
    rover: Rover,
    position: Position
}

class Grid {
    private readonly _width : number;
    private readonly _height : number;
    private readonly _placedRovers : PlacedRover[];

    constructor(width : number, height: number) {
        this._width = Math.floor(width);
        this._height = Math.floor(height);
        this._placedRovers = [];
    }

    size() {
        return this._width * this._height;
    }

    isAvailableOnGrid(position: Position) {
        return this.isWithinWidthBoundary(position.x) && this.isWithinHeightBoundary(position.y) && this.isEmptySpace(position);
    }

    private isWithinWidthBoundary(x: number) {
        return x >= 0 && x <= this._width;
    }

    private isWithinHeightBoundary(y: number) {
        return y >= 0 && y <= this._height;
    }

    private isEmptySpace(position: Position) {
        for (const placedRover of this._placedRovers) {
            if (placedRover.position.equals(position)) {
                return false;
            }
        }

        return true;
    }

    placeRover(position : Position, direction: Direction) {
        if (!this.isAvailableOnGrid(position)) {
            return false;
        }

        this._placedRovers.push({
            rover: new Rover(direction, this),
            position
        });

        return true;
    }

    getPlacedRovers() {
        return this._placedRovers;
    }
}

export default Grid;