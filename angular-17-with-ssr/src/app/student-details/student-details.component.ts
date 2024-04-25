import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, take, takeUntil, tap } from 'rxjs';
import { SchoolService } from '../school.service';
import { HttpClientModule } from '@angular/common/http';
import { Student } from '../school';
import { Chart, ChartModule } from 'angular-highcharts';
import { Options } from 'highcharts';
@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [HttpClientModule, ChartModule],
  providers: [SchoolService],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss',
})
export class StudentDetailsComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  classId: number | undefined;
  loading: boolean = false;
  studentsData: Student[] = [];
  chart!: Chart;
  constructor(
    private route: ActivatedRoute,
    private schoolService: SchoolService
  ) {
    this.getClassID();
  }

  ngOnInit(): void {
    this.loading = true;
    this.schoolService
      .getStudentDetailsforClass(this.classId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Student[]) => {
        this.studentsData = data;
        this.loading = false;
        this.initializeChart();
      });
  }

  initializeChart() {
    this.chart = new Chart({
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Male vs Female Student Proportion',
      },
      plotOptions: {
        pie: {
          innerSize: '50%', // Set innerSize to create a doughnut chart
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Students',
          type: 'pie', // Specify the type as 'pie' for doughnut chart
          data: [
            {
              name: 'Male',
              y: this.studentsData.filter((student) => student.sex === 'M')
                .length,
            },
            {
              name: 'Female',
              y: this.studentsData.filter((student) => student.sex === 'F')
                .length,
            },
          ],
        },
      ],
    } as Options);
  }

  getClassID() {
    let c;
    this.route.paramMap
      .pipe(
        takeUntil(this.destroyed$),
        tap((data) => {
          this.classId = Number(data.get('classId'));
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
