import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import TextArea from "../../components/UI/TextArea";
import Checkbox from "../../components/UI/Checkbox";
import ImagePicker from "../../components/UI/ImagePicker";
import { read, create, update } from "../../api/apiWrapper";
import { showFail, showSuccess } from "../../utils/utils";
import BrandSelect from "./components/BrandSelect";
import CategorySelect from "./components/CategorySelect";
import { ArrowLeft, ArrowRight } from "lucide-react";

const initialFormState = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  price: "",
  barcode: "",
  stockQuantity: "",
  categoryId: "",
  brandId: "",
  isActive: true,
  imageUrl: "",
  imageFile: null,
  deleteImage: false,
};

const AddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isModeUpdate, setIsModeUpdate] = useState(false);

  const { translations, language } = useLanguage();
  const {
    edit_product,
    add_new_product,
    nameEn,
    nameEn_placeholder,
    nameEn_error,
    nameAr,
    nameAr_placeholder,
    nameAr_error,
    descriptionEn,
    descriptionEn_placeholder,
    descriptionAr,
    descriptionAr_placeholder,
    price,
    price_placeholder,
    price_error,
    invalid_price_error,
    barcode,
    barcode_placeholder,
    stockQuantity,
    stockQuantity_placeholder,
    stockQuantity_error,
    invalid_stockQuantity_error,
    category,
    category_placeholder,
    category_error,
    brand,
    brand_placeholder,
    isActive,
    image,
    add_success,
    add_fail,
    update_success,
    update_fail,
  } = translations.pages.products_page;

  const { save, back } = translations.common;

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (id) {
      setIsModeUpdate(true);
      fetchProduct(id);
    } else {
      setIsModeUpdate(false);
      setFormData(initialFormState);
    }
  }, []);

  const validateFormData = () => {
    let temp = {};

    if (!formData.nameEn.trim()) {
      temp.nameEn = nameEn_error;
    }

    if (!formData.nameAr.trim()) {
      temp.nameAr = nameAr_error;
    }

    if (!formData.price || Number(price) < 0) {
      temp.price = invalid_price_error;
    }

    if (!formData.stockQuantity || Number(formData.stockQuantity) < 0) {
      temp.stockQuantity = invalid_stockQuantity_error;
    }

    if (!formData.categoryId) {
      temp.categoryId = category_error;
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const generatePayload = () => {
    const payload = new FormData();

    payload.append("nameEn", formData.nameEn);
    payload.append("nameAr", formData.nameAr);
    payload.append("price", formData.price);
    payload.append("barcode", formData.barcode);
    payload.append("stockQuantity", formData.stockQuantity);
    payload.append("categoryId", formData.categoryId);
    payload.append("isActive", formData.isActive);

    if (formData.brandId) {
      payload.append("brandId", formData.brandId);
    }

    if (formData.descriptionEn) {
      payload.append("descriptionEn", formData.descriptionEn);
    }

    if (formData.descriptionAr) {
      payload.append("descriptionAr", formData.descriptionAr);
    }

    if (formData.imageFile) {
      payload.append("imageFile", formData.imageFile);
    }

    if (formData.imageUrl && !formData.imageFile) {
      payload.append("imageUrl", formData.imageUrl);
    }

    if (formData.deleteImage) {
      payload.append("deleteImage", true);
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const payload = generatePayload();

    if (isModeUpdate) {
      updateProduct(payload);
    } else {
      addProduct(payload);
    }
  };

  async function fetchProduct(id) {
    try {
      setLoading(true);
      const result = await read(`products/${id}`);
      console.log("result -> ", result);

      const product = result.data;

      setFormData({
        nameEn: product.nameEn || "",
        nameAr: product.nameAr || "",
        descriptionEn: product.descriptionEn || "",
        descriptionAr: product.descriptionAr || "",
        price: product.price || "",
        barcode: product.barcode || "",
        stockQuantity: product.stockQuantity || "",
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        isActive: product.isActive ?? true,
        imageUrl: product.imageUrl || "",
        imageFile: null,
        deleteImage: false,
      });
    } catch (error) {
      console.error("Fetch product error: ", error);
      showFail(error?.code);
    } finally {
      setLoading(false);
    }
  }

  async function addProduct(payload) {
    try {
      setActionLoading(true);
      const result = await create("products", payload);
      showSuccess(result?.code, add_success);
      navigate("/products");
    } catch (err) {
      showFail(err?.code, add_fail);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateProduct(payload) {
    try {
      setActionLoading(true);
      const result = await update(`products/${id}`, payload);
      showSuccess(result?.code, update_success);
      navigate("/products");
    } catch (err) {
      showFail(err?.code, update_fail);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Link to="/products" className="">
              {language == "en" ? <ArrowLeft /> : <ArrowRight />}
            </Link>{" "}
            {id ? edit_product : add_new_product}
          </div>
        }
      />

      <form
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          label={nameEn}
          value={formData.nameEn}
          errorMessage={errors.nameEn}
          placeholder={nameEn_placeholder}
          showLabel={true}
          onChange={(e) => updateField("nameEn", e.target.value)}
        />

        <Input
          label={nameAr}
          value={formData.nameAr}
          errorMessage={errors.nameAr}
          placeholder={nameAr_placeholder}
          showLabel={true}
          onChange={(e) => updateField("nameAr", e.target.value)}
        />

        <TextArea
          label={descriptionEn}
          value={formData.descriptionEn}
          errorMessage={errors.descriptionEn}
          placeholder={descriptionEn_placeholder}
          showLabel={true}
          onChange={(e) => updateField("descriptionEn", e.target.value)}
        />

        <TextArea
          label={descriptionAr}
          value={formData.descriptionAr}
          errorMessage={errors.descriptionAr}
          placeholder={descriptionAr_placeholder}
          showLabel={true}
          onChange={(e) => updateField("descriptionAr", e.target.value)}
        />

        <Input
          label={price}
          type="number"
          value={formData.price}
          errorMessage={errors.price}
          placeholder={price_placeholder}
          showLabel={true}
          onChange={(e) => updateField("price", e.target.value)}
        />

        <Input
          label={stockQuantity}
          type="number"
          value={formData.stockQuantity}
          errorMessage={errors.stockQuantity}
          placeholder={stockQuantity_placeholder}
          showLabel={true}
          onChange={(e) => updateField("stockQuantity", e.target.value)}
        />

        <Input
          label={barcode}
          value={formData.barcode}
          errorMessage={errors.barcode}
          placeholder={barcode_placeholder}
          showLabel={true}
          onChange={(e) => updateField("barcode", e.target.value)}
        />

        <BrandSelect
          name="brandId"
          onChange={(e) => updateField("brandId", e.target.value)}
          label={brand}
          showLabel={true}
          value={formData.brandId}
          errorMessage={errors?.brandId}
        />

        <CategorySelect
          name="categoryId"
          onChange={(e) => updateField("categoryId", e.target.value)}
          label={category}
          showLabel={true}
          value={formData.categoryId}
          errorMessage={errors?.categoryId}
        />

        <ImagePicker
          label={image}
          imageUrl={formData.imageUrl}
          imageFile={formData.imageFile}
          onChange={({ imageUrl, imageFile }) =>
            setFormData((prev) => ({ ...prev, imageUrl, imageFile }))
          }
        />

        {isModeUpdate && (
          <Checkbox
            checked={formData.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            label={isActive}
            className="accent-purple-600"
          />
        )}

        <div className="md:col-span-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate("/products")}>
            {back}
          </Button>
          <Button type="submit" loading={actionLoading || loading}>
            {save}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProductPage;
