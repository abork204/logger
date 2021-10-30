import * as fs from 'fs';
import { PathLike } from 'fs';
import * as path from 'path';

export enum MsgType {

    "info" = "info",
    "warn" = "warn",
    "error" = "error"

}

export class Params {

    text: string
    type?: MsgType = MsgType.info
    level?: number = 0

}

export interface ILogger {

    writeConsole(params: Params): void
    writeFile(params: Params): void
    callApi(params: Params): void

}

export class Logger implements ILogger {

    constructor(private path?: string, private fileName?: string) {

        if (path && !this.checkPath())
            throw new Error("Path does not exist.");

    }

    writeConsole(params: Params): void {

        switch (params.type) {
            case MsgType.info:
                console.log(`${this.getTabsForLevel(params.level ? params.level : 0)}${this.getTimestamp()} | ${params.type} | ${params.text}`);
                break;

            case MsgType.warn:
                console.warn(`${this.getTabsForLevel(params.level ? params.level : 0)}${this.getTimestamp()} | ${params.type} | ${params.text}`);
                break;

            case MsgType.error:
                console.error(`${this.getTabsForLevel(params.level ? params.level : 0)}${this.getTimestamp()} | ${params.type} | ${params.text}`);
                break;

        }

    }

    writeFile(params: Params): void {

        if (!this.path)
            throw new Error("No path supplied.");

        let msgText = params.text;
        msgText += '\r\n';
        msgText = this.getTabsForLevel(params.level ? params.level : 0) + this.getTimestamp() + " | " + msgText;
        let pathString = path.join(this.path ? this.path : __dirname, this.fileName ? this.fileName : 'log');
        fs.appendFileSync(pathString, msgText);

    }

    callApi(params: Params): void {
        //not implemented yet
    }

    private getTabsForLevel(level: number): string {

        let retString: string = '';

        for (let i = 0; i < level; i++) {
            retString += '\t';
        }

        return retString;

    }

    private checkPath(): boolean {

        return fs.existsSync(<PathLike>this.path);

    }

    private getTimestamp(): string {

        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);
        let timestamp = year + "." + month + "." + day;
        timestamp = timestamp + " " + hours + ":" + minutes + ":" + seconds;

        return timestamp;

    }


}