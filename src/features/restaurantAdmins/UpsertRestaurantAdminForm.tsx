import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateRestaurantAdminMutation,
  useUpdateRestaurantAdminMutation,
  type RestaurantAdmin,
} from "../../reducer/restaurantAdminApi.ts";

interface UpsertRestaurantAdminFormProps {
  onClose?: () => void;
  admin?: RestaurantAdmin | null;
}

interface FormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

export const UpsertRestaurantAdminForm: React.FC<
  UpsertRestaurantAdminFormProps
> = ({ onClose, admin = null }) => {
  const [createRestaurantAdmin, { isLoading: isCreating }] =
    useCreateRestaurantAdminMutation();
  const [updateRestaurantAdmin, { isLoading: isUpdating }] =
    useUpdateRestaurantAdminMutation();

  const isEdit = !!admin;

  const formik = useFormik<FormState>({
    initialValues: {
      username: admin?.username ?? "",
      email: admin?.email ?? "",
      firstName: admin?.firstName ?? "",
      lastName: admin?.lastName ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isEdit && admin) {
          await updateRestaurantAdmin({
            id: admin.keycloakId,
            ...values,
          }).unwrap();
        } else {
          await createRestaurantAdmin(values).unwrap();
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
          aria-label="Close"
        >
          &times;
        </button>

        <h2 style={{ marginTop: 0, marginBottom: 24, fontWeight: 600 }}>
          {isEdit ? "Update Restaurant Admin" : "Add Restaurant Admin"}
        </h2>

        {/* Username */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="username"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={formik.values.username}
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
            disabled={isEdit} // Prevent username change on update
          />
          {formik.touched.username && formik.errors.username && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.username}
            </div>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="email"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formik.values.email}
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
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.email}
            </div>
          )}
        </div>

        {/* First Name */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="firstName"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter first name"
            value={formik.values.firstName}
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
          {formik.touched.firstName && formik.errors.firstName && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.firstName}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="lastName"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter last name"
            value={formik.values.lastName}
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
          {formik.touched.lastName && formik.errors.lastName && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.lastName}
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting || isCreating || isUpdating}
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
            {formik.isSubmitting || isCreating || isUpdating
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
              ? "Update"
              : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
