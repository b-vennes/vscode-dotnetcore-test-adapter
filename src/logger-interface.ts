export interface ILogger {
    LogInformation(information: any): void;

    LogError(error: any): void;
}