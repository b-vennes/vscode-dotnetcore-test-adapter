import * as childProcess from 'child_process'
import * as path from 'path';
import * as fs from 'fs';
import { Test } from './test';
import { Log } from 'vscode-test-adapter-util';

export class TestsRetriever {

    constructor(private storagePath: string, private log: Log) {}

    public GetTests(dllPath: string): Array<Test> {
        const filename: string = path.parse(dllPath).name;

        const outPath = path.join(this.storagePath, `${filename}.txt`);

        const listCommand = `dotnet vstest ${dllPath} /ListFullyQualifiedTests /ListTestsTargetPath:${outPath}`;

        try {
            childProcess.execSync(listCommand);
        } catch (error) {
            // this.log.info(`Failed to retrieve test list: ${error}`);
            console.log(`Failed to retrieve test list: ${error}`);
            return new Array<Test>();
        }

        const testFileOutput = fs.readFileSync(outPath, { encoding: "UTF-8" });
        const tests = testFileOutput
            .split('\n\r')
            .filter(t => t !== '')
            .map(fqdn => new Test(fqdn));

        return tests;
    }
}


// export async function getTestFqnsFromDll(dllPath: string, storagePath: string): Promise<string[] | undefined>
// {
//     return new Promise<string[] | undefined>((resolve) =>
//     {
//         executeListCommand(dllPath, storagePath)
//             .then((outPath) =>
//             {
//                 fs.readFile(outPath, { encoding: "UTF-8" }, (err, data: string | Buffer) =>
//                 {
//                     if (err)
//                     {
//                         resolve(undefined);
//                     }

//                     const testFqdns = data
//                         .toString()
//                         .split('\n')
//                         .map((test) => test.replace('\r', ""))
//                         .filter((test) => test !== '')
//                     resolve(testFqdns);
//                 });
//             })
//             .catch(() =>
//             {
//                 resolve(undefined);
//             });
//     });
// }

export function runDotnetTest(testName: string, directoryPath: string): Promise<string>
{
    return executeDotnetTest(testName, directoryPath);
}

export function debugDotnetTest(testName: string, directoryPath: string)
{
    
}

// function executeListCommand(dllPath: string, storagePath: string): Promise<string>
// {
//     return new Promise<string>((resolve, reject) => 
//     {
//         const filename: string = path.parse(dllPath).name;

//         const outPath = path.join(storagePath, `${filename}.txt`);

//         const command = `dotnet vstest ${dllPath} /ListFullyQualifiedTests /ListTestsTargetPath:${outPath}`;

//         childProcess.exec(command, (error: childProcess.ExecException | null, stdout: string, stderr: string) =>
//         {
//             if (error)
//             {
//                 reject(error);
//             }
//             else
//             {
//                 resolve(outPath);
//             }
//         });
//     });
// }

function executeDotnetTest(testName:string, directoryPath: string): Promise<string>
{
    const command = `dotnet test ${directoryPath} --filter Name=${testName}`;

    return new Promise<string>((resolve, reject) =>
    {
        childProcess.exec(command, (error: childProcess.ExecException | null, stdout: string, stderr: string) =>
        {
            if (error)
            {
                reject(stderr);
            }
            else
            {
                resolve(stdout);
            }
        });
    });
}