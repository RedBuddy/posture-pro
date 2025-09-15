import { ExerciseAnalysis } from '@/hooks/useMediaPipe';

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

export class MediaPipeAnalysisAPI {
  static getExerciseTypes(): ExerciseType[] {
    return [
      { 
        id: 'sentadilla', 
        name: 'SENTADILLA', 
        description: 'Análisis de sentadillas con enfoque en profundidad y postura' 
      },
      { 
        id: 'peso_muerto', 
        name: 'PESO MUERTO', 
        description: 'Análisis de peso muerto con enfoque en postura de espalda' 
      },
      { 
        id: 'press_banca', 
        name: 'PRESS BANCA', 
        description: 'Análisis de press de banca con enfoque en simetría de brazos' 
      }
    ];
  }

  static async processVideoWithMediaPipe(
    videoFile: File,
    exerciseType: string,
    onProgress?: (progress: number) => void
  ): Promise<{ videoBlob: Blob; stats: AnalysisResult }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No se pudo crear el contexto del canvas'));
        return;
      }

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const duration = video.duration;
        let currentTime = 0;
        const frameRate = 30;
        const frameInterval = 1 / frameRate;
        const totalFrames = Math.floor(duration * frameRate);
        let processedFrames = 0;

        // Simulación de análisis MediaPipe para demo
        const scores: number[] = [];
        const errors: Array<{ timestamp: number; error: string }> = [];
        let repetitions = 0;

        const recordedChunks: Blob[] = [];
        const stream = canvas.captureStream(frameRate);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
          
          const stats: AnalysisResult = {
            repeticiones: repetitions,
            errores_detectados: errors,
            scores_por_frame: scores,
            duracion_segundos: duration,
            score_promedio: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100
          };

          onProgress?.(100);
          resolve({ videoBlob, stats });
        };

        const processFrame = () => {
          if (currentTime >= duration) {
            mediaRecorder.stop();
            return;
          }

          video.currentTime = currentTime;
          
          video.onseeked = () => {
            // Dibujar frame original
            ctx.drawImage(video, 0, 0);

            // Simular análisis y overlay
            this.drawAnalysisOverlay(ctx, canvas.width, canvas.height, exerciseType, currentTime);

            // Generar datos simulados
            const frameScore = this.generateFrameScore(exerciseType, currentTime);
            scores.push(frameScore);

            if (frameScore < 75 && Math.random() > 0.7) {
              errors.push({
                timestamp: currentTime,
                error: this.generateErrorMessage(exerciseType)
              });
            }

            // Detectar repeticiones (simulado)
            if (Math.sin(currentTime * 2) > 0.8 && Math.random() > 0.9) {
              repetitions++;
            }

            processedFrames++;
            const progress = Math.min((processedFrames / totalFrames) * 95, 95);
            onProgress?.(progress);

            currentTime += frameInterval;
            setTimeout(processFrame, 33); // ~30fps
          };
        };

        mediaRecorder.start();
        processFrame();
      };

      video.onerror = () => {
        reject(new Error('Error al procesar el video'));
      };

      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }

  private static drawAnalysisOverlay(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    exerciseType: string,
    timestamp: number
  ) {
    // Simular landmarks de pose
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Dibujar esqueleto simulado
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ff0000';

    // Puntos principales simulados
    const head = { x: centerX, y: centerY - 100 };
    const shoulder = { x: centerX, y: centerY - 50 };
    const hip = { x: centerX, y: centerY + 50 };
    const knee = { x: centerX + Math.sin(timestamp) * 20, y: centerY + 150 };
    const ankle = { x: centerX, y: centerY + 250 };

    // Dibujar conexiones
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.lineTo(shoulder.x, shoulder.y);
    ctx.lineTo(hip.x, hip.y);
    ctx.lineTo(knee.x, knee.y);
    ctx.lineTo(ankle.x, ankle.y);
    ctx.stroke();

    // Dibujar puntos
    [head, shoulder, hip, knee, ankle].forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Panel de información
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(width - 250, 10, 240, 120);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Análisis MediaPipe JS', width - 240, 30);
    ctx.fillText(`Ejercicio: ${exerciseType}`, width - 240, 55);
    ctx.fillText(`Score: ${this.generateFrameScore(exerciseType, timestamp)}`, width - 240, 80);
    ctx.fillText(`Tiempo: ${timestamp.toFixed(1)}s`, width - 240, 105);
  }

  private static generateFrameScore(exerciseType: string, timestamp: number): number {
    // Simular variación de score basada en el tiempo y tipo de ejercicio
    const baseScore = 85;
    const variation = Math.sin(timestamp * 0.5) * 15;
    return Math.max(60, Math.min(100, Math.round(baseScore + variation)));
  }

  private static generateErrorMessage(exerciseType: string): string {
    const errors = {
      sentadilla: [
        'Rodillas hacia adentro',
        'Baja más la sentadilla',
        'Mantén la espalda recta',
        'Peso en los talones'
      ],
      peso_muerto: [
        'Mantén la espalda recta',
        'Hombros hacia atrás',
        'Pies paralelos',
        'Activa el core'
      ],
      press_banca: [
        'Controla el descenso',
        'Pecho hacia afuera',
        'Mantén la tensión',
        'Rango completo'
      ]
    };

    const exerciseErrors = errors[exerciseType as keyof typeof errors] || errors.sentadilla;
    return exerciseErrors[Math.floor(Math.random() * exerciseErrors.length)];
  }
}