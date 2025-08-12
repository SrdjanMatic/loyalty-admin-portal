import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetRestaurantsQuery } from "../../reducer/restaurantsApi";
import {
  useCreateVipRestaurantMutation,
  useUpdateVipRestaurantMutation,
  VipRestaurant,
} from "../../reducer/vipRestaurantsApi";

interface UpsertVipRestaurantFormProps {
  onClose?: () => void;
  vipRestaurant?: VipRestaurant | null; // Replace 'any' with your VipRestaurant type if available
}

interface FormState {
  restaurantId: number | "";
  backgroundImage: string;
  discountType: "general" | "perLevel";
  discount: number | "";
  standardDiscount: number | "";
  vipDiscount: number | "";
  premiumDiscount: number | "";
}

const validationSchema = Yup.object().shape({
  restaurantId: Yup.number()
    .typeError("Restaurant is required")
    .required("Restaurant is required"),
  backgroundImage: Yup.string().required("Background Image URL is required"),
  discountType: Yup.string().oneOf(["general", "perLevel"]).required(),
  discount: Yup.number().when("discountType", {
    is: "general",
    then: (schema) =>
      schema
        .typeError("Discount must be a number")
        .required("Discount is required")
        .min(0, "Discount cannot be negative"),
    otherwise: (schema) => schema.notRequired(),
  }),
  standardDiscount: Yup.number().when("discountType", {
    is: "perLevel",
    then: (schema) =>
      schema
        .typeError("Standard Discount must be a number")
        .required("Standard Discount is required")
        .min(0, "Discount cannot be negative"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vipDiscount: Yup.number().when("discountType", {
    is: "perLevel",
    then: (schema) =>
      schema
        .typeError("VIP Discount must be a number")
        .required("VIP Discount is required")
        .min(0, "Discount cannot be negative"),
    otherwise: (schema) => schema.notRequired(),
  }),
  premiumDiscount: Yup.number().when("discountType", {
    is: "perLevel",
    then: (schema) =>
      schema
        .typeError("Premium Discount must be a number")
        .required("Premium Discount is required")
        .min(0, "Discount cannot be negative"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const UpsertVipRestaurantForm: React.FC<
  UpsertVipRestaurantFormProps
> = ({ onClose, vipRestaurant = null }) => {
  const { data: restaurants = [], isLoading: isRestaurantsLoading } =
    useGetRestaurantsQuery();
  const [createVipRestaurant, { isLoading: isCreating }] =
    useCreateVipRestaurantMutation();
  const [updateVipRestaurant, { isLoading: isUpdating }] =
    useUpdateVipRestaurantMutation();

  const isEdit = !!vipRestaurant;

  let initialDiscountType: "general" | "perLevel" = "general";
  if (vipRestaurant) {
    if (
      vipRestaurant.levelDiscounts?.STANDARD !== undefined ||
      vipRestaurant.levelDiscounts?.VIP !== undefined ||
      vipRestaurant.levelDiscounts?.PREMIUM !== undefined
    ) {
      initialDiscountType = "perLevel";
    }
  }

  const formik = useFormik<FormState>({
    initialValues: {
      restaurantId: vipRestaurant?.restaurant.id ?? "",
      backgroundImage: vipRestaurant?.backgroundImage ?? "",
      discountType: initialDiscountType,
      discount: vipRestaurant?.generalDiscount ?? "",
      standardDiscount: vipRestaurant?.levelDiscounts?.STANDARD ?? "",
      vipDiscount: vipRestaurant?.levelDiscounts?.VIP ?? "",
      premiumDiscount: vipRestaurant?.levelDiscounts?.PREMIUM ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        const payload: any = {
          restaurantId: Number(values.restaurantId),
          backgroundImage: values.backgroundImage,
        };
        if (values.discountType === "general") {
          payload.discount = Number(values.discount);
        } else {
          payload.standardDiscount = Number(values.standardDiscount);
          payload.vipDiscount = Number(values.vipDiscount);
          payload.premiumDiscount = Number(values.premiumDiscount);
        }
        if (isEdit && vipRestaurant) {
          await updateVipRestaurant({
            id: vipRestaurant.id,
            ...payload,
          }).unwrap();
        } else {
          await createVipRestaurant(payload).unwrap();
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
          maxWidth: "95vw",
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
          {isEdit ? "Update VIP Restaurant" : "Add VIP Restaurant"}
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="restaurantId"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Restaurant
          </label>
          <select
            id="restaurantId"
            name="restaurantId"
            value={formik.values.restaurantId}
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
            disabled={isRestaurantsLoading}
          >
            <option value="">Select Restaurant</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {formik.touched.restaurantId && formik.errors.restaurantId && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.restaurantId}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="backgroundImage"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Background Image URL
          </label>
          <input
            id="backgroundImage"
            name="backgroundImage"
            type="text"
            placeholder="Enter image URL"
            value={formik.values.backgroundImage}
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
          {formik.touched.backgroundImage && formik.errors.backgroundImage && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.backgroundImage}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
          {/* General Discount */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: 500,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={formik.values.discountType === "general"}
                onChange={() => {
                  formik.setFieldValue("discountType", "general");
                  formik.setFieldValue("discount", "");
                  formik.setFieldValue("standardDiscount", "");
                  formik.setFieldValue("vipDiscount", "");
                  formik.setFieldValue("premiumDiscount", "");
                }}
                style={{ marginRight: 8 }}
              />
              General Discount
            </label>
            <input
              id="discount"
              name="discount"
              type="number"
              placeholder="Enter discount"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.values.discountType !== "general"}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 14,
                boxSizing: "border-box",
                background:
                  formik.values.discountType !== "general"
                    ? "#f5f5f5"
                    : undefined,
              }}
            />
            {formik.values.discountType === "general" &&
              formik.touched.discount &&
              formik.errors.discount && (
                <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
                  {formik.errors.discount}
                </div>
              )}
          </div>

          {/* Discount Per Level */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: 500,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={formik.values.discountType === "perLevel"}
                onChange={() => {
                  formik.setFieldValue("discountType", "perLevel");
                  formik.setFieldValue("discount", "");
                  formik.setFieldValue("standardDiscount", "");
                  formik.setFieldValue("vipDiscount", "");
                  formik.setFieldValue("premiumDiscount", "");
                }}
                style={{ marginRight: 8 }}
              />
              Discount Per Level
            </label>
            <input
              id="standardDiscount"
              name="standardDiscount"
              type="number"
              placeholder="Standard"
              value={formik.values.standardDiscount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.values.discountType !== "perLevel"}
              style={{
                width: "100%",
                marginBottom: 8,
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 14,
                boxSizing: "border-box",
                background:
                  formik.values.discountType !== "perLevel"
                    ? "#f5f5f5"
                    : undefined,
              }}
            />
            <input
              id="vipDiscount"
              name="vipDiscount"
              type="number"
              placeholder="VIP"
              value={formik.values.vipDiscount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.values.discountType !== "perLevel"}
              style={{
                width: "100%",
                marginBottom: 8,
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 14,
                boxSizing: "border-box",
                background:
                  formik.values.discountType !== "perLevel"
                    ? "#f5f5f5"
                    : undefined,
              }}
            />
            <input
              id="premiumDiscount"
              name="premiumDiscount"
              type="number"
              placeholder="Premium"
              value={formik.values.premiumDiscount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={formik.values.discountType !== "perLevel"}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ccc",
                borderRadius: 4,
                fontSize: 14,
                boxSizing: "border-box",
                background:
                  formik.values.discountType !== "perLevel"
                    ? "#f5f5f5"
                    : undefined,
              }}
            />
            {formik.values.discountType === "perLevel" && (
              <>
                {formik.touched.standardDiscount &&
                  formik.errors.standardDiscount && (
                    <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
                      {formik.errors.standardDiscount}
                    </div>
                  )}
                {formik.touched.vipDiscount && formik.errors.vipDiscount && (
                  <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
                    {formik.errors.vipDiscount}
                  </div>
                )}
                {formik.touched.premiumDiscount &&
                  formik.errors.premiumDiscount && (
                    <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
                      {formik.errors.premiumDiscount}
                    </div>
                  )}
              </>
            )}
          </div>
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
