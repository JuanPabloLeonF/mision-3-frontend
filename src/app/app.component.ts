import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NavComponent } from './components/nav/nav.component';
import { listImgBg } from './data/data.img';
import { SectionMainComponent } from './components/section-main/section-main.component';

@Component({
  selector: 'app-root',
  imports: [
    NavComponent,
    SectionMainComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected listImgs: string[] = listImgBg;
  protected imgSelected: string = this.listImgs[0];
  private index: number = 0;
  private direction: number = 1;
  protected openNav: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit() {
    setInterval(() => {
      this.changeImgSelected()
    }, 5000)
  }

  private changeImgSelected(): void {     
    this.index += this.direction;
    if (this.index === this.listImgs.length - 1 || this.index === 0) {
      this.direction *= -1;
    }
    this.imgSelected = this.listImgs[this.index];   
  }

  protected openNavSection(): void {
    this.openNav.set(true);
  }
}
