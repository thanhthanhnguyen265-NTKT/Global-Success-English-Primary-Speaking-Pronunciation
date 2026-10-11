import { Unit } from '../types/curriculum';
import { GRADE_1_UNITS } from './grade1';
import { GRADE_2_UNITS } from './grade2';
import { GRADE_3_UNITS } from './grade3';
import { GRADE_4_UNITS } from './grade4';
import { GRADE_5_UNITS } from './grade5';

export const DEFAULT_GLOBAL_SUCCESS_CURRICULUM: Unit[] = [
  ...GRADE_1_UNITS,
  ...GRADE_2_UNITS,
  ...GRADE_3_UNITS,
  ...GRADE_4_UNITS,
  ...GRADE_5_UNITS,
];
