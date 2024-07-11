import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartItem, registerables, LegendItem, ChartComponent, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { ProjectServiceService } from '../project-service.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalProjects: number = 0;
  closedProjects: number = 0;
  runningProjects: number = 0;
  closureDelay: number = 0;
  cancelledProjects: number = 0;


  constructor(private projectService: ProjectServiceService, private http: HttpClient) {
    
  }

  ngOnInit(): void {
    this.loadProjectCounts();
    this.createSuccessChart();
  }

  loadProjectCounts(): void {
    this.projectService.getProjectCounts().subscribe((data) => {
      this.totalProjects = data.totalProjects;
      this.closedProjects = data.closedProjects;
      this.runningProjects = data.runningProjects;
      this.closureDelay = data.closureDelay;
      this.cancelledProjects = data.cancelledProjects;
    });
  }

  createSuccessChart(): void {
    this.projectService.getDepartmentStats().subscribe((data: any[]) => {
      const ctx = document.getElementById('successChart') as ChartItem;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['STR', 'FIN', 'QLT', 'MAN', 'STO', 'HR'],
            datasets: [
              {
                label: 'Total',
                data: data.map((department: { total: number }) => department.total),
                backgroundColor: '#1c4c9a',
                hoverBackgroundColor: '#1c4c9a',
                borderColor: 'white',
                borderWidth: 3,
                barThickness: 14,
                borderRadius: 30,
                categoryPercentage: 0.7, // Adjust this to create the desired gap
                barPercentage: 0.8, // Adjust this to create the desired gap,
                 borderSkipped: 'end'
                 
                
              },
              {
                label: 'Closed',
                data: data.map((department: { closed: number }) => department.closed),
                backgroundColor: '#06a342',
                hoverBackgroundColor: '#06a342',
                borderColor: 'white',
                borderWidth: 3,
                barThickness: 14,
                borderRadius: 30,
                categoryPercentage: 1, // Adjust this to create the desired gap
                barPercentage: 0.9,
                borderSkipped: 'end'// Adjust this to create the desired gap
                
              }
            ]
          },
          options: {
            responsive: true,
            layout: {
              padding: {
                bottom: 20 // Add gap at the bottom of the graph bar
              }
            },
            plugins: {
              datalabels: {
                display: true,
                align: 'end', // Position at the top of the bars
                anchor: 'end', // Position at the top of the bars
                offset: 5, // Add offset to move the labels closer to the top of the bars
                formatter: (value, context) => {
                  const total = data[context.dataIndex].total;
                  const closed = data[context.dataIndex].closed;
                 // return `${closed} / ${total}`;
                },
                color: 'black', // Set color to make the text visible
                font: {
                  weight: 'bold'
                }
              },
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    return datasets.map((dataset, i) => ({
                      text: dataset.label,
                      fillStyle: dataset.backgroundColor as string,
                      strokeStyle: dataset.borderColor as string,
                      hidden: !chart.isDatasetVisible(i),
                      index: i,
                      pointStyle: 'circle',
                      borderWidth: 1,
                      padding: 20 // Add padding to the legend labels
                    } as LegendItem));
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 5,
                  maxTicksLimit: 20,
                  labelOffset:10
                }
              },
              x: {
                stacked: false ,
                offset:true,
                ticks: {
                  callback: (value, index, values) => {
                    const total = data[index]?.total ?? 0;
                    const closed = data[index]?.closed ?? 0;
                    const percentage = total > 0 ? ((closed / total) * 100).toFixed(0) : '0';
                    return `${value}\n${percentage}%`; // Display percentage below x-axis labels
                  }
                
                }
                
              }
            },
                    
          }
        });
         
      }
    });
  }
}
