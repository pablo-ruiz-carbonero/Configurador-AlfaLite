interface Props {
  filters: {
    location: string;
    application: string;
  };
  setFilters: (filters: any) => void;
}

import { useTranslation } from "react-i18next";
import "./css/ProductFilters.css";

function ProductFilters({ filters, setFilters }: Props) {
  const { t } = useTranslation();

  return (
    <div className="filter-group">
      <label>{t("location")}:</label>
      <select
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      >
        <option value="All">{t("all")}</option>
        <option value="Indoor">{t("indoor")}</option>
        <option value="Outdoor">{t("outdoor")}</option>
      </select>

      <label>{t("application")}:</label>
      <select
        value={filters.application}
        onChange={(e) =>
          setFilters({ ...filters, application: e.target.value })
        }
      >
        <option value="All">{t("all")}</option>
        <option value="Rental">{t("rental")}</option>
        <option value="Fixed">{t("fixed")}</option>
        <option value="Broadcast">{t("broadcast")}</option>
      </select>
    </div>
  );
}

export default ProductFilters;
