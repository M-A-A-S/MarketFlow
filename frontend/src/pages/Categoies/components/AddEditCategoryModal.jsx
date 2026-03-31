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
  imageUrl: "",
  imageFile: null,
};

const AddEditCategoryModal = ({
  show,
  onClose,
  onConfirm,
  category,
  loading,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const { translations, language } = useLanguage();
  const {
    add_new_category,
    edit_category,
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
  } = translations.pages.categories_page;

  const handleClose = safeCall(onClose);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (category) {
      setFormData({
        nameEn: category?.nameEn || "",
        nameAr: category?.nameAr || "",
        descriptionEn: category?.descriptionEn || "",
        descriptionAr: category?.descriptionAr || "",
        imageUrl: category?.imageUrl || "",
        imageFile: null,
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [category, show]);

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

    return Object.keys(temp).length === 0; // true = valid
  };

  function handleSubmit() {
    if (!validateFormData()) {
      toast.error(default_message);
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

    if (formData.imageFile) {
      payload.append("imageFile", formData.imageFile);
    }

    if (formData.imageUrl && !formData.imageFile) {
      payload.append("imageUrl", formData.imageUrl);
    }

    // onConfirm?.(payload);
    safeCall(onConfirm)(payload);
  }

  return (
    <div>
      <AddEditModal
        show={show}
        onClose={handleClose}
        title={category ? edit_category : add_new_category}
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
            showLabel={true}
          />
          <Input
            label={nameAr}
            name="nameAr"
            placeholder={nameAr_placeholder}
            value={formData.nameAr}
            errorMessage={errors.nameAr}
            onChange={(e) => updateField("nameAr", e.target.value)}
            showLabel={true}
          />
          <TextArea
            label={descriptionEn}
            name="descriptionEn"
            placeholder={descriptionEn_placeholder}
            value={formData.descriptionEn}
            errorMessage={errors.descriptionEn}
            onChange={(e) => updateField("descriptionEn", e.target.value)}
            showLabel={true}
          />
          <TextArea
            label={descriptionAr}
            name="descriptionAr"
            placeholder={descriptionAr_placeholder}
            value={formData.descriptionAr}
            errorMessage={errors.descriptionAr}
            onChange={(e) => updateField("descriptionAr", e.target.value)}
            showLabel={true}
          />
          <ImagePicker
            label={image}
            imageUrl={formData.imageUrl}
            imageFile={formData.imageFile}
            onChange={({ imageUrl, imageFile }) =>
              setFormData((prev) => ({ ...prev, imageUrl, imageFile }))
            }
          />
        </form>
      </AddEditModal>
    </div>
  );
};
export default AddEditCategoryModal;
