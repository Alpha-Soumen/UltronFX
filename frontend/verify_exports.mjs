import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import fs from 'fs';

// Mock Data
const mockData = [
    { Date: '2025-01-01', Open: 100, High: 105, Low: 95, Close: 102, Volume: 1000 },
    { Date: '2025-01-02', Open: 102, High: 108, Low: 100, Close: 106, Volume: 1500 },
    { Date: '2025-01-03', Open: 106, High: 110, Low: 104, Close: 108, Volume: 1200 },
];

const outputDir = './test_exports';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

console.log("Starting Export Verification...");

// 1. Verify CSV
try {
    console.log("Testing CSV Generation...");
    const headers = Object.keys(mockData[0]).join(',');
    const rows = mockData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    fs.writeFileSync(`${outputDir}/test.csv`, csvContent);
    console.log("✅ CSV Generated Successfully");
} catch (e) {
    console.error("❌ CSV Failed:", e);
}

// 2. Verify XLSX
try {
    console.log("Testing XLSX Generation...");
    const ws = XLSX.utils.json_to_sheet(mockData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${outputDir}/test.xlsx`);
    console.log("✅ XLSX Generated Successfully");
} catch (e) {
    console.error("❌ XLSX Failed:", e);
}

// 3. Verify PDF
try {
    console.log("Testing PDF Generation...");
    // jsPDF in Node might behave differently than browser, but basic API is same
    // We need to mock the window object for jspdf-autotable if it relies on it, 
    // but usually it works if imported correctly.
    // Note: jsPDF default export is a constructor.

    const doc = new jsPDF();
    doc.text("Test Report", 14, 15);

    const headers = [Object.keys(mockData[0])];
    const rows = mockData.map(row => Object.values(row).map(String)); // Ensure strings

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 30,
    });

    doc.save(`${outputDir}/test.pdf`); // save() in Node saves to file? No, usually it triggers download in browser.
    // In Node, we might need output() and fs.writeFileSync
    const pdfOutput = doc.output('arraybuffer');
    fs.writeFileSync(`${outputDir}/test.pdf`, Buffer.from(pdfOutput));

    console.log("✅ PDF Generated Successfully");
} catch (e) {
    console.error("❌ PDF Failed:", e);
}

// 4. Verify JSON
try {
    console.log("Testing JSON Generation...");
    const jsonContent = JSON.stringify(mockData, null, 2);
    fs.writeFileSync(`${outputDir}/test.json`, jsonContent);
    console.log("✅ JSON Generated Successfully");
} catch (e) {
    console.error("❌ JSON Failed:", e);
}

console.log("Verification Complete. Check ./test_exports folder.");
