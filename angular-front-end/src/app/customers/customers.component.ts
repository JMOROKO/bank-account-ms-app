import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{
  public customers: any;

  constructor(private http: HttpClient){

  }

  ngOnInit(){
    this.http.get(environment.HTTP_HOST+"/CUSTOMER-SERVICE/customers").subscribe({
      next: data => {
        this.customers = data;
      },
      error: err => {
        console.log(err)
      }
    });
  }
}
