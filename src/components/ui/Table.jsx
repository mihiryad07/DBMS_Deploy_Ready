import React from 'react';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-border/60 shadow-sm depth-2">
      <table className={`w-full caption-bottom text-sm ${className || ''}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className }) {
  return <thead className={`[&_tr]:border-b bg-muted/40 border-border/50 ${className || ''}`}>{children}</thead>;
}

export function TableRow({ children, className, ...props }) {
  return (
    <tr className={`border-b border-border/50 table-row-3d data-[state=selected]:bg-primary/5 ${className || ''}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }) {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props}>
      {children}
    </th>
  );
}

export function TableBody({ children, className, ...props }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props}>{children}</tbody>;
}

export function TableCell({ children, className, colSpan, ...props }) {
  return (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} colSpan={colSpan} {...props}>
      {children}
    </td>
  );
}
