import { useCallback, useRef, useState } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export interface PoseData {
  landmarks: any[];
  worldLandmarks: any[];
  segmentationMask?: any;
}

export interface ExerciseAnalysis {
  repetitions: number;
  score: number;
  errors: Array<{
    timestamp: number;
    error: string;
  }>;
  angles: {
    knee?: number;
    hip?: number;
    shoulder?: number;
  };
}

export const useMediaPipe = () => {
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPose, setCurrentPose] = useState<PoseData | null>(null);
  const [analysis, setAnalysis] = useState<ExerciseAnalysis>({
    repetitions: 0,
    score: 100,
    errors: [],
    angles: {}
  });

  const calculateAngle = useCallback((a: any, b: any, c: any): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }, []);

  const analyzeSquat = useCallback((landmarks: any[]): Partial<ExerciseAnalysis> => {
    if (!landmarks || landmarks.length < 33) return {};

    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const leftShoulder = landmarks[11];

    if (!leftHip?.visibility || !leftKnee?.visibility || !leftAnkle?.visibility) {
      return {};
    }

    const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

    let score = 100;
    const errors: Array<{ timestamp: number; error: string }> = [];

    // Análisis de profundidad
    if (kneeAngle > 130) {
      score -= 15;
      errors.push({
        timestamp: Date.now() / 1000,
        error: "Baja más la sentadilla"
      });
    } else if (kneeAngle < 70) {
      score -= 10;
      errors.push({
        timestamp: Date.now() / 1000,
        error: "Demasiada profundidad"
      });
    }

    // Análisis de postura
    if (hipAngle < 45) {
      score -= 20;
      errors.push({
        timestamp: Date.now() / 1000,
        error: "Mantén la espalda recta"
      });
    }

    return {
      score: Math.max(0, score),
      errors,
      angles: { knee: kneeAngle, hip: hipAngle }
    };
  }, [calculateAngle]);

  const analyzeDeadlift = useCallback((landmarks: any[]): Partial<ExerciseAnalysis> => {
    if (!landmarks || landmarks.length < 33) return {};

    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const rightShoulder = landmarks[12];
    const rightHip = landmarks[24];

    if (!leftShoulder?.visibility || !leftHip?.visibility) {
      return {};
    }

    const backAngle = calculateAngle(leftShoulder, leftHip, { x: leftHip.x, y: leftHip.y + 0.1 });

    let score = 100;
    const errors: Array<{ timestamp: number; error: string }> = [];

    if (backAngle > 30) {
      score -= 25;
      errors.push({
        timestamp: Date.now() / 1000,
        error: "Mantén la espalda recta"
      });
    }

    return {
      score: Math.max(0, score),
      errors,
      angles: { shoulder: backAngle }
    };
  }, [calculateAngle]);

  const analyzeBenchPress = useCallback((landmarks: any[]): Partial<ExerciseAnalysis> => {
    if (!landmarks || landmarks.length < 33) return {};

    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    if (!leftShoulder?.visibility || !leftElbow?.visibility || !leftWrist?.visibility) {
      return {};
    }

    const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);

    let score = 100;
    const errors: Array<{ timestamp: number; error: string }> = [];

    if (elbowAngle > 120) {
      score -= 10;
      errors.push({
        timestamp: Date.now() / 1000,
        error: "Puedes bajar más"
      });
    }

    return {
      score: Math.max(0, score),
      errors,
      angles: { shoulder: elbowAngle }
    };
  }, [calculateAngle]);

  const onResults = useCallback((results: Results, exerciseType: string = 'sentadilla') => {
    if (results.poseLandmarks) {
      const poseData: PoseData = {
        landmarks: results.poseLandmarks,
        worldLandmarks: results.poseWorldLandmarks || [],
        segmentationMask: results.segmentationMask
      };

      setCurrentPose(poseData);

      // Analizar según el tipo de ejercicio
      let exerciseAnalysis: Partial<ExerciseAnalysis> = {};

      switch (exerciseType) {
        case 'sentadilla':
          exerciseAnalysis = analyzeSquat(results.poseLandmarks);
          break;
        case 'peso_muerto':
          exerciseAnalysis = analyzeDeadlift(results.poseLandmarks);
          break;
        case 'press_banca':
          exerciseAnalysis = analyzeBenchPress(results.poseLandmarks);
          break;
        default:
          exerciseAnalysis = analyzeSquat(results.poseLandmarks);
      }

      setAnalysis(prev => ({
        ...prev,
        ...exerciseAnalysis
      }));
    }
  }, [analyzeSquat, analyzeDeadlift, analyzeBenchPress]);

  const initializePose = useCallback(async (exerciseType: string = 'sentadilla') => {
    if (poseRef.current) {
      poseRef.current.close();
    }

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => onResults(results, exerciseType));

    poseRef.current = pose;
    setIsInitialized(true);

    return pose;
  }, [onResults]);

  const startCamera = useCallback(async (videoElement: HTMLVideoElement, exerciseType: string = 'sentadilla') => {
    if (!poseRef.current) {
      await initializePose(exerciseType);
    }

    if (cameraRef.current) {
      cameraRef.current.stop();
    }

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraRef.current = camera;

    return camera;
  }, [initializePose]);

  const processVideo = useCallback(async (
    videoFile: File, 
    exerciseType: string = 'sentadilla',
    onProgress?: (progress: number) => void
  ): Promise<{ analysisResults: ExerciseAnalysis; processedVideoBlob: Blob }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('No se pudo crear el contexto del canvas'));
        return;
      }

      video.onloadedmetadata = async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (!poseRef.current) {
          await initializePose(exerciseType);
        }

        let currentTime = 0;
        const frameRate = 30;
        const frameInterval = 1 / frameRate;
        const duration = video.duration;
        const totalFrames = Math.floor(duration * frameRate);
        let processedFrames = 0;

        const analysisResults: ExerciseAnalysis = {
          repetitions: 0,
          score: 100,
          errors: [],
          angles: {}
        };

        const processFrame = async () => {
          if (currentTime >= duration) {
            // Finalizar procesamiento
            const recordedChunks: Blob[] = [];
            const stream = canvas.captureStream();
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                recordedChunks.push(event.data);
              }
            };

            mediaRecorder.onstop = () => {
              const processedVideoBlob = new Blob(recordedChunks, { type: 'video/webm' });
              resolve({ analysisResults, processedVideoBlob });
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 100);
            return;
          }

          video.currentTime = currentTime;
          
          video.onseeked = async () => {
            ctx.drawImage(video, 0, 0);
            
            if (poseRef.current) {
              await poseRef.current.send({ image: canvas });
            }

            processedFrames++;
            const progress = (processedFrames / totalFrames) * 100;
            onProgress?.(Math.min(progress, 95));

            currentTime += frameInterval;
            setTimeout(processFrame, 50);
          };
        };

        processFrame();
      };

      video.onerror = () => {
        reject(new Error('Error al cargar el video'));
      };

      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }, [initializePose]);

  const stopAnalysis = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }
    
    setIsInitialized(false);
    setCurrentPose(null);
    setAnalysis({
      repetitions: 0,
      score: 100,
      errors: [],
      angles: {}
    });
  }, []);

  return {
    isInitialized,
    currentPose,
    analysis,
    initializePose,
    startCamera,
    processVideo,
    stopAnalysis
  };
};