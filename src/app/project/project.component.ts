import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectServiceService } from '../project-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  projectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectServiceService,
    private router: Router ,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      theme: ['', Validators.required],
      reason: ['', Validators.required],
      type: ['', Validators.required],
      division: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      department: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      status: ['Registered', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.projectService.saveProject(this.projectForm.value)
        .subscribe(
          response => {
            console.log('Data saved successfully!', response);
            this.router.navigate(['/project-details']);
          },
          error => {
            console.error('Error saving data:', error);
          }
        );
    } else {
      console.error('Form data is invalid.');
    }
  }
  goBack(): void {
    this.location.back();
  }
}
