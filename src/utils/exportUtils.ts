/**
 * Utility functions for exporting frontend data tables to CSV / JSON / PDF files.
 */

export interface ExportColumn<T> {
  header: string;
  key: keyof T | ((item: T) => string | number | boolean | null | undefined);
}

/**
 * Downloads data as a CSV file in the browser.
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  columns?: ExportColumn<T>[]
): void {
  if (!data || data.length === 0) {
    console.warn("exportToCSV: No data provided for export.");
    alert("No data available to export.");
    return;
  }

  let headers: string[] = [];
  let rows: string[][] = [];

  if (columns && columns.length > 0) {
    headers = columns.map((c) => c.header);
    rows = data.map((item) =>
      columns.map((col) => {
        let val: any;
        if (typeof col.key === "function") {
          val = col.key(item);
        } else {
          val = item[col.key];
        }
        return val === null || val === undefined ? "" : String(val);
      })
    );
  } else {
    headers = Object.keys(data[0]);
    rows = data.map((item) =>
      headers.map((key) => {
        const val = item[key];
        return val === null || val === undefined ? "" : String(val);
      })
    );
  }

  // Escape quotes and format CSV lines
  const escapeCell = (cell: string) => {
    if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  };

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => row.map(escapeCell).join(",")),
    ].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename.replace(/\.csv$/, "")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads raw JSON string or object as a prettified file.
 */
export function exportToJSON(filename: string, data: any): void {
  const jsonStr = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename.replace(/\.json$/, "")}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
