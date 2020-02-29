import Position from "../src/position";
import Direction from "../src/direction";
import InputParser from "../src/input-parser";
import RoverCommand from "../src/rover-command";

test.each([
    ["1 2 N", {position: new Position(1, 2), direction: Direction.North}],
    ["40 26 E", {position: new Position(40, 26), direction: Direction.East}],
    ["105 208 S", {position: new Position(105, 208), direction: Direction.South}],
    ["137823 284389723 W", {position: new Position(137823, 284389723), direction: Direction.West}],
])("parses input line for rover into position and direction", (inputString, expectedOutput) => {
    const parser = new InputParser();
    const roverDetails = parser.parseRoverInputLine(inputString);

    expect(roverDetails.position.equals(expectedOutput.position)).toBe(true);
    expect(roverDetails.direction).toBe(expectedOutput.direction);
});

test.each([
    ["HG1 2 N"],
    ["1 BT2 E"],
    ["apples RT S"],
])("incorrect coordinate string throws exception", (inputString) => {
    const parser = new InputParser();

    expect(() => parser.parseRoverInputLine(inputString)).toThrowError("Invalid Coordinates Input");
});

test.each([
    ["1 2 F"],
    ["1 2 HGT"],
    ["1 2 NESW"],
])("incorrect direction string throws exception", (inputString) => {
    const parser = new InputParser();

    expect(() => parser.parseRoverInputLine(inputString)).toThrowError("Invalid Direction Input");
});

test.each([
    ["L", [RoverCommand.TurnLeft]],
    ["R", [RoverCommand.TurnRight]],
    ["M", [RoverCommand.Move]],
    ["", []],
    ["LMLMLM", [RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.TurnLeft, RoverCommand.Move]],
    ["MMRMM", [RoverCommand.Move, RoverCommand.Move, RoverCommand.TurnRight, RoverCommand.Move, RoverCommand.Move]],
    ["LMRMLM", [RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.TurnRight, RoverCommand.Move, RoverCommand.TurnLeft, RoverCommand.Move]],
])("parses rover command string into rover commands array", (inputString, expectedCommands) => {
    const parser = new InputParser();
    const roverCommands = parser.parseRoverCommandsLine(inputString);

    expect(roverCommands).toEqual(expectedCommands);
});

test.each([
    ["T"],
    ["BBQ"],
    ["what you mean"],
])("incorrect command string throws exception", (inputString) => {
    const parser = new InputParser();

    expect(() => parser.parseRoverCommandsLine(inputString)).toThrowError("Invalid Rover Command Input");
});

test.each([
    ["5 5", {width: 5, height: 5}],
    ["2 6", {width: 2, height: 6}],
    ["500 300", {width: 500, height: 300}],
])("parse grid input into width and height", (inputString, expected) => {
    const parser = new InputParser();
    const gridSize = parser.parseGridSizeLine(inputString);

    expect(gridSize).toEqual(expected);
});

test.each([
    ["R5 5"],
    ["2 B6"],
    ["50GTW0 RHW"],
])("incorrect grid input throws exception", (inputString) => {
    const parser = new InputParser();

    expect(() => parser.parseGridSizeLine(inputString)).toThrowError("Invalid Grid Input");
});

test.each([
    [`5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`, {
        grid: {width: 5, height: 5},
        rovers: [
            {
                position: new Position(1, 2),
                direction: Direction.North,
                commands: [RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.TurnLeft, RoverCommand.Move, RoverCommand.Move]
            },
            {
                position: new Position(3, 3),
                direction: Direction.East,
                commands: [RoverCommand.Move, RoverCommand.Move, RoverCommand.TurnRight, RoverCommand.Move, RoverCommand.Move, RoverCommand.TurnRight, RoverCommand.Move, RoverCommand.TurnRight, RoverCommand.TurnRight, RoverCommand.Move]
            }
        ]
    }
    ]
])("parse complete input correctly", (inputText, expected) => {
    const parser = new InputParser();

    const parsed = parser.parse(inputText);

    expect(parsed).toEqual(expected);
});