import React, { useState } from 'react';
import { executeQuery, executeCustomQuery } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Loader2, Play, Download, BarChart3, Copy, Check, Terminal, List } from 'lucide-react';

const QUERIES = [
  { id: 'q1', label: "Employees under Manager Tony Tona (no middle name)", sql: `SELECT employee_no\nFROM employees\nWHERE type = 'Worker' AND department IN (\n    SELECT department FROM employees WHERE name LIKE '%Tony Tona%' AND type = 'Manager'\n)` },
  { id: 'q2', label: "All employees sorted by last, first, middle", sql: `SELECT employee_no, name\nFROM employees\nORDER BY name` },
  { id: 'q3', label: "Phones of all managers", sql: `SELECT employee_no, phone\nFROM employees\nWHERE type = 'Manager'` },
  { id: 'q4', label: "All parts that are assemblies (lexicographic order)", sql: `SELECT part_no\nFROM parts\nWHERE type = 'Assembly'\nORDER BY part_no` },
  { id: 'q5', label: "Current backorders (remaining_qty > 0)", sql: `SELECT manager, part_no, orderDate as backorder_date, status\nFROM backorders\nWHERE status = 'Active'` },
  { id: 'q6', label: "All backorders (current + old)", sql: `SELECT manager, part_no, orderDate as backorder_date,\n       CASE \n           WHEN status = 'Active' THEN '2000-01-01'\n           ELSE fulfilledDate\n       END AS fulfilled_date\nFROM backorders` },
  { id: 'q7', label: "Remaining capacity of each bin", sql: `SELECT bin_id as bin_no, remaining as remaining_capacity\nFROM bins` },
  { id: 'q8', label: "Managers with smallest team size", sql: `SELECT m.name as manager_name, count(w.employee_no) as team_size\nFROM employees m\nLEFT JOIN employees w ON m.department = w.department AND w.type = 'Worker'\nWHERE m.type = 'Manager'\nGROUP BY m.employee_no\nHAVING team_size = (\n    SELECT MIN(team_count)\n    FROM (\n        SELECT COUNT(w2.employee_no) as team_count\n        FROM employees m2\n        LEFT JOIN employees w2 ON m2.department = w2.department AND w2.type = 'Worker'\n        WHERE m2.type = 'Manager'\n        GROUP BY m2.employee_no\n    ) AS temp\n)` },
];

const Queries = () => {
  const [mode, setMode] = useState('preset'); // 'preset' or 'custom'
  const [activeQuery, setActiveQuery] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisTab, setAnalysisTab] = useState('data');
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [customSql, setCustomSql] = useState('SELECT * FROM employees LIMIT 10;');
  const [executedCustomSql, setExecutedCustomSql] = useState('');

  const runQuery = async (queryId) => {
    setActiveQuery(queryId);
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisTab('data');
    try {
      const data = await executeQuery(queryId);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to execute query.');
    } finally {
      setLoading(false);
    }
  };

  const runCustomQuery = async () => {
    if (!customSql.trim()) return;
    setActiveQuery('custom');
    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysisTab('data');
    setExecutedCustomSql(customSql.trim());
    try {
      const data = await executeCustomQuery(customSql.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to execute custom query.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCustomQuery();
    }
  };

  const getCurrentSql = () => {
    if (activeQuery === 'custom') return executedCustomSql;
    const q = QUERIES.find(q => q.id === activeQuery);
    return q?.sql || '';
  };

  const copyQueryToClipboard = () => {
    const sql = getCurrentSql();
    if (sql) {
      navigator.clipboard.writeText(sql);
      setCopiedQuery(true);
      setTimeout(() => setCopiedQuery(false), 2000);
    }
  };

  const exportToCSV = () => {
    if (!result || result.rows.length === 0) return;
    const headers = result.columns.join(',');
    const rows = result.rows.map(row =>
      row.map(cell =>
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-${activeQuery}-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getAnalysisStats = () => {
    if (!result) return null;
    const stats = { totalRows: result.rows.length, totalColumns: result.columns.length, columnStats: {} };
    result.columns.forEach((col, idx) => {
      const columnData = result.rows.map(row => row[idx]);
      stats.columnStats[col] = {
        uniqueValues: new Set(columnData).size,
        nullCount: columnData.filter(v => v === null || v === '').length
      };
    });
    return stats;
  };

  const getResultLabel = () => {
    if (activeQuery === 'custom') return 'Custom Query';
    const q = QUERIES.find(q => q.id === activeQuery);
    return q?.label || '';
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Queries</h2>
          <p className="text-muted-foreground mt-1 text-sm">Execute preset or custom SQL queries against the warehouse database.</p>
        </div>
        {/* Mode Toggle */}
        <div className="flex bg-muted rounded-lg p-1 gap-1">
          <button
            onClick={() => setMode('preset')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              mode === 'preset' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List size={14} /> Preset
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              mode === 'custom' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal size={14} /> Custom SQL
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1">

        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-4">
          {mode === 'preset' ? (
            QUERIES.map(q => (
              <Card
                key={q.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${activeQuery === q.id ? 'border-primary shadow-md ring-1 ring-primary/20' : ''}`}
                onClick={() => runQuery(q.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium text-sm">{q.label}</span>
                  <button className={`p-2 rounded-full transition-colors ${activeQuery === q.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-primary/20'}`}>
                    {loading && activeQuery === q.id ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                  </button>
                </CardContent>
              </Card>
            ))
          ) : (
            /* Custom Query Editor */
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Terminal size={16} className="text-primary" />
                  SQL Editor
                </CardTitle>
                <p className="text-xs text-muted-foreground">Write SELECT queries. Press Ctrl+Enter to run.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <textarea
                  value={customSql}
                  onChange={(e) => setCustomSql(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-48 p-3 rounded-lg border border-border bg-black/40 font-mono text-sm text-primary/90 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 placeholder:text-muted-foreground/40"
                  placeholder="SELECT * FROM employees WHERE type = 'Manager';"
                  spellCheck={false}
                />
                <button
                  onClick={runCustomQuery}
                  disabled={loading || !customSql.trim()}
                  className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && activeQuery === 'custom' ? (
                    <><Loader2 size={16} className="animate-spin" /> Executing...</>
                  ) : (
                    <><Play size={16} /> Run Query</>
                  )}
                </button>
                {/* Quick templates */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Quick Templates</p>
                  {[
                    { label: 'All Employees', sql: 'SELECT * FROM employees;' },
                    { label: 'All Warehouses', sql: 'SELECT * FROM warehouses;' },
                    { label: 'All Parts', sql: 'SELECT * FROM parts;' },
                    { label: 'All Bins', sql: 'SELECT * FROM bins;' },
                    { label: 'All Backorders', sql: 'SELECT * FROM backorders;' },
                    { label: 'Table Info', sql: "SELECT name FROM sqlite_master WHERE type='table';" },
                  ].map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setCustomSql(t.sql)}
                      className="w-full text-left px-3 py-1.5 text-xs rounded-md bg-muted/50 hover:bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Panel */}
        <Card className="lg:col-span-2 flex flex-col min-h-[600px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle>Execution Result</CardTitle>
                {activeQuery && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing results for: "{getResultLabel()}"
                    {result && <span className="text-primary ml-2">({result.rows.length} rows)</span>}
                  </p>
                )}
              </div>
              {result && (
                <div className="flex gap-2">
                  <button onClick={exportToCSV} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" title="Export to CSV">
                    <Download size={16} />
                  </button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center flex-col space-y-3 text-muted-foreground">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="animate-pulse text-sm">Executing query on SQLite database...</p>
                <div className="w-full mt-4 p-3 bg-muted rounded-lg border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Running Query:</p>
                  <div className="bg-black/50 p-3 rounded font-mono text-xs text-primary/80 overflow-x-auto whitespace-pre-wrap break-words">
                    {getCurrentSql()}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg max-w-lg text-center">
                  <p className="text-destructive font-medium text-sm">{error}</p>
                </div>
              </div>
            ) : result ? (
              <>
                {/* SQL Query Display */}
                <div className="p-3 bg-muted rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Executed Query:</p>
                    <button onClick={copyQueryToClipboard} className="p-1 rounded text-xs text-muted-foreground hover:bg-secondary transition-colors flex items-center gap-1">
                      {copiedQuery ? (<><Check size={12} className="text-green-500" /><span>Copied</span></>) : (<><Copy size={12} /><span>Copy</span></>)}
                    </button>
                  </div>
                  <div className="bg-black/50 p-3 rounded font-mono text-xs text-primary/80 overflow-x-auto whitespace-pre-wrap break-words max-h-24">
                    {getCurrentSql()}
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border flex gap-2">
                  <button onClick={() => setAnalysisTab('data')} className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${analysisTab === 'data' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    Data Results
                  </button>
                  <button onClick={() => setAnalysisTab('analysis')} className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${analysisTab === 'analysis' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <BarChart3 size={14} /> Analysis
                  </button>
                </div>

                {/* Data Tab */}
                {analysisTab === 'data' && (
                  <div className="border border-border rounded-lg overflow-hidden flex-1 flex flex-col">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          {result.columns.map((col, i) => <TableHead key={i}>{col}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.rows.length > 0 ? result.rows.map((row, i) => (
                          <TableRow key={i}>
                            {row.map((cell, j) => <TableCell key={j} className="font-medium text-muted-foreground">{cell === null ? <span className="italic text-muted-foreground/40">NULL</span> : String(cell)}</TableCell>)}
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={result.columns.length} className="text-center py-6 text-muted-foreground">
                              Query completed successfully. 0 rows returned.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Analysis Tab */}
                {analysisTab === 'analysis' && (
                  <div className="space-y-4 flex-1 overflow-y-auto">
                    {getAnalysisStats() && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Total Rows</p>
                            <p className="text-2xl font-bold text-primary">{getAnalysisStats().totalRows}</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Total Columns</p>
                            <p className="text-2xl font-bold text-primary">{getAnalysisStats().totalColumns}</p>
                          </div>
                        </div>
                        <div className="border border-border rounded-lg p-3 bg-muted/20">
                          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Column Analytics</p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {Object.entries(getAnalysisStats().columnStats).map(([colName, stats]) => (
                              <div key={colName} className="text-xs bg-background rounded p-2 border border-border/50">
                                <p className="font-medium text-foreground mb-1">{colName}</p>
                                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                                  <span>Unique: <span className="text-foreground font-semibold">{stats.uniqueValues}</span></span>
                                  <span>Empty: <span className="text-foreground font-semibold">{stats.nullCount}</span></span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border rounded-lg">
                <div className="text-center space-y-2">
                  <Terminal size={32} className="mx-auto opacity-30" />
                  <p className="text-sm">{mode === 'preset' ? 'Select a query from the left to execute' : 'Write a SQL query and click Run'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Queries;
