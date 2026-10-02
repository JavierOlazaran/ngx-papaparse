import { Injectable } from '@angular/core';
import * as papaparse from 'papaparse';
import { ParseResult } from './interfaces/parse-result';
import { ParseConfig } from './interfaces/parse-config';
import { UnparseConfig } from './interfaces/unparse-config';
import { UnparseData } from './interfaces/unparse-data';

@Injectable({
    providedIn: 'root',
})
export class Papa<T = unknown> {
    public _papa = papaparse;

    public parse(csv: string | Blob, config?: ParseConfig): ParseResult<T> {
        return this._papa.parse(
            csv as string,
            config as papaparse.ParseConfig,
        ) as unknown as ParseResult<T>;
    }

    public unparse(data: UnparseData, config?: UnparseConfig): string {
        return this._papa.unparse(
            data as unknown as papaparse.UnparseObject<unknown>,
            config as papaparse.UnparseConfig,
        );
    }

    public setLocalChunkSize(value: number): void {
        this._papa.LocalChunkSize = value;
    }

    public setRemoteChunkSize(value: number): void {
        this._papa.RemoteChunkSize = value;
    }

    public setDefaultDelimiter(value: string): void {
        this._papa.DefaultDelimiter = value;
    }

    get badDelimiters(): readonly string[] {
        return this._papa.BAD_DELIMITERS;
    }

    get recordSeparator(): string {
        return this._papa.RECORD_SEP;
    }

    get unitSeparator(): string {
        return this._papa.UNIT_SEP;
    }

    get workersSupported(): boolean {
        return this._papa.WORKERS_SUPPORTED;
    }
}
