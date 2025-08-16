import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  type Company,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../../reducer/companyApi";
import { useTranslation } from "react-i18next";

interface UpsertCompanyFormProps {
  onClose?: () => void;
  company?: Company | null;
}

interface FormState {
  name: string;
}

export const UpsertCompanyForm: React.FC<UpsertCompanyFormProps> = ({
  onClose,
  company = null,
}) => {
  const { t } = useTranslation();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();

  const isEdit = !!company;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("Company name is required")),
  });

  const formik = useFormik<FormState>({
    initialValues: { name: company?.name || "" },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isEdit && company) {
          await updateCompany({ id: company.id, ...values }).unwrap();
        } else {
          await createCompany(values).unwrap();
        }
        resetForm();
        if (onClose) onClose();
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: 8,
          minWidth: 350,
          maxWidth: "90%",
          boxShadow: "0 6px 30px rgba(0,0,0,0.15)",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "transparent",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
          aria-label={t("Close")}
        >
          &times;
        </button>

        <h2 style={{ marginTop: 0, marginBottom: 24, fontWeight: 600 }}>
          {isEdit ? t("Update Company") : t("Add Company")}
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="name"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("Company Name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={t("Enter company name")}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.name}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "#eee",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            style={{
              padding: "10px 20px",
              background: "#23272f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {formik.isSubmitting
              ? isEdit
                ? t("Updating...")
                : t("Saving...")
              : isEdit
              ? t("Update")
              : t("Save")}
          </button>
        </div>
      </form>
    </div>
  );
};
