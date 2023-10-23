import {
  Button,
  Calendar,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  LocaleProvider,
  unstable_Popper as Popper,
} from '@vkontakte/vkui'
import { ReactNode, forwardRef } from 'preact/compat'
import { useEffect, useImperativeHandle, useRef, useState } from 'preact/hooks'
import { FunctionalComponent } from 'preact'

interface CalendarRangeProps {
  label: string | ReactNode
  onDateChange?: (newDate: Date) => void
  value?: Date
}

/*//@ts-ignore типы React не совсем совместимы с Preact*/
const CalendarRange: FunctionalComponent<CalendarRangeProps> = forwardRef(
  //@ts-ignore типы React не совсем совместимы с Preact
  ({ label, onDateChange, value }, ref) => {
    const [startDate, setStartDate] = useState<Date | undefined>(value)
    const [shown, setShown] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    const handleButtonClick = () => {
      setShown(!shown)
    }

    const handleDateChange = (newDate: Date) => {
      setStartDate(newDate)
      if (onDateChange) {
        onDateChange(newDate)
      }
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        shown &&
        buttonRef.current &&
        calendarRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShown(false)
      }
    }

    useEffect(() => {
      document.addEventListener('click', handleOutsideClick)
      return () => {
        document.removeEventListener('click', handleOutsideClick)
      }
    }, [shown])

    useImperativeHandle(ref, () => ({
      close: () => {
        setShown(false)
      },
    }))

    return (
      <FormLayout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          {label}{' '}
          <Button getRootRef={buttonRef} onClick={handleButtonClick}>
            {shown ? 'Закрыть' : 'Открыть'}
          </Button>
        </div>
        {shown && (
          <Popper targetRef={buttonRef}>
            <FormLayoutGroup mode="vertical">
              {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
              <FormItem>
                <LocaleProvider value="ru">
                  <div ref={calendarRef}>
                    <Calendar
                      value={startDate}
                      onChange={handleDateChange}
                      enableTime={false}
                      disablePast={false}
                      disableFuture={false}
                      disablePickers
                      showNeighboringMonth={false}
                      size="s"
                      listenDayChangesForUpdate={false}
                    />
                  </div>
                </LocaleProvider>
              </FormItem>
            </FormLayoutGroup>
          </Popper>
        )}
      </FormLayout>
    )
  }
)

export default forwardRef<HTMLDivElement, CalendarRangeProps>(CalendarRange)
