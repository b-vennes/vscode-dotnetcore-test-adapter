import * as childProcess from 'child_process'
import { TestSuiteInfo, TestInfo } from 'vscode-test-adapter-api';

export function loadDotnetTests(directoryPath: string): Promise<TestSuiteInfo>
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

export function runDotnetTest(testName: string, directoryPath: string): Promise<string>
{
    return executeDotnetTest(testName, directoryPath);
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

function executeDotnetTest(testName:string, directoryPath: string): Promise<string>
{
    const command = `dotnet test ${directoryPath} --filter Name=${testName}`;

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
                resolve("Passed");
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