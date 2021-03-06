// @flow

import React, { Component } from 'react';
import type { Element } from 'react';

import { Calendar } from '../lib/Calendar';
import { DefaultCalendarHeading } from '../lib/components/defaults/DefaultCalendarHeading';
import { nextMonth, previousMonth } from '../lib/util/date';
import { localizedWeekdayNames, localizedYearMonth } from '../lib/util/localizeDate';

type State = {
  year: number,
  month: number,
  focusedCellID: ?string,
};

type Props = {};

export class Example1 extends Component<Props, State> {
  locale = 'en-us';
  localizedWeekdayNames = localizedWeekdayNames(this.locale, 'long');

  constructor(props: Props) {
    super(props);
    const date = new Date();
    this.state = { year: date.getFullYear(), month: date.getMonth() + 1, focusedCellID: null };
  }

  onDayFocused = (date: Date, cellID: string) => {
    this.setState({ focusedCellID: cellID });
  };

  onDayLostFocus = (date: Date, cellID: string) => {
    if (this.state.focusedCellID === cellID) {
      this.setState({ focusedCellID: null });
    }
  };

  renderDay = (date: Date, cellID: string, selectedYear: number, selectedMonth: number) => {
    const dayNumber = date.getDate();
    const dayText =
      dayNumber === 1 ? `${date.toLocaleDateString(this.locale, { month: 'short' })} ${dayNumber}` : dayNumber;
    const selectedMonthStartDate = new Date(selectedYear, selectedMonth - 1, 1); // first day of month.
    const selectedMonthEndDate = new Date(selectedYear, selectedMonth, 0); // last day of month.
    const dayIsInSelectedMonth = date >= selectedMonthStartDate && date <= selectedMonthEndDate;
    const isToday = new Date().toDateString() === date.toDateString();
    let color = `grey`;
    let fontWeight = `normal`;
    if (isToday) {
      color = `blue`;
      fontWeight = `bold`;
    } else if (dayIsInSelectedMonth) {
      color = `black`;
    }
    const focusedStyle =
      this.state.focusedCellID === cellID
        ? {
            backgroundColor: `yellow`,
            boxShadow: `0px 0px 5px blue`,
            overflow: `visible`,
          }
        : {};
    return (
      <div
        tabIndex={0}
        onFocus={() => this.onDayFocused(date, cellID)}
        onBlur={() => this.onDayLostFocus(date, cellID)}
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flexStart',
          cursor: 'pointer',
          userSelect: 'none',
          ...focusedStyle,
        }}
        className="calendar-day"
      >
        <div style={{ display: 'flex', flex: 1, margin: 5, color, fontWeight }}>{dayText}</div>
      </div>
    );
  };

  renderDayHeading = (dayIndex: number): Element<*> => <div>{this.localizedWeekdayNames[dayIndex]}</div>;

  renderHeading = () => {
    return (
      <DefaultCalendarHeading
        title={localizedYearMonth(this.locale, 'long', 'numeric', this.state.year, this.state.month)}
        onNextMonthClicked={() => this.setState({ ...nextMonth(this.state.year, this.state.month) })}
        onPreviousMonthClicked={() => this.setState({ ...previousMonth(this.state.year, this.state.month) })}
      />
    );
  };

  render() {
    return (
      <Calendar
        locale={this.locale}
        year={this.state.year}
        month={this.state.month}
        renderDay={(date, cellID) => this.renderDay(date, cellID, this.state.year, this.state.month)}
        renderDayHeading={this.renderDayHeading}
        renderHeading={this.renderHeading}
        borderOptions={{ width: 1, color: 'black' }}
      />
    );
  }
}
