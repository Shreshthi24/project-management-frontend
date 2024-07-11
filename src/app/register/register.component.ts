import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string ="";
  password: string ="";
  constructor(private http: HttpClient )
  {
  }
  save()
  {
  
    let bodyData = {
       "email" : this.email,
      "password" : this.password
    };
    this.http.post("http://localhost:8082/user/save",bodyData,{responseType: 'text'}).subscribe((resultData: any)=>
    {
        console.log(resultData);
        alert("Employee Registered Successfully");
    });
  }
}


