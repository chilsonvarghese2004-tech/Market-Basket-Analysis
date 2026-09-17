import React from 'react';
import { useApp } from '../../context/AppContext';
import { ColumnMapping } from '../../types';
import { SlidersHorizontal, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export const ColumnMapper: React.FC = () => {
  const { dataset, columnMapping, setColumnMapping } = useApp();

  if (!dataset) return null;

  const columnNames = dataset.columns.map((c) => c.name);

  const handleSelect = (field: keyof ColumnMapping, value: string) => {
    setColumnMapping({
      ...columnMapping,
      [field]: value,
    });
  };

  const fields: {
    key: keyof ColumnMapping;
    label: string;
    required: boolean;
    hint: string;
  }[] = [
    {
      key: 'transactionId',
      label: 'Transaction ID / Bill Number',
      required: true,
      hint: 'Identifies which products belong to the same basket (e.g. BillNo, InvoiceNo)',
    },
    {
      key: 'productName',
      label: 'Product Name / Description',
      required: true,
      hint: 'The categorical item name or SKU for mining (e.g. Itemname, Description)',
    },
    {
      key: 'quantity',
      label: 'Quantity Purchased',
      required: false,
      hint: 'Numeric units per line item (e.g. Quantity)',
    },
    {
      key: 'date',
      label: 'Transaction Date / Timestamp',
      required: false,
      hint: 'Date of order placement (e.g. Date, InvoiceDate)',
    },
    {
      key: 'customerId',
      label: 'Customer ID (Optional)',
      required: false,
      hint: 'Useful for customer segmentation and repeat basket analysis',
    },
    {
      key: 'price',
      label: 'Unit Price / Amount',
      required: false,
      hint: 'Unit cost per item for calculating revenue uplift and margin impact',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-dark-900/90 border border-slate-800 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Dataset Column Schema Mapping
            </h3>
            <p className="text-xs text-slate-400">
              Confirm or adjust auto-detected column roles for basket aggregation and rule mining
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Mapped</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {fields.map((field) => {
          const currentValue = columnMapping[field.key] || '';
          const matchedCol = dataset.columns.find((c) => c.name === currentValue);

          return (
            <div
              key={field.key}
              className="p-4 rounded-xl bg-dark-800/80 border border-slate-700/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <span>{field.label}</span>
                  {field.required && <span className="text-rose-400 font-bold">*</span>}
                </label>
                {currentValue && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              <select
                value={currentValue}
                onChange={(e) => handleSelect(field.key, e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">-- Not Assigned --</option>
                {columnNames.map((colName) => (
                  <option key={colName} value={colName}>
                    {colName}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="truncate max-w-[200px]" title={field.hint}>
                  {field.hint}
                </span>
                {matchedCol && (
                  <span className="font-mono text-cyan-400 shrink-0 capitalize">
                    {matchedCol.type}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

