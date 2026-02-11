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
- **Componentes UI**: shadcn-ui (Radix UI)
- **Estilos**: Tailwind CSS
- **Análisis de Poses**: MediaPipe (Pose Detection)
- **Enrutamiento**: React Router
- **Estado Global**: Context API
- **HTTP Client**: Fetch API nativa
- **Carga de Archivos**: React Dropzone
- **Notificaciones**: Sonner
- **Iconos**: Lucide React

## Instalación y Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- pnpm (recomendado) o npm

### Pasos de Instalación

```sh
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al directorio del proyecto
cd Tesis-Front

# 3. Instalar las dependencias
pnpm install

# 4. Configurar variables de entorno
# Crear .env.development y .env.production según la sección "Variables de Entorno"

# 5. Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

```bash
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Compila para producción
pnpm build:dev    # Compila en modo desarrollo
pnpm lint         # Ejecuta el linter
pnpm preview      # Vista previa de la compilación de producción
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

⚠️ **IMPORTANTE**: Nunca subas archivos `.env` al repositorio. Ya están incluidos en `.gitignore`.

Crea los siguientes archivos según el entorno:

### Desarrollo

Archivo: `.env.development`

```
VITE_API_URL=http://localhost:5000
```

### Producción

Archivo: `.env.production`

```
VITE_API_URL=https://tesismediapipe.onrender.com
```

Vite carga automáticamente el archivo correcto según el modo de compilación.

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
pnpm lint
```

### Construcción de Producción

```bash
pnpm build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Deployment

La aplicación está configurada para despliegue en Netlify. El archivo `netlify.toml` contiene la configuración necesaria.

## Licencia

Este proyecto es parte de un trabajo de tesis académica.

## Contacto

Para consultas o sugerencias sobre este proyecto, contactar al autor:

**Orlando Armando Apodaca Concha**
