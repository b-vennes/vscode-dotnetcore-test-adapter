import { expect, assert } from 'chai';
import { describe } from 'mocha';
import { runTest, loadTests } from '../src/dotnetWrapper';

const mstestPath = '../example_projects/MSTests';

describe('Load Tests', () =>
{
    it('should not return an error', () =>{
        loadTests(mstestPath)
            .then((testInfo) => {
                assert(true);
            })
            .catch((error) => {
                assert(false, 'load tests returned error');
            });
    });

    it('should return the correct test names', () => 
    {
        loadTests(mstestPath)
            .then((testInfo) => 
            {
                expect(testInfo.children != null);
                expect(testInfo.children.length > 0);
                expect(testInfo.children[0].label == 'TestMethod1');
            })
            .catch((error) =>
            {
                assert(false, 'load tests returned error')
            });
    });
});

describe('Run Tests', () =>
{
    it('should run working tests without errors', () =>
    {
        runTest('TestMethod1', mstestPath)
            .then((response) =>
            {
                expect(response == 'Passed');
            })
            .catch((error) =>
            {
                assert(false, 'run test returned an error');
            });
    });
});