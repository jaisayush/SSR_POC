import { AfterRenderPhase, Component, afterNextRender } from '@angular/core';
import { SchoolService } from '../school.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClassDetails } from '../school';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Chart, ChartModule } from 'angular-highcharts';
import Highcharts from 'highcharts';
@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HttpClientModule,
    CommonModule,
    ChartModule,
  ],
  providers: [SchoolService],
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss',
})
export class ClassDetailsComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  classStats: ClassDetails[] = [];
  loading: boolean = false;
  chart!: Chart;
  isHighchart = typeof Highcharts === 'object';

  constructor(private schoolService: SchoolService) {}

  ngOnInit(): void {
    this.loading = true;
    this.schoolService
      .getClassStats()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: ClassDetails[]) => {
        this.classStats = data;
        this.loading = false;
        // ERROR TypeError: Highcharts.chart is not a function
        this.initializeChart();
      });
  }

  initializeChart() {
    this.chart = new Chart({
      chart: {
        type: 'column',
      },
      title: {
        text: 'Student Statistics by Class',
      },
      xAxis: {
        categories: this.classStats.map((item) => item.className),
      },
      yAxis: {
        title: {
          text: 'Number of Students',
        },
      },
      series: [
        {
          name: 'Total Students',
          type: 'column',
          data: this.classStats.map((item) => item.totalStudents),
        },
        {
          name: 'Male Students',
          type: 'column',
          data: this.classStats.map((item) => item.maleStudents),
        },
        {
          name: 'Female Students',
          type: 'column',
          data: this.classStats.map((item) => item.femaleStudents),
        },
      ],
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
