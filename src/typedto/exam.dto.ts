export class GetExamDto {
  search: string;
  type: string;
}

export class MakeRandomExamDto {
  name: string;
  type: 'a1' | 'a2' | 'a3a4' | 'b1' | 'b2' | 'c' | 'def';
}

export class ExamDto {
  id?: number;
  name: string;
  questions: number[];
  type: string;
  shuffle?: boolean;
}

export class submitExamDto {
  anser: number[];
  questionId?: number[];
  examId?: number;
}
