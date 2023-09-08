import React, {
  FC, useRef, useState, useEffect, ReactNode,
} from 'react';
import {
  Button,
  Calendar,
  Div,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  LocaleProvider,
  unstable_Popper as Popper,
} from '@vkontakte/vkui';
import PropTypes from 'prop-types';

interface CalendarRangeProps {
  label: string | ReactNode;
  onDateChange?: (newDate: Date) => void;
  value?: Date;
}

const CalendarRange: FC<CalendarRangeProps> = React.forwardRef(
  ({ label, onDateChange, value }, ref) => {
    const [startDate, setStartDate] = useState<Date | undefined>(value);
    const [shown, setShown] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const handleButtonClick = () => {
      setShown(!shown);
    };

    const handleDateChange = (newDate: Date) => {
      setStartDate(newDate);
      if (onDateChange) {
        onDateChange(newDate);
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        shown
        && buttonRef.current
        && calendarRef.current
        && !buttonRef.current.contains(event.target as Node)
        && !calendarRef.current.contains(event.target as Node)
      ) {
        setShown(false);
      }
    };

    useEffect(() => {
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }, [shown]);

    React.useImperativeHandle(ref, () => ({
      close: () => {
        setShown(false);
      },
    }));

    return (
      <FormLayout>
        <Div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {label}
            {' '}
            <Button getRootRef={buttonRef} onClick={handleButtonClick}>
              {shown ? 'Закрыть' : 'Открыть'}
            </Button>
          </div>
          {shown && (
            <Popper targetRef={buttonRef}>
              <FormLayoutGroup mode='vertical'>
                <FormItem>
                  <LocaleProvider value='ru'>
                    <div ref={calendarRef}>
                      <Calendar
                        value={startDate}
                        onChange={handleDateChange}
                        enableTime={false}
                        disablePast={false}
                        disableFuture={false}
                        disablePickers
                        showNeighboringMonth={false}
                        size='s'
                        listenDayChangesForUpdate={false}
                      />
                    </div>
                  </LocaleProvider>
                </FormItem>
              </FormLayoutGroup>
            </Popper>
          )}
        </Div>
      </FormLayout>
    );
  },
);

CalendarRange.propTypes = {
  label: PropTypes.string.isRequired,
  onDateChange: PropTypes.func,
  value: PropTypes.instanceOf(Date),
};

export default CalendarRange;
