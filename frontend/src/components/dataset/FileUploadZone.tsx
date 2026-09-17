import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';

export const FileUploadZone: React.FC = () => {
  const { handleFileUpload, isUploading, uploadProgress, dataset, resetToSampleData } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-cyan-500/50 bg-dark-900/60 hover:bg-dark-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.tsv,.txt"
          onChange={onFileChange}
          className="hidden"
        />

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragOver
              ? 'bg-cyan-500 text-white scale-110 shadow-glow-cyan'
              : 'bg-dark-800 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/10 border border-slate-700/80 group-hover:border-cyan-500/30'
          }`}
        >
          {isUploading ? (
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <h4 className="mt-5 text-base sm:text-lg font-bold text-white tracking-tight">
          Drop your transaction dataset here
        </h4>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
          or <span className="text-cyan-400 font-semibold underline underline-offset-4">browse files</span> from your computer.
          Supported formats: CSV, XLSX, XLS, TSV
        </p>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-6 w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">Parsing and indexing records...</span>
              <span className="font-mono">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Active File Info */}
        {dataset && !isUploading && (
          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">{dataset.name}</span>
            <span className="text-slate-500 font-mono">({formatBytes(dataset.sizeBytes)})</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold pl-2 border-l border-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Loaded</span>
            </span>
          </div>
        )}
      </div>

      {/* Quick Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2">
        <div className="flex items-center gap-2">
          <span>Need a test dataset?</span>
          <button
            onClick={resetToSampleData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Assignment-1 (522k rows)</span>
          </button>
        </div>

        <span className="text-slate-500">Auto-detects semicolon, comma, and tab delimiters</span>
      </div>
    </div>
  );
};

