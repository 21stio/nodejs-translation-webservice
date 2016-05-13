export interface ITranslation {
    sentence: string;
    sentence_hints: Array<string>;
    translation: string;
    translation_hints: Array<string>;
    confidence: number;
    confidence_score: number;
}