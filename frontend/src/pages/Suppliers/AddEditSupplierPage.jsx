import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Checkbox from "../../components/UI/Checkbox";
import ImagePicker from "../../components/UI/ImagePicker";
import { read, create, update } from "../../api/apiWrapper";
import { showFail, showSuccess } from "../../utils/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import GenderSelect from "./components/GenderSelect";

const initialFormState = {
  personId: "",
  firstName: "",
  lastName: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  imageUrl: "",
  imageFile: null,
  deleteImage: false,
};

const AddEditSupplierPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModeUpdate, setIsModeUpdate] = useState(false);

  const { translations, language } = useLanguage();
  const {
    add_new_supplier,
    edit_supplier,
    firstName,
    firstName_placeholder,
    firstName_error,
    lastName,
    lastName_placeholder,
    lastName_error,
    phone,
    phone_placeholder,
    phone_error,
    invalid_phone_error,
    gender,
    dateOfBirth,
    image,
    add_success,
    add_fail,
    update_success,
    update_fail,
  } = translations.pages.suppliers_page;

  const { save, back } = translations.common;

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (id) {
      setIsModeUpdate(true);
      fetchSupplier(id);
    } else {
      setIsModeUpdate(false);
      setFormData(initialFormState);
    }
  }, [id]);

  const validateFormData = () => {
    let temp = {};

    if (!formData.firstName.trim()) {
      temp.firstName = firstName_error;
    }
    if (!formData.lastName.trim()) {
      temp.lastName = lastName_error;
    }

    const sudanPhoneRegex = /^(?:\+249|0)(?:[1-9][0-9])[0-9]{7}$/;

    if (!formData.phone.trim()) {
      temp.phone = phone_error;
    } else if (!sudanPhoneRegex.test(formData.phone.trim())) {
      temp.phone = invalid_phone_error;
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const generatePayload = () => {
    const payload = new FormData();

    payload.append("person.firstName", formData.firstName);
    payload.append("person.lastName", formData.lastName);
    payload.append("person.phone", formData.phone);
    payload.append("person.gender", formData.gender);

    if (formData.personId) {
      payload.append("personId", formData.personId);
      payload.append("person.id", formData.personId);
    }

    if (formData.dateOfBirth) {
      payload.append("person.dateOfBirth", formData.dateOfBirth);
    }

    if (formData.imageFile) {
      payload.append("person.imageFile", formData.imageFile);
    }
    if (formData.imageUrl && !formData.imageFile) {
      payload.append("person.imageUrl", formData.imageUrl);
    }
    if (formData.deleteImage) {
      payload.append("person.deleteImage", true);
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
      updateSupplier(payload);
    } else {
      addSupplier(payload);
    }
  };

  async function fetchSupplier(id) {
    try {
      setLoading(true);
      const result = await read(`suppliers/${id}`);
      const supplier = result.data;

      setFormData({
        personId: supplier.personId,
        firstName: supplier.person?.firstName || "",
        lastName: supplier.person?.lastName || "",
        phone: supplier.person?.phone || "",
        gender: supplier.person?.gender || "",
        dateOfBirth: supplier.person?.dateOfBirth || "",
        imageUrl: supplier.person?.imageUrl || "",
        imageFile: null,
      });
    } catch (err) {
      showFail(err?.code);
    } finally {
      setLoading(false);
    }
  }

  async function addSupplier(payload) {
    try {
      setActionLoading(true);
      const result = await create("suppliers", payload);
      showSuccess(result?.code, add_success);
      navigate("/suppliers");
    } catch (err) {
      showFail(err?.code, add_fail);
    } finally {
      setActionLoading(false);
    }
  }

  async function updateSupplier(payload) {
    try {
      setActionLoading(true);
      const result = await update(`suppliers/${id}`, payload);
      showSuccess(result?.code, update_success);
      navigate("/suppliers");
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
            <Link to="/suppliers">
              {language === "en" ? <ArrowLeft /> : <ArrowRight />}
            </Link>{" "}
            {id ? edit_supplier : add_new_supplier}
          </div>
        }
      />

      <form
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          label={firstName}
          value={formData.firstName}
          errorMessage={errors.firstName}
          placeholder={firstName_placeholder}
          showLabel
          onChange={(e) => updateField("firstName", e.target.value)}
        />

        <Input
          label={lastName}
          value={formData.lastName}
          errorMessage={errors.lastName}
          placeholder={lastName_placeholder}
          showLabel
          onChange={(e) => updateField("lastName", e.target.value)}
        />

        <Input
          label={phone}
          value={formData.phone}
          errorMessage={errors.phone}
          placeholder={phone_placeholder}
          showLabel
          onChange={(e) => updateField("phone", e.target.value)}
        />

        <GenderSelect
          value={formData.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          label={gender}
          showLabel={true}
        />

        <Input
          label={dateOfBirth}
          type="date"
          value={formData.dateOfBirth}
          showLabel
          onChange={(e) => updateField("dateOfBirth", e.target.value)}
        />

        <ImagePicker
          label={image}
          imageUrl={formData.imageUrl}
          imageFile={formData.imageFile}
          onChange={({ imageUrl, imageFile }) =>
            setFormData((prev) => ({ ...prev, imageUrl, imageFile }))
          }
        />

        <div className="md:col-span-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate("/suppliers")}>
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

export default AddEditSupplierPage;
