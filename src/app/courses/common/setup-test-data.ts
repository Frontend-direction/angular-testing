import {Course} from '../model/course';
import {COURSES, LESSONS} from '../../../../server/db-data';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Lesson} from "../model/lesson";


export function setupCourses() : Course[] {
  return Object.values(COURSES).sort(sortCoursesBySeqNo) as Course[];
}

export function setupLessonsById(id: number): Lesson[] {
  return Object.values(LESSONS).filter(lesson => lesson.courseId === id);
}

export function setupLessonsFilter(filter: string): Lesson[] {
  return Object.values(LESSONS).filter(lesson => lesson.description.trim().toLowerCase().search(filter.toLowerCase()) >= 0);
}

export function setupLessonsOrder(order: string = 'asc'): Lesson[] {
  const sortFn = order === 'asc' ? (a, b) => a.id - b.id : (a, b) => b.id - a.id;
  return Object.values(LESSONS).sort(sortFn);
}

export function setupLessonsByPageSize(size: number): Lesson[] {
  return Object.values(LESSONS).slice(0, size)
}


export function findLessons(
  courseId:number, filter = '', sortOrder = 'asc',
  pageNumber = 0, pageSize = 3
): Lesson[] {

  return setupLessonsOrder(sortOrder)
    .filter(lesson => lesson.courseId == courseId)
    .filter(lesson => lesson.description.trim().toLowerCase().search(filter.toLowerCase()) >= 0)
    .slice(pageNumber * pageSize, pageNumber * pageSize + pageSize )
}

