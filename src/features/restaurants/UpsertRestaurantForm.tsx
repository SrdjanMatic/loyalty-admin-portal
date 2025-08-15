import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGetRestaurantAdminsQuery,
  type RestaurantAdmin,
} from "../../reducer/restaurantAdminApi.ts";
import {
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  type Restaurant,
} from "../../reducer/restaurantsApi.ts";
import { useTranslation } from "react-i18next";

interface UpsertRestaurantFormProps {
  onClose?: () => void;
  restaurant: Restaurant | null;
}

interface FormState {
  name: string;
  address: string;
  phone: string;
  pib: string;
  adminKeycloakId: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone is required"),
  adminKeycloakId: Yup.string().required("Restaurant Admin is required"),
  pib: Yup.string()
    .matches(/^\d{9}$/, "PIB must be exactly 9 digits")
    .required("PIB is required"),
});

export const UpsertRestaurantForm: React.FC<UpsertRestaurantFormProps> = ({
  onClose,
  restaurant = null,
}) => {
  const { t } = useTranslation();
  const [createRestaurant, { isLoading: isCreating }] =
    useCreateRestaurantMutation();
  const [updateRestaurant, { isLoading: isUpdating }] =
    useUpdateRestaurantMutation();

  const {
    data: items = [],
    isLoading: isAdminsLoading,
    isError: isAdminsError,
    error: adminsError,
  } = useGetRestaurantAdminsQuery();

  const isEdit = !!restaurant;

  const formik = useFormik<FormState>({
    initialValues: {
      name: restaurant?.name ?? "",
      address: restaurant?.address ?? "",
      phone: restaurant?.phone ?? "",
      pib: restaurant?.pib ?? "",
      adminKeycloakId: restaurant?.adminKeycloakId ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isEdit && restaurant) {
          await updateRestaurant({
            id: restaurant.id,
            ...values,
          }).unwrap();
        } else {
          await createRestaurant(values).unwrap();
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
          aria-label={t("Close")}
        >
          &times;
        </button>
        <h2 style={{ marginTop: 0, marginBottom: 24, fontWeight: 600 }}>
          {isEdit ? t("Update Restaurant") : t("Add Restaurant")}
        </h2>

        {/* Name Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="name"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("Name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={t("Enter name")}
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
            {t("Address")}
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder={t("Enter address")}
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
            {t("Phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder={t("Enter phone")}
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
            {t("PIB")}
          </label>
          <input
            id="pib"
            name="pib"
            type="text"
            placeholder={t("Enter PIB")}
            value={formik.values.pib}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            maxLength={9}
            disabled={isEdit}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
              background: isEdit ? "#f5f5f5" : undefined,
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
            {t("Restaurant Admin")}
          </label>
          <select
            id="adminKeycloakId"
            name="adminKeycloakId"
            value={formik.values.adminKeycloakId}
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
              {t("Select an admin")}
            </option>
            {items.map((admin: RestaurantAdmin) => (
              <option key={admin.keycloakId} value={admin.keycloakId}>
                {admin.firstName} {admin.lastName}
              </option>
            ))}
          </select>
          {formik.touched.adminKeycloakId && formik.errors.adminKeycloakId && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.adminKeycloakId}
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
            {t("Cancel")}
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

export default UpsertRestaurantForm;
