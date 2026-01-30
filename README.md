# Análisis Inteligente de Ejercicios Físicos

**Autor:** Orlando Armando Apodaca Concha

## Descripción del Proyecto

Esta es una aplicación web moderna desarrollada como trabajo de tesis que utiliza inteligencia artificial y visión por computadora para analizar y mejorar la técnica de ejercicios físicos. La plataforma permite a los usuarios cargar videos de sus entrenamientos y reciben análisis detallados sobre su forma, postura y técnica de ejecución.

### Características Principales

- **Análisis de Video con IA**: Utiliza MediaPipe para detección de poses en tiempo real
- **Detección de Ejercicios**: Análisis especializado para diferentes tipos de ejercicios (sentadillas, flexiones, etc.)
- **Métricas Detalladas**: Proporciona puntuaciones, conteo de repeticiones y detección de errores
- **Recomendaciones Personalizadas**: Genera sugerencias basadas en el análisis de la técnica
- **Prevención de Lesiones**: Identifica problemas posturales antes de que causen daño
- **Autenticación Segura**: Sistema de login y registro con reseteo de contraseña

## Stack Tecnológico

Este proyecto está construido con tecnologías modernas:

- **Frontend Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Componentes UI**: shadcn-ui
- **Estilos**: Tailwind CSS
- **Análisis de Poses**: MediaPipe
- **Enrutamiento**: React Router v6
- **Formularios**: React Hook Form + Zod
- **Estado Global**: TanStack Query + Context API
- **Notificaciones**: Sonner + Toaster
- **Gráficos**: Recharts

## Instalación y Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- npm o pnpm

### Pasos de Instalación

```sh
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/tesis-front.git

# 2. Navegar al directorio del proyecto
cd tesis-front

# 3. Instalar las dependencias
npm install
# o si usas pnpm
pnpm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Compila para producción
npm run build:dev    # Compila en modo desarrollo
npm run lint         # Ejecuta el linter
npm run preview      # Vista previa de la compilación de producción
```

## Estructura del Proyecto

```
src/
├── pages/              # Páginas principales de la aplicación
│   ├── Auth.tsx       # Login y registro
│   ├── VideoUpload.tsx # Carga y análisis de videos
│   ├── Results.tsx    # Resultados del análisis
│   └── Index.tsx      # Página de inicio
├── components/        # Componentes reutilizables
│   ├── ui/           # Componentes UI de shadcn
│   └── ProtectedRoute.tsx
├── contexts/          # Context API para estado global
│   ├── AuthContext.tsx
│   └── AnalysisContext.tsx
├── services/          # Servicios de API
│   └── api.ts
├── hooks/             # Custom React hooks
└── lib/               # Utilidades
```

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:5000
```

En producción:

```
VITE_API_URL=https://tesismediapipe.onrender.com
```

## Flujo de la Aplicación

1. **Página de Inicio**: Presentación de funcionalidades y acceso rápido
2. **Autenticación**: Login/Registro de usuarios
3. **Carga de Video**: Selección del tipo de ejercicio y carga del archivo de video
4. **Análisis**: Procesamiento mediante MediaPipe y envío al backend
5. **Resultados**: Visualización de métricas, errores detectados y recomendaciones

## Desarrollo

### Validación de Código

El proyecto utiliza ESLint para mantener la calidad del código:

```bash
npm run lint
```

### Construcción de Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Deployment

La aplicación está configurada para despliegue en Netlify. El archivo `netlify.toml` contiene la configuración necesaria.

## Licencia

Este proyecto es parte de un trabajo de tesis académica.

## Contacto

Para consultas o sugerencias sobre este proyecto, contactar al autor:

**Orlando Armando Apodaca Concha**
