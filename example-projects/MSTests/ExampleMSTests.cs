using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace MSTests.MSTests
{
    [TestClass]
    public class ExampleMSTests
    {
        [TestMethod]
        public void PassingMSTest()
        {
            Assert.IsTrue(true);
        }

        [TestMethod]
        public void FailingMSTest()
        {
            Assert.Fail();
        }
    }
}
