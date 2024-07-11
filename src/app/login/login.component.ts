import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = "";
  passwordFieldType: string = 'password';

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
     // this.errorMessage = "Email and Password are required";
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    const bodyData = this.loginForm.value;
    this.http.post("http://localhost:8082/user/login", bodyData).subscribe((resultData: any) => {
      if (resultData.message == "Email not exists") {
        this.errorMessage = "Email does not exist";
      } else if (resultData.message == "Valid User") {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.errorMessage = "Incorrect Email and Password do not match";
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
