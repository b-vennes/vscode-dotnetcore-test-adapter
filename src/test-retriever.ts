import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process'
import { Test } from './test';
import { Log } from 'vscode-test-adapter-util';

export class TestRetriever {

    constructor(private log: Log) {}

    public GetTestsFromProject(projectPath: string): Array<Test> {
        const listCommand = `dotnet test ${projectPath} -t`;

        let rawTestOutput = '';
        try {
            const stringEncodingOptions: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' }
            rawTestOutput = execSync(listCommand, stringEncodingOptions);
        } catch (error) {
            if (this.log.enabled) this.log.error(`Failed to retrieve test list: ${error}`);
            return new Array<Test>();
        }

        const searchString = 'The following Tests are available:';

        const startIndex = rawTestOutput.indexOf(searchString) + searchString.length;

        const testsListUnparsed = rawTestOutput.substring(startIndex);

        if (this.log.enabled) this.log.info(testsListUnparsed);

        const tests = testsListUnparsed
            .split('\r\n')
            .map(t => t.trim())
            .filter(t => t !== '')
            .map(fqdn => new Test(fqdn));

        return tests;
    }
}
