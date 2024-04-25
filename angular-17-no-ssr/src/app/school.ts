export interface ClassDetails {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  averageAge: number;
  classId: number;
  className: string;
}

export interface Student {
  name: string;
  age: number;
  sex: 'M' | 'F';
  classId: number;
}
