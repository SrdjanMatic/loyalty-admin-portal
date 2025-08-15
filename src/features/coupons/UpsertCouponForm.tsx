import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CouponLevel,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  type Coupon,
} from "../../reducer/couponsApi.ts";
import { useTranslation } from "react-i18next";

interface UpsertCouponFormProps {
  restaurantId: number;
  coupon?: Coupon | null;
  onClose?: () => void;
  onCreated?: () => void;
}

interface FormState {
  name: string;
  description: string;
  points: number;
  restaurantId: number;
  level: CouponLevel;
}

export const UpsertCouponForm: React.FC<UpsertCouponFormProps> = ({
  restaurantId,
  coupon = null,
  onClose,
  onCreated,
}) => {
  const { t } = useTranslation();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const isEdit = !!coupon;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("Coupon name is required")),
    description: Yup.string().required(t("Coupon description is required")),
    points: Yup.number()
      .typeError(t("Points must be a number"))
      .integer(t("Points must be an integer"))
      .min(1, t("Points must be at least 1"))
      .required(t("Points are required")),
    level: Yup.string()
      .oneOf(["STANDARD", "PREMIUM", "VIP"], t("Level is required"))
      .required(t("Level is required")),
  });

  const formik = useFormik<FormState>({
    initialValues: {
      name: coupon?.name ?? "",
      description: coupon?.description ?? "",
      points: coupon?.points ?? 0,
      restaurantId: coupon?.restaurantId ?? restaurantId,
      level: coupon?.level ?? CouponLevel.STANDARD,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isEdit && coupon) {
          await updateCoupon({ id: coupon.id, ...values }).unwrap();
        } else {
          await createCoupon(values).unwrap();
        }
        resetForm();
        if (onClose) onClose();
        if (onCreated) onCreated();
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
          {isEdit ? t("Update Coupon") : t("Add Coupon")}
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

        {/* Description Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="description"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("Description")}
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder={t("Enter description")}
            value={formik.values.description}
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
          {formik.touched.description && formik.errors.description && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* Points Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="points"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("Points")}
          </label>
          <input
            id="points"
            name="points"
            type="number"
            placeholder={t("Enter points")}
            value={formik.values.points}
            onChange={(e) => {
              const val = e.target.value;
              formik.setFieldValue(
                "points",
                val === "" ? 0 : parseInt(val, 10)
              );
            }}
            onBlur={formik.handleBlur}
            min={0}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
          {formik.touched.points && formik.errors.points && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.points}
            </div>
          )}
        </div>

        {/* Level Field */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="level"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("Level")}
          </label>
          <select
            id="level"
            name="level"
            value={formik.values.level}
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
            <option value="STANDARD">{t("Standard")}</option>
            <option value="PREMIUM">{t("Premium")}</option>
            <option value="VIP">{t("VIP")}</option>
          </select>
          {formik.touched.level && formik.errors.level && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.level}
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
