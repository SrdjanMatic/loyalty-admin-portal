import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetRestaurantsQuery } from "../../reducer/restaurantsApi";
import { useCreateVipRestaurantMutation } from "../../reducer/vipRestaurantsApi";

interface CreateVipRestaurantFormProps {
  onClose?: () => void;
}

interface FormState {
  discount: number | string;
  backgroundImage: string;
  restaurantId: number | "";
}

const validationSchema = Yup.object().shape({
  restaurantId: Yup.number()
    .typeError("Restaurant is required")
    .required("Restaurant is required"),
  discount: Yup.number()
    .typeError("Discount must be a number")
    .required("Discount is required")
    .min(0, "Discount cannot be negative"),
  backgroundImage: Yup.string().required("Background Image URL is required"),
});

export const CreateVipRestaurantForm: React.FC<
  CreateVipRestaurantFormProps
> = ({ onClose }) => {
  const { data: restaurants = [], isLoading: isRestaurantsLoading } =
    useGetRestaurantsQuery();
  const [createVipRestaurant, { isLoading }] = useCreateVipRestaurantMutation();

  const formik = useFormik<FormState>({
    initialValues: {
      discount: "",
      backgroundImage: "",
      restaurantId: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        await createVipRestaurant({
          ...values,
          discount: Number(values.discount),
          restaurantId: Number(values.restaurantId),
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
          Add VIP Restaurant
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
            htmlFor="discount"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            Discount (%)
          </label>
          <input
            id="discount"
            name="discount"
            type="number"
            placeholder="Enter discount"
            value={formik.values.discount}
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
          {formik.touched.discount && formik.errors.discount && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.discount}
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
            disabled={formik.isSubmitting || isLoading}
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
            {formik.isSubmitting || isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
