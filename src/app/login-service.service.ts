import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  ErrorMessage: '';
  isLoggedIn = false;
  Token: '';
  public date=new Date();

  constructor(
    public firebaseAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private dataService:DataService
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
            localStorage.setItem('TOKEN', idToken);
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
            this.dataService.setMonth=this.dataService.allmonths[this.date.getUTCMonth()];
            this.dataService.setYear=this.date.getFullYear().toString();
            this.router.navigate(['/sidebar']);
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
      .post('http://localhost:3000/createNewUser', {
        username: name,
        password: password.trim(),
        email: email.trim(),
        monthly_expenses: '',
      })
      .toPromise()
      .then((res1: any) => {
        this.firebaseAuth
          .signInWithEmailAndPassword(email, password)
          .then(async (res) => {
            firebase
              .auth()
              .currentUser.getIdToken(true)
              .then(function (idToken) {
                localStorage.setItem('TOKEN', idToken);
                this.dataService.setMonth=this.dataService.allmonths[this.date.getUTCMonth()];
                this.dataService.setYear=this.date.getFullYear().toString();
              })
              .catch((e) => {
                console.log('error in getting token' + e);
              });
          });
      });
    this.router.navigate(['/sidebar']);
  }
  logout() {
    this.firebaseAuth.signOut();
    this.router.navigate(['/login']);
  }
}
