import { useState } from "react";
import type { Stats } from "../../utils/calculateStats";
import type { Product } from "../../types/product";

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
  stats,
  onSubmit,
  onClose,
}: ModalButtonsProps) {
  const formFields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
    { name: "company", label: "Company", type: "text" },
    { name: "project", label: "Project Name", type: "text" },
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
    actionType === "pdf" ? "Download PDF Details" : "Request a Quote";
  const btnText = actionType === "pdf" ? "Generate PDF" : "Send Request";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{title}</h2>
        <p className="modal-subtitle">
          Please fill in your details for the{" "}
          <strong>{selectedProduct?.name}</strong> configuration.
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
            Assembly:
            <select
              name="assembly"
              value={formData.assembly || ""}
              onChange={handleChange}
            >
              <option value="">Select Assembly</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </label>
        </form>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
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
