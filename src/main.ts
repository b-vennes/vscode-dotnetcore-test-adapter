import * as vscode from 'vscode';
import { TestHub, testExplorerExtensionId } from 'vscode-test-adapter-api';
import { Log, TestAdapterRegistrar } from 'vscode-test-adapter-util';
import { DotnetTestAdapter } from './dotnet-test-adapter';
import { mkdirSync, existsSync } from 'fs';
import { TestManager } from './test-manager';
import { TestRetriever } from './test-retriever';

export async function activate(context: vscode.ExtensionContext) {

	const storagePath = context.globalStoragePath;

	const workspaceFolder = (vscode.workspace.workspaceFolders || [])[0];

	if (storagePath && !existsSync(storagePath))
	{
		mkdirSync(storagePath);
	}

	// create a simple logger that can be configured with the configuration variables
	// `dotnetTestExplorer.logpanel` and `dotnetTestExplorer.logfile`
	const log = new Log('dotnetTestExplorer', workspaceFolder, '.NET Test Explorer Log');
	context.subscriptions.push(log);

	// get the Test Explorer extension
	const testExplorerExtension = vscode.extensions.getExtension<TestHub>(testExplorerExtensionId);
	if (log.enabled) log.info(`Test Explorer ${testExplorerExtension ? '' : 'not '}found`);

	if (!storagePath)
	{
		log.error('Extension storage undefined.')
		return;
	}

	if (!testExplorerExtension) {
		return;
	}

	const testHub = testExplorerExtension.exports;

	// instantiate dependencies
	const testsRetriever = new TestRetriever(log);
	const testsManager = new TestManager(log, testsRetriever);

	// this will register an DotnetcoreAdapter for each WorkspaceFolder
	context.subscriptions.push(new TestAdapterRegistrar(
		testHub,
		workspaceFolder => new DotnetTestAdapter(workspaceFolder, log, testsManager),
		log
	));
}
