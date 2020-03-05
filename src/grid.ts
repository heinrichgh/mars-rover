import Direction from "./direction";
import Position from "./position";
import Rover from "./rover";
import RoverCommand from "./rover-command";

export interface PlacedRover {
    rover: Rover,
    commands: RoverCommand[]
}

class Grid {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _placedRovers: PlacedRover[];

    constructor(width: number, height: number) {
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
            if (placedRover.rover.position.equals(position)) {
                return false;
            }
        }

        return true;
    }

    placeRover(position: Position, direction: Direction, commands: RoverCommand[]) {
        if (!this.isAvailableOnGrid(position)) {
            return false;
        }

        this._placedRovers.push({
            rover: new Rover(direction, position, this),
            commands
        });

        return true;
    }

    getPlacedRovers() {
        return this._placedRovers;
    }

    next() {
        for (const placedRover of this._placedRovers) {
            if (placedRover.commands.length > 0) {
                const command = placedRover.commands[0];
                placedRover.commands = placedRover.commands.slice(1);

                if (command == RoverCommand.TurnRight) {
                    placedRover.rover.rotateRight();
                } else if (command == RoverCommand.TurnLeft) {
                    placedRover.rover.rotateLeft();
                } else if (command == RoverCommand.Move) {
                    placedRover.rover.move();
                }
                return true;
            }
        }
        return false;
    }
}

export default Grid;