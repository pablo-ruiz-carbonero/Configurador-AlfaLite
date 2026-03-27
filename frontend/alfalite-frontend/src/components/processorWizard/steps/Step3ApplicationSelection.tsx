import { useTranslation } from "react-i18next";

interface Step3Props {
  selectedApplications: string[];
  onApplicationsChange: (apps: string[]) => void;
}

const APPLICATIONS = [
  "Broadcast",
  "Rental",
  "Installation",
  "Gaming",
  "Events",
];

const Step3ApplicationSelection: React.FC<Step3Props> = ({
  selectedApplications,
  onApplicationsChange,
}) => {
  const { t } = useTranslation();

  const toggleApplication = (app: string) => {
    const updated = selectedApplications.includes(app)
      ? selectedApplications.filter((a) => a !== app)
      : [...selectedApplications, app];
    onApplicationsChange(updated);
  };

  return (
    <div className="step-content">
      <h3>{t("selectApplications", "Select Applications")}</h3>
      <p>
        {t("selectOneOrMoreApplications", "Select one or more applications:")}
      </p>

      <div className="applications-grid">
        {APPLICATIONS.map((app) => (
          <label key={app} className="app-checkbox">
            <input
              type="checkbox"
              checked={selectedApplications.includes(app)}
              onChange={() => toggleApplication(app)}
            />
            <span>{app}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Step3ApplicationSelection;
