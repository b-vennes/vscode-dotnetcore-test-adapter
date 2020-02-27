import { TestSuiteInfo, TestInfo} from 'vscode-test-adapter-api';
import { Test } from './test';

export class TestSuiteBuilder {
    private testSuite: TestSuiteInfo;

    constructor() {
        this.testSuite = <TestSuiteInfo>{
            type: 'suite',
			id: 'root',
			label: '.NET Tests',
			children: []
        };
    }

    public GetTestSuite(): TestSuiteInfo {
        return this.testSuite;
    }

    public Clear(): void {
        this.testSuite = <TestSuiteInfo>{
            type: 'suite',
			id: 'root',
			label: '.NET Tests',
			children: []
        };
    }

    public AddTest(test: Test): void {
        let visitorLocation: TestSuiteInfo = this.testSuite;
        const locationsToVisit = test.fqdnPath;

        while (locationsToVisit.length > 1) {
            let nextLocationName = locationsToVisit.shift();
            
            let nextLocation = visitorLocation.children.find(x => x.id === nextLocationName && x.type === 'suite');
            if (nextLocation) {
                visitorLocation = <TestSuiteInfo>nextLocation;
            }
            else {
                nextLocation = <TestSuiteInfo>{
                    type: 'suite',
                    'id': nextLocationName,
                    'label': nextLocationName,
                    'children': []
                }
                visitorLocation.children.push(nextLocation);
                visitorLocation = nextLocation;
            }
        }

        const testName = locationsToVisit.shift();
        visitorLocation.children.push(<TestInfo>{
            'type': 'test',
            'id': testName,
            'label': testName
        })
    } 
}