import { expect, assert } from 'chai';
import { runDotnetTest, loadDotnetTests } from '../src/dotnetWrapper';

const mstestPath = '../example_projects/MSTests';

describe('Load Tests', () =>
{
    it('should not return an error', () =>{
        loadDotnetTests(mstestPath)
            .then(() => {
                assert(true);
            })
            .catch(() => {
                assert(false, 'load tests returned error');
            });
    });

    it('should return the correct test names', () => 
    {
        loadDotnetTests(mstestPath)
            .then((testInfo) => 
            {
                expect(testInfo.children != null);
                expect(testInfo.children.length > 0);
                expect
                (
                    testInfo.children
                    .map((test) => test.label)
                    .includes("PassingMSTest")
                );
                expect
                (
                    testInfo.children
                    .map((test) => test.label)
                    .includes("FailingMSTest")
                );
            })
            .catch(() =>
            {
                assert(false, 'load tests returned error')
            });
    });
});

describe('Run Tests', () =>
{
    it('should run working tests without errors', () =>
    {
        runDotnetTest('TestMethod1', mstestPath)
            .then((response) =>
            {
                expect(response == 'Passed');
            })
            .catch(() =>
            {
                assert(false, 'run test returned an error');
            });
    });
});