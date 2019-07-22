import * as chai from 'chai';
import * as dotnetWrapper from '../src/dotnetWrapper';

const mstestPath = '../example_projects/MSTests';

describe('Get tests from .Dll', () =>
{
    it('should not return an error', () =>
    {
        console.log("started test")
        dotnetWrapper.getTestsFromDll(mstestPath, '')
            .then(() => 
            {
                console.log("made it to the success part");
                chai.assert(true);
            })
            .catch((errorMessage) => 
            {
                console.log("made it to the error part");
                chai.assert(false, `get tests failed due to error: ${errorMessage}`);
            });
    });
});