import * as vscode from 'vscode';
import { TestSuiteInfo} from 'vscode-test-adapter-api';
import { TestsRetriever } from './dotnet-adapter';
import { Log } from 'vscode-test-adapter-util';

export class TestsManager
{
	constructor(private log: Log, private retriever: TestsRetriever) {}

	public LoadTests(directory: string): TestSuiteInfo {
		const testFileSearchText = vscode.workspace.getConfiguration().get<string>('dotnetTestExplorer.files');
		const testsPath = testFileSearchText || '**/bin/**/*.dll';

		const foundTests = this.retriever.GetTests(testsPath);

		for (const test of foundTests) {
			this.log.info(test.fullyQualifiedDomainName);
		}

		return {
			type: 'suite',
			id: 'root',
			label: '.NET Tests',
			children: []
		};
	}
}

// export function loadTests(directory: string, storagePath: string): Promise<TestSuiteInfo>
// {
// 	return new Promise((resolve, reject) => 
// 	{
// 		const configValue: string | undefined = vscode.workspace.getConfiguration().get('dotnetTestExplorer.files');
// 		let globPattern: string = "**/bin/**/*.dll"
// 		if (configValue !== undefined && configValue !== "")
// 		{
// 			globPattern = configValue;
// 		}

// 		let rootTestSuite: TestSuiteInfo = {
// 			type: 'suite',
// 			id: 'root',
// 			label: '.NET Tests', // the label of the root node should be the name of the testing framework
// 			children: []
// 		};

// 		getAllFqnsFromGlob(directory, globPattern, storagePath)
// 			.then((dllListTests) =>
// 			{
// 				for(let testList of dllListTests)
// 				{
// 					addTestListToSuite(testList, rootTestSuite);
// 				}
// 				resolve(rootTestSuite);
// 			})
// 			.catch((error) =>
// 			{
// 				reject(error);
// 			});
// 	});
// }

// function getAllFqnsFromGlob(directory: string, globPattern: string, storagePath: string): Promise<string[][]>
// {
// 	return new Promise<string[][]>((resolve, reject) =>
// 	{
// 		let promises_array: Promise<string[]>[] = [];
// 		glob(`${directory}/${globPattern}`, (err, matches) =>
// 		{
// 			if (err)
// 			{
// 				reject(err);
// 			}

// 			for (let dllMatch of matches )
// 			{
// 				promises_array.push(new Promise<string[]>(resolve, reject) =>
// 				{
					
// 				});
// 			}

// 			resolve(Promise.all(promises_array));
// 		});
// 	});
// }

// function GetFqnsFromDll(dll: string, storagePath: string): Promise<string[] | undefined>
// {
// 	return new Promise<string[]>((reject, resolve) => 
// 	{
// 		dotnetWrapper.getTestFqnsFromDll(dll, storagePath)
// 			.then((fqns) =>
// 			{
// 				resolve(fqns);
// 			})
// 			.catch((error) =>
// 			{
// 				reject(error);
// 			});
// 	});
// }

// export async function runTests
// (
// 	tests: string[],
// 	testStatesEmitter: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
// 	directoryPath: string
// ): Promise<void>
// {
// 	for (const suiteOrTestId of tests)
// 	{
// 		let rootTestSuite: TestSuiteInfo = {
// 			type: 'suite',
// 			id: 'root',
// 			label: '.Net Core', // the label of the root node should be the name of the testing framework
// 			children: []
// 		};

// 		const node = findNode(rootTestSuite, suiteOrTestId);
// 		if (node)
// 		{
// 			await runNode(node, testStatesEmitter, directoryPath);
// 		}
// 	}
// }

// function findNode(searchNode: TestSuiteInfo | TestInfo, id: string): TestSuiteInfo | TestInfo | undefined
// {
// 	if (searchNode.id === id)
// 	{
// 		return searchNode;
// 	}
// 	else if (searchNode.type === 'suite')
// 	{
// 		for (const child of searchNode.children)
// 		{
// 			const found = findNode(child, id);
// 			if (found) return found;
// 		}
// 	}
// 	return undefined;
// }

// async function runNode
// (
// 	node: TestSuiteInfo | TestInfo,
// 	testStatesEmitter: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
// 	directoryPath: string
// ): Promise<void>
// {

// 	if (node.type === 'suite')
// 	{

// 		testStatesEmitter.fire(<TestSuiteEvent>{ type: 'suite', suite: node.id, state: 'running' });

// 		for (const child of node.children) {
// 			await runNode(child, testStatesEmitter, directoryPath);
// 		}

// 		testStatesEmitter.fire(<TestSuiteEvent>{ type: 'suite', suite: node.id, state: 'completed' });

// 	}
// 	// node.type === 'test'
// 	else
// 	{

// 		testStatesEmitter.fire(<TestEvent>{ type: 'test', test: node.id, state: 'running' });

// 		dotnetWrapper.runDotnetTest(node.label, directoryPath)
// 			.then((response) =>
// 			{
// 				testStatesEmitter.fire(<TestEvent>{ type: 'test', test: node.id, state: 'passed' });
// 			})
// 			.catch((error) =>
// 			{
// 				testStatesEmitter.fire(<TestEvent>{ type: 'test', test: node.id, state: 'failed' });
// 			});
// 	}
// }
