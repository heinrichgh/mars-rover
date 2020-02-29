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

    moveFrom(position: Position) {
        let potentialPosition = this.getPotentialPosition(position);
        if (this._grid.isAvailableOnGrid(potentialPosition)) {
            return potentialPosition;
        }
        return position;
    }

    private getPotentialPosition(position: Position) {
        switch (this._direction) {
            case Direction.North:
                return new Position(position.x, position.y + 1);
            case Direction.East:
                return new Position(position.x + 1, position.y);
            case Direction.South:
                return new Position(position.x, position.y - 1);
            case Direction.West:
                return new Position(position.x - 1, position.y);
        }
    }

    rotateLeft() {
        switch (this._direction) {
            case Direction.North:
                this._direction = Direction.West;
                break;
            case Direction.East:
                this._direction = Direction.North;
                break;
            case Direction.South:
                this._direction = Direction.East;
                break;
            case Direction.West:
                this._direction = Direction.South;
                break;
        }
    }

    rotateRight() {
        switch (this._direction) {
            case Direction.North:
                this._direction = Direction.East;
                break;
            case Direction.East:
                this._direction = Direction.South;
                break;
            case Direction.South:
                this._direction = Direction.West;
                break;
            case Direction.West:
                this._direction = Direction.North;
                break;
        }
    }
}

export default Rover;