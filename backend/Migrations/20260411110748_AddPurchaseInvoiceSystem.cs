using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddPurchaseInvoiceSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoice_Supplier_SupplierId",
                table: "PurchaseInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoiceItem_Products_ProductId",
                table: "PurchaseInvoiceItem");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoiceItem_PurchaseInvoice_PurchaseInvoiceId",
                table: "PurchaseInvoiceItem");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchasePayment_PurchaseInvoice_PurchaseInvoiceId",
                table: "PurchasePayment");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_People_PersonId",
                table: "Supplier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier",
                table: "Supplier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PurchasePayment",
                table: "PurchasePayment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PurchaseInvoiceItem",
                table: "PurchaseInvoiceItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PurchaseInvoice",
                table: "PurchaseInvoice");

            migrationBuilder.RenameTable(
                name: "Supplier",
                newName: "Suppliers");

            migrationBuilder.RenameTable(
                name: "PurchasePayment",
                newName: "PurchasePayments");

            migrationBuilder.RenameTable(
                name: "PurchaseInvoiceItem",
                newName: "PurchaseInvoiceItems");

            migrationBuilder.RenameTable(
                name: "PurchaseInvoice",
                newName: "PurchaseInvoices");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_PersonId",
                table: "Suppliers",
                newName: "IX_Suppliers_PersonId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchasePayment_PurchaseInvoiceId",
                table: "PurchasePayments",
                newName: "IX_PurchasePayments_PurchaseInvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoiceItem_PurchaseInvoiceId",
                table: "PurchaseInvoiceItems",
                newName: "IX_PurchaseInvoiceItems_PurchaseInvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoiceItem_ProductId",
                table: "PurchaseInvoiceItems",
                newName: "IX_PurchaseInvoiceItems_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoice_SupplierId",
                table: "PurchaseInvoices",
                newName: "IX_PurchaseInvoices_SupplierId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoice_InvoiceNumber",
                table: "PurchaseInvoices",
                newName: "IX_PurchaseInvoices_InvoiceNumber");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Suppliers",
                table: "Suppliers",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PurchasePayments",
                table: "PurchasePayments",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PurchaseInvoiceItems",
                table: "PurchaseInvoiceItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PurchaseInvoices",
                table: "PurchaseInvoices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoiceItems_Products_ProductId",
                table: "PurchaseInvoiceItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoiceItems_PurchaseInvoices_PurchaseInvoiceId",
                table: "PurchaseInvoiceItems",
                column: "PurchaseInvoiceId",
                principalTable: "PurchaseInvoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoices_Suppliers_SupplierId",
                table: "PurchaseInvoices",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchasePayments_PurchaseInvoices_PurchaseInvoiceId",
                table: "PurchasePayments",
                column: "PurchaseInvoiceId",
                principalTable: "PurchaseInvoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Suppliers_People_PersonId",
                table: "Suppliers",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoiceItems_Products_ProductId",
                table: "PurchaseInvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoiceItems_PurchaseInvoices_PurchaseInvoiceId",
                table: "PurchaseInvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseInvoices_Suppliers_SupplierId",
                table: "PurchaseInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_PurchasePayments_PurchaseInvoices_PurchaseInvoiceId",
                table: "PurchasePayments");

            migrationBuilder.DropForeignKey(
                name: "FK_Suppliers_People_PersonId",
                table: "Suppliers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Suppliers",
                table: "Suppliers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PurchasePayments",
                table: "PurchasePayments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PurchaseInvoices",
                table: "PurchaseInvoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PurchaseInvoiceItems",
                table: "PurchaseInvoiceItems");

            migrationBuilder.RenameTable(
                name: "Suppliers",
                newName: "Supplier");

            migrationBuilder.RenameTable(
                name: "PurchasePayments",
                newName: "PurchasePayment");

            migrationBuilder.RenameTable(
                name: "PurchaseInvoices",
                newName: "PurchaseInvoice");

            migrationBuilder.RenameTable(
                name: "PurchaseInvoiceItems",
                newName: "PurchaseInvoiceItem");

            migrationBuilder.RenameIndex(
                name: "IX_Suppliers_PersonId",
                table: "Supplier",
                newName: "IX_Supplier_PersonId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchasePayments_PurchaseInvoiceId",
                table: "PurchasePayment",
                newName: "IX_PurchasePayment_PurchaseInvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoices_SupplierId",
                table: "PurchaseInvoice",
                newName: "IX_PurchaseInvoice_SupplierId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoices_InvoiceNumber",
                table: "PurchaseInvoice",
                newName: "IX_PurchaseInvoice_InvoiceNumber");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoiceItems_PurchaseInvoiceId",
                table: "PurchaseInvoiceItem",
                newName: "IX_PurchaseInvoiceItem_PurchaseInvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_PurchaseInvoiceItems_ProductId",
                table: "PurchaseInvoiceItem",
                newName: "IX_PurchaseInvoiceItem_ProductId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier",
                table: "Supplier",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PurchasePayment",
                table: "PurchasePayment",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PurchaseInvoice",
                table: "PurchaseInvoice",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PurchaseInvoiceItem",
                table: "PurchaseInvoiceItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoice_Supplier_SupplierId",
                table: "PurchaseInvoice",
                column: "SupplierId",
                principalTable: "Supplier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoiceItem_Products_ProductId",
                table: "PurchaseInvoiceItem",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseInvoiceItem_PurchaseInvoice_PurchaseInvoiceId",
                table: "PurchaseInvoiceItem",
                column: "PurchaseInvoiceId",
                principalTable: "PurchaseInvoice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PurchasePayment_PurchaseInvoice_PurchaseInvoiceId",
                table: "PurchasePayment",
                column: "PurchaseInvoiceId",
                principalTable: "PurchaseInvoice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_People_PersonId",
                table: "Supplier",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
