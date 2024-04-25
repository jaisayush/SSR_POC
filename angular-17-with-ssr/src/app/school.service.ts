import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassDetails, Student } from './school';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  serverUrl = 'http://localhost:3000/';

  constructor(private httpClient: HttpClient) {}

  getClassStats(): Observable<ClassDetails[]> {
    return this.httpClient.get<any>(this.serverUrl + 'stats/classes').pipe(
      map((data) =>
        Object.entries(data).map(([className, stats]: [string, any]) => ({
          className,
          ...stats,
        }))
      )
    );
  }

  getStudentDetailsforClass(
    classId: number | undefined
  ): Observable<Student[]> {
    if (classId) {
      return this.httpClient.get<Student[]>(
        this.serverUrl + 'students/' + classId
      );
    }
    return of([]);
  }
  addNewStudent(formData: any): Observable<any> {
    const apiUrl = this.serverUrl + 'newstudent';
    return this.httpClient.post(apiUrl, formData);
  }
}
