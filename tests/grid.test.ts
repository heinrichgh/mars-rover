import Grid from "../src/grid";
import Direction from "../src/direction";
import Position from "../src/position";
import RoverCommand from "../src/rover-command";

test.each([
    [5, 4,],
    [101, 50],
    [56, 4],
])("given width and height grid is size width*height", (width, height) => {
    const grid = new Grid(width, height);

    expect(grid.size()).toBe(width * height);
});

test.each([
    [5, 4,],
    [101, 50],
    [56, 4],
])("when height is a float it should round down", (width, height) => {
    const grid = new Grid(width, height + 0.7);

    expect(grid.size()).toBe(width * height);
});

test.each([
    [5, 4,],
    [101, 50],
    [56, 4],
])("when width is a float it should round down", (width, height) => {
    const grid = new Grid(width + 0.7, height);

    expect(grid.size()).toBe(width * height);
});

test.each([
    [5, 4, 5, 4],
    [101, 50, 0, 0],
    [56, 4, 56, 0],
    [56, 4, 0, 4],
    [56, 56, 25, 25],
])("when coordinates are on the grid return true", (width, height, x, y) => {
    const grid = new Grid(width, height);

    expect(grid.isAvailableOnGrid(new Position(x, y))).toBe(true);
});

test.each([
    [5, 4, 6, 4],
    [101, 50, 1, -1],
    [56, 4, 57, 0],
    [56, 4, 0, 5],
    [56, 56, -1, -1],
])("when coordinates are not on the grid return false", (width, height, x, y) => {
    const grid = new Grid(width, height);

    expect(grid.isAvailableOnGrid(new Position(x, y))).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("placing a rover should succeed if point is available on the grid", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);

    expect(grid.placeRover(position, direction, [])).toBe(true);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("placing a rover should fail if point is not available the grid due to being of the grid", (x, y, direction) => {
    const grid = new Grid(x / 2, y / 2);

    const position = new Position(x, y);

    expect(grid.placeRover(position, direction, [])).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("when coordinates are not available on the grid return false", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);
    grid.placeRover(position, direction, []);

    expect(grid.isAvailableOnGrid(new Position(x, y))).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("placing a rover should fail if point is not available the grid due to another rover occupying the space", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);

    grid.placeRover(position, direction, []);

    expect(grid.placeRover(position, direction, [])).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [20, 80, Direction.North],
    [9876294, 491723856, Direction.North],
])("placing a rover should register that rover on the grid on the provided position", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);
    grid.placeRover(position, direction, []);

    const roverPositions = grid.getPlacedRovers();

    expect(roverPositions[0].rover.position.equals(position)).toBe(true);
});

test.each([
    [5491723856, 7491723856, [{
        position: new Position(5, 4),
        direction: Direction.North
    }, {position: new Position(20, 80), direction: Direction.South}, {
        position: new Position(9876294, 491723856),
        direction: Direction.West
    }]],
    [500, 200, [{position: new Position(5, 4), direction: Direction.North}, {
        position: new Position(20, 80),
        direction: Direction.South
    }, {position: new Position(255, 101), direction: Direction.West}]],
])("placing multiple rovers should register all those rovers on the grid on the provided positions", (width, height, roverPlacements) => {
    const grid = new Grid(width, height);
    let x = roverPlacements[0];


    for (let i = 0; i < roverPlacements.length; i++) {
        const position = new Position(roverPlacements[i].position.x, roverPlacements[i].position.y);
        grid.placeRover(position, roverPlacements[i].direction, []);

        const roverPositions = grid.getPlacedRovers();
        expect(roverPositions[i].rover.position.equals(position)).toBe(true);
    }
});

test.each([
    [5, 4, Direction.North],
    [20, 80, Direction.North],
    [9876294, 491723856, Direction.North],
])("placing a rover that fails should not register that rover on the grid", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);
    grid.placeRover(position, direction, []);
    grid.placeRover(position, direction, []);

    const roverPositions = grid.getPlacedRovers();

    expect(roverPositions[0].rover.position.equals(position)).toBe(true);
    expect(roverPositions[1]).toBeUndefined();
});

test.each([
    [Direction.North, [RoverCommand.TurnRight], Direction.East],
    [Direction.North, [RoverCommand.TurnLeft], Direction.West],
])("when executing next with single rotation command and single rover, executes rover rotation command", (startingDirection, commands, expectedDirection) => {
    const grid = new Grid(20, 20);

    grid.placeRover(new Position(10, 10), startingDirection, commands);
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.direction).toBe(expectedDirection);
});

test.each([
    [Direction.North, [RoverCommand.TurnRight, RoverCommand.TurnRight], Direction.East],
    [Direction.South, [RoverCommand.TurnLeft, RoverCommand.TurnLeft, RoverCommand.TurnLeft], Direction.East],
    [Direction.West, [RoverCommand.TurnLeft, RoverCommand.TurnRight, RoverCommand.TurnRight], Direction.South],
])("when executing next with multiple rotation command and single rover, executes only the first command", (startingDirection, commands, expectedDirection) => {
    const grid = new Grid(20, 20);

    grid.placeRover(new Position(10, 10), startingDirection, commands);
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.direction).toBe(expectedDirection);
});

test.each([
    [Direction.North, [RoverCommand.TurnRight, RoverCommand.TurnRight], Direction.South],
    [Direction.South, [RoverCommand.TurnLeft, RoverCommand.TurnLeft, RoverCommand.TurnLeft], Direction.North],
    [Direction.West, [RoverCommand.TurnLeft, RoverCommand.TurnRight, RoverCommand.TurnRight], Direction.West],
])("when executing next again with multiple rotation command and single rover, executes the next command", (startingDirection, commands, expectedDirection) => {
    const grid = new Grid(20, 20);

    grid.placeRover(new Position(10, 10), startingDirection, commands);
    grid.next();
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.direction).toBe(expectedDirection);
});

test.each([
    [Direction.North, [RoverCommand.TurnRight], Direction.East],
    [Direction.North, [RoverCommand.TurnLeft], Direction.West],
])("when executing next with single rotation command and multiple rovers, executes one rover's rotation command", (startingDirection, commands, expectedDirection) => {
    const grid = new Grid(20, 20);

    grid.placeRover(new Position(10, 10), startingDirection, commands);
    grid.placeRover(new Position(12, 12), startingDirection, commands);
    grid.placeRover(new Position(14, 14), startingDirection, commands);
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.direction).toBe(expectedDirection);
    expect(placedRovers[1].rover.direction).toBe(startingDirection);
    expect(placedRovers[2].rover.direction).toBe(startingDirection);
});

test.each([
    [Direction.North, [RoverCommand.TurnRight], Direction.East],
    [Direction.North, [RoverCommand.TurnLeft], Direction.West],
])("when executing next again with single rotation command and multiple rovers, executes next rover's rotation command as well", (startingDirection, commands, expectedDirection) => {
    const grid = new Grid(20, 20);

    grid.placeRover(new Position(10, 10), startingDirection, commands);
    grid.placeRover(new Position(12, 12), startingDirection, commands);
    grid.placeRover(new Position(14, 14), startingDirection, commands);
    grid.next();
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.direction).toBe(expectedDirection);
    expect(placedRovers[1].rover.direction).toBe(expectedDirection);
    expect(placedRovers[2].rover.direction).toBe(startingDirection);
});

test.each([
    [new Position(10, 10), [RoverCommand.Move], Direction.North, new Position(10, 11)],
    [new Position(10, 10), [RoverCommand.Move], Direction.East, new Position(11, 10)],
    [new Position(14, 15), [RoverCommand.Move], Direction.South, new Position(14, 14)],
    [new Position(14, 15), [RoverCommand.Move], Direction.West, new Position(13, 15)],
])("when executing next with single move command and single rover, executes rover move command", (startingPosition, commands, startingDirection, expectedPosition) => {
    const grid = new Grid(20, 20);

    grid.placeRover(startingPosition, startingDirection, commands);
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.position).toEqual(expectedPosition);
});

test.each([
    [new Position(10, 10), [RoverCommand.Move, RoverCommand.Move, RoverCommand.Move], Direction.North, new Position(10, 11)],
    [new Position(10, 10), [RoverCommand.Move, RoverCommand.Move], Direction.East, new Position(11, 10)],
    [new Position(14, 15), [RoverCommand.Move, RoverCommand.Move], Direction.South, new Position(14, 14)],
    [new Position(14, 15), [RoverCommand.Move, RoverCommand.Move, RoverCommand.Move], Direction.West, new Position(13, 15)],
])("when executing next with multiple move commands and single rover, executes first rover move command", (startingPosition, commands, startingDirection, expectedPosition) => {
    const grid = new Grid(20, 20);

    grid.placeRover(startingPosition, startingDirection, commands);
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.position).toEqual(expectedPosition);
});

test.each([
    [new Position(10, 10), [RoverCommand.Move, RoverCommand.Move, RoverCommand.Move], Direction.North, new Position(10, 12)],
    [new Position(10, 10), [RoverCommand.Move, RoverCommand.Move], Direction.East, new Position(12, 10)],
    [new Position(14, 15), [RoverCommand.Move, RoverCommand.Move], Direction.South, new Position(14, 13)],
    [new Position(14, 15), [RoverCommand.Move, RoverCommand.Move, RoverCommand.Move], Direction.West, new Position(12, 15)],
])("when executing next again with multiple move commands and single rover, executes the next rover move command", (startingPosition, commands, startingDirection, expectedPosition) => {
    const grid = new Grid(20, 20);

    grid.placeRover(startingPosition, startingDirection, commands);
    grid.next();
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.position).toEqual(expectedPosition);
});

test.each([
    [[new Position(10, 10), new Position(14, 15)], [RoverCommand.Move], Direction.North, new Position(10, 11)],
    [[new Position(10, 10), new Position(14, 15)], [RoverCommand.Move], Direction.West, new Position(9, 10)],
])("when executing next with single move command with multiple rovers, executes one rover's move command", (startingPositions, commands, startingDirection, expectedPosition) => {
    const grid = new Grid(20, 20);

    grid.placeRover(startingPositions[0], startingDirection, commands);
    grid.placeRover(startingPositions[1], startingDirection, commands);
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.position).toEqual(expectedPosition);
    expect(placedRovers[1].rover.position).toEqual(startingPositions[1]);
});


test.each([
    [[new Position(10, 10), new Position(14, 15)], [RoverCommand.Move], Direction.North, [new Position(10, 11), new Position(14, 16)]],
    [[new Position(10, 10), new Position(14, 15)], [RoverCommand.Move], Direction.West, [new Position(9, 10), new Position(13, 15)]],
])("when executing next again with single move command with multiple rovers, executes next rover's move command as well", (startingPositions, commands, startingDirection, expectedPositions) => {
    const grid = new Grid(20, 20);

    grid.placeRover(startingPositions[0], startingDirection, commands);
    grid.placeRover(startingPositions[1], startingDirection, commands);
    grid.next();
    grid.next();

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.position).toEqual(expectedPositions[0]);
    expect(placedRovers[1].rover.position).toEqual(expectedPositions[1]);
});

test.each([
    [Direction.North, [RoverCommand.TurnRight], Direction.East],
    [Direction.North, [RoverCommand.TurnLeft], Direction.West],
])("when executing next and there were no commands to execute, return false", (startingDirection, commands, expectedDirection) => {
    const grid = new Grid(20, 20);

    grid.placeRover(new Position(10, 10), startingDirection, commands);
    grid.placeRover(new Position(12, 12), startingDirection, commands);
    grid.placeRover(new Position(14, 14), startingDirection, commands);
    grid.next();
    grid.next();
    grid.next();
    const result = grid.next();

    expect(result).toBe(false);
});
