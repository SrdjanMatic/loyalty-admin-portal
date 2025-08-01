import React from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useCreateNotificationMutation } from "../../reducer/notificationApi";

const foodOptions = [
  "Pizza",
  "Pasta",
  "Burgers",
  "Sushi",
  "Steaks",
  "Seafood",
  "Desserts",
  "Salads",
  "Soups",
  "BBQ",
  "Vegan",
  "Tacos",
  "Asian",
  "Coffee",
  "Wine",
  "Juice",
];

const partsOfDayOptions = ["Breakfast", "Lunch", "Dinner", "All Day"];

const validationSchema = Yup.object().shape({
  foodType: Yup.string().required("Part of Day is required"),
  partOfDay: Yup.string().required("Part of Day is required"),
  validFrom: Yup.string().required("Valid From date is required"),
});

export const CreateNotificationForm: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const dispatch = useDispatch<any>();
  const { restaurantId } = useParams();

  const [createNotification, { isLoading }] = useCreateNotificationMutation();

  const formik = useFormik({
    initialValues: {
      foodType: "",
      partOfDay: "",
      duration: "Day",
      title: "",
      validFrom: new Date().toISOString().slice(0, 10), // Today by default
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        await createNotification({
          restaurantId: Number(restaurantId),
          foodType: values.foodType,
          partOfDay: values.partOfDay,
          validFrom: values.validFrom,
          validUntil: values.validFrom,
          title: values.title,
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
        inset: 0,
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
          boxShadow: "0 6px 30px rgba(0,0,0,0.15)",
          position: "relative",
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
          Create Notification
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500 }}>Title</label>
          <input
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Title"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          {formik.touched.title && formik.errors.title && (
            <div style={{ color: "red", fontSize: 12, marginTop: 6 }}>
              {formik.errors.title}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500 }}>Food Type</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            {foodOptions.map((food) => (
              <label
                key={food}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                }}
              >
                <input
                  type="radio"
                  name="foodType"
                  value={food}
                  checked={formik.values.foodType === food}
                  onChange={formik.handleChange}
                />
                {food}
              </label>
            ))}
          </div>
          {formik.touched.foodType && formik.errors.foodType && (
            <div style={{ color: "red", fontSize: 12, marginTop: 6 }}>
              {formik.errors.foodType}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500 }}>Part of Day</label>
          <select
            name="partOfDay"
            value={formik.values.partOfDay}
            onChange={formik.handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            <option value="">Select part of day</option>
            {partsOfDayOptions.map((part) => (
              <option key={part} value={part}>
                {part}
              </option>
            ))}
          </select>
          {formik.touched.partOfDay && formik.errors.partOfDay && (
            <div style={{ color: "red", fontSize: 12, marginTop: 6 }}>
              {formik.errors.partOfDay}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500 }}>Valid From</label>
          <input
            type="date"
            name="validFrom"
            value={formik.values.validFrom}
            onChange={formik.handleChange}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          {formik.touched.validFrom && formik.errors.validFrom && (
            <div style={{ color: "red", fontSize: 12, marginTop: 6 }}>
              {formik.errors.validFrom}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 500 }}>Duration</label>
          <select
            name="duration"
            disabled
            value="Day"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              backgroundColor: "#f9f9f9",
              cursor: "not-allowed",
            }}
          >
            <option value="Day">Day</option>
          </select>
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
            {formik.isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
