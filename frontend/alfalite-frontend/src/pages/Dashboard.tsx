import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import { useProducts } from "../hooks/useProductsWithCRUD";
import type { Product } from "../types/product";

// Componentes Refactorizados
import DashboardNav from "../components/dashboard/DashboardNav";
import ProductCard from "../components/dashboard/ProductCard";
import ProductFormModal from "../components/dashboard/ProductFormModal";
import ProductDetailsModal from "../components/dashboard/ProductDetailModal"; // Crea uno similar si lo necesitas
import ConfirmDeleteModal from "../components/dashboard/ConfirmDeleteModal";

const Dashboard: React.FC = () => {
  const { products, getAll, create, update, remove } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("alfalite_token");
    if (!token) navigate("/admin");
    else getAll();
  }, [navigate, getAll]);

  const handleSave = async (data: Product, isEditing: boolean) => {
    if (isEditing && data.id) await update(data.id, data);
    else await create(data);
    setIsFormOpen(false);
    getAll();
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await remove(productToDelete);
      setProductToDelete(null);
      getAll();
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container dashboard-vertical">
      <DashboardNav
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewProduct={() => {
          setProductToEdit(null);
          setIsFormOpen(true);
        }}
      />

      <div className="cards-grid">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => setSelectedProduct(p)}
            onEdit={(e) => {
              e.stopPropagation();
              setProductToEdit(p);
              setIsFormOpen(true);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              p.id && setProductToDelete(p.id);
            }}
          />
        ))}
      </div>

      {isFormOpen && (
        <ProductFormModal
          initialData={productToEdit}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {productToDelete && (
        <ConfirmDeleteModal
          onCancel={() => setProductToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
