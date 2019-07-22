import * as childProcess from 'child_process'
import * as path from 'path';
import * as fs from 'fs';

export function getTestsFromDll(dllPath: string, storagePath: string): Promise<string[]>
{
    return new Promise<string[]>((resolve, reject) =>
    {
        executeListCommand(dllPath, storagePath)
            .then((outPath) =>
            {
                fs.readFile(outPath, { encoding: "UTF-8" }, (err, data: string | Buffer) =>
                {
                    if (err)
                    {
                        return;
                    }

                    const testFqdns = data
                        .toString()
                        .split('\r\n')
                        .filter((test) => test !== "");
                    resolve(testFqdns);
                });
            })
            .catch((errorMessage) =>
            {
                reject(errorMessage);
            });
    });
}

export function runDotnetTest(testName: string, directoryPath: string): Promise<string>
{
    return executeDotnetTest(testName, directoryPath);
}

export function debugDotnetTest(testName: string, directoryPath: string)
{
    
}

function executeListCommand(dllPath: string, storagePath: string): Promise<string>
{
    return new Promise<string>((resolve, reject) => 
    {
        const filename: string = path.parse(dllPath).name;

        const outPath = path.join(storagePath, `${filename}.txt`);

        const command = `dotnet vstest ${dllPath} /ListFullyQualifiedTests /ListTestsTargetPath:${outPath}`;

        childProcess.exec(command, (error: childProcess.ExecException | null, stdout: string, stderr: string) =>
        {
            if (error)
            {
                reject(stderr);
            }
            else
            {
                resolve(outPath);
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
                reject(stderr);
            }
            else
            {
                resolve(stdout);
            }
        });
    });
}