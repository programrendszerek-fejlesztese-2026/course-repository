import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { Profile } from './profile/profile';
import { MyRatings } from './my-ratings/my-ratings';

const routes: Routes = [
  { path: '', component: Profile },
  { path: 'ratings', component: MyRatings },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), Profile, MyRatings],
})
export class UserModule {}
