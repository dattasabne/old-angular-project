import { KoshDataConversionComponent } from './kosh-data-conversion/kosh-data-conversion.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KoshAdminComponent } from './kosh-admin-component/kosh-admin.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../students/shared/material/material.module';
import { UploadPapersComponent } from './upload-papers/upload-papers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenerateComponent } from './Paper Generation/random-generate/generate.component';
import { ManualGenerationComponent } from './Paper Generation/manual-generation/manual-generation.component';
import { SharedModule } from '../shared/shared-module';
import { StudentAssignmentComponent } from './student-assignment/student-assignment.component';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { QuestionSelectionComponent } from './question-selection-dialog/question-selection.component';
import { ViewTestpdfFilesComponent } from '../view-testpdf-files/view-testpdf-files.component';
import { AssignmentRecursive } from './student-assignment/assignment-recursive/recursive';
import { ReprintEntryComponentModule } from '../entry-component/reprint.test.entycomponent.module';
@NgModule({
  declarations: [
    KoshAdminComponent,
    GenerateComponent,
    UploadPapersComponent,
    ManualGenerationComponent,
    StudentAssignmentComponent,
    PrintPreviewComponent,
    QuestionSelectionComponent,
    ViewTestpdfFilesComponent,
    AssignmentRecursive,
    KoshDataConversionComponent
    ],
    imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ReprintEntryComponentModule ,
    RouterModule.forChild([
      {
        path:'',
        component:KoshAdminComponent
      },

      {
        path:"random-generate",
        component:GenerateComponent
      },
      {
        path:"manual-generate",
        component:ManualGenerationComponent
      },
      {
        path:"upload-papers",
        component:UploadPapersComponent
      },
      {
        path:"assignment",
        component:StudentAssignmentComponent
      },
      {
        path:"question-selection",
        component:QuestionSelectionComponent
      }
    ])
  ],
  entryComponents:[
    PrintPreviewComponent,
    QuestionSelectionComponent,
    ViewTestpdfFilesComponent,
    KoshDataConversionComponent
  ]
})
export class KoshAdminModule { }

