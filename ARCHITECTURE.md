# Elosa Project Architecture

## 🏗 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │  Components  │  │    State Mgmt       │ │
│  │             │  │              │  │                     │ │
│  │ • Home      │  │ • Common     │  │ • Zustand Stores    │ │
│  │ • Products  │  │ • UI         │  │ • Auth Store        │ │
│  │ • Shops     │  │ • Layout     │  │ • Cart Store        │ │
│  │ • Admin     │  │ • Reviews    │  │ • Product Store     │ │
│  │ • Account   │  │              │  │ • Shop Store        │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  Services   │  │   Hooks      │  │     Utils           │ │
│  │             │  │              │  │                     │ │
│  │ • API       │  │ • useAuth    │  │ • Formatters        │ │
│  │ • Auth      │  │ • useCart    │  │ • Validators        │ │
│  │ • Cart      │  │ • useToast   │  │ • Constants         │ │
│  │ • Products  │  │ • useMobile  │  │ • Types             │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND SERVICES                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  API        │  │  Database    │  │    External         │ │
│  │  Gateway    │  │              │  │    Services         │ │
│  │             │  │ • Products   │  │                     │ │
│  │ • Auth      │  │ • Users      │  │ • Payment           │ │
│  │ • Products  │  │ • Orders     │  │ • Shipping          │ │
│  │ • Orders    │  │ • Reviews    │  │ • Email             │ │
│  │ • Reviews   │  │ • Shops      │  │ • Analytics         │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Business logic components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ElosaBrand.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ProductList.tsx
│   │   └── ...
│   ├── ui/             # Base design system components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/         # Layout components
│   │   ├── AppLayout.tsx
│   │   └── ...
│   └── reviews/        # Feature-specific components
│       ├── ReviewForm.tsx
│       └── ReviewList.tsx
├── pages/              # Route/page components
│   ├── Index.tsx       # Home page
│   ├── Marketplace.tsx # Product listing
│   ├── ProductDetail.tsx
│   ├── ShopDetail.tsx
│   ├── AdminDashboard.tsx
│   └── ...
├── stores/             # Zustand state management
│   ├── authStore.ts    # Authentication state
│   ├── cartStore.ts    # Shopping cart state
│   ├── productStore.ts # Product management
│   ├── shopStore.ts    # Shop management
│   └── ...
├── services/           # API and external services
│   ├── apiService.ts   # Base API configuration
│   ├── authService.ts  # Authentication API
│   ├── productService.ts
│   ├── orderService.ts
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useCart.ts      # Cart operations
│   ├── useToast.ts     # Notification system
│   └── ...
├── lib/                # Utility functions
│   ├── utils.ts        # General utilities
│   ├── validators.ts   # Form validation
│   ├── formatters.ts   # Data formatting
│   └── constants.ts    # App constants
├── types/              # TypeScript definitions
│   ├── api.ts          # API response types
│   ├── user.ts         # User-related types
│   ├── product.ts      # Product types
│   └── ...
└── assets/             # Static assets
    ├── images/
    ├── icons/
    └── ...
```

## 🎨 Design System Architecture

### Color System
```typescript
// Primary: Elosa Golden Yellow
--primary: 45 100% 55%

// Secondary: Elosa Forest Green  
--secondary: 140 80% 35%

// Semantic Colors
--success: Forest Green variants
--warning: Golden Yellow variants
--destructive: Red variants
```

### Component Hierarchy
```
UI Components (ui/)
├── Primitive Components (button, input, card)
├── Composite Components (dropdown, dialog)
└── Layout Components (container, grid)

Common Components (common/)
├── Business Logic Components
├── Feature Components
└── Layout Components

Page Components (pages/)
├── Route Components
└── Page-specific Logic
```

## 🔄 State Management

### Store Architecture
```typescript
// Auth Store - User authentication state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}

// Cart Store - Shopping cart state
interface CartState {
  items: CartItem[];
  total: number;
  addItem: (product) => void;
  removeItem: (id) => void;
  updateQuantity: (id, quantity) => void;
}

// Product Store - Product management
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  fetchProducts: (filters?) => Promise<void>;
}
```

## 🌐 API Architecture

### Service Layer Pattern
```typescript
// Base API service
class ApiService {
  private baseURL: string;
  private authToken?: string;
  
  async request<T>(config: RequestConfig): Promise<ApiResponse<T>>;
}

// Feature-specific services
class ProductService extends ApiService {
  async getProducts(filters?: ProductFilters): Promise<Product[]>;
  async getProduct(id: string): Promise<Product>;
  async createProduct(data: ProductData): Promise<Product>;
}
```

## 🔐 Security Architecture

### Authentication Flow
```
User Login Request
    ↓
API Authentication
    ↓
JWT Token Generation
    ↓
Store in Auth State
    ↓
Attach to API Requests
    ↓
Role-based Route Protection
```

### Permission System
```typescript
// Role-based permissions
type UserRole = 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN';

// Route protection
<ProtectedRoute roles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>
```

## 📱 Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
.container {
  /* Mobile: 320px+ */
  padding: 1rem;
  
  /* Tablet: 768px+ */
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    padding: 3rem;
  }
}
```

### Component Adaptivity
- Mobile: Stack layout, touch-optimized
- Tablet: Hybrid layout, adaptive navigation
- Desktop: Multi-column, hover states

## ⚡ Performance Optimizations

### Code Splitting
```typescript
// Route-based splitting
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
```

### Asset Optimization
- Image lazy loading
- Bundle size optimization
- CSS purging
- Tree shaking

## 🧪 Testing Strategy

### Testing Pyramid
```
E2E Tests (Cypress)
    ↑
Integration Tests (React Testing Library)
    ↑
Unit Tests (Jest + React Testing Library)
```

### Test Organization
```
src/
├── components/
│   └── __tests__/
├── pages/
│   └── __tests__/
├── services/
│   └── __tests__/
└── utils/
    └── __tests__/
```

## 🚀 Deployment Architecture

### Build Process
```
Source Code
    ↓
TypeScript Compilation
    ↓
Bundle Optimization (Vite)
    ↓
Asset Processing
    ↓
Production Build
    ↓
CDN Deployment
```

### Environment Configuration
- Development: Local dev server
- Staging: Preview environment
- Production: Optimized build

## 📈 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Error boundary reporting
- User interaction analytics
- API performance metrics

### Error Handling
```typescript
// Global error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>

// API error handling
try {
  const data = await api.fetchProducts();
} catch (error) {
  toast.error('Failed to load products');
  logger.error('API Error:', error);
}
```

---

This architecture provides a scalable, maintainable foundation for the Elosa marketplace platform, emphasizing modularity, performance, and user experience.