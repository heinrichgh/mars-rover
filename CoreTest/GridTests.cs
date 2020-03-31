using System.Collections.Generic;
using Core;
using NUnit.Framework;

namespace CoreTest
{
    public class GridTests
    {
        [Test]
        public void ConstructGrid()
        {
            const int width = 10;
            const int height = 10;
            var grid = new Grid(width, height);
        }

        [TestCase(10, 10, 5, 5)]
        [TestCase(10, 10, 10, 10)]
        [TestCase(10, 10, 0, 10)]
        [TestCase(10, 10, 10, 0)]
        [TestCase(10, 10, 0, 0)]
        public void PlaceRover_OnGrid_NoException(int width, int height, int x, int y)
        {
            const string name = "test name";
            var coordinate = new Coordinate
            {
                X = x,
                Y = y
            };
            var direction = Direction.North;
            var movement = new List<Movement>();
            var rover = new Rover(name, coordinate, direction, movement);
            var grid = new Grid(width, height);

            grid.PlaceRover(rover);
        }

        [TestCase(10, 10, 11, 11)]
        [TestCase(10, 10, 11, 5)]
        [TestCase(10, 10, 5, 11)]
        [TestCase(10, 10, -1, -1)]
        [TestCase(10, 10, -1, 5)]
        [TestCase(10, 10, 5, -1)]
        public void PlaceRover_NotOnGrid_ThrowsException(int width, int height, int x, int y)
        {
            const string name = "test name";
            var coordinate = new Coordinate
            {
                X = x,
                Y = y
            };
            var direction = Direction.North;
            var movement = new List<Movement>();
            var rover = new Rover(name, coordinate, direction, movement);
            var grid = new Grid(width, height);

            Assert.Throws<InvalidRoverPositionException>(() => grid.PlaceRover(rover));
        }
    }
}