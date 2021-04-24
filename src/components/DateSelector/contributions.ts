/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Business logic for calculating post contributions by tag.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import flatMap from 'lodash.flatmap';
import compose from 'lodash.compose';
import * as dayjs from 'dayjs';
import {
  WeekMapping,
  ContributionPage,
  MonthSummary,
  WeekSummary,
  ContributionSummary,
  PagedContributionSummary,
  TagQuery,
  DateSelectorPostQuery
} from './types';

const DATE_FORMAT = 'MM/DD/YYYY';
const DAY_FORMAT = 'ddd';
const MONTH_FORMAT = 'MMM';

/**
 * Decide whether or not to aggregate tag counts into an existing week.
 * @param monthSummary - The month contribution summary.
 * @param week - The first day of week to consider.
 * @returns {true} if should aggregate counts from given week in existing week.
 */
const shouldAggregateWeek = (
  monthSummary: MonthSummary,
  week: dayjs.Dayjs
): boolean => (
  monthSummary.weeks[week.format(DATE_FORMAT)] !== undefined ||
  Object.keys(monthSummary.weeks).length < 4
);

/**
 * Gets or creates a month entry to contain a date.
 * @param summary - The contribution summary.
 * @param date - The date to contain within the month.
 * @returns - The first day of existing or new month.
 */
const pushMonth = (
  summary: ContributionSummary,
  date: dayjs.Dayjs
): dayjs.Dayjs => {
  const firstOfMonth = date.date(1);
  const monthSummary = summary.months[firstOfMonth.format(DATE_FORMAT)];

  if (monthSummary) {
    if (shouldAggregateWeek(monthSummary, getFirstDayOfWeek(firstOfMonth))) {
      // Use the month of the entry
      return firstOfMonth;
    } else {
      const nextMonth = firstOfMonth.add(1, 'month');

      if (nextMonth.month() - getFirstDayOfWeek(date).month() > 1) {
        // Move most recent entry from the current month into next month
        const maxWeek = Object.keys(monthSummary.weeks).sort().reverse()[0];
        const nextMonthSummary = summary.months[nextMonth.format(DATE_FORMAT)];

        if (nextMonthSummary.weeks[maxWeek]) {
          // Last month already has this week, merge into existing entry
          mergeWeek(nextMonthSummary.weeks[maxWeek], monthSummary.weeks[maxWeek]);
        } else {
          // Last month has no entry for this week, merge into a new entry
          nextMonthSummary.weeks[maxWeek] = monthSummary.weeks[maxWeek];
        }

        // Use the month of the entry after moving an older entry out
        monthSummary.weeks[maxWeek] = undefined;
        return firstOfMonth;
      } else {
        // Move this entry into next month
        return nextMonth;
      }
    }
  }

  // Aggregate in a new month
  summary.months[firstOfMonth.format(DATE_FORMAT)] = {
    tags: {},
    weeks: {},
    posts: 0,
    max: 0
  };

  return firstOfMonth;
};

/**
 * Merge with another week summary.
 * @param target - The week summary to merge into.
 * @param merge - The week summary to merge.
 */
const mergeWeek = (
  target: WeekSummary,
  merge: WeekSummary
): void => {
  Object
    .keys(merge.posts)
    .forEach((slug) => {
      if (!target.posts[slug]) {
        target.posts[slug] = merge.posts[slug];
      }
    });

  Object
    .keys(merge.tags)
    .forEach((tag) => aggregateTag(target, tag, merge.tags[tag]));

  Object
    .keys(merge.days)
    .forEach((day) => aggregateDay(target, day, merge.days[day].tags, merge.days[day].count))
};

/**
 * Get or create a week entry.
 * @param summary - Month contribution summary.
 * @param firstDayOfMonth - The first day of month.
 * @param firstDayOfWeek - The first day of week.
 * @returns an existing week entry if exists or a new entry added to month.
 */
const pushWeek = (
  summary: MonthSummary,
  firstDayOfMonth: dayjs.Dayjs,
  firstDayOfWeek: dayjs.Dayjs
): WeekSummary => {
  const week = firstDayOfWeek.format(DATE_FORMAT);
  if (summary.weeks[week]) return summary.weeks[week];

  summary.weeks[week] = {
    tags: {},
    days: {},
    posts: {},
    offset: getWeekOffset(firstDayOfMonth, firstDayOfWeek),
    max: 0,
    total: 0
  };

  return summary.weeks[week];
}

/**
 * Get week display offset.
 * @param firstDayOfMonth - The first day of month.
 * @param firstDayOfWeek - The first day of week.
 * @returns a week offset within the month.
 */
const getWeekOffset = (
  firstDayOfMonth: dayjs.Dayjs,
  firstDayOfWeek: dayjs.Dayjs
): number => {
  const firstWeekOfMonth = getFirstDayOfWeek(firstDayOfMonth);

  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    const firstDayOfWeekOffset = firstWeekOfMonth.add(weekOffset * 6, 'days');

    if (firstDayOfWeek === firstDayOfWeekOffset)
      return weekOffset;
    else if (firstDayOfWeek < firstDayOfWeekOffset)
      return weekOffset - 1;
  }

  return 3;
}

/**
 * Aggregate count for the specified tag.
 * @param weekSummary - The week to aggregate the tag in.
 * @param tag - The tag to aggregate.
 * @param count - How many posts with that tag were authored that week.
 */
const aggregateTag = (
  weekSummary: WeekSummary,
  tag: string,
  count: number
) => {
  weekSummary.tags[tag] = (weekSummary.tags[tag] || 0) + count;
  weekSummary.total += count;
};

/**
 * Aggregate tags for the week.
 * @param weekSummary - The week to aggregate in.
 * @param postDate - The date of the post to aggregate.
 * @param postSlug - The slug of the post to aggregate (treated as unique id).
 * @param postTitle - The title of the post to aggregate.
 * @param postTag - The tag of the post to aggregate.
 * @returns the total tag count for the week with new tags aggregated.
 */
const aggregateWeek = (
  weekSummary: WeekSummary,
  postDate: dayjs.Dayjs,
  postSlug: string,
  postTitle: string,
  postTag: string
): number => {
  if (!weekSummary.posts[postSlug]) {
    weekSummary.posts[postSlug] = postTitle;
    aggregateTag(weekSummary, postTag, 1);
    aggregateDay(weekSummary, postDate.format(DAY_FORMAT).toLowerCase(), [postTag], 1);
  }

  return weekSummary.total;
};

/**
 * Aggregate count for the specified week day.
 * @param weekSummary - The week to aggregate count for.
 * @param weekDay - The week day to aggregate count for in DATE_FORMAT format.
 * @param tags - The tags to aggregate for the day.
 * @param count - The count of posts to aggregate on that day.
 */
const aggregateDay = (
  weekSummary: WeekSummary,
  weekDay: string,
  tags: string[],
  count: number
) => {
  let daySummary = weekSummary.days[weekDay];

  if (!daySummary) {
    daySummary = {
      tags: [],
      count: 0
    }
  }

  tags.forEach((tag) => {
    if (daySummary.tags.indexOf(tag) === -1) daySummary.tags.push(tag);
  });

  daySummary.count += count;

  weekSummary.days[weekDay] = daySummary;

  if (daySummary.count > weekSummary.max)
    weekSummary.max = daySummary.count;
};

/**
 * Aggregate a single tag from a single post for the month.
 * @param summary - The month contribution summary.
 * @param firstDayOfMonth - The first day of actual month where the post is to be aggregated.
 * @param postSlug - The post slug treated as unique id.
 * @param postTitle - The post title.
 * @param postDate - The post date.
 * @param postTag - The post tag to aggregate.
 */
const aggregateMonth = (
  summary: MonthSummary,
  firstDayOfMonth: dayjs.Dayjs,
  postSlug: string,
  postTitle: string,
  postDate: dayjs.Dayjs,
  postTag: string
): number => {
  // Aggregate post count for the month
  summary.posts++;

  // Aggregate tag counts for the month
  summary.tags[postTag] = (summary.tags[postTag] || 0) + 1;

  // Aggregate tag summary for the week
  const firstDayOfWeek = getFirstDayOfWeek(postDate);
  const weekMax = aggregateWeek(
    pushWeek(summary, firstDayOfMonth, firstDayOfWeek),
    postDate,
    postSlug,
    postTitle,
    postTag
  );

  // Aggregate max tags per week.
  if (summary.max < weekMax) summary.max = weekMax;

  return summary.max;
};

/**
 * Gets the first day of a week that contains the given date.
 * @param date - a date within the week to get first day of.
 * @returns the first day of containing week.
 */
const getFirstDayOfWeek = (date: dayjs.Dayjs): dayjs.Dayjs => {
  if (date.day() == 1) {
    // Monday - treated as start of week
    return date;
  } else if (date.day() == 0) {
    // Sunday - return Monday of last week
    return date.subtract(6, 'day');
  } else {
    // Any other day - return last Monday before
    return date.subtract(date.day() - 1, 'day');
  }
};

/**
 * Flatten a list of posts into a list of tags.
 * @param posts - The posts to normalize into contributions by tag.
 * @returns a list of tags where each tag contains details of the post it originally came from.
 */
 const normalizeContributions = (
  posts: DateSelectorPostQuery[]
): TagQuery[] => (
  flatMap(posts,
    ({
      slug,
      fields: {
        tags
      },
      frontmatter: {
        title,
        date
      }
    }) => tags.map((tag) => ({
      slug,
      title,
      date: dayjs(date),
      tag
    })))
);

/**
 * Reduces a list of tags into year, month, week, and day summaries.
 * @param year - The year to generate the summary for.
 * @param tags - The normalized list of tags, each with details of post it came from.
 * @returns a summary that can be used to render a stacked bar chart of post tags for each day.
 */
const aggregateContributions = (
  yearFilter: number = dayjs().year()
) => (
  tags: TagQuery[]
): ContributionSummary => (
  tags.reduce((summary, { slug, title, date, tag }) => {
    const year = date.year();

    if (year === yearFilter || (year < yearFilter && Object.keys(summary.months).length < 12)) {
      // Aggregate posts in previous years only to fill up extra month slots
      const firstDayOfMonth = pushMonth(summary, date);
      const monthSummary = summary.months[firstDayOfMonth.format(DATE_FORMAT)];
      const monthWeekMax = aggregateMonth(
        monthSummary,
        firstDayOfMonth,
        slug,
        title,
        date,
        tag
      );

      if (summary.max < monthWeekMax) {
        summary.max = monthWeekMax;
      }
    }

    if (summary.years.indexOf(year) === -1) {
      summary.years.push(year);
    }

    return summary;
  },
    {
      months: {},
      years: [],
      year: yearFilter,
      max: 0
    })
);

/**
 * Add paging structure to contribution summary.
 * @param limit - max posts per page.
 * @param summary - The contribution summary.
 * @returns paged contribution summary.
 */
 const paginateContributions = (
  limit?: number,
) => (
  summary: ContributionSummary,
): PagedContributionSummary => {
  let pages: ContributionPage[] = [];
  let start: WeekMapping = null;
  let postCount = 0;
  let lastMonth: string = null;
  let lastMonthDate: string = null;

  Object
    .keys(summary.months)
    .sort()
    .reverse()
    .forEach(monthDate => {
      const month = dayjs(monthDate).format(MONTH_FORMAT);
      const monthSummary = summary.months[monthDate];
      const weeks = Object
        .keys(monthSummary.weeks)
        .sort()
        .reverse();

      for (let week = 0; week < weeks.length; week++) {
        const firstDayOfWeek = weeks[week];
        const weekSummary = monthSummary.weeks[firstDayOfWeek];

        for (
          let postIndex = 0;
          postIndex < Object.keys(weekSummary.posts).length;
          postIndex++
        ) {
          // Begin page
          if (!start) start = { month, week };

          // Accumulate posts for this page
          postCount++;

          if (postCount === limit) {
            // End page
            pages.push({
              start,
              end: { month, week }
            });

            postCount = 0;
            start = null;
          }
        }
      }

      lastMonthDate = monthDate;
      lastMonth = month;
    });

  if (start) {
    // End last page
    pages.push({
      start,
      end: {
        month: lastMonth,
        week: Object.keys(summary.months[lastMonthDate].weeks).length - 1
      }
    });
  }

  return {
    ...summary,
    pages
  };
};

/**
 * Summarize contributions.
 * @param posts - The posts to summarize by year, month, week, and day.
 * @param year - The year to summarize.
 * @param limit - How many posts per page.
 * @returns the contribution summary for each tag of each post.
 */
export const getContributions = (
  posts: DateSelectorPostQuery[],
  year?: number,
  limit?: number
): PagedContributionSummary => {
  return compose(
    paginateContributions(limit),
    aggregateContributions(year),
    normalizeContributions
  )(posts);
};
