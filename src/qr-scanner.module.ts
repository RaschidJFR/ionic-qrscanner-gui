import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { QrScannerComponent } from "./qr-scanner";

@NgModule({
	declarations: [QrScannerComponent],
	imports: [IonicPageModule.forChild(QrScannerComponent)],
	exports: [QrScannerComponent]
})
export class QrScannerComponentModule {}