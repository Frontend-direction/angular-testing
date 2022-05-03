import {ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {CourseComponent} from "./course.component";
import {CoursesModule} from "../courses.module";
import {findLessons, setupCourses, setupLessonsById} from "../common/setup-test-data";
import {COURSES, LESSONS} from "../../../../server/db-data";
import {CoursesService} from "../services/courses.service";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {CollectionViewer} from "@angular/cdk/collections";
import {log} from "util";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {click} from "../common/test-utils";

fdescribe('Course component', () => {
  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;
  let el: DebugElement;
  let coursesService: any;

  const course = COURSES[12];

  beforeEach(waitForAsync(() => {

    const coursesSpy = jasmine.createSpyObj('coursesService', ['findLessons']);

    TestBed.configureTestingModule({
      imports: [ CoursesModule,  NoopAnimationsModule ],
      providers: [
        { provide: CoursesService, useValue: coursesSpy },
        { provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                course: course
              }
            }
          }}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CourseComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      })
  }));

  it('should render component', function () {
    expect(component).toBeTruthy();
  });

  it('should render list of lessons on start',  fakeAsync(() => {
    const courseId = +course.id

    coursesService.findLessons.and.returnValue(of(setupLessonsById(courseId)))
    fixture.detectChanges();

    const lessons = el.queryAll(By.css('.mat-row'));
    expect(lessons.length).toBe(10, 'Unexpected quantity of lessons');
    expect(lessons[0].nativeElement.textContent).toContain('Angular Testing Course - Helicopter View');
  }));

  it('should rerender list of lessons when sort change', fakeAsync(() => {
    const courseId = +course.id

    coursesService.findLessons.and.callFake(() => {
      return of(findLessons(courseId, '', component.sort.direction))
    })
    fixture.detectChanges();

    const sortBtn = el.query(By.css('.mat-sort-header'));

    click(sortBtn);
    fixture.detectChanges();

    const lessons = el.queryAll(By.css('.mat-row'));

    expect(lessons[0].nativeElement.textContent).toContain('Testing Angular Components with the DOM');
  }));

  it('should rerender list of lessons when paginator change', function () {
    const courseId = +course.id

    coursesService.findLessons.and.callFake(() => {
      return of(findLessons(courseId, component.input.nativeElement.value, component.sort.direction))
    });
    fixture.detectChanges();
  });

  it('should find particular lessons depends on search token',  fakeAsync(() => {
    const courseId = +course.id

    coursesService.findLessons.and.callFake(() => {
      return of(findLessons(courseId, component.input.nativeElement.value, component.sort.direction))
    });
    fixture.detectChanges();

    component.input.nativeElement.value = 'Ja';
    component.input.nativeElement.dispatchEvent(new Event('input'));
    tick(150);
    fixture.detectChanges();

    const lessons = el.queryAll(By.css('.mat-row'));

    expect(lessons[0].nativeElement.textContent).toContain('Introduction to Jasmine, Spies and specs');

  }));

})
