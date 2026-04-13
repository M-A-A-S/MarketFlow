namespace MarketFlow.Utilities.ResultCodes
{
    public partial class ResultCodes
    {
        public const string PurchaseInvoiceNotFound = "purchase_invoice_not_found";
        public const string PurchaseInvoiceCreateFailed = "purchase_invoice_create_failed";
        public const string PurchaseInvoiceUpdateFailed = "purchase_invoice_update_failed";
        public const string PurchaseInvoiceDeleteFailed = "purchase_invoice_delete_failed";
        public const string InvalidInvoiceStatusForUpdate = "invalid_invoice_status_for_update";
        public const string InvalidStatusTransition = "invalid_status_transition";
        public const string InvoiceAlreadyCancelled = "invoice_already_cancelled";
        public const string InvalidInvoiceItems = "invalid_invoice_items";
        public const string InvoiceHasPaymentsCannotEditItems = "invoice_has_payments_cannot_edit_items";
    }
}
