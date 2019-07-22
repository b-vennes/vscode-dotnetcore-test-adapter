using System;
using Xunit;

namespace XunitTests
{
    public class ExampleXunitTests
    {

        [Fact]
        public void PassingXunitTest()
        {
            Xunit.Assert.True(true);
        }

        [Fact]
        public void FailingXunitTest()
        {
            Xunit.Assert.True(false);
        }
    }
}
