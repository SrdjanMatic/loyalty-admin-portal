import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CreateCouponForm } from "./CreateCouponForm.tsx";
import { EditCouponLimit } from "./EditCouponLimit.tsx";
import { useGetCouponsQuery, type Coupon } from "../../reducer/couponsApi.ts";
import {
  useGetCouponLevelQuery,
  useUpdateCouponLimitMutation,
} from "../../reducer/restaurantsApi.ts";

interface TableCellProps {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ children }) => (
  <td style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>
    {children}
  </td>
);

const LEVELS: Array<"STANDARD" | "PREMIUM" | "VIP"> = [
  "STANDARD",
  "PREMIUM",
  "VIP",
];

const LEVEL_LABELS: Record<string, string> = {
  STANDARD: "Standard",
  PREMIUM: "Premium",
  VIP: "VIP",
};

const CouponsTable: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const numericRestaurantId = Number(restaurantId);

  const {
    data: coupons = [],
    isLoading,
    isError,
    error,
  } = useGetCouponsQuery(numericRestaurantId);

  const {
    data: fetchedCouponLevel,
    isLoading: isCouponLevelLoading,
    isError: isCouponLevelError,
    error: couponLevelError,
    refetch: refetchCouponLevel,
  } = useGetCouponLevelQuery(numericRestaurantId);

  const [updateCouponLimit] = useUpdateCouponLimitMutation();

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Group coupons by level
  const couponsByLevel: Record<string, Coupon[]> = {
    STANDARD: [],
    PREMIUM: [],
    VIP: [],
  };

  coupons.forEach((c: Coupon) => {
    if (couponsByLevel[c.level]) {
      couponsByLevel[c.level].push(c);
    }
  });

  // Helper to get limit label for Premium and VIP
  const getLevelLabel = (level: "STANDARD" | "PREMIUM" | "VIP") => {
    if (level === "PREMIUM" && fetchedCouponLevel) {
      return (
        <>
          {LEVEL_LABELS[level]}{" "}
          <span style={{ color: "#888", fontWeight: 400, fontSize: 14 }}>
            (Limit: {fetchedCouponLevel.premiumCouponLimit} tokens)
          </span>
          <button
            style={{
              marginLeft: 12,
              padding: "2px 10px",
              fontSize: 13,
              border: "1px solid #bbb",
              borderRadius: 4,
              background: "#f5f6fa",
              cursor: "pointer",
            }}
            onClick={() => setShowEditForm(true)}
            title="Edit Premium Limit"
          >
            Edit limit
          </button>
        </>
      );
    }
    if (level === "VIP" && fetchedCouponLevel) {
      return (
        <>
          {LEVEL_LABELS[level]}
          <span style={{ color: "#888", fontWeight: 400, fontSize: 14 }}>
            (Limit: {fetchedCouponLevel.vipCouponLimit} tokens)
          </span>
          <button
            style={{
              marginLeft: 12,
              padding: "2px 10px",
              fontSize: 13,
              border: "1px solid #bbb",
              borderRadius: 4,
              background: "#f5f6fa",
              cursor: "pointer",
            }}
            onClick={() => setShowEditForm(true)}
            title="Edit VIP Limit"
          >
            Edit limit
          </button>
        </>
      );
    }
    return LEVEL_LABELS[level];
  };

  const updateCouponLimitHandler = async (values: {
    premiumCouponLimit: number;
    vipCouponLimit: number;
  }) => {
    if (!restaurantId) return;
    await updateCouponLimit({
      restaurantId: numericRestaurantId,
      data: values,
    }).unwrap();
    refetchCouponLevel();
    setShowEditForm(false);
  };

  if (isLoading) return <div style={{ margin: 32 }}>Loading coupons...</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>Error: {String(error)}</div>
    );

  return (
    <div style={{ margin: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Coupons</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            padding: "8px 16px",
            background: "#23272f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Add Coupon
        </button>
        {showForm && (
          <CreateCouponForm
            onClose={() => setShowForm(false)}
            restaurantId={numericRestaurantId}
          />
        )}
        {showEditForm && fetchedCouponLevel && (
          <EditCouponLimit
            initialValues={fetchedCouponLevel}
            onClose={() => setShowEditForm(false)}
            onSubmit={updateCouponLimitHandler}
          />
        )}
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginTop: 24,
        }}
      >
        <thead>
          <tr style={{ background: "#f5f6fa" }}>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>
              Description
            </th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Points</th>
            <th style={{ padding: "12px 16px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {LEVELS.map((level) => (
            <React.Fragment key={level}>
              <tr>
                <td
                  colSpan={4}
                  style={{
                    background: "#f0f2f7",
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "14px 16px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {getLevelLabel(level)}
                </td>
              </tr>
              {couponsByLevel[level].length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ color: "#888", padding: "16px" }}>
                    No {LEVEL_LABELS[level].toLowerCase()} coupons.
                  </td>
                </tr>
              ) : (
                couponsByLevel[level].map((c: Coupon) => (
                  <tr key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>{c.points}</TableCell>
                    <TableCell>
                      <button
                        // onClick={() => handleDeleteCoupon(c.id)}
                        style={{
                          background: "#f44336",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </tr>
                ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponsTable;
