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

    expect(grid.placeRover(position, direction)).toBe(true);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("placing a rover should fail if point is not available the grid due to being of the grid", (x, y, direction) => {
    const grid = new Grid(x / 2, y / 2);

    const position = new Position(x, y);

    expect(grid.placeRover(position, direction)).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("when coordinates are not available on the grid return false", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);
    grid.placeRover(position, direction);

    expect(grid.isAvailableOnGrid(new Position(x, y))).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [50, 60, Direction.West],
    [100200, 400200, Direction.South],
    [245982, 765091, Direction.East],
])("placing a rover should fail if point is not available the grid due to another rover occupying the space", (x, y, direction) => {
    const grid = new Grid(x  * 2, y * 2);

    const position = new Position(x, y);

    grid.placeRover(position, direction);

    expect(grid.placeRover(position, direction)).toBe(false);
});

test.each([
    [5, 4, Direction.North],
    [20, 80, Direction.North],
    [9876294, 491723856, Direction.North],
])("placing a rover should register that rover on the grid on the provided position", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);
    grid.placeRover(position, direction);

    const roverPositions = grid.getPlacedRovers();

    expect(roverPositions[0].position.equals(position)).toBe(true);
});

test.each([
    [5491723856, 7491723856, [{ position: new Position(5, 4), direction:  Direction.North}, { position: new Position(20, 80), direction:  Direction.South}, { position: new Position(9876294, 491723856), direction:  Direction.West}]],
    [500, 200, [{ position: new Position(5, 4), direction:  Direction.North}, { position: new Position(20, 80), direction:  Direction.South}, { position: new Position(255, 101), direction:  Direction.West}]],
])("placing multiple rovers should register all those rovers on the grid on the provided positions", (width, height, roverPlacements) => {
    const grid = new Grid(width, height);
let x = roverPlacements[0];


    for (let i = 0; i < roverPlacements.length; i++) {
        const position = new Position(roverPlacements[i].position.x, roverPlacements[i].position.y);
        grid.placeRover(position, roverPlacements[i].direction);

        const roverPositions = grid.getPlacedRovers();
        expect(roverPositions[i].position.equals(position)).toBe(true);
    }
});

test.each([
    [5, 4, Direction.North],
    [20, 80, Direction.North],
    [9876294, 491723856, Direction.North],
])("placing a rover that fails should not register that rover on the grid", (x, y, direction) => {
    const grid = new Grid(x * 2, y * 2);

    const position = new Position(x, y);
    grid.placeRover(position, direction);
    grid.placeRover(position, direction);

    const roverPositions = grid.getPlacedRovers();

    expect(roverPositions[0].position.equals(position)).toBe(true);
    expect(roverPositions[1]).toBeUndefined();
});

// TODO: Add roverCommands when placing rovers on the grid