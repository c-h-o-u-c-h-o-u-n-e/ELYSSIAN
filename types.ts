
export interface AnalysisResponse {
  analysis: {
    fabric: string;
    colors: string;
    construction: string;
    embellishments: string;
    fit: string;
    uniqueFeatures: string;
  };
  braDNA: {
    brand: string;
    model: string;
    size: string;
    condition: string;
    colors: string;
    padding: string;
    underwire: string;
    closure: string;
    straps: string;
    jHook: string;
  };
  prompts: {
    productShot: string;
    frontModelShot: string;
    backModelShot: string;
  };
}

export interface ReferenceImages {
  front: string;
  back: string;
  side: string;
}

export interface ImageResult {
  id: string;
  promptType: 'product' | 'front' | 'back';
  url: string;
}
