import { Component, OnInit } from '@angular/core';
import { ProjectServiceService } from '../project-service.service';
import { Observable } from 'rxjs';
import { Project } from '../project';
import { HttpClient } from '@angular/common/http';

type SortOption = keyof Project;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  projects$!: Observable<any[]>;
  searchTerm: string = '';
  sortOption: SortOption = 'priority';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  currentPage: number = 1; // current page for pagination
  itemsPerPage: number = 10; // items per page
  location: any;

  constructor(private http: HttpClient, private projectService: ProjectServiceService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<Project[]>('http://localhost:8082/projects').subscribe(data => {
      this.projects = data;
      this.filteredProjects = data;
      this.sortProjects(); // Initial sort after data is loaded
      this.paginateProjects(); // Initial pagination
    });
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter(project =>
      Object.values(project).some(value =>
        value != null && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
    this.sortProjects();
    this.paginateProjects();
  }

  sortProjects() {
    this.filteredProjects.sort((a, b) => {
      const valueA = a[this.sortOption];
      const valueB = b[this.sortOption];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return valueA.getTime() - valueB.getTime();
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else {
        return 0;
      }
    });
  }

  updateProjectStatus(project: any, status: string): void {
    project.status = status;
    this.projectService.updateProjectStatus(project.id, status).subscribe(() => {
      // Refresh the project list or handle UI changes
      this.loadProjects();
    });
  }

  goBack(): void {
    this.location.back();
  }

  paginateProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateProjects();
  }
}
