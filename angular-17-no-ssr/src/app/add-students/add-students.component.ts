import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SchoolService } from '../school.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReplaySubject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [SchoolService],
  templateUrl: './add-students.component.html',
  styleUrl: './add-students.component.scss',
})
export class AddStudentsComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  studentForm!: FormGroup;
  classOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private schoolService: SchoolService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.studentForm = this.fb.group({
      classId: ['1', Validators.required],
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(18)]],
      sex: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      // Handle form submission
      const formData = this.studentForm.value;
      this.schoolService
        .addNewStudent(formData)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          (response: any) => {
            console.log(response); // Log the response for debugging
            alert('Student added successfully');
            this.router.navigateByUrl('/home'); // Redirect to home screen after adding student
          },
          (error: any) => {
            console.error('Error adding student:', error);
            alert('Failed to add student. Please try again.');
          }
        );
      // You can implement your HTTP request or other logic here
    } else {
      // Mark all fields as touched to display validation errors
      this.markFormGroupTouched(this.studentForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any)
      .values(formGroup.controls)
      .forEach((control: FormControl) => {
        control.markAsTouched();

        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
