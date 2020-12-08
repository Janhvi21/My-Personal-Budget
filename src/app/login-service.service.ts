import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  ErrorMessage: '';
  isLoggedIn = false;
  Token: '';
  constructor(
    public firebaseAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) {}

  async signin(email: string, password: string): Promise<boolean> {
    let currentToken = '';
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        console.log(res);
        await firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            console.log('token current ', idToken);
            currentToken = idToken;
          });
        const params = {
          token: currentToken,
        };
        this.http
          .get('http://localhost:3000/verifyUser', { params })
          .toPromise()
          .then((res2: any) => {


            console.log('token response', res2);
            this.isLoggedIn = true;
            this.router.navigate(['/dashboard']);
          });
        return true;
      })
      .catch((Error) => {
        this.ErrorMessage = Error.message;
        console.log('error' + this.ErrorMessage);
      });
    return false;
  }
  async signup(name: string, email: string, password: string) {
    this.http
      .post(
        'http://localhost:3000/createNewUser',
        {
          username: name,
          password: password.trim(),
          email: email.trim(),
          monthly_expenses: '',
        },
        { responseType: 'text' }
      )
      .toPromise()
      .then((res1: any) => {
        console.log('Response', res1);
        this.Token = res1.tokenID;
        this.router.navigate(['/dashboard']);
      });
  }
  logout() {
    this.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
