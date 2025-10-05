// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AnalysisResult {
  repeticiones: number;
  errores_detectados: Array<{
    timestamp: number;
    error: string;
  }>;
  scores_por_frame: number[];
  duracion_segundos: number;
  score_promedio: number;
}

export interface ExerciseType {
  id: string;
  name: string;
  description: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export class VideoAnalysisAPI {
  static async uploadAndAnalyze(
    file: File, 
    exerciseType: string,
    onProgress?: (progress: number) => void
  ): Promise<{ videoBlob: Blob; stats: AnalysisResult }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('exercise_type', exerciseType);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al analizar el video');
    }

    const data = await response.json();
    
    // Descargar el video procesado
    const videoResponse = await fetch(`${API_BASE_URL}${data.video_path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const videoBlob = await videoResponse.blob();

    return {
      videoBlob,
      stats: data.stats
    };
  }

  static async getExerciseTypes(): Promise<ExerciseType[]> {
    const response = await fetch(`${API_BASE_URL}/api/exercise-types`);
    
    if (!response.ok) {
      // Fallback a tipos por defecto
      return [
        { id: 'sentadilla', name: 'SENTADILLA', description: 'Análisis de sentadillas' },
        { id: 'peso_muerto', name: 'PESO MUERTO', description: 'Análisis de peso muerto' },
        { id: 'press_banca', name: 'PRESS BANCA', description: 'Análisis de press de banca' }
      ];
    }

    return response.json();
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export class AuthAPI {
  static async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access_token);
    return data;
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access_token);
    return data;
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar correo de recuperación');
    }

    return response.json();
  }

  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al restablecer contraseña');
    }

    return response.json();
  }

  static async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No hay sesión activa');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      localStorage.removeItem('auth_token');
      throw new Error('Sesión inválida');
    }

    return response.json();
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
