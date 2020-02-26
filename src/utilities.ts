import { TestSuiteInfo, TestInfo } from 'vscode-test-adapter-api';

export function addTestListToSuite(testList: string[], rootSuite: TestSuiteInfo): void
{
    let currentLeaf = rootSuite;

    let id: string = "";
    for (let i = 0; i < testList.length; i++)
    {
        const nextLabel: string = testList[i];
        id += '.' + nextLabel;

        // last item in list will be the test name
        if (i === testList.length - 1)
        {
            let testLeaf: TestInfo = 
            {
                type: 'test',
                id: id,
                label: nextLabel
            };
            currentLeaf.children.push(testLeaf);
        }
        // label refers to a test suite
        else
        {
            let childObj: TestSuiteInfo | TestInfo | undefined = currentLeaf.children.find((value) => 
                value.label === nextLabel 
            );

            if (childObj !== undefined)
            {
                let childSuite = childObj as TestSuiteInfo;
                // need to create a new suite child node
                if (childSuite.type === "suite")
                {
                    currentLeaf = childSuite;
                }
                // if the childObj is a test, then something went very wrong
                else
                {
                    throw "Expected the child object to be a testsuite and not a test";
                }
            }
            // this child node test suite hasn't been created yet, so we need to create it
            else
            {
                let newChildNode: TestSuiteInfo = 
                {
                    type: "suite",
                    id: "",
                    label: nextLabel,
                    children: []
                };
                currentLeaf.children.push(newChildNode);
                currentLeaf = newChildNode;
            }
        }
    }
}