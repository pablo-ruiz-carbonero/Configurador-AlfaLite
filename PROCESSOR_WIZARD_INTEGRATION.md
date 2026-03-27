# Processor Wizard Integration Guide

## Quick Start

### Backend Integration (Already Done)

The ProcessorModule has been automatically registered in `src/app.module.ts`:

```typescript
import { ProcessorModule } from './processor/processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRootAsync({ useClass: WinstonLoggerService }),
    TypeOrmModule.forRootAsync({ ... }),
    AuthModule,
    ApiModule,
    ConfiguratorApiModule,
    ProcessorModule,  // ← Added
  ],
  ...
})
export class AppModule {}
```

### Frontend Integration

#### 1. Add Processor Wizard Button to Your Page

In your component (e.g., `ConfiguratorPage.tsx`):

```tsx
import { useState } from "react";
import { ProcessorWizard } from "@/components/processorWizard";

export default function ConfiguratorPage() {
  const [showWizard, setShowWizard] = useState(false);

  const screenData = {
    width: stats.resH,
    height: stats.resV,
    physicalWidth: stats.widthM,
    physicalHeight: stats.heightM,
    pixelPitch: stats.pixelPitch,
  };

  return (
    <div>
      {/* ... existing content ... */}

      <button onClick={() => setShowWizard(true)} className="btn-wizard">
        🔧 Processor Wizard
      </button>

      {showWizard && (
        <ProcessorWizard
          screenData={screenData}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}
```

#### 2. Import CSS

The CSS is automatically imported in the ProcessorWizard component, but you can also import it globally:

```tsx
// In your main.tsx or App.tsx
import "@/components/processorWizard/css/ProcessorWizard.css";
```

#### 3. Ensure Translations Are Loaded

The translations have been added to:

- `src/locales/en.json`
- `src/locales/es.json`

They are automatically loaded by your i18n configuration.

## API Configuration

Ensure your `apiClient` is configured correctly:

```typescript
// src/api/apiClient.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token if needed
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Testing the Implementation

### Backend Testing

1. **Start the backend**

```bash
cd backend/alfalite-backend
npm run start
```

2. **Test the calculate endpoint**

```bash
curl -X POST http://localhost:3000/api/processor/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "screenData": {
      "width": 1920,
      "height": 1080,
      "physicalWidth": 10,
      "physicalHeight": 5,
      "pixelPitch": 6.25
    },
    "selectedBrand": "NovaStar",
    "selectedApplications": ["Broadcast"],
    "selectedMainInputType": "HDMI",
    "selectedAuxiliaryInputs": {},
    "selectedOutputType": "RJ45",
    "selectedAuxiliaryOutputs": {}
  }'
```

### Frontend Testing

1. **Start the frontend**

```bash
cd frontend/alfalite-frontend
npm run dev
```

2. **Open in browser**
   - Navigate to http://localhost:5173
   - Configure a screen
   - Click "Processor Wizard" button
   - Step through the wizard
   - Request a quote or send email

## Component Integration Example

Here's how to integrate the wizard into different pages:

### ConfiguratorPage Integration

```tsx
import { ProcessorWizard } from "@/components/processorWizard";
import { useTranslation } from "react-i18next";

export default function ConfiguratorPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  return (
    <div className="configurator">
      {/* ... existing content ... */}

      <div className="action-buttons">
        <button onClick={() => setShowWizard(true)}>
          {t("processorWizard", "Processor Wizard")}
        </button>
      </div>

      {showWizard && stats && (
        <ProcessorWizard
          screenData={{
            width: stats.resH,
            height: stats.resV,
            physicalWidth: stats.widthM,
            physicalHeight: stats.heightM,
          }}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}
```

### Dashboard Integration

```tsx
import { ProcessorWizard } from "@/components/processorWizard";

export default function Dashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleOpenWizard = (product: Product) => {
    setSelectedProduct(product);
    setShowWizard(true);
  };

  return (
    <div className="dashboard">
      {/* ... product list ... */}

      <button onClick={() => handleOpenWizard(product)}>
        Configure Processor
      </button>

      {showWizard && selectedProduct && (
        <ProcessorWizard
          screenData={{
            width: selectedProduct.resH,
            height: selectedProduct.resV,
            physicalWidth: selectedProduct.width,
            physicalHeight: selectedProduct.height,
          }}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}
```

## Customization

### Change Mock Data

Edit `src/processor/services/mock-data.ts` to add your own:

```typescript
export const CUSTOM_PROCESSORS = [
  {
    id: "custom-processor-1",
    name: "My Processor",
    brand: "NovaStar",
    model: "Custom",
    maxPixels: 5000000,
    cost: 15000,
    // ... other properties
  },
];
```

### Add More Processor Brands

1. Update the brand union type:

```typescript
type ProcessorBrand = "NovaStar" | "Brompton" | "MyBrand";
```

2. Add corresponding DTOs and services

3. Update the localeMap in ProcessorWizard:

```typescript
const localeMap: Record<string, string> = {
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR", // Add new language
};
```

### Styling Customization

Edit `src/components/processorWizard/css/ProcessorWizard.css`:

```css
/* Change primary color */
.processor-wizard-modal {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from "react";

const ProcessorWizard = lazy(() =>
  import("@/components/processorWizard").then((m) => ({
    default: m.ProcessorWizard,
  })),
);

// Usage
{
  showWizard && (
    <Suspense fallback={<div>Loading Wizard...</div>}>
      <ProcessorWizard {...props} />
    </Suspense>
  );
}
```

### Memoization

```tsx
import { memo } from "react";

const Step1 = memo(Step1ScreenConfirmation);
const Step2 = memo(Step2BrandSelection);
// ... etc
```

## Troubleshooting

### API Not Found

- Ensure backend is running: `npm run start` in backend folder
- Check VITE_API_URL in `.env`
- Verify ProcessorModule is imported in app.module.ts

### Styles Not Applied

- Check CSS file import in ProcessorWizard.tsx
- Verify CSS module names match
- Clear browser cache

### Email Not Sending

- Email service is stubbed in mock implementation
- Implement actual email sending in EmailClientService
- Verify SMTP/email provider configuration

### Translations Missing

- Add keys to `src/locales/en.json` and `src/locales/es.json`
- Restart development server
- Clear browser cache

## Next Steps

1. **Add Email Service Integration**
   - Implement real email sending (nodemailer, SendGrid, etc.)
   - Add email templates

2. **Database Integration**
   - Create ProcessorConfiguration entity
   - Store user solutions for history

3. **Advanced Features**
   - PDF export functionality
   - Solution comparison
   - Bulk pricing

4. **Analytics**
   - Track wizard usage
   - Monitor recommended solutions
   - A/B testing

---

For more details, see [PROCESSOR_WIZARD_IMPLEMENTATION.md](PROCESSOR_WIZARD_IMPLEMENTATION.md)
