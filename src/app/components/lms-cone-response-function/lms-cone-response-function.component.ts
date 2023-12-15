import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';
import {LmsConeResponseFunctionService} from "../../services/data-retrieval/lms-cone-response-function.service";
import transformJavaScript from "@angular-devkit/build-angular/src/tools/esbuild/javascript-transformer-worker";

@Component({
  selector: 'app-lms-cone-response-function',
  templateUrl: './lms-cone-response-function.component.html',
  styleUrls: ['./lms-cone-response-function.component.scss']
})
export class LmsConeResponseFunctionComponent implements AfterViewInit, OnChanges {
  @Input() from: number = 390;
  @Input() to: number = 830;
  @Input() step: number = 5;
  @Input() protanomalyFactor = 0;
  @Input() deuteranomalyFactor = 0;
  @ViewChild('spectrogramCanvas') private spectrogramCanvas!: ElementRef;

  private chart: Chart | null = null;


  constructor(private lmsConeResponseFunctionService: LmsConeResponseFunctionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.drawSpectrogram();
  }

  ngAfterViewInit(): void {
    const canvas = this.spectrogramCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Unable to get 2D context for canvas');
      return;
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: this.from,
            max: this.to
          },
          y: {
            type: 'linear',
            position: 'left',
          },
        },
      },
    });
    this.drawSpectrogram();
  }

  private drawSpectrogram() {
    if (this.chart) {
      const lmsConeResponseFunction = this.lmsConeResponseFunctionService.getAbnormalLmsConeResponseFunction(this.protanomalyFactor, this.deuteranomalyFactor)

      const datasets = [{
        label: "S",
        borderColor: "blue",
        fill: false,
        data: Array.from(
          {length: (this.to - this.from) / this.step + 1},
          (_, i) => {
            let l = this.from + i * this.step;
            return {x: l, y: lmsConeResponseFunction(l).S}
          }
        ),
      }, {
        label: "M",
        borderColor: "green",
        fill: false,
        data: Array.from(
          {length: (this.to - this.from) / this.step + 1},
          (_, i) => {
            let l = this.from + i * this.step;
            return {x: l, y: lmsConeResponseFunction(l).M}
          }
        ),
      }, {
        label: "L",
        borderColor: "red",
        fill: false,
        data: Array.from(
          {length: (this.to - this.from) / this.step + 1},
          (_, i) => {
            let l = this.from + i * this.step;
            return {x: l, y: lmsConeResponseFunction(l).L}
          }
        ),
      }];
      this.chart.data.datasets = datasets;
      this.chart.update();
    }
  }
}
