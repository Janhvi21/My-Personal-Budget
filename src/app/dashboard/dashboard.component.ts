import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { isEmptyObject } from 'jquery';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  private svg;
  private margin = 50;
  private width = 750;
  private height = 470;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;
  public totalBudget = 0;
  public totalSpent = 0;
  public totalSaving = 0;
  public budget;
  public transactions=[];

  constructor(
    public dataService: DataService,
    public loginServiceService: LoginServiceService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    // service call only if data is empty
    console.log('After View');
    if (
      isEmptyObject(this.dataService.data) ||
      isEmptyObject(this.dataService.dataSource)
    ) {
      // this.dataService.getData();
      this.dataService.getDataFromFirebase();
    } else {
    }

    setTimeout(() => {
      this.createChart();
      //this.drawChart();
      this.createBarChart();
      this.budget = this.dataService.UserData;
      this.calculateTotalBudget();
      let i=0;
      while(this.dataService.transactions[i]){
        for(let row in this.dataService.transactions[i]){
          console.log(row)
          this.transactions.push(row);
        }
      }

      console.log('Transactions', this.dataService.transactions);
    }, 500);
  }

  calculateTotalBudget(): void {
    for (
      let i = 0;
      i < this.dataService.dataSource.datasets[0].data.length;
      i++
    ) {
      this.totalBudget += this.dataService.dataSource.datasets[0].data[i];
      this.totalSpent += this.dataService.spentData[i];
    }
    this.totalSaving = this.totalBudget - this.totalSpent;
  }
  reload(msg: string): void {
    this.dataService.dataSource.datasets[0].data = [];
    this.dataService.dataSource.labels = [];
    this.dataService.spentData = [];
    this.ngAfterViewInit();
  }
  createBarChart(): void {
    const ctx = document.getElementById('barChart');

    const barData = {
      labels: this.dataService.dataSource.labels,
      datasets: [
        {
          label: 'Spent',
          backgroundColor: '#000000',
          data: this.dataService.spentData,
        },
        {
          label: 'Budget',
          backgroundColor: this.dataService.dataSource.datasets[0]
            .backgroundColor,
          data: this.dataService.dataSource.datasets[0].data,
        },
      ],
    };

    const myBarChart = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: {
        barValueSpacing: 20,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
              },
            },
          ],
        },
      },
    });
  }
  // Using Chart.js
  createChart(): void {
    const ctx = document.getElementById('myChart');
    const myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataService.dataSource,
    });
  }

  public OnLogout(): void {
    this.loginServiceService.logout();
  }
}
