using System.Collections.Generic;
using Core;
using NUnit.Framework;

namespace CoreTest
{
    public class RoverTests
    {
        [Test]
        public void ConstructRover()
        {
            const string name = "test name";
            var coordinate = new Coordinate
            {
                X = 10,
                Y = 10
            };
            var direction = Direction.North;
            var movement = new List<Movement>();
            var rover = new Rover(name, coordinate, direction, movement);
        }

        [Test]
        public void GetCoordinates()
        {
            const string name = "test name";
            var coordinate = new Coordinate
            {
                X = 10,
                Y = 10
            };
            var direction = Direction.North;
            var movement = new List<Movement>();
            var rover = new Rover(name, coordinate, direction, movement);

            var result = rover.Coordinate;
            
            Assert.Multiple(() => {
                Assert.That(result.X, Is.EqualTo(coordinate.X));
                Assert.That(result.Y, Is.EqualTo(coordinate.Y));
            });
        }
    }
}