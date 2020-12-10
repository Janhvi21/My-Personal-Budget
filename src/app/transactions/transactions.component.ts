import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(public dataServices: DataService) {}
  headers = [];
  transaction = [];
  ngOnInit(): void {
    console.log(this.dataServices.transactions);
  }

}
