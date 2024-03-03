import { sequelize } from '@db'
import { Day } from '@diary-spo/shared'
import { getUserById } from '@models'

export const ScheduleGetFromDB = async (
  startDate: string,
  endDate: string,
  userId: number
) => {
  const user = await getUserById(userId, true)

  if (!user) {
    return null
  }
  const formatSchedules = await sequelize.query(
    /*crypto*/ `SELECT 
	json_build_object(
    'date', s."date" ,
    'lessons', json_agg(
      json_build_object(
        'startTime', s."startTime",
        'endTime', s."endTime",
        'gradebook', 
          case
            when g."idFromDiary" is null then null
            else jsonb_build_object(
              'id', g."idFromDiary",
              'lessonType', lt.name,
              'tasks', 
              case
                when t.id is null then json_build_array()
                else json_build_array(
                  json_build_object(
                    'topic', t.topic,
                    'id', t."idFromDiary",
                    'isRequired', r."isRequired",
                    'mark', '',
                    'type', tt."name" 
                )
              )
            end
            )
          end,
        'name', sj."name",
        'timetable',
          case
            when s."classroomId" is null and s."teacherId" is null then null
            else json_build_object(
              'teacher',
                case 
                  when s."teacherId" is null then null
                  else json_build_object(
                    'id', tr."idFromDiary",
                    'firstName', tr."firstName",
                    'lastName', tr."lastName",
                    'middleName', tr."middleName" 
                  ) 
                end,
              'classroom',
                case 
                  when s."classroomId" is null then null
                  else json_build_object(
                    'id', c."idFromDiary",
                    'building', c.building,
                    'name', c.name
                  ) 
                end
            )
          end
      )
    )
) as "data"
from schedule s
left join "scheduleSubgroup" ss on ss."scheduleId" = s.id
left join gradebook g on g.id = s."gradebookId"
left join "lessonType" lt on g."lessonTypeId"  = lt.id
left join subject sj on s."subjectId" = sj.id
left join task t on t."gradebookId" = g.id
left join "taskType" tt on tt.id = t."taskTypeId"
left join classroom c on s."classroomId" = c.id
left join teacher tr on s."teacherId" = tr.id
left join required r on r."taskId" = t.id
where ss."scheduleId" is null or ss."diaryUserId" = ${user.id}
group by "date"
having "date" between '${startDate}' and '${endDate}'
order by "date"
    `,
    {
      raw: true
    }
  )

  const days =
    // TODO: fix it
    (formatSchedules?.[0] as { data: any }[]).map(
      (schedule) => schedule.data
    ) ?? []
  const formatDays = []

  for (
    const day = new Date(startDate);
    day <= new Date(endDate);
    day.setDate(day.getDate() + 1)
  ) {
    let isSearch = false
    for (const dayDB of days) {
      if (dayDB.date === day.toISOString().split('T')[0]) {
        // Сортируем по дате начала пары
        // TODO: fix it
        dayDB.lessons.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
        formatDays.push(dayDB)
        isSearch = true
        break
      }
    }
    if (!isSearch) {
      formatDays.push({
        date: day.toISOString().split('T')[0],
        lessons: []
      })
    }
  }

  // TODO: fix it
  return formatDays as Day[]
}
