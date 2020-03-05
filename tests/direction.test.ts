import Direction, {DirectionToString} from "../src/direction";

test("if direction North, return N", () => {
    const result = DirectionToString(Direction.North);

    expect(result).toBe("N");
});

test("if direction East, return E", () => {
    const result = DirectionToString(Direction.East);

    expect(result).toBe("E");
});

test("if direction South, return S", () => {
    const result = DirectionToString(Direction.South);

    expect(result).toBe("S");
});

test("if direction West, return W", () => {
    const result = DirectionToString(Direction.West);

    expect(result).toBe("W");
});
