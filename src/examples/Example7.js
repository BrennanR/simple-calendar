// @flow

import React, { useState } from 'react';
import type { Node } from 'react';

import { Pager } from './Pager';
import { Calendar } from '../lib/Calendar';
import { localizedWeekdayNames, localizedYearMonth } from '../lib/util/localizeDate';
import { nextYearMonth, previousYearMonth } from '../lib/util/date';
import { DefaultCalendarHeading } from '../lib/components/defaults/DefaultCalendarHeading';

const locale = 'en-us';

const Day = ({ date }: { date: Date }) => {
  const dayNumber = date.getDate();
  const dayText = dayNumber === 1 ? `${date.toLocaleDateString(locale, { month: 'short' })} ${dayNumber}` : dayNumber;
  return (
    <div style={{ display: 'flex', flex: 1, flexBasis: `auto`, justifyContent: `flexStart` }} className="calendar-day">
      <div style={{ display: 'flex', flex: 1, flexBasis: `auto`, margin: 5 }}>{dayText}</div>
    </div>
  );
};

const weekdayNames = localizedWeekdayNames(locale, 'long');
const renderDayHeading = (dayIndex: number): Node => <div>{weekdayNames[dayIndex]}</div>;
const CalendarMonth = ({ year, month }: { year: number, month: number }) => (
  <Calendar
    locale={locale}
    year={year}
    month={month}
    renderDay={date => <Day date={date} />}
    renderDayHeading={renderDayHeading}
  />
);

const yearMonthToKey = (yearMonth: { year: number, month: number }): string =>
  `${yearMonth.year}${`-`}${yearMonth.month}`;

const monthSliderEntry = (yearMonth): { key: string, element: any } => ({
  key: yearMonthToKey(yearMonth),
  element: <CalendarMonth key={yearMonthToKey(yearMonth)} year={yearMonth.year} month={yearMonth.month} />,
});

export const Example7 = () => {
  const [currentYearMonth, setCurrentYearMonth] = useState<{ year: number, month: number }>({ year: 2019, month: 6 });
  const [monthsInSlider, setMonthsInSlider] = useState<Array<{ key: string, element: any }>>([
    monthSliderEntry(previousYearMonth(currentYearMonth)),
    monthSliderEntry(currentYearMonth),
    monthSliderEntry(nextYearMonth(currentYearMonth)),
  ]);

  const appendMonths = appendStartingAtYearMonth => {
    setMonthsInSlider(prevMonths => {
      // If we have more than 5 months, start dropping extras.
      const leadingMonths = prevMonths.length > 5 ? prevMonths.slice(1, prevMonths.length) : prevMonths;
      return [...leadingMonths, monthSliderEntry(appendStartingAtYearMonth)];
    });
  };

  const prependMonths = prependStartingAtYearMonth => {
    // If we have more than 5 months, start dropping extras.
    setMonthsInSlider(prevMonths => {
      const trailingMonths = prevMonths.length > 5 ? prevMonths.slice(0, prevMonths.length - 1) : prevMonths;
      return [monthSliderEntry(prependStartingAtYearMonth), ...trailingMonths];
    });
  };

  return (
    <div style={{ display: `flex`, flexDirection: `column`, height: `100%`, width: `100%` }}>
      <DefaultCalendarHeading
        title={localizedYearMonth(locale, 'long', 'numeric', currentYearMonth.year, currentYearMonth.month)}
        onNextMonthClicked={() => {
          const newYearMonth = nextYearMonth(currentYearMonth);
          if (yearMonthToKey(newYearMonth) === monthsInSlider[monthsInSlider.length - 1].key) {
            appendMonths(nextYearMonth(newYearMonth));
          }
          setCurrentYearMonth(newYearMonth);
        }}
        onPreviousMonthClicked={() => {
          const newYearMonth = previousYearMonth(currentYearMonth);
          if (yearMonthToKey(newYearMonth) === monthsInSlider[0].key) {
            prependMonths(previousYearMonth(newYearMonth));
          }
          setCurrentYearMonth(newYearMonth);
        }}
      />
      <Pager currentPageKey={yearMonthToKey(currentYearMonth)} pages={monthsInSlider} />
    </div>
  );
};
