import * as childProcess from 'child_process'
import { TestSuiteInfo, TestInfo } from 'vscode-test-adapter-api';

export function loadTestsFromDirectory(directoryPath: string): Promise<TestSuiteInfo>
{
    return new Promise<TestSuiteInfo>((resolve, reject) =>
    {
        var tests: TestSuiteInfo = { "type": "suite", "id": "test suite", "label": "basic test suite", "children": [] };
        executeDotnetList(directoryPath)
            .then((stdout) =>
            {
                const nameList: string[] = readTestNames(stdout);
                
                nameList.forEach(name => {
                    const test: TestInfo = {"type": "test", "id": name, "label": name}
                    tests.children.push(test);
                });

                console.log(tests);

                resolve(tests);
            })
            .catch((error) =>
            {
                reject(error);
            });
    });
}

export function runTest(testName: string, directoryPath: string)
{
    return new Promise<TestSuiteInfo>((resolve, reject) =>
    {
        var tests: TestSuiteInfo = { "type": "suite", "id": "test suite", "label": "basic test suite", "children": [] };
        executeDotnetList(directoryPath)
            .then((stdout) =>
            {
                const nameList: string[] = readTestNames(stdout);
                
                nameList.forEach(name => {
                    const test: TestInfo = {"type": "test", "id": name, "label": name}
                    tests.children.push(test);
                });

                resolve(tests);
            })
            .catch((error) =>
            {
                reject(error);
            });
    });
}

export function debugTest(testName: string, directoryPath: string)
{

}

function executeDotnetList(directoryPath: string): Promise<string>
{
    const command = `dotnet test --list-tests ${directoryPath}`;

    return new Promise<string>((resolve, reject) =>
    {
        childProcess.exec(command, (error: childProcess.ExecException | null, stdout: string, stderr: string) =>
        {
            if (error)
            {
                reject(error);
            }
            else
            {
                resolve(stdout);
            }
        });
    });
}

function readTestNames(execOutput: string): string[]
{
    return execOutput
        .substring(execOutput.indexOf("    "))
        .split('\r\n')
        .map(e => e.trim())
        .filter((name) => name != "");
}