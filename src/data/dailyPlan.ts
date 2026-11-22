export type DailyGoalMinutes = 10 | 15 | 20;

export interface DailyPlanSpec {
  totalMinutes: DailyGoalMinutes;
  vocabMinutes: number;
  grammarMinutes: number;
  readingMinutes: number;
  vocabTarget: number;
}

export const DAILY_PLAN_CONFIG: Record<DailyGoalMinutes, DailyPlanSpec> = {
  10: {
    totalMinutes: 10,
    vocabMinutes: 3,
    grammarMinutes: 4,
    readingMinutes: 3,
    vocabTarget: 3
  },
  15: {
    totalMinutes: 15,
    vocabMinutes: 5,
    grammarMinutes: 6,
    readingMinutes: 4,
    vocabTarget: 5
  },
  20: {
    totalMinutes: 20,
    vocabMinutes: 7,
    grammarMinutes: 8,
    readingMinutes: 5,
    vocabTarget: 7
  }
};
