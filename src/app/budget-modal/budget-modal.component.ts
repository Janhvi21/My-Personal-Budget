import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-budget-modal',
  templateUrl: './budget-modal.component.html',
  styleUrls: ['./budget-modal.component.scss'],
})
export class BudgetModalComponent implements AfterViewInit {
  category: string = '';
  amount: string = '';
  @Input() budget;
  constructor() {}

  ngAfterViewInit(): void {
    console.log(this.budget);
  }
  onAddCategory(category: string, amount: string) {
    console.log('Add ', category, amount);

    let ele={};
    ele[category]=amount;
    this.budget.push(ele);
  }
}
