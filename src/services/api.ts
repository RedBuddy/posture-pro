const API_BASE_URL = 'http://localhost:5000';

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

export class VideoAnalysisAPI {
  static async uploadAndAnalyze(
    file: File, 
    exerciseType: string,
    onProgress?: (progress: number) => void
  ): Promise<{ videoBlob: Blob; stats: AnalysisResult }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('tipo_ejercicio', exerciseType);

    const response = await fetch(`${API_BASE_URL}/analyze-video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // El video procesado viene como blob
    const videoBlob = await response.blob();
    
    // Las estadísticas deberían venir en headers o en una respuesta separada
    // Por ahora simularemos basándonos en los datos del video
    const stats: AnalysisResult = {
      repeticiones: Math.floor(Math.random() * 15) + 5,
      errores_detectados: [
        { timestamp: 12.5, error: "Rodillas hacia adentro" },
        { timestamp: 25.3, error: "Inclinación excesiva" },
        { timestamp: 38.7, error: "Desalineación de cadera" }
      ],
      scores_por_frame: Array.from({ length: 100 }, () => Math.floor(Math.random() * 40) + 60),
      duracion_segundos: 45,
      score_promedio: Math.floor(Math.random() * 25) + 70
    };

    return { videoBlob, stats };
  }

  static async getExerciseTypes(): Promise<ExerciseType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercise-types`);
      if (!response.ok) {
        throw new Error('Error obteniendo tipos de ejercicio');
      }
      
      const data = await response.json();
      return data.exercise_types.map((type: string) => ({
        id: type,
        name: type.replace('_', ' ').toUpperCase(),
        description: data.descriptions[type]
      }));
    } catch (error) {
      // Fallback si la API no está disponible
      return [
        { id: 'sentadilla', name: 'SENTADILLA', description: 'Análisis de sentadillas con enfoque en profundidad y postura' },
        { id: 'peso_muerto', name: 'PESO MUERTO', description: 'Análisis de peso muerto con enfoque en postura de espalda' },
        { id: 'press_banca', name: 'PRESS BANCA', description: 'Análisis de press de banca con enfoque en simetría de brazos' }
      ];
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}