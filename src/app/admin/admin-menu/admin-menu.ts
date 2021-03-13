import {
  Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonAnalysisReportComponent } from "../analysis-report/analysis-report";
import { IndivisualReportComponent } from "../indivisual-report/indivisual-report";
import { SettingMenuComponent } from "../setting/setting-menu/setting-menu";
import { AdminMenuService } from "./admin-menu.service";
import { AppConstant } from "../../shared/app-constant/app-constatnt";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmDialog } from "../../shared/confirm-dialog/confirm-dialog";
import { DataShareService } from "src/app/shared/services/data-share-service";
import { ClassProfile } from "src/app/shared/model/class-profile-model";

@Component({
  selector: "admin-menu",
  templateUrl: "./admin-menu.html",
  styleUrls: ["./admin-menu.css"]
})
export class AdminMenu implements OnInit, AfterViewInit {
  @ViewChild("template", { read: ViewContainerRef, static: true }) template: ViewContainerRef;
  public options: Array<any>;
  public static readonly OPTION_BACKGROUND = "#8B8B00";
  public classProfile:ClassProfile = <ClassProfile>{};
  public isAppLoaded: boolean = false;
  public constructor(
    private router: Router,
    private activate: ActivatedRoute,
    private factory: ComponentFactoryResolver,
    private http: AdminMenuService,
    private change: ChangeDetectorRef,
    private location: Location,
    private dialog: MatDialog,
    private dataShare:DataShareService
  ) {}
  ngAfterViewInit() {}
  // private decryptToken(token: string): string {

  //   try {
  //     var bytes = cr.AES.decrypt(
  //       token.toString(),
  //       "www.koshedutech.com-v.1.0-@datt#sabne#@"
  //     );
  //     var decryptedData = bytes.toString(cr.enc.Utf8);
  //     if (decryptedData) {
  //       return decryptedData;
  //     }
  //     return null;
  //   } catch (ex) {
  //     return null;
  //   }
  // }
  
  ngOnInit() {
    this.classProfile = this.dataShare.ClassProfile;
    if(!this.classProfile){
        this.router.navigate(["/"]);
      return ;
    }
    

    // this.isAppLoaded = true;
    // const security_message: string =
    //   "Security Error Occure Please Re-Login...to I got Rank";
    // try {
    //   this.activate.paramMap.subscribe(params => {
    //     const token = params.get("token");
    //     try {
    //       let duri = decodeURIComponent(token);
    //     } catch (e) {
    //       alert(security_message);
    //       this.redirectToIgotRank();
    //       return;
    //     }
    //     const dcrypt = this.decryptToken(token);
    //     let data;
    //     if (dcrypt) {
    //       data = JSON.parse(dcrypt);
    //       if (data["username"] && data["password"]) {
    //         this.http.login(data).subscribe(res => {
    //           if (res.result === "true") {
    //             this.classProfile = {
    //               className: res.data.className,
    //               username: data.username,
    //               uniqueClassName: res.data.uniqueClassName,
    //               classLogo: ""
    //             };
    //             this.loadComponent(0);
    //           } else {
    //             this.redirectToIgotRank();
    //           }
    //           this.isAppLoaded = false;
    //           this.change.detectChanges();
    //         });
    //       } else {
    //         this.isAppLoaded = false;
    //         alert(security_message);
    //         this.redirectToIgotRank();
    //       }
    //     } else {
    //       this.isAppLoaded = false;
    //       alert(security_message);
    //       this.redirectToIgotRank();
    //     }
    //   });
    // } catch (e) {
    //   this.isAppLoaded = false;
    //   alert(security_message);
    //   this.redirectToIgotRank();
    // }

    this.options = [
      {
        name: "Common Analysis Report",
        background: AdminMenu.OPTION_BACKGROUND,
        index: 0
      },
      {
        name: "Individual Student Report",
        background: AdminMenu.OPTION_BACKGROUND,
        index: 1
      },
      {
        name: "setting",
        background: AdminMenu.OPTION_BACKGROUND,
        index: 2
      },
      {
        name: "logout",
        background: AdminMenu.OPTION_BACKGROUND,
        index: 3
      }
    ];
    this.loadComponent(0);
  }

  public dialogRef: MatDialogRef<any> = null;

  public redirectToIgotRank() {
    window.location.href = AppConstant.IGOTRANK_URL;
  }
  public resetOptionBackgropundAndSetActive(index: number): void {
    this.options.forEach(item => {
      item.background = AdminMenu.OPTION_BACKGROUND;
    });
    this.options[index].background = "#F4A460";
  }
  public loadComponent(num: number) {
    this.resetOptionBackgropundAndSetActive(num);

    let loadComponent = null;
    switch (num) {
      case 0:
        loadComponent = this.factory.resolveComponentFactory(
          CommonAnalysisReportComponent
        );
        break;
      case 1:
        loadComponent = this.factory.resolveComponentFactory(
          IndivisualReportComponent
        );
        break;
      case 2:
        loadComponent = this.factory.resolveComponentFactory(
          SettingMenuComponent
        );
        break;
      case 3:
        if (this.dialogRef == null) {
          this.dialogRef = this.dialog.open(ConfirmDialog, {
            data: {
              message: "do you really Want to Log Out..?",
              source: {
                yes:()=>{
                  this.logOut();
                  this.dialogRef.close();
                  this.dialogRef = null;
                },
                no: () => {
                  this.dialogRef.close();
                  this.dialogRef = null;
                }
              }
            },
            height: "300px",
            width: "500px"
          });
        }

        
        return;
    }
    this.template.clear();
    this.template.createComponent(loadComponent);
  }
  public logOut(): void {

    this.http.logout().subscribe(
      res => {
        if (res.result !== true) {
          alert("Internal Server Problem Occured.");
        }
        // this.location.replaceState(AppConstant.IGOTRANK_URL);
        // this.redirectToIgotRank();
        this.location.replaceState("koshedutech.com");
        this.router.navigate(["/"]);
      },
      err => {
        console.log(err);
      }
    );

  }
  
}
