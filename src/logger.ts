import { Log } from 'vscode-test-adapter-util';
import { ILogger } from './logger-interface';

export class Logger implements ILogger {
    constructor(private log: Log) {}

    LogInformation(information: any): void {
        if (this.log.enabled) {
            this.log.info(information);
        }
    }

    LogError(error: any): void {
        if (this.log.enabled) {
            this.log.error(error);
        }
    }
}