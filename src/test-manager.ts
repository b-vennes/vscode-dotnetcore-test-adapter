import * as vscode from 'vscode';
import { TestSuiteInfo} from 'vscode-test-adapter-api';
import { TestRetriever } from './test-retriever';
import { Log } from 'vscode-test-adapter-util';
import * as glob from 'glob';
import { join } from 'path';

export class TestManager
{
	constructor(private log: Log, private retriever: TestRetriever) {}

	public LoadTests(directory: string): TestSuiteInfo {
		const projectSearchText = vscode.workspace.getConfiguration().get<string>('dotnetTestExplorer.files') || '**/*.csproj';

		const projectsList = glob.sync(join(directory, projectSearchText));

		const foundTests = projectsList.map(p => this.retriever.GetTestsFromProject(p)).flat();

		for (const test of foundTests) {
			if (this.log.enabled) this.log.info(test.fullyQualifiedDomainName);
		}

		return {
			type: 'suite',
			id: 'root',
			label: '.NET Tests',
			children: []
		};
	}
}
