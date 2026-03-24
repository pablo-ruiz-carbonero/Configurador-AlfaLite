import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo_horizontal_peq.webp";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewProduct: () => void;
}

const DashboardNav: React.FC<Props> = ({
  searchTerm,
  onSearchChange,
  onNewProduct,
}) => {
  const { t } = useTranslation();

  return (
    <nav className="top-nav glass-panel">
      <div className="logo">
        <img src={logo} alt="Alfalite" />
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button className="btn-icon-new" onClick={onNewProduct}>
        + {t("newProduct")}
      </button>
    </nav>
  );
};

export default DashboardNav;
