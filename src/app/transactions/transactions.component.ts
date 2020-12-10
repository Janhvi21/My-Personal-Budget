import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(public dataServices: DataService) {}
  headers = [];
  transaction = [];
  categories = [];
  Category = '';
  Date = '';
  Details = '';
  Spent = 0;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  showform: boolean = false;

  ngOnInit(): void {
    for (let row in this.dataServices.transactions[0]) {
      this.headers.push(row);
    }
    for (let cat in this.dataServices.UserData) {
      this.categories.push(cat);
    }
  }
  changeCards(form) {
    this.showform = !this.showform;
  }
  onAddTransaction(
    Category: string,
    Date: string,
    Detail: string,
    Spent: number
  ) {
    console.log(Category, Date, Spent, Detail);
    this.dataServices.insertTransaction(
      Category,
      Spent.toString(),
      Detail,
      Date
    );
    this.showform = false;
  }
}
