import { loadTests } from '../src/testsFunctions';

const testFileFolder = './test';

describe('Load tests', () =>
{
    const projectsRoot = '../example_projects';

    it('should not throw an error', async () => {
        await loadTests(projectsRoot, testFileFolder);
    });
});