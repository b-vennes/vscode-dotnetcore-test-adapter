using NUnit.Framework;

namespace NunitTests.NunitTests
{
    public class ExampleNunitTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void PassingNunitTest()
        {
            Assert.IsTrue(true);
        }

        [Test]
        public void FailingNunitTest()
        {
            Assert.Fail();
        }
    }
}