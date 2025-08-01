import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGetRestaurantAdminsQuery,
  type RestaurantAdmin,
} from "../../reducer/restaurantAdminApi.ts";
import { useCreateRestaurantMutation } from "../../reducer/restaurantsApi.ts";

interface CreateRestaurantFormProps {
  onClose?: () => void;
}

interface FormState {
  name: string;
  address: string;
  phone: string;
  pib: string;
  restaurantAdmin: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone is required"),
  restaurantAdmin: Yup.string().required("Restaurant Admin is required"),
  pib: Yup.string()
    .matches(/^\d{9}$/, "PIB must be exactly 9 digits")
    .required("PIB is required"),
});

export const CreateRestaurantForm: React.FC<CreateRestaurantFormProps> = ({
  onClose,
}) => {
  const [createRestaurant, { isLoading: isCreating }] =
    useCreateRestaurantMutation();

  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetRestaurantAdminsQuery();

  const formik = useFormik<FormState>({
    initialValues: {
      name: "",
      address: "",
      phone: "",
      pib: "",
      restaurantAdmin: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        await createRestaurant({
          name: values.name,
          address: values.address,
          phone: values.phone,
          pib: values.pib,
          restaurantAdmin: values.restaurantAdmin,
        }).unwrap();
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
          minWidth: 400,
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
          Add Restaurant
        </h2>

        {/* Name Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="name"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name"
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

        {/* Address Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="address"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Enter address"
            value={formik.values.address}
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
          {formik.touched.address && formik.errors.address && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.address}
            </div>
          )}
        </div>

        {/* Phone Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="phone"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Enter phone"
            value={formik.values.phone}
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
          {formik.touched.phone && formik.errors.phone && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.phone}
            </div>
          )}
        </div>

        {/* PIB Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="pib"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            PIB
          </label>
          <input
            id="pib"
            name="pib"
            type="text"
            placeholder="Enter PIB"
            value={formik.values.pib}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            maxLength={9}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
          {formik.touched.pib && formik.errors.pib && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.pib}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="restaurantAdmin"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Restaurant Admin
          </label>
          <select
            id="restaurantAdmin"
            name="restaurantAdmin"
            value={formik.values.restaurantAdmin}
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
          >
            <option value="" disabled>
              Select an admin
            </option>
            {items.map((admin: RestaurantAdmin) => (
              <option key={admin.keycloakId} value={admin.keycloakId}>
                {admin.firstName} {admin.lastName}
              </option>
            ))}
          </select>
          {formik.touched.restaurantAdmin && formik.errors.restaurantAdmin && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.restaurantAdmin}
            </div>
          )}
        </div>

        {/* Buttons */}
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
            disabled={formik.isSubmitting || isCreating}
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
            {formik.isSubmitting || isCreating ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateRestaurantForm;
