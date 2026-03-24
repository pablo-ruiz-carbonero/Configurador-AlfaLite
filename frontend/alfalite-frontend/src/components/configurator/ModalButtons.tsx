import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Stats } from "../../utils/calculateStats";
import type { Product } from "../../types/product";
import "./css/ModalButtons.css";
import "./css/Modal.css";

export type ModalAction = "pdf" | "quote" | null;

interface ModalButtonsProps {
  actionType: ModalAction;
  selectedProduct: Product | null;
  stats: Stats | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function ModalButtons({
  actionType,
  selectedProduct,
  onSubmit,
  onClose,
}: ModalButtonsProps) {
  const { t } = useTranslation();

  const formFields = [
    { name: "firstName", label: t("firstName"), type: "text" },
    { name: "lastName", label: t("lastName"), type: "text" },
    { name: "email", label: t("email"), type: "email" },
    { name: "phone", label: t("phone"), type: "text" },
    { name: "company", label: t("company"), type: "text" },
    { name: "project", label: t("project"), type: "text" },
  ];

  const [formData, setFormData] = useState(
    Object.fromEntries(formFields.map((f) => [f.name, ""])),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const title =
    actionType === "pdf" ? t("modalTitlePDF") : t("modalTitleQuote");
  const btnText = actionType === "pdf" ? t("generatePdf") : t("sendRequest");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>
        <p className="modal-subtitle">
          {t("modalInstructions", { product: selectedProduct?.name || "" })}
        </p>

        <form className="modal-form">
          <div className="form-grid">
            {formFields.map((f) => (
              <label key={f.name}>
                {f.label}:
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  required
                />
              </label>
            ))}
          </div>

          <label>
            {t("assembly")}:
            <select
              name="assembly"
              value={formData.assembly || ""}
              onChange={handleChange}
            >
              <option value="">{t("selectAssembly")}</option>
              <option value="indoor">{t("indoor")}</option>
              <option value="outdoor">{t("outdoor")}</option>
            </select>
          </label>
        </form>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            {t("cancel")}
          </button>
          <button
            type="button"
            className="btn-confirm"
            onClick={() => onSubmit(formData)}
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}
