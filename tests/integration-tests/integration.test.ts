import InputParser from "../../src/input-parser";
import Grid from "../../src/grid";
import Position from "../../src/position";
import Direction from "../../src/direction";

test("parsing with a full run", () => {
    const inputText = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;
    const parser = new InputParser();
    const parsed = parser.parse(inputText);

    const grid = new Grid(parsed.grid.width, parsed.grid.height);

    for (let rover of parsed.rovers) {
        grid.placeRover(rover.position, rover.direction, rover.commands);
    }

    while(grid.next()) {}

    const placedRovers = grid.getPlacedRovers();

    expect(placedRovers[0].rover.position).toEqual(new Position(1, 3));
    expect(placedRovers[0].rover.direction).toEqual(Direction.North);
    expect(placedRovers[1].rover.position).toEqual(new Position(5, 1));
    expect(placedRovers[1].rover.direction).toEqual(Direction.East);
});