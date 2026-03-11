import type { Product } from "../hooks/useProducts";

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
  if (products.length === 0) {
    return (
      <div className="placeholder-box">
        No se encontró ningún producto para esos filtros.
      </div>
    );
  }

  return (
    <div className="lista-de-productos">
      {products.map((p) => (
        <div
          key={p.id}
          className={`product-item-card ${
            selectedProduct?.id === p.id ? "active" : ""
          }`}
          onClick={() => onSelectProduct(p)}
        >
          <img
            src={p.image ? `${API_URL}/${p.image}` : "/placeholder-led.webp"}
            alt={p.name}
            style={{ width: "35%" }}
          />

          <div className="item-info">
            <h4>{p.name}</h4>

            <p>
              Resolution {p.horizontal}x{p.vertical}px
            </p>

            <p>Pixel pitch: {p.pixelPitch}mm</p>

            <span className="badge">
              {Array.isArray(p.location) ? p.location.join(", ") : p.location}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
