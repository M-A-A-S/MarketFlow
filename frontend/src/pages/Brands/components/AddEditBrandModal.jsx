import { useEffect, useState } from "react";
import { safeCall } from "../../../utils/utils";
import { useLanguage } from "../../../hooks/useLanguage";
import AddEditModal from "../../../components/UI/AddEditModal";
import Input from "../../../components/UI/Input";
import TextArea from "../../../components/UI/TextArea";
import ImagePicker from "../../../components/UI/ImagePicker";

const initialFormState = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  websiteUrl: "",
  imageUrl: "",
  imageFile: null,
  deleteImage: false,
};

const AddEditBrandModal = ({ show, onClose, onConfirm, brand, loading }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const { translations, language } = useLanguage();

  const {
    add_new_brand,
    edit_brand,
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
    image,
    websiteUrl,
    websiteUrl_placeholder,
  } = translations.pages.brands_page;

  const handleClose = safeCall(onClose);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (brand) {
      setFormData({
        nameEn: brand?.nameEn || "",
        nameAr: brand?.nameAr || "",
        descriptionEn: brand?.descriptionEn || "",
        descriptionAr: brand?.descriptionAr || "",
        websiteUrl: brand?.websiteUrl || "",
        imageUrl: brand?.imageUrl || "",
        imageFile: null,
        deleteImage: false,
      });
    } else {
      setFormData(initialFormState);
    }

    setErrors({});
  }, [brand, show]);

  useEffect(() => {
    validateFormData();
  }, [language]);

  const validateFormData = () => {
    let temp = {};

    if (!formData.nameEn.trim()) {
      temp.nameEn = nameEn_error;
    }

    if (!formData.nameAr.trim()) {
      temp.nameAr = nameAr_error;
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  function handleSubmit() {
    if (!validateFormData()) {
      return;
    }

    const payload = new FormData();

    payload.append("nameEn", formData.nameEn);
    payload.append("nameAr", formData.nameAr);

    if (formData.descriptionEn) {
      payload.append("descriptionEn", formData.descriptionEn);
    }

    if (formData.descriptionAr) {
      payload.append("descriptionAr", formData.descriptionAr);
    }

    if (formData.websiteUrl) {
      payload.append("websiteUrl", formData.websiteUrl);
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

    safeCall(onConfirm)(payload);
  }

  return (
    <AddEditModal
      show={show}
      onClose={handleClose}
      title={brand ? edit_brand : add_new_brand}
      onSave={handleSubmit}
      loading={loading}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label={nameEn}
          name="nameEn"
          placeholder={nameEn_placeholder}
          value={formData.nameEn}
          errorMessage={errors.nameEn}
          onChange={(e) => updateField("nameEn", e.target.value)}
          showLabel
        />

        <Input
          label={nameAr}
          name="nameAr"
          placeholder={nameAr_placeholder}
          value={formData.nameAr}
          errorMessage={errors.nameAr}
          onChange={(e) => updateField("nameAr", e.target.value)}
          showLabel
        />

        <TextArea
          label={descriptionEn}
          name="descriptionEn"
          placeholder={descriptionEn_placeholder}
          value={formData.descriptionEn}
          onChange={(e) => updateField("descriptionEn", e.target.value)}
          showLabel
        />

        <TextArea
          label={descriptionAr}
          name="descriptionAr"
          placeholder={descriptionAr_placeholder}
          value={formData.descriptionAr}
          onChange={(e) => updateField("descriptionAr", e.target.value)}
          showLabel
        />

        <Input
          label={websiteUrl}
          name="websiteUrl"
          placeholder={websiteUrl_placeholder}
          value={formData.websiteUrl}
          onChange={(e) => updateField("websiteUrl", e.target.value)}
          showLabel
        />

        <ImagePicker
          label={image}
          imageUrl={formData.imageUrl}
          imageFile={formData.imageFile}
          onChange={({ imageUrl, imageFile }) =>
            setFormData((prev) => ({
              ...prev,
              imageUrl,
              imageFile,
              deleteImage: false,
            }))
          }
          onRemove={() =>
            setFormData((prev) => ({
              ...prev,
              imageFile: null,
              imageUrl: "",
              deleteImage: true,
            }))
          }
        />
      </form>
    </AddEditModal>
  );
};

export default AddEditBrandModal;
