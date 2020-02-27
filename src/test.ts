export class Test {
    public fqdnPath: Array<string>;

    constructor(fullyQualifiedDomainName: string) {
        this.fqdnPath = fullyQualifiedDomainName.split('.');
    }
}