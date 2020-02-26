import * as vscode from 'vscode';
import { TestHub, testExplorerExtensionId } from 'vscode-test-adapter-api';
import { Log, TestAdapterRegistrar } from 'vscode-test-adapter-util';
import { DotnetTestAdapter } from './dotnet-test-adapter';
import { mkdirSync, existsSync } from 'fs';
import { TestsManager } from './tests-manager';
import { TestsRetriever } from './dotnet-adapter';

export async function activate(context: vscode.ExtensionContext) {

	const workspaceFolder = (vscode.workspace.workspaceFolders || [])[0];

	if (context.storagePath !== undefined && !existsSync(context.storagePath))
	{
		mkdirSync(context.storagePath);
	}

	// create a simple logger that can be configured with the configuration variables
	// `dotnetTestExplorer.logpanel` and `exampleExplorer.logfile`
	const log = new Log('dotnetTestExplorer', workspaceFolder, '.NET Test Explorer Log');
	context.subscriptions.push(log);

	// get the Test Explorer extension
	const testExplorerExtension = vscode.extensions.getExtension<TestHub>(testExplorerExtensionId);
	if (log.enabled) log.info(`Test Explorer ${testExplorerExtension ? '' : 'not '}found`);

	if (!context.storagePath)
	{
		log.error('Extension storage not accessible.')
		return;
	}
	
	const extensionStoragePath: string = context.storagePath;

	if (testExplorerExtension) {

		const testHub = testExplorerExtension.exports;

		const testsRetriever = new TestsRetriever(extensionStoragePath, log);
		const testsManager = new TestsManager(log, testsRetriever);

		// this will register an DotnetcoreAdapter for each WorkspaceFolder
		context.subscriptions.push(new TestAdapterRegistrar(
			testHub,
			workspaceFolder => new DotnetTestAdapter(workspaceFolder, log, testsManager),
			log
		));
	}
}
