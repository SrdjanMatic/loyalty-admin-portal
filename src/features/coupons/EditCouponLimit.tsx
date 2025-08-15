import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

export interface RestaurantCouponLevelView {
  premiumCouponLimit: number;
  vipCouponLimit: number;
}

interface EditCouponLimitProps {
  initialValues: RestaurantCouponLevelView;
  onClose?: () => void;
  onSubmit: (values: RestaurantCouponLevelView) => Promise<void> | void;
}

export const EditCouponLimit: React.FC<EditCouponLimitProps> = ({
  initialValues,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    premiumCouponLimit: Yup.number()
      .typeError(t("Must be a number"))
      .integer(t("Must be an integer"))
      .min(0, t("Must be at least 0"))
      .required(t("Required")),
    vipCouponLimit: Yup.number()
      .typeError(t("Must be a number"))
      .integer(t("Must be an integer"))
      .min(0, t("Must be at least 0"))
      .required(t("Required")),
  });

  const formik = useFormik<RestaurantCouponLevelView>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await onSubmit(values);
      setSubmitting(false);
      if (onClose) onClose();
    },
    enableReinitialize: true,
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
          {t("Edit Coupon Limits")}
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="premiumCouponLimit"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("Premium Coupon Limit")}
          </label>
          <input
            id="premiumCouponLimit"
            name="premiumCouponLimit"
            type="number"
            value={formik.values.premiumCouponLimit}
            onChange={formik.handleChange}
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
          {formik.touched.premiumCouponLimit &&
            formik.errors.premiumCouponLimit && (
              <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
                {formik.errors.premiumCouponLimit}
              </div>
            )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="vipCouponLimit"
            style={{ display: "block", fontWeight: 500, marginBottom: 6 }}
          >
            {t("VIP Coupon Limit")}
          </label>
          <input
            id="vipCouponLimit"
            name="vipCouponLimit"
            type="number"
            value={formik.values.vipCouponLimit}
            onChange={formik.handleChange}
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
          {formik.touched.vipCouponLimit && formik.errors.vipCouponLimit && (
            <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
              {formik.errors.vipCouponLimit}
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
            {formik.isSubmitting ? t("Saving...") : t("Save")}
          </button>
        </div>
      </form>
    </div>
  );
};
