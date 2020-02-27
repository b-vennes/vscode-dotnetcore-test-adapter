import * as vscode from 'vscode';
import { TestAdapter, TestLoadStartedEvent, TestLoadFinishedEvent, TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from 'vscode-test-adapter-api';
import { TestManager } from './test-manager';
import { ILogger } from './logger-interface';

export class DotnetTestAdapter implements TestAdapter
{

	private disposables: { dispose(): void }[] = [];

	private readonly testsEmitter = new vscode.EventEmitter<TestLoadStartedEvent | TestLoadFinishedEvent>();
	private readonly testStatesEmitter = new vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>();
	private readonly autorunEmitter = new vscode.EventEmitter<void>();

	get tests(): vscode.Event<TestLoadStartedEvent | TestLoadFinishedEvent> { return this.testsEmitter.event; }
	get testStates(): vscode.Event<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent> { return this.testStatesEmitter.event; }
	get autorun(): vscode.Event<void> | undefined { return this.autorunEmitter.event; }

	constructor
	(
		public readonly workspace: vscode.WorkspaceFolder,
		private readonly logger: ILogger,
		private testManager: TestManager
	) {
		this.logger.LogInformation('Initializing example adapter');

		this.disposables.push(this.testsEmitter);
		this.disposables.push(this.testStatesEmitter);
		this.disposables.push(this.autorunEmitter);

	}

	async load(): Promise<void>
	{

		this.logger.LogInformation('Loading example tests');

		this.testsEmitter.fire(<TestLoadStartedEvent>{ type: 'started' });

		const loadedTests = await this.testManager.LoadTests(this.workspace.uri.fsPath);

		this.testsEmitter.fire(<TestLoadFinishedEvent>{ type: 'finished', suite: loadedTests });

	}

	async run(tests: string[]): Promise<void>
	{

		throw new Error('Method not implemented');

		// this.log.info(`Running example tests ${JSON.stringify(tests)}`);

		// this.testStatesEmitter.fire(<TestRunStartedEvent>{ type: 'started', tests });

		// // in a "real" TestAdapter this would start a test run in a child process
		// await runTests(tests, this.testStatesEmitter, this.workspace.uri.fsPath);

		// this.testStatesEmitter.fire(<TestRunFinishedEvent>{ type: 'finished' });

	}

	async debug(tests: string[]): Promise<void> {
		// start a test run in a child process and attach the debugger to it...
		throw new Error('Method not implemented.');
	}

	cancel(): void
	{
		// in a "real" TestAdapter this would kill the child process for the current test run (if there is any)
		throw new Error('Method not implemented.');
	}

	dispose(): void
	{
		this.cancel();
		for (const disposable of this.disposables)
		{
			disposable.dispose();
		}
		this.disposables = [];
	}
}
