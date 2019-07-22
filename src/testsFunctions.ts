import * as vscode from 'vscode';
import { TestSuiteInfo, TestInfo, TestRunStartedEvent, TestRunFinishedEvent, TestSuiteEvent, TestEvent } from 'vscode-test-adapter-api';
import * as dotnetWrapper from './dotnetWrapper'
import * as glob from 'glob';

const rootTestSuite: TestSuiteInfo = {
	type: 'suite',
	id: 'root',
	label: '.Net Core', // the label of the root node should be the name of the testing framework
	children: []
};

export function loadTests(directory: string, storagePath: string): Promise<TestSuiteInfo>
{
	return new Promise((resolve, reject) => 
	{
		const configValue: string | undefined = vscode.workspace.getConfiguration().get('dotnetcoreExplorer.files');
		var globPattern: string = "**/bin/**/*.dll"
		if (configValue !== undefined && configValue !== "")
		{
			globPattern = configValue;
		}

		glob(`${directory}/${globPattern}`, (err, matches) =>
		{
			matches.forEach((dllMatch) => 
			{
				dotnetWrapper.getTestsFromDll(dllMatch, storagePath)
					.then((testFqdns) =>
					{
						resolve(rootTestSuite);
					})
					.catch((error) =>
					{
						reject(error);
					});
			});
		});
	});
}

export async function runTests
(
	tests: string[],
	testStatesEmitter: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
	directoryPath: string
): Promise<void>
{
	for (const suiteOrTestId of tests)
	{
		const node = findNode(rootTestSuite, suiteOrTestId);
		if (node)
		{
			await runNode(node, testStatesEmitter, directoryPath);
		}
	}
}

function findNode(searchNode: TestSuiteInfo | TestInfo, id: string): TestSuiteInfo | TestInfo | undefined
{
	if (searchNode.id === id)
	{
		return searchNode;
	}
	else if (searchNode.type === 'suite')
	{
		for (const child of searchNode.children)
		{
			const found = findNode(child, id);
			if (found) return found;
		}
	}
	return undefined;
}

async function runNode
(
	node: TestSuiteInfo | TestInfo,
	testStatesEmitter: vscode.EventEmitter<TestRunStartedEvent | TestRunFinishedEvent | TestSuiteEvent | TestEvent>,
	directoryPath: string
): Promise<void>
{

	if (node.type === 'suite')
	{

		testStatesEmitter.fire(<TestSuiteEvent>{ type: 'suite', suite: node.id, state: 'running' });

		for (const child of node.children) {
			await runNode(child, testStatesEmitter, directoryPath);
		}

		testStatesEmitter.fire(<TestSuiteEvent>{ type: 'suite', suite: node.id, state: 'completed' });

	}
	// node.type === 'test'
	else
	{

		testStatesEmitter.fire(<TestEvent>{ type: 'test', test: node.id, state: 'running' });

		dotnetWrapper.runDotnetTest(node.label, directoryPath)
			.then((response) =>
			{
				testStatesEmitter.fire(<TestEvent>{ type: 'test', test: node.id, state: 'passed' });
			})
			.catch((error) =>
			{
				testStatesEmitter.fire(<TestEvent>{ type: 'test', test: node.id, state: 'failed' });
			});
	}
}
