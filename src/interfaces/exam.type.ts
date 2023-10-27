export type GetExamParams = {
  search?: string;
  type?: string;
};

export type MakeRandomExamParams = {
  type: 'a1' | 'a2' | 'a3a4' | 'b1' | 'b2' | 'c' | 'def';
  name: string;
};

export type ExamParams = {
  id?: number;
  name: string;
  questions: number[];
  type: string;
  shuffle?: boolean;
};
export type submitAnserParams = {
  anser: number[];
  questionId?: number[];
  examId?: number;
};
export type MakeRandomQuestionParams = {
  type: string;
  questionNumber?: {
    T1?: number;
    T2?: number;
    T3?: number;
    T4?: number;
    T5?: number;
    T6?: number;
    T7?: number;
    require?: number;
  };
};
