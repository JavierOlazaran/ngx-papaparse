import { TestBed } from '@angular/core/testing';
import { Papa } from './papa';

describe('Papa', () => {
    let papa: Papa;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Papa]
        });
        papa = TestBed.inject(Papa);
    });

    it('should be created', () => {
        expect(papa).toBeTruthy();
    });

    it('should parse basic CSV from string', () => {
        const csv = '"a","b,","c"""\nd,e,f\ng,h,i';
        const result = papa.parse(csv);

        expect(result.data).toEqual(jasmine.objectContaining([
            ['a', 'b,', 'c"'],
            ['d', 'e', 'f'],
            ['g', 'h', 'i']
        ]));
        expect(result.errors).toEqual([]);
        expect(result.meta).toEqual(jasmine.objectContaining({
            delimiter: ',',
            linebreak: '\n'
        }));
    });

    it('should parse basic CSV from string and return each step', () => {
        const csv = '"a","b,","c"""\nd,e,f\ng,h,i';
        const expected = [
            ['a', 'b,', 'c"'],
            ['d', 'e', 'f'],
            ['g', 'h', 'i']
        ];

        let line = 0;
        papa.parse(csv, {
            step: result => {
                expect(result.data).toEqual(jasmine.objectContaining(expected[line]));
                line++;
            }
        });
    });

    it('should parse CSV from local file', () => {
        const csv = '"a","b,","c"""\nd,e,f\ng,h,i';
        const universalBOM = '﻿';
        const blob = new Blob([universalBOM, csv], { type: 'text/plain' });

        papa.parse(blob, {
            complete: result => {
                expect(result.data).toEqual(jasmine.objectContaining([
                    ['a', 'b,', 'c"'],
                    ['d', 'e', 'f'],
                    ['g', 'h', 'i']
                ]));
                expect(result.errors).toEqual([]);
                expect(result.meta).toEqual(jasmine.objectContaining({
                    delimiter: ',',
                    linebreak: '\n'
                }));
            }
        });
    });

    it('should generate CSV from array', () => {
        const data = [
            ['a', 'b,', 'c"'],
            ['d', 'e', 'f'],
            ['g', 'h', 'i']
        ];
        const result = papa.unparse(data, { delimiter: ',' });
        expect(result).toBe('a,"b,","c"""\r\nd,e,f\r\ng,h,i');
    });

    it("should prefix dangerous fields with a '", () => {
        const data = [['=a', '+b', '-c', '@d', '\te', '\rf']];
        const result = papa.unparse(data, { escapeFormulae: true });
        expect(result).toBe(`"'=a","'+b","'-c","'@d","'\te","'\rf"`);
    });

    it("should prefix dangerous fields with a ' by regexp", () => {
        const data = [['=a', '+b', '-c', '@d', '1e', '2f', '3g', '4h']];
        const result = papa.unparse(data, { escapeFormulae: /^[1-4].*$/ });
        expect(result).toBe(`=a,+b,-c,@d,"'1e","'2f","'3g","'4h"`);
    });

    it('should generate CSV from array Object', () => {
        const data = [
            { A: 'a', B: 'b,', C: 'c"' },
            { A: 'd', B: 'e', C: 'f' },
            { A: 'g', B: 'h', C: 'i' },
        ];
        const result = papa.unparse(data, { delimiter: ',' });
        expect(result).toBe('A,B,C\r\na,"b,","c"""\r\nd,e,f\r\ng,h,i');
    });

    it('should generate CSV from Map Object', () => {
        const data = {
            fields: ['A', 'B', 'C'],
            data: [
                ['a', 'b,', 'c"'],
                ['d', 'e', 'f'],
                ['g', 'h', 'i']
            ]
        };
        const result = papa.unparse(data, { delimiter: ',' });
        expect(result).toBe('A,B,C\r\na,"b,","c"""\r\nd,e,f\r\ng,h,i');
    });

    it('should set localChunkSize', () => {
        // TODO
    });

    it('should set remoteChunkSize', () => {
        // TODO
    });

    it('should set defaultDelimiter', () => {
        // TODO
    });

    it('should return bad delimiters', () => {
        expect(Array.isArray(papa.badDelimiters)).toBeTrue();
        expect(papa.badDelimiters.length).toBeGreaterThan(0);
    });

    it('should return record separator', () => {
        expect(typeof papa.recordSeparator).toBe('string');
    });

    it('should return unit separator', () => {
        expect(typeof papa.unitSeparator).toBe('string');
    });

    it('should return whether workers are supported', () => {
        expect(papa.workersSupported).toBeTrue();
    });
});
