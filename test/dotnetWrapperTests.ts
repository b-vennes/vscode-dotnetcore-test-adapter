import * as dotnetWrapper from '../src/dotnetWrapper';
import { expect } from 'chai';

const testFileFolder = '../';

const msTestsDllPath = 'example_projects/MSTests/bin/Debug/netcoreapp2.2/MSTests.dll';

describe('Get tests from MSTest .Dll', () =>
{
    it('should not return an error', async () =>
    {
        await dotnetWrapper.getTestsFromDll(msTestsDllPath, testFileFolder);
    });

    it('should return correct list', async () =>
    {
        await dotnetWrapper.getTestsFromDll(msTestsDllPath, testFileFolder)
            .then((tests) =>
            {
                expect(tests.length).to.equal(2);
                expect(tests).to.include("MSTests.ExampleMSTests.PassingMSTest", `actual: ${tests}`);
                expect(tests).to.include("MSTests.ExampleMSTests.FailingMSTest", `actual: ${tests}`);
            });
    });
});

const nunitDllPath = 'example_projects/NunitTests/bin/Debug/netcoreapp2.2/NunitTests.dll';

describe('Get tests from Nunit .Dll', () =>
{
    it('should not return an error', async () =>
    {
        await dotnetWrapper.getTestsFromDll(nunitDllPath, testFileFolder);
    });

    it('should return correct list', async () =>
    {
        await dotnetWrapper.getTestsFromDll(nunitDllPath, testFileFolder)
            .then((tests) =>
            {
                expect(tests.length).to.equal(2);
                expect(tests).to.include("NunitTests.ExampleNunitTests.PassingNunitTest", `actual: ${tests}`);
                expect(tests).to.include("NunitTests.ExampleNunitTests.FailingNunitTest", `actual: ${tests}`);
            });
    });
});