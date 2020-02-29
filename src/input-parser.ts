import Position from "./position";
import Direction from "./direction";
import RoverCommand from "./rover-command";

interface ParsedGrid {
    width: number,
    height: number
}

interface ParsedRover {
    position: Position,
    direction: Direction,
    commands: RoverCommand[]
}

interface ParsedInput {
    grid: ParsedGrid,
    rovers: ParsedRover[]
}

class InputParser {

    parseRoverInputLine(inputString: string) {
        const splitString = inputString.split(" ");
        const x = Number(splitString[0]);
        const y = Number(splitString[1]);

        if (Number.isNaN(x) || Number.isNaN(y)) {
            throw "Invalid Coordinates Input";
        }

        const direction = InputParser.convertDirectionCharacter(splitString[2]);
        return {
            position: new Position(x, y)
            , direction
        };
    }

    private static convertDirectionCharacter(directionCharacter: string) {
        switch (directionCharacter) {
            case "N":
                return Direction.North;
            case "E":
                return Direction.East;
            case "S":
                return Direction.South;
            case "W":
                return Direction.West;
            default:
                throw "Invalid Direction Input";
        }
    }

    parseRoverCommandsLine(inputString: string) {
        const commands: RoverCommand[] = [];
        const splitString = inputString.split("");

        for (let commandCharacter of splitString) {
            switch (commandCharacter) {
                case "L":
                    commands.push(RoverCommand.TurnLeft);
                    break;
                case "R":
                    commands.push(RoverCommand.TurnRight);
                    break;
                case "M":
                    commands.push(RoverCommand.Move);
                    break;
                default:
                    throw "Invalid Rover Command Input"
            }
        }

        return commands;
    }

    parseGridSizeLine(inputString: string) {
        const splitString = inputString.split(" ");
        const width = Number(splitString[0]);
        const height = Number(splitString[1]);

        if (Number.isNaN(width) || Number.isNaN(height)) {
            throw "Invalid Grid Input";
        }

        return {
            width,
            height
        };
    }

    parse(inputText: string) {
        const splitLines = inputText.split("\n").map(str => str.trim());
        const grid = this.parseGridSizeLine(splitLines[0]);
        const rovers: ParsedRover[] = [];

        for (let i = 1; i < splitLines.length - 1; i += 2) {
            const rover = this.parseRoverInputLine(splitLines[i]);
            const roverCommands = this.parseRoverCommandsLine(splitLines[i + 1]);
            rovers.push({
                position: rover.position,
                direction: rover.direction,
                commands: roverCommands
            });
        }

        return {
            grid,
            rovers
        }
    }
}

export default InputParser;