import { useTranslation } from "react-i18next";
import type { Product } from "../../types/product";

interface ProductListProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

function ProductList({
  products,
  selectedProduct,
  onSelectProduct,
}: ProductListProps) {
  const { t } = useTranslation();
  if (products.length === 0) {
    return <div className="cfg-placeholder">{t("NotFoundProductFilter")}</div>;
  }

  return (
    <div className="lista-de-productos">
      {products.map((p) => (
        <div
          key={p.id}
          className={`product-item-card ${selectedProduct?.id === p.id ? "active" : ""}`}
          onClick={() => onSelectProduct(p)}
        >
          <img
            src={p.image ? `${API_URL}/${p.image}` : "/placeholder-led.webp"}
            alt={p.name}
          />
          <div className="item-info">
            <h4>{p.name}</h4>
            <span>
              Location:{" "}
              {Array.isArray(p.location) ? p.location.join(", ") : p.location}
            </span>
            <span>
              Resolution: {p.horizontal} x {p.vertical}
            </span>
            <span>Pixel pitch: {p.pixelPitch}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
