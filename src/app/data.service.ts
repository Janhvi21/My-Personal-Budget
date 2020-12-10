import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';
import 'rxjs';
import { AppModule } from './app.module';

export class Element {
  value: '';
  labels: '';
  constructor() {}
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public transactions = [];
  public UserData = [];
  public spentData = [];
  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#98abc5',
          '#8a89a6',
          '#7b6888',
          '#6b486b',
          '#a05d56',
          '#d0743c',
          '#ff8c00',
        ],
      },
    ],
    labels: [],
  };
  public data = [];
  public result;
  constructor(private http: HttpClient) {}

  /*getData() {
    this.data = [];
    const promise = new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:3000/budget')
        .toPromise()
        .then((res: any) => {
          /*for (let i = 0; i < res.myBudget.length; i++) {
            this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
            this.dataSource.labels[i] = res.myBudget[i].title;
            this.spentData[i] = res.myBudget[i].spent;
            const ele = new Element();
            ele.value = res.myBudget[i].budget;
            ele.labels = res.myBudget[i].title;
            this.data.push(ele);
            resolve();
          }*/
  /*});
    });
    return promise;
  }*/

  getDataFromFirebase() {
    const params = {
      token: localStorage.getItem('TOKEN'),
    };
    const promise = new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:3000/getAllData', { params })
        .toPromise()
        .then((res: any) => {
          let i = 0;
          const budgetData = res['2020']['January']['Budget'];
          const expData = res['2020']['January']['Expense'];
          for (let budget in budgetData) {
            this.dataSource.datasets[0].data[i] = budgetData[budget];
            this.dataSource.labels[i] = budget;
            this.spentData[i] = expData[budget];

            i++;
          }
          this.transactions = res['2020']['January']['Transactions'];
          this.UserData = res['2020']['January']['Budget'];
          resolve();
        });
    });
    return promise;
  }
  insertCategory(category: string, amount: string) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      category: category,
      Amount: amount,
    };
    const promise = new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:3000/insertCategory', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
  deleteCategory(rows) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      key: rows.key,
      value: rows.value,
    };
    const promise = new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:3000/deleteCategory', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
  insertTransaction(
    category: string,
    amount: string,
    detail: string,
    date: string
  ) {
    const params = {
      token: localStorage.getItem('TOKEN'),
      Category: category,
      Date: date,
      Details: detail,
      Spent: amount,
    };
    const promise = new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:3000/insertTransaction', { params })
        .toPromise()
        .then((res: any) => {
          resolve();
        });
    });
    return promise;
  }
}
