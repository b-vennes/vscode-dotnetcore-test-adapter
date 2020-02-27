import * as vscode from 'vscode';
import { TestSuiteInfo} from 'vscode-test-adapter-api';
import { TestRetriever } from './test-retriever';
import * as glob from 'glob';
import { join } from 'path';
import { TestSuiteBuilder } from './test-suite-builder';
import { ILogger } from './logger-interface';

export class TestManager
{
	constructor(private readonly logger: ILogger, private readonly retriever: TestRetriever) {}

	public LoadTests(directory: string): TestSuiteInfo {
		const projectSearchText = vscode.workspace.getConfiguration().get<string>('dotnetTestExplorer.files') || '**/*.csproj';

		const projectsList = glob.sync(join(directory, projectSearchText));

		const foundTests = projectsList.map(p => this.retriever.GetTestsFromProject(p)).flat();

		for (const test of foundTests) {
			this.logger.LogInformation(`Found test: ${test.fqdnPath.join('.')}`);
		}

		const testSuiteBuilder = new TestSuiteBuilder();

		foundTests.forEach(t => testSuiteBuilder.AddTest(t));

		return testSuiteBuilder.GetTestSuite();
	}
}
