export type GetRecordsParams = {
  id?: number;
  type: string;
};

export type RecordParams = {
  id?: number;
  examId: number;
  ansers: number[];
};

export type createRecordParams = {
  examId: number;
  score: {
    correct: number;
    total: number;
  };
  ansers: number[];
};
