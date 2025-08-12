import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { UpsertCouponForm } from "./UpsertCouponForm.tsx";
import { EditCouponLimit } from "./EditCouponLimit.tsx";
import {
  useGetCouponsQuery,
  type Coupon,
  useDeleteCouponMutation,
} from "../../reducer/couponsApi.ts";
import {
  useGetCouponLevelQuery,
  useUpdateCouponLimitMutation,
} from "../../reducer/restaurantsApi.ts";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // For 3-dots menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCouponId, setMenuCouponId] = useState<number | null>(null);

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

  // Handlers for 3-dots menu
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    coupon: Coupon
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCouponId(coupon.id);
    setSelectedCoupon(coupon);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCouponId(null);
    setSelectedCoupon(null);
  };

  const handleUpdate = useCallback(() => {
    setShowForm(true);
    setAnchorEl(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedCoupon) return;
    await deleteCoupon({
      id: selectedCoupon.id,
      restaurantId: selectedCoupon.restaurantId,
    }).unwrap();
    setAnchorEl(null);
    setSelectedCoupon(null);
  }, [deleteCoupon, selectedCoupon]);

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
          <UpsertCouponForm
            onClose={() => setShowForm(false)}
            restaurantId={numericRestaurantId}
            coupon={selectedCoupon && showForm ? selectedCoupon : undefined}
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
                        aria-label="More actions"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onClick={(e) => handleMenuOpen(e, c)}
                      >
                        <MoreVertIcon />
                      </button>
                      {menuCouponId === c.id && (
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              setShowForm(true);
                              setAnchorEl(null);
                            }}
                            aria-label="Update Coupon"
                          >
                            Update
                          </MenuItem>
                          <MenuItem
                            onClick={handleDelete}
                            aria-label="Delete Coupon"
                            sx={{ color: "#f44336" }}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </MenuItem>
                        </Menu>
                      )}
                    </TableCell>
                  </tr>
                ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* UpsertCouponForm for update */}
      {showForm && selectedCoupon && (
        <UpsertCouponForm
          onClose={() => {
            setShowForm(false);
            setSelectedCoupon(null);
          }}
          restaurantId={numericRestaurantId}
          coupon={selectedCoupon}
        />
      )}
    </div>
  );
};

export default CouponsTable;
