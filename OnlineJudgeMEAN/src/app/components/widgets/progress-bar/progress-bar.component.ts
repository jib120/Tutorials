import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
  selector: "app-widget-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.css"]
})
export class ProgressBarComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  @Input() frequency: number;

  getBarClass() {
    let barClass = "progress-bar ";
    if (this.frequency <= 34) {
      barClass += "progress-bar-info";
    } else if (this.frequency <= 67) {
      barClass += "progress-bar-warning";
    } else {
      barClass += "progress-bar-success";
    }

    return barClass;
  }

  getBarStyle() {
    let style = `width: ${this.frequency}px;`;
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
