import * as dotnetWrapper from '../src/dotnetWrapper';
import { expect } from 'chai';

const testFileFolder = './test';

describe('Get tests from MSTest .Dll', () =>
{
    const msTestsDllPath = 'example_projects/MSTests/bin/Debug/netcoreapp2.2/MSTests.dll';

    it('should not throw an error', async () =>
    {
        await dotnetWrapper.getTestFqdnsFromDll(msTestsDllPath, testFileFolder);
    });

    it('should return correct test FQDNs', async () =>
    {
        await dotnetWrapper.getTestFqdnsFromDll(msTestsDllPath, testFileFolder)
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
    it('should not throw an error', async () =>
    {
        await dotnetWrapper.getTestFqdnsFromDll(nunitDllPath, testFileFolder);
    });

    it('should return correct test FQDNs', async () =>
    {
        await dotnetWrapper.getTestFqdnsFromDll(nunitDllPath, testFileFolder)
            .then((tests) =>
            {
                expect(tests.length).to.equal(2);
                expect(tests).to.include("NunitTests.ExampleNunitTests.PassingNunitTest", `actual: ${tests}`);
                expect(tests).to.include("NunitTests.ExampleNunitTests.FailingNunitTest", `actual: ${tests}`);
            });
    });
});

describe('Get tests from Xunit .Dll', () =>
{
    const xunitDllPath = 'example_projects/XunitTests/bin/Debug/netcoreapp2.2/XunitTests.dll';

    it('should not throw an error', async () =>
    {
        await dotnetWrapper.getTestFqdnsFromDll(xunitDllPath, testFileFolder);
    });

    it('should return correct test FQDNs', async () =>
    {
        await dotnetWrapper.getTestFqdnsFromDll(xunitDllPath, testFileFolder)
            .then((tests) =>
            {
                expect(tests.length).to.equal(2);
                expect(tests).to.include("XunitTests.ExampleXunitTests.PassingXunitTest", `actual: ${tests}`);
                expect(tests).to.include("XunitTests.ExampleXunitTests.FailingXunitTest", `actual: ${tests}`);
            });
    });
});