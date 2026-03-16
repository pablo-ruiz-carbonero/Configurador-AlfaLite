import React from "react";
import type { Product } from "../../types/product";
import { API_BASE_URL } from "../../api/apiClientPublic";

interface Props {
  product: Product;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<Props> = ({
  product,
  onClick,
  onEdit,
  onDelete,
}) => (
  <div className="product-card glass-panel" onClick={onClick}>
    <div className="card-image">
      <img
        src={
          product.image
            ? `${API_BASE_URL}/${product.image}`
            : "https://via.placeholder.com/300x200?text=Alfalite"
        }
        alt={product.name}
      />
    </div>
    <div className="card-info">
      <h3>{product.name}</h3>
    </div>
    <div className="card-actions">
      <button className="btn-icon edit" onClick={onEdit}>
        ✏️
      </button>
      <button className="btn-icon delete" onClick={onDelete}>
        🗑️
      </button>
    </div>
  </div>
);

export default ProductCard;
