import { ArrowLeft, ArrowRight, Check, CheckIcon, Loader2 } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { useLanguage } from "../../../hooks/useLanguage";
import Button from "../../../components/UI/Button";
import { safeCall } from "../../../utils/utils";
import { Link } from "react-router-dom";

const InvoiceHeader = ({ onSubmit, isModeUpdate, loading, isEditable }) => {
  const { translations, language } = useLanguage();

  const { add_title, add_desc, edit_title, edit_desc } =
    translations.pages.purchase_invoice_page;

  const { save } = translations.common;

  return (
    <PageHeader
      title={
        <div className="flex items-center gap-2">
          <Link to="/purchase-invoices" className="">
            {language == "en" ? <ArrowLeft /> : <ArrowRight />}
          </Link>{" "}
          {isModeUpdate ? edit_title : add_title}
        </div>
      }
      leftSection={
        <Button
          disabled={loading || !isEditable}
          onClick={onSubmit}
          className="justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Check /> {save}
            </>
          )}
        </Button>
      }
    />
  );
};
export default InvoiceHeader;
