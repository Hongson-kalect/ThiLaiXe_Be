export class GetRecordsDto {
  type: string;
}

export class RecordDto {
  id?: number;
  examId: number;
  ansers: number[];
}
