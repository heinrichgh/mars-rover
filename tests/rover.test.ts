import Rover from "../src/rover";
import Direction from "../src/direction";
import Grid from "../src/grid";
import Position from "../src/position";

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('north facing rover at coordinates (%i, %i), should move one position north', (x, y) => {
    const grid = new Grid(x, y * 2);
    const rover = new Rover(Direction.North, new Position(x, y), grid);

    rover.move();

    expect(rover.position.x).toBe(x);
    expect(rover.position.y).toBe(y + 1);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('east facing rover at coordinates (%i, %i), should move one position east', (x, y) => {
    const grid = new Grid(x * 2, y);
    const rover = new Rover(Direction.East, new Position(x, y), grid);

    rover.move();

    expect(rover.position.x).toBe(x + 1);
    expect(rover.position.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('south facing rover at coordinates (%i, %i), should move one position south', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.South, new Position(x, y), grid);

    rover.move();

    expect(rover.position.x).toBe(x);
    expect(rover.position.y).toBe(y - 1);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('west facing rover at coordinates (%i, %i), should move one position west', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.West, new Position(x, y), grid);

    rover.move();

    expect(rover.position.x).toBe(x - 1);
    expect(rover.position.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('north facing rover on northern border should stay at current position when asked to move', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.North, new Position(x, y), grid);

    rover.move();

    expect(rover.position.x).toBe(x);
    expect(rover.position.y).toBe(y);
});

test.each([
    [5, 4,],
    [2, 3],
    [8, 1],
])('east facing rover on eastern border should stay at current position when asked to move', (x, y) => {
    const grid = new Grid(x, y);
    const rover = new Rover(Direction.East, new Position(x, y), grid);

    rover.move();

    expect(rover.position.x).toBe(x);
    expect(rover.position.y).toBe(y);
});

test.each([
    [5],
    [2],
    [8],
])('south facing rover on southern border should stay at current position when asked to move', (x) => {
    const grid = new Grid(x, x);
    const rover = new Rover(Direction.South, new Position(x, 0), grid);

    rover.move();

    expect(rover.position.x).toBe(x);
    expect(rover.position.y).toBe(0);
});

test.each([
    [5],
    [2],
    [8],
])('west facing rover on western border should stay at current position when asked to move', (y) => {
    const grid = new Grid(y, y);
    const rover = new Rover(Direction.West, new Position(0, y), grid);

    rover.move();

    expect(rover.position.x).toBe(0);
    expect(rover.position.y).toBe(y);
});

test('north facing rover at coordinates (%i, %i), after turned left, should be facing west', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.North, new Position(0, 0), grid);
    rover.rotateLeft();

    expect(rover.direction).toBe(Direction.West);
});

test('north facing rover at coordinates (%i, %i), after turned right, should be facing east', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.North, new Position(0, 0), grid);
    rover.rotateRight();

    expect(rover.direction).toBe(Direction.East);
});

test('east facing rover at coordinates (%i, %i), after turned left, should be facing north', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.East, new Position(0, 0), grid);
    rover.rotateLeft();

    expect(rover.direction).toBe(Direction.North);
});

test('east facing rover at coordinates (%i, %i), after turned right, should be facing south', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.East, new Position(0, 0), grid);
    rover.rotateRight();

    expect(rover.direction).toBe(Direction.South);
});

test('south facing rover at coordinates (%i, %i), after turned left, should be facing east', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.South, new Position(0, 0), grid);
    rover.rotateLeft();

    expect(rover.direction).toBe(Direction.East);
});

test('south facing rover at coordinates (%i, %i), after turned right, should be facing west', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.South, new Position(0, 0), grid);
    rover.rotateRight();

    expect(rover.direction).toBe(Direction.West);
});

test('west facing rover at coordinates (%i, %i), after turned left, should be facing south', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.West, new Position(0, 0), grid);
    rover.rotateLeft();

    expect(rover.direction).toBe(Direction.South);
});

test('west facing rover at coordinates (%i, %i), after turned right, should be facing north', () => {
    const grid = new Grid(10, 10);
    const rover = new Rover(Direction.West, new Position(0, 0), grid);
    rover.rotateRight();

    expect(rover.direction).toBe(Direction.North);
});