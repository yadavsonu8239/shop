'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface DatePickerProps {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const daysInCalendar = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
    });

    const handleDateClick = (date: Date) => {
        onDateChange(date);
        setIsOpen(false);
    };

    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base shadow-sm"
            >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                <span className="font-medium text-gray-700 truncate">
                    {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select Date'}
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3 sm:p-4 w-[280px] sm:w-[320px] max-w-[calc(100vw-2rem)]">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <button
                            onClick={previousMonth}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div
                                key={day}
                                className="text-center text-[10px] sm:text-xs font-medium text-gray-500 py-1"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                        {daysInCalendar.map((day, idx) => {
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isTodayDate = isToday(day);

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDateClick(day)}
                                    disabled={!isCurrentMonth}
                                    className={`
                    p-1.5 sm:p-2 text-xs sm:text-sm rounded-md sm:rounded-lg transition-all
                    ${!isCurrentMonth && 'text-gray-300 cursor-not-allowed'}
                    ${isCurrentMonth && !isSelected && !isTodayDate && 'text-gray-700 hover:bg-gray-100'}
                    ${isSelected && 'bg-primary-600 text-white font-semibold hover:bg-primary-700'}
                    ${isTodayDate && !isSelected && 'bg-blue-100 text-blue-600 font-semibold'}
                  `}
                                >
                                    {format(day, 'd')}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex gap-2">
                        <button
                            onClick={() => handleDateClick(new Date())}
                            className="flex-1 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => {
                                onDateChange(new Date());
                                setIsOpen(false);
                            }}
                            className="flex-1 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
