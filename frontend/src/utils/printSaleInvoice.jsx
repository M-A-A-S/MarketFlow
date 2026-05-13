import {
  formatDateTime,
  formatMoney,
  getFullName,
  getStatusName,
  getPaymentMethodName,
} from "./utils";

export const printSaleInvoice = (invoice, language = "en") => {
  const printWindow = window.open("", "_blank");

  const isArabic = language === "ar";

  const customerName = invoice?.customer
    ? getFullName(invoice.customer.person)
    : isArabic
      ? "عميل نقدي"
      : "Walk-in Customer";

  const direction = isArabic ? "rtl" : "ltr";

  const align = isArabic ? "right" : "left";

  const font = "Arial";

  // =========================
  // Items
  // =========================

  const itemsHtml = invoice.items
    .map(
      (item) => `
        <tr>
          <td>
            ${language === "en" ? item.product.nameEn : item.product.nameAr}
          </td>

          <td>${item.quantity}</td>

          <td>${formatMoney(item.unitPrice)}</td>

          <td>${formatMoney(item.total)}</td>
        </tr>
      `,
    )
    .join("");

  // =========================
  // Payments
  // =========================

  const paymentsHtml = invoice.payments
    .map(
      (payment) => `
        <tr>
          <td>
            ${getPaymentMethodName(payment.paymentMethod, language)}
          </td>

          <td>
            ${formatMoney(payment.amount)}
          </td>

          <td>
            ${payment.transactionReference || "-"}
          </td>

          <td>
            ${formatDateTime(payment.paymentDate)}
          </td>
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
            color: #222;
          }

          h2 {
            margin-bottom: 10px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .badge {
            padding: 6px 12px;
            border-radius: 6px;
            background: #f3f3f3;
            font-weight: bold;
          }

          .info {
            margin-bottom: 25px;
            line-height: 1.9;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: ${align};
          }

          th {
            background: #f5f5f5;
          }

          .section-title {
            margin-top: 30px;
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: bold;
          }

          .totals {
            margin-top: 25px;
            width: 350px;
            margin-${isArabic ? "right" : "left"}: auto;
          }

          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
          }

          .grand-total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #000;
            margin-top: 10px;
            padding-top: 10px;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>

        <!-- HEADER -->

        <div class="header">

          <h2>
            ${isArabic ? "فاتورة مبيعات" : "Sale Invoice"}
          </h2>

          <span class="badge">
            ${invoice.invoiceNumber}
          </span>

        </div>

        <!-- INFO -->

        <div class="info">

          <p>
            <strong>
              ${isArabic ? "التاريخ" : "Date"}:
            </strong>

            ${formatDateTime(invoice.invoiceDate)}
          </p>

          <p>
            <strong>
              ${isArabic ? "العميل" : "Customer"}:
            </strong>

            ${customerName}
          </p>

          <p>
            <strong>
              ${isArabic ? "الحالة" : "Status"}:
            </strong>

            ${getStatusName(invoice.status)}
          </p>

        </div>

        <!-- ITEMS -->

        <div class="section-title">
          ${isArabic ? "عناصر الفاتورة" : "Invoice Items"}
        </div>

        <table>

          <thead>
            <tr>
              <th>
                ${isArabic ? "المنتج" : "Product"}
              </th>

              <th>
                ${isArabic ? "الكمية" : "Qty"}
              </th>

              <th>
                ${isArabic ? "سعر الوحدة" : "Unit Price"}
              </th>

              <th>
                ${isArabic ? "الإجمالي" : "Total"}
              </th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>

        </table>

        <!-- PAYMENTS -->

        <div class="section-title">
          ${isArabic ? "المدفوعات" : "Payments"}
        </div>

        <table>

          <thead>
            <tr>

              <th>
                ${isArabic ? "طريقة الدفع" : "Payment Method"}
              </th>

              <th>
                ${isArabic ? "المبلغ" : "Amount"}
              </th>

              <th>
                ${isArabic ? "المرجع" : "Reference"}
              </th>

              <th>
                ${isArabic ? "التاريخ" : "Date"}
              </th>

            </tr>
          </thead>

          <tbody>
            ${paymentsHtml}
          </tbody>

        </table>

        <!-- TOTALS -->

        <div class="totals">

          <div class="totals-row">
            <span>
              ${isArabic ? "الإجمالي" : "Grand Total"}
            </span>

            <span>
              ${formatMoney(invoice.grandTotal)}
            </span>
          </div>

          <div class="totals-row">
            <span>
              ${isArabic ? "الخصم" : "Discount"}
            </span>

            <span>
              ${formatMoney(invoice.discount || 0)}
            </span>
          </div>

          <div class="totals-row">
            <span>
              ${isArabic ? "الضريبة" : "Tax"}
            </span>

            <span>
              ${formatMoney(invoice.tax || 0)}
            </span>
          </div>

          <div class="totals-row grand-total">
            <span>
              ${isArabic ? "الإجمالي الصافي" : "Net Total"}
            </span>

            <span>
              ${formatMoney(invoice.netTotal)}
            </span>
          </div>

          <div class="totals-row">
            <span>
              ${isArabic ? "المدفوع" : "Paid"}
            </span>

            <span>
              ${formatMoney(invoice.paidAmount)}
            </span>
          </div>

          <div class="totals-row">
            <span>
              ${isArabic ? "المتبقي" : "Remaining"}
            </span>

            <span>
              ${formatMoney(invoice.remainingAmount)}
            </span>
          </div>

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
