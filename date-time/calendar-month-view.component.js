import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { CalendarCell, OwlCalendarBodyComponent } from './calendar-body.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { Subscription } from 'rxjs/Subscription';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
var DAYS_PER_WEEK = 7;
var WEEKS_PER_VIEW = 6;
var OwlMonthViewComponent = (function () {
    function OwlMonthViewComponent(cdRef, dateTimeAdapter, dateTimeFormats) {
        this.cdRef = cdRef;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        this._selecteds = [];
        this.localeSub = Subscription.EMPTY;
        this.initiated = false;
        this.selectedDates = [];
        this.selectedChange = new EventEmitter();
        this.userSelection = new EventEmitter();
        this.pickerMomentChange = new EventEmitter();
    }
    Object.defineProperty(OwlMonthViewComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            var oldSelected = this._selected;
            value = this.dateTimeAdapter.deserialize(value);
            this._selected = this.getValidDate(value);
            if (!this.dateTimeAdapter.isSameDay(oldSelected, this._selected)) {
                this.setSelectedDates();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "selecteds", {
        get: function () {
            return this._selecteds;
        },
        set: function (values) {
            var _this = this;
            this._selecteds = values.map(function (v) {
                v = _this.dateTimeAdapter.deserialize(v);
                return _this.getValidDate(v);
            });
            this.setSelectedDates();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "pickerMoment", {
        get: function () {
            return this._pickerMoment;
        },
        set: function (value) {
            var oldMoment = this._pickerMoment;
            value = this.dateTimeAdapter.deserialize(value);
            this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();
            this.firstDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this._pickerMoment), this.dateTimeAdapter.getMonth(this._pickerMoment), 1);
            if (!this.isSameMonth(oldMoment, this._pickerMoment) && this.initiated) {
                this.generateCalendar();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "dateFilter", {
        get: function () {
            return this._dateFilter;
        },
        set: function (filter) {
            this._dateFilter = filter;
            if (this.initiated) {
                this.generateCalendar();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "minDate", {
        get: function () {
            return this._minDate;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._minDate = this.getValidDate(value);
            if (this.initiated) {
                this.generateCalendar();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "maxDate", {
        get: function () {
            return this._maxDate;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._maxDate = this.getValidDate(value);
            if (this.initiated) {
                this.generateCalendar();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "weekdays", {
        get: function () {
            return this._weekdays;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "days", {
        get: function () {
            return this._days;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "activeCell", {
        get: function () {
            if (this.pickerMoment) {
                return this.dateTimeAdapter.getDate(this.pickerMoment) + this.firstRowOffset - 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "isInSingleMode", {
        get: function () {
            return this.selectMode === 'single';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "isInRangeMode", {
        get: function () {
            return this.selectMode === 'range' || this.selectMode === 'rangeFrom'
                || this.selectMode === 'rangeTo';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMonthViewComponent.prototype, "owlDTCalendarView", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    OwlMonthViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.generateWeekDays();
        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(function () {
            _this.generateWeekDays();
            _this.generateCalendar();
            _this.cdRef.markForCheck();
        });
    };
    OwlMonthViewComponent.prototype.ngAfterContentInit = function () {
        this.generateCalendar();
        this.initiated = true;
    };
    OwlMonthViewComponent.prototype.ngOnDestroy = function () {
        this.localeSub.unsubscribe();
    };
    OwlMonthViewComponent.prototype.dateSelected = function (date) {
        var daysDiff = date - 1;
        var selected = this.dateTimeAdapter.addCalendarDays(this.firstDateOfMonth, daysDiff);
        if ((this.isInSingleMode && this.selectedDates[0] !== date) ||
            this.isInRangeMode) {
            this.selectedChange.emit(selected);
        }
        this.userSelection.emit();
    };
    OwlMonthViewComponent.prototype.handleCalendarKeydown = function (event) {
        var moment;
        switch (event.keyCode) {
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -7);
                this.pickerMomentChange.emit(moment);
                break;
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 7);
                this.pickerMomentChange.emit(moment);
                break;
            case HOME:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 1 - this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            case END:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment) -
                    this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            case PAGE_UP:
                moment = event.altKey ?
                    this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1) :
                    this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            case PAGE_DOWN:
                moment = event.altKey ?
                    this.dateTimeAdapter.addCalendarYears(this.pickerMoment, 1) :
                    this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            case ENTER:
                if (!this.dateFilter || this.dateFilter(this.pickerMoment)) {
                    this.dateSelected(this.dateTimeAdapter.getDate(this.pickerMoment));
                }
                break;
            default:
                return;
        }
        this.focusActiveCell();
        event.preventDefault();
    };
    OwlMonthViewComponent.prototype.generateWeekDays = function () {
        var longWeekdays = this.dateTimeAdapter.getDayOfWeekNames('long');
        var shortWeekdays = this.dateTimeAdapter.getDayOfWeekNames('short');
        var narrowWeekdays = this.dateTimeAdapter.getDayOfWeekNames('narrow');
        var firstDayOfWeek = this.firstDayOfWeek;
        var weekdays = longWeekdays.map(function (long, i) {
            return { long: long, short: shortWeekdays[i], narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        return;
    };
    OwlMonthViewComponent.prototype.generateCalendar = function () {
        if (!this.pickerMoment) {
            return;
        }
        this.todayDate = null;
        var startWeekdayOfMonth = this.dateTimeAdapter.getDay(this.firstDateOfMonth);
        var firstDayOfWeek = this.firstDayOfWeek;
        var daysDiff = 0 - (startWeekdayOfMonth + (DAYS_PER_WEEK - firstDayOfWeek)) % DAYS_PER_WEEK;
        this.firstRowOffset = Math.abs(daysDiff);
        this._days = [];
        for (var i = 0; i < WEEKS_PER_VIEW; i++) {
            var week = [];
            for (var j = 0; j < DAYS_PER_WEEK; j++) {
                var date = this.dateTimeAdapter.addCalendarDays(this.firstDateOfMonth, daysDiff);
                var dateCell = this.createDateCell(date, daysDiff);
                if (this.dateTimeAdapter.isSameDay(this.dateTimeAdapter.now(), date)) {
                    this.todayDate = daysDiff + 1;
                }
                week.push(dateCell);
                daysDiff += 1;
            }
            this._days.push(week);
        }
        this.setSelectedDates();
    };
    OwlMonthViewComponent.prototype.createDateCell = function (date, daysDiff) {
        var daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment);
        var dateNum = this.dateTimeAdapter.getDate(date);
        var ariaLabel = this.dateTimeAdapter.format(date, this.dateTimeFormats.dateA11yLabel);
        var enabled = this.isDateEnabled(date);
        var dayValue = daysDiff + 1;
        var out = dayValue < 1 || dayValue > daysInMonth;
        return new CalendarCell(dayValue, dateNum.toString(), ariaLabel, enabled, out);
    };
    OwlMonthViewComponent.prototype.isDateEnabled = function (date) {
        return !!date &&
            (!this.dateFilter || this.dateFilter(date)) &&
            (!this.minDate || this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
            (!this.maxDate || this.dateTimeAdapter.compare(date, this.maxDate) <= 0);
    };
    OwlMonthViewComponent.prototype.getValidDate = function (obj) {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    };
    OwlMonthViewComponent.prototype.isSameMonth = function (dateLeft, dateRight) {
        return !!(dateLeft && dateRight &&
            this.dateTimeAdapter.isValid(dateLeft) && this.dateTimeAdapter.isValid(dateRight) &&
            this.dateTimeAdapter.getYear(dateLeft) === this.dateTimeAdapter.getYear(dateRight) &&
            this.dateTimeAdapter.getMonth(dateLeft) === this.dateTimeAdapter.getMonth(dateRight));
    };
    OwlMonthViewComponent.prototype.setSelectedDates = function () {
        var _this = this;
        this.selectedDates = [];
        if (!this.firstDateOfMonth) {
            return;
        }
        if (this.isInSingleMode && this.selected) {
            var dayDiff = this.dateTimeAdapter.differenceInCalendarDays(this.selected, this.firstDateOfMonth);
            this.selectedDates[0] = dayDiff + 1;
            return;
        }
        if (this.isInRangeMode && this.selecteds) {
            this.selectedDates = this.selecteds.map(function (selected) {
                if (_this.dateTimeAdapter.isValid(selected)) {
                    var dayDiff = _this.dateTimeAdapter.differenceInCalendarDays(selected, _this.firstDateOfMonth);
                    return dayDiff + 1;
                }
                else {
                    return null;
                }
            });
        }
    };
    OwlMonthViewComponent.prototype.focusActiveCell = function () {
        this.calendarBodyElm.focusActiveCell();
    };
    OwlMonthViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'owl-date-time-month-view',
                    exportAs: 'owlYearView',
                    template: "<table class=\"owl-dt-calendar-table\"><thead class=\"owl-dt-calendar-header\"><tr class=\"owl-dt-weekdays\"><th *ngFor=\"let weekday of weekdays\" [attr.aria-label]=\"weekday.long\" class=\"owl-dt-weekday\" scope=\"col\"><span>{{weekday.short}}</span></th></tr><tr><th class=\"owl-dt-calendar-table-divider\" aria-hidden=\"true\" colspan=\"7\"></th></tr></thead><tbody owl-date-time-calendar-body role=\"grid\" [rows]=\"days\" [todayValue]=\"todayDate\" [selectedValues]=\"selectedDates\" [selectMode]=\"selectMode\" [activeCell]=\"activeCell\" (keydown)=\"handleCalendarKeydown($event)\" (selectedValueChange)=\"dateSelected($event)\"></tbody></table>",
                    styles: [""],
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    OwlMonthViewComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [OWL_DATE_TIME_FORMATS,] },] },
    ]; };
    OwlMonthViewComponent.propDecorators = {
        "firstDayOfWeek": [{ type: Input },],
        "selectMode": [{ type: Input },],
        "selected": [{ type: Input },],
        "selecteds": [{ type: Input },],
        "pickerMoment": [{ type: Input },],
        "dateFilter": [{ type: Input },],
        "minDate": [{ type: Input },],
        "maxDate": [{ type: Input },],
        "selectedChange": [{ type: Output },],
        "userSelection": [{ type: Output },],
        "pickerMomentChange": [{ type: Output },],
        "calendarBodyElm": [{ type: ViewChild, args: [OwlCalendarBodyComponent,] },],
        "owlDTCalendarView": [{ type: HostBinding, args: ['class.owl-dt-calendar-view',] },],
    };
    return OwlMonthViewComponent;
}());
export { OwlMonthViewComponent };
