import * as childProcess from 'child_process'
import { TestSuiteInfo } from 'vscode-test-adapter-api';
import { resolve } from 'path';
import { rejects } from 'assert';

export function loadTestsFromDirectory(directoryPath: string): TestSuiteInfo
{
    const commandOutput: string = executeDotnetList(directoryPath)
        .then((stdout) =>
        {
            return stdout;
        });
    const testNames: string[] = readTestNames(commandOutput);

    const empty: TestSuiteInfo =
    {
        type: "suite",
        id: "test",
        label: "testname",
        children: []
    };
    return empty;
}

export function runTest(testName: string, directoryPath: string)
{

}

export function debugTest(testName: string, directoryPath: string)
{

}

function executeDotnetList(directoryPath: string): Promise<string>
{
    const command = `dotnet test --list-tests ${directoryPath}`;

    var output = "";

    return new Promise<string>((resolve, reject) =>
    {
        childProcess.exec(command, (error: childProcess.ExecException | null, stdout: string, stderr: string) =>
        {
            resolve(stdout);
        });
    });
}

function readTestNames(execOutput: string): string[]
{
    var testList = execOutput
        .substring(execOutput.indexOf("    "))
        .split('\r\n')

    testList.forEach((name) => name.replace(/\s/g, ""));
    testList = testList.filter((name) => name != "");

    console.log(testList);

    return testList;
}