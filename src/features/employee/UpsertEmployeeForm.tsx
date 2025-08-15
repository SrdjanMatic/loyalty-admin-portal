import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Employee,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../../reducer/employeeApi";
import { useTranslation } from "react-i18next";

interface UpsertEmployeeFormProps {
  employee?: Employee | null;
  companyId: number;
  onClose?: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
}

export const UpsertEmployeeForm: React.FC<UpsertEmployeeFormProps> = ({
  employee = null,
  companyId,
  onClose,
}) => {
  const { t } = useTranslation();
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const isEdit = !!employee;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t("First name is required")),
    lastName: Yup.string().required(t("Last name is required")),
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Email is required")),
  });

  const formik = useFormik<FormState>({
    initialValues: {
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      email: employee?.email || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        if (isEdit && employee) {
          await updateEmployee({
            id: employee.id,
            companyId,
            ...values,
          }).unwrap();
        } else {
          await createEmployee({ ...values, companyId }).unwrap();
        }
        helpers.resetForm();
        onClose?.();
      } catch (_) {}
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
          {isEdit ? t("Update Employee") : t("Add Employee")}
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="firstName"
            style={{ fontWeight: 500, marginBottom: 6 }}
          >
            {t("First Name")}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter first name")}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
            }}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.firstName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="lastName"
            style={{ fontWeight: 500, marginBottom: 6 }}
          >
            {t("Last Name")}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter last name")}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
            }}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.lastName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="email" style={{ fontWeight: 500, marginBottom: 6 }}>
            {t("Email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("Enter email")}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
            }}
            disabled={isEdit} // Prevent editing email on update
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.email}
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
