import Direction from "./direction";
import Grid from "./grid";
import Position from "./position";

class Rover {
    private _direction: Direction;
    private readonly _grid: Grid;

    constructor(direction: Direction, grid: Grid) {
        this._direction = direction;
        this._grid = grid;
    }

    moveFrom(x: number, y: number) {
        let potentialPosition = this.getPotentialPosition(x, y);
        if (this._grid.isOnGrid(potentialPosition.x, potentialPosition.y)) {
            return potentialPosition;
        }
        return new Position(x, y);
    }

    private getPotentialPosition(x: number, y: number) {
        switch (this._direction) {
            case Direction.North:
                return new Position(x, y + 1);
            case Direction.East:
                return new Position(x + 1, y);
            case Direction.South:
                return new Position(x, y - 1);
            case Direction.West:
                return new Position(x - 1, y);
        }
    }

    rotateLeft() {
        if (this._direction === Direction.North) {
            this._direction = Direction.West;
        } else if (this._direction === Direction.East) {
            this._direction = Direction.North;
        }

    }

    rotateRight() {
        this._direction = Direction.East;
    }
}

export default Rover;