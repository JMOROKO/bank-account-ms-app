import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit {
  accounts!: any;
  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
    this.http.get(environment.HTTP_HOST+"/ACCOUNT-SERVICE/accounts").subscribe({
      next: data => {
        this.accounts = data;
      },
      error: err => {
        console.log(err)
      }
    });
  }

}
