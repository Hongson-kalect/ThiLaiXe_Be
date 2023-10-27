export type GetQuestionsParams = {
  require?: string;
  getAll?: boolean;
  page?: number;
  search: string;
  for?: 'a2' | 'a34' | 'b1' | 'b2cdef';
  type?: string;
};
export type QuestionParam = {
  id?: number;
  title: string;
  image: string;
  ansers: string[];
  correct: number;
  explain: string;
  a1: boolean;
  a2: boolean;
  a3: boolean;
  a4: boolean;
  b1: boolean;
  b2: boolean;
  c: boolean;
  d: boolean;
  e: boolean;
  f: boolean;
  type: string;
};
