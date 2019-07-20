import { expect, assert } from 'chai';
import { describe } from 'mocha';
import { loadTests } from '../src/testsFunctions'

describe('Load Tests', () =>
{
    const mstestPath = '../example_projects/MSTests';
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