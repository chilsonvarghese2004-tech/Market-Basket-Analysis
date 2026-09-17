import Papa from 'papaparse';
import { Dataset, DatasetColumn, ColumnMapping } from '../types';
import { INITIAL_DATASET } from '../data/mockData';

export class DatasetService {
  /**
   * Auto-detect best column mappings from list of headers
   */
  public static detectColumnMapping(headers: string[]): ColumnMapping {
    const normalize = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');

    const findMatch = (candidates: string[]): string => {
      for (const cand of candidates) {
        const found = headers.find((h) => normalize(h) === normalize(cand));
        if (found) return found;
      }
      for (const cand of candidates) {
        const found = headers.find((h) => normalize(h).includes(normalize(cand)));
        if (found) return found;
      }
      return '';
    };

    return {
      transactionId: findMatch(['BillNo', 'InvoiceNo', 'TransactionID', 'Invoice', 'OrderId', 'BasketId']) || headers[0] || '',
      productName: findMatch(['Itemname', 'Description', 'Product', 'Item', 'ProductName', 'Title']) || headers[1] || '',
      quantity: findMatch(['Quantity', 'Qty', 'Count', 'Units']),
      date: findMatch(['Date', 'InvoiceDate', 'Timestamp', 'DateTime', 'Time']),
      customerId: findMatch(['CustomerID', 'CustomerId', 'UserId', 'MemberId']),
      price: findMatch(['Price', 'UnitPrice', 'Cost', 'Amount']),
      country: findMatch(['Country', 'Region', 'Market']),
    };
  }

  /**
   * Parse an uploaded File (CSV or text) on the client side
   */
  public static async parseFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ dataset: Dataset; rawTransactions: string[][]; initialMapping: ColumnMapping }> {
    return new Promise((resolve, reject) => {
      // Sample first 1500 rows for preview and client mining
      const MAX_ROWS_TO_PARSE = 25000;
      const rows: Record<string, any>[] = [];
      let headers: string[] = [];

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimitersToGuess: [';', ',', '\t', '|'],
        step: (results, parser) => {
          if (!headers.length && results.meta.fields) {
            headers = results.meta.fields;
          }
          if (results.data) {
            rows.push(results.data as Record<string, any>);
          }
          if (rows.length >= MAX_ROWS_TO_PARSE) {
            parser.abort();
          }
          if (onProgress && file.size > 0) {
            const estimatedProgress = Math.min(95, Math.round((results.meta.cursor / file.size) * 100));
            onProgress(estimatedProgress);
          }
        },
        complete: () => {
          if (onProgress) onProgress(100);

          if (!rows.length || !headers.length) {
            reject(new Error('The uploaded file appears to be empty or improperly formatted.'));
            return;
          }

          const mapping = DatasetService.detectColumnMapping(headers);

          // Build columns metadata
          let missingCount = 0;
          const columns: DatasetColumn[] = headers.map((colName) => {
            const samples: any[] = [];
            let nulls = 0;
            const uniques = new Set();

            for (let i = 0; i < Math.min(rows.length, 1000); i++) {
              const val = rows[i][colName];
              if (val === null || val === undefined || val === '' || val === 'NAN') {
                nulls++;
                missingCount++;
              } else {
                uniques.add(val);
                if (samples.length < 5 && !samples.includes(val)) {
                  samples.push(val);
                }
              }
            }

            const firstSample = samples[0];
            let type: 'string' | 'number' | 'date' | 'boolean' = 'string';
            if (typeof firstSample === 'number') type = 'number';
            else if (typeof firstSample === 'boolean') type = 'boolean';
            else if (firstSample && !isNaN(Date.parse(String(firstSample)))) type = 'date';

            return {
              name: colName,
              type,
              sampleValues: samples,
              nullCount: nulls,
              uniqueCount: uniques.size,
            };
          });

          // Build raw baskets based on transactionId and productName
          const basketMap = new Map<string, string[]>();
          const uniqueItems = new Set<string>();

          rows.forEach((row) => {
            const txId = String(row[mapping.transactionId] || '').trim();
            const product = String(row[mapping.productName] || '').trim();

            if (txId && product && product.toUpperCase() !== 'NAN' && product.toUpperCase() !== 'UNKNOWN') {
              uniqueItems.add(product);
              const current = basketMap.get(txId) || [];
              if (!current.includes(product)) {
                current.push(product);
              }
              basketMap.set(txId, current);
            }
          });

          const rawTransactions = Array.from(basketMap.values()).filter((b) => b.length > 1);

          const dataset: Dataset = {
            id: `dataset-${Date.now()}`,
            name: file.name,
            sizeBytes: file.size,
            rowCount: rows.length,
            columnCount: headers.length,
            columns,
            sampleRows: rows.slice(0, 100),
            uniqueProductsCount: uniqueItems.size,
            missingValuesCount: missingCount,
            duplicateRowsCount: Math.max(0, rows.length - basketMap.size * 3),
            uploadDate: new Date().toISOString(),
            status: 'ready',
            rawTransactions,
          };

          resolve({ dataset, rawTransactions, initialMapping: mapping });
        },
        error: (err) => {
          reject(new Error(`Failed to parse file: ${err.message}`));
        },
      });
    });
  }

  /**
   * Return the initial retail demo dataset
   */
  public static getInitialDataset(): Dataset {
    return INITIAL_DATASET;
  }
}

