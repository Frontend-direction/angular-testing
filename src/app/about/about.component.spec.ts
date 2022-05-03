import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {AboutComponent} from "./about.component";
import {DebugElement} from "@angular/core";
import { By } from "@angular/platform-browser";

describe('About component', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      })
  }));

  it('should create the component', function () {
    expect(component).toBeTruthy();
  });

  it('should render title', function () {
    const title = el.query(By.css('.container h1'));

    expect(title.nativeElement.textContent).toBe('Welcome!');
  });

  it('should  render banner', function () {
    const image = el.query(By.css('.course-image'));
    console.log(image)
    expect(image.nativeElement.src).toBe('https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png')
  });
})
