import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatExportDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function escapeCSVValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function exportTripsCSV(cities) {
  const headers = ["City", "Country", "Date", "Notes", "Latitude", "Longitude"];
  const rows = cities.map((city) => [
    city.cityName,
    city.country,
    formatExportDate(city.date),
    city.notes || "",
    city.position?.lat || "",
    city.position?.lng || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSVValue).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "worldwise-trips.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function exportTripsPDF(cities) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("WorldWise Trips", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated trips: ${cities.length}`, 14, 26);

  autoTable(doc, {
    startY: 34,
    head: [["City", "Country", "Date", "Notes"]],
    body: cities.map((city) => [
      city.cityName,
      city.country,
      formatExportDate(city.date),
      city.notes || "-",
    ]),
    styles: {
      cellPadding: 3,
      fontSize: 9,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [0, 196, 106],
      textColor: [36, 42, 46],
    },
  });

  doc.save("worldwise-trips.pdf");
}
