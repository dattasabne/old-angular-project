import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ExamNavbarComponent } from './exam-navbar/exam-navbar.component';
import { MaterialModule } from './material/material.module';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { BrandingComponent } from './branding/branding.component';
import { AlertDialog } from './dialogs/alert-dialog/alert-dialog';

@NgModule({
  declarations: [NavbarComponent, FooterComponent,
    ExamNavbarComponent,
    ConfirmDialogComponent,
  AlertDialog ],
  imports: [
    CommonModule ,
    MaterialModule
  ],
  exports:[NavbarComponent,
    FooterComponent,ExamNavbarComponent],
    entryComponents:[ConfirmDialogComponent ,AlertDialog ]

})
export class SharedModule { }
