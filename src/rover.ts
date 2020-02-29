import Direction from "./direction";
import Grid from "./grid";
import Position from "./position";

class Rover {
    private _direction: Direction;
    private readonly _grid: Grid;
    private _position: Position;

    get direction() : Direction {
        return this._direction;
    }

    get position() : Position {
        return this._position;
    }

    constructor(direction: Direction, position: Position, grid: Grid) {
        this._direction = direction;
        this._grid = grid;
        this._position = position;
    }

    move() {
        let potentialPosition = this.getPotentialPosition();
        if (this._grid.isAvailableOnGrid(potentialPosition)) {
            this._position = potentialPosition;
        }
    }

    private getPotentialPosition() {
        switch (this._direction) {
            case Direction.North:
                return new Position(this._position.x, this._position.y + 1);
            case Direction.East:
                return new Position(this._position.x + 1, this._position.y);
            case Direction.South:
                return new Position(this._position.x, this._position.y - 1);
            case Direction.West:
                return new Position(this._position.x - 1, this._position.y);
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