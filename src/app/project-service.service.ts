// project-service.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  private apiUrl = 'http://localhost:8082/projects'; // Replace with your Spring Boot API URL
id:any;
theme: any;
reason: any;
type: any;
division: any;
category: any;
priority: any;
department: any;
startDate: any;
endDate: any;
location: any;
status: any;
  //id: number | undefined;

  constructor(private http: HttpClient) { }

  saveProject(projectData: any): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/create`, projectData);
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
 

  updateProjectStatus(projectId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${projectId}/status`, { status });
  }

 // getProjectCounts(): Observable<any[]> {
    //return this.http.get(`${this.apiUrl}/counters`);
   // return this.http.get<any[]>(`${this.apiUrl}/counters`);
 // }
  getProjectCounts(): Observable<{
    totalProjects: number;
    closedProjects: number;
    runningProjects: number;
    closureDelay: number;
    cancelledProjects: number;
  }> {
    return this.http.get<{
      totalProjects: number;
      closedProjects: number;
      runningProjects: number;
      closureDelay: number;
      cancelledProjects: number;
    }>(`${this.apiUrl}/counters`);

  }
  

//chart
  getDepartmentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/success-data`);
  }
  
  /*
  saveProject_(id: number): Observable<any> {
    return this.updateProjectStatus(id, 'Running');
  }

  closeProject(id: number): Observable<any> {
    return this.updateProjectStatus(id, 'Closed');
  }

  cancelProject(id: number): Observable<any> {
    return this.updateProjectStatus(id, 'Cancelled');
  }*/
}
