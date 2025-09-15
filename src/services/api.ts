import { MediaPipeAnalysisAPI } from './mediapipe-analysis';

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
    return MediaPipeAnalysisAPI.processVideoWithMediaPipe(file, exerciseType, onProgress);
  }

  static async getExerciseTypes(): Promise<ExerciseType[]> {
    return MediaPipeAnalysisAPI.getExerciseTypes();
  }

  static async healthCheck(): Promise<boolean> {
    return true; // MediaPipe siempre está disponible en el navegador
  }
}