import {
  formatDateTime,
  formatMoney,
  getFullName,
  getStatusName,
} from "./utils";

export const printPurchaseInvoice = (invoice, language = "en") => {
  const printWindow = window.open("", "_blank");

  const isArabic = language === "ar";

  const supplierName = getFullName(invoice?.supplier?.person);

  const direction = isArabic ? "rtl" : "ltr";
  const align = isArabic ? "right" : "left";
  const font = isArabic ? "Arial" : "Arial";

  const itemsHtml = invoice.items
    .map(
      (item) => `
      <tr>
        <td>${language == "en" ? item.product.nameEn : item.product.nameAr}</td>
        <td>${item.quantity}</td>
        <td>${formatMoney(item.unitPrice)}</td>
        <td>${formatMoney(item.total)}</td>
      </tr>
    `,
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${invoice.invoiceNumber}</title>

        <style>
          body {
            font-family: ${font};
            direction: ${direction};
            text-align: ${align};
            padding: 20px;
          }

          h2 {
            margin-bottom: 10px;
          }

          .info {
            margin-bottom: 20px;
            line-height: 1.8;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: ${align};
          }

          th {
            background: #f5f5f5;
          }

          .total {
            margin-top: 20px;
            font-weight: bold;
          }

          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .badge {
            padding: 4px 10px;
            border-radius: 6px;
            background: #eee;
            display: inline-block;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <h2>
            ${isArabic ? "فاتورة مشتريات" : "Purchase Invoice"}
          </h2>

          <span class="badge">
            ${invoice.invoiceNumber}
          </span>
        </div>

        <div class="info">
          <p>
            <strong>${isArabic ? "التاريخ" : "Date"}:</strong>
            ${formatDateTime(invoice.invoiceDate)}
          </p>

          <p>
            <strong>${isArabic ? "المورد" : "Supplier"}:</strong>
            ${supplierName}
          </p>

          <p>
            <strong>${isArabic ? "الحالة" : "Status"}:</strong>
            ${getStatusName(invoice.status)}
          </p>
        </div>

        <table>
          <thead>
            <tr>
              <th>${isArabic ? "المنتج" : "Product"}</th>
              <th>${isArabic ? "الكمية" : "Qty"}</th>
              <th>${isArabic ? "سعر الوحدة" : "Unit Price"}</th>
              <th>${isArabic ? "الإجمالي" : "Total"}</th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total">
          <p>${isArabic ? "الإجمالي قبل الخصم" : "Subtotal"}: ${formatMoney(invoice.totalBeforeDiscount)}</p>
          <p>${isArabic ? "الخصم" : "Discount"}: ${formatMoney(invoice.discount)}</p>
          <p>${isArabic ? "الضريبة" : "Tax"}: ${formatMoney(invoice.tax)}</p>
          <p>${isArabic ? "الإجمالي الصافي" : "Net Total"}: ${formatMoney(invoice.netTotal)}</p>
          <p>${isArabic ? "المدفوع" : "Paid"}: ${formatMoney(invoice.paidAmount)}</p>
          <p>${isArabic ? "المتبقي" : "Remaining"}: ${formatMoney(invoice.remainingAmount)}</p>
        </div>

        <script>
          window.onload = function () {
            window.print();
            window.onafterprint = function () {
              window.close();
            };
          };
        </script>

      </body>
    </html>
  `);

  printWindow.document.close();
};
