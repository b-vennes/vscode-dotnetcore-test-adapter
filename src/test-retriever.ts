import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process'
import { Test } from './test';
import { ILogger } from './logger-interface';

export class TestRetriever {

    constructor(private readonly logger: ILogger) {}

    public GetTestsFromProject(projectPath: string): Array<Test> {
        const listCommand = `dotnet test ${projectPath} -t`;

        let rawTestOutput = '';
        try {
            const stringEncodingOptions: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' }
            rawTestOutput = execSync(listCommand, stringEncodingOptions);
        } catch (error) {
            this.logger.LogError(`Failed to retrieve test list: ${error}`);
            return new Array<Test>();
        }

        const searchString = 'The following Tests are available:';

        const startIndex = rawTestOutput.indexOf(searchString) + searchString.length;

        const testsListUnparsed = rawTestOutput.substring(startIndex);

        this.logger.LogInformation(testsListUnparsed);

        const tests = testsListUnparsed
            .split('\r\n')
            .map(t => t.trim())
            .filter(t => t !== '')
            .map(fqdn => new Test(fqdn));

        return tests;
    }
}
